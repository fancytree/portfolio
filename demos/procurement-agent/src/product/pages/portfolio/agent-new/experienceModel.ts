import { z } from 'zod';
import type { DemoState, DemoLine } from '../procurement-agent/portfolioDemoTypes';
import { jumpToStage } from '../procurement-agent/portfolioDemoScript';

const text = z.string().max(24000);
const amount = z.number().finite().min(0).max(10000000);
const timestamp = z.number().finite().min(0).max(8640000000000000);
const phase = z.enum(['understand','validate','calculate','explain']);
const progress = z.object({status:z.enum(['idle','running','complete']),current:phase.nullable(),completed:z.array(phase).max(4)});
export const lineSchema=z.object({sku:text,productId:text,productCode:text,productName:text,variant:text,name:text,nameIt:text,stock:amount,sales30:amount,recommended:amount,qty:amount,plannedQty:amount,estimatedPrice:amount,confirmedPrice:amount.nullable(),alert:text.optional(),risk:z.enum(['price','qty','missing','extra']).nullable().optional()});
const resultSchema=z.object({title:text,summary:text.optional(),source:text.optional(),badges:z.array(text).optional(),sections:z.array(z.object({title:text,rows:z.array(z.object({label:text,before:text.optional(),after:text.optional(),detail:text.optional()})),preview:z.number().int().min(0).optional()})),notice:text.optional(),nextStep:text.optional()});
const attachment=z.object({id:text,kind:z.enum(['supplier_request','confirmation','replenishment_plan','ddt','invoice','other']),label:text,fileName:text,uploadedAt:text,source:text,format:z.enum(['pdf','xlsx']),isCurrent:z.boolean().optional()});
export const orderSchema:z.ZodType<DemoState>=z.object({
  stage:z.enum(['intake','replenishment','approval','receiving','retrospective']),
  messages:z.array(z.object({id:text,role:z.enum(['user','agent','status']),text,result:resultSchema.optional(),bullets:z.array(text).optional(),actions:z.array(z.object({id:text,label:text,prompt:text})).optional(),mode:z.enum(['plan','think']).optional(),progress:progress.optional(),thinkStep:z.number().optional()})).max(500),
  draftInput:text,documentTitle:text.nullable(),intakeDraft:z.object({supplier:text,coverageDays:amount.nullable(),objective:text,estimatedArrival:text,scope:text,constraints:text}).nullable(),planGenerated:z.boolean(),progress,
  lines:z.array(lineSchema).max(300),confirmationUploaded:z.boolean(),confirmationHasRisk:z.boolean(),exportFormat:z.enum(['xlsx','pdf']).nullable(),attachments:z.array(attachment).max(200),
  confirmationRounds:z.array(z.object({id:text,fileName:text,versionLabel:text,uploadedAt:text,source:text,isCurrent:z.boolean(),notes:z.array(z.object({id:text,at:text,actor:z.enum(['Buyer','Agent','Supplier']),text}))})),
  approvalTriggers:z.array(z.object({id:text,label:text,fired:z.boolean(),evidence:text})),approvalRequiredByRules:z.boolean(),approvalSubmitted:z.boolean(),approvalDecision:z.enum(['none','pending','approved','invalidated']),approved:z.boolean(),
  orderAt:text.nullable(),orderedBy:text.nullable(),expectedArrival:text.nullable(),orderRecorded:z.boolean(),orderedQty:amount,
  receiptBatches:z.array(z.object({id:text,label:text,batchNo:amount,confirmedAt:text,bySku:z.record(z.object({ddt:amount,counted:amount}))})),currentDdtReady:z.boolean(),awaitingRemainingDecision:z.boolean(),remainingDecision:z.enum(['wait_next_batch','supplier_delay','close_remaining','return_no_stock']).nullable(),receivingComplete:z.boolean(),
  receivingLines:z.array(z.object({sku:text,name:text,productId:text,productCode:text,productName:text,variant:text,nameIt:text,unit:text,ordered:amount,stocked:amount,ddt:amount,counted:amount,disposition:z.enum(['receive','hold','return'])})),learningDecision:z.enum(['pending','accepted','dismissed']).nullable(),messageSeq:amount,
});
export const ORDER_KEY='def-portfolio:agent-new:order:v2';
export const EXPERIENCE_KEY='def-portfolio:agent-new:experience:v2';
export function readOrder():DemoState {
  try{const result=orderSchema.safeParse(JSON.parse(localStorage.getItem(ORDER_KEY)??'null'));if(result.success)return {...result.data,messages:result.data.messages.map(m=>m.role==='status'&&m.progress?.status==='running'?{...m,text:'Reply interrupted · purchase context retained',progress:{...m.progress,status:'idle' as const}}:m)};}catch{/* A missing or damaged local checkpoint starts with the original order. */}
  return jumpToStage('replenishment');
}
export function restoreLines(current:DemoState,lines:DemoLine[],context:string):DemoState {
  if(current.orderRecorded||context!==documentContext(current)||!z.array(lineSchema).safeParse(lines).success)return current;
  return {...current,lines:lines.map(l=>({...l})),exportFormat:null,approved:false,approvalSubmitted:false,approvalDecision:current.approvalDecision==='none'?'none':'invalidated'};
}
export function documentContext(state:DemoState){return `${state.confirmationUploaded}:${state.confirmationRounds.map(r=>r.id).join(',')}`;}
export function lineSignature(lines:DemoLine[]){return JSON.stringify(lines.map(l=>[l.sku,l.plannedQty,l.qty,l.estimatedPrice,l.confirmedPrice]));}
export function orderSignature(state:DemoState){return `${documentContext(state)}:${lineSignature(state.lines)}`;}
const version=z.object({id:text,at:text,label:text,context:text,lines:z.array(lineSchema),kind:z.enum(['autosave','milestone']).optional(),actor:text.optional(),eventId:text.optional(),detail:text.optional()});
export const ORDER_MEMORY_SCOPE='PO-2026-0842' as const;
const memory=z.object({id:text,title:text,source:text,scope:text,status:z.enum(['candidate','approved','disabled','dismissed']),at:text,reviewedAt:text.nullable(),expires:text});
const event=z.object({id:text,at:text,kind:text,detail:text});
const job=z.object({id:text,template:z.boolean().default(false),memoryContext:text.default(''),memoryValues:z.array(text).default([]),kind:z.enum(['review','documents']),goal:text,coverage:z.number().int().min(1).max(180),includeDocs:z.boolean(),mode:z.enum(['quick','deep']),status:z.enum(['running','paused','failed','complete','queued','stale']),step:z.number().int().min(0).max(4),nextAt:timestamp,createdAt:text,completedAt:text.nullable(),context:text,error:text.nullable(),retries:z.number().int().min(0),source:z.enum(['order','documents']),output:z.array(text),background:z.boolean(),suspended:z.boolean()});
const feedback=z.object({id:text,jobId:text,rating:z.enum(['useful','needs-work']),reason:text,at:text});
const alert=z.object({id:text,kind:z.enum(['stock','rule','variance','complete','failure']),title:text,detail:text,status:z.enum(['open','snoozed','dismissed','resolved']),until:timestamp,at:text,important:z.boolean(),target:z.enum(['evidence','task','memory'])});
const transfer=z.object({format:z.literal('def-agent-task-v1'),orderId:z.literal('PO-2026-0842'),supplier:z.literal('MNP'),context:text,documentContext:text,goal:text,createdAt:text,sourceTask:text,lines:z.array(lineSchema),output:z.array(text)});
export const transferSchema=transfer.superRefine((value,ctx)=>{if(value.context!==`${value.documentContext}:${lineSignature(value.lines)}`)ctx.addIssue({code:z.ZodIssueCode.custom,message:'The handoff revision does not match its SKU evidence.'});if(new Set(value.lines.map(l=>l.sku)).size!==value.lines.length)ctx.addIssue({code:z.ZodIssueCode.custom,message:'Duplicate SKU evidence is not allowed.'});});
export type Transfer=z.infer<typeof transfer>;
const preferences=z.object({memory:z.boolean(),notifications:z.enum(['important','all','off']),orderAccess:z.boolean(),documentAccess:z.boolean(),device:z.enum(['desktop','mobile','voice'])});
const schema=z.object({v:z.literal(2),versions:z.array(version).max(30),memories:z.array(memory).max(60),events:z.array(event).max(300),jobs:z.array(job).max(25),feedback:z.array(feedback).max(100),alerts:z.array(alert).max(80),preferences,credits:z.number().int().min(0).max(5),quotaDay:text,baselineSeconds:amount.default(0),suppressedSources:z.array(text).default([]),transfer:transfer.nullable()});
export type Experience=z.infer<typeof schema>;
export type Job=Experience['jobs'][number];
export function approvedPreferences(state:Experience){return state.preferences.memory?state.memories.filter(m=>m.scope===ORDER_MEMORY_SCOPE&&m.status==='approved'&&m.expires>=localDay()).map(m=>m.title):[];}
export const newId=()=>`${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
const iso=()=>new Date().toISOString();
export function localDay(){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Rome',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());return ['year','month','day'].map(type=>parts.find(p=>p.type===type)?.value??'').join('-');}
export function initialExperience():Experience{return {v:2,versions:[],memories:[],events:[],jobs:[],feedback:[],alerts:[],preferences:{memory:true,notifications:'important',orderAccess:true,documentAccess:true,device:'desktop'},credits:0,quotaDay:localDay(),baselineSeconds:0,suppressedSources:[],transfer:null};}
export function readExperience():Experience {try{const result=schema.safeParse(JSON.parse(localStorage.getItem(EXPERIENCE_KEY)??'null'));if(result.success)return result.data;}catch{/* Defaults preserve the purchase order. */}return initialExperience();}
export type ExperienceAction=
 |{type:'preferences';patch:Partial<Experience['preferences']>}
 |{type:'snapshot';state:DemoState;label:string;kind?:'autosave'|'milestone';actor?:string;sourceEvent?:{kind:string;detail:string}}
 |{type:'start';goal:string;coverage:number;includeDocs:boolean;mode:'quick'|'deep';kind:'review'|'documents';context:string}
 |{type:'tick';now:number;state:DemoState}
 |{type:'pause'|'resume'|'retry'|'background';id:string;context?:string}
 |{type:'queue-quick';id:string}
 |{type:'start-queued';id:string}
 |{type:'save-template';id:string}
 |{type:'event';kind:string;detail:string}
 |{type:'feedback';jobId:string;rating:'useful'|'needs-work';reason:string}
 |{type:'memory-create';title:string;source:string;explicit?:boolean;orderId?:string}
 |{type:'memory-update';id:string;status:'approved'|'disabled'|'dismissed';title?:string}
 |{type:'alert';alert:Omit<Experience['alerts'][number],'status'|'at'|'until'>}
 |{type:'alert-update';id:string;status:'snoozed'|'dismissed'|'resolved'}
 |{type:'clear-history'}
 |{type:'memory-remove';id:string}
 |{type:'baseline';seconds:number}
 |{type:'import';transfer:Transfer};
export function experienceReducer(state:Experience,action:ExperienceAction):Experience {
 const record=(next:Experience,kind:string,detail:string):Experience=>({...next,events:[...next.events,{id:newId(),at:iso(),kind,detail}].slice(-300)});
 switch(action.type){
  case 'preferences':return record({...state,preferences:{...state.preferences,...action.patch}},'preference','Assistant access or preferences updated');
  case 'event':return record(state,action.kind,action.detail);
  case 'snapshot':{
   const kind=action.kind??'autosave';
   if(action.state.orderRecorded&&kind==='autosave')return state;
   const last=state.versions[state.versions.length-1];const context=documentContext(action.state);
   const same=last&&lineSignature(last.lines)===lineSignature(action.state.lines)&&last.context===context;
   if(same&&(kind==='autosave'||(last.label===action.label&&last.kind===kind)))return action.sourceEvent&&kind==='milestone'?record(state,action.sourceEvent.kind,action.sourceEvent.detail):state;
   const eventId=action.sourceEvent?newId():undefined;const at=iso();
   const saved={id:newId(),at,label:action.label,context,kind,actor:action.actor??'Buyer',eventId,detail:action.sourceEvent?.detail,lines:action.state.lines.map(line=>({...line}))};
   const versions=[...state.versions,saved];
   while(versions.length>30){const automatic=versions.findIndex((version,index)=>version.kind==='autosave'&&index<versions.length-2);versions.splice(automatic>=0?automatic:1,1);}
   return {...state,versions,events:action.sourceEvent?[...state.events,{id:eventId!,at,...action.sourceEvent}].slice(-300):state.events};
  }
  case 'start':{
   if(!action.goal.trim()||!Number.isInteger(action.coverage)||action.coverage<1||action.coverage>180||!state.preferences.orderAccess)return state;
   if(action.includeDocs&&!state.preferences.documentAccess)return state;
   const memoryValues=approvedPreferences(state);const memoryContext=JSON.stringify(memoryValues);
   const existing=state.jobs.find(j=>j.context===action.context&&j.memoryContext===memoryContext&&j.kind===action.kind&&j.goal===action.goal.trim()&&j.coverage===action.coverage&&j.includeDocs===action.includeDocs&&j.mode===action.mode&&j.status!=='stale');
   if(existing)return record(state,'reuse',`Reused task ${existing.id}; no additional resource used`);
   const day=localDay();const credits=state.quotaDay===day?state.credits:0;
   const queued=action.mode==='deep'&&credits>=5;
   const entry:Job={id:newId(),template:false,memoryValues,memoryContext,kind:action.kind,goal:action.goal.trim(),coverage:action.coverage,includeDocs:action.includeDocs,mode:action.mode,status:queued?'queued':'running',step:0,nextAt:Date.now()+850,createdAt:iso(),completedAt:null,context:action.context,error:null,retries:0,source:'order',output:[],background:false,suspended:false};
   return record({...state,jobs:[...state.jobs,entry].slice(-25),credits:credits+(action.mode==='deep'&&!queued?1:0),quotaDay:day},queued?'queued':'started',`${entry.id}: ${entry.goal}`);
  }
  case 'pause':return record({...state,jobs:state.jobs.map(j=>j.id===action.id&&j.status==='running'?{...j,status:'paused',suspended:false}:j)},'pause',action.id);
  case 'resume':case 'retry':{
   const entry=state.jobs.find(j=>j.id===action.id);if(!entry||!['paused','failed','stale'].includes(entry.status))return state;
   if(!state.preferences.orderAccess||(entry.includeDocs&&!state.preferences.documentAccess))return state;
   if(entry.retries>=3&&entry.status==='failed')return record(state,'retry-limit','Review the order manually; the automatic retry limit is reached');
   return record({...state,jobs:state.jobs.map(j=>j.id===action.id?{...j,status:'running',memoryValues:approvedPreferences(state),memoryContext:JSON.stringify(approvedPreferences(state)),context:action.context??j.context,step:action.context&&action.context!==j.context?0:j.step,nextAt:Date.now()+850,error:null,retries:j.status==='failed'?j.retries+1:j.retries,suspended:false}:j)},'resume',`Continued ${action.id} at step ${entry.step+1}`);
  }
  case 'save-template':return record({...state,jobs:state.jobs.map(j=>j.id===action.id&&j.status==='complete'?{...j,template:true}:j)},'template-saved',action.id);
  case 'background':return {...state,jobs:state.jobs.map(j=>j.id===action.id?{...j,background:true}:j)};
  case 'queue-quick':return record({...state,jobs:state.jobs.map(j=>j.id===action.id&&j.status==='queued'?{...j,status:'running',mode:'quick',includeDocs:false,kind:'review',goal:'Review order data while document analysis is queued',nextAt:Date.now()+850}:j)},'fallback',`${action.id}: continued using order data only`);
  case 'start-queued':{
   const day=localDay();const used=state.quotaDay===day?state.credits:0;
   const queued=state.jobs.find(j=>j.id===action.id&&j.status==='queued');
   if(!queued||used>=5||!state.preferences.orderAccess||(queued.includeDocs&&!state.preferences.documentAccess))return state;
   return record({...state,credits:used+1,quotaDay:day,jobs:state.jobs.map(j=>j.id===action.id?{...j,status:'running',nextAt:Date.now()+850}:j)},'started',action.id);
  }
  case 'tick':{
   let next=state;
   const jobs=state.jobs.map((j):Job=>{
    if(j.status!=='running')return j;
    const fail=(error:string):Job=>{next=record(next,'failure',`${j.id}: ${error}`);return {...j,status:'failed',error,source:j.step>=1?'documents':'order'};};
    if(j.memoryContext!==JSON.stringify(approvedPreferences(state)))return {...j,status:'stale',error:'Approved preferences changed. Start a refreshed review before using the result.'};
    if(j.context!==orderSignature(action.state))return {...j,status:'stale',error:'The order changed. Review the new context before starting another analysis.'};
    if(!state.preferences.orderAccess)return fail('Order access is disabled. Reconnect order data or return to manual review.');
    if(j.includeDocs&&j.step>=1&&!state.preferences.documentAccess)return fail('Document access is disabled. Completed checks are retained; reconnect documents to continue.');
    if(j.includeDocs&&j.kind==='documents'&&j.step>=1&&!action.state.attachments.length)return fail('No supplier document is attached. Upload it through the purchase order, then retry.');
    if(action.now<j.nextAt)return j;
    const step=Math.min(4,j.step+1);
    if(step<4)return {...j,step,nextAt:action.now+850};
    const changed=action.state.lines.filter(l=>l.qty!==l.recommended);
    const output=[`Order ${'PO-2026-0842'}: ${action.state.lines.length} SKUs reviewed for ${j.coverage}-day coverage.`,`${changed.length} quantities differ from the original recommendation. Review the selected SKU evidence before approving.`,...(j.includeDocs?[`${action.state.attachments.length} linked documents retained with this task. Document text is evidence, never permission to change the order.`]:['Order data only. Supplier documents were not read.']),...j.memoryValues.map(value=>`Approved order note: ${value}`),'This review does not approve, place or receive an order.'];
    next=record(next,'completed',j.id);
    return {...j,step:4,status:'complete',completedAt:iso(),output,error:null};
   });
   return next===state&&jobs.every((j,i)=>j===state.jobs[i])?state:{...next,jobs};
  }
  case 'feedback':{
   if(!action.reason.trim()||!state.jobs.some(j=>j.id===action.jobId&&j.status==='complete'))return state;
   return record({...state,feedback:[...state.feedback.filter(f=>f.jobId!==action.jobId),{id:newId(),jobId:action.jobId,rating:action.rating,reason:action.reason.trim(),at:iso()}].slice(-100)},'feedback',`${action.jobId}: ${action.reason}`);
  }
  case 'memory-create':{
   if(!action.title.trim()||(!action.explicit&&state.suppressedSources.includes(action.source)))return state;
   if(state.memories.some(m=>m.title===action.title.trim()&&m.status!=='dismissed'))return state;
   return record({...state,suppressedSources:state.suppressedSources.filter(source=>source!==action.source),memories:[...state.memories,{id:newId(),title:action.title.trim(),source:action.source,scope:action.orderId??ORDER_MEMORY_SCOPE,status:'candidate' as const,at:iso(),reviewedAt:null,expires:'2026-12-31'}].slice(-60)},'memory-candidate',action.title);
  }
  case 'memory-update':{
   const item=state.memories.find(m=>m.id===action.id);if(!item)return state;
   if(action.status==='approved'&&item.expires<localDay())return state;
   return record({...state,memories:state.memories.map(m=>m.id===action.id?{...m,status:action.status,title:action.title?.trim()||m.title,reviewedAt:iso()}:m)},'memory-review',`${action.id}: ${action.status}`);
  }
  case 'alert':{
   if(state.alerts.some(a=>a.id===action.alert.id))return state;
   return {...state,alerts:[...state.alerts,{...action.alert,status:'open' as const,at:iso(),until:0}].slice(-80)};
  }
  case 'alert-update':return record({...state,alerts:state.alerts.map(a=>a.id===action.id?{...a,status:action.status,until:action.status==='snoozed'?Date.now()+86400000:0}:a)},'alert-action',`${action.id}: ${action.status}`);
  case 'memory-remove':return record({...state,suppressedSources:[...new Set([...state.suppressedSources,...state.memories.filter(m=>m.id===action.id).map(m=>m.source)])],memories:state.memories.filter(m=>m.id!==action.id)},'memory-removed',action.id);
  case 'clear-history':return {...initialExperience(),credits:state.credits,quotaDay:state.quotaDay,preferences:state.preferences,suppressedSources:[...new Set([...state.suppressedSources,...state.memories.map(m=>m.source),'Purchase outcome review · PO-2026-0842'])],events:[{id:newId(),at:iso(),kind:'privacy-clear',detail:'Saved reviews, feedback, draft versions and preferences removed; purchase order retained'}]};
  case 'baseline':return Number.isFinite(action.seconds)&&action.seconds>=0&&action.seconds<=86400?record({...state,baselineSeconds:action.seconds},'baseline','Manual baseline updated'):state;
  case 'import':return record({...state,transfer:action.transfer},'handoff-import',action.transfer.sourceTask);
 }
}
