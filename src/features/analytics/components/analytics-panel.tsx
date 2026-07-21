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
import { useI18n } from "@/shared/i18n/provider";

export interface AnalyticsStats {
  totalChecks?: number;
  totalErrors?: number;
  accuracyScore?: number;
  totalWords?: number;
  byCategory?: Record<string, number>;
}

export interface MistakePair {
  original: string;
  replacement: string;
  count: number;
}

export interface AnalyticsPanelProps {
  stats?: AnalyticsStats;
  matchCategories?: Record<string, number>;
  topMistakes?: MistakePair[];
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

const BAR_COLOR: Record<string, string> = {
  spelling: "bg-ds-coral",
  grammar: "bg-ds-pink",
  conjugation: "bg-ds-lavender",
  punctuation: "bg-ds-yellow",
  style: "bg-ds-sky",
};

function ErrorFrequencyChart({
  categories,
  emptyLabel,
}: {
  categories: Record<string, number>;
  emptyLabel: string;
}) {
  const breakdown = categoryBreakdown(categories);
  const max = Math.max(...breakdown.map((b) => b.count), 1);

  return (
    <div className="space-y-2">
      {breakdown.length === 0 ? (
        <p className="text-sm text-ds-muted">{emptyLabel}</p>
      ) : (
        <div className="flex h-20 items-end gap-2 px-1">
          {breakdown.map((item) => {
            const height = Math.max(8, Math.round((item.count / max) * 100));
            return (
              <div
                key={item.category}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                title={`${CATEGORY_LABEL[item.category] ?? item.category}: ${item.count}`}
              >
                <span className="text-[10px] font-semibold tabular-nums text-ds-ink">
                  {item.count}
                </span>
                <div
                  className={cn(
                    "w-full max-w-[36px] rounded-t-md transition-all",
                    BAR_COLOR[item.category] ?? "bg-ds-inverse"
                  )}
                  style={{ height: `${height}%` }}
                />
                <span className="max-w-full truncate text-[9px] text-ds-muted">
                  {(CATEGORY_LABEL[item.category] ?? item.category).slice(0, 4)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AnalyticsPanel({
  stats,
  matchCategories,
  topMistakes = [],
  accuracy,
  totalErrors,
  totalChecks,
  totalWords,
  className,
}: AnalyticsPanelProps) {
  const { t } = useI18n();
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
      title={t("nav.stats")}
      description={t("analytics.topMistakes")}
      className={className}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <MetricTile
            label={t("analytics.precision")}
            value={`${precision}%`}
            accent="lime"
          />
          <MetricTile
            label={t("analytics.mistakes")}
            value={errors}
            accent="coral"
          />
          <MetricTile
            label={t("analytics.checks")}
            value={checks}
            accent="sky"
          />
          <MetricTile
            label={t("analytics.words")}
            value={words}
            accent="lavender"
          />
        </div>

        <ErrorFrequencyChart
          categories={categories}
          emptyLabel={t("analytics.noData")}
        />

        <div className="space-y-2">
          {breakdown.length === 0 ? (
            <p className="text-sm text-ds-muted">{t("analytics.noData")}</p>
          ) : (
            <ul className="space-y-2">
              {breakdown.map((item) => (
                <li key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <Pill tone={CATEGORY_TONE[item.category] ?? "default"}>
                      {t(`categories.${item.category}`) !==
                      `categories.${item.category}`
                        ? t(`categories.${item.category}`)
                        : (CATEGORY_LABEL[item.category] ?? item.category)}
                    </Pill>
                    <span className="text-xs tabular-nums text-ds-muted">
                      {item.count} · {item.share}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-ds-canvas">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        BAR_COLOR[item.category] ?? "bg-ds-inverse/80"
                      )}
                      style={{ width: `${Math.min(100, item.share)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {topMistakes.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-ds-muted">
              Tes corrections récurrentes
            </p>
            <ul className="space-y-1.5">
              {topMistakes.map((m) => (
                <li
                  key={`${m.original}-${m.replacement}`}
                  className="flex items-center justify-between gap-2 rounded-lg bg-ds-canvas/60 px-2.5 py-1.5 text-xs"
                >
                  <span className="min-w-0 truncate">
                    <span className="text-ds-muted line-through">
                      {m.original}
                    </span>
                    <span className="mx-1 text-ds-muted">→</span>
                    <span className="font-semibold text-ds-ink">
                      {m.replacement}
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums text-ds-muted">
                    ×{m.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Panel>
  );
}
