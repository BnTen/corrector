import type { Editor } from "@tiptap/react";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import type { LintMatch } from "@/features/editor/types";
import { pickReplacement } from "@/shared/lib/pick-replacement";

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

function prepareFixes(
  matches: LintMatch[],
  plainText: string
): Array<{ match: LintMatch; replacement: string; original: string }> {
  const fixes: Array<{
    match: LintMatch;
    replacement: string;
    original: string;
  }> = [];

  for (const match of matches) {
    const original = plainText.slice(match.offset, match.offset + match.length);
    if (!original) continue;

    const replacement = pickReplacement(
      original,
      match.replacements,
      match.category,
      match.ruleId
    );
    if (!replacement || replacement === original) continue;

    fixes.push({ match, replacement, original });
  }

  return fixes;
}

/** Apply safe replacements end→start in one transaction. */
export function applyAllReplacements(
  editor: Editor,
  matches: LintMatch[],
  plainText: string
): AppliedCorrection[] {
  const fixes = prepareFixes(matches, plainText);
  if (fixes.length === 0) return [];

  const originalDoc = editor.state.doc;
  const sorted = [...fixes].sort((a, b) => b.match.offset - a.match.offset);
  let tr = editor.state.tr;
  const applied: AppliedCorrection[] = [];

  for (const { match, replacement, original } of sorted) {
    const from = offsetToPos(originalDoc, match.offset);
    const to = offsetToPos(originalDoc, match.offset + match.length);
    if (from === null || to === null || to < from) continue;

    const mappedFrom = tr.mapping.map(from);
    const mappedTo = tr.mapping.map(to);

    tr = tr.insertText(replacement, mappedFrom, mappedTo);
    applied.push({
      id: `${match.id}-${Date.now()}-${match.offset}`,
      original,
      replacement,
      message: match.message,
      category: match.category,
      appliedAt: Date.now(),
    });
  }

  if (applied.length === 0) return [];
  editor.view.dispatch(tr);
  return applied.reverse();
}
