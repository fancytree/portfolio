/**
 * Second version of the MemQ case, kept beside /projects/memq-kit.
 * The problem, the solution as a user flow, then one thread: how card creation was
 * designed across four stages, each closer to where people already learn. Everything
 * else in the product sits in the appendix, closed by default.
 */
import type { Metadata } from 'next';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/case-kit/CaseKitControls';
import { CaseButton } from '../../components/case-kit/CaseButton';
import {
  CaseChapter,
  CaseEvidenceCards,
  CaseFigure,
  CaseHero,
  CaseInteractivePreview,
  CaseKitPage,
  CaseKitSections,
  CaseProse,
  CasePullquote,
  CaseStats,
} from '../../components/case-kit/CaseKit';
import { ReversalList } from '../procurement-agent-kit/DecisionCards';
import Appendix from '../procurement-agent-decisions/Appendix';
import { StillOpen } from '../procurement-agent-decisions/Story';
import { AskAgainLoop, LedgeLab, OutlineRule, PaletteStrip, SpacedScheduler, VisualEvolution } from '../memq-kit/MemQDiagrams';
import { ProductShowcase } from '../memq-kit/MemQPractice';
import { MarkingEvidence, QuestionLadder } from '../memq-kit/MemQQuiz';
import { ProgressCharts } from '../memq-kit/MemQCharts';
import { ChatPhone } from '../memq-kit/MemQChat';
import { BalanceTable, CreditsCompare } from '../memq-kit/MemQAi';
import { Captioned, DecisionBeside, Screens } from '../memq-kit/MemQDecision';
import { Focus } from '../memq-kit/MemQFocus';
import { Label, MemQTone, NeedBeside, Outcomes, Timeline } from './Beats';
import { UserFlow } from './UserFlow';
import { PhoneShot } from '../memq-kit/MemQPractice';
import { FixesShown } from './Fixes';
import { PromptFlow } from './PromptFlow';
import { InklingGuide, TourMark } from './Guide';
import { AddTermsRedraw, AssistantCardRedraw, AssistantEntryRedraw, AssistantModesRedraw, ExploreRedraw, ImportCheckRedraw, ImportStepsRedraw, McpChatRedraw, McpReviewRedraw, McpSavedRedraw, SharedLessonRedraw } from './Redraws';
import { creditsDecision, directionDecision } from './decisions';

export const metadata: Metadata = {
  title: 'MemQ: designing how cards get made | Mei Chai',
  description:
    'How I designed card creation in MemQ, an iOS study app I researched, designed and built alone, across four stages: a lesson square and AI parsing, a built-in AI chat, your own AI through a prompt, and your own AI working MemQ through MCP.',
  robots: { index: false, follow: false },
};

const navLabels = [
  '01 / Overview',
  '02 / Starting point',
  '03 / The solution',
  '04 / Creating cards',
  '05 / Stage 1 · Lesson square',
  '06 / Stage 2 · AI chat',
  '07 / Stage 3 · Your own AI',
  '08 / Stage 4 · MCP',
  '09 / Results',
  '10 / Reflection',
  '11 / Appendix',
];

