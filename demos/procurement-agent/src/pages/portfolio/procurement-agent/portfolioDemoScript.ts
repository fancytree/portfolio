import { PORTFOLIO_COPY, STAGE_META } from './portfolioDemoCopy';
import type {
  ApprovalTrigger,
  ConfirmationRound,
  DemoChatAction,
  DemoChatMessage,
  DemoLine,
  DemoPhaseKey,
  DemoProgress,
  DemoStageId,
  DemoState,
  IntakeDraft,
  NegotiationNote,
  OrderAttachment,
  OutcomeRow,
  ReceiptBatchSnapshot,
  ReceivingLine,
  RemainingReceiptDecision,
  StageStatus,
} from './portfolioDemoTypes';

function demoLine(
  partial: Omit<DemoLine, 'plannedQty' | 'confirmedPrice' | 'name'> & {
    plannedQty?: number;
    confirmedPrice?: number | null;
    name?: string;
  },
): DemoLine {
  const qty = partial.qty;
  return {
    confirmedPrice: null,
    ...partial,
    name: partial.name ?? `${partial.productName} ${partial.variant}`,
    plannedQty: partial.plannedQty ?? qty,
  };
}

/** 作品集补货行：按 SPU（productId）归组，SKU 为规格行 */
export const BASE_LINES: DemoLine[] = [
  demoLine({
    productId: 'p-bn-370', productCode: 'BN-370', productName: 'Reinforced bonder',
    sku: '370102', variant: '14 ml', nameIt: 'Bonder rinforzante 14 ml',
    stock: 22, sales30: 68, recommended: 96, qty: 96, estimatedPrice: 5.4,
  }),
  demoLine({
    productId: 'p-bn-370', productCode: 'BN-370', productName: 'Reinforced bonder',
    sku: '370108', variant: '8 ml', nameIt: 'Bonder rinforzante 8 ml',
    stock: 31, sales30: 40, recommended: 48, qty: 48, estimatedPrice: 4.9,
  }),
  demoLine({
    productId: 'p-bn-431', productCode: 'BN-431', productName: 'Classic bonder',
    sku: '431001', variant: '8 ml', nameIt: 'Bonder classico 8 ml',
    stock: 18, sales30: 54, recommended: 72, qty: 72, estimatedPrice: 4.2,
  }),
  demoLine({
    productId: 'p-bn-431', productCode: 'BN-431', productName: 'Classic bonder',
    sku: '431015', variant: '15 ml', nameIt: 'Bonder classico 15 ml',
    stock: 9, sales30: 22, recommended: 36, qty: 36, estimatedPrice: 5.6,
  }),
  demoLine({
    productId: 'p-ft-400', productCode: 'FT-400', productName: 'Functional treatment',
    sku: '400213', variant: '50 ml', nameIt: 'Trattamento funzionale 50 ml',
    stock: 5, sales30: 11, recommended: 18, qty: 18, estimatedPrice: 6.8,
    alert: 'Slow mover vs lead time',
  }),
  demoLine({
    productId: 'p-ft-400', productCode: 'FT-400', productName: 'Functional treatment',
    sku: '400214', variant: '100 ml', nameIt: 'Trattamento funzionale 100 ml',
    stock: 8, sales30: 19, recommended: 24, qty: 24, estimatedPrice: 9.2,
  }),
  demoLine({
    productId: 'p-ct-420', productCode: 'CT-420', productName: 'Care treatment',
    sku: '420050', variant: '50 ml', nameIt: 'Trattamento cura 50 ml',
    stock: 20, sales30: 28, recommended: 36, qty: 36, estimatedPrice: 5.9,
  }),
  demoLine({
    productId: 'p-ct-420', productCode: 'CT-420', productName: 'Care treatment',
    sku: '420106', variant: '100 ml', nameIt: 'Trattamento cura 100 ml',
    stock: 14, sales30: 30, recommended: 36, qty: 36, estimatedPrice: 7.1,
  }),
  demoLine({
    productId: 'p-tc-510', productCode: 'TC-510', productName: 'Top coat',
    sku: '510001', variant: 'Gloss', nameIt: 'Top coat lucido',
    stock: 40, sales30: 55, recommended: 60, qty: 60, estimatedPrice: 4.5,
  }),
  demoLine({
    productId: 'p-tc-510', productCode: 'TC-510', productName: 'Top coat',
    sku: '510002', variant: 'Matte', nameIt: 'Top coat opaco',
    stock: 16, sales30: 21, recommended: 24, qty: 24, estimatedPrice: 4.5,
  }),
  demoLine({
    productId: 'p-cg-880', productCode: 'CG-880', productName: 'Color gel',
    sku: '880101', variant: 'Red Passion', nameIt: 'Gel colore Red Passion',
    stock: 12, sales30: 34, recommended: 48, qty: 48, estimatedPrice: 6.2,
  }),
  demoLine({
    productId: 'p-cg-880', productCode: 'CG-880', productName: 'Color gel',
    sku: '880102', variant: 'Nude Rose', nameIt: 'Gel colore Nude Rose',
    stock: 15, sales30: 29, recommended: 36, qty: 36, estimatedPrice: 6.2,
  }),
  demoLine({
    productId: 'p-cg-880', productCode: 'CG-880', productName: 'Color gel',
    sku: '880103', variant: 'Black Onyx', nameIt: 'Gel colore Black Onyx',
    stock: 10, sales30: 18, recommended: 24, qty: 24, estimatedPrice: 6.2,
  }),
];

/** 确认单行：不含赠品（赠品仅出现在 DDT / 收货）；确认价整体高于估价，总价仍上浮（即便有缺货/减量） */
export const CONFIRMED_LINES: DemoLine[] = [
  { ...BASE_LINES[0], qty: 90, confirmedPrice: 6.2, risk: 'price' },
  { ...BASE_LINES[1], confirmedPrice: 5.4, risk: 'price' },
  { ...BASE_LINES[2], qty: 60, confirmedPrice: 4.8, risk: 'qty' },
  { ...BASE_LINES[3], confirmedPrice: 6.2, risk: 'price' },
  {
    ...BASE_LINES[4],
    qty: 0,
    confirmedPrice: null,
    risk: 'missing',
    alert: 'Missing on confirmation - possible stockout',
  },
  { ...BASE_LINES[5], confirmedPrice: 10.2, risk: 'price' },
  { ...BASE_LINES[6], confirmedPrice: 6.5, risk: 'price' },
  { ...BASE_LINES[7], confirmedPrice: 7.9, risk: 'price' },
  { ...BASE_LINES[8], confirmedPrice: 5.1, risk: 'price' },
  { ...BASE_LINES[9], qty: 18, confirmedPrice: 5.1, risk: 'qty' },
  { ...BASE_LINES[10], confirmedPrice: 7.0, risk: 'price' },
  { ...BASE_LINES[11], confirmedPrice: 7.0, risk: 'price' },
  { ...BASE_LINES[12], confirmedPrice: 7.0, risk: 'price' },
];

/** 整单 SKU 目录（两次分批到货 Demo） */
/** 确认单常见赠品行（不在计划 qty 里，收货时出现） */
const RECEIVING_GIFT_LINE: Omit<ReceivingLine, 'stocked' | 'ddt' | 'counted' | 'disposition'> = {
  sku: 'NEW-024',
  name: 'Promo care kit',
  productId: 'p-new-024',
  productCode: 'NEW-024',
  productName: 'Promo care kit',
  variant: 'kit',
  nameIt: 'Kit promo cura',
  unit: 'PZ',
  ordered: 0,
};

