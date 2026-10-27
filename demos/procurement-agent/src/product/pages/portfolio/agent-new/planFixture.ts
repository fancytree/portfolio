import { BASE_LINES } from '../procurement-agent/portfolioDemoScript';
/** Preserve the existing 30-day fixture; a different window adds/removes forecast
 * units at the same observed daily sales rate. This is a local plan preview. */
export function planLinesForCoverage(coverage:number){
 const days=Math.max(1,Math.min(180,coverage));
 return BASE_LINES.map(line=>{const qty=Math.max(0,line.recommended+Math.ceil(line.sales30*(days-30)/30));return {...line,recommended:qty,plannedQty:qty,qty};});
}
