"use client";

import * as React from "react";
import { BentoTile } from "@/shared/components/ui/bento-tile";
import { Panel } from "@/shared/components/ui/panel";
import { Pill } from "@/shared/components/ui/pill";
import { FillBlankExercise } from "@/features/quiz/components/fill-blank-exercise";
import { ConjugationExercise } from "@/features/quiz/components/conjugation-exercise";
import { McqExercise } from "@/features/quiz/components/mcq-exercise";
import type { QuizExercise } from "@/features/quiz/lib/quiz-generator";

interface QuizPanelProps {
  className?: string;
}

const CATEGORY_TONE: Record<
  string,
  "coral" | "pink" | "lavender" | "yellow" | "sky" | "default"
> = {
  spelling: "coral",
  grammar: "pink",
  conjugation: "lavender",
  punctuation: "yellow",
  style: "sky",
};

export function QuizPanel({ className }: QuizPanelProps) {
  const [exercises, setExercises] = React.useState<QuizExercise[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [answered, setAnswered] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/quiz");
        if (!res.ok) throw new Error("Impossible de charger le quiz");
        const json = (await res.json()) as { exercises?: QuizExercise[] };
        if (!cancelled) {
          setExercises(json.exercises ?? []);
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

  async function persistAttempt(
    exercise: QuizExercise,
    correct: boolean,
    value: string
  ) {
    setAnswered((prev) => ({ ...prev, [exercise.id]: correct }));
    try {
      await fetch("/api/quiz/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseType: exercise.type,
          category: exercise.category,
          correct,
          payload: {
            exerciseId: exercise.id,
            answer: exercise.answer,
            given: value,
          },
        }),
      });
    } catch {
      // offline / mock — ignore
    }
  }

  return (
    <Panel as="section" className={className}>
      {loading ? (
        <p className="text-sm text-ds-muted">Chargement des exercices…</p>
      ) : null}
      {error ? (
        <p className="text-sm text-ds-coral" role="alert">
          {error}
        </p>
      ) : null}
      {!loading && !error && exercises.length === 0 ? (
        <p className="text-sm text-ds-muted">
          Aucun exercice pour le moment.
        </p>
      ) : null}

      <div className="space-y-3">
        {exercises.map((exercise) => (
          <BentoTile
            key={exercise.id}
            title={
              exercise.type === "fill-blank"
                ? "Texte à trous"
                : exercise.type === "conjugation"
                  ? "Conjugaison"
                  : "QCM"
            }
            className="shadow-ds-sm"
          >
            <div className="mb-3 flex items-center gap-2">
              <Pill tone={CATEGORY_TONE[exercise.category] ?? "default"}>
                {exercise.category}
              </Pill>
              {answered[exercise.id] !== undefined ? (
                <span className="text-xs text-ds-muted">
                  {answered[exercise.id] ? "Réussi" : "À revoir"}
                </span>
              ) : null}
            </div>

            {exercise.type === "fill-blank" ? (
              <FillBlankExercise
                sentence={exercise.sentence}
                prompt={exercise.prompt}
                answer={exercise.answer}
                onResult={(correct, value) =>
                  void persistAttempt(exercise, correct, value)
                }
              />
            ) : null}

            {exercise.type === "conjugation" ? (
              <ConjugationExercise
                prompt={exercise.prompt}
                infinitiveHint={exercise.infinitiveHint}
                tenseHint={exercise.tenseHint}
                answer={exercise.answer}
                onResult={(correct, value) =>
                  void persistAttempt(exercise, correct, value)
                }
              />
            ) : null}

            {exercise.type === "mcq" ? (
              <McqExercise
                prompt={exercise.prompt}
                options={exercise.options}
                answer={exercise.answer}
                onResult={(correct, value) =>
                  void persistAttempt(exercise, correct, value)
                }
              />
            ) : null}
          </BentoTile>
        ))}
      </div>
    </Panel>
  );
}
