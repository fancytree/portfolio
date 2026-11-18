'use client';

/*
 * The in-app AI chat, rebuilt at the app's own 402 × 874 layout from
 * components/chat (ChatShell, CardDrafts, LessonTarget, StartPractice, AnswerActions)
 * and Today's two entry cards. Replies are canned demonstration content; the
 * structure, order and behaviour follow the app: starters fill the box rather than
 * send, an answer stops without offering cards, Make cards sends at once, Keep is a
 * turn of its own answered by the app, and a practice round is offered as a card.
 */

import Image from 'next/image';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { geistSans, oswald } from '@/app/fonts';
import { CaseButton } from '../../components/case-kit/CaseButton';
import showcase from '../def-erp-kit/DesignSystemShowcase.module.css';
import { useAutoplay, type Helpers, type Scripted } from './autoplay';
import { ICONS, type IconName } from './memqIcons';
import { PhoneFrame } from './MemQPractice';
import { StatusBar, useScale } from './MemQQuiz';
import q from './MemQQuiz.module.css';
import c from './MemQChat.module.css';

export function Glyph({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: ICONS[name] }} />;
}

/* ───────────────────────── Demonstration content ───────────────────────── */

const QUESTION = 'Explain how spaced repetition works';
const ANSWER = [
  'Spaced repetition brings a fact back just before you would forget it. Each time you recall it, the gap grows: a day, then three, then a week.',
  'It works because recalling is harder than rereading, and that effort is what makes it stick. A miss shortens the gap again, so weak cards come round sooner.',
];
const DRAFTS = [
  { id: 'a', term: 'Spaced repetition', definition: 'Reviewing at growing gaps, just before you would forget.' },
  { id: 'b', term: 'Review interval', definition: 'The wait before a card comes back.' },
  { id: 'c', term: 'Active recall', definition: 'Pulling an answer from memory instead of rereading it.' },
  { id: 'd', term: 'Forgetting curve', definition: 'How fast a memory fades when nothing asks for it.' },
  { id: 'e', term: 'Recall difficulty', definition: 'The effort of remembering, which makes the memory stronger.' },
  { id: 'f', term: 'Interleaving', definition: 'Mixing topics in one sitting instead of blocking them.' },
];
/** The person's lessons, as on the Today screen above. */
const LESSONS = [
  { name: 'How the brain learns', cover: 'peach' as const },
  { name: 'Everyday Italian', cover: 'lime' as const },
];
const CREATE_STARTERS = ['Teach me 10 phrases for ordering food', QUESTION, 'What am I already learning?'];
const PRACTICE_STARTERS = ['Quiz me on what is due today', 'Why do I forget things soon after learning them?', 'How do I remember vocabulary better?'];
const PRACTICE_ASK = 'Quiz me on Everyday Italian';

type Part = { kind: 'text'; text: string; shown: number } | { kind: 'drafts' } | { kind: 'target' } | { kind: 'practice' };
/** What the turn is doing while nothing is on screen yet: its steps, and how far it has got. */
type Status = { steps: string[]; at: number };
type Turn = { id: number; asked: string; parts: Part[]; status: Status | null; done: boolean; local?: boolean };

/* Each kind of request waits through its own steps, named for the work actually under way,
   so a question, a set of cards and a practice round never look like the same spinner. */
const STEPS = {
  explain: ['Reading your question', 'Writing the answer'],
  cards: ['Reading the answer above', 'Looking through your lessons', 'Writing the cards', 'Leaving out ones you have'],
  practice: ['Finding the lesson you named', 'Counting what is due'],
} as const;
const STEP_MS = { explain: 520, cards: 620, practice: 520 } as const;
type Screen = 'today' | 'create' | 'practice';
export type Start = 'today' | 'empty' | 'answered' | 'drafts' | 'practice' | 'offered';

const answered = (id: number): Turn => ({ id, asked: QUESTION, parts: ANSWER.map((text) => ({ kind: 'text', text, shown: text.split(' ').length })), status: null, done: true });
const drafted = (id: number): Turn => ({ id, asked: 'Make cards from this', parts: [{ kind: 'drafts' }], status: null, done: true });

