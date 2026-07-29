'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import CaseStudyControls from '../../components/CaseStudyControls';
import CaseStudyBackButton from '../../components/CaseStudyBackButton';
import CaseStudyHero from '../../components/CaseStudyHero';
import { fontFamily, textStyle } from '@/lib/design-tokens';
// Key Screens 静态截图（public/img/MemQ）
const MEMQ_KEY_SCREEN_ITEMS: { src: string; alt: string; title?: string; caption?: string }[] = [
  { src: '/img/MemQ/Home.PNG', alt: 'MemQ home', title: 'Home', caption: "Today's queue" },
  { src: '/img/MemQ/IMG_6659.PNG', alt: 'MemQ library', title: 'Library', caption: 'Lessons, cards & review counts' },
  { src: '/img/MemQ/IMG_6660.PNG', alt: 'MemQ lesson detail', title: 'Lesson detail', caption: 'Mastery, terms & start review' },
  { src: '/img/MemQ/IMG_6661.PNG', alt: 'MemQ multiple-choice study', title: 'Study', caption: 'Multiple-choice question' },
  { src: '/img/MemQ/IMG_6662.PNG', alt: 'MemQ answer feedback', title: 'Study', caption: 'Right vs wrong, try again' },
  { src: '/img/MemQ/IMG_6663.PNG', alt: 'MemQ explore', title: 'Explore', caption: 'Featured & trending lessons' },
  { src: '/img/MemQ/IMG_6674.PNG', alt: 'MemQ recall mode', title: 'Recall', caption: 'Type an answer, see the model' },
  { src: '/img/MemQ/IMG_6675.PNG', alt: 'MemQ profile', title: 'Profile', caption: 'Streak, stats & focus queue' },
  { src: '/img/MemQ/IMG_6676.PNG', alt: 'MemQ lesson from Explore', title: 'Lesson preview', caption: 'From Explore — add to library' },
  { src: '/img/MemQ/IMG_6677.PNG', alt: 'MemQ AI Assistant Q&A', title: 'Assistant', caption: 'Q&A grounded in your decks' },
  { src: '/img/MemQ/IMG_6678.PNG', alt: 'MemQ Assistant save card', title: 'Assistant', caption: 'Save the answer as a card' },
  { src: '/img/MemQ/IMG_6679.PNG', alt: 'MemQ Assistant pick lesson', title: 'Assistant', caption: 'Pick or create a lesson' },
];

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
        { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
      );

      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
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

function ScrollAnimatedSection({
  children,
  initialDelay = 0,
}: {
  children: React.ReactNode;
  initialDelay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation(initialDelay);
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
    >
      {children}
    </div>
  );
}

