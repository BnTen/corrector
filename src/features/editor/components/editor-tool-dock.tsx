"use client";

import * as React from "react";
import {
  Bold,
  Italic,
  Undo2,
  Redo2,
  Languages,
  SpellCheck2,
} from "lucide-react";
import type { Editor } from "@tiptap/react";
import { ToolDock, type ToolDockItem } from "@/shared/components/ui/tool-dock";
import type { CheckLanguage } from "@/features/editor/hooks/use-live-check";

export interface EditorToolDockProps {
  editor: Editor | null;
  language: CheckLanguage;
  onLanguageChange: (language: CheckLanguage) => void;
  onCheck: () => void;
  isChecking?: boolean;
  className?: string;
}

export function EditorToolDock({
  editor,
  language,
  onLanguageChange,
  onCheck,
  isChecking,
  className,
}: EditorToolDockProps) {
  const items: ToolDockItem[] = [
    {
      id: "undo",
      label: "Annuler",
      icon: <Undo2 />,
      onSelect: () => editor?.chain().focus().undo().run(),
    },
    {
      id: "redo",
      label: "Rétablir",
      icon: <Redo2 />,
      onSelect: () => editor?.chain().focus().redo().run(),
    },
    {
      id: "bold",
      label: "Gras",
      icon: <Bold />,
      active: editor?.isActive("bold") ?? false,
      onSelect: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      id: "italic",
      label: "Italique",
      icon: <Italic />,
      active: editor?.isActive("italic") ?? false,
      onSelect: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      id: "language",
      label: language === "fr" ? "FR" : "EN",
      icon: <Languages />,
      active: true,
      onSelect: () =>
        onLanguageChange(language === "fr" ? "en-US" : "fr"),
    },
    {
      id: "check",
      label: isChecking ? "…" : "Vérifier",
      icon: <SpellCheck2 />,
      active: isChecking,
      onSelect: onCheck,
    },
  ];

  return <ToolDock items={items} className={className} />;
}
