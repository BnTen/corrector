import type { ErrorCategory } from "@/features/editor/types";

export const CATEGORY_LABELS: Record<ErrorCategory, string> = {
  spelling: "Orthographe",
  grammar: "Grammaire",
  conjugation: "Conjugaison",
  punctuation: "Ponctuation",
  style: "Style",
};

export const CATEGORY_TONES: Record<
  ErrorCategory,
  "coral" | "pink" | "lavender" | "yellow" | "sky"
> = {
  spelling: "coral",
  grammar: "pink",
  conjugation: "lavender",
  punctuation: "yellow",
  style: "sky",
};

export const ALL_CATEGORIES: ErrorCategory[] = [
  "spelling",
  "grammar",
  "conjugation",
  "punctuation",
  "style",
];
