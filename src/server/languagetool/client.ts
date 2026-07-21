import type { LintMatch } from "@/shared/types/database";
import { mapLanguageToolCategory } from "./map-category";
import { pickReplacement } from "@/shared/lib/pick-replacement";

const DEFAULT_LT_URL = "http://127.0.0.1:8010";

interface LanguageToolReplacement {
  value: string;
}

interface LanguageToolMatch {
  message: string;
  shortMessage?: string;
  offset: number;
  length: number;
  replacements?: LanguageToolReplacement[];
  context?: {
    text: string;
    offset: number;
    length: number;
  };
  rule?: {
    id?: string;
    issueType?: string;
    category?: {
      id?: string;
      name?: string;
    };
  };
}

interface LanguageToolResponse {
  matches?: LanguageToolMatch[];
}

export async function checkText(
  text: string,
  language: "fr" | "en-US"
): Promise<LintMatch[]> {
  const baseUrl = process.env.LANGUAGETOOL_URL || DEFAULT_LT_URL;
  const url = `${baseUrl.replace(/\/$/, "")}/v2/check`;

  // Prefer fr-FR when available; LanguageTool accepts "fr"
  const body = new URLSearchParams({
    language,
    text,
    level: "default",
  });

  // Reduce noisy / low-value rules that cause bad auto-corrections
  body.set(
    "disabledRules",
    [
      "WHITESPACE_RULE",
      "FRENCH_WHITESPACE",
      "HUNSPELL_RULE_REJECTED",
    ].join(",")
  );

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `LanguageTool check failed (${response.status}): ${detail || response.statusText}`
    );
  }

  const data = (await response.json()) as LanguageToolResponse;
  const matches = data.matches ?? [];

  return matches
    .map((match, index) => {
      const category = mapLanguageToolCategory({
        categoryId: match.rule?.category?.id,
        categoryName: match.rule?.category?.name,
        issueType: match.rule?.issueType,
        ruleId: match.rule?.id,
      });

      const original = text.slice(match.offset, match.offset + match.length);
      const rawReplacements = (match.replacements ?? [])
        .map((r) => r.value)
        .filter(Boolean)
        .slice(0, 8);

      const preferred = pickReplacement(
        original,
        rawReplacements,
        category,
        match.rule?.id
      );

      const replacements = preferred
        ? [preferred, ...rawReplacements.filter((r) => r !== preferred)]
        : rawReplacements;

      return {
        id: `${match.rule?.id ?? "lt"}-${match.offset}-${index}`,
        offset: match.offset,
        length: match.length,
        message: match.message,
        shortMessage: match.shortMessage || undefined,
        replacements,
        category,
        ruleId: match.rule?.id,
        context: match.context?.text,
      } satisfies LintMatch;
    })
    .filter((m) => m.replacements.length > 0);
}
