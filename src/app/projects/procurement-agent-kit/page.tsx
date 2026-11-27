import type { Metadata } from 'next';
import Image from 'next/image';
import { Bot, Calculator, ClipboardCheck, FileSearch, History, Layers, MessageSquare, PackageCheck, ScanSearch, ShieldCheck, UserCheck, Workflow } from 'lucide-react';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/case-kit/CaseKitControls';
import { CaseButton } from '../../components/case-kit/CaseButton';
import { CaseChapter, CaseClose, CaseEvidenceCards, CaseEvidenceThumbs, CaseFigure, CaseHero, CaseKitPage, CaseKitSections, CaseProse, CasePullquote, CaseStats } from '../../components/case-kit/CaseKit';
import ProcurementExperienceMap from './ProcurementExperienceMap';
import { PurchasingLiveDemo } from '../def-erp-kit/ErpLiveDemo';
import { AgentMemoryLoopCompact, ConnectedProcurementFlow, HumanInTheLoopFlow, LegacyProcurementFlow } from './ProcurementFlowDiagrams';
import { DecisionCards, ReversalList, type Decision, type Reversal } from './DecisionCards';
import AgentLiveDemo, { AgentEvaluationLiveDemo } from './AgentLiveDemo';
import { DECISION_SHOTS } from './decisionShots';
import { ModelEngineFlow, OrderOutsideFlow } from './DecisionDiagrams';
import { EvaluationLoop, PlanScoreBuild, SupplierAccuracyChart } from './EvaluationDiagrams';
import { PROCUREMENT_AGENT_ERP_URL } from '@/lib/demoUrls';

export const metadata: Metadata = {
  title: 'Designing an AI Procurement Agent | Mei Chai',
  description: 'How I turned fragmented purchasing records into an editable AI recommendation, then designed how its accuracy is measured, supplier by supplier. In production at DEF Beauty Supply.',
};

const navLabels = ['01 / My role', '02 / The problem', '03 / Phase 1', '04 / Why an Agent', '05 / Agent design', '06 / Key decisions', '07 / The experience', '08 / Every handoff', '09 / Measuring accuracy', '10 / What I got wrong', '11 / Results', '12 / Reflection'];
const imageSizes = '(min-width: 1408px) 1120px, (min-width: 1280px) calc(100vw - 288px), calc(100vw - 48px)';

