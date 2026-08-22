import type { Metadata } from 'next';
import Image from 'next/image';
import CaseStudyBackButton from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/CaseStudyControls';
import CaseStudyHero from '../../components/CaseStudyHero';
import AgentReadyContextDiagram from './AgentReadyContextDiagram';
import EcosystemDiagram from './EcosystemDiagram';
import Phase1ScreenshotSwitcher from './Phase1ScreenshotSwitcher';
import ProcurementDemoEmbed from './ProcurementDemoEmbed';
import ProcurementDecisionDiagram from './ProcurementDecisionDiagram';
import ProcurementLearningLoop from './ProcurementLearningLoop';
import ResponsibilityArchitectureDiagram from './ResponsibilityArchitectureDiagram';
import { fontFamily } from '@/lib/design-tokens';

export const metadata: Metadata = {
  title: 'AI Procurement Agent for DEF Beauty Supply | Mei Chai',
  description:
    'Designing an evidence-backed procurement agent that helps buyers decide what to purchase, how much to order, and why while keeping critical decisions under human control.',
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

function ChapterTitle({ children, inverse = false }: { children: string; inverse?: boolean }) {
  return (
    <p
      className="m-0 text-[12px] font-bold uppercase tracking-[0.06em]"
      style={{ ...bodyStyle, color: inverse ? '#7fa2ff' : accent }}
    >
      {children}
    </p>
  );
}

function ThreeStageEvolution() {
  return (
    <div className="flex max-w-[1080px] flex-col gap-10" data-case-nav-label="04 / Phase 1">
      <ChapterTitle>04 / Phase 1</ChapterTitle>
      <h2 className="m-0 max-w-[900px] text-[clamp(30px,4.2vw,46px)] font-bold leading-[1.1] tracking-[-0.025em] text-[#161616]" style={bodyStyle}>
        Making procurement structured and traceable
      </h2>
      <p className="m-0 max-w-[840px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
        <strong className="font-bold text-[#161616]">Can the system represent how procurement actually works?</strong>{' '}
        Before AI could participate, procurement first needed a shared object model, explicit states, and traceable evidence.
      </p>

      <div className="grid border-y border-[#cfcfcf] lg:grid-cols-3">
        <article className="flex flex-col gap-5 border-b border-[#cfcfcf] py-[clamp(26px,4vw,40px)] lg:border-b-0 lg:pr-[clamp(24px,3vw,36px)]">
          <p className="m-0 text-[11px] font-bold text-[#2155e8]" style={bodyStyle}>01 · OBJECT MODEL</p>
          <h3 className="m-0 text-[21px] font-bold leading-[1.3] text-[#161616]" style={bodyStyle}>Every receiving event belongs to a purchase lifecycle.</h3>
          <p className="m-0 text-[14px] font-normal leading-[1.55] text-[#555]" style={bodyStyle}>
            Instead of isolated inventory changes, receiving remains connected to the purchase that created it.
          </p>
          <div className="mt-auto flex flex-col gap-2 border-l border-[#2155e8] pl-4">
            {['Purchase', 'Confirmation', 'DDT', 'Receiving', 'Inventory'].map((stage, index, stages) => (
              <p key={stage} className="m-0 flex items-center gap-2 text-[12px] font-bold text-[#161616]" style={bodyStyle}>
                <span>{stage}</span>
                {index < stages.length - 1 && <span className="text-[#2155e8]" aria-hidden>↓</span>}
              </p>
            ))}
          </div>
        </article>

        <article className="flex flex-col gap-5 border-b border-[#cfcfcf] py-[clamp(26px,4vw,40px)] lg:border-b-0 lg:border-l lg:px-[clamp(24px,3vw,36px)]">
          <p className="m-0 text-[11px] font-bold text-[#2155e8]" style={bodyStyle}>02 · STATE MODEL</p>
          <h3 className="m-0 text-[21px] font-bold leading-[1.3] text-[#161616]" style={bodyStyle}>Each purchase moves through explicit, recoverable states.</h3>
          <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-3">
            {['Draft', 'Awaiting supplier', 'Confirmed', 'Ordered', 'Partially received', 'Completed'].map((state, index, states) => (
              <div key={state} className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-[#3b3b3b]" style={bodyStyle}>{state}</span>
                {index < states.length - 1 && (
                  <span className="text-[15px] font-bold text-[#2155e8]" aria-hidden>→</span>
                )}
              </div>
            ))}
          </div>
        </article>

        <article className="flex flex-col gap-5 border-[#cfcfcf] py-[clamp(26px,4vw,40px)] lg:border-l lg:pl-[clamp(24px,3vw,36px)]">
          <p className="m-0 text-[11px] font-bold text-[#2155e8]" style={bodyStyle}>03 · EVIDENCE MODEL</p>
          <h3 className="m-0 text-[21px] font-bold leading-[1.3] text-[#161616]" style={bodyStyle}>Confirmation, DDT, and actual receiving remain linked instead of overwriting each other.</h3>
          <p className="m-0 text-[14px] font-normal leading-[1.55] text-[#555]" style={bodyStyle}>
            This makes discrepancies visible rather than hidden in the final stock value.
          </p>
          <div className="mt-auto flex flex-col gap-2 border-l border-[#2155e8] pl-4">
            {['Purchase request', 'Supplier confirmation', 'DDT', 'Actual receiving'].map((evidence, index, evidenceList) => (
              <p key={evidence} className="m-0 flex items-center gap-2 text-[12px] font-bold text-[#161616]" style={bodyStyle}>
                <span>{evidence}</span>
                {index < evidenceList.length - 1 && <span className="text-[#2155e8]" aria-hidden>↓</span>}
              </p>
            ))}
          </div>
        </article>
      </div>

      <DesignResultStructuredOperations />

      <div className="flex flex-col gap-3 border-t border-[#2155e8] pt-6 sm:flex-row sm:items-baseline sm:gap-7">
        <p className="m-0 shrink-0 text-[11px] font-bold uppercase tracking-[0.05em]" style={{ ...bodyStyle, color: accent }}>
          Phase 1 outcome
        </p>
        <p className="m-0 max-w-[900px] text-[19px] font-bold leading-[1.45] text-[#161616]" style={bodyStyle}>
          Buyers could finally complete and trace the full procurement lifecycle inside one system.
        </p>
      </div>
    </div>
  );
}

function DesignResultStructuredOperations() {
  return (
    <div className="flex flex-col gap-5">
      <p className="m-0 max-w-[900px] text-[clamp(21px,2.6vw,28px)] font-bold leading-[1.4]" style={{ ...bodyStyle, color: accent }}>
        Procurement evolved from a set of records into a stateful lifecycle.
      </p>
      <Phase1ScreenshotSwitcher />
    </div>
  );
}

function ResponsibilityShiftDiagram() {
  const beforeTasks = [
    'Find data',
    'Organize data',
    'Calculate',
    'Apply supplier rules',
    'Make judgment',
    'Create order',
  ];

  return (
    <div className="w-full overflow-x-auto" aria-label="Phase 1 responsibility shift diagram">
      <svg
        className="h-auto min-w-[820px] w-full"
        viewBox="0 0 1080 500"
        role="img"
        aria-labelledby="phase-one-responsibility-title phase-one-responsibility-desc"
        style={bodyStyle}
      >
        <title id="phase-one-responsibility-title">Responsibility shift after Phase 1</title>
        <desc id="phase-one-responsibility-desc">Before Phase 1, the buyer carried the full procurement workflow. After Phase 1, the system retrieved data and organized workflow while calculation, supplier rules, judgment, and formal ordering remained human responsibilities.</desc>
        <defs>
          <marker id="phase-one-arrow-muted" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.42)" />
          </marker>
          <marker id="phase-one-arrow-blue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#7fa2ff" />
          </marker>
          <marker id="phase-one-arrow-orange" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#ed5b2b" />
          </marker>
        </defs>

        <text x="40" y="32" fill="#afafaf" fontSize="12" fontWeight="700" letterSpacing="1.2">BEFORE PHASE 1</text>
        <text x="664" y="32" fill="#afafaf" fontSize="12" fontWeight="700" letterSpacing="1.2">AFTER PHASE 1</text>

        <path d="M360 248 H432" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1.2" markerEnd="url(#phase-one-arrow-muted)" />
        <path d="M576 248 H616" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1.2" />
        <path d="M616 248 V144 H664" fill="none" stroke="#7fa2ff" strokeWidth="1.2" markerEnd="url(#phase-one-arrow-blue)" />
        <path d="M616 248 V360 H664" fill="none" stroke="#ed5b2b" strokeWidth="1.2" markerEnd="url(#phase-one-arrow-orange)" />
        <circle cx="616" cy="248" r="4" fill="#161616" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />

        <rect x="40" y="72" width="320" height="384" rx="8" fill="#202020" stroke="rgba(255,255,255,0.18)" />
        <text x="64" y="108" fill="#afafaf" fontSize="8" fontWeight="700" letterSpacing="1.2">BUYER OWNED</text>
        <text x="64" y="140" fill="#ffffff" fontSize="20" fontWeight="700">The full workflow</text>
        <line x1="64" y1="160" x2="336" y2="160" stroke="rgba(255,255,255,0.14)" />
        {beforeTasks.map((task, index) => {
          const y = 192 + index * 40;
          return (
            <g key={task}>
              <text x="64" y={y} fill="#777777" fontSize="8" fontWeight="700">{String(index + 1).padStart(2, '0')}</text>
              <text x="96" y={y} fill="#ffffff" fontSize="12" fontWeight="600">{task}</text>
              {index < beforeTasks.length - 1 && <line x1="64" y1={y + 16} x2="336" y2={y + 16} stroke="rgba(255,255,255,0.08)" />}
            </g>
          );
        })}

        <rect x="432" y="216" width="144" height="64" rx="8" fill="#161616" stroke="rgba(255,255,255,0.28)" />
        <text x="504" y="240" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700" letterSpacing="1.2">PHASE 1</text>
        <text x="504" y="260" textAnchor="middle" fill="#777777" fontSize="8" fontWeight="600">Records connected</text>

        <rect x="664" y="72" width="376" height="148" rx="8" fill="rgba(127,162,255,0.12)" stroke="#7fa2ff" strokeWidth="1.2" />
        <text x="688" y="104" fill="#7fa2ff" fontSize="8" fontWeight="700" letterSpacing="1.2">SYSTEM NOW</text>
        <text x="688" y="132" fill="#ffffff" fontSize="16" fontWeight="700">Operational work moves to the system</text>
        <rect x="688" y="156" width="144" height="40" rx="6" fill="rgba(127,162,255,0.12)" stroke="rgba(127,162,255,0.46)" />
        <text x="760" y="180" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="600">Retrieve data</text>
        <rect x="840" y="156" width="176" height="40" rx="6" fill="rgba(127,162,255,0.12)" stroke="rgba(127,162,255,0.46)" />
        <text x="928" y="180" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="600">Organize workflow</text>

        <rect x="664" y="264" width="376" height="192" rx="8" fill="rgba(237,91,43,0.10)" stroke="#ed5b2b" strokeWidth="1.2" />
        <text x="688" y="296" fill="#ed5b2b" fontSize="8" fontWeight="700" letterSpacing="1.2">BUYER STILL</text>
        <text x="688" y="324" fill="#ffffff" fontSize="16" fontWeight="700">Decision authority stays human</text>
        <rect x="688" y="344" width="104" height="40" rx="6" fill="rgba(237,91,43,0.10)" stroke="rgba(237,91,43,0.5)" />
        <text x="740" y="368" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="600">Calculate</text>
        <rect x="804" y="344" width="192" height="40" rx="6" fill="rgba(237,91,43,0.10)" stroke="rgba(237,91,43,0.5)" />
        <text x="900" y="368" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="600">Apply supplier rules</text>
        <rect x="688" y="396" width="152" height="40" rx="6" fill="rgba(237,91,43,0.10)" stroke="rgba(237,91,43,0.5)" />
        <text x="764" y="420" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="600">Make judgment</text>
        <text x="856" y="412" fill="#afafaf" fontSize="8" fontWeight="700" letterSpacing="0.8">FINAL AUTHORITY</text>
        <text x="856" y="432" fill="#ffffff" fontSize="12" fontWeight="600">Place formal order</text>
      </svg>
    </div>
  );
}

function ProcurementTurningPoint() {
  return (
    <div className="flex max-w-[1080px] flex-col gap-10" data-case-nav-label="05 / The Turning Point">
      <ChapterTitle inverse>05 / The Turning Point</ChapterTitle>
      <div className="flex max-w-[920px] flex-col gap-6">
        <h2 className="m-0 text-[clamp(30px,4.2vw,52px)] font-bold leading-[1.08] tracking-[-0.028em] text-white" style={bodyStyle}>
          I had digitized the workflow,
          <br />
          <span className="text-[#7fa2ff]">but I had not reduced the cognitive work.</span>
        </h2>
      </div>

      <blockquote className="relative m-0 max-w-[900px] py-3 pl-[clamp(48px,7vw,78px)]">
        <span
          className="absolute left-0 top-0 text-[clamp(68px,9vw,108px)] font-bold leading-none text-[#7fa2ff]"
          style={bodyStyle}
          aria-hidden
        >
          “
        </span>
        <p className="m-0 text-[clamp(17px,2vw,22px)] font-normal leading-[1.55] text-white" style={bodyStyle}>
          Now I don&apos;t need to switch between Excel and the system anymore. But the part that takes the most time is still the same. I still have to decide what to buy and how much.
        </p>
        <footer className="mt-4 text-[11px] font-bold uppercase tracking-[0.05em] text-[#afafaf]" style={bodyStyle}>
          Procurement team feedback after Phase 1
        </footer>
      </blockquote>

      <ResponsibilityShiftDiagram />

      <div>
        <p className="m-0 max-w-[820px] text-[clamp(23px,3vw,36px)] font-bold leading-[1.16] tracking-[-0.018em] text-white" style={bodyStyle}>
          The interface problem had been solved.
          <br />
          <span className="text-[#7fa2ff]">The decision problem had not.</span>
        </p>
      </div>
    </div>
  );
}

function DesignResultEvidenceBackedAgency() {
  return (
    <div className="flex flex-col gap-10" data-case-nav-label="06 / Reframing the Problem">
      <ChapterTitle>06 / Reframing the Problem</ChapterTitle>
      <div className="flex max-w-[940px] flex-col gap-5">
        <h2 className="m-0 text-[clamp(34px,4.8vw,56px)] font-bold leading-[1.08] tracking-[-0.03em] text-[#161616]" style={bodyStyle}>
          The real bottleneck was procurement judgment
        </h2>
        <p className="m-0 max-w-[860px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
          Every purchase decision still required buyers to combine experience, sales, inventory, supplier constraints, lead time, and seasonal demand.
        </p>
      </div>

      <ProcurementDecisionDiagram />

      <div className="mt-[clamp(72px,10vw,128px)] flex max-w-[920px] flex-col gap-5" data-case-nav-label="07 / Why an Agent?">
        <ChapterTitle>07 / Why an Agent?</ChapterTitle>
        <h2 className="m-0 text-[clamp(30px,4.3vw,48px)] font-bold leading-[1.1] tracking-[-0.025em] text-[#161616]" style={bodyStyle}>
          Why not another dashboard?
        </h2>
        <p className="m-0 max-w-[820px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
          A dashboard could show the six inputs, but the buyer would still have to reconcile them, apply supplier rules, and calculate the order.
        </p>
      </div>

      <blockquote className="relative m-0 max-w-[920px] py-3 pl-[clamp(48px,7vw,78px)]">
        <span
          className="absolute left-0 top-0 text-[clamp(68px,9vw,108px)] font-bold leading-none"
          style={{ ...bodyStyle, color: accent }}
          aria-hidden
        >
          “
        </span>
        <p className="m-0 text-[clamp(19px,2.4vw,27px)] font-bold leading-[1.42] tracking-[-0.012em] text-[#161616]" style={bodyStyle}>
          Don&apos;t just give me the data. Help me calculate a reasonable purchasing plan from it.
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
          <h2 className="m-0 max-w-[900px] text-[clamp(23px,3.2vw,36px)] font-bold leading-[1.22] tracking-[-0.018em] text-[#161616]" style={bodyStyle}>
            How might we reduce the buyer&apos;s{' '}
            <span style={{ color: accent }}>cognitive workload</span>
            {' '}without removing their{' '}
            <span style={{ color: accent }}>control over purchasing decisions</span>?
          </h2>
        </div>
      </div>

      <div className="mt-[clamp(72px,10vw,128px)] flex flex-col gap-8 bg-[#161616] p-[clamp(22px,4vw,40px)]" data-case-nav-label="08 / Agent-ready System">
        <ChapterTitle inverse>08 / Agent-ready System</ChapterTitle>
        <h2 className="m-0 max-w-[900px] text-[clamp(28px,4vw,44px)] font-bold leading-[1.12] tracking-[-0.025em] text-white" style={bodyStyle}>
          The Agent needed structured context and a defined role.
        </h2>
        <p className="m-0 max-w-[820px] text-[17px] font-normal leading-[1.6] text-[#d8d8d8]" style={bodyStyle}>
          Operational records were the foundation. Supplier constraints, historical evidence, and human authority made those records usable for decisions.
        </p>

        <AgentReadyContextDiagram />

        <div>
          <p className="m-0 mb-4 text-[10px] font-bold uppercase tracking-[0.05em] text-[#7fa2ff]" style={bodyStyle}>How the Agent participates</p>
          <div className="grid border-y border-white/20 md:grid-cols-3">
            {[
              { title: 'Interpret intent', body: 'Understand the buyer&apos;s goal.' },
              { title: 'Calculate from evidence', body: 'Apply data and supplier rules.' },
              { title: 'Surface exceptions', body: 'Pause when human judgment is required.' },
            ].map((responsibility, index) => (
              <div key={responsibility.title} className="flex min-h-[132px] flex-col gap-4 border-b border-white/20 py-5 md:border-b-0 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0">
                <span className="text-[10px] font-bold text-[#777]" style={bodyStyle}>{String(index + 1).padStart(2, '0')}</span>
                <div className="flex flex-col gap-2">
                  <p className="m-0 text-[15px] font-bold text-white" style={bodyStyle}>{responsibility.title}</p>
                  <p className="m-0 text-[12px] font-normal leading-[1.5] text-[#b8b8b8]" style={bodyStyle}>{responsibility.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#7fa2ff] pt-6">
          <p className="m-0 text-[18px] font-bold leading-[1.5] text-white" style={bodyStyle}>
            Interpret intent. Calculate deterministically. Show evidence. Stop for human approval.
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
    principle: 'Conversation should initiate and structure real work, not merely explain the interface.',
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
      'Defined a strict boundary: the Agent can analyse, prepare, compare, and verify, but cannot place the formal order.',
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
    principle: 'Escalation should emerge from evidence and risk, not from a parallel workflow created too early.',
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
      'Removed the redundant stock-in quantity. The accepted actual quantity becomes the inventory update.',
      'Added Do not stock in / Return for damaged, incorrect, or unwanted goods.',
      'Supported partial deliveries and remaining unshipped quantities.',
      'Allowed DDT upload both before and at receiving.',
      'Used email events to infer shipment or delay status when no DDT was available.',
      'Added Acknowledged so users could retain an exception without repeated alerts.',
      'Recorded overrides and final outcomes as learning candidates.',
      'Required human confirmation before high-impact supplier rules entered long-term Agent memory.',
    ],
    principle: 'Learning should come from the gap between recommendation, human decision, and real-world outcome, not from edits alone.',
  },
];

function AgentUxIterationsSection() {
  return (
    <section className="overflow-x-clip bg-[#f4f4f4]" style={sectionStyle}>
      <div className="flex flex-col gap-9" data-case-nav-label="13 / Agent UX Iterations">
        <ChapterTitle>13 / Agent UX Iterations</ChapterTitle>
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
                <div className="m-0 bg-[#161616] px-[clamp(20px,3vw,28px)] py-5 lg:col-span-2">
                  <p className="m-0 text-[10px] font-bold uppercase tracking-[0.05em] text-[#7fa2ff]" style={bodyStyle}>Design principle</p>
                  <p className="m-0 mt-3 text-[18px] font-bold leading-[1.5] text-white" style={bodyStyle}>{iteration.principle}</p>
                </div>
              </div>
            </details>
          ))}
        </div>

        <div className="bg-[#2155e8] p-[clamp(24px,4vw,40px)]">
          <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em] text-white/70" style={bodyStyle}>Iteration outcome</p>
          <h3 className="m-0 mt-4 max-w-[880px] text-[clamp(24px,3.2vw,34px)] font-bold leading-[1.2] tracking-[-0.02em] text-white" style={bodyStyle}>
            The Agent moved from explaining the workflow to coordinating it.
          </h3>
          <div className="mt-8 grid border-t border-white/30 md:grid-cols-3">
            {[
              { label: 'Initiate', body: 'Turn buyer intent into one evidence-backed recommendation.' },
              { label: 'Control', body: 'Keep edits reversible and pause before human commitments.' },
              { label: 'Learn', body: 'Reconcile actual outcomes and learn only after review.' },
            ].map((outcome) => (
              <div key={outcome.label} className="border-b border-white/30 py-5 md:border-b-0 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0">
                <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em] text-white/70" style={bodyStyle}>{outcome.label}</p>
                <p className="m-0 mt-3 text-[15px] font-bold leading-[1.5] text-white" style={bodyStyle}>{outcome.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const demoUrl = '/demos/procurement-agent/index.html';

function ProcurementWorkspaceTreeDiagram() {
  const leaves = [
    { x: 32, title: 'All orders', note: 'Lifecycle portfolio' },
    { x: 200, title: 'Purchase plan', note: 'Editable proposal', focal: true },
    { x: 368, title: 'Document check', note: 'Confirmation to receipt' },
    { x: 536, title: 'Supplier memory', note: 'Rules and performance' },
    { x: 744, title: 'Approval', note: 'High-impact gate' },
    { x: 912, title: 'Learning review', note: 'Governed memory' },
  ];

  return (
    <figure className="m-0 flex flex-col gap-5">
      <figcaption className="flex flex-col gap-2">
        <p className="m-0 text-[10px] font-bold uppercase tracking-[0.05em] text-[#777]" style={bodyStyle}>Information architecture</p>
        <h3 className="m-0 text-[clamp(22px,2.8vw,28px)] font-bold leading-[1.2] text-[#161616]" style={bodyStyle}>Procurement Workspace</h3>
      </figcaption>
      <div className="w-full overflow-x-auto">
        <svg className="h-auto min-w-[820px] w-full" viewBox="0 0 1080 404" role="img" aria-labelledby="workspace-tree-title workspace-tree-desc" style={bodyStyle}>
          <title id="workspace-tree-title">Procurement Workspace information architecture</title>
          <desc id="workspace-tree-desc">A hierarchy showing the Procurement Workspace branching into planning and execution areas plus governance and learning areas.</desc>

          <path d="M540 80 V112" fill="none" stroke="#777777" />
          <path d="M360 112 H800" fill="none" stroke="#777777" />
          <path d="M360 112 V136 M800 112 V136" fill="none" stroke="#777777" />
          <path d="M360 192 V232 M104 232 H608" fill="none" stroke="#777777" />
          <path d="M104 232 V280 M272 232 V280 M440 232 V280 M608 232 V280" fill="none" stroke="#777777" />
          <path d="M800 192 V232 H984" fill="none" stroke="#777777" />
          <path d="M816 232 V280 M984 232 V280" fill="none" stroke="#777777" />

          <rect x="420" y="24" width="240" height="56" rx="8" fill="#161616" stroke="#161616" />
          <text x="540" y="48" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="700" letterSpacing="1.2">ROOT WORKSPACE</text>
          <text x="540" y="68" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="700">Procurement Workspace</text>

          <rect x="240" y="136" width="240" height="56" rx="8" fill="#f4f4f4" stroke="#777777" />
          <text x="360" y="160" textAnchor="middle" fill="#777777" fontSize="8" fontWeight="700" letterSpacing="1.2">OPERATE</text>
          <text x="360" y="180" textAnchor="middle" fill="#161616" fontSize="16" fontWeight="700">Plan and execute</text>
          <rect x="680" y="136" width="240" height="56" rx="8" fill="#f4f4f4" stroke="#777777" />
          <text x="800" y="160" textAnchor="middle" fill="#777777" fontSize="8" fontWeight="700" letterSpacing="1.2">CONTROL</text>
          <text x="800" y="180" textAnchor="middle" fill="#161616" fontSize="16" fontWeight="700">Govern and learn</text>

          {leaves.map((leaf) => (
            <g key={leaf.title}>
              <rect x={leaf.x} y="280" width="144" height="88" rx="8" fill={leaf.focal ? '#e9eef8' : '#ffffff'} stroke={leaf.focal ? '#2155e8' : '#cfcfcf'} strokeWidth={leaf.focal ? 1.2 : 1} />
              <text x={leaf.x + 16} y="312" fill={leaf.focal ? '#2155e8' : '#161616'} fontSize="12" fontWeight="700">{leaf.title}</text>
              <text x={leaf.x + 16} y="340" fill="#777777" fontSize="8" fontWeight="600">{leaf.note}</text>
            </g>
          ))}
        </svg>
      </div>
    </figure>
  );
}

function AgentSemanticLayersDiagram() {
  return (
    <figure className="m-0 flex flex-col gap-5">
      <figcaption className="flex flex-col gap-2">
        <p className="m-0 text-[10px] font-bold uppercase tracking-[0.05em] text-[#777]" style={bodyStyle}>Agent state semantics</p>
        <h3 className="m-0 text-[clamp(22px,2.8vw,28px)] font-bold leading-[1.2] text-[#161616]" style={bodyStyle}>From state language to governed interaction</h3>
      </figcaption>
      <div className="w-full overflow-x-auto">
        <svg className="h-auto min-w-[820px] w-full" viewBox="0 0 1080 500" role="img" aria-labelledby="semantic-layers-title semantic-layers-desc" style={bodyStyle}>
          <title id="semantic-layers-title">Agent semantic system layers</title>
          <desc id="semantic-layers-desc">Four layers connect semantic states to evidence, risk, action, approval, and learning components in the Procurement Agent.</desc>
          <defs>
            <marker id="semantic-layer-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#777777" />
            </marker>
          </defs>

          <path d="M48 64 V440" fill="none" stroke="#777777" markerEnd="url(#semantic-layer-arrow)" />
          <text x="28" y="56" fill="#777777" fontSize="8" fontWeight="700" letterSpacing="0.8">STATE</text>
          <text x="16" y="468" fill="#777777" fontSize="8" fontWeight="700" letterSpacing="0.8">BEHAVIOR</text>

          <rect x="80" y="40" width="960" height="92" rx="8" fill="#ffffff" stroke="#cfcfcf" />
          <text x="104" y="72" fill="#777777" fontSize="8" fontWeight="700" letterSpacing="1.2">L1</text>
          <text x="152" y="80" fill="#161616" fontSize="16" fontWeight="700">Semantic states</text>
          {[
            { x: 432, w: 88, label: 'RULE', fill: '#e9eef8', color: '#2155e8' },
            { x: 528, w: 136, label: 'OBSERVATION', fill: '#e5e5e5', color: '#3b3b3b' },
            { x: 672, w: 120, label: 'SUGGESTION', fill: '#e8f3ec', color: '#208a4b' },
            { x: 800, w: 72, label: 'RISK', fill: '#f5e8e7', color: '#9c2e2e' },
            { x: 880, w: 112, label: 'APPROVAL', fill: '#f6f0df', color: '#8a6500' },
          ].map((state) => (
            <g key={state.label}>
              <rect x={state.x} y="64" width={state.w} height="40" rx="6" fill={state.fill} />
              <text x={state.x + state.w / 2} y="88" textAnchor="middle" fill={state.color} fontSize="8" fontWeight="700" letterSpacing="0.4">{state.label}</text>
            </g>
          ))}

          <rect x="80" y="148" width="960" height="92" rx="8" fill="#f4f4f4" stroke="#cfcfcf" />
          <text x="104" y="180" fill="#777777" fontSize="8" fontWeight="700" letterSpacing="1.2">L2</text>
          <text x="152" y="188" fill="#161616" fontSize="16" fontWeight="700">Evidence and explanation</text>
          {[
            { x: 416, w: 136, label: 'KnowledgeBadge' },
            { x: 560, w: 120, label: 'EvidenceLink' },
            { x: 688, w: 160, label: 'ConfidenceIndicator' },
            { x: 856, w: 136, label: 'DecisionTrace' },
          ].map((item) => (
            <g key={item.label}>
              <rect x={item.x} y="172" width={item.w} height="40" rx="6" fill="#ffffff" stroke="#d8d8d8" />
              <text x={item.x + item.w / 2} y="196" textAnchor="middle" fill="#161616" fontSize="8" fontWeight="700">{item.label}</text>
            </g>
          ))}

          <rect x="80" y="256" width="960" height="92" rx="8" fill="#ffffff" stroke="#cfcfcf" />
          <text x="104" y="288" fill="#777777" fontSize="8" fontWeight="700" letterSpacing="1.2">L3</text>
          <text x="152" y="296" fill="#161616" fontSize="16" fontWeight="700">Risk and action</text>
          <rect x="584" y="280" width="136" height="40" rx="6" fill="#f5e8e7" stroke="#d8b8b5" />
          <text x="652" y="304" textAnchor="middle" fill="#9c2e2e" fontSize="8" fontWeight="700">RiskBanner</text>
          <rect x="736" y="280" width="176" height="40" rx="6" fill="#ffffff" stroke="#d8d8d8" />
          <text x="824" y="304" textAnchor="middle" fill="#161616" fontSize="8" fontWeight="700">AgentActionFooter</text>

          <rect x="80" y="364" width="960" height="92" rx="8" fill="#f4f4f4" stroke="#cfcfcf" />
          <text x="104" y="396" fill="#777777" fontSize="8" fontWeight="700" letterSpacing="1.2">L4</text>
          <text x="152" y="404" fill="#161616" fontSize="16" fontWeight="700">Governance and learning</text>
          <rect x="560" y="388" width="144" height="40" rx="6" fill="#f6f0df" stroke="#d8c99d" />
          <text x="632" y="412" textAnchor="middle" fill="#8a6500" fontSize="8" fontWeight="700">ApprovalGate</text>
          <rect x="720" y="388" width="216" height="40" rx="6" fill="#e9eef8" stroke="#b8c6ea" />
          <text x="828" y="412" textAnchor="middle" fill="#2155e8" fontSize="8" fontWeight="700">LearningCandidateCard</text>
        </svg>
      </div>
    </figure>
  );
}

function InteractiveDemo() {
  return (
    <div className="flex flex-col gap-5" data-case-nav-label="00 / Interactive Demo">
      <ChapterTitle>00 / Interactive Demo</ChapterTitle>
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
        subtitle="Evidence-backed purchasing decisions, with deterministic calculations, visible reasoning, and human control at every commitment."
        tags={['B2B SaaS', 'Enterprise UX', 'AX Design', 'Agent Workflow', 'Data Architecture']}
        aboutLabel="About DEF Beauty Supply"
        about={'DEF Beauty Supply is a B2B beauty wholesaler serving professional customers in Italy.\n\nIts purchasing work was fragmented across software, documents, messages, and spreadsheets. I redesigned the procurement lifecycle first, then built an AI decision-support layer on top of that traceable foundation.'}
        meta={[
          {
            label: 'Role',
            value: [
              'UX / AX Designer',
              'End-to-end ownership across research, workflow and data modeling, Agent architecture, interaction design, LangGraph prototyping, and implementation.',
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
        visualImageScale={1.42}
        visualTransformOrigin="center top"
        visualTranslateY="5%"
        visualBackground="radial-gradient(circle at 78% 22%, rgb(83 118 255 / 0.3), transparent 28%), radial-gradient(circle at 18% 82%, rgb(33 85 232 / 0.22), transparent 34%), linear-gradient(135deg, #0b1020 0%, #111b38 48%, #071020 100%)"
        visualNavTone="light"
        compactTypography
        titleFontSize="clamp(26px, 2.6vw, 40px)"
        wideDetails
        tagRadius="0"
      />

      {/* overflow-x visible here so the demo stage can expand past the content column */}
      <section style={sectionStyle}>
        <InteractiveDemo />

        <div className="flex max-w-[1080px] flex-col gap-8" data-case-nav-label="01 / Context">
          <ChapterTitle>01 / Context</ChapterTitle>
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
          <ChapterTitle>02 / Why I focused on procurement</ChapterTitle>
          <h2 className="m-0 max-w-[900px] text-[clamp(30px,4.2vw,46px)] font-bold leading-[1.1] tracking-[-0.025em] text-[#161616]" style={bodyStyle}>
            Where the procurement lifecycle broke
          </h2>

          <p className="m-0 max-w-[900px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
            The business was not running on one system, but across several disconnected systems and manual workarounds.
          </p>

          <div>
            <EcosystemDiagram />
          </div>

          <blockquote className="relative m-0 max-w-[920px] py-3 pl-[clamp(48px,7vw,78px)]">
            <span
              className="absolute left-0 top-0 text-[clamp(68px,9vw,108px)] font-bold leading-none"
              style={{ ...bodyStyle, color: accent }}
              aria-hidden
            >
              “
            </span>
            <p className="m-0 text-[clamp(19px,2.4vw,27px)] font-bold leading-[1.42] tracking-[-0.012em] text-[#161616]" style={bodyStyle}>
              The platform could record inventory, but not the decision process that created it.
            </p>
          </blockquote>
        </div>
      </section>

      <section className="overflow-x-clip bg-white" style={sectionStyle}>
        <div className="flex max-w-[1080px] flex-col gap-10" data-case-nav-label="03 / Original Workflow">
          <ChapterTitle>03 / Original Workflow</ChapterTitle>
          <div className="flex max-w-[820px] flex-col gap-5">
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
                        className="absolute top-0 w-px bg-[#2155e8]"
                        style={{ left: item.left, height: `${item.top}px` }}
                        aria-hidden
                      />
                      <span
                        className="absolute top-0 size-[7px] -translate-x-1/2 rounded-full bg-[#2155e8]"
                        style={{ left: item.left }}
                        aria-hidden
                      />
                      <article
                        className="absolute flex min-h-[56px] w-[168px] -translate-x-1/2 items-center border px-3 py-2"
                        style={{
                          background: item.primary ? '#2155e8' : '#172348',
                          borderColor: '#2155e8',
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

            <div className="mt-8 grid gap-px border-t border-[#2155e8] bg-[#2155e8] md:grid-cols-[1.1fr_0.9fr_1.2fr]">
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
              <article key={problem.label} className="flex min-h-[180px] flex-col gap-4 bg-[#161616] p-[clamp(22px,3vw,30px)]">
                <p className="m-0 text-[11px] font-bold text-[#7fa2ff]" style={bodyStyle}>
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
          </div>

          <blockquote className="relative m-0 flex max-w-[960px] flex-col gap-3 py-3 pl-[clamp(48px,7vw,78px)]">
            <span
              className="absolute left-0 top-0 text-[clamp(68px,9vw,108px)] font-bold leading-none"
              style={{ ...bodyStyle, color: accent }}
              aria-hidden
            >
              “
            </span>
            <p className="m-0 max-w-[880px] text-[clamp(17px,1.8vw,20px)] font-bold leading-[1.5] text-[#161616]" style={bodyStyle}>
              Procurement data existed at every step, but the system could not connect those records into one decision and fulfillment lifecycle.
            </p>
            <p className="m-0 max-w-[880px] text-[clamp(18px,2.2vw,24px)] font-bold leading-[1.42]" style={{ ...bodyStyle, color: accent }}>
              So before introducing AI, I first rebuilt procurement as a structured, traceable lifecycle.
            </p>
          </blockquote>
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
        <div className="flex max-w-[1080px] flex-col gap-10" data-case-nav-label="09 / Designing the Procurement Agent">
          <ChapterTitle>09 / Designing the Procurement Agent</ChapterTitle>
          <h2 className="m-0 max-w-[940px] text-[clamp(30px,4.2vw,46px)] font-bold leading-[1.1] tracking-[-0.025em] text-[#161616]" style={bodyStyle}>
            The LLM interprets. The engine calculates. The buyer decides.
          </h2>
          <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
            I separated probabilistic interpretation from deterministic quantity calculation, risk checking, and human authorization so every recommendation remained explainable and controllable.
          </p>

          <ResponsibilityArchitectureDiagram />

          <div className="border-l-[5px] border-[#2155e8] bg-white px-[clamp(22px,3vw,32px)] py-6">
            <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em]" style={{ ...bodyStyle, color: accent }}>Rationale</p>
            <p className="m-0 mt-3 max-w-[960px] text-[18px] font-bold leading-[1.5] text-[#161616]" style={bodyStyle}>
              Quantity affects cash, inventory risk, and supplier commitments, so the recommendation must be reproducible from business inputs, not generated probabilistically.
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-x-clip bg-white" style={sectionStyle}>
        <div className="flex flex-col gap-9" data-case-nav-label="10 / Executable Agent Workflow">
          <ChapterTitle>10 / Executable Agent Workflow</ChapterTitle>
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
              LangGraph manages the stateful workflow, tool execution, human approval gates and task recovery from prototype through production.
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-x-clip bg-[#f4f4f4]" style={sectionStyle}>
        <div className="flex flex-col gap-10" data-case-nav-label="11 / Human Gate">
          <ChapterTitle>11 / Human Gate</ChapterTitle>
          <div className="flex flex-col gap-[18px]">
            <h2 className="m-0 max-w-[620px] text-[clamp(28px,4vw,40px)] font-bold leading-[1.13] text-[#161616]" style={bodyStyle}>
              The Agent cannot place an order.
            </h2>
            <p className="m-0 max-w-[620px] text-[17px] font-normal leading-[1.53] text-[#3b3b3b]" style={bodyStyle}>
              Formal ordering creates external financial and supplier commitments. The Agent can prepare and verify the decision, but the commitment remains human-owned.
            </p>
          </div>

          <div className="grid gap-px bg-[#b8c6ea] lg:grid-cols-[0.9fr_1.15fr_0.95fr]">
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
                labelColor: '#9cb3ff',
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
                labelColor: accent,
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

          <div className="grid gap-px bg-[#b8c6ea] sm:grid-cols-5">
            {[
              { label: 'Evidence', body: 'Show the source behind every recommendation.' },
              { label: 'Confidence', body: 'Signal uncertainty without false precision.' },
              { label: 'DecisionTrace', body: 'Keep inputs, rules, changes, and reasons inspectable.' },
              { label: 'Human Gate', body: 'Pause before irreversible purchasing actions.' },
              { label: 'Approval', body: 'Bind authorization to the final quantity and price.' },
            ].map((principle) => (
              <div key={principle.label} className="flex min-h-[150px] flex-col gap-3 bg-white p-4">
                <p className="m-0 text-[12px] font-bold text-[#2155e8]" style={bodyStyle}>{principle.label}</p>
                <p className="m-0 text-[12px] font-normal leading-[1.5] text-[#555]" style={bodyStyle}>{principle.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-x-clip bg-[#f4f4f4]" style={sectionStyle}>
        <div className="flex flex-col gap-9 bg-[#161616] p-[clamp(24px,5vw,56px)]" data-case-nav-label="12 / Closing the Loop">
          <ChapterTitle inverse>12 / Closing the Loop</ChapterTitle>
          <h2 className="m-0 max-w-[900px] text-[clamp(26px,3.6vw,36px)] font-bold leading-[1.17] text-white" style={bodyStyle}>
            Every outcome becomes evidence for the next purchasing decision.
          </h2>
          <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.53] text-[#d8d8d8]" style={bodyStyle}>
            The lifecycle connects recommendation, supplier commitment, delivery, receiving, and the resulting variance.
          </p>

          <ProcurementLearningLoop />

          <p className="m-0 max-w-[920px] text-[17px] font-normal leading-[1.6] text-[#d8d8d8]" style={bodyStyle}>
            Learn keeps the recommendation, buyer override, reason, and real-world outcome as separate evidence. It then creates a learning candidate for human review before any supplier rule or planning assumption is added to Agent memory.
          </p>

          <div className="border-l-[4px] border-[#7fa2ff] pl-5">
            <p className="m-0 max-w-[920px] text-[20px] font-bold leading-[1.4] text-white" style={bodyStyle}>
              Corrections become governed learning signals, not instant memory updates.
            </p>
          </div>
        </div>
        <div className="mt-[clamp(32px,5vw,56px)] flex flex-col gap-6">
          <p className="m-0 text-[11px] font-bold text-[#777]" style={bodyStyle}>
            SUPPORTING WORKSPACE + SEMANTIC SYSTEM
          </p>

          <div className="flex flex-col gap-[clamp(56px,8vw,96px)] border-y border-[#cfcfcf] py-[clamp(32px,5vw,56px)]">
            <ProcurementWorkspaceTreeDiagram />
            <AgentSemanticLayersDiagram />
          </div>

          <div className="flex flex-col gap-3 border-l-[4px] border-[#2155e8] bg-white px-5 py-5 sm:flex-row sm:items-baseline sm:gap-6">
            <p className="m-0 shrink-0 text-[10px] font-bold uppercase tracking-[0.05em]" style={{ ...bodyStyle, color: accent }}>
              CONSISTENCY RULE
            </p>
            <p className="m-0 max-w-[900px] text-[17px] font-bold leading-[1.5] text-[#161616]" style={bodyStyle}>
              Business status, Agent state and human responsibility are different layers and never share one ambiguous color.
            </p>
          </div>
        </div>
      </section>

      <AgentUxIterationsSection />

      <section className="overflow-x-clip bg-white" style={sectionStyle}>
        <div className="flex flex-col gap-9" data-case-nav-label="14 / Validation">
          <ChapterTitle>14 / Validation</ChapterTitle>
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

      <section className="overflow-x-clip bg-[#f4f4f4]" style={sectionStyle}>
        <div className="flex max-w-[1080px] flex-col gap-6 bg-[#161616] p-[clamp(24px,5vw,56px)]" data-case-nav-label="15 / Results & Measurement">
            <ChapterTitle inverse>15 / Results & Measurement</ChapterTitle>
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
          <div className="flex max-w-[900px] flex-col gap-[22px]" data-case-nav-label="16 / Reflection">
            <ChapterTitle>16 / Reflection</ChapterTitle>
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
            <div className="mt-auto border-l-[5px] border-[#2155e8] bg-[#f4f4f4] px-5 py-5">
              <p className="m-0 text-[10px] font-bold uppercase tracking-[0.05em] text-[#2155e8]" style={bodyStyle}>
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
