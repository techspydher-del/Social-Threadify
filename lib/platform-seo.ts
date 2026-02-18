export interface PlatformSEO {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string[];
  howItWorks: { step: string; description: string }[];
  bestPractices: string[];
  faqs: { question: string; answer: string }[];
}

export const platformSEOContent: Record<string, PlatformSEO> = {
  "x-thread-generator": {
    metaTitle: "Free X (Twitter) Thread Generator - Split Long Posts Into Tweets",
    metaDescription: "Split your long-form content into perfectly sized X (Twitter) threads. Smart word-boundary splitting, thread numbering, and hashtag support. Free, no signup.",
    h1: "X (Twitter) Thread Generator",
    intro: [
      "Writing long-form content on X (formerly Twitter) means breaking your ideas into 280-character tweets that flow naturally. Threadify's X Thread Generator does this automatically, splitting your writing at smart word boundaries so no sentence gets cut mid-thought.",
      "Whether you're sharing a hot take, a tutorial, or a story, this tool formats everything into a clean, numbered thread ready to post. Your content stays in your browser and is never stored on any server.",
    ],
    howItWorks: [
      { step: "Paste your content", description: "Write or paste your long-form text into the editor. There's no length limit on input." },
      { step: "Customise settings", description: "Toggle thread numbering (1/n format), add preset hashtags, and choose whether to append them to each tweet." },
      { step: "Generate your thread", description: "Click Generate and your content is split into tweets that respect the 280-character limit, keeping sentences and paragraphs intact." },
      { step: "Edit and reorder", description: "Drag posts to reorder, split or merge individual tweets, use find and replace, and undo or redo any change." },
      { step: "Copy and post", description: "Copy individual tweets or the entire thread, download as a text file, or share directly from your device." },
    ],
    bestPractices: [
      "Start your thread with a strong hook that makes people want to read more.",
      "Keep each tweet focused on a single point for maximum clarity.",
      "Use thread numbering so readers know there's more to come.",
      "End your thread with a summary or call-to-action to drive engagement.",
      "Avoid walls of text in a single tweet. Use line breaks for readability.",
      "Schedule your threads for peak activity times in your audience's timezone.",
    ],
    faqs: [
      { question: "How does the X Thread Generator handle URLs?", answer: "X counts all URLs as 23 characters regardless of their actual length. Threadify accounts for this when calculating character counts, so your tweets will always fit within the 280-character limit." },
      { question: "Can I add thread numbering like 1/n?", answer: "Yes. Toggle the numbering switch to automatically add thread numbers (1/n, 2/n, etc.) to each tweet. The character count accounts for the numbering so you never go over the limit." },
      { question: "Will my thread be stored on your servers?", answer: "No. All content stays in your browser. Drafts are saved to your device's localStorage and are never transmitted to any server." },
      { question: "Can I reorder tweets after generating?", answer: "Yes. Use the drag handles on each tweet to rearrange the order. You can also split a tweet at any cursor position or merge adjacent tweets together." },
      { question: "What happens if a single paragraph is longer than 280 characters?", answer: "Threadify splits long paragraphs at the nearest word boundary before the character limit, ensuring no word is cut in half." },
    ],
  },
  "threads-thread-generator": {
    metaTitle: "Free Threads Post Generator - Format Content for Meta Threads",
    metaDescription: "Format and split your content for Meta's Threads platform. 500-character limit support, thread numbering, and smart formatting. Free online tool.",
    h1: "Threads Post Generator",
    intro: [
      "Meta's Threads gives you 500 characters per post, which is more room than X but still requires careful formatting for longer content. Threadify's Threads Generator splits your writing into well-structured posts that make the most of the character limit.",
      "The tool preserves your natural paragraph breaks, handles thread numbering, and lets you add hashtags to boost discoverability. Everything runs in your browser with zero data collection.",
    ],
    howItWorks: [
      { step: "Write or paste your content", description: "Enter your text into the editor. The character counter shows your total length in real time." },
      { step: "Configure your preferences", description: "Enable thread numbering, add hashtags, and choose whether hashtags appear on every post or just the last one." },
      { step: "Generate posts", description: "Your content is split into 500-character posts with smart word-boundary detection that keeps your sentences intact." },
      { step: "Fine-tune the output", description: "Edit individual posts, drag to reorder, split or merge posts, and use find and replace across all posts." },
      { step: "Copy and share", description: "Copy posts one at a time or all at once, download as a text file, or use the native share menu." },
    ],
    bestPractices: [
      "Use a conversational, authentic tone. Threads rewards genuine voices over polished marketing speak.",
      "Break complex ideas into separate posts rather than cramming everything into one.",
      "Use hashtags sparingly. One or two relevant hashtags per post is enough.",
      "Engage with replies quickly after posting to boost your thread's visibility.",
      "Add line breaks within posts to make them scannable on mobile devices.",
      "Post consistently rather than dumping all your content at once.",
    ],
    faqs: [
      { question: "What is the character limit on Threads?", answer: "Threads allows up to 500 characters per post. Threadify respects this limit and splits your content accordingly." },
      { question: "Can I add hashtags to my Threads posts?", answer: "Yes. Enter your hashtags in the preset field and toggle whether they should appear on every post or just the last one." },
      { question: "Does Threads support thread numbering?", answer: "Yes. Threadify can add automatic numbering in 1/n format to help readers follow along with multi-post threads." },
      { question: "Is my content sent to Meta when I use this tool?", answer: "No. Threadify operates entirely in your browser. Your content is never sent to Meta, Threadify, or any third party." },
    ],
  },
  "linkedin-post-formatter": {
    metaTitle: "Free LinkedIn Post Formatter - Format Professional Posts",
    metaDescription: "Create perfectly formatted LinkedIn posts with proper spacing, hooks, and engagement-optimised structure. 3,000-character limit support. Free, no signup.",
    h1: "LinkedIn Post Formatter",
    intro: [
      "LinkedIn's algorithm rewards well-formatted posts with strong hooks and clear structure. This formatter helps you take long-form ideas and shape them into posts that are easy to read, professional, and optimised for engagement within the 3,000-character limit.",
      "The tool includes a Smart Format feature that automatically applies LinkedIn best practices like tightening whitespace and adding a discussion prompt at the end of your post.",
    ],
    howItWorks: [
      { step: "Enter your content", description: "Paste your article, thought piece, or professional insight into the editor." },
      { step: "Use Smart Format", description: "Click Smart Format to automatically apply LinkedIn-specific formatting rules, including whitespace cleanup and adding an engagement prompt." },
      { step: "Generate posts", description: "If your content exceeds 3,000 characters, it will be split into multiple posts with clean paragraph boundaries." },
      { step: "Review and edit", description: "Edit the formatted output directly. Use find and replace to make bulk changes across all posts." },
      { step: "Copy to LinkedIn", description: "Copy your formatted post and paste it directly into LinkedIn's composer." },
    ],
    bestPractices: [
      "Start with a bold, attention-grabbing first line. This is what appears before the 'See more' button.",
      "Use short paragraphs with generous white space. Wall-of-text posts get skipped.",
      "Place links in the comments rather than the post body to avoid algorithmic penalties.",
      "End with a question to invite discussion and boost engagement signals.",
      "Share personal stories and lessons learned. LinkedIn's audience values authenticity.",
      "Post during business hours in your audience's primary timezone for maximum visibility.",
    ],
    faqs: [
      { question: "What is the LinkedIn post character limit?", answer: "LinkedIn allows up to 3,000 characters per post. This tool ensures your content fits within that limit." },
      { question: "What does the Smart Format button do for LinkedIn?", answer: "Smart Format applies LinkedIn-specific optimisations: it tightens excessive whitespace and appends a discussion prompt ('What are your thoughts?') to encourage engagement." },
      { question: "Should I include links in my LinkedIn post?", answer: "LinkedIn's algorithm may reduce the reach of posts with external links. It's better to place links in the first comment instead." },
      { question: "Can I split a long article into multiple LinkedIn posts?", answer: "Yes. If your content exceeds 3,000 characters, Threadify will split it into multiple posts at natural paragraph breaks." },
    ],
  },
  "reddit-post-splitter": {
    metaTitle: "Free Reddit Post Splitter - Format Long Posts for Reddit",
    metaDescription: "Format and split long-form content for Reddit with Markdown support, TL;DR generation, and proper structure. 40,000-character limit. Free online tool.",
    h1: "Reddit Post Splitter",
    intro: [
      "Reddit supports up to 40,000 characters per post and full Markdown formatting, making it the best platform for in-depth content. This splitter helps you format long posts with proper headings, lists, and paragraph structure so your content is easy to read on any subreddit.",
      "The Smart Format feature can automatically add a TL;DR section for longer posts, which is a community expectation on many subreddits.",
    ],
    howItWorks: [
      { step: "Paste your content", description: "Enter your long-form post, article, or guide into the editor. Markdown formatting is fully supported." },
      { step: "Apply Smart Format", description: "Click Smart Format to clean up whitespace and automatically generate a TL;DR section if your post is long enough." },
      { step: "Generate output", description: "Your content is formatted and split (if needed) into Reddit-ready posts that preserve Markdown structures like headings, lists, and code blocks." },
      { step: "Edit as needed", description: "Refine the output, adjust formatting, and use find and replace for bulk edits." },
      { step: "Copy to Reddit", description: "Copy the formatted post and paste it into Reddit's post editor." },
    ],
    bestPractices: [
      "Add a TL;DR (Too Long; Didn't Read) at the top or bottom for posts over 500 words.",
      "Use Markdown headings (## Section Title) to break content into scannable sections.",
      "Follow each subreddit's specific rules on formatting and content requirements.",
      "Use bold and italic text to emphasise key points without overdoing it.",
      "Include relevant links and sources to support your claims.",
      "Engage with commenters after posting to keep the discussion active.",
    ],
    faqs: [
      { question: "What is the Reddit post character limit?", answer: "Reddit allows up to 40,000 characters per text post. Most posts will fit in a single post, but Threadify can split very long content if needed." },
      { question: "Does Reddit support Markdown?", answer: "Yes. Reddit supports Markdown formatting including headings, bold, italic, links, lists, block quotes, and code blocks. Threadify preserves all Markdown formatting during splitting." },
      { question: "What does Smart Format do for Reddit posts?", answer: "Smart Format cleans up whitespace and adds a TL;DR section at the end of longer posts, which is a common expectation on Reddit." },
      { question: "Can I use this tool for Reddit comments?", answer: "Yes. While designed for posts, you can use the formatter for long comments as well. Reddit comments have a 10,000-character limit." },
    ],
  },
  "mastodon-post-splitter": {
    metaTitle: "Free Mastodon Post Splitter - Split Toots Into Threads",
    metaDescription: "Split long content into Mastodon-friendly 500-character toots with thread numbering and content warning support. Free, privacy-first tool.",
    h1: "Mastodon Post Splitter",
    intro: [
      "Mastodon's decentralised network uses a default 500-character limit per toot, and the community values thoughtful formatting, alt-text on images, and appropriate use of content warnings. This splitter helps you format long-form content into threaded toots that respect these norms.",
      "Threadify's Smart Format feature can automatically add content warnings for posts containing sensitive topics, helping you follow Mastodon's community guidelines.",
    ],
    howItWorks: [
      { step: "Enter your content", description: "Paste or type your long-form text into the editor. There's no input length limit." },
      { step: "Configure settings", description: "Enable thread numbering and add hashtags for discoverability. Hashtags are important on Mastodon for reaching people beyond your followers." },
      { step: "Generate toots", description: "Your content is split into 500-character toots with smart word-boundary detection." },
      { step: "Edit and arrange", description: "Edit individual toots, drag to reorder, split or merge, and use find and replace." },
      { step: "Copy and post", description: "Copy toots one at a time and post them as a self-reply thread on your Mastodon instance." },
    ],
    bestPractices: [
      "Use content warnings (CW) for topics that others might want to opt into reading.",
      "Hashtags are the primary discovery mechanism on Mastodon. Use them on at least one toot.",
      "Always add alt-text descriptions when sharing images alongside your toots.",
      "Thread your toots by replying to yourself so readers can follow the conversation.",
      "Be mindful of instance-specific character limits, which may differ from the default 500.",
      "Write in a conversational and inclusive tone. Mastodon communities value thoughtfulness.",
    ],
    faqs: [
      { question: "What is the Mastodon character limit?", answer: "The default character limit on Mastodon is 500 characters per toot, though some instances may have higher limits. Threadify uses the standard 500-character limit." },
      { question: "What does Smart Format do for Mastodon?", answer: "Smart Format scans your content for potentially sensitive keywords and adds a content warning (CW) line at the beginning. It also tightens whitespace for cleaner formatting." },
      { question: "How do I thread toots on Mastodon?", answer: "Post your first toot, then reply to it with the second, and so on. Threadify generates numbered toots you can copy and post in sequence." },
      { question: "Does Mastodon support hashtags like Twitter?", answer: "Yes, and they're even more important. Mastodon doesn't have an algorithm, so hashtags are the main way people discover content outside their follow list." },
    ],
  },
  "facebook-post-formatter": {
    metaTitle: "Free Facebook Post Formatter - Optimise Posts for Engagement",
    metaDescription: "Format your Facebook posts for maximum engagement with proper structure, spacing, and formatting. 63,206-character support. Free online tool.",
    h1: "Facebook Post Formatter",
    intro: [
      "Facebook allows up to 63,206 characters per post, but shorter, well-structured posts consistently outperform walls of text. This formatter helps you shape your content for maximum readability and engagement on Facebook, whether you're posting to a personal timeline, a group, or a page.",
      "The Smart Format feature applies Facebook-specific best practices, including whitespace optimisation and adding a prompt to encourage comments.",
    ],
    howItWorks: [
      { step: "Enter your content", description: "Paste your post, article excerpt, or update into the editor." },
      { step: "Format your post", description: "Use Smart Format to apply Facebook-friendly formatting, or manually edit the content." },
      { step: "Generate output", description: "If your content is very long, it will be split into multiple posts. Most Facebook content fits in a single post." },
      { step: "Review and adjust", description: "Edit the output, use find and replace for bulk changes, and reorder if you have multiple posts." },
      { step: "Copy to Facebook", description: "Copy the formatted text and paste it into Facebook's post composer." },
    ],
    bestPractices: [
      "Shorter posts (under 250 characters) tend to get significantly more engagement on Facebook.",
      "Use line breaks generously. Posts that look like walls of text get scrolled past.",
      "Ask a question or include a clear call-to-action to drive comments.",
      "Native video and images outperform external links in Facebook's algorithm.",
      "Post when your audience is most active. Check your page insights for timing data.",
      "Avoid clickbait and sensational language that might trigger algorithmic suppression.",
    ],
    faqs: [
      { question: "What is the Facebook post character limit?", answer: "Facebook allows up to 63,206 characters per post, though posts over 477 characters are truncated behind a 'See More' link." },
      { question: "What is the ideal Facebook post length?", answer: "Studies suggest posts between 40 and 250 characters receive the most engagement. However, the ideal length depends on your audience and content type." },
      { question: "Does Facebook support formatting like bold or italic?", answer: "Facebook supports some formatting in groups and pages but not in personal timeline posts. Threadify formats your content for readability regardless." },
      { question: "Can I schedule posts from Threadify?", answer: "Threadify doesn't connect to Facebook directly. Copy your formatted post and use Facebook's built-in scheduling tool or a third-party social media manager." },
    ],
  },
};
