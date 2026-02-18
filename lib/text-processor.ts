const URL_REGEX = /https?:\/\/[^\s]+/g;
const X_URL_LENGTH = 23;

interface SplitOptions {
  charLimit: number;
  platformSlug: string;
  numberingEnabled: boolean;
  hashtags: string;
  appendHashtags: boolean;
}

interface Segment {
  text: string;
  type: "paragraph" | "code" | "heading" | "list" | "quote";
}

function normalizeInput(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

function detectSegments(text: string): Segment[] {
  const lines = text.split("\n");
  const segments: Segment[] = [];
  let currentSegment: Segment | null = null;

  function pushCurrent() {
    if (currentSegment && currentSegment.text.trim()) {
      segments.push({ ...currentSegment, text: currentSegment.text.trim() });
    }
    currentSegment = null;
  }

  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        if (currentSegment) {
          currentSegment.text += "\n" + line;
        }
        pushCurrent();
        inCodeBlock = false;
        continue;
      } else {
        pushCurrent();
        currentSegment = { text: line, type: "code" };
        inCodeBlock = true;
        continue;
      }
    }

    if (inCodeBlock) {
      if (currentSegment) {
        currentSegment.text += "\n" + line;
      }
      continue;
    }

    if (trimmed === "") {
      pushCurrent();
      continue;
    }

    if (/^#{1,6}\s/.test(trimmed)) {
      pushCurrent();
      currentSegment = { text: trimmed, type: "heading" };
      pushCurrent();
      continue;
    }

    if (/^[-*]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
      if (currentSegment && currentSegment.type === "list") {
        currentSegment.text += "\n" + line;
      } else {
        pushCurrent();
        currentSegment = { text: line, type: "list" };
      }
      continue;
    }

    if (trimmed.startsWith(">")) {
      if (currentSegment && currentSegment.type === "quote") {
        currentSegment.text += "\n" + line;
      } else {
        pushCurrent();
        currentSegment = { text: line, type: "quote" };
      }
      continue;
    }

    if (currentSegment && currentSegment.type === "paragraph") {
      currentSegment.text += "\n" + line;
    } else {
      pushCurrent();
      currentSegment = { text: line, type: "paragraph" };
    }
  }

  if (inCodeBlock && currentSegment) {
    segments.push({ ...currentSegment, text: currentSegment.text.trim() });
  } else {
    pushCurrent();
  }

  return segments;
}

function effectiveLength(text: string, platformSlug: string): number {
  if (platformSlug === "x-thread-generator") {
    const urls = text.match(URL_REGEX) || [];
    let adjusted = text;
    for (const url of urls) {
      adjusted = adjusted.replace(url, "X".repeat(X_URL_LENGTH));
    }
    return adjusted.length;
  }
  return text.length;
}

function splitTextAtWordBoundary(text: string, maxLen: number, platformSlug: string): string[] {
  const parts: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (effectiveLength(remaining, platformSlug) <= maxLen) {
      parts.push(remaining.trim());
      break;
    }

    let splitIndex = maxLen;
    const words = remaining.split(/(\s+)/);
    let built = "";
    let lastGoodLen = 0;

    for (const word of words) {
      const candidate = built + word;
      if (effectiveLength(candidate, platformSlug) <= maxLen) {
        built = candidate;
        if (word.trim()) {
          lastGoodLen = built.length;
        }
      } else {
        break;
      }
    }

    if (lastGoodLen > 0) {
      splitIndex = lastGoodLen;
    } else {
      splitIndex = Math.min(maxLen, remaining.length);
    }

    parts.push(remaining.substring(0, splitIndex).trim());
    remaining = remaining.substring(splitIndex).trim();
  }

  return parts.filter((p) => p.length > 0);
}

export function splitIntoPosts(text: string, options: SplitOptions): string[] {
  const normalized = normalizeInput(text);
  if (!normalized) return [];

  const segments = detectSegments(normalized);
  const { charLimit, platformSlug, numberingEnabled, hashtags, appendHashtags } = options;

  const hashtagSuffix = appendHashtags && hashtags.trim()
    ? "\n\n" + hashtags.trim().split(",").map((h) => h.trim()).filter(Boolean).map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")
    : "";

  const numberingReserve = numberingEnabled ? 8 : 0;
  const hashtagReserve = hashtagSuffix.length;
  const effectiveLimitVal = charLimit - numberingReserve - hashtagReserve;

  if (effectiveLimitVal < 20) {
    return [normalized];
  }

  const posts: string[] = [];
  let currentPost = "";

  function flushPost() {
    if (currentPost.trim()) {
      posts.push(currentPost.trim());
      currentPost = "";
    }
  }

  for (const segment of segments) {
    const segLen = effectiveLength(segment.text, platformSlug);

    if (segment.type === "code") {
      if (segLen <= effectiveLimitVal) {
        if (currentPost && effectiveLength(currentPost + "\n\n" + segment.text, platformSlug) > effectiveLimitVal) {
          flushPost();
        }
        currentPost = currentPost ? currentPost + "\n\n" + segment.text : segment.text;
      } else {
        flushPost();
        posts.push(segment.text);
      }
      continue;
    }

    if (segLen <= effectiveLimitVal) {
      const combined = currentPost ? currentPost + "\n\n" + segment.text : segment.text;
      if (effectiveLength(combined, platformSlug) <= effectiveLimitVal) {
        currentPost = combined;
      } else {
        flushPost();
        currentPost = segment.text;
      }
    } else {
      flushPost();
      const subParts = splitTextAtWordBoundary(segment.text, effectiveLimitVal, platformSlug);
      for (let i = 0; i < subParts.length; i++) {
        if (i < subParts.length - 1) {
          posts.push(subParts[i]);
        } else {
          currentPost = subParts[i];
        }
      }
    }
  }

  flushPost();

  if (posts.length === 0 && normalized.length > 0) {
    posts.push(normalized);
  }

  const totalPosts = posts.length;
  return posts.map((post, i) => {
    let result = post;
    if (numberingEnabled && totalPosts > 1) {
      const numbering = `${i + 1}/${totalPosts}`;
      result = `${result}\n\n${numbering}`;
    }
    if (hashtagSuffix) {
      result = result + hashtagSuffix;
    }
    return result;
  });
}

