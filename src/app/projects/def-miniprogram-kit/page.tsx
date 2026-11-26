import type { Metadata } from 'next';
import { BadgePercent, Droplet, Layers, Palette, Repeat, Store, Waves } from 'lucide-react';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/case-kit/CaseKitControls';
import { DecisionCards, ReversalList, type Decision, type Reversal } from '../procurement-agent-kit/DecisionCards';
import wide from '../def-erp-kit/DefDecisions.module.css';
import { Compare } from './Compare';
import layout from './Compare.module.css';
import { Method, Needs, OrderCharts, SiteMap, TabMap } from './Diagrams';
import MiniProgramDemo from './MiniProgramDemo';
import { DEF_MINI_REDESIGN_URL } from './demoUrl';
import {
  CaseChapter,
  CaseClose,
  CaseEvidenceCards,
  CaseFigure,
  CaseHero,
  CaseKitPage,
  CaseKitSections,
  CaseProse,
  CaseSteps,
} from '../../components/case-kit/CaseKit';

export const metadata: Metadata = {
  title: 'DEF mini-program redesign | Mei Chai',
  description:
    'Redesigning a retail-style WeChat storefront for the merchants who actually buy from it, mostly by deciding what to take away.',
  robots: { index: false, follow: false },
};

const navLabels = [
  '01 / The problem',
  '02 / Research',
  '03 / Structure',
  '04 / Site map',
  '05 / Wireframes',
  '06 / Design language',
  '07 / For you',
  '08 / Choosing a product',
  '09 / Product page',
  '10 / Saving',
  '11 / Paying',
  '12 / Try it',
  '13 / Working with AI',
  '14 / Where it stands',
];

const homeDecision: Decision = {
  question: 'How should a merchant meet a catalogue this wide?',
  source: 'Home structure',
  options: [
    { label: 'A grid of category icons', verdict: 'The same eight doors for everyone. Finding what is relevant is left to the buyer.' },
    { label: 'Make each merchant pick one trade first', verdict: 'Hides products the business may also need.' },
    { label: 'For you first, other trades one tap away', verdict: 'Relevant by default, with nothing locked away.', chosen: true },
  ],
  evidence: '69% of repeat accounts spend at least 80% in one trade, but only 26% never leave it.',
  tradeoff: 'The first version recommends by rules, so it is only as good as the business type on file.',
};

const tabDecision: Decision = {
  question: 'What deserves the second tab?',
  source: 'Bottom navigation',
  options: [
    { label: 'Keep a Categories tab', verdict: 'Repeats the home chips and search, for something a merchant does now and then.' },
    { label: 'Five tabs: Categories and Reorder', verdict: 'The brief’s plan. More choices, and reordering still sits beside browsing.' },
    { label: 'Saved takes the slot; categories move into search', verdict: 'Reordering gets a tab of its own. Browsing stays one tap behind the search box.', chosen: true },
  ],
  evidence: 'In seven merchant interviews, new items, restocks and offers aside, the path was reordering. 85% of repeat accounts buy a product again.',
  tradeoff: 'Someone who likes to browse the whole tree now goes through search.',
};

const paymentDecision: Decision = {
  question: 'How long should an unpaid order hold stock?',
  source: 'Payment rules',
  options: [
    { label: '30 minutes, then cancel no matter what', verdict: 'Finance is not always online, and bank transfers can take days over a weekend.' },
    { label: '30 minutes to upload a receipt, then hold while funds arrive', verdict: 'The deadline only covers what the buyer controls. A stuck order can still be released.', chosen: true },
  ],
  tradeoff: 'Finance needs a manual release step, or stock stays locked.',
};

