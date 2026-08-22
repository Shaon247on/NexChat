import type { Metadata, Viewport } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { SITE_NAME } from "@/lib/constants";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * Root layout is deliberately minimal: <html>, <body>, fonts, nothing else.
 *
 * Each route group layers on only what it needs — the marketing group adds Lenis
 * smooth scroll plus navbar/footer chrome, while the chat and auth groups
 * intentionally opt out of it. Lenis binds to document scroll, which would fight
 * the message list's own scroll container and break the "don't force-scroll a
 * user who has scrolled up" behaviour the chat panel depends on.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="font-dm-sans antialiased bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
