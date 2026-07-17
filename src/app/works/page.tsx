'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const fullBleed: React.CSSProperties = {
  marginLeft: 'calc(-50vw + 50%)',
  marginRight: 'calc(-50vw + 50%)',
};

const fontDisplay: React.CSSProperties = { fontFamily: 'var(--font-fraunces)' };
const fontBody: React.CSSProperties = { fontFamily: 'var(--font-inter)' };

type Project = {
  title: string;
  category: string;
  time: string;
  tags: string[];
  description: string;
  image: string;
  href: string;
};

function useScrollAnimation(initialDelay: number = 0) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
      );

      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) {
          setIsVisible(true);
        } else {
          observer.observe(ref.current);
        }
      }

      return () => {
        if (ref.current) observer.unobserve(ref.current);
      };
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [initialDelay]);

  return { ref, isVisible };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation(delay);
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
      }}
    >
      {children}
    </div>
  );
}

const productProjects: Project[] = [
  {
    title: 'ConnectNova',
    category: 'Designer',
    time: '2026 – Present',
    tags: ['AI', 'Chrome Extension', 'Dashboard'],
    description:
      'AI recruiting platform that turns LinkedIn sourcing into a structured candidate-ranking workflow across a Chrome extension and dashboard.',
    image: '/img/Connectnova.avif',
    href: '/projects/connectnova',
  },
  {
    title: 'Jobnova',
    category: 'Designer',
    time: '2025 – Present',
    tags: ['AI', 'Career Platform', 'Personalization'],
    description:
      'AI career platform for tailored job discovery and personalized applications, helping job seekers move from scattered search to focused action.',
    image: '/img/Jobnova.avif',
    href: '/projects/jobnova',
  },
  {
    title: 'MemQ',
    category: 'Designer',
    time: '2026 · 8 weeks',
    tags: ['Mobile', 'EdTech', 'Learning'],
    description:
      'Mobile learning app that captures knowledge, turns it into quizzes, and supports durable memory through repeatable study loops.',
    image: '/img/MemQ.avif',
    href: '/projects/memq',
  },
  {
    title: 'Beikemama',
    category: 'Designer',
    time: '2020 · 8 weeks',
    tags: ['Community', 'Live', 'Social'],
    description:
      'Live parenting community for pregnant women and young families, combining expert Q&A, social support, and parent-child activities.',
    image: '/img/Beikemama.avif',
    href: '/projects/beikemama',
  },
  {
    title: 'Mono',
    category: 'AI Builder',
    time: '2026',
    tags: ['AI', 'FinTech', 'Generative UI'],
    description:
      'Intent-driven financial agent that turns natural language into structured UI states for clearer, more actionable money insights.',
    image: '/img/mono_cover.avif',
    href: '/projects/mono',
  },
  {
    title: 'CrackInterview.AI',
    category: 'AI Builder',
    time: '2025 · 8 weeks',
    tags: ['AI', 'EdTech', 'Interview Prep'],
    description:
      'AI mock interview platform that gives technical candidates structured practice, adaptive conversations, and clearer feedback loops.',
    image: '/img/CrackInterview_cover.avif',
    href: '/projects/crackinterview',
  },
  {
    title: 'Customer Service System',
    category: 'Creative Coder',
    time: '2022 · 4 weeks',
    tags: ['Enterprise', 'Chat', 'Workflow'],
    description:
      'Multi-role customer support system mapping messaging, escalation, and admin workflows across users, promoters, agents, and operators.',
    image: '/img/customer-service-system_cover.avif',
    href: '/projects/customer-service-system',
  },
  {
    title: 'This Portfolio',
    category: 'Creative Coder',
    time: '2026 – Ongoing',
    tags: ['Experimental', 'Motion', 'Personal'],
    description:
      'A living interface experiment blending motion, interaction, AI-assisted iteration, and portfolio storytelling into one evolving system.',
    image: '/meiwave.gif',
    href: '/',
  },
];

const researchProjects: Project[] = [
  {
    title: 'Walnut Coding',
    category: 'Researcher',
    time: '24–72 hrs post-trial',
    tags: ['UX Research', 'EdTech', 'Behavioral'],
    description:
      'UX research on post-trial parent decisions in children’s coding education: why families hesitate and what evidence helps them commit.',
    image: '/img/walnut-coding-cover.svg',
    href: '/projects/walnut-coding',
  },
  {
    title: 'Parent Sharing Behavior',
    category: 'Researcher',
    time: '2025 · Research study',
    tags: ['UX Research', 'Growth', 'Behavioral'],
    description:
      'Research into why high-value parents hesitate to share publicly, and how referral experiences can be redesigned around social comfort.',
    image: '/img/walnut-sharing-cover.svg',
    href: '/projects/walnut-sharing',
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
    tags: ['UX Research', 'HealthTech', 'Product'],
    description:
      'Digital health product work for menopause symptom tracking, personal insights, and clearer communication between patients and clinicians.',
    image: '/img/Clarity.avif',
    href: '/projects/clarity',
  },
];

const workGroups = [
  { label: 'Product', items: productProjects },
  { label: 'Research', items: researchProjects },
];

export default function WorksPage() {
  return (
    <section
      className="flex w-screen flex-col items-center bg-white px-6 pb-16 sm:px-10 md:px-16 md:pb-24"
      style={fullBleed}
    >
      <div className="w-full max-w-[1200px]">
        <Reveal>
          <div className="flex flex-col gap-6 border-b border-[#cccccc] py-12 md:flex-row md:items-center md:justify-between md:py-16">
            <h1 className="text-[56px] leading-none md:text-[80px]" style={fontDisplay}>
              Work
            </h1>
            <p className="max-w-[560px] text-[16px] font-light text-[#0a0a0a] md:text-[20px]" style={fontBody}>
              All case studies, experiments, and product systems in one place, from AI products and education to
              civic services, health, and internal tools.
            </p>
          </div>
        </Reveal>

        <div className="flex flex-col gap-16 pt-16 md:gap-24">
          {workGroups.map((group) => (
            <Reveal key={group.label}>
              <div className="flex flex-col gap-6 md:flex-row md:gap-16">
                <p className="w-full shrink-0 text-[22px] text-[#0a0a0a] md:w-[140px] md:text-[32px]" style={fontBody}>
                  {group.label}
                </p>
                <div className="flex-1 divide-y divide-[#cccccc]">
                  {group.items.map((project) => (
                    <Link
                      key={project.title}
                      href={project.href}
                      className="group flex flex-col gap-2 py-6 first:pt-0"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-[22px] text-[#0a0a0a] md:text-[24px]" style={fontDisplay}>
                          {project.title}
                        </h2>
                        <span
                          className="whitespace-nowrap text-[15px] font-light text-[#0a0a0a]/60 md:text-[18px]"
                          style={fontBody}
                        >
                          {project.category}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[#ed5b2b] px-3 py-1 text-[13px] text-white"
                            style={fontBody}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr]">
                        <div className="overflow-hidden">
                          <div className="flex flex-col gap-5 pt-8 md:flex-row md:items-start md:gap-9">
                            <div className="h-[220px] w-full shrink-0 overflow-hidden bg-[#cccccc] md:h-[239px] md:w-[360px]">
                              <img
                                src={project.image}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col justify-center gap-5 pt-1 md:min-h-[194px]">
                              <p className="text-[15px] text-[#ed5b2b] md:text-[16px]" style={fontBody}>
                                {project.time}
                              </p>
                              <p className="text-[15px] font-light text-[#0a0a0a] md:text-[16px]" style={fontBody}>
                                {project.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
