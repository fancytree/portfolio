import {Button} from '@/components/ui/button';
import type {DemoState} from '../procurement-agent/portfolioDemoTypes';
import {documentContext} from './experienceModel';
import type {DraftVersion} from './DraftVersionList';
export default function DraftPreviewBanner({version,order,canApply,onBack,onApply}:{version:DraftVersion;order:DemoState;canApply:boolean;onBack:()=>void;onApply:()=>void}){
 return <div className="agent-new-version-preview" role="status"><div><strong>{version.label}</strong><p>{order.orderRecorded?'This order has been placed. History is read-only.':version.context!==documentContext(order)?'Different confirmation · preview only.':'Preview only. Apply to replace the current draft.'}</p></div><Button variant="outline" onClick={onBack}>Back to current</Button><Button disabled={!canApply} onClick={onApply}>Apply version</Button></div>;
}
