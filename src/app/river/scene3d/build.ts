// Real 3D scenes for the hero and contact sections, drawn as dithered pixel art.
//
// Pipeline, all at low resolution (one cell = PIXEL css px):
//   1. lit colour pass   → luminance (alpha 0.5 marks "soft" surfaces: water, sky)
//   2. normal pass       → facet creases
//   3. post pass         → 1-cell ink outlines from depth + normals, then a 4×4
//                          Bayer matrix turns luminance into ink or nothing.
// The output is ink on transparent, so the page's paper shows through.

import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { LOGO_PATHS } from "./logoPaths";
import { SHELF_ASPECT, SHELF_EYE_Y, SHELF_TOOL_SCALE, SHELF_TOOL_Y, SHELF_WIDTH, TOOL_SLOTS, dropShare, type ToolFall, type ToolId } from "./toolLayout";

export type Variant = "hero" | "contact" | "fish" | "portrait" | "tools" | "works";

/** One project card in flight: its centre and size on screen (css px), its tilt, and whether it shows. */
export type WorkCard = { x: number; y: number; w: number; h: number; turn: number; visible: boolean };
export type SceneHandle = {
  resize(cssW: number, cssH: number, bleed: number): void;
  /** t in seconds; pointer in -1..1; scroll = section progress through the viewport, -1..1 */
  render(t: number, pointerX: number, pointerY: number, scroll: number, shiftPx?: number): void;
  /** Hero only: make the fish leap. */
  jump(): void;
  /** Hero only: where the fish is, in css px from the canvas's top-left corner. */
  fishScreen(): { x: number; y: number } | null;
  /** Journey only: the block of text on screen (css px), kept clear of the scene; null when there is none. */
  setTextZone(zone: { left: number; top: number; right: number; bottom: number } | null): void;
  /** Journey only: where the mouse is across the screen (css px), or null when the fish should roam freely. */
  setPointer(screenX: number | null): void;
  /** Journey only: the fish bursts out of the river and is gone from it until fishEnter(). */
  fishLeave(): void;
  /** Journey only: the fish drops back into the river where fishScreen() says. */
  fishEnter(): void;
  /** Fish overlay only: which way it faces (radians, π = left), its pitch, tail beats per second, and how hard it is turning (sideways, vertically). */
  pose(dir: number, pitch: number, beat: number, bend?: number, arch?: number): void;
  /** Journey and tool shelf: how far the tools have dropped off the shelf into the river (0 on the shelf … 1 afloat). */
  setDrop(drop: number): void;
  /** Journey only: how far each project card has risen out of the river (0 afloat … 1 clear and upright); null hides them. */
  setWorksUp(ups: number[] | null): void;
  /** Journey only: where each floating project card is on screen: its centre and its height in css px. */
  workSpots(): { x: number; y: number; h: number }[];
  /** Journey only: float each project card where it shows at this screen x (css px) at the top of the page. */
  aimWorks(xs: number[]): void;
  /** Works overlay only: where each project card is on screen this frame. */
  setWorkCards(cards: WorkCard[] | null): void;
  /** Journey and tool shelf: each tool's place on screen during its fall, in this canvas's own css px. */
  setToolPath(path: ToolFall[] | null): void;
  /**
   * Journey only: put each tool's landing spot where it shows at screen x `x` (css px)
   * when the journey is at progress `p`, the moment that tool reaches the water. With
   * `x` its column on the shelf, every tool comes straight down.
   */
  aimLandings(targets: { p: number; x: number }[]): void;
  /** Journey only: where each tool floats once it has landed, on screen, with the px one unit of it covers. */
  toolLandings(): { x: number; y: number; unit: number }[];
  /** Journey only: where the runner is on screen (css px): centre x, feet y, top of head y. */
  runnerScreen(): { x: number; feetY: number; headY: number } | null;
  /** Journey only: which stage the runner is at (-1 between stages), so its marker can spring up. */
  setActiveNode(i: number): void;
  /** Journey only: take the runner out of the scene while the portrait overlay is playing her. */
  setRunnerHidden(hidden: boolean): void;
  /** Portrait only: how far she has come toward the camera (0 far … 1 bust), and where she looks (-1..1). */
  setPortrait(approach: number, lookX: number, lookY: number): void;
  /** Journey only: where each stage node is on screen, and how present it should be (0..1). */
  nodesScreen(): { x: number; y: number; k: number }[];
  dispose(): void;
};

const PIXEL = 2;
const INK = new THREE.Color(0x22 / 255, 0x22 / 255, 0x22 / 255);
const MUTED = new THREE.Color(0xa5 / 255, 0xa5 / 255, 0xa5 / 255);

/* ----------------------------- materials ---------------------------- */

const lambertCache = new Map<number, THREE.MeshLambertMaterial>();
const M = (g: number) => {
  let m = lambertCache.get(g);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color: new THREE.Color(g, g, g), flatShading: true, side: THREE.DoubleSide });
    lambertCache.set(g, m);
  }
  return m;
};

const SOFT_VERT = /* glsl */ `
  varying vec3 vW;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`;

/** Unlit flat tone; alpha 0.5 tells the post pass to skip outlines. */
const flatTone = (tone: number) =>
  new THREE.ShaderMaterial({
    uniforms: { uTone: { value: tone } },
    vertexShader: SOFT_VERT,
    fragmentShader: /* glsl */ `
      uniform float uTone;
      void main() { gl_FragColor = vec4(vec3(1.0 - uTone), 0.5); }`,
    side: THREE.DoubleSide,
  });

const sunBars = (radius: number) =>
  new THREE.ShaderMaterial({
    uniforms: { uR: { value: radius } },
    vertexShader: /* glsl */ `
      varying vec2 vP;
      void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uR;
      varying vec2 vP;
      void main() {
        float h = clamp(vP.y / uR, 0.0, 1.0);
        float period = uR / 7.0;
        float bar = step(mod(vP.y, period) / period, 0.3 + 0.5 * h);
        gl_FragColor = vec4(vec3(1.0 - bar), 0.5);
      }`,
  });

type WaterOpts = { fadeNear: number; fadeFar: number; base: number; deep: number; sunX: number; sunW: number; clear?: boolean };
const water = (o: WaterOpts) =>
  new THREE.ShaderMaterial({
    uniforms: {
      uT: { value: 0 },
      uFade: { value: new THREE.Vector2(o.fadeNear, o.fadeFar) },
      uBase: { value: o.base },
      uDeep: { value: o.deep },
      uSun: { value: new THREE.Vector2(o.sunX, o.sunW) },
      uClear: { value: o.clear ? 1 : 0 },
    },
    vertexShader: SOFT_VERT,
    fragmentShader: /* glsl */ `
      uniform float uT, uBase, uDeep, uClear;
      uniform vec2 uFade, uSun;
      varying vec3 vW;
      void main() {
        float dist = -vW.z;
        // long broken streaks that drift sideways
        float line = sin(vW.z * 9.0 + sin(vW.x * 1.1 + uT * 0.45) * 1.3 + uT * 0.5);
        float gap = sin(vW.x * 1.9 + vW.z * 4.3 + uT * 0.3);
        float streak = step(0.8, line) * step(-0.15, gap);
        float pale = step(0.86, sin(vW.z * 5.0 - vW.x * 0.6 - uT * 0.35)) * step(0.1, sin(vW.x * 2.7 + vW.z));
        float near = smoothstep(-34.0, 9.0, vW.z);
        float tone = uBase + uDeep * near * near + streak * 0.5;
        tone *= 1.0 - 0.85 * pale;
        if (uSun.y > 0.0) {
          float path = 1.0 - smoothstep(uSun.y * 0.45, uSun.y, abs(vW.x - uSun.x) - dist * 0.03);
          tone = mix(tone, streak * 0.2 + 0.02, path);
        }
        tone *= 1.0 - smoothstep(uFade.x, uFade.y, dist);
        // clear water: only the surface streaks are drawn, so whatever swims beneath shows between them
        if (uClear > 0.5 && tone < 0.3) discard;
        gl_FragColor = vec4(vec3(1.0 - clamp(tone, 0.0, 1.0)), 0.5);
      }`,
  });

/** Length of the river, in world units, from the hill at the source to the sea. */
export const RIVER_LENGTH = 60;

/**
 * One sheet of clear water for the whole journey. Upstream it is a river that
 * fades out a short way from the bank; toward the sea it opens to the horizon
 * and catches the sun.
 */
const riverWater = (seaX: number) =>
  new THREE.ShaderMaterial({
    uniforms: { uT: { value: 0 }, uSea: { value: new THREE.Vector2(seaX - 22, seaX - 6) }, uSunX: { value: seaX } },
    vertexShader: SOFT_VERT,
    fragmentShader: /* glsl */ `
      uniform float uT, uSunX;
      uniform vec2 uSea;
      varying vec3 vW;
      void main() {
        float dist = -vW.z;
        float sea = smoothstep(uSea.x, uSea.y, vW.x);
        float line = sin(vW.z * 9.0 + sin(vW.x * 1.1 + uT * 0.45) * 1.3 + uT * 0.5);
        float gap = sin(vW.x * 1.9 + vW.z * 4.3 + uT * 0.3);
        float streak = step(mix(0.8, 0.62, sea), line) * step(-0.15, gap);
        float pale = step(0.86, sin(vW.z * 5.0 - vW.x * 0.6 - uT * 0.35)) * step(0.1, sin(vW.x * 2.7 + vW.z));
        float tone = streak * (0.55 + 0.2 * sea * smoothstep(-34.0, 9.0, vW.z)) * (1.0 - 0.85 * pale);
        // the sun lays a paler path across the open water
        float path = sea * (1.0 - smoothstep(2.2, 5.0, abs(vW.x - uSunX) - dist * 0.03));
        tone *= 1.0 - 0.55 * path * step(0.0, sin(vW.z * 4.5));
        tone *= 1.0 - smoothstep(mix(2.0, 400.0, sea), mix(16.0, 500.0, sea), dist);
        if (tone < 0.3) discard; // clear water: only surface streaks are drawn
        gl_FragColor = vec4(vec3(1.0 - clamp(tone, 0.0, 1.0)), 0.5);
      }`,
  });

/* ------------------------------ helpers ----------------------------- */

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Ground = (x: number, z: number) => number;
type Mat = THREE.Material;

function mesh(parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: Mat, x = 0, y = 0, z = 0, shadow = true) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = shadow;
  m.receiveShadow = shadow;
  parent.add(m);
  return m;
}

const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt: number, rb: number, h: number, seg = 8) => new THREE.CylinderGeometry(rt, rb, h, seg);
const cone = (r: number, h: number, seg = 6) => new THREE.ConeGeometry(r, h, seg);

/** Low-poly boulder: an icosahedron with every corner pushed around. */
function rock(parent: THREE.Object3D, x: number, y: number, z: number, r: number, seed: number, tone = 0.86) {
  const geo = new THREE.IcosahedronGeometry(1, 0);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const vx = p.getX(i), vy = p.getY(i), vz = p.getZ(i);
    // key by position so shared corners move together
    const k = Math.sin(Math.round(vx * 50) * 12.9898 + Math.round(vy * 50) * 78.233 + Math.round(vz * 50) * 37.719 + seed * 9.1) * 43758.5453;
    const j = 0.72 + (k - Math.floor(k)) * 0.5;
    p.setXYZ(i, vx * j, vy * j, vz * j);
  }
  geo.computeVertexNormals();
  const m = mesh(parent, geo, M(tone), x, y + r * 0.22, z);
  m.scale.set(r, r * 0.72, r * 0.85);
  m.rotation.y = seed * 1.7;
  return m;
}

function tree(parent: THREE.Object3D, x: number, y: number, z: number, r: number, seed = 1) {
  mesh(parent, cyl(r * 0.1, r * 0.14, r * 1.5, 5), M(0.3), x, y + r * 0.7, z);
  const c = mesh(parent, new THREE.IcosahedronGeometry(r, 1), M(0.72), x, y + r * 1.9, z);
  c.rotation.set(seed, seed * 2.3, 0);
  mesh(parent, new THREE.IcosahedronGeometry(r * 0.68, 0), M(0.72), x - r * 0.6, y + r * 1.55, z + r * 0.2).rotation.y = seed;
  mesh(parent, new THREE.IcosahedronGeometry(r * 0.72, 0), M(0.66), x + r * 0.62, y + r * 1.6, z - r * 0.1).rotation.y = seed * 3;
}

function pine(parent: THREE.Object3D, x: number, y: number, z: number, h: number) {
  mesh(parent, cyl(h * 0.035, h * 0.045, h * 0.3, 5), M(0.3), x, y + h * 0.13, z);
  for (let i = 0; i < 3; i++) {
    const r = h * (0.28 - i * 0.065);
    mesh(parent, cone(r, h * 0.42, 7), M(0.52 - i * 0.04), x, y + h * (0.42 + i * 0.22), z);
  }
}

type Bloom = "tulip" | "reed" | "bud" | "daisy";
function plant(parent: THREE.Object3D, x: number, y: number, z: number, h: number, bloom: Bloom, seed = 1) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.z = Math.sin(seed * 5.1) * 0.12;
  parent.add(g);
  mesh(g, cyl(0.014, 0.018, h, 4), M(0.2), 0, h / 2, 0);
  const n = Math.max(2, Math.round(h / 0.22));
  const leafGeo = new THREE.SphereGeometry(1, 6, 4);
  for (let i = 0; i < n; i++) {
    const len = h * 0.24 * (1 - i / (n + 2));
    const dir = i % 2 ? 1 : -1;
    const l = mesh(g, leafGeo, M(0.6), dir * len * 0.75, h * (0.12 + (0.6 * i) / n) + len * 0.45, 0);
    l.scale.set(len, len * 0.3, len * 0.12);
    l.rotation.z = dir * 0.65;
    l.rotation.y = seed + i;
  }
  if (bloom === "reed") mesh(g, cyl(0.035, 0.035, 0.2, 6), M(0.12), 0, h + 0.06, 0);
  if (bloom === "bud") mesh(g, new THREE.IcosahedronGeometry(0.06, 1), M(0.92), 0, h + 0.04, 0);
  if (bloom === "tulip") {
    mesh(g, cyl(0.075, 0.03, 0.15, 6), M(0.85), 0, h + 0.07, 0);
    for (let i = 0; i < 3; i++) mesh(g, cone(0.03, 0.07, 4), M(0.85), Math.cos(i * 2.1) * 0.05, h + 0.17, Math.sin(i * 2.1) * 0.05);
  }
  if (bloom === "daisy") {
    mesh(g, cyl(0.07, 0.07, 0.015, 8), M(0.95), 0, h + 0.01, 0).rotation.x = 0.9;
    mesh(g, new THREE.IcosahedronGeometry(0.03, 0), M(0.1), 0, h + 0.02, 0.02);
  }
  return g;
}

function tuft(parent: THREE.Object3D, x: number, y: number, z: number, s = 1) {
  for (let i = -1; i <= 1; i++) {
    const b = mesh(parent, cone(0.012 * s, (0.14 + 0.04 * (i === 0 ? 1 : 0)) * s, 3), M(0.25), x + i * 0.025 * s, y + 0.07 * s, z, false);
    b.rotation.z = -i * 0.4;
  }
}

function cloud(parent: THREE.Object3D, x: number, y: number, z: number, s: number, tone = 0.14) {
  const mat = flatTone(tone);
  for (const [dx, dy, r] of [[-1.3, 0, 1], [0, 0.35, 1.35], [1.4, 0.05, 0.95], [0.3, -0.1, 1.5]] as const) {
    const m = mesh(parent, new THREE.SphereGeometry(r * s, 10, 6), mat, x + dx * s, y + dy * s, z, false);
    m.scale.set(1.25, 0.6, 0.4);
  }
}

function bird(parent: THREE.Object3D, x: number, y: number, z: number, s: number) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  for (const dir of [-1, 1]) {
    const w = mesh(g, box(s, s * 0.14, s * 0.14), M(0.1), dir * s * 0.42, s * 0.2, 0, false);
    w.rotation.z = dir * 0.5;
  }
  parent.add(g);
  return g;
}

function lighthouse(parent: THREE.Object3D, x: number, y: number, z: number) {
  const g = new THREE.Group();
  g.position.set(x, y - 0.05, z);
  parent.add(g);
  mesh(g, cyl(0.3, 0.34, 0.14, 10), M(0.6), 0, 0.07, 0);
  const bands = 6;
  for (let i = 0; i < bands; i++) {
    const r0 = 0.25 - i * 0.02;
    mesh(g, cyl(r0 - 0.02, r0, 0.22, 10), M(i % 2 ? 0.28 : 0.96), 0, 0.25 + i * 0.22, 0);
  }
  const top = 0.14 + bands * 0.22;
  mesh(g, cyl(0.2, 0.2, 0.05, 10), M(0.4), 0, top + 0.02, 0); // gallery
  for (let i = 0; i < 8; i++) mesh(g, cyl(0.008, 0.008, 0.1, 3), M(0.15), Math.cos((i * Math.PI) / 4) * 0.19, top + 0.09, Math.sin((i * Math.PI) / 4) * 0.19, false);
  mesh(g, cyl(0.1, 0.1, 0.18, 8), M(1), 0, top + 0.14, 0); // lamp room
  mesh(g, cone(0.15, 0.17, 8), M(0.2), 0, top + 0.31, 0);
  mesh(g, cyl(0.008, 0.008, 0.14, 3), M(0.1), 0, top + 0.45, 0, false);
  mesh(g, box(0.09, 0.2, 0.03), M(0.1), 0, 0.24, 0.245); // door
  mesh(g, box(0.05, 0.08, 0.03), M(0.1), 0, 0.82, 0.19);
  return g;
}

function house(parent: THREE.Object3D, x: number, y: number, z: number, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, y - 0.04, z);
  g.rotation.y = ry;
  parent.add(g);
  mesh(g, box(0.62, 0.36, 0.46), M(0.95), 0, 0.18, 0);
  const roof = mesh(g, cone(0.7071, 0.28, 4), M(0.3), 0, 0.5, 0);
  roof.rotation.y = Math.PI / 4;
  roof.scale.set(0.74, 1, 0.58);
  mesh(g, box(0.1, 0.2, 0.03), M(0.1), -0.14, 0.1, 0.235);
  mesh(g, box(0.1, 0.1, 0.03), M(0.15), 0.14, 0.2, 0.235);
  mesh(g, box(0.08, 0.2, 0.08), M(0.7), 0.18, 0.56, -0.05);
  return g;
}

function boat(parent: THREE.Object3D, x: number, z: number, s: number) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  parent.add(g);
  const hull = mesh(g, cyl(0.5, 0.3, 0.16, 6), M(0.5), 0, 0.07, 0);
  hull.scale.set(1, 1, 0.42);
  mesh(g, cyl(0.012, 0.012, 0.8, 4), M(0.15), 0, 0.5, 0);
  const sail = new THREE.Shape();
  sail.moveTo(0.03, 0.18);
  sail.lineTo(0.42, 0.2);
  sail.lineTo(0.03, 0.88);
  mesh(g, new THREE.ShapeGeometry(sail), M(0.98));
  const jib = new THREE.Shape();
  jib.moveTo(-0.03, 0.2);
  jib.lineTo(-0.3, 0.2);
  jib.lineTo(-0.03, 0.7);
  mesh(g, new THREE.ShapeGeometry(jib), M(0.8));
  g.scale.setScalar(s);
  return g;
}

function windmill(parent: THREE.Object3D, x: number, y: number, z: number) {
  const g = new THREE.Group();
  g.position.set(x, y - 0.04, z);
  parent.add(g);
  mesh(g, cyl(0.15, 0.24, 0.85, 8), M(0.96), 0, 0.42, 0);
  mesh(g, cyl(0.25, 0.27, 0.06, 8), M(0.5), 0, 0.03, 0);
  mesh(g, cone(0.2, 0.24, 8), M(0.25), 0, 0.97, 0);
  mesh(g, box(0.08, 0.16, 0.03), M(0.1), 0, 0.14, 0.23);
  mesh(g, box(0.06, 0.07, 0.03), M(0.1), 0, 0.55, 0.18);
  const blades = new THREE.Group();
  blades.position.set(0, 0.82, 0.2);
  g.add(blades);
  mesh(blades, cyl(0.03, 0.03, 0.1, 6), M(0.2)).rotation.x = Math.PI / 2;
  for (let i = 0; i < 4; i++) {
    const arm = new THREE.Group();
    arm.rotation.z = (i * Math.PI) / 2;
    blades.add(arm);
    mesh(arm, box(0.02, 0.62, 0.02), M(0.2), 0, 0.31, 0);
    mesh(arm, box(0.14, 0.44, 0.012), M(0.9), 0.08, 0.38, 0);
    for (let k = 0; k < 4; k++) mesh(arm, box(0.14, 0.012, 0.016), M(0.2), 0.08, 0.2 + k * 0.12, 0, false);
  }
  return blades;
}

function birch(parent: THREE.Object3D, x: number, y: number, z: number, h: number, seed = 1) {
  mesh(parent, cyl(h * 0.03, h * 0.04, h, 5), M(0.97), x, y + h / 2, z);
  for (let i = 0; i < 4; i++) mesh(parent, cyl(h * 0.042, h * 0.042, h * 0.03, 5), M(0.15), x, y + h * (0.15 + i * 0.16), z, false);
  for (const [dx, dy, r] of [[0, 1.0, 0.24], [-0.14, 0.82, 0.18], [0.15, 0.86, 0.17], [0.02, 1.2, 0.16]] as const) {
    mesh(parent, new THREE.IcosahedronGeometry(h * r, 0), M(0.84), x + dx * h, y + dy * h, z).rotation.set(seed, seed * 2 + dx, 0);
  }
}

function bush(parent: THREE.Object3D, x: number, y: number, z: number, r: number, seed = 1) {
  mesh(parent, new THREE.IcosahedronGeometry(r, 0), M(0.7), x, y + r * 0.5, z).rotation.set(seed, seed * 1.7, 0);
  mesh(parent, new THREE.IcosahedronGeometry(r * 0.7, 0), M(0.76), x + r * 0.8, y + r * 0.3, z + r * 0.2).rotation.y = seed * 3;
}

function mushroom(parent: THREE.Object3D, x: number, y: number, z: number, s: number) {
  mesh(parent, cyl(0.016 * s, 0.022 * s, 0.07 * s, 5), M(0.95), x, y + 0.035 * s, z, false);
  mesh(parent, new THREE.SphereGeometry(0.05 * s, 7, 4, 0, Math.PI * 2, 0, Math.PI / 2), M(0.3), x, y + 0.065 * s, z);
}

