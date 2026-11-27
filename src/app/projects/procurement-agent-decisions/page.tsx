/**
 * Second version of the Procurement Agent case, kept beside /projects/procurement-agent-kit.
 * Told as the design reasoning: introduction, problem, version 1, the turning point, principles, then version 2.
 */
import type { Metadata } from 'next';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/case-kit/CaseKitControls';
import { CaseChapter, CaseEvidenceThumbs, CaseFigure, CaseHero, CaseKitPage, CaseKitSections, CaseProse, CasePullquote, CaseStats } from '../../components/case-kit/CaseKit';
import { LegacyProcurementFlow } from '../procurement-agent-kit/ProcurementFlowDiagrams';
import ProcurementExperienceMap from '../procurement-agent-kit/ProcurementExperienceMap';
import AgentLiveDemo, { AgentEvaluationLiveDemo } from '../procurement-agent-kit/AgentLiveDemo';
import { PROCUREMENT_AGENT_ERP_URL } from '@/lib/demoUrls';
import Appendix from './Appendix';
import JourneyDiagram from './JourneyDiagram';
import FirstVersionFlow from './FirstVersionFlow';
import FirstVersionDemo from './FirstVersionDemo';
import AgentPipeline from './AgentPipeline';
import { ForTheBuyer, StillOpen } from './Story';
import Choices from './Choices';
import BeforeAfterSlider from '../def-erp-kit/BeforeAfterSlider';
import PrincipleExplorer from './PrincipleExplorer';

export const metadata: Metadata = {
  title: 'AI Procurement Agent: Design Reasoning | Mei Chai',
  description: 'How I reasoned from a buyer’s problem to an AI Agent: the principles, the questions, and the trade-offs. In production at DEF Beauty Supply.',
  robots: { index: false, follow: false },
};

const navLabels = ['01 / Introduction', '02 / The problem', '03 / Version 1', '04 / Turning point', '05 / Principles', '06 / V2 · Workflow', '07 / V2 · Design', '08 / V2 · The result', '09 / Results', '10 / Appendix'];

