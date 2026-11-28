import type { Metadata } from 'next';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/case-kit/CaseKitControls';
import type { Decision } from '../procurement-agent-kit/DecisionCards';
import {
  CaseChapter,
  CaseClose,
  CaseEvidenceCards,
  CaseFigure,
  CaseHero,
  CaseInteractivePreview,
  CaseKitPage,
  CaseKitSections,
  CaseProse,
  CasePullquote,
  CaseStats,
  CaseSteps,
} from '../../components/case-kit/CaseKit';
import {
  AskAgainLoop,
  LedgeLab,
  OutlineRule,
  PaletteStrip,
  SpacedScheduler,
  VisualEvolution,
} from './MemQDiagrams';
import diagrams from './MemQDiagrams.module.css';
import { ProductShowcase } from './MemQPractice';
import { MarkingEvidence, QuestionLadder } from './MemQQuiz';
import { A2uiPeek, ChatToCards } from './MemQMcp';
import { ProgressCharts } from './MemQCharts';
import { ChatDemo } from './MemQChat';
import { BalanceTable, CreditsCompare, MemoryLab, OwnAiImport, TurnFlow } from './MemQAi';
import { ChatPhone } from './MemQChat';
import { Captioned, DecisionBeside, Screens } from './MemQDecision';
import { Focus, type Note } from './MemQFocus';
import { WriterFlow } from './MemQFlows';

export const metadata: Metadata = {
  title: 'MemQ — making what you learn stick | Mei Chai',
  description:
    'An AI study app for iOS, designed and built solo: from research to a spaced-retrieval loop, a rigged mascot, a visual language built on one depth rule, and an in-app AI chat that explains first and makes cards when asked.',
  robots: { index: false, follow: false },
};

const navLabels = [
  '01 / Overview',
  '02 / The problem',
  '03 / Research',
  '04 / Principles',
  '05 / AI chat',
  '06 / Under the chat',
  '07 / Paying for AI',
  '08 / The loop',
  '09 / Direction',
  '10 / Design language',
  '11 / Inkling',
  '12 / Next',
  '13 / Results',
  '14 / Reflection',
];

const sourceDecision: Decision = {
  question: 'Where should the cards come from?',
  source: 'Welcome screen brief · onboarding',
  options: [
    { label: 'Ready-made decks', verdict: 'Fast to fill, but someone else’s highlights. Downloaded, never opened.', reversed: true },
    { label: 'Your own material', verdict: 'Notes, a PDF, a question you asked AI. AI drafts; you keep what you use.', chosen: true },
  ],
  evidence: 'In interviews, people forgot what they had looked up themselves, and stopped making cards by hand.',
  tradeoff: 'New accounts start empty, so every empty screen needs one next step.',
};

const directionDecision: Decision = {
  question: 'Which visual direction for 2.0?',
  source: 'Visual direction brief · five directions, same content',
  options: [
    { label: 'A · Playful, character-led', verdict: 'Starting a round feels like a small challenge.', chosen: true },
    { label: 'B · Paper and ink', verdict: 'Warm, but texture fails at small sizes.' },
    { label: 'C · Colour per course', verdict: 'Colour competes with answer feedback.' },
    { label: 'D · Quiet and minimal', verdict: 'Too close to v1.' },
    { label: 'E · Open concept', verdict: 'Expressive, but Start and Create get lost.' },
  ],
  evidence: '',
  tradeoff: 'Playful must stay adult: no lives, no coins, no punished streaks.',
};

const writerDecision: Decision = {
  question: 'Who turns the chat into cards?',
  source: 'Design direction · MemQ in AI chats',
  options: [
    { label: 'Copy it into MemQ', verdict: 'A chore, and the question behind the answer is lost.' },
    { label: 'The chat writes them, through MemQ’s tools', verdict: 'The model that explained it writes the cards; MemQ checks and saves.', chosen: true },
  ],
  evidence: '',
  tradeoff: 'Quality depends on another model, so MemQ enforces the card rules.',
};
const doorsDecision: Decision = {
  question: 'One chat that guesses, or two doors?',
  source: 'AI chat spec · entry points',
  options: [
    { label: 'One chat; the model detects intent', verdict: 'Cost is known only after the model has run.' },
    { label: 'One chat; pick a mode first', verdict: 'v1 did this: people had to sort their own need first.', reversed: true },
    { label: 'Two doors, named for what they do', verdict: 'Where you tap is the intent, and the cost.', chosen: true },
  ],
  evidence: 'Four of five ways in were already unambiguous.',
  tradeoff: 'Ask a question cannot make cards; it can only point you to Learn something.',
};

