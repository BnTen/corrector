import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Pill } from "@/shared/components/ui/pill";

export default function HomePage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-ds-canvas">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--ds-sky)_0%,_transparent_50%),radial-gradient(ellipse_at_bottom_right,_var(--ds-lime)_0%,_transparent_45%)] opacity-70"
      />

      <header className="relative z-10 border-b border-ds-border/60 bg-white/70 backdrop-blur-xl safe-pt">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ds-inverse text-ds-lime">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-ds-ink">
              Text Corrector
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-ds-muted transition-colors hover:text-ds-ink"
            >
              Connexion
            </Link>
            <Button asChild size="sm" className="rounded-full">
              <Link href="/try">Essayer</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] max-w-3xl flex-col justify-center px-6 pb-16 pt-10 lg:px-10">
        <Pill tone="lime" className="w-fit">
          Orthographe · Grammaire · Style
        </Pill>

        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-ds-ink sm:text-6xl lg:text-7xl">
          Text Corrector
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ds-muted sm:text-xl">
          Écrivez. On corrige. Texte propre en 10 secondes — 2 corrections
          gratuites, pas de compte pour commencer.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="rounded-full px-7">
            <Link href="/try">Essayer maintenant</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="rounded-full">
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>

        <p className="mt-6 text-sm text-ds-muted">
          Playground instantané · email seulement au 3ᵉ crédit
        </p>
      </main>
    </div>
  );
}
