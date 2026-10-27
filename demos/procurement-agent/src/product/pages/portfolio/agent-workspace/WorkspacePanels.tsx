import SupplierOpportunities from './SupplierOpportunities';
import { orderSignature } from '../agent-new/experienceModel';
import { useState } from 'react';
import { ArrowRight, ClipboardList, Pause, Play, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Empty, EmptyHeader, EmptyTitle, EmptyMedia } from '@/components/ui/empty';
import { formatBusinessDateTime } from '@/lib/dateTime';
import { conversationTasks } from '../agent-new/TaskList';
import { controlSampleTask, controlReview, deleteNotification, markNotificationRead, workspaceNotifications, proactiveSignals, rateReview, runReplenishmentCheck, updateReplenishmentSchedule, updateWorkspaceSettings, type WorkspaceState } from './workspaceStore';

export type WorkspacePanelActions=Pick<typeof import('./workspaceStore'),'controlSampleTask'|'controlReview'|'deleteNotification'|'markNotificationRead'|'rateReview'|'runReplenishmentCheck'|'updateReplenishmentSchedule'|'updateWorkspaceSettings'>;
export type WorkspacePanel='tasks'|'signals'|'controls'|'agent'|'findings'|'suppliers';
type ChatMessage={id:number;role:'user'|'agent';text:string;proposal?:number};
const steps=['Read selected order','Check quantities and evidence','Identify discrepancies','Prepare findings'];
export function parseListRequest(text:string,previous:{supplier?:boolean;coverage?:number}={}){
 const supplier=/\bmnp\b|mesauda/i.test(text)||previous.supplier;
 const day=text.match(/(\d{1,3})\s*(?:days?\b|d\b|天)/i);
 const month=text.match(/(\d{1,2})\s*(?:months?\b|个月)/i);
 const coverage=day?Number(day[1]):month?Number(month[1])*30:previous.coverage;
 return {supplier,coverage};
}
export default function WorkspacePanels({panel,onPanel,workspace,onOpen,onCreate,onPrepare,onFilter,onLocate,taskId,onTask,inline=false,compact=false,actions:actionOverrides}: {
 compact?:boolean;inline?:boolean;actions?:Partial<WorkspacePanelActions>;panel:WorkspacePanel|null;onPanel:(value:WorkspacePanel|null)=>void;workspace:WorkspaceState;onOpen:(id:string)=>void;onCreate:(coverage:number)=>void;onPrepare:(opportunityId?:string)=>void;onFilter:()=>void;onLocate:(orderId:string)=>void;taskId:string;onTask:(id:string)=>void;
}){
 const actions={controlSampleTask,controlReview,deleteNotification,markNotificationRead,rateReview,runReplenishmentCheck,updateReplenishmentSchedule,updateWorkspaceSettings,...actionOverrides};
 const Title=inline?'h3':SheetTitle;const Description=inline?'p':SheetDescription;
 const [text,setText]=useState('');
 const [conversation,setConversation]=useState<ChatMessage[]>([{id:0,role:'agent',text:'I can help you plan purchases, review orders and follow up on deliveries. What would you like to work on?'}]);
 const [pending,setPending]=useState<{supplier?:boolean;coverage?:number}>({});
 const task=workspace.tasks.find(item=>item.id===taskId);
 const matchingRevision=!!task&&workspace.orders.some(order=>order.id===task.orderId&&orderSignature(order.state)===task.signature);
 const titles={tasks:'Tasks',signals:'Notifications',controls:'Agent controls',agent:'Procurement agent',findings:'Review findings',suppliers:'Suppliers to replenish'};
 const signals=proactiveSignals(workspace);
 const notifications=workspaceNotifications(workspace);
 const send=()=>{
  if(!text.trim())return;
  const request=text.trim();setText('');
  const base=[...conversation,{id:Date.now(),role:'user' as const,text:request}];
  if(/need.*review|await.*confirm|待.*核对/i.test(request)){onFilter();onPanel(null);return;}
  if(/stock|库存/i.test(request)){
   const stock=signals.find(item=>item.kind==='stock');
   setConversation([...base,{id:Date.now()+1,role:'agent',text:stock?`${stock.detail} Source: ${stock.source}.`:'No stock-coverage alert is available from the current snapshot.'}]);return;
  }
  const next=parseListRequest(request,pending);setPending(next);
  const answer=!next.supplier?'Which supplier should the plan cover? MNP is available in this workspace.':!next.coverage?'How many days of sales should the plan cover?':next.coverage<1||next.coverage>180?'Choose a sales coverage period from 1 to 180 days.':undefined;
  setConversation([...base,{id:Date.now()+1,role:'agent',text:answer??'Your purchase plan is ready to start.',...(!answer?{proposal:next.coverage}:{})}]);
 };
 const content=<><SheetHeader className="border-b border-border px-5 py-4"><Title className={inline?'text-sm font-medium':undefined}>{panel?titles[panel]:''}</Title><Description className={inline?'text-xs text-muted-foreground':undefined}>{panel==='agent'?'Across your purchase orders':panel==='controls'?'Preferences for all purchase orders':panel==='findings'?task?.orderId:panel==='tasks'?'Agent work across your purchase orders':panel==='signals'?'Changes that need your attention':'Purchase workspace'}</Description></SheetHeader>
   {panel==='agent'?<div className="workspace-agent"><div className="workspace-agent-messages" role="log" aria-label="Workspace conversation">{conversation.map(message=><div className={`workspace-agent-message ${message.role==='user'?'workspace-agent-user':''}`} key={message.id}><p>{message.text}</p>{message.proposal&&<><dl className="workspace-values"><dt>Supplier</dt><dd>MNP · MESAUDA NAIL PRO</dd><dt>Sales coverage</dt><dd>{message.proposal} days</dd><dt>Output</dt><dd>Editable purchase plan</dd></dl><Button onClick={()=>onCreate(message.proposal!)}>Create purchase plan<ArrowRight size={14} aria-hidden/></Button></>}</div>)}</div><form className="workspace-agent-composer" onSubmit={event=>{event.preventDefault();send();}}><Label className="sr-only" htmlFor="workspace-agent-request">Purchase request</Label><Textarea id="workspace-agent-request" value={text} onChange={event=>setText(event.target.value)} placeholder="Ask about purchases, orders or deliveries" onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();send();}}}/><Button type="submit" disabled={!text.trim()}><Send size={14} aria-hidden/>Send</Button></form></div>:<div className="workspace-panel-body">
    {panel==='suppliers'&&<SupplierOpportunities workspace={workspace} onPrepare={onPrepare}/>}
    {panel==='signals'&&(notifications.length?notifications.map(signal=>{
     const order=workspace.orders.find(order=>order.id===signal.orderId);
     const listOnly=!!order?.previewOnly;
     return <section className="workspace-panel-card workspace-notification-card" data-read={signal.read} key={signal.id} aria-label={`${order?.supplier??'Procurement'} · ${signal.title}`}>
      <div className="workspace-between"><strong className="text-primary">{order?.supplier??'Procurement'}</strong><div className="flex items-center gap-2">{signal.orderId&&<span className="workspace-caption font-mono">{signal.orderId}</span>}<Button size="icon-sm" variant="ghost" className="text-muted-foreground" aria-label="Delete notification" title="Delete notification" onClick={()=>actions.deleteNotification(signal.id)}><Trash2 size={13} aria-hidden/></Button></div></div>
      <div className="workspace-between"><h3 className={signal.read?'font-medium text-muted-foreground':'font-semibold'}>{signal.title}</h3><span className="workspace-caption workspace-notification-status">{signal.read?'Read':'Unread'}</span></div><p>{signal.orderId?signal.detail.replace(`${signal.orderId} · `,''):signal.detail}</p><p className="workspace-caption">Source: {signal.source}</p>
      <div className="workspace-actions mt-2"><Button size="sm" onClick={()=>{actions.markNotificationRead(signal.id);if(signal.taskId){onTask(signal.taskId);onPanel(signal.kind==='failure'?'tasks':'findings');}else if(listOnly&&signal.orderId)onLocate(signal.orderId);else if(signal.orderId)onOpen(signal.orderId);else onPrepare();}}>{listOnly?'View in list':signal.action}<ArrowRight size={12} aria-hidden/></Button>{!signal.read&&<Button size="sm" variant="ghost" className="ml-auto text-muted-foreground" onClick={()=>actions.markNotificationRead(signal.id)}>Mark as read</Button>}</div>
     </section>;
    }):<p>No notifications.</p>)}
    {panel==='tasks'&&<>
     {!workspace.sampleTasks.length&&!workspace.tasks.length&&!workspace.orders.some(order=>conversationTasks(order.state,!!order.paused).length)&&<Empty><EmptyHeader><EmptyMedia variant="icon"><ClipboardList aria-hidden/></EmptyMedia><EmptyTitle>No tasks yet</EmptyTitle></EmptyHeader></Empty>}
     <ul className="workspace-task-list">{workspace.sampleTasks.map(item=><li key={item.id}><div className="workspace-between"><strong>{item.title}</strong><Badge variant={item.status==='complete'?'success':'outline'}>{item.status==='complete'?'Completed':item.status==='running'?'In progress':'Paused'}</Badge></div><p>{item.supplier} · {item.orderId}</p>{item.status!=='complete'&&<p>{item.detail}</p>}<div className="workspace-actions">{item.status==='running'&&<><Button size="sm" variant="outline" onClick={()=>actions.controlSampleTask(item.id,'pause')}><Pause size={12} aria-hidden/>Pause</Button></>}{item.status==='paused'&&<Button size="sm" variant="outline" onClick={()=>actions.controlSampleTask(item.id,'resume')}><Play size={12} aria-hidden/>Resume</Button>}</div>{item.status==='complete'&&<details className="mt-2"><summary className="workspace-order-link">View summary</summary><ul className="workspace-findings">{item.output.map(line=><li key={line}>{line}</li>)}</ul></details>}</li>)}{workspace.tasks.map(item=><li key={item.id}><div className="workspace-between"><strong>{item.goal}</strong><Badge variant={item.status==='complete'?'success':item.status==='failed'?'destructive':'outline'}>{item.status==='complete'?'Completed':item.status}</Badge></div><button className="workspace-order-link" type="button" onClick={()=>onOpen(item.orderId)}>{item.orderId}</button>{item.status==='running'&&<p>{steps[Math.min(item.step,3)]}</p>}{item.error&&<p role="alert" className="text-destructive">{item.error}</p>}<div className="workspace-actions">{item.status==='running'&&<Button size="sm" variant="outline" onClick={()=>actions.controlReview(item.id,'pause')}><Pause size={12} aria-hidden/>Pause</Button>}{item.status==='paused'&&<Button size="sm" variant="outline" onClick={()=>actions.controlReview(item.id,'resume')}><Play size={12} aria-hidden/>Resume</Button>}{item.status==='failed'&&<><Button size="sm" variant="outline" onClick={()=>actions.controlReview(item.id,'retry')}>Retry with current data</Button><Button size="sm" variant="ghost" onClick={()=>onOpen(item.orderId)}>Review order manually</Button></>}{item.status==='queued'&&<Button size="sm" variant="outline" onClick={()=>actions.controlReview(item.id,'quick')}>Use order data only</Button>}{item.status==='complete'&&<Button size="sm" variant="outline" onClick={()=>{onTask(item.id);onPanel('findings');}}>View findings</Button>}</div></li>)}{workspace.orders.flatMap(order=>conversationTasks(order.state,!!order.paused).map(item=><li key={`${order.id}-${item.id}`}><div className="workspace-between"><strong>{item.title}</strong><Badge variant={item.status==='Completed'?'success':'info'}>{item.status}</Badge></div><button className="workspace-order-link" type="button" onClick={()=>onOpen(order.id)}>{order.id}</button></li>))}</ul>
    </>}
    {panel==='findings'&&task&&<><Badge variant={task.status==='complete'?'success':'outline'}>{task.status}</Badge><h3>{task.goal}</h3><p className="workspace-caption">{task.orderId} · {formatBusinessDateTime(task.createdAt)}</p><ul className="workspace-findings">{task.output.map(finding=><li key={finding}>{finding}</li>)}</ul><p className="workspace-caption">Source: {matchingRevision?'current order revision':'captured revision · the order has changed'}{task.includeDocs?' and its linked document references':''}. No order quantities or approvals changed.</p><div className="workspace-actions"><Button variant="outline" onClick={()=>onOpen(task.orderId)}>Open purchase order</Button><Button variant={task.feedback==='useful'?'secondary':'ghost'} onClick={()=>actions.rateReview(task.id,'useful')}>Useful</Button><Button variant={task.feedback==='needs-work'?'secondary':'ghost'} onClick={()=>actions.rateReview(task.id,'needs-work')}>Needs review</Button></div></>}
    {panel==='controls'&&<>
     <section><div className="workspace-between"><h3>Replenishment checks</h3><Switch aria-label="Scheduled replenishment checks" checked={workspace.schedule.enabled} onCheckedChange={enabled=>actions.updateReplenishmentSchedule({enabled})}/></div><p className="workspace-caption mt-2">Check sales, stock and supplier rules for purchasing opportunities.</p>
     <div className="workspace-form mt-4"><div><Label htmlFor="replenishment-frequency">Repeat</Label><Select id="replenishment-frequency" ariaLabel="Repeat" value={workspace.schedule.frequency} disabled={!workspace.schedule.enabled} options={[{value:'daily',label:'Every day'},{value:'weekdays',label:'Weekdays'},{value:'weekly',label:'Weekly'}]} onValueChange={frequency=>actions.updateReplenishmentSchedule({frequency:frequency as typeof workspace.schedule.frequency})}/></div>
     {workspace.schedule.frequency==='weekly'&&<div><Label htmlFor="replenishment-weekday">Day</Label><Select id="replenishment-weekday" ariaLabel="Day" value={String(workspace.schedule.weekday)} disabled={!workspace.schedule.enabled} options={['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map((label,value)=>({value:String(value),label}))} onValueChange={weekday=>actions.updateReplenishmentSchedule({weekday:Number(weekday)})}/></div>}
     <div><Label htmlFor="replenishment-time">Run at</Label><Input id="replenishment-time" type="time" value={workspace.schedule.time} disabled={!workspace.schedule.enabled} onChange={event=>{if(event.target.validity.valid&&event.target.value)actions.updateReplenishmentSchedule({time:event.target.value});}}/><p className="workspace-caption mt-2">Europe/Rome · local time</p></div></div>
     <div className="workspace-plan-summary mt-4"><dl className="workspace-values"><dt>Next check</dt><dd>{workspace.replenishmentCheck.nextRun===null?'Paused':formatBusinessDateTime(new Date(workspace.replenishmentCheck.nextRun).toISOString())}</dd><dt>Last checked</dt><dd>{workspace.replenishmentCheck.lastRun?formatBusinessDateTime(workspace.replenishmentCheck.lastRun):'Not run yet'}</dd></dl>{workspace.replenishmentCheck.lastRun&&<p role="status">{workspace.replenishmentCheck.suppliers} supplier{workspace.replenishmentCheck.suppliers===1?'':'s'} to replenish.</p>}<Button variant="outline" size="sm" onClick={()=>actions.runReplenishmentCheck()}>Check now</Button></div></section>
     {!compact&&<section className="border-t border-border pt-4"><h3>Notifications</h3><div className="workspace-setting"><div><Label htmlFor="agent-task-notifications">Task results</Label><p>Notify me when a task finishes or needs attention.</p></div><Switch id="agent-task-notifications" checked={workspace.settings.taskNotifications} onCheckedChange={taskNotifications=>actions.updateWorkspaceSettings({taskNotifications})}/></div><div className="workspace-setting"><div><Label htmlFor="agent-delivery-reminders">Delivery reminders</Label><p>Remind me about overdue purchase deliveries.</p></div><Switch id="agent-delivery-reminders" checked={workspace.settings.deliveryReminders} onCheckedChange={deliveryReminders=>actions.updateWorkspaceSettings({deliveryReminders})}/></div></section>}
    </>}

   </div>}</>;
 return inline?<div className="workspace-inline-panel">{content}</div>:<Sheet open={panel!==null} onOpenChange={open=>{if(!open)onPanel(null);}}><SheetContent className="w-full p-0 sm:max-w-lg">{content}</SheetContent></Sheet>;
}
