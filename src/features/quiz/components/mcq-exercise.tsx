"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/cn";

export interface McqExerciseProps {
  prompt: string;
  options: string[];
  answer: string;
  onResult?: (correct: boolean, value: string) => void;
  disabled?: boolean;
}

export function McqExercise({
  prompt,
  options,
  answer,
  onResult,
  disabled,
}: McqExerciseProps) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<"idle" | "correct" | "wrong">(
    "idle"
  );

  function handleSelect(option: string) {
    if (disabled || status !== "idle") return;
    setSelected(option);
    const correct = option.trim().toLowerCase() === answer.trim().toLowerCase();
    setStatus(correct ? "correct" : "wrong");
    onResult?.(correct, option);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-ds-muted">{prompt}</p>
      <div className="grid gap-2">
        {options.map((option) => {
          const isSelected = selected === option;
          const isAnswer = option === answer;
          return (
            <Button
              key={option}
              type="button"
              variant="secondary"
              disabled={disabled || status !== "idle"}
              onClick={() => handleSelect(option)}
              className={cn(
                "justify-start",
                isSelected && status === "correct" && "border-ds-lime bg-ds-lime/30",
                isSelected && status === "wrong" && "border-ds-coral bg-ds-coral/10",
                status !== "idle" && isAnswer && "border-ds-lime bg-ds-lime/20"
              )}
            >
              {option}
            </Button>
          );
        })}
      </div>
      {status === "correct" ? (
        <p className="text-sm text-ds-ink">Bonne réponse ✓</p>
      ) : null}
      {status === "wrong" ? (
        <p className="text-sm text-ds-coral">
          Incorrect — réponse : {answer}
        </p>
      ) : null}
    </div>
  );
}
