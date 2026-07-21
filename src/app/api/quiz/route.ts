import { NextResponse } from "next/server";
import {
  generateExercisesFromErrors,
  type ErrorLike,
  type QuizExercise,
} from "@/features/quiz/lib/quiz-generator";
import { createClient } from "@/server/supabase/server";
import {
  isSupabaseConfigured,
  requireUser,
} from "@/server/security/require-user";

const MOCK_ERRORS: ErrorLike[] = [
  {
    category: "spelling",
    message: "Faute d'orthographe possible",
    original: "langage",
    replacement: "langage",
    contextSnippet: "Le langage naturel...",
    ruleId: "FR_SPELLING_MOCK",
  },
  {
    category: "conjugation",
    message: "Accord du verbe incorrect",
    original: "sont",
    replacement: "est",
    contextSnippet: "La solution sont claire.",
    ruleId: "FR_CONJUGATION_MOCK",
  },
  {
    category: "grammar",
    message: "Accord en genre",
    original: "belle",
    replacement: "beau",
    contextSnippet: "Un belle jour.",
    ruleId: "FR_GRAMMAR_MOCK",
  },
  {
    category: "punctuation",
    message: "Espace avant ponctuation",
    original: "bonjour!",
    replacement: "bonjour !",
    contextSnippet: "Dire bonjour!",
    ruleId: "FR_PUNCT_MOCK",
  },
];

export async function GET() {
  let exercises: QuizExercise[] = [];

  if (!isSupabaseConfigured()) {
    exercises = generateExercisesFromErrors(MOCK_ERRORS, 6);
    return NextResponse.json({ exercises, mock: true });
  }

  const user = await requireUser();
  if (!user) {
    exercises = generateExercisesFromErrors(MOCK_ERRORS, 6);
    return NextResponse.json({ exercises, mock: true });
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("error_events")
      .select(
        "category, message, original, replacement, context_snippet, rule_id"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(40);

    if (error) {
      exercises = generateExercisesFromErrors(MOCK_ERRORS, 6);
      return NextResponse.json({ exercises, mock: true, warning: error.message });
    }

    const errorLikes: ErrorLike[] = (data ?? []).map((row) => ({
      category: row.category,
      message: row.message,
      original: row.original,
      replacement: row.replacement,
      contextSnippet: row.context_snippet,
      ruleId: row.rule_id,
    }));

    const source = errorLikes.length > 0 ? errorLikes : MOCK_ERRORS;
    exercises = generateExercisesFromErrors(source, 6);

    return NextResponse.json({
      exercises,
      mock: errorLikes.length === 0,
    });
  } catch (err) {
    exercises = generateExercisesFromErrors(MOCK_ERRORS, 6);
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ exercises, mock: true, warning: message });
  }
}
