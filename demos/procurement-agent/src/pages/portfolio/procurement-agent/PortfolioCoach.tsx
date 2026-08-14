import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 操作引导层：弧线箭头 + 文字说明，指向真实 UI 元素。
 *
 * - 锚点用 [data-coach="id"] 标在真实控件上，不复制一份假 UI
 * - 只显示当前 DOM 里存在的步骤，所以切 stage 时引导自动跟着变
 * - 覆盖层 pointer-events:none，用户随时可以直接操作 demo
 */

export type CoachStep = {
  id: string;
  /** 对应 [data-coach="target"] */
  target: string;
  title: string;
  body: string;
};

type Rect = { top: number; left: number; width: number; height: number };

const CARD_WIDTH = 268;
const GAP = 18;
const PADDING = 12;

function readRect(target: string): Rect | null {
  const el = document.querySelector<HTMLElement>(`[data-coach="${target}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return null;
  // 完全滚出可视区的锚点不引导
  if (r.bottom < 0 || r.top > window.innerHeight) return null;
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

/** 卡片放在锚点左右空间较大的一侧，纵向对齐锚点中线并夹在视口内 */
function placeCard(rect: Rect) {
  const spaceRight = window.innerWidth - (rect.left + rect.width);
  const side: 'left' | 'right' = spaceRight > CARD_WIDTH + GAP * 2 ? 'right' : 'left';
  const rawLeft = side === 'right' ? rect.left + rect.width + GAP : rect.left - CARD_WIDTH - GAP;
  const left = Math.min(Math.max(rawLeft, PADDING), window.innerWidth - CARD_WIDTH - PADDING);
  const top = Math.min(
    Math.max(rect.top + rect.height / 2 - 52, PADDING),
    Math.max(window.innerHeight - 132, PADDING),
  );
  return { left, top, side };
}

/** 从卡片朝锚点画一条二次贝塞尔弧线 */
function arrowPath(from: { x: number; y: number }, to: { x: number; y: number }, side: 'left' | 'right') {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  // 控制点垂直于连线偏移，弧度随距离增长但有上限
  const bow = Math.min(Math.abs(dx) * 0.45 + 26, 74) * (side === 'right' ? -1 : 1);
  const cx = from.x + dx * 0.5;
  const cy = from.y + dy * 0.5 + bow;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}

export default function PortfolioCoach({
  steps,
  open,
  onClose,
}: {
  steps: CoachStep[];
  open: boolean;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const frameRef = useRef(0);

  // 只保留当前界面上真实存在的步骤
  const [availableIds, setAvailableIds] = useState<string[]>([]);
  const visibleSteps = useMemo(
    () => steps.filter((step) => availableIds.includes(step.id)),
    [steps, availableIds],
  );
  const step = visibleSteps[Math.min(index, Math.max(visibleSteps.length - 1, 0))];

  const sync = useCallback(() => {
    const present = steps.filter((item) => readRect(item.target) !== null).map((item) => item.id);
    setAvailableIds((prev) => (prev.join('|') === present.join('|') ? prev : present));
    const current = steps.find((item) => item.id === step?.id);
    setRect(current ? readRect(current.target) : null);
  }, [steps, step?.id]);

  useEffect(() => {
    if (!open) return undefined;
    const tick = () => {
      sync();
      frameRef.current = requestAnimationFrame(tick);
    };
    sync();
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [open, sync]);

  const visibleKey = visibleSteps.map((item) => item.id).join('|');

  useEffect(() => {
    setIndex(0);
  }, [visibleKey]);

  useEffect(() => {
    if (index > visibleSteps.length - 1) setIndex(Math.max(visibleSteps.length - 1, 0));
  }, [index, visibleSteps.length]);

  if (!open || !step || !rect) return null;

  const card = placeCard(rect);
  const single = visibleSteps.length <= 1;
  const anchor = {
    x: card.side === 'right' ? card.left + 14 : card.left + CARD_WIDTH - 14,
    y: card.top + (single ? 56 : 104),
  };
  const tip = {
    x: card.side === 'right' ? rect.left + rect.width + 6 : rect.left - 6,
    y: rect.top + rect.height / 2,
  };
  const isLast = index >= visibleSteps.length - 1;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      <svg className="absolute inset-0 size-full overflow-visible" aria-hidden>
        <defs>
          <marker id="coach-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M 0 0 L 9 4.5 L 0 9 z" fill="#2f6bff" />
          </marker>
        </defs>
        {/* 锚点高亮框 */}
        <rect
          x={rect.left - 5}
          y={rect.top - 5}
          width={rect.width + 10}
          height={rect.height + 10}
          rx="12"
          fill="none"
          stroke="#2f6bff"
          strokeWidth="2"
          strokeDasharray="5 4"
        />
        {/* 弧线箭头 */}
        <path
          d={arrowPath(anchor, tip, card.side)}
          fill="none"
          stroke="#2f6bff"
          strokeWidth="2"
          strokeLinecap="round"
          markerEnd="url(#coach-arrow)"
        />
      </svg>

      <div
        className="pointer-events-auto absolute rounded-2xl border border-[#d9e2fb] bg-white p-4 shadow-[0_14px_38px_rgba(26,29,38,0.16)]"
        style={{ left: card.left, top: card.top, width: CARD_WIDTH }}
        role="dialog"
        aria-label="Demo guide"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[14px] font-semibold text-[#1a1d26]">{step.title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close guide"
            className="cursor-pointer rounded-md p-0.5 text-[#8b93a7] transition-colors hover:bg-[#f6f7f9] hover:text-[#1a1d26]"
          >
            <XIcon className="size-3.5" />
          </button>
        </div>
        <p className="mt-1 text-[12px] leading-relaxed text-[#5c6478]">{step.body}</p>

        {single ? null : (
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-[12px] text-[#8b93a7] transition-colors hover:text-[#1a1d26]"
            >
              Skip
            </button>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                className={cn(
                  'h-7 cursor-pointer rounded-lg border border-[#e8eaef] px-2.5 text-[12px] text-[#5c6478] transition-colors hover:bg-[#f6f7f9]',
                  index === 0 && 'cursor-not-allowed opacity-40 hover:bg-transparent',
                )}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => (isLast ? onClose() : setIndex((i) => i + 1))}
                className="h-7 cursor-pointer rounded-lg bg-[#2f6bff] px-2.5 text-[12px] font-medium text-white transition-colors hover:bg-[#2458d9]"
              >
                {isLast ? 'Done' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
