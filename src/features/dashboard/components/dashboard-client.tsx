"use client";

import * as React from "react";
import Link from "next/link";
import { AppPageShell } from "@/shared/components/layout/app-page-shell";
import { PageHeader } from "@/shared/components/layout/page-header";
import { AnalyticsPanel } from "@/features/analytics/components/analytics-panel";
import { ClasseurPanel } from "@/features/archives/components/classeur-panel";
import { MetricTile } from "@/shared/components/ui/metric-tile";
import { Panel } from "@/shared/components/ui/panel";
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
    <AppPageShell navItems={nav}>
      <PageHeader
        title={t("dashboard.title")}
        description={t("dashboard.subtitle")}
        actions={
          <Button asChild variant="secondary" className="rounded-full">
            <Link href="/workspace">{t("common.openEditor")}</Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
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

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
        <AnalyticsPanel
          className="min-h-[320px]"
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
        <div className="flex min-h-0 flex-col gap-3">
          <Panel
            as="section"
            title={t("binder.title")}
            description={t("binder.desc")}
            className="min-h-[280px] flex-1"
          >
            <ClasseurPanel
              showHeader={false}
              onOpen={() => {
                window.location.href = "/workspace";
              }}
            />
          </Panel>
          <Button asChild variant="secondary" className="w-full rounded-full sm:w-auto sm:self-start">
            <Link href="/quiz">{t("nav.quiz")}</Link>
          </Button>
        </div>
      </div>
    </AppPageShell>
  );
}
