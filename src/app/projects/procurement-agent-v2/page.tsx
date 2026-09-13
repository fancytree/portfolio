import type { Metadata } from 'next';
import Image from 'next/image';
import CaseStudyBackButton from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/CaseStudyControls';
import CaseStudyHero from '../../components/CaseStudyHero';
import EcosystemDiagram from './EcosystemDiagram';
import Phase1ScreenshotSwitcher from './Phase1ScreenshotSwitcher';
import ProcurementDemoEmbed from './ProcurementDemoEmbed';
import ProcurementDecisionDiagram from './ProcurementDecisionDiagram';
import ProcurementLearningLoop from './ProcurementLearningLoop';
import ResponsibilityArchitectureDiagram from './ResponsibilityArchitectureDiagram';
import { caseRadiusPx, fontFamily } from '@/lib/design-tokens';
import { PROCUREMENT_AGENT_DEMO_URL } from '@/lib/demoUrls';

export const metadata: Metadata = {
  title: 'AI Procurement Agent for DEF Beauty Supply | Mei Chai',
  description:
    'Designing AI to participate in the real purchasing workflow — starting from document comparison and exception flagging, while keeping judgment, decisions, and commitments under human control.',
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
      'Started from document reconciliation: AI flagged discrepancies between buyer drafts, supplier confirmations, and delivery documents. Then discovered isolated checks lose context, so the Agent had to participate in the whole procurement workflow to actually reduce cognitive work.',
  },
  {
    label: 'Core insight',
    body:
      'Isolated row checks were not enough. To give the buyer a purchasing recommendation, all related context — sales history, stockout signals, in-transit stock, supplier constraints — had to stay with the SKU across the workflow.',
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

const sectionPadX = {
  paddingInline: 'clamp(24px, 5vw, 64px)',
} as const;

/** 章节左右 padding；上下各半段 --case-space-section，相邻两章相加后间距固定。 */
function sectionBandProps(band: 'white' | 'gray' | 'ink', clip = true) {
  const background =
    band === 'white' ? 'bg-white' : band === 'gray' ? 'bg-[#f4f4f4]' : 'bg-[#161616]';
  return {
    className: ['procurement-section', clip && 'overflow-x-clip', background].filter(Boolean).join(' '),
    'data-band': band,
    style: sectionPadX,
  };
}

const bodyStyle = {
  fontFamily: fontFamily.sans,
} as const;

function ChapterTitle({ children, inverse = false }: { children: string; inverse?: boolean }) {
  return (
    <p
      data-case-type="eyebrow"
      className="case-study-eyebrow m-0"
      style={{ ...bodyStyle, color: inverse ? '#7fa2ff' : accent }}
    >
      {children}
    </p>
  );
}

function ThreeStageEvolution() {
  return (
    <div className="flex max-w-[1080px] flex-col gap-10" data-case-nav-label="03 / Phase 1">
      <ChapterTitle>03 / Phase 1</ChapterTitle>
      <h2 className="case-study-section-title m-0 max-w-[900px]" style={bodyStyle}>
        Making procurement structured and traceable
      </h2>
      <p className="case-study-lead m-0 max-w-[840px]" style={bodyStyle}>
        While making procurement structured and traceable, I also looked at which <strong className="font-bold text-[#161616]">manual parts</strong> AI could take — not to recommend what to buy, but to replace repetitive checking inside that lifecycle.
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

      <div className="case-radius-lg overflow-hidden flex flex-col gap-4 border-l-[4px] border-[#2155e8] bg-[#f4f4f4] px-[clamp(20px,3vw,28px)] py-5">
        <p className="m-0 text-[10px] font-bold uppercase tracking-[0.05em] text-[#2155e8]" style={bodyStyle}>
          Adding AI for the sake of adding AI
        </p>
        <p className="m-0 max-w-[880px] text-[15px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
          The manual work that could move to AI was <strong className="font-bold text-[#161616]">document comparison</strong>: buyer draft vs supplier confirmation (typo, new packaging, stockout), then DDT vs confirmation when goods arrive (missing vs partial shipment).
        </p>
        <p className="m-0 max-w-[880px] text-[15px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
          Differences showed as <strong className="font-bold text-[#161616]">highlighting in the table</strong> and a <strong className="font-bold text-[#161616]">reminder column</strong>. This was AI bolted onto a check, not a purchasing recommendation. <strong className="font-bold text-[#161616]">It did not decide what to buy or how much.</strong>
        </p>
      </div>
    </div>
  );
}

function DesignResultStructuredOperations() {
  return <Phase1ScreenshotSwitcher />;
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

        <rect x="40" y="72" width="320" height="384" rx={caseRadiusPx.sm} fill="#202020" stroke="rgba(255,255,255,0.18)" />
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

        <rect x="432" y="216" width="144" height="64" rx={caseRadiusPx.sm} fill="#161616" stroke="rgba(255,255,255,0.28)" />
        <text x="504" y="240" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700" letterSpacing="1.2">PHASE 1</text>
        <text x="504" y="260" textAnchor="middle" fill="#777777" fontSize="8" fontWeight="600">Records connected</text>

        <rect x="664" y="72" width="376" height="148" rx={caseRadiusPx.sm} fill="rgba(127,162,255,0.12)" stroke="#7fa2ff" strokeWidth="1.2" />
        <text x="688" y="104" fill="#7fa2ff" fontSize="8" fontWeight="700" letterSpacing="1.2">SYSTEM NOW</text>
        <text x="688" y="132" fill="#ffffff" fontSize="16" fontWeight="700">Operational work moves to the system</text>
        <rect x="688" y="156" width="144" height="40" rx={caseRadiusPx.sm} fill="rgba(127,162,255,0.12)" stroke="rgba(127,162,255,0.46)" />
        <text x="760" y="180" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="600">Retrieve data</text>
        <rect x="840" y="156" width="176" height="40" rx={caseRadiusPx.sm} fill="rgba(127,162,255,0.12)" stroke="rgba(127,162,255,0.46)" />
        <text x="928" y="180" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="600">Organize workflow</text>

        <rect x="664" y="264" width="376" height="192" rx={caseRadiusPx.sm} fill="rgba(237,91,43,0.10)" stroke="#ed5b2b" strokeWidth="1.2" />
        <text x="688" y="296" fill="#ed5b2b" fontSize="8" fontWeight="700" letterSpacing="1.2">BUYER STILL</text>
        <text x="688" y="324" fill="#ffffff" fontSize="16" fontWeight="700">Decision authority stays human</text>
        <rect x="688" y="344" width="104" height="40" rx={caseRadiusPx.sm} fill="rgba(237,91,43,0.10)" stroke="rgba(237,91,43,0.5)" />
        <text x="740" y="368" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="600">Calculate</text>
        <rect x="804" y="344" width="192" height="40" rx={caseRadiusPx.sm} fill="rgba(237,91,43,0.10)" stroke="rgba(237,91,43,0.5)" />
        <text x="900" y="368" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="600">Apply supplier rules</text>
        <rect x="688" y="396" width="152" height="40" rx={caseRadiusPx.sm} fill="rgba(237,91,43,0.10)" stroke="rgba(237,91,43,0.5)" />
        <text x="764" y="420" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="600">Make judgment</text>
        <text x="856" y="412" fill="#afafaf" fontSize="8" fontWeight="700" letterSpacing="0.8">FINAL AUTHORITY</text>
        <text x="856" y="432" fill="#ffffff" fontSize="12" fontWeight="600">Place formal order</text>
      </svg>
    </div>
  );
}

