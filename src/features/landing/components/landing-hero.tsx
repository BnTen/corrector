"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LocaleSwitcher } from "@/shared/i18n/locale-switcher";
import { useI18n } from "@/shared/i18n/provider";
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

      <main className="relative z-10 mx-auto grid h-[calc(100dvh-3rem)] max-w-6xl grid-cols-1 content-center gap-5 px-5 pb-5 pt-1 sm:h-[calc(100dvh-3.5rem)] sm:gap-7 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-[auto_auto] lg:items-center lg:gap-x-14 lg:gap-y-0 lg:px-10 lg:pb-10">
        <div className="landing-copy min-w-0 lg:col-start-1 lg:row-start-1">
          <p className="landing-enter landing-enter-1 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-ds-muted">
            {t("brand.tagline")}
          </p>

          <h1 className="landing-enter landing-enter-2 mt-2.5 font-[family-name:var(--font-display)] text-[clamp(2.45rem,8.5vw,5.75rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-ds-ink sm:mt-4">
            {t("brand.name")}
          </h1>

          <p className="landing-enter landing-enter-3 mt-3.5 max-w-[22ch] text-[1.25rem] font-medium leading-snug tracking-tight text-ds-ink sm:mt-5 sm:max-w-[28ch] sm:text-2xl lg:text-[1.65rem]">
            {t("landing.headline")}
          </p>

          <p className="landing-enter landing-enter-4 mt-2.5 max-w-md text-[15px] leading-relaxed text-ds-muted sm:mt-3 sm:text-base">
            {t("landing.subtitle")}
          </p>
        </div>

        <div className="landing-enter landing-enter-7 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <CorrectionStage />
        </div>

        <div className="landing-copy min-w-0 lg:col-start-1 lg:row-start-2 lg:mt-8">
          <div className="landing-enter landing-enter-5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
            <Button
              asChild
              size="lg"
              className="landing-cta-primary group h-12 px-6 text-[15px] font-semibold"
            >
              <Link href="/try">
                {t("common.tryNow")}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-11 px-4 text-ds-muted hover:text-ds-ink sm:h-12 sm:px-5"
            >
              <Link href="/login">{t("common.signIn")}</Link>
            </Button>
          </div>

          <p className="landing-enter landing-enter-6 mt-3.5 text-xs text-ds-muted sm:mt-4">
            {t("landing.micro")}
          </p>
        </div>
      </main>
    </div>
  );
}