// Sourced from the DEF project decision log (DEC-xxx) and interview records (INT-xxx).
const decisions: Decision[] = [
  {
    question: 'Where does the Agent live in the ERP?',
    source: 'DEC-001 · DEC-012',
    options: [
      { label: 'More filters on the purchase page', verdict: 'Keeps growing with every case.' },
      { label: 'A wizard per scenario', verdict: 'Can’t cover every supplier and season.' },
      { label: 'Workbench with an Agent panel', verdict: 'The table stays the source of truth.', chosen: true },
      { label: 'Chat only', verdict: 'Wide tables are hard to audit in chat.' },
    ],
    evidence: 'One page couldn’t hold every situation.',
    tradeoff: 'Harder to test than a fixed form.',
    shot: { src: `/img/procurement-agent/decisions/d1-agent-beside-the-order.webp?v=${DECISION_SHOTS['d1-agent-beside-the-order'].v}`, ...DECISION_SHOTS['d1-agent-beside-the-order'], alt: 'Purchase order with the editable table on the left and the Procurement agent panel on the right.', caption: 'The order stays the source of truth; the Agent sits beside it.' },
  },
  {
    question: 'How many recommendations should the Agent show?',
    source: 'DEC-014 → DEC-026',
    options: [
      { label: 'Three scenarios to compare', verdict: 'Buyers wanted a quick check, not a menu.', reversed: true },
      { label: 'Unlimited scenarios', verdict: 'Too much choice.' },
      { label: 'One plan, editable per line', verdict: 'Each line shows its reasons.', chosen: true },
    ],
    evidence: 'Replenishment needs one plan to check fast.',
    tradeoff: 'The Agent must justify its one plan.',
    shot: { src: `/img/procurement-agent/decisions/d2-one-editable-plan.webp?v=${DECISION_SHOTS['d2-one-editable-plan'].v}`, ...DECISION_SHOTS['d2-one-editable-plan'], alt: 'Draft purchase table with editable quantities and a Why link on each line.', caption: 'One plan, editable in place, each line showing its sales and stock.' },
  },
  {
    question: 'Who calculates the order quantity?',
    source: 'DEC-009 · DEC-046',
    options: [
      { label: 'The LLM', verdict: 'Not reproducible; can invent numbers.' },
      { label: 'Fixed rules, no Agent', verdict: 'Can’t read supplier PDFs or intent.' },
      { label: 'LLM reads, an engine calculates', verdict: 'Same inputs, same number.', chosen: true },
    ],
    evidence: 'Quantity moves cash; it must be repeatable.',
    tradeoff: 'Gaps like seasonality show as gaps.',
    diagram: { node: <ModelEngineFlow />, caption: 'The model turns words into fields; a tested engine turns fields into the number.' },
  },
  {
    question: 'Who places the order?',
    source: 'DEC-002 · DEC-025',
    options: [
      { label: 'Suggest only', verdict: 'Too little value.' },
      { label: 'Auto-order under a threshold', verdict: 'No accuracy data to justify it.' },
      { label: 'Agent drafts, buyer orders outside', verdict: 'The platform only records it.', chosen: true },
    ],
    evidence: 'Ordering happens on WhatsApp or email.',
    tradeoff: 'One manual step stays.',
    diagram: { node: <OrderOutsideFlow />, caption: 'The commitment happens outside; the platform only records it, with the confirmation.' },
  },
  {
    question: 'How should approval relate to ordering?',
    source: 'DEC-019 · DEC-035',
    options: [
      { label: 'Approve means order', verdict: 'Mixes risk with execution.' },
      { label: 'Approve once, reuse it', verdict: 'A changed quote slips through.' },
      { label: 'Approve this confirmation only', verdict: 'A new price or quantity reopens it.', chosen: true },
    ],
    evidence: 'Only real exceptions need the owner.',
    tradeoff: 'An extra step after approval.',
    shot: { src: `/img/procurement-agent/decisions/d5-approval-path.webp?v=${DECISION_SHOTS['d5-approval-path'].v}`, ...DECISION_SHOTS['d5-approval-path'], alt: 'Approval dialog listing the approval checks and two paths: approve directly or push to the owner.', caption: 'Approval is tied to this confirmation and its checks.' },
  },
  {
    question: 'How should receiving work?',
    source: 'DEC-017 · DEC-028',
    options: [
      { label: 'Enter each product by hand', verdict: 'Slow and error-prone.' },
      { label: 'Stock in straight from the DDT', verdict: 'The DDT is what shipped, not what arrived.' },
      { label: 'Prefill from the DDT, decide differences', verdict: 'Counted goods stay separate from stock.', chosen: true },
    ],
    evidence: 'A DDT sits between confirmation and receipt.',
    tradeoff: 'Over-receipts need a recount.',
    shot: { src: `/img/procurement-agent/decisions/d6-receive-against-ddt.webp?v=${DECISION_SHOTS['d6-receive-against-ddt'].v}`, ...DECISION_SHOTS['d6-receive-against-ddt'], alt: 'Receiving table comparing confirmed, DDT and actual quantities with a status per line.', caption: 'Actual prefilled from the DDT; only differences need a decision.' },
  },
  {
    question: 'How does the Agent learn?',
    source: 'DEC-006 · DEC-020',
    options: [
      { label: 'From every order, automatically', verdict: 'Learns noise and mistakes.' },
      { label: 'Static reports only', verdict: 'Feedback never reaches the next plan.' },
      { label: 'Only from reviewed outcomes', verdict: 'A person decides what is kept.', chosen: true },
    ],
    evidence: 'Edits alone don’t explain why.',
    tradeoff: 'Slower to improve.',
    diagram: { node: <AgentMemoryLoopCompact />, caption: 'Solid arrows follow a purchase to review. Dashed arrows write its evidence to that supplier’s memory; only the buyer’s review changes it.' },
  },
];

// Iteration 2: the evaluation decision lives in its own chapter.
const evaluationDecision: Decision[] = [
  {
    question: 'How do we know the plan was right?',
    source: 'Iteration 2',
    options: [
      { label: 'Acceptance rate', verdict: 'Measures habit, not correctness.' },
      { label: 'One global score', verdict: 'Hides which supplier fails.' },
      { label: 'Score each reviewed order, per supplier', verdict: 'With confidence from data volume.', chosen: true },
    ],
    evidence: 'Faster plans didn’t prove right plans.',
    tradeoff: 'Review adds a step; skips aren’t counted.',
    shot: { src: `/img/procurement-agent/decisions/d8-plan-score.webp?v=${DECISION_SHOTS['d8-plan-score'].v}`, ...DECISION_SHOTS['d8-plan-score'], alt: 'Plan score in the Evidence panel: expected accuracy 77%, the supplier track record, and each deduction.', caption: 'Every new plan shows its expected accuracy and why.' },
  },
];

// What I got wrong, and what changed my mind.
const reversals: Reversal[] = [
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
  {
    before: 'Planning time as the result.',
    evidence: 'Faster plans did not prove better plans. Accuracy was “not yet measured”.',
    after: 'Every reviewed order is scored; each supplier keeps its own accuracy and confidence.',
    source: 'Iteration 2',
  },
];

