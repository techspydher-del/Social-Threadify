import { NextRequest, NextResponse } from "next/server";

const platformQueryMap: Record<string, string> = {
  x: "x-thread-generator",
  twitter: "x-thread-generator",
  threads: "threads-thread-generator",
  linkedin: "linkedin-post-formatter",
  reddit: "reddit-post-splitter",
  mastodon: "mastodon-post-splitter",
  facebook: "facebook-post-formatter",
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const platformParam = (searchParams.get("platform") || "").toLowerCase().trim();
  const matchedSlug = platformQueryMap[platformParam];
  
  if (matchedSlug) {
    return NextResponse.redirect(new URL(`/social/${matchedSlug}`, request.url), 301);
  } else {
    return NextResponse.redirect(new URL("/social", request.url), 301);
  }
}
