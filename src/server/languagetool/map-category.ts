import type { ErrorCategory } from "@/shared/types/database";

interface CategoryInput {
  categoryId?: string | null;
  categoryName?: string | null;
  issueType?: string | null;
  ruleId?: string | null;
}

const SPELLING_HINTS = [
  "typo",
  "misspelling",
  "spelling",
  "orthographe",
  "hunspell",
];

const GRAMMAR_HINTS = [
  "grammar",
  "grammaire",
  "agreement",
  "accord",
  "syntax",
];

const CONJUGATION_HINTS = [
  "conjugation",
  "conjugaison",
  "verb",
  "verbe",
  "tense",
  "temps",
];

const PUNCTUATION_HINTS = [
  "punctuation",
  "ponctuation",
  "whitespace",
  "typographical",
  "comma",
  "quote",
];

const STYLE_HINTS = [
  "style",
  "redundancy",
  "redundant",
  "clarity",
  "register",
  "colloquialism",
];

function haystack(input: CategoryInput): string {
  return [
    input.categoryId,
    input.categoryName,
    input.issueType,
    input.ruleId,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function includesAny(text: string, hints: string[]): boolean {
  return hints.some((hint) => text.includes(hint));
}

export function mapLanguageToolCategory(input: CategoryInput): ErrorCategory {
  const text = haystack(input);

  if (includesAny(text, SPELLING_HINTS) || input.issueType === "misspelling") {
    return "spelling";
  }
  if (includesAny(text, CONJUGATION_HINTS)) {
    return "conjugation";
  }
  if (includesAny(text, PUNCTUATION_HINTS) || input.issueType === "typographical") {
    return "punctuation";
  }
  if (includesAny(text, STYLE_HINTS) || input.issueType === "style") {
    return "style";
  }
  if (includesAny(text, GRAMMAR_HINTS) || input.issueType === "grammar") {
    return "grammar";
  }

  return "grammar";
}
