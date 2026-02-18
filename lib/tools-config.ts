import { type Metadata } from "next";

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  category: "writing" | "analytics" | "social" | "seo";
  featured: boolean;
  useCases: string[];
  relatedTools: string[];
}

export const tools: Tool[] = [
  {
    id: "character-counter",
    name: "Character Counter",
    slug: "character-counter",
    description: "Count characters, words, sentences, and paragraphs in real-time. Perfect for Twitter threads, Instagram captions, and content that has strict character limits.",
    shortDescription: "Real-time character and word counting for social media",
    icon: "Type",
    category: "writing",
    featured: true,
    useCases: [
      "Twitter/X posts (280 character limit)",
      "Instagram captions (2,200 character limit)",
      "LinkedIn posts (3,000 character limit)",
      "Meta descriptions (155-160 characters)",
      "Email subject lines (60 characters)"
    ],
    relatedTools: ["word-counter", "hashtag-generator"]
  },
  {
    id: "word-counter",
    name: "Word Counter",
    slug: "word-counter",
    description: "Track word count, reading time, and speaking duration for your content. Ideal for blog posts, articles, scripts, and long-form content planning.",
    shortDescription: "Analyze word count and estimate reading time",
    icon: "FileText",
    category: "writing",
    featured: true,
    useCases: [
      "Blog post planning (800-2,000 words typical)",
      "Article writing and editing",
      "Script preparation with speaking time",
      "Academic paper requirements",
      "Content brief compliance"
    ],
    relatedTools: ["character-counter", "hashtag-generator"]
  },
  {
    id: "hashtag-generator",
    name: "Hashtag Generator",
    slug: "hashtag-generator",
    description: "Generate relevant, trending hashtags for your social media posts. Boost discoverability and reach on Instagram, Twitter, LinkedIn, and TikTok.",
    shortDescription: "Generate trending hashtags for social media",
    icon: "Hash",
    category: "social",
    featured: true,
    useCases: [
      "Instagram posts (30 hashtags max)",
      "Twitter/X engagement",
      "LinkedIn professional content",
      "TikTok video discovery",
      "Brand campaign amplification"
    ],
    relatedTools: ["character-counter", "word-counter"]
  }
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(tool => tool.slug === slug);
}

export function getFeaturedTools(): Tool[] {
  return tools.filter(tool => tool.featured);
}

export function getToolsByCategory(category: Tool["category"]): Tool[] {
  return tools.filter(tool => tool.category === category);
}

export function getRelatedTools(toolSlug: string): Tool[] {
  const tool = getToolBySlug(toolSlug);
  if (!tool) return [];
  
  return tools.filter(t => tool.relatedTools.includes(t.slug));
}

export function generateToolMetadata(tool: Tool): Metadata {
  return {
    title: `${tool.name} - Free Online Tool | Threadify`,
    description: tool.description,
    keywords: [
      tool.name.toLowerCase(),
      ...tool.useCases.map(uc => uc.toLowerCase()),
      "free online tool",
      "social media tool",
      "content creation"
    ],
    openGraph: {
      title: `${tool.name} - Free Online Tool`,
      description: tool.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} - Free Online Tool`,
      description: tool.description,
    },
  };
}
