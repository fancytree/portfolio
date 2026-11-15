import type { Metadata } from 'next';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import { CaseKitControls as CaseStudyControls } from '../../components/CaseStudyControls';
import { DecisionCards, type Decision } from '../procurement-agent-kit/DecisionCards';
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

export const metadata: Metadata = {
  title: 'MemQ — making what you learn stick | Mei Chai',
  description:
    'An AI study app for iOS, designed and built solo: from research to a spaced-retrieval loop, a rigged mascot and a visual language built on one depth rule.',
  robots: { index: false, follow: false },
};

const navLabels = [
  '01 / Overview',
  '02 / The problem',
  '03 / Research',
  '04 / Principles',
  '05 / Direction',
  '06 / Design language',
  '07 / Inkling',
  '08 / The loop',
  '09 / Now building',
  '10 / Results',
  '11 / Reflection',
];

const sourceDecision: Decision = {
  question: 'Where should the cards come from?',
  source: 'Welcome screen brief · onboarding',
  options: [
    { label: 'A store of ready-made decks', verdict: 'Fast to fill, but the cards are someone else’s highlights. Downloaded, then never opened.', reversed: true },
    { label: 'Your own material, turned into cards', verdict: 'Notes, a half-read PDF, the question you just asked AI. AI drafts the cards; you keep what you will actually use.', chosen: true },
  ],
  evidence: 'Version 1 shipped an Explore library of curated lessons. Interviews kept pointing elsewhere: people forget what they looked up themselves, and making cards by hand was the reason they stopped.',
  tradeoff: 'A new account starts empty. Onboarding has to explain the idea before setup, and every empty screen needs a face and one next step.',
};

const directionDecision: Decision = {
  question: 'Which visual direction for 2.0?',
  source: 'Visual direction brief · five directions, same content',
  options: [
    { label: 'A · Playful, character-led', verdict: 'Starting today’s round feels like a small challenge. Risk: reading as a children’s app.', chosen: true },
    { label: 'B · Tactile, paper and ink', verdict: 'Warm and credible, but texture fails at small sizes and hides empty content.' },
    { label: 'C · Rich colour per course', verdict: 'Courses become recognisable, but colour starts competing with answer feedback.' },
    { label: 'D · Quiet and minimal', verdict: 'Clear next step, but close to what v1 already was.' },
    { label: 'E · Open concept', verdict: 'Spatial or tool metaphors: expressive, but harder to find Start and Create.' },
  ],
  evidence: 'Every direction had to carry identical data (19 due, 6 / 20 goal, a real quiz with four long options) so I compared design, not prettier sample content. The brief’s goal was an experience adults want to start, and come back to.',
  tradeoff: 'Playful has to stay adult: no lives, no coins, no punishing streak breaks, and the character never covers learning content.',
};

const mascotDecision: Decision = {
  question: 'How should the character move?',
  source: 'Mascot motion spec · Blender handover',
  options: [
    { label: 'Keyframed clips rendered from Blender', verdict: '607 frames of showcase reel. One clip per state, cross-fades between them, and it can only loop.' },
    { label: 'A part-based rig on springs', verdict: 'Every frame the app sets a target pose for its state; a damped spring per part chases it. Tail, horns and hands follow the body.', chosen: true },
  ],
  evidence: 'I mapped the six places the character appears. Only one needs an instant reaction: answer feedback, which a recorded clip cannot land on a tap. Springs gave 23 composable states from about 16 still parts, and a gaze that never repeats on a fixed period.',
  tradeoff: 'More engineering than playing a video, and cut-out parts cannot pose a hand that reaches and holds. I accepted simpler hands.',
};

