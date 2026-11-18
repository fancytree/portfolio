'use client';

/*
 * Figures for the AI chapters: how a turn runs before and after the chat flow was
 * written down, what the long-term memory keeps, how a reply from someone else's AI
 * is read back, and the one monthly allowance. Rules and numbers are from MemQ's
 * AI chat spec (docs/AI_CHAT_SPEC, §37–41) and lib/aiCredits; content is
 * demonstration content.
 */

import { useEffect, useRef, useState } from 'react';
import { CaseButton } from '../../components/case-kit/CaseButton';
import { Glyph } from './MemQChat';
import s from './MemQAi.module.css';

/** True once the figure has been on screen, false again when it leaves. */
function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}
const calm = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────────────────────── 1. One turn, before and after ───────────────────────── */

type Lane = 'screen' | 'model' | 'server';
type Step = { lane: Lane; label: string; note?: string; call?: boolean; cost?: boolean };
const LANES: { key: Lane; name: string; job: string }[] = [
  { key: 'screen', name: 'Interface', job: 'Every button means one thing' },
  { key: 'model', name: 'Model', job: 'Talks, and says what it wants' },
  { key: 'server', name: 'Server', job: 'Does everything it can itself' },
];
const FLOWS: Record<'before' | 'after', { steps: Step[]; summary: string[] }> = {
  before: {
    steps: [
      { lane: 'screen', label: '“Make cards”', note: 'typed, or guessed from prose' },
      { lane: 'model', label: 'list_lessons', call: true },
      { lane: 'server', label: 'Returns lessons', note: 'as uuids' },
      { lane: 'model', label: 'draft_lesson', call: true },
      { lane: 'server', label: 'Writes the cards' },
      { lane: 'model', label: 'show_card_drafts', note: 'copies every card back out', call: true, cost: true },
      { lane: 'screen', label: 'Drafts drawn', note: 'if the copy was valid' },
    ],
    summary: ['3–4 model calls', 'Every card written twice', 'Up to 6 tool rounds'],
  },
  after: {
    steps: [
      { lane: 'screen', label: 'Make cards', note: 'a button: intent is draft' },
      { lane: 'model', label: 'draft_cards(L2)', note: 'forced as the first call', call: true },
      { lane: 'server', label: 'Resolves L2, writes, de-dupes', note: 'and builds the interface' },
      { lane: 'screen', label: 'Drafts drawn', note: 'the turn ends here' },
    ],
    summary: ['1 model call', 'Cards written once', 'At most 2 tool rounds'],
  },
};

export function TurnFlow() {
  const [mode, setMode] = useState<'before' | 'after'>('after');
  const { ref, inView } = useInView<HTMLDivElement>();
  const [shown, setShown] = useState(0);
  const flow = FLOWS[mode];
  useEffect(() => {
    if (!inView) return;
    if (calm()) { const t = window.setTimeout(() => setShown(flow.steps.length), 0); return () => window.clearTimeout(t); }
    let i = 0;
    const tick = window.setInterval(() => { i += 1; setShown(i); if (i >= flow.steps.length) window.clearInterval(tick); }, 420);
    return () => window.clearInterval(tick);
  }, [inView, mode, flow.steps.length]);
  const calls = flow.steps.slice(0, shown).filter((st) => st.call).length;
  const pick = (m: 'before' | 'after') => { setShown(0); setMode(m); };

  return (
    <div ref={ref} className={s.flow}>
      <div className={s.flowTop}>
        <div className={s.segment} role="tablist" aria-label="Which version of the chat flow">
          {(['before', 'after'] as const).map((m) => (
            <CaseButton key={m} variant="tab" type="button" role="tab" aria-selected={mode === m} className={`${s.segBtn} ${mode === m ? s.segOn : ''}`} onClick={() => pick(m)}>
              {m === 'before' ? 'Before: fixed as bugs came' : 'After: written down'}
            </CaseButton>
          ))}
        </div>
        <span className={s.callCount} aria-live="polite"><b>{calls}</b> model {calls === 1 ? 'call' : 'calls'}</span>
      </div>
      <div className={s.lanes} style={{ ['--cols' as string]: flow.steps.length }}>
        {LANES.map((lane, row) => (
          <div key={lane.key} className={s.laneHead} style={{ gridRow: row + 1 }}>
            <b>{lane.name}</b><span>{lane.job}</span>
          </div>
        ))}
        {LANES.map((lane, row) => <span key={lane.key} className={s.laneRule} style={{ gridRow: row + 1 }} aria-hidden="true" />)}
        {flow.steps.map((st, i) => (
          <div key={`${mode}-${i}`} className={`${s.node} ${s[st.lane]} ${i < shown ? s.nodeIn : ''} ${st.cost ? s.nodeCost : ''}`}
            style={{ gridRow: LANES.findIndex((l) => l.key === st.lane) + 1, gridColumn: i + 2 }}>
            <span className={s.nodeNum}>{i + 1}</span>
            <span className={s.nodeLabel}>{st.label}</span>
            {st.note && <span className={s.nodeNote}>{st.note}</span>}
            <span className={s.nodeLane}>{LANES.find((l) => l.key === st.lane)!.name}</span>
          </div>
        ))}
      </div>
      <ul className={s.flowSummary}>
        {flow.summary.map((line) => <li key={line} className={mode === 'after' ? s.good : ''}>{line}</li>)}
      </ul>
      <dl className={s.results}>
        <div><dt>data</dt><dd>for the model to read → call it again</dd></div>
        <div><dt>show</dt><dd>an interface the server assembles → the turn ends</dd></div>
        <div><dt>say</dt><dd>one sentence the person can act on → the turn ends</dd></div>
      </dl>
    </div>
  );
}

