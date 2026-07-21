"use client";

import Link from "next/link";
import { TopBar } from "@/shared/components/ui/top-bar";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { QuizPanel } from "@/features/quiz/components/quiz-panel";
import { Button } from "@/shared/components/ui/button";
import { useAppNav } from "@/shared/lib/use-app-nav";
import { useI18n } from "@/shared/i18n/provider";

export function QuizPageClient({ showAdmin = false }: { showAdmin?: boolean }) {
  const { t } = useI18n();
  const nav = useAppNav("quiz", { showAdmin });

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-ds-canvas">
      <TopBar navItems={nav} showEditorCta={false}>
        <SignOutButton />
      </TopBar>

      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto px-3 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-ds-ink sm:text-2xl">
              {t("nav.quiz")}
            </h1>
            <p className="mt-0.5 text-sm text-ds-muted">
              {t("quiz.pageSubtitle")}
            </p>
          </div>
          <Button asChild variant="secondary" className="rounded-full">
            <Link href="/workspace">{t("common.openEditor")}</Link>
          </Button>
        </div>

        <QuizPanel />
      </div>
    </div>
  );
}
