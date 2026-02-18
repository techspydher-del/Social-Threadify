import { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo-config";

const platformSlugs = [
  "x-thread-generator",
  "threads-thread-generator",
  "linkedin-post-formatter",
  "reddit-post-splitter",
  "mastodon-post-splitter",
  "facebook-post-formatter",
];

const staticRoutes = [
  { path: "/", priority: 1.0 },
  { path: "/social", priority: 0.8 },
  { path: "/faq", priority: 0.8 },
  { path: "/privacy", priority: 0.8 },
  { path: "/terms", priority: 0.8 },
  { path: "/cookies", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [
    ...staticRoutes.map((route) => ({
      url: `${BASE_URL}${route.path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route.priority,
    })),
    ...platformSlugs.map((slug) => ({
      url: `${BASE_URL}/social/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];

  return urls;
}
