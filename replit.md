# Threadify - Social Media Thread Generator

## Overview

Threadify is a free, client-side social media thread generator that helps users split and format long-form content into platform-specific posts for X (Twitter), Threads, LinkedIn, Reddit, Mastodon, and Facebook. The core design philosophy is **zero server-side storage of user content** — all thread generation, editing, and draft persistence happens entirely in the browser using localStorage.

The app has no user accounts, no authentication, no database-backed content storage, and no ads. It's a utility tool with a clean, modern UI.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Client)

- **Framework**: React 18 with TypeScript (NOT Next.js despite the attached requirements doc — the actual implementation uses Vite + React SPA)
- **Routing**: `wouter` for client-side routing (lightweight alternative to React Router)
- **State Management**: React Query (`@tanstack/react-query`) for any async state, React `useState`/`useEffect` for local state
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS
- **Icons**: `lucide-react` for UI icons, `react-icons/si` for brand/platform icons
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark/system mode)
- **Fonts**: Inter (sans-serif) and JetBrains Mono (monospace) from Google Fonts
- **Build Tool**: Vite with React plugin

**Key routes:**
| Route | Purpose |
|---|---|
| `/` | Landing page with hero, platform cards, feature highlights |
| `/social` | Lists all platform tools with cards |
| `/social/:slug` | Platform-specific thread generator tool page |
| `/faq` | FAQ accordion page |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/cookies` | Cookie policy |

**Platform slugs** are defined in `shared/schema.ts`: `x-thread-generator`, `threads-thread-generator`, `linkedin-post-formatter`, `reddit-post-splitter`, `mastodon-post-splitter`, `facebook-post-formatter`.

**Draft persistence**: Uses `localStorage` via `client/src/lib/storage.ts`. Drafts are keyed by platform slug with the prefix `threadify:draft:`. Each draft stores `content` (string) and `updatedAt` (timestamp).

**Theme system**: Custom `ThemeProvider` in `client/src/components/theme-provider.tsx` manages light/dark/system themes, persisted to localStorage under key `threadify-theme`. Applied by toggling `light`/`dark` class on `<html>`.

**Page metadata**: `usePageMeta` hook (`client/src/hooks/use-page-meta.ts`) dynamically updates `<title>`, Open Graph, Twitter card, canonical link, robots meta, and JSON-LD structured data per page. Accepts `path` for canonical URL, `structuredData` array for JSON-LD injection/cleanup.

**SEO content**: `client/src/lib/platform-seo.ts` contains unique SEO content per platform (metaTitle, metaDescription, H1, intro paragraphs, how-it-works steps, best practices, FAQs). Rendered below the tool UI on each platform page.

**SEO config**: `client/src/lib/seo-config.ts` defines site-wide constants (BASE_URL, SITE_NAME, DEFAULT_OG_IMAGE, TWITTER_HANDLE).

**JSON-LD structured data**: Platform pages inject `SoftwareApplication` and `FAQPage` schemas. FAQ page injects `FAQPage` schema.

**Cookie consent**: `client/src/components/cookie-consent.tsx` - Banner with 3 categories (necessary always on, preferences and analytics off by default). Stored in localStorage under key `threadify-cookie-consent`. Footer has "Manage Cookies" button to reset consent.

### Backend (Server)

- **Framework**: Express 5 on Node.js with TypeScript
- **Purpose**: Serves the SPA, provides SEO routes (sitemap, robots.txt), and handles URL redirects
- **Dev Server**: Vite dev server middleware is integrated into Express during development for HMR
- **Storage**: `server/storage.ts` has a `MemStorage` class implementing an `IStorage` interface — currently empty as the app is client-side focused
- **SEO routes**: `server/routes.ts` serves `/sitemap.xml` (all static + platform URLs), `/robots.txt`, and `/social-media-thread-generator` redirect (maps `?platform=x|twitter|threads|linkedin|reddit|mastodon|facebook` to correct `/social/:slug` via 301)
- **Database config**: Drizzle ORM is configured with PostgreSQL (`drizzle.config.ts`) but the schema (`shared/schema.ts`) currently only contains Zod validation schemas for platform slugs — no database tables are defined. The original requirements explicitly state NO database should be used for user content.
- **Build**: Custom build script (`script/build.ts`) uses Vite for client bundle and esbuild for server bundle, outputting to `dist/`

### Important Design Decisions

1. **No database for user content**: This is a hard requirement. All user drafts live in localStorage. The Drizzle/Postgres setup exists in the scaffold but should not be used for storing user-generated content.
2. **SPA architecture**: The server serves a single `index.html` and all routing is handled client-side by wouter. The server has a catch-all route that serves `index.html` for any path.
3. **No authentication**: No user accounts, sessions, or auth of any kind.
4. **Component library**: shadcn/ui components are copied into `client/src/components/ui/` (not imported from a package). New components should follow this pattern.
5. **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`.

