import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { BASE_URL, SITE_NAME } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Threadify terms of service. Free browser-based tool for formatting social media threads.",
  openGraph: {
    title: "Terms of Service | Threadify",
    description: "Threadify terms of service. Free browser-based tool for formatting social media threads.",
    url: `${BASE_URL}/terms`,
    siteName: SITE_NAME,
  },
};

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl" data-testid="text-terms-title">
        Terms of Service
      </h1>
      <p className="mt-2 text-muted-foreground">Last updated: February 2026</p>
      <Card className="mt-8">
        <CardContent className="prose prose-sm dark:prose-invert max-w-none p-5 sm:p-6">
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using Threadify, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.
          </p>

          <h2>Description of Service</h2>
          <p>
            Threadify is a free, browser-based tool that helps users format and split text content for various social media platforms. All processing occurs client-side in your browser.
          </p>

          <h2>User Responsibilities</h2>
          <ul>
            <li>You are responsible for the content you create and share using Threadify.</li>
            <li>You must comply with the terms of service of any platform where you post content.</li>
            <li>You must not use Threadify for any unlawful purpose.</li>
          </ul>

          <h2>Intellectual Property</h2>
          <p>
            Content you create using Threadify remains your intellectual property. Threadify does not claim any rights to user-generated content.
          </p>

          <h2>Disclaimer</h2>
          <p>
            Threadify is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted or error-free.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Threadify shall not be liable for any indirect, incidental, or consequential damages arising from use of the service.
          </p>

          <h2>Changes</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of the updated terms.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
