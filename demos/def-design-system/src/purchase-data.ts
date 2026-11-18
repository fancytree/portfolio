/**
 * 采购单演示数据与比对逻辑。照搬原 ERP 作品集页（po-detail / po-inbound）的数据：
 * 同一张 MNP 采购单 PO-2026-0842，从草稿 → 上传供应商确认单 → 下单 → 上传 DDT 收货。
 * Demo 刻意让每种差异只出现一次：一处减量、一处涨价、一整支缺货、一行赠品、一行供应商加行。
 */

export type PoLine = {
  sku: string;
  /** 归组用 SPU id */
  productId: string;
  productCode: string;
  productName: string;
  variant: string;
  nameIt: string;
  stock: number;
  sales30: number;
  /** 确认数量（Conf. qty）；0 = 未填 */
  qty: number;
  /** 计划数量（Est. qty） */
  plannedQty: number;
  estimatedPrice: number;
  confirmedPrice: number | null;
  alert?: string;
  risk?: 'price' | 'qty' | 'missing' | 'extra' | null;
};

export const PO_NO = 'PO-2026-0842';
export const SUPPLIER = {
  name: 'MNP (MESAUDA NAIL PRO)',
  short: 'MNP · Mesauda Nail Pro',
  contact: 'Orders desk · ordini@mynailpro.com',
  website: 'mynailpro.com',
  minOrderValue: 1500,
  freeShippingThreshold: 2000,
  defaultShippingFee: 45,
  earlyPaymentRate: 2,
  earlyPaymentDays: 10,
};
export const PO_META = { createdAt: '05/08/2026', orderDate: '08/08/2026', expectedDelivery: '21/08/2026', notes: 'Bonifico anticipato · sc. 3%', discountPct: 3 };
export const CONFIRMATION_FILE = '26VOM002922.pdf';
export const DDT_FILE = 'DDT-MNP-0113.pdf';
export const INVOICE_FILE = 'MNP_invoice_FT-8841.pdf';
export const OPERATOR = 'Elena Rossi · warehouse';

export const NEW_PRODUCT_NOTE = 'New product · no SKU yet';
export const SKU_CREATED_NOTE = 'New SKU created · matched';

const line = (productId: string, productCode: string, productName: string, sku: string, variant: string, nameIt: string, stock: number, sales30: number, qty: number, estimatedPrice: number, alert?: string): PoLine => ({
  productId, productCode, productName, sku, variant, nameIt, stock, sales30, qty: 0, plannedQty: qty, estimatedPrice, confirmedPrice: null, alert,
});

export const BASE_LINES: PoLine[] = [
  line('p-bn-370', 'BN-370', 'Reinforced bonder', '370102', '14 ml', 'Bonder rinforzante 14 ml', 22, 68, 96, 5.4),
  line('p-bn-370', 'BN-370', 'Reinforced bonder', '370108', '8 ml', 'Bonder rinforzante 8 ml', 31, 40, 48, 4.9),
  line('p-bn-431', 'BN-431', 'Classic bonder', '431001', '8 ml', 'Bonder classico 8 ml', 18, 54, 72, 4.2),
  line('p-bn-431', 'BN-431', 'Classic bonder', '431015', '15 ml', 'Bonder classico 15 ml', 9, 22, 36, 5.6),
  line('p-ft-400', 'FT-400', 'Functional treatment', '400213', '50 ml', 'Trattamento funzionale 50 ml', 5, 11, 18, 6.8, 'Slow mover vs lead time'),
  line('p-ft-400', 'FT-400', 'Functional treatment', '400214', '100 ml', 'Trattamento funzionale 100 ml', 8, 19, 24, 9.2),
  line('p-ct-420', 'CT-420', 'Care treatment', '420050', '50 ml', 'Trattamento cura 50 ml', 20, 28, 36, 5.9),
  line('p-ct-420', 'CT-420', 'Care treatment', '420106', '100 ml', 'Trattamento cura 100 ml', 14, 30, 36, 7.1),
  line('p-tc-510', 'TC-510', 'Top coat', '510001', 'Gloss', 'Top coat lucido', 40, 55, 60, 4.5),
  line('p-tc-510', 'TC-510', 'Top coat', '510002', 'Matte', 'Top coat opaco', 16, 21, 24, 4.5),
  line('p-cg-880', 'CG-880', 'Color gel', '880101', 'Red Passion', 'Gel colore Red Passion', 12, 34, 48, 6.2),
  line('p-cg-880', 'CG-880', 'Color gel', '880102', 'Nude Rose', 'Gel colore Nude Rose', 15, 29, 36, 6.2),
  line('p-cg-880', 'CG-880', 'Color gel', '880103', 'Black Onyx', 'Gel colore Black Onyx', 10, 18, 24, 6.2),
];

