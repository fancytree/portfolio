import { Clock3 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatBusinessDate } from '@/lib/dateTime';
import { purchaseUrgency, type PurchaseRecord } from './workspaceStore';

export default function PurchaseTimingNotice({record}:{record:PurchaseRecord}){
 const urgency=purchaseUrgency(record);
 if(!urgency)return null;
 return <TooltipProvider><Tooltip><TooltipTrigger asChild>
  <span role="status" aria-label="Purchase timing" tabIndex={0} className="workspace-purchase-timing" data-level={urgency.level}>
   <Clock3 size={13} aria-hidden/><strong>{urgency.label}</strong><span>{urgency.stockDays}d stock · {urgency.leadDays}d lead</span>
  </span>
 </TooltipTrigger><TooltipContent>
  Stock covers {urgency.stockDays} days; supplier lead time is {urgency.leadDays} days.
  {urgency.level==='urgent'?' Place the order now to limit the stock gap.':` Order by ${formatBusinessDate(urgency.orderBy)}.`}
 </TooltipContent></Tooltip></TooltipProvider>;
}
