import React, { useEffect, useState } from 'react';
import { ArrowRight, Bell, Check, Database, Eye, FileText, Laptop, Lock, Plus, RotateCcw, ShieldCheck, Smartphone, Sparkles, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { SlideTabs } from './motion';
import { eur } from './order-deliveries';
import { AGENT_POS, AGENT_STATUS, NOTICES, OPPORTUNITIES, PLAN_STEP_DETAIL, PLAN_STEPS, SUPPLIER_RULES, TASKS } from './agent-data';
import { KeyValues, type ResultCard } from './agent-panel';
import { EvidenceView } from './agent-evidence';
import { EvidenceView as EvidenceV1 } from './agent-v1/agent-evidence';
import { SupplierScoreCard } from './agent-v1/accuracy';
import { DIMS, INTENT, StopSlider, parseMentions } from './agent-v1/review-dialog';
import { OpportunityCard, SUPPLIERS, SupplierPicker, TaskItem } from './agent-workspace';
import { BASE_LINES } from './purchase-data';

/**
 * Agent 体验地图里的 18 个交互小样（作品集第 09 章）。每个只展示一种设计决定，都能直接点。
 * 外层 #evidence 让作品集按内容高度撑开 iframe。
 */

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const Frame = ({ children, title, sub, action }: { children: React.ReactNode; title?: string; sub?: string; action?: React.ReactNode }) => (
  <section className="overflow-hidden rounded-2xl bg-card shadow-card">
    {title && <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4"><div className="min-w-0"><h2 className="text-base font-semibold">{title}</h2>{sub && <p className="mt-0.5 truncate text-xs text-muted-foreground">{sub}</p>}</div>{action}</header>}
    <div className="px-5 py-4">{children}</div>
  </section>
);
const Bubble = ({ children }: { children: React.ReactNode }) => <div className="flex gap-2.5"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="size-3.5" /></span><div className="min-w-0 flex-1 text-sm leading-relaxed">{children}</div></div>;
const Mine = ({ children }: { children: React.ReactNode }) => <div className="flex justify-end"><p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-sm text-primary-foreground">{children}</p></div>;

function MiniCard({ card }: { card: ResultCard }) {
  return (
    <article className="overflow-hidden rounded-xl border border-border">
      <header className="border-b border-border bg-[color-mix(in_srgb,var(--warning)_7%,var(--surface-raised))] px-3.5 py-3"><p className="text-sm font-semibold">{card.title}</p>{card.source && <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><FileText className="size-3" />{card.source}</p>}
        {card.badges && <div className="mt-2 flex flex-wrap gap-1">{card.badges.map((b) => <Badge key={b} variant="warning">{b}</Badge>)}</div>}</header>
      <div className="space-y-2.5 px-3.5 py-3">{card.sections.map((s) => <div key={s.title}><p className="text-xs font-semibold">{s.title}</p>{s.rows.map((r) => <p key={r.label} className="mt-1 flex items-baseline justify-between gap-3 text-sm"><span className="font-mono text-xs text-muted-foreground">{r.label}</span><span className="tabular-nums">{r.detail && <span className="text-xs text-muted-foreground">{r.detail}</span>}{r.before && <span className="text-muted-foreground line-through">{r.before}</span>}{r.after && <> → <b>{r.after}</b></>}</span></p>)}</div>)}</div>
      {card.next && <footer className="border-t border-border bg-surface-sunken px-3.5 py-2.5 text-sm"><b>Next · </b><span className="text-muted-foreground">{card.next}</span></footer>}
    </article>
  );
}

/* 01 · 入口：列表里就有下一步 */
function Entry() {
  const [ask, setAsk] = useState(false);
  return (
    <Frame title="Purchase workspace" sub="Next actions across purchases"
      action={<div className="flex gap-1.5"><Button size="sm" variant="outline" onClick={() => setAsk((v) => !v)}><Sparkles />Ask agent</Button><Button size="sm"><Plus />New PO</Button></div>}>
      {ask && <div className="rise-in mb-4 rounded-xl bg-muted p-3.5"><Bubble>I can plan purchases, review supplier documents and follow up on deliveries. MNP is the most urgent today.</Bubble></div>}
      <ul className="divide-y divide-border">
        {AGENT_POS.slice(0, 3).map((r) => (
          <li key={r.no} className="flex items-center justify-between gap-3 py-2.5 text-sm">
            <div className="min-w-0"><p className="font-semibold">{r.supplier} <span className="font-mono text-xs font-normal text-muted-foreground">{r.no}</span></p>{r.agent && <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Sparkles className="size-3 text-primary" />{r.agent}</p>}</div>
            <Badge variant={AGENT_STATUS[r.status].v}>{AGENT_STATUS[r.status].label}</Badge>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/* 02 · 意图与上下文 */
function CreatePlan() {
  const [days, setDays] = useState(30);
  const [sent, setSent] = useState(false);
  const [sup, setSup] = useState<string | null>('mnp');
  const name = SUPPLIERS.find((x) => x.id === sup)?.name ?? 'MNP';
  return (
    <Frame title="New purchase order" sub="The agent prepares an editable plan. Nothing is ordered.">
      {sent ? (
        <div className="rise-in space-y-3"><Mine>Plan {name} for the next {days} days</Mine><Bubble>Reading 30-day sales, stock and MNP rules R03. The draft will open in a new purchase order.</Bubble><Button size="sm" variant="outline" onClick={() => setSent(false)}><RotateCcw />Start over</Button></div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-1.5"><span className="text-xs text-muted-foreground">Supplier</span><SupplierPicker value={sup} onChange={setSup} /></div>
          <div className="space-y-1.5"><p className="text-xs text-muted-foreground">Sales coverage after arrival</p>
            <div className="flex gap-2">{[30, 45, 60].map((d) => <button key={d} type="button" aria-pressed={days === d} onClick={() => setDays(d)} className={'h-10 flex-1 rounded-xl border text-sm font-medium transition-colors ' + (days === d ? 'border-primary bg-primary/8 text-primary-strong' : 'border-input hover:bg-[var(--surface-hover)]')}>{d} days</button>)}</div></div>
          <Button className="w-full" size="lg" disabled={!sup} onClick={() => setSent(true)}>Create plan<ArrowRight /></Button>
        </div>
      )}
    </Frame>
  );
}

/* 03 · 预期：推荐不是承诺 */
function Expectations() {
  const [made, setMade] = useState(false);
  return <div className="space-y-3"><OpportunityCard o={OPPORTUNITIES[0]} onCreate={() => setMade(true)} />{made && <p className="rise-in rounded-xl bg-status-info-subtle px-3.5 py-2.5 text-sm">Draft <b>PO-2026-0843</b> created. Nothing is sent to MNP until you place the order.</p>}</div>;
}

/* 04 · 执行透明：步骤和骨架同步 */
function Progress() {
  const [i, setI] = useState(0);
  const [run, setRun] = useState(1);
  useEffect(() => { let on = true; setI(0); (async () => { for (let k = 1; k <= PLAN_STEPS.length; k++) { await wait(900); if (!on) return; setI(k); } })(); return () => { on = false; }; }, [run]);
  const done = i >= PLAN_STEPS.length;
  return (
    <Frame title={done ? 'Purchase plan ready' : 'Preparing your purchase plan…'} sub="MNP · 30-day coverage" action={done ? <Button size="sm" variant="outline" onClick={() => setRun((r) => r + 1)}><RotateCcw />Replay</Button> : <span className="text-xs tabular-nums text-muted-foreground">{i}/{PLAN_STEPS.length}</span>}>
      <ol className="space-y-2">
        {PLAN_STEPS.map((s, k) => (
          <li key={s} className="flex items-start gap-2.5 text-sm">
            <span className={'mt-0.5 grid size-4 shrink-0 place-items-center rounded-full ' + (k < i ? 'bg-success text-white' : k === i ? 'ring-2 ring-primary' : 'ring-1 ring-border')}>{k < i && <Check className="size-2.5" strokeWidth={3.5} />}</span>
            <span><span className={k <= i ? 'font-medium' : 'text-muted-foreground'}>{s}</span>{k < i && <span className="block text-xs text-muted-foreground">{PLAN_STEP_DETAIL[k]}</span>}</span>
          </li>
        ))}
      </ol>
      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        {BASE_LINES.slice(0, 4).map((l, k) => (
          <div key={l.sku} className="flex items-center justify-between gap-3 border-b border-border px-3 py-2 text-sm last:border-0">
            {done ? <><span className="truncate"><span className="font-mono text-xs text-muted-foreground">{l.sku}</span> {l.productName} {l.variant}</span><span className="font-semibold tabular-nums">{l.plannedQty}</span></>
              : <><span className="h-3 animate-pulse rounded bg-muted" style={{ width: `${50 + k * 9}%` }} /><span className="h-3 w-8 animate-pulse rounded bg-muted" /></>}
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* 05 · 人在环中：比对 → 选审批路径 */
function Approval() {
  const [path, setPath] = useState<'direct' | 'owner' | null>(null);
  const [step, setStep] = useState<'review' | 'choose' | 'done'>('review');
  return (
    <Frame title="PO-2026-0842" sub="MNP · confirmation 26VOM002922.pdf" action={<Badge variant={step === 'done' ? 'info' : 'warning'}>{step === 'done' ? (path === 'owner' ? 'Waiting for owner' : 'Approved') : 'Needs review'}</Badge>}>
      {step === 'review' && <div className="space-y-3"><MiniCard card={{ title: 'Confirmation needs review', badges: ['2 missing', '1 qty', '1 price'], sections: [{ title: 'Quantity changes', rows: [{ label: '370102', before: '96', after: '90' }] }, { title: 'Price changes', rows: [{ label: '420106', before: '€7.10', after: '€7.90' }] }], next: 'Check the lines, then Approve.' }} /><Button className="w-full" onClick={() => setStep('choose')}>Approve</Button></div>}
      {step === 'choose' && (
        <div className="rise-in space-y-3">
          <p className="text-sm text-muted-foreground">Neither option places the order.</p>
          {([['direct', 'Approve directly', 'As the buyer, now'], ['owner', 'Push to owner', 'Marco Bianchi approves']] as const).map(([v, t, d]) => (
            <button key={v} type="button" onClick={() => setPath(v)} className={'w-full rounded-xl border p-3.5 text-left transition-colors ' + (path === v ? 'border-primary bg-primary/6 ring-1 ring-primary' : 'border-input hover:bg-[var(--surface-hover)]')}><p className="text-sm font-semibold">{t}</p><p className="text-xs text-muted-foreground">{d}</p></button>
          ))}
          <div className="flex gap-2"><Button variant="outline" className="flex-1" onClick={() => setStep('review')}>Back</Button><Button className="flex-1" disabled={!path} onClick={() => setStep('done')}>Confirm</Button></div>
        </div>
      )}
      {step === 'done' && <div className="rise-in space-y-3"><Bubble>{path === 'owner' ? 'Sent to the owner with the 4 approval checks. Mark as ordered unlocks after approval.' : 'Approved as buyer. Place the order with MNP, then Mark as ordered.'}</Bubble><Button size="sm" variant="outline" onClick={() => { setStep('review'); setPath(null); }}><RotateCcw />Reset</Button></div>}
    </Frame>
  );
}

/* 06 · 异步任务 */
function Tasks() {
  const [tasks, setTasks] = useState(TASKS);
  return <Frame title="Tasks" sub="Agent work across your purchase orders"><ul className="space-y-3">{tasks.map((t) => <TaskItem key={t.id} t={t} onToggle={() => setTasks((p) => p.map((x) => (x.id === t.id ? { ...x, status: x.status === 'running' ? 'paused' : 'running' } : x)))} />)}</ul></Frame>;
}

/* 07 · 出错与恢复：先预览旧草稿，再决定是否套用 */
const VERSIONS = [
  { id: 'cur', title: 'Current draft', at: '10:42', who: 'You', detail: '370102 96 → 120 · 13 SKUs · €3,246.00', current: true },
  { id: 'auto', title: 'Autosave', at: '10:31', who: 'You', detail: '431001 72 → 60', current: false },
  { id: 'init', title: 'Initial plan', at: '08:05', who: 'Agent', detail: '13 SKUs · 558 pcs · €3,116.40', current: false },
];
function Recovery() {
  const [preview, setPreview] = useState<string | null>(null);
  const [applied, setApplied] = useState<string | null>(null);
  const v = VERSIONS.find((x) => x.id === preview);
  return (
    <Frame title="Activity log" sub="Draft snapshots and business events">
      {v ? (
        <div className="rise-in space-y-3">
          <div className="rounded-xl bg-status-info-subtle px-3.5 py-3 text-sm"><p className="flex items-center gap-1.5 font-semibold"><Eye className="size-4" />Previewing {v.title} · {v.at}</p><p className="mt-0.5 text-muted-foreground">Read-only. The current draft is unchanged until you apply.</p></div>
          <div className="overflow-hidden rounded-xl border border-border text-sm">
            {[['370102', '120', '96'], ['431001', '60', '72']].map(([s, now, then]) => <div key={s} className="flex justify-between border-b border-border px-3 py-2 last:border-0"><span className="font-mono text-xs text-muted-foreground">{s}</span><span className="tabular-nums"><span className="text-muted-foreground line-through">{now}</span> → <b>{then}</b></span></div>)}
          </div>
          <div className="flex gap-2"><Button variant="outline" className="flex-1" onClick={() => setPreview(null)}>Back</Button><Button className="flex-1" onClick={() => { setApplied(v.title); setPreview(null); }}>Apply this draft</Button></div>
        </div>
      ) : (
        <div className="space-y-2">
          {applied && <p className="rise-in rounded-xl bg-status-success-subtle px-3.5 py-2.5 text-sm text-success-text">{applied} applied. The previous draft is kept as a snapshot.</p>}
          {VERSIONS.map((x) => (
            <div key={x.id} className={'flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 ' + (x.current ? 'border-primary/40 bg-primary/5' : 'border-border')}>
              <div className="min-w-0"><p className="flex items-center gap-2 text-sm font-semibold">{x.title}{x.current && <Badge variant="info">Current</Badge>}</p><p className="truncate text-xs tabular-nums text-muted-foreground">{x.at} · {x.who} · {x.detail}</p></div>
              {!x.current && <Button size="sm" variant="outline" onClick={() => setPreview(x.id)}>Preview</Button>}
            </div>
          ))}
        </div>
      )}
    </Frame>
  );
}

/* 08 · 可核查的交付 */
function Evidence() {
  return <Frame title="Evidence for this order" sub="PO-2026-0843 · MNP · 30-day coverage"><EvidenceV1 coverage={30} confirmation="26VOM002922.pdf" showScore onOpenRules={() => {}} /></Frame>;
}

/* 09 · 就地修改 */
function EditableTable() {
  const [rows, setRows] = useState(BASE_LINES.slice(0, 3).map((l) => ({ sku: l.sku, name: `${l.productName} ${l.variant}`, qty: l.plannedQty, price: l.estimatedPrice })));
  const total = rows.reduce((s, r) => s + r.qty * r.price, 0);
  return (
    <Frame title="Purchase lines" sub="Edit in place · the agent recalculates totals" action={<Button size="sm" variant="outline" onClick={() => setRows((p) => [...p, { sku: '220010', name: 'Nail primer 10 ml', qty: 48, price: 3.8 }])} disabled={rows.length > 3}><Plus />Add</Button>}>
      <table className="w-full table-fixed text-sm">
        <colgroup><col /><col style={{ width: 72 }} /><col style={{ width: 80 }} /><col style={{ width: 36 }} /></colgroup>
        <thead><tr className="text-left text-xs text-muted-foreground"><th className="pb-2 font-medium">SKU</th><th className="pb-2 text-right font-medium">Qty</th><th className="pb-2 text-right font-medium">Price</th><th /></tr></thead>
        <tbody className="divide-y divide-border">{rows.map((r, i) => (
          <tr key={r.sku} className="[&>td]:py-2">
            <td className="truncate"><span className="font-mono text-xs text-muted-foreground">{r.sku}</span> {r.name}</td>
            <td><Input type="number" aria-label={`Qty ${r.sku}`} value={r.qty} onChange={(e) => setRows((p) => p.map((x, j) => (j === i ? { ...x, qty: Number(e.target.value) || 0 } : x)))} className="ml-auto h-8 w-16 rounded-lg px-2 text-right tabular-nums shadow-none" /></td>
            <td><Input type="number" step="0.01" aria-label={`Price ${r.sku}`} value={r.price} onChange={(e) => setRows((p) => p.map((x, j) => (j === i ? { ...x, price: Number(e.target.value) || 0 } : x)))} className="ml-auto h-8 w-[4.5rem] rounded-lg px-2 text-right tabular-nums shadow-none" /></td>
            <td className="text-right"><button type="button" aria-label={`Delete ${r.sku}`} onClick={() => setRows((p) => p.filter((_, j) => j !== i))} className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-status-danger-subtle hover:text-destructive"><Trash2 className="size-3.5" /></button></td>
          </tr>
        ))}</tbody>
      </table>
      <p className="mt-3 flex justify-between border-t border-border pt-3 text-sm"><span className="text-muted-foreground">{rows.length} SKUs</span><span className="font-semibold tabular-nums">{eur(total)}</span></p>
    </Frame>
  );
}

/* 10 · 反馈与复用：订单备注和供应商规则分开 */
function Notes() {
  const [dims, setDims] = useState<Record<string, number>>({ quantity: -1, timing: -1 });
  const [note, setNote] = useState('Black Onyx sells, but salons report chipping. Keep it flat.');
  const mentions = parseMentions(note);
  return (
    <Frame title="Review this order" sub="PO-2026-0838 · rate it, then name exceptions">
      <div className="-mx-1 divide-y divide-border rounded-xl border border-border">
        {DIMS.slice(0, 2).map((d) => <StopSlider key={d.id} dim={d} value={dims[d.id]} onChange={(v) => setDims((p) => ({ ...p, [d.id]: v }))} />)}
      </div>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} aria-label="Notes about specific products"
        className="mt-3 block w-full resize-none rounded-xl border border-input bg-card px-3 py-[9px] text-sm leading-5 outline-none focus:ring-2 focus:ring-ring/40" />
      <div className="mt-2 flex min-h-7 flex-wrap gap-1.5">
        {mentions.length ? mentions.map((m) => <span key={m.key} className="inline-flex h-7 items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-2.5 text-xs"><span className="font-medium">{m.label}</span><span className="text-muted-foreground">→</span><span className="font-medium text-warning-text">{INTENT[m.intent]}</span></span>)
          : <span className="text-xs text-muted-foreground">Name a product or SKU to see what the agent will do.</span>}
      </div>
    </Frame>
  );
}

/* 11 · 记忆：供应商规则 */
function SupplyRules() {
  return <Frame title="Supply rules" sub={`MNP · ${SUPPLIER_RULES.version} · valid until ${SUPPLIER_RULES.validUntil}`}>{SUPPLIER_RULES.groups.slice(1, 3).map((g) => <KeyValues key={g.title} title={g.title} rows={g.rows} />)}<div className="mt-2 flex gap-2"><Button size="sm" variant="outline">Edit details</Button><Button size="sm"><Sparkles />Edit in chat</Button></div></Frame>;
}

/* 12 · 主动提醒 */
function Notifications() {
  const [read, setRead] = useState<Set<string>>(new Set());
  return (
    <Frame title="Alerts" sub="Changes that need your attention" action={<span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Bell className="size-3.5" />{2 - read.size} unread</span>}>
      <ul className="space-y-2.5">{NOTICES.slice(0, 2).map((n) => (
        <li key={n.id} className={'rounded-xl border p-3.5 ' + (read.has(n.id) ? 'border-border' : 'border-primary/30 bg-primary/[0.04]')}>
          <p className="flex justify-between text-xs text-muted-foreground"><span className="font-semibold text-primary-strong">{n.supplier}</span>{n.at}</p>
          <p className={'mt-1 text-sm ' + (read.has(n.id) ? 'text-muted-foreground' : 'font-semibold')}>{n.title}</p>
          <p className="text-xs text-muted-foreground">{n.detail}</p>
          {!read.has(n.id) && <Button size="sm" variant="ghost" className="-ml-2 mt-1 text-muted-foreground" onClick={() => setRead((p) => new Set(p).add(n.id))}>Mark as read</Button>}
        </li>
      ))}</ul>
    </Frame>
  );
}

/* A · 安全边界 */
function Safety() {
  const [ask, setAsk] = useState(false);
  const [gone, setGone] = useState(false);
  return (
    <Frame title="What the agent can do" sub="Scoped to PO-2026-0842">
      <ul className="space-y-2 text-sm">
        {[['Read sales, stock and documents', true], ['Draft quantities and compare documents', true], ['Place supplier orders', false], ['Approve or send emails', false]].map(([t, ok]) => (
          <li key={t as string} className="flex items-center gap-2.5">{ok ? <Check className="size-4 text-success-text" /> : <Lock className="size-4 text-muted-foreground" />}<span className={ok ? '' : 'text-muted-foreground'}>{t}</span></li>
        ))}
      </ul>
      <div className="mt-4 rounded-xl border border-border p-3.5">
        {gone ? <p className="text-sm text-muted-foreground">Draft deleted. <button type="button" className="font-semibold text-primary hover:underline" onClick={() => { setGone(false); setAsk(false); }}>Undo</button></p>
          : ask ? <div className="rise-in"><p className="text-sm font-semibold">Delete this draft?</p><p className="text-xs text-muted-foreground">Only you can do this. The agent never deletes orders.</p><div className="mt-3 flex gap-2"><Button size="sm" variant="outline" onClick={() => setAsk(false)}>Cancel</Button><Button size="sm" variant="destructive" onClick={() => setGone(true)}>Delete draft</Button></div></div>
            : <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">Delete purchase draft</p><p className="text-xs text-muted-foreground">Needs your confirmation</p></div><Button size="sm" variant="outline" className="text-destructive" onClick={() => setAsk(true)}>Delete</Button></div>}
      </div>
    </Frame>
  );
}

/* B · 一个 Agent 协调多个能力 */
function Ecosystem() {
  const [on, setOn] = useState(0);
  useEffect(() => { const t = setInterval(() => setOn((v) => (v + 1) % 5), 1100); return () => clearInterval(t); }, []);
  const src = [['Sales', Database], ['Stock', Database], ['Supply rules', ShieldCheck], ['Documents', FileText]] as const;
  return (
    <Frame title="One agent per order" sub="Specialist checks run behind a single conversation">
      <div className="grid grid-cols-2 gap-2">{src.map(([t, Ic], i) => <div key={t} className={'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors ' + (on === i ? 'border-primary bg-primary/6 text-primary-strong' : on > i ? 'border-border' : 'border-border text-muted-foreground')}><Ic className="size-4" />{t}{on > i && <Check className="ml-auto size-3.5 text-success-text" />}</div>)}</div>
      <div className="mt-3"><Bubble>{on === 4 ? 'Plan ready: 13 SKUs, min order met, free shipping.' : `Checking ${src[on][0].toLowerCase()}…`}</Bubble></div>
    </Frame>
  );
}

/* C · 语气：同一件事，短而可扫读 */
function Tone() {
  const [t, setT] = useState<'order' | 'receipt' | 'terms'>('order');
  const copy = {
    order: { head: 'Order recorded', rows: [['Recorded', '26/10 10:30'], ['By', 'Giulia Rossi'], ['Expected', '09/11']], next: 'Upload the DDT when the first delivery arrives.' },
    receipt: { head: 'Delivery note checked', rows: [['Short', '370102 · 90 → 60'], ['Not on truck', '510002 · 24 pcs'], ['Extra', '510003 · 12 pcs']], next: 'Decide 510003, then Confirm receipt.' },
    terms: { head: 'MNP terms', rows: [['Minimum', '€1,500'], ['Free shipping', 'from €2,000'], ['Lead time', '14 days']], next: 'Ask to change a term; I show it before saving.' },
  }[t];
  return (
    <Frame title="Agent replies" sub="Facts first, details stay in the table">
      <SlideTabs label="Reply" value={t} onChange={setT} items={[{ id: 'order', label: 'Order' }, { id: 'receipt', label: 'Receipt' }, { id: 'terms', label: 'Terms' }]}
        className="flex gap-1 rounded-xl bg-muted p-1" itemClassName="flex-1 rounded-[8px] px-3 py-1.5 text-sm" activeClassName="font-semibold" idleClassName="text-muted-foreground" indicatorClassName="rounded-[8px] bg-card shadow-[0_1px_2px_rgb(16_24_40/0.08)]" />
      <div key={t} className="rise-in mt-3 overflow-hidden rounded-xl border border-border">
        <p className="border-b border-border px-3.5 py-2.5 text-sm font-semibold">{copy.head}</p>
        <dl className="space-y-1.5 px-3.5 py-3">{copy.rows.map(([k, v]) => <div key={k} className="flex justify-between text-sm"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium tabular-nums">{v}</dd></div>)}</dl>
        <p className="border-t border-border bg-surface-sunken px-3.5 py-2.5 text-sm"><b>Next · </b><span className="text-muted-foreground">{copy.next}</span></p>
      </div>
    </Frame>
  );
}

/* D · 单据与多端 */
function Documents() {
  const [wide, setWide] = useState(true);
  const docs = [['Supplier confirmation', '26VOM002922.pdf', 'V2 · current'], ['Supplier confirmation', '26VOM002871.pdf', 'V1 · replaced'], ['Delivery note', 'DDT-MNP-0113.pdf', 'Batch 1'], ['Invoice', 'Not uploaded', '']];
  return (
    <Frame title="Attachments" sub="PO-2026-0842 · 3 documents" action={<div className="flex rounded-lg bg-muted p-0.5">{[[true, Laptop], [false, Smartphone]].map(([w, Ic]) => { const I = Ic as typeof Laptop; return <button key={String(w)} type="button" aria-label={w ? 'Desktop' : 'Phone'} onClick={() => setWide(w as boolean)} className={'grid size-7 place-items-center rounded-md ' + (wide === w ? 'bg-card shadow-sm' : 'text-muted-foreground')}><I className="size-3.5" /></button>; })}</div>}>
      <div className={'mx-auto transition-[max-width] duration-300 ' + (wide ? 'max-w-full' : 'max-w-[15rem]')}>
        <ul className={'grid gap-2 ' + (wide ? 'grid-cols-2' : 'grid-cols-1')}>{docs.map(([k, f, m]) => (
          <li key={f} className="flex items-start gap-2.5 rounded-xl bg-muted px-3 py-2.5">
            <span className={'grid size-7 shrink-0 place-items-center rounded-lg bg-card ' + (m ? 'text-destructive' : 'text-muted-foreground')}>{m ? <FileText className="size-3.5" /> : <Upload className="size-3.5" />}</span>
            <span className="min-w-0"><span className="block text-xs text-muted-foreground">{k}</span><span className={'block truncate text-sm ' + (m ? 'font-medium' : 'text-muted-foreground')}>{f}</span>{m && <span className="block text-xs text-muted-foreground">{m}</span>}</span>
          </li>
        ))}</ul>
      </div>
    </Frame>
  );
}

/* E · 资源：控制检查节奏 */
function Schedule() {
  const [on, setOn] = useState(true);
  const [repeat, setRepeat] = useState('weekdays');
  return (
    <Frame title="Agent settings" sub="Preferences for all purchase orders">
      <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold">Replenishment checks</p><p className="text-xs text-muted-foreground">Check sales, stock and supplier rules.</p></div><Switch aria-label="Replenishment checks" checked={on} onCheckedChange={setOn} /></div>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <Select value={repeat} disabled={!on} onValueChange={setRepeat} ariaLabel="Repeat" size="lg" triggerClassName="!h-10 w-full rounded-xl" options={[{ value: 'daily', label: 'Every day' }, { value: 'weekdays', label: 'Weekdays' }, { value: 'weekly', label: 'Weekly' }]} />
        <Input type="time" defaultValue="09:00" disabled={!on} aria-label="Run at" className="h-10 rounded-xl tabular-nums" />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm"><div className="rounded-xl bg-muted px-3 py-2.5"><dt className="text-xs text-muted-foreground">Next check</dt><dd className="font-semibold tabular-nums">{on ? '18/11 09:00' : 'Paused'}</dd></div><div className="rounded-xl bg-muted px-3 py-2.5"><dt className="text-xs text-muted-foreground">Reused today</dt><dd className="font-semibold tabular-nums">2 results</dd></div></dl>
    </Frame>
  );
}

/* F · 体验度量 */
const CHECKS: Record<string, string[]> = { Plan: ['Supplier and coverage are clear', 'Plan can be checked in the table', 'Next action is easy to find'], Confirmation: ['Differences are found without reading the PDF', 'Approval path is understood', 'Approve is not mistaken for ordering'], Recovery: ['Previous draft can be previewed', 'Applying keeps later events', 'Buyer trusts the restored plan'] };
function Metrics() {
  const [sid, setSid] = useState<'mnp' | 'moroccanoil'>('mnp');
  return (
    <Frame title="Plan accuracy" sub="Measured from reviewed orders, per supplier">
      <SlideTabs label="Supplier" value={sid} onChange={setSid} items={[{ id: 'mnp', label: 'MNP' }, { id: 'moroccanoil', label: 'Moroccanoil' }]}
        className="mb-4 flex gap-1 rounded-xl bg-muted p-1" itemClassName="flex-1 rounded-[8px] px-2 py-1.5 text-sm" activeClassName="font-semibold" idleClassName="text-muted-foreground" indicatorClassName="rounded-[8px] bg-card shadow-[0_1px_2px_rgb(16_24_40/0.08)]" />
      <div key={sid} className="fade-in"><SupplierScoreCard sid={sid} /></div>
    </Frame>
  );
}

const FACETS: Record<string, () => React.ReactElement> = { '01': Entry, '02': CreatePlan, '03': Expectations, '04': Progress, '05': Approval, '06': Tasks, '07': Recovery, '08': Evidence, '09': EditableTable, '10': Notes, '11': SupplyRules, '12': Notifications, A: Safety, B: Ecosystem, C: Tone, D: Documents, E: Schedule, F: Metrics };

export default function AgentFacet({ id }: { id: string }) {
  const F = FACETS[id] ?? Entry;
  return <div id="evidence" className="bg-background p-4 font-sans text-foreground"><F /></div>;
}
