import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/auth/components/login-form";
import { SiteFooter } from "@/shared/components/ui/site-footer";

export const metadata: Metadata = {
  title: "Connexion — Text Corrector",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-ds-canvas">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <Link
          href="/"
          className="mb-8 text-xl font-semibold tracking-tight text-ds-ink"
        >
          Text Corrector
        </Link>
        <LoginForm />
      </main>
      <SiteFooter />
    </div>
  );
}
