import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "ds-canvas": "var(--ds-canvas)",
        "ds-elevated": "var(--ds-elevated)",
        "ds-inverse": "var(--ds-inverse)",
        "ds-ink": "var(--ds-ink)",
        "ds-muted": "var(--ds-muted)",
        "ds-border": "var(--ds-border)",
        "ds-lime": "var(--ds-lime)",
        "ds-sky": "var(--ds-sky)",
        "ds-coral": "var(--ds-coral)",
        "ds-pink": "var(--ds-pink)",
        "ds-yellow": "var(--ds-yellow)",
        "ds-lavender": "var(--ds-lavender)",
      },
      borderRadius: {
        "ds-sm": "var(--ds-radius-sm)",
        "ds-md": "var(--ds-radius-md)",
        "ds-lg": "var(--ds-radius-lg)",
        "ds-pill": "var(--ds-radius-pill)",
      },
      boxShadow: {
        "ds-sm": "var(--ds-shadow-sm)",
        "ds-md": "var(--ds-shadow-md)",
        "ds-lg": "var(--ds-shadow-lg)",
      },
    },
  },
  plugins: [],
};
export default config;
