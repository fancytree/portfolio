/**
 * Two diagrams share one canvas so the reader can compare them directly:
 * the legacy purchasing flow (three disconnected places) and the Phase 1
 * flow (one purchase record). SVG coordinates are drawing geometry.
 */

import styles from './ProcurementFlowDiagrams.module.css';

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
        {!broken && pulsePaths.map((d, i) => (
          <path key={d} className={styles.pulse} d={d} pathLength={1} stroke={LINK} strokeWidth="5" style={{ animationDelay: `${i * 0.9}s` }} />
        ))}

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
        <desc id={`${id}-desc`}>Supplier confirmation, delivery note, receiving, variance, and outcome feed that supplier's memory at the centre. The buyer reviews what to keep, and only reviewed learning informs the next plan.</desc>
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
        {RING_PATHS.map((d, i) => (
          <path key={d} className={styles.pulse} d={d} pathLength={1} stroke={LINK} strokeWidth="5" style={{ animationDelay: `${i * 1}s` }} />
        ))}
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
