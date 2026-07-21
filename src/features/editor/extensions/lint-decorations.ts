import {
  Plugin,
  PluginKey,
  type EditorState,
  type Transaction,
} from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import type { ErrorCategory, LintMatch } from "@/features/editor/types";

export const lintPluginKey = new PluginKey("lintDecorations");

const CATEGORY_CLASS: Record<ErrorCategory, string> = {
  spelling: "lint-spelling",
  grammar: "lint-grammar",
  conjugation: "lint-conjugation",
  punctuation: "lint-punctuation",
  style: "lint-style",
};

/** Plain text from the doc — same concatenation used for API offsets. */
export function getDocPlainText(doc: ProseMirrorNode): string {
  return doc.textBetween(0, doc.content.size, "", "");
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

function buildDecorations(
  doc: ProseMirrorNode,
  matches: LintMatch[]
): DecorationSet {
  const decorations = [];

  for (const match of matches) {
    if (match.length <= 0) continue;

    const from = offsetToPos(doc, match.offset);
    const to = offsetToPos(doc, match.offset + match.length);
    if (from === null || to === null || to <= from) continue;

    decorations.push(
      Decoration.inline(from, to, {
        class: CATEGORY_CLASS[match.category] ?? "lint-grammar",
        "data-lint-id": match.id,
        "data-lint-category": match.category,
      })
    );
  }

  return DecorationSet.create(doc, decorations);
}

export function createLintPlugin(getMatches: () => LintMatch[]): Plugin {
  return new Plugin({
    key: lintPluginKey,
    state: {
      init(_, state) {
        return buildDecorations(state.doc, getMatches());
      },
      apply(tr, oldDecorations, _oldState, newState) {
        const refreshed = tr.getMeta(lintPluginKey);
        if (refreshed || tr.docChanged) {
          return buildDecorations(newState.doc, getMatches());
        }
        return oldDecorations.map(tr.mapping, newState.doc);
      },
    },
    props: {
      decorations(state: EditorState) {
        return lintPluginKey.getState(state) as DecorationSet | undefined;
      },
    },
  });
}

/** Force the lint plugin to rebuild decorations (e.g. after matches change). */
export function refreshLintDecorations(
  dispatch: (tr: Transaction) => void,
  state: EditorState
) {
  dispatch(state.tr.setMeta(lintPluginKey, true));
}
