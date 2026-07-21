"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Pill } from "@/shared/components/ui/pill";
import { LocaleSwitcher } from "@/shared/i18n/locale-switcher";
import { useI18n } from "@/shared/i18n/provider";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-dvh overflow-hidden bg-ds-canvas">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--ds-sky)_0%,_transparent_50%),radial-gradient(ellipse_at_bottom_right,_var(--ds-lime)_0%,_transparent_45%)] opacity-70"
      />

      <header className="relative z-10 border-b border-ds-border/60 bg-white/70 backdrop-blur-xl safe-pt">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ds-inverse text-ds-lime">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-ds-ink">
              {t("brand.name")}
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <LocaleSwitcher />
            <Link
              href="/login"
              className="hidden text-sm text-ds-muted transition-colors hover:text-ds-ink sm:inline"
            >
              {t("nav.login")}
            </Link>
            <Button asChild size="sm" className="rounded-full">
              <Link href="/try">{t("common.tryCta")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-3xl flex-col justify-center px-6 pb-12 pt-8 lg:px-10">
        <Pill tone="lime" className="w-fit">
          {t("landing.pill")}
        </Pill>

        <h1 className="mt-5 text-5xl font-semibold tracking-tight text-ds-ink sm:text-6xl lg:text-7xl">
          {t("brand.name")}
        </h1>

        <p className="mt-4 max-w-xl text-lg leading-relaxed text-ds-muted sm:text-xl">
          {t("landing.subtitle")}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="rounded-full px-7">
            <Link href="/try">{t("common.tryNow")}</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="rounded-full">
            <Link href="/login">{t("common.signIn")}</Link>
          </Button>
        </div>

        <p className="mt-5 text-sm text-ds-muted">{t("landing.micro")}</p>
      </main>
    </div>
  );
}
