'use client';

/**
 * What I am building now: what you ask an AI chat is summarised into MemQ cards, shown right in
 * the chat as an A2UI surface you can review, and added in one batch; MemQ then makes sure it is
 * remembered. Before showing the cards, MemQ's skill looks through the learner's lessons and
 * recommends where they go: an existing lesson that fits, or a new one.
 *
 * Two illustrative conversations, a knowledge one and a language one, play in turn. Card layouts
 * follow MemQ's two card kinds; practice answers are never shown in the chat.
 */

import { useEffect, useRef, useState } from 'react';
import { geistSans, oswald } from '@/app/fonts';
import { PhoneFrame } from './MemQPractice';
import { ChoiceQuestion, Icon, StatusBar, useScale, type Choice } from './MemQQuiz';
import q from './MemQQuiz.module.css';
import m from './MemQMcp.module.css';

type KnowledgeCard = { kind: 'knowledge'; term: string; question: string; explanation: string };
type LanguageCard = { kind: 'language'; term: string; pronunciation: string; pos: string; meaning: string; example: string };
type Card = (KnowledgeCard | LanguageCard) & { questions: number };
type Destination = { label: string; note: string; recommended?: boolean; isNew: boolean };

type Story = {
  key: 'knowledge' | 'language';
  label: string;
  ask: string;
  answer: string[];
  request: string;
  /** What the skill found when it looked through the learner's lessons. */
  lookup: string;
  destinations: Destination[];
  cards: Card[];
  /** The card the learner leaves out before adding, if any. */
  skip?: number;
  quiz: Choice;
  explain: string;
};

const STORIES: Story[] = [
  {
    key: 'knowledge', label: 'Knowledge chat',
    ask: 'What is opportunity cost? Give me an everyday example.',
    answer: [
      'It’s the value of the best thing you give up when you choose. An evening studying costs you the shift you could have worked; the lost pay is the opportunity cost.',
      'Not to be confused with a sunk cost (already spent) or a marginal cost (the cost of one more).',
    ],
    request: 'Make MemQ cards from this.',
    lookup: '3 lessons, none on economics',
    destinations: [
      { label: 'New lesson: Economics Essentials', note: 'Nothing you have covers this topic', recommended: true, isNew: true },
      { label: 'Add to Cognitive Psychology', note: '36 cards · closest topic', isNew: false },
    ],
    cards: [
      { kind: 'knowledge', term: 'Opportunity cost', question: 'What is opportunity cost?', explanation: 'The value of the best alternative you give up when you choose. An evening studying costs the shift you could have worked.', questions: 2 },
      { kind: 'knowledge', term: 'Sunk cost', question: 'Why should a sunk cost not change your decision?', explanation: 'It is already paid and cannot be recovered, whatever you choose next.', questions: 2 },
      { kind: 'knowledge', term: 'Marginal cost', question: 'What does marginal cost measure?', explanation: 'The extra cost of producing one more unit.', questions: 2 },
    ],
    skip: 2,
    quiz: { kind: 'mcq', topic: 'Economics Essentials', chip: 'Choose', prompt: 'Choose the meaning', q: 'Opportunity cost', opts: ['The total money spent on a purchase.', 'The value of the next best alternative you give up.', 'A cost that has already been paid and cannot be recovered.', 'The extra cost of producing one more unit.'], correct: 1 },
    explain: 'Choosing one option means giving up another. Opportunity cost is the value of the best alternative you didn’t choose.',
  },
  {
    key: 'language', label: 'Language chat',
    ask: 'How do I say “don’t give up” in Italian? I mix up arrendersi and mollare.',
    answer: [
      '“Non arrenderti!” Arrendersi is to give up or surrender; mollare is informal, to quit or let go of something.',
      'If you give up on a plan, use rinunciare a: “Ha rinunciato al viaggio.”',
    ],
    request: 'Save these words to MemQ.',
    lookup: 'Found Everyday Italian, a language lesson',
    destinations: [
      { label: 'Add to Everyday Italian', note: '48 cards · same language, same level', recommended: true, isNew: false },
      { label: 'New lesson: Italian verbs', note: 'Keep them apart', isNew: true },
    ],
    cards: [
      { kind: 'language', term: 'arrendersi', pronunciation: '/arˈrɛndersi/', pos: 'verb · reflexive', meaning: 'to give up, to surrender', example: 'Non arrenderti adesso.', questions: 3 },
      { kind: 'language', term: 'mollare', pronunciation: '/molˈlaːre/', pos: 'verb · informal', meaning: 'to quit, to let go of', example: 'Ho mollato la palestra.', questions: 3 },
      { kind: 'language', term: 'rinunciare a', pronunciation: '/ri.nunˈtʃaːre/', pos: 'phrase', meaning: 'to give up on something', example: 'Ha rinunciato al viaggio.', questions: 3 },
    ],
    quiz: { kind: 'mcq', topic: 'Everyday Italian', chip: 'Choose', prompt: 'Choose the meaning', q: 'arrendersi', opts: ['to borrow something', 'to give up, to surrender', 'to look after someone', 'to arrive late'], correct: 1 },
    explain: 'Arrendersi is reflexive: mi arrendo, ti arrendi. In the imperative the pronoun attaches: “Non arrenderti!”',
  },
];

