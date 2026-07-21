export const TRY_DRAFT_KEY = "tc-try-draft";

export function saveTryDraft(text: string) {
  if (typeof window === "undefined") return;
  const trimmed = text.trim();
  if (!trimmed) {
    sessionStorage.removeItem(TRY_DRAFT_KEY);
    return;
  }
  sessionStorage.setItem(TRY_DRAFT_KEY, trimmed);
}

export function consumeTryDraft(): string | null {
  if (typeof window === "undefined") return null;
  const value = sessionStorage.getItem(TRY_DRAFT_KEY);
  sessionStorage.removeItem(TRY_DRAFT_KEY);
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
