"use client";

import * as React from "react";
import { useI18n } from "@/shared/i18n/provider";
import type { UiLocale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/cn";

const OPTIONS: Array<{ locale: UiLocale; flag: string; labelKey: string }> = [
  { locale: "en", flag: "🇬🇧", labelKey: "locale.switchToEn" },
  { locale: "fr", flag: "🇫🇷", labelKey: "locale.switchToFr" },
];

export function LocaleSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full bg-white/5 p-0.5 ring-1 ring-white/15",
        className
      )}
      role="group"
      aria-label={t("locale.label")}
    >
      {OPTIONS.map((opt) => {
        const active = locale === opt.locale;
        return (
          <button
            key={opt.locale}
            type="button"
            onClick={() => setLocale(opt.locale)}
            title={t(opt.labelKey)}
            aria-pressed={active}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-base transition",
              active
                ? "bg-white shadow-sm"
                : "opacity-55 hover:bg-white/10 hover:opacity-100"
            )}
          >
            <span aria-hidden>{opt.flag}</span>
            <span className="sr-only">{t(opt.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
