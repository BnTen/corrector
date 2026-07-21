"use client";

import * as React from "react";
import {
  GameResultScreen,
  GameSessionShell,
} from "@/features/quiz/components/game-session-shell";
import type { McqCard } from "@/features/quiz/lib/quiz-generator";
import { persistQuizAttempt } from "@/features/quiz/lib/persist-attempt";
import { Pill } from "@/shared/components/ui/pill";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/i18n/provider";

export interface McqGameProps {
  cards: McqCard[];
  onExit: () => void;
}

export function McqGame({ cards, onExit }: McqGameProps) {
  const { t } = useI18n();
  const [index, setIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<"idle" | "correct" | "wrong">(
    "idle"
  );

  const card = cards[index];
  const total = cards.length;

  function handleSelect(option: string) {
    if (!card || status !== "idle") return;
    const correct =
      option.trim().toLowerCase() === card.answer.trim().toLowerCase();
    setSelected(option);
    setStatus(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);

    void persistQuizAttempt({
      exerciseType: "mcq",
      category: card.category,
      correct,
      payload: {
        exerciseId: card.id,
        answer: card.answer,
        given: option,
      },
    });

    window.setTimeout(() => {
      setSelected(null);
      setStatus("idle");
      if (index + 1 >= total) setDone(true);
      else setIndex((i) => i + 1);
    }, 900);
  }

  function reset() {
    setIndex(0);
    setScore(0);
    setDone(false);
    setSelected(null);
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
        title={t("quiz.games.mcq.title")}
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
      title={t("quiz.games.mcq.title")}
      subtitle={t("quiz.games.mcq.hint")}
      index={index}
      total={total}
      score={score}
      accentClass="bg-ds-sky"
      onBack={onExit}
    >
      <div className="flex flex-1 flex-col gap-5 rounded-ds-lg border border-ds-border/60 bg-ds-elevated p-5 shadow-ds-md sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <Pill tone="sky">{card.category}</Pill>
        </div>
        <p className="text-lg font-medium leading-snug text-ds-ink sm:text-xl">
          {card.prompt}
        </p>
        <div className="grid gap-2.5">
          {card.options.map((option, i) => {
            const letter = String.fromCharCode(65 + i);
            const isSelected = selected === option;
            const isAnswer = option === card.answer;
            return (
              <button
                key={`${card.id}-${option}`}
                type="button"
                disabled={status !== "idle"}
                onClick={() => handleSelect(option)}
                className={cn(
                  "flex items-center gap-3 rounded-ds-md border px-4 py-3.5 text-left text-sm font-medium transition sm:text-base",
                  "border-ds-border/70 bg-ds-canvas/50 hover:border-ds-inverse/20 hover:bg-white",
                  isSelected &&
                    status === "correct" &&
                    "border-emerald-500 bg-emerald-50",
                  isSelected &&
                    status === "wrong" &&
                    "border-ds-coral bg-ds-coral/10",
                  status !== "idle" &&
                    isAnswer &&
                    "border-emerald-500 bg-emerald-50"
                )}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ds-inverse text-xs font-bold text-white">
                  {letter}
                </span>
                <span className="min-w-0 flex-1 text-ds-ink">{option}</span>
              </button>
            );
          })}
        </div>
        {status === "wrong" ? (
          <p className="text-sm text-ds-coral">
            {t("quiz.incorrect")} — {card.answer}
          </p>
        ) : null}
        {status === "correct" ? (
          <p className="text-sm font-medium text-emerald-700">
            {t("quiz.correct")} ✓
          </p>
        ) : null}
      </div>
    </GameSessionShell>
  );
}
