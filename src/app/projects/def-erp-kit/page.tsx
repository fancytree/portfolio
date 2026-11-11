import type { Metadata } from 'next';
import Image from 'next/image';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import { CaseKitControls as CaseStudyControls } from '../../components/CaseStudyControls';
import FragmentedOperationsDiagram from './FragmentedOperationsDiagram';
import UnifiedOperationsDiagram from './UnifiedOperationsDiagram';
import BeforeAfterSlider from '../def-erp/BeforeAfterSlider';
import {
  CaseChapter,
  CaseClose,
  CaseDevicePreview,
  CaseFigure,
  CaseHero,
  CaseInteractivePreview,
  CaseKitPage,
  CaseKitSections,
  CaseProse,
  CasePullquote,
  CaseStats,
  CaseSteps,
  CaseVideo,
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
  '03 / The challenge',
  '04 / Research',
  '05 / Goals',
  '06 / Approach',
  '07 / Design system',
  '08 / The solution',
  '09 / Results',
  '10 / Reflection',
];

export default function DefErpKitPage() {
  return (
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
            <p>DEF Beauty Supply sells professional beauty products to salons in Italy. It used WeChat (a messaging app) and a WeChat mini-program (a lightweight app accessed within WeChat) to reach customers. The mini-program served mainly as a product catalogue. Customers browsed there, then messaged sales staff on WeChat to place orders.</p>
            <p>I designed and implemented an ERP connected to the mini-program, covering customer ordering and the internal work needed to fulfil it: sales, inventory, fulfilment, and invoicing. The platform is live, and mini-program orders now enter the ERP directly.</p>
          </CaseProse>
        </CaseChapter>

        <CaseChapter label="02 / The problem" title="Staff were doing the work between disconnected systems.">
          <CaseProse>
            <p>The storefront and inventory platform operated separately. Staff carried information between them and filled the gaps throughout the order lifecycle.</p>
            <ul>
              <li><strong>Duplicate product maintenance:</strong> the same product information had to be updated in both the inventory platform and the mini-program backend.</li>
              <li><strong>Stock out of sync:</strong> frequent sales changed inventory without updating the storefront. Actual availability was only checked when sales entered the order; shortages meant another conversation with the customer.</li>
              <li><strong>Manual order entry:</strong> customers ordered through WeChat messages, then sales recreated those orders in the inventory platform.</li>
              <li><strong>Dispatch updates through chat:</strong> sales had to message customers with delivery information instead of customers checking it themselves.</li>
              <li><strong>Invoice details entered again:</strong> finance added products one by one rather than carrying the existing sales order into invoice preparation.</li>
            </ul>
          </CaseProse>
          <CasePullquote>The same product information was repeatedly checked, communicated, and entered as work moved from one person to the next.</CasePullquote>
          <CaseFigure caption="Before the ERP: stock did not sync between the catalogue and inventory platform. Dashed arrows show the manual handoffs for orders, dispatch updates, and invoice items. Scroll horizontally on smaller screens.">
            <FragmentedOperationsDiagram />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="03 / The challenge" title="Connect customer ordering with the way DEF works in Italy.">
          <CaseProse>
            <p>I needed to bring separate tools into one connected system, with shared information that customers and staff could rely on throughout an order’s lifecycle.</p>
            <ul>
              <li><strong>One source of truth:</strong> align product and inventory information across the storefront and internal operations, so staff no longer maintain and verify separate versions.</li>
              <li><strong>Different roles, shared records:</strong> let sales, warehouse, and finance work from the same order while seeing the information and actions relevant to their responsibilities.</li>
              <li><strong>Local business rules:</strong> support Italian addresses, delivery coverage, shipping costs, euro prices, and product-specific tax rates that the existing tools could not represent.</li>
              <li><strong>Real-world exceptions:</strong> accommodate payment review, established customers who can ship before verification, mixed payments, and invoices spanning multiple orders.</li>
            </ul>
          </CaseProse>
        </CaseChapter>

        <CaseChapter label="04 / Research" title="Understand the system through the people doing the work.">
          <CaseProse>
            <p>To understand how the business operated across its separate tools, I spoke with people in sales, procurement, warehouse, management, and finance.</p>
            <p>I recorded and transcribed the interviews, then used AI tools to quickly summarise the conversations and help identify repeated problems, contradictions, and manual workarounds across roles. I reviewed these findings against the original transcripts.</p>
            <p>I used that evidence to shape the ERP’s structure and priorities, grounding the design in how people actually handled orders, stock, and invoicing.</p>
          </CaseProse>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,var(--case-grid-column-min)),1fr))] gap-[var(--case-space-24)]">
            <CaseFigure caption="Interview scripts with handwritten notes.">
              <Image src="/img/def-erp/research-annotated-interviews.webp" alt="Printed interview scripts spread across a desk, with handwritten notes and annotations in blue ink." width={506} height={380} sizes="(min-width: 768px) 50vw, 100vw" />
            </CaseFigure>
            <CaseFigure caption="Recordings and transcripts for cross-role analysis.">
              <Image src="/img/def-erp/research-recordings-transcripts.webp" alt="Audio recordings and text transcripts labelled by warehouse, management, finance, and sales roles." width={823} height={380} sizes="(min-width: 768px) 50vw, 100vw" />
            </CaseFigure>
          </div>
        </CaseChapter>

        <CaseChapter label="05 / Goals" title="Let customers place orders. Let staff move them forward.">
          <CaseProse>
            <p>My goal was to make shared business records the foundation for customer ordering and day-to-day operations.</p>
            <ul>
              <li><strong>Unify product and stock information:</strong> give the storefront and internal teams one reliable source, reducing duplicate maintenance and manual checks.</li>
              <li><strong>Enable direct customer ordering:</strong> let customers select products, confirm availability, and see delivery options and costs before submitting an order.</li>
              <li><strong>Carry orders through the business:</strong> reuse customer orders for fulfilment and invoicing, without staff recreating the same information.</li>
              <li><strong>Make progress visible:</strong> keep payment, dispatch, and invoice status clear, so each role knows what has happened and what needs attention.</li>
            </ul>
          </CaseProse>
        </CaseChapter>

        <CaseChapter label="06 / Approach" title="Three principles connect the experience.">
          <CaseProse>
            <p>Three principles run through the solution, connecting customer ordering with the work staff do behind it.</p>
          </CaseProse>
          <CaseSteps items={[
            { title: 'Enter once, reuse across the workflow', body: 'I carried product and order information into sales processing, dispatch, and invoicing, reducing repeated entry as work moved between roles.' },
            { title: 'Make routine decisions automatic', body: 'I used business rules for stock availability, delivery options, shipping costs, and free-shipping thresholds, so customers could order without staff checking each detail.' },
            { title: 'Keep exceptions under human control', body: 'I left payment review, fulfilment exceptions, and invoice adjustments to staff, with their decisions recorded in the workflow.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="07 / Design system" title="A shared system, from design to code.">
          <CaseProse>
            <p>I paired reusable UI foundations with written experience rules, giving design and Codex a shared reference across sales, warehouse, and finance.</p>
            <ul>
              <li><strong>UX.md:</strong> records role-specific needs and interaction decisions, including recoverable drafts and clear confirmation for stock and financial actions.</li>
              <li><strong>AGENTS.md:</strong> directs Codex to follow the experience and design guidelines, reuse existing components, and run the required checks.</li>
              <li><strong>Semantic tokens:</strong> keep surfaces, text, actions, and status colours consistent through shared CSS variables.</li>
              <li><strong>Reusable components:</strong> carry those rules into buttons, inputs, status badges, and tables, including focus, disabled, loading, and error states.</li>
            </ul>
          </CaseProse>
          <CaseProse>
            <h3>Shared visual foundations</h3>
            <p>Type, colour, spacing, and shape work together as a shared visual language. The examples below use the ERP’s current tokens, including its rounded surface hierarchy.</p>
          </CaseProse>
          <CaseFigure caption="Typography, semantic colours, spacing, and shape tokens from the current ERP source.">
            <picture>
              <source media="(max-width: 767px)" srcSet="/img/def-erp/system-foundations-mobile.webp" width={804} height={1986} />
              <Image src="/img/def-erp/system-foundations-desktop.webp" alt="Typography, semantic colours, spacing, and shape tokens from the current ERP source." width={2160} height={1106} sizes="(min-width: 1280px) 1120px, 100vw" />
            </picture>
          </CaseFigure>
          <CaseProse>
            <h3>Selected controls and states</h3>
            <p>Explore a selection from the ERP’s wider component library: buttons, form validation, selection controls, search, payment options, and quantity input. The preview uses demonstration data.</p>
          </CaseProse>
          <CaseFigure caption="Selected controls — edit fields, validate and save, toggle selections, and change quantities.">
            <CaseInteractivePreview src="/demos/def-design-system/index.html?view=controls" title="DEF ERP — interactive controls" />
          </CaseFigure>
          <CaseProse>
            <h3>Selected business patterns</h3>
            <p>These examples show a selection of the component combinations used across the ERP. Switch receipt states, then filter, search, and page through the demonstration orders to explore how shared components work together.</p>
          </CaseProse>
          <CaseFigure caption="Selected business patterns — document progress, rounded cards, status filters, search, and pagination.">
            <CaseInteractivePreview src="/demos/def-design-system/index.html?view=patterns" title="DEF ERP — interactive business components" />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="08 / The solution" title="Connect each step to the information already available.">
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
          <CaseFigure caption="After: shared ERP records connect ordering, fulfilment, and invoicing, with staff retaining review and approval.">
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
            afterSrc="/img/def-erp/evidence/dashboard-admin-expanded-v2.webp"
            afterAlt="New Admin dashboard: sales, orders, new customers and receivables with trend lines, sales performance, customer mix, and tasks to handle."
            afterLabel="After"
            aspectRatio={1.6}
          />
          <p className="m-0 text-[13px] leading-[1.5] text-[#686868]">
            Before: one Dashboard page for every login, mixing task types that belonged to different jobs. After: the same shell, reweighted per role — this is the Admin view.
          </p>
          <div className="grid grid-cols-1 gap-[var(--case-space-24)] md:grid-cols-2">
            <CaseFigure caption="Admin — business performance and outstanding work.">
              <Image src="/img/def-erp/evidence/dashboard-admin-expanded-v2.webp" alt="Admin dashboard with business metrics, sales trends, customer mix, and outstanding tasks." width={3200} height={2000} sizes="(min-width: 768px) 50vw, 100vw" unoptimized />
            </CaseFigure>
            <CaseFigure caption="Sales — orders, receivables, and customer follow-ups.">
              <Image src="/img/def-erp/evidence/dashboard-sales-expanded-v2.webp" alt="Sales dashboard showing orders to ship, overdue customers, customer follow-ups, and sales performance." width={3200} height={2000} sizes="(min-width: 768px) 50vw, 100vw" unoptimized />
            </CaseFigure>
            <CaseFigure caption="Warehouse — stock, dispatch, and incoming goods.">
              <Image src="/img/def-erp/evidence/dashboard-warehouse-expanded-v2.webp" alt="Warehouse dashboard with stock tasks, orders to ship, incoming receipts, and near-expiry products." width={3200} height={2000} sizes="(min-width: 768px) 50vw, 100vw" unoptimized />
            </CaseFigure>
            <CaseFigure caption="Finance — payment approvals, invoices, and receivables.">
              <Image src="/img/def-erp/evidence/dashboard-finance-expanded-v2.webp" alt="Finance dashboard showing payment approvals, invoices to issue, and overdue receivables." width={3200} height={2000} sizes="(min-width: 768px) 50vw, 100vw" unoptimized />
            </CaseFigure>
          </div>
          <CaseProse>
            <h3>Find one shade or add several together</h3>
            <p>Beauty products can have dozens of similar variants. I kept product discovery and shade selection in one search field: a broad search such as “dye” groups results by product and brand, with capacity shown at product level and shade codes shown on each variant.</p>
            <p>Staff can narrow the search to a shade and click one result to add it directly, or expand a product to select several shades and add them together. For long lists, the product information, selection count, and Add action stay visible while the variants scroll. Price and stock remain beside each shade to support the choice.</p>
          </CaseProse>
          <CaseVideo
            src="/videos/def-erp/sales-order-product-selection.mp4"
            poster="/videos/def-erp/sales-order-product-selection.webp"
            label="Product search with single and multiple shade selection"
            caption="Product selection — search across brands, select multiple shades, or narrow the query to add one variant. Demonstration data."
            width={1828} height={1080}
            controls
          />
          <CaseProse>
            <h3>Review the order before saving</h3>
            <p>The sales workspace keeps customer context, stock, packaging, and prices beside the order lines. Staff can switch between individual units, boxes, and cartons, adjust quantities and discounts, or mark an item as a gift. Line totals and the order summary update as they work, while stock warnings remain visible.</p>
            <p>I separated line editing from the final confirmation. A salesperson must be selected before saving; the confirmation then brings together payment collection, partial or split payments, pickup quantities, and notes. Staff can review these decisions against the order total without leaving the workflow.</p>
          </CaseProse>
          <CaseVideo
            src="/videos/def-erp/sales-order-full-process.mp4"
            poster="/videos/def-erp/sales-order-full-process.webp"
            label="Sales order editing and save confirmation workflow"
            caption="Sales order workflow — packaging, quantities, pricing, gifts, and the payment and pickup options in the save confirmation. Demonstration data."
            width={1828} height={1080}
            controls
          />
          <CaseProse>
            <h3>Follow the order across teams</h3>
            <p>The order detail brings payment, shipment, and invoice status together, giving sales, warehouse, and finance a shared record to work from after the order is created.</p>
          </CaseProse>
          <CaseVideo
            src="/videos/def-erp/order-detail-20261106.mp4"
            poster="/videos/def-erp/order-detail-20261106.webp"
            label="Order details with partial shipments and delivery options"
            caption="Order details — review partial shipments and configure pickup or courier deliveries. Demonstration data."
            width={1828} height={1080}
            controls
          />


          <CaseProse>
            <h3>Purchasing and receiving</h3>
            <p>Purchase orders carry product and quantity information through supplier confirmation and receiving. Staff check delivery documents against actual arrivals, record differences, and receive partial deliveries against the same purchase record.</p>
            <p>For the complete procurement workflow and its AI-assisted optimisation, see <a href="/projects/procurement-agent-v2">AI Procurement Agent for DEF Beauty Supply</a>.</p>
          </CaseProse>
          <CaseVideo
            src="/videos/def-erp/purchase-order-20261106.mp4"
            poster="/videos/def-erp/purchase-order-20261106.webp"
            label="Purchase order and supplier confirmation review"
            caption="Purchase order — review quantities and prices, upload supplier confirmation, and check differences. Demonstration data."
            width={1828} height={1080}
            controls
          />
          <CaseFigure caption="Receiving — delivery records, actual quantities, and differences.">
            <Image src="/img/def-erp/evidence/receiving-collapsed-4c751c3d1fd0.webp" alt="Receiving workspace linking purchase quantities, delivery notes, actual counts, and partial arrival progress." width={3200} height={2000} sizes="(min-width: 1280px) 1120px, 100vw" unoptimized />
          </CaseFigure>

          <CaseProse>
            <h3>Order-based invoicing</h3>
            <p>Finance creates invoices from existing sales orders, reusing product details, quantities, prices, and tax rates. Staff can combine orders, enter a target amount, and review the suggested lines before adjusting amounts and payment methods. Previously invoiced products are excluded from future selection.</p>
          </CaseProse>
          <CaseVideo
            src="/videos/def-erp/invoice.mp4"
            poster="/videos/def-erp/invoice.webp"
            label="Invoice preparation demonstration"
            caption="Invoice preparation — order lines, amounts, and payment details."
            width={1828} height={1080}
          />

          <CaseProse>
            <h3>WeChat storefront and builder</h3>
            <p>Customers browse products with ERP-backed stock, euro prices, and product-specific tax rates. Checkout determines delivery options and shipping costs from the address, goods weight, and regional free-shipping rules. Orders enter the ERP directly, without sales staff checking stock or re-entering details. Staff configure storefront modules in the builder with a live preview.</p>
          </CaseProse>
          <CaseVideo
            src="/videos/def-erp/wechat-builder.mp4"
            poster="/videos/def-erp/wechat-builder.webp"
            label="WeChat storefront builder demonstration"
            caption="WeChat storefront builder — modules and live preview."
            width={1828} height={1080}
          />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,var(--case-grid-column-min)),1fr))] items-center gap-[var(--case-space-24)]">
            <CaseFigure caption="Account pairing in the ERP.">
              <Image src="/img/def-erp/evidence/account-pairing-collapsed-eb0e79b5cca9.webp" alt="ERP customer account pairing screen with a WeChat code, expiry date, and linked account status." width={3200} height={2000} sizes="(min-width: 768px) 50vw, 100vw" unoptimized />
            </CaseFigure>
            <CaseProse>
              <h3>Link each customer to their ERP account</h3>
              <p>Staff generate a pairing code from the customer&apos;s ERP profile. The customer scans it or enters the code in the WeChat mini-program (a storefront within WeChat) to link their account.</p>
            </CaseProse>
          </div>
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

        <CaseChapter label="09 / Results" title="Customers now place most orders themselves.">
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

        <CaseClose label="10 / Reflection" title="What I Learned">
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
  );
}
