'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import s from './MemQDiagrams.module.css';

/* ───────────────────────── 02 · The problem ───────────────────────── */

/** The loop people described, beside the loop MemQ adds. Dots travel each path. */
export function AskAgainLoop() {
  return (
    <div className={s.loopPair}>
      <figure className={s.loopPanel} aria-label="Without a retention step: ask, get an answer, close the chat, forget, ask again.">
        <span className={s.loopTag}>What people described</span>
        <svg viewBox="-10 0 340 260" className={s.loopSvg} aria-hidden="true">
          <path id="memq-loop-a" d="M160 40 A120 90 0 1 1 159.9 40" fill="none" stroke="var(--case-line)" strokeWidth="2" strokeDasharray="4 6" />
          <circle r="7" className={s.loopDotGrey}>
            <animateMotion dur="5s" repeatCount="indefinite"><mpath href="#memq-loop-a" /></animateMotion>
          </circle>
          {[
            { x: 160, y: 40, t: 'Ask AI' },
            { x: 280, y: 130, t: 'Get an answer' },
            { x: 160, y: 220, t: 'Close the chat' },
            { x: 40, y: 130, t: 'Forget it' },
          ].map((n) => (
            <g key={n.t}>
              <rect x={n.x - 52} y={n.y - 15} width="104" height="30" rx="15" fill="var(--case-white)" stroke="var(--case-line)" />
              <text x={n.x} y={n.y + 4} textAnchor="middle" className={s.loopText}>{n.t}</text>
            </g>
          ))}
          <text x="160" y="136" textAnchor="middle" className={s.loopCenter}>again, and again</text>
        </svg>
      </figure>
      <figure className={s.loopPanel} aria-label="With MemQ: ask, keep the answer as cards, review when due, know it.">
        <span className={`${s.loopTag} ${s.loopTagOn}`}>The step MemQ adds</span>
        <svg viewBox="0 0 320 260" className={s.loopSvg} aria-hidden="true">
          <path id="memq-loop-b" d="M30 200 C70 200 80 150 110 150 S160 100 190 100 S240 50 262 50" fill="none" stroke="#c59af0" strokeWidth="3" strokeLinecap="round" />
          {[
            { x: 30, y: 200, t: 'Ask' },
            { x: 110, y: 150, t: 'Keep as cards' },
            { x: 190, y: 100, t: 'Review when due' },
            { x: 262, y: 50, t: 'Know it' },
          ].map((n, i) => (
            <g key={n.t}>
              <rect x={i === 3 ? n.x - 58 : n.x + 10} y={i === 3 ? n.y - 44 : n.y + 12} width={i === 3 ? 80 : 104} height="28" rx="14" fill={i === 3 ? '#6c3cbc' : '#f0e4fc'} />
              <text x={i === 3 ? n.x - 18 : n.x + 62} y={i === 3 ? n.y - 25 : n.y + 31} textAnchor="middle" className={i === 3 ? s.loopTextOn : s.loopTextPurple}>{n.t}</text>
              <circle cx={n.x} cy={n.y} r="6" fill={i === 3 ? '#6c3cbc' : '#fff'} stroke="#6c3cbc" strokeWidth="3" />
            </g>
          ))}
          <circle r="8" className={s.loopDotPurple}>
            <animateMotion dur="4s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.8;1" calcMode="linear"><mpath href="#memq-loop-b" /></animateMotion>
          </circle>
        </svg>
      </figure>
    </div>
  );
}

/* ───────────────────────── 05 · Direction ───────────────────────── */

const versions = [
  {
    v: 'v1',
    date: 'Apr 2026',
    name: 'Editorial',
    swatches: ['#FAFAF7', '#1A1A18', '#1A8A72'],
    image: '/img/MemQ/Home.PNG',
    kept: 'Type before chrome. One accent, used only for state.',
    gap: 'Calm and credible, but nothing on the screen invited you back tomorrow.',
  },
  {
    v: 'v2',
    date: 'Oct 2026',
    name: 'White & ink',
    swatches: ['#FFFFFF', '#242424', '#FCF6DB', '#BAADEE'],
    image: '/img/memq-v2/screen-v2-today.webp',
    kept: 'Colour lives in details. A first character, kept subordinate to content.',
    gap: 'Quieter still. The character was a sticker, not part of the product.',
  },
  {
    v: 'v3',
    date: 'Nov 2026 · 2.0',
    name: 'Inkling',
    swatches: ['#F6FF7C', '#6C3CBC', '#4B2C78', '#F0E4FC'],
    image: '/img/memq-v2/screen-today.webp',
    kept: 'Lime sky, purple content. Depth by one rule. A character that reacts.',
    gap: 'Now the bar: playful must still read as made for adults.',
  },
];

