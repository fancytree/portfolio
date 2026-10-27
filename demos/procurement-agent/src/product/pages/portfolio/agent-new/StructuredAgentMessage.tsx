import { ArrowRight } from 'lucide-react';
import { compactReplyResult } from './agentReplyPresentation';
import { Badge } from '@/components/ui/badge';
import type { DemoChatMessage, DemoState } from '../procurement-agent/portfolioDemoTypes';

type Result=NonNullable<DemoChatMessage['result']>;
const euro=(value:number)=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(value);
export function confirmationResult(state:DemoState,fileName:string,previouslyApproved:boolean):Result {
 const missing=state.lines.filter(l=>l.risk==='missing'||(l.plannedQty>0&&l.qty===0));
 const quantity=state.lines.filter(l=>l.plannedQty!==l.qty&&!missing.includes(l)&&l.risk!=='extra');
 const prices=state.lines.filter(l=>l.confirmedPrice!==null&&Math.abs(l.confirmedPrice-l.estimatedPrice)>.0001);
 const rules=state.approvalTriggers.filter(rule=>rule.fired);
 return {
  title:missing.length||quantity.length||prices.length?'Confirmation needs review':'Confirmation checked',
  source:fileName,
  badges:[...(missing.length?[`${missing.length} missing`]:[]),...(quantity.length?[`${quantity.length} quantity ${quantity.length===1?'change':'changes'}`]:[]),...(prices.length?[`${prices.length} price ${prices.length===1?'change':'changes'}`]:[])],
  sections:[
   ...(missing.length?[{title:'Missing items',rows:missing.map(l=>({label:l.sku,detail:l.name}))}]:[]),
   ...(quantity.length?[{title:'Quantity changes',rows:quantity.map(l=>({label:l.sku,before:String(l.plannedQty),after:String(l.qty)}))}]:[]),
   ...(prices.length?[{title:'Price changes',rows:prices.map(l=>({label:l.sku,before:euro(l.estimatedPrice),after:euro(l.confirmedPrice!)})),preview:3}]:[]),
   ...(rules.length?[{title:`Approval checks (${rules.length})`,rows:rules.map(rule=>({label:rule.label,detail:rule.evidence})),preview:0}]:[]),
  ],
  ...(previouslyApproved?{notice:'Previous approval cleared. Review this confirmation again.'}:{}),
  nextStep:rules.length?'Check the differences, then choose Approve in the purchase order.':'Choose Approve in the purchase order when the confirmation is correct.',
 };
}
function legacyConfirmation(message:DemoChatMessage):Result|null {
 if(!/I compared the platform PO|Different confirmation detected/.test(message.text))return null;
 const quantity=[...message.text.matchAll(/(\d{5,})\s+(\d+)→(\d+)/g)].map(m=>({label:m[1],before:m[2],after:m[3]}));
 const prices=[...message.text.matchAll(/(\d{5,})\s+€([\d.]+)→€([\d.]+)/g)].map(m=>({label:m[1],before:`€${m[2]}`,after:`€${m[3]}`}));
 const missing=message.text.match(/Missing:\s*([^\n]+)/)?.[1];
 return {title:'Confirmation needs review',source:message.text.match(/\(([^()]+\.pdf)\)/)?.[1],sections:[...(missing?[{title:'Missing items',rows:[{label:missing}]}]:[]),...(quantity.length?[{title:'Quantity changes',rows:quantity}]:[]),...(prices.length?[{title:'Price changes',rows:prices}]:[])],nextStep:'Review the differences, then choose Approve in the purchase order.'};
}
function ResultRows({rows}:{rows:Result['sections'][number]['rows']}) {
 return <dl className="agent-new-result-rows">{rows.map((row,index)=><div key={`${row.label}-${index}`} data-plain={!row.label||undefined}><dt className={!row.label?'sr-only':undefined}>{row.label||`Finding ${index+1}`}</dt><dd>{row.before!==undefined&&<span className="agent-new-result-before">{row.before}</span>}{row.after!==undefined&&<><ArrowRight size={12} aria-hidden/><strong>{row.after}</strong></>}{row.detail&&<span className="agent-new-result-detail">{row.detail}</span>}</dd></div>)}</dl>;
}
export default function StructuredAgentMessage({message}:{message:DemoChatMessage}) {
 const result=message.result??legacyConfirmation(message)??compactReplyResult(message.text,message.bullets);
 const confirmation=!!result && /^Confirmation (needs review|checked)$/.test(result.title);
 if(result)return <article className="agent-new-result" aria-label={confirmation?"Confirmation comparison":result.title}>
  <header><h3>{result.title}</h3>{result.source&&<p>{result.source}</p>}</header>
  {result.summary&&<p className="agent-new-result-summary">{result.summary}</p>}
  {!!result.badges?.length&&<div className="agent-new-result-badges">{result.badges.map(label=><Badge key={label} variant="outline">{label}</Badge>)}</div>}
  {result.sections.map(section=>{const visible=section.preview??section.rows.length;return <section key={section.title} aria-label={section.title}>
   {visible>0&&<><h4>{section.title}</h4><ResultRows rows={section.rows.slice(0,visible)}/></>}
   {visible<section.rows.length&&<details><summary>{visible===0?section.title:`View all ${section.rows.length} ${section.title.toLowerCase()}`}</summary><ResultRows rows={visible===0?section.rows:section.rows.slice(visible)}/></details>}
  </section>;})}
  {result.notice&&<p className="agent-new-result-notice">{result.notice}</p>}
  {result.nextStep&&<footer><h4>Next step</h4><p>{result.nextStep}</p></footer>}
  <details className="agent-new-result-source"><summary>{confirmation?'Full comparison notes':'View details'}</summary><p>{message.text}{message.bullets?.length?`\n\n${message.bullets.join('\n')}`:''}</p></details>
 </article>;
 return <div className="agent-new-message-copy"><p>{message.text}</p></div>;
}
