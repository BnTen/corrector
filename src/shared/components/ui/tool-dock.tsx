"use client";

import * as React from "react";
import { cn } from "@/shared/lib/cn";

export interface ToolDockItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onSelect?: () => void;
}

export interface ToolDockProps extends React.HTMLAttributes<HTMLElement> {
  items: ToolDockItem[];
}

export function ToolDock({ className, items, ...props }: ToolDockProps) {
  return (
    <nav
      aria-label="Tools"
      className={cn(
        // Mobile: horizontal bottom dock
        "fixed inset-x-0 bottom-0 z-40 flex items-center justify-around gap-1 border-t border-ds-border/60 bg-ds-elevated/95 px-2 py-2 shadow-ds-lg backdrop-blur safe-pb",
        // Desktop: vertical pill rail
        "lg:inset-auto lg:bottom-auto lg:left-4 lg:top-1/2 lg:w-14 lg:-translate-y-1/2 lg:flex-col lg:justify-center lg:gap-2 lg:rounded-ds-pill lg:border lg:border-ds-border/60 lg:px-2 lg:py-3 lg:shadow-ds-md",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-label={item.label}
          aria-pressed={item.active}
          title={item.label}
          onClick={item.onSelect}
          className={cn(
            "flex h-11 w-11 flex-col items-center justify-center rounded-[12px] text-ds-muted transition-colors",
            "hover:bg-ds-canvas hover:text-ds-ink",
            "lg:h-10 lg:w-10 lg:rounded-ds-pill",
            item.active && "bg-ds-lime/40 text-ds-ink"
          )}
        >
          <span className="[&>svg]:h-5 [&>svg]:w-5">{item.icon}</span>
          <span className="mt-0.5 max-w-[3.5rem] truncate text-[9px] font-medium lg:hidden">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
