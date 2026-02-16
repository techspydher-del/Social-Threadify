import { Link } from "wouter";
import { ArrowRight, Zap, Shield, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { platforms } from "@/lib/platforms";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function Home() {
  usePageMeta({
    title: "Threadify",
    description: "Generate perfectly formatted threads for X, Threads, LinkedIn, Reddit, Mastodon, and Facebook. Free online tool with no signup required.",
    path: "/",
  });

  return (
    <div className="flex flex-col">
      <section className="relative overflow-visible py-16 sm:py-24">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-5xl px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            Free &middot; No signup required
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl" data-testid="text-hero-title">
            Turn long-form content into{" "}
            <span className="text-primary">perfect social threads</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg" data-testid="text-hero-description">
            Threadify splits and formats your writing for X, Threads, LinkedIn, Reddit, Mastodon, and Facebook &mdash; instantly, in your browser.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/social">
              <Button size="lg" className="gap-2" data-testid="button-get-started">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline" size="lg" data-testid="button-learn-more">
                Learn more
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl" data-testid="text-platforms-heading">
              Platform-specific tools
            </h2>
            <p className="mt-2 text-muted-foreground">
              Optimised formatting for every major social network.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platforms.map((p) => (
              <Link key={p.slug} href={`/social/${p.slug}`}>
                <Card className="group h-full hover-elevate" data-testid={`card-platform-${p.slug}`}>
                  <CardContent className="flex flex-col gap-3 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent">
                        <p.icon className="h-5 w-5 text-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold leading-tight">{p.shortName}</h3>
                        <p className="text-xs text-muted-foreground">{p.charLimit.toLocaleString()} char limit</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" style={{ visibility: "visible" }} />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {p.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Why Threadify?
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Instant formatting",
                desc: "Paste your content and get platform-ready posts in seconds. No delays, no server processing.",
              },
              {
                icon: Shield,
                title: "Private by design",
                desc: "Everything runs in your browser. Your content never leaves your device.",
              },
              {
                icon: Smartphone,
                title: "Works everywhere",
                desc: "Fully responsive and works on any device. Your drafts are saved locally and restored automatically.",
              },
            ].map((item) => (
              <Card key={item.title} data-testid={`card-feature-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-8 sm:p-12">
              <h2 className="text-xl font-semibold sm:text-2xl">Ready to create your first thread?</h2>
              <p className="mt-2 text-muted-foreground">Pick a platform and start formatting. It&apos;s free, forever.</p>
              <Link href="/social">
                <Button size="lg" className="mt-6 gap-2" data-testid="button-cta-bottom">
                  Browse all tools
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