/* ───────────────────────── 2. What the memory keeps ───────────────────────── */

type Said = { who: 'You' | 'Inkling'; text: string; why: string; apply: (list: string[]) => string[] };
const SAID: Said[] = [
  { who: 'You', text: 'I’m learning Italian for a trip to Rome in May.', why: 'Said about themselves, and still useful next week.',
    apply: (l) => [...l, 'Learning Italian for a trip to Rome in May.'] },
  { who: 'You', text: 'I have ADHD, so keep explanations really short.', why: 'The preference is kept; the health detail behind it is not.',
    apply: (l) => [...l, 'Prefers very short explanations.'] },
  { who: 'You', text: 'Why do I always forget new words?', why: 'A question asked today, not a fact about them. And “forget” here is not an order to forget.',
    apply: (l) => l },
  { who: 'Inkling', text: 'You really seem to like food phrases!', why: 'Inkling’s own words never count as something the person said.',
    apply: (l) => l },
  { who: 'You', text: 'The trip moved to June.', why: 'A changed fact replaces the old one.',
    apply: (l) => l.map((x) => (x.includes('Rome') ? 'Learning Italian for a trip to Rome in June.' : x)) },
  { who: 'You', text: 'Forget the trip.', why: 'Asked plainly, it goes. Nothing else moves.',
    apply: (l) => l.filter((x) => !x.includes('Rome')) },
];
const listAfter = (n: number) => SAID.slice(0, n + 1).reduce((l, x) => x.apply(l), [] as string[]);

export function MemoryLab() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [at, setAt] = useState(-1);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!inView || !auto || calm()) return;
    const t = window.setTimeout(() => setAt((a) => (a + 1 >= SAID.length ? -1 : a + 1)), at < 0 ? 900 : 2600);
    return () => window.clearTimeout(t);
  }, [inView, auto, at]);
  const list = at < 0 ? [] : listAfter(at);
  const before = at <= 0 ? [] : listAfter(at - 1);
  const said = at >= 0 ? SAID[at] : null;
  const changed = said && JSON.stringify(list) !== JSON.stringify(before);

  return (
    <div ref={ref} className={s.memory}>
      <div className={s.kinds}>
        <div><b>State</b><span>Lessons, cards, progress</span><em>Looked up every time. Never remembered: a remembered lesson name is wrong the day it is renamed.</em></div>
        <div><b>Conversation</b><span>This chat, one per line</span><em>Kept until it is cleared. The model reads the last 20 rows.</em></div>
        <div className={s.kindOn}><b>Memory</b><span>What they said about themselves</span><em>Up to 12 lines, shared by both lines. No screen for it: say “forget that”.</em></div>
      </div>
      <div className={s.memoryBody}>
        <ol className={s.thread} aria-label="Things said in the chat">
          {SAID.map((x, i) => (
            <li key={x.text}>
              <button type="button" className={`${s.msg} ${x.who === 'Inkling' ? s.msgInk : ''} ${i === at ? s.msgOn : ''} ${i > at ? s.msgLater : ''}`}
                aria-pressed={i === at} onClick={() => { setAuto(false); setAt(i); }}>
                <span className={s.who}>{x.who}</span>{x.text}
              </button>
            </li>
          ))}
        </ol>
        <div className={s.kept}>
          <span className={s.keptHead}>What Inkling keeps</span>
          <ul className={s.keptList} aria-live="polite">
            {list.length === 0 && <li className={s.keptEmpty}>Nothing yet</li>}
            {list.map((x) => <li key={x} className={before.includes(x) ? '' : s.keptNew}>{x}</li>)}
          </ul>
          <p className={`${s.why} ${said ? '' : s.whyIdle}`}>
            {said ? <><b>{changed ? 'Updated.' : 'Unchanged.'}</b> {said.why}</> : 'Tap a line, or let it play.'}
          </p>
        </div>
      </div>
      <p className={s.memoryFoot}>Rewritten by a call of its own after the answer has gone: every four messages, or at once when asked to remember or forget. It returns the whole list, so “forget” and “remember” are the same move. If the list comes back less than half as long and nobody said forget, it only adds.</p>
    </div>
  );
}

