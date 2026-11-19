/**
 * Design-system primitives. Pages compose these instead of re-styling the same things.
 * See "Design system" in CLAUDE.md for the rules (type scale, radii, icon sizes, one primary CTA).
 */
import { useCallback, useState, type ComponentProps, type ReactNode } from 'react';
import { Link } from 'react-router';
import { ExternalLink } from './ExternalLink';
import { ArrowRightIcon, ArrowUpRightIcon } from './icons';

/** Icon sizes: 14 inline with small text, 16 in buttons and body text, 18 for standalone controls. */
export const ICON = { sm: 14, md: 16, lg: 18 } as const;

/** Small status marker. Use only for information a reader needs (state, event, context), never decoration. */
export function Badge({ children, tone = 'neutral', className = '' }: { children: ReactNode; tone?: 'neutral' | 'accent'; className?: string }) {
  const tones = {
    neutral: 'border-line bg-bg/90 text-fg',
    accent: 'border-transparent bg-accent-soft text-accent',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

/** Internal links get →, external get ↗. The arrow nudges on hover as feedback. */
export function TextLink({ to, href, children, className = '' }: { to?: string; href?: string; children: ReactNode; className?: string }) {
  const cls = `group -my-1.5 inline-flex items-center gap-1.5 py-1.5 text-sm font-medium text-fg transition-colors hover:text-accent ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls}>
        <span className="link-underline">{children}</span>
        <ArrowRightIcon size={ICON.sm} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    );
  }
  return (
    <ExternalLink href={href} className={cls}>
      <span className="link-underline">{children}</span>
      <ArrowUpRightIcon size={ICON.sm} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </ExternalLink>
  );
}

/** Section heading: one specific headline, optional supporting line, optional link aligned to the baseline. */
export function SectionHeading({
  title,
  description,
  action,
  id,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div className="max-w-2xl">
        <h2 id={id} className="text-heading">
          {title}
        </h2>
        {description && <p className="mt-3 text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/**
 * Image with a loading state: shimmer placeholder until decoded, then a short fade-in.
 * Dimensions are fixed by the wrapper's aspect ratio, so nothing shifts when it loads.
 */
export function ProjectImage({
  className = '',
  imgClassName = '',
  ...img
}: ComponentProps<'img'> & { imgClassName?: string }) {
  const [loaded, setLoaded] = useState(false);
  // Cached images can finish before React attaches onLoad, so check on mount too.
  const ref = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <div className={`relative overflow-hidden ${loaded ? 'bg-surface' : 'img-loading'} ${className}`} aria-busy={!loaded || undefined}>
      <img
        ref={ref}
        {...img}
        onLoad={() => setLoaded(true)}
        className={`size-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
    </div>
  );
}
