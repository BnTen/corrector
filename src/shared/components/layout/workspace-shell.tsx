"use client";

import * as React from "react";
import { BarChart3, FolderOpen, GraduationCap, X } from "lucide-react";
import { TopBar } from "@/shared/components/ui/top-bar";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { useI18n } from "@/shared/i18n/provider";
import { cn } from "@/shared/lib/cn";

export type WorkspaceInsight = "stats" | "quiz" | null;

export interface WorkspaceShellProps {
  analytics: React.ReactNode;
  quiz: React.ReactNode;
  classeur: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  insight?: WorkspaceInsight;
  onInsightChange?: (insight: WorkspaceInsight) => void;
  binderOpen?: boolean;
  onBinderOpenChange?: (open: boolean) => void;
}

function InsightCard({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[14px] border border-ds-border/70 bg-ds-elevated shadow-ds-md">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-ds-border/60 px-3 py-2">
        <h2 className="text-sm font-semibold text-ds-ink">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-ds-muted transition hover:bg-ds-canvas hover:text-ds-ink"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">{children}</div>
    </div>
  );
}

function MobileChatBar({
  insight,
  binderOpen,
  onSelectInsight,
  onToggleBinder,
}: {
  insight: WorkspaceInsight;
  binderOpen: boolean;
  onSelectInsight: (value: WorkspaceInsight) => void;
  onToggleBinder: () => void;
}) {
  const { t } = useI18n();

  const chips = [
    {
      id: "binder",
      label: t("nav.binder"),
      icon: FolderOpen,
      active: binderOpen,
      onClick: onToggleBinder,
    },
    {
      id: "stats",
      label: t("nav.stats"),
      icon: BarChart3,
      active: insight === "stats",
      onClick: () =>
        onSelectInsight(insight === "stats" ? null : "stats"),
    },
    {
      id: "quiz",
      label: t("nav.quiz"),
      icon: GraduationCap,
      active: insight === "quiz",
      onClick: () => onSelectInsight(insight === "quiz" ? null : "quiz"),
    },
  ] as const;

  return (
    <div className="mx-auto flex h-10 max-w-[1400px] items-center gap-1.5 overflow-x-auto px-3">
      {chips.map((chip) => {
        const Icon = chip.icon;
        return (
          <button
            key={chip.id}
            type="button"
            onClick={chip.onClick}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition",
              chip.active
                ? "bg-ds-lime text-ds-inverse"
                : "bg-white/8 text-white/70 hover:bg-white/12 hover:text-white"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}

export function WorkspaceShell({
  analytics,
  quiz,
  classeur,
  children,
  className,
  insight: controlledInsight,
  onInsightChange,
  binderOpen: controlledBinderOpen,
  onBinderOpenChange,
}: WorkspaceShellProps) {
  const { t } = useI18n();
  const [internalInsight, setInternalInsight] =
    React.useState<WorkspaceInsight>(null);
  const [internalBinder, setInternalBinder] = React.useState(false);

  const insight = controlledInsight ?? internalInsight;
  const setInsight = onInsightChange ?? setInternalInsight;
  const binderOpen = controlledBinderOpen ?? internalBinder;
  const setBinderOpen = onBinderOpenChange ?? setInternalBinder;

  const navItems = [
    {
      id: "write",
      label: t("nav.write"),
      active: insight === null && !binderOpen,
      onClick: () => {
        setInsight(null);
        setBinderOpen(false);
      },
    },
    {
      id: "stats",
      label: t("nav.stats"),
      active: insight === "stats",
      onClick: () => {
        setInsight(insight === "stats" ? null : "stats");
        setBinderOpen(false);
      },
    },
    {
      id: "quiz",
      label: t("nav.quiz"),
      active: insight === "quiz",
      onClick: () => {
        setInsight(insight === "quiz" ? null : "quiz");
        setBinderOpen(false);
      },
    },
    {
      href: "/dashboard",
      label: t("nav.dashboard"),
      active: false,
    },
  ];

  const insightTitle =
    insight === "stats"
      ? t("nav.stats")
      : insight === "quiz"
        ? t("nav.quiz")
        : "";

  const insightBody =
    insight === "stats" ? analytics : insight === "quiz" ? quiz : null;

  return (
    <div
      className={cn(
        "flex h-dvh flex-col overflow-hidden bg-ds-canvas",
        className
      )}
    >
      <TopBar
        navItems={navItems}
        showEditorCta={false}
        subBar={
          <MobileChatBar
            insight={insight}
            binderOpen={binderOpen}
            onSelectInsight={(value) => {
              setInsight(value);
              if (value) setBinderOpen(false);
            }}
            onToggleBinder={() => {
              setBinderOpen(!binderOpen);
              if (!binderOpen) setInsight(null);
            }}
          />
        }
      >
        <SignOutButton />
      </TopBar>

      <div className="relative mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 overflow-hidden">
        {/* Desktop: binder always left */}
        <aside className="hidden w-[260px] shrink-0 flex-col border-r border-ds-border/60 bg-ds-elevated/80 lg:flex">
          <div className="min-h-0 flex-1 overflow-y-auto p-2">{classeur}</div>
        </aside>

        {/* Editor */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-2 py-2 sm:px-3 lg:px-4">
          {children}
        </main>

        {/* Desktop insight card (hidden by default) */}
        {insightBody ? (
          <aside className="hidden w-[min(360px,34%)] shrink-0 flex-col p-2 lg:flex">
            <InsightCard title={insightTitle} onClose={() => setInsight(null)}>
              {insightBody}
            </InsightCard>
          </aside>
        ) : null}

        {/* Mobile binder drawer */}
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

        {/* Mobile insight overlay card */}
        {insightBody ? (
          <div className="absolute inset-x-0 bottom-0 top-0 z-30 flex flex-col justify-end lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-ds-inverse/30"
              aria-label={t("workspace.closePanel")}
              onClick={() => setInsight(null)}
            />
            <div className="relative z-10 max-h-[70vh] overflow-hidden rounded-t-[16px] border border-ds-border bg-ds-elevated shadow-ds-md">
              <InsightCard title={insightTitle} onClose={() => setInsight(null)}>
                {insightBody}
              </InsightCard>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
