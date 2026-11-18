/**
 * Iteration 2 · Design for model evaluation. Three figures in the same SVG language as
 * ProcurementFlowDiagrams: the evaluation loop, accuracy and confidence by supplier, and how
 * one plan's expected accuracy is built. Numbers are the demonstration data in the ERP demo.
 */
import styles from './ProcurementFlowDiagrams.module.css';

const LINK = 'var(--case-flow-link)';
const BREAK = 'var(--case-flow-break)';
const T = { heading: 'var(--case-font-heading)', body: 'var(--case-font-body)', cap: 'var(--case-type-caption)', strong: 'var(--case-weight-strong)' };

/* ───────── 1 · The evaluation loop ───────── */
const LOOP = [
  { n: '01', title: 'Plan', note: 'Expected 77% · likely 73–81%', x: 170, y: 90 },
  { n: '02', title: 'Order and receive', note: 'The buyer commits; goods arrive', x: 790, y: 90 },
  { n: '03', title: 'Review the order', note: 'Data + the buyer’s judgment', x: 790, y: 290, emphasis: true },
  { n: '04', title: 'Supplier track record', note: 'MNP 81% → 83% · high confidence', x: 170, y: 290 },
] as const;
const LOOP_PATHS = ['M302 90 H656', 'M790 130 V248', 'M656 290 H304', 'M170 248 V132'] as const;

