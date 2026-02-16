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
  Undo2,
  Redo2,
  Scissors,
  Merge,
  GripVertical,
  Search,
  Replace,
  Sparkles,
  X,
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getPlatformBySlug, platforms } from "@/lib/platforms";
import { getDraft, setDraft } from "@/lib/storage";
import { countCharacters } from "@/lib/character-counter";
import { splitIntoPosts, mergePostsAtIndex, findAndReplace, smartFormat } from "@/lib/text-processor";
import { copyToClipboard, downloadAsTextFile, canShare, shareText } from "@/lib/clipboard";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useToast } from "@/hooks/use-toast";
import { useHistory, type GeneratorState } from "@/hooks/use-history";

let postIdCounter = 0;
function nextPostId(): string {
  postIdCounter++;
  return `p-${postIdCounter}`;
}

export interface PostItem {
  id: string;
  text: string;
}

function postsToItems(posts: string[]): PostItem[] {
  return posts.map((text) => ({ id: nextPostId(), text }));
}

function itemsToPosts(items: PostItem[]): string[] {
  return items.map((item) => item.text);
}

function SortablePostCard({
  item,
  index,
  total,
  platformSlug,
  charLimit,
  isCopied,
  isSelected,
  splitMode,
  onSelect,
  onCopy,
  onEdit,
  onSplitAt,
  onMergeWithNext,
}: {
  item: PostItem;
  index: number;
  total: number;
  platformSlug: string;
  charLimit: number;
  isCopied: boolean;
  isSelected: boolean;
  splitMode: boolean;
  onSelect: () => void;
  onCopy: () => void;
  onEdit: (value: string) => void;
  onSplitAt: (cursorPos: number) => void;
  onMergeWithNext: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const postCharInfo = countCharacters(item.text, platformSlug, charLimit);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`transition-colors duration-200 ${isSelected ? "ring-1 ring-ring" : ""} ${isCopied ? "ring-2 ring-primary" : ""}`}
        data-testid={`card-post-${index}`}
        onClick={onSelect}
      >
        <CardContent className="p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                {...attributes}
                {...listeners}
                className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
                data-testid={`handle-post-${index}`}
                aria-label={`Drag to reorder post ${index + 1}`}
              >
                <GripVertical className="h-4 w-4" />
              </button>
              <Badge variant="outline" className="text-xs font-mono" data-testid={`badge-post-number-${index}`}>
                {index + 1} / {total}
              </Badge>
              <Badge
                variant={postCharInfo.isOver ? "destructive" : "secondary"}
                className="text-xs font-mono"
                data-testid={`badge-post-chars-${index}`}
              >
                {postCharInfo.count.toLocaleString()} / {postCharInfo.limit.toLocaleString()}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              {splitMode && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          const pos = textareaRef.current?.selectionStart;
                          if (pos !== undefined && pos > 0) {
                            onSplitAt(pos);
                          }
                        }}
                        data-testid={`button-split-post-${index}`}
                      >
                        <Scissors className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Split at cursor</TooltipContent>
                  </Tooltip>
                  {index < total - 1 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMergeWithNext();
                          }}
                          data-testid={`button-merge-post-${index}`}
                        >
                          <Merge className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Merge with next post</TooltipContent>
                    </Tooltip>
                  )}
                </>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopy();
                    }}
                    data-testid={`button-copy-post-${index}`}
                  >
                    {isCopied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy this post</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Textarea
            ref={textareaRef}
            value={item.text}
            onChange={(e) => onEdit(e.target.value)}
            className="min-h-[80px] resize-y text-sm leading-relaxed border-0 bg-transparent focus-visible:ring-1"
            data-testid={`textarea-post-${index}`}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function PlatformPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const platform = getPlatformBySlug(slug);
  const { toast } = useToast();

  usePageMeta({
    title: platform ? platform.name : "Platform Not Found",
    description: platform?.description,
  });

  const defaultState: GeneratorState = {
    content: "",
    presetHashtags: "",
    numberingEnabled: true,
    appendHashtags: false,
    generatedPosts: [],
  };

  const history = useHistory(defaultState);

  const [postItems, setPostItems] = useState<PostItem[]>([]);
  const [selectedPost, setSelectedPost] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [splitMode, setSplitMode] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const generatorRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!platform) return;
    const draft = getDraft(slug);
    const restored: GeneratorState = {
      content: draft?.content || "",
      presetHashtags: draft?.presetHashtags || "",
      numberingEnabled: draft?.numberingEnabled ?? true,
      appendHashtags: draft?.appendHashtags ?? false,
      generatedPosts: draft?.generatedPosts || [],
    };
    history.reset(restored);
    setPostItems(postsToItems(restored.generatedPosts));
    setSelectedPost(0);
    setCopiedIndex(null);
    setCopiedAll(false);
    setSplitMode(false);
    setShowFindReplace(false);
    hasLoadedRef.current = true;
  }, [slug, platform]);

  const { content, presetHashtags, numberingEnabled, appendHashtags, generatedPosts } = history.state;

  useEffect(() => {
    const currentTexts = postItems.map((p) => p.text);
    const stateTexts = generatedPosts;
    if (JSON.stringify(currentTexts) !== JSON.stringify(stateTexts)) {
      setPostItems(postsToItems(stateTexts));
    }
  }, [generatedPosts]);

  const persistState = useCallback(
    (state: GeneratorState) => {
      if (!platform) return;
      setDraft(slug, {
        content: state.content,
        presetHashtags: state.presetHashtags,
        numberingEnabled: state.numberingEnabled,
        appendHashtags: state.appendHashtags,
        generatedPosts: state.generatedPosts,
        updatedAt: Date.now(),
      });
    },
    [slug, platform]
  );

  useEffect(() => {
    if (hasLoadedRef.current) {
      persistState(history.state);
    }
  }, [history.state, persistState]);

  const pushAndPersist = useCallback(
    (newState: GeneratorState) => {
      history.pushState(newState);
    },
    [history]
  );

  const updatePosts = useCallback(
    (newItems: PostItem[]) => {
      setPostItems(newItems);
      const texts = itemsToPosts(newItems);
      history.pushState({ ...history.state, generatedPosts: texts });
    },
    [history]
  );

  const handleContentChange = useCallback(
    (value: string) => {
      pushAndPersist({ ...history.state, content: value });
    },
    [history.state, pushAndPersist]
  );

  const handleHashtagsChange = useCallback(
    (value: string) => {
      pushAndPersist({ ...history.state, presetHashtags: value });
    },
    [history.state, pushAndPersist]
  );

  const handleNumberingToggle = useCallback(
    (checked: boolean) => {
      pushAndPersist({ ...history.state, numberingEnabled: checked });
    },
    [history.state, pushAndPersist]
  );

  const handleAppendHashtagsToggle = useCallback(
    (checked: boolean) => {
      pushAndPersist({ ...history.state, appendHashtags: checked });
    },
    [history.state, pushAndPersist]
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

    const newItems = postsToItems(posts);
    setPostItems(newItems);
    pushAndPersist({ ...history.state, generatedPosts: posts });
    setSelectedPost(0);

    setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [platform, content, slug, numberingEnabled, presetHashtags, appendHashtags, history.state, pushAndPersist]);

  const handleSmartFormat = useCallback(() => {
    if (!platform || !content.trim()) return;
    const formatted = smartFormat(content, slug);
    pushAndPersist({ ...history.state, content: formatted });
    toast({ title: "Formatted!", description: `Content optimized for ${platform.shortName}.` });
  }, [platform, content, slug, history.state, pushAndPersist, toast]);

  const handlePostEdit = useCallback(
    (index: number, value: string) => {
      const newItems = [...postItems];
      newItems[index] = { ...newItems[index], text: value };
      updatePosts(newItems);
    },
    [postItems, updatePosts]
  );

  const handleSplitAt = useCallback(
    (index: number, cursorPos: number) => {
      const item = postItems[index];
      if (cursorPos <= 0 || cursorPos >= item.text.length) return;
      const before = item.text.substring(0, cursorPos).trim();
      const after = item.text.substring(cursorPos).trim();
      if (!before || !after) return;
      const newItems = [...postItems];
      newItems.splice(index, 1, { id: item.id, text: before }, { id: nextPostId(), text: after });
      updatePosts(newItems);
      toast({ title: "Split!", description: `Post ${index + 1} split into two.` });
    },
    [postItems, updatePosts, toast]
  );

  const handleMerge = useCallback(
    (index: number) => {
      if (index >= postItems.length - 1) return;
      const newItems = [...postItems];
      newItems[index] = { ...newItems[index], text: newItems[index].text + "\n\n" + newItems[index + 1].text };
      newItems.splice(index + 1, 1);
      updatePosts(newItems);
      toast({ title: "Merged!", description: `Posts ${index + 1} and ${index + 2} merged.` });
    },
    [postItems, updatePosts, toast]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = postItems.findIndex((item) => item.id === active.id);
      const newIndex = postItems.findIndex((item) => item.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(postItems, oldIndex, newIndex);
      updatePosts(reordered);
    },
    [postItems, updatePosts]
  );

  const handleFindReplace = useCallback(
    (doAll: boolean) => {
      if (!findText || postItems.length === 0) return;
      const texts = itemsToPosts(postItems);
      const result = findAndReplace(texts, {
        find: findText,
        replace: replaceText,
        caseSensitive,
        replaceAll: doAll,
      });
      if (result.count > 0) {
        const newItems = postItems.map((item, i) => ({ ...item, text: result.posts[i] }));
        updatePosts(newItems);
        toast({ title: "Replaced!", description: `${result.count} occurrence${result.count > 1 ? "s" : ""} replaced.` });
      } else {
        toast({ title: "Not found", description: `"${findText}" was not found in any posts.` });
      }
    },
    [findText, replaceText, caseSensitive, postItems, updatePosts, toast]
  );

  const handleCopyPost = useCallback(
    async (index: number) => {
      const success = await copyToClipboard(postItems[index].text);
      if (success) {
        setCopiedIndex(index);
        toast({ title: "Copied!", description: `Post ${index + 1} copied to clipboard.` });
        setTimeout(() => setCopiedIndex(null), 2000);
      }
    },
    [postItems, toast]
  );

  const handleCopyAll = useCallback(async () => {
    const text = postItems.map((p) => p.text).join("\n\n---\n\n");
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedAll(true);
      toast({ title: "All posts copied!", description: `${postItems.length} posts copied to clipboard.` });
      setTimeout(() => setCopiedAll(false), 2000);
    }
  }, [postItems, toast]);

  const handleDownload = useCallback(() => {
    const text = postItems
      .map((p, i) => `--- Post ${i + 1} ---\n${p.text}`)
      .join("\n\n");
    const filename = `${platform?.shortName.toLowerCase().replace(/[\s\/]/g, "-")}-thread.txt`;
    downloadAsTextFile(text, filename);
    toast({ title: "Downloaded!", description: "Thread saved as text file." });
  }, [postItems, platform, toast]);

  const handleShare = useCallback(async () => {
    const text = postItems.map((p) => p.text).join("\n\n---\n\n");
    await shareText(text, `${platform?.shortName} Thread`);
  }, [postItems, platform]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        history.undo();
      }
      if (isMod && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        history.redo();
      }
      if (isMod && e.key === "y") {
        e.preventDefault();
        history.redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [history]);

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
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => history.undo()}
                      disabled={!history.canUndo}
                      data-testid="button-undo"
                    >
                      <Undo2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => history.redo()}
                      disabled={!history.canRedo}
                      data-testid="button-redo"
                    >
                      <Redo2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
                </Tooltip>
                <Badge variant={charInfo.isOver ? "destructive" : "secondary"} className="text-xs font-mono" data-testid="badge-char-count">
                  {charInfo.count.toLocaleString()} / {charInfo.limit.toLocaleString()}
                </Badge>
              </div>
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
              <div className="flex flex-wrap items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSmartFormat}
                      disabled={!content.trim()}
                      className="gap-1.5"
                      data-testid="button-smart-format"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Smart Format
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Apply platform-specific formatting</TooltipContent>
                </Tooltip>
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
            </div>
          </CardContent>
        </Card>
      </section>

      {postItems.length > 0 && (
        <section ref={outputRef} className="mb-8" data-testid="section-output">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">
              Generated posts
              <Badge variant="secondary" className="ml-2 text-xs" data-testid="badge-post-count">
                {postItems.length}
              </Badge>
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant={splitMode ? "default" : "outline"}
                    onClick={() => setSplitMode(!splitMode)}
                    className="gap-1.5"
                    data-testid="button-toggle-split-mode"
                  >
                    <Scissors className="h-3.5 w-3.5" />
                    Split Mode
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle split/merge controls on each post</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant={showFindReplace ? "default" : "outline"}
                    onClick={() => setShowFindReplace(!showFindReplace)}
                    className="gap-1.5"
                    data-testid="button-toggle-find-replace"
                  >
                    <Search className="h-3.5 w-3.5" />
                    Find & Replace
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Find and replace across all posts</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {showFindReplace && (
            <Card className="mb-3" data-testid="card-find-replace">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="flex-1 min-w-[140px]">
                    <Label className="mb-1 text-xs text-muted-foreground flex items-center gap-1">
                      <Search className="h-3 w-3" />
                      Find
                    </Label>
                    <Input
                      placeholder="Search text..."
                      value={findText}
                      onChange={(e) => setFindText(e.target.value)}
                      className="text-sm"
                      data-testid="input-find"
                    />
                  </div>
                  <div className="flex-1 min-w-[140px]">
                    <Label className="mb-1 text-xs text-muted-foreground flex items-center gap-1">
                      <Replace className="h-3 w-3" />
                      Replace with
                    </Label>
                    <Input
                      placeholder="Replace text..."
                      value={replaceText}
                      onChange={(e) => setReplaceText(e.target.value)}
                      className="text-sm"
                      data-testid="input-replace"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <Switch
                        id="case-sensitive"
                        checked={caseSensitive}
                        onCheckedChange={setCaseSensitive}
                        data-testid="switch-case-sensitive"
                      />
                      <Label htmlFor="case-sensitive" className="text-xs cursor-pointer whitespace-nowrap">
                        Case sensitive
                      </Label>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFindReplace(false)}
                      disabled={!findText}
                      data-testid="button-replace-one"
                    >
                      Replace
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleFindReplace(true)}
                      disabled={!findText}
                      data-testid="button-replace-all"
                    >
                      Replace All
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowFindReplace(false)}
                      data-testid="button-close-find-replace"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={postItems.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {postItems.map((item, index) => (
                  <SortablePostCard
                    key={item.id}
                    item={item}
                    index={index}
                    total={postItems.length}
                    platformSlug={slug}
                    charLimit={platform.charLimit}
                    isCopied={copiedIndex === index}
                    isSelected={selectedPost === index}
                    splitMode={splitMode}
                    onSelect={() => setSelectedPost(index)}
                    onCopy={() => handleCopyPost(index)}
                    onEdit={(value) => handlePostEdit(index, value)}
                    onSplitAt={(pos) => handleSplitAt(index, pos)}
                    onMergeWithNext={() => handleMerge(index)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
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

      {postItems.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm sm:bottom-auto sm:left-auto sm:top-16 sm:right-4 sm:w-auto sm:rounded-md sm:border sm:shadow-lg"
          data-testid="copy-bar"
        >
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:flex-nowrap sm:px-3">
            <span className="text-xs text-muted-foreground whitespace-nowrap" data-testid="text-copy-bar-info">
              {postItems.length} posts ready
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                onClick={handleCopyAll}
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
