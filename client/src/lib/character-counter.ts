const URL_REGEX = /https?:\/\/[^\s]+/g;
const X_URL_LENGTH = 23;

export interface CharCountResult {
  count: number;
  limit: number;
  remaining: number;
  isOver: boolean;
}

export function countCharacters(
  text: string,
  platformSlug: string,
  charLimit: number
): CharCountResult {
  let count: number;

  if (platformSlug === "x-thread-generator") {
    count = countXCharacters(text);
  } else {
    count = text.length;
  }

  return {
    count,
    limit: charLimit,
    remaining: charLimit - count,
    isOver: count > charLimit,
  };
}

function countXCharacters(text: string): number {
  const urls = text.match(URL_REGEX) || [];
  let adjusted = text;
  let urlCharSaved = 0;

  for (const url of urls) {
    urlCharSaved += url.length - X_URL_LENGTH;
    adjusted = adjusted.replace(url, "X".repeat(X_URL_LENGTH));
  }

  return adjusted.length;
}

export function getEffectiveLimit(
  platformSlug: string,
  charLimit: number,
  numberingEnabled: boolean,
  totalPosts: number,
  postIndex: number
): number {
  if (!numberingEnabled) return charLimit;

  if (platformSlug === "x-thread-generator" || platformSlug === "threads-thread-generator" || platformSlug === "mastodon-post-splitter") {
    const numbering = ` ${postIndex + 1}/${totalPosts}`;
    return charLimit - numbering.length;
  }

  return charLimit;
}
