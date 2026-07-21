"use client";

import * as React from "react";
import type { LintMatch } from "@/features/editor/types";
import {
  chunkSegments,
  getCompletedSentencesBefore,
  getSentenceAt,
  getTypingWordStart,
  remapMatchOffset,
  segmentKey,
  type TextSegment,
} from "@/features/editor/lib/text-segments";
import {
  findSmsHits,
  smsHitsToMatches,
} from "@/features/editor/lib/fr-sms-normalizer";
import { pickReplacement } from "@/shared/lib/pick-replacement";

export type CheckLanguage = "fr" | "en-US";

export interface UseLiveCheckOptions {
  text: string;
  caretOffset: number;
  language: CheckLanguage;
  debounceMs?: number;
  enabled?: boolean;
}

export interface UseLiveCheckResult {
  matches: LintMatch[];
  checkedText: string;
  isChecking: boolean;
  error: string | null;
  checkNow: () => void;
  lastSegment: TextSegment | null;
}

async function fetchMatches(
  text: string,
  language: CheckLanguage,
  signal: AbortSignal
): Promise<LintMatch[]> {
  const response = await fetch("/api/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
    signal,
  });

  const data = (await response.json().catch(() => null)) as {
    matches?: LintMatch[];
    error?: string;
  } | null;

  if (!response.ok) {
    throw new Error(data?.error || `Check failed (${response.status})`);
  }

  return data?.matches ?? [];
}

function filterAutoMatches(
  matches: LintMatch[],
  fullText: string,
  wordStart: number,
  rangeStart: number,
  rangeEnd: number
): LintMatch[] {
  return matches
    .map((m) => {
      const original = fullText.slice(m.offset, m.offset + m.length);
      const picked = pickReplacement(
        original,
        m.replacements,
        m.category,
        m.ruleId
      );
      if (!picked) return null;
      return {
        ...m,
        replacements: [picked, ...m.replacements.filter((r) => r !== picked)],
      };
    })
    .filter((m): m is LintMatch => {
      if (!m) return false;
      if (m.offset + m.length > wordStart) return false;
      if (m.offset < rangeStart || m.offset + m.length > rangeEnd) return false;
      return Boolean(m.replacements[0]);
    });
}

function pruneCheckedKeys(
  checked: Set<string>,
  completed: TextSegment[]
): void {
  const live = new Set(completed.map(segmentKey));
  for (const key of Array.from(checked)) {
    if (!live.has(key)) checked.delete(key);
  }
}

/**
 * Hybrid progressive check:
 * 1) Instant SMS dictionary (local, full document)
 * 2) LanguageTool catch-up on ALL completed sentences (chunked), then active sentence
 */
