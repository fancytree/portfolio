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
      <div className="flex items-center gap-1.5" aria-hidden>
        <span className="size-[11px] rounded-full bg-[#ff5f57]" />
        <span className="size-[11px] rounded-full bg-[#febc2e]" />
        <span className="size-[11px] rounded-full bg-[#28c840]" />
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
