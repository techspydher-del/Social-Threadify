import { Link } from "wouter";
import { Layers } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                  <Layers className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="font-semibold">threadify</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Free tools to format and split your content for every social platform.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/social/x-thread-generator" className="transition-colors hover:text-foreground" data-testid="footer-link-x">
                  X Thread Generator
                </Link>
              </li>
              <li>
                <Link href="/social/threads-thread-generator" className="transition-colors hover:text-foreground" data-testid="footer-link-threads">
                  Threads Generator
                </Link>
              </li>
              <li>
                <Link href="/social/linkedin-post-formatter" className="transition-colors hover:text-foreground" data-testid="footer-link-linkedin">
                  LinkedIn Formatter
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">More Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/social/reddit-post-splitter" className="transition-colors hover:text-foreground" data-testid="footer-link-reddit">
                  Reddit Splitter
                </Link>
              </li>
              <li>
                <Link href="/social/mastodon-post-splitter" className="transition-colors hover:text-foreground" data-testid="footer-link-mastodon">
                  Mastodon Splitter
                </Link>
              </li>
              <li>
                <Link href="/social/facebook-post-formatter" className="transition-colors hover:text-foreground" data-testid="footer-link-facebook">
                  Facebook Formatter
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-foreground" data-testid="footer-link-privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-foreground" data-testid="footer-link-terms">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="transition-colors hover:text-foreground" data-testid="footer-link-cookies">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Threadify. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
