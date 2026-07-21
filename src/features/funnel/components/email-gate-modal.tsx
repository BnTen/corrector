"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { EMAIL_BONUS_CREDITS } from "@/features/funnel/lib/constants";
import { useI18n } from "@/shared/i18n/provider";

export interface EmailGateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (email: string, creditsGranted: number) => void;
}

export function EmailGateModal({
  open,
  onOpenChange,
  onSuccess,
}: EmailGateModalProps) {
  const { t } = useI18n();
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setError(t("funnel.invalidEmail"));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source: "try_gate" }),
      });
      const data = (await response.json().catch(() => null)) as {
        error?: string;
        creditsGranted?: number;
      } | null;

      if (!response.ok) {
        setError(data?.error || t("funnel.saveFailed"));
        return;
      }

      onSuccess(trimmed, data?.creditsGranted ?? EMAIL_BONUS_CREDITS);
      setEmail("");
    } catch {
      setError(t("funnel.network"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-ds-inverse/45 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-[16px] border border-ds-border bg-ds-elevated p-5 shadow-ds-md focus:outline-none">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="text-lg font-semibold tracking-tight text-ds-ink">
                {t("funnel.unlockTitle", { n: EMAIL_BONUS_CREDITS })}
              </Dialog.Title>
              <Dialog.Description className="mt-1.5 text-sm leading-relaxed text-ds-muted">
                {t("funnel.unlockDesc")}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-lg p-1.5 text-ds-muted transition hover:bg-ds-canvas hover:text-ds-ink"
                aria-label={t("common.close")}
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ds-muted">
                {t("common.email")}
              </span>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 w-full rounded-[12px] border border-ds-border bg-white px-3 text-sm text-ds-ink outline-none ring-ds-lime placeholder:text-ds-muted/70 focus:ring-2"
              />
            </label>
            {error ? (
              <p className="text-xs text-ds-coral" role="alert">
                {error}
              </p>
            ) : null}
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t("funnel.sending")
                : t("funnel.continue", { n: EMAIL_BONUS_CREDITS })}
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
