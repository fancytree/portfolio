import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Map as MapIcon, RotateCcw } from 'lucide-react';

/**
 * 全屏 demo 的流程指引（?tour=1）。参考原 Agent demo 的 coach：
 * - 指向真实控件，不复制假 UI；覆盖层不挡点击，访客随时可以自己操作；
 * - 访客做完这一步（页面状态变了）就自动进入下一步；
 * - 不想自己点，可以按 Show me，由指引替他完成这一步。
 * 页面是单页应用，跨页面也能连续引导；每 250ms 读一次 DOM，判断位置和完成状态。
 */

type Step = {
  title: string; body: string;
  /** 要高亮的元素 */
  target: () => HTMLElement | null;
  /** 这一步完成了吗（看页面状态） */
  done: () => boolean;
  /** Show me：替访客完成 */
  show?: () => void | Promise<void>;
};

const visible = (el: Element | null): el is HTMLElement => {
  if (!el) return false;
  const r = (el as HTMLElement).getBoundingClientRect();
  return r.width > 0 && r.height > 0;
};
const find = (sel: string, text?: string) => [...document.querySelectorAll<HTMLElement>(sel)].find((e) => visible(e) && (!text || e.textContent?.trim().startsWith(text))) ?? null;
const has = (sel: string, text?: string) => find(sel, text) != null;
const h1 = () => document.querySelector('h1')?.textContent?.trim() ?? '';
/** 采购单页头的状态标签 */
const badge = (label: string) => document.querySelector('h1')?.parentElement?.querySelector('[data-slot="badge"]')?.textContent?.trim() === label;
const exact = (sel: string, text: string) => [...document.querySelectorAll<HTMLElement>(sel)].find((e) => visible(e) && e.textContent?.trim() === text) ?? null;
const click = (el: HTMLElement | null) => el?.click();
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const typeInto = (el: HTMLTextAreaElement | null, text: string) => {
  if (!el) return;
  Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(el, text);
  el.dispatchEvent(new Event('input', { bubbles: true }));
};

