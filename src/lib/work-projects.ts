export type WorkProject = {
  title: string;
  category: string;
  time: string;
  tags: string[];
  description: string;
  /** One headline result, shown on the entry card. Wording follows the CV; do not extend the numbers. */
  impact?: { value: string; label: string };
  image: string;
  imageFit?: 'cover' | 'contain';
  imageScale?: number;
  imageTranslateY?: string;
  imageBackground?: string;
  coverScreen?: string;
  coverScreenHover?: string;
  coverScreens?: string[];
  coverDevice?: 'laptop' | 'phone' | 'phone-stack' | 'tablet' | 'freeform' | 'interface' | 'screenshot';
  coverAccent?: string;
  coverMotif?:
    | 'beauty'
    | 'procurement'
    | 'recruiting'
    | 'job-search'
    | 'learning'
    | 'parenting'
    | 'finance'
    | 'interview'
    | 'support'
    | 'civic'
    | 'health'
    | 'research-sharing'
    | 'research-coding';
  coverScreenFit?: 'cover' | 'contain' | 'fill';
  coverScreenPosition?: string;
  href: string;
};

export const productProjects: WorkProject[] = [
  {
    title: 'DEF Beauty ERP',
    category: 'Product / UX Designer',
    time: '2026',
    tags: ['Enterprise ERP', 'B2B Workflows', 'Design System'],
    description: 'One ERP for sales, stock, purchasing and finance, with a WeChat storefront on live data.',
    impact: { value: 'Manual → 86%', label: 'self-service via mini-program (1-week sample)' },
    image: '/img/def-erp/def-erp-cover-v5.webp',
    imageFit: 'cover',
    imageScale: 1,
    imageTranslateY: '0%',
    imageBackground: '#f1f3f5',
    coverScreen: '/img/def-erp/evidence/dashboard-admin-expanded-v2.webp',
    coverDevice: 'interface',
    coverAccent: '#2274ff',
    coverMotif: 'beauty',
    href: '/projects/def-erp-kit',
  },
  {
    title: 'DEF Mini Program',
    category: 'Product / UX Designer',
    time: '2026',
    tags: ['B2B Commerce', 'Mobile Design', 'Design System'],
    description: 'A wholesale WeChat storefront rebuilt around reordering. Designed, awaiting development.',
    // Research figures, not results: the redesign has not been built yet.
    impact: { value: '7,354 orders', label: 'analysed (Mar–Aug 2026), plus 7 merchant interviews' },
    image: '/img/def-miniprogram/home.webp',
    coverScreen: '/img/def-miniprogram/home.webp',
    coverDevice: 'phone-stack',
    coverAccent: '#17191a',
    coverMotif: 'beauty',
    href: '/projects/def-miniprogram-kit',
  },
  {
    title: 'Procurement Agent',
    category: 'Product / UX / AX Designer',
    time: '2026',
    tags: ['AI Agent', 'Human-in-the-Loop', 'Enterprise'],
    description: 'An AI agent that drafts purchase plans, shows why, and leaves the order to you.',
    impact: { value: '30 min–2 h → 5–10 min', label: 'per purchase plan, used daily by 3 staff' },
    image: '/img/procurement-agent/Procurement Agent.avif',
    imageFit: 'cover',
    imageScale: 1.68,
    imageTranslateY: '0%',
    imageBackground: '#161616',
    coverScreen: '/img/procurement-agent/evidence/purchase-order-cover-ca407eb3a9b8.webp',
    coverDevice: 'interface',
    coverAccent: '#6c5ce7',
    coverScreenFit: 'contain',
    coverMotif: 'procurement',
    href: '/projects/procurement-agent-decisions',
  },
  {
    title: 'ConnectNova',
    category: 'Founding Designer',
    time: '2026 – Jun 2026',
    tags: ['B2B SaaS', 'AI Recruiting', 'Design-to-Code'],
    description: 'AI recruiting from LinkedIn to outreach, with editable ranking and human review.',
    impact: { value: '~500 in 5–10 min', label: 'candidates ranked, vs an estimated 2–5 h by hand' },
    image: '/img/Connectnova.avif',
    coverScreen: '/img/connectnova/connectnova-dashboard-cover.webp',
    coverDevice: 'laptop',
    coverAccent: '#1768e5',
    coverScreenFit: 'contain',
    coverMotif: 'recruiting',
    href: '/projects/connectnova-kit',
  },
  {
    title: 'JobNova',
    category: 'Founding Designer',
    time: '2025 – Jun 2026',
    tags: ['AI SaaS', 'Agentic Workflow', 'Data-Informed UX'],
    description: 'A job-search agent that applies for you, within your rules, pause and revoke included.',
    impact: { value: '~40k applications', label: 'sent by Auto Apply for 2,700+ users (to Jun 2026)' },
    image: '/img/Jobnova.avif',
    coverScreen: '/img/jobnova/jobnova-matched-jobs-cover.png',
    coverDevice: 'laptop',
    coverAccent: '#2553d8',
    coverMotif: 'job-search',
    href: '/projects/jobnova-kit',
  },
  {
    title: 'MemQ',
    category: 'Solo Product Designer & Developer',
    time: 'Apr – Nov 2026',
    tags: ['AI Learning', 'iOS App', 'Character & Motion'],
    description: 'An iOS app that turns AI answers into cards and brings them back before you forget.',
    impact: { value: 'Live on the App Store', label: 'designed, built and shipped solo' },
    image: '/img/MemQ.avif',
    coverScreen: '/img/MemQ/Home.PNG',
    coverScreens: ['/img/MemQ/Home.PNG', '/img/MemQ/Explore1.PNG', '/img/MemQ/AI1.PNG'],
    coverDevice: 'phone-stack',
    coverAccent: '#1A8A72',
    coverMotif: 'learning',
    href: '/projects/memq-decisions',
  },
  {
    title: 'Mono',
    category: 'AI Builder',
    time: '2026 · 4 weeks',
    tags: ['AI Agent', 'FinTech'],
    description: 'An AI finance agent that turns plain language into clear money insights.',
    image: '/img/Mono/mono-cover.webp',
    imageFit: 'contain',
    imageScale: 1.02,
    imageTranslateY: '7%',
    imageBackground:
      'radial-gradient(circle at 18% 76%, rgb(16 163 127 / 0.24), transparent 34%), radial-gradient(circle at 82% 18%, rgb(118 197 173 / 0.18), transparent 30%), linear-gradient(135deg, #f4f8f5 0%, #dce8e1 52%, #edf3ef 100%)',
    // The cover is a still of the live site (mono.riverstudio.cc), like the other demo cards.
    coverScreen: '/img/Mono/mono-app-cover.webp',
    coverDevice: 'screenshot',
    coverAccent: '#167f62',
    coverScreenFit: 'cover',
    coverMotif: 'finance',
    href: '/projects/mono',
  },
  {
    title: 'SenseFlow',
    category: 'Product Designer',
    time: '2026 · Concept',
    tags: ['AI Builder', 'No-code'],
    description: 'Turn HR policy docs into an AI assistant, and test it before publishing.',
    image: '/img/senseflow/cover.webp',
    coverScreen: '/img/senseflow/cover.webp',
    coverDevice: 'screenshot',
    coverAccent: '#f43f5e',
    coverScreenFit: 'cover',
    // No case study: the card opens the interactive design itself.
    href: '/demos/senseflow/index.html',
  },
  {
    title: 'Team HQ',
    category: 'Product Designer / Builder',
    time: '2026 · Playable',
    tags: ['3D Office', 'Human + AI'],
    description: 'A 3D office where you work alongside human and AI colleagues.',
    image: '/img/team-hq/cover.webp',
    coverScreen: '/img/team-hq/cover.webp',
    coverDevice: 'screenshot',
    coverAccent: '#7b5cd6',
    coverScreenFit: 'cover',
    // No case study: the card opens the playable office itself.
    href: '/demos/team-hq/index.html',
  },
  {
    title: 'ConnectNova Sequence',
    category: 'Founding Designer',
    time: '2026 · Interactive',
    tags: ['Outreach', 'Workflow Builder'],
    description: 'Build an outreach sequence, run a sample and read the results.',
    image: '/img/connectnova/sequence-workflow-cover.webp',
    coverScreen: '/img/connectnova/sequence-workflow-cover.webp',
    coverDevice: 'screenshot',
    coverAccent: '#1768e5',
    coverScreenFit: 'cover',
    // No case study: the card opens the local demo itself.
    href: '/demos/connectnova-sequence',
  },
  {
    title: 'Milan Site Selection',
    category: 'Product Designer / Builder',
    time: '2026 · Interactive',
    tags: ['3D Map', 'Data Viz'],
    description: 'A 3D map that scores Milan neighbourhoods for a new store.',
    image: '/img/milan-cafe-map/cover.webp',
    coverScreen: '/img/milan-cafe-map/cover.webp',
    coverDevice: 'screenshot',
    coverAccent: '#8a7a55',
    coverScreenFit: 'cover',
    // No case study: the card opens the interactive map itself.
    href: '/demos/milan-cafe-map/index.html',
  },
];