const scheduleDecision: Decision = {
  question: 'What should move a card forward?',
  source: 'Scheduler · lib/studyPlan',
  options: [
    { label: 'Every correct answer', verdict: 'A round asks several questions about one card, so a single sitting could push it three stages ahead.' },
    { label: 'Only a review of a card that was due', verdict: 'One stage per due review. Waits of 1, 3, 7, 14, 30 days, then doubling. A miss steps back once.', chosen: true },
  ],
  evidence: 'Spaced repetition only works if the gap is real. Cramming the same card in one session should feel productive, not fake a month of memory.',
  tradeoff: 'Extra practice does not speed a card up. The deadline setting exists for exams: it shrinks the remaining waits together and keeps a last look for the day before.',
};

const markingDecision: Decision = {
  question: 'How strict is marking?',
  source: 'Answer checking · grade-answer function',
  options: [
    { label: 'Exact string match', verdict: 'Simple, but “to quit trying” fails against “stop trying to do something”.' },
    { label: 'Letters for spelling, sense for meaning', verdict: 'Spelling is shown back with every slip picked out. Free answers are read for sense, and the learner can overrule.', chosen: true },
  ],
  evidence: 'Research named trust in automation as the gate: people accepted AI help once it was visibly accurate, and wanted to stay in control of their own learning.',
  tradeoff: 'Open answers need a model call, and a model can be wrong. Overrule is the safety valve; strict and relaxed now decide what is saved, not only what is shown.',
};

const writerDecision: Decision = {
  question: 'Who turns the conversation into cards?',
  source: 'Design direction · MemQ in AI chats',
  options: [
    { label: 'Copy the answer into MemQ, and let MemQ generate cards', verdict: 'Works today, but it is a chore, and MemQ never sees the question or the follow-ups that gave the answer its meaning.' },
    { label: 'The chat writes them, through MemQ’s tools', verdict: 'The model that just explained it already holds the context. It writes the cards and their questions; MemQ checks the shape and saves them in one step.', chosen: true },
  ],
  evidence: 'People already learn in conversations. The missing step is the one after the answer, and the chat is the only place that knows what was actually asked.',
  tradeoff: 'Card quality now depends on someone else’s model. So MemQ holds the rules: every card brings a choice question with 5–6 short options and exactly one right, plus a recall question, all saved together or not at all.',
};


