import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const BASE_URL = process.env.SITE_URL || "https://threadify.app";

const platformSlugs = [
  "x-thread-generator",
  "threads-thread-generator",
  "linkedin-post-formatter",
  "reddit-post-splitter",
  "mastodon-post-splitter",
  "facebook-post-formatter",
];

const platformQueryMap: Record<string, string> = {
  x: "x-thread-generator",
  twitter: "x-thread-generator",
  threads: "threads-thread-generator",
  linkedin: "linkedin-post-formatter",
  reddit: "reddit-post-splitter",
  mastodon: "mastodon-post-splitter",
  facebook: "facebook-post-formatter",
};

const staticRoutes = [
  "/",
  "/social",
  "/faq",
  "/privacy",
  "/terms",
  "/cookies",
];

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/sitemap.xml", (_req, res) => {
    const urls = [
      ...staticRoutes.map((path) => ({
        loc: `${BASE_URL}${path === "/" ? "" : path}`,
        priority: path === "/" ? "1.0" : "0.8",
        changefreq: "weekly",
      })),
      ...platformSlugs.map((slug) => ({
        loc: `${BASE_URL}/social/${slug}`,
        priority: "0.9",
        changefreq: "weekly",
      })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.set("Content-Type", "application/xml");
    res.send(xml);
  });

  app.get("/robots.txt", (_req, res) => {
    const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
    res.set("Content-Type", "text/plain");
    res.send(robots);
  });

  app.get("/social-media-thread-generator", (req, res) => {
    const platformParam = (req.query.platform as string || "").toLowerCase().trim();
    const matchedSlug = platformQueryMap[platformParam];
    if (matchedSlug) {
      res.redirect(301, `/social/${matchedSlug}`);
    } else {
      res.redirect(301, "/social");
    }
  });

  return httpServer;
}
