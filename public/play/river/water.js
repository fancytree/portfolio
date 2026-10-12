import * as THREE from 'three';
import { mistGLSL } from './sky.js';
import { Water } from 'three/addons/objects/Water.js';

const heightSampling=`
    // Cubic reconstruction makes derivatives continuous between simulation cells.
    float heightAt(vec2 uv){
      vec2 q=clamp(uv,vec2(texel*2.),vec2(1.-texel*2.))/texel-.5;
      vec2 f=fract(q),base=floor(q),g=1.-f;
      vec2 w0=g*g*g/6.,w1=(3.*f*f*f-6.*f*f+4.)/6.;
      vec2 w2=(-3.*f*f*f+3.*f*f+3.*f+1.)/6.,w3=f*f*f/6.;
      vec2 a=w0+w1,b=w2+w3;
      vec2 lo=(base-.5+w1/a)*texel,hi=(base+1.5+w3/b)*texel;
      float v=texture2D(heightMap,lo).r*a.x*a.y
        +texture2D(heightMap,vec2(hi.x,lo.y)).r*b.x*a.y
        +texture2D(heightMap,vec2(lo.x,hi.y)).r*a.x*b.y
        +texture2D(heightMap,hi).r*b.x*b.y;
      return mix(v,(v-.5)*2.,packed);
    }
`;

// Identical continuous wave heights and derivatives feed geometry, reflection
// normals and bed caustics. Mid-scale wind waves remain active without input.
const ambientWaves=`
vec3 windWave(vec2 p,vec2 k,float amplitude,float speed,float seed,float footprint){
  vec2 bend=vec2(.13,.09);
  float bendPhase=dot(p,bend)+time*.075+seed;
  float phase=dot(p,k)+time*speed+sin(bendPhase)*.42;
  vec2 gradient=k+bend*(.42*cos(bendPhase));
  float resolved=1.-smoothstep(.65,2.1,length(gradient)*footprint);
  return vec3(sin(phase),cos(phase)*gradient)*amplitude*resolved;
}
vec3 ambientWaveField(vec2 p,float footprint){
  vec3 w=windWave(p,vec2(.22,.78),.115,.975,.4,footprint);
  w+=windWave(p,vec2(-.38,.52),.060,.650,2.1,footprint);
  w+=windWave(p,vec2(.35,2.3),.042,1.725,4.3,footprint);
  w+=windWave(p,vec2(-.8,3.4),.020,2.55,7.2,footprint);
  w+=windWave(p,vec2(1.2,5.2),.007,3.9,9.8,footprint);
  return w*waveStrength;
}
`;

const waveSampling=`
${ambientWaves}
// Smooth triangular gradient field; returns height and its analytic derivatives.
vec3 waterNoise(vec2 p){
  vec2 cell=floor(p+(p.x+p.y)*.3660254038);
  vec2 a=p-cell+(cell.x+cell.y)*.2113248654;
  vec2 stepCorner=a.x>a.y?vec2(1.,0.):vec2(0.,1.);
  vec3 result=vec3(0.);
  for(int j=0;j<3;j++){
    vec2 offset=j==0?vec2(0.):(j==1?stepCorner:vec2(1.));
    vec2 d=a-offset+(offset.x+offset.y)*.2113248654;
    float angle=fract(sin(dot(cell+offset,vec2(127.1,311.7)))*43758.5453)*6.2831853;
    vec2 g=vec2(cos(angle),sin(angle));
    float w=max(0.,.5-dot(d,d)),projection=dot(g,d);
    float w2=w*w,w3=w2*w,w4=w2*w2;
    result+=vec3(w4*projection,w4*g-8.*w3*projection*d);
  }
  return result*70.;
}
vec2 surfaceSlope(vec2 p){
      // Fade unresolved distant waves instead of generating a glittering grid.
      float waveFootprint=max(length(dFdx(p)),length(dFdy(p)));
      vec2 slope=ambientWaveField(p,waveFootprint).yz;
      for(int i=0;i<2;i++){
        float fi=float(i),frequency=.24*pow(2.1,fi);
        float angle=fi*1.71+.37;mat2 rotation=mat2(cos(angle),sin(angle),-sin(angle),cos(angle));
        vec2 q=rotation*(p+vec2(0.,time*1.25));
        q*=vec2(.78,1.32)*frequency;
        q+=vec2(fi*17.1,fi*9.7);
        vec3 field=waterNoise(q);
        vec2 gradient=field.yz*vec2(.78,1.32)*frequency;
        // Transpose rotation maps the analytic gradient back to world coordinates.
        gradient=vec2(dot(rotation[0],gradient),dot(rotation[1],gradient));
        float footprint=max(length(dFdx(q)),length(dFdy(q)));
        float visible=1.-smoothstep(.35,1.1,footprint);
        slope+=gradient*.055*pow(.22,fi)*waveStrength*visible;
      }
      vec2 uv=(p-area.xy)/area.zw;
      float inside=step(0.,uv.x)*step(uv.x,1.)*step(0.,uv.y)*step(uv.y,1.);
      vec2 ripple=vec2(heightAt(uv+vec2(texel,0))-heightAt(uv-vec2(texel,0)),heightAt(uv+vec2(0,texel))-heightAt(uv-vec2(0,texel)))/(2.*texel*area.z);
      slope+=ripple*inside*2.3;
return slope;
}`;