/** 从当前采购单明细生成收货行（对齐 PoDetail：同一张 PO 的商品数据） */
export function createReceivingLinesFromPo(lines: DemoLine[]): ReceivingLine[] {
  const mapped: ReceivingLine[] = lines.map((line) => ({
    sku: line.sku,
    name: line.name,
    productId: line.productId,
    productCode: line.productCode,
    productName: line.productName,
    variant: line.variant,
    nameIt: line.nameIt,
    unit: 'PZ',
    ordered: line.qty,
    stocked: 0,
    ddt: 0,
    counted: 0,
    disposition: 'receive',
  }));
  if (!mapped.some((line) => line.sku === RECEIVING_GIFT_LINE.sku)) {
    mapped.push({
      ...RECEIVING_GIFT_LINE,
      stocked: 0,
      ddt: 0,
      counted: 0,
      disposition: 'receive',
    });
  }
  return mapped;
}

export type ReceivingSpuGroup = {
  key: string;
  productCode: string;
  label: string;
  items: ReceivingLine[];
};

/** 收货表按 SPU 归组（同补货计划） */
export function groupReceivingLinesBySpu(lines: ReceivingLine[]): ReceivingSpuGroup[] {
  const sorted = [...lines].sort((a, b) => {
    const spu = naturalCompare(a.productCode, b.productCode);
    if (spu !== 0) return spu;
    return naturalCompare(a.sku, b.sku);
  });
  const groups: ReceivingSpuGroup[] = [];
  const byKey = new Map<string, ReceivingSpuGroup>();
  for (const line of sorted) {
    let group = byKey.get(line.productId);
    if (!group) {
      group = {
        key: line.productId,
        productCode: line.productCode,
        label: line.productName,
        items: [],
      };
      byKey.set(line.productId, group);
      groups.push(group);
    }
    group.items.push(line);
  }
  return groups;
}

export function orderedQtyOf(lines: ReceivingLine[]) {
  return lines.reduce((sum, line) => sum + line.ordered, 0);
}

/** @deprecated 兼容旧引用：静态目录仅作 fallback */
export const RECEIVING_CATALOG: Array<Pick<ReceivingLine, 'sku' | 'name' | 'ordered'>> = [
  { sku: '370102', name: 'Reinforced bonder 14 ml', ordered: 90 },
  { sku: '370108', name: 'Reinforced bonder 8 ml', ordered: 48 },
  { sku: '431001', name: 'Classic bonder 8 ml', ordered: 60 },
  { sku: '431015', name: 'Classic bonder 15 ml', ordered: 36 },
  { sku: '420106', name: 'Care treatment 100 ml', ordered: 36 },
  { sku: '510002', name: 'Top coat Matte', ordered: 18 },
  { sku: 'NEW-024', name: 'Promo care kit', ordered: 0 },
];

export const DEMO_ORDERED_QTY = RECEIVING_CATALOG.reduce((sum, row) => sum + row.ordered, 0);

/** 第一批 DDT-1292：只填 DDT；Actual 默认=DDT（仓差异再改 Actual / chat） */
const BATCH1_DDT: Record<string, { ddt: number; disposition?: ReceivingLine['disposition'] }> = {
  '370102': { ddt: 90 },
  '370108': { ddt: 48 },
  // 相对下单 60 短少 12 → Notes 提醒 Short vs order；Actual 先填 48
  '431001': { ddt: 48 },
  '431015': { ddt: 36 },
  '420106': { ddt: 0 },
  '510002': { ddt: 18 },
  // 赠品：默认 hold，需 Accept / Return 后才能 Confirm
  'NEW-024': { ddt: 12, disposition: 'hold' },
};

/** 第二批 DDT-1301：补齐剩余（含 431001 缺口与 420106） */
const BATCH2_DDT: Record<string, { ddt: number; disposition?: ReceivingLine['disposition'] }> = {
  '370102': { ddt: 0 },
  '370108': { ddt: 0 },
  '431001': { ddt: 14 },
  '431015': { ddt: 0 },
  '420106': { ddt: 36 },
  '510002': { ddt: 0 },
  'NEW-024': { ddt: 0 },
};

/** 本批 open 订购量（ordered − 已入库） */
export function openOrderedOf(line: ReceivingLine) {
  return Math.max(0, line.ordered - line.stocked);
}

/** DDT 相对下单短少（主键对） */
export function isDdtShortVsOrder(line: ReceivingLine) {
  const open = openOrderedOf(line);
  return line.ordered > 0 && line.ddt > 0 && line.ddt < open;
}

/** DDT 相对下单超量 */
export function isDdtOverVsOrder(line: ReceivingLine) {
  const open = openOrderedOf(line);
  return line.ordered > 0 && line.ddt > open;
}

/** Actual 与 DDT 不一致（仓差异，次级） */
export function isActualDiffersDdt(line: ReceivingLine) {
  return line.ddt > 0 && line.counted !== line.ddt;
}

/** 无 PO 行时的 fallback（跳转 STAGE 用） */
export function createEmptyReceivingLines(): ReceivingLine[] {
  return RECEIVING_CATALOG.map((row) => {
    const base = BASE_LINES.find((line) => line.sku === row.sku);
    return {
      sku: row.sku,
      name: row.name,
      productId: base?.productId ?? `p-${row.sku}`,
      productCode: base?.productCode ?? row.sku,
      productName: base?.productName ?? row.name,
      variant: base?.variant ?? '',
      nameIt: base?.nameIt ?? row.name,
      unit: 'PZ',
      ordered: row.ordered,
      stocked: 0,
      ddt: 0,
      counted: 0,
      disposition: 'receive' as const,
    };
  });
}

/** @deprecated 兼容旧引用：等同空表 + 未上传 DDT */
export const RECEIVING_LINES: ReceivingLine[] = createEmptyReceivingLines();

export function stockedTotalOf(lines: ReceivingLine[]) {
  return lines.reduce((sum, line) => sum + line.stocked, 0);
}

export function openQtyOf(lines: ReceivingLine[]) {
  return lines.reduce((sum, line) => sum + Math.max(0, line.ordered - line.stocked), 0);
}

export function nextReceiptBatchNo(batches: ReceiptBatchSnapshot[]) {
  return batches.length + 1;
}

export function applyCurrentBatchDdt(state: DemoState): DemoState {
  const batchNo = nextReceiptBatchNo(state.receiptBatches);
  const fill = batchNo <= 1 ? BATCH1_DDT : BATCH2_DDT;
  const receivingLines = state.receivingLines.map((line) => {
    const patch = fill[line.sku] ?? { ddt: 0 };
    // Actual 默认填入 DDT，仓差异再改
    return {
      ...line,
      ddt: patch.ddt,
      counted: patch.ddt,
      disposition: patch.disposition ?? 'receive',
    };
  });
  return {
    ...state,
    currentDdtReady: true,
    awaitingRemainingDecision: false,
    receivingLines,
  };
}

export type DdtMatchReport = {
  text: string;
  bullets: string[];
  actions: DemoChatAction[];
};

const REMAINING_DECISION_KEYS: RemainingReceiptDecision[] = [
  'wait_next_batch',
  'supplier_delay',
  'close_remaining',
  'return_no_stock',
];

/** 对齐 PoDetail：处理剩余四选一，作为 chat 推荐操作 */
export function remainingChatActions(): DemoChatAction[] {
  return REMAINING_DECISION_KEYS.map((key) => ({
    id: `remaining-${key}`,
    label: PORTFOLIO_COPY.remainingOptions[key].title,
    prompt: PORTFOLIO_COPY.remainingOptions[key].title,
  }));
}

