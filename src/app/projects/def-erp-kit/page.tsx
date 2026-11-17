import type { Metadata } from 'next';
import Image from 'next/image';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import { CaseKitControls as CaseStudyControls } from '../../components/CaseStudyControls';
import FragmentedOperationsDiagram from './FragmentedOperationsDiagram';
import UnifiedOperationsDiagram from './UnifiedOperationsDiagram';
import BeforeAfterSlider from '../def-erp/BeforeAfterSlider';
import { DecisionCards, ReversalList, type Decision, type Reversal } from '../procurement-agent-kit/DecisionCards';
import DashboardLiveDemo from './DashboardLiveDemo';
import DesignSystemShowcase from './DesignSystemShowcase';
import wide from './DefDecisions.module.css';
import { InvoicingLiveDemo, PurchasingLiveDemo, SalesOrderLiveDemo, StorefrontBuilderLiveDemo } from './ErpLiveDemo';
import { ArchitectureOptions, CapabilityMatrix, ConfirmationLadder, IterationLog, InvoiceCadence, type IterationItem } from './DefDecisions';
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
  '05 / Iteration',
  '06 / Design system',
  '07 / The solution',
  '08 / Results',
  '09 / Reflection',
];

const reversals: Reversal[] = [
  { before: 'Hide real stock from customers.', evidence: 'The owner disagreed: customers can see it, opened up by login and order history later.', after: 'Visibility is a per-identity policy (anonymous, signed in, has ordered), never hard-coded.', source: 'UX.md · sales → owner' },
  { before: 'Invoice the moment an order closes.', evidence: 'Finance: B2B customers pay in batches, then ask for an invoice.', after: 'Invoice from paid orders, merge several orders, skip lines already invoiced.', source: 'UX.md · finance' },
  { before: 'Lock the order after approval, then issue the delivery note.', evidence: 'Customers add goods until the second before loading. Staff cope by reopening a new order.', after: 'Delivery notes are decoupled from the order; shipments are tracked per delivery, partial included.', source: 'UX.md · sales' },
  { before: 'The owner’s top pain is the whole picture.', evidence: 'Sales named a different pain: order and delivery-note coupling. Neither was wrong.', after: 'Solve both. The channel gap (stock, orders) and the loading-day edits each got a fix.', source: 'UX.md · owner vs sales' },
];

const miniProgramDecisions: Decision[] = [
  {
    question: 'Redesign the storefront, or keep the look salons know?',
    source: 'Mini-program · home, sign-in, account',
    options: [
      { label: 'A fresh visual redesign', verdict: 'More to show, but salons reorder from habit and would have to relearn it.' },
      { label: 'Keep the layout, replace what is behind it', verdict: 'Same blocks in the same places; each now reads live ERP stock, euro prices and tax rates.', chosen: true },
    ],
    evidence: 'Customers already ordered from the old home page; the problem was the data behind it, not the layout.',
    tradeoff: 'The before and after look alike. The change is in what the blocks are connected to.',
  },
  {
    question: 'What to build it on?',
    source: 'Mini-program code · Taro 4, React, TypeScript',
    options: [
      { label: 'Native WeChat code, from scratch', verdict: 'Full control, but every screen and the login flow would be written by hand.' },
      { label: 'Taro with WeChat’s own login', verdict: 'React and TypeScript like the ERP, and customers sign in with their WeChat account. No separate accounts, passwords or SMS.', chosen: true },
    ],
    evidence: 'The same React and TypeScript skills build both the ERP and the storefront, and WeChat login was already there to use.',
    tradeoff: 'The storefront lives inside WeChat. Customers who do not use WeChat still order through staff.',
  },
  {
    question: 'How does a customer reach their own prices and history?',
    source: 'Mini-program code · registration and binding',
    options: [
      { label: 'Phone number and SMS sign-up', verdict: 'Familiar, but creates a new account that still has to be matched to the ERP by hand.' },
      { label: 'A one-time code from the ERP', verdict: 'Staff generate a code on the customer’s record; scanning it binds WeChat to that record, prices and orders included.', chosen: true },
    ],
    evidence: 'Every salon already had an ERP customer record with its own prices. The SMS step was removed once binding by code worked.',
    tradeoff: 'Staff create one code per customer before the customer can see their own prices.',
  },
  {
    question: 'Rebrand now, or launch fast and validate the data first?',
    source: 'Mini-program commits · 24 Aug – 28 Sep 2026',
    options: [
      { label: 'Redesign the brand before launch', verdict: 'A stronger first impression, but months before any real order reaches the ERP.' },
      { label: 'Phase 1: launch fast, connect and validate the data', verdict: 'Browsing, cart, checkout, orders and account binding went live on the existing look, so real orders could prove the data flow.', chosen: true },
    ],
    evidence: 'The value was orders arriving in the ERP without re-entry. The full brand redesign is scheduled as the focus of phase 2.',
    tradeoff: 'The brand stays as it was until phase 2.',
  },
];

