"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/shared/lib/cn";

export interface DocTab {
  id: string;
  label: string;
}

export interface DocTabsProps {
  tabs: DocTab[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export function DocTabs({
  tabs,
  value,
  defaultValue,
  onValueChange,
  className,
  children,
}: DocTabsProps) {
  return (
    <Tabs.Root
      value={value}
      defaultValue={defaultValue ?? tabs[0]?.id}
      onValueChange={onValueChange}
      className={cn("flex min-h-0 flex-col", className)}
    >
      <Tabs.List
        className="flex gap-1 overflow-x-auto border-b border-ds-border/60 px-1"
        aria-label="Documents"
      >
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.id}
            value={tab.id}
            className={cn(
              "shrink-0 rounded-t-[10px] px-3 py-2 text-sm font-medium text-ds-muted transition-colors",
              "hover:text-ds-ink",
              "data-[state=active]:bg-ds-elevated data-[state=active]:text-ds-ink data-[state=active]:shadow-ds-sm"
            )}
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {children}
    </Tabs.Root>
  );
}

export function DocTabContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Tabs.Content
      value={value}
      className={cn("min-h-0 flex-1 outline-none", className)}
    >
      {children}
    </Tabs.Content>
  );
}
