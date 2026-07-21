"use client";

import Link from "next/link";
import { LocaleSwitcher } from "@/shared/i18n/locale-switcher";
import { useI18n } from "@/shared/i18n/provider";
import { Button } from "@/shared/components/ui/button";
import { SiteFooter } from "@/shared/components/ui/site-footer";
import { CorrectionStage } from "@/features/landing/components/correction-stage";

export function LandingHero() {
  const { t } = useI18n();

  return (
    <div className="landing-shell relative h-dvh max-h-dvh overflow-hidden">
      <div className="landing-atmosphere" aria-hidden />
      <div className="landing-grain" aria-hidden />

      <header className="relative z-20 safe-pt">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-5 sm:h-14 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="landing-nav-brand font-[family-name:var(--font-display)] text-[15px] font-semibold tracking-tight text-ds-ink"
          >
            {t("brand.name")}
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <LocaleSwitcher />
            <Link
              href="/login"
              className="hidden text-sm text-ds-muted transition-colors hover:text-ds-ink sm:inline"
            >
              {t("nav.login")}
            </Link>
            <Button
              asChild
              size="sm"
              className="landing-cta-sm bg-ds-inverse text-ds-lime hover:bg-ds-ink"
            >
              <Link href="/try">{t("common.tryCta")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid h-[calc(100dvh-3rem-2rem)] max-w-6xl grid-cols-1 content-center gap-4 px-5 pb-2 pt-1 sm:h-[calc(100dvh-3.5rem-2rem)] sm:gap-6 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-x-12 lg:px-10">
        <div className="landing-copy min-w-0 lg:col-start-1">
          <p className="landing-enter landing-enter-1 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-ds-muted">
            {t("brand.tagline")}
          </p>

          <h1 className="landing-enter landing-enter-2 mt-2 font-[family-name:var(--font-display)] text-[clamp(2.35rem,8vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-ds-ink sm:mt-3">
            {t("brand.name")}
          </h1>

          <p className="landing-enter landing-enter-3 mt-3 max-w-[22ch] text-[1.2rem] font-medium leading-snug tracking-tight text-ds-ink sm:mt-4 sm:max-w-[28ch] sm:text-2xl lg:text-[1.55rem]">
            {t("landing.headline")}
          </p>

          <p className="landing-enter landing-enter-4 mt-2 max-w-md text-[14px] leading-relaxed text-ds-muted sm:mt-3 sm:text-[15px]">
            {t("landing.subtitle")}
          </p>

          <p className="landing-enter landing-enter-6 mt-3 hidden text-xs text-ds-muted lg:block">
            {t("landing.micro")}
          </p>
        </div>

        <div className="landing-enter landing-enter-7 lg:col-start-2">
          <CorrectionStage />
        </div>
      </main>

      <SiteFooter variant="compact" />
    </div>
  );
}
