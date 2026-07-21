import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/cn";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-lime focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent text-ds-ink hover:bg-ds-canvas",
        inverse: "bg-ds-inverse text-white hover:bg-ds-inverse/90",
        ghost: "bg-transparent text-ds-muted hover:text-ds-ink hover:bg-ds-canvas",
      },
      size: {
        default: "h-10 w-10",
        sm: "h-8 w-8 rounded-[10px]",
        lg: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  label: string;
}

export function IconButton({
  className,
  variant,
  size,
  label,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(iconButtonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
}

export { iconButtonVariants };
