import { dictionaries, type MessageTree } from "@/shared/i18n/messages";
import type { UiLocale } from "@/shared/i18n/config";

function getPath(tree: MessageTree, path: string): string | undefined {
  const parts = path.split(".");
  let node: string | MessageTree | undefined = tree;
  for (const part of parts) {
    if (!node || typeof node === "string") return undefined;
    node = node[part];
  }
  return typeof node === "string" ? node : undefined;
}

export function translate(
  locale: UiLocale,
  key: string,
  vars?: Record<string, string | number>
): string {
  const primary = getPath(dictionaries[locale] as MessageTree, key);
  const fallback = getPath(dictionaries.en as MessageTree, key);
  let text = primary ?? fallback ?? key;

  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.split(`{${name}}`).join(String(value));
    }
  }

  return text;
}