/** 从 chat prompt 解析剩余处理决策 */
export function remainingDecisionFromPrompt(prompt: string): RemainingReceiptDecision | null {
  const trimmed = prompt.trim();
  for (const key of REMAINING_DECISION_KEYS) {
    const title = PORTFOLIO_COPY.remainingOptions[key].title;
    if (trimmed === title || trimmed.toLowerCase() === title.toLowerCase()) return key;
  }
  const lower = trimmed.toLowerCase();
  if (lower.includes('wait for next batch') || lower === 'wait_next_batch') return 'wait_next_batch';
  if (lower.includes('supplier delay') || lower === 'supplier_delay') return 'supplier_delay';
  if (lower.includes('close remaining') || lower === 'close_remaining') return 'close_remaining';
  if (lower.includes('return / do not stock') || lower.includes('return_no_stock') || lower.includes('do not stock')) {
    return 'return_no_stock';
  }
  return null;
}

/** 确认入库后的 open 摘要（不全量列 SKU） */
export function summarizeOpenRemainder(lines: ReceivingLine[]): {
  openPcs: number;
  openSkuCount: number;
  bullets: string[];
} {
  const openLines = lines.filter((line) => line.ordered > line.stocked);
  const openPcs = openLines.reduce((sum, line) => sum + (line.ordered - line.stocked), 0);
  const partial = openLines.filter((line) => line.stocked > 0);
  const untouched = openLines.filter((line) => line.stocked === 0);
  const bullets: string[] = [];

  for (const line of partial) {
    bullets.push(
      `${line.sku} · open ${line.ordered - line.stocked} of ${line.ordered} after this batch.`,
    );
  }
  if (untouched.length === 1) {
    const line = untouched[0];
    bullets.push(`${line.sku} · still fully open (${line.ordered} pcs).`);
  } else if (untouched.length > 1) {
    const pcs = untouched.reduce((sum, line) => sum + line.ordered, 0);
    const skuList = untouched.map((line) => line.sku).join(', ');
    bullets.push(
      `${untouched.length} SKUs still fully open (${skuList}) · ${pcs} pcs - expect on a later batch.`,
    );
  }

  return { openPcs, openSkuCount: openLines.length, bullets };
}

/** 上传 DDT 后生成分条差异说明 + 可在 chat 点击的推荐操作 */
export function buildDdtMatchReport(state: DemoState, ddtLabel: string): DdtMatchReport {
  const batchNo = state.receiptBatches.length + 1;
  const lines = state.receivingLines;
  const bullets: string[] = [PORTFOLIO_COPY.ddtMatchStockInNote];
  const actions: DemoChatAction[] = [];

  // 主键对：DDT vs 下单；Actual 默认=DDT，仓差异另报
  const shortVsOrder = lines.filter(isDdtShortVsOrder);
  const overVsOrder = lines.filter(isDdtOverVsOrder);
  const actualDiffers = lines.filter(isActualDiffersDdt);
  const missingOnDdt = lines.filter(
    (line) => line.ordered > 0 && line.ddt === 0 && line.stocked < line.ordered,
  );
  const giftLines = lines.filter((line) => line.ordered === 0 && line.ddt > 0);
  const holdLines = lines.filter((line) => line.disposition === 'hold');

  for (const line of shortVsOrder) {
    const open = openOrderedOf(line);
    const gap = open - line.ddt;
    bullets.push(
      `${line.sku} · short ${gap} vs order (ordered ${open} → DDT ${line.ddt}).`,
    );
  }
  for (const line of overVsOrder) {
    const open = openOrderedOf(line);
    const extra = line.ddt - open;
    bullets.push(
      `${line.sku} · over ${extra} vs order (ordered ${open} → DDT ${line.ddt}).`,
    );
  }
  for (const line of actualDiffers) {
    if (line.counted < line.ddt) {
      bullets.push(
        `${line.sku} · Actual short ${line.ddt - line.counted} vs DDT (${line.ddt}→${line.counted}).`,
      );
    } else {
      bullets.push(
        `${line.sku} · Actual over ${line.counted - line.ddt} vs DDT (${line.ddt}→${line.counted}).`,
      );
    }
  }
  // 整批未到货合并成一条
  if (missingOnDdt.length > 0) {
    const openPcs = missingOnDdt.reduce((sum, line) => sum + openOrderedOf(line), 0);
    const skuList = missingOnDdt.map((line) => line.sku).join(', ');
    bullets.push(
      missingOnDdt.length === 1
        ? `${skuList} · not on this DDT (still open ${openPcs}).`
        : `${missingOnDdt.length} SKUs not on this DDT (${skuList}) · open ${openPcs} pcs - expect on a later batch.`,
    );
  }
  for (const line of giftLines) {
    if (line.disposition === 'hold') {
      bullets.push(
        `${line.sku} · supplier promo / gift on DDT (${line.ddt} pcs) - on hold until you accept or return it.`,
      );
    } else {
      bullets.push(
        `${line.sku} · supplier promo / gift on DDT (${line.ddt} pcs) · disposition: ${line.disposition}.`,
      );
    }
  }
  for (const line of holdLines) {
    if (giftLines.some((g) => g.sku === line.sku)) continue;
    bullets.push(`${line.sku} · on hold - accept as gift or return before Confirm.`);
  }

  if (bullets.length === 1) {
    bullets.push('No DDT vs order variance on this arrival.');
  }

  // 推荐：hold 赠品处理 → Confirm（仓差异改走输入框，不在这里给解释/上报）
  for (const line of giftLines) {
    if (line.disposition !== 'receive') {
      actions.push({
        id: `accept-${line.sku}`,
        label: PORTFOLIO_COPY.acceptSkuGift(line.sku),
        prompt: `Accept ${line.sku} as gift`,
      });
    }
    actions.push({
      id: `return-${line.sku}`,
      label: PORTFOLIO_COPY.returnSku(line.sku),
      prompt: `Return ${line.sku}`,
    });
  }
  for (const line of holdLines) {
    if (giftLines.some((g) => g.sku === line.sku)) continue;
    actions.push({
      id: `accept-hold-${line.sku}`,
      label: PORTFOLIO_COPY.acceptSkuGift(line.sku),
      prompt: `Accept ${line.sku} as gift`,
    });
    actions.push({
      id: `return-hold-${line.sku}`,
      label: PORTFOLIO_COPY.returnSku(line.sku),
      prompt: `Return ${line.sku}`,
    });
  }

  if (!hasUnresolvedHold(lines)) {
    actions.push({
      id: 'confirm-receipt',
      label: PORTFOLIO_COPY.confirmReceipt,
      prompt: PORTFOLIO_COPY.confirmReceipt,
    });
  }

  return {
    text: PORTFOLIO_COPY.ddtMatchTitle(ddtLabel, batchNo),
    bullets,
    actions,
  };
}

/** Demo 分批确认入库时间（对齐 DDT 附件时间线） */
export function receiptBatchConfirmedAt(batchNo: number): string {
  return batchNo <= 1 ? DEMO_TIMELINE.batch1Confirm : DEMO_TIMELINE.batch2Confirm;
}

/** 单批入库统计（Order details 摘要，非行明细） */
export function summarizeReceiptBatch(batch: ReceiptBatchSnapshot): {
  skuCount: number;
  pcs: number;
  ddtPcs: number;
} {
  let skuCount = 0;
  let pcs = 0;
  let ddtPcs = 0;
  for (const row of Object.values(batch.bySku)) {
    if (row.ddt > 0 || row.counted > 0) skuCount += 1;
    pcs += row.counted;
    ddtPcs += row.ddt;
  }
  return { skuCount, pcs, ddtPcs };
}

