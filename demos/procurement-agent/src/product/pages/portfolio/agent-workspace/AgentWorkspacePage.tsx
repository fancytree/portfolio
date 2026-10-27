import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AgentNewPage from '../agent-new/AgentNewPage';
import { PortfolioOrderContext } from '../_shared/PortfolioOrderContext';
import PurchaseWorkspaceList from './PurchaseWorkspaceList';
import { advanceReviews, deletePurchaseDraft, updateOrderExperience, updateOrderPaused, updateOrderState, useWorkspace } from './workspaceStore';
import './agent-workspace.css';

export default function AgentWorkspacePage(){
 const workspace=useWorkspace();const [params,setParams]=useSearchParams();
 const requested=params.get('order');const selected=workspace.orders.find(order=>order.id===requested&&!order.previewOnly)?.id;
 const [visited,setVisited]=useState<string[]>([]);
 useEffect(()=>{const timer=window.setInterval(()=>advanceReviews(),300);return()=>window.clearInterval(timer);},[]);
 useEffect(()=>{if(selected)setVisited(previous=>previous.includes(selected)?previous:[...previous,selected]);},[selected]);
 const open=(orderId:string)=>{if(!workspace.orders.find(order=>order.id===orderId)?.previewOnly)setParams({order:orderId});};const back=()=>setParams({});
 const shown=[...new Set([...visited,...(selected?[selected]:[])])];
 return <div className="purchase-workspace-host">
  <div className={selected?'hidden':'purchase-workspace-view'}><PurchaseWorkspaceList workspace={workspace} onOpen={open}/></div>
  {shown.map(orderId=>{const entry=workspace.orders.find(order=>order.id===orderId);return entry?<div className={orderId===selected?'purchase-workspace-view':'hidden'} key={orderId}><PortfolioOrderContext.Provider value={{number:orderId,onBack:back,onOpen:open,onDeleteDraft:()=>{deletePurchaseDraft(orderId);back();}}}><AgentNewPage workspaceEntry={entry} onStateChange={state=>updateOrderState(orderId,state)} onPausedChange={paused=>updateOrderPaused(orderId,paused)} onExperienceChange={experience=>updateOrderExperience(orderId,experience)}/></PortfolioOrderContext.Provider></div>:null;})}
 </div>;
}
