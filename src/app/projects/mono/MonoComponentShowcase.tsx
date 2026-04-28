'use client';

import { useState } from 'react';
import { List, PieChart, ChevronDown, ChevronUp, Tag, Zap, Receipt, X, Check, Calendar, RefreshCw } from 'lucide-react';

// ── Shared helpers ────────────────────────────────────────────────────────────

const CURRENCY_SYMBOLS: Record<string, string> = { USD: '$', CNY: '¥', EUR: '€', JPY: '¥', GBP: '£' };
function fmt(amount: number, currency = 'USD') {
  const sym = CURRENCY_SYMBOLS[currency] ?? currency;
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  return `${sign}${sym}${abs.toFixed(2)}`;
}

const CHART_COLORS = ['#10a37f', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#ef4444'];
function getColor(i: number, override?: string) { return override ?? CHART_COLORS[i % CHART_COLORS.length]; }

/** 统一格式化 SVG 数值，避免 Node SSR 与浏览器三角函数浮点差异导致 path 字符串水合不匹配 */
function svgFmt(n: number): string {
  return (Math.round(n * 100000) / 100000).toFixed(5);
}

// ── Design tokens (dark theme) ────────────────────────────────────────────────
const T = {
  bg:          '#212121',
  surface:     'rgba(255,255,255,0.06)',
  surfaceHov:  'rgba(255,255,255,0.10)',
  border:      'rgba(255,255,255,0.09)',
  borderSub:   'rgba(255,255,255,0.05)',
  textPrimary: '#ececec',
  textSecond:  '#9b9b9b',
  accent:      '#10a37f',
};

// ── DonutChart ────────────────────────────────────────────────────────────────
function DonutChart({ data }: { data: { label: string; value: number; color?: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = 50, cy = 50, outerR = 40, innerR = 26;
  const toRad = (a: number) => (a * Math.PI) / 180;
  /** 用循环累加角度，避免在 render 回调里改写外层变量（react-hooks/immutability） */
  const segments: {
    d: string;
    color: string;
    label: string;
    pct: number;
  }[] = [];
  let currentAngle = -90;
  for (let i = 0; i < data.length; i++) {
    const p = data[i];
    let sweep = (p.value / total) * 360;
    if (sweep >= 360) sweep = 359.99;
    const start = currentAngle;
    const end = currentAngle + sweep;
    currentAngle = end;
    const x1 = cx + outerR * Math.cos(toRad(start)), y1 = cy + outerR * Math.sin(toRad(start));
    const x2 = cx + outerR * Math.cos(toRad(end)),   y2 = cy + outerR * Math.sin(toRad(end));
    const xi1 = cx + innerR * Math.cos(toRad(end)),  yi1 = cy + innerR * Math.sin(toRad(end));
    const xi2 = cx + innerR * Math.cos(toRad(start)),yi2 = cy + innerR * Math.sin(toRad(start));
    const large = sweep > 180 ? 1 : 0;
    segments.push({
      d: `M ${svgFmt(x1)} ${svgFmt(y1)} A ${outerR} ${outerR} 0 ${large} 1 ${svgFmt(x2)} ${svgFmt(y2)} L ${svgFmt(xi1)} ${svgFmt(yi1)} A ${innerR} ${innerR} 0 ${large} 0 ${svgFmt(xi2)} ${svgFmt(yi2)} Z`,
      color: getColor(i, p.color),
      label: p.label,
      pct: Math.round((p.value / total) * 100),
    });
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <svg viewBox="0 0 100 100" style={{ width: 80, height: 80, flexShrink: 0 }}>
        {segments.map((s, i) => <path key={i} d={s.d} fill={s.color} opacity={0.9} />)}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 0 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
            <span style={{ color: T.textSecond, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
            <span style={{ color: T.textPrimary, fontWeight: 500, marginLeft: 'auto' }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BudgetStatusCard ──────────────────────────────────────────────────────────
function BudgetStatusCard({ category, limit, spent, remaining, period, pct, status, affordMode, beforePct, afterPct, purchaseAmount }: {
  category: string; limit: number; spent: number; remaining: number; period: string;
  pct: number; status: 'normal' | 'warning' | 'critical';
  affordMode?: boolean; beforePct?: number; afterPct?: number; purchaseAmount?: number;
}) {
  const barColor = status === 'critical' ? '#f87171' : status === 'warning' ? '#fbbf24' : '#10a37f';
  const deltaColor = status === 'critical' ? 'rgba(248,113,113,0.7)' : status === 'warning' ? 'rgba(251,191,36,0.6)' : 'rgba(16,163,127,0.4)';

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '14px 16px', minWidth: 320 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>{category}</span>
        <span style={{ fontSize: 11, color: T.textSecond }}>{period}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, fontSize: 12, color: T.textSecond, marginBottom: 8 }}>
        {affordMode ? (
          <>
            <span>{fmt(spent)}</span>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>/</span>
            <span>{fmt(limit)}</span>
            <span style={{ color: remaining < 0 ? '#f87171' : T.textPrimary, fontWeight: 500 }}>
              · {remaining < 0 ? `${fmt(Math.abs(remaining))} over` : `${fmt(remaining)} left`}
            </span>
          </>
        ) : (
          <>
            <span>Spent {fmt(spent)}</span>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>/</span>
            <span>Limit {fmt(limit)}</span>
            <span style={{ color: T.textPrimary, fontWeight: 500 }}>· {fmt(remaining)} left</span>
          </>
        )}
      </div>

      {/* Bar */}
      {affordMode ? (
        <>
          <div style={{ height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${beforePct}%`, background: '#10a37f', borderRadius: '999px 0 0 999px' }} />
            {(afterPct ?? 0) > (beforePct ?? 0) && (
              <div style={{ position: 'absolute', top: 0, left: `${beforePct}%`, height: '100%', width: `${Math.min((afterPct ?? 0) - (beforePct ?? 0), 100 - (beforePct ?? 0))}%`, background: deltaColor, borderRadius: (afterPct ?? 0) >= 100 ? '0 999px 999px 0' : 0 }} />
            )}
          </div>
          <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: T.textSecond }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10a37f', display: 'inline-block' }} />
                {fmt(spent - (purchaseAmount ?? 0))} spent
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: deltaColor, display: 'inline-block' }} />
                +{fmt(purchaseAmount ?? 0)}
              </span>
            </div>
            <span>{beforePct}% → {afterPct}%</span>
          </div>
        </>
      ) : (
        <>
          <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 999, transition: 'width 0.6s ease' }} />
          </div>
          <p style={{ fontSize: 10, color: T.textSecond, marginTop: 5 }}>{pct}% used</p>
        </>
      )}
    </div>
  );
}

// ── SpendingRecordsCard ───────────────────────────────────────────────────────
function SpendingRecordsCard({ title, subtitle, items, chartData, totalStr }: {
  title: string; subtitle: string; totalStr: string;
  items: { category: string; description: string; amount: string; date: string; type: 'income' | 'expense' }[];
  chartData: { label: string; value: number; color?: string }[];
}) {
  const [view, setView] = useState<'breakdown' | 'list'>('breakdown');
  const tabBtn = (active: boolean) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px',
    borderRadius: 8, fontSize: 11, fontWeight: 500, border: 'none', cursor: 'pointer',
    background: active ? T.surfaceHov : 'transparent',
    color: active ? T.textPrimary : T.textSecond,
    outline: active ? `1px solid ${T.border}` : 'none',
    transition: 'all 0.15s',
  } as React.CSSProperties);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>{title}</div>
          <div style={{ fontSize: 11, color: T.textSecond, marginTop: 2 }}>{subtitle}</div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button style={tabBtn(view === 'breakdown')} onClick={() => setView('breakdown')}>
            <PieChart size={11} /> Breakdown
          </button>
          <button style={tabBtn(view === 'list')} onClick={() => setView('list')}>
            <List size={11} /> List
          </button>
        </div>
      </div>

      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '14px 16px', minHeight: 160 }}>
        {view === 'breakdown' ? (
          <DonutChart data={chartData} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 6px', borderRadius: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, color: T.textPrimary, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</span>
                    <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: T.surfaceHov, color: T.textSecond, flexShrink: 0 }}>{item.category}</span>
                  </div>
                  <div style={{ fontSize: 10, color: T.textSecond, marginTop: 1 }}>{item.date}</div>
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: item.type === 'income' ? '#34d399' : T.textPrimary, flexShrink: 0 }}>{item.amount}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '10px 16px', marginTop: 8 }}>
        <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.textSecond, marginBottom: 3 }}>Total</div>
        <span style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 600, color: T.textPrimary }}>{totalStr}</span>
      </div>
    </div>
  );
}

// ── InsightCard ───────────────────────────────────────────────────────────────
function InsightCard({ title, subtitle, summary, tags, chartData, chartType }: {
  title: string; subtitle?: string; summary: string; tags: string[];
  chartData: { label: string; value: number; color?: string }[];
  chartType: 'donut' | 'bar';
}) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: T.textPrimary }}>{title}</div>
          {subtitle && <div style={{ fontSize: 10, color: T.textSecond, marginTop: 2 }}>{subtitle}</div>}
        </div>
        {expanded ? <ChevronUp size={14} color={T.textSecond} /> : <ChevronDown size={14} color={T.textSecond} />}
      </button>

      <div style={{ maxHeight: expanded ? 400 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
        <div style={{ padding: '0 12px 12px' }}>
          {chartType === 'donut' ? (
            <DonutChart data={chartData} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80, paddingBottom: 4 }}>
              {(() => {
                const max = Math.max(...chartData.map(d => d.value), 1);
                return chartData.map((p, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: '100%', background: getColor(i, p.color), borderRadius: '3px 3px 0 0', height: `${(p.value / max) * 64}px`, opacity: 0.85 }} />
                    <span style={{ fontSize: 9, color: T.textSecond, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{p.label}</span>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
        <div style={{ padding: '0 16px 12px' }}>
          <p style={{ fontSize: 11, color: T.textSecond, lineHeight: 1.6, margin: 0 }}>{summary}</p>
        </div>
        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, padding: '0 16px 12px', flexWrap: 'wrap' }}>
            {tags.map(tag => (
              <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, padding: '2px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', color: T.textSecond, border: `1px solid ${T.borderSub}` }}>
                <Tag size={7} /> {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── RecordExpenseCard ─────────────────────────────────────────────────────────
const CATEGORIES: Record<string, string[]> = {
  'Food & Dining': ['Groceries', 'Restaurant', 'Coffee', 'Takeout', 'Alcohol'],
  'Transport': ['Rideshare', 'Gas', 'Parking', 'Public Transit', 'Flight'],
  'Shopping': ['Clothing', 'Electronics', 'Home', 'Beauty', 'Books'],
  'Health': ['Pharmacy', 'Gym', 'Doctor', 'Dental', 'Insurance'],
  'Entertainment': ['Streaming', 'Movies', 'Games', 'Concerts', 'Sports'],
  'Bills & Utilities': ['Rent', 'Electricity', 'Water', 'Internet', 'Phone'],
  'Other': [],
};

function RecordExpenseCard() {
  const [amount, setAmount] = useState('89.40');
  const [currency, setCurrency] = useState('USD');
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [title, setTitle] = useState('Whole Foods Market');
  const [merchant, setMerchant] = useState('Whole Foods');
  const [date, setDate] = useState('2026-04-24');
  const [mainCat, setMainCat] = useState('Food & Dining');
  const [subCat, setSubCat] = useState('Groceries');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurPeriod, setRecurPeriod] = useState('monthly');
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const field: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', gap: 5,
  };
  const label: React.CSSProperties = {
    fontSize: 10, color: T.textSecond, fontFamily: 'system-ui',
  };
  const input: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '7px 10px', borderRadius: 8, border: `1px solid ${T.border}`,
    background: 'rgba(255,255,255,0.05)', color: T.textPrimary,
    fontSize: 12, fontFamily: 'system-ui', outline: 'none',
  };
  const select: React.CSSProperties = {
    ...input, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239b9b9b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
    paddingRight: 28,
  };

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Receipt size={15} color={T.accent} />
          <span style={{ fontSize: 13, fontWeight: 500, color: T.textPrimary, fontFamily: 'system-ui' }}>Confirm Expense</span>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: T.textSecond, display: 'flex' }}>
          <X size={15} />
        </button>
      </div>

      {/* Fields */}
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>

        {/* Amount + currency */}
        <div style={field}>
          <span style={label}>Amount</span>
          <div style={{ display: 'flex', border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
            <input
              type="text" value={amount}
              onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', padding: '7px 10px', fontSize: 12, color: T.textPrimary, fontFamily: 'system-ui', outline: 'none' }}
            />
            <div style={{ borderLeft: `1px solid ${T.border}`, position: 'relative' }}>
              <button
                onClick={() => setCurrencyOpen(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 10px', background: 'none', border: 'none', cursor: 'pointer', color: T.textPrimary, fontSize: 12, fontFamily: 'system-ui' }}
              >
                {currency} <ChevronDown size={11} color={T.textSecond} />
              </button>
              {currencyOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, zIndex: 10, background: '#2a2a2a', border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden', minWidth: 72 }}>
                  {['USD','CNY','EUR','GBP','JPY'].map(c => (
                    <button key={c} onClick={() => { setCurrency(c); setCurrencyOpen(false); }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 12px', background: c === currency ? T.surfaceHov : 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: T.textPrimary, fontFamily: 'system-ui' }}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={field}>
          <span style={label}>Record title</span>
          <input style={input} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Lunch, Coffee" />
        </div>

        {/* Merchant */}
        <div style={field}>
          <span style={label}>Merchant</span>
          <input style={input} value={merchant} onChange={e => setMerchant(e.target.value)} placeholder="e.g. Starbucks" />
        </div>

        {/* Date */}
        <div style={field}>
          <span style={label}>Date</span>
          <input type="date" style={{ ...input, colorScheme: 'dark' }} value={date} onChange={e => setDate(e.target.value)} />
        </div>

        {/* Category */}
        <div style={field}>
          <span style={label}>Category</span>
          <select style={select} value={mainCat} onChange={e => { setMainCat(e.target.value); setSubCat(''); }}>
            {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {mainCat && mainCat !== 'Other' && (
            <input
              style={{ ...input, marginTop: 4 }}
              value={subCat}
              onChange={e => setSubCat(e.target.value)}
              placeholder={`e.g. ${(CATEGORIES[mainCat] ?? []).slice(0, 3).join(', ')}`}
            />
          )}
        </div>

        {/* Recurring */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`, borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)}
              style={{ accentColor: T.accent, width: 13, height: 13 }} />
            <span style={{ fontSize: 12, color: T.textPrimary, fontFamily: 'system-ui' }}>Fixed recurring expense</span>
          </label>
          {isRecurring && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 10, color: T.textSecond, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Calendar size={10} /> Repeat interval
              </span>
              <select style={select} value={recurPeriod} onChange={e => setRecurPeriod(e.target.value)}>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}
        </div>

        {/* Note */}
        <div style={field}>
          <span style={label}>Note</span>
          <textarea style={{ ...input, resize: 'none', height: 56 }} value={note} onChange={e => setNote(e.target.value)} placeholder="Optional" />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 14px', borderTop: `1px solid ${T.border}` }}>
        <button style={{ flex: 1, padding: '8px', borderRadius: 10, border: `1px solid ${T.border}`, background: 'transparent', color: T.textPrimary, fontSize: 12, fontFamily: 'system-ui', cursor: 'pointer' }}>
          Cancel
        </button>
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', borderRadius: 10, border: 'none', background: saved ? 'rgba(16,163,127,0.2)' : T.accent, color: saved ? '#34d399' : '#fff', fontSize: 12, fontWeight: 500, fontFamily: 'system-ui', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          {saved ? <><Check size={13} /> Saved</> : <><Check size={13} /> Confirm &amp; Save</>}
        </button>
      </div>
    </div>
  );
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const BUDGET_NORMAL = { category: 'Dining Out', limit: 400, spent: 292, remaining: 108, period: 'April', pct: 73, status: 'normal' as const };
const BUDGET_AFFORD = { category: 'Groceries', limit: 300, spent: 274, remaining: -14, period: 'April', pct: 96, status: 'critical' as const, affordMode: true, beforePct: 71, afterPct: 96, purchaseAmount: 74 };
const SPENDING_ITEMS = [
  { category: 'Food', description: 'Whole Foods Market', amount: '-$89.40', date: 'Apr 24', type: 'expense' as const },
  { category: 'Transport', description: 'Uber', amount: '-$23.50', date: 'Apr 23', type: 'expense' as const },
  { category: 'Food', description: 'Blue Bottle Coffee', amount: '-$12.80', date: 'Apr 23', type: 'expense' as const },
  { category: 'Salary', description: 'Monthly salary', amount: '+$4,200.00', date: 'Apr 22', type: 'income' as const },
  { category: 'Dining', description: 'Nobu Restaurant', amount: '-$145.00', date: 'Apr 21', type: 'expense' as const },
];
const SPENDING_CHART = [
  { label: 'Food & Dining', value: 247 },
  { label: 'Transport', value: 88 },
  { label: 'Shopping', value: 134 },
  { label: 'Health', value: 56 },
  { label: 'Entertainment', value: 43 },
];
const INSIGHT_CHART = [
  { label: 'Food & Dining', value: 247 },
  { label: 'Transport', value: 88 },
  { label: 'Shopping', value: 134 },
  { label: 'Health', value: 56 },
  { label: 'Entertainment', value: 43 },
];
const WEEK_CHART = [
  { label: 'Mon', value: 42 },
  { label: 'Tue', value: 18 },
  { label: 'Wed', value: 95 },
  { label: 'Thu', value: 34 },
  { label: 'Fri', value: 110 },
  { label: 'Sat', value: 78 },
  { label: 'Sun', value: 22 },
];

// ── Card label ────────────────────────────────────────────────────────────────
function Label({ name, desc }: { name: string; desc: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
        <Zap size={9} color="#10a37f" />
        <code style={{ fontSize: 10, fontFamily: 'monospace', color: '#10a37f', letterSpacing: '0.04em' }}>{name}</code>
      </div>
      <p style={{ fontSize: 10, color: '#9b9b9b', lineHeight: 1.55, margin: 0, fontFamily: 'system-ui' }}>{desc}</p>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function MonoComponentShowcase() {
  return (
    <div style={{
      background: '#1A1A1A',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 20,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gridTemplateRows: 'auto auto auto',
      gap: 16,
      alignItems: 'start',
    }}>

      {/* Col 1–2, Row 1: BudgetGauge × 2 */}
      <div>
        <Label name="BudgetGauge" desc="Budget progress — color shifts green → amber → red as spending nears the cap." />
        <BudgetStatusCard {...BUDGET_NORMAL} />
      </div>

      <div>
        <Label name="BudgetGauge · Afford" desc='"Can I afford $74 at Whole Foods?" — delta bar shows before/after state.' />
        <BudgetStatusCard {...BUDGET_AFFORD} />
      </div>

      {/* Col 3, Row 1–2: SpendingRecords */}
      <div style={{ gridColumn: '3', gridRow: '1 / 3' }}>
        <Label name="SpendingRecords" desc="Donut breakdown and transaction list — toggle between views." />
        <SpendingRecordsCard
          title="This Week"
          subtitle="Apr 21 – Apr 28"
          totalStr="$568.70"
          items={SPENDING_ITEMS}
          chartData={SPENDING_CHART}
        />
      </div>

      {/* Col 4, Row 1–3: RecordExpense */}
      <div style={{ gridColumn: '4', gridRow: '1 / 4' }}>
        <Label name="ConfirmExpense" desc="AI-parsed expense form — pre-fills amount, merchant, category from natural language. User confirms or edits before saving." />
        <RecordExpenseCard />
      </div>

      {/* Col 1–2, Row 2: InsightCards */}
      <div style={{ gridColumn: '1 / 3' }}>
        <Label name="InsightCard" desc="AI-generated financial observations with expandable charts and tags." />
        <div style={{ display: 'flex', gap: 10 }}>
          <InsightCard
            title="Dining & Food up 28%"
            subtitle="vs. last month"
            summary="You spent $247 on food this month vs. $193 last month. Most of the increase came from weekend restaurant meals."
            tags={['food', 'trend', 'overspend']}
            chartData={INSIGHT_CHART}
            chartType="donut"
          />
          <InsightCard
            title="Daily spending by weekday"
            subtitle="This week"
            summary="Wednesday and Friday show the highest spend — likely grocery runs and dining out."
            tags={['weekly', 'pattern']}
            chartData={WEEK_CHART}
            chartType="bar"
          />
        </div>
      </div>

    </div>
  );
}
