import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { platforms } from "@/lib/platforms";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, navigate] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/social", label: "Tools" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/" data-testid="link-home-logo">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Layers className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">threadify</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" data-testid="nav-desktop">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                size="sm"
                className={location === link.href ? "bg-accent" : ""}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Button>
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2 gap-1" data-testid="button-format-for">
                Format for
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {platforms.map((p) => (
                <DropdownMenuItem
                  key={p.slug}
                  onClick={() => navigate(`/social/${p.slug}`)}
                  data-testid={`menu-platform-${p.slug}`}
                >
                  <p.icon className="mr-2 h-4 w-4" />
                  {p.shortName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                  <Layers className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="font-semibold">threadify</span>
              </div>
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${location === link.href ? "bg-accent" : ""}`}
                  onClick={() => setMobileOpen(false)}
                  data-testid={`link-mobile-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            <p className="px-4 text-xs font-medium text-muted-foreground">Platforms</p>
            {platforms.map((p) => (
              <Link key={p.slug} href={`/social/${p.slug}`}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => setMobileOpen(false)}
                  data-testid={`link-mobile-${p.slug}`}
                >
                  <p.icon className="h-4 w-4" />
                  {p.shortName}
                </Button>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
