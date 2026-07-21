"use client";

import * as React from "react";
import { Extension } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import type { Editor } from "@tiptap/react";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { cn } from "@/shared/lib/cn";
import type { LintMatch } from "@/features/editor/types";
import {
  createLintPlugin,
  getDocPlainText,
  refreshLintDecorations,
} from "@/features/editor/extensions/lint-decorations";
import {
  useLiveCheck,
  type CheckLanguage,
} from "@/features/editor/hooks/use-live-check";
import { CorrectionThread } from "@/features/editor/components/correction-thread";
import { DocumentMetaCards } from "@/features/editor/components/document-meta-cards";
import { EditorToolDock } from "@/features/editor/components/editor-tool-dock";
import { ErrorTooltip } from "@/features/editor/components/error-tooltip";

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

function findMatchAtOffset(
  matches: LintMatch[],
  offset: number
): LintMatch | null {
  return (
    matches.find((m) => offset >= m.offset && offset < m.offset + m.length) ??
    null
  );
}

function posToOffset(doc: ProseMirrorNode, targetPos: number): number {
  let counted = 0;
  let found = false;

  doc.descendants((node, pos) => {
    if (found) return false;
    if (!node.isText || !node.text) return true;

    const endPos = pos + node.text.length;
    if (targetPos >= pos && targetPos <= endPos) {
      counted += targetPos - pos;
      found = true;
      return false;
    }
    counted += node.text.length;
    return true;
  });

  return counted;
}

export interface EditorSceneProps {
  className?: string;
  hideToolDock?: boolean;
}

