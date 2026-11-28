/**
 * What I fixed on the way, shown in the interface rather than told: each fix is the
 * same moment of the chat, before and after, drawn in the 2.0 chat's own styles.
 * Behaviour and copy follow MemQ's AI chat spec (§30, §30.3, §35); the answer and
 * drafts reuse the memq-kit chat rebuild's demonstration content.
 */
import type { ReactNode } from 'react';
import { geistSans, oswald } from '@/app/fonts';
import { Glyph } from '../memq-kit/MemQChat';
import f from './Fixes.module.css';

const ASK = 'Explain how spaced repetition works';
const SHORT = [
  'Spaced repetition brings a fact back just before you would forget it. Each time you recall it, the gap grows: a day, then three, then a week.',
  'It works because recalling is harder than rereading, and that effort is what makes it stick.',
];
const LONG = [
  '**Spaced repetition** is a learning technique in which information is reviewed at increasing intervals over time, rather than all at once.',
  'The idea goes back to the **forgetting curve**, which describes how memories fade quickly unless they are revisited. By reviewing just as a memory begins to fade, you strengthen it.',
  '**How it works:** you see an item, then see it again after a short gap. If you remember it, the next gap is longer; if you forget, the gap shrinks.',
  'Many apps use algorithms such as **SM-2** to schedule reviews automatically, based on how easily you recalled each item.',
  'Research suggests spaced practice leads to better long-term retention than cramming, especially for vocabulary, facts and definitions.',
];
const CARDS = [
  { term: 'Spaced repetition', def: 'Reviewing at growing gaps, just before you would forget.', on: true },
  { term: 'Review interval', def: 'The wait before a card comes back.', on: true },
  { term: 'Active recall', def: 'Pulling an answer from memory instead of rereading it.', on: false },
];

function Screen({ kind, children }: { kind: 'before' | 'after'; children: ReactNode }) {
  return (
    <figure className={f.side}>
      <span className={`${f.tag} ${kind === 'after' ? f.tagAfter : ''}`}>{kind === 'before' ? 'Before' : 'After'}</span>
      <div className={`${f.screen} ${geistSans.variable} ${oswald.variable}`} aria-hidden="true">{children}</div>
    </figure>
  );
}

function Asked({ children }: { children: ReactNode }) {
  return <span className={f.asked}>{children}</span>;
}

function Actions({ cards = true }: { cards?: boolean }) {
  return (
    <span className={f.actions}>
      <Glyph name="copy" size={15} /><Glyph name="volumeOn" size={18} /><Glyph name="replay" size={17} />
      {cards && <span className={f.cardsAction}><Glyph name="layers" size={18} />Make cards</span>}
    </span>
  );
}

function Drafts({ head, sub, keep = true, rows = 3 }: { head: string; sub?: string; keep?: boolean; rows?: number }) {
  return (
    <div className={f.drafts}>
      <span className={f.draftsHead}><b>{head}</b>{sub && <span>{sub}</span>}</span>
      {CARDS.slice(0, rows).map((c) => (
        <span key={c.term} className={f.draft}>
          <span className={`${f.tick} ${c.on ? f.tickOn : ''}`}>{c.on && <Glyph name="check" size={14} />}</span>
          <span className={f.draftText}><b>{c.term}</b><span>{c.def}</span></span>
        </span>
      ))}
      {keep && <span className={f.keep}><span>Keep 2 cards</span></span>}
    </div>
  );
}

type Fix = { title: string; why: string; before: ReactNode; after: ReactNode; beforeLine: string; afterLine: string };

const FIXES: Fix[] = [
  {
    title: 'Answers ran long',
    why: 'Five paragraphs and raw asterisks, nothing to act on.',
    beforeLine: 'Explain at any length, then offer cards.',
    afterLine: 'About 80 words, no markdown, one tap to cards.',
    before: (<>
      <Asked>{ASK}</Asked>
      {LONG.map((p) => <p key={p} className={f.said}>{p}</p>)}
      <p className={f.said}>Would you like me to turn this into flashcards?</p>
    </>),
    after: (<>
      <Asked>{ASK}</Asked>
      {SHORT.map((p) => <p key={p} className={f.said}>{p}</p>)}
      <Actions />
    </>),
  },
  {
    title: 'Cards nobody asked for',
    why: 'Asking what a word means is not asking for a deck.',
    beforeLine: 'Every answer came with drafted cards.',
    afterLine: 'It explains; cards wait until you ask.',
    before: (<>
      <Asked>{ASK}</Asked>
      <p className={f.said}>{SHORT[0]}</p>
      <Drafts head="3 cards drafted" />
    </>),
    after: (<>
      <Asked>{ASK}</Asked>
      {SHORT.map((p) => <p key={p} className={f.said}>{p}</p>)}
      <Actions />
    </>),
  },
  {
    title: 'Where, before what',
    why: 'Nobody had seen the cards yet.',
    beforeLine: 'Drafts opened with where they would be saved.',
    afterLine: 'Cards first; “where?” comes after Keep.',
    before: (<>
      <Asked>Make cards from this</Asked>
      <Drafts head="New lesson: How the brain learns" sub="Why reviewing at the right time works" />
    </>),
    after: (<>
      <Asked>Make cards from this</Asked>
      <Drafts head="3 cards drafted" rows={2} keep={false} />
      <Asked>Keep 2 cards</Asked>
      <div className={f.where}>
        <span className={f.whereRow}><span>Adding to <b>How the brain learns</b></span><span className={f.change}>Change</span></span>
        <span className={f.keep}><span>Add to How the brain learns</span></span>
      </div>
    </>),
  },
];

export function FixesShown() {
  return (
    <ol className={f.list} aria-label="What I fixed on the way, before and after">
      {FIXES.map((fix, i) => (
        <li key={fix.title} className={f.fix}>
          <header className={f.head}>
            <span className={f.num}>{i + 1}</span>
            <span><b>{fix.title}</b><span>{fix.why}</span></span>
          </header>
          <div className={f.pair}>
            <div className={f.col}><Screen kind="before">{fix.before}</Screen><span className={f.line}>{fix.beforeLine}</span></div>
            <span className={f.arrow} aria-hidden="true">↓</span>
            <div className={f.col}><Screen kind="after">{fix.after}</Screen><span className={f.line}>{fix.afterLine}</span></div>
          </div>
        </li>
      ))}
    </ol>
  );
}
