'use client';

/**
 * Walnut Coding — Post-Trial Parent Decision-Making (UX Research case study)
 *
 * 这是 portfolio 中第一篇 "Researcher" 方向的研究案例，刻意采用一套全新的
 * "research dossier"（研究档案）设计语言：暖色纸张底、walnut 琥珀主色、等宽
 * 标签字体，并大量使用自绘 SVG / CSS 图表来可视化决策链、信号热力、痛点打分等。
 * 所有图表均为内联实现，不依赖任何图片资源。
 */

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { fontFamily } from '@/lib/design-tokens';

/* ------------------------------------------------------------------ */
/* Design language — research dossier palette                          */
/* ------------------------------------------------------------------ */
const C = {
  paper: '#FAF7F2',
  paperAlt: '#F2EADE',
  ink: '#211C17',
  inkSoft: '#5B5149',
  muted: '#90806E',
  line: 'rgba(33,28,23,0.10)',
  lineStrong: 'rgba(33,28,23,0.20)',
  card: '#FFFFFF',
  walnut: '#A4541E',
  walnutDeep: '#7C3D12',
  sage: '#3E6B5C',
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

function Eyebrow({ index, label, color = C.walnut }: { index: string; label: string; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
      <span
        style={{
          fontFamily: mono,
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.14em',
          color,
        }}
      >
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
        maxWidth: '760px',
      }}
    >
      {children}
    </h2>
  );
}

