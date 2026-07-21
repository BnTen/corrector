"use client";

import * as React from "react";
import { Pill } from "@/shared/components/ui/pill";
import { cn } from "@/shared/lib/cn";
import type { AppliedCorrection } from "@/features/editor/lib/apply-matches";
import {
  CATEGORY_LABELS,
  CATEGORY_TONES,
} from "@/features/editor/lib/category-meta";
import { useI18n } from "@/shared/i18n/provider";

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
  const { t, locale } = useI18n();

  function categoryLabel(category: AppliedCorrection["category"]) {
    const key = `categories.${category}` as const;
    const translated = t(key);
    return translated === key ? CATEGORY_LABELS[category] : translated;
  }

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-ds-ink">
          {t("editor.threadLive")}
        </h3>
        <span className="text-xs text-ds-muted">
          {isChecking
            ? t("editor.analyzing")
            : `${appliedLog.length} ${t("editor.corr")}`}
        </span>
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto",
          compact && "max-h-28"
        )}
      >
        {appliedLog.length === 0 ? (
          <p className="rounded-lg border border-dashed border-ds-border bg-ds-canvas/40 px-3 py-3 text-center text-xs text-ds-muted">
            {t("editor.threadEmpty")}
          </p>
        ) : (
          appliedLog.slice(0, compact ? 6 : 20).map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-2 rounded-lg border border-ds-border/50 bg-ds-canvas/40 px-2 py-1.5"
            >
              <Pill tone={CATEGORY_TONES[item.category]} className="shrink-0">
                {locale === "en"
                  ? categoryLabel(item.category)
                  : CATEGORY_LABELS[item.category]}
              </Pill>
              <div className="min-w-0 flex-1 text-xs leading-snug">
                <p className="truncate text-ds-ink">
                  <span className="text-ds-muted line-through">
                    {item.original}
                  </span>
                  {" → "}
                  <span className="font-medium">{item.replacement}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
