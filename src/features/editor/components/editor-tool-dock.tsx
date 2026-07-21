"use client";

import * as React from "react";
import {
  Bold,
  Italic,
  Undo2,
  Redo2,
  Languages,
  SpellCheck2,
  Zap,
} from "lucide-react";
import type { Editor } from "@tiptap/react";
import { ToolDock, type ToolDockItem } from "@/shared/components/ui/tool-dock";
import type { CheckLanguage } from "@/features/editor/hooks/use-live-check";
import { useI18n } from "@/shared/i18n/provider";

export interface EditorToolDockProps {
  editor: Editor | null;
  language: CheckLanguage;
  onLanguageChange: (language: CheckLanguage) => void;
  onCheck: () => void;
  isChecking?: boolean;
  autoCorrect?: boolean;
  onAutoCorrectChange?: (enabled: boolean) => void;
  className?: string;
}

export function EditorToolDock({
  editor,
  language,
  onLanguageChange,
  onCheck,
  isChecking,
  autoCorrect = true,
  onAutoCorrectChange,
  className,
}: EditorToolDockProps) {
  const { t } = useI18n();

  const items: ToolDockItem[] = [
    {
      id: "undo",
      label: t("editor.undo"),
      icon: <Undo2 />,
      onSelect: () => editor?.chain().focus().undo().run(),
    },
    {
      id: "redo",
      label: t("editor.redo"),
      icon: <Redo2 />,
      onSelect: () => editor?.chain().focus().redo().run(),
    },
    {
      id: "bold",
      label: t("editor.bold"),
      icon: <Bold />,
      active: editor?.isActive("bold") ?? false,
      onSelect: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      id: "italic",
      label: t("editor.italic"),
      icon: <Italic />,
      active: editor?.isActive("italic") ?? false,
      onSelect: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      id: "language",
      label: language === "fr" ? "FR" : "EN",
      icon: <Languages />,
      active: true,
      onSelect: () => onLanguageChange(language === "fr" ? "en-US" : "fr"),
    },
    {
      id: "check",
      label: isChecking ? "…" : t("editor.check"),
      icon: <SpellCheck2 />,
      active: isChecking,
      onSelect: onCheck,
    },
    {
      id: "auto",
      label: autoCorrect ? t("editor.autoOn") : t("editor.autoOff"),
      icon: <Zap />,
      active: autoCorrect,
      onSelect: () => onAutoCorrectChange?.(!autoCorrect),
    },
  ];

  return <ToolDock items={items} className={className} />;
}
