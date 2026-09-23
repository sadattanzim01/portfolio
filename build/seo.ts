import { existsSync } from 'node:fs';
import type { Plugin } from 'vite';
import { site } from '../src/content/site.ts';
import { allRoutes, DEFAULT_OG_IMAGE, getMeta, renderHead } from '../src/lib/meta.ts';

const MARKERS = /<!-- meta:start -->[\s\S]*?<!-- meta:end -->/;

/**
 * Build-time SEO and first-paint work (runs on `vite build` only):
 * - inlines the CSS bundle into the HTML (removes a render-blocking request)
 * - preloads the primary body font
 * - writes one HTML file per route with that page's title, description, canonical URL,
 *   Open Graph / Twitter tags and LCP image preload (e.g. dist/projects/pr-pilot.html),
 *   so link previews work for crawlers that don't run JavaScript
 * - writes robots.txt and sitemap.xml from site.url
 *
 * Cloudflare Pages serves /about from about.html and falls back to index.html for unknown paths.
 */
export function seo(): Plugin {
  let publicDir = '';

  return {
    name: 'portfolio-seo',
    apply: 'build',
    // After Vite's HTML plugin, which emits index.html during generateBundle.
    enforce: 'post',
    configResolved(config) {
      publicDir = config.publicDir;
    },
    generateBundle(_options, bundle) {
      const entry = bundle['index.html'];
      if (!entry || entry.type !== 'asset') this.error('index.html not found in bundle');
      let template = String(entry.source);
      if (!MARKERS.test(template)) this.error('index.html is missing the <!-- meta:start/end --> markers');

      // Inline the stylesheet(s).
      template = template.replace(/<link rel="stylesheet"[^>]*href="\/([^"]+\.css)"[^>]*>/g, (tag, file: string) => {
        const css = bundle[file];
        if (!css || css.type !== 'asset') return tag;
        delete bundle[file];
        return `<style>${String(css.source)}</style>`;
      });

      // Preload the Latin subset of the body font so text doesn't swap late.
      const font = Object.keys(bundle).find((f) => /inter-latin-wght-normal-[\w-]+\.woff2$/.test(f));
      if (font) {
        template = template.replace(
          '<head>',
          `<head>\n    <link rel="preload" href="/${font}" as="font" type="font/woff2" crossorigin />`,
        );
      }

      for (const route of allRoutes()) {
        const meta = getMeta(route)!;
        if (!existsSync(publicDir + meta.image)) {
          this.warn(`Missing OG image public${meta.image} for ${route}; using ${DEFAULT_OG_IMAGE}. Run scripts/generate-og.py.`);
          meta.image = DEFAULT_OG_IMAGE;
        }
        const html = template.replace(MARKERS, `<!-- meta:start -->\n    ${renderHead(meta)}\n    <!-- meta:end -->`);
        if (route === '/') entry.source = html;
        else this.emitFile({ type: 'asset', fileName: `${route.slice(1)}.html`, source: html });
      }

      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`,
      });

      const today = new Date().toISOString().slice(0, 10);
      const urls = allRoutes()
        .map((r) => `  <url><loc>${site.url}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod></url>`)
        .join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
    },
  };
}