const builderDecision: Decision = {
  question: 'A free-form canvas, or a fixed set of modules?',
  source: 'Storefront builder code · home layout schema',
  options: [
    { label: 'Free-form page editor', verdict: 'Any layout is possible, but staff are not designers, and a broken page goes straight to every salon.' },
    { label: 'Stacked modules, draft before publish', verdict: 'Staff add, reorder and configure ready-made modules. Edits stay in a draft until someone publishes them.', chosen: true },
  ],
  evidence: 'Draft and live layouts are stored separately. Products come from ERP records, and Frequent products fills itself from order history.',
  tradeoff: 'Less layout freedom, and every new module type needs development: video and coupons are still marked planned.',
};

const procurementDecision: Decision = {
    question: 'Keep the purchase request → approval → order chain?',
    source: 'Procurement redesign doc · decision log',
    options: [
      { label: 'Keep request, approval and order as separate stages', verdict: 'Three demand lines were half-wired; with a small team it becomes approving your own request.' },
      { label: 'Delete the request tables', verdict: 'Loses data and the room to grow if the team scales.' },
      { label: 'Fold approval into placing the order', verdict: 'Placing an order requires confirmed prices and an uploaded supplier confirmation. Tables stay, hidden.', chosen: true },
    ],
    evidence: 'Request routes were unreachable from navigation, and no one reviews amounts full-time.',
    tradeoff: 'Control applies to the whole order, not each line request. A return-to-draft safety valve is admin-only.',
  };

