'use client';

import { useEffect } from 'react';

const workSections = [
  {
    id: 'designer-page',
    title: 'Designer',
    subtitle: 'Product strategy, UX systems, and interface craft.',
    projects: [
      {
        title: 'ConnectNova',
        description: 'AI-powered recruiting workflow for ranking LinkedIn candidates quickly, with a Chrome extension and web dashboard.',
        image: '/img/Connectnova.avif',
        href: '/projects/connectnova',
      },
      {
        title: 'Jobnova',
        description: 'AI-native career ecosystem for tailored job discovery and personalized application workflows.',
        image: '/img/Jobnova.avif',
        href: '/projects/jobnova',
      },
      {
        title: 'MemQ',
        description: 'Mobile learning app for capturing knowledge, generating quizzes, and building durable memory.',
        image: '/img/MemQ.avif',
        href: '/projects/memq',
      },
      {
        title: 'Beikemama',
        description: 'Live parenting community for pregnant women and young families, combining expert Q&A and social support.',
        image: '/img/Beikemama.avif',
        href: '/projects/beikemama',
      },
    ],
  },
  {
    id: 'researcher-page',
    title: 'Researcher',
    subtitle: 'Discovery, validation, service mapping, and civic systems.',
    projects: [
      {
        title: 'Walnut Coding',
        description: 'Post-trial parent decision-making in children’s coding education — why parents hesitate after a trial class and the evidence they need before they pay. A sanitized, chart-driven UX research case study.',
        image: '/img/walnut-coding-cover.svg',
        href: '/projects/walnut-coding',
      },
      {
        title: 'Parent Sharing Behavior',
        description: 'Why the highest-value parents share the least in public — an NPS, social-sharing & referral study of 7–12-year-olds, and how to redesign sharing around social comfort. Sanitized & chart-driven.',
        image: '/img/walnut-sharing-cover.svg',
        href: '/projects/walnut-sharing',
      },
      {
        title: 'Milano Partecipa',
        description: 'Civic participation service research for improving daily access, awareness, and community engagement.',
        image: '/img/Milano%20Partecipa.avif',
        href: '/projects/milano-partecipa',
      },
      {
        title: 'Clarity',
        description: 'Digital health product work for menopause symptom tracking, insights, and healthcare communication.',
        image: '/img/Clarity.avif',
        href: '/projects/clarity',
      },
    ],
  },
  {
    id: 'ai-builder-page',
    title: 'AI Builder',
    subtitle: 'Agentic UX, generative UI, and LLM-connected product systems.',
    projects: [
      {
        title: 'Mono',
        description: 'Intent-driven generative UI financial agent that turns natural language into structured interface states.',
        image: '/img/mono_cover.avif',
        href: '/projects/mono',
      },
      {
        title: 'CrackInterview.AI',
        description: 'AI mock interview platform with structured feedback loops for technical candidates.',
        image: '/img/CrackInterview_cover.avif',
        href: '/projects/crackinterview',
      },
    ],
  },
  {
    id: 'creative-coder-page',
    title: 'Creative Coder',
    subtitle: 'Code-based prototypes, systems thinking, and interaction experiments.',
    projects: [
      {
        title: 'Customer Service System',
        description: 'Multi-role chat and support workflows for users, promoters, support teams, and admins.',
        image: '/img/customer-service-system_cover.avif',
        href: '/projects/customer-service-system',
      },
      {
        title: 'This Portfolio',
        description: 'A living interface experiment blending reference-driven motion, interaction, and portfolio storytelling.',
        image: '/meiwave.gif',
        href: '/',
      },
    ],
  },
];

export default function WorksPage() {
  // 当通过 /works#xxx-page 进入时（例如首页把角色拖进 [Drop Here] 后跳转），
  // 展开对应的 <details> 并滚动到位。参考 Mei Portfolio/projects.js 的实现。
  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      let target: Element | null = null;
      try {
        target = document.querySelector(hash);
      } catch {
        target = document.getElementById(hash.slice(1));
      }
      if (target && target.tagName === 'DETAILS') {
        (target as HTMLDetailsElement).open = true;
        // 等浏览器把展开后的布局算好再滚动，否则会停在折叠时的位置
        requestAnimationFrame(() =>
          target!.scrollIntoView({ behavior: 'smooth', block: 'start' })
        );
      }
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  return (
    <section
      className="mei-works-page w-screen"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <header className="mei-works-header">
        <h1>Works</h1>
        <p>Case studies, experiments, and systems grouped by the roles from the opening scene.</p>
      </header>

      <div className="mei-work-details-stack">
        {workSections.map((section, index) => (
          <details key={section.id} id={section.id} className="mei-work-details" open={index === 0}>
            <summary className="mei-work-summary">
              <span>{section.title}</span>
              <small>{section.subtitle}</small>
            </summary>
            <div className="mei-work-section-content">
              <ul className="mei-project-list">
                {section.projects.map((project) => (
                  <li className="mei-project-card" key={project.title}>
                    <a href={project.href} className="mei-project-card-link">
                      <div className="mei-project-image">
                        <img src={project.image} alt="" />
                      </div>
                      <div className="mei-project-info">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <span className="mei-project-link">Read More</span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
