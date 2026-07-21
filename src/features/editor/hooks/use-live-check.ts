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

export type CheckLanguage = "fr" | "en-US";

export interface UseLiveCheckOptions {
  text: string;
  /** Plain-text caret offset for progressive scoping */
  caretOffset: number;
  language: CheckLanguage;
  /** Debounce for the active (current) sentence — default 200ms */
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

/**
 * Progressive live check:
 * - Checks the active sentence quickly while typing
 * - Also quietly re-checks the last completed sentence for catch-up
 * - Never blocks on the full document
 */
export function useLiveCheck({
  text,
  caretOffset,
  language,
  debounceMs = 200,
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

  React.useEffect(() => {
    if (!enabled) return;

    if (!text.trim()) {
      abortRef.current?.abort();
      setMatches([]);
      setCheckedText("");
      setIsChecking(false);
      setError(null);
      setLastSegment(null);
      return;
    }

    const activePreview = getSentenceAt(text, caretOffset);
    const justFinished = /[.!?…]\s*$/.test(activePreview.text.trimEnd());
    const wait = justFinished ? 90 : debounceMs;

    const timer = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const active = getSentenceAt(text, caretOffset);
      const completed = getCompletedSentencesBefore(text, caretOffset);
      const lastCompleted = completed[completed.length - 1] ?? null;

      // Prefer catch-up on a completed sentence not yet checked this session
      let target = active;
      if (lastCompleted) {
        const key = `${lastCompleted.start}:${lastCompleted.end}:${lastCompleted.text}`;
        if (
          !checkedCompletedRef.current.has(key) &&
          lastCompleted.text.trim().length >= 3
        ) {
          target = lastCompleted;
          checkedCompletedRef.current.add(key);
        }
      }

      // Cap segment size for speed (LanguageTool latency scales with length)
      if (target.text.length > 600) {
        const sliceStart = Math.max(0, target.text.length - 600);
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
        const raw = await fetchMatches(
          target.text,
          language,
          controller.signal
        );
        if (controller.signal.aborted) return;

        const wordStart = getTypingWordStart(text, caretOffset);
        const remapped = raw
          .map((m) => remapMatchOffset(m, target.start))
          .filter((m) => {
            // Don't touch the word currently being typed
            if (m.offset + m.length > wordStart) return false;
            // Stay inside segment
            if (m.offset < target.start) return false;
            if (m.offset + m.length > target.end) return false;
            return Boolean(m.replacements[0]);
          });

        setMatches(remapped);
        setCheckedText(text);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Unable to check text");
        setMatches([]);
        setCheckedText("");
      } finally {
        if (!controller.signal.aborted) setIsChecking(false);
      }
    }, wait);

    return () => {
      window.clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [text, caretOffset, language, debounceMs, enabled, tick]);

  // Reset completed cache when language changes
  React.useEffect(() => {
    checkedCompletedRef.current = new Set();
  }, [language]);

  return { matches, checkedText, isChecking, error, checkNow, lastSegment };
}
