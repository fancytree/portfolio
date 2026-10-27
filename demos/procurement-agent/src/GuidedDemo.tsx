import {useEffect,useId,useRef,useState} from 'react';
import {X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {createPurchase,updateOrderState,updateOrderExperience,updateOrderPaused,useWorkspace} from '@/pages/portfolio/agent-workspace/workspaceStore';
import {useNavigate,useSearchParams} from 'react-router-dom';
import {DemoBrowserChrome,DemoStageNavigation,type DemoNavigationStage} from './DemoPresentation';
import {demoStageState} from './demoStageState';
import DemoIntroduction from './DemoIntroduction';
import {coachGeometry} from './coachGeometry';
import type {DemoStageId} from '@/pages/portfolio/procurement-agent/portfolioDemoTypes';
import {experienceReducer,initialExperience} from '@/pages/portfolio/agent-new/experienceModel';
import AgentWorkspacePage from '@/pages/portfolio/agent-workspace/AgentWorkspacePage';

type Tip={id:string;number:number;title:string;body:string;button?:string;selector?:string;next?:boolean};
type Rect={left:number;top:number;width:number;height:number};
function visible(element:HTMLElement){const box=element.getBoundingClientRect();return !!(box.width&&box.height)&&getComputedStyle(element).visibility!=='hidden';}
function target(tip:Tip){
 if(tip.id==='complete')return document.querySelector<HTMLElement>('[data-demo-reset]');
 if(tip.id==='introduction')return document.querySelector<HTMLElement>('[data-demo-stage="orders"]');
 const app=document.querySelector('.purchase-workspace-view');if(!app)return null;
 const wanted=tip.selector?Array.from(app.querySelectorAll<HTMLElement>(tip.selector)).find(visible):Array.from(app.querySelectorAll<HTMLElement>('button')).find(element=>visible(element)&&element.textContent?.trim()===tip.button);
 if(wanted)return wanted;
 const mobile=Array.from(app.querySelectorAll<HTMLElement>('button')).find(element=>visible(element)&&element.textContent?.trim()===(tip.id==='create'?'Suppliers':tip.id==='actuals'?'Procurement Agent':'Purchase order'));
 return mobile??null;
}
export default function GuidedDemo(){
 const workspace=useWorkspace();const [params]=useSearchParams();const navigate=useNavigate();const order=workspace.orders.find(item=>item.id===params.get('order')&&!item.previewOnly);const state=order?.state;
 const [revision,setRevision]=useState(0);const [showIntroduction,setShowIntroduction]=useState(true);
 const stage:DemoNavigationStage=showIntroduction?'intake':!state?'orders':state.receivingComplete?'retrospective':state.orderRecorded?'receiving':state.confirmationUploaded?'approval':'replenishment';
 const [open,setOpen]=useState(true);const [review,setReview]=useState(0);const [rect,setRect]=useState<Rect|null>(null);const last=useRef('');
 const existingOrder=workspace.orders.find(item=>!item.previewOnly);
 let tip:Tip;
 if(showIntroduction)tip={id:'introduction',number:1,title:'Start with the purchase list',body:'Explore how the Agent and buyer share the workflow here. Open Purchase orders when you are ready to review replenishment opportunities and create a draft.'};
 else if(!state&&existingOrder)tip={id:'continue',number:1,title:'Continue this purchase',body:`Open ${existingOrder.id} to continue the ${existingOrder.supplier} purchase, or use the stage list to explore another part of the workflow. Reset starts a fresh walkthrough.`,button:existingOrder.id};
 else if(!state)tip={id:'create',number:1,title:'Start with a replenishment opportunity',body:'MNP needs stock now. Review the goods estimate and coverage, then choose Create purchase order. On a narrow screen, open Suppliers first.',selector:'.workspace-supplier-card button'};
 else if(!state.planGenerated)tip={id:'building',number:2,title:'Watch the plan take shape',body:'The canvas and Agent show the same request in progress. The editable order appears here when the plan is ready.',selector:'.agent-new-canvas'};
 else if(!state.confirmationUploaded&&review===0)tip={id:'expand',number:2,title:'Inspect the editable plan',body:'Expand the product groups. Estimated quantities stay editable in the table; there is no separate editing mode.',button:'Expand all',next:true};
 else if(!state.confirmationUploaded&&review===1)tip={id:'edit',number:3,title:'Adjust a quantity in place',body:'Try changing the first quantity from 96 to 90. The order total updates without regenerating the plan. Continue when you are ready.',selector:'.agent-new-canvas input[type="number"]',next:true};
 else if(!state.confirmationUploaded&&review===2)tip={id:'rules',number:4,title:'Check the supplier context',body:'Open Supply rules to inspect minimum order, shipping, and lead time. Close the panel when you have finished.',button:'Supply rules',next:true};
 else if(!state.confirmationUploaded)tip={id:'confirmation',number:5,title:'Compare a supplier confirmation',body:'Choose Upload confirmation to load the example document. The table and structured Agent reply show one exception of each type.',button:'Upload confirmation'};
 else if(!state.approved)tip={id:'approve',number:6,title:'Make the approval decision',body:'Review the highlighted differences, then choose Approve. The dialog offers direct approval or escalation to the owner; neither places the supplier order.',button:'Approve'};
 else if(!state.orderRecorded)tip={id:'order',number:7,title:'Record the external order',body:'Choose Mark as ordered, select an operator, and confirm the date and arrival estimate. The buyer places the supplier order outside the platform.',button:'Mark as ordered'};
 else if(state.receivingComplete){
  tip=state.learningDecision==='accepted'||state.learningDecision==='dismissed'?{id:'complete',number:12,title:'The purchase loop is complete',body:'You created, checked, approved, and received a purchase. Use Reset to start again.',selector:'[data-demo-reset]'}:state.draftInput.trim()?{id:'feedback',number:12,title:'Record your observations',body:'Edit the suggested feedback in the Agent input, then Send. Review demand, arrival timing, and any SKU-level misses before the next purchase.',selector:'.agent-new-chat textarea'}:{id:'review',number:11,title:'Reflect on the completed purchase',body:'Choose Review this order. The Agent will ask structured questions and draft a starting answer you can edit.',button:'Review this order'};
 }else if(state.awaitingRemainingDecision)tip={id:'remaining',number:10,title:'Decide what happens to the remainder',body:'Choose Handle remaining goods. Wait for another batch, update the arrival date, or close the remaining quantities. Save the decision explicitly.',button:'Handle remaining goods'};
 else if(!state.currentDdtReady)tip={id:'ddt',number:8,title:state.receiptBatches.length?'Continue with the next arrival':'Check the delivery note',body:'Choose Upload DDT. Order, DDT, and actual quantities remain distinct. The next example lets you inspect partial delivery and an unexpected gift.',button:'Upload DDT'};
 else if(state.receivingLines.some(line=>line.sku==='NEW-024'&&line.disposition==='hold'))tip={id:'gift',number:9,title:'Resolve the unexpected item',body:'The gift is held outside stock until you decide. Choose Accept NEW-024 as gift, then verify actual counts before confirming the receipt.',button:'Accept NEW-024 as gift'};
 else if(/^Warehouse counted /i.test(state.draftInput))tip={id:'actuals',number:9,title:'Record actual quantities',body:'Edit the counted quantities, then Send to update Actual.',selector:'.agent-new-chat textarea'};
 else tip={id:'receive',number:9,title:'Confirm the goods actually received',body:'Check the Actual column, then choose Confirm receipt. Only the confirmed receipt moves the order forward; open quantities remain visible.',button:'Confirm receipt'};
 const running=state?.messages.some(message=>message.role==='status'&&message.progress?.status==='running');
 if(running&&!showIntroduction)tip={...tip,id:`working-${tip.number}`,title:'The Agent is checking this step',body:'Wait for the current check to finish. Progress stays in the conversation; Pause and Resume are available in the input area. The guide will point to the next action when it is ready.',selector:'.agent-new-chat',button:undefined,next:false};
 const concise:Record<string,[string,string]>={
 introduction:['Start here','Open Purchase orders to begin the walkthrough.'],
 continue:['Continue this order','Open your purchase order to continue. Reset starts a fresh story.'],
 create:['Create purchase order','Review MNP’s recommendation, then create the draft.'],
 building:['Preparing the plan','Wait for the editable draft.'],
 expand:['Review the plan','Expand a product to inspect its SKUs.'],
 edit:['Edit a quantity','Try 96 → 90. The total updates in place.'],
 rules:['Supply rules','Check minimum order, shipping, and lead time.'],
 confirmation:['Upload confirmation','Compare quantities, prices, and missing items.'],
 approve:['Approve','Review the differences, then approve directly or send to the owner.'],
 order:['Mark as ordered','Order externally, then record the operator and expected arrival.'],
 ddt:['Upload DDT','Match this delivery note against the purchase order.'],
 actuals:['Record actual quantities','Edit the counted quantities, then Send to update Actual.'],
 gift:['Resolve the gift','Accept or return NEW-024 before confirming the receipt.'],
 receive:['Confirm receipt','Check Actual quantities, then confirm this batch.'],
 remaining:['Handle remaining goods','Choose how to handle the open quantities, then save.'],
 review:['Review this order','Review demand and arrival timing with the Agent.'],
 feedback:['Share your observations','Edit the suggested answer, then Send.'],
 complete:['Review recorded','Use Reset to run the purchase story again.'],
 };
 if(concise[tip.id])tip={...tip,title:concise[tip.id][0],body:concise[tip.id][1]};
 const cardRef=useRef<HTMLElement>(null);const [cardHeight,setCardHeight]=useState(124);const arrowId=useId().replace(/:/g,'');
 const guideReady=showIntroduction||(!running&&(!state||state.planGenerated));
 const baseline=useRef<string|null>(null);
 const lineValues=JSON.stringify(state?.lines.map(line=>[line.sku,line.qty,line.estimatedPrice])??[]);
 useEffect(()=>{if(!state?.planGenerated)return;if(baseline.current===null)baseline.current=lineValues;else if(review===1&&lineValues!==baseline.current)setReview(2);},[state?.planGenerated,lineValues,review]);
 const tipKey=tip.id;const disabledByQuery=new URLSearchParams(window.location.search).get('guide')==='off';
 useEffect(()=>{
  if(disabledByQuery||!open||!guideReady){setRect(null);return;}
  const tick=()=>{
   if(document.querySelector('[role="dialog"]')){setRect(null);return;}
   const element=target(tip);if(!element){setRect(null);return;}
   if(last.current!==tipKey){element.scrollIntoView({block:'nearest',inline:'nearest'});last.current=tipKey;}
   const box=element.getBoundingClientRect();const next={left:box.left,top:box.top,width:box.width,height:box.height};
   setRect(previous=>previous&&Object.keys(next).every(key=>previous[key as keyof Rect]===next[key as keyof Rect])?previous:next);
  };
  tick();const timer=window.setInterval(tick,160);window.addEventListener('resize',tick);return()=>{window.clearInterval(timer);window.removeEventListener('resize',tick);};
 // The tip is a presentation of the current store state, not another workflow state machine.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[tipKey,open,disabledByQuery,guideReady]);
 useEffect(()=>{
  const element=cardRef.current;if(!element)return;let active=true;
  const measure=()=>{if(!active||!element.isConnected)return;const height=element.getBoundingClientRect().height;if(height>0)setCardHeight(old=>old===height?old:height);};
  const observer=new ResizeObserver(measure);observer.observe(element);measure();
  return()=>{active=false;observer.disconnect();};
 },[tipKey,open,!!rect]);
 const selectStage=(next:DemoNavigationStage)=>{
  if(next===stage)return;
  if(next==='intake'){setShowIntroduction(true);navigate('/portfolio/agent-workspace');return;}
  setShowIntroduction(false);if(next==='orders'){navigate('/portfolio/agent-workspace');return;}
  const entry=(order?.supplier==='MNP'?order:workspace.orders.find(item=>!item.previewOnly&&item.supplier==='MNP'))??createPurchase(30);
  const nextState=demoStageState(next);
  updateOrderState(entry.id,nextState);updateOrderPaused(entry.id,false);
  updateOrderExperience(entry.id,nextState.planGenerated?experienceReducer(initialExperience(),{type:'snapshot',state:nextState,label:'Initial plan',kind:'milestone',actor:'Agent'}):initialExperience());
  baseline.current=null;last.current='';setReview(0);setRevision(value=>value+1);setOpen(true);
  navigate('/portfolio/agent-workspace?order='+entry.id);
 };
 const advance=()=>setReview(value=>Math.min(3,value+1));
 const interactions=(event:React.MouseEvent)=>{
  const button=(event.target as HTMLElement).closest('button');const text=button?.textContent?.trim();
  if(text==='Expand all'&&review===0)window.setTimeout(()=>setReview(1),0);
  if(text==='Supply rules'&&review===2)window.setTimeout(()=>setReview(3),0);
 };
 const geometry=rect?coachGeometry(rect,{width:window.innerWidth,height:window.innerHeight},{height:cardHeight}):null;
 return <><div className="standalone-demo flex h-dvh min-h-0 flex-col overflow-hidden bg-background text-foreground"><DemoBrowserChrome guideOpen={open&&!disabledByQuery} onToggleGuide={()=>setOpen(value=>!value)}/><div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row"><DemoStageNavigation stage={stage} onSelect={selectStage} onReset={()=>window.location.reload()}/><div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden" onClickCapture={interactions}><div className={showIntroduction?'flex min-h-0 min-w-0 flex-1 overflow-hidden':'hidden'}><DemoIntroduction onGoStage={next=>selectStage(next==='intake'?'orders':next)}/></div><div className={showIntroduction?'hidden':'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden'}><AgentWorkspacePage key={revision}/></div></div></div></div>
 {!disabledByQuery&&<>

  {open&&rect&&<div className="pointer-events-none fixed inset-0 z-[60]" aria-label="Guided purchase workflow">
   <svg className="absolute inset-0 size-full overflow-visible" aria-hidden="true"><defs><marker id={arrowId} markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M 0 0 L 9 4.5 L 0 9 z" fill="var(--primary)"/></marker></defs><rect x={rect.left-5} y={rect.top-5} width={rect.width+10} height={rect.height+10} rx={12} fill="none" stroke="var(--primary)" strokeWidth={2} strokeDasharray="5 4"/><path data-demo-guide-arrow d={geometry?.path} stroke="var(--primary)" strokeWidth={2} strokeLinecap="round" fill="none" markerEnd={`url(#${arrowId})`}/></svg>
   <section ref={cardRef} role="region" aria-label="Demo guide" className="pointer-events-auto absolute rounded-2xl border border-border bg-card p-4 text-foreground shadow-lg" style={{left:geometry?.left,top:geometry?.top,width:geometry?.width}}>
    <Button variant="ghost" size="icon-sm" className="absolute right-2 top-2" aria-label="Close guide" onClick={()=>setOpen(false)}><X size={14} aria-hidden/></Button>
    <h2 className="pr-5 text-sm font-semibold">{tip.title}</h2><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{tip.body}</p>
    {tip.next&&<div className="mt-3 flex justify-end"><Button size="sm" onClick={advance}>Next</Button></div>}
   </section>
  </div>}
 </>}
 </>;
}
