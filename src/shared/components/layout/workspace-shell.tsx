"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { TopBar } from "@/shared/components/ui/top-bar";
import { DocTabs, DocTabContent } from "@/shared/components/ui/doc-tabs";
import { Panel } from "@/shared/components/ui/panel";
import { cn } from "@/shared/lib/cn";

export interface WorkspaceShellProps {
  analytics: React.ReactNode;
  quiz: React.ReactNode;
  corrections?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const workspaceNav = [
  { href: "/workspace", label: "Workspace", active: true },
  { href: "/login", label: "Compte" },
];

export function WorkspaceShell({
  analytics,
  quiz,
  corrections,
  children,
  className,
}: WorkspaceShellProps) {
  return (
    <div className={cn("flex min-h-dvh flex-col bg-ds-canvas", className)}>
      <TopBar navItems={workspaceNav} />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-3 pb-24 pt-3 lg:px-6 lg:pb-6">
        <DocTabs
          tabs={[{ id: "draft", label: "Brouillon" }]}
          defaultValue="draft"
          className="mb-3"
        >
          <DocTabContent value="draft" className="sr-only">
            Document brouillon
          </DocTabContent>
        </DocTabs>

        {/* Desktop: ToolDock spacer + editor (~58%) + right column 50/50 */}
        <div className="relative hidden min-h-0 flex-1 gap-4 lg:flex">
          <div className="w-14 shrink-0" aria-hidden />

          <main className="flex min-h-0 w-[58%] min-w-0 flex-col">
            {children}
          </main>

          <div className="flex min-h-0 w-[calc(42%-3.5rem)] min-w-[280px] flex-col gap-4">
            <div className="min-h-0 flex-1 [&_>_*]:h-full">{analytics}</div>
            <div className="min-h-0 flex-1 [&_>_*]:h-full">{quiz}</div>
          </div>
        </div>

        {/* Mobile: editor then Corrections | Stats | Quiz */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 lg:hidden">
          <main className="min-h-0">{children}</main>

          <Tabs.Root defaultValue="corrections" className="flex flex-col">
            <Tabs.List className="flex gap-1 rounded-[12px] bg-ds-elevated p-1 shadow-ds-sm">
              {(
                [
                  ["corrections", "Corrections"],
                  ["stats", "Stats"],
                  ["quiz", "Quiz"],
                ] as const
              ).map(([value, label]) => (
                <Tabs.Trigger
                  key={value}
                  value={value}
                  className={cn(
                    "flex-1 rounded-[10px] px-3 py-2 text-sm font-medium text-ds-muted transition-colors",
                    "data-[state=active]:bg-ds-inverse data-[state=active]:text-white"
                  )}
                >
                  {label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <Tabs.Content value="corrections" className="mt-3 outline-none">
              {corrections ?? (
                <Panel title="Corrections">
                  <p className="text-sm text-ds-muted">
                    Les suggestions apparaissent aussi sous l’éditeur.
                  </p>
                </Panel>
              )}
            </Tabs.Content>
            <Tabs.Content value="stats" className="mt-3 outline-none">
              {analytics}
            </Tabs.Content>
            <Tabs.Content value="quiz" className="mt-3 outline-none">
              {quiz}
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
}
