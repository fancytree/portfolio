import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUp, Check, FileText, Loader2, Paperclip, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlideTabs } from './motion';

/**
 * Agent 面板：采购单右侧的协作区。Agent 只给出依据、比对结果和下一步，按钮都落回采购单上由人操作。
 * 消息三种形态：一句话、带进度的步骤、结构化结果卡（差异 before → after、下一步）。
 */

export type StepState = 'done' | 'run' | 'todo';
export type ResultRow = { label: string; before?: string; after?: string; detail?: string };
export type ResultCard = {
  title: string; source?: string; tone?: 'warn' | 'ok' | 'info';
  badges?: string[]; summary?: string;
  sections: { title: string; rows: ResultRow[]; collapsed?: boolean }[];
  next?: string;
};
export type AgentAction = { label: string; onClick: () => void; primary?: boolean };
export type Msg = {
  id: number; role: 'user' | 'agent';
  text?: string;
  steps?: { label: string; detail?: string; state: StepState }[];
  stepsTitle?: string;
  card?: ResultCard;
  actions?: AgentAction[];
  note?: string;
};

let seq = 1;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** 对话状态 + 几个编排助手：先显示“思考”，再落出回复；步骤逐个点亮 */
export function useAgentThread(initial: Omit<Msg, 'id'>[] = []) {
  const [msgs, setMsgs] = useState<Msg[]>(() => initial.map((m) => ({ ...m, id: seq++ })));
  const [busy, setBusy] = useState<string | null>(null);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  const post = useCallback((m: Omit<Msg, 'id'>) => { const id = seq++; setMsgs((p) => [...p, { ...m, id }]); return id; }, []);
  const patch = useCallback((id: number, fn: (m: Msg) => Msg) => setMsgs((p) => p.map((m) => (m.id === id ? fn(m) : m))), []);

  /** 用户说一句 → Agent 思考 thinkMs → 回复 */
  const reply = useCallback(async (reply: Omit<Msg, 'id' | 'role'>, thinking = 'Thinking…', thinkMs = 900) => {
    setBusy(thinking); await wait(thinkMs); if (!alive.current) return;
    setBusy(null); post({ role: 'agent', ...reply });
  }, [post]);

  /** 一组步骤逐个完成；返回在全部完成后 resolve */
  const run = useCallback(async (title: string, labels: { label: string; detail?: string }[], stepMs = 700) => {
    const id = post({ role: 'agent', stepsTitle: title, steps: labels.map((s, i) => ({ ...s, state: i === 0 ? 'run' : 'todo' })) });
    for (let i = 0; i < labels.length; i++) {
      await wait(stepMs); if (!alive.current) return;
      patch(id, (m) => ({ ...m, steps: m.steps!.map((s, j) => ({ ...s, state: j <= i ? 'done' : j === i + 1 ? 'run' : 'todo' })) }));
    }
  }, [post, patch]);

  return { msgs, busy, post, reply, run, setBusy };
}

