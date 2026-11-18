/**
 * Agent 版采购的演示数据。沿用原 Procurement Agent 作品集：工作台里的采购单、补货机会、任务、通知，
 * 以及采购单上 Agent 的计划依据、供应商规则和审批检查。Agent 只算数量、比对单据、记录；下单永远由人完成。
 */
import { BASE_LINES, SUPPLIER, type PoLine } from './purchase-data';

export type AgentStatus = 'planning' | 'draft' | 'review' | 'approved' | 'owner' | 'ordered' | 'partial' | 'received';
export const AGENT_STATUS: Record<AgentStatus, { label: string; v: 'secondary' | 'info' | 'warning' | 'success' | 'outline' | 'destructive' }> = {
  planning: { label: 'Planning', v: 'info' },
  draft: { label: 'Draft', v: 'secondary' },
  review: { label: 'Needs review', v: 'warning' },
  owner: { label: 'Waiting for owner', v: 'warning' },
  approved: { label: 'Approved', v: 'info' },
  ordered: { label: 'Ordered', v: 'info' },
  partial: { label: 'Partially received', v: 'warning' },
  received: { label: 'Received', v: 'success' },
};

export type Timing = { level: 'urgent' | 'soon'; label: string; stockDays: number; leadDays: number };
export type AgentPo = { no: string; supplier: string; sub: string; status: AgentStatus; coverage: number; goods: number; updated: string; timing?: Timing; agent?: string };

export const AGENT_POS: AgentPo[] = [
  { no: 'PO-2026-0842', supplier: 'MNP', sub: 'Mesauda Nail Pro', status: 'draft', coverage: 30, goods: 3116.4, updated: '17/11/2026 08:05', timing: { level: 'urgent', label: 'Order now', stockDays: 8, leadDays: 14 }, agent: 'Plan ready · 13 SKUs' },
  { no: 'PO-2026-0841', supplier: 'L’Oréal', sub: 'Professionnel', status: 'review', coverage: 45, goods: 7840, updated: '16/11/2026 16:40', agent: '3 differences on confirmation' },
  { no: 'PO-2026-0840', supplier: 'Wella', sub: 'Professionals', status: 'ordered', coverage: 30, goods: 4620.5, updated: '15/11/2026 09:30', agent: 'Arriving 24/11' },
  { no: 'PO-2026-0839', supplier: 'Schwarzkopf', sub: 'Professional', status: 'partial', coverage: 60, goods: 5896.2, updated: '14/11/2026 14:20', agent: '42 pcs still open' },
  { no: 'PO-2026-0838', supplier: 'MNP', sub: 'Mesauda Nail Pro', status: 'received', coverage: 30, goods: 2350.8, updated: '13/11/2026 11:10', agent: 'Ready for review' },
  { no: 'PO-2026-0837', supplier: 'Davines', sub: 'Essential Haircare', status: 'draft', coverage: 45, goods: 2180, updated: '12/11/2026 10:20', timing: { level: 'soon', label: 'Order by 20/11', stockDays: 17, leadDays: 14 }, agent: 'Forecast running' },
  { no: 'PO-2026-0836', supplier: 'Olaplex', sub: 'Professional', status: 'draft', coverage: 30, goods: 1640, updated: '11/11/2026 15:10' },
];

export type Opportunity = { id: string; supplier: string; sub: string; timing: Timing; goods: number; coverage: number; skus: number; minOrder: number; freeFrom: number; shipping: number; leadDays: number; why: string };
export const OPPORTUNITIES: Opportunity[] = [
  { id: 'mnp', supplier: 'MNP', sub: 'Mesauda Nail Pro', timing: { level: 'urgent', label: 'Order now', stockDays: 8, leadDays: 14 }, goods: 3116.4, coverage: 30, skus: 13, minOrder: 1500, freeFrom: 2000, shipping: 45, leadDays: 14,
    why: 'Bonders sell faster than stock lasts: 8 days left against a 14-day lead time. The proposed lines cover 30 days of sales after arrival and pass the free-shipping threshold.' },
  { id: 'moroccanoil', supplier: 'Moroccanoil', sub: 'Professional', timing: { level: 'soon', label: 'Order by 25/11', stockDays: 24, leadDays: 21 }, goods: 1872, coverage: 30, skus: 7, minOrder: 1200, freeFrom: 2500, shipping: 35, leadDays: 21,
    why: 'Treatment oils run out in 24 days and the supplier needs 21. Ordering by 25/11 avoids a gap; the estimate is below free shipping, so €35 is added.' },
  { id: 'keune', supplier: 'Keune', sub: 'Haircare', timing: { level: 'soon', label: 'Order by 02/12', stockDays: 31, leadDays: 18 }, goods: 1340.6, coverage: 45, skus: 9, minOrder: 1000, freeFrom: 1500, shipping: 30, leadDays: 18,
    why: 'Colour developers are trending up 18% this month. A 45-day order keeps salons covered through the December peak.' },
];

