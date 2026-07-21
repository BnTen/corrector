"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { useI18n } from "@/shared/i18n/provider";
import { saveTryDraft } from "@/features/funnel/lib/draft-storage";

type Token =
  | { kind: "text"; value: string }
  | { kind: "fix"; wrong: string; right: string };

const DEMO_EN: Token[] = [
  { kind: "fix", wrong: "Their", right: "They're" },
  { kind: "text", value: " going " },
  { kind: "fix", wrong: "too", right: "to" },
  { kind: "text", value: " the " },
  { kind: "fix", wrong: "meeeting", right: "meeting" },
  { kind: "text", value: " " },
  { kind: "fix", wrong: "tommorow", right: "tomorrow" },
  { kind: "text", value: "." },
];

const DEMO_FR: Token[] = [
  { kind: "text", value: "Il faut que je " },
  { kind: "fix", wrong: "fini", right: "finisse" },
  { kind: "text", value: " ce " },
  { kind: "fix", wrong: "text", right: "texte" },
  { kind: "text", value: " demain." },
];

/** Product visual + chat composer — wow proof and conversion in one frame. */
export function CorrectionStage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [draft, setDraft] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const tokens = locale === "fr" ? DEMO_FR : DEMO_EN;
  let fixIndex = 0;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    saveTryDraft(draft);
    router.push("/try");
  }

  return (
    <div className="landing-stage relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
      <div className="landing-stage-glow" aria-hidden />

      <div className="relative px-1 py-2 sm:px-2 sm:py-3" aria-hidden>
        <div className="mb-3 flex items-center gap-2.5">
          <span className="landing-pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-[#b6d120]" />
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-ds-muted">
            {t("landing.demoLabel")}
          </span>
        </div>

        <p className="font-mono text-[14px] leading-[1.8] text-ds-ink sm:text-[16px] lg:text-[17px]">
          {tokens.map((token, i) => {
            if (token.kind === "text") {
              return <span key={`t-${i}`}>{token.value}</span>;
            }
            const idx = fixIndex++;
            return (
              <span
                key={`f-${i}`}
                className="landing-beat"
                style={{ ["--i" as string]: idx }}
              >
                <span className="landing-strike">{token.wrong}</span>
                <span className="landing-fix">{token.right}</span>
              </span>
            );
          })}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="landing-composer relative mt-4 sm:mt-5"
      >
        <label htmlFor="landing-draft" className="sr-only">
          {t("landing.inputLabel")}
        </label>
        <div className="flex items-center gap-2 rounded-ds-lg border border-ds-ink/[0.08] bg-ds-elevated/95 py-1.5 pl-3.5 pr-1.5 shadow-ds-sm backdrop-blur-sm transition-[border-color,box-shadow] focus-within:border-ds-ink/20 focus-within:shadow-ds-md">
          <input
            id="landing-draft"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t("landing.inputPlaceholder")}
            autoComplete="off"
            maxLength={2000}
            className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] text-ds-ink outline-none placeholder:text-ds-muted/80"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            aria-label={t("landing.inputSubmit")}
            className="landing-composer-send flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-ds-lime text-ds-ink transition-transform enabled:hover:scale-[1.04] enabled:active:scale-[0.98] disabled:opacity-60"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
        <p className="mt-2 px-1 text-[11px] text-ds-muted">
          {t("landing.inputHint")}
        </p>
      </form>
    </div>
  );
}
