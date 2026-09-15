import type { Metadata } from 'next';
import Image from 'next/image';
import CaseStudyBackButton from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/CaseStudyControls';
import CaseStudyHero from '../../components/CaseStudyHero';
import BeforeAfterSlider from './BeforeAfterSlider';
import DashboardSwitcher from './DashboardSwitcher';
import EcosystemDiagram from './EcosystemDiagram';
import { LiveDashboardWidgets, LivePackagingPricing, LivePurchaseCostCalculator } from './live/LiveComponents';
import { fontFamily } from '@/lib/design-tokens';

export const metadata: Metadata = {
  title: 'ERP Platform for DEF Beauty Supply | Mei Chai',
  description:
    'Redesigned a B2B beauty wholesaler’s operating system as a small set of rules, not a stack of screens: one dashboard skeleton for five roles, one status model, one confirmation policy with a logged exception, and orders that track shipment and payment separately.',
};

const tldrPoints = [
  {
    label: 'Context',
    body:
      'DEF Beauty Supply is a B2B beauty wholesaler in Italy running on a legacy desktop inventory tool plus a disconnected WeChat ordering system. Fifteen people, real day-to-day operations, no shared source of truth. I designed and built the replacement, solo.',
  },
  {
    label: 'Approach',
    body:
      'Instead of designing screen by screen, I built a small number of rules that hold across 40+ screens: one dashboard skeleton reweighted per role, one status model, one confirmation policy, and independent shipment and payment tracks on every order.',
  },
  {
    label: 'Evidence',
    body:
      'Five structured interviews became a single evidence-tiered file that traces every rule back to a specific source, and drops assumptions the moment they get contradicted by a later interview.',
  },
  {
    label: 'Example',
    body:
      'The platform confirms every irreversible action, except the one screen with a live customer queue. That exception came from a counter interview, and it is logged as a deliberate rule, not a shortcut.',
  },
  {
    label: 'Status',
    body:
      'MVP, shipped and in daily use across all core modules. Built solo, with an AI coding agent as implementation partner, and checked by a Playwright suite covering the money and inventory invariants that matter most once an action can’t be undone.',
  },
];

/** DEF ERP's own primary brand blue (web/src/index.css --primary, darkened from #197afa for WCAG AA), not a portfolio-picked accent. */
const accent = '#1366d6';
const accentInverse = '#7fbaff';

const sectionPadX = {
  paddingInline: 'clamp(24px, 5vw, 64px)',
} as const;

function sectionBandProps(band: 'white' | 'gray' | 'ink', clip = true) {
  const background =
    band === 'white' ? 'bg-white' : band === 'gray' ? 'bg-[#f4f4f4]' : 'bg-[#161616]';
  return {
    className: ['def-erp-section', clip && 'overflow-x-clip', background].filter(Boolean).join(' '),
    'data-band': band,
    style: sectionPadX,
  };
}

const bodyStyle = {
  fontFamily: fontFamily.sans,
} as const;

function ChapterTitle({ children, inverse = false }: { children: string; inverse?: boolean }) {
  return (
    <p
      data-case-type="eyebrow"
      className="case-study-eyebrow m-0"
      style={{ ...bodyStyle, color: inverse ? accentInverse : accent }}
    >
      {children}
    </p>
  );
}

function FigureCaption({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 max-w-[760px] text-[13px] font-normal leading-[1.55] text-[#686868]" style={bodyStyle}>
      {children}
    </p>
  );
}

function Callout({ label, inverse = false, children }: { label: string; inverse?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`case-radius-lg overflow-hidden border-l-[4px] px-[clamp(20px,3vw,28px)] py-6 ${
        inverse ? 'bg-[#202020]' : 'bg-[#f4f4f4]'
      }`}
      style={{ borderColor: accent }}
    >
      <p
        className="m-0 text-[11px] font-bold uppercase tracking-[0.05em]"
        style={{ ...bodyStyle, color: inverse ? accentInverse : accent }}
      >
        {label}
      </p>
      <div className={`m-0 mt-3 max-w-[880px] text-[15px] font-normal leading-[1.6] ${inverse ? 'text-[#d8d8d8]' : 'text-[#3b3b3b]'}`} style={bodyStyle}>
        {children}
      </div>
    </div>
  );
}

