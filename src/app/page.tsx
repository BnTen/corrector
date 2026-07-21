import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Pill } from "@/shared/components/ui/pill";

export default function HomePage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-ds-canvas">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--ds-sky)_0%,_transparent_50%),radial-gradient(ellipse_at_bottom_right,_var(--ds-lime)_0%,_transparent_45%)] opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314151a' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 safe-pt lg:px-10">
        <span className="text-sm font-semibold tracking-tight text-ds-ink">
          Text Corrector
        </span>
        <Link
          href="/login"
          className="text-sm text-ds-muted transition-colors hover:text-ds-ink"
        >
          Connexion
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100dvh-5rem)] max-w-3xl flex-col justify-center px-6 pb-16 pt-8 lg:px-10">
        <Pill tone="lime" className="w-fit">
          Orthographe · Grammaire · Style
        </Pill>

        <h1 className="mt-6 font-[family-name:var(--font-geist-sans)] text-5xl font-semibold tracking-tight text-ds-ink sm:text-6xl lg:text-7xl">
          Text Corrector
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ds-muted sm:text-xl">
          Écrivez librement. Les suggestions soulignent en direct vos fautes —
          appliquez-les d’un clic ou avec Tab.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link href="/workspace">Ouvrir l’éditeur</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
