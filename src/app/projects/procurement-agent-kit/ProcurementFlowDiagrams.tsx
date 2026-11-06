/**
 * Two diagrams share one canvas so the reader can compare them directly:
 * the legacy purchasing flow (three disconnected places) and the Phase 1
 * flow (one purchase record). SVG coordinates are drawing geometry.
 */

type FlowNode = { title: string; note: string; emphasis?: boolean };
type FlowZone = { label: string; nodes: [FlowNode, FlowNode]; caption: [string, string] };

const ZONE_X = [24, 344, 664] as const;
const NODE_Y = [104, 216] as const;

function Flow({ id, title, desc, zones, solid, legend }: {
  id: string; title: string; desc: string; zones: readonly [FlowZone, FlowZone, FlowZone]; solid: boolean; legend: string;
}) {
  const arrow = `${id}-arrow`;
  const dash = solid ? undefined : '5 4';
  return (
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label={`${title}; scroll horizontally on small screens`}>
      <svg viewBox="0 0 960 440" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>{title}</title>
        <desc id={`${id}-desc`}>{desc}</desc>
        <defs>
          <marker id={arrow} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill="var(--case-copy)" />
          </marker>
        </defs>
        <rect width="960" height="440" fill="var(--case-bg)" />

        <g fill="var(--case-surface)" stroke="var(--case-rule)" strokeWidth="var(--case-border-width)">
          {ZONE_X.map(x => <rect key={x} x={x} y="40" width="272" height="320" rx="8" />)}
        </g>
        <g fontFamily="var(--case-font-heading)" fontSize="var(--case-type-caption)" fill="var(--case-muted)">
          {zones.map((zone, i) => <text key={zone.label} x={ZONE_X[i] + 16} y="68">{zone.label}</text>)}
        </g>

        {/* Arrows: within a zone, then across to the next zone through the gap. */}
        <g fill="none" stroke="var(--case-copy)" strokeWidth="var(--case-focus-width)" strokeDasharray={dash} markerEnd={`url(#${arrow})`}>
          {ZONE_X.map(x => <path key={`v${x}`} d={`M${x + 136} 192 V214`} />)}
          <path d="M280 260 H320 V148 H358" />
          <path d="M600 260 H640 V148 H678" />
        </g>

        {zones.map((zone, zi) => zone.nodes.map((node, ni) => (
          <g key={`${zone.label}-${ni}`}>
            <rect x={ZONE_X[zi] + 16} y={NODE_Y[ni]} width="240" height="88" rx="8" fill="var(--case-bg)"
              stroke={node.emphasis ? 'var(--case-ink)' : 'var(--case-copy)'}
              strokeWidth={node.emphasis ? 'var(--case-focus-width)' : 'var(--case-border-width)'} />
            <text x={ZONE_X[zi] + 136} y={NODE_Y[ni] + 38} textAnchor="middle" fill="var(--case-ink)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-body)" fontWeight="var(--case-weight-strong)">{node.title}</text>
            <text x={ZONE_X[zi] + 136} y={NODE_Y[ni] + 62} textAnchor="middle" fill="var(--case-muted)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">{node.note}</text>
          </g>
        )))}

        <g fill="var(--case-copy)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)" textAnchor="middle">
          {zones.map((zone, i) => (
            <text key={`c${zone.label}`} x={ZONE_X[i] + 136} y="324">
              <tspan x={ZONE_X[i] + 136}>{zone.caption[0]}</tspan>
              <tspan x={ZONE_X[i] + 136} dy="20">{zone.caption[1]}</tspan>
            </text>
          ))}
        </g>

        <line x1="40" y1="388" x2="920" y2="388" stroke="var(--case-rule)" strokeWidth="var(--case-border-width)" />
        <path d="M40 416 H96" fill="none" stroke="var(--case-copy)" strokeWidth="var(--case-focus-width)" strokeDasharray={dash} markerEnd={`url(#${arrow})`} />
        <text x="112" y="420" fill="var(--case-copy)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">{legend}</text>
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
      solid={false}
      legend="Dashed arrow: a person carries information from one place to the next."
      zones={[
        {
          label: 'EXCEL · OUTSIDE THE SYSTEM',
          nodes: [
            { title: 'Download recent sales', note: 'Export, then import into Excel' },
            { title: 'Write the purchase order', note: 'Quantities calculated by hand', emphasis: true },
          ],
          caption: ['The order exists only', 'in a spreadsheet.'],
        },
        {
          label: 'MESSAGES · OUTSIDE THE SYSTEM',
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
      solid
      legend="Solid arrow: the record moves forward inside the ERP. Heavy outline: the judgment still made by hand."
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
        {/* Evidence written to memory. */}
        <g fill="none" stroke="var(--case-muted)" strokeWidth="var(--case-border-width)" strokeDasharray="5 4" markerEnd={`url(#${id}-arrow)`}>
          <path d="M480 96 V213" />
          <path d="M480 464 V347" />
          <path d="M690 170 L602 236" />
          <path d="M690 390 L602 324" />
          <path d="M270 390 L358 324" />
          <path d="M270 170 L358 236" />
        </g>

        {LOOP_NODES.map(node => {
          const emphasis = node.n === '06';
          return (
            <g key={node.n}>
              <rect x={node.x - 100} y={node.y - 38} width="200" height="76" rx="8" fill="var(--case-bg)"
                stroke={emphasis ? 'var(--case-ink)' : 'var(--case-copy)'}
                strokeWidth={emphasis ? 'var(--case-focus-width)' : 'var(--case-border-width)'} />
              <text x={node.x - 84} y={node.y - 12} fill="var(--case-muted)" fontFamily="var(--case-font-heading)" fontSize="var(--case-type-caption)">{node.n}</text>
              <text x={node.x - 56} y={node.y - 12} fill="var(--case-ink)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)" fontWeight="var(--case-weight-strong)">{node.title}</text>
              <text x={node.x - 84} y={node.y + 16} fill="var(--case-muted)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">{node.note}</text>
            </g>
          );
        })}

        <rect x="360" y="215" width="240" height="130" rx="8" fill="var(--case-surface)" stroke="var(--case-ink)" strokeWidth="var(--case-focus-width)" />
        <text x="480" y="252" textAnchor="middle" fill="var(--case-muted)" fontFamily="var(--case-font-heading)" fontSize="var(--case-type-caption)">SUPPLIER MEMORY</text>
        <text x="480" y="284" textAnchor="middle" fill="var(--case-ink)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-body)" fontWeight="var(--case-weight-strong)">One per supplier</text>
        <text x="480" y="310" textAnchor="middle" fill="var(--case-muted)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">recommendations · overrides</text>
        <text x="480" y="330" textAnchor="middle" fill="var(--case-muted)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">outcomes · notes · rules</text>
      </svg>
    </div>
  );
}
