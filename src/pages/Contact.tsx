import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { site } from '../content/site';
import { emails, socials } from '../content/socials';
import { Container } from '../components/Container';
import { ExternalLink } from '../components/ExternalLink';
import { ArrowUpRightIcon, CheckIcon, CopyIcon, MailIcon, ResumeIcon, SOCIAL_ICONS } from '../components/icons';
import { PageHeader } from '../components/PageHeader';
import { RevealGroup, RevealItem } from '../components/Reveal';
import { trackSpotlight } from '../lib/hooks';

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked; the mailto link still works.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Copied' : `Copy ${value}`}
      title="Copy address"
      className="relative z-10 grid size-9 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? 'check' : 'copy'}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={copied ? 'text-accent' : undefined}
        >
          {copied ? <CheckIcon size={15} /> : <CopyIcon size={15} />}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </button>
  );
}

const cardClass =
  'spotlight group flex items-center gap-4 rounded-2xl border border-line bg-elevated p-5 shadow-card transition-[border-color,box-shadow] duration-300 hover:border-accent/50 hover:shadow-card-hover sm:p-6';

export default function Contact() {

  return (
    <Container className="pb-24">
      <PageHeader eyebrow="Contact" title="Let's talk.">
        I'm open to internships, collaborations, and conversations about AI tooling and software engineering. Email is the
        fastest way to reach me.
      </PageHeader>

      <RevealGroup className="grid max-w-3xl grid-cols-[minmax(0,1fr)] gap-4">
        {emails.map((email, i) => (
          <RevealItem key={email} onMouseMove={trackSpotlight} className={cardClass}>
            <div className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface text-accent">
              <MailIcon size={18} />
            </div>
            <a href={`mailto:${email}`} className="min-w-0 flex-1 after:absolute after:inset-0 after:rounded-2xl">
              <p className="eyebrow">{i === 0 ? 'Email · primary' : 'Email'}</p>
              <p className="mt-1 truncate text-lg font-medium transition-colors group-hover:text-accent sm:text-xl">{email}</p>
            </a>
            <CopyButton value={email} />
          </RevealItem>
        ))}

        {socials.map((s) => {
          const Icon = SOCIAL_ICONS[s.icon];
          return (
            <RevealItem key={s.label} onMouseMove={trackSpotlight} className={cardClass}>
              <div className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface text-accent">
                <Icon size={18} />
              </div>
              <ExternalLink href={s.href} className="min-w-0 flex-1 after:absolute after:inset-0 after:rounded-2xl">
                <p className="eyebrow">{s.label}</p>
                <p className="mt-1 truncate text-lg font-medium transition-colors group-hover:text-accent sm:text-xl">{s.handle}</p>
              </ExternalLink>
              <ArrowUpRightIcon size={20} className="shrink-0 text-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </RevealItem>
          );
        })}

        <RevealItem onMouseMove={trackSpotlight} className={cardClass}>
          <div className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface text-accent">
            <ResumeIcon size={18} />
          </div>
          <ExternalLink href={site.resume} className="min-w-0 flex-1 after:absolute after:inset-0 after:rounded-2xl">
            <p className="eyebrow">Resume</p>
            <p className="mt-1 truncate text-lg font-medium transition-colors group-hover:text-accent sm:text-xl">View PDF</p>
          </ExternalLink>
          <ArrowUpRightIcon size={20} className="shrink-0 text-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </RevealItem>
      </RevealGroup>
    </Container>
  );
}
