import { getSupplierRules, snapshotSupplierRules, type SupplierRules } from '../agent-new/supplierRulesStore';
import { defaultReplenishmentSchedule, nextReplenishmentRun, type ReplenishmentSchedule } from './replenishmentSchedule';
import { useSyncExternalStore } from 'react';
import { BASE_LINES, goodsTotal, createInitialState, jumpToStage, createReceivingLinesFromPo, confirmCurrentReceiptBatch, applyRemainingGoodsDecision } from '../procurement-agent/portfolioDemoScript';
import type { DemoState } from '../procurement-agent/portfolioDemoTypes';
import { applyFocusedConfirmation, applyFocusedDdt } from '../agent-new/focusedFixtures';
import { initialExperience, orderSignature, localDay, type Experience } from '../agent-new/experienceModel';

export const WORKSPACE_ROUTE='/portfolio/agent-workspace';
export type PurchaseTiming={sourceId?:string;stockDays:number;leadDays:number;snapshotDate:string};
export type PurchaseRecord={id:string;supplier:string;supplierName?:string;previewOnly?:boolean;previewGoods?:number;coverage:number;updatedAt:string;state:DemoState;experience:Experience;autoStart?:boolean;paused?:boolean;timing?:PurchaseTiming;rulesSnapshot?:SupplierRules};
export type ReviewTask={id:string;orderId:string;goal:string;mode:'quick'|'deep';includeDocs:boolean;signature:string;status:'running'|'paused'|'complete'|'failed'|'queued';step:number;nextAt:number;createdAt:string;output:string[];error?:string;feedback?:'useful'|'needs-work'};
export type SampleTask={id:string;title:string;supplier:string;orderId:string;status:'running'|'paused'|'complete';detail:string;output:string[];nextAt?:number};
export type SupplierNote={id:string;supplier:'MNP';title:string;coverage?:number;status:'candidate'|'approved'|'disabled';source:string;expires:string};
export type WorkspaceState={orders:PurchaseRecord[];tasks:ReviewTask[];sampleTasks:SampleTask[];notes:SupplierNote[];notificationState:Record<string,'read'|'deleted'>;handled:Record<string,{state:'snoozed'|'dismissed';until:number}>;events:Array<{id:string;at:string;title:string;orderId?:string}>;cacheHits:number;schedule:ReplenishmentSchedule;replenishmentCheck:{lastRun:string|null;nextRun:number|null;suppliers:number};settings:{proactive:boolean;inventoryAccess:boolean;documentAccess:boolean;taskNotifications:boolean;deliveryReminders:boolean}};
const clone=<T,>(value:T):T=>JSON.parse(JSON.stringify(value));
const stamp=()=>new Date().toISOString();
const id=()=>crypto.randomUUID();
const opportunitySnapshotDate=localDay();
function seedOrders():PurchaseRecord[]{
 const draft=jumpToStage('replenishment');
 const review=applyFocusedConfirmation(clone(draft));
 const ordered={...jumpToStage('receiving'),lines:clone(review.lines),orderAt:'2026-10-12T09:30',orderedBy:'Giulia Rossi · Buyer',expectedArrival:'2026-10-24'};
 ordered.receivingLines=createReceivingLinesFromPo(ordered.lines);
 const ddt=applyFocusedDdt(clone(ordered));
 ddt.receivingLines=ddt.receivingLines.map(line=>({...line,disposition:'receive'}));
 const partial=confirmCurrentReceiptBatch(ddt);
 const received=applyRemainingGoodsDecision(clone(partial),'close_remaining');
 return [
  {id:'PO-2026-0842',state:draft,updatedAt:'2026-10-26T08:05:00+01:00'},
  {id:'PO-2026-0841',state:review,updatedAt:'2026-10-25T16:40:00+01:00'},
  {id:'PO-2026-0840',state:ordered,updatedAt:'2026-10-24T09:30:00+02:00'},
  {id:'PO-2026-0839',state:partial,updatedAt:'2026-10-23T14:20:00+02:00'},
  {id:'PO-2026-0838',state:received,updatedAt:'2026-10-22T11:10:00+02:00'},
  {id:'PO-2026-0837',state:clone(draft),updatedAt:'2026-10-25T10:20:00+01:00'},
  {id:'PO-2026-0836',state:clone(draft),updatedAt:'2026-10-24T15:10:00+02:00'},
 ].map((record,index)=>({...record,supplier:['MNP','L’Oréal','Wella','Schwarzkopf','Alfaparf','Davines','Olaplex'][index],supplierName:['MESAUDA NAIL PRO','PROFESSIONNEL','PROFESSIONALS','PROFESSIONAL','MILANO','ESSENTIAL HAIRCARE','PROFESSIONAL'][index],previewOnly:index>0,previewGoods:[undefined,7840,4620.5,5896.2,2350.8,2180,1640][index],coverage:[30,45,30,60,30,45,30][index],timing:index===0?{stockDays:8,leadDays:14,snapshotDate:localDay(),sourceId:'mnp-earlier-buying-cycle'}:index===5?{stockDays:17,leadDays:14,snapshotDate:localDay()}:index===6?{stockDays:45,leadDays:14,snapshotDate:localDay()}:undefined,experience:initialExperience(),state:{...record.state,messages:[]}})).filter(order=>order.id!=='PO-2026-0842');
}
let current:WorkspaceState={orders:seedOrders(),tasks:[],sampleTasks:[{id:'sample-forecast',title:'Prepare replenishment forecast',supplier:'Davines',orderId:'PO-2026-0837',status:'running',nextAt:Date.now()+60000,detail:'Comparing sales trends with available stock.',output:['45-day sales coverage prepared.','Estimated goods: €2,180.00.']},{id:'sample-confirmation',title:'Compare supplier confirmation',supplier:'L’Oréal',orderId:'PO-2026-0841',status:'paused',detail:'Paused before checking the revised confirmation.',output:['Confirmation comparison prepared for buyer review.']},{id:'sample-receiving',title:'Summarize receiving',supplier:'Alfaparf',orderId:'PO-2026-0838',status:'complete',detail:'Receiving summary is ready.',output:['All goods received.','No outstanding deliveries for this order.']}],notes:[],notificationState:{},handled:{},events:[],cacheHits:0,schedule:defaultReplenishmentSchedule,replenishmentCheck:{lastRun:null,nextRun:nextReplenishmentRun(defaultReplenishmentSchedule),suppliers:3},settings:{proactive:true,inventoryAccess:true,documentAccess:true,taskNotifications:true,deliveryReminders:true}};
const listeners=new Set<()=>void>();
function publish(next:WorkspaceState){current=next;listeners.forEach(listener=>listener());}
function event(next:WorkspaceState,title:string,orderId?:string){return {...next,events:[{id:id(),at:stamp(),title,orderId},...next.events].slice(0,100)};}
export const getWorkspace=()=>current;
export function useWorkspace(){return useSyncExternalStore(listener=>{listeners.add(listener);return()=>{listeners.delete(listener);};},getWorkspace);}
export function orderStatus(record:PurchaseRecord){const s=record.state;if(record.paused&&!s.planGenerated)return 'Paused';return s.receivingComplete?'Received':s.orderRecorded?(s.receiptBatches.length?'Partially received':'Ordered'):s.confirmationUploaded&&!s.approved?'Needs review':s.approved?'Approved':!s.planGenerated&&s.progress.status==='running'?'Planning':'Draft';}
export function deletePurchaseDraft(orderId:string){
 const order=current.orders.find(item=>item.id===orderId);
 if(!order||order.previewOnly||orderStatus(order)!=='Draft'||!order.state.planGenerated)throw new Error('Only a draft purchase order can be deleted.');
 publish(event({...current,orders:current.orders.filter(item=>item.id!==orderId),tasks:current.tasks.filter(task=>task.orderId!==orderId),sampleTasks:current.sampleTasks.filter(task=>task.orderId!==orderId)},'Purchase draft deleted',orderId));
}
export function updateOrderState(orderId:string,state:DemoState){const old=current.orders.find(order=>order.id===orderId);if(!old||old.previewOnly||old.state===state)return;const next={...current,orders:current.orders.map(order=>order.id===orderId?{...order,state,coverage:state.intakeDraft?.coverageDays??order.coverage,updatedAt:stamp()}:order)};publish(!old.state.planGenerated&&state.planGenerated?event(next,'Purchase plan ready',orderId):next);}
export function updateOrderExperience(orderId:string,experience:Experience){if(current.orders.find(order=>order.id===orderId)?.experience===experience)return;publish({...current,orders:current.orders.map(order=>order.id===orderId?{...order,experience}:order)});}
export function updateOrderPaused(orderId:string,paused:boolean){const order=current.orders.find(item=>item.id===orderId);if(!order||!!order.paused===paused)return;publish(event({...current,orders:current.orders.map(item=>item.id===orderId?{...item,paused}:item)},paused?'Plan paused':'Plan resumed',orderId));}
let lastPurchaseNumber=841;
function nextPurchaseId(){lastPurchaseNumber=Math.max(lastPurchaseNumber,...current.orders.map(order=>Number(order.id.split('-').pop())))+1;return `PO-2026-${String(lastPurchaseNumber).padStart(4,'0')}`;}
export function createPurchase(coverage:number,timing?:PurchaseTiming){
 if(!current.settings.inventoryAccess)throw new Error('Enable order data access in Agent controls before generating a plan.');
 if(!Number.isInteger(coverage)||coverage<1||coverage>180)throw new Error('Choose a coverage period from 1 to 180 days.');
 const orderId=nextPurchaseId();
 const state={...createInitialState(),lines:[],receivingLines:[],orderedQty:0,draftInput:`Plan MNP for the next ${coverage} days`,messages:[]};
 state.progress={status:'running',current:'understand',completed:[]};
 const record:PurchaseRecord={id:orderId,supplier:'MNP',coverage,updatedAt:stamp(),state,experience:initialExperience(),autoStart:true,timing,rulesSnapshot:snapshotSupplierRules()};
 publish(event({...current,orders:[record,...current.orders]},'Purchase plan requested',orderId));return record;
}
export function updateWorkspaceSettings(patch:Partial<WorkspaceState['settings']>){publish(event({...current,settings:{...current.settings,...patch}},'Agent controls updated'));}
export function handleSignal(signalId:string,state:'snoozed'|'dismissed'){publish({...current,handled:{...current.handled,[signalId]:{state,until:state==='snoozed'?Date.now()+86400000:0}}});}
export type ProactiveSignal={id:string;title:string;detail:string;source:string;action:string;orderId?:string;taskId?:string;kind:'review'|'delivery'|'stock'|'complete'|'failure'};
export function proactiveSignals(workspace:WorkspaceState,now=Date.now()):ProactiveSignal[]{
 if(!workspace.settings.proactive)return [];
 const signals:ProactiveSignal[]=[];
 for(const order of workspace.settings.inventoryAccess?workspace.orders:[]){
  if(orderStatus(order)==='Needs review')signals.push({id:`review:${order.id}:${orderSignature(order.state)}`,title:'Confirmation needs review',detail:`${order.id} · review quantity and price differences.`,source:'Current supplier confirmation',action:'Review order',orderId:order.id,kind:'review'});
  if(workspace.settings.deliveryReminders&&order.state.orderRecorded&&!order.state.receivingComplete&&order.state.expectedArrival&&order.state.expectedArrival<localDay())signals.push({id:`delivery:${order.id}:${order.state.expectedArrival}:${order.state.receiptBatches.length}`,title:'Delivery follow-up',detail:`${order.id} · expected ${order.state.expectedArrival}. Goods remain open.`,source:'Recorded ETA and received quantities',action:'Open order',orderId:order.id,kind:'delivery'});
 }
 for(const opportunity of replenishmentOpportunities(workspace))signals.push({id:opportunity.id,title:`${opportunity.supplier} stock coverage is low`,detail:`${opportunity.skuCount} SKUs · ${opportunity.stockDays} days of stock · ${opportunity.leadDays}-day lead time.`,source:'Available stock, sales snapshot and supplier lead time',action:'Create purchase order',kind:'stock'});
 for(const task of workspace.tasks){
  if(!workspace.settings.taskNotifications)continue;
  if(task.status==='complete')signals.push({id:`task:${task.id}:complete`,title:'Review ready',detail:`${task.orderId} · findings are ready for your review.`,source:'Completed review task',action:'View findings',orderId:task.orderId,taskId:task.id,kind:'complete'});
  if(task.status==='failed')signals.push({id:`task:${task.id}:failed:${task.nextAt}`,title:'Review needs attention',detail:`${task.orderId} · ${task.error??'Open the task to continue.'}`,source:'Review task status',action:'View task',orderId:task.orderId,taskId:task.id,kind:'failure'});
 }
 for(const item of workspace.events.filter(item=>workspace.settings.taskNotifications&&item.title==='Purchase plan ready'))signals.push({id:`plan:${item.id}`,title:'Purchase plan ready',detail:`${item.orderId} · the editable draft is ready.`,source:'Completed plan task',action:'Open plan',orderId:item.orderId,kind:'complete'});
 return signals.sort((a,b)=>({review:0,stock:1,delivery:2,failure:0,complete:3}[a.kind]-{review:0,stock:1,delivery:2,failure:0,complete:3}[b.kind])).filter(signal=>{const handled=workspace.handled[signal.id];return !handled||(handled.state==='snoozed'&&handled.until<=now);});
}
export function startReviews(orderIds:string[],mode:'quick'|'deep',includeDocs:boolean){
 if(includeDocs&&mode!=='deep')throw new Error('Choose Deep review to include document references.');
 if(!orderIds.length)throw new Error('Select at least one purchase order.');
 if(!current.settings.inventoryAccess)throw new Error('Enable order data access in Agent controls.');
 if(includeDocs&&!current.settings.documentAccess)throw new Error('Enable attached-document access in Agent controls.');
 let next=current;
 for(const orderId of [...new Set(orderIds)]){
  const order=next.orders.find(item=>item.id===orderId);if(!order)continue;
  if(order.previewOnly)throw new Error('This purchase order is read-only.');
  if(!order.state.planGenerated)throw new Error('Wait for the purchase plan to finish before starting a review.');
  const signature=orderSignature(order.state);
  const existing=next.tasks.find(task=>task.orderId===orderId&&task.signature===signature&&task.mode===mode&&task.includeDocs===includeDocs&&task.status==='complete');
  if(existing){next=event({...next,cacheHits:next.cacheHits+1},'Existing review reused',orderId);continue;}
  if(next.tasks.some(task=>task.orderId===orderId&&task.signature===signature&&task.mode===mode&&task.includeDocs===includeDocs&&['running','paused','queued'].includes(task.status)))continue;
  const task:ReviewTask={id:id(),orderId,goal:includeDocs?'Review order and attached documents':'Review purchase order',mode,includeDocs,signature,status:'running',step:0,nextAt:Date.now()+700,createdAt:stamp(),output:[]};
  next=event({...next,tasks:[task,...next.tasks]},'Review started',orderId);
 }
 publish(next);
}
export function advanceReviews(now=Date.now()){
 if(current.replenishmentCheck.nextRun!==null&&current.replenishmentCheck.nextRun<=now)runReplenishmentCheck(now);
 if(current.sampleTasks.some(task=>task.status==='running'&&task.nextAt!==undefined&&task.nextAt<=now))publish({...current,sampleTasks:current.sampleTasks.map(task=>task.status==='running'&&task.nextAt!==undefined&&task.nextAt<=now?{...task,status:'complete'}:task)});
 if(!current.tasks.some(task=>task.status==='running'&&task.nextAt<=now))return;
 let next=current;
 const tasks=current.tasks.map(task=>{
  if(task.status!=='running'||task.nextAt>now)return task;
  const order=current.orders.find(item=>item.id===task.orderId);
  const error=!order?'Order no longer available':!current.settings.inventoryAccess?'Order access is disabled':task.includeDocs&&!current.settings.documentAccess?'Document access is disabled':orderSignature(order.state)!==task.signature?'Order changed. Review the latest revision.':task.includeDocs&&!order.state.attachments.length?'No document is attached. Upload a confirmation first.':undefined;
  if(error){next=event(next,'Review needs attention',task.orderId);return {...task,status:'failed' as const,error};}
  const step=task.step+1;if(step<4)return {...task,step,nextAt:now+700};
  next=event(next,'Review completed',task.orderId);
  const differences=order!.state.lines.filter(line=>line.plannedQty!==line.qty||(line.confirmedPrice!==null&&Math.abs(line.confirmedPrice-line.estimatedPrice)>.0001));
  return {...task,step,status:'complete' as const,output:[`${order!.state.lines.length} SKUs checked in ${task.orderId}.`,`${differences.length} lines have confirmation differences.`,task.includeDocs?`${order!.state.attachments.length} document references linked to this revision.`:'Order data only; documents were not read.']};
 });publish({...next,tasks});
}
export function controlReview(taskId:string,action:'pause'|'resume'|'retry'|'quick'){
 let next=current;
 const tasks=current.tasks.map(task=>{
  if(task.id!==taskId)return task;
  if(action==='pause')return task.status==='running'?{...task,status:'paused' as const}:task;
  if(action==='quick')return {...task,status:'running' as const,mode:'quick' as const,includeDocs:false,step:0,nextAt:Date.now()+700,error:undefined};
  const order=current.orders.find(item=>item.id===task.orderId);if(!order)return task;
  if(!current.settings.inventoryAccess||(task.includeDocs&&!current.settings.documentAccess))return task;
  next=event(next,'Review resumed',task.orderId);
  return {...task,status:'running' as const,signature:orderSignature(order.state),step:action==='retry'||orderSignature(order.state)!==task.signature?0:task.step,nextAt:Date.now()+700,error:undefined};
 });publish({...next,tasks});
}
export function rateReview(taskId:string,feedback:'useful'|'needs-work'){publish(event({...current,tasks:current.tasks.map(task=>task.id===taskId?{...task,feedback}:task)},'Review feedback recorded',current.tasks.find(task=>task.id===taskId)?.orderId));}
export function addSupplierNote(title:string,source:string,coverage?:number){if(!title.trim())throw new Error('Add a supplier note.');if(coverage!==undefined&&(!Number.isInteger(coverage)||coverage<1||coverage>180))throw new Error('Coverage must be from 1 to 180 days.');publish(event({...current,notes:[{id:id(),supplier:'MNP',title:title.trim(),coverage,status:'candidate',source,expires:'2026-12-31'},...current.notes]},'Supplier preference proposed'));}
export function setSupplierNote(noteId:string,status:SupplierNote['status']){publish(event({...current,notes:current.notes.map(note=>note.id===noteId?{...note,status}:note)},'Supplier preference updated'));}
export function clearReviewHistory(){publish(event({...current,tasks:[],notes:[],events:[]},'Review history cleared'));}

