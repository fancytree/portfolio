import type { Metadata } from 'next';
import Image from 'next/image';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import { CaseKitControls as CaseStudyControls } from '../../components/CaseStudyControls';
import FragmentedOperationsDiagram from './FragmentedOperationsDiagram';
import UnifiedOperationsDiagram from './UnifiedOperationsDiagram';
import BeforeAfterSlider from './BeforeAfterSlider';
import { DecisionCards, ReversalList, type Decision, type Reversal } from '../procurement-agent-kit/DecisionCards';
import DashboardLiveDemo from './DashboardLiveDemo';
import DesignSystemShowcase from './DesignSystemShowcase';
import wide from './DefDecisions.module.css';
import { ERP_DECISION_SHOTS } from './erpDecisionShots';
import { ApprovalChainFlow, LaunchPhasesFlow } from './ErpDecisionDiagrams';
import { InvoicingLiveDemo, PurchasingLiveDemo, SalesOrderLiveDemo, StorefrontBuilderLiveDemo } from './ErpLiveDemo';
import { ArchitectureOptions, CapabilityMatrix, ConfirmationLadder, CaseCrossLink, IterationLog, InvoiceCadence, LogRoleLoad, RoleBoards, type IterationItem } from './DefDecisions';
import {
  CaseChapter,
  CaseClose,
  CaseDevicePreview,
  CaseFigure,
  CaseHero,
  CaseKitPage,
  CaseKitSections,
  CaseProse,
  CasePullquote,
  CaseStats,
  CaseSteps,
} from '../../components/case-kit/CaseKit';

export const metadata: Metadata = {
  title: 'ERP Platform for DEF Beauty Supply | Mei Chai',
  description:
    'Connecting customer ordering with sales, fulfilment, and invoicing for a beauty wholesaler in Italy, reducing repeated checks and manual entry.',
  robots: { index: false, follow: false },
};

const navLabels = [
  '01 / Overview',
  '02 / The problem',
  '03 / Research',
  '04 / Principles',
  '05 / One platform',
  '06 / Role dashboards',
  '07 / Sales orders',
  '08 / Purchasing & invoicing',
  '09 / Storefront',
  '10 / How it was built',
  '11 / Results',
  '12 / Reflection',
];

const reversals: Reversal[] = [
  { before: 'Hide real stock from customers.', evidence: 'The owner disagreed: customers can see it, opened up by login and order history later.', after: 'Visibility is a per-identity policy (anonymous, signed in, has ordered), never hard-coded.', source: 'UX.md · sales → owner' },
  { before: 'Invoice the moment an order closes.', evidence: 'Finance: B2B customers pay in batches, then ask for an invoice.', after: 'Invoice from paid orders, merge several orders, skip lines already invoiced.', source: 'UX.md · finance' },
  { before: 'Lock the order after approval, then issue the delivery note.', evidence: 'Customers add goods until the second before loading. Staff cope by reopening a new order.', after: 'Delivery notes are decoupled from the order; shipments are tracked per delivery, partial included.', source: 'UX.md · sales' },
  { before: 'The owner’s top pain is the whole picture.', evidence: 'Sales named a different pain: order and delivery-note coupling. Neither was wrong.', after: 'Solve both. The channel gap (stock, orders) and the loading-day edits each got a fix.', source: 'UX.md · owner vs sales' },
];


const packagingDecision: Decision = {
  question: 'Where do packaging units (piece, box, carton) live?',
  source: 'Packaging units code spec',
  options: [
    { label: 'On the product', verdict: 'Shades of one product price differently.' },
    { label: 'On each SKU, stock in one base unit', verdict: 'One stock number; each unit has its own price.', chosen: true },
  ],
  evidence: 'One SKU sells by piece, box and carton.',
  tradeoff: 'Legacy SKUs needed migrating.',
  shot: { src: `/img/def-erp/decisions/e-packaging-units.webp?v=${ERP_DECISION_SHOTS['e-packaging-units'].v}`, ...ERP_DECISION_SHOTS['e-packaging-units'], alt: 'Sales order line set to Box, with a table of units: piece and box, each with its own price.', caption: 'Pick the unit per line; each unit carries its own price.' },
};

const procurementDecision: Decision = {
  question: 'Keep the request → approval → order chain?',
  source: 'Procurement redesign doc · decision log',
  options: [
    { label: 'Keep three separate stages', verdict: 'A small team ends up approving itself.' },
    { label: 'Delete the request tables', verdict: 'Loses data and room to grow.' },
    { label: 'Fold approval into placing the order', verdict: 'Ordering needs the supplier’s confirmation.', chosen: true },
  ],
  evidence: 'Request pages were unreachable; no one reviews full-time.',
  tradeoff: 'Control is per order, not per line.',
  diagram: { node: <ApprovalChainFlow />, caption: 'The old chain stays in the data, hidden. Placing an order is the approval point.' },
};

