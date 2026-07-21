import * as React from "react";
import { cn } from "@/shared/lib/cn";
import { APP_GUTTER_X } from "@/shared/lib/layout";

export interface SceneProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional max width for the center stage */
  maxWidth?: "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
}

const maxWidthMap = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
} as const;

export function Scene({
  className,
  maxWidth = "5xl",
  children,
  ...props
}: SceneProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full py-4 sm:py-5",
        APP_GUTTER_X,
        maxWidthMap[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
