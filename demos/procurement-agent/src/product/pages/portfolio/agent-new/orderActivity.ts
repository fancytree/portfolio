import type { DemoState } from '../procurement-agent/portfolioDemoTypes';

export const activityTitles:Record<string,string>={
 'supplier-rules-updated':'Supplier rules updated','draft-created':'Purchase draft created','products-added':'Products added','products-removed':'Products removed','draft-edited':'Draft updated',
 'attachment-added':'Document uploaded','request-exported':'Purchase request exported','order-renamed':'Order title updated','confirmation-checked':'Supplier confirmation checked','approval-requested':'Approval requested',approved:'Purchase approved',
 'approval-invalidated':'Approval cleared after changes','order-recorded':'Order recorded','receipt-confirmed':'Receipt confirmed','receiving-closed':'Receiving closed',
 'outcome-reviewed':'Purchase outcome reviewed','version-restore':'Draft version restored','edit-reason':'Change reason recorded',
 'memory-candidate':'Order note added','memory-removed':'Order note removed','agent-paused':'Agent work paused','agent-resumed':'Agent work resumed',
};
export function orderActivityChanges(before:DemoState,after:DemoState){
 const entries:Array<{kind:string;detail:string}>=[];
 if(!after.planGenerated)return entries;
 if(before.planGenerated){
  const added=after.lines.filter(line=>!before.lines.some(old=>old.sku===line.sku));const removed=before.lines.filter(line=>!after.lines.some(next=>next.sku===line.sku));
  if(added.length)entries.push({kind:'products-added',detail:`${added.length} SKU${added.length===1?'':'s'} · ${added.map(line=>line.sku).join(', ')}`});
  if(removed.length)entries.push({kind:'products-removed',detail:`${removed.length} SKU${removed.length===1?'':'s'} · ${removed.map(line=>line.sku).join(', ')}`});
  if(!added.length&&!removed.length&&!after.confirmationRounds.some(round=>!before.confirmationRounds.some(old=>old.id===round.id))){
   const changed=after.lines.filter(line=>{const old=before.lines.find(item=>item.sku===line.sku);return old&&(old.qty!==line.qty||old.plannedQty!==line.plannedQty||old.estimatedPrice!==line.estimatedPrice||old.confirmedPrice!==line.confirmedPrice);});
   if(changed.length)entries.push({kind:'draft-edited',detail:changed.map(line=>{const old=before.lines.find(item=>item.sku===line.sku)!;return old.plannedQty!==line.plannedQty?`${line.sku} · planned quantity ${old.plannedQty} → ${line.plannedQty}`:old.qty!==line.qty?`${line.sku} · confirmed quantity ${old.qty} → ${line.qty}`:`${line.sku} · unit price updated`;}).join('; ')});
  }
 }
 if(before.documentTitle!==after.documentTitle&&after.documentTitle)entries.push({kind:'order-renamed',detail:after.documentTitle});
 for(const file of after.attachments.filter(file=>file.kind!=='confirmation'&&!before.attachments.some(old=>old.id===file.id&&old.uploadedAt===file.uploadedAt)))entries.push({kind:file.kind==='supplier_request'?'request-exported':'attachment-added',detail:file.fileName});
 for(const round of after.confirmationRounds.filter(round=>!before.confirmationRounds.some(old=>old.id===round.id)))entries.push({kind:'confirmation-checked',detail:round.fileName});
 if(before.approvalDecision!==after.approvalDecision){const kind=after.approvalDecision==='approved'?'approved':after.approvalDecision==='pending'?'approval-requested':after.approvalDecision==='invalidated'?'approval-invalidated':null;if(kind)entries.push({kind,detail:''});}
 if(!before.orderRecorded&&after.orderRecorded)entries.push({kind:'order-recorded',detail:after.orderedBy??''});
 for(const batch of after.receiptBatches.filter(batch=>!before.receiptBatches.some(old=>old.id===batch.id)))entries.push({kind:'receipt-confirmed',detail:batch.label});
 if(!before.receivingComplete&&after.receivingComplete)entries.push({kind:'receiving-closed',detail:''});
 if(before.learningDecision!==after.learningDecision&&after.learningDecision&&after.learningDecision!=='pending')entries.push({kind:'outcome-reviewed',detail:after.learningDecision==='accepted'?'Outcome notes saved':'Outcome notes skipped'});
 return entries;
}