function startState(start: Start): { screen: Screen; turns: Turn[] } {
  if (start === 'today') return { screen: 'today', turns: [] };
  if (start === 'practice') return { screen: 'practice', turns: [] };
  // A practice offer made in words, and the round that arrives once the person says yes.
  if (start === 'offered') return { screen: 'practice', turns: [
    { id: 1, asked: 'Hi Inkling!', parts: [{ kind: 'text', text: 'Hi! You have 8 Everyday Italian cards due. Want a quick round?', shown: 12 }], status: null, done: true },
    { id: 2, asked: 'Yes, let’s do it', parts: [{ kind: 'practice' }], status: null, done: true },
  ] };
  if (start === 'answered') return { screen: 'create', turns: [answered(1)] };
  if (start === 'drafts') return { screen: 'create', turns: [answered(1), drafted(2)] };
  return { screen: 'create', turns: [] };
}

/* ───────────────────────── Small parts ───────────────────────── */

/** A lipped button: a face on a darker shell, sunk into it while pressed. */
function Button({ label, onClick, full, disabled, loading, variant = 'primary' }: { label: string; onClick?: () => void; full?: boolean; disabled?: boolean; loading?: boolean; variant?: 'primary' | 'secondary' }) {
  return (
    <button type="button" className={`${c.btn} ${variant === 'secondary' ? c.btnSecondary : ''} ${full ? c.btnFull : ''}`} disabled={disabled || loading} onClick={onClick}>
      <span className={c.btnFace}>{loading ? <span className={c.spinner} aria-label="Saving" /> : label}</span>
    </button>
  );
}

function Cover({ kind }: { kind: 'peach' | 'lime' }) {
  return (
    <span className={`${c.cover} ${kind === 'peach' ? c.coverPeach : c.coverLime}`} aria-hidden="true">
      <Glyph name={kind === 'peach' ? 'layers' : 'globe'} size={22} />
    </span>
  );
}

/** One line, in the one place: each step replaces the last, so the wait says what is happening now. */
function Waiting({ status }: { status: Status }) {
  const step = status.steps[status.at];
  return (
    <div className={c.waiting} aria-live="polite">
      <span className={c.spinner} aria-hidden="true" />
      <span key={step} className={c.waitingText}>{step}…</span>
    </div>
  );
}

/* ───────────────────────── Interfaces the model can put up ───────────────────────── */

/** Width the deck is built from: the screen, less the page's and the card's padding. */
const ROOM = 402 - 32 - 32;
const BOARD_PAD = 12;
const INNER = ROOM - BOARD_PAD * 2;
const CARD_W = INNER * 0.72, CARD_H = CARD_W / 0.72;
const SLOTS = [
  { rise: 0, slip: 0, tilt: 0, shrink: 0, face: '#ffffff' },
  { rise: 9, slip: -7, tilt: -4.5, shrink: 0.03, face: '#f7f5fa' },
  { rise: 17, slip: 6, tilt: 3, shrink: 0.06, face: '#e5dfeb' },
  { rise: 24, slip: -2, tilt: -6.5, shrink: 0.09, face: '#e5dfeb' },
];
const LIFT = 24 + 8;
const BOARD_H = LIFT + CARD_H + BOARD_PAD;
const PAGER = 32;
const AWAY = 420, THROW = 90, PULL = 140;

