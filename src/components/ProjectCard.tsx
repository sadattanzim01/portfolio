import { Link } from 'react-router';
import type { Project } from '../content/types';
import { PROJECT_TYPE_LABEL } from '../lib/content';
import { formatMonth } from '../lib/format';
import { trackSpotlight } from '../lib/hooks';
import { CARD_SIZES, srcSetOf } from '../lib/images';
import { ExternalLink } from './ExternalLink';
import { ArrowUpRightIcon, AwardIcon, GitHubIcon } from './icons';
import { TagList } from './Tag';

export function InProgressBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-line bg-bg/85 px-2.5 py-1 text-xs font-medium text-fg backdrop-blur ${className}`}
    >
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-accent" />
      </span>
      In progress
    </span>
  );
}

/**
 * The whole card opens the detail page via a stretched title link (its ::after covers the card).
 * GitHub / demo links sit above that layer (relative z-10), so there are no nested anchors.
 */
export function ProjectCard({
  project,
  headingLevel = 3,
  priority = false,
}: {
  project: Project;
  /** Keep the page outline sequential: 2 when the card list sits directly under the h1. */
  headingLevel?: 2 | 3;
  /** Above-the-fold cards load their image eagerly (the first one at high priority). */
  priority?: boolean | 'high';
}) {
  const { repo, live } = project.links;
  const Heading = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <article
      onMouseMove={trackSpotlight}
      className="spotlight group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-elevated shadow-card transition-[border-color,transform,box-shadow] duration-300 focus-within:border-accent/50 hover:-translate-y-1 hover:border-accent/50 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-surface">
        <img
          src={project.image.small ?? project.image.src}
          srcSet={srcSetOf(project.image)}
          sizes={CARD_SIZES}
          alt={project.image.alt}
          width={1600}
          height={900}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority === 'high' ? 'high' : 'auto'}
          decoding="async"
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        {project.status === 'in-progress' && <InProgressBadge className="absolute left-3 top-3" />}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3 font-mono text-xs text-muted">
          <span className="flex items-center gap-2">
            <span className={`size-1.5 rounded-full ${project.type === 'hackathon' ? 'bg-amber-500' : 'bg-accent'}`} aria-hidden="true" />
            {PROJECT_TYPE_LABEL[project.type]}
            {(project.context || project.event) && <span className="text-subtle">· {project.context ?? project.event}</span>}
          </span>
          <time dateTime={project.date}>{formatMonth(project.date)}</time>
        </div>

        <Heading className="mt-4 text-xl font-semibold tracking-tight">
          <Link
            to={`/projects/${project.slug}`}
            data-cursor="view"
            className="flex items-start justify-between gap-3 after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent"
          >
            {project.title}
            <ArrowUpRightIcon
              size={18}
              className="mt-1 shrink-0 text-subtle transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            />
          </Link>
        </Heading>
        <p className="mt-2 leading-relaxed text-muted text-pretty">{project.tagline}</p>

        {project.award && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-accent">
            <AwardIcon size={15} /> {project.award}
          </p>
        )}

        <TagList items={project.tech.slice(0, 5)} className="mt-auto pt-6" />

        {(repo || live) && (
          <div className="relative z-10 mt-5 flex items-center gap-4 border-t border-line pt-4 text-sm">
            {repo && (
              <ExternalLink
                href={repo}
                className="-my-1.5 inline-flex items-center gap-1.5 py-1.5 text-muted transition-colors hover:text-fg"
                aria-label={`${project.title} source code on GitHub`}
              >
                <GitHubIcon size={15} /> GitHub
              </ExternalLink>
            )}
            {live && (
              <ExternalLink
                href={live}
                className="-my-1.5 inline-flex items-center gap-1.5 py-1.5 text-muted transition-colors hover:text-accent"
                aria-label={`${project.title} live demo`}
              >
                <ArrowUpRightIcon size={15} /> Live demo
              </ExternalLink>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
