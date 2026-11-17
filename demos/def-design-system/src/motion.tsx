import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

/** 动效基础件：滑动选中块的分段切换、数字滚动。缓动和时长统一取 index.css 里的 --ease-spring / --ease-out。 */

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────── 分段切换：选中底色在选项之间滑动，带一点回弹 ───────── */
export function SlideTabs<T extends string>({ items, value, onChange, label, kind = 'tab', className = '', itemClassName = '', activeClassName = '', idleClassName = '', indicatorClassName = '' }: {
  items: { id: T; label: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  kind?: 'tab' | 'radio';
  className?: string;
  itemClassName?: string;
  activeClassName?: string;
  idleClassName?: string;
  indicatorClassName?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const first = useRef(true);

  useLayoutEffect(() => {
    const place = () => {
      const el = wrap.current?.querySelector<HTMLElement>(`[data-id="${value}"]`);
      const b = bar.current;
      if (!el || !b) return;
      b.style.transition = first.current || reduced() ? 'none' : '';
      b.style.width = el.offsetWidth + 'px';
      b.style.height = el.offsetHeight + 'px';
      b.style.transform = `translate(${el.offsetLeft}px, ${el.offsetTop}px)`;
      first.current = false;
    };
    place();
    // 字体加载或容器尺寸变化后重新对齐（保留过渡，不打断正在进行的滑动）
    const ro = new ResizeObserver(() => place());
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [value]);

  return (
    <div ref={wrap} role={kind === 'tab' ? 'tablist' : 'radiogroup'} aria-label={label} className={'relative isolate ' + className}>
      <span ref={bar} aria-hidden className={'slide-indicator pointer-events-none absolute left-0 top-0 -z-10 ' + indicatorClassName} />
      {items.map((it) => {
        const on = it.id === value;
        return (
          <button
            key={it.id}
            data-id={it.id}
            type="button"
            role={kind}
            {...(kind === 'tab' ? { 'aria-selected': on } : { 'aria-checked': on })}
            onClick={() => onChange(it.id)}
            className={itemClassName + ' relative transition-colors duration-200 ' + (on ? activeClassName : idleClassName)}
          >
            {/* 预留粗体宽度：选中变粗时按钮不变宽，整组不抖动 */}
            <span className="inline-grid">
              <span aria-hidden className="invisible col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5 font-semibold">{it.label}</span>
              <span className="col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5">{it.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ───────── 数字滚动：解析 "€326,704.50" / "68%" / "1,284" 这类字符串，只动数字部分 ───────── */
const NUM = /-?\d[\d,]*(\.\d+)?/;
function parse(s: string) {
  const m = s.match(NUM);
  if (!m || m.index === undefined) return null;
  const raw = m[0];
  return { pre: s.slice(0, m.index), post: s.slice(m.index + raw.length), n: Number(raw.replace(/,/g, '')), dec: m[1] ? m[1].length - 1 : 0, comma: raw.includes(',') || Math.abs(Number(raw.replace(/,/g, ''))) >= 10000 };
}
const fmt = (n: number, dec: number, comma: boolean) => comma ? n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : n.toFixed(dec);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

/** bare：只输出文字（放进 SVG <text> 里时用）。 */
export function Num({ value, duration = 900, from = 0, bare = false }: { value: string | number; duration?: number; from?: number; bare?: boolean }) {
  const str = String(value);
  const target = parse(str);
  const [shown, setShown] = useState(() => (target && !reduced() ? target.pre + fmt(from * target.n, target.dec, target.comma) + target.post : str));
  const last = useRef(target ? from * target.n : 0);

  useEffect(() => {
    if (!target) { setShown(str); return; }
    const start = last.current;
    const end = target.n;
    last.current = end;
    if (reduced() || start === end || document.hidden) { setShown(str); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const v = start + (end - start) * easeOut(t);
      setShown(t < 1 ? target.pre + fmt(v, target.dec, target.comma) + target.post : str);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // 后台标签页里 rAF 不跑：到点直接落到终值
    const done = window.setTimeout(() => setShown(str), duration + 150);
    return () => { cancelAnimationFrame(raf); clearTimeout(done); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [str]);

  return bare ? <>{shown}</> : <span className="tabular-nums">{shown}</span>;
}

/** 进场时从 0 长到目标值；之后数据变化时平滑过渡。用于条形宽度、环形进度这类非 recharts 图形。 */
export function useGrow<T>(target: T, zero: T, delay = 60): T {
  const [v, setV] = useState<T>(() => (reduced() ? target : zero));
  useEffect(() => {
    if (reduced()) { setV(target); return; }
    const id = window.setTimeout(() => setV(target), delay);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(target)]);
  return v;
}
