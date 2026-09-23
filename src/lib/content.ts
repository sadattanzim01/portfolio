import { projects as rawProjects } from '../content/projects';
import { experience as rawExperience } from '../content/experience';
import { certifications as rawCertifications } from '../content/certifications';
import type { Project, ProjectType } from '../content/types';

const newestFirst = <T,>(key: (item: T) => string) => (a: T, b: T) => key(b).localeCompare(key(a));

export const projects = [...rawProjects].sort(newestFirst((p) => p.date));
export const featuredProjects = projects.filter((p) => p.featured);
export const experience = [...rawExperience].sort(newestFirst((e) => e.start));
export const certifications = [...rawCertifications].sort(newestFirst((c) => c.date));

export const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  personal: 'Personal',
  hackathon: 'Hackathon',
};

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

if (import.meta.env.DEV) {
  const seen = new Set<string>();
  for (const p of projects) {
    if (seen.has(p.slug)) throw new Error(`Duplicate project slug "${p.slug}" in src/content/projects.ts`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) throw new Error(`Invalid slug "${p.slug}": use lowercase-hyphenated`);
    seen.add(p.slug);
  }
}
