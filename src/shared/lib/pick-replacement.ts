import type { ErrorCategory } from "@/shared/types/database";

function stripDiacritics(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function norm(value: string): string {
  return stripDiacritics(value).toLowerCase().replace(/\s+/g, " ").trim();
}

/** True if token looks like informal/abbreviated French. */
export function looksInformal(token: string): boolean {
  const t = token.toLowerCase();
  if (t.length <= 2) return true;
  if (/^[bcdfghjklmnpqrstvwxz]{3,}$/i.test(t)) return true; // consonant soup
  if (/j[ée]|chui|jsui|pck|pcq|ptet|koe|kwa|msg/i.test(t)) return true;
  if (!/[aeiouyàâäéèêëïîôùûü]/i.test(t) && t.length >= 3) return true;
  return false;
}

/**
 * Pick the safest LanguageTool replacement, or null to skip auto-apply.
 * Blindly taking replacements[0] causes errors like ptetre → prêtre.
 */
export function pickReplacement(
  original: string,
  replacements: string[],
  category: ErrorCategory,
  ruleId?: string
): string | null {
  const unique = Array.from(
    new Set(replacements.map((r) => r.trim()).filter(Boolean))
  );
  if (unique.length === 0) return null;

  // Never auto-apply pure style / synonym suggestions
  if (category === "style") return null;

  // Skip no-op / whitespace-only / same ignoring accents
  const filtered = unique.filter((r) => {
    if (r === original) return false;
    if (norm(r) === norm(original) && r.replace(/\s/g, "") === original.replace(/\s/g, ""))
      return false;
    // Avoid À → À type thrash (unicode lookalikes)
    if (norm(r) === norm(original) && Math.abs(r.length - original.length) === 0) {
      // allow real casing fixes: je → Je
      if (r.toLowerCase() === original.toLowerCase() && r !== original) return true;
      return false;
    }
    return true;
  });

  if (filtered.length === 0) return null;

  const informal = looksInformal(original);

  // Prefer multi-word / hyphen expansions for abbreviations (peut-être, parce que…)
  if (informal || original.length <= 6) {
    const expansions = filtered
      .filter((r) => r.length >= original.length)
      .sort((a, b) => {
        const score = (s: string) =>
          (s.includes("-") ? 4 : 0) +
          (s.includes(" ") ? 5 : 0) +
          (s.includes("'") ? 2 : 0) +
          Math.min(s.length, 24) * 0.15;
        return score(b) - score(a);
      });
    if (expansions[0] && expansions[0].length > original.length) {
      return expansions[0];
    }
  }

  // Prefer casing-only fixes when identical letters
  const casing = filtered.find(
    (r) => r.toLowerCase() === original.toLowerCase() && r !== original
  );
  if (casing) return casing;

  // Prefer hyphenation / apostrophe grammar fixes
  const punctFix = filtered.find(
    (r) =>
      norm(r.replace(/[-'\s]/g, "")) === norm(original.replace(/[-'\s]/g, "")) &&
      r !== original
  );
  if (punctFix) return punctFix;

  // Known dangerous first suggestions — skip if better candidate exists
  const dangerous = new Set(["prêtre", "fait", "mai", "cote"]);
  const safe = filtered.find((r) => !dangerous.has(r.toLowerCase()));
  if (filtered[0] && dangerous.has(filtered[0].toLowerCase()) && safe) {
    return safe;
  }

  // Skip very aggressive rewrites (length blows up > 3x on short tokens) unless expansion preferred above
  const first = filtered[0]!;
  if (original.length <= 4 && first.length > original.length * 3 && !informal) {
    return null;
  }

  // Skip some noisy LT rules from auto
  if (ruleId && /WHITESPACE|DUPLICATE|CASING_ONLY/i.test(ruleId) === false) {
    // ok
  }

  return first;
}
