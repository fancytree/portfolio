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
    tags: ['AX Design', 'B2B SaaS'],
    description: 'AI procurement agent for a B2B beauty wholesaler, with human control at every step.',
    image: '/img/procurement-agent/Procurement Agent.avif',
    imageFit: 'cover',
    imageScale: 1.68,
    imageTranslateY: '0%',
    imageBackground: '#161616',
    href: '/projects/procurement-agent',
  },
  {
    title: 'ConnectNova',
    category: 'Founding Designer',
    time: '2026 – Present',
    tags: ['AI Recruiting', 'SaaS'],
    description: 'AI recruiting workflow: LinkedIn sourcing extension + candidate ranking dashboard.',
    image: '/img/Connectnova.avif',
    href: '/projects/connectnova',
  },
  {
    title: 'JobNova',
    category: 'Lead Designer',
    time: '2025 – Present',
    tags: ['AI Job Search', '0→1 Product'],
    description: '0→1 AI job search that keeps users in control.',
    image: '/img/Jobnova.avif',
    href: '/projects/jobnova-ai-platform-v3',
  },
  {
    title: 'MemQ',
    category: 'Indie iOS Designer',
    time: '2026 · 8 weeks',
    tags: ['AI Learning', 'iOS App'],
    description: 'iOS app that turns what you ask AI into quizzes and review loops.',
    image: '/img/MemQ.avif',
    href: '/projects/memq',
  },
  {
    title: 'Beikemama',
    category: 'UX/UI Designer',
    time: '2020 · 8 weeks',
    tags: ['Parenting', 'Mobile App'],
    description: 'Live parenting community with expert Q&A and social support.',
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
    tags: ['AI Agent', 'FinTech'],
    description: 'AI financial agent that turns plain language into clear money insights.',
    image: '/img/Mono/mono-cover-cutout.png',
    imageFit: 'contain',
    imageScale: 1.02,
    imageTranslateY: '7%',
    imageBackground:
      'radial-gradient(circle at 18% 76%, rgb(16 163 127 / 0.24), transparent 34%), radial-gradient(circle at 82% 18%, rgb(118 197 173 / 0.18), transparent 30%), linear-gradient(135deg, #f4f8f5 0%, #dce8e1 52%, #edf3ef 100%)',
    href: '/projects/mono',
  },
  {
    title: 'CrackInterview.AI',
    category: 'AI Builder',
    time: '2025 · 8 weeks',
    tags: ['AI Interview', 'EdTech'],
    description: 'AI mock interviews with adaptive conversations and clear feedback.',
    image: '/img/CrackInterview_cover.avif',
    href: '/projects/crackinterview',
  },
  {
    title: 'Customer Service System',
    category: 'Creative Coder',
    time: '2024',
    tags: ['Enterprise UX', 'Multi-role'],
    description: 'Unified customer service system across chat, roles, and workflows.',
    image: '/img/customer-service-system_cover.avif',
    href: '/projects/customer-service-system',
  },
  {
    title: 'Milano Partecipa',
    category: 'Researcher',
    time: '2023 · 16 weeks',
    tags: ['UX Research', 'Civic Tech'],
    description: 'Research on civic participation and everyday decision-making access.',
    image: '/img/Milano%20Partecipa.avif',
    href: '/projects/milano-partecipa',
  },
  {
    title: 'Clarity',
    category: 'Researcher',
    time: '2024 · 15 weeks',
    tags: ['UX Research', 'Digital Health'],
    description: 'Digital health product for menopause symptom tracking and care.',
    image: '/img/Clarity.avif',
    href: '/projects/clarity',
  },
  {
    title: 'This Portfolio',
    category: 'Creative Coder',
    time: '2026 – Ongoing',
    tags: ['Creative Code', 'Motion'],
    description: 'A living interface blending motion, AI, and portfolio storytelling.',
    image: '/meiwave.gif',
    href: '/',
  },
];

export const researchProjects: WorkProject[] = [
  {
    title: 'Walnut Coding',
    category: 'UX Researcher',
    time: '2020',
    tags: ['UX Research', 'Parent Decision'],
    description: 'Why parents hesitate after a trial coding class, and how to fix it.',
    image: '/img/walnut-coding-cover-v2.webp',
    href: '/projects/walnut-coding',
  },
  {
    title: 'Parent Sharing Behavior',
    category: 'UX Researcher',
    time: '2022',
    tags: ['UX Research', 'Referral Design'],
    description: 'Why high-value parents avoid sharing publicly, reframed around trust.',
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
