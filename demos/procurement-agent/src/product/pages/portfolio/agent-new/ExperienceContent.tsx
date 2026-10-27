import EvidenceOverview from './EvidenceOverview';
import { type DraftVersion } from './DraftVersionList';
import OrderActivityLog from './OrderActivityLog';
import SupplyRulesContent from './SupplyRulesContent';
import { usePortfolioOrder } from '../_shared/PortfolioOrderContext';
import { useId, useState } from 'react';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatBusinessDate, formatBusinessDateTime } from '@/lib/dateTime';
import TaskList from './TaskList';
import type { DemoState, DemoLine } from '../procurement-agent/portfolioDemoTypes';
import { localDay, type Experience, type ExperienceAction } from './experienceModel';

export type Panel='task'|'evidence'|'memory'|'feedback'|'alerts'|'access'|'settings'|'supplier'|'activity';
type Props={panel:Panel;order:DemoState;experience:Experience;dispatch:(action:ExperienceAction)=>void;busy:boolean;paused:boolean;onPause:()=>void;onResume:()=>void;onRestore:(lines:DemoLine[],context:string)=>void;onDeliver:(text:string)=>void;onAsk:(text:string)=>void;onOpen:(panel:Panel)=>void;onClose:()=>void;onPreviewVersion:(version:DraftVersion|null)=>void;previewVersionId?:string;};
const today=localDay;
function StateNote({children}:{children:React.ReactNode}){return <div className="agent-new-policy"><ShieldCheck size={15} aria-hidden/><div>{children}</div></div>;}
export default function ExperienceContent({panel,order,experience:x,dispatch,busy,paused,onPause,onResume,onOpen,onClose,onPreviewVersion,previewVersionId}:Props){
 const identity=usePortfolioOrder();
 const formId=useId();
 const [reason,setReason]=useState('');
 const [memoryTitle,setMemoryTitle]=useState('');
 const [editingMemory,setEditingMemory]=useState<string|null>(null);
 const [selectedJob,setSelectedJob]=useState('');
 const [deleteDraft,setDeleteDraft]=useState(false);
 const canDeleteDraft=order.planGenerated&&!order.confirmationUploaded&&!order.approved&&!order.orderRecorded&&!busy;
 const job=x.jobs.find(j=>j.id===selectedJob)??x.jobs[x.jobs.length-1];
 const successful=x.jobs.filter(j=>j.status==='complete');
 const now=Date.now();
 const canRead=x.preferences.orderAccess;
 const canReadDocs=x.preferences.documentAccess;
 const reviewMemory=()=>{dispatch({type:'memory-create',explicit:true,title:memoryTitle,source:job?.status==='complete'?`Reviewed task ${job.id}`:`Buyer note · ${identity.number}`,orderId:identity.number});setMemoryTitle('');};
 return <>
 {panel==='activity'&&<OrderActivityLog experience={x} order={order} selectedId={previewVersionId} busy={busy} onPreview={onPreviewVersion}/>}
 {panel==='supplier'&&<SupplyRulesContent/>}
 {panel==='task'&&<TaskList order={order} experience={x} paused={paused} onPause={onPause} onResume={onResume} dispatch={dispatch} onClose={onClose} onFindings={id=>{setSelectedJob(id);onOpen('feedback');}}/>}
 {panel==='evidence'&&<EvidenceOverview order={order} canRead={canRead} canReadDocs={canReadDocs} checkedAt={x.events.find(event=>event.kind==='draft-created')?.at}/>}
 {panel==='feedback'&&<>
  {successful.length?<><Label htmlFor={`${formId}-agent-new-feedback-task`}>Completed review</Label><Select id={`${formId}-agent-new-feedback-task`} ariaLabel="Completed review" value={job?.status==='complete'?job.id:successful[0].id} onValueChange={setSelectedJob} options={successful.map(j=>({value:j.id,label:j.goal}))}/>
  {(job?.status==='complete'?job:successful[0]).output.map(text=><div className="agent-new-context" key={text}>{text}</div>)}
  <Label htmlFor={`${formId}-agent-new-feedback-reason`}>What worked, or what needs changing?</Label><Select id={`${formId}-agent-new-feedback-reason`} ariaLabel="Feedback reason" value={reason} onValueChange={setReason} placeholder="Choose a reason" options={['Evidence was sufficient','A quantity needs changing','A source was missing','Supplier rule is outdated','The explanation was unclear'].map(label=>({value:label,label}))}/><div className="agent-new-sheet-actions"><Button disabled={!reason} onClick={()=>{dispatch({type:'feedback',jobId:job?.status==='complete'?job.id:successful[0].id,rating:'useful',reason});toast.success('Feedback recorded');}}>Useful</Button><Button variant="outline" disabled={!reason} onClick={()=>{dispatch({type:'feedback',jobId:job?.status==='complete'?job.id:successful[0].id,rating:'needs-work',reason});toast.success('Feedback recorded');}}>Needs work</Button></div>
  {x.feedback.map(f=><div className="agent-new-context" key={f.id}><Badge variant="outline">{f.rating}</Badge><p>{f.reason} · {formatBusinessDateTime(f.at)}</p><Button variant="outline" onClick={()=>{dispatch({type:'memory-create',explicit:true,title:f.reason,source:`Buyer feedback · task ${f.jobId}`,orderId:identity.number});onOpen('memory');}}>Add to order notes</Button></div>)}
  </>:<StateNote>Complete a review to leave feedback on its findings.</StateNote>}
 </>}
 {panel==='memory'&&<>

  <Label htmlFor={`${formId}-agent-new-memory-text`}>Add an order note</Label><Textarea id={`${formId}-agent-new-memory-text`} placeholder="Add context or a decision for this purchase order" value={memoryTitle} onChange={e=>setMemoryTitle(e.target.value)}/><Button disabled={!memoryTitle.trim()} onClick={reviewMemory}>Save candidate</Button>
  {x.memories.some(m=>m.scope===identity.number)?x.memories.filter(m=>m.scope===identity.number).map(m=><div className="agent-new-context" key={m.id}><Badge variant={m.status==='approved'?'success':m.status==='candidate'?'warning':'outline'}>{m.status}</Badge><strong>{m.title}</strong><p>Scope: {m.scope} · Source: {m.source}</p><p>Valid through {formatBusinessDate(m.expires)} · {m.reviewedAt?`Reviewed ${formatBusinessDateTime(m.reviewedAt)}`:'Awaiting buyer review'}</p><div className="agent-new-sheet-actions">{m.status==='candidate'||m.status==='disabled'?<Button size="sm" disabled={m.expires<today()} onClick={()=>dispatch({type:'memory-update',id:m.id,status:'approved'})}>Approve note</Button>:null}{m.status==='approved'&&<Button variant="outline" size="sm" onClick={()=>dispatch({type:'memory-update',id:m.id,status:'disabled'})}>Disable</Button>}{m.status!=='dismissed'&&<><Button variant="ghost" size="sm" onClick={()=>{setEditingMemory(m.id);setMemoryTitle(m.title);}}>Correct</Button><Button variant="ghost" size="sm" onClick={()=>dispatch({type:'memory-remove',id:m.id})}>Remove note</Button></>}</div>{editingMemory===m.id&&<Button variant="outline" onClick={()=>{if(memoryTitle.trim()){dispatch({type:'memory-update',id:m.id,status:'disabled',title:memoryTitle});setEditingMemory(null);setMemoryTitle('');}}}>Save correction · require review</Button>}</div>):<StateNote>No notes for this purchase order yet.</StateNote>}
 </>}
 {panel==='alerts'&&<>
  <Label htmlFor={`${formId}-agent-new-notifications`}>Order notifications</Label><Select id={`${formId}-agent-new-notifications`} ariaLabel="Order notifications" value={x.preferences.notifications} onValueChange={notifications=>dispatch({type:'preferences',patch:{notifications:notifications as typeof x.preferences.notifications}})} options={[{value:'important',label:'Important changes only'},{value:'all',label:'All order changes'},{value:'off',label:'Do not disturb'}]}/>
  <p className="agent-new-help">Updates for this purchase order.</p>
  {x.alerts.filter(a=>a.status==='open'||(a.status==='snoozed'&&a.until<=now)).length?x.alerts.filter(a=>a.status==='open'||(a.status==='snoozed'&&a.until<=now)).map(a=><div className="agent-new-context" key={a.id}><Badge variant={a.important?'warning':'outline'}>{a.kind}</Badge><h3>{a.title}</h3><p>{a.detail}</p><p>{formatBusinessDateTime(a.at)}</p><div className="agent-new-sheet-actions"><Button size="sm" variant="outline" onClick={()=>onOpen(a.target)}>Inspect evidence</Button><Button size="sm" variant="ghost" onClick={()=>dispatch({type:'alert-update',id:a.id,status:'snoozed'})}>Snooze one day</Button><Button size="sm" variant="ghost" onClick={()=>dispatch({type:'alert-update',id:a.id,status:'dismissed'})}>Dismiss update</Button></div></div>):<StateNote>No new actionable updates.</StateNote>}
  <details><summary>Handled updates ({x.alerts.filter(a=>a.status!=='open').length})</summary>{x.alerts.filter(a=>a.status!=='open').map(a=><p key={a.id}>{a.title} · {a.status}</p>)}</details>
 </>}
 {panel==='settings'&&<>
  <section className="agent-new-context"><h3>Order notes</h3><p>Context and decisions for this purchase order.</p><Button variant="outline" size="sm" onClick={()=>onOpen('memory')}>Order notes</Button></section>
  {identity.onDeleteDraft&&canDeleteDraft&&<section className="agent-new-context"><h3>Delete purchase draft</h3><p>Remove this draft from your purchase orders.</p><Button variant="destructive" size="sm" onClick={()=>setDeleteDraft(true)}>Delete draft</Button></section>}
 </>}
 {panel==='access'&&<>
  <div className="agent-new-setting"><div><strong>Read this purchase order</strong><p>SKU quantities, prices and stock used to explain this order.</p></div><Switch aria-label="Read this purchase order" checked={canRead} onCheckedChange={orderAccess=>dispatch({type:'preferences',patch:{orderAccess}})}/></div>
  <div className="agent-new-setting"><div><strong>Read attached documents</strong><p>Confirmation and DDT evidence attached to this order.</p></div><Switch aria-label="Read attached documents" checked={canReadDocs} onCheckedChange={documentAccess=>dispatch({type:'preferences',patch:{documentAccess}})}/></div>
 </>}
 <Dialog open={deleteDraft} onOpenChange={setDeleteDraft}><DialogContent><DialogHeader><DialogTitle>Delete this purchase draft?</DialogTitle><DialogDescription>{identity.number} and its draft edits will be removed. This cannot be undone.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={()=>setDeleteDraft(false)}>Cancel</Button><Button variant="destructive" disabled={!deleteDraft||!canDeleteDraft} onClick={()=>{try{identity.onDeleteDraft?.();setDeleteDraft(false);onClose();toast.success('Purchase draft deleted');}catch(error){toast.error((error as Error).message);}}}>Delete draft</Button></DialogFooter></DialogContent></Dialog>

 </>;
}
