import type { Education, SkillGroup } from './types.ts';

/** Identity, bio and skills. Used across the home, about and contact pages. */
export const site = {
  name: 'Sadat Tanzim',
  initials: 'ST',
  /**
   * Public URL of the deployed site, no trailing slash. Used for canonical links, Open Graph,
   * robots.txt and sitemap.xml. Update this when the custom domain is live.
   */
  url: 'https://sadattanzim.pages.dev',
  /** Default meta description (home page and fallback). */
  description:
    'Sadat Tanzim is a Computer Science student at the University of Windsor and Software Engineering Intern at Glendor, building AI-powered tools and full-stack systems.',
  role: 'Software Engineer',
  location: 'Windsor, ON, Canada',
  headline: 'I build AI-powered tools and full-stack systems that turn slow, manual work into software.',
  intro:
    'Computer Science student at the University of Windsor. Currently a Software Engineering Intern at Glendor, working on privacy-preserving machine learning.',
  /** Small status pill on the home page. Set to null to hide it. */
  status: 'Software Engineering Intern at Glendor' as string | null,
  /** Put the file at public/resume.pdf. */
  resume: '/resume.pdf',

  about: [
    "I'm a Computer Science (Honours) student at the University of Windsor with a minor in Mathematics. I like building software that takes a tedious, manual process and makes it automatic, whether that's an AI agent that reviews pull requests or an LLM pipeline that triages maintenance requests.",
    "Right now I'm a Software Engineering Intern at Glendor, contributing to a federated learning initiative that applies privacy-preserving machine learning to model training. I'm also on the Embedded Software & Controls team at Formula Electric Windsor, and I coordinate projects for the University of Windsor AI Club.",
    'I care about clear code, honest documentation, and shipping things people actually use.',
  ],
} as const;

export const education: Education[] = [
  {
    school: 'University of Windsor',
    degree: 'Bachelor of Computer Science, Honours (Minor in Mathematics)',
    location: 'Windsor, ON',
    start: '2024-09',
    end: 'present',
  },
];

export const skills: SkillGroup[] = [
  {
    label: 'Languages',
    items: ['Python', 'Java', 'JavaScript', 'TypeScript', 'SQL', 'C', 'C++', 'PHP', 'HTML5', 'CSS3'],
  },
  {
    label: 'Frameworks',
    items: ['React', 'Node.js', 'Express', 'Spring Boot', 'Flask', 'PyTorch', 'scikit-learn', 'Bootstrap', 'jQuery'],
  },
  {
    label: 'Cloud & DevOps',
    items: ['Microsoft Azure', 'Google Cloud', 'Firebase', 'Docker', 'CI/CD', 'Vercel', 'Railway'],
  },
  {
    label: 'Databases & Tools',
    items: ['PostgreSQL', 'MySQL', 'Git', 'GitHub', 'Postman', 'Linux', 'n8n'],
  },
];
