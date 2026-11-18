import type { Metadata } from 'next';
import Image from 'next/image';
import { Bot, Calculator, ClipboardCheck, FileSearch, History, Layers, MessageSquare, PackageCheck, ScanSearch, ShieldCheck, UserCheck, Workflow } from 'lucide-react';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import { CaseKitControls as CaseStudyControls } from '../../components/CaseStudyControls';
import { CaseButton } from '../../components/case-kit/CaseButton';
import { CaseChapter, CaseClose, CaseEvidenceCards, CaseEvidenceThumbs, CaseFigure, CaseHero, CaseKitPage, CaseKitSections, CaseProse, CasePullquote, CaseStats } from '../../components/case-kit/CaseKit';
import ProcurementExperienceMap from './ProcurementExperienceMap';
import { PurchasingLiveDemo } from '../def-erp-kit/ErpLiveDemo';
import { AgentMemoryLoop, ConnectedProcurementFlow, LegacyProcurementFlow } from './ProcurementFlowDiagrams';
import { DecisionCards, ReversalList, type Decision, type Reversal } from './DecisionCards';
import AgentLiveDemo, { AgentEvaluationLiveDemo } from './AgentLiveDemo';
import { EvaluationLoop, PlanScoreBuild, SupplierAccuracyChart } from './EvaluationDiagrams';
import { PROCUREMENT_AGENT_ERP_URL } from '@/lib/demoUrls';

export const metadata: Metadata = {
  title: 'Designing an AI Procurement Agent | Mei Chai',
  description: 'How I turned fragmented purchasing records into an editable AI recommendation, then designed how its accuracy is measured, supplier by supplier. In production at DEF Beauty Supply.',
};

const navLabels = ['01 / My role', '02 / The problem', '03 / Phase 1', '04 / Why an Agent', '05 / Agent design', '06 / Key decisions', '07 / The experience', '08 / Measuring accuracy', '09 / Iterations', '10 / Design an AI agent', '11 / Results', '12 / Reflection'];
const imageSizes = '(min-width: 1408px) 1120px, (min-width: 1280px) calc(100vw - 288px), calc(100vw - 48px)';

