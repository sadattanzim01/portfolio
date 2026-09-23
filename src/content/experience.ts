import type { Experience } from './types.ts';

/** Displayed newest first (sorted by start date automatically). */
export const experience: Experience[] = [
  {
    company: 'Glendor',
    role: 'Software Engineering Intern',
    location: 'Windsor, ON',
    start: '2026-09',
    end: 'present',
    highlights: [
      'Contributing to a federated learning initiative applying privacy-preserving machine learning to model training.',
      'Reviewing federated averaging literature and configuring Python environments for distributed training research.',
    ],
    tech: ['Python', 'Federated Learning', 'Distributed Training'],
  },
  {
    company: 'Simcoe Cosmetic Clinic',
    role: 'Web Developer & SEO Analyst',
    location: 'Barrie, ON',
    start: '2026-05',
    end: '2026-07',
    highlights: [
      'Developed Python monitoring scripts auditing 10+ live web pages, detecting broken links and metadata defects.',
      'Optimized 14+ service pages with structured schema markup and metadata, improving search click-through rate.',
      'Migrated a React and Vite client portal into version control and recommended a higher-performance cloud server.',
      'Flagged exposed API credentials in a client CRM environment file and escalated remediation to stakeholders.',
    ],
    tech: ['Python', 'React', 'Vite', 'SEO', 'Schema.org', 'Git'],
  },
  {
    company: 'Formula Electric Windsor',
    role: 'Embedded Software & Controls Team Member',
    location: 'Windsor, ON',
    start: '2025-10',
    end: 'present',
    highlights: [
      'Benchmarked Qt and LVGL embedded C/C++ display frameworks and resolved display-stack integration defects.',
      'Recommended a framework delivering 60 FPS rendering and 30% faster builds, projecting $2.6K–$3.6K in savings.',
      'Validated GPU-accelerated rendering on Raspberry Pi and documented trade-offs for cross-functional review.',
    ],
    tech: ['C', 'C++', 'Qt', 'LVGL', 'Raspberry Pi'],
  },
  {
    company: 'University of Windsor AI Club',
    role: 'Project Coordinator',
    location: 'Windsor, ON',
    start: '2025-02',
    end: 'present',
    highlights: [
      'Designed and co-led a PyTorch workshop for 60 students, building a tabular classification model to 92% accuracy.',
      'Mentored beginners in Python, Git, and documentation practices, translating ML concepts for non-specialists.',
    ],
    tech: ['Python', 'PyTorch', 'Git'],
  },
];
