"use client";

import * as React from "react";
import type { LintMatch } from "@/features/editor/types";

export type CheckLanguage = "fr" | "en-US";

export interface UseLiveCheckOptions {
  text: string;
  language: CheckLanguage;
  debounceMs?: number;
  enabled?: boolean;
}

export interface UseLiveCheckResult {
  matches: LintMatch[];
  isChecking: boolean;
  error: string | null;
  checkNow: () => void;
}

export function useLiveCheck({
  text,
  language,
  debounceMs = 700,
  enabled = true,
}: UseLiveCheckOptions): UseLiveCheckResult {
  const [matches, setMatches] = React.useState<LintMatch[]>([]);
  const [isChecking, setIsChecking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [tick, setTick] = React.useState(0);

  const abortRef = React.useRef<AbortController | null>(null);

  const checkNow = React.useCallback(() => {
    setTick((n) => n + 1);
  }, []);

  React.useEffect(() => {
    if (!enabled) return;

    const trimmed = text.trim();
    if (!trimmed) {
      abortRef.current?.abort();
      setMatches([]);
      setIsChecking(false);
      setError(null);
      return;
    }

    const timer = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsChecking(true);
      setError(null);

      try {
        const response = await fetch("/api/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, language }),
          signal: controller.signal,
        });

        const data = (await response.json().catch(() => null)) as {
          matches?: LintMatch[];
          error?: string;
        } | null;

        if (!response.ok) {
          throw new Error(data?.error || `Check failed (${response.status})`);
        }

        if (!controller.signal.aborted) {
          setMatches(data?.matches ?? []);
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        const message =
          err instanceof Error ? err.message : "Unable to check text";
        setError(message);
        setMatches([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsChecking(false);
        }
      }
    }, debounceMs);

    return () => {
      window.clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [text, language, debounceMs, enabled, tick]);

  return { matches, isChecking, error, checkNow };
}
