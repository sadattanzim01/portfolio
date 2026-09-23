# Portfolio — project guide

Personal portfolio for Sadat Tanzim. Fully static SPA: Vite + React 19 + TypeScript + Tailwind CSS v4 + Motion + React Router 7. Deployed to Cloudflare Pages.

## Hard rules

- **No runtime external calls.** No APIs, CDNs, Google Fonts, analytics, or embeds fetched at runtime. Fonts are bundled from `@fontsource-variable/*`. Outbound *links* are fine.
- **No backend, no paid services.**
- **Minimal, pinned dependencies.** `.npmrc` has `save-exact=true`; always commit `package-lock.json`. Ask before adding a dependency.
- **Content lives only in `src/content/`.** Components never hard-code personal data.
- `npm run build` (typecheck + build) must pass before committing.

## Structure

```
public/
  resume.pdf        Linked from header, footer, home, about, contact
  images/projects/  Project card + detail images (16:9)
  _redirects        Cloudflare SPA fallback: /*  /index.html  200
  _headers          Security headers + immutable caching for /assets/*
  favicon.svg
  og/               Link-preview images (1200×630 PNG), generated
  apple-touch-icon.png, favicon-48.png   Generated PNG icons
build/
  seo.ts            Vite plugin: per-route HTML with meta tags, inlined CSS, robots.txt, sitemap.xml
assets/
  screenshots/      Original project screenshots (<slug>.png/.webp), not published
scripts/
  generate-project-images.py  Frames screenshots (or draws placeholders) → 1600w + 800w WebP (needs Chrome + cwebp)
  generate-og.py              Link-preview PNGs + PNG icons (needs Chrome)
src/
  content/          ← EDIT THESE to change the site
    types.ts        Types for all content (Project, Experience, Certification, ...)
    site.ts         Name, headline, status pill, about paragraphs, education, skills
    projects.ts     Projects (each gets /projects/<slug>)
    experience.ts   Work / team / leadership roles
    certifications.ts  Empty → page shows an empty state
    socials.ts      LinkedIn, GitHub, email addresses
  components/       Header, Footer, Layout (page transitions), ProjectCard, Reveal, icons, ...
  pages/            One file per route
  lib/
    content.ts      Sorted views of content + getProject(); dev-time slug validation
    theme.ts        Light/dark toggle (keep in sync with the inline script in index.html)
    motion.ts       Shared animation presets
    format.ts       Date formatting ("2026-08" → "Aug 2026")
    nav.ts          Nav items
    meta.ts         Per-route title/description/OG image (used by the client and build/seo.ts)
    images.ts       srcset/sizes helpers for project images
    sections.ts     Active-section tracking for the header
  App.tsx           Routes
  index.css         Tailwind + theme tokens
```

## Adding content

Dates are `"YYYY-MM"` strings. Lists are sorted newest-first automatically, so order in the file doesn't matter.

### A project — `src/content/projects.ts`

```ts
{
  slug: 'my-project',            // URL: /projects/my-project (lowercase-hyphenated, unique)
  title: 'My Project',
  type: 'hackathon',             // 'personal' | 'hackathon' (drives the filter)
  tagline: 'One-line summary for the card.',
  image: { src: '/images/projects/my-project.png', alt: 'What the image shows' },
  problem: ['What was wrong or missing (1–2 short paragraphs).'],
  approach: ['What you built and how', 'One step per bullet'],
  result: ['Outcome, with numbers if you have them'],
  tech: ['React', 'Python'],     // first 5 show on the card, all on the detail page
  date: '2026-10',
  context: 'Capstone',           // optional small label, e.g. 'Capstone', 'Course project'
  event: 'IBM Z × UNSA Hackathon 2026', // optional, hackathons
  award: '1st place overall',    // optional
  role: 'Backend lead',          // optional
  links: { repo: 'https://github.com/...', live: 'https://...', devpost: 'https://devpost.com/...' },
  featured: true,                // optional: show on the home page
  status: 'in-progress',         // optional: "In progress" badge; leave result: [] until it ships
},
```

**Images:**
1. Save the screenshot as `assets/screenshots/<slug>.png` (or .jpg/.webp; any size or aspect ratio).
2. Run `python3 scripts/generate-project-images.py <slug>`. It frames the screenshot in a window on a branded 16:9 canvas and writes `public/images/projects/<slug>.webp` (1600w) and `<slug>-800.webp`.
3. Point the project at them: `image: { src: '/images/projects/<slug>.webp', small: '/images/projects/<slug>-800.webp', alt: '...' }`.
4. Run `python3 scripts/generate-og.py` for the link-preview image. The build warns if it's missing.

Per-project framing (window title, a caption for very wide screenshots, right-side crop) is set in `FRAMES` at the top of the script. With no screenshot, the script uses a drawn placeholder from `PLACEHOLDERS` (SnapRAG has one). Avoid SVG for `src`: browsers rasterize SVG images on the main thread, which caused scroll jank.

### An experience entry — `src/content/experience.ts`

```ts
{
  company: 'Company',
  role: 'Software Engineering Intern',
  location: 'Toronto, ON',
  start: '2027-01',
  end: 'present',                // or '2027-04'
  highlights: ['...'],
  tech: ['...'],                 // optional
  url: 'https://company.com',    // optional
},
```

