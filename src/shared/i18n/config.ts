export const UI_LOCALE_COOKIE = "tc_ui_locale";
export type UiLocale = "en" | "fr";

export const DEFAULT_UI_LOCALE: UiLocale = "en";

/** ISO country codes where French UI is preferred. */
export const FRENCH_COUNTRY_CODES = new Set([
  "FR",
  "BE",
  "CH",
  "LU",
  "MC",
  "SN",
  "CI",
  "CM",
  "MG",
  "CD",
  "CG",
  "GA",
  "BJ",
  "BF",
  "ML",
  "NE",
  "TG",
  "GN",
  "RW",
  "BI",
  "DJ",
  "KM",
  "TD",
  "CF",
  "HT",
  "CA",
  "GF",
  "GP",
  "MQ",
  "RE",
  "YT",
  "NC",
  "PF",
  "PM",
  "WF",
  "BL",
  "MF",
]);

export function isUiLocale(value: string | undefined | null): value is UiLocale {
  return value === "en" || value === "fr";
}

export function localeFromCountryCode(
  code: string | null | undefined
): UiLocale | null {
  if (!code) return null;
  const upper = code.trim().toUpperCase();
  if (upper.length !== 2) return null;
  return FRENCH_COUNTRY_CODES.has(upper) ? "fr" : "en";
}

export function localeFromAcceptLanguage(
  header: string | null | undefined
): UiLocale | null {
  if (!header) return null;
  const primary = header.split(",")[0]?.trim().toLowerCase() ?? "";
  if (primary.startsWith("fr")) return "fr";
  if (primary.startsWith("en")) return "en";
  return null;
}

export function checkLanguageForLocale(locale: UiLocale): "fr" | "en-US" {
  return locale === "fr" ? "fr" : "en-US";
}