export default function ProcurementAgentDecisionsPage() {
  return (
    <CaseKitPage>
      <CaseStudyControls showProgress navLabels={navLabels} railKicker="Case study" railTitle="Procurement Agent" />
      <CaseKitSections>
        <div className="case-mobile-back"><CaseStudyBackButton /></div>
        <CaseHero
          eyebrow="Portfolio · AI product design"
          title="From checking documents to preparing the decision"
          intro="Designing an AI procurement Agent for a beauty wholesaler. The first version added AI to one check. The second brought an Agent into the whole purchase."
          meta={[
            { label: 'Client', value: 'DEF Beauty Supply · Italy' },
            { label: 'Year', value: '2026' },
            { label: 'Role', value: 'Research, AI interaction design, build' },
            { label: 'Duration', value: '4 months' },
            { label: 'Status', value: 'Live · used by procurement' },
          ]}
          action={{ label: 'Explore the working demo', href: PROCUREMENT_AGENT_ERP_URL.replace('procurement-agent-kit', 'procurement-agent-decisions') }}
          tags={['AI interaction design', 'Human–AI collaboration', 'Model evaluation', 'B2B procurement']}
          glance={{
            items: [
              { label: 'Challenge', body: 'Purchasing was split across spreadsheets, supplier messages, and paper. Even once it was in the ERP, deciding what to buy and how much stayed in the buyer’s head.' },
              { label: 'Insight', body: 'Checking documents was never the slow part. Buyers needed the context of a whole purchase gathered for them, with the decision still theirs.' },
              { label: 'Solution', body: 'An Agent that drafts one editable plan, stops before ordering, and scores each reviewed plan. Planning went from 30 minutes–2 hours to 5–10 minutes.' },
            ],
            deliverables: ['Research', 'Experience map', 'Information architecture', 'Wireframes', 'Agent components', 'Working product'],
          }}
        />

        <CaseChapter label="01 / Introduction" title="An Agent that prepares purchases, inside the ERP buyers already use.">
          <CaseProse><p>DEF Beauty Supply is an Italian beauty wholesaler. I researched, designed, and built the move from spreadsheets and messages to an Agent that drafts a plan for the buyer to check, change, and order.</p></CaseProse>
          <CaseFigure caption="One purchase, three ways: spread across tools, moved onto a platform, then worked with an Agent.">
            <JourneyDiagram />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="02 / The problem" title="One purchase was scattered, so nobody could see it whole.">
          <CaseProse><p>Requests, orders, supplier documents, partial receipts, and stock results lived in separate spreadsheets, messages, and paper.</p></CaseProse>
          <CaseEvidenceThumbs label="Original documents from the old workflow" enlarge={false} items={[
            { src: '/img/procurement-agent/evidence/legacy-excel-order.webp', title: '1 · Excel order', alt: 'An Excel purchase order listing article numbers and piece counts in separate columns by product line.', width: 1368, height: 1020 },
            { src: '/img/procurement-agent/evidence/supplier-confirmation-pdf.webp', title: '2 · Supplier confirmation', alt: 'A three-page supplier confirmation PDF listing item codes, quantities, and prices, with identifying details masked.', width: 1120, height: 960 },
            { src: '/img/procurement-agent/evidence/ddt-lines-checked.webp', title: '3 · Checked by hand', alt: 'A supplier document with ticked items, highlighted quantities, and handwritten corrections.', width: 1400, height: 996 },
          ]} caption="Identifying details are masked." />
          <CaseFigure caption="Before · The order and the supplier’s answer lived outside the system.">
            <LegacyProcurementFlow />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="03 / Version 1" title="First I made purchasing traceable, and let AI do the checking.">
          <CaseProse><p>Confirmation, delivery note, and actual count now stay linked to one purchase. To avoid adding AI for its own sake, I gave it only the repetitive check: confirmation against the draft, then delivery note against confirmation.</p></CaseProse>
          <ForTheBuyer need="A typo, new packaging, or a shortage is easy to miss between two documents." help="The lines that differ are marked, so you do not compare every row by eye." act="Look at the marked lines first, then confirm what arrived." />
          <FirstVersionDemo />
        </CaseChapter>

        <CaseChapter label="04 / Turning point" title="Checking got easier. Deciding did not.">
          <CasePullquote>Now I don&apos;t need to switch between Excel and the system anymore. But <strong>the part that takes the most time is still the same</strong>. I still have to <strong>decide what to buy and how much</strong>.</CasePullquote>
          <CaseFigure caption="Version 1 · One purchase record. AI takes part at two checks; the context behind each decision still drops out.">
            <FirstVersionFlow />
          </CaseFigure>
          <CaseProse>
            <p><strong>So the question changed:</strong> not “where can AI check?”, but “how can an Agent keep the context for the whole purchase, while the buyer keeps the decision?”</p>
          </CaseProse>
        </CaseChapter>

        <CaseChapter label="05 / Principles" title="Hand the work to AI. Keep the decision with people.">
          <CaseProse><p>I mapped version 2 across four stages, aiming for an Agent that is <strong>explainable, controllable, predictable, and recoverable</strong>. Pick a stage to read its principles.</p></CaseProse>
          <PrincipleExplorer />
        </CaseChapter>

        <CaseChapter label="06 / V2 · Workflow" title="The whole Agent, from your request to what it learns.">
          <CaseProse><p>The Agent reads the data each stage needs and hands you the result. <strong>You step in where a decision is yours.</strong></p></CaseProse>
          <CaseFigure caption="Version 2 · One purchase, left to right.">
            <AgentPipeline />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="07 / V2 · Design" title="First rule: the purchase still works without the AI.">
          <CaseProse><p>If the Agent is off, or wrong, you finish the whole purchase yourself. So version 2 <strong>keeps the same layout and the same actions</strong>: the Agent joins the order page you already know, and there is little new to learn.</p></CaseProse>
          <BeforeAfterSlider
            beforeSrc="/img/procurement-agent/compare/draft-manual-3.webp"
            beforeAlt="Version 1 purchase draft: product table with quantities, stock, sales and prices, an information panel on the right, and buttons to add a product, export the request and upload the confirmation."
            beforeLabel="V1 · by hand"
            afterSrc="/img/procurement-agent/compare/draft-agent-4.webp"
            afterAlt="Version 2 purchase draft: the same product table and the same buttons, with the Procurement agent panel on the right."
            afterLabel="V2 · with the Agent"
            aspectRatio={1.6}
          />
          <CaseProse><p><strong>Same in both:</strong> the order table, the sales period, adding a product, editing quantities and prices, exporting the request, and uploading the confirmation. <strong>Added:</strong> reasons on each line, an expected accuracy, and an Agent panel in place of the information cards.</p></CaseProse>
          <CaseProse><p>Within that rule, three questions needed a direction.</p></CaseProse>
          <CaseProse><p>For each question I weighed different directions by what they gain and what they cost. The sketches are redrawn here to compare them.</p></CaseProse>
          <Choices />
        </CaseChapter>

        <CaseChapter label="08 / V2 · The result" title="One purchase, with the context carried through.">
          <AgentLiveDemo />
          <CaseProse><p>The last iteration closes the loop: a review scores the plan and shapes the next one.</p></CaseProse>
          <AgentEvaluationLiveDemo steps={[0, 2, 1]} />
          <StillOpen>Whether the Agent stops at the right point, and whether the score changes what buyers double-check.</StillOpen>
        </CaseChapter>

        <CaseChapter label="09 / Results" title="A purchase plan in 5 to 10 minutes, down from 30 minutes to 2 hours.">
          <CaseStats items={[
            { value: '5–10 min', label: 'To prepare a purchase plan, down from 30 minutes to 2 hours across suppliers' },
            { value: '3', label: 'Staff members using the Agent daily' },
          ]} />
          <CaseProse>
            <p><strong>Next:</strong> where a supplier’s score stays high with high confidence, small orders are the first candidates to automate. Until then, a person orders.</p>
            <p><strong>What I take with me:</strong> adding AI to a step helped less than deciding what an Agent should carry across the whole task, and where it has to stop.</p>
          </CaseProse>
        </CaseChapter>

        <CaseChapter label="10 / Appendix" title="Supporting work, for a closer look.">
          <Appendix title="all twelve steps and six cross-cutting themes">
            <ProcurementExperienceMap />
          </Appendix>
        </CaseChapter>
      </CaseKitSections>
    </CaseKitPage>
  );
}
