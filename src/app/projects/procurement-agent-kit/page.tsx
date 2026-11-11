import type { Metadata } from 'next';
import Image from 'next/image';
import { Bot, Calculator, ClipboardCheck, FileSearch, History, Layers, MessageSquare, PackageCheck, ScanSearch, ShieldCheck, UserCheck, Workflow } from 'lucide-react';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import { CaseKitControls as CaseStudyControls } from '../../components/CaseStudyControls';
import { CaseButton } from '../../components/case-kit/CaseButton';
import { CaseChapter, CaseClose, CaseEvidenceCards, CaseEvidenceThumbs, CaseFigure, CaseHero, CaseKitPage, CaseKitSections, CaseProse, CasePullquote, CaseStats, CaseVideo } from '../../components/case-kit/CaseKit';
import ProcurementExperienceMap from './ProcurementExperienceMap';
import { AgentMemoryLoop, ConnectedProcurementFlow, LegacyProcurementFlow } from './ProcurementFlowDiagrams';
import CaseDemoPreview from '../../components/case-kit/CaseDemoPreview';
import { PROCUREMENT_AGENT_DEMO_URL } from '@/lib/demoUrls';

export const metadata: Metadata = {
  title: 'Designing an AI Procurement Agent | Mei Chai',
  description: 'How I turned fragmented purchasing records into an editable AI recommendation, with explicit human handoffs and reviewed learning. In production at DEF Beauty Supply.',
};

const navLabels = ['01 / My role', '02 / The problem', '03 / Phase 1', '04 / Why an Agent', '05 / Agent design', '06 / The experience', '07 / Design an AI agent', '08 / Validation', '09 / Results', '10 / Reflection'];
const imageSizes = '(min-width: 1408px) 1120px, (min-width: 1280px) calc(100vw - 288px), calc(100vw - 48px)';