export function mergePostsAtIndex(posts: string[], index: number): string[] {
  if (index < 0 || index >= posts.length - 1) return posts;
  const merged = [...posts];
  merged[index] = merged[index] + "\n\n" + merged[index + 1];
  merged.splice(index + 1, 1);
  return merged;
}

export interface FindReplaceOptions {
  find: string;
  replace: string;
  caseSensitive: boolean;
  replaceAll: boolean;
}

export function findAndReplace(posts: string[], options: FindReplaceOptions): { posts: string[]; count: number } {
  const { find, replace, caseSensitive, replaceAll: doReplaceAll } = options;
  if (!find) return { posts, count: 0 };

  let totalCount = 0;
  const flags = caseSensitive ? "g" : "gi";
  const escapedFind = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapedFind, flags);

  const updated = posts.map((post) => {
    if (doReplaceAll) {
      const matches = post.match(regex);
      if (matches) totalCount += matches.length;
      return post.replace(regex, replace);
    } else {
      const singleRegex = new RegExp(escapedFind, caseSensitive ? "" : "i");
      if (singleRegex.test(post) && totalCount === 0) {
        totalCount = 1;
        return post.replace(singleRegex, replace);
      }
      return post;
    }
  });

  return { posts: updated, count: totalCount };
}

export function smartFormat(text: string, platformSlug: string): string {
  switch (platformSlug) {
    case "x-thread-generator":
    case "threads-thread-generator":
      return formatForShortPlatform(text);
    case "linkedin-post-formatter":
      return formatForLinkedIn(text);
    case "reddit-post-splitter":
      return formatForReddit(text);
    case "mastodon-post-splitter":
      return formatForMastodon(text);
    case "facebook-post-formatter":
      return formatForShortPlatform(text);
    default:
      return text;
  }
}

function formatForShortPlatform(text: string): string {
  let result = text;
  result = result.replace(/\n{3,}/g, "\n\n");
  result = result.replace(/[ \t]+/g, " ");
  result = result.replace(/ \n/g, "\n");
  result = result.replace(/\n /g, "\n");
  return result.trim();
}

function formatForLinkedIn(text: string): string {
  let result = text;
  result = result.replace(/\n{4,}/g, "\n\n\n");
  const lines = result.split("\n");
  const formatted = lines.map((line) => {
    if (line.length > 200 && !line.startsWith("-") && !line.startsWith("*") && !line.startsWith("#")) {
      const sentences = line.match(/[^.!?]+[.!?]+/g);
      if (sentences && sentences.length > 2) {
        return sentences.map((s) => s.trim()).join("\n\n");
      }
    }
    return line;
  });
  result = formatted.join("\n");
  result = result.trim();
  if (!/\?[^a-zA-Z]*$/.test(result)) {
    result += "\n\nWhat are your thoughts?";
  }
  return result;
}

function formatForReddit(text: string): string {
  let result = text;
  const codeBlockRegex = /```[\s\S]*?```/g;
  const codeBlocks: string[] = [];
  result = result.replace(codeBlockRegex, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  if (result.length > 2000 && !result.toLowerCase().includes("tl;dr")) {
    const firstSentence = result.match(/^[^.!?]+[.!?]/);
    if (firstSentence) {
      result = `**TL;DR:** ${firstSentence[0].trim()}\n\n---\n\n${result}`;
    }
  }

  codeBlocks.forEach((block, i) => {
    result = result.replace(`__CODE_BLOCK_${i}__`, block);
  });

  return result.trim();
}

const MASTODON_SENSITIVE_TERMS = [
  "violence", "death", "suicide", "abuse", "nsfw",
  "spoiler", "trigger warning", "tw:", "cw:",
  "graphic", "disturbing", "assault",
];

function formatForMastodon(text: string): string {
  let result = text;
  result = result.replace(/\n{3,}/g, "\n\n");

  const lower = result.toLowerCase();
  const hasSensitive = MASTODON_SENSITIVE_TERMS.some((term) => lower.includes(term));
  if (hasSensitive && !lower.startsWith("cw:")) {
    result = `CW: Sensitive content\n\n${result}`;
  }

  return result.trim();
}
