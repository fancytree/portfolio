import type { Metadata } from 'next';
import Image from 'next/image';
import CaseStudyBackButton from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/CaseStudyControls';
import { CaseButton } from '../../components/case-kit/CaseButton';
import {
  CaseChapter,
  CaseClose,
  CaseFigure,
  CaseHero,
  CaseKitPage,
  CaseKitSections,
  CaseProse,
  CasePullquote,
  CaseSteps,
  CaseVideo,
} from '../../components/case-kit/CaseKit';
import { PROCUREMENT_AGENT_DEMO_URL } from '@/lib/demoUrls';
import EcosystemDiagram from '../procurement-agent-v2/EcosystemDiagram';
import ProcurementDecisionDiagram from '../procurement-agent-v2/ProcurementDecisionDiagram';
import ProcurementDemoEmbed from '../procurement-agent-v2/ProcurementDemoEmbed';
import ProcurementLearningLoop from '../procurement-agent-v2/ProcurementLearningLoop';
import ResponsibilityArchitectureDiagram from '../procurement-agent-v2/ResponsibilityArchitectureDiagram';
import { caseRadius } from '@/lib/design-tokens';

export const metadata: Metadata = {
  title: 'AI Procurement Agent for DEF Beauty Supply | Mei Chai',
  description:
    'AI joins DEF Beauty Supply’s purchasing workflow. The buyer keeps the judgment and places the formal order.',
};

const navLabels = [
  '01 / Overview',
  '02 / The problem',
  '03 / Research',
  '04 / The challenge',
  '05 / Phase 1',
  '06 / Why an Agent',
  '07 / Approach',
  '08 / The solution',
  '09 / Validation',
  '10 / Results',
  '11 / Reflection',
];

/** 理解测试里暴露的角色变化。安全边界先于速度。 */
const comprehensionShifts = [
  {
    title: 'Explain to Initiate',
    body: 'If buyers already knew what they wanted to do, explanation added little. The Agent starts the purchasing work, and supplier history supplies inputs the buyer would otherwise retype.',
  },
  {
    title: 'Compare to Recommend',
    body: 'Three replenishment scenarios handed the comparison back to the buyer. One editable, evidence-backed proposal keeps the recommendation inspectable and reversible.',
  },
  {
    title: 'Automate to Hand off',
    body: 'Formal ordering happens through email, WhatsApp, or supplier channels and creates a real commitment. The Agent prepares the order. The buyer places it.',
  },
  {
    title: 'Separate approval to Escalate by exception',
    body: 'A normal order can become risky only after new evidence arrives. Approval is that change of state, not a second kind of order.',
  },
  {
    title: 'Manual receiving to Reconcile and learn',
    body: 'One purchase can arrive in several shipments, and the count can differ from both the confirmation and the DDT. That gap is a learning signal only after the buyer confirms it.',
  },
];

