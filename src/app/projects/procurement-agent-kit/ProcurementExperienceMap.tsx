'use client';

import { useState } from 'react';
import { Compass, Eye, RotateCcw, ShieldCheck } from 'lucide-react';
import { CaseButton } from '../../components/case-kit/CaseButton';
import { CaseEvidenceCards, CaseInteractivePreview, CaseProse } from '../../components/case-kit/CaseKit';

type Facet = { id: string; label: string; title: string; phase: string; problem: string; design: string; goal: string };
const steps: Facet[] = [
  { id: '01', label: 'Entry', title: 'Discoverability & entry', phase: 'Before the task', problem: 'Buyers need a next action, not a directory of AI features.', design: 'The purchase list brings together existing orders, Ask Agent, and supplier replenishment opportunities. The list coordinates work; the order holds the decision.', goal: 'Discover the next step where purchasing already happens.' },
  { id: '02', label: 'Context', title: 'Intent & context', phase: 'Before the task', problem: 'Users should not reassemble information the business already knows.', design: 'A new request asks for supplier and sales coverage. A replenishment card carries its calculated supplier and fixed coverage directly into the new draft.', goal: 'Express intent in business language and carry known context forward.' },
  { id: '03', label: 'Expectations', title: 'Expectation alignment', phase: 'Before the task', problem: 'A recommendation can look like a supplier commitment.', design: 'The supplier card states estimated goods, coverage, order timing, and commercial thresholds. Create purchase order produces an editable draft; formal ordering remains a separate buyer action.', goal: 'Make the output and the next commitment clear before work starts.' },
  { id: '04', label: 'Progress', title: 'Execution transparency', phase: 'During the task', problem: 'An unexplained spinner leaves users unsure whether their request is being handled.', design: 'The guided empty canvas becomes a plan-loading state while the conversation shows stages. The finished table arrives in the same place. Send becomes Pause during work.', goal: 'Give waiting a visible start, process, and result.' },
  { id: '05', label: 'Human control', title: 'Human-in-the-Loop', phase: 'During the task', problem: 'Constant confirmation creates fatigue, but commercial decisions need an accountable person.', design: 'Quantities and prices stay editable in the table. Missing items, price changes, and quantity changes trigger focused review. Approval, recording an external order, and receipt confirmation remain distinct.', goal: 'Reserve attention for decisions that need business judgment.' },
  { id: '06', label: 'Tasks', title: 'Async & long-running tasks', phase: 'During the task', problem: 'Buyers cannot watch one conversation while other purchases need attention.', design: 'Workspace Tasks shows running and completed work across purchases. Notifications report changes. Within an order, Pause and Resume share the composer button and preserve progress.', goal: 'See work in progress and continue it without starting over.' },
  { id: '07', label: 'Recovery', title: 'Error handling & recovery', phase: 'During the task', problem: 'An accidental edit should not force a buyer to regenerate the whole plan.', design: 'Activity log combines business events with draft snapshots. Current draft stays at the top; edit rounds become grouped autosaves. Preview a snapshot in the table, then explicitly apply it.', goal: 'Inspect the past and safely return to an editable present.' },
  { id: '08', label: 'Evidence', title: 'Delivery & verifiability', phase: 'After the task', problem: 'A long answer makes it difficult to verify what changed and why.', design: 'Results separate status, key differences, and next steps. Evidence summarizes sales, stock, inbound, rules, and documents consulted; each row’s Why explains its specific recommendation.', goal: 'Deliver a result the buyer can scan and verify.' },
  { id: '09', label: 'Refinement', title: 'Iterative refinement', phase: 'After the task', problem: 'Small corrections should not require another conversation or a separate editing mode.', design: 'The familiar product table keeps inline quantity and price fields, product search, row actions, and recalculated totals. The table hugs its rows while the surrounding card fills the workspace.', goal: 'Make local adjustments where the result is already visible.' },
  { id: '10', label: 'Feedback', title: 'Feedback & reuse', phase: 'After the task', problem: 'The reason for a buyer’s judgment can disappear into the conversation.', design: 'Order notes retain this purchase’s context. After receiving, structured prompts revisit demand, arrival timing, and SKU variance. Reviewed notes and activity remain linked to the purchase.', goal: 'Connect feedback to the decision that produced it.' },
  { id: '11', label: 'Supply rules', title: 'Memory & personalization', phase: 'Over time', problem: 'Supplier terms and one purchase’s exceptions should not become the same memory.', design: 'Supply rules holds contacts, minimums, shipping, lead time, and payment terms. Order notes stay with the order. Two entry points offer supplier-detail editing or a chat-led change.', goal: 'Find lasting supplier information without confusing it with this order.' },
  { id: '12', label: 'Proactivity', title: 'Proactive assistance', phase: 'Over time', problem: 'Late replenishment creates stock gaps; too many alerts obscure useful action.', design: 'Scheduled checks surface supplier opportunities with an order date. Confirmation and delivery changes go to supplier-labelled notifications with a clear primary action, read state, and deletion.', goal: 'Appear at the right time and offer a concrete next action.' },
];
const themes: Facet[] = [
  { id: 'A', label: 'Safety', title: 'Safety & privacy', phase: 'Across the workflow', problem: 'Reading a document does not grant the Agent authority to commit the business.', design: 'Order panels stay scoped to the current purchase. Upload, approval, ordering, and receiving have separate boundaries. Deleting a draft requires an explicit confirmation.', goal: 'Align access, information scope, and business responsibility.' },
  { id: 'B', label: 'Ecosystem', title: 'Multi-Agent & ecosystem', phase: 'Across the workflow', problem: 'Internal specialization should not make users carry context between experts.', design: 'One Procurement agent coordinates sales, stock, rules, document checks, and approval around the same order. Evidence exposes business sources, without requiring expert switching.', goal: 'Keep collaboration continuous without exposing orchestration work.' },
  { id: 'C', label: 'Tone', title: 'Persona & tone', phase: 'Across the workflow', problem: 'Long explanations and confident technical language hide what a buyer needs to do.', design: 'The Agent speaks as a purchasing assistant. A general opening serves the list; order replies lead with state and facts, use structured sections, and finish with one clear next step.', goal: 'Make what happened and what comes next immediately readable.' },
  { id: 'D', label: 'Documents & devices', title: 'Multimodal & cross-device', phase: 'Across the workflow', problem: 'Supplier documents, physical goods, and different window sizes must support one workflow.', design: 'Confirmation, DDT, and attachments share the purchase context. The compound composer accepts documents. Narrow layouts retain access to both order and Agent without changing the business sequence.', goal: 'Adapt the layout while keeping the same purchasing mental model.' },
  { id: 'E', label: 'Resources', title: 'Cost & resources', phase: 'Across the workflow', problem: 'Repeated analysis and duplicate drafts consume resources and interrupt judgment.', design: 'Global controls schedule replenishment checks. Existing results, local edits, pause/resume, and historical previews let work continue without regenerating the whole purchase.', goal: 'Spend analysis effort where it adds value.' },
  { id: 'F', label: 'Experience measures', title: 'Experience metrics', phase: 'Across the workflow', problem: 'Generation success or acceptance alone cannot show whether the buyer understood the decision.', design: 'Review task completion, discrepancy detection, edits, necessary interventions, and recovery. Separate user roles and task conditions rather than treating every acceptance as trust.', goal: 'Evaluate correctness, control, and the ability to continue.' },
];