export function useLiveCheck({
  text,
  caretOffset,
  language,
  debounceMs = 220,
  enabled = true,
}: UseLiveCheckOptions): UseLiveCheckResult {
  const [matches, setMatches] = React.useState<LintMatch[]>([]);
  const [checkedText, setCheckedText] = React.useState("");
  const [isChecking, setIsChecking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [tick, setTick] = React.useState(0);
  const [lastSegment, setLastSegment] = React.useState<TextSegment | null>(
    null
  );

  const abortRef = React.useRef<AbortController | null>(null);
  const checkedCompletedRef = React.useRef<Set<string>>(new Set());
  const prevTextLenRef = React.useRef(0);

  const checkNow = React.useCallback(() => {
    setTick((n) => n + 1);
  }, []);

  // Instant SMS pass (no network) — full document
  React.useEffect(() => {
    if (!enabled || language !== "fr") return;
    if (!text.trim()) {
      setMatches([]);
      setCheckedText("");
      return;
    }

    const wordStart = getTypingWordStart(text, caretOffset);
    const smsMatches = smsHitsToMatches(findSmsHits(text, { wordStart }));

    if (smsMatches.length > 0) {
      setMatches(smsMatches);
      setCheckedText(text);
    }
  }, [text, caretOffset, language, enabled]);

  // LanguageTool: catch-up all completed sentences + active
  React.useEffect(() => {
    if (!enabled) return;

    if (!text.trim()) {
      abortRef.current?.abort();
      setIsChecking(false);
      setError(null);
      setLastSegment(null);
      checkedCompletedRef.current = new Set();
      prevTextLenRef.current = 0;
      return;
    }

    // Large paste / replace → re-scan everything
    const lenDelta = text.length - prevTextLenRef.current;
    if (lenDelta > 120 || lenDelta < -80) {
      checkedCompletedRef.current = new Set();
    }
    prevTextLenRef.current = text.length;

    const activePreview = getSentenceAt(text, caretOffset);
    const justFinished = /[.!?…]\s*$/.test(activePreview.text.trimEnd());
    const completedPreview = getCompletedSentencesBefore(text, caretOffset);
    pruneCheckedKeys(checkedCompletedRef.current, completedPreview);
    const uncheckedCount = completedPreview.filter(
      (s) =>
        s.text.trim().length >= 3 &&
        !checkedCompletedRef.current.has(segmentKey(s))
    ).length;

    // Faster when finishing a sentence or catching up after paste
    const wait =
      uncheckedCount > 1
        ? 80
        : justFinished
          ? 120
          : Math.max(debounceMs, 380);

    const timer = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const active = getSentenceAt(text, caretOffset);
      const completed = getCompletedSentencesBefore(text, caretOffset);
      pruneCheckedKeys(checkedCompletedRef.current, completed);

      const unchecked = completed.filter(
        (s) =>
          s.text.trim().length >= 3 &&
          !checkedCompletedRef.current.has(segmentKey(s))
      );

      const chunks = chunkSegments(text, unchecked);
      const wordStart = getTypingWordStart(text, caretOffset);
      const collected: LintMatch[] = [];

      // Always include range covering catch-up + a bit of active context
      let rangeStart = unchecked[0]?.start ?? active.start;
      let rangeEnd = unchecked.length
        ? unchecked[unchecked.length - 1]!.end
        : active.end;

      setIsChecking(true);
      setError(null);

      try {
        for (const chunk of chunks) {
          if (controller.signal.aborted) return;
          setLastSegment(chunk);

          const raw = await fetchMatches(
            chunk.text,
            language,
            controller.signal
          );
          if (controller.signal.aborted) return;

          const remapped = raw.map((m) => remapMatchOffset(m, chunk.start));
          collected.push(
            ...filterAutoMatches(
              remapped,
              text,
              wordStart,
              chunk.start,
              chunk.end
            )
          );

          // Mark every completed sentence covered by this chunk
          for (const seg of unchecked) {
            if (seg.start >= chunk.start && seg.end <= chunk.end) {
              checkedCompletedRef.current.add(segmentKey(seg));
            }
          }
        }

        // Active sentence / leftover span (incl. long paste without punctuation)
        const activeNeedsCheck =
          active.text.trim().length >= 3 &&
          (!unchecked.length ||
            active.end > rangeEnd ||
            active.start >= rangeEnd);

        if (activeNeedsCheck && !controller.signal.aborted) {
          let target = active;
          const lastCompleted = completed[completed.length - 1] ?? null;
          // Only glue previous sentence when we did not already catch it up
          if (
            lastCompleted &&
            lastCompleted.end === active.start &&
            unchecked.length === 0
          ) {
            target = {
              start: lastCompleted.start,
              end: active.end,
              text: text.slice(lastCompleted.start, active.end),
            };
          }

          const activeChunks = chunkSegments(text, [target]);
          for (const chunk of activeChunks) {
            if (controller.signal.aborted) return;
            setLastSegment(chunk);
            rangeStart = Math.min(rangeStart, chunk.start);
            rangeEnd = Math.max(rangeEnd, chunk.end);

            const raw = await fetchMatches(
              chunk.text,
              language,
              controller.signal
            );
            if (controller.signal.aborted) return;

            const remapped = raw.map((m) =>
              remapMatchOffset(m, chunk.start)
            );
            collected.push(
              ...filterAutoMatches(
                remapped,
                text,
                wordStart,
                chunk.start,
                chunk.end
              )
            );
          }
        }

        if (controller.signal.aborted) return;

        const sms =
          language === "fr"
            ? smsHitsToMatches(findSmsHits(text, { wordStart }))
            : [];

        const occupied = new Set(
          sms.flatMap((m) =>
            Array.from({ length: m.length }, (_, i) => m.offset + i)
          )
        );

        // Dedupe LT by offset+length
        const seen = new Set<string>();
        const ltOnly = collected.filter((m) => {
          const id = `${m.offset}:${m.length}:${m.replacements[0]}`;
          if (seen.has(id)) return false;
          seen.add(id);
          for (let i = 0; i < m.length; i++) {
            if (occupied.has(m.offset + i)) return false;
          }
          return true;
        });

        setMatches([...sms, ...ltOnly]);
        setCheckedText(text);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Unable to check text");
      } finally {
        if (!controller.signal.aborted) setIsChecking(false);
      }
    }, wait);

    return () => {
      window.clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [text, caretOffset, language, debounceMs, enabled, tick]);

  React.useEffect(() => {
    checkedCompletedRef.current = new Set();
  }, [language]);

  return { matches, checkedText, isChecking, error, checkNow, lastSegment };
}
