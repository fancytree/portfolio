import {useState} from 'react';
import WorkspacePanels,{type WorkspacePanel,type WorkspacePanelActions} from '../agent-workspace/WorkspacePanels';
import {getWorkspace,replenishmentOpportunities,workspaceNotifications,type WorkspaceState} from '../agent-workspace/workspaceStore';
import {nextReplenishmentRun} from '../agent-workspace/replenishmentSchedule';
import '../agent-workspace/agent-workspace.css';
export function useDesignWorkspace(focus?:WorkspacePanel){
 const [workspace,setWorkspace]=useState<WorkspaceState>(()=>{const value=structuredClone(getWorkspace());if(focus==='tasks')value.sampleTasks=[value.sampleTasks[0],value.sampleTasks[value.sampleTasks.length-1]];if(focus==='signals')for(const notice of workspaceNotifications(value).slice(1))value.notificationState[notice.id]='deleted';return value;});
 const actions:WorkspacePanelActions={
  controlSampleTask:(id,action)=>setWorkspace(value=>({...value,sampleTasks:value.sampleTasks.map(task=>task.id===id?{...task,status:action==='pause'?'paused':'running'}:task)})),
  controlReview:(id,action)=>setWorkspace(value=>({...value,tasks:value.tasks.map(task=>task.id===id?{...task,status:action==='pause'?'paused':action==='quick'?'running':action==='retry'?'running':'running'}:task)})),
  deleteNotification:id=>setWorkspace(value=>({...value,notificationState:{...value.notificationState,[id]:'deleted'}})),
  markNotificationRead:id=>setWorkspace(value=>({...value,notificationState:{...value.notificationState,[id]:'read'}})),
  rateReview:(id,feedback)=>setWorkspace(value=>({...value,tasks:value.tasks.map(task=>task.id===id?{...task,feedback}:task)})),
  runReplenishmentCheck:(now=Date.now())=>setWorkspace(value=>({...value,replenishmentCheck:{lastRun:new Date(now).toISOString(),nextRun:nextReplenishmentRun(value.schedule,now),suppliers:replenishmentOpportunities(value).length}})),
  updateReplenishmentSchedule:patch=>setWorkspace(value=>{const schedule={...value.schedule,...patch};return {...value,schedule,replenishmentCheck:{...value.replenishmentCheck,nextRun:nextReplenishmentRun(schedule)}};}),
  updateWorkspaceSettings:patch=>setWorkspace(value=>({...value,settings:{...value.settings,...patch}})),
 };
 return {workspace,setWorkspace,actions};
}
export default function InlineWorkspace({initial}:{initial:WorkspacePanel}){
 const {workspace,actions}=useDesignWorkspace(initial);const [panel,setPanel]=useState<WorkspacePanel|null>(initial);const [taskId,setTaskId]=useState('');const [located,setLocated]=useState('');
 return <div className="ux-workspace-fragment"><WorkspacePanels inline compact panel={panel} onPanel={setPanel} workspace={workspace} actions={actions} onTask={setTaskId} taskId={taskId} onOpen={setLocated} onLocate={setLocated} onCreate={coverage=>setLocated(`MNP · ${coverage}-day sales coverage`)} onPrepare={()=>setPanel('suppliers')} onFilter={()=>setLocated('Orders that need review')}/>{located&&<div className="workspace-plan-summary" role="status">{located}</div>}</div>;
}