Roles with `end: 'present'` also appear in the "Currently" card on the home page.

### A certification — `src/content/certifications.ts`

```ts
{ name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: '2026-10', credentialUrl: 'https://...' },
```

### Other edits

- **Resume:** replace `public/resume.pdf` (keep the filename, or update `site.resume`).
- **Status pill / headline / bio / skills:** `src/content/site.ts`. Set `status: null` to hide the pill.
- **Accent color:** `--accent` (and `--accent-soft`) in both palette blocks in `src/index.css`. Use a darker shade in the light palette so it keeps contrast.
- **New page:** add `src/pages/X.tsx`, a route in `src/App.tsx`, and an entry in `src/lib/nav.ts`.

## Theming

Dark-first with a light toggle (circular reveal via the View Transitions API, saved in `localStorage`). There are three palettes in `src/index.css`, each with its own character:
- **Night** (dark mode): deep graphite, mint accent, cards with a top highlight that glow on hover.
- **Paper** (light mode): warm paper, deep emerald, cards that lift on soft shadows, and a warm sunrise glow behind the hero.
- **Forest**: deep green ink, used for the `theme-invert` bands in light mode. In dark mode those bands use Paper.

Cards use `shadow-card` and `hover:shadow-card-hover`, and hero atmosphere uses `.bg-glow`; all three follow the palette. Colors are CSS variables (`bg`, `surface`, `elevated`, `fg`, `muted`, `subtle`, `line`, `accent`), exposed as Tailwind utilities (`bg-bg`, `text-muted`, `border-line`, ...). Always use these tokens, never raw colors, so both themes work.

Add `theme-invert` (with `bg-bg text-fg`) to any element to render it in the opposite palette. This creates the contrast bands on the home page. Don't use Tailwind's `invert` class for this; it's a CSS filter.

## SEO, meta and performance

- **Site URL:** `site.url` in `src/content/site.ts`. Update it when the custom domain goes live.
- **Titles and descriptions** for every route live in `src/lib/meta.ts`. A new static page needs an entry in its `STATIC` map. Project pages are automatic.
- **Build output:** `build/seo.ts` writes `dist/<route>.html` with the right `<title>`, description, canonical URL, Open Graph/Twitter tags, JSON-LD (home) and LCP image preload. It also writes `robots.txt` and `sitemap.xml`. Don't add a `/* /index.html 200` rule to `_redirects` (see README).
- **Client side:** `Layout` calls `applyMeta()` on every navigation. Unknown routes get `noindex`.
- **Budgets (last audit):** Lighthouse mobile 96–97 performance and 100 accessibility / best practices / SEO; desktop 100 across the board. Keep:
  - CSS inlined, which the plugin does
  - the body font preloaded
  - above-the-fold images eager, the first with `fetchPriority="high"`
  - everything else lazy
- **Accessibility conventions:**
  - `text-subtle` / `text-muted` meet 4.5:1 in both themes. Don't use opacity to dim text.
  - Heading levels must not skip (`ProjectCard` has a `headingLevel` prop).
  - Standalone links need a tap target of 24px or more (use `py-1.5 -my-1.5`).
  - Every interactive element must show a focus ring.

## Motion

- **Route transitions** (`Layout.tsx`, timings in `lib/motion.ts`): the old page fades out in 150ms, the new one fades and slides in over 300ms. The first load skips the page fade so content paints immediately. Keep the total under 500ms.
- **Scroll reveals:** wrap blocks in `<Reveal>` or `<RevealGroup>` + `<RevealItem>`. They fire once, slightly before the element is fully visible.
- **Header** (`Header.tsx`): fixed, with a spacer so shrinking (64 → 52px) never shifts content. When compact, it shows a scroll progress line and the active section label.
- **Active section:** register a section with `const ref = useSection('Label')` from `lib/sections.ts` and attach `ref` to its element. The header shows the label of the section under it. Registered today: Home (Intro, Selected work, Experience, Contact), About, each Experience role, and project detail pages.
- **Smooth scrolling:** CSS `scroll-behavior: smooth` (reduced-motion aware) applies to in-page jumps. Route changes jump to the top instantly. Wheel scrolling is intentionally not hijacked.
- Everything respects `prefers-reduced-motion` via `<MotionConfig reducedMotion="user">` and the CSS media query.

## Custom cursor

`src/components/Cursor.tsx` (styles at the bottom of `src/index.css`) is mounted once in `Layout`, outside the page transition. It uses motion values and direct DOM writes only, so moving the pointer never re-renders React. It turns itself off on touch/coarse pointers and with `prefers-reduced-motion`; the native cursor is used there.

Control it from markup:

| Attribute | Effect |
|---|---|
| (none) on `a`, `button`, `[role=tab]` | Ring grows and inverts what's beneath it |
| `data-cursor="view"` | Accent disc with a label; `data-cursor-label="Open"` changes the text (default "View") |
| `data-cursor="text"` (automatic on `<p>`) | Text caret sized to the element's line height |
| `data-magnetic` / `data-magnetic="0.45"` | Element leans toward the pointer (strength defaults to 0.3); use on primary buttons and icon links |

Priority when nested: `view` > interactive > text.

## Commands

```bash
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build → dist/
npm run preview    # serve dist/ at http://localhost:4173
```
