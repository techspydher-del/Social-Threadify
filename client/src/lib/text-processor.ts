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
  const effectiveLimit = charLimit - numberingReserve - hashtagReserve;

  if (effectiveLimit < 20) {
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
      if (segLen <= effectiveLimit) {
        if (currentPost && effectiveLength(currentPost + "\n\n" + segment.text, platformSlug) > effectiveLimit) {
          flushPost();
        }
        currentPost = currentPost ? currentPost + "\n\n" + segment.text : segment.text;
      } else {
        flushPost();
        posts.push(segment.text);
      }
      continue;
    }

    if (segLen <= effectiveLimit) {
      const combined = currentPost ? currentPost + "\n\n" + segment.text : segment.text;
      if (effectiveLength(combined, platformSlug) <= effectiveLimit) {
        currentPost = combined;
      } else {
        flushPost();
        currentPost = segment.text;
      }
    } else {
      flushPost();
      const subParts = splitTextAtWordBoundary(segment.text, effectiveLimit, platformSlug);
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
      result = `${result}\n\n${i + 1}/${totalPosts}`;
    }
    if (hashtagSuffix) {
      result = result + hashtagSuffix;
    }
    return result;
  });
}
