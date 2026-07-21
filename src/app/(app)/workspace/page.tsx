"use client";

import * as React from "react";
import { WorkspaceShell } from "@/shared/components/layout/workspace-shell";
import { EditorScene } from "@/features/editor/components/editor-scene";
import { AnalyticsPanel } from "@/features/analytics/components/analytics-panel";
import { QuizPanel } from "@/features/quiz/components/quiz-panel";
import { ClasseurPanel } from "@/features/archives/components/classeur-panel";
import type { AppliedCorrection } from "@/features/editor/lib/apply-matches";
import type { ArchiveEntry } from "@/features/archives/lib/classeur-storage";
import {
  compileErrorFrequency,
  loadArchives,
  topMistakePairs,
} from "@/features/archives/lib/classeur-storage";

export default function WorkspacePage() {
  const [appliedLog, setAppliedLog] = React.useState<AppliedCorrection[]>([]);
  const [archiveTick, setArchiveTick] = React.useState(0);
  const [loadContent, setLoadContent] = React.useState<{
    html?: string;
    text: string;
    archiveId?: string;
    nonce: number;
  } | null>(null);

  const archives = React.useMemo(() => {
    void archiveTick;
    return loadArchives();
  }, [archiveTick]);

  const matchCategories = React.useMemo(
    () => compileErrorFrequency(archives, appliedLog),
    [archives, appliedLog]
  );

  const topMistakes = React.useMemo(
    () => topMistakePairs(archives, appliedLog, 6),
    [archives, appliedLog]
  );

  const totalErrors = Object.values(matchCategories).reduce((a, b) => a + b, 0);
  const totalWords = Math.max(totalErrors * 4, appliedLog.length * 4, 0);

  const handleOpenArchive = React.useCallback((entry: ArchiveEntry) => {
    setLoadContent({
      html: entry.html,
      text: entry.content,
      archiveId: entry.id,
      nonce: Date.now(),
    });
    setAppliedLog(entry.corrections ?? []);
  }, []);

  return (
    <WorkspaceShell
      analytics={
        <AnalyticsPanel
          className="h-full"
          matchCategories={matchCategories}
          topMistakes={topMistakes}
          totalErrors={totalErrors}
          totalChecks={totalErrors}
          totalWords={totalWords}
          accuracy={
            totalErrors === 0
              ? 100
              : Math.max(0, Math.round(100 - Math.min(45, totalErrors * 0.8)))
          }
        />
      }
      classeur={
        <ClasseurPanel
          className="h-full"
          refreshKey={archiveTick}
          onOpen={handleOpenArchive}
        />
      }
      quiz={<QuizPanel className="h-full" />}
    >
      <EditorScene
        onAppliedLogChange={setAppliedLog}
        onArchiveSaved={() => setArchiveTick((n) => n + 1)}
        loadContent={loadContent}
      />
    </WorkspaceShell>
  );
}