/* ───────────────────────── 3. Bring your own AI ───────────────────────── */

type Read = { term: string; definition: string; note: string; warn?: boolean };
const SAMPLES: { key: string; label: string; reply: string; cards: Read[]; message?: string }[] = [
  {
    key: 'json', label: 'JSON, as asked',
    reply: 'Here are your cards!\n```json\n{ "lesson": "Ordering food in Italy", "learning_mode": "language",\n  "cards": [{ "term": "il conto", "definition": "the bill",\n    "questions": [{ "type": "mcq", … }, { "type": "recall", … }] }, …] }\n```',
    cards: [
      { term: 'il conto', definition: 'the bill', note: 'Choice and recall questions' },
      { term: 'un tavolo per due', definition: 'a table for two', note: 'Choice and recall questions' },
      { term: 'senza glutine', definition: 'gluten-free', note: 'Choice and recall questions' },
    ],
  },
  {
    key: 'long', label: 'An option too long',
    reply: '```json\n{ "cards": [{ "term": "il coperto",\n  "questions": [{ "type": "mcq", "options": ["a charge per person for bread and the table setting, added to the bill", …] }] }, …] }\n```',
    cards: [
      { term: 'il coperto', definition: 'cover charge', note: 'Saved without questions: an option is longer than the screen shows (60)', warn: true },
      { term: 'la mancia', definition: 'the tip', note: 'Choice and recall questions' },
    ],
  },
  {
    key: 'table', label: 'A table',
    reply: '| Italian | English |\n|---|---|\n| il conto | the bill |\n| il cameriere | the waiter |\n| la carta dei vini | the wine list |',
    cards: [
      { term: 'il conto', definition: 'the bill', note: 'No questions: written straight as cards' },
      { term: 'il cameriere', definition: 'the waiter', note: 'No questions: written straight as cards' },
      { term: 'la carta dei vini', definition: 'the wine list', note: 'No questions: written straight as cards' },
    ],
  },
  {
    key: 'asks', label: 'Its questions to you',
    reply: 'Before I write them:\n1. Level: how much Italian do you know?\n2. Situation: restaurants only, or bars too?\n3. Size: how many cards?',
    cards: [],
    message: 'Your AI is asking you questions. Answer it there, then bring back the cards.',
  },
];

export function OwnAiImport() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [at, setAt] = useState(0);
  const [auto, setAuto] = useState(true);
  const [phase, setPhase] = useState<'paste' | 'read'>('read');
  useEffect(() => {
    if (!inView || !auto || calm()) return;
    const t = window.setTimeout(() => {
      if (phase === 'read') { setAt((a) => (a + 1) % SAMPLES.length); setPhase('paste'); } else setPhase('read');
    }, phase === 'paste' ? 1100 : 3600);
    return () => window.clearTimeout(t);
  }, [inView, auto, phase]);
  const sample = SAMPLES[at];
  const choose = (i: number) => { setAuto(false); setAt(i); setPhase('paste'); window.setTimeout(() => setPhase('read'), calm() ? 0 : 700); };

  return (
    <div ref={ref} className={s.own}>
      <ol className={s.ownSteps}>
        {['Copy the prompt', 'Ask your AI', 'Bring its reply back', 'Check and save'].map((t, i) => (
          <li key={t}><span>{i + 1}</span>{t}</li>
        ))}
      </ol>
      <div className={s.ownBody}>
        <div className={s.ownPick}>
          <span className={s.ownLabel}>What comes back from ChatGPT, Claude…</span>
          <div className={s.chips} role="tablist" aria-label="Kinds of reply">
            {SAMPLES.map((x, i) => (
              <CaseButton key={x.key} variant="tab" type="button" role="tab" aria-selected={i === at} className={`${s.chip} ${i === at ? s.chipOn : ''}`} onClick={() => choose(i)}>{x.label}</CaseButton>
            ))}
          </div>
          <pre className={s.reply}>{sample.reply}</pre>
        </div>
        <div className={s.ownScreen} data-phase={phase}>
          <div className={s.pasteBox}>
            <span className={s.pasteLabel}>Paste its reply</span>
            <span className={s.pasteText}>{phase === 'paste' ? sample.reply.split('\n')[0] : ''}</span>
          </div>
          {phase === 'read' && (
            sample.message
              ? <p className={s.asking}>{sample.message}</p>
              : (
                <ul className={s.readList}>
                  {sample.cards.map((card, i) => (
                    <li key={card.term + i} style={{ animationDelay: `${i * 90}ms` }}>
                      <span className={s.readNum}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={s.readText}>
                        <b>{card.term}</b>
                        <span className={s.readDef}>{card.definition}</span>
                        <span className={`${s.readNote} ${card.warn ? s.readWarn : ''}`}>{card.note}</span>
                      </span>
                      <Glyph name="delete" size={18} className={s.readBin} />
                    </li>
                  ))}
                </ul>
              )
          )}
        </div>
      </div>
      <p className={s.ownFoot}>Read wide, save strict: JSON first (the only shape that carries questions), then tables, then “term – meaning” lines. Every card is checked against the same rules as MemQ’s own tools before it is saved. Read on the phone; no model of ours is called.</p>
    </div>
  );
}