/** Beats of one loop, in milliseconds. */
const B = { ask: 500, typing: 1400, answer: 2400, request: 4600, lookup: 5300, found: 6100, surface: 6700, cards: 7300, skip: 10000, add: 11200, added: 11800, fly: 12400, library: 13100, review: 15800, pick: 17600, end: 21000 };
const STAGES = [
  { at: B.ask, label: 'Ask where you already ask' },
  { at: B.lookup, label: 'It checks your lessons first' },
  { at: B.surface, label: 'Review the cards, add in one go' },
  { at: B.library, label: 'MemQ makes it stick' },
];

export function ChatToCards() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [still, setStill] = useState(false);
  const [t, setT] = useState(0);
  const [pinned, setPinned] = useState<number | null>(null);
  const [loop, setLoop] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Several thresholds, so a change in the page's layout can never leave it believing it is off screen.
    const io = new IntersectionObserver(([e]) => { setVisible(e.intersectionRatio > 0.1); setStill(reduce); }, { threshold: [0, 0.1, 0.2, 0.4, 0.6, 0.8, 1] });
    io.observe(wrap.current!);
    return () => io.disconnect();
  }, []);

  const clock = useRef(0);
  useEffect(() => {
    if (!visible || still) return;
    const start = performance.now() - clock.current;
    const id = window.setInterval(() => {
      const elapsed = performance.now() - start;
      if (elapsed >= B.end) { clock.current = 0; setT(0); setLoop((n) => n + 1); return; }
      clock.current = elapsed;
      setT(elapsed);
    }, 100);
    return () => window.clearInterval(id);
  }, [visible, still, loop]);

  const story = STORIES[pinned ?? loop % STORIES.length];
  const now = still ? B.end - 1 : t;
  const at = (beat: number) => now >= beat;
  const stage = STAGES.reduce((current, s, i) => (now >= s.at ? i : current), 0);
  const picked = story.cards.map((_, i) => !(story.skip === i && at(B.skip)));
  const count = picked.filter(Boolean).length;
  const target = story.destinations.find((d) => d.recommended)!;
  const choose = (i: number) => { setPinned(i); clock.current = 0; setT(0); setLoop((n) => n + 1); };

  return (
    <div ref={wrap} className={m.story}>
      <div className={m.top}>
        <div className={m.tabs} role="tablist" aria-label="Conversation">
          {STORIES.map((s, i) => (
            <button key={s.key} type="button" role="tab" aria-selected={story.key === s.key} className={story.key === s.key ? m.tabOn : ''} onClick={() => choose(i)}>{s.label}</button>
          ))}
        </div>
        <ol className={m.stages} aria-label="From a question in a chat to cards in MemQ">
          {STAGES.map((s, i) => (
            <li key={s.label} className={i === stage ? m.stageOn : i < stage ? m.stageDone : ''}><span>{i + 1}</span>{s.label}</li>
          ))}
        </ol>
      </div>

      <div className={m.scene}>
        <div className={m.chat} role="img" aria-label={`An AI chat. The learner asks: ${story.ask} The chat answers. Asked for cards, MemQ first checks the learner's lessons and recommends: ${target.label}. It then shows ${story.cards.length} cards for review; the learner adds ${count}.`}>
          <div className={m.chrome} aria-hidden="true"><i /><i /><i /><span>Your AI chat</span></div>
          <div className={m.thread} key={story.key}>
            {at(B.ask) && <p className={`${m.msg} ${m.me}`}>{story.ask}</p>}
            {at(B.typing) && !at(B.answer) && <p className={`${m.msg} ${m.ai} ${m.typing}`}><i /><i /><i /></p>}
            {at(B.answer) && <div className={`${m.msg} ${m.ai}`}>{story.answer.map((p) => <p key={p}>{p}</p>)}</div>}
            {at(B.request) && <p className={`${m.msg} ${m.me}`}>{story.request}</p>}
            {at(B.lookup) && (
              <div className={m.toolLine}>
                <span className={m.toolMarkSmall}>Q</span>
                <span>MemQ · list_lessons</span>
                <span className={m.toolResult}>{at(B.found) ? story.lookup : 'Checking your lessons…'}</span>
              </div>
            )}
            {at(B.surface) && <CardSurface story={story} now={now} picked={picked} count={count} />}
          </div>
        </div>

        <div className={`${m.bridge} ${at(B.fly) && !at(B.library + 800) ? m.bridgeOn : ''}`} aria-hidden="true"><span /><span /><span /></div>

        <div className={m.phoneCol}>
          <MemQPhone story={story} now={now} count={count} loop={loop} />
          <span className={m.phoneCaption}>{at(B.review) ? 'Next day: a card comes back as a question' : at(B.library) ? (target.isNew ? 'A new lesson, due tomorrow' : 'Added to a lesson you already have') : 'MemQ'}</span>
        </div>
      </div>
    </div>
  );
}