// Sourced from the DEF project decision log (DEC-xxx) and interview records (INT-xxx).
const decisions: Decision[] = [
  {
    question: 'Where does the Agent live in the ERP?',
    source: 'DEC-001 · DEC-012',
    options: [
      { label: 'Add more filters and fields to the purchase page', verdict: 'Every season and supplier needs a different data window. A fixed page just keeps growing.' },
      { label: 'Fixed wizards per scenario', verdict: 'Fine for known cases, but it cannot cover every supplier and season combination.' },
      { label: 'Workbench plus a persistent Agent panel', verdict: 'The table stays the source of truth. Chat starts tasks, asks, explains, and repairs. Results always land in the workbench, never only in chat.', chosen: true },
      { label: 'Chat only', verdict: 'Wide tables, discrepancies, and approvals are hard to audit inside a conversation.' },
    ],
    evidence: 'The buyer lead said one page could not hold that many situations. In prototype review, Chat that only explained had little value, so it became the way to start a purchase.',
    tradeoff: 'A dynamic experience is harder to test than a fixed form. The Agent’s plan and current step have to stay visible.',
  },
  {
    question: 'How many recommendations should the Agent show?',
    source: 'DEC-014 → DEC-026',
    options: [
      { label: 'Three scenarios: least risk, balanced, opportunity', verdict: 'I chose this first, to expose the trade-offs. The buyer wanted a quick check, not a menu.', reversed: true },
      { label: 'Unlimited generated scenarios', verdict: 'Too much choice. Nothing to compare against.' },
      { label: 'One best plan, editable line by line', verdict: 'Each row shows evidence, confidence, and the calculation. High-impact conditions go to approval, not into extra scenarios.', chosen: true },
    ],
    evidence: 'Prototype feedback: replenishment needs one best plan to review and edit quickly.',
    tradeoff: 'The Agent has to justify why this plan is best, and make overriding it effortless.',
  },
  {
    question: 'Who calculates the order quantity?',
    source: 'DEC-009 · DEC-046 · DEC-047',
    options: [
      { label: 'The LLM analyses and calculates', verdict: 'Cannot be reproduced or regression tested, and can invent stock or sales figures.' },
      { label: 'Fixed rules only, no Agent', verdict: 'Cannot read supplier emails, PDFs, or the buyer’s intent.' },
      { label: 'LLM interprets, a deterministic engine calculates', verdict: 'The model extracts supplier, coverage, and constraints. A tested function computes quantity. A graph makes “no calculation until required fields exist” a control-flow rule, not a prompt.', chosen: true },
    ],
    evidence: 'Quantity moves cash and supplier commitments, so the same inputs must give the same number. A free-form tool-calling loop was ruled out for the first version.',
    tradeoff: 'Lower confidence at first. Seasonality and customer mix are not in the data, so they show as data gaps rather than being faked.',
  },
  {
    question: 'Who places the order?',
    source: 'DEC-002 · DEC-025',
    options: [
      { label: 'Suggest only, create nothing', verdict: 'Too little value. The buyer still builds the order alone.' },
      { label: 'Auto-order under a threshold', verdict: 'No accuracy or trust data yet to support it.' },
      { label: 'Full automation with audit after the fact', verdict: 'A real commercial commitment cannot be undone by an audit.' },
      { label: 'Agent drafts, buyer orders outside, platform records it', verdict: 'Recording “Order placed” requires the final confirmation attached. Ordering happens on WhatsApp or email, so the platform never sends it.', chosen: true },
    ],
    evidence: 'The buyer lead named automatic ordering as forbidden. A later review corrected a deeper point: the platform cannot order from suppliers at all.',
    tradeoff: 'One manual step stays. Testers read a prepared order as a placed one, so the UI keeps saying that approved is not ordered.',
  },
  {
    question: 'How should approval relate to ordering?',
    source: 'DEC-019 · DEC-035',
    options: [
      { label: 'Approve means order', verdict: 'Mixes accepting risk with executing a trade. A changed quote could slip through.' },
      { label: 'Owner approves the direction, not a version', verdict: 'A supplier can change price or quantity and still reuse the old approval.' },
      { label: 'Agent auto-approves small exceptions', verdict: 'Exceptions are the user’s own high-impact boundaries. The Agent should not waive them.' },
      { label: 'Approval bound to one quote version, separate from ordering', verdict: 'A change to price or quantity reopens approval. Escalation happens in place on the same order, only when a confirmation brings a real exception.', chosen: true },
    ],
    evidence: 'New suppliers, new products, large orders, and unstable prices need the owner. Normal orders do not.',
    tradeoff: 'An extra step after approval, and a quote-version mechanism to build and maintain.',
  },
  {
    question: 'How should receiving work?',
    source: 'DEC-017 · DEC-028',
    options: [
      { label: 'Keep entering each product by hand', verdict: 'The same duplicated search and typing, with the same errors.' },
      { label: 'Read the delivery note and stock in automatically', verdict: 'The DDT says what the supplier shipped, not what arrived.' },
      { label: 'Prefill from the DDT, record only differences', verdict: 'Order, DDT, counted, and accepted quantities stay separate. Counted goods do not automatically become stock.', chosen: true },
    ],
    evidence: 'My first model went from confirmation straight to receipt. An interview showed a DDT sits in between, and that data model could not tell input errors from real over-delivery.',
    tradeoff: 'Needs a dependable DDT-to-order link. Over-receipt takes an extra recount.',
  },
  {
    question: 'How does the Agent learn?',
    source: 'DEC-006 · DEC-020',
    options: [
      { label: 'Learn automatically from every order', verdict: 'Fast, but it follows noise, one-off events, and mistaken edits.' },
      { label: 'Static reports only', verdict: 'Safe, but feedback never changes the next plan.' },
      { label: 'The buyer writes supplier rules by hand', verdict: 'Good for clear policy. Poor at patterns, and generalizes from single cases.' },
      { label: 'Outcomes become candidates. Reviewed before they shape plans', verdict: 'Memory has four layers: facts, metrics, observations, and approved rules. One order only yields a candidate.', chosen: true },
    ],
    evidence: 'One result mixes Agent advice, human edits, supplier behavior, and season. Edits alone do not explain why something happened.',
    tradeoff: 'Slower to improve. With little data, the Agent has to say it does not know yet.',
  },
  {
    question: 'How do we know the plan was right?',
    source: 'Iteration 2',
    options: [
      { label: 'Acceptance rate: how often buyers keep the plan', verdict: 'Measures habit, not correctness. A busy buyer accepts a wrong plan.' },
      { label: 'One accuracy score for the whole Agent', verdict: 'Averages a supplier ordered every 3 weeks with one ordered every quarter. It hides where the plan fails.' },
      { label: 'Measure silently from sales, no review', verdict: 'Stock-outs, gifts, and one-off events need a person to read them. Unreviewed numbers learn noise.' },
      { label: 'Score each reviewed order, kept per supplier, with confidence', verdict: 'Planned vs needed gives the order’s accuracy. The buyer rates the order and names exceptions in words, which works for 10 products or 300. The supplier’s score weights the last 6 reviews, with confidence from how much data there is.', chosen: true },
    ],
    evidence: 'Results could show planning got faster, not whether the quantities were right. Suppliers also differ: MNP has 18 months of sales and orders every 3 weeks; Moroccanoil has 7 months and orders every 2.',
    tradeoff: 'Review becomes a step after receiving. It stays skippable, and a skipped order is simply not counted.',
  },
];

