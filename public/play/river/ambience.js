// Field recordings, mixed gently with the scene's time of day.
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
export function ambientMix(hour,scene){
  const daylight=smooth(5.2,8,hour)*(1-smooth(17.5,20.5,hour));
  const dawn=Math.exp(-(((hour-7)/1.8)**2));
  return [(.58-.12*(1-daylight))*[.78,1,.70][scene],daylight*(.16+.07*dawn)*[.7,1,.5][scene],(1-daylight)*[.40,.58,.32][scene]];
}
// Occasional calls belong to the woodland, and recede completely after dusk.
export function forestCallLevel(hour,scene){
  if(scene!==1)return 0;
  const daylight=smooth(5.5,7,hour)*(1-smooth(17,19.5,hour));
  return daylight*(.19+.06*Math.exp(-(((hour-8)/2.5)**2)));
}
// Overlap the recording's tail and head once, then loop entirely on the audio clock.
function seamless(context,input){
  const overlap=Math.min(Math.round(context.sampleRate*2),Math.floor(input.length/4));
  const length=input.length-overlap;
  const output=context.createBuffer(input.numberOfChannels,length,input.sampleRate);
  for(let c=0;c<input.numberOfChannels;c++){
    const source=input.getChannelData(c),target=output.getChannelData(c);
    target.set(source.subarray(overlap,length));
    for(let i=0;i<overlap;i++){
      const t=i/(overlap-1),blend=t*t*(3-2*t);
      target[length-overlap+i]=source[length+i]*(1-blend)+source[i]*blend;
    }
  }
  return output;
}
export function createAmbience(){
  const button=document.querySelector('#soundToggle');
  const defaultVolume=.4;
  const label=document.querySelector('#soundLabel'),status=document.querySelector('#soundStatus');
  let context,master,analyser,layers=[],enabled=false,loading=false,lastUpdate=-1,hour=12,scene=0,suspendTimer,autoStart=true;
  const samples=new Float32Array(256);
  let callBuffer=null,callLoad=null,call=null,nextCallAt=Infinity,forestEligible=false,callCount=0;
  let birdBuffer=null,bird=null,nextBirdAt=Infinity,birdsEligible=false,birdCount=0,wildlifeQuietUntil=0;
  function silenceBird(){
    if(!bird)return;
    const previous=bird;bird=null;
    previous.gain.gain.cancelAndHoldAtTime(context.currentTime);
    previous.gain.gain.setTargetAtTime(0,context.currentTime,.08);
    previous.source.stop(context.currentTime+.4);
  }
  function updateBirds(){
    const level=ambientMix(hour,scene)[1],eligible=enabled&&!document.hidden&&level>.01;
    if(!eligible){birdsEligible=false;nextBirdAt=Infinity;silenceBird();return;}
    if(!birdsEligible){birdsEligible=true;nextBirdAt=context.currentTime+20+Math.random()*20;}
    if(bird)ramp(bird.level.gain,level,.7);
    if(!birdBuffer||bird||call||context.currentTime<Math.max(nextBirdAt,wildlifeQuietUntil))return;
    const source=context.createBufferSource(),gain=context.createGain(),levelGain=context.createGain(),pan=context.createStereoPanner();
    source.buffer=birdBuffer;source.loop=false;levelGain.gain.value=level;pan.pan.value=(Math.random()-.5)*.7;
    const now=context.currentTime+.05,duration=2+Math.random(),offset=2+Math.random()*(birdBuffer.duration-duration-4);
    gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(1,now+.45);
    gain.gain.setValueAtTime(1,now+duration-.8);gain.gain.linearRampToValueAtTime(0,now+duration);
    source.connect(gain).connect(levelGain).connect(pan).connect(master);
    const active={source,gain,level:levelGain};bird=active;
    source.onended=()=>{source.disconnect();gain.disconnect();levelGain.disconnect();pan.disconnect();if(bird===active)bird=null;};
    source.start(now,offset,duration);birdCount++;
    wildlifeQuietUntil=now+duration+20;
    nextBirdAt=now+duration+70+Math.random()*60;
  }
  async function loadCalls(){
    if(callBuffer||callLoad)return;
    callLoad=(async()=>{
      const response=await fetch('./assets/ambience-gibbon-distant.mp3',{signal:AbortSignal.timeout(30000)});
      if(!response.ok)throw new Error('Forest calls unavailable');
      callBuffer=await context.decodeAudioData(await response.arrayBuffer());
    })();
    try{await callLoad;}catch(error){button.dataset.calls='unavailable';}
    finally{callLoad=null;}
  }
  function silenceCall(){
    if(!call)return;
    const previous=call;call=null;
    previous.gain.gain.cancelAndHoldAtTime(context.currentTime);
    previous.gain.gain.setTargetAtTime(0,context.currentTime,.08);
    previous.source.stop(context.currentTime+.4);
  }
  function updateCalls(){
    const level=forestCallLevel(hour,scene),eligible=enabled&&!document.hidden&&level>.01;
    if(!eligible){forestEligible=false;nextCallAt=Infinity;silenceCall();return;}
    if(!forestEligible){
      forestEligible=true;nextCallAt=context.currentTime+45+Math.random()*35;
      loadCalls();
    }
    if(call)ramp(call.level.gain,level,.7);
    if(!callBuffer||call||bird||context.currentTime<Math.max(nextCallAt,wildlifeQuietUntil))return;
    const source=context.createBufferSource(),gain=context.createGain(),distance=context.createGain(),pan=context.createStereoPanner();
    source.buffer=callBuffer;source.loop=false;
    pan.pan.value=(Math.random()>.5?1:-1)*(.25+Math.random()*.25);
    const now=context.currentTime+.05,duration=callBuffer.duration,offset=0;
    distance.gain.value=level;gain.gain.setValueAtTime(0,now);
    gain.gain.linearRampToValueAtTime(1,now+.7);
    gain.gain.setValueAtTime(1,now+duration-1.2);
    gain.gain.linearRampToValueAtTime(0,now+duration);
    source.connect(gain).connect(distance).connect(pan).connect(master);
    const active={source,gain,level:distance};call=active;
    source.onended=()=>{source.disconnect();gain.disconnect();distance.disconnect();pan.disconnect();if(call===active)call=null;};
    source.start(now,offset,duration);callCount++;
    wildlifeQuietUntil=now+duration+25;
    nextCallAt=now+duration+100+Math.random()*80;
  }
  function ramp(param,value,seconds){param.setTargetAtTime(value,context.currentTime,seconds);}
  function state(){
    button.setAttribute('aria-pressed',String(enabled));
    button.disabled=loading;button.setAttribute('aria-busy',String(loading));
    label.textContent=loading?'Loading sounds…':enabled?'Pause sound':'Play sound';
    button.setAttribute('aria-label',enabled?'Pause nature sounds':'Play nature sounds');
  }
  function apply(){
    if(!master)return;
    updateCalls();updateBirds();
    ramp(master.gain,enabled&&!document.hidden?defaultVolume:0,.18);
    ambientMix(hour,scene).forEach((gain,i)=>{if(layers[i])ramp(layers[i].gain.gain,gain,1.3);});
    button.dataset.mix=JSON.stringify(ambientMix(hour,scene).map(x=>Number(x.toFixed(3))));
  }
  async function prepare(){
    const urls=['./assets/ambience-stream-clear.mp3','./assets/ambience-birds.mp3','./assets/ambience-night.mp3'];
    const buffers=await Promise.all(urls.map(async (url,index)=>{
      const response=await fetch(url,{signal:AbortSignal.timeout(30000)});
      if(!response.ok)throw new Error('Audio unavailable');
      const buffer=await context.decodeAudioData(await response.arrayBuffer());
      return index===1?buffer:seamless(context,buffer);
    }));
    const start=context.currentTime+.08;
    layers=buffers.map((buffer,index)=>{
      if(index===1){birdBuffer=buffer;return null;}
      const source=context.createBufferSource(),gain=context.createGain();
      source.buffer=buffer;source.loop=true;gain.gain.value=0;
      source.connect(gain).connect(master);source.start(start);return {source,gain};
    });
  }
  function initialize(){
    if(context)return;
    context=new AudioContext();master=context.createGain();master.gain.value=0;
    analyser=context.createAnalyser();analyser.fftSize=256;
    master.connect(analyser).connect(context.destination);
  }
  function stopAutomaticStart(){
    autoStart=false;
    document.removeEventListener('pointerdown',firstInteraction);
    document.removeEventListener('keydown',firstInteraction);
  }
  async function play(){
    if(loading||enabled)return;
    clearTimeout(suspendTimer);status.textContent='';
    try{
      initialize();
      // A gesture can release a pending browser autoplay restriction.
      const resumed=context.resume();loading=true;state();
      await resumed;
      if(!layers.length)await prepare();
      enabled=true;apply();
    }catch(error){
      enabled=false;status.textContent='Sounds could not load. Please try again.';
      if(context)context.suspend().catch(()=>{});
    }finally{loading=false;state();}
  }
  function firstInteraction(event){
    if(!autoStart||button.contains(event.target))return;
    if(event.type==='keydown'&&(event.ctrlKey||event.metaKey||event.altKey))return;
    stopAutomaticStart();play();
  }
  button.addEventListener('click',()=>{
    if(loading)return;
    stopAutomaticStart();clearTimeout(suspendTimer);status.textContent='';
    if(enabled){
      enabled=false;apply();state();
      suspendTimer=setTimeout(()=>{if(!enabled)context.suspend().catch(()=>{});},1100);
    }else play();
  });
  document.addEventListener('pointerdown',firstInteraction);
  document.addEventListener('keydown',firstInteraction);
  try{
    initialize();
    // Do not block the control while the browser waits for user activation.
    context.resume().then(()=>{
      if(autoStart){stopAutomaticStart();play();}
    }).catch(()=>{});
  }catch(error){status.textContent='Sounds are unavailable in this browser.';stopAutomaticStart();}
  document.addEventListener('visibilitychange',apply);
  window.addEventListener('pagehide',()=>{clearTimeout(suspendTimer);if(context)context.close().catch(()=>{});});
  state();
  return {update(nextHour,nextScene){
    hour=nextHour;scene=nextScene;
    if(!context||context.currentTime-lastUpdate<.25)return;
    lastUpdate=context.currentTime;apply();
    analyser.getFloatTimeDomainData(samples);
    button.dataset.audio=JSON.stringify({state:context.state,enabled,layers:layers.filter(Boolean).length,birdCalls:birdCount,birdActive:!!bird,forestCalls:callCount,callActive:!!call,callLoaded:!!callBuffer,rms:Number(Math.sqrt(samples.reduce((a,x)=>a+x*x,0)/samples.length).toFixed(6))});
  }};
}
