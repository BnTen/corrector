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
import { LocaleSwitcher } from "@/shared/i18n/locale-switcher";
import { useI18n } from "@/shared/i18n/provider";

function SubmitButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function SignupForm() {
  const { t } = useI18n();
  const [state, formAction] = useFormState<AuthActionResult | undefined, FormData>(
    signUp,
    undefined
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="mb-2 flex justify-end">
          <LocaleSwitcher className="bg-ds-canvas ring-ds-border" />
        </div>
        <CardTitle>{t("auth.signupTitle")}</CardTitle>
        <CardDescription>{t("auth.signupDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="displayName"
              className="text-sm font-medium text-ds-ink"
            >
              {t("auth.displayName")}
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
              autoComplete="new-password"
              required
              minLength={6}
              className="h-10 w-full rounded-[12px] border border-ds-border bg-ds-elevated px-3 text-sm text-ds-ink outline-none focus-visible:ring-2 focus-visible:ring-ds-lime"
            />
          </div>

          <label className="flex items-start gap-2.5 text-sm leading-snug text-ds-muted">
            <input
              type="checkbox"
              name="acceptTerms"
              required
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-ds-border text-ds-ink accent-ds-lime"
            />
            <span>
              {t("auth.acceptTermsPrefix")}{" "}
              <Link
                href="/cgu"
                className="font-medium text-ds-ink underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("auth.cgu")}
              </Link>{" "}
              {t("auth.acceptTermsAnd")}{" "}
              <Link
                href="/confidentialite"
                className="font-medium text-ds-ink underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("auth.privacy")}
              </Link>
              .
            </span>
          </label>

          {state?.error ? (
            <p className="text-sm text-ds-coral" role="alert">
              {state.error}
            </p>
          ) : null}

          <SubmitButton
            label={t("auth.createMyAccount")}
            pendingLabel={t("auth.creating")}
          />
        </form>

        <Button type="button" variant="secondary" className="w-full" disabled>
          {t("auth.googleSoon")}
        </Button>

        <p className="text-center text-sm text-ds-muted">
          {t("auth.alreadyHave")}{" "}
          <Link
            href="/login"
            className="font-medium text-ds-ink underline-offset-4 hover:underline"
          >
            {t("common.signIn")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
