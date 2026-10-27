import { usePortfolioOrder } from './PortfolioOrderContext';
import { cn } from '@/lib/utils';
import { PORTFOLIO_COPY } from '../procurement-agent/portfolioDemoCopy';
import {
  MNP_SUPPLIER_RULES,
  goodsTotal,
} from '../procurement-agent/portfolioDemoScript';
import type { DemoLine } from '../procurement-agent/portfolioDemoTypes';

/**
 * Demo 底部小计条：SKU/pcs、最低起订、免运、早付提示 + Goods / Shipping / Total。
 * Agent Demo 与 Main 形态展示页共用。
 */
export default function PortfolioSubtotalBar({
  lines,
  confirmationUploaded = false,
}: {
  lines: DemoLine[];
  /** 上传确认单后展示 Est. vs Conf. 货值差 */
  confirmationUploaded?: boolean;
}) {
  const rules = usePortfolioOrder().supplierRules??MNP_SUPPLIER_RULES;
  // 未上传确认单时件数按 Est. qty；已确认后按 Conf. qty
  const pcs = confirmationUploaded
    ? lines.reduce((sum, line) => sum + line.qty, 0)
    : lines.reduce((sum, line) => sum + line.plannedQty, 0);
  const estGoods = lines.reduce((sum, line) => sum + line.plannedQty * line.estimatedPrice, 0);
  const confGoods = goodsTotal(lines);
  const goods = confirmationUploaded ? confGoods : estGoods;
  const freeShippingOk = goods >= rules.freeShippingThreshold;
  const minOrderOk = goods >= rules.minOrderValue;
  const shipping = freeShippingOk ? 0 : rules.defaultShippingFee;
  const grand = goods + shipping;
  const freeShipGap = Math.max(0, rules.freeShippingThreshold - goods);
  const minOrderGap = Math.max(0, rules.minOrderValue - goods);
  const delta = confGoods - estGoods;
  const showEstConf = confirmationUploaded && lines.some((line) => line.confirmedPrice != null);
  const deltaAbs = Math.abs(delta).toFixed(2);
  const deltaTone = delta > 0.009 ? 'higher' : delta < -0.009 ? 'lower' : 'flat';

  return (
    <div className="sticky -bottom-3 z-20 mt-auto shrink-0 space-y-1 rounded-b-2xl border-t border-[#e8eaef] bg-white px-6 py-2.5 text-[12px] md:-bottom-4">
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        <span className="rounded-md bg-[#f6f7f9] px-2 py-0.5 text-[#5c6478]">
          {PORTFOLIO_COPY.subtotalSkusPcs(lines.length, pcs)}
        </span>
        <span
          className={cn(
            'rounded-md px-2 py-0.5 font-medium',
            minOrderOk ? 'bg-[#e5f6ee] text-[#1f8a57]' : 'bg-[#fff6ee] text-[#b35b1f]',
          )}
        >
          {minOrderOk
            ? PORTFOLIO_COPY.subtotalMinOrderMet
            : PORTFOLIO_COPY.subtotalMinOrderNeed(minOrderGap.toFixed(2))}
        </span>
        <span
          className={cn(
            'rounded-md px-2 py-0.5 font-medium',
            freeShippingOk ? 'bg-[#e5f6ee] text-[#1f8a57]' : 'bg-[#fff6ee] text-[#b35b1f]',
          )}
        >
          {freeShippingOk
            ? PORTFOLIO_COPY.subtotalFreeShipMet
            : PORTFOLIO_COPY.subtotalFreeShipNeed(shipping.toFixed(2), freeShipGap.toFixed(2))}
        </span>
        <span className="rounded-md bg-[#f6f7f9] px-2 py-0.5 text-[#5c6478]">
          {PORTFOLIO_COPY.subtotalEarlyPayHint(
            (rules.earlyPaymentDiscountRate * 100).toFixed(0),
            rules.earlyPaymentDays,
          )}
        </span>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[#8b93a7]">
          {showEstConf ? (
            <>
              <span>
                {PORTFOLIO_COPY.subtotalEstGoods}{' '}
                <span className="ml-1 font-semibold tabular-nums text-[#1a1d26]">
                  €{estGoods.toFixed(2)}
                </span>
              </span>
              <span>
                {PORTFOLIO_COPY.subtotalConfGoods}{' '}
                <span className="ml-1 font-semibold tabular-nums text-[#1a1d26]">
                  €{confGoods.toFixed(2)}
                </span>
              </span>
              <span
                className={cn(
                  'rounded-md px-2 py-0.5 font-semibold tabular-nums',
                  deltaTone === 'higher' && 'bg-[#fdecec] text-[#8a3030]',
                  deltaTone === 'lower' && 'bg-[#e5f6ee] text-[#1f8a57]',
                  deltaTone === 'flat' && 'bg-[#f6f7f9] text-[#5c6478]',
                )}
              >
                {deltaTone === 'higher'
                  ? PORTFOLIO_COPY.subtotalDeltaHigher(deltaAbs)
                  : deltaTone === 'lower'
                    ? PORTFOLIO_COPY.subtotalDeltaLower(deltaAbs)
                    : PORTFOLIO_COPY.subtotalDeltaFlat}
              </span>
            </>
          ) : (
            <span>
              {PORTFOLIO_COPY.subtotalGoods}{' '}
              <span className="ml-1 font-semibold tabular-nums text-[#1a1d26]">
                €{goods.toFixed(2)}
              </span>
            </span>
          )}
          <span>
            {PORTFOLIO_COPY.subtotalShipping}{' '}
            <span className="ml-1 font-semibold tabular-nums text-[#1a1d26]">
              {shipping === 0 ? PORTFOLIO_COPY.subtotalShippingFree : `€${shipping.toFixed(2)}`}
            </span>
          </span>
        </div>
        <span className="text-[15px] font-semibold tabular-nums text-[#1a1d26]">
          {PORTFOLIO_COPY.subtotalGrand} €{grand.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
