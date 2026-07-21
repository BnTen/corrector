"use client";

import * as React from "react";
import { Check, Copy, FileCheck2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/i18n/provider";

export interface CleanTextPanelProps {
  text: string;
  correctionCount?: number;
  className?: string;
}

export function CleanTextPanel({
  text,
  correctionCount = 0,
  className,
}: CleanTextPanelProps) {
  const { t } = useI18n();
  const [copied, setCopied] = React.useState(false);
  const trimmed = text.trim();
  const isEmpty = trimmed.length === 0;

  const handleCopy = React.useCallback(async () => {
    if (isEmpty) return;
    try {
      await navigator.clipboard.writeText(trimmed);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = trimmed;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }, [isEmpty, trimmed]);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[14px] border border-ds-border/70 bg-ds-elevated shadow-ds-sm",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-ds-border/60 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ds-inverse text-ds-lime">
            <FileCheck2 className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-ds-ink">
              {t("editor.cleanTitle")}
            </h3>
            {correctionCount > 0 ? (
              <p className="text-[11px] text-ds-muted">
                {correctionCount} {t("editor.corr")}
              </p>
            ) : null}
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={handleCopy}
          disabled={isEmpty}
          className={cn(
            "shrink-0 rounded-full font-semibold",
            copied && "bg-emerald-600 text-white hover:bg-emerald-600"
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              {t("common.copied")}
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              {t("common.copy")}
            </>
          )}
        </Button>
      </div>

      <div className="px-3 py-2.5">
        {isEmpty ? (
          <p className="rounded-lg border border-dashed border-ds-border bg-ds-canvas/40 px-3 py-3 text-center text-xs text-ds-muted">
            {t("editor.cleanEmpty")}
          </p>
        ) : (
          <div
            className="max-h-[120px] overflow-y-auto rounded-lg bg-ds-canvas/40 px-3 py-2 text-sm leading-relaxed text-ds-ink"
            aria-label={t("editor.cleanTitle")}
          >
            <p className="whitespace-pre-wrap">{trimmed}</p>
          </div>
        )}
      </div>
    </section>
  );
}
