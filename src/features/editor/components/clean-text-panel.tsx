"use client";

import * as React from "react";
import { Check, Copy, FileCheck2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/cn";

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
      // Fallback
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
        "overflow-hidden rounded-[16px] border border-ds-border/70 bg-ds-elevated shadow-ds-md",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ds-border/60 bg-gradient-to-r from-ds-canvas via-white to-ds-lime/20 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ds-inverse text-ds-lime">
            <FileCheck2 className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-ds-ink">
              Texte corrigé
            </h3>
            <p className="text-xs text-ds-muted">
              Version propre, prête à coller
              {correctionCount > 0 ? ` · ${correctionCount} corr.` : ""}
            </p>
          </div>
        </div>

        <Button
          type="button"
          size="lg"
          onClick={handleCopy}
          disabled={isEmpty}
          className={cn(
            "min-w-[160px] rounded-full font-semibold shadow-ds-md transition-all",
            copied
              ? "bg-emerald-600 text-white hover:bg-emerald-600"
              : "bg-ds-inverse text-white hover:bg-ds-inverse/90"
          )}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copié !
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copier le texte
            </>
          )}
        </Button>
      </div>

      <div className="px-4 py-4 sm:px-5 sm:py-5">
        {isEmpty ? (
          <p className="rounded-xl border border-dashed border-ds-border bg-ds-canvas/50 px-4 py-8 text-center text-sm text-ds-muted">
            Ton texte corrigé apparaîtra ici, sans barrés ni surlignages.
          </p>
        ) : (
          <div
            className="max-h-[240px] overflow-y-auto rounded-xl bg-ds-canvas/40 px-4 py-3 text-[15px] leading-relaxed text-ds-ink sm:max-h-[280px]"
            aria-label="Texte corrigé sans décoration"
          >
            <p className="whitespace-pre-wrap">{trimmed}</p>
          </div>
        )}
      </div>
    </section>
  );
}
