"use client";

import { useI18n } from "@/shared/i18n/provider";

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

/** Product visual: looping live-correction beat — the wow proof in one frame. */
export function CorrectionStage() {
  const { t, locale } = useI18n();
  const tokens = locale === "fr" ? DEMO_FR : DEMO_EN;
  let fixIndex = 0;

  return (
    <div
      className="landing-stage relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none"
      aria-hidden
    >
      <div className="landing-stage-glow" />
      <div className="relative px-1 py-2 sm:px-2 sm:py-3">
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
    </div>
  );
}
