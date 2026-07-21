"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import {
  GameResultScreen,
  GameSessionShell,
} from "@/features/quiz/components/game-session-shell";
import type { SwipeCard } from "@/features/quiz/lib/quiz-generator";
import { persistQuizAttempt } from "@/features/quiz/lib/persist-attempt";
import { Button } from "@/shared/components/ui/button";
import { Pill } from "@/shared/components/ui/pill";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/i18n/provider";

const SWIPE_THRESHOLD = 110;

export interface SwipeGameProps {
  cards: SwipeCard[];
  onExit: () => void;
}

export function SwipeGame({ cards, onExit }: SwipeGameProps) {
  const { t } = useI18n();
  const [index, setIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [dragX, setDragX] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [flyOut, setFlyOut] = React.useState<"left" | "right" | null>(null);
  const startX = React.useRef(0);
  const locked = React.useRef(false);

  const card = cards[index];
  const total = cards.length;

  const advance = React.useCallback(
    (correct: boolean, direction: "left" | "right", given: string) => {
      if (!card || locked.current) return;
      locked.current = true;
      setFlyOut(direction);
      if (correct) setScore((s) => s + 1);

      void persistQuizAttempt({
        exerciseType: "swipe",
        category: card.category,
        correct,
        payload: {
          exerciseId: card.id,
          answer: card.answer,
          given,
          isCorrectForm: card.isCorrectForm,
        },
      });

      window.setTimeout(() => {
        setFlyOut(null);
        setDragX(0);
        locked.current = false;
        if (index + 1 >= total) setDone(true);
        else setIndex((i) => i + 1);
      }, 280);
    },
    [card, index, total]
  );

  function judge(saidCorrect: boolean) {
    if (!card) return;
    const correct = saidCorrect === card.isCorrectForm;
    advance(correct, saidCorrect ? "right" : "left", saidCorrect ? "ok" : "fault");
  }

  function onPointerDown(e: React.PointerEvent) {
    if (locked.current || flyOut) return;
    startX.current = e.clientX;
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging || locked.current) return;
    setDragX(e.clientX - startX.current);
  }

  function onPointerUp() {
    if (!dragging || locked.current) return;
    setDragging(false);
    if (dragX > SWIPE_THRESHOLD) judge(true);
    else if (dragX < -SWIPE_THRESHOLD) judge(false);
    else setDragX(0);
  }

  function reset() {
    setIndex(0);
    setScore(0);
    setDone(false);
    setDragX(0);
    setFlyOut(null);
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
        title={t("quiz.games.swipe.title")}
        score={score}
        total={total}
        onReplay={reset}
        onHub={onExit}
      />
    );
  }

  if (!card) return null;

  const renderX = flyOut === "right" ? 420 : flyOut === "left" ? -420 : dragX;
  const rot = renderX / 18;
  const approveOpacity = Math.min(1, Math.max(0, renderX / 90));
  const rejectOpacity = Math.min(1, Math.max(0, -renderX / 90));

  const highlightedSentence = card.sentence.includes(card.highlighted)
    ? card.sentence.split(card.highlighted).reduce<React.ReactNode[]>(
        (acc, part, i, arr) => {
          acc.push(part);
          if (i < arr.length - 1) {
            acc.push(
              <mark
                key={`h-${i}`}
                className="rounded bg-ds-yellow/80 px-1 font-semibold text-ds-ink"
              >
                {card.highlighted}
              </mark>
            );
          }
          return acc;
        },
        []
      )
    : card.sentence;

  return (
    <GameSessionShell
      title={t("quiz.games.swipe.title")}
      subtitle={t("quiz.games.swipe.hint")}
      index={index}
      total={total}
      score={score}
      accentClass="bg-ds-coral"
      onBack={onExit}
      footer={
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            className="h-12 rounded-full border-ds-coral/40 text-ds-coral"
            onClick={() => judge(false)}
          >
            <X className="h-4 w-4" />
            {t("quiz.swipeFault")}
          </Button>
          <Button
            type="button"
            className="h-12 rounded-full bg-emerald-600 text-white hover:bg-emerald-600/90"
            onClick={() => judge(true)}
          >
            <Check className="h-4 w-4" />
            {t("quiz.swipeOk")}
          </Button>
        </div>
      }
    >
      <div className="relative flex flex-1 items-center justify-center py-4">
        <div
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border-2 border-ds-coral bg-ds-elevated px-3 py-1 text-xs font-bold uppercase tracking-wide text-ds-coral"
          style={{ opacity: rejectOpacity }}
        >
          {t("quiz.swipeFault")}
        </div>
        <div
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border-2 border-emerald-600 bg-ds-elevated px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700"
          style={{ opacity: approveOpacity }}
        >
          {t("quiz.swipeOk")}
        </div>

        <div
          role="button"
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className={cn(
            "relative w-full max-w-md cursor-grab touch-none select-none active:cursor-grabbing",
            "rounded-ds-lg border border-ds-border/60 bg-ds-elevated p-6 shadow-ds-md",
            !dragging && !flyOut && "transition-transform duration-200"
          )}
          style={{
            transform: `translateX(${renderX}px) rotate(${rot}deg)`,
          }}
        >
          <div className="mb-4 flex items-center justify-between gap-2">
            <Pill tone="coral">{card.category}</Pill>
            <span className="text-[11px] text-ds-muted">
              {t("quiz.swipeDrag")}
            </span>
          </div>
          <p className="text-sm text-ds-muted">{card.prompt}</p>
          <p className="mt-4 text-xl leading-relaxed text-ds-ink sm:text-2xl">
            {highlightedSentence}
          </p>
        </div>
      </div>
    </GameSessionShell>
  );
}