function ProcurementTurningPoint() {
  return (
    <div className="flex max-w-[1080px] flex-col gap-10" data-case-nav-label="04 / Turning point">
      <ChapterTitle inverse>04 / The Turning Point</ChapterTitle>
      <div className="flex max-w-[920px] flex-col gap-6">
        <h2 className="m-0 text-[clamp(30px,4.2vw,52px)] font-bold leading-[1.08] tracking-[-0.028em] text-white" style={bodyStyle}>
          There was no way to predict purchase quantity.
          <br />
          <span className="text-[#7fa2ff]">No way to give the buyer a purchasing recommendation.</span>
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
        <p data-case-type="quote-compact" className="m-0 text-[clamp(17px,2vw,22px)] font-normal leading-[1.55] text-white" style={bodyStyle}>
          Now I don&apos;t need to switch between Excel and the system anymore. But the part that takes the most time is still the same. I still have to decide what to buy and how much.
        </p>
        <footer className="mt-4 text-[11px] font-bold uppercase tracking-[0.05em] text-[#afafaf]" style={bodyStyle}>
          Procurement team feedback after Phase 1
        </footer>
      </blockquote>

      <ResponsibilityShiftDiagram />

      <div className="case-radius-lg overflow-hidden bg-white/5 px-[clamp(22px,3vw,32px)] py-6">
        <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em] text-[#7fa2ff]" style={bodyStyle}>One example of lost context</p>
        <p className="m-0 mt-4 max-w-[880px] text-[15px] font-normal leading-[1.6] text-[#d8d8d8]" style={bodyStyle}>
          I observed buyers used the last three months of sales to estimate quantities. The first design showed last-3-month sales on the SKU. But stockout signals were still lost. Buyers had to remember that themselves.
        </p>
      </div>
    </div>
  );
}