/** The A2UI surface the chat renders: where to put them (recommended first), then the cards, checkable, with one batch action. */
function CardSurface({ story, now, picked, count }: { story: Story; now: number; picked: boolean[]; count: number }) {
  const at = (beat: number) => now >= beat;
  const added = at(B.added);
  const target = story.destinations.find((d) => d.recommended)!;
  return (
    <div className={`${m.surface} ${added ? m.surfaceDone : ''}`}>
      <div className={m.surfaceHead}>
        <span className={m.toolMark}>Q</span>
        <span className={m.surfaceTitle}><b>MemQ</b> · {story.cards.length} cards from this chat</span>
        <span className={m.a2ui}>A2UI</span>
      </div>

      <div className={m.where} role="radiogroup" aria-label="Where these cards go">
        <span className={m.whereLabel}>Where should they go?</span>
        {story.destinations.map((d) => (
          <span key={d.label} role="radio" aria-checked={!!d.recommended} className={`${m.option} ${d.recommended ? m.optionOn : ''}`}>
            <span className={m.radio} aria-hidden="true" />
            <span className={m.optionText}><b>{d.label}</b><small>{d.note}</small></span>
            {d.recommended && <span className={m.recommend}>Recommended</span>}
          </span>
        ))}
      </div>

      <div className={m.cards}>
        {story.cards.map((card, i) => {
          if (!at(B.cards + i * 450)) return null;
          const on = picked[i];
          return (
            <div key={card.term} className={`${m.card} ${on ? '' : m.cardOff} ${added && on ? m.cardAdded : ''}`} style={{ transitionDelay: `${i * 110}ms` }}>
              {added && <span className={on ? m.addedTag : m.skippedTag}>{on ? <><Icon name="check" size={12} /> Added</> : 'Not added'}</span>}
              <span className={`${m.check} ${on ? m.checkOn : ''} ${story.skip === i && at(B.skip - 500) && !at(B.skip) ? m.checkPress : ''}`} aria-hidden="true">{on ? <Icon name="check" size={13} /> : null}</span>
              {card.kind === 'knowledge' ? (
                <div className={m.cardBody}>
                  <span className={m.kind}>Knowledge</span>
                  <b className={m.term}>{card.term}</b>
                  <span className={m.question}>Q · {card.question}</span>
                  <span className={m.explain}>{card.explanation}</span>
                </div>
              ) : (
                <div className={m.cardBody}>
                  <span className={m.kind}>Language</span>
                  <span className={m.wordLine}><b className={m.term}>{card.term}</b><span className={m.pron}>{card.pronunciation}</span><span className={m.pos}>{card.pos}</span></span>
                  <span className={m.meaning}>{card.meaning}</span>
                  <span className={m.example}>“{card.example}”</span>
                </div>
              )}
              <span className={m.practice}>+{card.questions} practice questions</span>
            </div>
          );
        })}
      </div>
      {at(B.cards + story.cards.length * 450) && (
        <div className={m.surfaceFoot}>
          <span>Answers stay hidden until you practise.</span>
          {added
            ? <span className={m.addedNote}><Icon name="check" size={14} /> Added {count} to {target.label.replace(/^(New lesson: |Add to )/, '')}</span>
            : <b className={`${m.addBtn} ${at(B.add - 500) ? m.addPress : ''}`}>Add {count} to MemQ</b>}
        </div>
      )}
    </div>
  );
}

