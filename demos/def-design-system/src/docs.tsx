import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { Select } from '@/components/ui/select';
import DocumentProgressSteps from '@/components/shared/DocumentProgressSteps';
import TablePagination from '@/components/shared/TablePagination';
import { SearchInput } from '@/components/shared/SearchInput';
import { ArrowRight, Check, Loader2, Plus } from 'lucide-react';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { DataViz } from './dataviz';
import { ButtonSizes, Formats, Icons, MoreInputs, Overlays, SpacingScale, States } from './more';

const sections = [
  ['principles', 'Principles'],
  ['how', 'How it works'],
  ['colour', 'Colour'],
  ['type', 'Typography'],
  ['space', 'Spacing & shape'],
  ['icons', 'Icons'],
  ['buttons', 'Buttons'],
  ['forms', 'Forms'],
  ['tags', 'Tags & status'],
  ['progress', 'Document progress'],
  ['tables', 'Tables & filters'],
  ['dataviz', 'Data visualisation'],
  ['states', 'Loading, empty, error'],
  ['overlays', 'Dialogs & overlays'],
  ['confirm', 'Confirmations'],
  ['formats', 'Dates & numbers'],
  ['check', 'Accessibility check'],
] as const;

function Section({ id, n, title, intro, children }: { id: string; n: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <section id={id} data-section={id} className="scroll-mt-6 pt-14">
      <div className="mb-6 flex items-baseline gap-3">
        <span className="text-xs text-muted-foreground tabular-nums">{n}</span>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{intro}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wide text-muted-foreground first:mt-0">{children}</p>;
}

/* ---------- colour helpers: read live values from the stylesheet ---------- */
function resolveColor(token: string): { hex: string; rgb: [number, number, number] } {
  const probe = document.createElement('span');
  probe.style.cssText = `position:absolute;visibility:hidden;background:var(${token})`;
  document.body.appendChild(probe);
  const css = getComputedStyle(probe).backgroundColor;
  document.body.removeChild(probe);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  const hex = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
  return { hex, rgb: [r, g, b] };
}
function luminance([r, g, b]: [number, number, number]) {
  const f = (v: number) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(a: [number, number, number], b: [number, number, number]) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const colourGroups: { title: string; items: [string, string][] }[] = [
  { title: 'Surfaces & lines', items: [['--surface-base', 'Page background and quiet areas'], ['--surface-raised', 'Cards, drawers, popovers'], ['--border', 'Table, card and section dividers'], ['--input', 'Input and outlined-button borders']] },
  { title: 'Text', items: [['--foreground', 'Body text and values'], ['--muted-foreground', 'Helper text and table headers']] },
  { title: 'Brand', items: [['--primary', 'The one main action, links, the selected state'], ['--primary-tint', 'Light status fills only. Never used for text']] },
  { title: 'Status', items: [['--success', 'Received, paid, in stock'], ['--warning', 'Needs a look: partial, near expiry'], ['--destructive', 'Errors and irreversible actions']] },
  { title: 'Data series', items: [['--data-blue', 'Same business value, same colour in every chart and tag'], ['--data-green', 'Same business value, same colour in every chart and tag'], ['--data-orange', 'Same business value, same colour in every chart and tag'], ['--data-purple', 'Same business value, same colour in every chart and tag'], ['--data-cyan', 'Same business value, same colour in every chart and tag']] },
];

function Colour() {
  const [selected, setSelected] = useState('--primary');
  const [values, setValues] = useState<Record<string, { hex: string; rgb: [number, number, number] }>>({});
  useEffect(() => {
    const next: typeof values = {};
    colourGroups.forEach((g) => g.items.forEach(([t]) => { next[t] = resolveColor(t); }));
    next['--white'] = { hex: '#ffffff', rgb: [255, 255, 255] };
    setValues(next);
  }, []);
  const cur = values[selected];
  const usage = colourGroups.flatMap((g) => g.items).find(([t]) => t === selected)?.[1];
  const onWhite = cur ? contrast(cur.rgb, [255, 255, 255]) : 0;
  const base = values['--surface-base'];
  const onBase = cur && base ? contrast(cur.rgb, base.rgb) : 0;
  const pass = (v: number) => (v >= 4.5 ? 'AA' : v >= 3 ? 'Large text only' : 'Fails');
  return (
    <div className="grid grid-cols-[1fr_260px] gap-8">
      <div className="space-y-6">
        {colourGroups.map((g) => (
          <div key={g.title}>
            <Sub>{g.title}</Sub>
            <div className="flex flex-wrap gap-3">
              {g.items.map(([token]) => (
                <button key={token} type="button" data-token={token} onClick={() => setSelected(token)} aria-pressed={selected === token}
                  className={`w-28 rounded-lg border bg-card p-2 text-left transition-shadow ${selected === token ? 'ring-2 ring-ring' : 'hover:shadow-sm'}`}>
                  <span className="block h-12 rounded-md border" style={{ background: `var(${token})` }} />
                  <span className="mt-2 block truncate font-mono text-[10px]">{token}</span>
                  <span className="block font-mono text-[10px] text-muted-foreground">{values[token]?.hex ?? '…'}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        <p className="rounded-lg bg-card p-4 text-xs text-muted-foreground">
          <strong className="text-foreground">Brand blue was darkened</strong> from #197afa to #1366d6 so white text on it passes WCAG AA: contrast 4.03 → 5.39. The bright value stays as <span className="font-mono">--primary-tint</span> for soft fills.
        </p>
      </div>
      <Card className="sticky top-6 h-fit self-start" data-detail>
        <CardHeader>
          <CardTitle className="font-mono text-xs">{selected}</CardTitle>
          <CardDescription>{usage}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <span className="block h-16 rounded-md border" style={{ background: `var(${selected})` }} />
          <p className="font-mono text-sm tabular-nums">{cur?.hex}</p>
          <dl className="space-y-1 text-xs">
            <div className="flex justify-between"><dt className="text-muted-foreground">White text on it</dt><dd className="tabular-nums">{onWhite.toFixed(2)} · {pass(onWhite)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">On page background</dt><dd className="tabular-nums">{onBase.toFixed(2)} · {pass(onBase)}</dd></div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

const typeScale: [string, string, string, string][] = [
  ['Page title', 'text-xl font-semibold', 'text-xl font-semibold', '销售订单 Sales orders'],
  ['Section title', 'text-base font-semibold', 'text-base font-semibold', '收货记录 Receiving'],
  ['Component title', 'text-sm font-semibold', 'text-sm font-semibold', '客户资料 Customer details'],
  ['Body', 'text-sm', 'text-sm', '订购 24 件，已收 18 件'],
  ['Field label', 'text-xs font-semibold uppercase tracking-wide', 'text-xs font-semibold uppercase tracking-wide text-muted-foreground', 'Invoice name 发票名称'],
  ['Helper text', 'text-xs text-muted-foreground', 'text-xs text-muted-foreground', 'Saved in this preview. 已保存'],
];

function Typography() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {[['Inter Variable', 'Latin text and numerals'], ['Noto Sans SC Variable', '中文，与英文同一字重'], ['One stack', 'No per-page font swaps']].map(([a, b]) => (
          <div key={a} className="rounded-lg bg-card p-4"><p className="text-sm font-semibold">{a}</p><p className="mt-1 text-xs text-muted-foreground">{b}</p></div>
        ))}
      </div>
      <div className="overflow-hidden rounded-lg bg-card">
        {typeScale.map(([name, cls, sample, text]) => (
          <div key={name} data-type-row className="grid grid-cols-[160px_1fr_220px] items-baseline gap-4 border-b px-4 py-3 last:border-b-0">
            <span className="text-xs text-muted-foreground">{name}</span>
            <span className={sample}>{text}</span>
            <span className="font-mono text-[10px] text-muted-foreground">{cls}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-card p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Numbers line up</p>
          <div className="space-y-1 text-sm tabular-nums">
            {[['SO-0842', '€ 438.00'], ['SO-0841', '€ 1,216.50'], ['SO-0840', '€ 84.00']].map(([a, b]) => (
              <div key={a} className="flex justify-between"><span className="font-mono">{a}</span><span>{b}</span></div>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-card p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Italian names stay as written</p>
          <p className="text-sm">Documento di Trasporto · <span className="font-mono">DDT-2026-0113</span></p>
          <p className="mt-1 text-xs text-muted-foreground">Amounts right-aligned with tabular numerals. SKUs and document numbers in mono.</p>
        </div>
      </div>
    </div>
  );
}

function SpaceShape() {
  const radii = [['--shape-none', 'None', 'Table edges inside cards'], ['--shape-sm', 'Small', 'Badges, status tags'], ['--shape-md', 'Medium', 'Inputs and buttons'], ['--shape-lg', 'Large', 'Cards, dialogs, popovers'], ['--shape-full', 'Full', 'Switch, avatar, radio']];
  const [vals, setVals] = useState<Record<string, string>>({});
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    setVals(Object.fromEntries(radii.map(([t]) => [t, cs.getPropertyValue(t).trim()])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <Sub>Five radii. Nothing in between.</Sub>
        <div className="grid grid-cols-5 gap-3">
          {radii.map(([t, name, use]) => (
            <div key={t} data-radius className="rounded-lg bg-card p-3">
              <span className="block h-14 border-2 border-primary bg-primary/10" style={{ borderRadius: `var(${t})` }} />
              <p className="mt-2 text-xs font-semibold">{name}</p>
              <p className="font-mono text-[10px] text-muted-foreground">{vals[t] ?? '…'}</p>
              <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{use}</p>
            </div>
          ))}
        </div>
      </div>
      <SpacingScale />
      <div>
        <div className="rounded-lg bg-card p-4">
          <Sub>Borders over shadows</Sub>
          <div className="flex gap-3">
            <div className="flex-1 rounded-lg border bg-card p-3 text-xs">Standard card: hairline border, no shadow</div>
            <div className="flex-1 rounded-lg bg-card p-3 text-xs" style={{ boxShadow: 'var(--elevation-xl)' }}>Floating layers only: dialogs, popovers</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Buttons() {
  const [state, setState] = useState<'idle' | 'saving' | 'done'>('idle');
  const click = () => { setState('saving'); setTimeout(() => setState('done'), 900); setTimeout(() => setState('idle'), 2600); };
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-card p-5">
        <Sub>One main action per area</Sub>
        <div className="flex flex-wrap items-center gap-3">
          <Button data-demo="primary"><Plus />New order</Button>
          <Button variant="outline">Save draft</Button>
          <Button variant="secondary">Export</Button>
          <Button variant="ghost">Cancel</Button>
          <span className="mx-2 h-6 w-px bg-border" />
          <Button variant="destructive">Void invoice</Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Secondary actions stay neutral. Destructive actions sit apart from routine ones.</p>
      </div>
      <div className="rounded-lg bg-card p-5">
        <Sub>Every async action says what it is doing</Sub>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={click} disabled={state === 'saving'} data-demo="save">
            {state === 'saving' ? <Loader2 className="animate-spin" /> : state === 'done' ? <Check /> : null}
            {state === 'saving' ? 'Saving…' : state === 'done' ? 'Saved' : 'Save changes'}
          </Button>
          <Button disabled>Unavailable</Button>
          <span className="text-xs text-muted-foreground" aria-live="polite">{state === 'saving' ? 'Pending: button disabled, spinner shown.' : state === 'done' ? 'Success confirmed in the button itself.' : 'Click to see pending and success.'}</span>
        </div>
      </div>
      <ButtonSizes />
    </div>
  );
}

function Forms() {
  const [invoice, setInvoice] = useState('');
  const [touched, setTouched] = useState(false);
  const [qty, setQty] = useState('24');
  const [pay, setPay] = useState('bank');
  const [search, setSearch] = useState('');
  const invalid = touched && !invoice.trim();
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Customer details 客户资料</CardTitle><CardDescription>Errors sit next to the field, not in a toast.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div><label htmlFor="d-customer" className="mb-2 block text-xs font-semibold">Customer name</label><Input id="d-customer" defaultValue="Luce Beauty Lab" /></div>
          <div><label htmlFor="d-code" className="mb-2 block text-xs font-semibold">Customer code · read only</label><Input id="d-code" value="C-10042" disabled readOnly /></div>
          <div>
            <label htmlFor="d-invoice" className="mb-2 block text-xs font-semibold">Invoice name <span className="text-destructive">*</span></label>
            <Input id="d-invoice" value={invoice} placeholder="Enter invoice name" aria-invalid={invalid} onBlur={() => setTouched(true)} onChange={(e) => { setInvoice(e.target.value); setTouched(true); }} />
            {invalid ? <p className="mt-2 text-xs text-destructive">Invoice name is required.</p> : null}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Fast entry 高频录入</CardTitle><CardDescription>Search, options and quantities share one height.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <SearchInput aria-label="Search SKU or product" placeholder="Search SKU or product" className="w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
          <p className="text-xs text-muted-foreground">{search ? `Searching for: ${search}` : 'Name or code search is as fast as a barcode scan.'}</p>
          <div className="flex items-center gap-4">
            <Select value={pay} onValueChange={setPay} options={[{ value: 'bank', label: 'Bank transfer' }, { value: 'cash', label: 'Cash' }, { value: 'card', label: 'Card' }]} ariaLabel="Payment method" />
            <QuantityStepper value={qty} onInputChange={setQty} onStep={(d) => setQty(String(Math.max(0, (Number(qty) || 0) + d)))} canDecrease={Number(qty) > 0} label="Quantity" />
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <label className="flex items-center gap-2"><Checkbox defaultChecked />Gift line</label>
            <label className="flex items-center gap-2"><Switch defaultChecked />Direct dispatch</label>
          </div>
        </CardContent>
      </Card>
      <div className="col-span-2 -mt-6"><MoreInputs /></div>
    </div>
  );
}

function Tags() {
  const map: [string, React.ComponentProps<typeof Badge>['variant'], string][] = [
    ['Draft', 'secondary', 'Not yet submitted'],
    ['In progress', 'info', 'Someone is working on it'],
    ['Awaiting review', 'warning', 'Needs a decision'],
    ['Received', 'success', 'Complete'],
    ['Overdue', 'destructive', 'Past its due date'],
    ['Cancelled', 'outline', 'Closed, no further action'],
  ];
  return (
    <div className="grid grid-cols-[1fr_1fr] gap-6">
      <div className="overflow-hidden rounded-lg bg-card">
        {map.map(([label, variant, meaning]) => (
          <div key={label} data-tag className="flex items-center justify-between border-b px-4 py-3 last:border-b-0">
            <Badge variant={variant}>{variant === 'success' ? <Check /> : null}{label}</Badge>
            <span className="text-xs text-muted-foreground">{meaning}</span>
          </div>
        ))}
      </div>
      <div className="space-y-3 rounded-lg bg-card p-5 text-sm">
        <p className="font-semibold">Rules</p>
        <ul className="list-disc space-y-2 pl-5 text-xs leading-5 text-muted-foreground">
          <li>Status is a word first. Colour reinforces it, never replaces it.</li>
          <li>One status map per entity. The same value is the same tag on every page.</li>
          <li>Light tinted fill, dark text, small radius. No pills for status.</li>
          <li>A tag is informational. If it can be clicked, it is a button.</li>
        </ul>
      </div>
    </div>
  );
}

function Progress() {
  const [receipt, setReceipt] = useState<'pending' | 'partial' | 'done'>('partial');
  const label = receipt === 'done' ? 'Fully received' : receipt === 'partial' ? 'Partial receipt' : 'Awaiting delivery';
  return (
    <Card>
      <CardHeader><CardTitle>Purchase order · PO-0842</CardTitle><CardDescription>Partial is its own state: goods have arrived, but not all of them.</CardDescription></CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-3">
          {([['pending', 'Awaiting delivery'], ['partial', 'Partial receipt'], ['done', 'Fully received']] as const).map(([v, l]) => (
            <Button key={v} variant={receipt === v ? 'default' : 'outline'} aria-pressed={receipt === v} onClick={() => setReceipt(v)}>{l}</Button>
          ))}
        </div>
        <DocumentProgressSteps ariaLabel="Purchase order progress" steps={[{ label: 'Edit', state: 'done' }, { label: 'Ordered', state: 'done' }, { label: 'Received', state: receipt }]} />
        <Badge variant={receipt === 'done' ? 'success' : receipt === 'partial' ? 'warning' : 'secondary'}>{label}</Badge>
      </CardContent>
    </Card>
  );
}

const orders = [['SO-0842', 'Luce Beauty Lab', 'Ready', '€ 438.00'], ['SO-0841', 'Studio Aurora', 'Review', '€ 216.50'], ['SO-0840', 'Belle Mani', 'Dispatched', '€ 684.00'], ['SO-0839', 'Luce Beauty Lab', 'Ready', '€ 128.00'], ['SO-0838', 'Studio Aurora', 'Review', '€ 342.50'], ['SO-0837', 'Belle Mani', 'Dispatched', '€ 198.00'], ['SO-0836', 'Luce Beauty Lab', 'Ready', '€ 462.00'], ['SO-0835', 'Studio Aurora', 'Ready', '€ 324.50'], ['SO-0834', 'Belle Mani', 'Dispatched', '€ 186.00']];

function TablesFilters() {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const visible = orders.filter((o) => (tab === 'all' || o[2].toLowerCase() === tab) && o.join(' ').toLowerCase().includes(search.toLowerCase()));
  const pages = Math.max(1, Math.ceil(visible.length / 3));
  const actual = Math.min(page, pages);
  const rows = visible.slice((actual - 1) * 3, actual * 3);
  return (
    <Card>
      <CardHeader><CardTitle>Sales orders 销售订单</CardTitle><CardDescription>A list exists to find one row. It always has filters and search.</CardDescription></CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={(v) => { setTab(v); setPage(1); }}>
          <TabsList>
            {[['all', 'All'], ['review', 'Review'], ['ready', 'Ready']].map(([v, l]) => (
              <TabsTrigger key={v} value={v}>{l}<span className="ml-2 text-xs text-muted-foreground">{v === 'all' ? orders.length : orders.filter((o) => o[2].toLowerCase() === v).length}</span></TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="mb-4 mt-5 flex gap-3">
          <SearchInput className="w-full" aria-label="Search orders" placeholder="Search order or customer" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          {search ? <Button variant="outline" onClick={() => setSearch('')}>Clear</Button> : null}
        </div>
        <Table>
          <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map(([o, c, s, a]) => (
              <TableRow key={o}><TableCell className="whitespace-nowrap font-medium">{o}</TableCell><TableCell>{c}</TableCell><TableCell><Badge variant={s === 'Review' ? 'warning' : s === 'Ready' ? 'info' : 'success'}>{s}</Badge></TableCell><TableCell className="text-right tabular-nums">{a}</TableCell></TableRow>
            ))}
            {!rows.length ? <TableRow><TableCell colSpan={4}>No orders match your search.</TableCell></TableRow> : null}
          </TableBody>
        </Table>
        <div className="mt-4 border-t pt-4"><TablePagination page={actual} totalPages={pages} onPageChange={setPage} summary={`${visible.length} matching orders`} /></div>
      </CardContent>
    </Card>
  );
}

function Confirmations() {
  const [qty, setQty] = useState(6);
  const [lines, setLines] = useState(['Dye 4.1', 'Developer 6%']);
  const [resume, setResume] = useState(false);
  const [current, setCurrent] = useState('Current order · 3 items');
  const [open, setOpen] = useState(false);
  const [voidOpen, setVoidOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [toast, setToast] = useState('');
  const hold = () => { setToast('Held: Zhang San, 5 items'); setTimeout(() => setToast(''), 2400); };
  const Level = ({ n, name, rule, eg, tint, children }: { n: string; name: string; rule: string; eg: string; tint?: boolean; children: React.ReactNode }) => (
    <div data-level={n} className={`flex flex-col rounded-lg p-4 ${tint ? 'bg-status-info-surface' : 'bg-card'}`}>
      <p className="text-xs text-muted-foreground">Level {n}</p>
      <p className="mt-1 text-sm font-semibold">{name}</p>
      <p className="mt-1 text-xs text-muted-foreground">{rule}</p>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">e.g. {eg}</p>
      <div className="mt-2 flex min-h-24 flex-1 flex-col justify-start gap-2 rounded-md border bg-card p-3">{children}</div>
    </div>
  );
  return (
    <div className="grid grid-cols-2 gap-3">
      <Level n="1" name="Reversible" rule="Just do it. No dialog." eg="Edit a draft order">
        {lines.map((l) => (
          <div key={l} className="flex items-center justify-between gap-2 text-xs">
            <span className="truncate">{l}</span>
            <span className="flex items-center gap-1">
              {l === 'Dye 4.1' ? <Button size="icon-xs" variant="outline" aria-label="Increase quantity" data-demo="qty" onClick={() => setQty((q) => q + 1)}><Plus /></Button> : null}
              <span className="w-6 text-right tabular-nums">{l === 'Dye 4.1' ? qty : 2}</span>
              <Button size="icon-xs" variant="ghost" aria-label={`Remove ${l}`} data-demo="remove" onClick={() => setLines((x) => x.filter((y) => y !== l))}>×</Button>
            </span>
          </div>
        ))}
        {lines.length < 2 ? <Button size="xs" variant="ghost" className="self-start" onClick={() => setLines(['Dye 4.1', 'Developer 6%'])}>Reset</Button> : null}
      </Level>
      <Level n="2" name="Reversible, costly" rule="Ask, and say what is lost." eg="Resume a held order">
        <p className="text-xs text-muted-foreground">{current}</p>
        <Button size="sm" variant="outline" className="self-start" data-demo="resume" onClick={() => setResume(true)}>Resume Zhang San</Button>
        <ConfirmDialog open={resume} onOpenChange={setResume} title="Replace the current order?"
          description="The 3 items on the current order will be cleared. Zhang San’s 5 items take their place."
          cancelLabel="Keep current" confirmLabel="Replace" onConfirm={() => { setCurrent('Zhang San · 5 items'); setResume(false); }} />
      </Level>
      <Level n="3" name="Irreversible" rule="Moves stock or money. List the consequences." eg="Post a stocktake, void an invoice">
        <Button size="sm" variant="destructive" className="self-start" onClick={() => setOpen(true)} data-demo="stocktake">Post stocktake</Button>
        <Button size="sm" variant="outline" className="self-start" onClick={() => setVoidOpen(true)} data-demo="void">Void invoice</Button>
        <ConfirmDialog open={open} onOpenChange={setOpen} title="Post stocktake?"
          description={<ul className="space-y-1"><li>Adjust stock for 12 SKUs</li><li>Record €340.50 in losses, posted to finance</li><li className="font-semibold text-destructive">This cannot be undone</li></ul>}
          cancelLabel="Cancel" confirmLabel="Post stocktake" confirmVariant="destructive" onConfirm={() => setOpen(false)} />
        <ConfirmDialog open={voidOpen} onOpenChange={(o) => { setVoidOpen(o); if (!o) setReason(''); }} title="Void invoice FT-2026-018?"
          description={<div className="space-y-2"><p>The invoice number cannot be reused. A reason is required.</p><Input aria-label="Reason" placeholder="Reason, e.g. wrong customer" value={reason} onChange={(e) => setReason(e.target.value)} /></div>}
          cancelLabel="Cancel" confirmLabel="Void invoice" confirmVariant="destructive" confirmDisabled={!reason.trim()} onConfirm={() => { setVoidOpen(false); setReason(''); }} />
      </Level>
      <Level n="4" name="Counter queue" rule="A customer is waiting. Act now, show a toast." eg="Hold an order" tint>
        <Button size="sm" variant="outline" className="self-start" onClick={hold} data-demo="hold">Hold order</Button>
        {toast ? <p className="self-start rounded-full bg-foreground px-3 py-1.5 text-xs text-background" role="status">{toast}</p> : null}
      </Level>
    </div>
  );
}

function Check_() {
  const rows = [['Violations found by axe-core', 282, 7], ['Failing rules', 11, 1]] as const;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-3">
        {[['17', 'screens and dialogs audited against WCAG 2.2 A / AA'], ['282 → 7', 'axe-core violations, before and after'], ['11 → 1', 'failing rules; the last is a documented exception'], ['4.03 → 5.39', 'white text on the primary blue']].map(([a, b]) => (
          <div key={a} className="rounded-lg bg-card p-4"><p className="text-2xl font-semibold tabular-nums">{a}</p><p className="mt-2 text-xs text-muted-foreground">{b}</p></div>
        ))}
      </div>
      <div className="rounded-lg bg-card p-5">
        {rows.map(([label, before, after]) => (
          <div key={label} className="mb-4 last:mb-0">
            <p className="mb-2 text-xs text-muted-foreground">{label}</p>
            <div className="flex items-center gap-3"><span className="w-12 text-xs">Before</span><span className="h-3 rounded-sm bg-destructive" style={{ width: '100%' }} /><span className="text-xs tabular-nums">{before}</span></div>
            <div className="mt-1 flex items-center gap-3"><span className="w-12 text-xs">After</span><span className="h-3 rounded-sm bg-primary" style={{ width: `${Math.max(2, (after / before) * 100)}%` }} /><span className="text-xs tabular-nums">{after}</span></div>
          </div>
        ))}
        <p className="mt-4 text-xs leading-5 text-muted-foreground">Most failures came from a few shared pieces, so the fixes were systemic: the brand blue, status text tokens, accessible names on every select and number input, a keyboard-operable tab strip. The 7 remaining are 16px stepper arrows beside a full-size input, covered by WCAG 2.5.8’s equivalent-control exception.</p>
      </div>
    </div>
  );
}

export default function Docs() {
  const [active, setActive] = useState('principles');
  const [collapsed, setCollapsed] = useState(false);
  const spy = useRef<IntersectionObserver>();
  useEffect(() => {
    spy.current = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (hit) setActive((hit.target as HTMLElement).dataset.section!);
    }, { rootMargin: '-10% 0px -70% 0px' });
    document.querySelectorAll('[data-section]').forEach((el) => spy.current!.observe(el));
    return () => spy.current?.disconnect();
  }, []);
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const nav = useMemo(() => sections, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className={`sticky top-0 h-screen shrink-0 overflow-y-auto border-r px-3 py-5 transition-[width] ${collapsed ? 'w-14' : 'w-56'}`}>
        {!collapsed ? <div className="mb-5 px-2"><p className="text-sm font-semibold">DEF Beauty ERP</p><p className="text-[11px] text-muted-foreground">Design system · component library</p></div> : null}
        <Button variant="outline" size="sm" className="mb-4 w-full justify-start" data-collapse onClick={() => setCollapsed((c) => !c)}>{collapsed ? '»' : '« Collapse'}</Button>
        <nav aria-label="Design system sections">
          {nav.map(([id, label], i) => (
            <button key={id} type="button" data-nav={id} onClick={() => go(id)} aria-current={active === id ? 'true' : undefined}
              className={`mb-0.5 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors ${active === id ? 'bg-card font-semibold text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              <span className="w-4 tabular-nums text-[10px]">{String(i + 1).padStart(2, '0')}</span>
              {!collapsed ? <span>{label}</span> : null}
            </button>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 px-10 pb-24 pt-10" id="docs-main">
        <p className="text-xs text-muted-foreground">DEF Beauty Supply · B2B wholesale ERP</p>
        <h1 className="mt-2 text-6xl font-semibold tracking-tight">Design system</h1>

        <Section id="principles" n="01" title="Principles" intro="Fourteen rules: six about the people who use it, eight about building an ERP they can trust.">
          {([
            ['Start from the people', 'grid-cols-3', [
              ['Design for the busiest seat', 'Five of fifteen staff live in one screen, sales entry, with a customer standing in front of them. An extra click there is paid dozens of times a day.'],
              ['Experts, not beginners', 'Everyone repeats the same pages every day. Speed of repeated use matters more than onboarding hints.'],
              ['Keep the model they already have', 'Staff think in documents, statuses and posting, learned on the old system. Reuse those words; invent no new metaphors.'],
              ['Work gets interrupted', 'A customer adds one more item while the next one waits. Any flow over five fields can be paused and resumed, and says what it restored.'],
              ['Show whose turn it is', 'Sales, warehouse, driver and finance hand work to each other. A document always answers: who acts next, and where is it stuck.'],
              ['Do not pick a side', 'When two roles need different things, such as invoicing at close or after payment, the system supports both rhythms.'],
            ]],
            ['Build it like an ERP', 'grid-cols-4', [
              ['Balanced beats fast', 'Totals follow the supplier invoice’s rounding order. A three-cent gap breaks every reconciliation.'],
              ['Find the row', 'A list exists to locate one document. No filter, no list.'],
              ['Dense by default', 'Tables carry the information. A screen that shows fewer rows to look calmer is a loss.'],
              ['Data is money', 'Stock and amounts change only through audited operations, and every costly action records who did it.'],
              ['Say what will happen', 'Irreversible actions list their consequence. Only the counter queue skips confirmation.'],
              ['“Done” is not final', 'Customers add goods after checkout, even after the delivery note. Completed documents stay open to additions.'],
              ['AI fills, people decide', 'Document recognition writes into editable fields and flags gaps. It never submits.'],
              ['Colours have jobs', 'Blue is the one main action and the selected state. Green, orange and red are status. The rest is ink and grey.'],
            ]],
          ] as const).map(([group, cols, list], g) => (
            <div key={group} className={g ? 'mt-8' : ''}>
              <Sub>{group}</Sub>
              <div className={`grid gap-3 ${cols}`}>
                {list.map(([t, b], i) => (
                  <article key={t} data-principle className="flex min-h-32 flex-col rounded-lg bg-card p-4">
                    <span className="text-[10px] tabular-nums text-muted-foreground">{String(i + 1 + (g ? 6 : 0)).padStart(2, '0')}</span>
                    <h3 className="mt-3 text-sm font-semibold">{t}</h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{b}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </Section>

        <Section id="how" n="02" title="How it works" intro="Change the library once; every page that uses it follows.">
          <div className="flex items-stretch gap-2">
            {[
              ['UX.md', 'Who the users are and what they do. Every line tagged with its evidence.'],
              ['index.css tokens', 'The single source of colour, radius, layers. Pages use semantic names only.'],
              ['UI components', 'Buttons, fields, tags, tabs, tables. shadcn radix-lyra on those tokens.'],
              ['Shared patterns', 'Document progress, filter bars, pagination: one version for every page.'],
              ['Pages', 'Pages compose components. They never restyle them.'],
            ].map(([t, b], i, arr) => (
              <React.Fragment key={t}>
                <article data-flow className="flex-1 rounded-lg bg-card p-4"><p className="text-sm font-semibold">{t}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{b}</p></article>
                {i < arr.length - 1 ? <ArrowRight className="mt-6 size-4 shrink-0 text-muted-foreground" aria-hidden /> : null}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-card p-4"><p className="text-sm font-semibold">AGENTS.md</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Tells the coding agent to read UX.md and this document, reuse existing components and run the checks before it finishes.</p></div>
            <div className="rounded-lg bg-card p-4"><p className="text-sm font-semibold">Checks</p><p className="mt-1 text-xs leading-5 text-muted-foreground">axe-core on the live code for accessibility, and Playwright tests on the money and stock rules that cannot be undone.</p></div>
          </div>
        </Section>

        <Section id="colour" n="03" title="Colour" intro="Values are read live from the stylesheet. Pages use semantic names only.">
          <Colour />
        </Section>
        <Section id="type" n="04" title="Typography" intro="Four sizes, six roles, Chinese and English together.">
          <Typography />
        </Section>
        <Section id="space" n="05" title="Spacing & shape" intro="A 4px scale and five radii, so similar pages look the same.">
          <SpaceShape />
        </Section>
        <Section id="icons" n="06" title="Icons" intro="One slot, one stroke, three sizes, always named.">
          <Icons />
        </Section>
        <Section id="buttons" n="07" title="Buttons" intro="A clear hierarchy, and honest feedback while work is pending.">
          <Buttons />
        </Section>
        <Section id="forms" n="08" title="Forms" intro="Labels above, errors beside, high-frequency entry controls at one height.">
          <Forms />
        </Section>
        <Section id="tags" n="09" title="Tags & status" intro="One status map per entity, used everywhere.">
          <Tags />
        </Section>
        <Section id="progress" n="10" title="Document progress" intro="Where a document is, and what is partly done.">
          <Progress />
        </Section>
        <Section id="tables" n="11" title="Tables & filters" intro="The standard list page: status tabs, search, table, pagination.">
          <TablesFilters />
        </Section>
        <Section id="dataviz" n="12" title="Data visualisation" intro="Charts read the same colour tokens and number formats as the tables beside them.">
          <DataViz />
        </Section>
        <Section id="states" n="13" title="Loading, empty, error" intro="What a list shows before, without and instead of data.">
          <States />
        </Section>
        <Section id="overlays" n="14" title="Dialogs & overlays" intro="Five layers, each for one kind of interruption.">
          <Overlays />
        </Section>
        <Section id="confirm" n="15" title="Confirmations" intro="Ask by consequence. Skip the dialog only where someone is waiting.">
          <Confirmations />
        </Section>
        <Section id="formats" n="16" title="Dates & numbers" intro="One format for every date, amount and document number.">
          <Formats />
        </Section>
        <Section id="check" n="17" title="Accessibility check" intro="Audited on the live code, fixed in the shared pieces.">
          <Check_ />
        </Section>
      </main>
    </div>
  );
}
