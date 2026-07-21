"use client";

import * as React from "react";
import { Pill } from "@/shared/components/ui/pill";
import { cn } from "@/shared/lib/cn";
import type { AppliedCorrection } from "@/features/editor/lib/apply-matches";
import {
  CATEGORY_LABELS,
  CATEGORY_TONES,
} from "@/features/editor/lib/category-meta";

export interface CorrectionThreadProps {
  appliedLog: AppliedCorrection[];
  isChecking?: boolean;
  className?: string;
  compact?: boolean;
}

export function CorrectionThread({
  appliedLog,
  isChecking,
  className,
  compact,
}: CorrectionThreadProps) {
  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-ds-ink">Live</h3>
        <span className="text-xs text-ds-muted">
          {isChecking
            ? "Analyse…"
            : `${appliedLog.length} correction${appliedLog.length === 1 ? "" : "s"}`}
        </span>
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto",
          compact && "max-h-36"
        )}
      >
        {appliedLog.length === 0 ? (
          <p className="rounded-xl border border-dashed border-ds-border bg-ds-canvas/50 px-3 py-4 text-center text-xs text-ds-muted">
            {isChecking
              ? "Correction en cours…"
              : "Les fautes se corrigent phrase par phrase pendant que vous écrivez."}
          </p>
        ) : (
          appliedLog.slice(0, compact ? 8 : 30).map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-2 rounded-xl border border-ds-border/50 bg-ds-canvas/40 px-2.5 py-2"
            >
              <Pill tone={CATEGORY_TONES[item.category]} className="shrink-0">
                {CATEGORY_LABELS[item.category]}
              </Pill>
              <div className="min-w-0 flex-1 text-xs leading-snug">
                <p className="truncate text-ds-ink">
                  <span className="text-ds-muted line-through">
                    {item.original}
                  </span>
                  <span className="mx-1 text-ds-muted">→</span>
                  <span className="font-semibold">{item.replacement}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
