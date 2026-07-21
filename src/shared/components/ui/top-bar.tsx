import * as React from "react";
import Link from "next/link";
import { cn } from "@/shared/lib/cn";

export interface TopBarNavItem {
  href: string;
  label: string;
  active?: boolean;
}

export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  navItems?: TopBarNavItem[];
}

const defaultNav: TopBarNavItem[] = [
  { href: "/editor", label: "Editor" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/quiz", label: "Quiz" },
];

export function TopBar({
  className,
  navItems = defaultNav,
  children,
  ...props
}: TopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-14 items-center gap-6 bg-ds-inverse px-4 text-white safe-pt lg:px-6",
        className
      )}
      {...props}
    >
      <Link
        href="/"
        className="shrink-0 text-base font-semibold tracking-tight text-white"
      >
        Text Corrector
      </Link>

      <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-[10px] px-3 py-1.5 text-sm transition-colors",
              item.active
                ? "bg-white/10 text-white"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">{children}</div>
    </header>
  );
}
