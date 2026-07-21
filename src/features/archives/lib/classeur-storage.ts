import type { AppliedCorrection } from "@/features/editor/lib/apply-matches";

export interface ArchiveEntry {
  id: string;
  title: string;
  content: string;
  html?: string;
  corrections: AppliedCorrection[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "tc-classeur-v1";
const MAX_ARCHIVES = 40;

function safeParse(raw: string | null): ArchiveEntry[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as ArchiveEntry[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function loadArchives(): ArchiveEntry[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY)).sort(
    (a, b) => b.updatedAt - a.updatedAt
  );
}

export function saveArchives(entries: ArchiveEntry[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(entries.slice(0, MAX_ARCHIVES))
  );
}

export function upsertArchive(
  entry: Omit<ArchiveEntry, "id" | "createdAt" | "updatedAt"> & {
    id?: string;
  }
): ArchiveEntry {
  const list = loadArchives();
  const now = Date.now();
  const existingIdx = entry.id
    ? list.findIndex((e) => e.id === entry.id)
    : -1;

  if (existingIdx >= 0) {
    const updated: ArchiveEntry = {
      ...list[existingIdx]!,
      ...entry,
      id: list[existingIdx]!.id,
      createdAt: list[existingIdx]!.createdAt,
      updatedAt: now,
    };
    list[existingIdx] = updated;
    saveArchives(list);
    return updated;
  }

  const created: ArchiveEntry = {
    id: entry.id ?? `arch-${now}-${Math.random().toString(36).slice(2, 8)}`,
    title: entry.title,
    content: entry.content,
    html: entry.html,
    corrections: entry.corrections,
    createdAt: now,
    updatedAt: now,
  };
  saveArchives([created, ...list]);
  return created;
}

export function createEmptyArchive(title?: string): ArchiveEntry {
  return upsertArchive({
    title: title?.trim() || "Nouveau texte",
    content: "",
    html: "<p></p>",
    corrections: [],
  });
}

export function deleteArchive(id: string): void {
  saveArchives(loadArchives().filter((e) => e.id !== id));
}

export function titleFromContent(content: string): string {
  const line = content.replace(/\s+/g, " ").trim();
  if (!line) return "Brouillon vide";
  return line.length > 48 ? `${line.slice(0, 48)}…` : line;
}

/** Aggregate lifetime category counts from all archives + current session. */
export function compileErrorFrequency(
  archives: ArchiveEntry[],
  current?: AppliedCorrection[]
): Record<string, number> {
  const counts: Record<string, number> = {};
  const bump = (category: string) => {
    counts[category] = (counts[category] ?? 0) + 1;
  };
  for (const arch of archives) {
    for (const c of arch.corrections) bump(c.category);
  }
  for (const c of current ?? []) bump(c.category);
  return counts;
}

export function topMistakePairs(
  archives: ArchiveEntry[],
  current?: AppliedCorrection[],
  limit = 6
): Array<{ original: string; replacement: string; count: number }> {
  const map = new Map<string, { original: string; replacement: string; count: number }>();
  const add = (c: AppliedCorrection) => {
    const key = `${c.original}→${c.replacement}`;
    const prev = map.get(key);
    if (prev) prev.count += 1;
    else map.set(key, { original: c.original, replacement: c.replacement, count: 1 });
  };
  for (const arch of archives) for (const c of arch.corrections) add(c);
  for (const c of current ?? []) add(c);
  return [...map.values()].sort((a, b) => b.count - a.count).slice(0, limit);
}