function ImgPlaceholder({
  label,
  height = 200,
  dark = false,
}: {
  label: string;
  height?: number;
  dark?: boolean;
}) {
  return (
    <div
      style={{
        width: '100%',
        height,
        backgroundColor: dark ? 'rgba(255,255,255,0.06)' : '#EBEBEB',
        borderRadius: '12px',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke={dark ? 'rgba(255,255,255,0.25)' : '#C0C0C0'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span
        style={{
          fontSize: '11px',
          fontFamily: 'system-ui',
          color: dark ? 'rgba(255,255,255,0.25)' : '#C0C0C0',
          letterSpacing: '0.02em',
        }}
      >
        {label}
      </span>
    </div>
  );
}

const SECTION: React.CSSProperties = {
  width: '100vw',
  marginLeft: 'calc(-50vw + 50%)',
  marginRight: 'calc(-50vw + 50%)',
};

const CONTAINER: React.CSSProperties = {
  maxWidth: '1280px',
  margin: '0 auto',
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(0,0,0,0.38)',
  marginBottom: '14px',
};

export default function MemQProjectPage() {
  const f = { fontFamily: fontFamily.system };

  return (
    <div className="mei-project-page w-full" style={{ backgroundColor: '#FAFAFA' }}>
      <CaseStudyControls />

      {/* ─────────────────────────────────────────
          1. HERO
      ───────────────────────────────────────── */}
      <CaseStudyHero
        title="MemQ"
        subtitle="An iOS study app that turns AI conversations into lasting knowledge through generated cards and spaced repetition."
        tags={['iOS Product', 'AI Learning', 'Full-stack', 'SwiftUI', 'Spaced Repetition']}
        aboutLabel="About MemQ"
        about="MemQ closes the loop between asking AI and actually remembering the answer. I designed, developed, and launched the iOS product end-to-end, translating AI conversations into knowledge cards, review flows, and a personal learning library."
        liveSiteHref="https://apps.apple.com/app/id6757248312"
        liveSiteLabel="Try MemQ"
        meta={[
          { label: 'Role', value: ['Solo Designer,', 'Full-stack Developer'] },
          { label: 'Team', value: ['Independent project'] },
          { label: 'Tool', value: ['SwiftUI,', 'Supabase,', 'LLM workflow'] },
          { label: 'Company', value: ['Self-initiated'] },
          { label: 'Year', value: ['2026 · launched'] },
        ]}
        visualLabel="MemQ learning system"
        visualSrc="/img/MemQ/MemQ.avif"
        visualAlt="MemQ iOS learning experience shown across knowledge review, progress, and spaced-repetition screens."
        visualObjectPosition="center bottom"
        visualObjectFit="contain"
        visualImageScale={0.9}
        visualTransformOrigin="center bottom"
        visualHeight="clamp(300px, 38vw, 540px)"
        visualBackground="radial-gradient(circle at 74% 22%, rgb(143 235 210 / 0.22), transparent 28%), radial-gradient(circle at 20% 78%, rgb(48 181 150 / 0.24), transparent 31%), radial-gradient(circle at 52% 55%, rgb(45 99 92 / 0.3), transparent 43%), linear-gradient(135deg, #04100f 0%, #09201c 47%, #061613 100%)"
        visualNavTone="light"
      />

      {/* ─────────────────────────────────────────
          2. THE PROBLEM
      ───────────────────────────────────────── */}
      <section style={{ ...SECTION, backgroundColor: '#FAFAFA', paddingTop: '80px', paddingBottom: '80px' }}>
        <ScrollAnimatedSection>
          <div style={CONTAINER}>

            <div style={{ ...f, ...LABEL_STYLE }}>The Problem</div>

            <p
              style={{
                ...f,
                fontSize: '22px',
                lineHeight: '36px',
                fontWeight: 400,
                color: '#000',
                maxWidth: '740px',
                marginBottom: '48px',
              }}
            >
              People ask AI the same question five times — not from laziness, but because{' '}
              <strong>there&apos;s no bridge between &ldquo;I got an answer&rdquo; and &ldquo;I actually know this.&rdquo;</strong>{' '}
              The knowledge stays in the chat window, never in their head.
            </p>

            <div className="flex flex-row" style={{ gap: '20px' }}>
              {[
                {
                  icon: (
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  ),
                  title: 'AI as a Crutch',
                  body: 'Users ask AI the same questions repeatedly because the answer never gets internalized — it stays in the chat window, not in their head.',
                },
                {
                  icon: (
                    <>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </>
                  ),
                  title: 'Capture Friction',
                  body: 'Manually creating study cards from AI answers is too tedious — users never bridge the gap between getting an answer and learning it.',
                },
                {
                  icon: (
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  ),
                  title: 'Knowledge Fades',
                  body: "Even when users save notes, there's no system to resurface them at the right time — knowledge decays without spaced repetition.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  style={{
                    backgroundColor: '#FFF',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '12px',
                    padding: '24px',
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      border: '1px solid rgba(0,0,0,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '40px',
                    }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {card.icon}
                    </svg>
                  </div>
                  <h4 style={{ ...f, ...textStyle.h5, color: '#000', marginBottom: '8px' }}>
                    {card.title}
                  </h4>
                  <p style={{ ...f, ...textStyle.body, color: 'rgba(0,0,0,0.7)', margin: 0 }}>
                    {card.body}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </ScrollAnimatedSection>
      </section>

      {/* ─────────────────────────────────────────
          2.5. DESIGN PROCESS
      ───────────────────────────────────────── */}
      <section style={{ ...SECTION, backgroundColor: '#FAFAFA', paddingTop: '80px', paddingBottom: '80px' }}>
        <ScrollAnimatedSection>
          <div style={CONTAINER}>

            <div style={{ ...f, ...LABEL_STYLE }}>Design Process</div>
            <h2 style={{ ...f, fontSize: '28px', lineHeight: '36px', fontWeight: 500, color: '#000', marginBottom: '10px' }}>
              From Observation to Shipped Product
            </h2>
            <p style={{ ...f, ...textStyle.leadSm, color: 'rgba(0,0,0,0.55)', maxWidth: '540px', marginBottom: '44px' }}>
              8 weeks, one person, two major rounds of testing. Here&apos;s how the product evolved from a
              single observation into a shipped app.
            </p>

            {/* Process timeline */}
            <div style={{ position: 'relative' as const, marginBottom: '56px' }}>

              {/* Connecting line */}
              <div
                style={{
                  position: 'absolute' as const,
                  top: '20px',
                  left: '20px',
                  right: '20px',
                  height: '1px',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  zIndex: 0,
                }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', position: 'relative' as const, zIndex: 1 }}>
                {[
                  {
                    n: '01',
                    phase: 'Research',
                    title: 'User Interviews',
                    desc: '8 interviews across students, professionals, and language learners. Key observation: they keep asking AI the same questions.',
                    tag: '2 weeks',
                  },
                  {
                    n: '02',
                    phase: 'Synthesis',
                    title: 'Core Insight',
                    desc: 'The problem isn\'t AI quality — it\'s that nothing bridges "got an answer" and "actually know this." People need a retention layer.',
                    tag: '3 days',
                  },
                  {
                    n: '03',
                    phase: 'Build',
                    title: 'MVP Development',
                    desc: 'Designed and shipped the core loop: AI card generation + spaced repetition engine. Cut everything else to validate the fundamentals.',
                    tag: '3 weeks',
                  },
                  {
                    n: '04',
                    phase: 'Test',
                    title: 'TestFlight Round 1',
                    desc: '6 sessions. Found: card creation was the drop-off point. AI generation redesigned as the primary path. Manual entry became secondary.',
                    tag: '1 week',
                  },
                  {
                    n: '05',
                    phase: 'Iterate',
                    title: 'Platform Expansion',
                    desc: 'Explore, smarter lesson creation, and Assistant upgrades — Quiz me with lesson pickers plus one-tap "new lesson" from generated terms. Feature questions replaced basic how-tos.',
                    tag: '2 weeks',
                  },
                ].map((item, i) => (
                  <div key={item.n} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-start' }}>
                    {/* Dot */}
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: i === 4 ? '#000' : '#FFF',
                        border: `1px solid ${i === 4 ? '#000' : 'rgba(0,0,0,0.15)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px',
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          ...f,
                          fontSize: '10px',
                          fontWeight: 700,
                          color: i === 4 ? '#FFF' : 'rgba(0,0,0,0.5)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {item.n}
                      </span>
                    </div>
                    {/* Content */}
                    <div
                      style={{
                        ...f,
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase' as const,
                        color: 'rgba(0,0,0,0.35)',
                        marginBottom: '4px',
                      }}
                    >
                      {item.phase}
                    </div>
                    <div style={{ ...f, fontSize: '14px', fontWeight: 600, color: '#000', marginBottom: '8px' }}>
                      {item.title}
                    </div>
                    <p style={{ ...f, fontSize: '13px', lineHeight: '20px', color: 'rgba(0,0,0,0.55)', margin: '0 0 10px' }}>
                      {item.desc}
                    </p>
                    <div
                      style={{
                        ...f,
                        fontSize: '11px',
                        fontWeight: 500,
                        color: 'rgba(0,0,0,0.4)',
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        borderRadius: '100px',
                        padding: '3px 10px',
                      }}
                    >
                      {item.tag}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Research quotes */}
            <div
              style={{
                ...f,
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                color: 'rgba(0,0,0,0.35)',
                marginBottom: '16px',
              }}
            >
              What We Heard
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                {
                  quote: 'I ask ChatGPT the same questions about Python syntax at least once a week. I just can\'t seem to make it stick.',
                  persona: 'Working professional, software adjacent',
                },
                {
                  quote: 'I take notes when I\'m studying but I never go back to them. I just search for it again next time I need it.',
                  persona: 'University student, exam prep',
                },
                {
                  quote: 'I use Anki but making the cards takes longer than actually learning. So I just don\'t make them.',
                  persona: 'Language learner, Japanese',
                },
              ].map((q) => (
                <div
                  key={q.persona}
                  style={{
                    backgroundColor: '#FFF',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="rgba(0,0,0,0.15)"
                    style={{ marginBottom: '12px', display: 'block' }}
                  >
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                  </svg>
                  <p style={{ ...f, fontSize: '14px', lineHeight: '22px', color: '#000', marginBottom: '12px', fontStyle: 'italic' as const }}>
                    {q.quote}
                  </p>
                  <span style={{ ...f, fontSize: '12px', color: 'rgba(0,0,0,0.4)' }}>
                    — {q.persona}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </ScrollAnimatedSection>
      </section>

      {/* ─────────────────────────────────────────
          3. THE LEARNING LOOP
      ───────────────────────────────────────── */}
      <section style={{ ...SECTION, backgroundColor: '#F0F0F0', paddingTop: '80px', paddingBottom: '80px' }}>
        <ScrollAnimatedSection>
          <div style={CONTAINER}>

            <div style={{ ...f, ...LABEL_STYLE }}>The Solution</div>
            <h2 style={{ ...f, fontSize: '28px', lineHeight: '36px', fontWeight: 500, color: '#000', marginBottom: '10px' }}>
              The Learning Loop
            </h2>
            <p style={{ ...f, ...textStyle.leadSm, color: 'rgba(0,0,0,0.6)', maxWidth: '560px', marginBottom: '40px' }}>
              Every part of MemQ serves one workflow. Only the knowledge you personally asked about ever enters it.
            </p>

            {/* 4-step grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '2px',
              }}
            >
              {[
                {
                  n: '01',
                  title: 'Ask AI',
                  desc: 'Type a question, topic, or concept you want to learn. No templates — just ask naturally.',
                  icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
                  dark: false,
                },
                {
                  n: '02',
                  title: 'Generate Cards',
                  desc: 'AI creates structured knowledge cards — vocabulary gets definitions, concepts get "Why" and "How" questions.',
                  icon: (
                    <>
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </>
                  ),
                  dark: false,
                },
                {
                  n: '03',
                  title: 'Spaced Repetition',
                  desc: 'The memory curve resurfaces cards at optimal intervals. Review sessions take minutes, not hours.',
                  icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
                  dark: false,
                },
                {
                  n: '04',
                  title: 'Master It',
                  desc: 'Knowledge moves from short-term recall to long-term retention. You stop asking AI — because you already know.',
                  icon: (
                    <>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </>
                  ),
                  dark: true,
                },
              ].map((step, i) => (
                <div
                  key={step.n}
                  style={{
                    backgroundColor: step.dark ? '#1A1A1A' : '#FFF',
                    padding: '28px',
                    borderRadius:
                      i === 0 ? '12px 0 0 12px' : i === 3 ? '0 12px 12px 0' : '0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
                    <span
                      style={{
                        ...f,
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: step.dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)',
                      }}
                    >
                      {step.n}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={step.dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {step.icon}
                    </svg>
                  </div>
                  <h3
                    style={{
                      ...f,
                      fontSize: '17px',
                      lineHeight: '24px',
                      fontWeight: 600,
                      color: step.dark ? '#FFF' : '#000',
                      marginBottom: '10px',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      ...f,
                      fontSize: '14px',
                      lineHeight: '22px',
                      color: step.dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                      margin: 0,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* User Journey arc */}
            <div style={{ marginTop: '40px' }}>
              <div
                style={{
                  ...f,
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase' as const,
                  color: 'rgba(0,0,0,0.35)',
                  marginBottom: '20px',
                }}
              >
                User Journey · From Dependency to Ownership
              </div>

              <div style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '32px 28px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', position: 'relative' as const }}>

                  {/* Connecting line */}
                  <div
                    style={{
                      position: 'absolute' as const,
                      top: '16px',
                      left: '10%',
                      right: '10%',
                      height: '2px',
                      background: 'linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.15) 50%, #000 100%)',
                      zIndex: 0,
                    }}
                  />

                  {[
                    {
                      stage: 'Discovery',
                      emoji: '🤔',
                      feeling: 'Frustrated',
                      moment: '"I\'ve asked this five times already."',
                      desc: 'Realizes AI answers never stick',
                      dark: false,
                    },
                    {
                      stage: 'First Card',
                      emoji: '😮',
                      feeling: 'Surprised',
                      moment: '"That took 3 seconds?"',
                      desc: 'AI generates cards from their question',
                      dark: false,
                    },
                    {
                      stage: 'First Review',
                      emoji: '😌',
                      feeling: 'Engaged',
                      moment: '"Oh — I actually remember this."',
                      desc: 'Spaced repetition surfaces a card at the right moment',
                      dark: false,
                    },
                    {
                      stage: 'Building Habit',
                      emoji: '💪',
                      feeling: 'Committed',
                      moment: '"2 minutes a day is enough."',
                      desc: 'Daily review becomes automatic, not effortful',
                      dark: false,
                    },
                    {
                      stage: 'Mastery',
                      emoji: '🎯',
                      feeling: 'Confident',
                      moment: '"I stopped needing to ask."',
                      desc: 'Knowledge is internalized, AI dependency broken',
                      dark: true,
                    },
                  ].map((item, i) => (
                    <div
                      key={item.stage}
                      style={{
                        position: 'relative' as const,
                        zIndex: 1,
                        paddingRight: i < 4 ? '12px' : '0',
                      }}
                    >
                      {/* Dot on line */}
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: item.dark ? '#000' : '#F0F0F0',
                          border: item.dark ? 'none' : '1px solid rgba(0,0,0,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          marginBottom: '20px',
                        }}
                      >
                        {item.emoji}
                      </div>

                      <div style={{ ...f, fontSize: '11px', fontWeight: 700, color: item.dark ? '#000' : 'rgba(0,0,0,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '4px' }}>
                        {item.feeling}
                      </div>
                      <div style={{ ...f, fontSize: '14px', fontWeight: 600, color: '#000', marginBottom: '6px' }}>
                        {item.stage}
                      </div>
                      <p style={{ ...f, fontSize: '12px', lineHeight: '18px', color: 'rgba(0,0,0,0.5)', margin: '0 0 10px' }}>
                        {item.desc}
                      </p>
                      <p style={{ ...f, fontSize: '12px', lineHeight: '18px', color: '#000', fontStyle: 'italic' as const, margin: 0 }}>
                        {item.moment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </ScrollAnimatedSection>
      </section>

      {/* ─────────────────────────────────────────
          4. PHASE 1 — MVP
      ───────────────────────────────────────── */}
      <section style={{ ...SECTION, backgroundColor: '#FAFAFA', paddingTop: '80px', paddingBottom: '80px' }}>
        <ScrollAnimatedSection>
          <div style={CONTAINER}>

            {/* Phase tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#000',
                borderRadius: '100px',
                padding: '4px 14px',
                marginBottom: '24px',
              }}
            >
              <span style={{ ...f, fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', color: '#FFF', textTransform: 'uppercase' as const }}>
                Phase 01 · MVP
              </span>
            </div>

            <h2 style={{ ...f, fontSize: '28px', lineHeight: '36px', fontWeight: 500, color: '#000', marginBottom: '48px' }}>
              Ship the Core Loop
            </h2>

            <div style={{ display: 'flex', gap: '64px', alignItems: 'flex-start' }}>

              {/* Left: text */}
              <div style={{ flex: 1 }}>
                <p style={{ ...f, fontSize: '17px', lineHeight: '30px', color: '#000', marginBottom: '20px' }}>
                  The MVP was built to validate one thing: can we make the jump from &ldquo;I asked AI&rdquo;
                  to &ldquo;I actually learned this&rdquo; feel effortless? Instead of making users build
                  flashcard decks manually, MemQ lets you type a question or topic, and the AI generates
                  structured knowledge cards ready to study.
                </p>
                <p style={{ ...f, fontSize: '17px', lineHeight: '30px', color: '#000', marginBottom: '36px' }}>
                  The spaced repetition engine does the rest — surfacing cards at the right intervals so
                  knowledge moves from short-term recall to long-term retention. Every card in your library
                  is something <em>you</em> wanted to learn.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '14px' }}>
                  {[
                    {
                      title: 'AI Card Generation',
                      desc: 'Type a topic or question, get structured knowledge cards instantly.',
                    },
                    {
                      title: 'Context-aware Formatting',
                      desc: 'Vocabulary gets definitions and examples; concepts get "Why" and "How" questions.',
                    },
                    {
                      title: 'Spaced Repetition Engine',
                      desc: 'The memory curve resurfaces cards at optimal intervals for long-term retention.',
                    },
                  ].map((feat) => (
                    <div key={feat.title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: '#000',
                          marginTop: '11px',
                          flexShrink: 0,
                        }}
                      />
                      <p style={{ ...f, fontSize: '15px', lineHeight: '26px', color: '#000', margin: 0 }}>
                        <strong>{feat.title}</strong> — {feat.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: phone video（浅灰实线描边，避免半透明黑边在浅底上偏深） */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '260px',
                    aspectRatio: '9/19.5',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid #EDEDED',
                    backgroundColor: '#000',
                  }}
                >
                  <video
                    src="/img/MemQ Video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              </div>

            </div>

          </div>
        </ScrollAnimatedSection>
      </section>

      {/* ─────────────────────────────────────────
          5. PHASE 2 — ITERATION
      ───────────────────────────────────────── */}
      <section style={{ ...SECTION, backgroundColor: '#FAFAFA', paddingTop: '80px', paddingBottom: '80px' }}>
        <ScrollAnimatedSection>
          <div style={CONTAINER}>

            {/* Phase tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#1A1A1A',
                borderRadius: '100px',
                padding: '4px 14px',
                marginBottom: '24px',
              }}
            >
              <span style={{ ...f, fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', color: '#FFF', textTransform: 'uppercase' as const }}>
                Phase 02 · Iteration
              </span>
            </div>

            <h2 style={{ ...f, fontSize: '28px', lineHeight: '36px', fontWeight: 500, color: '#000', marginBottom: '12px' }}>
              Explore Platform, Assistant & Smarter Creation
            </h2>
            <p style={{ ...f, ...textStyle.leadSm, color: 'rgba(0,0,0,0.6)', maxWidth: '640px', marginBottom: '56px' }}>
              After validating the core loop, Phase 02 layered on a curated Explore experience, a redesigned lesson-creation
              path, and a stronger AI Assistant — including a new <strong>Quiz me</strong> mode where learners pick any lesson
              to practice, plus a direct <strong>Create new lesson</strong> action when assistant-generated terms deserve
              their own deck.
            </p>

            {/* ── Lesson creation: visual flow ── */}
            <h3 style={{ ...f, fontSize: '18px', lineHeight: '26px', fontWeight: 500, color: '#000', marginBottom: '20px' }}>
              Redesigned Lesson Creation
            </h3>

            <div
              style={{
                display: 'flex',
                gap: '64px',
                alignItems: 'flex-start',
                marginBottom: '48px',
                flexWrap: 'wrap' as const,
              }}
            >
              {/* 左侧：Before / After 流程说明 */}
              <div style={{ flex: '1 1 300px', minWidth: 0, display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
              {/* BEFORE row */}
              <div style={{ backgroundColor: '#FFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '24px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <span style={{ ...f, fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.3)' }}>
                    Before
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(0,0,0,0.07)' }} />
                  <span style={{ ...f, fontSize: '12px', color: 'rgba(0,0,0,0.4)', fontStyle: 'italic' as const }}>
                    Manual terms, topic→AI, or PDF/Doc upload — but no clean way to fix just one term
                  </span>
                </div>

                {/* Flow row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' as const, paddingBottom: '4px' }}>
                  {[
                    { label: 'Lesson shell first', sub: 'Structure before content felt right', warn: true },
                    null,
                    { label: 'Manual terms', sub: 'Create & edit by hand' },
                    null,
                    { label: 'Topic → AI', sub: 'Generate from a topic' },
                    null,
                    { label: 'Upload PDF / Doc', sub: 'AI analyzes & drafts cards' },
                    null,
                    { label: 'One off card?', sub: 'Rework by hand or redo the batch', warn: true },
                  ].map((item, i) => {
                    if (item === null) {
                      return (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                        </svg>
                      );
                    }
                    return (
                      <div
                        key={item.label}
                        style={{
                          flexShrink: 0,
                          backgroundColor: item.warn ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.03)',
                          border: `1px solid ${item.warn ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.08)'}`,
                          borderRadius: '8px',
                          padding: '10px 14px',
                          minWidth: '100px',
                        }}
                      >
                        <div style={{ ...f, fontSize: '13px', fontWeight: item.warn ? 600 : 400, color: item.warn ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.7)' }}>
                          {item.label}
                        </div>
                        <div style={{ ...f, fontSize: '11px', color: 'rgba(0,0,0,0.35)', marginTop: '2px' }}>
                          {item.sub}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span style={{ ...f, fontSize: '12px', color: 'rgba(0,0,0,0.4)' }}>
                    All three creation paths existed, yet naming and scaffolding still ran ahead of the material — and a single weak term meant painful rework.
                  </span>
                </div>
              </div>

              {/* AFTER row */}
              <div style={{ backgroundColor: '#FFF', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '12px', padding: '24px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <span style={{ ...f, fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#000' }}>
                    After
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(0,0,0,0.1)' }} />
                  <span style={{ ...f, fontSize: '12px', color: 'rgba(0,0,0,0.5)', fontStyle: 'italic' as const }}>
                    Same three ways in — plus regenerate AI content for a single term, and name the lesson when it&apos;s ready
                  </span>
                </div>

                {/* Flow row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' as const, paddingBottom: '4px' }}>
                  {[
                    { label: 'Manual terms', sub: 'Create & edit by hand' },
                    null,
                    { label: 'Topic → AI', sub: 'Generate from a topic' },
                    null,
                    { label: 'Upload PDF / Doc', sub: 'AI analyzes & drafts cards' },
                    null,
                    { label: 'Regenerate term', sub: 'One card, new AI pass', highlight: true },
                    null,
                    { label: 'Name lesson', sub: 'Title after content lands' },
                  ].map((item, i) => {
                    if (item === null) {
                      return (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                        </svg>
                      );
                    }
                    return (
                      <div
                        key={item.label}
                        style={{
                          flexShrink: 0,
                          backgroundColor: item.highlight ? '#000' : 'rgba(0,0,0,0.04)',
                          border: `1px solid ${item.highlight ? '#000' : 'rgba(0,0,0,0.1)'}`,
                          borderRadius: '8px',
                          padding: '10px 14px',
                          minWidth: '110px',
                        }}
                      >
                        <div style={{ ...f, fontSize: '13px', fontWeight: 500, color: item.highlight ? '#FFF' : 'rgba(0,0,0,0.85)' }}>
                          {item.label}
                        </div>
                        <div style={{ ...f, fontSize: '11px', color: item.highlight ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)', marginTop: '2px' }}>
                          {item.sub}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span style={{ ...f, fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>
                    Matches how people think: pick the material first, label the lesson when you&apos;re done — not the other way around.
                  </span>
                </div>
              </div>
              </div>

              {/* 右侧：新版流程演示视频（规格与 Ship the Core Loop 一致；浅灰实线描边） */}
              <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '260px',
                    aspectRatio: '9/19.5',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid #EDEDED',
                    backgroundColor: '#000',
                  }}
                >
                  <video
                    src="/img/MemQ/Scene-1.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              </div>
            </div>

            {/* ── AI Assistant & Quiz me ── */}
            <div
              style={{
                backgroundColor: '#FFF',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '12px',
                padding: '28px 32px',
                marginBottom: '40px',
              }}
            >
              <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
                <div style={{ flex: '1 1 280px', minWidth: 0 }}>
                  <h3 style={{ ...f, fontSize: '18px', lineHeight: '26px', fontWeight: 500, color: '#000', marginBottom: '12px' }}>
                    AI Assistant & Quiz me
                  </h3>
                  <p style={{ ...f, fontSize: '15px', lineHeight: '26px', color: 'rgba(0,0,0,0.65)', marginBottom: '20px' }}>
                    The assistant stayed grounded in personal decks, but got clearer structure and faster study loops — so
                    asking, saving, and drilling read as one product instead of disconnected experiments.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                    {[
                      'Assistant IA, prompts, and save flows tuned for quicker daily Q&A',
                      'New Quiz me tab: AI-driven practice on real lesson cards',
                      'Lesson picker inside Quiz me — choose which deck to drill against',
                      'Generated terms: add Create new lesson to spin strong suggestions into their own lesson',
                    ].map((feat) => (
                      <div key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="rgba(0,0,0,0.45)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ marginTop: '5px', flexShrink: 0 }}
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span style={{ ...f, fontSize: '14px', lineHeight: '22px', color: 'rgba(0,0,0,0.72)' }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 右侧：Assistant / Quiz 截图横排 */}
                <div
                  style={{
                    flex: '1 1 200px',
                    display: 'flex',
                    flexDirection: 'row' as const,
                    gap: '10px',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    minWidth: 0,
                  }}
                >
                  {['/img/MemQ/AI1.PNG', '/img/MemQ/AI2.PNG'].map((src, i) => (
                    <div key={src} style={{ flex: '1 1 0', minWidth: 0 }}>
                      <div
                        style={{
                          width: '100%',
                          aspectRatio: '9 / 19.5',
                          borderRadius: '32px',
                          overflow: 'hidden',
                          border: '1px solid rgba(0,0,0,0.1)',
                          backgroundColor: '#F5F5F5',
                          position: 'relative',
                        }}
                      >
                        <Image
                          src={src}
                          alt={`MemQ AI Assistant screenshot ${i + 1}`}
                          fill
                          sizes="(max-width: 900px) 42vw, 22vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Explore Platform ── */}
            <div
              style={{
                backgroundColor: '#191919',
                borderRadius: '12px',
                padding: '40px',
              }}
            >
              <div style={{ display: 'flex', gap: '56px', alignItems: 'flex-start' }}>

                {/* Left */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <h3 style={{ ...f, fontSize: '20px', lineHeight: '28px', fontWeight: 600, color: '#FFF', margin: 0 }}>
                      Explore Platform
                    </h3>
                  </div>
                  <p style={{ ...f, fontSize: '16px', lineHeight: '28px', color: 'rgba(255,255,255,0.75)', marginBottom: '24px' }}>
                    A curated library of high-quality lessons users can add to their library with one tap.
                    Power users can publish their own lessons for the community — turning MemQ into a shared
                    knowledge network, not just a personal study tool.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                    {[
                      'Curated lessons across popular learning topics',
                      'One-tap add to personal library',
                      'Publish your own lessons for others to learn from',
                    ].map((feat) => (
                      <div key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="rgba(255,255,255,0.4)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ marginTop: '5px', flexShrink: 0 }}
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span style={{ ...f, fontSize: '14px', lineHeight: '22px', color: 'rgba(255,255,255,0.65)' }}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 右侧：Explore 界面截图（横排三列） */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row' as const,
                    gap: '10px',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    minWidth: 0,
                  }}
                >
                  {['/img/MemQ/Explore1.PNG', '/img/MemQ/Explore2.PNG', '/img/MemQ/Explore3.PNG'].map((src, i) => (
                    <div key={src} style={{ flex: '1 1 0', minWidth: 0 }}>
                      <div
                        style={{
                          width: '100%',
                          aspectRatio: '9 / 19.5',
                          borderRadius: '20px',
                          overflow: 'hidden',
                          border: '1px solid rgba(255,255,255,0.14)',
                          backgroundColor: 'rgba(0,0,0,0.35)',
                          position: 'relative',
                        }}
                      >
                        <Image
                          src={src}
                          alt={`MemQ Explore platform screenshot ${i + 1}`}
                          fill
                          sizes="(max-width: 900px) 30vw, 33vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </ScrollAnimatedSection>
      </section>

      {/* ─────────────────────────────────────────
          6. DESIGN SYSTEM — EDITORIAL
      ───────────────────────────────────────── */}
      <section style={{ ...SECTION, backgroundColor: '#F5F4F0', paddingTop: '80px', paddingBottom: '80px' }}>
        <ScrollAnimatedSection>
          <div style={CONTAINER}>

            {/* ── Header ── */}
            <div style={{ ...f, ...LABEL_STYLE }}>Visual Design · Iteration</div>

            <div style={{ display: 'flex', gap: '64px', alignItems: 'flex-end', marginBottom: '32px' }}>
              <h2
                style={{
                  ...f,
                  fontSize: '56px',
                  lineHeight: '60px',
                  fontWeight: 300,
                  letterSpacing: '-0.025em',
                  color: '#1A1A18',
                  margin: 0,
                  flexShrink: 0,
                }}
              >
                Editorial
              </h2>
              <p style={{ ...f, fontSize: '16px', lineHeight: '26px', color: 'rgba(26,26,24,0.55)', maxWidth: '520px', marginBottom: '4px' }}>
                A quiet, typography-first system for spaced-repetition learning. Borrowed from editorial
                print — generous hierarchy, hairline rules, restrained colour. The screen treated as a page.
                One accent. One surface tone. One radius scale. Decisions, not options.
              </p>
            </div>

            {/* Hairline rule */}
            <div style={{ height: '1px', backgroundColor: 'rgba(26,26,24,0.12)', marginBottom: '40px' }} />

            {/* ── Rules + Color side by side ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '16px' }}>

              {/* Editorial Behaviour rules */}
              <div>
                <div
                  style={{
                    ...f,
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase' as const,
                    color: 'rgba(26,26,24,0.4)',
                    marginBottom: '20px',
                  }}
                >
                  Editorial Behaviour
                </div>

                {[
                  {
                    n: 'i.',
                    title: 'Type before chrome',
                    desc: 'Hierarchy by weight, scale, and white space — not boxes, shadows, or accent fills. A heading does the work a card would do elsewhere.',
                  },
                  {
                    n: 'ii.',
                    title: 'One semantic accent',
                    desc: 'Teal #1A8A72 reserved for state: due cards, active tabs, primary actions, mastery progress. It earns attention because it is rare.',
                  },
                  {
                    n: 'iii.',
                    title: 'Hairlines, not shadows',
                    desc: '1px borders on warm white separate regions. Shadows not used. Surfaces are flat and meet at clean edges.',
                  },
                  {
                    n: 'iv.',
                    title: 'Numbers are display',
                    desc: 'Streak counts, queue totals, mastery percentages set in the heaviest grotesk weight at large sizes. Data is the headline.',
                  },
                  {
                    n: 'v.',
                    title: 'Cards in a stream',
                    desc: 'Distinct rounded cards with 8px gaps — never flush list-rows. Each card is its own object on the page canvas.',
                  },
                  {
                    n: 'vi.',
                    title: 'One elevated action',
                    desc: 'Create is the one moment shadow appears: a circular FAB raised above the tab bar. Every other surface is flat.',
                  },
                ].map((rule, i) => (
                  <div
                    key={rule.n}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      borderTop: '1px solid rgba(26,26,24,0.08)',
                    }}
                  >
                    <span
                      style={{
                        ...f,
                        fontSize: '13px',
                        fontStyle: 'italic' as const,
                        color: 'rgba(26,26,24,0.35)',
                        flexShrink: 0,
                        width: '20px',
                        paddingTop: '1px',
                      }}
                    >
                      {rule.n}
                    </span>
                    <div>
                      <div style={{ ...f, fontSize: '14px', fontWeight: 600, color: '#1A1A18', marginBottom: '4px' }}>
                        {rule.title}
                      </div>
                      <p style={{ ...f, fontSize: '13px', lineHeight: '20px', color: 'rgba(26,26,24,0.55)', margin: 0 }}>
                        {rule.desc}
                      </p>
                    </div>
                  </div>
                ))}
                {/* Close last rule border */}
                <div style={{ height: '1px', backgroundColor: 'rgba(26,26,24,0.08)' }} />
              </div>

              {/* Right column: Color + Type */}
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>

                {/* Color tokens */}
                <div
                  style={{
                    backgroundColor: '#FDFCF9',
                    border: '1px solid rgba(26,26,24,0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                  }}
                >
                  <div
                    style={{
                      ...f,
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase' as const,
                      color: 'rgba(26,26,24,0.4)',
                      marginBottom: '18px',
                    }}
                  >
                    Colour Tokens
                  </div>

                  {/* Accent full-width swatch — most important token */}
                  <div style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        height: '56px',
                        borderRadius: '8px',
                        backgroundColor: '#1A8A72',
                        marginBottom: '8px',
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ ...f, fontSize: '12px', fontWeight: 600, color: '#1A1A18' }}>Accent</span>
                      <span style={{ ...f, fontSize: '11px', color: 'rgba(26,26,24,0.4)', letterSpacing: '0.04em' }}>#1A8A72</span>
                    </div>
                    <div style={{ ...f, fontSize: '11px', color: 'rgba(26,26,24,0.4)', marginTop: '2px' }}>
                      Due · Active · Primary · Mastery
                    </div>
                  </div>

                  <div style={{ height: '1px', backgroundColor: 'rgba(26,26,24,0.08)', marginBottom: '12px' }} />

                  {/* Other tokens grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {[
                      { name: 'Canvas', val: '#F9F8F5', color: '#F9F8F5', border: 'rgba(26,26,24,0.1)' },
                      { name: 'Surface', val: '#FFFFFF', color: '#FFFFFF', border: 'rgba(26,26,24,0.1)' },
                      { name: 'Muted', val: 'rgba(26,26,24,0.05)', color: 'rgba(26,26,24,0.05)', border: 'rgba(26,26,24,0.1)' },
                      { name: 'Ink', val: '#1A1A18', color: '#1A1A18', border: 'transparent' },
                      { name: 'Ink Dim', val: '45% opacity', color: 'rgba(26,26,24,0.45)', border: 'transparent' },
                      { name: 'Hairline', val: '10% opacity', color: 'rgba(26,26,24,0.1)', border: 'rgba(26,26,24,0.1)' },
                    ].map((token) => (
                      <div key={token.name}>
                        <div
                          style={{
                            height: '36px',
                            borderRadius: '6px',
                            backgroundColor: token.color,
                            border: `1px solid ${token.border}`,
                            marginBottom: '6px',
                          }}
                        />
                        <div style={{ ...f, fontSize: '11px', fontWeight: 600, color: '#1A1A18', marginBottom: '1px' }}>
                          {token.name}
                        </div>
                        <div style={{ ...f, fontSize: '10px', color: 'rgba(26,26,24,0.4)' }}>
                          {token.val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Type scale */}
                <div
                  style={{
                    backgroundColor: '#FDFCF9',
                    border: '1px solid rgba(26,26,24,0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                  }}
                >
                  <div
                    style={{
                      ...f,
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase' as const,
                      color: 'rgba(26,26,24,0.4)',
                      marginBottom: '16px',
                    }}
                  >
                    Type Scale
                  </div>
                  {[
                    { label: 'Display', size: '34px', weight: 800, sample: 'MemQ', color: '#1A1A18' },
                    { label: 'Title', size: '22px', weight: 600, sample: 'Your Lessons', color: '#1A1A18' },
                    { label: 'Body', size: '17px', weight: 400, sample: 'Due in 2 days', color: '#1A1A18' },
                    { label: 'Caption', size: '12px', weight: 500, sample: '12 CARDS DUE', color: 'rgba(26,26,24,0.5)' },
                  ].map((t, i, arr) => (
                    <div
                      key={t.label}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        gap: '8px',
                        paddingTop: i === 0 ? 0 : '12px',
                        paddingBottom: '12px',
                        borderBottom: i < arr.length - 1 ? '1px solid rgba(26,26,24,0.06)' : 'none',
                      }}
                    >
                      <span style={{ ...f, fontSize: t.size, fontWeight: t.weight, color: t.color, lineHeight: 1.2, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                        {t.sample}
                      </span>
                      <span style={{ ...f, fontSize: '10px', color: 'rgba(26,26,24,0.3)', flexShrink: 0 }}>
                        {t.size}/{t.weight}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* ── iv. Numbers as Display ── */}
            <div
              style={{
                backgroundColor: '#FDFCF9',
                border: '1px solid rgba(26,26,24,0.1)',
                borderRadius: '12px',
                padding: '32px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  ...f,
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase' as const,
                  color: 'rgba(26,26,24,0.4)',
                  marginBottom: '24px',
                }}
              >
                iv. Numbers are Display
              </div>

              <div style={{ display: 'flex', gap: '0', alignItems: 'flex-end' }}>
                {[
                  { val: '127', label: 'day streak', teal: false },
                  { val: '85%', label: 'mastery', teal: true },
                  { val: '32', label: 'due today', teal: true },
                  { val: '14d', label: 'next review', teal: false },
                ].map((num, i) => (
                  <div
                    key={num.val}
                    style={{
                      flex: 1,
                      paddingRight: '32px',
                      borderRight: i < 3 ? '1px solid rgba(26,26,24,0.08)' : 'none',
                      paddingLeft: i > 0 ? '32px' : '0',
                    }}
                  >
                    <div
                      style={{
                        ...f,
                        fontSize: '64px',
                        lineHeight: '64px',
                        fontWeight: 800,
                        color: num.teal ? '#1A8A72' : '#1A1A18',
                        letterSpacing: '-0.03em',
                        marginBottom: '8px',
                      }}
                    >
                      {num.val}
                    </div>
                    <div style={{ ...f, fontSize: '12px', color: 'rgba(26,26,24,0.45)', letterSpacing: '0.02em' }}>
                      {num.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Key Screens ── */}
            <div
              style={{
                backgroundColor: '#FDFCF9',
                border: '1px solid rgba(26,26,24,0.1)',
                borderRadius: '12px',
                padding: '28px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
                <div style={{ ...f, fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(26,26,24,0.4)' }}>
                  Key Screens
                </div>
                <div style={{ ...f, fontSize: '10px', color: 'rgba(26,26,24,0.3)', letterSpacing: '0.04em' }}>
                  In-app captures
                </div>
              </div>

              {/* 12 张：固定两行，每行 6 个 */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                  columnGap: '12px',
                  rowGap: '40px',
                }}
              >
                {MEMQ_KEY_SCREEN_ITEMS.map((item) => (
                  <div key={item.src} style={{ minWidth: 0 }}>
                    <div
                      style={{
                        width: '100%',
                        aspectRatio: '9 / 19.5',
                        borderRadius: '22px',
                        overflow: 'hidden',
                        border: '1px solid rgba(26,26,24,0.1)',
                        backgroundColor: '#FAFAF8',
                        position: 'relative',
                      }}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 768px) 16vw, (max-width: 1200px) 14vw, 12vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    {(item.title != null || item.caption != null) && (
                      <div style={{ marginTop: '12px' }}>
                        {item.title != null && (
                          <div style={{ ...f, fontSize: '12px', fontWeight: 600, color: 'rgba(26,26,24,0.7)' }}>{item.title}</div>
                        )}
                        {item.caption != null && (
                          <div style={{ ...f, fontSize: '11px', color: 'rgba(26,26,24,0.4)' }}>{item.caption}</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </ScrollAnimatedSection>
      </section>

      {/* ─────────────────────────────────────────
          7. IMPACT
      ───────────────────────────────────────── */}
      <section style={{ ...SECTION, backgroundColor: '#FAFAFA', paddingTop: '80px', paddingBottom: '80px' }}>
        <ScrollAnimatedSection>
          <div style={CONTAINER}>

            <div style={{ ...f, ...LABEL_STYLE }}>Impact</div>
            <h2 style={{ ...f, fontSize: '28px', lineHeight: '36px', fontWeight: 500, color: '#000', marginBottom: '12px' }}>
              The Loop Held Up in Testing
            </h2>
            <p style={{ ...f, ...textStyle.leadSm, color: 'rgba(0,0,0,0.6)', maxWidth: '600px', marginBottom: '48px' }}>
              Testers stopped asking &ldquo;how do I add a card&rdquo; and started asking &ldquo;can I import more file
              formats&rdquo; — the shift confirmed they&apos;d moved from onboarding friction into active daily use.
            </p>

            {/* Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '2px',
                marginBottom: '40px',
              }}
            >
              {[
                { val: '78%', label: 'preferred AI generation over manual entry' },
                { val: '85%', label: 'wanted content from their own materials, not pre-made decks' },
                { val: '0', label: 'critical drop-offs in the final validation round' },
              ].map((m, i) => (
                <div
                  key={m.val}
                  style={{
                    backgroundColor: '#FFF',
                    padding: '32px 28px',
                    borderRadius: i === 0 ? '12px 0 0 12px' : i === 2 ? '0 12px 12px 0' : '0',
                  }}
                >
                  <div style={{ ...f, fontSize: '52px', lineHeight: '60px', fontWeight: 300, color: '#000', marginBottom: '8px' }}>
                    {m.val}
                  </div>
                  <div style={{ ...f, fontSize: '13px', lineHeight: '20px', color: 'rgba(0,0,0,0.5)' }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Data charts */}
            <div className="flex flex-row" style={{ gap: '20px', marginBottom: '32px' }}>

              <div style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '32px', flex: 1 }}>
                <h4 style={{ ...f, fontSize: '15px', fontWeight: 600, color: '#000', marginBottom: '24px' }}>
                  Preferred method of card creation
                </h4>
                {[
                  { label: 'AI / Auto-generation', pct: 78 },
                  { label: 'Manual Typing', pct: 15 },
                  { label: 'Copy & Pasting', pct: 7 },
                ].map((d) => (
                  <div key={d.label} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ ...f, fontSize: '13px', color: '#000' }}>{d.label}</span>
                      <span style={{ ...f, fontSize: '13px', fontWeight: 600, color: '#000' }}>{d.pct}%</span>
                    </div>
                    <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(0,0,0,0.07)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${d.pct}%`, height: '100%', backgroundColor: '#000', borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
                <p style={{ ...f, fontSize: '12px', color: 'rgba(0,0,0,0.45)', marginTop: '20px', margin: 0 }}>
                  AI generation is the primary action — manual entry is a fallback, not the default.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '32px', flex: 1 }}>
                <h4 style={{ ...f, fontSize: '15px', fontWeight: 600, color: '#000', marginBottom: '24px' }}>
                  Importance of personalized study content
                </h4>
                {[
                  { label: 'Custom content (my own materials)', pct: 85 },
                  { label: 'Generic decks (pre-made lists)', pct: 15 },
                ].map((d) => (
                  <div key={d.label} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ ...f, fontSize: '13px', color: '#000' }}>{d.label}</span>
                      <span style={{ ...f, fontSize: '13px', fontWeight: 600, color: '#000' }}>{d.pct}%</span>
                    </div>
                    <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(0,0,0,0.07)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${d.pct}%`, height: '100%', backgroundColor: '#000', borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
                <p style={{ ...f, fontSize: '12px', color: 'rgba(0,0,0,0.45)', marginTop: '20px', margin: 0 }}>
                  Every card in MemQ was generated for you, from what you personally wanted to learn.
                </p>
              </div>

            </div>

            {/* Quote */}
            <div
              style={{
                backgroundColor: '#FFF',
                borderRadius: '12px',
                padding: '28px 32px',
                borderLeft: '3px solid #000',
              }}
            >
              <p style={{ ...f, fontSize: '17px', lineHeight: '28px', fontStyle: 'italic' as const, color: '#333', marginBottom: '10px' }}>
                &ldquo;This is the most seamless study experience I&apos;ve seen. I would feel 100% confident
                ditching my old messy notes for this.&rdquo;
              </p>
              <p style={{ ...f, fontSize: '13px', color: 'rgba(0,0,0,0.45)', margin: 0 }}>
                — Round 2 usability testing participant
              </p>
            </div>

          </div>
        </ScrollAnimatedSection>
      </section>

      {/* ─────────────────────────────────────────
          8. WHAT'S NEXT
      ───────────────────────────────────────── */}
      <section style={{ ...SECTION, backgroundColor: '#FAFAFA', paddingTop: '80px', paddingBottom: '120px' }}>
        <ScrollAnimatedSection>
          <div style={CONTAINER}>

            <div style={{ ...f, ...LABEL_STYLE }}>What&apos;s Next</div>
            <h2 style={{ ...f, fontSize: '28px', lineHeight: '36px', fontWeight: 500, color: '#000', marginBottom: '36px' }}>
              Future Directions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4" style={{ gap: '20px' }}>
              {[
                {
                  title: 'LLM & Browser Integration',
                  desc: 'A browser extension that intercepts AI chat sessions and lets users save any answer as a knowledge card in one tap — making the learn-from-AI workflow completely seamless.',
                  icon: (
                    <>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </>
                  ),
                },
                {
                  title: 'Richer Multi-modal Recall',
                  desc: 'Add image support — starting with camera capture — to reinforce memory at both the term and question level, tying abstract concepts to concrete visual cues.',
                  icon: (
                    <>
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </>
                  ),
                },
                // 词汇类卡片：发音、例句、同反义等专项深化
                {
                  title: 'Vocabulary-first Card Depth',
                  desc: 'Optimize vocabulary cards as a dedicated surface: pronunciation (audio and IPA where it helps), richer example sentences, and explicit synonym/antonym links — so language decks feel as deep as dedicated apps without breaking the MemQ review loop.',
                  icon: (
                    <>
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </>
                  ),
                },
                {
                  title: 'Social Learning Loops',
                  desc: "Build on the Explore platform with learning cohorts — where users can follow each other's progress, remix published lessons, and keep each other accountable.",
                  icon: (
                    <>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    backgroundColor: '#FFF',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '12px',
                    padding: '24px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      border: '1px solid rgba(0,0,0,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '40px',
                    }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {item.icon}
                    </svg>
                  </div>
                  <h4 style={{ ...f, ...textStyle.h5, color: '#000', marginBottom: '8px' }}>
                    {item.title}
                  </h4>
                  <p style={{ ...f, ...textStyle.body, color: 'rgba(0,0,0,0.65)', margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </ScrollAnimatedSection>
      </section>

      {/* ─────────────────────────────────────────
          APP STORE CTA
      ───────────────────────────────────────── */}
      <section
        style={{
          ...SECTION,
          backgroundColor: '#1A1916',
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ ...CONTAINER, textAlign: 'center' as const, padding: '0 24px' }}>

            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '100px', padding: '4px 12px 4px 8px', marginBottom: '28px',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#1A8A72', display: 'inline-block' }} />
              <span style={{ fontFamily: fontFamily.system, fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em' }}>
                AVAILABLE NOW
              </span>
            </div>

            <h2 style={{
              fontFamily: fontFamily.system,
              fontSize: '36px',
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '12px',
            }}>
              Try MemQ on iPhone
            </h2>

            <p style={{
              fontFamily: fontFamily.system,
              fontSize: '16px',
              color: 'rgba(255,255,255,0.45)',
              marginBottom: '36px',
              maxWidth: '400px',
              margin: '0 auto 36px',
              lineHeight: 1.6,
            }}>
              Turn any AI conversation into lasting knowledge. Free to download.
            </p>

            {/* App Store badge */}
            <a
              href="https://apps.apple.com/app/id6757248312"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#fff',
                borderRadius: '14px',
                padding: '12px 22px',
                textDecoration: 'none',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Apple logo */}
              <svg width="22" height="26" viewBox="0 0 24 28" fill="#000">
                <path d="M20.024 14.61c-.03-3.267 2.664-4.854 2.783-4.93-1.518-2.22-3.878-2.524-4.714-2.556-1.996-.203-3.914 1.178-4.928 1.178-1.012 0-2.56-1.153-4.218-1.12-2.153.034-4.146 1.252-5.252 3.163-2.253 3.904-.575 9.677 1.612 12.842 1.074 1.547 2.345 3.282 4.017 3.22 1.615-.065 2.222-1.038 4.174-1.038 1.954 0 2.516 1.038 4.22 1.003 1.74-.03 2.84-1.572 3.902-3.124 1.24-1.79 1.75-3.534 1.773-3.623-.038-.017-3.39-1.3-3.369-5.015zM16.79 5.178c.886-1.079 1.487-2.567 1.323-4.078-1.28.054-2.845.858-3.762 1.913-.82.945-1.547 2.481-1.355 3.934 1.43.11 2.889-.727 3.794-1.77z"/>
              </svg>
              <div style={{ textAlign: 'left' as const }}>
                <div style={{ fontFamily: fontFamily.system, fontSize: '10px', color: '#000', opacity: 0.6, letterSpacing: '0.04em', marginBottom: '1px' }}>Download on the</div>
                <div style={{ fontFamily: fontFamily.system, fontSize: '18px', fontWeight: 700, color: '#000', letterSpacing: '-0.01em', lineHeight: 1 }}>App Store</div>
              </div>
            </a>

            {/* Meta */}
            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              {['iOS 17+', 'iPhone', 'Free'].map((tag, i, arr) => (
                <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontFamily: fontFamily.system, fontSize: '12px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.02em' }}>{tag}</span>
                  {i < arr.length - 1 && <span style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'inline-block' }} />}
                </span>
              ))}
            </div>

          </div>
        </ScrollAnimatedSection>
      
          <div style={{ marginTop: '56px' }}>
            <CaseStudyBackButton />
          </div>
      </section>

      

    </div>
  );
}
