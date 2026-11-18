import React from 'react';
import { Num, useGrow } from '../motion';
import { AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CONFIDENCE, confidenceOf, planScore, scoreOf, useScores } from './score-store';

/** 可信度：三个点 + 文字，颜色只是辅助 */
export function ConfidenceDots({ sid, showLabel = true }: { sid: string; showLabel?: boolean }) {
  const s = useScores().suppliers[sid];
  if (!s) return null;
  const c = CONFIDENCE[confidenceOf(s)];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground" title={c.note}>
      <span className="flex gap-0.5" aria-hidden>{[0, 1, 2].map((i) => <span key={i} className="size-1.5 rounded-full" style={{ background: i < c.dots ? c.tone : 'var(--border)' }} />)}</span>
      {showLabel && c.label}
    </span>
  );
}

/** 一行摘要：准确率 + 可信度；没有分数时说明原因 */
export function ScoreLine({ sid, onOpen }: { sid: string; onOpen?: () => void }) {
  const s = useScores().suppliers[sid];
  if (!s) return null;
  const score = scoreOf(s);
  const body = (
    <>
      <span className="text-muted-foreground">Plan accuracy</span>
      <span className="font-semibold tabular-nums text-foreground">{score == null ? 'No score yet' : `${score}%`}</span>
      {score != null && <ConfidenceDots sid={sid} showLabel={false} />}
    </>
  );
  return onOpen
    ? <button type="button" onClick={onOpen} className="inline-flex items-center gap-1.5 rounded-md text-xs hover:underline">{body}</button>
    : <span className="inline-flex items-center gap-1.5 text-xs">{body}</span>;
}

/** 供应商评分卡：分数、最近几张单的柱形、可信度依据、待 review 提醒 */
export function SupplierScoreCard({ sid, onReview }: { sid: string; onReview?: (po: string) => void }) {
  const { suppliers } = useScores();
  const s = suppliers[sid];
  if (!s) return null;
  const score = scoreOf(s);
  const conf = confidenceOf(s);
  const c = CONFIDENCE[conf];
  const h = s.history.slice(-6);
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Plan accuracy · {s.name}</p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">{score == null ? '—' : `${score}%`}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-border px-2.5 py-1 text-xs font-medium"><ConfidenceDots sid={sid} showLabel={false} />{c.label}</span>
      </div>

      {h.length > 0 ? (
        <figure>
          {/* 最近几张已 review 的单：同一色相，最新一张最深；纵轴从 50% 起 */}
          <div className="flex h-24 items-end gap-2 border-b border-border" role="img" aria-label={`Last ${h.length} reviewed orders: ${h.map((x) => x.score + '%').join(', ')}`}>
            {h.map((x, i) => (
              <div key={x.po} className="group relative flex flex-1 flex-col items-center justify-end" style={{ height: '100%' }} title={`${x.po} · ${x.score}%`}>
                <span className={'mb-1 text-[11px] tabular-nums ' + (i === h.length - 1 ? 'font-semibold text-foreground' : 'text-muted-foreground opacity-0 group-hover:opacity-100')}>{x.score}</span>
                <span className="w-full max-w-7 rounded-t-[4px]" style={{ height: `${Math.max(6, ((x.score - 50) / 50) * 100)}%`, background: i === h.length - 1 ? 'var(--primary)' : 'color-mix(in srgb, var(--primary) 35%, var(--surface-raised))' }} />
              </div>
            ))}
          </div>
          <figcaption className="mt-1.5 flex justify-between text-[11px] text-muted-foreground"><span>Older</span><span>Last {h.length} reviewed orders</span><span>Latest</span></figcaption>
        </figure>
      ) : <p className="rounded-xl bg-muted px-3.5 py-3 text-sm text-muted-foreground">{c.note}</p>}

      <dl className="divide-y divide-border rounded-xl border border-border text-sm">
        {([['Reviewed orders', `${s.history.length}${s.skipped ? ` · ${s.skipped} skipped` : ''}`], ['Orders placed', `about every ${s.everyDays} days`], ['Sales history', `${s.salesMonths} months`]] as const).map(([k, v]) => (
          <div key={k} className="flex h-10 items-center justify-between gap-4 px-3.5"><dt className="text-muted-foreground">{k}</dt><dd className="whitespace-nowrap font-medium tabular-nums">{v}</dd></div>
        ))}
      </dl>
      {conf !== 'high' && conf !== 'none' && <p className="text-xs text-muted-foreground">{c.note}</p>}

      {s.pending.length > 0 && (
        <div className="flex items-start gap-2.5 rounded-xl bg-status-warning-subtle px-3.5 py-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-text" />
          <div className="min-w-0 flex-1 text-sm"><p className="font-medium">{s.pending[0]} is waiting for review</p><p className="text-xs text-muted-foreground">Its result is not in the score yet.</p></div>
          {onReview && <Button size="sm" variant="outline" onClick={() => onReview(s.pending[0])}>Review</Button>}
        </div>
      )}

      <details className="group text-xs text-muted-foreground">
        <summary className="cursor-pointer list-none font-medium text-foreground hover:underline">How the score works</summary>
        <p className="mt-2 leading-relaxed">Each review compares what the plan ordered with what was needed while it lasted, product by product. The supplier score is the weighted average of the last 6 reviewed orders, newest counting most. Skipped reviews and products the supplier did not ship are left out.</p>
      </details>
    </div>
  );
}