/* ───────────────────────── 4. One monthly allowance ───────────────────────── */

const SPEND = [
  { key: 'chat', name: 'Chat message', cost: 1 },
  { key: 'card', name: 'Card rewritten', cost: 1 },
  { key: 'set', name: 'Set of cards', cost: 3 },
  { key: 'pdf', name: 'PDF read', cost: 10 },
];
const LIMIT = 50;

/** The app's credits line and what each thing costs: spend from a free month. */
export function CreditsMeter() {
  const [used, setUsed] = useState<{ name: string; cost: number; id: number }[]>([]);
  const id = useRef(0);
  const spent = used.reduce((n, x) => n + x.cost, 0);
  const left = LIMIT - spent;
  const low = left <= LIMIT * 0.2;
  const out = left <= 0;
  const spend = (name: string, cost: number) => { id.current += 1; setUsed((u) => [{ name, cost, id: id.current }, ...u]); };
  return (
    <div className={`${s.credits} ${s.creditsMeterOnly}`}>
      <div className={s.meterCard}>
        <div className={s.meterHead}>
          <span className={s.meterLine}>{out ? 'No AI credits left · back Dec 1' : `${left} AI ${left === 1 ? 'credit' : 'credits'} left this month`}</span>
          {low && <span className={s.seePro}>See Pro</span>}
        </div>
        <span className={s.meter} role="meter" aria-label="AI credits left" aria-valuemin={0} aria-valuemax={LIMIT} aria-valuenow={left}>
          <span style={{ width: `${(left / LIMIT) * 100}%` }} className={low ? s.meterLow : ''} />
        </span>
        <div className={s.spendGrid}>
          {SPEND.map((x) => (
            <button key={x.key} type="button" className={s.spend} disabled={x.cost > left} onClick={() => spend(x.name, x.cost)}>
              <span>{x.name}</span><b>{x.cost > left && !out ? `needs ${x.cost}` : `${x.cost}`}</b>
            </button>
          ))}
        </div>
        {out && (
          <div className={s.outBox}>
            <b>You have used this month’s AI credits</b>
            <span>Two ways on: your own AI, free, or Pro.</span>
            <span className={s.outBtns}><em>Use my own AI</em><em>See Pro</em></span>
          </div>
        )}
        <ol className={s.history}>
          {used.slice(0, 3).map((x) => <li key={x.id}><span>{x.name}</span><span>−{x.cost}</span></li>)}
        </ol>
        {used.length > 0 && <CaseButton variant="text" type="button" className={s.reset} onClick={() => setUsed([])}>Start the month again</CaseButton>}
      </div>
    </div>
  );
}

/* ───────────────────────── 5. Seven limits against one allowance ───────────────────────── */