const builderDecision: Decision = {
  question: 'A free-form canvas, or a fixed set of modules?',
  source: 'Storefront builder code · home layout schema',
  options: [
    { label: 'Free-form page editor', verdict: 'Staff aren’t designers; a broken page reaches every salon.' },
    { label: 'Modules, draft before publish', verdict: 'Add, reorder, configure; nothing is live until published.', chosen: true },
  ],
  tradeoff: 'Each new module type needs development.',
  shot: { src: `/img/def-erp/decisions/e-storefront-modules.webp?v=${ERP_DECISION_SHOTS['e-storefront-modules'].v}`, ...ERP_DECISION_SHOTS['e-storefront-modules'], alt: 'Storefront builder: module library on the left, the live mini-program preview in the middle, settings on the right.', caption: 'Staff build the home page from modules, previewed in the real mini-program.' },
};

const miniProgramDecisions: Decision[] = [
  {
    question: 'Redesign the storefront, or keep the look salons know?',
    source: 'Mini-program · home, sign-in, account',
    options: [
      { label: 'A fresh visual redesign', verdict: 'Salons reorder from habit and would relearn it.' },
      { label: 'Keep the layout, rewire what is behind it', verdict: 'Same blocks, now on live ERP stock and prices.', chosen: true },
    ],
    tradeoff: 'Before and after look alike.',
    shot: { src: `/img/def-erp/decisions/e-keep-the-look.webp?v=${ERP_DECISION_SHOTS['e-keep-the-look'].v}`, ...ERP_DECISION_SHOTS['e-keep-the-look'], alt: 'The old and new mini-program home pages side by side, with the same layout.', caption: 'Same layout; every block now reads from the ERP.' },
  },
  {
    question: 'What to build it on?',
    source: 'Mini-program code · Taro 4, React, TypeScript',
    options: [
      { label: 'Native WeChat code', verdict: 'Every screen and login written by hand.' },
      { label: 'Taro with WeChat’s own login', verdict: 'Same stack as the ERP; no new accounts or SMS.', chosen: true },
    ],
    tradeoff: 'Customers without WeChat still order through staff.',
    shot: { src: `/img/def-erp/decisions/e-wechat-signin.webp?v=${ERP_DECISION_SHOTS['e-wechat-signin'].v}`, ...ERP_DECISION_SHOTS['e-wechat-signin'], alt: 'Mini-program sign-in screen with a Sign in with WeChat button and the benefits of linking.', caption: 'Sign in with WeChat; no separate account.' },
  },
  {
    question: 'How does a customer reach their own prices?',
    source: 'Mini-program code · registration and binding',
    options: [
      { label: 'Phone number and SMS', verdict: 'A new account, matched to the ERP by hand.' },
      { label: 'A one-time code from the ERP', verdict: 'Scanning it binds WeChat to the customer record.', chosen: true },
    ],
    evidence: 'Every salon already had an ERP record and prices.',
    tradeoff: 'Staff create one code per customer.',
    shot: { src: `/img/def-erp/decisions/e-pairing-code.webp?v=${ERP_DECISION_SHOTS['e-pairing-code'].v}`, ...ERP_DECISION_SHOTS['e-pairing-code'], alt: 'Store accounts page: a one-time pairing code for Bellezza Milano and the code card sent to the salon.', caption: 'A code on the customer’s ERP record links their WeChat.' },
  },
  {
    question: 'Rebrand now, or launch fast and validate the data?',
    source: 'Mini-program commits · 24 Aug – 28 Sep 2026',
    options: [
      { label: 'Redesign the brand first', verdict: 'Months before a real order reaches the ERP.' },
      { label: 'Launch fast, then rebrand', verdict: 'Real orders prove the data flow first.', chosen: true },
    ],
    diagram: { node: <LaunchPhasesFlow />, caption: 'Phase 1 connected every flow on the familiar look; the rebrand builds on proven data.' },
  },
];

