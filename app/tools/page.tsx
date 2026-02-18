import { type Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Type, FileText, Hash } from "lucide-react";
import { tools } from "@/lib/tools-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Free Social Media Tools - Character Counter, Word Counter & More | Threadify",
  description: "Access free online tools for social media content creation. Character counter, word counter, hashtag generator, and more to optimize your content.",
  keywords: [
    "social media tools",
    "character counter",
    "word counter",
    "hashtag generator",
    "free online tools",
    "content creation tools"
  ],
  openGraph: {
    title: "Free Social Media Tools | Threadify",
    description: "Access free online tools for social media content creation. Character counter, word counter, hashtag generator, and more.",
    type: "website",
  },
};

const iconMap = {
  Type,
  FileText,
  Hash,
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b bg-muted/30">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
              Free Tools for Content Creators
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl text-pretty">
              Optimize your social media content with our suite of free, easy-to-use tools. 
              No signup required—start creating better content instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container py-12 md:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = iconMap[tool.icon as keyof typeof iconMap];
            return (
              <Link key={tool.id} href={`/tools/${tool.slug}`}>
                <Card className="group h-full transition-all hover:border-primary hover:shadow-md">
                  <CardHeader>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {tool.name}
                      <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardTitle>
                    <CardDescription>{tool.shortDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="border-t bg-muted/30">
        <div className="container py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Perfect for Every Content Creator
            </h2>
            <p className="mb-12 text-muted-foreground">
              Whether you're a social media manager, blogger, or content creator, 
              our tools help you create optimized content faster.
            </p>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold">Social Media Managers</h3>
                <p className="text-sm text-muted-foreground">
                  Stay within character limits, generate trending hashtags, and 
                  optimize posts for maximum engagement.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Content Writers</h3>
                <p className="text-sm text-muted-foreground">
                  Track word counts, estimate reading time, and ensure your 
                  content meets requirements.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Marketing Teams</h3>
                <p className="text-sm text-muted-foreground">
                  Create SEO-optimized meta descriptions and social media 
                  content that drives results.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Influencers</h3>
                <p className="text-sm text-muted-foreground">
                  Craft perfect captions, discover trending hashtags, and 
                  maintain consistency across platforms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
        <div className="container py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Ready to Create Better Content?
            </h2>
            <p className="mb-8 text-muted-foreground">
              All our tools are completely free and require no signup. 
              Start optimizing your content now.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/tools/character-counter">
                  Try Character Counter
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">
                  Generate Threads
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
