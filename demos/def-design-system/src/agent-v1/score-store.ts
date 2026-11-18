import { useSyncExternalStore } from 'react';

/**
 * V1 · 模型评估：采购准确率跟着供应商走。
 * - 每张收完货的单都要 review：比较计划量和这段时间真正需要的量，得出这张单的准确率。
 * - 供应商的准确率 = 最近 6 张已 review 单的加权平均（越近权重越大）；跳过的单不计入。
 * - 可信度看数据够不够：已 review 的单数、下单频率、销量历史月数。下单少、历史短的供应商，分数波动大、可信度低。
 * - 某供应商最近一张已收货的单还没 review 时，给它新建采购单前先提示 review（可以跳过）。
 */

export type Confidence = 'high' | 'medium' | 'low' | 'none';
export type SupplierScore = {
  id: string; name: string;
  /** 最近已 review 单的准确率，从旧到新 */
  history: { po: string; score: number }[];
  /** 下单频率（天） */
  everyDays: number;
  /** 销量历史（月） */
  salesMonths: number;
  /** 已收货、还没 review 的单 */
  pending: string[];
  skipped: number;
};

const WEIGHTS = [1, 1, 1.5, 1.5, 2, 2.5];
export function scoreOf(s: SupplierScore) {
  const h = s.history.slice(-6);
  if (!h.length) return null;
  const w = WEIGHTS.slice(-h.length);
  return Math.round(h.reduce((a, x, i) => a + x.score * w[i], 0) / w.reduce((a, b) => a + b, 0));
}
export function confidenceOf(s: SupplierScore): Confidence {
  const n = s.history.length;
  if (n === 0) return 'none';
  if (n >= 5 && s.salesMonths >= 12) return 'high';
  if (n >= 3 && s.salesMonths >= 6) return 'medium';
  return 'low';
}
export const CONFIDENCE: Record<Confidence, { label: string; dots: number; tone: string; note: string }> = {
  high: { label: 'High confidence', dots: 3, tone: 'var(--success)', note: 'Enough reviewed orders and sales history for a stable score.' },
  medium: { label: 'Medium confidence', dots: 2, tone: 'var(--warning)', note: 'A few more reviewed orders will steady the score.' },
  low: { label: 'Low confidence', dots: 1, tone: 'var(--destructive)', note: 'Few reviewed orders: one review can move the score a lot.' },
  none: { label: 'No score yet', dots: 0, tone: 'var(--border)', note: 'Review a received order to start scoring this supplier.' },
};

const seed: Record<string, SupplierScore> = {
  mnp: { id: 'mnp', name: 'MNP', everyDays: 21, salesMonths: 18, skipped: 0, pending: ['PO-2026-0838'],
    history: [{ po: 'PO-2026-0771', score: 78 }, { po: 'PO-2026-0784', score: 80 }, { po: 'PO-2026-0797', score: 76 }, { po: 'PO-2026-0809', score: 84 }, { po: 'PO-2026-0816', score: 85 }, { po: 'PO-2026-0827', score: 79 }] },
  moroccanoil: { id: 'moroccanoil', name: 'Moroccanoil', everyDays: 60, salesMonths: 7, skipped: 1, pending: [],
    history: [{ po: 'PO-2026-0702', score: 69 }, { po: 'PO-2026-0790', score: 79 }] },
  keune: { id: 'keune', name: 'Keune', everyDays: 42, salesMonths: 11, skipped: 0, pending: [],
    history: [{ po: 'PO-2026-0733', score: 74 }, { po: 'PO-2026-0768', score: 77 }, { po: 'PO-2026-0795', score: 81 }, { po: 'PO-2026-0821', score: 80 }] },
  davines: { id: 'davines', name: 'Davines', everyDays: 35, salesMonths: 14, skipped: 0, pending: [],
    history: [{ po: 'PO-2026-0760', score: 75 }, { po: 'PO-2026-0788', score: 79 }, { po: 'PO-2026-0812', score: 77 }] },
  loreal: { id: 'loreal', name: 'L’Oréal', everyDays: 28, salesMonths: 24, skipped: 0, pending: [],
    history: [{ po: 'PO-2026-0744', score: 86 }, { po: 'PO-2026-0763', score: 89 }, { po: 'PO-2026-0779', score: 87 }, { po: 'PO-2026-0802', score: 90 }, { po: 'PO-2026-0818', score: 88 }] },
  olaplex: { id: 'olaplex', name: 'Olaplex', everyDays: 90, salesMonths: 4, skipped: 0, pending: [], history: [] },
  schwarzkopf: { id: 'schwarzkopf', name: 'Schwarzkopf', everyDays: 45, salesMonths: 9, skipped: 0, pending: [], history: [{ po: 'PO-2026-0751', score: 83 }, { po: 'PO-2026-0792', score: 86 }, { po: 'PO-2026-0815', score: 85 }] },
  wella: { id: 'wella', name: 'Wella', everyDays: 30, salesMonths: 16, skipped: 2, pending: [], history: [{ po: 'PO-2026-0758', score: 70 }, { po: 'PO-2026-0786', score: 74 }, { po: 'PO-2026-0805', score: 71 }] },
};

