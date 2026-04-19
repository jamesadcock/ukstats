import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SkipNav from "../components/layout/SkipNav";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";
import AnalyticsConsent from "../components/layout/AnalyticsConsent";
import { websiteJsonLd } from "../lib/jsonld";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UK Stats — Unbiased UK Public Statistics",
    template: "%s | UK Stats",
  },
  description:
    "Clear, unbiased UK public statistics on the economy, health, employment, housing, education and population — sourced directly from ONS and other official bodies.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ukstats.info",
  ),
  openGraph: {
    siteName: "UK Stats",
    type: "website",
    locale: "en_GB",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = websiteJsonLd();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SkipNav />
        <SiteHeader />
        <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        {GA_ID && <AnalyticsConsent gaId={GA_ID} />}
      </body>
    </html>
  );
}
