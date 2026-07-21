"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/cn";

export interface FillBlankExerciseProps {
  sentence: string;
  prompt: string;
  answer: string;
  onResult?: (correct: boolean, value: string) => void;
  disabled?: boolean;
}

export function FillBlankExercise({
  sentence,
  prompt,
  answer,
  onResult,
  disabled,
}: FillBlankExerciseProps) {
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "correct" | "wrong">(
    "idle"
  );

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const normalized = value.trim().toLowerCase();
    const correct = normalized === answer.trim().toLowerCase();
    setStatus(correct ? "correct" : "wrong");
    onResult?.(correct, value);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-ds-muted">{prompt}</p>
      <p className="rounded-[12px] bg-ds-canvas px-3 py-2 text-sm text-ds-ink">
        {sentence}
      </p>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setStatus("idle");
        }}
        disabled={disabled || status === "correct"}
        placeholder="Votre réponse"
        className="h-10 w-full rounded-[12px] border border-ds-border bg-ds-elevated px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ds-lime"
      />
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={disabled || !value.trim()}>
          Valider
        </Button>
        {status === "correct" ? (
          <span className="text-sm text-ds-ink">Correct ✓</span>
        ) : null}
        {status === "wrong" ? (
          <span className={cn("text-sm text-ds-coral")}>
            Incorrect — attendu : {answer}
          </span>
        ) : null}
      </div>
    </form>
  );
}
