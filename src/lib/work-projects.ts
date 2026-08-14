export type WorkProject = {
  title: string;
  category: string;
  time: string;
  tags: string[];
  description: string;
  image: string;
  imageFit?: 'cover' | 'contain';
  imageScale?: number;
  imageTranslateY?: string;
  imageBackground?: string;
  href: string;
};

export const productProjects: WorkProject[] = [
  {
    title: 'Procurement Agent',
    category: 'Product / UX / AX Designer',
    time: '2026',
    tags: ['Agentic Experience Design', 'B2B Procurement', 'Agent Workflow'],
    description:
      'A three-stage transformation for an Italian B2B beauty wholesaler: disconnected manual work, structured purchasing operations, and evidence-backed Agent collaboration, with human ordering authority preserved throughout.',
    image: '/img/procurement-agent/Procurement Agent.avif',
    imageFit: 'cover',
    imageScale: 1.55,
    imageTranslateY: '8%',
    imageBackground: '#161616',
    href: '/projects/procurement-agent',
  },
  {
    title: 'ConnectNova',
    category: 'Founding Designer',
    time: '2026 – Present',
    tags: ['AI Recruiting', 'SaaS Platform', 'End-to-end Workflow'],
    description:
      'Led product direction, UX strategy, and interaction design for a two-part recruiting workflow: a LinkedIn Chrome extension for sourcing and a dashboard for candidate ranking, review, and outreach.',
    image: '/img/Connectnova.avif',
    href: '/projects/connectnova',
  },
  {
    title: 'JobNova',
    category: 'Lead Designer',
    time: '2025 – Present',
    tags: ['AI Job Search', '0-to-1 Product', 'Trust & Automation'],
    description:
      'Designed a 0-to-1 AI job-search system that helps users complete relevant applications faster without giving up trust or control.',
    image: '/img/Jobnova.avif',
    href: '/projects/jobnova-ai-platform-v3',
  },
  {
    title: 'MemQ',
    category: 'Indie iOS Designer',
    time: '2026 · 8 weeks',
    tags: ['AI Learning', 'iOS Product', 'Built & Shipped'],
    description:
      'Independently designed, developed, and launched an iOS learning app that turns captured knowledge into quizzes and review loops, helping learners retain what they ask AI.',
    image: '/img/MemQ.avif',
    href: '/projects/memq',
  },
  {
    title: 'Beikemama',
    category: 'UX/UI Designer',
    time: '2020 · 8 weeks',
    tags: ['Parenting Community', 'Mobile Product', 'Live Q&A'],
    description:
      'Designed a live parenting community for pregnant women and young families, connecting expert Q&A, social support, and parent-child activities into a warmer mobile experience.',
    image: '/img/Beikemama/Beikemama.avif',
    imageFit: 'contain',
    imageScale: 0.76,
    imageBackground:
      'radial-gradient(circle at 18% 18%, rgb(255 224 164 / 0.82), transparent 42%), radial-gradient(circle at 84% 24%, rgb(255 112 124 / 0.42), transparent 40%), radial-gradient(circle at 74% 88%, rgb(112 204 196 / 0.42), transparent 44%), linear-gradient(135deg, #fff8f3 0%, #ffe9e8 52%, #effaf7 100%)',
    href: '/projects/beikemama',
  },
  {
    title: 'Mono',
    category: 'AI Builder',
    time: '2026 · 4 weeks',
    tags: ['AI Agent', 'FinTech', 'Generative UI'],
    description:
      'Intent-driven financial agent that turns natural language into structured UI states for clearer, more actionable money insights.',
    image: '/img/mono_cover.avif',
    href: '/projects/mono',
  },
  {
    title: 'CrackInterview.AI',
    category: 'AI Builder',
    time: '2025 · 8 weeks',
    tags: ['AI Interviewing', 'EdTech', 'Conversational UX'],
    description:
      'AI mock interview platform that gives technical candidates structured practice, adaptive conversations, and clearer feedback loops.',
    image: '/img/CrackInterview_cover.avif',
    href: '/projects/crackinterview',
  },
  {
    title: 'Customer Service System',
    category: 'Creative Coder',
    time: '2024',
    tags: ['Enterprise UX', 'Multi-role System', 'Service Workflow'],
    description:
      'A commissioned UX redesign of a company\'s customer service system, unifying live chat, role-based access, and support workflows for users, promoters, agents, and admins.',
    image: '/img/customer-service-system_cover.avif',
    href: '/projects/customer-service-system',
  },
  {
    title: 'Milano Partecipa',
    category: 'Researcher',
    time: '2023 · 16 weeks',
    tags: ['UX Research', 'Civic Tech', 'Service Design'],
    description:
      'Civic participation research and service design for improving access, awareness, and everyday engagement with local decision-making.',
    image: '/img/Milano%20Partecipa.avif',
    href: '/projects/milano-partecipa',
  },
  {
    title: 'Clarity',
    category: 'Researcher',
    time: '2024 · 15 weeks',
    tags: ['UX Research', 'Digital Health', 'Clinical Workflow'],
    description:
      'Digital health product work for menopause symptom tracking, personal insights, and clearer communication between patients and clinicians.',
    image: '/img/Clarity.avif',
    href: '/projects/clarity',
  },
  {
    title: 'This Portfolio',
    category: 'Creative Coder',
    time: '2026 – Ongoing',
    tags: ['Creative Coding', 'Motion Design', 'AI-assisted Build'],
    description:
      'A living interface experiment blending motion, interaction, AI-assisted iteration, and portfolio storytelling into one evolving system.',
    image: '/meiwave.gif',
    href: '/',
  },
];

export const researchProjects: WorkProject[] = [
  {
    title: 'Walnut Coding',
    category: 'UX Researcher',
    time: '2020',
    tags: ['UX Research', 'Parent Decision', 'Conversion Journey'],
    description:
      'Investigated why parents hesitate after trial coding classes and translated hesitation patterns into clearer evidence, comparison, and decision-support opportunities.',
    image: '/img/walnut-coding-cover-v2.webp',
    href: '/projects/walnut-coding',
  },
  {
    title: 'Parent Sharing Behavior',
    category: 'UX Researcher',
    time: '2022',
    tags: ['UX Research', 'Sharing Behavior', 'Referral Design'],
    description:
      'Studied why high-value parents hesitate to share publicly, reframing referral design around social comfort, private trust, and parent-controlled expression.',
    image: '/img/walnut-sharing-cover-v2.webp',
    href: '/projects/walnut-sharing',
  },
];

/** 按年份倒序；同年进行中的项目排在已完成项目之前 */
export function sortProjectsByTimeDesc(projects: WorkProject[]) {
  return [...projects].sort((a, b) => {
    const yearA = Number(a.time.match(/\d{4}/)?.[0] ?? 0);
    const yearB = Number(b.time.match(/\d{4}/)?.[0] ?? 0);
    if (yearA !== yearB) return yearB - yearA;

    const ongoingA = /present|ongoing/i.test(a.time);
    const ongoingB = /present|ongoing/i.test(b.time);
    if (ongoingA !== ongoingB) return ongoingA ? -1 : 1;

    return 0;
  });
}

/** 作品全集：首页精选以外的产品项目也包含在内 */
export const allWorkGroups = [
  {
    label: 'Product',
    items: sortProjectsByTimeDesc(productProjects.filter((project) => project.title !== 'This Portfolio')),
  },
  {
    label: 'Research',
    items: sortProjectsByTimeDesc(researchProjects),
  },
];
