import Link from "next/link";
import { LEGAL_NAV, SITE_LEGAL } from "@/shared/legal/site-legal";

export function SiteFooter({
  variant = "default",
}: {
  variant?: "default" | "compact";
}) {
  if (variant === "compact") {
    return (
      <footer className="relative z-20 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 pb-3 pt-1 text-[11px] text-ds-muted safe-pb">
        {LEGAL_NAV.map((item, index) => (
          <span key={item.href} className="inline-flex items-center gap-3">
            {index > 0 ? (
              <span aria-hidden className="text-ds-border">
                ·
              </span>
            ) : null}
            <Link
              href={item.href}
              className="transition-colors hover:text-ds-ink"
            >
              {item.label}
            </Link>
          </span>
        ))}
      </footer>
    );
  }

  return (
    <footer className="border-t border-ds-border/60 bg-ds-elevated/50">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-xs text-ds-muted">
          © {new Date().getFullYear()} {SITE_LEGAL.brandName}
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ds-muted">
          {LEGAL_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-ds-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
