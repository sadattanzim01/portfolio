import type { JSX, ReactNode, Ref } from 'react';
import { Link, useParams } from 'react-router';
import { motion } from 'motion/react';
import { Container } from '../components/Container';
import { ExternalLink } from '../components/ExternalLink';
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon, AwardIcon, CheckIcon, GitHubIcon } from '../components/icons';
import { InProgressBadge, ProjectBadges } from '../components/ProjectCard';
import { ICON, ProjectImage, TextLink } from '../components/ui';
import { Reveal } from '../components/Reveal';
import { TagList } from '../components/Tag';
import { getProject, projects } from '../lib/content';
import { formatMonth } from '../lib/format';
import { HERO_SIZES, srcSetOf } from '../lib/images';
import { useSection } from '../lib/sections';
import { ease, fadeUp, stagger } from '../lib/motion';
import NotFound from './NotFound';

function StorySection({
  title,
  sectionRef,
  children,
}: {
  title: string;
  sectionRef: Ref<HTMLElement>;
  children: ReactNode;
}) {
  return (
    <section ref={sectionRef} aria-labelledby={`story-${title}`} className="border-t border-line py-12 first:border-t-0 first:pt-0">
      <Reveal>
        <h2 id={`story-${title}`} className="text-2xl font-semibold tracking-tight sm:text-3xl">
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
    project.status === 'in-progress' && { label: 'Status', value: 'In progress' },
    project.context && { label: 'Context', value: project.context },
    project.event && { label: 'Event', value: project.event },
    project.role && { label: 'Role', value: project.role },
    { label: 'Date', value: formatMonth(project.date) },
  ].filter((m): m is { label: string; value: string } => Boolean(m));

  const links = [
    project.links.live && { href: project.links.live, label: 'Live demo', icon: <ArrowUpRightIcon size={ICON.md} />, trailing: true },
    project.links.repo && { href: project.links.repo, label: 'View code on GitHub', icon: <GitHubIcon size={ICON.md} />, trailing: false },
    project.links.devpost && { href: project.links.devpost, label: 'Devpost', icon: <ArrowUpRightIcon size={ICON.md} />, trailing: true },
  ].filter((l): l is { href: string; label: string; icon: JSX.Element; trailing: boolean } => Boolean(l));

  return (
    <Container className="pb-24">
      <div className="pt-10 sm:pt-14">
        <Link to="/projects" className="group -my-1.5 inline-flex items-center gap-1.5 py-1.5 text-sm font-medium text-muted transition-colors hover:text-fg">
          <ArrowLeftIcon size={ICON.sm} className="transition-transform duration-200 group-hover:-translate-x-0.5" /> All projects
        </Link>
      </div>

      <motion.header initial="hidden" animate="show" variants={stagger(0.05)} className="max-w-3xl pb-10 pt-8">
        {(project.status === 'in-progress' || project.type === 'hackathon' || project.context) && (
          <motion.div variants={fadeUp} className="mb-5 flex flex-wrap items-center gap-1.5">
            {project.status === 'in-progress' && <InProgressBadge />}
            <ProjectBadges project={project} />
          </motion.div>
        )}
        <motion.h1 variants={fadeUp} className="text-title">
          {project.title}
        </motion.h1>
        <motion.p variants={fadeUp} className="text-lead mt-5">
          {project.tagline}
        </motion.p>
        {project.award && (
          <motion.p
            variants={fadeUp}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent"
          >
            <AwardIcon size={ICON.sm} /> {project.award}
          </motion.p>
        )}
        {links.length > 0 && (
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            {links.map((l, i) => (
              <ExternalLink
                key={l.href}
                href={l.href}
                data-magnetic={i === 0 ? '' : undefined}
                className={`btn btn-lg ${i === 0 ? 'btn-primary' : 'btn-secondary'}`}
              >
                {!l.trailing && l.icon}
                {l.label}
                {l.trailing && l.icon}
              </ExternalLink>
            ))}
          </motion.div>
        )}
      </motion.header>

      <motion.figure
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1, ease } }}
        className="overflow-hidden rounded-card border border-line"
      >
        <ProjectImage
          src={project.image.src}
          srcSet={srcSetOf(project.image)}
          sizes={HERO_SIZES}
          alt={project.image.alt}
          width={1600}
          height={900}
          decoding="async"
          fetchPriority="high"
          className="aspect-[16/9] w-full"
        />
      </motion.figure>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
        <div className="max-w-2xl">
          <StorySection title="Problem" sectionRef={problemRef}>
            <div className="space-y-4 text-lg leading-relaxed text-pretty">
              {project.problem.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </StorySection>

          <StorySection title="Approach" sectionRef={approachRef}>
            <ol className="space-y-4">
              {project.approach.map((step, i) => (
                <li key={step} className="flex gap-4 leading-relaxed text-muted">
                  <span className="w-5 shrink-0 text-right font-medium text-fg tabular-nums">{i + 1}.</span>
                  <span className="text-pretty" data-cursor="text">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </StorySection>

          <StorySection title="Result" sectionRef={resultRef}>
            {project.result.length === 0 && (
              <p className="rounded-card border border-dashed border-line px-5 py-4 text-muted">
                {project.status === 'in-progress'
                  ? 'This project is still being built. Results will be added here once it ships.'
                  : 'Results coming soon.'}
              </p>
            )}
            {project.result.length > 0 && (
            <ul className="space-y-3">
              {project.result.map((r) => (
                <li key={r} className="flex gap-3 leading-relaxed">
                  <span className="mt-[0.2em] grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
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
          <dl className="card divide-y divide-line">
            {meta.map((m) => (
              <div key={m.label} className="flex items-baseline justify-between gap-4 px-5 py-3.5 text-sm">
                <dt className="text-muted">{m.label}</dt>
                <dd className="text-right font-medium tabular-nums">{m.value}</dd>
              </div>
            ))}
            <div className="px-5 py-4">
              <dt className="text-sm text-muted">Built with</dt>
              <dd>
                <TagList items={project.tech} className="mt-3" />
              </dd>
            </div>
            {links.length > 0 && (
              <div className="px-5 py-4">
                <dt className="sr-only">Links</dt>
                <dd className="flex flex-col gap-1 text-sm">
                  {links.map((l) => (
                    <TextLink key={l.href} href={l.href} className="!my-0 self-start">
                      {l.label}
                    </TextLink>
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
            data-cursor="card"
            className="card group flex items-center gap-5 p-3 pr-6 transition-[border-color,box-shadow] duration-300 hover:border-accent/50 hover:shadow-card-hover sm:gap-8"
          >
            {/* Inner radius = card radius (20px) − padding (12px) = 8px */}
            <ProjectImage
              src={next.image.small ?? next.image.src}
              srcSet={srcSetOf(next.image)}
              sizes="176px"
              alt=""
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
              className="hidden aspect-[16/9] w-44 shrink-0 rounded-[0.5rem] sm:block"
            />
            <div className="min-w-0 flex-1 py-2 pl-3 sm:pl-0">
              <p className="label">Next project</p>
              <p className="mt-1 truncate text-2xl font-semibold tracking-tight transition-colors group-hover:text-accent sm:text-3xl">
                {next.title}
              </p>
            </div>
            <ArrowRightIcon size={ICON.lg} className="shrink-0 text-subtle transition-[translate,color] duration-200 group-hover:translate-x-1 group-hover:text-accent" />
          </Link>
        </Reveal>
      )}
    </Container>
  );
}
