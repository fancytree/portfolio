import type { DemoState } from '../procurement-agent/portfolioDemoTypes';
import { orderSignature, type Experience } from './experienceModel';
import { orderActivityChanges } from './orderActivity';

export const EDIT_ROUND_IDLE_MS=1200;
export const historyMilestones:Record<string,string>={
 'request-exported':'Purchase request exported',
 'confirmation-checked':'Supplier confirmation checked',
 approved:'Approval passed',
 'order-recorded':'Order placed',
};
export function editRoundDetail(before:DemoState,after:DemoState){
 const changes=orderActivityChanges(before,after).filter(entry=>['draft-edited','products-added','products-removed'].includes(entry.kind));
 return changes.map(entry=>entry.detail).join('; ');
}
export function isDraftChanged(before:DemoState,after:DemoState){return orderSignature(before)!==orderSignature(after);}
export function historyLabel(version:Experience['versions'][number]){return version.label==='Original draft'?'Initial plan':version.label==='Order updated'?'Autosaved changes':version.label;}
export function isAutosave(version:Experience['versions'][number]){return version.kind==='autosave'||(!version.kind&&version.label==='Order updated');}
