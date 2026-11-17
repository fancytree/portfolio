/** Dashboard 演示数据：逐字取自真实 ERP 的作品集演示页
 *  （def-platform/web/src/pages/portfolio/dashboard/*Showcase*.tsx 与 showcaseShared.tsx），
 *  生成函数原样保留，保证数字与线上演示一致。 */

export type Range = '1D' | '7D' | '1M' | '3M' | '1Y';
export const RANGES: Range[] = ['1D', '7D', '1M', '3M', '1Y'];
export const RANGE_LABELS: Record<Range, string> = { '1D': 'Today', '7D': 'Last 7 days', '1M': 'Last 30 days', '3M': '3 months (weekly)', '1Y': '1 year (monthly)' };

/* ───────── sales series generators (showcaseShared.tsx) ───────── */
type SalesPoint = { date: string; value: number };
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const scale = (raw: number[], total: number) => { const k = total / raw.reduce((s, v) => s + v, 0); return raw.map((v) => v * k); };

function intraday(count: number, total: number): SalesPoint[] {
  const raw = Array.from({ length: count }, (_, hour) => {
    const morningRamp = Math.max(0, Math.sin((hour - 7) * 0.28));
    const afternoonPeak = Math.max(0, Math.sin((hour - 12) * 0.22));
    const noise = 1 + Math.sin(hour * 5.7) * 0.08 + Math.cos(hour * 1.9) * 0.04;
    return (0.18 + morningRamp * 0.42 + afternoonPeak * 0.5) * noise;
  });
  return scale(raw, total).map((value, i) => ({ date: `${String(i).padStart(2, '0')}:00`, value }));
}
function daily(count: number, startDate: string, total: number): SalesPoint[] {
  const start = new Date(`${startDate}T00:00:00Z`);
  const dates = Array.from({ length: count }, (_, i) => { const d = new Date(start); d.setUTCDate(start.getUTCDate() + i); return d; });
  const raw = dates.map((date, i) => {
    const wd = date.getUTCDay();
    const f = wd === 0 ? 0.86 : wd === 6 ? 0.92 : 1.04;
    const noise = 1 + Math.sin(i * 7.31) * 0.035 + Math.cos(i * 2.17) * 0.02;
    const trend = 0.92 + (i / Math.max(1, count - 1)) * 0.16;
    return f * noise * trend;
  });
  return scale(raw, total).map((value, i) => ({ date: `${MONTH_NAMES[dates[i].getUTCMonth()]} ${dates[i].getUTCDate()}`, value }));
}
function weekly(count: number, startDate: string, total: number): SalesPoint[] {
  const start = new Date(`${startDate}T00:00:00Z`);
  const dates = Array.from({ length: count }, (_, i) => { const d = new Date(start); d.setUTCDate(start.getUTCDate() + i * 7); return d; });
  const raw = dates.map((date, i) => {
    const augustDip = date.getUTCMonth() === 7 ? 0.78 : 1;
    const trend = 0.94 + (i / Math.max(1, count - 1)) * 0.14;
    const noise = 1 + Math.sin(i * 1.7) * 0.06 + Math.cos(i * 0.9) * 0.04;
    return augustDip * trend * noise;
  });
  return scale(raw, total).map((value, i) => ({ date: `${MONTH_NAMES[dates[i].getUTCMonth()]} ${dates[i].getUTCDate()}`, value }));
}
function monthly(count: number, startDate: string, total: number): SalesPoint[] {
  const start = new Date(`${startDate}T00:00:00Z`);
  const season = [0.88, 0.92, 1.02, 1.06, 1.08, 1.04, 0.9, 0.72, 1.05, 1.08, 1.12, 0.95];
  const dates = Array.from({ length: count }, (_, i) => { const d = new Date(start); d.setUTCMonth(start.getUTCMonth() + i, 1); return d; });
  const raw = dates.map((date, i) => season[date.getUTCMonth()] * (0.96 + (i / Math.max(1, count - 1)) * 0.12) * (1 + Math.sin(i * 2.1) * 0.03));
  return scale(raw, total).map((value, i) => ({ date: `${MONTH_NAMES[dates[i].getUTCMonth()]} ${String(dates[i].getUTCFullYear()).slice(2)}`, value }));
}
/** 与线上一致：每个点的退货按 3.2%–7% 扣除，得到净额。 */
function attach(points: SalesPoint[]) {
  return points.map((p, i) => {
    const returns = p.value * (0.032 + Math.abs(Math.sin(i * 1.73)) * 0.038);
    return { label: p.date, sales: p.value, returns, net: Math.max(0, p.value - returns) };
  });
}
export const SALES_RANGES: Record<Range, ReturnType<typeof attach>> = {
  '1D': attach(intraday(24, 14420)),
  '7D': attach(daily(7, '2026-08-30', 331040)),
  '1M': attach(daily(30, '2026-08-07', 291040)),
  '3M': attach(weekly(13, '2026-06-08', 816840)),
  '1Y': attach(monthly(12, '2025-10-01', 3425000)),
};
export const SALES_NET_30D = SALES_RANGES['1M'].map((p) => p.net);

