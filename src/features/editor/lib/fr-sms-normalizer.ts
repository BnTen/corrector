/**
 * Instant French SMS / textism → standard French.
 * High-confidence mappings only (applied before LanguageTool).
 */

export interface SmsHit {
  offset: number;
  length: number;
  original: string;
  replacement: string;
  message: string;
}

/** Lowercase keys → replacement (casing applied separately). */
const SMS_FR: Record<string, string> = {
  slt: "salut",
  bjr: "bonjour",
  bsr: "bonsoir",
  mrc: "merci",
  stp: "s'il te plaît",
  svp: "s'il vous plaît",
  tkt: "t'inquiète",
  pk: "pourquoi",
  pq: "pourquoi",
  pck: "parce que",
  pcq: "parce que",
  psk: "parce que",
  auj: "aujourd'hui",
  aujourdhui: "aujourd'hui",
  pdt: "pendant",
  tjs: "toujours",
  tjrs: "toujours",
  tou: "tout",
  ke: "que",
  ki: "qui",
  koa: "quoi",
  koi: "quoi",
  kwa: "quoi",
  chui: "je suis",
  chuis: "je suis",
  jsui: "je suis",
  jsuis: "je suis",
  jé: "j'ai",
  jai: "j'ai",
  javai: "j'avais",
  javais: "j'avais",
  ptit: "petit",
  messaj: "message",
  coté: "côté",
  sallon: "salon",
  marchée: "marché",
  fallai: "fallait",
  mai: "mais",
  ptetre: "peut-être",
  peutetre: "peut-être",
  ptt: "peut-être",
  fair: "faire",
  ct: "c'était",
  cté: "c'était",
  cété: "c'était",
  cetait: "c'était",
  ctait: "c'était",
  rentran: "rentrant",
  moin: "moins",
  ballade: "balade",
  dispo: "disponible",
  ptet: "peut-être",
  tj: "toujours",
  dc: "donc",
  alrs: "alors",
  bcp: "beaucoup",
  qq: "quelques",
  ms: "mais",
  pr: "pour",
  avc: "avec",
  vs: "vous",
  dsl: "désolé",
};

function applyCase(source: string, replacement: string): string {
  if (!source) return replacement;
  if (source === source.toUpperCase() && source.length > 1) {
    return replacement.toUpperCase();
  }
  if (source[0] === source[0]?.toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

const TOKEN_RE = /[A-Za-zÀ-ÿ'’]+(?:-[A-Za-zÀ-ÿ'’]+)*/g;

export function findSmsHits(
  text: string,
  options?: { wordStart?: number }
): SmsHit[] {
  const wordStart = options?.wordStart ?? text.length;
  const hits: SmsHit[] = [];
  let match: RegExpExecArray | null;
  const re = new RegExp(TOKEN_RE.source, "g");

  while ((match = re.exec(text)) !== null) {
    const original = match[0];
    const offset = match.index;
    const end = offset + original.length;
    if (end > wordStart) continue;

    const key = original
      .toLowerCase()
      .normalize("NFC")
      .replace(/’/g, "'");

    const mapped = SMS_FR[key];
    if (!mapped) continue;

    const replacement = applyCase(original, mapped);
    if (replacement === original) continue;

    hits.push({
      offset,
      length: original.length,
      original,
      replacement,
      message: "Forme correcte (SMS → français)",
    });
  }

  return hits;
}

export function smsHitsToMatches(hits: SmsHit[]) {
  return hits.map((hit, index) => ({
    id: `sms-${hit.offset}-${index}`,
    offset: hit.offset,
    length: hit.length,
    message: hit.message,
    shortMessage: "SMS",
    replacements: [hit.replacement],
    category: "spelling" as const,
    ruleId: "FR_SMS_NORMALIZER",
  }));
}