export function controlSampleTask(taskId:string,action:'pause'|'resume'){
 publish({...current,sampleTasks:current.sampleTasks.map(task=>task.id===taskId?{...task,status:action==='pause'?'paused':'running',nextAt:action==='resume'?Date.now()+6000:undefined}:task)});
}

export function updateReplenishmentSchedule(patch:Partial<ReplenishmentSchedule>){
 const schedule={...current.schedule,...patch};
 if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(schedule.time)||!Number.isInteger(schedule.weekday)||schedule.weekday<0||schedule.weekday>6)throw new Error('Choose a valid check time and weekday.');
 publish({...current,schedule,replenishmentCheck:{...current.replenishmentCheck,nextRun:nextReplenishmentRun(schedule)}});
}
export function runReplenishmentCheck(now=Date.now()){
 if(!current.settings.inventoryAccess)return;
 const suppliers=replenishmentOpportunities(current).length;
 publish(event({...current,replenishmentCheck:{lastRun:new Date(now).toISOString(),nextRun:nextReplenishmentRun(current.schedule,now),suppliers}},'Supplier replenishment checked'));
}

export function workspaceNotifications(workspace:WorkspaceState){
 return proactiveSignals(workspace).filter(signal=>signal.kind!=='stock'&&workspace.notificationState[signal.id]!=='deleted').map(signal=>({...signal,read:workspace.notificationState[signal.id]==='read'}));
}
export function markNotificationRead(signalId:string){
 if(current.notificationState[signalId])return;
 publish({...current,notificationState:{...current.notificationState,[signalId]:'read'}});
}
export function deleteNotification(signalId:string){
 publish({...current,notificationState:{...current.notificationState,[signalId]:'deleted'}});
}

