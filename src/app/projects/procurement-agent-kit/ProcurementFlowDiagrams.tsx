/**
 * Two diagrams share one canvas so the reader can compare them directly:
 * the legacy purchasing flow (three disconnected places) and the Phase 1
 * flow (one purchase record). SVG coordinates are drawing geometry.
 */

import styles from './ProcurementFlowDiagrams.module.css';

/** Length of an orthogonal path made of M / H / V commands. */
function pathLength(d: string) {
  let x = 0, y = 0, len = 0;
  for (const [, cmd, a, b] of d.matchAll(/([MHVL])\s*(-?[\d.]+)(?:\s+(-?[\d.]+))?/g)) {
    const n = Number(a);
    if (cmd === 'M') { x = n; y = Number(b); }
    else if (cmd === 'H') { len += Math.abs(n - x); x = n; }
    else if (cmd === 'V') { len += Math.abs(n - y); y = n; }
    else { const nx = n, ny = Number(b); len += Math.hypot(nx - x, ny - y); x = nx; y = ny; }
  }
  return len;
}

/**
 * A dot that travels a sequence of paths at one steady speed: each hop starts when the previous
 * one ends, then the loop rests briefly. Every hop shares one looping timeline; its keyframes are
 * placed by its share of the total length, so short hops no longer flash past and long ones no
 * longer leave a gap. Pure CSS, generated here, so it needs no client JS.
 */
