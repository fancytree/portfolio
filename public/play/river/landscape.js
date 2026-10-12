import * as THREE from 'three';
import {mistGLSL} from './sky.js';

export const environments = [
  { name: 'Source', label: 'Mountain lake', description: 'Every journey begins in stillness.', image: 'land-alpine-v2.png', shore: .49, radius: 350, scale: .90, depth: 1.25, waves: .70, clouds: .55, tint: '#294744' },
  { name: 'Flow', label: 'Woodland river', description: 'Through the trees, carrying the light onward.', image: 'land-forest.png', shore: .495, radius: 270, scale: 1.08, depth: .68, waves: .53, clouds: .67, tint: '#304d3f' },
  { name: 'Confluence', label: 'Open estuary', description: 'Beyond the bends, the world opens wide.', image: 'land-estuary.png', bankCurve: .35, shore: .310, radius: 450, scale: 1.1, depth: 2.0, waves: 1.15, clouds: .36, tint: '#294756' },
];

// The alpha channel is the authored landscape boundary. It is also sampled
// for source occlusion, so a sun behind the ridge cannot light the water.
function skyline(image, samples=512){
  const canvas=document.createElement('canvas');canvas.width=samples;canvas.height=Math.round(samples*image.height/image.width);
  const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,canvas.width,canvas.height);
  const {data}=ctx.getImageData(0,0,canvas.width,canvas.height),height=canvas.height;
  const profile=[],shore=[];
  for(let x=0;x<samples;x++){
    let first=0,last=height-1;
    while(first<height&&data[(first*samples+x)*4+3]<150)first++;
    while(last>first&&data[(last*samples+x)*4+3]<150)last--;
    profile.push(first/height);shore.push((last+.5)/height);
  }
  profile.shore=shore.map((_,x)=>{
    const neighborhood=shore.slice(Math.max(0,x-4),Math.min(samples,x+5)).sort((a,b)=>a-b);
    return neighborhood[Math.floor(neighborhood.length/2)];
  });return profile;
}

export function bankRadius(config,u){
  const angle=Math.abs((u-.5)*1.9);
  const edge=Math.min(angle/.60,1);
  return config.radius/(1+(config.bankCurve??7)*Math.pow(edge,2.8))*(1+.035*Math.sin(u*19)+.018*Math.sin(u*43));
}