const uiDecision: Decision = {
  question: 'Who draws what appears in the chat?',
  source: 'AI chat spec · structured replies',
  options: [
    { label: 'The model, as rich text', verdict: 'Long prose, raw asterisks, cards you cannot tick.' },
    { label: 'The model picks; the app draws', verdict: 'A few fixed interfaces, filled from real data, labelled by the app.', chosen: true },
  ],
  evidence: '“Practise Norse gods” said what, not how much. The card now shows cards, due and progress.',
  tradeoff: 'No charts or free layouts; every interface costs prompt tokens.',
};

const toolDecision: Decision = {
  question: 'How do you get a tool used every time?',
  source: 'Chat test bench · real model, 8 runs a case',
  options: [
    { label: 'Offer it, and ask firmly', verdict: 'Never called; suggestions leaked into the answer.' },
    { label: 'Words and a tool in one turn', verdict: '8 of 8 runs: the tool, and no words.' },
    { label: 'Give the moment to the person', verdict: 'Offer in words; their “yes” brings the round.', chosen: true },
  ],
  evidence: 'Held 8 of 8 on the real model.',
  tradeoff: 'Some things now take two turns.',
};

const creditsDecision: Decision = {
  question: 'How should AI use be counted?',
  source: 'AI credits · server gate and lib/aiCredits',
  options: [
    { label: 'A limit per feature', verdict: 'Seven counters nobody could explain.', reversed: true },
    { label: 'Unlimited for Pro', verdict: 'A promise the daily budget could break.' },
    { label: 'One monthly number', verdict: 'Weighted by cost, back on the 1st. Practice is never charged.', chosen: true },
  ],
  evidence: 'Seven limits on three clocks, and the app could only ever show one of them.',
  tradeoff: 'Credits are counted per account, so a second account gets round them.',
};


const toolNotes: Note[] = [
  { box: { x: 10, y: 188, w: 381, h: 82 }, label: 'Inkling offers a round in words. No button yet.', side: 'left' },
  { box: { x: 246, y: 298, w: 146, h: 50 }, label: 'The person says yes.' },
  { box: { x: 10, y: 354, w: 381, h: 170 }, label: 'Only now the round, with the app’s own numbers.', side: 'left' },
];

const directionNotes: Note[] = [
  { box: { x: 14, y: 182, w: 176, h: 96 }, label: 'What is due comes first, in one big number.', side: 'left' },
  { box: { x: 200, y: 118, w: 196, h: 170 }, label: 'Inkling in the hero: playful, and smaller than the content.' },
  { box: { x: 14, y: 288, w: 374, h: 70 }, label: 'One lead action, purple on lime.', side: 'left' },
];