const savingReversals: Reversal[] = [
  {
    before: 'A heart on the product. Saving kept the whole product.',
    evidence: 'I wanted the chosen shade, size and packaging kept, not just the product.',
    after: 'Save the exact option, with a heart beside Add to Bag.',
    source: 'Saved',
  },
  {
    before: 'A heart beside Add to Bag, saving shade, size and packaging.',
    evidence: 'Saving is not the main path. I did not want it sitting next to the buy button.',
    after: 'No heart in the buy flow. One SKU saves on tap; several open a sheet with SKU options only, no packaging.',
    source: 'Saved',
  },
];

const chromeReversals: Reversal[] = [
  {
    before: 'Four separate circles with a solid black active pill.',
    evidence: 'Next to a black primary button it was too heavy.',
    after: 'One floating capsule. Only the current tab gets a pale fill.',
    source: 'Tab bar',
  },
  {
    before: 'A selection pill that slid from tab to tab.',
    evidence: 'The motion logic was wrong. The tab should widen where it is, on a soft spring.',
    after: 'Tabs change in place. No press scaling.',
    source: 'Tab bar motion',
  },
  {
    before: 'Outline rings around focused and selected controls.',
    evidence: 'Too heavy for feedback.',
    after: 'Soft fills only.',
    source: 'Interaction states',
  },
];

