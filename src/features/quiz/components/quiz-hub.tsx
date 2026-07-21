"use client";

import * as React from "react";
import {
  ArrowRight,
  Crosshair,
  Hand,
  Keyboard,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { SwipeGame } from "@/features/quiz/components/games/swipe-game";
import { McqGame } from "@/features/quiz/components/games/mcq-game";
import { FillGame } from "@/features/quiz/components/games/fill-game";
import { SpotGame } from "@/features/quiz/components/games/spot-game";
import { GAME_CATALOG } from "@/features/quiz/lib/game-catalog";
import type {
  GameDecks,
  GameId,
} from "@/features/quiz/lib/quiz-generator";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/i18n/provider";

const ICONS = {
  swipe: Hand,
  mcq: ListChecks,
  fill: Keyboard,
  spot: Crosshair,
} as const;

export function QuizHub() {
  const { t } = useI18n();
  const [decks, setDecks] = React.useState<GameDecks | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [mock, setMock] = React.useState(false);
  const [active, setActive] = React.useState<GameId | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/quiz");
        if (!res.ok) throw new Error("Impossible de charger les jeux");
        const json = (await res.json()) as {
          decks?: GameDecks;
          mock?: boolean;
        };
        if (!cancelled) {
          if (!json.decks) throw new Error("Decks manquants");
          setDecks(json.decks);
          setMock(Boolean(json.mock));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erreur quiz");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <p className="text-sm text-ds-muted">{t("quiz.loading")}</p>
      </div>
    );
  }

  if (error || !decks) {
    return (
      <div className="rounded-ds-lg border border-ds-coral/30 bg-ds-coral/5 p-6 text-sm text-ds-coral">
        {error ?? t("quiz.empty")}
      </div>
    );
  }

  if (active === "swipe") {
    return <SwipeGame cards={decks.swipe} onExit={() => setActive(null)} />;
  }
  if (active === "mcq") {
    return <McqGame cards={decks.mcq} onExit={() => setActive(null)} />;
  }
  if (active === "fill") {
    return <FillGame cards={decks.fill} onExit={() => setActive(null)} />;
  }
  if (active === "spot") {
    return <SpotGame cards={decks.spot} onExit={() => setActive(null)} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ds-inverse text-ds-lime">
            <Sparkles className="h-4 w-4" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-ds-ink sm:text-xl">
            {t("quiz.hubTitle")}
          </h2>
        </div>
        <p className="text-sm text-ds-muted">{t("quiz.hubSubtitle")}</p>
      </div>

      {mock ? (
        <p className="rounded-ds-md border border-ds-yellow/60 bg-ds-yellow/40 px-3 py-2 text-xs font-medium text-ds-ink">
          {t("quiz.mockBanner")}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {GAME_CATALOG.map((game) => {
          const Icon = ICONS[game.icon];
          const count = decks[game.id].length;
          return (
            <button
              key={game.id}
              type="button"
              onClick={() => setActive(game.id)}
              className={cn(
                "group relative flex flex-col gap-4 overflow-hidden rounded-ds-lg border border-ds-border/60 bg-ds-elevated p-5 text-left shadow-ds-sm transition",
                "hover:-translate-y-0.5 hover:shadow-ds-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-lime"
              )}
            >
              <div
                className={cn(
                  "absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-80",
                  game.accentClass
                )}
                aria-hidden
              />
              <div className="relative flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-2xl",
                    game.accentClass
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-ds-canvas px-2.5 py-1 text-[11px] font-semibold tabular-nums text-ds-muted">
                  {t("quiz.cardsCount", { n: count })}
                </span>
              </div>
              <div className="relative space-y-1.5">
                <h3 className="text-base font-semibold text-ds-ink sm:text-lg">
                  {t(`quiz.games.${game.id}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-ds-muted">
                  {t(`quiz.games.${game.id}.desc`)}
                </p>
              </div>
              <span className="relative inline-flex items-center gap-1.5 text-sm font-semibold text-ds-ink">
                {t("quiz.play")}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
