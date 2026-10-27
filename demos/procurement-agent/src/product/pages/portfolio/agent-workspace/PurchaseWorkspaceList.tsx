import NewPurchaseOrderForm from './NewPurchaseOrderForm';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react';
import { Bell, Bot, ClipboardList, Plus, Settings2, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogHeaderRow, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { ListTableToolbar } from '@/components/shared/ListTableToolbar';
import ListStatusTabs from '@/components/shared/ListStatusTabs';
import TablePagination from '@/components/shared/TablePagination';
import { useStickyStuck } from '@/hooks/useStickyStuck';
import { dataListStickyCol } from '@/lib/dataListTable';
import { formatBusinessDate, formatBusinessDateTime } from '@/lib/dateTime';
import { cn } from '@/lib/utils';
import PortfolioAppFrame from '../PortfolioAppFrame';
import PortfolioDemoShell from '../PortfolioDemoShell';
import { goodsTotal } from '../procurement-agent/portfolioDemoScript';
import SupplierOpportunities from './SupplierOpportunities';
import WorkspacePanels, { type WorkspacePanel } from './WorkspacePanels';
import { createPurchase, createRecommendedPurchase, purchaseUrgency, orderStatus, workspaceNotifications, startReviews, WORKSPACE_ROUTE, type PurchaseRecord, type WorkspaceState } from './workspaceStore';

const statusOptions=[{value:'all',label:'All orders'},{value:'Draft',label:'Drafts'},{value:'Needs review',label:'Needs review'},{value:'open',label:'In progress'},{value:'Received',label:'Received'}];
const euro=(value:number)=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(value);
export default function PurchaseWorkspaceList({workspace,onOpen}:{workspace:WorkspaceState;onOpen:(id:string)=>void}){
 const [status,setStatus]=useState('all');const [supplier,setSupplier]=useState('all');const [search,setSearch]=useState('');const [selected,setSelected]=useState<Set<string>>(new Set());
 const [page,setPage]=useState(1);const [pageSize,setPageSize]=useState(20);
 const [panel,setPanel]=useState<WorkspacePanel|null>(null);const [taskId,setTaskId]=useState('');
 const [create,setCreate]=useState(false);const [coverage,setCoverage]=useState('30');const [error,setError]=useState('');
 const [review,setReview]=useState(false);const [mode,setMode]=useState<'quick'|'deep'>('deep');const [docs,setDocs]=useState(false);
 const toolbar=useRef<HTMLDivElement>(null);const [top,setTop]=useState(0);const {sentinelRef,stuck}=useStickyStuck();
 useEffect(()=>{const el=toolbar.current;if(!el)return;const measure=()=>{const root=el.closest('.app-sticky-page-scroll');const pad=root?parseFloat(getComputedStyle(root).paddingTop):0;setTop(Math.max(0,el.getBoundingClientRect().height-pad));};const observer=new ResizeObserver(measure);observer.observe(el);measure();return()=>observer.disconnect();},[]);
 const rows=useMemo(()=>workspace.orders.filter(order=>{
  const value=orderStatus(order);return (supplier==='all'||order.supplier===supplier)&&(status==='all'||status===value||(status==='open'&&['Planning','Paused','Approved','Ordered','Partially received'].includes(value)))&&`${order.id} ${order.supplier}`.toLowerCase().includes(search.toLowerCase());
 }),[workspace.orders,status,search,supplier]);
 const counts={all:workspace.orders.length,Draft:workspace.orders.filter(order=>orderStatus(order)==='Draft').length,'Needs review':workspace.orders.filter(order=>orderStatus(order)==='Needs review').length,open:workspace.orders.filter(order=>['Planning','Paused','Approved','Ordered','Partially received'].includes(orderStatus(order))).length,Received:workspace.orders.filter(order=>orderStatus(order)==='Received').length};
 const totalPages=Math.max(1,Math.ceil(rows.length/pageSize));const visible=rows.slice((Math.min(page,totalPages)-1)*pageSize,Math.min(page,totalPages)*pageSize);
 const unreadNotifications=workspaceNotifications(workspace).filter(signal=>!signal.read).length;const activeTasks=workspace.sampleTasks.filter(task=>task.status!=='complete').length+workspace.tasks.filter(task=>task.status==='running'||task.status==='paused'||task.status==='queued').length+workspace.orders.reduce((sum,order)=>sum+order.state.messages.filter(message=>message.role==='status'&&message.progress?.status==='running').length,0);
 const preference=workspace.notes.find(note=>note.status==='approved'&&note.expires>=new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Rome'})&&note.coverage);
 const openCreate=()=>{setCoverage(String(preference?.coverage??30));setError('');setCreate(true);};
 const createDraft=(days:number)=>{try{const order=createPurchase(days);setCreate(false);setPanel(null);setError('');onOpen(order.id);}catch(cause){setError((cause as Error).message);setCoverage(String(days));setPanel(null);setCreate(true);}};
 const toggle=(id:string)=>setSelected(old=>{const next=new Set(old);if(next.has(id))next.delete(id);else next.add(id);return next;});
 const selectable=rows;
 const reviewable=workspace.orders.filter(order=>selected.has(order.id)&&!order.previewOnly&&order.state.planGenerated);
 const unavailable=selected.size-reviewable.length;
 const open=(id:string)=>{setPanel(null);onOpen(id);};
 const openSuggestedPlan=(opportunityId?:string)=>{try{const order=createRecommendedPurchase(opportunityId);setSearch('');setSupplier('all');setStatus('all');setPage(1);setPanel(null);if(!order.previewOnly)open(order.id);}catch(cause){setError((cause as Error).message);setPanel('controls');}};
 return <PortfolioDemoShell browserChrome={false}><PortfolioAppFrame activeLeaf="agent-demo" workspaceHref={WORKSPACE_ROUTE} contentMode="fill" hideSidebarOnMobile tabs={[{id:'workspace',label:'Purchase orders',active:true}]}>
  <div className="purchase-workspace-root"><div className="app-sticky-page-scroll purchase-workspace-scroll">
   <Card className="mb-3 shrink-0 gap-0 overflow-hidden py-0"><PurchaseWorkspaceHeader onAsk={()=>setPanel('agent')} onCreate={openCreate}/>

   </Card>
   <Card className="workspace-table-card relative flex min-w-0 flex-1 shrink-0 flex-col gap-0 overflow-visible py-0">
    <div ref={sentinelRef} className="pointer-events-none absolute top-0 h-px w-px" aria-hidden/>
    <div ref={toolbar} className={cn('sticky -top-3 z-30 bg-card',stuck?'rounded-none':'rounded-t-xl')}>
     <ListStatusTabs value={status} onValueChange={value=>{setStatus(value);setPage(1);}} options={statusOptions} counts={counts} ariaLabel="Purchase order status" className="border-b border-border px-4 [&_button]:text-sm"/>
     <ListTableToolbar searchProps={{value:search,onChange:event=>{setSearch(event.target.value);setPage(1);},placeholder:'Search order or supplier','aria-label':'Search purchase orders',className:'w-full sm:max-w-64'}} afterSearch={<><Select className="w-40 shrink-0" ariaLabel="Supplier filter" value={supplier} options={[{value:'all',label:'All suppliers'},...Array.from(new Set(workspace.orders.map(order=>order.supplier))).map(value=>({value,label:value}))]} onValueChange={value=>{setSupplier(value);setPage(1);}}/><div className="ml-auto flex items-center gap-2"><span className="workspace-caption">{selected.size?`${selected.size} selected`:''}</span><Button variant="outline" disabled={!selected.size} onClick={()=>{setError('');setMode('deep');setDocs(false);setReview(true);}}><SlidersHorizontal size={14} aria-hidden/>Check</Button></div></>}/>
    </div>
    <div className="workspace-table-region flex-1 px-4 pb-4" style={{'--def-table-sticky-top':`${top}px`} as CSSProperties}>
     <PurchaseOrderTable visible={visible} selectable={selectable} selected={selected} setSelected={setSelected} toggle={toggle} open={open} onClear={()=>{setSearch('');setStatus('all');}}/>
    </div>
    <TablePagination locale="en" page={Math.min(page,totalPages)} totalPages={totalPages} onPageChange={setPage} summary={`${rows.length} purchase orders`} pageSize={pageSize} pageSizeOptions={[20,50,100]} onPageSizeChange={size=>{setPageSize(size);setPage(1);}} className="sticky bottom-0 z-20 border-t border-border bg-card px-4 py-3"/>
   </Card>
  </div><aside className="workspace-supplier-rail"><div className="agent-new-tools workspace-side-tools" role="toolbar" aria-label="Workspace tools"><Button variant="ghost" size="sm" onClick={()=>setPanel('tasks')}><ClipboardList size={13} aria-hidden/>Task{activeTasks>0&&<Badge variant="secondary">{activeTasks}</Badge>}</Button><Button className="workspace-supplier-toggle" variant="ghost" size="sm" onClick={()=>setPanel('suppliers')}>Suppliers</Button><Button variant="ghost" size="icon-sm" aria-label={`Notifications (${unreadNotifications} unread)`} onClick={()=>setPanel('signals')}><Bell size={14} aria-hidden/>{unreadNotifications>0&&<span className="workspace-notification-dot"/>}</Button><Button variant="ghost" size="icon-sm" aria-label="Agent controls" onClick={()=>{setTaskId('');setPanel('controls');}}><Settings2 size={14} aria-hidden/></Button></div><SupplierOpportunities workspace={workspace} onPrepare={openSuggestedPlan}/></aside></div>
  <WorkspacePanels panel={panel} onPanel={setPanel} workspace={workspace} onOpen={open} onCreate={createDraft} onPrepare={openSuggestedPlan} onLocate={orderId=>{setSearch(orderId);setSupplier('all');setStatus('all');setPage(1);setPanel(null);}} onFilter={()=>{setStatus('Needs review');setPage(1);}} taskId={taskId} onTask={setTaskId}/>
  <Dialog open={create} onOpenChange={setCreate}><DialogContent className="sm:max-w-lg"><DialogHeader variant="workflow"><DialogTitle size="large">New purchase order</DialogTitle><DialogHeaderRow><DialogDescription>Choose the supplier and how many days of sales the stock should cover.</DialogDescription></DialogHeaderRow></DialogHeader><NewPurchaseOrderForm coverage={coverage} onCoverageChange={setCoverage} onCreate={createDraft} onCancel={()=>setCreate(false)} preference={preference} hasOpenOrders={workspace.orders.some(order=>order.supplier==='MNP'&&!order.state.receivingComplete)} error={error}/></DialogContent></Dialog>
  <Dialog open={review} onOpenChange={setReview}><DialogContent className="sm:max-w-lg"><DialogHeader variant="workflow" className="px-0 pt-0 pb-4"><DialogTitle size="large">Check orders</DialogTitle><DialogHeaderRow><DialogDescription>{selected.size} selected · quantities and approvals stay unchanged.</DialogDescription></DialogHeaderRow></DialogHeader>
   <div className="workspace-review-body">
    <fieldset><legend className="mb-3 text-sm font-medium">Check mode</legend><RadioGroup aria-label="Check mode" value={mode} onValueChange={value=>{setMode(value as 'quick'|'deep');if(value==='quick')setDocs(false);}} className="grid grid-cols-2 gap-3">
     <label className={cn('workspace-review-option',mode==='quick'&&'workspace-review-option-selected')}><span className="flex items-center justify-between gap-2"><strong>Quick</strong><RadioGroupItem value="quick" aria-label="Quick"/></span><span>Order data</span></label>
     <label className={cn('workspace-review-option',mode==='deep'&&'workspace-review-option-selected')}><span className="flex items-center justify-between gap-2"><strong>Deep</strong><RadioGroupItem value="deep" aria-label="Deep"/></span><span>Order data + evidence</span></label>
    </RadioGroup></fieldset>
    <div className="workspace-review-documents"><div><Label htmlFor="review-documents">Include documents</Label><p>Check attached supplier confirmations.</p></div><Switch id="review-documents" checked={docs} onCheckedChange={value=>{setDocs(value);if(value)setMode('deep');}}/></div>
    {unavailable>0&&<p className="workspace-caption" role="status">{reviewable.length} ready to check · {unavailable} unavailable. Orders without connected data or a finished plan are skipped.</p>}
    {error&&<p role="alert" className="text-sm text-destructive">{error}</p>}
   </div><DialogFooter><Button variant="outline" onClick={()=>setReview(false)}>Cancel</Button><Button disabled={!reviewable.length} onClick={()=>{try{startReviews(reviewable.map(order=>order.id),mode,docs);setReview(false);setPanel('tasks');setError('');}catch(cause){setError((cause as Error).message);}}}>Start check</Button></DialogFooter></DialogContent></Dialog>
 </PortfolioAppFrame></PortfolioDemoShell>;
}

export function PurchaseWorkspaceHeader({onAsk,onCreate}:{onAsk:()=>void;onCreate:()=>void}){return <div className="workspace-page-header"><div><p className="workspace-eyebrow">WORKSPACE</p><h1>Purchase orders</h1></div><div className="workspace-actions"><Button variant="outline" onClick={onAsk}><Bot size={15} aria-hidden/>Ask Agent</Button><Button onClick={onCreate}><Plus size={15} aria-hidden/>Purchase order</Button></div></div>;}
export function PurchaseOrderTable({visible,selectable,selected,setSelected,toggle,open,onClear}:{visible:PurchaseRecord[];selectable:PurchaseRecord[];selected:Set<string>;setSelected:Dispatch<SetStateAction<Set<string>>>;toggle:(id:string)=>void;open:(id:string)=>void;onClear:()=>void}){
 const allChecked=selectable.length>0&&selectable.every(order=>selected.has(order.id));const someChecked=selectable.some(order=>selected.has(order.id));
 return <Table scroll stickyLayout stickyLeads={2} className="po-items-table table-fixed text-sm" style={{'--sticky-lead-1-w':'4.5%','--sticky-lead-2-w':'16%'} as CSSProperties}>
      <colgroup>{[4.5,16,20,17,11,13,18.5].map((width,index)=><col key={index} style={{width:`${width}%`}}/>)}</colgroup>
      <TableHeader><TableRow><TableHead className={dataListStickyCol('lead1','px-3')}><Checkbox aria-label="Select all orders" checked={allChecked?true:someChecked?'indeterminate':false} disabled={!selectable.length} onCheckedChange={value=>setSelected(old=>{const next=new Set(old);selectable.forEach(order=>value?next.add(order.id):next.delete(order.id));return next;})}/></TableHead><TableHead className={dataListStickyCol('lead2')}>Purchase order</TableHead><TableHead>Supplier</TableHead><TableHead>Status</TableHead><TableHead align="right">Coverage</TableHead><TableHead align="right">Goods total</TableHead><TableHead>Updated</TableHead></TableRow></TableHeader>
      <TableBody>{visible.length?visible.map(order=>{const value=orderStatus(order);const urgency=purchaseUrgency(order);return <TableRow key={order.id} interactive={!order.previewOnly} onClick={()=>{if(!order.previewOnly)open(order.id);}}><TableCell className={dataListStickyCol('lead1','px-3')} onClick={event=>event.stopPropagation()}><Checkbox aria-label={`Select ${order.id}`} checked={selected.has(order.id)} onCheckedChange={()=>toggle(order.id)}/></TableCell><TableCell className={dataListStickyCol('lead2')}>{order.previewOnly?<span className="font-mono text-xs">{order.id}</span>:<button type="button" className="workspace-order-link font-mono" onClick={event=>{event.stopPropagation();open(order.id);}}>{order.id}</button>}</TableCell><TableCell><strong className="text-sm font-medium">{order.supplier}</strong><p className="workspace-caption">{order.supplierName??'MESAUDA NAIL PRO'}</p></TableCell><TableCell><Badge variant={value==='Received'?'success':value==='Needs review'?'warning':value==='Draft'?'outline':'info'}>{value}</Badge>{urgency&&<div className="workspace-draft-urgency" data-level={urgency.level}><strong>{urgency.level==='urgent'?'Order now':`Order by ${formatBusinessDate(urgency.orderBy)}`}</strong></div>}</TableCell><TableCell align="right" className="tabular-nums">{order.coverage} days</TableCell><TableCell align="right" className="font-medium tabular-nums">{order.state.planGenerated?euro(order.previewGoods??goodsTotal(order.state.lines)):'—'}</TableCell><TableCell className="text-xs text-muted-foreground">{formatBusinessDateTime(order.updatedAt)}</TableCell></TableRow>;}):<TableRow><TableCell colSpan={7}><Empty><EmptyHeader><EmptyTitle>No matching purchase orders</EmptyTitle><EmptyDescription>Try another order number, supplier or status.</EmptyDescription></EmptyHeader><Button variant="outline" onClick={onClear}>Clear filters</Button></Empty></TableCell></TableRow>}</TableBody>
     </Table>;
}
