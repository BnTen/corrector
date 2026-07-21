import * as React from "react";
import { cn } from "@/shared/lib/cn";

export interface BentoTileProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  span?: "1" | "2" | "full";
}

export function BentoTile({
  className,
  title,
  description,
  span = "1",
  children,
  ...props
}: BentoTileProps) {
  return (
    <div
      className={cn(
        "rounded-[14px] border border-ds-border/60 bg-ds-elevated p-5 shadow-ds-md",
        span === "2" && "lg:col-span-2",
        span === "full" && "col-span-full",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="mb-4">
          {title ? (
            <h3 className="text-sm font-semibold text-ds-ink">{title}</h3>
          ) : null}
          {description ? (
            <p className="mt-1 text-sm text-ds-muted">{description}</p>
          ) : null}
        </div>
      )}
      {children}
    </div>
  );
}
