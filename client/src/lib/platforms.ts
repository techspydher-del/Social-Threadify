import { SiX, SiThreads, SiLinkedin, SiReddit, SiMastodon, SiFacebook } from "react-icons/si";

export interface Platform {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: typeof SiX;
  color: string;
  charLimit: number;
  tipTitle: string;
  tips: string[];
}

export const platforms: Platform[] = [
  {
    slug: "x-thread-generator",
    name: "X (Twitter) Thread Generator",
    shortName: "X / Twitter",
    description: "Split long-form content into perfectly sized tweets with thread numbering and smart word-boundary splitting.",
    icon: SiX,
    color: "hsl(0, 0%, 0%)",
    charLimit: 280,
    tipTitle: "Tips for X Threads",
    tips: [
      "Keep each tweet under 280 characters for maximum reach.",
      "Start with a strong hook in the first tweet to grab attention.",
      "Use numbered tweets (1/n) so readers know there's more to come.",
      "End your thread with a clear call-to-action or summary.",
      "Add line breaks between paragraphs within a single tweet for readability.",
    ],
  },
  {
    slug: "threads-thread-generator",
    name: "Threads Post Generator",
    shortName: "Threads",
    description: "Format your content for Meta's Threads with proper character limits and engaging formatting.",
    icon: SiThreads,
    color: "hsl(0, 0%, 0%)",
    charLimit: 500,
    tipTitle: "Tips for Threads",
    tips: [
      "Threads allows up to 500 characters per post.",
      "Use a conversational tone \u2014 Threads favours authentic voices.",
      "Break ideas into bite-sized pieces for multi-post threads.",
      "Add relevant hashtags sparingly at the end of your post.",
      "Engage with replies quickly to boost visibility.",
    ],
  },
  {
    slug: "linkedin-post-formatter",
    name: "LinkedIn Post Formatter",
    shortName: "LinkedIn",
    description: "Create professional LinkedIn posts with proper formatting, hooks, and engagement-optimised structure.",
    icon: SiLinkedin,
    color: "hsl(210, 80%, 45%)",
    charLimit: 3000,
    tipTitle: "Tips for LinkedIn",
    tips: [
      "LinkedIn posts can be up to 3,000 characters.",
      "Start with a bold, attention-grabbing first line (the hook).",
      "Use short paragraphs and plenty of white space.",
      "Avoid external links in the post body \u2014 place them in comments instead.",
      "End with a question to drive engagement.",
    ],
  },
  {
    slug: "reddit-post-splitter",
    name: "Reddit Post Splitter",
    shortName: "Reddit",
    description: "Format long posts for Reddit with proper markdown, paragraph splitting, and subreddit-ready structure.",
    icon: SiReddit,
    color: "hsl(16, 100%, 50%)",
    charLimit: 40000,
    tipTitle: "Tips for Reddit",
    tips: [
      "Reddit supports Markdown: use **bold**, *italic*, and headers.",
      "Add a TL;DR at the top or bottom for long posts.",
      "Break content into clear sections with headings.",
      "Choose the right subreddit and follow its rules.",
      "Engage with commenters to keep the post alive.",
    ],
  },
  {
    slug: "mastodon-post-splitter",
    name: "Mastodon Post Splitter",
    shortName: "Mastodon",
    description: "Split content into Mastodon-friendly posts with proper threading and character limit compliance.",
    icon: SiMastodon,
    color: "hsl(263, 56%, 49%)",
    charLimit: 500,
    tipTitle: "Tips for Mastodon",
    tips: [
      "Default character limit is 500 (may vary by instance).",
      "Use Content Warnings (CW) for sensitive or spoiler content.",
      "Hashtags are important for discoverability on Mastodon.",
      "Thread your posts by replying to yourself for long content.",
      "Alt-text on images is strongly encouraged by the community.",
    ],
  },
  {
    slug: "facebook-post-formatter",
    name: "Facebook Post Formatter",
    shortName: "Facebook",
    description: "Optimise your Facebook posts with proper formatting, length, and engagement-boosting structure.",
    icon: SiFacebook,
    color: "hsl(220, 46%, 48%)",
    charLimit: 63206,
    tipTitle: "Tips for Facebook",
    tips: [
      "Shorter posts (under 250 characters) tend to get more engagement.",
      "Use line breaks to make long posts scannable.",
      "Ask questions or include a clear call-to-action.",
      "Native video and images get more reach than links.",
      "Post timing matters \u2014 aim for when your audience is most active.",
    ],
  },
];

export function getPlatformBySlug(slug: string): Platform | undefined {
  return platforms.find((p) => p.slug === slug);
}