export function buildMetricSeries(count: number, total: number, drift: number, seed = 1): number[] {
  const raw = Array.from({ length: count }, (_, i) => {
    const wd = (i + seed) % 7;
    const f = wd === 0 ? 0.84 : wd === 6 ? 0.9 : 1.05;
    const noise = 1 + Math.sin((i + seed) * 7.31) * 0.06 + Math.cos((i + seed) * 2.17) * 0.035;
    const trend = 1 - drift / 2 + (i / Math.max(1, count - 1)) * drift;
    return Math.max(0.05, f * noise * trend);
  });
  return scale(raw, total);
}

/* ───────── categories ───────── */
export const TYPE_COLOR: Record<string, string> = { 'Nail salon': 'var(--viz-1)', 'Beauty salon': 'var(--viz-2)', 'Massage studio': 'var(--viz-3)', 'Hair salon': 'var(--viz-4)', Other: 'var(--viz-other)' };
export const SOURCE_COLOR: Record<string, string> = { WeChat: 'var(--viz-1)', 'Walk-in': 'var(--viz-2)', Referral: 'var(--viz-3)', Rednote: 'var(--viz-4)', TikTok: 'var(--viz-5)', Other: 'var(--viz-other)' };
export const PAY_COLOR: Record<string, string> = { 'Bank transfer': 'var(--viz-1)', Cash: 'var(--viz-2)', Card: 'var(--viz-3)', 'WeChat Pay': 'var(--viz-4)', Check: 'var(--viz-5)', Other: 'var(--viz-other)' };

export type Mix = { label: string; value: number; count: number; amount?: number };
function mixRanges(rows: Record<string, Array<[number, number]>>): Record<Range, Mix[]> {
  const labels = Object.keys(rows);
  const pick = (k: number) => labels.map((label) => ({ label, value: rows[label][k][0], count: rows[label][k][1] }));
  return { '1D': pick(0), '7D': pick(1), '1M': pick(2), '3M': pick(3), '1Y': pick(4) };
}
export const CUSTOMER_TYPE_RANGES = mixRanges({
  'Nail salon': [[36, 4], [35, 18], [35, 70], [33, 176], [32, 656]],
  'Beauty salon': [[27, 3], [27, 14], [27, 54], [28, 149], [26, 533]],
  'Massage studio': [[18, 2], [18, 9], [18, 36], [19, 101], [20, 410]],
  'Hair salon': [[9, 1], [12, 6], [12, 24], [13, 69], [14, 287]],
  Other: [[10, 1], [8, 4], [8, 16], [7, 37], [8, 164]],
});
export const CUSTOMER_SOURCE_RANGES = mixRanges({
  WeChat: [[30, 3], [28, 14], [30, 60], [34, 181], [36, 738]],
  'Walk-in': [[20, 2], [26, 13], [22, 44], [20, 106], [18, 369]],
  Referral: [[20, 2], [16, 8], [15, 30], [14, 74], [14, 287]],
  Rednote: [[10, 1], [12, 6], [13, 26], [14, 74], [15, 308]],
  TikTok: [[10, 1], [12, 6], [12, 24], [12, 64], [12, 246]],
  Other: [[10, 1], [6, 3], [8, 16], [6, 32], [5, 102]],
});
const pm = (rows: [number, number, number][]): Mix[] => ['Bank transfer', 'Cash', 'Card', 'WeChat Pay', 'Check', 'Other'].map((label, i) => ({ label, value: rows[i][0], amount: rows[i][1], count: rows[i][2] }));
export const PAYMENT_METHOD_RANGES: Record<Range, Mix[]> = {
  '1D': pm([[41, 2840, 1], [24, 1680, 4], [9, 640, 1], [14, 980, 3], [8, 560, 1], [3, 180, 1]]),
  '7D': pm([[48, 12400, 8], [19, 4860, 14], [12, 3120, 7], [11, 2940, 11], [7, 1860, 2], [3, 840, 2]]),
  '1M': pm([[51, 42800, 31], [15, 12400, 36], [12, 9860, 22], [10, 8240, 28], [9, 7620, 6], [3, 3280, 5]]),
  '3M': pm([[50, 118400, 86], [15, 36200, 104], [12, 28400, 61], [10, 24600, 82], [9, 21400, 17], [4, 9680, 14]]),
  '1Y': pm([[47, 428000, 310], [16, 148800, 412], [12, 112400, 248], [11, 98600, 336], [9, 86400, 68], [4, 39200, 58]]),
};