/** 这张单 review 的结果（PO-2026-0838 · MNP），按商品算，缺货的商品不计 */
export const ORDER_REVIEW = {
  po: 'PO-2026-0838', supplier: 'mnp',
  /** 整单 = 1 − 偏差总量 / 需要总量（按件数加权）：1 − 58 / 534 */
  score: 89,
  rows: [
    { label: 'Reinforced bonder', planned: 144, needed: 172, score: 84, note: 'Sold out 6 days early' },
    { label: 'Classic bonder', planned: 108, needed: 101, score: 93, note: 'On plan' },
    { label: 'Color gel', planned: 108, needed: 118, score: 91, note: 'Slightly short' },
    { label: 'Care treatment', planned: 72, needed: 63, score: 86, note: '9 left over' },
    { label: 'Top coat', planned: 84, needed: 80, score: 95, note: 'On plan' },
  ],
  excluded: 'Functional treatment · not supplied, not scored',
};

type State = { suppliers: Record<string, SupplierScore>; review: Record<string, 'done' | 'skipped'>; requestReview: string | null; resume: { supplier: string; days: number } | null };
let state: State = { suppliers: seed, review: {}, requestReview: null, resume: null };
const subs = new Set<() => void>();
const set = (next: Partial<State>) => { state = { ...state, ...next }; subs.forEach((f) => f()); };
export const getScores = () => state;
export function useScores() { return useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, getScores); }

/** 保存 review：这张单进入供应商的历史，供应商分数随之更新 */
export function saveReview(po: string, supplier: string, score: number) {
  const s = state.suppliers[supplier];
  set({ review: { ...state.review, [po]: 'done' }, suppliers: { ...state.suppliers, [supplier]: { ...s, pending: s.pending.filter((x) => x !== po), history: [...s.history, { po, score }] } } });
}
/** 跳过：不计入分数，只记一次跳过 */
export function skipReview(po: string, supplier: string) {
  const s = state.suppliers[supplier];
  set({ review: { ...state.review, [po]: 'skipped' }, suppliers: { ...state.suppliers, [supplier]: { ...s, pending: s.pending.filter((x) => x !== po), skipped: s.skipped + 1 } } });
}
export const requestReview = (po: string | null, resume: State['resume'] = null) => set({ requestReview: po, resume });
export const clearResume = () => set({ resume: null });
export const consumeRequest = () => set({ requestReview: null });
export const SUPPLIER_ID: Record<string, string> = { MNP: 'mnp', Moroccanoil: 'moroccanoil', Keune: 'keune', Davines: 'davines', 'L’Oréal': 'loreal', Olaplex: 'olaplex', Schwarzkopf: 'schwarzkopf', Wella: 'wella' };

/* ───────── 新计划的评分 ─────────
 * 预计准确率 = 供应商历史准确率 + 这张计划自身数据的扣分；区间宽度由可信度决定。
 * 每一项都写明依据，用户能看到分数从哪里来。 */
export type PlanAdjustment = { label: string; detail: string; delta: number };
export const RANGE: Record<Confidence, number> = { high: 4, medium: 7, low: 12, none: 15 };
export function planScore(st: State, sid = 'mnp') {
  const s = st.suppliers[sid];
  const base = scoreOf(s) ?? 70;
  const conf = confidenceOf(s);
  const adjustments: PlanAdjustment[] = [
    { label: 'Stock-outs hide demand', detail: '370102 was out of stock 4 of the last 30 days.', delta: -2 },
    { label: 'Thin sales signal', detail: '400213 sold only 11 pcs in 30 days.', delta: -1 },
    { label: 'Lead time varies', detail: 'Usually 14 days, 19 days on 1 in 10 orders.', delta: -1 },
  ];
  const last = st.review['PO-2026-0838'];
  if (last === 'skipped') adjustments.push({ label: 'Latest outcome missing', detail: 'PO-2026-0838 review was skipped.', delta: -1 });
  const expected = base + adjustments.reduce((a, x) => a + x.delta, 0);
  const r = RANGE[conf];
  return {
    base, conf, expected, low: Math.max(0, expected - r), high: Math.min(100, expected + r), adjustments,
    reviewed: s.history.length, includesLatest: last === 'done',
    strong: '12 of 13 SKUs have a full 30 days of sales and current stock',
  };
}

/** 已保存的这张单的准确率（买手排除一次性需求后可能不同于 Agent 的初算） */
export const savedScore = (st: State, po: string) => Object.values(st.suppliers).flatMap((x) => x.history).find((h) => h.po === po)?.score ?? ORDER_REVIEW.score;
