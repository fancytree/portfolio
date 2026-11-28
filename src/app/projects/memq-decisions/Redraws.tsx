'use client';

/**
 * Earlier MemQ screens, redrawn in the 2.0 visual language so the whole page reads
 * as one product. Layout, steps and wording follow the originals: the first App Store
 * version's Add Terms page (Jan 2026 screen recording), and the April redesign's
 * Explore and Assistant (public/img/MemQ). Colours, type, the ledge and the chip
 * follow the app's theme (theme/components.ts) and the 2.0 rebuilds in memq-kit.
 */

import type { ReactNode } from 'react';
import { geistSans, oswald } from '@/app/fonts';
import { Glyph } from '../memq-kit/MemQChat';
import type { IconName } from '../memq-kit/memqIcons';
import { PhoneFrame } from '../memq-kit/MemQPractice';
import { StatusBar, useScale } from '../memq-kit/MemQQuiz';
import q from '../memq-kit/MemQQuiz.module.css';
import r from './Redraws.module.css';

/* ───────────────────────── Shared parts ───────────────────────── */

function Phone({ label, children }: { label: string; children: ReactNode }) {
  const { ref, scale } = useScale();
  return (
    <PhoneFrame>
      <div ref={ref} className={q.viewport} role="img" aria-label={label}>
        <div className={`${q.app} ${r.app} ${geistSans.variable} ${oswald.variable}`} style={{ transform: `scale(${scale})` }} aria-hidden="true">
          <StatusBar />
          {children}
          <span className={q.homeIndicator} />
        </div>
      </div>
    </PhoneFrame>
  );
}

function Round({ icon }: { icon: IconName }) {
  return <span className={r.round}><Glyph name={icon} size={22} /></span>;
}

function Lead({ children, icon, off = false }: { children: ReactNode; icon?: IconName; off?: boolean }) {
  return (
    <span className={`${r.lead} ${off ? r.leadOff : ''}`}>
      <span className={r.leadFace}>{icon && <Glyph name={icon} size={18} />}{children}</span>
    </span>
  );
}

function Chips({ items, on }: { items: string[]; on: number }) {
  return (
    <div className={r.chips}>
      {items.map((label, i) => (
        <span key={label} className={`${r.chip} ${i === on ? r.chipOn : ''}`}><span className={r.chipFace}>{label}</span></span>
      ))}
    </div>
  );
}

/** Fixed tabs across the top: equal slots, one always chosen (v1's Add Terms and Assistant). */
function Tabs({ items, on }: { items: string[]; on: number }) {
  return (
    <div className={r.tabs} role="tablist">
      {items.map((t, i) => <span key={t} className={`${r.tab} ${i === on ? r.tabOn : ''}`}>{t}</span>)}
    </div>
  );
}

function Field({ label, hint, tall = false, value }: { label?: string; hint: string; tall?: boolean; value?: string }) {
  return (
    <div className={r.field}>
      {label && <span className={r.fieldLabel}>{label}</span>}
      <span className={`${r.well} ${tall ? r.wellTall : ''} ${value ? r.wellFilled : ''}`}>{value ?? hint}</span>
    </div>
  );
}

function Cover({ tone, icon }: { tone: 'peach' | 'lilac' | 'lime' | 'sky'; icon: IconName }) {
  return <span className={`${r.cover} ${r[tone]}`}><Glyph name={icon} size={22} /></span>;
}

function Upload() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M11 15.2V7.8l-2.3 2.3a1 1 0 0 1-1.4-1.4l4-4a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1-1.4 1.4L13 7.8v7.4a1 1 0 0 1-2 0ZM5 15a1 1 0 0 1 1 1v2h12v-2a1 1 0 1 1 2 0v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function Search() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M10.5 3a7.5 7.5 0 0 1 5.96 12.05l3.75 3.74a1 1 0 0 1-1.42 1.42l-3.74-3.75A7.5 7.5 0 1 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" />
    </svg>
  );
}

/* ───────────────────────── Stage 1: Add Terms, three tabs ───────────────────────── */

