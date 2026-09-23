/**
 * Per-route <head> metadata. Shared by the client (updates tags on navigation) and by the
 * build (vite.config.ts writes a pre-filled HTML file per route, so link previews on
 * LinkedIn/Slack/etc. work without JavaScript).
 *
 * Imports content only (no React, no import.meta.env) so it can run in Node at build time.
 */
import { projects } from '../content/projects.ts';
import { site } from '../content/site.ts';
import { socials } from '../content/socials.ts';
import { CARD_SIZES, HERO_SIZES, srcSetOf } from './images.ts';

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  /** Root-relative path to a 1200×630 PNG/JPG. */
  image: string;
  /** The page's LCP image, preloaded from the static HTML. */
  preloadImage?: { href: string; srcSet?: string; sizes?: string };
  noindex?: boolean;
  jsonLd?: object;
}

export const DEFAULT_OG_IMAGE = '/og/default.png';

/** Same order as the Projects page (newest first; ties keep file order). */
const newestProject = [...projects].sort((a, b) => b.date.localeCompare(a.date))[0];

const fullTitle = (page: string | null) => (page ? `${page} · ${site.name}` : `${site.name} — ${site.role}`);

const STATIC: Record<string, { page: string | null; description: string }> = {
  '/': { page: null, description: site.description },
  '/about': {
    page: 'About',
    description: `About ${site.name}: Computer Science (Honours) student at the University of Windsor, education, and technical toolkit.`,
  },
  '/experience': {
    page: 'Experience',
    description: `${site.name}'s experience: software engineering at Glendor, embedded software at Formula Electric Windsor, web development, and AI Club leadership.`,
  },
  '/projects': {
    page: 'Projects',
    description: `Projects by ${site.name}: AI agents, LLM pipelines, and full-stack apps, including ${projects
      .slice(0, 3)
      .map((p) => p.title)
      .join(', ')}.`,
  },
  '/certifications': { page: 'Certifications', description: `Certifications and credentials earned by ${site.name}.` },
  '/contact': {
    page: 'Contact',
    description: `Get in touch with ${site.name} by email or LinkedIn. Open to internships and software engineering opportunities.`,
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  url: site.url,
  jobTitle: site.role,
  description: site.description,
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Windsor' },
  sameAs: socials.map((s) => s.href),
};

/** Every route that should get its own HTML file and sitemap entry. */
export function allRoutes(): string[] {
  return [...Object.keys(STATIC), ...projects.map((p) => `/projects/${p.slug}`)];
}

/** Metadata for a pathname, or null for unknown routes (rendered as 404, noindex). */
export function getMeta(pathname: string): PageMeta | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const page = STATIC[path];
  if (page) {
    return {
      path,
      title: fullTitle(page.page),
      description: page.description,
      image: DEFAULT_OG_IMAGE,
      jsonLd: path === '/' ? personJsonLd : undefined,
      // The first card's image is the Projects page's largest paint.
      preloadImage:
        path === '/projects' && newestProject
          ? { href: newestProject.image.src, srcSet: srcSetOf(newestProject.image), sizes: CARD_SIZES }
          : undefined,
    };
  }
  const slug = path.match(/^\/projects\/([^/]+)$/)?.[1];
  const project = slug ? projects.find((p) => p.slug === slug) : undefined;
  if (project) {
    return {
      path,
      title: fullTitle(project.title),
      description: `${project.tagline} Built with ${project.tech.slice(0, 4).join(', ')}.`,
      image: `/og/${project.slug}.png`,
      preloadImage: { href: project.image.src, srcSet: srcSetOf(project.image), sizes: HERO_SIZES },
    };
  }
  return null;
}

export const NOT_FOUND_META: PageMeta = {
  path: '/404',
  title: fullTitle('Page not found'),
  description: site.description,
  image: DEFAULT_OG_IMAGE,
  noindex: true,
};

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The tags that go between the <!-- meta --> markers in index.html. */
export function renderHead(meta: PageMeta): string {
  const url = site.url + (meta.path === '/' ? '/' : meta.path);
  const image = site.url + meta.image;
  const tags = [
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}" />`,
    meta.noindex ? `<meta name="robots" content="noindex" />` : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${meta.path.startsWith('/projects/') ? 'article' : 'website'}" />`,
    `<meta property="og:site_name" content="${escape(site.name)}" />`,
    `<meta property="og:locale" content="en_CA" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escape(meta.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(meta.title)}" />`,
    `<meta name="twitter:description" content="${escape(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ];
  if (meta.preloadImage) {
    const { href, srcSet, sizes } = meta.preloadImage;
    const responsive = srcSet ? ` imagesrcset="${srcSet}" imagesizes="${sizes}"` : '';
    tags.push(`<link rel="preload" as="image" href="${href}"${responsive} fetchpriority="high" />`);
  }
  if (meta.jsonLd) tags.push(`<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>`);
  return tags.join('\n    ');
}

/** Client-side: keep <head> in sync after SPA navigations. */
export function applyMeta(meta: PageMeta) {
  document.title = meta.title;
  const url = site.url + (meta.path === '/' ? '/' : meta.path);
  const set = (selector: string, attr: string, value: string | null) => {
    let el = document.head.querySelector<HTMLElement>(selector);
    if (value === null) {
      el?.remove();
      return;
    }
    if (!el) {
      const [, tag, key, name] = selector.match(/^(\w+)\[(\w+)="([^"]+)"\]$/)!;
      el = document.createElement(tag!);
      el.setAttribute(key!, name!);
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };
  set('meta[name="description"]', 'content', meta.description);
  set('meta[name="robots"]', 'content', meta.noindex ? 'noindex' : null);
  set('link[rel="canonical"]', 'href', meta.noindex ? null : url);
  set('meta[property="og:title"]', 'content', meta.title);
  set('meta[property="og:description"]', 'content', meta.description);
  set('meta[property="og:url"]', 'content', url);
  set('meta[property="og:image"]', 'content', site.url + meta.image);
  set('meta[name="twitter:title"]', 'content', meta.title);
  set('meta[name="twitter:description"]', 'content', meta.description);
  set('meta[name="twitter:image"]', 'content', site.url + meta.image);
}
