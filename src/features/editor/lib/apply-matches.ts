import type { Editor } from "@tiptap/react";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import type { LintMatch } from "@/features/editor/types";

export interface AppliedCorrection {
  id: string;
  original: string;
  replacement: string;
  message: string;
  category: LintMatch["category"];
  appliedAt: number;
}

function offsetToPos(doc: ProseMirrorNode, offset: number): number | null {
  let counted = 0;
  let result: number | null = null;

  doc.descendants((node, pos) => {
    if (result !== null) return false;
    if (!node.isText || !node.text) return true;

    const end = counted + node.text.length;
    if (offset >= counted && offset <= end) {
      result = pos + (offset - counted);
      return false;
    }
    counted = end;
    return true;
  });

  return result;
}

/** Apply first replacement for each match (end → start) in one transaction. */
export function applyAllReplacements(
  editor: Editor,
  matches: LintMatch[],
  plainText: string
): AppliedCorrection[] {
  const withFix = matches.filter((m) => m.replacements[0]);
  if (withFix.length === 0) return [];

  const originalDoc = editor.state.doc;
  const sorted = [...withFix].sort((a, b) => b.offset - a.offset);
  let tr = editor.state.tr;
  const applied: AppliedCorrection[] = [];

  for (const match of sorted) {
    const replacement = match.replacements[0];
    if (!replacement) continue;

    const from = offsetToPos(originalDoc, match.offset);
    const to = offsetToPos(originalDoc, match.offset + match.length);
    if (from === null || to === null || to < from) continue;

    const mappedFrom = tr.mapping.map(from);
    const mappedTo = tr.mapping.map(to);
    const original =
      plainText.slice(match.offset, match.offset + match.length) ||
      originalDoc.textBetween(from, to, "");

    if (original === replacement) continue;

    tr = tr.insertText(replacement, mappedFrom, mappedTo);
    applied.push({
      id: `${match.id}-${Date.now()}`,
      original,
      replacement,
      message: match.message,
      category: match.category,
      appliedAt: Date.now(),
    });
  }

  if (applied.length === 0) return [];

  // Keep cursor near the edit end when possible
  editor.view.dispatch(tr.scrollIntoView());
  return applied.reverse();
}
