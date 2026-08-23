import { CompassIcon } from 'lucide-react';
import { PORTFOLIO_COPY } from './portfolioDemoCopy';
import { cn } from '@/lib/utils';

/** 模拟浏览器顶栏（红绿灯 + 标题 + 引导开关），不参与业务逻辑 */
export default function PortfolioBrowserChrome({
  guideOpen = false,
  onToggleGuide,
}: {
  guideOpen?: boolean;
  onToggleGuide?: () => void;
}) {
  return (
    <div className="flex h-11 shrink-0 items-center gap-3 border-b border-[#e8eaef] bg-[#f6f7f9] px-4">
      <div className="flex items-center gap-1.5">
        {/* Functional close: this demo runs in an iframe and cannot exit a
            fullscreen the host page owns, so ask the host to do it.
            The literal matches DEMO_CLOSE_MESSAGE in the portfolio's
            src/lib/demoMessages.ts — keep the two in step. */}
        <button
          type="button"
          onClick={() =>
            window.parent?.postMessage({ type: 'portfolio-demo:close' }, window.location.origin)
          }
          aria-label="Close the demo"
          title="Close"
          className="group grid size-[11px] cursor-pointer place-items-center rounded-full bg-[#ff5f57] transition-colors hover:bg-[#e0443e] focus-visible:bg-[#e0443e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b93a7]"
        >
          <svg
            viewBox="0 0 8 8"
            aria-hidden
            className="size-[7px] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <path
              d="M1.6 1.6 6.4 6.4 M6.4 1.6 1.6 6.4"
              stroke="#5c0a06"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <span className="size-[11px] rounded-full bg-[#febc2e]" aria-hidden />
        <span className="size-[11px] rounded-full bg-[#28c840]" aria-hidden />
      </div>
      <p className="min-w-0 truncate font-mono text-[12px] text-[#8b93a7]">
        {PORTFOLIO_COPY.topTitle}
      </p>
      {onToggleGuide ? (
        <button
          type="button"
          onClick={onToggleGuide}
          aria-pressed={guideOpen}
          className={cn(
            'ml-auto inline-flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium transition-colors',
            guideOpen
              ? 'border-[#2f6bff]/30 bg-[#eef4ff] text-[#2f6bff]'
              : 'border-[#e8eaef] bg-white text-[#5c6478] hover:bg-[#f1f2f5]',
          )}
        >
          <CompassIcon className="size-3.5" aria-hidden />
          {guideOpen ? PORTFOLIO_COPY.guideOn : PORTFOLIO_COPY.guide}
        </button>
      ) : null}
    </div>
  );
}
