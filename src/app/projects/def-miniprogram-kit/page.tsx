import type { Metadata } from 'next';
import Image from 'next/image';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/case-kit/CaseKitControls';
import { DecisionCards, ReversalList, type Decision, type Reversal } from '../procurement-agent-kit/DecisionCards';
import {
  CaseChapter,
  CaseClose,
  CaseFigure,
  CaseHero,
  CaseKitPage,
  CaseKitSections,
  CaseProse,
  CasePullquote,
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
  '03 / Look',
  '04 / Home',
  '05 / Choosing a product',
  '06 / Product page',
  '07 / Saving',
  '08 / Paying',
  '09 / Less weight',
  '10 / Working with AI',
  '11 / Where it stands',
];

const SHOTS = {
  hero: [2364, 1200, 'Redesigned home, product page, shade sheet and payment screen side by side.'],
  before: [2364, 1200, 'The previous mini program: red home page, category list, product page and account.'],
  directions: [2364, 1200, 'Three home directions: red studio, navy supply tool and black and white editorial.'],
  layouts: [2364, 1200, 'Four editorial home layouts: cover, index, lookbook and column.'],
  'home-journey': [2364, 1200, 'Home page as wireframe, as the chosen lookbook layout, and as the final screen.'],
  feed: [2364, 1800, 'Home feed: product and collection cards, brand and video cards, then a mixed two-column feed.'],
  'swatch-explore': [2364, 1200, 'Four shade selectors: large preview, bulk grid, side by side comparison and photo cards.'],
  sheets: [2364, 1200, 'Add to Bag sheets for capacity, colour and size, model, and shade.'],
  volume: [2364, 1200, 'Add to Bag sheet with a volume price table, and the same sheet without it.'],
  'shade-before-after': [2364, 1200, 'Nail polish sheet with packaging options, and the sheet showing twenty shades only.'],
  'product-before-after': [2364, 1200, 'Product page wireframe, final serum page and final nail polish page.'],
  'shade-fold': [2364, 1200, 'Shades on the product page, folded to one row and expanded to all twenty.'],
  'save-before-after': [2364, 1200, 'Buy sheet with a heart beside Add to Bag, the buy sheet without it, and the separate save sheet.'],
  money: [2364, 1200, 'Checkout, payment with a thirty minute timer, receipt under review, and a cancelled order.'],
  account: [2364, 844, 'Account page variants showing different money summaries depending on the customer.'],
  tabbar: [1600, 750, 'Four tab bars from heaviest to the final single floating capsule.'],
  buyagain: [2364, 1200, 'Buy again as a product list, as an order list, and as one order with selectable items.'],
} as const;

function Shot({ name }: { name: keyof typeof SHOTS }) {
  const [width, height, alt] = SHOTS[name];
  return (
    <Image
      src={`/img/def-miniprogram/${name}.webp`}
      width={width}
      height={height}
      alt={alt}
      sizes="(min-width: 1024px) 960px, 100vw"
      className="block h-auto w-full"
      unoptimized
    />
  );
}

const lookDecision: Decision = {
  question: 'Whose colour should the store wear?',
  source: 'Home directions',
  options: [
    { label: 'A coloured interface, red or navy', verdict: 'It competes with every brand’s packaging in a multi-brand catalogue.' },
    { label: 'Black, white and grey', verdict: 'Product photography carries the colour. Sephora was my reference.', chosen: true },
  ],
};

const selectionDecision: Decision = {
  question: 'How should someone pick a shade?',
  source: 'Variant selector explorations',
  options: [
    { label: 'Pick many shades with quantities', verdict: 'More than the task needs. One SKU per add is enough.' },
    { label: 'Photo cards, one SKU at a time', verdict: 'People can see the colour, and the choice stays simple.', chosen: true },
  ],
  evidence: 'Almost every product in the ERP already has an image per option.',
};

