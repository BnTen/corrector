import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/server/supabase/middleware";
import {
  applyLocaleCookie,
  detectUiLocale,
} from "@/shared/i18n/detect";
import { UI_LOCALE_COOKIE, isUiLocale } from "@/shared/i18n/config";

const AUTH_GATED = ["/workspace", "/dashboard", "/quiz", "/admin"];

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const hadLocaleCookie = isUiLocale(
    request.cookies.get(UI_LOCALE_COOKIE)?.value
  );
  const locale = detectUiLocale(request);

  let response: NextResponse;

  if (!supabaseUrl || !supabaseAnonKey) {
    response = NextResponse.next();
    return applyLocaleCookie(response, locale, hadLocaleCookie);
  }

  response = await updateSession(request);
  response = applyLocaleCookie(response, locale, hadLocaleCookie);

  const path = request.nextUrl.pathname;
  const needsAuth = AUTH_GATED.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );

  if (needsAuth) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // Cookie refresh already handled by updateSession
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", request.nextUrl.pathname);
      const redirect = NextResponse.redirect(loginUrl);
      return applyLocaleCookie(redirect, locale, hadLocaleCookie);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