function flower(parent: THREE.Object3D, x: number, y: number, z: number, s: number) {
  mesh(parent, cyl(0.006, 0.006, 0.12 * s, 3), M(0.25), x, y + 0.06 * s, z, false);
  mesh(parent, new THREE.IcosahedronGeometry(0.028 * s, 0), M(0.98), x, y + 0.13 * s, z, false);
}

function signpost(parent: THREE.Object3D, x: number, y: number, z: number) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  parent.add(g);
  mesh(g, cyl(0.02, 0.025, 0.72, 5), M(0.3), 0, 0.36, 0);
  [[0.62, 0.1, 0.25], [0.5, -0.1, -0.2], [0.38, 0.08, 0.1]].forEach(([h, dx, rot], i) => {
    const plank = mesh(g, box(0.3, 0.085, 0.025), M(0.96), dx, h, 0.02 + i * 0.002);
    plank.rotation.y = rot;
  });
  return g;
}

function bench(parent: THREE.Object3D, x: number, y: number, z: number, ry: number) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  parent.add(g);
  mesh(g, box(0.34, 0.025, 0.11), M(0.9), 0, 0.1, 0);
  mesh(g, box(0.34, 0.09, 0.02), M(0.9), 0, 0.2, -0.05);
  for (const dx of [-0.14, 0.14]) mesh(g, box(0.025, 0.24, 0.025), M(0.25), dx, 0.1, -0.05);
  for (const dx of [-0.14, 0.14]) mesh(g, box(0.025, 0.1, 0.025), M(0.25), dx, 0.05, 0.04);
}

function well(parent: THREE.Object3D, x: number, y: number, z: number) {
  const g = new THREE.Group();
  g.position.set(x, y - 0.02, z);
  parent.add(g);
  mesh(g, cyl(0.13, 0.14, 0.14, 8), M(0.75), 0, 0.07, 0);
  mesh(g, cyl(0.1, 0.1, 0.02, 8), M(0.08), 0, 0.142, 0, false);
  for (const dx of [-0.12, 0.12]) mesh(g, box(0.022, 0.3, 0.022), M(0.3), dx, 0.27, 0);
  const roof = mesh(g, cone(0.7071, 0.12, 4), M(0.3), 0, 0.47, 0);
  roof.rotation.y = Math.PI / 4;
  roof.scale.set(0.36, 1, 0.26);
  mesh(g, cyl(0.012, 0.012, 0.26, 4), M(0.3), 0, 0.36, 0).rotation.z = Math.PI / 2;
}

function pier(parent: THREE.Object3D, x: number, z0: number, len: number) {
  const g = new THREE.Group();
  parent.add(g);
  const n = Math.round(len / 0.11);
  for (let i = 0; i < n; i++) mesh(g, box(0.36, 0.025, 0.09), M(i % 2 ? 0.86 : 0.94), x, 0.11, z0 + i * 0.11);
  for (let i = 0; i <= 3; i++) for (const dx of [-0.17, 0.17]) mesh(g, cyl(0.022, 0.022, 0.34, 5), M(0.3), x + dx, 0.03, z0 + (i * len) / 3);
  mesh(g, cyl(0.028, 0.028, 0.3, 5), M(0.3), x + 0.17, 0.26, z0 + len); // mooring post
  return g;
}

function rowboat(parent: THREE.Object3D, x: number, z: number, ry: number) {
  const g = new THREE.Group();
  g.position.set(x, 0.02, z);
  g.rotation.y = ry;
  parent.add(g);
  const hull = mesh(g, cyl(0.3, 0.2, 0.12, 6), M(0.92), 0, 0.04, 0);
  hull.scale.set(1, 1, 0.45);
  const inner = mesh(g, cyl(0.25, 0.25, 0.02, 6), M(0.35), 0, 0.105, 0, false);
  inner.scale.set(1, 1, 0.4);
  mesh(g, box(0.05, 0.02, 0.22), M(0.9), 0, 0.1, 0);
  for (const side of [-1, 1]) {
    const oar = mesh(g, box(0.02, 0.02, 0.42), M(0.25), 0.02, 0.12, side * 0.22);
    oar.rotation.x = side * 0.35;
  }
  return g;
}

function lilyPad(parent: THREE.Object3D, x: number, z: number, r: number, bloom: boolean) {
  const pad = mesh(parent, cyl(r, r, 0.012, 7), M(0.62), x, 0.008, z, false);
  pad.rotation.y = x * 3;
  if (bloom) {
    mesh(parent, new THREE.IcosahedronGeometry(r * 0.38, 0), M(0.99), x, 0.05, z, false);
    mesh(parent, new THREE.IcosahedronGeometry(r * 0.16, 0), M(0.15), x, 0.085, z, false);
  }
}

function duck(parent: THREE.Object3D, x: number, z: number, s: number) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  parent.add(g);
  const body = mesh(g, new THREE.IcosahedronGeometry(0.1, 1), M(0.97), 0, 0.04, 0);
  body.scale.set(1.35, 0.8, 0.85);
  mesh(g, cone(0.05, 0.12, 4), M(0.9), 0.14, 0.07, 0).rotation.z = -1.1;
  mesh(g, new THREE.IcosahedronGeometry(0.055, 1), M(0.97), -0.1, 0.15, 0);
  mesh(g, cone(0.022, 0.07, 4), M(0.2), -0.17, 0.14, 0).rotation.z = Math.PI / 2;
  mesh(g, new THREE.SphereGeometry(0.01, 4, 3), M(0.05), -0.12, 0.165, 0.045, false);
  g.scale.setScalar(s);
  return g;
}

/* ------------------------------- tools ------------------------------- */

/**
 * The tools as small objects: each a simplified, blocky take on its mark, about
 * 0.6 units across, standing upright and facing +z. Returned group is centred on
 * the object's middle.
 */
