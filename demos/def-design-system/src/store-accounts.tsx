import { useMemo, useState } from 'react';
import { Copy, Download, KeyRound, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlideTabs } from './motion';
import { CopyButton } from './order-deliveries';

/**
 * 小程序账号绑定。对齐原 ERP 的 Store accounts：选一个已有客户 → 生成一次性配对码（7 天、单次、重新生成会作废旧码）
 * → 以图片发给客户，客户在小程序里输入就绑定到这条 ERP 客户（价格、历史订单都跟过去）。
 */

type Cust = { id: string; name: string; code: string; kind: string; linked: { nick: string; since: string }[] };
const CUSTOMERS: Cust[] = [
  { id: 'c-10018', name: 'Bellezza Milano', code: 'C-10018', kind: 'Nail salon', linked: [] },
  { id: 'c-10042', name: 'Luce Beauty Lab', code: 'C-10042', kind: 'Beauty salon', linked: [{ nick: 'Giulia · Luce', since: '12/03/2026' }, { nick: 'Marta (reception)', since: '02/09/2026' }] },
  { id: 'c-10107', name: 'Casa Cosmetica', code: 'C-10107', kind: 'Retail shop', linked: [{ nick: 'Casa Cosmetica', since: '28/06/2026' }] },
];
const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newCode = () => Array.from({ length: 8 }, () => ALPHA[Math.floor(Math.random() * ALPHA.length)]).join('');
const validUntil = () => { const d = new Date(2026, 10, 24); const n = new Date(); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`; };

/** 示意二维码：按配对码生成稳定的点阵，三个角是定位块 */
function QrMark({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const out: boolean[] = [];
    for (let i = 0; i < 25 * 25; i++) { h = (h * 1103515245 + 12345) >>> 0; out.push(((h >> 16) & 3) === 0 || ((h >> 9) & 1) === 1 && (h & 7) < 3); }
    return out;
  }, [seed]);
  const finder = (x: number, y: number) => (x < 7 && y < 7) || (x > 17 && y < 7) || (x < 7 && y > 17);
  return (
    <svg viewBox="0 0 25 25" className="size-40" aria-label="Pairing QR code" role="img" shapeRendering="crispEdges">
      {cells.map((on, i) => { const x = i % 25, y = Math.floor(i / 25); return on && !finder(x, y) && !(x > 9 && x < 15 && y > 9 && y < 15) ? <rect key={i} x={x} y={y} width="1" height="1" fill="currentColor" /> : null; })}
      {[[0, 0], [18, 0], [0, 18]].map(([x, y]) => <g key={`${x}-${y}`}><rect x={x} y={y} width="7" height="7" rx="1.5" fill="currentColor" /><rect x={x + 1} y={y + 1} width="5" height="5" rx="1" fill="white" /><rect x={x + 2} y={y + 2} width="3" height="3" rx=".75" fill="currentColor" /></g>)}
      <circle cx="12.5" cy="12.5" r="2.6" fill="var(--primary)" /><text x="12.5" y="13.4" textAnchor="middle" fontSize="2" fontWeight="700" fill="white">DEF</text>
    </svg>
  );
}

export default function StoreAccounts() {
  const [cid, setCid] = useState(CUSTOMERS[0].id);
  const [codes, setCodes] = useState<Record<string, { code: string; until: string }>>({});
  const [copied, setCopied] = useState(false);
  const c = CUSTOMERS.find((x) => x.id === cid)!;
  const code = codes[cid];
  const generate = () => setCodes((m) => ({ ...m, [cid]: { code: newCode(), until: validUntil() } }));

  return (
    <div className="flex h-[calc(100vh-92px)] flex-col gap-4">
      <div className="flex shrink-0 items-center justify-between gap-6 rounded-2xl bg-card px-6 py-4 shadow-card">
        <div className="min-w-0"><h1 className="text-2xl font-semibold tracking-[-0.02em]">Store accounts</h1><p className="mt-0.5 text-sm text-muted-foreground">Link a customer’s WeChat to their ERP record, with their prices and order history.</p></div>
        <SlideTabs label="Customer" value={cid} onChange={(v) => { setCid(v); setCopied(false); }}
          items={CUSTOMERS.map((x) => ({ id: x.id, label: <span className="flex flex-col items-start leading-tight"><span>{x.name}</span><span className="font-mono text-[11px] font-normal text-muted-foreground">{x.code}</span></span> }))}
          className="flex shrink-0 gap-1 rounded-xl bg-muted p-1" itemClassName="rounded-[8px] px-3.5 py-1.5 text-left text-sm" activeClassName="font-semibold text-foreground" idleClassName="text-muted-foreground hover:text-foreground"
          indicatorClassName="rounded-[8px] bg-card shadow-[0_1px_2px_rgb(16_24_40/0.08)]" />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_22rem] gap-4">
        <div className="flex min-h-0 flex-col gap-4">
          <section className="shrink-0 rounded-2xl bg-card shadow-card">
            <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
              <div><h2 className="text-base font-semibold">Pairing code</h2><p className="mt-0.5 text-sm text-muted-foreground">One code links one WeChat account to this customer.</p></div>
              <Button size="lg" variant={code ? 'outline' : 'default'} onClick={generate}><KeyRound />{code ? 'Regenerate' : 'Generate pairing code'}</Button>
            </div>
            <div className="px-6 py-5">
              <p className="text-lg font-semibold">{c.name}</p>
              <p className="text-sm text-muted-foreground">{c.kind} · <span className="font-mono">{c.code}</span></p>
              {code ? (
                <div className="mt-5">
                  <div className="flex items-center gap-2.5 text-sm"><Badge variant="warning">Waiting to be used</Badge><span className="text-muted-foreground">Valid until <span className="tabular-nums text-foreground">{code.until}</span></span></div>
                  <p className="mt-3 flex items-center gap-2 font-mono text-4xl font-semibold tracking-[0.18em] text-primary-strong">{code.code}<CopyButton text={code.code} label="Copy pairing code" /></p>
                </div>
              ) : <p className="mt-5 rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">No pairing code yet. Generate one and send it to the customer.</p>}
              <ul className="mt-5 grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                {['Valid for 7 days', 'Single use', 'Regenerating revokes the old code', 'Typed in the mini-program, no SMS'].map((t) => <li key={t} className="rounded-lg border border-border px-2.5 py-2">{t}</li>)}
              </ul>
            </div>
          </section>

          <section className="flex min-h-0 flex-1 flex-col rounded-2xl bg-card shadow-card">
            <div className="flex shrink-0 items-center gap-2 border-b border-border px-6 py-4"><Smartphone className="size-4 text-muted-foreground" /><h2 className="text-base font-semibold">Linked WeChat accounts</h2><span className="text-sm tabular-nums text-muted-foreground">{c.linked.length}</span></div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-2">
              {c.linked.length === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">No WeChat account yet. Generate a pairing code and send it to the customer.</p>
                : <ul className="divide-y divide-border">{c.linked.map((l) => (
                  <li key={l.nick} className="flex items-center gap-3 py-3"><span className="grid size-9 place-items-center rounded-full bg-[color-mix(in_srgb,var(--success)_14%,transparent)] text-sm font-semibold text-success-text">{l.nick[0]}</span>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{l.nick}</p><p className="text-xs text-muted-foreground">Linked {l.since}</p></div><Button variant="ghost" size="sm" className="text-destructive">Unlink</Button></li>
                ))}</ul>}
            </div>
          </section>
        </div>

        {/* 发给客户的配对码卡片 */}
        <section className="flex min-h-0 flex-col items-center justify-center rounded-2xl bg-card px-6 py-6 shadow-card">
          {code ? <>
            <div className="w-full max-w-[17rem] rounded-2xl border border-border p-5 text-center shadow-[0_8px_24px_-12px_rgb(16_24_40/0.18)]">
              <p className="text-[11px] font-semibold tracking-wide text-primary">DEF BEAUTY</p>
              <p className="mt-1 text-lg font-semibold">WeChat pairing code</p>
              <p className="text-xs text-muted-foreground">{c.name} · {c.code}</p>
              <div className="my-4 flex justify-center text-foreground"><QrMark seed={code.code} /></div>
              <p className="font-mono text-2xl font-semibold tracking-[0.15em]">{code.code}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Valid until {code.until}</p>
              <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">Scan or enter this code to link your account.</p>
            </div>
            <div className="mt-4 flex gap-2"><Button variant="outline"><Download />Download image</Button><Button variant="outline" onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}><Copy />{copied ? 'Copied' : 'Copy image'}</Button></div>
            <p className="mt-2 text-xs text-muted-foreground">Paste it into the customer chat, or download it.</p>
          </> : <div className="text-center text-sm text-muted-foreground"><KeyRound className="mx-auto mb-3 size-8 opacity-50" />The code card appears here,<br />ready to send to the customer.</div>}
        </section>
      </div>
    </div>
  );
}