### Project Structure

```
client/                  # Frontend SPA
  index.html             # Entry HTML
  src/
    main.tsx             # React root mount
    App.tsx              # App shell with router, providers
    components/
      ui/                # shadcn/ui component library
      header.tsx         # Sticky header with nav
      footer.tsx         # Footer with links
      theme-provider.tsx # Theme context
      theme-toggle.tsx   # Theme switcher dropdown
    pages/               # Route pages
    hooks/               # Custom hooks
    lib/
      platforms.ts       # Platform definitions (slugs, limits, tips, icons)
      platform-seo.ts    # Per-platform SEO content (unique per slug)
      seo-config.ts      # Site-wide SEO constants
      storage.ts         # localStorage draft persistence
      queryClient.ts     # React Query setup
      utils.ts           # cn() utility
server/                  # Express backend
  index.ts               # Server entry point
  routes.ts              # SEO routes (sitemap, robots, redirects)
  storage.ts             # Storage interface (currently empty)
  static.ts              # Static file serving for production
  vite.ts                # Vite dev middleware setup
shared/                  # Shared between client and server
  schema.ts              # Platform slug definitions (Zod)
migrations/              # Drizzle migration output directory
script/
  build.ts               # Production build script
```

## External Dependencies

### Core Libraries
- **React 18** + **ReactDOM** — UI framework
- **Vite** — Dev server and bundler
- **Express 5** — HTTP server
- **TypeScript** — Type safety across the stack

### UI & Styling
- **Tailwind CSS** — Utility-first CSS
- **shadcn/ui** — Pre-built component primitives (copied into project)
- **Radix UI** — Accessible primitive components (accordion, dialog, dropdown, tabs, toast, tooltip, etc.)
- **class-variance-authority** — Component variant management
- **clsx** + **tailwind-merge** — Conditional class name merging
- **lucide-react** — Icon set
- **react-icons** — Brand/social media icons (si prefix)
- **embla-carousel-react** — Carousel component
- **vaul** — Drawer component
- **cmdk** — Command menu component

### State & Data
- **@tanstack/react-query** — Async state management
- **wouter** — Client-side routing
- **zod** — Schema validation
- **react-hook-form** + **@hookform/resolvers** — Form management

### Database (scaffolded but minimal use)
- **Drizzle ORM** — SQL ORM (configured for PostgreSQL)
- **drizzle-zod** — Drizzle-to-Zod schema generation
- **drizzle-kit** — Migration tooling
- **pg** — PostgreSQL client (for `DATABASE_URL` connection)
- **connect-pg-simple** — Session store (scaffolded, not actively used)

### Build & Dev
- **esbuild** — Server bundling
- **tsx** — TypeScript execution for dev
- **@replit/vite-plugin-runtime-error-modal** — Dev error overlay
- **@replit/vite-plugin-cartographer** — Replit dev tooling
- **@replit/vite-plugin-dev-banner** — Replit dev banner

### Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (required by drizzle config but not actively used for app features)
- `NODE_ENV` — Controls dev vs production behavior