export type AddTab = 'paste' | 'topic' | 'pdf';
const TAB_INDEX: Record<AddTab, number> = { paste: 0, topic: 1, pdf: 2 };

export function AddTermsRedraw({ tab }: { tab: AddTab }) {
  return (
    <Phone label={`Add Terms, ${tab === 'paste' ? 'Input and Edit' : tab === 'topic' ? 'AI Topic' : 'Upload PDF'} tab, redrawn in MemQ 2.0's style`}>
      <div className={r.top}>
        <Round icon="chevronLeft" />
        <span className={r.pageTitle}>Add Terms</span>
        <Round icon="check" />
      </div>
      <Tabs items={['Input & Edit', 'AI Topic', 'Upload PDF']} on={TAB_INDEX[tab]} />
      <div className={r.body}>
        {tab === 'paste' && (
          <>
            <div className={r.card}>
              <Field hint="Paste text here to auto-extract terms, or type manually below…" tall />
              <Lead icon="sparkle">Auto-Detect</Lead>
            </div>
            <span className={r.section}>Terms list</span>
            <div className={r.card}>
              <span className={r.cardKicker}>#1</span>
              <Field label="Term" hint="e.g. Ambition" />
              <Field label="Definition" hint="e.g. A strong desire to achieve something" tall />
            </div>
          </>
        )}
        {tab === 'topic' && (
          <div className={r.card}>
            <Field label="Enter a topic" hint="e.g. Roman History, React Hooks" value="Quantum Physics" />
            <Lead icon="sparkle">Generate Terms</Lead>
            <span className={r.hint}>AI will generate key terms and definitions for the topic you enter.</span>
          </div>
        )}
        {tab === 'pdf' && (
          <div className={r.card}>
            <span className={r.drop}>
              <span className={r.dropIcon}><Upload /></span>
              <b>Tap to select PDF</b>
              <span>Select a PDF file from your device</span>
            </span>
            <Lead off>Upload & Process</Lead>
            <span className={r.hint}>AI will extract key terms and definitions from your PDF.</span>
          </div>
        )}
      </div>
    </Phone>
  );
}

/* ───────────────────────── Stage 1: the lesson square ───────────────────────── */

const TRENDING: { name: string; tone: 'peach' | 'lilac' | 'sky'; icon: IconName }[] = [
  { name: 'LLM Core Concepts', tone: 'lilac', icon: 'layers' },
  { name: 'Business Email Essentials', tone: 'peach', icon: 'book' },
  { name: 'Meeting English Toolkit', tone: 'sky', icon: 'globe' },
];

export function ExploreRedraw() {
  return (
    <Phone label="Explore, the lesson square, redrawn in MemQ 2.0's style">
      <div className={r.heroHead}>
        <span className={r.bigTitle}>Explore</span>
        <span className={r.round}><Search /></span>
      </div>
      <div className={r.body}>
        <div className={`${r.card} ${r.featured}`}>
          <span className={r.cardKicker}>Featured this week</span>
          <div className={r.row}>
            <Cover tone="lilac" icon="layers" />
            <span className={r.rowCopy}>
              <span className={r.rowName}>LLM Core Concepts</span>
              <span className={r.rowSub}>Tokens, context windows, sampling and decoding.</span>
            </span>
          </div>
          <span className={r.rowFacts}>@memq · 14.1k learners</span>
        </div>
        <Chips items={['All', 'Languages', 'Science', 'History']} on={0} />
        <span className={r.section}>Trending</span>
        {TRENDING.map((t) => (
          <div key={t.name} className={`${r.card} ${r.rowCard}`}>
            <div className={r.row}>
              <Cover tone={t.tone} icon={t.icon} />
              <span className={r.rowCopy}>
                <span className={r.rowName}>{t.name}</span>
                <span className={r.rowSub}>8 cards · @memq</span>
              </span>
              <span className={r.chev}><Glyph name="chevronRight" size={20} /></span>
            </div>
          </div>
        ))}
      </div>
      <NavBar />
    </Phone>
  );
}

