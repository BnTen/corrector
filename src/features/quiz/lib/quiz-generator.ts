export type ExerciseType = "fill-blank" | "conjugation" | "mcq";

export interface ErrorLike {
  category?: string | null;
  message?: string | null;
  original?: string | null;
  replacement?: string | null;
  contextSnippet?: string | null;
  ruleId?: string | null;
}

export interface QuizExerciseBase {
  id: string;
  type: ExerciseType;
  category: string;
  prompt: string;
  answer: string;
  explanation?: string;
}

export interface FillBlankExercise extends QuizExerciseBase {
  type: "fill-blank";
  sentence: string;
  blankToken: string;
}

export interface ConjugationExercise extends QuizExerciseBase {
  type: "conjugation";
  infinitiveHint: string;
  tenseHint: string;
}

export interface McqExercise extends QuizExerciseBase {
  type: "mcq";
  options: string[];
}

export type QuizExercise =
  | FillBlankExercise
  | ConjugationExercise
  | McqExercise;

function slugId(prefix: string, index: number): string {
  return `${prefix}-${index}-${Math.random().toString(36).slice(2, 8)}`;
}

function pickOriginal(error: ErrorLike): string {
  return (error.original || error.replacement || "mot").trim() || "mot";
}

function pickReplacement(error: ErrorLike): string {
  const original = pickOriginal(error);
  const replacement = (error.replacement || "").trim();
  if (replacement && replacement !== original) return replacement;
  return original;
}

function blankSentence(error: ErrorLike): string {
  const original = pickOriginal(error);
  const snippet = (error.contextSnippet || "").trim();
  if (snippet && snippet.includes(original)) {
    return snippet.replace(original, "____");
  }
  if (snippet) return `${snippet} (____)`;
  return `Complétez : ____`;
}

function distractorsFor(answer: string, pool: string[]): string[] {
  const unique = Array.from(
    new Set(pool.filter((item) => item && item !== answer))
  );
  while (unique.length < 3) {
    unique.push(`${answer}${unique.length + 1}`);
  }
  return unique.slice(0, 3);
}

export function buildFillBlank(
  error: ErrorLike,
  index: number
): FillBlankExercise {
  const answer = pickReplacement(error);
  return {
    id: slugId("fill", index),
    type: "fill-blank",
    category: error.category || "grammar",
    prompt: error.message || "Complétez le blanc avec la forme correcte.",
    sentence: blankSentence(error),
    blankToken: "____",
    answer,
    explanation: error.message || undefined,
  };
}

export function buildConjugation(
  error: ErrorLike,
  index: number
): ConjugationExercise {
  const answer = pickReplacement(error);
  return {
    id: slugId("conj", index),
    type: "conjugation",
    category: error.category || "conjugation",
    prompt: "Conjuguez correctement le verbe dans ce contexte.",
    infinitiveHint: pickOriginal(error),
    tenseHint: "présent / accord",
    answer,
    explanation: error.message || undefined,
  };
}

export function buildMcq(
  error: ErrorLike,
  index: number,
  pool: string[]
): McqExercise {
  const answer = pickReplacement(error);
  const wrong = distractorsFor(answer, pool);
  const options = [answer, ...wrong].sort(() => Math.random() - 0.5);

  return {
    id: slugId("mcq", index),
    type: "mcq",
    category: error.category || "grammar",
    prompt: error.message || "Choisissez la forme correcte.",
    options,
    answer,
    explanation: error.message || undefined,
  };
}

export function generateExercisesFromErrors(
  errors: ErrorLike[],
  limit = 6
): QuizExercise[] {
  if (errors.length === 0) return [];

  const pool = errors
    .flatMap((e) => [e.original, e.replacement])
    .filter((v): v is string => Boolean(v && v.trim()));

  const exercises: QuizExercise[] = [];

  errors.slice(0, limit).forEach((error, index) => {
    const category = (error.category || "").toLowerCase();
    const mod = index % 3;

    if (category.includes("conjug") || mod === 1) {
      exercises.push(buildConjugation(error, index));
    } else if (mod === 2) {
      exercises.push(buildMcq(error, index, pool));
    } else {
      exercises.push(buildFillBlank(error, index));
    }
  });

  return exercises.slice(0, limit);
}
