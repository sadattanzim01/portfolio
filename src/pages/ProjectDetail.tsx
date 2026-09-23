import type { JSX, ReactNode, Ref } from 'react';
import { Link, useParams } from 'react-router';
import { motion } from 'motion/react';
import { Container } from '../components/Container';
import { ExternalLink } from '../components/ExternalLink';
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon, AwardIcon, CheckIcon, GitHubIcon } from '../components/icons';
import { InProgressBadge } from '../components/ProjectCard';
import { Reveal } from '../components/Reveal';
import { TagList } from '../components/Tag';
import { getProject, PROJECT_TYPE_LABEL, projects } from '../lib/content';
import { formatMonth } from '../lib/format';
import { HERO_SIZES, srcSetOf } from '../lib/images';
import { useSection } from '../lib/sections';
import { ease, fadeUp, stagger } from '../lib/motion';
import NotFound from './NotFound';

function StorySection({
  index,
  title,
  sectionRef,
  children,
}: {
  index: string;
  title: string;
  sectionRef: Ref<HTMLElement>;
  children: ReactNode;
}) {
  return (
    <section ref={sectionRef} aria-labelledby={`story-${index}`} className="border-t border-line py-10 first:border-t-0 first:pt-0">
      <Reveal>
        <h2 id={`story-${index}`} className="flex items-baseline gap-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          <span className="font-mono text-sm font-normal text-accent">{index}</span>
          {title}
        </h2>
        <div className="mt-5">{children}</div>
      </Reveal>
    </section>
  );
}

