import { Link } from 'react-router';
import type { Project } from '../content/types';
import { formatMonth } from '../lib/format';
import { trackSpotlight } from '../lib/hooks';
import { CARD_SIZES, FEATURE_SIZES, srcSetOf } from '../lib/images';
import { ExternalLink } from './ExternalLink';
import { ArrowRightIcon, ArrowUpRightIcon, AwardIcon, GitHubIcon } from './icons';
import { TagList } from './Tag';
import { Badge, ICON, ProjectImage } from './ui';

export function InProgressBadge({ className = '' }: { className?: string }) {
  return (
    <Badge className={className}>
      <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
      In progress
    </Badge>
  );
}

/** Badges only for facts that set a project apart; "Personal" is the default, so it isn't labelled. */
export function ProjectBadges({ project }: { project: Project }) {
  const items = [
    project.type === 'hackathon' && (project.event ? `Hackathon · ${project.event}` : 'Hackathon'),
    project.context,
  ].filter(Boolean) as string[];
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <Badge key={t} tone="accent">
          {t}
        </Badge>
      ))}
    </div>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  const { repo, live } = project.links;
  if (!repo && !live) return null;
  return (
    <div className="relative z-10 flex items-center gap-5 text-sm">
      {live && (
        <ExternalLink
          href={live}
          className="-my-1.5 inline-flex items-center gap-1.5 py-1.5 font-medium text-accent transition-colors hover:text-fg"
          aria-label={`${project.title} live demo`}
        >
          Live demo <ArrowUpRightIcon size={ICON.sm} />
        </ExternalLink>
      )}
      {repo && (
        <ExternalLink
          href={repo}
          className="-my-1.5 inline-flex items-center gap-1.5 py-1.5 text-muted transition-colors hover:text-fg"
          aria-label={`${project.title} source code on GitHub`}
        >
          <GitHubIcon size={ICON.sm} /> Code
        </ExternalLink>
      )}
    </div>
  );
}

/**
 * The whole card opens the detail page via a stretched title link (its ::after covers the card).
 * Demo / code links sit above that layer (relative z-10), so there are no nested anchors.
 *
 * `variant="feature"`: the lead project, with a large screenshot beside the text (stacked on mobile).
 */
export function ProjectCard({
  project,
  headingLevel = 3,
  priority = false,
  variant = 'default',
}: {
  project: Project;
  /** Keep the page outline sequential: 2 when the card list sits directly under the h1. */
  headingLevel?: 2 | 3;
  /** Above-the-fold cards load their image eagerly (the first one at high priority). */
  priority?: boolean | 'high';
  variant?: 'default' | 'feature';
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const feature = variant === 'feature';

  return (
    <article
      onMouseMove={trackSpotlight}
      className={`spotlight card group relative flex h-full overflow-hidden transition-[border-color,translate,box-shadow] duration-300 focus-within:border-accent/60 hover:-translate-y-1 hover:border-accent/60 hover:shadow-card-hover ${
        feature ? 'flex-col lg:grid lg:grid-cols-[1.45fr_1fr]' : 'flex-col'
      }`}
    >
      <div className={`relative ${feature ? 'border-b border-line lg:border-b-0 lg:border-r' : 'border-b border-line'}`}>
        <ProjectImage
          src={project.image.small ?? project.image.src}
          srcSet={srcSetOf(project.image)}
          sizes={feature ? FEATURE_SIZES : CARD_SIZES}
          alt={project.image.alt}
          width={1600}
          height={900}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority === 'high' ? 'high' : 'auto'}
          decoding="async"
          className={feature ? 'aspect-[16/9] lg:aspect-auto lg:h-full' : 'aspect-[16/9]'}
        />
        {project.status === 'in-progress' && <InProgressBadge className="absolute left-3 top-3" />}
      </div>

      <div className={`flex flex-1 flex-col ${feature ? 'p-6 sm:p-8 lg:p-10' : 'p-6'}`}>
        {/* Group 1: what it is */}
        <div className="flex items-start justify-between gap-4">
          <ProjectBadges project={project} />
          <time dateTime={project.date} className="ml-auto shrink-0 text-xs text-muted tabular-nums">
            {formatMonth(project.date)}
          </time>
        </div>

        <Heading className={`${feature ? 'mt-5 text-heading' : 'mt-4 text-xl font-semibold tracking-tight'}`}>
          <Link
            to={`/projects/${project.slug}`}
            data-cursor="card"
            className="flex items-start justify-between gap-3 after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent"
          >
            {project.title}
            <ArrowRightIcon
              size={feature ? ICON.lg : ICON.md}
              className={`shrink-0 text-subtle transition-[translate,color] duration-200 group-hover:translate-x-0.5 group-hover:text-accent ${feature ? 'mt-2.5' : 'mt-1.5'}`}
            />
          </Link>
        </Heading>
        <p className={`mt-2 text-muted ${feature ? 'text-lead' : 'leading-relaxed'}`}>{project.tagline}</p>

        {project.award && (
          <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-accent">
            <AwardIcon size={ICON.sm} /> {project.award}
          </p>
        )}

        {/* Group 2: how it's built, then where to see it */}
        <div className="mt-auto pt-8">
          <TagList items={project.tech.slice(0, feature ? 7 : 4)} />
          <div className="mt-5">
            <ProjectLinks project={project} />
          </div>
        </div>
      </div>
    </article>
  );
}
