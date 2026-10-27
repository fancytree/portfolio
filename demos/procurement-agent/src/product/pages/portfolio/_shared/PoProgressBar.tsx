import DocumentProgressSteps, {
  type DocumentProgressStep,
} from '@/components/shared/DocumentProgressSteps';
import { PORTFOLIO_COPY } from '../procurement-agent/portfolioDemoCopy';
import type { PoProgressKey } from '../procurement-agent/portfolioDemoScript';

/**
 * 对齐 Demo / PoDetail：Edit → Ordered → Received
 * 图标：check / 虚线圆 / 部分圆
 */
export function PoProgressBar({ current, highlightDraft=false }: { current: PoProgressKey; highlightDraft?:boolean }) {
  const steps: Array<{ key: 'draft' | 'ordered' | 'received'; label: string }> = [
    { key: 'draft', label: PORTFOLIO_COPY.poProgressEdit },
    { key: 'ordered', label: PORTFOLIO_COPY.poProgressOrdered },
    { key: 'received', label: PORTFOLIO_COPY.poProgressReceived },
  ];

  // draft：全虚线；ordered：Edit+Ordered 勾选；partial：Received 半圆；received：全勾选
  const doneThrough =
    current === 'draft' ? -1
      : current === 'received' ? 2
        : 1; // ordered | partial

  const progressSteps: DocumentProgressStep[] = steps.map((step, index) => {
    const state: DocumentProgressStep['state'] =
          highlightDraft && current === 'draft' && index === 0
            ? 'current'
            : step.key === 'received' && current === 'partial'
            ? 'partial'
            : index <= doneThrough
              ? 'done'
              : 'pending';
    return { label: step.label, state };
  });

  return <DocumentProgressSteps steps={progressSteps} ariaLabel="Purchase order progress" />;
}

export type { PoProgressKey };