function Lead({ children, max = 720 }: { children: React.ReactNode; max?: number }) {
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

function Pill({ text, color = C.walnut }: { text: string; color?: string }) {
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
/* Chart — Scratch adoption stats + age band range                     */
/* ------------------------------------------------------------------ */
function ScratchStats() {
  const stats = [
    { value: '135M+', label: 'Registered Scratch users', sub: 'a mainstream creative-coding environment' },
    { value: '164M+', label: 'Projects shared publicly', sub: 'not a niche tool — broad public adoption' },
    { value: '8–16', label: 'Scratch target age', sub: 'ScratchJr covers ages 5–7' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '16px' }}>
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            backgroundColor: C.card,
            border: `1px solid ${C.line}`,
            borderRadius: '16px',
            padding: '26px 24px',
          }}
        >
          <div
            style={{
              fontFamily: sans,
              fontSize: 'clamp(38px, 6vw, 52px)',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: C.walnut,
              lineHeight: 1,
            }}
          >
            {s.value}
          </div>
          <div style={{ fontFamily: sans, fontSize: '15px', fontWeight: 600, color: C.ink, marginTop: '14px' }}>
            {s.label}
          </div>
          <div style={{ fontFamily: sans, fontSize: '13px', fontWeight: 300, color: C.muted, marginTop: '4px' }}>
            {s.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

function AgeBand() {
  // axis 4..16
  const padL = 56;
  const padR = 24;
  const w = 760;
  const innerW = w - padL - padR;
  const x = (age: number) => padL + ((age - 4) / (16 - 4)) * innerW;
  const ticks = [4, 6, 8, 10, 12, 14, 16];
  const bars = [
    { label: 'ScratchJr', from: 5, to: 7, y: 40, fill: C.sage, op: 0.22, stroke: C.sage },
    { label: 'Scratch', from: 8, to: 16, y: 84, fill: C.walnut, op: 0.18, stroke: C.walnut },
  ];
  return (
    <div style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, borderRadius: '16px', padding: '24px 20px', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${w} 200`} width="100%" style={{ minWidth: '560px', display: 'block' }}>
        {/* grid */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} y1={28} x2={x(t)} y2={150} stroke={C.line} strokeWidth={1} />
            <text x={x(t)} y={170} fontFamily={mono} fontSize={12} fill={C.muted} textAnchor="middle">
              {t}
            </text>
          </g>
        ))}
        <text x={padL} y={190} fontFamily={mono} fontSize={11} fill={C.muted} letterSpacing="0.08em">
          AGE
        </text>
        {/* product bars */}
        {bars.map((b) => (
          <g key={b.label}>
            <rect
              x={x(b.from)}
              y={b.y}
              width={x(b.to) - x(b.from)}
              height={28}
              rx={8}
              fill={b.fill}
              fillOpacity={b.op}
              stroke={b.stroke}
              strokeOpacity={0.5}
            />
            <text x={x(b.from) + 10} y={b.y + 18} fontFamily={sans} fontSize={13} fontWeight={600} fill={b.stroke}>
              {b.label} · {b.from}–{b.to}
            </text>
          </g>
        ))}
        {/* Walnut focus overlay 8-12 */}
        <rect x={x(8)} y={30} width={x(12) - x(8)} height={120} rx={10} fill={C.walnut} fillOpacity={0.07} stroke={C.walnut} strokeDasharray="5 4" strokeWidth={1.5} />
        <text x={(x(8) + x(12)) / 2} y={22} fontFamily={mono} fontSize={11} fontWeight={600} fill={C.walnutDeep} textAnchor="middle" letterSpacing="0.06em">
          RESEARCH FOCUS · 8–12
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chart — decision ladder                                              */
/* ------------------------------------------------------------------ */
function DecisionLadder() {
  const steps = [
    { t: 'Child likes the trial class', tone: 'start' },
    { t: 'Did the child truly understand anything?' },
    { t: 'Is this suitable for the child’s age and level?' },
    { t: 'Will the formal course differ from the trial?' },
    { t: 'How much parent support will be needed?' },
    { t: 'Is Scratch still the right entry point?' },
    { t: 'How does it compare with free / offline / Python options?' },
    { t: 'Is this worth paying for?', tone: 'end' },
  ];
  return (
    <div style={{ position: 'relative', paddingLeft: '8px' }}>
      {steps.map((s, i) => {
        const isStart = s.tone === 'start';
        const isEnd = s.tone === 'end';
        const dot = isEnd ? C.walnut : isStart ? C.sage : C.gold;
        return (
          <div key={i} style={{ position: 'relative', display: 'flex', gap: '20px', paddingBottom: i === steps.length - 1 ? 0 : '20px' }}>
            {/* rail */}
            <div style={{ position: 'relative', width: '20px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
              {i !== steps.length - 1 && (
                <span style={{ position: 'absolute', top: '20px', bottom: '-20px', width: '2px', backgroundColor: C.line }} />
              )}
              <span
                style={{
                  width: isEnd || isStart ? '18px' : '12px',
                  height: isEnd || isStart ? '18px' : '12px',
                  borderRadius: '50%',
                  backgroundColor: isEnd || isStart ? dot : C.paper,
                  border: `2px solid ${dot}`,
                  marginTop: '4px',
                  zIndex: 1,
                }}
              />
            </div>
            <div
              style={{
                flex: 1,
                backgroundColor: isEnd ? C.walnut : C.card,
                border: `1px solid ${isEnd ? C.walnut : C.line}`,
                borderRadius: '12px',
                padding: '14px 18px',
                marginBottom: '0',
              }}
            >
              <div
                style={{
                  fontFamily: sans,
                  fontSize: isEnd || isStart ? '17px' : '15px',
                  fontWeight: isEnd || isStart ? 600 : 400,
                  color: isEnd ? '#fff' : C.ink,
                  lineHeight: 1.45,
                }}
              >
                {s.t}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chart — directional signal heatmap                                   */
/* ------------------------------------------------------------------ */
function SignalHeatmap() {
  const levelMeta: Record<string, { v: number; label: string; color: string }> = {
    high: { v: 1, label: 'High', color: C.walnut },
    medHigh: { v: 0.72, label: 'Medium–High', color: C.gold },
    lowMed: { v: 0.34, label: 'Low–Medium', color: C.sage },
  };
  const rows: { t: string; lvl: keyof typeof levelMeta }[] = [
    { t: 'Parents wanted to know whether the child truly understood', lvl: 'high' },
    { t: 'Parents wanted a professional assessment from trial performance', lvl: 'high' },
    { t: 'Parents delayed payment when the post-Scratch path was unclear', lvl: 'high' },
    { t: 'Confidence rose when the child could explain the project', lvl: 'high' },
    { t: 'Worry about parent involvement required after payment', lvl: 'medHigh' },
    { t: 'Compared free tutorials or other coding options', lvl: 'medHigh' },
    { t: '“My child found it fun” alone was enough to pay', lvl: 'lowMed' },
  ];
  return (
    <div style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, borderRadius: '16px', padding: '10px 8px' }}>
      {rows.map((r, i) => {
        const m = levelMeta[r.lvl];
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '14px 16px',
              borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${C.line}`,
            }}
          >
            <div style={{ flex: 1, fontFamily: sans, fontSize: '15px', fontWeight: 400, color: C.ink }}>{r.t}</div>
            {/* intensity bar */}
            <div style={{ width: '160px', flexShrink: 0, display: 'none' }} className="md:block" />
            <div style={{ width: '180px', flexShrink: 0 }}>
              <div style={{ height: '10px', borderRadius: '6px', backgroundColor: C.paperAlt, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${m.v * 100}%`, backgroundColor: m.color, borderRadius: '6px' }} />
              </div>
            </div>
            <div
              style={{
                width: '108px',
                flexShrink: 0,
                textAlign: 'right',
                fontFamily: mono,
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: m.color,
              }}
            >
              {m.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chart — pain-point priority (segmented bars)                         */
/* ------------------------------------------------------------------ */
function PriorityChart() {
  const dims = [
    { key: 'Frequency', color: C.walnut },
    { key: 'Intensity', color: C.gold },
    { key: 'Alt. pressure', color: C.sage },
    { key: 'Conversion impact', color: C.slate },
  ];
  const data = [
    { name: 'Parents unsure the child truly understood programming logic', v: [5, 5, 4, 5] },
    { name: 'No personalized professional assessment after the trial', v: [5, 4, 4, 5] },
    { name: 'Scratch’s follow-up learning path is unclear', v: [4, 4, 4, 5] },
    { name: 'Child completes the project but cannot explain it', v: [4, 4, 4, 4] },
    { name: 'Free tutorials / competitors weaken the paid rationale', v: [4, 4, 5, 3] },
    { name: 'Parents worry formal courses require too much involvement', v: [4, 4, 3, 4] },
  ];
  const max = 20; // 5 * 4 dims
  return (
    <div style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, borderRadius: '16px', padding: '24px' }}>
      {/* legend */}
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
          <div key={i} style={{ marginBottom: i === data.length - 1 ? 0 : '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontFamily: sans, fontSize: '14px', fontWeight: 500, color: C.ink, lineHeight: 1.4 }}>{row.name}</span>
              <span style={{ fontFamily: mono, fontSize: '15px', fontWeight: 700, color: C.walnut, flexShrink: 0 }}>{total}</span>
            </div>
            <div style={{ display: 'flex', height: '16px', borderRadius: '5px', overflow: 'hidden', backgroundColor: C.paperAlt }}>
              {row.v.map((val, j) => (
                <div
                  key={j}
                  style={{
                    width: `${(val / max) * 100}%`,
                    backgroundColor: dims[j].color,
                    height: '100%',
                  }}
                  title={`${dims[j].key}: ${val}`}
                />
              ))}
            </div>
          </div>
        );
      })}
      <div style={{ fontFamily: mono, fontSize: '11px', color: C.muted, marginTop: '20px', letterSpacing: '0.03em' }}>
        Composite priority = Frequency + Intensity + Alternative pressure + Conversion impact (each 1–5). Reconstructed &amp; illustrative.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chart — alternatives reassurance                                     */
/* ------------------------------------------------------------------ */
function AlternativesGrid() {
  const items = [
    { alt: 'Free Scratch tutorials', surface: 'No cost', deep: 'I can test interest without wasting money.', resp: 'We cut the cost of judging, planning & supporting learning alone.' },
    { alt: 'Offline institutions', surface: 'On-site supervision', deep: 'My child won’t just pretend to learn.', resp: 'Feedback, homework review & stuck-point support replace physical watching.' },
    { alt: 'Python courses', surface: 'Feels like “real coding”', deep: 'My child won’t waste time on something childish.', resp: 'Scratch is a logic-training entry point, not a low-age toy.' },
    { alt: 'Lego robotics', surface: 'Tangible output', deep: 'My child actually made something visible.', resp: 'We emphasize software project creation & logical expression.' },
    { alt: 'Math / English tutoring', surface: 'More essential', deep: 'My money goes to more certain returns.', resp: 'Coding complements academics — problem-solving & tech literacy.' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '14px' }}>
      {items.map((it) => (
        <div
          key={it.alt}
          style={{
            backgroundColor: C.paper,
            border: `1px solid ${C.line}`,
            borderRadius: '14px',
            padding: '20px',
          }}
        >
          <div style={{ fontFamily: sans, fontSize: '16px', fontWeight: 600, color: C.ink, marginBottom: '4px' }}>{it.alt}</div>
          <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.04em', color: C.muted, marginBottom: '14px' }}>
            {it.surface.toUpperCase()}
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontFamily: mono, fontSize: '11px', color: C.gold, fontWeight: 700, flexShrink: 0, width: '78px' }}>REASSURES</span>
            <span style={{ fontFamily: sans, fontSize: '14px', fontWeight: 300, color: C.inkSoft, fontStyle: 'italic' }}>“{it.deep}”</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ fontFamily: mono, fontSize: '11px', color: C.walnut, fontWeight: 700, flexShrink: 0, width: '78px' }}>WALNUT</span>
            <span style={{ fontFamily: sans, fontSize: '14px', fontWeight: 400, color: C.ink }}>{it.resp}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Insight card                                                         */
/* ------------------------------------------------------------------ */
function InsightCard({
  no,
  title,
  body,
  takeaway,
  children,
}: {
  no: string;
  title: string;
  body: string;
  takeaway: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: '20px',
        padding: 'clamp(24px, 4vw, 40px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '14px' }}>
        <span style={{ fontFamily: mono, fontSize: '13px', fontWeight: 700, color: C.walnut, letterSpacing: '0.08em' }}>
          INSIGHT {no}
        </span>
      </div>
      <h3 style={{ fontFamily: sans, fontSize: 'clamp(20px, 2.6vw, 26px)', fontWeight: 500, color: C.ink, lineHeight: 1.3, margin: '0 0 16px', maxWidth: '720px' }}>
        {title}
      </h3>
      <p style={{ fontFamily: sans, fontSize: '16px', lineHeight: 1.62, fontWeight: 300, color: C.inkSoft, margin: '0 0 24px', maxWidth: '720px' }}>
        {body}
      </p>
      {children}
      <div
        style={{
          marginTop: '24px',
          borderLeft: `3px solid ${C.walnut}`,
          paddingLeft: '16px',
        }}
      >
        <span style={{ fontFamily: mono, fontSize: '11px', fontWeight: 700, color: C.walnut, letterSpacing: '0.08em' }}>TAKEAWAY</span>
        <p style={{ fontFamily: sans, fontSize: '17px', fontWeight: 500, color: C.ink, margin: '6px 0 0', lineHeight: 1.45, maxWidth: '680px' }}>
          {takeaway}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Translation table (insight 2)                                        */
/* ------------------------------------------------------------------ */
function TranslationFlow() {
  const rows = [
    { child: '“When I click the green flag, it moves.”', teach: 'Understood event triggering' },
    { child: '“I changed the speed.”', teach: 'Saw how parameter changes affect outcomes' },
    { child: '“It didn’t move, so I changed a block.”', teach: 'Early debugging awareness' },
    { child: '“I want to add a monster.”', teach: 'Creative project-extension intent' },
  ];
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: '14px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', backgroundColor: C.paperAlt, padding: '10px 18px' }}>
        <span style={{ flex: 1, fontFamily: mono, fontSize: '11px', letterSpacing: '0.06em', color: C.inkSoft, fontWeight: 600 }}>CHILD SAYS</span>
        <span style={{ flex: 1, fontFamily: mono, fontSize: '11px', letterSpacing: '0.06em', color: C.walnut, fontWeight: 600 }}>TEACHER TRANSLATES →</span>
      </div>
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '14px 18px',
            backgroundColor: C.card,
            borderTop: `1px solid ${C.line}`,
            gap: '12px',
          }}
          className="flex-col md:flex-row"
        >
          <span style={{ flex: 1, fontFamily: sans, fontSize: '15px', fontWeight: 300, fontStyle: 'italic', color: C.inkSoft }}>{r.child}</span>
          <span style={{ flex: 1, fontFamily: sans, fontSize: '15px', fontWeight: 500, color: C.ink }}>{r.teach}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Opportunities                                                        */
/* ------------------------------------------------------------------ */
function Opportunities() {
  const ops = [
    { n: '01', t: 'Risk-Reduction Post-Trial Report', d: 'Reframe the trial summary as evidence: what the child did independently vs. with hints, concepts touched, observed risks, and what the first four formal weeks look like.', tag: 'Insight 1' },
    { n: '02', t: 'Child Explanation + Teacher Translation', d: 'In the final 5 minutes, the child explains one command and one problem; the teacher translates child language into parent-readable learning value.', tag: 'Insight 2' },
    { n: '03', t: 'Age-Specific Trial & Learning Path', d: 'Different post-trial narratives for 8–10 (interest, logic, independence) and 11–12 (variables, conditionals, Python transition).', tag: 'Insight 3' },
    { n: '04', t: 'Decision-Support Comparison Page', d: 'Don’t avoid competitors — help parents choose by situation. Advisory tone beats “we’re better than X.”', tag: 'Insight 4' },
    { n: '05', t: 'Performance-Based Enrollment', d: 'Recommend a starting level from observed behavior, not a discount — turning a sales decision into an education-planning decision.', tag: 'Conversion' },
    { n: '06', t: 'Formal-Course Support Mechanism', d: 'Clarify roles (child / teacher / parent) so busy parents know they won’t end up teaching the course themselves.', tag: 'Time anxiety' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px' }}>
      {ops.map((o) => (
        <div
          key={o.n}
          style={{
            backgroundColor: C.card,
            border: `1px solid ${C.line}`,
            borderRadius: '18px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontFamily: mono, fontSize: '26px', fontWeight: 700, color: C.paperAlt, WebkitTextStroke: `1px ${C.walnut}` }}>{o.n}</span>
            <Pill text={o.tag} color={C.sage} />
          </div>
          <h3 style={{ fontFamily: sans, fontSize: '19px', fontWeight: 600, color: C.ink, margin: '0 0 10px', lineHeight: 1.3 }}>{o.t}</h3>
          <p style={{ fontFamily: sans, fontSize: '15px', fontWeight: 300, lineHeight: 1.6, color: C.inkSoft, margin: 0 }}>{o.d}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Evidence chain (conclusion)                                          */
/* ------------------------------------------------------------------ */
function EvidenceChain() {
  const steps = [
    'Child completes a project',
    'Child explains the logic',
    'Teacher translates into learning value',
    'Parent understands the child’s stage',
    'Parent sees the long-term path',
    'Parent understands Walnut’s value',
    'Parent feels confident to pay',
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'stretch' }}>
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                backgroundColor: last ? C.walnut : C.card,
                border: `1px solid ${last ? C.walnut : C.lineStrong}`,
                color: last ? '#fff' : C.ink,
                borderRadius: '999px',
                padding: '10px 16px',
                fontFamily: sans,
                fontSize: '14px',
                fontWeight: last ? 600 : 400,
              }}
            >
              {s}
            </div>
            {!last && <span style={{ color: C.walnut, fontFamily: mono, fontSize: '16px' }}>→</span>}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Simple two-column "From / To" reframe                                */
/* ------------------------------------------------------------------ */
function ReframePanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]" style={{ gap: '20px', alignItems: 'center' }}>
      <div style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, borderRadius: '16px', padding: '26px' }}>
        <span style={{ fontFamily: mono, fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>ORIGINAL GOAL</span>
        <p style={{ fontFamily: sans, fontSize: '19px', fontWeight: 400, color: C.inkSoft, lineHeight: 1.45, margin: '12px 0 0' }}>
          “How do we make parents more satisfied or more willing to recommend?”
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', color: C.walnut, fontFamily: mono, fontSize: '24px' }}>→</div>
      <div style={{ backgroundColor: C.walnutDeep, borderRadius: '16px', padding: '26px' }}>
        <span style={{ fontFamily: mono, fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: C.gold }}>REFRAMED GOAL</span>
        <p style={{ fontFamily: sans, fontSize: '19px', fontWeight: 500, color: '#fff', lineHeight: 1.45, margin: '12px 0 0' }}>
          “Why do parents hesitate after a trial class, and what evidence do they need before they’re willing to pay?”
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Generic list block                                                   */
/* ------------------------------------------------------------------ */
function RiskList() {
  const risks = [
    { t: 'Trial performance can’t fully predict long-term learning', d: 'Avoid absolute claims; use cautious, observation-based language.' },
    { t: 'Over-assessment may create pressure', d: 'No exam-style scores — use growth-oriented descriptions.' },
    { t: 'Some 12-year-olds are ready for Python directly', d: 'Offer advanced trial elements; Scratch isn’t mandatory for all.' },
    { t: 'Free tutorials genuinely meet some needs', d: 'Don’t dismiss them — frame by goal, not superiority.' },
    { t: 'Offline institutions have a real supervision edge', d: 'Make online support (follow-up, review, showcase) visible.' },
    { t: 'Learnings may not generalize across segments', d: 'Segment future validation by intent, price- and time-sensitivity.' },
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

/* ================================================================== */
/* PAGE                                                                 */
/* ================================================================== */
export default function WalnutCodingPage() {
  const isMobile = useIsMobile();

  return (
    <div style={{ backgroundColor: C.paper, fontFamily: sans, color: C.ink }}>
      {/* ---------------------------------------------------------- */}
      {/* HERO                                                        */}
      {/* ---------------------------------------------------------- */}
      <FullBleed bg={C.paper} pad={isMobile ? '32px 24px 64px' : '40px 24px 80px'}>
        <Reveal>
          <Link
            href="/works"
            style={{ fontFamily: sans, fontSize: '15px', color: C.muted, textDecoration: 'none', display: 'inline-block', marginBottom: '48px' }}
          >
            ← Back to Work
          </Link>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
            <Pill text="UX Research" />
            <Pill text="Conversion" color={C.sage} />
            <Pill text="EdTech" color={C.slate} />
            <Pill text="Sanitized Case Study" color={C.muted} />
          </div>
          <h1
            style={{
              fontFamily: sans,
              fontSize: 'clamp(34px, 6vw, 60px)',
              lineHeight: 1.08,
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: C.ink,
              margin: '0 0 24px',
              maxWidth: '900px',
            }}
          >
            Walnut Coding: Post-Trial Parent Decision-Making in Children’s Coding Education
          </h1>
          <p style={{ fontFamily: sans, fontSize: 'clamp(18px, 2.4vw, 22px)', lineHeight: 1.55, fontWeight: 300, color: C.inkSoft, maxWidth: '760px', margin: '0 0 40px' }}>
            After an 8–12-year-old finishes a Scratch trial class, how do parents decide within 24–72 hours whether the course is
            worth paying for? A research story about turning a broad business goal into a researchable conversion problem.
          </p>

          {/* meta strip */}
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '1px', backgroundColor: C.line, border: `1px solid ${C.line}`, borderRadius: '14px', overflow: 'hidden' }}>
            {[
              { k: 'Role', v: 'UX Researcher' },
              { k: 'Focus', v: 'Trial → paid decision' },
              { k: 'Segment', v: 'Parents of ages 8–12' },
              { k: 'Window', v: '24–72 hrs post-trial' },
            ].map((m) => (
              <div key={m.k} style={{ backgroundColor: C.paper, padding: '18px 20px' }}>
                <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '0.06em', color: C.muted, marginBottom: '6px' }}>{m.k.toUpperCase()}</div>
                <div style={{ fontFamily: sans, fontSize: '15px', fontWeight: 600, color: C.ink }}>{m.v}</div>
              </div>
            ))}
          </div>

          {/* confidentiality note */}
          <div style={{ display: 'flex', gap: '14px', marginTop: '24px', backgroundColor: C.paperAlt, borderRadius: '14px', padding: '20px 22px', maxWidth: '900px' }}>
            <span style={{ fontFamily: mono, fontSize: '11px', fontWeight: 700, color: C.walnut, flexShrink: 0, letterSpacing: '0.06em' }}>NOTE</span>
            <p style={{ fontFamily: sans, fontSize: '14px', lineHeight: 1.6, fontWeight: 300, color: C.inkSoft, margin: 0 }}>
              A sanitized reconstruction based on my work at Walnut Education. No internal reports, dashboards, transcripts, sample sizes
              or exact conversion metrics are disclosed. Public desk research is cited; internal evidence is generalized and anonymized.
            </p>
          </div>
        </Reveal>
      </FullBleed>

      {/* ---------------------------------------------------------- */}
      {/* 01 CONTEXT                                                  */}
      {/* ---------------------------------------------------------- */}
      <FullBleed bg={C.card}>
        <Reveal>
          <Eyebrow index="01" label="Case Context" />
          <H2>The trial class is the moment a parent moves from “interesting” to “I’ll pay.”</H2>
          <Lead>
            Walnut Coding teaches computational thinking through Scratch, online classes and project-based exercises. In children’s
            education, the trial class is the critical conversion moment — but a child enjoying it does not, by itself, open a wallet.
          </Lead>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px', marginTop: '40px' }}>
            <div style={{ border: `1px solid ${C.line}`, borderRadius: '16px', padding: '28px', backgroundColor: C.paper }}>
              <div style={{ fontFamily: mono, fontSize: '12px', color: C.muted, letterSpacing: '0.06em', marginBottom: '10px' }}>WHO USES IT</div>
              <div style={{ fontFamily: sans, fontSize: '20px', fontWeight: 600, color: C.ink, marginBottom: '6px' }}>The child (8–12)</div>
              <p style={{ fontFamily: sans, fontSize: '15px', fontWeight: 300, color: C.inkSoft, lineHeight: 1.55, margin: 0 }}>
                Basic reading, computer operation, and the ability to explain a simple project.
              </p>
            </div>
            <div style={{ border: `1px solid ${C.walnut}`, borderRadius: '16px', padding: '28px', backgroundColor: C.paper }}>
              <div style={{ fontFamily: mono, fontSize: '12px', color: C.walnut, letterSpacing: '0.06em', marginBottom: '10px' }}>WHO DECIDES &amp; PAYS</div>
              <div style={{ fontFamily: sans, fontSize: '20px', fontWeight: 600, color: C.ink, marginBottom: '6px' }}>The parent (≈30–45)</div>
              <p style={{ fontFamily: sans, fontSize: '15px', fontWeight: 300, color: C.inkSoft, lineHeight: 1.55, margin: 0 }}>
                Cares about logical thinking, the learning path, and return on education spending.
              </p>
            </div>
          </div>
        </Reveal>
      </FullBleed>

      {/* ---------------------------------------------------------- */}
      {/* 02 REFRAME                                                  */}
      {/* ---------------------------------------------------------- */}
      <FullBleed bg={C.paper}>
        <Reveal>
          <Eyebrow index="02" label="Reframing the Goal" />
          <H2>Recommendation intention is the wrong metric for a trial class.</H2>
          <Lead max={760}>
            Parents haven’t experienced formal classes, homework feedback or long-term progress yet. So I shifted the research lens from
            satisfaction toward payment confidence, perceived value, perceived risk and path clarity.
          </Lead>
          <div style={{ marginTop: '40px' }}>
            <ReframePanel />
          </div>
        </Reveal>
      </FullBleed>

      {/* ---------------------------------------------------------- */}
      {/* 03 WHY 8-12                                                 */}
      {/* ---------------------------------------------------------- */}
      <FullBleed bg={C.card}>
        <Reveal>
          <Eyebrow index="03" label="Why Ages 8–12" />
          <H2>A high-decision-value segment, supported by internal direction and public data.</H2>
          <Lead>
            Children this age produce observable learning behavior in a Scratch trial, while parents form more complex payment judgments.
            Public Scratch data backs 8+ as the right boundary for Scratch-based research.
          </Lead>
          <div style={{ marginTop: '36px', marginBottom: '24px' }}>
            <ScratchStats />
          </div>
          <AgeBand />
          {/* segment split */}
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px', marginTop: '24px' }}>
            <div style={{ border: `1px solid ${C.line}`, borderRadius: '16px', padding: '26px', backgroundColor: C.paper }}>
              <div style={{ fontFamily: mono, fontSize: '20px', fontWeight: 700, color: C.sage, marginBottom: '6px' }}>8–10</div>
              <div style={{ fontFamily: sans, fontSize: '15px', fontWeight: 600, color: C.ink, marginBottom: '8px' }}>Scratch foundation / project entry</div>
              <p style={{ fontFamily: sans, fontSize: '14px', fontWeight: 300, color: C.inkSoft, lineHeight: 1.55, margin: 0 }}>
                Is my child interested? Do they understand basic logic? Can they complete work independently?
              </p>
            </div>
            <div style={{ border: `1px solid ${C.line}`, borderRadius: '16px', padding: '26px', backgroundColor: C.paper }}>
              <div style={{ fontFamily: mono, fontSize: '20px', fontWeight: 700, color: C.walnut, marginBottom: '6px' }}>11–12</div>
              <div style={{ fontFamily: sans, fontSize: '15px', fontWeight: 600, color: C.ink, marginBottom: '8px' }}>Scratch advanced / pre-Python</div>
              <p style={{ fontFamily: sans, fontSize: '14px', fontWeight: 300, color: C.inkSoft, lineHeight: 1.55, margin: 0 }}>
                Is Scratch too basic? Can it connect to Python? Does the course have long-term value?
              </p>
            </div>
          </div>
        </Reveal>
      </FullBleed>

      {/* ---------------------------------------------------------- */}
      {/* 04 DECISION MODEL                                           */}
      {/* ---------------------------------------------------------- */}
      <FullBleed bg={C.paper}>
        <Reveal>
          <Eyebrow index="04" label="The Decision Model" />
          <H2>“Child likes it → parent pays” is a myth. The real chain branches.</H2>
          <Lead max={720}>
            The trial doesn’t only need to generate interest. It has to walk the parent down a ladder of uncertainties — and every
            unanswered rung delays the payment.
          </Lead>
          <div style={{ marginTop: '44px', maxWidth: '760px' }}>
            <DecisionLadder />
          </div>
        </Reveal>
      </FullBleed>

      {/* ---------------------------------------------------------- */}
      {/* 05 KEY INSIGHTS                                             */}
      {/* ---------------------------------------------------------- */}
      <FullBleed bg={C.card}>
        <Reveal>
          <Eyebrow index="05" label="Key Insights" />
          <H2>Four insights into why “fun” doesn’t convert.</H2>
        </Reveal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
          <Reveal>
            <InsightCard
              no="1"
              title="The trial class is a parent risk-reduction moment, not an interest showcase."
              body="Beneath “Did my child enjoy it?” parents are eliminating risks: temporary excitement, a harder formal course, heavy parent support, Scratch being too basic, an over-polished trial. Fun proves interest exists — it doesn’t remove uncertainty."
              takeaway="The barrier to payment is not lack of interest. It is unresolved risk."
            />
          </Reveal>
          <Reveal>
            <InsightCard
              no="2"
              title="Parents aren’t buying a coding class — they’re buying an explainable investment rationale."
              body="Many parents can’t judge whether dragging blocks meant real learning. They need a framework to justify the spend to themselves. That’s why the child’s ability to explain the project — translated by the teacher — turns output into visible learning evidence."
              takeaway="Parents are buying a credible explanation that their child is growing."
            >
              <TranslationFlow />
            </InsightCard>
          </Reveal>
          <Reveal>
            <InsightCard
              no="3"
              title="For ages 8–12 the real tension is entry-point legitimacy: “Is Scratch still right?”"
              body="Most of these parents already accept that coding has value. Their hesitation is the path: Scratch now, or jump to Python? If the product only says Scratch is fun, it feels too young. If it shows how Scratch builds program logic, structure and debugging before Python, it feels professional."
              takeaway="The key isn’t proving coding is fun — it’s proving Scratch is a reasonable entry point."
            />
          </Reveal>
          <Reveal>
            <InsightCard
              no="4"
              title="Competitors don’t just compete on features — they offer different kinds of reassurance."
              body="Each alternative gives parents a distinct sense of security. Walnut isn’t only competing against products; it’s competing against the reassurance each option provides — and must answer each one directly."
              takeaway="When parents compare alternatives, they compare which option makes them feel more secure."
            >
              <AlternativesGrid />
            </InsightCard>
          </Reveal>
        </div>
      </FullBleed>

      {/* ---------------------------------------------------------- */}
      {/* 06 SIGNALS                                                  */}
      {/* ---------------------------------------------------------- */}
      <FullBleed bg={C.paper}>
        <Reveal>
          <Eyebrow index="06" label="Directional Signals" />
          <H2>What parents asked for, by intensity.</H2>
          <Lead max={720}>
            Reconstructed and illustrative — these show the analytical structure and recurring patterns, not company metrics. The
            interpretation: post-trial conversion was blocked less by price than by unresolved uncertainty and weak learning evidence.
          </Lead>
          <div style={{ marginTop: '36px' }}>
            <SignalHeatmap />
          </div>
        </Reveal>
      </FullBleed>

      {/* ---------------------------------------------------------- */}
      {/* 07 PRIORITY                                                 */}
      {/* ---------------------------------------------------------- */}
      <FullBleed bg={C.card}>
        <Reveal>
          <Eyebrow index="07" label="Pain-Point Prioritization" />
          <H2>Scoring pain by frequency, intensity, alternative pressure and conversion impact.</H2>
          <Lead max={720}>
            The top problem isn’t “make the trial more fun.” It’s giving parents credible evidence and reducing uncertainty after it.
          </Lead>
          <div style={{ marginTop: '36px' }}>
            <PriorityChart />
          </div>
        </Reveal>
      </FullBleed>

      {/* ---------------------------------------------------------- */}
      {/* 08 OPPORTUNITIES                                            */}
      {/* ---------------------------------------------------------- */}
      <FullBleed bg={C.paper}>
        <Reveal>
          <Eyebrow index="08" label="Product Opportunities" />
          <H2>Six moves that trade persuasion for evidence.</H2>
          <Lead max={720}>
            Each opportunity maps back to an insight and turns the post-trial moment from a sales pitch into decision support.
          </Lead>
          <div style={{ marginTop: '40px' }}>
            <Opportunities />
          </div>
        </Reveal>
      </FullBleed>

      {/* ---------------------------------------------------------- */}
      {/* 09 OUTCOME                                                  */}
      {/* ---------------------------------------------------------- */}
      <FullBleed bg={C.walnutDeep} pad={isMobile ? '72px 24px' : '96px 24px'}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontFamily: mono, fontSize: '12px', fontWeight: 600, letterSpacing: '0.14em', color: C.gold }}>09</span>
            <span style={{ width: '28px', height: '1px', backgroundColor: C.gold, opacity: 0.6 }} />
            <span style={{ fontFamily: mono, fontSize: '12px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
              Outcome &amp; Validation
            </span>
          </div>
          <h2 style={{ fontFamily: sans, fontSize: 'clamp(24px, 3.4vw, 38px)', fontWeight: 500, color: '#fff', lineHeight: 1.25, margin: '0 0 24px', maxWidth: '820px', letterSpacing: '-0.01em' }}>
            Parent-facing learning evidence beat promotion-driven follow-up.
          </h2>
          <p style={{ fontFamily: sans, fontSize: '18px', fontWeight: 300, lineHeight: 1.62, color: 'rgba(255,255,255,0.82)', maxWidth: '760px', margin: 0 }}>
            In the real business context, related changes to post-trial parent communication were later validated through internal
            experiments and showed positive directional impact on trial-to-paid conversion. The strongest pattern wasn’t more promotion —
            it was making the child’s learning evidence and the formal-course path clearer. To protect confidentiality, no setup, sample
            size, traffic allocation or exact uplift is disclosed; the learning is presented at the level of strategic direction.
          </p>
        </Reveal>
      </FullBleed>

      {/* ---------------------------------------------------------- */}
      {/* 10 RISKS                                                    */}
      {/* ---------------------------------------------------------- */}
      <FullBleed bg={C.paper}>
        <Reveal>
          <Eyebrow index="10" label="Risks & Counter-Signals" />
          <H2>Where the thesis could be wrong.</H2>
          <Lead max={720}>
            Good research names its own counter-signals. These keep the recommendations honest and the next round of validation sharp.
          </Lead>
          <div style={{ marginTop: '36px' }}>
            <RiskList />
          </div>
        </Reveal>
      </FullBleed>

      {/* ---------------------------------------------------------- */}
      {/* 11 VALIDATE NEXT                                            */}
      {/* ---------------------------------------------------------- */}
      <FullBleed bg={C.card}>
        <Reveal>
          <Eyebrow index="11" label="What I’d Validate Next" />
          <H2>Three experiments to run.</H2>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '16px', marginTop: '40px' }}>
            {[
              { n: '01', t: 'Which learning evidence matters most?', d: 'Project explanation vs. teacher interpretation vs. written report vs. learning-path vs. first-four-week expectation.' },
              { n: '02', t: 'Which segment benefits most from age-specific design?', d: 'Compare 8–10 vs. 11–12 vs. high-intent vs. Python-comparison vs. free-tutorial-comparison parents.' },
              { n: '03', t: 'How much comparison should be shown?', d: 'Does transparent comparison raise confidence, or quietly increase decision delay?' },
            ].map((q) => (
              <div key={q.n} style={{ border: `1px solid ${C.line}`, borderRadius: '16px', padding: '26px', backgroundColor: C.paper }}>
                <div style={{ fontFamily: mono, fontSize: '13px', fontWeight: 700, color: C.walnut, marginBottom: '14px', letterSpacing: '0.06em' }}>{q.n}</div>
                <h3 style={{ fontFamily: sans, fontSize: '17px', fontWeight: 600, color: C.ink, margin: '0 0 10px', lineHeight: 1.35 }}>{q.t}</h3>
                <p style={{ fontFamily: sans, fontSize: '14px', fontWeight: 300, color: C.inkSoft, lineHeight: 1.55, margin: 0 }}>{q.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </FullBleed>

      {/* ---------------------------------------------------------- */}
      {/* 12 CONCLUSION                                               */}
      {/* ---------------------------------------------------------- */}
      <FullBleed bg={C.paper}>
        <Reveal>
          <Eyebrow index="12" label="Conclusion" />
          <H2>The real goal of a trial class is to build an evidence chain.</H2>
          <Lead max={760}>
            Not just to prove coding is fun — but to prove this child can start systematic learning here, and that the parent
            understands why the investment is worth it.
          </Lead>
          <div style={{ marginTop: '44px' }}>
            <EvidenceChain />
          </div>
        </Reveal>
      </FullBleed>

      {/* footer back link */}
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '56px 24px 96px', textAlign: 'center' }}>
        <Link
          href="/works"
          style={{
            fontFamily: sans,
            fontSize: '16px',
            fontWeight: 500,
            color: C.ink,
            textDecoration: 'none',
            borderBottom: `1px solid ${C.lineStrong}`,
            paddingBottom: '2px',
          }}
        >
          ← Back to Work
        </Link>
      </div>
    </div>
  );
}