// What I got wrong, and what changed my mind.
const reversals: Reversal[] = [
  {
    before: 'Planning time as the result.',
    evidence: 'Faster plans did not prove better plans. Accuracy was “not yet measured”.',
    after: 'Every reviewed order is scored; each supplier keeps its own accuracy and confidence.',
    source: 'Iteration 2',
  },
  {
    before: 'Three scenarios, so the buyer sees the trade-offs.',
    evidence: 'Replenishment needs one best plan to check and edit fast.',
    after: 'One editable plan with evidence on every row.',
    source: 'DEC-014 → DEC-026',
  },
  {
    before: 'Receiving as confirmation to stock-in, with “entry error” as a reason.',
    evidence: 'A delivery note (DDT) sits between them, and real over-delivery was being mislabeled.',
    after: 'DDT as the baseline. Only differences are recorded.',
    source: 'ITER-001 · DEC-017',
  },
  {
    before: 'Chat that explains the page.',
    evidence: 'Buyers already knew what they wanted. Explanation added little.',
    after: 'Chat as the entry point to creating a purchase.',
    source: 'INT-021 · DEC-044',
  },
  {
    before: 'A separate approval flow for risky orders.',
    evidence: 'An order only turns risky after the confirmation arrives.',
    after: 'One order that escalates in place when a real exception appears.',
    source: 'DEC-035',
  },
  {
    before: 'Approve, then the platform places the order.',
    evidence: 'Ordering happens off-platform and creates a binding commitment.',
    after: 'Approval and ordering split. The platform only records the order.',
    source: 'INT-008 · DEC-025',
  },
];

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
          action={{ label: 'Explore the working demo', href: PROCUREMENT_AGENT_ERP_URL }}
          tags={['AI interaction design', 'Human–AI collaboration', 'Model evaluation', 'B2B procurement']}
          glance={{ items: [
            { label: 'The challenge', body: 'Purchasing was split across Excel, supplier messages, and delivery notes. Even after the ERP, stockouts, seasonality, and customer growth lived in the buyer’s memory.' },
            { label: 'My approach', body: 'Connect the purchase lifecycle first. Then let an Agent draft one editable plan, keep every handoff explicit, and score each plan against what was really needed.' },
            { label: 'The outcome', body: 'A purchase plan that took 30 minutes to 2 hours across suppliers now takes 5 to 10 minutes, and three staff members use it daily. AI prepares the recommendation; the buyer commits the order.' },
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
          <CaseProse><p>Excel for the quantity, chat for the supplier’s answer, paper for the delivery. Only the last one reached the system.</p></CaseProse>
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
        </CaseChapter>

        <CaseChapter label="03 / Phase 1" title="First, I brought the whole purchase into the ERP.">
          <CaseProse><p>Order, confirmation, DDT and receiving became one record, with differences marked on it. It still did not suggest a quantity.</p></CaseProse>
          <CaseFigure caption="Phase 1 · The same three moments, now on one purchase record. The quantity judgment at the start is still manual. Scroll horizontally on smaller screens.">
            <ConnectedProcurementFlow />
          </CaseFigure>
          <PurchasingLiveDemo />
        </CaseChapter>

        <CaseChapter label="04 / Why an Agent" title="After launch, buyers still wrote the order from their own heads.">
          <CasePullquote>Now I don&apos;t need to switch between Excel and the system anymore. But the part that takes the most time is still the same. I still have to decide what to buy and how much.</CasePullquote>
          <CaseProse><p>Procurement team, after Phase 1. They adjusted for four things the system did not hold:</p></CaseProse>
          <CaseEvidenceCards label="What buyers adjusted for, and kept in memory" items={[
            { icon: <FileSearch />, title: 'Stockouts', body: 'Confirmations show shortages. The buyer remembers and orders around them.' },
            { icon: <ScanSearch />, title: 'Sales hidden by stockouts', body: 'Sales drop while an item is out, so they understate real demand.' },
            { icon: <History />, title: 'Seasonality', body: 'Some products sell differently across the year.' },
            { icon: <UserCheck />, title: 'Customer growth', body: 'More customers, or a different customer mix, changes future sales.' },
          ]} layout="pairs" />
        </CaseChapter>

        <CaseChapter label="05 / Agent design" title="The system should hold the signals. The buyer should hold the decision.">
          <CaseProse><p>The work is gathering and weighing evidence, which an Agent can do. But an order commits the business, so the Agent proposes and the buyer decides.</p></CaseProse>
          <CaseEvidenceCards label="Design principles for the Agent" items={[
            { icon: <Layers />, title: 'Capture signals where they appear', body: 'Stockouts, notes, and exceptions are recorded on the purchase, ready for next time.' },
            { icon: <ClipboardCheck />, title: 'Reduce the decision, and show the work', body: 'One recommendation, not a menu. Each line lists its demand signals: stockout recovery, seasonality, customer mix, buyer notes.' },
            { icon: <Calculator />, title: 'Calculate what must be reproducible', body: 'Quantity comes from a deterministic engine. The model interprets and explains, it does not invent numbers.' },
            { icon: <ShieldCheck />, title: 'Stop where commitment begins', body: 'The plan stays editable and reversible. The buyer places the order, and confirms what the Agent learns.' },
          ]} layout="pairs" />
          <CaseProse><p>Suppliers behave differently, so each keeps its own memory, changed only through the buyer’s review.</p></CaseProse>
          <CaseFigure caption="The learning loop, per supplier · Solid arrows follow a purchase from confirmation to review. Dashed arrows write each piece of evidence to that supplier’s memory. Scroll horizontally on smaller screens.">
            <AgentMemoryLoop />
          </CaseFigure>
          <CaseEvidenceCards label="Division of responsibility in the AI workflow" items={[
            { icon: <Bot />, title: 'Model · interpret', body: 'Read the request and supplier documents. Explain the plan and any differences.' },
            { icon: <Calculator />, title: 'Engine · calculate', body: 'Use sales, coverage, stock, inbound, and lead time, adjusted for demand signals.' },
            { icon: <UserCheck />, title: 'Buyer · decide', body: 'Edit the plan, resolve exceptions, and place the supplier order.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="06 / Key decisions" title="Eight decisions, and what I rejected for each.">
          <CaseStats items={[
            { value: '73', label: 'Decision records, each with the options weighed' },
            { value: '47', label: 'Interview and feedback records' },
            { value: '60', label: 'Documented design iterations' },
          ]} />
          <DecisionCards items={decisions} />
        </CaseChapter>

        <CaseChapter label="07 / The experience" title="A clear next action, from replenishment to receipt.">
          <CaseProse><p>The purchase list coordinates purchases. Each order keeps its own evidence, rules, activity, and conversation.</p></CaseProse>
          <AgentLiveDemo />
          <CaseEvidenceCards label="Boundaries that make the experience coherent" items={[
            { icon: <FileSearch />, title: 'One purchase context', body: 'Conversation, documents, evidence, and activity stay with the same order.' },
            { icon: <ClipboardCheck />, title: 'Distinct responsibilities', body: 'The Agent prepares and explains; the buyer edits, approves, orders, and receives.' },
            { icon: <History />, title: 'Reviewed continuity', body: 'Autosaves support recovery; order notes and supplier terms keep separate scopes.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="08 / Measuring accuracy" title="Faster was proven. Right was not. So every plan now gets a score.">
          <CaseProse><p>Results showed planning time, not whether the quantities were right, and the next step, automation, needs exactly that. Iteration 2 scores each plan against what was really needed, supplier by supplier.</p></CaseProse>
          <CaseFigure caption="The evaluation loop · A plan starts with an expected accuracy. The review after receiving measures the real one and updates that supplier’s track record. Scroll horizontally on smaller screens.">
            <EvaluationLoop />
          </CaseFigure>
          <CaseEvidenceCards label="Why the score is designed this way" items={[
            { icon: <Layers />, title: 'It belongs to the supplier', body: 'Order frequency and data history differ, so one global number would hide where plans fail.' },
            { icon: <History />, title: 'Review first, but skippable', body: 'A new plan asks for the last unreviewed order. Skipping is allowed; it just isn’t counted.' },
            { icon: <ShieldCheck />, title: 'A range, not a promise', body: 'Fewer reviewed orders widen the range from ±4 to ±12 points, so a thin score looks thin.' },
            { icon: <UserCheck />, title: 'The buyer adds what data can’t show', body: 'Three sliders rate the whole order. Quality and exceptions are named in plain words, not rated product by product.' },
          ]} layout="pairs" />
          <CaseFigure caption="Accuracy and confidence by supplier · Dot is the current score; the line is its likely range. Demonstration data.">
            <SupplierAccuracyChart />
          </CaseFigure>
          <CaseFigure caption="One plan’s score · It starts from the supplier’s track record and loses points only for named gaps in this plan’s data.">
            <PlanScoreBuild />
          </CaseFigure>
          <AgentEvaluationLiveDemo />
        </CaseChapter>

        <CaseChapter label="09 / Iterations" title="Six things I got wrong, and what changed my mind.">
          <ReversalList items={reversals} />
        </CaseChapter>

        <CaseChapter label="10 / Design an AI agent" title="Twelve steps and six themes shape every handoff.">
          <CaseProse><p>Twelve steps across a purchase, six themes across all of them. Try each card; every one is held to four goals: explainable, controllable, predictable, recoverable.</p></CaseProse>
          <ProcurementExperienceMap />
        </CaseChapter>

        <CaseChapter label="11 / Results" title="A purchase plan in 5 to 10 minutes, down from 30 minutes to 2 hours.">
          <CaseStats items={[
            { value: '5–10 min', label: 'To prepare a purchase plan, down from 30 minutes to 2 hours across suppliers' },
            { value: '3', label: 'Staff members using the Agent daily' },
          ]} />
          <CaseEvidenceCards label="What is in use, measured, and still open" items={[
            { icon: <PackageCheck />, title: 'In use', body: 'Connected purchasing records and an Agent-drafted plan the buyer edits and orders.' },
            { icon: <ScanSearch />, title: 'Now measurable', body: 'Iteration 2 scores plan accuracy per supplier from reviewed orders. Designed and prototyped in the ERP.' },
            { icon: <UserCheck />, title: 'Still open', body: 'Acceptance rate, and whether the Agent stops at the right approval boundary.' },
          ]} />
          <CaseProse><p>The biggest validation finding shaped the UI: testers read a prepared order as a placed one, so every screen now separates approved from ordered.</p></CaseProse>
        </CaseChapter>

        <CaseClose label="12 / Reflection" title="My contribution was designing the conditions for delegation.">
          <CaseProse>
            <p>I moved from connecting purchase records to defining what the Agent can infer, calculate, propose, and hand back.</p>
            <ul>
              <li><strong>Digitizing was not enough.</strong> Connected records did not reduce the thinking. The Agent had to join the decision.</li>
              <li><strong>Trust is designed, not assumed.</strong> Visible evidence, reversible edits, and a human commitment point made the recommendation usable.</li>
              <li><strong>Narrowing the role helped.</strong> Every iteration gave the Agent a more specific job and the buyer a clearer one.</li>
              <li><strong>Measure before you automate.</strong> A score per supplier turns “trust the Agent” into evidence that can be checked.</li>
            </ul>
            <p>Next: once a supplier’s score stays high with high confidence, it can decide where small orders are safe to automate, one supplier at a time.</p>
          </CaseProse>
        </CaseClose>
      </CaseKitSections>
    </CaseKitPage>
  );
}
