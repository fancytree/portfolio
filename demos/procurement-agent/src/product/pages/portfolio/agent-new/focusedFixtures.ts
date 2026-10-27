import type { DemoState, DemoLine } from '../procurement-agent/portfolioDemoTypes';
import { applyConfirmationUpload, applyCurrentBatchDdt } from '../procurement-agent/portfolioDemoScript';

/** One independent example per discrepancy; unchanged rows remain genuinely equal. */
export function focusedConfirmationLines(state:DemoState):DemoLine[] {
 return state.lines.map(line=>{
  const normal:DemoLine={...line,qty:line.plannedQty,confirmedPrice:line.estimatedPrice,risk:null};
  if(line.plannedQty<=0)return normal;
  if(line.sku==='370102')return {...normal,confirmedPrice:Math.round((line.estimatedPrice+.8)*100)/100,risk:'price'};
  if(line.sku==='431001')return {...normal,qty:line.plannedQty>1?line.plannedQty-Math.min(12,Math.floor(line.plannedQty/2)):2,risk:'qty'};
  if(line.sku==='400213')return {...normal,qty:0,confirmedPrice:null,risk:'missing',alert:'Missing on confirmation — verify supplier availability'};
  return normal;
 });
}
export function applyFocusedConfirmation(state:DemoState,fileName?:string):DemoState {
 const next=applyConfirmationUpload(state,fileName,focusedConfirmationLines(state));
 const prices=next.lines.filter(l=>l.confirmedPrice!==null&&Math.abs(l.confirmedPrice-l.estimatedPrice)>=.01);
 const quantities=next.lines.filter(l=>l.risk==='qty');
 const missing=next.lines.filter(l=>l.risk==='missing');
 const currentId=next.confirmationRounds.find(r=>r.isCurrent)?.id;
 return {...next,confirmationRounds:next.confirmationRounds.map(r=>r.id!==currentId?r:{...r,notes:r.notes.map(n=>n.actor==='Agent'&&n.text.startsWith('Different confirmation uploaded')?{...n,text:`Confirmation ${r.versionLabel}: ${prices.length} price change, ${quantities.length} quantity change, ${missing.length} missing item.`}:n)})};
}
export function focusedConfirmationNotes(state:DemoState):string {
 const sections=[
  ...state.lines.filter(l=>l.risk==='missing').map(l=>`Missing: ${l.sku} ${l.name}`),
  ...state.lines.filter(l=>l.risk==='qty').map(l=>`Quantity: ${l.sku} ${l.plannedQty} → ${l.qty}`),
  ...state.lines.filter(l=>l.confirmedPrice!==null&&Math.abs(l.confirmedPrice-l.estimatedPrice)>=.01).map(l=>`Price: ${l.sku} €${l.estimatedPrice.toFixed(2)} → €${l.confirmedPrice!.toFixed(2)}`),
 ];
 return sections.length?sections.join('\n'):'All quantities and prices match the plan.';
}

/** First batch: one short line, one pending line and one gift; second: one overage. */
export function applyFocusedDdt(state:DemoState):DemoState {
 const next=applyCurrentBatchDdt(state);
 const first=state.receiptBatches.length===0;
 return {...next,receivingLines:next.receivingLines.map(line=>{
  const open=Math.max(0,line.ordered-line.stocked);
  if(first&&line.sku==='NEW-024'&&line.ordered===0)return {...line,ddt:12,counted:12,disposition:'hold' as const};
  let ddt=open;
  if(first&&line.sku==='431001'&&open>1)ddt=open-Math.min(12,Math.floor(open/2));
  if(first&&line.sku==='420106')ddt=0;
  if(!first&&line.sku==='431001'&&open>0)ddt=open+2;
  return {...line,ddt,counted:ddt,disposition:'receive' as const};
 })};
}