type Act = 'chat' | 'set' | 'practice' | 'pdf' | 'ask' | 'card';
const ACTS: Record<Act, { name: string; cost: number; tone: string }> = {
  chat: { name: 'Chat message', cost: 1, tone: '#9b7be0' },
  ask: { name: 'Question about a card', cost: 1, tone: '#b9a1ee' },
  card: { name: 'Card rewritten', cost: 1, tone: '#c9b8f3' },
  set: { name: 'Set of cards', cost: 3, tone: '#6c3cbc' },
  pdf: { name: 'PDF read', cost: 10, tone: '#4b2c78' },
  practice: { name: 'Practice round', cost: 0, tone: '#cfe9da' },
};
/** One month of a free account, the same taps both ways. */
const MONTH: Act[] = ['chat', 'set', 'practice', 'pdf', 'ask', 'card', 'set', 'practice', 'pdf', 'chat'];
/** The seven server limits before credits, free tier, and which taps each counted. */
const LIMITS: { name: string; clock: 'day' | 'month' | 'ever'; of: number; counts: (a: Act) => number }[] = [
  { name: 'Lessons generated', clock: 'month', of: 5, counts: (a) => (a === 'set' ? 1 : 0) },
  { name: 'Cards filled', clock: 'day', of: 30, counts: (a) => (a === 'card' ? 1 : 0) },
  { name: 'Question sets', clock: 'day', of: 20, counts: (a) => (a === 'practice' ? 1 : 0) },
  { name: 'Answers marked', clock: 'day', of: 200, counts: (a) => (a === 'practice' ? 10 : 0) },
  { name: 'PDFs', clock: 'ever', of: 3, counts: (a) => (a === 'pdf' ? 1 : 0) },
  { name: 'Chat to make cards', clock: 'month', of: 30, counts: (a) => (a === 'chat' ? 1 : 0) },
  { name: 'Chat about cards', clock: 'month', of: 60, counts: (a) => (a === 'ask' ? 1 : 0) },
];

/** The same month of taps counted both ways: seven meters on three clocks, or one number. */
export function CreditsCompare() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [n, setN] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.3 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!on) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = window.setTimeout(() => setN(MONTH.length), 0);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setN((x) => (x >= MONTH.length ? 0 : x + 1)), n >= MONTH.length ? 2600 : n === 0 ? 700 : 950);
    return () => window.clearTimeout(t);
  }, [on, n]);
  const done = MONTH.slice(0, n);
  const last = n > 0 ? MONTH[n - 1] : null;
  const spent = done.reduce((t, a) => t + ACTS[a].cost, 0);

  return (
    <div ref={ref} className={s.compare} role="img" aria-label="The same month of taps counted two ways: seven limits on three different clocks, against one monthly number of 50 credits where practice costs nothing.">
      <ol className={s.taps}>
        {MONTH.map((a, i) => (
          <li key={i} className={`${i < n ? s.tapOn : ''} ${i === n - 1 ? s.tapNow : ''}`} style={{ ['--tone' as string]: ACTS[a].tone }}>{ACTS[a].name}</li>
        ))}
      </ol>
      <div className={s.sides}>
        <section className={s.side}>
          <h4>Before: seven limits</h4>
          <ul className={s.limits}>
            {LIMITS.map((l) => {
              const used = done.reduce((t, a) => t + l.counts(a), 0);
              const hit = last ? l.counts(last) > 0 : false;
              return (
                <li key={l.name} className={hit ? s.limitHit : ''}>
                  <span className={s.limitName}>{l.name}</span>
                  <em className={s[`clock_${l.clock}`]}>{l.clock === 'ever' ? 'for ever' : `a ${l.clock}`}</em>
                  <span className={s.limitBar}><span style={{ width: `${Math.min(100, (used / l.of) * 100)}%` }} /></span>
                  <span className={s.limitNum}>{used}/{l.of}</span>
                </li>
              );
            })}
          </ul>
          <p className={s.sideSum}>Seven numbers on three clocks. Practice counts too.</p>
        </section>
        <section className={`${s.side} ${s.sideAfter}`}>
          <h4>After: one allowance</h4>
          <div className={s.oneHead}><b>{50 - spent}</b> of 50 credits left · back on the 1st</div>
          <div className={s.oneBar} aria-hidden="true">
            {done.map((a, i) => ACTS[a].cost > 0 && (
              <span key={i} className={i === n - 1 ? s.segNow : ''} style={{ width: `${(ACTS[a].cost / 50) * 100}%`, background: ACTS[a].tone }} />
            ))}
          </div>
          <ul className={s.costs}>
            {(['chat', 'set', 'pdf', 'practice'] as Act[]).map((a) => (
              <li key={a} className={last && (last === a || (a === 'chat' && (last === 'ask' || last === 'card'))) ? s.costHit : ''}>
                <i style={{ background: ACTS[a].tone }} />
                <span>{a === 'chat' ? 'Message or rewrite' : ACTS[a].name}</span>
                <b>{ACTS[a].cost === 0 ? 'free' : ACTS[a].cost}</b>
              </li>
            ))}
          </ul>
          <p className={s.sideSum}>One number, weighted by cost. Practice is never on it.</p>
        </section>
      </div>
    </div>
  );
}