export function FlowPulse({ id, paths, speed = 240, rest = 0.6 }: { id: string; paths: readonly string[]; speed?: number; rest?: number }) {
  const dot = 16;
  const lens = paths.map(pathLength);
  const durs = lens.map((l) => Math.max(0.3, l / speed));
  const total = durs.reduce((a, b) => a + b, 0) + rest;
  const pct = (t: number) => ((t / total) * 100).toFixed(3);
  const starts = durs.map((_, i) => durs.slice(0, i).reduce((a, b) => a + b, 0));
  const css = paths.map((_, i) => {
    const len = lens[i], seg = Math.min(dot, len), s0 = starts[i], s1 = starts[i] + durs[i];
    const name = `${id}-k${i}`;
    return `@keyframes ${name}{0%,${pct(s0)}%{stroke-dashoffset:${seg};opacity:0}${pct(s0 + 0.001)}%{stroke-dashoffset:${seg};opacity:.9}${pct(s1)}%{stroke-dashoffset:${-len};opacity:.9}${pct(s1 + 0.001)}%,100%{stroke-dashoffset:${-len};opacity:0}}`
      + `.${name}{animation:${name} ${total.toFixed(3)}s linear infinite}`;
  }).join('');
  return (
    <g className={styles.flowDot}>
      <style>{css}</style>
      {paths.map((d, i) => (
        <path key={d} className={`${id}-k${i}`} d={d} fill="none" stroke="var(--case-flow-link)" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${Math.min(dot, lens[i])} ${lens[i] + dot}`} opacity="0" />
      ))}
    </g>
  );
}

type FlowNode = { title: string; note: string; emphasis?: boolean };
type FlowZone = { label: string; nodes: [FlowNode, FlowNode]; caption: [string, string]; outside?: boolean };

const ZONE_X = [24, 344, 664] as const;
const NODE_Y = [104, 216] as const;
const BREAK = 'var(--case-flow-break)';
const LINK = 'var(--case-flow-link)';
/** Zone-to-zone routes, drawn through the gap between zones. */
const CROSS = ['M280 260 H320 V148 H358', 'M600 260 H640 V148 H678'] as const;
const CROSS_X = [320, 640] as const;

function Flow({ id, title, desc, zones, broken, legend }: {
  id: string; title: string; desc: string; zones: readonly [FlowZone, FlowZone, FlowZone]; broken: boolean; legend: string;
}) {
  const copyArrow = `${id}-arrow`;
  const accentArrow = `${id}-arrow-accent`;
  const dash = broken ? '5 4' : undefined;
  const carry = broken ? styles.carry : undefined;
  // Pulse order follows the purchase: zone 1 down, across, zone 2 down, across, zone 3 down.
  const pulsePaths = [`M160 192 V214`, CROSS[0], `M480 192 V214`, CROSS[1], `M800 192 V214`];
  return (
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label={`${title}; scroll horizontally on small screens`}>
      <svg viewBox="0 0 960 440" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>{title}</title>
        <desc id={`${id}-desc`}>{desc}</desc>
        <defs>
          <marker id={copyArrow} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill="var(--case-copy)" />
          </marker>
          <marker id={accentArrow} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill={broken ? BREAK : LINK} />
          </marker>
        </defs>
        <rect width="960" height="440" fill="var(--case-bg)" />

        <g fill="var(--case-surface)" strokeWidth="var(--case-border-width)">
          {ZONE_X.map((x, i) => (
            <rect key={x} x={x} y="40" width="272" height="320" rx="8"
              stroke={broken && zones[i].outside ? BREAK : 'var(--case-rule)'}
              strokeDasharray={broken && zones[i].outside ? '6 4' : undefined} />
          ))}
        </g>
        <g fontFamily="var(--case-font-heading)" fontSize="var(--case-type-caption)">
          {zones.map((zone, i) => (
            <text key={zone.label} x={ZONE_X[i] + 16} y="68" fill={broken && zone.outside ? BREAK : 'var(--case-muted)'}>{zone.label}</text>
          ))}
        </g>

        {/* Within a zone. In the old flow a person carries each step, so the dashes march. */}
        <g fill="none" stroke={broken ? 'var(--case-copy)' : LINK} strokeWidth="var(--case-focus-width)" strokeDasharray={dash} markerEnd={`url(#${broken ? copyArrow : accentArrow})`}>
          {ZONE_X.map(x => <path key={`v${x}`} className={carry} d={`M${x + 136} 192 V214`} />)}
        </g>

        {/* Across zones. Old flow: the route is cut and marked. New flow: one unbroken line. */}
        {broken ? (
          <g fill="none" stroke={BREAK} strokeWidth="var(--case-focus-width)" strokeDasharray={dash}>
            {CROSS.map((d, i) => {
              const x = CROSS_X[i];
              const [head] = d.split(' V148');
              return (
                <g key={d}>
                  <path className={styles.carry} d={`${head} V222`} />
                  <path className={styles.carry} d={`M${x} 186 V148 H${x + 38}`} markerEnd={`url(#${accentArrow})`} />
                </g>
              );
            })}
          </g>
        ) : (
          <g fill="none" stroke={LINK} strokeWidth="var(--case-focus-width)">
            {CROSS.map(d => <path key={d} d={d} markerEnd={`url(#${accentArrow})`} />)}
          </g>
        )}

        {CROSS_X.map((x, i) => (
          <g key={x}>
            {broken && <circle className={`${styles.ring} ${i ? styles.ringLate : ''}`} cx={x} cy="204" r="12" fill="none" stroke={BREAK} strokeWidth="var(--case-border-width)" />}
            <circle cx={x} cy="204" r="12" fill={broken ? 'var(--case-bg)' : LINK} stroke={broken ? BREAK : LINK} strokeWidth="var(--case-focus-width)" />
            <path d={broken ? `M${x - 5} 199 L${x + 5} 209 M${x + 5} 199 L${x - 5} 209` : `M${x - 5} 204 L${x - 1.5} 207.5 L${x + 5} 200.5`}
              fill="none" stroke={broken ? BREAK : 'var(--case-bg)'} strokeWidth="var(--case-focus-width)" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}

        {/* The record moving forward, one hop after another. */}
        {!broken && <FlowPulse id={`${id}-pulse`} paths={pulsePaths} />}

        {zones.map((zone, zi) => zone.nodes.map((node, ni) => {
          const flagged = broken && node.emphasis;
          return (
            <g key={`${zone.label}-${ni}`}>
              <rect x={ZONE_X[zi] + 16} y={NODE_Y[ni]} width="240" height="88" rx="8" fill="var(--case-bg)"
                stroke={flagged ? BREAK : node.emphasis ? 'var(--case-ink)' : 'var(--case-copy)'}
                strokeWidth={node.emphasis ? 'var(--case-focus-width)' : 'var(--case-border-width)'} />
              <text x={ZONE_X[zi] + 136} y={NODE_Y[ni] + 38} textAnchor="middle" fill="var(--case-ink)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-body)" fontWeight="var(--case-weight-strong)">{node.title}</text>
              <text x={ZONE_X[zi] + 136} y={NODE_Y[ni] + 62} textAnchor="middle" fill={flagged ? BREAK : 'var(--case-muted)'} fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">{node.note}</text>
            </g>
          );
        }))}

        <g fill="var(--case-copy)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)" textAnchor="middle">
          {zones.map((zone, i) => (
            <text key={`c${zone.label}`} x={ZONE_X[i] + 136} y="324">
              <tspan x={ZONE_X[i] + 136}>{zone.caption[0]}</tspan>
              <tspan x={ZONE_X[i] + 136} dy="20">{zone.caption[1]}</tspan>
            </text>
          ))}
        </g>

        <line x1="40" y1="388" x2="920" y2="388" stroke="var(--case-rule)" strokeWidth="var(--case-border-width)" />
        {broken ? (
          <>
            <path d="M40 416 H96" fill="none" stroke="var(--case-copy)" strokeWidth="var(--case-focus-width)" strokeDasharray={dash} markerEnd={`url(#${copyArrow})`} />
            <text x="112" y="420" fill="var(--case-copy)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">A person carries information across.</text>
            <circle cx="504" cy="416" r="9" fill="var(--case-bg)" stroke={BREAK} strokeWidth="var(--case-focus-width)" />
            <path d="M500 412 L508 420 M508 412 L500 420" fill="none" stroke={BREAK} strokeWidth="var(--case-focus-width)" strokeLinecap="round" />
            <text x="524" y="420" fill={BREAK} fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">{legend}</text>
          </>
        ) : (
          <>
            <path d="M40 416 H96" fill="none" stroke={LINK} strokeWidth="var(--case-focus-width)" markerEnd={`url(#${accentArrow})`} />
            <text x="112" y="420" fill="var(--case-copy)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">{legend}</text>
          </>
        )}
      </svg>
    </div>
  );
}

/** Before the ERP: the purchase is split across Excel, messages, and the delivery note. */
export function LegacyProcurementFlow() {
  return (
    <Flow
      id="procurement-legacy-flow"
      title="The purchase was scattered across Excel, messages, and the delivery note"
      desc="A buyer downloads recent sales, imports them into Excel, and writes the purchase order there. The order and the supplier's confirmation travel in messages, outside the system. The only system record is goods received, keyed in from the delivery note (DDT) that arrives with the goods, which cannot represent batch arrivals."
      broken
      legend="The link is lost here."
      zones={[
        {
          label: 'EXCEL · OUTSIDE THE SYSTEM',
          outside: true,
          nodes: [
            { title: 'Download recent sales', note: 'Export, then import into Excel' },
            { title: 'Write the purchase order', note: 'Quantities calculated by hand', emphasis: true },
          ],
          caption: ['The order exists only', 'in a spreadsheet.'],
        },
        {
          label: 'MESSAGES · OUTSIDE THE SYSTEM',
          outside: true,
          nodes: [
            { title: 'Send the order', note: 'File or message to the supplier' },
            { title: 'Confirmation in chat', note: 'Stockouts and changes stay there', emphasis: true },
          ],
          caption: ['The supplier’s answer is', 'not in the system.'],
        },
        {
          label: 'SYSTEM · THE ONLY RECORD',
          nodes: [
            { title: 'Goods arrive with a DDT', note: 'Delivery note travels with the goods' },
            { title: 'Key in what the DDT says', note: 'No way to record batch arrivals', emphasis: true },
          ],
          caption: ['Receiving follows the DDT,', 'not the original order.'],
        },
      ]}
    />
  );
}

/** Phase 1: the same three moments, now on one purchase record. */
export function ConnectedProcurementFlow() {
  return (
    <Flow
      id="procurement-connected-flow"
      title="Phase 1 put the purchase lifecycle on one record"
      desc="The buyer still drafts the order from sales. The order, the supplier's confirmation, and each receiving batch now attach to the same purchase record, so differences and partial arrivals are visible."
      broken={false}
      legend="Blue: the record moves forward inside the ERP. Heavy outline: judgment still made by hand."
      zones={[
        {
          label: '1 · ORDER',
          nodes: [
            { title: 'Draft the order', note: 'Quantity still judged from sales', emphasis: true },
            { title: 'Order recorded', note: 'Supplier, quantities, price' },
          ],
          caption: ['The purchase becomes', 'a record, not a file.'],
        },
        {
          label: '2 · CONFIRM',
          nodes: [
            { title: 'Confirmation logged', note: 'Attached to the same purchase' },
            { title: 'Differences visible', note: 'Missing, quantity, price' },
          ],
          caption: ['The supplier’s answer is', 'on the purchase.'],
        },
        {
          label: '3 · RECEIVE',
          nodes: [
            { title: 'Receive against the order', note: 'Ordered · DDT · actual, linked' },
            { title: 'Batch arrivals recorded', note: 'Each shipment adds progress' },
          ],
          caption: ['Partial arrivals stay', 'tied to the original intent.'],
        },
      ]}
    />
  );
}

const RING_PATHS = ['M580 56 H790 V120', 'M790 198 V362', 'M790 438 V504 H582', 'M378 504 H170 V440', 'M170 362 V198', 'M170 122 V56 H378'] as const;

const LOOP_NODES = [
  { n: '01', title: 'Supplier confirmation', note: 'Commitment and stockouts', x: 480, y: 56 },
  { n: '02', title: 'DDT', note: 'Shipment evidence', x: 790, y: 160 },
  { n: '03', title: 'Receiving', note: 'What physically arrived', x: 790, y: 400 },
  { n: '04', title: 'Variance', note: 'Compared with the order', x: 480, y: 504 },
  { n: '05', title: 'Outcome', note: 'Over, short, or on time', x: 170, y: 400 },
  { n: '06', title: 'Review', note: 'Buyer confirms to keep', x: 170, y: 160 },
] as const;

/** The Agent's long-term memory, fed by every purchase outcome and changed only through review. */
export function AgentMemoryLoop() {
  const id = 'procurement-memory-loop';
  return (
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label="Per-supplier memory loop; scroll horizontally on small screens">
      <svg viewBox="0 0 960 560" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>The Agent keeps a memory for each supplier, built from every purchase</title>
        <desc id={`${id}-desc`}>Supplier confirmation, delivery note, receiving, variance, and outcome feed that supplier&apos;s memory at the centre. The buyer reviews what to keep, and only reviewed learning informs the next plan.</desc>
        <defs>
          <marker id={`${id}-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill="var(--case-copy)" />
          </marker>
        </defs>
        <rect width="960" height="560" fill="var(--case-bg)" />

        {/* Purchase flow around the ring. */}
        <g fill="none" stroke="var(--case-copy)" strokeWidth="var(--case-focus-width)" markerEnd={`url(#${id}-arrow)`}>
          <path d="M580 56 H790 V120" />
          <path d="M790 198 V362" />
          <path d="M790 438 V504 H582" />
          <path d="M378 504 H170 V440" />
          <path d="M170 362 V198" />
          <path d="M170 122 V56 H378" />
        </g>
        {/* The purchase moving round the ring, one step after another. */}
        <FlowPulse id={`${id}-pulse`} paths={RING_PATHS} />
        {/* Evidence written to memory. */}
        <g fill="none" stroke="var(--case-muted)" strokeWidth="var(--case-border-width)" strokeDasharray="5 4" markerEnd={`url(#${id}-arrow)`}>
          {['M480 96 V213', 'M480 464 V347', 'M690 170 L602 236', 'M690 390 L602 324', 'M270 390 L358 324', 'M270 170 L358 236'].map(d => <path key={d} className={styles.carry} d={d} />)}
        </g>

        {LOOP_NODES.map(node => {
          const emphasis = node.n === '06';
          return (
            <g key={node.n}>
              <rect x={node.x - 100} y={node.y - 38} width="200" height="76" rx="8" fill="var(--case-bg)"
                stroke={emphasis ? LINK : 'var(--case-copy)'}
                strokeWidth={emphasis ? 'var(--case-focus-width)' : 'var(--case-border-width)'} />
              {emphasis && <rect className={styles.breathe} x={node.x - 100} y={node.y - 38} width="200" height="76" rx="8" fill="none" stroke={LINK} strokeWidth="var(--case-border-width)" />}
              <text x={node.x - 84} y={node.y - 12} fill={emphasis ? LINK : 'var(--case-muted)'} fontFamily="var(--case-font-heading)" fontSize="var(--case-type-caption)">{node.n}</text>
              <text x={node.x - 56} y={node.y - 12} fill="var(--case-ink)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)" fontWeight="var(--case-weight-strong)">{node.title}</text>
              <text x={node.x - 84} y={node.y + 16} fill="var(--case-muted)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">{node.note}</text>
            </g>
          );
        })}

        <rect className={styles.breathe} x="360" y="215" width="240" height="130" rx="8" fill="none" stroke="var(--case-ink)" strokeWidth="var(--case-border-width)" />
        <rect x="360" y="215" width="240" height="130" rx="8" fill="var(--case-surface)" stroke="var(--case-ink)" strokeWidth="var(--case-focus-width)" />
        <text x="480" y="252" textAnchor="middle" fill="var(--case-muted)" fontFamily="var(--case-font-heading)" fontSize="var(--case-type-caption)">SUPPLIER MEMORY</text>
        <text x="480" y="284" textAnchor="middle" fill="var(--case-ink)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-body)" fontWeight="var(--case-weight-strong)">One per supplier</text>
        <text x="480" y="310" textAnchor="middle" fill="var(--case-muted)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">recommendations · overrides</text>
        <text x="480" y="330" textAnchor="middle" fill="var(--case-muted)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">outcomes · notes · rules</text>
      </svg>
    </div>
  );
}

/* ───────── Human in the loop ─────────
 * Two lanes across one purchase: what the Agent prepares, and what the buyer decides.
 * Thick outlines mark human gates, where the flow waits for a person; the dashed box is
 * the one thing the Agent is never allowed to do. */
type Lane = { lines: string[]; gate?: boolean; never?: boolean };
const HITL: { stage: string; agent: Lane; buyer: Lane }[] = [
  { stage: 'Plan', agent: { lines: ['Drafts quantities', 'and shows why'] }, buyer: { lines: ['Edits any line'] } },
  { stage: 'Confirm', agent: { lines: ['Compares the', 'supplier PDF'] }, buyer: { lines: ['Checks the', 'marked lines'] } },
  { stage: 'Approve', agent: { lines: ['Lists the', 'approval checks'] }, buyer: { lines: ['Approves, or', 'asks the owner'], gate: true } },
  { stage: 'Order', agent: { lines: ['Cannot place', 'the order'], never: true }, buyer: { lines: ['Orders outside,', 'marks ordered'], gate: true } },
  { stage: 'Receive', agent: { lines: ['Fills Actual', 'from the DDT'] }, buyer: { lines: ['Confirms what', 'arrived'], gate: true } },
  { stage: 'Review', agent: { lines: ['Scores the plan', 'against sales'] }, buyer: { lines: ['Adds judgment,', 'saves or skips'], gate: true } },
];

export function HumanInTheLoopFlow() {
  const id = 'procurement-hitl';
  const x0 = 132, colW = 136, boxW = 122, agentY = 92, buyerY = 250, boxH = 84;
  const cx = (i: number) => x0 + i * colW + colW / 2;
  const text = (lines: string[], x: number, y: number, fill: string, weight?: string) => lines.map((l, k) => (
    <text key={k} x={x} y={y + k * 20} textAnchor="middle" fill={fill} fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)" fontWeight={weight}>{l}</text>
  ));
  return (
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label="Human in the loop; scroll horizontally on small screens">
      <svg viewBox="0 0 960 470" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>The Agent prepares every step; four steps wait for a person</title>
        <desc id={`${id}-desc`}>{HITL.map((c) => `${c.stage}: the Agent ${c.agent.lines.join(' ').toLowerCase()}; the buyer ${c.buyer.lines.join(' ').toLowerCase()}${c.buyer.gate ? ' (human gate)' : ''}.`).join(' ')}</desc>
        <defs>
          <marker id={`${id}-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="var(--case-muted)" /></marker>
          <marker id={`${id}-flow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="var(--case-copy)" /></marker>
        </defs>
        <rect width="960" height="470" fill="var(--case-bg)" />

        {/* Lane bands and labels */}
        <rect x="16" y={agentY - 16} width="928" height={boxH + 32} rx="8" fill="var(--case-surface)" />
        <rect x="16" y={buyerY - 16} width="928" height={boxH + 32} rx="8" fill="var(--case-surface)" />
        <text x="32" y={agentY + boxH / 2 - 4} fill={LINK} fontFamily="var(--case-font-heading)" fontSize="var(--case-type-caption)">AGENT</text>
        <text x="32" y={agentY + boxH / 2 + 16} fill="var(--case-muted)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">prepares</text>
        <text x="32" y={buyerY + boxH / 2 - 4} fill="var(--case-ink)" fontFamily="var(--case-font-heading)" fontSize="var(--case-type-caption)">BUYER</text>
        <text x="32" y={buyerY + boxH / 2 + 16} fill="var(--case-muted)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">decides</text>

        {/* Stage header with the purchase moving left to right */}
        <line x1={cx(0) - 40} x2={cx(HITL.length - 1) + 40} y1="40" y2="40" stroke="var(--case-copy)" strokeWidth="var(--case-border-width)" markerEnd={`url(#${id}-flow)`} />
        {HITL.map((c, i) => (
          <g key={c.stage}>
            <circle cx={cx(i)} cy="40" r="13" fill="var(--case-bg)" stroke="var(--case-copy)" strokeWidth="var(--case-border-width)" />
            <text x={cx(i)} y="45" textAnchor="middle" fill="var(--case-ink)" fontFamily="var(--case-font-heading)" fontSize="var(--case-type-caption)">{i + 1}</text>
            <text x={cx(i)} y="72" textAnchor="middle" fill="var(--case-ink)" fontFamily="var(--case-font-heading)" fontSize="var(--case-type-caption)">{c.stage.toUpperCase()}</text>
          </g>
        ))}

        {HITL.map((c, i) => {
          const x = cx(i) - boxW / 2;
          const a = c.agent, b = c.buyer;
          return (
            <g key={`col-${c.stage}`}>
              {/* Agent box */}
              <rect x={x} y={agentY} width={boxW} height={boxH} rx="8" fill="var(--case-bg)"
                stroke={a.never ? BREAK : LINK} strokeWidth="var(--case-border-width)" strokeDasharray={a.never ? '5 4' : undefined} />
              {text(a.lines, cx(i), agentY + boxH / 2 - 4, a.never ? BREAK : 'var(--case-copy)')}
              {/* Handoff */}
              {!a.never && <line x1={cx(i)} x2={cx(i)} y1={agentY + boxH + 2} y2={buyerY - (b.gate ? 16 : 4)} stroke="var(--case-muted)" strokeWidth="var(--case-border-width)" markerEnd={`url(#${id}-arrow)`} />}
              {/* Buyer box; gates are heavy and tagged */}
              <rect x={x} y={buyerY} width={boxW} height={boxH} rx="8" fill="var(--case-bg)"
                stroke="var(--case-ink)" strokeWidth={b.gate ? 3 : 'var(--case-border-width)'} />
              {b.gate && <>
                <rect className={styles.breathe} x={x} y={buyerY} width={boxW} height={boxH} rx="8" fill="none" stroke="var(--case-ink)" strokeWidth="var(--case-border-width)" />
                <rect x={cx(i) - 26} y={buyerY - 11} width="52" height="22" rx="11" fill="var(--case-ink)" />
                <text x={cx(i)} y={buyerY + 4} textAnchor="middle" fill="var(--case-bg)" fontFamily="var(--case-font-heading)" fontSize="var(--case-type-caption)">GATE</text>
              </>}
              {text(b.lines, cx(i), buyerY + boxH / 2 + (b.lines.length > 1 ? -4 : 6), 'var(--case-ink)', b.gate ? 'var(--case-weight-strong)' : undefined)}
            </g>
          );
        })}

        {/* Legend */}
        <g fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">
          <rect x="32" y="400" width="34" height="22" rx="6" fill="var(--case-bg)" stroke="var(--case-ink)" strokeWidth="3" />
          <text x="76" y="416" fill="var(--case-copy)">Human gate · the purchase waits until a person acts</text>
          <rect x="490" y="400" width="34" height="22" rx="6" fill="var(--case-bg)" stroke={BREAK} strokeDasharray="5 4" />
          <text x="534" y="416" fill="var(--case-copy)">Never the Agent’s job</text>
          <rect x="726" y="400" width="34" height="22" rx="6" fill="var(--case-bg)" stroke={LINK} />
          <text x="770" y="416" fill="var(--case-copy)">Agent prepares</text>
        </g>
      </svg>
    </div>
  );
}

/* Compact memory loop, sized for a decision card's visual column (wide, not tall). */
const C_NODES = [
  { n: '01', title: 'Confirmation', note: 'Commitment, stockouts', x: 360, y: 56 },
  { n: '02', title: 'DDT', note: 'Shipment evidence', x: 610, y: 160 },
  { n: '03', title: 'Receiving', note: 'What arrived', x: 610, y: 300 },
  { n: '04', title: 'Variance', note: 'Against the order', x: 360, y: 404 },
  { n: '05', title: 'Outcome', note: 'Over, short, on time', x: 110, y: 300 },
  { n: '06', title: 'Review', note: 'Buyer decides to keep', x: 110, y: 160 },
] as const;
const C_RING = ['M448 56 H610 V124', 'M610 192 V264', 'M610 332 V404 H452', 'M272 404 H110 V336', 'M110 268 V196', 'M110 128 V56 H268'] as const;

export function AgentMemoryLoopCompact() {
  const id = 'procurement-memory-compact';
  return (
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label="Per-supplier memory loop">
      <svg viewBox="0 0 720 460" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>Each purchase writes evidence to its supplier&apos;s memory; only review changes it</title>
        <desc id={`${id}-desc`}>Confirmation, DDT, receiving, variance and outcome each write evidence to that supplier&apos;s memory in the centre. The buyer&apos;s review decides what is kept for the next plan.</desc>
        <defs>
          <marker id={`${id}-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="var(--case-copy)" /></marker>
        </defs>
        <rect width="720" height="460" fill="var(--case-bg)" />
        <g fill="none" stroke="var(--case-copy)" strokeWidth="var(--case-focus-width)" markerEnd={`url(#${id}-arrow)`}>
          {C_RING.map((d) => <path key={d} d={d} />)}
        </g>
        <FlowPulse id={`${id}-pulse`} paths={C_RING} />
        {/* Evidence written to memory */}
        <g fill="none" stroke="var(--case-muted)" strokeWidth="var(--case-border-width)" strokeDasharray="5 4" markerEnd={`url(#${id}-arrow)`}>
          {['M360 88 V160', 'M360 372 V300', 'M522 170 L476 196', 'M522 290 L476 264', 'M198 290 L244 264', 'M198 170 L244 196'].map((d) => <path key={d} className={styles.carry} d={d} />)}
        </g>
        {C_NODES.map((node) => {
          const em = node.n === '06';
          return (
            <g key={node.n}>
              <rect x={node.x - 88} y={node.y - 32} width="176" height="64" rx="8" fill="var(--case-bg)" stroke={em ? LINK : 'var(--case-copy)'} strokeWidth={em ? 'var(--case-focus-width)' : 'var(--case-border-width)'} />
              {em && <rect className={styles.breathe} x={node.x - 88} y={node.y - 32} width="176" height="64" rx="8" fill="none" stroke={LINK} strokeWidth="var(--case-border-width)" />}
              <text x={node.x - 74} y={node.y - 6} fill={em ? LINK : 'var(--case-muted)'} fontFamily="var(--case-font-heading)" fontSize="var(--case-type-caption)">{node.n}</text>
              <text x={node.x - 48} y={node.y - 6} fill="var(--case-ink)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)" fontWeight="var(--case-weight-strong)">{node.title}</text>
              <text x={node.x - 74} y={node.y + 18} fill="var(--case-muted)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">{node.note}</text>
            </g>
          );
        })}
        <rect className={styles.breathe} x="250" y="166" width="220" height="128" rx="8" fill="none" stroke="var(--case-ink)" strokeWidth="var(--case-border-width)" />
        <rect x="250" y="166" width="220" height="128" rx="8" fill="var(--case-surface)" stroke="var(--case-ink)" strokeWidth="var(--case-focus-width)" />
        <text x="360" y="200" textAnchor="middle" fill="var(--case-muted)" fontFamily="var(--case-font-heading)" fontSize="var(--case-type-caption)">SUPPLIER MEMORY</text>
        <text x="360" y="230" textAnchor="middle" fill="var(--case-ink)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-body)" fontWeight="var(--case-weight-strong)">One per supplier</text>
        <text x="360" y="256" textAnchor="middle" fill="var(--case-muted)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">overrides · outcomes</text>
        <text x="360" y="276" textAnchor="middle" fill="var(--case-muted)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">notes · rules</text>
      </svg>
    </div>
  );
}
