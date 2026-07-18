'use client';

/**
 * Walnut Coding — Parent Sharing & Referral Behavior (UX Research case study)
 *
 * 系列第二篇 "Researcher" 研究案例，沿用 walnut-coding 的 "research dossier" 框架，
 * 但把主色从 walnut 琥珀换成 teal（社交/分享主题），保留 walnut 作为系列呼应色。
 * 全部图表内联自绘（SVG / CSS），不依赖图片资源。
 */

import { useState, useRef, useEffect } from 'react';
import CaseStudyControls from '../../components/CaseStudyControls';
import CaseStudyBackButton from '../../components/CaseStudyBackButton';
import CaseStudyHero from '../../components/CaseStudyHero';
import { fontFamily } from '@/lib/design-tokens';

/* ------------------------------------------------------------------ */
/* Design language — research dossier (teal variant)                   */
/* ------------------------------------------------------------------ */
const C = {
  paper: '#F6F7F4',
  paperAlt: '#E8EDE8',
  ink: '#1B211D',
  inkSoft: '#4C554E',
  muted: '#7E867E',
  line: 'rgba(27,33,29,0.10)',
  lineStrong: 'rgba(27,33,29,0.20)',
  card: '#FFFFFF',
  teal: '#2F6B5E',
  tealDeep: '#1E4A40',
  walnut: '#A4541E',
  gold: '#C98A2B',
  slate: '#4A5A6B',
  rose: '#AF5346',
};

const sans = fontFamily.sans;
const mono = fontFamily.mono;

/* ------------------------------------------------------------------ */
/* Scroll reveal                                                        */
/* ------------------------------------------------------------------ */
function useReveal(delay = 0) {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setShown(true);
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
      );
      if (ref.current) {
        const r = ref.current.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) setShown(true);
        else obs.observe(ref.current);
      }
      return () => {
        if (ref.current) obs.unobserve(ref.current);
      };
    }, delay);
    return () => clearTimeout(t);
  }, [delay]);
  return { ref, shown };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, shown } = useReveal(delay);
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
      }}
    >
      {children}
    </div>
  );
}

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const c = () => setM(window.innerWidth < 768);
    c();
    window.addEventListener('resize', c);
    return () => window.removeEventListener('resize', c);
  }, []);
  return m;
}