/** 新计划的评分：顶部一块看结果，下面一条“起点 → 扣分 → 结果”的算式 */
export function PlanScoreDetail({ sid = 'mnp', onSupplier }: { sid?: string; onSupplier?: () => void }) {
  const st = useScores();
  const p = planScore(st, sid);
  const c = CONFIDENCE[p.conf];
  const name = st.suppliers[sid].name;
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border px-4 py-4" style={{ background: 'linear-gradient(160deg, color-mix(in srgb, var(--primary) 7%, var(--surface-raised)) 0%, var(--surface-raised) 60%)' }}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-muted-foreground">Expected accuracy</span>
          <ConfidenceDots sid={sid} />
        </div>
        <p className="mt-1.5 flex items-baseline gap-2">
          <span className="text-4xl font-semibold leading-none tracking-tight tabular-nums">{p.expected}<span className="text-xl text-muted-foreground">%</span></span>
          <span className="text-xs tabular-nums text-muted-foreground">likely {p.low}–{p.high}%</span>
        </p>
        <div className="relative mt-4 h-1.5 rounded-full bg-[color-mix(in_srgb,var(--foreground)_7%,transparent)]" aria-hidden>
          <span className="absolute inset-y-0 rounded-full" style={{ left: `${(p.low - 50) * 2}%`, width: `${(p.high - p.low) * 2}%`, background: 'color-mix(in srgb, var(--primary) 35%, transparent)' }} />
          <span className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-card" style={{ left: `${(p.expected - 50) * 2}%` }} />
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] tabular-nums text-muted-foreground"><span>50%</span><span>100%</span></div>
      </section>

      <section>
        <h4 className="text-xs font-semibold text-muted-foreground">How it’s built</h4>
        <ol className="mt-3 space-y-1">
          {/* 起点：供应商历史 */}
          <li className="flex items-center justify-between gap-4 rounded-xl bg-muted px-3.5 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold">{name} track record</p>
              <p className="text-xs text-muted-foreground">{p.reviewed} reviewed orders{onSupplier && <> · <button type="button" onClick={onSupplier} className="font-medium text-primary hover:underline">History</button></>}</p>
            </div>
            <span className="shrink-0 text-base font-semibold tabular-nums">{p.base}%</span>
          </li>
          {/* 扣分：缩进挂在一条竖线上，读起来是从起点往下减 */}
          <li className="relative ml-[1.375rem] border-l border-dashed border-border py-1 pl-4">
            <ul className="space-y-3 py-2">
              {p.adjustments.map((a) => (
                <li key={a.label} className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><p className="text-sm font-medium">{a.label}</p><p className="text-xs text-muted-foreground">{a.detail}</p></div>
                  <span className="mt-px shrink-0 rounded-md bg-status-warning-subtle px-1.5 py-0.5 text-xs font-semibold tabular-nums text-warning-text">{a.delta}</span>
                </li>
              ))}
            </ul>
          </li>
          {/* 结果 */}
          <li className="flex items-center justify-between gap-4 rounded-xl border border-primary/25 bg-primary/5 px-3.5 py-3">
            <p className="text-sm font-semibold">Expected accuracy</p>
            <span className="shrink-0 text-base font-semibold tabular-nums text-primary-strong">{p.expected}%</span>
          </li>
        </ol>
      </section>
    </div>
  );
}

/** 页头的预计准确率小卡片。出现时：卡片上浮淡入 → 圆环从 0 画到分数、数字同步滚动 → 区间最后淡入 */
export function ExpectedTile({ expected, low, high, onClick }: { expected: number; low: number; high: number; onClick: () => void }) {
  const drawn = useGrow(expected, 0, 180);
  return (
    <button type="button" onClick={onClick} title="Why this score"
      className="rise-in group flex shrink-0 items-center gap-3 rounded-xl border border-border bg-surface-sunken py-2 pl-2.5 pr-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5">
      <svg viewBox="0 0 40 40" className="size-9 -rotate-90" aria-hidden>
        <circle cx="20" cy="20" r="16" fill="none" stroke="color-mix(in srgb, var(--primary) 15%, transparent)" strokeWidth="4" />
        <circle cx="20" cy="20" r="16" fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round"
          strokeDasharray={`${(drawn / 100) * 100.5} 100.5`} style={{ transition: 'stroke-dasharray 1000ms var(--ease-out)' }} />
      </svg>
      <span className="leading-tight">
        <span className="block text-xs text-muted-foreground">Expected accuracy</span>
        <span className="flex items-baseline gap-1.5">
          <span className="text-xl font-semibold"><Num value={`${expected}%`} duration={1000} /></span>
          <span className="fade-in whitespace-nowrap text-xs tabular-nums text-muted-foreground" style={{ animationDelay: '900ms' }}>likely {low}–{high}%</span>
        </span>
      </span>
    </button>
  );
}
