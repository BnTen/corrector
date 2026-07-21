"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { TopBar } from "@/shared/components/ui/top-bar";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { useAppNav } from "@/shared/lib/use-app-nav";
import { useI18n } from "@/shared/i18n/provider";
import { cn } from "@/shared/lib/cn";

export interface WorkspaceShellProps {
  analytics: React.ReactNode;
  quiz: React.ReactNode;
  classeur: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

function SideTabs({
  analytics,
  quiz,
  classeur,
  mobile,
}: {
  analytics: React.ReactNode;
  quiz: React.ReactNode;
  classeur: React.ReactNode;
  mobile?: boolean;
}) {
  const { t } = useI18n();

  return (
    <Tabs.Root
      defaultValue="stats"
      className={cn("flex min-h-0 flex-col", !mobile && "flex-1")}
    >
      <Tabs.List
        className={cn(
          "flex shrink-0 gap-1 rounded-xl bg-ds-elevated p-1 shadow-ds-sm",
          !mobile && "mb-2"
        )}
      >
        {(
          [
            ["stats", t("nav.stats")],
            ["classeur", t("nav.binder")],
            ["quiz", t("nav.quiz")],
          ] as const
        ).map(([value, label]) => (
          <Tabs.Trigger
            key={value}
            value={value}
            className={cn(
              "flex-1 rounded-lg px-2 py-1.5 text-sm font-medium text-ds-muted data-[state=active]:bg-ds-inverse data-[state=active]:text-white"
            )}
          >
            {label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <Tabs.Content
        value="stats"
        className={cn(
          "min-h-0 outline-none",
          mobile ? "mt-2 max-h-[40vh] overflow-y-auto" : "flex-1 overflow-y-auto"
        )}
      >
        {analytics}
      </Tabs.Content>
      <Tabs.Content
        value="classeur"
        className={cn(
          "min-h-0 outline-none",
          mobile ? "mt-2 max-h-[40vh] overflow-y-auto" : "flex-1 overflow-y-auto"
        )}
      >
        {classeur}
      </Tabs.Content>
      <Tabs.Content
        value="quiz"
        className={cn(
          "min-h-0 outline-none",
          mobile ? "mt-2 max-h-[40vh] overflow-y-auto" : "flex-1 overflow-y-auto"
        )}
      >
        {quiz}
      </Tabs.Content>
    </Tabs.Root>
  );
}

export function WorkspaceShell({
  analytics,
  quiz,
  classeur,
  children,
  className,
}: WorkspaceShellProps) {
  const nav = useAppNav("workspace");

  return (
    <div
      className={cn(
        "flex h-dvh flex-col overflow-hidden bg-ds-canvas",
        className
      )}
    >
      <TopBar navItems={nav} showEditorCta={false}>
        <SignOutButton />
      </TopBar>

      <div className="mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col px-3 py-2 sm:px-4 lg:px-6">
        <div className="relative hidden min-h-0 flex-1 gap-3 lg:flex">
          <main className="flex min-h-0 min-w-0 flex-[1.65] flex-col overflow-hidden">
            {children}
          </main>
          <aside className="flex min-h-0 w-[min(340px,34%)] shrink-0 flex-col overflow-hidden">
            <SideTabs analytics={analytics} quiz={quiz} classeur={classeur} />
          </aside>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden lg:hidden">
          <main className="min-h-0 flex-[1.2] overflow-y-auto">{children}</main>
          <div className="shrink-0 border-t border-ds-border/50 pt-2">
            <SideTabs
              analytics={analytics}
              quiz={quiz}
              classeur={classeur}
              mobile
            />
          </div>
        </div>
      </div>
    </div>
  );
}
