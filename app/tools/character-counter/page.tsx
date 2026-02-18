import { type Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getToolBySlug, getRelatedTools, generateToolMetadata } from "@/lib/tools-config";
import { CharacterCounterClient } from "./character-counter-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tool = getToolBySlug("character-counter")!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function CharacterCounterPage() {
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
          <CharacterCounterClient />
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

      {/* How to Use */}
      <section className="border-t">
        <div className="container py-8 md:py-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold">How to Use the Character Counter</h2>
            <Card>
              <CardContent className="pt-6">
                <ol className="space-y-4 list-decimal list-inside">
                  <li className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Type or paste your text</span> into the text area above
                  </li>
                  <li className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Watch real-time statistics</span> update as you type, including character count, word count, and more
                  </li>
                  <li className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Check platform limits</span> to ensure your content fits within social media character restrictions
                  </li>
                  <li className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Copy or clear</span> your text using the action buttons when you're done
                  </li>
                </ol>
              </CardContent>
            </Card>
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
                  <CardTitle className="text-lg">What's the difference between characters and characters without spaces?</CardTitle>
                  <CardDescription>
                    Characters include all letters, numbers, punctuation, and spaces. Characters without spaces 
                    exclude all whitespace, which is useful for certain platforms or requirements that don't count spaces.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Why are character limits important for social media?</CardTitle>
                  <CardDescription>
                    Each social media platform has different character limits to ensure optimal user experience. 
                    Staying within these limits prevents your posts from being cut off and ensures your full message is visible.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is my text stored or saved anywhere?</CardTitle>
                  <CardDescription>
                    No, all text analysis happens locally in your browser. We don't store, save, or transmit 
                    any of your content to our servers. Your data remains completely private.
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