export function makeWater(simulation, shared, reflectionSize=768) {
  // Concentrate triangles around the viewer while retaining a distant water horizon.
  const surface=new THREE.PlaneGeometry(2,2,192,192);
  const vertices=surface.attributes.position;
  for(let i=0;i<vertices.count;i++){
    const spread=v=>Math.sign(v)*(Math.abs(v)*24+Math.pow(Math.abs(v),5)*776);
    vertices.setXY(i,spread(vertices.getX(i)),spread(vertices.getY(i)));
  }
  surface.computeBoundingSphere();
  const water=new Water(surface,{textureWidth:reflectionSize,textureHeight:reflectionSize,clipBias:0});
  water.rotation.x=-Math.PI/2;
  const uniforms=water.material.uniforms;
  // Filter the reflected image at the projected pixel footprint. Without a mip
  // pyramid, grazing foliage can alias into isolated bright horizontal strokes.
  uniforms.mirrorSampler.value.generateMipmaps=true;
  uniforms.mirrorSampler.value.minFilter=THREE.LinearMipmapLinearFilter;
  Object.assign(uniforms,shared,{
    horizonMap:{value:null},heightMap:{value:simulation.read.texture}, area:{value:simulation.area}, texel:{value:1/simulation.size},
    packed:{value:simulation.float?0:1},refracted:{value:null},refractedDepth:{value:null},
    refractionMatrix:{value:new THREE.Matrix4()},inverseRefractionMatrix:{value:new THREE.Matrix4()},resolution:{value:new THREE.Vector2()},cameraNear:{value:.1},cameraFar:{value:2200},
    shoreRadius:{value:350},bankCurve:{value:7},waveStrength:{value:.7},sourceVisibility:{value:new THREE.Vector2(1,1)},waterTint:{value:new THREE.Color('#23433e')},
  });
  water.material.lights=false;
  water.material.vertexShader=`uniform mat4 textureMatrix;uniform float time,waveStrength,texel,packed,shoreRadius,bankCurve;uniform sampler2D heightMap;uniform vec4 area;
    ${heightSampling}
    ${ambientWaves}
    varying vec4 mirrorCoord;varying vec3 world;
    void main(){
      vec4 p=modelMatrix*vec4(position,1.);
      float bankU=atan(p.x,-p.z)/1.9+.5;
      float edge=min(abs((bankU-.5)*1.9)/.60,1.);
      float radius=shoreRadius/(1.+bankCurve*pow(edge,2.8))
        *(1.+.035*sin(bankU*19.)+.018*sin(bankU*43.));
      float shoreFade=mix(1.,smoothstep(1.,12.,radius-length(p.xz)),step(0.,bankU)*step(bankU,1.));
      float nearDisplacement=1.-smoothstep(28.,110.,distance(p.xyz,cameraPosition));
      p.y+=shoreFade*nearDisplacement*ambientWaveField(p.xz,0.).x;
      vec2 simUv=(p.xz-area.xy)/area.zw;
      float inside=step(0.,simUv.x)*step(simUv.x,1.)*step(0.,simUv.y)*step(simUv.y,1.);
      p.y+=heightAt(simUv)*inside*1.8*shoreFade;
      world=p.xyz;mirrorCoord=textureMatrix*p;gl_Position=projectionMatrix*viewMatrix*p;
    }`;
  water.material.fragmentShader=`
    precision highp float;
    varying vec4 mirrorCoord;varying vec3 world;
    uniform sampler2D mirrorSampler,heightMap,refracted,refractedDepth,sourceCloud,skyEnvironment,horizonMap;
    uniform vec3 eye,sunDirection,moonDirection,lightColor,waterTint;
    uniform mat4 textureMatrix,refractionMatrix,inverseRefractionMatrix;
    uniform vec4 area;uniform vec2 resolution,sourceVisibility;
    uniform float time,daylight,night,warm,waveStrength,texel,packed,cameraNear,cameraFar,shoreRadius,bankCurve;
    ${mistGLSL}
    #include <packing>
    ${heightSampling}
    ${waveSampling}
    float bankRadiusAt(vec2 point){
      float u=atan(point.x,-point.y)/1.9+.5;
      float edge=min(abs((u-.5)*1.9)/.60,1.);
      return shoreRadius/(1.+bankCurve*pow(edge,2.8))
        *(1.+.035*sin(u*19.)+.018*sin(u*43.));
    }
    float waterHighlight(vec3 normal,vec3 view,vec3 light,float roughness){
      vec3 halfVector=normalize(view+light);
      float nv=max(dot(normal,view),.001),nl=max(dot(normal,light),.001);
      float nh=max(dot(normal,halfVector),0.),vh=max(dot(view,halfVector),0.);
      float a2=roughness*roughness;
      float d=nh*nh*(a2-1.)+1.;
      float distribution=a2/(3.14159265*d*d);
      float visibility=.5/(nl*sqrt(nv*nv*(1.-a2)+a2)+nv*sqrt(nl*nl*(1.-a2)+a2));
      float reflectance=.0204+.9796*pow(1.-vh,5.);
      return distribution*visibility*reflectance*nl;
    }
    void main(){
      vec3 toEye=eye-world;float distanceToEye=length(toEye);vec3 V=normalize(toEye);
      vec2 p=world.xz;
      float bankU=atan(p.x,-p.y)/1.9+.5;
      float bankEdge=min(abs((bankU-.5)*1.9)/.60,1.);
      float bankRadius=shoreRadius/(1.+bankCurve*pow(bankEdge,2.8))
        *(1.+.035*sin(bankU*19.)+.018*sin(bankU*43.));
      float bankDistance=max(0.,bankRadius-length(p));
      float bankCoverage=step(0.,bankU)*step(bankU,1.);
      float bankFootprint=max(18.,fwidth(bankDistance)*4.);
      float bankBlend=(1.-smoothstep(0.,bankFootprint,bankDistance))*bankCoverage;
      vec2 slope=surfaceSlope(p)*mix(1.,.08,bankBlend);
      slope*=mix(.20,1.,smoothstep(.015,.20,V.y));
      vec3 N=normalize(vec3(-slope.x,1.,-slope.y));
      vec2 baseReflection=mirrorCoord.xy/mirrorCoord.w;
      vec3 reflectedRay=reflect(-V,N);
      float visibleEnvironment=smoothstep(-.025,.015,reflectedRay.y);
      // The planar capture contains the scene above water only.
      // Keep grazing facets on the captured horizon instead of sampling beneath it.
      reflectedRay.y=max(.006,reflectedRay.y);reflectedRay=normalize(reflectedRay);
      // Project a point along the reflected ray through the actual reflection camera.
      float travel=mix(180.,1000.,smoothstep(.02,.22,reflectedRay.y));
      vec4 reflectionPoint=textureMatrix*vec4(world+reflectedRay*travel,1.);
      vec2 reflectedUv=reflectionPoint.xy/max(reflectionPoint.w,.001);
      float border=min(min(reflectedUv.x,1.-reflectedUv.x),min(reflectedUv.y,1.-reflectedUv.y));
      reflectedUv=mix(baseReflection,reflectedUv,smoothstep(0.,.035,border)*.65);
      reflectedUv=mix(reflectedUv,baseReflection,bankBlend);
      // Integrate a small reflection footprint to suppress subpixel foliage sparkle.
      // The wave normal remains sharp, so interactive crests retain their silhouette.
      vec2 reflectionUv=clamp(reflectedUv,.004,.996);
      
      vec2 blur=mix(mix(vec2(1.4,2.0),vec2(.45,.7),smoothstep(.06,.22,reflectedRay.y)),vec2(.75,.5),bankBlend)/float(${reflectionSize});
      vec3 reflected=texture2D(mirrorSampler,reflectionUv).rgb*.20;
      reflected+=(texture2D(mirrorSampler,reflectionUv+vec2(blur.x,0.)).rgb
        +texture2D(mirrorSampler,reflectionUv-vec2(blur.x,0.)).rgb
        +texture2D(mirrorSampler,reflectionUv+vec2(0.,blur.y)).rgb
        +texture2D(mirrorSampler,reflectionUv-vec2(0.,blur.y)).rgb)*.12;
      reflected+=(texture2D(mirrorSampler,reflectionUv+blur).rgb
        +texture2D(mirrorSampler,reflectionUv-blur).rgb
        +texture2D(mirrorSampler,reflectionUv+vec2(blur.x,-blur.y)).rgb
        +texture2D(mirrorSampler,reflectionUv+vec2(-blur.x,blur.y)).rgb)*.08;
      // Correct planar-reflection parallax against the actual curved bank.
      // The above-water capture supplies the lit terrain at that ray hit; depth
      // validation rejects sky, hidden points, and off-screen reconstruction.
      float lower=0.,upper=1400.;
      for(int bankStep=0;bankStep<10;bankStep++){
        float travelToBank=(lower+upper)*.5;
        vec2 point=p+reflectedRay.xz*travelToBank;
        if(length(point)<bankRadiusAt(point))lower=travelToBank;else upper=travelToBank;
      }
      vec3 bankHit=world+reflectedRay*(lower+upper)*.5;
      float hitU=atan(bankHit.x,-bankHit.z)/1.9+.5;
      vec4 bankClip=refractionMatrix*vec4(bankHit,1.);
      vec2 bankUv=bankClip.xy/max(bankClip.w,.001)*.5+.5;
      float hitBorder=min(min(bankUv.x,1.-bankUv.x),min(bankUv.y,1.-bankUv.y));
      if(hitU>0.&&hitU<1.&&hitBorder>.005&&bankClip.w>0.){
        float capturedDepth=texture2D(refractedDepth,bankUv).r;
        vec4 capturedWorld=inverseRefractionMatrix*vec4(bankUv*2.-1.,capturedDepth*2.-1.,1.);
        capturedWorld.xyz/=capturedWorld.w;
        float tolerance=max(2.,upper*.035);
        float matches=(1.-smoothstep(tolerance,tolerance*2.,distance(capturedWorld.xyz,bankHit)))
          *smoothstep(.02,.3,capturedWorld.y)*(1.-step(.99999,capturedDepth));
        vec3 bankReflection=texture2D(refracted,bankUv,mix(.5,2.5,1.-bankBlend)).rgb;
        reflected=mix(reflected,bankReflection,matches*smoothstep(.005,.025,hitBorder));
      }
      // Use full sky radiance for rays that actually clear the curved bank.
      // Terrain keeps its separately filtered planar reflection and contact blend.
      float ridge=texture2D(horizonMap,vec2(clamp(hitU,0.,1.),.5)).r*1.57079633;
      float rayElevation=atan(bankHit.y,max(length(bankHit.xz),.01));
      float skyVisible=smoothstep(ridge+.004,ridge+.012,rayElevation);
      if(hitU<0.||hitU>1.)skyVisible=1.;
      vec2 skyUv=vec2(atan(reflectedRay.x,-reflectedRay.z)/6.2831853+.5,asin(clamp(reflectedRay.y,-1.,1.))/3.14159265+.5);
      vec3 skyRadiance=texture2D(skyEnvironment,skyUv).rgb;
      reflected=mix(reflected,skyRadiance,skyVisible*(1.-bankBlend));
      // Compress broad bright environment reflections without lifting dark banks.
      float reflectionLuminance=dot(reflected,vec3(.2126,.7152,.0722));
      reflected/=1.+max(0.,reflectionLuminance-.45)*.65;
      reflected*=1.-.20*bankCoverage*(1.-smoothstep(0.,3.,bankDistance));
      vec2 screenUv=gl_FragCoord.xy/resolution;
      float initialDepth=texture2D(refractedDepth,screenUv).x;
      float initialThickness=max(0.,perspectiveDepthToViewZ(gl_FragCoord.z,cameraNear,cameraFar)
        -perspectiveDepthToViewZ(initialDepth,cameraNear,cameraFar));
      vec3 transmittedRay=refract(-V,N,1./1.333);
      vec4 transmittedPoint=refractionMatrix*vec4(world+transmittedRay*min(initialThickness,20.),1.);
      vec2 candidateUv=transmittedPoint.xy/max(transmittedPoint.w,.001)*.5+.5;
      vec3 flatRay=refract(-V,vec3(0.,1.,0.),1./1.333);
      vec4 flatPoint=refractionMatrix*vec4(world+flatRay*min(initialThickness,20.),1.);
      vec2 flatUv=flatPoint.xy/max(flatPoint.w,.001)*.5+.5;
      // The render target has no off-screen bed data. Fade to the undistorted
      // sample before the ray exits, never smear a clamped border texel.
      float refractionBorder=min(min(candidateUv.x,1.-candidateUv.x),min(candidateUv.y,1.-candidateUv.y));
      float screenBorder=min(min(screenUv.x,1.-screenUv.x),min(screenUv.y,1.-screenUv.y));
      float available=smoothstep(.015,.10,refractionBorder)*smoothstep(.015,.10,screenBorder);
      // Limit the mean refraction separately: a saturated mean offset must not
      // consume all of the displacement range available to a passing ripple.
      vec2 meanOffset=flatUv-screenUv,waveOffset=candidateUv-flatUv;
      meanOffset*=min(1.,.008/max(length(meanOffset),.0001));
      waveOffset*=min(1.,.014/max(length(waveOffset),.0001));
      vec2 refractUv=screenUv+(meanOffset+waveOffset)*available;
      // Prevent the refraction offset from pulling foreground land into the lake.
      float trialZ=perspectiveDepthToViewZ(texture2D(refractedDepth,refractUv).x,cameraNear,cameraFar);
      float waterZ=perspectiveDepthToViewZ(gl_FragCoord.z,cameraNear,cameraFar);
      if(trialZ>waterZ)refractUv=screenUv;
      float depth=texture2D(refractedDepth,refractUv).x;
      float floorZ=perspectiveDepthToViewZ(depth,cameraNear,cameraFar);
      float surfaceZ=perspectiveDepthToViewZ(gl_FragCoord.z,cameraNear,cameraFar);
      float thickness=clamp(surfaceZ-floorZ,0.,30.);
      vec3 transmission=exp(-vec3(.40,.24,.18)*thickness);
      vec3 body=texture2D(refracted,refractUv).rgb*transmission+waterTint*(1.-transmission)*mix(.12,.55,daylight);
      body=throughMist(body,eye,world);
      float facing=max(dot(N,V),.0);
      float fresnel=.0204+.9796*pow(1.-facing,5.);
      // At contact, reflection must converge to the visible bank, not to sky
      // outside the planar capture. Reconstruct terrain height from scene depth.
      float bankContact=0.;
      for(int edgeSample=1;edgeSample<=3;edgeSample++){
        vec2 bankUv=screenUv+vec2(0.,float(edgeSample)*2./resolution.y);
        float bankDepth=texture2D(refractedDepth,bankUv).r;
        vec4 bankWorld=inverseRefractionMatrix*vec4(bankUv*2.-1.,bankDepth*2.-1.,1.);
        bankWorld.xyz/=bankWorld.w;
        float isLand=smoothstep(-.05,.20,bankWorld.y)*(1.-step(.99999,bankDepth));
        float weight=isLand*(1.-float(edgeSample-1)/3.);
        bankContact=max(bankContact,weight);
      }
      // The contact footprint is occluded by the bank. Fade into transmitted
      // water colour rather than copying bright rock texels into a glowing rim.
      float contactWater=smoothstep(.05,2.5,initialThickness);
      vec3 color=mix(body,reflected,fresnel*visibleEnvironment*contactWater*(1.-bankContact)*(1.-bankBlend*.92));
      float variance=max(dot(dFdx(N),dFdx(N)),dot(dFdy(N),dFdy(N)));
      // Integrate a finite light source rather than a sparkling point light.
      // Keep the accepted dark shoreline: no direct highlight inside its blend.
      float roughness=sqrt(.0016+variance*.4);
      float lightFootprint=contactWater*(1.-bankContact)*pow(1.-bankBlend,2.)*exp(-mistOpticalDepth(eye,world));
      float sunGlint=waterHighlight(N,V,sunDirection,roughness);
      float solarVisibility=sourceVisibility.x*texture2D(sourceCloud,vec2(.25,.5)).r*daylight*smoothstep(-.015,.03,sunDirection.y);
      float sunEnergy=sunGlint*.065;
      color+=solarVisibility*lightColor*(sunEnergy/(1.+sunEnergy*.35))*lightFootprint;
      float moonGlint=waterHighlight(N,V,moonDirection,max(.05,roughness));
      float moonEnergy=moonGlint*.018;
      color+=vec3(.62,.73,1.)*(moonEnergy/(1.+moonEnergy*.8))*sourceVisibility.y*texture2D(sourceCloud,vec2(.75,.5)).r*(1.-daylight)*lightFootprint;
      gl_FragColor=vec4(max(color,vec3(.001)),1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`;
  water.material.needsUpdate=true;
  return water;
}

