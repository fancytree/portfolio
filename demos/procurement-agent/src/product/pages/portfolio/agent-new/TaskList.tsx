import { useWorkspace, controlReview } from '../agent-workspace/workspaceStore';
import { usePortfolioOrder } from '../_shared/PortfolioOrderContext';
import { ClipboardList, Pause, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import type { DemoState } from '../procurement-agent/portfolioDemoTypes';
import { orderSignature, type Experience, type ExperienceAction } from './experienceModel';

export function conversationTasks(order:DemoState, paused:boolean) {
  return order.messages.flatMap((message,index)=>{
    if(message.role!=='status')return [];
    const previous=order.messages.slice(0,index).reverse().find(item=>item.role==='user');
    const next=order.messages.slice(index+1).find(item=>item.role!=='status');
    const complete=message.progress?.status==='complete';
    const title=message.mode==='plan'?'Create purchase plan'
      :next?.role==='agent'&&next.result?next.result.title
      :previous?.text.split('\n')[0]??message.text;
    return [{id:message.id,title,status:complete?'Completed':paused?'Paused':'In progress',active:!complete}];
  }).reverse();
}

export default function TaskList({order,experience,paused,onPause,onResume,dispatch,onFindings,onClose}: {
  order:DemoState;experience:Experience;paused:boolean;onPause:()=>void;onResume:()=>void;
  onClose?:()=>void;dispatch:(action:ExperienceAction)=>void;onFindings:(id:string)=>void;
}) {
  const identity=usePortfolioOrder();
  const tasks=conversationTasks(order,paused);
  const workspace=useWorkspace();
  const otherTasks=workspace.orders.filter(item=>item.id!==identity.number).flatMap(item=>conversationTasks(item.state,!!item.paused).map(task=>({...task,orderId:item.id})));
  const open=(id:string)=>{onClose?.();identity.onOpen?.(id);};
  if(!tasks.length&&!experience.jobs.length&&!workspace.tasks.length&&!otherTasks.length)return <Empty className="min-h-48" aria-label="No tasks yet"><EmptyHeader><EmptyMedia variant="icon"><ClipboardList aria-hidden/></EmptyMedia><EmptyTitle>No tasks yet</EmptyTitle></EmptyHeader></Empty>;
  return <ul className="agent-new-task-list" aria-label="Agent task list">
    {experience.jobs.slice().reverse().map(job=><li key={job.id} className="agent-new-task-row">
      <div><h3 className="line-clamp-2" title={job.goal}>{job.goal}</h3><p>{identity.number}</p></div><Badge variant={job.status==='complete'?'success':job.status==='failed'?'destructive':'outline'}>{job.status==='complete'?'Completed':job.status}</Badge>
      {job.status==='running'&&<Button variant="ghost" size="sm" onClick={()=>dispatch({type:'pause',id:job.id})}>Pause review</Button>}
      {job.status==='paused'&&<Button variant="ghost" size="sm" onClick={()=>dispatch({type:'resume',id:job.id,context:orderSignature(order)})}>Resume review</Button>}
      {job.status==='complete'&&<Button variant="ghost" size="sm" onClick={()=>onFindings(job.id)}>View findings</Button>}
    </li>)}
    {workspace.tasks.map(task=><li key={task.id} className="agent-new-task-row"><div><h3 className="line-clamp-2" title={task.goal}>{task.goal}</h3><button type="button" className="workspace-order-link" onClick={()=>open(task.orderId)}>{task.orderId}</button></div><Badge variant={task.status==='complete'?'success':task.status==='failed'?'destructive':'outline'}>{task.status==='complete'?'Completed':task.status}</Badge>{task.status==='running'&&<Button size="sm" variant="ghost" onClick={()=>controlReview(task.id,'pause')}>Pause review</Button>}{task.status==='paused'&&<Button size="sm" variant="ghost" onClick={()=>controlReview(task.id,'resume')}>Resume review</Button>}</li>)}
    {otherTasks.map(task=><li key={`${task.orderId}-${task.id}`} className="agent-new-task-row"><div><h3 className="line-clamp-2" title={task.title}>{task.title}</h3><button type="button" className="workspace-order-link" onClick={()=>open(task.orderId)}>{task.orderId}</button></div><Badge variant={task.status==='Completed'?'success':task.status==='Paused'?'warning':'info'}>{task.status}</Badge></li>)}
    {tasks.map(task=><li key={task.id} className="agent-new-task-row">
      <div><h3 className="line-clamp-2" title={task.title}>{task.title}</h3>{order.planGenerated&&<p>{identity.number}</p>}</div><Badge variant={task.status==='Completed'?'success':task.status==='Paused'?'warning':'info'}>{task.status}</Badge>
      {task.active&&(paused?<Button variant="ghost" size="sm" onClick={onResume}><Play size={12} aria-hidden/>Resume task</Button>:<Button variant="ghost" size="sm" onClick={onPause}><Pause size={12} aria-hidden/>Pause task</Button>)}
    </li>)}
  </ul>;
}
