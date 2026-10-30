import type { Metadata } from 'next';
import Image from 'next/image';
import { Bot, Calculator, ClipboardCheck, FileSearch, History, Layers, MessageSquare, PackageCheck, ScanSearch, ShieldCheck, UserCheck, Workflow } from 'lucide-react';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import { CaseKitControls as CaseStudyControls } from '../../components/CaseStudyControls';
import { CaseButton } from '../../components/case-kit/CaseButton';
import { CaseChapter, CaseClose, CaseEvidenceCards, CaseFigure, CaseHero, CaseKitPage, CaseKitSections, CaseProse, CasePullquote, CaseVideo } from '../../components/case-kit/CaseKit';
import ProcurementExperienceMap from './ProcurementExperienceMap';
import CaseDemoPreview from '../../components/case-kit/CaseDemoPreview';
import { PROCUREMENT_AGENT_DEMO_URL } from '@/lib/demoUrls';

export const metadata: Metadata = {
  title: 'Designing an AI Procurement Agent | Mei Chai',
  description: 'How I turned fragmented purchasing records into an editable AI recommendation, with explicit human handoffs and reviewed learning. In production at DEF Beauty Supply.',
};

const navLabels = ['01 / My role', '02 / Research', '03 / The foundation', '04 / Agent strategy', '05 / The experience', '06 / Validation', '07 / Results', '08 / Reflection'];
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
          intro="I designed how AI helps buyers decide what to buy and how much—from a first recommendation to receiving the goods."
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
            { label: 'The challenge', body: 'Buyers rebuilt a purchasing decision from spreadsheets, supplier messages, and memory.' },
            { label: 'My approach', body: 'Connect the evidence. Draft one editable plan. Make every handoff explicit.' },
            { label: 'The outcome', body: 'A live procurement workspace. AI prepares the recommendation; the buyer commits the order.' },
          ] }}
        />

        <CaseChapter label="01 / My role" title="I designed the work AI takes on—and the decisions people keep.">
          <CaseProse><p>DEF Beauty Supply is an Italian B2B beauty wholesaler. I owned research, workflow and AI interaction design, and implementation, working with procurement, operations, and the business.</p></CaseProse>
          <CaseFigure caption="The purchase workspace keeps an editable plan, its supporting evidence, and the Agent together.">
            <CaseButton variant="media" href="/img/procurement-agent/evidence/plan-collapsed-954c8bfe994e.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Procurement workspace with editable purchase quantities, stock and sales alongside the Agent’s draft-ready message."><Image src="/img/procurement-agent/evidence/plan-collapsed-954c8bfe994e.webp" alt="Procurement workspace with editable purchase quantities, stock and sales alongside the Agent’s draft-ready message." width={3200} height={2000} sizes={imageSizes} unoptimized /></CaseButton>
          </CaseFigure>
          <CaseEvidenceCards label="My responsibilities and design deliverables" items={[
            { icon: <ScanSearch />, title: 'Frame the real task', body: 'Map how buyers estimate, confirm, and receive a purchase.' },
            { icon: <Workflow />, title: 'Define Agent behavior', body: 'Specify context, recommendations, exceptions, and human authority.' },
            { icon: <Layers />, title: 'Make it testable', body: 'Build the workspace and refine its handoffs with testers.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="02 / Research" title="Buyers rebuilt every purchasing decision by hand.">
          <CaseProse><p>I traced the purchase with procurement. The problem was assembling a quantity from scattered evidence; each decision tied up cash and changed stockout risk.</p></CaseProse>
          <CaseEvidenceCards label="The old purchasing workflow" items={[
            { icon: <Calculator />, title: 'Estimate in Excel', body: 'Download sales and stock; calculate the quantity outside the system.' },
            { icon: <MessageSquare />, title: 'Confirm in messages', body: 'Supplier changes stay in WhatsApp or email, away from the purchase.' },
            { icon: <PackageCheck />, title: 'Re-enter at receiving', body: 'Search each SKU to stock in; lose the link to the original intent.' },
          ]} />
          <CaseProse><p>One example: three months of sales were available, but stockout history stayed in the buyer&apos;s memory. The challenge was bringing all the evidence into a purchasing decision.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="03 / The foundation" title="First, give every purchase a traceable lifecycle.">
          <CaseProse><p>I connected the purchase order, supplier confirmation, delivery note (DDT), and receiving record. Phase 1 made document differences visible; it did not recommend a quantity.</p></CaseProse>
          <CaseVideo src="/videos/def-erp/purchase-order.mp4" poster="/videos/def-erp/purchase-order.webp" label="Phase 1 purchase order workflow" caption="Phase 1 · Purchase order creation and supplier confirmation stay on the same purchase record." width={1828} height={1080} />
          <CaseFigure caption="Phase 1 · Receiving starts from the purchase: ordered, delivered, and actual quantities stay linked, including partial arrivals.">
            <CaseButton variant="media" href="/img/def-erp/evidence/receiving-collapsed-4c751c3d1fd0.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Receiving workspace with purchase quantities, delivery notes, actual counts, and partial arrival progress."><Image src="/img/def-erp/evidence/receiving-collapsed-4c751c3d1fd0.webp" alt="Receiving workspace with purchase quantities, delivery notes, actual counts, and partial arrival progress." width={3200} height={2000} sizes={imageSizes} unoptimized /></CaseButton>
          </CaseFigure>
          <CasePullquote>Now I don&apos;t need to switch between Excel and the system anymore. But the part that takes the most time is still the same. I still have to decide what to buy and how much.</CasePullquote>
          <CaseProse><p>Procurement team, after Phase 1. Connecting the records had not removed the quantity judgment.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="04 / Agent strategy" title="The model interprets. The engine calculates. The buyer decides.">
          <CaseProse><p>I used information architecture to bring the decision inputs into one plan, and progressive disclosure to offer one editable recommendation. The Agent needed to carry context across the purchase, beyond isolated document checks.</p></CaseProse>
          <CaseEvidenceCards label="Division of responsibility in the AI workflow" items={[
            { icon: <Bot />, title: 'Model · interpret', body: 'Understand the request and explain the recommendation and document differences.' },
            { icon: <Calculator />, title: 'Engine · calculate', body: 'Use sales velocity, coverage, stock, inbound, and lead time for reproducible quantities.' },
            { icon: <UserCheck />, title: 'Buyer · decide', body: 'Edit the plan, resolve exceptions, and place the formal supplier order.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="05 / The experience" title="A clear next action, from replenishment to receipt.">
          <CaseProse><p>I organized the experience around 12 steps and six cross-cutting themes. The purchase list coordinates opportunities and tasks; each order keeps its own evidence, supplier rules, activity, and conversation.</p></CaseProse>
          <CaseDemoPreview src={PROCUREMENT_AGENT_DEMO_URL} title="Procurement Agent" />
          <CaseProse><h3>01 · Surface an opportunity before the buyer asks</h3><p>Suppliers to replenish shows when to order, estimated goods, sales coverage, and commercial thresholds. Why this supplier? gives a concise business explanation. Create purchase order carries the calculated supplier and coverage straight into a draft, without asking the buyer to enter them again.</p><p>Once created, the opportunity moves into the purchase list. Drafts show Order now or an Order by date; confirmation and delivery changes stay in Notifications, separate from task progress.</p></CaseProse>
          <CaseFigure caption="Before the task · The list coordinates purchases; supplier cards explain the opportunity and offer one direct action.">
            <CaseButton variant="media" href="/img/procurement-agent/evidence/workspace-collapsed-7bec9bbcba63.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Purchase list beside supplier replenishment cards showing order timing, estimated goods, sales coverage, and Create purchase order."><Image src="/img/procurement-agent/evidence/workspace-collapsed-7bec9bbcba63.webp" alt="Purchase list beside supplier replenishment cards showing order timing, estimated goods, sales coverage, and Create purchase order." width={3200} height={2000} sizes={imageSizes} unoptimized /></CaseButton>
          </CaseFigure>
          <CaseProse><h3>02 · Keep the familiar table at the center</h3><p>A guided empty state becomes a loading canvas when a request starts, then the editable plan appears in the same place. The Agent shows progress; Send becomes Pause while work is running.</p><p>Buyers adjust quantities and prices directly in the table, search for a product, and inspect a row’s Why. Evidence summarizes the data consulted. Supply rules holds lasting supplier terms, without mixing them with this order’s outcome.</p></CaseProse>
          <CaseFigure caption="Context on demand · Supplier terms have a stable place beside the order; row-level explanations stay with the recommendation.">
            <CaseButton variant="media" href="/img/procurement-agent/evidence/recommendation-collapsed-18cfd5607b0c.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Editable purchase table with the Supply rules panel showing MNP supplier information and commercial terms."><Image src="/img/procurement-agent/evidence/recommendation-collapsed-18cfd5607b0c.webp" alt="Editable purchase table with the Supply rules panel showing MNP supplier information and commercial terms." width={3200} height={2000} sizes={imageSizes} unoptimized /></CaseButton>
          </CaseFigure>
          <CaseProse><h3>03 · Put human judgment at the commercial boundary</h3><p>The confirmation result separates missing items, quantity changes, and price changes. Each exception remains linked to its affected SKU. Status, facts, and next step replace long narrative replies.</p><p>The buyer decides how to approve. Approval does not place an order with the supplier; recording an external order and confirming a receipt are separate commitments.</p></CaseProse>
          <CaseFigure caption="Focused review · Normal rows remain readable while each type of discrepancy has a clear example and next step.">
            <CaseButton variant="media" href="/img/procurement-agent/evidence/confirmation-collapsed-5212486d5c47.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Supplier confirmation with one missing-item, quantity, and price exception highlighted beside a structured Agent comparison."><Image src="/img/procurement-agent/evidence/confirmation-collapsed-5212486d5c47.webp" alt="Supplier confirmation with one missing-item, quantity, and price exception highlighted beside a structured Agent comparison." width={3200} height={2000} sizes={imageSizes} unoptimized /></CaseButton>
          </CaseFigure>
          <CaseFigure caption="Human handoff · The buyer chooses an approval path before recording the supplier commitment.">
            <CaseButton variant="media" href="/img/procurement-agent/evidence/handoff-collapsed-682e9155166f.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Approval dialog offering direct buyer approval or escalation to the owner, with supplier ordering kept separate."><Image src="/img/procurement-agent/evidence/handoff-collapsed-682e9155166f.webp" alt="Approval dialog offering direct buyer approval or escalation to the owner, with supplier ordering kept separate." width={3200} height={2000} sizes={imageSizes} unoptimized /></CaseButton>
          </CaseFigure>
          <CaseProse><h3>04 · Make a change reversible without restarting</h3><p>Activity log brings business events and draft history together. Current draft stays at the top. Continuous edits become grouped autosaves; the initial plan, exported request, and checked confirmation remain meaningful checkpoints.</p><p>Selecting a snapshot previews it in the central table. Apply version explicitly restores a compatible draft, while the previous state remains in history. This keeps recovery inside the same workspace.</p></CaseProse>
          <CaseFigure caption="Recovery · Preview a previous plan, compare it in place, and explicitly apply it before continuing.">
            <CaseButton variant="media" href="/img/procurement-agent/evidence/history-collapsed-2d7ccf31901b.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Activity log beside a read-only historical draft preview with Back to current and Apply version actions."><Image src="/img/procurement-agent/evidence/history-collapsed-2d7ccf31901b.webp" alt="Activity log beside a read-only historical draft preview with Back to current and Apply version actions." width={3200} height={2000} sizes={imageSizes} unoptimized /></CaseButton>
          </CaseFigure>
          <CaseProse><h3>05 · Reconcile reality before learning from it</h3><p>Order, DDT, and actual counts stay distinct across partial deliveries. The buyer resolves missing goods and unexpected items before closing receiving.</p><p>Order notes retain this purchase’s context. Structured review prompts revisit demand, arrival timing, and SKU variance; reviewed learning can inform the next plan without silently rewriting supplier rules.</p></CaseProse>
          <CaseFigure caption="Receiving · The buyer checks actual goods against the linked documents and explicitly resolves open quantities.">
            <CaseButton variant="media" href="/img/procurement-agent/evidence/receiving-collapsed-a31e34c8c6f9.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Receiving table comparing order, delivery note, and actual quantities with focused shipment exceptions."><Image src="/img/procurement-agent/evidence/receiving-collapsed-a31e34c8c6f9.webp" alt="Receiving table comparing order, delivery note, and actual quantities with focused shipment exceptions." width={3200} height={2000} sizes={imageSizes} unoptimized /></CaseButton>
          </CaseFigure>
          <CaseEvidenceCards label="Boundaries that make the experience coherent" items={[
            { icon: <FileSearch />, title: 'One purchase context', body: 'Conversation, documents, evidence, and activity stay with the same order.' },
            { icon: <ClipboardCheck />, title: 'Distinct responsibilities', body: 'The Agent prepares and explains; the buyer edits, approves, orders, and receives.' },
            { icon: <History />, title: 'Reviewed continuity', body: 'Autosaves support recovery; order notes and supplier terms keep separate scopes.' },
          ]} />
          <CaseProse><h3>The design behind each handoff</h3><p>The 12 steps follow a purchase before, during, and after a task, then over time. The six themes check safety, coordination, language, documents and devices, resources, and experience quality across that journey. Each card keeps the project’s real interface above its user need, design decision, and Goal.</p></CaseProse>
          <ProcurementExperienceMap />
        </CaseChapter>

        <CaseChapter label="06 / Validation" title="A prepared order looked like a placed order.">
          <CaseProse><p>Testers read a prepared order as a completed supplier commitment. I used the coded prototype and real procurement records to check understanding, lifecycle continuity, and exception handling.</p></CaseProse>
          <CaseEvidenceCards label="What I checked in the coded prototype" items={[
            { icon: <Calculator />, title: 'Reproduce the quantity', body: 'Check the recommendation against the same sales, stock, inbound, and supplier inputs.' },
            { icon: <FileSearch />, title: 'Keep differences visible', body: 'Follow confirmation and receiving exceptions across the purchase lifecycle.' },
            { icon: <UserCheck />, title: 'Clarify the commitment', body: 'Make the buyer’s external ordering step explicit after testers misread the draft.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="07 / Results" title="Live with procurement. Impact still needs measurement.">
          <CaseProse><p>The Agent is in production and procurement staff are using it. It drafts quantities in the purchasing workspace; the buyer retains the formal supplier commitment.</p></CaseProse>
          <CaseEvidenceCards label="Delivery status and measurement boundaries" items={[
            { icon: <PackageCheck />, title: 'In use', body: 'Connected purchasing records and an Agent-assisted quantity plan.' },
            { icon: <ShieldCheck />, title: 'Human authority', body: 'Buyers edit, approve, place the order, and confirm learning.' },
            { icon: <ScanSearch />, title: 'Not yet measured', body: 'Planning time, recommendation acceptance, and correct escalation rates.' },
          ]} />
          <CaseProse><p>The evidence here is the delivered workflow and qualitative feedback. Usage coverage, observation period, and a before/after performance baseline have not been documented for this case.</p></CaseProse>
        </CaseChapter>

        <CaseClose label="08 / Reflection" title="My contribution was designing the conditions for delegation.">
          <CaseProse><p>I moved from connecting purchase records to defining what the Agent can infer, calculate, propose, and hand back. Context, editable recommendations, and explicit authority made that collaboration concrete.</p><p>Next, I would measure planning time and buyer edits alongside whether the Agent stops at the right approval boundary.</p></CaseProse>
        </CaseClose>
      </CaseKitSections>
    </CaseKitPage>
  );
}