const packagingDecision: Decision = {
    question: 'Where do packaging units (piece, box, carton) live?',
    source: 'Packaging units code spec',
    options: [
      { label: 'On the product, shared by every SKU', verdict: 'Shades of one product can be priced differently.' },
      { label: 'On each SKU, with stock counted in one base unit', verdict: 'One stock number; split sales convert automatically; each tier has its own price.', chosen: true },
    ],
    evidence: 'The same SKU is sold by piece, box and carton at separate prices.',
    tradeoff: 'Legacy SKUs that stored a box as their unit needed migrating, and the model was reworked in 48 commits.',
  };

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
      <CaseStudyControls navLabels={navLabels} railTitle="DEF Beauty ERP" />
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
              { label: 'Outcome', body: 'In a one-week sample about a month after launch, 86% of orders were placed by customers themselves. Orders now enter the ERP directly, order errors have almost disappeared, and sales can focus on customers.' },
            ],
            deliverables: ['Connected ordering', 'Delivery rules', 'Sales workflow', 'Order-based invoicing'],
          }}
        />

        <CaseChapter label="01 / Overview" title="A wholesale business ready for customers to order directly.">
          <CaseProse>
            <p>DEF Beauty Supply sells professional beauty products to salons in Italy. Customers browsed a WeChat mini-program catalogue, then messaged sales to order. I designed and built the ERP behind a new storefront: ordering, sales, inventory, fulfilment and invoicing on shared records. It is live.</p>
          </CaseProse>
          <CaseStats items={[
            { value: '15', label: 'People across 8 real jobs, mapped to 5 permission roles' },
            { value: '2 → 1', label: 'Disconnected systems replaced by one platform' },
            { value: '5', label: 'Role interviews: sales, warehouse, finance, procurement, owner' },
          ]} />
        </CaseChapter>

        <CaseChapter label="02 / The problem" title="Staff were doing the work between disconnected systems.">
          <CaseFigure caption="Before the ERP: stock did not sync between the catalogue and inventory platform. Dashed arrows are manual handoffs for orders, dispatch updates, and invoice items. Scroll horizontally on smaller screens.">
            <FragmentedOperationsDiagram />
          </CaseFigure>
          <CasePullquote>The same product information was repeatedly checked, communicated, and entered as work moved from one person to the next.</CasePullquote>
          <CaseProse>
            <h3>I audited both systems before drawing anything</h3>
            <p>Of 12 business domains, 7 existed in only one system. The other 5 existed in both, with different data.</p>
          </CaseProse>
          <CaseFigure caption="Function audit of the WeChat ordering backend and the MPSOFT inventory tool, from screenshots of every module. Source: my research analysis report, May 2026.">
            <CapabilityMatrix />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="03 / Research" title="Five interviews, and what they overturned.">
          <CaseProse>
            <p>I interviewed one person per role, recorded and transcribed each, used AI to cluster repeated problems, then checked every finding against the transcript. Findings went into one file, UX.md, with every line tagged: interview, code, decision or assumption. Tags let a rule be overturned cleanly when a later interview contradicts it.</p>
          </CaseProse>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,var(--case-grid-column-min)),1fr))] gap-[var(--case-space-24)]">
            <CaseFigure caption="Interview scripts with handwritten notes.">
              <Image src="/img/def-erp/research-annotated-interviews.webp" alt="Printed interview scripts spread across a desk, with handwritten notes and annotations in blue ink." width={506} height={380} sizes="(min-width: 768px) 50vw, 100vw" />
            </CaseFigure>
            <CaseFigure caption="Recordings and transcripts for cross-role analysis.">
              <Image src="/img/def-erp/research-recordings-transcripts.webp" alt="Audio recordings and text transcripts labelled by warehouse, management, finance, and sales roles." width={823} height={380} sizes="(min-width: 768px) 50vw, 100vw" />
            </CaseFigure>
          </div>
          <CasePullquote>Often a customer is still adding items right up to the second before loading. The system only gets in the way.</CasePullquote>
          <p className="m-0 text-[13px] leading-[1.5] text-[#686868]">Sales interview, May 2026, translated from the transcript.</p>
          <CaseProse>
            <h3>Four assumptions the evidence changed</h3>
          </CaseProse>
          <ReversalList items={reversals} />
        </CaseChapter>

        <CaseChapter label="04 / Principles" title="Five principles, each traced to evidence.">
          <CaseSteps items={[
            { title: 'Enter once, reuse across the workflow', body: 'Product and order data carry through sales, dispatch and invoicing. No retyping between roles.' },
            { title: 'Automate the routine, keep exceptions human', body: 'Stock, delivery options and shipping costs are rules. Payment review, fulfilment exceptions and invoice adjustments stay with staff, and are recorded.' },
            { title: 'Built to balance, not just to be fast', body: 'Purchase totals copy the supplier invoice’s rounding order, because a €0.03 gap breaks every reconciliation. Simplifying the maths would defeat the page.' },
            { title: 'The counter has a queue', body: 'Anything on the sales path is timed by the customers waiting behind. Hold and resume stay one step; no dialogs there.' },
            { title: 'AI fills the field; people decide', body: 'OCR writes into editable inputs and flags gaps. It never submits.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="05 / Iteration" title="381 commits in 5 months. Some went the other way.">
          <CaseStats items={[
            { value: '48', label: 'Commits on packaging units, the most reworked model' },
            { value: '39', label: 'Commits on invoicing' },
            { value: '37', label: 'Commits on returns and refunds' },
          ]} />
          <IterationLog items={iterations} />
          <p className="m-0 text-[13px] leading-[1.5] text-[#686868]">Counts and dates from the project’s git history, 25 May to 7 Nov 2026, matched by commit-message keyword.</p>
        </CaseChapter>

        <CaseChapter label="06 / Design system" title="A shared system, from design to code.">
          <CaseStats items={[
            { value: 'Calm', label: 'Colour only with meaning' },
            { value: 'Layered', label: 'Surfaces, not lines' },
            { value: 'Precise', label: 'Every value on a scale' },
          ]} />
          <CaseProse>
            <p><strong>Calm:</strong> one blue for action, softened status colours. <strong>Layered:</strong> base, raised and sunken surfaces with soft card depth carry the hierarchy. <strong>Precise:</strong> six nested radii, a 4px scale, tabular numbers, and motion only where it explains a change.</p>
          </CaseProse>
          <CaseProse>
            <p>Written rules plus reusable components give design and the coding agent one shared reference. Step through it below; the controls and patterns are live and use demonstration data.</p>
          </CaseProse>
          <DesignSystemShowcase />
        </CaseChapter>

        <CaseChapter label="07 / The solution" title="Connect each step to the information already available.">
          <CaseProse>
            <p>The storefront and internal teams now work from shared ERP records. Product and inventory data support customer ordering, and the same order continues into fulfilment and invoicing.</p>
          </CaseProse>
          <CaseProse>
            <h3>Three order channels, one ERP</h3>
            <p>The platform supports three ways to create an order, all feeding the same ERP records:</p>
            <ul>
              <li><strong>In-store checkout:</strong> staff create orders at the store’s sales counter.</li>
              <li><strong>Mini-program orders:</strong> customer submissions appear directly in the ERP, without sales re-entering them.</li>
              <li><strong>Sales-assisted orders:</strong> sales staff create orders on a customer’s behalf.</li>
            </ul>
          </CaseProse>
          <CaseProse>
            <p><strong>Trade-off: how to join two systems.</strong> Linking the two tools would have been quicker; one platform meant a longer build but a single set of records.</p>
          </CaseProse>
          <CaseFigure caption="Three options considered. Evidence: five entities duplicated across both systems, and roughly 50+ daily stock re-entries in my diagnosis. Cost I accepted: a four-month build, and a full stocktake as the go-live baseline, because the owner’s biggest worry was losing data.">
            <ArchitectureOptions />
          </CaseFigure>
          <CaseFigure caption="The result: shared ERP records connect ordering, fulfilment, and invoicing, with staff retaining review and approval.">
            <UnifiedOperationsDiagram />
          </CaseFigure>
          <CaseProse>
            <h3>Role-based dashboards</h3>
            <p>Each role sees a different view of the same business data. Admin monitors the business overall, sales focuses on orders and customer follow-ups, warehouse tracks stock and dispatch tasks, and finance reviews payments and invoices. A shared layout keeps the system familiar while making each role’s priorities visible.</p>
          </CaseProse>
          <BeforeAfterSlider
            beforeSrc="/img/def-erp/legacy-miniprogram-dashboard-crop.png"
            beforeAlt="Legacy ordering system Dashboard: one undifferentiated view mixing sales KPIs, pending approvals, and promotional panels for every user."
            beforeLabel="Before"
            afterSrc="/img/def-erp/evidence/dashboard-admin-v3.webp"
            afterAlt="New Admin dashboard: four tinted KPI tiles with trend lines, quick actions, net sales against the previous period, and an across-teams list of what is waiting on whom."
            afterLabel="After"
            aspectRatio={1.6}
          />
          <p className="m-0 text-[13px] leading-[1.5] text-[#686868]">
            Before: one Dashboard page for every login, mixing task types that belonged to different jobs. After: the same shell, reweighted per role — this is the Admin view.
          </p>
          <CaseProse>
            <p>The four dashboards running on demonstration data, one role at a time. Watch, or move your pointer in and use them yourself. Nothing is saved.</p>
          </CaseProse>
          <DashboardLiveDemo />
          <CaseProse>
            <h3>One order, from search to delivery</h3>
            <p>Two trade-offs shaped the sales screens: how packaging units are modelled, and when the system asks before acting.</p>
          </CaseProse>
          <DecisionCards items={[packagingDecision]} />
          <CaseProse>
            <p><strong>Trade-off: when to ask “are you sure?”</strong> Committed stock and money actions have no undo, so the default is to confirm and state the consequence. The sales counter breaks the rule on purpose: a customer is waiting.</p>
          </CaseProse>
          <CaseFigure caption="Confirmation policy by consequence. Level 4 is logged as an exception. 21 native browser confirms still break the policy, tracked by file; none may be added.">
            <ConfirmationLadder />
          </CaseFigure>
          <CaseProse>
            <p>These are the real pages running on demonstration data, played one module at a time. Watch, or move your pointer in and use them yourself. Nothing is saved.</p>
          </CaseProse>
          <SalesOrderLiveDemo />

          <CaseProse>
            <h3>Purchasing and receiving</h3>
            <p>Purchase orders carry product and quantity information through supplier confirmation and receiving. The main trade-off was how much approval a small team needs. The demo below uses the real pages on demonstration data; nothing is saved. For the complete procurement workflow and its AI-assisted optimisation, see <a href="/projects/procurement-agent-v2">AI Procurement Agent for DEF Beauty Supply</a>.</p>
          </CaseProse>
          <DecisionCards items={[procurementDecision]} />
          <PurchasingLiveDemo />

          <CaseProse>
            <h3>Order-based invoicing</h3>
            <p>Finance creates invoices from existing sales orders, reusing product details, quantities, prices and tax rates.</p>
            <p><strong>Trade-off: when an order becomes an invoice.</strong> The one documented conflict between roles. I did not side with either.</p>
          </CaseProse>
          <CaseFigure caption="Sales wanted to invoice at close; finance invoices after customers settle in batches. Both cadences work in the product.">
            <InvoiceCadence />
          </CaseFigure>
          <CaseProse>
            <p>The real invoicing page on demonstration data; nothing is issued.</p>
          </CaseProse>
          <InvoicingLiveDemo />

          <CaseProse>
            <h3>Storefront builder</h3>
            <p>Staff edit the mini-program home page module by module, with the real mini-program as the preview, and link each customer’s WeChat account to their ERP record.</p>
          </CaseProse>
          <DecisionCards items={[builderDecision]} />
          <StorefrontBuilderLiveDemo />
          <CaseProse>
            <h3>WeChat mini-program: the trade-offs</h3>
            <p>Salons already ordered through a WeChat mini-program. The goal was to get every flow working and live quickly, so each choice below favours speed and familiarity, and names what it gave up.</p>
          </CaseProse>
          <DecisionCards items={miniProgramDecisions} />
          <div className="grid grid-cols-1 gap-[var(--case-space-24)] md:grid-cols-3">
            {([
              {
                name: 'Home',
                before: '/img/def-erp/storefront-home-legacy-full.webp',
                after: '/img/def-erp/storefront-home-new-v2.webp',
                beforeAlt: 'The old WeChat mini-program home page: search, banner carousel, eight category icons, and a scrolling row of brand logos, with the bottom tab bar.',
                afterAlt: 'The rebuilt mini-program home page: search, banner carousel, announcement strip, the same eight categories, a featured brands row, and a salon essentials group, with the bottom tab bar.',
              },
              {
                name: 'Sign in',
                before: '/img/def-erp/storefront-signin-legacy.webp',
                after: '/img/def-erp/storefront-signin-new-v2.webp',
                beforeAlt: 'The old mini-program login page: the shop logo, WeChat authorisation and account sign-in buttons, and a terms checkbox.',
                afterAlt: 'The rebuilt sign-in screen: a customer channel banner, three reasons to sign in, and a Sign in with WeChat button above the bottom tab bar.',
              },
              {
                name: 'Account',
                before: '/img/def-erp/storefront-account-legacy.webp',
                after: '/img/def-erp/storefront-account-new-v2.webp',
                beforeAlt: 'The old mini-program personal centre: member name, coin balances, order shortcuts, and a grid of colourful function icons.',
                afterAlt: 'The rebuilt account screen: account overview with outstanding and prepaid balances, restock requests, and a list of orders with status filters.',
              },
            ] as const).map((item) => (
              <div key={item.name} className="mx-auto flex w-full flex-col items-center gap-3" style={{ maxWidth: 330 }}>
                {/* 手机外壳：深色粗边 + 大圆角，让对比图看起来是在真机屏幕里 */}
                <div
                  className="w-full"
                  style={{
                    border: '8px solid #1b1d21',
                    borderRadius: 40,
                    overflow: 'hidden',
                    background: '#1b1d21',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.08)',
                  }}
                >
                <BeforeAfterSlider
                  beforeSrc={item.before}
                  beforeAlt={item.beforeAlt}
                  beforeLabel="Before"
                  afterSrc={item.after}
                  afterAlt={item.afterAlt}
                  afterLabel="After"
                  aspectRatio={0.4615}
                  hideHint
                />
                </div>
                <p className="m-0 text-[13px] leading-[1.5] text-[#686868]">{item.name}</p>
              </div>
            ))}
          </div>
          <p className="m-0 text-[13px] leading-[1.5] text-[#686868]">
            The mini-program Home, Sign in and Account screens, before and after. Drag the handle to compare. The layout stayed familiar on purpose, while each block is now configured from the ERP.
          </p>
          <CaseProse>
            <p>Explore the customer-facing screens below. Each phone keeps its header and bottom navigation in place while its content scrolls independently; customer support stays within reach on Home. These read-only previews use demonstration data.</p>
          </CaseProse>
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

        <CaseChapter label="08 / Results" title="Customers now place most orders themselves.">
          <CaseStats items={[
            { value: '86%', label: 'Orders placed by customers themselves · one-week sample, about a month after launch' },
            { value: '5 → 3', label: 'Steps in the wholesale ordering flow' },
            { value: '40–70', label: 'Daily orders that 4 to 5 salespeople used to key in by hand; they now arrive without re-entry' },
          ]} />
          <CaseProse>
            <ul>
              <li>A connected ERP for customer ordering and internal operations, delivered in four months and now in use.</li>
              <li>Mini-program orders enter the ERP directly, without sales repeating stock checks or entering the order again. Customers order against real ERP stock, prices and delivery costs, so stockouts after ordering have almost disappeared.</li>
              <li>Order errors almost disappeared and customer back-and-forth dropped, freeing salespeople to develop and maintain customer accounts.</li>
              <li>Finance reuses sales order details for invoicing, with previously invoiced products excluded from future selection.</li>
              <li>Customers can check dispatched status and tracking numbers in the mini-program.</li>
              <li>The owner reported less repetitive work across sales and warehouse operations, giving sales more time for customer relationships and new business.</li>
            </ul>
            <p>The 86% comes from a one-week sample about a month after launch. Improvements in order errors and stockouts are reported qualitatively, not as counts, and customer acquisition gains have not been measured.</p>
          </CaseProse>
        </CaseChapter>

        <CaseClose label="09 / Reflection" title="What I Learned">
          <CaseProse>
            <ul>
              <li>A shared source of truth depends on connected records and clear handoffs, so information stays useful as work moves between roles.</li>
              <li>Different roles need different views of the same data, with relevant tasks and responsibilities visible.</li>
              <li>Business rules can remove routine checks, while payment review, customer exceptions, and invoice adjustments still need human judgment.</li>
              <li>The next step is to measure order-processing time, invoice preparation, and the exceptions that still require staff coordination.</li>
              <li>Customer visibility currently ends at dispatched status and the tracking number; logistics integration could extend it.</li>
            </ul>
          </CaseProse>
          <CaseProse>
            <p>The purchasing and receiving workflow, including document checks, partial arrivals, and discrepancy handling, is covered in <a href="/projects/procurement-agent-v2">AI Procurement Agent for DEF Beauty Supply</a>.</p>
          </CaseProse>
        </CaseClose>
      </CaseKitSections>
    </CaseKitPage>
    </div>
  );
}