/* ------------------------------------------------------------------ */
/* Primitives                                                           */
/* ------------------------------------------------------------------ */
function FullBleed({
  children,
  bg = C.paper,
  pad = '96px 24px',
}: {
  children: React.ReactNode;
  bg?: string;
  pad?: string;
}) {
  return (
    <section
      style={{
        backgroundColor: bg,
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        width: '100vw',
        padding: pad,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>{children}</div>
    </section>
  );
}

function Eyebrow({ index, label, color = C.teal }: { index: string; label: string; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
      <span style={{ fontFamily: mono, fontSize: '12px', fontWeight: 600, letterSpacing: '0.14em', color }}>
        {index}
      </span>
      <span style={{ width: '28px', height: '1px', backgroundColor: color, opacity: 0.5 }} />
      <span
        style={{
          fontFamily: mono,
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: C.inkSoft,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: sans,
        fontSize: 'clamp(26px, 3.4vw, 38px)',
        lineHeight: 1.18,
        fontWeight: 500,
        letterSpacing: '-0.01em',
        color: C.ink,
        margin: '0 0 18px',
        maxWidth: '780px',
      }}
    >
      {children}
    </h2>
  );
}

function Lead({ children, max = 730 }: { children: React.ReactNode; max?: number }) {
  return (
    <p
      style={{
        fontFamily: sans,
        fontSize: '18px',
        lineHeight: 1.62,
        fontWeight: 300,
        color: C.inkSoft,
        margin: '0 0 8px',
        maxWidth: max,
      }}
    >
      {children}
    </p>
  );
}

function Pill({ text, color = C.teal }: { text: string; color?: string }) {
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: '11px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color,
        border: `1px solid ${color}`,
        borderRadius: '999px',
        padding: '5px 11px',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Chart — the paradox (value up, public sharing down)                  */
/* ------------------------------------------------------------------ */
function ParadoxChart() {
  const ages = ['4–6', '7–9', '10–12'];
  const W = 760;
  const H = 300;
  const padL = 48;
  const padR = 130;
  const padT = 30;
  const padB = 44;
  const iw = W - padL - padR;
  const ih = H - padT - padB;
  const x = (i: number) => padL + (i / (ages.length - 1)) * iw;
  const y = (v: number) => padT + (1 - v / 80) * ih;

  const sharing = [38, 24, 15]; // public sharing rate ↓
  const value = [22, 39, 43]; // private recommendation ↑ (commercial value proxy)
  const renewal = [36, 52, 57]; // renewal consideration ↑

  const line = (vals: number[]) => vals.map((v, i) => `${x(i)},${y(v)}`).join(' ');

  return (
    <div style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, borderRadius: '16px', padding: '24px 20px', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: '600px', display: 'block' }}>
        {/* gridlines */}
        {[0, 20, 40, 60, 80].map((g) => (
          <g key={g}>
            <line x1={padL} y1={y(g)} x2={padL + iw} y2={y(g)} stroke={C.line} strokeWidth={1} />
            <text x={padL - 8} y={y(g) + 4} fontFamily={mono} fontSize={11} fill={C.muted} textAnchor="end">{g}%</text>
          </g>
        ))}
        {ages.map((a, i) => (
          <text key={a} x={x(i)} y={H - 18} fontFamily={mono} fontSize={13} fill={C.inkSoft} textAnchor="middle" fontWeight={600}>
            {a}
          </text>
        ))}

        {/* renewal (faint) */}
        <polyline points={line(renewal)} fill="none" stroke={C.slate} strokeWidth={2} strokeDasharray="4 4" opacity={0.6} />
        {/* value (teal, up) */}
        <polyline points={line(value)} fill="none" stroke={C.teal} strokeWidth={3.5} />
        {/* sharing (rose, down) */}
        <polyline points={line(sharing)} fill="none" stroke={C.rose} strokeWidth={3.5} />

        {value.map((v, i) => (<circle key={`v${i}`} cx={x(i)} cy={y(v)} r={5} fill={C.teal} />))}
        {sharing.map((v, i) => (<circle key={`s${i}`} cx={x(i)} cy={y(v)} r={5} fill={C.rose} />))}
        {renewal.map((v, i) => (<circle key={`r${i}`} cx={x(i)} cy={y(v)} r={3.5} fill={C.slate} opacity={0.7} />))}

        {/* end labels */}
        <text x={padL + iw + 12} y={y(sharing[2]) + 4} fontFamily={sans} fontSize={13} fontWeight={600} fill={C.rose}>Public sharing</text>
        <text x={padL + iw + 12} y={y(value[2]) + 4} fontFamily={sans} fontSize={13} fontWeight={600} fill={C.teal}>Private rec.</text>
        <text x={padL + iw + 12} y={y(renewal[2]) + 4} fontFamily={sans} fontSize={12} fontWeight={500} fill={C.slate}>Renewal intent</text>
      </svg>
      <div style={{ fontFamily: mono, fontSize: '11px', color: C.muted, marginTop: '12px', letterSpacing: '0.03em' }}>
        As children get older, commercial value &amp; private recommendation rise — but public sharing falls. Anonymized &amp; simulated.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chart — age group grouped bars                                       */
/* ------------------------------------------------------------------ */
function AgeGroupBars() {
  const rows = [
    { label: 'Viewed child project ≥ weekly', v: [58, 74, 68] },
    { label: 'Child has shareable projects', v: [32, 67, 72] },
    { label: 'Saved project content', v: [41, 63, 56] },
    { label: 'Publicly shared course content', v: [38, 24, 15], highlight: true },
    { label: 'Privately recommended', v: [22, 39, 43] },
    { label: 'High renewal consideration', v: [36, 52, 57] },
    { label: 'Acquired via friend referral', v: [18, 31, 29] },
  ];
  const colors = [C.muted, C.teal, C.walnut];
  const ages = ['4–6', '7–9', '10–12'];
  return (
    <div style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, borderRadius: '16px', padding: '24px' }}>
      <div style={{ display: 'flex', gap: '18px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {ages.map((a, i) => (
          <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ width: '11px', height: '11px', borderRadius: '3px', backgroundColor: colors[i] }} />
            <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.04em', color: C.inkSoft }}>Ages {a}</span>
          </div>
        ))}
      </div>
      {rows.map((row, i) => (
        <div key={i} style={{ marginBottom: i === rows.length - 1 ? 0 : '18px' }}>
          <div style={{ fontFamily: sans, fontSize: '14px', fontWeight: row.highlight ? 700 : 500, color: row.highlight ? C.rose : C.ink, marginBottom: '7px' }}>
            {row.label}{row.highlight ? '  ↓ the paradox' : ''}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {row.v.map((val, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flex: 1, height: '10px', borderRadius: '5px', backgroundColor: C.paperAlt, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${val}%`, backgroundColor: colors[j], borderRadius: '5px' }} />
                </div>
                <span style={{ fontFamily: mono, fontSize: '11px', color: C.inkSoft, width: '34px', textAlign: 'right' }}>{val}%</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chart — sharing funnel                                               */
/* ------------------------------------------------------------------ */
function SharingFunnel() {
  const stages = [
    { t: 'Parent views child project', w: 100, note: 'High among 7–12 parents', tone: 'ok' },
    { t: 'Clicks to generate sharing material', w: 78, note: 'Interested but cautious', tone: 'ok' },
    { t: 'Saves image / video', w: 64, note: 'Wants control before posting', tone: 'ok' },
    { t: 'Edits or rewrites the caption', w: 46, note: 'Official copy feels unsuitable', tone: 'warn' },
    { t: 'Publicly posts to Moments / group', w: 20, note: 'Social risk = the major barrier', tone: 'drop' },
    { t: 'Friend privately asks for details', w: 30, note: 'Conversion moves to private chat', tone: 'recover' },
    { t: 'New user registers / tries course', w: 24, note: 'Private trust-building is critical', tone: 'recover' },
  ];
  const toneColor: Record<string, string> = { ok: C.teal, warn: C.gold, drop: C.rose, recover: C.slate };
  return (
    <div style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, borderRadius: '16px', padding: '24px' }}>
      {stages.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: i === stages.length - 1 ? 0 : '10px' }}>
          <div style={{ width: '46%', flexShrink: 0 }}>
            <div
              style={{
                height: '40px',
                width: `${s.w}%`,
                minWidth: '120px',
                marginLeft: 'auto',
                background: toneColor[s.tone],
                opacity: s.tone === 'drop' ? 1 : 0.85,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '10px',
              }}
            >
              <span style={{ fontFamily: mono, fontSize: '11px', color: '#fff', fontWeight: 600 }}>{s.w}</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: sans, fontSize: '14px', fontWeight: 600, color: C.ink }}>{s.t}</div>
            <div style={{ fontFamily: sans, fontSize: '12.5px', fontWeight: 300, color: s.tone === 'drop' ? C.rose : C.muted }}>{s.note}</div>
          </div>
        </div>
      ))}
      <div style={{ fontFamily: mono, fontSize: '11px', color: C.muted, marginTop: '18px', letterSpacing: '0.03em' }}>
        Relative funnel pattern, not exact metrics. The public-post step collapses; real referral re-emerges in private chat.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chart — sharing barriers (% + intensity)                             */
/* ------------------------------------------------------------------ */
function BarrierChart() {
  const segColor: Record<string, string> = { '7–9': C.teal, '10–12': C.walnut, '7–12': C.slate };
  const data = [
    { t: 'Sharing material feels too promotional', pct: 68, intensity: 4.4, seg: '7–9' },
    { t: 'Fear of looking like showing off', pct: 61, intensity: 4.2, seg: '7–9' },
    { t: 'Not knowing what caption to write', pct: 57, intensity: 3.9, seg: '7–9' },
    { t: 'Not wanting to reveal learning path', pct: 49, intensity: 4.3, seg: '10–12' },
    { t: 'Public posting feels unnecessary (older kids)', pct: 46, intensity: 4.0, seg: '10–12' },
    { t: 'Hard to explain project value', pct: 42, intensity: 3.8, seg: '7–12' },
    { t: 'Worry friends ask price / effectiveness', pct: 39, intensity: 3.6, seg: '7–12' },
    { t: 'Project not visually attractive enough', pct: 34, intensity: 3.4, seg: '7–9' },
  ];
  return (
    <div style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, borderRadius: '16px', padding: '24px' }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {Object.entries(segColor).map(([seg, col]) => (
          <div key={seg} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ width: '11px', height: '11px', borderRadius: '3px', backgroundColor: col }} />
            <span style={{ fontFamily: mono, fontSize: '11px', color: C.inkSoft }}>Mainly {seg}</span>
          </div>
        ))}
      </div>
      {data.map((d, i) => (
        <div key={i} style={{ marginBottom: i === data.length - 1 ? 0 : '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', marginBottom: '6px' }}>
            <span style={{ fontFamily: sans, fontSize: '14px', fontWeight: 500, color: C.ink }}>{d.t}</span>
            <span style={{ display: 'flex', gap: '10px', flexShrink: 0, alignItems: 'baseline' }}>
              <span style={{ fontFamily: mono, fontSize: '13px', fontWeight: 700, color: segColor[d.seg] }}>{d.pct}%</span>
              <span style={{ fontFamily: mono, fontSize: '11px', color: C.muted }}>{d.intensity}/5</span>
            </span>
          </div>
          <div style={{ height: '12px', borderRadius: '6px', backgroundColor: C.paperAlt, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${d.pct}%`, backgroundColor: segColor[d.seg], borderRadius: '6px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chart — pain-point prioritization (composite)                        */
/* ------------------------------------------------------------------ */
function PriorityChart() {
  const dims = [
    { key: 'Frequency', color: C.teal },
    { key: 'Intensity', color: C.gold },
    { key: 'Business impact', color: C.walnut },
    { key: 'Design feasibility', color: C.slate },
  ];
  const data = [
    { name: 'Sharing material feels too promotional', v: [5, 5, 5, 4] },
    { name: 'Want to show progress but fear looking boastful', v: [4, 5, 5, 4] },
    { name: 'Don’t know how to write an appropriate caption', v: [5, 4, 4, 5] },
    { name: 'Public exposure lacks private-referral support', v: [4, 4, 5, 4] },
    { name: 'Don’t want to reveal the learning path', v: [3, 5, 4, 4] },
    { name: 'Can’t easily explain project value', v: [4, 4, 4, 4] },
    { name: 'Teacher sharing prompts feel too task-driven', v: [3, 4, 4, 3] },
    { name: 'Child project not visually attractive enough', v: [3, 3, 3, 3] },
  ];
  const max = 20;
  return (
    <div style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, borderRadius: '16px', padding: '24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        {dims.map((d) => (
          <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ width: '11px', height: '11px', borderRadius: '3px', backgroundColor: d.color }} />
            <span style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.04em', color: C.inkSoft }}>{d.key}</span>
          </div>
        ))}
      </div>
      {data.map((row, i) => {
        const total = row.v.reduce((a, b) => a + b, 0);
        return (
          <div key={i} style={{ marginBottom: i === data.length - 1 ? 0 : '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontFamily: sans, fontSize: '14px', fontWeight: 500, color: C.ink, lineHeight: 1.4 }}>{row.name}</span>
              <span style={{ fontFamily: mono, fontSize: '15px', fontWeight: 700, color: C.teal, flexShrink: 0 }}>{total}</span>
            </div>
            <div style={{ display: 'flex', height: '16px', borderRadius: '5px', overflow: 'hidden', backgroundColor: C.paperAlt }}>
              {row.v.map((val, j) => (
                <div key={j} style={{ width: `${(val / max) * 100}%`, backgroundColor: dims[j].color, height: '100%' }} title={`${dims[j].key}: ${val}`} />
              ))}
            </div>
          </div>
        );
      })}
      <div style={{ fontFamily: mono, fontSize: '11px', color: C.muted, marginTop: '20px', letterSpacing: '0.03em' }}>
        Composite = Frequency + Intensity + Business impact + Design feasibility (each 1–5). Anonymized &amp; simulated.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chart — willingness to share by content type                         */
/* ------------------------------------------------------------------ */
function ContentWillingness() {
  const levels: Record<string, { v: number; label: string; color: string }> = {
    high: { v: 1, label: 'High', color: C.teal },
    medHigh: { v: 0.72, label: 'Medium–High', color: C.gold },
    lowMed: { v: 0.4, label: 'Low–Medium', color: C.slate },
    low: { v: 0.2, label: 'Low', color: C.rose },
  };
  const rows: { t: string; lvl: keyof typeof levels; why: string }[] = [
    { t: 'Child project screenshot or short video', lvl: 'high', why: 'Child-centered, less promotional' },
    { t: 'Parent-editable growth card', lvl: 'high', why: 'Parent controls tone & disclosure' },
    { t: 'Private referral explanation card', lvl: 'high', why: 'Fits 10–12 one-to-one referral' },
    { t: 'Teacher’s specific praise', lvl: 'medHigh', why: 'Validates the child’s progress' },
    { t: 'Stage-based learning report', lvl: 'medHigh', why: 'Good for family / private sharing' },
    { t: 'Discount / referral reward poster', lvl: 'lowMed', why: 'Feels too transactional' },
    { t: 'Marketing poster with QR code', lvl: 'low', why: 'Feels like advertising' },
  ];
  return (
    <div style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, borderRadius: '16px', padding: '10px 8px' }}>
      {rows.map((r, i) => {
        const m = levels[r.lvl];
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${C.line}` }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: sans, fontSize: '15px', fontWeight: 500, color: C.ink }}>{r.t}</div>
              <div style={{ fontFamily: sans, fontSize: '12.5px', fontWeight: 300, color: C.muted }}>{r.why}</div>
            </div>
            <div style={{ width: '150px', flexShrink: 0 }}>
              <div style={{ height: '10px', borderRadius: '6px', backgroundColor: C.paperAlt, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${m.v * 100}%`, backgroundColor: m.color, borderRadius: '6px' }} />
              </div>
            </div>
            <div style={{ width: '104px', flexShrink: 0, textAlign: 'right', fontFamily: mono, fontSize: '11px', fontWeight: 600, color: m.color }}>
              {m.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Theme card with quote                                                */
/* ------------------------------------------------------------------ */
function ThemeCard({ no, title, quote }: { no: string; title: string; quote: string }) {
  return (
    <div style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, borderRadius: '16px', padding: '24px' }}>
      <div style={{ fontFamily: mono, fontSize: '12px', fontWeight: 700, color: C.teal, letterSpacing: '0.06em', marginBottom: '10px' }}>
        THEME {no}
      </div>
      <h3 style={{ fontFamily: sans, fontSize: '18px', fontWeight: 600, color: C.ink, margin: '0 0 14px', lineHeight: 1.35 }}>{title}</h3>
      <div style={{ borderLeft: `3px solid ${C.teal}`, paddingLeft: '14px' }}>
        <p style={{ fontFamily: sans, fontSize: '14.5px', fontWeight: 300, fontStyle: 'italic', color: C.inkSoft, margin: 0, lineHeight: 1.55 }}>
          “{quote}”
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Opportunities                                                        */
/* ------------------------------------------------------------------ */
function Opportunities() {
  const ops = [
    { n: '01', t: 'Child growth evidence cards', d: 'Replace brand-centered course posters with child-centered cards: the project, one learning point, a parent-friendly explanation, light brand presence, editable caption.', tag: 'Theme 1' },
    { n: '02', t: 'Disclosure-tiered sharing versions', d: 'Growth-record (Moments, low), Family-explanation (family group, medium), Private-referral (1:1 chat, high) — parents pick how much of the learning path to reveal.', tag: 'Theme 3' },
    { n: '03', t: 'Natural caption templates', d: 'Editable, socially-safe captions (low-key record, growth observation, light humor) that defuse the “showing off vs. advertising” anxiety while keeping the parent’s voice.', tag: 'Theme 5' },
    { n: '04', t: 'Trigger at emotional high points', d: 'Prompt sharing after first independent project, specific teacher praise, or when the child explains the logic — never right after payment or a generic reminder.', tag: 'Emotion' },
    { n: '05', t: 'Two-step referral journey', d: 'Public growth card sparks curiosity → friend asks privately → private referral card builds trust → trial class. Don’t expect one post to convert.', tag: 'Theme 4' },
    { n: '06', t: 'Redefine sharing metrics', d: 'Beyond public repost rate: project saves, card edits, private-referral generation, friend consultations, and friend-referral acquisition.', tag: 'Measurement' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px' }}>
      {ops.map((o) => (
        <div key={o.n} style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, borderRadius: '18px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontFamily: mono, fontSize: '26px', fontWeight: 700, color: C.paperAlt, WebkitTextStroke: `1px ${C.teal}` }}>{o.n}</span>
            <Pill text={o.tag} color={C.walnut} />
          </div>
          <h3 style={{ fontFamily: sans, fontSize: '19px', fontWeight: 600, color: C.ink, margin: '0 0 10px', lineHeight: 1.3 }}>{o.t}</h3>
          <p style={{ fontFamily: sans, fontSize: '15px', fontWeight: 300, lineHeight: 1.6, color: C.inkSoft, margin: 0 }}>{o.d}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Risks                                                                */
/* ------------------------------------------------------------------ */
function RiskList() {
  const risks = [
    { t: 'High satisfaction ≠ public sharing', d: 'Privacy, low social-media use, or the child’s own preference can override NPS. Don’t treat public posts as the only referral signal.' },
    { t: 'Don’t exploit education anxiety', d: 'Avoid “don’t let your child fall behind.” Frame around creation & expression, not fear-based pressure.' },
    { t: 'Low brand exposure may cut short-term conversion', d: 'Layer it: low-brand public card → clearer detail page → conversion-focused private card → teacher follow-up.' },
    { t: 'Older children may not want to be shown', d: 'For 10–12, focus cards on the project, not the child’s face/identity; avoid real photos unless both opt in.' },
    { t: 'Packaging can’t fix weak learning output', d: 'Sharing design must pair with curriculum — key projects need both learning value and presentation value.' },
    { t: 'Private referral is hard to track', d: 'Use indirect signals: referral-card generation, source attribution, consultation entry, invitation codes.' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '14px' }}>
      {risks.map((r, i) => (
        <div key={i} style={{ display: 'flex', gap: '14px', backgroundColor: C.card, border: `1px solid ${C.line}`, borderRadius: '14px', padding: '20px' }}>
          <span style={{ fontFamily: mono, fontSize: '13px', fontWeight: 700, color: C.rose, flexShrink: 0 }}>R{i + 1}</span>
          <div>
            <div style={{ fontFamily: sans, fontSize: '15px', fontWeight: 600, color: C.ink, marginBottom: '4px' }}>{r.t}</div>
            <div style={{ fontFamily: sans, fontSize: '14px', fontWeight: 300, color: C.inkSoft, lineHeight: 1.5 }}>{r.d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reframe panel                                                        */
/* ------------------------------------------------------------------ */
function ReframePanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]" style={{ gap: '20px', alignItems: 'center' }}>
      <div style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, borderRadius: '16px', padding: '26px' }}>
        <span style={{ fontFamily: mono, fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>ORIGINAL GOAL</span>
        <p style={{ fontFamily: sans, fontSize: '19px', fontWeight: 400, color: C.inkSoft, lineHeight: 1.45, margin: '12px 0 0' }}>
          “How can we make parents share &amp; refer more?”
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', color: C.teal, fontFamily: mono, fontSize: '24px' }}>→</div>
      <div style={{ backgroundColor: C.tealDeep, borderRadius: '16px', padding: '26px' }}>
        <span style={{ fontFamily: mono, fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: C.gold }}>REFRAMED GOAL</span>
        <p style={{ fontFamily: sans, fontSize: '19px', fontWeight: 500, color: '#fff', lineHeight: 1.45, margin: '12px 0 0' }}>
          “How can we help parents express their child’s growth in a way that feels natural, low-pressure, and controllable?”
        </p>
      </div>
    </div>
  );
}

/* ================================================================== */
/* PAGE                                                                 */
/* ================================================================== */
export default function WalnutSharingPage() {
  const isMobile = useIsMobile();

  return (
    <div className="mei-project-page" style={{ backgroundColor: C.paper, fontFamily: sans, color: C.ink }}>
      <CaseStudyControls />
      {/* HERO */}
      <CaseStudyHero
        title="Parent Sharing Behavior"
        subtitle="A UX research case study on referral behavior, social image, and parent willingness to share learning progress."
        tags={['UX Research', 'Growth', 'Referral', 'Education', 'Behavioral Insight']}
        aboutLabel="About the Research"
        about="This study explores why parents do or do not share children's learning content publicly. The case turns qualitative patterns into product and content opportunities that trade promotion pressure for permission and parent-centered storytelling."
        meta={[
          { label: 'Role', value: ['UX Researcher'] },
          { label: 'Team', value: ['Research lead,', 'Growth stakeholders'] },
          { label: 'Tool', value: ['Interview synthesis,', 'Pain scoring,', 'Opportunity framing'] },
          { label: 'Company', value: ['Walnut Education'] },
          { label: 'Year', value: ['Research dossier'] },
        ]}
      />

      {/* 01 CONTEXT + paradox */}
      <FullBleed bg={C.card}>
        <Reveal>
          <Eyebrow index="01" label="The Counterintuitive Finding" />
          <H2>The most valuable parents were the least willing to share in public.</H2>
          <Lead>
            Walnut Coding already had share cards, posters and referral entries. Yet parents of 7–12-year-olds — who showed higher
            project completion, saving, private recommendation and renewal — publicly shared <em>less</em> than parents of 4–6-year-olds.
            Public-sharing willingness doesn’t rise with course value; it gets socially heavier.
          </Lead>
          <div style={{ marginTop: '40px' }}>
            <ParadoxChart />
          </div>
        </Reveal>
      </FullBleed>

      {/* 02 REFRAME */}
      <FullBleed bg={C.paper}>
        <Reveal>
          <Eyebrow index="02" label="Reframing the Goal" />
          <H2>The problem wasn’t satisfaction — it was social risk.</H2>
          <Lead max={760}>
            Parents weren’t unwilling to recommend. They were unwilling to recommend in a way that felt public, promotional, socially
            risky, or overly revealing. So the question shifted from “make them share more” to “help them express growth comfortably.”
          </Lead>
          <div style={{ marginTop: '40px' }}>
            <ReframePanel />
          </div>
        </Reveal>
      </FullBleed>

      {/* 03 METHOD */}
      <FullBleed bg={C.card}>
        <Reveal>
          <Eyebrow index="03" label="Research Design" />
          <H2>Mixed-method: internal data, then 16 depth interviews.</H2>
          <Lead>
            A three-stage approach — data diagnosis to find the high-value-but-low-sharing segment, qualitative exploration of the
            “why,” then translation into design implications. Channels (Moments, parent groups, family groups, private chat) were
            analyzed as psychologically distinct contexts.
          </Lead>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '16px', marginTop: '36px' }}>
            {[
              { seg: '7–9', n: 8, d: 'Foundational skill-building stage — strong documentation habit, but advertising-tone & showing-off sensitive.' },
              { seg: '10–12', n: 6, d: 'Advanced, rational stage — private, cautious; learning plans feel personal.' },
              { seg: '4–6', n: 2, d: 'Comparison group — shares more around cuteness & first attempts.' },
            ].map((s) => (
              <div key={s.seg} style={{ border: `1px solid ${C.line}`, borderRadius: '16px', padding: '26px', backgroundColor: C.paper }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontFamily: sans, fontSize: '34px', fontWeight: 600, color: C.teal, lineHeight: 1 }}>{s.n}</span>
                  <span style={{ fontFamily: mono, fontSize: '12px', color: C.muted }}>parents · ages {s.seg}</span>
                </div>
                <p style={{ fontFamily: sans, fontSize: '14px', fontWeight: 300, color: C.inkSoft, lineHeight: 1.55, margin: 0 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </FullBleed>

      {/* 04 NUMBERS */}
      <FullBleed bg={C.paper}>
        <Reveal>
          <Eyebrow index="04" label="The Paradox in Numbers" />
          <H2>Value signals climb with age — public sharing drops.</H2>
          <Lead max={730}>
            Across seven indicators, the 7–12 segment leads on completion, saving, private recommendation and renewal — yet public
            sharing falls from 38% (4–6) to 24% (7–9) to 15% (10–12).
          </Lead>
          <div style={{ marginTop: '36px' }}>
            <AgeGroupBars />
          </div>
        </Reveal>
      </FullBleed>

      {/* 05 THEMES */}
      <FullBleed bg={C.card}>
        <Reveal>
          <Eyebrow index="05" label="Why They Hold Back" />
          <H2>Six themes behind the silence.</H2>
          <Lead max={730}>
            From behavioral-recall stories and paraphrased quotes — parents are managing social image, privacy, comparison and
            parenting identity, not avoiding the product.
          </Lead>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px', marginTop: '36px' }}>
          <Reveal><ThemeCard no="1" title="They’re not sharing the course — they’re sharing proof of a good education decision" quote="I didn’t want to promote the course. I just felt my child could finally explain how the game worked." /></Reveal>
          <Reveal delay={60}><ThemeCard no="2" title="They want to show progress, but not look like they’re showing off" quote="I want people to see the progress, but I don’t want them to think I am showing off." /></Reveal>
          <Reveal delay={120}><ThemeCard no="3" title="Show the result, but don’t necessarily reveal the path" quote="I can show what my child made, but I don’t always want to say where she learned it." /></Reveal>
          <Reveal><ThemeCard no="4" title="Public sharing and private recommendation are different behaviors" quote="I wouldn’t post it publicly, but if a close friend asks, I can explain it in detail." /></Reveal>
          <Reveal delay={60}><ThemeCard no="5" title="Many don’t share because they can’t find the right sentence" quote="The project was good, but I didn’t know what to write." /></Reveal>
          <Reveal delay={120}><ThemeCard no="6" title="Barriers differ between 7–9 and 10–12" quote="My child is older now. Learning plans feel more private, so I’d rather talk about it one-to-one." /></Reveal>
        </div>
      </FullBleed>

      {/* 06 FUNNEL */}
      <FullBleed bg={C.paper}>
        <Reveal>
          <Eyebrow index="06" label="The Sharing Funnel" />
          <H2>The public-post step collapses — referral re-emerges in private chat.</H2>
          <Lead max={730}>
            Parents view, generate, save and even rewrite captions — then stall at the public post, where social risk peaks. The real
            conversion quietly moves into one-to-one conversations.
          </Lead>
          <div style={{ marginTop: '36px' }}>
            <SharingFunnel />
          </div>
        </Reveal>
      </FullBleed>

      {/* 07 BARRIERS */}
      <FullBleed bg={C.card}>
        <Reveal>
          <Eyebrow index="07" label="Sharing Barriers" />
          <H2>What stops them, by reach and intensity.</H2>
          <Lead max={730}>
            7–9 parents are blocked by advertising tone, showing-off fear and caption anxiety; 10–12 parents by path privacy and a
            sense that public posting is simply unnecessary.
          </Lead>
          <div style={{ marginTop: '36px' }}>
            <BarrierChart />
          </div>
        </Reveal>
      </FullBleed>

      {/* 08 PRIORITY */}
      <FullBleed bg={C.paper}>
        <Reveal>
          <Eyebrow index="08" label="Pain-Point Prioritization" />
          <H2>Scoring by frequency, intensity, business impact &amp; feasibility.</H2>
          <Lead max={730}>
            The top problem isn’t low satisfaction — it’s that parents lack a socially comfortable way to express their child’s
            progress.
          </Lead>
          <div style={{ marginTop: '36px' }}>
            <PriorityChart />
          </div>
        </Reveal>
      </FullBleed>

      {/* 09 CONTENT WILLINGNESS */}
      <FullBleed bg={C.card}>
        <Reveal>
          <Eyebrow index="09" label="What They Will & Won’t Share" />
          <H2>Child-centered, editable content wins; QR posters lose.</H2>
          <Lead max={730}>
            Willingness tracks how child-centered and controllable the content feels — and how far it sits from looking like an ad.
          </Lead>
          <div style={{ marginTop: '36px' }}>
            <ContentWillingness />
          </div>
        </Reveal>
      </FullBleed>

      {/* 10 OPPORTUNITIES */}
      <FullBleed bg={C.paper}>
        <Reveal>
          <Eyebrow index="10" label="Opportunities & Design Implications" />
          <H2>Six moves that trade promotion for permission.</H2>
          <Lead max={730}>
            Each maps back to a theme and helps parents say something they already want to say — without speaking for the brand.
          </Lead>
          <div style={{ marginTop: '40px' }}>
            <Opportunities />
          </div>
        </Reveal>
      </FullBleed>

      {/* 11 RISKS */}
      <FullBleed bg={C.card}>
        <Reveal>
          <Eyebrow index="11" label="Risks & Counter-Signals" />
          <H2>Where the thesis could break.</H2>
          <Lead max={730}>
            Naming the counter-signals keeps the recommendations honest and the next validation round sharp.
          </Lead>
          <div style={{ marginTop: '36px' }}>
            <RiskList />
          </div>
        </Reveal>
      </FullBleed>

      {/* 12 CONCLUSION */}
      <FullBleed bg={C.tealDeep} pad={isMobile ? '72px 24px' : '96px 24px'}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontFamily: mono, fontSize: '12px', fontWeight: 600, letterSpacing: '0.14em', color: C.gold }}>12</span>
            <span style={{ width: '28px', height: '1px', backgroundColor: C.gold, opacity: 0.6 }} />
            <span style={{ fontFamily: mono, fontSize: '12px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
              Conclusion
            </span>
          </div>
          <h2 style={{ fontFamily: sans, fontSize: 'clamp(24px, 3.4vw, 38px)', fontWeight: 500, color: '#fff', lineHeight: 1.25, margin: '0 0 24px', maxWidth: '860px', letterSpacing: '-0.01em' }}>
            Don’t make parents speak for the brand — help them say what they already want to say.
          </h2>
          <p style={{ fontFamily: sans, fontSize: '18px', fontWeight: 300, lineHeight: 1.62, color: 'rgba(255,255,255,0.82)', maxWidth: '780px', margin: '0 0 28px' }}>
            For 7–12 families, course value and public-sharing willingness move in opposite directions: as coding becomes tied to
            long-term skill, learning strategy and peer competition, public sharing gets riskier. Growth design here is not interface
            optimization — it’s understanding how parents manage social image, privacy, comparison and parenting identity.
          </p>
          <p style={{ fontFamily: sans, fontSize: '20px', fontWeight: 500, color: '#fff', lineHeight: 1.45, maxWidth: '720px', margin: 0, fontStyle: 'italic' }}>
            “My child is growing, and this progress is worth recording.”
          </p>
        </Reveal>
      
          <div style={{ marginTop: '56px' }}>
            <CaseStudyBackButton />
          </div>
      </FullBleed>

      
    </div>
  );
}
