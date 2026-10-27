import { Badge } from '@/components/ui/badge';
import { formatBusinessDateTime } from '@/lib/dateTime';
import { goodsTotal } from '../procurement-agent/portfolioDemoScript';
import type { DemoState } from '../procurement-agent/portfolioDemoTypes';
import { documentContext, type Experience } from './experienceModel';
import { historyLabel, isAutosave } from './draftHistory';
export type DraftVersion=Experience['versions'][number];

export default function DraftVersionCard({version,order,selectedId,onPreview,busy}:{version:DraftVersion;order:DemoState;selectedId?:string;onPreview:(version:DraftVersion|null)=>void;busy:boolean}){
 const changed=version.lines.filter(line=>{const active=order.lines.find(item=>item.sku===line.sku);return !active||active.qty!==line.qty||active.plannedQty!==line.plannedQty||active.estimatedPrice!==line.estimatedPrice||active.confirmedPrice!==line.confirmedPrice;}).length+order.lines.filter(line=>!version.lines.some(item=>item.sku===line.sku)).length;
 const label=historyLabel(version);
 return <div className="agent-new-checkpoint"><button type="button" className="agent-new-version-card" disabled={busy} onClick={()=>onPreview(version)} aria-label={`Preview ${label}`} aria-pressed={selectedId===version.id}>
  <span className="flex items-center justify-between gap-2"><strong>{label}</strong>{!isAutosave(version)&&<Badge variant="secondary">Milestone</Badge>}</span>
  <time dateTime={version.at}>{formatBusinessDateTime(version.at)} · {version.actor??'Buyer'}</time><span>{version.lines.length} SKUs · {version.lines.reduce((sum,line)=>sum+line.qty,0)} pcs · €{goodsTotal(version.lines).toFixed(2)}</span>
  <span>{changed?`${changed} changed SKU${changed===1?'':'s'}`:'Same quantities and prices as current draft'}</span>{version.context!==documentContext(order)&&<span className="text-status-warning">Different confirmation · preview only</span>}
 </button></div>;
}
