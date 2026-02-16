import { Card, CardContent } from "@/components/ui/card";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function Cookies() {
  usePageMeta({ title: "Cookie Policy", description: "Threadify cookie policy. We use localStorage, not cookies." });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl" data-testid="text-cookies-title">
        Cookie Policy
      </h1>
      <p className="mt-2 text-muted-foreground">Last updated: February 2026</p>
      <Card className="mt-8">
        <CardContent className="prose prose-sm dark:prose-invert max-w-none p-5 sm:p-6">
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device by websites you visit. They are used to remember preferences and improve your browsing experience.
          </p>

          <h2>How We Use Cookies</h2>
          <p>
            Threadify does not use traditional cookies. Instead, we use localStorage (a browser storage mechanism) to save your drafts and theme preference locally on your device.
          </p>

          <h2>What We Store</h2>
          <ul>
            <li><strong>Theme preference:</strong> Your selected theme (light, dark, or system) so it persists between visits.</li>
            <li><strong>Draft content:</strong> Any content you type into the generators, so you don&apos;t lose your work.</li>
          </ul>

          <h2>Third-Party Cookies</h2>
          <p>
            Threadify does not use any third-party cookies for tracking, advertising, or analytics purposes.
          </p>

          <h2>Managing Your Data</h2>
          <p>
            You can clear all locally stored data at any time through your browser settings by clearing site data for this domain.
          </p>

          <h2>Changes</h2>
          <p>
            We may update this cookie policy from time to time. Changes will be reflected on this page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
