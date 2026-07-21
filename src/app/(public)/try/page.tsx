"use client";

import * as React from "react";
import Link from "next/link";
import { TopBar } from "@/shared/components/ui/top-bar";
import { EditorScene } from "@/features/editor/components/editor-scene";
import { EmailGateModal } from "@/features/funnel/components/email-gate-modal";
import { useFunnelCredits } from "@/features/funnel/hooks/use-funnel-credits";
import { Pill } from "@/shared/components/ui/pill";

export default function TryPage() {
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
    <div className="flex min-h-dvh flex-col bg-ds-canvas">
      <TopBar
        showEditorCta={false}
        navItems={[
          { href: "/try", label: "Essai", active: true },
          { href: "/login", label: "Connexion" },
        ]}
      >
        <Pill tone="lime" className="hidden sm:inline-flex">
          {hydrated
            ? `${creditsRemaining} crédit${creditsRemaining === 1 ? "" : "s"}`
            : "…"}
        </Pill>
      </TopBar>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-3 pb-10 pt-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold tracking-tight text-ds-ink sm:text-3xl">
            Playground
          </h1>
          <p className="mt-1.5 text-sm text-ds-muted sm:text-base">
            2 corrections gratuites. Écrivez — on corrige en direct.
            {leadEmail ? (
              <span className="text-ds-ink"> · Débloqué pour {leadEmail}</span>
            ) : null}
          </p>
        </div>

        <EditorScene
          creditsRemaining={creditsRemaining}
          onCreditsConsumed={handleCreditsConsumed}
          onCreditsExhausted={handleExhaustedOnce}
        />

        {outOfCredits ? (
          <div className="mt-4 rounded-[14px] border border-ds-border bg-ds-elevated p-4 text-sm text-ds-ink shadow-ds-sm">
            Crédits épuisés.{" "}
            <Link
              href="/signup"
              className="font-semibold underline-offset-2 hover:underline"
            >
              Créez un compte
            </Link>{" "}
            pour des corrections illimitées et le dashboard.
          </div>
        ) : null}

        <p className="mt-6 text-center text-sm text-ds-muted">
          Besoin d’un compte pour stats & classeur ?{" "}
          <Link
            href="/signup"
            className="font-medium text-ds-ink underline-offset-2 hover:underline"
          >
            Créer un compte
          </Link>
        </p>
      </div>

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
