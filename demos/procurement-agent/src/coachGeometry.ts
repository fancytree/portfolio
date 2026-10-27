export type CoachRect={left:number;top:number;width:number;height:number};
type Point={x:number;y:number};
export const COACH_CARD_WIDTH=268;
const clamp=(value:number,min:number,max:number)=>Math.min(Math.max(value,min),Math.max(min,max));
/** Keep the original compact card and curved, arrowheaded pointer clear of the control. */
export function coachGeometry(rect:CoachRect,viewport:{width:number;height:number},card:{height:number}){
 const padding=12,gap=18;const width=Math.min(COACH_CARD_WIDTH,Math.max(0,viewport.width-padding*2));const height=card.height;
 const right=viewport.width-rect.left-rect.width;const leftSpace=rect.left;
 let left:number,top:number,from:Point,to:Point;let lateral:boolean|null=null;
 if(right>=width+gap+padding||leftSpace>=width+gap+padding){
  const onRight=right>=width+gap+padding;lateral=onRight;
  left=clamp(onRight?rect.left+rect.width+gap:rect.left-width-gap,padding,viewport.width-width-padding);
  top=clamp(rect.top+rect.height/2-height/2,48+padding,viewport.height-height-padding);
  from={x:onRight?left+14:left+width-14,y:top+Math.min(56,height-20)};
  to={x:onRight?rect.left+rect.width+6:rect.left-6,y:rect.top+rect.height/2};
 }else{
  const below=viewport.height-rect.top-rect.height>=height+gap+padding;
  left=clamp(rect.left+rect.width/2-width/2,padding,viewport.width-width-padding);
  top=clamp(below?rect.top+rect.height+gap:rect.top-height-gap,48+padding,viewport.height-height-padding);
  from={x:clamp(rect.left+rect.width/2,left+20,left+width-20),y:below?top:top+height};
  to={x:rect.left+rect.width/2,y:below?rect.top+rect.height+6:rect.top-6};
 }
 const dx=to.x-from.x,dy=to.y-from.y;const length=Math.hypot(dx,dy)||1;
 const bow=lateral===null?Math.min(54,Math.max(14,length*.22)):Math.min(Math.abs(dx)*.45+26,74);
 const control=lateral===null?{x:(from.x+to.x)/2-dy/length*bow,y:(from.y+to.y)/2+dx/length*bow}:{x:(from.x+to.x)/2,y:(from.y+to.y)/2+(lateral?-bow:bow)};
 return {left,top,width,path:`M ${from.x} ${from.y} Q ${control.x} ${control.y} ${to.x} ${to.y}`};
}
