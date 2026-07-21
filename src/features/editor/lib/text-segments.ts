/**
 * Sentence / caret helpers for progressive LanguageTool checks.
 */

const SENTENCE_END = /[.!?…]\s+|[\n\r]+/g;

/** Max characters per LanguageTool request chunk (API allows up to 20k). */
export const LT_CHUNK_MAX_CHARS = 3500;

export interface TextSegment {
  start: number;
  end: number;
  text: string;
}

export function segmentKey(segment: TextSegment): string {
  return `${segment.start}:${segment.text}`;
}

/** Plain-text caret → find sentence covering that offset (or last incomplete). */
export function getSentenceAt(text: string, caretOffset: number): TextSegment {
  const clamped = Math.max(0, Math.min(caretOffset, text.length));
  const boundaries: number[] = [0];

  let match: RegExpExecArray | null;
  const re = new RegExp(SENTENCE_END.source, "g");
  while ((match = re.exec(text)) !== null) {
    boundaries.push(match.index + match[0].length);
  }
  if (boundaries[boundaries.length - 1] !== text.length) {
    boundaries.push(text.length);
  }

  let start = 0;
  let end = text.length;
  for (let i = 0; i < boundaries.length - 1; i++) {
    const a = boundaries[i];
    const b = boundaries[i + 1];
    if (clamped >= a && clamped <= b) {
      start = a;
      end = b;
      break;
    }
    if (clamped > a) {
      start = a;
      end = b;
    }
  }

  // Prefer a bit of context: include previous short sentence if current is tiny
  if (end - start < 8 && start > 0) {
    for (let i = boundaries.length - 2; i >= 0; i--) {
      if (boundaries[i] < start) {
        start = boundaries[i];
        break;
      }
    }
  }

  return { start, end, text: text.slice(start, end) };
}

/** All completed sentences strictly before caret (for catch-up corrections). */
export function getCompletedSentencesBefore(
  text: string,
  caretOffset: number
): TextSegment[] {
  const segments: TextSegment[] = [];
  let last = 0;
  const re = new RegExp(SENTENCE_END.source, "g");
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    const end = match.index + match[0].length;
    if (end <= caretOffset) {
      const slice = text.slice(last, end);
      if (slice.trim().length >= 2) {
        segments.push({ start: last, end, text: slice });
      }
      last = end;
    } else {
      break;
    }
  }

  return segments;
}

/**
 * Merge consecutive segments into chunks under `maxChars` for fewer LT round-trips.
 * Preserves document offsets via start/end on the full text.
 */
export function chunkSegments(
  text: string,
  segments: TextSegment[],
  maxChars = LT_CHUNK_MAX_CHARS
): TextSegment[] {
  if (segments.length === 0) return [];

  const chunks: TextSegment[] = [];
  let chunkStart = segments[0]!.start;
  let chunkEnd = segments[0]!.end;

  for (let i = 1; i < segments.length; i++) {
    const seg = segments[i]!;
    const nextEnd = seg.end;
    if (nextEnd - chunkStart <= maxChars) {
      chunkEnd = nextEnd;
      continue;
    }
    chunks.push({
      start: chunkStart,
      end: chunkEnd,
      text: text.slice(chunkStart, chunkEnd),
    });
    chunkStart = seg.start;
    chunkEnd = seg.end;
  }

  chunks.push({
    start: chunkStart,
    end: chunkEnd,
    text: text.slice(chunkStart, chunkEnd),
  });

  // Split any single oversized segment (rare long run-on without punctuation)
  const normalized: TextSegment[] = [];
  for (const chunk of chunks) {
    if (chunk.text.length <= maxChars) {
      normalized.push(chunk);
      continue;
    }
    let offset = chunk.start;
    while (offset < chunk.end) {
      const end = Math.min(chunk.end, offset + maxChars);
      normalized.push({
        start: offset,
        end,
        text: text.slice(offset, end),
      });
      offset = end;
    }
  }

  return normalized;
}

/** Start of the word currently being typed (do not auto-fix inside it). */
export function getTypingWordStart(text: string, caretOffset: number): number {
  const clamped = Math.max(0, Math.min(caretOffset, text.length));
  let i = clamped;
  while (i > 0 && !/\s/.test(text[i - 1]!)) i -= 1;
  return i;
}

export function remapMatchOffset<T extends { offset: number }>(
  match: T,
  segmentStart: number
): T {
  return { ...match, offset: match.offset + segmentStart };
}
