import * as THREE from 'three';

// Shared by the visible sky and the water's finite-source reflection. The same
// advected cloud field obscures the disc and its water highlight.
export const cloudLightingGLSL = `
  uniform float cloudiness, cloudTravel;
  float skyHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float skyNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
    return mix(mix(skyHash(i),skyHash(i+vec2(1,0)),f.x),mix(skyHash(i+vec2(0,1)),skyHash(i+1.),f.x),f.y);}
  float cloudField(vec2 p){float n=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);
    for(int i=0;i<5;i++){n+=a*skyNoise(p);p=m*p+13.5;a*=.5;}return n;}
  vec2 cloudCoordinates(vec3 ray){
    // Curved shell approximation keeps the cloud footprint finite at the horizon.
    return ray.xz/(max(ray.y,0.)+.24)*1.45+vec2(time*.008+cloudTravel*.32,time*.002+cloudTravel*.09);
  }
  float cloudDensity(vec2 p){
    return smoothstep(.43-cloudiness*.06,.75,cloudField(p));
  }
  // Six overlapping samples through a shallow cloud shell. The height envelope
  // produces billows with a solid underside and feathered upper edges.
  float cloudSlice(vec2 uv,float h){
    float envelope=smoothstep(0.,.23,h)*(1.-smoothstep(.52,1.,h));
    float broad=cloudField(uv+vec2(h*.19,h*.08));
    float detail=skyNoise(uv*6.1+vec2(h*2.3,-h*.8))*.68
      +skyNoise(uv*15.3+vec2(h*3.1,4.7))*.32;
    // Break the feathered cloud boundary into wisps without speckling its body.
    float shell=1.-smoothstep(.58,.76,broad);
    return smoothstep(.44-cloudiness*.09,.70,broad+(detail-.5)*.16*shell)*envelope;
  }
  float cloudTransmission(vec3 ray){
    vec2 uv=cloudCoordinates(ray);float optical=0.;
    for(int i=0;i<6;i++){
      float h=(float(i)+.5)/6.;
      optical+=cloudSlice(uv*(1.+h*.14),h)*.90;
    }
    return exp(-optical)*smoothstep(-.03,.025,ray.y);
  }
`;

