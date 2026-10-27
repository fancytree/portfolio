import {useEffect,useReducer,useState,type ReactNode} from 'react';
import {Bot,X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Checkbox} from '@/components/ui/checkbox';
import {Dialog,DialogHeader,DialogHeaderRow,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {BASE_LINES,goodsTotal,jumpToStage} from '../procurement-agent/portfolioDemoScript';
import {planLinesForCoverage} from '../agent-new/planFixture';
import {documentContext,experienceReducer,initialExperience,lineSignature,restoreLines} from '../agent-new/experienceModel';
import OrderActivityLog from '../agent-new/OrderActivityLog';
import type {DraftVersion} from '../agent-new/DraftVersionList';
import EvidenceOverview from '../agent-new/EvidenceOverview';
import SupplyRulesContent from '../agent-new/SupplyRulesContent';
import InlineAgent from './InlineAgent';
import {PortfolioMessageBubble} from '../procurement-agent/PortfolioAgentPanel';
import type {DemoChatMessage} from '../procurement-agent/portfolioDemoTypes';
import {businessReplyResult} from '../agent-new/agentReplyPresentation';
import InlineWorkspace,{useDesignWorkspace} from './InlineWorkspace';
import NewPurchaseOrderForm from '../agent-workspace/NewPurchaseOrderForm';
import SupplierOpportunities from '../agent-workspace/SupplierOpportunities';
import {PurchaseWorkspaceHeader} from '../agent-workspace/PurchaseWorkspaceList';
import {Card} from '@/components/ui/card';
import {SearchInput} from '@/components/shared/SearchInput';
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from '@/components/ui/table';
import {Plus} from 'lucide-react';
import {AgentTools} from '../agent-new/EnhancedAgentPanel';
import DraftPreviewBanner from '../agent-new/DraftPreviewBanner';
import {replenishmentOpportunities,orderStatus} from '../agent-workspace/workspaceStore';
import {EstQtyCell,EstPriceCell,ActionLinks,ApproveChoiceDialog} from '../procurement-agent/PortfolioMainCanvas';
import {PortfolioOrderContext} from '../_shared/PortfolioOrderContext';
import ExperienceContent,{type Panel as ExperiencePanel} from '../agent-new/ExperienceContent';
import StructuredAgentMessage,{confirmationResult} from '../agent-new/StructuredAgentMessage';
import {applyFocusedConfirmation} from '../agent-new/focusedFixtures';
import '../agent-new/agent-new.css';
const money=(value:number)=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(value);
function Panel({title,children}:{title?:string;children:ReactNode}){return <div className="ux-demo-panel">{title&&<h4>{title}</h4>}{children}</div>;}
function Heading({title='Procurement agent',status}:{title?:string;status?:string}){return <div className="ux-mini-heading"><span><Bot size={16} aria-hidden/><strong>{title}</strong></span>{status&&<span>{status}</span>}</div>;}
function Values({rows}:{rows:Array<[string,ReactNode]>}){return <dl className="ux-mini-values">{rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;}

function InlineSheet({title,children,description="PO-2026-0842 · MNP · 30-day coverage",workflow=false,onClose}:{title:string;children:ReactNode;description?:string;workflow?:boolean;onClose?:()=>void}){
 const body=<div className="agent-new-sheet-body">{children}</div>;
 if(workflow)return <Dialog open={false}><div className="ux-inline-sheet"><DialogHeader variant="workflow"><DialogTitle size="large">{title}</DialogTitle><DialogHeaderRow><DialogDescription>{description}</DialogDescription></DialogHeaderRow></DialogHeader>{body}</div></Dialog>;
 return <div className="ux-inline-sheet"><header><h4>{title}</h4><p>{description}</p>{onClose&&<Button variant="ghost" size="icon-sm" className="absolute right-3 top-3" aria-label="Close" onClick={onClose}><X size={14} aria-hidden/></Button>}</header>{body}</div>;
}

function CreatePlan(){
 const [coverage,setCoverage]=useState('30');const [created,setCreated]=useState<number|null>(null);
 if(created)return <><Heading status="ready"/><Panel title="Purchase draft ready"><Badge variant="outline">Draft</Badge><Values rows={[["Supplier","MNP · MESAUDA NAIL PRO"],["Sales coverage",`${created} days after arrival`],["Products","13 SKUs"],["Goods total",money(goodsTotal(planLinesForCoverage(created)))]]}/></Panel></>;
 return <InlineSheet workflow title="New purchase order" description="Choose the supplier and how many days of sales the stock should cover."><NewPurchaseOrderForm coverage={coverage} onCoverageChange={setCoverage} onCreate={days=>{if(Number.isInteger(days)&&days>=1&&days<=180)setCreated(days);}} onCancel={()=>setCoverage('30')}/></InlineSheet>;
}
function Entry(){
 const [view,setView]=useState('list');const {workspace}=useDesignWorkspace();
 if(view==='create')return <CreatePlan/>;if(view==='chat')return <InlineWorkspace initial="agent"/>;
 return <><Card className="shrink-0 gap-0 overflow-hidden py-0"><PurchaseWorkspaceHeader onAsk={()=>setView('chat')} onCreate={()=>setView('create')}/></Card><Table><TableHeader><TableRow><TableHead>Purchase order</TableHead><TableHead>Supplier</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody className="bg-card">{workspace.orders.slice(0,2).map(order=><TableRow key={order.id}><TableCell className="font-mono text-xs">{order.id}</TableCell><TableCell>{order.supplier}</TableCell><TableCell><Badge variant={orderStatus(order)==='Needs review'?'warning':'info'}>{orderStatus(order)}</Badge></TableCell></TableRow>)}</TableBody></Table></>;
}

function Replenishment(){
 const {workspace,setWorkspace}=useDesignWorkspace();const [created,setCreated]=useState('');
 if(created)return <Panel title="Purchase draft created"><Badge variant="outline">Draft</Badge><Values rows={[["Supplier",created],["Coverage","30 days after arrival"]]}/></Panel>;
 return <><SupplierOpportunities limit={1} workspace={workspace} onPrepare={id=>{const opportunity=replenishmentOpportunities(workspace).find(item=>item.id===id);if(!opportunity)return;setCreated(opportunity.supplier);setWorkspace(value=>({...value,orders:[...value.orders,{id:'PO-2026-0842',supplier:opportunity.supplier,coverage:opportunity.coverage,updatedAt:new Date().toISOString(),state:jumpToStage('replenishment'),experience:initialExperience(),timing:{sourceId:opportunity.id,stockDays:opportunity.stockDays,leadDays:opportunity.leadDays,snapshotDate:opportunity.snapshotDate}}]}));}}/>{created&&<div className="workspace-plan-summary" role="status">{created} · Purchase draft created</div>}</>;
}
function Progress(){
 const [step,setStep]=useState(-1);const [running,setRunning]=useState(false);const [paused,setPaused]=useState(false);const [text,setText]=useState('Plan MNP for the next 30 days');
 const phases=['understand','validate','calculate','explain'] as const;
 useEffect(()=>{if(!running)return;const timer=window.setTimeout(()=>{if(step>=3){setStep(4);setRunning(false);}else setStep(value=>value+1);},850);return()=>window.clearTimeout(timer);},[step,running]);
 const messages:DemoChatMessage[]=step<0?[{id:'welcome',role:'agent',text:'Welcome. I can help you plan purchases and check supplier documents.'}]:[{id:'request',role:'user',text:'Plan MNP for the next 30 days'},{id:'progress',role:'status',text:'Preparing purchase plan',mode:'plan',progress:{status:step===4?'complete':'running',current:step===4?null:phases[Math.max(0,step)],completed:phases.slice(0,Math.max(0,step))}},...(step===4?[{id:'ready',role:'agent' as const,text:'Your purchase plan is ready. Review quantities in the table, then export the request when ready.'}]:[])];
 return <InlineAgent messages={messages} draftInput={text} busy={running||paused} onDraftInputChange={setText} onSend={()=>{setStep(0);setRunning(true);setPaused(false);setText('');}} composerControl={running||paused?{state:paused?'resume':'pause',onClick:()=>{setRunning(paused);setPaused(!paused);}}:undefined}/>;
}
function Approval(){
 const [choice,setChoice]=useState(false);const [status,setStatus]=useState('review');const order=applyFocusedConfirmation(jumpToStage('replenishment'));
 return <><div className="flex items-center justify-between gap-2"><Badge variant={status==='approved'?'success':status==='owner'?'info':'warning'}>{status==='approved'?'Approved':status==='owner'?'Awaiting Owner approval':'Needs review'}</Badge><Button onClick={()=>setChoice(true)} disabled={status!=='review'}>Approve</Button></div><div className="ux-message-card"><PortfolioMessageBubble hasStructure><StructuredAgentMessage message={{id:'confirmation',role:'agent',text:'Supplier confirmation checked.',result:confirmationResult(order,'26VOM002922.pdf',false)}}/></PortfolioMessageBubble></div><ApproveChoiceDialog open={choice} onOpenChange={setChoice} onApproveDirect={()=>setStatus('approved')} onPushToOwner={()=>setStatus('owner')}/></>;
}
function Tasks(){return <InlineWorkspace initial="tasks"/>;}
function Recovery(){
 const [state,setState]=useState(()=>{const original=jumpToStage('replenishment');const order={...original,lines:original.lines.map((line,index)=>index===0?{...line,qty:90,plannedQty:90}:line)};let experience=experienceReducer(initialExperience(),{type:'snapshot',state:original,label:'Initial plan',kind:'milestone',actor:'Agent'});experience=experienceReducer(experience,{type:'snapshot',state:order,label:'Autosaved changes',kind:'autosave',actor:'Buyer'});return {order,experience};});const [preview,setPreview]=useState<DraftVersion|null>(null);
 const apply=()=>{if(!preview)return;if(lineSignature(preview.lines)!==lineSignature(state.order.lines)){const order=restoreLines(state.order,preview.lines,preview.context);setState(value=>({order,experience:experienceReducer(value.experience,{type:'snapshot',state:order,label:'Draft restored',kind:'milestone',actor:'Buyer'})}));}setPreview(null);};
 return <div className="ux-history-fragment">{preview&&<DraftPreviewBanner version={preview} order={state.order} canApply={preview.context===documentContext(state.order)} onBack={()=>setPreview(null)} onApply={apply}/>}<div className="agent-new-version-panel"><header><h3>Activity log</h3></header><div className="agent-new-version-scroll"><OrderActivityLog experience={state.experience} order={state.order} selectedId={preview?.id} onPreview={setPreview} busy={false}/></div></div></div>;
}
function Evidence({initial=null}:{initial?:ExperiencePanel|null}){
 const [panel,setPanel]=useState<ExperiencePanel|null>(initial);const [text,setText]=useState('');
 return <div className="ux-tools-fragment"><AgentTools onOpen={setPanel}/>{panel==='evidence'?<InlineSheet title="Evidence for this order" onClose={()=>setPanel(null)}><EvidenceOverview compact order={jumpToStage('replenishment')} canRead canReadDocs/></InlineSheet>:panel==='supplier'?<InlineSheet title="Supply rules" description="MNP · Supplier information" onClose={()=>setPanel(null)}><SupplyRulesContent compact/></InlineSheet>:panel==='activity'?<Recovery/>:panel==='settings'?<OrderManagement initial="settings"/>:<InlineAgent messages={[{id:'ready',role:'agent',text:'Your purchase plan is ready. Review quantities in the table, then export the request when ready.'}]} draftInput={text} onDraftInputChange={setText} onSend={()=>setText('')}/>}</div>;
}
function EditableTable(){
 const [lines,setLines]=useState(()=>BASE_LINES.slice(0,2).map(line=>({...line})));const [query,setQuery]=useState('');const [why,setWhy]=useState('');
 const quantity=(sku:string,qty:number)=>setLines(old=>old.map(line=>line.sku===sku?{...line,qty,plannedQty:qty}:line));const price=(sku:string,estimatedPrice:number)=>setLines(old=>old.map(line=>line.sku===sku?{...line,estimatedPrice}:line));
 return <PortfolioOrderContext.Provider value={{number:'PO-2026-0842',supplierRulesInPanel:true}}><div className="ux-mini-stack"><div className="ux-mini-search"><SearchInput aria-label="Search products" className="w-60 min-w-0 flex-1" placeholder="Search product or SKU" value={query} onChange={event=>setQuery(event.target.value)}/><Button variant="outline" size="lg" type="button"><Plus size={14} aria-hidden/>Add product</Button></div><Table><TableHeader><TableRow><TableHead>SKU</TableHead><TableHead>Est. qty</TableHead><TableHead className="hidden sm:table-cell">Est. price</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody className="bg-card">{lines.filter(line=>`${line.sku} ${line.name}`.toLowerCase().includes(query.toLowerCase())).map(line=><TableRow key={line.sku}><TableCell className="font-mono text-xs">{line.sku}</TableCell><TableCell><EstQtyCell line={line} editable onUpdateEstQty={quantity}/></TableCell><TableCell className="hidden sm:table-cell"><EstPriceCell line={line} editable onUpdateEstPrice={price}/></TableCell><ActionLinks stickyBg="bg-card" onDelete={()=>setLines(old=>old.filter(item=>item.sku!==line.sku))} onWhy={()=>setWhy(line.sku)}/></TableRow>)}</TableBody></Table><div className="flex items-center justify-between border-t border-border pt-3"><span className="text-xs text-muted-foreground">{lines.length} SKUs</span><strong>Total {money(goodsTotal(lines))}</strong></div>{why&&<div className="workspace-plan-summary">{why} · Sales, available stock and lead time inform this quantity.</div>}</div></PortfolioOrderContext.Provider>;
}
function OrderManagement({initial}:{initial:'memory'|'settings'}){
 const [experience,dispatch]=useReducer(experienceReducer,undefined,initialExperience);const [panel,setPanel]=useState<ExperiencePanel>(initial);const [deleted,setDeleted]=useState(false);
 if(deleted)return <Panel title="Purchase draft deleted">PO-2026-0842</Panel>;
 return <PortfolioOrderContext.Provider value={{number:'PO-2026-0842',onDeleteDraft:()=>setDeleted(true)}}><InlineSheet title={panel==='memory'?'Order notes':'Order settings'}><ExperienceContent panel={panel} order={jumpToStage('replenishment')} experience={experience} dispatch={dispatch} busy={false} paused={false} onPause={()=>{}} onResume={()=>{}} onRestore={()=>{}} onDeliver={()=>{}} onAsk={()=>{}} onOpen={setPanel} onClose={()=>{}} onPreviewVersion={()=>{}}/></InlineSheet></PortfolioOrderContext.Provider>;
}
function Notes(){return <OrderManagement initial="memory"/>;}
function Notifications(){return <InlineWorkspace initial="signals"/>;}
function OrderSettings(){return <OrderManagement initial="settings"/>;}
function Context(){return <Evidence initial="evidence"/>;}
function Tone(){
 const [intent,setIntent]=useState('Order');const labels:Record<string,string>={Order:'Recording external order…',Review:'Checking forecast signals…',Terms:'Checking supplier rules…'};const order={...jumpToStage('replenishment'),orderAt:'2026-10-26T10:30:00',orderedBy:'River',expectedArrival:'2026-11-09'};
 return <><div className="ux-actions">{Object.keys(labels).map(value=><Button key={value} size="sm" variant={intent===value?'default':'outline'} onClick={()=>setIntent(value)}>{value}</Button>)}</div><div className="ux-message-card"><PortfolioMessageBubble hasStructure><StructuredAgentMessage message={{id:`tone-${intent}`,role:'agent',text:intent==='Order'?'Order recorded.':intent==='Review'?'Review this purchase before the next buy.':'MNP supply terms.',result:businessReplyResult('',[],order,labels[intent])}}/></PortfolioMessageBubble></div></>;
}
function Attachments(){
 const [text,setText]=useState('');const [attached,setAttached]=useState('');
 return <><InlineAgent composerOnly messages={[]} draftInput={text} onDraftInputChange={setText} onSend={()=>setText('')} onAttachFile={file=>setAttached(file.name)}/>{attached&&<p className="workspace-caption" role="status">Attachment added · {attached}</p>}</>;
}
function Schedule(){return <InlineWorkspace initial="controls"/>;}
function Metrics(){
 const [selected,setSelected]=useState('Plan');const [checked,setChecked]=useState<string[]>([]);const criteria:Record<string,string[]>={Plan:['Supplier and coverage are clear','Plan can be checked in the table','Next action is easy to find'],Confirmation:['Price and quantity differences are visible','Sources can be checked','Approval is an explicit action'],Recovery:['Current draft is preserved','History can be previewed','Apply returns to an editable draft']};
 return <><Heading title="Experience review"/><div className="ux-actions">{Object.keys(criteria).map(value=><Button key={value} size="sm" variant={selected===value?'default':'outline'} onClick={()=>{setSelected(value);setChecked([]);}}>{value}</Button>)}</div><Panel>{criteria[selected].map(label=><label className="ux-mini-check" key={label}><Checkbox aria-label={label} checked={checked.includes(label)} onCheckedChange={value=>setChecked(old=>value?[...old,label]:old.filter(item=>item!==label))}/><span>{label}</span></label>)}</Panel><Badge variant={checked.length===3?'success':'outline'}>{checked.length} / 3 checkpoints reviewed</Badge></>;
}
export default function DesignInteractions({id}:{id:string}){
 switch(id){case '01':return <Entry/>;case '02':return <CreatePlan/>;case '03':return <Replenishment/>;case '04':return <Progress/>;case '05':return <Approval/>;case '06':return <Tasks/>;case '07':return <Recovery/>;case '08':return <Evidence/>;case '09':return <EditableTable/>;case '10':return <Notes/>;case '11':return <InlineSheet title="Supply rules" description="MNP · Supplier information"><SupplyRulesContent compact/></InlineSheet>;case '12':return <Notifications/>;case 'A':return <OrderSettings/>;case 'B':return <Context/>;case 'C':return <Tone/>;case 'D':return <Attachments/>;case 'E':return <Schedule/>;default:return <Metrics/>;}
}
