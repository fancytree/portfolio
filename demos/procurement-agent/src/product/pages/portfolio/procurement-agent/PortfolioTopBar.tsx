import { PORTFOLIO_COPY } from './portfolioDemoCopy';

/** 模拟浏览器顶栏（红绿灯 + 标题 + Demo 徽章），不参与业务逻辑 */
export default function PortfolioBrowserChrome({
  pageTitle,
}: {
  pageTitle?: string;
}) {
  return (
    <div className="flex h-11 shrink-0 items-center gap-3 border-b border-[#e8eaef] bg-[#f6f7f9] px-4">
      <div className="flex items-center gap-1.5" aria-hidden>
        <span className="size-[11px] rounded-full bg-[#ff5f57]" />
        <span className="size-[11px] rounded-full bg-[#febc2e]" />
        <span className="size-[11px] rounded-full bg-[#28c840]" />
      </div>
      <p className="min-w-0 truncate font-mono text-[12px] text-[#8b93a7]">
        {pageTitle ?? PORTFOLIO_COPY.topTitle}
      </p>
      <span className="ml-auto hidden shrink-0 rounded-full border border-[#e8eaef] bg-white px-2.5 py-1 text-[11px] text-[#5c6478] sm:inline-flex">
        {PORTFOLIO_COPY.demoBadge}
      </span>
    </div>
  );
}
