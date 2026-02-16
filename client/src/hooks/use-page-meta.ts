import { useEffect } from "react";
import { BASE_URL, SITE_NAME, DEFAULT_OG_IMAGE, TWITTER_HANDLE } from "@/lib/seo-config";

interface PageMeta {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string;
  robots?: string;
  structuredData?: Record<string, unknown>[];
}

function setMetaTag(selector: string, attr: string, value: string) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const parts = selector.match(/\[(\w+)="([^"]+)"\]/);
    if (parts) el.setAttribute(parts[1], parts[2]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setLinkTag(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function usePageMeta({ title, description, path, ogImage, robots, structuredData }: PageMeta) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    const desc = description || "";
    const canonicalUrl = path ? `${BASE_URL}${path}` : BASE_URL;
    const image = ogImage || DEFAULT_OG_IMAGE;
    const robotsValue = robots || "index, follow";

    setMetaTag('meta[property="og:title"]', "content", fullTitle);
    setMetaTag('meta[name="twitter:title"]', "content", fullTitle);
    setMetaTag('meta[property="og:type"]', "content", "website");
    setMetaTag('meta[property="og:url"]', "content", canonicalUrl);
    setMetaTag('meta[property="og:image"]', "content", image);
    setMetaTag('meta[property="og:site_name"]', "content", SITE_NAME);
    setMetaTag('meta[name="twitter:card"]', "content", "summary_large_image");
    setMetaTag('meta[name="twitter:site"]', "content", TWITTER_HANDLE);
    setMetaTag('meta[name="twitter:url"]', "content", canonicalUrl);
    setMetaTag('meta[name="twitter:image"]', "content", image);
    setMetaTag('meta[name="robots"]', "content", robotsValue);

    if (desc) {
      setMetaTag('meta[name="description"]', "content", desc);
      setMetaTag('meta[property="og:description"]', "content", desc);
      setMetaTag('meta[name="twitter:description"]', "content", desc);
    }

    setLinkTag("canonical", canonicalUrl);

    const existingLD = document.querySelectorAll('script[data-page-jsonld]');
    existingLD.forEach((el) => el.remove());

    if (structuredData && structuredData.length > 0) {
      structuredData.forEach((data, i) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-page-jsonld", `ld-${i}`);
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
      });
    }

    return () => {
      const scripts = document.querySelectorAll('script[data-page-jsonld]');
      scripts.forEach((el) => el.remove());
    };
  }, [title, description, path, ogImage, robots, structuredData]);
}