export function EvaluationLoop() {
  const id = 'procurement-eval-loop';
  return (
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label="Evaluation loop; scroll horizontally on small screens">
      <svg viewBox="0 0 960 400" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>Every reviewed order scores the plan and updates that supplier&apos;s track record</title>
        <desc id={`${id}-desc`}>A plan starts with an expected accuracy. After the order is received, the buyer reviews it: planned quantity against what was needed gives the order&apos;s accuracy. Saving adds it to the supplier&apos;s track record, which sets the next plan&apos;s expected accuracy. A skipped review is not counted.</desc>
        <defs>
          <marker id={`${id}-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="var(--case-copy)" /></marker>
          <marker id={`${id}-arrow-break`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill={BREAK} /></marker>
        </defs>
        <rect width="960" height="400" fill="var(--case-bg)" />
        <g fill="none" stroke="var(--case-copy)" strokeWidth="var(--case-focus-width)" markerEnd={`url(#${id}-arrow)`}>
          {LOOP_PATHS.map((d) => <path key={d} d={d} />)}
        </g>
        {LOOP_PATHS.map((d, i) => <path key={`p${d}`} className={styles.pulse} d={d} pathLength={1} stroke={LINK} strokeWidth="5" style={{ animationDelay: `${i * 1.75}s` }} />)}

        {/* Skip: allowed, but the outcome never reaches the track record. */}
        <g fill="none" stroke={BREAK} strokeWidth="var(--case-border-width)" strokeDasharray="5 4">
          <path className={styles.carry} d="M790 330 V372 H520" markerEnd={`url(#${id}-arrow-break)`} />
        </g>
        <text x="506" y="377" textAnchor="end" fill={BREAK} fontFamily={T.body} fontSize={T.cap}>Skipped review · not counted</text>

        {LOOP.map((node) => {
          const em = 'emphasis' in node;
          return (
            <g key={node.n}>
              <rect x={node.x - 132} y={node.y - 40} width="264" height="80" rx="8" fill="var(--case-bg)" stroke={em ? LINK : 'var(--case-copy)'} strokeWidth={em ? 'var(--case-focus-width)' : 'var(--case-border-width)'} />
              {em && <rect className={styles.breathe} x={node.x - 132} y={node.y - 40} width="264" height="80" rx="8" fill="none" stroke={LINK} strokeWidth="var(--case-border-width)" />}
              <text x={node.x - 114} y={node.y - 12} fill={em ? LINK : 'var(--case-muted)'} fontFamily={T.heading} fontSize={T.cap}>{node.n}</text>
              <text x={node.x - 86} y={node.y - 12} fill="var(--case-ink)" fontFamily={T.body} fontSize={T.cap} fontWeight={T.strong}>{node.title}</text>
              <text x={node.x - 114} y={node.y + 18} fill="var(--case-muted)" fontFamily={T.body} fontSize={T.cap}>{node.note}</text>
            </g>
          );
        })}
        <text x="480" y="190" textAnchor="middle" fill="var(--case-muted)" fontFamily={T.heading} fontSize={T.cap}>PER SUPPLIER</text>
        <text x="480" y="214" textAnchor="middle" fill="var(--case-ink)" fontFamily={T.body} fontSize={T.cap}>The last 6 reviewed orders, newest weighted most</text>
      </svg>
    </div>
  );
}

/* ───────── 2 · Accuracy and confidence by supplier ─────────
 * Dot = current accuracy; line = likely range, which widens as confidence falls (±4 / ±7 / ±12).
 * A dot plot, not bars: the axis can start at 50% without exaggerating differences. */
type Row = { name: string; score: number | null; reviewed: number; every: string; conf: 'High' | 'Medium' | 'Low' | 'None' };
const ROWS: Row[] = [
  { name: 'L’Oréal', score: 88, reviewed: 5, every: '4 wk', conf: 'High' },
  { name: 'Schwarzkopf', score: 85, reviewed: 3, every: '6 wk', conf: 'Medium' },
  { name: 'MNP', score: 81, reviewed: 6, every: '3 wk', conf: 'High' },
  { name: 'Keune', score: 78, reviewed: 4, every: '6 wk', conf: 'Medium' },
  { name: 'Davines', score: 77, reviewed: 3, every: '5 wk', conf: 'Medium' },
  { name: 'Moroccanoil', score: 75, reviewed: 2, every: '8 wk', conf: 'Low' },
  { name: 'Wella', score: 72, reviewed: 3, every: '4 wk', conf: 'Medium' },
  { name: 'Olaplex', score: null, reviewed: 0, every: '13 wk', conf: 'None' },
];
const SPREAD = { High: 4, Medium: 7, Low: 12, None: 0 } as const;

export function SupplierAccuracyChart() {
  const id = 'procurement-supplier-accuracy';
  const x0 = 250, x1 = 720, row = 44, top = 70;
  const sx = (v: number) => x0 + ((v - 50) / 50) * (x1 - x0);
  return (
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label="Plan accuracy by supplier; scroll horizontally on small screens">
      <svg viewBox={`0 0 960 ${top + ROWS.length * row + 40}`} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>Plan accuracy and confidence differ by supplier</title>
        <desc id={`${id}-desc`}>{ROWS.map((r) => `${r.name}: ${r.score == null ? 'no score yet' : `${r.score}%`}, ${r.conf.toLowerCase()} confidence, ${r.reviewed} reviewed orders`).join('; ')}.</desc>
        <rect width="960" height={top + ROWS.length * row + 40} fill="var(--case-bg)" />
        {/* Grid and axis labels */}
        {[50, 60, 70, 80, 90, 100].map((v) => (
          <g key={v}>
            <line x1={sx(v)} x2={sx(v)} y1={top - 14} y2={top + ROWS.length * row - 14} stroke="var(--case-rule)" strokeWidth="1" />
            <text x={sx(v)} y={top - 26} textAnchor="middle" fill="var(--case-muted)" fontFamily={T.body} fontSize={T.cap}>{v}%</text>
          </g>
        ))}
        <text x="24" y={top - 26} fill="var(--case-muted)" fontFamily={T.heading} fontSize={T.cap}>SUPPLIER</text>
        <text x="756" y={top - 26} fill="var(--case-muted)" fontFamily={T.heading} fontSize={T.cap}>REVIEWED · ORDERS EVERY</text>
        {ROWS.map((r, i) => {
          const y = top + i * row;
          const s = SPREAD[r.conf];
          const strong = r.name === 'MNP';
          return (
            <g key={r.name}>
              <text x="24" y={y + 5} fill="var(--case-ink)" fontFamily={T.body} fontSize={T.cap} fontWeight={strong ? T.strong : undefined}>{r.name}</text>
              <text x="140" y={y + 5} fill="var(--case-muted)" fontFamily={T.body} fontSize={T.cap}>{r.conf === 'None' ? 'No score yet' : `${r.conf} conf.`}</text>
              {r.score != null ? (
                <>
                  <line x1={sx(r.score - s)} x2={sx(Math.min(100, r.score + s))} y1={y} y2={y} stroke={LINK} strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
                  <circle cx={sx(r.score)} cy={y} r="7" fill={LINK} stroke="var(--case-bg)" strokeWidth="2" />
                  <text x={sx(Math.min(100, r.score + s)) + 12} y={y + 5} fill="var(--case-ink)" fontFamily={T.body} fontSize={T.cap} fontWeight={T.strong}>{r.score}%</text>
                </>
              ) : <text x={sx(50) + 4} y={y + 5} fill="var(--case-muted)" fontFamily={T.body} fontSize={T.cap}>Review a received order to start</text>}
              <text x="756" y={y + 5} fill="var(--case-copy)" fontFamily={T.body} fontSize={T.cap}>{r.reviewed} · {r.every}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ───────── 3 · How one plan's score is built ─────────
 * A number line, read left to right from the track record down to the expected accuracy. */
const STEPS = [
  { label: 'MNP track record', note: '6 reviewed orders', delta: 0 },
  { label: 'Stock-outs hide demand', note: '370102 out of stock 4 of 30 days', delta: -2 },
  { label: 'Thin sales signal', note: '400213 sold 11 pcs in 30 days', delta: -1 },
  { label: 'Lead time varies', note: 'Usually 14 days, 19 on 1 in 10', delta: -1 },
] as const;

export function PlanScoreBuild() {
  const id = 'procurement-plan-score';
  const base = 81, expected = 77, lo = 73, hi = 81;
  const x0 = 520, x1 = 900;
  const sx = (v: number) => x0 + ((v - 70) / 15) * (x1 - x0);
  const rowY = (i: number) => 92 + i * 56;
  let running = base;
  return (
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label="How a plan score is built; scroll horizontally on small screens">
      <svg viewBox="0 0 960 400" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>A new plan starts from the supplier&apos;s track record, then loses points for weak data</title>
        <desc id={`${id}-desc`}>MNP track record 81%. Stock-outs hide demand, minus 2. Thin sales signal, minus 1. Lead time varies, minus 1. Expected accuracy 77%, likely between 73% and 81% because confidence is high.</desc>
        <rect width="960" height="400" fill="var(--case-bg)" />
        {[70, 75, 80, 85].map((v) => (
          <g key={v}>
            <line x1={sx(v)} x2={sx(v)} y1="64" y2="346" stroke="var(--case-rule)" strokeWidth="1" />
            <text x={sx(v)} y="50" textAnchor="middle" fill="var(--case-muted)" fontFamily={T.body} fontSize={T.cap}>{v}%</text>
          </g>
        ))}
        {STEPS.map((s, i) => {
          const from = running; running += s.delta; const y = rowY(i);
          return (
            <g key={s.label}>
              <text x="24" y={y - 4} fill="var(--case-ink)" fontFamily={T.body} fontSize={T.cap} fontWeight={T.strong}>{s.label}</text>
              <text x="24" y={y + 16} fill="var(--case-muted)" fontFamily={T.body} fontSize={T.cap}>{s.note}</text>
              <text x="470" y={y + 5} textAnchor="end" fill={s.delta ? BREAK : 'var(--case-ink)'} fontFamily={T.body} fontSize={T.cap} fontWeight={T.strong}>{s.delta ? s.delta : `${base}%`}</text>
              {s.delta === 0
                ? <circle cx={sx(from)} cy={y} r="7" fill="var(--case-ink)" />
                : <>
                  <line x1={sx(from)} x2={sx(running) + 6} y1={y} y2={y} stroke={BREAK} strokeWidth="6" strokeLinecap="round" />
                  <line x1={sx(from)} x2={sx(from)} y1={rowY(i - 1) + 8} y2={y - 4} stroke="var(--case-rule)" strokeDasharray="3 3" />
                </>}
            </g>
          );
        })}
        {/* Result with its likely range */}
        <line x1="24" x2="936" y1="318" y2="318" stroke="var(--case-rule)" />
        <text x="24" y="356" fill="var(--case-ink)" fontFamily={T.body} fontSize={T.cap} fontWeight={T.strong}>Expected accuracy</text>
        <text x="24" y="376" fill="var(--case-muted)" fontFamily={T.body} fontSize={T.cap}>High confidence · ±4 points</text>
        <text x="470" y="361" textAnchor="end" fill={LINK} fontFamily={T.body} fontSize={T.cap} fontWeight={T.strong}>{expected}%</text>
        <line x1={sx(lo)} x2={sx(hi)} y1="356" y2="356" stroke={LINK} strokeOpacity="0.35" strokeWidth="8" strokeLinecap="round" />
        <circle cx={sx(expected)} cy="356" r="8" fill={LINK} stroke="var(--case-bg)" strokeWidth="2" />
        <text x={sx(hi) + 14} y="361" fill="var(--case-muted)" fontFamily={T.body} fontSize={T.cap}>{lo}–{hi}%</text>
      </svg>
    </div>
  );
}
