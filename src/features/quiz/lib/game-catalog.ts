import type { GameId } from "@/features/quiz/lib/quiz-generator";

export interface GameMeta {
  id: GameId;
  accent: "lime" | "sky" | "coral" | "lavender";
  accentClass: string;
  icon: "swipe" | "mcq" | "fill" | "spot";
}

export const GAME_CATALOG: GameMeta[] = [
  {
    id: "swipe",
    accent: "coral",
    accentClass: "bg-ds-coral/15 text-ds-coral",
    icon: "swipe",
  },
  {
    id: "mcq",
    accent: "sky",
    accentClass: "bg-ds-sky/50 text-ds-ink",
    icon: "mcq",
  },
  {
    id: "fill",
    accent: "lime",
    accentClass: "bg-ds-lime/40 text-ds-ink",
    icon: "fill",
  },
  {
    id: "spot",
    accent: "lavender",
    accentClass: "bg-ds-lavender/50 text-ds-ink",
    icon: "spot",
  },
];