/** 01 / Context */
function ContextSection() {
  return (
    <div className="flex max-w-[1080px] flex-col gap-10" data-case-nav-label="01 / Context">
      <ChapterTitle>01 / Context</ChapterTitle>
      <h2 className="m-0 max-w-[900px] text-[clamp(30px,4.2vw,46px)] font-bold leading-[1.1] tracking-[-0.025em] text-[#161616]" style={bodyStyle}>
        Fifteen people, eight real jobs, <span style={{ color: accent }}>one spreadsheet-shaped tool.</span>
      </h2>
      <div className="flex max-w-[900px] flex-col gap-4 [&_strong]:font-bold [&_strong]:text-[#161616]">
        <p className="m-0 text-[17px] font-normal leading-[1.65] text-[#3b3b3b]" style={bodyStyle}>
          DEF Beauty Supply sells professional nail, hair, and beauty products wholesale to salons across Italy, through a legacy desktop inventory tool and a WeChat mini-program that never talked to each other. <strong>Neither system knew what the other believed was true.</strong>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden case-radius-lg bg-[#d8d8d8] sm:grid-cols-4">
        {[
          { stat: '15', label: 'people running the business daily' },
          { stat: '8', label: 'real jobs, from counter sales to driver' },
          { stat: '5', label: 'permission roles the system actually has' },
          { stat: '2', label: 'disconnected systems, one truth each' },
        ].map((item) => (
          <div key={item.label} className="flex flex-col gap-1 bg-white p-[clamp(16px,2.4vw,22px)]">
            <span className="text-[28px] font-bold leading-none" style={{ ...bodyStyle, color: accent }}>{item.stat}</span>
            <span className="text-[12px] font-normal leading-[1.4] text-[#686868]" style={bodyStyle}>{item.label}</span>
          </div>
        ))}
      </div>

      <p className="m-0 max-w-[880px] text-[15px] font-normal leading-[1.6] text-[#686868]" style={bodyStyle}>
        The gap between 8 real jobs and 5 permission roles is real; I kept it visible instead of inventing roles nobody asked for.
      </p>
    </div>
  );
}

/** 02 / Before */
function BeforeSection() {
  return (
    <div className="flex flex-col gap-10" data-case-nav-label="02 / Before">
      <ChapterTitle>02 / Before</ChapterTitle>
      <h2 className="m-0 max-w-[900px] text-[clamp(28px,3.8vw,42px)] font-bold leading-[1.12] tracking-[-0.02em] text-[#161616]" style={bodyStyle}>
        What &ldquo;replace the old system&rdquo; actually meant.
      </h2>
      <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
        Storefront, sales, inventory, procurement, receiving, finance: six parts feeding each other. <strong className="font-bold text-[#161616]">None of that was one system.</strong> Every arrow below was, in practice, a person re-typing what another screen already knew.
      </p>
      <div className="case-radius-lg overflow-hidden border border-[#e2e2e2] bg-white p-[clamp(20px,3vw,32px)]">
        <EcosystemDiagram />
      </div>
      <FigureCaption>
        The business this had to serve, drawn as one system. It never was one system: see the actual purchasing screen, dragged against its replacement, in chapter 05.
      </FigureCaption>
    </div>
  );
}

/** 03 / Research system */
function ResearchSystemSection() {
  return (
    <div className="flex max-w-[1080px] flex-col gap-10" data-case-nav-label="03 / Research System">
      <ChapterTitle>03 / Research System</ChapterTitle>
      <h2 className="m-0 max-w-[900px] text-[clamp(28px,3.8vw,42px)] font-bold leading-[1.12] tracking-[-0.02em] text-[#161616]" style={bodyStyle}>
        Five interviews became one file the design has to answer to.
      </h2>
      <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
        I interviewed sales, warehouse, finance, procurement, and the owner, one person per role. Instead of writing a research summary and moving on, I built the findings into a single living file (<code>UX.md</code>) that every design decision, mine or the AI agent&apos;s, has to cite. Every line carries a source tag:
      </p>

      <div className="case-radius-lg overflow-hidden grid gap-px bg-[#d8d8d8] sm:grid-cols-2 lg:grid-cols-4">
        {[
          { tag: '[Interview]', body: 'Traced to a specific person and date. Highest authority. Overrides everything else when it conflicts.' },
          { tag: '[Code]', body: 'Verifiable directly in the repository right now.' },
          { tag: '[Decision]', body: 'Already settled and written down, not open for silent reinterpretation.' },
          { tag: '[Assumption]', body: 'Not yet validated. The agent is told not to treat it as fact.' },
        ].map((item) => (
          <article key={item.tag} className="flex min-h-[168px] flex-col gap-3 bg-white p-[clamp(18px,2.4vw,24px)]">
            <p className="m-0 text-[13px] font-bold" style={{ ...bodyStyle, color: accent }}>{item.tag}</p>
            <p className="m-0 text-[13px] font-normal leading-[1.55] text-[#555]" style={bodyStyle}>{item.body}</p>
          </article>
        ))}
      </div>

      <Callout label="Why this matters">
        A tag isn&apos;t bureaucracy for its own sake. <strong className="font-bold text-[#161616]">It is what lets a rule get overturned cleanly.</strong> One salesperson told me the business deliberately hides real stock from customers, to avoid looking weak to competitors. That became a design constraint. Later, the owner said the opposite: stock visibility should open up gradually, based on whether a customer is logged in and has ordered before. That interview won. The file records both, marks the first one superseded, and explains why, instead of quietly picking a side.
      </Callout>
    </div>
  );
}

/** 04 / One skeleton, five roles */
const dashboardShots = [
  {
    src: '/img/def-erp/dashboard-admin-v3.png',
    label: 'Admin',
    focus: 'Full operating snapshot: revenue, orders, receivables, customer mix, in one view.',
  },
  {
    src: '/img/def-erp/dashboard-sales-v3.png',
    label: 'Sales',
    focus: 'Orders to ship, overdue customers, unfollowed accounts. The queue a salesperson actually works.',
  },
  {
    src: '/img/def-erp/dashboard-finance-v3.png',
    label: 'Finance',
    focus: 'Payment approvals batched by method, overdue receivables, invoices still to issue.',
  },
  {
    src: '/img/def-erp/dashboard-warehouse-v3.png',
    label: 'Warehouse',
    focus: '"Rush to store" walk-in items, near-expiry batches, incoming receipts to confirm.',
  },
];

function RoleDashboardsSection() {
  return (
    <div className="flex flex-col gap-10" data-case-nav-label="04 / One Skeleton, Five Roles">
      <ChapterTitle>04 / One Skeleton, Five Roles</ChapterTitle>
      <h2 className="m-0 max-w-[900px] text-[clamp(28px,3.8vw,42px)] font-bold leading-[1.12] tracking-[-0.02em] text-[#161616]" style={bodyStyle}>
        Four dashboards. One shared structure, reweighted.
      </h2>
      <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
        Every dashboard keeps the same shell: KPI tiles, a trend chart, a &ldquo;tasks to handle&rdquo; panel. <strong className="font-bold text-[#161616]">What changes is which numbers earn a tile</strong>, sourced from what each role told me they actually check. The legacy backend already had a page called &ldquo;Dashboard&rdquo; &#8212; same numbers for everyone, owner or warehouse hand. Drag to compare it against the Admin view it became.
      </p>
      <BeforeAfterSlider
        beforeSrc="/img/def-erp/legacy-miniprogram-dashboard-crop.png"
        beforeAlt="Legacy WeChat mini-program backend Dashboard page: one undifferentiated view mixing sales KPIs, customer approvals, and withdrawal requests for every user."
        beforeLabel="Before"
        afterSrc="/img/def-erp/dashboard-admin-v3.png"
        afterAlt="New Admin dashboard: sales, orders, receivables, customer mix, and tasks to handle, laid out for the admin role specifically."
        afterLabel="After"
        aspectRatio={1.6}
      />
      <FigureCaption>
        Before: one Dashboard page for every login, mixing task types that belonged to different jobs. After: the same shell, reweighted per role &mdash; this is the Admin view, one of four.
      </FigureCaption>

      <DashboardSwitcher shots={dashboardShots} accent={accent} />

      <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
        Two pieces of that shell, running here instead of as screenshots: <strong className="font-bold text-[#161616]">the trend chart and the customer-type mix</strong>, on the same component code and demo data as the Admin view.
      </p>
      <LiveDashboardWidgets />

      <Callout label="The rule, not the screen">
        The thing I designed is not four dashboards. It is one rule: <strong className="font-bold text-[#161616]">same skeleton, reweighted content, sourced from what each role actually does daily.</strong> A fifth role (ops) reuses the Admin view. New roles get a cheap starting point instead of a blank page, and the shell itself stays a single component to maintain.
      </Callout>
    </div>
  );
}

/** 05 / Rules over screens (status model + reconciliation) */
function RulesOverScreensSection() {
  return (
    <div className="flex flex-col gap-10" data-case-nav-label="05 / Rules Over Screens">
      <ChapterTitle>05 / Rules Over Screens</ChapterTitle>
      <h2 className="m-0 max-w-[900px] text-[clamp(28px,3.8vw,42px)] font-bold leading-[1.12] tracking-[-0.02em] text-[#161616]" style={bodyStyle}>
        Collapsing what the database knows into what a person needs to reason about.
      </h2>
      <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
        A purchase order carries seven statuses in the database. <strong className="font-bold text-[#161616]">The interface shows exactly four.</strong> I asked the procurement lead whether a middle state like &ldquo;sent to supplier, awaiting confirmation&rdquo; was worth adding. The answer: no, just upload the confirmation when it comes back.
      </p>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex flex-wrap gap-2">
          {['draft', 'pending', 'ordered', 'confirmed', 'partially_received', 'received', 'cancelled'].map((s) => (
            <span key={s} className="case-radius-full border border-[#e2e2e2] bg-white px-3 py-1 font-mono text-[11px] text-[#9a9a9a]" style={bodyStyle}>{s}</span>
          ))}
        </div>
        <span className="text-[18px] text-[#9a9a9a]" aria-hidden>&#8594;</span>
        <div className="flex flex-wrap gap-2">
          {['Draft', 'Ordered', 'Received', 'Cancelled'].map((s) => (
            <span key={s} className="case-radius-full px-3 py-1 text-[12px] font-semibold text-white" style={{ ...bodyStyle, background: accent }}>{s}</span>
          ))}
        </div>
      </div>
      <FigureCaption>Seven database statuses, two of them legacy. Four buckets a person actually reasons in.</FigureCaption>

      <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
        Negotiating confirmed price against list price and document discount didn&apos;t exist as its own screen before &#8212; the legacy system had one moment for a purchase: receiving.
      </p>
      <div className="case-radius-lg overflow-hidden border border-[#e2e2e2]">
        <Image
          src="/img/def-erp/po-detail-collapsed-v3.png"
          alt="Purchase order detail view, product rows collapsed into SPU groups with estimated quantity, stock, and pricing columns."
          width={3200}
          height={2000}
          className="h-auto w-full"
          loading="eager"
        />
      </div>
      <FigureCaption>
        Products group by SPU, collapsed by default. Pricing panel on the right tracks document-level discount and shipping threshold, both of which change the per-line math.
      </FigureCaption>

      <div className="case-radius-lg overflow-hidden border border-[#e2e2e2]">
        <Image
          src="/img/def-erp/po-detail-expanded-v3.png"
          alt="Expanded SKU rows inside a purchase order, showing editable confirmed quantity and confirmed price fields next to system estimates."
          width={3200}
          height={2000}
          className="h-auto w-full"
          loading="eager"
        />
      </div>
      <FigureCaption>
        Expanding a group reveals SKU-level rows. Estimated quantity and price sit next to editable confirmed fields, the pattern used everywhere OCR fills a value: the system proposes, the person on the counter decides. Column widths are fixed so expanding a row never reflows the ones a person already checked.
      </FigureCaption>

      <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
        Those confirmed prices follow one calculation, and it matters before anything is ordered. <strong className="font-bold text-[#161616]">A product can&apos;t get a selling price until someone knows what it will really cost.</strong> Italian suppliers price a line as a list price, stacked discounts printed like &ldquo;50%+50%+7,69&rdquo;, a document discount and IVA. The tiers read like a sum but each applies to what the previous one left, so adding them gives a &euro;20 item a negative cost. I designed this component for both moments: estimate one item&apos;s real purchase cost from a supplier&apos;s discount terms before ordering, and get the same number once the confirmation is uploaded.
      </p>
      <LivePurchaseCostCalculator />

      <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
        Receiving is where the two systems overlap: <strong className="font-bold text-[#161616]">both record what physically came in.</strong> Drag to compare the same task, years apart.
      </p>
      <BeforeAfterSlider
        beforeSrc="/img/def-erp/legacy-mpsoft-purchasing.png"
        beforeAlt="Legacy desktop inventory software: a flat purchasing table with a generic supplier dropdown, a single receiving date and warehouse, and no distinction between ordered and received quantities."
        beforeLabel="Before"
        afterSrc="/img/def-erp/receiving-workspace-v3.png"
        afterAlt="Receiving workspace comparing ordered vs received quantities per SKU, with a short-shipment note and linked supplier confirmation, DDT, and invoice documents."
        afterLabel="After"
        aspectRatio={1.6}
      />
      <FigureCaption>
        Before: one flat table, a generic supplier label, a receiving date and warehouse, no distinction between what was ordered and what arrived. After: ordered and received quantities sit side by side per SKU, with the actual discrepancy (&ldquo;short on Classic bonder 8ml&rdquo;) recorded in place, not on a separate exceptions screen.
      </FigureCaption>
    </div>
  );
}

/** 06 / One rule, one exception */
function ConfirmationRuleSection() {
  return (
    <div className="flex flex-col gap-10" data-case-nav-label="06 / One Rule, One Exception">
      <ChapterTitle inverse>06 / One Rule, One Exception</ChapterTitle>
      <h2 className="m-0 max-w-[920px] text-[clamp(30px,4.2vw,52px)] font-bold leading-[1.08] tracking-[-0.028em] text-white" style={bodyStyle}>
        The system has no undo button. So it has an opinion about when to ask twice.
      </h2>

      <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#d8d8d8]" style={bodyStyle}>
        Every action that touches stock or money is irreversible once confirmed. The default rule: <strong className="font-bold text-white">state the consequence, then ask</strong> &#8212; not &ldquo;Are you sure?&rdquo;
      </p>

      <div className="case-radius-lg overflow-hidden bg-[#202020] p-[clamp(22px,4vw,32px)]">
        <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em]" style={{ ...bodyStyle, color: accentInverse }}>Confirm stocktake &#8212; dialog copy</p>
        <pre className="m-0 mt-4 whitespace-pre-wrap text-[15px] font-normal leading-[1.7] text-white" style={bodyStyle}>
{`About to:
  · Adjust stock for 12 SKUs
  · Record €340.50 in losses (posts to finance)
  · This cannot be undone`}
        </pre>
      </div>

      <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#d8d8d8]" style={bodyStyle}>
        Then one interview broke the default on purpose: a customer finishes checking out, remembers one more item, while the next customer waits. <strong className="font-bold text-white">A confirmation dialog here is not caution, it is a tax on the line.</strong> So hold/resume uses an instant toast instead:
      </p>

      <blockquote className="m-0 max-w-[900px] border-l-[4px] pl-5" style={{ borderColor: accentInverse }}>
        <p data-case-type="quote-compact" className="m-0 text-[clamp(17px,2vw,22px)] font-normal leading-[1.55] text-white" style={bodyStyle}>
          Held: Zhang San, 5 items
        </p>
        <footer className="mt-4 text-[11px] font-bold uppercase tracking-[0.05em] text-[#afafaf]" style={bodyStyle}>
          Toast shown after holding an in-progress order, no confirmation step
        </footer>
      </blockquote>

      <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#d8d8d8]" style={bodyStyle}>
        Hold and resume aren&apos;t new &#8212; the legacy system had the same buttons in the same corner. <strong className="font-bold text-white">What changed is context per row:</strong> packaging tier, live stock, oversell warning, gift flag, all inline at the moment of typing a quantity.
      </p>
      <BeforeAfterSlider
        beforeSrc="/img/def-erp/legacy-mpsoft-sales-counter-cropped.png"
        beforeAlt="Legacy desktop POS screen: product sales table with price, discount rate, discounted price, quantity, and unit, plus Hold and Resume buttons."
        beforeLabel="Before"
        afterSrc="/img/def-erp/sales-counter-dropdown-v4.png"
        afterAlt="New product sales screen: the same Hold and Resume buttons, with a packaging-unit popover open on one line (piece or box of 3, with prices), live stock, an Oversold 2 pcs warning on a gift line, and a pre-tax and VAT breakdown."
        afterLabel="After"
        aspectRatio={1.78}
      />
      <FigureCaption>
        Same page, same hold/resume buttons. Packaging tier, live stock, and tax breakdown are the new additions per row.
      </FigureCaption>

      <Callout label="Logged, not hidden" inverse>
        <strong className="font-bold text-white">21 native browser confirm dialogs still violate this policy</strong>, tracked by file in the same document that defines the rule. No new ones; migrate opportunistically when a file is already open. That&apos;s what keeps it a policy instead of an inconsistency nobody owns.
      </Callout>
    </div>
  );
}

