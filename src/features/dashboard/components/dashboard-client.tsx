"use client";

import * as React from "react";
import Link from "next/link";
import { TopBar } from "@/shared/components/ui/top-bar";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { AnalyticsPanel } from "@/features/analytics/components/analytics-panel";
import { QuizPanel } from "@/features/quiz/components/quiz-panel";
import { ClasseurPanel } from "@/features/archives/components/classeur-panel";
import { MetricTile } from "@/shared/components/ui/metric-tile";
import { Button } from "@/shared/components/ui/button";
import { appNav } from "@/shared/lib/app-nav";
import {
  compileErrorFrequency,
  loadArchives,
  topMistakePairs,
} from "@/features/archives/lib/classeur-storage";

export function DashboardClient({ showAdmin = false }: { showAdmin?: boolean }) {
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
    <div className="flex min-h-dvh flex-col bg-ds-canvas">
      <TopBar
        navItems={appNav("dashboard", { showAdmin })}
        showEditorCta={false}
      >
        <SignOutButton />
      </TopBar>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-6 px-3 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ds-ink sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-ds-muted">
              Compte connecté · corrections illimitées · progression locale
            </p>
          </div>
          <Button asChild className="rounded-full">
            <Link href="/workspace">Ouvrir l’éditeur</Link>
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <MetricTile label="Documents" value={String(totalDocs)} />
          <MetricTile label="Corrections" value={String(totalCorrections)} />
          <MetricTile
            label="Crédits"
            value="Illimité"
            hint="Compte complet"
          />
        </div>

        <div className="grid min-h-0 gap-4 lg:grid-cols-2">
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
          <div className="flex flex-col gap-4">
            <ClasseurPanel
              className="min-h-[200px]"
              onOpen={() => {
                window.location.href = "/workspace";
              }}
            />
            <QuizPanel className="min-h-[200px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
