'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import c from './MemQCharts.module.css';

/*
 * The You page's progress charts, rebuilt from the app's ProgressCharts on demonstration data.
 * Same rules as the app: each chart is a lipped white card led by one large number and one
 * short line; one purple ramp runs through all of them (deeper = further along); everything
 * is drawn empty and grows in once, when it comes into view. Reduced motion shows it still.
 */

const STAGES = ['New', 'Learning', 'Familiar', 'Good', 'Strong', 'Mastered'] as const;
const STAGE_COLORS = ['#efeaf5', '#dcc8f7', '#c59af0', '#9d66ed', '#6c3cbc', '#4b2c78'];
const HEAT = ['#efeaf5', '#dcc8f7', '#c59af0', '#9d66ed', '#6c3cbc'];
const EMPTY = '#efeaf5';
const FAINT = '#dcc8f7';

const demo = {
  streak: 15,
  best: 19,
  // Five weeks, Monday first, this week last; -1 = still to come. A break in week 3.
  weeks: [
    [2, 3, 1, 0, 2, 4, 1],
    [3, 2, 4, 2, 0, 0, 3],
    [1, 0, 0, 2, 3, 3, 4],
    [2, 4, 3, 1, 2, 3, 2],
    [4, 3, 2, 3, -1, -1, -1],
  ],
  stages: [18, 14, 22, 19, 15, 38],
  forecast: [13, 6, 9, 4, 0, 11, 7],
  forecastLabels: ['Today', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
  goal: 20,
  cards: [22, 20, 8, 25, 0, 21, 20, 14, 23, 20, 0, 26, 21, 17],
  accuracy: [72, 78, 65, 80, null, 84, 79, 70, 86, 82, null, 88, 85, 81] as (number | null)[],
  trendLabels: ['2 wks ago', 'Today'],
};

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      const id = requestAnimationFrame(() => setSeen(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, seen };
}

function CountUp({ value, on, suffix = '' }: { value: number; on: boolean; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = still ? 1 : Math.min(1, (t - t0) / 900);
      setN(Math.round(value * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, value]);
  return <>{n}{suffix}</>;
}

function ChartCard({ label, value, unit, note, children, wide }: { label: string; value: ReactNode; unit?: string; note?: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={`${c.card} ${wide ? c.wide : ''}`}>
      <div className={c.head}>
        <span className={c.label}>{label}</span>
        <span className={c.value}>{value}{unit && <span className={c.unit}> {unit}</span>}</span>
        {note && <span className={c.note}>{note}</span>}
      </div>
      {children}
    </div>
  );
}

function Streak({ on }: { on: boolean }) {
  const studied = demo.weeks.flat().filter((l) => l > 0).length;
  return (
    <ChartCard label="Streak" value={<CountUp value={demo.streak} on={on} />} unit="day streak" note={`Best ${demo.best}. Studied on ${studied} of the last 32 days.`}>
      <div className={c.grid} role="img" aria-label={`Five-week study grid, studied on ${studied} days, today ringed.`}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i} className={c.weekday}>{d}</span>)}
        {demo.weeks.map((row, w) => row.map((level, d) => {
          const today = w === 4 && d === 3;
          if (level < 0) return <span key={`${w}${d}`} className={c.tileBlank} />;
          return (
            <span key={`${w}${d}`} className={`${c.tile} ${today ? c.tileToday : ''}`} style={{ background: HEAT[0] }}>
              {level > 0 && <span className={c.tileFill} style={{ background: HEAT[level], transitionDelay: `${(w + d) * 28}ms`, opacity: on ? 1 : 0, transform: on ? 'scale(1)' : 'scale(.5)' }} />}
            </span>
          );
        }))}
      </div>
    </ChartCard>
  );
}

