import { CheckIcon, CircleDashedIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DocumentProgressStepState =
  | 'done'
  | 'current'
  | 'partial'
  | 'pending'
  | 'blocked';

export type DocumentProgressStep = {
  label: string;
  state: DocumentProgressStepState;
};

type Props = {
  steps: DocumentProgressStep[];
  ariaLabel: string;
  className?: string;
};

/** 蓝色虚线外圈 + 半圆填充，表示当前步骤只完成了一部分。 */
function PartialCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <circle
        cx="8"
        cy="8"
        r="5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeDasharray="2.2 1.8"
      />
      <path d="M8 2.5a5.5 5.5 0 0 1 0 11Z" fill="currentColor" />
    </svg>
  );
}

function StepIcon({ state }: { state: DocumentProgressStepState }) {
  if (state === 'done') {
    return <CheckIcon className="size-3.5 shrink-0" strokeWidth={2.5} />;
  }
  if (state === 'partial') {
    return <PartialCircleIcon className="size-3.5 shrink-0" />;
  }
  return <CircleDashedIcon className="size-3.5 shrink-0" strokeWidth={1.75} />;
}

export default function DocumentProgressSteps({ steps, ariaLabel, className }: Props) {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-2 text-xs', className)}
      aria-label={ariaLabel}
    >
      {steps.map((step, index) => (
        <div key={`${step.label}-${index}`} className="flex items-center gap-2">
          <span
            data-state={step.state}
            aria-current={step.state === 'current' ? 'step' : undefined}
            className={cn(
              'inline-flex items-center gap-1.5 font-medium',
              (step.state === 'done' || step.state === 'current' || step.state === 'partial') && 'text-primary',
              step.state === 'pending' && 'text-muted-foreground',
              step.state === 'blocked' && 'text-destructive',
            )}
          >
            <StepIcon state={step.state} />
            {step.label}
          </span>
          {index < steps.length - 1 ? (
            <span className="text-border" aria-hidden>›</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