const volumeDecision: Decision = {
  question: 'Do volume prices need their own block?',
  source: 'Add to Bag sheet',
  options: [
    { label: 'A volume price table under packaging', verdict: 'It moved with packaging but looked tappable.', reversed: true },
    { label: 'Unit price inside each packaging option', verdict: 'The price steps are already visible where the choice is made.', chosen: true },
  ],
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
    <CaseKitPage>
      <CaseStudyControls showProgress navLabels={navLabels} railTitle="DEF mini program" />
      <CaseKitSections>
        <div className="case-mobile-back"><CaseStudyBackButton /></div>
        <CaseHero
          eyebrow="Portfolio · Mobile commerce redesign · 2026"
          title="A storefront rebuilt for merchants, mostly by taking things away"
          intro="DEF sells professional beauty supplies to businesses, but its WeChat mini program was shaped like a consumer shop. I redesigned it around how merchants buy."
          meta={[
            { label: 'Client', value: 'DEF Beauty Supply' },
            { label: 'Role', value: 'Product design: problem, direction, decisions' },
            { label: 'Platform', value: 'WeChat mini program, mobile only' },
            { label: 'Status', value: 'Designed, awaiting development' },
            { label: 'AI tools', value: 'Claude, Codex' },
          ]}
          tags={['B2B commerce', 'Design system', 'AI-assisted design']}
        />
        <CaseFigure caption="Where the design ended up. Names and prices in brackets are placeholders.">
          <Shot name="hero" />
        </CaseFigure>

        <CaseChapter label="01 / The problem" title="Built like a retail shop. Used by merchants.">
          <CaseProse>
            <p>The first version connected ordering to the ERP and <a href="/projects/def-erp-kit">kept the look salons already knew</a>, so it could launch quickly. This redesign takes up what that decision postponed.</p>
          </CaseProse>
          <CaseFigure caption="Before · Home, catalogue, product and account in the previous mini program, shown on demonstration data.">
            <Shot name="before" />
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
            { title: 'Four tabs, in English', body: 'The brief had Home, Categories, Reorder, Cart and Me. I settled on Home, Saved, Bag and Account.' },
          ]} />
          <CaseProse><p>I also cut photo search from the home page. It cost too much to build well for what it would give.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="03 / Look" title="The products bring the colour.">
          <CaseFigure caption="Round 1 · Three directions on the same content: Bold studio, Pro supply, Editorial.">
            <Shot name="directions" />
          </CaseFigure>
          <CaseFigure caption="Round 2 · I took Editorial and pushed its layout four ways. I chose the third, Lookbook.">
            <Shot name="layouts" />
          </CaseFigure>
          <DecisionCards items={[lookDecision]} start={1} />
          <CaseFigure caption="Wireframe, chosen layout, final. The wireframes stayed on their own page so each step could be compared.">
            <Shot name="home-journey" />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="04 / Home" title="Order first, variety last.">
          <CaseProse>
            <p>I explored many card types: products, collections, brands, video, articles and volume offers. A feed where every card has a different height looked chaotic and refused to line up.</p>
            <p>So the top of the feed runs <strong>fixed modules with full-width and aligned rows</strong>. The uneven two-column mix only appears at the very bottom, where nothing has to align after it.</p>
          </CaseProse>
          <CaseFigure caption="Product and collection modules, brand and video modules, then the mixed feed.">
            <Shot name="feed" />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="05 / Choosing a product" title="One sheet that adapts to what is being sold.">
          <CaseFigure caption="Four ways to choose a shade: large preview, bulk grid, comparison, photo cards.">
            <Shot name="swatch-explore" />
          </CaseFigure>
          <DecisionCards items={[selectionDecision]} start={2} />
          <CaseProse><p>The sheet shows only the attributes a product has. Capacity stays as text. Colour and model use images. Piece, pack and case are <strong>conversion units</strong> of one product, so the sheet always says how many pieces you are buying.</p></CaseProse>
          <CaseFigure caption="The same sheet for capacity, colour with size, model, and shade.">
            <Shot name="sheets" />
          </CaseFigure>
          <DecisionCards items={[volumeDecision]} start={3} />
          <CaseFigure caption="Before and after removing the volume price table.">
            <Shot name="volume" />
          </CaseFigure>
          <CasePullquote>Nail polish has <strong>no packaging choice at all</strong>. Twenty shades matter more, and a sold-out one is shown on its picture, without another label.</CasePullquote>
          <CaseFigure caption="Before: eight shades, packaging, an out-of-stock label. After: twenty shades.">
            <Shot name="shade-before-after" />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="06 / Product page" title="One scroll, no inner pages.">
          <CaseProse>
            <p>Everything a buyer needs sits on one page. Four or five facts they care about, such as material or the share of a key ingredient, come right under the price. The long product image tells the rest.</p>
          </CaseProse>
          <CaseFigure caption="From a wireframe with selectors and links to inner pages, to the final serum and nail polish pages.">
            <Shot name="product-before-after" />
          </CaseFigure>
          <CaseSteps items={[
            { title: 'Removed repetition', body: 'The delivery block and a specification list that repeated the page are gone. If we cannot ship to an address, Add to Bag is disabled.' },
            { title: 'Moved choosing into the sheet', body: 'Options are picked after Add to Bag, which leaves the page denser and calmer.' },
            { title: 'Expiry only when it matters', body: 'Batches of the same product expire on different dates. A date appears only on the page of a short-dated item.' },
            { title: 'Shades to look at', body: 'On the page they are display only, one row by default. Choosing happens in the sheet.' },
          ]} />
          <CaseFigure caption="Twenty shades folded to one row, and expanded.">
            <Shot name="shade-fold" />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="07 / Saving" title="I moved saving off the buying path.">
          <ReversalList items={savingReversals} />
          <CaseFigure caption="Heart beside the buy button, buy sheet without it, and the separate save sheet.">
            <Shot name="save-before-after" />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="08 / Paying" title="No online payment, so the order has to explain itself.">
          <CaseProse>
            <p>Merchants place the order first, pay by their own method, upload the receipt and wait for finance to check it. Balance is deducted at checkout. Customers with payment terms receive goods and pay later.</p>
          </CaseProse>
          <DecisionCards items={[paymentDecision]} start={4} />
          <CaseFigure caption="Checkout, the 30-minute window, review, and an order that was released.">
            <Shot name="money" />
          </CaseFigure>
          <CaseProse>
            <p>I cut a checkout state for insufficient credit, because it does not stop anyone ordering. I pulled the invoice request out into its own block, checked by default, because it was easy to miss.</p>
            <p>Most customers have no balance, so an account page built around one felt empty for them. The summary now follows the customer’s situation.</p>
          </CaseProse>
          <CaseFigure caption="One account page at an earlier round: outstanding, due, prepaid, no money summary, and dark mode.">
            <Shot name="account" />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="09 / Less weight" title="Many of my review notes asked for less.">
          <ReversalList items={chromeReversals} />
          <CaseFigure caption="Top to bottom: first version, two lighter comparisons, final capsule.">
            <Shot name="tabbar" />
          </CaseFigure>
          <CaseSteps items={[
            { title: 'Bottom actions without a bar', body: 'The total sits left and the button right, over a soft fade. Order rows line up with the Bag instead of inventing a new style.' },
            { title: 'Nothing over the picture', body: 'Banners are one uploaded image. Video titles, length and play button sit under the cover.' },
            { title: 'One system', body: 'Wireframes became a component library with light and dark themes, 37 components, rounded icons and a custom dropdown.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="10 / Working with AI" title="AI drafted. I decided.">
          <CaseProse>
            <p>Claude drafted the requirements document from my first version, and generated the screens, the component code and the motion. Codex generated the product photography. The brands in these screens are placeholders made for the design.</p>
            <p>My work was framing the problem, giving direction, reviewing on the canvas and rejecting what was wrong. The sliding tab pill, the volume price table and the heart beside the buy button all made it into a draft. I removed each of them.</p>
          </CaseProse>
        </CaseChapter>

        <CaseClose label="11 / Where it stands" title="Designed, not yet built.">
          <CaseProse>
            <p>The redesign is waiting for development, so there are no results to report yet.</p>
            <p>One question is still open. Buy again can list products to add one by one, or orders to reopen and add in bulk. I mocked up both.</p>
          </CaseProse>
          <CaseFigure caption="Buy again by product, by order, and one order opened for bulk adding.">
            <Shot name="buyagain" />
          </CaseFigure>
        </CaseClose>
      </CaseKitSections>
    </CaseKitPage>
  );
}
