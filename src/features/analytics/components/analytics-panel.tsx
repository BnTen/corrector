"use client";

import * as React from "react";
import { MetricTile } from "@/shared/components/ui/metric-tile";
import { Panel } from "@/shared/components/ui/panel";
import { Pill } from "@/shared/components/ui/pill";
import {
  categoryBreakdown,
  computeAccuracy,
} from "@/features/analytics/lib/score-utils";
import { cn } from "@/shared/lib/cn";

export interface AnalyticsStats {
  totalChecks?: number;
  totalErrors?: number;
  accuracyScore?: number;
  totalWords?: number;
  byCategory?: Record<string, number>;
}

export interface AnalyticsPanelProps {
  stats?: AnalyticsStats;
  matchCategories?: Record<string, number>;
  accuracy?: number;
  totalErrors?: number;
  totalChecks?: number;
  totalWords?: number;
  className?: string;
}

const CATEGORY_TONE: Record<
  string,
  "coral" | "pink" | "lavender" | "yellow" | "sky" | "default"
> = {
  spelling: "coral",
  grammar: "pink",
  conjugation: "lavender",
  punctuation: "yellow",
  style: "sky",
};

const CATEGORY_LABEL: Record<string, string> = {
  spelling: "Orthographe",
  grammar: "Grammaire",
  conjugation: "Conjugaison",
  punctuation: "Ponctuation",
  style: "Style",
};

function ActivityHeatmap() {
  const cells = React.useMemo(
    () =>
      Array.from({ length: 7 * 12 }, (_, i) => {
        const level = i % 7 === 0 ? 0 : (i * 3) % 4;
        return level;
      }),
    []
  );

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-ds-muted">
        Activité (aperçu)
      </p>
      <div
        className="grid grid-cols-12 gap-1"
        aria-hidden
        title="Heatmap placeholder"
      >
        {cells.map((level, index) => (
          <span
            key={index}
            className={cn(
              "aspect-square rounded-[3px]",
              level === 0 && "bg-ds-border/80",
              level === 1 && "bg-[#9aa3b2]",
              level === 2 && "bg-[#2f3a56]",
              level === 3 && "bg-ds-coral/80"
            )}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 text-[10px] text-ds-muted">
        <span className="inline-block h-2 w-2 rounded-[2px] bg-ds-border/80" />
        Faible
        <span className="inline-block h-2 w-2 rounded-[2px] bg-[#2f3a56]" />
        Moyen
        <span className="inline-block h-2 w-2 rounded-[2px] bg-ds-coral/80" />
        Fort
      </div>
    </div>
  );
}

export function AnalyticsPanel({
  stats,
  matchCategories,
  accuracy,
  totalErrors,
  totalChecks,
  totalWords,
  className,
}: AnalyticsPanelProps) {
  const categories = matchCategories ?? stats?.byCategory ?? {};
  const errors =
    totalErrors ??
    stats?.totalErrors ??
    Object.values(categories).reduce((a, b) => a + b, 0);
  const checks = totalChecks ?? stats?.totalChecks ?? 0;
  const words = totalWords ?? stats?.totalWords ?? 0;
  const precision =
    accuracy ??
    stats?.accuracyScore ??
    computeAccuracy({
      totalErrors: errors,
      totalWords: words || undefined,
      acceptedErrors: 0,
    });

  const breakdown = categoryBreakdown(categories);

  return (
    <Panel
      title="Analytics"
      description="Précision et répartition des fautes"
      className={className}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <MetricTile
            label="Précision"
            value={`${precision}%`}
            accent="lime"
          />
          <MetricTile
            label="Fautes détectées"
            value={errors}
            accent="coral"
          />
          <MetricTile label="Checks" value={checks} accent="sky" />
          <MetricTile label="Mots" value={words} accent="lavender" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-ds-muted">
            Par catégorie
          </p>
          {breakdown.length === 0 ? (
            <p className="text-sm text-ds-muted">
              Aucune faute pour le moment — lancez une correction.
            </p>
          ) : (
            <ul className="space-y-2">
              {breakdown.map((item) => (
                <li key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <Pill tone={CATEGORY_TONE[item.category] ?? "default"}>
                      {CATEGORY_LABEL[item.category] ?? item.category}
                    </Pill>
                    <span className="text-xs tabular-nums text-ds-muted">
                      {item.count} · {item.share}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-ds-canvas">
                    <div
                      className="h-full rounded-full bg-ds-inverse/80 transition-all"
                      style={{ width: `${Math.min(100, item.share)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <ActivityHeatmap />
      </div>
    </Panel>
  );
}
