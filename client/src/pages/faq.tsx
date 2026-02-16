import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePageMeta } from "@/hooks/use-page-meta";

const faqs = [
  {
    q: "What is Threadify?",
    a: "Threadify is a free online tool that helps you split and format long-form content into platform-specific posts. It supports X (Twitter), Threads, LinkedIn, Reddit, Mastodon, and Facebook.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. Threadify requires no sign-up, no login, and no personal information. Just open the tool and start writing.",
  },
  {
    q: "Is my content stored on your servers?",
    a: "No. Everything happens in your browser. Your content never leaves your device. Drafts are stored locally using your browser's localStorage.",
  },
  {
    q: "How does draft saving work?",
    a: "Threadify automatically saves your draft as you type. When you return to the same tool, your content will be restored automatically from your browser's local storage.",
  },
  {
    q: "Is Threadify free?",
    a: "Yes, completely free. There are no premium tiers, no hidden fees, and no ads.",
  },
  {
    q: "What character limits does each platform use?",
    a: "X uses 280 characters per tweet, Threads and Mastodon use 500, LinkedIn allows 3,000, Reddit supports up to 40,000, and Facebook allows up to 63,206 characters.",
  },
  {
    q: "Can I use Threadify on my phone?",
    a: "Absolutely. Threadify is fully responsive and works on any screen size, including mobile phones and tablets.",
  },
  {
    q: "Will you add more platforms?",
    a: "We're always looking to support more platforms. If you have a suggestion, feel free to reach out.",
  },
];

export default function FAQ() {
  usePageMeta({ title: "FAQ", description: "Frequently asked questions about Threadify." });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl" data-testid="text-faq-title">
        Frequently Asked Questions
      </h1>
      <p className="mt-2 text-muted-foreground">
        Everything you need to know about Threadify.
      </p>
      <Card className="mt-8">
        <CardContent className="p-5 sm:p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} data-testid={`accordion-faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