function StageBar({ on }: { on: boolean }) {
  const total = demo.stages.reduce((a, b) => a + b, 0);
  return (
    <ChartCard wide label="Your cards" value={<CountUp value={demo.stages[5]} on={on} />} unit={`of ${total} mastered`} note="Every card in one bar, by the stage it has reached.">
      <div className={c.stageBar} role="img" aria-label={STAGES.map((s, i) => `${demo.stages[i]} ${s}`).join(', ')}>
        <div className={c.stageReveal} style={{ clipPath: on ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)' }}>
          {demo.stages.map((n, i) => <span key={i} style={{ flex: n, background: STAGE_COLORS[i] }} />)}
        </div>
      </div>
      <div className={c.legend}>
        {STAGES.map((s, i) => (
          <span key={s} className={c.legendItem}><i style={{ background: STAGE_COLORS[i] }} />{s}<b><CountUp value={demo.stages[i]} on={on} /></b></span>
        ))}
      </div>
    </ChartCard>
  );
}

function Forecast({ on }: { on: boolean }) {
  const most = Math.max(...demo.forecast);
  const busiest = demo.forecast.slice(1).indexOf(Math.max(...demo.forecast.slice(1))) + 1;
  return (
    <ChartCard label="Reviews due" value={<CountUp value={demo.forecast[0]} on={on} />} unit="today" note={`Busiest next: ${demo.forecastLabels[busiest]}, ${demo.forecast[busiest]} cards.`}>
      <div className={c.columns}>
        {demo.forecast.map((n, i) => (
          <div key={i} className={c.column} aria-label={`${demo.forecastLabels[i]}, ${n} due`}>
            <span className={`${c.columnCount} ${n === 0 ? c.muted : ''}`}>{n}</span>
            <span className={c.columnTrack}>
              <span className={c.columnBar} style={{
                height: on ? (n === 0 ? 4 : Math.max(8, (n / most) * 92)) : 0,
                background: n === 0 ? EMPTY : i === 0 ? '#6c3cbc' : STAGE_COLORS[2],
                transitionDelay: `${i * 45}ms`,
              }} />
            </span>
            <span className={`${c.columnLabel} ${i === 0 ? c.today : ''}`}>{demo.forecastLabels[i]}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

function Goal({ on }: { on: boolean }) {
  const top = Math.max(demo.goal * 1.25, ...demo.cards);
  const goalY = 96 - (demo.goal / top) * 96;
  const hit = demo.cards.slice(-7).filter((v) => v >= demo.goal).length;
  return (
    <ChartCard label="Daily goal" value={<CountUp value={hit} on={on} />} unit="of the last 7 days" note={`Goal: ${demo.goal} cards a day. Days that reach it are filled in.`}>
      <div className={c.plot}>
        <div className={c.goalBars}>
          {demo.cards.map((v, i) => (
            <span key={i} className={c.goalSlot}>
              <span className={c.goalBar} style={{
                height: on ? (v === 0 ? 3 : Math.max(5, (v / top) * 96)) : 0,
                background: v === 0 ? EMPTY : v >= demo.goal ? '#6c3cbc' : FAINT,
                transitionDelay: `${i * 30}ms`,
              }} />
            </span>
          ))}
        </div>
        <div className={c.goalLine} style={{ top: goalY, opacity: on ? 1 : 0, transitionDelay: `${demo.cards.length * 30 + 200}ms` }}>
          <span>Goal {demo.goal}</span>
        </div>
      </div>
      <div className={c.axis}><span>{demo.trendLabels[0]}</span><span>{demo.trendLabels[1]}</span></div>
    </ChartCard>
  );
}

function Accuracy({ on }: { on: boolean }) {
  const W = 300, H = 96, pad = 6;
  const step = (W - pad * 2) / (demo.accuracy.length - 1);
  const y = (pct: number) => pad + (1 - pct / 100) * (H - pad * 2);
  const pts = demo.accuracy.map((v, i) => (v === null ? null : { x: pad + i * step, y: y(v) })).filter((q): q is { x: number; y: number } => q !== null);
  const week = demo.accuracy.slice(-7).filter((v): v is number => v !== null);
  const pct = Math.round(week.reduce((a, b) => a + b, 0) / week.length);
  return (
    <ChartCard label="Correct answers" value={<CountUp value={pct} on={on} suffix="%" />} unit="this week" note="Days with no answers have no point; the line joins the days that do.">
      <div className={c.plot}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={c.lineSvg} aria-hidden="true">
          {[100, 50, 0].map((v) => <line key={v} x1={0} x2={W} y1={y(v)} y2={y(v)} stroke={EMPTY} strokeWidth={1} vectorEffect="non-scaling-stroke" />)}
          <polyline points={pts.map((q) => `${q.x},${q.y}`).join(' ')} fill="none" stroke="#6c3cbc" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"
            vectorEffect="non-scaling-stroke" pathLength={1} className={c.line} style={{ strokeDashoffset: on ? 0 : 1 }} />
        </svg>
        {pts.map((q, i) => (
          <span key={i} className={`${c.dot} ${i === pts.length - 1 ? c.dotLast : ''}`}
            style={{ left: `${(q.x / W) * 100}%`, top: q.y, opacity: on ? 1 : 0, transitionDelay: `${300 + (i / (pts.length - 1)) * 1100}ms` }} />
        ))}
        <span className={c.gridTag} style={{ top: y(100) - 8 }}>100%</span>
        <span className={c.gridTag} style={{ top: y(50) - 8 }}>50%</span>
      </div>
      <div className={c.axis}><span>{demo.trendLabels[0]}</span><span>{demo.trendLabels[1]}</span></div>
    </ChartCard>
  );
}

export function ProgressCharts() {
  const { ref, seen } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={c.board}>
      <Streak on={seen} />
      <StageBar on={seen} />
      <Forecast on={seen} />
      <Goal on={seen} />
      <Accuracy on={seen} />
    </div>
  );
}
