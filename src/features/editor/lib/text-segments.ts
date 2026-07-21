/**
 * Sentence / caret helpers for progressive LanguageTool checks.
 */

const SENTENCE_END = /[.!?…]\s+|[\n\r]+/g;

export interface TextSegment {
  start: number;
  end: number;
  text: string;
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
