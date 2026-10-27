import { LoaderCircle, Pause } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { DemoState } from '../procurement-agent/portfolioDemoTypes';

const phaseLabels = {
  understand: 'Reading your purchase request…',
  validate: 'Checking sales, stock and supplier rules…',
  calculate: 'Calculating suggested quantities…',
  explain: 'Preparing your purchase plan…',
};

export default function PlanLoadingCanvas({ state, paused }: { state: DemoState; paused: boolean }) {
  const phase = state.progress.current ?? 'understand';
  const supplier = state.intakeDraft?.supplier;
  const coverage = state.intakeDraft?.coverageDays;
  return (
    <section className="agent-new-plan-loading" role="status" aria-label="Generating purchase plan" aria-live="polite">
      <header className="rounded-xl border border-border bg-card px-6 py-5">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          {paused ? <Pause className="size-4" aria-hidden /> : <LoaderCircle className="size-4 animate-spin text-primary motion-reduce:animate-none" aria-hidden />}
          <span>{paused ? 'Plan generation paused' : phaseLabels[phase]}</span>
        </div>
        {supplier ? <p className="mt-2 text-xs text-muted-foreground">{supplier}{coverage ? ` · ${coverage}-day coverage` : ''}</p> : null}
      </header>
      <div className="flex flex-1 flex-col rounded-xl border border-border bg-card px-6 py-5" aria-hidden="true">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Skeleton className="h-5 w-36 motion-reduce:animate-none" />
          <Skeleton className="h-8 w-28 motion-reduce:animate-none" />
        </div>
        <div className="flex-1 overflow-hidden rounded-xl border border-border/50">
          <div className="grid grid-cols-4 gap-6 border-b border-border/50 bg-background px-4 py-3">
            {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-3 w-4/5 motion-reduce:animate-none" />)}
          </div>
          {Array.from({ length: 5 }, (_, row) => (
            <div key={row} className="grid grid-cols-4 gap-6 border-b border-border/50 px-4 py-5 last:border-b-0">
              {Array.from({ length: 4 }, (_, column) => <Skeleton key={column} className="h-4 w-3/4 motion-reduce:animate-none" />)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