export function makeSky(shared) {
  const material = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false,
    uniforms: shared,
    vertexShader: `varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `
      precision highp float;
      varying vec3 direction;
      uniform vec3 sunDirection, moonDirection, lightColor, zenithColor, horizonColor;
      uniform float daylight, night, warm, time, hour, eveningBlend;
      ${cloudLightingGLSL}
      vec3 rotateSky(vec3 p,float angle){
        vec3 axis=normalize(vec3(.12,.79,-.60));
        return p*cos(angle)+cross(axis,p)*sin(angle)+axis*dot(axis,p)*(1.-cos(angle));
      }
      void main(){
        vec3 d=normalize(direction);float height=max(d.y,0.);
        float solarElevation=sunDirection.y;
        float solarGate=smoothstep(-.035,.015,solarElevation);
        float lunarGate=smoothstep(-.035,.02,moonDirection.y);
        float dusk=exp(-pow((solarElevation+.035)/.11,2.));
        float facing=pow(max(dot(normalize(d.xz),normalize(sunDirection.xz))*.5+.5,0.),10.);
        float horizon=exp(-height*6.5);
        vec3 color=mix(horizonColor,zenithColor,pow(clamp(height,0.,1.),.48));
        // Directional amber at the light source, rose above it, cool upper sky.
        // This radiance is captured by the water's existing reflection pass.
        float afterglow=exp(-pow((solarElevation+.045)/.14,2.));
        vec3 amber=mix(vec3(.75,.42,.20),vec3(1.55,.46,.025),eveningBlend);
        color+=amber*warm*facing*horizon;
        // With the morning source behind the camera, its opposite horizon has a
        // soft peach belt above a cool blue base, not a second sunset beam.
        color+=vec3(.19,.085,.09)*warm*(1.-eveningBlend)*(1.-facing)*exp(-pow((height-.12)/.14,2.));
        color+=mix(vec3(.24,.13,.10),vec3(.45,.075,.026),eveningBlend)*afterglow*facing*exp(-pow((height-.18)/.15,2.))*.65;
        // Elevated clouds retain orange sunlight after the ground-level sunset.
        float ember=exp(-pow((solarElevation+.055)/.13,2.))*mix(.25,1.,eveningBlend);
        color+=vec3(1.6,.40,.015)*ember*facing*exp(-height*2.8);
        float sd=length(d-sunDirection),md=length(d-moonDirection);
        color+=lightColor*exp(-sd*5.)*.11*daylight;
        // A luminous amber opening gives the reflection a broad, coherent path.
        // Dense clouds still occlude it in the integration below.
        color+=mix(vec3(1.25,.85,.43),vec3(2.35,.82,.085),eveningBlend)*exp(-sd*5.5)*warm*daylight;
        color+=vec3(.06,.10,.22)*dusk*(.25+.75*height);
        float aa=max(length(fwidth(d)),.00025);
        float sunRadius=mix(.008,.011,warm);
        float sunDisk=1.-smoothstep(sunRadius-aa,sunRadius+aa,sd);
        float moonDisk=1.-smoothstep(.009-aa,.009+aa,md);
        color+=lightColor*(sunDisk*14.+exp(-sd*38.)*.42)*solarGate;
        // Moon texture is fixed to the disc, not to the moving screen.
        vec3 moonRight=normalize(cross(moonDirection,vec3(0,1,0)));
        vec3 moonUp=cross(moonRight,moonDirection);
        vec2 moonUv=vec2(dot(d-moonDirection,moonRight),dot(d-moonDirection,moonUp))/.009;
        float lunarSurface=.74+.26*skyNoise(moonUv*4.2+3.);
        color+=vec3(.73,.81,1.)*(moonDisk*lunarSurface*2.7+exp(-md*30.)*.035)*lunarGate*(1.-daylight*.96);

        // A celestial rotation is periodic over 24 hours and crosses midnight
        // without the old oscillating/reversing star field.
        vec3 starDirection=rotateSky(d,hour*.2617993878);
        vec2 starsUv=starDirection.xz/(1.35+starDirection.y)*330.;
        vec2 cell=floor(starsUv);float seed=skyHash(cell);
        float starWidth=clamp(length(fwidth(starsUv))*.45,.08,.38);
        float star=(1.-smoothstep(.025,starWidth,length(fract(starsUv)-.5)))*step(.980,seed);
        float twinkle=.94+.06*sin(time*.55+seed*100.);
        float moonWash=1.-exp(-md*5.)*.8*lunarGate;
        color+=mix(vec3(.5,.66,1.),vec3(1.,.85,.67),seed)*star*twinkle*night*moonWash*smoothstep(.01,.13,d.y)*.6;

        float galacticDistance=abs(dot(starDirection,normalize(vec3(.62,.21,.75))));
        float galacticDust=cloudField(starDirection.xz*13.+starDirection.y*3.);
        float galacticBand=exp(-pow(galacticDistance/.105,2.));
        color+=vec3(.045,.052,.074)*galacticBand*(.25+.75*galacticDust)*night*moonWash;

        vec2 uv=cloudCoordinates(d);
        float transmission=1.;vec3 scatter=vec3(0.);
        float cloudSun=smoothstep(-.18,.07,solarElevation);
        float towardSun=max(dot(d,sunDirection),0.);
        vec3 ambient=mix(vec3(.022,.035,.067),mix(vec3(.085,.13,.21),mix(vec3(.13,.16,.22),vec3(.045,.048,.105),eveningBlend),warm),daylight);
        vec3 sunlit=mix(vec3(.95,.94,.89),mix(vec3(1.12,.83,.54),vec3(2.0,.53,.045),eveningBlend),warm*(.45+.55*facing));
        for(int i=0;i<6;i++){
          float h=(float(i)+.5)/6.;vec2 q=uv*(1.+h*.14);
          float density=cloudSlice(q,h);
          float ahead=cloudSlice(q+normalize(sunDirection.xz)*.22,min(.96,h+.15));
          float optical=(density*(1.-h)*1.4+ahead*1.8)/max(.25,solarElevation+.30);
          float direct=exp(-optical);
          float multiple=mix(.34,.20,eveningBlend)*exp(-optical*.24);
          float forward=.35+1.5*pow(towardSun,14.);
          vec3 illumination=ambient*(.55+h*.65)+sunlit*cloudSun*(direct*forward+multiple);
          illumination+=vec3(1.8,.42,.035)*ember*facing*.95*(.25+.75*exp(-optical*.25));
          // Broad morning bounce warms cloud faces gently while the solar disc
          // remains behind the viewer; the dusk source stays directional.
          illumination+=vec3(1.,.79,.56)*warm*daylight*(1.-eveningBlend)*.28*(.35+h*.65);
          illumination+=vec3(.017,.024,.041)*lunarGate*night;
          float stepT=exp(-density*.90);
          scatter+=transmission*(1.-stepT)*illumination;
          transmission*=stepT;
        }
        color=color*transmission+scatter;
        // A higher, stretched veil drifts separately from the lower billows.
        vec2 highUv=cloudCoordinates(d)*vec2(.72,2.1)+vec2(time*.002+cloudTravel*.13,7.);
        float cirrus=smoothstep(.57,.78,cloudField(highUv))*.14*cloudiness;
        color=mix(color,mix(vec3(.025,.043,.080),lightColor*.44,daylight),cirrus);
        gl_FragColor=vec4(max(color,vec3(.0005)),1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }` });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(1400, 32, 20), material);
  sky.frustumCulled = false; sky.renderOrder = -10;
  return sky;
}

// An art-directed, periodic day, not a date/location ephemeris. Both bodies
// follow inclined arcs; every receiver uses these same world-space directions.
export function updateSky(shared, hour, elapsed, cloudiness = .5) {
  const angle = (hour - 7.1) / 24 * Math.PI * 2;
  // Fixed west-facing composition: dawn behind/left, dusk ahead/right.
  shared.sunDirection.value.set(-Math.cos(angle)*.65,Math.sin(angle)*.75,Math.cos(angle)*.90-.25).normalize();
  // Retain the established moon arc independently of the solar composition.
  const moonAngle=(hour-6)/24*Math.PI*2;
  shared.moonDirection.value.set(Math.cos(moonAngle)*.43,-Math.sin(moonAngle)*.32+Math.cos(moonAngle)*.035,-1).normalize();
  const elevation = shared.sunDirection.value.y;
  const daylight = THREE.MathUtils.smoothstep(elevation,-.12,.12);
  const night = 1-THREE.MathUtils.smoothstep(elevation,-.17,-.045);
  const warm = Math.exp(-Math.pow((elevation-.025)/.15,2));
  // A smooth morning/evening selector remains periodic at midnight.
  const eveningBlend=THREE.MathUtils.smoothstep(-Math.sin(hour/24*Math.PI*2),-.35,.35);
  shared.eveningBlend.value=eveningBlend;
  const morning=Math.exp(-Math.pow((hour-7.8)/2.1,2))*(1-THREE.MathUtils.smoothstep(hour,10,12.5));
  const evening=Math.exp(-Math.pow((hour-18.8)/1.4,2))*.06;
  shared.mistStrength.value=(morning+evening)*shared.mistScale.value;
  shared.daylight.value=daylight;shared.night.value=night;
  shared.warm.value=warm;shared.hour.value=hour;shared.time.value=elapsed;shared.cloudiness.value=cloudiness;
  shared.zenithColor.value.setRGB(.045,.18,.39).lerp(new THREE.Color(.075,.15,.24).lerp(new THREE.Color(.055,.060,.15),eveningBlend),warm*.85)
    .lerp(new THREE.Color(.045,.078,.155),1-daylight);
  shared.horizonColor.value.setRGB(.49,.65,.76).lerp(new THREE.Color(.42,.36,.30).lerp(new THREE.Color(.16,.10,.115),eveningBlend),warm*.96)
    .lerp(new THREE.Color(.070,.105,.195),1-daylight);
  shared.lightColor.value.setRGB(1.,.96,.85).lerp(new THREE.Color(1.,.76,.49).lerp(new THREE.Color(1.,.48,.16),eveningBlend),warm*.90);
}
export function skyUniforms() {
  return {sunDirection:{value:new THREE.Vector3()},moonDirection:{value:new THREE.Vector3()},
    lightColor:{value:new THREE.Color()},zenithColor:{value:new THREE.Color()},horizonColor:{value:new THREE.Color()},
    eveningBlend:{value:0},daylight:{value:1},night:{value:0},warm:{value:0},time:{value:0},hour:{value:16.5},cloudiness:{value:.5},cloudTravel:{value:0},mistStrength:{value:0},mistScale:{value:1}};
}

// A world-space, low-lying medium shared by land and water. Reflected cameras
// integrate through the folded path above y=0, so mist follows the reflection.
export const mistGLSL = `
  uniform float mistStrength, cloudTravel, eveningBlend;
  float mistNoise(vec2 p){
    vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
    vec4 v=fract(sin(vec4(dot(i,vec2(17.13,91.7)),dot(i+vec2(1,0),vec2(17.13,91.7)),dot(i+vec2(0,1),vec2(17.13,91.7)),dot(i+1.,vec2(17.13,91.7))))*43758.5);
    return mix(mix(v.x,v.y,f.x),mix(v.z,v.w,f.x),f.y);
  }
  float mistOpticalDepth(vec3 origin,vec3 target){
    if(mistStrength<.001)return 0.;
    vec3 delta=target-origin;float distance=min(length(delta),900.);
    vec3 ray=normalize(delta);float optical=0.;
    for(int i=0;i<8;i++){
      float a=float(i)/8.,b=float(i+1)/8.;
      vec3 p=origin+ray*((a*a+b*b)*.5*distance);p.y=abs(p.y);
      vec2 drift=p.xz-vec2(time*.65+cloudTravel*5.,time*.18+cloudTravel*1.5);
      float broad=mistNoise(drift/vec2(85.,110.));
      float fine=mistNoise(drift/vec2(31.,59.)+vec2(7.,2.));
      float centre=10.+8.*sin(p.z*.022+p.x*.016+time*.015);
      float layer=exp(-pow((p.y-centre)/14.,2.))+.16*exp(-pow((p.y-36.)/23.,2.));
      float pockets=.25+.75*smoothstep(.2,.78,broad*.75+fine*.25);
      float onset=smoothstep(35.,95.,length(p.xz));
      optical+=layer*pockets*onset*(b*b-a*a)*distance*.0028*mistStrength;
    }
    return optical;
  }
  vec3 throughMist(vec3 color,vec3 origin,vec3 target){
    float optical=mistOpticalDepth(origin,target);
    vec3 ray=normalize(target-origin);
    float forward=pow(max(dot(ray,sunDirection),0.),10.);
    vec3 haze=mix(vec3(.004,.009,.022),mix(vec3(.23,.30,.35),vec3(.16,.18,.23),eveningBlend),daylight);
    haze+=lightColor*warm*daylight*(.045+forward*.30);
    return color*exp(-optical)+haze*(1.-exp(-optical));
  }
`;

// Cloud attenuation depends on two source directions, not on every water pixel.
// Evaluate it once on the GPU, avoiding CPU/GPU noise disagreement and repeated
// six-layer integration across the whole lake.
export function makeSourceTransmission(renderer,shared){
  const target=new THREE.WebGLRenderTarget(2,1,{depthBuffer:false,minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter});
  shared.sourceCloud={value:target.texture};
  const pass=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const material=new THREE.ShaderMaterial({uniforms:shared,depthTest:false,depthWrite:false,
    vertexShader:`void main(){gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader:`precision highp float;uniform float time;uniform vec3 sunDirection,moonDirection;
      ${cloudLightingGLSL}
      void main(){vec3 ray=gl_FragCoord.x<1.?sunDirection:moonDirection;float t=cloudTransmission(ray);gl_FragColor=vec4(t,t,t,1.);}`});
  pass.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),material));
  return {update(){const old=renderer.getRenderTarget();renderer.setRenderTarget(target);renderer.render(pass,camera);renderer.setRenderTarget(old);}};
}