export default function ProjectDetail() {
  const { slug = '' } = useParams();
  const project = getProject(slug);
  const problemRef = useSection<HTMLElement>('Problem');
  const approachRef = useSection<HTMLElement>('Approach');
  const resultRef = useSection<HTMLElement>('Result');

  if (!project) return <NotFound />;

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  const meta = [
    { label: 'Type', value: PROJECT_TYPE_LABEL[project.type] },
    project.status === 'in-progress' && { label: 'Status', value: 'In progress' },
    project.context && { label: 'Context', value: project.context },
    project.event && { label: 'Event', value: project.event },
    project.role && { label: 'Role', value: project.role },
    { label: 'Date', value: formatMonth(project.date) },
  ].filter((m): m is { label: string; value: string } => Boolean(m));

  const links = [
    project.links.live && { href: project.links.live, label: 'Live demo', icon: <ArrowUpRightIcon size={16} /> },
    project.links.repo && { href: project.links.repo, label: 'View on GitHub', icon: <GitHubIcon size={16} /> },
    project.links.devpost && { href: project.links.devpost, label: 'Devpost', icon: <ArrowUpRightIcon size={16} /> },
  ].filter((l): l is { href: string; label: string; icon: JSX.Element } => Boolean(l));

  return (
    <Container className="pb-24">
      <div className="pt-10 sm:pt-14">
        <Link to="/projects" className="group -my-1.5 inline-flex items-center gap-1.5 py-1.5 text-sm text-muted transition-colors hover:text-fg">
          <ArrowLeftIcon size={15} className="transition-transform group-hover:-translate-x-0.5" /> All projects
        </Link>
      </div>

      <motion.header initial="hidden" animate="show" variants={stagger(0.05)} className="max-w-3xl pb-10 pt-8">
        <motion.p variants={fadeUp} className="eyebrow">
          <span className="text-accent">/</span> {PROJECT_TYPE_LABEL[project.type]} project
          {project.context && <> · {project.context}</>}
        </motion.p>
        <motion.h1 variants={fadeUp} className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {project.title}
        </motion.h1>
        {project.status === 'in-progress' && (
          <motion.div variants={fadeUp} className="mt-4">
            <InProgressBadge />
          </motion.div>
        )}
        <motion.p variants={fadeUp} className="mt-5 text-xl leading-relaxed text-muted text-pretty">
          {project.tagline}
        </motion.p>
        {project.award && (
          <motion.p
            variants={fadeUp}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-3 py-1 text-sm text-accent"
          >
            <AwardIcon size={15} /> {project.award}
          </motion.p>
        )}
        {links.length > 0 && (
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            {links.map((l, i) => (
              <ExternalLink
                key={l.href}
                href={l.href}
                data-magnetic={i === 0 ? '' : undefined}
                className={`btn ${i === 0 ? 'btn-primary' : 'btn-ghost'}`}
              >
                {l.icon}
                {l.label}
              </ExternalLink>
            ))}
          </motion.div>
        )}
      </motion.header>

      <motion.figure
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1, ease } }}
        className="overflow-hidden rounded-2xl border border-line bg-surface"
      >
        <img
          src={project.image.src}
          srcSet={srcSetOf(project.image)}
          sizes={HERO_SIZES}
          alt={project.image.alt}
          width={1600}
          height={900}
          decoding="async"
          fetchPriority="high"
          className="aspect-[16/9] w-full object-cover"
        />
      </motion.figure>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
        <div className="max-w-2xl">
          <StorySection index="01" title="Problem" sectionRef={problemRef}>
            <div className="space-y-4 text-lg leading-relaxed text-pretty">
              {project.problem.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </StorySection>

          <StorySection index="02" title="Approach" sectionRef={approachRef}>
            <ol className="space-y-4">
              {project.approach.map((step, i) => (
                <li key={step} className="flex gap-4 leading-relaxed text-muted">
                  <span className="mt-0.5 font-mono text-xs leading-6 text-subtle">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-pretty" data-cursor="text">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </StorySection>

          <StorySection index="03" title="Result" sectionRef={resultRef}>
            {project.result.length === 0 && (
              <p className="rounded-2xl border border-dashed border-line px-5 py-4 text-muted">
                {project.status === 'in-progress'
                  ? 'This project is still being built. Results will be added here once it ships.'
                  : 'Results coming soon.'}
              </p>
            )}
            {project.result.length > 0 && (
            <ul className="space-y-3">
              {project.result.map((r) => (
                <li key={r} className="flex gap-3 leading-relaxed">
                  <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                    <CheckIcon size={12} />
                  </span>
                  <span className="text-pretty" data-cursor="text">
                    {r}
                  </span>
                </li>
              ))}
            </ul>
            )}
          </StorySection>
        </div>

        <Reveal delay={0.1} className="lg:sticky lg:top-24 lg:self-start">
          <dl className="divide-y divide-line rounded-2xl border border-line bg-elevated shadow-card">
            {meta.map((m) => (
              <div key={m.label} className="flex items-baseline justify-between gap-4 px-5 py-3.5 text-sm">
                <dt className="text-muted">{m.label}</dt>
                <dd className="text-right font-medium">{m.value}</dd>
              </div>
            ))}
            <div className="px-5 py-4">
              <dt className="text-sm text-muted">Stack</dt>
              <dd>
                <TagList items={project.tech} className="mt-3" />
              </dd>
            </div>
            {links.length > 0 && (
              <div className="px-5 py-4">
                <dt className="sr-only">Links</dt>
                <dd className="flex flex-col gap-0.5 text-sm">
                  {links.map((l) => (
                    <ExternalLink key={l.href} href={l.href} className="group inline-flex items-center gap-2 py-1 text-muted transition-colors hover:text-accent">
                      {l.icon}
                      <span className="link-underline">{l.label}</span>
                    </ExternalLink>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </Reveal>
      </div>

      {next && next !== project && (
        <Reveal className="mt-24">
          <Link
            to={`/projects/${next.slug}`}
            data-cursor="view"
            data-cursor-label="Next"
            className="group flex items-center gap-5 rounded-2xl border border-line p-4 transition-colors hover:border-accent/60 sm:gap-8 sm:p-5"
          >
            <img
              src={next.image.small ?? next.image.src}
              srcSet={srcSetOf(next.image)}
              sizes="160px"
              alt=""
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
              className="hidden aspect-[16/9] w-40 shrink-0 rounded-lg border border-line object-cover sm:block"
            />
            <div className="min-w-0 flex-1">
              <p className="eyebrow">Next project</p>
              <p className="mt-2 truncate text-2xl font-semibold tracking-tight transition-colors group-hover:text-accent sm:text-3xl">
                {next.title}
              </p>
            </div>
            <ArrowRightIcon size={24} className="mr-2 shrink-0 text-muted transition-all group-hover:translate-x-1 group-hover:text-accent" />
          </Link>
        </Reveal>
      )}
    </Container>
  );
}