const phases = [
  { id: 'before', range: '01—03', title: 'Before the task', description: 'Start with a replenishment opportunity or a request. Establish the goal before generating a plan.', items: steps.slice(0, 3) },
  { id: 'during', range: '04—07', title: 'During the task', description: 'Show progress, preserve human control, and make work resumable and recoverable.', items: steps.slice(3, 7) },
  { id: 'after', range: '08—10', title: 'After the task', description: 'Deliver the result in the familiar order. Verify, refine, and retain the reasons behind a decision.', items: steps.slice(7, 10) },
  { id: 'over-time', range: '11—12', title: 'Over time', description: 'Keep supplier information separate from order notes, and surface the next purchase at the right moment.', items: steps.slice(10) },
  { id: 'themes', range: 'A—F', title: 'Cross-cutting themes', description: 'Check safety, coordination, language, context, resources, and experience quality across the entire workflow.', items: themes },
];
const checks: Record<string, [string, string]> = {
 '01':['Organize entry points by business object, rather than by AI feature.','Keep supplier opportunities distinct from existing purchase drafts.'],
 '02':['Fix the coverage of a calculated opportunity; let a self-initiated purchase set its own window.','Start the list conversation broadly and carry the selected supplier into creation.'],
 '03':['Creating a draft and formally ordering from a supplier remain different commitments.','Use an explicit order deadline without duplicating stock and lead-time details in the list.'],
 '04':['Keep loading and delivery in the same canvas, with matching conversation progress.','Return to Send when work completes; make the initial state informative.'],
 '05':['Apply low-risk draft edits directly; keep commercial responsibility with the buyer.','Keep the Draft/Edit stage active and distinguish confirmation, DDT, and actual counts.'],
 '06':['Task progress and notifications serve different purposes; controls stay in the composer.','Resume the same work and restore Send when it finishes.'],
 '07':['Preview before applying a compatible draft, and retain the previous state.','Do not overwrite a new confirmation context or an already-ordered purchase.'],
 '08':['Show a source overview separately from SKU-specific recommendation reasons.','Make the result scanable without repeating every row in the conversation.'],
 '09':['Preserve the familiar business table and support local edits.','Keep the surrounding card full-height while rows hug their content.'],
 '10':['Order notes, supplier rules, and audit events retain separate purposes.','Recovering quantities must not erase later business events.'],
 '11':['Give lasting supplier information a stable place beside the order.','Keep order qualification in the order summary, not in the supplier rule panel.'],
 '12':['Schedule proactive checks, but leave creation to the buyer.','Reading or deleting a notification does not resolve the underlying purchase issue.'],
 'A':['The list coordinates globally; each order contains its own context and decisions.','Confirm draft deletion explicitly and keep history preview free of business actions.'],
 'B':['Coordinate internal capabilities through one order and one Agent.','Do not require specialist switching or cross-device handoffs to continue a purchase.'],
 'C':['Use business facts and put detail in the table and evidence panels.','Make confirmation, order, and receipt replies easy to scan.'],
 'D':['Change layout and reading order while preserving the purchase workflow.','Retain clear scrolling, fixed-column shadows, and row hover context.'],
 'E':['Control the checking cadence instead of exposing internal resource machinery.','Avoid duplicate drafts; history preview should not regenerate the plan.'],
 'F':['Use task scenarios, activity, and role feedback to evaluate the design.','Observe outcomes, process, trust, and recovery separately; do not invent measured impact.'],
};
function ExperienceCard({item}:{item:Facet}) {
 const [revision,setRevision]=useState(0);
 return <article id={`experience-facet-${item.id}`} className="min-w-0 overflow-hidden rounded-[var(--case-radius-media)] border border-[var(--case-rule)] bg-[var(--case-bg)]" aria-label={`${item.id} / ${item.title}`}>
   <div className="flex items-center justify-between gap-[var(--case-space-8)] border-b border-[var(--case-rule)] px-[var(--case-space-24)] py-[var(--case-space-8)]">
     <span data-case-type="caption">{item.id} / {item.title}</span>
     <CaseButton variant="text" aria-label={`Reset ${item.title}`} onClick={()=>setRevision(value=>value+1)}>Reset</CaseButton>
   </div>
   <CaseInteractivePreview key={revision} src={`/demos/procurement-agent/index.html?facet=${item.id}&revision=${revision}`} title={`Interactive design: ${item.title}`} />
   <div className="flex flex-col gap-[var(--case-space-16)] border-t border-[var(--case-rule)] p-[var(--case-space-24)]">
     <h4 data-case-type="small-title">{item.id} / {item.title}</h4>
     <div data-case-type="card-body" className="flex flex-col gap-[var(--case-space-16)]">
       <p><strong>User need.</strong> {item.problem}</p>
       <p><strong>Design.</strong> {item.design}</p>
       <p><strong>Goal.</strong> {item.goal}</p>
       <p><strong>Trade-off.</strong> {checks[item.id][0]}</p>
       <p><strong>Experience check.</strong> {checks[item.id][1]}</p>
     </div>
   </div>
 </article>;
}
export default function ProcurementExperienceMap() {
 return <div className="flex min-w-0 flex-col gap-[var(--case-space-64)]" aria-label="Agent UX Map: 12 Steps + 6 Themes">
  <CaseEvidenceCards label="Four experience goals" items={[
   {icon:<Eye/>,title:'Explainable',body:'Show the basis for a quantity and state the result clearly.'},
   {icon:<ShieldCheck/>,title:'Controllable',body:'Delegate preparation while people confirm responsibility.'},
   {icon:<Compass/>,title:'Predictable',body:'Set expectations for the output and the next action.'},
   {icon:<RotateCcw/>,title:'Recoverable',body:'Preserve completed work and let users safely continue.'},
  ]}/>
  {phases.map(phase=><section id={`experience-${phase.id}`} key={phase.id} className="flex min-w-0 scroll-mt-[var(--case-space-chapter)] flex-col gap-[var(--case-space-24)]" aria-label={phase.title}>
   <CaseProse><h3>{phase.range} / {phase.title}</h3><p>{phase.description}</p></CaseProse>
   <div className="grid min-w-0 gap-[var(--case-space-24)] grid-cols-1 md:grid-cols-2">{phase.items.map(item=><ExperienceCard key={item.id} item={item}/>)}</div>
  </section>)}

 </div>;
}
