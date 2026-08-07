'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const blue = '#2459D3';
const ink = '#0A0A0A';
const muted = 'rgba(10, 10, 10, 0.58)';

type SectionProps = {
  children: React.ReactNode;
  hidden?: boolean;
  label: string;
  tone?: 'white' | 'soft';
};

function Section({ children, hidden, label, tone = 'white' }: SectionProps) {
  return (
    <section
      hidden={hidden}
      className="w-screen"
      data-case-nav-label={label}
      style={{
        backgroundColor: tone === 'soft' ? '#F7F9FC' : '#FFFFFF',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        padding: 'clamp(88px, 11vw, 152px) clamp(24px, 6vw, 96px)',
      }}
    >
      <div style={{ margin: '0 auto', maxWidth: '1200px' }}>{children}</div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: blue, fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', lineHeight: '18px', margin: '0 0 18px', textTransform: 'uppercase' }}>
      {children}
    </p>
  );
}

function Title({ children, width = '940px' }: { children: React.ReactNode; width?: string }) {
  return (
    <h1 style={{ color: ink, fontSize: 'clamp(40px, 5.3vw, 68px)', fontWeight: 400, letterSpacing: '-0.035em', lineHeight: 1.06, margin: '0 0 30px', maxWidth: width }}>
      {children}
    </h1>
  );
}

function Body({ children, width = '840px' }: { children: React.ReactNode; width?: string }) {
  return (
    <div style={{ color: muted, fontSize: 'clamp(17px, 1.7vw, 21px)', fontWeight: 300, lineHeight: 1.65, maxWidth: width }}>
      {children}
    </div>
  );
}

function Conclusion({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ borderTop: '1px solid rgba(10,10,10,0.14)', color: ink, fontSize: 'clamp(34px, 4.4vw, 56px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.12, margin: 'clamp(72px, 9vw, 112px) 0 0', maxWidth: '1120px', paddingTop: 'clamp(48px, 6vw, 72px)' }}>
      {children}
    </p>
  );
}

function StatusDot({ status }: { status: 'shipped' | 'progress' | 'planned' }) {
  return (
    <span
      aria-hidden="true"
      style={{
        background: status === 'shipped' ? blue : status === 'progress' ? `linear-gradient(90deg, ${blue} 50%, transparent 50%)` : 'transparent',
        border: `1px solid ${blue}`,
        borderRadius: '50%',
        display: 'inline-block',
        height: '10px',
        width: '10px',
      }}
    />
  );
}

function CapabilityList({ items, status }: { items: string[]; status: 'shipped' | 'progress' | 'planned' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto', paddingTop: '34px' }}>
      {items.map((item) => (
        <span key={item} style={{ alignItems: 'center', color: 'rgba(10,10,10,0.58)', display: 'flex', fontSize: '12px', gap: '10px', lineHeight: 1.4 }}>
          <StatusDot status={status} /> {item}
        </span>
      ))}
    </div>
  );
}