/** 确认当前批次入库：累计 stocked，写入批次快照，清空当前 DDT 列 */
export function confirmCurrentReceiptBatch(state: DemoState): DemoState {
  if (!state.currentDdtReady || hasUnresolvedHold(state.receivingLines)) return state;

  const batchNo = nextReceiptBatchNo(state.receiptBatches);
  const label = batchNo <= 1 ? 'DDT-1292' : 'DDT-1301';
  const bySku: ReceiptBatchSnapshot['bySku'] = {};
  const receivingLines = state.receivingLines.map((line) => {
    bySku[line.sku] = { ddt: line.ddt, counted: line.counted };
    const add = line.disposition === 'receive' ? line.counted : 0;
    return {
      ...line,
      stocked: line.stocked + add,
      ddt: 0,
      counted: 0,
      disposition: 'receive' as const,
    };
  });
  const receiptBatches: ReceiptBatchSnapshot[] = [
    ...state.receiptBatches,
    {
      id: `batch-${batchNo}`,
      label,
      batchNo,
      confirmedAt: receiptBatchConfirmedAt(batchNo),
      bySku,
    },
  ];
  const openQty = openQtyOf(receivingLines);
  const receivingComplete = openQty <= 0;
  return {
    ...state,
    receivingLines,
    receiptBatches,
    currentDdtReady: false,
    awaitingRemainingDecision: !receivingComplete,
    remainingDecision: receivingComplete ? state.remainingDecision : null,
    receivingComplete,
  };
}

export function applyRemainingGoodsDecision(
  state: DemoState,
  decision: RemainingReceiptDecision,
): DemoState {
  const closes = decision === 'close_remaining' || decision === 'return_no_stock';
  return {
    ...state,
    remainingDecision: decision,
    awaitingRemainingDecision: false,
    receivingComplete: closes ? true : state.receivingComplete,
  };
}

/** MNP 已确认供应规则（作品集演示数据，对齐生产字段） */
export const MNP_SUPPLIER_RULES = {
  name: 'MNP (MESAUDA NAIL PRO)',
  contact: 'Orders desk · ordini@mynailpro.demo',
  website: 'https://www.mynailpro.com/',
  language: 'Italiano (it-IT)',
  country: 'Italy',
  minOrderValue: 1500,
  minOrderQty: null as number | null,
  freeShippingThreshold: 2000,
  defaultShippingFee: 45,
  shippingNote: 'Fixed fee when under free-shipping threshold',
  earlyPaymentDiscountRate: 0.02,
  earlyPaymentDays: 10,
  paymentMethod: 'Bank transfer',
  paymentDays: 0,
  volumeDiscount: 'Orders ≥ €1,500 → 8% merchandise discount (demo)',
  leadTimeMedianDays: 14,
  leadTimeP90Days: 21,
  validUntil: '2026-09-30',
  source: 'Quote v3 + buyer confirmation',
  version: 'rule-R04',
} as const;

/** Demo 计划覆盖天数（复盘销量窗口 = 入库后该天数） */
export const DEMO_COVERAGE_DAYS = 30;

export const OUTCOME_ROWS: OutcomeRow[] = [
  { sku: '370102', name: 'Reinforced bonder 14 ml', ordered: 90, sold: 88, remaining: 14, note: 'Qty cut on confirmation; demand held - coverage looked right' },
  { sku: '370108', name: 'Reinforced bonder 8 ml', ordered: 48, sold: 41, remaining: 9, note: 'Steady sell-through; slight buffer left' },
  { sku: '431001', name: 'Classic bonder 8 ml', ordered: 60, sold: 44, remaining: 4, note: 'Short-shipped vs DDT - under-supply, not over-order' },
  { sku: '431015', name: 'Classic bonder 15 ml', ordered: 36, sold: 29, remaining: 8, note: 'On track vs 30d coverage' },
  { sku: '400214', name: 'Functional treatment 100 ml', ordered: 24, sold: 19, remaining: 6, note: 'On track; sister SKU 400213 was missing on confirmation' },
  { sku: '420050', name: 'Care treatment 50 ml', ordered: 36, sold: 28, remaining: 10, note: 'Healthy velocity after arrival' },
  { sku: '420106', name: 'Care treatment 100 ml', ordered: 36, sold: 22, remaining: 14, note: 'Mild over-order vs post-arrival demand' },
  { sku: '510001', name: 'Top coat Gloss', ordered: 60, sold: 52, remaining: 11, note: 'Fast mover - coverage held' },
  { sku: '510002', name: 'Top coat Matte', ordered: 18, sold: 11, remaining: 7, note: 'Slower sell-through after arrival' },
  { sku: '880101', name: 'Color gel Red Passion', ordered: 48, sold: 40, remaining: 10, note: 'On track vs coverage' },
  { sku: '880102', name: 'Color gel Nude Rose', ordered: 36, sold: 31, remaining: 7, note: 'On track vs coverage' },
  { sku: '880103', name: 'Color gel Black Onyx', ordered: 24, sold: 16, remaining: 9, note: 'A bit soft vs plan - watch next cycle' },
];

const OUTCOME_BY_SKU = new Map(OUTCOME_ROWS.map((row) => [row.sku, row]));

/**
 * 复盘行 outcome：赠品/退回不计入销量；
 * 有种子数据用种子，否则按入库量估一个 Demo 去化。
 */
export function outcomeForReceivingLine(line: ReceivingLine): OutcomeRow | null {
  if (line.sku === 'NEW-024' || line.disposition === 'return') return null;
  if (line.ordered <= 0 && line.stocked <= 0) return null;
  const known = OUTCOME_BY_SKU.get(line.sku);
  if (known) return known;
  const base = line.stocked > 0 ? line.stocked : line.ordered;
  const sold = Math.min(base, Math.max(0, Math.round(base * 0.8)));
  const remaining = Math.max(0, base - sold);
  return {
    sku: line.sku,
    name: line.name,
    ordered: line.ordered,
    sold,
    remaining,
    note: 'No standout signal vs coverage window',
  };
}

export type DemoSpuGroup = {
  key: string;
  productCode: string;
  label: string;
  items: DemoLine[];
};