/** Phase 1 之后的责任拆分。描边和字色属于这张图本身，外层只提供深色底。 */
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
        aria-labelledby="kit-phase-one-responsibility-title kit-phase-one-responsibility-desc"
      >
        <title id="kit-phase-one-responsibility-title">Responsibility shift after Phase 1</title>
        <desc id="kit-phase-one-responsibility-desc">Before Phase 1, the buyer carried the full procurement workflow. After Phase 1, the system retrieved data and organized the workflow while calculation, supplier rules, judgment, and formal ordering stayed with the buyer.</desc>
        <defs>
          <marker id="kit-phase-one-arrow-muted" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.42)" />
          </marker>
          <marker id="kit-phase-one-arrow-blue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#7fa2ff" />
          </marker>
          <marker id="kit-phase-one-arrow-orange" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#ed5b2b" />
          </marker>
        </defs>
        <text x="40" y="32" fill="#afafaf" fontSize="12" fontWeight="700" letterSpacing="1.2">BEFORE PHASE 1</text>
        <text x="664" y="32" fill="#afafaf" fontSize="12" fontWeight="700" letterSpacing="1.2">AFTER PHASE 1</text>
        <path d="M360 248 H432" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1.2" markerEnd="url(#kit-phase-one-arrow-muted)" />
        <path d="M576 248 H616" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1.2" />
        <path d="M616 248 V144 H664" fill="none" stroke="#7fa2ff" strokeWidth="1.2" markerEnd="url(#kit-phase-one-arrow-blue)" />
        <path d="M616 248 V360 H664" fill="none" stroke="#ed5b2b" strokeWidth="1.2" markerEnd="url(#kit-phase-one-arrow-orange)" />
        <circle cx="616" cy="248" r="4" fill="#161616" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
        <rect x="40" y="72" width="320" height="384" style={{ rx: caseRadius.sm }} fill="#202020" stroke="rgba(255,255,255,0.18)" />
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
        <rect x="432" y="216" width="144" height="64" style={{ rx: caseRadius.sm }} fill="#161616" stroke="rgba(255,255,255,0.28)" />
        <text x="504" y="240" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700" letterSpacing="1.2">PHASE 1</text>
        <text x="504" y="260" textAnchor="middle" fill="#777777" fontSize="8" fontWeight="600">Records connected</text>
        <rect x="664" y="72" width="376" height="148" style={{ rx: caseRadius.sm }} fill="rgba(127,162,255,0.12)" stroke="#7fa2ff" strokeWidth="1.2" />
        <text x="688" y="104" fill="#7fa2ff" fontSize="8" fontWeight="700" letterSpacing="1.2">SYSTEM NOW</text>
        <text x="688" y="132" fill="#ffffff" fontSize="16" fontWeight="700">Operational work moves to the system</text>
        <rect x="688" y="156" width="144" height="40" style={{ rx: caseRadius.sm }} fill="rgba(127,162,255,0.12)" stroke="rgba(127,162,255,0.46)" />
        <text x="760" y="180" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="600">Retrieve data</text>
        <rect x="840" y="156" width="176" height="40" style={{ rx: caseRadius.sm }} fill="rgba(127,162,255,0.12)" stroke="rgba(127,162,255,0.46)" />
        <text x="928" y="180" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="600">Organize workflow</text>
        <rect x="664" y="264" width="376" height="192" style={{ rx: caseRadius.sm }} fill="rgba(237,91,43,0.10)" stroke="#ed5b2b" strokeWidth="1.2" />
        <text x="688" y="296" fill="#ed5b2b" fontSize="8" fontWeight="700" letterSpacing="1.2">BUYER STILL</text>
        <text x="688" y="324" fill="#ffffff" fontSize="16" fontWeight="700">Decision authority stays human</text>
        <rect x="688" y="344" width="104" height="40" style={{ rx: caseRadius.sm }} fill="rgba(237,91,43,0.10)" stroke="rgba(237,91,43,0.5)" />
        <text x="740" y="368" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="600">Calculate</text>
        <rect x="804" y="344" width="192" height="40" style={{ rx: caseRadius.sm }} fill="rgba(237,91,43,0.10)" stroke="rgba(237,91,43,0.5)" />
        <text x="900" y="368" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="600">Apply supplier rules</text>
        <rect x="688" y="396" width="152" height="40" style={{ rx: caseRadius.sm }} fill="rgba(237,91,43,0.10)" stroke="rgba(237,91,43,0.5)" />
        <text x="764" y="420" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="600">Make judgment</text>
        <text x="856" y="412" fill="#afafaf" fontSize="8" fontWeight="700" letterSpacing="0.8">FINAL AUTHORITY</text>
        <text x="856" y="432" fill="#ffffff" fontSize="12" fontWeight="600">Place formal order</text>
      </svg>
    </div>
  );
}