function CardDrafts({ picked, setPicked, deck, setDeck, sent, onKeep }: {
  picked: string[]; setPicked: (p: string[]) => void; deck: boolean; setDeck: (d: boolean) => void; sent: boolean; onKeep: () => void;
}) {
  const [at, setAt] = useState(0);
  const all = picked.length === DRAFTS.length;
  const toggle = (id: string) => { if (!sent) setPicked(picked.includes(id) ? picked.filter((p) => p !== id) : [...picked, id]); };
  return (
    <div className={c.card} data-drafts>
      <div className={c.draftHead}>
        <span className={c.drafted}>{DRAFTS.length} cards drafted</span>
        <button type="button" className={c.all} onClick={() => !sent && setPicked(all ? [] : DRAFTS.map((d) => d.id))}>{all ? 'Clear all' : 'Select all'}</button>
        <button type="button" className={c.switch} aria-label={deck ? 'Show them as a list' : 'Show them as a deck'} onClick={() => setDeck(!deck)}>
          <Glyph name={deck ? 'list' : 'layers'} size={18} />
        </button>
      </div>
      {deck
        ? <Deck at={at} setAt={setAt} picked={picked} onToggle={toggle} />
        : (
          <div className={c.rows} style={{ height: BOARD_H + PAGER }} data-scroll-none>
            {DRAFTS.map((card) => {
              const on = picked.includes(card.id);
              return (
                <button key={card.id} type="button" role="checkbox" aria-checked={on} className={c.draftRow} onClick={() => toggle(card.id)}>
                  <span className={c.boxLine}><span className={`${c.box} ${on ? c.boxOn : ''}`}>{on && <Glyph name="check" size={13} />}</span></span>
                  <span className={c.rowText}>
                    <span className={`${c.term} ${on ? '' : c.dim}`}>{card.term}</span>
                    <span className={`${c.definition} ${on ? '' : c.dim}`}>{card.definition}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      <Button full label={picked.length === 1 ? 'Keep 1 card' : `Keep ${picked.length} cards`} disabled={!picked.length || sent} onClick={onKeep} />
    </div>
  );
}

/** The deck: the front card follows the finger and is thrown to the back; the others deal forward. */
function Deck({ at, setAt, picked, onToggle }: { at: number; setAt: (n: number) => void; picked: string[]; onToggle: (id: string) => void }) {
  const count = DRAFTS.length;
  const [slide, setSlide] = useState(0);
  const [moving, setMoving] = useState<'drag' | 'settle' | 'throw' | 'none'>('none');
  const grab = useRef<{ x: number; scale: number; dx: number; dragged: boolean } | null>(null);
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const deal = Math.min(1, Math.abs(slide) / PULL);

  const down = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    grab.current = { x: e.clientX, scale: r.width / CARD_W, dx: 0, dragged: false };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* a scripted pointer has nothing to capture */ }
    setMoving('drag');
  };
  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = grab.current;
    if (!g) return;
    g.dx = (e.clientX - g.x) / g.scale;
    if (Math.abs(g.dx) > 8) g.dragged = true;
    if (g.dragged) setSlide(g.dx);
  };
  const up = () => {
    const g = grab.current;
    grab.current = null;
    if (!g) return;
    if (!g.dragged) { setMoving('none'); setSlide(0); onToggle(DRAFTS[at].id); return; }
    if (Math.abs(g.dx) < THROW) { setMoving('settle'); setSlide(0); return; }
    setMoving('throw');
    setSlide(Math.sign(g.dx) * AWAY);
    timer.current = window.setTimeout(() => { setMoving('none'); setSlide(0); setAt((at + 1) % count); }, 190);
  };

  const transition = moving === 'drag' || moving === 'none' ? 'none' : moving === 'throw' ? 'transform .18s ease-in, background-color .18s' : 'transform .38s cubic-bezier(.3,1.5,.5,1), background-color .38s';
  return (
    <div className={c.deckWrap}>
      <div className={c.tray} style={{ height: BOARD_H }}>
        <div className={c.frame} style={{ width: CARD_W, height: CARD_H }}>
          {[3, 2, 1].map((depth) => {
            const from = SLOTS[depth], to = SLOTS[depth - 1];
            const k = (a: number, b: number) => a + (b - a) * deal;
            return (
              <span key={depth} className={c.under} style={{
                background: deal > 0.5 ? to.face : from.face,
                opacity: depth === 3 ? deal : 1,
                transform: `translate(${k(from.slip, to.slip)}px, ${-k(from.rise, to.rise)}px) rotate(${k(from.tilt, to.tilt)}deg) scale(${1 - k(from.shrink, to.shrink)})`,
                transition,
              }} />
            );
          })}
          {(() => {
            const card = DRAFTS[at];
            const kept = picked.includes(card.id);
            return (
              <div role="checkbox" aria-checked={kept} aria-label={`${card.term}: ${card.definition}`} tabIndex={0} data-front
                className={`${c.face} ${kept ? '' : c.faceOff}`}
                style={{ transform: `translateX(${slide}px) rotate(${(slide / AWAY) * 8}deg)`, transition }}
                onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { grab.current = null; setMoving('settle'); setSlide(0); }}>
                <span className={c.headRow}>
                  <span className={`${c.box} ${kept ? c.boxOn : ''}`}>{kept && <Glyph name="check" size={13} />}</span>
                  <span className={c.index}>{String(at + 1).padStart(2, '0')}</span>
                </span>
                <span className={c.middle}><span className={`${c.deckTerm} ${kept ? '' : c.dim}`}>{card.term}</span></span>
                <span className={`${c.deckDefinition} ${kept ? '' : c.dim}`}>{card.definition}</span>
              </div>
            );
          })()}
        </div>
      </div>
      <div className={c.pager}>
        <button type="button" aria-label="Previous card" onClick={() => setAt((at - 1 + count) % count)}><Glyph name="chevronLeft" size={20} /></button>
        <span>{at + 1} of {count}</span>
        <button type="button" aria-label="Next card" onClick={() => setAt((at + 1) % count)}><Glyph name="chevronRight" size={20} /></button>
      </div>
    </div>
  );
}

/** Where the kept cards go: one box that is both the model's suggestion and a search of your lessons. */
function LessonTarget({ count, names }: { count: number; names: string[] }) {
  const [name, setName] = useState(LESSONS[0].name);
  const [chosen, setChosen] = useState<string | null>(LESSONS[0].name);
  const [looking, setLooking] = useState(false);
  const [about, setAbout] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const typed = name.trim();
  const matches = typed && !chosen ? LESSONS.filter((l) => l.name.toLowerCase().includes(typed.toLowerCase()) || typed.toLowerCase().split(/\s+/).some((w) => w.length > 2 && l.name.toLowerCase().includes(w))) : [];
  const open = looking && matches.length > 0;
  const keep = () => { setSaving(true); timer.current = window.setTimeout(() => { setSaving(false); setSaved(typed); }, 700); };

  if (saved) {
    return (
      <div className={c.card} data-saved>
        <p className={c.kept}>{count} cards kept in <b>{saved}</b></p>
        <p className={c.keptList}>{names.join(' · ')}</p>
        <div><Button label="Open the lesson" /></div>
      </div>
    );
  }
  return (
    <div className={c.card}>
      <label className={c.field}>
        <span className={c.fieldLabel}>Lesson</span>
        <span className={c.combo}>
          <span className={c.inputBox}>
            <input className={c.input} value={name} placeholder="Find one, or name a new one" aria-label="Lesson"
              onChange={(e) => { setName(e.target.value); setChosen(null); setLooking(true); }} onFocus={() => setLooking(true)} />
            {name && <button type="button" className={c.clear} aria-label="Clear" onClick={() => { setName(''); setChosen(null); setLooking(true); }}><Glyph name="close" size={18} /></button>}
          </span>
          {open && (
            <span className={c.menu} role="listbox">
              {matches.map((l) => (
                <button key={l.name} type="button" role="option" aria-selected={false} className={c.hit}
                  onPointerDown={() => { setChosen(l.name); setName(l.name); setLooking(false); }}>{l.name}</button>
              ))}
            </span>
          )}
        </span>
        {!open && <span className={c.hint}>{chosen ? 'Adding to a lesson you already have.' : 'A new lesson, unless you pick one of yours.'}</span>}
      </label>
      {!chosen && (
        <label className={c.field}>
          <span className={c.fieldLabel}>What it is about</span>
          <span className={c.inputBox}><input className={c.input} value={about} placeholder="Optional" onChange={(e) => setAbout(e.target.value)} /></span>
        </label>
      )}
      <Button full disabled={!typed} loading={saving} onClick={keep}
        label={chosen ? `Add to ${chosen}` : `Make the lesson and keep ${count} cards`} />
    </div>
  );
}

/** A practice round, said in numbers the app already has. */
function StartPractice() {
  return (
    <div className={c.card} data-practice-card>
      <div className={c.practiceHead}>
        <Cover kind="lime" />
        <span className={c.practiceCopy}>
          <span className={c.practiceName}>Everyday Italian</span>
          <span className={c.practiceFacts}>24 cards  ·  8 to review</span>
        </span>
      </div>
      <span className={c.practiceTrack} role="progressbar" aria-label="67 percent mastered" aria-valuemin={0} aria-valuemax={100} aria-valuenow={67}><span style={{ width: '67%' }} /></span>
      <Button full label="Start practice" />
    </div>
  );
}

/* ───────────────────────── The phone ───────────────────────── */

function AnswerActions({ onAgain, onCards, cards }: { onAgain: () => void; onCards: () => void; cards: boolean }) {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  return (
    <div className={c.actions}>
      {/* One 18-point slot each, the glyph sized by eye inside it: a solid sheet reads larger
          than an outline ring, and a wide mark shorter than a tall one, at the same number. */}
      <button type="button" aria-label="Copy" className={copied ? c.actionOn : undefined} onClick={() => { setCopied(true); later(() => setCopied(false), 1600); }}>
        <Glyph name={copied ? 'check' : 'copy'} size={copied ? 17 : 15} />
      </button>
      <button type="button" aria-label="Read aloud" className={speaking ? c.speaking : undefined} onClick={() => { setSpeaking(true); later(() => setSpeaking(false), 3000); }}>
        <Glyph name="volumeOn" size={18} className={c.speakerGlyph} />
      </button>
      <button type="button" aria-label="Ask again" onClick={onAgain}><Glyph name="replay" size={17} /></button>
      {cards && <button type="button" aria-label="Make cards" onClick={onCards}><Glyph name="layers" size={18} /></button>}
      {copied && <span className={c.copied}>Copied</span>}
    </div>
  );
}

/** `bare`: just the 402 × 874 screen, no device frame, for a zoomed figure to crop. */
export function ChatPhone({ start, bare = false }: { start: Start; bare?: boolean }) {
  const { ref, scale } = useScale();
  const initial = startState(start);
  const [screen, setScreen] = useState<Screen>(initial.screen);
  const [entered, setEntered] = useState(false);
  const [turns, setTurns] = useState<Turn[]>(initial.turns);
  const [draft, setDraft] = useState('');
  const [picked, setPicked] = useState<string[]>(start === 'drafts' ? ['a', 'b', 'c', 'd', 'f'] : DRAFTS.map((d) => d.id));
  const [deck, setDeck] = useState(false);
  const [sent, setSent] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLTextAreaElement>(null);
  const timers = useRef<number[]>([]);
  const nextId = useRef(10);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: start === 'drafts' && turns.length === 2 ? 'auto' : 'smooth' });
  }, [turns, start]);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  const patch = (id: number, fn: (t: Turn) => Turn) => setTurns((all) => all.map((t) => (t.id === id ? fn(t) : t)));
  const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Stream canned paragraphs in, word by word, the way the answer arrives. */
  const stream = (id: number, paragraphs: string[]) => {
    patch(id, (t) => ({ ...t, status: null, parts: paragraphs.map((text) => ({ kind: 'text', text, shown: reduce() ? text.split(' ').length : 0 })) }));
    if (reduce()) { patch(id, (t) => ({ ...t, done: true })); return; }
    const words = paragraphs.map((p) => p.split(' ').length);
    let ms = 0;
    words.forEach((n, pi) => {
      for (let w = 1; w <= n; w += 1) {
        ms += 34;
        later(() => patch(id, (t) => ({ ...t, parts: t.parts.map((p, i) => (i === pi && p.kind === 'text' ? { ...p, shown: w } : p)) })), ms);
      }
      ms += 120;
    });
    later(() => patch(id, (t) => ({ ...t, done: true })), ms + 200);
  };

  const ask = (text: string) => {
    const said = text.trim();
    if (!said) return;
    const id = nextId.current++;
    setDraft('');
    const practice = screen === 'practice';
    const cards = /card/i.test(said) && !practice;
    const round = practice && /quiz|practi[sc]e|test/i.test(said);
    const kind = cards ? 'cards' : round ? 'practice' : 'explain';
    const steps = [...STEPS[kind]];
    setTurns((all) => [...all, { id, asked: said, parts: [], status: { steps, at: 0 }, done: false }]);
    // Walk the steps, then hand over to whatever the turn ends in.
    const each = reduce() ? 0 : STEP_MS[kind];
    steps.forEach((_, i) => { if (i) later(() => patch(id, (t) => (t.status ? { ...t, status: { ...t.status, at: i } } : t)), each * i); });
    const end = each * steps.length;
    if (cards) {
      setPicked(DRAFTS.map((d) => d.id)); setSent(false); setDeck(false);
      later(() => patch(id, (t) => ({ ...t, status: null, parts: [{ kind: 'drafts' }], done: true })), end);
    } else if (round) {
      later(() => patch(id, (t) => ({ ...t, status: null, parts: [{ kind: 'practice' }], done: true })), end);
    } else if (practice) {
      later(() => stream(id, ['Mostly because nothing asked for it again. A memory that is never recalled fades within days; one that is pulled back just as it slips lasts weeks longer each time.']), end);
    } else {
      later(() => stream(id, ANSWER), end);
    }
  };
  const again = (id: number) => {
    const turn = turns.find((t) => t.id === id);
    if (!turn) return;
    setTurns((all) => all.slice(0, all.findIndex((t) => t.id === id)));
    later(() => ask(turn.asked), 60);
  };
  const keep = () => {
    setSent(true);
    const id = nextId.current++;
    setTurns((all) => [...all, { id, asked: picked.length === 1 ? 'Keep 1 card' : `Keep ${picked.length} cards`, parts: [{ kind: 'target' }], status: null, done: true, local: true }]);
  };
  const open = (s: Screen) => { setScreen(s); setEntered(true); setTurns([]); setDraft(''); };
  const close = () => { setScreen('today'); setEntered(false); setTurns([]); };
  const fill = (text: string) => { setDraft(text); requestAnimationFrame(() => box.current?.focus({ preventScroll: true })); };

  const chatting = screen !== 'today';
  const started = turns.length > 0;
  const keptNames = DRAFTS.filter((d) => picked.includes(d.id)).map((d) => d.term);

  const render = (turn: Turn, part: Part, i: number): ReactNode => {
    if (part.kind === 'text') return <p key={i} className={c.said}>{part.text.split(' ').slice(0, part.shown).join(' ')}</p>;
    if (part.kind === 'drafts') return <CardDrafts key={i} picked={picked} setPicked={setPicked} deck={deck} setDeck={setDeck} sent={sent} onKeep={keep} />;
    if (part.kind === 'target') return <LessonTarget key={i} count={picked.length} names={keptNames} />;
    return <StartPractice key={i} />;
  };

  return (
    <Frame bare={bare}>
      <div ref={ref} className={q.viewport} data-chat-root>
        <div className={`${q.app} ${c.app} ${geistSans.variable} ${oswald.variable}`} style={{ transform: `scale(${scale})` }}>
          {/* Today, as in the app: the hero and stats from the 2.0 capture, then the two entry cards and the lessons. */}
          <div className={c.today} aria-hidden={chatting}>
            <div className={c.todayTop}>
              <div className={c.todayStatus}><StatusBar /></div>
              <Image src="/img/memq-v2/screen-today.webp" alt="" width={402} height={873} className={c.todayShot} style={{ width: 402, height: 'auto' }} />
            </div>
            <div className={c.askRow}>
              <button type="button" className={`${c.ask} ${c.askLearn}`} onClick={() => open('create')}>
                <span className={c.askFace}>
                  <Glyph name="chatSparkle" size={30} />
                  <span className={c.askTitle}>Learn something</span>
                  <span className={c.askHint}>Explained, then kept</span>
                </span>
              </button>
              <button type="button" className={`${c.ask} ${c.askAsk}`} onClick={() => open('practice')}>
                <span className={c.askFace}>
                  <Glyph name="chatQuery" size={30} />
                  <span className={c.askTitle}>Ask a question</span>
                  <span className={c.askHint}>About your cards</span>
                </span>
              </button>
            </div>
            <div className={c.lessonsCard}>
              <div className={c.lessonsHead}><span>Continue Learning</span><span className={c.seeAll}>See All ›</span></div>
              {LESSONS.map((l, i) => (
                <div key={l.name} className={c.lessonRow}>
                  <Cover kind={l.cover} />
                  <span className={c.lessonCopy}>
                    <span className={c.lessonName}>{l.name}</span>
                    <span className={c.lessonFacts}>{i === 0 ? '72% · 5 cards remaining' : '67% · 8 cards remaining'}</span>
                    <span className={c.lessonTrack}><span style={{ width: i === 0 ? '72%' : '67%' }} /></span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* The chat comes up from the bottom and closes with a cross: you step in and leave. */}
          {chatting && (
            <div className={`${c.chat} ${entered ? c.rise : ''}`}>
              <StatusBar />
              <div className={c.topBar}>
                <button type="button" className={c.close} aria-label="Close" onClick={close}><Glyph name="close" size={22} /></button>
                <span className={c.topTitle}>{screen === 'create' ? 'Learn something' : 'Ask a question'}</span>
                {started
                  ? <button type="button" className={c.round} aria-label="Clear conversation" onClick={() => setTurns([])}><Glyph name="delete" size={20} /></button>
                  : <span className={c.slot} />}
              </div>
              <div ref={scroller} className={c.scroll} data-scroll>
                <div className={c.content}>
                  {!started && (
                    <p className={c.opening}>{screen === 'create'
                      ? 'What do you want to learn? Ask me about it and I’ll explain — then we can turn it into cards if it is worth keeping.'
                      : 'Ask about anything you are learning — what a card means, or why an answer was not the one expected.'}</p>
                  )}
                  {turns.map((turn) => (
                    <div key={turn.id} className={c.turn}>
                      <div className={c.asked}>{turn.asked}</div>
                      {turn.status && <Waiting status={turn.status} />}
                      {turn.parts.map((part, i) => render(turn, part, i))}
                      {turn.done && turn.parts.some((p) => p.kind === 'text') && (
                        <AnswerActions cards={screen === 'create'} onAgain={() => again(turn.id)} onCards={() => ask('Make cards from this')} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Ways in, not a menu: once one is in the box (or anything is typed) they step aside. */}
              {!started && !draft.trim() && (
                <div className={c.starters}>
                  {(screen === 'create' ? CREATE_STARTERS : PRACTICE_STARTERS).map((s) => (
                    <button key={s} type="button" className={c.starter} onClick={() => fill(s)}><span>{s}</span></button>
                  ))}
                </div>
              )}
              <div className={c.bar}>
                <div className={c.boxRow}>
                  <span className={c.add} aria-hidden="true"><Glyph name="plus" size={28} /></span>
                  <textarea ref={box} rows={1} className={c.box2} value={draft} placeholder={screen === 'create' ? 'What do you want to learn?' : 'Ask about a card'}
                    onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(draft); } }} />
                  <button type="button" className={c.send} aria-label="Send" disabled={!draft.trim()} onClick={() => ask(draft)}>
                    <span className={c.sendFace}><Glyph name="arrowUp" size={20} /></span>
                  </button>
                </div>
              </div>
            </div>
          )}
          <span className={q.homeIndicator} />
        </div>
      </div>
    </Frame>
  );
}

function Frame({ bare, children }: { bare: boolean; children: ReactNode }) {
  return bare ? <div className={c.bare}>{children}</div> : <PhoneFrame className={q.showPhone}>{children}</PhoneFrame>;
}

/* ───────────────────────── Auto-played walkthrough ───────────────────────── */

type Item = Scripted & { title: string; tag: string; lead: string; body: string; start: Start };
const btn = (h: Helpers, text: string) => h.find('button', text);

const ITEMS: Item[] = [
  {
    title: 'Two doors', tag: 'Today', start: 'today', seconds: 7,
    lead: 'Where you tap is what you mean.',
    body: 'Not one chat that guesses. Learn something explains, then can write cards; Ask a question is about your cards and ends in a round. Each line knows its tools, and what a message costs, before the model runs.',
    script: async (h) => {
      await h.wait(900);
      await h.click(btn(h, 'Learn something'));
      await h.wait(1800);
    },
  },
  {
    title: 'Explain first', tag: 'Learn', start: 'empty', seconds: 14,
    lead: 'A question gets an answer, and only that.',
    body: 'A starter fills the box instead of sending: a suggestion is a draft. While it works it says what it is doing, step by step. The answer is short, plain text, and stops; no “shall I make cards?” attached. Under it, four quiet marks: copy, read aloud, ask again, make cards.',
    script: async (h) => {
      await h.wait(700);
      await h.click(btn(h, QUESTION));
      await h.wait(700);
      await h.click(h.find('[aria-label="Send"]'));
      await h.wait(4600);
      await h.click(h.find('[aria-label="Read aloud"]'));
      await h.wait(1400);
    },
  },
  {
    title: 'Cards when asked', tag: 'Learn', start: 'answered', seconds: 18,
    lead: 'One tap, one model call, the cards on screen.',
    body: 'Make cards sends at once, and the wait names its own steps: reading the answer, your lessons, writing, leaving out cards you already have. The drafts come as a list to tick, or a deck to read card by card. Throw the front card and it goes to the back.',
    script: async (h) => {
      await h.wait(600);
      await h.click(h.find('[aria-label="Make cards"]'));
      await h.wait(3300);
      await h.click(h.find('[role="checkbox"]', 'Recall difficulty'));
      await h.wait(500);
      await h.click(h.find('[aria-label="Show them as a deck"]'));
      await h.wait(900);
      await h.drag(h.find('[data-front]'), 150);
      await h.wait(600);
      await h.drag(h.find('[data-front]'), -150);
      await h.wait(900);
    },
  },
  {
    title: 'Then, where', tag: 'Learn', start: 'drafts', seconds: 11,
    lead: 'Keep is a turn of its own.',
    body: 'Pressing Keep is something you said, so where the cards go is the next turn, put up by the app with no model call. The model’s guess is the box’s first value; type in it to search your lessons, or name a new one.',
    script: async (h) => {
      await h.wait(600);
      await h.click(btn(h, 'Keep 5 cards'));
      await h.wait(1300);
      await h.click(btn(h, 'Add to How the brain learns'));
      await h.wait(2200);
    },
  },
  {
    title: 'Ask, then practise', tag: 'Ask', start: 'practice', seconds: 11,
    lead: 'A round, said in numbers.',
    body: 'Say you want to practise and you get that round as a card: the lesson, its cards, what is due, the progress, then the button. The numbers are the app’s own, never the model’s; the label is written by the app.',
    script: async (h) => {
      await h.wait(700);
      const box = h.find('textarea');
      await h.click(box);
      await h.type(box, PRACTICE_ASK);
      await h.click(h.find('[aria-label="Send"]'));
      await h.wait(2600);
    },
  },
];

/** Steps on the left; the chat in the phone on the right, played by a scripted cursor. */
export function ChatDemo() {
  const { active, item, progress, driving, run, cursor, toast, stage, go, takeOver, handBack } = useAutoplay(ITEMS, '[data-chat-root]');
  return (
    <div className={showcase.wrap} data-chat-demo>
      <ol className={showcase.list}>
        {ITEMS.map((entry, i) => {
          const on = i === active;
          return (
            <li key={entry.title} className={`${showcase.item} ${on ? showcase.on : ''}`}>
              {on ? (
                <span className={showcase.track} role="progressbar" aria-label={`${entry.title} demo progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress.value * 100)}>
                  <span className={showcase.fill} style={{ width: `${progress.value * 100}%`, transitionDuration: `${progress.ms}ms` }} />
                </span>
              ) : null}
              <CaseButton variant="tab" type="button" className={showcase.head} aria-expanded={on} onClick={() => go(i)}>
                <span className={showcase.num}>{String(i + 1).padStart(2, '0')}</span>
                <span className={showcase.title}>{entry.title}</span>
                <span className={q.stepTag}>{entry.tag}</span>
              </CaseButton>
              {on ? (
                <div className={showcase.copy}>
                  <p className={showcase.lead}>{entry.lead}</p>
                  <p className={showcase.body}>{entry.body}</p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
      <div ref={stage} className={`${q.stage} ${c.stage}`} onMouseEnter={takeOver} onMouseLeave={handBack} onTouchStart={takeOver}>
        <ChatPhone key={`${active}-${run}`} start={item.start} />
        {toast ? <span className={showcase.toast} role="status">You are driving</span> : !driving ? <span className={showcase.hint} aria-hidden="true">Move the pointer here to use it</span> : null}
        {cursor ? <span className={`${showcase.cursor} ${cursor.down ? showcase.cursorDown : ''}`} style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)`, ...(cursor.drag ? { transitionDuration: '40ms', transitionTimingFunction: 'linear' } : {}) }} aria-hidden="true" /> : null}
      </div>
    </div>
  );
}
