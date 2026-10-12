import * as THREE from 'three';
import { createAmbience } from './ambience.js';
import { createTimeDial } from './time-dial.js';
import { WaterSimulation } from './simulation.js';
import { skyUniforms, makeSky, updateSky, makeSourceTransmission, makeSkyEnvironment } from './sky.js';
import { environments, makeLandscape, bankRadius } from './landscape.js';
import { makeWater, makeBed } from './water.js';

const $ = selector => document.querySelector(selector);
const canvas=$('#water'),loading=$('#loading');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let renderer,scene,camera,water,simulation,bed,refraction,landscapes,shared,cursor;
let ambientLight,directionalLight,sourceTransmission,skyEnvironment;
let sceneIndex=0,nearView=false,transitioning=false;
const motion=!reducedMotion.matches;
const localHour=()=>{const now=new Date();return now.getHours()+now.getMinutes()/60+now.getSeconds()/3600;};
let targetHour=localHour(),currentHour=targetHour,elapsed=0,lastTime=0,frameHandle=0,accum=0,frameCount=0,qualityTimer=0;
let lastPointer=null,localTimeMode=true;
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),surface=new THREE.Plane(new THREE.Vector3(0,1,0),0);
const targetLook=new THREE.Vector3(0,-8,-85),look=new THREE.Vector3().copy(targetLook);
const cameraPosition=new THREE.Vector3(0,2.1,4);
const dotButtons=[];
const diagnostics={engine:`Three.js r${THREE.REVISION}`,frames:0,fps:0,scene:0,hour:12,simulationSteps:0,interactions:0};

const ambience=createAmbience();
const timeDial=createTimeDial({getHour:()=>targetHour,onChange:setTime,onLocal:goLocal});