/* The app's bottom bar (components/ui/BottomNavigation): a pale face on a 3pt lip,
 * equal slots, a lime pill under the tab that is showing, the flat add in the middle.
 * v1 had four tabs, so two sit either side of the add. */
const LIBRARY_ICON = 'M8.51 2h6.98c.232 0 .41 0 .566.015 1.108.109 2.015.775 2.4 1.672H5.544c.385-.897 1.292-1.563 2.4-1.672C8.099 2 8.277 2 8.51 2ZM6.31 4.723c-1.39 0-2.53.84-2.911 1.954l-.023.07c.398-.12.813-.2 1.232-.253 1.08-.138 2.446-.138 4.032-.138h6.892c1.586 0 2.951 0 4.032.138.419.053.834.132 1.232.253l-.023-.07c-.38-1.114-1.52-1.954-2.911-1.954H6.31ZM8.672 7.542h6.656c3.375 0 5.062 0 6.01.987.947.987.724 2.511.278 5.56l-.423 2.892c-.35 2.391-.525 3.587-1.422 4.303-.897.716-2.22.716-4.867.716H9.095c-2.646 0-3.97 0-4.867-.716-.897-.716-1.072-1.912-1.422-4.303l-.423-2.891c-.446-3.05-.669-4.574.279-5.561.948-.987 2.635-.987 6.01-.987ZM8 18c0 .414.373.75.833.75h6.334c.46 0 .833-.336.833-.75s-.373-.75-.833-.75H8.833c-.46 0-.833.336-.833.75Z';
const USER_ICON = 'M12 13c4.418 0 8 2.015 8 4.5S20 22 12 22s-8-2.015-8-4.5S7.582 13 12 13ZM12 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z';

function NavIcon({ d }: { d: string }) {
  return <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d={d} /></svg>;
}

function NavBar({ on = 'explore' }: { on?: 'today' | 'explore' }) {
  return (
    <div className={r.nav}>
      <div className={r.navFace}>
        <span className={`${r.navItem} ${on === 'today' ? r.navOn : ''}`}><Glyph name="today" size={26} /><span>Today</span></span>
        <span className={r.navItem}><NavIcon d={LIBRARY_ICON} /><span>Library</span></span>
        <span className={r.navItem}>
          <svg width="50" height="50" viewBox="0 0 50 50" aria-hidden="true"><rect width="50" height="50" rx="25" fill="#6C3CBC" /><path d="M18 25H32M25 18V32" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </span>
        <span className={`${r.navItem} ${on === 'explore' ? r.navOn : ''}`}><Glyph name="globe" size={26} /><span>Explore</span></span>
        <span className={r.navItem}><NavIcon d={USER_ICON} /><span>You</span></span>
      </div>
    </div>
  );
}

const SHARED_TERMS: [string, string][] = [
  ['quick follow-up', 'A concise message sent to continue a previous thread.'],
  ['loop in', 'To include someone in an email conversation.'],
  ['for your review', 'A polite phrase asking someone to check a document.'],
  ['action items', 'Specific tasks assigned after a discussion.'],
];

export function SharedLessonRedraw() {
  return (
    <Phone label="A shared lesson from the square, redrawn in MemQ 2.0's style">
      <div className={r.top}>
        <Round icon="chevronLeft" />
        <span className={r.slot} />
      </div>
      <div className={r.body}>
        <div className={r.lessonHead}>
          <Cover tone="peach" icon="book" />
          <span className={r.pageTitleLeft}>Business Email Essentials</span>
          <span className={r.rowSub}>Clear, professional patterns for daily workplace email.</span>
        </div>
        <Lead icon="plus">Add to My Lessons</Lead>
        <span className={r.section}>8 cards</span>
        {SHARED_TERMS.map(([term, def]) => (
          <div key={term} className={`${r.card} ${r.termCard}`}>
            <span className={r.term}>{term}</span>
            <span className={r.rowSub}>{def}</span>
          </div>
        ))}
      </div>
    </Phone>
  );
}

/* ───────────────────────── Stage 2: the first Assistant ───────────────────────── */