/* ───────── 消息 ───────── */
function Steps({ title, steps }: { title?: string; steps: NonNullable<Msg['steps']> }) {
  const done = steps.filter((s) => s.state === 'done').length;
  const finished = done === steps.length;
  return (
    <div className="rounded-xl border border-border bg-card px-3.5 py-3">
      <p className="flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
        <span className="flex items-center gap-1.5">{finished ? <Check className="size-3.5 text-success-text" strokeWidth={2.5} /> : <Loader2 className="size-3.5 animate-spin text-primary" />}{title}</span>
        <span className="tabular-nums">{done}/{steps.length}</span>
      </p>
      <ol className="relative mt-2.5 space-y-2">
        <span aria-hidden className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
        {steps.map((s) => (
          <li key={s.label} className="relative flex items-start gap-2.5 text-sm">
            <span className={'relative z-[1] mt-0.5 grid size-[15px] shrink-0 place-items-center rounded-full ' + (s.state === 'done' ? 'bg-success text-white' : s.state === 'run' ? 'bg-card ring-2 ring-primary' : 'bg-card ring-1 ring-border')}>
              {s.state === 'done' && <Check className="size-2.5" strokeWidth={3.5} />}
              {s.state === 'run' && <span className="size-1.5 animate-pulse rounded-full bg-primary" />}
            </span>
            <span className="min-w-0">
              <span className={s.state === 'todo' ? 'text-muted-foreground' : 'font-medium'}>{s.label}</span>
              {s.detail && s.state !== 'todo' && <span className="block text-xs text-muted-foreground">{s.detail}</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Rows({ rows }: { rows: ResultRow[] }) {
  return (
    <dl className="divide-y divide-border">
      {rows.map((r, i) => {
        const change = r.before !== undefined || r.after !== undefined;
        const code = /\d/.test(r.label) && !/\s/.test(r.label);
        return (
          <div key={r.label + i} className="flex items-center justify-between gap-3 py-1.5 text-sm">
            <dt className="min-w-0">
              <span className={'block truncate ' + (code ? 'font-mono text-xs text-muted-foreground' : change ? 'font-medium' : 'text-muted-foreground')} title={r.label}>{r.label}</span>
              {change && r.detail && <span className="block truncate text-xs text-muted-foreground">{r.detail}</span>}
            </dt>
            <dd className="flex shrink-0 items-baseline gap-1.5 tabular-nums">
              {!change && r.detail && <span className="max-w-[12rem] truncate text-right text-xs text-foreground/80">{r.detail}</span>}
              {r.before !== undefined && <span className="text-muted-foreground line-through decoration-muted-foreground/50">{r.before}</span>}
              {r.after !== undefined && <>{r.before !== undefined && <ArrowRight className="size-3 self-center text-muted-foreground" />}<span className="font-semibold">{r.after}</span></>}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

function Card({ card }: { card: ResultCard }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const accent = card.tone === 'warn' ? 'var(--warning)' : card.tone === 'ok' ? 'var(--success)' : 'var(--primary)';
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card" aria-label={card.title}>
      <header className="border-b border-border px-3.5 py-3" style={{ background: `color-mix(in srgb, ${accent} 7%, var(--surface-raised))` }}>
        <p className="text-sm font-semibold">{card.title}</p>
        {card.source && <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground"><FileText className="size-3 shrink-0" />{card.source}</p>}
        {!!card.badges?.length && <div className="mt-2 flex flex-wrap gap-1">{card.badges.map((b) => <Badge key={b} variant={card.tone === 'warn' ? 'warning' : card.tone === 'ok' ? 'success' : 'info'}>{b}</Badge>)}</div>}
      </header>
      <div className="space-y-3 px-3.5 py-3">
        {card.summary && <p className="text-sm text-muted-foreground">{card.summary}</p>}
        {card.sections.map((s) => {
          const shown = !s.collapsed || open[s.title];
          return (
            <section key={s.title}>
              <button type="button" disabled={!s.collapsed} onClick={() => setOpen((p) => ({ ...p, [s.title]: !p[s.title] }))}
                className="flex w-full items-center justify-between text-xs font-semibold text-foreground disabled:cursor-default">
                {s.title}<span className="font-normal text-muted-foreground">{s.collapsed ? (shown ? 'Hide' : `${s.rows.length} · Show`) : s.rows.length}</span>
              </button>
              {shown && <div className="mt-1"><Rows rows={s.rows} /></div>}
            </section>
          );
        })}
      </div>
      {card.next && <footer className="border-t border-border bg-surface-sunken px-3.5 py-2.5 text-sm"><span className="font-semibold">Next · </span><span className="text-muted-foreground">{card.next}</span></footer>}
    </article>
  );
}

function Message({ m }: { m: Msg }) {
  if (m.role === 'user') return <div className="rise-in flex justify-end"><p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-sm text-primary-foreground">{m.text}</p></div>;
  return (
    <div className="rise-in space-y-2">
      {m.text && <p className="text-sm leading-relaxed">{m.text}</p>}
      {m.steps && <Steps title={m.stepsTitle} steps={m.steps} />}
      {m.card && <Card card={m.card} />}
      {m.note && <p className="text-xs text-muted-foreground">{m.note}</p>}
      {!!m.actions?.length && (
        <div className="flex flex-wrap gap-1.5">
          {m.actions.map((a) => <Button key={a.label} size="sm" variant={a.primary ? 'default' : 'outline'} onClick={a.onClick}>{a.label}{a.primary && <ArrowRight />}</Button>)}
        </div>
      )}
    </div>
  );
}

/* ───────── 面板 ───────── */
export type PanelTab = 'agent' | 'evidence' | 'rules' | 'activity';

export function AgentPanel({ thread, onSend, suggestions = [], tabs, tab, onTab, subtitle, className = '', placeholder = 'Ask about this order…', onClose }: {
  thread: ReturnType<typeof useAgentThread>;
  onSend: (text: string) => void;
  suggestions?: string[];
  /** Evidence / Rules / Activity 的内容 */
  tabs: Partial<Record<Exclude<PanelTab, 'agent'>, React.ReactNode>>;
  tab: PanelTab; onTab: (t: PanelTab) => void;
  subtitle?: string;
  className?: string;
  placeholder?: string;
  onClose?: () => void;
}) {
  const [text, setText] = useState('');
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [thread.msgs, thread.busy]);
  const send = (t = text) => { const v = t.trim(); if (!v || thread.busy) return; setText(''); thread.post({ role: 'user', text: v }); onSend(v); };
  const items: { id: PanelTab; label: string }[] = [{ id: 'agent', label: 'Agent' }, ...(['evidence', 'rules', 'activity'] as const).filter((k) => tabs[k]).map((k) => ({ id: k, label: k === 'evidence' ? 'Evidence' : k === 'rules' ? 'Supply rules' : 'Activity' }))];

  return (
    <section className={'flex min-h-0 flex-col overflow-hidden rounded-2xl bg-card shadow-card ' + className} aria-label="Procurement agent">
      <header className="shrink-0 px-5 pt-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-xl text-white" style={{ background: 'linear-gradient(140deg, color-mix(in srgb, var(--primary) 65%, white), var(--primary))' }}><Sparkles className="size-4" /></span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-sm font-semibold">Procurement agent</p>
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={'size-1.5 rounded-full ' + (thread.busy ? 'animate-pulse bg-primary' : 'bg-success')} />{thread.busy ? 'Working' : 'Ready'}
          </span>
          {onClose && <button type="button" aria-label="Close" onClick={onClose} className="-mr-1.5 grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"><X className="size-4" /></button>}
        </div>
        {items.length > 1 ? <SlideTabs label="Agent panel" value={tab} onChange={onTab} items={items}
          className="-mx-5 mt-3 flex h-10 items-stretch gap-1 border-b border-border px-4"
          itemClassName="flex h-full items-center px-2 text-sm" activeClassName="font-semibold text-foreground" idleClassName="text-muted-foreground hover:text-foreground"
          indicatorClassName="after:absolute after:inset-x-1.5 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary" /> : <div className="-mx-5 mt-4 border-b border-border" />}
      </header>

      {tab === 'agent' ? (
        <>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 [scrollbar-width:thin]" role="log" aria-label="Agent conversation">
            {thread.msgs.map((m) => <Message key={m.id} m={m} />)}
            {thread.busy && <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-3.5 animate-spin" />{thread.busy}</p>}
            <div ref={end} />
          </div>
          <footer className="shrink-0 space-y-2 border-t border-border px-4 pb-4 pt-3">
            {suggestions.length > 0 && (
              <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
                {suggestions.map((s) => <button key={s} type="button" disabled={!!thread.busy} onClick={() => send(s)} className="shrink-0 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50">{s}</button>)}
              </div>
            )}
            <div className="rounded-xl border border-input bg-card focus-within:ring-2 focus-within:ring-ring/40">
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} aria-label="Message the agent" placeholder={placeholder}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                className="block w-full resize-none bg-transparent px-3 pt-2.5 text-sm leading-5 outline-none placeholder:text-muted-foreground" />
              <div className="flex items-center justify-between px-2 pb-2">
                <button type="button" aria-label="Attach a document" className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"><Paperclip className="size-4" /></button>
                <button type="button" aria-label="Send" disabled={!text.trim() || !!thread.busy} onClick={() => send()} className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-40"><ArrowUp className="size-4" /></button>
              </div>
            </div>
          </footer>
        </>
      ) : <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 [scrollbar-width:thin]">{tabs[tab]}</div>}
    </section>
  );
}

/* ───────── Tab 内容的通用块 ───────── */
export function KeyValues({ title, rows }: { title: string; rows: [string, React.ReactNode][] }) {
  return (
    <section className="border-b border-border pb-4 pt-4 first:pt-0 last:border-0">
      <h3 className="text-xs font-semibold text-muted-foreground">{title}</h3>
      <dl className="mt-2 space-y-1.5">{rows.map(([k, v]) => <div key={k} className="flex items-baseline justify-between gap-4 text-sm"><dt className="shrink-0 text-muted-foreground">{k}</dt><dd className="min-w-0 truncate text-right font-medium tabular-nums">{v}</dd></div>)}</dl>
    </section>
  );
}

export function Timeline({ items }: { items: { at: string; title: string; who: string; detail?: string }[] }) {
  return (
    <ol className="relative space-y-4">
      <span aria-hidden className="absolute bottom-1 left-[5px] top-1 w-px bg-border" />
      {items.map((it, i) => (
        <li key={i} className="relative pl-6">
          <span className={'absolute left-0 top-1.5 size-[11px] rounded-full ring-4 ring-card ' + (it.who === 'Agent' ? 'bg-primary' : 'bg-foreground/70')} />
          <p className="flex items-baseline justify-between gap-3 text-sm"><span className="font-medium">{it.title}</span><span className="shrink-0 text-xs tabular-nums text-muted-foreground">{it.at}</span></p>
          <p className="text-xs text-muted-foreground">{it.who}{it.detail ? ` · ${it.detail}` : ''}</p>
        </li>
      ))}
    </ol>
  );
}