export default function MemQKitPage() {
  return (
    <div className={diagrams.widePage}>
    <CaseKitPage>
      <CaseStudyControls navLabels={navLabels} railKicker="Case study" railTitle="MemQ" />
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
              { label: 'Solution', body: 'Your own material becomes cards. A schedule brings each back on time, in five kinds of question, with a character that reacts to how it went.' },
              { label: 'Outcome', body: 'Version 1 live on the App Store. Version 2.0 rebuilt end to end: new visual language, rigged mascot, spaced-retrieval scheduler and progress charts.' },
            ],
            deliverables: ['iOS app', 'Design system', 'Rigged mascot', 'Scheduler', 'AI-chat concept'],
          }}
        />

        <CaseChapter label="01 / Overview" title="One designer, the whole product.">
          <CaseProse>
            <p>I owned every layer: research, product scope, visual language, the character, motion, and the code that ships it. That matters for this case, because most decisions below were made where design and engineering meet.</p>
          </CaseProse>
          <CaseFigure caption="MemQ 2.0: Today in front, four of the five ways of being asked behind it. Real screens from the App Store set.">
            <ProductShowcase />
          </CaseFigure>
          <CaseStats items={[
            { value: '8 + 24', label: 'Interviews and survey responses before any design' },
            { value: '11', label: 'Moderated usability sessions over two rounds' },
            { value: '15', label: 'TestFlight beta users before launch' },
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
            <p>8 interviews and 24 survey responses across students, language learners and professionals, many already using Anki, Quizlet, ChatGPT or Claude. Then two rounds of usability testing on the prototype (6 and 5 sessions, 3 returning) and 15 TestFlight users on reminders and subscription.</p>
          </CaseProse>
          <CaseEvidenceCards label="Research findings" layout="pairs" items={[
            { icon: null, title: 'Creating cards is the drop-off', body: 'People spent longer making cards than studying them. → AI drafting became the main path, manual entry the fallback.' },
            { icon: null, title: 'AI should remove friction, not learning', body: 'They wanted help with the busywork and control over the study. → AI fills fields; the learner edits and keeps.' },
            { icon: null, title: 'Trust comes after accuracy', body: 'Sceptical first, convinced once extraction was right. → Show the work: slips picked out, answers overrulable.' },
            { icon: null, title: 'Progress keeps people going', body: 'Visible mastery was rated high-value in every round. → Today leads with what is due; You gets charts from an answer log.' },
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
          <DecisionCards items={[sourceDecision]} />
        </CaseChapter>

        <CaseChapter label="05 / Direction" title="Three visual versions, and why the third one.">
          <CaseFigure caption="v1 and v2 were credible and calm. Neither gave a clear reason to come back tomorrow, which is the whole job of a review app.">
            <VisualEvolution />
          </CaseFigure>
          <CaseProse>
            <p>For 2.0 I wrote a brief for five deliberately different directions, each tested with the same home screen, the same quiz and the same numbers, so the comparison was about design rather than nicer sample data. Each had to say what you see first, where you start, and what gets pushed back, and why.</p>
          </CaseProse>
          <DecisionCards items={[directionDecision]} />
        </CaseChapter>

        <CaseChapter label="06 / Design language" title="One depth rule, applied everywhere.">
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

        <CaseChapter label="07 / Inkling" title="A character that reacts, not a sticker.">
          <CaseProse>
            <p>Inkling started as a drawing in Figma and ended as a rig: separate parts, each turning about its own point, driven by springs and linked so the tail, horns and hands follow the body. This is the app’s own rig running in your browser. Take it apart, show the skeleton, switch the state the app is in, or tap it.</p>
          </CaseProse>
          <CaseFigure caption="Live: the production rig on demonstration controls. Motion is computed each frame from the state; nothing is keyframed. With reduced motion, it is drawn once at rest.">
            <CaseInteractivePreview src="/demos/memq-mascot/index.html" title="Inkling, MemQ's rigged mascot" />
          </CaseFigure>
          <DecisionCards items={[mascotDecision]} />
        </CaseChapter>

        <CaseChapter label="08 / The loop" title="When to ask, how to ask, and how to mark.">
          <CaseProse>
            <h3>When: the schedule</h3>
            <p>Play the card below. Answer as if it came due, miss one, or set an exam date and watch the remaining looks close up. The curve is illustrative; the stages are the real ones.</p>
          </CaseProse>
          <CaseFigure caption="The scheduler as it ships: 1, 3, 7, 14, 30 days, then doubling. A miss is one stage back and a second look in ten minutes.">
            <SpacedScheduler />
          </CaseFigure>
          <DecisionCards items={[scheduleDecision]} />

          <CaseProse>
            <h3>How: five ways of being asked</h3>
            <p>A card is taken through look, recognise, produce: a new card gets all three, a familiar one only the last. Each step has several forms. Watch them play one at a time, or move your pointer in and answer them yourself.</p>
          </CaseProse>
          <QuestionLadder />
          <p className="m-0 text-[13px] leading-[1.5] text-[#686868]">A rebuild of the practice screen at the app’s own layout, using its own marking and matching code, on demonstration content. The app reads open answers for sense with a model; that step is simulated here.</p>

          <CaseProse>
            <h3>Marking: show the slip, not just “wrong”</h3>
          </CaseProse>
          <CaseFigure caption="The practice screen right after Submit, for four typed answers. Rebuilt at the app’s layout; each mark is produced by the app’s own marking code, relaxed setting. The overrule link works.">
            <MarkingEvidence />
          </CaseFigure>
          <DecisionCards items={[markingDecision]} />

          <CaseProse>
            <h3>Progress: one number, one sentence, one chart</h3>
            <p>Every chart on the You page leads with a single figure and a line saying what it means; the chart is there to back the sentence up, not to be read like a spreadsheet. One purple ramp runs through all of them: the deeper, the further along. They grow in when the numbers change, not on every visit, and stand still with reduced motion.</p>
          </CaseProse>
          <CaseFigure caption="The five You-page charts, rebuilt from the app’s chart code on demonstration data: the study grid beside the streak, cards by stage, reviews coming due, the daily goal and correct answers. All read from one answer log.">
            <ProgressCharts />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="09 / Now building" title="From the question you asked to the card you keep.">
          <CaseProse>
            <p>This is what I am working on now. People already learn by asking Claude or ChatGPT; what they ask there is gone a week later. The aim: <strong>the conversation is summarised into knowledge cards, and MemQ makes sure you remember them.</strong> MemQ becomes the memory of the chats you learn in, not one more place to type.</p>
          </CaseProse>
          <CaseFigure caption="The intended flow, as two illustrative conversations in a generic chat app. MemQ’s skill checks the learner’s lessons and recommends where the cards go; the cards render in the chat as an A2UI surface, in MemQ’s two card kinds, without practice answers; one button adds the ones kept. Illustrative: the experience as designed, not a shipped feature.">
            <ChatToCards />
            <A2uiPeek />
          </CaseFigure>
          <CaseSteps items={[
            { title: 'Connect once', body: 'In the AI app, add MemQ as a connector. MemQ’s own setup sheet asks which app first, then shows only that app’s steps.' },
            { title: 'Sign in and approve', body: 'The app sends you to MemQ to sign in and say yes. Nothing is shared until you do, and writes can ask again each time.' },
            { title: 'Ask, review, keep', body: 'Ask the way you already do. When something is worth keeping, say so: MemQ suggests a lesson, shows the cards in the chat, and you add the ones you want in one go.' },
          ]} />
          <DecisionCards items={[writerDecision]} />
          <CaseProse>
            <p>This is the direction, shown as it should work rather than as it runs today. It is in design and not released.</p>
          </CaseProse>
        </CaseChapter>

        <CaseChapter label="10 / Results" title="Shipped, rebuilt, and honest about what is measured.">
          <CaseStats items={[
            { value: 'Live', label: 'Version 1 on the App Store; 2.0 built and its store set ready' },
            { value: '126', label: 'Commits in the six days that took 2.0 from tokens to App Store screenshots' },
            { value: '23', label: 'Composable character states from about 16 still parts' },
          ]} />
          <CaseProse>
            <ul>
              <li>2.0 rebuilt every screen on one token pipeline, with UI guards that check contrast and asset sources on each change.</li>
              <li>Progress charts read a per-answer log, counted in the learner’s own time zone: a twelve-week grid, accuracy, the daily goal and what is coming due.</li>
              <li>Empty and error states each got a scene and one next step, instead of “No cards”.</li>
            </ul>
            <p>I do not yet have usage data for 2.0, so I am not claiming retention gains. The first thing to measure is whether people come back for the second and seventh day’s reviews.</p>
          </CaseProse>
        </CaseChapter>

        <CaseClose label="11 / Reflection" title="What I would tell the next designer on it.">
          <CaseProse>
            <ul>
              <li><strong>Calm is not the same as inviting.</strong> v1 was the version I was proudest of visually, and it asked nothing of you tomorrow.</li>
              <li><strong>Write briefs, not blueprints.</strong> Saying what a screen must make you feel, and what identity cannot change, got better work from every collaborator, human or AI.</li>
              <li><strong>Read the product before animating it.</strong> Mapping where the character appears showed only one place needed instant reaction. That decided the whole motion architecture.</li>
              <li><strong>Go where the learning already happens.</strong> People learn in AI chats now. The next MemQ is less a place to type cards and more the memory of those conversations.</li>
            </ul>
          </CaseProse>
        </CaseClose>
      </CaseKitSections>
    </CaseKitPage>
    </div>
  );
}
