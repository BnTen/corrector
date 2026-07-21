export type ErrorCategory =
  | "spelling"
  | "grammar"
  | "conjugation"
  | "punctuation"
  | "style";

export interface LintMatch {
  id: string;
  offset: number;
  length: number;
  message: string;
  shortMessage?: string;
  replacements: string[];
  category: ErrorCategory;
  ruleId?: string;
  context?: string;
}

export interface Profile {
  id: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  locale: "fr" | "en-US";
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  content: string;
  language: "fr" | "en-US";
  createdAt: string;
  updatedAt: string;
}

export interface ErrorEvent {
  id: string;
  userId: string;
  documentId: string | null;
  category: ErrorCategory;
  ruleId: string | null;
  message: string;
  accepted: boolean | null;
  createdAt: string;
}

export interface UserStats {
  userId: string;
  totalChecks: number;
  totalErrors: number;
  errorsByCategory: Record<ErrorCategory, number>;
  streakDays: number;
  lastActiveAt: string | null;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  category: ErrorCategory | null;
  score: number;
  totalQuestions: number;
  completedAt: string;
}
