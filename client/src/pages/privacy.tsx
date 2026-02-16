import { Card, CardContent } from "@/components/ui/card";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function Privacy() {
  usePageMeta({ title: "Privacy Policy", description: "Threadify privacy policy. We do not collect personal data." });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl" data-testid="text-privacy-title">
        Privacy Policy
      </h1>
      <p className="mt-2 text-muted-foreground">Last updated: February 2026</p>
      <Card className="mt-8">
        <CardContent className="prose prose-sm dark:prose-invert max-w-none p-5 sm:p-6">
          <h2>Overview</h2>
          <p>
            Threadify is a client-side tool. We do not collect, store, or process any personal data or user content on our servers.
          </p>

          <h2>Data We Don't Collect</h2>
          <ul>
            <li>We do not require user accounts or login credentials.</li>
            <li>We do not track or store any content you type into the generator.</li>
            <li>We do not use cookies for tracking or advertising.</li>
          </ul>

          <h2>Local Storage</h2>
          <p>
            Threadify uses your browser's localStorage to save drafts so they persist between sessions. This data never leaves your device and can be cleared at any time through your browser settings.
          </p>

          <h2>Analytics</h2>
          <p>
            We may use privacy-respecting analytics to understand how the tool is used (e.g., page views). No personally identifiable information is collected.
          </p>

          <h2>Changes</h2>
          <p>
            We may update this policy from time to time. Any changes will be reflected on this page with an updated date.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about this privacy policy, please reach out through the channels listed on our website.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
