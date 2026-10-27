import type {ReactNode} from 'react';
import {Check,Compass,RotateCcw,X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {STAGE_META} from '@/pages/portfolio/procurement-agent/portfolioDemoCopy';
import type {DemoStageId} from '@/pages/portfolio/procurement-agent/portfolioDemoTypes';

export type DemoNavigationStage=DemoStageId|'orders';
const demoStages=[{id:'intake' as DemoNavigationStage,number:1,label:'Introduction'},{id:'orders' as DemoNavigationStage,number:2,label:'Purchase orders'},...STAGE_META.filter(item=>item.id!=='intake').map(item=>({...item,number:item.number+1}))];

/** The standalone demo owns its presentation; ERP chrome stays in the project. */
export function DemoFrame({children}:{children:ReactNode;[prop:string]:unknown}){
 return <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">{children}</div>;
}
export function DemoShell({children}:{children:ReactNode;[prop:string]:unknown}){
 return <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background text-foreground">{children}</div>;
}
export function DemoBrowserChrome({guideOpen,onToggleGuide}:{guideOpen:boolean;onToggleGuide:()=>void}){
 const close=()=>{if(window.parent!==window)window.parent.postMessage({type:'portfolio-demo:close'},window.location.origin);else window.location.assign('/projects/procurement-agent-kit');};
 return <header className="flex h-11 shrink-0 items-center gap-3 border-b border-border bg-muted px-4" aria-label="Procurement demo controls">
  <div className="flex items-center gap-1.5">
   <button type="button" onClick={close} aria-label="Close the demo" title="Close" className="group grid size-[11px] cursor-pointer place-items-center rounded-full bg-destructive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"><X className="size-2 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden/></button>
   <span className="size-[11px] rounded-full bg-[var(--warning)]" aria-hidden/><span className="size-[11px] rounded-full bg-[var(--success)]" aria-hidden/>
  </div>
  <p className="min-w-0 truncate font-mono text-xs text-muted-foreground">DEF ERP — Procurement</p>
  <Button variant="outline" size="sm" className={cn('ml-auto h-7 shrink-0 rounded-full text-xs',guideOpen&&'border-primary/30 bg-primary/5 text-primary')} aria-label={guideOpen?'Hide guide':'Show guide'} aria-pressed={guideOpen} onClick={onToggleGuide}><Compass size={13} aria-hidden/>{guideOpen?'Guide on':'Guide'}</Button>
 </header>;
}
export function DemoStageNavigation({stage,onSelect,onReset}:{stage:DemoNavigationStage;onSelect:(stage:DemoNavigationStage)=>void;onReset:()=>void}){
 return <nav className="flex min-h-0 shrink-0 flex-col border-b border-border bg-muted px-3 py-3 md:w-[200px] md:border-r md:border-b-0 md:py-4" aria-label="Procurement stages">
  <div className="mb-3 flex items-center gap-3 md:flex-col md:items-stretch"><Button variant="outline" size="sm" className="h-8 justify-start rounded-xl px-2.5 text-xs text-muted-foreground" data-demo-reset onClick={onReset}><RotateCcw size={14} aria-hidden/>Reset</Button><p className="px-2 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">Stage</p></div>
  <ol className="flex min-w-0 gap-1.5 overflow-x-auto md:block md:space-y-1.5 md:overflow-y-auto">
   {demoStages.map((item,index)=>{const active=demoStages.findIndex(value=>value.id===stage);const status=index===active?'current':index<active?'done':'waiting';const label=item.label;return <li key={item.id} className="shrink-0 md:shrink"><button type="button" data-demo-stage={item.id} aria-current={status==='current'?'step':undefined} aria-label={`${item.number}. ${label}`} onClick={()=>onSelect(item.id)} className={cn('flex w-full cursor-pointer items-start gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-colors',status==='current'?'bg-card shadow-sm ring-1 ring-border':'hover:bg-card/70')}>
    <span className={cn('mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',status==='current'?'bg-primary text-primary-foreground':status==='done'?'bg-primary/10 text-primary':'bg-border text-muted-foreground')}>{status==='done'?<Check size={14} aria-hidden/>:item.number}</span>
    <span className="min-w-0"><span className="block text-[13px] font-medium leading-snug text-foreground">{label}</span><span className={cn('mt-0.5 block text-[11px]',status==='current'?'text-primary':'text-muted-foreground')}>{status}</span></span>
   </button></li>;})}
  </ol>
 </nav>;
}
