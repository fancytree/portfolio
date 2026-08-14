import type { Metadata } from 'next';
import Image from 'next/image';
import CaseStudyBackButton from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/CaseStudyControls';
import CaseStudyHero from '../../components/CaseStudyHero';
import Phase1ScreenshotSwitcher from './Phase1ScreenshotSwitcher';
import ProcurementDemoEmbed from './ProcurementDemoEmbed';
import { fontFamily } from '@/lib/design-tokens';

export const metadata: Metadata = {
  title: 'AI Procurement Agent for DEF Beauty Supply | Mei Chai',
  description:
    'Designing an evidence-backed procurement agent that helps buyers decide what to purchase, how much to order, and why—while keeping critical decisions under human control.',
};

const tldrPoints = [
  {
    label: 'Context',
    body:
      'An Italian B2B beauty wholesaler ran procurement manually: purchase requests, orders, supplier documents, partial receipts, and inventory outcomes lived in disconnected spreadsheets and messages.',
  },
  {
    label: 'Shift',
    body:
      'The transformation happened in three deliberate stages: manual work revealed the operational gaps, the Main platform created structured purchase and receiving records, and the Agent layer then used that foundation to analyze demand, apply supplier rules, and support decisions.',
  },
  {
    label: 'Core insight',
    body:
      'The middle stage made agency possible. Before AI could reason about procurement, the platform first had to connect purchase requests, orders, supplier documents, partial receipts, and inventory outcomes.',
  },
  {
    label: 'Design principle',
    body:
      'Purchase orders and the Agent share one workspace, but formal ordering remains human. A person must place the formal order and upload the confirmation.',
  },
  {
    label: 'Outcome',
    body: 'A functional MVP with a pilot planned next, moving from manual procurement to an agent-ready system.',
  },
];

const accent = '#2155e8';

const sectionStyle = {
  padding: 'clamp(56px, 7vw, 88px) clamp(24px, 5vw, 64px)',
} as const;

const bodyStyle = {
  fontFamily: fontFamily.sans,
} as const;

type StageProcess = { label: string; body: string };
type StageData = {
  tag: string;
  tagBg: string;
  tagColor: string;
  title: string;
  body: string;
  processLabel: string;
  processes: StageProcess[];
  calloutLabel: string;
  calloutBody: string;
  cardBg: string;
  cardTextColor: string;
  processBg: string;
  processTextColor: string;
  calloutBg: string;
  calloutLabelColor: string;
};

const evolutionStages: StageData[] = [
  {
    tag: 'STAGE 01 · MANUAL',
    tagBg: '#ffffff',
    tagColor: '#8a6500',
    title: 'Procurement and receiving were separate manual tasks.',
    body: 'The platform stored inventory, but it could not create or track a purchase order.',
    processLabel: 'HOW WORK HAPPENED',
    processes: [
      { label: 'Download data', body: 'Export sales and inventory files' },
      { label: 'Build an Excel view', body: 'Merge, compare and calculate manually' },
      { label: 'Write the purchase need', body: 'Type products and quantities by hand' },
      { label: 'Receive outside the order', body: 'Count delivered goods with no PO trail' },
      { label: 'Search every item', body: 'Find each SKU and enter stock one by one' },
    ],
    calloutLabel: 'SYSTEM GAP',
    calloutBody: 'No shared order state, no document reconciliation, no operational trace.',
    cardBg: '#f6f0df',
    cardTextColor: '#161616',
    processBg: '#ffffff',
    processTextColor: '#161616',
    calloutBg: '#ede2c6',
    calloutLabelColor: '#8a6500',
  },
  {
    tag: 'PHASE 1 · DESIGN RESULT',
    tagBg: '#e9eef8',
    tagColor: accent,
    title: 'A traceable purchase workspace.',
    body: 'Purchase need, supplier confirmation, shipment, receiving, and inventory now share one business context.',
    processLabel: 'WHAT THE PLATFORM ADDED',
    processes: [
      { label: 'Purchase request', body: 'Create SKU lines, quantity and estimate' },
      { label: 'Approval and PO', body: 'Move from request to tracked order' },
      { label: 'Document capture', body: 'Upload confirmation; use OCR to import' },
      { label: 'Partial receiving', body: 'Track ordered, received and remaining' },
      { label: 'Variance handling', body: 'Record shortages, overages and anomalies' },
    ],
    calloutLabel: 'REMAINING GAP',
    calloutBody: 'The workflow was digital, but deciding what and how much to buy remained manual.',
    cardBg: '#f4f4f4',
    cardTextColor: '#161616',
    processBg: '#ffffff',
    processTextColor: '#161616',
    calloutBg: '#e9eef8',
    calloutLabelColor: accent,
  },
  {
    tag: 'STAGE 03 · AI AGENT',
    tagBg: accent,
    tagColor: '#ffffff',
    title: 'The system helps form and monitor the decision.',
    body: 'Conversation captures intent; tools read evidence and create one editable optimal plan.',
    processLabel: 'TARGET EXPERIENCE',
    processes: [
      { label: 'Express the goal', body: 'Supplier + desired sales coverage' },
      { label: 'Read and calculate', body: 'Sales, stock, lead time, seasonality, rules' },
      { label: 'Edit one proposal', body: 'Review SPU-grouped items and evidence' },
      { label: 'Verify documents', body: 'Export, upload confirmation, detect changes' },
      { label: 'Track and learn', body: 'Monitor fulfilment and govern memory signals' },
    ],
    calloutLabel: 'AUTHORITY BOUNDARY',
    calloutBody: 'The Agent never places the formal supplier order. A person records it after acting externally.',
    cardBg: '#161616',
    cardTextColor: '#ffffff',
    processBg: '#292929',
    processTextColor: '#ffffff',
    calloutBg: accent,
    calloutLabelColor: '#ffffff',
  },
];