/* ───────── admin (DashboardShowcasePage.tsx) ───────── */
export const CUSTOMERS = [
  { name: 'Bellezza Milano', source: 'WeChat', tag: 'Nail salon', orders: 18, amount: '€28,420.00', date: 'Sep 4, 2026' },
  { name: 'Luce Beauty Lab', source: 'Walk-in', tag: 'Massage studio', orders: 14, amount: '€21,180.50', date: 'Sep 3, 2026' },
  { name: 'Studio Forma', source: 'Referral', tag: 'Beauty salon', orders: 12, amount: '€18,742.00', date: 'Sep 2, 2026' },
  { name: 'Casa Cosmetica', source: 'WeChat', tag: 'Nail salon', orders: 11, amount: '€15,970.00', date: 'Sep 1, 2026' },
  { name: 'Bella Roma', source: 'Walk-in', tag: 'Hair salon', orders: 9, amount: '€13,640.00', date: 'Aug 31, 2026' },
  { name: 'Nuova Forma', source: 'Referral', tag: 'Massage studio', orders: 8, amount: '€11,280.00', date: 'Aug 30, 2026' },
  { name: 'Essenza Lab', source: 'WeChat', tag: 'Beauty salon', orders: 7, amount: '€9,860.00', date: 'Aug 29, 2026' },
  { name: 'Vita Beauty', source: 'Walk-in', tag: 'Nail salon', orders: 6, amount: '€8,420.00', date: 'Aug 28, 2026' },
  { name: 'Aria Studio', source: 'Referral', tag: 'Massage studio', orders: 5, amount: '€7,680.00', date: 'Aug 27, 2026' },
  { name: 'Linea Hair', source: 'WeChat', tag: 'Hair salon', orders: 4, amount: '€6,940.00', date: 'Aug 26, 2026' },
];
export const NEW_CUSTOMERS = [
  { name: 'Atelier Bellezza', source: 'WeChat', tag: 'Nail salon', orders: 2, amount: '€4,280.00', date: 'Sep 5, 2026' },
  { name: 'Nativa Studio', source: 'Walk-in', tag: 'Massage studio', orders: 2, amount: '€2,940.00', date: 'Sep 4, 2026' },
  { name: 'Luna Cosmetics', source: 'Referral', tag: 'Beauty salon', orders: 1, amount: '€1,860.00', date: 'Sep 3, 2026' },
  { name: 'Verde Beauty', source: 'Rednote', tag: 'Hair salon', orders: 1, amount: '€1,640.00', date: 'Sep 3, 2026' },
  { name: 'Mia Hair Studio', source: 'TikTok', tag: 'Hair salon', orders: 1, amount: '€1,280.00', date: 'Sep 2, 2026' },
  { name: 'Bloom Cosmetics', source: 'Rednote', tag: 'Nail salon', orders: 1, amount: '€980.00', date: 'Sep 2, 2026' },
  { name: 'Rosa Beauty Lab', source: 'TikTok', tag: 'Beauty salon', orders: 1, amount: '€760.00', date: 'Sep 1, 2026' },
  { name: 'Viva Nails', source: 'Rednote', tag: 'Nail salon', orders: 1, amount: '€680.00', date: 'Aug 31, 2026' },
  { name: 'Sole Massage', source: 'Walk-in', tag: 'Massage studio', orders: 1, amount: '€540.00', date: 'Aug 30, 2026' },
  { name: 'Mondo Beauty', source: 'TikTok', tag: 'Beauty salon', orders: 1, amount: '€420.00', date: 'Aug 29, 2026' },
];
const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=96&h=96&fit=crop`;
export const PRODUCT_RANKING = [
  { name: 'Young Color 7.1', sku: 'DEF-431015', sold: 186, profit: 3420, returns: 8, image: img('1596462502278-27bfdc403348') },
  { name: 'Classic bonder 8 ml', sku: 'DEF-370102', sold: 142, profit: 2684, returns: 5, image: img('1556228578-8c89e6adf883') },
  { name: 'After wax lotion', sku: 'DEF-510002', sold: 118, profit: 1740, returns: 12, image: img('1608248543803-ba4f8c70ae0b') },
  { name: 'Keratin repair mask', sku: 'DEF-290114', sold: 96, profit: 1960, returns: 4, image: img('1571781926291-c477ebfd024b') },
  { name: 'Color lock shampoo', sku: 'DEF-431022', sold: 88, profit: 1520, returns: 3, image: img('1522335789203-aabd1fc54bc9') },
  { name: 'Cuticle oil 15 ml', sku: 'DEF-370118', sold: 74, profit: 1180, returns: 2, image: img('1512496015851-a90fb38ba796') },
  { name: 'Nourishing cream', sku: 'DEF-510014', sold: 61, profit: 980, returns: 6, image: img('1556228720-195a672e8a03') },
  { name: 'Scalp serum', sku: 'DEF-290128', sold: 54, profit: 860, returns: 1, image: img('1571875257727-256c39da42af') },
  { name: 'Hand lotion', sku: 'DEF-510021', sold: 47, profit: 640, returns: 3, image: img('1608248597279-f99d160bfcbc') },
  { name: 'Nail primer', sku: 'DEF-370124', sold: 39, profit: 520, returns: 2, image: img('1596462502278-27bfdc403348') },
];
export const ORDERS_30D = buildMetricSeries(30, 128, -0.22, 3);
export const NEW_CUSTOMERS_30D = buildMetricSeries(30, 24, 0.45, 7);

/* ───────── sales (SalesDashboardShowcase.tsx) ───────── */
export const ORDER_STATUS: Record<string, { label: string; tone: 'warning' | 'info' | 'success' | 'secondary' | 'destructive' }> = {
  unshipped: { label: 'Unshipped', tone: 'warning' }, partial: { label: 'Partial', tone: 'info' }, picked_up: { label: 'Picked up', tone: 'success' }, shipped: { label: 'Shipped', tone: 'secondary' }, cancelled: { label: 'Cancelled', tone: 'destructive' },
};
export const ORDER_SOURCE: Record<string, string> = { mall: 'WeChat mall', 'walk-in': 'Walk-in', manual: 'Manual' };
export const SALES_ORDERS = [
  { no: 'OUT-2026-001261', customer: 'Luce Beauty Lab', source: 'mall', amount: '€1,280.00', status: 'unshipped', time: 'Sep 6, 14:28' },
  { no: 'OUT-2026-001248', customer: 'Bellezza Milano', source: 'manual', amount: '€3,420.00', status: 'shipped', time: 'Sep 5, 16:40' },
  { no: 'OUT-2026-001247', customer: 'Studio Forma', source: 'walk-in', amount: '€2,180.00', status: 'picked_up', time: 'Sep 5, 15:12' },
  { no: 'OUT-2026-001246', customer: 'Casa Cosmetica', source: 'mall', amount: '€1,860.00', status: 'partial', time: 'Sep 4, 18:05' },
  { no: 'OUT-2026-001245', customer: 'Bella Roma', source: 'walk-in', amount: '€2,640.00', status: 'picked_up', time: 'Sep 4, 11:47' },
  { no: 'OUT-2026-001244', customer: 'Nuova Forma', source: 'manual', amount: '€980.00', status: 'partial', time: 'Sep 3, 17:22' },
  { no: 'OUT-2026-001243', customer: 'Essenza Lab', source: 'mall', amount: '€1,540.00', status: 'picked_up', time: 'Sep 3, 10:08' },
  { no: 'OUT-2026-001242', customer: 'Vita Beauty', source: 'manual', amount: '€2,210.00', status: 'cancelled', time: 'Sep 2, 16:55' },
  { no: 'OUT-2026-001241', customer: 'Aria Studio', source: 'walk-in', amount: '€1,760.00', status: 'partial', time: 'Sep 2, 09:31' },
  { no: 'OUT-2026-001236', customer: 'Studio Forma', source: 'mall', amount: '€3,180.00', status: 'picked_up', time: 'Sep 1, 14:16' },
];
export const OUTSTANDING_CUSTOMERS = [
  { name: 'Bellezza Milano', tag: 'Nail salon', amount: '€8,420.00' },
  { name: 'Luce Beauty Lab', tag: 'Massage studio', amount: '€6,180.50' },
  { name: 'Studio Forma', tag: 'Beauty salon', amount: '€4,742.00' },
  { name: 'Casa Cosmetica', tag: 'Nail salon', amount: '€3,970.00' },
  { name: 'Bella Roma', tag: 'Hair salon', amount: '€2,640.00' },
  { name: 'Nuova Forma', tag: 'Massage studio', amount: '€1,280.00' },
  { name: 'Essenza Lab', tag: 'Beauty salon', amount: '€1,120.00' },
  { name: 'Vita Beauty', tag: 'Nail salon', amount: '€980.00' },
  { name: 'Aria Studio', tag: 'Massage studio', amount: '€760.00' },
  { name: 'Linea Hair', tag: 'Hair salon', amount: '€540.00' },
];

/* ───────── finance (FinanceDashboardShowcase.tsx) ───────── */
export const INVOICES_TO_ISSUE = [
  { no: 'OUT-2026-001248', customer: 'Luce Beauty Lab', amount: '€3,420.00', status: 'ready', shipped: 'Sep 5, 16:40' },
  { no: 'OUT-2026-001245', customer: 'Bella Roma', amount: '€2,640.00', status: 'ready', shipped: 'Sep 4, 11:47' },
  { no: 'OUT-2026-001243', customer: 'Essenza Lab', amount: '€1,540.00', status: 'partial', shipped: 'Sep 3, 10:08' },
  { no: 'OUT-2026-001236', customer: 'Studio Forma', amount: '€3,180.00', status: 'ready', shipped: 'Sep 1, 14:16' },
  { no: 'OUT-2026-001232', customer: 'Casa Cosmetica', amount: '€1,860.00', status: 'ready', shipped: 'Aug 31, 17:22' },
  { no: 'OUT-2026-001228', customer: 'Bellezza Milano', amount: '€4,120.00', status: 'partial', shipped: 'Aug 30, 15:05' },
  { no: 'OUT-2026-001221', customer: 'Nuova Forma', amount: '€980.00', status: 'ready', shipped: 'Aug 29, 12:18' },
  { no: 'OUT-2026-001218', customer: 'Vita Beauty', amount: '€2,210.00', status: 'ready', shipped: 'Aug 28, 16:55' },
  { no: 'OUT-2026-001214', customer: 'Aria Studio', amount: '€1,760.00', status: 'ready', shipped: 'Aug 27, 09:31' },
];
export const INVOICE_STATUS: Record<string, { label: string; tone: 'warning' | 'info' }> = { ready: { label: 'To issue', tone: 'warning' }, partial: { label: 'Partial', tone: 'info' } };
export const PAYMENT_APPROVALS: { name: string; method: 'Bank transfer' | 'Check' | 'Post office'; amount: string; time: string }[] = [
  { name: 'Bellezza Milano', method: 'Bank transfer', amount: '€2,840.00', time: 'Sep 6, 14:22' },
  { name: 'Casa Cosmetica', method: 'Check', amount: '€1,560.00', time: 'Sep 6, 11:08' },
  { name: 'Studio Forma', method: 'Bank transfer', amount: '€980.00', time: 'Sep 5, 18:40' },
  { name: 'Luce Beauty Lab', method: 'Post office', amount: '€640.00', time: 'Sep 5, 10:15' },
  { name: 'Bella Roma', method: 'Check', amount: '€1,280.00', time: 'Sep 5, 09:42' },
  { name: 'Essenza Lab', method: 'Bank transfer', amount: '€2,160.00', time: 'Sep 4, 17:18' },
  { name: 'Nuova Forma', method: 'Post office', amount: '€420.00', time: 'Sep 4, 15:06' },
  { name: 'Vita Beauty', method: 'Bank transfer', amount: '€1,740.00', time: 'Sep 4, 11:30' },
  { name: 'Aria Studio', method: 'Check', amount: '€860.00', time: 'Sep 3, 16:55' },
];
export const OVERDUE = [
  { name: 'Bellezza Milano', tag: 'Nail salon', amount: '€8,420.00', due: 'Aug 20, 2026' },
  { name: 'Luce Beauty Lab', tag: 'Massage studio', amount: '€6,180.50', due: 'Aug 24, 2026' },
  { name: 'Studio Forma', tag: 'Beauty salon', amount: '€4,742.00', due: 'Aug 28, 2026' },
  { name: 'Casa Cosmetica', tag: 'Nail salon', amount: '€3,970.00', due: 'Aug 30, 2026' },
  { name: 'Bella Roma', tag: 'Hair salon', amount: '€2,640.00', due: 'Sep 1, 2026' },
];
export const COLLECTED_24H = buildMetricSeries(24, 6480, 0.3, 5);
export const EXPENSES_30D = buildMetricSeries(30, 3120, -0.14, 11);

/* ───────── warehouse (WarehouseDashboardShowcase.tsx) ───────── */
export type RushLine = { id: string; name: string; spec: string; qty: number; unit: 'CF' | 'SC'; location: string; image: string };
const rush = (no: string, items: Omit<RushLine, 'id'>[]) => items.map((i) => ({ ...i, id: `${no}-${i.name}` }));
export const RUSH_ITEMS: RushLine[] = [
  ...rush('OUT-2026-001261', [
    { name: 'Young Color 7.1', spec: 'Ash blonde 7.1 · 60 ml', qty: 4, unit: 'SC', location: 'A-12', image: img('1596462502278-27bfdc403348') },
    { name: 'Color lock shampoo', spec: 'Color care · 250 ml', qty: 3, unit: 'SC', location: 'A-14', image: img('1522335789203-aabd1fc54bc9') },
    { name: 'Keratin repair mask', spec: 'Repair · 200 ml', qty: 2, unit: 'SC', location: 'B-03', image: img('1571781926291-c477ebfd024b') }]),
  ...rush('OUT-2026-001258', [
    { name: 'Classic bonder 8 ml', spec: 'Bond builder · 8 ml', qty: 6, unit: 'CF', location: 'C-08', image: img('1556228578-8c89e6adf883') },
    { name: 'Cuticle oil 15 ml', spec: 'Nail care · 15 ml', qty: 4, unit: 'CF', location: 'C-11', image: img('1512496015851-a90fb38ba796') }]),
  ...rush('OUT-2026-001255', [
    { name: 'After wax lotion', spec: 'Post-wax · 200 ml', qty: 3, unit: 'SC', location: 'D-02', image: img('1608248543803-ba4f8c70ae0b') },
    { name: 'Nourishing cream', spec: 'Body · 150 ml', qty: 2, unit: 'SC', location: 'D-06', image: img('1556228720-195a672e8a03') },
    { name: 'Hand lotion', spec: 'Hands · 75 ml', qty: 4, unit: 'CF', location: 'D-07', image: img('1608248597279-f99d160bfcbc') }]),
  ...rush('OUT-2026-001252', [
    { name: 'Classic bonder 8 ml', spec: 'Bond builder · 8 ml', qty: 8, unit: 'CF', location: 'C-08', image: img('1556228578-8c89e6adf883') },
    { name: 'Nail primer', spec: 'Prep · 15 ml', qty: 3, unit: 'CF', location: 'C-16', image: img('1596462502278-27bfdc403348') }]),
  ...rush('OUT-2026-001249', [
    { name: 'Keratin repair mask', spec: 'Repair · 200 ml', qty: 4, unit: 'SC', location: 'B-03', image: img('1571781926291-c477ebfd024b') },
    { name: 'After wax lotion', spec: 'Post-wax · 200 ml', qty: 3, unit: 'SC', location: 'D-02', image: img('1608248543803-ba4f8c70ae0b') },
    { name: 'Scalp serum', spec: 'Scalp · 50 ml', qty: 2, unit: 'CF', location: 'B-09', image: img('1571875257727-256c39da42af') }]),
];
export const QUEUE = [
  { no: 'OUT-2026-001248', name: 'Bellezza Milano', qty: '24 pcs', type: 'ship', method: 'door', time: 'Sep 6, 11:40' },
  { no: 'REST-431015', name: 'Young Color 7.1', qty: '16 pcs', type: 'restock', method: 'store', time: 'Sep 6, 10:15' },
  { no: 'OUT-2026-001246', name: 'Casa Cosmetica', qty: '9 pcs', type: 'ship', method: 'courier', time: 'Sep 6, 09:48' },
  { no: 'REST-370102', name: 'Classic bonder 8 ml', qty: '20 pcs', type: 'restock', method: 'store', time: 'Sep 6, 09:20' },
  { no: 'OUT-2026-001244', name: 'Nuova Forma', qty: '6 pcs', type: 'ship', method: 'pickup', time: 'Sep 5, 17:22' },
  { no: 'OUT-2026-001241', name: 'Aria Studio', qty: '14 pcs', type: 'ship', method: 'door', time: 'Sep 5, 16:08' },
  { no: 'REST-510002', name: 'After wax lotion', qty: '12 pcs', type: 'restock', method: 'store', time: 'Sep 5, 15:40' },
  { no: 'OUT-2026-001236', name: 'Studio Forma', qty: '18 pcs', type: 'ship', method: 'courier', time: 'Sep 5, 14:16' },
  { no: 'OUT-2026-001232', name: 'Vita Beauty', qty: '8 pcs', type: 'ship', method: 'pickup', time: 'Sep 5, 11:05' },
  { no: 'REST-290114', name: 'Keratin repair mask', qty: '10 pcs', type: 'restock', method: 'store', time: 'Sep 5, 10:22' },
  { no: 'OUT-2026-001228', name: 'Bella Roma', qty: '11 pcs', type: 'ship', method: 'door', time: 'Sep 5, 09:31' },
  { no: 'REST-431022', name: 'Color lock shampoo', qty: '8 pcs', type: 'restock', method: 'store', time: 'Sep 4, 18:10' },
  { no: 'OUT-2026-001221', name: 'Essenza Lab', qty: '7 pcs', type: 'ship', method: 'courier', time: 'Sep 4, 16:44' },
];
export const QUEUE_TYPE: Record<string, { label: string; tone: 'info' | 'success' }> = { restock: { label: 'Restock', tone: 'info' }, ship: { label: 'Ship', tone: 'success' } };
export const QUEUE_METHOD: Record<string, { label: string; tone: 'secondary' | 'info' | 'warning' }> = { store: { label: 'To store', tone: 'secondary' }, pickup: { label: 'Pickup', tone: 'info' }, door: { label: 'Door', tone: 'warning' }, courier: { label: 'Courier', tone: 'secondary' } };
export const INCOMING_RECEIPTS = [
  { no: 'GR-2026-0198', supplier: 'L’Oréal', qty: '128 pcs', status: 'arrived', time: 'Sep 6, 14:10' },
  { no: 'GR-2026-0196', supplier: 'Wella', qty: '64 pcs', status: 'draft', time: 'Sep 6, 11:28' },
  { no: 'GR-2026-0194', supplier: 'Schwarzkopf', qty: '48 pcs', status: 'draft', time: 'Sep 5, 16:40' },
  { no: 'GR-2026-0191', supplier: 'OPI', qty: '36 pcs', status: 'draft', time: 'Sep 5, 10:12' },
  { no: 'GR-2026-0188', supplier: 'Kérastase', qty: '22 pcs', status: 'draft', time: 'Sep 4, 17:05' },
  { no: 'GR-2026-0184', supplier: 'Redken', qty: '40 pcs', status: 'arrived', time: 'Sep 4, 11:20' },
];
export const RECEIPT_STATUS: Record<string, { label: string; tone: 'success' | 'warning' }> = { arrived: { label: 'Arrived', tone: 'success' }, draft: { label: 'Draft', tone: 'warning' } };
export const NEAR_EXPIRY = [
  { name: 'After wax lotion', sku: 'LOT-2508-014', metric: '12 days', image: img('1608248543803-ba4f8c70ae0b') },
  { name: 'Young Color 7.1', sku: 'LOT-2507-208', metric: '18 days', image: img('1596462502278-27bfdc403348') },
  { name: 'Classic bonder 8 ml', sku: 'LOT-2509-003', metric: '24 days', image: img('1556228578-8c89e6adf883') },
  { name: 'Keratin repair mask', sku: 'LOT-2506-091', metric: 'Expired', image: img('1571781926291-c477ebfd024b') },
  { name: 'Color lock shampoo', sku: 'LOT-2508-122', metric: '21 days', image: img('1522335789203-aabd1fc54bc9') },
  { name: 'Nourishing cream', sku: 'LOT-2507-044', metric: '27 days', image: img('1556228720-195a672e8a03') },
];
