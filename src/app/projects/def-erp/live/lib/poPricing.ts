// Copied from the DEF ERP repository (web/src/lib/poPricing.ts). Keep in sync; do not edit the logic here.
/**
 * 采购价格计算：挂牌价 → 行级连乘折扣 → 单据级折扣 → 净价 → 含税进货价
 *
 * 依据真实单据（Self International System srl / Prev000642）：
 *
 *   LISTINO 20,00
 *     × 行折扣 "50%+50%+7,69"  连乘 → 0.5 × 0.5 × 0.9231 = 0.230775  → 4,6155
 *     × 单据折扣 3%（Sconto merce）                                   → 4,4770
 *     × (1 + IVA 22%)                                                → 5,4620  ← 含税进货价
 *
 * **落库的 confirmed_price / unit_cost 就是最后这个含税价**，全站「进货价」一律含税，
 * 一路传到 goods_receipt_items.unit_cost / inventory_batches.cost_price。
 *
 * 发票的 TOTALE 列是不含税的：对账时用 resolveAfterLineDiscount 退回那一层，
 * 它优先拿 list_price + discount_chain 正算（无损），没有挂牌价的手工行才反推。
 *
 * ⚠️ 行折扣是**连乘**不是相加：50+50+7.69 相加得 107.69% 会算出负价。
 * 运费不摊进单价（见 purchase_orders.shipping_fee），赠品行（100% 折扣）不进采购单。
 */

