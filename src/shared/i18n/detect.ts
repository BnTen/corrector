import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_UI_LOCALE,
  UI_LOCALE_COOKIE,
  isUiLocale,
  localeFromAcceptLanguage,
  localeFromCountryCode,
  type UiLocale,
} from "@/shared/i18n/config";

function countryFromHeaders(request: NextRequest): string | null {
  const headers = [
    "cf-ipcountry",
    "cloudfront-viewer-country",
    "x-vercel-ip-country",
    "x-country-code",
  ];
  for (const name of headers) {
    const value = request.headers.get(name);
    if (value && value !== "XX" && value.length === 2) return value;
  }
  return null;
}

/**
 * Resolve UI locale:
 * 1) explicit cookie (user choice)
 * 2) IP/geo country header → FR countries = fr, else en
 * 3) Accept-Language hint
 * 4) default English
 */
export function detectUiLocale(request: NextRequest): UiLocale {
  const cookie = request.cookies.get(UI_LOCALE_COOKIE)?.value;
  if (isUiLocale(cookie)) return cookie;

  const fromCountry = localeFromCountryCode(countryFromHeaders(request));
  if (fromCountry) return fromCountry;

  const fromLang = localeFromAcceptLanguage(
    request.headers.get("accept-language")
  );
  if (fromLang) return fromLang;

  return DEFAULT_UI_LOCALE;
}

export function applyLocaleCookie(
  response: NextResponse,
  locale: UiLocale,
  alreadyHadCookie: boolean
): NextResponse {
  if (alreadyHadCookie) return response;
  response.cookies.set(UI_LOCALE_COOKIE, locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export function readLocaleFromRequest(request: NextRequest): UiLocale {
  return detectUiLocale(request);
}
