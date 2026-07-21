"use client";

import * as React from "react";
import { TopBar, type TopBarNavItem } from "@/shared/components/ui/top-bar";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { cn } from "@/shared/lib/cn";
import {
  APP_GUTTER_X,
  APP_MAX_WIDTH,
  APP_PAGE_GAP,
  APP_PAGE_Y,
} from "@/shared/lib/layout";

export interface AppPageShellProps {
  navItems: TopBarNavItem[];
  children: React.ReactNode;
  className?: string;
  /** Extra classes on the scrollable content column. */
  contentClassName?: string;
}

/**
 * Shared chrome for scrollable app pages (Quiz, Dashboard).
 * Aligns gutters with TopBar and WorkspaceShell.
 */
export function AppPageShell({
  navItems,
  children,
  className,
  contentClassName,
}: AppPageShellProps) {
  return (
    <div
      className={cn(
        "flex h-dvh flex-col overflow-hidden bg-ds-canvas",
        className
      )}
    >
      <TopBar navItems={navItems} showEditorCta={false}>
        <SignOutButton />
      </TopBar>

      <div
        className={cn(
          "mx-auto flex min-h-0 w-full flex-1 flex-col overflow-y-auto",
          APP_MAX_WIDTH,
          APP_GUTTER_X,
          APP_PAGE_Y,
          APP_PAGE_GAP,
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
