"use client";

import * as React from "react";
import Link from "next/link";
import { TopBar } from "@/shared/components/ui/top-bar";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { AnalyticsPanel } from "@/features/analytics/components/analytics-panel";
import { ClasseurPanel } from "@/features/archives/components/classeur-panel";
import { MetricTile } from "@/shared/components/ui/metric-tile";
import { Button } from "@/shared/components/ui/button";
import { useAppNav } from "@/shared/lib/use-app-nav";
import { useI18n } from "@/shared/i18n/provider";
import {
  compileErrorFrequency,
  loadArchives,
  topMistakePairs,
} from "@/features/archives/lib/classeur-storage";

export function DashboardClient({ showAdmin = false }: { showAdmin?: boolean }) {
  const { t } = useI18n();
  const nav = useAppNav("dashboard", { showAdmin });
  const archives = React.useMemo(() => loadArchives(), []);

  const matchCategories = React.useMemo(
    () => compileErrorFrequency(archives, []),
    [archives]
  );
  const topMistakes = React.useMemo(
    () => topMistakePairs(archives, [], 6),
    [archives]
  );

  const totalErrors = Object.values(matchCategories).reduce((a, b) => a + b, 0);
  const totalDocs = archives.length;
  const totalCorrections = archives.reduce(
    (sum, a) => sum + (a.corrections?.length ?? 0),
    0
  );
  const totalWords = Math.max(totalErrors * 4, totalCorrections * 4, 0);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-ds-canvas">
      <TopBar navItems={nav} showEditorCta={false}>
        <SignOutButton />
      </TopBar>

      <div className="mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col gap-4 overflow-y-auto px-3 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-ds-ink sm:text-2xl">
              {t("dashboard.title")}
            </h1>
            <p className="mt-0.5 text-sm text-ds-muted">
              {t("dashboard.subtitle")}
            </p>
          </div>
          <Button asChild className="rounded-full">
            <Link href="/workspace">{t("common.openEditor")}</Link>
          </Button>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <MetricTile
            label={t("dashboard.documents")}
            value={String(totalDocs)}
          />
          <MetricTile
            label={t("dashboard.corrections")}
            value={String(totalCorrections)}
          />
          <MetricTile
            label={t("dashboard.creditsLabel")}
            value={t("common.unlimited")}
            hint={t("dashboard.fullAccount")}
          />
        </div>

        <div className="grid min-h-0 gap-3 lg:grid-cols-2">
          <AnalyticsPanel
            matchCategories={matchCategories}
            topMistakes={topMistakes}
            totalErrors={totalErrors}
            totalChecks={totalErrors}
            totalWords={totalWords}
            accuracy={
              totalErrors === 0
                ? 100
                : Math.max(
                    0,
                    Math.round(100 - Math.min(45, totalErrors * 0.8))
                  )
            }
          />
          <div className="flex flex-col gap-3">
            <ClasseurPanel
              onOpen={() => {
                window.location.href = "/workspace";
              }}
            />
            <Button asChild variant="secondary" className="rounded-full">
              <Link href="/quiz">{t("nav.quiz")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
