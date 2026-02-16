import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams } from "wouter";
import { ArrowRight, ArrowDown, Lightbulb, Link2, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { getPlatformBySlug, platforms } from "@/lib/platforms";
import { getDraft, setDraft } from "@/lib/storage";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function PlatformPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const platform = getPlatformBySlug(slug);

  usePageMeta({
    title: platform ? platform.name : "Platform Not Found",
    description: platform?.description,
  });

  const [content, setContent] = useState("");
  const generatorRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!platform) return;
    const draft = getDraft(slug);
    if (draft) {
      setContent(draft.content);
    } else {
      setContent("");
    }
    hasLoadedRef.current = true;
  }, [slug, platform]);

  const handleContentChange = useCallback(
    (value: string) => {
      setContent(value);
      if (platform) {
        setDraft(slug, { content: value, updatedAt: Date.now() });
      }
    },
    [slug, platform]
  );

  if (!platform) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold" data-testid="text-platform-not-found">Platform not found</h1>
        <p className="mt-2 text-muted-foreground">The tool you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/social">
          <Button className="mt-6" data-testid="button-back-to-tools">Back to tools</Button>
        </Link>
      </div>
    );
  }

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const relatedPlatforms = platforms.filter((p) => p.slug !== slug).slice(0, 3);
  const charCount = content.length;
  const isOverLimit = charCount > platform.charLimit;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <section className="mb-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent">
            <platform.icon className="h-6 w-6 text-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl" data-testid="text-platform-title">
              {platform.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground" data-testid="text-platform-description">
              {platform.description}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 gap-2"
          onClick={scrollToGenerator}
          data-testid="button-jump-to-generator"
        >
          Jump to generator
          <ArrowDown className="h-3 w-3" />
        </Button>
      </section>

      <section ref={generatorRef} className="mb-8">
        <Card data-testid="card-generator">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold" data-testid="text-content-label">Your content</h2>
              <Badge variant={isOverLimit ? "destructive" : "secondary"} className="text-xs font-mono" data-testid="badge-char-count">
                {charCount.toLocaleString()} / {platform.charLimit.toLocaleString()}
              </Badge>
            </div>
            <Textarea
              placeholder={`Paste or type your ${platform.shortName} content here...`}
              className="min-h-[200px] resize-y text-sm leading-relaxed"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              data-testid="textarea-content"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                <Info className="mr-1 inline h-3 w-3" />
                Your draft is saved locally and will be restored on your next visit.
              </p>
              <Button disabled className="gap-2" data-testid="button-generate">
                Generate
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mb-8">
        <Card data-testid="card-tips">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">{platform.tipTitle}</h2>
            </div>
            <ul className="space-y-2">
              {platform.tips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground" data-testid={`text-tip-${i}`}>
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Related tools</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {relatedPlatforms.map((rp) => (
            <Link key={rp.slug} href={`/social/${rp.slug}`}>
              <Card className="group h-full hover-elevate" data-testid={`card-related-${rp.slug}`}>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent">
                    <rp.icon className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight">{rp.shortName}</p>
                    <p className="text-xs text-muted-foreground">{rp.charLimit.toLocaleString()} chars</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
