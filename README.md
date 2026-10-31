# Sadat Tanzim — Portfolio

Personal portfolio site. Static, no backend, no runtime external requests.

**Stack:** Vite · React 19 · TypeScript · Tailwind CSS v4 · Motion · React Router 7

## Local development

Requires Node 22.12+ (see `.nvmrc`).

```bash
npm ci
npm run dev        # http://localhost:5173
npm run build      # typecheck + build to dist/
npm run preview    # preview the production build
```

To add projects, experience, or certifications, edit the files in `src/content/`. See [CLAUDE.md](CLAUDE.md) for templates.

Project images: put a screenshot in `assets/screenshots/<slug>.png`, then run:

```bash
python3 scripts/generate-project-images.py <slug>
python3 scripts/generate-og.py
```

(Both need Google Chrome; the first also needs `brew install webp`.)

## Deploy

Live at **https://sadattanzim.vercel.app** (primary; this is the link on LinkedIn).

### Vercel (primary)
The Vercel project **sadattanzim** imports `github.com/sadattanzim01/portfolio`, branch `main`. Every push deploys automatically. `vercel.json` sets:
- the build (`npm run build` → `dist`)
- `cleanUrls`, so `/about` serves `about.html`
- the security headers, plus long-term caching for `/assets/*`

Unknown paths get `dist/404.html` (a copy of the app with `noindex`) with a real 404 status, and the app shows its not-found page.

### Cloudflare Workers (secondary mirror)
Also live at https://portfolio.sadattanzim06.workers.dev. LinkedIn wouldn't generate previews for `workers.dev` links, which is why Vercel is primary. You can delete the Worker at any time. If you keep it, these details still apply:

The Worker only serves the static files in `dist/`, configured by `wrangler.jsonc`. There's no server code.

#### How it deploys
The Worker **portfolio** is connected to `github.com/sadattanzim01/portfolio`, branch `main`. Every push runs:

| Step | Command |
|---|---|
| Build | `npm run build` |
| Deploy | `npx wrangler deploy` (reads `wrangler.jsonc`) |

Build variable: `NODE_VERSION` = `22` (Settings → Build → Variables and secrets).

To update the site: commit and `git push`. It's live in about a minute. Build history is under the Worker's **Deployments** tab.

#### Routing
The build writes one HTML file per route (`about.html`, `projects/pr-pilot.html`, ...) with that page's title, description and link-preview tags. `wrangler.jsonc` serves `/about` from `about.html` (`html_handling`), and falls back to `index.html` for anything else (`not_found_handling: single-page-application`), where the app shows its 404 page. `public/_headers` adds security headers and long-lived caching for hashed assets. `public/_redirects` is available for real redirects. Don't add a `/* /index.html 200` rule there, because the SPA fallback is already handled.

#### Setting it up again from scratch
Workers & Pages → Create application → connect GitHub → pick the repo. Use the build and deploy commands above and add the `NODE_VERSION` variable. The Worker's name must match `"name"` in `wrangler.jsonc`.

## Custom domain (later)

First set `url` in `src/content/site.ts` to the new domain. It's used for canonical links, Open Graph tags, `robots.txt` and `sitemap.xml`. Then:

1. In Vercel: **Project → Settings → Domains → Add**, then enter e.g. `sadattanzim.com` or `portfolio.sadattanzim.com`.
2. Add the DNS record Vercel shows at your domain registrar: a `CNAME` for a subdomain like `portfolio.`, or an `A` record for the bare domain.
3. SSL is issued automatically, which usually takes a few minutes.
4. Optional: add `www` too. Vercel offers to redirect it to the main domain.