/** 采购工作区的信息架构，六个区域来自原来的案例。 */
function WorkspaceTree() {
  const leaves = [
    { x: 32, title: 'All orders', note: 'Lifecycle portfolio' },
    { x: 200, title: 'Purchase plan', note: 'Editable proposal', focal: true },
    { x: 368, title: 'Document check', note: 'Confirmation to receipt' },
    { x: 536, title: 'Supplier memory', note: 'Rules and performance' },
    { x: 744, title: 'Approval', note: 'High-impact gate' },
    { x: 912, title: 'Learning review', note: 'Governed memory' },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <svg className="h-auto min-w-[820px] w-full" viewBox="0 0 1080 404" role="img" aria-labelledby="kit-workspace-tree-title kit-workspace-tree-desc">
        <title id="kit-workspace-tree-title">Procurement Workspace information architecture</title>
        <desc id="kit-workspace-tree-desc">The Procurement Workspace splits into plan-and-execute and govern-and-learn.</desc>
        <path d="M540 80 V112" fill="none" stroke="#777777" />
        <path d="M360 112 H800" fill="none" stroke="#777777" />
        <path d="M360 112 V136 M800 112 V136" fill="none" stroke="#777777" />
        <path d="M360 192 V232 M104 232 H608" fill="none" stroke="#777777" />
        <path d="M104 232 V280 M272 232 V280 M440 232 V280 M608 232 V280" fill="none" stroke="#777777" />
        <path d="M800 192 V232 H984" fill="none" stroke="#777777" />
        <path d="M816 232 V280 M984 232 V280" fill="none" stroke="#777777" />
        <rect x="420" y="24" width="240" height="56" style={{ rx: caseRadius.sm }} fill="#161616" stroke="#161616" />
        <text x="540" y="48" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="700" letterSpacing="1.2">ROOT WORKSPACE</text>
        <text x="540" y="68" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="700">Procurement Workspace</text>
        <rect x="240" y="136" width="240" height="56" style={{ rx: caseRadius.sm }} fill="#f4f4f4" stroke="#777777" />
        <text x="360" y="160" textAnchor="middle" fill="#777777" fontSize="8" fontWeight="700" letterSpacing="1.2">OPERATE</text>
        <text x="360" y="180" textAnchor="middle" fill="#161616" fontSize="16" fontWeight="700">Plan and execute</text>
        <rect x="680" y="136" width="240" height="56" style={{ rx: caseRadius.sm }} fill="#f4f4f4" stroke="#777777" />
        <text x="800" y="160" textAnchor="middle" fill="#777777" fontSize="8" fontWeight="700" letterSpacing="1.2">CONTROL</text>
        <text x="800" y="180" textAnchor="middle" fill="#161616" fontSize="16" fontWeight="700">Govern and learn</text>
        {leaves.map((leaf) => (
          <g key={leaf.title}>
            <rect x={leaf.x} y="280" width="144" height="88" style={{ rx: caseRadius.sm }} fill={leaf.focal ? '#e9eef8' : '#ffffff'} stroke={leaf.focal ? '#2155e8' : '#cfcfcf'} strokeWidth={leaf.focal ? 1.2 : 1} />
            <text x={leaf.x + 16} y="312" fill={leaf.focal ? '#2155e8' : '#161616'} fontSize="12" fontWeight="700">{leaf.title}</text>
            <text x={leaf.x + 16} y="340" fill="#777777" fontSize="8" fontWeight="600">{leaf.note}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function ProcurementAgentKitPage() {
  return (
    <CaseKitPage>
      <CaseStudyControls
        navLabels={navLabels}
        railKicker="Case study"
        railTitle="Procurement Agent"
      />

      <CaseKitSections>
        <div className="case-mobile-back"><CaseStudyBackButton /></div>
        <CaseHero
          eyebrow="Portfolio · Case study"
          title="AI Procurement Agent for DEF Beauty Supply"
          intro="AI joins the purchasing workflow. The buyer keeps the judgment and places the formal order."
          meta={[
            { label: 'Client', value: 'DEF Beauty Supply' },
            { label: 'Year', value: '2026' },
            { label: 'Role', value: 'Product design & Full stack' },
            { label: 'Duration', value: '4 months' },
            { label: 'Industry', value: 'B2B beauty wholesale' },
            { label: 'Tools', value: 'Figma, Codex' },
          ]}
          action={{ label: 'Open the demo', href: PROCUREMENT_AGENT_DEMO_URL }}
          tags={['B2B SaaS', 'Enterprise UX', 'AX Design', 'Agent Workflow', 'Full stack']}
          glance={{
            items: [
              {
                label: 'Challenge',
                body: 'Buyers assembled what to buy and how much from estimates, supplier messages, and receiving records that never met.',
              },
              {
                label: 'Solution',
                body: 'A traceable purchase lifecycle, then an Agent that drafts one inspectable recommendation. The buyer places the order.',
              },
              {
                label: 'Outcome',
                body: 'In production use. The Agent drafts the recommendation. The buyer still places the order.',
              },
            ],
            deliverables: [
              'Traceable lifecycle',
              'Shared workspace',
              'Quantity recommendation',
              'Human order gate',
              'Governed learning',
            ],
          }}
        />

        <CaseChapter
          label="01 / Overview"
          title="This case is the purchasing workflow."
        >
          <CaseProse>
            <p>
              DEF Beauty Supply is a B2B beauty wholesaler in Italy. I owned the work from research through agent design and implementation, with procurement, operations, and business.
            </p>
            <p>
              AI joins that workflow. The buyer keeps the judgment and places the formal order.
            </p>
          </CaseProse>
        </CaseChapter>

        <CaseChapter
          label="02 / The problem"
          title="Procurement sat outside the system."
        >
          <CaseProse>
            <p>
              Inventory was in the system. Estimating the quantity, confirming with the supplier, and receiving the goods each happened somewhere else.
            </p>
            <ul>
              <li><strong>Estimating:</strong> buyers downloaded sales and stock, then worked out a quantity in Excel.</li>
              <li><strong>Supplier messages:</strong> confirmation went through WhatsApp or email, and the purchase context stayed in the thread.</li>
              <li><strong>Receiving:</strong> when goods arrived, staff searched SKUs one by one to stock in. The system recorded the stock-in, not the purchase intent.</li>
            </ul>
          </CaseProse>
          <CasePullquote>
            Procurement data existed at every step, but the system could not connect those records into one decision and fulfillment lifecycle.
          </CasePullquote>
          <CaseFigure caption="Demand, the platform, and the supplier. The Agent is not in this picture yet.">
            <EcosystemDiagram />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter
          label="03 / Research"
          title="Buyers estimated from recent sales and remembered the stockouts."
        >
          <CaseProse>
            <p>
              I followed the path with procurement. A buyer downloaded sales and stock, estimated a quantity, sent it to the supplier, and later compared the confirmation, the DDT (delivery note), and the count by hand.
            </p>
            <p>
              Quantity came from the last three months of sales. A stockout never sat with the SKU, so the buyer had to remember which products had run out.
            </p>
          </CaseProse>
        </CaseChapter>

        <CaseChapter
          label="04 / The challenge"
          title="Every order, the buyer assembled the quantity alone."
        >
          <CaseProse>
            <p>
              The buyer had to decide what to buy and how much from evidence that never shared a record. The system could store a stock-in. It could not support that judgment.
            </p>
          </CaseProse>
        </CaseChapter>

        <CaseChapter
          label="05 / Phase 1"
          title="A traceable lifecycle: object, state, and evidence."
        >
          <CaseProse>
            <p>
              I connected the purchase before asking AI to recommend a quantity. Buyers create a purchase order, send a PDF or Excel file to the supplier, then upload the confirmation and mark the order as ordered. Receiving works from that purchase instead of searching for every SKU again.
            </p>
            <ul>
              <li><strong>Object:</strong> purchase, confirmation, DDT, receiving, inventory. One purchase can arrive in several batches.</li>
              <li><strong>State:</strong> Draft, Awaiting supplier, Confirmed, Ordered, Partially received, Completed.</li>
              <li><strong>Evidence:</strong> confirmation, DDT, and the physical count stay linked. Excess goods can enter inventory, be accepted as gifts, or be returned. The difference stays on the receiving record.</li>
            </ul>
            <p>
              AI highlighted document differences in the table and a reminder column. It did not decide what to buy or how much.
            </p>
          </CaseProse>
          <CaseVideo
            src="/videos/def-erp/purchase-order.mp4"
            poster="/videos/def-erp/purchase-order.webp"
            label="Purchase order workflow demonstration"
            caption="Purchase order — products, quantities, and supplier confirmation."
            width={1828}
            height={1080}
          />
          <CaseFigure caption="Receiving — delivery records, actual quantities, and differences.">
            <Image
              src="/img/def-erp/receiving-workspace-current.webp"
              alt="Receiving workspace linking purchase quantities, delivery notes, actual counts, and partial arrival progress."
              width={3024}
              height={1897}
              sizes="(min-width: 1280px) 1120px, 100vw"
            />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter
          label="06 / Why an Agent"
          title="The records were connected. The judgment burden remained."
        >
          <CasePullquote>
            Now I don&apos;t need to switch between Excel and the system anymore. But the part that takes the most time is still the same. I still have to decide what to buy and how much.
          </CasePullquote>
          <CaseProse>
            <p>Procurement team, after Phase 1.</p>
            <p>
              The first view put the last three months of sales on the SKU. Stockouts were still missing, so buyers still remembered them. The system could retrieve data and organize the workflow. Calculation, supplier rules, judgment, and the formal order stayed with the buyer.
            </p>
            <p>
              To reduce that burden, the Agent had to enter the whole procurement workflow.
            </p>
          </CaseProse>
          <CaseFigure caption="After Phase 1 the system retrieves data and organizes the workflow. Calculation, supplier rules, judgment, and the formal order stay with the buyer.">
            <div data-case-tone="inverse" className="bg-[var(--case-contrast)]">
              <ResponsibilityShiftDiagram />
            </div>
          </CaseFigure>
        </CaseChapter>

        <CaseChapter
          label="07 / Approach"
          title="The LLM interprets. The engine calculates. The buyer decides."
        >
          <CaseProse>
            <p>
              I separated interpretation, calculation, and the decision. What to buy, how much, and when comes from evidence the buyer can inspect: sales velocity, coverage, inventory, in-transit stock, and supplier lead time.
            </p>
            <p>
              Quantity affects cash, inventory risk, and supplier commitments, so the recommendation has to be reproducible from those inputs. When the buyer changes a recommendation, or the delivery differs, that gap becomes a learning signal. The Agent can suggest an update. The buyer approves it before it affects the next calculation.
            </p>
          </CaseProse>
          <CaseFigure caption="Interpretation, calculation, and the formal supplier commitment are three different jobs.">
            <ResponsibilityArchitectureDiagram />
          </CaseFigure>
          <CaseFigure caption="Experience, sales, inventory, supplier rules, lead time, and seasonality meet in one plan.">
            <ProcurementDecisionDiagram />
          </CaseFigure>
          <CaseFigure caption="Confirmation, DDT, receiving, and variance become a candidate. They do not change the next calculation until the buyer reviews them.">
            <div data-case-tone="inverse" className="bg-[var(--case-contrast)]">
              <ProcurementLearningLoop />
            </div>
          </CaseFigure>
        </CaseChapter>

        <CaseChapter
          label="08 / The solution"
          title="One workspace, an editable plan, and a visible handoff."
        >
          <CaseProse>
            <p>
              Purchase orders and the Agent share one workspace. The purchase plan stays editable until a person places the formal order. The buyer can see each handoff. The Agent can analyse, prepare, compare, and verify. It cannot place that order.
            </p>
          </CaseProse>
          <CaseFigure caption="The workspace splits into plan and execute, and govern and learn. The purchase plan stays the editable center.">
            <WorkspaceTree />
          </CaseFigure>
          {/* 桌面嵌入可展开的工作区；手机改为截图和外链，避免三栏被挤扁。 */}
          <div className="hidden md:block">
            <ProcurementDemoEmbed src={PROCUREMENT_AGENT_DEMO_URL} title="Procurement Agent interactive demo" />
          </div>
          <div className="md:hidden">
            <CaseFigure caption="The demo needs a desktop-sized window to lay out its three panes.">
              <Image
                src="/img/procurement-agent/mockup-agent-workspace.png"
                alt="Procurement Agent workspace with the purchase order and the agent panel side by side"
                width={1152}
                height={646}
              />
            </CaseFigure>
            <CaseButton variant="secondary" href={PROCUREMENT_AGENT_DEMO_URL} target="_blank" rel="noreferrer">
              Open the demo in a new tab
            </CaseButton>
          </div>
        </CaseChapter>

        <CaseChapter
          label="09 / Validation"
          title="Safety and comprehension before speed."
        >
          <CaseProse>
            <p>
              Using real procurement records and a coded prototype, I checked the lifecycle from purchase need to outcome, a quantity the same inputs can reproduce, differences that stay visible, and the pause before a supplier commitment.
            </p>
            <p>
              Testers thought the Agent had already placed the order. The handoff had to stay explicit, and the Agent’s role had to get more specific.
            </p>
          </CaseProse>
          <CaseSteps items={comprehensionShifts} />
        </CaseChapter>

        <CaseChapter
          label="10 / Results"
          title="In production use. The buyer still places the order."
        >
          <CaseProse>
            <p>
              The workspace is in production use. The Agent drafts the quantity. The buyer still places the formal order.
            </p>
            <p>
              Whether buyers keep the recommended quantity, and whether the Agent stops when approval is required, was not measured for this case.
            </p>
          </CaseProse>
        </CaseChapter>

        <CaseClose label="11 / Reflection" title="The Agent works with the buyer. Trust is earned.">
          <CaseProse>
            <p>
              Connecting the records did not remove the judgment. The buyer still decides what to buy and how much, and still places the formal order.
            </p>
            <p>
              A learning update counts only after the buyer confirms it.
            </p>
          </CaseProse>
        </CaseClose>
      </CaseKitSections>
    </CaseKitPage>
  );
}