export default function MemQKitPage() {
  return (
    <div className={diagrams.widePage}>
    <CaseKitPage>
      <CaseStudyControls showProgress navLabels={navLabels} railKicker="Case study" railTitle="MemQ" />
      <CaseKitSections>
        <div className="case-mobile-back"><CaseStudyBackButton /></div>
        <CaseHero
          eyebrow="Portfolio · Consumer AI · iOS · 2026"
          title="MemQ: turning what you look up into what you remember"
          intro="People ask AI the same question again and again. I designed and built MemQ, an iOS app that turns your own material into cards and brings each one back just before you would forget it."
          meta={[
            { label: 'Client', value: 'Self-initiated' },
            { label: 'Year', value: '2026' },
            { label: 'Role', value: 'Solo product designer & developer' },
            { label: 'Duration', value: 'Apr – Nov 2026' },
            { label: 'Industry', value: 'Consumer learning' },
            { label: 'Tools', value: 'Figma, Expo, Supabase, Claude Code' },
          ]}
          action={{ label: 'Visit the MemQ website', href: 'https://memq.riverstudio.cc/' }}
          tags={['Product design', 'AI UX', 'Interaction & motion', 'Design systems']}
          glance={{
            items: [
              { label: 'Challenge', body: 'Answers stay in the chat window. Flashcard apps make you build the cards; AI tools never ask you again.' },
              { label: 'Solution', body: 'Get it in: AI drafts cards from your own material, and you keep what matters. Bring it back: a schedule asks each card again on time, in five kinds of question. Make it worth opening: a language and a character people want to return to.' },
              { label: 'Outcome', body: 'Version 1 live on the App Store. 2.0 built and its store set ready, with a new visual language, a rigged character, a spaced-retrieval loop and an AI chat that explains, then keeps.' },
            ],
            deliverables: ['iOS app', 'Design system', 'Rigged mascot', 'Scheduler', 'In-app AI chat', 'AI credits'],
          }}
        />

        <CaseChapter label="01 / Overview" title="One designer, the whole product.">
          <CaseProse>
            <p>I owned every layer: research, product scope, visual language, the character, motion, and the code that ships it. That matters here, because most decisions below were made where design and engineering meet.</p>
          </CaseProse>
          <CaseFigure caption="MemQ 2.0: Today in front, four of the five ways of being asked behind it. Real screens from the App Store set.">
            <ProductShowcase />
          </CaseFigure>
          <CaseProse>
            <p>The case follows the three jobs the app has, in the order a card meets them:</p>
          </CaseProse>
          <CaseSteps items={[
            { title: 'Get it in', body: 'Turn what you looked up, read or asked into cards, without the chore that made people give up on flashcards. AI does the drafting; you decide what stays.' },
            { title: 'Bring it back', body: 'Ask each card again just before it would be forgotten, in a form that fits how well it is known, and mark the answer fairly.' },
            { title: 'Make tomorrow worth opening', body: 'A review app only works if people return. A visual language, a character that reacts and honest progress give them a reason to.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="02 / The problem" title="Getting an answer is not the same as knowing it.">
          <CaseFigure caption="Left, the loop people described in interviews. Right, the one step MemQ adds: the answer is kept, and asked back.">
            <AskAgainLoop />
          </CaseFigure>
          <CasePullquote>I use Anki, but making the cards takes longer than actually learning. So I just don’t make them.</CasePullquote>
          <p className="m-0 text-[13px] leading-[1.5] text-[#686868]">Language learner, foundational interview.</p>
        </CaseChapter>

        <CaseChapter label="03 / Research" title="Four findings, each with a design consequence.">
          <CaseProse>
            <p>Students, language learners and professionals, many already using Anki, Quizlet, ChatGPT or Claude. Interviews and a survey first; then two rounds of usability testing on the prototype (6 and 5 sessions, 3 returning) and TestFlight users on reminders and subscription.</p>
          </CaseProse>
          <CaseStats items={[
            { value: '8 + 24', label: 'Interviews and survey responses before any design' },
            { value: '11', label: 'Moderated usability sessions over two rounds' },
            { value: '15', label: 'TestFlight beta users before launch' },
          ]} />
          <CaseEvidenceCards label="Research findings" layout="pairs" items={[
            { icon: null, title: 'Creating cards is the drop-off', body: 'People spent longer making cards than studying them. → AI drafting became the main path, manual entry the fallback (05–07).' },
            { icon: null, title: 'AI should remove friction, not learning', body: 'They wanted help with the busywork and control over the study. → AI drafts; the learner edits and keeps (05).' },
            { icon: null, title: 'Trust comes after accuracy', body: 'Sceptical first, convinced once extraction was right. → Show the work: slips picked out, answers overrulable (08).' },
            { icon: null, title: 'Progress keeps people going', body: 'Visible mastery was rated high-value in every round. → Today leads with what is due; You gets charts from an answer log (08).' },
          ]} />
        </CaseChapter>

        <CaseChapter label="04 / Principles" title="Five rules I held every screen to.">
          <CaseSteps items={[
            { title: 'Yours, not someone else’s deck', body: 'Cards come from what you looked up, read or asked. Ready-made decks are not the enemy; they are just not yours.' },
            { title: 'AI drafts, the learner decides', body: 'Generation, extraction and marking all land in editable places, and the learner can overrule.' },
            { title: 'One next step on Today', body: 'Open the app and the main action is found in the first glance. Stats come second.' },
            { title: 'Motivation from real learning only', body: 'Streaks and goals count reviews. No lives, no coins, no punishment for a missed day.' },
            { title: 'Playful, for adults', body: 'The character reacts and keeps you company, and always stays smaller than the content.' },
          ]} />
          <DecisionBeside wide decision={sourceDecision}
            screen={<Screens>
              <Captioned line="Your own searches are the material."><Focus src="/img/memq-v2/01-welcome-1.webp" srcHeight={874} alt="Welcome: Turn searches into lasting memory" region={{ x: 0, y: 90, w: 402, h: 640 }} notes={[]} /></Captioned>
              <Captioned line="You keep only what you will use."><Focus src="/img/memq-v2/02-welcome-2.webp" srcHeight={874} alt="Welcome: Keep what you actually use" region={{ x: 0, y: 90, w: 402, h: 640 }} notes={[]} /></Captioned>
              <Captioned line="It comes back before you forget."><Focus src="/img/memq-v2/03-welcome-3.webp" srcHeight={874} alt="Welcome: Practice and remember" region={{ x: 0, y: 90, w: 402, h: 640 }} notes={[]} /></Captioned>
            </Screens>} />
        </CaseChapter>

        <CaseChapter label="05 / AI chat" title="Explain first. Cards only when asked."
          lead="Part one: get it in. The first finding was that making cards is where people give up, so the first job is getting cards in without the chore.">
          <CaseProse>
            <p>Three ways in: type a topic or drop in a PDF; talk it through in a chat; or bring cards from the AI you already use (07). The chat is <strong>two short conversations that each end somewhere</strong>: one in cards you keep, one in a round of practice. Watch it, or move your pointer in and use it.</p>
          </CaseProse>
          <ChatDemo />
          <p className="m-0 text-[13px] leading-[1.5] text-[#686868]">A rebuild of the chat at the app’s own layout, from its chat components, on demonstration content. Replies are canned here; in the app they stream from the model.</p>
          <DecisionBeside decision={doorsDecision}
            screen={<Focus region={{ x: 10, y: 498, w: 382, h: 150 }} notes={[
              { box: { x: 20, y: 508, w: 179, h: 129 }, label: 'Writes for you: explains, then turns it into cards.', side: 'left' },
              { box: { x: 203, y: 508, w: 179, h: 129 }, label: 'Answers about your cards, and ends in a round.' },
            ]}><ChatPhone bare start="today" /></Focus>} />
          <DecisionBeside decision={uiDecision}
            screen={<Focus region={{ x: 0, y: 205, w: 402, h: 410 }} notes={[
              { box: { x: 26, y: 220, w: 300, h: 46 }, label: 'The model picked an interface: card drafts, not prose.', side: 'left' },
              { box: { x: 330, y: 220, w: 50, h: 46 }, label: 'A list to tick, or a deck to read card by card.' },
              { box: { x: 26, y: 520, w: 350, h: 84 }, label: 'Unticked cards are left out.' },
            ]}><ChatPhone bare start="drafts" /></Focus>} />
        </CaseChapter>

        <CaseChapter label="06 / Under the chat" title="The model talks. The app decides.">
          <CaseProse>
            <p>The first version was fixed one symptom at a time: a button that did not appear, a tool never called, a prompt inventing lesson names. Four problems, one cause: <strong>nobody had written down which job belonged to the model, the server or the interface.</strong> So I wrote the flow down, then measured it.</p>
          </CaseProse>
          <CaseFigure caption="Making cards, before and after the flow was written down. Data goes back to the model; show and say end the turn.">
            <TurnFlow />
          </CaseFigure>
          <CaseStats items={[
            { value: '1', label: 'Model call to make a set of cards, down from 3–4' },
            { value: '184 / 184', label: 'Scripted conversations passed on the real model: 23 cases, 8 runs each' },
            { value: '99.8%', label: 'Of the prompt served from cache on a conversation’s second message' },
          ]} />
          <CaseProse>
            <h3>Tested like a product, not a prompt</h3>
            <p>A model follows a prompt only most of the time, so every case runs eight times and is judged by its pass rate. A full run costs about a cent, before and after every prompt change.</p>
          </CaseProse>
          <DecisionBeside decision={toolDecision}
            screen={<Focus region={{ x: 0, y: 112, w: 402, h: 420 }} notes={toolNotes}><ChatPhone bare start="offered" /></Focus>} />
          <CaseProse>
            <h3>Memory: three things, only one of them memory</h3>
            <p>The conversation is kept until you clear it; Inkling remembers what you say about yourself. To change that, you just say so.</p>
          </CaseProse>
          <CaseFigure caption="Six things said in a chat, and what the memory keeps. Each is a tested case on the real model.">
            <MemoryLab />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="07 / Paying for AI" title="Easy to understand, affordable to run.">
          <CaseProse>
            <p>AI is the one part of MemQ that costs money per tap, and there is no revenue yet. So the allowance had two goals that pull against each other: <strong>anyone can tell what they have left and what a tap costs</strong>, and <strong>the bill stays small</strong> while a free account still tries everything.</p>
          </CaseProse>
          <CaseProse>
            <h3>Understand: one number instead of seven</h3>
            <p>The first gate was seven limits, each sensible alone, on three different clocks. Play the same month through both.</p>
          </CaseProse>
          <DecisionBeside decision={creditsDecision} screen={<CreditsCompare />} />

          <CaseProse>
            <h3>Balance: every rule serves one goal, or both</h3>
            <p>One number made it clear; the rules around it keep it affordable without ever surprising anyone.</p>
          </CaseProse>
          <CaseFigure caption="The ten rules of the allowance, and which goal each serves.">
            <BalanceTable />
          </CaseFigure>
          <CaseStats items={[
            { value: '< 2¢', label: 'A free account using all 50 credits in a month, at listed model prices' },
            { value: '≈ $0.60', label: 'A Pro account using all 2,000' },
            { value: '0', label: 'Credits for practice questions and marking' },
          ]} />

          <CaseProse>
            <h3>The release valve: use your own AI</h3>
            <p>When the allowance runs out, there is still a way on that costs MemQ nothing. Copy a prompt into ChatGPT, Claude or any AI; it asks what you want to learn, writes cards and questions to MemQ’s own contract, and you paste the reply back.</p>
          </CaseProse>
          <CaseFigure caption="How a pasted reply is read. Tested against a real model: 384 cards from 11 kinds of conversation, all valid.">
            <OwnAiImport />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="08 / The loop" title="When to ask, how to ask, and how to mark."
          lead="Part two: bring it back. Each card returns at the right moment, in the right form, and is marked fairly.">
          <CaseProse>
            <h3>When</h3>
            <p>Only a review that was due moves a card on: 1, 3, 7, 14, 30 days, then doubling. A miss steps it back; cramming does not speed it up. Try it below.</p>
          </CaseProse>
          <CaseFigure caption="The scheduler as it ships. The curve is illustrative; the stages are the real ones.">
            <SpacedScheduler />
          </CaseFigure>

          <CaseProse>
            <h3>How</h3>
            <p>A new card is seen, recognised, then produced; a familiar one is only produced. Watch the forms play, or move your pointer in and answer them.</p>
          </CaseProse>
          <QuestionLadder />
          <p className="m-0 text-[13px] leading-[1.5] text-[#686868]">A rebuild of the practice screen at the app’s own layout, using its own marking and matching code, on demonstration content.</p>

          <CaseProse>
            <h3>Marking: show the slip, not just “wrong”</h3>
            <p>Spelling is checked letter by letter; own words are read for sense, and the learner can overrule.</p>
          </CaseProse>
          <CaseFigure caption="Four typed answers right after Submit, each marked by the app’s own code. The overrule link works.">
            <MarkingEvidence />
          </CaseFigure>

          <CaseProse>
            <h3>Progress</h3>
            <p>Each chart leads with one number and one sentence; the chart only backs it up.</p>
          </CaseProse>
          <CaseFigure caption="The five You-page charts on demonstration data, all read from one answer log.">
            <ProgressCharts />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="09 / Direction" title="Three visual versions, and why the third one."
          lead="Part three: make tomorrow worth opening. A schedule only works if people open the app when it calls, and the first two versions gave them no reason to.">
          <CaseFigure caption="Three versions, April to November 2026.">
            <VisualEvolution />
          </CaseFigure>
          <CaseProse>
            <p>For 2.0 I briefed five deliberately different directions on the same screens and the same numbers, so the comparison was about design, not nicer sample data.</p>
          </CaseProse>
          <DecisionBeside decision={directionDecision}
            screen={<Focus src="/img/memq-v2/phone-04-today.webp" srcHeight={811} alt="The 2.0 Today screen" region={{ x: 0, y: 60, w: 402, h: 440 }} notes={directionNotes} />} />
        </CaseChapter>

        <CaseChapter label="10 / Design language" title="One depth rule, applied everywhere.">
          <CaseProse>
            <p>A playful style falls apart fast when every component improvises its own depth. So the system has exactly one: a <strong>ledge</strong>. Every raised surface is a face on a darker shell, offset upward. Switch the treatments below to see why the other two were rejected, and press the button.</p>
          </CaseProse>
          <CaseFigure caption="Same card, chips and button under three depth treatments. Only the ledge survives on the lime ground.">
            <LedgeLab />
          </CaseFigure>
          <CaseFigure caption="The rule that keeps interface and illustration apart on the same screen.">
            <OutlineRule />
          </CaseFigure>
          <CaseFigure caption="Lime sky, purple content. The clash is the most recognisable thing about the app, so every colour has a single role.">
            <PaletteStrip />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="11 / Inkling" title="A character that reacts, not a sticker.">
          <CaseProse>
            <p>v2’s character was a sticker beside the content. In 2.0 Inkling is part of the product: it shows Today’s state and reacts when an answer lands or the streak grows. It is a rig of separate parts on springs, not a set of animations. Below is the app’s own rig: switch its state, take it apart, or tap it.</p>
          </CaseProse>
          <CaseFigure caption="Live: the production rig. Motion is computed each frame from the state; nothing is keyframed.">
            <CaseInteractivePreview src="/demos/memq-mascot/index.html" title="Inkling, MemQ's rigged mascot" />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="12 / Next" title="From the chats you already learn in.">
          <CaseProse>
            <p>Inside MemQ, explain-then-keep now works (05). Next, the same move where people already learn, in Claude and ChatGPT: <strong>the conversation becomes cards, and MemQ makes sure you remember them.</strong> Until then, Use your own AI (07) does it by copy and paste.</p>
          </CaseProse>
          <CaseFigure caption="The intended flow in a generic chat app: MemQ suggests a lesson, the cards render in the chat, one button adds the ones kept. Designed, not yet shipped.">
            <ChatToCards />
            <A2uiPeek />
          </CaseFigure>
          <CaseSteps items={[
            { title: 'Connect once', body: 'In the AI app, add MemQ as a connector. MemQ’s own setup sheet asks which app first, then shows only that app’s steps.' },
            { title: 'Sign in and approve', body: 'The app sends you to MemQ to sign in and say yes. Nothing is shared until you do, and writes can ask again each time.' },
            { title: 'Ask, review, keep', body: 'Ask the way you already do. When something is worth keeping, say so: MemQ suggests a lesson, shows the cards in the chat, and you add the ones you want in one go.' },
          ]} />
          <DecisionBeside decision={writerDecision} caption="Who does what when a chat becomes cards. MemQ never writes the cards; it holds the rules."
            screen={<WriterFlow />} />
        </CaseChapter>

        <CaseChapter label="13 / Results" title="Shipped, rebuilt, and honest about what is measured.">
          <CaseStats items={[
            { value: 'Live', label: 'Version 1 on the App Store; 2.0 built and its store set ready' },
            { value: '133', label: 'Commits in the six days that took 2.0 from tokens to App Store screenshots' },
            { value: '23', label: 'Composable character states from about 16 still parts' },
          ]} />
          <CaseProse>
            <ul>
              <li><strong>Get it in:</strong> an in-app AI chat tested on the real model before every prompt change, one monthly AI allowance, and a free route through any AI.</li>
              <li><strong>Bring it back:</strong> a spaced-retrieval scheduler, five kinds of question with fair marking, and charts from a per-answer log.</li>
              <li><strong>Worth opening:</strong> every screen rebuilt on one token pipeline with UI guards, and every empty or error state given a scene and one next step.</li>
            </ul>
            <p>I do not yet have usage data for 2.0, so I am not claiming retention gains. The first thing to measure is whether people come back for the second and seventh day’s reviews.</p>
          </CaseProse>
        </CaseChapter>

        <CaseClose label="14 / Reflection" title="What I would tell the next designer on it.">
          <CaseProse>
            <ul>
              <li><strong>Write the flow down before tuning the prompt.</strong> Four chat bugs were one missing page: who does what. Once it existed, a set of cards took one model call instead of four, and every prompt change could be measured.</li>
              <li><strong>Calm is not the same as inviting.</strong> v1 was the version I was proudest of visually, and it asked nothing of you tomorrow.</li>
              <li><strong>Read the product before animating it.</strong> Mapping where the character appears showed only one place needed instant reaction. That decided the whole motion architecture.</li>
              <li><strong>Write briefs, not blueprints.</strong> Saying what a screen must make you feel, and what identity cannot change, got better work from every collaborator, human or AI.</li>
              <li><strong>Go where the learning already happens.</strong> People learn in AI chats now. The next MemQ is less a place to type cards and more the memory of those conversations.</li>
            </ul>
          </CaseProse>
        </CaseClose>
      </CaseKitSections>
    </CaseKitPage>
    </div>
  );
}
