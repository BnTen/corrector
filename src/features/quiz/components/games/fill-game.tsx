"use client";

import * as React from "react";
import {
  GameResultScreen,
  GameSessionShell,
} from "@/features/quiz/components/game-session-shell";
import type { FillCard } from "@/features/quiz/lib/quiz-generator";
import { persistQuizAttempt } from "@/features/quiz/lib/persist-attempt";
import { Button } from "@/shared/components/ui/button";
import { Pill } from "@/shared/components/ui/pill";
import { useI18n } from "@/shared/i18n/provider";

export interface FillGameProps {
  cards: FillCard[];
  onExit: () => void;
}

export function FillGame({ cards, onExit }: FillGameProps) {
  const { t } = useI18n();
  const [index, setIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "correct" | "wrong">(
    "idle"
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  const card = cards[index];
  const total = cards.length;

  React.useEffect(() => {
    inputRef.current?.focus();
  }, [index]);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!card || status !== "idle") return;
    const given = value.trim();
    if (!given) return;

    const correct =
      given.toLowerCase() === card.answer.trim().toLowerCase();
    setStatus(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);

    void persistQuizAttempt({
      exerciseType: "fill-blank",
      category: card.category,
      correct,
      payload: {
        exerciseId: card.id,
        answer: card.answer,
        given,
      },
    });

    window.setTimeout(() => {
      setValue("");
      setStatus("idle");
      if (index + 1 >= total) setDone(true);
      else setIndex((i) => i + 1);
    }, 900);
  }

  function reset() {
    setIndex(0);
    setScore(0);
    setDone(false);
    setValue("");
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
        title={t("quiz.games.fill.title")}
        score={score}
        total={total}
        onReplay={reset}
        onHub={onExit}
      />
    );
  }

  if (!card) return null;

  const parts = card.sentence.split("____");

  return (
    <GameSessionShell
      title={t("quiz.games.fill.title")}
      subtitle={t("quiz.games.fill.hint")}
      index={index}
      total={total}
      score={score}
      accentClass="bg-ds-lime"
      onBack={onExit}
    >
      <form
        onSubmit={submit}
        className="flex flex-1 flex-col gap-5 rounded-ds-lg border border-ds-border/60 bg-ds-elevated p-5 shadow-ds-md sm:p-6"
      >
        <Pill tone="lime">{card.category}</Pill>
        <p className="text-sm text-ds-muted">{card.prompt}</p>
        <p className="text-xl leading-relaxed text-ds-ink sm:text-2xl">
          {parts[0]}
          <span className="mx-1 inline-block min-w-[5ch] border-b-2 border-ds-inverse/40 text-center font-semibold text-ds-inverse">
            {value || "…"}
          </span>
          {parts.slice(1).join("____")}
        </p>

        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={status !== "idle"}
          placeholder={t("quiz.yourAnswer")}
          className="h-12 w-full rounded-ds-md border border-ds-border bg-ds-canvas/60 px-4 text-base text-ds-ink outline-none ring-ds-lime focus:ring-2"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />

        <Button
          type="submit"
          disabled={status !== "idle" || !value.trim()}
          className="h-12 rounded-full"
        >
          {t("quiz.validate")}
        </Button>

        {status === "correct" ? (
          <p className="text-sm font-medium text-emerald-700">
            {t("quiz.correct")} ✓
          </p>
        ) : null}
        {status === "wrong" ? (
          <p className="text-sm text-ds-coral">
            {t("quiz.incorrect")} — {card.answer}
          </p>
        ) : null}
      </form>
    </GameSessionShell>
  );
}
