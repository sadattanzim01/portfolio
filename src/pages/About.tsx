import { site, education, skills } from '../content/site';
import { Container } from '../components/Container';
import { ExternalLink } from '../components/ExternalLink';
import { ResumeIcon } from '../components/icons';
import { ICON } from '../components/ui';
import { PageHeader } from '../components/PageHeader';
import { Reveal, RevealGroup, RevealItem } from '../components/Reveal';
import { Tag } from '../components/Tag';
import { formatRange } from '../lib/format';
import { useSection } from '../lib/sections';

export default function About() {
  const aboutRef = useSection<HTMLDivElement>('About');
  const educationRef = useSection<HTMLDivElement>('Education');
  const toolkitRef = useSection<HTMLElement>('Toolkit');

  return (
    <Container className="pb-24">
      <PageHeader title="I'm Sadat. I turn slow, manual work into software.">
        Computer Science (Honours) student at the University of Windsor, based in {site.location}.
      </PageHeader>

      <div ref={aboutRef} className="grid gap-16 lg:grid-cols-[1.6fr_1fr]">
        <Reveal className="space-y-6 text-lg leading-relaxed text-muted text-pretty">
          {site.about.map((paragraph, i) => (
            <p key={i} className={i === 0 ? 'text-fg' : undefined}>
              {paragraph}
            </p>
          ))}
          <ExternalLink href={site.resume} className="btn btn-secondary !mt-10">
            <ResumeIcon size={ICON.md} /> Read my resume
          </ExternalLink>
        </Reveal>

        <Reveal ref={educationRef} delay={0.1}>
          <h2 className="label">Education</h2>
          <ul className="mt-3 space-y-4">
            {education.map((ed) => (
              <li key={ed.school} className="card p-6">
                <p className="font-semibold tracking-tight">{ed.school}</p>
                <p className="mt-1 text-sm text-muted">{ed.degree}</p>
                <p className="mt-4 text-sm text-muted tabular-nums">
                  {formatRange(ed.start, ed.end)} · {ed.location}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <section ref={toolkitRef} className="mt-24" aria-labelledby="skills-heading">
        <Reveal>
          <h2 id="skills-heading" className="text-heading">
            Languages, frameworks, and tools I use
          </h2>
        </Reveal>
        <RevealGroup className="mt-10 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
          {skills.map((group) => (
            <RevealItem key={group.label} className="bg-bg p-6">
              <h3 className="label">{group.label}</h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </Container>
  );
}
