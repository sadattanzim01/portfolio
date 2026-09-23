import { useSearchParams } from 'react-router';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import type { ProjectType } from '../content/types';
import { Container } from '../components/Container';
import { EmptyState } from '../components/EmptyState';
import { AwardIcon } from '../components/icons';
import { PageHeader } from '../components/PageHeader';
import { ProjectCard } from '../components/ProjectCard';
import { PROJECT_TYPE_LABEL, projects } from '../lib/content';
import { ease } from '../lib/motion';

type Filter = 'all' | ProjectType;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'personal', label: PROJECT_TYPE_LABEL.personal },
  { value: 'hackathon', label: PROJECT_TYPE_LABEL.hackathon },
];

function parseFilter(value: string | null): Filter {
  return value === 'personal' || value === 'hackathon' ? value : 'all';
}

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const filter = parseFilter(params.get('type'));
  const visible = filter === 'all' ? projects : projects.filter((p) => p.type === filter);
  const count = (f: Filter) => (f === 'all' ? projects.length : projects.filter((p) => p.type === f).length);

  return (
    <Container className="pb-24">
      <PageHeader eyebrow="Projects" title="Things I've built.">
        Personal projects and hackathon builds, from AI agents to full-stack dashboards.
      </PageHeader>

      <LayoutGroup>
        {/* Toggle buttons (aria-pressed), not tabs: tabs imply arrow-key navigation and a tabpanel. */}
        <div role="group" aria-label="Filter projects" className="inline-flex rounded-full border border-line bg-surface p-1">
          {FILTERS.map((f) => {
            const active = f.value === filter;
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={active}
                aria-controls="project-grid"
                onClick={() => setParams(f.value === 'all' ? {} : { type: f.value }, { replace: true, preventScrollReset: true })}
                className={`relative rounded-full px-4 py-1.5 text-sm transition-colors ${
                  active ? 'text-bg' : 'text-muted hover:text-fg'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-fg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative">
                  {f.label} <span className="font-mono text-xs">{count(f.value)}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div id="project-grid" aria-live="polite" className="mt-10">
          {visible.length === 0 ? (
            <EmptyState icon={<AwardIcon size={20} />} title={`No ${PROJECT_TYPE_LABEL[filter as ProjectType].toLowerCase()} projects yet`}>
              New builds are on the way. In the meantime, have a look at the other projects.
            </EmptyState>
          ) : (
            <motion.ul layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((p, i) => (
                  <motion.li
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, delay: i * 0.04, ease } }}
                    exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                  >
                    <ProjectCard project={p} headingLevel={2} priority={i === 0 ? 'high' : false} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </LayoutGroup>
    </Container>
  );
}
