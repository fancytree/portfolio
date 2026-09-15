'use client';

import type { ReactNode } from 'react';
import { fontFamily } from '@/lib/design-tokens';
import { DashboardLiveWidgets } from './DashboardWidgets';
import DiscountChainDemo from './DiscountChainDemo';
import PackagingPricingDemo from './PackagingPricingDemo';
import './def-erp-live.css';

const accent = '#1366d6';
const bodyStyle = { fontFamily: fontFamily.sans } as const;

type Decision = { title: string; body: string };

/** 案例页里嵌入的真实组件：顶部说明条 + ERP 底色的操作区（+ 可选的设计决策栏） */
function LivePanel({
  hint,
  source,
  decisions,
  children,
}: {
  hint: string;
  source: string;
  decisions?: Decision[];
  children: ReactNode;
}) {
  return (
    <figure className="case-radius-lg m-0 overflow-hidden border border-[#e2e2e2]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-[#e2e2e2] bg-[#eef5ff] px-[clamp(18px,2.6vw,24px)] py-3">
        <span
          className="case-radius-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em] text-white"
          style={{ ...bodyStyle, background: accent }}
        >
          Live
        </span>
        <span className="text-[13px] font-normal text-[#3b3b3b]" style={bodyStyle}>{hint}</span>
        <code className="ml-auto hidden text-[11px] text-[#686868] md:inline">{source}</code>
      </div>
      <div
        className={
          decisions
            ? 'def-erp-live grid grid-cols-1 gap-[clamp(20px,3vw,32px)] bg-[#f5f6fa] p-[clamp(14px,2.4vw,24px)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]'
            : 'def-erp-live bg-[#f5f6fa] p-[clamp(14px,2.4vw,24px)]'
        }
      >
        <div className="min-w-0">{children}</div>
        {decisions ? (
          <ol className="m-0 flex list-none flex-col gap-5 p-0 lg:pt-2">
            {decisions.map((d, index) => (
              <li key={d.title} className="grid grid-cols-[28px_minmax(0,1fr)] gap-2">
                <span className="text-[11px] font-bold" style={{ ...bodyStyle, color: accent }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="m-0 text-[15px] font-bold text-[#161616]" style={bodyStyle}>{d.title}</p>
                  <p className="m-0 mt-1 text-[14px] font-normal leading-[1.55] text-[#555]" style={bodyStyle}>{d.body}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </figure>
  );
}

export function LiveDashboardWidgets() {
  return (
    <LivePanel
      hint="Switch the time range, hover the curve or a slice. Same components and demo data as the Admin dashboard."
      source="SalesTrendChart.tsx · DonutMixChart.tsx"
    >
      <DashboardLiveWidgets />
    </LivePanel>
  );
}

export function LivePurchaseCostCalculator() {
  return (
    <LivePanel
      hint="Try a supplier’s discount terms before ordering, or a line exactly as printed on its confirmation."
      source="lib/poPricing.ts"
      decisions={[
        {
          title: 'End on the number pricing needs',
          body: 'The chain resolves to one figure, the tax-inclusive cost per unit. That is what gets saved as the product’s purchase cost and what the selling price is marked up from.',
        },
        {
          title: 'Same math before and after the order',
        body: 'Before ordering, a buyer enters a supplier’s discount terms to estimate what one item will really cost. After the confirmation is uploaded, the confirmed price is computed the same way, so the estimate and the final price never disagree on method.',
        },
        {
          title: 'Accept the text exactly as printed',
          body: '“7,69” is 7.69 and “1.250,00” is 1250. The parser reads whichever separator comes last as the decimal and ignores prefixes like “sc.”, so nothing has to be retyped.',
        },
      ]}
    >
      <DiscountChainDemo />
    </LivePanel>
  );
}

export function LivePackagingPricing() {
  return (
    <LivePanel
      hint="Change a ratio or a price and watch the piece counts and per-piece deal update."
      source="lib/productUnitChain.ts"
      decisions={[
        {
          title: 'Stock only knows the base unit',
          body: 'Every packaging resolves to a piece count. A carton is 24 pieces, so inventory, low-stock alerts and receiving never reason about packs.',
        },
        {
          title: 'Each tier links to its own parent',
          body: 'A carton is 4 packs, a kit is 10 pieces. Conversions multiply along the link instead of being guessed from the nearest size, which once turned “1 carton = 70 bags” and “1 set = 10 bags” into “1 carton = 7 sets”.',
        },
        {
          title: 'Price each pack, never multiply',
          body: 'A carton is a volume deal, not 24 × the piece price, so every unit carries its own wholesale and retail price. The per-piece column shows what each deal actually gives away.',
        },
      ]}
    >
      <PackagingPricingDemo />
    </LivePanel>
  );
}