const iterations: IterationItem[] = [
  { date: 'Jun 2026', area: 'Returns', before: 'Pick a sales order first; one return per order.', after: 'Pick the customer, search SKUs into a cart, return across several orders.' },
  { date: 'Jul – Oct', area: 'Packaging units', before: 'Units attached loosely to products; fields drifted.', after: 'Pricing fields consolidated; default unit synced with SKU price and barcode.' },
  { date: 'Oct 6 – 12', area: 'Sales product picker', before: 'Tested standalone product rows against the SPU / SKU picker.', after: 'Ended the trial and removed the variant; kept the original picker and row-merging rules.' },
  { date: 'Sep 2026', area: 'Confirmations', before: 'Browser confirms with “Are you sure?”.', after: 'A shared dialog that lists consequences before stock or money moves.' },
  { date: 'Jun – Sep', area: 'Dashboards', before: 'One page for every login.', after: 'Role dashboards on one skeleton, then real data, chart and filter polish.' },
];

export default function DefErpKitPage() {
  return (
    <div className={wide.widePage}>
    <CaseKitPage>
      <CaseStudyControls showProgress navLabels={navLabels} railTitle="DEF Beauty ERP" />
      <CaseKitSections>
        <div className="case-mobile-back"><CaseStudyBackButton /></div>
        <CaseHero
          eyebrow="Portfolio · Enterprise UX · 2026"
          title="DEF Beauty Supply: designing a unified ERP from fragmented operations"
          intro="I designed a connected ERP for DEF Beauty Supply, bringing customer ordering, inventory, fulfilment, and invoicing around shared business records."
          meta={[
            { label: 'Client', value: 'DEF Beauty Supply' },
            { label: 'Year', value: '2026' },
            { label: 'Role', value: 'Product design & implementation' },
            { label: 'Duration', value: '4 months' },
            { label: 'Industry', value: 'B2B beauty wholesale' },
            { label: 'Tools', value: 'Figma, Codex' },
          ]}
          tags={['Enterprise UX', 'Systems design', 'B2B commerce']}
          glance={{
            items: [
              { label: 'Challenge', body: 'Separate systems left staff checking inventory, re-entering orders, and carrying information between sales and finance.' },
              { label: 'Solution', body: 'A connected customer storefront and ERP, with local delivery rules and records that continue from ordering through fulfilment and invoicing.' },
              { label: 'Outcome', body: 'A month after launch, 86% of orders were placed by customers themselves. Orders enter the ERP directly, and sales can focus on customers.' },
            ],
            deliverables: ['Connected ordering', 'Delivery rules', 'Sales workflow', 'Order-based invoicing'],
          }}
        />

        <CaseChapter label="01 / Overview" title="A wholesale business ready for customers to order directly.">
          <CaseProse><p>DEF Beauty Supply sells professional beauty products to salons in Italy. Customers browsed a WeChat catalogue, then messaged sales to order. I designed and built the ERP behind a new storefront. It is live.</p></CaseProse>
          <CaseStats items={[
            { value: '15', label: 'People across 8 real jobs, mapped to 5 permission roles' },
            { value: '2 → 1', label: 'Disconnected systems replaced by one platform' },
            { value: '5', label: 'Role interviews: sales, warehouse, finance, procurement, owner' },
          ]} />
        </CaseChapter>

        <CaseChapter label="02 / The problem" title="Staff were doing the work between disconnected systems.">
          <CaseFigure caption="Before the ERP · Stock did not sync between catalogue and inventory. Dashed arrows are manual handoffs.">
            <FragmentedOperationsDiagram />
          </CaseFigure>
          <CasePullquote>The same product information was <strong>checked, communicated, and entered again</strong> as work moved from one person to the next.</CasePullquote>
          <CaseProse><p>I audited both systems first. Of 12 business domains, 7 lived in only one system; the other 5 lived in both, with different data.</p></CaseProse>
          <CaseFigure caption="Function audit of the WeChat ordering backend and the MPSOFT inventory tool.">
            <CapabilityMatrix />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="03 / Research" title="The logs showed who did the work. Interviews showed why.">
          <CaseProse><p>First I read MPSOFT’s operation log: <strong>11,489 actions from March to June 2026</strong>, grouped by the account that did them.</p></CaseProse>
          <CaseFigure caption="MPSOFT operation log, March – June 2026, logins excluded. Roles are read from what each account did.">
            <LogRoleLoad />
          </CaseFigure>
          <CaseStats items={[
            { value: '68%', label: 'Of all work ran under one shared counter login: no one could tell who did what' },
            { value: '98%', label: 'Of order approvals came from that same login, often for orders it had just entered' },
            { value: '44%', label: 'Of counter work fell between 16:00 and 19:00, while customers wait at the desk' },
          ]} />
          <CaseProse><p>Then one interview per role, recorded and transcribed. Every finding was checked against the transcript and tagged, so a later interview could overturn it cleanly.</p></CaseProse>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,var(--case-grid-column-min)),1fr))] gap-[var(--case-space-24)]">
            <CaseFigure caption="Interview scripts with handwritten notes.">
              <Image src="/img/def-erp/research-annotated-interviews.webp" alt="Printed interview scripts spread across a desk, with handwritten notes and annotations in blue ink." width={506} height={380} sizes="(min-width: 768px) 50vw, 100vw" />
            </CaseFigure>
            <CaseFigure caption="Recordings and transcripts for cross-role analysis.">
              <Image src="/img/def-erp/research-recordings-transcripts.webp" alt="Audio recordings and text transcripts labelled by warehouse, management, finance, and sales roles." width={823} height={380} sizes="(min-width: 768px) 50vw, 100vw" />
            </CaseFigure>
          </div>
          <CasePullquote>Often a customer is still adding items <strong>right up to the second before loading</strong>. The system only gets in the way.</CasePullquote>
          <p className="m-0 text-[13px] leading-[1.5] text-[#686868]">Sales interview, May 2026, translated from the transcript.</p>
          <ReversalList items={reversals} />
        </CaseChapter>

        <CaseChapter label="04 / Principles" title="Five principles, each traced to evidence.">
          <CaseSteps items={[
            { title: 'Enter once, reuse everywhere', body: 'Product and order data carry through sales, dispatch and invoicing.' },
            { title: 'Automate the routine, keep exceptions human', body: 'Stock and shipping are rules; payment review and exceptions stay with staff.' },
            { title: 'Built to balance, not just to be fast', body: 'Totals follow the supplier invoice’s rounding, because a €0.03 gap breaks reconciliation.' },
            { title: 'The counter has a queue', body: 'On the sales path a customer is waiting: no extra dialogs.' },
            { title: 'AI fills the field; people decide', body: 'OCR writes into editable inputs and flags gaps. It never submits.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="05 / One platform" title="One set of records instead of two linked tools.">
          <CaseProse><p>Linking the two tools would have been quicker. One platform took longer, but gave every role the same records.</p></CaseProse>
          <CaseFigure caption="Three options considered. Evidence: five entities duplicated across both systems, and 50+ daily stock re-entries. Cost: a four-month build and a full stocktake at go-live.">
            <ArchitectureOptions />
          </CaseFigure>
          <CaseFigure caption="The result · Shop counter, mini-program and sales-assisted orders all write to the same ERP records, through fulfilment and invoicing.">
            <UnifiedOperationsDiagram />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="06 / Role dashboards" title="Each role sees its own work on the same data.">
          <CaseProse><p>One page for every login became four views on one shell. Each shows <strong>the work waiting on that role</strong> beside the numbers it checks most.</p></CaseProse>
          <CaseFigure caption="What each dashboard is built around. Card names match the live dashboards below.">
            <RoleBoards />
          </CaseFigure>
          <CaseProse><p>Before and after, Admin shown.</p></CaseProse>
          <BeforeAfterSlider
            beforeSrc="/img/def-erp/legacy-miniprogram-dashboard-crop.png"
            beforeAlt="Legacy ordering system Dashboard: one undifferentiated view mixing sales KPIs, pending approvals, and promotional panels for every user."
            beforeLabel="Before"
            afterSrc="/img/def-erp/evidence/dashboard-admin-v3.webp"
            afterAlt="New Admin dashboard: four tinted KPI tiles with trend lines, quick actions, net sales against the previous period, and an across-teams list of what is waiting on whom."
            afterLabel="After"
            aspectRatio={1.6}
          />
          <DashboardLiveDemo />
        </CaseChapter>

        <CaseChapter label="07 / Sales orders" title="One order, from search to delivery.">
          <DecisionCards items={[packagingDecision]} start={1} />
          <CaseProse><p>How hard the system asks depends on what cannot be undone.</p></CaseProse>
          <CaseFigure caption="Confirmation by consequence. Level 4 is logged as an exception.">
            <ConfirmationLadder />
          </CaseFigure>
          <SalesOrderLiveDemo />
        </CaseChapter>

        <CaseChapter label="08 / Purchasing & invoicing" title="Approval moved to where the order is placed, invoicing to when customers pay.">
          <DecisionCards items={[procurementDecision]} start={2} />
          <CaseCrossLink href="/projects/procurement-agent-kit#case-03-phase-1" kicker="The full purchasing flow, step by step" title="AI Procurement Agent · 03 Phase 1" />
          <PurchasingLiveDemo />
          <CaseFigure caption="Sales wanted to invoice at close; finance invoices after customers settle in batches. Both cadences work.">
            <InvoiceCadence />
          </CaseFigure>
          <InvoicingLiveDemo />
        </CaseChapter>

        <CaseChapter label="09 / Storefront" title="Staff run the storefront; salons order on the look they know.">
          <DecisionCards items={[builderDecision]} start={3} />
          <StorefrontBuilderLiveDemo />
          <CaseProse><p>Salons already ordered through a WeChat mini-program. Every choice below favoured getting all flows live fast.</p></CaseProse>
          <DecisionCards items={miniProgramDecisions} start={4} />
          <CaseProse><p>The customer screens, live on demonstration data.</p></CaseProse>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,var(--case-grid-column-min)),1fr))] gap-[var(--case-space-24)]" aria-label="WeChat mini-program screens">
            <CaseFigure caption="Home — curated categories and salon products.">
              <CaseDevicePreview src="/demos/def-mini-program/screen.html?screen=home" title="DEF mini-program — Home" />
            </CaseFigure>
            <CaseFigure caption="Catalog — browse products by category.">
              <CaseDevicePreview src="/demos/def-mini-program/screen.html?screen=catalog" title="DEF mini-program — Catalog" />
            </CaseFigure>
            <CaseFigure caption="Product — capacity, customer price, and product details.">
              <CaseDevicePreview src="/demos/def-mini-program/screen.html?screen=product" title="DEF mini-program — Product" />
            </CaseFigure>
            <CaseFigure caption="Cart — quantities and VAT-inclusive totals.">
              <CaseDevicePreview src="/demos/def-mini-program/screen.html?screen=cart" title="DEF mini-program — Cart" />
            </CaseFigure>
            <CaseFigure caption="Sign in — customer access and account benefits.">
              <CaseDevicePreview src="/demos/def-mini-program/screen.html?screen=signin" title="DEF mini-program — Sign in" />
            </CaseFigure>
            <CaseFigure caption="Account — customer balances and order progress.">
              <CaseDevicePreview src="/demos/def-mini-program/screen.html?screen=account" title="DEF mini-program — Account" />
            </CaseFigure>
            <CaseFigure caption="Link account — pair the mini-program with an ERP customer.">
              <CaseDevicePreview src="/demos/def-mini-program/screen.html?screen=bind" title="DEF mini-program — Link account" />
            </CaseFigure>
            <CaseFigure caption="Order details — payment, dispatch, and tracking.">
              <CaseDevicePreview src="/demos/def-mini-program/screen.html?screen=order" title="DEF mini-program — Order details" />
            </CaseFigure>
          </div>
        </CaseChapter>

        <CaseChapter label="10 / How it was built" title="A shared system, and 381 commits of iteration.">
          <CaseStats items={[
            { value: 'Calm', label: 'Colour only with meaning' },
            { value: 'Layered', label: 'Surfaces, not lines' },
            { value: 'Precise', label: 'Every value on a scale' },
          ]} />
          <CaseProse><p>Written rules plus reusable components gave design and the coding agent one reference. Step through it; the controls are live.</p></CaseProse>
          <DesignSystemShowcase />
          <CaseStats items={[
            { value: '48', label: 'Commits on packaging units, the most reworked model' },
            { value: '39', label: 'Commits on invoicing' },
            { value: '37', label: 'Commits on returns and refunds' },
          ]} />
          <IterationLog items={iterations} />
        </CaseChapter>

        <CaseChapter label="11 / Results" title="Customers now place most orders themselves.">
          <CaseStats items={[
            { value: '86%', label: 'Orders placed by customers themselves · one-week sample, a month after launch' },
            { value: '5 → 3', label: 'Steps in the wholesale ordering flow' },
            { value: '~40', label: 'Orders a day keyed in by hand before launch (log median); they now arrive without re-entry' },
          ]} />
          <CaseProse>
            <ul>
              <li><strong>Orders arrive directly</strong> against real stock and prices, so stockouts after ordering almost disappeared.</li>
              <li><strong>Sales focus on customers</strong> instead of re-entering orders.</li>
              <li><strong>Finance invoices from orders</strong>, and customers track dispatch in the mini-program.</li>
            </ul>
            <p>Fewer errors and stockouts are reported by staff, not measured.</p>
          </CaseProse>
        </CaseChapter>

        <CaseClose label="12 / Reflection" title="What I learned">
          <CaseProse>
            <ul>
              <li><strong>Shared records need clear handoffs</strong>, or information stops being useful between roles.</li>
              <li><strong>Rules remove routine checks</strong>; payments, exceptions and invoice changes still need people.</li>
              <li><strong>Next:</strong> measure processing and invoicing time, and extend tracking past dispatch.</li>
            </ul>
          </CaseProse>
        </CaseClose>
      </CaseKitSections>
    </CaseKitPage>
    </div>
  );
}
