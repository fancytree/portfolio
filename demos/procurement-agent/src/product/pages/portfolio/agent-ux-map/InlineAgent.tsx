import {useState,type ComponentProps} from 'react';
import PortfolioAgentPanel from '../procurement-agent/PortfolioAgentPanel';
import {ExportDialog} from '../procurement-agent/PortfolioMainCanvas';
import {PORTFOLIO_COPY} from '../procurement-agent/portfolioDemoCopy';
import {jumpToStage} from '../procurement-agent/portfolioDemoScript';
import type {DemoChatMessage} from '../procurement-agent/portfolioDemoTypes';
import StructuredAgentMessage,{confirmationResult} from '../agent-new/StructuredAgentMessage';
import SupplyRulesContent from '../agent-new/SupplyRulesContent';
import {applyFocusedConfirmation} from '../agent-new/focusedFixtures';
import {Sheet,SheetContent,SheetDescription,SheetHeader,SheetTitle} from '@/components/ui/sheet';

type Props=Omit<ComponentProps<typeof PortfolioAgentPanel>,'stage'|'suggestions'|'onSuggestion'>&{composerOnly?:boolean;messageOnly?:boolean;suggestions?:string[];onSuggestion?:(text:string)=>void};
const defaults=[PORTFOLIO_COPY.exportRequest,PORTFOLIO_COPY.uploadConfirmation,PORTFOLIO_COPY.viewSupplierRules];
export default function InlineAgent({suggestions=defaults,onSuggestion,onAttachFile,composerOnly=false,messageOnly=false,...chat}:Props){
 const [action,setAction]=useState<string|null>(null);const [extra,setExtra]=useState<DemoChatMessage[]>([]);
 const append=(message:Omit<DemoChatMessage,'id'>)=>setExtra(old=>[...old,{...message,id:`inline-${old.length}`}]);
 const suggest=(text:string)=>{
  if(onSuggestion){onSuggestion(text);return;}
  if(text===PORTFOLIO_COPY.viewSupplierRules){setAction('rules');return;}
  if(text===PORTFOLIO_COPY.exportRequest){setAction('export');return;}
  const order=applyFocusedConfirmation(jumpToStage('replenishment'),'26VOM002922.pdf');append({role:'agent',text:'Supplier confirmation checked.',result:confirmationResult(order,'26VOM002922.pdf',false)});
 };
 return <div className={`ux-embedded-agent ${composerOnly?'ux-input-fragment':messageOnly?'ux-message-fragment':''}`}><PortfolioAgentPanel {...chat} stage="replenishment" messages={[...chat.messages,...extra]} suggestions={suggestions} onSuggestion={suggest} onAttachFile={onAttachFile??(file=>append({role:'agent',text:`Attachment added: ${file.name}`}))} renderAgentContent={message=><StructuredAgentMessage message={message}/>}/>
  <ExportDialog previewLimit={2} open={action==='export'} lines={jumpToStage('replenishment').lines} onOpenChange={open=>{if(!open)setAction(null);}} onExport={format=>{append({role:'agent',text:PORTFOLIO_COPY.exportDone(format)});setAction(null);}}/>
  <Sheet open={action==='rules'} onOpenChange={open=>{if(!open)setAction(null);}}><SheetContent className="agent-new-sheet sm:max-w-xl"><SheetHeader><SheetTitle>Supply rules</SheetTitle><SheetDescription>MNP · Supplier information</SheetDescription></SheetHeader><div className="agent-new-sheet-body"><SupplyRulesContent/></div></SheetContent></Sheet>
 </div>;
}
