import type { Metadata } from 'next';
import Image from 'next/image';
import { Bot, Calculator, ClipboardCheck, FileSearch, History, Layers, MessageSquare, PackageCheck, ScanSearch, ShieldCheck, UserCheck, Workflow } from 'lucide-react';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import { CaseKitControls as CaseStudyControls } from '../../components/CaseStudyControls';
import { CaseButton } from '../../components/case-kit/CaseButton';
import { CaseChapter, CaseClose, CaseEvidenceCards, CaseFigure, CaseHero, CaseKitPage, CaseKitSections, CaseProse, CasePullquote, CaseVideo } from '../../components/case-kit/CaseKit';
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
          <CaseFigure caption="The experience I designed: purchase evidence and an editable plan beside the Agent. Captured from the portfolio demo; all displayed quantities and prices are demo data.">
            <CaseButton variant="media" href="/img/procurement-agent/evidence/plan.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Procurement workspace with editable purchase quantities, stock and sales alongside the Agent’s draft-ready message."><Image src="/img/procurement-agent/evidence/plan.webp" alt="Procurement workspace with editable purchase quantities, stock and sales alongside the Agent’s draft-ready message." width={1280} height={720} sizes={imageSizes} /></CaseButton>
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
            <CaseButton variant="media" href="/img/def-erp/receiving-workspace-current.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Receiving workspace with purchase quantities, delivery notes, actual counts, and partial arrival progress."><Image src="/img/def-erp/receiving-workspace-current.webp" alt="Receiving workspace with purchase quantities, delivery notes, actual counts, and partial arrival progress." width={3024} height={1897} sizes={imageSizes} /></CaseButton>
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

        <CaseChapter label="05 / The experience" title="One recommendation. Evidence on demand. Visible handoffs.">
          <CaseProse><p>I kept the purchase plan at the center. Conversation starts the task and explains its reasoning; the workspace holds the editable record.</p></CaseProse>
          <CaseProse><h3>01 · Start with a proposal, inspect its reasons</h3><p>I replaced three scenarios with one editable recommendation, so buyers review and adjust a plan instead of comparing another set of options.</p></CaseProse>
          <CaseFigure caption="Recommendation · “Why this order?” reveals supplier constraints beside the editable plan. Demo data illustrates the interaction, not business performance.">
            <CaseButton variant="media" href="/img/procurement-agent/evidence/recommendation.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Purchase plan beside an explanation of minimum order, shipping, discounts, lead time, and payment terms."><Image src="/img/procurement-agent/evidence/recommendation.webp" alt="Purchase plan beside an explanation of minimum order, shipping, discounts, lead time, and payment terms." width={1280} height={720} sizes={imageSizes} /></CaseButton>
          </CaseFigure>
          <CaseProse><h3>02 · New evidence changes the approval state</h3><p>I treated approval as an exception triggered by changed evidence. Quantity, price, and missing-line differences stay beside the affected SKU.</p></CaseProse>
          <CaseFigure caption="Exception handling · The confirmation exposes changed quantities, prices, and a missing SKU; the Agent identifies the approval trigger.">
            <CaseButton variant="media" href="/img/procurement-agent/evidence/confirmation.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Supplier confirmation differences highlighted in the purchase table, with an Agent explanation and an Approve action."><Image src="/img/procurement-agent/evidence/confirmation.webp" alt="Supplier confirmation differences highlighted in the purchase table, with an Agent explanation and an Approve action." width={1280} height={720} sizes={imageSizes} /></CaseButton>
          </CaseFigure>
          <CaseFigure caption="Human handoff · Approval and supplier ordering are separate actions. The choice explicitly states that neither approval path places the supplier order.">
            <CaseButton variant="media" href="/img/procurement-agent/evidence/handoff.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Choose approval path dialog offering direct buyer approval or escalation to the owner, explicitly saying neither places the supplier order."><Image src="/img/procurement-agent/evidence/handoff.webp" alt="Choose approval path dialog offering direct buyer approval or escalation to the owner, explicitly saying neither places the supplier order." width={1280} height={720} sizes={imageSizes} /></CaseButton>
          </CaseFigure>
          <CaseProse><h3>03 · Reconcile reality before learning from it</h3><p>I kept the order, DDT, and physical count distinct across partial deliveries. The buyer resolves differences; a learning candidate affects future calculations only after review.</p></CaseProse>
          <CaseFigure caption="Receiving · Short shipments, open quantities, and unexpected gifts remain visible. The buyer confirms actual receipt and resolves held goods.">
            <CaseButton variant="media" href="/img/procurement-agent/evidence/receiving.webp" target="_blank" rel="noreferrer" aria-label="Open full-size screenshot: Receiving workspace comparing order, delivery note and actual quantities, with short shipment and held gift exceptions."><Image src="/img/procurement-agent/evidence/receiving.webp" alt="Receiving workspace comparing order, delivery note and actual quantities, with short shipment and held gift exceptions." width={1280} height={720} sizes={imageSizes} /></CaseButton>
          </CaseFigure>
          <CaseEvidenceCards label="Learning review boundary" items={[
            { icon: <FileSearch />, title: 'Observe the difference', body: 'Buyer edits and receiving variance become evidence for review.' },
            { icon: <ClipboardCheck />, title: 'Review the candidate', body: 'The buyer accepts or dismisses the proposed learning update.' },
            { icon: <History />, title: 'Apply after confirmation', body: 'Only reviewed learning informs the next purchase calculation.' },
          ]} />
          <CaseButton variant="secondary" href={PROCUREMENT_AGENT_DEMO_URL} target="_blank" rel="noreferrer">Try the full workflow</CaseButton>
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
