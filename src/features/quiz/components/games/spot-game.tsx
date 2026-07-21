"use client";

import * as React from "react";
import {
  GameResultScreen,
  GameSessionShell,
} from "@/features/quiz/components/game-session-shell";
import type { SpotCard } from "@/features/quiz/lib/quiz-generator";
import { persistQuizAttempt } from "@/features/quiz/lib/persist-attempt";
import { Pill } from "@/shared/components/ui/pill";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/i18n/provider";

export interface SpotGameProps {
  cards: SpotCard[];
  onExit: () => void;
}

export function SpotGame({ cards, onExit }: SpotGameProps) {
  const { t } = useI18n();
  const [index, setIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [status, setStatus] = React.useState<"idle" | "correct" | "wrong">(
    "idle"
  );

  const card = cards[index];
  const total = cards.length;

  function handleTap(tokenIndex: number, tokenText: string, isError: boolean) {
    if (!card || status !== "idle") return;
    if (/^\s+$/.test(tokenText) || /^[,.;:!?«»"']$/.test(tokenText)) return;

    setPicked(tokenIndex);
    const correct = isError;
    setStatus(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);

    void persistQuizAttempt({
      exerciseType: "spot",
      category: card.category,
      correct,
      payload: {
        exerciseId: card.id,
        answer: card.answer,
        given: tokenText,
        correction: card.correction,
      },
    });

    window.setTimeout(() => {
      setPicked(null);
      setStatus("idle");
      if (index + 1 >= total) setDone(true);
      else setIndex((i) => i + 1);
    }, 1000);
  }

  function reset() {
    setIndex(0);
    setScore(0);
    setDone(false);
    setPicked(null);
    setStatus("idle");
  }

  if (total === 0) {
    return (
      <div className="py-10 text-center text-sm text-ds-muted">
        {t("quiz.empty")}
      </div>
    );
  }

  if (done) {
    return (
      <GameResultScreen
        title={t("quiz.games.spot.title")}
        score={score}
        total={total}
        onReplay={reset}
        onHub={onExit}
      />
    );
  }

  if (!card) return null;

  return (
    <GameSessionShell
      title={t("quiz.games.spot.title")}
      subtitle={t("quiz.games.spot.hint")}
      index={index}
      total={total}
      score={score}
      accentClass="bg-ds-lavender"
      onBack={onExit}
    >
      <div className="flex flex-1 flex-col gap-5 rounded-ds-lg border border-ds-border/60 bg-ds-elevated p-5 shadow-ds-md sm:p-6">
        <Pill tone="lavender">{card.category}</Pill>
        <p className="text-sm text-ds-muted">{card.prompt}</p>

        <div className="flex flex-wrap content-start gap-1.5 rounded-ds-md bg-ds-canvas/70 p-4">
          {card.tokens.map((token, i) => {
            const isSpace = /^\s+$/.test(token.text);
            const isPunct = /^[,.;:!?«»"']$/.test(token.text);
            if (isSpace) {
              return (
                <span key={`${card.id}-s-${i}`} className="w-1.5" aria-hidden />
              );
            }
            if (isPunct) {
              return (
                <span
                  key={`${card.id}-p-${i}`}
                  className="px-0.5 text-lg text-ds-ink"
                >
                  {token.text}
                </span>
              );
            }

            const isPicked = picked === i;
            const revealError = status !== "idle" && token.isError;

            return (
              <button
                key={`${card.id}-t-${i}`}
                type="button"
                disabled={status !== "idle"}
                onClick={() => handleTap(i, token.text, token.isError)}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-lg font-medium transition sm:text-xl",
                  "bg-white text-ds-ink shadow-ds-sm ring-1 ring-ds-border/60",
                  "hover:ring-ds-inverse/30 active:scale-[0.98]",
                  isPicked &&
                    status === "correct" &&
                    "bg-emerald-100 ring-emerald-500",
                  isPicked &&
                    status === "wrong" &&
                    "bg-ds-coral/15 ring-ds-coral",
                  revealError &&
                    !isPicked &&
                    "bg-ds-yellow/70 ring-ds-inverse/20"
                )}
              >
                {token.text}
              </button>
            );
          })}
        </div>

        {status === "correct" ? (
          <p className="text-sm font-medium text-emerald-700">
            {t("quiz.correct")} → {card.correction}
          </p>
        ) : null}
        {status === "wrong" ? (
          <p className="text-sm text-ds-coral">
            {t("quiz.incorrect")} — « {card.answer} » → {card.correction}
          </p>
        ) : null}
      </div>
    </GameSessionShell>
  );
}
