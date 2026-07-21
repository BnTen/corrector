"use client";

import * as React from "react";
import {
  DEFAULT_UI_LOCALE,
  UI_LOCALE_COOKIE,
  checkLanguageForLocale,
  isUiLocale,
  type UiLocale,
} from "@/shared/i18n/config";
import { translate } from "@/shared/i18n/translate";

interface LocaleContextValue {
  locale: UiLocale;
  setLocale: (locale: UiLocale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  checkLanguage: "fr" | "en-US";
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale?: UiLocale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = React.useState<UiLocale>(() => {
    if (initialLocale && isUiLocale(initialLocale)) return initialLocale;
    const fromCookie = readCookie(UI_LOCALE_COOKIE);
    if (isUiLocale(fromCookie)) return fromCookie;
    return DEFAULT_UI_LOCALE;
  });

  React.useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // IP-based detection once (skipped if user already chose a language)
  React.useEffect(() => {
    if (readCookie("tc_ui_locale_manual") === "1") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/locale/geo");
        const data = (await res.json()) as { locale?: string };
        if (cancelled || !isUiLocale(data.locale)) return;
        if (readCookie("tc_ui_locale_manual") === "1") return;
        setLocaleState(data.locale);
      } catch {
        // keep default
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setLocale = React.useCallback((next: UiLocale) => {
    setLocaleState(next);
    writeCookie(UI_LOCALE_COOKIE, next);
    writeCookie("tc_ui_locale_manual", "1");
  }, []);

  const t = React.useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale]
  );

  const value = React.useMemo(
    () => ({
      locale,
      setLocale,
      t,
      checkLanguage: checkLanguageForLocale(locale),
    }),
    [locale, setLocale, t]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useI18n(): LocaleContextValue {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: DEFAULT_UI_LOCALE,
      setLocale: () => undefined,
      t: (key, vars) => translate(DEFAULT_UI_LOCALE, key, vars),
      checkLanguage: "en-US",
    };
  }
  return ctx;
}
