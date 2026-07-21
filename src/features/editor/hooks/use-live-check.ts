"use client";

import * as React from "react";
import type { LintMatch } from "@/features/editor/types";
import {
  getCompletedSentencesBefore,
  getSentenceAt,
  getTypingWordStart,
  remapMatchOffset,
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
  segment: TextSegment
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
      return { ...m, replacements: [picked, ...m.replacements.filter((r) => r !== picked)] };
    })
    .filter((m): m is LintMatch => {
      if (!m) return false;
      if (m.offset + m.length > wordStart) return false;
      if (m.offset < segment.start || m.offset + m.length > segment.end)
        return false;
      return Boolean(m.replacements[0]);
    });
}

/**
 * Hybrid progressive check:
 * 1) Instant SMS dictionary (local)
 * 2) LanguageTool on sentence / short paragraph with smart replacement picking
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

  const checkNow = React.useCallback(() => {
    setTick((n) => n + 1);
  }, []);

  // Instant SMS pass (no network)
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

  // LanguageTool progressive pass
  React.useEffect(() => {
    if (!enabled) return;

    if (!text.trim()) {
      abortRef.current?.abort();
      setIsChecking(false);
      setError(null);
      setLastSegment(null);
      return;
    }

    const activePreview = getSentenceAt(text, caretOffset);
    const justFinished = /[.!?…]\s*$/.test(activePreview.text.trimEnd());
    // LT is slower: wait for pause or sentence end (SMS already handled above)
    const wait = justFinished ? 120 : Math.max(debounceMs, 380);

    const timer = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const active = getSentenceAt(text, caretOffset);
      const completed = getCompletedSentencesBefore(text, caretOffset);
      const lastCompleted = completed[completed.length - 1] ?? null;

      // Prefer a bit of context: previous sentence + active (better LT accuracy)
      let target = active;
      if (lastCompleted && lastCompleted.end === active.start) {
        target = {
          start: lastCompleted.start,
          end: active.end,
          text: text.slice(lastCompleted.start, active.end),
        };
      }

      if (lastCompleted) {
        const key = `${lastCompleted.start}:${lastCompleted.text}`;
        if (!checkedCompletedRef.current.has(key) && lastCompleted.text.trim().length >= 3) {
          // Prioritize unchecked completed sentence alone first (faster + progressive)
          target = lastCompleted;
          checkedCompletedRef.current.add(key);
        }
      }

      if (target.text.length > 500) {
        const sliceStart = Math.max(0, target.text.length - 500);
        target = {
          start: target.start + sliceStart,
          end: target.end,
          text: target.text.slice(sliceStart),
        };
      }

      if (!target.text.trim()) return;

      setIsChecking(true);
      setError(null);
      setLastSegment(target);

      try {
        const raw = await fetchMatches(target.text, language, controller.signal);
        if (controller.signal.aborted) return;

        const wordStart = getTypingWordStart(text, caretOffset);
        const remapped = raw.map((m) => remapMatchOffset(m, target.start));
        const ltMatches = filterAutoMatches(remapped, text, wordStart, target);

        // Merge: SMS hits (recompute) + LT, prefer SMS on overlapping offsets
        const sms =
          language === "fr"
            ? smsHitsToMatches(findSmsHits(text, { wordStart }))
            : [];

        const occupied = new Set(
          sms.flatMap((m) =>
            Array.from({ length: m.length }, (_, i) => m.offset + i)
          )
        );

        const ltOnly = ltMatches.filter((m) => {
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
