import { Link } from 'react-router';
import { motion } from 'motion/react';
import { site } from '../content/site';
import { emails } from '../content/socials';
import { Container } from '../components/Container';
import { ExternalLink } from '../components/ExternalLink';
import { ArrowRightIcon, MailIcon, ResumeIcon } from '../components/icons';
import { ProjectCard } from '../components/ProjectCard';
import { Reveal, RevealGroup, RevealItem } from '../components/Reveal';
import { experience, featuredProjects } from '../lib/content';
import { formatRange } from '../lib/format';
import { ease, fadeUp, stagger } from '../lib/motion';
import { useSection } from '../lib/sections';

export default function Home() {
  const current = experience.filter((e) => e.end === 'present');
  const introRef = useSection<HTMLElement>('Intro');
  const workRef = useSection<HTMLElement>('Selected work');
  const experienceRef = useSection<HTMLElement>('Experience');
  const contactRef = useSection<HTMLElement>('Contact');

  return (
    <>
      {/* Hero */}
      <section ref={introRef} className="relative overflow-hidden">
        <div className="bg-dots pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="bg-glow pointer-events-none absolute -top-56 left-1/2 h-[640px] w-[1100px] -translate-x-1/2" aria-hidden="true" />
        <Container className="relative grid gap-12 pb-20 pt-16 sm:pb-28 sm:pt-24 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <motion.div initial="hidden" animate="show" variants={stagger(0.05)}>
            {site.status && (
              <motion.p
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-elevated/70 px-3 py-1 text-xs text-muted backdrop-blur"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                {site.status}
              </motion.p>
            )}
            <motion.p variants={fadeUp} className="eyebrow mt-8">
              {site.role} · {site.location}
            </motion.p>
            <motion.h1 variants={fadeUp} className="mt-3 text-5xl font-semibold tracking-tighter sm:text-7xl lg:text-8xl">
              {site.name}
              <span className="text-accent">.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-xl leading-relaxed text-muted text-pretty sm:text-2xl">
              {site.headline}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-3">
              <Link to="/projects" data-magnetic className="btn btn-primary group">
                View projects
                <ArrowRightIcon size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <ExternalLink href={site.resume} className="btn btn-ghost">
                <ResumeIcon size={16} /> Resume
              </ExternalLink>
              <a href={`mailto:${emails[0]}`} className="btn btn-ghost">
                <MailIcon size={16} /> Email
              </a>
            </motion.div>
          </motion.div>

          {current.length > 0 && (
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease }}
              className="rounded-2xl border border-line bg-elevated/80 p-6 shadow-card backdrop-blur"
              aria-label="Currently"
            >
              <p className="eyebrow">Currently</p>
              <ul className="mt-4 space-y-4">
                {current.map((e) => (
                  <li key={e.company} className="border-l-2 border-line pl-4 transition-colors hover:border-accent">
                    <p className="font-medium">{e.role}</p>
                    <p className="text-sm text-muted">{e.company}</p>
                  </li>
                ))}
              </ul>
            </motion.aside>
          )}
        </Container>
      </section>

      {/* Selected work: inverted band (light in dark mode, dark in light mode) */}
      {featuredProjects.length > 0 && (
        <section ref={workRef} className="theme-invert bg-bg py-20 text-fg sm:py-28">
          <Container>
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">
                  <span className="text-accent">/</span> Selected work
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Things I've built</h2>
              </div>
              <Link to="/projects" className="link-underline group -my-1.5 inline-flex items-center gap-1.5 py-1.5 text-sm font-medium">
                All projects <ArrowRightIcon size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
            <RevealGroup className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((p) => (
                <RevealItem key={p.slug}>
                  <ProjectCard project={p} />
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </section>
      )}

      {/* Experience snapshot */}
      <section ref={experienceRef} className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <Reveal>
            <p className="eyebrow">
              <span className="text-accent">/</span> Experience
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Where I've worked</h2>
            <Link to="/experience" className="link-underline group mt-4.5 inline-flex items-center gap-1.5 py-1.5 text-sm font-medium">
              Full experience <ArrowRightIcon size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
          <RevealGroup className="divide-y divide-line border-y border-line">
            {experience.map((e) => (
              <RevealItem key={`${e.company}-${e.start}`}>
                <Link
                  to="/experience"
                  className="group grid gap-1 py-5 transition-colors sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6"
                >
                  <div>
                    <p className="font-medium transition-colors group-hover:text-accent">{e.company}</p>
                    <p className="text-sm text-muted">{e.role}</p>
                  </div>
                  <p className="font-mono text-xs text-subtle">{formatRange(e.start, e.end)}</p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Contact CTA */}
      <section ref={contactRef} className="pb-24">
        <Container>
          <Reveal className="theme-invert relative overflow-hidden rounded-3xl bg-bg px-6 py-14 text-fg sm:px-14 sm:py-20">
            <div className="bg-dots pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
            <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <p className="eyebrow">
                  <span className="text-accent">/</span> Contact
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
                  Open to internships and interesting problems.
                </h2>
              </div>
              <Link to="/contact" data-magnetic className="btn btn-primary group shrink-0">
                Get in touch <ArrowRightIcon size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
