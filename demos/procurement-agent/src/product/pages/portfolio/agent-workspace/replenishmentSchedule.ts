export type ReplenishmentSchedule={enabled:boolean;frequency:'daily'|'weekdays'|'weekly';weekday:number;time:string};
export const defaultReplenishmentSchedule:ReplenishmentSchedule={enabled:true,frequency:'weekdays',weekday:1,time:'09:00'};
const romeTime=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Rome',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const weekdays=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export function nextReplenishmentRun(schedule:ReplenishmentSchedule,after=Date.now()):number|null{
 if(!schedule.enabled)return null;
 const start=Math.floor(after/60000)*60000+60000;
 for(let minute=0;minute<8*24*60;minute++){
  const candidate=start+minute*60000;
  const parts=Object.fromEntries(romeTime.formatToParts(candidate).map(part=>[part.type,part.value]));
  if(`${parts.hour}:${parts.minute}`!==schedule.time)continue;
  const day=weekdays.indexOf(parts.weekday);
  if(schedule.frequency==='daily'||(schedule.frequency==='weekdays'&&day>=1&&day<=5)||(schedule.frequency==='weekly'&&day===schedule.weekday))return candidate;
 }
 return null;
}
