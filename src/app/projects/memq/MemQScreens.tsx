'use client';

// ── MemQ Editorial Screens — Next.js port ──────────────────────────────────
// Adapted from /public/img/MemQ/design system/screens-editorial.jsx
// Changes: React.useState/useRef/useEffect → named imports; removed window exports

import { useState, useRef, useEffect, ReactNode } from 'react';

// ── Theme ───────────────────────────────────────────────────────────────────
const ED = {
  bg: '#FAFAF8',
  surf: '#FFFFFF',
  border: '#E5E3DE',
  borderS: '#EFEDE8',
  accent: '#1A8A72',
  accentL: '#E6F5F2',
  accentRing: 'rgba(26, 138, 114, 0.12)',
  accentShadow: 'rgba(26, 138, 114, 0.25)',
  accentShadowLg: 'rgba(26, 138, 114, 0.35)',
  text: '#1A1916',
  sub: '#37352F',
  muted: '#9B9790',
  dim: '#D8D5CF',
  green: '#0F7E4A',
  greenL: '#EDFBF3',
  red: '#E03E3E',
  redL: '#FEF2F2',
  warn: '#B89A2E',
  warnL: '#FAF4DD',
};

// ── Shared primitives ───────────────────────────────────────────────────────
const EdBase = ({ children, style = {} }: { children: ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    fontFamily: "'Space Grotesk', sans-serif",
    background: ED.bg,
    color: ED.text,
    width: '100%', height: '100%', overflowY: 'auto',
    ...style,
  }}>
    {children}
  </div>
);

const Div = ({ style = {} }: { style?: React.CSSProperties }) => (
  <div style={{ height: 1, background: ED.border, ...style }} />
);

const SectionLabel = ({ children, style = {} }: { children: ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    fontSize: 10, color: ED.muted, letterSpacing: '0.09em',
    textTransform: 'uppercase', fontWeight: 500, ...style,
  }}>{children}</div>
);

// ── Tab icons ───────────────────────────────────────────────────────────────
const TabIcon = ({ name, color, size = 20 }: { name: string; color: string; size?: number }) => {
  const s = { width: size, height: size, fill: 'none' as const, stroke: color, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (name === 'home') return <svg viewBox="0 0 24 24" {...s}><path d="M4 11l8-7 8 7v9H4z" /></svg>;
  if (name === 'library') return <svg viewBox="0 0 24 24" {...s}><rect x="5" y="4" width="14" height="16" rx="1.5" /><path d="M9 4v16" /></svg>;
  if (name === 'explore') return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="8" /><path d="M15.5 8.5L13 13l-4.5 2.5L11 11z" strokeLinejoin="round" /></svg>;
  if (name === 'profile') return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="9" r="3.5" /><path d="M5 20c1.4-3.6 4-5 7-5s5.6 1.4 7 5" /></svg>;
  return null;
};

// ── TabBar ──────────────────────────────────────────────────────────────────
function TabBar({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  const tabs = [
    { id: 'home', label: 'Today', icon: 'home' },
    { id: 'library', label: 'Library', icon: 'library' },
    { id: 'explore', label: 'Explore', icon: 'explore' },
    { id: 'profile', label: 'You', icon: 'profile' },
  ];
  const left = tabs.slice(0, 2);
  const right = tabs.slice(2);
  const isAssistant = active === 'assistant';

  const renderTab = (t: { id: string; label: string; icon: string }) => {
    const isActive = active === t.id;
    const color = isActive ? ED.text : ED.muted;
    return (
      <button key={t.id} onClick={() => onChange(t.id)} style={{
        flex: 1, padding: '8px 0 0', background: 'none', border: 'none',
        cursor: 'pointer', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 3, fontFamily: 'inherit',
      }}>
        <TabIcon name={t.icon} color={color} />
        <span style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 10, letterSpacing: '0.02em',
          fontWeight: isActive ? 700 : 500, color,
        }}>{t.label}</span>
      </button>
    );
  };

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      display: 'flex', alignItems: 'flex-end',
      borderTop: `1px solid ${ED.border}`,
      background: ED.surf, paddingBottom: 14, paddingTop: 0, height: 64,
    }}>
      {left.map(renderTab)}

      {/* Assistant FAB */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        <button onClick={() => onChange('assistant')} aria-label="Assistant" style={{
          position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
          width: 52, height: 52, borderRadius: '50%',
          background: ED.text, border: `3px solid ${ED.bg}`,
          color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isAssistant
            ? `0 0 0 2px ${ED.accentShadow}, 0 4px 14px rgba(26,25,22,0.35)`
            : `0 2px 8px rgba(26,25,22,0.25)`,
          fontFamily: 'inherit', padding: 0, transition: 'box-shadow 0.15s',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 3 L13.6 10.4 L21 12 L13.6 13.6 L12 21 L10.4 13.6 L3 12 L10.4 10.4 Z" fill="#fff" />
            <path d="M19 4 L19.5 6 L21.5 6.5 L19.5 7 L19 9 L18.5 7 L16.5 6.5 L18.5 6 Z" fill="#fff" opacity="0.85" />
          </svg>
        </button>
        <span style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          marginTop: 36, fontSize: 10, letterSpacing: '0.02em',
          fontWeight: isAssistant ? 700 : 600, color: ED.text,
        }}>Assistant</span>
      </div>

      {right.map(renderTab)}
    </div>
  );
}