function MemQPhone({ story, now, count, loop }: { story: Story; now: number; count: number; loop: number }) {
  const { ref, scale } = useScale();
  const at = (beat: number) => now >= beat;
  const isNew = story.destinations.find((d) => d.recommended)!.isNew;
  const lessonName = story.quiz.topic!;
  return (
    <PhoneFrame className={m.phone}>
      <div ref={ref} className={q.viewport}>
        <div className={`${q.app} ${geistSans.variable} ${oswald.variable}`} style={{ transform: `scale(${scale})` }}>
          <StatusBar />
          {at(B.review) ? (
            <>
              <div className={q.nav}>
                <span className={q.close} aria-hidden="true"><Icon name="x" size={22} /></span>
                <span className={q.roundTitle}>Practice</span>
                <span className={q.gear} aria-hidden="true"><Icon name="settings" size={22} /></span>
              </div>
              <div className={q.progress}><span>0</span><span className={q.track}><span style={{ width: '0%' }} /></span><span>{count * 2}</span></div>
              <div className={q.body}><PlayedQuiz key={`${story.key}-${loop}`} story={story} pick={at(B.pick)} /></div>
            </>
          ) : (
            <div className={m.library}>
              <div className={m.libHead}><span>Library</span><span className={m.libSearch}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg></span></div>
              <div className={m.filters}><b>All</b><span>Due</span><span>Deadline</span></div>
              {isNew && at(B.library) && <Lesson cover="chart" name={lessonName} meta={`${count} cards · ${count} due tomorrow`} tag="New · from chat" fresh />}
              <Lesson cover="globe" name="Everyday Italian" meta={!isNew && at(B.library) ? `${48 + count} cards · ${count} new` : '48 cards · 8 due'}
                tag={!isNew && at(B.library) ? `+${count} from chat` : undefined} fresh={!isNew && at(B.library)} />
              <Lesson cover="layers" name="Cognitive Psychology" meta="36 cards · 6 due" />
            </div>
          )}
          <span className={q.homeIndicator} />
        </div>
      </div>
    </PhoneFrame>
  );
}

const COVERS = {
  chart: { bg: 'linear-gradient(135deg,#dcc8f7,#f0e4fc)', icon: <><path d="M3 3v18h18" /><path d="m7 14 4-4 3 3 5-6" /></> },
  globe: { bg: 'linear-gradient(135deg,#e9f7b5,#d2ef7a)', icon: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></> },
  layers: { bg: 'linear-gradient(135deg,#fde2d2,#f5bfa6)', icon: <><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" /></> },
};
function Lesson({ cover, name, meta, tag, fresh }: { cover: keyof typeof COVERS; name: string; meta: string; tag?: string; fresh?: boolean }) {
  return (
    <div className={`${m.lesson} ${fresh ? m.lessonNew : ''}`}>
      <span className={m.cover} style={{ background: COVERS[cover].bg }}><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{COVERS[cover].icon}</svg></span>
      <span className={m.lessonText}><b>{name}</b><small>{meta}</small></span>
      {tag && <span className={m.newTag}>{tag}</span>}
    </div>
  );
}

/** The practice screen's own question component, answered on the beat. */
function PlayedQuiz({ story, pick }: { story: Story; pick: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!pick) return;
    [...(host.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? [])][story.quiz.correct]?.click();
  }, [pick, story]);
  return <div ref={host} className={m.quizHost}><ChoiceQuestion question={story.quiz} explain={story.explain} onDone={() => {}} /></div>;
}

/** What the chat app actually receives: an abridged A2UI v0.8 stream, and the event the button sends back. */
export function A2uiPeek() {
  return (
    <details className={m.peek}>
      <summary>What the chat receives: an abridged A2UI message stream</summary>
      <pre>{`MemQ skill → list_lessons            // is there a lesson these belong in?
{"surfaceUpdate":{"surfaceId":"memq-cards","components":[
  {"id":"root","component":{"Column":{"children":{"explicitList":["where","cards","add"]}}}},
  {"id":"where","component":{"MultipleChoice":{"selections":{"path":"/destination"},"options":[
     {"label":{"literalString":"Add to Everyday Italian (recommended)"},"value":"lesson:everyday-italian"},
     {"label":{"literalString":"New lesson: Italian verbs"},"value":"new:Italian verbs"}]}}},
  {"id":"cards","component":{"List":{"children":{"template":{"componentId":"card","dataBinding":"/cards"}}}}},
  {"id":"card","component":{"MemQCard":{"kind":{"path":"kind"},"term":{"path":"term"},"selected":{"path":"selected"}}}},
  {"id":"add","component":{"Button":{"child":"addLabel","action":{"name":"add_to_memq","context":[
     {"key":"destination","value":{"path":"/destination"}},{"key":"cards","value":{"path":"/selected"}}]}}}}]}}
{"dataModelUpdate":{"surfaceId":"memq-cards","contents":[{"key":"destination","valueString":"lesson:everyday-italian"}, …]}}
{"beginRendering":{"surfaceId":"memq-cards","root":"root","catalogId":"memq"}}

← userAction {"name":"add_to_memq","context":{"destination":"lesson:everyday-italian","cards":["c1","c2","c3"]}}
→ MemQ tool: add_cards_with_practice   // or create_lesson_with_practice for a new lesson; cards and questions saved together`}</pre>
    </details>
  );
}
