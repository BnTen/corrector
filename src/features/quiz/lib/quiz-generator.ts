export type GameId = "swipe" | "mcq" | "fill" | "spot";

export type ExerciseType =
  | "fill-blank"
  | "conjugation"
  | "mcq"
  | "swipe"
  | "spot";

export interface ErrorLike {
  category?: string | null;
  message?: string | null;
  original?: string | null;
  replacement?: string | null;
  contextSnippet?: string | null;
  ruleId?: string | null;
}

export interface SwipeCard {
  id: string;
  type: "swipe";
  category: string;
  prompt: string;
  sentence: string;
  highlighted: string;
  /** If true, the highlighted form is correct → swipe right. */
  isCorrectForm: boolean;
  answer: string;
  explanation?: string;
}

export interface McqCard {
  id: string;
  type: "mcq";
  category: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface FillCard {
  id: string;
  type: "fill-blank";
  category: string;
  prompt: string;
  sentence: string;
  blankToken: string;
  answer: string;
  explanation?: string;
}

export interface SpotToken {
  text: string;
  isError: boolean;
}

export interface SpotCard {
  id: string;
  type: "spot";
  category: string;
  prompt: string;
  tokens: SpotToken[];
  answer: string;
  correction: string;
  explanation?: string;
}

export type GameCard = SwipeCard | McqCard | FillCard | SpotCard;

export interface GameDecks {
  swipe: SwipeCard[];
  mcq: McqCard[];
  fill: FillCard[];
  spot: SpotCard[];
}

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

function contextOf(error: ErrorLike): string {
  const snippet = (error.contextSnippet || "").trim();
  if (snippet) return snippet;
  const original = pickOriginal(error);
  return `… ${original} …`;
}

function blankSentence(error: ErrorLike): string {
  const original = pickOriginal(error);
  const snippet = contextOf(error);
  if (snippet.includes(original)) return snippet.replace(original, "____");
  return `${snippet} (____)`;
}

function distractorsFor(answer: string, pool: string[]): string[] {
  const unique = Array.from(
    new Set(pool.filter((item) => item && item !== answer))
  );
  const fallbacks = [
    answer + "s",
    answer.replace(/e$/, "") || `${answer}e`,
    `${answer}ent`,
    "le",
    "la",
    "les",
  ];
  for (const item of fallbacks) {
    if (unique.length >= 3) break;
    if (item && item !== answer && !unique.includes(item)) unique.push(item);
  }
  while (unique.length < 3) unique.push(`${answer}${unique.length + 1}`);
  return unique.slice(0, 3);
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function replaceOnce(haystack: string, needle: string, next: string): string {
  const idx = haystack.indexOf(needle);
  if (idx === -1) return haystack;
  return haystack.slice(0, idx) + next + haystack.slice(idx + needle.length);
}

function tokenizeWithError(
  sentence: string,
  errorWord: string
): SpotToken[] {
  const parts = sentence.split(/(\s+|[,.;:!?«»"'])/);
  let marked = false;
  return parts
    .filter((p) => p.length > 0)
    .map((part) => {
      if (/^\s+$/.test(part) || /^[,.;:!?«»"']$/.test(part)) {
        return { text: part, isError: false };
      }
      if (
        !marked &&
        (part === errorWord ||
          part.toLowerCase() === errorWord.toLowerCase() ||
          part.includes(errorWord))
      ) {
        marked = true;
        return { text: part, isError: true };
      }
      return { text: part, isError: false };
    });
}

export function buildSwipeCard(error: ErrorLike, index: number): SwipeCard {
  const wrong = pickOriginal(error);
  const right = pickReplacement(error);
  const useCorrect = wrong === right ? true : index % 2 === 1;
  const highlighted = useCorrect ? right : wrong;
  const sentence = replaceOnce(contextOf(error), wrong, highlighted);

  return {
    id: slugId("swipe", index),
    type: "swipe",
    category: error.category || "grammar",
    prompt: "Cette forme est-elle correcte ?",
    sentence,
    highlighted,
    isCorrectForm: useCorrect,
    answer: right,
    explanation: error.message || undefined,
  };
}

export function buildMcqCard(
  error: ErrorLike,
  index: number,
  pool: string[]
): McqCard {
  const answer = pickReplacement(error);
  const options = shuffle([answer, ...distractorsFor(answer, pool)]);
  return {
    id: slugId("mcq", index),
    type: "mcq",
    category: error.category || "grammar",
    prompt: error.message || "Quelle est la forme correcte ?",
    options,
    answer,
    explanation: error.message || undefined,
  };
}

export function buildFillCard(error: ErrorLike, index: number): FillCard {
  return {
    id: slugId("fill", index),
    type: "fill-blank",
    category: error.category || "grammar",
    prompt: error.message || "Complète le blanc.",
    sentence: blankSentence(error),
    blankToken: "____",
    answer: pickReplacement(error),
    explanation: error.message || undefined,
  };
}

export function buildSpotCard(error: ErrorLike, index: number): SpotCard {
  const wrong = pickOriginal(error);
  const right = pickReplacement(error);
  const sentence = contextOf(error);
  let tokens = tokenizeWithError(sentence, wrong);

  if (!tokens.some((t) => t.isError)) {
    tokens = [
      { text: "… ", isError: false },
      { text: wrong, isError: true },
      { text: " …", isError: false },
    ];
  }

  return {
    id: slugId("spot", index),
    type: "spot",
    category: error.category || "grammar",
    prompt: "Touche le mot incorrect.",
    tokens,
    answer: wrong,
    correction: right,
    explanation: error.message || undefined,
  };
}

export function generateGameDecks(
  errors: ErrorLike[],
  perGame = 8
): GameDecks {
  const source =
    errors.length > 0
      ? errors
      : ([
          {
            category: "spelling",
            message: "Orthographe",
            original: "langague",
            replacement: "langage",
            contextSnippet: "Le langague naturel est riche.",
          },
        ] satisfies ErrorLike[]);

  const pool = source
    .flatMap((e) => [e.original, e.replacement])
    .filter((v): v is string => Boolean(v && v.trim()));

  // Cycle through errors to fill each deck
  const pick = (n: number) => {
    const out: ErrorLike[] = [];
    for (let i = 0; i < n; i++) out.push(source[i % source.length]!);
    return out;
  };

  return {
    swipe: pick(perGame).map((e, i) => buildSwipeCard(e, i)),
    mcq: pick(perGame).map((e, i) => buildMcqCard(e, i, pool)),
    fill: pick(perGame).map((e, i) => buildFillCard(e, i)),
    spot: pick(perGame).map((e, i) => buildSpotCard(e, i)),
  };
}

/** @deprecated kept for older call sites */
export type QuizExercise = FillCard | McqCard | {
  id: string;
  type: "conjugation";
  category: string;
  prompt: string;
  infinitiveHint: string;
  tenseHint: string;
  answer: string;
  explanation?: string;
};

export function generateExercisesFromErrors(
  errors: ErrorLike[],
  limit = 6
): QuizExercise[] {
  const decks = generateGameDecks(errors, limit);
  return [...decks.fill, ...decks.mcq].slice(0, limit);
}