// ── Floating AI launcher (Home) ─────────────────────────────────────────────
function AssistantLauncher({ onOpen }: { onOpen: () => void }) {
  const [peeked, setPeeked] = useState(false);
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 64, zIndex: 20,
      pointerEvents: 'none', display: 'flex', justifyContent: 'flex-end',
      padding: '0 14px 10px',
    }}>
      <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        {peeked && (
          <div style={{
            background: ED.text, color: '#fff', borderRadius: 999,
            padding: '8px 14px 8px 12px', fontSize: 12, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 6px 18px rgba(26,25,22,0.18)', maxWidth: 220, cursor: 'pointer',
          }} onClick={onOpen}>
            <span style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 9, color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.1em', textTransform: 'uppercase' as const, fontWeight: 600,
            }}>Tip</span>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Resume Spanish · A2?</span>
          </div>
        )}
        <button onClick={() => peeked ? onOpen() : setPeeked(true)} aria-label="Open assistant" style={{
          width: 44, height: 44, borderRadius: '50%',
          background: ED.text, border: `2px solid ${ED.bg}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(26,25,22,0.28)', padding: 0, position: 'relative',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 3 L13.6 10.4 L21 12 L13.6 13.6 L12 21 L10.4 13.6 L3 12 L10.4 10.4 Z" fill="#fff" />
          </svg>
          {!peeked && (
            <span style={{
              position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: '50%',
              background: ED.accent, border: `2px solid ${ED.text}`,
            }} />
          )}
        </button>
      </div>
    </div>
  );
}

// ── Home / Today ─────────────────────────────────────────────────────────────
export function EditorialHome({ onOpenAssistant }: { onOpenAssistant?: () => void }) {
  const due = [
    { id: 'd1', topic: 'World History', card: 'The Treaty of Westphalia (1648)', count: 4 },
    { id: 'd2', topic: 'Spanish · A2', card: '"Quedar" vs "Quedarse"', count: 7 },
    { id: 'd3', topic: 'Microeconomics', card: 'Cross-price elasticity', count: 3 },
    { id: 'd4', topic: 'Cell Biology', card: 'Krebs cycle — net ATP yield', count: 5 },
  ];

  return (
    <EdBase style={{ paddingBottom: 70 }}>
      {/* Top bar */}
      <div style={{ padding: '20px 18px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, borderBottom: `1px solid ${ED.border}` }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <SectionLabel>Tuesday · April 29</SectionLabel>
          <div style={{ letterSpacing: '-0.025em', marginTop: 2, fontSize: 18, fontWeight: 800 }}>Good morning, Alex</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: ED.accent, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>47</div>
          <SectionLabel style={{ fontSize: 9, marginTop: 4 }}>Day Streak</SectionLabel>
        </div>
      </div>

      {/* Hero — focus queue number */}
      <div style={{ padding: '22px 20px 18px', borderBottom: `1px solid ${ED.border}`, background: ED.surf }}>
        <SectionLabel style={{ marginBottom: 8 }}>Focus Queue</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>19</span>
          <span style={{ fontSize: 13, color: ED.muted }}>cards due today</span>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: ED.muted }}>~12 min</span>
        </div>
        <div style={{ height: 2, borderRadius: 1, background: ED.dim, marginTop: 14, overflow: 'hidden' }}>
          <div style={{ width: '32%', height: '100%', background: ED.accent }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 10, color: ED.muted }}>6 of 19 reviewed</span>
          <span style={{ fontSize: 10, color: ED.muted }}>Daily goal: 19</span>
        </div>
        <button style={{
          width: '100%', marginTop: 16, padding: '13px', borderRadius: 8,
          border: 'none', background: ED.accent, color: '#fff',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}>Start review →</button>
      </div>

      {/* Up next list */}
      <div style={{ padding: '16px 16px 4px' }}>
        <div style={{ padding: '0 4px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SectionLabel>Up Next</SectionLabel>
          <span style={{ fontSize: 11, color: ED.muted }}>by topic</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {due.map((d) => (
            <div key={d.id} style={{
              background: ED.surf, border: `1px solid ${ED.border}`, borderRadius: 10,
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <SectionLabel style={{ fontSize: 9.5, marginBottom: 3 }}>{d.topic}</SectionLabel>
                <div style={{ fontSize: 13, fontWeight: 500, color: ED.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.card}</div>
              </div>
              <span style={{ fontSize: 11, color: ED.accent, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{d.count} due</span>
              <span style={{ fontSize: 16, color: ED.dim }}>›</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: ED.surf, borderBottom: `1px solid ${ED.border}`, marginTop: 8 }}>
        {[
          { label: 'Reviewed', val: '128', sub: 'this week' },
          { label: 'Accuracy', val: '84%', sub: '7-day avg' },
        ].map((item, i) => (
          <div key={item.label} style={{ padding: '16px 18px', borderRight: i === 0 ? `1px solid ${ED.border}` : 'none' }}>
            <SectionLabel style={{ marginBottom: 6 }}>{item.label}</SectionLabel>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{item.val}</div>
            <div style={{ fontSize: 11, color: ED.muted, marginTop: 4 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      <AssistantLauncher onOpen={onOpenAssistant ?? (() => {})} />
    </EdBase>
  );
}

// ── Library ─────────────────────────────────────────────────────────────────
export function EditorialLibrary() {
  const decks = [
    { id: 'hist', title: 'World History · 1500–1900', cards: 84, due: 7, pct: 62, sub: 'Treaties, revolutions, colonization' },
    { id: 'span', title: 'Spanish · A2', cards: 142, due: 11, pct: 48, sub: 'Verbs, prepositions, idioms' },
    { id: 'econ', title: 'Microeconomics 101', cards: 56, due: 3, pct: 79, sub: 'Supply, demand, elasticity' },
    { id: 'bio', title: 'Cell Biology', cards: 73, due: 5, pct: 88, sub: 'Organelles, cycles, genetics' },
    { id: 'mgmt', title: 'Operations Management', cards: 41, due: 0, pct: 94, sub: 'Lean, queues, capacity' },
  ];

  return (
    <EdBase style={{ paddingBottom: 70 }}>
      <div style={{ padding: '18px 20px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${ED.border}` }}>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.025em' }}>Library</div>
        <span style={{ fontSize: 12, color: ED.accent, fontWeight: 600 }}>Filter</span>
      </div>

      <div style={{ padding: '12px 20px', borderBottom: `1px solid ${ED.border}`, background: ED.surf }}>
        <div style={{ padding: '9px 12px', border: `1px solid ${ED.border}`, borderRadius: 8, fontSize: 13, color: ED.muted, background: ED.bg }}>Search decks</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: `1px solid ${ED.border}`, background: ED.surf }}>
        {[{ v: '5', l: 'decks' }, { v: '396', l: 'cards' }, { v: '26', l: 'due' }].map((s, i) => (
          <div key={s.l} style={{ padding: '14px 16px', borderRight: i < 2 ? `1px solid ${ED.border}` : 'none' }}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.v}</div>
            <SectionLabel style={{ fontSize: 9.5, marginTop: 5 }}>{s.l}</SectionLabel>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 16px 24px' }}>
        <div style={{ padding: '0 4px 10px' }}><SectionLabel>All Decks</SectionLabel></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {decks.map((d) => (
            <div key={d.id} style={{
              background: ED.surf, border: `1px solid ${ED.border}`, borderRadius: 10,
              padding: '14px', cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.015em', color: ED.text }}>{d.title}</div>
                <span style={{ fontSize: 11, color: d.due > 0 ? ED.accent : ED.muted, fontWeight: 600, flexShrink: 0 }}>
                  {d.due > 0 ? `${d.due} due` : 'caught up'}
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: ED.muted, marginTop: 3 }}>{d.sub}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                <div style={{ flex: 1, height: 2, borderRadius: 1, background: ED.dim, overflow: 'hidden' }}>
                  <div style={{ width: `${d.pct}%`, height: '100%', background: ED.accent }} />
                </div>
                <span style={{ fontSize: 10.5, color: ED.muted, fontVariantNumeric: 'tabular-nums', width: 60, textAlign: 'right' as const }}>{d.cards} cards</span>
                <span style={{ fontSize: 10.5, color: ED.text, fontWeight: 700, fontVariantNumeric: 'tabular-nums', width: 30, textAlign: 'right' as const }}>{d.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EdBase>
  );
}

// ── Create (AI card generation) ──────────────────────────────────────────────
const CREATE_PRESET = [
  {
    n: '01', tag: 'Core Concept', title: 'What sparked the French Revolution?',
    body: 'A convergence of fiscal crisis, Enlightenment political thought, and a rigid estate system that excluded the bourgeoisie from real power.',
    ex: '"Let them eat cake" — apocryphal, but captures the disconnect of Versailles from rural famine.',
  },
  { n: '02', tag: 'Mechanism', title: 'The Estates-General (1789)' },
  { n: '03', tag: 'Consequence', title: 'From Bastille to the Terror' },
];

export function EditorialCreate() {
  const [prompt, setPrompt] = useState('Explain the causes of the French Revolution');
  const [phase, setPhase] = useState<'idle' | 'generating' | 'done'>('idle');
  const [cards, setCards] = useState<typeof CREATE_PRESET>([]);
  const [kept, setKept] = useState<Record<string, boolean>>({});

  const generate = () => {
    if (!prompt.trim()) return;
    setPhase('generating');
    setCards([]);
    setKept({});
    CREATE_PRESET.forEach((c, i) => {
      setTimeout(() => {
        setCards((prev) => [...prev, c]);
        if (i === CREATE_PRESET.length - 1) setPhase('done');
      }, 350 + i * 350);
    });
  };

  return (
    <EdBase style={{ paddingBottom: 70 }}>
      <div style={{ padding: '18px 20px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${ED.border}` }}>
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>New card set</span>
        <span style={{ fontSize: 12, color: ED.accent, fontWeight: 600 }}>History</span>
      </div>

      <div style={{ background: ED.surf, borderBottom: `1px solid ${ED.border}` }}>
        <div style={{ padding: '14px 18px 6px' }}>
          <SectionLabel style={{ marginBottom: 10 }}>Your prompt</SectionLabel>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type a question, paste a passage, or describe a topic…"
            style={{
              width: '100%', minHeight: 64, border: 'none', outline: 'none',
              resize: 'none', background: 'transparent', color: ED.text,
              fontSize: 15, lineHeight: 1.55, fontFamily: 'inherit',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', borderTop: `1px solid ${ED.border}` }}>
          {['Attach', 'Voice', 'Doc'].map((label) => (
            <button key={label} style={{
              padding: '9px 14px', background: 'none', border: 'none',
              borderRight: `1px solid ${ED.border}`, fontSize: 11.5, cursor: 'pointer',
              color: ED.muted, fontFamily: 'inherit', letterSpacing: '0.04em',
              textTransform: 'uppercase' as const, fontWeight: 600,
            }}>{label}</button>
          ))}
          <button onClick={generate} disabled={phase === 'generating'} style={{
            marginLeft: 'auto', padding: '9px 16px', background: 'none', border: 'none',
            color: phase === 'generating' ? ED.muted : ED.accent,
            fontSize: 13, fontWeight: 700,
            cursor: phase === 'generating' ? 'default' : 'pointer', fontFamily: 'inherit',
          }}>{phase === 'generating' ? 'Generating…' : 'Generate →'}</button>
        </div>
      </div>

      <div style={{ padding: '14px 18px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SectionLabel>
          {phase === 'idle' && 'Awaiting prompt'}
          {phase === 'generating' && `Generating — ${cards.length} of ${CREATE_PRESET.length}`}
          {phase === 'done' && `Generated — ${cards.length} cards`}
        </SectionLabel>
        {phase === 'done' && <span style={{ fontSize: 12, color: ED.accent, fontWeight: 600, cursor: 'pointer' }}>Save all</span>}
      </div>

      {phase === 'idle' && (
        <div style={{ margin: '0 16px 16px', padding: '24px 18px', border: `1px dashed ${ED.dim}`, borderRadius: 10, textAlign: 'center' as const }}>
          <div style={{ fontSize: 13, color: ED.muted, lineHeight: 1.6 }}>Cards will appear here.<br />Try: "Verb conjugation in Spanish," or paste a paragraph.</div>
        </div>
      )}

      {phase === 'generating' && cards.length === 0 && (
        <div style={{ margin: '0 16px' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ background: ED.surf, border: `1px solid ${ED.border}`, borderRadius: 10, padding: '14px', marginBottom: 6 }}>
              <div style={{ height: 8, width: 80, background: ED.dim, borderRadius: 2, marginBottom: 8, opacity: 0.5 }} />
              <div style={{ height: 14, width: '70%', background: ED.dim, borderRadius: 2, opacity: 0.5 }} />
            </div>
          ))}
        </div>
      )}

      {cards.map((c, i) => i === 0 ? (
        <div key={c.n} style={{ background: ED.surf, border: `1px solid ${ED.border}`, margin: '0 16px', borderRadius: 10 }}>
          <div style={{ padding: '12px 14px', borderBottom: `1px solid ${ED.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <SectionLabel style={{ marginBottom: 4 }}>Card {c.n} · {c.tag}</SectionLabel>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.3 }}>{c.title}</div>
            </div>
            <span style={{ fontSize: 12, color: ED.accent, fontWeight: 600, marginLeft: 10, flexShrink: 0 }}>Edit</span>
          </div>
          <div style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: 13, color: ED.sub, lineHeight: 1.65, marginBottom: 12 }}>{c.body}</div>
            {c.ex && (
              <div style={{ border: `1px solid ${ED.border}`, borderRadius: 6, padding: '10px 12px', background: ED.bg }}>
                <SectionLabel style={{ marginBottom: 5 }}>Example</SectionLabel>
                <div style={{ fontSize: 12, color: ED.sub, fontFamily: 'monospace', lineHeight: 1.6 }}>{c.ex}</div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', borderTop: `1px solid ${ED.border}` }}>
            {[
              { label: 'Discard', color: ED.muted, key: 'discard' },
              { label: 'Regenerate', color: ED.muted, key: 'regen' },
              { label: kept[c.n] ? 'Kept ✓' : 'Keep', color: ED.accent, key: 'keep' },
            ].map((b, j, arr) => (
              <button key={b.key} onClick={() => b.key === 'keep' && setKept({ ...kept, [c.n]: true })} style={{
                flex: 1, padding: '10px 0', background: 'none', border: 'none',
                borderRight: j < arr.length - 1 ? `1px solid ${ED.border}` : 'none',
                color: b.color, fontSize: 12, cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: b.key === 'keep' ? 700 : 400,
              }}>{b.label}</button>
            ))}
          </div>
        </div>
      ) : (
        <div key={c.n} style={{ margin: '6px 16px 0', background: ED.surf, border: `1px solid ${ED.border}`, borderRadius: 10, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
          <div>
            <SectionLabel style={{ marginBottom: 3 }}>Card {c.n}</SectionLabel>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{c.title}</div>
          </div>
          <span style={{ fontSize: 16, color: ED.dim }}>›</span>
        </div>
      ))}
      <div style={{ height: 24 }} />
    </EdBase>
  );
}

// ── Assistant ────────────────────────────────────────────────────────────────
type MsgBlock =
  | { kind: 'card'; card: { q: string; a: string }; deck: string; isNewDeck: boolean }
  | { kind: 'deck'; deck: { title: string; sub: string; totalCards: number; previewCards: string[] } }
  | { kind: 'quiz'; question: { topic: string; q: string; opts: string[]; correct: number; explain: string } };

interface AsstMsg {
  who: 'asst' | 'user';
  text: string;
  block?: MsgBlock;
}

const SUGGESTIONS: Record<string, string[]> = {
  deck: ['A deck on US Constitutional Amendments', 'GRE high-frequency vocabulary', 'Italian A1 — survival phrases'],
  ask: ['What is the difference between ser and estar?', 'Explain Bayes’ theorem with an example', 'Who was Catherine the Great?'],
  quiz: ['Quiz me on Cell Biology', 'Mixed review — anything weak', 'Spanish prepositions, hard mode'],
};

const ASST_SCRIPTS: Record<string, AsstMsg[]> = {
  deck: [
    { who: 'asst', text: 'Hi Alex — I can help you build a new deck. What’s the topic, and is it for an exam, casual review, or something else?' },
    { who: 'user', text: 'Italian A1 — survival phrases for travel' },
    { who: 'asst', text: 'Got it. I’ll lean into restaurants, transit, directions, and small talk. Roughly how many cards — 30, 60, or 100+?' },
    { who: 'user', text: 'About 60' },
    { who: 'asst', text: 'Drafting now. Here’s a preview — feel free to refine the angle:', block: {
      kind: 'deck', deck: {
        title: 'Italian A1 · Survival Phrases',
        sub: 'Restaurants, transit, directions, polite small talk',
        totalCards: 58,
        previewCards: ['Vorrei… (I would like…)', 'Dov’è la stazione?', 'Il conto, per favore.', 'Mi scusi, non capisco.'],
      },
    }},
  ],
  ask: [
    { who: 'asst', text: 'Ask me anything. If the answer’s worth keeping, I’ll save it as a card and slot it into the right deck.' },
    { who: 'user', text: 'What’s the difference between ser and estar?' },
    { who: 'asst', text: 'Both mean "to be," but they split by what they describe.\n\n• ser → identity & permanence\n• estar → state & location\n\n"Soy alta" (I am tall) vs "Estoy cansada" (I’m tired).', block: {
      kind: 'card', card: {
        q: '"Ser" vs "Estar" — which is for permanence?',
        a: 'Ser → identity / permanent traits. Estar → temporary states & location.',
      }, deck: 'Spanish · A2', isNewDeck: false,
    }},
  ],
  quiz: [
    { who: 'asst', text: 'I’ll pull from your weak spots. You have 5 due in Cell Biology and 11 in Spanish. Want a mixed set, a single deck, or hard-mode?' },
    { who: 'user', text: 'Mixed, 5 questions' },
    { who: 'asst', text: 'Here we go — first one:', block: {
      kind: 'quiz', question: {
        topic: 'Cell Biology',
        q: 'What is the net ATP yield per glucose molecule from the Krebs cycle alone?',
        opts: ['2 ATP', '4 ATP', '6 ATP', '36 ATP'],
        correct: 0,
        explain: 'The Krebs cycle directly produces 2 ATP per glucose. Most ATP comes later from the electron transport chain.',
      },
    }},
  ],
};

function AsstAvatar({ size = 24 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: ED.text, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
        <path d="M12 3 L13.6 10.4 L21 12 L13.6 13.6 L12 21 L10.4 13.6 L3 12 L10.4 10.4 Z" fill={ED.accent} />
      </svg>
    </div>
  );
}

function AsstCardPreview({ card, deck, isNewDeck }: { card: { q: string; a: string }; deck: string; isNewDeck: boolean }) {
  return (
    <div style={{ background: ED.surf, border: `1px solid ${ED.border}`, borderRadius: 10, overflow: 'hidden', marginTop: 8 }}>
      <div style={{ padding: '8px 12px', borderBottom: `1px solid ${ED.borderS}`, display: 'flex', alignItems: 'center', gap: 8, background: ED.bg }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ED.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M9 5v14" /></svg>
        <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: ED.muted, fontWeight: 600 }}>
          {isNewDeck ? 'New card · creating deck' : `New card · ${deck}`}
        </span>
        {isNewDeck && <span style={{ marginLeft: 'auto', fontSize: 9, padding: '2px 6px', borderRadius: 3, background: ED.accentL, color: ED.accent, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>NEW</span>}
      </div>
      <div style={{ padding: '11px 12px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.35, color: ED.text }}>{card.q}</div>
        <div style={{ fontSize: 12, color: ED.sub, lineHeight: 1.55, marginTop: 6 }}>{card.a}</div>
      </div>
      <div style={{ display: 'flex', borderTop: `1px solid ${ED.borderS}` }}>
        {['Edit', 'Discard'].map((l) => (
          <button key={l} style={{ flex: 1, padding: '8px 0', background: 'none', border: 'none', borderRight: `1px solid ${ED.borderS}`, fontSize: 11.5, color: ED.muted, fontFamily: 'inherit', cursor: 'pointer' }}>{l}</button>
        ))}
        <button style={{ flex: 1, padding: '8px 0', background: 'none', border: 'none', fontSize: 11.5, color: ED.accent, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>Saved ✓</button>
      </div>
    </div>
  );
}

function AsstDeckPreview({ deck }: { deck: { title: string; sub: string; totalCards: number; previewCards: string[] } }) {
  return (
    <div style={{ background: ED.surf, border: `1px solid ${ED.border}`, borderRadius: 10, overflow: 'hidden', marginTop: 8 }}>
      <div style={{ padding: '8px 12px', borderBottom: `1px solid ${ED.borderS}`, display: 'flex', alignItems: 'center', gap: 8, background: ED.bg }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ED.accent} strokeWidth="2" strokeLinecap="round"><rect x="5" y="4" width="14" height="16" rx="1.5" /><path d="M9 4v16" /></svg>
        <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: ED.muted, fontWeight: 600 }}>Deck draft</span>
        <span style={{ marginLeft: 'auto', fontSize: 9, padding: '2px 6px', borderRadius: 3, background: ED.accentL, color: ED.accent, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>NEW</span>
      </div>
      <div style={{ padding: '12px 12px 8px' }}>
        <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3, color: ED.text }}>{deck.title}</div>
        <div style={{ fontSize: 11.5, color: ED.muted, marginTop: 4, lineHeight: 1.5 }}>{deck.sub}</div>
      </div>
      <div style={{ padding: '0 12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {deck.previewCards.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 11.5 }}>
            <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", color: ED.muted, fontVariantNumeric: 'tabular-nums', width: 22 }}>{String(i + 1).padStart(2, '0')}</span>
            <span style={{ color: ED.sub, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c}</span>
          </div>
        ))}
        <div style={{ fontSize: 10.5, color: ED.muted, paddingTop: 4, fontFamily: "'JetBrains Mono', ui-monospace, monospace", letterSpacing: '0.04em' }}>+ {deck.totalCards - deck.previewCards.length} more</div>
      </div>
      <div style={{ display: 'flex', borderTop: `1px solid ${ED.borderS}` }}>
        <button style={{ flex: 1, padding: '9px 0', background: 'none', border: 'none', borderRight: `1px solid ${ED.borderS}`, fontSize: 11.5, color: ED.muted, fontFamily: 'inherit', cursor: 'pointer' }}>Refine</button>
        <button style={{ flex: 1, padding: '9px 0', background: ED.accent, border: 'none', fontSize: 11.5, color: '#fff', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>Add to library →</button>
      </div>
    </div>
  );
}

function AsstQuizBlock({ question }: { question: { topic: string; q: string; opts: string[]; correct: number; explain: string } }) {
  const [picked, setPicked] = useState<number | null>(null);
  const revealed = picked !== null;
  return (
    <div style={{ background: ED.surf, border: `1px solid ${ED.border}`, borderRadius: 10, overflow: 'hidden', marginTop: 8 }}>
      <div style={{ padding: '8px 12px', borderBottom: `1px solid ${ED.borderS}`, display: 'flex', alignItems: 'center', gap: 8, background: ED.bg }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ED.accent} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01" /></svg>
        <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: ED.muted, fontWeight: 600 }}>Quick quiz · {question.topic}</span>
      </div>
      <div style={{ padding: '12px 12px 10px' }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.4, letterSpacing: '-0.015em', color: ED.text }}>{question.q}</div>
      </div>
      <div style={{ borderTop: `1px solid ${ED.borderS}` }}>
        {question.opts.map((opt, i) => {
          const isCorrect = i === question.correct;
          const isPicked = picked === i;
          let bg = 'transparent', leftCol = 'transparent', textCol = ED.sub, labelBg = ED.bg, labelCol = ED.muted;
          if (revealed && isCorrect) { bg = ED.greenL; leftCol = ED.green; textCol = ED.green; labelBg = ED.green; labelCol = '#fff'; }
          else if (revealed && isPicked && !isCorrect) { bg = ED.redL; leftCol = ED.red; textCol = ED.red; labelBg = ED.red; labelCol = '#fff'; }
          else if (!revealed && isPicked) { labelBg = ED.accent; labelCol = '#fff'; }
          return (
            <div key={i} onClick={() => !revealed && setPicked(i)} style={{
              display: 'flex', borderBottom: i < question.opts.length - 1 ? `1px solid ${ED.borderS}` : 'none',
              cursor: revealed ? 'default' : 'pointer', background: bg,
            }}>
              <div style={{ width: 3, background: leftCol, flexShrink: 0 }} />
              <div style={{ display: 'flex', gap: 9, padding: '9px 12px', flex: 1, alignItems: 'center' }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, background: labelBg, color: labelCol, border: revealed || isPicked ? 'none' : `1px solid ${ED.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                  {String.fromCharCode(65 + i)}
                </div>
                <div style={{ fontSize: 12.5, color: textCol, lineHeight: 1.45 }}>{opt}</div>
              </div>
            </div>
          );
        })}
      </div>
      {revealed && (
        <div style={{ padding: '10px 12px', background: picked === question.correct ? ED.greenL : ED.redL, borderTop: `1px solid ${picked === question.correct ? ED.green + '30' : ED.red + '30'}`, fontSize: 11.5, color: ED.sub, lineHeight: 1.5 }}>
          <span style={{ fontWeight: 700, color: picked === question.correct ? ED.green : ED.red, letterSpacing: '0.04em', textTransform: 'uppercase' as const, fontSize: 10, marginRight: 6 }}>{picked === question.correct ? 'Correct' : 'Not quite'}</span>
          {question.explain}
        </div>
      )}
    </div>
  );
}

export function EditorialAssistant() {
  const [mode, setMode] = useState<'deck' | 'ask' | 'quiz'>('deck');
  const [stepCount, setStepCount] = useState<Record<string, number>>({ deck: 0, ask: 0, quiz: 0 });
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const script = ASST_SCRIPTS[mode];
  const messages = script.slice(0, stepCount[mode]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length, typing, mode]);

  useEffect(() => {
    if (stepCount[mode] === 0) {
      setTyping(true);
      const t = setTimeout(() => {
        setStepCount((s) => ({ ...s, [mode]: 1 }));
        setTyping(false);
      }, 400);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const advance = () => {
    if (stepCount[mode] >= script.length) return;
    const nextIdx = stepCount[mode];
    const next = script[nextIdx];
    if (next.who === 'asst') {
      setTyping(true);
      setTimeout(() => {
        setStepCount((s) => ({ ...s, [mode]: nextIdx + 1 }));
        setTyping(false);
      }, 600);
    } else {
      setStepCount((s) => ({ ...s, [mode]: nextIdx + 1 }));
    }
  };

  const onSend = () => {
    if (!input.trim()) return;
    setInput('');
    advance();
    setTimeout(advance, 200);
  };

  const MODE_TABS = [
    { id: 'deck' as const, label: 'New deck', desc: 'Draft' },
    { id: 'ask' as const, label: 'Ask', desc: 'Q & A' },
    { id: 'quiz' as const, label: 'Quiz me', desc: 'Test' },
  ];

  const userPending = script[stepCount[mode]] && script[stepCount[mode]].who === 'user';

  return (
    <EdBase style={{ paddingBottom: 70, display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ padding: '14px 18px 12px', borderBottom: `1px solid ${ED.border}`, display: 'flex', alignItems: 'center', gap: 10, background: ED.surf, flexShrink: 0 }}>
        <AsstAvatar size={30} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.015em', display: 'flex', alignItems: 'center', gap: 6 }}>
            Assistant
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: ED.green, display: 'inline-block' }} />
          </div>
          <div style={{ fontSize: 10.5, color: ED.muted, fontFamily: "'JetBrains Mono', ui-monospace, monospace", letterSpacing: '0.04em' }}>
            grounded in your 5 decks
          </div>
        </div>
        <button style={{ width: 30, height: 30, borderRadius: 8, background: ED.bg, border: `1px solid ${ED.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }} aria-label="New chat">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={ED.muted} strokeWidth="2" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" /></svg>
        </button>
      </div>

      {/* Mode tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${ED.border}`, background: ED.surf, flexShrink: 0 }}>
        {MODE_TABS.map((t) => {
          const isActive = mode === t.id;
          return (
            <button key={t.id} onClick={() => {
              setMode(t.id);
              setStepCount((prev) => ({ ...prev, [t.id]: 0 }));
            }} style={{
              flex: 1, padding: '11px 0 10px', background: 'none', border: 'none',
              borderBottom: `2px solid ${isActive ? ED.text : 'transparent'}`,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <span style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? ED.text : ED.muted, letterSpacing: '-0.01em' }}>{t.label}</span>
              <span style={{ fontSize: 9, color: ED.muted, fontFamily: "'JetBrains Mono', ui-monospace, monospace", letterSpacing: '0.04em', textTransform: 'uppercase' as const, fontWeight: 500 }}>{t.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Conversation */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        {messages.length === 0 && !typing && (
          <div style={{ padding: '24px 8px', textAlign: 'center' as const }}>
            <div style={{ display: 'inline-flex', justifyContent: 'center' }}><AsstAvatar size={36} /></div>
            <div style={{ fontSize: 14, color: ED.muted, marginTop: 12, lineHeight: 1.55 }}>
              {mode === 'deck' && 'Tell me what you want to learn — I’ll draft the deck.'}
              {mode === 'ask' && 'Ask anything. I’ll save the answer as a card.'}
              {mode === 'quiz' && 'I’ll quiz you on your weak spots.'}
            </div>
          </div>
        )}

        {messages.map((m, i) => {
          if (m.who === 'asst') {
            return (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <AsstAvatar size={24} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, color: ED.text, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{m.text}</div>
                  {m.block?.kind === 'deck' && <AsstDeckPreview deck={m.block.deck} />}
                  {m.block?.kind === 'card' && <AsstCardPreview card={m.block.card} deck={m.block.deck} isNewDeck={m.block.isNewDeck} />}
                  {m.block?.kind === 'quiz' && <AsstQuizBlock question={m.block.question} />}
                </div>
              </div>
            );
          }
          return (
            <div key={i} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ maxWidth: '82%', background: ED.text, color: '#fff', padding: '9px 12px', borderRadius: '14px 14px 4px 14px', fontSize: 13, lineHeight: 1.5 }}>{m.text}</div>
            </div>
          );
        })}

        {typing && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <AsstAvatar size={24} />
            <div style={{ padding: '10px 12px', background: ED.surf, border: `1px solid ${ED.border}`, borderRadius: '14px 14px 14px 4px', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 1, 2].map((d) => (
                <span key={d} style={{ width: 5, height: 5, borderRadius: '50%', background: ED.muted, opacity: 0.5 }} />
              ))}
            </div>
          </div>
        )}

        {messages.length === 1 && !typing && stepCount[mode] === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 32 }}>
            <div style={{ fontSize: 9.5, letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: ED.muted, fontWeight: 500, marginBottom: 2 }}>Try</div>
            {SUGGESTIONS[mode].map((s, i) => (
              <button key={i} onClick={() => setInput(s)} style={{
                textAlign: 'left' as const, padding: '9px 12px', background: ED.surf,
                border: `1px solid ${ED.border}`, borderRadius: 8, fontSize: 12.5,
                color: ED.sub, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1.4,
              }}>{s}</button>
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <div style={{ borderTop: `1px solid ${ED.border}`, background: ED.surf, padding: '10px 12px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, border: `1px solid ${ED.border}`, borderRadius: 12, padding: '8px 8px 8px 12px', background: ED.bg }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
            placeholder={mode === 'deck' ? 'Describe the deck you want…' : mode === 'ask' ? 'Ask a question…' : 'Tell me what to quiz you on…'}
            rows={1}
            style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', background: 'transparent', color: ED.text, fontSize: 13, lineHeight: 1.5, fontFamily: 'inherit', padding: '4px 0', minHeight: 18, maxHeight: 80 }}
          />
          <button onClick={onSend} disabled={!input.trim() && !userPending} aria-label="Send" style={{
            width: 30, height: 30, borderRadius: 8, border: 'none',
            background: input.trim() || userPending ? ED.accent : ED.dim,
            cursor: input.trim() || userPending ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, padding: '0 4px', fontSize: 10, color: ED.muted, fontFamily: "'JetBrains Mono', ui-monospace, monospace", letterSpacing: '0.04em' }}>
          <span>{mode === 'quiz' ? 'mixed · 5 questions' : mode === 'deck' ? 'auto-saves to library' : 'auto-routes to deck'}</span>
        </div>
      </div>
      <style>{`@keyframes asstDot { 0%,80%,100%{opacity:.3;transform:translateY(0)} 40%{opacity:1;transform:translateY(-2px)} }`}</style>
    </EdBase>
  );
}

// ── Phone frame wrapper ──────────────────────────────────────────────────────
// Renders any screen with the shared TabBar at the bottom.
// Parent must supply a fixed size container.

export function PhoneFrame({
  activeTab,
  children,
  onTabChange,
}: {
  activeTab: string;
  children: ReactNode;
  onTabChange?: (id: string) => void;
}) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
        {children}
      </div>
      <TabBar active={activeTab} onChange={onTabChange ?? (() => {})} />
    </div>
  );
}
