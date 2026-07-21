import { NextResponse } from "next/server";
import {
  generateGameDecks,
  type ErrorLike,
  type GameDecks,
} from "@/features/quiz/lib/quiz-generator";
import { createClient } from "@/server/supabase/server";
import {
  isSupabaseConfigured,
  requireUser,
} from "@/server/security/require-user";

const MOCK_ERRORS: ErrorLike[] = [
  {
    category: "spelling",
    message: "Faute d'orthographe",
    original: "langague",
    replacement: "langage",
    contextSnippet: "Le langague naturel est riche.",
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
    contextSnippet: "Un belle jour s'annonce.",
    ruleId: "FR_GRAMMAR_MOCK",
  },
  {
    category: "punctuation",
    message: "Espace avant ponctuation",
    original: "bonjour!",
    replacement: "bonjour !",
    contextSnippet: "Il faut dire bonjour!",
    ruleId: "FR_PUNCT_MOCK",
  },
  {
    category: "spelling",
    message: "Orthographe fréquente",
    original: "acceuil",
    replacement: "accueil",
    contextSnippet: "Bienvenue à l'acceuil du site.",
    ruleId: "FR_SPELLING_MOCK_2",
  },
  {
    category: "grammar",
    message: "Leur / leurs",
    original: "leurs",
    replacement: "leur",
    contextSnippet: "Il faut leurs dire la vérité.",
    ruleId: "FR_GRAMMAR_MOCK_2",
  },
  {
    category: "conjugation",
    message: "Conjugaison présent",
    original: "manger",
    replacement: "mange",
    contextSnippet: "Il manger une pomme chaque matin.",
    ruleId: "FR_CONJUGATION_MOCK_2",
  },
  {
    category: "spelling",
    message: "Accent manquant",
    original: "independance",
    replacement: "indépendance",
    contextSnippet: "L'independance est précieuse.",
    ruleId: "FR_SPELLING_MOCK_3",
  },
];

function decksFrom(source: ErrorLike[]): GameDecks {
  return generateGameDecks(source, 8);
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ decks: decksFrom(MOCK_ERRORS), mock: true });
  }

  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ decks: decksFrom(MOCK_ERRORS), mock: true });
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
      return NextResponse.json({
        decks: decksFrom(MOCK_ERRORS),
        mock: true,
        warning: error.message,
      });
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
    return NextResponse.json({
      decks: decksFrom(source),
      mock: errorLikes.length === 0,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({
      decks: decksFrom(MOCK_ERRORS),
      mock: true,
      warning: message,
    });
  }
}
