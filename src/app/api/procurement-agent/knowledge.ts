/**
 * Knowledge base for the Procurement Agent demo's "ask about this project" assistant.
 *
 * PROJECT_CASE_STUDY is extracted from the live case study page
 * (src/app/projects/procurement-agent/page.tsx) — keep it in sync when that page changes.
 *
 * AUTHOR_NOTES is for details that are NOT on the public page: implementation specifics,
 * trade-offs considered and rejected, tooling, timelines. Edit that block freely.
 */

export const PROJECT_CASE_STUDY = `
# AI Procurement Agent for DEF Beauty Supply

One-line: Designing an evidence-backed procurement agent that helps buyers decide what to
purchase, how much to order, and why — while keeping critical decisions under human control.

Tags: B2B SaaS, Enterprise UX, AX Design, Agent Workflow, Data Architecture
Year: 2026. Company: DEF Beauty Supply (B2B beauty wholesaler serving professional customers in Italy).

## Role
UX / AX Designer. End-to-end ownership across business research, workflow redesign, data
modeling, Agent architecture, interaction design, LangGraph prototyping, and implementation.
Scope: Platform redesign → Procurement lifecycle → AI Procurement Agent.
Team: cross-functional collaboration with procurement, operations, and business stakeholders.

## 01 Context
DEF's sales, inventory, procurement, receiving and finance workflows were spread across
disconnected software, documents, messaging and manual workarounds. Mei redesigned the core
business architecture across sales, inventory, procurement and receiving. This case study
focuses on procurement because improving the workflow exposed a deeper problem: the system
could record inventory, but not the decision process that created it.

## 02 Why procurement
Business ecosystem: Customer → WeChat Store → Sales Order → Inventory → Procurement (focus)
→ Receiving → Finance. The business ran across several disconnected systems, not one.

## 03 Original workflow
Inventory existed in the system, but purchasing happened through exports, spreadsheets,
messages, supplier documents and manual stock entry.
Old flow: Inventory system → download sales & stock → Excel → buyer estimates quantity →
WhatsApp/Email supplier → supplier confirms → goods arrive → DDT → manually search SKU one
by one → stock-in.
Problems: Excel broke data traceability; quantity decisions stayed manual; supplier messages
lost purchase context; purchase and fulfillment had no shared record; receiving was re-entered
by hand.
Three root issues: (1) Fragmented data — sales, stock, supplier communication and receiving
lived in different tools. (2) No lifecycle — the system recorded stock-in but not purchase
intent or fulfillment state. (3) Manual reconciliation — confirmation, DDT and received
quantities had to be compared by hand.

## 04 Phase 1 — making procurement structured and traceable
Before AI could participate, procurement needed a shared object model, explicit states and
traceable evidence.
- Object model: every receiving event belongs to a purchase lifecycle.
  Purchase → Confirmation → DDT → Receiving → Inventory.
- State model: Draft → Awaiting supplier → Confirmed → Ordered → Partially received → Completed.
- Evidence model: confirmation, DDT and actual receiving stay linked instead of overwriting
  each other, so discrepancies are visible rather than hidden in the final stock value.
  Example evidence comparison: Requested 10, Confirmed 8, DDT 8, Received 11, Variance +3.
Result: a traceable purchase workspace where purchase need, supplier confirmation, shipment,
receiving and inventory share one business context.
Remaining gap: the workflow was digital, but deciding what and how much to buy was still manual.

## 05 The turning point
Procurement team feedback after Phase 1: "Now I don't need to switch between Excel and the
system anymore. But the part that takes the most time is still the same — I still have to
decide what to buy and how much."
Before Phase 1 the buyer did: find data + organize data + calculate + apply supplier rules +
make judgment + create order. After Phase 1 the system retrieved data and organized workflow,
but the buyer still had to calculate, apply supplier rules and make judgment.
The interface problem had been solved. The decision problem had not.

## 06 Reframing the problem
The real bottleneck was procurement judgment. Every purchase decision still required buyers to
combine experience, sales, inventory, supplier constraints, lead time and seasonal demand.

## 07 Why an Agent (and not another dashboard)
A dashboard could expose data, but could not dynamically interpret a purchasing goal, gather
the right context, resolve missing inputs, coordinate calculations, and decide what required
human attention. Buyer quote: "Don't just give me the data. Help me calculate a reasonable
purchasing plan from it."
What required an agent: interpret the goal; retrieve the right evidence; coordinate tools and
calculations; detect exceptions (missing inputs, unusual prices, shortages, approval
conditions); explain and resume after human intervention.
The framing shifted from "How can AI automate procurement?" to "How might we reduce the
buyer's cognitive workload without removing their control over purchasing decisions?"

## 08 Making the system agent-ready
The Agent needed a context layer, not just access to tables.
The system already knew: sales, inventory, purchase, receiving.
The Agent also needed: supplier rules, lead-time history, MOQ, price changes, seasonality,
promotions, delivery reliability, user overrides.
Maturity path: Manual operations → Structured data → Traceable states → Historical evidence →
Agent-readable context → Procurement Agent.

## 09 How the Agent participates
Three responsibilities: (1) interpret the buyer's goal — what does "one month of supply" mean
here; (2) build and calculate the plan from sales, stock, incoming inventory and supplier
constraints; (3) surface exceptions for human action — price changes, shortages, payment risk,
approval needs.
AX design principle: Agency = interpreted intent + deterministic calculation + visible evidence
+ reversible edits + explicit human gates.

## 10 Designing the Agent — responsibility architecture
"The LLM interprets. The engine calculates. The buyer decides."
- LLM: understand intent, clarify missing context, choose tools, explain results, identify
  exceptions.
- Deterministic engine: quantity is computed, not generated — calculate demand, apply coverage
  period, account for lead time, subtract current and incoming inventory, apply MOQ and supplier
  constraints, check business thresholds.
- Buyer: review, edit, approve, place order.
Rationale: quantity affects cash, inventory risk and supplier commitments, so the
recommendation must be reproducible from business inputs — not generated probabilistically.

## 11 Executable agent workflow
Properties: stateful (carries purchase context), resumable (continues after approval,
clarification or external supplier response), tool-using (reads sales, inventory, supplier
rules, documents, history), human-interruptible (pauses before commitments or unresolved
high-risk decisions).
Steps: 01 capture intent → 02 retrieve context → 03 clarify (only missing inputs) → 04 read
data → 05 calculate (deterministic) → 06 propose (editable plan) → 07 human work (buyer
reviews, edits, talks to supplier) → 08 verify documents (confirmation / DDT / quantity /
price differences) → 09 record order (human records the confirmed order).
Implementation note: LangGraph manages the stateful workflow, tool execution, human approval
gates and task recovery — from prototype through production.

## 12 Human gate — the Agent cannot place an order
Formal ordering creates external financial and supplier commitments. The Agent prepares and
verifies the decision; the commitment stays human-owned.
Agent can: generate a purchase recommendation, prepare supplier-facing files, compare
confirmation documents, flag price and quantity differences, identify approval conditions.
Human owns: supplier communication, negotiation, formal confirmation, high-risk approvals,
recording the official order.
Approval examples: large spend or cash exposure, new or risky products, unusual payment terms,
significant price or quantity changes.
Supporting concepts: Evidence (show the source behind every recommendation), Confidence (signal
uncertainty without false precision), DecisionTrace (keep inputs, rules, changes and reasons
inspectable), Human Gate (pause before irreversible purchasing actions), Approval (bind
authorization to the final quantity and price).

## 13 End-to-end scenario — "Create a one-month purchase plan for MNP"
One MNP SKU carries the story: the Agent suggests 24 units, the buyer edits to 36, and every
later supplier and receiving event stays attached to that decision.
Detail: SKU "Bonding Primer 8ml", supplier code 431001, supplier MNP (Mesauda Nail Pro).
30-day sales 28, available 12, incoming 0, target coverage 30 days → Agent suggests 24.
Buyer overrides to 36 for an upcoming promotion. Est. net €4.52, draft total €162.72.
Supplier context: lead time p50 16d / p90 21d, free shipping at €500 threshold, supplier
language Italian. Same inputs always reproduce the Agent quantity.

## 14 Closing the loop
A recommendation only becomes useful when its outcome returns to the system.
For MNP SKU 431001: Agent 24 → Buyer 36 → Supplier confirmation 30 (supplier commits below the
buyer request) → DDT 30 (shipment matches confirmation) → Receiving 33 (warehouse records
physical quantity) → Variance +3 → Outcome "over-delivered". The discrepancy becomes future
evidence. The lifecycle created in Phase 1 became the evidence layer the Agent needed in Phase 2.

## 15 Learning
Corrections become governed learning signals, not instant truth.
Agent recommendation 24 → Buyer override 36 (reason: upcoming MNP promotion) → Outcome evidence
"validated" (actual sell-through supports the higher quantity) → Learning candidate "review"
(propose higher promotional coverage for this SKU). This is a learning candidate, not an
automatic memory update.

## Information architecture — Procurement Workspace
01 All orders (cards across draft, placed, received, cancelled); 02 Purchase plan (editable
optimal proposal grouped by SPU); 03 Document check (confirmation, DDT and actual receipt
differences); 04 Supplier memory (rules, lead-time performance, confirmed habits);
05 Approval (high-impact SKU flags and final negotiated plan); 06 Learning review (outcome
evidence and governed memory candidates).
Agent state semantics: RULE, OBSERVATION, SUGGESTION, RISK, APPROVAL.
Core agent components (8): KnowledgeBadge (source and freshness), ConfidenceIndicator
(certainty without false precision), EvidenceLink (inspectable proof), RiskBanner (what can go
wrong), ApprovalGate (blocks unauthorized progress), DecisionTrace (why this recommendation
exists), LearningCandidateCard (review before memory update), AgentActionFooter (human action
at the right moment).
Consistency rule: business status, Agent state and human responsibility are different layers —
and never share one ambiguous color.

## 16 Agent UX iterations
The Agent became useful as its role became more specific:
01 Explain → Initiate (the Agent became the entry point for real purchasing work).
02 Compare → Recommend (three scenarios became one editable, evidence-backed proposal).
03 Automate → Hand off (formal ordering became an explicit human authority boundary).
04 Separate approval → Escalate by exception (risk triggered approval only when new evidence
required it).
05 Manual receiving → Reconcile & learn (fulfillment differences became structured evidence and
governed learning signals).
Outcome: from "a chatbot beside a purchase form" to a stateful Agent that captures intent,
produces one evidence-backed recommendation, supports reversible edits, pauses at human
authority boundaries, reconciles real-world outcomes, and learns only from verified evidence.

## 17 Validation
Validated with real procurement records, sales and inventory data, representative supplier
scenarios and a coded workflow prototype: end-to-end lifecycle; reproducible quantity
recommendation (same inputs reproduce the same quantity); discrepancy handling; human approval
boundary; stateful recovery.
Would measure after production use: recommendation acceptance, time to recommendation,
discrepancy detection, override reasons, high-risk interception, learning quality.

## 18 Results
A functional Agent-ready procurement MVP — from screen concept to a coded workflow with
explicit data contracts, tool boundaries, document reconciliation and a preserved human
ordering gate.
Capabilities: one traceable procurement lifecycle; one reproducible recommendation model; one
explicit human authority boundary; one governed learning loop.
MVP scope numbers: 60 documented design iterations, 8 core Agent components, 5 critical
validation scenarios, 1 shared workbench for plan + conversation.
Status: functional MVP with a pilot planned next.

## 19 Reflection
"Designing an Agent meant redesigning the system it reasons over." Mei started by asking where
AI could reduce work, and ended up redesigning the data model, business states, decision logic,
evidence relationships and responsibility boundaries that made AI trustworthy enough to
participate at all.
Final reflection: the hardest part of Agent design was not deciding what the AI could do, but
deciding what evidence it needed, when it should stop, and who remained accountable.

## About this demo itself
The demo on the right is a scripted, front-end-only replica of the real interface — it runs
without a backend so the workflow can be explored from the portfolio. Its business state
machine (quantities, approvals, ordering, receiving) is scripted, not model-generated. Only
this "ask about the project" conversation is powered by a live model.
`.trim();

/**
 * Details that are not on the public case study page.
 * Mei: add implementation specifics, rejected alternatives, tooling and process notes here.
 */
export const AUTHOR_NOTES = `
(Nothing added yet — when this is empty, the assistant relies on the case study above and says
plainly when something is not documented.)
`.trim();
