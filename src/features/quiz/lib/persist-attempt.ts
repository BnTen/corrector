import type { ExerciseType } from "@/features/quiz/lib/quiz-generator";

export async function persistQuizAttempt(input: {
  exerciseType: ExerciseType;
  category?: string | null;
  correct: boolean;
  payload?: Record<string, unknown>;
}): Promise<void> {
  try {
    await fetch("/api/quiz/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    // offline / mock — ignore
  }
}
