import { Link } from 'react-router';
import { motion } from 'motion/react';
import { site } from '../content/site';
import { emails } from '../content/socials';
import { Container } from '../components/Container';
import { ExternalLink } from '../components/ExternalLink';
import { ArrowRightIcon, ResumeIcon } from '../components/icons';
import { ProjectCard } from '../components/ProjectCard';
import { Reveal, RevealGroup, RevealItem } from '../components/Reveal';
import { ICON, SectionHeading, TextLink } from '../components/ui';
import { experience, featuredProjects, projects } from '../lib/content';
import { formatRange } from '../lib/format';
import { ease, fadeUp, stagger } from '../lib/motion';
import { useSection } from '../lib/sections';

export default function Home() {
  const current = experience.filter((e) => e.end === 'present');
  const [lead, ...rest] = featuredProjects;
  const introRef = useSection<HTMLElement>('Intro');
  const workRef = useSection<HTMLElement>('Selected work');
  const experienceRef = useSection<HTMLElement>('Experience');
  const contactRef = useSection<HTMLElement>('Contact');

  return (
    <>
      {/* Hero */}
      <section ref={introRef} className="relative overflow-hidden">
        <div className="bg-glow pointer-events-none absolute -top-56 left-1/2 h-[640px] w-[1100px] -translate-x-1/2" aria-hidden="true" />
        <Container className="relative grid gap-14 pb-24 pt-16 sm:pb-32 sm:pt-24 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <motion.div initial="hidden" animate="show" variants={stagger(0.05)}>
            <motion.p variants={fadeUp} className="label">
              {site.role} · {site.location}
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-display mt-4">
              {site.name}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lead mt-6 max-w-xl sm:text-2xl">
              {site.headline}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-4">
              <Link to="/projects" data-magnetic className="btn btn-primary btn-lg group">
                View projects
                <ArrowRightIcon size={ICON.md} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <ExternalLink href={site.resume} className="btn btn-secondary btn-lg">
                <ResumeIcon size={ICON.md} /> Resume
              </ExternalLink>
              <a href={`mailto:${emails[0]!.address}`} className="link-underline py-2 text-sm font-medium text-muted transition-colors hover:text-fg sm:ml-2">
                {emails[0]!.address}
              </a>
            </motion.div>
          </motion.div>

          {current.length > 0 && (
            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease }}
              className="card bg-elevated/85 p-6 backdrop-blur"
              aria-labelledby="currently-heading"
            >
              <h2 id="currently-heading" className="label">
                Currently
              </h2>
              <ul className="mt-4 space-y-4">
                {current.map((e) => (
                  <li key={e.company} className="flex gap-3">
                    <span className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <div>
                      <p className="font-medium leading-snug">{e.role}</p>
                      <p className="text-sm text-muted">{e.company}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.aside>
          )}
        </Container>
      </section>

      {/* Selected work: inverted band (Paper in dark mode, Forest in light mode) */}
      {lead && (
        <section ref={workRef} className="theme-invert bg-bg py-24 text-fg sm:py-32" aria-labelledby="work-heading">
          <Container>
            <Reveal>
              <SectionHeading
                id="work-heading"
                title="AI tools and full-stack apps I've shipped"
                description={`${projects.length} projects, from an AI code reviewer to an interplanetary route planner.`}
                action={<TextLink to="/projects">All projects</TextLink>}
              />
            </Reveal>
            <Reveal className="mt-12">
              <ProjectCard project={lead} variant="feature" />
            </Reveal>
            {rest.length > 0 && (
              <RevealGroup className="mt-6 grid gap-6 md:grid-cols-2">
                {rest.map((p) => (
                  <RevealItem key={p.slug}>
                    <ProjectCard project={p} />
                  </RevealItem>
                ))}
              </RevealGroup>
            )}
          </Container>
        </section>
      )}

      {/* Experience snapshot */}
      <section ref={experienceRef} className="py-24 sm:py-32" aria-labelledby="experience-heading">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <Reveal className="space-y-6">
            <SectionHeading id="experience-heading" title="Machine learning, embedded systems, and the web" />
            <TextLink to="/experience">Full experience</TextLink>
          </Reveal>
          <RevealGroup className="divide-y divide-line border-y border-line">
            {experience.map((e) => (
              <RevealItem key={`${e.company}-${e.start}`}>
                <Link
                  to="/experience"
                  className="group grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6"
                >
                  <div>
                    <p className="font-medium transition-colors group-hover:text-accent">{e.company}</p>
                    <p className="text-sm text-muted">{e.role}</p>
                  </div>
                  <p className="text-sm text-muted tabular-nums">{formatRange(e.start, e.end)}</p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Contact CTA */}
      <section ref={contactRef} className="pb-24 sm:pb-32" aria-labelledby="cta-heading">
        <Container>
          <Reveal className="theme-invert rounded-[1.75rem] bg-bg px-6 py-14 text-fg sm:px-14 sm:py-20">
            <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <h2 id="cta-heading" className="text-heading">
                  Open to software and machine learning internships.
                </h2>
                <p className="mt-4 text-muted">Email is the fastest way to reach me.</p>
              </div>
              <Link to="/contact" data-magnetic className="btn btn-primary btn-lg group shrink-0">
                Get in touch
                <ArrowRightIcon size={ICON.md} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
