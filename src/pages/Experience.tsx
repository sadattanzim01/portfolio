import { Container } from '../components/Container';
import { ExternalLink } from '../components/ExternalLink';
import { ArrowUpRightIcon } from '../components/icons';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/Reveal';
import { TagList } from '../components/Tag';
import { experience } from '../lib/content';
import { formatRange } from '../lib/format';
import type { Experience as ExperienceEntry } from '../content/types';
import { useSection } from '../lib/sections';

export default function Experience() {

  return (
    <Container className="pb-24">
      <PageHeader eyebrow="Experience" title="Where I've worked.">
        Internships, engineering teams, and student leadership.
      </PageHeader>

      <ol className="relative border-l border-line">
        {experience.map((e) => (
          <ExperienceItem key={`${e.company}-${e.start}`} e={e} />
        ))}
      </ol>
    </Container>
  );
}

function ExperienceItem({ e }: { e: ExperienceEntry }) {
  const ref = useSection<HTMLLIElement>(e.company);
  return (
    <li ref={ref} className="relative pb-14 pl-8 last:pb-0 sm:pl-12">
      <span
        className={`absolute -left-[5px] top-2 size-[9px] rounded-full ring-4 ring-bg ${
          e.end === 'present' ? 'bg-accent' : 'bg-subtle'
        }`}
        aria-hidden="true"
      />
      <Reveal className="grid gap-4 lg:grid-cols-[220px_1fr] lg:gap-10">
        <div className="font-mono text-xs leading-6 text-muted">
          <p>{formatRange(e.start, e.end)}</p>
          <p className="text-subtle">{e.location}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{e.role}</h2>
          <p className="mt-1 text-accent">
            {e.url ? (
              <ExternalLink href={e.url} className="link-underline inline-flex items-center gap-1">
                {e.company} <ArrowUpRightIcon size={14} />
              </ExternalLink>
            ) : (
              e.company
            )}
          </p>
          <ul className="mt-5 space-y-2.5 text-muted">
            {e.highlights.map((h) => (
              <li key={h} className="flex gap-3 leading-relaxed">
                <span className="mt-2.5 h-px w-3 shrink-0 bg-subtle" aria-hidden="true" />
                <span className="text-pretty" data-cursor="text">{h}</span>
              </li>
            ))}
          </ul>
          {e.tech && <TagList items={e.tech} className="mt-5" />}
        </div>
      </Reveal>
    </li>
  );
}