export function EditorScene({ className, hideToolDock }: EditorSceneProps) {
  const [language, setLanguage] = React.useState<CheckLanguage>("fr");
  const [plainText, setPlainText] = React.useState("");
  const [activeMatchId, setActiveMatchId] = React.useState<string | null>(null);
  const [ignoredIds, setIgnoredIds] = React.useState<Set<string>>(
    () => new Set()
  );
  const [tooltipPos, setTooltipPos] = React.useState<{
    top: number;
    left: number;
  } | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const matchesRef = React.useRef<LintMatch[]>([]);
  const editorSurfaceRef = React.useRef<HTMLDivElement>(null);

  const { matches, isChecking, error, checkNow } = useLiveCheck({
    text: plainText,
    language,
  });

  const visibleMatches = React.useMemo(
    () => matches.filter((m) => !ignoredIds.has(m.id)),
    [matches, ignoredIds]
  );

  matchesRef.current = visibleMatches;

  const activeMatch =
    visibleMatches.find((m) => m.id === activeMatchId) ?? null;

  const clearSelection = React.useCallback(() => {
    setActiveMatchId(null);
    setTooltipPos(null);
    setSheetOpen(false);
  }, []);

  const applyReplacement = React.useCallback(
    (ed: Editor, match: LintMatch, replacement: string) => {
      const doc = ed.state.doc;
      const from = offsetToPos(doc, match.offset);
      const to = offsetToPos(doc, match.offset + match.length);
      if (from === null || to === null || to < from) return;

      ed.chain().focus().insertContentAt({ from, to }, replacement).run();

      setIgnoredIds((prev) => new Set(prev).add(match.id));
      clearSelection();
    },
    [clearSelection]
  );

  const lintExtension = React.useMemo(
    () =>
      Extension.create({
        name: "lintDecorations",
        addProseMirrorPlugins() {
          return [createLintPlugin(() => matchesRef.current)];
        },
      }),
    []
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder:
          "Écrivez votre texte… les suggestions apparaissent en direct.",
      }),
      lintExtension,
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none min-h-[280px] px-1 py-2 focus:outline-none",
      },
      handleClick(view, pos, event) {
        const offset = posToOffset(view.state.doc, pos);
        const match = findMatchAtOffset(matchesRef.current, offset);
        if (!match) {
          clearSelection();
          return false;
        }

        setActiveMatchId(match.id);

        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
        if (isDesktop) {
          const coords = view.coordsAtPos(pos);
          const surface = editorSurfaceRef.current?.getBoundingClientRect();
          if (surface) {
            setTooltipPos({
              top: coords.bottom - surface.top + 8,
              left: Math.min(
                Math.max(0, coords.left - surface.left),
                surface.width - 320
              ),
            });
          }
          setSheetOpen(false);
        } else {
          setTooltipPos(null);
          setSheetOpen(true);
        }

        event.preventDefault();
        return true;
      },
      handleKeyDown(view, event) {
        if (event.key !== "Tab" || event.shiftKey) return false;

        const { from } = view.state.selection;
        const offset = posToOffset(view.state.doc, from);
        const match = findMatchAtOffset(matchesRef.current, offset);
        if (!match?.replacements[0]) return false;

        event.preventDefault();
        const fromPos = offsetToPos(view.state.doc, match.offset);
        const toPos = offsetToPos(
          view.state.doc,
          match.offset + match.length
        );
        if (fromPos === null || toPos === null) return false;

        view.dispatch(
          view.state.tr.insertText(match.replacements[0], fromPos, toPos)
        );
        setIgnoredIds((prev) => new Set(prev).add(match.id));
        clearSelection();
        return true;
      },
    },
    onUpdate: ({ editor: ed }) => {
      setPlainText(getDocPlainText(ed.state.doc));
    },
    onCreate: ({ editor: ed }) => {
      setPlainText(getDocPlainText(ed.state.doc));
    },
  });

  React.useEffect(() => {
    if (!editor) return;
    refreshLintDecorations(editor.view.dispatch, editor.state);
  }, [editor, visibleMatches]);

  React.useEffect(() => {
    setIgnoredIds(new Set());
  }, [language]);

  const handleApply = React.useCallback(
    (match: LintMatch, replacement: string) => {
      if (!editor) return;
      applyReplacement(editor, match, replacement);
    },
    [editor, applyReplacement]
  );

  const handleIgnore = React.useCallback(
    (match: LintMatch) => {
      setIgnoredIds((prev) => new Set(prev).add(match.id));
      if (activeMatchId === match.id) clearSelection();
    },
    [activeMatchId, clearSelection]
  );

  const handleSelectMatch = React.useCallback(
    (match: LintMatch) => {
      setActiveMatchId(match.id);
      if (!editor) return;

      const from = offsetToPos(editor.state.doc, match.offset);
      if (from === null) return;

      editor.chain().focus().setTextSelection(from).run();

      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (isDesktop) {
        const coords = editor.view.coordsAtPos(from);
        const surface = editorSurfaceRef.current?.getBoundingClientRect();
        if (surface) {
          setTooltipPos({
            top: coords.bottom - surface.top + 8,
            left: Math.min(
              Math.max(0, coords.left - surface.left),
              surface.width - 320
            ),
          });
        }
      } else {
        setSheetOpen(true);
      }
    },
    [editor]
  );

  return (
    <div className={cn("flex min-h-0 flex-col gap-4", className)}>
      {!hideToolDock ? (
        <EditorToolDock
          editor={editor}
          language={language}
          onLanguageChange={setLanguage}
          onCheck={checkNow}
          isChecking={isChecking}
        />
      ) : null}

      <DocumentMetaCards matches={visibleMatches} activeMatch={activeMatch} />

      <div className="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row">
        <div className="relative min-h-0 min-w-0 flex-1">
          <div
            ref={editorSurfaceRef}
            className="relative rounded-[14px] border border-ds-border/60 bg-ds-elevated p-4 shadow-ds-md lg:p-6"
          >
            <div className="mb-2 flex items-center justify-between gap-2 text-xs text-ds-muted">
              <span>
                Langue :{" "}
                <strong className="text-ds-ink">
                  {language === "fr" ? "Français" : "English (US)"}
                </strong>
              </span>
              <span>
                {isChecking
                  ? "Analyse…"
                  : error
                    ? "Erreur de vérification"
                    : `${visibleMatches.length} suggestion${visibleMatches.length === 1 ? "" : "s"}`}
              </span>
            </div>

            <EditorContent editor={editor} />

            {error ? (
              <p className="mt-3 text-xs text-ds-coral" role="alert">
                {error}
              </p>
            ) : null}

            {activeMatch && tooltipPos ? (
              <ErrorTooltip
                match={activeMatch}
                className="absolute hidden lg:block"
                style={{ top: tooltipPos.top, left: tooltipPos.left }}
                onApply={(replacement) =>
                  handleApply(activeMatch, replacement)
                }
                onIgnore={() => handleIgnore(activeMatch)}
                onClose={clearSelection}
              />
            ) : null}
          </div>

          {sheetOpen && activeMatch ? (
            <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ds-border bg-ds-elevated p-4 shadow-ds-lg safe-pb lg:hidden">
              <ErrorTooltip
                match={activeMatch}
                className="w-full border-0 p-0 shadow-none"
                onApply={(replacement) =>
                  handleApply(activeMatch, replacement)
                }
                onIgnore={() => handleIgnore(activeMatch)}
                onClose={clearSelection}
              />
            </div>
          ) : null}
        </div>

        <aside className="min-h-[220px] w-full shrink-0 xl:w-[320px] xl:min-h-0">
          <div className="h-full rounded-[14px] border border-ds-border/60 bg-ds-elevated p-4 shadow-ds-md">
            <CorrectionThread
              matches={visibleMatches}
              activeId={activeMatchId}
              ignoredIds={ignoredIds}
              onSelect={handleSelectMatch}
              onApply={handleApply}
              onIgnore={handleIgnore}
              isChecking={isChecking}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
