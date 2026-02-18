import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Threadify - Free Social Media Thread Generator",
    template: "%s | Threadify",
  },
  description: "Generate perfectly formatted threads for X, Threads, LinkedIn, Reddit, Mastodon, and Facebook. Free online tool with no signup required.",
  keywords: ["social media", "thread generator", "twitter", "threads", "linkedin", "reddit", "mastodon", "facebook"],
  authors: [{ name: "Threadify" }],
  creator: "Threadify",
  metadataBase: new URL(process.env.SITE_URL || "https://threadify.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://threadify.app",
    siteName: "Threadify",
    title: "Threadify - Free Social Media Thread Generator",
    description: "Generate perfectly formatted threads for X, Threads, LinkedIn, Reddit, Mastodon, and Facebook.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Threadify",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Threadify - Free Social Media Thread Generator",
    description: "Generate perfectly formatted threads for X, Threads, LinkedIn, Reddit, Mastodon, and Facebook.",
    images: ["/og-image.png"],
    creator: "@threadifyapp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
