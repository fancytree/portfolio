import type { Metadata } from 'next';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/case-kit/CaseKitControls';
import { DecisionCards, ReversalList, type Decision, type Reversal } from '../procurement-agent-kit/DecisionCards';
import wide from '../def-erp-kit/DefDecisions.module.css';
import { Compare } from './Compare';
import { ShareBars } from './ResearchCharts';
import { BadgePercent, FileSearch, MessageCircle, PackageCheck, PackageSearch, RotateCcw, Sparkles } from 'lucide-react';
import layout from './Compare.module.css';
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
  CaseStats,
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
  '03 / For you',
  '04 / Finding products',
  '05 / Why Saved',
  '06 / Try it',
  '07 / Look',
  '08 / Feed rhythm',
  '09 / Choosing a product',
  '10 / Product page',
  '11 / Paying',
  '12 / Less weight',
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
              { label: 'Challenge', body: 'DEF sells to businesses, but the mini program was shaped like a consumer shop: every merchant saw every category and browsed to find what they buy again and again.' },
              { label: 'Solution', body: 'For you by business type, search and filters for the whole catalogue, and a Saved tab for reordering, in a quieter black and white system.' },
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

        <CaseChapter label="01 / The problem" title="Our buyers are businesses. The store treated them like shoppers.">
          <CaseProse>
            <p>DEF sells to merchants: salons, barbers, nail studios, spas. The first mini program had the structure of a consumer shop. It opened on a category grid and a promotion, gave browsing a tab of its own, and showed every visitor the same thing. It <a href="/projects/def-erp-kit">kept the look salons already knew</a> so it could launch quickly. This redesign takes up what that decision postponed.</p>
          </CaseProse>
          <div className={layout.split}>
            <CaseFigure caption="Before · Home, the Categories tab and a product page, on demonstration data.">
              <Compare columns={3} label="Previous home, categories and product page" items={[
                { shot: 'before-home', name: 'Home' },
                { shot: 'before-catalog', name: 'Categories' },
                { shot: 'before-product', name: 'Product' },
              ]} />
            </CaseFigure>
            <CaseSteps items={[
              { title: 'Everyone sees everything', body: 'Home opens on eight categories with equal weight, though most of a merchant’s spend sits in one trade. → For you, by business type (03).' },
              { title: 'Finding means browsing', body: 'A whole tab goes to the category tree, and every visit starts from the top. → Search and filters (04).' },
              { title: 'No shortlist', body: 'Past orders sit in the account, with no place for the exact products a business keeps buying. → A Saved tab (05).' },
              { title: 'One page shape for every product', body: 'Built around a capacity button and a quantity bar, with no key facts up front and no room for shades, models or pack units. → A new product page and an adaptive sheet (09, 10).' },
            ]} />
          </div>
        </CaseChapter>

        <CaseChapter label="02 / Research" title="Merchants come back for what they already buy, and what is new in it.">
          <CaseProse>
            <p>I used three sources: interviews with <strong>seven merchants</strong>, an interview with a salesperson, and <strong>six months of sales lines</strong> from the previous system (March to August 2026).</p>
            <p>The merchants came back to four things.</p>
          </CaseProse>
          <CaseEvidenceCards label="What seven merchants look for" layout="pairs" items={[
            { icon: <Sparkles />, title: 'New from my brands', body: 'Has a brand I follow brought out something new? → Your ranges flags new shades.' },
            { icon: <PackageCheck />, title: 'Back in stock', body: 'Has what I needed, and could not get, arrived? → Restock lists what is back and what is still expected.' },
            { icon: <BadgePercent />, title: 'Offers that matter to me', body: 'Is something I buy regularly on offer, or is there a store-wide deal? → Offers from what you buy in Saved; store-wide deals on home.' },
            { icon: <RotateCcw />, title: 'Otherwise, reorder', body: 'Beyond those three, the path through the store is buying again. → A tab built for it.' },
          ]} />
          <CaseProse><p>A salesperson added what the work looks like from the other side.</p></CaseProse>
          <CaseEvidenceCards label="What the interview showed" items={[
            { icon: <PackageSearch />, title: 'One shade, one listing', body: 'The same product in another colour had to be created as a separate item, and staff found it tedious to look things up. → One product page with a shade sheet.' },
            { icon: <MessageCircle />, title: 'Orders arrive as messages', body: 'Many customers send what they want on WeChat and staff key it in. → Make reordering quick enough to do it themselves.' },
            { icon: <FileSearch />, title: 'Money checked in four places', body: 'Payments were matched across the old system, chat, invoices and bank transfers. → Receipt and review live on the order.' },
          ]} />
          <CaseStats items={[
            { value: '85%', label: 'Of repeat accounts bought the same product again; 99% of those with four or more order days' },
            { value: '73%', label: 'Of account orders were return visits' },
            { value: '87%', label: 'Of account sales came from accounts that ordered more than once' },
          ]} />
          <CaseFigure caption="Established accounts: items in August orders from accounts with six or more earlier order days. Across all return visits, including accounts only a few weeks old, the same-product share is 47%.">
            <ShareBars title="How much of an order has been bought before" rows={[
              { label: 'Same item, same shade', value: 42 },
              { label: 'Same product, any shade', value: 75, key: true },
              { label: 'Same brand', value: 94 },
            ]} />
          </CaseFigure>
          <CaseFigure caption="The same orders, polish, gel and hair dye only. Only one item in ten comes from a range the account had not bought.">
            <ShareBars title="When an established merchant buys a colour" rows={[
              { label: 'New shade from a range they buy', value: 54, key: true },
              { label: 'A shade they bought before', value: 36 },
              { label: 'A range new to them', value: 10 },
            ]} />
          </CaseFigure>
          <CaseStats items={[
            { value: '11×', label: 'More likely to buy a new shade if the account already bought that range: 13% against 1%' },
            { value: '52%', label: 'Of new shades bought by existing accounts came from a range they already buy' },
            { value: '77%', label: 'Came from a brand they already buy' },
          ]} />
          <CaseProse>
            <p>A new shade here is one first sold in May or later, measured to the end of August, among colour buyers who ordered again.</p>
            <p><strong>So reordering earns its own tab, one product holds all its shades, and the way back is organised by range, with new shades flagged to the accounts that follow it.</strong></p>
          </CaseProse>
          <CaseStats items={[
            { value: '69%', label: 'Of repeat accounts put at least 80% of their spend into one trade' },
            { value: '26%', label: 'Buy from only one trade; the rest also cross into others' },
            { value: '80%', label: 'Have nails as their main trade; hair 14%, hair removal 6%' },
          ]} />
          <CaseProse>
            <p><strong>And For you leads with the main trade, keeping every other trade one tap away.</strong></p>
            <p>Limits: six months of data, so shares rise as an account’s history grows. It includes counter and staff-entered orders and cannot isolate the mini program. The old system had no product level, so I grouped codes into products by name. Walk-in sales are excluded.</p>
          </CaseProse>
        </CaseChapter>

        <CaseChapter label="03 / For you" title="From a category grid to For you.">
          <CaseProse>
            <p>The home page now starts from the merchant. Business verification asks for the <strong>main business type</strong> and any additional services, and For you is built from that answer. It can be changed later.</p>
          </CaseProse>
          <DecisionCards items={[homeDecision]} start={1} />
          <CaseFigure caption="Before and after. Verification supplies the business type behind the new home.">
            <Compare wide label="From category grid to For you" items={[
              { shot: 'before-home', name: 'Before: category grid', tag: 'Before', why: 'The catalogue’s structure comes first.', alt: 'Previous home page' },
              { shot: 'verify', name: 'Ask once: business type', tag: 'Input', why: 'One field the business already has to fill in to see its prices.' },
              { shot: 'home', name: 'After: For you', chosen: true, why: 'Products come first. The trades sit in one row of chips.', alt: 'New home page' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="What For you means for four kinds of merchant. An illustration of the rule, built from the same components.">
            <Compare label="For you by business type" items={[
              { shot: 'foryou-hair', name: 'Hair salon', why: 'Colour, shampoo, tint tools, gloves.' },
              { shot: 'foryou-nails', name: 'Nail salon', why: 'Gel shades, top coat, gloves.' },
              { shot: 'foryou-barber', name: 'Barber shop', why: 'Chair, shampoo, gloves, tools.' },
              { shot: 'foryou-beauty', name: 'Beauty salon', why: 'Serum, blush, gloves, shades.' },
            ]} />
          </CaseFigure>
          <CaseProse>
            <p>For you is selected by default; Hair, Barber, Beauty, Nails and Spa sit beside it for anyone who buys across trades. The first version uses <strong>rules on business type</strong>, and the same feed can take a ranking algorithm later. Guests see a general selection.</p>
          </CaseProse>
        </CaseChapter>

        <CaseChapter label="04 / Finding products" title="Without the grid, everything still has to be findable.">
          <CaseProse>
            <p>The old grid mixed <strong>who a product is for</strong> (nails, hair) with <strong>what it is</strong> (furniture, consumables). I separated the questions and gave each its own way in.</p>
          </CaseProse>
          <CaseSteps items={[
            { title: 'By trade', body: 'The chips under the banner switch the home page to another trade.' },
            { title: 'By name or code', body: 'One search box takes name, brand, SKU or EAN, and remembers recent searches.' },
            { title: 'By kind or brand', body: 'The search page holds Care, Consumables, Tools and Equipment, and a way in by brand.' },
            { title: 'By attribute', body: 'Filters sit beside the search box. Their attributes follow the category, show the number of results, and are kept when you come back.' },
          ]} />
          <CaseFigure caption="Search, filters and the result list.">
            <Compare wide label="Search, filter and list" items={[
              { shot: 'search', name: 'Search', why: 'Recent, category and brand are ready before anything is typed.' },
              { shot: 'filters', name: 'Filters', why: 'A bottom sheet: category, colour family, size, brand, stock, and a result count on the button.' },
              { shot: 'list', name: 'Results', why: 'Each card says what comes next: choose shade, select options, add, or ask for a quote.' },
            ]} />
          </CaseFigure>
          <CaseProse><p>When nothing matches, the page suggests other words, nearby categories and a way to reach support. I cut photo search: it cost too much to build well for what it would give.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="05 / Why Saved" title="Why the second tab is Saved, not Categories.">
          <CaseProse>
            <p>A tab is for what someone comes back to do. <strong>85% of repeat accounts buy the same product again</strong>, and almost all do once they have ordered four times. Browsing still matters, mostly for new shades and items inside familiar brands, and For you and search can carry it. A Categories tab would repeat both, so its slot goes to <strong>the merchant’s own shortlist</strong>.</p>
          </CaseProse>
          <CaseFigure caption="Tab bar, before and after.">
            <Compare wide columns={2} label="Tab bar before and after" items={[
              { shot: 'tab-old', name: 'Home, Categories, Cart, Me', why: 'A permanent place for browsing.' },
              { shot: 'tab-capsule', name: 'Home, Saved, Bag, Account', chosen: true, why: 'A permanent place for reordering.' },
            ]} />
          </CaseFigure>
          <DecisionCards items={[tabDecision]} start={2} />
          <CaseSteps items={[
            { title: 'Find it once', body: 'Through For you or search.' },
            { title: 'Keep the exact one', body: 'The heart saves one SKU: a shade, size or model, not just the product.' },
            { title: 'Reorder from the tab', body: 'Plus adds it straight to the bag, or opens the sheet when there is a pack size to choose.' },
            { title: 'Go back to a range', body: 'Added after the research: Your ranges lists the lines an account keeps buying, says when one has new shades, and opens them in one tap. It is built from orders, so nothing has to be saved.' },
            { title: 'What changed since last time', body: 'Offers on things you buy sit in Saved, and Restock shows what is back. Buy again sits beside them; Lists is still to be designed.' },
          ]} />
          <CaseFigure caption="From a product to the shortlist.">
            <Compare wide label="Save and reorder" items={[
              { shot: 'product-shade', name: '1 · Tap the heart', why: 'In the page header, away from the buy button.', alt: 'Product page with heart' },
              { shot: 'save-sheet', name: '2 · Pick the SKU', why: 'Only SKU options. No quantity, no packaging.' },
              { shot: 'saved', name: '3 · Reorder in Saved', why: 'Your ranges on top, with new shades flagged; saved items below, each with a plus.' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="What merchants check when they come back. Added after the interviews and the order data.">
            <Compare wide columns={2} label="Saved and Restock" items={[
              { shot: 'saved', name: 'New and on offer', why: 'New shades in your ranges, then offers on what you buy, then your saved items.' },
              { shot: 'restock', name: 'Back in stock', why: 'What has arrived can be added at once; what has not shows when it is expected.' },
            ]} />
          </CaseFigure>
          <ReversalList items={savingReversals} />
          <CaseFigure caption="Saving first sat on the buying path. The earlier sheet is recreated with the same data.">
            <Compare wide columns={2} label="Saving in the buy sheet" items={[
              { shot: 'save-before', name: 'Heart beside the buy button', why: 'A secondary action competed with the main one.' },
              { shot: 'sheet-serum', name: 'Buy sheet without it', chosen: true, why: 'Nothing sits next to Add to Bag.', alt: 'Buy sheet without a heart' },
            ]} />
          </CaseFigure>
          <CaseProse><p>The orders behind these figures include counter sales. How often merchants use Saved and Your ranges in the mini program is the thing to check once it is live.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="06 / Try it" title="Use the redesign.">
          <CaseProse><p>Five tours play in turn. <strong>Move your pointer into the frame to take over</strong>: switch trades, search, add products, save a shade, check out and pay. Names, prices and orders are demonstration data.</p></CaseProse>
          <MiniProgramDemo />
        </CaseChapter>

        <CaseChapter label="07 / Look" title="The products bring the colour.">
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

        <CaseChapter label="08 / Feed rhythm" title="Order first, variety last.">
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

        <CaseChapter label="09 / Choosing a product" title="One sheet that adapts to what is being sold.">
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

        <CaseChapter label="10 / Product page" title="One scroll, no inner pages.">
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

        <CaseChapter label="11 / Paying" title="No online payment, so the order has to explain itself.">
          <CaseProse>
            <p>Merchants place the order first, pay by their own method, upload the receipt and wait for finance to check it. Balance is deducted at checkout. Customers with payment terms receive goods and pay later.</p>
          </CaseProse>
          <DecisionCards items={[paymentDecision]} start={3} />
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

        <CaseChapter label="12 / Less weight" title="Many of my review notes asked for less.">
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

        <CaseChapter label="13 / Working with AI" title="AI drafted. I decided.">
          <CaseProse>
            <p>Claude drafted the requirements document from my first version, and generated the screens, the component code, the motion and this prototype. Codex generated the product photography. The brands in these screens are made up for the design.</p>
            <p>My work was framing the problem, giving direction, reviewing on the canvas and rejecting what was wrong. The sliding tab pill, the volume price table and the heart beside the buy button all made it into a draft. I removed each of them.</p>
          </CaseProse>
        </CaseChapter>

        <CaseClose label="14 / Where it stands" title="Designed, not yet built.">
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