function naturalCompare(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

/** 对齐生产：按 productId 归组，组间 productCode 自然序，组内 sku 自然序 */
export function groupDemoLinesBySpu(lines: DemoLine[]): DemoSpuGroup[] {
  const sorted = [...lines].sort((a, b) => {
    const spu = naturalCompare(a.productCode, b.productCode);
    if (spu !== 0) return spu;
    return naturalCompare(a.sku, b.sku);
  });
  const groups: DemoSpuGroup[] = [];
  const byKey = new Map<string, DemoSpuGroup>();
  for (const line of sorted) {
    let group = byKey.get(line.productId);
    if (!group) {
      group = {
        key: line.productId,
        productCode: line.productCode,
        label: line.productName,
        items: [],
      };
      byKey.set(line.productId, group);
      groups.push(group);
    }
    group.items.push(line);
  }
  return groups;
}

export function lineHasConfirmationGap(line: DemoLine): boolean {
  if (line.risk === 'missing' || line.risk === 'extra') return true;
  if (line.confirmedPrice != null && Math.abs(line.confirmedPrice - line.estimatedPrice) > 0.001) return true;
  if (line.plannedQty !== line.qty) return true;
  return false;
}

export const PHASES: DemoPhaseKey[] = ['understand', 'validate', 'calculate', 'explain'];

export function idleProgress(): DemoProgress {
  return { status: 'idle', current: null, completed: [] };
}

export function createOpeningMessage(): DemoChatMessage {
  return { id: 'm-open', role: 'agent', text: PORTFOLIO_COPY.opening };
}

const DEMO_CONFIRMATION_FILE = PORTFOLIO_COPY.confirmationFileDemo;
const DEMO_CONFIRMATION_ALT = PORTFOLIO_COPY.confirmationFileAlt;

function formatStamp(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function nowStamp(): string {
  return formatStamp(new Date());
}

/** 在既有时间戳上偏移分钟，模拟先后上传 */
function shiftStamp(stamp: string, deltaMinutes: number): string {
  const normalized = stamp.includes('T') ? stamp : stamp.replace(' ', 'T');
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return nowStamp();
  d.setMinutes(d.getMinutes() + deltaMinutes);
  return formatStamp(d);
}

/**
 * Demo 固定时间线（附件按业务先后，避免 now() 把 DDT/确认单/计划打乱）：
 * 导出申请 → 补货计划 → 确认单 V1 → 确认单终版 → 下单/发票 → DDT-1292 → DDT-1301
 */
function demoStamp(dayOffset: number, hours: number, minutes: number): string {
  const d = new Date(2026, 7, 5, hours, minutes, 0, 0); // 2026-08-05 本地
  d.setDate(d.getDate() + dayOffset);
  return formatStamp(d);
}

const DEMO_TIMELINE = {
  exportRequest: demoStamp(0, 9, 15),
  plan: demoStamp(0, 9, 22),
  confirmationV1: demoStamp(0, 15, 40),
  confirmationFinal: demoStamp(1, 10, 5),
  orderAt: '2026-08-06T10:30',
  invoice: demoStamp(1, 11, 30),
  ddt1292: demoStamp(1, 14, 12),
  batch1Confirm: demoStamp(1, 14, 40),
  ddt1301: demoStamp(7, 14, 40),
  batch2Confirm: demoStamp(7, 15, 5),
} as const;

/**
 * 下一份 confirmation 的上传时间（走 Demo 时间线）
 */
function nextConfirmationStamp(previousStamp: string | null): string {
  if (!previousStamp) return DEMO_TIMELINE.confirmationV1;
  if (previousStamp <= DEMO_TIMELINE.confirmationV1) return DEMO_TIMELINE.confirmationFinal;
  return shiftStamp(previousStamp, 26 * 60 + 20);
}

/** Demo 重传时交替文件名，便于演示「不同 confirmation → 新谈价记录」 */
export function nextDemoConfirmationFile(state: DemoState): string {
  const current = currentConfirmation(state);
  if (!current) return DEMO_CONFIRMATION_FILE;
  return current.fileName === DEMO_CONFIRMATION_FILE
    ? DEMO_CONFIRMATION_ALT
    : DEMO_CONFIRMATION_FILE;
}

/** 审批激活规则：价格/数量变化、缺货/多余、新品、预付款、大额等 */
export function evaluateApprovalTriggers(lines: DemoLine[]): ApprovalTrigger[] {
  const priceHits = lines.filter(
    (line) => line.confirmedPrice != null && Math.abs(line.confirmedPrice - line.estimatedPrice) >= 0.01,
  );
  const qtyHits = lines.filter(
    (line) => line.risk !== 'missing' && line.risk !== 'extra' && line.qty !== line.plannedQty,
  );
  const missing = lines.filter((line) => line.risk === 'missing');
  const extras = lines.filter((line) => line.risk === 'extra');
  const goods = goodsTotal(lines);
  return [
    {
      id: 'price_change',
      label: 'Price change vs estimate',
      fired: priceHits.length > 0,
      evidence: priceHits.length
        ? priceHits.map((line) => `${line.sku} €${line.estimatedPrice.toFixed(2)}→€${(line.confirmedPrice ?? 0).toFixed(2)}`).join(' · ')
        : 'No material price drift',
    },
    {
      id: 'qty_change',
      label: 'Confirmed qty differs from plan',
      fired: qtyHits.length > 0,
      evidence: qtyHits.length
        ? qtyHits.map((line) => `${line.sku} ${line.plannedQty}→${line.qty}`).join(' · ')
        : 'Quantities match the plan',
    },
    {
      id: 'missing_extra',
      label: 'Missing / extra SKUs on confirmation',
      fired: missing.length + extras.length > 0,
      evidence: [
        ...missing.map((line) => `Missing ${line.sku}`),
        ...extras.map((line) => `Extra ${line.sku} ×${line.qty}`),
      ].join(' · ') || 'No missing / extra lines',
    },
    {
      id: 'new_sku',
      label: 'New SKU on confirmation',
      fired: extras.some((line) => line.sku.startsWith('NEW-')),
      evidence: extras.some((line) => line.sku.startsWith('NEW-'))
        ? extras.filter((line) => line.sku.startsWith('NEW-')).map((line) => line.sku).join(' · ')
        : 'No new SKUs',
    },
    {
      id: 'prepayment',
      label: 'Prepayment / special payment terms',
      fired: true,
      evidence: '50% prepaid (~€4,110) on supplier confirmation',
    },
    {
      id: 'large_order',
      label: 'Order value above threshold',
      fired: goods >= 5000,
      evidence: `Goods subtotal €${goods.toFixed(2)} (threshold €5,000)`,
    },
  ];
}

function mergeAttachments(
  existing: OrderAttachment[],
  incoming: OrderAttachment[],
): OrderAttachment[] {
  const map = new Map<string, OrderAttachment>();
  for (const item of existing) map.set(item.id, item);
  for (const item of incoming) map.set(item.id, item);
  // 附件列表按上传时间倒序（最新在上）
  return Array.from(map.values()).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

function replenishmentPlanAttachment(uploadedAt: string = DEMO_TIMELINE.plan): OrderAttachment {
  return {
    id: 'att-plan',
    kind: 'replenishment_plan',
    label: 'Replenishment plan',
    fileName: 'PO-2026-0842_MNP_plan_2026-08-05.xlsx',
    uploadedAt,
    // 先有计划，再有供应商确认（不是确认后才生成）
    source: 'Generated from plan',
    format: 'xlsx',
  };
}

function confirmationAttachment(
  fileName: string,
  uploadedAt: string,
  isCurrent: boolean,
): OrderAttachment {
  return {
    id: `att-conf-${fileName}`,
    kind: 'confirmation',
    label: 'Supplier confirmation',
    fileName,
    uploadedAt,
    source: 'Upload',
    format: 'pdf',
    isCurrent,
  };
}

export function currentConfirmation(state: DemoState): ConfirmationRound | null {
  return state.confirmationRounds.find((round) => round.isCurrent) ?? null;
}

/**
 * 上传 confirmation：
 * - 文件名与当前不同 → 追加谈价记录，并可能作废已批准
 * - 相同文件 → 不重复记 negotiation，只刷新 diff / 附件
 */
export function applyConfirmationUpload(
  state: DemoState,
  fileName: string = DEMO_CONFIRMATION_FILE,
): DemoState {
  const current = currentConfirmation(state);
  const isDifferent = !current || current.fileName !== fileName;
  // 新确认单用错开时间线；同文件重传保持原时间
  const stamp = isDifferent
    ? nextConfirmationStamp(current?.uploadedAt ?? null)
    : (current?.uploadedAt ?? nowStamp());
  const lines = CONFIRMED_LINES.map((line) => ({ ...line }));
  const triggers = evaluateApprovalTriggers(lines);
  const approvalRequiredByRules = triggers.some((item) => item.fired);
  const seqBase = state.messageSeq;

  let confirmationRounds = state.confirmationRounds;
  let messageSeq = state.messageSeq;

  if (isDifferent) {
    const version = state.confirmationRounds.length + 1;
    messageSeq = seqBase + 1;
    const agentNote: NegotiationNote = {
      id: `neg-${messageSeq}`,
      at: stamp,
      actor: 'Agent',
      text: `Different confirmation uploaded (${fileName}). Recorded as V${version}. Parsed gaps: price up vs Est., qty drifts, missing 400213.`,
    };
    confirmationRounds = [
      ...state.confirmationRounds.map((round) => ({
        ...round,
        isCurrent: false,
        versionLabel: round.versionLabel
          .replace(/\s·\scurrent$/i, '')
          .replace(/\s·\sfinal approved$/i, ''),
      })),
      {
        id: `conf-v${version}-${messageSeq}`,
        fileName,
        versionLabel: `Confirmation V${version}`,
        uploadedAt: stamp,
        source: 'Upload',
        isCurrent: true,
        notes: [agentNote],
      },
    ];
  }

  const confirmationAtts = confirmationRounds.map((round) => (
    confirmationAttachment(
      round.fileName,
      round.uploadedAt,
      round.isCurrent,
    )
  ));

  const keep = state.attachments.filter(
    (item) => item.kind !== 'confirmation' && item.kind !== 'replenishment_plan',
  );

  const wasApproved = state.approved || state.approvalDecision === 'approved';
  const invalidate = isDifferent && wasApproved;
  // 计划保持时间线早期；若已有计划附件则沿用其时间
  const existingPlanAt = state.attachments.find((item) => item.kind === 'replenishment_plan')?.uploadedAt;
  const planStamp = existingPlanAt ?? DEMO_TIMELINE.plan;

  return {
    ...state,
    messageSeq,
    confirmationUploaded: true,
    confirmationHasRisk: approvalRequiredByRules,
    lines,
    confirmationRounds,
    attachments: mergeAttachments(keep, [
      ...confirmationAtts,
      replenishmentPlanAttachment(planStamp),
    ]),
    approvalTriggers: triggers,
    approvalRequiredByRules,
    approvalSubmitted: invalidate ? false : state.approvalSubmitted,
    approvalDecision: invalidate
      ? 'invalidated'
      : (isDifferent && state.approvalDecision === 'pending' ? 'pending' : state.approvalDecision),
    approved: invalidate ? false : state.approved,
    // 换确认单作废审批时，同步清掉尚未下单的元数据
    orderAt: invalidate ? null : state.orderAt,
    orderedBy: invalidate ? null : state.orderedBy,
    expectedArrival: invalidate ? null : state.expectedArrival,
  };
}

/** 提交审批（Agent 识别后或用户手动）；不切换页面，留在当前补货计划 */
export function submitForApproval(state: DemoState): DemoState {
  if (!state.confirmationUploaded) return state;
  return {
    ...state,
    approvalSubmitted: true,
    approvalDecision: state.approved ? 'approved' : 'pending',
    approved: state.approved,
  };
}

export function approveProposal(state: DemoState): DemoState {
  return {
    ...state,
    stage: 'approval',
    approvalSubmitted: true,
    approvalDecision: 'approved',
    approved: true,
    // 谈价记录标题标明最终批准的确认单
    confirmationRounds: state.confirmationRounds.map((round) => {
      const baseLabel = round.versionLabel
        .replace(/\s·\scurrent$/i, '')
        .replace(/\s·\sfinal approved$/i, '')
        .replace(/\s·\sawaiting approval$/i, '');
      return {
        ...round,
        versionLabel: round.isCurrent ? `${baseLabel} · Final approved` : baseLabel,
      };
    }),
  };
}

/** 本地 datetime-local 默认值（YYYY-MM-DDTHH:mm） */
export function nowLocalDateTimeValue(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 按供应商交期中位数推算预计到货日（可被用户改） */
export function defaultExpectedArrivalDate(leadTimeMedianDays = MNP_SUPPLIER_RULES.leadTimeMedianDays): string {
  const d = new Date();
  d.setDate(d.getDate() + leadTimeMedianDays);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Mark as ordered 弹窗填写的下单元数据 */
export type MarkOrderMeta = {
  orderAt: string;
  orderedBy: string;
  expectedArrival: string;
};

/** 作品集演示操作人（对齐生产 EmployeeSelector：下拉选择，不手填） */
export const DEMO_OPERATORS = [
  { id: 'op-river', name: 'River', role: 'Admin' },
  { id: 'op-giulia', name: 'Giulia Rossi', role: 'Buyer' },
  { id: 'op-marco', name: 'Marco Bianchi', role: 'Warehouse' },
  { id: 'op-elena', name: 'Elena Conti', role: 'Ops' },
] as const;

/** 导出供应商申请后写入本单附件 */
export function upsertExportAttachment(
  state: DemoState,
  format: 'xlsx' | 'pdf',
): DemoState {
  const fileName = `MNP_richiesta_acquisto_2026-08-05.${format}`;
  const next: OrderAttachment = {
    id: 'att-export-request',
    kind: 'supplier_request',
    label: 'Supplier request (no prices)',
    fileName,
    uploadedAt: DEMO_TIMELINE.exportRequest,
    source: 'Exported from plan',
    format,
  };
  return {
    ...state,
    exportFormat: format,
    attachments: mergeAttachments(
      state.attachments.filter((item) => item.id !== next.id),
      [next],
    ),
  };
}

/** 是否已有供应商发票附件 */
export function hasInvoiceAttachment(attachments: OrderAttachment[]) {
  return attachments.some((item) => item.kind === 'invoice');
}

/** 已下单后上传发票（Demo：写入附件，不对行价做 OCR 覆盖） */
export function applyInvoiceUpload(state: DemoState): DemoState {
  if (!state.orderRecorded) return state;
  const next: OrderAttachment = {
    id: 'att-invoice-po',
    kind: 'invoice',
    // 标签写清「发票」，避免和确认单/DDT 混淆
    label: 'Supplier invoice (Fattura)',
    fileName: PORTFOLIO_COPY.invoiceFileDemo,
    uploadedAt: DEMO_TIMELINE.invoice,
    source: 'Buyer upload after order',
    format: 'pdf',
  };
  return {
    ...state,
    attachments: mergeAttachments(
      state.attachments.filter((item) => item.id !== next.id),
      [next],
    ),
  };
}

/** 收货阶段按已确认批次 / 当前 DDT 补充附件 */
export function ensureDdtAttachments(state: DemoState): DemoState {
  const ddtFiles: OrderAttachment[] = [
    {
      id: 'att-ddt-1292',
      kind: 'ddt',
      label: 'DDT-1292 (first shipment)',
      fileName: 'DDT-1292_MNP.pdf',
      uploadedAt: DEMO_TIMELINE.ddt1292,
      source: 'Supplier email',
      format: 'pdf',
    },
    {
      id: 'att-ddt-1301',
      kind: 'ddt',
      label: 'DDT-1301 (second shipment)',
      fileName: 'DDT-1301_MNP.pdf',
      uploadedAt: DEMO_TIMELINE.ddt1301,
      source: 'Warehouse upload',
      format: 'pdf',
    },
  ];
  const batchCount = state.receiptBatches.length;
  const includeSecond = batchCount >= 1 && (state.currentDdtReady || batchCount >= 2 || state.stage === 'retrospective');
  const includeFirst = batchCount >= 1 || state.currentDdtReady || state.stage === 'retrospective';
  const needed = [
    ...(includeFirst ? [ddtFiles[0]] : []),
    ...(includeSecond ? [ddtFiles[1]] : []),
  ];
  return {
    ...state,
    attachments: needed.length > 0 ? mergeAttachments(state.attachments, needed) : state.attachments,
  };
}

/**
 * 已下单阶段：补齐申请/计划/发票，并把已知附件时间校准到 Demo 时间线。
 */
export function ensureOrderedDocumentPack(state: DemoState): DemoState {
  if (!state.orderRecorded) return state;
  let next = state;
  if (!next.attachments.some((item) => item.kind === 'supplier_request')) {
    next = upsertExportAttachment(next, 'pdf');
  }
  if (!next.attachments.some((item) => item.kind === 'replenishment_plan')) {
    next = {
      ...next,
      attachments: mergeAttachments(next.attachments, [replenishmentPlanAttachment()]),
    };
  }
  if (!hasInvoiceAttachment(next.attachments)) {
    next = applyInvoiceUpload(next);
  }
  next = ensureDdtAttachments(next);

  const stampById: Record<string, string> = {
    'att-export-request': DEMO_TIMELINE.exportRequest,
    'att-plan': DEMO_TIMELINE.plan,
    'att-invoice-po': DEMO_TIMELINE.invoice,
    'att-ddt-1292': DEMO_TIMELINE.ddt1292,
    'att-ddt-1301': DEMO_TIMELINE.ddt1301,
  };
  const rounds = [...next.confirmationRounds].sort((a, b) => a.uploadedAt.localeCompare(b.uploadedAt));
  const confStamps = [DEMO_TIMELINE.confirmationV1, DEMO_TIMELINE.confirmationFinal];
  const confStampByFile = new Map<string, string>();
  rounds.forEach((round, index) => {
    confStampByFile.set(round.fileName, confStamps[Math.min(index, confStamps.length - 1)]);
  });

  const attachments = mergeAttachments(
    [],
    next.attachments.map((item) => {
      if (item.kind === 'confirmation') {
        const at = confStampByFile.get(item.fileName) ?? item.uploadedAt;
        return { ...item, uploadedAt: at };
      }
      if (item.id === 'att-plan') {
        return {
          ...item,
          uploadedAt: stampById[item.id] ?? item.uploadedAt,
          // 计划早于确认单；避免残留「确认后生成」文案
          source: 'Generated from plan',
        };
      }
      if (item.id === 'att-invoice-po') {
        return {
          ...item,
          uploadedAt: stampById[item.id] ?? item.uploadedAt,
          label: 'Supplier invoice (Fattura)',
          source: 'Buyer upload after order',
        };
      }
      const at = stampById[item.id];
      return at ? { ...item, uploadedAt: at } : item;
    }),
  );
  const confirmationRounds = next.confirmationRounds.map((round) => ({
    ...round,
    uploadedAt: confStampByFile.get(round.fileName) ?? round.uploadedAt,
  }));

  return {
    ...next,
    attachments,
    confirmationRounds,
    orderAt: next.orderAt ?? DEMO_TIMELINE.orderAt,
  };
}

export function deleteOrderAttachment(state: DemoState, attachmentId: string): DemoState {
  const target = state.attachments.find((item) => item.id === attachmentId);
  if (!target) return state;
  const attachments = state.attachments.filter((item) => item.id !== attachmentId);

  // 删除当前确认单时，同步清掉谈价归组与确认态
  if (target.kind === 'confirmation' && target.isCurrent) {
    return {
      ...state,
      attachments,
      confirmationUploaded: false,
      confirmationHasRisk: false,
      confirmationRounds: [],
      approvalTriggers: [],
      approvalRequiredByRules: false,
      approvalSubmitted: false,
      approvalDecision: 'none',
      approved: false,
      orderAt: null,
      orderedBy: null,
      expectedArrival: null,
      lines: BASE_LINES.map((line) => ({ ...line })),
    };
  }

  // 删除历史确认单：只从附件与 rounds 移除对应文件
  if (target.kind === 'confirmation') {
    return {
      ...state,
      attachments,
      confirmationRounds: state.confirmationRounds.filter(
        (round) => round.fileName !== target.fileName,
      ),
    };
  }

  return { ...state, attachments };
}

export function appendNegotiationNote(
  state: DemoState,
  note: Omit<NegotiationNote, 'id'>,
): DemoState {
  const current = currentConfirmation(state);
  if (!current) return state;
  const seq = state.messageSeq + 1;
  const nextNote: NegotiationNote = { ...note, id: `neg-${seq}` };
  return {
    ...state,
    messageSeq: seq,
    confirmationRounds: state.confirmationRounds.map((round) => (
      round.id === current.id
        ? { ...round, notes: [...round.notes, nextNote] }
        : round
    )),
  };
}

/** 第二 stage 开场：发送这条需求后生成补货计划 */
export const REPLENISHMENT_INTRO_DRAFT: IntakeDraft = {
  supplier: 'MNP (MESAUDA NAIL PRO)',
  coverageDays: 30,
  objective: 'Cover 1 month of sales after arrival',
  estimatedArrival: '2026-08-21',
  scope: 'Velocity-filtered MNP assortment',
  constraints: 'None',
};

/** 进入 Replenishment 时的空态：尚未发消息、计划未生成 */
export function createReplenishmentIntroState(): DemoState {
  const base = createInitialState();
  return {
    ...base,
    stage: 'replenishment',
    planGenerated: false,
    messages: [],
    draftInput: '',
    intakeDraft: { ...REPLENISHMENT_INTRO_DRAFT },
  };
}

export function createInitialState(): DemoState {
  return {
    stage: 'intake',
    messages: [createOpeningMessage()],
    // 不再预填采购需求：默认引导交给设计问题建议气泡，业务流程仍可手动触发
    draftInput: '',
    documentTitle: null,
    intakeDraft: null,
    planGenerated: false,
    progress: idleProgress(),
    lines: BASE_LINES.map((line) => ({ ...line })),
    confirmationUploaded: false,
    confirmationHasRisk: false,
    exportFormat: null,
    attachments: [],
    confirmationRounds: [],
    approvalTriggers: [],
    approvalRequiredByRules: false,
    approvalSubmitted: false,
    approvalDecision: 'none',
    orderRecorded: false,
    approved: false,
    orderAt: null,
    orderedBy: null,
    expectedArrival: null,
    orderedQty: DEMO_ORDERED_QTY,
    receiptBatches: [],
    currentDdtReady: false,
    awaitingRemainingDecision: false,
    remainingDecision: null,
    receivingComplete: false,
    receivingLines: createEmptyReceivingLines(),
    learningDecision: null,
    messageSeq: 1,
  };
}

export function appendMessages(state: DemoState, messages: Omit<DemoChatMessage, 'id'>[]): DemoState {
  let seq = state.messageSeq;
  const next = messages.map((message) => {
    seq += 1;
    return { ...message, id: `${message.role}-${seq}` };
  });
  return { ...state, messageSeq: seq, messages: [...state.messages, ...next] };
}

/** 在对话流中插入可展开的状态卡（思考/组计划），返回新 state 与卡片 id */
export function appendStatusMessage(
  state: DemoState,
  message: {
    text: string;
    mode: NonNullable<DemoChatMessage['mode']>;
    progress: DemoProgress;
    thinkStep?: number;
  },
): { state: DemoState; id: string } {
  const seq = state.messageSeq + 1;
  const id = `status-${seq}`;
  const card: DemoChatMessage = {
    id,
    role: 'status',
    text: message.text,
    mode: message.mode,
    progress: message.progress,
    thinkStep: message.thinkStep,
  };
  return {
    id,
    state: {
      ...state,
      messageSeq: seq,
      progress: message.progress,
      messages: [...state.messages, card],
    },
  };
}

/** 原地更新对话流中的状态卡（不挪到列表底部） */
export function updateStatusMessage(
  state: DemoState,
  id: string,
  patch: Partial<Pick<DemoChatMessage, 'text' | 'progress' | 'thinkStep'>>,
): DemoState {
  return {
    ...state,
    progress: patch.progress ?? state.progress,
    messages: state.messages.map((message) => (
      message.id === id ? { ...message, ...patch } : message
    )),
  };
}

export function stageStatusOf(current: DemoStageId, id: DemoStageId): StageStatus {
  const order = STAGE_META.map((item) => item.id);
  const currentIndex = order.indexOf(current);
  const index = order.indexOf(id);
  if (index === currentIndex) return 'current';
  if (index < currentIndex) return 'done';
  return 'waiting';
}

/** 对齐生产 PO_STAGES：编辑 → 已下单 → 已入库（含部分到货） */
export type PoProgressKey = 'draft' | 'ordered' | 'partial' | 'received';

export function poProgressOf(state: DemoState): PoProgressKey {
  if (state.receivingComplete || state.stage === 'retrospective') return 'received';
  // 有已确认批次或已入库数量 → 部分到货
  if (
    state.orderRecorded
    && (state.receiptBatches.length > 0 || state.receivingLines.some((line) => line.stocked > 0))
  ) {
    return 'partial';
  }
  if (state.orderRecorded) return 'ordered';
  return 'draft';
}

export function goodsTotal(lines: DemoLine[]) {
  return lines.reduce((sum, line) => sum + line.qty * (line.confirmedPrice ?? line.estimatedPrice), 0);
}

export function hasUnresolvedHold(lines: ReceivingLine[]) {
  return lines.some((line) => line.disposition === 'hold');
}

export function promptHasCoverage(prompt: string) {
  const lower = prompt.toLowerCase();
  return (
    lower.includes('30')
    || lower.includes('60')
    || lower.includes('month')
    || lower.includes('coverage')
    || lower.includes('days')
  );
}

export function promptMentionsSupplier(prompt: string) {
  const lower = prompt.toLowerCase();
  return lower.includes('mnp') || lower.includes('supplier') || lower.includes('running low');
}

export function isAutoOrderPrompt(prompt: string) {
  const lower = prompt.toLowerCase();
  return (
    lower.includes('place the order')
    || lower.includes('order for me')
    || lower.includes('auto order')
    || lower.includes('send to supplier')
    || lower.includes('just order')
  );
}

export function buildPartialIntake(prompt: string) {
  const lower = prompt.toLowerCase();
  const hasCoverage = promptHasCoverage(prompt);
  const coverageDays = lower.includes('60') || lower.includes('2 month') ? 60 : hasCoverage ? 30 : null;
  return {
    supplier: 'MNP (MESAUDA NAIL PRO)',
    coverageDays,
    objective: lower.includes('running low')
      ? 'Replenish low-stock MNP SKUs'
      : coverageDays
        ? `Cover ${coverageDays} days of sales after arrival`
        : 'Replenish MNP - coverage not set',
    estimatedArrival: coverageDays ? '2026-08-21' : 'Pending coverage',
    scope: 'Velocity-filtered MNP assortment',
    constraints: 'Not confirmed',
  };
}

export function jumpToStage(stage: DemoStageId): DemoState {
  const base = createInitialState();
  switch (stage) {
    case 'intake':
      return base;
    case 'replenishment': {
      const withUser = appendMessages(
        {
          ...base,
          stage: 'replenishment',
          intakeDraft: { ...REPLENISHMENT_INTRO_DRAFT },
          planGenerated: true,
          progress: { status: 'complete', current: null, completed: [...PHASES] },
          lines: BASE_LINES.map((line) => ({ ...line })),
        },
        [{ role: 'user', text: PORTFOLIO_COPY.kickoffPlan }],
      );
      const withStatus = appendStatusMessage(withUser, {
        mode: 'plan',
        text: 'Plan assembly complete',
        progress: { status: 'complete', current: null, completed: [...PHASES] },
      }).state;
      return appendMessages(withStatus, [
        {
          role: 'agent',
          text: 'Draft ready for MNP · 30-day coverage. Quantities come from sales, stock, inbound, and MNP lead-time median. Edit freely - this is not an order.',
        },
      ]);
    }
    case 'approval': {
      // 先记 V2，再记不同的当前 confirmation → 演示谈价「不同才记录」
      const afterV2 = applyConfirmationUpload(
        jumpToStage('replenishment'),
        'MNP_confirmation_V2.pdf',
      );
      const afterV3 = applyConfirmationUpload(afterV2, DEMO_CONFIRMATION_FILE);
      const submitted = {
        ...submitForApproval(afterV3),
        stage: 'approval' as const,
      };
      return appendMessages(submitted, [
        { role: 'user', text: `Uploaded supplier confirmation ${DEMO_CONFIRMATION_FILE}` },
        { role: 'agent', text: PORTFOLIO_COPY.confirmationDiff },
        {
          role: 'agent',
          text: 'Approval activation rules fired (price/qty/missing-extra/new SKU/prepayment). Submitted for approval - open Owner approval when ready to Approve proposal, then Mark as ordered.',
        },
      ]);
    }
    case 'receiving': {
      // 跳转演示：停在「待上传第一批 DDT」；须带上 Mark as ordered 元数据，否则采购单信息为空
      const approved = approveProposal(jumpToStage('approval'));
      const receivingLines = createReceivingLinesFromPo(approved.lines);
      const demoOperator = DEMO_OPERATORS[0];
      // 附件时间线：申请 → 计划 → 确认 → 发票 →（后续 DDT）
      const seeded = ensureOrderedDocumentPack({
        ...approved,
        stage: 'receiving' as const,
        orderRecorded: true,
        orderAt: DEMO_TIMELINE.orderAt,
        orderedBy: `${demoOperator.name} · ${demoOperator.role}`,
        expectedArrival: '2026-08-21',
        orderedQty: orderedQtyOf(receivingLines),
        receiptBatches: [] as ReceiptBatchSnapshot[],
        currentDdtReady: false,
        awaitingRemainingDecision: false,
        remainingDecision: null,
        receivingComplete: false,
        receivingLines,
      });
      return appendMessages(seeded, [
        {
          role: 'agent',
          text: 'PO-2026-0842 is open for goods receipt. Upload DDT, count this arrival, Confirm receipt, then Handle remaining goods if open qty remains.',
        },
      ]);
    }
    case 'retrospective': {
      // 跳转：两批都已确认入库后的复盘
      let mid = jumpToStage('receiving');
      mid = ensureOrderedDocumentPack(applyCurrentBatchDdt(mid));
      mid = {
        ...mid,
        // NEW-024：演示「退回不入库」，不按正常收货进库存 / 复盘销量
        receivingLines: mid.receivingLines.map((line) => (
          line.sku === 'NEW-024' ? { ...line, disposition: 'return' } : line
        )),
      };
      mid = confirmCurrentReceiptBatch(mid);
      mid = applyRemainingGoodsDecision(mid, 'wait_next_batch');
      mid = ensureOrderedDocumentPack(applyCurrentBatchDdt(mid));
      mid = confirmCurrentReceiptBatch(mid);
      return appendMessages(
        ensureOrderedDocumentPack({
          ...mid,
          stage: 'retrospective',
          learningDecision: 'pending',
          receivingComplete: true,
        }),
        [
          {
            role: 'agent',
            text: 'PO is fully received. Full order is on the canvas - tap Review this order and we’ll start with forecast questions (over/under order, arrival vs ETA) before any candidates.',
          },
        ],
      );
    }
    default:
      return base;
  }
}
