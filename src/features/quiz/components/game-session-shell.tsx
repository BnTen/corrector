"use client";

import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/i18n/provider";

export interface GameSessionShellProps {
  title: string;
  subtitle?: string;
  index: number;
  total: number;
  score: number;
  accentClass?: string;
  onBack: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function GameSessionShell({
  title,
  subtitle,
  index,
  total,
  score,
  accentClass = "bg-ds-lime",
  onBack,
  children,
  footer,
  className,
}: GameSessionShellProps) {
  const { t } = useI18n();
  const progress = total > 0 ? ((index + 1) / total) * 100 : 0;

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-4", className)}>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full"
          aria-label={t("quiz.backHub")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="truncate text-base font-semibold text-ds-ink sm:text-lg">
              {title}
            </h2>
            <span className="shrink-0 rounded-full bg-ds-inverse px-2.5 py-0.5 text-xs font-semibold tabular-nums text-white">
              {score} pts
            </span>
          </div>
          {subtitle ? (
            <p className="truncate text-xs text-ds-muted">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-medium uppercase tracking-wide text-ds-muted">
          <span>
            {t("quiz.round")} {Math.min(index + 1, total)}/{total}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-ds-border/70">
          <div
            className={cn("h-full rounded-full transition-all duration-300", accentClass)}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      {footer}
    </div>
  );
}

export interface GameResultScreenProps {
  title: string;
  score: number;
  total: number;
  onReplay: () => void;
  onHub: () => void;
}

export function GameResultScreen({
  title,
  score,
  total,
  onReplay,
  onHub,
}: GameResultScreenProps) {
  const { t } = useI18n();
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-8 text-center">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ds-muted">
          {t("quiz.sessionDone")}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-ds-ink">
          {title}
        </h2>
        <p className="text-sm text-ds-muted">{t("quiz.yourScore")}</p>
        <p className="text-5xl font-semibold tabular-nums text-ds-ink">
          {score}
          <span className="text-2xl text-ds-muted">/{total}</span>
        </p>
        <p className="text-sm font-medium text-ds-muted">{pct}%</p>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          className="flex-1 rounded-full"
          onClick={onReplay}
        >
          {t("quiz.playAgain")}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="flex-1 rounded-full"
          onClick={onHub}
        >
          {t("quiz.backHub")}
        </Button>
      </div>
    </div>
  );
}