export default function MemQDecisionsPage() {
  return (
    <MemQTone>
    <InklingGuide />
    <CaseKitPage>
      <CaseStudyControls showProgress navLabels={navLabels} railKicker="Case study" railTitle="MemQ" />
      <CaseKitSections>
        <div className="case-mobile-back"><CaseStudyBackButton /></div>
        <CaseHero
          eyebrow="Portfolio · Product design · Consumer AI · iOS · 2026"
          title="MemQ: designing for the moment after the answer"
          intro="People ask AI the same question twice, because nothing asks them back. I designed and built MemQ alone. This case follows its most important flow, making cards, through four stages."
          meta={[
            { label: 'Client', value: 'Self-initiated' },
            { label: 'Role', value: 'Solo product designer & developer' },
            { label: 'Duration', value: 'Apr – Nov 2026' },
            { label: 'Status', value: 'Live on the App Store' },
            { label: 'Research', value: '8 interviews · 24 surveys · 11 usability sessions · 15 beta users' },
            { label: 'Tools', value: 'Figma, Expo, Supabase, Claude Code' },
          ]}
          action={{ label: 'Visit the MemQ website', href: 'https://memq.riverstudio.cc/' }}
          tags={['Product design', 'AI UX', 'User research', 'Monetisation']}
          glance={{
            items: [
              { label: 'Problem', body: 'Answers stay in the chat. Flashcard apps make you build every card, and that is where people give up.' },
              { label: 'Approach', body: 'Four stages of card creation, each built from what the last one showed. The AI tested on the real model before every prompt change.' },
              { label: 'Outcome', body: 'Live on the App Store. 184 of 184 chat runs passed; a free account costs under 2¢ a month in AI.' },
            ],
            deliverables: ['Research', 'iOS app', 'AI chat', 'AI credits', 'Design system', 'Rigged mascot'],
          }}
        />

        <CaseChapter label="01 / Overview" title="One designer, the whole product.">
          <CaseProse>
            <p>I owned every layer, from research to the code that ships it.</p>
          </CaseProse>
          <CaseFigure caption="MemQ 2.0, real screens from the App Store set.">
            <ProductShowcase />
          </CaseFigure>
          <CaseProse>
            <h3>How I worked</h3>
            <ul>
              <li><strong>Research:</strong> <strong>8</strong> interviews, <strong>24</strong> surveys, <strong>11</strong> usability sessions, <strong>15</strong> TestFlight users. A written spec for each part.</li>
              <li><strong>Visual:</strong> briefs, not blueprints. AI tools rendered <strong>5</strong> directions on the same screens; I chose one and set its rules.</li>
              <li><strong>Code:</strong> Expo, Supabase and Claude Code. <strong>133</strong> commits in six days for 2.0; the chat tested on the real model, <strong>23</strong> cases × <strong>8</strong> runs.</li>
            </ul>
          </CaseProse>
        </CaseChapter>

        <CaseChapter label="02 / Starting point" title="Getting an answer is not the same as knowing it.">
          <CaseProse>
            <p>People learn by asking now. The answer comes, the chat closes, and later they ask again. <strong>Nothing brings it back.</strong></p>
          </CaseProse>
          <TourMark id="problem">
            <CaseFigure caption="Left, the loop from interviews. Right, the missing step: keep the answer, and ask it back.">
              <AskAgainLoop />
            </CaseFigure>
          </TourMark>
          <CaseEvidenceCards label="Why existing tools fall short" layout="pairs" items={[
            { icon: null, title: 'AI chat answers, but never asks back', body: 'The conversation ends, and the answer is gone.' },
            { icon: null, title: 'Flashcard apps ask back, but you build every card', body: 'Making cards by hand is where people stop.' },
          ]} />
          <CasePullquote>I use Anki, but making the cards takes longer than actually learning. So I just don’t make them.</CasePullquote>
          <p className="m-0 text-[13px] leading-[1.5] text-[#686868]">Language learner, foundational interview.</p>
        </CaseChapter>

        <CaseChapter label="03 / The solution" title="One loop: get it in, bring it back, come back tomorrow.">
          <CaseProse>
            <p>MemQ turns what you looked up into cards, and asks each one back before you forget it.</p>
          </CaseProse>
          <TourMark id="flow">
            <CaseFigure caption="The user flow. First time across the top; then each day runs left to right, back to Today.">
              <UserFlow />
            </CaseFigure>
          </TourMark>
        </CaseChapter>

        {/* ───────────── The thread: four stages of making cards ───────────── */}
        <CaseChapter label="04 / Creating cards" title="Four ways to make cards, each closer to where people already learn.">
          <CaseProse>
            <p>Making cards is the most important flow in MemQ:</p>
            <ul>
              <li><strong>Everything depends on it.</strong> No cards, nothing to review.</li>
              <li><strong>It is where people gave up.</strong> Making cards took longer than studying.</li>
              <li><strong>It is where AI works hardest.</strong> A set of cards costs 3 credits, a chat message 1.</li>
            </ul>
          </CaseProse>
          <TourMark id="stages">
            <Timeline stops={[
              { href: '#case-05-stage-1-lesson-square', version: 'Stage 1', date: 'Jan – Apr 2026', title: 'Lesson square and AI parsing', body: 'Shared lessons, or AI cards from text, a topic or a PDF.' },
              { href: '#case-06-stage-2-ai-chat', version: 'Stage 2', date: 'Apr → Nov 2026', title: 'A built-in AI chat', body: 'Ask; it explains, then makes cards.' },
              { href: '#case-07-stage-3-your-own-ai', version: 'Stage 3', date: 'Nov 2026', title: 'Your own AI', body: 'Your AI writes cards in MemQ’s format.' },
              { href: '#case-08-stage-4-mcp', version: 'Stage 4', date: 'In progress', title: 'MCP', body: 'Your AI makes cards in MemQ directly.' },
            ]} />
          </TourMark>
        </CaseChapter>

        {/* ───────────── Stage 1 ───────────── */}
        <CaseChapter label="05 / Stage 1 · Lesson square" title="A square of lessons, and a box that turns material into cards.">
          <Label>The initial idea</Label>
          <CaseEvidenceCards label="What I took from existing apps" layout="pairs" items={[
            { icon: null, title: 'Quizlet: shared decks', body: 'Ready to study in a tap, but little AI. → The lesson square.' },
            { icon: null, title: 'Anki: strong review', body: 'Every card typed by hand; PDFs are hard to bring in. → AI parsing.' },
          ]} />
          <CaseProse>
            <p><strong>Shared lessons to start fast, and AI that turns your own text, topic or PDF into cards.</strong></p>
          </CaseProse>
          <Label>v1 · Add Terms</Label>
          <TourMark id="addterms">
            <NeedBeside
              title="Make cards from what you already have"
              need={{ title: 'My notes, a topic or a PDF, as cards', sub: 'Typing every card is where I stop' }}
              branches={[
                { title: 'Paste text', sub: 'Auto-Detect' },
                { title: 'Type a topic', sub: 'Generate Terms' },
                { title: 'Upload a PDF', sub: 'Upload & Process' },
              ]}
              merge={{ title: 'One list of terms', sub: 'Check and edit, then save' }}
              met={{ title: 'No card starts blank', sub: 'AI drafts; only what I save is kept' }}
              screen={<Screens>
                <Captioned line="Input & Edit: paste text, Auto-Detect pulls out the terms."><AddTermsRedraw tab="paste" /></Captioned>
                <Captioned line="AI Topic: type a topic, Generate Terms."><AddTermsRedraw tab="topic" /></Captioned>
                <Captioned line="Upload PDF: pick a file, Upload & Process."><AddTermsRedraw tab="pdf" /></Captioned>
              </Screens>} />
          </TourMark>
          <TourMark id="createbox">
            <Outcomes items={[
              { tone: 'good', icon: 'check', title: 'Good drafts', sub: 'AI drafted the cards well.' },
              { tone: 'bad', icon: 'coin', title: 'Costly', sub: 'Every set was an expensive AI call.' },
              { tone: 'bad', icon: 'broken', title: 'Broken flow', sub: 'Learners still gathered material and brought it here.' },
              { tone: 'bad', icon: 'distort', title: 'Distorted', sub: 'Passed through my AI, the material lost its shape.' },
            ]} />
          </TourMark>
          <Label>v1 · The lesson square</Label>
          <NeedBeside
            title="Start from a lesson someone already made"
            need={{ title: 'Something to study, right away', sub: 'Making cards first is the chore' }}
            branches={[
              { title: 'Featured', sub: 'This week’s pick' },
              { title: 'By topic', sub: 'Pick a subject' },
              { title: 'Trending', sub: 'What others learn' },
            ]}
            merge={{ title: 'Add to My Lessons', sub: 'One tap, and it is yours' }}
            met={{ title: 'A full lesson in one tap', sub: 'Nothing to type before studying' }}
            screen={<Screens>
              <Captioned line="The lesson square: featured and trending lessons."><ExploreRedraw /></Captioned>
              <Captioned line="A shared lesson, added to yours in one tap."><SharedLessonRedraw /></Captioned>
            </Screens>} />
          <TourMark id="square">
            <Outcomes items={[
              { tone: 'bad', icon: 'unopened', title: 'Never opened', sub: 'Added from the square, then left.' },
              { tone: 'bad', icon: 'notMine', title: 'Not their own', sub: 'It broke the rule: only what learners really need.' },
            ]} />
          </TourMark>
        </CaseChapter>

        {/* ───────────── Stage 2 ───────────── */}
        <CaseChapter label="06 / Stage 2 · AI chat" title="Ask first. Cards when you want them.">
          <Label>Why an AI chat</Label>
          <CaseProse>
            <p><strong>People learn by asking.</strong> A chat in MemQ lets them ask, understand and keep the answer, with no material to gather first.</p>
          </CaseProse>

          <Label>v1 · The Assistant</Label>
          <TourMark id="aiv1">
            <NeedBeside
              title="Ask, and keep the answer"
              need={{ title: 'Ask a question, keep the answer', sub: 'Without gathering material first' }}
              branches={[
                { title: 'Q&A', sub: 'Ask anything' },
                { title: 'Vocabulary', sub: 'Look up a word' },
                { title: 'Quiz me', sub: 'Test yourself' },
              ]}
              merge={{ title: 'One card from the answer', sub: 'Pick a lesson, Confirm Save' }}
              met={{ title: 'Kept in one tap', sub: 'Straight from the conversation' }}
              screen={<Screens>
                <Captioned line="A floating button on Today opens it."><AssistantEntryRedraw /></Captioned>
                <Captioned line="Pick a mode before asking."><AssistantModesRedraw /></Captioned>
                <Captioned line="One answer, one card, saved in a tap."><AssistantCardRedraw /></Captioned>
              </Screens>} />
          </TourMark>
          <TourMark id="aiv1issues">
            <Outcomes items={[
              { tone: 'bad', icon: 'broken', title: 'Mode first', sub: 'Learners sorted their need before they could ask.' },
              { tone: 'bad', icon: 'distort', title: 'One card per answer', sub: 'Pulled out of the reply text.' },
              { tone: 'bad', icon: 'notMine', title: 'Never checked', sub: 'A wrong definition saved in one tap.' },
            ]} />
          </TourMark>

          <Label>2.0 · Learn something</Label>
          <TourMark id="aiv2">
            <NeedBeside
              title="Understand it first, then keep it"
              need={{ title: 'Understand it, then keep it', sub: 'Not a deck for every question' }}
              branches={[
                { title: 'Learn something', sub: 'Explains, then makes cards' },
                { title: 'Ask a question', sub: 'About your cards, ends in a round' },
              ]}
              merge={{ title: 'Cards as drafts to tick', sub: 'The app draws them; unticked ones are left out' }}
              met={{ title: 'Explained first, kept by choice', sub: 'Cards only when asked' }}
              screen={<Screens>
                <Captioned line="Two doors on Today, named for what they do."><ChatPhone start="today" /></Captioned>
                <Captioned line="It explains first, in about 80 words."><ChatPhone start="answered" /></Captioned>
                <Captioned line="Cards only when asked, as drafts to tick."><ChatPhone start="drafts" /></Captioned>
              </Screens>} />
          </TourMark>
          <TourMark id="aiv2issues">
            <Outcomes items={[
              { tone: 'good', icon: 'check', title: '1 model call', sub: 'Per set of cards, down from 3–4.' },
              { tone: 'good', icon: 'check', title: '184 / 184', sub: 'Test runs passed on the real model.' },
              { tone: 'bad', icon: 'coin', title: 'Paid per message', sub: 'Every message is a model call, with no revenue yet.' },
              { tone: 'bad', icon: 'notMine', title: 'Missing context', sub: 'People’s own AI already knows what they discussed.' },
            ]} />
          </TourMark>
          <Label>What I fixed on the way</Label>
          <TourMark id="fixes">
            <FixesShown />
          </TourMark>
        </CaseChapter>

        {/* ───────────── Stage 3 ───────────── */}
        <CaseChapter label="07 / Stage 3 · Your own AI" title="Your AI writes the cards. MemQ checks them.">
          <Label>Why your own AI</Label>
          <CaseProse>
            <p>People already learn in their own AI. Copying text into MemQ worked, but my AI had to rework it: costly, and it bent the meaning. <strong>What was missing was a guide, so their AI hands over cards that already fit MemQ.</strong></p>
          </CaseProse>

          <Label>Use your own AI</Label>
          <TourMark id="ownai">
            <NeedBeside
              title="Bring what I learned in my AI"
              need={{ title: 'Keep what my AI taught me', sub: 'Without retyping or reshaping it' }}
              branches={[
                { title: 'In a chat', sub: 'Cards from what we discussed' },
                { title: 'With notes', sub: 'Cards from that material only' },
                { title: 'On its own', sub: 'It asks what to learn first' },
              ]}
              merge={{ title: 'Cards in MemQ’s format', sub: 'Paste back, check and save' }}
              met={{ title: 'Their words, lined up', sub: 'No rework, no cost to MemQ' }}
              screen={<Screens>
                <Captioned line="The way in, beside Generate."><PhoneShot src="/img/memq-v2/new-cards.webp" alt="New Cards with Use your own AI under the input" /></Captioned>
                <Captioned line="Copy the prompt, ask your AI, paste its reply."><ImportStepsRedraw /></Captioned>
                <Captioned line="Check what was read, then save."><ImportCheckRedraw /></Captioned>
              </Screens>} />
          </TourMark>
          <Label>How the prompt works</Label>
          <TourMark id="prompt">
            <CaseFigure caption="From the copied prompt to saved cards. “Tested” marks rules settled by running the prompt on a real model.">
              <PromptFlow />
            </CaseFigure>
          </TourMark>
          <TourMark id="ownaiissues">
            <Outcomes items={[
              { tone: 'good', icon: 'check', title: '384 valid cards', sub: 'From 11 kinds of conversation, on a real model.' },
              { tone: 'good', icon: 'coin', title: 'Free, no limit', sub: 'MemQ calls no model for it.' },
              { tone: 'bad', icon: 'broken', title: 'Two hops', sub: 'Still a copy and a paste each way.' },
            ]} />
          </TourMark>
        </CaseChapter>

        {/* ───────────── Stage 4 ───────────── */}
        <CaseChapter label="08 / Stage 4 · MCP" title="Your AI works MemQ directly. You still choose what is saved.">
          <Label>Why MCP</Label>
          <CaseProse>
            <p>Stage 3 still takes a copy and a paste each way. <strong>With MCP, people ask in their own AI and the cards appear in MemQ:</strong> the same card format, a tool call instead of the clipboard.</p>
          </CaseProse>

          <Label>MemQ inside their AI</Label>
          <TourMark id="mcp">
            <NeedBeside
              title="Keep it without leaving my AI"
              need={{ title: 'Keep it where I learned it', sub: 'No copy, no paste, no switching apps' }}
              branches={[
                { title: 'Create a lesson', sub: 'From the conversation' },
                { title: 'Add cards', sub: 'To a lesson I have' },
                { title: 'Update questions', sub: 'After cards change' },
              ]}
              merge={{ title: 'A view to tick, then save', sub: 'Nothing written before you press save' }}
              met={{ title: 'Cards land in MemQ', sub: 'And come back for review' }}
              screen={<Screens>
                <Captioned line="Drafts appear in the chat, not as text."><McpChatRedraw /></Captioned>
                <Captioned line="Review all: the app’s own Check and save list."><McpReviewRedraw /></Captioned>
                <Captioned line="Saved, with a way into the lesson."><McpSavedRedraw /></Captioned>
              </Screens>} />
          </TourMark>
          <Outcomes head="The rules I set" items={[
            { tone: 'good', icon: 'check', title: 'Draft first', sub: 'Save only what is ticked.' },
            { tone: 'good', icon: 'check', title: 'An interface', sub: 'Not just chat bubbles.' },
            { tone: 'good', icon: 'check', title: 'Buttons write', sub: 'Never the model on its own.' },
            { tone: 'good', icon: 'check', title: 'Reuse the app', sub: 'Its own Check and save list.' },
          ]} />

          <Outcomes head="Where it stands" items={[
            { tone: 'good', icon: 'check', title: 'View built', sub: 'Drafts, review and save, tested locally.' },
            { tone: 'good', icon: 'check', title: 'Sign-in tested', sub: 'Locally: consent, revoke, two users kept apart.' },
            { tone: 'bad', icon: 'broken', title: 'Not live yet', sub: 'Sign-in must reach lessons and cards, nothing else.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="09 / Results" title="Shipped, and honest about what is measured.">
          <TourMark id="results">
            <CaseStats items={[
              { value: 'Live', label: 'On the App Store' },
              { value: '184 / 184', label: 'Chat runs passed on the real model' },
              { value: '< 2¢', label: 'AI cost of a free account, per month' },
            ]} />
          </TourMark>
          <CaseProse>
            <p>No usage data for 2.0 yet, so no retention claims. First to measure: do people come back on day 2 and day 7?</p>
          </CaseProse>
        </CaseChapter>

        <CaseChapter label="10 / Reflection" title="What I would tell the next designer on it.">
          <TourMark id="reflection">
            <CaseProse>
              <ul>
                <li><strong>Write the flow down before tuning the prompt.</strong></li>
                <li><strong>Calm is not the same as inviting.</strong> v1 looked best and asked nothing of you tomorrow.</li>
                <li><strong>Write briefs, not blueprints,</strong> for people and AI alike.</li>
                <li><strong>Go where the learning already happens:</strong> in AI chats.</li>
              </ul>
            </CaseProse>
            <div className="mt-6"><CaseButton href="https://memq.riverstudio.cc/" target="_blank" rel="noopener noreferrer">Visit the MemQ website</CaseButton></div>
          </TourMark>
        </CaseChapter>

        <CaseChapter label="11 / Appendix" title="The rest of the product, for a closer look.">
          <CaseProse>
            <p>The parts around the story.</p>
          </CaseProse>
          <Appendix title="AI credits: the rules, and the card that shows them">
            <CaseProse><p>The first gate was seven limits on three clocks, each sensible alone, that nobody could explain. Play the same month through both.</p></CaseProse>
            <DecisionBeside decision={creditsDecision} screen={<CreditsCompare />} />
            <CaseFigure caption="The ten rules of the allowance, and which goal each serves.">
              <BalanceTable />
            </CaseFigure>
            <CaseProse><p>The credits card took three tries:</p></CaseProse>
            <ReversalList items={[
              { source: 'AI chat spec §41.3', before: 'The bar measured credits used.', evidence: 'On the 1st, “50 of 50” sat over an empty bar. It read as none left.', after: 'The bar measures what is left: full at the start of the month, shorter as you go.' },
              { source: 'AI chat spec §41.3', before: 'Credits were a row under an “AI” heading in Settings.', evidence: 'It is not a setting. It is a number in your account.', after: 'A card of its own, first under your name, with no heading.' },
              { source: 'AI chat spec §41.3', before: 'Two separate upgrade cards beside it.', evidence: '“You have 50” and “you could have more” are one thing, read twice.', after: 'One quiet “See Pro” on the card itself, only for free accounts.' },
            ]} />
            <CaseStats items={[
              { value: '< 2¢', label: 'A free account using all 50 credits in a month, at listed model prices' },
              { value: '≈ $0.60', label: 'A Pro account using all 2,000' },
              { value: '0', label: 'Credits for practice questions and marking' },
            ]} />
            <StillOpen>The unit prices against a real bill, and whether people read the number right without being told.</StillOpen>
          </Appendix>
          <Appendix title="the review loop: when to ask, how to ask, how to mark">
            <CaseProse><p>Only a review that was due moves a card on: 1, 3, 7, 14, 30 days, then doubling. A miss steps it back; cramming does not speed it up.</p></CaseProse>
            <CaseFigure caption="The scheduler as it ships. The curve is illustrative; the stages are the real ones.">
              <SpacedScheduler />
            </CaseFigure>
            <CaseProse><p>A new card is seen, recognised, then produced; a familiar one is only produced.</p></CaseProse>
            <QuestionLadder />
            <CaseFigure caption="Four typed answers right after Submit, each marked by the app’s own code. Spelling is checked letter by letter; own words are read for sense, and the learner can overrule.">
              <MarkingEvidence />
            </CaseFigure>
            <CaseFigure caption="The five You-page charts on demonstration data, all read from one answer log. Each leads with one number and one sentence.">
              <ProgressCharts />
            </CaseFigure>
          </Appendix>
          <Appendix title="the visual direction and its one depth rule">
            <CaseFigure caption="Three versions, April to November 2026.">
              <VisualEvolution />
            </CaseFigure>
            <CaseProse><p>For 2.0 I briefed five deliberately different directions on the same screens and the same numbers, so the comparison was about design, not nicer sample data.</p></CaseProse>
            <DecisionBeside decision={directionDecision}
              screen={<Focus src="/img/memq-v2/phone-04-today.webp" srcHeight={811} alt="The 2.0 Today screen" region={{ x: 0, y: 60, w: 402, h: 440 }} notes={[
                { box: { x: 14, y: 182, w: 176, h: 96 }, label: 'What is due comes first, in one big number.', side: 'left' },
                { box: { x: 200, y: 118, w: 196, h: 170 }, label: 'Inkling in the hero: playful, and smaller than the content.' },
                { box: { x: 14, y: 288, w: 374, h: 70 }, label: 'One lead action, purple on lime.', side: 'left' },
              ]} />} />
            <CaseFigure caption="Same card, chips and button under three depth treatments. Only the ledge survives on the lime ground.">
              <LedgeLab />
            </CaseFigure>
            <CaseFigure caption="The rule that keeps interface and illustration apart on the same screen.">
              <OutlineRule />
            </CaseFigure>
            <CaseFigure caption="Lime sky, purple content. Every colour has a single role.">
              <PaletteStrip />
            </CaseFigure>
          </Appendix>
          <Appendix title="Inkling, the rigged character">
            <CaseFigure caption="Live: the production rig. Motion is computed each frame from the state; nothing is keyframed.">
              <CaseInteractivePreview src="/demos/memq-mascot/index.html" title="Inkling, MemQ's rigged mascot" />
            </CaseFigure>
          </Appendix>
        </CaseChapter>
      </CaseKitSections>
    </CaseKitPage>
    </MemQTone>
  );
}
