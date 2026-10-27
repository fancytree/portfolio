import { Building2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBusinessDate } from '@/lib/dateTime';
import { useSupplierRules } from './supplierRulesStore';
const money=(amount:number)=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(amount);
export default function SupplyRulesContent({compact=false}:{compact?:boolean}){
 const rules=useSupplierRules();
 const groups:Array<{title:string;rows:Array<[string,string]>}>=[
  {title:'Supplier information',rows:[['Supplier',rules.name],['Contact',rules.contact],['Website',rules.website],['Country',rules.country],['Document language',rules.language]]},
  {title:'Ordering & delivery',rows:[['Minimum order',money(rules.minOrderValue)],['Free shipping from',money(rules.freeShippingThreshold)],['Shipping below threshold',money(rules.defaultShippingFee)],['Typical lead time',`${rules.leadTimeMedianDays} days`],['P90 lead time',`${rules.leadTimeP90Days} days`]]},
  {title:'Payment & discounts',rows:[['Payment method',rules.paymentMethod],['Payment terms',rules.paymentDays===0?'Prepaid':`${rules.paymentDays} days`],['Early payment',`${rules.earlyPaymentDiscountRate*100}% within ${rules.earlyPaymentDays} days`],['Volume discount',rules.volumeDiscount]]},
 ];
 return <div className="agent-new-supply-rules">
  {(compact?groups.slice(0,2).map(group=>({...group,rows:group.rows.filter(([label])=>['Supplier','Contact','Minimum order','Free shipping from','Typical lead time'].includes(label))})):groups).map(group=><section key={group.title}><h3>{group.title}</h3><dl>{group.rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>)}
  {!compact&&<section><h3>Source</h3><p>{rules.source} · {rules.version}</p><p>Valid through {formatBusinessDate(rules.validUntil)}</p></section>}
  <footer className="flex flex-wrap gap-2 border-t border-border bg-card pt-4">
   <Button type="button" variant="outline" size="sm"><Building2 size={14} aria-hidden/>Edit supplier details</Button>
   <Button type="button" size="sm"><MessageSquare size={14} aria-hidden/>Edit in chat</Button>
  </footer>
 </div>;
}
