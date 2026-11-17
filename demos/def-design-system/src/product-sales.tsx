import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Barcode, Boxes, Check, ChevronDown, CreditCard, Download, Package, Pause, Play, Plus, Printer, ReceiptText, Search, Tag, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { SlideTabs } from './motion';
import { FormDialog, FormSection } from './form-dialog';
import { Dialog, DialogAction, DialogCancel, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/**
 * 商品销售（开单）。逐项对齐真实 ERP 的 SalesOrderCreate，换成新的设计语言：
 * 客户卡（客户 / 收款 / 门店 / 仓库 / 挂单解挂）+ 开单卡（搜索 / 商品行 / 合计 / 保存）。
 * 价格均为含税价；库存与超卖按基础单位计算。
 */

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=160&h=160&fit=crop`;
const eur = (v: number) => '€' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const n2 = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const raw2 = (v: number) => v.toFixed(2);
const r2 = (v: number) => Math.round(v * 100) / 100;
const kgFmt = (v: number) => `${Number(v.toFixed(2))} kg`;

/* ───────── 目录：SKU 与包装单位（qty = 相对基础单位的数量） ───────── */
type Unit = { id: string; name: string; it: string; qty: number; std: number; list?: number; kg: number };
/** vat：该商品的增值税率（各商品不同，含税价按各自税率拆分） */
type Sku = { id: string; code: string; barcode: string; productId: string; brand: string; name: string; spec: string; image: string; base: string; stock: number; units: Unit[]; defaultUnit: string; vat?: number };
const vatOf = (s: Sku) => s.vat ?? 0.22;
/** 库存附加信息：货架位、已锁定（其他未发货订单占用）、低库存阈值 */
const STOCK_EXTRA: Record<string, { loc: string; reserved: number; low: number }> = {
  s1: { loc: 'A-12', reserved: 6, low: 20 }, s2: { loc: 'B-07', reserved: 0, low: 24 }, s3: { loc: 'B-03', reserved: 2, low: 10 },
  s4: { loc: 'C-21', reserved: 24, low: 48 }, s5: { loc: 'C-11', reserved: 0, low: 12 }, s7: { loc: 'C-08', reserved: 10, low: 30 },
};
const extraOf = (id: string) => STOCK_EXTRA[id] ?? { loc: `D-${10 + Number(id.slice(-1))}`, reserved: 0, low: 12 };
/** 该客户买过这个商品的记录（演示数据，按客户 + SKU 固定生成） */
const BRANCH_LABEL: Record<string, string> = { main: 'Main store', milan: 'Milan outlet' };
function purchaseHistory(customer: string, sku: Sku) {
  if (!customer || customer === 'c0000') return [];
  const seed = [...(customer + sku.id)].reduce((a, c) => a + c.charCodeAt(0), 0);
  const count = seed % 4; // 0–3 条，0 条时显示空状态
  const unit = unitOf(sku, sku.defaultUnit);
  return Array.from({ length: count }, (_, k) => {
    const qty = 1 + ((seed + k * 7) % 6);
    const price = r2(unit.std * (k === 1 ? 0.95 : 1));
    const d = new Date(2026, 9 - k * 2, 3 + ((seed + k * 11) % 24));
    return { id: k, date: d.toLocaleDateString('en-GB'), no: `OUT-2026-00${1180 - k * 37 - (seed % 9)}`, price, qty, unit: unit.it, total: r2(price * qty), branch: k % 2 ? 'milan' : 'main' };
  });
}
const u = (id: string, name: string, it: string, qty: number, std: number, kg: number, list?: number): Unit => ({ id, name, it, qty, std, list, kg });
const CATALOG: Sku[] = [
  { id: 's1', code: 'LP-VC-300', barcode: '3474636977369', productId: 'p1', brand: 'L’Oréal Pro', name: 'Vitamino Color shampoo', spec: 'Blonde', image: img('1608248597279-f99d160bfcbc'), base: 'PZ', stock: 42, defaultUnit: 'pz', units: [u('pz', 'PZ', 'pezzo', 1, 13, 0.55)] },
  { id: 's2', code: 'OLX-7-30', barcode: '0896364002640', productId: 'p2', brand: 'Olaplex', name: 'Nº7 Bonding Oil', spec: '30 ml', image: img('1571781926291-c477ebfd024b'), base: 'PZ', stock: 60, defaultUnit: 'box', units: [u('pz', 'PZ', 'pezzo', 1, 12.5, 0.03, 16), u('box', 'Box', 'scatola', 6, 70, 0.18, 96)] },
  { id: 's3', code: 'LP-AR-150', barcode: '3474636975303', productId: 'p3', brand: 'L’Oréal Pro', name: 'Absolut Repair mask', spec: '150 ml', image: img('1556228720-195a672e8a03'), base: 'PZ', stock: 22, defaultUnit: 'pz', units: [u('pz', 'PZ', 'pezzo', 1, 45, 1.62)] },
  { id: 's4', code: 'DEF-AD-FM', barcode: '8057721300418', productId: 'p4', brand: 'DEF', name: 'Anti-Dandruff Shampoo', spec: 'Fresh mint', image: img('1608248543803-ba4f8c70ae0b'), base: 'PZ', stock: 216, defaultUnit: 'ctn', vat: 0.1, units: [u('pz', 'PZ', 'pezzo', 1, 6, 0.55, 9.9), u('ctn', 'Carton', 'cartone', 12, 66, 6.6, 106.8)] },
  { id: 's5', code: 'OPI-NCO-CL', barcode: '4064665041232', productId: 'p5', brand: 'OPI', name: 'Nail & Cuticle Oil', spec: 'Classic', image: img('1512496015851-a90fb38ba796'), base: 'PZ', stock: 4, defaultUnit: 'pz', units: [u('pz', 'PZ', 'pezzo', 1, 15, 0.03)] },
  // 同一商品多个色号：搜索里可以展开、多选后一起加入
  ...([['Bubble Bath', 'S86', 28], ['Big Apple Red', 'N25', 14], ['Lincoln Park After Dark', 'W42', 9], ['Funny Bunny', 'H22', 0]] as const).map(([shade, code, stock], k): Sku => ({
    id: `s6${k}`, code: `OPI-NL-${code}`, barcode: `094300822${k}1${k}`, productId: 'p6', brand: 'OPI', name: 'Nail Lacquer', spec: shade, image: img('1604654894610-df63bc536371'), base: 'PZ', stock, defaultUnit: 'pz',
    units: [u('pz', 'PZ', 'pezzo', 1, 9.5, 0.04, 14.9), u('box', 'Box', 'scatola', 6, 54, 0.24)],
  })),
  { id: 's7', code: 'DEF-BG-50', barcode: '8057721300722', productId: 'p7', brand: 'DEF', name: 'Builder gel', spec: '50 ml', image: img('1610992015732-2449b76344bc'), base: 'PZ', stock: 140, defaultUnit: 'pz', units: [u('pz', 'PZ', 'pezzo', 1, 18, 0.09, 26)] },
];
const skuOf = (id: string) => CATALOG.find((s) => s.id === id)!;
const unitOf = (s: Sku, id: string) => s.units.find((x) => x.id === id) ?? s.units[0];

/* ───────── 客户：价格类型 + 等级折扣 + 账户 ───────── */
type PriceType = 'standard' | 'list';
type Customer = { id: string; label: string; tier?: { name: string; tone: 'warning' | 'secondary' | 'info'; rate: number }; priceType: PriceType; retail?: boolean; spend: number; unpaid: number; balance: number; credit: number };
const CUSTOMERS: Customer[] = [
  { id: 'c1042', label: '1042 Luce Beauty Lab', tier: { name: 'Gold', tone: 'warning', rate: 1 }, priceType: 'standard', spend: 18420, unpaid: 0, balance: 0, credit: 2000 },
  { id: 'c1018', label: '1018 Studio Aurora', tier: { name: 'Silver', tone: 'secondary', rate: 0.95 }, priceType: 'standard', spend: 6240, unpaid: 216.5, balance: 0, credit: 800 },
  { id: 'c1031', label: '1031 Belle Mani', tier: { name: 'Gold', tone: 'warning', rate: 0.9 }, priceType: 'standard', spend: 11980, unpaid: 0, balance: 120, credit: 1500 },
  { id: 'c0000', label: '0000 Walk-in customer', priceType: 'list', retail: true, spend: 0, unpaid: 0, balance: 0, credit: 0 },
];
const custOf = (id: string) => CUSTOMERS.find((c) => c.id === id);
const unitPrice = (unit: Unit, pt: PriceType) => (pt === 'list' ? unit.list ?? unit.std : unit.std);

/* ───────── 商品行 ───────── */
type Line = { key: number; sku: string; unit: string; note: string; price: number; disc: number; qty: number; gift: boolean };
let nextKey = 100;
const newLine = (s: Sku, c: Customer | undefined): Line => {
  const unit = unitOf(s, s.defaultUnit);
  return { key: nextKey++, sku: s.id, unit: unit.id, note: '', price: unitPrice(unit, c?.priceType ?? 'standard'), disc: c?.tier?.rate ?? 1, qty: 1, gift: false };
};
const SEED: Line[] = [
  { key: 1, sku: 's1', unit: 'pz', note: '', price: 13, disc: 1, qty: 24, gift: false },
  { key: 2, sku: 's2', unit: 'box', note: 'Rebooked', price: 70, disc: 0.95, qty: 2, gift: false },
  { key: 3, sku: 's3', unit: 'pz', note: '', price: 45, disc: 1, qty: 4, gift: false },
  { key: 4, sku: 's4', unit: 'ctn', note: '', price: 66, disc: 1, qty: 3, gift: false },
  { key: 5, sku: 's5', unit: 'pz', note: '', price: 15, disc: 1, qty: 6, gift: true },
];
const netOf = (l: Line) => r2(l.price * l.disc);
const amountOf = (l: Line) => (l.gift ? 0 : r2(l.qty * netOf(l)));
const baseQty = (l: Line) => l.qty * unitOf(skuOf(l.sku), l.unit).qty;
/** 同一 SKU 的所有行一起占用库存，超出的部分记到当前行（按基础单位）。 */
const oversell = (lines: Line[], i: number) => {
  const l = lines[i];
  const before = lines.slice(0, i).filter((x) => x.sku === l.sku).reduce((s, x) => s + baseQty(x), 0);
  const left = Math.max(0, skuOf(l.sku).stock - before);
  return Math.max(0, baseQty(l) - left);
};

/** 挂单：整张单（客户 + 商品行）暂存，解挂时原样恢复。 */
type HeldOrder = { id: number; customer: string; lines: Line[]; at: string };
const HELD_SEED: HeldOrder[] = [{ id: 1, customer: 'c1018', at: 'Today 10:42', lines: [{ ...SEED[2], key: 11, qty: 6, disc: 0.95 }, { ...SEED[1], key: 12, qty: 1, disc: 0.95, note: '' }] }];

const PAY_METHODS = ['Cash', 'Card', 'Bank transfer', 'Account balance'] as const;
type PayRow = { method: typeof PAY_METHODS[number]; amount: string };

/** 扫码中的条码图标：一条横向扫描线在条码上上下扫过（减少动态效果时不动）。 */
function ScanIcon({ className = '' }: { className?: string }) {
  return (
    <span className={'relative inline-grid size-4 shrink-0 place-items-center overflow-hidden ' + className} aria-hidden>
      <Barcode className="size-4" />
      <span className="scan-sweep absolute inset-x-0 top-0 h-0.5 rounded-full bg-current shadow-[0_0_6px_currentColor]" />
    </span>
  );
}

/* ───────── 包装规格选择：表格弹层（单位 / 换算 / 标准价 / 零售价） ───────── */
function PackagingSelect({ sku, value, onPick }: { sku: Sku; value: string; onPick: (unit: Unit) => void }) {
  const [open, setOpen] = useState(false);
  const cur = unitOf(sku, value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" title={cur.qty > 1 ? `1 ${cur.name} = ${cur.qty} ${sku.base}` : 'Base unit'}
          className="inline-flex h-7 items-center gap-1 rounded-md bg-primary/10 px-2 text-sm font-medium text-primary-strong transition-colors hover:bg-primary/15">
          {cur.name}<ChevronDown className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto min-w-[24rem] overflow-hidden rounded-xl p-0">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted text-left text-xs text-muted-foreground [&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
            <th className="w-8" /><th>Packaging unit</th><th>Conversion</th><th className="text-right">Standard (€)</th><th className="text-right">RRP (€)</th>
          </tr></thead>
          <tbody className="divide-y divide-border">
            {sku.units.map((x) => {
              const on = x.id === cur.id;
              return (
                <tr key={x.id} onClick={() => { onPick(x); setOpen(false); }} className={'cursor-pointer transition-colors [&>td]:px-3 [&>td]:py-2.5 ' + (on ? 'bg-primary/10' : 'hover:bg-surface-hover')}>
                  <td><span className={'grid size-4 place-items-center rounded-[4px] border ' + (on ? 'border-primary bg-primary text-white' : 'border-input')}>{on && <Check className="size-3" />}</span></td>
                  <td><span className={'font-medium ' + (on ? 'text-primary-strong' : '')}>{x.name}</span><span className="ml-1.5 text-xs text-muted-foreground">{x.it}</span></td>
                  <td className="whitespace-nowrap text-xs text-muted-foreground">{x.qty > 1 ? `1 ${x.name} = ${x.qty} ${sku.base}` : 'Base unit'}</td>
                  <td className="text-right tabular-nums">{n2(x.std)}</td>
                  <td className="text-right tabular-nums text-primary-strong">{x.list != null ? n2(x.list) : <span className="text-muted-foreground/60">—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </PopoverContent>
    </Popover>
  );
}

export default function ProductSales() {
  const [customer, setCustomer] = useState('c1042');
  const [lines, setLines] = useState<Line[]>(SEED);
  const [branch, setBranch] = useState('main');
  const [warehouse, setWarehouse] = useState('');
  const [rep, setRep] = useState('');
  const [repError, setRepError] = useState(false);
  const [keptDiscount, setKeptDiscount] = useState<number | null>(null); // 手改成交价后保留的优惠额
  const [finalDraft, setFinalDraft] = useState<string | null>(null);
  const [held, setHeld] = useState<HeldOrder[]>(HELD_SEED);
  const [notice, setNotice] = useState<string | null>(null);
  const [heldOpen, setHeldOpen] = useState(false);
  const [confirmResume, setConfirmResume] = useState<HeldOrder | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<HeldOrder | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [q, setQ] = useState('');
  const [dropOpen, setDropOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [scan, setScan] = useState(false);
  const [detail, setDetail] = useState<string | null>(null);
  const [collectOpen, setCollectOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [savedNo, setSavedNo] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchBox = useRef<HTMLDivElement>(null);

  const cust = custOf(customer);
  const priceType: PriceType = cust?.priceType ?? 'standard';
  const set = (key: number, patch: Partial<Line>) => setLines((p) => p.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  const labelOf = (id: string) => custOf(id)?.label ?? 'Customer';

  /* 合计 */
  const pcs = lines.reduce((s, l) => s + l.qty, 0);
  const kg = lines.reduce((s, l) => s + unitOf(skuOf(l.sku), l.unit).kg * l.qty, 0);
  const total = r2(lines.reduce((s, l) => s + amountOf(l), 0));
  // 含税价按每行自己的税率拆分出税额
  const vat = r2(lines.reduce((s, l) => { const rate = vatOf(skuOf(l.sku)); return s + amountOf(l) * rate / (1 + rate); }, 0));
  const pre = r2(total - vat);
  const final = finalDraft !== null ? Number(finalDraft) || 0 : r2(Math.max(0, total - (keptDiscount ?? 0)));
  const discountAmount = r2(Math.max(0, total - final));
  const available = cust && !cust.retail ? r2(cust.credit - cust.unpaid) : 0;
  const creditShort = !!cust && !cust.retail && final > available + 0.005;

  /* 切换客户：按新客户的价格类型与等级折扣重算全部商品行 */
  const pickCustomer = (id: string) => {
    const c = custOf(id);
    setCustomer(id); setNotice(null);
    if (!c) return;
    setLines((p) => p.map((l) => ({ ...l, price: unitPrice(unitOf(skuOf(l.sku), l.unit), c.priceType), disc: c.tier?.rate ?? 1 })));
  };

  /* 加入商品：同一 SKU + 同包装 + 非赠品的行合并数量，否则新增一行 */
  const addSkus = (ids: string[]) => {
    setLines((p) => {
      let next = [...p];
      ids.forEach((id) => {
        const s = skuOf(id);
        const i = next.findIndex((l) => l.sku === id && l.unit === s.defaultUnit && !l.gift);
        if (i >= 0) next = next.map((l, k) => (k === i ? { ...l, qty: l.qty + 1 } : l));
        else next = [...next, newLine(s, cust)];
      });
      return next;
    });
    setQ(''); setDropOpen(false); setExpanded(null); setPicked({});
    requestAnimationFrame(() => searchRef.current?.focus());
  };

  /* 搜索：按 品牌 / 名称 / 色号 / SKU / 条码 匹配，按商品分组 */
  const hits = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    const m = CATALOG.filter((s) => [s.brand, s.name, s.spec, s.code, s.barcode].join(' ').toLowerCase().includes(t));
    const groups = new Map<string, Sku[]>();
    m.forEach((s) => groups.set(s.productId, [...(groups.get(s.productId) ?? []), s]));
    return [...groups.values()];
  }, [q]);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (!searchBox.current?.contains(e.target as Node)) setDropOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const resetOrder = () => { setCustomer(''); setLines([]); setKeptDiscount(null); setFinalDraft(null); setRepError(false); };
  /* 挂单 / 解挂 */
  const hold = () => {
    if (!customer) { setNotice('Select a customer before holding'); return; }
    if (lines.length === 0) { setNotice('Add products before holding'); return; }
    const d = new Date();
    setHeld((p) => [{ id: Date.now(), customer, lines, at: `Today ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` }, ...p]);
    setNotice(`Held: ${labelOf(customer)}, ${lines.length} product${lines.length > 1 ? 's' : ''}`);
    resetOrder();
    searchRef.current?.focus();
  };
  const resume = (h: HeldOrder) => {
    setCustomer(h.customer); setLines(h.lines); setKeptDiscount(null); setFinalDraft(null);
    setHeld((p) => p.filter((x) => x.id !== h.id));
    setNotice(`Resumed: ${labelOf(h.customer)}`);
    setHeldOpen(false); setConfirmResume(null);
  };

  /* 保存：先校验客户和销售员，再打开收尾弹窗（收款 / 取货 / 备注） */
  const save = () => {
    if (!customer) { setNotice('Select a customer first'); return; }
    if (!rep) { setRepError(true); return; }
    setSaveOpen(true);
  };

  return (
    <div className="flex h-full flex-col gap-4">
      {/* ───────── 卡片一：客户（给谁开单） ───────── */}
      <div className="shrink-0 rounded-2xl bg-card px-6 py-4 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <Select value={customer || null} onValueChange={pickCustomer} size="lg" placeholder="Select a customer" triggerClassName="h-11 w-80 rounded-xl text-[0.9375rem] font-medium"
            options={CUSTOMERS.map((c) => ({ value: c.id, label: c.label }))} />
          <div className="flex shrink-0 items-center gap-2.5">
            <Button size="lg" onClick={() => setCollectOpen(true)} title="Record a payment against the customer’s account, separate from this order"><CreditCard />Collect payment</Button>
            <Select value={branch} onValueChange={setBranch} size="lg" triggerClassName="w-36" options={[{ value: 'main', label: 'Main store' }, { value: 'milan', label: 'Milan outlet' }]} />
            <Select value={warehouse || null} onValueChange={setWarehouse} size="lg" placeholder="Warehouse" triggerClassName="w-36" options={[{ value: 'a', label: 'Warehouse A' }, { value: 'b', label: 'Warehouse B' }]} />
          </div>
        </div>
        <div className="mt-2.5 flex min-h-8 items-center gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-5 gap-y-1 text-sm">
            {!cust ? <span className="text-muted-foreground">Choose a customer to see price mode, balance and credit.</span> : cust.retail ? (
              <><Badge variant="secondary">Retail price mode · settle now</Badge><span className="text-muted-foreground">Walk-in sales use the RRP and are paid in full.</span></>
            ) : (
              <>
                {cust.tier && <Badge variant={cust.tier.tone}><span className="size-1.5 rounded-full bg-current" />{cust.tier.name}</Badge>}
                <span className="text-muted-foreground">Lifetime spend <span className="font-semibold text-foreground tabular-nums">{eur(cust.spend)}</span></span>
                <span className={cust.unpaid > 0 ? 'text-destructive' : 'text-muted-foreground'}>Unpaid <span className="font-semibold tabular-nums">{eur(cust.unpaid)}</span></span>
                {cust.balance > 0 && <span className="text-primary-strong">Prepaid balance <span className="font-semibold tabular-nums">{eur(cust.balance)}</span></span>}
                <span className={creditShort ? 'font-medium text-destructive' : 'font-medium text-primary'} title={`Credit limit ${eur(cust.credit)}, unpaid ${eur(cust.unpaid)}; after this order ${eur(available - final)}`}>
                  Available credit <span className="tabular-nums">{eur(available)}</span>{creditShort && ' · this order exceeds it'}
                </span>
                {cust.tier && cust.tier.rate < 1 && <span className="font-medium text-primary-strong">Tier discount {Math.round((1 - cust.tier.rate) * 100)}% <span className="font-normal text-muted-foreground">· prefilled on new lines</span></span>}
              </>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span role="status" aria-live="polite" className={'w-56 truncate text-right text-xs text-primary-strong ' + (notice ? '' : 'invisible')}>{notice ?? '—'}</span>
            <Button variant="outline" disabled={held.length === 0} onClick={() => setHeldOpen(true)}><Play />Resume{held.length > 0 && <span className="tabular-nums text-muted-foreground">({held.length})</span>}</Button>
            <Button variant="outline" onClick={hold}><Pause />Hold</Button>
          </div>
        </div>
      </div>

      {/* ───────── 卡片二：搜索 + 商品行 + 合计（商品行单独滚动，合计贴在底部） ───────── */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-card shadow-card">
        <div className="relative z-20 flex shrink-0 items-center gap-3 border-b border-border bg-surface-sunken px-6 py-3">
          <div ref={searchBox} className="relative">
            <label className={'flex h-9 w-[30rem] items-center gap-2 rounded-xl border bg-card px-3.5 text-sm focus-within:ring-2 focus-within:ring-ring/40 ' + (scan ? 'border-primary' : 'border-input')}>
              {scan ? <ScanIcon className="text-primary" /> : <Search className="size-4 text-muted-foreground" />}
              <input ref={searchRef} value={q} onChange={(e) => { setQ(e.target.value); if (!scan) setDropOpen(!!e.target.value.trim()); setExpanded(null); setPicked({}); }}
                onFocus={() => !scan && q.trim() && setDropOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setDropOpen(false);
                  if (e.key === 'Enter') {
                    const t = q.trim().toLowerCase();
                    const exact = CATALOG.find((s) => s.barcode === t || s.code.toLowerCase() === t);
                    if (exact) addSkus([exact.id]); else if (hits.length === 1 && hits[0].length === 1) addSkus([hits[0][0].id]);
                  }
                }}
                className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" aria-label="Find a product"
                placeholder={scan ? 'Scan a barcode…' : 'Product / brand / subtitle / SKU / code / barcode'} />
            </label>
            {dropOpen && q.trim() && !scan && (
              <div className="menu-pop absolute left-0 top-full mt-1.5 max-h-[26rem] w-[36rem] overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-[0_16px_40px_-12px_rgb(16_24_40/0.18)]">
                {hits.length === 0 ? <p className="px-3 py-6 text-center text-sm text-muted-foreground">No matches</p> : hits.map((group) => {
                  const s0 = group[0];
                  if (group.length === 1) return (
                    <button key={s0.id} type="button" onClick={() => addSkus([s0.id])} className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-surface-hover">
                      <img src={s0.image} alt="" className="size-9 rounded-md object-cover" />
                      <span className="min-w-0 flex-1"><span className="flex items-center gap-1.5 text-sm"><span className="font-medium text-primary-strong">{s0.brand}</span><span className="truncate font-medium">{s0.name}</span><Badge variant="secondary">{s0.spec}</Badge></span><span className="text-xs text-muted-foreground">{s0.code}</span></span>
                      <span className="shrink-0 text-right text-xs tabular-nums"><span className="block font-medium">{eur(unitPrice(unitOf(s0, s0.defaultUnit), priceType))}</span><span className={s0.stock <= 5 ? 'text-destructive' : 'text-muted-foreground'}>Stock {s0.stock}</span></span>
                    </button>
                  );
                  const open = (expanded ?? (hits.length === 1 ? s0.productId : null)) === s0.productId;
                  const n = group.filter((s) => picked[s.id]).length;
                  return (
                    <div key={s0.productId} className="my-1 rounded-lg border border-border">
                      <button type="button" aria-expanded={open} onClick={() => { setExpanded(open ? null : s0.productId); setPicked({}); }} className="flex w-full items-center gap-3 rounded-t-lg px-2.5 py-2 text-left hover:bg-surface-hover">
                        <img src={s0.image} alt="" className="size-9 rounded-md object-cover" />
                        <span className="min-w-0 flex-1 text-sm"><span className="font-medium text-primary-strong">{s0.brand}</span> <span className="font-medium">{s0.name}</span> <span className="text-xs text-muted-foreground">{group.length} shades</span></span>
                        <ChevronDown className={'size-4 text-muted-foreground transition-transform ' + (open ? 'rotate-180' : '')} />
                      </button>
                      {open && (<>
                        <div className="flex items-center justify-between gap-2 border-y border-border px-3 py-2">
                          <label className="flex items-center gap-2 text-sm font-medium"><Checkbox checked={n === group.length ? true : n ? 'indeterminate' : false} onCheckedChange={(c) => setPicked(c === true ? Object.fromEntries(group.map((s) => [s.id, true])) : {})} />Select all shades</label>
                          <span className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{n}/{group.length} selected</span><Button size="sm" disabled={!n} onClick={() => addSkus(group.filter((s) => picked[s.id]).map((s) => s.id))}><Plus />Add</Button></span>
                        </div>
                        <div className="divide-y divide-border">
                          {group.map((s) => (
                            <label key={s.id} className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-surface-hover">
                              <Checkbox checked={!!picked[s.id]} onCheckedChange={(c) => setPicked((p) => { const x = { ...p }; if (c === true) x[s.id] = true; else delete x[s.id]; return x; })} />
                              <span className="min-w-0 flex-1 text-sm"><span className="font-medium">{s.name}</span> <Badge variant="secondary">{s.spec}</Badge></span>
                              <span className="flex shrink-0 gap-3 text-xs tabular-nums"><span>{eur(unitPrice(unitOf(s, s.defaultUnit), priceType))}</span><span className={s.stock === 0 ? 'text-destructive' : s.stock <= 10 ? 'text-warning-text' : 'text-muted-foreground'}>Stock {s.stock}</span></span>
                            </label>
                          ))}
                        </div>
                      </>)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <Button variant="outline" size="lg" aria-pressed={scan} onClick={() => { setScan((v) => !v); setDropOpen(false); searchRef.current?.focus(); }} className={'min-w-36 ' + (scan ? 'border-primary text-primary-strong' : '')}>
            {scan ? <ScanIcon /> : <Barcode />}{scan ? 'Scanning…' : 'Scan barcode'}
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="lg"><Download />Import document</Button>
            {lines.length > 0 && <Button variant="ghost" aria-label="Clear all lines" title="Clear all" className="-mr-3 size-9 px-0 text-destructive hover:bg-[color-mix(in_srgb,var(--destructive)_12%,transparent)] hover:text-destructive" onClick={() => setConfirmClear(true)}><Trash2 /></Button>}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          {lines.length === 0 ? (
            <div className="grid h-full place-items-center px-6 py-14 text-center">
              <div>
                <span className="mx-auto grid size-11 place-items-center rounded-xl bg-muted text-muted-foreground"><Search className="size-5" /></span>
                <p className="mt-3 text-sm font-medium">No products yet</p>
                <p className="mt-1 text-xs text-muted-foreground">Search or scan to add the first product{held.length ? ', or resume a held order' : ''}.</p>
              </div>
            </div>
          ) : (
            <table className="w-full table-fixed text-sm [&_td]:overflow-hidden [&_td]:whitespace-nowrap [&_th]:overflow-hidden [&_th]:whitespace-nowrap">
              {/* 除 Product 外全部定宽（含左右各 8px 内边距），编辑时列宽不变 */}
              <colgroup>
                <col style={{ width: 40 }} /><col style={{ width: 56 }} /><col /><col style={{ width: 104 }} /><col style={{ width: 100 }} />
                <col style={{ width: 64 }} /><col style={{ width: 52 }} /><col style={{ width: 148 }} /><col style={{ width: 68 }} />
                <col style={{ width: 116 }} /><col style={{ width: 96 }} /><col style={{ width: 104 }} /><col style={{ width: 44 }} />
              </colgroup>
              <thead>
                <tr className="sticky top-0 z-[1] bg-muted text-left text-xs font-medium text-muted-foreground [&>th]:px-2 [&>th]:py-2.5">
                  <th className="!pl-4">#</th><th /><th>Product</th><th>Notes</th><th>Packaging</th>
                  <th className="text-right">Weight</th><th className="text-right">Stock</th><th>Price € incl. VAT</th><th className="text-center">Discount</th>
                  <th className="text-right">Net price</th><th className="text-center">Qty</th><th className="text-right">Subtotal</th><th />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lines.map((l, i) => {
                  const s = skuOf(l.sku);
                  const unit = unitOf(s, l.unit);
                  const over = oversell(lines, i);
                  const net = netOf(l);
                  const isStd = r2(l.price) === r2(unit.std);
                  const isList = unit.list != null && r2(l.price) === r2(unit.list);
                  return (
                    <tr key={l.key} className="align-middle transition-colors hover:bg-surface-hover [&>td]:px-2 [&>td]:py-2">
                      <td className="!pl-4 text-xs tabular-nums text-muted-foreground">{i + 1}</td>
                      <td><img src={s.image} alt="" className="size-10 max-w-none rounded-lg object-cover" /></td>
                      <td>
                        <button type="button" onClick={() => setDetail(s.id)} className="group block w-full min-w-0 text-left" title="View product details">
                          <span className="block truncate font-medium group-hover:text-primary">{s.name}</span>
                          <span className="mt-1 flex min-w-0 items-center gap-1.5"><span className="truncate text-xs text-muted-foreground">{s.brand}</span><Badge variant="secondary">{s.spec}</Badge></span>
                        </button>
                      </td>
                      <td><Input value={l.note} readOnly={scan} onChange={(e) => set(l.key, { note: e.target.value })} placeholder="Notes" className="h-9 w-full px-2" aria-label={`Notes for ${s.name}`} /></td>
                      <td>{s.units.length > 1
                        ? <PackagingSelect sku={s} value={l.unit} onPick={(x) => set(l.key, { unit: x.id, price: unitPrice(x, priceType) })} />
                        : <span title="Base unit" className="cursor-help text-sm text-muted-foreground">{unit.name}</span>}</td>
                      <td className="text-right text-xs tabular-nums text-muted-foreground">{kgFmt(unit.kg)}</td>
                      <td className={'text-right text-xs font-medium tabular-nums ' + (over > 0 ? 'text-destructive' : s.stock <= 10 ? 'text-warning-text' : 'text-muted-foreground')}>{s.stock}</td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <Input value={String(l.price)} readOnly={scan} inputMode="decimal" onChange={(e) => set(l.key, { price: Number(e.target.value) || 0 })} className="h-9 w-16 shrink-0 px-1.5 text-right tabular-nums" aria-label={`Price for ${s.name}`} />
                          <div className="flex flex-col items-start gap-0.5 leading-none">
                            <button type="button" onClick={() => set(l.key, { price: unit.std, disc: 1 })} className={'rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums transition-colors ' + (isStd ? 'bg-primary/10 text-primary-strong' : 'text-muted-foreground hover:bg-muted')}>Std {unit.std}</button>
                            {unit.list != null && <button type="button" onClick={() => set(l.key, { price: unit.list!, disc: 1 })} className={'rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums transition-colors ' + (isList ? 'bg-primary/10 text-primary-strong' : 'text-muted-foreground hover:bg-muted')}>RRP {unit.list}</button>}
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <Input value={String(l.disc)} readOnly={scan} disabled={l.gift} inputMode="decimal" onChange={(e) => set(l.key, { disc: Number(e.target.value.replace(',', '.')) || 1 })}
                          className={'mx-auto h-9 w-[3.25rem] px-1 text-center tabular-nums ' + (l.disc < 1 && !l.gift ? 'border-warning bg-[color-mix(in_srgb,var(--warning)_10%,transparent)] text-warning-text' : '')} aria-label={`Discount rate for ${s.name}`} />
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className={'tabular-nums ' + (l.gift ? 'text-muted-foreground line-through' : l.disc < 1 ? 'font-semibold text-primary-strong' : 'font-medium')}>{n2(net)}</span>
                          <button type="button" aria-pressed={l.gift} title={l.gift ? 'Cancel gift' : 'Make this a gift'} onClick={() => set(l.key, { gift: !l.gift })}
                            className={'inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-xs font-medium transition-colors ' + (l.gift ? 'bg-success text-white' : 'border border-border text-muted-foreground hover:bg-[color-mix(in_srgb,var(--success)_10%,transparent)] hover:text-success-text')}>
                            Gift
                          </button>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="inline-flex flex-col items-center">
                          <QuantityStepper value={l.qty} readOnly={scan} label={`quantity for ${s.name}`} onInputChange={(v) => set(l.key, { qty: Math.max(1, Number(v) || 1) })} onStep={(d) => set(l.key, { qty: Math.max(1, l.qty + d) })}
                            canIncrease={!scan} canDecrease={!scan && l.qty > 1} containerClassName={'w-20 ' + (over > 0 ? 'border-destructive [&>div]:border-destructive/40' : '')} />
                          {/* 提示位始终占位：出现或消失时行高不变 */}
                          <span className={'mt-1 text-[11px] font-medium leading-3 text-destructive ' + (over > 0 ? '' : 'invisible')} aria-hidden={over === 0}>Oversold {over || 0} {s.base}</span>
                        </div>
                      </td>
                      <td className="text-right font-semibold tabular-nums">
                        {l.gift ? <><span className="mr-1 text-xs font-normal text-muted-foreground line-through">{n2(r2(l.price * l.qty))}</span><span className="text-success-text">Gift</span></> : n2(amountOf(l))}
                      </td>
                      <td className="text-center">
                        <button type="button" aria-label={`Remove ${s.name}`} onClick={() => setLines((p) => p.filter((x) => x.key !== l.key))} className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-[color-mix(in_srgb,var(--destructive)_12%,transparent)] hover:text-destructive"><X className="size-4" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* 合计与保存 */}
        <div className="shrink-0 border-t border-border">
          <div className="flex items-end justify-between gap-6 px-6 py-3">
            <div className="flex items-end gap-5">
              {/* 两个计数块定宽、数值右对齐：增减商品时左侧不跳动 */}
              <div className="flex gap-2 text-sm">
                <span className="flex h-9 w-32 items-center justify-between rounded-xl bg-muted px-3 text-muted-foreground">Total<span className="tabular-nums"><span className="font-semibold text-foreground">{pcs}</span> pcs</span></span>
                <span className="flex h-9 w-40 items-center justify-between rounded-xl bg-muted px-3 text-muted-foreground">Weight<span className="font-semibold text-foreground tabular-nums">{kg > 0 ? kgFmt(kg) : '—'}</span></span>
              </div>
              <div className="border-l border-border pl-5">
                <p className="text-xs leading-4 text-muted-foreground">Goods total</p>
                <p className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold leading-7 tracking-[-0.02em] tabular-nums">{eur(total)}</span>
                  <span className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">{eur(pre)} net + {eur(vat)} VAT</span>
                </p>
              </div>
            </div>
            {/* 右侧和左侧 Goods total 同一结构：小标签在上、内容在下，底边对齐 */}
            <div className="flex items-end gap-6">
              <div className="w-24 text-right">
                <p className="text-xs leading-4 text-muted-foreground">Discount</p>
                <p className={'mt-1 text-base font-semibold leading-9 tabular-nums ' + (discountAmount > 0.009 ? 'text-primary-strong' : 'text-muted-foreground')}>{discountAmount > 0.009 ? `−${eur(discountAmount)}` : '—'}</p>
              </div>
              <label className="block">
                <span className="block text-right text-xs leading-4 text-muted-foreground">Final price (incl. VAT)</span>
                <Input value={finalDraft ?? raw2(final)} inputMode="decimal" aria-label="Final price incl. VAT"
                  onChange={(e) => setFinalDraft(e.target.value)}
                  onBlur={() => { if (finalDraft !== null) { const v = Number(finalDraft) || 0; setKeptDiscount(r2(Math.max(0, total - v))); setFinalDraft(null); } }}
                  className="mt-1 h-9 w-40 text-right text-base font-semibold tabular-nums" />
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-border bg-surface-sunken px-6 py-2">
            <p className="text-xs text-muted-foreground">Payment, pickup and notes are filled in after saving.</p>
            <div className="flex items-center gap-2.5">
              {repError && <span className="text-xs font-medium text-destructive">Select a salesperson</span>}
              <Select value={rep || null} onValueChange={(v) => { setRep(v); setRepError(false); }} size="lg" placeholder="Salesperson (required)"
                triggerClassName={'w-56 ' + (repError ? 'border-destructive ring-1 ring-destructive/40' : '')} options={[{ value: 'elena', label: 'Elena Rossi' }, { value: 'marco', label: 'Marco Ricci' }, { value: 'chen', label: 'Chen Hui' }]} />
              <Button size="lg" disabled={lines.length === 0} onClick={save} className="min-w-24">Save</Button>
            </div>
          </div>
        </div>
      </div>

      {/* ───────── 弹层 ───────── */}
      <ProductDetail sku={detail ? skuOf(detail) : null} customer={customer} onClose={() => setDetail(null)} />

      <Dialog open={heldOpen} onOpenChange={setHeldOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Held orders</DialogTitle><DialogDescription>Resume one to continue where you left off.</DialogDescription></DialogHeader>
          {held.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">Nothing held. Use Hold to park the current order.</p> : (
            <ul className="max-h-80 space-y-2 overflow-y-auto">
              {held.map((h) => {
                const qty = h.lines.reduce((a, l) => a + l.qty, 0);
                const sum = h.lines.reduce((a, l) => a + amountOf(l), 0);
                const names = h.lines.slice(0, 3).map((l) => skuOf(l.sku).name).join(', ') + (h.lines.length > 3 ? ` and ${h.lines.length - 3} more` : '');
                return (
                  <li key={h.id} className="flex items-center gap-4 rounded-xl bg-muted px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3"><p className="truncate text-sm font-medium">{labelOf(h.customer)}</p><span className="shrink-0 text-xs tabular-nums text-muted-foreground">{h.at}</span></div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{names}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{h.lines.length} products · {qty} pcs · total <span className="font-medium text-foreground tabular-nums">{eur(sum)}</span></p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => setConfirmDelete(h)}>Delete</Button>
                      <Button onClick={() => (lines.length > 0 ? setConfirmResume(h) : resume(h))}>Resume</Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </DialogContent>
      </Dialog>

      <Confirm open={!!confirmResume} onClose={() => setConfirmResume(null)} title="Replace the current order?" action="Replace and resume" onConfirm={() => confirmResume && resume(confirmResume)}
        body={`The current order already has products. Resuming “${confirmResume ? labelOf(confirmResume.customer) : ''}” will replace them.`} />
      <Confirm open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete held order?" action="Delete" destructive
        onConfirm={() => { if (confirmDelete) setHeld((p) => p.filter((x) => x.id !== confirmDelete.id)); setConfirmDelete(null); }}
        body={`The held order for “${confirmDelete ? labelOf(confirmDelete.customer) : ''}” can’t be recovered once deleted.`} />
      <Confirm open={confirmClear} onClose={() => setConfirmClear(false)} title="Clear all lines?" action="Clear all" destructive
        onConfirm={() => { setLines([]); setKeptDiscount(null); setFinalDraft(null); setConfirmClear(false); }}
        body={`All ${lines.length} products on this order will be removed. The customer stays selected.`} />

      <CollectPayment open={collectOpen} onClose={() => setCollectOpen(false)} customer={cust} />

      <SaveDialog open={saveOpen} onClose={() => setSaveOpen(false)} customer={cust} lines={lines} final={final}
        onSaved={() => { setSaveOpen(false); setSavedNo('OUT-2026-001262'); }} />

      <Dialog open={!!savedNo} onOpenChange={(o) => !o && setSavedNo(null)}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <span className="grid size-10 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--success)_14%,transparent)] text-success-text"><Check className="size-5" /></span>
            <DialogTitle>Sales order saved</DialogTitle>
            <DialogDescription>{savedNo} has been created. This page is ready for the next sale.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline"><ReceiptText />Print receipt</Button>
            <Button variant="outline"><Printer />Print order</Button>
            <Button onClick={() => { setSavedNo(null); resetOrder(); setRep(''); setNotice(null); }}>Continue selling</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Confirm({ open, onClose, title, body, action, onConfirm, destructive = false }: { open: boolean; onClose: () => void; title: string; body: string; action: string; onConfirm: () => void; destructive?: boolean }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{body}</DialogDescription></DialogHeader>
        <DialogFooter><DialogCancel>Cancel</DialogCancel><DialogAction variant={destructive ? 'destructive' : 'default'} onClick={onConfirm}>{action}</DialogAction></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** 商品详情侧栏（点商品名打开）。内容对齐原 ERP 的 SalesSkuDetailPanel。
 *  密度高、但有层级：顶部商品信息单独一条底色；每段有带图标的标题；价格与库存左右并排，各有一个主数字，次要信息小字跟随。 */
function ProductDetail({ sku, customer, onClose }: { sku: Sku | null; customer: string; onClose: () => void }) {
  const Title = ({ icon: Ic, children, aside }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; aside?: React.ReactNode }) => (
    <div className="mb-2.5 flex items-center justify-between gap-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold"><span className="grid size-6 place-items-center rounded-md bg-primary/10 text-primary-strong"><Ic className="size-3.5" /></span>{children}</h3>
      {aside && <span className="truncate text-xs text-muted-foreground">{aside}</span>}
    </div>
  );
  const Sub = ({ label, children, tone = '' }: { label: string; children: React.ReactNode; tone?: string }) => (
    <div className="min-w-0"><dt className="truncate text-[11px] text-muted-foreground">{label}</dt><dd className={'truncate text-sm font-medium tabular-nums ' + tone}>{children}</dd></div>
  );
  const base = sku ? sku.units[0] : null;
  const ex = sku ? extraOf(sku.id) : null;
  const available = sku && ex ? sku.stock - ex.reserved : 0;
  const status = !sku || !ex ? null : available <= 0 ? { label: 'Out of stock', v: 'destructive' as const, t: 'text-destructive' } : available < ex.low ? { label: 'Low', v: 'warning' as const, t: 'text-warning-text' } : { label: 'In stock', v: 'success' as const, t: '' };
  const rows = sku ? purchaseHistory(customer, sku) : [];
  const cust = custOf(customer);
  const custName = cust?.label.replace(/^\d+ /, '') ?? '';
  return (
    <Sheet open={!!sku} onOpenChange={(o) => !o && onClose()}>
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()} className="gap-0 p-0 data-[side=right]:w-[34rem] data-[side=right]:sm:max-w-[34rem]">
        <SheetHeader className="px-5 py-3.5"><SheetTitle className="text-sm">Product details</SheetTitle><SheetDescription className="sr-only">Prices, stock, packaging and this customer’s purchases</SheetDescription></SheetHeader>
        {sku && base && ex && status && (
          <div className="min-h-0 flex-1 overflow-y-auto">
            {/* 商品身份：单独一条底色，和下面的数据分开 */}
            <div className="mx-5 flex gap-3.5 rounded-xl bg-muted p-3.5">
              <div className="group relative size-14 shrink-0">
                <img src={sku.image} alt="" className="size-14 rounded-lg object-cover" />
                <img src={sku.image.replace('w=160&h=160', 'w=480&h=480')} alt="" aria-hidden className="pointer-events-none invisible absolute left-0 top-[calc(100%+8px)] z-10 size-64 rounded-2xl object-cover opacity-0 shadow-[0_16px_40px_-12px_rgb(16_24_40/0.3)] transition-opacity duration-200 group-hover:visible group-hover:opacity-100" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-primary-strong">{sku.brand}</p>
                <p className="truncate text-base font-semibold leading-snug">{sku.name}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="bg-card">{sku.spec}</Badge><span className="tabular-nums">SKU {sku.code}</span><span aria-hidden>·</span><span className="tabular-nums">EAN {sku.barcode}</span>
                </p>
              </div>
            </div>

            {/* 价格 | 库存：左右并排，各一个主数字 */}
            <div className="grid grid-cols-2 divide-x divide-border border-b border-border px-5 py-4">
              <div className="pr-5">
                <Title icon={Tag}>Price</Title>
                <p className="text-[11px] text-muted-foreground">Wholesale / {base.name} · incl. VAT</p>
                <p className="text-2xl font-semibold leading-8 tracking-[-0.02em] tabular-nums">{eur(base.std)}</p>
                <dl className="mt-2 grid grid-cols-2 gap-3">
                  <Sub label="Retail (RRP)">{base.list != null ? eur(base.list) : '—'}</Sub>
                  <Sub label="VAT">{Math.round(vatOf(sku) * 100)}%{vatOf(sku) < 0.22 && <span className="ml-1 text-[11px] font-normal text-muted-foreground">reduced</span>}</Sub>
                </dl>
              </div>
              <div className="pl-5">
                <Title icon={Boxes} aside={<Badge variant={status.v}>{status.label}</Badge>}>Stock</Title>
                <p className="text-[11px] text-muted-foreground">Available · shelf {ex.loc}</p>
                <p className={'text-2xl font-semibold leading-8 tracking-[-0.02em] tabular-nums ' + status.t}>{available} <span className="text-base font-medium text-muted-foreground">{sku.base}</span></p>
                <dl className="mt-2 grid grid-cols-2 gap-3">
                  <Sub label="Reserved">{ex.reserved} {sku.base}</Sub>
                  <Sub label="Reorder below">{ex.low} {sku.base}</Sub>
                </dl>
              </div>
            </div>

            {/* 包装单位 */}
            <div className="border-b border-border px-5 py-4">
              <Title icon={Package} aside={`Base unit ${sku.base} / ${base.it}`}>Packaging units</Title>
              <table className="w-full overflow-hidden rounded-lg text-sm [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
                <thead><tr className="bg-muted text-left text-[11px] text-muted-foreground [&>th]:px-2.5 [&>th]:py-1.5 [&>th]:font-medium">
                  <th className="rounded-l-lg">Unit</th><th>Contains</th><th className="text-right">Wholesale</th><th className="rounded-r-lg text-right">Retail</th>
                </tr></thead>
                <tbody className="divide-y divide-border">
                  {sku.units.map((x) => (
                    <tr key={x.id} className="[&>td]:px-2.5 [&>td]:py-2">
                      <td><span className="font-medium">{x.name}</span> <span className="text-xs text-muted-foreground">{x.it}</span></td>
                      <td className="text-xs text-muted-foreground">{x.qty > 1 ? `${x.qty} ${sku.base}` : 'Base unit'}</td>
                      <td className="text-right font-medium tabular-nums">{eur(x.std)}</td>
                      <td className="text-right tabular-nums text-muted-foreground">{x.list != null ? eur(x.list) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 该客户的购买记录 */}
            <div className="px-5 py-4">
              <Title icon={ReceiptText} aside={rows[0] ? <>Last paid <span className="font-semibold text-foreground tabular-nums">{eur(rows[0].price)}</span> / {rows[0].unit}</> : undefined}>
                {cust && !cust.retail ? <>Bought by {custName} <span className="font-normal text-muted-foreground">· {rows.length}</span></> : 'Purchase history'}
              </Title>
              {!cust || cust.retail ? (
                <p className="rounded-lg bg-muted px-3 py-3 text-xs text-muted-foreground">Select a customer to see what they paid for this product.</p>
              ) : rows.length === 0 ? (
                <p className="rounded-lg bg-muted px-3 py-3 text-xs text-muted-foreground">{custName} hasn’t bought this product yet.</p>
              ) : (
                <table className="w-full text-xs [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
                  <thead><tr className="bg-muted text-left text-[11px] text-muted-foreground [&>th]:px-2.5 [&>th]:py-1.5 [&>th]:font-medium">
                    <th className="rounded-l-lg">Date</th><th>Order</th><th className="text-right">Qty</th><th className="text-right">Unit price</th><th className="text-right">Total</th><th className="rounded-r-lg">Branch</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    {rows.map((r) => {
                      const off = r.price < unitOf(sku, sku.defaultUnit).std;
                      return (
                        <tr key={r.id} className="[&>td]:px-2.5 [&>td]:py-2">
                          <td className="tabular-nums text-muted-foreground">{r.date}</td>
                          <td className="font-medium tabular-nums">{r.no}</td>
                          <td className="text-right tabular-nums">{r.qty} <span className="text-muted-foreground">{r.unit}</span></td>
                          <td className={'text-right tabular-nums ' + (off ? 'font-medium text-primary-strong' : '')}>{n2(r.price)}</td>
                          <td className="text-right font-semibold tabular-nums">{n2(r.total)}</td>
                          <td className="text-muted-foreground">{BRANCH_LABEL[r.branch]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/** 收款销账：对客户账户收款，和本单分开。 */
function CollectPayment({ open, onClose, customer }: { open: boolean; onClose: () => void; customer?: Customer }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Bank transfer');
  useEffect(() => { if (open) setAmount(customer && customer.unpaid > 0 ? raw2(customer.unpaid) : ''); }, [open, customer]);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Collect payment</DialogTitle><DialogDescription>Record a payment against the customer’s account. It is separate from the order on this page.</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3 text-sm">
            <span className="font-medium">{customer?.label ?? 'No customer selected'}</span>
            <span className={customer && customer.unpaid > 0 ? 'text-destructive' : 'text-muted-foreground'}>Unpaid <span className="font-semibold tabular-nums">{eur(customer?.unpaid ?? 0)}</span></span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm"><span className="text-xs text-muted-foreground">Amount (€)</span><Input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" className="mt-1 h-10 text-right tabular-nums" /></label>
            <label className="text-sm"><span className="text-xs text-muted-foreground">Method</span><Select value={method} onValueChange={setMethod} size="lg" triggerClassName="mt-1 w-full" options={PAY_METHODS.slice(0, 3).map((m) => ({ value: m, label: m }))} /></label>
          </div>
        </div>
        <DialogFooter><DialogCancel>Cancel</DialogCancel><DialogAction disabled={!customer || !(Number(amount) > 0)} onClick={onClose}>Record payment</DialogAction></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** 保存销售单（FormDialog pattern）：本单收款（全额 / 部分、可组合）+ 当场取货（按行选数量）+ 备注。 */
function SaveDialog({ open, onClose, customer, lines, final, onSaved }: { open: boolean; onClose: () => void; customer?: Customer; lines: Line[]; final: number; onSaved: () => void }) {
  const [paid, setPaid] = useState(true);
  const [mode, setMode] = useState<'full' | 'partial'>('full');
  const [pays, setPays] = useState<PayRow[]>([]);
  const [pickup, setPickup] = useState(false);
  const [pick, setPick] = useState<Record<number, number>>({});
  const [note, setNote] = useState('');
  useEffect(() => {
    if (!open) return;
    setPaid(true); setMode('full'); setPays([{ method: 'Cash', amount: raw2(final) }]);
    setPickup(false); setPick(Object.fromEntries(lines.map((l) => [l.key, l.qty]))); setNote('');
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const retail = !!customer?.retail;
  const sum = r2(pays.reduce((s, p) => s + (Number(p.amount) || 0), 0));
  const balanceUsed = pays.filter((p) => p.method === 'Account balance').reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const overBalance = balanceUsed > (customer?.balance ?? 0) + 0.005;
  const partial = mode === 'partial';
  const mismatch = paid && !partial && Math.abs(sum - final) > 0.005;
  const tooMuch = paid && partial && sum > final + 0.005;
  const ok = !paid || (!mismatch && !tooMuch && !overBalance && sum > 0);
  const owed = paid ? r2(Math.max(0, final - sum)) : final;
  const pickedPcs = lines.reduce((s, l) => s + (pick[l.key] ?? 0), 0);
  const status = !paid ? <><span className="font-semibold text-foreground tabular-nums">{eur(final)}</span> recorded as owed</>
    : mismatch ? <span className="text-destructive">Payments must add up to {eur(final)}</span>
    : tooMuch ? <span className="text-destructive">Payments exceed the final price</span>
    : overBalance ? <span className="text-destructive">More than the customer’s balance</span>
    : owed > 0 ? <>Paying <span className="font-semibold text-foreground tabular-nums">{eur(sum)}</span> · <span className="text-warning-text">{eur(owed)} owed</span></>
    : <span className="text-success-text">Paid in full · {eur(sum)}</span>;
  return (
    <FormDialog open={open} onOpenChange={(o) => !o && onClose()} title="Save sales order"
      description={<>{customer?.label} · final price <span className="font-semibold text-foreground tabular-nums">{eur(final)}</span></>}
      status={status} confirmLabel="Save order" confirmDisabled={!ok} onConfirm={onSaved}>
      <FormSection title="Payment" hint={retail ? 'Walk-in sales are paid in full now.' : 'Cash, card, transfer or account balance.'}
        control={<label className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">Collect now</span><Switch checked={paid} disabled={retail} onCheckedChange={setPaid} /></label>}>
        {paid && (
          <div className="space-y-3">
            {!retail && (
              <SlideTabs label="Payment amount" value={mode} onChange={setMode}
                items={[{ id: 'full', label: 'Full amount' }, { id: 'partial', label: 'Partial · rest owed' }]}
                className="flex h-9 w-fit items-center gap-0.5 rounded-[10px] border border-border p-0.5"
                itemClassName="h-full rounded-[7px] px-3 text-sm" activeClassName="font-semibold text-primary-strong" idleClassName="text-muted-foreground hover:text-foreground"
                indicatorClassName="rounded-[7px] bg-primary/10" />
            )}
            <div className="space-y-2">
              {pays.map((p, k) => (
                <div key={k} className="flex items-center gap-2">
                  <Select value={p.method} onValueChange={(v) => setPays((x) => x.map((r, j) => (j === k ? { ...r, method: v as PayRow['method'] } : r)))} size="lg" triggerClassName="w-52"
                    options={PAY_METHODS.filter((m) => m !== 'Account balance' || (customer?.balance ?? 0) > 0).map((m) => ({ value: m, label: m === 'Account balance' ? `Balance (${eur(customer?.balance ?? 0)})` : m }))} />
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                    <Input value={p.amount} inputMode="decimal" placeholder="0.00" onChange={(e) => setPays((x) => x.map((r, j) => (j === k ? { ...r, amount: e.target.value } : r)))} className="h-10 pl-7 text-right tabular-nums" aria-label={`${p.method} amount`} />
                  </div>
                  <Button variant="ghost" size="icon" aria-label="Remove payment method" disabled={pays.length === 1} className="size-10 hover:bg-[color-mix(in_srgb,var(--destructive)_12%,transparent)] hover:text-destructive" onClick={() => setPays((x) => x.filter((_, j) => j !== k))}><X /></Button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <div className="flex gap-4">
                <button type="button" className="inline-flex items-center gap-1 font-medium text-primary hover:underline" onClick={() => setPays((x) => [...x, { method: 'Card', amount: raw2(Math.max(0, final - sum)) }])}><Plus className="size-3.5" />Split payment</button>
                {mismatch && <button type="button" className="font-medium text-primary hover:underline" onClick={() => setPays((x) => x.map((r, j) => (j === x.length - 1 ? { ...r, amount: raw2(Math.max(0, (Number(r.amount) || 0) + final - sum)) } : r)))}>Fill the difference</button>}
              </div>
              <span className="tabular-nums text-muted-foreground">Entered <span className={'font-semibold ' + (mismatch || tooMuch ? 'text-destructive' : 'text-foreground')}>{eur(sum)}</span> of {eur(final)}</span>
            </div>
          </div>
        )}
      </FormSection>

      <FormSection title="Pickup" hint="Goods the customer takes now. Creates a pickup note and takes them out of stock."
        control={<label className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">Taken now</span><Switch checked={pickup} onCheckedChange={setPickup} /></label>}>
        {pickup && (
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="flex items-center justify-between bg-muted px-3 py-2 text-xs text-muted-foreground">
              <span>{pickedPcs} pcs taken now</span>
              <span className="flex gap-3">
                <button type="button" className="font-medium text-primary hover:underline" onClick={() => setPick(Object.fromEntries(lines.map((l) => [l.key, l.qty])))}>All</button>
                <button type="button" className="font-medium text-primary hover:underline" onClick={() => setPick({})}>None</button>
              </span>
            </div>
            <div className="divide-y divide-border">
              {lines.map((l) => {
                const s = skuOf(l.sku);
                return (
                  <div key={l.key} className="flex items-center gap-3 px-3 py-2 text-sm">
                    <img src={s.image} alt="" className="size-8 rounded-md object-cover" />
                    <span className="min-w-0 flex-1 truncate"><span className="font-medium">{s.name}</span> <span className="text-xs text-muted-foreground">{s.spec}</span></span>
                    <span className="text-xs tabular-nums text-muted-foreground">of {l.qty}</span>
                    <QuantityStepper value={pick[l.key] ?? 0} label={`pickup quantity for ${s.name}`} onInputChange={(v) => setPick((p) => ({ ...p, [l.key]: Math.min(l.qty, Math.max(0, Number(v) || 0)) }))}
                      onStep={(d) => setPick((p) => ({ ...p, [l.key]: Math.min(l.qty, Math.max(0, (p[l.key] ?? 0) + d)) }))} canDecrease={(pick[l.key] ?? 0) > 0} canIncrease={(pick[l.key] ?? 0) < l.qty} containerClassName="w-20" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </FormSection>

      <FormSection title="Notes">
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything the warehouse or finance should know" rows={2} className="resize-none" />
      </FormSection>
    </FormDialog>
  );
}
