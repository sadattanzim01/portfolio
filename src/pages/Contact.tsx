import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { site } from '../content/site';
import { emails, socials } from '../content/socials';
import { Container } from '../components/Container';
import { ExternalLink } from '../components/ExternalLink';
import { ArrowUpRightIcon, CheckIcon, CopyIcon, MailIcon, ResumeIcon, SOCIAL_ICONS } from '../components/icons';
import { PageHeader } from '../components/PageHeader';
import { ICON } from '../components/ui';
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
      className={`relative z-10 inline-flex h-9 shrink-0 items-center gap-1.5 overflow-hidden rounded-full border px-3 text-sm font-medium transition-[border-color,color,background-color,scale] duration-200 active:scale-95 ${
        copied ? 'border-transparent bg-accent-soft text-accent' : 'border-line text-muted hover:border-subtle hover:text-fg'
      }`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? 'check' : 'copy'}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="inline-flex items-center gap-1.5"
        >
          {copied ? <CheckIcon size={ICON.sm} /> : <CopyIcon size={ICON.sm} />}
          {copied ? 'Copied' : 'Copy'}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </button>
  );
}

const cardClass =
  'spotlight card group flex items-center gap-4 p-5 transition-[border-color,box-shadow] duration-300 hover:border-accent/50 hover:shadow-card-hover sm:p-6';
const iconClass = 'grid size-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent';

export default function Contact() {

  return (
    <Container className="pb-24">
      <PageHeader title="Get in touch about internships or projects">
        I'm open to software and machine learning internships, and to collaborating on AI tooling. Email is the fastest way
        to reach me.
      </PageHeader>

      <RevealGroup className="grid max-w-3xl grid-cols-[minmax(0,1fr)] gap-4">
        {emails.map(({ address: email, label }) => (
          <RevealItem key={email} onMouseMove={trackSpotlight} className={cardClass}>
            <div className={iconClass}>
              <MailIcon size={ICON.lg} />
            </div>
            <a href={`mailto:${email}`} className="min-w-0 flex-1 after:absolute after:inset-0 after:rounded-card">
              <p className="label">{label}</p>
              <p className="mt-0.5 truncate text-lg font-medium transition-colors group-hover:text-accent sm:text-xl">{email}</p>
            </a>
            <CopyButton value={email} />
          </RevealItem>
        ))}

        {socials.map((s) => {
          const Icon = SOCIAL_ICONS[s.icon];
          return (
            <RevealItem key={s.label} onMouseMove={trackSpotlight} className={cardClass}>
              <div className={iconClass}>
                <Icon size={ICON.lg} />
              </div>
              <ExternalLink href={s.href} className="min-w-0 flex-1 after:absolute after:inset-0 after:rounded-card">
                <p className="label">{s.label}</p>
                <p className="mt-0.5 truncate text-lg font-medium transition-colors group-hover:text-accent sm:text-xl">{s.handle}</p>
              </ExternalLink>
              <ArrowUpRightIcon size={ICON.lg} className="shrink-0 text-subtle transition-[translate,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </RevealItem>
          );
        })}

        <RevealItem onMouseMove={trackSpotlight} className={cardClass}>
          <div className={iconClass}>
            <ResumeIcon size={ICON.lg} />
          </div>
          <ExternalLink href={site.resume} className="min-w-0 flex-1 after:absolute after:inset-0 after:rounded-card">
            <p className="label">Resume</p>
            <p className="mt-0.5 truncate text-lg font-medium transition-colors group-hover:text-accent sm:text-xl">View PDF</p>
          </ExternalLink>
          <ArrowUpRightIcon size={ICON.lg} className="shrink-0 text-subtle transition-[translate,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </RevealItem>
      </RevealGroup>
    </Container>
  );
}