export type Task = { id: string; title: string; supplier: string; po: string; status: 'running' | 'paused' | 'done'; detail: string; output: string[] };
export const TASKS: Task[] = [
  { id: 't1', title: 'Prepare replenishment forecast', supplier: 'Davines', po: 'PO-2026-0837', status: 'running', detail: 'Comparing sales trends with available stock.', output: ['45-day sales coverage prepared.', 'Estimated goods: €2,180.00.'] },
  { id: 't2', title: 'Compare supplier confirmation', supplier: 'L’Oréal', po: 'PO-2026-0841', status: 'paused', detail: 'Paused before checking the revised confirmation.', output: [] },
  { id: 't3', title: 'Summarize receiving', supplier: 'MNP', po: 'PO-2026-0838', status: 'done', detail: 'Receiving summary is ready.', output: ['All goods received.', 'No outstanding deliveries for this order.'] },
];

export type Notice = { id: string; supplier: string; po?: string; title: string; detail: string; source: string; action: string; at: string };
export const NOTICES: Notice[] = [
  { id: 'n1', supplier: 'L’Oréal', po: 'PO-2026-0841', title: 'Confirmation needs review', detail: '3 differences: 1 missing item, 1 quantity change, 1 price change.', source: 'Supplier confirmation · 26LOR00418.pdf', action: 'Review order', at: '09:12' },
  { id: 'n2', supplier: 'MNP', title: 'Stock coverage is low', detail: '13 SKUs · 8 days of stock · 14-day lead time.', source: 'Stock, 30-day sales and supplier lead time', action: 'Create purchase order', at: '08:00' },
  { id: 'n3', supplier: 'Wella', po: 'PO-2026-0840', title: 'Delivery follow-up', detail: 'Expected 24/11. No DDT recorded yet.', source: 'Recorded ETA and received quantities', action: 'Open order', at: 'Yesterday' },
];

/* ───────── 采购单上的 Agent ───────── */
export const PLAN_STEPS = ['Understand demand', 'Validate data', 'Calculate quantities', 'Assemble draft'];
export const PLAN_STEP_DETAIL = ['30-day sales · 13 SKUs', 'Stock snapshot 08:00 · rules R03', 'Coverage after a 14-day lead time', 'Rounded to supplier pack sizes'];

/** 每一行为什么是这个数：日销 × (覆盖天数 + 交期) − 现有库存，按 12 支一箱取整 */
export function rationale(l: PoLine, coverage = 30) {
  const daily = l.sales30 / 30;
  const need = Math.max(0, Math.round(daily * (coverage + SUPPLIER_RULES.leadDays) - l.stock));
  return { daily, need, text: `${l.sales30} sold / 30 d · ${l.stock} in stock`, calc: `${daily.toFixed(1)}/day × ${coverage + SUPPLIER_RULES.leadDays} d − ${l.stock} stock = ${need} → ${l.plannedQty}` };
}

export const SUPPLIER_RULES = {
  version: 'R03', validUntil: '31/12/2026', source: 'MNP price list 2026 · confirmed by email 02/09',
  leadDays: 14, leadP90: 19,
  groups: [
    { title: 'Supplier', rows: [['Name', SUPPLIER.name], ['Contact', SUPPLIER.contact], ['Country', 'Italy · documents in Italian']] },
    { title: 'Ordering & delivery', rows: [['Minimum order', '€1,500.00'], ['Free shipping from', '€2,000.00'], ['Shipping below threshold', '€45.00'], ['Typical lead time', '14 days'], ['P90 lead time', '19 days']] },
    { title: 'Payment', rows: [['Method', 'Bank transfer'], ['Terms', '30 days'], ['Early payment', '2% within 10 days'], ['Volume discount', '3% above €3,000']] },
  ] as { title: string; rows: [string, string][] }[],
};

export const EVIDENCE = [
  { title: 'Sales history', detail: 'Last 30 days by SKU, used for daily demand.', meta: '13 SKUs · 429 pcs sold' },
  { title: 'Stock snapshot', detail: 'Available stock for every line on this plan.', meta: 'Today 08:00' },
  { title: 'Supplier rules', detail: 'Lead time, minimum order, shipping and payment.', meta: 'MNP · R03' },
  { title: 'Purchase request', detail: 'Cover 30 days of sales after arrival.', meta: 'Requested by Giulia Rossi' },
];

export const APPROVAL_CHECKS = [
  { label: 'Confirmed qty differs from plan', evidence: '370102 96→90', fired: true },
  { label: 'Price change vs estimate', evidence: '420106 €7.10→€7.90', fired: true },
  { label: 'Missing / extra SKUs', evidence: 'Missing 400213, 400214 · extra 880104, NEW-024', fired: true },
  { label: 'Prepayment terms', evidence: 'Bonifico anticipato on the confirmation', fired: true },
  { label: 'Order value above €5,000', evidence: 'Goods €3,020.40', fired: false },
];

export const PLAN_LINES = BASE_LINES;
