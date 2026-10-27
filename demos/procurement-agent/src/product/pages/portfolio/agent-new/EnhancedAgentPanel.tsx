import { useState, type ComponentProps } from 'react';
import { History, FileText, BookOpen, Pause, Settings2, X } from 'lucide-react';
import PortfolioAgentPanel from '../procurement-agent/PortfolioAgentPanel';
import type { DemoState, DemoLine } from '../procurement-agent/portfolioDemoTypes';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { usePortfolioOrder } from '../_shared/PortfolioOrderContext';
import type { DraftVersion } from './DraftVersionList';
import type { Experience } from './experienceModel';
import { useExperience } from './useExperience';
import StructuredAgentMessage from './StructuredAgentMessage';
import ExperienceContent, { type Panel } from './ExperienceContent';

type Props=ComponentProps<typeof PortfolioAgentPanel>&{
 onPreviewVersion:(version:DraftVersion|null)=>void;previewVersionId?:string;previewMode?:boolean;appliedVersion?:{id:string;nonce:number};
 initialExperience?:Experience;onExperienceChange?:(value:Experience)=>void;
 orderState:DemoState;paused:boolean;onPauseTask:()=>void;onResumeTask:()=>void;
 onRestoreDraft:(lines:DemoLine[],context:string)=>void;onDeliverFindings:(text:string)=>void;
};
const titles:Record<Panel,string>={task:'Tasks',evidence:'Evidence for this order',memory:'Order notes',supplier:'Supply rules',feedback:'Review feedback',alerts:'Updates for this order',activity:'Activity log',access:'Data access',settings:'Order settings'};
export default function EnhancedAgentPanel({orderState:order,initialExperience:seed,onExperienceChange,paused,onPauseTask,onResumeTask,onRestoreDraft,onDeliverFindings,onPreviewVersion,previewVersionId,previewMode=false,appliedVersion,...chat}:Props){
 const identity=usePortfolioOrder();
 const [drawer,setDrawer]=useState<Panel|null>(null);
 const {experience,dispatch,storageError,flushHistory}=useExperience(order,seed,onExperienceChange,appliedVersion);

 const open=(panel:Panel)=>{if(panel==='activity')flushHistory();setDrawer(panel);};
 return <section className="agent-new-panel" aria-label="Agent collaboration">
  <AgentTools disabled={!order.planGenerated} onOpen={open}/>
  {paused&&<div className="agent-new-paused" role="status"><Pause size={13} aria-hidden/><span>Task paused · progress retained</span></div>}
  <div className="agent-new-chat">{drawer==='activity'?<div className="agent-new-version-panel"><header><div><h3>Activity log</h3><p className="text-xs font-normal text-muted-foreground">{identity.number} · Changes and draft versions</p></div><Button variant="ghost" size="icon-sm" aria-label="Close activity log" onClick={()=>{onPreviewVersion(null);setDrawer(null);}}><X size={15} aria-hidden/></Button></header><div className="agent-new-version-scroll"><ExperienceContent panel="activity" order={order} experience={experience} dispatch={dispatch} busy={!!chat.busy} paused={paused} onPause={onPauseTask} onResume={onResumeTask} onRestore={onRestoreDraft} onDeliver={onDeliverFindings} onAsk={chat.onSuggestion} onOpen={open} onClose={()=>setDrawer(null)} onPreviewVersion={onPreviewVersion} previewVersionId={previewVersionId}/></div></div>:<PortfolioAgentPanel {...chat} composerControl={!previewMode&&(chat.busy||paused)?{state:paused?'resume':'pause',onClick:()=>{dispatch({type:'event',kind:paused?'agent-resumed':'agent-paused',detail:''});if(paused)onResumeTask();else onPauseTask();}}:undefined} busy={!!chat.busy||previewMode} renderAgentContent={message=><StructuredAgentMessage message={message}/>}/>}</div>
  <Sheet open={drawer!==null&&drawer!=='activity'} onOpenChange={value=>{if(!value)setDrawer(null);}}><SheetContent className="agent-new-sheet sm:max-w-xl"><SheetHeader><SheetTitle>{drawer?titles[drawer]:''}</SheetTitle><SheetDescription className={drawer==='task'?'sr-only':undefined}>{drawer==='task'?'Agent tasks':drawer==='supplier'?'MNP · Supplier information':`${identity.number} · MNP · ${order.intakeDraft?.coverageDays??30}-day coverage`}</SheetDescription></SheetHeader>

   <div className="agent-new-sheet-body">{drawer&&<ExperienceContent panel={drawer} order={order} experience={experience} dispatch={dispatch} busy={!!chat.busy||previewMode} paused={paused} onPause={onPauseTask} onResume={onResumeTask} onRestore={onRestoreDraft} onDeliver={onDeliverFindings} onAsk={prompt=>{chat.onSuggestion(prompt);setDrawer(null);}} onOpen={open} onClose={()=>setDrawer(null)} onPreviewVersion={onPreviewVersion} previewVersionId={previewVersionId}/>}
   {storageError&&<p role="alert" className="text-xs text-destructive">Changes could not be saved. Keep this workspace open and check browser storage before leaving.</p>}</div>
  </SheetContent></Sheet>
  {experience.preferences.notifications==='off'&&<span className="sr-only">Task notifications are muted</span>}
  {experience.jobs.some(j=>j.status==='running')&&<span className="sr-only" role="status">Review running</span>}
 </section>;
}

export function AgentTools({disabled=false,onOpen}:{disabled?:boolean;onOpen:(panel:Panel)=>void}){return <div className="agent-new-tools" role="toolbar" aria-label="Agent tools">
   <Button variant="ghost" size="sm" disabled={disabled} onClick={()=>onOpen('evidence')}><FileText size={13} aria-hidden/>Evidence</Button>
   <Button variant="ghost" size="sm" disabled={disabled} onClick={()=>onOpen('supplier')}><BookOpen size={13} aria-hidden/>Supply rules</Button>
   <Button variant="ghost" size="sm" disabled={disabled} onClick={()=>onOpen('activity')}><History size={13} aria-hidden/>Activity log</Button>
   <Button variant="ghost" size="icon-sm" disabled={disabled} aria-label="Order settings" onClick={()=>onOpen('settings')}><Settings2 size={14} aria-hidden/></Button>
  </div>;}
