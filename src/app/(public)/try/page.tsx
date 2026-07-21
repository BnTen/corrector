"use client";

import * as React from "react";
import Link from "next/link";
import { TopBar } from "@/shared/components/ui/top-bar";
import { EditorScene } from "@/features/editor/components/editor-scene";
import { EmailGateModal } from "@/features/funnel/components/email-gate-modal";
import { useFunnelCredits } from "@/features/funnel/hooks/use-funnel-credits";
import { consumeTryDraft } from "@/features/funnel/lib/draft-storage";
import { Pill } from "@/shared/components/ui/pill";
import { SiteFooter } from "@/shared/components/ui/site-footer";
import { useI18n } from "@/shared/i18n/provider";

export default function TryPage() {
  const { t } = useI18n();
  const {
    creditsRemaining,
    isGateOpen,
    openGate,
    closeGate,
    tryConsume,
    unlockWithEmail,
    leadEmail,
    hydrated,
  } = useFunnelCredits();

  const [loadContent, setLoadContent] = React.useState<{
    text: string;
    nonce: number;
  } | null>(null);

  React.useEffect(() => {
    const draft = consumeTryDraft();
    if (!draft) return;
    setLoadContent({ text: draft, nonce: Date.now() });
  }, []);

  const handleCreditsConsumed = React.useCallback(
    (count: number) => {
      tryConsume(count);
    },
    [tryConsume]
  );

  const handleCreditsExhausted = React.useCallback(() => {
    if (!leadEmail) openGate();
  }, [leadEmail, openGate]);

  const onCreditsExhaustedStable = React.useRef(handleCreditsExhausted);
  onCreditsExhaustedStable.current = handleCreditsExhausted;
  const gateOpenedForBatch = React.useRef(false);

  React.useEffect(() => {
    if (creditsRemaining > 0) gateOpenedForBatch.current = false;
  }, [creditsRemaining]);

  const handleExhaustedOnce = React.useCallback(() => {
    if (gateOpenedForBatch.current) return;
    gateOpenedForBatch.current = true;
    onCreditsExhaustedStable.current();
  }, []);

  const outOfCredits = hydrated && creditsRemaining <= 0 && Boolean(leadEmail);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-ds-canvas">
      <TopBar
        showEditorCta={false}
        navItems={[
          { href: "/try", label: t("nav.try"), active: true },
          { href: "/login", label: t("nav.login") },
        ]}
      >
        <Pill tone="lime" className="hidden sm:inline-flex">
          {hydrated
            ? `${creditsRemaining} ${
                creditsRemaining === 1
                  ? t("common.credit")
                  : t("common.credits")
              }`
            : "…"}
        </Pill>
      </TopBar>

      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-3 py-3 sm:px-6 lg:px-8">
        <div className="mb-2 shrink-0">
          <h1 className="text-xl font-semibold tracking-tight text-ds-ink sm:text-2xl">
            {t("try.title")}
          </h1>
          <p className="mt-0.5 text-sm text-ds-muted">
            {t("try.subtitle")}
            {leadEmail ? (
              <span className="text-ds-ink">
                {" "}
                · {t("try.unlockedFor")} {leadEmail}
              </span>
            ) : null}
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <EditorScene
            loadContent={loadContent}
            creditsRemaining={creditsRemaining}
            onCreditsConsumed={handleCreditsConsumed}
            onCreditsExhausted={handleExhaustedOnce}
          />

          {outOfCredits ? (
            <div className="mt-3 rounded-[14px] border border-ds-border bg-ds-elevated p-3 text-sm text-ds-ink shadow-ds-sm">
              {t("try.outOfCredits")}{" "}
              <Link
                href="/signup"
                className="font-semibold underline-offset-2 hover:underline"
              >
                {t("common.createAccount")}
              </Link>
            </div>
          ) : null}

          <p className="mt-4 pb-4 text-center text-sm text-ds-muted">
            {t("try.needAccount")}{" "}
            <Link
              href="/signup"
              className="font-medium text-ds-ink underline-offset-2 hover:underline"
            >
              {t("common.createAccount")}
            </Link>
          </p>
        </div>
      </div>

      <SiteFooter variant="compact" />

      <EmailGateModal
        open={isGateOpen}
        onOpenChange={(open) => (open ? openGate() : closeGate())}
        onSuccess={(email, creditsGranted) => {
          unlockWithEmail(email, creditsGranted);
        }}
      />
    </div>
  );
}
