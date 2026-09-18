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
const GAP = 56; // 卡片和目标之间留出足够距离，连线才看得出来（箭头尖还要离高亮框 12px）
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

/**
 * 从卡片朝锚点画一条单一弧度的弧线（二次贝塞尔，全程只朝一个方向弯，没有 S 形拐折）：
 * 从卡片出发时上扬约 45°，最后以约 40° 斜向下落到目标上 —— 一道明显的拱形，
 * 箭头也不会和竖向的高亮虚线框平行而“隐身”。
 * 控制点取“出发方向线”和“到达方向线”的交点，所以两端的切线正好是这两个方向。
 */
const LEAVE_ANGLE = (45 * Math.PI) / 180;
const ARRIVE_ANGLE = (40 * Math.PI) / 180;
// 弦（起点到箭头尖的连线）的理想倾角：落在出发、到达两个角度正中，拱形才对称
const CHORD_ANGLE = (ARRIVE_ANGLE - LEAVE_ANGLE) / 2;

function arrowPath(from: { x: number; y: number }, to: { x: number; y: number }, side: 'left' | 'right') {
  const dir = side === 'right' ? -1 : 1; // 卡片在目标右侧时，线往左走
  // 出发方向 u（朝目标、向上），到达方向 v（朝目标、向下）；解 from + s·u = to − t·v
  const ux = dir * Math.cos(LEAVE_ANGLE);
  const uy = -Math.sin(LEAVE_ANGLE);
  const vx = dir * Math.cos(ARRIVE_ANGLE);
  const vy = Math.sin(ARRIVE_ANGLE);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const det = ux * vy - uy * vx;
  const sPar = (dx * vy - dy * vx) / det;
  const tPar = (ux * dy - uy * dx) / det;
  if (sPar > 0 && tPar > 0) {
    return `M ${from.x} ${from.y} Q ${from.x + ux * sPar} ${from.y + uy * sPar} ${to.x} ${to.y}`;
  }
  // 几何上凑不出这两个方向时（目标远高于卡片等），退回一道向上拱的圆弧
  const midX = (from.x + to.x) / 2;
  const midY = Math.min(from.y, to.y) - Math.max(14, Math.abs(dx) * 0.35);
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
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
  // 箭头尖停在高亮虚线框（外扩 5px）外再留 7px，不和虚线叠在一起
  const tip = {
    x: card.side === 'right' ? rect.left + rect.width + 12 : rect.left - 12,
    y: rect.top + rect.height / 2,
  };
  // 起点高度按目标反推，让弦的倾角落在理想值上（拱形对称），同时不超出卡片的上下范围
  const anchorX = card.side === 'right' ? card.left + 2 : card.left + CARD_WIDTH - 2;
  const anchor = {
    x: anchorX,
    y: Math.min(Math.max(tip.y - Math.tan(CHORD_ANGLE) * Math.abs(tip.x - anchorX), card.top + 18), card.top + 84),
  };
  const isLast = index >= visibleSteps.length - 1;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      <svg className="absolute inset-0 size-full overflow-visible" aria-hidden>
        <defs>
          {/* 箭头按像素定尺寸（userSpaceOnUse），不随线宽放大 —— 默认会 ×strokeWidth，2px 线上就成了 18px 的箭头 */}
          <marker id="coach-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto" markerUnits="userSpaceOnUse">
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
        {/* 虚线弧线箭头 */}
        <path
          d={arrowPath(anchor, tip, card.side)}
          fill="none"
          stroke="#2f6bff"
          strokeWidth="2"
          strokeDasharray="5 4"
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
