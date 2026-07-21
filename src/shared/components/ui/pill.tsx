import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/cn";

const pillVariants = cva(
  "inline-flex items-center gap-1.5 rounded-ds-pill px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      tone: {
        default: "bg-ds-canvas text-ds-ink",
        lime: "bg-ds-lime/40 text-ds-ink",
        sky: "bg-ds-sky/60 text-ds-ink",
        coral: "bg-ds-coral/15 text-ds-coral",
        pink: "bg-ds-pink/50 text-ds-ink",
        yellow: "bg-ds-yellow/70 text-ds-ink",
        lavender: "bg-ds-lavender/50 text-ds-ink",
        inverse: "bg-ds-inverse text-white",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  }
);

export interface PillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {}

export function Pill({ className, tone, ...props }: PillProps) {
  return (
    <span className={cn(pillVariants({ tone, className }))} {...props} />
  );
}

export { pillVariants };