export default function ProcurementAgentKitPage() {
  return (
    <CaseKitPage>
      <CaseStudyControls navLabels={navLabels} railKicker="Case study" railTitle="Procurement Agent" />
      <CaseKitSections>
        <div className="case-mobile-back"><CaseStudyBackButton /></div>
        <CaseHero
          eyebrow="Portfolio · AI product design"
          title="AI Procurement Agent"
          intro="I moved purchasing out of Excel and chat into an ERP, then designed an AI Agent to carry the judgment buyers still kept in their heads."
          meta={[
            { label: 'Client', value: 'DEF Beauty Supply · Italy' },
            { label: 'Year', value: '2026' },
            { label: 'Role', value: 'AI product designer & full stack' },
            { label: 'Duration', value: '4 months' },
            { label: 'Status', value: 'Live · used by procurement' },
          ]}
          action={{ label: 'Explore the working demo', href: PROCUREMENT_AGENT_DEMO_URL }}
          tags={['AI interaction design', 'Human–AI collaboration', 'B2B procurement']}
          glance={{ items: [
            { label: 'The challenge', body: 'Purchasing was split across Excel, supplier messages, and delivery notes. Even after the ERP, stockouts, seasonality, and customer growth lived in the buyer’s memory.' },
            { label: 'My approach', body: 'Connect the purchase lifecycle first. Then give an Agent those signals, draft one editable plan, and keep every handoff explicit.' },
            { label: 'The outcome', body: 'A purchase plan that took 30 minutes to 2 hours across suppliers now takes about 2 minutes, and three staff members use it daily. AI prepares the recommendation; the buyer commits the order.' },
          ] }}
        />

        <CaseChapter label="01 / My role" title="I designed the work AI takes on—and the decisions people keep.">
          <CaseProse><p>DEF Beauty Supply is an Italian B2B beauty wholesaler. I owned research, workflow and AI interaction design, and implementation.</p></CaseProse>
          <CaseEvidenceCards label="My responsibilities and design deliverables" items={[
            { icon: <ScanSearch />, title: 'Frame the real task', body: 'Map how buyers estimate, confirm, and receive a purchase.' },
            { icon: <Workflow />, title: 'Define Agent behavior', body: 'Specify context, recommendations, exceptions, and human authority.' },
            { icon: <Layers />, title: 'Make it testable', body: 'Build the workspace and refine its handoffs with testers.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="02 / The problem" title="One purchase lived in three places, and none of them was the system.">
          <CaseProse><p>A purchase moved through three places. Only the last one left a record in the system.</p></CaseProse>
          <CaseEvidenceCards label="The old purchasing workflow" items={[
            { icon: <Calculator />, title: 'Excel', body: 'Export recent sales, then calculate the order by hand.' },
            { icon: <MessageSquare />, title: 'Messages', body: 'Confirmation stays in chat or email, and can differ from the order.' },
            { icon: <PackageCheck />, title: 'Delivery note', body: 'The only record, keyed in from the DDT that arrives with the goods.' },
          ]} />
          <CaseEvidenceThumbs label="Original documents from the old workflow" enlarge={false} items={[
            { src: '/img/procurement-agent/evidence/legacy-excel-order.webp', title: '1 · Excel order', alt: 'An Excel purchase order listing article numbers and piece counts in separate columns by product line.', width: 1368, height: 1020 },
            { src: '/img/procurement-agent/evidence/supplier-confirmation-pdf.webp', title: '2 · Supplier confirmation PDF', alt: 'A three-page supplier confirmation PDF listing item codes, quantities, and prices, with identifying details masked.', width: 1120, height: 960 },
            { src: '/img/procurement-agent/evidence/ddt-stack-paper.webp', title: '3 · Months of paper documents', alt: 'Stacks of printed receiving documents, bundled and labelled by month.', width: 2400, height: 1800 },
            { src: '/img/procurement-agent/evidence/ddt-lines-checked.webp', title: '4 · Checked line by line', alt: 'A supplier document with ticked items, highlighted quantities, and handwritten corrections.', width: 1400, height: 996 },
            { src: '/img/procurement-agent/evidence/legacy-receiving-entry.webp', title: '5 · Add products one by one', alt: 'Legacy purchase receiving screen: a product search dialog beside the list of products added one at a time.', width: 2000, height: 1140, badge: 'Only record in the system' },
          ]} caption="Evidence from the old workflow, in order: the Excel order, the supplier’s confirmation, the printed documents that arrived with each shipment, and the legacy receiving screen. Identifying details are masked." />
          <CaseFigure caption="Before the ERP · The order and the supplier’s answer lived outside the system. Receiving followed the delivery note, so batch arrivals could not be recorded. Scroll horizontally on smaller screens.">
            <LegacyProcurementFlow />
          </CaseFigure>
          <CaseProse>
            <ul>
              <li><strong>Hidden status:</strong> nobody could see an order’s status without asking the buyer.</li>
              <li><strong>Checked by hand:</strong> a confirmation can differ from the order, so buyers compared them line by line.</li>
              <li><strong>No link to the order:</strong> receiving started from the document, so batch arrivals could not be tracked.</li>
              <li><strong>Slow entry:</strong> every receipt meant searching for and adding each product one by one.</li>
            </ul>
          </CaseProse>
        </CaseChapter>

        <CaseChapter label="03 / Phase 1" title="First, I brought the whole purchase into the ERP.">
          <CaseProse>
            <p>When I built the ERP, the purchasing lifecycle came first.</p>
            <ul>
              <li><strong>One record:</strong> purchase order, supplier confirmation, DDT, and receiving.</li>
              <li><strong>Visible differences:</strong> mismatches between documents surface on the purchase.</li>
              <li><strong>Batch receiving:</strong> each arrival is recorded against the order.</li>
            </ul>
            <p>It did not recommend a quantity.</p>
          </CaseProse>
          <CaseFigure caption="Phase 1 · The same three moments, now on one purchase record. The quantity judgment at the start is still manual. Scroll horizontally on smaller screens.">
            <ConnectedProcurementFlow />
          </CaseFigure>
          <CaseVideo src="/videos/def-erp/purchase-order.mp4" poster="/videos/def-erp/purchase-order.webp" label="Phase 1 purchase order workflow" caption="Phase 1 · Purchase order creation and supplier confirmation stay on the same purchase record." width={1828} height={1080} />
          <CaseFigure caption="Phase 1 · Receiving starts from the purchase: ordered, delivered, and actual quantities stay linked, including partial arrivals.">
            <CaseButton variant="media" href="/img/def-erp/evidence/receiving-collapsed-4c751c3d1fd0.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Receiving workspace with purchase quantities, delivery notes, actual counts, and partial arrival progress."><Image src="/img/def-erp/evidence/receiving-collapsed-4c751c3d1fd0.webp" alt="Receiving workspace with purchase quantities, delivery notes, actual counts, and partial arrivals." width={3200} height={2000} sizes={imageSizes} unoptimized /></CaseButton>
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="04 / Why an Agent" title="After launch, buyers still wrote the order from their own heads.">
          <CaseProse><p>After launch, the records were better, but the slowest part had not moved. Buyers still worked out each quantity themselves.</p></CaseProse>
          <CasePullquote>Now I don&apos;t need to switch between Excel and the system anymore. But the part that takes the most time is still the same. I still have to decide what to buy and how much.</CasePullquote>
          <CaseProse><p>Procurement team, after Phase 1. What they adjusted for was information the system did not hold.</p></CaseProse>
          <CaseEvidenceCards label="What buyers adjusted for, and kept in memory" items={[
            { icon: <FileSearch />, title: 'Stockouts', body: 'Confirmations show shortages. The buyer remembers and orders around them.' },
            { icon: <ScanSearch />, title: 'Sales hidden by stockouts', body: 'Sales drop while an item is out, so they understate real demand.' },
            { icon: <History />, title: 'Seasonality', body: 'Some products sell differently across the year.' },
            { icon: <UserCheck />, title: 'Customer growth', body: 'More customers, or a different customer mix, changes future sales.' },
          ]} layout="pairs" />
          <CaseProse><p>This knowledge lived in messages and personal notes, and was gathered again for every order. The cost was cognitive, and that is what the Agent should reduce.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="05 / Agent design" title="The system should hold the signals. The buyer should hold the decision.">
          <CaseProse><p>The work is gathering and weighing evidence, which an Agent can do. But an order commits the business, so the Agent proposes and the buyer decides.</p></CaseProse>
          <CaseEvidenceCards label="Design principles for the Agent" items={[
            { icon: <Layers />, title: 'Capture signals where they appear', body: 'Stockouts, notes, and exceptions are recorded on the purchase, ready for next time.' },
            { icon: <Calculator />, title: 'Show the adjustment, not just the answer', body: 'Each line lists its demand signals: stockout recovery, seasonality, customer mix, buyer notes.' },
            { icon: <ShieldCheck />, title: 'Let people correct it', body: 'The plan is an editable table. Changes are reviewed before they shape the next plan.' },
          ]} />
          <CaseProse>
            <p>Suppliers behave differently, so each one gets its own long-term memory, built from every purchase:</p>
            <ul>
              <li><strong>Recommendations</strong> and what the buyer changed.</li>
              <li><strong>Confirmations</strong> and shortages.</li>
              <li><strong>Arrivals</strong> and variances.</li>
              <li><strong>Notes</strong> written along the way.</li>
            </ul>
            <p>Each supplier’s forecast is designed to improve with every purchase; accuracy has not been measured yet. The buyer reviews what to keep and makes the final decision.</p>
          </CaseProse>
          <CaseFigure caption="The learning loop, per supplier · Solid arrows follow a purchase from confirmation to review. Dashed arrows write each piece of evidence to that supplier’s memory. Scroll horizontally on smaller screens.">
            <AgentMemoryLoop />
          </CaseFigure>
          <CaseProse><p>I split the work so every number can be checked.</p></CaseProse>
          <CaseEvidenceCards label="Division of responsibility in the AI workflow" items={[
            { icon: <Bot />, title: 'Model · interpret', body: 'Read the request and supplier documents. Explain the plan and any differences.' },
            { icon: <Calculator />, title: 'Engine · calculate', body: 'Use sales, coverage, stock, inbound, and lead time, adjusted for demand signals.' },
            { icon: <UserCheck />, title: 'Buyer · decide', body: 'Edit the plan, resolve exceptions, and place the supplier order.' },
          ]} />
          <CaseProse><p>One plan brings every input together, and the reasons appear on demand.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="06 / The experience" title="A clear next action, from replenishment to receipt.">
          <CaseProse><p>The purchase list coordinates purchases. Each order keeps its own evidence, rules, activity, and conversation.</p></CaseProse>
          <CaseDemoPreview src={PROCUREMENT_AGENT_DEMO_URL} title="Procurement Agent" />
          <CaseProse>
            <h3>01 · Surface an opportunity before the buyer asks</h3>
            <ul>
              <li><strong>Replenishment cards:</strong> when to order, estimated goods, and sales coverage.</li>
              <li><strong>Create purchase order:</strong> carries the supplier and coverage into a draft.</li>
              <li><strong>Notifications:</strong> hold confirmation and delivery changes, apart from task progress.</li>
            </ul>
          </CaseProse>
          <CaseFigure caption="Before the task · The list coordinates purchases; supplier cards explain the opportunity and offer one direct action.">
            <CaseButton variant="media" href="/img/procurement-agent/evidence/workspace-collapsed-7bec9bbcba63.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Purchase list beside supplier replenishment cards showing order timing, estimated goods, sales coverage, and Create purchase order."><Image src="/img/procurement-agent/evidence/workspace-collapsed-7bec9bbcba63.webp" alt="Purchase list beside supplier replenishment cards showing order timing, estimated goods, sales coverage, and Create purchase order." width={3200} height={2000} sizes={imageSizes} unoptimized /></CaseButton>
          </CaseFigure>
          <CaseProse>
            <h3>02 · Keep the familiar table at the center</h3>
            <ul>
              <li><strong>Edit in place:</strong> quantities and prices change directly in the table.</li>
              <li><strong>Why:</strong> explains each row’s recommendation.</li>
              <li><strong>Evidence:</strong> summarizes the data consulted.</li>
              <li><strong>Supply rules:</strong> keeps lasting supplier terms apart from this order.</li>
            </ul>
          </CaseProse>
          <CaseFigure caption="Context on demand · Supplier terms have a stable place beside the order; row-level explanations stay with the recommendation.">
            <CaseButton variant="media" href="/img/procurement-agent/evidence/recommendation-collapsed-18cfd5607b0c.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Editable purchase table with the Supply rules panel showing MNP supplier information and commercial terms."><Image src="/img/procurement-agent/evidence/recommendation-collapsed-18cfd5607b0c.webp" alt="Editable purchase table with the Supply rules panel showing MNP supplier information and commercial terms." width={3200} height={2000} sizes={imageSizes} unoptimized /></CaseButton>
          </CaseFigure>
          <CaseProse>
            <h3>03 · Put human judgment at the commercial boundary</h3>
            <ul>
              <li><strong>Focused exceptions:</strong> missing items, quantity changes, and price changes, each linked to its SKU.</li>
              <li><strong>Buyer chooses:</strong> how to approve.</li>
              <li><strong>Approval is not ordering:</strong> recording the supplier order is a separate step.</li>
            </ul>
          </CaseProse>
          <CaseFigure caption="Focused review · Normal rows remain readable while each type of discrepancy has a clear example and next step.">
            <CaseButton variant="media" href="/img/procurement-agent/evidence/confirmation-collapsed-5212486d5c47.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Supplier confirmation with one missing-item, quantity, and price exception highlighted beside a structured Agent comparison."><Image src="/img/procurement-agent/evidence/confirmation-collapsed-5212486d5c47.webp" alt="Supplier confirmation with one missing-item, quantity, and price exception highlighted beside a structured Agent comparison." width={3200} height={2000} sizes={imageSizes} unoptimized /></CaseButton>
          </CaseFigure>
          <CaseFigure caption="Human handoff · The buyer chooses an approval path before recording the supplier commitment.">
            <CaseButton variant="media" href="/img/procurement-agent/evidence/handoff-collapsed-682e9155166f.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Approval dialog offering direct buyer approval or escalation to the owner, with supplier ordering kept separate."><Image src="/img/procurement-agent/evidence/handoff-collapsed-682e9155166f.webp" alt="Approval dialog offering direct buyer approval or escalation to the owner, with supplier ordering kept separate." width={3200} height={2000} sizes={imageSizes} unoptimized /></CaseButton>
          </CaseFigure>
          <CaseProse>
            <h3>04 · Make a change reversible without restarting</h3>
            <ul>
              <li><strong>Activity log:</strong> combines business events and draft history.</li>
              <li><strong>Autosaves:</strong> group continuous edits into checkpoints.</li>
              <li><strong>Apply version:</strong> previews a snapshot, then explicitly restores it; the previous state stays in history.</li>
            </ul>
          </CaseProse>
          <CaseFigure caption="Recovery · Preview a previous plan, compare it in place, and explicitly apply it before continuing.">
            <CaseButton variant="media" href="/img/procurement-agent/evidence/history-collapsed-2d7ccf31901b.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Activity log beside a read-only historical draft preview with Back to current and Apply version actions."><Image src="/img/procurement-agent/evidence/history-collapsed-2d7ccf31901b.webp" alt="Activity log beside a read-only historical draft preview with Back to current and Apply version actions." width={3200} height={2000} sizes={imageSizes} unoptimized /></CaseButton>
          </CaseFigure>
          <CaseProse>
            <h3>05 · Reconcile reality before learning from it</h3>
            <ul>
              <li><strong>Distinct counts:</strong> order, DDT, and actual stay separate across partial deliveries.</li>
              <li><strong>Resolve first:</strong> the buyer settles missing and unexpected goods before closing.</li>
              <li><strong>Reviewed learning:</strong> prompts revisit demand, arrival timing, and SKU variance, without silently rewriting supplier rules.</li>
            </ul>
          </CaseProse>
          <CaseFigure caption="Receiving · The buyer checks actual goods against the linked documents and explicitly resolves open quantities.">
            <CaseButton variant="media" href="/img/procurement-agent/evidence/receiving-collapsed-a31e34c8c6f9.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Receiving table comparing order, delivery note, and actual quantities with focused shipment exceptions."><Image src="/img/procurement-agent/evidence/receiving-collapsed-a31e34c8c6f9.webp" alt="Receiving table comparing order, delivery note, and actual quantities with focused shipment exceptions." width={3200} height={2000} sizes={imageSizes} unoptimized /></CaseButton>
          </CaseFigure>
          <CaseEvidenceCards label="Boundaries that make the experience coherent" items={[
            { icon: <FileSearch />, title: 'One purchase context', body: 'Conversation, documents, evidence, and activity stay with the same order.' },
            { icon: <ClipboardCheck />, title: 'Distinct responsibilities', body: 'The Agent prepares and explains; the buyer edits, approves, orders, and receives.' },
            { icon: <History />, title: 'Reviewed continuity', body: 'Autosaves support recovery; order notes and supplier terms keep separate scopes.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="07 / Design an AI agent" title="12 clear steps and 6 topics shape every handoff.">
          <CaseProse><p>The 12 steps follow a purchase before, during, and after a task, then over time. Six topics check safety, coordination, language, documents, resources, and quality throughout.</p></CaseProse>
          <ProcurementExperienceMap />
        </CaseChapter>

        <CaseChapter label="08 / Validation" title="A prepared order looked like a placed order.">
          <CaseProse><p>Testers read a prepared order as a placed order. I checked understanding, lifecycle continuity, and exceptions with the coded prototype and real procurement records.</p></CaseProse>
          <CaseEvidenceCards label="What I checked in the coded prototype" items={[
            { icon: <Calculator />, title: 'Reproduce the quantity', body: 'Check the recommendation against the same sales, stock, inbound, and supplier inputs.' },
            { icon: <FileSearch />, title: 'Keep differences visible', body: 'Follow confirmation and receiving exceptions across the purchase lifecycle.' },
            { icon: <UserCheck />, title: 'Clarify the commitment', body: 'Make the buyer’s external ordering step explicit after testers misread the draft.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="09 / Results" title="A purchase plan in about 2 minutes, down from 30 minutes to 2 hours.">
          <CaseStats items={[
            { value: '~2 min', label: 'To prepare a purchase plan, down from 30 minutes to 2 hours across suppliers' },
            { value: '3', label: 'Staff members using the Agent daily' },
          ]} />
          <CaseProse><p>The Agent is in production and used by procurement. It drafts quantities; the buyer keeps the supplier commitment.</p></CaseProse>
          <CaseEvidenceCards label="Delivery status and measurement boundaries" items={[
            { icon: <PackageCheck />, title: 'In use', body: 'Connected purchasing records and an Agent-assisted quantity plan.' },
            { icon: <ShieldCheck />, title: 'Human authority', body: 'Buyers edit, approve, place the order, and confirm learning.' },
            { icon: <ScanSearch />, title: 'Not yet measured', body: 'Recommendation acceptance and correct escalation rates.' },
          ]} />
          <CaseProse><p>Planning time is the measured result. Recommendation acceptance and whether the Agent stops at the right approval boundary are still to be measured.</p></CaseProse>
        </CaseChapter>

        <CaseClose label="10 / Reflection" title="My contribution was designing the conditions for delegation.">
          <CaseProse><p>I moved from connecting purchase records to defining what the Agent can infer, calculate, propose, and hand back.</p><p>Next, I would measure buyer edits, recommendation acceptance, and whether the Agent stops at the right approval boundary.</p></CaseProse>
        </CaseClose>
      </CaseKitSections>
    </CaseKitPage>
  );
}
