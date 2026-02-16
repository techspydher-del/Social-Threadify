import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams } from "wouter";
import {
  ArrowRight,
  ArrowDown,
  Lightbulb,
  Link2,
  Info,
  Copy,
  Check,
  Download,
  Share2,
  Hash,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getPlatformBySlug, platforms } from "@/lib/platforms";
import { getDraft, setDraft, type DraftData } from "@/lib/storage";
import { countCharacters } from "@/lib/character-counter";
import { splitIntoPosts } from "@/lib/text-processor";
import { copyToClipboard, downloadAsTextFile, canShare, shareText } from "@/lib/clipboard";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useToast } from "@/hooks/use-toast";

export default function PlatformPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const platform = getPlatformBySlug(slug);
  const { toast } = useToast();

  usePageMeta({
    title: platform ? platform.name : "Platform Not Found",
    description: platform?.description,
  });

  const [content, setContent] = useState("");
  const [presetHashtags, setPresetHashtags] = useState("");
  const [numberingEnabled, setNumberingEnabled] = useState(true);
  const [appendHashtags, setAppendHashtags] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const generatorRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!platform) return;
    const draft = getDraft(slug);
    if (draft) {
      setContent(draft.content || "");
      setPresetHashtags(draft.presetHashtags || "");
      setNumberingEnabled(draft.numberingEnabled ?? true);
      setAppendHashtags(draft.appendHashtags ?? false);
      if (draft.generatedPosts && draft.generatedPosts.length > 0) {
        setGeneratedPosts(draft.generatedPosts);
      } else {
        setGeneratedPosts([]);
      }
    } else {
      setContent("");
      setPresetHashtags("");
      setNumberingEnabled(true);
      setAppendHashtags(false);
      setGeneratedPosts([]);
    }
    setSelectedPost(0);
    setCopiedIndex(null);
    setCopiedAll(false);
    hasLoadedRef.current = true;
  }, [slug, platform]);

  const saveDraft = useCallback(
    (updates: Partial<DraftData>) => {
      if (!platform) return;
      const current = getDraft(slug) || { content: "", updatedAt: 0 };
      setDraft(slug, {
        ...current,
        ...updates,
        updatedAt: Date.now(),
      });
    },
    [slug, platform]
  );

  const handleContentChange = useCallback(
    (value: string) => {
      setContent(value);
      saveDraft({ content: value });
    },
    [saveDraft]
  );

  const handleHashtagsChange = useCallback(
    (value: string) => {
      setPresetHashtags(value);
      saveDraft({ presetHashtags: value });
    },
    [saveDraft]
  );

  const handleNumberingToggle = useCallback(
    (checked: boolean) => {
      setNumberingEnabled(checked);
      saveDraft({ numberingEnabled: checked });
    },
    [saveDraft]
  );

  const handleAppendHashtagsToggle = useCallback(
    (checked: boolean) => {
      setAppendHashtags(checked);
      saveDraft({ appendHashtags: checked });
    },
    [saveDraft]
  );

  const handleGenerate = useCallback(() => {
    if (!platform || !content.trim()) return;

    const supportsNumbering =
      slug === "x-thread-generator" ||
      slug === "threads-thread-generator" ||
      slug === "mastodon-post-splitter";

    const posts = splitIntoPosts(content, {
      charLimit: platform.charLimit,
      platformSlug: slug,
      numberingEnabled: supportsNumbering ? numberingEnabled : false,
      hashtags: presetHashtags,
      appendHashtags,
    });

    setGeneratedPosts(posts);
    setSelectedPost(0);
    saveDraft({ generatedPosts: posts, content });

    setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [platform, content, slug, numberingEnabled, presetHashtags, appendHashtags, saveDraft]);

  const handlePostEdit = useCallback(
    (index: number, value: string) => {
      const updated = [...generatedPosts];
      updated[index] = value;
      setGeneratedPosts(updated);
      saveDraft({ generatedPosts: updated });
    },
    [generatedPosts, saveDraft]
  );

  const handleCopyPost = useCallback(
    async (index: number) => {
      const success = await copyToClipboard(generatedPosts[index]);
      if (success) {
        setCopiedIndex(index);
        toast({ title: "Copied!", description: `Post ${index + 1} copied to clipboard.` });
        setTimeout(() => setCopiedIndex(null), 2000);
      }
    },
    [generatedPosts, toast]
  );

  const handleCopyAll = useCallback(
    async () => {
      const text = generatedPosts.join("\n\n---\n\n");
      const success = await copyToClipboard(text);
      if (success) {
        setCopiedAll(true);
        toast({ title: "All posts copied!", description: `${generatedPosts.length} posts copied to clipboard.` });
        setTimeout(() => setCopiedAll(false), 2000);
      }
    },
    [generatedPosts, toast]
  );

  const handleDownload = useCallback(() => {
    const text = generatedPosts
      .map((post, i) => `--- Post ${i + 1} ---\n${post}`)
      .join("\n\n");
    const filename = `${platform?.shortName.toLowerCase().replace(/[\s\/]/g, "-")}-thread.txt`;
    downloadAsTextFile(text, filename);
    toast({ title: "Downloaded!", description: "Thread saved as text file." });
  }, [generatedPosts, platform, toast]);

  const handleShare = useCallback(async () => {
    const text = generatedPosts.join("\n\n---\n\n");
    await shareText(text, `${platform?.shortName} Thread`);
  }, [generatedPosts, platform]);

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

  const charInfo = countCharacters(content, slug, platform.charLimit);
  const relatedPlatforms = platforms.filter((p) => p.slug !== slug).slice(0, 3);
  const supportsNumbering =
    slug === "x-thread-generator" ||
    slug === "threads-thread-generator" ||
    slug === "mastodon-post-splitter";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-32 sm:py-12">
      <section className="mb-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent">
            <platform.icon className="h-6 w-6 text-foreground" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl" data-testid="text-platform-title">
                {platform.name}
              </h1>
              <Badge variant="secondary" className="text-xs" data-testid="badge-platform-name">
                {platform.shortName}
              </Badge>
            </div>
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
              <Badge
                variant={charInfo.isOver ? "destructive" : "secondary"}
                className="text-xs font-mono"
                data-testid="badge-char-count"
              >
                {charInfo.count.toLocaleString()} / {charInfo.limit.toLocaleString()}
              </Badge>
            </div>
            <Textarea
              placeholder={`Paste or type your ${platform.shortName} content here...`}
              className="min-h-[200px] resize-y text-sm leading-relaxed"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              data-testid="textarea-content"
            />

            <Separator className="my-4" />

            <div className="space-y-4">
              <div>
                <Label htmlFor="hashtags" className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Hash className="h-3 w-3" />
                  Preset hashtags (comma-separated)
                </Label>
                <Input
                  id="hashtags"
                  placeholder="e.g. webdev, javascript, coding"
                  className="text-sm"
                  value={presetHashtags}
                  onChange={(e) => handleHashtagsChange(e.target.value)}
                  data-testid="input-hashtags"
                />
              </div>

              <div className="flex flex-wrap gap-6">
                {supportsNumbering && (
                  <div className="flex items-center gap-2">
                    <Switch
                      id="numbering"
                      checked={numberingEnabled}
                      onCheckedChange={handleNumberingToggle}
                      data-testid="switch-numbering"
                    />
                    <Label htmlFor="numbering" className="text-sm cursor-pointer">
                      Add thread numbering (1/n)
                    </Label>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Switch
                    id="append-hashtags"
                    checked={appendHashtags}
                    onCheckedChange={handleAppendHashtagsToggle}
                    data-testid="switch-append-hashtags"
                  />
                  <Label htmlFor="append-hashtags" className="text-sm cursor-pointer">
                    Append hashtags to each post
                  </Label>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                <Info className="mr-1 inline h-3 w-3" />
                Your draft is saved locally and will be restored on your next visit.
              </p>
              <Button
                onClick={handleGenerate}
                disabled={!content.trim()}
                className="gap-2"
                data-testid="button-generate"
              >
                Generate
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {generatedPosts.length > 0 && (
        <section ref={outputRef} className="mb-8" data-testid="section-output">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">
              Generated posts
              <Badge variant="secondary" className="ml-2 text-xs" data-testid="badge-post-count">
                {generatedPosts.length}
              </Badge>
            </h2>
          </div>

          <div className="space-y-3">
            {generatedPosts.map((post, index) => {
              const postCharInfo = countCharacters(post, slug, platform.charLimit);
              const isCopied = copiedIndex === index;
              const isSelected = selectedPost === index;

              return (
                <Card
                  key={index}
                  className={`transition-colors duration-200 ${isSelected ? "ring-1 ring-ring" : ""} ${isCopied ? "ring-2 ring-primary" : ""}`}
                  data-testid={`card-post-${index}`}
                  onClick={() => setSelectedPost(index)}
                >
                  <CardContent className="p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono" data-testid={`badge-post-number-${index}`}>
                          {index + 1} / {generatedPosts.length}
                        </Badge>
                        <Badge
                          variant={postCharInfo.isOver ? "destructive" : "secondary"}
                          className="text-xs font-mono"
                          data-testid={`badge-post-chars-${index}`}
                        >
                          {postCharInfo.count.toLocaleString()} / {postCharInfo.limit.toLocaleString()}
                        </Badge>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyPost(index);
                            }}
                            data-testid={`button-copy-post-${index}`}
                          >
                            {isCopied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy this post</TooltipContent>
                      </Tooltip>
                    </div>
                    <Textarea
                      value={post}
                      onChange={(e) => handlePostEdit(index, e.target.value)}
                      className="min-h-[80px] resize-y text-sm leading-relaxed border-0 bg-transparent focus-visible:ring-1"
                      data-testid={`textarea-post-${index}`}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

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

      {generatedPosts.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm sm:bottom-auto sm:left-auto sm:top-16 sm:right-4 sm:w-auto sm:rounded-md sm:border sm:shadow-lg"
          data-testid="copy-bar"
        >
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:flex-nowrap sm:px-3">
            <span className="text-xs text-muted-foreground whitespace-nowrap" data-testid="text-copy-bar-info">
              {generatedPosts.length} posts ready
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                onClick={() => handleCopyAll()}
                className="gap-1.5"
                data-testid="button-copy-all"
              >
                {copiedAll ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedAll ? "Copied" : "Copy All"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopyPost(selectedPost)}
                className="gap-1.5"
                data-testid="button-copy-current"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy #{selectedPost + 1}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                className="gap-1.5"
                data-testid="button-download"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">.txt</span>
              </Button>
              {canShare() && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleShare}
                  data-testid="button-share"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
