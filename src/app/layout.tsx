import type { Metadata, Viewport } from "next";
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

export const metadata: Metadata = {
  title: "Text Corrector",
  description:
    "Smart text corrector — spelling, grammar and style in real time. 2 free corrections, no account required.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
