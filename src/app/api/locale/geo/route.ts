import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_UI_LOCALE,
  UI_LOCALE_COOKIE,
  isUiLocale,
  localeFromCountryCode,
  type UiLocale,
} from "@/shared/i18n/config";

function clientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;
  if (!ip || ip === "127.0.0.1" || ip === "::1") return null;
  return ip;
}

async function countryFromIp(ip: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1600);
    const res = await fetch(
      `https://ipapi.co/${encodeURIComponent(ip)}/country_code/`,
      {
        signal: controller.signal,
        headers: { Accept: "text/plain" },
        cache: "no-store",
      }
    );
    clearTimeout(timer);
    if (!res.ok) return null;
    const text = (await res.text()).trim().toUpperCase();
    return /^[A-Z]{2}$/.test(text) ? text : null;
  } catch {
    return null;
  }
}

/**
 * One-shot IP → locale for first visit (when no manual override).
 * Default remains English when geo fails.
 */
export async function GET(request: NextRequest) {
  const manual = request.cookies.get("tc_ui_locale_manual")?.value === "1";
  if (manual) {
    const cookie = request.cookies.get(UI_LOCALE_COOKIE)?.value;
    return NextResponse.json({
      locale: isUiLocale(cookie) ? cookie : DEFAULT_UI_LOCALE,
      source: "manual",
    });
  }

  const headerCountry =
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cloudfront-viewer-country");

  let locale: UiLocale =
    localeFromCountryCode(headerCountry) ?? DEFAULT_UI_LOCALE;
  let source: string = headerCountry ? "header" : "default";

  if (!headerCountry) {
    const ip = clientIp(request);
    if (ip) {
      const code = await countryFromIp(ip);
      const fromIp = localeFromCountryCode(code);
      if (fromIp) {
        locale = fromIp;
        source = "ip";
      } else if (code) {
        locale = "en";
        source = "ip";
      }
    }
  }

  const response = NextResponse.json({ locale, source });
  response.cookies.set(UI_LOCALE_COOKIE, locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
