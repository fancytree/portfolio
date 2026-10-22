/** The legacy information landscape, not the connected ERP topology. */
export default function FragmentedOperationsDiagram() {
  return (
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label="Legacy operations diagram; scroll horizontally on small screens">
      <svg viewBox="0 0 960 600" role="img" aria-labelledby="def-erp-fragmented-operations-title def-erp-fragmented-operations-desc">
        <title id="def-erp-fragmented-operations-title">Disconnected systems and manual handoffs</title>
        <desc id="def-erp-fragmented-operations-desc">The product catalogue and desktop inventory do not share live stock, so sales staff take orders in WeChat, re-enter them in the inventory platform, and message dispatch updates to customers while finance re-enters invoice items.</desc>
        <defs>
          <marker id="def-fragmented-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill="var(--case-copy)" />
          </marker>
        </defs>
        <rect width="960" height="600" fill="var(--case-bg)" />

        {/* Separate zones describe tool boundaries, not one shared platform. */}
        <g fill="var(--case-surface)" stroke="var(--case-rule)" strokeWidth="var(--case-border-width)">
          <rect x="24" y="96" width="256" height="400" rx="8" />
          <rect x="344" y="96" width="272" height="400" rx="8" />
          <rect x="664" y="96" width="272" height="400" rx="8" />
        </g>
        <g fontFamily="var(--case-font-heading)" fontSize="var(--case-type-caption)" fill="var(--case-muted)">
          <text x="40" y="124">MINI-PROGRAM BACKEND</text>
          <text x="368" y="124">WECHAT CONVERSATIONS</text>
          <text x="688" y="124">INTERNAL OPERATIONS</text>
        </g>

        {/* The stock relationship is deliberately interrupted, with no arrow. */}
        <g fill="none" stroke="var(--case-ink)" strokeWidth="var(--case-focus-width)">
          <path d="M224 152 V72 Q224 64 232 64 H456" />
          <path d="M504 64 H880 Q888 64 888 72 V152" />
          <path d="M468 56 L480 72 M480 56 L492 72" />
        </g>
        <rect x="384" y="28" width="192" height="24" fill="var(--case-bg)" />
        <text x="480" y="44" textAnchor="middle" fill="var(--case-copy)" fontFamily="var(--case-font-heading)" fontSize="var(--case-type-caption)">NO STOCK SYNC</text>

        {/* Dashed arrows always mean a person transfers information. */}
        <g fill="none" stroke="var(--case-copy)" strokeWidth="var(--case-focus-width)" strokeDasharray="5 4" markerEnd="url(#def-fragmented-arrow)">
          <path d="M264 200 H368" />
          <path d="M592 200 H688" />
          <path d="M800 264 V368" />
          <path d="M752 264 V312 Q752 320 744 320 H488 Q480 320 480 328 V368" />
        </g>
        <g fill="var(--case-bg)">
          <rect x="268" y="160" width="96" height="28" />
          <rect x="596" y="160" width="88" height="28" />
          <rect x="812" y="284" width="112" height="44" />
          <rect x="548" y="280" width="120" height="28" />
        </g>
        <g fill="var(--case-copy)" fontFamily="var(--case-font-heading)" fontSize="var(--case-type-stat-label)" textAnchor="middle">
          <text x="316" y="178">MESSAGE SALES</text>
          <text x="640" y="178">RE-ENTER ORDER</text>
          <text x="868" y="302">RE-ENTER</text>
          <text x="868" y="318">INVOICE ITEMS</text>
          <text x="608" y="298">MESSAGE STATUS</text>
        </g>

        {/* Tool and task nodes. SVG coordinates are drawing geometry. */}
        <g fill="var(--case-bg)" stroke="var(--case-copy)" strokeWidth="var(--case-border-width)">
          <rect x="40" y="152" width="224" height="112" rx="8" />
          <rect x="368" y="152" width="224" height="112" rx="8" />
          <rect x="688" y="152" width="224" height="112" rx="8" />
          <rect x="368" y="368" width="224" height="104" rx="8" />
          <rect x="688" y="368" width="224" height="104" rx="8" />
        </g>
        <g fill="var(--case-ink)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-body)" fontWeight="var(--case-weight-strong)" textAnchor="middle">
          <text x="152" y="216">Product catalogue</text>
          <text x="480" y="216">Customer orders</text>
          <text x="800" y="200">Sales + inventory</text>
          <text x="480" y="412">Dispatch updates</text>
          <text x="800" y="412">Invoice preparation</text>
        </g>
        <g fill="var(--case-muted)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)" textAnchor="middle">
          <text x="152" y="240">Separately maintained products</text>
          <text x="480" y="240">Sales take orders in chat</text>
          <text x="800" y="224">Legacy desktop platform</text>
          <text x="800" y="248">Stock checked at order entry</text>
          <text x="480" y="440">Sales message customers</text>
          <text x="800" y="440">Finance inputs each product</text>
        </g>
        <text x="152" y="344" fill="var(--case-copy)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)" textAnchor="middle">
          <tspan x="152">Product details are</tspan>
          <tspan x="152" dy="24">maintained twice.</tspan>
        </text>

        <line x1="40" y1="524" x2="920" y2="524" stroke="var(--case-rule)" strokeWidth="var(--case-border-width)" />
        <g stroke="var(--case-copy)" strokeWidth="var(--case-focus-width)" fill="none">
          <path d="M40 560 H96" strokeDasharray="5 4" markerEnd="url(#def-fragmented-arrow)" />
          <path d="M424 560 H444 M480 560 H500 M452 552 L460 568 M464 552 L472 568" />
        </g>
        <g fill="var(--case-copy)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">
          <text x="112" y="564">Manual information transfer</text>
          <text x="516" y="564">Data not synchronised</text>
        </g>
      </svg>
    </div>
  );
}