const STEPS: Step[] = [
  { title: 'Start with MNP', body: 'Stock runs out before the next delivery.',
    target: () => find('article[aria-label="MNP replenishment"] button', 'Create purchase order'),
    done: () => has('[role="dialog"] h2', 'Review the last MNP order') || h1().startsWith('PO-'),
    show: () => click(find('article[aria-label="MNP replenishment"] button', 'Create purchase order')) },
  { title: 'Review the last order first', body: 'It sharpens the next plan. Skipping is fine.',
    target: () => find('[role="dialog"] button', 'Review first'),
    done: () => h1() === 'PO-2026-0838' || h1() === 'PO-2026-0843',
    show: () => click(find('[role="dialog"] button', 'Review first')) },
  { title: 'Add what you saw', body: 'The agent scored the order. Your turn.',
    target: () => find('button', 'Write review'),
    done: () => has('[role="dialog"] h2', 'Review this order') || has('article[aria-label="What changes in the next MNP plan"]') || h1() === 'PO-2026-0843',
    show: () => click(find('button', 'Write review')) },
  { title: 'Rate it, name exceptions', body: 'Drag a slider, mention a SKU, save.',
    target: () => find('[role="dialog"]') ,
    done: () => has('article[aria-label="What changes in the next MNP plan"]') || h1() === 'PO-2026-0843',
    show: async () => {
      typeInto(document.querySelector<HTMLTextAreaElement>('#review-note'), 'Black Onyx sells, but salons report chipping. Keep it flat.');
      await wait(700);
      click(find('[role="dialog"] button', 'Save review'));
    } },
  { title: 'Back to the new plan', body: 'MNP’s accuracy is updated.',
    target: () => find('button', 'Continue to the new MNP plan'),
    done: () => h1() === 'PO-2026-0843',
    show: () => click(find('button', 'Continue to the new MNP plan')) },
  { title: 'See the plan score', body: 'Open it to see every point.',
    target: () => find('button[title="Why this score"]'),
    done: () => has('h4', 'How it’s built'),
    show: () => click(find('button[title="Why this score"]')) },
  { title: 'Ask why on a line', body: 'Open a product, then choose Why.',
    target: () => find('tbody button', 'Why 96') ?? find('tbody button[aria-expanded]', 'Reinforced bonder'),
    done: () => has('article[aria-label="370102 · 14 ml"]'),
    show: async () => {
      if (!find('tbody button', 'Why 96')) { click(find('tbody button[aria-expanded]', 'Reinforced bonder')); await wait(400); }
      click(find('tbody button', 'Why 96'));
    } },
  { title: 'Upload the confirmation', body: 'Click the upload area. Differences show on each line.',
    target: () => find('[data-upload-drop]') ?? find('button', 'Upload confirmation'),
    done: () => has('article[aria-label="Confirmation needs review"]') && !has('[role="dialog"]'),
    show: async () => { if (!find('[data-upload-drop]')) { click(find('button', 'Upload confirmation')); await wait(600); } click(find('[data-upload-drop]')); } },
  { title: 'Choose who approves', body: 'Approving doesn’t place the order.',
    target: () => exact('[role="dialog"] button', 'Approve') ?? exact('[role="dialog"] button', 'Send to owner') ?? exact('button', 'Approve'),
    done: () => badge('Approved') || badge('Waiting for owner') || badge('Ordered'),
    show: async () => { if (!has('[role="dialog"] h2', 'Choose approval path')) { click(exact('button', 'Approve')); await wait(700); } click(exact('[role="dialog"] button', 'Approve') ?? exact('[role="dialog"] button', 'Send to owner')); } },
  { title: 'Mark as ordered', body: 'After you order from MNP.',
    target: () => find('button', 'Approve as owner') ?? find('button', 'Mark as ordered'),
    done: () => badge('Ordered'),
    show: async () => { click(find('button', 'Approve as owner')); await wait(300); click(find('button', 'Mark as ordered')); } },
  { title: 'Upload the delivery note', body: 'Click the upload area. Actual is filled in.',
    target: () => find('[data-upload-drop]') ?? find('button', 'Upload DDT'),
    done: () => has('article[aria-label="Delivery note checked"]') && !has('[role="dialog"]'),
    show: async () => { if (!find('[data-upload-drop]')) { click(find('button', 'Upload DDT')); await wait(600); } click(find('[data-upload-drop]')); } },
  { title: 'Confirm what arrived', body: 'Decide the extra line first.',
    target: () => find('[role="dialog"] button', 'Confirm receipt') ?? find('tbody button[aria-pressed]', 'Gift') ?? find('button', 'Confirm receipt'),
    done: () => badge('Partially received'),
    show: async () => {
      click(find('tbody button[aria-pressed]', 'Gift')); await wait(300);
      click(find('button', 'Confirm receipt')); await wait(600);
      click(find('[role="dialog"] button[role="combobox"]')); await wait(300);
      click(find('[role="option"]', 'Elena Rossi')); await wait(200);
      click(find('[role="dialog"] button', 'Confirm receipt'));
    } },
];

type Rect = { top: number; left: number; width: number; height: number };
const CARD_W = 264;

