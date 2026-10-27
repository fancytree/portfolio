import { useSupplierRules } from '../agent-new/supplierRulesStore';
import { ArrowRight, Building2, Clock3, PackageCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatBusinessDate } from '@/lib/dateTime';
import { replenishmentOpportunities, timingUrgency, type WorkspaceState } from './workspaceStore';

const money=(value:number)=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(value);
export default function SupplierOpportunities({workspace,onPrepare,limit}:{workspace:WorkspaceState;onPrepare:(opportunityId:string)=>void;limit?:number}){
 useSupplierRules();
 const available=replenishmentOpportunities(workspace);
 const opportunities=limit?available.slice(0,limit):available;
 return <section className="workspace-supplier-panel" aria-label="Suppliers to replenish">
  <header><h2>Suppliers to replenish</h2><Badge variant="secondary">{opportunities.length}</Badge></header>
  <div className="workspace-supplier-list">
   {opportunities.length?opportunities.map(opportunity=>{
    const free=opportunity.amount>=opportunity.freeShippingFrom;const minimum=opportunity.amount>=opportunity.minOrder;const timing=timingUrgency(opportunity);
    return <article className="workspace-supplier-card" key={opportunity.id} aria-label={`${opportunity.supplier} replenishment`}>
     <div className="workspace-supplier-name"><span><Building2 size={19} aria-hidden/></span><div><h3>{opportunity.supplier}</h3><p>{opportunity.supplierName}</p></div></div>
     {timing&&<div className="workspace-supplier-deadline" data-level={timing.level}><div><Clock3 size={13} aria-hidden/><strong>{timing.level==='urgent'?'Order now':`Order by ${formatBusinessDate(timing.orderBy)}`}</strong></div><p>{timing.stockDays} days of stock · {timing.leadDays}-day lead time</p></div>}
     <p className="workspace-supplier-estimate-label">Estimated goods</p><p className="workspace-supplier-estimate">{money(opportunity.amount)}</p>
     <p className="workspace-supplier-reason">{opportunity.coverage}-day sales coverage · {opportunity.skuCount} SKUs</p>
     <div className="workspace-supplier-badges"><Badge variant={free?'success':'outline'}>{free?'Free shipping':`${money(opportunity.shipping)} shipping`}</Badge>{minimum&&<Badge variant="outline">Minimum order met</Badge>}</div>
     <details><summary>Why this supplier?</summary><dl className="workspace-values"><dt>Sales coverage</dt><dd>{opportunity.coverage} days after arrival</dd><dt>Estimated goods</dt><dd>{money(opportunity.amount)}</dd><dt>Free shipping from</dt><dd>{money(opportunity.freeShippingFrom)}</dd><dt>Minimum order</dt><dd>{money(opportunity.minOrder)}</dd><dt>Typical lead time</dt><dd>{opportunity.leadDays} days</dd></dl><p>The proposed quantities cover the sales window and {free?'qualify for free shipping':'include the supplier’s shipping charge'}. Review quantities and terms before ordering.</p></details>
     <Button className="w-full" onClick={()=>onPrepare(opportunity.id)}>Create purchase order<ArrowRight size={13} aria-hidden/></Button>
    </article>;
   }):<div className="workspace-suppliers-empty"><PackageCheck size={24} aria-hidden/><h3>No suppliers to review</h3><p>Existing purchase orders remain in the list.</p></div>}
  </div>
 </section>;
}
