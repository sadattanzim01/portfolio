/**
 * Shapes for everything in src/content/. Editing a data file with a missing or
 * misspelled field is a compile error, so `npm run build` catches content mistakes.
 */

/** Month string in the form "YYYY-MM", e.g. "2026-08". */
export type YearMonth = `${number}-${number}`;

export type ProjectType = 'personal' | 'hackathon';

export interface Project {
  /** URL segment: /projects/<slug>. Lowercase, hyphenated, unique. */
  slug: string;
  title: string;
  type: ProjectType;
  /** One-line summary shown on cards and under the title on the detail page. */
  tagline: string;
  /**
   * Card and detail-page image, 16:9. Put files in public/images/projects/.
   * `src` should be ~1600px wide; `small` is an optional ~800px version for cards and phones.
   */
  image: {
    src: string;
    small?: string;
    alt: string;
  };
  /** Detail page, section 1: what was wrong or missing. One or two short paragraphs. */
  problem: string[];
  /** Detail page, section 2: what you built and how. Bullet points. */
  approach: string[];
  /** Detail page, section 3: outcomes, numbers, what you learned. Bullet points. Leave [] while in progress. */
  result: string[];
  /** Shows an "In progress" badge on the card and detail page. Remove once shipped. */
  status?: 'in-progress';
  tech: string[];
  date: YearMonth;
  /** Small label shown on the card and detail page, e.g. "Capstone" or "Course project". */
  context?: string;
  /** e.g. "Team lead · 4 people" */
  role?: string;
  /** Hackathon name, e.g. "HackWestern 12". */
  event?: string;
  /** e.g. "1st place — Best use of AI" */
  award?: string;
  links: {
    repo?: string;
    live?: string;
    devpost?: string;
  };
  /** Shown in the "Selected work" section on the home page. */
  featured?: boolean;
}

export interface Experience {
  company: string;
  role: string;
  location: string;
  start: YearMonth;
  /** Leave as 'present' for current roles. */
  end: YearMonth | 'present';
  highlights: string[];
  tech?: string[];
  url?: string;
}

export interface Education {
  school: string;
  degree: string;
  location: string;
  start: YearMonth;
  end: YearMonth | 'present';
  notes?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: YearMonth;
  /** Link to the verification page, if any. */
  credentialUrl?: string;
  credentialId?: string;
}

export type SocialIcon = 'github' | 'linkedin' | 'mail' | 'resume';

export interface Social {
  label: string;
  href: string;
  /** Short display form, e.g. "in/sadattanzim01". */
  handle: string;
  icon: SocialIcon;
}

export interface SkillGroup {
  label: string;
  items: string[];
}
