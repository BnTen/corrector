import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/shared/components/ui/site-footer";
import { LEGAL_NAV, SITE_LEGAL } from "@/shared/legal/site-legal";

export function LegalDocument({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-ds-canvas">
      <header className="border-b border-ds-border/60 bg-ds-elevated/80 backdrop-blur-sm safe-pt">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-ds-ink"
          >
            {SITE_LEGAL.brandName}
          </Link>
          <nav className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-xs text-ds-muted">
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
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ds-muted">
          Document légal · Mis à jour le {SITE_LEGAL.lastUpdated}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ds-ink sm:text-4xl">
          {title}
        </h1>
        <div className="legal-prose mt-8 space-y-8 text-[15px] leading-relaxed text-ds-ink/90">
          {children}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight text-ds-ink">
        {title}
      </h2>
      <div className="space-y-3 text-ds-muted [&_strong]:font-medium [&_strong]:text-ds-ink [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
