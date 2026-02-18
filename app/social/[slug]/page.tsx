import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlatformBySlug } from "@/lib/platforms";
import { platformSEOContent } from "@/lib/platform-seo";
import { BASE_URL, SITE_NAME } from "@/lib/seo-config";
import PlatformPageClient from "./platform-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: "x-thread-generator" },
    { slug: "threads-thread-generator" },
    { slug: "linkedin-post-formatter" },
    { slug: "reddit-post-splitter" },
    { slug: "mastodon-post-splitter" },
    { slug: "facebook-post-formatter" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const platform = getPlatformBySlug(slug);
  const seo = platformSEOContent[slug];

  if (!platform || !seo) {
    return {
      title: "Platform Not Found",
      description: "The requested platform tool was not found.",
    };
  }

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `${SITE_NAME} - ${platform.name}`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      url: `${BASE_URL}/social/${slug}`,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description: seo.metaDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: seo.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    openGraph: {
      title: `${seo.metaTitle} | ${SITE_NAME}`,
      description: seo.metaDescription,
      url: `${BASE_URL}/social/${slug}`,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
    },
    other: {
      "application/ld+json": JSON.stringify(structuredData),
    },
  };
}

export default async function PlatformPage({ params }: PageProps) {
  const { slug } = await params;
  const platform = getPlatformBySlug(slug);

  if (!platform) {
    notFound();
  }

  const seo = platformSEOContent[slug];
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `${SITE_NAME} - ${platform.name}`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      url: `${BASE_URL}/social/${slug}`,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description: seo?.metaDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: seo?.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })) || [],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PlatformPageClient />
    </>
  );
}
