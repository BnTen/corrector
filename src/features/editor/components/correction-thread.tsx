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

export interface CorrectionThreadProps {
  matches: LintMatch[];
  activeId?: string | null;
  ignoredIds?: Set<string>;
  onSelect?: (match: LintMatch) => void;
  onApply: (match: LintMatch, replacement: string) => void;
  onIgnore: (match: LintMatch) => void;
  isChecking?: boolean;
  className?: string;
}

export function CorrectionThread({
  matches,
  activeId,
  ignoredIds,
  onSelect,
  onApply,
  onIgnore,
  isChecking,
  className,
}: CorrectionThreadProps) {
  const visible = matches.filter((m) => !ignoredIds?.has(m.id));

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-ds-ink">Corrections</h3>
        <span className="text-xs text-ds-muted">
          {isChecking
            ? "Analyse…"
            : `${visible.length} suggestion${visible.length === 1 ? "" : "s"}`}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pr-1">
        {visible.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-ds-border bg-ds-canvas/60 px-4 py-8 text-center text-sm text-ds-muted">
            {isChecking
              ? "Vérification en cours…"
              : "Aucune erreur détectée. Continuez à écrire."}
          </div>
        ) : (
          visible.map((match) => {
            const primary = match.replacements[0];
            const isActive = match.id === activeId;

            return (
              <article
                key={match.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect?.(match)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect?.(match);
                  }
                }}
                className={cn(
                  "rounded-[14px] border bg-ds-elevated px-3.5 py-3 shadow-ds-sm transition-shadow",
                  isActive
                    ? "border-ds-inverse/40 shadow-ds-md ring-1 ring-ds-lime/50"
                    : "border-ds-border/60 hover:shadow-ds-md"
                )}
              >
                <div className="flex items-center gap-2">
                  <Pill tone={CATEGORY_TONES[match.category]}>
                    {CATEGORY_LABELS[match.category]}
                  </Pill>
                  {match.ruleId ? (
                    <span className="truncate text-[10px] text-ds-muted">
                      {match.ruleId}
                    </span>
                  ) : null}
                </div>

                <p className="mt-2 text-sm leading-snug text-ds-ink">
                  {match.message}
                </p>

                {primary ? (
                  <p className="mt-1.5 text-xs text-ds-muted">
                    Suggestion :{" "}
                    <span className="font-medium text-ds-ink">{primary}</span>
                  </p>
                ) : null}

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    disabled={!primary}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (primary) onApply(match, primary);
                    }}
                  >
                    Appliquer
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onIgnore(match);
                    }}
                  >
                    Ignorer
                  </Button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