export function VisualEvolution() {
  return (
    <ol className={s.evo} aria-label="Three visual versions of MemQ">
      {versions.map((v, i) => (
        <li key={v.v} className={`${s.evoCard} ${i === 2 ? s.evoCurrent : ''}`}>
          <div className={s.evoHead}>
            <span className={s.evoV}>{v.v}</span>
            <span className={s.evoName}>{v.name}</span>
            <span className={s.evoDate}>{v.date}</span>
          </div>
          <div className={s.evoShot}>
            <Image src={v.image} alt={`MemQ ${v.name} visual direction: the Today screen`} fill sizes="(min-width: 900px) 30vw, 90vw" style={{ objectFit: 'cover', objectPosition: 'top' }} />
          </div>
          <div className={s.swatches} aria-hidden="true">
            {v.swatches.map((c) => <span key={c} style={{ background: c }} title={c} />)}
          </div>
          <p className={s.evoKept}>{v.kept}</p>
          <p className={s.evoGap}>{v.gap}</p>
        </li>
      ))}
    </ol>
  );
}

/* ───────────────────────── 06 · Design language ───────────────────────── */

type Depth = 'shadow' | 'outline' | 'ledge';
const depthCopy: Record<Depth, { title: string; verdict: string }> = {
  shadow: { title: 'Drop shadow', verdict: 'Blurs on the lime ground and turns muddy. Reads as generic.' },
  outline: { title: 'Outline', verdict: 'Collides with the drawn style: buttons start to look like illustrations.' },
  ledge: { title: 'Ledge', verdict: 'Face plus shell, offset upward. The lip is the only depth in the app.' },
};

/** The same card and button under three depth treatments. Ledge is the rule. */
export function LedgeLab() {
  const [depth, setDepth] = useState<Depth>('ledge');
  return (
    <div className={s.ledge}>
      <div className={s.ledgeStage} data-depth={depth}>
        <div className={s.ledgeCard}>
          <span className={s.ledgeEyebrow}>Today&apos;s focus</span>
          <strong className={s.ledgeBig}>13 cards</strong>
          <span className={s.ledgeSub}>need your review</span>
        </div>
        <button type="button" className={s.ledgeButton}>▶ Start learning</button>
        <div className={s.ledgeChips}>
          <span className={s.ledgeChip}>8 min</span>
          <span className={s.ledgeChip}>64%</span>
          <span className={s.ledgeChip}>7 / 20</span>
        </div>
      </div>
      <div className={s.ledgeSide}>
        <div className={s.segmented} role="radiogroup" aria-label="Depth treatment">
          {(Object.keys(depthCopy) as Depth[]).map((d) => (
            <button key={d} type="button" role="radio" aria-checked={depth === d} onClick={() => setDepth(d)} className={depth === d ? s.segOn : ''}>
              {depthCopy[d].title}{d === 'ledge' ? ' ✓' : ''}
            </button>
          ))}
        </div>
        <p className={s.ledgeVerdict}><strong>{depthCopy[depth].title}.</strong> {depthCopy[depth].verdict}</p>
        <ul className={s.tiers} aria-label="Ledge heights">
          <li><span className={s.tierLead} />lead · 5pt<em>the one primary button on a screen</em></li>
          <li><span className={s.tierRaised} />raised · 3pt<em>cards that carry content</em></li>
          <li><span className={s.tierControl} />control · 2pt<em>chips, switches, small buttons</em></li>
        </ul>
        <p className={s.ledgeHint}>Press the button: the face drops onto its shell, so pressing is the ledge disappearing.</p>
      </div>
    </div>
  );
}

/** The two-line rule that keeps UI and illustration from blurring together. */
export function OutlineRule() {
  return (
    <div className={s.rulePair}>
      <div className={s.ruleCell}>
        <div className={s.ruleDemo}><button type="button" className={s.ledgeButtonStatic}>Continue</button></div>
        <strong>Things you press have no outline.</strong>
        <span>The edge is the colour block. Depth comes only from the lip.</span>
      </div>
      <div className={s.ruleCell}>
        <div className={s.ruleDemo}><Image src="/img/memq-v2/mascot/happy.svg" alt="" width={120} height={120} unoptimized /></div>
        <strong>Things that are drawn have heavy outlines.</strong>
        <span>3–5% of the drawing&apos;s width, round caps, in the deepest ink.</span>
      </div>
    </div>
  );
}

const palette = [
  { name: 'Sky', hex: '#F6FF7C', role: 'Ground gradient' },
  { name: 'Primary', hex: '#6C3CBC', role: 'Lead action, icons' },
  { name: 'Deep', hex: '#4B2C78', role: 'Button shell, mascot ink' },
  { name: 'Darkest', hex: '#301A50', role: 'Titles and body' },
  { name: 'Muted', hex: '#795BA3', role: 'Secondary text' },
  { name: 'Track', hex: '#F0E4FC', role: 'Pale purple ground' },
  { name: 'Selected', hex: '#F4FAB1', role: 'Picked answer' },
  { name: 'Gold', hex: '#FFBA00', role: 'Mascot marks only' },
];

