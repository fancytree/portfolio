import type { Metadata } from 'next';
import { BadgePercent, Repeat, Store } from 'lucide-react';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/case-kit/CaseKitControls';
import wide from '../def-erp-kit/DefDecisions.module.css';
import { Compare } from './Compare';
import layout from './Compare.module.css';
import { CategoryFlow } from './CategoryFlow';
import { Method, Needs, OrderCharts, SiteMap, TabMap } from './Diagrams';
import { HomeCallouts } from './HomeCallouts';
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
  '04 / Wireframes',
  '05 / For you',
  '06 / Choosing',
  '07 / Saving',
  '08 / Design language',
  '09 / Try it',
  '10 / Where it stands',
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
              { label: 'Solution', body: 'Home follows each merchant’s categories, search takes over browsing, and a Saved tab is built around coming back.' },
            ],
            deliverables: ['Research', 'Information architecture', 'Wireframes', 'Design system', 'Clickable prototype'],
          }}
        />
        <CaseFigure caption="Where it ended up, on demonstration data.">
          <Compare label="Final screens" items={[
            { shot: 'home', name: 'Home' },
            { shot: 'product', name: 'Product page' },
            { shot: 'shade-sheet', name: 'Shade sheet' },
            { shot: 'saved', name: 'Saved' },
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
              { title: 'Everyone sees everything', body: 'Eight categories with equal weight, though most of a merchant’s spend sits in one. → 05' },
              { title: 'Finding means browsing', body: 'A whole tab for the category tree, started from the top on every visit. → 05' },
              { title: 'No shortlist', body: 'No place for the exact products a business keeps buying. → 03, 07' },
              { title: 'One page shape for every product', body: 'A capacity button and a quantity bar: choosing the right item to order takes work. → 06' },
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
            { icon: <Store />, title: 'Lead with their categories', body: 'Each merchant’s own, with everything else searchable.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="03 / Structure" title="Rebuild the structure around coming back.">
          <CaseProse><p>The old tabs described a shop. Merchants come back to restock and to see what is new in what they buy, so that job takes the Categories tab’s place as <strong>Saved</strong>. Finding by category moves into search.</p></CaseProse>
          <CaseFigure caption="From the previous tabs to the new ones.">
            <TabMap />
          </CaseFigure>
          <CaseFigure caption="Saved answers all four reasons to come back.">
            <Compare label="Saved tab" items={[
              { shot: 'saved', name: 'New and on offer', why: 'New shades in your ranges, then offers on what you buy.' },
              { shot: 'restock', name: 'Restock', why: 'What is back, and when the rest is expected.' },
              { shot: 'buy-items', name: 'Buy again', why: 'A past order, ready to add in bulk.' },
              { shot: 'save-sheet', name: 'Save', why: 'Keeps one exact item from any product.' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="Information architecture: four tabs, one job each.">
            <SiteMap />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="04 / Wireframes" title="Draw the whole journey before styling it.">
          <CaseFigure caption="Discover and choose.">
            <Compare label="Wireframes: discover and choose" items={[
              { shot: 'wf-home', name: 'Home' },
              { shot: 'wf-list', name: 'List' },
              { shot: 'wf-product', name: 'Product' },
              { shot: 'wf-shades', name: 'Shades' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="Order and return.">
            <Compare label="Wireframes: order and return" items={[
              { shot: 'wf-bag', name: 'Bag' },
              { shot: 'wf-checkout', name: 'Checkout' },
              { shot: 'wf-saved', name: 'Saved' },
              { shot: 'wf-account', name: 'Account' },
            ]} />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="05 / For you" title="Home follows each merchant’s categories.">
          <CaseProse><p>Products and merchants use <strong>one set of categories</strong>. Where the two overlap is what a merchant sees first, so the home tabs are their own instead of a fixed list.</p></CaseProse>
          <CaseFigure caption="From categories to tabs, with one merchant as the example.">
            <CategoryFlow />
          </CaseFigure>
          <CaseFigure caption="The new home: from a fixed category grid to tabs that belong to the merchant.">
            <HomeCallouts />
          </CaseFigure>
          <CaseFigure caption="Four merchants, four sets of tabs, and the same gloves in each. Demonstration data; the first version recommends by rules.">
            <Compare label="For you by merchant" items={[
              { shot: 'foryou-hair', name: 'Hair and beauty' },
              { shot: 'foryou-nails', name: 'Nails and pedicure' },
              { shot: 'foryou-barber', name: 'Barber and hair' },
              { shot: 'foryou-beauty', name: 'Beauty and spa' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="Everything stays findable: search takes over the Categories tab.">
            <Compare wide label="Search, filter and list" items={[
              { shot: 'search', name: 'Search', why: 'Category and brand are ready before anything is typed.' },
              { shot: 'filters', name: 'Filters', why: 'They follow the category.' },
              { shot: 'list', name: 'Results', why: 'Each card says its next step.' },
            ]} />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="06 / Choosing" title="Show only the choice the product needs.">
          <CaseProse><p>Picking the item to order was laborious. Each product type now configures its own display, and one add is one item, so price tables and pack choices that did not help left the screen.</p></CaseProse>
          <CaseFigure caption="Picking a shade, four ways.">
            <Compare label="Shade selectors" items={[
              { shot: 'swatch-preview', name: 'Large preview', why: 'The other colours become dots that are hard to compare.' },
              { shot: 'swatch-bulk', name: 'Bulk grid', why: 'More than the task needs.' },
              { shot: 'swatch-compare', name: 'Side by side', why: 'An extra screen for a routine order.' },
              { shot: 'swatch-cards', name: 'Photo cards', chosen: true, why: 'The real colour, picked in one tap.' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="One sheet, shaped by the product’s attributes.">
            <Compare label="Sheets by attribute" items={[
              { shot: 'sheet-capacity', name: 'Capacity' },
              { shot: 'sheet-glove', name: 'Colour and size' },
              { shot: 'sheet-model', name: 'Model' },
              { shot: 'sheet-shade', name: 'Shade' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="The product page is for facts; choosing happens in the sheet.">
            <Compare wide label="Product page" items={[
              { shot: 'product', name: 'Key facts under the price' },
              { shot: 'fold-closed', name: 'Shades, one row' },
              { shot: 'fold-open', name: 'All twenty, one tap away' },
            ]} />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="07 / Saving" title="Saving stays off the buying path.">
          <CaseProse><p>Merchants need the exact item kept, so saving works per item. But it is not why they are on a product, so nothing sits beside Add to Bag.</p></CaseProse>
          <CaseFigure caption="Saving moved from the buy button to the product header. Earlier sheet recreated.">
            <Compare wide label="Saving" items={[
              { shot: 'save-before', name: 'Before: heart beside buy', tag: 'Before', why: 'Competed with the main action.' },
              { shot: 'product-shade', name: 'Heart in the header', chosen: true, why: 'Away from the buying path.' },
              { shot: 'save-sheet', name: 'Save sheet', chosen: true, why: 'The exact item, no quantity or pack.' },
            ]} />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="08 / Design language" title="A quiet language, so the products carry the colour.">
          <CaseProse><p>Many categories and many brands of packaging clashed with a strong brand colour. I took Sephora as the reference and removed it: black, white and grey, with colour kept for products and state.</p></CaseProse>
          <CaseFigure caption="Two other directions, then four layouts of the chosen one, Editorial, which leaves the colour to the products.">
            <Compare label="Home exploration" items={[
              { shot: 'dir-studio', name: 'Bold studio', why: 'Red blocks compete with every brand’s packaging.' },
              { shot: 'dir-supply', name: 'Pro supply', why: 'Products shrink to thumbnails and navy adds one more colour.' },
              { shot: 'layout-cover', name: 'Editorial · Cover' },
              { shot: 'layout-index', name: 'Editorial · Index' },
              { shot: 'layout-lookbook', name: 'Editorial · Lookbook', chosen: true, why: 'Stories, brands and priced products share one layout.' },
              { shot: 'layout-column', name: 'Editorial · Column' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="The system: tokens, components and both themes.">
            <Compare label="Design system" items={[
              { shot: 'lang-foundations', name: 'Foundations' },
              { shot: 'lang-light', name: 'Components' },
              { shot: 'lang-dark', name: 'Dark' },
            ]} />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="09 / Try it" title="Try the redesign.">
          <CaseProse><p>Five short tours play in turn. <strong>Move your pointer into the frame to take over.</strong> All data is for demonstration.</p></CaseProse>
          <MiniProgramDemo />
        </CaseChapter>

        <CaseClose label="10 / Where it stands" title="Designed, not yet built.">
          <CaseProse><p>Awaiting development, so there are no results yet. Still open: how Buy again should group past purchases.</p></CaseProse>
          <CaseProse><p>I interviewed merchants and set the direction. Claude analysed the order data and drafted the requirements, screens, component code and this prototype; Codex made the product imagery; the brands are invented. The decisions are mine.</p></CaseProse>
        </CaseClose>
      </CaseKitSections>
    </CaseKitPage>
    </div>
  );
}
