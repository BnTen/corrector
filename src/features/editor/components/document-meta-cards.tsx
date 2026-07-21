"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Pill } from "@/shared/components/ui/pill";
import { cn } from "@/shared/lib/cn";
import type { ErrorCategory, LintMatch } from "@/features/editor/types";
import {
  ALL_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_TONES,
} from "@/features/editor/lib/category-meta";

export interface DocumentMetaCardsProps {
  matches: LintMatch[];
  activeMatch?: LintMatch | null;
  className?: string;
}

function countByCategory(matches: LintMatch[]): Record<ErrorCategory, number> {
  const counts = Object.fromEntries(
    ALL_CATEGORIES.map((c) => [c, 0])
  ) as Record<ErrorCategory, number>;

  for (const match of matches) {
    counts[match.category] = (counts[match.category] ?? 0) + 1;
  }
  return counts;
}

export function DocumentMetaCards({
  matches,
  activeMatch,
  className,
}: DocumentMetaCardsProps) {
  const counts = countByCategory(matches);
  const total = matches.length;

  return (
    <div
      className={cn(
        "grid gap-3 sm:grid-cols-3",
        className
      )}
    >
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm">Erreurs</CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <p className="text-2xl font-semibold tabular-nums text-ds-ink">
            {total}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {ALL_CATEGORIES.filter((c) => counts[c] > 0).map((category) => (
              <Pill key={category} tone={CATEGORY_TONES[category]}>
                {CATEGORY_LABELS[category]} · {counts[category]}
              </Pill>
            ))}
            {total === 0 ? (
              <span className="text-xs text-ds-muted">Aucune pour l’instant</span>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm">Règle active</CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          {activeMatch ? (
            <>
              <Pill tone={CATEGORY_TONES[activeMatch.category]}>
                {CATEGORY_LABELS[activeMatch.category]}
              </Pill>
              <p className="mt-2 truncate text-sm font-medium text-ds-ink">
                {activeMatch.ruleId ?? "Sans identifiant"}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-ds-muted">
                {activeMatch.shortMessage || activeMatch.message}
              </p>
            </>
          ) : (
            <p className="text-sm text-ds-muted">
              Sélectionnez une suggestion pour voir la règle.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm">Légende</CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="flex flex-wrap gap-1.5">
            {ALL_CATEGORIES.map((category) => (
              <Pill key={category} tone={CATEGORY_TONES[category]}>
                {CATEGORY_LABELS[category]}
              </Pill>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
