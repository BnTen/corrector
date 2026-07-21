"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { LocaleSwitcher } from "@/shared/i18n/locale-switcher";
import { useI18n } from "@/shared/i18n/provider";

export interface TopBarNavItem {
  href: string;
  label: string;
  active?: boolean;
}

export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  navItems?: TopBarNavItem[];
  showEditorCta?: boolean;
}

export function TopBar({
  className,
  navItems,
  showEditorCta = true,
  children,
  ...props
}: TopBarProps) {
  const { t } = useI18n();
  const resolvedNav =
    navItems ??
    ([
      { href: "/try", label: t("nav.try") },
      { href: "/login", label: t("nav.account") },
    ] satisfies TopBarNavItem[]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/10",
        "bg-gradient-to-b from-[#0c0d10] via-[#14151a] to-[#1a1b22]",
        "shadow-[0_0_0_rgba(0,0,0,0)] backdrop-blur-xl",
        "safe-pt",
        className
      )}
      {...props}
    >
      <div
        className="h-[2px] w-full bg-gradient-to-r from-transparent via-ds-lime to-transparent opacity-90"
        aria-hidden
      />

      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4 lg:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ds-lime text-ds-inverse transition-transform group-hover:scale-105">
            <Sparkles className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight text-white">
              {t("brand.name")}
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/45">
              {t("brand.tagline")}
            </span>
          </span>
        </Link>

        <nav
          className="ml-2 hidden items-center gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10 md:flex"
          aria-label="Main"
        >
          {resolvedNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
                item.active
                  ? "bg-white text-ds-inverse shadow-sm"
                  : "text-white/65 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LocaleSwitcher />
          {children}
          {showEditorCta ? (
            <Link
              href="/try"
              className="hidden rounded-full bg-ds-lime px-4 py-1.5 text-sm font-semibold text-ds-inverse transition hover:brightness-105 sm:inline-flex"
            >
              {t("common.tryCta")}
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
