import type { Metadata, Viewport } from "next";
import { Syne } from "next/font/google";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import { LocaleProvider } from "@/shared/i18n/provider";
import {
  DEFAULT_UI_LOCALE,
  UI_LOCALE_COOKIE,
  isUiLocale,
  type UiLocale,
} from "@/shared/i18n/config";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Text Corrector — Mistakes don't stand a chance",
  description:
    "Live spelling, grammar & style. Two free corrections — no account, no wait.",
  manifest: "/manifest.webmanifest",
  applicationName: "Text Corrector",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#14151a",
};

function readInitialLocale(): UiLocale {
  const value = cookies().get(UI_LOCALE_COOKIE)?.value;
  return isUiLocale(value) ? value : DEFAULT_UI_LOCALE;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = readInitialLocale();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased`}
      >
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