export default function ProcurementAgentKitPage() {
  return (
    <CaseKitPage>
      <CaseStudyControls showProgress navLabels={navLabels} railKicker="Case study" railTitle="Procurement Agent" />
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
            { label: 'The outcome', body: 'A purchase plan that took 30 minutes to 2 hours now takes 5 to 10 minutes, used daily by three staff. A second iteration scores every plan, supplier by supplier.' },
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
          ]} caption="The old workflow, from Excel order to manual receiving. Identifying details are masked." />
          <CaseFigure caption="Before the ERP · The order and the supplier’s answer lived outside the system. Receiving followed the delivery note, so batch arrivals could not be recorded.">
            <LegacyProcurementFlow />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="03 / Phase 1" title="First, I brought the whole purchase into the ERP.">
          <CaseProse><p>Order, confirmation, DDT and receiving became one record, with differences marked on it. It still did not suggest a quantity.</p></CaseProse>
          <CaseFigure caption="Phase 1 · The same three moments, now on one purchase record. The quantity judgment at the start is still manual.">
            <ConnectedProcurementFlow />
          </CaseFigure>
          <PurchasingLiveDemo />
        </CaseChapter>

        <CaseChapter label="04 / Why an Agent" title="After launch, buyers still wrote the order from their own heads.">
          <CasePullquote>Now I don&apos;t need to switch between Excel and the system anymore. But <strong>the part that takes the most time is still the same</strong>. I still have to <strong>decide what to buy and how much</strong>.</CasePullquote>
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
            { icon: <Layers />, title: 'Capture signals where they appear', body: 'Stockouts, notes, and exceptions stay on the purchase for next time.' },
            { icon: <ClipboardCheck />, title: 'One plan, with the work shown', body: 'One recommendation, not a menu. Every line shows its reasons.' },
            { icon: <Calculator />, title: 'Numbers from an engine', body: 'A tested engine calculates; the model reads and explains.' },
            { icon: <ShieldCheck />, title: 'Stop where commitment begins', body: 'The buyer orders, and confirms what the Agent learns.' },
          ]} layout="pairs" />
          <CaseProse><p>The Agent prepares every step. Four steps wait for a person, because each one commits money, stock, or what the Agent learns next.</p></CaseProse>
          <CaseFigure caption="Human in the loop · Blue: what the Agent prepares. Heavy outline: a human gate, where the purchase waits for the buyer. The Agent can never place the order.">
            <HumanInTheLoopFlow />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="06 / Key decisions" title="Seven decisions turned those principles into a product.">
          <CaseStats items={[
            { value: '73', label: 'Decision records, each with the options weighed' },
            { value: '47', label: 'Interview and feedback records' },
            { value: '60', label: 'Documented design iterations' },
          ]} />
          <CaseProse><p>Each principle was tested against real alternatives. For every decision: what I chose, what I rejected, and the cost I accepted.</p></CaseProse>
          <DecisionCards items={decisions} />
        </CaseChapter>

        <CaseChapter label="07 / The experience" title="A clear next action, from replenishment to receipt.">
          <CaseProse><p>Together, those decisions make one flow: a supplier card starts the draft, the Agent explains every line, and the buyer approves, orders, and receives.</p></CaseProse>
          <AgentLiveDemo />
        </CaseChapter>

        <CaseChapter label="08 / Every handoff" title="Twelve steps and six themes shape every handoff.">
          <CaseProse><p>Underneath that flow, each handoff between Agent and buyer was designed on its own: twelve steps across a purchase, six themes across all of them. Try any card.</p></CaseProse>
          <ProcurementExperienceMap />
        </CaseChapter>

        <CaseChapter label="09 / Measuring accuracy" title="Faster was proven. Right was not. So every plan now gets a score.">
          <CaseProse><p>After launch, plans were faster, but nothing showed whether the quantities were right. Automation would need exactly that. Iteration 2 scores each plan against what was really needed, supplier by supplier.</p></CaseProse>
          <CaseFigure caption="The evaluation loop · A plan starts with an expected accuracy. The review after receiving measures the real one and updates that supplier’s track record.">
            <EvaluationLoop />
          </CaseFigure>
          <DecisionCards items={evaluationDecision} start={8} />
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

        <CaseChapter label="10 / What I got wrong" title="Six things I got wrong, and what changed my mind.">
          <CaseProse><p>Most of these came from testers and buyers, not from me. Each one narrowed the Agent’s job.</p></CaseProse>
          <ReversalList items={reversals} />
        </CaseChapter>

        <CaseChapter label="11 / Results" title="A purchase plan in 5 to 10 minutes, down from 30 minutes to 2 hours.">
          <CaseStats items={[
            { value: '5–10 min', label: 'To prepare a purchase plan, down from 30 minutes to 2 hours across suppliers' },
            { value: '3', label: 'Staff members using the Agent daily' },
          ]} />
          <CaseEvidenceCards label="What is in use, measured, and still open" items={[
            { icon: <PackageCheck />, title: 'In use', body: 'Connected purchasing records and an Agent-drafted plan the buyer edits and orders.' },
            { icon: <ScanSearch />, title: 'Now measurable', body: 'Iteration 2 scores plan accuracy per supplier from reviewed orders. Built into the ERP.' },
            { icon: <UserCheck />, title: 'Still open', body: 'Acceptance rate, and whether the Agent stops at the right approval boundary.' },
          ]} />
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
