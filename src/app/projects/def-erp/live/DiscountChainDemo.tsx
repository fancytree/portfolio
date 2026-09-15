'use client';

// Copied from the DEF ERP repository (web/src/pages/portfolio/components/DiscountChainDemo.tsx). Imports rewired for this site.
import { useId, useMemo, useState } from 'react';
import { Gift, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  computePoLinePrice,
  discountChainFactor,
  isGiftDiscountChain,
  parseDiscountChain,
  parseEuNumber,
} from './lib/poPricing';

/**
 * 作品集组件展示：采购折扣链计算器。
 * 计算全部走线上的 lib/poPricing.ts，不另写演示用的算法。
 */

type Preset = {
  id: string;
  label: string;
  note: string;
  list: string;
  chain: string;
  doc: string;
  iva: number;
};

const PRESETS: Preset[] = [
  {
    id: 'invoice',
    label: 'Real supplier line',
    note: 'Self International, quote 000642',
    list: '20,00',
    chain: '50%+50%+7,69',
    doc: '3',
    iva: 22,
  },
  { id: 'promo', label: 'Stacked promo', note: 'Written as “sc. 40+10”', list: '12,50', chain: 'sc. 40+10', doc: '0', iva: 22 },
  { id: 'gift', label: 'Gift line', note: '100% off, sample kit', list: '8,90', chain: '100%', doc: '3', iva: 22 },
  { id: 'net', label: 'Net price', note: 'No discount tiers', list: '6,40', chain: '', doc: '0', iva: 10 },
];

const IVA_RATES = [22, 10, 4, 0] as const;

const fmtUnit = (v: number) => `${v < 0 ? '−' : ''}€${Math.abs(v).toFixed(4)}`;
const fmtPct = (rate: number) => `${Number((rate * 100).toFixed(2))}%`;
/** 系数最多 6 位：0.5 × 0.5 × 0.9231 的积是 0.230775，截到 4 位就对不上发票 */
const fmtFactor = (v: number) => String(Number(v.toFixed(6)));