function toolObject(id: ToolId): THREE.Group {
  const g = new THREE.Group();
  const D = 0.12; // thickness
  const DARK = 0.14;
  const LIGHT = 0.97;
  const slab = (w: number, h: number, tone: number, x = 0, y = 0, z = 0, d = D) => mesh(g, box(w, h, d), M(tone), x, y, z);
  const disc = (r: number, tone: number, x = 0, y = 0, z = 0, d = D, start = 0, len = Math.PI * 2) => {
    const m = mesh(g, new THREE.CylinderGeometry(r, r, d, 20, 1, false, start, len), M(tone), x, y, z);
    m.rotation.x = Math.PI / 2;
    return m;
  };
  const poly = (pts: [number, number][], tone: number, z = 0, d = D) => {
    const shape = new THREE.Shape();
    shape.moveTo(pts[0][0], pts[0][1]);
    pts.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
    return mesh(g, new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false }), M(tone), 0, 0, z - d / 2);
  };
  const bar = (len: number, w: number, tone: number, x: number, y: number, rot: number, z = 0, d = D) => {
    const m = slab(len, w, tone, x, y, z, d);
    m.rotation.z = rot;
    return m;
  };

  // a logo's own outline, extruded: centred, flipped the right way up, about `size` units across
  const fromPath = (logo: { box: number; d: string }, tone: number, size = 0.66, inset = 1) => {
    const parsed = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="${logo.d}"/></svg>`);
    const shapes = parsed.paths.flatMap((path) => SVGLoader.createShapes(path));
    const depth = (D * logo.box) / size;
    const k = size / logo.box;
    // Each piece of the mark is its own mesh. `inset` shrinks every piece about its
    // own middle, which opens up hairline gaps that would otherwise close at this size.
    shapes.forEach((shape) => {
      const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 6 });
      if (inset !== 1) {
        geo.computeBoundingBox();
        const c = geo.boundingBox!.getCenter(new THREE.Vector3());
        geo.translate(-c.x, -c.y, 0);
        geo.scale(inset, inset, 1);
        geo.translate(c.x, c.y, 0);
      }
      geo.translate(-logo.box / 2, -logo.box / 2, -depth / 2);
      geo.scale(k, -k, k); // svg y runs downward
      geo.computeVertexNormals();
      mesh(g, geo, M(tone));
    });
  };

  switch (id) {
    case "figma": {
      // five rounded cells: three down the left, a pill top right, a circle beside the middle
      const R = 0.15;
      const cell = (x: number, y: number, tone: number, squareInner: boolean) => {
        disc(R, tone, x, y);
        if (squareInner) slab(R, R * 2, tone, x - Math.sign(x) * (R / 2), y);
      };
      cell(-R, 2 * R, DARK, true);
      cell(R, 2 * R, 0.6, true);
      cell(-R, 0, 0.6, true);
      disc(R, DARK, R, 0);
      cell(-R, -2 * R, DARK, false);
      slab(R, R, DARK, -R / 2, -2 * R + R / 2);
      break;
    }
    case "storybook": {
      // a tilted book cover with an S and a bookmark
      const cover = new THREE.Group();
      cover.rotation.z = -0.07;
      g.add(cover);
      mesh(cover, box(0.5, 0.64, D), M(DARK));
      for (const [y, x] of [[0.16, 0], [0, 0], [-0.16, 0]] as const) mesh(cover, box(0.22, 0.05, 0.03), M(LIGHT), x, y, D / 2 + 0.012, false);
      mesh(cover, box(0.05, 0.16, 0.03), M(LIGHT), -0.085, 0.08, D / 2 + 0.012, false);
      mesh(cover, box(0.05, 0.16, 0.03), M(LIGHT), 0.085, -0.08, D / 2 + 0.012, false);
      mesh(cover, box(0.07, 0.15, 0.03), M(LIGHT), 0.15, 0.25, D / 2 + 0.012, false);
      break;
    }
    case "adobe": {
      // the A cut from three wedges
      poly([[-0.32, 0.3], [-0.07, 0.3], [-0.32, -0.3]], DARK);
      poly([[0.32, 0.3], [0.07, 0.3], [0.32, -0.3]], DARK);
      poly([[0, 0.1], [0.16, -0.3], [0.03, -0.3], [-0.03, -0.14], [-0.1, -0.14]], DARK);
      break;
    }
    case "touchdesigner": {
      // two discs drawn together by a liquid neck, and a third disc on its own below
      const A: [number, number] = [-0.135, 0.185];
      const B: [number, number] = [0.15, 0.022];
      const R = 0.112;
      disc(R, DARK, A[0], A[1]);
      disc(R, DARK, B[0], B[1]);
      disc(R * 0.98, DARK, -0.027, -0.182);
      const len = Math.hypot(B[0] - A[0], B[1] - A[1]);
      const ux = (B[0] - A[0]) / len;
      const uy = (B[1] - A[1]) / len;
      // the neck is widest where it leaves each disc and pinches in the middle
      const half = (k: number) => 0.034 + 0.07 * Math.pow(Math.abs(k - 0.5) * 2, 2.2);
      const neck: [number, number][] = [];
      for (let i = 0; i <= 10; i++) {
        const k = 0.12 + (0.76 * i) / 10;
        neck.push([A[0] + ux * len * k - uy * half(k), A[1] + uy * len * k + ux * half(k)]);
      }
      for (let i = 10; i >= 0; i--) {
        const k = 0.12 + (0.76 * i) / 10;
        neck.push([A[0] + ux * len * k + uy * half(k), A[1] + uy * len * k - ux * half(k)]);
      }
      poly(neck, DARK);
      break;
    }
    case "claude": {
      // a burst of uneven rays
      for (let i = 0; i < 11; i++) {
        const a = (i / 11) * Math.PI * 2 + 0.2;
        const len = 0.2 + (i % 3) * 0.045;
        bar(len, 0.06, DARK, Math.cos(a) * (0.07 + len / 2), Math.sin(a) * (0.07 + len / 2), a);
      }
      disc(0.09, DARK);
      break;
    }
    case "chatgpt": {
      fromPath(LOGO_PATHS.chatgpt, DARK);
      break;
    }
    case "n8n": {
      // a small workflow: one node feeding two
      const node = (x: number, y: number) => {
        disc(0.085, DARK, x, y);
        disc(0.04, LIGHT, x, y, D / 2 + 0.01, 0.03);
      };
      bar(0.24, 0.04, DARK, -0.17, 0, 0);
      bar(0.24, 0.04, DARK, 0.11, 0.09, 0.75);
      bar(0.24, 0.04, DARK, 0.11, -0.09, -0.75);
      node(-0.3, 0);
      node(-0.02, 0);
      node(0.26, 0.19);
      node(0.26, -0.19);
      break;
    }
    case "maze": {
      // an m: two arches on three legs
      for (const x of [-0.13, 0.13]) {
        const arch = mesh(g, new THREE.TorusGeometry(0.13, 0.05, 6, 12, Math.PI), M(DARK), x, 0.04, 0);
        arch.scale.z = 1.2;
      }
      for (const x of [-0.26, 0, 0.26]) slab(0.1, 0.3, DARK, x, -0.1);
      break;
    }
    case "notion": {
      // a white block with an N on its face
      slab(0.52, 0.56, LIGHT, 0, 0, 0, 0.2);
      mesh(g, box(0.06, 0.34, 0.03), M(DARK), -0.12, 0, 0.112, false);
      mesh(g, box(0.06, 0.34, 0.03), M(DARK), 0.12, 0, 0.112, false);
      mesh(g, box(0.06, 0.4, 0.03), M(DARK), 0, 0, 0.112, false).rotation.z = 0.62;
      mesh(g, box(0.52, 0.05, 0.2), M(DARK), 0, 0.305, 0);
      break;
    }
    case "jira": {
      // three diamonds stepping down
      [[0.13, 0.17, DARK, 0.26], [0, 0, 0.5, 0.24], [-0.13, -0.17, 0.8, 0.22]].forEach(([x, y, tone, size], i) => {
        const m = slab(size, size, tone, x, y, i * 0.02);
        m.rotation.z = Math.PI / 4;
      });
      break;
    }
    case "posthog": {
      fromPath(LOGO_PATHS.posthog, DARK, 0.78, 0.8);
      break;
    }
    case "sql": {
      // a database: three stacked drums
      for (let i = 0; i < 3; i++) {
        const drum = mesh(g, cyl(0.26, 0.26, 0.15, 18), M(i === 1 ? 0.6 : LIGHT), 0, -0.2 + i * 0.2, 0);
        drum.rotation.x = 0.18;
        mesh(g, cyl(0.265, 0.265, 0.025, 18), M(DARK), 0, -0.115 + i * 0.2, 0.015).rotation.x = 0.18;
      }
      break;
    }
  }
  return g;
}

/** One display case: a foot, a pin, and the faint outline of a glass tube. */
function displayCase(parent: THREE.Object3D, x: number) {
  mesh(parent, cyl(0.4, 0.44, 0.06, 18), M(0.86), x, 0.03, 0);
  mesh(parent, cyl(0.1, 0.13, 0.03, 12), M(0.5), x, 0.075, 0);
  mesh(parent, cyl(0.012, 0.012, 0.74, 5), M(0.3), x, 0.45, 0, false);
  for (const y of [0.07, 2.02]) {
    const ring = mesh(parent, new THREE.TorusGeometry(0.44, 0.016, 4, 28), M(0.35), x, y, 0, false);
    ring.rotation.x = Math.PI / 2;
  }
  for (const dx of [-0.44, 0.44]) mesh(parent, box(0.018, 1.95, 0.018), M(0.35), x + dx, 1.045, 0, false);
}

const SHELF_Y = SHELF_TOOL_Y; // height at which a tool sits on its pin

/** The tumble a falling tool goes through: nothing on the shelf, nothing once afloat, a few turns in between. */
const tumble = (k: number, i: number) => {
  const spin = (i % 2 ? 1 : -1) * (0.7 + (i % 3) * 0.25);
  const a = k * (1 - k) * 4; // 0 at both ends, 1 half way
  return { x: a * 0.5 * spin, y: a * 0.35 * spin, z: -a * 0.7 * spin };
};

/** A point on screen, taken back into the scene at depth z, and how many px one world unit covers there. */
type ScreenToWorld = (x: number, y: number, z: number) => { p: THREE.Vector3; px: number };

/** The shelf in the About section: every tool in its case, until the page scrolls on and they drop out. */
function buildTools(scene: THREE.Scene): Built {
  const items = TOOL_SLOTS.map((slot) => {
    displayCase(scene, slot.x);
    const obj = toolObject(slot.id);
    obj.scale.setScalar(SHELF_TOOL_SCALE);
    scene.add(obj);
    return { obj, x: slot.x };
  });
  const height = SHELF_WIDTH / SHELF_ASPECT; // matches the shelf's frame
  const fov = 18;
  const dist = height / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2)));
  return {
    camPos: new THREE.Vector3(0, SHELF_EYE_Y, dist),
    target: new THREE.Vector3(0, SHELF_EYE_Y, 0),
    fov,
    mute: 1e6,
    shadowTarget: new THREE.Vector3(0, 0, 0),
    lightFrom: new THREE.Vector3(-4, 6, 9),
    narrow: false,
    plain: true,
    dropIn: 0,
    update(t) {
      const drop = this.dropIn ?? 0;
      items.forEach((item, i) => {
        const k = dropShare(drop, i);
        // on its pin it turns slowly from side to side, like something on display
        const sway = Math.sin(t * 0.55 + i * 0.9) * 0.5 * (1 - k);
        item.obj.position.set(item.x, SHELF_Y + Math.sin(t * 1.1 + i) * 0.015 - k * k * 3.4, 0);
        item.obj.rotation.set(k * 1.4 * (i % 2 ? 1 : -1), sway, k * 2.2 * (i % 2 ? -1 : 1));
        item.obj.scale.setScalar(SHELF_TOOL_SCALE);
        item.obj.visible = k < 1;
      });
    },
    // with a path from the page, a falling tool is drawn exactly where the path says,
    // so the river scene can pick it up at the same spot below the sheet
    placeTools(at, t) {
      const path = this.toolPath;
      if (!path) return;
      items.forEach((item, i) => {
        const f = path[i];
        if (!f || f.k <= 0 || f.k >= 1) return;
        const { p, px } = at(f.x, f.y, 0);
        const turn = tumble(f.k, i);
        item.obj.position.copy(p);
        item.obj.rotation.set(turn.x, turn.y + Math.sin(t * 0.55 + i * 0.9) * 0.5 * (1 - f.k), turn.z);
        item.obj.scale.setScalar(f.unit / px);
      });
    },
  };
}

/* ------------------------------ person ------------------------------ */

type Person = {
  root: THREE.Group;
  /** Pose her: stride phase (radians), how hard she is running (0 standing … 1 flat out), and where she looks (-1..1). */
  pose(phase: number, run: number, lookX: number, lookY: number, t: number): void;
};

/**
 * Mei as a small traveller, drawn from her photograph: a full, wavy shoulder-length
 * bob parted to one side, a white camisole on thin straps, a fine chain with a
 * single pearl, pearl studs, a smile, wide pinstripe trousers and a polka-dot scarf
 * tied as a belt; plus a daypack with a rolled mat, because she is on the road. About 1.62 units tall, standing on y = 0, facing +z.
 */
function person(parent: THREE.Object3D): Person {
  const root = new THREE.Group();
  parent.add(root);
  const body = new THREE.Group(); // everything above the hips; leans and bobs as one
  body.position.y = 0.82;
  root.add(body);

  const limb = (g: THREE.Object3D, w: number, len: number, d: number, tone: number) => mesh(g, box(w, len, d), M(tone), 0, -len / 2, 0);
  const legs = [-1, 1].map((side) => {
    const hip = new THREE.Group();
    hip.position.set(side * 0.09, 0.84, 0);
    root.add(hip);
    // wide-legged pinstripe trousers
    limb(hip, 0.165, 0.42, 0.17, 0.16);
    const knee = new THREE.Group();
    knee.position.y = -0.42;
    hip.add(knee);
    limb(knee, 0.175, 0.38, 0.18, 0.16);
    for (const sx of [-0.045, 0.045]) {
      mesh(hip, box(0.006, 0.4, 0.004), M(0.75), sx, -0.21, 0.087, false);
      mesh(knee, box(0.006, 0.36, 0.004), M(0.75), sx, -0.19, 0.092, false);
    }
    mesh(knee, box(0.13, 0.08, 0.24), M(0.97), 0, -0.4, 0.04); // shoe
    mesh(knee, box(0.13, 0.03, 0.24), M(0.2), 0, -0.445, 0.04, false);
    return { hip, knee };
  });

  const SKIN = M(0.985);
  const TOP = M(0.9); // the white camisole, a shade off the skin so the two read apart
  // torso: bare shoulders, a V-necked camisole on thin straps, a fine chain with one pearl
  mesh(body, box(0.4, 0.13, 0.2), SKIN, 0, 0.47, 0);
  mesh(body, box(0.35, 0.42, 0.215), TOP, 0, 0.2, 0);
  // a polka-dot scarf tied as a belt, its ends hanging at her left hip
  mesh(body, box(0.375, 0.05, 0.23), M(0.12), 0, -0.005, 0);
  for (let i = 0; i < 7; i++) mesh(body, box(0.014, 0.014, 0.004), M(1), -0.15 + i * 0.05, -0.005 + (i % 2 ? 0.009 : -0.009), 0.117, false);
  const sash = new THREE.Group();
  sash.position.set(0.15, -0.03, 0.118);
  body.add(sash);
  mesh(sash, box(0.055, 0.2, 0.012), M(0.12), 0, -0.1, 0).rotation.z = 0.12;
  mesh(sash, box(0.012, 0.2, 0.014), M(1), 0.03, -0.1, 0.002, false).rotation.z = 0.12;
  mesh(sash, box(0.045, 0.14, 0.012), M(0.12), -0.035, -0.075, -0.004).rotation.z = -0.18;
  for (let i = 0; i < 4; i++) mesh(sash, box(0.012, 0.012, 0.004), M(1), 0.004 - i * 0.004, -0.03 - i * 0.045, 0.008, false);
  const vee = new THREE.Shape();
  vee.moveTo(-0.12, 0.41);
  vee.lineTo(0.12, 0.41);
  vee.lineTo(0, 0.25);
  mesh(body, new THREE.ShapeGeometry(vee), SKIN, 0, 0, 0.109, false);
  for (const sx of [-0.125, 0.125]) mesh(body, box(0.016, 0.15, 0.012), TOP, sx, 0.47, 0.104, false);
  const chain = mesh(body, new THREE.TorusGeometry(0.085, 0.004, 4, 16, Math.PI), M(0.35), 0, 0.5, 0.075, false);
  chain.rotation.set(0.5, 0, Math.PI);
  const pearl = mesh(body, new THREE.SphereGeometry(0.016, 8, 6), M(1), 0, 0.405, 0.117, false);
  // a small daypack: she is on the road
  const pack = new THREE.Group();
  pack.position.set(0, 0.24, -0.185);
  body.add(pack);
  mesh(pack, box(0.3, 0.36, 0.14), M(0.55));
  mesh(pack, box(0.2, 0.14, 0.05), M(0.4), 0, -0.07, -0.09);
  mesh(pack, cyl(0.055, 0.055, 0.34, 8), M(0.88), 0, 0.235, 0).rotation.z = Math.PI / 2;
  for (const sx of [-0.11, 0.11]) mesh(pack, box(0.02, 0.13, 0.13), M(0.2), sx, 0.235, 0, false);
  for (const sx of [-0.16, 0.16]) mesh(body, box(0.028, 0.3, 0.012), M(0.4), sx, 0.36, 0.112, false); // pack straps, outside the camisole's

  const arms = [-1, 1].map((side) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.225, 0.49, 0);
    body.add(shoulder);
    mesh(shoulder, new THREE.IcosahedronGeometry(0.058, 1), SKIN, 0, -0.005, 0);
    mesh(shoulder, box(0.085, 0.27, 0.095), SKIN, 0, -0.14, 0);
    const elbow = new THREE.Group();
    elbow.position.y = -0.27;
    shoulder.add(elbow);
    mesh(elbow, box(0.075, 0.24, 0.085), SKIN, 0, -0.12, 0);
    mesh(elbow, new THREE.IcosahedronGeometry(0.045, 1), SKIN, 0, -0.26, 0);
    return { shoulder, elbow };
  });

  // head: an oval face with a smile, pearl studs, and a full wavy bob parted to one side
  const head = new THREE.Group();
  head.position.y = 0.76;
  body.add(head);
  mesh(head, cyl(0.05, 0.058, 0.11, 8), SKIN, 0, -0.14, 0);
  mesh(head, new THREE.IcosahedronGeometry(0.165, 2), SKIN, 0, 0, 0).scale.set(0.92, 1.08, 0.94);
  for (const sx of [-0.058, 0.058]) {
    mesh(head, new THREE.SphereGeometry(0.019, 8, 6), M(0.05), sx, 0.012, 0.146, false).scale.set(1.25, 0.8, 0.6);
    mesh(head, box(0.05, 0.008, 0.01), M(0.15), sx, 0.046, 0.15, false).rotation.z = sx < 0 ? 0.12 : -0.12; // brows
  }
  // the smile: a wide line turned up at both ends
  mesh(head, box(0.058, 0.012, 0.012), M(0.25), 0, -0.078, 0.148, false);
  for (const sx of [-1, 1]) mesh(head, box(0.022, 0.012, 0.012), M(0.25), sx * 0.036, -0.072, 0.145, false).rotation.z = sx * 0.55;
  mesh(head, box(0.012, 0.03, 0.02), M(0.82), 0, -0.022, 0.157, false); // nose
  for (const sx of [-1, 1]) mesh(head, new THREE.SphereGeometry(0.013, 8, 6), M(1), sx * 0.15, -0.075, 0.03, false); // pearl studs

  const hair = new THREE.Group();
  head.add(hair);
  const HAIR = M(0.12);
  const lock = (g: THREE.Object3D, r: number, x: number, y: number, z: number, sx: number, sy: number, sz: number, seed: number) => {
    const m = mesh(g, new THREE.IcosahedronGeometry(r, 1), HAIR, x, y, z);
    m.scale.set(sx, sy, sz);
    m.rotation.set(seed, seed * 1.9, seed * 0.7);
    return m;
  };
  // Her hair, from the photograph: a full, wavy bob. It lifts at the crown, parts high
  // on her right, and sweeps in one long curve across the forehead to her left temple.
  // The sides swell outward from the cheekbones and are widest at the jaw, where the
  // ends turn under in large soft curls, just clear of the shoulders.
  // (+x is the viewer's right, which is her left: the side the fringe falls to.)
  const mass = (g: THREE.Object3D, r: number, x: number, y: number, z: number, sx: number, sy: number, sz: number, tilt = 0) => {
    const m = mesh(g, new THREE.IcosahedronGeometry(r, 2), HAIR, x, y, z); // smooth: a mass of hair, not a tuft
    m.scale.set(sx, sy, sz);
    m.rotation.z = tilt;
    return m;
  };
  // volume over the crown, lifted at the roots
  mass(hair, 0.19, 0, 0.085, -0.04, 1.02, 0.74, 1.0);
  // the fringe: from the part, down and across to the far temple in one sweep
  mass(hair, 0.095, 0.05, 0.132, 0.105, 1.6, 0.46, 0.6, -0.55);
  mass(hair, 0.06, 0.138, 0.06, 0.085, 0.62, 1.2, 0.7, -0.12);
  for (const [x, y] of [[0.0, 0.168], [0.045, 0.148], [0.09, 0.118]] as const) {
    mesh(hair, box(0.075, 0.006, 0.006), M(0.5), x, y, 0.158 - x * 0.25, false).rotation.z = -0.55; // strands along the sweep
  }
  // the short side of the part, tucked back toward the ear
  mass(hair, 0.05, -0.105, 0.162, 0.08, 1.05, 0.4, 0.6, 0.55);
  const hairBack = new THREE.Group();
  hairBack.position.set(0, 0.02, -0.11);
  hair.add(hairBack);
  mass(hairBack, 0.175, 0, -0.09, -0.01, 1.05, 1.08, 0.6);
  mass(hairBack, 0.085, -0.09, -0.2, 0.0, 1.0, 0.7, 0.75);
  mass(hairBack, 0.085, 0.09, -0.2, 0.0, 1.0, 0.7, 0.75);
  // the sides: a smooth swell from the temple, widest at the jaw, the ends curled under
  const hairSides = [-1, 1].map((side) => {
    const g = new THREE.Group();
    g.position.set(side * 0.15, 0.05, -0.01);
    hair.add(g);
    const fwd = side > 0 ? 0.025 : -0.015; // her left side falls forward over the cheek; her right is tucked behind the ear
    mass(g, 0.085, side * 0.022, -0.05, fwd, 0.62, 1.45, 1.05, side * -0.1);
    mass(g, 0.095, side * 0.05, -0.15, fwd, 0.82, 1.0, 1.05, side * -0.2);
    // the curl at the end, level with the chin: a round turn under and in, with a wisp kicking out
    mass(g, 0.055, side * 0.04, -0.235, fwd + 0.02, 1.15, 0.72, 0.95, side * 0.35);
    lock(g, 0.034, side * 0.118, -0.205, fwd, 1.0, 0.7, 0.9, 3.3 + side).rotation.z = side * 0.8;
    // a few lighter strands following the wave, so the mass reads as hair
    for (const [dx, dy, len, tilt] of [[0.035, -0.06, 0.13, -0.12], [0.075, -0.13, 0.11, -0.3]] as const) {
      mesh(g, box(0.007, len, 0.006), M(0.5), side * dx, dy, fwd + 0.088, false).rotation.z = side * tilt;
    }
    return g;
  });
  // hair throws no shadow of its own onto the face: at this size it only muddies it
  hair.traverse((o) => (o.castShadow = false));

  const pose = (phase: number, run: number, lookX: number, lookY: number, t: number) => {
    const sw = Math.sin(phase);
    const stride = 0.95 * run;
    legs.forEach((leg, i) => {
      const dir = i ? 1 : -1;
      leg.hip.rotation.x = -dir * sw * stride + 0.12 * run;
      // the trailing leg folds at the knee; the leading one reaches
      leg.knee.rotation.x = (0.25 + 0.9 * Math.max(0, dir * Math.cos(phase))) * run;
    });
    arms.forEach((arm, i) => {
      const dir = i ? 1 : -1;
      arm.shoulder.rotation.x = dir * sw * 0.9 * run + Math.sin(t * 1.1 + i) * 0.03 * (1 - run);
      arm.shoulder.rotation.z = dir * (0.08 + 0.04 * run);
      arm.elbow.rotation.x = -(0.15 + 1.15 * run);
    });
    // two bounces per stride, a forward lean, and a breath when standing
    const bounce = Math.abs(Math.cos(phase)) * 0.06 * run;
    body.position.y = 0.82 + bounce + Math.sin(t * 1.6) * 0.006 * (1 - run);
    legs.forEach((leg) => (leg.hip.position.y = 0.84 + bounce));
    body.rotation.x = 0.2 * run;
    body.rotation.y = sw * 0.12 * run;
    pack.rotation.x = -0.05 - Math.abs(sw) * 0.07 * run;
    pack.position.y = 0.24 - bounce * 0.5;
    pearl.position.x = Math.sin(phase * 2) * 0.012 * run; // the pendant swings with her step
    sash.rotation.x = -0.5 * run - Math.sin(phase * 2 + 0.4) * 0.18 * run; // and the scarf ends fly out behind
    // hair lags behind the head: swept back at a run, swinging with each stride
    const sweep = -0.42 * run + Math.sin(phase * 2 + 0.8) * 0.1 * run + Math.sin(t * 1.3) * 0.015;
    hairBack.rotation.x = sweep * 0.7;
    hairSides.forEach((panel, i) => {
      panel.rotation.x = sweep * 0.6;
      panel.rotation.z = (i ? -1 : 1) * (0.06 * run + Math.sin(t * 1.1 + i) * 0.012);
    });
    head.rotation.y = lookX * 0.5 * (1 - 0.6 * run);
    head.rotation.x = -0.12 * run + lookY * 0.25 * (1 - run);
  };
  return { root, pose };
}

/* ------------------------------- fish ------------------------------- */

type Fish = {
  root: THREE.Group;
  tailBase: THREE.Group;
  tailTip: THREE.Group;
  fins: THREE.Object3D[];
  dorsal: THREE.Object3D;
  pelvic: THREE.Object3D;
  /**
   * Bend the body: a travelling wave (phase in radians, strength 0..1+), a sideways
   * curl when turning (bend) and an up/down arch when pitching (arch).
   */
  flex(phase: number, strength: number, bend: number, arch?: number): void;
};

/** One fish, facing -x: faceted body shaded dark on the back, long two-part tail. */
function fish(parent: THREE.Object3D): Fish {
  const root = new THREE.Group();
  parent.add(root);

  const geo = new THREE.SphereGeometry(1, 16, 10);
  const p = geo.attributes.position;
  const col = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) {
    const u = p.getX(i); // -1 nose … 1 tail root
    const taper = u > 0 ? 1 - 0.72 * Math.pow(u, 1.6) : 1 - 0.18 * u * u;
    const y = p.getY(i) * 0.44 * taper;
    const z = p.getZ(i) * 0.24 * taper;
    p.setXYZ(i, u * 1.0, y, z);
    // dark back, pale belly, with banded scales along the flank
    const back = THREE.MathUtils.smoothstep(y, -0.2, 0.36);
    const scale = u > -0.45 && Math.abs(y) < 0.36 ? (Math.round(u * 9) + Math.round(y * 12)) % 2 === 0 ? 0.16 : 0 : 0;
    const g = 0.96 - 0.5 * back - scale;
    col.set([g, g, g], i * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  const bodyMat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  const body = mesh(root, geo, bodyMat);
  body.frustumCulled = false;
  const rest = Float32Array.from(p.array as Float32Array);
  // sideways sway at a point along the spine (u: -1 nose … 1 tail root); it grows toward the tail
  const WAVES = 2.9;
  const wave = (u: number, phase: number, strength: number) => {
    const k = (u + 1) / 2;
    // the head yaws a little against the tail; the amplitude swells toward the tail
    return (0.035 * (1 - k) * (1 - k) + 0.27 * Math.pow(k, 2)) * strength * Math.sin(phase - u * WAVES);
  };

  // gill line, eye, mouth
  const gill = mesh(root, new THREE.TorusGeometry(0.34, 0.012, 4, 14, Math.PI * 0.9), M(0.15), -0.42, 0, 0, false);
  gill.rotation.y = Math.PI / 2;
  gill.rotation.x = Math.PI * 0.55;
  gill.scale.set(0.62, 1, 1);
  for (const side of [-1, 1]) {
    mesh(root, new THREE.SphereGeometry(0.075, 10, 8), M(1), -0.68, 0.1, side * 0.15, false);
    mesh(root, new THREE.SphereGeometry(0.04, 8, 6), M(0.05), -0.71, 0.1, side * 0.2, false);
  }
  mesh(root, box(0.1, 0.012, 0.2), M(0.1), -0.93, -0.07, 0, false).rotation.z = 0.25;

  const finShape = (pts: [number, number][]) => {
    const s = new THREE.Shape();
    s.moveTo(pts[0][0], pts[0][1]);
    pts.slice(1).forEach(([x, y]) => s.lineTo(x, y));
    return new THREE.ShapeGeometry(s);
  };
  const rays = (g: THREE.Object3D, from: [number, number], tos: [number, number][]) => {
    for (const [tx, ty] of tos) {
      const len = Math.hypot(tx - from[0], ty - from[1]);
      const r = mesh(g, box(len, 0.012, 0.012), M(0.15), (from[0] + tx) / 2, (from[1] + ty) / 2, 0, false);
      r.rotation.z = Math.atan2(ty - from[1], tx - from[0]);
    }
  };

  // dorsal fin
  const dorsal = new THREE.Group();
  dorsal.position.set(-0.1, 0.4, 0);
  root.add(dorsal);
  mesh(dorsal, finShape([[-0.25, 0], [-0.05, 0.3], [0.3, 0.36], [0.62, 0.22], [0.75, -0.08]]), M(0.9));
  rays(dorsal, [0.1, -0.02], [[-0.05, 0.3], [0.14, 0.34], [0.3, 0.36], [0.46, 0.29], [0.62, 0.22]]);

  // pectoral + pelvic fins
  const fins: THREE.Object3D[] = [];
  for (const side of [-1, 1]) {
    const f = new THREE.Group();
    f.position.set(-0.3, -0.12, side * 0.2);
    f.rotation.set(side * 0.9, 0, -0.5);
    root.add(f);
    mesh(f, finShape([[0, 0], [0.34, -0.06], [0.42, -0.28], [0.12, -0.2]]), M(0.9));
    rays(f, [0, 0], [[0.34, -0.06], [0.4, -0.18], [0.26, -0.24]]);
    fins.push(f);
  }
  const pelvic = new THREE.Group();
  pelvic.position.set(0.25, -0.33, 0);
  root.add(pelvic);
  mesh(pelvic, finShape([[0, 0.02], [0.3, -0.02], [0.34, -0.22], [0.1, -0.14]]), M(0.88));

  // tail: base fan, then a longer trailing tip hinged at its end
  const tailBase = new THREE.Group();
  tailBase.position.set(0.9, 0, 0);
  root.add(tailBase);
  mesh(tailBase, finShape([[0, 0.08], [0.55, 0.42], [0.62, 0], [0.55, -0.4], [0, -0.08]]), M(0.93));
  rays(tailBase, [0, 0], [[0.55, 0.42], [0.6, 0.2], [0.62, 0], [0.6, -0.2], [0.55, -0.4]]);
  const tailTip = new THREE.Group();
  tailTip.position.set(0.56, 0, 0);
  tailBase.add(tailTip);
  // the trailing lobes are cut in two and hinged again half way out, so the tail
  // whips like cloth instead of swinging like a board
  mesh(tailTip, finShape([[0, 0.42], [0.5, 0.74], [0.5, 0.27], [0.36, 0.1], [0.06, 0]]), M(0.95));
  mesh(tailTip, finShape([[0, -0.4], [0.46, -0.66], [0.5, -0.68], [0.5, -0.29], [0.36, -0.1], [0.06, 0]]), M(0.9));
  rays(tailTip, [0.02, 0.3], [[0.5, 0.74], [0.5, 0.45]]);
  rays(tailTip, [0.02, -0.3], [[0.5, -0.68], [0.5, -0.45]]);
  const tailEnd = new THREE.Group();
  tailEnd.position.set(0.5, 0, 0);
  tailTip.add(tailEnd);
  mesh(tailEnd, finShape([[0, 0.74], [0.55, 0.82], [0.12, 0.42], [0, 0.27]]), M(0.95));
  mesh(tailEnd, finShape([[0, -0.68], [0.48, -0.9], [0.1, -0.42], [0, -0.29]]), M(0.9));
  rays(tailEnd, [0, 0.6], [[0.55, 0.82], [0.3, 0.62]]);
  rays(tailEnd, [0, -0.55], [[0.48, -0.9], [0.28, -0.64]]);

  const flex = (phase: number, strength: number, bend: number, arch = 0) => {
    // a turning fish curls into the turn: the offset grows with the square of the distance from the head
    // The whole length bows, measured from the middle of the body: the tail sweeps
    // furthest and the head leans the same way a little, like a bent reed.
    const bow = (u: number) => (u < 0 ? 0.14 : 1) * u * u;
    const sway = (u: number, ph: number, st: number): number => wave(u, ph, st) + bend * bow(u);
    // pitching up or down bows it the same way, vertically
    const lift = (u: number) => arch * bow(u);
    for (let i = 0; i < p.count; i++) {
      const u = rest[i * 3];
      p.setY(i, rest[i * 3 + 1] + lift(u));
      p.setZ(i, rest[i * 3 + 2] + sway(u, phase, strength));
    }
    p.needsUpdate = true;
    dorsal.position.y = 0.4 + lift(0.2);
    pelvic.position.y = -0.33 + lift(0.25);
    tailBase.position.y = lift(0.9);
    tailBase.rotation.z = Math.atan((lift(0.95) - lift(0.8)) / 0.15) * 1.1;
    tailTip.rotation.z = Math.atan(arch) * 0.7 + Math.sin(phase * 0.5) * 0.06 * strength; // the long tail streams behind
    tailEnd.rotation.z = Math.atan(arch) * 0.9;
    // everything attached to the spine rides the same wave
    dorsal.position.z = sway(0.2, phase, strength);
    dorsal.rotation.y = -Math.atan((sway(0.5, phase, strength) - sway(-0.1, phase, strength)) / 0.6);
    pelvic.position.z = sway(0.25, phase, strength);
    tailBase.position.z = sway(0.9, phase, strength);
    const slope = (sway(0.95, phase, strength) - sway(0.8, phase, strength)) / 0.15;
    tailBase.rotation.y = -Math.atan(slope) * 1.25;
    tailTip.rotation.y = Math.sin(phase - WAVES - 1.2) * 0.7 * strength - bend * 1.3; // trails behind the base
    tailEnd.rotation.y = Math.sin(phase - WAVES - 2.3) * 0.95 * strength - bend * 1.5; // and the very end behind that
  };

  return { root, tailBase, tailTip, fins, dorsal, pelvic, flex };
}

/* ------------------------------ scenes ------------------------------ */

type Built = {
  camPos: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
  mute: number;
  shadowTarget: THREE.Vector3;
  /** set by the renderer: true when the scene sits in the narrow band under the text */
  narrow: boolean;
  update(t: number, px: number, py: number): void;
  jump?: () => void;
  fishPos?: THREE.Vector3;
  /** meshes left out of the normal pass (the water surface, so it does not hide what swims under it) */
  skipNormal?: THREE.Object3D[];
  leave?: () => void;
  enter?: () => void;
  portraitIn?: { approach: number; lookX: number; lookY: number };
  dropIn?: number;
  /** Solid objects: the colour drawn where a surface carries no ink (r, g, b in 0..1). Without it, white is see-through. */
  paper?: [number, number, number];
  /** Works overlay only: where each project card is on screen, set from the page, and the hook that puts them there. */
  workIn?: WorkCard[] | null;
  placeWorks?(at: ScreenToWorld, t: number): void;
  /** Journey and tool shelf: the tools' places on screen as they fall (canvas css px), set from the page. */
  toolPath?: ToolFall[] | null;
  /** Journey and tool shelf: called once the camera is set, to put the falling tools on that path. */
  placeTools?(at: ScreenToWorld, t: number): void;
  /** Journey only: where each tool ends up afloat, and its scale there. */
  landings?: THREE.Vector3[];
  landScale?: number;
  /** Journey only: the project cards afloat by the island: their centres, their height, and the hooks the page drives them with. */
  workSpots?: THREE.Vector3[];
  workHeight?: number;
  setWorksUp?(ups: number[] | null): void;
  setWorkX?(i: number, x: number): void;
  setLandingX?(i: number, x: number): void;
  /** Journey only: the runner's feet in the world, her height, and the switch that hides her. */
  runnerPos?: THREE.Vector3;
  runnerHeight?: number;
  hideRunner?: (hidden: boolean) => void;
  /** Journey only: which stage she is at (-1 between stages); its marker springs up. */
  setActiveNode?(i: number): void;
  /** Fish overlay only: a fixed camera on a single fish, posed from outside. */
  plain?: boolean;
  /** Where the key light stands relative to the shadow target; defaults to high on the upper left. */
  lightFrom?: THREE.Vector3;
  poseIn?: { dir: number; pitch: number; beat: number; bend: number; arch: number };
  /** Journey only: label anchors of the stage nodes standing on the bank. */
  nodes?: THREE.Vector3[];
  /** Journey only: the camera's x this frame, set by the renderer before update(). */
  camX?: number;
  /** Journey only: the river x under the mouse, or null. The fish keeps under it. */
  mouseX?: number | null;
  /** Journey only: camera framing for a progress of 0 (the source) … 1 (the sea). */
  frame?(p: number): { x: number; y: number; z: number; targetY: number; fov: number; mute: number; side: number };
};

const gauss = (dx: number, sx: number, dz: number, sz: number) => Math.exp(-((dx / sx) ** 2) - (dz / sz) ** 2);

function buildHero(scene: THREE.Scene): Built {
  const r = rng(7);
  const slope: Ground = (x, z) =>
    2.75 * gauss(x - 2.2, 1.9, z + 0.5, 1.8) +
    0.5 * gauss(x + 1.1, 1.15, z - 1.5, 1.3) +
    // the low apron of land runs far to the right but shelves off quickly on the left,
    // so the island ends in its own shoreline before it reaches the text
    0.52 * gauss(x - 0.8, x < 0.8 ? 2.7 : 5, z - 1, 3.1) -
    0.24 +
    0.035 * Math.sin(x * 3.1) * Math.cos(z * 2.7);
  // The summit is levelled into a terrace for the lighthouse and the house to
  // stand on; on the bare slope their downhill sides hung in the air.
  const TERRACE = { x: 2.35, z: -0.4, r: 0.95 };
  const terraceY = slope(TERRACE.x + 0.55, TERRACE.z + 0.2);
  const ground: Ground = (x, z) => {
    const d = Math.hypot(x - TERRACE.x, (z - TERRACE.z) * 1.25);
    const k = 1 - THREE.MathUtils.smoothstep(d, TERRACE.r, TERRACE.r + 0.45);
    return THREE.MathUtils.lerp(slope(x, z), terraceY, k);
  };

  const terrain = new THREE.PlaneGeometry(20, 14, 150, 105);
  terrain.rotateX(-Math.PI / 2);
  const tp = terrain.attributes.position;
  for (let i = 0; i < tp.count; i++) tp.setY(i, ground(tp.getX(i) + 1, tp.getZ(i)));
  terrain.translate(1, 0, 0);
  terrain.computeVertexNormals();
  mesh(scene, terrain, M(0.93));

  const w = riverWater(RIVER_LENGTH);
  const wm = mesh(scene, new THREE.PlaneGeometry(700, 130), w, RIVER_LENGTH / 2, 0, -45, false);
  wm.rotation.x = -Math.PI / 2;
  wm.receiveShadow = false;

  const on = (x: number, z: number) => [x, ground(x, z), z] as const;

  // summit
  lighthouse(scene, ...on(1.95, -0.5));
  house(scene, ...on(2.75, -0.3), -0.25);
  // stone footings, sunk into the terrace, so both read as built on the ground
  mesh(scene, cyl(0.4, 0.46, 0.3, 12), M(0.7), 1.95, terraceY - 0.08, -0.5);
  const footing = mesh(scene, box(0.74, 0.3, 0.58), M(0.7), 2.75, terraceY - 0.1, -0.3);
  footing.rotation.y = -0.25;
  for (let i = 0; i < 6; i++) {
    const fx = 2.3 + i * 0.2;
    const fz = 0.35 + Math.sin(i) * 0.05;
    mesh(scene, box(0.03, 0.16, 0.03), M(0.3), fx, ground(fx, fz) + 0.07, fz);
    if (i < 5) mesh(scene, box(0.2, 0.02, 0.02), M(0.3), fx + 0.1, ground(fx + 0.1, fz) + 0.11, fz);
  }
  // stepping stones winding down to the shore
  for (let i = 0; i < 16; i++) {
    const k = i / 15;
    const sx = 1.9 + Math.sin(k * 5.2) * 0.55 - k * 0.9;
    const sz = 0.3 + k * 3.2;
    const st = mesh(scene, cyl(0.1, 0.12, 0.04, 6), M(0.62), sx, ground(sx, sz) + 0.02, sz);
    st.rotation.y = i;
    st.scale.x = 1.3;
  }
  // woods
  tree(scene, ...on(0.85, -0.1), 0.3, 1);
  tree(scene, ...on(0.2, 0.7), 0.24, 2);
  tree(scene, ...on(3.5, 0.5), 0.3, 3);
  tree(scene, ...on(4.1, -0.7), 0.36, 4);
  const blades = windmill(scene, ...on(-1.1, 1.5));
  tree(scene, ...on(4.6, 1.2), 0.26, 6);
  pine(scene, ...on(1.25, -1.3), 0.9);
  pine(scene, ...on(0.55, -0.9), 0.7);
  pine(scene, ...on(3.0, -1.5), 0.85);
  pine(scene, ...on(3.45, -1.2), 0.6);
  pine(scene, ...on(-1.65, 1.25), 0.7);
  pine(scene, ...on(-0.5, 1.05), 0.55);
  pine(scene, ...on(1.3, 1.1), 0.5);
  // shore: boulders, pebbles, plants
  rock(scene, ...on(0.15, 3.5), 0.42, 1);
  rock(scene, ...on(0.75, 3.85), 0.2, 2, 0.8);
  rock(scene, ...on(2.75, 3.55), 0.55, 3);
  rock(scene, ...on(3.35, 4.05), 0.24, 4, 0.78);
  rock(scene, ...on(-0.75, 3.3), 0.22, 5);
  rock(scene, ...on(1.85, 2.5), 0.16, 6, 0.8);
  rock(scene, ...on(4.3, 3.2), 0.38, 7);
  rock(scene, ...on(2.2, 1.2), 0.2, 8);
  for (let i = 0; i < 26; i++) {
    const x = -2.4 + r() * 7;
    const z = 2.6 + r() * 1.9;
    if (ground(x, z) > -0.03) rock(scene, x, ground(x, z) - 0.02, z, 0.035 + r() * 0.05, 20 + i, 0.7);
  }
  plant(scene, ...on(-0.45, 3.8), 0.78, "tulip", 1);
  plant(scene, ...on(-0.2, 4.0), 0.5, "bud", 2);
  plant(scene, ...on(-0.75, 3.95), 0.4, "daisy", 3);
  plant(scene, ...on(1.55, 4.15), 0.72, "reed", 4);
  plant(scene, ...on(1.7, 4.25), 0.5, "reed", 5);
  plant(scene, ...on(1.4, 4.3), 0.6, "reed", 6);
  plant(scene, ...on(0.9, 3.2), 0.36, "daisy", 7);
  plant(scene, ...on(2.1, 3.3), 0.42, "tulip", 8);
  plant(scene, ...on(3.75, 3.7), 0.55, "bud", 9);
  plant(scene, ...on(-0.6, 3.0), 0.46, "tulip", 10);
  plant(scene, ...on(3.1, 2.4), 0.3, "daisy", 11);
  for (let i = 0; i < 90; i++) {
    const x = -3 + r() * 8.5;
    const z = -1.5 + r() * 6;
    const y = ground(x, z);
    if (y > 0.02) tuft(scene, x, y, z, 0.8 + r() * 0.8);
  }

  const sail = boat(scene, 4.7, 5.6, 0.8);
  sail.rotation.y = -0.4;

  // lived-in details
  signpost(scene, ...on(0.72, 2.95)).rotation.y = 0.3;
  bench(scene, ...on(3.25, 0.25), -0.5);
  well(scene, ...on(1.35, 0.35));
  birch(scene, ...on(-0.55, 1.9), 0.8, 1);
  birch(scene, ...on(-0.2, 2.2), 0.62, 2);
  birch(scene, ...on(4.0, 1.9), 0.75, 3);
  for (let i = 0; i < 4; i++) rock(scene, ...on(1.6 + Math.cos(i * 1.7) * 0.42, -0.45 + Math.sin(i * 1.7) * 0.4), 0.09 + (i % 2) * 0.04, 40 + i, 0.8);
  for (const [bx, bz, br] of [[0.5, 1.6, 0.16], [2.9, 1.5, 0.18], [3.7, 2.3, 0.14], [-0.9, 2.5, 0.15], [1.5, 2.1, 0.12], [4.4, 0.4, 0.2], [0.1, -0.3, 0.16], [2.6, -1.0, 0.15], [-1.3, 2.0, 0.14], [3.2, 3.0, 0.12]] as const) {
    bush(scene, ...on(bx, bz), br, bx * 7);
  }
  for (const [mx, mz] of [[0.95, 0.15], [0.3, 0.95], [3.4, 0.8], [-0.45, 2.1], [4.05, 2.15], [1.2, -1.0]] as const) {
    mushroom(scene, ...on(mx, mz), 1);
    mushroom(scene, ...on(mx + 0.07, mz + 0.05), 0.7);
  }
  for (let i = 0; i < 70; i++) {
    const x = -2.6 + r() * 7.6;
    const z = -0.8 + r() * 4.6;
    const y = ground(x, z);
    if (y > 0.04) flower(scene, x, y, z, 0.8 + r() * 0.7);
  }
  // jetty with a moored rowboat, water plants, ducks
  pier(scene, 2.35, 4.05, 1.3);
  const skiff = rowboat(scene, 2.78, 5.05, 1.35);
  for (const [lx, lz, lr, lb] of [[-1.0, 5.1, 0.1, 1], [-0.75, 5.35, 0.07, 0], [-1.25, 5.45, 0.08, 0], [1.75, 6.0, 0.1, 1], [1.5, 6.2, 0.07, 0], [3.7, 5.0, 0.09, 0], [3.45, 5.25, 0.1, 1], [-1.6, 4.6, 0.07, 0]] as const) {
    lilyPad(scene, lx, lz, lr, !!lb);
  }
  plant(scene, -0.55, -0.05, 4.75, 0.6, "reed", 12);
  plant(scene, -0.42, -0.05, 4.85, 0.45, "reed", 13);
  plant(scene, 3.95, -0.05, 4.5, 0.62, "reed", 14);
  plant(scene, 4.1, -0.05, 4.62, 0.48, "reed", 15);
  const ducks = [duck(scene, -1.7, 5.0, 1), duck(scene, -1.95, 5.2, 0.7), duck(scene, -2.15, 5.05, 0.7)];
  // chimney smoke
  const puffMat = flatTone(0.13);
  const [hx, hy, hz] = on(2.75, -0.3);
  const puffs = [0, 1, 2, 3].map(() => mesh(scene, new THREE.IcosahedronGeometry(0.07, 1), puffMat, hx, hy, hz, false));

  // far distance
  const ridge = (x: number, z: number, sx: number, sy: number) => {
    const m = mesh(scene, new THREE.SphereGeometry(1, 28, 10), M(0.9), x, -0.4, z, false);
    m.scale.set(sx, sy, 3);
  };
  ridge(8, -26, 15, 3.4);
  ridge(1, -34, 9.5, 2.1); // ends on its own, well right of the text
  ridge(22, -40, 16, 4.4);
  cloud(scene, -9, 12, -56, 1.5);
  cloud(scene, 15, 9, -56, 1.2);
  cloud(scene, -23, 12.4, -56, 1.0, 0.1);
  const birds = [bird(scene, -1.5, 5.3, -8, 0.22), bird(scene, -0.7, 5.7, -9, 0.18), bird(scene, 5.4, 5.0, -8, 0.2)];

  // the fish swims in the river, just off the shore, breaking the surface
  const f = fish(scene);
  const FISH = { x: 0.35, z: 5.7, y: 0.11 };
  const fishPos = new THREE.Vector3(FISH.x, 0, FISH.z);
  // upstream side, in front of and above the text: things on the water, things in the sky
  for (const [lx, lz, lr, lb] of [[-3.7, 5.3, 0.1, 1], [-3.4, 5.6, 0.08, 0], [-4.2, 5.9, 0.09, 0], [-2.7, 6.1, 0.1, 1], [-4.8, 5.2, 0.08, 0]] as const) {
    lilyPad(scene, lx, lz, lr, !!lb);
  }
  rock(scene, -4.3, -0.02, 4.7, 0.34, 51);
  rock(scene, -3.95, -0.02, 4.85, 0.16, 52, 0.8);
  plant(scene, -4.45, -0.05, 4.95, 0.62, "reed", 21);
  plant(scene, -4.3, -0.05, 5.02, 0.44, "reed", 22);
  const drifter = rowboat(scene, -3.0, 6.25, 0.25);
  const marker = buoy(scene, -5.4, 3.6, 0.9);
  const leftBirds = [bird(scene, -7.6, 6.9, -10, 0.24), bird(scene, -6.5, 7.4, -11, 0.2), bird(scene, -8.4, 7.2, -12, 0.22)];

  // downstream: the banks the river passes, then the sea it runs into
  const mid = midland(scene);
  const seaGroup = new THREE.Group();
  seaGroup.position.x = RIVER_LENGTH;
  scene.add(seaGroup);
  const sea = buildContact(seaGroup, false);

  // The tools from the About shelf, a second time: they come down into the sea at
  // the end of the river and float there. Each lands at its own spot and time.
  const ADRIFT_AT: [number, number][] = [
    [-4.2, 5.9], [-0.5, 5.2], [-2.5, 6.2], [0.2, 5.5], [-3.3, 5.4], [0.9, 4.8],
    [-1.7, 5.6], [-0.7, 2.6], [-1.0, 3.0], [1.3, 3.6], [0.3, 1.8], [1.2, 2.7],
  ];
  const ADRIFT_SCALE = 0.56;
  const adrift = TOOL_SLOTS.map((slot, i) => {
    const obj = toolObject(slot.id);
    obj.scale.setScalar(ADRIFT_SCALE);
    scene.add(obj);
    const ring = mesh(scene, new THREE.RingGeometry(0.9, 1, 22), M(0.15), 0, 0.012, 0, false);
    ring.rotation.x = -Math.PI / 2;
    ring.receiveShadow = false;
    // Hand-placed in the open water the last view actually shows: a few in front,
    // under the headline; a few in the middle; a few further out. (x is measured
    // from the sea's centre.) None sits behind the bank or another tool.
    const [dx, z] = ADRIFT_AT[i % ADRIFT_AT.length];
    return {
      obj,
      ring,
      x: RIVER_LENGTH + dx,
      z,
      spin: (i % 2 ? 1 : -1) * (0.4 + (i % 3) * 0.2),
    };
  });

  // The four featured projects, afloat by the hero's island: small cards standing in
  // the water, half under it, each rocking and turning in its own time with a ring
  // spreading round it, as the tools do at sea. When the page scrolls they rise out
  // of the water and square up to the viewer; the overlay takes them from there.
  const WORK_H = 0.46; // a card's height in the world: about the size of a tool afloat
  const WORK_W = WORK_H * 0.72;
  const worksAfloat = [
    { x: 3.1, z: 6.3 },
    { x: 4.3, z: 7.2 },
    { x: 5.4, z: 6.0 },
    { x: 6.6, z: 7.0 },
  ].map((spot, i) => {
    const hold = new THREE.Group();
    scene.add(hold);
    const slab = workSlab(hold, i);
    slab.scale.set(WORK_W, WORK_H, 1.2); // thick enough to read as a thing in the water
    const ring = mesh(scene, new THREE.RingGeometry(0.9, 1, 22), M(0.15), 0, 0.012, 0, false);
    ring.rotation.x = -Math.PI / 2;
    ring.receiveShadow = false;
    return { hold, ring, x: spot.x, z: spot.z, centre: new THREE.Vector3(spot.x, 0, spot.z) };
  });
  const WORKS_AIMED_AT = 0.7; // the camera's x at the top of the page, where their places were worked out
  let worksUp: number[] | null = null; // per card: 0 afloat … 1 clear of the water and upright (from the page)

  // Everything below the waterline is cut away from the scenery, so the clear
  // water shows only what swims in it. The fish is built afterwards and is not cut.
  const cut = [new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.015)];
  const cutCache = new Map<THREE.Material, THREE.Material>();
  // The fish is the one thing that lives below the waterline, so it is left whole.
  // Its submerged part is drawn differently instead: paler the deeper it is, and
  // flagged "soft" so it gets no outline. Seen through the water it is a blurred
  // shape; where it breaks the surface it is crisp again.
  const fishParts = new Set<THREE.Object3D>();
  const wetCache = new Map<THREE.Material, THREE.Material>();
  f.root.traverse((o) => {
    fishParts.add(o);
    const m = o as THREE.Mesh;
    if (!m.isMesh || !(m.material instanceof THREE.MeshLambertMaterial)) return;
    let wet = wetCache.get(m.material);
    if (!wet) {
      wet = m.material.clone();
      wet.onBeforeCompile = (shader) => {
        shader.vertexShader = shader.vertexShader
          .replace("#include <common>", "#include <common>\nvarying float vRiverY;")
          .replace("#include <project_vertex>", "#include <project_vertex>\nvRiverY = (modelMatrix * vec4(transformed, 1.0)).y;");
        shader.fragmentShader = shader.fragmentShader
          .replace("#include <common>", "#include <common>\nvarying float vRiverY;")
          .replace(
            "#include <dithering_fragment>",
            `#include <dithering_fragment>
            if (vRiverY < 0.0) {
              float depth = clamp(-vRiverY * 3.4, 0.0, 1.0);
              // flatten its shading to a pale grey, fading out quickly with depth
              gl_FragColor.rgb = mix(mix(gl_FragColor.rgb, vec3(0.7), 0.88), vec3(1.0), depth * 0.8);
              gl_FragColor.a = 0.5;
              // and break it into loose horizontal slivers, as if seen through moving water:
              // the gaps are fixed to the screen, so the shape shimmers as the fish swims
              float sliver = sin(gl_FragCoord.y * 2.1 + sin(gl_FragCoord.x * 0.35) * 1.4);
              if (sliver > 0.35 - depth * 0.5) discard;
            }`,
          );
      };
      wet.customProgramCacheKey = () => "river-wet";
      wetCache.set(m.material, wet);
    }
    m.material = wet;
  });
  scene.traverse((o) => {
    const m = o as THREE.Mesh;
    if (fishParts.has(o) || !m.isMesh || !(m.material instanceof THREE.MeshLambertMaterial)) return;
    let c = cutCache.get(m.material);
    if (!c) {
      c = m.material.clone();
      c.clippingPlanes = cut;
      cutCache.set(m.material, c);
    }
    m.material = c;
  });

  // --- swimming state, integrated every frame ---
  const G = 14; // gravity, world units / s²
  const swim = {
    x: FISH.x,
    z: FISH.z,
    y: -0.12,
    vy: 0,
    dir: Math.PI, // direction of travel in the xz plane (0 = +x)
    speed: 0.3,
    beat: 1.4, // tail beats per second
    phase: 0,
    turn: 0, // smoothed turn rate, rad/s
    bend: 0, // how far the body is curled sideways, and arched up or down
    arch: 0,
    tx: FISH.x - 0.8,
    tz: FISH.z,
    retarget: 0,
    coastUntil: 0,
    mode: "cruise" as "cruise" | "run" | "air" | "plunge",
    modeAt: 0,
    wantLeap: false,
    away: false, // out of the river, flying alongside the page
    lastLeap: -1,
    nextLeap: 6,
    hop: 1.75, // horizontal speed of the next leap
    lastT: 0,
  };
  const splash = [0, 1].map(() => {
    const ring = mesh(scene, new THREE.RingGeometry(0.9, 1, 28), M(0.1), FISH.x, 0.014, FISH.z, false);
    ring.rotation.x = -Math.PI / 2;
    ring.receiveShadow = false;
    ring.visible = false;
    return { ring, at: -9 };
  });
  const drops = Array.from({ length: 14 }, (_, i) => {
    const d = mesh(scene, new THREE.IcosahedronGeometry(0.016 + (i % 3) * 0.006, 0), M(0.15), 0, -1, 0, false);
    d.visible = false;
    return { mesh: d, a: (i / 14) * Math.PI * 2, v: 0.5 + (i % 4) * 0.2, up: 2.2 + (i % 5) * 0.4, at: -9, x: 0, z: 0 };
  });
  const burst = (i: number, t: number, x: number, z: number) => {
    splash[i].at = t;
    splash[i].ring.position.set(x, 0.014, z);
    drops.forEach((d, k) => {
      if (k % 2 !== i) return;
      d.at = t;
      d.x = x;
      d.z = z;
    });
  };

  return {
    camPos: new THREE.Vector3(0.7, 2.6, 15),
    target: new THREE.Vector3(0.7, 1.6, 0),
    fov: 28,
    mute: 30,
    shadowTarget: new THREE.Vector3(1.5, 0, 1.5),
    camX: 0.7,
    dropIn: 0,
    landings: adrift.map((item) => new THREE.Vector3(item.x, 0.1, item.z)),
    landScale: ADRIFT_SCALE,
    workSpots: worksAfloat.map((w) => w.centre),
    workHeight: WORK_H,
    setWorksUp(ups: number[] | null) {
      worksUp = ups;
    },
    setWorkX(i: number, x: number) {
      if (worksAfloat[i]) worksAfloat[i].x = x;
    },
    // the page moves each landing spot to lie straight below that tool's case
    setLandingX(i: number, x: number) {
      if (!adrift[i]) return;
      adrift[i].x = x;
      this.landings![i].x = x;
    },
    // a falling tool follows the page's path: the same spot on screen the shelf is
    // drawing it at, so it carries on below the About sheet without a break
    placeTools(at) {
      const path = this.toolPath;
      if (!path) return;
      adrift.forEach((item, i) => {
        const f = path[i];
        if (!f || f.k <= 0 || f.k >= 1) return;
        const { p, px } = at(f.x, f.y, item.z);
        const turn = tumble(f.k, i);
        const settle = THREE.MathUtils.smoothstep(f.k, 0.8, 1); // eases into the pose it floats in
        item.obj.position.copy(p);
        item.obj.rotation.set(turn.x - 0.28 * settle, turn.y, turn.z);
        item.obj.scale.setScalar(f.unit / px);
      });
    },
    nodes: mid.nodes,
    runnerPos: mid.runnerPos,
    runnerHeight: mid.runnerHeight,
    hideRunner: mid.hideRunner,
    setActiveNode: mid.setActiveNode,
    frame(p) {
      const e = p; // pacing along the river is set by the page, section by section
      const arrive = THREE.MathUtils.smoothstep(p, 0.6, 1);
      return {
        x: THREE.MathUtils.lerp(0.7, RIVER_LENGTH, e),
        y: THREE.MathUtils.lerp(2.6, 1.7, arrive),
        z: THREE.MathUtils.lerp(15, 14, arrive),
        targetY: THREE.MathUtils.lerp(1.42, 1.2, arrive), // looking a touch lower keeps a band of river in front
        fov: THREE.MathUtils.lerp(30, 30, arrive),
        mute: THREE.MathUtils.lerp(30, 78, arrive),
        // text sits on the left at both ends; in between the scene runs edge to edge
        side: Math.max(1 - THREE.MathUtils.smoothstep(p, 0.02, 0.16), THREE.MathUtils.smoothstep(p, 0.86, 0.98)),
      };
    },
    narrow: false,
    fishPos,
    skipNormal: [wm],
    jump() {
      if (swim.mode !== "air" && !swim.away) swim.wantLeap = true; // a click mid-plunge is remembered for the next leap
    },
    leave() {
      if (swim.away) return;
      burst(0, swim.lastT, swim.x, swim.z);
      swim.away = true;
    },
    enter() {
      if (!swim.away) return;
      swim.away = false;
      swim.y = 0.02;
      swim.vy = -3.2;
      swim.speed = 0.5;
      swim.dir = Math.PI;
      swim.mode = "plunge";
      swim.modeAt = swim.lastT;
      burst(1, swim.lastT, swim.x, swim.z);
    },
    update(t, px, py) {
      w.uniforms.uT.value = t;
      sail.position.y = Math.sin(t * 1.1) * 0.02;
      sail.rotation.z = Math.sin(t * 0.9) * 0.04;
      birds.forEach((b, i) => {
        b.position.y += Math.sin(t * 1.3 + i * 2) * 0.0008;
        b.children.forEach((wing, k) => (wing.rotation.z = (k ? 1 : -1) * (0.45 + Math.sin(t * 5 + i) * 0.3)));
      });
      // fish: idle bob, travelling tail wave, slight turn toward the pointer
      blades.rotation.z = -t * 0.7;
      drifter.position.y = 0.02 + Math.sin(t * 1.1 + 2) * 0.012;
      drifter.rotation.z = Math.sin(t * 0.9 + 1) * 0.05;
      marker.position.y = Math.sin(t * 1.3) * 0.03;
      marker.rotation.z = Math.sin(t * 1.1) * 0.08;
      leftBirds.forEach((b, i) => b.children.forEach((wing, k) => (wing.rotation.z = (k ? 1 : -1) * (0.45 + Math.sin(t * 5 + i * 1.7) * 0.3))));
      skiff.position.y = 0.02 + Math.sin(t * 1.3) * 0.012;
      skiff.rotation.z = Math.sin(t * 1.1) * 0.05;
      ducks.forEach((d, i) => {
        d.position.x = -1.7 - i * 0.24 + Math.sin(t * 0.12) * 0.7;
        d.position.y = Math.sin(t * 2 + i * 1.3) * 0.008;
        d.rotation.y = Math.cos(t * 0.12) > 0 ? Math.PI : 0;
      });
      puffs.forEach((p, i) => {
        const k = (t * 0.16 + i / 4) % 1;
        p.position.set(hx + 0.14 + k * 0.35 + Math.sin(k * 5 + i) * 0.05, hy + 0.7 + k * 1.1, hz - 0.05);
        p.scale.setScalar(0.6 + k * 1.8);
        p.visible = k < 0.9;
      });

      // --- the fish: a small integrated model rather than a canned path ---
      // Thrust comes from the tail: speed settles at a fixed distance per beat,
      // turning needs forward speed, and it swims in bursts with glides between.
      // A leap is a real one: a run-up, a ballistic arc under gravity with the
      // body following its velocity, then a plunge that the water slows down.
      const sw = swim;
      const dt = Math.min(0.05, Math.max(0, t - sw.lastT));
      sw.lastT = t;
      const scale = this.narrow ? 0.5 : 0.34;
      const LEN = 2.5 * scale; // nose to tail tip
      // its stretch of river travels with the camera, so it keeps the visitor company all the way down
      const camX = this.camX ?? 0.7;
      // With the mouse over the river it keeps under the pointer, milling about in a
      // small patch there; otherwise it has the stretch in front of the camera.
      const led = this.mouseX != null;
      const cx = led ? (this.mouseX as number) : camX + (this.narrow ? 0.2 : -0.25);
      const rx = led ? 0.42 : this.narrow ? 0.8 : 1.2;
      mid.update(t, camX);
      sea.update(t, 0, 0);
      worksAfloat.forEach((w, i) => {
        const up = THREE.MathUtils.clamp(worksUp?.[i] ?? 0, 0, 1);
        const afloat = 1 - up;
        // going with the water: up and down on the swell, drifting, rocking, slowly turning
        const bob = Math.sin(t * 1.3 + i * 1.7) * 0.035 + Math.sin(t * 0.53 + i * 0.9) * 0.02;
        const drift = Math.sin(t * 0.25 + i * 2.3) * 0.1;
        // afloat, a little under half of it is below the surface; risen, its foot is just clear of the water
        const y = THREE.MathUtils.lerp(WORK_H * 0.1 + bob * 0.7, WORK_H * 0.5 + 0.1, up);
        // they keep their place across the screen: as the camera drifts downstream, so do they
        w.hold.position.set(camX - WORKS_AIMED_AT + w.x + drift * afloat, y, w.z);
        w.hold.rotation.set(
          (-0.3 + Math.sin(t * 0.9 + i) * 0.08) * afloat,
          Math.sin(t * 0.2 + i * 1.9) * 0.55 * afloat,
          Math.sin(t * 0.7 + i * 1.3) * 0.12 * afloat,
        );
        w.hold.visible = worksUp !== null && up < 1;
        w.centre.copy(w.hold.position);
        const pulse = (t * 0.32 + i * 0.37) % 1;
        w.ring.visible = w.hold.visible && up < 0.25;
        w.ring.position.set(w.hold.position.x, 0.012, w.z + 0.05);
        w.ring.scale.set(0.2 + pulse * 0.32, (0.2 + pulse * 0.32) * 0.5, 1);
      });
      const drop = this.dropIn ?? 0;
      adrift.forEach((item, i) => {
        const k = dropShare(drop, i);
        item.obj.visible = k > 0;
        if (k <= 0) {
          item.ring.visible = false;
          return;
        }
        const landed = k >= 1;
        item.obj.scale.setScalar(ADRIFT_SCALE);
        // it falls from above the frame, tumbling, and settles half in the water
        const y = landed ? 0.1 + Math.sin(t * 1.3 + i * 1.7) * 0.03 : 7 - 6.9 * k * k;
        item.obj.position.set(item.x + (landed ? Math.sin(t * 0.25 + i * 2.3) * 0.12 : 0), y, item.z);
        item.obj.rotation.set(
          landed ? -0.28 + Math.sin(t * 0.9 + i) * 0.07 : (1 - k) * 5 * item.spin,
          landed ? Math.sin(t * 0.2 + i * 1.9) * 0.5 : (1 - k) * 3 * item.spin,
          landed ? Math.sin(t * 0.7 + i * 1.3) * 0.1 : (1 - k) * 4 * item.spin,
        );
        // a ring spreads from where it sits, again and again, a little out of step with the others
        const pulse = (t * 0.32 + i * 0.37) % 1;
        item.ring.visible = landed;
        item.ring.position.set(item.obj.position.x, 0.012, item.z + 0.05);
        item.ring.scale.set(0.3 + pulse * 0.5, (0.3 + pulse * 0.5) * 0.5, 1);
      });
      const Z0 = FISH.z - 0.32;
      const Z1 = FISH.z + 0.32;
      f.root.scale.setScalar(scale);

      if (sw.lastLeap < 0) sw.lastLeap = t - 2; // first frame: no leap straight away
      // a leap needs more room than the patch it idles in
      const LEFT = cx - Math.max(rx, 1.2);
      const RIGHT = cx + Math.max(rx, 1.2);
      if (sw.mode === "cruise" && !sw.away) {
        if (sw.x < LEFT - 0.1 || sw.x > RIGHT + 0.1) {
          // strayed past the stretch it lives in: head back to the middle
          sw.tx = cx;
          sw.tz = FISH.z;
          sw.retarget = t + 2;
        }
        if (sw.wantLeap || t - sw.lastLeap > sw.nextLeap) {
          // line up along the river, toward whichever side leaves more room to land
          sw.wantLeap = false;
          sw.nextLeap = 5 + Math.random() * 6; // every now and then, never on a beat
          sw.tx = sw.x > camX - 0.25 ? LEFT : RIGHT; // leap toward the middle of the screen, never off its edge
          sw.tz = FISH.z;
          sw.mode = "run";
          sw.modeAt = t;
        } else if (t > sw.retarget || Math.hypot(sw.tx - sw.x, sw.tz - sw.z) < 0.25) {
          sw.tx = cx + (Math.random() * 2 - 1) * rx;
          sw.tz = Z0 + Math.random() * (Z1 - Z0);
          sw.retarget = t + 3 + Math.random() * 3;
          if (Math.random() < 0.45) sw.coastUntil = t + 0.8 + Math.random() * 1.2; // glide for a while
        }
      }

      const swimming = !sw.away && (sw.mode === "cruise" || sw.mode === "run");
      if (sw.away) {
        // not in the river: its place is kept under the camera, ready for the dive back in
        sw.x = cx;
        sw.z = FISH.z;
        sw.y = -1;
        sw.vy = 0;
        sw.speed = 0;
        sw.turn = 0;
        sw.mode = "cruise";
        sw.lastLeap = t;
      } else if (swimming) {
        let want = Math.atan2(sw.tz - sw.z, sw.tx - sw.x) - sw.dir;
        want = Math.atan2(Math.sin(want), Math.cos(want));
        // a fish cannot pivot on the spot: turn rate scales with how fast it is moving
        const maxTurn = 0.6 + 3.2 * Math.min(1, sw.speed / (LEN * 0.9));
        const turnTo = THREE.MathUtils.clamp(want * 2.4, -maxTurn, maxTurn);
        sw.turn += (turnTo - sw.turn) * Math.min(1, dt * 5);
        sw.dir += sw.turn * dt;

        const run = sw.mode === "run";
        // left behind by a fast scroll: sprint to catch up, harder the further back it is
        // hopelessly far back (the page jumped): it is well off screen, so it rejoins just out of view
        if (Math.abs(sw.x - cx) > rx + 6) sw.x = cx + Math.sign(sw.x - cx) * (rx + 3);
        // led by the mouse: how far it still has to go to be under the pointer
        const lead = led && !run ? Math.max(0, Math.abs(sw.x - cx) - rx) : 0;
        const behind = led ? 0 : Math.max(0, Math.abs(sw.x - cx) - rx);
        if ((behind > 0 || lead > 0) && !run) {
          sw.tx = cx;
          sw.tz = FISH.z;
          sw.retarget = t + 1;
        }
        const beatTo = run
          ? 4.6
          : lead > 0
            ? Math.min(4, 1.5 + lead * 1.3)
            : behind > 0.3
              ? 3.4
              : t < sw.coastUntil
                ? 0.35
                : 1.5 + 0.9 * Math.min(1, Math.abs(want));
        sw.beat += (beatTo - sw.beat) * Math.min(1, dt * (run ? 7 : 2.5));
        // About half a body length per tail beat. Heading for the pointer it swims
        // faster the further it has to go and eases off as it arrives, so it pulls up
        // under the mouse instead of shooting past.
        const cruise = lead > 0 ? Math.min(2.6, 0.45 + lead * 2.1) : 0.55 * LEN * sw.beat + behind * 2.6;
        const braking = led ? 4 : 0.9; // it brakes with its fins when it has somewhere to stop
        sw.speed += (cruise - sw.speed) * Math.min(1, dt * (cruise > sw.speed ? (led ? 3.5 : 2.2) : braking));

        const depth = run ? -0.04 : -0.13 + 0.03 * Math.sin(t * 0.4);
        sw.vy += ((depth - sw.y) * 9 - sw.vy * 5) * dt;
        sw.y += sw.vy * dt;

        // leave the water once it is up to speed and pointing the right way
        if (run && (t - sw.modeAt > 0.8 || (sw.speed > LEN * 1.3 && Math.abs(want) < 0.35))) {
          sw.mode = "air";
          sw.modeAt = t;
          sw.vy = 4.6 * Math.sqrt(scale / 0.34);
          // carry only as far as there is river left: flight time is 2·vy/G, then a short glide
          const room = Math.abs(sw.tx - sw.x);
          sw.speed = THREE.MathUtils.clamp((room - 0.35) / ((2 * sw.vy) / G), 0.8, 1.75);
          sw.y = 0.02;
          burst(0, t, sw.x, sw.z);
        }
      } else if (sw.mode === "air") {
        sw.vy -= G * dt; // nothing but gravity up here
        sw.y += sw.vy * dt;
        sw.turn *= 1 - Math.min(1, dt * 6);
        sw.beat += (0.6 - sw.beat) * Math.min(1, dt * 4);
        if (sw.y < 0 && sw.vy < 0) {
          sw.mode = "plunge";
          sw.modeAt = t;
          burst(1, t, sw.x, sw.z);
        }
      } else {
        // back in the water: drag kills the fall, buoyancy and a few strokes bring it level
        sw.vy += ((-0.13 - sw.y) * 14 - sw.vy * 7) * dt;
        sw.y += sw.vy * dt;
        sw.speed += (0.55 * LEN * 1.2 - sw.speed) * Math.min(1, dt * 5); // water takes the speed off fast
        sw.beat += (1.8 - sw.beat) * Math.min(1, dt * 3);
        if (t - sw.modeAt > 0.9) {
          sw.mode = "cruise";
          sw.lastLeap = t;
          sw.retarget = 0;
        }
      }
      sw.x += Math.cos(sw.dir) * sw.speed * dt;
      sw.z += Math.sin(sw.dir) * sw.speed * dt;
      sw.z = THREE.MathUtils.clamp(sw.z, Z0 - 0.15, Z1 + 0.15);
      if (!swimming) sw.x = THREE.MathUtils.clamp(sw.x, LEFT - 0.2, RIGHT + 0.2); // a leap never carries past its stretch
      sw.phase += sw.beat * Math.PI * 2 * dt;

      // the nose points along the velocity, in the water and in the air alike
      const pitch = Math.atan2(sw.vy, Math.max(0.15, sw.speed));
      const power = swimming ? 0.35 + 0.5 * Math.min(1.6, sw.beat / 1.6) : sw.mode === "air" ? 0.5 : 0.9;
      f.root.rotation.order = "YXZ";
      f.root.position.set(sw.x, sw.y, sw.z);
      // every stroke rocks the whole fish: the head swings against the tail and the body rolls with it
      const rock = Math.sin(sw.phase + 0.9) * power;
      const bendTo = -sw.turn * 0.16;
      const archTo = THREE.MathUtils.clamp(-sw.vy * 0.08, -0.5, 0.5);
      // bends build quickly and let go slowly, which is what reads as soft
      sw.bend += (bendTo - sw.bend) * Math.min(1, dt * (Math.abs(bendTo) > Math.abs(sw.bend) ? 8 : 3));
      sw.arch += (archTo - sw.arch) * Math.min(1, dt * (Math.abs(archTo) > Math.abs(sw.arch) ? 8 : 3));
      f.root.rotation.set(-sw.turn * 0.09 + rock * 0.07 + py * 0.02, Math.PI - sw.dir + rock * 0.06 + px * 0.05, -pitch); // the model faces -x
      f.flex(sw.phase, power, sw.bend, sw.arch);
      const paddle = swimming && sw.beat < 0.8 ? 0.5 : 0.2; // pectorals do the work while it glides
      f.fins.forEach((fin, i) => (fin.rotation.x = (i ? 1 : -1) * (0.75 + Math.sin(t * 3.2 + i * 1.4) * paddle + Math.abs(sw.turn) * 0.15)));
      f.pelvic.rotation.x = Math.sin(sw.phase) * 0.12;
      f.dorsal.rotation.x = Math.sin(sw.phase - 0.5) * 0.1 + sw.bend * 0.8;
      fishPos.set(sw.x, Math.max(0, sw.y) + 0.04, sw.z);

      splash.forEach((sp) => {
        const k = (t - sp.at) / 1.0;
        sp.ring.visible = k >= 0 && k < 1;
        const rs = (0.25 + k * 1.5) * (scale / 0.34) * 0.8;
        sp.ring.scale.set(rs, rs * 0.5, 1);
      });
      drops.forEach((d) => {
        const tau = t - d.at;
        const y = d.up * tau - 0.5 * G * tau * tau;
        d.mesh.visible = tau >= 0 && y > 0;
        d.mesh.position.set(d.x + Math.cos(d.a) * d.v * tau, y, d.z + Math.sin(d.a) * d.v * 0.5 * tau);
      });
    },
  };
}

/* ---------------------- stage nodes on the bank ---------------------- */

/** Node marker: a tall pin with a ring at the top. Returns the point its label hangs from. */
const NODE_TOP = 1.76; // where a card hangs, above the marker's foot

function nodeMarker(parent: THREE.Object3D, x: number, y: number, z: number) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  parent.add(g);
  mesh(g, cyl(0.07, 0.09, 0.06, 8), M(0.3), 0, 0.03, 0);
  mesh(g, cyl(0.016, 0.02, 1.5, 5), M(0.15), 0, 0.78, 0);
  mesh(g, new THREE.TorusGeometry(0.1, 0.028, 6, 16), M(0.1), 0, 1.62, 0, false);
  mesh(g, new THREE.SphereGeometry(0.05, 8, 6), M(1), 0, 1.62, 0, false);
  const flag = new THREE.Shape();
  flag.moveTo(0.02, 1.36);
  flag.lineTo(0.3, 1.26);
  flag.lineTo(0.02, 1.16);
  mesh(g, new THREE.ShapeGeometry(flag), M(0.2));
  return { group: g, base: y, top: new THREE.Vector3(x, y + NODE_TOP, z) };
}

/** Rock plateau standing in the river: faceted cliff sides, a grassy cap. Returns a group at the top surface. */
function plateau(parent: THREE.Object3D, x: number, z: number, r: number, h: number, seed: number) {
  const geo = new THREE.CylinderGeometry(r, r * 0.78, h + 0.5, 10, 3);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const vx = p.getX(i), vy = p.getY(i), vz = p.getZ(i);
    if (Math.hypot(vx, vz) < 0.01) continue; // cap centres stay put
    const k = Math.sin(Math.round(vx * 40) * 12.9898 + Math.round(vy * 40) * 78.233 + Math.round(vz * 40) * 37.719 + seed * 5.3) * 43758.5453;
    const j = 0.9 + (k - Math.floor(k)) * 0.22 - (vy > 0 ? 0 : 0.06);
    p.setXYZ(i, vx * j, vy, vz * j);
  }
  geo.computeVertexNormals();
  mesh(parent, geo, M(0.86), x, (h - 0.5) / 2, z).rotation.y = seed;
  mesh(parent, cyl(r * 1.07, r * 1.02, 0.09, 12), M(0.95), x, h + 0.02, z).rotation.y = seed;
  // ledges and fallen blocks around the foot
  for (let i = 0; i < 5; i++) {
    const a = seed * 2 + i * 1.33;
    rock(parent, x + Math.cos(a) * r * 0.98, -0.03, z + Math.sin(a) * r * 0.9, 0.14 + (i % 3) * 0.07, seed * 10 + i, 0.78);
  }
  for (let i = 0; i < 9; i++) {
    const a = seed + i * 0.7;
    tuft(parent, x + Math.cos(a) * r * (0.75 + (i % 3) * 0.08), h + 0.065, z + Math.sin(a) * r * (0.75 + (i % 3) * 0.08), 0.9);
  }
  const g = new THREE.Group();
  g.position.set(x, h + 0.065, z);
  parent.add(g);
  return g;
}

/** Water spilling off the front of a plateau. Returns the falling strips so they can shimmer. */
function waterfall(parent: THREE.Object3D, x: number, z: number, h: number, w: number) {
  const strips: THREE.Mesh[] = [];
  const n = 6;
  for (let i = 0; i < n; i++) {
    const strip = mesh(parent, box(w / n - 0.012, h, 0.03), M(i % 2 ? 0.99 : 0.62), x - w / 2 + (i + 0.5) * (w / n), h / 2 + 0.02, z, false);
    strips.push(strip);
  }
  mesh(parent, box(w + 0.06, 0.05, 0.12), M(0.99), x, h + 0.04, z - 0.03, false); // lip
  for (let i = 0; i < 2; i++) {
    const ring = mesh(parent, new THREE.RingGeometry(0.9, 1, 20), M(0.15), x, 0.012, z + 0.1, false);
    ring.rotation.x = -Math.PI / 2;
    ring.scale.set(w * (0.5 + i * 0.35), w * (0.28 + i * 0.2), 1);
  }
  return strips;
}

/** Rope bridge sagging between two plateaus, running along x. */
function ropeBridge(parent: THREE.Object3D, x0: number, x1: number, y: number, z: number) {
  const n = Math.max(8, Math.round((x1 - x0) / 0.16));
  const at = (k: number) => [x0 + (x1 - x0) * k, y - 0.28 * 4 * k * (1 - k)] as const;
  for (let i = 0; i < n; i++) {
    const [ax, ay] = at(i / n);
    const [bx, by] = at((i + 1) / n);
    const ang = Math.atan2(by - ay, bx - ax);
    const plank = mesh(parent, box(Math.hypot(bx - ax, by - ay) * 0.86, 0.03, 0.38), M(i % 2 ? 0.86 : 0.96), (ax + bx) / 2, (ay + by) / 2, z);
    plank.rotation.z = ang;
    for (const dz of [-0.2, 0.2]) {
      const rope = mesh(parent, box(Math.hypot(bx - ax, by - ay) + 0.01, 0.018, 0.018), M(0.25), (ax + bx) / 2, (ay + by) / 2 + 0.24, z + dz, false);
      rope.rotation.z = ang;
      if (i % 3 === 0) mesh(parent, box(0.014, 0.24, 0.014), M(0.25), ax, ay + 0.12, z + dz, false);
    }
  }
  for (const ex of [x0, x1]) for (const dz of [-0.2, 0.2]) mesh(parent, cyl(0.03, 0.035, 0.42, 5), M(0.3), ex, y + 0.16, z + dz);
}

const windowGrid = (g: THREE.Object3D, x: number, y: number, z: number, cols: number, rows: number, dx: number, dy: number) => {
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) mesh(g, box(dx * 0.5, dy * 0.55, 0.02), M(0.1), x + (i - (cols - 1) / 2) * dx, y + j * dy, z, false);
};

/** 01 — product company: an office block, a desk with a screen, a phone. */
function sceneOffice(g: THREE.Object3D) {
  mesh(g, box(0.62, 1.25, 0.5), M(0.92), -0.42, 0.625, -0.3);
  windowGrid(g, -0.42, 0.22, -0.04, 3, 5, 0.17, 0.2);
  mesh(g, box(0.66, 0.05, 0.54), M(0.5), -0.42, 1.27, -0.3);
  mesh(g, box(0.4, 0.8, 0.4), M(0.84), 0.12, 0.4, -0.42);
  windowGrid(g, 0.12, 0.2, -0.21, 2, 3, 0.16, 0.2);
  // desk + monitor + chair
  mesh(g, box(0.56, 0.03, 0.28), M(0.95), 0.3, 0.3, 0.3);
  for (const [dx, dz] of [[-0.25, -0.11], [0.25, -0.11], [-0.25, 0.11], [0.25, 0.11]]) mesh(g, box(0.025, 0.3, 0.025), M(0.25), 0.3 + dx, 0.15, 0.3 + dz);
  mesh(g, box(0.34, 0.22, 0.02), M(0.12), 0.3, 0.5, 0.24);
  mesh(g, box(0.3, 0.18, 0.012), M(0.98), 0.3, 0.5, 0.252, false);
  mesh(g, box(0.03, 0.08, 0.03), M(0.2), 0.3, 0.35, 0.24);
  mesh(g, box(0.16, 0.02, 0.16), M(0.7), 0.3, 0.2, 0.55);
  mesh(g, box(0.16, 0.2, 0.02), M(0.7), 0.3, 0.31, 0.63);
  mesh(g, cyl(0.012, 0.012, 0.2, 4), M(0.2), 0.3, 0.1, 0.55);
  // phone, propped up
  const phone = mesh(g, box(0.11, 0.2, 0.016), M(0.12), -0.12, 0.13, 0.45);
  phone.rotation.x = -0.35;
  mesh(g, box(0.085, 0.16, 0.006), M(0.98), -0.12, 0.135, 0.461, false).rotation.x = -0.35;
}

/** 02 — research: a wall of sticky notes and a table set for a conversation. */
function sceneResearch(g: THREE.Object3D) {
  for (const dx of [-0.48, 0.48]) mesh(g, box(0.04, 1.0, 0.04), M(0.3), dx - 0.1, 0.5, -0.3);
  mesh(g, box(1.0, 0.66, 0.03), M(0.97), -0.1, 0.66, -0.3);
  mesh(g, box(1.04, 0.03, 0.05), M(0.3), -0.1, 1.0, -0.3);
  const tones = [0.35, 0.75, 0.55, 0.2, 0.85, 0.45];
  for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) {
    if ((i * 3 + j) % 7 === 5) continue;
    mesh(g, box(0.13, 0.13, 0.012), M(tones[(i * 2 + j) % tones.length]), -0.46 + i * 0.18, 0.46 + j * 0.19, -0.28, false).rotation.z = ((i + j) % 3 - 1) * 0.07;
  }
  // round table, two stools, two cups
  mesh(g, cyl(0.2, 0.2, 0.025, 12), M(0.95), 0.3, 0.3, 0.32);
  mesh(g, cyl(0.02, 0.05, 0.3, 6), M(0.25), 0.3, 0.15, 0.32);
  for (const dx of [-0.34, 0.34]) {
    mesh(g, cyl(0.08, 0.08, 0.03, 8), M(0.7), 0.3 + dx, 0.2, 0.34);
    mesh(g, cyl(0.014, 0.03, 0.2, 5), M(0.25), 0.3 + dx, 0.1, 0.34);
  }
  for (const dx of [-0.08, 0.09]) mesh(g, cyl(0.025, 0.02, 0.04, 6), M(0.2), 0.3 + dx, 0.335, 0.32 + dx * 0.4, false);
  // a clipboard left on the ground
  mesh(g, box(0.14, 0.012, 0.2), M(0.3), -0.3, 0.01, 0.4).rotation.y = 0.4;
  mesh(g, box(0.11, 0.008, 0.16), M(0.98), -0.3, 0.02, 0.4, false).rotation.y = 0.4;
}

/** 03 — university: a portico with columns and a pediment. */
function sceneSchool(g: THREE.Object3D) {
  mesh(g, box(1.3, 0.06, 0.8), M(0.86), 0, 0.03, -0.05);
  mesh(g, box(1.16, 0.06, 0.66), M(0.92), 0, 0.09, -0.05);
  mesh(g, box(0.96, 0.8, 0.36), M(0.9), 0, 0.52, -0.2);
  mesh(g, box(0.16, 0.36, 0.02), M(0.1), 0, 0.3, -0.01);
  for (const dx of [-0.3, 0.3]) mesh(g, box(0.1, 0.18, 0.02), M(0.12), dx, 0.5, -0.01);
  for (let i = 0; i < 5; i++) {
    const cx = -0.44 + i * 0.22;
    mesh(g, cyl(0.035, 0.04, 0.74, 8), M(0.98), cx, 0.49, 0.2);
    mesh(g, box(0.1, 0.03, 0.1), M(0.8), cx, 0.135, 0.2);
    mesh(g, box(0.1, 0.03, 0.1), M(0.8), cx, 0.875, 0.2);
  }
  mesh(g, box(1.08, 0.08, 0.56), M(0.94), 0, 0.93, 0);
  const ped = new THREE.Shape();
  ped.moveTo(-0.56, 0);
  ped.lineTo(0.56, 0);
  ped.lineTo(0, 0.3);
  mesh(g, new THREE.ExtrudeGeometry(ped, { depth: 0.54, bevelEnabled: false }), M(0.9), 0, 0.97, -0.27);
  mesh(g, cyl(0.07, 0.07, 0.02, 10), M(0.2), 0, 1.07, 0.28, false).rotation.x = Math.PI / 2;
  mesh(g, cyl(0.01, 0.01, 0.4, 4), M(0.2), 0, 1.45, 0);
  mesh(g, box(0.18, 0.1, 0.01), M(0.3), 0.1, 1.58, 0, false);
}

/** 04 — building with AI: a workbench, a laptop, a small robot, a server. */
function sceneWorkshop(g: THREE.Object3D) {
  mesh(g, box(0.8, 0.04, 0.34), M(0.95), 0.1, 0.34, -0.05);
  for (const [dx, dz] of [[-0.36, -0.14], [0.36, -0.14], [-0.36, 0.14], [0.36, 0.14]]) mesh(g, box(0.03, 0.34, 0.03), M(0.25), 0.1 + dx, 0.17, -0.05 + dz);
  // laptop
  mesh(g, box(0.26, 0.014, 0.18), M(0.3), 0.26, 0.37, -0.02);
  const lid = mesh(g, box(0.26, 0.18, 0.012), M(0.15), 0.26, 0.45, -0.115);
  lid.rotation.x = -0.25;
  mesh(g, box(0.22, 0.14, 0.006), M(0.98), 0.26, 0.452, -0.106, false).rotation.x = -0.25;
  // robot, standing on the bench
  mesh(g, box(0.16, 0.18, 0.12), M(0.96), -0.14, 0.47, -0.05);
  mesh(g, box(0.19, 0.13, 0.14), M(0.96), -0.14, 0.64, -0.05);
  for (const dx of [-0.045, 0.045]) mesh(g, new THREE.SphereGeometry(0.02, 6, 5), M(0.05), -0.14 + dx, 0.65, 0.022, false);
  mesh(g, box(0.07, 0.012, 0.01), M(0.2), -0.14, 0.6, 0.022, false);
  mesh(g, cyl(0.006, 0.006, 0.1, 4), M(0.2), -0.14, 0.75, -0.05, false);
  mesh(g, new THREE.SphereGeometry(0.02, 6, 5), M(0.15), -0.14, 0.81, -0.05, false);
  for (const side of [-1, 1]) {
    const arm = mesh(g, box(0.03, 0.15, 0.03), M(0.7), -0.14 + side * 0.11, 0.46, -0.05);
    arm.rotation.z = side * 0.35;
  }
  // server rack and a gear
  mesh(g, box(0.3, 0.9, 0.3), M(0.35), -0.55, 0.45, -0.25);
  for (let j = 0; j < 6; j++) {
    mesh(g, box(0.24, 0.035, 0.01), M(0.9), -0.55, 0.15 + j * 0.13, -0.095, false);
    mesh(g, box(0.03, 0.02, 0.012), M(0.1), -0.47, 0.15 + j * 0.13, -0.09, false);
  }
  const gear = new THREE.Group();
  gear.position.set(0.56, 0.2, 0.36);
  g.add(gear);
  mesh(gear, cyl(0.14, 0.14, 0.05, 12), M(0.8)).rotation.x = Math.PI / 2;
  mesh(gear, cyl(0.05, 0.05, 0.06, 8), M(0.15)).rotation.x = Math.PI / 2;
  for (let i = 0; i < 8; i++) {
    const tooth = mesh(gear, box(0.05, 0.07, 0.05), M(0.8), Math.cos((i * Math.PI) / 4) * 0.16, Math.sin((i * Math.PI) / 4) * 0.16, 0);
    tooth.rotation.z = (i * Math.PI) / 4 + Math.PI / 2;
  }
  return gear;
}

/** 05 — own studio: a cabin with a big window, an easel, a lamp, a plant. */
function sceneStudio(g: THREE.Object3D) {
  mesh(g, box(0.8, 0.5, 0.56), M(0.95), -0.15, 0.25, -0.2);
  const roof = mesh(g, cone(0.7071, 0.34, 4), M(0.3), -0.15, 0.67, -0.2);
  roof.rotation.y = Math.PI / 4;
  roof.scale.set(0.94, 1, 0.7);
  mesh(g, box(0.4, 0.26, 0.02), M(0.12), -0.02, 0.3, 0.085);
  mesh(g, box(0.02, 0.26, 0.025), M(0.9), -0.02, 0.3, 0.09, false);
  mesh(g, box(0.4, 0.02, 0.025), M(0.9), -0.02, 0.3, 0.09, false);
  mesh(g, box(0.13, 0.3, 0.02), M(0.1), -0.42, 0.15, 0.085);
  mesh(g, box(0.07, 0.24, 0.07), M(0.7), 0.1, 0.78, -0.3);
  // easel with a canvas
  for (const [dx, lean] of [[-0.09, 0.18], [0.09, -0.18]]) mesh(g, box(0.02, 0.6, 0.02), M(0.3), 0.46 + dx, 0.3, 0.36).rotation.z = lean;
  mesh(g, box(0.02, 0.56, 0.02), M(0.3), 0.46, 0.28, 0.22).rotation.x = -0.4;
  mesh(g, box(0.3, 0.24, 0.02), M(0.98), 0.46, 0.44, 0.37);
  mesh(g, box(0.16, 0.012, 0.022), M(0.2), 0.46, 0.4, 0.382, false).rotation.z = 0.5;
  mesh(g, new THREE.SphereGeometry(0.035, 6, 5), M(0.3), 0.52, 0.5, 0.384, false);
  // lamp post and a potted plant by the door
  mesh(g, cyl(0.012, 0.016, 0.62, 5), M(0.2), -0.72, 0.31, 0.3);
  mesh(g, new THREE.IcosahedronGeometry(0.055, 1), M(1), -0.72, 0.66, 0.3, false);
  mesh(g, cone(0.07, 0.05, 6), M(0.2), -0.72, 0.72, 0.3);
  mesh(g, cyl(0.06, 0.045, 0.08, 8), M(0.5), -0.6, 0.04, 0.22);
  mesh(g, new THREE.IcosahedronGeometry(0.09, 0), M(0.7), -0.6, 0.16, 0.22);
}

/** Buoy marking the channel out to sea. */
function buoy(parent: THREE.Object3D, x: number, z: number, s: number) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  parent.add(g);
  mesh(g, cyl(0.16 * s, 0.2 * s, 0.14 * s, 8), M(0.3), 0, 0.05 * s, 0);
  mesh(g, cone(0.15 * s, 0.4 * s, 8), M(0.96), 0, 0.32 * s, 0);
  mesh(g, cyl(0.012 * s, 0.012 * s, 0.3 * s, 4), M(0.2), 0, 0.65 * s, 0, false);
  mesh(g, new THREE.IcosahedronGeometry(0.05 * s, 0), M(0.15), 0, 0.82 * s, 0, false);
  return g;
}

/** Stone footbridge with one arch, running along x and centred on (x, z). */
function footbridge(parent: THREE.Object3D, x: number, y: number, z: number, span: number) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  parent.add(g);
  const n = 9;
  for (let i = 0; i < n; i++) {
    const k = i / (n - 1);
    const a = Math.PI * k;
    const bx = (k - 0.5) * span;
    const rise = Math.sin(a) * 0.32;
    const slab = mesh(g, box(span / n + 0.03, 0.09, 0.5), M(i % 2 ? 0.86 : 0.94), bx, rise, 0);
    slab.rotation.z = Math.cos(a) * 0.45;
    if (i % 2 === 0) for (const dz of [-0.23, 0.23]) mesh(g, box(0.04, 0.2, 0.04), M(0.3), bx, rise + 0.13, dz);
  }
  for (const dz of [-0.23, 0.23]) {
    for (let i = 0; i < n - 1; i++) {
      const k0 = i / (n - 1), k1 = (i + 1) / (n - 1);
      const x0 = (k0 - 0.5) * span, x1 = (k1 - 0.5) * span;
      const y0 = Math.sin(Math.PI * k0) * 0.32 + 0.22, y1 = Math.sin(Math.PI * k1) * 0.32 + 0.22;
      const rail = mesh(g, box(Math.hypot(x1 - x0, y1 - y0) + 0.01, 0.025, 0.025), M(0.3), (x0 + x1) / 2, (y0 + y1) / 2, dz, false);
      rail.rotation.z = Math.atan2(y1 - y0, x1 - x0);
    }
  }
  for (const side of [-1, 1]) mesh(g, box(0.3, 0.5, 0.56), M(0.8), (side * span) / 2, -0.2, 0);
  return g;
}

/**
 * The stretch between the source and the sea: a long bank with a village, a
 * footbridge over an inlet, a second windmill and a jetty, thinning out into
 * rocks and channel buoys as the river widens.
 */
function midland(scene: THREE.Object3D) {
  const r = rng(23);
  const sm = THREE.MathUtils.smoothstep;
  const X0 = 9;
  const X1 = 48;
  const shore = (x: number) => 4.1 + 0.45 * Math.sin(x * 0.5) + 0.2 * Math.sin(x * 1.3) - 1.9 * Math.exp(-(((x - 28) / 1.2) ** 2));
  const ground: Ground = (x, z) => {
    const along = sm(x, X0 + 1, X0 + 5) * (1 - sm(x, X1 - 9, X1 - 2));
    const land = 1 - sm(z, shore(x) - 1.5, shore(x)); // rises from the waterline
    const back = sm(z, -8, -4.5);
    const hills =
      0.42 +
      0.22 * Math.sin(x * 0.45 + 1) * Math.cos(z * 0.5) +
      1.35 * gauss(x - 18.5, 3.2, z + 1.2, 2.4) +
      1.0 * gauss(x - 36, 3.6, z + 0.6, 2.5) +
      0.5 * gauss(x - 26, 2.5, z + 2.5, 2);
    return -0.25 + along * land * back * hills + 0.03 * Math.sin(x * 3.1) * Math.cos(z * 2.7);
  };
  const geo = new THREE.PlaneGeometry(X1 - X0, 16, 190, 64);
  geo.rotateX(-Math.PI / 2);
  const mx = (X0 + X1) / 2;
  const gp = geo.attributes.position;
  for (let i = 0; i < gp.count; i++) gp.setY(i, ground(gp.getX(i) + mx, gp.getZ(i) - 0.5));
  geo.translate(mx, 0, -0.5);
  geo.computeVertexNormals();
  mesh(scene, geo, M(0.93));
  const on = (x: number, z: number) => [x, ground(x, z), z] as const;

  // village on the first rise
  house(scene, ...on(17.6, -0.9), 0.2);
  house(scene, ...on(19.0, -1.5), -0.3).scale.setScalar(1.15);
  house(scene, ...on(19.9, -0.3), -0.1).scale.setScalar(0.9);
  house(scene, ...on(16.4, 0.4), 0.5).scale.setScalar(0.85);
  well(scene, ...on(18.4, 0.3));
  bench(scene, ...on(20.6, 0.9), -0.3);
  signpost(scene, ...on(14.2, 2.6)).rotation.y = -0.3;
  for (let i = 0; i < 7; i++) {
    const fx = 15.6 + i * 0.22;
    mesh(scene, box(0.03, 0.16, 0.03), M(0.3), fx, ground(fx, 1.5) + 0.07, 1.5);
    if (i < 6) mesh(scene, box(0.22, 0.02, 0.02), M(0.3), fx + 0.11, ground(fx + 0.11, 1.5) + 0.11, 1.5);
  }
  // a path of stepping stones along the bank, over the bridge, on to the mill
  for (let i = 0; i < 64; i++) {
    const x = 13 + i * 0.4;
    if (Math.abs(x - 28) < 1.5) continue;
    const z = shore(x) - 1.9 + Math.sin(i * 0.9) * 0.12;
    const y = ground(x, z);
    if (y < 0.03 || x > X1 - 8) continue;
    const st = mesh(scene, cyl(0.09, 0.11, 0.035, 6), M(0.62), x, y + 0.015, z);
    st.rotation.y = i;
    st.scale.x = 1.3;
  }
  footbridge(scene, 28, 0.12, shore(28) + 0.25, 2.7);
  const blades = windmill(scene, ...on(35.6, -0.5));
  pier(scene, 40.4, shore(40.4) - 0.25, 1.4);
  const skiff = rowboat(scene, 40.85, shore(40.4) + 0.8, 1.3);
  const sail = boat(scene, 23.5, 7.2, 0.85);
  sail.rotation.y = 0.5;
  const ducks = [duck(scene, 31.5, 4.9, 1), duck(scene, 31.25, 5.05, 0.7), duck(scene, 31.0, 4.95, 0.7)];

  // The five stage nodes: rock plateaus standing in the river, each carrying a
  // small scene and a marker, strung together by rope bridges.
  const stageAt = [14, 20, 26, 32, 38];
  const STAGE_Z = 3.95;
  const STAGE_R = 1.12;
  const heights = [1.15, 0.9, 1.3, 1.0, 1.2];
  // the path she runs: along the front of each plateau and over the bridges between
  const LANE_Z = STAGE_Z + 0.72;
  const LANE_HALF = 0.94; // how far the path runs either side of a plateau's centre
  const laneY = (x: number) => {
    const last = stageAt.length - 1;
    for (let i = 0; i <= last; i++) {
      const top = heights[i] + 0.09;
      if (x <= stageAt[i] + LANE_HALF || i === last) return top;
      if (x < stageAt[i + 1] - LANE_HALF) {
        const k = (x - stageAt[i] - LANE_HALF) / (stageAt[i + 1] - stageAt[i] - LANE_HALF * 2);
        return THREE.MathUtils.lerp(top, heights[i + 1] + 0.09, k) - 0.28 * 4 * k * (1 - k) + 0.02;
      }
    }
    return heights[0] + 0.09;
  };
  const builders: ((g: THREE.Object3D) => THREE.Object3D | void)[] = [sceneOffice, sceneResearch, sceneSchool, sceneWorkshop, sceneStudio];
  const nodes: THREE.Vector3[] = [];
  // each marker stands on a spring: it stretches up when she reaches its stage and settles with a wobble
  const markers: { group: THREE.Group; base: number; top: THREE.Vector3; s: number; v: number }[] = [];
  let activeNode = -1;
  const falls: THREE.Mesh[] = [];
  let gear: THREE.Object3D | null = null;
  stageAt.forEach((x, i) => {
    const top = plateau(scene, x, STAGE_Z, STAGE_R, heights[i], i + 1);
    top.scale.setScalar(1.2);
    top.position.z -= 0.32; // the little scene stands back, leaving the front of the plateau as a path
    const made = builders[i](top) as THREE.Object3D | undefined;
    if (made) gear = made;
    const marker = nodeMarker(scene, x + 0.98, top.position.y, STAGE_Z - 0.4);
    markers.push({ ...marker, s: 1, v: 0 });
    nodes.push(marker.top);
    if (i < stageAt.length - 1) {
      const y0 = heights[i] + 0.09;
      const y1 = heights[i + 1] + 0.09;
      // bridges step up or down to the next plateau, along the front where she runs
      const bridge = new THREE.Group();
      bridge.position.set(x + LANE_HALF, y0, LANE_Z);
      const span = stageAt[i + 1] - x - LANE_HALF * 2;
      bridge.rotation.z = Math.atan2(y1 - y0, span);
      scene.add(bridge);
      ropeBridge(bridge, 0, Math.hypot(span, y1 - y0), 0, 0);
    }
    if (i % 3 === 0) falls.push(...waterfall(scene, x - 0.35, STAGE_Z + STAGE_R * 0.93, heights[i], 0.42));
  });

  // woods, scrub and flowers scattered over the bank
  for (let i = 0; i < 120; i++) {
    const x = X0 + 2 + r() * (X1 - X0 - 8);
    const z = -4 + r() * 6.5;
    const y = ground(x, z);
    if (y < 0.18 || (Math.abs(x - 18.5) < 2.6 && z > -2.2 && z < 1.2)) continue;
    const pick = r();
    if (pick < 0.3) pine(scene, x, y, z, 0.55 + r() * 0.5);
    else if (pick < 0.55) tree(scene, x, y, z, 0.2 + r() * 0.16, i);
    else if (pick < 0.68) birch(scene, x, y, z, 0.6 + r() * 0.3, i);
    else bush(scene, x, y, z, 0.11 + r() * 0.09, i);
  }
  for (let i = 0; i < 60; i++) {
    const x = X0 + 2 + r() * (X1 - X0 - 3);
    const z = shore(x) - 0.25 - r() * 0.7;
    const y = ground(x, z);
    if (y < -0.04) continue;
    const pick = r();
    if (pick < 0.4) rock(scene, x, y, z, 0.1 + r() * 0.28, 60 + i, 0.8 + r() * 0.1);
    else plant(scene, x, y, z, 0.35 + r() * 0.4, (["reed", "tulip", "bud", "daisy"] as const)[Math.floor(r() * 4)], i);
  }
  for (let i = 0; i < 320; i++) {
    const x = X0 + 2 + r() * (X1 - X0 - 3);
    const z = -4.5 + r() * 9;
    const y = ground(x, z);
    if (y < 0.03) continue;
    if (r() < 0.7) tuft(scene, x, y, z, 0.8 + r() * 0.8);
    else flower(scene, x, y, z, 0.8 + r() * 0.7);
  }
  for (const [lx, lz, lr, lb] of [[13.2, 5.0, 0.1, 1], [13.5, 5.25, 0.07, 0], [27.4, 3.4, 0.09, 1], [28.5, 3.1, 0.08, 0], [33.8, 5.2, 0.1, 0], [34.1, 5.0, 0.08, 1], [43.6, 4.8, 0.1, 1]] as const) {
    lilyPad(scene, lx, lz, lr, !!lb);
  }
  // the river mouth: last rocks, then buoys leading out
  for (const [x, z, s] of [[45.5, 3.2, 0.5], [47.2, 1.5, 0.36], [48.6, 3.9, 0.28]] as const) rock(scene, x, -0.02, z, s, x);
  const buoys = [buoy(scene, 47.5, 4.6, 1), buoy(scene, 51.5, 2.2, 1), buoy(scene, 54.5, -2.5, 1.2), buoy(scene, 56.5, -9, 1.5)];

  // distance
  for (const [x, z, sx, sy] of [[30, -30, 18, 3.2], [46, -38, 14, 2.4], [14, -42, 16, 3.8]] as const) {
    const m = mesh(scene, new THREE.SphereGeometry(1, 28, 10), M(0.9), x, -0.4, z, false);
    m.scale.set(sx, sy, 3);
  }
  cloud(scene, 26, 12.5, -56, 1.6);
  cloud(scene, 41, 10, -56, 1.2);
  cloud(scene, 52, 13, -60, 1.4, 0.1);
  const birds = [bird(scene, 21, 5.6, -8, 0.22), bird(scene, 22, 6.0, -9, 0.18), bird(scene, 38, 5.2, -8, 0.2)];

  // A boardwalk carries the path on past the last plateau, downstream. Where the
  // About section is about to come up, it turns into a jetty that runs out over the
  // river toward the viewer, so she arrives running at the screen, already facing it.
  const WALK_FROM = stageAt[stageAt.length - 1] + LANE_HALF;
  const TURN_X = 45.7; // where the jetty leaves the boardwalk: under the portrait frame when the About section arrives
  const JETTY_LEN = 4.4; // it runs this far straight out toward the viewer
  // Camera positions that pace her: up to SPRINT_AT she keeps step with the camera; from
  // there she pulls ahead to reach the jetty as the About section starts to show, and
  // comes down it while that section rises to meet her.
  const SPRINT_AT = 42.6;
  const JETTY_AT = 44.3;
  const ARRIVE_AT = 45.35;
  const WALK_TO = TURN_X + 0.23;
  const walkY = heights[heights.length - 1] + 0.09;
  for (let x = WALK_FROM, i = 0; x < WALK_TO; x += 0.17, i++) {
    mesh(scene, box(0.15, 0.03, 0.42), M(i % 2 ? 0.86 : 0.96), x + 0.08, walkY - 0.015, LANE_Z);
  }
  for (const dz of [-0.19, 0.19]) mesh(scene, box(WALK_TO - WALK_FROM, 0.05, 0.04), M(0.3), (WALK_FROM + WALK_TO) / 2, walkY - 0.055, LANE_Z + dz);
  for (let x = WALK_FROM + 0.6; x < WALK_TO; x += 1.5) {
    for (const dz of [-0.19, 0.19]) mesh(scene, cyl(0.03, 0.035, walkY + 0.4, 5), M(0.3), x, (walkY - 0.4) / 2, LANE_Z + dz);
    mesh(scene, box(0.03, 0.03, 0.42), M(0.3), x, walkY - 0.25, LANE_Z);
  }
  // the jetty: the same planks, laid along its own line
  const jetty = new THREE.Group();
  jetty.position.set(TURN_X, 0, LANE_Z);
  jetty.rotation.y = -Math.PI / 2; // its +x points straight at the viewer
  scene.add(jetty);
  for (let d = -0.1, i = 0; d < JETTY_LEN; d += 0.17, i++) {
    mesh(jetty, box(0.15, 0.03, 0.46), M(i % 2 ? 0.86 : 0.96), d + 0.08, walkY - 0.015, 0);
  }
  for (const dz of [-0.21, 0.21]) mesh(jetty, box(JETTY_LEN, 0.05, 0.04), M(0.3), JETTY_LEN / 2, walkY - 0.055, dz);
  for (let d = 0.5; d < JETTY_LEN; d += 1.3) {
    for (const dz of [-0.21, 0.21]) mesh(jetty, cyl(0.03, 0.035, walkY + 0.4, 5), M(0.3), d, (walkY - 0.4) / 2, dz);
    mesh(jetty, box(0.03, 0.03, 0.46), M(0.3), d, walkY - 0.25, 0);
  }
  // how far along the path (lane, then jetty) she should be for a given camera position
  const pathAt = (cam: number) => {
    if (cam <= SPRINT_AT) return cam + 0.35;
    if (cam <= JETTY_AT) return THREE.MathUtils.lerp(SPRINT_AT + 0.35, TURN_X, (cam - SPRINT_AT) / (JETTY_AT - SPRINT_AT));
    return TURN_X + JETTY_LEN * Math.min(1, (cam - JETTY_AT) / (ARRIVE_AT - JETTY_AT));
  };

  // Mei herself: once the fish has gone back into the river, she carries the story.
  // She keeps pace with the camera, so scrolling the page is what makes her run.
  const runner = person(scene);
  const RUNNER_SCALE = 0.62;
  runner.root.scale.setScalar(RUNNER_SCALE);
  const runnerPos = new THREE.Vector3();
  const run = { x: stageAt[0] - LANE_HALF + 0.15, phase: 0, effort: 0, facing: 1, lastT: 0 };

  return {
    nodes,
    setActiveNode(i: number) {
      activeNode = i;
    },
    runnerPos,
    runnerHeight: 1.66 * RUNNER_SCALE,
    hideRunner(hidden: boolean) {
      runner.root.visible = !hidden;
    },
    update(t: number, camX = 0) {
      const dt = Math.min(0.05, Math.max(0.001, t - run.lastT));
      run.lastT = t;
      // an underdamped spring per marker: it overshoots its new height and rings down
      markers.forEach((m, i) => {
        const want = i === activeNode ? 1.22 : 1;
        m.v += ((want - m.s) * 150 - m.v * 9) * dt;
        m.s += m.v * dt;
        m.group.scale.set(1 + (m.s - 1) * 0.35, m.s, 1 + (m.s - 1) * 0.35);
        m.top.y = m.base + NODE_TOP * m.s; // the card rides the top of the marker, so it springs too
      });
      const from = stageAt[0] - LANE_HALF + 0.15;
      const want = Math.max(from, pathAt(camX));
      // she covers the distance with a short lag, so starts and stops have some weight
      const before = run.x; // distance along the path
      run.x += (want - run.x) * Math.min(1, dt * 7);
      const moved = run.x - before;
      const ground = Math.abs(moved);
      run.phase += ground * 7.2; // one full stride per ~0.87 units of ground
      run.effort += (Math.min(1, ground / dt / 2.2) - run.effort) * Math.min(1, dt * 9);
      if (Math.abs(moved) > 0.0015) run.facing = moved > 0 ? 1 : -1;
      const laneX = Math.min(run.x, TURN_X);
      runner.root.position.set(laneX, laneY(laneX), LANE_Z + Math.max(0, run.x - TURN_X));
      runnerPos.copy(runner.root.position);
      // the way the path points under her feet: side-on along the lane, straight at the viewer on the jetty
      const onJetty = THREE.MathUtils.smoothstep(run.x, TURN_X - 0.3, TURN_X + 0.4);
      const turn = run.facing > 0 ? (Math.PI / 2) * (1 - onJetty) : -(Math.PI / 2) * (1 + onJetty);
      // standing still she turns to face the visitor
      const idleTurn = THREE.MathUtils.lerp(0.35 * run.facing, turn, Math.min(1, run.effort * 3));
      runner.root.rotation.y += Math.atan2(Math.sin(idleTurn - runner.root.rotation.y), Math.cos(idleTurn - runner.root.rotation.y)) * Math.min(1, dt * 8);
      runner.pose(run.phase, run.effort, 0, 0, t);
      if (gear) (gear as THREE.Object3D).rotation.z = t * 0.5;
      // falling water: the strips trade places a few times a second
      const flip = Math.floor(t * 5) % 2;
      falls.forEach((strip, i) => (strip.scale.x = (i + flip) % 2 ? 1 : 0.55));
      blades.rotation.z = -t * 0.6;
      skiff.position.y = 0.02 + Math.sin(t * 1.2 + 1) * 0.012;
      sail.position.y = Math.sin(t * 1.0 + 2) * 0.02;
      sail.rotation.z = Math.sin(t * 0.8) * 0.04;
      buoys.forEach((b, i) => {
        b.position.y = Math.sin(t * 1.4 + i * 1.7) * 0.03;
        b.rotation.z = Math.sin(t * 1.1 + i) * 0.08;
      });
      ducks.forEach((d, i) => {
        d.position.x = 31.5 - i * 0.24 + Math.sin(t * 0.1) * 0.8;
        d.rotation.y = Math.cos(t * 0.1) > 0 ? Math.PI : 0;
      });
      birds.forEach((b, i) => b.children.forEach((wing, k) => (wing.rotation.z = (k ? 1 : -1) * (0.45 + Math.sin(t * 5 + i) * 0.3))));
    },
  };
}

/**
 * The fish on its own, for the overlay that flies above the page while the river
 * is covered. Same model and same rendering, posed from outside.
 */
/**
 * The four featured projects as small cards, for the overlay that carries them from
 * the hero's river into Selected Work. Each is a slab one unit square, drawn like the
 * real card: a frame, a title bar with its number, a title, two lines of text and a
 * cover with a mark of its own. The page says where each one is on screen and how big;
 * a slab is scaled to that size, so by the time it lands it is the shape of its card.
 */
/**
 * One project card as a small slab, a unit square: a frame, a title bar with its
 * number square, a title, two lines of text and a cover with a mark that tells the
 * four apart. Used afloat in the river and in the overlay that flies it to the grid.
 */
function workSlab(parent: THREE.Object3D, i: number) {
  const PAPER = M(0.9); // a light card: shaded and dithered like everything else in the river
  const DARK = M(0.14);
  const g = new THREE.Group();
  parent.add(g);
  const Z = 0.034; // just proud of the face
  const flat = (w: number, h: number, tone: number, x: number, y: number) => mesh(g, box(w, h, 0.012), M(tone), x, y, Z, false);
  mesh(g, box(1, 1, 0.06), PAPER);
  // frame
  for (const y of [-0.494, 0.494]) mesh(g, box(1, 0.012, 0.07), DARK, 0, y, 0, false);
  for (const x of [-0.492, 0.492]) mesh(g, box(0.016, 1, 0.07), DARK, x, 0, 0, false);
  // title bar: the number in a dark square, three small squares at the far end
  flat(1, 0.008, 0.14, 0, 0.425);
  flat(0.085, 0.07, 0.14, -0.4575, 0.462);
  for (let n = 0; n < 3; n++) flat(0.022, 0.02, 0.14, 0.4 + n * 0.032, 0.462);
  flat(0.3, 0.012, 0.6, -0.22, 0.462);
  // title and two lines of text
  flat(0.46 - i * 0.05, 0.034, 0.14, -0.21 - i * 0.025, 0.355);
  flat(0.84, 0.012, 0.62, 0, 0.295);
  flat(0.6, 0.012, 0.62, -0.12, 0.262);
  // dotted rule, then the number line and two tags
  for (let n = 0; n < 21; n++) flat(0.014, 0.008, 0.3, -0.42 + n * 0.042, 0.215);
  flat(0.3, 0.03, 0.14, -0.27, 0.165);
  for (const [x, w] of [[-0.36, 0.14], [-0.2, 0.12]] as const) flat(w, 0.026, 0.8, x, 0.105);
  // the cover: a grey panel with a mark that tells the four apart
  flat(0.9, 0.5, 0.86, 0, -0.2);
  for (const y of [0.052, -0.452]) flat(0.9, 0.008, 0.14, 0, y);
  for (const x of [-0.45, 0.45]) flat(0.01, 0.5, 0.14, x, -0.2);
  const mark = (w: number, h: number, tone: number, x: number, y: number) => mesh(g, box(w, h, 0.012), M(tone), x, y, Z + 0.012, false);
  if (i === 0) {
    // a plan: rows, with one picked out
    for (let n = 0; n < 5; n++) mark(0.56, 0.03, n === 2 ? 0.14 : 0.98, -0.1, -0.03 - n * 0.075);
    mark(0.16, 0.26, 0.98, 0.3, -0.2);
  } else if (i === 1) {
    // a dashboard: a big figure and a row of bars
    mark(0.2, 0.18, 0.14, -0.28, -0.1);
    for (let n = 0; n < 6; n++) mark(0.05, 0.06 + ((n * 37) % 5) * 0.035, 0.3, -0.1 + n * 0.085, -0.36 + (0.06 + ((n * 37) % 5) * 0.035) / 2);
  } else if (i === 2) {
    // a list of jobs: a column of cards with a tick each
    for (let n = 0; n < 3; n++) {
      mark(0.6, 0.1, 0.98, -0.08, -0.05 - n * 0.14);
      mark(0.05, 0.04, 0.14, 0.14, -0.05 - n * 0.14);
    }
  } else {
    // people ranked: three columns of different heights
    for (let n = 0; n < 3; n++) {
      const h = [0.2, 0.32, 0.14][n];
      mark(0.16, h, n === 1 ? 0.14 : 0.98, -0.22 + n * 0.22, -0.42 + h / 2);
      mark(0.07, 0.05, 0.3, -0.22 + n * 0.22, -0.42 + h + 0.045);
    }
  }
  return g;
}

function buildWorks(scene: THREE.Scene): Built {
  const slabs = [0, 1, 2, 3].map((i) => workSlab(scene, i));
  return {
    camPos: new THREE.Vector3(0, 0, 20),
    target: new THREE.Vector3(0, 0, 0),
    fov: 18,
    mute: 1e6,
    shadowTarget: new THREE.Vector3(0, 0, 0),
    lightFrom: new THREE.Vector3(-5, 7, 12),
    narrow: false,
    plain: true,
    paper: [0.984, 0.984, 0.98], // the cards are solid: the island does not show through them
    workIn: null,
    update() {},
    placeWorks(at) {
      const cards = this.workIn;
      slabs.forEach((slab, i) => {
        const card = cards?.[i];
        slab.visible = !!card?.visible;
        if (!card || !card.visible) return;
        const { p, px } = at(card.x, card.y, 0);
        slab.position.copy(p);
        slab.scale.set(card.w / px, card.h / px, Math.min(card.w, card.h) / px);
        slab.rotation.set(0, 0, card.turn);
      });
    },
  };
}

function buildFishOverlay(scene: THREE.Scene): Built {
  const f = fish(scene);
  let phase = 0;
  let lastT = 0;
  let heading = 0;
  let pitchNow = 0;
  let bendNow = 0;
  let archNow = 0;
  const middle = new THREE.Vector3();
  return {
    camPos: new THREE.Vector3(0, 0.2, 8.8),
    target: new THREE.Vector3(0, 0, 0),
    fov: 30,
    mute: 1e6,
    shadowTarget: new THREE.Vector3(0, 0, 0),
    narrow: false,
    plain: true,
    poseIn: { dir: Math.PI, pitch: 0, beat: 1.6, bend: 0, arch: 0 },
    update(t) {
      const dt = Math.min(0.05, Math.max(0, t - lastT));
      lastT = t;
      const pose = this.poseIn!;
      phase += pose.beat * Math.PI * 2 * dt;
      // turn about its own middle, not about its nose
      const want = Math.PI - pose.dir;
      const swing = Math.atan2(Math.sin(want - heading), Math.cos(want - heading));
      heading += swing * Math.min(1, dt * 5);
      // eased pose: nothing snaps, and the body curls through every change of direction
      pitchNow += (pose.pitch - pitchNow) * Math.min(1, dt * 7);
      // bends build quickly and let go slowly, which is what reads as soft
      const bendTo = pose.bend + swing * 0.3;
      const archTo = pose.arch;
      bendNow += (bendTo - bendNow) * Math.min(1, dt * (Math.abs(bendTo) > Math.abs(bendNow) ? 8 : 3));
      archNow += (archTo - archNow) * Math.min(1, dt * (Math.abs(archTo) > Math.abs(archNow) ? 8 : 3));
      const power = 0.5 + 0.3 * Math.min(2.2, pose.beat / 1.6);
      const rock = Math.sin(phase + 0.9) * power;
      f.root.rotation.order = "YXZ";
      f.root.rotation.set(0.12 + rock * 0.08, heading + rock * 0.07, -pitchNow);
      // it turns and pitches about its own middle, so it stays centred however steeply it climbs or dives
      middle.set(0.75, 0, 0).applyEuler(f.root.rotation);
      f.root.position.set(-middle.x, -middle.y + Math.sin(t * 1.7) * 0.03, -middle.z);
      f.flex(phase, power, bendNow, archNow);
      f.dorsal.rotation.x = Math.sin(phase - 0.5) * 0.1 + bendNow * 0.8;
      f.fins.forEach((fin, i) => (fin.rotation.x = (i ? 1 : -1) * (0.8 + Math.sin(t * 3.2 + i * 1.4) * 0.35)));
      f.pelvic.rotation.x = Math.sin(phase) * 0.12;
    },
  };
}

/**
 * Mei on her own, for the overlay that carries her from the river scene into the
 * About section. At approach 0 she is framed whole, mid-stride, running straight at
 * the camera: exactly how the runner on the jetty looks. As approach
 * goes to 1 the camera closes in, she slows to a stop, and the frame
 * ends on her head and shoulders. Same model as the runner.
 */
const PORTRAIT_FROM = 0; // she arrives down the jetty already square to the camera

function buildPortrait(scene: THREE.Scene): Built {
  const mei = person(scene);
  let lastT = 0;
  let lastA = 0;
  let phase = 0;
  let effort = 1;
  let lookX = 0;
  let lookY = 0;
  const FAR_POS = new THREE.Vector3(0, 0.81, 6.2);
  const FAR_AT = new THREE.Vector3(0, 0.81, 0);
  const NEAR_POS = new THREE.Vector3(0, 1.5, 2.1);
  const NEAR_AT = new THREE.Vector3(0, 1.4, 0);
  const sm = THREE.MathUtils.smoothstep;
  return {
    camPos: FAR_POS.clone(),
    target: FAR_AT.clone(),
    fov: 30,
    mute: 1e6,
    shadowTarget: new THREE.Vector3(0, 0, 0),
    lightFrom: new THREE.Vector3(-3.2, 4.2, 8), // a portrait light: from the front, a little to one side
    narrow: false,
    plain: true,
    portraitIn: { approach: 0, lookX: 0, lookY: 0 },
    update(t) {
      const dt = Math.min(0.05, Math.max(0.001, t - lastT));
      lastT = t;
      const input = this.portraitIn!;
      const a = THREE.MathUtils.clamp(input.approach, 0, 1);
      const moved = Math.abs(a - lastA);
      lastA = a;
      // she runs while the page is moving her, and winds down as she arrives
      const arriving = sm(a, 0.55, 0.95);
      phase += moved * 26;
      effort += (Math.min(1, (moved / dt) * 1.4) * (1 - arriving) - effort) * Math.min(1, dt * 9);
      const close = a * a * (3 - 2 * a);
      this.camPos.lerpVectors(FAR_POS, NEAR_POS, close);
      this.target.lerpVectors(FAR_AT, NEAR_AT, close);
      lookX += (input.lookX * arriving - lookX) * Math.min(1, dt * 5);
      lookY += (input.lookY * arriving - lookY) * Math.min(1, dt * 5);
      mei.root.rotation.y = PORTRAIT_FROM * (1 - sm(a, 0, 0.6)); // the jetty's heading at first, square-on at the end
      mei.pose(phase, effort, lookX, lookY, t);
    },
  };
}

/** Cathedral front with its neighbours; built around the origin, facing +z. */
function city(parent: THREE.Object3D) {
  const g = new THREE.Group();
  parent.add(g);
  const shore = mesh(g, new THREE.SphereGeometry(1, 24, 8), M(0.8), 0, -0.1, -1);
  shore.scale.set(17, 0.55, 4);

  // nave + hipped roof
  mesh(g, box(7, 3.2, 5), M(0.9), 0, 1.6, -1);
  const roof = mesh(g, cone(0.7071, 2, 4), M(0.45), 0, 4.2, -1);
  roof.rotation.y = Math.PI / 4;
  roof.scale.set(7.2, 1, 5.2);
  // gabled front
  const gable = new THREE.Shape();
  gable.moveTo(-3.8, 0);
  gable.lineTo(-3.8, 3.3);
  gable.lineTo(0, 5.7);
  gable.lineTo(3.8, 3.3);
  gable.lineTo(3.8, 0);
  mesh(g, new THREE.ExtrudeGeometry(gable, { depth: 0.3, bevelEnabled: false }), M(0.96), 0, 0, 1.5);
  mesh(g, box(0.9, 1.6, 0.1), M(0.08), 0, 0.8, 1.84); // portal
  for (const x of [-2.2, 2.2]) mesh(g, box(0.5, 1.0, 0.1), M(0.1), x, 0.5, 1.84);
  for (const x of [-3.1, -2.2, -1.25, 1.25, 2.2, 3.1]) mesh(g, box(0.2, 1.0, 0.1), M(0.1), x, 2.3, 1.84);
  const rose = mesh(g, cyl(0.55, 0.55, 0.1, 12), M(0.1), 0, 3.6, 1.84);
  rose.rotation.x = Math.PI / 2;
  mesh(g, box(7.6, 0.12, 0.1), M(0.3), 0, 1.5, 1.84);
  // buttresses with pinnacles marching up the gable
  for (let i = -4; i <= 4; i++) {
    const x = i * 0.95;
    const top = 3.3 + (3.8 - Math.abs(x)) * (2.4 / 3.8);
    mesh(g, box(0.24, top + 0.25, 0.24), M(0.82), x, (top + 0.25) / 2, 1.95);
    mesh(g, cone(0.17, i === 0 ? 2.0 : 1.2 + (4 - Math.abs(i)) * 0.12, 4), M(0.3), x, top + 0.25 + (i === 0 ? 1.0 : 0.6 + (4 - Math.abs(i)) * 0.06), 1.95);
  }
  // side pinnacles along the roofline + the tall crossing spire
  for (let i = 0; i < 5; i++) for (const x of [-3.6, 3.6]) {
    mesh(g, box(0.2, 0.7, 0.2), M(0.82), x, 3.5, 0.9 - i);
    mesh(g, cone(0.15, 0.9, 4), M(0.3), x, 4.3, 0.9 - i);
  }
  mesh(g, box(0.9, 1.6, 0.9), M(0.88), 0, 5.6, -1.6);
  mesh(g, cyl(0.2, 0.42, 1.2, 6), M(0.8), 0, 7.0, -1.6);
  mesh(g, cone(0.22, 4.4, 6), M(0.28), 0, 9.8, -1.6);
  for (const [x, z] of [[-0.45, -1.15], [0.45, -1.15], [-0.45, -2.05], [0.45, -2.05]]) mesh(g, cone(0.1, 1.2, 4), M(0.3), x, 7.0, z);

  // neighbours
  const block = (x: number, w: number, h: number, d: number, tone: number, hip = 0) => {
    mesh(g, box(w, h, d), M(tone), x, h / 2, -0.5);
    for (let i = 0; i < Math.floor(w / 0.7); i++) for (let j = 0; j < Math.floor(h / 0.9); j++) mesh(g, box(0.22, 0.36, 0.06), M(0.1), x - w / 2 + 0.45 + i * 0.7, 0.6 + j * 0.9, -0.5 + d / 2 + 0.02, false);
    if (hip) {
      const rf = mesh(g, cone(0.7071, hip, 4), M(0.4), x, h + hip / 2, -0.5);
      rf.rotation.y = Math.PI / 4;
      rf.scale.set(w * 1.05, 1, d * 1.05);
    }
  };
  block(-13.5, 2.6, 1.8, 3, 0.86, 0.7);
  block(-10.6, 2.2, 2.9, 3, 0.74);
  block(5.6, 2.8, 2.3, 3, 0.8, 0.8);
  block(13.2, 2.4, 1.6, 3, 0.86, 0.6);
  // dome
  mesh(g, cyl(1.25, 1.35, 1.9, 12), M(0.86), -7, 0.95, -0.5);
  mesh(g, new THREE.SphereGeometry(1.3, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), M(0.6), -7, 1.9, -0.5);
  mesh(g, cyl(0.2, 0.2, 0.5, 6), M(0.9), -7, 3.4, -0.5);
  mesh(g, cone(0.24, 0.6, 6), M(0.3), -7, 3.95, -0.5);
  // campanile
  mesh(g, box(1.2, 6.4, 1.2), M(0.9), 9.6, 3.2, -0.5);
  mesh(g, box(1.3, 0.9, 1.3), M(0.2), 9.6, 5.6, -0.5);
  mesh(g, box(1.4, 0.2, 1.4), M(0.8), 9.6, 6.5, -0.5);
  const cap = mesh(g, cone(0.7071, 1.8, 4), M(0.3), 9.6, 7.5, -0.5);
  cap.rotation.y = Math.PI / 4;
  cap.scale.set(1.4, 1, 1.4);
  for (let j = 0; j < 4; j++) mesh(g, box(0.2, 0.4, 0.06), M(0.1), 9.6, 1 + j * 1.1, 0.12, false);

  for (const [x, s] of [[-15.6, 0.6], [-9, 0.5], [-4.6, 0.55], [4.3, 0.5], [7.9, 0.6], [11.3, 0.5], [15.2, 0.65]] as const) tree(g, x, 0.2, 1.4, s, x);
  return g;
}

/** The sea the river ends in. Standalone it brings its own water; in the journey the river supplies it. */
function buildContact(scene: THREE.Object3D, standalone = true): Built {
  const r = rng(11);
  const w = standalone ? water({ fadeNear: 400, fadeFar: 500, base: 0.07, deep: 0.3, sunX: 0, sunW: 5 }) : null;
  if (w) {
    const wm = mesh(scene, new THREE.PlaneGeometry(400, 110), w, 0, 0, -46, false);
    wm.rotation.x = -Math.PI / 2;
    wm.receiveShadow = false;
  }

  // sun sinking behind the horizon
  const SUN_R = 9.5;
  mesh(scene, new THREE.CircleGeometry(SUN_R, 48), sunBars(SUN_R), 0, 0.2, -104, false);
  cloud(scene, -17, 11.5, -84, 2.0);
  cloud(scene, 13, 14.5, -84, 2.5);
  cloud(scene, 31, 12, -84, 1.5, 0.1);
  const far = mesh(scene, new THREE.SphereGeometry(1, 24, 8), M(0.85), -34, -0.2, -92, false);
  far.scale.set(26, 2.2, 3);

  const town = city(scene);
  town.position.set(12.5, 0, -45);
  town.scale.setScalar(0.74);

  // island
  const mound = (cx: number, cz: number, rx: number, ry: number, rz: number) => {
    const m = mesh(scene, new THREE.SphereGeometry(1, 14, 8), M(0.9), cx, -ry * 0.25, cz);
    m.scale.set(rx, ry, rz);
    return (x: number, z: number) => -ry * 0.25 + ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2 - ((z - cz) / rz) ** 2));
  };
  const isle = mound(-4.6, -12, 1.7, 0.55, 1.1);
  const io = (x: number, z: number) => [x, isle(x, z), z] as const;
  pine(scene, ...io(-5.2, -12.1), 1.5);
  pine(scene, ...io(-4.0, -12.3), 1.1);
  pine(scene, ...io(-5.6, -11.7), 0.8);
  tree(scene, ...io(-4.55, -11.8), 0.42, 2);
  rock(scene, ...io(-3.5, -11.6), 0.26, 3);
  rock(scene, ...io(-5.9, -11.5), 0.16, 4);
  house(scene, ...io(-4.15, -11.55), 0.4).scale.setScalar(0.8);

  const sail = boat(scene, 3.4, -20, 1.6);
  sail.rotation.y = -0.6;
  const sail2 = boat(scene, -9, -34, 1.5);

  const birds = [bird(scene, -5.5, 6.6, -30, 0.5), bird(scene, -4.3, 7.3, -32, 0.42), bird(scene, 6.5, 6.0, -30, 0.46), bird(scene, 8, 8.4, -40, 0.5)];

  // foreground bank, lower right
  const bank = mound(2.2, 7.3, 1.9, 0.5, 1.5);
  const bo = (x: number, z: number) => [x, bank(x, z), z] as const;
  rock(scene, ...bo(1.55, 7.5), 0.3, 5);
  rock(scene, ...bo(2.5, 7.9), 0.2, 6, 0.8);
  rock(scene, ...bo(2.95, 7.0), 0.36, 7);
  plant(scene, ...bo(1.05, 7.4), 0.8, "reed", 1);
  plant(scene, ...bo(1.17, 7.3), 0.6, "reed", 2);
  plant(scene, ...bo(0.92, 7.55), 0.66, "reed", 3);
  plant(scene, ...bo(2.05, 7.7), 0.74, "tulip", 4);
  plant(scene, ...bo(2.25, 7.85), 0.5, "bud", 5);
  plant(scene, ...bo(1.8, 8.05), 0.38, "daisy", 6);
  plant(scene, ...bo(2.75, 7.6), 0.44, "tulip", 7);
  for (let i = 0; i < 40; i++) {
    const x = 0.6 + r() * 3.2;
    const z = 6.3 + r() * 2;
    const y = bank(x, z);
    if (y > 0.03) tuft(scene, x, y, z, 0.8 + r() * 0.7);
  }
  for (let i = 0; i < 10; i++) {
    const x = 0.5 + r() * 3;
    const z = 6.4 + r() * 2;
    if (bank(x, z) > 0.02) rock(scene, x, bank(x, z) - 0.02, z, 0.04 + r() * 0.04, 30 + i, 0.7);
  }

  return {
    camPos: new THREE.Vector3(0, 1.7, 14),
    target: new THREE.Vector3(0, 1.2, 0),
    fov: 30,
    mute: 78,
    shadowTarget: new THREE.Vector3(0, 0, 0),
    narrow: false,
    update(t) {
      if (w) w.uniforms.uT.value = t;
      sail.position.y = Math.sin(t * 1.0) * 0.03;
      sail.rotation.z = Math.sin(t * 0.8) * 0.04;
      sail2.position.x = -9 + Math.sin(t * 0.05) * 2;
      birds.forEach((b, i) => b.children.forEach((wing, k) => (wing.rotation.z = (k ? 1 : -1) * (0.45 + Math.sin(t * 4.5 + i) * 0.3))));
    },
  };
}

/* ------------------------------- post ------------------------------- */

const POST_FRAG = /* glsl */ `
  uniform sampler2D tColor, tNormal, tDepth;
  uniform vec2 uTexel, uFade, uBottom;
  uniform float uNear, uFar, uMute, uGain, uSide;
  uniform vec4 uZone; // text block in uv: x0, y0, x1, y1 (y up)
  uniform float uFeather;
  uniform vec3 uInk, uMuted;
  uniform vec4 uPaper; // a > 0: surfaces are filled with this where no ink falls, instead of being see-through
  varying vec2 vUv;

  float viewZ(vec2 uv) {
    float z = texture2D(tDepth, uv).x * 2.0 - 1.0;
    return 2.0 * uNear * uFar / (uFar + uNear - z * (uFar - uNear));
  }
  float bayer(vec2 p) {
    int i = int(mod(p.y, 4.0)) * 4 + int(mod(p.x, 4.0));
    float m[16] = float[16](0., 8., 2., 10., 12., 4., 14., 6., 3., 11., 1., 9., 15., 7., 13., 5.);
    return (m[i] + 0.5) / 16.0;
  }
  void main() {
    if (texture2D(tDepth, vUv).x >= 1.0) discard;
    vec4 c = texture2D(tColor, vUv);
    bool soft = c.a < 0.75;
    float z = viewZ(vUv);
    vec3 n = texture2D(tNormal, vUv).xyz * 2.0 - 1.0;

    float edge = 0.0;
    if (!soft) {
      for (int k = 0; k < 4; k++) {
        vec2 o = k == 0 ? vec2(uTexel.x, 0.) : k == 1 ? vec2(0., uTexel.y) : k == 2 ? vec2(-uTexel.x, 0.) : vec2(0., -uTexel.y);
        float zi = viewZ(vUv + o);
        float thr = 0.03 * z + 0.03;
        if (zi - z > thr) edge = 1.0;                       // silhouette, on the nearer surface
        else if (k < 2 && abs(zi - z) < thr) {              // crease between facets
          vec3 ni = texture2D(tNormal, vUv + o).xyz * 2.0 - 1.0;
          if (dot(n, ni) < 0.72) edge = 1.0;
        }
      }
    }

    // keep the text side clear; let the hero's river band run under it
    float mask = uFade.y > uFade.x ? mix(1.0, smoothstep(uFade.x, uFade.y, vUv.x), uSide) : 1.0;
    if (uBottom.x > 0.0) {
      // the river runs along the bottom of the screen the whole way across, text side included
      float y = vUv.y - uBottom.y;
      mask = max(mask, 1.0 - smoothstep(uBottom.x * 0.8, uBottom.x * 1.2, y));
    }

    // The scene fills the screen and steps back only where the text sits: a
    // rounded, feathered clearing that travels with the text block.
    if (uZone.z > uZone.x) {
      float aspect = uTexel.y / uTexel.x;
      vec2 gap = max(max(uZone.xy - vUv, vUv - uZone.zw), 0.0);
      // a wide, slow dissolve to the side of the text; a short one above and below, so the river under it stays whole
      float away = length(vec2(gap.x * aspect, gap.y * 2.4));
      mask *= smoothstep(0.0, uFeather, away);
    }

    float tone = soft ? 1.0 - c.r : clamp(1.0 - c.r * uGain, 0.0, 1.0);
    if (tone < 0.045) tone = 0.0;
    // outlines thin out into scattered dots along with the shading, so nothing ends on a straight cut
    bool on = edge > 0.5 ? mask > 0.12 + 0.76 * bayer(gl_FragCoord.xy) : tone * mask > bayer(gl_FragCoord.xy);
    if (!on) {
      if (uPaper.a <= 0.0) discard;
      gl_FragColor = vec4(uPaper.rgb, 1.0);
      return;
    }
    gl_FragColor = vec4(z > uMute ? uMuted : uInk, 1.0);
  }`;

export function createScene(variant: Variant, canvas: HTMLCanvasElement): SceneHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);
  renderer.localClippingEnabled = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  const scene = new THREE.Scene();
  const built =
    variant === "hero"
      ? buildHero(scene)
      : variant === "fish"
        ? buildFishOverlay(scene)
        : variant === "portrait"
          ? buildPortrait(scene)
          : variant === "tools"
            ? buildTools(scene)
            : variant === "works"
              ? buildWorks(scene)
              : buildContact(scene);

  scene.add(new THREE.AmbientLight(0xffffff, 1.15));
  const sun = new THREE.DirectionalLight(0xffffff, 2.0);
  sun.position.copy(built.shadowTarget).add(built.lightFrom ?? new THREE.Vector3(-7, 9, 6));
  sun.target.position.copy(built.shadowTarget);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  const sc = sun.shadow.camera;
  sc.left = -9;
  sc.right = 9;
  sc.top = 9;
  sc.bottom = -9;
  sc.near = 1;
  sc.far = 40;
  sun.shadow.bias = -0.003;
  sun.shadow.normalBias = 0.04;
  scene.add(sun, sun.target);

  const NEAR = 0.5;
  const FAR = 260;
  const camera = new THREE.PerspectiveCamera(built.fov, 1, NEAR, FAR);

  const depthTexture = new THREE.DepthTexture(4, 4);
  const opts = { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter };
  const rtColor = new THREE.WebGLRenderTarget(4, 4, { ...opts, depthTexture });
  const rtNormal = new THREE.WebGLRenderTarget(4, 4, opts);
  const normalMat = new THREE.MeshNormalMaterial({ flatShading: true, side: THREE.DoubleSide });

  const post = new THREE.ShaderMaterial({
    uniforms: {
      tColor: { value: rtColor.texture },
      tNormal: { value: rtNormal.texture },
      tDepth: { value: depthTexture },
      uTexel: { value: new THREE.Vector2(1, 1) },
      uFade: { value: new THREE.Vector2(0, 0) },
      uBottom: { value: new THREE.Vector2(0, 0) },
      uNear: { value: NEAR },
      uFar: { value: FAR },
      uMute: { value: built.mute },
      uGain: { value: 1.0 },
      uPaper: { value: built.paper ? new THREE.Vector4(built.paper[0], built.paper[1], built.paper[2], 1) : new THREE.Vector4(0, 0, 0, 0) },
      uSide: { value: 1.0 },
      uZone: { value: new THREE.Vector4(0, 0, 0, 0) },
      uFeather: { value: 0.13 },
      uInk: { value: INK },
      uMuted: { value: MUTED },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: POST_FRAG,
    depthTest: false,
    depthWrite: false,
  });
  const postScene = new THREE.Scene();
  postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post));
  const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  let height = 1;
  let width = 1;
  const projected = new THREE.Vector3();
  const rayDir = new THREE.Vector3();
  const hit = new THREE.Vector3();
  const screenToWorld: ScreenToWorld = (x, y, z) => {
    rayDir.set((x / width) * 2 - 1, 1 - (y / height) * 2, 0.5).unproject(camera).sub(camera.position).normalize();
    const reach = Math.abs(rayDir.z) > 1e-5 ? (z - camera.position.z) / rayDir.z : 0;
    hit.copy(camera.position).addScaledVector(rayDir, reach);
    const y0 = projected.copy(hit).project(camera).y;
    const y1 = projected.copy(hit).setY(hit.y + 1).project(camera).y;
    return { p: hit, px: Math.max(1e-3, (Math.abs(y1 - y0) * height) / 2) };
  };

  return {
    resize(cssW, cssH, bleed) {
      const W = Math.ceil(cssW / PIXEL);
      const H = Math.ceil(cssH / PIXEL);
      renderer.setSize(W, H, false);
      canvas.style.width = `${W * PIXEL}px`;
      canvas.style.height = `${H * PIXEL}px`;
      rtColor.setSize(W, H);
      rtNormal.setSize(W, H);
      post.uniforms.uTexel.value.set(1 / W, 1 / H);

      if (built.plain) {
        camera.fov = built.fov;
        // a plain scene can be given extra canvas below its frame (bleed): the framing
        // stays as composed, and the picture simply carries on downward
        const frameH = Math.max(1, cssH - Math.max(0, bleed));
        camera.aspect = cssW / frameH;
        if (bleed > 0) camera.setViewOffset(cssW, frameH, 0, 0, cssW, cssH);
        else camera.clearViewOffset();
        camera.updateProjectionMatrix();
        post.uniforms.uFade.value.set(0, 0);
        post.uniforms.uBottom.value.set(0, 0);
        height = cssH;
        width = cssW;
        return;
      }
      // The scene is composed for a box: the right-hand zone on wide screens,
      // a band under the text on narrow ones. The canvas is a wider window
      // onto the same projection.
      const narrow = cssW < 768;
      const sectionH = cssH - bleed;
      const band = Math.min(400, sectionH * 0.55);
      const bx = narrow ? 0 : cssW * 0.42;
      const by = narrow ? sectionH - band : 0;
      const bw = cssW - bx;
      const bh = narrow ? band : sectionH;
      built.narrow = narrow;
      camera.fov = built.fov * (narrow ? 0.9 : 1);
      camera.aspect = bw / bh;
      camera.setViewOffset(bw, bh, -bx, -by, cssW, cssH);
      camera.updateProjectionMatrix();
      // the journey has no side to keep clear: the scene is full-bleed and the text zone does the reserving
      const full = !!built.frame;
      post.uniforms.uFade.value.set(narrow || full ? 0 : (bx - cssW * 0.02) / cssW, narrow || full ? 0 : (bx + cssW * 0.14) / cssW);
      post.uniforms.uBottom.value.set(full ? 0 : bleed / cssH, 0);
      height = cssH;
      width = cssW;
    },
    render(t, px, py, scroll, shiftPx = 0) {
      const fr = built.frame?.(THREE.MathUtils.clamp(scroll, 0, 1));
      if (fr) built.camX = fr.x;
      built.update(t, px, py);
      post.uniforms.uBottom.value.y = Math.max(0, shiftPx) / height;
      if (fr) {
        // one continuous shot: the camera tracks downstream as the page scrolls
        camera.position.set(fr.x + px * 0.55, fr.y - py * 0.2, fr.z);
        camera.lookAt(fr.x, fr.targetY - (built.narrow ? 0.3 : 0), 0);
        camera.fov = fr.fov * (built.narrow ? 0.9 : 1);
        camera.updateProjectionMatrix();
        post.uniforms.uMute.value = fr.mute;
        post.uniforms.uSide.value = fr.side;
        sun.position.set(fr.x - 6, 9, 7.5);
        sun.target.position.set(fr.x + 1, 0, 1.5);
      } else {
      // crane move on scroll: the camera lifts and pulls back as the section leaves
      // centre, so near and far objects slide past each other at different speeds
      const lift = Math.abs(scroll);
      camera.position.set(built.camPos.x + px * 0.55 - scroll * 0.9, built.camPos.y - py * 0.2 + lift * 1.5, built.camPos.z + lift * 1.2);
      camera.lookAt(built.target.x, built.target.y - (built.narrow ? 0.3 : 0), built.target.z);
      }
      if (built.placeWorks) {
        camera.updateMatrixWorld();
        built.placeWorks(screenToWorld, t);
      }
      if (built.placeTools && built.toolPath) {
        camera.updateMatrixWorld();
        built.placeTools(screenToWorld, t);
      }
      renderer.setRenderTarget(rtColor);
      renderer.clear();
      renderer.render(scene, camera);
      scene.overrideMaterial = normalMat;
      built.skipNormal?.forEach((o) => (o.visible = false));
      renderer.setRenderTarget(rtNormal);
      renderer.clear();
      renderer.render(scene, camera);
      built.skipNormal?.forEach((o) => (o.visible = true));
      scene.overrideMaterial = null;
      renderer.setRenderTarget(null);
      renderer.clear();
      renderer.render(postScene, postCam);
    },
    jump() {
      built.jump?.();
    },
    setTextZone(zone) {
      if (!zone || zone.bottom <= 0 || zone.top >= height || zone.right <= zone.left) {
        post.uniforms.uZone.value.set(0, 0, 0, 0);
        return;
      }
      post.uniforms.uZone.value.set(zone.left / width, 1 - zone.bottom / height, zone.right / width, 1 - zone.top / height);
    },
    setPointer(screenX) {
      if (!built.fishPos || screenX == null) {
        built.mouseX = null;
        return;
      }
      // screen x is linear in river x along the lane the fish swims in: find the line from two points
      const z = built.fishPos.z;
      const at = (x: number) => ((projected.set(x, 0, z).project(camera).x + 1) / 2) * width;
      const x0 = built.camX ?? 0;
      const a = at(x0);
      const b = at(x0 + 1);
      built.mouseX = Math.abs(b - a) > 1e-3 ? x0 + (screenX - a) / (b - a) : null;
    },
    fishLeave() {
      built.leave?.();
    },
    fishEnter() {
      built.enter?.();
    },
    setDrop(drop) {
      if (built.dropIn !== undefined) built.dropIn = drop;
    },
    setWorksUp(ups) {
      built.setWorksUp?.(ups);
    },
    workSpots() {
      const tall = built.workHeight ?? 1;
      return (built.workSpots ?? []).map((v) => {
        projected.copy(v).project(camera);
        const x = ((projected.x + 1) / 2) * width;
        const y = ((1 - projected.y) / 2) * height;
        const top = ((1 - projected.copy(v).setY(v.y + tall / 2).project(camera).y) / 2) * height;
        return { x, y, h: Math.abs(y - top) * 2 };
      });
    },
    aimWorks(xs) {
      if (!built.frame || !built.workSpots || !built.setWorkX) return;
      const fr = built.frame(0);
      camera.position.set(fr.x, fr.y, fr.z);
      camera.lookAt(fr.x, fr.targetY - (built.narrow ? 0.3 : 0), 0);
      camera.fov = fr.fov * (built.narrow ? 0.9 : 1);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      xs.forEach((sx, i) => {
        const spot = built.workSpots![i];
        if (!spot) return;
        const at = (x: number) => ((projected.set(x, 0, spot.z).project(camera).x + 1) / 2) * width;
        const a = at(fr.x);
        const b = at(fr.x + 1);
        if (Math.abs(b - a) > 1e-3) built.setWorkX!(i, fr.x + (sx - a) / (b - a));
      });
    },
    setWorkCards(cards) {
      if (built.placeWorks) built.workIn = cards;
    },
    setToolPath(path) {
      if (built.placeTools) built.toolPath = path;
    },
    aimLandings(targets) {
      if (!built.frame || !built.landings || !built.setLandingX) return;
      targets.forEach((target, i) => {
        const spot = built.landings![i];
        if (!spot) return;
        const fr = built.frame!(THREE.MathUtils.clamp(target.p, 0, 1));
        camera.position.set(fr.x, fr.y, fr.z);
        camera.lookAt(fr.x, fr.targetY - (built.narrow ? 0.3 : 0), 0);
        camera.fov = fr.fov * (built.narrow ? 0.9 : 1);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
        // screen x is linear in world x along a line of constant depth: two samples give the line
        const at = (x: number) => ((projected.set(x, spot.y, spot.z).project(camera).x + 1) / 2) * width;
        const a = at(fr.x);
        const b = at(fr.x + 1);
        if (Math.abs(b - a) > 1e-3) built.setLandingX!(i, fr.x + (target.x - a) / (b - a));
      });
    },
    toolLandings() {
      return (built.landings ?? []).map((v) => {
        projected.copy(v).project(camera);
        const x = ((projected.x + 1) / 2) * width;
        const y = ((1 - projected.y) / 2) * height;
        const up = ((1 - projected.copy(v).setY(v.y + 1).project(camera).y) / 2) * height;
        return { x, y, unit: Math.abs(y - up) * (built.landScale ?? 1) };
      });
    },
    runnerScreen() {
      if (!built.runnerPos || !built.runnerHeight) return null;
      projected.copy(built.runnerPos).project(camera);
      const x = ((projected.x + 1) / 2) * width;
      const feetY = ((1 - projected.y) / 2) * height;
      projected.copy(built.runnerPos).setY(built.runnerPos.y + built.runnerHeight).project(camera);
      return { x, feetY, headY: ((1 - projected.y) / 2) * height };
    },
    setActiveNode(i) {
      built.setActiveNode?.(i);
    },
    setRunnerHidden(hidden) {
      built.hideRunner?.(hidden);
    },
    setPortrait(approach, lookX, lookY) {
      if (built.portraitIn) built.portraitIn = { approach, lookX, lookY };
    },
    pose(dir, pitch, beat, bend = 0, arch = 0) {
      if (built.poseIn) built.poseIn = { dir, pitch, beat, bend, arch };
    },
    fishScreen() {
      if (!built.fishPos) return null;
      projected.copy(built.fishPos).project(camera);
      return { x: ((projected.x + 1) / 2) * width, y: ((1 - projected.y) / 2) * height };
    },
    nodesScreen() {
      const camX = built.camX ?? 0;
      return (built.nodes ?? []).map((n) => {
        projected.copy(n).project(camera);
        const near = 1 - THREE.MathUtils.smoothstep(Math.abs(n.x - camX), 5.5, 9);
        return { x: ((projected.x + 1) / 2) * width, y: ((1 - projected.y) / 2) * height, k: projected.z < 1 ? near : 0 };
      });
    },
    dispose() {
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
      });
      rtColor.dispose();
      rtNormal.dispose();
      depthTexture.dispose();
      post.dispose();
      normalMat.dispose();
      renderer.dispose();
    },
  };
}
