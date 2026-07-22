"use client";

import * as React from "react";
import { WorkspaceShell } from "@/shared/components/layout/workspace-shell";
import { EditorScene } from "@/features/editor/components/editor-scene";
import { AnalyticsPanel } from "@/features/analytics/components/analytics-panel";
import { ClasseurPanel } from "@/features/archives/components/classeur-panel";
import type { AppliedCorrection } from "@/features/editor/lib/apply-matches";
import type { ArchiveEntry } from "@/features/archives/lib/classeur-storage";
import {
  compileErrorFrequency,
  topMistakePairs,
} from "@/features/archives/lib/classeur-storage";

export function WorkspacePageClient({
  showAdmin = false,
}: {
  showAdmin?: boolean;
}) {
  const [appliedLog, setAppliedLog] = React.useState<AppliedCorrection[]>([]);
  const [archiveTick, setArchiveTick] = React.useState(0);
  const [activeArchiveId, setActiveArchiveId] = React.useState<string | null>(
    null
  );
  const [binderOpen, setBinderOpen] = React.useState(false);
  const [loadContent, setLoadContent] = React.useState<{
    html?: string;
    text: string;
    archiveId?: string;
    nonce: number;
  } | null>(null);

  // Stats are scoped to the active correction only (not the whole binder),
  // so a brand-new empty text does not show empty Accuracy / 0 Mistakes tiles.
  const matchCategories = React.useMemo(
    () => compileErrorFrequency([], appliedLog),
    [appliedLog]
  );

  const topMistakes = React.useMemo(
    () => topMistakePairs([], appliedLog, 6),
    [appliedLog]
  );

  const totalErrors = Object.values(matchCategories).reduce((a, b) => a + b, 0);
  const totalWords =
    appliedLog.length === 0
      ? 0
      : Math.max(totalErrors * 4, appliedLog.length * 4);

  const handleOpenArchive = React.useCallback((entry: ArchiveEntry) => {
    setActiveArchiveId(entry.id);
    setLoadContent({
      html: entry.html,
      text: entry.content,
      archiveId: entry.id,
      nonce: Date.now(),
    });
    setAppliedLog(entry.corrections ?? []);
    setBinderOpen(false);
  }, []);

  const handleCreated = React.useCallback((entry: ArchiveEntry) => {
    setArchiveTick((n) => n + 1);
    setActiveArchiveId(entry.id);
    setLoadContent({
      html: entry.html ?? "<p></p>",
      text: "",
      archiveId: entry.id,
      nonce: Date.now(),
    });
    setAppliedLog([]);
    setBinderOpen(false);
  }, []);

  return (
    <WorkspaceShell
      showAdmin={showAdmin}
      binderOpen={binderOpen}
      onBinderOpenChange={setBinderOpen}
      classeur={
        <ClasseurPanel
          refreshKey={archiveTick}
          activeId={activeArchiveId}
          onOpen={handleOpenArchive}
          onCreated={handleCreated}
          rail
        />
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <EditorScene
          className="min-h-0 flex-1"
          onAppliedLogChange={setAppliedLog}
          onArchiveSaved={() => setArchiveTick((n) => n + 1)}
          loadContent={loadContent}
        />

        <AnalyticsPanel
          className="shrink-0"
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
      </div>
    </WorkspaceShell>
  );
}
