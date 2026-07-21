"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { LocaleSwitcher } from "@/shared/i18n/locale-switcher";
import { useI18n } from "@/shared/i18n/provider";
import { APP_GUTTER_X, APP_MAX_WIDTH } from "@/shared/lib/layout";

export interface TopBarNavItem {
  href?: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
  id?: string;
}

export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  navItems?: TopBarNavItem[];
  showEditorCta?: boolean;
  /** Extra row under the main bar (e.g. mobile chat-style chips). */
  subBar?: React.ReactNode;
}

export function TopBar({
  className,
  navItems,
  showEditorCta = true,
  subBar,
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
        "backdrop-blur-xl",
        "safe-pt",
        className
      )}
      {...props}
    >
      <div
        className="h-[2px] w-full bg-gradient-to-r from-transparent via-ds-lime to-transparent opacity-90"
        aria-hidden
      />

      <div
        className={cn(
          "mx-auto flex h-12 items-center gap-2 sm:h-14 sm:gap-3",
          APP_MAX_WIDTH,
          APP_GUTTER_X
        )}
      >
        <Link href="/" className="group flex shrink-0 items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ds-lime text-ds-inverse transition-transform group-hover:scale-105 sm:h-8 sm:w-8 sm:rounded-xl">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.25} />
          </span>
          <span className="hidden flex-col leading-none xs:flex sm:flex">
            <span className="text-sm font-semibold tracking-tight text-white sm:text-[15px]">
              {t("brand.name")}
            </span>
            <span className="mt-0.5 hidden text-[10px] font-medium uppercase tracking-[0.14em] text-white/45 sm:inline">
              {t("brand.tagline")}
            </span>
          </span>
        </Link>

        <nav
          className="ml-1 flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto rounded-full bg-white/5 p-0.5 ring-1 ring-white/10 sm:ml-2 sm:gap-1 sm:p-1"
          aria-label="Main"
        >
          {resolvedNav.map((item) => {
            const classNameItem = cn(
              "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-all sm:px-3.5 sm:py-1.5 sm:text-sm",
              item.active
                ? "bg-white text-ds-inverse shadow-sm"
                : "text-white/65 hover:bg-white/10 hover:text-white"
            );

            if (item.onClick) {
              return (
                <button
                  key={item.id ?? item.label}
                  type="button"
                  onClick={item.onClick}
                  className={classNameItem}
                >
                  {item.label}
                </button>
              );
            }

            return (
              <Link
                key={item.href ?? item.label}
                href={item.href ?? "#"}
                className={classNameItem}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
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

      {subBar ? (
        <div className="border-t border-white/5 bg-[#12131a] lg:hidden">
          {subBar}
        </div>
      ) : null}
    </header>
  );
}
