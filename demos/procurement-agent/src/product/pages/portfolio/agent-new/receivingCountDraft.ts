import type {ReceivingLine} from '../procurement-agent/portfolioDemoTypes';

/** Keep the original walkthrough's editable warehouse-count example tied to this batch. */
export function warehouseCountDraft(lines:ReceivingLine[]):string|undefined {
 const proposed=lines.filter(line=>line.ddt>0&&line.ordered>0).slice(0,2).map((line,index)=>`${Math.max(0,line.ddt+(index===0?3:-2))} for ${line.sku}`);
 return proposed.length?`Warehouse counted ${proposed.join(', ')}`:undefined;
}
export function parseWarehouseCounts(prompt:string,lines:ReceivingLine[]):Map<string,number>{
 const updates=new Map<string,number>();
 if(!/\b(?:counted|actual|received)\b/i.test(prompt))return updates;
 for(const line of lines){
  const sku=line.sku.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const before=prompt.match(new RegExp(`(\\d+)\\s*(?:units?\\s*)?for\\s+${sku}\\b`,'i'));
  const after=prompt.match(new RegExp(`\\b${sku}\\b\\s*(?:→|->|:|=|is|counted|received|actual)?\\s*(\\d+)`,'i'));
  const qty=Number(before?.[1]??after?.[1]);if(Number.isFinite(qty))updates.set(line.sku,qty);
 }
 return updates;
}