function EvolutionStageCard({ stage, compact = false }: { stage: StageData; compact?: boolean }) {
  return (
    <div className="flex w-full flex-col gap-[18px] p-6" style={{ background: stage.cardBg }}>
      <span
        className="inline-flex w-fit items-center px-[10px] py-[6px] text-[10px] font-bold"
        style={{ ...bodyStyle, background: stage.tagBg, color: stage.tagColor }}
      >
        {stage.tag}
      </span>
      <p className="m-0 text-[22px] font-bold leading-[1.2]" style={{ ...bodyStyle, color: stage.cardTextColor }}>
        {stage.title}
      </p>
      <p
        className="m-0 text-[13px] font-normal leading-[19px]"
        style={{ ...bodyStyle, color: stage.cardTextColor, opacity: stage.cardBg === '#161616' ? 0.85 : 0.75 }}
      >
        {stage.body}
      </p>
      {!compact && (
        <>
          <p
            className="m-0 text-[10px] font-bold uppercase"
            style={{ ...bodyStyle, color: stage.cardBg === '#161616' ? '#afafaf' : '#777' }}
          >
            {stage.processLabel}
          </p>
          <div className="flex flex-col gap-2">
            {stage.processes.map((process, index) => (
              <div key={process.label} className="flex gap-3 px-3 py-[10px]" style={{ background: stage.processBg }}>
                <p
                  className="m-0 shrink-0 text-[10px] font-bold"
                  style={{ ...bodyStyle, color: stage.cardBg === '#161616' ? '#cfcfcf' : '#3b3b3b' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </p>
                <div className="flex flex-col gap-[3px]">
                  <p className="m-0 text-[11px] font-bold" style={{ ...bodyStyle, color: stage.processTextColor }}>
                    {process.label}
                  </p>
                  <p
                    className="m-0 text-[9px] font-normal"
                    style={{ ...bodyStyle, color: stage.cardBg === '#161616' ? '#cfcfcf' : '#3b3b3b' }}
                  >
                    {process.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="flex flex-col gap-[7px] py-[13px] pl-[14px]" style={{ background: stage.calloutBg }}>
        <p className="m-0 text-[10px] font-bold" style={{ ...bodyStyle, color: stage.calloutLabelColor }}>
          {stage.calloutLabel}
        </p>
        <p
          className="m-0 max-w-[250px] text-[12px] font-bold leading-[16px]"
          style={{ ...bodyStyle, color: stage.cardBg === '#161616' ? '#ffffff' : '#161616' }}
        >
          {stage.calloutBody}
        </p>
      </div>
    </div>
  );
}

function ThreeStageEvolution() {
  return (
    <div className="flex max-w-[1080px] flex-col gap-10" data-case-nav-label="04 / Phase 1">
      <p className="m-0 text-[12px] font-bold uppercase leading-none" style={{ ...bodyStyle, color: accent }}>
        04 — Phase 1
      </p>
      <h2 className="m-0 max-w-[900px] text-[clamp(30px,4.2vw,46px)] font-bold leading-[1.1] tracking-[-0.025em] text-[#161616]" style={bodyStyle}>
        Making procurement structured and traceable
      </h2>
      <p className="m-0 max-w-[840px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
        <strong className="font-bold text-[#161616]">Can the system represent how procurement actually works?</strong>{' '}
        Before AI could participate, procurement first needed a shared object model, explicit states, and traceable evidence.
      </p>

      <div className="bg-[#e9eef8] px-[clamp(22px,3vw,32px)] py-6">
        <p className="m-0 text-[clamp(22px,2.8vw,30px)] font-bold leading-[1.35] text-[#161616]" style={bodyStyle}>
          Phase 1 turned procurement from a set of records into a stateful lifecycle.
        </p>
      </div>

      <div className="grid gap-px bg-[#d8d8d8] lg:grid-cols-3">
        <article className="flex min-h-[300px] flex-col gap-5 bg-[#f4f4f4] p-[clamp(22px,3vw,30px)]">
          <p className="m-0 text-[11px] font-bold text-[#2155e8]" style={bodyStyle}>01 · OBJECT MODEL</p>
          <h3 className="m-0 text-[21px] font-bold leading-[1.3] text-[#161616]" style={bodyStyle}>Every receiving event belongs to a purchase lifecycle.</h3>
          <p className="m-0 text-[14px] font-normal leading-[1.55] text-[#555]" style={bodyStyle}>
            Instead of isolated inventory changes, receiving remains connected to the purchase that created it.
          </p>
          <div className="mt-auto flex flex-col gap-2">
            {['Purchase', 'Confirmation', 'DDT', 'Receiving', 'Inventory'].map((stage, index, stages) => (
              <div key={stage} className="flex flex-col items-start">
                <div className="w-full border border-[#d8d8d8] bg-white px-3 py-2 text-[12px] font-bold text-[#161616]" style={bodyStyle}>{stage}</div>
                {index < stages.length - 1 && <span className="ml-4 h-3 border-l border-[#2155e8]" aria-hidden />}
              </div>
            ))}
          </div>
        </article>

        <article className="flex min-h-[300px] flex-col gap-5 bg-[#f4f4f4] p-[clamp(22px,3vw,30px)]">
          <p className="m-0 text-[11px] font-bold text-[#2155e8]" style={bodyStyle}>02 · STATE MODEL</p>
          <h3 className="m-0 text-[21px] font-bold leading-[1.3] text-[#161616]" style={bodyStyle}>Each purchase moves through explicit, recoverable states.</h3>
          <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-3">
            {['Draft', 'Awaiting supplier', 'Confirmed', 'Ordered', 'Partially received', 'Completed'].map((state, index, states) => (
              <div key={state} className="flex items-center gap-2">
                <span className="border border-[#d8d8d8] bg-white px-3 py-2 text-[11px] font-bold text-[#3b3b3b]" style={bodyStyle}>{state}</span>
                {index < states.length - 1 && (
                  <span className="text-[15px] font-bold text-[#2155e8]" aria-hidden>→</span>
                )}
              </div>
            ))}
          </div>
        </article>

        <article className="flex min-h-[300px] flex-col gap-5 bg-[#161616] p-[clamp(22px,3vw,30px)]">
          <p className="m-0 text-[11px] font-bold text-[#7fa2ff]" style={bodyStyle}>03 · EVIDENCE MODEL</p>
          <h3 className="m-0 text-[21px] font-bold leading-[1.3] text-white" style={bodyStyle}>Confirmation, DDT, and actual receiving remain linked instead of overwriting each other.</h3>
          <p className="m-0 text-[14px] font-normal leading-[1.55] text-[#d8d8d8]" style={bodyStyle}>
            This makes discrepancies visible rather than hidden in the final stock value.
          </p>
          <div className="mt-auto flex flex-col gap-2">
            {['Purchase request', 'Supplier confirmation', 'DDT', 'Actual receiving'].map((evidence, index, evidenceList) => (
              <div key={evidence} className="flex flex-col items-start">
                <div className="w-full border border-white/20 bg-[#202020] px-3 py-2 text-[12px] font-bold text-white" style={bodyStyle}>{evidence}</div>
                {index < evidenceList.length - 1 && <span className="ml-4 h-3 border-l border-[#7fa2ff]" aria-hidden />}
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="border border-[#d8d8d8] bg-white p-[clamp(22px,3vw,32px)]">
        <p className="m-0 mb-5 text-[11px] font-bold uppercase tracking-[0.04em] text-[#777]" style={bodyStyle}>Evidence comparison</p>
        <div className="grid gap-px bg-[#d8d8d8] sm:grid-cols-5">
          {[
            { label: 'Requested', value: '10' },
            { label: 'Confirmed', value: '8' },
            { label: 'DDT', value: '8' },
            { label: 'Received', value: '11' },
            { label: 'Variance', value: '+3', highlighted: true },
          ].map((item) => (
            <div key={item.label} className="flex min-h-[110px] flex-col justify-between p-4" style={{ background: item.highlighted ? '#2155e8' : '#f4f4f4' }}>
              <p className="m-0 text-[10px] font-bold uppercase" style={{ ...bodyStyle, color: item.highlighted ? 'rgb(255 255 255 / 0.75)' : '#777' }}>{item.label}</p>
              <p className="m-0 text-[30px] font-bold" style={{ ...bodyStyle, color: item.highlighted ? '#ffffff' : '#161616' }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <DesignResultStructuredOperations />

      <div className="flex flex-col gap-3 bg-[#2155e8] px-[clamp(22px,3vw,32px)] py-6 sm:flex-row sm:items-center sm:gap-7">
        <p className="m-0 shrink-0 text-[11px] font-bold uppercase tracking-[0.05em] text-white/70" style={bodyStyle}>
          Phase 1 outcome
        </p>
        <p className="m-0 max-w-[900px] text-[19px] font-bold leading-[1.45] text-white" style={bodyStyle}>
          Buyers could finally complete and trace the full procurement lifecycle inside one system.
        </p>
      </div>
    </div>
  );
}

function StatChip({
  index,
  label,
  body,
  highlighted,
}: {
  index: string;
  label: string;
  body: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className="flex min-h-[92px] flex-col gap-2 p-5"
      style={{ background: highlighted ? accent : '#f4f4f4' }}
    >
      <p className="m-0 text-[12px] font-bold" style={{ ...bodyStyle, color: highlighted ? '#ffffff' : accent }}>
        {index}
      </p>
      <p
        className="m-0 text-[11px] font-bold uppercase tracking-wide"
        style={{ ...bodyStyle, color: highlighted ? '#ffffff' : '#161616' }}
      >
        {label}
      </p>
      <p className="m-0 text-[13px] font-normal" style={{ ...bodyStyle, color: highlighted ? 'rgb(255 255 255 / 0.85)' : '#3b3b3b' }}>
        {body}
      </p>
    </div>
  );
}

function DesignResultStructuredOperations() {
  return (
    <div className="flex flex-col gap-5">
      <p className="m-0 text-[11px] font-bold uppercase tracking-[0.04em]" style={{ ...bodyStyle, color: accent }}>
        Phase 1 — Making Procurement Structured
      </p>
      <Phase1ScreenshotSwitcher />
    </div>
  );
}

function ProcurementTurningPoint() {
  const beforeTasks = [
    'Find data',
    'Organize data',
    'Calculate',
    'Apply supplier rules',
    'Make judgment',
    'Create order',
  ];

  return (
    <div className="flex max-w-[1080px] flex-col gap-10" data-case-nav-label="05 / The Turning Point">
      <div className="flex max-w-[920px] flex-col gap-6">
        <p className="m-0 text-[12px] font-bold uppercase tracking-[0.05em] text-[#7fa2ff]" style={bodyStyle}>
          05 — The Turning Point
        </p>
        <h2 className="m-0 text-[clamp(36px,5.5vw,68px)] font-bold leading-[1.02] tracking-[-0.035em] text-white" style={bodyStyle}>
          I had digitized the workflow,
          <br />
          <span className="text-[#7fa2ff]">but I had not reduced the cognitive work.</span>
        </h2>
      </div>

      <blockquote className="m-0 max-w-[900px] border-l-2 border-[#ed5b2b] py-2 pl-6">
        <p className="m-0 text-[clamp(18px,2.4vw,26px)] font-normal leading-[1.5] text-white" style={bodyStyle}>
          “Now I don&apos;t need to switch between Excel and the system anymore. But the part that takes the most time is still the same—I still have to decide what to buy and how much.”
        </p>
        <footer className="mt-4 text-[11px] font-bold uppercase tracking-[0.05em] text-[#afafaf]" style={bodyStyle}>
          Procurement team feedback after Phase 1
        </footer>
      </blockquote>

      <div className="grid gap-px bg-white/20 lg:grid-cols-2">
        <article className="bg-[#202020] p-[clamp(22px,3vw,34px)]">
          <p className="m-0 mb-6 text-[11px] font-bold uppercase tracking-[0.05em] text-[#afafaf]" style={bodyStyle}>
            Before Phase 1
          </p>
          <div className="flex flex-col">
            {beforeTasks.map((task, index) => (
              <div key={task} className="flex items-center gap-4 border-t border-white/15 py-4 first:border-t-0 first:pt-0">
                <span className="text-[10px] font-bold text-[#777]" style={bodyStyle}>{String(index + 1).padStart(2, '0')}</span>
                <span className="text-[16px] font-bold text-white" style={bodyStyle}>{task}</span>
                {index < beforeTasks.length - 1 && <span className="ml-auto text-[14px] text-[#777]" aria-hidden>+</span>}
              </div>
            ))}
          </div>
        </article>

        <article className="bg-[#202020] p-[clamp(22px,3vw,34px)]">
          <p className="m-0 mb-6 text-[11px] font-bold uppercase tracking-[0.05em] text-[#afafaf]" style={bodyStyle}>
            After Phase 1
          </p>
          <div className="flex flex-col gap-3">
            <p className="m-0 text-[10px] font-bold uppercase tracking-[0.05em] text-[#7fa2ff]" style={bodyStyle}>System now</p>
            {['Retrieves data', 'Organizes workflow'].map((task) => (
              <div key={task} className="border border-[#2155e8] bg-[#172348] px-4 py-3 text-[15px] font-bold text-white" style={bodyStyle}>{task}</div>
            ))}
          </div>

          <div className="my-7 flex items-center gap-4" aria-label="But buyers still perform the decision work">
            <span className="h-px flex-1 bg-white/20" />
            <span className="bg-[#ed5b2b] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.06em] text-white" style={bodyStyle}>But</span>
            <span className="h-px flex-1 bg-white/20" />
          </div>

          <div className="flex flex-col gap-3">
            <p className="m-0 text-[10px] font-bold uppercase tracking-[0.05em] text-[#ff916d]" style={bodyStyle}>Buyer still</p>
            {['Calculate', 'Apply supplier rules', 'Make judgment'].map((task) => (
              <div key={task} className="border border-[#ed5b2b] bg-[#2a1d19] px-4 py-3 text-[15px] font-bold text-white" style={bodyStyle}>{task}</div>
            ))}
          </div>
        </article>
      </div>

      <div className="border-t border-white/20 pt-9">
        <p className="m-0 max-w-[1000px] text-[clamp(34px,5vw,62px)] font-bold leading-[1.05] tracking-[-0.035em] text-white" style={bodyStyle}>
          The interface problem had been solved.
          <br />
          <span className="text-[#ed5b2b]">The decision problem had not.</span>
        </p>
      </div>
    </div>
  );
}

function DesignResultEvidenceBackedAgency() {
  return (
    <div className="flex flex-col gap-10" data-case-nav-label="06 / Reframing the Problem">
      <p className="m-0 text-[12px] font-bold uppercase leading-none" style={{ ...bodyStyle, color: accent }}>
        06 — Reframing the Problem
      </p>

      <div className="flex max-w-[940px] flex-col gap-5">
        <h2 className="m-0 text-[clamp(34px,4.8vw,56px)] font-bold leading-[1.08] tracking-[-0.03em] text-[#161616]" style={bodyStyle}>
          The real bottleneck was procurement judgment
        </h2>
        <p className="m-0 max-w-[860px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
          Every purchase decision still required buyers to combine experience, sales, inventory, supplier constraints, lead time, and seasonal demand.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-px bg-[#d8d8d8] sm:grid-cols-3 lg:grid-cols-6">
        {['Experience', 'Sales', 'Inventory', 'Supplier rules', 'Lead time', 'Seasonality'].map((input) => (
          <div key={input} className="flex min-h-[105px] items-end bg-[#f4f4f4] p-4 text-[13px] font-bold text-[#161616]" style={bodyStyle}>{input}</div>
        ))}
      </div>

      <div className="mt-[clamp(72px,10vw,128px)] flex max-w-[920px] flex-col gap-5" data-case-nav-label="07 / Why an Agent?">
        <p className="m-0 text-[12px] font-bold uppercase leading-none" style={{ ...bodyStyle, color: accent }}>
          07 — Why an Agent?
        </p>
        <h2 className="m-0 text-[clamp(30px,4.3vw,48px)] font-bold leading-[1.1] tracking-[-0.025em] text-[#161616]" style={bodyStyle}>
          Why not just another dashboard?
        </h2>
        <p className="m-0 max-w-[820px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
          A dashboard could expose data, but it could not dynamically interpret a purchasing goal, gather the right context, resolve missing inputs, coordinate calculations, and decide what required human attention.
        </p>
        <div className="flex max-w-[820px] flex-col gap-2">
          <p className="m-0 text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
            The need was not simply to see more information.
          </p>
          <p className="m-0 text-[20px] font-bold leading-[1.5] text-[#161616]" style={bodyStyle}>
            It was to turn a goal into a reviewable purchasing plan.
          </p>
        </div>
      </div>

      <blockquote className="m-0 border-l-[5px] bg-[#e9eef8] px-[clamp(22px,3vw,32px)] py-[clamp(22px,3vw,30px)]" style={{ borderColor: accent }}>
        <p className="m-0 text-[clamp(22px,3vw,34px)] font-bold leading-[1.35] text-[#161616]" style={bodyStyle}>
          “Don&apos;t just give me the data. Help me calculate a reasonable purchasing plan from it.”
        </p>
      </blockquote>

      <div className="bg-[#161616] p-[clamp(22px,3vw,32px)]">
        <p className="m-0 mb-5 text-[11px] font-bold uppercase tracking-[0.05em] text-[#7fa2ff]" style={bodyStyle}>
          What required an Agent
        </p>
        <div className="grid gap-px bg-white/20 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              title: 'Interpret the goal',
              body: 'Understand what the buyer is trying to accomplish.',
            },
            {
              title: 'Retrieve the right evidence',
              body: 'Select the sales, inventory, supplier, and historical context relevant to this purchase.',
            },
            {
              title: 'Coordinate tools and calculations',
              body: 'Sequence data retrieval, deterministic calculations, and rule checks.',
            },
            {
              title: 'Detect exceptions',
              body: 'Identify missing inputs, unusual prices, shortages, and approval conditions.',
            },
            {
              title: 'Explain and resume',
              body: 'Show why a recommendation was made and continue the task after human intervention.',
            },
          ].map((capability) => (
            <div key={capability.title} className="flex min-h-[220px] flex-col justify-between gap-6 bg-[#202020] p-4" style={bodyStyle}>
              <p className="m-0 text-[14px] font-bold leading-[1.4] text-white">
                {capability.title}
              </p>
              <p className="m-0 text-[12px] font-normal leading-[1.55] text-[#c8c8c8]">
                {capability.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 border border-[#d8d8d8] bg-white p-[clamp(22px,4vw,40px)]">
        <div className="flex flex-col gap-2 opacity-55">
          <p className="m-0 text-[10px] font-bold uppercase tracking-[0.05em] text-[#777]" style={bodyStyle}>Not</p>
          <p className="m-0 text-[17px] font-bold text-[#555] line-through" style={bodyStyle}>How can AI automate procurement?</p>
        </div>
        <div className="h-px bg-[#d8d8d8]" />
        <div className="flex flex-col gap-3">
          <p className="m-0 text-[10px] font-bold uppercase tracking-[0.05em]" style={{ ...bodyStyle, color: accent }}>HMW</p>
          <h2 className="m-0 max-w-[950px] text-[clamp(28px,4vw,46px)] font-bold leading-[1.15] tracking-[-0.025em] text-[#161616]" style={bodyStyle}>
            How might we reduce the buyer&apos;s{' '}
            <span style={{ color: accent }}>cognitive workload</span>
            {' '}without removing their{' '}
            <span style={{ color: accent }}>control over purchasing decisions</span>?
          </h2>
        </div>
      </div>

      <div className="mt-[clamp(72px,10vw,128px)] flex flex-col gap-6 bg-[#161616] p-[clamp(22px,4vw,40px)]" data-case-nav-label="08 / Making the System Agent-ready">
        <p className="m-0 text-[12px] font-bold uppercase leading-none text-[#7fa2ff]" style={bodyStyle}>
          08 — Making the System Agent-ready
        </p>
        <h2 className="m-0 max-w-[900px] text-[clamp(28px,4vw,44px)] font-bold leading-[1.12] tracking-[-0.025em] text-white" style={bodyStyle}>
          The Agent needed a context layer—not just access to tables.
        </h2>
        <p className="m-0 max-w-[880px] text-[20px] font-bold leading-[1.5] text-white" style={bodyStyle}>
          Before designing the Agent, I first had to redesign the business system it would reason over.
        </p>

        <div className="grid gap-px bg-white/20 lg:grid-cols-2">
          <div className="bg-[#202020] p-5">
            <p className="m-0 text-[10px] font-bold uppercase tracking-[0.04em] text-[#9f9f9f]" style={bodyStyle}>What the system already knew</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {['Sales', 'Inventory', 'Purchase', 'Receiving'].map((context) => (
                <div key={context} className="border border-white/15 px-3 py-3 text-[12px] font-bold text-white" style={bodyStyle}>{context}</div>
              ))}
            </div>
          </div>
          <div className="bg-[#202020] p-5">
            <p className="m-0 text-[10px] font-bold uppercase tracking-[0.04em] text-[#7fa2ff]" style={bodyStyle}>What the Agent also needed</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Supplier rules', 'Lead-time history', 'MOQ', 'Price changes', 'Seasonality', 'Promotions', 'Delivery reliability', 'User overrides'].map((context) => (
                <span key={context} className="border border-[#526cae] bg-[#27304a] px-3 py-2 text-[11px] font-bold text-white" style={bodyStyle}>{context}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-4">
          <p className="m-0 text-center text-[11px] font-bold uppercase tracking-[0.05em] text-[#7fa2ff]" style={bodyStyle}>
            From operational records to Agent-readable business context
          </p>
          <div className="grid grid-cols-2 gap-px bg-white/20 sm:grid-cols-3 lg:grid-cols-6">
            {[
              {
                title: 'Manual Operations',
                body: 'Human reconstructs context.',
              },
              {
                title: 'Structured Data',
                body: 'Core business objects are connected.',
              },
              {
                title: 'Traceable States',
                body: 'Purchases preserve status and history.',
              },
              {
                title: 'Historical Evidence',
                body: 'Past decisions and outcomes become queryable.',
              },
              {
                title: 'Agent-readable Context',
                body: 'Rules, evidence, and decision signals become usable by the Agent.',
              },
              {
                title: 'Procurement Agent',
                body: 'The system can now reason across the purchasing lifecycle.',
              },
            ].map((stage, index, stages) => (
              <div
                key={stage.title}
                className="relative flex min-h-[210px] flex-col justify-between gap-6 border px-4 py-4"
                style={{ background: index === stages.length - 1 ? accent : '#202020', borderColor: index === stages.length - 1 ? accent : 'rgb(255 255 255 / 0.2)' }}
              >
                <span className="text-[10px] font-bold" style={{ ...bodyStyle, color: index === stages.length - 1 ? 'rgb(255 255 255 / 0.72)' : '#7fa2ff' }}>{String(index + 1).padStart(2, '0')}</span>
                <div className="flex flex-col gap-2">
                  <span className="text-[13px] font-bold leading-[1.35] text-white" style={bodyStyle}>{stage.title}</span>
                  <span className="text-[11px] font-normal leading-[1.5]" style={{ ...bodyStyle, color: index === stages.length - 1 ? 'rgb(255 255 255 / 0.82)' : '#b8b8b8' }}>{stage.body}</span>
                </div>
                {index < stages.length - 1 && (
                  <span className="absolute -right-[8px] top-1/2 z-10 hidden -translate-y-1/2 text-[17px] font-bold text-[#7fa2ff] lg:block" aria-hidden>→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-[clamp(72px,10vw,128px)] flex flex-col gap-10" data-case-nav-label="09 / How the Agent Participates">
        <div className="flex max-w-[940px] flex-col gap-5">
          <p className="m-0 text-[12px] font-bold uppercase leading-none" style={{ ...bodyStyle, color: accent }}>
            09 — How the Agent Participates
          </p>
          <h3 className="m-0 max-w-[900px] text-[clamp(24px,3.2vw,34px)] font-bold leading-[1.2] text-[#161616]" style={bodyStyle}>
            The Agent does not replace the workflow. It changes how a decision is formed.
          </h3>
          <p className="m-0 max-w-[860px] text-[16px] font-normal leading-[1.55] text-[#3b3b3b]" style={bodyStyle}>
            I designed agency around three responsibilities: interpret the buyer&apos;s goal, build the recommendation from evidence, and surface exceptions that require human action.
          </p>
        </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <StatChip index="01" label="Interpret the goal" body="What does one month of supply mean in this context?" />
        <StatChip index="02" label="Build and calculate the plan" body="Retrieve sales, stock, incoming inventory, and supplier constraints." highlighted />
        <StatChip index="03" label="Surface exceptions for human action" body="Flag price changes, shortages, payment risk, and approval needs." />
      </div>

      <div className="flex flex-col gap-5 bg-[#2155e8] p-[clamp(28px,4vw,46px)]">
        <p className="m-0 text-[11px] font-bold uppercase tracking-[0.06em] text-white/70" style={bodyStyle}>
          AX Design Principle
        </p>
        <p className="m-0 max-w-[1000px] text-[clamp(25px,3.5vw,40px)] font-bold leading-[1.2] tracking-[-0.02em] text-white" style={bodyStyle}>
          Agency = interpreted intent + deterministic calculation + visible evidence + reversible edits + explicit human gates.
        </p>
      </div>
      </div>
    </div>
  );
}

const agentUxIterations = [
  {
    index: '01',
    from: 'Explain',
    to: 'Initiate',
    summary: 'The Agent became the entry point for real purchasing work.',
    initial: 'The Agent mainly explained page content and answered questions, while buyers still created purchase requirements through traditional controls.',
    learning: 'If buyers already knew what they wanted to do, explanation added little value. The Agent also asked for implementation-oriented inputs that could instead be derived from supplier history.',
    changes: [
      'Made the Agent the primary entry point for creating purchase requirements.',
      'Reframed inputs around business intent: “How many months of sales should this order cover?”',
      'Added persistent task starters for creating, importing, and recording purchase needs.',
      'Embedded structured search and form components directly inside the conversation.',
      'Used the left workspace as a live purchasing canvas while the Agent coordinated work on the right.',
      'Exposed the current Agent stage with expandable execution details.',
    ],
    principle: 'Conversation should initiate and structure real work—not merely explain the interface.',
  },
  {
    index: '02',
    from: 'Compare',
    to: 'Recommend',
    summary: 'Three scenarios became one editable, evidence-backed proposal.',
    initial: 'The Agent presented three replenishment scenarios for the buyer to compare.',
    learning: 'The buyer expected the Agent to do the comparison. Presenting several alternatives transferred the analytical burden back to the user and made the Agent feel indecisive.',
    changes: [
      'Replaced three scenarios with one recommended purchase proposal.',
      'Kept every SKU and quantity editable until the order was formally placed.',
      'Calculated quantity from sales velocity, coverage period, inventory, in-transit stock, and supplier lead time.',
      'Clarified the source window behind each metric, such as Sales · last 60 days.',
      'Separated estimated price, confirmed price, subtotal, shipping, and final order total.',
      'Added evidence, confidence, and risk signals without exposing model-oriented terminology.',
    ],
    principle: 'The Agent should reduce decision complexity while keeping its recommendation inspectable and reversible.',
  },
  {
    index: '03',
    from: 'Automate',
    to: 'Hand off',
    summary: 'Formal ordering became an explicit human authority boundary.',
    initial: 'Early interactions implied that the Agent or platform could complete the supplier order.',
    learning: 'Formal ordering happens externally through email, WhatsApp, or supplier channels. It creates real financial and supplier commitments, so the business would not delegate it to an Agent.',
    changes: [
      'Defined a strict boundary: the Agent can analyse, prepare, compare, and verify—but cannot place the formal order.',
      'Added export of supplier-facing purchase requests in the supplier’s language.',
      'Removed prices from exported supplier documents.',
      'Allowed supplier confirmations to be uploaded before the order was recorded as placed.',
      'Used the Agent to compare confirmation documents against the proposed order.',
      'Required the buyer to complete the external order and explicitly record Order placed.',
      'Kept confirmation upload contextual to the task instead of making it a permanent top-level action.',
    ],
    principle: 'Automation should stop where legal, financial, or external commitment begins.',
  },
  {
    index: '04',
    from: 'Separate approval',
    to: 'Escalate by exception',
    summary: 'Risk triggered approval only when new evidence required it.',
    initial: 'Orders requiring negotiation or approval were handled through a separate interface with multiple confirmation layers.',
    learning: 'A normal order may only become risky after new evidence arrives. Approval is a state transition triggered by evidence, not a separate type of order.',
    changes: [
      'Unified normal and approval-required orders in one purchase-order experience.',
      'Triggered escalation only when the Agent detected a material exception.',
      'Surfaced warnings directly on the affected SKU.',
      'Added SKU-level Agent conversations for investigating individual exceptions.',
      'Reduced approval views to the final proposed terms.',
      'Moved negotiation history behind a secondary View history action.',
      'Preserved each supplier confirmation version as separate evidence.',
      'Allowed edits continuously until the order was formally placed.',
    ],
    principle: 'Escalation should emerge from evidence and risk—not from a parallel workflow created too early.',
  },
  {
    index: '05',
    from: 'Manual receiving',
    to: 'Reconcile & learn',
    summary: 'Fulfillment differences became structured evidence and governed learning signals.',
    initial: 'Receiving was treated as another manual form: warehouse staff searched for products and entered stock quantities one by one.',
    learning: 'Real fulfillment is not linear. One purchase order may arrive in several shipments, and actual quantities may differ from both the confirmation and the DDT.',
    changes: [
      'Compared ordered, DDT, and actually received quantities for every SKU.',
      'Kept actual received quantity manually editable because it depends on physical counting.',
      'Removed the redundant stock-in quantity—the accepted actual quantity becomes the inventory update.',
      'Added Do not stock in / Return for damaged, incorrect, or unwanted goods.',
      'Supported partial deliveries and remaining unshipped quantities.',
      'Allowed DDT upload both before and at receiving.',
      'Used email events to infer shipment or delay status when no DDT was available.',
      'Added Acknowledged so users could retain an exception without repeated alerts.',
      'Recorded overrides and final outcomes as learning candidates.',
      'Required human confirmation before high-impact supplier rules entered long-term Agent memory.',
    ],
    principle: 'Learning should come from the gap between recommendation, human decision, and real-world outcome—not from edits alone.',
  },
];

function AgentUxIterationsSection() {
  return (
    <section className="overflow-x-clip bg-[#f4f4f4]" style={sectionStyle}>
      <div className="flex flex-col gap-9" data-case-nav-label="15 / Agent UX Iterations">
        <p className="m-0 text-[12px] font-bold uppercase leading-none" style={{ ...bodyStyle, color: accent }}>
          15 — Agent UX Iterations
        </p>
        <div className="flex max-w-[980px] flex-col gap-5">
          <h2 className="m-0 text-[clamp(26px,3.6vw,40px)] font-bold leading-[1.15] text-[#161616]" style={bodyStyle}>
            The Agent became useful as its role became more specific.
          </h2>
          <p className="m-0 text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
            These iterations shifted the experience from <strong className="font-bold text-[#161616]">a chatbot beside a procurement interface</strong> into an <strong className="font-bold text-[#161616]">evidence-backed, human-controlled purchasing workflow</strong>.
          </p>
          <p className="m-0 text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
            Each iteration changed not only the UI, but also what the Agent was expected to understand, decide, escalate, and learn from.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {agentUxIterations.map((iteration) => (
            <details key={iteration.index} className="group border border-[#d8d8d8] bg-white open:border-[#2155e8]">
              <summary className="grid cursor-pointer list-none gap-4 p-[clamp(18px,3vw,26px)] sm:grid-cols-[44px_minmax(220px,0.8fr)_1fr_24px] sm:items-center">
                <span className="text-[11px] font-bold text-[#777]" style={bodyStyle}>{iteration.index}</span>
                <span className="flex items-center gap-3 text-[15px] font-bold text-[#161616]" style={bodyStyle}>
                  {iteration.from}
                  <span className="text-[#2155e8]" aria-hidden>→</span>
                  <span style={{ color: accent }}>{iteration.to}</span>
                </span>
                <span className="text-[13px] font-normal leading-[1.5] text-[#555]" style={bodyStyle}>{iteration.summary}</span>
                <span className="text-[20px] font-bold text-[#2155e8] transition-transform group-open:rotate-45" aria-hidden>+</span>
              </summary>

              <div className="grid gap-px border-t border-[#d8d8d8] bg-[#d8d8d8] lg:grid-cols-2">
                <div className="flex flex-col gap-3 bg-[#f4f4f4] p-[clamp(20px,3vw,28px)]">
                  <p className="m-0 text-[10px] font-bold uppercase tracking-[0.05em] text-[#777]" style={bodyStyle}>Initial design</p>
                  <p className="m-0 text-[14px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>{iteration.initial}</p>
                </div>
                <div className="flex flex-col gap-3 bg-[#e9eef8] p-[clamp(20px,3vw,28px)]">
                  <p className="m-0 text-[10px] font-bold uppercase tracking-[0.05em]" style={{ ...bodyStyle, color: accent }}>What I learned</p>
                  <p className="m-0 text-[14px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>{iteration.learning}</p>
                </div>
                <div className="flex flex-col gap-4 bg-white p-[clamp(20px,3vw,28px)] lg:col-span-2">
                  <p className="m-0 text-[10px] font-bold uppercase tracking-[0.05em] text-[#777]" style={bodyStyle}>Design iteration</p>
                  <div className="grid gap-2 md:grid-cols-2">
                    {iteration.changes.map((change) => (
                      <p key={change} className="m-0 bg-[#f4f4f4] px-4 py-3 text-[12px] font-normal leading-[1.5] text-[#161616]" style={bodyStyle}>{change}</p>
                    ))}
                  </div>
                </div>
                <blockquote className="m-0 border-l-[5px] border-[#2155e8] bg-[#161616] px-[clamp(20px,3vw,28px)] py-5 lg:col-span-2">
                  <p className="m-0 text-[10px] font-bold uppercase tracking-[0.05em] text-[#7fa2ff]" style={bodyStyle}>Design principle</p>
                  <p className="m-0 mt-3 text-[18px] font-bold leading-[1.5] text-white" style={bodyStyle}>{iteration.principle}</p>
                </blockquote>
              </div>
            </details>
          ))}
        </div>

        <div className="bg-[#2155e8] p-[clamp(24px,4vw,40px)]">
          <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em] text-white/70" style={bodyStyle}>Iteration outcome</p>
          <p className="m-0 mt-4 max-w-[1040px] text-[clamp(22px,3vw,34px)] font-bold leading-[1.3] text-white" style={bodyStyle}>
            The experience evolved from “a chatbot beside a purchase form” into a stateful Agent that captures intent, produces one evidence-backed recommendation, supports reversible edits, pauses at human authority boundaries, reconciles real-world outcomes, and learns only from verified evidence.
          </p>
        </div>
      </div>
    </section>
  );
}

const demoUrl = '/demos/procurement-agent/index.html';

function InteractiveDemo() {
  return (
    <div data-case-nav-label="00 / Interactive Demo">
      <div className="hidden md:block">
        <ProcurementDemoEmbed src={demoUrl} title="Procurement Agent interactive demo" />
      </div>

      {/* The workspace is a desktop ERP layout; on phones link out instead of embedding it */}
      <div className="flex flex-col gap-4 bg-white md:hidden">
        <Image
          src="/img/procurement-agent/mockup-agent-workspace.png"
          alt="Procurement Agent workspace with the purchase order and the agent panel side by side"
          width={1600}
          height={1000}
          className="h-auto w-full"
        />
        <p className="m-0 text-[13px] font-normal leading-[1.55] text-[#3b3b3b]" style={bodyStyle}>
          The demo needs a desktop-sized window to lay out its three panes.
        </p>
        <a
          href={demoUrl}
          target="_blank"
          rel="noreferrer"
          className="text-[13px] font-bold underline underline-offset-4"
          style={{ ...bodyStyle, color: accent }}
        >
          Open the demo in a new tab &rarr;
        </a>
      </div>
    </div>
  );
}

export default function ProcurementAgentPage() {
  return (
    <div className="mei-project-page w-full">
      <CaseStudyControls tldrPoints={tldrPoints} accentColor={accent} />
      <CaseStudyHero
        accentColor={accent}
        title="AI Procurement Agent for DEF Beauty Supply"
        subtitle="Designing an evidence-backed procurement agent that helps buyers decide what to purchase, how much to order, and why—while keeping critical decisions under human control."
        tags={['B2B SaaS', 'Enterprise UX', 'AX Design', 'Agent Workflow', 'Data Architecture']}
        aboutLabel="About DEF Beauty Supply"
        about={'DEF Beauty Supply is a B2B beauty wholesaler serving professional customers in Italy.\n\nIts sales, inventory, procurement, receiving, and finance workflows were spread across disconnected systems and manual workarounds.\n\nI redesigned the core operational platform, then focused this case study on procurement—where a structured workflow became the foundation for an AI decision-support agent.'}
        meta={[
          {
            label: 'Role',
            value: [
              'UX / AX Designer',
              'End-to-end ownership across business research, workflow redesign, data modeling, Agent architecture, interaction design, LangGraph prototyping, and implementation.',
            ],
          },
          {
            label: 'Scope',
            value: ['Platform redesign → Procurement lifecycle → AI Procurement Agent'],
          },
          {
            label: 'Team',
            value: ['Cross-functional collaboration with procurement, operations, and business stakeholders.'],
          },
          { label: 'Company', value: ['DEF Beauty Supply'] },
          { label: 'Year', value: ['2026'] },
        ]}
        visualLabel="DEF Beauty Supply procurement workspace"
        visualSrc="/img/procurement-agent/Procurement Agent.avif"
        visualAlt="DEF Beauty Supply purchase workspace with supplier purchase orders and an AI procurement agent panel."
        visualObjectPosition="center bottom"
        visualObjectFit="contain"
        visualImageScale={1.52}
        visualTransformOrigin="center top"
        visualTranslateY="10%"
        visualBackground="radial-gradient(circle at 78% 22%, rgb(83 118 255 / 0.3), transparent 28%), radial-gradient(circle at 18% 82%, rgb(33 85 232 / 0.22), transparent 34%), linear-gradient(135deg, #0b1020 0%, #111b38 48%, #071020 100%)"
        visualHeight="clamp(320px, 48vw, 620px)"
        visualNavTone="light"
        compactTypography
        wideDetails
      />

      {/* overflow-x visible here so the demo stage can expand past the content column */}
      <section style={sectionStyle}>
        <InteractiveDemo />

        <div className="flex max-w-[1080px] flex-col gap-8" data-case-nav-label="01 / Context">
          <p className="m-0 text-[12px] font-bold uppercase leading-none" style={{ ...bodyStyle, color: accent }}>
            01 — Context
          </p>
          <h2 className="m-0 max-w-[950px] text-[clamp(32px,4.6vw,52px)] font-bold leading-[1.08] tracking-[-0.025em] text-[#161616]" style={bodyStyle}>
            Rebuilding a fragmented B2B beauty supply platform
          </h2>
          <div className="flex max-w-[900px] flex-col gap-4">
            <p className="m-0 text-[17px] font-normal leading-[1.65] text-[#3b3b3b]" style={bodyStyle}>
              DEF Beauty Supply&apos;s sales, inventory, procurement, receiving, and finance workflows were spread across disconnected software, documents, messaging, and manual workarounds.
            </p>
            <p className="m-0 text-[17px] font-normal leading-[1.65] text-[#3b3b3b]" style={bodyStyle}>
              I redesigned the core business architecture across sales, inventory, procurement, and receiving. This case study focuses on procurement because improving the workflow exposed a deeper problem:{' '}
              <strong className="font-bold text-[#161616]">the system could record inventory, but not the decision process that created it.</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-x-clip bg-white" style={sectionStyle}>
        <div className="flex max-w-[1080px] flex-col gap-9" data-case-nav-label="02 / Why I focused on procurement">
          <p className="m-0 text-[12px] font-bold uppercase leading-none" style={{ ...bodyStyle, color: accent }}>
            02 — Why I focused on procurement
          </p>

          <div className="bg-[#f4f4f4] p-[clamp(20px,3vw,30px)]">
            <p className="m-0 mb-5 text-[11px] font-bold uppercase tracking-[0.04em]" style={{ ...bodyStyle, color: accent }}>
              Business ecosystem
            </p>
            <div className="grid grid-cols-2 gap-px bg-[#d8d8d8] sm:grid-cols-4 lg:grid-cols-7">
              {['Customer', 'WeChat Store', 'Sales Order', 'Inventory', 'Procurement', 'Receiving', 'Finance'].map((step, index, steps) => (
                <div
                  key={step}
                  className="relative flex min-h-[78px] items-end justify-between gap-2 px-3 py-3"
                  style={{ background: step === 'Procurement' ? accent : '#ffffff' }}
                >
                  <span className="text-[11px] font-bold leading-[1.3]" style={{ ...bodyStyle, color: step === 'Procurement' ? '#ffffff' : '#161616' }}>{step}</span>
                  {step === 'Procurement' && <span className="text-[8px] font-bold uppercase text-white/70" style={bodyStyle}>Focus</span>}
                  {index < steps.length - 1 && (
                    <span className="absolute -right-[7px] top-1/2 z-10 hidden -translate-y-1/2 text-[15px] font-bold text-[#2155e8] lg:block" aria-hidden>→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="m-0 bg-[#e9eef8] px-[clamp(22px,3vw,32px)] py-5 text-[19px] font-bold leading-[1.45] text-[#161616]" style={bodyStyle}>
            The business was not running on one system, but across several disconnected systems and manual workarounds.
          </p>

          <p className="m-0 max-w-[1020px] border-l-[5px] px-[clamp(20px,3vw,30px)] py-2 text-[clamp(24px,3.4vw,38px)] font-bold leading-[1.25] tracking-[-0.02em] text-[#161616]" style={{ ...bodyStyle, borderColor: accent }}>
            The platform could record inventory, but not the decision process that created it.
          </p>
        </div>
      </section>

      <section className="overflow-x-clip bg-white" style={sectionStyle}>
        <div className="flex max-w-[1080px] flex-col gap-10" data-case-nav-label="03 / Original Workflow">
          <div className="flex max-w-[820px] flex-col gap-5">
            <p className="m-0 text-[12px] font-bold uppercase leading-none" style={{ ...bodyStyle, color: accent }}>
              03 — Original Workflow
            </p>
            <h2 className="m-0 text-[clamp(30px,4.2vw,46px)] font-bold leading-[1.1] tracking-[-0.025em] text-[#161616]" style={bodyStyle}>
              Procurement existed across systems, not inside one
            </h2>
            <p className="m-0 max-w-[760px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
              Inventory existed in the system, but purchasing happened through exports, spreadsheets, messages, supplier documents, and manual stock entry.
            </p>
          </div>

          <div className="bg-[#161616] p-[clamp(24px,4vw,44px)]">
            <p className="m-0 mb-7 text-[11px] font-bold uppercase tracking-[0.05em] text-[#afafaf]" style={bodyStyle}>
              The old purchasing flow
            </p>
            <div className="overflow-x-auto pb-2" aria-label="Horizontal legacy purchasing flow with five annotated break points">
              <div className="min-w-[1160px]">
                <div className="grid grid-cols-10 gap-5">
                  {[
                    'Inventory system',
                    'Download sales & stock',
                    'Excel',
                    'Buyer estimates quantity',
                    'WhatsApp / Email supplier',
                    'Supplier confirms',
                    'Goods arrive',
                    'DDT',
                    'Manually search SKU one by one',
                    'Stock-in',
                  ].map((step, index, steps) => (
                    <div key={step} className="relative flex min-h-[104px] flex-col justify-between border border-white/20 bg-[#202020] px-3 py-4">
                      <span className="text-[10px] font-bold text-[#7fa2ff]" style={bodyStyle}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[12px] font-bold leading-[1.35] text-white" style={bodyStyle}>{step}</span>
                      {index < steps.length - 1 && (
                        <span className="absolute -right-[17px] top-1/2 -translate-y-1/2 text-[15px] text-[#7fa2ff]" aria-hidden>→</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="relative h-[190px]">
                  {[
                    { left: '20%', top: 28, sentence: 'Excel broke data traceability.' },
                    { left: '30%', top: 104, sentence: 'Quantity decisions stayed manual.', primary: true },
                    { left: '40%', top: 28, sentence: 'Supplier messages lost purchase context.' },
                    { left: '60%', top: 104, sentence: 'Purchase and fulfillment had no shared record.' },
                    { left: '80%', top: 28, sentence: 'Receiving was re-entered by hand.' },
                  ].map((item) => (
                    <div key={item.sentence}>
                      <span
                        className="absolute top-0 w-px bg-[#ed5b2b]"
                        style={{ left: item.left, height: `${item.top}px` }}
                        aria-hidden
                      />
                      <span
                        className="absolute top-0 size-[7px] -translate-x-1/2 rounded-full bg-[#ed5b2b]"
                        style={{ left: item.left }}
                        aria-hidden
                      />
                      <article
                        className="absolute flex min-h-[56px] w-[168px] -translate-x-1/2 items-center border px-3 py-2"
                        style={{
                          background: item.primary ? '#ed5b2b' : '#2a1d19',
                          borderColor: '#ed5b2b',
                          left: item.left,
                          top: `${item.top}px`,
                        }}
                      >
                        <p className="m-0 text-[11px] font-bold leading-[1.4] text-white" style={bodyStyle}>
                          {item.sentence}
                        </p>
                      </article>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>

          <div className="grid gap-px bg-[#ed5b2b] md:grid-cols-3">
            {[
              {
                label: 'Fragmented data',
                body: 'Sales, stock, supplier communication and receiving lived in different tools.',
              },
              {
                label: 'No lifecycle',
                body: 'The system recorded stock-in, but not purchase intent or fulfillment state.',
              },
              {
                label: 'Manual reconciliation',
                body: 'Confirmation, DDT and received quantities had to be compared by hand.',
              },
            ].map((problem, index) => (
              <article key={problem.label} className="flex min-h-[210px] flex-col gap-4 bg-[#161616] p-[clamp(22px,3vw,30px)]">
                <p className="m-0 text-[11px] font-bold text-[#ff916d]" style={bodyStyle}>
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="m-0 text-[clamp(20px,2.2vw,26px)] font-bold leading-[1.25] text-white" style={bodyStyle}>
                  {problem.label}
                </h3>
                <p className="m-0 mt-auto text-[14px] font-normal leading-[1.55] text-[#d8d8d8]" style={bodyStyle}>
                  {problem.body}
                </p>
              </article>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-l-[5px] bg-[#e9eef8] px-[clamp(22px,3vw,32px)] py-[clamp(22px,3vw,30px)]" style={{ borderColor: accent }}>
            <p className="m-0 max-w-[920px] text-[19px] font-bold leading-[1.5] text-[#161616]" style={bodyStyle}>
              Procurement data existed at every step, but the system could not connect those records into one decision and fulfillment lifecycle.
            </p>
            <p className="m-0 max-w-[920px] text-[clamp(22px,2.8vw,30px)] font-bold leading-[1.35]" style={{ ...bodyStyle, color: accent }}>
              So before introducing AI, I first rebuilt procurement as a structured, traceable lifecycle.
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-x-clip bg-white" style={sectionStyle}>
        <ThreeStageEvolution />
      </section>

      <section className="overflow-x-clip bg-[#161616]" style={sectionStyle}>
        <ProcurementTurningPoint />
      </section>

      <section className="overflow-x-clip bg-white" style={sectionStyle}>
        <DesignResultEvidenceBackedAgency />
      </section>

      <section className="overflow-x-clip bg-[#f4f4f4]" style={sectionStyle}>
        <div className="flex max-w-[1080px] flex-col gap-10" data-case-nav-label="10 / Designing the Procurement Agent">
          <p className="m-0 text-[12px] font-bold uppercase leading-none" style={{ ...bodyStyle, color: accent }}>
            10 — Designing the Procurement Agent
          </p>
          <h2 className="m-0 max-w-[940px] text-[clamp(30px,4.2vw,46px)] font-bold leading-[1.1] tracking-[-0.025em] text-[#161616]" style={bodyStyle}>
            The LLM interprets. The engine calculates. The buyer decides.
          </h2>
          <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
            I separated probabilistic interpretation from deterministic quantity calculation, risk checking, and human authorization so every recommendation remained explainable and controllable.
          </p>

          <div className="bg-[#161616] p-[clamp(22px,4vw,44px)]">
            <p className="m-0 mb-6 text-[11px] font-bold uppercase tracking-[0.05em] text-[#7fa2ff]" style={bodyStyle}>
              Responsibility architecture
            </p>
            <div className="grid gap-4 lg:grid-cols-3">
              {[
                {
                  role: 'LLM',
                  statement: 'Interpret and coordinate',
                  responsibilities: ['Understand intent', 'Clarify missing context', 'Choose tools', 'Explain results', 'Identify exceptions'],
                  background: '#202020',
                  border: 'rgb(255 255 255 / 0.2)',
                  accentColor: '#7fa2ff',
                },
                {
                  role: 'Deterministic Engine',
                  statement: 'Quantity is computed, not generated.',
                  responsibilities: [
                    'Calculate demand',
                    'Apply coverage period',
                    'Account for lead time',
                    'Subtract current and incoming inventory',
                    'Apply MOQ and supplier constraints',
                    'Check business thresholds',
                  ],
                  background: '#2155e8',
                  border: '#2155e8',
                  accentColor: 'rgb(255 255 255 / 0.72)',
                },
                {
                  role: 'Buyer',
                  statement: 'Own the purchasing decision',
                  responsibilities: ['Review', 'Edit', 'Approve', 'Place order'],
                  background: '#2a1d19',
                  border: '#ed5b2b',
                  accentColor: '#ff916d',
                },
              ].map((layer, index, layers) => (
                <article key={layer.role} className="relative flex min-h-[320px] flex-col border p-[clamp(20px,3vw,28px)]" style={{ background: layer.background, borderColor: layer.border }}>
                  <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em]" style={{ ...bodyStyle, color: layer.accentColor }}>{layer.role}</p>
                  <h3 className="m-0 mt-5 text-[clamp(22px,2.6vw,30px)] font-bold leading-[1.15] tracking-[-0.02em] text-white" style={bodyStyle}>{layer.statement}</h3>
                  <div className="mt-auto flex flex-col gap-px bg-white/20">
                    {layer.responsibilities.map((responsibility) => (
                      <p key={responsibility} className="m-0 bg-black/15 px-4 py-3 text-[13px] font-bold text-white" style={bodyStyle}>{responsibility}</p>
                    ))}
                  </div>
                  {index < layers.length - 1 && (
                    <span className="absolute -right-[18px] top-1/2 z-10 hidden -translate-y-1/2 text-[22px] font-bold text-[#7fa2ff] lg:block" aria-hidden>→</span>
                  )}
                </article>
              ))}
            </div>
          </div>

          <div className="border-l-[5px] border-[#2155e8] bg-white px-[clamp(22px,3vw,32px)] py-6">
            <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em]" style={{ ...bodyStyle, color: accent }}>Rationale</p>
            <p className="m-0 mt-3 max-w-[960px] text-[18px] font-bold leading-[1.5] text-[#161616]" style={bodyStyle}>
              Quantity affects cash, inventory risk, and supplier commitments, so the recommendation must be reproducible from business inputs—not generated probabilistically.
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-x-clip bg-white" style={sectionStyle}>
        <div className="flex flex-col gap-9" data-case-nav-label="11 / Executable Agent Workflow">
          <p className="m-0 text-[12px] font-bold uppercase leading-none" style={{ ...bodyStyle, color: accent }}>
            11 — Executable Agent Workflow
          </p>
          <h2 className="m-0 max-w-[980px] text-[clamp(26px,3.6vw,36px)] font-bold leading-[1.17] text-[#161616]" style={bodyStyle}>
            From a natural-language request to a human-recorded order.
          </h2>
          <p className="m-0 max-w-[940px] text-[17px] font-normal leading-[1.53] text-[#3b3b3b]" style={bodyStyle}>
            This was not a static flow. The Agent workflow preserves state, resumes after external work, uses system tools, and pauses whenever human action is required.
          </p>

          <div className="grid grid-cols-2 gap-px bg-[#d8d8d8] lg:grid-cols-4">
            {[
              { label: 'Stateful', body: 'Carry the purchase context across the task.' },
              { label: 'Resumable', body: 'Continue after approval, clarification, or external supplier response.' },
              { label: 'Tool-using', body: 'Read sales, inventory, supplier rules, documents, and historical data.' },
              { label: 'Human-interruptible', body: 'Pause before commitments or unresolved high-risk decisions.' },
            ].map((capability) => (
              <div key={capability.label} className="flex min-h-[130px] flex-col gap-3 bg-[#f4f4f4] p-4">
                <p className="m-0 text-[13px] font-bold" style={{ ...bodyStyle, color: accent }}>{capability.label}</p>
                <p className="m-0 text-[12px] font-normal leading-[1.5] text-[#555]" style={bodyStyle}>{capability.body}</p>
              </div>
            ))}
          </div>

          <div className="border-l-[5px] border-[#2155e8] bg-[#f4f4f4] px-[clamp(20px,3vw,28px)] py-5">
            <p className="m-0 text-[10px] font-bold uppercase tracking-[0.05em] text-[#777]" style={bodyStyle}>
              Implementation note
            </p>
            <p className="m-0 mt-2 text-[15px] font-bold leading-[1.5] text-[#161616]" style={bodyStyle}>
              LangGraph manages the stateful workflow, tool execution, human approval gates and task recovery—from prototype through production.
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-x-clip bg-[#f5e8e7]" style={sectionStyle}>
        <div className="flex flex-col gap-10" data-case-nav-label="12 / Human Gate">
          <div className="flex flex-col gap-[18px]">
            <p className="m-0 text-[12px] font-bold uppercase leading-none" style={{ ...bodyStyle, color: '#9c2e2e' }}>
              12 — Human Gate
            </p>
            <h2 className="m-0 max-w-[620px] text-[clamp(28px,4vw,40px)] font-bold leading-[1.13] text-[#161616]" style={bodyStyle}>
              The Agent cannot place an order.
            </h2>
            <p className="m-0 max-w-[620px] text-[17px] font-normal leading-[1.53] text-[#3b3b3b]" style={bodyStyle}>
              Formal ordering creates external financial and supplier commitments. The Agent can prepare and verify the decision, but the commitment remains human-owned.
            </p>
          </div>

          <div className="grid gap-px bg-[#d8b9b6] lg:grid-cols-3">
            {[
              {
                label: 'Agent can',
                items: [
                  'Generate a purchase recommendation',
                  'Prepare supplier-facing files',
                  'Compare confirmation documents',
                  'Flag price and quantity differences',
                  'Identify approval conditions',
                ],
                background: '#ffffff',
                labelColor: accent,
              },
              {
                label: 'Human owns',
                items: [
                  'Supplier communication',
                  'Negotiation',
                  'Formal confirmation',
                  'High-risk approvals',
                  'Recording the official order',
                ],
                background: '#161616',
                labelColor: '#ff916d',
              },
              {
                label: 'Approval examples',
                items: [
                  'Large spend or cash exposure',
                  'New or risky products',
                  'Unusual payment terms',
                  'Significant price or quantity changes',
                ],
                background: '#ffffff',
                labelColor: '#9c2e2e',
              },
            ].map((boundary) => (
              <article key={boundary.label} className="flex min-h-[300px] flex-col gap-5 p-[clamp(20px,3vw,28px)]" style={{ background: boundary.background }}>
                <p className="m-0 text-[13px] font-bold uppercase tracking-[0.04em]" style={{ ...bodyStyle, color: boundary.labelColor }}>
                  {boundary.label}
                </p>
                <div className="flex flex-col gap-px" style={{ background: boundary.background === '#161616' ? 'rgb(255 255 255 / 0.16)' : '#e2e2e2' }}>
                  {boundary.items.map((item) => (
                    <p
                      key={item}
                      className="m-0 px-4 py-3 text-[13px] font-bold leading-[1.45]"
                      style={{ ...bodyStyle, background: boundary.background, color: boundary.background === '#161616' ? '#ffffff' : '#161616' }}
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-px bg-[#d8b9b6] sm:grid-cols-5">
            {[
              { label: 'Evidence', body: 'Show the source behind every recommendation.' },
              { label: 'Confidence', body: 'Signal uncertainty without false precision.' },
              { label: 'DecisionTrace', body: 'Keep inputs, rules, changes, and reasons inspectable.' },
              { label: 'Human Gate', body: 'Pause before irreversible purchasing actions.' },
              { label: 'Approval', body: 'Bind authorization to the final quantity and price.' },
            ].map((principle) => (
              <div key={principle.label} className="flex min-h-[150px] flex-col gap-3 bg-white p-4">
                <p className="m-0 text-[12px] font-bold text-[#9c2e2e]" style={bodyStyle}>{principle.label}</p>
                <p className="m-0 text-[12px] font-normal leading-[1.5] text-[#555]" style={bodyStyle}>{principle.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-x-clip bg-[#161616]" style={sectionStyle}>
        <div className="flex flex-col gap-9" data-case-nav-label="13 / Closing the Loop">
          <p className="m-0 text-[12px] font-bold uppercase leading-none text-[#7fa2ff]" style={bodyStyle}>
            13 — Closing the Loop
          </p>
          <h2 className="m-0 max-w-[900px] text-[clamp(26px,3.6vw,36px)] font-bold leading-[1.17] text-white" style={bodyStyle}>
            A recommendation only becomes useful when its outcome returns to the system.
          </h2>
          <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.53] text-[#d8d8d8]" style={bodyStyle}>
            The purchase plan remains connected to supplier commitment, delivery evidence and the goods actually received—so the system can explain what changed after approval.
          </p>

          <div className="flex flex-wrap items-center gap-3 border border-white/20 bg-[#202020] px-5 py-4">
            <span className="text-[11px] font-bold text-[#7fa2ff]" style={bodyStyle}>MNP · SKU 431001</span>
            <span className="text-[13px] font-bold text-white" style={bodyStyle}>Agent 24</span>
            <span className="text-[#7fa2ff]" aria-hidden>→</span>
            <span className="text-[13px] font-bold text-white" style={bodyStyle}>Buyer 36</span>
          </div>

          <div className="grid gap-px bg-[#4a4a4a] md:grid-cols-5">
            {[
              { label: 'Supplier Confirmation', value: '30', body: 'Supplier commits below the buyer request.' },
              { label: 'DDT', value: '30', body: 'Shipment document matches the confirmation.' },
              { label: 'Receiving', value: '33', body: 'Warehouse records the physical quantity.' },
              { label: 'Variance', value: '+3', body: 'Received compared with the DDT.' },
              { label: 'Outcome', value: 'Over-delivered', body: 'The discrepancy becomes future evidence.' },
            ].map((step, index) => (
              <div key={step.label} className="relative flex min-h-[170px] flex-col gap-4 bg-[#202020] p-5">
                <p className="m-0 text-[11px] font-bold text-[#7fa2ff]" style={bodyStyle}>
                  {String(index + 1).padStart(2, '0')}
                </p>
                <p className="m-0 text-[16px] font-bold leading-[1.25] text-white" style={bodyStyle}>
                  {step.label}
                </p>
                <p className="m-0 text-[clamp(22px,2.8vw,30px)] font-bold leading-none text-white" style={bodyStyle}>
                  {step.value}
                </p>
                <p className="m-0 text-[12px] font-normal leading-[1.5] text-[#bdbdbd]" style={bodyStyle}>
                  {step.body}
                </p>
                {index < 4 && (
                  <span className="absolute -right-[7px] top-1/2 z-10 hidden -translate-y-1/2 text-[18px] font-bold text-[#7fa2ff] md:block">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="m-0 max-w-[920px] text-[20px] font-bold leading-[1.4] text-white" style={bodyStyle}>
            The lifecycle I created in Phase 1 became the evidence layer the Agent needed in Phase 2.
          </p>
        </div>
      </section>

      <section className="overflow-x-clip bg-[#f4f4f4]" style={sectionStyle}>
        <div className="flex flex-col gap-9" data-case-nav-label="14 / Learning">
          <p className="m-0 text-[12px] font-bold uppercase leading-none" style={{ ...bodyStyle, color: accent }}>
            14 — Learning
          </p>
          <h2 className="m-0 max-w-[900px] text-[clamp(26px,3.6vw,36px)] font-bold leading-[1.17] text-[#161616]" style={bodyStyle}>
            Corrections become governed learning signals—not instant truth.
          </h2>
          <p className="m-0 max-w-[900px] text-[17px] font-normal leading-[1.53] text-[#3b3b3b]" style={bodyStyle}>
            The system preserves the buyer&apos;s correction, the reason behind it, and the later business outcome as separate evidence.
          </p>

          <div className="grid gap-px bg-[#d6d6d6] sm:grid-cols-4">
            {[
              { label: 'Agent recommendation', value: '24', body: 'Calculated from sales, stock, and lead time.' },
              { label: 'Buyer override', value: '36', body: 'Reason: upcoming MNP promotion.' },
              { label: 'Outcome evidence', value: 'Validated', body: 'Actual sell-through supports the higher quantity.' },
              { label: 'Learning candidate', value: 'Review', body: 'Propose higher promotional coverage for this SKU.' },
            ].map((step, index) => (
              <div key={step.label} className="relative flex min-h-[180px] flex-col gap-3 bg-white p-5">
                <p className="m-0 text-[11px] font-bold" style={{ ...bodyStyle, color: accent }}>
                  {String(index + 1).padStart(2, '0')}
                </p>
                <p className="m-0 text-[15px] font-bold text-[#161616]" style={bodyStyle}>{step.label}</p>
                <p className="m-0 text-[clamp(22px,2.6vw,30px)] font-bold leading-none" style={{ ...bodyStyle, color: accent }}>{step.value}</p>
                <p className="m-0 mt-auto text-[12px] font-normal leading-[1.5] text-[#555]" style={bodyStyle}>{step.body}</p>
                {index < 3 && <span className="absolute -right-[7px] top-1/2 z-10 hidden -translate-y-1/2 text-[18px] font-bold text-[#2155e8] sm:block" aria-hidden>→</span>}
              </div>
            ))}
          </div>

          <p className="m-0 border-l-[5px] border-[#2155e8] bg-white px-[clamp(22px,3vw,30px)] py-5 text-[19px] font-bold leading-[1.45] text-[#161616]" style={bodyStyle}>
            This becomes a learning candidate, not an automatic memory update.
          </p>

          <p className="m-0 text-[11px] font-bold text-[#777]" style={bodyStyle}>
            SUPPORTING WORKSPACE + SEMANTIC SYSTEM
          </p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,500px)_1fr]">
            <div className="flex flex-col gap-[18px] bg-white p-6">
              <p className="m-0 text-[11px] font-bold text-[#777]" style={bodyStyle}>
                INFORMATION ARCHITECTURE
              </p>
              <p className="m-0 text-[24px] font-bold leading-[1.2] text-[#161616]" style={bodyStyle}>
                Procurement Workspace
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'ALL ORDERS', body: 'Cards across draft, placed, received and cancelled' },
                  { label: 'PURCHASE PLAN', body: 'Editable optimal proposal grouped by SPU', highlighted: true },
                  { label: 'DOCUMENT CHECK', body: 'Confirmation, DDT and actual receipt differences' },
                  { label: 'SUPPLIER MEMORY', body: 'Rules, lead-time performance and confirmed habits' },
                  { label: 'APPROVAL', body: 'High-impact SKU flags and final negotiated plan' },
                  { label: 'LEARNING REVIEW', body: 'Outcome evidence and governed memory candidates' },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className="flex gap-[14px] py-3 pl-[14px]"
                    style={{ background: item.highlighted ? '#e9eef8' : '#f4f4f4' }}
                  >
                    <p className="m-0 shrink-0 text-[10px] font-bold" style={{ ...bodyStyle, color: item.highlighted ? accent : '#777' }}>
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <div className="flex flex-col gap-[3px]">
                      <p className="m-0 text-[11px] font-bold text-[#161616]" style={bodyStyle}>
                        {item.label}
                      </p>
                      <p className="m-0 text-[10px] font-normal text-[#3b3b3b]" style={bodyStyle}>
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-[18px] bg-white p-6">
              <p className="m-0 text-[11px] font-bold text-[#777]" style={bodyStyle}>
                AGENT STATE SEMANTICS
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {[
                  { label: 'RULE', bg: '#e9eef8', color: accent },
                  { label: 'OBSERVATION', bg: '#f4f4f4', color: '#3b3b3b' },
                  { label: 'SUGGESTION', bg: '#e8f3ec', color: '#208a4b' },
                  { label: 'RISK', bg: '#f5e8e7', color: '#9c2e2e' },
                  { label: 'APPROVAL', bg: '#f6f0df', color: '#8a6500' },
                ].map((token) => (
                  <div key={token.label} className="flex min-h-[54px] items-center px-[10px]" style={{ background: token.bg }}>
                    <p className="m-0 text-[9px] font-bold" style={{ ...bodyStyle, color: token.color }}>
                      {token.label}
                    </p>
                  </div>
                ))}
              </div>

              <p className="m-0 text-[11px] font-bold text-[#777]" style={bodyStyle}>
                CORE AGENT COMPONENTS
              </p>
              <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
                {[
                  { name: 'KnowledgeBadge', body: 'Source and freshness' },
                  { name: 'ConfidenceIndicator', body: 'Certainty without false precision' },
                  { name: 'EvidenceLink', body: 'Inspectable proof' },
                  { name: 'RiskBanner', body: 'What can go wrong' },
                  { name: 'ApprovalGate', body: 'Blocks unauthorized progress' },
                  { name: 'DecisionTrace', body: 'Why this recommendation exists' },
                  { name: 'LearningCandidateCard', body: 'Review before memory update' },
                  { name: 'AgentActionFooter', body: 'Human action at the right moment' },
                ].map((component) => (
                  <div key={component.name} className="flex min-h-[58px] flex-col gap-1 bg-[#f4f4f4] pl-3 pt-[9px]">
                    <p className="m-0 text-[11px] font-bold text-[#161616]" style={bodyStyle}>
                      {component.name}
                    </p>
                    <p className="m-0 text-[10px] font-normal text-[#777]" style={bodyStyle}>
                      {component.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 bg-[#161616] px-[22px] py-6 sm:flex-row sm:items-center sm:gap-6">
            <p className="m-0 shrink-0 text-[11px] font-bold" style={{ ...bodyStyle, color: '#7fa2ff' }}>
              CONSISTENCY RULE
            </p>
            <p className="m-0 text-[19px] font-bold leading-[25px] text-white" style={bodyStyle}>
              Business status, Agent state and human responsibility are different layers—and never share one ambiguous color.
            </p>
          </div>
        </div>
      </section>

      <AgentUxIterationsSection />

      <section className="overflow-x-clip bg-white" style={sectionStyle}>
        <div className="flex flex-col gap-9" data-case-nav-label="16 / Validation">
          <p className="m-0 text-[12px] font-bold uppercase leading-none" style={{ ...bodyStyle, color: accent }}>
            16 — Validation
          </p>
          <h2 className="m-0 max-w-[930px] text-[clamp(26px,3.6vw,36px)] font-bold leading-[1.17] text-[#161616]" style={bodyStyle}>
            Validate safety and comprehension before speed.
          </h2>

          <div className="grid gap-px bg-[#d8d8d8] lg:grid-cols-2">
            <article className="bg-[#161616] p-[clamp(22px,3vw,32px)]">
              <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em] text-[#7fa2ff]" style={bodyStyle}>
                What I already validated
              </p>
              <p className="m-0 mt-4 text-[14px] font-normal leading-[1.6] text-[#d8d8d8]" style={bodyStyle}>
                Using real procurement records, sales and inventory data, representative supplier scenarios, and a coded workflow prototype, I validated:
              </p>
              <div className="mt-6 flex flex-col gap-px bg-white/20">
                {[
                  {
                    label: 'End-to-end lifecycle',
                    body: 'Purchase need → recommendation → confirmation → receiving → outcome.',
                  },
                  {
                    label: 'Reproducible quantity recommendation',
                    body: 'The same inputs reproduce the same recommended quantity.',
                  },
                  {
                    label: 'Discrepancy handling',
                    body: 'Confirmation, DDT, and receiving differences remain visible and actionable.',
                  },
                  {
                    label: 'Human approval boundary',
                    body: 'The Agent pauses before supplier or financial commitment.',
                  },
                  {
                    label: 'Stateful recovery',
                    body: 'The workflow can resume after clarification, external supplier response, or approval.',
                  },
                ].map((result) => (
                  <div key={result.label} className="flex flex-col gap-2 bg-[#202020] px-4 py-4">
                    <p className="m-0 text-[14px] font-bold leading-[1.45] text-white" style={bodyStyle}>
                      {result.label}
                    </p>
                    <p className="m-0 text-[12px] font-normal leading-[1.55] text-[#bdbdbd]" style={bodyStyle}>
                      {result.body}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="bg-[#f4f4f4] p-[clamp(22px,3vw,32px)]">
              <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em] text-[#777]" style={bodyStyle}>
                What I would measure after production use
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2">
                {[
                  {
                    label: 'Recommendation acceptance',
                    body: 'How often buyers keep the proposed quantity.',
                  },
                  {
                    label: 'Time to recommendation',
                    body: 'How long it takes to reach a reviewable plan.',
                  },
                  {
                    label: 'Discrepancy detection',
                    body: 'How reliably the system catches quantity and document differences.',
                  },
                  {
                    label: 'Override reasons',
                    body: 'Why buyers change the recommendation.',
                  },
                  {
                    label: 'High-risk interception',
                    body: 'Whether the Agent stops when approval is actually required.',
                  },
                  {
                    label: 'Learning quality',
                    body: 'Whether reviewed memory improves later recommendations.',
                  },
                ].map((metric) => (
                  <div key={metric.label} className="flex min-h-[132px] flex-col justify-between gap-4 bg-white p-4">
                    <p className="m-0 text-[13px] font-bold leading-[1.4] text-[#161616]" style={bodyStyle}>
                      {metric.label}
                    </p>
                    <p className="m-0 text-[12px] font-normal leading-[1.5] text-[#555]" style={bodyStyle}>
                      {metric.body}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="overflow-x-clip bg-[#161616]" style={sectionStyle}>
        <div className="flex max-w-[1080px] flex-col gap-6" data-case-nav-label="17 / Results & Measurement">
            <p className="m-0 text-[12px] font-bold uppercase leading-none" style={{ ...bodyStyle, color: '#7fa2ff' }}>
              17 — Results &amp; Measurement
            </p>
            <h2 className="m-0 max-w-[520px] text-[clamp(26px,3.6vw,36px)] font-bold leading-[1.14] text-white" style={bodyStyle}>
              A functional Agent-ready procurement MVP.
            </h2>
            <p className="m-0 max-w-[510px] text-[17px] font-normal leading-[1.53] text-[#d8d8d8]" style={bodyStyle}>
              The work moved from a screen concept to a coded workflow with explicit data contracts, tool boundaries, document reconciliation and a preserved human ordering gate.
            </p>

            <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em] text-[#7fa2ff]" style={bodyStyle}>
              System capabilities
            </p>
            <div className="grid gap-px bg-white/20 sm:grid-cols-2">
              {[
                { title: 'One traceable procurement lifecycle', body: 'Purchase, confirmation, DDT, receiving, and stock-in share one context.' },
                { title: 'One reproducible recommendation model', body: 'Every quantity can be recalculated from explicit data and business rules.' },
                { title: 'One explicit human authority boundary', body: 'The Agent cannot create a formal supplier commitment.' },
                { title: 'One governed learning loop', body: 'Corrections and outcomes become reviewable learning signals.' },
              ].map((capability, index) => (
                <article key={capability.title} className="flex min-h-[178px] flex-col gap-4 bg-[#202020] p-5">
                  <p className="m-0 text-[11px] font-bold text-[#7fa2ff]" style={bodyStyle}>{String(index + 1).padStart(2, '0')}</p>
                  <h3 className="m-0 text-[17px] font-bold leading-[1.3] text-white" style={bodyStyle}>{capability.title}</h3>
                  <p className="m-0 mt-auto text-[12px] font-normal leading-[1.5] text-[#bdbdbd]" style={bodyStyle}>{capability.body}</p>
                </article>
              ))}
            </div>

            <p className="m-0 mt-2 text-[11px] font-bold uppercase tracking-[0.05em] text-[#afafaf]" style={bodyStyle}>
              MVP scope
            </p>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                { value: '60', label: 'documented design iterations' },
                { value: '8', label: 'core Agent components' },
                { value: '5', label: 'critical validation scenarios' },
                { value: '1', label: 'shared workbench for plan + conversation' },
              ].map((metric) => (
                <div key={metric.label} className="flex min-h-[76px] items-end gap-3 border border-white/15 px-4 py-3">
                  <p className="m-0 shrink-0 text-[18px] font-bold text-white" style={bodyStyle}>
                    {metric.value}
                  </p>
                  <p className="m-0 text-[11px] font-normal leading-[1.4] text-[#afafaf]" style={bodyStyle}>
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
        </div>
      </section>

      <section className="overflow-x-clip bg-white" style={sectionStyle}>
          <div className="flex max-w-[900px] flex-col gap-[22px]" data-case-nav-label="18 / Reflection">
            <p className="m-0 text-[12px] font-bold uppercase leading-none" style={{ ...bodyStyle, color: accent }}>
              18 — Reflection
            </p>
            <h2 className="m-0 max-w-[760px] text-[clamp(30px,4vw,44px)] font-bold leading-[1.17] text-[#161616]" style={bodyStyle}>
              Designing an Agent meant redesigning the system it reasons over.
            </h2>
            <div className="flex max-w-[760px] flex-col gap-3">
              <p className="m-0 text-[16px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
                I started by asking where AI could reduce work.
              </p>
              <p className="m-0 text-[16px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
                I ended up redesigning the data model, business states, decision logic, evidence relationships, and responsibility boundaries that made AI trustworthy enough to participate at all.
              </p>
            </div>
            <div className="mt-auto border-l-[5px] border-[#ed5b2b] bg-[#f4f4f4] px-5 py-5">
              <p className="m-0 text-[10px] font-bold uppercase tracking-[0.05em] text-[#9c2e2e]" style={bodyStyle}>
                Final reflection
              </p>
              <p className="m-0 mt-3 max-w-[760px] text-[18px] font-bold leading-[1.5] text-[#161616]" style={bodyStyle}>
                The hardest part of Agent design was not deciding what the AI could do, but deciding what evidence it needed, when it should stop, and who remained accountable.
              </p>
            </div>
          </div>
      </section>

      <section className="overflow-x-clip bg-white" style={sectionStyle}>
        <div>
          <CaseStudyBackButton />
        </div>
      </section>
    </div>
  );
}
