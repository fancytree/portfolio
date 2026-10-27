import {createInitialState,appendMessages,approveProposal,applyRemainingGoodsDecision,confirmCurrentReceiptBatch,createReceivingLinesFromPo,defaultExpectedArrivalDate,DEMO_OPERATORS,ensureOrderedDocumentPack,jumpToStage,orderedQtyOf,submitForApproval} from '@/pages/portfolio/procurement-agent/portfolioDemoScript';
import {applyFocusedConfirmation,applyFocusedDdt} from '@/pages/portfolio/agent-new/focusedFixtures';
import {confirmationResult} from '@/pages/portfolio/agent-new/StructuredAgentMessage';
import type {DemoStageId,DemoState} from '@/pages/portfolio/procurement-agent/portfolioDemoTypes';

/** Stage shortcuts use the same fixtures and transitions as the current product. */
export function demoStageState(stage:Exclude<DemoStageId,'intake'>):DemoState{
 const plan={...jumpToStage('replenishment'),draftInput:'',messages:[],messageSeq:0};
 if(stage==='replenishment')return {...createInitialState(),stage:'replenishment',lines:[],receivingLines:[],orderedQty:0,messages:[],messageSeq:0,planGenerated:false,progress:{status:'running',current:'understand',completed:[]}};
 const checked=applyFocusedConfirmation(plan);
 if(stage==='approval')return appendMessages({...submitForApproval(checked),stage:'approval'},[{role:'agent',text:'Review the supplier confirmation before approving the proposal.',result:confirmationResult(checked,'26VOM002922.pdf',false)}]);
 const approved=approveProposal(checked);const receivingLines=createReceivingLinesFromPo(approved.lines);const operator=DEMO_OPERATORS[0];
 const receiving=ensureOrderedDocumentPack({...approved,stage:'receiving',orderRecorded:true,orderAt:new Date().toISOString().slice(0,16),orderedBy:`${operator.name} · ${operator.role}`,expectedArrival:defaultExpectedArrivalDate(14),receivingLines,orderedQty:orderedQtyOf(receivingLines),receiptBatches:[],currentDdtReady:false,awaitingRemainingDecision:false,remainingDecision:null,receivingComplete:false,messages:[],messageSeq:0});
 if(stage==='receiving')return appendMessages(receiving,[{role:'agent',text:'The purchase order is recorded. Upload the delivery note, check actual quantities, then confirm this receipt.'}]);
 const delivered=applyFocusedDdt(receiving);const received=confirmCurrentReceiptBatch({...delivered,receivingLines:delivered.receivingLines.map(line=>({...line,disposition:'receive'}))});
 const closed=applyRemainingGoodsDecision(received,'close_remaining');
 return appendMessages({...closed,stage:'retrospective',learningDecision:'pending',messages:[],messageSeq:0},[{role:'agent',text:'Receiving is closed. Review demand, arrival timing, and SKU differences before the next purchase.'}]);
}
