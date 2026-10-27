import { FileText } from 'lucide-react';
import { usePortfolioOrder } from '../_shared/PortfolioOrderContext';
import { MNP_SUPPLIER_RULES } from '../procurement-agent/portfolioDemoScript';
import type { DemoState } from '../procurement-agent/portfolioDemoTypes';
import { formatBusinessDateTime } from '@/lib/dateTime';

export default function EvidenceOverview({order,canRead,canReadDocs,checkedAt,compact=false}:{order:DemoState;canRead:boolean;canReadDocs:boolean;checkedAt?:string;compact?:boolean}){
 const rules=usePortfolioOrder().supplierRules??MNP_SUPPLIER_RULES;
 const documents=order.attachments.filter(file=>!['supplier_request','replenishment_plan'].includes(file.kind));
 const sources=[{title:'Sales history',detail:'Sales over the last 30 days, used to estimate daily demand.'},{title:'Inventory snapshot',detail:'Available stock for the products included in this plan.'},{title:'Supplier rules',detail:`Lead time, minimum order, shipping and payment terms · ${rules.version}.`},{title:'Purchase request',detail:`${order.intakeDraft?.coverageDays??30}-day sales coverage after arrival.`}];
 return <div className="agent-new-evidence-overview">
  <p className="text-muted-foreground">Data consulted for this purchase plan{checkedAt?` · ${formatBusinessDateTime(checkedAt)}`:''}.</p>
  {canRead?(compact?sources.slice(0,3):sources).map(source=><section className="agent-new-context" key={source.title}><h3>{source.title}</h3><p>{source.detail}</p></section>):<p>Order data is unavailable.</p>}
  {!compact&&<section><h3>Documents linked to this order</h3>{!canReadDocs?<p>Attached-document data is unavailable.</p>:documents.length?<><p>{documents.length} document{documents.length===1?'':'s'} linked.</p>{(['confirmation','ddt','invoice','other'] as const).map(kind=>{const files=documents.filter(file=>file.kind===kind);if(!files.length)return null;return <div className="agent-new-document" key={kind}><FileText size={15} aria-hidden/><div><strong>{kind==='confirmation'?'Supplier confirmation':kind==='ddt'?'Delivery notes':kind==='invoice'?'Invoice references':'Other documents'} · {files.length}</strong><p>{kind==='confirmation'?'Quantity and price comparison.':kind==='ddt'?'Ordered, delivered and counted quantities.':kind==='invoice'?'Linked invoice references; no invoice-body analysis.':'Linked purchasing information.'}</p></div></div>;})}</>:<p>No supplier documents checked yet.</p>}</section>}
 </div>;
}
