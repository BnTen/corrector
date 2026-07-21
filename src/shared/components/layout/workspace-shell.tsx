"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { TopBar } from "@/shared/components/ui/top-bar";
import { cn } from "@/shared/lib/cn";

export interface WorkspaceShellProps {
  analytics: React.ReactNode;
  quiz: React.ReactNode;
  classeur: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const workspaceNav = [
  { href: "/workspace", label: "Écrire", active: true },
  { href: "/login", label: "Compte" },
];

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
  return (
    <Tabs.Root
      defaultValue="stats"
      className={cn("flex flex-col", !mobile && "min-h-0 flex-1")}
    >
      <Tabs.List
        className={cn(
          "flex gap-1 rounded-xl bg-ds-elevated p-1 shadow-ds-sm",
          !mobile && "mb-2"
        )}
      >
        {(
          [
            ["stats", "Stats"],
            ["classeur", "Classeur"],
            ["quiz", "Quiz"],
          ] as const
        ).map(([value, label]) => (
          <Tabs.Trigger
            key={value}
            value={value}
            className={cn(
              "flex-1 rounded-lg px-2 py-2 text-sm font-medium text-ds-muted data-[state=active]:bg-ds-inverse data-[state=active]:text-white",
              mobile && "py-2.5"
            )}
          >
            {label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <Tabs.Content
        value="stats"
        className={cn("outline-none", mobile ? "mt-3" : "min-h-0 flex-1")}
      >
        {analytics}
      </Tabs.Content>
      <Tabs.Content
        value="classeur"
        className={cn("outline-none", mobile ? "mt-3" : "min-h-0 flex-1")}
      >
        {classeur}
      </Tabs.Content>
      <Tabs.Content
        value="quiz"
        className={cn("outline-none", mobile ? "mt-3" : "min-h-0 flex-1")}
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
  return (
    <div className={cn("flex min-h-dvh flex-col bg-ds-canvas", className)}>
      <TopBar navItems={workspaceNav} />

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-3 pb-[calc(4.5rem+env(safe-area-inset-bottom))] pt-3 sm:px-4 lg:px-6 lg:pb-6">
        <div className="relative hidden min-h-0 flex-1 gap-4 lg:flex">
          <div className="w-12 shrink-0" aria-hidden />
          <main className="flex min-h-0 min-w-0 flex-[1.65] flex-col">
            {children}
          </main>
          <aside className="flex min-h-0 w-[min(360px,36%)] shrink-0 flex-col gap-3">
            <SideTabs analytics={analytics} quiz={quiz} classeur={classeur} />
          </aside>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 lg:hidden">
          <main className="min-h-0">{children}</main>
          <SideTabs
            analytics={analytics}
            quiz={quiz}
            classeur={classeur}
            mobile
          />
        </div>
      </div>
    </div>
  );
}
