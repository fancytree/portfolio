import type { SupplierRules } from './supplierRulesStore';
import { formatBusinessDate, formatBusinessDateTime } from '@/lib/dateTime';
import { MNP_SUPPLIER_RULES, outcomeForReceivingLine } from '../procurement-agent/portfolioDemoScript';
import { PORTFOLIO_COPY } from '../procurement-agent/portfolioDemoCopy';
import type { DemoChatMessage, DemoState } from '../procurement-agent/portfolioDemoTypes';

type Result = NonNullable<DemoChatMessage['result']>;
type Row = Result['sections'][number]['rows'][number];
const row = (label:string, detail:string|number):Row => ({label,detail:String(detail)});
const shorten = (value:string, limit=150) => value.length<=limit ? value : `${value.slice(0,limit).replace(/\s+\S*$/,'')}…`;

/** A bounded, expandable fallback also covers specialist findings and older replies. */
export function compactReplyResult(text:string, bullets:string[]=[]):Result|undefined {
  if(text.length<=180 && bullets.length===0 && !/\n[•-]/.test(text))return undefined;
  const parts=text.split(/\n\s*[•-]\s*|\n\s*\n/).map(part=>part.trim()).filter(Boolean);
  const sentences=(parts[0]??text).split(/(?<=[.!?])\s+(?=[A-Z])/);
  const first=sentences[0];
  const title=first.length<=90?first:'Details ready';
  const items=[...(first.length>90?[first]:[]),...sentences.slice(1),...parts.slice(1),...bullets];
  return {title,sections:items.length?[{title:'Key points',rows:items.map(item=>row('',shorten(item))),preview:3}]:[]};
}

