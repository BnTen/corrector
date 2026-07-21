"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { signIn, type AuthActionResult } from "@/features/auth/actions";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { LocaleSwitcher } from "@/shared/i18n/locale-switcher";
import { useI18n } from "@/shared/i18n/provider";

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function LoginForm() {
  const { t } = useI18n();
  const [state, formAction] = useFormState<AuthActionResult | undefined, FormData>(
    signIn,
    undefined
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="mb-2 flex justify-end">
          <LocaleSwitcher className="bg-ds-canvas ring-ds-border" />
        </div>
        <CardTitle>{t("auth.loginTitle")}</CardTitle>
        <CardDescription>{t("auth.loginDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-ds-ink">
              {t("common.email")}
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
              {t("common.password")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="h-10 w-full rounded-[12px] border border-ds-border bg-ds-elevated px-3 text-sm text-ds-ink outline-none focus-visible:ring-2 focus-visible:ring-ds-lime"
            />
          </div>

          {state?.error ? (
            <p className="text-sm text-ds-coral" role="alert">
              {state.error}
            </p>
          ) : null}

          <SubmitButton
            label={t("common.signIn")}
            pendingLabel={t("auth.signingIn")}
          />
        </form>

        <Button type="button" variant="secondary" className="w-full" disabled>
          {t("auth.googleSoon")}
        </Button>

        <p className="text-center text-sm text-ds-muted">
          {t("auth.noAccount")}{" "}
          <Link
            href="/signup"
            className="font-medium text-ds-ink underline-offset-4 hover:underline"
          >
            {t("common.createAccount")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