export function PaletteStrip() {
  return (
    <ul className={s.palette} aria-label="MemQ 2.0 colour roles">
      {palette.map((p) => (
        <li key={p.hex}>
          <span className={s.paletteChip} style={{ background: p.hex }} />
          <strong>{p.name}</strong>
          <code>{p.hex}</code>
          <span>{p.role}</span>
        </li>
      ))}
    </ul>
  );
}

/* ───────────────────────── 08 · The loop ───────────────────────── */

const WAITS = [1, 3, 7, 14, 30, 60, 120, 240];
type Review = { day: number; ok: boolean; relook?: boolean };

/** Plays the real schedule: 1, 3, 7, 14, 30 days then doubling; a miss steps back once and asks again in ten minutes. */
export function SpacedScheduler() {
  const [stage, setStage] = useState(0);
  const [due, setDue] = useState(1);
  const [log, setLog] = useState<Review[]>([]);
  const [deadline, setDeadline] = useState(false);
  const [last, setLast] = useState('A new card. Its first look is tomorrow.');
  const DEADLINE = 40;

  const answer = (ok: boolean) => {
    if (due > 230) return;
    if (ok) {
      const next = Math.min(stage + 1, WAITS.length - 1);
      setLog((l) => [...l, { day: due, ok: true }]);
      setStage(next);
      setDue(due + WAITS[next]);
      setLast(`Remembered on day ${due}. Stage ${next}: next look in ${WAITS[next]} days.`);
    } else {
      const back = Math.max(stage - 1, 0);
      setLog((l) => [...l, { day: due, ok: false }, { day: due, ok: true, relook: true }]);
      setStage(back);
      setDue(due + WAITS[back]);
      setLast(`Missed on day ${due}. Back one stage, a second look in ten minutes, then ${WAITS[back]} day${WAITS[back] > 1 ? 's' : ''}.`);
    }
  };
  const reset = () => { setStage(0); setDue(1); setLog([]); setLast('A new card. Its first look is tomorrow.'); };

  /* Projected looks after the next one; a deadline shrinks them together and keeps the day before. */
  const projected = useMemo(() => {
    const out: number[] = [];
    if (deadline && due < DEADLINE - 1) {
      const remaining = DEADLINE - 1 - due;
      const waits: number[] = [];
      let sum = 0;
      for (let k = stage + 1; k < WAITS.length && sum < remaining; k++) { waits.push(WAITS[k]); sum += WAITS[k]; }
      const f = remaining / sum;
      let d = due;
      waits.forEach((w, i) => { d = i === waits.length - 1 ? DEADLINE - 1 : Math.max(d + 1, Math.round(d + w * f)); out.push(d); });
      return out;
    }
    let d = due;
    for (let k = stage + 1; k < WAITS.length && d + WAITS[k] <= 240; k++) { d += WAITS[k]; out.push(d); if (out.length >= 3) break; }
    return out;
  }, [due, stage, deadline]);

  const max = Math.max(60, ...(deadline ? [DEADLINE + 4] : []), due + 4, ...projected.slice(0, 2).map((p) => p + 4));
  const W = 640, H = 200, L = 28, R = 16, top = 24, base = 150;
  const x = (d: number) => L + (d / max) * (W - L - R);

  /* Illustrative memory curve: each successful look resets it, decay slows as the stage rises. */
  const curve = useMemo(() => {
    const looks = [{ day: 0, st: 0 }];
    let st = 0;
    for (const r of log) { if (r.relook) continue; st = r.ok ? st + 1 : Math.max(st - 1, 0); looks.push({ day: r.day, st }); }
    const pts: string[] = [];
    for (let d = 0; d <= max; d += max / 160) {
      let i = 0;
      while (i + 1 < looks.length && looks[i + 1].day <= d) i++;
      const strength = (WAITS[Math.min(looks[i].st, WAITS.length - 1)] || 1) * 1.5;
      const r = Math.exp(-(d - looks[i].day) / strength);
      pts.push(`${x(d).toFixed(1)},${(base - r * (base - top)).toFixed(1)}`);
    }
    return pts.join(' ');
  }, [log, max]); // eslint-disable-line react-hooks/exhaustive-deps

  const ticks = [0, 10, 20, 30, 40, 50, 60, 90, 120, 180, 240].filter((t) => t <= max);

  return (
    <div className={s.sched}>
      <svg viewBox={`0 0 ${W} ${H}`} className={s.schedSvg} role="img" aria-label={`Card at stage ${stage}, next look on day ${due}.`}>
        <line x1={L} x2={W - R} y1={base} y2={base} stroke="var(--case-line)" />
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={base} y2={base + 5} stroke="var(--case-line)" />
            <text x={x(t)} y={base + 18} textAnchor="middle" className={s.schedTick}>{t === 0 ? 'day 0' : t}</text>
          </g>
        ))}
        <polyline points={curve} fill="none" stroke="#c59af0" strokeWidth="2" className={s.schedCurve} />
        {deadline && (
          <g>
            <line x1={x(DEADLINE)} x2={x(DEADLINE)} y1={top - 8} y2={base} stroke="#4b2c78" strokeDasharray="3 4" />
            <text x={x(DEADLINE) + 6} y={top} className={s.schedLabel}>Exam · day {DEADLINE}</text>
          </g>
        )}
        {log.filter((r) => !r.relook).map((r, i) => (
          <circle key={i} cx={x(r.day)} cy={base} r="6" fill={r.ok ? '#6c3cbc' : '#fff'} stroke={r.ok ? '#6c3cbc' : '#d64545'} strokeWidth="3" />
        ))}
        {projected.map((p) => <circle key={p} cx={x(p)} cy={base} r="5" fill="none" stroke="#c59af0" strokeWidth="2" strokeDasharray="2 2" />)}
        <g className={s.schedDue} style={{ transform: `translateX(${x(due)}px)` }}>
          <circle cx={0} cy={base} r="9" fill="#f6ff7c" stroke="#4b2c78" strokeWidth="3" />
          <text x={0} y={base + 38} textAnchor="middle" className={s.schedLabel}>next · day {due}</text>
        </g>
      </svg>
      <div className={s.schedControls}>
        <button type="button" className={s.btnPrimary} onClick={() => answer(true)}>Remembered</button>
        <button type="button" className={s.btnGhost} onClick={() => answer(false)}>Missed</button>
        <label className={s.toggle}><input type="checkbox" checked={deadline} onChange={(e) => setDeadline(e.target.checked)} /> Exam on day {DEADLINE}</label>
        <button type="button" className={s.btnLink} onClick={reset}>Reset</button>
      </div>
      <p className={s.schedStatus} aria-live="polite">{last}</p>
      <ol className={s.stageRow} aria-label="Waits by stage">
        {WAITS.slice(0, 6).map((w, i) => (
          <li key={w} className={i === stage ? s.stageOn : i < stage ? s.stagePast : ''}>
            <span>stage {i}</span><strong>{w}d</strong>
          </li>
        ))}
        <li><span>then</span><strong>×2</strong></li>
      </ol>
    </div>
  );
}

