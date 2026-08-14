import { CheckIcon, RotateCcwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PORTFOLIO_COPY, STAGE_META } from './portfolioDemoCopy';
import { stageStatusOf } from './portfolioDemoScript';
import type { DemoStageId } from './portfolioDemoTypes';

type Props = {
  stage: DemoStageId;
  onSelect: (stage: DemoStageId) => void;
  onReset: () => void;
};

export default function PortfolioStageNav({ stage, onSelect, onReset }: Props) {
  return (
    <nav
      className="flex w-[200px] shrink-0 flex-col border-r border-[#e8eaef] bg-[#f6f7f9] px-3 py-4"
      aria-label="Procurement stages"
    >
      {/* Reset 放在左侧状态栏顶部 */}
      <div className="mb-3 px-0.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 w-full justify-start rounded-xl px-2.5 text-xs text-[#5c6478]"
          onClick={onReset}
        >
          <RotateCcwIcon className="size-3.5" />
          {PORTFOLIO_COPY.reset}
        </Button>
      </div>
      <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b93a7]">
        {PORTFOLIO_COPY.stageLabel}
      </p>
      <ol className="space-y-1.5">
        {STAGE_META.map((item) => {
          const status = stageStatusOf(stage, item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                data-coach={`stage-${item.id}`}
                onClick={() => onSelect(item.id)}
                className={cn(
                  'flex w-full cursor-pointer items-start gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-colors',
                  status === 'current' && 'bg-white shadow-sm ring-1 ring-[#e8eaef]',
                  status !== 'current' && 'hover:bg-white/70',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                    status === 'current' && 'bg-[#2f6bff] text-white',
                    status === 'done' && 'bg-[#e8f1ff] text-[#2f6bff]',
                    status === 'waiting' && 'bg-[#eceef3] text-[#8b93a7]',
                  )}
                >
                  {status === 'done' ? <CheckIcon className="size-3.5" /> : item.number}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      'block text-[13px] font-medium leading-snug',
                      status === 'current' ? 'text-[#1a1d26]' : 'text-[#3d4455]',
                    )}
                  >
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      'mt-0.5 block text-[11px]',
                      status === 'current' && 'text-[#2f6bff]',
                      status === 'done' && 'text-[#5c6478]',
                      status === 'waiting' && 'text-[#8b93a7]',
                    )}
                  >
                    {status}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