export async function makeBed(loader,shared,simulation) {
  const [map,normalMap,heightMap]=await Promise.all(['pebbles-color.jpg','pebbles-normal.jpg','pebbles-height.jpg'].map(f=>loader.loadAsync(`./assets/${f}`)));
  map.colorSpace=THREE.SRGBColorSpace;
  for(const texture of [map,normalMap,heightMap]){texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=8;}
  const uniforms={...shared,map:{value:map},normalMap:{value:normalMap},relief:{value:heightMap},depth:{value:1.25},waveStrength:{value:.7},texel:{value:1/simulation.size},sourceVisibility:{value:new THREE.Vector2(1,1)},
    heightMap:{value:simulation.read.texture},area:{value:simulation.area},packed:{value:simulation.float?0:1}};
  const geometry=new THREE.PlaneGeometry(180,180,256,256);geometry.rotateX(-Math.PI/2);geometry.translate(0,0,-55);
  const material=new THREE.ShaderMaterial({uniforms,side:THREE.DoubleSide,
    vertexShader:`uniform sampler2D relief;uniform float depth;varying vec3 world;varying vec2 vUv;
      void main(){vec3 p=position;p.y=-depth-max(0.,-p.z)*.006+texture2D(relief,p.xz/8.).r*.18;
        world=p;vUv=p.xz/8.;gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);}`,
    fragmentShader:`varying vec3 world;varying vec2 vUv;uniform sampler2D map,normalMap,heightMap;uniform vec4 area;
      uniform vec3 sunDirection,moonDirection,lightColor;uniform float daylight,time,packed,texel,waveStrength;uniform vec2 sourceVisibility;
      ${heightSampling}
      ${waveSampling}
      void main(){
        vec3 tex=texture2D(map,vUv).rgb;vec3 n=texture2D(normalMap,vUv).xyz*2.-1.;n=normalize(vec3(n.x,n.z,n.y));
        float direct=max(dot(n,sunDirection),0.);
        // Preserve a readable, cool riverbed in the near field at night.
        // This fill fades before the distant bank and never changes daylight exposure.
        float nearBed=1.-smoothstep(9.,38.,length(world.xz-cameraPosition.xz));
        float skyFacing=.60+.40*max(n.y,0.);
        vec3 nightFill=mix(vec3(.035,.055,.082),vec3(.16,.235,.285),nearBed)*skyFacing;
        vec3 illumination=mix(nightFill,vec3(.25,.34,.39)+lightColor*direct*.70,daylight);
        vec2 p=world.xz;
        // Estimate light concentration from the refracted footprint of the same wave field.
        vec2 slope=surfaceSlope(p);
        vec3 waterNormal=normalize(vec3(-slope.x,1.,-slope.y));
        vec3 ray=refract(-sunDirection,waterNormal,1./1.333);
        vec2 landing=p+ray.xz*max(.1,-world.y)/max(.12,-ray.y);
        vec2 du=dFdx(p),dv=dFdy(p),lu=dFdx(landing),lv=dFdy(landing);
        float before=abs(du.x*dv.y-du.y*dv.x);
        float after=abs(lu.x*lv.y-lu.y*lv.x);
        float concentration=clamp(before/max(after,before*.3+1e-7),.4,3.);
        float caustic=(concentration-1.)*.12*sourceVisibility.x;
        vec3 color=tex*illumination*(1.+caustic*daylight);
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`});
  const stoneGeometry=new THREE.IcosahedronGeometry(1,2);
  const positions=stoneGeometry.attributes.position;
  for(let i=0;i<positions.count;i++){
    const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i);
    const r=1+.08*Math.sin(x*9+y*5)*Math.sin(z*7-x*4);
    positions.setXYZ(i,x*r,y*r,z*r);
  }
  stoneGeometry.computeVertexNormals();
  // Match the bed's illumination and world-space material at every stone contact.
  // A separate standard material used a much darker lighting model than the bed.
  const stoneMaterial=new THREE.ShaderMaterial({uniforms,
    vertexShader:`varying vec3 world,stoneNormal;varying vec2 vUv;
      void main(){
        mat3 basis=mat3(instanceMatrix);
        vec3 scaleSquared=vec3(dot(basis[0],basis[0]),dot(basis[1],basis[1]),dot(basis[2],basis[2]));
        stoneNormal=normalize(mat3(modelMatrix)*basis*(normal/scaleSquared));
        vec4 p=modelMatrix*instanceMatrix*vec4(position,1.);
        world=p.xyz;vUv=world.xz/8.;gl_Position=projectionMatrix*viewMatrix*p;
      }`,
    fragmentShader:material.fragmentShader
      .replace('varying vec3 world;', 'varying vec3 world,stoneNormal;')
      .replace('float direct=max(dot(n,sunDirection),0.);',
        'n=normalize(stoneNormal+vec3(n.x,0.,n.z)*.16);float direct=max(dot(n,sunDirection),0.);')
  });
  const stones=new THREE.InstancedMesh(stoneGeometry,stoneMaterial,1200),dummy=new THREE.Object3D();
  let seed=92813;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const stoneData=[];
  for(let i=0;i<1200;i++){
    const x=(random()-.5)*40,z=12-random()*65,r=.06+Math.pow(random(),2)*.29;
    stoneData.push({x,z,r,angle:random()*Math.PI,stretch:.8+random()*.6});
    stones.setColorAt(i,new THREE.Color().setRGB(.83+random()*.17,.82+random()*.17,.80+random()*.17));
  }
  // The detailed bed covers the foreground. A continuous lower basin closes
  // the gap to distant banks so the refraction pass never sees sky beneath land.
  const basin=new THREE.Mesh(new THREE.PlaneGeometry(2200,2200),
    new THREE.MeshStandardMaterial({color:'#25332e',roughness:1}));
  basin.rotation.x=-Math.PI/2;basin.position.z=-400;
  const setDepth=depth=>{
    uniforms.depth.value=depth;basin.position.y=-depth-3.;
    stoneData.forEach((s,i)=>{
      dummy.position.set(s.x,-depth-Math.max(0,-s.z)*.006+.075-s.r*.22,s.z);
      dummy.rotation.set(.1,s.angle,.1);dummy.scale.set(s.r*s.stretch,s.r*.52,s.r);dummy.updateMatrix();stones.setMatrixAt(i,dummy.matrix);
    });stones.instanceMatrix.needsUpdate=true;
  };
  setDepth(1.25);
  const mesh=new THREE.Group();mesh.add(new THREE.Mesh(geometry,material),basin);
  return {mesh,uniforms,stones,setDepth};
}
