// A cyclic clock: only its display wraps; gestures can cross midnight freely.
export const wrapMinutes=value=>((value%1440)+1440)%1440;
export function createTimeDial({getHour,onChange,onLocal}){
  const dialog=document.querySelector('#timeDialog'),wheel=document.querySelector('#timeWheel');
  const toggle=document.querySelector('#timeToggle'),ticks=document.querySelector('#timeTicks');
  const lines=Array.from({length:27},()=>{const line=document.createElement('i');ticks.append(line);return line;});
  let minutes=0,drag=null,velocity=0,frame=0,last=0;
  function stop(){cancelAnimationFrame(frame);frame=0;velocity=0;}
  function draw(){
    const phase=wrapMinutes(minutes)/15%1,height=wheel.clientHeight||440;
    lines.forEach((line,i)=>{
      const angle=(i-13-phase)*.13,visible=Math.abs(angle)<Math.PI/2;
      const depth=visible?Math.cos(angle):0;
      line.style.transform=`translate(-50%,${Math.sin(angle)*height*.47}px) scaleX(${.72+depth*.28})`;
      line.style.opacity=String(Math.pow(depth,1.8));
    });
  }
  function change(value){onChange(wrapMinutes(value)/60);}
  function coast(now){
    const dt=Math.min((now-last)/1000,.04);last=now;
    velocity*=Math.exp(-dt*8.2);
    if(Math.abs(velocity)<.8||!dialog.open){stop();return;}
    change(getHour()*60+velocity*dt);frame=requestAnimationFrame(coast);
  }
  toggle.addEventListener('click',()=>{stop();dialog.showModal();toggle.setAttribute('aria-expanded','true');draw();wheel.focus();});
  document.querySelector('#timeClose').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  dialog.addEventListener('close',()=>{stop();drag=null;wheel.classList.remove('is-dragging');toggle.setAttribute('aria-expanded','false');toggle.focus();});
  document.querySelector('#localTime').addEventListener('click',()=>{stop();onLocal();});
  wheel.addEventListener('wheel',e=>{
    e.preventDefault();stop();
    const pixels=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?wheel.clientHeight:1);
    change(getHour()*60+Math.max(-120,Math.min(120,pixels))*.52);
  },{passive:false});
  wheel.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse'&&e.button!==0)return;
    e.preventDefault();stop();wheel.focus();wheel.setPointerCapture(e.pointerId);
    drag={id:e.pointerId,y:e.clientY,t:e.timeStamp};wheel.classList.add('is-dragging');
  });
  wheel.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    const delta=(drag.y-e.clientY)*.55,dt=Math.max(.008,(e.timeStamp-drag.t)/1000);
    if(delta!==0){velocity=Math.max(-180,Math.min(180,delta/dt));change(getHour()*60+delta);}
    drag.y=e.clientY;drag.t=e.timeStamp;
  });
  function release(e){
    if(!drag||e.pointerId!==drag.id)return;
    const glide=e.type==='pointerup'&&e.timeStamp-drag.t<100&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
    drag=null;wheel.classList.remove('is-dragging');
    if(wheel.hasPointerCapture(e.pointerId))wheel.releasePointerCapture(e.pointerId);
    if(glide){last=performance.now();frame=requestAnimationFrame(coast);}else stop();
  }
  wheel.addEventListener('pointerup',release);wheel.addEventListener('pointercancel',release);wheel.addEventListener('lostpointercapture',release);
  wheel.addEventListener('keydown',e=>{
    const increments={ArrowUp:1,ArrowRight:1,ArrowDown:-1,ArrowLeft:-1,PageUp:60,PageDown:-60};
    if(e.key in increments||e.key==='Home'||e.key==='End'){
      e.preventDefault();e.stopPropagation();stop();
      change(e.key==='Home'?0:e.key==='End'?1439:getHour()*60+increments[e.key]*(e.shiftKey?15:1));
    }
  });
  window.addEventListener('resize',draw);
  return {update(hour,local,text){
    minutes=hour*60;wheel.setAttribute('aria-valuenow',String((local?Math.floor(wrapMinutes(minutes)):Math.round(wrapMinutes(minutes)))%1440));
    wheel.setAttribute('aria-valuetext',text+(local?', local time':', custom time'));
    document.querySelector('#dialTime').textContent=text;
    document.querySelector('#timeSync').textContent=local?'Local time':'Custom time';
    if(dialog.open)draw();
  }};
}
