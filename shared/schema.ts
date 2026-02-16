import { z } from "zod";

export const platformSlugs = [
  "x-thread-generator",
  "threads-thread-generator",
  "linkedin-post-formatter",
  "reddit-post-splitter",
  "mastodon-post-splitter",
  "facebook-post-formatter",
] as const;

export const platformSlugSchema = z.enum(platformSlugs);
export type PlatformSlug = z.infer<typeof platformSlugSchema>;