async function makeRockBank(config,shared,loader){
  const map=await loader.loadAsync('./assets/pebbles-color.jpg');
  map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.anisotropy=8;
  const columns=512,rows=10,positions=[],uvs=[],indices=[];
  for(let y=0;y<=rows;y++)for(let x=0;x<=columns;x++){
    const u=x/columns,v=y/rows,theta=(u-.5)*1.9;
    const rough=Math.sin(u*73)*.4+Math.sin(u*193)*.18+Math.sin(u*367)*.08;
    const width=5+3*Math.sin(u*31)**2;
    const radius=bankRadius(config,u)-v*width;
    // Keep this support beneath the water: visible rocks come from the detailed terrain.
    const crest=-.12+rough*.10;
    const height=crest*(1-v)-v*v*2.4+Math.sin(v*14+u*219)*.18*Math.sin(v*Math.PI);
    positions.push(Math.sin(theta)*radius,height,-Math.cos(theta)*radius);
    uvs.push(u*config.radius/5,v*1.4);
  }
  for(let y=0;y<rows;y++)for(let x=0;x<columns;x++){
    const a=y*(columns+1)+x,b=a+columns+1;indices.push(a,b,a+1,a+1,b,b+1);
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeVertexNormals();
  const material=new THREE.ShaderMaterial({side:THREE.DoubleSide,uniforms:{...shared,map:{value:map}},
    vertexShader:`varying vec2 vUv;varying vec3 pos,n;void main(){vUv=uv;pos=position;n=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying vec2 vUv;varying vec3 pos,n;uniform sampler2D map;uniform vec3 lightColor,sunDirection;uniform float daylight,warm,time;
      ${mistGLSL}
      void main(){
        vec3 tex=texture2D(map,vUv).rgb;float gray=dot(tex,vec3(.21,.72,.07));
        vec3 stone=mix(vec3(gray),tex,.35)*vec3(.72,.75,.69);
        float wet=1.-smoothstep(-.1,.65,pos.y);
        float facing=max(dot(normalize(n),sunDirection),0.);
        vec3 light=mix(vec3(.012,.020,.035),vec3(.22,.29,.32)+lightColor*facing*.65,daylight);
        gl_FragColor=vec4(throughMist(stone*light*mix(1.,.50,wet),cameraPosition,pos),1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`});
  return new THREE.Mesh(geometry,material);
}

export async function makeLandscape(config, shared, loader) {
  const texture = await loader.loadAsync(`./assets/${config.image}`);
  texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4;
  const profile = skyline(texture.image), columns=profile.length-1, rows=32;
  const positions=[],uvs=[],indices=[];
  for(let y=0;y<=rows;y++)for(let x=0;x<=columns;x++){
    const u=x/columns, v=y/rows, theta=(u-.5)*1.9;
    // Curving banks approach the camera at the edges; the centre stays distant.
    const shoreRadius=bankRadius(config,u);
    const top=Math.max(0,profile[x]-.01), shore=profile.shore[x];
    const above=Math.min(v/.94,1.);
    const imageY=THREE.MathUtils.lerp(top,Math.max(top,shore-.006),above);
    const radius=shoreRadius*(1+.025*Math.sin(u*13)*Math.sin(above*Math.PI));
    // Carry the opaque bank beneath the surface, eliminating a cutout seam at y=0.
    const contactRelief=-.65+.42*Math.sin(u*31)+.23*Math.sin(u*89)+.10*Math.sin(u*173);
    const height=(1-above)*(shore-top)*shoreRadius*config.scale+contactRelief
      -Math.max(0,v-.94)/.06*30.;
    positions.push(Math.sin(theta)*radius,height,-Math.cos(theta)*radius);
    uvs.push(u,1-imageY);
  }
  for(let y=0;y<rows;y++)for(let x=0;x<columns;x++){
    const a=y*(columns+1)+x,b=a+columns+1;indices.push(a,b,a+1,a+1,b,b+1);
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeVertexNormals();
  const material=new THREE.ShaderMaterial({side:THREE.DoubleSide, uniforms:{...shared,map:{value:texture}},
    vertexShader:`varying vec2 vUv;varying vec3 vWorld;void main(){vUv=uv;vWorld=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying vec2 vUv;varying vec3 vWorld;uniform sampler2D map;uniform vec3 sunDirection,moonDirection,lightColor;uniform float daylight,warm,time;
      ${mistGLSL}
      void main(){
        vec4 tex=texture2D(map,vUv);if(tex.a<.75)discard;vec3 base=tex.rgb;
        float face=.65+.35*clamp(.5+sunDirection.x*(vUv.x-.5)*2.,0.,1.);
        vec3 illumination=mix(vec3(.018,.026,.055),mix(vec3(.9,.96,1.05),lightColor,warm*.68)*face,daylight);
        // Low-angle light leaves the valley in shadow while the sky stays luminous.
        illumination*=mix(1.,.62+.38*smoothstep(.035,.24,sunDirection.y),warm*daylight);
        float wet=1.-smoothstep(-.25,1.4,vWorld.y);
        vec3 color=base*illumination*mix(1.,.65,wet);
        color=throughMist(color,cameraPosition,vWorld);
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`});
  const backdrop=new THREE.Mesh(geometry,material);backdrop.frustumCulled=false;
  const mesh=new THREE.Group();mesh.add(backdrop,await makeRockBank(config,shared,loader));
  const horizonData=new Uint8Array(profile.length*4);
  profile.forEach((height,i)=>{
    const angle=Math.atan(Math.max(0,(profile.shore[i]-height)*config.scale));
    horizonData[i*4]=Math.round(angle/(Math.PI/2)*255);horizonData[i*4+3]=255;
  });
  const horizonMap=new THREE.DataTexture(horizonData,profile.length,1);horizonMap.needsUpdate=true;
  horizonMap.minFilter=horizonMap.magFilter=THREE.LinearFilter;
  return {mesh,profile,config,horizonMap,visibility(direction){
    const theta=Math.atan2(direction.x,-direction.z),u=theta/1.9+.5;
    if(u<0||u>1)return THREE.MathUtils.smoothstep(direction.y,-.02,.02);
    const i=Math.min(profile.length-2,Math.floor(u*(profile.length-1))), f=u*(profile.length-1)-i;
    const horizon=(THREE.MathUtils.lerp(profile.shore[i],profile.shore[i+1],f)-THREE.MathUtils.lerp(profile[i],profile[i+1],f))*config.scale;
    const elevation=direction.y/Math.hypot(direction.x,direction.z);
    return THREE.MathUtils.smoothstep(elevation-horizon,-.015,.015);
  }};
}
