import type { Metadata } from 'next';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/case-kit/CaseKitControls';
import wide from '../def-erp-kit/DefDecisions.module.css';
import { Compare } from './Compare';
import layout from './Compare.module.css';
import { CategoryFlow } from './CategoryFlow';
import { SiteMap, TabMap } from './Diagrams';
import { ShadeHighlight } from './ShadeHighlight';
import { ResearchFlow } from './ResearchFlow';
import { SaveCases } from './SaveCases';
import { RestockFlow } from './RestockCallouts';
import { SavedTradeoff } from './SavedTradeoff';
import { FeedCards } from './FeedCards';
import { HomeCallouts } from './HomeCallouts';
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
  '02 / Research',
  '03 / Structure',
  '04 / For you',
  '05 / Saved',
  '06 / Choosing',
  '07 / Wireframes',
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
            { shot: 'tab-saved-v2', name: 'Saved' },
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
              { title: 'Everyone sees everything', body: 'Eight categories with equal weight, though most of a merchant’s spend sits in one. → 04' },
              { title: 'Finding means browsing', body: 'A whole tab for the category tree, started from the top on every visit. → 04' },
              { title: 'No shortlist', body: 'No place for the exact products a business keeps buying. → 05' },
              { title: 'One page shape for every product', body: 'A capacity button and a quantity bar: choosing the right item to order takes work. → 06' },
            ]} />
          </div>
        </CaseChapter>

        <CaseChapter label="02 / Research" title="So what do merchants come for?">
          <CaseFigure caption={<><strong>7</strong> merchant interviews, checked against <strong>7,354</strong> orders covering <strong>2,886</strong> items, <strong>March to August 2026</strong>.</>}>
            <ResearchFlow />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="03 / Structure" title="Rebuild the structure around coming back.">
          <CaseProse><p>The old structure started from the catalogue. The new one starts from what a merchant already buys, and rests on <strong>four features</strong>.</p></CaseProse>
          <CaseFigure caption="Four features that serve coming back.">
            <Compare label="Main features" items={[
              { shot: 'tab-saved-v2', name: 'Saved tab', why: 'New shades, restocks, offers and buying again in one place. → 05' },
              { shot: 'home', name: 'For you home', why: 'Opens on the merchant’s own categories. → 04' },
              { shot: 'search', name: 'Search with categories', why: 'Takes over the Categories tab, so everything else is one search away.' },
              { shot: 'shade-sheet', name: 'One option sheet', why: 'The exact shade, size or pack is chosen without leaving the page. → 06' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="From the previous tabs to the new ones.">
            <TabMap />
          </CaseFigure>
          <CaseFigure caption="Information architecture: four tabs, one job each.">
            <SiteMap />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="04 / For you" title="Home follows each merchant’s categories.">
          <CaseProse><p>Products and merchants use <strong>one set of categories</strong>. Where the two overlap is what a merchant sees first, so the home tabs are their own instead of a fixed list.</p></CaseProse>
          <CaseFigure caption="The new home: from a fixed category grid to tabs that belong to the merchant.">
            <HomeCallouts />
          </CaseFigure>
          <CaseFigure caption="A product reaches For you when it shares a category with the merchant. Switch merchants to compare.">
            <CategoryFlow />
          </CaseFigure>
          <CaseProse><p>Why so many card styles? <strong>Marketing needs differ</strong>: a new range, a set, a price break, a brand story and a tutorial each call for their own shape, so one feed can carry different campaigns. And merchants come back often, so <strong>changing styles keep the page fresh</strong> instead of a wall of identical product tiles. Aligned modules come first, so the variety stays out of the way of ordering.</p></CaseProse>
          <CaseFigure caption="The cards For you is built from, on demonstration data. The first version recommends by rules.">
            <FeedCards />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="05 / Saved" title="Saved is for coming back, and stays off the buying path.">
          <CaseProse><p>Saved takes the Categories tab’s place and answers the four reasons to return: what is new in my ranges, what is back, what is on offer, and buying again.</p></CaseProse>
          <CaseFigure caption="Two trade-offs, on demonstration data. Share from order data, March to August 2026.">
            <SavedTradeoff />
          </CaseFigure>
          <CaseProse><p>Merchants asked whether what they needed was back. So Restock starts earlier: <strong>a sold-out item</strong> and <strong>a product the store does not carry</strong> can both be registered.</p></CaseProse>
          <CaseFigure caption="From sold out to Restock. Notices and photos are not built yet.">
            <RestockFlow />
          </CaseFigure>
          <CaseProse><p>Saving is not why a merchant is on a product, so it <strong>stays off the buying path</strong>: the heart sits on product cards and the product header, never beside Add to Bag. What it keeps is <strong>one exact item (SKU)</strong>, so what the heart does depends on the product.</p></CaseProse>
          <CaseFigure caption="Saving, situation by situation, on demonstration data. A product shows a filled heart once any of its options is saved.">
            <SaveCases />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="06 / Choosing" title="Finding a few shades among 120, and taking them together.">
          <CaseProse><p>A gel polish can come in 120 shades, a hair colour in dozens. In six months of orders, <strong>59%</strong> of shade purchases took two or more shades of the same product, typically <strong>four</strong>. So the picker has to find shades fast and collect several.</p></CaseProse>
          <CaseFigure caption="Working prototype on demonstration data.">
            <ShadeHighlight />
          </CaseFigure>
          <CaseFigure caption="The same picker in four situations.">
            <Compare label="Shade picker states" items={[
              { shot: 'pick-numbers', name: 'Numbers typed' },
              { shot: 'pick-bought', name: 'Bought before' },
              { shot: 'pick-hair', name: 'Hair colour by level' },
              { shot: 'pick-tray', name: 'Quantities' },
            ]} />
          </CaseFigure>
          <CaseFigure caption="How I got there. I first chose one shade at a time; the order data brought the bulk grid back.">
            <Compare label="Shade selectors" items={[
              { shot: 'swatch-preview', name: 'Large preview', why: 'The other colours become dots that are hard to compare.' },
              { shot: 'swatch-compare', name: 'Side by side', why: 'An extra screen for a routine order.' },
              { shot: 'swatch-cards', name: 'Photo cards', tag: 'First choice', why: 'Real colour, but one shade at a time.' },
              { shot: 'swatch-bulk', name: 'Bulk grid', chosen: true, why: 'Several shades with quantities: the base of the final picker.' },
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
        </CaseChapter>

        <CaseChapter label="07 / Wireframes" title="It started as wireframes of the whole journey.">
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
          <CaseProse><p>Awaiting development, so there are no results yet. Still open: where the expected arrival date comes from.</p></CaseProse>
          <CaseProse><p>I interviewed merchants and set the direction. Claude analysed the order data and drafted the requirements, screens, component code and this prototype; Codex made the product imagery; the brands are invented. The decisions are mine.</p></CaseProse>
        </CaseClose>
      </CaseKitSections>
    </CaseKitPage>
    </div>
  );
}