export default function DefMiniProgramKitPage() {
  return (
    <div className={wide.widePage}>
    <CaseKitPage>
      <CaseStudyControls showProgress navLabels={navLabels} railTitle="DEF mini program" />
      <CaseKitSections>
        <div className="case-mobile-back"><CaseStudyBackButton /></div>
        <CaseHero
          eyebrow="Portfolio · B2B commerce redesign · 2026"
          title="DEF Beauty Supply: rebuilding a retail storefront for merchants"
          intro="I rebuilt DEF’s WeChat mini program around why merchants come back: what they already buy, and what is new in it."
          meta={[
            { label: 'Client', value: 'DEF Beauty Supply' },
            { label: 'Year', value: '2026' },
            { label: 'Role', value: 'Product design: problem, direction, decisions' },
            { label: 'Platform', value: 'WeChat mini program, mobile only' },
            { label: 'Status', value: 'Designed, awaiting development' },
            { label: 'AI tools', value: 'Claude, Codex' },
          ]}
          action={{ label: 'Try the clickable prototype', href: DEF_MINI_REDESIGN_URL }}
          tags={['B2B commerce', 'Mobile design', 'Design system', 'AI-assisted design']}
          glance={{
            items: [
              { label: 'Challenge', body: 'A wholesale business was running a consumer-style shop: every merchant saw every category and browsed to find what they buy again and again.' },
              { label: 'Insight', body: 'Merchants return for four things: new items from their brands, restocks, offers on what they buy, and reordering.' },
              { label: 'Solution', body: 'Home starts from the trade, search takes over categories, and a Saved tab is built around coming back.' },
            ],
            deliverables: ['Research', 'Information architecture', 'Wireframes', 'Design system', 'Clickable prototype'],
          }}
        />
        <CaseFigure caption="Where it ended up, on demonstration data.">
          <Compare label="Final screens" items={[
            { shot: 'home', name: 'Home' },
            { shot: 'product', name: 'Product page' },
            { shot: 'shade-sheet', name: 'Shade sheet' },
            { shot: 'payment', name: 'Payment' },
          ]} />
        </CaseFigure>

        <CaseChapter label="01 / The problem" title="Our buyers are businesses. The store treated them like shoppers.">
          <CaseProse><p>DEF sells to salons, barbers and nail studios. Its mini program was shaped like a consumer shop, and <a href="/projects/def-erp-kit">my first rebuild kept that layout</a> to launch quickly.</p></CaseProse>
          <div className={layout.split}>
            <CaseFigure caption="Before · Home, the Categories tab and a product page, on demonstration data.">
              <Compare columns={3} label="Previous home, categories and product page" items={[
                { shot: 'before-home', name: 'Home' },
                { shot: 'before-catalog', name: 'Categories' },
                { shot: 'before-product', name: 'Product' },
              ]} />
            </CaseFigure>
            <CaseSteps items={[
              { title: 'Everyone sees everything', body: 'Eight categories with equal weight, though most of a merchant’s spend sits in one trade.' },
              { title: 'Finding means browsing', body: 'A whole tab for the category tree, started from the top on every visit.' },
              { title: 'No shortlist', body: 'No place for the exact products a business keeps buying.' },
              { title: 'One page shape for every product', body: 'A capacity button and a quantity bar: no key facts up front, no room for shades, models or packs.' },
            ]} />
          </div>
        </CaseChapter>

        <CaseChapter label="02 / Research" title="So what do merchants come for?">
          <CaseProse><p>I asked merchants and sales, then checked the answers against the orders.</p></CaseProse>
          <CaseFigure caption="Three sources.">
            <Method />
          </CaseFigure>
          <CaseFigure caption="Seven merchant interviews, and the design answer to each.">
            <Needs />
          </CaseFigure>
          <CaseFigure caption="Order data, March to August 2026, accounts only. Established: six or more earlier order days, August orders. New shade: first sold in May or later. Includes counter orders; products grouped by name.">
            <OrderCharts />
          </CaseFigure>
          <CaseEvidenceCards label="Three conclusions" items={[
            { icon: <Repeat />, title: 'Build for coming back', body: 'Reordering deserves a permanent place.' },
            { icon: <BadgePercent />, title: 'Organise by range', body: 'New shades, stock and offers hang off what is already bought.' },
            { icon: <Store />, title: 'Lead with the trade', body: 'Start from the main one, keep the others one tap away.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="03 / Structure" title="Rebuild the structure around coming back.">
          <CaseProse><p>The old tabs described a shop. The new ones describe a merchant’s jobs.</p></CaseProse>
          <CaseFigure caption="From the previous tabs to the new ones.">
            <TabMap />
          </CaseFigure>
          <DecisionCards items={[tabDecision]} start={1} />
          <CaseProse><p><strong>Saved</strong> takes the freed slot. It answers the four reasons to return in one place.</p></CaseProse>
          <CaseFigure caption="Saved answers all four reasons to come back.">
            <Compare label="Saved tab" items={[
              { shot: 'saved', name: 'New and on offer', why: 'New shades in your ranges, then offers on what you buy.' },
              { shot: 'restock', name: 'Restock', why: 'What is back, and when the rest is expected.' },
              { shot: 'buy-items', name: 'Buy again', why: 'A past order, ready to add in bulk.' },
              { shot: 'save-sheet', name: 'Save', why: 'Keeps one exact item from any product.' },
            ]} />
          </CaseFigure>
          <CaseProse><p>Home stops being a catalogue, and <strong>search takes over the job of the Categories tab</strong>.</p></CaseProse>
          <CaseFigure caption="Home: from a category grid to For you, fed by the business type.">
            <Compare wide label="From category grid to For you" items={[
              { shot: 'before-home', name: 'Before: category grid', tag: 'Before', why: 'The catalogue’s structure comes first.', alt: 'Previous home page' },
              { shot: 'verify', name: 'Ask once: business type', tag: 'Input', why: 'One field the business already has to fill in to see its prices.' },
              { shot: 'home', name: 'After: For you', chosen: true, why: 'Products come first. The trades sit in one row of chips.', alt: 'New home page' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="Search holds categories and brands; filters follow the category.">
            <Compare wide label="Search, filter and list" items={[
              { shot: 'search', name: 'Search', why: 'Recent, category and brand are ready before anything is typed.' },
              { shot: 'filters', name: 'Filters', why: 'A bottom sheet: category, colour family, size, brand, stock, and a result count on the button.' },
              { shot: 'list', name: 'Results', why: 'Each card says what comes next: choose shade, select options, add, or ask for a quote.' },
            ]} />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="04 / Site map" title="Four tabs, one job each.">
          <CaseFigure caption="Information architecture of the redesigned mini program.">
            <SiteMap />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="05 / Wireframes" title="Draw the whole journey before styling it.">
          <CaseProse><p>Low fidelity settled the flows. Each note says what survived.</p></CaseProse>
          <CaseFigure caption="Discover and choose.">
            <Compare label="Wireframes: discover and choose" items={[
              { shot: 'wf-home', name: 'Home', why: 'Category icons later became a trade-led feed.' },
              { shot: 'wf-list', name: 'List', why: 'Kept: every card names its next step.' },
              { shot: 'wf-product', name: 'Product', why: 'The price table, selectors and inner links left the page.' },
              { shot: 'wf-shades', name: 'Shades', why: 'Many quantities became one photo, one item.' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="Order and return.">
            <Compare label="Wireframes: order and return" items={[
              { shot: 'wf-bag', name: 'Bag', why: 'Kept: its rows now drive every order list.' },
              { shot: 'wf-checkout', name: 'Checkout', why: 'Online payment went; receipt upload came in.' },
              { shot: 'wf-saved', name: 'Saved', why: 'Saved moved ahead of Buy again.' },
              { shot: 'wf-account', name: 'Account', why: 'A settings list became a money summary.' },
            ]} />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="06 / Design language" title="A quiet language, so the products carry the colour.">
          <CaseFigure caption="Explore · Three directions on the same content.">
            <Compare wide label="Home directions" items={[
              { shot: 'dir-studio', name: 'Bold studio', why: 'Red blocks compete with every brand’s packaging.' },
              { shot: 'dir-supply', name: 'Pro supply', why: 'Efficient for reordering, but products shrink to thumbnails and navy adds one more colour.' },
              { shot: 'dir-editorial', name: 'Editorial', chosen: true, why: 'Black and white leaves the colour to the products and gives imagery room. Sephora was my reference.' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="Narrow down · Editorial, four layouts.">
            <Compare label="Editorial layouts" items={[
              { shot: 'layout-cover', name: 'Cover', why: 'One campaign fills the screen. Nothing with a price is visible without scrolling.' },
              { shot: 'layout-index', name: 'Index', why: 'Quick to scan categories, but products and brands stay small.' },
              { shot: 'layout-lookbook', name: 'Lookbook', chosen: true, why: 'Two staggered columns hold a story, a brand and priced products together, and take new card types without a new layout.' },
              { shot: 'layout-column', name: 'Column', why: 'One product per screen is too slow for someone restocking many items.' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="Land · Wireframe, chosen layout, final home.">
            <Compare wide label="Home from wireframe to final" items={[
              { shot: 'wire-home', name: 'Wireframe' },
              { shot: 'layout-lookbook', name: 'Lookbook layout', alt: 'Lookbook layout as chosen' },
              { shot: 'home', name: 'Final' },
            ]} />
          </CaseFigure>
          <CaseEvidenceCards label="Design principles" layout="pairs" items={[
            { icon: <Palette />, title: 'Colour belongs to products', body: 'Ink, white and grey. Colour only for state.' },
            { icon: <Droplet />, title: 'Soft fills, no outlines', body: 'Selection and feedback change the surface.' },
            { icon: <Layers />, title: 'One floating layer', body: 'Tab bar and bottom actions float; no solid bars.' },
            { icon: <Waves />, title: 'Motion that behaves', body: 'Springs, changes in place, no press scaling.' },
          ]} />
          <CaseFigure caption="The system: tokens, components and both themes, 37 components in all.">
            <Compare label="Design system" items={[
              { shot: 'lang-foundations', name: 'Foundations', why: 'Colour, Manrope, four corners, spacing that grows.' },
              { shot: 'lang-light', name: 'Components', why: 'One filled action, everything else quiet.' },
              { shot: 'lang-dark', name: 'Dark', why: 'Same token names, so components carry over.' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="Refining the tab bar: each version took weight away.">
            <Compare wide columns={2} label="Tab bar versions" items={[
              { shot: 'tab-first', name: '1 · Solid pill', why: 'Too heavy under a black primary button.' },
              { shot: 'tab-soft', name: '2 · Soft', why: 'Lighter, but still four separate surfaces.' },
              { shot: 'tab-plain', name: '3 · Plain', why: 'Quietest, but loose icons are hard to read over photography.' },
              { shot: 'tab-capsule', name: '4 · One capsule', chosen: true, why: 'The calm of Plain on one floating surface that stays legible.' },
            ]} />
          </CaseFigure>
          <ReversalList items={chromeReversals} />
        </CaseChapter>

        <CaseChapter label="07 / For you" title="Home starts from the trade.">
          <DecisionCards items={[homeDecision]} start={2} />
          <CaseFigure caption="The same home for four kinds of merchant. An illustration of the rule.">
            <Compare label="For you by business type" items={[
              { shot: 'foryou-hair', name: 'Hair salon', why: 'Colour, shampoo, tint tools, gloves.' },
              { shot: 'foryou-nails', name: 'Nail salon', why: 'Gel shades, top coat, gloves.' },
              { shot: 'foryou-barber', name: 'Barber shop', why: 'Chair, shampoo, gloves, tools.' },
              { shot: 'foryou-beauty', name: 'Beauty salon', why: 'Serum, blush, gloves, shades.' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="Order first, variety last: aligned modules, then the mixed feed at the very bottom.">
            <Compare wide label="Home feed modules" items={[
              { shot: 'feed-products', name: 'Products and collections', why: 'Aligned rows: what to buy now.' },
              { shot: 'feed-stories', name: 'Brands, video, content', why: 'Full-width blocks: what to learn.' },
              { shot: 'feed-mix', name: 'Mixed feed', why: 'Last, for open-ended browsing.' },
            ]} />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="08 / Choosing a product" title="One sheet that adapts to what is being sold.">
          <CaseFigure caption="Picking a shade, four ways.">
            <Compare label="Shade selectors" items={[
              { shot: 'swatch-preview', name: 'Large preview', why: 'One colour is huge; the others become small dots that are hard to compare.' },
              { shot: 'swatch-bulk', name: 'Bulk grid', why: 'Several shades with quantities is more than the task needs. One SKU per add is enough.' },
              { shot: 'swatch-compare', name: 'Side by side', why: 'Good for judging two colours, an extra screen for a routine order.' },
              { shot: 'swatch-cards', name: 'Photo cards', chosen: true, why: 'People see the real colour and pick one SKU in one tap.' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="The sheet shows only the attributes a product has.">
            <Compare label="Sheets by attribute" items={[
              { shot: 'sheet-capacity', name: 'Capacity', why: 'Text chips: a number needs no picture.' },
              { shot: 'sheet-glove', name: 'Colour and size', why: 'Colour as swatches, size as text.' },
              { shot: 'sheet-model', name: 'Model', why: 'Images, because model names mean little.' },
              { shot: 'sheet-shade', name: 'Shade', why: 'A photo grid, five to a row.' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="Taking choices out of the sheet. Earlier versions recreated.">
            <Compare label="Volume prices and nail polish" items={[
              { shot: 'volume-before', name: 'Price table', why: 'Looked tappable and said the same thing twice.' },
              { shot: 'sheet-serum', name: 'Price in each pack', chosen: true, why: 'Seen exactly where the choice is made.' },
              { shot: 'shade-before', name: 'Polish with packs', why: 'Packaging pushed shades away.' },
              { shot: 'sheet-shade', name: 'Twenty shades', chosen: true, why: 'Sold out is struck through on the picture.' },
            ]} />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="09 / Product page" title="One scroll, no inner pages.">
          <CaseFigure caption="Facts first; choosing moves into the sheet. A delivery block and repeated specifications are gone.">
            <Compare label="Product page" items={[
              { shot: 'wire-product', name: 'Wireframe', why: 'Selectors, a price table and a link out.' },
              { shot: 'product', name: 'Serum', chosen: true, why: 'Key facts under the price.' },
              { shot: 'fold-closed', name: 'Shades, one row', chosen: true, why: 'For looking, not choosing.' },
              { shot: 'fold-open', name: 'All twenty', chosen: true, why: 'One tap away.' },
            ]} />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="10 / Saving" title="Saving stays off the buying path.">
          <CaseFigure caption="Saving moved from the buy button to the product header. Earlier sheet recreated.">
            <Compare label="Saving" items={[
              { shot: 'save-before', name: 'Heart beside buy', why: 'Competed with the main action.' },
              { shot: 'sheet-serum', name: 'Buy sheet', chosen: true, why: 'Nothing next to Add to Bag.', alt: 'Buy sheet without a heart' },
              { shot: 'product-shade', name: 'Heart in the header', chosen: true, why: 'Away from the buying path.' },
              { shot: 'save-sheet', name: 'Save sheet', chosen: true, why: 'The exact item, no quantity or pack.' },
            ]} />
          </CaseFigure>
          <ReversalList items={savingReversals} />
        </CaseChapter>

        <CaseChapter label="11 / Paying" title="No online payment, so the order explains itself.">
          <DecisionCards items={[paymentDecision]} start={3} />
          <CaseFigure caption="Checkout, pay, review, release.">
            <Compare label="Payment journey" items={[
              { shot: 'checkout', name: 'Checkout', why: 'Balance is applied first and the rest is stated.' },
              { shot: 'payment', name: 'Pay', why: 'Timer, bank details and upload on one screen.' },
              { shot: 'review', name: 'Under review', why: 'Says who is acting and that stock is held.' },
              { shot: 'released', name: 'Released', why: 'Says why, and where any money goes.' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="The account summary follows the customer’s situation.">
            <Compare label="Account by customer" items={[
              { shot: 'account-terms', name: 'Payment terms', why: 'What is owed, by when, and the limit.' },
              { shot: 'account-due', name: 'Money due', why: 'The amount and a way to pay it.' },
              { shot: 'account-prepaid', name: 'Prepaid', why: 'The balance available.' },
              { shot: 'account-regular', name: 'Regular', why: 'No empty balance, only what they have bought.' },
            ]} />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="12 / Try it" title="Try the redesign.">
          <CaseProse><p>Five short tours play in turn. <strong>Move your pointer into the frame to take over.</strong> All data is for demonstration.</p></CaseProse>
          <MiniProgramDemo />
        </CaseChapter>

        <CaseChapter label="13 / Working with AI" title="AI drafted. I decided.">
          <CaseProse><p>I did the research and set the direction. Claude drafted the requirements, screens, component code and this prototype; Codex made the product imagery; the brands are invented.</p></CaseProse>
          <CaseProse><p>A sliding tab pill, a volume price table and a heart beside the buy button all reached a draft. I removed each one.</p></CaseProse>
        </CaseChapter>

        <CaseClose label="14 / Where it stands" title="Designed, not yet built.">
          <CaseProse><p>Awaiting development, so there are no results yet. One question is still open: how Buy again should work.</p></CaseProse>
          <CaseFigure caption="Two options, undecided.">
            <Compare wide label="Buy again options" items={[
              { shot: 'buy-products', name: 'A · By product', tag: 'Open', why: 'Quickest to restock one thing. Adding many takes many taps.' },
              { shot: 'buy-orders', name: 'B · By order', tag: 'Open', why: 'Reopen a past order and recognise it by its pictures.' },
              { shot: 'buy-items', name: 'B · Inside an order', tag: 'Open', why: 'Untick, change quantities and add in bulk.' },
            ]} />
          </CaseFigure>
        </CaseClose>
      </CaseKitSections>
    </CaseKitPage>
    </div>
  );
}
