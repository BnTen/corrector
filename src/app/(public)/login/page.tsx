import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Connexion — Text Corrector",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-ds-canvas px-4 py-12">
      <Link
        href="/"
        className="mb-8 text-xl font-semibold tracking-tight text-ds-ink"
      >
        Text Corrector
      </Link>
      <LoginForm />
    </main>
  );
}
