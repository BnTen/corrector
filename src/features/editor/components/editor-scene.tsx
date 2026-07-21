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
import { AutoCorrectionMark } from "@/features/editor/extensions/auto-correction-mark";
import {
  useLiveCheck,
  type CheckLanguage,
} from "@/features/editor/hooks/use-live-check";
import {
  applyAllReplacements,
  type AppliedCorrection,
} from "@/features/editor/lib/apply-matches";
import { CorrectionThread } from "@/features/editor/components/correction-thread";
import { EditorToolDock } from "@/features/editor/components/editor-tool-dock";
import {
  titleFromContent,
  upsertArchive,
} from "@/features/archives/lib/classeur-storage";

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
  onAppliedLogChange?: (log: AppliedCorrection[]) => void;
  onArchiveSaved?: () => void;
  /** External load request from classeur */
  loadContent?: {
    html?: string;
    text: string;
    archiveId?: string;
    nonce?: number;
  } | null;
}

export function EditorScene({
  className,
  hideToolDock,
  onAppliedLogChange,
  onArchiveSaved,
  loadContent,
}: EditorSceneProps) {
  const [language, setLanguage] = React.useState<CheckLanguage>("fr");
  const [plainText, setPlainText] = React.useState("");
  const [caretOffset, setCaretOffset] = React.useState(0);
  const [autoCorrect, setAutoCorrect] = React.useState(true);
  const [appliedLog, setAppliedLog] = React.useState<AppliedCorrection[]>([]);
  const [archiveId, setArchiveId] = React.useState<string | undefined>();

  const matchesRef = React.useRef<LintMatch[]>([]);
  const applyingRef = React.useRef(false);
  const lastFingerprintRef = React.useRef("");
  const appliedLogRef = React.useRef(appliedLog);
  appliedLogRef.current = appliedLog;

  const { matches, checkedText, isChecking, error, checkNow } = useLiveCheck({
    text: plainText,
    caretOffset,
    language,
    debounceMs: 200,
  });

  matchesRef.current = autoCorrect ? [] : matches;

  React.useEffect(() => {
    onAppliedLogChange?.(appliedLog);
  }, [appliedLog, onAppliedLogChange]);

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

  const syncCaret = React.useCallback((ed: Editor) => {
    const { from } = ed.state.selection;
    setCaretOffset(posToOffset(ed.state.doc, from));
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder:
          "Écrivez… les corrections apparaissent barrées → surlignées.",
      }),
      AutoCorrectionMark,
      lintExtension,
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none min-h-[42vh] lg:min-h-[320px] px-1 py-2 text-base leading-relaxed focus:outline-none sm:min-h-[280px]",
      },
    },
    onUpdate: ({ editor: ed }) => {
      setPlainText(getDocPlainText(ed.state.doc));
      syncCaret(ed);
    },
    onSelectionUpdate: ({ editor: ed }) => {
      syncCaret(ed);
    },
    onCreate: ({ editor: ed }) => {
      setPlainText(getDocPlainText(ed.state.doc));
      syncCaret(ed);
    },
  });

  // Load from classeur
  React.useEffect(() => {
    if (!editor || !loadContent) return;
    if (loadContent.html) {
      editor.commands.setContent(loadContent.html);
    } else {
      const escaped = loadContent.text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      editor.commands.setContent(
        `<p>${escaped.replace(/\n/g, "</p><p>")}</p>`
      );
    }
    setArchiveId(loadContent.archiveId);
    lastFingerprintRef.current = "";
    setPlainText(getDocPlainText(editor.state.doc));
  }, [editor, loadContent]);

  // Auto-apply with visual marks
  React.useEffect(() => {
    if (!editor || !autoCorrect || isChecking || applyingRef.current) return;
    if (checkedText !== plainText) return;
    if (matches.length === 0) return;

    const fingerprint = matches
      .map((m) => `${m.offset}:${m.length}:${m.replacements[0]}`)
      .join("|");
    if (fingerprint === lastFingerprintRef.current) return;

    applyingRef.current = true;
    lastFingerprintRef.current = fingerprint;

    const applied = applyAllReplacements(editor, matches, plainText);
    if (applied.length > 0) {
      setAppliedLog((prev) => [...applied, ...prev].slice(0, 50));
    }

    applyingRef.current = false;
  }, [editor, autoCorrect, isChecking, checkedText, plainText, matches]);

  React.useEffect(() => {
    if (!editor) return;
    refreshLintDecorations(editor.view.dispatch, editor.state);
  }, [editor, matches, autoCorrect]);

  React.useEffect(() => {
    lastFingerprintRef.current = "";
  }, [language]);

  // Auto-archive to classeur (debounce)
  React.useEffect(() => {
    if (!plainText.trim() || appliedLog.length === 0) return;
    const timer = window.setTimeout(() => {
      const html = editor?.getHTML();
      const saved = upsertArchive({
        id: archiveId,
        title: titleFromContent(plainText),
        content: plainText,
        html,
        corrections: appliedLogRef.current,
      });
      setArchiveId(saved.id);
      onArchiveSaved?.();
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [plainText, appliedLog, archiveId, editor, onArchiveSaved]);

  return (
    <div className={cn("flex min-h-0 flex-col gap-3", className)}>
      {!hideToolDock ? (
        <EditorToolDock
          editor={editor}
          language={language}
          onLanguageChange={setLanguage}
          onCheck={checkNow}
          isChecking={isChecking}
          autoCorrect={autoCorrect}
          onAutoCorrectChange={setAutoCorrect}
        />
      ) : null}

      <div className="rounded-[14px] border border-ds-border/60 bg-ds-elevated p-3 shadow-ds-md sm:p-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-ds-muted">
          <span>
            <strong className="text-ds-ink">
              {language === "fr" ? "FR" : "EN"}
            </strong>
            {" · "}
            {autoCorrect ? "Correction progressive" : "Manuel"}
            {" · "}
            <span className="text-ds-ink">
              <s className="opacity-60">faute</s> →{" "}
              <mark className="rounded bg-ds-lime/50 px-0.5">corrigé</mark>
            </span>
          </span>
          <span>
            {isChecking
              ? "Analyse…"
              : error
                ? "Erreur API"
                : `${appliedLog.length} corr.`}
          </span>
        </div>

        <EditorContent editor={editor} />

        {error ? (
          <p className="mt-2 text-xs text-ds-coral" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className="rounded-[14px] border border-ds-border/60 bg-ds-elevated p-3 shadow-ds-sm lg:hidden">
        <CorrectionThread
          appliedLog={appliedLog}
          isChecking={isChecking}
          compact
        />
      </div>

      <div className="hidden lg:block">
        <div className="rounded-[14px] border border-ds-border/60 bg-ds-elevated p-4 shadow-ds-md">
          <CorrectionThread appliedLog={appliedLog} isChecking={isChecking} />
        </div>
      </div>
    </div>
  );
}