function displayTime(){
  const total=(localTimeMode?Math.floor(targetHour*60):Math.round(targetHour*60))%1440;
  $('#timeValue').textContent=`${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;
  const h=total/60;
  $('#timePhase').textContent=h<6?'Night':h<8.5?'Dawn':h<17?'Daylight':h<19.9?'Dusk':h<20.5?'Blue hour':'Starlight';
  $('#localTime').classList.toggle('is-active',localTimeMode);
  $('#localTime').textContent=localTimeMode?'Local time':'Back to local time';
  $('#localTime').setAttribute('aria-pressed',String(localTimeMode));
  timeDial.update(targetHour,localTimeMode,$('#timeValue').textContent);
}
function setTime(value){targetHour=((value%24)+24)%24;localTimeMode=false;displayTime();}
function goLocal(){targetHour=localHour();localTimeMode=true;displayTime();}
function resize(){
  if(!renderer||!water||!refraction)return;
  const w=innerWidth,h=innerHeight;
  renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
  renderer.getDrawingBufferSize(water.material.uniforms.resolution.value);
  const size=water.material.uniforms.resolution.value;
  refraction.setSize(Math.round(size.x*.8),Math.round(size.y*.8));
}
function updateCamera(dt){
  targetLook.set(0,nearView?-2.4:-8,nearView?-4.5:-85);
  cameraPosition.set(0,nearView?2.7:2.1,4);
  const blend=1-Math.exp(-dt*(reducedMotion.matches?100:5));
  look.lerp(targetLook,blend);camera.position.lerp(cameraPosition,blend);camera.lookAt(look);
}
function updateSceneText(){
  const config=environments[sceneIndex];
  $('#sceneTitle').textContent=config.name;$('#sceneLabel').textContent=config.label;
  $('#sceneDescription').textContent=config.description;$('#sceneCount').textContent=`0${sceneIndex+1} / 03`;
  dotButtons.forEach((b,i)=>b.setAttribute('aria-current',String(i===sceneIndex)));
}
async function changeScene(index){
  const next=(index+environments.length)%environments.length;
  if(transitioning||next===sceneIndex||!landscapes)return;
  transitioning=true;$('#sceneVeil').classList.add('is-changing');
  await new Promise(resolve=>setTimeout(resolve,reducedMotion.matches?0:340));
  sceneIndex=next;landscapes.forEach((l,i)=>l.mesh.visible=i===sceneIndex);
  const config=environments[sceneIndex];
  water.material.uniforms.horizonMap.value=landscapes[sceneIndex].horizonMap;
  bed.setDepth(config.depth);water.material.uniforms.shoreRadius.value=config.radius;water.material.uniforms.bankCurve.value=config.bankCurve??7;water.material.uniforms.waveStrength.value=config.waves;
  water.material.uniforms.waterTint.value.set(config.tint);simulation.clear();lastPointer=null;
  updateSceneText();$('#sceneVeil').classList.remove('is-changing');transitioning=false;
}
function hitWater(event){
  if(!camera)return null;
  const rect=canvas.getBoundingClientRect();
  pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
  raycaster.setFromCamera(pointer,camera);
  const hit=raycaster.ray.intersectPlane(surface,new THREE.Vector3());
  if(!hit||hit.distanceTo(camera.position)>85)return null;
  const bankU=Math.atan2(hit.x,-hit.z)/1.9+.5;
  if(bankU>=0&&bankU<=1&&Math.hypot(hit.x,hit.z)>=bankRadius(environments[sceneIndex],bankU)-1)return null;
  return hit;
}
function interact(event,pressed=false){
  if(!cursor||!simulation)return;
  const hit=hitWater(event);
  cursor.visible=!!hit&&event.pointerType!=='touch';
  if(!hit){lastPointer=null;return;}
  cursor.position.set(hit.x,.028,hit.z);
  const now=performance.now();
  if(lastPointer&&now-lastPointer.time<20&&!pressed)return;
  if(motion){
    const strength=pressed?.14:event.buttons?.045:.018;
    if(lastPointer&&now-lastPointer.time<160){
      const distance=hit.distanceTo(lastPointer.hit),steps=Math.min(12,Math.ceil(distance/.16));
      if(distance<10)for(let i=1;i<steps;i++){const p=lastPointer.hit.clone().lerp(hit,i/steps);simulation.add(p.x,p.z,strength*.5,.24);}
    }
    simulation.add(hit.x,hit.z,strength,pressed?.36:.24);
    diagnostics.interactions++;
  }
  lastPointer={hit,time:now};
}
function render(now){
  if(now-lastTime<1000/60-1){frameHandle=requestAnimationFrame(render);return;}
  const rawDt=(now-lastTime)/1000||1/60;
  const dt=Math.min(.05,rawDt);lastTime=now;
  if(motion)elapsed+=dt;
  if(localTimeMode)targetHour=localHour();
  let diff=((targetHour-currentHour+36)%24)-12;
  const previousHour=currentHour;
  currentHour=reducedMotion.matches?targetHour:(currentHour+diff*(1-Math.exp(-dt*9))+24)%24;
  ambience.update(currentHour,sceneIndex);
  // Unwrapped travel remains continuous across midnight.
  shared.cloudTravel.value+=((currentHour-previousHour+36)%24)-12;
  shared.mistScale.value=[1.,.8,.55][sceneIndex];
  updateSky(shared,currentHour,elapsed,environments[sceneIndex].clouds);
  sourceTransmission.update();skyEnvironment.update();
  ambientLight.intensity=THREE.MathUtils.lerp(.015,.72,shared.daylight.value);
  directionalLight.intensity=shared.daylight.value*.8;
  directionalLight.color.copy(shared.lightColor.value);directionalLight.position.copy(shared.sunDirection.value).multiplyScalar(100);
  updateCamera(dt);camera.updateMatrixWorld();
  water.material.uniforms.refractionMatrix.value.copy(camera.projectionMatrix).multiply(camera.matrixWorldInverse);
  water.material.uniforms.inverseRefractionMatrix.value.copy(water.material.uniforms.refractionMatrix.value).invert();
  if(motion)simulation.update(dt);
  water.material.uniforms.heightMap.value=simulation.read.texture;bed.uniforms.heightMap.value=simulation.read.texture;
  water.material.uniforms.sourceVisibility.value.set(landscapes[sceneIndex].visibility(shared.sunDirection.value),landscapes[sceneIndex].visibility(shared.moonDirection.value));
  const cursorVisible=cursor.visible;
  water.visible=false;cursor.visible=false;
  renderer.setRenderTarget(refraction);renderer.render(scene,camera);
  water.visible=true;cursor.visible=cursorVisible;
  renderer.setRenderTarget(null);renderer.render(scene,camera);
  diagnostics.frames++;accum+=rawDt;frameCount++;
  if(accum>1){
    diagnostics.timeMode=localTimeMode?"local":"manual";diagnostics.fps=Math.round(frameCount/accum);diagnostics.waterTime=Number(elapsed.toFixed(2));diagnostics.hour=Number(currentHour.toFixed(2))%24;diagnostics.scene=sceneIndex;diagnostics.simulationSteps=simulation.steps;
    canvas.dataset.diagnostics=JSON.stringify(diagnostics);accum=0;frameCount=0;
    qualityTimer++;
    if(qualityTimer===8&&diagnostics.fps<32&&renderer.getPixelRatio()>1){renderer.setPixelRatio(1);resize();}
    if(localTimeMode)displayTime();
  }
  frameHandle=requestAnimationFrame(render);
}
async function start(){
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(49,innerWidth/innerHeight,.1,2200);camera.position.copy(cameraPosition);camera.lookAt(look);
  ambientLight=new THREE.HemisphereLight('#9eafbd','#263d33',.72);directionalLight=new THREE.DirectionalLight('#fff1d9',.8);scene.add(ambientLight,directionalLight);
  simulation=new WaterSimulation(renderer,1024);shared=skyUniforms();updateSky(shared,currentHour,0);
  sourceTransmission=makeSourceTransmission(renderer,shared);
  sourceTransmission.update();
  skyEnvironment=makeSkyEnvironment(renderer,shared,simulation.float);skyEnvironment.update();
  scene.add(makeSky(shared));
  const loader=new THREE.TextureLoader();
  [landscapes,bed]=await Promise.all([Promise.all(environments.map(c=>makeLandscape(c,shared,loader))),makeBed(loader,shared,simulation)]);
  landscapes.forEach((l,i)=>{l.mesh.visible=i===0;scene.add(l.mesh);});scene.add(bed.mesh,bed.stones);
  water=makeWater(simulation,shared,innerWidth<650?512:1024);water.material.uniforms.horizonMap.value=landscapes[0].horizonMap;scene.add(water);
  bed.uniforms.waveStrength=water.material.uniforms.waveStrength;
  bed.uniforms.sourceVisibility=water.material.uniforms.sourceVisibility;
  refraction=new THREE.WebGLRenderTarget(1,1,{type:simulation.float?THREE.HalfFloatType:THREE.UnsignedByteType,depthBuffer:true});
  refraction.texture.generateMipmaps=true;
  refraction.texture.minFilter=THREE.LinearMipmapLinearFilter;
  refraction.depthTexture=new THREE.DepthTexture(1,1,THREE.UnsignedIntType);
  water.material.uniforms.refracted.value=refraction.texture;water.material.uniforms.refractedDepth.value=refraction.depthTexture;
  cursor=new THREE.Mesh(new THREE.RingGeometry(.17,.183,64),new THREE.MeshBasicMaterial({color:'#edf6f3',transparent:true,opacity:.65,depthWrite:false,side:THREE.DoubleSide}));
  cursor.rotation.x=-Math.PI/2;cursor.visible=false;scene.add(cursor);
  const reflectScene=water.onBeforeRender;
  water.onBeforeRender=function(...args){const visible=cursor.visible;cursor.visible=false;reflectScene.apply(this,args);cursor.visible=visible;};
  if(localTimeMode){targetHour=localHour();currentHour=targetHour;}
  resize();displayTime();updateSceneText();
  loading.classList.add('is-done');setTimeout(()=>loading.hidden=true,700);
  lastTime=performance.now();frameHandle=requestAnimationFrame(render);
}
for(let i=0;i<environments.length;i++){
  const button=document.createElement('button');button.className='scene-dot';button.type='button';button.setAttribute('aria-label',`Go to ${environments[i].name}: ${environments[i].label}`);
  button.addEventListener('click',()=>changeScene(i));$('#sceneDots').append(button);dotButtons.push(button);
}
$('#previousScene').addEventListener('click',()=>changeScene(sceneIndex-1));$('#nextScene').addEventListener('click',()=>changeScene(sceneIndex+1));

$('#viewToggle').addEventListener('click',()=>{nearView=!nearView;$('#viewToggle').textContent=nearView?'Look ahead ↗':'A closer look ↘';$('#viewToggle').setAttribute('aria-pressed',String(nearView));lastPointer=null;});
function closeAbout(){$('#aboutPanel').hidden=true;$('#aboutToggle').setAttribute('aria-expanded','false');$('#aboutToggle').focus();}
$('#aboutToggle').addEventListener('click',()=>{$('#aboutPanel').hidden=!$('#aboutPanel').hidden;$('#aboutToggle').setAttribute('aria-expanded',String(!$('#aboutPanel').hidden));});$('#aboutClose').addEventListener('click',closeAbout);
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);interact(e,true);});
canvas.addEventListener('pointermove',e=>interact(e));canvas.addEventListener('pointerleave',()=>{if(cursor)cursor.visible=false;lastPointer=null;});
canvas.addEventListener('pointerup',e=>{if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);lastPointer=null;});
canvas.addEventListener('pointercancel',()=>{lastPointer=null;if(cursor)cursor.visible=false;});
canvas.addEventListener('wheel',e=>{e.preventDefault();setTime(targetHour+Math.max(-1,Math.min(1,e.deltaY/120))*.14);},{passive:false});
window.addEventListener('resize',resize);
window.addEventListener('keydown',e=>{if($('#timeDialog').open)return;if(e.key==='Escape')closeAbout();if(e.target instanceof HTMLInputElement)return;if(e.key==='ArrowRight')changeScene(sceneIndex+1);if(e.key==='ArrowLeft')changeScene(sceneIndex-1);});
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(frameHandle);else if(water){lastTime=performance.now();frameHandle=requestAnimationFrame(render);}});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frameHandle);loading.hidden=false;loading.classList.remove('is-done');loading.textContent='The scene was interrupted. Restoring…';});
canvas.addEventListener('webglcontextrestored',()=>location.reload());
start().catch(error=>{console.error(error);loading.textContent='The landscape could not load. Please try again.';loading.classList.add('has-error');const button=document.createElement('button');button.textContent='Reload';button.onclick=()=>location.reload();loading.append(button);});
