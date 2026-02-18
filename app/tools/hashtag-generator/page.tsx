import { type Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getToolBySlug, getRelatedTools, generateToolMetadata } from "@/lib/tools-config";
import { HashtagGeneratorClient } from "./hashtag-generator-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tool = getToolBySlug("hashtag-generator")!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function HashtagGeneratorPage() {
  const relatedTools = getRelatedTools(tool.slug);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b bg-muted/30">
        <div className="container py-8 md:py-12">
          <Button variant="ghost" size="sm" asChild className="mb-4 gap-2">
            <Link href="/tools">
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Link>
          </Button>
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              {tool.name}
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              {tool.description}
            </p>
          </div>
        </div>
      </section>

      {/* Tool */}
      <section className="container py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          <HashtagGeneratorClient />
        </div>
      </section>

      {/* Use Cases */}
      <section className="border-t bg-muted/30">
        <div className="container py-8 md:py-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold">Common Use Cases</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {tool.useCases.map((useCase, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base">{useCase}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="border-t">
        <div className="container py-8 md:py-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold">Hashtag Best Practices</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mix Popular and Niche</CardTitle>
                  <CardDescription>
                    Combine high-volume trending hashtags with specific niche tags to reach 
                    both broad and targeted audiences.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Keep It Relevant</CardTitle>
                  <CardDescription>
                    Only use hashtags that are directly related to your content. Irrelevant 
                    hashtags can hurt engagement and credibility.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Research Your Audience</CardTitle>
                  <CardDescription>
                    Explore what hashtags your target audience is using and engaging with. 
                    Join conversations they're already having.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Create Branded Hashtags</CardTitle>
                  <CardDescription>
                    Develop unique hashtags for your brand or campaigns to build community 
                    and track user-generated content.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-muted/30">
        <div className="container py-8 md:py-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How many hashtags should I use?</CardTitle>
                  <CardDescription>
                    It depends on the platform. Instagram allows up to 30 but 9-15 is optimal. 
                    Twitter/X works best with 1-3. LinkedIn recommends 3-5. Quality and relevance 
                    matter more than quantity.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Should I use trending hashtags?</CardTitle>
                  <CardDescription>
                    Only if they're relevant to your content. Jumping on trending hashtags just 
                    for visibility can backfire if your content doesn't match the conversation. 
                    Always prioritize relevance over trends.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I reuse the same hashtags?</CardTitle>
                  <CardDescription>
                    Yes, but with caution. Having a core set of relevant hashtags is fine, but 
                    avoid using the exact same hashtag list on every post. Mix it up to avoid 
                    looking spammy and to reach different audience segments.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Where should I place hashtags in my post?</CardTitle>
                  <CardDescription>
                    On Instagram, you can put them in the caption or first comment. Twitter/X 
                    hashtags work best integrated naturally into the tweet text. LinkedIn hashtags 
                    should be at the end of your post. Test what works best for your audience.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="border-t">
          <div className="container py-8 md:py-12">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold">Related Tools</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedTools.map((relatedTool) => (
                  <Card key={relatedTool.id} className="group transition-all hover:border-primary">
                    <CardHeader>
                      <CardTitle>
                        <Link href={`/tools/${relatedTool.slug}`} className="hover:underline">
                          {relatedTool.name}
                        </Link>
                      </CardTitle>
                      <CardDescription>{relatedTool.shortDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="outline" size="sm" className="gap-2">
                        <Link href={`/tools/${relatedTool.slug}`}>
                          Try it now
                          <ArrowLeft className="h-3 w-3 rotate-180" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
