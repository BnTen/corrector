"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { TopBar } from "@/shared/components/ui/top-bar";
import { cn } from "@/shared/lib/cn";

export interface WorkspaceShellProps {
  analytics: React.ReactNode;
  quiz: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const workspaceNav = [
  { href: "/workspace", label: "Écrire", active: true },
  { href: "/login", label: "Compte" },
];

export function WorkspaceShell({
  analytics,
  quiz,
  children,
  className,
}: WorkspaceShellProps) {
  return (
    <div className={cn("flex min-h-dvh flex-col bg-ds-canvas", className)}>
      <TopBar navItems={workspaceNav} />

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-3 pb-[calc(4.5rem+env(safe-area-inset-bottom))] pt-3 sm:px-4 lg:px-6 lg:pb-6">
        {/* Desktop: editor 65% + side panels */}
        <div className="relative hidden min-h-0 flex-1 gap-4 lg:flex">
          <div className="w-12 shrink-0" aria-hidden />
          <main className="flex min-h-0 min-w-0 flex-[1.65] flex-col">
            {children}
          </main>
          <aside className="flex min-h-0 w-[min(340px,34%)] shrink-0 flex-col gap-3">
            <Tabs.Root defaultValue="stats" className="flex min-h-0 flex-1 flex-col">
              <Tabs.List className="mb-2 flex gap-1 rounded-xl bg-ds-elevated p-1 shadow-ds-sm">
                <Tabs.Trigger
                  value="stats"
                  className="flex-1 rounded-lg px-3 py-2 text-sm font-medium text-ds-muted data-[state=active]:bg-ds-inverse data-[state=active]:text-white"
                >
                  Stats
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="quiz"
                  className="flex-1 rounded-lg px-3 py-2 text-sm font-medium text-ds-muted data-[state=active]:bg-ds-inverse data-[state=active]:text-white"
                >
                  Quiz
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="stats" className="min-h-0 flex-1 outline-none">
                {analytics}
              </Tabs.Content>
              <Tabs.Content value="quiz" className="min-h-0 flex-1 outline-none">
                {quiz}
              </Tabs.Content>
            </Tabs.Root>
          </aside>
        </div>

        {/* Mobile: editor first, then Stats | Quiz */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 lg:hidden">
          <main className="min-h-0">{children}</main>

          <Tabs.Root defaultValue="stats" className="flex flex-col">
            <Tabs.List className="flex gap-1 rounded-xl bg-ds-elevated p-1 shadow-ds-sm">
              <Tabs.Trigger
                value="stats"
                className="flex-1 rounded-lg px-3 py-2.5 text-sm font-medium text-ds-muted data-[state=active]:bg-ds-inverse data-[state=active]:text-white"
              >
                Stats
              </Tabs.Trigger>
              <Tabs.Trigger
                value="quiz"
                className="flex-1 rounded-lg px-3 py-2.5 text-sm font-medium text-ds-muted data-[state=active]:bg-ds-inverse data-[state=active]:text-white"
              >
                Quiz
              </Tabs.Trigger>
            </Tabs.List>
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