/** 07 / Two cadences, one system */
function TwoCadencesSection() {
  return (
    <div className="flex max-w-[1080px] flex-col gap-10" data-case-nav-label="07 / Two Cadences">
      <ChapterTitle>07 / Two Cadences</ChapterTitle>
      <h2 className="m-0 max-w-[900px] text-[clamp(28px,3.8vw,42px)] font-bold leading-[1.12] tracking-[-0.02em] text-[#161616]" style={bodyStyle}>
        Sales and finance disagreed about invoicing. I didn&apos;t pick a side.
      </h2>

      <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
        The disagreement sits at the last step of an order&apos;s life: <strong className="font-bold text-[#161616]">when does money become an invoice?</strong>
      </p>

      <div className="grid gap-px overflow-hidden case-radius-lg bg-[#d8d8d8] sm:grid-cols-2">
        <article className="flex flex-col gap-3 bg-white p-[clamp(20px,3vw,28px)]">
          <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em]" style={{ ...bodyStyle, color: accent }}>Sales wanted</p>
          <p className="m-0 text-[16px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
            Invoice the moment an order closes, then strip out anything that turns out not to be invoiceable during review.
          </p>
        </article>
        <article className="flex flex-col gap-3 bg-white p-[clamp(20px,3vw,28px)]">
          <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em]" style={{ ...bodyStyle, color: accent }}>Finance needed</p>
          <p className="m-0 text-[16px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
            B2B customers settle in batches over time. An invoice only makes sense once payment has actually come in, sometimes covering several orders at once.
          </p>
        </article>
      </div>
      <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
        Neither side was wrong &#8212; two real cadences in the same business. <strong className="font-bold text-[#161616]">The system holds both timelines</strong> instead of forcing one workflow to be &ldquo;correct&rdquo; and the other a workaround: a sales order tracks shipment and payment as two independent tracks, not one combined status.
      </p>

      <div className="case-radius-lg overflow-hidden border border-[#e2e2e2]">
        <div className="border-b border-[#e2e2e2] bg-[#f4f4f4] px-[clamp(18px,2.6vw,24px)] py-3">
          <span className="case-radius-full mr-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em] text-white" style={{ ...bodyStyle, background: '#9a9a9a' }}>Before</span>
          <span className="text-[13px] font-normal text-[#686868]" style={bodyStyle}>&ldquo;Is this order paid?&rdquo; had no field to check &#8212; it meant checking MPSOFT, WeChat chat history, invoice records, and bank transfers separately, by hand.</span>
        </div>
        <div className="flex flex-col gap-5 bg-white p-[clamp(18px,2.6vw,24px)]">
          <div className="flex items-center gap-2">
            <span className="case-radius-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em] text-white" style={{ ...bodyStyle, background: accent }}>After</span>
            <span className="text-[13px] font-normal text-[#686868]" style={bodyStyle}>Two fields on the order itself, tracked independently:</span>
          </div>
          {[
            { label: 'Shipment', steps: ['Not shipped', 'Partially shipped', 'Shipped'] },
            { label: 'Payment', steps: ['Unpaid', 'Partially paid', 'Paid'] },
          ].map((track) => (
            <div key={track.label} className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
              <span className="w-[84px] shrink-0 text-[12px] font-bold uppercase tracking-[0.05em] text-[#686868]" style={bodyStyle}>{track.label}</span>
              <div className="flex flex-wrap items-center gap-2">
                {track.steps.map((step, index) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="case-radius-full px-3 py-1 text-[12px] font-semibold text-white" style={{ ...bodyStyle, background: accent }}>{step}</span>
                    {index < track.steps.length - 1 && <span className="text-[14px] text-[#9a9a9a]" aria-hidden>&#8594;</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <FigureCaption>
        A shipped order can still be unpaid. A paid order can still be waiting on a partial shipment. Invoicing reads the payment track, not the shipment track &#8212; which is why it can&apos;t just fire when an order closes.
      </FigureCaption>

    </div>
  );
}

/** 08 / One order, end to end */
function OrderLifecycleSection() {
  return (
    <div className="flex max-w-[1080px] flex-col gap-10" data-case-nav-label="08 / One Order, End to End">
      <ChapterTitle>08 / One Order, End to End</ChapterTitle>
      <h2 className="m-0 max-w-[900px] text-[clamp(28px,3.8vw,42px)] font-bold leading-[1.12] tracking-[-0.02em] text-[#161616]" style={bodyStyle}>
        Payment, shipping, and invoicing stopped being notes.
      </h2>
      <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
        <strong className="font-bold text-[#161616]">Two of the legacy steps weren&apos;t features, they were notes fields standing in for features</strong> &#8212; and one didn&apos;t exist at all.
      </p>

      <div className="case-radius-lg overflow-hidden border border-[#e2e2e2]">
        <div className="border-b border-[#e2e2e2] bg-[#f4f4f4] px-[clamp(18px,2.6vw,24px)] py-3">
          <span className="case-radius-full mr-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em] text-white" style={{ ...bodyStyle, background: '#9a9a9a' }}>Before</span>
          <span className="text-[13px] font-normal text-[#686868]" style={bodyStyle}>Seven steps, two of them a note field standing in for a status, one a feature that didn&apos;t exist</span>
        </div>
        <div className="overflow-x-auto bg-white p-[clamp(18px,2.6vw,24px)]">
          <div className="flex min-w-[720px] items-stretch gap-2">
            {[
              { step: 'Select customer' },
              { step: 'Add product' },
              { step: 'Search product' },
              { step: 'Add product' },
              { step: 'Payment', note: 'noted in free-text remarks' },
              { step: 'Shipping', note: 'noted in free-text remarks' },
              { step: 'Invoice', note: 'no feature — recorded by hand, outside the system' },
            ].map((item, index, arr) => (
              <div key={`${item.step}-${index}`} className="flex items-stretch gap-2">
                <div className={`case-radius-md flex min-h-[92px] w-[132px] flex-col justify-between border p-3 ${item.note ? 'border-[#e0c88c] bg-[#fbf6ea]' : 'border-[#e2e2e2] bg-white'}`}>
                  <span className="text-[10px] font-bold text-[#9a9a9a]" style={bodyStyle}>{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-[13px] font-semibold leading-[1.3] text-[#161616]" style={bodyStyle}>{item.step}</span>
                  {item.note && <span className="text-[10px] font-normal leading-[1.3] text-[#9a7b2e]" style={bodyStyle}>{item.note}</span>}
                </div>
                {index < arr.length - 1 && <span className="flex items-center text-[14px] text-[#9a9a9a]" aria-hidden>&#8594;</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="case-radius-lg overflow-hidden border border-[#e2e2e2]">
        <div className="border-b border-[#e2e2e2] bg-[#eef5ff] px-[clamp(18px,2.6vw,24px)] py-3">
          <span className="case-radius-full mr-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em] text-white" style={{ ...bodyStyle, background: accent }}>After</span>
          <span className="text-[13px] font-normal text-[#686868]" style={bodyStyle}>Five steps; payment, shipping, and invoice are each a real status, not a note</span>
        </div>
        <div className="overflow-x-auto bg-white p-[clamp(18px,2.6vw,24px)]">
          <div className="flex min-w-[600px] items-stretch gap-2">
            {[
              { step: 'Select customer' },
              { step: 'Search + add product' },
              { step: 'Payment' },
              { step: 'Shipping', note: 'partial shipment, tracked per batch' },
              { step: 'Invoice' },
            ].map((item, index, arr) => (
              <div key={`${item.step}-${index}`} className="flex items-stretch gap-2">
                <div className="case-radius-md flex min-h-[92px] w-[148px] flex-col justify-between border p-3" style={{ borderColor: '#bcd7ff', background: '#f5f9ff' }}>
                  <span className="text-[10px] font-bold" style={{ ...bodyStyle, color: accent }}>{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-[13px] font-semibold leading-[1.3] text-[#161616]" style={bodyStyle}>{item.step}</span>
                  {item.note && <span className="text-[10px] font-normal leading-[1.3] text-[#4a7fc4]" style={bodyStyle}>{item.note}</span>}
                </div>
                {index < arr.length - 1 && <span className="flex items-center text-[14px] text-[#9a9a9a]" aria-hidden>&#8594;</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <FigureCaption>
        Before: adding products took two separate mechanisms (old-item picker, new-item picker), and payment, shipping, and invoicing were all the same move &#8212; write it in a notes field, or nowhere. After: one search adds anything, and the three money-and-goods steps each have a real status the rest of the system can read.
      </FigureCaption>

      <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
        Four screens along that flow, from the sales counter to finance &#8212; captured from the production code, with English demo data.
      </p>

      <div className="case-radius-lg overflow-hidden border border-[#e2e2e2]">
        <Image
          src="/img/def-erp/sales-order-create-v4.png"
          alt="Product sales screen with five catalog products for Luce Beauty Lab, each with its product photo: L'Oréal Vitamino Color and Absolut Repair shampoos sold by the piece, Olaplex Nº7 by the box and a DEF anti-dandruff shampoo by the carton (chosen from packaging dropdowns), one line at a 0.95 discount, and an OPI cuticle oil toggled to a gift with its price struck through. The cuticle oil shows an Oversold 2 pcs warning. The footer splits the €823 goods total into pre-tax and VAT."
          width={3200}
          height={2000}
          className="h-auto w-full"
          loading="eager"
        />
      </div>
      <FigureCaption>
        Building the order: one search box adds anything, but each line keeps its own packaging unit &#8212; plain text when a SKU has one unit, a dropdown when it sells by box or carton. There&apos;s no separate &ldquo;add gift&rdquo; flow: any line becomes a gift by toggling its own row, and drops out of the total.
      </FigureCaption>

      <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
        Behind that packaging dropdown sits a small model. <strong className="font-bold text-[#161616]">One product sells as a piece, a pack, a carton or a display kit, each priced on its own, while stock only ever counts pieces.</strong>
      </p>
      <LivePackagingPricing />

      <div className="case-radius-lg overflow-hidden border border-[#e2e2e2]">
        <Image
          src="/img/def-erp/order-checkout-dialog-v4.png"
          alt="Save sales order dialog: Collect payment now is ticked with a card payment of €823, and Picked up / partially picked up is ticked with a per-line table where 2 of 4 Absolut Repair bottles and 0 of 3 cartons of anti-dandruff shampoo are picked up."
          width={2400}
          height={1760}
          className="h-auto w-full"
          loading="eager"
        />
      </div>
      <FigureCaption>
        Saving the order asks two separate questions. Was it paid, and how? Did the customer take goods with them? A partial hand-off isn&apos;t a status someone picks &#8212; it&apos;s simply picking up fewer than were ordered, line by line.
      </FigureCaption>

      <div className="case-radius-lg overflow-hidden border border-[#e2e2e2]">
        <Image
          src="/img/def-erp/sales-order-detail-v4.png"
          alt="Sales order OUT-2026-001248 with Partially shipped and Paid badges, an Ordered, Shipped, Completed tracker with Shipped half-filled, and shipping progress at 34 of 39 pieces. The Deliveries tab lists a shipped pickup, a draft courier delivery for the shampoo cartons, and two unshipped Absolut Repair bottles. The sidebar shows Invoice status Not invoiced and Payment status Paid in separate boxes."
          width={3200}
          height={2000}
          className="h-auto w-full"
          loading="eager"
        />
      </div>
      <FigureCaption>
        The same order afterwards: shipment is partial &#8212; one pickup done, a courier delivery still in draft, two bottles not yet allocated &#8212; while payment is already complete. Invoice status and payment status sit in separate boxes, so neither is inferred from shipping.
      </FigureCaption>

      <div className="case-radius-lg overflow-hidden border border-[#e2e2e2]">
        <Image
          src="/img/def-erp/finance-invoice-edit-ui.png"
          alt="New invoice dialog for Luce Beauty Lab: the paid order's lines with remaining quantity, quantity on this invoice and editable invoice amounts, the gift line unselected, and a shipping line included. Invoice settings on the right show an €831 total, card payment, operator and notes."
          width={3200}
          height={2000}
          className="h-auto w-full"
          loading="eager"
        />
      </div>
      <FigureCaption>
        Where the payment track turns into an invoice: finance picks lines out of paid orders and sets the amounts, instead of editing a document generated when the order closed. The gift line is listed but carries no amount; shipping becomes its own line.
      </FigureCaption>
    </div>
  );
}

/** 09 / How I worked */
function HowIWorkedSection() {
  return (
    <div className="flex flex-col gap-10" data-case-nav-label="09 / How I Worked">
      <ChapterTitle>09 / How I Worked</ChapterTitle>
      <h2 className="m-0 max-w-[900px] text-[clamp(28px,3.8vw,42px)] font-bold leading-[1.12] tracking-[-0.02em] text-[#161616]" style={bodyStyle}>
        Solo, with an AI coding agent as the implementation partner.
      </h2>
      <p className="m-0 max-w-[880px] text-[17px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
        I made the calls this case study describes &#8212; the status model, the confirmation policy, the dashboard skeleton, the invoicing compromise &#8212; and wrote them down before any code existed. <strong className="font-bold text-[#161616]">Claude Code built against that written record, not against a conversation.</strong>
      </p>

      <div className="grid grid-cols-1 gap-px overflow-hidden case-radius-lg bg-[#d8d8d8] sm:grid-cols-3">
        {[
          { step: '01', title: 'Spec', body: 'What the screen must do, which states it passes through, which existing rule it has to match.' },
          { step: '02', title: 'Agent builds', body: 'Claude Code implements the React/TypeScript frontend and Supabase backend against the spec.' },
          { step: '03', title: 'I review', body: 'Against the same spec and UX.md, not against memory of what I asked for.' },
        ].map((item) => (
          <article key={item.step} className="flex min-h-[168px] flex-col gap-3 bg-white p-[clamp(18px,2.4vw,24px)]">
            <p className="m-0 text-[11px] font-bold" style={{ ...bodyStyle, color: accent }}>{item.step}</p>
            <p className="m-0 text-[16px] font-bold text-[#161616]" style={bodyStyle}>{item.title}</p>
            <p className="m-0 text-[13px] font-normal leading-[1.5] text-[#555]" style={bodyStyle}>{item.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

/** 10 / Honest status */
const phaseRows = [
  { phase: 'Phase 0 · Foundation', status: 'Shipped', note: 'Supabase, Vite, and Workers scaffolding' },
  { phase: 'Phase 1 · Auth', status: 'Shipped', note: 'Login, JWT roles, route guards, dashboard' },
  { phase: 'Phase 2 · Products', status: 'Shipped', note: 'Categories, products, SKUs, multi-tier packaging' },
  { phase: 'Phase 3 · Procurement', status: 'Shipped', note: 'Suppliers, requests, orders, receiving' },
  { phase: 'Phase 4 · Sales', status: 'Shipped', note: 'Order creation, shipping, returns, exchanges' },
  { phase: 'Phase 5 · Customers', status: 'Shipped', note: 'Accounts, fund ledger, tiers' },
  { phase: 'Phase 6 · Finance', status: 'Shipped', note: 'Invoicing, payment ledger, reconciliation; Fatture in Cloud sync not yet connected' },
];

function statusColor(status: string) {
  if (status === 'Shipped') return accent;
  if (status === 'In progress') return '#b8860b';
  return '#9a9a9a';
}

function HonestStatusSection() {
  return (
    <div className="flex flex-col gap-10" data-case-nav-label="10 / Honest Status">
      <ChapterTitle>10 / Honest Status</ChapterTitle>
      <h2 className="m-0 max-w-[900px] text-[clamp(28px,3.8vw,42px)] font-bold leading-[1.12] tracking-[-0.02em] text-[#161616]" style={bodyStyle}>
        This shipped as an MVP and is in daily use. The evidence here is design reasoning, shipped code, and a test suite, not usage analytics.
      </h2>

      <div className="case-radius-lg overflow-hidden border border-[#e2e2e2]">
        <table className="w-full border-collapse text-left text-[14px]" style={bodyStyle}>
          <thead>
            <tr className="bg-[#f4f4f4] text-[11px] font-bold uppercase tracking-[0.05em] text-[#686868]">
              <th className="px-4 py-3">Module</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Note</th>
            </tr>
          </thead>
          <tbody>
            {phaseRows.map((row) => (
              <tr key={row.phase} className="border-t border-[#e2e2e2]">
                <td className="px-4 py-3 font-medium text-[#161616]">{row.phase}</td>
                <td className="px-4 py-3 font-semibold" style={{ color: statusColor(row.status) }}>{row.status}</td>
                <td className="px-4 py-3 text-[#555]">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout label="How correctness is checked">
        <strong className="font-bold text-[#161616]">A Playwright suite tests the money invariants chapter 06 argues can&apos;t be undone</strong> &#8212; multi-unit packaging math, bundle stock deduction, gift-line zero-receivable, partial-shipment reservations, and one real invoice-rounding regression (<code>57.38 &times; 1.22 &times; 5</code>) kept permanently as a test. Most runs against a mock backend; a gated subset writes to the real database. Not yet wired into the deploy pipeline, so a bad merge can still ship without failing a check.
      </Callout>

      <div className="case-radius-lg overflow-hidden border border-[#e2e2e2]">
        <div className="border-b border-[#e2e2e2] bg-[#eef5ff] px-[clamp(18px,2.6vw,24px)] py-3">
          <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em]" style={{ ...bodyStyle, color: accent }}>Accessibility, audited and fixed</p>
        </div>
        <div className="grid grid-cols-2 gap-px bg-[#e2e2e2] sm:grid-cols-4">
          {[
            { stat: '17', label: 'screens and dialogs audited against WCAG 2.2 A/AA' },
            { stat: '282 → 7', label: 'violations found by axe-core, before and after' },
            { stat: '11 → 1', label: 'failing rules, the last one a documented exception' },
            { stat: '4.03 → 5.39', label: 'contrast of white text on the primary blue' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-1 bg-white p-[clamp(16px,2.4vw,22px)]">
              <span className="text-[24px] font-bold leading-none" style={{ ...bodyStyle, color: accent }}>{item.stat}</span>
              <span className="text-[12px] font-normal leading-[1.4] text-[#686868]" style={bodyStyle}>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="bg-white px-[clamp(18px,2.6vw,24px)] py-5">
          <p className="m-0 max-w-[880px] text-[15px] font-normal leading-[1.6] text-[#3b3b3b]" style={bodyStyle}>
            I ran axe-core across the live code &#8212; dashboards, sales, finance, procurement, inventory, customers, settings, and the two money dialogs. <strong className="font-bold text-[#161616]">Most failures came from a few shared pieces, so the fixes were systemic rather than page by page:</strong> the brand blue moved from #197afa to #1366d6, status text got its own darker tokens, every select and number input now has an accessible name, the open-pages strip became a keyboard-operable tab list, and order details use valid description lists. The 7 remaining are 16px stepper arrows beside a full-size number input, covered by WCAG 2.5.8&apos;s equivalent-control exception.
          </p>
        </div>
      </div>

      <div className="case-radius-lg overflow-hidden border border-[#e2e2e2]">
        <div className="border-b border-[#e2e2e2] bg-[#eef5ff] px-[clamp(18px,2.6vw,24px)] py-3">
          <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em]" style={{ ...bodyStyle, color: accent }}>What&apos;s next</p>
        </div>
        <div className="grid grid-cols-1 divide-y divide-[#e2e2e2] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <article className="flex flex-col gap-2 bg-white p-[clamp(18px,2.6vw,24px)]">
            <p className="m-0 text-[15px] font-bold text-[#161616]" style={bodyStyle}>WeChat storefront cutover</p>
            <p className="m-0 text-[14px] font-normal leading-[1.55] text-[#555]" style={bodyStyle}>
              Still runs on a third-party SaaS backend, not this platform&apos;s own data. The plan connects it through a thin API layer, paired with a visual agent already generating product cover and detail shots.
            </p>
          </article>
          <article className="flex flex-col gap-2 bg-white p-[clamp(18px,2.6vw,24px)]">
            <p className="m-0 text-[15px] font-bold text-[#161616]" style={bodyStyle}>Fatture in Cloud connection</p>
            <p className="m-0 text-[14px] font-normal leading-[1.55] text-[#555]" style={bodyStyle}>
              Invoices generated here don&apos;t reach Italian e-invoicing yet. Wiring up that API is the remaining piece of Finance.
            </p>
          </article>
        </div>
      </div>

      <div className="case-radius-lg overflow-hidden border border-[#e2e2e2]">
        <div className="border-b border-[#e2e2e2] bg-[#f4f4f4] px-[clamp(18px,2.6vw,24px)] py-3">
          <p className="m-0 text-[11px] font-bold uppercase tracking-[0.05em] text-[#686868]" style={bodyStyle}>Known limits</p>
        </div>
        <div className="grid grid-cols-1 divide-y divide-[#e2e2e2] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {[
            { label: 'Interview coverage', body: 'One person per role. Enough to expose mechanics, not enough to prove it generalizes across all fifteen staff.' },
            { label: 'Confirm-dialog migration', body: 'Tracked in chapter 06, not finished.' },
          ].map((item) => (
            <article key={item.label} className="flex flex-col gap-2 bg-white p-[clamp(16px,2.4vw,22px)]">
              <p className="m-0 text-[13px] font-bold text-[#161616]" style={bodyStyle}>{item.label}</p>
              <p className="m-0 text-[13px] font-normal leading-[1.5] text-[#555]" style={bodyStyle}>{item.body}</p>
            </article>
          ))}
        </div>
      </div>

      <p className="m-0 max-w-[880px] text-[15px] font-normal leading-[1.6] text-[#686868]" style={bodyStyle}>
        A separate, deeper case study covers the AI procurement agent built on top of this same platform: <a href="/projects/procurement-agent-v2" className="underline" style={{ color: accent }}>Procurement Agent for DEF Beauty Supply</a>. This page is about the platform underneath it.
      </p>
    </div>
  );
}

function ClosingSection() {
  return (
    <div className="flex flex-col gap-10" data-case-nav-label="11 / Recap">
      <ChapterTitle>11 / Recap</ChapterTitle>
      <h2 className="m-0 max-w-[900px] text-[clamp(26px,3.6vw,40px)] font-bold leading-[1.15] tracking-[-0.02em] text-[#161616]" style={bodyStyle}>
        Four rules, not forty screens.
      </h2>
      <div className="case-radius-lg overflow-hidden grid gap-px bg-[#d8d8d8] md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: 'One skeleton, reweighted',
            body: 'Four dashboards share a shell; what changes is which numbers earn a tile, sourced from what each role told me they check.',
          },
          {
            title: 'Collapse to what people reason in',
            body: 'Seven backend statuses become four buckets, because an interview confirmed the extra states have no owner.',
          },
          {
            title: 'Confirm by default, except where a queue is real',
            body: 'One consistent policy, one logged exception, and the remaining debt tracked instead of hidden.',
          },
          {
            title: 'Two tracks, not one status',
            body: 'Shipment and payment move independently, so sales can hand goods over and finance can invoice on its own cadence.',
          },
        ].map((item, index) => (
          <article key={item.title} className="flex min-h-[168px] flex-col gap-4 bg-[#f4f4f4] p-[clamp(20px,3vw,28px)]">
            <p className="m-0 text-[11px] font-bold" style={{ ...bodyStyle, color: accent }}>{String(index + 1).padStart(2, '0')}</p>
            <p className="m-0 text-[18px] font-bold leading-[1.3] text-[#161616]" style={bodyStyle}>{item.title}</p>
            <p className="m-0 mt-auto text-[14px] font-normal leading-[1.55] text-[#555]" style={bodyStyle}>{item.body}</p>
          </article>
        ))}
      </div>
      <CaseStudyBackButton />
    </div>
  );
}

export default function DefErpPage() {
  return (
    <div className="def-erp-case mei-project-page w-full">
      <CaseStudyControls
        accentColor={accent}
        tldrPoints={tldrPoints}
        navLabels={[
          '01 / Context',
          '02 / Before',
          '03 / Research System',
          '04 / One Skeleton, Five Roles',
          '05 / Rules Over Screens',
          '06 / One Rule, One Exception',
          '07 / Two Cadences',
          '08 / One Order, End to End',
          '09 / How I Worked',
          '10 / Honest Status',
          '11 / Recap',
        ]}
      />
      <CaseStudyHero
        accentColor={accent}
        title="ERP Platform for DEF Beauty Supply"
        subtitle="Replaced a legacy desktop inventory tool and a disconnected ordering system with one platform, designed as a small set of rules that hold across 40+ screens instead of screen-by-screen decisions."
        tags={['B2B SaaS', 'Enterprise UX', 'Systems Design', 'Full stack']}
        aboutLabel="About DEF Beauty Supply"
        about={
          'DEF Beauty Supply is a B2B beauty wholesaler serving professional salons across Italy.\n\nThe business ran on a legacy desktop inventory tool plus a disconnected WeChat ordering system: fifteen people, no shared source of truth. I designed and built its replacement, an ERP that treats sales, warehouse, finance, and procurement as one system instead of four.'
        }
        meta={[
          {
            label: 'Role',
            value: ['Research, Product Design & Full-stack Engineering', 'Solo, including interviews, system design, and implementation.'],
          },
          {
            label: 'Team',
            value: ['Solo, with an AI coding agent (Claude Code) as implementation partner.'],
          },
          {
            label: 'Scope',
            value: ['Platform-wide: dashboards, sales, procurement, inventory, customers, finance'],
          },
          { label: 'Company', value: ['DEF Beauty Supply'] },
          { label: 'Year', value: ['2026'] },
        ]}
        visualLabel="DEF Beauty Supply ERP admin dashboard"
        visualSrc="/img/def-erp/def-erp-hero-v3.webp"
        visualAlt="DEF Beauty Supply ERP shown across a central dashboard, an inventory panel, and a finance panel, with beauty products and shipping objects connecting the business workflow."
        visualObjectPosition="center"
        visualObjectFit="cover"
        visualImageScale={1}
        visualTransformOrigin="center"
        visualTranslateY="0%"
        visualHeight="clamp(320px, 46svh, 560px)"
        visualBackground="#f1f3f5"
        compactTypography
        titleFontSize="clamp(26px, 2.6vw, 40px)"
        wideDetails
        tagRadius="0"
      />

      <section {...sectionBandProps('white')}>
        <ContextSection />
      </section>

      <section {...sectionBandProps('gray')}>
        <BeforeSection />
      </section>

      <section {...sectionBandProps('white')}>
        <ResearchSystemSection />
      </section>

      <section {...sectionBandProps('gray')}>
        <RoleDashboardsSection />
      </section>

      <section {...sectionBandProps('white')}>
        <RulesOverScreensSection />
      </section>

      <section {...sectionBandProps('ink')}>
        <ConfirmationRuleSection />
      </section>

      <section {...sectionBandProps('white')}>
        <TwoCadencesSection />
      </section>

      <section {...sectionBandProps('gray')}>
        <OrderLifecycleSection />
      </section>

      <section {...sectionBandProps('white')}>
        <HowIWorkedSection />
      </section>

      <section {...sectionBandProps('gray')}>
        <HonestStatusSection />
      </section>

      <section {...sectionBandProps('white')}>
        <ClosingSection />
      </section>
    </div>
  );
}