function DesignResultEvidenceBackedAgency() {
  return (
    <>
    <section {...sectionBandProps('white')}>
    <div className="flex flex-col gap-10" data-case-nav-label="05 / Agent workflow">
      <ChapterTitle>05 / Agent Workflow & Handoff</ChapterTitle>
      <div className="flex max-w-[940px] flex-col gap-5">
        <h2 className="m-0 text-[clamp(34px,4.8vw,56px)] font-bold leading-[1.08] tracking-[-0.03em] text-[#161616]" style={bodyStyle}>
          The Agent participates in the whole procurement workflow. The buyer keeps <span className="text-[#2155e8]">decision authority</span> and <span className="text-[#2155e8]">sees every handoff</span>.
        </h2>
        <p className="m-0 max-w-[860px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
          To reduce cognitive work, context had to stay with each SKU across the flow. The Agent keeps that context, surfaces exceptions, and stops before commitments. The buyer reviews, adjusts, and explicitly places the formal order.
        </p>
      </div>

      <ProcurementWorkspaceTreeDiagram />

      <blockquote className="relative m-0 max-w-[920px] py-3 pl-[clamp(48px,7vw,78px)]">
        <span
          className="absolute left-0 top-0 text-[clamp(68px,9vw,108px)] font-bold leading-none"
          style={{ ...bodyStyle, color: accent }}
          aria-hidden
        >
          “
        </span>
        <p data-case-type="quote-compact" className="m-0 text-[clamp(19px,2.4vw,27px)] font-bold leading-[1.42] tracking-[-0.012em] text-[#161616]" style={bodyStyle}>
          Don&apos;t just give me the numbers. Explain them.
        </p>
      </blockquote>

      <p className="m-0 max-w-[860px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
        That raised a boundary: what the Agent can calculate, and what must stay human.
      </p>
    </div>

      <div className="case-radius-lg flex flex-col gap-8 overflow-hidden bg-[#161616] p-[clamp(22px,4vw,40px)]">
        <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em] text-[#7fa2ff]" style={bodyStyle}>Purchase decision</p>
        <p className="m-0 max-w-[820px] text-[17px] font-normal leading-[1.6] text-[#d8d8d8]" style={bodyStyle}>
          What to buy, how much, and when had to be assembled from evidence the buyer could inspect. The Agent keeps context, but the buyer judges and explicitly places the formal order.
        </p>

        <div className="case-radius-lg overflow-hidden bg-white">
          <ProcurementDecisionDiagram />
        </div>

        <div>
          <p className="m-0 mb-4 text-[10px] font-bold uppercase tracking-[0.05em] text-[#7fa2ff]" style={bodyStyle}>How the Agent participates</p>
          <div className="grid border-y border-white/20 md:grid-cols-3">
            {[
              { title: 'Interpret intent', body: 'Understand the buyer&apos;s goal.' },
              { title: 'Keep context flowing', body: 'Maintain signals across the SKU lifecycle.' },
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
      </div>
    </section>
    </>
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
      <div className="flex flex-col gap-9">
        <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em] text-[#777]" style={bodyStyle}>UX Iterations</p>
        <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
          Early testing revealed buyers thought the Agent already placed orders automatically. These iterations made the handoff visible: AI suggests → human reviews and edits → human places the order → exceptions return to the human.
        </p>

        <div className="flex flex-col gap-3">
          {agentUxIterations.map((iteration) => (
            <article key={iteration.index} className="case-radius-lg grid gap-3 border border-[#d8d8d8] bg-white p-[clamp(18px,3vw,24px)] sm:grid-cols-[44px_minmax(160px,0.7fr)_1fr]">
              <span className="text-[11px] font-bold text-[#777]" style={bodyStyle}>{iteration.index}</span>
              <p className="m-0 text-[15px] font-bold text-[#161616]" style={bodyStyle}>
                {iteration.from}
                <span className="text-[#2155e8]" aria-hidden> → </span>
                <span style={{ color: accent }}>{iteration.to}</span>
              </p>
              <div className="flex flex-col gap-2">
                <p className="m-0 text-[15px] font-bold leading-[1.45] text-[#161616]" style={bodyStyle}>{iteration.principle}</p>
                <p className="m-0 text-[13px] font-normal leading-[1.55] text-[#555]" style={bodyStyle}>{iteration.learning}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
  );
}

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
        <p className="m-0 text-[15px] font-bold leading-[1.4] text-[#161616]" style={bodyStyle}>Procurement Workspace</p>
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

          <rect x="420" y="24" width="240" height="56" rx={caseRadiusPx.sm} fill="#161616" stroke="#161616" />
          <text x="540" y="48" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="700" letterSpacing="1.2">ROOT WORKSPACE</text>
          <text x="540" y="68" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="700">Procurement Workspace</text>

          <rect x="240" y="136" width="240" height="56" rx={caseRadiusPx.sm} fill="#f4f4f4" stroke="#777777" />
          <text x="360" y="160" textAnchor="middle" fill="#777777" fontSize="8" fontWeight="700" letterSpacing="1.2">OPERATE</text>
          <text x="360" y="180" textAnchor="middle" fill="#161616" fontSize="16" fontWeight="700">Plan and execute</text>
          <rect x="680" y="136" width="240" height="56" rx={caseRadiusPx.sm} fill="#f4f4f4" stroke="#777777" />
          <text x="800" y="160" textAnchor="middle" fill="#777777" fontSize="8" fontWeight="700" letterSpacing="1.2">CONTROL</text>
          <text x="800" y="180" textAnchor="middle" fill="#161616" fontSize="16" fontWeight="700">Govern and learn</text>

          {leaves.map((leaf) => (
            <g key={leaf.title}>
              <rect x={leaf.x} y="280" width="144" height="88" rx={caseRadiusPx.sm} fill={leaf.focal ? '#e9eef8' : '#ffffff'} stroke={leaf.focal ? '#2155e8' : '#cfcfcf'} strokeWidth={leaf.focal ? 1.2 : 1} />
              <text x={leaf.x + 16} y="312" fill={leaf.focal ? '#2155e8' : '#161616'} fontSize="12" fontWeight="700">{leaf.title}</text>
              <text x={leaf.x + 16} y="340" fill="#777777" fontSize="8" fontWeight="600">{leaf.note}</text>
            </g>
          ))}
        </svg>
      </div>
    </figure>
  );
}

function InteractiveDemo() {
  return (
    <div className="flex flex-col gap-5" data-case-nav-label="00 / Demo">
      <ChapterTitle>00 / Interactive Demo</ChapterTitle>
      <div className="hidden md:block">
        <ProcurementDemoEmbed src={PROCUREMENT_AGENT_DEMO_URL} title="Procurement Agent interactive demo" />
      </div>

      {/* The workspace is a desktop ERP layout; on phones link out instead of embedding it */}
      <div className="flex flex-col gap-4 bg-white md:hidden">
        <Image
          src="/img/procurement-agent/mockup-agent-workspace.png"
          alt="Procurement Agent workspace with the purchase order and the agent panel side by side"
          width={1600}
          height={1000}
          className="case-radius-xl h-auto w-full"
        />
        <p className="m-0 text-[13px] font-normal leading-[1.55] text-[#3b3b3b]" style={bodyStyle}>
          The demo needs a desktop-sized window to lay out its three panes.
        </p>
        <a
          href={PROCUREMENT_AGENT_DEMO_URL}
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
    <div className="procurement-case mei-project-page w-full">
      <CaseStudyControls
        accentColor={accent}
        tldrPoints={tldrPoints}
        navLabels={[
          '00 / Demo',
          '01 / Old flow',
          '03 / Phase 1',
          '04 / Turning point',
          '05 / Agent workflow',
          '06 / MVP boundary',
        ]}
      />
      <CaseStudyHero
        accentColor={accent}
        title="AI Procurement Agent for DEF Beauty Supply"
        subtitle="Designing AI to participate in the real purchasing workflow — starting from document comparison and exception flagging, while keeping judgment, decisions, and commitments under human control."
        tags={['B2B SaaS', 'Enterprise UX', 'AX Design', 'Agent Workflow', 'Full stack']}
        aboutLabel="About DEF Beauty Supply"
        about={'DEF Beauty Supply is a B2B beauty wholesaler serving professional customers in Italy.\n\nIts purchasing work was stuck on manual checking: compare the buyer\'s draft against the supplier confirmation, then compare delivery documents against that confirmation when goods arrive. I designed a workflow where AI flags discrepancies, and buyers judge what each difference means and what to do next.'}
        meta={[
          {
            label: 'Role',
            value: ['UX / AX Designer', 'End-to-end ownership from research through agent design and implementation.'],
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
        visualImageScale={1.8}
        visualTransformOrigin="center top"
        visualTranslateY="0%"
        visualBackground="radial-gradient(circle at 78% 22%, rgb(83 118 255 / 0.3), transparent 28%), radial-gradient(circle at 18% 82%, rgb(33 85 232 / 0.22), transparent 34%), linear-gradient(135deg, #0b1020 0%, #111b38 48%, #071020 100%)"
        visualNavTone="light"
        compactTypography
        titleFontSize="clamp(26px, 2.6vw, 40px)"
        wideDetails
        tagRadius="0"
      />

      {/* overflow-x visible here so the demo stage can expand past the content column */}
      <section {...sectionBandProps('white', false)}>
        <InteractiveDemo />
      </section>

      <section {...sectionBandProps('white')}>
        <div className="flex max-w-[1080px] flex-col gap-10" data-case-nav-label="01 / Old flow">
          <ChapterTitle>01 / Old flow</ChapterTitle>
          <h2 className="m-0 max-w-[900px] text-[clamp(30px,4.2vw,46px)] font-bold leading-[1.1] tracking-[-0.025em] text-[#161616]" style={bodyStyle}>
            The old path ran through <span className="text-[#2155e8]">Excel, estimates, and messages</span> — purchase and fulfillment never shared one record.
          </h2>
          <div className="flex max-w-[900px] flex-col gap-4 [&_strong]:font-bold [&_strong]:text-[#161616]">
            <p className="m-0 text-[17px] font-normal leading-[1.65] text-[#3b3b3b]" style={bodyStyle}>
              DEF Beauty Supply&apos;s procurement work was spread across <strong>disconnected software, documents, messaging, and spreadsheets</strong>. Buyers spent time manually comparing purchase drafts against supplier confirmations, then comparing delivery documents against those confirmations when goods arrived — checking for typos, packaging changes, stockouts, missing shipments, or partial deliveries.
            </p>
            <p className="m-0 text-[17px] font-normal leading-[1.65] text-[#3b3b3b]" style={bodyStyle}>
              I started from that impulse — add AI to procurement — then discovered the real work was <strong>not building an AI feature, but making AI participate in the buyer&apos;s actual workflow, starting from those repetitive document comparisons</strong>.
            </p>
          </div>

          <EcosystemDiagram />

          <p className="m-0 max-w-[760px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
            Buyers downloaded sales and stock, estimated quantity in Excel, then confirmed with suppliers over WhatsApp and email. When goods arrived they searched SKUs one by one to stock in. Confirmation, DDT, and received quantities were compared by hand. The quantity decision stayed with the buyer; the system only recorded the final stock-in.
          </p>
          <div className="case-radius-lg overflow-hidden bg-[#161616] p-[clamp(24px,4vw,44px)]">
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
                    <div key={step} className="case-radius-md relative flex min-h-[104px] flex-col justify-between border border-white/20 bg-[#202020] px-3 py-4">
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
                        className="absolute top-0 size-[7px] -translate-x-1/2 case-radius-full bg-[#2155e8]"
                        style={{ left: item.left }}
                        aria-hidden
                      />
                      <article
                        className="case-radius-md overflow-hidden absolute flex min-h-[56px] w-[168px] -translate-x-1/2 items-center border px-3 py-2"
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
          </blockquote>
        </div>
      </section>

      <section {...sectionBandProps('white')}>
        <ThreeStageEvolution />
      </section>

      <section {...sectionBandProps('ink')}>
        <ProcurementTurningPoint />
      </section>

      <DesignResultEvidenceBackedAgency />

      <section {...sectionBandProps('white')}>
      <div className="flex max-w-[1080px] flex-col gap-10">
          <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em] text-[#777]" style={bodyStyle}>Architecture</p>
          <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
            <strong className="font-bold text-[#161616]">The LLM interprets. The engine calculates. The buyer decides.</strong> I separated probabilistic interpretation from deterministic quantity calculation and human authorization so recommendations remained explainable and controllable.
          </p>

          <ResponsibilityArchitectureDiagram />

          <div className="case-radius-lg overflow-hidden border-l-[5px] border-[#2155e8] bg-white px-[clamp(22px,3vw,32px)] py-6">
            <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em]" style={{ ...bodyStyle, color: accent }}>Rationale</p>
            <p className="m-0 mt-3 max-w-[960px] text-[18px] font-bold leading-[1.5] text-[#161616]" style={bodyStyle}>
              Quantity affects cash, inventory risk, and supplier commitments, so the recommendation must be reproducible from business inputs, not generated probabilistically.
            </p>
          </div>
        </div>

      <div className="case-radius-lg flex flex-col gap-9 overflow-hidden bg-[#161616] p-[clamp(24px,5vw,56px)]">
          <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em] text-[#7fa2ff]" style={bodyStyle}>Learning loop</p>
          <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.53] text-[#d8d8d8]" style={bodyStyle}>
            Each time a buyer adjusts a recommendation, and each time actual delivery differs, that gap becomes a learning signal. The Agent can refine its next calculation — after the buyer reviews and approves those updates.
          </p>

          <ProcurementLearningLoop />

          <div className="border-l-[4px] border-[#7fa2ff] pl-5">
            <p className="m-0 max-w-[920px] text-[20px] font-bold leading-[1.4] text-white" style={bodyStyle}>
              Learning is governed: the Agent suggests updates, the buyer approves them before they affect future calculations.
            </p>
          </div>
        </div>

      <AgentUxIterationsSection />
      </section>

      <section {...sectionBandProps('white')}>
        <div className="flex flex-col gap-9" data-case-nav-label="06 / MVP boundary">
          <ChapterTitle>06 / MVP Boundary & Results</ChapterTitle>
          <h2 className="m-0 max-w-[930px] text-[clamp(26px,3.6vw,36px)] font-bold leading-[1.17] text-[#161616]" style={bodyStyle}>
            Validated a functional Agent-ready MVP. The Agent does not place real orders.
          </h2>

          <div className="flex max-w-[860px] flex-col gap-4">
            <p className="m-0 text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
              Using real records and a coded prototype, I validated the lifecycle, discrepancy handling, and the human gate before any supplier commitment.
            </p>
            <p className="m-0 text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
              After production use I would measure whether buyers keep the recommended quantity, and whether the Agent still stops when approval is required.
            </p>
          </div>
        </div>

        <div className="case-radius-lg flex flex-col gap-6 overflow-hidden bg-[#161616] p-[clamp(24px,5vw,56px)]">
            <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em] text-[#7fa2ff]" style={bodyStyle}>Scope</p>
            <p className="m-0 max-w-[640px] text-[17px] font-normal leading-[1.53] text-[#d8d8d8]" style={bodyStyle}>
              A coded workflow with a shared plan-and-conversation workbench. The Agent never places the formal order.
            </p>

            {/* 后续若要自动化：按供应商成熟度打分后再开自动下单，以及按销售/交期/免运费做采购提醒 */}
            <p className="m-0 mt-2 text-[11px] font-bold uppercase tracking-[0.05em] text-[#7fa2ff]" style={bodyStyle}>
              Feedback and what to do next
            </p>
            <div className="case-radius-md overflow-hidden grid gap-px bg-white/20 md:grid-cols-2">
              {[
                {
                  title: 'A trust score per supplier',
                  body: 'Sales velocity and restock frequency differ by supplier, so the Agent does not mature at one speed. Score each supplier. Turn automation on only after that score is trustworthy enough.',
                },
                {
                  title: 'Purchase reminders',
                  body: 'Predict when to buy from product sales, supplier lead time, and whether the order will hit a free-shipping threshold. Remind the buyer before the gap becomes urgent.',
                },
              ].map((item, index) => (
                <article key={item.title} className="flex min-h-[178px] flex-col gap-4 bg-[#202020] p-5">
                  <p className="m-0 text-[11px] font-bold text-[#7fa2ff]" style={bodyStyle}>{String(index + 1).padStart(2, '0')}</p>
                  <h3 className="m-0 text-[17px] font-bold leading-[1.3] text-white" style={bodyStyle}>{item.title}</h3>
                  <p className="m-0 mt-auto text-[12px] font-normal leading-[1.5] text-[#bdbdbd]" style={bodyStyle}>{item.body}</p>
                </article>
              ))}
            </div>
        </div>
      </section>

      <section {...sectionBandProps('white')}>
        <div className="flex max-w-[860px] flex-col gap-3">
          <p className="m-0 text-[16px] font-normal leading-[1.65] text-[#3b3b3b]" style={bodyStyle}>
            I started by adding AI for the sake of AI — looking at which manual checks it could take.
          </p>
          <p className="m-0 text-[16px] font-normal leading-[1.65] text-[#3b3b3b]" style={bodyStyle}>
            Isolated checks could not give the buyer a purchase-quantity recommendation.
          </p>
          <p className="m-0 text-[16px] font-normal leading-[1.65] text-[#3b3b3b]" style={bodyStyle}>
            To reduce the cognitive work, the Agent had to participate in the whole workflow, with a visible handoff: AI flags and drafts, the buyer judges and commits.
          </p>
        </div>
      </section>

      <section {...sectionBandProps('white')}>
        <div>
          <CaseStudyBackButton />
        </div>
      </section>
    </div>
  );
}
