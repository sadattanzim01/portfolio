import { Link } from 'react-router';
import { site } from '../content/site';
import { emails, socials } from '../content/socials';
import { ExternalLink } from './ExternalLink';
import { NAV_ITEMS } from '../lib/nav';
import { ArrowUpRightIcon } from './icons';

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="text-lg font-medium tracking-tight">{site.name}</p>
          <p className="mt-1 text-sm text-muted">
            {site.role} · {site.location}
          </p>
          <a href={`mailto:${emails[0]}`} className="mt-2.5 inline-block py-1.5 text-sm text-fg underline-offset-4 hover:underline">
            {emails[0]}
          </a>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow">Pages</p>
          <ul className="mt-2 space-y-0.5 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="inline-block py-1.5 text-muted transition-colors hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow">Elsewhere</p>
          <ul className="mt-2 space-y-0.5 text-sm">
            {socials.map((s) => (
              <li key={s.label}>
                <ExternalLink href={s.href} className="group inline-flex items-center gap-1 py-1.5 text-muted transition-colors hover:text-fg">
                  {s.label}
                  <ArrowUpRightIcon size={13} className="opacity-0 transition-opacity group-hover:opacity-100" />
                </ExternalLink>
              </li>
            ))}
            <li>
              <ExternalLink href={site.resume} className="group inline-flex items-center gap-1 py-1.5 text-muted transition-colors hover:text-fg">
                Resume (PDF)
                <ArrowUpRightIcon size={13} className="opacity-0 transition-opacity group-hover:opacity-100" />
              </ExternalLink>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-8 font-mono text-xs text-subtle sm:px-6">
        © {new Date().getFullYear()} {site.name}
      </div>
    </footer>
  );
}