/* ───────────────────────── 09 · Beyond the app ───────────────────────── */

/** Other AI apps write lessons into MemQ through MCP, behind consent and the user's own row-level access. */
export function McpFlow() {
  const tools = ['list_lessons', 'create_lesson', 'add_cards', 'add_practice_questions', 'delete_lesson ⚠'];
  return (
    <div className={s.mcp} role="img" aria-label="An AI client such as Claude or ChatGPT asks for consent, then calls MemQ's MCP tools with the signed-in user's own token; the lesson appears in the user's library and on Today.">
      <div className={s.mcpCol}>
        <span className={s.mcpKicker}>Where the question was asked</span>
        {['Claude', 'ChatGPT', 'Any MCP client'].map((c) => <span key={c} className={s.mcpClient}>{c}</span>)}
      </div>
      <div className={s.mcpArrow}><span className={s.mcpPulse} /></div>
      <div className={s.mcpCol}>
        <span className={s.mcpKicker}>Gate</span>
        <div className={s.mcpGate}>
          <strong>Consent</strong>
          <span>OAuth 2.1 + PKCE</span>
          <span>user&apos;s own token, row-level access</span>
          <span>destructive tools ask first</span>
        </div>
      </div>
      <div className={s.mcpArrow}><span className={s.mcpPulse} style={{ animationDelay: '0.8s' }} /></div>
      <div className={s.mcpCol}>
        <span className={s.mcpKicker}>MemQ tools</span>
        <ul className={s.mcpTools}>{tools.map((t) => <li key={t}><code>{t}</code></li>)}</ul>
      </div>
      <div className={s.mcpArrow}><span className={s.mcpPulse} style={{ animationDelay: '1.6s' }} /></div>
      <div className={s.mcpCol}>
        <span className={s.mcpKicker}>Ends up</span>
        <div className={s.mcpEnd}><Image src="/img/memq-v2/mascot/happy.svg" alt="" width={56} height={56} unoptimized /><span>In Library, due on Today</span></div>
      </div>
    </div>
  );
}
