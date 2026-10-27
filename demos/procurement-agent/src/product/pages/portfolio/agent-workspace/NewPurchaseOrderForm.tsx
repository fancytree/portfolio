import {useId} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select} from '@/components/ui/select';
import {DialogFooter} from '@/components/ui/dialog';
export default function NewPurchaseOrderForm({coverage,onCoverageChange,onCreate,onCancel,preference,hasOpenOrders=false,error}:{coverage:string;onCoverageChange:(value:string)=>void;onCreate:(days:number)=>void;onCancel:()=>void;preference?:{coverage?:number;title:string};hasOpenOrders?:boolean;error?:string}){
 const id=useId();
 return <form onSubmit={event=>{event.preventDefault();onCreate(Number(coverage));}} className="workspace-form"><div><Label htmlFor={`${id}-supplier`}>Supplier</Label><Select id={`${id}-supplier`} ariaLabel="Supplier" value="MNP" options={[{value:'MNP',label:'MNP · MESAUDA NAIL PRO'}]} onValueChange={()=>{}}/></div><div><Label htmlFor={`${id}-coverage`}>Sales coverage (days)</Label><Input id={`${id}-coverage`} type="number" min={1} max={180} value={coverage} onChange={event=>onCoverageChange(event.target.value)}/><p className="workspace-caption mt-2">Coverage starts after arrival. This is not the delivery lead time.</p></div>{preference&&<p className="workspace-caption">Approved supplier default: {preference.coverage} days · {preference.title}</p>}<div className="workspace-plan-summary"><strong>What happens next</strong><p>Read sales, available stock and supplier rules, then prepare an editable draft. You review the quantities before ordering.</p></div>{hasOpenOrders&&<p className="workspace-caption">MNP already has open purchase orders. Check them before placing an additional order.</p>}{error&&<p role="alert" className="text-sm text-destructive">{error}</p>}<DialogFooter><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit" disabled={!coverage}>Create purchase plan</Button></DialogFooter></form>;
}
