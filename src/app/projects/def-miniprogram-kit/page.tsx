import type { Metadata } from 'next';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/case-kit/CaseKitControls';
import { DecisionCards, ReversalList, type Decision, type Reversal } from '../procurement-agent-kit/DecisionCards';
import wide from '../def-erp-kit/DefDecisions.module.css';
import { Compare } from './Compare';
import MiniProgramDemo from './MiniProgramDemo';
import { DEF_MINI_REDESIGN_URL } from './demoUrl';
import {
  CaseChapter,
  CaseClose,
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
  '02 / Direction',
  '03 / Try it',
  '04 / Look',
  '05 / Home',
  '06 / Choosing a product',
  '07 / Product page',
  '08 / Saving',
  '09 / Paying',
  '10 / Less weight',
  '11 / Working with AI',
  '12 / Where it stands',
];

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
          intro="I redesigned DEF’s WeChat mini program around how businesses buy, and got there mostly by taking things away."
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
              { label: 'Challenge', body: 'The mini program was shaped like a consumer shop. Its buyers are businesses, ordering many brands and many variants again and again.' },
              { label: 'Solution', body: 'A merchant-first store in black and white, one selection sheet that adapts to each product, and payment by transfer built into the order.' },
              { label: 'Outcome', body: 'Designed and prototyped, waiting for development. There are no results to report yet.' },
            ],
            deliverables: ['Requirements', 'Screen designs', 'Design system', 'Clickable prototype'],
          }}
        />
        <CaseFigure caption="Where the design ended up, on demonstration data.">
          <Compare label="Final screens" items={[
            { shot: 'home', name: 'Home' },
            { shot: 'product', name: 'Product page' },
            { shot: 'shade-sheet', name: 'Shade sheet' },
            { shot: 'payment', name: 'Payment' },
          ]} />
        </CaseFigure>

        <CaseChapter label="01 / The problem" title="Built like a retail shop. Used by merchants.">
          <CaseProse>
            <p>The first version connected ordering to the ERP and <a href="/projects/def-erp-kit">kept the look salons already knew</a>, so it could launch quickly. This redesign takes up what that decision postponed.</p>
          </CaseProse>
          <CaseFigure caption="Before · The previous mini program, on demonstration data.">
            <Compare label="Previous mini program" items={[
              { shot: 'before-home', name: 'Home', why: 'A shopper’s home: banner, category icons, brands.' },
              { shot: 'before-catalog', name: 'Catalogue', why: 'A category tree in Chinese inside an otherwise English interface.' },
              { shot: 'before-product', name: 'Product', why: 'Capacity on the page and quantity in a second bar, built around one simple option.' },
              { shot: 'before-account', name: 'Account', why: 'Money and orders packed into a heavy red block.' },
            ]} />
          </CaseFigure>
          <CaseSteps items={[
            { title: 'A consumer structure', body: 'The information architecture assumed a retail shopper. The actual customer is a business, with its own prices, balance, payment terms and quotes.' },
            { title: 'Colour fighting colour', body: 'DEF carries many categories and brands. A red interface around all that packaging was visually noisy.' },
            { title: 'Slow to choose', body: 'Picking the right shade, size or pack was too much work for an order someone places again and again.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="02 / Direction" title="Start from the merchant, and let each kind of product behave differently.">
          <CaseSteps items={[
            { title: 'Merchant first', body: 'Payment, terms, quotes, approvals and reordering are part of the store, not add-ons.' },
            { title: 'One shell, many product types', body: 'Shades, sizes, models, capacities and pack units configure the page and the selector automatically.' },
            { title: 'A feed per type of merchant', body: 'Home is designed as a For you feed of modules, meant to be ordered by an algorithm for each kind of business.' },
            { title: 'Four tabs, in English', body: 'The brief had five: Home, Categories, Reorder, Cart, Me. Categories moved into the home chips and search, reordering into Saved.' },
          ]} />
          <CaseProse><p>I also cut photo search from the home page. It cost too much to build well for what it would give.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="03 / Try it" title="Use the redesign.">
          <CaseProse><p>Four tours play in turn. <strong>Move your pointer into the frame to take over</strong>: add products, save a shade, check out and pay. Names, prices and orders are demonstration data.</p></CaseProse>
          <MiniProgramDemo />
        </CaseChapter>

        <CaseChapter label="04 / Look" title="The products bring the colour.">
          <CaseFigure caption="Round 1 · Three directions on the same content.">
            <Compare wide label="Home directions" items={[
              { shot: 'dir-studio', name: 'Bold studio', why: 'Red blocks compete with every brand’s packaging.' },
              { shot: 'dir-supply', name: 'Pro supply', why: 'Efficient for reordering, but products shrink to thumbnails and navy adds one more colour.' },
              { shot: 'dir-editorial', name: 'Editorial', chosen: true, why: 'Black and white leaves the colour to the products and gives imagery room. Sephora was my reference.' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="Round 2 · Editorial, laid out four ways.">
            <Compare label="Editorial layouts" items={[
              { shot: 'layout-cover', name: 'Cover', why: 'One campaign fills the screen. Nothing with a price is visible without scrolling.' },
              { shot: 'layout-index', name: 'Index', why: 'Quick to scan categories, but products and brands stay small.' },
              { shot: 'layout-lookbook', name: 'Lookbook', chosen: true, why: 'Two staggered columns hold a story, a brand and priced products together, and take new card types without a new layout.' },
              { shot: 'layout-column', name: 'Column', why: 'One product per screen is too slow for someone restocking many items.' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="Wireframe, chosen layout, final home. The wireframes stayed on their own page so each step could be compared.">
            <Compare wide label="Home from wireframe to final" items={[
              { shot: 'wire-home', name: 'Wireframe' },
              { shot: 'layout-lookbook', name: 'Lookbook layout', alt: 'Lookbook layout as chosen' },
              { shot: 'home', name: 'Final' },
            ]} />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="05 / Home" title="Order first, variety last.">
          <CaseProse>
            <p>I explored many card types: products, collections, brands, video, articles and volume offers. A feed where every card has a different height looked chaotic and refused to line up.</p>
            <p>So the top of the feed runs <strong>fixed modules with full-width and aligned rows</strong>. The uneven two-column mix only appears at the very bottom, where nothing has to align after it.</p>
          </CaseProse>
          <CaseFigure caption="The feed from top to bottom.">
            <Compare wide label="Home feed modules" items={[
              { shot: 'feed-products', name: 'Products and collections', why: 'Aligned rows: what to buy now.' },
              { shot: 'feed-stories', name: 'Brands, video, content', why: 'Full-width blocks: what to learn.' },
              { shot: 'feed-mix', name: 'Mixed feed', why: 'Last, for open-ended browsing.' },
            ]} />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="06 / Choosing a product" title="One sheet that adapts to what is being sold.">
          <CaseFigure caption="How should someone pick a shade? Almost every product in the ERP already has an image per option.">
            <Compare label="Shade selectors" items={[
              { shot: 'swatch-preview', name: 'Large preview', why: 'One colour is huge; the others become small dots that are hard to compare.' },
              { shot: 'swatch-bulk', name: 'Bulk grid', why: 'Several shades with quantities is more than the task needs. One SKU per add is enough.' },
              { shot: 'swatch-compare', name: 'Side by side', why: 'Good for judging two colours, an extra screen for a routine order.' },
              { shot: 'swatch-cards', name: 'Photo cards', chosen: true, why: 'People see the real colour and pick one SKU in one tap.' },
            ]} />
          </CaseFigure>
          <CaseProse><p>The sheet shows only the attributes a product has. Capacity stays as text. Colour and model use images. Piece, pack and case are <strong>conversion units</strong> of one product, so the sheet always says how many pieces you are buying.</p></CaseProse>
          <CaseFigure caption="The same sheet for four kinds of product.">
            <Compare label="Sheets by attribute" items={[
              { shot: 'sheet-capacity', name: 'Capacity', why: 'Text chips: a number needs no picture.' },
              { shot: 'sheet-glove', name: 'Colour and size', why: 'Colour as swatches, size as text.' },
              { shot: 'sheet-model', name: 'Model', why: 'Images, because model names mean little.' },
              { shot: 'sheet-shade', name: 'Shade', why: 'A photo grid, five to a row.' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="Volume prices. The earlier version is recreated with the same data.">
            <Compare wide columns={2} label="Volume prices" items={[
              { shot: 'volume-before', name: 'A price table under packaging', why: 'It changed with packaging but looked tappable, and said the same thing twice.' },
              { shot: 'sheet-serum', name: 'Unit price inside each pack', chosen: true, why: 'The price steps are visible exactly where the choice is made.' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="Nail polish. The earlier version is recreated with the same data.">
            <Compare wide columns={2} label="Nail polish sheet" items={[
              { shot: 'shade-before', name: 'Eight shades and packaging', why: 'Packaging pushed shades away, and sold-out needed a written label.' },
              { shot: 'sheet-shade', name: 'Twenty shades only', chosen: true, why: 'No packaging for polish. A sold-out shade is struck through on its picture.', alt: 'Shade sheet with twenty shades' },
            ]} />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="07 / Product page" title="One scroll, no inner pages.">
          <CaseProse>
            <p>Everything a buyer needs sits on one page. Four or five facts they care about, such as material or the share of a key ingredient, come right under the price. The long product image tells the rest.</p>
          </CaseProse>
          <CaseFigure caption="From wireframe to final.">
            <Compare wide label="Product page" items={[
              { shot: 'wire-product', name: 'Wireframe', why: 'Selectors, a price table and a link out to specifications.' },
              { shot: 'product', name: 'Serum', chosen: true, why: 'Facts first, options moved into the sheet.', alt: 'Final serum page' },
              { shot: 'product-shade', name: 'Nail polish', chosen: true, why: 'Same structure, with shades to look at.' },
            ]} />
          </CaseFigure>
          <CaseSteps items={[
            { title: 'Removed repetition', body: 'The delivery block and a specification list that repeated the page are gone. If we cannot ship to an address, Add to Bag is disabled.' },
            { title: 'Moved choosing into the sheet', body: 'Options are picked after Add to Bag, which leaves the page denser and calmer.' },
            { title: 'Expiry only when it matters', body: 'Batches of the same product expire on different dates. A date appears only on the page of a short-dated item.' },
            { title: 'Shades to look at', body: 'On the page they are display only, one row by default. Choosing happens in the sheet.' },
          ]} />
          <CaseFigure caption="Twenty shades on the product page. One row keeps the page short; the rest is one tap away.">
            <Compare wide columns={2} label="Shades folded and expanded" items={[
              { shot: 'fold-closed', name: 'One row by default' },
              { shot: 'fold-open', name: 'All twenty' },
            ]} />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="08 / Saving" title="I moved saving off the buying path.">
          <ReversalList items={savingReversals} />
          <CaseFigure caption="The earlier sheet is recreated with the same data.">
            <Compare wide label="Saving" items={[
              { shot: 'save-before', name: 'Heart beside the buy button', why: 'A secondary action competed with the main one.' },
              { shot: 'sheet-serum', name: 'Buy sheet', chosen: true, why: 'Nothing sits next to Add to Bag.', alt: 'Buy sheet without a heart' },
              { shot: 'save-sheet', name: 'Save sheet', chosen: true, why: 'Opened from the product heart: SKU options and one button.' },
            ]} />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="09 / Paying" title="No online payment, so the order has to explain itself.">
          <CaseProse>
            <p>Merchants place the order first, pay by their own method, upload the receipt and wait for finance to check it. Balance is deducted at checkout. Customers with payment terms receive goods and pay later.</p>
          </CaseProse>
          <DecisionCards items={[paymentDecision]} start={1} />
          <CaseFigure caption="One order, four moments.">
            <Compare label="Payment journey" items={[
              { shot: 'checkout', name: 'Checkout', why: 'Balance is applied first and the rest is stated.' },
              { shot: 'payment', name: 'Pay', why: 'Timer, bank details and upload on one screen.' },
              { shot: 'review', name: 'Under review', why: 'Says who is acting and that stock is held.' },
              { shot: 'released', name: 'Released', why: 'Says why, and where any money goes.' },
            ]} />
          </CaseFigure>
          <CaseProse>
            <p>I cut a checkout state for insufficient credit, because it does not stop anyone ordering. I pulled the invoice request into its own block, checked by default, because it was easy to miss.</p>
            <p>Most customers have no balance, so an account page built around one felt empty for them. The summary now follows the customer’s situation.</p>
          </CaseProse>
          <CaseFigure caption="One account page, four kinds of customer.">
            <Compare label="Account by customer" items={[
              { shot: 'account-terms', name: 'Payment terms', why: 'What is owed, by when, and the limit.' },
              { shot: 'account-due', name: 'Money due', why: 'The amount and a way to pay it.' },
              { shot: 'account-prepaid', name: 'Prepaid', why: 'The balance available.' },
              { shot: 'account-regular', name: 'Regular', why: 'No empty balance, only what they have bought.' },
            ]} />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="10 / Less weight" title="Many of my review notes asked for less.">
          <ReversalList items={chromeReversals} />
          <CaseFigure caption="The tab bar, four versions.">
            <Compare wide columns={2} label="Tab bar versions" items={[
              { shot: 'tab-first', name: '1 · Solid pill', why: 'Too heavy under a black primary button.' },
              { shot: 'tab-soft', name: '2 · Soft', why: 'Lighter, but still four separate surfaces.' },
              { shot: 'tab-plain', name: '3 · Plain', why: 'Quietest, but loose icons are hard to read over photography.' },
              { shot: 'tab-capsule', name: '4 · One capsule', chosen: true, why: 'The calm of Plain on one floating surface that stays legible.' },
            ]} />
          </CaseFigure>
          <CaseSteps items={[
            { title: 'Bottom actions without a bar', body: 'The total sits left and the button right, over a soft fade. Order rows line up with the Bag instead of inventing a new style.' },
            { title: 'Nothing over the picture', body: 'Banners are one uploaded image. Video titles, length and play button sit under the cover.' },
            { title: 'One system', body: 'Wireframes became a component library with light and dark themes, 37 components, rounded icons and a custom dropdown.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="11 / Working with AI" title="AI drafted. I decided.">
          <CaseProse>
            <p>Claude drafted the requirements document from my first version, and generated the screens, the component code, the motion and this prototype. Codex generated the product photography. The brands in these screens are made up for the design.</p>
            <p>My work was framing the problem, giving direction, reviewing on the canvas and rejecting what was wrong. The sliding tab pill, the volume price table and the heart beside the buy button all made it into a draft. I removed each of them.</p>
          </CaseProse>
        </CaseChapter>

        <CaseClose label="12 / Where it stands" title="Designed, not yet built.">
          <CaseProse>
            <p>The redesign is waiting for development, so there are no results to report yet.</p>
            <p>One question is still open: how Buy again should work.</p>
          </CaseProse>
          <CaseFigure caption="Two options for Buy again, still undecided.">
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
