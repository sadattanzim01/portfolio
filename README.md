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

## Deploy to Cloudflare Pages

### 1. Push to GitHub

```bash
git add -A
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/sadattanzim01/portfolio.git   # create the empty repo on GitHub first
git push -u origin main
```

### 2. Create the Pages project

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pick the repository and use these settings:

   | Setting | Value |
   |---|---|
   | Framework preset | Vite (or None) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Environment variable | `NODE_VERSION` = `22` |

3. **Save and Deploy.** The site goes live at `https://<project>.pages.dev`.

Every push to `main` redeploys to production. Pushes to other branches get preview URLs.

The build writes one HTML file per route (`about.html`, `projects/pr-pilot.html`, ...) with that page's title, description and link-preview tags. Cloudflare serves `/about` from `about.html`. Since there's no `404.html`, any other path falls back to `index.html` (Pages' built-in SPA mode), and the app shows its 404 page. That's why `public/_redirects` deliberately has **no** `/* /index.html 200` rule: Pages applies `_redirects` rules even when a file exists, so that rule would hide the per-route files. `public/_headers` adds security headers and long-lived caching for hashed assets.

### 3. Custom domain (later)

First set `url` in `src/content/site.ts` to the new domain. It's used for canonical links, Open Graph tags, `robots.txt` and `sitemap.xml`. Then:

1. In the Pages project → **Custom domains** → **Set up a custom domain** → enter e.g. `sadattanzim.com`.
2. If the domain's DNS is on Cloudflare, the record is created automatically. If not, add the `CNAME` record Cloudflare shows (pointing to `<project>.pages.dev`) at your DNS provider. An apex domain needs Cloudflare DNS or a provider that supports CNAME flattening.
3. SSL is issued automatically, which usually takes a few minutes.
4. Optional: add `www` as a second custom domain and redirect it to the apex with a Bulk Redirect rule.