/** 解析意大利式数字："4.615,50" → 4615.5；"7,69" → 7.69 */
export function parseEuNumber(raw: string | number | null | undefined): number | null {
  if (raw == null) return null;
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;

  let s = raw.trim().replace(/[€$%\s]/g, '');
  if (!s) return null;

  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  if (lastComma >= 0 && lastDot >= 0) {
    // 两种符号都在：靠后的是小数点，靠前的是千分位
    if (lastComma > lastDot) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
  } else if (lastComma >= 0) {
    // 只有逗号：3 位小数段视为千分位（1,234），否则视为小数点（7,69）
    const tail = s.length - lastComma - 1;
    s = tail === 3 && /^\d{1,3}(,\d{3})+$/.test(s) ? s.replace(/,/g, '') : s.replace(',', '.');
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/**
 * 解析折扣串为各级折扣率（0.5 = 50%）。
 * "50%+50%+7,69" → [0.5, 0.5, 0.0769]
 * "sc. 40+10"    → [0.4, 0.1]
 * "100%"         → [1]（赠品）
 */
export function parseDiscountChain(raw: string | null | undefined): number[] {
  if (!raw) return [];
  return raw
    .replace(/sc\.?/gi, '')
    .split(/[+/\s]+/)
    .map((part) => parseEuNumber(part))
    .filter((n): n is number => n != null && n >= 0 && n <= 100)
    .map((pct) => pct / 100);
}

/** 连乘净价系数：Π(1 − di)。无折扣返回 1，全额折扣返回 0 */
export function discountChainFactor(chain: number[]): number {
  return chain.reduce((factor, d) => factor * (1 - d), 1);
}

/** 折扣串是否代表赠品（净价系数为 0，即含 100% 那一级） */
export function isGiftDiscountChain(raw: string | null | undefined): boolean {
  const chain = parseDiscountChain(raw);
  return chain.length > 0 && discountChainFactor(chain) <= 0;
}

/**
 * 该行是否为赠品。供应商有两种写法，都要认：
 *   · Self International System：挂牌价照常，折扣列写 100%   → 折扣系数为 0
 *   · MP HAIR：prezzo 直接印 0,00，折扣列留空              → 挂牌价为 0
 * 只判折扣串会漏掉后者，那些行会被当成「无价格待人工核对」误报。
 */
export function isGiftLine(row: {
  listPrice?: number | null;
  discountChain?: string | null;
}): boolean {
  if (isGiftDiscountChain(row.discountChain)) return true;
  const list = row.listPrice;
  return list != null && Number.isFinite(list) && list <= 0;
}

export type PoLinePriceInput = {
  /** 挂牌价（LISTINO） */
  listPrice: number | null | undefined;
  /** 行级折扣原文，如 "50%+50%+7,69" */
  discountChain?: string | null;
  /** 单据级折扣率，0.03 = 3% */
  documentDiscountRate?: number | null;
  /** 行 IVA 税率，22 = 22% */
  ivaRate?: number | null;
};

export type PoLinePrice = {
  /** 折扣后、单据折扣前的单价 */
  afterLineDiscount: number | null;
  /** 净单价（不含税），仅用于对账展示 */
  net: number | null;
  /** 含税进货价——落库到 confirmed_price / unit_cost */
  gross: number | null;
  /** 行折扣净价系数 */
  lineFactor: number;
};

export function computePoLinePrice(input: PoLinePriceInput): PoLinePrice {
  const chain = parseDiscountChain(input.discountChain);
  const lineFactor = discountChainFactor(chain);

  const list = input.listPrice;
  if (list == null || !Number.isFinite(list)) {
    return { afterLineDiscount: null, net: null, gross: null, lineFactor };
  }

  const afterLineDiscount = list * lineFactor;
  const docRate = input.documentDiscountRate ?? 0;
  const net = afterLineDiscount * (1 - docRate);
  const iva = input.ivaRate ?? 0;
  const gross = net * (1 + iva / 100);

  return { afterLineDiscount, net, gross, lineFactor };
}

/** 净价 → 含税价 */
export function grossFromNet(
  net: number | null | undefined,
  ivaRate: number | null | undefined,
): number | null {
  if (net == null || !Number.isFinite(net)) return null;
  return net * (1 + (ivaRate ?? 0) / 100);
}

/** 含税价 → 净价 */
export function netFromGross(
  gross: number | null | undefined,
  ivaRate: number | null | undefined,
): number | null {
  if (gross == null || !Number.isFinite(gross)) return null;
  return gross / (1 + (ivaRate ?? 0) / 100);
}

/**
 * 从落库的**含税进货价**反推「行折后、单据折扣前」的不含税单价。
 *
 * 发票的 TOTALE 列是不含税、且在单据级折扣之前的，
 * 要和发票逐项对账就得先退回到这一层。
 */
export function afterLineDiscountFromGross(
  gross: number | null | undefined,
  ivaRate: number | null | undefined,
  documentDiscountRate: number | null | undefined,
): number | null {
  const net = netFromGross(gross, ivaRate);
  if (net == null) return null;
  const rate = documentDiscountRate ?? 0;
  if (rate >= 1) return null;
  return net / (1 - rate);
}

/** 单价四位小数，与 numeric(12,4) 对齐 */
export function roundPrice(value: number | null | undefined): number | null {
  if (value == null || !Number.isFinite(value)) return null;
  return Math.round(value * 10000) / 10000;
}

/** 金额两位小数 */
export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

// ── 单据合计 ────────────────────────────────────────────

export type PoTotalLine = {
  /** 行折后单价（单据级折扣前），对应单据 LISTINO×SCONTI 的结果 */
  afterLineDiscount: number | null;
  qty: number;
  ivaRate?: number | null;
};

/**
 * 求某行「折后、单据折扣前、不含税」的单价——复现单据合计的输入。
 *
 * 优先用挂牌价 + 折扣串**正算**：落库的含税价只有 4 位小数，
 * 从它反推会把截断误差放大，实测整单会差 €0.02。
 * 只有手工录入、没有挂牌价的行才退回反推。
 */
export function resolveAfterLineDiscount(row: {
  listPrice?: number | null;
  discountChain?: string | null;
  grossPrice?: number | null;
  ivaRate?: number | null;
  documentDiscountRate?: number | null;
}): number | null {
  if (row.listPrice != null && Number.isFinite(row.listPrice) && row.listPrice > 0) {
    return row.listPrice * discountChainFactor(parseDiscountChain(row.discountChain));
  }
  return afterLineDiscountFromGross(row.grossPrice, row.ivaRate, row.documentDiscountRate);
}

export type PoDocumentTotals = {
  /** 货值（单据折扣前）= Σ round2(单价 × 数量) */
  goodsTotal: number;
  /** 单据折扣金额 */
  documentDiscount: number;
  /** 净货值 = round2(货值 × (1 − 折扣率)) */
  netGoods: number;
  /** 含税货值 = 净货值 + 货值税额（不含运费） */
  grossGoods: number;
  shippingFee: number;
  /** 应税合计 = 净货值 + 运费 */
  taxableTotal: number;
  /** 税额 */
  taxTotal: number;
  /** 单据合计（含税） */
  grandTotal: number;
};

/**
 * 复现供应商的运算顺序，让采购单合计能和发票逐项对上。
 *
 * ⚠️ 顺序不能改：供应商是「**每行小计先四舍五入到 2 位**再求和，
 * 然后把单据级折扣作用在货值合计上」。若改成逐行折后再相加，
 * 实测这张单会差 €0.03（1932.05 vs 1932.08）——每次对账都对不平。
 */
export function computePoDocumentTotals(
  lines: PoTotalLine[],
  opts: { documentDiscountRate?: number | null; shippingFee?: number | null } = {},
): PoDocumentTotals {
  let goodsTotal = 0;
  let taxWeighted = 0;

  for (const line of lines) {
    if (line.afterLineDiscount == null) continue;
    const lineTotal = roundMoney(line.afterLineDiscount * line.qty);
    goodsTotal += lineTotal;
    taxWeighted += lineTotal * ((line.ivaRate ?? 0) / 100);
  }
  goodsTotal = roundMoney(goodsTotal);

  const rate = opts.documentDiscountRate ?? 0;
  const netGoods = roundMoney(goodsTotal * (1 - rate));
  const documentDiscount = roundMoney(goodsTotal - netGoods);
  const shippingFee = roundMoney(opts.shippingFee ?? 0);
  const taxableTotal = roundMoney(netGoods + shippingFee);

  // 税额按行税率加权（同一张单可能 22% 与免税混排），折扣与运费按同比例带入
  const effectiveTaxRate = goodsTotal > 0 ? taxWeighted / goodsTotal : 0;
  const taxTotal = roundMoney(taxableTotal * effectiveTaxRate);

  return {
    goodsTotal,
    documentDiscount,
    netGoods,
    // 含税货值按净货值整体计税，而不是逐行含税价相加——
    // IVA 是对单据应税基数征的，逐行乘出来会差几分钱
    grossGoods: roundMoney(netGoods * (1 + effectiveTaxRate)),
    shippingFee,
    taxableTotal,
    taxTotal,
    grandTotal: roundMoney(taxableTotal + taxTotal),
  };
}

// ── 运费规则 ────────────────────────────────────────────

export type SupplierShippingRule = {
  free_shipping_threshold?: number | null;
  default_shipping_fee?: number | null;
  shipping_note?: string | null;
};

export type ShippingStatus = {
  /** 有无免运费门槛 */
  hasThreshold: boolean;
  /** 是否已达免运费 */
  qualifies: boolean;
  /** 距免运费还差多少（已达则为 0） */
  gap: number;
  threshold: number | null;
  /** 建议运费：达门槛为 0，否则取供应商默认运费 */
  suggestedFee: number | null;
};

/** 按当前货值（不含税）算免运费达成情况 */
export function evaluateShipping(
  rule: SupplierShippingRule | null | undefined,
  goodsTotalNet: number,
): ShippingStatus {
  const threshold =
    rule?.free_shipping_threshold != null && Number(rule.free_shipping_threshold) > 0
      ? Number(rule.free_shipping_threshold)
      : null;
  const defaultFee =
    rule?.default_shipping_fee != null ? Number(rule.default_shipping_fee) : null;

  if (threshold == null) {
    return {
      hasThreshold: false,
      qualifies: false,
      gap: 0,
      threshold: null,
      suggestedFee: defaultFee,
    };
  }

  const qualifies = goodsTotalNet >= threshold;
  return {
    hasThreshold: true,
    qualifies,
    gap: qualifies ? 0 : roundMoney(threshold - goodsTotalNet),
    threshold,
    suggestedFee: qualifies ? 0 : defaultFee,
  };
}
