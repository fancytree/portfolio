import { caseRadiusPx, fontFamily } from '@/lib/design-tokens';

const operationalRecords = ['Sales', 'Inventory', 'Purchases', 'Receiving'] as const;
const decisionContext = ['Supplier rules', 'Lead time', 'MOQ', 'Seasonality', 'Delivery history', 'Buyer overrides'] as const;

function DiagramList({
  items,
  x,
  y,
  columns,
  columnWidth,
  rowGap,
  bullet,
}: {
  items: readonly string[];
  x: number;
  y: number;
  columns: number;
  columnWidth: number;
  rowGap: number;
  bullet: string;
}) {
  const rows = Math.ceil(items.length / columns);

  return items.map((item, index) => {
    const column = Math.floor(index / rows);
    const row = index % rows;
    const itemX = x + column * columnWidth;
    const itemY = y + row * rowGap;

    return (
      <g key={item}>
        <rect x={itemX} y={itemY - 8} width="4" height="4" fill={bullet} />
        <text x={itemX + 16} y={itemY} fill="#ffffff" fontFamily={fontFamily.sans} fontSize="12" fontWeight="600">
          {item}
        </text>
      </g>
    );
  });
}

export default function AgentReadyContextDiagram() {
  return (
    <figure className="m-0">
      <div className="overflow-x-auto pb-2">
        <svg
          className="h-auto min-w-[820px] w-full"
          viewBox="0 0 1080 320"
          role="img"
          aria-labelledby="agent-ready-context-title agent-ready-context-description"
        >
          <title id="agent-ready-context-title">Operational evidence and decision context converge into Agent-ready context</title>
          <desc id="agent-ready-context-description">
            Sales, inventory, purchases and receiving provide operational evidence. Supplier rules, lead time, minimum order quantity, seasonality, delivery history and buyer overrides provide decision context. Together they create structured context the procurement Agent can use.
          </desc>

          <defs>
            <marker id="agent-ready-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#7fa2ff" />
            </marker>
          </defs>

          {/* Arrows sit behind the source zones and use separate target attach points. */}
          <g fill="none" stroke="#7fa2ff" strokeWidth="1.2" markerEnd="url(#agent-ready-arrow)">
            <path d="M640 96 H752 Q760 96 760 104 V136 Q760 144 768 144 H776" />
            <path d="M744 244 H752 Q760 244 760 236 V224 Q760 216 768 216 H776" />
          </g>

          <g>
            <rect x="0" y="40" width="640" height="112" rx={caseRadiusPx.sm} fill="rgb(255 255 255 / 0.03)" stroke="rgb(255 255 255 / 0.2)" />
            <text x="24" y="72" fill="#9f9f9f" fontFamily={fontFamily.sans} fontSize="8" fontWeight="700" letterSpacing="1.4">
              OPERATIONAL RECORDS
            </text>
            <text x="24" y="108" fill="#ffffff" fontFamily={fontFamily.sans} fontSize="20" fontWeight="700">
              What happened
            </text>
            <line x1="208" y1="64" x2="208" y2="128" stroke="rgb(255 255 255 / 0.16)" />
            <DiagramList items={operationalRecords} x={232} y={84} columns={2} columnWidth={168} rowGap={32} bullet="#777777" />
          </g>

          <g>
            <rect x="0" y="184" width="744" height="120" rx={caseRadiusPx.sm} fill="rgb(255 255 255 / 0.03)" stroke="rgb(255 255 255 / 0.2)" />
            <text x="24" y="216" fill="#7fa2ff" fontFamily={fontFamily.sans} fontSize="8" fontWeight="700" letterSpacing="1.4">
              DECISION CONTEXT
            </text>
            <text x="24" y="252" fill="#ffffff" fontFamily={fontFamily.sans} fontSize="20" fontWeight="700">
              What shapes the decision
            </text>
            <line x1="292" y1="208" x2="292" y2="280" stroke="rgb(255 255 255 / 0.16)" />
            <DiagramList items={decisionContext} x={316} y={228} columns={3} columnWidth={128} rowGap={36} bullet="#7fa2ff" />
          </g>

          <g>
            <rect x="776" y="88" width="304" height="184" rx={caseRadiusPx.sm} fill="rgb(33 85 232 / 0.18)" stroke="#7fa2ff" strokeWidth="1.2" />
            <rect x="800" y="112" width="104" height="20" rx="2" fill="#2155e8" />
            <text x="852" y="126" textAnchor="middle" fill="#ffffff" fontFamily={fontFamily.sans} fontSize="8" fontWeight="700" letterSpacing="1.2">
              STRUCTURED
            </text>
            <text x="800" y="168" fill="#ffffff" fontFamily={fontFamily.sans} fontSize="20" fontWeight="700">
              Agent-ready context
            </text>
            <line x1="800" y1="188" x2="1056" y2="188" stroke="rgb(127 162 255 / 0.45)" />
            <text x="800" y="216" fill="#d8e2ff" fontFamily={fontFamily.sans} fontSize="12" fontWeight="600">
              Evidence with rules and authority
            </text>
            <text x="800" y="240" fill="#b8caff" fontFamily={fontFamily.sans} fontSize="12">
              ready for interpretation and calculation
            </text>
          </g>

        </svg>
      </div>
    </figure>
  );
}
