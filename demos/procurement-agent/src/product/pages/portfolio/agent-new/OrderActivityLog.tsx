import { Clock3, CircleDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBusinessDateTime } from '@/lib/dateTime';
import { goodsTotal } from '../procurement-agent/portfolioDemoScript';
import type { DemoState } from '../procurement-agent/portfolioDemoTypes';
import type { Experience } from './experienceModel';
import DraftVersionCard, { type DraftVersion } from './DraftVersionList';
import { isAutosave } from './draftHistory';
import { activityTitles } from './orderActivity';

type Entry={id:string;at:string}&({kind:'event';event:Experience['events'][number]}|{kind:'version';version:DraftVersion});
type Group=Entry|{id:string;kind:'autosaves';versions:DraftVersion[]};
export default function OrderActivityLog({experience,order,selectedId,onPreview,busy}:{experience:Experience;order:DemoState;selectedId?:string;onPreview:(version:DraftVersion|null)=>void;busy:boolean}){
 const checkpointEvents=new Set(experience.versions.map(version=>version.eventId).filter(Boolean));
 const entries:Entry[]=[...experience.events.filter(event=>activityTitles[event.kind]&&!checkpointEvents.has(event.id)).map(event=>({id:`event:${event.id}`,at:event.at,kind:'event' as const,event})),...experience.versions.map(version=>({id:`version:${version.id}`,at:version.at,kind:'version' as const,version}))].reverse().sort((a,b)=>Date.parse(b.at)-Date.parse(a.at));
 const groups:Group[]=[];
 for(const entry of entries){
  if(entry.kind==='version'&&isAutosave(entry.version)){
   const previous=groups[groups.length-1];if(previous?.kind==='autosaves')previous.versions.push(entry.version);else groups.push({id:entry.id,kind:'autosaves',versions:[entry.version]});
  }else groups.push(entry);
 }
 const card=(version:DraftVersion)=><DraftVersionCard key={version.id} version={version} order={order} selectedId={selectedId} onPreview={onPreview} busy={busy}/>;
 return <div className="agent-new-activity-history"><div className="agent-new-current-draft"><Button variant="ghost" className="w-full justify-start" aria-pressed={!selectedId} onClick={()=>onPreview(null)}><CircleDot size={15} aria-hidden/>Current draft</Button><p>{order.lines.length} SKUs · {order.lines.reduce((sum,line)=>sum+line.qty,0)} pcs · €{goodsTotal(order.lines).toFixed(2)}</p></div>
  {groups.length?<ol className="agent-new-activity-log" aria-label="Order activity">{groups.map(entry=><li key={entry.id}>{entry.kind==='autosaves'?<details className="agent-new-autosave-group"><summary>{entry.versions.length} autosave{entry.versions.length===1?'':'s'}</summary><div>{entry.versions.map(card)}</div></details>:entry.kind==='version'?card(entry.version):<><Clock3 size={14} aria-hidden/><div><strong>{activityTitles[entry.event.kind]}</strong>{entry.event.detail&&entry.event.kind!=='memory-removed'&&<p className="line-clamp-2">{entry.event.detail}</p>}<time dateTime={entry.at}>{formatBusinessDateTime(entry.at)}</time></div></>}</li>)}</ol>:<p className="text-muted-foreground">No activity yet.</p>}
 </div>;
}
