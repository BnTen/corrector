import * as React from "react";
import { cn } from "@/shared/lib/cn";

export interface PanelProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  as?: "aside" | "section" | "div";
}

export function Panel({
  className,
  title,
  description,
  actions,
  as: Comp = "aside",
  children,
  ...props
}: PanelProps) {
  return (
    <Comp
      className={cn(
        "flex h-full min-h-0 flex-col rounded-ds-lg border border-ds-border/60 bg-ds-elevated shadow-ds-md",
        className
      )}
      {...props}
    >
      {(title || actions) && (
        <header className="flex items-start justify-between gap-3 border-b border-ds-border/60 px-4 py-3">
          <div className="min-w-0">
            {title ? (
              <h2 className="truncate text-sm font-semibold text-ds-ink">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-xs text-ds-muted">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </header>
      )}
      <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
    </Comp>
  );
}