/** 商品库里同一供应商、但不在本单上的规格 */
export const LIBRARY: PoLine[] = [
  line('p-bg-510', 'BG-510', 'Builder gel', '510015', 'Clear 15 ml', 'Gel costruttore Clear 15 ml', 6, 44, 48, 6.9),
  line('p-bg-510', 'BG-510', 'Builder gel', '510016', 'Pink 15 ml', 'Gel costruttore Pink 15 ml', 4, 31, 36, 6.9),
  line('p-np-220', 'NP-220', 'Nail primer', '220010', '10 ml', 'Primer unghie 10 ml', 11, 38, 48, 3.8),
  line('p-cr-130', 'CR-130', 'Cuticle remover', '130030', '30 ml', 'Rimuovi cuticole 30 ml', 20, 16, 24, 4.4),
  line('p-mt-610', 'MT-610', 'Matte top coat', '610010', '10 ml', 'Top coat opaco 10 ml', 15, 27, 36, 4.5),
];

export const SALES_WINDOWS = [
  { value: '1m', label: 'last 1 mo', short: '1 mo', months: 1 },
  { value: '3m', label: 'last 3 mo', short: '3 mo', months: 3 },
  { value: '6m', label: 'last 6 mo', short: '6 mo', months: 6 },
  { value: '12m', label: 'last 1 yr', short: '1 yr', months: 12 },
] as const;
export type SalesWindow = (typeof SALES_WINDOWS)[number]['value'];
export const salesFor = (sales30: number, w: SalesWindow) => Math.max(0, Math.round((sales30 / 3) * (SALES_WINDOWS.find((o) => o.value === w)?.months ?? 3)));

export const unitPrice = (l: PoLine) => l.confirmedPrice ?? l.estimatedPrice;
/** 未填 Conf. qty 时按 Est. qty 计 */
export const subtotalOf = (l: PoLine) => (l.qty > 0 ? l.qty : l.plannedQty) * unitPrice(l);
export const qtyDiffers = (l: PoLine) => l.qty > 0 && l.plannedQty !== l.qty;
export const priceDiffers = (l: PoLine) => l.confirmedPrice != null && Math.abs(l.confirmedPrice - l.estimatedPrice) > 0.001;
export const isGift = (l: PoLine) => l.risk === 'extra' && l.confirmedPrice === 0;
export const hasGap = (l: PoLine) => l.risk === 'missing' || l.risk === 'extra' || l.qty !== l.plannedQty || priceDiffers(l);

export type Group<T> = { key: string; code: string; label: string; items: T[] };
export function groupBySpu<T extends { productId: string; productCode: string; productName: string; sku: string }>(lines: T[]): Group<T>[] {
  const sorted = [...lines].sort((a, b) => a.productCode.localeCompare(b.productCode, undefined, { numeric: true }) || a.sku.localeCompare(b.sku, undefined, { numeric: true }));
  const out: Group<T>[] = [];
  const by = new Map<string, Group<T>>();
  for (const l of sorted) {
    let g = by.get(l.productId);
    if (!g) { g = { key: l.productId, code: l.productCode, label: l.productName, items: [] }; by.set(l.productId, g); out.push(g); }
    g.items.push(l);
  }
  return out;
}

