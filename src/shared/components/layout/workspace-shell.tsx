"use client";

import * as React from "react";
import Link from "next/link";
import { FolderOpen, GraduationCap, X } from "lucide-react";
import { TopBar } from "@/shared/components/ui/top-bar";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { useAppNav } from "@/shared/lib/use-app-nav";
import { useI18n } from "@/shared/i18n/provider";
import { cn } from "@/shared/lib/cn";

export interface WorkspaceShellProps {
  classeur: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  binderOpen?: boolean;
  onBinderOpenChange?: (open: boolean) => void;
}

function MobileChatBar({
  binderOpen,
  onToggleBinder,
}: {
  binderOpen: boolean;
  onToggleBinder: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="mx-auto flex h-10 max-w-[1400px] items-center gap-1.5 overflow-x-auto px-3">
      <button
        type="button"
        onClick={onToggleBinder}
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition",
          binderOpen
            ? "bg-ds-lime text-ds-inverse"
            : "bg-white/8 text-white/70 hover:bg-white/12 hover:text-white"
        )}
      >
        <FolderOpen className="h-3.5 w-3.5" />
        {t("nav.binder")}
      </button>
      <Link
        href="/quiz"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/12 hover:text-white"
      >
        <GraduationCap className="h-3.5 w-3.5" />
        {t("nav.quiz")}
      </Link>
    </div>
  );
}

export function WorkspaceShell({
  classeur,
  children,
  className,
  binderOpen: controlledBinderOpen,
  onBinderOpenChange,
}: WorkspaceShellProps) {
  const { t } = useI18n();
  const nav = useAppNav("workspace");
  const [internalBinder, setInternalBinder] = React.useState(false);
  const binderOpen = controlledBinderOpen ?? internalBinder;
  const setBinderOpen = onBinderOpenChange ?? setInternalBinder;

  return (
    <div
      className={cn(
        "flex h-dvh flex-col overflow-hidden bg-ds-canvas",
        className
      )}
    >
      <TopBar
        navItems={nav}
        showEditorCta={false}
        subBar={
          <MobileChatBar
            binderOpen={binderOpen}
            onToggleBinder={() => setBinderOpen(!binderOpen)}
          />
        }
      >
        <SignOutButton />
      </TopBar>

      <div className="relative mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 overflow-hidden">
        <aside className="hidden w-[260px] shrink-0 flex-col border-r border-ds-border/60 bg-ds-elevated/80 lg:flex">
          <div className="min-h-0 flex-1 overflow-y-auto p-2">{classeur}</div>
        </aside>

        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-2 py-2 sm:px-3 lg:px-4">
          {children}
        </main>

        {binderOpen ? (
          <div className="absolute inset-0 z-40 flex lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-ds-inverse/35"
              aria-label={t("workspace.closePanel")}
              onClick={() => setBinderOpen(false)}
            />
            <div className="relative z-10 flex h-full w-[min(320px,88vw)] flex-col bg-ds-elevated shadow-ds-md">
              <div className="flex items-center justify-between border-b border-ds-border/60 px-3 py-2">
                <h2 className="text-sm font-semibold text-ds-ink">
                  {t("nav.binder")}
                </h2>
                <button
                  type="button"
                  onClick={() => setBinderOpen(false)}
                  className="rounded-lg p-1.5 text-ds-muted hover:bg-ds-canvas"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-2">
                {classeur}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
