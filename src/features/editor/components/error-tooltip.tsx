"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import { Pill } from "@/shared/components/ui/pill";
import { cn } from "@/shared/lib/cn";
import type { LintMatch } from "@/features/editor/types";
import {
  CATEGORY_LABELS,
  CATEGORY_TONES,
} from "@/features/editor/lib/category-meta";

export interface ErrorTooltipProps {
  match: LintMatch;
  onApply: (replacement: string) => void;
  onIgnore?: () => void;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function ErrorTooltip({
  match,
  onApply,
  onIgnore,
  onClose,
  className,
  style,
}: ErrorTooltipProps) {
  const [selected, setSelected] = React.useState(
    match.replacements[0] ?? ""
  );

  React.useEffect(() => {
    setSelected(match.replacements[0] ?? "");
  }, [match.id, match.replacements]);

  return (
    <div
      role="dialog"
      aria-label="Correction suggestion"
      style={style}
      className={cn(
        "z-50 w-[min(100vw-2rem,320px)] rounded-[14px] border border-ds-border/60 bg-ds-elevated p-3 shadow-ds-lg",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Pill tone={CATEGORY_TONES[match.category]}>
          {CATEGORY_LABELS[match.category]}
        </Pill>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-ds-muted hover:text-ds-ink"
            aria-label="Close"
          >
            ✕
          </button>
        ) : null}
      </div>

      <p className="mt-2 text-sm leading-snug text-ds-ink">{match.message}</p>

      {match.replacements.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {match.replacements.map((replacement) => (
            <button
              key={replacement}
              type="button"
              onClick={() => setSelected(replacement)}
              className={cn(
                "rounded-[10px] border px-2.5 py-1 text-xs transition-colors",
                selected === replacement
                  ? "border-ds-inverse bg-ds-inverse text-white"
                  : "border-ds-border bg-ds-canvas text-ds-ink hover:border-ds-ink/30"
              )}
            >
              {replacement}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-ds-muted">Aucune suggestion automatique</p>
      )}

      <div className="mt-3 flex items-center gap-2">
        <Button
          size="sm"
          disabled={!selected}
          onClick={() => selected && onApply(selected)}
        >
          Appliquer
        </Button>
        {onIgnore ? (
          <Button size="sm" variant="ghost" onClick={onIgnore}>
            Ignorer
          </Button>
        ) : null}
      </div>
    </div>
  );
}