/** Presentation is derived from the same post-action state as the editable canvas. */
export function businessReplyResult(text:string, bullets:string[]|undefined, state:DemoState, intent:string, rules:SupplierRules=MNP_SUPPLIER_RULES):Result|undefined {
  if(intent==='Recording external order…')return {
    title:'Order recorded',
    sections:[{title:'Order details',rows:[row('Recorded',formatBusinessDateTime(state.orderAt)),row('Operator',state.orderedBy??'—'),row('Expected arrival',formatBusinessDate(state.expectedArrival))]}],
    nextStep:'Upload the DDT when the first delivery arrives.',
  };
  if(intent==='Checking forecast signals…')return {
    title:'Review this order',badges:['Receiving closed'],
    sections:[{title:'What would you change?',rows:[row('Demand','Did quantities match demand?'),row('Delivery','Did deliveries arrive on time?'),row('Next buy','Which SKUs or coverage need adjusting?')]}],
    nextStep:'Edit the draft below, then send your feedback.',
  };
  if(intent==='Checking supplier rules…') {
    return {title:'MNP supply terms',sections:[{title:'Commercial terms',rows:[row('Minimum order',`€${rules.minOrderValue}`),row('Free shipping',`From €${rules.freeShippingThreshold}`),row('Below threshold',`€${rules.defaultShippingFee} shipping`),row('Lead time',`${rules.leadTimeMedianDays} days median`)]},{title:'Payment & validity',rows:[row('Early payment',`${rules.earlyPaymentDiscountRate*100}% within ${rules.earlyPaymentDays} days`),row('Volume discount',rules.volumeDiscount),row('Valid until',formatBusinessDate(rules.validUntil))],preview:0}],nextStep:'Open the supplier rules on the order for the full terms.'};
  }
  if(intent==='Applying approval decision…')return {title:'Plan approved',sections:[{title:'Approval',rows:[row('Confirmation',state.confirmationRounds.find(round=>round.isCurrent)?.fileName??'Current confirmation'),row('Status','Approved')]}],nextStep:'Place the order with your supplier, then choose Mark as ordered.'};
  if(intent==='Pushing to Owner approval…')return {title:'Sent to Owner',sections:[{title:'Approval',rows:[row('Status','Awaiting Owner approval')]}],nextStep:'Wait for approval before recording the order.'};
  if(intent==='Recording supplier invoice…')return {title:'Invoice added',source:state.attachments.filter(item=>item.kind==='invoice').slice(-1)[0]?.fileName,sections:[],nextStep:'You can view the invoice under Attachments.'};
  if(intent==='Matching DDT to PO lines…') {
    const differences=state.receivingLines.filter(line=>line.ddt!==Math.max(0,line.ordered-line.stocked)||line.counted!==line.ddt||line.disposition==='hold');
    return {title:'Delivery note checked',badges:[`Batch ${state.receiptBatches.length+1}`,`${differences.length} ${differences.length===1?'difference':'differences'}`],sections:[{title:'Needs review',rows:differences.map(line=>row(line.sku,
      line.disposition==='hold'?`${line.counted} extra units · accept as gift or return`
      :line.counted!==line.ddt?`DDT ${line.ddt} · Actual ${line.counted}`
      :line.ddt===0?`Not delivered · ${Math.max(0,line.ordered-line.stocked)} open`
      :`Open ${Math.max(0,line.ordered-line.stocked)} · DDT ${line.ddt}`)),preview:3}],nextStep:differences.some(line=>line.disposition==='hold')?'Resolve the held item, check Actual quantities, then confirm receipt.':'Check Actual quantities in the table, then confirm receipt.'};
  }
  if(intent==='Confirming counted receipt…') {
    const batch=state.receiptBatches[state.receiptBatches.length-1];
    const open=state.receivingLines.reduce((sum,line)=>sum+Math.max(0,line.ordered-line.stocked),0);
    return {title:state.receivingComplete?'Receiving complete':`Batch ${batch?.batchNo??1} received`,sections:[{title:'Receipt summary',rows:[row('Batch',batch?.batchNo??1),row('Counted',Object.values(batch?.bySku??{}).reduce((sum,item)=>sum+item.counted,0)),row('Still open',`${open} units`)]}],nextStep:state.receivingComplete?'Review this order to improve the next purchase.':'Choose how to handle the remaining goods.'};
  }
  if(intent==='Recording remaining-goods decision…')return {title:state.receivingComplete?'Receiving closed':'Remaining goods updated',sections:[{title:'Decision',rows:[row('Action',state.remainingDecision?PORTFOLIO_COPY.remainingOptions[state.remainingDecision].title:'Saved'),row(state.receivingComplete?'Not received':'Still open',`${state.receivingLines.reduce((sum,line)=>sum+Math.max(0,line.ordered-line.stocked),0)} units`)]}],nextStep:state.receivingComplete?'Review this order when you are ready.':'Upload the next delivery note when it arrives.'};
  if(intent==='Summarizing your forecast feedback…')return {title:'Review feedback noted',sections:[{title:'For the next purchase',rows:(bullets??[]).slice(0,2).map((item,index)=>row(index===0?'Quantity':'Arrival',shorten(item.replace(/^(Qty|ETA) signal:\s*/,''))))}],nextStep:'Review the note in Memory before using it for this order.'};
  if(intent==='Explaining SKU recommendation…') {
    const line=state.lines.find(item=>text.startsWith(item.sku));
    if(line)return {title:`${line.sku} recommendation`,source:line.name,sections:[{title:'Quantity basis',rows:[row('Sales · 30 days',line.sales30),row('In stock',line.stock),row('Suggested',line.recommended),row('Current plan',line.qty)]}],...(line.alert?{notice:line.alert}:{}),nextStep:'Edit the quantity directly in the table if needed.'};
  }
  if(intent==='Explaining SPU recommendation…') {
    const match=state.lines.find(item=>text.startsWith(item.productName));
    if(match){const lines=state.lines.filter(item=>item.productId===match.productId);return {title:match.productName,sections:[{title:'Quantity basis',rows:[row('SKUs',lines.length),row('Sales · 30 days',lines.reduce((sum,item)=>sum+item.sales30,0)),row('Current plan',lines.reduce((sum,item)=>sum+item.qty,0))]}],nextStep:'Expand the product to review or edit each SKU.'};}
  }
  if(intent==='Comparing SKU outcome…') {
    const line=state.receivingLines.find(item=>text.startsWith(item.sku));
    const outcome=line?outcomeForReceivingLine(line):null;
    if(line&&outcome)return {title:`${line.sku} sell-through`,source:line.nameIt,sections:[{title:`${state.intakeDraft?.coverageDays??30}-day coverage`,rows:[row('Ordered',outcome.ordered),row('Received',line.stocked),row('Sold',outcome.sold),row('Remaining',outcome.remaining)]}],summary:outcome.note,nextStep:'Keep this coverage or adjust it for the next purchase?'};
  }
  if(intent==='Reviewing price variance…') {
    const line=state.lines.find(item=>item.sku==='370102');
    if(line)return {title:'370102 price check',sections:[{title:'Price & quantity',rows:[{label:'Unit price',before:`€${line.estimatedPrice.toFixed(2)}`,after:line.confirmedPrice===null?'Not confirmed':`€${line.confirmedPrice.toFixed(2)}`},{label:'Quantity',before:String(line.plannedQty),after:String(line.qty)}]}],nextStep:state.approved?'The current confirmation is approved.':'Review the current confirmation before approval.'};
  }
  return compactReplyResult(text,bullets);
}
