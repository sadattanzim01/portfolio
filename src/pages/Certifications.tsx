import { Link } from 'react-router';
import { Container } from '../components/Container';
import { EmptyState } from '../components/EmptyState';
import { ExternalLink } from '../components/ExternalLink';
import { ArrowUpRightIcon, AwardIcon } from '../components/icons';
import { PageHeader } from '../components/PageHeader';
import { RevealGroup, RevealItem } from '../components/Reveal';
import { certifications } from '../lib/content';
import { formatMonth } from '../lib/format';

export default function Certifications() {

  return (
    <Container className="pb-24">
      <PageHeader eyebrow="Certifications" title="Certifications.">
        Courses and credentials I've completed.
      </PageHeader>

      {certifications.length === 0 ? (
        <EmptyState icon={<AwardIcon size={20} />} title="Certifications coming soon">
          I'm working on a few right now. Check back soon, or see my{' '}
          <Link to="/projects" className="text-accent underline underline-offset-4 hover:decoration-2">
            projects
          </Link>{' '}
          in the meantime.
        </EmptyState>
      ) : (
        <RevealGroup className="grid gap-4 sm:grid-cols-2">
          {certifications.map((c) => (
            <RevealItem key={`${c.name}-${c.date}`} className="flex flex-col rounded-2xl border border-line bg-elevated p-6 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-accent">
                  <AwardIcon size={18} />
                </div>
                <time dateTime={c.date} className="font-mono text-xs text-muted">
                  {formatMonth(c.date)}
                </time>
              </div>
              <h2 className="mt-5 text-lg font-semibold tracking-tight">{c.name}</h2>
              <p className="mt-1 text-sm text-muted">{c.issuer}</p>
              {c.credentialId && <p className="mt-3 font-mono text-xs text-subtle">ID: {c.credentialId}</p>}
              {c.credentialUrl && (
                <ExternalLink href={c.credentialUrl} className="link-underline mt-auto inline-flex items-center gap-1 self-start pt-5 text-sm text-accent">
                  Verify credential <ArrowUpRightIcon size={14} />
                </ExternalLink>
              )}
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </Container>
  );
}
