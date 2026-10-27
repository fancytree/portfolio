import { EDIT_ROUND_IDLE_MS, editRoundDetail, historyMilestones, isDraftChanged } from './draftHistory';
import { orderActivityChanges } from './orderActivity';
import { usePortfolioOrder } from '../_shared/PortfolioOrderContext';
import { formatBusinessDate } from '@/lib/dateTime';
import { useEffect, useReducer, useRef, useState } from 'react';
import type { DemoState } from '../procurement-agent/portfolioDemoTypes';
import { MNP_SUPPLIER_RULES } from '../procurement-agent/portfolioDemoScript';
import { documentContext, EXPERIENCE_KEY, experienceReducer, lineSignature, localDay, initialExperience, type Experience } from './experienceModel';

export function useExperience(order:DemoState,seed?:Experience,onChange?:(value:Experience)=>void,restored?:{id:string;nonce:number}){
 const identity=usePortfolioOrder();
 const rules=identity.supplierRules??MNP_SUPPLIER_RULES;
 const [experience,dispatch]=useReducer(experienceReducer,undefined,()=>seed??initialExperience());
 useEffect(()=>{onChange?.(experience);},[experience,onChange]);
 const previousOrder=useRef(order);
 const creationRecorded=useRef(experience.versions.length>0);
 const restoredNonce=useRef<number>();
 const pendingRound=useRef<{before:DemoState;after:DemoState}|null>(null);
 const roundTimer=useRef<number>();
 const roundAction=()=>{
  const round=pendingRound.current;pendingRound.current=null;
  if(!round||!isDraftChanged(round.before,round.after)||round.after.orderRecorded)return null;
  return {type:'snapshot' as const,state:round.after,label:'Autosaved changes',kind:'autosave' as const,actor:'Buyer',sourceEvent:{kind:'draft-edited',detail:editRoundDetail(round.before,round.after)}};
 };
 const flushHistory=()=>{
  if(roundTimer.current!==undefined){window.clearTimeout(roundTimer.current);roundTimer.current=undefined;}
  const action=roundAction();if(action)dispatch(action);
 };
 const persistOnExit=useRef(()=>{});
 persistOnExit.current=()=>{
  const action=roundAction();if(!action)return;
  const next=experienceReducer(experience,action);onChange?.(next);
  if(!seed)try{localStorage.setItem(EXPERIENCE_KEY,JSON.stringify(next));}catch{/* The current draft is saved independently. */}
 };
 useEffect(()=>{
  const before=previousOrder.current;previousOrder.current=order;
  if(!order.planGenerated)return;
  if(!creationRecorded.current){
   creationRecorded.current=true;
   dispatch({type:'snapshot',state:order,label:'Initial plan',kind:'milestone',actor:'Agent',sourceEvent:{kind:'draft-created',detail:`${identity.number} · ${order.intakeDraft?.coverageDays??30}-day sales coverage`}});
   return;
  }
  if(restored&&restoredNonce.current!==restored.nonce){
   restoredNonce.current=restored.nonce;flushHistory();
   for(const entry of orderActivityChanges(before,order).filter(entry=>entry.kind==='approval-invalidated'))dispatch({type:'event',...entry});
   dispatch({type:'snapshot',state:order,label:'Draft restored',kind:'milestone',actor:'Buyer',sourceEvent:{kind:'version-restore',detail:`Restored from ${(experience.versions.find(version=>version.id===restored.id)?.label??'earlier draft')}`}});
   return;
  }
  const entries=orderActivityChanges(before,order).filter(entry=>!['draft-edited','products-added','products-removed'].includes(entry.kind));
  if(entries.some(entry=>historyMilestones[entry.kind]))flushHistory();
  for(const entry of entries){
   const label=historyMilestones[entry.kind];
   if(label)dispatch({type:'snapshot',state:order,label,kind:'milestone',actor:entry.kind==='confirmation-checked'?'Agent':'Buyer',sourceEvent:entry});
   else dispatch({type:'event',...entry});
  }
  if(isDraftChanged(before,order)&&!entries.some(entry=>historyMilestones[entry.kind])&&!order.orderRecorded){
   pendingRound.current={before:pendingRound.current?.before??before,after:order};
   if(roundTimer.current!==undefined)window.clearTimeout(roundTimer.current);
   roundTimer.current=window.setTimeout(flushHistory,EDIT_ROUND_IDLE_MS);
  }
 },[order,identity.number,restored]);
 useEffect(()=>()=>{if(roundTimer.current!==undefined)window.clearTimeout(roundTimer.current);persistOnExit.current();},[]);
 const [storageError,setStorageError]=useState(false);
 useEffect(()=>{if(seed)return;try{localStorage.setItem(EXPERIENCE_KEY,JSON.stringify(experience));setStorageError(false);}catch{setStorageError(true);}},[experience]);
 const signature=`${documentContext(order)}:${lineSignature(order.lines)}`;
 useEffect(()=>{const interval=window.setInterval(()=>dispatch({type:'tick',now:Date.now(),state:order}),300);return()=>clearInterval(interval);},[order]);
 useEffect(()=>{
  if(!order.planGenerated)return;
  const today=localDay();
  if(rules.validUntil<today)dispatch({type:'alert',alert:{id:`rule:${rules.version}:${rules.validUntil}`,kind:'rule',title:'Supplier rules need revalidation',detail:`MNP rules expired on ${formatBusinessDate(rules.validUntil)}. Verify lead time and commercial terms before relying on them.`,important:true,target:'evidence'}});
  for(const line of order.lines){if(line.sales30>0&&line.stock/(line.sales30/30)<rules.leadTimeMedianDays)dispatch({type:'alert',alert:{id:`stock:${line.sku}:${line.stock}:${line.sales30}`,kind:'stock',title:`Stock cover: ${line.name}`,detail:`Available ${line.stock} PZ; 30-day sales ${line.sales30} PZ. Review supply before the lead-time window.`,important:true,target:'evidence'}});}
  if(order.confirmationUploaded&&order.confirmationHasRisk)dispatch({type:'alert',alert:{id:`variance:${documentContext(order)}`,kind:'variance',title:'Supplier confirmation has differences',detail:'Price or quantity differs from the plan. Review the purchase order before committing.',important:true,target:'evidence'}});
 },[signature,order.planGenerated]);
 const terminal=experience.jobs.map(j=>`${j.id}:${j.status}`).join('|');
 useEffect(()=>{for(const job of experience.jobs){if(job.status==='complete'||job.status==='failed')dispatch({type:'alert',alert:{id:`task:${job.id}:${job.status}:${job.retries}`,kind:job.status==='failed'?'failure':'complete',title:job.status==='failed'?'Review needs your attention':'Review ready',detail:job.status==='failed'?(job.error??'Reconnect the required source.'):job.goal,important:job.status==='failed',target:'task'}});}},[terminal]);
 useEffect(()=>{if(order.learningDecision==='accepted')dispatch({type:'memory-create',title:'Review this order’s quantity and arrival feedback',source:`Purchase outcome review · ${identity.number}`,orderId:identity.number});},[order.learningDecision]);
 return {experience,dispatch,storageError,flushHistory};
}
