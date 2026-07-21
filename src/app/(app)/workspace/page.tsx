"use client";

import { WorkspaceShell } from "@/shared/components/layout/workspace-shell";
import { EditorScene } from "@/features/editor/components/editor-scene";
import { AnalyticsPanel } from "@/features/analytics/components/analytics-panel";
import { QuizPanel } from "@/features/quiz/components/quiz-panel";

export default function WorkspacePage() {
  return (
    <WorkspaceShell
      analytics={<AnalyticsPanel className="h-full" />}
      quiz={<QuizPanel className="h-full" />}
    >
      <EditorScene />
    </WorkspaceShell>
  );
}