export function AgentTour() {
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [open, setOpen] = useState(true);
  const [busy, setBusy] = useState(false);
  const iRef = useRef(0); iRef.current = i;

  // 读 DOM：完成了就往前走；记下目标位置
  useEffect(() => {
    const t = setInterval(() => {
      let k = iRef.current;
      while (k < STEPS.length && STEPS[k].done()) k++;
      if (k !== iRef.current) { setI(k); setBusy(false); }
      const el = k < STEPS.length ? STEPS[k].target() : null;
      if (el) { const r = el.getBoundingClientRect(); setRect({ top: r.top, left: r.left, width: r.width, height: r.height }); } else setRect(null);
    }, 250);
    return () => clearInterval(t);
  }, []);

  const finished = i >= STEPS.length;
  const step = STEPS[Math.min(i, STEPS.length - 1)];
  // 卡片放在目标左右空间大的一侧；目标太大（弹窗）就放在它旁边的空白处
  const pos = (() => {
    const W = window.innerWidth, H = window.innerHeight;
    if (!rect || finished) return { left: 24, top: H - 200, side: null as null | 'left' | 'right', arrow: 0 };
    const right = W - rect.left - rect.width > CARD_W + 40;
    const left = right ? rect.left + rect.width + 22 : rect.left - CARD_W - 22;
    const top = Math.min(Math.max(16, rect.top + rect.height / 2 - 60), H - 180);
    // 小尖角指向高亮的控件
    return { left: Math.min(Math.max(16, left), W - CARD_W - 16), top, side: right ? 'left' as const : 'right' as const, arrow: Math.min(Math.max(18, rect.top + rect.height / 2 - top), 130) };
  })();

  const showMe = async () => { if (!step.show || busy) return; setBusy(true); await step.show(); setTimeout(() => setBusy(false), 2500); };

  return (
    <div className="pointer-events-none fixed inset-0 z-[2147483000]" aria-live="polite">
      {/* 高亮：一圈呼吸的描边，不挡点击 */}
      {open && rect && !finished && (
        <span className="absolute rounded-xl transition-all duration-300 ease-out"
          style={{ top: rect.top - 6, left: rect.left - 6, width: rect.width + 12, height: rect.height + 12, boxShadow: '0 0 0 3px var(--primary), 0 0 0 9px color-mix(in srgb, var(--primary) 22%, transparent)' }}>
          <span className="absolute inset-0 animate-ping rounded-xl ring-2 ring-primary/40" style={{ animationDuration: '1.8s' }} />
        </span>
      )}

      {open && !rect && !finished ? null : open ? (
        /* 深色卡片，和页面里的白色卡片区分开；弹窗打开时点击不往外传，也不抢焦点。
           没有要指的控件时（比如计划生成中）直接隐藏，不在屏幕上移动吸引视线；
           每一步重新挂载，在新位置淡入，而不是从旧位置滑过去。 */
        <section key={finished ? 'done' : i} onPointerDown={(e) => e.stopPropagation()} onMouseDown={(e) => e.preventDefault()}
          className="rise-in pointer-events-auto absolute w-[264px] rounded-2xl text-white shadow-[0_20px_48px_-12px_rgb(16_24_40/0.55)] transition-[top,left] duration-300 ease-out"
          style={{ left: pos.left, top: pos.top, background: '#141a2a' }} aria-label="Guided tour">
          {pos.side && <span aria-hidden className="absolute size-3 rotate-45 transition-[top] duration-300" style={{ background: '#141a2a', top: pos.arrow - 6, [pos.side]: -6 }} />}
          <div className="overflow-hidden rounded-2xl">
          <div className="px-4 pb-4 pt-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-white/60">
                <span className="rounded-md bg-primary px-1.5 py-0.5 text-white">Guide</span>
                <span className="tabular-nums">{finished ? 'Done' : `${i + 1} / ${STEPS.length}`}</span>
                <span className="ml-1 h-1 w-14 overflow-hidden rounded-full bg-white/15" aria-hidden><span className="block h-full rounded-full bg-primary transition-[width] duration-500 ease-out" style={{ width: `${(Math.min(i, STEPS.length) / STEPS.length) * 100}%` }} /></span>
              </span>
              <button type="button" aria-label="Hide the guide" onClick={() => setOpen(false)} className="-mr-1.5 grid size-7 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"><ChevronDown className="size-4" /></button>
            </div>
            {finished ? (
              <>
                <p className="mt-2 text-[15px] font-semibold">That’s the full purchase</p>
                <p className="mt-0.5 text-sm text-white/70">Keep exploring, or start over.</p>
                <button type="button" onClick={() => location.reload()} className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-3 text-sm font-semibold text-[#141a2a] hover:bg-white/90"><RotateCcw className="size-3.5" />Start again</button>
              </>
            ) : (
              <>
                <p key={i} className="fade-in mt-2 text-[15px] font-semibold leading-snug">{step.title}</p>
                <p key={`b${i}`} className="fade-in mt-0.5 text-sm text-white/70">{step.body}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  {step.show && <button type="button" disabled={busy} onClick={showMe} className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-3 text-sm font-semibold text-[#141a2a] transition-opacity hover:bg-white/90 disabled:opacity-60">{busy ? 'Working…' : 'Show me'}{!busy && <ArrowRight className="size-3.5" />}</button>}
                  <span className="text-xs text-white/50">or click it yourself</span>
                </div>
              </>
            )}
          </div>
          </div>
        </section>
      ) : (
        <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={() => setOpen(true)} className="pop-in pointer-events-auto absolute bottom-5 left-5 inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-white shadow-lg" style={{ background: '#141a2a' }}>
          <MapIcon className="size-4" />Guide · {finished ? 'done' : `${i + 1}/${STEPS.length}`}
        </button>
      )}
    </div>
  );
}
