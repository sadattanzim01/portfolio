import type { Project } from './types.ts';

/**
 * Displayed newest first (sorted by date automatically).
 * Set `type: 'hackathon'` (plus `event` / `award`) for hackathon builds.
 * Images: put a screenshot in assets/screenshots/<slug>.png and run scripts/generate-project-images.py (see CLAUDE.md).
 */
export const projects: Project[] = [
  {
    slug: 'pr-pilot',
    title: 'PR Pilot',
    type: 'personal',
    tagline: 'An AI agent that reviews GitHub pull requests the moment they are opened.',
    image: {
      src: '/images/projects/pr-pilot.webp',
      small: '/images/projects/pr-pilot-800.webp',
      alt: 'PR Pilot production logs: a pull request event received, a Claude review generated, posted to GitHub, and saved, 20 seconds apart',
    },
    problem: [
      'Pull requests often wait hours for a first review, and routine issues such as obvious bugs, risky changes, and security concerns are easy to miss when reviewers are busy.',
      'I wanted every pull request to get structured, useful feedback automatically, right when it is opened.',
    ],
    approach: [
      'A GitHub webhook fires when a pull request opens; an Express server verifies the request with an HMAC signature before doing anything else.',
      'Octokit fetches the diff and the full contents of changed files, which are sent to Claude with a structured review prompt covering summary, strengths, bugs, suggestions, and security.',
      'The review is posted back to the pull request as a comment and saved to a PostgreSQL database (Supabase).',
      'A React + TypeScript dashboard shows review history, with GitHub OAuth 2.0 for sign-in and CI/CD deploys to Vercel.',
    ],
    result: [
      'Pull request feedback is posted in under 20 seconds of the PR being opened.',
      'Every review is logged and browsable in a live dashboard.',
      'Deployed and usable today via the live demo.',
    ],
    tech: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Supabase', 'Claude API', 'Octokit', 'GitHub OAuth', 'Tailwind CSS'],
    date: '2026-08',
    links: {
      repo: 'https://github.com/sadattanzim01/pr-pilot',
      live: 'https://pr-pilot-woad.vercel.app',
    },
    featured: true,
  },
  {
    // In progress: add problem/approach/result details, then drop `status` when it ships.
    slug: 'snaprag',
    title: 'SnapRAG',
    type: 'personal',
    status: 'in-progress',
    tagline: 'A multimodal document chat: ask questions across a mix of documents in natural language.',
    image: {
      src: '/images/projects/snaprag.webp',
      small: '/images/projects/snaprag-800.webp',
      alt: 'Illustration: PDFs, images and documents flowing into a chat that answers with citations',
    },
    problem: [
      'Answers are often spread across many documents in different formats, such as PDFs, scanned pages, and images, and finding them means opening and searching each file by hand.',
    ],
    approach: [
      'A Flask API with separate services for extracting text, generating embeddings, and storing documents.',
      'Extracts text from PDFs with pdfplumber and from images and scans with Tesseract OCR.',
      'Embeds document content with sentence-transformers so questions can be matched to the most relevant passages.',
      'Uses Claude to answer questions in natural language, grounded in the retrieved content.',
    ],
    result: [],
    tech: ['Python', 'Flask', 'Claude API', 'sentence-transformers', 'pdfplumber', 'Tesseract OCR'],
    date: '2026-08',
    links: {
      repo: 'https://github.com/sadattanzim01/SnapRag',
    },
  },
  {
    slug: 'classifyflow',
    title: 'ClassifyFlow',
    type: 'personal',
    tagline: 'An LLM pipeline that triages maintenance requests by urgency and trade.',
    image: {
      src: '/images/projects/classifyflow.webp',
      small: '/images/projects/classifyflow-800.webp',
      alt: 'The ClassifyFlow n8n workflow: Google Sheets rows sent through the Claude API, 51 items at every step, appended back to the sheet',
    },
    problem: [
      'Property management staff were spending 6–8 hours a week reading free-text maintenance requests, judging how urgent each one was, and routing it to the right trade by hand.',
      'The process was repetitive, error-prone, and would not scale as request volume grew.',
    ],
    approach: [
      'Built a five-node n8n workflow: Google Sheets intake, prompt construction, LLM classification, validation, and write-back.',
      'Designed the prompt so Claude classifies each request by urgency (emergency, high, routine) and trade (plumbing, electrical, HVAC, general).',
      'Parsed the response with regex and validated it against a fixed schema, so the output is always clean, schema-aligned JSON rather than free text.',
      'Wrote the structured result back to the sheet via the Google Sheets API, ready for staff to act on.',
    ],
    result: [
      'Classified 51 maintenance requests by urgency and trade.',
      'Replaced the manual triage step entirely.',
      'Produces structured data usable for routing, reporting, and further automation, not just a label.',
    ],
    tech: ['n8n', 'Claude API', 'Google Sheets API', 'Prompt Engineering', 'JSON Schema'],
    date: '2026-05',
    links: {
      repo: 'https://github.com/sadattanzim01/ClassifyFlow',
    },
    featured: true,
  },
  {
    slug: 'booknotes',
    title: 'BookNOTES',
    type: 'personal',
    tagline: 'A reading journal for logging books, notes, and ratings, with cover art built in.',
    image: {
      src: '/images/projects/booknotes.webp',
      small: '/images/projects/booknotes-800.webp',
      alt: 'BookNOTES shelf view with book covers, ratings out of 10, notes, and sort options',
    },
    problem: [
      'Reading notes tend to end up scattered across apps and paper, with no easy way to look back at what you read and what you thought of it.',
    ],
    approach: [
      'Built a server-rendered Node.js + Express app with EJS templates.',
      'Modelled books in PostgreSQL (title, author, rating, notes, date read, cover) with full create, edit, and delete support through pg.',
      'Pulled cover art from the Open Library API with Axios, plus a built-in cover search that auto-fills the cover ID, title, and author from a typed title.',
      'Added sorting by most recent, top rated, or title A–Z, and a visual star display for ratings out of 10.',
    ],
    result: [
      'A complete full-stack CRUD app with persistent storage in a relational database.',
      'Adding a book takes a title search instead of manual data entry, thanks to the cover lookup.',
    ],
    tech: ['Node.js', 'Express', 'PostgreSQL', 'EJS', 'Axios', 'Open Library API'],
    date: '2026-04',
    links: {
      repo: 'https://github.com/sadattanzim01/BookNOTES',
    },
  },
  {
    slug: 'devlens',
    title: 'DevLENS',
    type: 'personal',
    tagline: 'A GitHub analytics dashboard that uses ML to profile your coding patterns.',
    image: {
      src: '/images/projects/devlens.webp',
      small: '/images/projects/devlens-800.webp',
      alt: 'DevLENS dashboard showing repository count, stars, primary language, a Polyglot Developer classification, a language donut chart and an activity timeline',
    },
    problem: [
      'GitHub shows raw contribution counts, but not the bigger picture: which languages you actually work in, how your activity changes over time, or what kind of developer your work suggests.',
    ],
    approach: [
      'Built a React frontend and a Node.js/Express backend with GitHub OAuth 2.0 login and session handling.',
      'Developed a Python + Flask microservice that uses scikit-learn to classify a developer as a Specialist, Polyglot, or Full-Stack Developer from their language diversity.',
      'Cached repository data in MySQL for an hour to avoid redundant GitHub API calls and rate limits.',
      'Visualized the data with Chart.js (language doughnut, 12-month activity timeline) and added a downloadable PNG dev card via html2canvas.',
    ],
    result: [
      'Classified developer activity across 100+ repositories.',
      'MySQL caching cut redundant API calls while keeping the dashboard responsive.',
      'Users get a shareable card that summarizes their GitHub identity.',
    ],
    tech: ['React', 'Vite', 'Node.js', 'Express', 'Python', 'Flask', 'scikit-learn', 'MySQL', 'Chart.js', 'GitHub OAuth'],
    date: '2026-03',
    links: {
      repo: 'https://github.com/sadattanzim01/DevLENS',
    },
    featured: true,
  },
  {
    slug: 'myadvice',
    title: 'MyAdvice',
    type: 'personal',
    context: 'Capstone',
    tagline: 'A student advising system for the University of Windsor School of Computer Science.',
    image: {
      src: '/images/projects/myadvice.webp',
      small: '/images/projects/myadvice-800.webp',
      alt: 'myAdvice desktop app home screen with Curriculum Advising, Scheduling, Bookings, System Administration, and Reports modules',
    },
    problem: [
      'Computer Science students, faculty, and staff handled course planning, timetabling, advising appointments, and transcripts through separate processes.',
      'The goal was a single system that advises undergraduates on their program and supports everyone who manages it.',
    ],
    approach: [
      'Led a 4-person Agile/Scrum team as project manager and GUI developer.',
      'Built a Java Swing desktop client that talks to a Spring Boot REST backend over HTTP.',
      'Designed object-oriented service and data layers with Spring Data JPA across five modules: curriculum advising, scheduling, bookings, system administration, and reports.',
      'Deployed the backend to Microsoft Azure App Service and validated REST endpoints across modules with Postman.',
    ],
    result: [
      'Delivered all five modules and earned a perfect score.',
      'Students can plan courses, build timetables, and book advising appointments in one place.',
    ],
    tech: ['Java', 'Spring Boot', 'Spring Data JPA', 'Java Swing', 'REST', 'Azure App Service', 'Postman'],
    date: '2026-03',
    role: 'Team lead · 4 people',
    links: {
      repo: 'https://github.com/sadattanzim01/myAdvice',
    },
  },
  {
    slug: 'intersteller-highway',
    title: 'Intersteller Highway V2',
    type: 'personal',
    tagline: 'An interplanetary logistics engine that optimizes cargo routes between planets.',
    image: {
      src: '/images/projects/intersteller-highway.webp',
      small: '/images/projects/intersteller-highway-800.webp',
      alt: 'Intersteller Highway trade route planner: departure Mercury, destination Uranus, ship Behemoth, payload mass, and a Calculate routes button',
    },
    problem: [
      'In a simulated interplanetary trade economy, merchants and cargo fleets need to plan routes between planets under real constraints: cargo capacity, fuel, and travel time.',
      'Picking routes by hand does not scale as the network and fleet grow.',
    ],
    approach: [
      'Modelled the trade network as a weighted graph of planets and stations.',
      'Computed the fastest and the most fuel-efficient routes with shortest-path algorithms (Dijkstra / A*).',
      'Added multiple rocket classes with their own capacity, speed, and fuel-efficiency profiles, plus cargo weight constraints.',
      'Simulated fuel consumption, supply and demand, and time-based trade decisions.',
    ],
    result: [
      'The engine recommends a route for either speed or fuel efficiency, per rocket and cargo load.',
      'Provides a foundation for strategic fleet planning across the network.',
    ],
    tech: ['Python', 'Graph Algorithms', 'Dijkstra', 'A*', 'Simulation'],
    date: '2026-03',
    links: {
      repo: 'https://github.com/sadattanzim01/Intersteller-Highway-V2',
    },
  },
];