const HOME_LESSONS: { name: string; tone: 'lilac' | 'peach' | 'sky'; icon: IconName; done: number }[] = [
  { name: 'Computer Science', tone: 'lilac', icon: 'layers', done: 7 },
  { name: 'English', tone: 'peach', icon: 'book', done: 35 },
  { name: 'Italian', tone: 'sky', icon: 'globe', done: 38 },
];

/** v1's way into the Assistant: a button floating over Today, bottom right. */
export function AssistantEntryRedraw() {
  return (
    <Phone label="Today with the Assistant's floating button in the bottom right, redrawn in MemQ 2.0's style">
      <div className={r.heroHead}><span className={r.bigTitle}>Today</span></div>
      <div className={r.body}>
        <div className={r.card}>
          <span className={r.cardKicker}>Today’s goal</span>
          <span className={r.goal}>29 <small>questions</small></span>
          <span className={r.track}><span style={{ width: '0%' }} /></span>
          <Lead>Start learning</Lead>
        </div>
        <span className={r.section}>All lessons</span>
        {HOME_LESSONS.map((l) => (
          <div key={l.name} className={`${r.card} ${r.rowCard}`}>
            <div className={r.row}>
              <Cover tone={l.tone} icon={l.icon} />
              <span className={r.rowCopy}>
                <span className={r.rowName}>{l.name}</span>
                <span className={r.track}><span style={{ width: `${l.done}%` }} /></span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <span className={r.fab}><Glyph name="chatSparkle" size={28} /></span>
      <NavBar on="today" />
    </Phone>
  );
}

function AssistantShell({ label, children, starters = false }: { label: string; children: ReactNode; starters?: boolean }) {
  return (
    <Phone label={label}>
      <div className={r.chatTop}>
        <Round icon="close" />
        <span className={r.chatTitle}>Assistant</span>
      </div>
      <Tabs items={['Q&A', 'Vocabulary', 'Quiz me']} on={0} />
      <div className={r.chatBody}>{children}</div>
      {starters && (
        <div className={r.starters}>
          {/* As components/chat/Starters draws them now: a mark of the line's own, then the sentence, on the page's ground. */}
          {([['What is MCP?', 'book'], ['What is the difference between TCP and UDP?', 'globe'], ['How does photosynthesis work?', 'sparkle']] as const).map(([text, icon]) => (
            <span key={text} className={r.starter}><Glyph name={icon} size={18} />{text}</span>
          ))}
        </div>
      )}
      <div className={r.bar}>
        <span className={r.boxRow}>
          <span className={r.add}><Glyph name="plus" size={26} /></span>
          <span className={r.box}>Ask anything you want to learn…</span>
          <span className={r.send}><span className={r.sendFace}><Glyph name="arrowUp" size={20} /></span></span>
        </span>
      </div>
    </Phone>
  );
}

export function AssistantModesRedraw() {
  return (
    <AssistantShell label="The first Assistant, with a mode to pick before asking, redrawn in MemQ 2.0's style" starters>
      <p className={r.opening}>Hi there — ask me anything and I’ll explain it clearly, step by step.</p>
    </AssistantShell>
  );
}

export function AssistantCardRedraw() {
  return (
    <AssistantShell label="The first Assistant turning one answer into one card, redrawn in MemQ 2.0's style">
      <span className={r.asked}>What is MCP?</span>
      <p className={r.said}>MCP stands for Model Control Protocol, which is a framework used for managing and controlling the deployment of AI models.</p>
      <div className={r.card}>
        <span className={r.term}>MCP</span>
        <span className={r.rowSub}>Model Control Protocol: a framework used for managing and controlling the deployment of AI models.</span>
        <Field label="Lesson" hint="Choose a lesson" value="Computer Science" />
        <Lead>Confirm Save</Lead>
      </div>
    </AssistantShell>
  );
}

/* ───────────────────────── Stage 3: Use your own AI (app/import-cards.tsx) ───────────────────────── */

function ImportTop() {
  return (
    <div className={r.chatTop}>
      <Round icon="close" />
      <span className={r.chatTitle}>Use your own AI</span>
    </div>
  );
}

function Step({ n, title }: { n: number; title: string }) {
  return <span className={r.step}><span className={r.stepNum}>{n}</span><b>{title}</b></span>;
}

function SmallButton({ children, kind = 'primary', icon }: { children: ReactNode; kind?: 'primary' | 'secondary' | 'ghost'; icon?: IconName }) {
  return (
    <span className={`${r.small} ${r[kind]}`}><span className={r.smallFace}>{icon && <Glyph name={icon} size={16} />}{children}</span></span>
  );
}

/** The import page before anything is pasted: copy, ask, bring back. */
export function ImportStepsRedraw() {
  return (
    <Phone label="Use your own AI: copy the prompt, ask your AI, bring its reply back">
      <ImportTop />
      <div className={r.body}>
        <p className={r.lead2}>Your AI writes the cards. Free, no limit.</p>
        <div className={r.card}>
          <Step n={1} title="Copy the prompt" />
          <SmallButton icon="copy">Copy prompt</SmallButton>
        </div>
        <div className={r.card}>
          <Step n={2} title="Ask your AI" />
          <span className={r.rowSub}>Open ChatGPT, Claude or any AI and paste the prompt.</span>
          <span className={r.rowSub}>It asks what you want to learn. In a chat you already had, it makes cards from that chat.</span>
        </div>
        <div className={r.card}>
          <Step n={3} title="Bring its reply back" />
          <span className={r.rowSub}>When it gives you the cards, copy that whole reply, come back and tap Paste.</span>
          <SmallButton>Paste</SmallButton>
          <SmallButton kind="ghost">Or choose a file</SmallButton>
        </div>
      </div>
    </Phone>
  );
}

const IMPORTED: { term: string; def: string; detail: string; on: boolean; held?: boolean }[] = [
  { term: 'il conto', def: 'the bill', detail: '2 questions', on: true },
  { term: 'un tavolo per due', def: 'a table for two', detail: '2 questions', on: true },
  { term: 'senza glutine', def: 'gluten-free', detail: '2 questions', on: true },
  { term: 'il menù', def: 'the menu', detail: 'Already in this lesson', on: false, held: true },
];

/** After the reply is pasted: the cards MemQ read, to check and save. */
export function ImportCheckRedraw() {
  return (
    <Phone label="Use your own AI: the cards read from the pasted reply, to check and save">
      <ImportTop />
      <div className={r.body}>
        <div className={r.card}>
          <Step n={4} title="Check and save" />
          <span className={r.checkHead}><span>4 cards · 3 with questions</span><b>Clear all</b></span>
          {IMPORTED.map((c) => (
            <span key={c.term} className={r.importRow}>
              <span className={`${r.tickBox} ${c.on ? r.tickOn : ''}`}>{c.on && <Glyph name="check" size={16} />}</span>
              <span className={`${r.importText} ${c.on ? '' : r.dim}`}>
                <b>{c.term}</b><span>{c.def}</span><em className={c.held ? r.flag : undefined}>{c.detail}</em>
              </span>
            </span>
          ))}
          <Field label="Lesson" hint="Name the lesson" value="Ordering food in Italy" />
          <SmallButton>Save 3 cards</SmallButton>
        </div>
      </div>
    </Phone>
  );
}

/* ───────────────────────── Stage 4: MemQ inside their AI (MCP card-drafts view) ───────────────────────── */
/* The host's chat, drawn neutral: its own font and colours. MemQ's view inside it keeps
 * only what the hosts allow: the purple button on its ledge, the tick box, capsule buttons. */

function HostPhone({ label, children }: { label: string; children: ReactNode }) {
  const { ref, scale } = useScale();
  return (
    <PhoneFrame>
      <div ref={ref} className={q.viewport} role="img" aria-label={label}>
        <div className={`${q.app} ${r.app} ${r.host}`} style={{ transform: `scale(${scale})` }} aria-hidden="true">
          <StatusBar />
          <div className={r.hostTop}><span className={r.hostMark}><Glyph name="sparkle" size={16} /></span><b>Your AI</b></div>
          {children}
          <span className={q.homeIndicator} />
        </div>
      </div>
    </PhoneFrame>
  );
}

function HostComposer() {
  return <div className={r.hostBar}><span>Ask anything</span><span className={r.hostSend}><Glyph name="arrowUp" size={18} /></span></div>;
}

const MCP_CARDS: [string, string][] = [['il conto', 'the bill'], ['un tavolo per due', 'a table for two'], ['senza glutine', 'gluten-free']];

function McpButton({ children, kind = 'primary' }: { children: ReactNode; kind?: 'primary' | 'secondary' }) {
  return <span className={`${r.mcpBtn} ${kind === 'primary' ? r.mcpPrimary : r.mcpSecondary}`}><span>{children}</span></span>;
}

/** In the conversation: the drafts, three shown, and two buttons. Nothing is saved yet. */
export function McpChatRedraw() {
  return (
    <HostPhone label="MemQ's card drafts shown inside the learner's own AI chat, with Review all and Save buttons">
      <div className={r.hostBody}>
        <span className={r.hostAsked}>Make cards from what we just covered</span>
        <p className={r.hostSaid}>Here are cards from our conversation. Tick the ones to keep.</p>
        <div className={r.mcpCard}>
          <span className={r.mcpHead}><span className={r.mcpCover} /><b>Ordering food in Italy</b></span>
          {MCP_CARDS.map(([t, d]) => <span key={t} className={r.mcpRow}><b>{t}</b><span>{d}</span></span>)}
          <span className={r.mcpButtons}><McpButton kind="secondary">Review all</McpButton><McpButton>Save 6 cards</McpButton></span>
        </div>
      </div>
      <HostComposer />
    </HostPhone>
  );
}

/** Review all, full screen: the app's own Check and save list. */
export function McpReviewRedraw() {
  const rows: { t: string; d: string; on: boolean; held?: boolean }[] = [
    { t: 'il conto', d: 'the bill', on: true }, { t: 'un tavolo per due', d: 'a table for two', on: true },
    { t: 'senza glutine', d: 'gluten-free', on: true }, { t: 'il menù', d: 'the menu', on: false, held: true },
    { t: 'il coperto', d: 'cover charge', on: true }, { t: 'la mancia', d: 'the tip', on: true },
  ];
  return (
    <HostPhone label="Review all: the full list of drafts inside the learner's AI, to tick and save">
      <div className={r.hostBody}>
        <b className={r.mcpTitle}>Cards to keep</b>
        <span className={r.mcpField}><span>Lesson</span><b>Ordering food in Italy</b></span>
        <span className={r.checkHead}><span>5 of 6 ticked</span><b>Clear all</b></span>
        {rows.map((c) => (
          <span key={c.t} className={r.importRow}>
            <span className={`${r.tickBox} ${c.on ? r.tickOn : ''}`}>{c.on && <Glyph name="check" size={16} />}</span>
            <span className={`${r.importText} ${c.on ? '' : r.dim}`}><b>{c.t}</b><span>{c.d}</span>{c.held && <em className={r.flag}>Already in this lesson</em>}</span>
          </span>
        ))}
      </div>
      <div className={r.mcpFoot}><McpButton>Save 5 cards</McpButton></div>
    </HostPhone>
  );
}

/** Saved: one line, and the way into the app. */
export function McpSavedRedraw() {
  return (
    <HostPhone label="After saving: the cards are in MemQ, with a button to open the lesson">
      <div className={r.hostBody}>
        <span className={r.hostAsked}>Make cards from what we just covered</span>
        <div className={r.mcpCard}>
          <span className={r.mcpHead}><span className={r.mcpCover} /><b>Ordering food in Italy</b></span>
          <span className={r.mcpSaved}><Glyph name="check" size={18} />5 cards saved in Ordering food in Italy</span>
          <McpButton>Open the lesson</McpButton>
        </div>
      </div>
      <HostComposer />
    </HostPhone>
  );
}