export default function DiscountChainDemo() {
  const fieldId = useId();
  const [presetId, setPresetId] = useState<string | null>(PRESETS[0].id);
  const [list, setList] = useState(PRESETS[0].list);
  const [chainRaw, setChainRaw] = useState(PRESETS[0].chain);
  const [docRaw, setDocRaw] = useState(PRESETS[0].doc);
  const [iva, setIva] = useState<number>(PRESETS[0].iva);

  const applyPreset = (p: Preset) => {
    setPresetId(p.id);
    setList(p.list);
    setChainRaw(p.chain);
    setDocRaw(p.doc);
    setIva(p.iva);
  };
  // 手动改任何输入后，预设不再高亮
  const edit = <T,>(setter: (v: T) => void) => (v: T) => {
    setPresetId(null);
    setter(v);
  };

  const model = useMemo(() => {
    const listPrice = parseEuNumber(list);
    const chain = parseDiscountChain(chainRaw);
    const docPct = parseEuNumber(docRaw) ?? 0;
    const docRate = Math.min(Math.max(docPct, 0), 100) / 100;
    const price = computePoLinePrice({
      listPrice,
      discountChain: chainRaw,
      documentDiscountRate: docRate,
      ivaRate: iva,
    });

    const additivePct = chain.reduce((sum, d) => sum + d, 0);
    return {
      listPrice,
      chain,
      price,
      isGift: isGiftDiscountChain(chainRaw),
      factor: discountChainFactor(chain),
      additivePct,
      additiveValue: listPrice != null ? listPrice * (1 - additivePct) : null,
    };
  }, [list, chainRaw, docRaw, iva]);

  const inputCls =
    'h-10 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-sm tabular-nums text-[#1a1d26] outline-none transition-colors placeholder:text-[#a6adbb] focus:border-[#1366d6] focus:ring-2 focus:ring-[#1366d6]/15';
  const labelCls = 'text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b93a7]';

  const listInvalid = model.listPrice == null && list.trim() !== '';
  const multiTier = model.chain.length > 1;

  return (
    <div className="space-y-3">
      {/* 预设 */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Example lines">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p)}
            aria-pressed={presetId === p.id}
            className={cn(
              'rounded-full border px-3 py-1.5 text-left text-xs transition-colors',
              presetId === p.id
                ? 'border-[#1366d6] bg-[#e3effe] text-[#1366d6]'
                : 'border-[#dfe3ea] bg-white text-[#687186] hover:border-[#c9ced8] hover:text-[#1a1d26]',
            )}
          >
            <span className="font-medium">{p.label}</span>
            <span className="ml-1.5 hidden text-[11px] opacity-70 sm:inline">{p.note}</span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-4 md:p-5">
        {/* 输入 */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,0.8fr)]">
          <label className="grid gap-1.5" htmlFor={`${fieldId}-list`}>
            <span className={labelCls}>List price €</span>
            <input
              id={`${fieldId}-list`}
              inputMode="decimal"
              value={list}
              onChange={(e) => edit(setList)(e.target.value)}
              aria-invalid={listInvalid || undefined}
              className={cn(inputCls, listInvalid && 'border-[#e5484d]')}
              placeholder="20,00"
            />
          </label>
          <label className="order-last col-span-2 grid gap-1.5 md:order-none md:col-span-1" htmlFor={`${fieldId}-chain`}>
            <span className={labelCls}>Line discount, as printed</span>
            <input
              id={`${fieldId}-chain`}
              value={chainRaw}
              onChange={(e) => edit(setChainRaw)(e.target.value)}
              className={cn(inputCls, 'font-mono')}
              placeholder="50%+50%+7,69"
              spellCheck={false}
            />
          </label>
          <label className="grid gap-1.5 md:row-start-1 md:col-start-3" htmlFor={`${fieldId}-doc`}>
            <span className={labelCls}>Document %</span>
            <input
              id={`${fieldId}-doc`}
              inputMode="decimal"
              value={docRaw}
              onChange={(e) => edit(setDocRaw)(e.target.value)}
              className={inputCls}
              placeholder="3"
            />
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={labelCls}>IVA</span>
          <div className="inline-flex rounded-lg bg-[#f1f3f7] p-0.5" role="radiogroup" aria-label="IVA rate">
            {IVA_RATES.map((rate) => (
              <button
                key={rate}
                type="button"
                role="radio"
                aria-checked={iva === rate}
                onClick={() => edit(setIva)(rate)}
                className={cn(
                  'h-8 min-w-11 rounded-md px-2.5 text-xs font-medium tabular-nums transition-colors',
                  iva === rate ? 'bg-white text-[#1a1d26] shadow-[0_1px_2px_rgba(26,29,38,0.08)]' : 'text-[#687186] hover:text-[#1a1d26]',
                )}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>

        {/* 结果：下单前是按供应商政策估算的进货价，上传确认单后即为确认价，两者同一算法 */}
        <div className="mt-5 border-t border-[#eef0f4] pt-4" aria-live="polite">
          {listInvalid ? (
            <p className="text-sm text-[#e5484d]">Enter a list price, e.g. 20,00 or 1.250,00.</p>
          ) : model.price.gross == null ? (
            <p className="text-sm text-[#8b93a7]">Enter a list price to get the purchase cost.</p>
          ) : !model.isGift ? (
            <div className="flex flex-wrap items-end justify-between gap-3 rounded-xl bg-[#eaf8f0] px-4 py-3">
              <div>
                <p className="text-xs font-medium text-[#1e7a4a]">Real purchase cost per unit</p>
                <p className="mt-0.5 text-[11px] text-[#4f8a68]">Incl. IVA {iva}% · estimate before ordering, confirmed after upload</p>
              </div>
              <span className="text-2xl font-semibold tabular-nums text-[#156b40]">{fmtUnit(model.price.gross)}</span>
            </div>
          ) : null}

          {model.isGift && (
            <p className="flex items-start gap-2 rounded-lg bg-[#fff2eb] px-3 py-2 text-xs leading-5 text-[#b4541f]">
              <Gift className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              A 100% tier zeroes the line. It is a gift, so OCR skips it and it never enters the purchase order.
            </p>
          )}
        </div>
      </div>

      {/* 相加 vs 连乘 */}
      {model.listPrice != null && model.chain.length > 0 && !model.isGift && (
        <div className="grid gap-2 sm:grid-cols-2">
          <div
            className={cn(
              'rounded-2xl p-4',
              multiTier && model.additiveValue != null && model.additiveValue < 0 ? 'bg-[#fdecec]' : 'bg-white',
            )}
          >
            <p className={labelCls}>If the tiers were added</p>
            <p className="mt-2 font-mono text-xs text-[#687186]">
              {model.chain.map((d) => fmtPct(d)).join(' + ')} = {fmtPct(model.additivePct)} off
            </p>
            <p
              className={cn(
                'mt-1 text-xl font-semibold tabular-nums',
                model.additiveValue != null && model.additiveValue < 0 ? 'text-[#c93a3f]' : 'text-[#1a1d26]',
              )}
            >
              {model.additiveValue != null ? fmtUnit(model.additiveValue) : '—'}
            </p>
            {multiTier && model.additiveValue != null && model.price.afterLineDiscount != null && (
              model.additiveValue < 0 ? (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-[#c93a3f]">
                  <TriangleAlert className="size-3" aria-hidden /> Negative cost
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-[#8b93a7]">
                  {fmtUnit(model.price.afterLineDiscount - model.additiveValue)} too low per unit
                </p>
              )
            )}
          </div>
          <div className="rounded-2xl bg-white p-4">
            <p className={labelCls}>Chained, as suppliers mean it</p>
            <p className="mt-2 font-mono text-xs text-[#687186]">
              {model.chain.map((d) => fmtFactor(1 - d)).join(' × ')} = {fmtFactor(model.factor)}
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-[#1a1d26]">
              {model.price.afterLineDiscount != null ? fmtUnit(model.price.afterLineDiscount) : '—'}
            </p>
            {!multiTier && (
              <p className="mt-1 text-[11px] text-[#8b93a7]">With a single tier both agree. They split from the second tier on.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
