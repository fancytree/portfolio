import {useRef,useState} from 'react';
import {Button} from '@/components/ui/button';
import {IntakeView} from '@/pages/portfolio/procurement-agent/PortfolioMainCanvas';
import PortfolioAgentPanel from '@/pages/portfolio/procurement-agent/PortfolioAgentPanel';
import {PORTFOLIO_COPY as copy} from '@/pages/portfolio/procurement-agent/portfolioDemoCopy';
import type {DemoChatMessage,DemoStageId} from '@/pages/portfolio/procurement-agent/portfolioDemoTypes';
import StructuredAgentMessage from '@/pages/portfolio/agent-new/StructuredAgentMessage';
import {askProjectAgent,buildHistory} from './askProjectAgent';

const opening="Ask me anything about how this procurement agent was designed — the decisions, the trade-offs, or why the workflow works this way. You can also drive the workflow itself from the left.";
const explanations=[
 {ask:copy.workflowAskIntake,text:copy.workflowReplyIntake,bullets:copy.workflowReplyIntakeBullets},
 {ask:copy.workflowAskPlan,text:copy.workflowReplyPlan,bullets:copy.workflowReplyPlanBullets},
 {ask:copy.workflowAskApprove,text:copy.workflowReplyApprove,bullets:copy.workflowReplyApproveBullets},
 {ask:copy.workflowAskOrder,text:copy.workflowReplyOrder,bullets:copy.workflowReplyOrderBullets},
 {ask:copy.workflowAskReceive,text:copy.workflowReplyReceive,bullets:copy.workflowReplyReceiveBullets},
 {ask:copy.workflowAskReview,text:copy.workflowReplyReview,bullets:copy.workflowReplyReviewBullets},
];
export default function DemoIntroduction({onGoStage}:{onGoStage:(stage:DemoStageId)=>void}){
 const [messages,setMessages]=useState<DemoChatMessage[]>([{id:'design-opening',role:'agent',text:opening}]);
 const [draft,setDraft]=useState('');const [busy,setBusy]=useState(false);const [mobile,setMobile]=useState<'workflow'|'chat'>('workflow');const lock=useRef(false);
 const ask=async(raw:string)=>{const question=raw.trim();if(!question||lock.current)return;setMobile('chat');setDraft('');lock.current=true;setBusy(true);setMessages(old=>[...old,{id:crypto.randomUUID(),role:'user',text:question}]);
  const explanation=explanations.find(item=>item.ask===question)??(/never.*order|place.*order/i.test(question)?explanations[3]:/calculat|generated/i.test(question)?explanations[1]:undefined);
  try{const text=explanation?.text??await askProjectAgent(question,buildHistory(messages));setMessages(old=>[...old,{id:crypto.randomUUID(),role:'agent',text,bullets:explanation?.bullets?[...explanation.bullets]:undefined}]);}
  catch{setMessages(old=>[...old,{id:crypto.randomUUID(),role:'agent',text:'The workflow separates what the Agent prepares from what a person decides. Select a step in the diagram to inspect that responsibility, or open Purchase orders to try the process.'}]);}
  finally{lock.current=false;setBusy(false);}
 };
 return <div className="demo-introduction flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
  <div className="flex shrink-0 gap-2 border-b border-border bg-card px-3 py-2 md:hidden" role="group" aria-label="Introduction view"><Button variant={mobile==='workflow'?'default':'outline'} size="sm" onClick={()=>setMobile('workflow')}>Workflow</Button><Button variant={mobile==='chat'?'default':'outline'} size="sm" onClick={()=>setMobile('chat')}>Ask about this design</Button></div>
  <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
   <main className={`${mobile==='workflow'?'flex':'hidden'} min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-y-none p-3 md:flex md:p-4 md:pr-2`} aria-label="Procurement workflow introduction"><div data-demo-introduction-panel className="min-w-0 flex-1 shrink-0 rounded-2xl bg-card"><IntakeView draft={null} title="Procurement agent" onGoStage={onGoStage} onAskAgent={text=>void ask(text)}/></div></main>
   <div className={`${mobile==='chat'?'flex':'hidden'} min-h-0 min-w-0 flex-1 md:flex md:flex-none`}><PortfolioAgentPanel designMode stage="intake" messages={messages} draftInput={draft} busy={busy} suggestions={['Why can the agent never place the order?','Why is the quantity calculated, not generated?']} onDraftInputChange={setDraft} onSend={text=>void ask(text??draft)} onSuggestion={text=>void ask(text)} renderAgentContent={message=>message.id==='design-opening'?<p>{message.text}</p>:<StructuredAgentMessage message={message}/>}/></div>
  </div>
 </div>;
}
