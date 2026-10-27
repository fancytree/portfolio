import { ClipboardList, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

export default function EmptyPlanCanvas({ onStart }: { onStart: () => void }) {
  return (
    <Empty className="border border-solid border-border/50 bg-card" aria-label="No purchase plan yet">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-14 rounded-xl [&_svg:not([class*='size-'])]:size-6"><ClipboardList aria-hidden /></EmptyMedia>
        <EmptyTitle className="text-lg">Start a purchase plan</EmptyTitle>
        <EmptyDescription>Your plan will appear here after you send a request to the procurement agent.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={onStart}>Write a request<ArrowRight className="size-4" aria-hidden /></Button>
      </EmptyContent>
    </Empty>
  );
}