export function replenishmentSourceId(){return `stock:MNP:${BASE_LINES.map(line=>`${line.sku}:${line.stock}:${line.sales30}`).join(',')}`;}
export function currentReplenishmentTiming():PurchaseTiming{
 const stockDays=Math.floor(Math.min(...BASE_LINES.filter(line=>line.sales30>0).map(line=>line.stock/(line.sales30/30))));
 return {sourceId:replenishmentSourceId(),stockDays,leadDays:getSupplierRules().leadTimeMedianDays,snapshotDate:opportunitySnapshotDate};
}
export type ReplenishmentOpportunity=PurchaseTiming&{id:string;supplier:string;supplierName:string;coverage:number;skuCount:number;amount:number;minOrder:number;freeShippingFrom:number;shipping:number;detailsAvailable:boolean};
function allReplenishmentOpportunities():ReplenishmentOpportunity[]{
 const timing=currentReplenishmentTiming();
 return [
  {...timing,id:replenishmentSourceId(),supplier:'MNP',supplierName:'MESAUDA NAIL PRO',coverage:30,skuCount:BASE_LINES.length,amount:goodsTotal(BASE_LINES),minOrder:getSupplierRules().minOrderValue,freeShippingFrom:getSupplierRules().freeShippingThreshold,shipping:getSupplierRules().defaultShippingFee,detailsAvailable:true},
  {id:'stock:MOROCCANOIL:2026-10-26',sourceId:'stock:MOROCCANOIL:2026-10-26',supplier:'Moroccanoil',supplierName:'PROFESSIONAL',coverage:30,skuCount:7,amount:1872,minOrder:1000,freeShippingFrom:2000,shipping:35,stockDays:24,leadDays:21,snapshotDate:opportunitySnapshotDate,detailsAvailable:false},
  {id:'stock:KEUNE:2026-10-26',sourceId:'stock:KEUNE:2026-10-26',supplier:'Keune',supplierName:'HAIRCOSMETICS',coverage:45,skuCount:9,amount:2684,minOrder:1500,freeShippingFrom:2500,shipping:40,stockDays:19,leadDays:14,snapshotDate:opportunitySnapshotDate,detailsAvailable:false},
 ];
}
export function replenishmentOpportunities(workspace:WorkspaceState){
 if(!workspace.settings.inventoryAccess||!workspace.settings.proactive)return [];
 return allReplenishmentOpportunities().filter(opportunity=>!workspace.orders.some(order=>order.timing?.sourceId===opportunity.id));
}
export function createRecommendedPurchase(opportunityId=replenishmentSourceId()){
 const existing=current.orders.find(order=>order.timing?.sourceId===opportunityId);if(existing)return existing;
 if(!current.settings.inventoryAccess)throw new Error('Order data access is unavailable.');
 const opportunity=allReplenishmentOpportunities().find(item=>item.id===opportunityId);if(!opportunity)throw new Error('This replenishment opportunity is no longer available.');
 if(opportunity.detailsAvailable)return createPurchase(opportunity.coverage,currentReplenishmentTiming());
 const timing={sourceId:opportunity.id,stockDays:opportunity.stockDays,leadDays:opportunity.leadDays,snapshotDate:opportunity.snapshotDate};
 const state={...createInitialState(),planGenerated:true,lines:[],receivingLines:[],messages:[]};
 const record:PurchaseRecord={id:nextPurchaseId(),supplier:opportunity.supplier,supplierName:opportunity.supplierName,coverage:opportunity.coverage,previewOnly:true,previewGoods:opportunity.amount,updatedAt:stamp(),timing,state,experience:initialExperience()};
 publish(event({...current,orders:[record,...current.orders]},'Purchase draft created',record.id));return record;
}
export function syncStandaloneOrder(orderId:string,state:DemoState,rulesSnapshot=snapshotSupplierRules()){
 if(!state.planGenerated)return;
 if(current.orders.some(order=>order.id===orderId)){updateOrderState(orderId,state);return;}
 lastPurchaseNumber=Math.max(lastPurchaseNumber,Number(orderId.split('-').pop()));
 publish({...current,orders:[{id:orderId,supplier:'MNP',supplierName:'MESAUDA NAIL PRO',coverage:state.intakeDraft?.coverageDays??30,updatedAt:stamp(),state,rulesSnapshot,experience:initialExperience()},...current.orders]});
}
export function purchaseUrgency(record:PurchaseRecord,now=Date.now()){
 if(!record.timing||record.state.orderRecorded||record.state.receivingComplete||!record.state.planGenerated)return null;
 return timingUrgency(record.timing,now);
}
export function timingUrgency(timing:PurchaseTiming,now=Date.now()){
 const {stockDays,leadDays,snapshotDate}=timing;
 const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Rome'}).format(now);
 const daysElapsed=Math.max(0,Math.floor((Date.parse(today)-Date.parse(snapshotDate))/86400000));
 const remaining=Math.max(0,stockDays-daysElapsed);const daysToOrder=stockDays-leadDays-daysElapsed;
 if(daysToOrder>7)return null;
 const orderBy=new Date(Date.parse(snapshotDate)+(stockDays-leadDays)*86400000).toISOString().slice(0,10);
 return {label:daysToOrder<=0?'Order now':'Order soon',level:daysToOrder<=0?'urgent' as const:'soon' as const,stockDays:remaining,leadDays,orderBy};
}