// Full-sphere sky radiance keeps water reflections valid outside the view
// camera's crop. The very slow cloud field can be cached between small updates.
export function makeSkyEnvironment(renderer,shared,float=true){
  const target=new THREE.WebGLRenderTarget(768,384,{type:float?THREE.HalfFloatType:THREE.UnsignedByteType,depthBuffer:false});
  target.texture.generateMipmaps=true;target.texture.minFilter=THREE.LinearMipmapLinearFilter;
  target.texture.wrapS=THREE.RepeatWrapping;
  shared.skyEnvironment={value:target.texture};
  const template=makeSky(shared);const fragment=template.material.fragmentShader
    .replace('varying vec3 direction;','varying vec2 envUv;')
    .replace('vec3 d=normalize(direction);','float longitude=(envUv.x-.5)*6.2831853,latitude=(envUv.y-.5)*3.14159265;vec3 d=vec3(sin(longitude)*cos(latitude),sin(latitude),-cos(longitude)*cos(latitude));');
  const material=new THREE.ShaderMaterial({uniforms:shared,depthTest:false,depthWrite:false,
    vertexShader:`varying vec2 envUv;void main(){envUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,fragmentShader:fragment});
  template.geometry.dispose();template.material.dispose();
  const pass=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  pass.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),material));
  let clock=-Infinity,hour=-Infinity,clouds=-1;
  return {update(){
    const t=shared.time.value,h=shared.hour.value,c=shared.cloudiness.value;
    if(t-clock<.10&&Math.abs(h-hour)<.015&&c===clouds)return;
    const old=renderer.getRenderTarget();renderer.setRenderTarget(target);renderer.render(pass,camera);renderer.setRenderTarget(old);
    clock=t;hour=h;clouds=c;
  }};
}
