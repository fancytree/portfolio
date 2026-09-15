'use client';

// Copied from the DEF ERP repository (web/src/pages/portfolio/components/PackagingPricingDemo.tsx). Imports rewired for this site.
import { useId, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { parseEuNumber } from './lib/poPricing';
import { factorToBase, parentUnitZh, type ProductUnitChain } from './lib/packaging';

/**
 * 作品集组件展示：包装单位与定价。
 * 换算走 lib/productUnitChain.ts。
 * 单位名在这里用英文作为 key：factorToBase 只把它们当作不透明字符串比较。
 */

type UnitKey = 'Piece' | 'Pack' | 'Carton' | 'Kit';

type UnitRow = {
  key: UnitKey;
  code: string;
  /** 1 本单位 = ratio × parent；基础单位没有 */
  parent?: UnitKey;
  ratio: string;
  standard: string;
  list: string;
};

const INITIAL_ROWS: UnitRow[] = [
  { key: 'Piece', code: 'PZ', ratio: '1', standard: '3,90', list: '6,90' },
  { key: 'Pack', code: 'CF', parent: 'Piece', ratio: '6', standard: '21,00', list: '39,00' },
  { key: 'Carton', code: 'CT', parent: 'Pack', ratio: '4', standard: '79,20', list: '139,00' },
  // 陈列套装直接挂在「件」下面，与「盒 → 箱」是两条分支
  { key: 'Kit', code: 'KIT', parent: 'Piece', ratio: '10', standard: '42,00', list: '69,00' },
];

const fmtMoney = (v: number) => `€${v.toFixed(2)}`;

function toRatio(raw: string): number {
  const n = Math.floor(Number(raw));
  return Number.isFinite(n) && n >= 1 ? Math.min(n, 999) : 1;
}

export default function PackagingPricingDemo() {
  const fieldId = useId();
  const [rows, setRows] = useState<UnitRow[]>(INITIAL_ROWS);
  const [defaultUnit, setDefaultUnit] = useState<UnitKey>('Pack');

  const patch = (key: UnitKey, field: 'ratio' | 'standard' | 'list', value: string) =>
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, [field]: value } : r)));

  const model = useMemo(() => {
    const chain: ProductUnitChain = {
      base_unit_zh: 'Piece',
      base_unit_it: 'PZ',
      tiers: rows
        .filter((r) => r.parent)
        .map((r) => ({ unit_zh: r.key, unit_it: r.code, ratio: toRatio(r.ratio), parent_unit_zh: r.parent })),
    };

    const units = rows.map((r) => {
      const perBase = factorToBase(chain, r.key);
      const standard = parseEuNumber(r.standard);
      // 缩进层级：沿父级走到基础单位的步数
      let depth = 0;
      let cursor: UnitKey | undefined = r.parent;
      while (cursor) {
        depth += 1;
        cursor = rows.find((x) => x.key === cursor)?.parent;
      }
      const tierIndex = chain.tiers.findIndex((t) => t.unit_zh === r.key);
      return {
        row: r,
        depth,
        perBase,
        parentName: tierIndex >= 0 ? parentUnitZh(chain, tierIndex) : null,
        perPiece: standard != null && perBase > 0 ? standard / perBase : null,
      };
    });

    const piecePrice = units[0]?.perPiece ?? null;
    return { units, piecePrice };
  }, [rows]);

  const labelCls = 'text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b93a7]';
  const cellInput =
    'h-8 w-full min-w-0 rounded-md border border-[#dfe3ea] bg-white px-2 text-right text-sm tabular-nums text-[#1a1d26] outline-none transition-colors placeholder:text-[#c3c8d2] focus:border-[#1366d6] focus:ring-2 focus:ring-[#1366d6]/15';

  return (
    <div className="space-y-3">
      {/* ── 1. 换算链 + 各包装定价 ── */}
      <div className="rounded-2xl bg-white p-4 md:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className={labelCls}>Gel polish 15 ml · packaging</p>
          <p className="text-[11px] text-[#8b93a7]">Edit any ratio or price</p>
        </div>

        <div className="-mx-4 mt-3 overflow-x-auto px-4 md:-mx-5 md:px-5">
          <table className="w-full min-w-[34rem] border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-left text-[11px] font-medium text-[#8b93a7]">
                <th className="pb-2 pr-3 font-medium">Unit</th>
                <th className="pb-2 pr-3 text-right font-medium">Pieces</th>
                <th className="pb-2 pr-3 text-right font-medium">Wholesale</th>
                <th className="pb-2 pr-3 text-right font-medium">Per piece</th>
                <th className="pb-2 pr-3 text-right font-medium">Retail</th>
                <th className="pb-2 text-center font-medium">Default</th>
              </tr>
            </thead>
            <tbody>
              {model.units.map((u) => {
                const saving =
                  model.piecePrice != null && u.perPiece != null && u.perBase > 1
                    ? 1 - u.perPiece / model.piecePrice
                    : null;
                return (
                  <tr key={u.row.key} className="align-middle">
                    <td className="border-t border-[#eef0f4] py-2 pr-3">
                      <div className="flex items-center gap-2" style={{ paddingLeft: `${u.depth * 1.1}rem` }}>
                        {u.depth > 0 && <span className="h-3 w-2.5 shrink-0 rounded-bl border-b border-l border-[#c9ced8]" aria-hidden />}
                        <div className="min-w-0">
                          <p className="whitespace-nowrap font-medium text-[#1a1d26]">
                            {u.row.key}
                            <span className="ml-1.5 font-mono text-[10px] text-[#8b93a7]">{u.row.code}</span>
                          </p>
                          {u.parentName ? (
                            <label className="mt-0.5 flex items-center gap-1 whitespace-nowrap text-[11px] text-[#687186]">
                              1 =
                              <input
                                aria-label={`${u.parentName} per ${u.row.key}`}
                                inputMode="numeric"
                                value={u.row.ratio}
                                onChange={(e) => patch(u.row.key, 'ratio', e.target.value.replace(/\D/g, ''))}
                                className="h-6 w-10 rounded border border-[#dfe3ea] bg-white px-1 text-center text-[11px] tabular-nums text-[#1a1d26] outline-none focus:border-[#1366d6]"
                              />
                              {u.parentName}
                            </label>
                          ) : (
                            <p className="mt-0.5 text-[11px] text-[#8b93a7]">Base unit · stock counts this</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="border-t border-[#eef0f4] py-2 pr-3 text-right tabular-nums text-[#687186]">{u.perBase}</td>
                    <td className="w-24 border-t border-[#eef0f4] py-2 pr-3">
                      <input
                        aria-label={`${u.row.key} wholesale price`}
                        inputMode="decimal"
                        value={u.row.standard}
                        onChange={(e) => patch(u.row.key, 'standard', e.target.value)}
                        className={cellInput}
                      />
                    </td>
                    <td className="border-t border-[#eef0f4] py-2 pr-3 text-right tabular-nums">
                      {u.perPiece != null ? (
                        <>
                          <span className="text-[#687186]">{fmtMoney(u.perPiece)}</span>
                          {saving != null && Math.abs(saving) >= 0.005 && (
                            <span className={cn('block text-[10px]', saving > 0 ? 'text-[#1e9a5a]' : 'text-[#c93a3f]')}>
                              {saving > 0 ? '−' : '+'}{Math.round(Math.abs(saving) * 100)}% vs piece
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[#c3c8d2]">—</span>
                      )}
                    </td>
                    <td className="w-24 border-t border-[#eef0f4] py-2 pr-3">
                      <input
                        aria-label={`${u.row.key} retail price`}
                        inputMode="decimal"
                        value={u.row.list}
                        onChange={(e) => patch(u.row.key, 'list', e.target.value)}
                        placeholder="—"
                        className={cellInput}
                      />
                    </td>
                    <td className="border-t border-[#eef0f4] py-2 text-center">
                      <input
                        type="radio"
                        name={`${fieldId}-default`}
                        checked={defaultUnit === u.row.key}
                        onChange={() => setDefaultUnit(u.row.key)}
                        aria-label={`Sell by ${u.row.key} by default`}
                        className="size-4 cursor-pointer accent-[#1366d6]"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
