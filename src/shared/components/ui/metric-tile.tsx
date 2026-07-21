import * as React from "react";
import { cn } from "@/shared/lib/cn";

export interface MetricTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  hint?: string;
  accent?: "lime" | "sky" | "coral" | "pink" | "yellow" | "lavender";
}

const accentMap = {
  lime: "bg-ds-lime/30",
  sky: "bg-ds-sky/40",
  coral: "bg-ds-coral/15",
  pink: "bg-ds-pink/40",
  yellow: "bg-ds-yellow/50",
  lavender: "bg-ds-lavender/40",
} as const;

export function MetricTile({
  className,
  label,
  value,
  hint,
  accent = "lime",
  ...props
}: MetricTileProps) {
  return (
    <div
      className={cn(
        "rounded-ds-md border border-ds-border/60 bg-ds-elevated p-4 shadow-ds-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ds-muted">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-ds-ink">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-ds-muted">{hint}</p>
          ) : null}
        </div>
        <span
          className={cn("h-2.5 w-2.5 shrink-0 rounded-full", accentMap[accent])}
          aria-hidden
        />
      </div>
    </div>
  );
}
