import * as THREE from 'three';

// The simulation lives in world space, so the same wave is seen by both cameras.
export class WaterSimulation {
  constructor(renderer, size = 256) {
    this.renderer = renderer;
    this.size = size;
    this.area = new THREE.Vector4(-64, -112, 128, 128);
    this.pending = [];
    this.accumulator = 0;
    this.steps = 0;
    this.float = renderer.extensions.has('EXT_color_buffer_float');
    const opts = { type: this.float ? THREE.HalfFloatType : THREE.UnsignedByteType,
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false };
    this.read = new THREE.WebGLRenderTarget(size, size, opts);
    this.write = this.read.clone();
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.uniforms = {
      state: { value: this.read.texture }, texel: { value: new THREE.Vector2(1 / size, 1 / size) },
      courant: { value: (2.4 / 60 / (this.area.z / size)) ** 2 },
      packed: { value: this.float ? 0 : 1 }, count: { value: 0 },
      impulses: { value: Array.from({ length: 12 }, () => new THREE.Vector4()) },
    };
    this.material = new THREE.ShaderMaterial({ uniforms: this.uniforms, depthTest: false, depthWrite: false,
      vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
      fragmentShader: `precision highp float;
        varying vec2 vUv; uniform sampler2D state; uniform vec2 texel;
        uniform float packed,courant; uniform int count; uniform vec4 impulses[12];
        vec2 readState(vec2 uv){vec2 s=texture2D(state,uv).rg;return mix(s,(s-.5)*2.,packed);}
        void main(){
          vec2 s=readState(vUv);
          float neighbors=readState(vUv+vec2(texel.x,0)).r+readState(vUv-vec2(texel.x,0)).r
            +readState(vUv+vec2(0,texel.y)).r+readState(vUv-vec2(0,texel.y)).r;
          float diagonal=readState(vUv+texel).r+readState(vUv-texel).r
            +readState(vUv+vec2(texel.x,-texel.y)).r+readState(vUv+vec2(-texel.x,texel.y)).r;
          // Isotropic stencil suppresses square wave fronts.
          float lap=(4.*neighbors+diagonal-20.*s.r)/6.;
          float v=(s.g+lap*courant)*.994;
          float h=s.r+v;
          for(int i=0;i<12;i++){if(i>=count)break;
            vec2 d=(vUv-impulses[i].xy)/impulses[i].w;
            float r=dot(d,d); float shape=exp(-r*2.)*(1.-r*2.);
            h-=shape*impulses[i].z;
            v-=shape*impulses[i].z*.045;
          }
          float border=min(min(vUv.x,1.-vUv.x),min(vUv.y,1.-vUv.y));
          float absorb=smoothstep(0.,.055,border);
          h*=mix(.80,.999,absorb);v*=mix(.65,1.,absorb);
          vec2 result=clamp(vec2(h,v),vec2(-.98),vec2(.98));
          gl_FragColor=vec4(mix(result,result*.5+.5,packed),0.,1.);
        }` });
    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material));
    this.clear();
  }
  add(x, z, strength = .03, radius = .25) {
    const u = (x - this.area.x) / this.area.z, v = (z - this.area.y) / this.area.w;
    if (u <= .02 || u >= .98 || v <= .02 || v >= .98) return;
    this.pending.push(new THREE.Vector4(u, v, strength, Math.max(radius, this.area.z / this.size * 3) / this.area.z));
    if (this.pending.length > 96) this.pending.shift();
  }
  update(dt) {
    this.accumulator = Math.min(.1, this.accumulator + dt);
    const target = this.renderer.getRenderTarget();
    while (this.accumulator >= 1 / 60) {
      this.uniforms.count.value = Math.min(12, this.pending.length);
      for (let i = 0; i < this.uniforms.count.value; i++) this.uniforms.impulses.value[i].copy(this.pending.shift());
      this.uniforms.state.value = this.read.texture;
      this.renderer.setRenderTarget(this.write);
      this.renderer.render(this.scene, this.camera);
      [this.read, this.write] = [this.write, this.read];
      this.accumulator -= 1 / 60;
      this.steps++;
    }
    this.renderer.setRenderTarget(target);
  }
  clear() {
    const old = this.renderer.getRenderTarget();
    const color = this.renderer.getClearColor(new THREE.Color());
    const alpha = this.renderer.getClearAlpha();
    this.renderer.setClearColor(this.float ? new THREE.Color(0, 0, 0) : new THREE.Color(.5, .5, 0), 1);
    for (const target of [this.read, this.write]) { this.renderer.setRenderTarget(target); this.renderer.clear(); }
    this.renderer.setRenderTarget(old); this.renderer.setClearColor(color, alpha);
    this.pending.length = 0;
  }
}
