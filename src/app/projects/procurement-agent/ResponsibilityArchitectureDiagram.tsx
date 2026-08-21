import { fontFamily } from '@/lib/design-tokens';

const llmResponsibilities = [
  'Interpret intent',
  'Resolve missing context',
  'Choose tools',
  'Explain evidence',
  'Surface exceptions',
] as const;

const engineResponsibilities = [
  'Demand + coverage + lead time',
  'Current + incoming inventory',
  'MOQ + supplier constraints',
  'Business thresholds',
] as const;

const buyerResponsibilities = ['Review', 'Edit', 'Approve', 'Place order'] as const;

function ResponsibilityList({
  items,
  x,
  y,
  gap,
  bullet,
  text,
}: {
  items: readonly string[];
  x: number;
  y: number;
  gap: number;
  bullet: string;
  text: string;
}) {
  return items.map((item, index) => {
    const itemY = y + index * gap;

    return (
      <g key={item}>
        <circle cx={x} cy={itemY - 4} r="3" fill={bullet} />
        <text x={x + 14} y={itemY} fill={text} fontFamily={fontFamily.sans} fontSize="12" fontWeight="600">
          {item}
        </text>
      </g>
    );
  });
}

export default function ResponsibilityArchitectureDiagram() {
  return (
    <figure className="m-0">
      <div className="overflow-x-auto pb-2">
        <svg
          className="h-auto min-w-[820px] w-full"
          viewBox="0 64 1080 416"
          role="img"
          aria-labelledby="responsibility-architecture-title responsibility-architecture-description"
        >
          <title id="responsibility-architecture-title">Procurement Agent responsibility architecture</title>
          <desc id="responsibility-architecture-description">
            The LLM interprets the purchasing goal and coordinates tools, a deterministic engine calculates the recommendation from business evidence, and the buyer reviews, edits, approves and places the order.
          </desc>

          <defs>
            <marker id="responsibility-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#777777" />
            </marker>
          </defs>

          {/* Connections are drawn first so the architecture nodes remain visually dominant. */}
          <g fill="none" stroke="#777777" strokeWidth="1.2" markerEnd="url(#responsibility-arrow)">
            <path d="M300 240 H380" />
            <path d="M700 240 H780" />
          </g>

          <g>
            <rect x="304" y="204" width="72" height="20" fill="#f4f4f4" />
            <text x="340" y="218" textAnchor="middle" fill="#555555" fontFamily={fontFamily.sans} fontSize="8" fontWeight="700" letterSpacing="1.1">
              INTENT
            </text>

            <rect x="704" y="204" width="72" height="20" fill="#f4f4f4" />
            <text x="740" y="218" textAnchor="middle" fill="#555555" fontFamily={fontFamily.sans} fontSize="8" fontWeight="700" letterSpacing="1.1">
              PLAN
            </text>
          </g>

          <g>
            <rect x="40" y="112" width="260" height="256" rx="6" fill="#ffffff" stroke="#d8d8d8" />
            <text x="64" y="144" fill="#777777" fontFamily={fontFamily.sans} fontSize="9" fontWeight="700" letterSpacing="1.4">
              INTERPRET
            </text>
            <text x="64" y="184" fill="#161616" fontFamily={fontFamily.sans} fontSize="24" fontWeight="700">
              LLM
            </text>
            <text x="64" y="208" fill="#555555" fontFamily={fontFamily.sans} fontSize="12">
              Understand and coordinate
            </text>
            <line x1="64" y1="228" x2="276" y2="228" stroke="#d8d8d8" />
            <ResponsibilityList items={llmResponsibilities} x={68} y={260} gap={24} bullet="#777777" text="#161616" />
          </g>

          <g>
            <rect x="380" y="80" width="320" height="320" rx="6" fill="#e9eef8" stroke="#2155e8" strokeWidth="1.2" />
            <rect x="404" y="104" width="84" height="20" rx="2" fill="#2155e8" />
            <text x="446" y="118" textAnchor="middle" fill="#ffffff" fontFamily={fontFamily.sans} fontSize="8" fontWeight="700" letterSpacing="1.2">
              CALCULATE
            </text>
            <text x="404" y="164" fill="#161616" fontFamily={fontFamily.sans} fontSize="24" fontWeight="700">
              Deterministic engine
            </text>
            <text x="404" y="188" fill="#555555" fontFamily={fontFamily.sans} fontSize="12">
              Quantity is computed, not generated.
            </text>
            <line x1="404" y1="212" x2="676" y2="212" stroke="#b8c6ea" />
            <ResponsibilityList items={engineResponsibilities} x={408} y={248} gap={28} bullet="#2155e8" text="#161616" />
            <rect x="404" y="356" width="272" height="20" fill="#ffffff" />
            <text x="540" y="370" textAnchor="middle" fill="#2155e8" fontFamily={fontFamily.sans} fontSize="8" fontWeight="700" letterSpacing="1.1">
              SAME INPUTS · SAME RESULT
            </text>
          </g>

          <g>
            <rect x="780" y="128" width="260" height="224" rx="6" fill="#ffffff" stroke="#d8d8d8" />
            <text x="804" y="160" fill="#ed5b2b" fontFamily={fontFamily.sans} fontSize="9" fontWeight="700" letterSpacing="1.4">
              DECIDE
            </text>
            <text x="804" y="200" fill="#161616" fontFamily={fontFamily.sans} fontSize="24" fontWeight="700">
              Buyer
            </text>
            <text x="804" y="224" fill="#555555" fontFamily={fontFamily.sans} fontSize="12">
              Own the purchasing decision
            </text>
            <line x1="804" y1="244" x2="1016" y2="244" stroke="#d8d8d8" />
            <ResponsibilityList items={buyerResponsibilities} x={808} y={276} gap={24} bullet="#ed5b2b" text="#161616" />
          </g>

          <path d="M804 384 H1016" stroke="#ed5b2b" strokeWidth="2" />
          <text x="804" y="412" fill="#ed5b2b" fontFamily={fontFamily.sans} fontSize="10" fontWeight="700" letterSpacing="1.2">
            HUMAN AUTHORITY
          </text>
          <text x="804" y="436" fill="#161616" fontFamily={fontFamily.sans} fontSize="14" fontWeight="700">
            Formal supplier commitment
          </text>
          <text x="804" y="456" fill="#555555" fontFamily={fontFamily.sans} fontSize="12">
            remains with the buyer.
          </text>

        </svg>
      </div>
    </figure>
  );
}
