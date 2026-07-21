import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = {
  title: "Inscription — Text Corrector",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-ds-canvas px-4 py-12">
      <Link
        href="/"
        className="mb-8 text-xl font-semibold tracking-tight text-ds-ink"
      >
        Text Corrector
      </Link>
      <SignupForm />
    </main>
  );
}
