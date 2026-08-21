import { fontFamily } from '@/lib/design-tokens';

const inputs = [
  { index: '01', title: 'Experience', detail: 'Context and exceptions', x: 40, y: 40 },
  { index: '02', title: 'Sales', detail: 'Demand velocity and trend', x: 40, y: 176 },
  { index: '03', title: 'Inventory', detail: 'On-hand and incoming stock', x: 40, y: 312 },
  { index: '04', title: 'Supplier rules', detail: 'MOQ, pricing and terms', x: 800, y: 40 },
  { index: '05', title: 'Lead time', detail: 'Days until replenishment', x: 800, y: 176 },
  { index: '06', title: 'Seasonality', detail: 'Season and promotion effects', x: 800, y: 312 },
] as const;

const connectors = [
  'M280 80 H336 Q344 80 344 88 V188 Q344 196 352 196 H400',
  'M280 216 H360 Q368 216 368 224 V236 Q368 244 376 244 H400',
  'M280 352 H336 Q344 352 344 344 V300 Q344 292 352 292 H400',
  'M800 80 H744 Q736 80 736 88 V188 Q736 196 728 196 H680',
  'M800 216 H720 Q712 216 712 224 V236 Q712 244 704 244 H680',
  'M800 352 H744 Q736 352 736 344 V300 Q736 292 728 292 H680',
] as const;

export default function ProcurementDecisionDiagram() {
  return (
    <figure className="m-0">
      <div className="overflow-x-auto pb-2">
        <svg
          className="h-auto min-w-[820px] w-full"
          viewBox="0 0 1080 432"
          role="img"
          aria-labelledby="procurement-decision-title procurement-decision-description"
        >
          <title id="procurement-decision-title">Six inputs converge into one procurement decision</title>
          <desc id="procurement-decision-description">
            Experience, sales, inventory, supplier rules, lead time and seasonality must be considered together to decide what to buy, how much to order and when.
          </desc>

          <defs>
            <marker id="procurement-input-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#777777" />
            </marker>
          </defs>

          <rect width="1080" height="432" fill="#ffffff" />

          <text x="540" y="20" textAnchor="middle" fill="#777777" fontFamily={fontFamily.sans} fontSize="8" fontWeight="700" letterSpacing="1.6">
            SIX SIGNALS · ONE JUDGMENT
          </text>

          <g fill="none" stroke="#777777" strokeWidth="1.2" markerEnd="url(#procurement-input-arrow)">
            {connectors.map((path) => <path key={path} d={path} />)}
          </g>

          {inputs.map((input) => (
            <g key={input.title}>
              <rect x={input.x} y={input.y} width="240" height="80" rx="6" fill="#f4f4f4" stroke="#d8d8d8" />
              <text x={input.x + 20} y={input.y + 24} fill="#2155e8" fontFamily={fontFamily.sans} fontSize="8" fontWeight="700" letterSpacing="1.2">
                {input.index}
              </text>
              <text x={input.x + 20} y={input.y + 48} fill="#161616" fontFamily={fontFamily.sans} fontSize="16" fontWeight="700">
                {input.title}
              </text>
              <text x={input.x + 20} y={input.y + 66} fill="#555555" fontFamily={fontFamily.sans} fontSize="12" fontWeight="400">
                {input.detail}
              </text>
            </g>
          ))}

          <g>
            <rect x="400" y="164" width="280" height="160" rx="6" fill="#e9eef8" stroke="#2155e8" strokeWidth="1.2" />
            <rect x="420" y="184" width="112" height="20" rx="2" fill="#ed5b2b" />
            <text x="476" y="198" textAnchor="middle" fill="#ffffff" fontFamily={fontFamily.sans} fontSize="8" fontWeight="700" letterSpacing="1.2">
              SYNTHESIZE
            </text>
            <text x="420" y="236" fill="#161616" fontFamily={fontFamily.sans} fontSize="24" fontWeight="700">
              Purchase decision
            </text>
            <line x1="420" y1="252" x2="660" y2="252" stroke="#b8c6ea" />
            <text x="420" y="276" fill="#2155e8" fontFamily={fontFamily.sans} fontSize="12" fontWeight="700">
              WHAT TO BUY
            </text>
            <text x="520" y="276" fill="#2155e8" fontFamily={fontFamily.sans} fontSize="12" fontWeight="700">
              HOW MUCH
            </text>
            <text x="612" y="276" fill="#2155e8" fontFamily={fontFamily.sans} fontSize="12" fontWeight="700">
              WHEN
            </text>
            <text x="420" y="304" fill="#555555" fontFamily={fontFamily.sans} fontSize="12" fontWeight="400">
              A defensible plan requires all six inputs.
            </text>
          </g>

          <line x1="40" y1="412" x2="1040" y2="412" stroke="#d8d8d8" />
          <text x="40" y="428" fill="#777777" fontFamily={fontFamily.sans} fontSize="8" fontWeight="700" letterSpacing="1.2">
            NO SINGLE SIGNAL IS SUFFICIENT
          </text>
        </svg>
      </div>
    </figure>
  );
}
