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
import { CleanTextPanel } from "@/features/editor/components/clean-text-panel";
import { EditorToolDock } from "@/features/editor/components/editor-tool-dock";
import {
  titleFromContent,
  upsertArchive,
} from "@/features/archives/lib/classeur-storage";
import { useI18n } from "@/shared/i18n/provider";

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
  /**
   * When set, auto-apply is limited to `creditsRemaining` corrections.
   * Calls `onCreditsExhausted` when a batch would need credits but none remain.
   */
  creditsRemaining?: number;
  onCreditsConsumed?: (count: number) => void;
  onCreditsExhausted?: () => void;
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
  creditsRemaining,
  onCreditsConsumed,
  onCreditsExhausted,
  loadContent,
}: EditorSceneProps) {
  const { t, checkLanguage } = useI18n();
  const [language, setLanguage] = React.useState<CheckLanguage>(checkLanguage);
  const [plainText, setPlainText] = React.useState("");
  const [caretOffset, setCaretOffset] = React.useState(0);
  const [autoCorrect, setAutoCorrect] = React.useState(true);
  const [appliedLog, setAppliedLog] = React.useState<AppliedCorrection[]>([]);
  const [archiveId, setArchiveId] = React.useState<string | undefined>();

  React.useEffect(() => {
    setLanguage(checkLanguage);
  }, [checkLanguage]);

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
        placeholder: t("editor.placeholder"),
      }),
      AutoCorrectionMark,
      lintExtension,
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none min-h-[180px] px-1 py-2 text-base leading-relaxed focus:outline-none sm:min-h-[200px] lg:min-h-[220px]",
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

  // Auto-apply with visual marks (optionally credit-gated)
  React.useEffect(() => {
    if (!editor || !autoCorrect || isChecking || applyingRef.current) return;
    if (checkedText !== plainText) return;
    if (matches.length === 0) return;

    const isGated = typeof creditsRemaining === "number";
    if (isGated && creditsRemaining <= 0) {
      onCreditsExhausted?.();
      return;
    }

    const batch = isGated
      ? matches.slice(0, Math.max(0, creditsRemaining))
      : matches;
    if (batch.length === 0) {
      onCreditsExhausted?.();
      return;
    }

    const fingerprint = batch
      .map((m) => `${m.offset}:${m.length}:${m.replacements[0]}`)
      .join("|");
    if (fingerprint === lastFingerprintRef.current) return;

    applyingRef.current = true;
    lastFingerprintRef.current = fingerprint;

    const applied = applyAllReplacements(editor, batch, plainText);
    if (applied.length > 0) {
      setAppliedLog((prev) => [...applied, ...prev].slice(0, 50));
      if (isGated) onCreditsConsumed?.(applied.length);
      if (isGated && applied.length < matches.length) {
        onCreditsExhausted?.();
      }
    }

    applyingRef.current = false;
  }, [
    editor,
    autoCorrect,
    isChecking,
    checkedText,
    plainText,
    matches,
    creditsRemaining,
    onCreditsConsumed,
    onCreditsExhausted,
  ]);

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

      <div className="min-h-0 flex-1 overflow-hidden rounded-ds-md border border-ds-border/70 bg-ds-elevated shadow-ds-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ds-border/50 px-3 py-1.5 sm:px-4">
          <span className="text-xs text-ds-muted">
            <strong className="text-ds-ink">
              {language === "fr" ? "FR" : "EN"}
            </strong>
            {" · "}
            {autoCorrect ? t("editor.progressive") : t("editor.manual")}
          </span>
          <span className="text-xs font-medium tabular-nums text-ds-muted">
            {typeof creditsRemaining === "number"
              ? `${creditsRemaining} ${
                  creditsRemaining === 1
                    ? t("common.credit")
                    : t("common.credits")
                }`
              : null}
            {typeof creditsRemaining === "number" ? " · " : null}
            {isChecking
              ? t("editor.analyzing")
              : error
                ? t("editor.apiError")
                : `${appliedLog.length} ${t("editor.corr")}`}
          </span>
        </div>

        <div className="px-3 py-2 sm:px-4 sm:py-3">
          <EditorContent editor={editor} />
          {error ? (
            <p className="mt-2 text-xs text-ds-coral" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid shrink-0 gap-3 lg:grid-cols-2">
        <CleanTextPanel text={plainText} correctionCount={appliedLog.length} />
        <div className="rounded-ds-md border border-ds-border/60 bg-ds-elevated p-3 shadow-ds-sm">
          <CorrectionThread
            appliedLog={appliedLog}
            isChecking={isChecking}
            compact
          />
        </div>
      </div>
    </div>
  );
}
