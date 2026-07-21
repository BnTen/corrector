"use client";

import * as React from "react";
import { WorkspaceShell } from "@/shared/components/layout/workspace-shell";
import { EditorScene } from "@/features/editor/components/editor-scene";
import { AnalyticsPanel } from "@/features/analytics/components/analytics-panel";
import { QuizPanel } from "@/features/quiz/components/quiz-panel";
import type { AppliedCorrection } from "@/features/editor/lib/apply-matches";

export default function WorkspacePage() {
  const [appliedLog, setAppliedLog] = React.useState<AppliedCorrection[]>([]);

  const matchCategories = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of appliedLog) {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    }
    return counts;
  }, [appliedLog]);

  const totalErrors = appliedLog.length;
  const totalWords = React.useMemo(() => {
    // rough: not from editor text here; use corrections as activity signal
    return Math.max(totalErrors * 4, totalErrors);
  }, [totalErrors]);

  return (
    <WorkspaceShell
      analytics={
        <AnalyticsPanel
          className="h-full"
          matchCategories={matchCategories}
          totalErrors={totalErrors}
          totalChecks={totalErrors}
          totalWords={totalWords}
          accuracy={
            totalErrors === 0
              ? 100
              : Math.max(0, Math.round(100 - Math.min(40, totalErrors)))
          }
        />
      }
      quiz={<QuizPanel className="h-full" />}
    >
      <EditorScene onAppliedLogChange={setAppliedLog} />
    </WorkspaceShell>
  );
}
