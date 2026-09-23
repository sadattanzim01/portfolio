import type { Social } from './types.ts';

/** Shown in the header, footer and contact page. */
export const socials: Social[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sadattanzim01',
    handle: 'in/sadattanzim01',
    icon: 'linkedin',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/sadattanzim01',
    handle: 'sadattanzim01',
    icon: 'github',
  },
];

/** The first address is the primary one (used for the main "Email me" buttons). */
export const emails: string[] = ['tanzims@uwindsor.ca', 'sadattanzim06@gmail.com'];
