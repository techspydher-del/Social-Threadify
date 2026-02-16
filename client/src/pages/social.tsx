import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { platforms } from "@/lib/platforms";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function Social() {
  usePageMeta({
    title: "Social Media Tools",
    description: "Browse all platform-specific formatting tools. Split and format your content for X, Threads, LinkedIn, Reddit, Mastodon, and Facebook.",
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl" data-testid="text-social-title">
          Platform-specific tools
        </h1>
        <p className="mt-2 text-muted-foreground">
          Choose a platform to format and split your content with the right character limits and best practices.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {platforms.map((p) => (
          <Link key={p.slug} href={`/social/${p.slug}`}>
            <Card className="group h-full hover-elevate" data-testid={`card-tool-${p.slug}`}>
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent">
                    <p.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold leading-tight">{p.name}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <Badge variant="secondary" className="text-xs">
                    {p.charLimit.toLocaleString()} chars
                  </Badge>
                  <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100" style={{ visibility: "visible" }}>
                    Open tool
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
