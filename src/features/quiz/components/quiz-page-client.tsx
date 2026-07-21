"use client";

import Link from "next/link";
import { AppPageShell } from "@/shared/components/layout/app-page-shell";
import { PageHeader } from "@/shared/components/layout/page-header";
import { QuizHub } from "@/features/quiz/components/quiz-hub";
import { Button } from "@/shared/components/ui/button";
import { useAppNav } from "@/shared/lib/use-app-nav";
import { useI18n } from "@/shared/i18n/provider";
import { cn } from "@/shared/lib/cn";
import { APP_NARROW_CONTENT } from "@/shared/lib/layout";

export function QuizPageClient({ showAdmin = false }: { showAdmin?: boolean }) {
  const { t } = useI18n();
  const nav = useAppNav("quiz", { showAdmin });

  return (
    <AppPageShell navItems={nav}>
      <div className={cn("mx-auto flex w-full flex-col gap-4", APP_NARROW_CONTENT)}>
        <PageHeader
          title={t("quiz.title")}
          description={t("quiz.pageSubtitle")}
          actions={
            <Button asChild variant="secondary" className="rounded-full">
              <Link href="/workspace">{t("common.openEditor")}</Link>
            </Button>
          }
        />
        <QuizHub />
      </div>
    </AppPageShell>
  );
}
