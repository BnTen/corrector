"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export interface TopBarNavItem {
  href: string;
  label: string;
  active?: boolean;
}

export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  navItems?: TopBarNavItem[];
  showEditorCta?: boolean;
}

const defaultNav: TopBarNavItem[] = [
  { href: "/workspace", label: "Écrire" },
  { href: "/login", label: "Compte" },
];

export function TopBar({
  className,
  navItems = defaultNav,
  showEditorCta = true,
  children,
  ...props
}: TopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/10",
        "bg-gradient-to-b from-[#0c0d10] via-[#14151a] to-[#1a1b22]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.28)] backdrop-blur-xl",
        "safe-pt",
        className
      )}
      {...props}
    >
      {/* Lime accent line */}
      <div
        className="h-[2px] w-full bg-gradient-to-r from-transparent via-ds-lime to-transparent opacity-90"
        aria-hidden
      />

      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 lg:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ds-lime text-ds-inverse shadow-[0_0_24px_rgba(212,239,58,0.35)] transition-transform group-hover:scale-105">
            <Sparkles className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight text-white">
              Text Corrector
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/45">
              Live French
            </span>
          </span>
        </Link>

        <nav
          className="ml-2 hidden items-center gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10 md:flex"
          aria-label="Main"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
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
          {children}
          {showEditorCta ? (
            <Link
              href="/workspace"
              className="hidden rounded-full bg-ds-lime px-4 py-2 text-sm font-semibold text-ds-inverse shadow-[0_0_20px_rgba(212,239,58,0.25)] transition hover:brightness-105 sm:inline-flex"
            >
              Ouvrir l’éditeur
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
