"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { signUp, type AuthActionResult } from "@/features/auth/actions";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Création…" : "Créer mon compte"}
    </Button>
  );
}

export function SignupForm() {
  const [state, formAction] = useFormState<AuthActionResult | undefined, FormData>(
    signUp,
    undefined
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Inscription</CardTitle>
        <CardDescription>
          Créez un compte pour suivre vos progrès d’écriture.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="displayName"
              className="text-sm font-medium text-ds-ink"
            >
              Nom affiché
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              autoComplete="name"
              className="h-10 w-full rounded-[12px] border border-ds-border bg-ds-elevated px-3 text-sm text-ds-ink outline-none focus-visible:ring-2 focus-visible:ring-ds-lime"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-ds-ink"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="h-10 w-full rounded-[12px] border border-ds-border bg-ds-elevated px-3 text-sm text-ds-ink outline-none focus-visible:ring-2 focus-visible:ring-ds-lime"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-ds-ink"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="h-10 w-full rounded-[12px] border border-ds-border bg-ds-elevated px-3 text-sm text-ds-ink outline-none focus-visible:ring-2 focus-visible:ring-ds-lime"
            />
          </div>

          {state?.error ? (
            <p className="text-sm text-ds-coral" role="alert">
              {state.error}
            </p>
          ) : null}

          <SubmitButton />
        </form>

        <Button type="button" variant="secondary" className="w-full" disabled>
          Google (bientôt)
        </Button>

        <p className="text-center text-sm text-ds-muted">
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="font-medium text-ds-ink underline-offset-4 hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
