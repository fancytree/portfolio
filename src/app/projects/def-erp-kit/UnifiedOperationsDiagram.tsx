/** Same canvas and node positions as the legacy map, with connected records. */
export default function UnifiedOperationsDiagram() {
  return (
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label="Connected ERP architecture; scroll horizontally on small screens">
      <svg viewBox="0 0 960 600" role="img" aria-labelledby="def-erp-unified-operations-title def-erp-unified-operations-desc">
        <title id="def-erp-unified-operations-title">One source of truth across ordering and operations</title>
        <desc id="def-erp-unified-operations-desc">The customer storefront uses ERP products and inventory, submits orders directly into shared ERP records, and displays dispatch status and tracking numbers; finance reuses order lines while staff retain payment review and invoice decisions.</desc>
        <defs>
          <marker id="def-unified-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill="var(--case-copy)" />
          </marker>
        </defs>
        <rect width="960" height="600" fill="var(--case-bg)" />

        <g fill="var(--case-surface)" stroke="var(--case-rule)" strokeWidth="var(--case-border-width)">
          <rect x="24" y="96" width="592" height="400" rx="8" />
          <rect x="664" y="96" width="272" height="400" rx="8" />
        </g>
        <g fontFamily="var(--case-font-heading)" fontSize="var(--case-type-caption)" fill="var(--case-muted)">
          <text x="40" y="124">CUSTOMER STOREFRONT</text>
          <text x="688" y="124">SHARED ERP</text>
        </g>

        {/* Same upper corridor as the broken stock link in the legacy map. */}
        <path d="M888 152 V72 Q888 64 880 64 H232 Q224 64 224 72 V152" fill="none" stroke="var(--case-copy)" strokeWidth="var(--case-focus-width)" markerEnd="url(#def-unified-arrow)" />
        <rect x="384" y="28" width="192" height="24" fill="var(--case-bg)" />
        <text x="480" y="44" textAnchor="middle" fill="var(--case-copy)" fontFamily="var(--case-font-heading)" fontSize="var(--case-type-caption)">SHARED DATA</text>

        <g fill="none" stroke="var(--case-copy)" strokeWidth="var(--case-focus-width)" markerEnd="url(#def-unified-arrow)">
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
          <text x="316" y="178">SELECT ITEMS</text>
          <text x="640" y="178">CREATE ORDER</text>
          <text x="868" y="310">REUSE LINES</text>
          <text x="608" y="298">PUBLISH STATUS</text>
        </g>

        <g fill="var(--case-bg)" stroke="var(--case-copy)" strokeWidth="var(--case-border-width)">
          <rect x="40" y="152" width="224" height="112" rx="8" />
          <rect x="368" y="152" width="224" height="112" rx="8" />
          <rect x="688" y="152" width="224" height="112" rx="8" />
          <rect x="368" y="368" width="224" height="104" rx="8" />
          <rect x="688" y="368" width="224" height="104" rx="8" />
        </g>
        <g fill="var(--case-ink)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-body)" fontWeight="var(--case-weight-strong)" textAnchor="middle">
          <text x="152" y="208">Product catalogue</text>
          <text x="480" y="208">Customer ordering</text>
          <text x="800" y="200">Shared ERP records</text>
          <text x="480" y="412">Dispatch visibility</text>
          <text x="800" y="412">Invoice preparation</text>
        </g>
        <g fill="var(--case-muted)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)" textAnchor="middle">
          <text x="152" y="240">ERP-backed products + stock</text>
          <text x="480" y="240">Address / delivery / shipping</text>
          <text x="800" y="224">Products / stock / orders</text>
          <text x="800" y="248">Sales / warehouse / finance</text>
          <text x="480" y="440">Dispatched + tracking number</text>
          <text x="800" y="440">Finance reviews invoice details</text>
        </g>
        <text x="152" y="344" fill="var(--case-copy)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)" textAnchor="middle">
          <tspan x="152">Maintain once, reuse</tspan>
          <tspan x="152" dy="24">through the business.</tspan>
        </text>

        <line x1="40" y1="524" x2="920" y2="524" stroke="var(--case-rule)" strokeWidth="var(--case-border-width)" />
        <path d="M40 560 H96" stroke="var(--case-copy)" strokeWidth="var(--case-focus-width)" markerEnd="url(#def-unified-arrow)" />
        <g fill="var(--case-copy)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">
          <text x="112" y="564">Shared data flow</text>
          <text x="424" y="564">Staff retain payment review and invoice decisions</text>
        </g>
      </svg>
    </div>
  );
}
