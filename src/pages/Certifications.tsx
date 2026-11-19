import { Link } from 'react-router';
import { Container } from '../components/Container';
import { EmptyState } from '../components/EmptyState';
import { AwardIcon } from '../components/icons';
import { ICON, TextLink } from '../components/ui';
import { PageHeader } from '../components/PageHeader';
import { RevealGroup, RevealItem } from '../components/Reveal';
import { certifications } from '../lib/content';
import { formatMonth } from '../lib/format';

export default function Certifications() {

  return (
    <Container className="pb-24">
      <PageHeader title="Certifications and completed courses">
        Verified credentials, with links to check each one.
      </PageHeader>

      {certifications.length === 0 ? (
        <EmptyState icon={<AwardIcon size={ICON.lg} />} title="Certifications coming soon">
          I'm working on a few right now. Check back soon, or see my{' '}
          <Link to="/projects" className="text-accent underline underline-offset-4 hover:decoration-2">
            projects
          </Link>{' '}
          in the meantime.
        </EmptyState>
      ) : (
        <RevealGroup className="grid gap-4 sm:grid-cols-2">
          {certifications.map((c) => (
            <RevealItem key={`${c.name}-${c.date}`} className="card flex flex-col p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <AwardIcon size={ICON.lg} />
                </div>
                <time dateTime={c.date} className="text-sm text-muted tabular-nums">
                  {formatMonth(c.date)}
                </time>
              </div>
              <h2 className="mt-5 text-lg font-semibold tracking-tight">{c.name}</h2>
              <p className="mt-1 text-sm text-muted">{c.issuer}</p>
              {c.credentialId && <p className="mt-3 text-xs text-muted tabular-nums">ID {c.credentialId}</p>}
              {c.credentialUrl && (
                <TextLink href={c.credentialUrl} className="mt-auto self-start pt-5">
                  Verify credential
                </TextLink>
              )}
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </Container>
  );
}