/* ───────── 供应商确认单 ───────── */
const MISSING_SKUS = new Set(['400213', '400214']);
const QTY_CUTS: Record<string, number> = { '370102': 90 };
const PRICE_CHANGES: Record<string, number> = { '420106': 7.9 };
const SUPPLIER_ADDED: PoLine = { productId: 'p-cg-880', productCode: 'CG-880', productName: 'Color gel', sku: '880104', variant: 'Ivory Nude', nameIt: 'Gel colore Ivory Nude', stock: 0, sales30: 0, qty: 24, plannedQty: 0, estimatedPrice: 0, confirmedPrice: 7, risk: 'extra' };
const GIFT: PoLine = { productId: 'p-new-024', productCode: 'NEW-024', productName: 'Promo care kit', sku: 'NEW-024', variant: 'kit', nameIt: 'Kit promo cura (omaggio)', stock: 0, sales30: 0, qty: 6, plannedQty: 0, estimatedPrice: 0, confirmedPrice: 0, risk: 'extra' };

/** 把「解析出的」确认单套到当前草稿上（保留用户改过的 Est. 值） */
export function applyConfirmation(draft: PoLine[]): PoLine[] {
  const lines = draft.map((l): PoLine => {
    if (MISSING_SKUS.has(l.sku)) return { ...l, qty: 0, confirmedPrice: null, risk: 'missing', alert: undefined };
    if (l.alert === NEW_PRODUCT_NOTE || l.alert === SKU_CREATED_NOTE) return { ...l, qty: l.plannedQty, confirmedPrice: l.estimatedPrice };
    const qty = QTY_CUTS[l.sku] ?? l.plannedQty;
    const confirmedPrice = PRICE_CHANGES[l.sku] ?? l.estimatedPrice;
    return { ...l, qty, confirmedPrice, alert: undefined, risk: qty !== l.plannedQty ? 'qty' : Math.abs(confirmedPrice - l.estimatedPrice) > 0.001 ? 'price' : null };
  });
  for (const extra of [SUPPLIER_ADDED, GIFT]) if (!draft.some((l) => l.sku === extra.sku)) lines.push({ ...extra });
  return lines;
}

/** 行内差异说明（Notes 列） */
export function notesOf(l: PoLine, confirmed: boolean): { tone: 'muted' | 'warn' | 'danger' | 'ok'; lines: string[]; needsSku: boolean } {
  if (l.alert === NEW_PRODUCT_NOTE) return { tone: 'warn', lines: [NEW_PRODUCT_NOTE], needsSku: true };
  if (l.alert === SKU_CREATED_NOTE) return { tone: 'ok', lines: [SKU_CREATED_NOTE], needsSku: false };
  if (!confirmed) return { tone: 'muted', lines: l.alert ? [l.alert] : [], needsSku: false };
  if (l.risk === 'missing') return { tone: 'danger', lines: ['Missing on confirmation'], needsSku: false };
  if (isGift(l)) return { tone: 'ok', lines: [`Gift (omaggio) · ${l.qty} pcs free`], needsSku: false };
  if (l.risk === 'extra') return { tone: 'warn', lines: [`Supplier-added SKU · ${l.qty} pcs`], needsSku: true };
  const out: string[] = [];
  if (priceDiffers(l) && l.confirmedPrice != null) {
    const d = l.confirmedPrice - l.estimatedPrice;
    out.push(`Price ${d >= 0 ? '+' : '−'}€${Math.abs(d).toFixed(2)} (€${l.estimatedPrice.toFixed(2)}→€${l.confirmedPrice.toFixed(2)})`);
  }
  if (qtyDiffers(l)) out.push(`Qty ${l.plannedQty}→${l.qty}`);
  return out.length ? { tone: 'warn', lines: out, needsSku: false } : { tone: 'muted', lines: [], needsSku: false };
}

/* ───────── 收货 / DDT ───────── */
export type RecLine = {
  sku: string; productId: string; productCode: string; productName: string; variant: string; nameIt: string; unit: string;
  /** 确认单数量 */
  ordered: number;
  /** 已入库累计 */
  stocked: number;
  /** 本批 DDT 件数 */
  ddt: number;
  /** 本批实点 */
  counted: number;
};