function PlatformVisual() {
  const [mode, setMode] = useState<'ranking' | 'outreach'>('ranking');
  return (
    <div style={{ background: '#F7F9FC', border: '1px solid rgba(10,10,10,0.09)', marginTop: '52px', padding: '14px' }}>
      <div style={{ display: 'flex', marginBottom: '12px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '999px', display: 'inline-flex', gap: '5px', padding: '4px' }}>
          {[
            ['ranking', 'Ranking MVP'],
            ['outreach', 'With outreach'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={mode === key}
              onClick={() => setMode(key as 'ranking' | 'outreach')}
              style={{ background: mode === key ? blue : 'transparent', border: 0, borderRadius: '999px', color: mode === key ? '#FFFFFF' : 'rgba(10,10,10,0.66)', cursor: 'pointer', fontSize: '12px', fontWeight: 500, padding: '7px 13px' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.42fr)]">
        <div style={{ alignItems: 'center', background: '#FFFFFF', border: '8px solid #E5E7EB', borderRadius: '20px', display: 'flex', height: 'clamp(260px, 33vw, 410px)', justifyContent: 'center', overflow: 'hidden' }}>
          <Image src={mode === 'outreach' ? '/img/connectnova/DashboardLayout.avif' : '/img/connectnova/Dashboard.avif'} alt={mode === 'outreach' ? 'ConnectNova platform with outreach' : 'ConnectNova ranking MVP'} width={1600} height={1000} sizes="(max-width: 768px) 100vw, 70vw" style={{ height: '100%', objectFit: 'contain', width: 'auto' }} />
        </div>
        <div style={{ alignItems: 'center', background: '#FFFFFF', border: '8px solid #E5E7EB', borderRadius: '20px', display: 'flex', height: 'clamp(260px, 33vw, 410px)', justifyContent: 'center', overflow: 'hidden' }}>
          <Image src="/img/connectnova/Extension_home.avif" alt="ConnectNova Chrome extension" width={600} height={1000} sizes="(max-width: 768px) 100vw, 30vw" style={{ height: '100%', objectFit: 'contain', width: 'auto' }} />
        </div>
      </div>
    </div>
  );
}

const stages = [
  { number: '01', phase: 'Source', title: 'Find the right people on LinkedIn', body: 'Collect relevant profiles without rebuilding the search in another platform.', items: ['Chrome Extension', 'LinkedIn profile collection', 'Search-result ranking'], status: 'shipped' as const },
  { number: '02', phase: 'Qualify', title: 'Understand who is worth pursuing', body: 'Define evaluation criteria, compare profiles, and review AI-assisted assessments within a shared Project.', items: ['Project-based organization', 'Editable evaluation criteria', 'Ranking and review'], status: 'shipped' as const },
  { number: '03', phase: 'Engage', title: 'Turn selected people into outreach', body: 'Move prioritized candidates or contacts into structured outreach workflows.', items: ['Campaigns', 'Leads', 'Messaging sequences'], status: 'progress' as const },
  { number: '04', phase: 'Manage', title: 'Preserve progress toward an outcome', body: 'Track where each person stands beyond the initial sourcing task.', items: ['Pipeline stages', 'Follow-up status', 'Final outcomes'], status: 'planned' as const },
];

const recruitingSteps = [
  ['01', 'Find candidates', 'Search across LinkedIn and LinkedIn Recruiter to identify potentially relevant profiles.'],
  ['02', 'Collect information', 'Open profiles individually and gather the experience, skills, and background required for evaluation.'],
  ['03', 'Organize profiles', 'Move selected candidates into spreadsheets or other tools to create a working shortlist.'],
  ['04', 'Compare and decide', 'Review candidates across disconnected sources before deciding who should move forward.'],
];

const salesSteps = [
  ['01', 'Find contacts', 'Use LinkedIn and Sales Navigator to identify relevant prospects and decision-makers.'],
  ['02', 'Enrich information', 'Gather additional role, company, and contact information through separate tools.'],
  ['03', 'Organize leads', 'Transfer promising contacts into spreadsheets or working lists for further review.'],
  ['04', 'Compare and prioritize', 'Assess which contacts best matched the target profile before taking the next step.'],
];

function WorkflowColumn({ title, steps }: { title: string; steps: string[][] }) {
  return (
    <div className="md:px-10 first:md:pl-0 last:md:border-l last:md:border-black/15 last:md:pr-0">
      <p style={{ color: blue, fontSize: '11px', fontWeight: 600, letterSpacing: '0.09em', margin: '0 0 28px', textTransform: 'uppercase' }}>{title}</p>
      {steps.map(([number, stepTitle, description]) => (
        <div key={number} style={{ borderTop: '1px solid rgba(10,10,10,0.12)', display: 'grid', gap: '12px', gridTemplateColumns: '42px 1fr', padding: '22px 0' }}>
          <span style={{ color: blue, fontSize: '11px', fontWeight: 600 }}>{number}</span>
          <div><h3 style={{ color: ink, fontSize: '18px', fontWeight: 500, margin: '0 0 8px' }}>{stepTitle}</h3><p style={{ color: muted, fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{description}</p></div>
        </div>
      ))}
    </div>
  );
}

const friction = [
  ['Repetitive profile review', 'Users repeatedly opened and checked profiles one by one.'],
  ['Fragmented information', 'Profile data, evaluation context, and working lists lived in different tools.'],
  ['Manual organization', 'Relevant people had to be copied, grouped, and maintained outside LinkedIn.'],
  ['Inconsistent prioritization', 'Without one workspace, users compared people through additional manual effort.'],
];

const projectQuestions = ['Why was this person collected?', 'Which requirements applied?', 'How did they compare with others?', 'Were they worth prioritizing?', 'What should happen next?'];

const contexts = [
  { label: 'Recruiting Project', intro: 'Create a Project around a role, hiring brief, or client need.', items: ['Role or client brief', 'Candidate requirements', 'Hiring context', 'Candidate evaluation', 'Shortlist and follow-up'], bg: '#EDF3FF' },
  { label: 'Sales Project', intro: 'Create a Project around a target profile, account type, or prospecting goal.', items: ['Target profile or sales goal', 'Contact requirements', 'Prospecting context', 'Lead evaluation', 'Prioritization and outreach'], bg: '#F3F4F6' },
];

const contextResults = [
  ['Context stayed attached', 'Profiles remained connected to the goal and criteria that explained why they were collected.'],
  ['Comparison became easier', 'Users could review multiple people within one Project instead of switching between pages and tools.'],
  ['One model supported both teams', 'Recruiting and sales reused the same core logic with different terminology and evaluation criteria.'],
  ['The product could scale', 'New sourcing and outreach use cases could extend the same underlying structure.'],
];

function ExistingImage({ src, alt, contain = false }: { src: string; alt: string; contain?: boolean }) {
  return (
    <div style={{ alignItems: 'center', background: '#FFFFFF', border: '1px solid rgba(10,10,10,0.1)', display: 'flex', justifyContent: 'center', overflow: 'hidden', padding: '12px' }}>
      <Image src={src} alt={alt} width={1800} height={1125} sizes="100vw" style={{ display: 'block', height: 'auto', maxHeight: contain ? '680px' : undefined, objectFit: contain ? 'contain' : 'cover', width: '100%' }} />
    </div>
  );
}

const principles = [
  ['Generated from Project context', 'The initial criteria reflected the role, client brief, target profile, or sourcing goal.'],
  ['Visible before evaluation', 'Users could understand how profiles would be assessed before accepting the result.'],
  ['Editable by the user', 'Users could modify the criteria and align the framework with their own judgment.'],
];

const reflections = [
  ['01', 'Challenge the brief', 'Challenge short-term requests when the product model is too narrow.', 'The brief asked for profile ranking. The user workflow required a persistent structure for preserving context, comparison, and next actions.', 'Introducing Project changed the product from a one-shot ranking tool into a reusable workspace.'],
  ['02', 'Workflow before navigation', 'Map the real job before shaping the information architecture.', 'The strongest architectural decisions came from understanding how sourcing continued beyond one LinkedIn search session.', 'Navigation followed the user’s work rather than the first requested feature.'],
  ['03', 'AI with user control', 'Use AI to reduce setup effort without removing judgment.', 'AI was most useful when it created a visible, editable starting point instead of an opaque final answer.', 'The criteria adoption and editing behavior supported this direction.'],
  ['04', 'Same job, different context', 'Design one flexible model for shared behavior.', 'Recruiting and sales used different terminology but followed the same underlying workflow.', 'A shared Project model supported both contexts without splitting the product.'],
  ['05', 'Foundations create speed', 'Build reusable rules while building the product.', 'Figma Variables, design tokens, and reusable components helped two connected product surfaces remain coherent within six weeks.', 'Speed came from shared foundations, not from treating every screen as an exception.'],
];

function DesignFoundationVisual() {
  const colors = [
    ['--cn-primary', '#004ac6', '#004ac6'],
    ['--cn-primary-dark', '#003da8', '#003da8'],
    ['--cn-primary-light', 'rgba(0,74,198,.07)', 'rgba(0,74,198,.07)'],
    ['--cn-danger', 'rgba(200,40,20,.9)', 'rgba(200,40,20,.9)'],
    ['--cn-success', 'rgba(20,130,60,.9)', 'rgba(20,130,60,.9)'],
    ['--cn-text', '#000000', '#000000'],
    ['--cn-text-muted', 'rgba(0,0,0,.5)', 'rgba(0,0,0,.5)'],
    ['--cn-border', 'rgba(0,0,0,.14)', 'rgba(0,0,0,.14)'],
  ];
  const typography = [
    ['Heading 1', 'h1 · 32px/40px · 600', '32px', 600],
    ['Heading 2', 'h2 · 24px/32px · 500', '24px', 500],
    ['Heading 3', 'h3 · 20px/28px · 500', '20px', 500],
    ['Body large', 'body-lg · 17px/28px · 400', '17px', 400],
    ['Body', 'body · 15px/24px · 400', '15px', 400],
    ['Small', 'small · 13px/20px · 400', '13px', 400],
    ['LABEL', 'label · 10px/14px · 500', '10px', 500],
  ] as const;
  const spacing = [
    ['--cn-space-1', '4px'], ['--cn-space-2', '8px'], ['--cn-space-3', '12px'], ['--cn-space-4', '16px'],
    ['--cn-space-5', '20px'], ['--cn-space-6', '24px'], ['--cn-space-8', '32px'], ['--cn-space-12', '48px'],
  ];
  const radii = [
    ['--cn-radius-sm', '6px', 6], ['--cn-radius-md', '7px', 7], ['--cn-radius-lg', '10px', 10],
    ['--cn-radius-xl', '12px', 12], ['--cn-radius-2xl', '14px', 14], ['--cn-radius-full', '999px', 999],
  ] as const;
  const columnHeading: React.CSSProperties = { color: 'rgba(10,10,10,0.38)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.14em', margin: '0 0 18px', textTransform: 'uppercase' };

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid rgba(10,10,10,0.1)', borderRadius: '14px', overflow: 'hidden' }}>
      <div style={{ alignItems: 'center', background: 'rgba(10,10,10,0.015)', borderBottom: '1px solid rgba(10,10,10,0.07)', display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'space-between', padding: '16px 24px' }}>
        <span style={{ color: 'rgba(10,10,10,0.42)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Design tokens · ConnectNova</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{['Color', 'Typography', 'Spacing', 'Radius'].map((item) => <span key={item} style={{ background: 'rgba(10,10,10,0.05)', borderRadius: '4px', color: 'rgba(10,10,10,0.46)', fontSize: '10px', padding: '3px 8px' }}>{item}</span>)}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        <div className="border-b border-black/10 p-6 md:border-r xl:border-b-0">
          <p style={columnHeading}>Color</p>
          {colors.map(([name, value, color]) => <div key={name} style={{ alignItems: 'center', display: 'flex', gap: '9px', marginBottom: '9px' }}><span style={{ background: color, border: '1px solid rgba(10,10,10,0.1)', borderRadius: '4px', flexShrink: 0, height: '22px', width: '22px' }} /><span style={{ minWidth: 0 }}><strong style={{ color: ink, display: 'block', fontSize: '10px', fontWeight: 600 }}>{name}</strong><small style={{ color: 'rgba(10,10,10,0.38)', display: 'block', fontSize: '8px' }}>{value}</small></span></div>)}
        </div>
        <div className="border-b border-black/10 p-6 xl:border-b-0 xl:border-r">
          <p style={columnHeading}>Typography</p>
          {typography.map(([sample, detail, size, weight]) => <div key={detail} style={{ borderBottom: '1px solid rgba(10,10,10,0.055)', marginBottom: '9px', paddingBottom: '9px' }}><span style={{ color: ink, display: 'block', fontSize: size, fontWeight: weight, lineHeight: 1.15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sample}</span><small style={{ color: 'rgba(10,10,10,0.36)', fontSize: '8px' }}>{detail}</small></div>)}
        </div>
        <div className="border-b border-black/10 p-6 md:border-r xl:border-b-0">
          <p style={columnHeading}>Spacing</p>
          {spacing.map(([name, value]) => <div key={name} style={{ alignItems: 'center', display: 'flex', gap: '9px', marginBottom: '12px' }}><span style={{ background: blue, borderRadius: '2px', height: '10px', opacity: 0.72, width: value }} /><span><strong style={{ color: ink, display: 'block', fontSize: '10px', fontWeight: 600 }}>{name}</strong><small style={{ color: 'rgba(10,10,10,0.38)', fontSize: '8px' }}>{value}</small></span></div>)}
        </div>
        <div className="p-6">
          <p style={columnHeading}>Radius</p>
          {radii.map(([name, value, radius]) => <div key={name} style={{ alignItems: 'center', display: 'flex', gap: '11px', marginBottom: '11px' }}><span style={{ border: `1.5px solid ${blue}`, borderRadius: `${Math.min(radius, 18)}px`, flexShrink: 0, height: '30px', opacity: 0.65, width: '46px' }} /><span><strong style={{ color: ink, display: 'block', fontSize: '10px', fontWeight: 600 }}>{name}</strong><small style={{ color: 'rgba(10,10,10,0.38)', fontSize: '8px' }}>{value}</small></span></div>)}
        </div>
      </div>
      <p style={{ background: 'rgba(10,10,10,0.015)', borderTop: '1px solid rgba(10,10,10,0.07)', color: muted, fontSize: '12px', fontStyle: 'italic', lineHeight: 1.5, margin: 0, padding: '13px 24px' }}>Built in Stitch · tokens exported as CSS variables · shared across Chrome extension and web dashboard</p>
    </div>
  );
}

export default function ConnectnovaNarrative({
  informationArchitectureVisual,
  manageWorkspaceVisual,
  designComponentsVisual,
}: {
  informationArchitectureVisual?: React.ReactNode;
  manageWorkspaceVisual?: React.ReactNode;
  designComponentsVisual?: React.ReactNode;
}) {
  return (
    <>
      <Section label="Project at a glance">
        <Eyebrow>01 — Project at a glance</Eyebrow>
        <Title>From finding people to making a clear decision about them</Title>
        <Body>
          <p>Recruiters and sales teams already used LinkedIn to discover candidates and prospects. The workflow broke down after discovery.</p>
          <p>Profiles had to be reopened, enriched, copied into spreadsheets, organized manually, and compared across disconnected tools. ConnectNova brought those activities into one connected workflow.</p>
        </Body>
        <PlatformVisual />
        <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '26px', margin: '54px 0 34px' }}>
          {[['shipped', 'Shipped'], ['progress', 'In progress'], ['planned', 'Planned']].map(([status, label]) => <span key={status} style={{ alignItems: 'center', color: muted, display: 'flex', fontSize: '11px', gap: '9px', textTransform: 'uppercase' }}><StatusDot status={status as 'shipped' | 'progress' | 'planned'} />{label}</span>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4" style={{ borderBottom: '1px solid rgba(10,10,10,0.14)', borderTop: '1px solid rgba(10,10,10,0.14)' }}>
          {stages.map((stage, index) => (
            <article key={stage.phase} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ display: 'flex', flexDirection: 'column', minHeight: '410px', padding: '34px 28px' }}>
              <p style={{ color: blue, fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', margin: '0 0 34px', textTransform: 'uppercase' }}>{stage.number} — {stage.phase}</p>
              <h3 style={{ color: ink, fontSize: '23px', fontWeight: 500, lineHeight: 1.2, margin: '0 0 16px' }}>{stage.title}</h3>
              <p style={{ color: muted, fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{stage.body}</p>
              <CapabilityList items={stage.items} status={stage.status} />
            </article>
          ))}
        </div>
        <p style={{ color: ink, fontSize: 'clamp(26px, 3.2vw, 42px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.25, margin: '54px 0 0', maxWidth: '1080px' }}>Source finds the right people. Qualify helps users decide. Engage starts the conversation. Manage preserves progress toward an outcome.</p>
      </Section>

      <Section label="The Challenge" tone="soft">
        <Eyebrow>02 — The challenge</Eyebrow>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[7fr_5fr] lg:gap-20">
          <div><Title>The problem was not finding people. It was deciding who was worth pursuing.</Title><Body><p>A single LinkedIn search could expose users to hundreds of profiles. The work did not stay inside LinkedIn.</p><p>Recruiters and sales teams moved between sourcing tools, profile pages, enrichment platforms, spreadsheets, and personal working lists to collect information, compare people, and decide who should move forward.</p></Body></div>
          <div style={{ alignItems: 'flex-start', borderTop: `2px solid ${blue}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '300px', paddingTop: '32px' }}><strong style={{ color: blue, fontSize: 'clamp(92px, 13vw, 180px)', fontWeight: 500, letterSpacing: '-0.075em', lineHeight: 0.85 }}>~500</strong><span style={{ color: muted, fontSize: '16px', lineHeight: 1.5, marginTop: '28px' }}>Profiles could appear in a single search.</span></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginTop: 'clamp(72px,9vw,112px)' }}><WorkflowColumn title="Recruiting workflow" steps={recruitingSteps} /><WorkflowColumn title="Sales workflow" steps={salesSteps} /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4" style={{ borderBottom: '1px solid rgba(10,10,10,0.14)', borderTop: '1px solid rgba(10,10,10,0.14)', marginTop: '72px' }}>{friction.map(([title, body], index) => <article key={title} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ minHeight: '230px', padding: '30px 26px' }}><h3 style={{ color: ink, fontSize: '19px', fontWeight: 500, lineHeight: 1.25, margin: '0 0 15px' }}>{title}</h3><p style={{ color: muted, fontSize: '13px', lineHeight: 1.65, margin: 0 }}>{body}</p></article>)}</div>
        <Conclusion>The challenge was turning hundreds of scattered profiles into a <span style={{ color: blue }}>clear, prioritized decision.</span></Conclusion>
      </Section>

      <Section label="The Pivotal Product Decision">
        <Eyebrow>03 — The pivotal product decision</Eyebrow>
        <Title width="880px">I changed the product from a one-shot ranking tool into a reusable workspace.</Title>
        <Body width="860px"><p>The original request was to collect LinkedIn profiles and produce an AI-ranked shortlist.</p><p>I challenged this one-shot model because users worked across multiple roles, clients, prospecting goals, and LinkedIn search sessions. A ranking result could show who scored highly, but it could not preserve why someone had been collected, which requirements applied, or what should happen next.</p><p>I introduced <strong style={{ color: ink, fontWeight: 500 }}>Project</strong> as a persistent container for each sourcing goal. Every collected profile, evaluation criterion, score, note, and later outreach action could remain attached to the same context.</p></Body>
        <div style={{ background: '#EDF3FF', marginTop: 'clamp(64px,8vw,96px)', padding: 'clamp(38px,6vw,68px)' }}><Eyebrow>Core insight</Eyebrow><h2 style={{ color: ink, fontSize: 'clamp(34px,4.4vw,56px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.12, margin: '0 0 52px', maxWidth: '920px' }}>A profile only became meaningful within a specific goal.</h2><p style={{ color: muted, fontSize: '16px', lineHeight: 1.65, margin: '0 0 40px', maxWidth: '840px' }}>The same person could be highly relevant to one hiring brief or sales target and irrelevant to another. Saving a profile alone could not explain why the person mattered or how they should be evaluated.</p><div className="grid grid-cols-1 gap-px bg-blue-200/60 md:grid-cols-5">{projectQuestions.map((question) => <p key={question} style={{ background: '#F8FAFF', color: ink, fontSize: '13px', lineHeight: 1.5, margin: 0, minHeight: '130px', padding: '22px' }}>{question}</p>)}</div></div>
        <Conclusion>Project became the bridge between collecting a profile and <span style={{ color: blue }}>making a decision about it.</span></Conclusion>
      </Section>

      <Section label="One Shared Product Model" tone="soft">
        <Eyebrow>04 — One shared product model</Eyebrow><Title>Recruiting and sales used different language, but followed the same underlying workflow.</Title><Body><p>Both teams needed to find people, preserve why they mattered, evaluate them against a goal, and decide what should happen next.</p><p>Instead of building two separate products, I created one flexible Project model that could adapt to each context.</p></Body>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2" style={{ marginTop: '64px' }}>{contexts.map((context) => <article key={context.label} style={{ background: context.bg, minHeight: '390px', padding: 'clamp(32px,5vw,52px)' }}><p style={{ color: blue, fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', margin: '0 0 28px', textTransform: 'uppercase' }}>{context.label}</p><p style={{ color: ink, fontSize: '23px', lineHeight: 1.35, margin: '0 0 34px' }}>{context.intro}</p><div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>{context.items.map((item) => <span key={item} style={{ borderTop: '1px solid rgba(10,10,10,0.1)', color: muted, fontSize: '13px', paddingTop: '11px' }}>{item}</span>)}</div></article>)}</div>
        <div style={{ margin: '42px 0 64px', textAlign: 'center' }}><span aria-hidden="true" style={{ color: blue, display: 'block', fontSize: '30px', marginBottom: '18px' }}>↓</span><div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>{['Project', 'People', 'Criteria', 'Evaluation', 'Priority', 'Next action'].map((item) => <span key={item} style={{ background: '#FFFFFF', border: '1px solid rgba(36,89,211,0.25)', borderRadius: '999px', color: blue, fontSize: '12px', padding: '9px 14px' }}>{item}</span>)}</div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4" style={{ borderBottom: '1px solid rgba(10,10,10,0.14)', borderTop: '1px solid rgba(10,10,10,0.14)' }}>{contextResults.map(([title, body], index) => <article key={title} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ minHeight: '250px', padding: '30px 26px' }}><h3 style={{ color: ink, fontSize: '18px', fontWeight: 500, margin: '0 0 14px' }}>{title}</h3><p style={{ color: muted, fontSize: '13px', lineHeight: 1.65, margin: 0 }}>{body}</p></article>)}</div>
      </Section>

      <Section label="Information Architecture">
        <Eyebrow>05 — Information architecture</Eyebrow><Title>I reduced the experience from three navigation layers to two.</Title><Body><p>The earlier structure separated the Project list, profile list, and profile detail into different levels.</p><p>Users had to move back and forth while comparing people, reviewing evaluation results, and checking individual profile information.</p><p>I combined the ranked list, evaluation criteria, and profile detail into a single Project workspace.</p></Body>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2" style={{ marginTop: '64px' }}><div style={{ background: '#F3F4F6', padding: '36px' }}><Eyebrow>Before</Eyebrow><div style={{ color: muted, fontSize: '18px', lineHeight: 2.1 }}>Project list<br />→ Profile list<br />→ Profile detail</div><p style={{ color: muted, fontSize: '12px', margin: '28px 0 0' }}>Three separate navigation layers</p></div><div style={{ background: '#EDF3FF', border: `1px solid ${blue}`, padding: '36px' }}><Eyebrow>After</Eyebrow><div style={{ color: ink, fontSize: '18px', lineHeight: 2.1 }}>Project list<br />→ Project workspace</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '26px' }}>{['People', 'Ranking', 'Evaluation', 'Profile detail'].map((item) => <span key={item} style={{ background: '#FFFFFF', border: '1px solid rgba(36,89,211,0.2)', color: blue, fontSize: '11px', padding: '8px 10px' }}>{item}</span>)}</div></div></div>
        <div style={{ background: '#F7F9FC', marginTop: '56px', padding: 'clamp(20px,4vw,48px)' }}><div style={{ background: '#FFFFFF', border: '1px solid rgba(10,10,10,0.1)', overflow: 'hidden', padding: 'clamp(12px,2vw,24px)' }}>{informationArchitectureVisual ?? <ExistingImage src="/img/connectnova/Dashboard.avif" alt="ConnectNova Project workspace" contain />}</div><div className="grid grid-cols-1 gap-px bg-black/10 md:grid-cols-4" style={{ marginTop: '18px' }}>{['Profiles organized by goal', 'Evaluation visible in context', 'Details available without leaving the workspace', 'Ranking and review in one place'].map((item) => <p key={item} style={{ background: '#FFFFFF', color: muted, fontSize: '12px', margin: 0, padding: '18px', textAlign: 'center' }}>{item}</p>)}</div></div>
        <Conclusion>Users could move between overview and detail without losing the <span style={{ color: blue }}>Project context</span> behind each evaluation.</Conclusion>
      </Section>

      <Section label="The Connected Workflow" tone="soft">
        <Eyebrow>06 — The connected workflow</Eyebrow><Title>One continuous journey from discovery to prioritization</Title><Body><p>The MVP connected three critical moments in the user’s workflow:</p></Body>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3" style={{ marginTop: '54px' }}>{[
          ['01', 'Collect in context', 'Save a promising LinkedIn profile directly into the right Project.'],
          ['02', 'Define the evaluation framework', 'Generate visible criteria from the Project context and allow users to edit them.'],
          ['03', 'Compare and prioritize', 'Review ranked people, evaluation results, and individual details in one workspace.'],
        ].map(([number, title, body]) => <article key={number} style={{ background: '#FFFFFF', border: '1px solid rgba(10,10,10,0.1)', minHeight: '280px', padding: 'clamp(28px,4vw,40px)' }}><p style={{ color: blue, fontSize: '11px', fontWeight: 600, margin: '0 0 34px' }}>{number}</p><h3 style={{ color: ink, fontSize: '24px', fontWeight: 500, lineHeight: 1.2, margin: '0 0 14px' }}>{title}</h3><p style={{ color: muted, fontSize: '13px', lineHeight: 1.65, margin: 0 }}>{body}</p></article>)}</div>
        <div style={{ borderBottom: '1px solid rgba(10,10,10,0.14)', borderTop: '1px solid rgba(10,10,10,0.14)', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '54px', padding: '26px 0' }}>{['LinkedIn discovery', 'Choose Project', 'Collect profile', 'Generate criteria', 'Review evaluation', 'Compare people', 'Prioritize next action'].map((step, index, all) => <span key={step} style={{ alignItems: 'center', color: index === all.length - 1 ? blue : muted, display: 'inline-flex', fontSize: '12px', gap: '10px' }}>{step}{index < all.length - 1 && <span aria-hidden="true">→</span>}</span>)}</div>
      </Section>

      <Section label="Collect Without Leaving LinkedIn">
        <Eyebrow>06.1 — Collect without leaving LinkedIn</Eyebrow><Title width="820px">Save the profile while the context is still clear.</Title><Body width="760px"><p>Recruiters and sales professionals already discovered people on LinkedIn. The workflow became fragmented when a promising profile had to be copied, reorganized, and connected to the correct task in another tool.</p><p>I designed a Chrome Extension that allowed users to collect a profile and place it into the right Project without leaving LinkedIn.</p></Body>
        <div style={{ background: '#EDF3FF', marginTop: '58px', padding: 'clamp(24px,5vw,56px)' }}><h2 style={{ color: ink, fontSize: 'clamp(28px,3.4vw,44px)', fontWeight: 400, margin: '0 0 32px' }}>Collect directly inside the existing workflow</h2><ExistingImage src="/img/connectnova/Extension.avif" alt="ConnectNova profile collection flow in the Chrome extension" contain /><div className="grid grid-cols-1 gap-px bg-blue-200/60 md:grid-cols-3" style={{ marginTop: '18px' }}>{[
          ['Step 01', 'Choose the context', 'Select an existing Project or create a new one before collecting the profile.', 'Ask for the Project before saving', 'Every saved profile entered ConnectNova with a clear purpose.'],
          ['Step 02', 'Collect without interruption', 'Save available profile information while continuing to browse LinkedIn.', 'Keep collection in context', 'Users could act at the moment they identified a relevant person.'],
          ['Step 03', 'Confirm the result', 'Show where the profile was saved and make the next action immediately clear.', 'Confirm the outcome immediately', 'Visible feedback showed whether the action succeeded and where the profile had been stored.'],
        ].map(([step, title, body, decision, rationale]) => <article key={step} style={{ background: '#FFFFFF', minHeight: '360px', padding: 'clamp(26px,3vw,34px)' }}><p style={{ color: blue, fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', margin: '0 0 18px', textTransform: 'uppercase' }}>{step}</p><h3 style={{ color: ink, fontSize: '20px', fontWeight: 500, lineHeight: 1.3, margin: '0 0 12px' }}>{title}</h3><p style={{ color: muted, fontSize: '13px', lineHeight: 1.65, margin: 0 }}>{body}</p><div style={{ borderTop: '1px solid rgba(10,10,10,0.12)', marginTop: '28px', paddingTop: '24px' }}><p style={{ color: blue, fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', margin: '0 0 10px', textTransform: 'uppercase' }}>Design decision</p><h4 style={{ color: ink, fontSize: '16px', fontWeight: 500, lineHeight: 1.35, margin: '0 0 10px' }}>{decision}</h4><p style={{ color: muted, fontSize: '12px', lineHeight: 1.6, margin: 0 }}>{rationale}</p></div></article>)}</div></div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2" style={{ background: '#F3F6FA', marginTop: '56px', padding: 'clamp(30px,5vw,52px)' }}>{[['76% → 93%', 'Collection completion rate'], ['72% → 87%', 'Save rate after collection']].map(([value, label]) => <div key={label}><strong style={{ color: blue, display: 'block', fontSize: 'clamp(48px,6vw,80px)', fontWeight: 500, letterSpacing: '-0.06em', lineHeight: 1 }}>{value}</strong><span style={{ color: ink, display: 'block', fontSize: '16px', marginTop: '18px' }}>{label}</span></div>)}<p className="md:col-span-2" style={{ color: muted, fontSize: '14px', lineHeight: 1.65, margin: '12px 0 0' }}>The clearer Project selection and save states improved successful task completion and reduced uncertainty after collection.</p><p className="md:col-span-2" style={{ color: 'rgba(10,10,10,0.4)', fontSize: '11px', lineHeight: 1.6, margin: 0 }}>Usability testing · Participant count: [add before publishing] · Task definition: [add before publishing] · Testing round: [add before publishing]</p></div>
        <Conclusion>Collection became part of sourcing—<span style={{ color: blue }}>not a separate task after it.</span></Conclusion>
      </Section>

      <Section label="Editable AI Criteria" tone="soft">
        <Eyebrow>06.2 — Make AI criteria visible and editable</Eyebrow><Title width="820px">Help users start faster without giving up control.</Title><Body width="820px"><p>Recruiters and sales professionals evaluated people against different goals, but defining a consistent set of criteria for every Project required time and judgment.</p><p>ConnectNova generated an initial evaluation framework from the Project context. Users could review and edit the criteria before applying them to collected profiles.</p></Body>
        <div style={{ background: '#EDF3FF', marginTop: '58px', padding: 'clamp(34px,6vw,68px)' }}><h2 style={{ color: ink, fontSize: 'clamp(36px,4.8vw,60px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 24px', maxWidth: '980px' }}>AI created the starting point. Users shaped the final framework.</h2><p style={{ color: muted, fontSize: '16px', lineHeight: 1.65, margin: '0 0 42px', maxWidth: '820px' }}>Instead of presenting users with one unexplained score, ConnectNova first generated a visible set of evaluation criteria. This gave users a structured way to compare people while allowing them to adapt the framework to a specific role, client, or prospecting goal.</p><ExistingImage src="/img/connectnova/Rerank.avif" alt="ConnectNova visible AI ranking and evaluation interface" contain /></div>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderBottom: '1px solid rgba(10,10,10,0.14)', borderTop: '1px solid rgba(10,10,10,0.14)', marginTop: '56px' }}>{principles.map(([title, body], index) => <article key={title} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ minHeight: '250px', padding: '32px' }}><h3 style={{ color: ink, fontSize: '19px', fontWeight: 500, lineHeight: 1.3, margin: '0 0 15px' }}>{title}</h3><p style={{ color: muted, fontSize: '13px', lineHeight: 1.65, margin: 0 }}>{body}</p></article>)}</div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2" style={{ marginTop: '56px' }}>{[
          ['84%', 'Adopted AI-generated evaluation criteria', 'Most users retained at least part of the framework generated by ConnectNova.'],
          ['31%', 'Edited the generated criteria', 'A meaningful share of users adjusted the framework to reflect their own judgment and context.'],
        ].map(([value, label, body]) => <article key={value} style={{ background: '#FFFFFF', border: '1px solid rgba(10,10,10,0.1)', minHeight: '310px', padding: 'clamp(30px,5vw,48px)' }}><strong style={{ color: blue, display: 'block', fontSize: 'clamp(58px,7vw,92px)', fontWeight: 500, letterSpacing: '-0.06em', lineHeight: 1 }}>{value}</strong><h3 style={{ color: ink, fontSize: '18px', fontWeight: 500, margin: '28px 0 12px' }}>{label}</h3><p style={{ color: muted, fontSize: '13px', lineHeight: 1.65, margin: 0 }}>{body}</p></article>)}</div>
        <p style={{ color: muted, fontSize: '15px', lineHeight: 1.65, margin: '28px 0 0', maxWidth: '760px' }}>The adoption rate showed that AI reduced setup effort. The edit rate showed that users still needed control over the final evaluation framework.</p><p style={{ color: 'rgba(10,10,10,0.4)', fontSize: '11px', lineHeight: 1.6, margin: '18px 0 0' }}>Product usage results · Sample size: [add before publishing] · Measurement period: [add before publishing] · Adoption definition: [add before publishing]</p>
        <Conclusion>AI did not make the final decision. It helped users define a <span style={{ color: blue }}>clearer and more consistent way</span> to make it.</Conclusion>
      </Section>

      <Section label="Manage, Rank, Decide">
        <Eyebrow>06.3 — Manage, rank, decide</Eyebrow><Title>Bring profiles, evaluation, and comparison into one workspace.</Title><Body><p>After collecting profiles and defining the evaluation criteria, users needed a clear way to review people within each Project.</p><p>The web dashboard brought the people list, AI-assisted evaluation results, and profile details into one workspace.</p></Body>
        <div style={{ background: '#EDF3FF', marginTop: '58px', padding: 'clamp(28px,5vw,58px)' }}><h2 style={{ color: ink, fontSize: 'clamp(32px,4.2vw,52px)', fontWeight: 400, letterSpacing: '-0.03em', margin: '0 0 22px' }}>Manage the list without losing the individual context.</h2><p style={{ color: muted, fontSize: '15px', lineHeight: 1.65, margin: '0 0 34px', maxWidth: '820px' }}>Users could scan the ranked list at a high level, then open a profile panel to review one person in more detail without leaving the Project. This reduced repeated movement between separate list and detail pages while comparing multiple people.</p>{manageWorkspaceVisual ?? <div className="grid grid-cols-1 gap-5 lg:grid-cols-[7fr_3fr]"><ExistingImage src="/img/connectnova/Dashboard.avif" alt="ConnectNova Project workspace" contain /><ExistingImage src="/img/connectnova/Rerank.avif" alt="ConnectNova ranked candidates and profile evaluation" contain /></div>}</div>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderBottom: '1px solid rgba(10,10,10,0.14)', borderTop: '1px solid rgba(10,10,10,0.14)', marginTop: '54px' }}>{[
          ['Ranked within the Project', 'Every person was compared within the context of a specific sourcing goal.'],
          ['Evaluation visible in the list', 'Users could understand why someone ranked highly without opening every profile.'],
          ['Details without leaving the workspace', 'Individual information remained accessible while the broader comparison stayed visible.'],
        ].map(([title, body], index) => <article key={title} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ minHeight: '230px', padding: '30px' }}><h3 style={{ color: ink, fontSize: '19px', fontWeight: 500, margin: '0 0 14px' }}>{title}</h3><p style={{ color: muted, fontSize: '13px', lineHeight: 1.65, margin: 0 }}>{body}</p></article>)}</div>
        <Conclusion>The dashboard turned a collection of saved profiles into a <span style={{ color: blue }}>prioritized working list.</span></Conclusion>
      </Section>

      <Section label="Building and Shipping in Six Weeks" tone="soft" hidden>
        <Eyebrow>07 — Building and shipping in six weeks</Eyebrow><Title width="900px">Create enough structure to move fast without creating chaos.</Title><Body width="800px"><p>The MVP had to connect a Chrome Extension and web dashboard within six weeks.</p><p>The two surfaces needed to feel like one product and remain practical for engineering to build. Moving quickly without shared rules would have created inconsistent interaction patterns and additional implementation work.</p><p>I created a lightweight design foundation using Figma Variables, semantic tokens, and reusable components while designing the product.</p></Body>
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(10,10,10,0.1)', marginTop: '58px', padding: 'clamp(30px,6vw,68px)' }}><h2 style={{ color: ink, fontSize: 'clamp(36px,4.8vw,60px)', fontWeight: 400, letterSpacing: '-0.03em', margin: '0 0 20px' }}>Build the system alongside the product.</h2><p style={{ color: muted, fontSize: '16px', lineHeight: 1.65, margin: '0 0 44px', maxWidth: '820px' }}>The goal was not to create a comprehensive design system. It was to establish the minimum structure required for consistent and efficient delivery.</p><div className="grid grid-cols-1 lg:grid-cols-2" style={{ border: '1px solid rgba(10,10,10,0.1)' }}><div style={{ background: '#F5F7FA', minHeight: '480px', padding: '36px' }}><Eyebrow>Figma Variables</Eyebrow>{['Color', 'Typography', 'Spacing', 'Radius', 'Component states'].map((item) => <div key={item} style={{ background: '#FFFFFF', border: '1px solid rgba(10,10,10,0.08)', color: ink, fontSize: '13px', marginTop: '10px', padding: '16px' }}>{item}</div>)}</div><div style={{ background: '#FFFFFF', borderLeft: '1px solid rgba(10,10,10,0.1)', minHeight: '480px', padding: '36px' }}><Eyebrow>Tokens and reusable components</Eyebrow><div className="grid grid-cols-2 gap-3">{['Semantic color', 'Spacing scale', 'Type scale', 'Corner radius', 'Buttons', 'Inputs', 'Navigation', 'Cards', 'Tables', 'Status states'].map((item) => <div key={item} style={{ background: '#F7F8FA', border: '1px solid rgba(10,10,10,0.07)', color: muted, fontSize: '11px', minHeight: '72px', padding: '16px' }}>{item}</div>)}</div></div></div><div className="grid grid-cols-1 gap-px bg-black/10 md:grid-cols-3" style={{ marginTop: '22px' }}>{[
          ['Shared visual rules', 'Recurring decisions stayed visible and reusable.'],
          ['Reusable values', 'Design and engineering could work from consistent definitions.'],
          ['Consistent states', 'The Chrome Extension and web dashboard shared the same visual and interaction logic.'],
        ].map(([title, body]) => <div key={title} style={{ background: '#FFFFFF', padding: '22px' }}><strong style={{ color: blue, display: 'block', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase' }}>{title}</strong><span style={{ color: muted, fontSize: '12px', lineHeight: 1.5 }}>{body}</span></div>)}</div></div>
        <Conclusion>The design system was part of the MVP delivery strategy—<span style={{ color: blue }}>not a separate project.</span></Conclusion>
      </Section>

      <Section label="Building and Shipping in Six Weeks" tone="soft">
        <Eyebrow>07 — Building and shipping in six weeks</Eyebrow>
        <Title width="900px">Create enough structure to move fast without creating chaos.</Title>
        <Body width="800px">
          <p>The MVP had to connect a Chrome Extension and web dashboard within six weeks.</p>
          <p>The two surfaces needed to feel like one product and remain practical for engineering to build. Moving quickly without shared rules would have created inconsistent interaction patterns and additional implementation work.</p>
          <p>I created a lightweight design foundation using Figma Variables, semantic tokens, and reusable components while designing the product.</p>
        </Body>
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(10,10,10,0.1)', marginTop: '58px', padding: 'clamp(30px,6vw,68px)' }}>
          <h2 style={{ color: ink, fontSize: 'clamp(36px,4.8vw,60px)', fontWeight: 400, letterSpacing: '-0.03em', margin: '0 0 20px' }}>Build the system alongside the product.</h2>
          <p style={{ color: muted, fontSize: '16px', lineHeight: 1.65, margin: '0 0 44px', maxWidth: '880px' }}>Instead of waiting until the interface was complete, I established the core visual rules and reusable patterns while designing the MVP. The goal was not a comprehensive design system. It was the minimum structure required for consistent and efficient delivery.</p>
          <DesignFoundationVisual />
          {designComponentsVisual && (
            <div style={{ marginTop: '24px' }}>
              <div style={{ alignItems: 'end', display: 'flex', flexWrap: 'wrap', gap: '18px', justifyContent: 'space-between', margin: '0 0 18px' }}>
                <div>
                  <p style={{ color: blue, fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', margin: '0 0 10px', textTransform: 'uppercase' }}>Reusable components</p>
                  <h3 style={{ color: ink, fontSize: 'clamp(24px,3vw,36px)', fontWeight: 400, letterSpacing: '-0.025em', margin: 0 }}>Shared patterns across both product surfaces</h3>
                </div>
                <p style={{ color: muted, fontSize: '12px', lineHeight: 1.55, margin: 0, maxWidth: '420px' }}>Buttons, status states, navigation, inputs, and feedback patterns reused the same token layer across the Chrome Extension and web dashboard.</p>
              </div>
              {designComponentsVisual}
            </div>
          )}
          <div className="grid grid-cols-1 gap-px bg-black/10 md:grid-cols-3" style={{ marginTop: '22px' }}>
            {[
              ['Shared visual rules', 'Recurring decisions stayed visible and reusable.'],
              ['Reusable values', 'Design and engineering could work from consistent definitions.'],
              ['Consistent states', 'The Chrome Extension and web dashboard shared the same visual and interaction logic.'],
            ].map(([title, body]) => (
              <div key={title} style={{ background: '#FFFFFF', padding: '22px' }}>
                <strong style={{ color: blue, display: 'block', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase' }}>{title}</strong>
                <span style={{ color: muted, fontSize: '12px', lineHeight: 1.5 }}>{body}</span>
              </div>
            ))}
          </div>
        </div>
        <Conclusion>The design system was part of the MVP delivery strategy—<span style={{ color: blue }}>not a separate project.</span></Conclusion>
      </Section>

      <Section label="Results and Validation">
        <Eyebrow>08 — Results and validation</Eyebrow><Title>What the MVP validated—and what still needed work</Title><Body><p>The six-week MVP demonstrated that ConnectNova could connect LinkedIn profile collection, Project-based organization, and AI-assisted evaluation into one coherent workflow.</p><p>The results showed improvements in the core collection and evaluation experience while also revealing where the product needed clearer measurement, broader validation, and continued development.</p></Body>
        <h2 style={{ color: ink, fontSize: 'clamp(30px,3.8vw,48px)', fontWeight: 400, margin: '72px 0 34px' }}>A more effective core workflow</h2><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4" style={{ borderBottom: '1px solid rgba(10,10,10,0.14)', borderTop: '1px solid rgba(10,10,10,0.14)' }}>{[
          ['76% → 93%', 'Collection completion rate', 'The redesigned Project selection and collection flow improved successful task completion.'],
          ['72% → 87%', 'Save rate after collection', 'Clearer action feedback improved completion after profiles were collected.'],
          ['84%', 'Adopted AI-generated evaluation criteria', 'Most users retained at least part of the framework created by ConnectNova.'],
          ['31%', 'Edited the generated criteria', 'Users treated AI as a starting point and adapted it to their own requirements.'],
        ].map(([value, label, body], index) => {
          const comparison = value.includes('→') ? value.split(' → ') : null;
          return (
            <article key={label} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ minHeight: '340px', minWidth: 0, padding: '34px clamp(18px,1.6vw,24px)' }}>
              {comparison ? (
                <strong style={{ alignItems: 'center', color: blue, display: 'grid', fontSize: 'clamp(30px,2.65vw,42px)', fontWeight: 500, gap: 'clamp(5px,0.7vw,12px)', gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)', letterSpacing: '-0.06em', lineHeight: 1, whiteSpace: 'nowrap' }}>
                  <span>{comparison[0]}</span>
                  <span aria-hidden="true" style={{ fontSize: '0.78em', fontWeight: 400, letterSpacing: 0 }}>→</span>
                  <span>{comparison[1]}</span>
                </strong>
              ) : (
                <strong style={{ color: blue, display: 'block', fontSize: 'clamp(54px,5vw,74px)', fontWeight: 500, letterSpacing: '-0.065em', lineHeight: 1, whiteSpace: 'nowrap' }}>{value}</strong>
              )}
              <h3 style={{ color: ink, fontSize: '16px', fontWeight: 500, lineHeight: 1.4, margin: '28px 0 12px' }}>{label}</h3>
              <p style={{ color: muted, fontSize: '12px', lineHeight: 1.65, margin: 0 }}>{body}</p>
            </article>
          );
        })}</div>
        <div style={{ background: '#EDF3FF', marginTop: '0', padding: 'clamp(32px,5vw,56px)' }}><h2 style={{ color: ink, fontSize: 'clamp(30px,3.8vw,48px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 18px', maxWidth: '1050px' }}>The strongest signal was not only that users accepted AI-generated criteria, but that they also felt able to <span style={{ color: blue }}>modify them.</span></h2><p style={{ color: muted, fontSize: '14px', lineHeight: 1.65, margin: 0, maxWidth: '820px' }}>This supported making the evaluation framework visible and editable instead of presenting users with a fixed AI judgment.</p></div><p style={{ color: 'rgba(10,10,10,0.4)', fontSize: '11px', lineHeight: 1.6, margin: '18px 0 0' }}>Exact task definitions, sample sizes, testing methods, and measurement periods must be added from the original research record before publishing.</p>
      </Section>

      <Section label="Beyond the Validated MVP" tone="soft">
        <Eyebrow>09 — Beyond the validated MVP</Eyebrow><span style={{ border: `1px solid ${blue}`, color: blue, display: 'inline-block', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '24px', padding: '7px 10px', textTransform: 'uppercase' }}>Ongoing exploration</span><Title>Extend the Project model from prioritization into structured outreach.</Title><Body><p>After users collected, evaluated, and ranked people, the next step was to contact the strongest candidates or leads.</p><p>I explored how selected profiles could move into Campaigns, Leads, and messaging Sequences without rebuilding the audience or losing the Project context already collected.</p></Body>
        <div style={{ borderBottom: '1px solid rgba(10,10,10,0.14)', borderTop: '1px solid rgba(10,10,10,0.14)', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '54px', padding: '26px 0' }}>{['Project', 'Ranked people', 'Selected profiles', 'Campaign', 'Leads', 'Sequence', 'Outreach activity'].map((step, index, all) => <span key={step} style={{ alignItems: 'center', color: index === all.length - 1 ? blue : muted, display: 'inline-flex', fontSize: '12px', gap: '10px' }}>{step}{index < all.length - 1 && <span aria-hidden="true">→</span>}</span>)}</div>
        <div style={{ marginTop: '48px' }}><ExistingImage src="/img/connectnova/Workflow.avif" alt="ConnectNova outreach platform information architecture" contain /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4" style={{ borderBottom: '1px solid rgba(10,10,10,0.14)', borderTop: '1px solid rgba(10,10,10,0.14)', marginTop: '48px' }}>{[
          ['Campaign structure', 'Group selected people around a specific outreach goal.'], ['Lead management', 'Preserve the Project and evaluation context around each selected person.'], ['Sequence creation', 'Organize multi-step messaging into a reusable workflow.'], ['Activity and statistics', 'Track outreach actions and review performance over time.'],
        ].map(([title, body], index) => <article key={title} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ minHeight: '220px', padding: '28px' }}><h3 style={{ color: ink, fontSize: '18px', fontWeight: 500, margin: '0 0 14px' }}>{title}</h3><p style={{ color: muted, fontSize: '13px', lineHeight: 1.65, margin: 0 }}>{body}</p></article>)}</div>
        <div style={{ marginTop: 'clamp(64px,8vw,96px)' }}>
          <Eyebrow>Interactive Figma prototype</Eyebrow>
          <h2 style={{ color: ink, fontSize: 'clamp(30px,3.8vw,48px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.18, margin: '0 0 18px', maxWidth: '900px' }}>Sequence editing canvas</h2>
          <p style={{ color: muted, fontSize: '15px', lineHeight: 1.65, margin: '0 0 26px', maxWidth: '900px' }}>Users can visually build and edit a Sequence by adding nodes and connecting steps. This original interactive prototype focuses on component organization and a first-pass interaction experience.</p>
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(10,10,10,0.12)', height: 'min(620px,72svh)', overflow: 'hidden' }}>
            <iframe
              title="ConnectNova outreach sequence prototype"
              src="https://embed.figma.com/proto/e7hxbnwajw3R2vy3S79kQU/ConnectNova?node-id=379-1216&viewport=238%2C698%2C0.44&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=379%3A1216&page-id=373%3A1205&embed-host=share"
              allowFullScreen
              style={{ border: 0, display: 'block', height: '100%', width: '100%' }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2" style={{ marginTop: '56px' }}>{[
          ['Designed or being explored', ['Campaign structure', 'Lead management views', 'Sequence creation', 'Multi-step message organization', 'Core outreach navigation']],
          ['Not yet validated as outcomes', ['Final workflow and implementation', 'Usability or product-performance results', 'Advanced outreach capabilities', 'Pipeline capabilities outside the completed MVP']],
        ].map(([title, items], index) => <div key={title as string} style={{ borderTop: index === 0 ? `2px solid ${blue}` : '1px solid rgba(10,10,10,0.18)', paddingTop: '24px' }}><h3 style={{ color: index === 0 ? blue : ink, fontSize: '19px', fontWeight: 500, margin: '0 0 20px' }}>{title as string}</h3>{(items as string[]).map((item) => <p key={item} style={{ color: muted, fontSize: '13px', margin: '0 0 10px' }}>— {item}</p>)}</div>)}</div>
        <Conclusion>Outreach was the next extension of the workflow—<span style={{ color: blue }}>not part of the validated core MVP yet.</span></Conclusion>
      </Section>

      <Section label="Reflection">
        <Eyebrow>10 — Reflection</Eyebrow><Title>What this project changed in my practice</Title><div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: '1px solid rgba(10,10,10,0.14)', borderTop: '1px solid rgba(10,10,10,0.14)', marginTop: '54px' }}>{reflections.map(([number, eyebrow, title, body, outcome], index) => <article key={number} className={`${index % 2 === 1 ? 'md:border-l md:border-black/15' : ''} ${index > 1 ? 'border-t border-black/15' : index === 1 ? 'border-t border-black/15 md:border-t-0' : ''} ${index === 4 ? 'md:col-span-2' : ''}`} style={{ minHeight: index === 4 ? '330px' : '390px', padding: 'clamp(32px,5vw,52px)' }}><p style={{ color: blue, fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', margin: '0 0 34px', textTransform: 'uppercase' }}>{number} — {eyebrow}</p><h2 style={{ color: index === 0 ? blue : ink, fontSize: 'clamp(24px,2.8vw,36px)', fontWeight: 500, lineHeight: 1.2, margin: '0 0 20px' }}>{title}</h2><p style={{ color: muted, fontSize: '13px', lineHeight: 1.65, margin: '0 0 18px' }}>{body}</p><p style={{ color: muted, fontSize: '13px', lineHeight: 1.65, margin: 0 }}>{outcome}</p></article>)}</div>
      </Section>

      <Section label="Next Steps" tone="soft">
        <Eyebrow>11 — Next steps</Eyebrow><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4" style={{ borderBottom: '1px solid rgba(10,10,10,0.14)', borderTop: '1px solid rgba(10,10,10,0.14)', marginTop: '38px' }}>{[
          ['01', 'Structured user testing', 'Validate the connected workflow through repeated task-based studies with clearly documented participant groups, task definitions, and success criteria.'],
          ['02', 'Outreach automation', 'Test how Campaigns and Sequences can extend the Project context into structured communication.'],
          ['03', 'Pipeline tracking', 'Explore status, progress, follow-up, and final outcomes after outreach begins.'],
          ['04', 'Team collaboration', 'Define shared ownership, visibility, comments, handoff, and coordinated follow-up.'],
        ].map(([number, title, body], index) => <article key={number} className={index > 0 ? 'border-t border-black/15 md:border-l md:border-t-0' : ''} style={{ minHeight: '280px', padding: '32px 28px' }}><p style={{ color: blue, fontSize: '11px', fontWeight: 600, margin: '0 0 32px' }}>{number}</p><h2 style={{ color: ink, fontSize: '22px', fontWeight: 500, lineHeight: 1.25, margin: '0 0 14px' }}>{title}</h2><p style={{ color: muted, fontSize: '13px', lineHeight: 1.65, margin: 0 }}>{body}</p></article>)}</div>
      </Section>

      <section className="w-screen" data-case-nav-label="Closing" style={{ background: '#FFFFFF', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', minHeight: '680px', padding: 'clamp(100px,13vw,170px) clamp(24px,6vw,96px) 48px' }}><div style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: '0 auto', maxWidth: '1200px', minHeight: '500px' }}><div style={{ maxWidth: '880px' }}><p style={{ color: ink, fontSize: 'clamp(38px,5vw,64px)', fontWeight: 400, letterSpacing: '-0.035em', lineHeight: 1.12, margin: '0 0 34px' }}>The MVP validated a <span style={{ color: blue }}>connected foundation</span> for collecting, organizing, and evaluating people.</p><p style={{ color: ink, fontSize: 'clamp(38px,5vw,64px)', fontWeight: 400, letterSpacing: '-0.035em', lineHeight: 1.12, margin: 0 }}>The complete workflow still required <span style={{ color: blue }}>broader validation</span> and continued development.</p></div><div style={{ borderTop: '1px solid rgba(10,10,10,0.14)', display: 'flex', justifyContent: 'flex-start', marginTop: 'auto', paddingTop: '24px' }}><Link href="/#work" style={{ color: muted, fontSize: '13px', textDecoration: 'none' }}>← Back to Work</Link></div></div></section>
    </>
  );
}
