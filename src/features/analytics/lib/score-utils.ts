import type { ErrorCategory } from "@/shared/types/database";

export interface AccuracyInput {
  totalErrors: number;
  acceptedErrors?: number;
  totalWords?: number;
}

export function computeAccuracy(input: AccuracyInput): number {
  const { totalErrors, acceptedErrors = 0, totalWords = 0 } = input;

  if (totalWords > 0) {
    const ratio = 1 - totalErrors / Math.max(totalWords, 1);
    return Math.max(0, Math.min(100, Math.round(ratio * 1000) / 10));
  }

  if (totalErrors <= 0) return 100;

  const corrected = Math.min(acceptedErrors, totalErrors);
  const ratio = corrected / totalErrors;
  return Math.max(0, Math.min(100, Math.round(ratio * 1000) / 10));
}

export function categoryBreakdown(
  categories: Record<string, number> | undefined | null
): Array<{ category: ErrorCategory | string; count: number; share: number }> {
  const entries = Object.entries(categories ?? {}).filter(
    ([, count]) => typeof count === "number" && count > 0
  );
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  return entries
    .map(([category, count]) => ({
      category,
      count,
      share: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