/** 这一车实际送到的数量；缺的 SKU 表示没上车 */
export const DDT_QTY: Record<string, number> = {
  '370102': 60, '370108': 48, '431001': 60, '431015': 36, '420050': 36, '420106': 36, '510001': 60, '510002': 0,
  '880101': 60, '880102': 36, '880103': 24, '880104': 24, 'NEW-024': 6,
};
/** 只在 DDT 上出现、确认单上没有的行 */
export const DDT_ONLY: RecLine = { sku: '510003', productId: 'p-tc-510', productCode: 'TC-510', productName: 'Top coat', variant: 'Satin', nameIt: 'Top coat satinato', unit: 'PZ', ordered: 0, stocked: 0, ddt: 12, counted: 12 };

export const toReceiving = (lines: PoLine[]): RecLine[] => lines.filter((l) => l.qty > 0).map((l) => ({
  sku: l.sku, productId: l.productId, productCode: l.productCode, productName: l.productName, variant: l.variant, nameIt: l.nameIt, unit: 'PZ', ordered: l.qty, stocked: 0, ddt: 0, counted: 0,
}));
export const seedReceiving = () => toReceiving(applyConfirmation(BASE_LINES));
export function applyDdt(lines: RecLine[]): RecLine[] {
  const next = lines.map((l) => { const ddt = DDT_QTY[l.sku] ?? 0; return { ...l, ddt, counted: ddt }; });
  if (!next.some((l) => l.sku === DDT_ONLY.sku)) next.push({ ...DDT_ONLY });
  return next;
}

export type RemainingDecision = 'wait_next_batch' | 'close_remaining' | 'return_no_stock';
export const REMAINING: Record<RemainingDecision, { title: string; description: string; line: string }> = {
  wait_next_batch: { title: 'Wait for next batch', description: 'The order stays open for the next delivery.', line: 'Next batch' },
  close_remaining: { title: 'Close remaining', description: 'The supplier will not ship the rest.', line: 'Closed · not arriving' },
  return_no_stock: { title: 'Return / do not stock', description: 'Wrong or damaged goods stay out of stock.', line: 'Not stocked' },
};

export type ExtraDecision = 'return' | 'gift' | 'receive';
export const EXTRA_LABEL: Record<ExtraDecision, string> = { return: 'Return to supplier', gift: 'Gift · not stocked', receive: 'Stock in' };

export type Tone = 'ok' | 'warn' | 'info' | 'hold';
export function recStatus(l: RecLine, ddtUploaded: boolean, decision: RemainingDecision | null, extra: ExtraDecision | null): { label: string; tone: Tone } {
  if (!ddtUploaded) {
    // 没有 DDT 也能收货：直接拿实点数和确认单比
    const open = Math.max(0, l.ordered - l.stocked);
    if (l.counted === 0) return decision ? { label: REMAINING[decision].line, tone: decision === 'wait_next_batch' ? 'info' : 'hold' } : { label: 'Not counted yet', tone: 'info' };
    if (l.counted < open) return { label: 'Short vs confirmation', tone: 'warn' };
    if (l.counted > open) return { label: 'More than confirmed', tone: 'warn' };
    return { label: 'Matches confirmation', tone: 'ok' };
  }
  if (l.ordered === 0) return extra ? { label: EXTRA_LABEL[extra], tone: extra === 'return' ? 'hold' : 'ok' } : { label: 'Not on confirmation', tone: 'warn' };
  const open = Math.max(0, l.ordered - l.stocked);
  if (l.ddt === 0 && open > 0) return decision ? { label: REMAINING[decision].line, tone: decision === 'wait_next_batch' ? 'info' : 'hold' } : { label: 'Not on DDT', tone: 'info' };
  if (l.ddt < open) return { label: 'Short vs confirmation', tone: 'warn' };
  if (l.ddt > open) return { label: 'More than confirmed', tone: 'warn' };
  if (l.counted !== l.ddt) return { label: 'Actual ≠ DDT', tone: 'warn' };
  return { label: 'Matches confirmation', tone: 'ok' };
}
