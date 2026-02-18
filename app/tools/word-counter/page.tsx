import { type Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getToolBySlug, getRelatedTools, generateToolMetadata } from "@/lib/tools-config";
import { WordCounterClient } from "./word-counter-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tool = getToolBySlug("word-counter")!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function WordCounterPage() {
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
          <WordCounterClient />
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
            <h2 className="mb-6 text-2xl font-bold">How to Use the Word Counter</h2>
            <Card>
              <CardContent className="pt-6">
                <ol className="space-y-4 list-decimal list-inside">
                  <li className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Type or paste your text</span> into the text area above
                  </li>
                  <li className="text-muted-foreground">
                    <span className="font-semibold text-foreground">View instant statistics</span> including word count, character count, reading time, and speaking duration
                  </li>
                  <li className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Check content type guidelines</span> to see if your text matches common content length requirements
                  </li>
                  <li className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Use reading and speaking times</span> to plan presentations, podcasts, or video scripts
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
                  <CardTitle className="text-lg">How is word count calculated?</CardTitle>
                  <CardDescription>
                    Words are counted by splitting the text on whitespace (spaces, tabs, line breaks). 
                    Each group of characters separated by whitespace is counted as one word. Hyphenated 
                    words are counted as one word.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How accurate is the reading time estimate?</CardTitle>
                  <CardDescription>
                    Reading time is calculated based on an average reading speed of 225 words per minute, 
                    which is the typical rate for adult readers. Actual reading time may vary based on 
                    content complexity, reader familiarity, and reading purpose.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's the difference between reading time and speaking time?</CardTitle>
                  <CardDescription>
                    Speaking time is based on 140 words per minute, which is slower than reading speed. 
                    This is useful for preparing speeches, presentations, podcasts, or video scripts where 
                    you need to estimate how long it will take to verbally deliver your content.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is my text saved or stored?</CardTitle>
                  <CardDescription>
                    No, all analysis happens locally in your browser. We don't store, save, or transmit 
                    your content to our servers. Your text remains completely private and secure.
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
