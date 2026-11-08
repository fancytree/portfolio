(async function () {
'use strict';

/* Player profile — written by the character creator in index.html before this file loads.
   Internally the player's id stays 'mei' (data keys); only the display name and look change. */
const HQ = Object.assign({ name: 'Mei', body: '#f2b632', pants: '#2e2470', hair: '#2e2470', skin: '#ffd8c2', bun: true }, window.HQ_PROFILE || {});
HQ.name = String(HQ.name || 'Mei').replace(/[^\p{L}\p{N} _.-]/gu, '').trim().slice(0, 16) || 'Mei';   // names reach innerHTML: keep them to plain characters
const PNAME = HQ.name;

/* =========================================================
   0. PALETTE
   ========================================================= */
const P = {
  floor:   '#bda9ef',
  path:    '#e4daff',
  wall:    '#ddd0fb',
  cap:     '#d64fb3',
  indigo:  '#2e2470',
  deep:    '#4a3a9e',
  violet:  '#7b5cd6',
  purple:  '#8a6fd6',
  lavender:'#cbb8f7',
  lilac:   '#e6dcff',
  white:   '#f7f2ff',
  magenta: '#d64fb3',
  pink:    '#f39ad6',
  mustard: '#f2b632',
  sky:     '#5cc4f2',
  coral:   '#ff7a59',
  skin:    '#ffd8c2'
};

/* =========================================================
   1. RENDERER / SCENE / CAMERA
   ========================================================= */
const app = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const FRUSTUM = 30;
let aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(
  -aspect * FRUSTUM / 2, aspect * FRUSTUM / 2, FRUSTUM / 2, -FRUSTUM / 2, 0.1, 600);
const TARGET = new THREE.Vector3(0, 6, 0.5);
camera.position.set(TARGET.x + 40, TARGET.y + 38, TARGET.z + 40);
camera.zoom = Math.min(0.95, aspect * FRUSTUM / 40);
camera.updateProjectionMatrix();

/* =========================================================
   2. LIGHTING
   ========================================================= */
const lin = c => new THREE.Color(c).convertSRGBToLinear();
const hemi = new THREE.HemisphereLight(lin('#f5efff'), lin('#5a46b8'), 0.85); scene.add(hemi);
const amb = new THREE.AmbientLight(lin('#b9a4ff'), 0.24); scene.add(amb);

const sun = new THREE.DirectionalLight(lin('#fff3e6'), 1.1);
sun.position.set(16, 34, 14);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -27, right: 27, top: 27, bottom: -27, near: 1, far: 110 });
sun.shadow.bias = -0.0005;
sun.shadow.normalBias = 0.025;
scene.add(sun);
sun.target.position.set(0, 4, 0); scene.add(sun.target);

const rim = new THREE.DirectionalLight(lin('#e08cff'), 0.35);
rim.position.set(-18, 14, -10);
scene.add(rim);

/* =========================================================
   3. HELPERS — materials, rounded boxes, labels
   ========================================================= */
const matCache = new Map();
function M(color, o = {}) {
  const key = color + JSON.stringify(o);
  if (!o.unique && matCache.has(key)) return matCache.get(key);
  const m = new THREE.MeshStandardMaterial({
    color: lin(color), roughness: o.rough ?? 0.86, metalness: 0,
    flatShading: !!o.flat
  });
  if (o.emissive) { m.emissive = lin(o.emissive); m.emissiveIntensity = o.ei ?? 1; }
  else { m.emissive = lin(color).multiplyScalar(0.05); }
  if (o.opacity !== undefined) { m.transparent = true; m.opacity = o.opacity; m.depthWrite = false; }
  if (!o.unique) matCache.set(key, m);
  return m;
}
const asMat = c => (typeof c === 'string' ? M(c) : c);

const geoCache = new Map();
function rboxGeo(w, h, d, r) {
  r = Math.max(0.002, Math.min(r, w * 0.45, h * 0.45, d * 0.45));
  const key = [w, h, d, r].map(v => v.toFixed(3)).join('|');
  if (geoCache.has(key)) return geoCache.get(key);
  const sw = w - 2 * r, sh = h - 2 * r;
  const r0 = Math.max(0, Math.min(r * 0.9, sw / 2 - 0.001, sh / 2 - 0.001));
  const s = new THREE.Shape(), x0 = -sw / 2, y0 = -sh / 2;
  if (r0 > 0.002) {
    s.moveTo(x0 + r0, y0); s.lineTo(x0 + sw - r0, y0); s.quadraticCurveTo(x0 + sw, y0, x0 + sw, y0 + r0);
    s.lineTo(x0 + sw, y0 + sh - r0); s.quadraticCurveTo(x0 + sw, y0 + sh, x0 + sw - r0, y0 + sh);
    s.lineTo(x0 + r0, y0 + sh); s.quadraticCurveTo(x0, y0 + sh, x0, y0 + sh - r0);
    s.lineTo(x0, y0 + r0); s.quadraticCurveTo(x0, y0, x0 + r0, y0);
  } else {
    s.moveTo(x0, y0); s.lineTo(x0 + sw, y0); s.lineTo(x0 + sw, y0 + sh); s.lineTo(x0, y0 + sh); s.lineTo(x0, y0);
  }
  const depth = Math.max(0.001, d - 2 * r);
  const g = new THREE.ExtrudeGeometry(s, {
    depth, bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 3, curveSegments: 4
  });
  g.translate(0, 0, -depth / 2);
  geoCache.set(key, g);
  return g;
}
function shadowed(mesh, cast = true) { mesh.castShadow = cast; mesh.receiveShadow = true; return mesh; }

/** Rounded box. y is the BOTTOM of the box. */
function B(parent, w, h, d, color, x, y, z, r = 0.06) {
  const m = shadowed(new THREE.Mesh(rboxGeo(w, h, d, r), asMat(color)));
  m.position.set(x, y + h / 2, z);
  parent.add(m); return m;
}
/** Cylinder. y is the BOTTOM. */
function C(parent, rt, rb, h, color, x, y, z, seg = 24) {
  const key = 'c' + [rt, rb, h, seg].join('|');
  if (!geoCache.has(key)) geoCache.set(key, new THREE.CylinderGeometry(rt, rb, h, seg));
  const m = shadowed(new THREE.Mesh(geoCache.get(key), asMat(color)));
  m.position.set(x, y + h / 2, z);
  parent.add(m); return m;
}
/** Sphere. y is the CENTER. */
function S(parent, r, color, x, y, z, seg = 20) {
  const key = 's' + [r, seg].join('|');
  if (!geoCache.has(key)) geoCache.set(key, new THREE.SphereGeometry(r, seg, Math.round(seg * 0.7)));
  const m = shadowed(new THREE.Mesh(geoCache.get(key), asMat(color)));
  m.position.set(x, y, z);
  parent.add(m); return m;
}

let _seed = 20261107;
const rnd = () => (_seed = (_seed * 16807) % 2147483647) / 2147483647;

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
const FONT = 'Fredoka, "Nunito", "Arial Rounded MT Bold", system-ui, sans-serif';
function textTexture(text, o = {}) {
  const fs = o.size || 96;
  const padX = o.padX ?? (o.bg ? fs * 0.55 : fs * 0.1), padY = o.padY ?? (o.bg ? fs * 0.3 : fs * 0.08);
  const c = document.createElement('canvas'), ctx = c.getContext('2d');
  const font = `${o.weight || 700} ${fs}px ${FONT}`;
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(text).width + padX * 2), h = Math.ceil(fs * 1.05 + padY * 2);
  c.width = w; c.height = h;
  if (o.bg) { ctx.fillStyle = o.bg; roundRectPath(ctx, 0, 0, w, h, o.radius ?? h / 2); ctx.fill(); }
  ctx.font = font; ctx.fillStyle = o.fg || '#ffffff';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h / 2 + fs * 0.05);
  const tex = new THREE.CanvasTexture(c);
  tex.encoding = THREE.sRGBEncoding;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return { tex, aspect: w / h };
}
function labelMesh(text, h, o = {}) {
  const { tex, aspect } = textTexture(text, o);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(h * aspect, h), new THREE.MeshBasicMaterial({
    map: tex, transparent: true, toneMapped: false, depthWrite: false,
    opacity: o.opacity ?? 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2
  }));
  m.renderOrder = 2;
  return m;
}
function floorLabel(parent, text, h, x, z, o) {
  const m = labelMesh(text, h, o); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.05, z);
  parent.add(m); return m;
}
function wallLabel(parent, text, h, x, y, z, rotY, o) {
  const m = labelMesh(text, h, o); m.position.set(x, y, z); m.rotation.y = rotY;
  parent.add(m); return m;
}
function tagSprite(text, h, o = {}) {
  const { tex, aspect } = textTexture(text, o);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: tex, toneMapped: false, transparent: true, depthTest: o.depthTest ?? true
  }));
  s.scale.set(h * aspect, h, 1); s.renderOrder = 5;
  return s;
}
function radialTexture(stops) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const ctx = c.getContext('2d'), g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  stops.forEach(([p, col]) => g.addColorStop(p, col));
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
const blobTex = radialTexture([[0, 'rgba(255,255,255,1)'], [0.55, 'rgba(255,255,255,.55)'], [1, 'rgba(255,255,255,0)']]);
const glowTex = radialTexture([[0, 'rgba(255,255,255,1)'], [0.3, 'rgba(255,255,255,.45)'], [1, 'rgba(255,255,255,0)']]);
const blobGeo = new THREE.PlaneGeometry(1, 1);
const blobMat = new THREE.MeshBasicMaterial({
  map: blobTex, color: lin('#3a2a8a'), transparent: true, opacity: 0.32, depthWrite: false, toneMapped: false,
  polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1
});
function blob(parent, w, d, x = 0, z = 0, y = 0.02) {
  const m = new THREE.Mesh(blobGeo, blobMat);
  m.rotation.x = -Math.PI / 2; m.scale.set(w, d, 1); m.position.set(x, y, z); m.renderOrder = 1;
  parent.add(m); return m;
}
function glow(parent, x, y, z, size, color, opacity = 0.55) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: new THREE.Color(color), blending: THREE.AdditiveBlending,
    transparent: true, depthWrite: false, opacity, toneMapped: false
  }));
  s.scale.set(size, size, 1); s.position.set(x, y, z); parent.add(s); return s;
}
const GLASS = M(P.sky, { opacity: 0.2, rough: 0.15 });
const FACADE_GLASS = M(P.sky, { opacity: 0.1, rough: 0.15 });

try {
  await Promise.race([document.fonts.load(`700 80px Fredoka`), new Promise(r => setTimeout(r, 1800))]);
} catch (e) { /* system font fallback */ }

/* =========================================================
   4. FURNITURE KIT  (all take a parent; local y = 0 is the floor)
   ========================================================= */
function chair(parent, x, z, rot, color = P.magenta) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; parent.add(g);
  C(g, 0.3, 0.3, 0.05, P.indigo, 0, 0, 0);
  C(g, 0.045, 0.045, 0.38, P.indigo, 0, 0.04, 0, 12);
  B(g, 0.62, 0.12, 0.6, color, 0, 0.42, 0, 0.05);
  B(g, 0.62, 0.66, 0.1, color, 0, 0.56, 0.28, 0.05);
  return g;
}

/** Workstation. Local: sitter at +z facing -z, monitor at the back. */
const DESKS = [], DESK = {};
function desk(parent, floor, key, x, z, rot, o = {}) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; parent.add(g);
  blob(g, 2.4, 2.0, 0, 0.35);
  B(g, 1.8, 0.1, 0.9, P.white, 0, 0.68, 0, 0.04);
  B(g, 0.08, 0.68, 0.82, P.violet, -0.84, 0, 0, 0.03);
  B(g, 0.08, 0.68, 0.82, P.violet, 0.84, 0, 0, 0.03);
  B(g, 1.6, 0.36, 0.04, P.violet, 0, 0.28, -0.38, 0.015);
  B(g, 0.3, 0.03, 0.2, P.indigo, 0, 0.78, -0.24, 0.012);
  B(g, 0.07, 0.3, 0.06, P.indigo, 0, 0.78, -0.28, 0.02);
  B(g, 0.96, 0.58, 0.07, P.indigo, 0, 0.98, -0.27, 0.03);
  const sc = o.screen || P.sky;
  const screen = B(g, 0.86, 0.48, 0.014, M(sc, { emissive: sc, ei: 0.9, unique: true }), 0, 1.03, -0.228, 0.005);
  screen.castShadow = false;
  B(g, 0.52, 0.03, 0.17, P.lilac, 0, 0.78, 0.08, 0.012);
  C(g, 0.055, 0.05, 0.11, P.coral, 0.62, 0.78, 0.02, 14);
  if (o.lamp) {
    C(g, 0.09, 0.1, 0.03, P.indigo, -0.68, 0.78, -0.2, 14);
    C(g, 0.015, 0.015, 0.34, P.indigo, -0.68, 0.8, -0.2, 8);
    C(g, 0.06, 0.12, 0.1, M(P.mustard, { emissive: P.mustard, ei: 0.8 }), -0.68, 1.12, -0.2, 14);
  }
  chair(g, 0, 0.86, 0, o.chair || P.magenta);
  g.updateMatrix();
  const seat = new THREE.Vector3(0, 0, 0.86).applyMatrix4(g.matrix);       // floor-local
  const d = { key, floor, group: g, x, z, seat, facing: rot + Math.PI, screen, zone: o.zone };
  DESKS.push(d); DESK[key] = d;
  return d;
}

/** Pod of 6 back-to-back desks. Row a (rot 0) at zA, row b (rot π) at zB. */
const POD_X = [-10.2, -8.1, -6.0];
function pod(parent, floor, prefix, zA, zB, o = {}) {
  POD_X.forEach((x, i) => desk(parent, floor, `${prefix}a${i}`, x, zA, 0,
    { zone: o.zone, chair: o.chair, lamp: i === 1, screen: (o.screens || [])[i] }));
  POD_X.forEach((x, i) => desk(parent, floor, `${prefix}b${i}`, x, zB, Math.PI,
    { zone: o.zone, chair: o.chair, lamp: i !== 1, screen: (o.screens || [])[i + 3] }));
  B(parent, 6.4, 0.34, 0.06, P.lavender, -8.1, 0.78, (zA + zB) / 2, 0.03);
}

function plant(parent, x, z, s = 1, pot = P.coral, y = 0) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(s); parent.add(g);
  blob(g, 1.1, 1.1);
  C(g, 0.3, 0.23, 0.5, pot, 0, 0, 0, 18);
  C(g, 0.27, 0.27, 0.04, P.indigo, 0, 0.48, 0, 18);
  const leaf1 = M('#8f6cf0', { flat: true }), leaf2 = M('#b77ae8', { flat: true });
  S(g, 0.36, leaf1, 0, 0.9, 0, 9);
  S(g, 0.26, leaf2, 0.2, 1.18, 0.08, 8);
  S(g, 0.24, leaf2, -0.18, 1.12, -0.1, 8);
  return g;
}

function tree(parent, x, y, z, s = 1) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(s); parent.add(g);
  blob(g, 2.6, 2.6);
  C(g, 0.16, 0.24, 1.6, '#6a4fc0', 0, 0, 0, 10);
  S(g, 1.1, M('#f0a6e0', { flat: true }), 0, 2.2, 0, 10);
  S(g, 0.75, M('#c78af0', { flat: true }), 0.45, 2.95, -0.25, 9);
  return g;
}

/** Sofa facing +z (local). Seats at local (±0.8, -0.1). */
function sofa(parent, x, z, rot = 0, color = P.purple, cushion = '#a58cf0') {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; parent.add(g);
  blob(g, 4.6, 2.0, 0, -0.1);
  B(g, 3.6, 0.42, 1.0, color, 0, 0, 0, 0.12);
  B(g, 3.6, 0.82, 0.32, color, 0, 0.18, -0.63, 0.12);
  B(g, 0.32, 0.64, 1.3, color, -1.8, 0, -0.15, 0.12);
  B(g, 0.32, 0.64, 1.3, color, 1.8, 0, -0.15, 0.12);
  B(g, 1.6, 0.14, 0.85, cushion, -0.8, 0.42, 0.07, 0.06);
  B(g, 1.6, 0.14, 0.85, cushion, 0.8, 0.42, 0.07, 0.06);
  B(g, 0.55, 0.48, 0.18, P.mustard, -1.2, 0.56, -0.33, 0.08).rotation.z = 0.12;
  B(g, 0.55, 0.48, 0.18, P.sky, 1.2, 0.56, -0.33, 0.08).rotation.z = -0.1;
  return g;
}
/** Armchair facing +z (local). */
function armchair(parent, x, z, rot, color = P.coral) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; parent.add(g);
  blob(g, 1.5, 1.5);
  B(g, 1.0, 0.42, 1.0, color, 0, 0, 0, 0.12);
  B(g, 1.0, 0.8, 0.3, color, 0, 0.2, -0.4, 0.12);
  B(g, 0.24, 0.6, 1.0, color, -0.5, 0, 0, 0.1);
  B(g, 0.24, 0.6, 1.0, color, 0.5, 0, 0, 0.1);
  return g;
}
function coffeeTable(parent, x, z) {
  blob(parent, 1.9, 1.9, x, z);
  C(parent, 0.12, 0.2, 0.38, P.indigo, x, 0, z, 14);
  C(parent, 0.75, 0.75, 0.08, P.white, x, 0.38, z, 32);
  B(parent, 0.42, 0.06, 0.3, P.coral, x - 0.2, 0.46, z + 0.05, 0.02);
  C(parent, 0.06, 0.05, 0.11, P.sky, x + 0.3, 0.46, z - 0.15, 14);
}
function floorLamp(parent, x, z) {
  blob(parent, 0.8, 0.8, x, z);
  C(parent, 0.24, 0.26, 0.05, P.indigo, x, 0, z, 18);
  C(parent, 0.025, 0.025, 1.7, P.indigo, x, 0.05, z, 8);
  C(parent, 0.26, 0.38, 0.42, M('#ffe3a3', { emissive: P.mustard, ei: 0.9 }), x, 1.72, z, 20);
  glow(parent, x, 1.9, z, 2.4, '#ffcf6a', 0.4);
}
function rug(parent, w, d, x, z, color) { B(parent, w, 0.03, d, color, x, 0, z, 0.02); }
function serverRack(parent, x, z, i) {
  blob(parent, 1.4, 1.5, x, z + 0.15);
  B(parent, 1.0, 2.8, 1.0, P.indigo, x, 0, z, 0.08);
  B(parent, 0.86, 2.6, 0.04, P.deep, x, 0.1, z + 0.51, 0.02);
  for (let r = 0; r < 7; r++) {
    const c = (r + i) % 3 === 0 ? P.magenta : P.sky;
    B(parent, 0.62, 0.05, 0.02, M(c, { emissive: c, ei: 1.4 }), x - 0.08, 0.45 + r * 0.32, z + 0.54, 0.01).castShadow = false;
    B(parent, 0.06, 0.06, 0.02, M(P.mustard, { emissive: P.mustard, ei: 1.5 }), x + 0.32, 0.445 + r * 0.32, z + 0.54, 0.01);
  }
}
/** Straight glass segment with rail + end posts (axis-aligned). */
function railing(parent, x0, z0, x1, z1, h = 1.0, glass = GLASS) {
  const alongX = Math.abs(z1 - z0) < 1e-6;
  const len = alongX ? Math.abs(x1 - x0) : Math.abs(z1 - z0);
  const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  B(parent, alongX ? len : 0.05, h, alongX ? 0.05 : len, glass, cx, 0, cz, 0.02).castShadow = false;
  B(parent, alongX ? len + 0.08 : 0.08, 0.07, alongX ? 0.08 : len + 0.08, P.violet, cx, h, cz, 0.03);
  const n = Math.max(1, Math.round(len / 3.2));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    B(parent, 0.08, h, 0.08, P.violet, x0 + (x1 - x0) * t, 0, z0 + (z1 - z0) * t, 0.03);
  }
}
/** Glass room in the back strip, door gap on the front (z1) side. */
function glassRoom(parent, x0, x1, z0, z1, d0, d1, label, tint) {
  rug(parent, x1 - x0, z0 - z1 < 0 ? z1 - z0 : z0 - z1, (x0 + x1) / 2, (z0 + z1) / 2, tint);
  railing(parent, x0, z1, d0, z1, 2.6);
  railing(parent, d1, z1, x1, z1, 2.6);
  railing(parent, x0, z0, x0, z1, 2.6);
  railing(parent, x1, z0, x1, z1, 2.6);
  wallLabel(parent, label, 0.36, (d1 + x1) / 2, 2.15, z1 + 0.05, 0, { bg: P.magenta, fg: '#ffffff', size: 90 });
}
function booth(parent, x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g);
  blob(g, 2.0, 2.0);
  B(g, 1.7, 2.5, 0.12, P.lavender, 0, 0, -0.79, 0.05);
  B(g, 0.12, 2.5, 1.7, P.lavender, -0.79, 0, 0, 0.05);
  B(g, 0.12, 2.5, 1.7, P.lavender, 0.79, 0, 0, 0.05);
  B(g, 1.74, 0.12, 1.74, P.violet, 0, 2.5, 0, 0.05);
  B(g, 1.46, 2.2, 0.05, GLASS, 0, 0.05, 0.8, 0.02).castShadow = false;
  B(g, 1.7, 0.26, 0.12, P.magenta, 0, 2.24, 0.8, 0.04);
  wallLabel(g, 'FOCUS', 0.17, 0, 2.37, 0.87, 0, { fg: '#ffffff', size: 70 });
  B(g, 0.9, 0.06, 0.4, P.white, 0, 0.75, -0.5, 0.02);
  C(g, 0.2, 0.2, 0.45, P.mustard, 0, 0, 0.05, 16);
  return g;
}
function teamBoard(parent, x, z, rot, w = 5.0) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; parent.add(g);
  blob(g, w + 0.6, 1.0);
  B(g, 0.1, 0.7, 0.5, P.violet, -w / 2 + 0.3, 0, 0, 0.03);
  B(g, 0.1, 0.7, 0.5, P.violet, w / 2 - 0.3, 0, 0, 0.03);
  B(g, w, 2.3, 0.12, P.white, 0, 0.7, 0, 0.06);
  B(g, w, 0.44, 0.13, P.mustard, 0, 2.56, 0, 0.06);
  wallLabel(g, 'TEAM BOARD', 0.28, 0, 2.78, 0.075, 0, { fg: P.indigo, size: 96 });
  const cw = w / 3;
  ['TO DO', 'DOING', 'DONE'].forEach((t, ci) => {
    const cx = -w / 2 + cw * (ci + 0.5);
    wallLabel(g, t, 0.16, cx, 2.36, 0.07, 0, { fg: P.violet, size: 80 });
    if (ci < 2) B(g, 0.035, 1.95, 0.02, P.lavender, cx + cw / 2, 0.8, 0.07, 0.01);
    const n = [5, 4, 3][ci];
    for (let k = 0; k < n; k++) {
      const col = [P.mustard, P.sky, P.coral, P.pink][Math.floor(rnd() * 4)];
      const note = B(g, 0.4, 0.36, 0.03, col, cx - 0.38 + (k % 2) * 0.76, 1.8 - Math.floor(k / 2) * 0.46, 0.075, 0.02);
      note.rotation.z = (rnd() - 0.5) * 0.12;
    }
  });
  return g;
}

/* =========================================================
   5. CHARACTERS
   ========================================================= */
const hairGeo = new THREE.SphereGeometry(0.33, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.52);

function person(o) {
  const g = new THREE.Group();
  const seated = !!o.seated, sy = seated ? 0.54 : 0;
  const pants = o.pants || P.indigo, skin = o.skin || P.skin, hair = o.hair || P.deep;
  const rig = { seated, robot: false };
  if (seated) {
    B(g, 0.48, 0.17, 0.52, pants, 0, sy, 0.15, 0.07);
    B(g, 0.19, 0.5, 0.18, pants, -0.12, 0.04, 0.36, 0.07);
    B(g, 0.19, 0.5, 0.18, pants, 0.12, 0.04, 0.36, 0.07);
    B(g, 0.2, 0.08, 0.28, P.indigo, -0.12, 0, 0.42, 0.03);
    B(g, 0.2, 0.08, 0.28, P.indigo, 0.12, 0, 0.42, 0.03);
  } else {
    [['legL', -0.13], ['legR', 0.13]].forEach(([k, x]) => {
      const l = rig[k] = new THREE.Group(); l.position.set(x, 0.5, 0); g.add(l);
      B(l, 0.21, 0.5, 0.24, pants, 0, -0.5, 0, 0.08);
    });
  }
  const tb = seated ? sy + 0.1 : 0.44;
  const up = rig.upper = new THREE.Group(); up.position.y = tb; rig.upperY = tb; g.add(up);
  B(up, 0.6, 0.64, 0.44, o.body, 0, 0, 0, 0.2);
  [['armL', -0.38], ['armR', 0.38]].forEach(([k, x]) => {
    const a = rig[k] = new THREE.Group(); a.position.set(x, 0.56, 0.02); up.add(a);
    B(a, 0.15, 0.46, 0.17, o.body, 0, -0.46, 0, 0.07);
    S(a, 0.075, skin, 0, -0.48, 0.01, 12);
  });
  const hd = rig.head = new THREE.Group(); hd.position.y = 0.95; up.add(hd);
  S(hd, 0.31, skin, 0, 0, 0);
  const h = shadowed(new THREE.Mesh(hairGeo, M(hair)));
  h.position.set(0, 0.02, -0.02); h.rotation.x = -0.32; hd.add(h);
  if (o.bun) S(hd, 0.13, hair, 0, 0.33, -0.1, 14);
  S(hd, 0.038, P.indigo, -0.1, 0.01, 0.285, 10);
  S(hd, 0.038, P.indigo, 0.1, 0.01, 0.285, 10);
  const ck1 = S(hd, 0.05, '#ff9fc4', -0.18, -0.08, 0.245, 10); ck1.scale.z = 0.4;
  const ck2 = S(hd, 0.05, '#ff9fc4', 0.18, -0.08, 0.245, 10); ck2.scale.z = 0.4;
  g.userData.headY = tb + 0.95;
  g.userData.rig = rig;
  return g;
}

const PULSE = [];
function robot(o = {}) {
  const g = new THREE.Group();
  const sy = o.seated ? 0.54 : 0.14;
  const body = o.body || P.white, trim = o.trim || P.violet, eye = o.eye || P.sky;
  const rig = { seated: !!o.seated, robot: true };
  if (!o.seated) {
    C(g, 0.28, 0.34, 0.12, trim, 0, 0, 0, 20);
    glow(g, 0, 0.08, 0, 0.9, eye, 0.35);
  }
  const up = rig.upper = new THREE.Group(); up.position.y = sy; rig.upperY = sy; g.add(up);
  B(up, 0.6, 0.56, 0.46, body, 0, 0, 0, 0.2);
  B(up, 0.2, 0.12, 0.03, M(eye, { emissive: eye, ei: 1.2 }), 0, 0.26, 0.23, 0.03);
  [['armL', -0.38], ['armR', 0.38]].forEach(([k, x]) => {
    const a = rig[k] = new THREE.Group(); a.position.set(x, 0.48, 0); up.add(a);
    B(a, 0.13, 0.38, 0.15, trim, 0, -0.38, 0, 0.06);
  });
  C(up, 0.09, 0.09, 0.1, P.indigo, 0, 0.54, 0, 12);
  const hd = rig.head = new THREE.Group(); hd.position.y = 0.62; up.add(hd);
  B(hd, 0.68, 0.52, 0.52, body, 0, 0, 0, 0.2);
  B(hd, 0.56, 0.28, 0.04, P.indigo, 0, 0.12, 0.25, 0.1);
  const eyeMat = M(eye, { emissive: eye, ei: 1.6 });
  const e1 = S(hd, 0.055, eyeMat, -0.12, 0.26, 0.27, 12); e1.scale.z = 0.35;
  const e2 = S(hd, 0.055, eyeMat, 0.12, 0.26, 0.27, 12); e2.scale.z = 0.35;
  [-1, 1].forEach(sgn => {
    const ear = C(hd, 0.08, 0.08, 0.06, trim, 0, 0, 0, 14);
    ear.rotation.z = Math.PI / 2; ear.position.set(sgn * 0.36, 0.26, 0);
  });
  C(hd, 0.02, 0.02, 0.24, P.indigo, 0, 0.51, 0, 8);
  const ball = S(hd, 0.075, M(o.antenna || P.mustard, { emissive: o.antenna || P.mustard, ei: 1.3, unique: true }), 0, 0.81, 0, 14);
  PULSE.push(ball.material);
  g.userData.headY = sy + 0.88;
  g.userData.rig = rig;
  return g;
}

/* =========================================================
   6. BUILDING — 3 real stacked floors
   Footprint x ∈ [-13, 13], z ∈ [-10, 10]. Floor-to-floor 4.8 m.
   Every floor shares one circulation plan:
     · H corridor  z ∈ [-5.6, -4.0]  (full width)
     · V corridor  x ∈ [-1, 1], z ∈ [-4, 10]  (to the front)
     · Core (back-left): stairs + elevator lobby
     · Back-right glass room, back-middle utility door
     · Front-left / front-right open zones
   ========================================================= */
const FH = 4.8, WALL_H = 4.2;
const LEVELS = [0, FH, FH * 2];
const FLOOR_INFO = [
  { name: '1F', title: '1F · LOBBY & CAFÉ' },
  { name: '2F', title: '2F · AI LAB' },
  { name: '3F', title: '3F · WORK' }
];
// stair openings: A (1F→2F) along the back wall, B (2F→3F) just in front of it
const STAIR_X0 = -11.5, STAIR_X1 = -5.5;
const HOLE_A = { x0: STAIR_X0, x1: STAIR_X1, z0: -9.75, z1: -8.2 };
const HOLE_B = { x0: STAIR_X0, x1: STAIR_X1, z0: -8.1, z1: -6.55 };

const FLOORS = [];

function rectMinus(r, h) {
  if (!h) return [r];
  return [
    { x0: r.x0, x1: r.x1, z0: h.z1, z1: r.z1 },
    { x0: r.x0, x1: r.x1, z0: r.z0, z1: h.z0 },
    { x0: r.x0, x1: h.x0, z0: h.z0, z1: h.z1 },
    { x0: h.x1, x1: r.x1, z0: h.z0, z1: h.z1 }
  ].filter(q => q.x1 - q.x0 > 0.01 && q.z1 - q.z0 > 0.01);
}
function rectMinusMany(r, holes) {
  let pieces = [r];
  holes.forEach(h => {
    pieces = pieces.flatMap(p => {
      const c = { x0: Math.max(p.x0, h.x0), x1: Math.min(p.x1, h.x1), z0: Math.max(p.z0, h.z0), z1: Math.min(p.z1, h.z1) };
      return c.x1 - c.x0 > 0.01 && c.z1 - c.z0 > 0.01 ? rectMinus(p, c) : [p];
    });
  });
  return pieces;
}
function slab(g, holes) {
  rectMinusMany({ x0: -13.4, x1: 13.4, z0: -10.4, z1: 10.4 }, holes).forEach(q =>
    B(g, q.x1 - q.x0, 0.5, q.z1 - q.z0, P.deep, (q.x0 + q.x1) / 2, -0.6, (q.z0 + q.z1) / 2, 0.04));
  rectMinusMany({ x0: -13, x1: 13, z0: -10, z1: 10 }, holes).forEach(q =>
    B(g, q.x1 - q.x0, 0.1, q.z1 - q.z0, P.floor, (q.x0 + q.x1) / 2, -0.1, (q.z0 + q.z1) / 2, 0.02));
}
function leftWindow(g, z) {
  B(g, 0.14, 2.1, 2.9, P.white, -12.68, 1.15, z, 0.05);
  B(g, 0.06, 1.8, 2.55, M(P.sky, { emissive: P.sky, ei: 0.55 }), -12.6, 1.3, z, 0.02).castShadow = false;
  B(g, 0.09, 1.8, 0.08, P.white, -12.58, 1.3, z, 0.02);
}
/** Straight stair of 16 risers × 0.3 m, run 6 m along x. dir = +1 climbs toward +x. */
function stairs(g, xStart, dir, z0, z1) {
  const zc = (z0 + z1) / 2, w = (z1 - z0) - 0.06;
  for (let k = 0; k < 16; k++) {
    B(g, 0.39, (k + 1) * 0.3, w, k % 2 ? P.lilac : '#d8cafc', xStart + dir * (k + 0.5) * 0.375, 0, zc, 0.03);
    B(g, 0.39, 0.04, w, P.mustard, xStart + dir * (k + 0.95) * 0.375 - dir * 0.17, (k + 1) * 0.3 - 0.02, zc, 0.01);
  }
  // sloped handrail on the open (front) side
  const zr = z1 + 0.02, a = Math.atan2(FH, 6), len = Math.hypot(6, FH);
  const rail = B(g, len, 0.07, 0.07, P.violet, xStart + dir * 3, FH / 2 + 0.95, zr, 0.03);
  rail.rotation.z = dir > 0 ? a : -a;
  [1, 8, 15].forEach(k => B(g, 0.06, 1.0, 0.06, P.violet, xStart + dir * (k + 0.5) * 0.375, (k + 1) * 0.3, zr, 0.02));
}

function buildFloor(i) {
  const g = new THREE.Group(); g.position.y = LEVELS[i]; scene.add(g);
  g.updateMatrixWorld(true);
  const F = { index: i, group: g, info: FLOOR_INFO[i] };

  const SHAFT_HOLE = { x0: -3.95, x1: -1.25, z0: -10.4, z1: -7.55 };
  slab(g, i === 1 ? [HOLE_A, SHAFT_HOLE] : i === 2 ? [HOLE_B, SHAFT_HOLE] : []);
  wallLabel(g, F.info.title, 0.42, 8.2, -0.35, 10.41, 0, { bg: P.mustard, fg: P.indigo, size: 90 });

  // cutaway walls (back + left) and section caps
  B(g, 26.5, WALL_H, 0.5, P.wall, 0, 0, -10, 0.08);
  B(g, 0.5, WALL_H, 20.5, P.wall, -13, 0, 0, 0.08);
  B(g, 26.62, 0.16, 0.62, P.cap, 0, WALL_H - 0.02, -10, 0.06);
  B(g, 0.62, 0.16, 20.62, P.cap, -13, WALL_H - 0.02, 0, 0.06);
  B(g, 26, 0.18, 0.06, P.purple, 0, 0, -9.73, 0.02);
  B(g, 0.06, 0.18, 20, P.purple, -12.73, 0, 0, 0.02);

  // circulation floor strips
  B(g, 25.4, 0.02, 1.6, P.path, 0, 0, -4.8, 0.01);
  B(g, 2.0, 0.02, 14, P.path, 0, 0, 3.0, 0.01);
  B(g, 4.2, 0.02, 1.95, P.path, -3.3, 0, -6.575, 0.01);        // lift lobby (kept out of the shaft)
  B(g, 1.45, 0.02, 2.15, P.path, -4.675, 0, -8.625, 0.01);


  // back-middle utility door
  B(g, 1.2, 2.45, 0.1, P.coral, 0.25, 0, -9.7, 0.05);
  S(g, 0.06, P.indigo, 0.65, 1.15, -9.6, 10);

  // open edges: low glass balustrade (1F: tall shop-front with entrance gap)
  if (i === 0) {
    railing(g, -12.75, 9.95, -1.3, 9.95, 3.4, FACADE_GLASS);
    railing(g, 1.3, 9.95, 12.95, 9.95, 3.4, FACADE_GLASS);
    railing(g, 12.95, -9.75, 12.95, 9.95, 3.4, FACADE_GLASS);
    B(g, 2.8, 0.26, 0.16, P.coral, 0, 3.15, 9.95, 0.05);
  } else {
    railing(g, -12.75, 9.95, 12.95, 9.95, 1.05);
    railing(g, 12.95, -9.75, 12.95, 9.95, 1.05);
  }

  // opaque shell pieces → used to hide status tags that sit behind slabs/walls
  F.occluders = g.children.filter(o => o.isMesh && !o.material.transparent);

  // interior fill light (keeps lower floors readable under the slabs)
  const pl = new THREE.PointLight(lin('#efe4ff'), 0.55, 30, 1.6);
  pl.position.set(0, 3.6, 0); g.add(pl); F.light = pl;

  // ghost outline shown when this floor is hidden
  const ghost = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(26.8, FH, 20.8)),
    new THREE.LineBasicMaterial({ color: '#6b4fd0', transparent: true, opacity: 0.55 }));
  ghost.position.set(0, LEVELS[i] + FH / 2 - 0.6, 0); ghost.visible = false; scene.add(ghost);
  F.ghost = ghost;

  FLOORS.push(F);
  return F;
}
[0, 1, 2].forEach(buildFloor);
const G1 = FLOORS[0].group, G2 = FLOORS[1].group, G3 = FLOORS[2].group;

// stairs + railings around the openings
stairs(G1, STAIR_X1, -1, HOLE_A.z0, HOLE_A.z1);           // 1F → 2F (climbs toward -x)
stairs(G2, STAIR_X0, +1, HOLE_B.z0, HOLE_B.z1);           // 2F → 3F (climbs toward +x)
railing(G2, STAIR_X0, HOLE_A.z1, STAIR_X1, HOLE_A.z1);
railing(G2, STAIR_X1, HOLE_A.z0, STAIR_X1, HOLE_A.z1);
railing(G3, STAIR_X0, HOLE_B.z1, STAIR_X1, HOLE_B.z1);
railing(G3, STAIR_X0, HOLE_B.z0, STAIR_X1, HOLE_B.z0);
railing(G3, STAIR_X0, HOLE_B.z0, STAIR_X0, HOLE_B.z1);
B(G2, 1.25, 0.02, 3.2, P.path, -12.12, 0, -8.15, 0.01);   // 2F landing
B(G2, 7.2, 0.02, 0.85, P.path, -9.15, 0, -6.0, 0.01);     // landing → H corridor
[[-10.2, -9.0], [-8.4, -9.0], [-6.6, -9.0]].forEach(([x, z]) => plant(G3, x, z, 0.7, P.sky));  // 3F fenced strip

/* =========================================================
   6b. ELEVATOR — glass shaft through all three floors, a real moving cabin,
   sliding landing + cabin doors, floor indicators and call buttons.
   ========================================================= */
const SHAFT = { x0: -3.95, x1: -1.25, z0: -9.75, z1: -7.55, cx: -2.6, doorW: 1.4 };
const LIFT_DOORS = [], LIFT_IND = [], LIFT_CALL = [];
function indicatorTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 96;
  const tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding;
  return { ctx: c.getContext('2d'), tex };
}
function drawIndicator(k, floorNo, dir) {
  const { ctx, tex } = LIFT_IND[k];
  ctx.clearRect(0, 0, 256, 96);
  ctx.fillStyle = '#2e2470'; roundRectPath(ctx, 0, 0, 256, 96, 26); ctx.fill();
  ctx.fillStyle = '#f2b632'; ctx.font = `700 62px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`${floorNo}F`, 152, 52);
  if (dir) {
    const cx = 62, cy = 48; ctx.beginPath();
    if (dir > 0) { ctx.moveTo(cx, cy - 20); ctx.lineTo(cx + 18, cy + 14); ctx.lineTo(cx - 18, cy + 14); }
    else { ctx.moveTo(cx, cy + 20); ctx.lineTo(cx + 18, cy - 14); ctx.lineTo(cx - 18, cy - 14); }
    ctx.closePath(); ctx.fillStyle = '#5cc4f2'; ctx.fill();
  } else { ctx.fillStyle = '#5cc4f2'; ctx.beginPath(); ctx.arc(62, 48, 9, 0, Math.PI * 2); ctx.fill(); }
  tex.needsUpdate = true;
}
function buildShaft(F, i) {
  const g = F.group, S_ = SHAFT, w = S_.x1 - S_.x0, dz = S_.z1 - S_.z0, zc = (S_.z0 + S_.z1) / 2;
  const yb = i > 0 ? -0.6 : 0, h = WALL_H - yb;
  // side glass + front posts
  B(g, 0.05, h, dz, GLASS, S_.x0, yb, zc, 0.02).castShadow = false;
  B(g, 0.05, h, dz, GLASS, S_.x1, yb, zc, 0.02).castShadow = false;
  [S_.x0, S_.x1].forEach(x => B(g, 0.14, h, 0.14, P.violet, x, yb, S_.z1, 0.04));
  // portal: jambs, header with indicator, glass transom
  const dL = S_.cx - S_.doorW / 2, dR = S_.cx + S_.doorW / 2;
  B(g, dL - S_.x0, 2.6, 0.12, P.lavender, (S_.x0 + dL) / 2, 0, S_.z1, 0.03);
  B(g, S_.x1 - dR, 2.6, 0.12, P.lavender, (dR + S_.x1) / 2, 0, S_.z1, 0.03);
  B(g, w, 0.55, 0.16, P.violet, S_.cx, 2.6, S_.z1, 0.05);
  B(g, w, WALL_H - 3.15, 0.05, GLASS, S_.cx, 3.15, S_.z1, 0.02).castShadow = false;
  if (i > 0) B(g, w, 0.6, 0.05, GLASS, S_.cx, -0.6, S_.z1, 0.02).castShadow = false;
  LIFT_IND[i] = indicatorTexture(); drawIndicator(i, 1, 0);
  const ind = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.23), new THREE.MeshBasicMaterial({ map: LIFT_IND[i].tex, toneMapped: false, transparent: true }));
  ind.position.set(S_.cx + 0.35, 2.875, S_.z1 + 0.085); g.add(ind);
  wallLabel(g, `LIFT · ${F.info.name}`, 0.2, S_.cx - 0.6, 2.875, S_.z1 + 0.085, 0, { fg: '#ffffff', size: 70 });
  // call button on the right jamb
  B(g, 0.2, 0.36, 0.04, P.white, -1.58, 1.0, S_.z1 + 0.08, 0.02);
  const cm = M(P.mustard, { emissive: P.mustard, ei: 0.12, unique: true });
  B(g, 0.11, 0.11, 0.03, cm, -1.58, 1.12, S_.z1 + 0.11, 0.03);
  LIFT_CALL[i] = cm;
  // landing doors (slide behind the jambs)
  const l = B(g, 0.72, 2.55, 0.06, P.lilac, S_.cx - 0.35, 0, S_.z1 - 0.1, 0.02);
  const r = B(g, 0.72, 2.55, 0.06, P.lilac, S_.cx + 0.35, 0, S_.z1 - 0.1, 0.02);
  LIFT_DOORS[i] = { l, r };
  if (i === 2) {                                                     // machine room cap
    B(g, w + 0.24, 0.3, dz + 0.24, P.cap, S_.cx, WALL_H, zc, 0.06);
    B(g, 1.2, 0.5, 1.0, P.indigo, S_.cx, WALL_H + 0.3, zc, 0.08);
  }
  wallLabel(g, F.info.name, 0.6, -4.7, 3.3, -9.73, 0, { bg: P.indigo, fg: P.mustard, size: 90 });
}
FLOORS.forEach((F, i) => buildShaft(F, i));

// cabin (world space)
const cabin = new THREE.Group(); cabin.position.set(SHAFT.cx, 0, -8.68); scene.add(cabin);
{
  B(cabin, 2.6, 0.3, 2.05, P.indigo, 0, -0.42, 0, 0.06);
  B(cabin, 2.5, 0.12, 1.95, P.white, 0, -0.12, 0, 0.03);
  B(cabin, 1.6, 0.02, 1.1, '#efe8ff', 0, 0, -0.05, 0.01);
  B(cabin, 2.5, 2.8, 0.08, P.lavender, 0, 0, -0.94, 0.03);                // back wall
  B(cabin, 0.08, 2.8, 1.95, P.lavender, -1.21, 0, 0, 0.03);               // left wall (panel side)
  B(cabin, 0.06, 2.8, 1.95, GLASS, 1.22, 0, 0, 0.02).castShadow = false;  // right side: glass
  B(cabin, 2.5, 0.12, 1.95, P.violet, 0, 2.8, 0, 0.04);                   // ceiling
  B(cabin, 1.5, 0.02, 0.9, M('#fff6dc', { emissive: '#fff3c4', ei: 1.1 }), 0, 2.77, 0, 0.01).castShadow = false;
  B(cabin, 2.1, 0.05, 0.05, P.mustard, 0, 0.95, -0.86, 0.02);             // handrail
  B(cabin, 1.0, 1.6, 0.02, M('#cfe6ff', { rough: 0.2 }), 0, 0.9, -0.89, 0.01);  // mirror
  B(cabin, 2.5, 0.3, 0.1, P.violet, 0, 2.5, 0.92, 0.03);                  // door header
}
const cabinDoorL = B(cabin, 0.72, 2.5, 0.05, P.lilac, -0.35, 0, 0.94, 0.02);
const cabinDoorR = B(cabin, 0.72, 2.5, 0.05, P.lilac, 0.35, 0, 0.94, 0.02);
const CABIN_BTN = [];
B(cabin, 0.04, 0.78, 0.32, P.indigo, -1.16, 0.75, 0.55, 0.02);
[0, 1, 2].forEach(k => {
  const mm = M(P.sky, { emissive: P.sky, ei: 0.15, unique: true });
  const b = B(cabin, 0.03, 0.14, 0.14, mm, -1.13, 0.86 + k * 0.2, 0.55, 0.03); b.castShadow = false;
  CABIN_BTN[k] = mm;
  wallLabel(cabin, String(k + 1), 0.1, -1.11, 0.93 + k * 0.2, 0.42, Math.PI / 2, { fg: '#ffffff', size: 70 });
});
const cabinLight = new THREE.PointLight(lin('#fff1d6'), 0.5, 4, 2); cabinLight.position.set(0, 2.4, 0); cabin.add(cabinLight);
const liftCable = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1, 6), M(P.indigo));
scene.add(liftCable);

const LIFT = { y: 0, floor: 0, target: null, queue: [], state: 'idle', door: 0, timer: 0, vel: 0, dir: 0, hold: false, _ind: '' };
function liftCall(f) {
  if (LIFT.state === 'open' && LIFT.floor === f) { LIFT.timer = Math.max(LIFT.timer, 3); return; }
  if (LIFT.state === 'closing' && LIFT.floor === f) { LIFT.state = 'opening'; return; }
  if (!LIFT.queue.includes(f)) LIFT.queue.push(f);
}
function updateLift(dt) {
  const L_ = LIFT;
  switch (L_.state) {
    case 'idle':
      if (L_.queue.length) {
        const n = L_.queue[0];
        if (n === L_.floor) { L_.queue.shift(); L_.state = 'opening'; }
        else { L_.target = n; L_.state = 'moving'; L_.dir = Math.sign(LEVELS[n] - L_.y); }
      }
      break;
    case 'opening':
      L_.door = Math.min(1, L_.door + dt / 0.8);
      if (L_.door >= 1) { L_.state = 'open'; L_.timer = 5.5; }
      break;
    case 'open':
      if (!L_.hold) L_.timer -= dt;
      if (L_.timer <= 0) L_.state = 'closing';
      break;
    case 'closing':
      if (L_.hold) { L_.state = 'opening'; break; }
      L_.door = Math.max(0, L_.door - dt / 0.8);
      if (L_.door <= 0) L_.state = 'idle';
      break;
    case 'moving': {
      const ty = LEVELS[L_.target], d = ty - L_.y, acc = 1.8, vmax = 2.4;
      if (Math.abs(d) <= (L_.vel * L_.vel) / (2 * acc) + 0.02) L_.vel = Math.max(0.3, L_.vel - acc * dt);
      else L_.vel = Math.min(vmax, L_.vel + acc * dt);
      L_.y += Math.sign(d) * Math.min(Math.abs(d), L_.vel * dt);
      if (Math.abs(ty - L_.y) < 1e-3) {
        L_.y = ty; L_.vel = 0; L_.floor = L_.target; L_.target = null; L_.dir = 0;
        L_.queue = L_.queue.filter(q => q !== L_.floor); L_.state = 'opening';
      }
    }
  }
  // visuals
  cabin.position.y = L_.y;
  const o = L_.door * 0.68;
  cabinDoorL.position.x = -0.35 - o; cabinDoorR.position.x = 0.35 + o;
  LIFT_DOORS.forEach((d, i) => {
    const op = L_.state !== 'moving' && L_.floor === i ? o : 0;
    d.l.position.x = SHAFT.cx - 0.35 - op; d.r.position.x = SHAFT.cx + 0.35 + op;
  });
  const topY = LEVELS[2] + WALL_H, cy = L_.y + 2.95;
  liftCable.scale.y = Math.max(0.01, topY - cy); liftCable.position.set(SHAFT.cx, (topY + cy) / 2, -8.68);
  const cf = THREE.MathUtils.clamp(Math.round(L_.y / FH), 0, 2);
  cabin.visible = liftCable.visible = FLOORS[cf].group.visible;
  const indKey = `${cf}|${L_.state === 'moving' ? L_.dir : 0}`;
  if (indKey !== L_._ind) { L_._ind = indKey; LIFT_IND.forEach((_, k) => drawIndicator(k, cf + 1, L_.state === 'moving' ? L_.dir : 0)); }
  LIFT_CALL.forEach((mm, i) => { mm.emissiveIntensity = L_.queue.includes(i) ? 1.8 : 0.12; });
  CABIN_BTN.forEach((mm, i) => { mm.emissiveIntensity = L_.queue.includes(i) || L_.target === i ? 1.8 : 0.15; });
}

/* =========================================================
   7. OUTSIDE
   ========================================================= */
const outside = new THREE.Group(); scene.add(outside);
B(outside, 46, 0.5, 40, '#d9ccf8', 0, -1.1, 0, 0.3);
B(outside, 2.8, 0.55, 0.6, P.white, 0, -0.6, 10.7, 0.04);
B(outside, 2.8, 0.28, 0.6, P.white, 0, -0.6, 11.3, 0.04);
B(outside, 4, 0.03, 7.5, P.white, 0, -0.6, 15.3, 0.02);
B(outside, 3.6, 0.16, 1.5, P.coral, 0, 3.3, 11.1, 0.06);
B(outside, 0.06, 0.75, 0.06, P.indigo, -1.6, 3.45, 11.7, 0.02);
B(outside, 0.06, 0.75, 0.06, P.indigo, 1.6, 3.45, 11.7, 0.02);
wallLabel(outside, 'TEAM HQ', 0.5, 0, 3.38, 11.86, 0, { fg: '#ffffff', size: 100 });
[[16.5, 12.5, 1.0], [17.5, 4.0, 1.2], [17.2, -6.5, 0.9], [-7.5, 14.5, 1.1], [7.5, 15.2, 0.85],
 [-16.8, 12.6, 0.9], [17.8, -14.2, 1.0]].forEach(([x, z, s]) => tree(outside, x, -0.6, z, s));
[[-4.2, 11.6], [4.2, 11.6], [-10, 11.4], [10.5, 11.5]].forEach(([x, z]) => {
  S(outside, 0.55, M('#b77ae8', { flat: true }), x, -0.3, z, 9);
  S(outside, 0.42, M('#8f6cf0', { flat: true }), x + 0.55, -0.35, z + 0.1, 8);
});

/* =========================================================
   8. ZONES PER FLOOR
   ========================================================= */

// ---------- 1F · LOBBY & CAFÉ ----------
{
  const g = G1;
  floorLabel(g, 'LOBBY', 0.62, -7.0, 9.35, { fg: P.violet, opacity: 0.85 });
  floorLabel(g, 'CAFÉ', 0.62, 7.0, 9.35, { fg: P.violet, opacity: 0.85 });
  wallLabel(g, 'WELCOME', 0.7, -12.72, 2.6, 2.6, Math.PI / 2, { fg: P.magenta, size: 110 });
  leftWindow(g, 7.4);
  // reception (faces the V corridor)
  blob(g, 1.8, 4.2, -3.0, 3.5);
  B(g, 0.9, 1.0, 3.4, P.white, -3.0, 0, 3.5, 0.12);
  B(g, 0.92, 0.26, 3.42, P.magenta, -3.0, 0.55, 3.5, 0.06);
  B(g, 1.15, 0.08, 3.6, P.white, -3.05, 1.0, 3.5, 0.04);
  wallLabel(g, 'HELLO', 0.24, -2.53, 0.68, 3.5, Math.PI / 2, { fg: '#ffffff', size: 80 });
  B(g, 0.06, 0.4, 0.6, P.indigo, -3.35, 1.08, 3.0, 0.02);
  // waiting area
  rug(g, 5.4, 3.9, -8.4, 6.4, '#f7b9b2');
  sofa(g, -8.4, 5.4, 0);
  coffeeTable(g, -8.4, 7.2);
  armchair(g, -11.1, 7.2, Math.PI / 2);
  plant(g, -12.1, 9.2, 1.0, P.violet);
  plant(g, -5.5, 5.0, 0.8, P.mustard);
  // lockers on the left wall
  blob(g, 1.0, 4.4, -12.4, -1.6);
  B(g, 0.6, 2.2, 4.0, P.lavender, -12.4, 0, -1.6, 0.06);
  for (let k = 0; k < 5; k++) B(g, 0.02, 2.0, 0.03, P.violet, -12.09, 0.1, -3.2 + k * 0.8, 0.01);
  // café counter
  blob(g, 6.0, 2.0, 8.0, -2.4);
  B(g, 5.0, 0.9, 1.0, P.violet, 8.0, 0, -2.4, 0.08);
  B(g, 5.2, 0.1, 1.15, P.white, 8.0, 0.9, -2.4, 0.04);
  B(g, 0.5, 0.62, 0.45, P.indigo, 6.2, 1.0, -2.6, 0.08);
  B(g, 0.22, 0.08, 0.02, M(P.mustard, { emissive: P.mustard, ei: 1.3 }), 6.2, 1.38, -2.365, 0.01);
  C(g, 0.06, 0.05, 0.12, P.coral, 6.7, 1.0, -2.2, 14);
  C(g, 0.06, 0.05, 0.12, P.sky, 6.9, 1.0, -2.45, 14);
  C(g, 0.28, 0.18, 0.12, P.sky, 9.6, 1.0, -2.4, 20);
  S(g, 0.09, P.mustard, 9.55, 1.17, -2.45, 12); S(g, 0.09, P.coral, 9.68, 1.17, -2.33, 12);
  [6.2, 7.4, 8.6, 9.8].forEach(x => {
    C(g, 0.22, 0.22, 0.04, P.indigo, x, 0, -1.3, 18);
    C(g, 0.045, 0.045, 0.7, P.indigo, x, 0.03, -1.3, 10);
    C(g, 0.26, 0.26, 0.1, P.mustard, x, 0.72, -1.3, 20);
  });
  blob(g, 1.4, 1.3, 12.0, -2.4);
  B(g, 1.0, 2.1, 0.9, P.sky, 12.0, 0, -2.4, 0.14);
  B(g, 0.06, 0.6, 0.06, P.white, 11.55, 1.2, -1.93, 0.02);
  blob(g, 0.9, 0.9, 2.2, -2.9);
  B(g, 0.5, 1.0, 0.5, P.white, 2.2, 0, -2.9, 0.08);
  C(g, 0.2, 0.2, 0.5, M(P.sky, { opacity: 0.6, rough: 0.2 }), 2.2, 1.0, -2.9, 18);
  // café tables
  [[4.5, 3.0], [9.0, 3.0], [4.5, 7.2], [9.0, 7.2]].forEach(([x, z]) => {
    blob(g, 3.2, 1.6, x, z);
    C(g, 0.1, 0.25, 0.72, P.indigo, x, 0, z, 14);
    C(g, 0.6, 0.6, 0.07, P.white, x, 0.72, z, 28);
    C(g, 0.05, 0.04, 0.1, [P.coral, P.sky, P.mustard][Math.floor(rnd() * 3)], x + 0.15, 0.79, z, 12);
    chair(g, x - 1.0, z, -Math.PI / 2, P.coral);
    chair(g, x + 1.0, z, Math.PI / 2, P.coral);
  });
  plant(g, 12.1, 9.2, 1.05, P.magenta);
  // back-right: print & mail room
  glassRoom(g, 1.6, 12.75, -9.75, -5.6, 2.0, 3.4, 'PRINT & MAIL', P.lilac);
  [4.2, 5.8].forEach(x => {
    blob(g, 1.3, 1.3, x, -9.1);
    B(g, 0.9, 0.85, 0.75, P.lilac, x, 0, -9.2, 0.08);
    B(g, 0.86, 0.12, 0.7, P.indigo, x, 0.85, -9.2, 0.04);
    B(g, 0.5, 0.02, 0.4, P.white, x, 0.97, -9.15, 0.005);
  });
  B(g, 3.0, 2.0, 0.6, P.violet, 9.0, 0, -9.35, 0.06);
  for (let k = 0; k < 8; k++) B(g, 0.6, 0.35, 0.45, [P.mustard, P.coral, P.white, P.sky][k % 4],
    7.95 + (k % 4) * 0.7, 0.15 + Math.floor(k / 4) * 0.95, -9.25, 0.04);
  B(g, 1.4, 2.2, 0.5, P.lavender, 11.7, 0, -9.4, 0.05);
  // 1F: decorative planter strip beside the stair
  B(g, 5.6, 0.45, 0.9, P.violet, -8.5, 0, -7.3, 0.08);
  [-10.6, -8.5, -6.4].forEach(x => plant(g, x, -7.3, 0.6, P.mustard, 0.45));
}

// ---------- 2F · AI LAB ----------
{
  const g = G2;
  floorLabel(g, 'AI LAB', 0.62, -7.0, 9.35, { fg: P.violet, opacity: 0.85 });
  floorLabel(g, 'STUDIO', 0.62, 7.0, 9.35, { fg: P.violet, opacity: 0.85 });
  rug(g, 11.4, 12.0, -6.9, 2.4, '#b7c3f7');
  [0.5, 4.0, 7.4].forEach(z => leftWindow(g, z));
  pod(g, 1, 'A1', 0.6, -0.4, { zone: 'ailab', chair: P.violet,
    screens: [P.sky, P.magenta, P.sky, P.magenta, P.sky, P.pink] });
  // charging docks
  [-8.1, -5.6].forEach(x => {
    C(g, 0.95, 1.0, 0.08, P.indigo, x, 0, 5.6, 32);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.04, 8, 48), M(P.sky, { emissive: P.sky, ei: 1.2 }));
    ring.rotation.x = -Math.PI / 2; ring.position.set(x, 0.1, 5.6); g.add(ring);
    glow(g, x, 0.3, 5.6, 2.6, P.sky, 0.25);
  });
  floorLabel(g, 'DOCK', 0.36, -6.85, 7.05, { fg: P.indigo, opacity: 0.7 });
  // studio (front-right)
  teamBoard(g, 7.5, -2.7, 0);
  blob(g, 3.0, 1.6, 7.5, 1.6);
  B(g, 0.12, 1.0, 0.12, P.indigo, 6.5, 0, 1.6, 0.03);
  B(g, 0.12, 1.0, 0.12, P.indigo, 8.5, 0, 1.6, 0.03);
  B(g, 2.4, 0.08, 1.0, P.white, 7.5, 1.0, 1.6, 0.04);
  B(g, 0.5, 0.03, 0.35, P.coral, 7.1, 1.08, 1.5, 0.01);
  desk(g, 1, 'H0', 4.0, 6.4, Math.PI, { zone: 'studio', chair: P.coral, lamp: true });
  desk(g, 1, 'H1', 6.1, 6.4, Math.PI, { zone: 'studio', chair: P.coral, screen: P.pink });
  [[10.6, 6.8, P.mustard], [11.8, 8.0, P.coral]].forEach(([x, z, c]) => {
    blob(g, 1.4, 1.4, x, z);
    const bb = S(g, 0.6, c, x, 0.38, z, 18); bb.scale.y = 0.65;
  });
  plant(g, 12.1, 4.4, 1.0, P.sky);
  plant(g, 2.4, 9.1, 0.9, P.magenta);
  // back-right: server room
  glassRoom(g, 1.6, 12.75, -9.75, -5.6, 2.0, 3.4, 'SERVER', '#b7c3f7');
  for (let k = 0; k < 7; k++) serverRack(g, 5.0 + k * 1.1, -9.25, k);
  blob(g, 1.8, 1.3, 3.3, -9.1);
  B(g, 1.4, 2.2, 0.9, P.lilac, 3.3, 0, -9.25, 0.08);
  for (let k = 0; k < 4; k++) B(g, 1.1, 0.06, 0.02, P.violet, 3.3, 0.6 + k * 0.35, -8.79, 0.01);
  glow(g, 8.3, 1.6, -8.3, 5.0, '#7fb8ff', 0.16);
}

// ---------- 3F · WORK ----------
{
  const g = G3;
  floorLabel(g, 'WORK ZONE', 0.62, -7.0, 9.35, { fg: P.violet, opacity: 0.85 });
  floorLabel(g, 'LOUNGE', 0.62, 7.0, 9.35, { fg: P.violet, opacity: 0.85 });
  [0.5, 4.0, 7.4].forEach(z => leftWindow(g, z));
  pod(g, 2, 'W1', 0.6, -0.4, { zone: 'work' });
  pod(g, 2, 'W2', 5.6, 4.6, { zone: 'work', screens: [P.sky, P.sky, P.sky, P.sky, P.mustard, P.sky] });
  DESK.W2b1.group.children.filter(c => c.isGroup).forEach(ch =>                // Mei's own chair: mustard
    ch.children.forEach(m => { if (m.material === M(P.magenta)) m.material = M(P.mustard); }));
  plant(g, -3.4, -2.6, 0.9, P.mustard);
  plant(g, -3.4, 8.8, 0.9, P.coral);
  // focus booths + bookshelf
  [3.2, 5.3, 7.4].forEach(x => booth(g, x, -2.85));
  blob(g, 1.0, 3.0, 12.2, -0.6);
  B(g, 0.5, 2.0, 2.6, P.violet, 12.25, 0, -0.6, 0.06);
  for (let s = 0; s < 3; s++) for (let k = 0; k < 7; k++) {
    B(g, 0.32, 0.38 + rnd() * 0.12, 0.2, [P.mustard, P.sky, P.coral, P.pink, P.white][(k + s) % 5],
      12.05, 0.2 + s * 0.62, -1.6 + k * 0.33, 0.02);
  }
  // lounge
  rug(g, 5.6, 3.8, 8.4, 5.8, '#f7b9b2');
  sofa(g, 8.6, 4.6, 0);
  coffeeTable(g, 8.6, 6.4);
  armchair(g, 5.6, 6.5, Math.PI / 2);
  floorLamp(g, 11.8, 4.2);
  plant(g, 12.1, 9.1, 1.05, P.magenta);
  plant(g, 2.4, 9.1, 0.8, P.sky);
  // back-right: meeting room
  glassRoom(g, 1.6, 12.75, -9.75, -5.6, 2.0, 3.4, 'MEETING', P.lilac);
  blob(g, 5.4, 3.0, 7.6, -7.7);
  B(g, 4.2, 0.1, 1.4, P.white, 7.6, 0.68, -7.7, 0.06);
  B(g, 0.5, 0.68, 0.5, P.violet, 6.4, 0, -7.7, 0.06);
  B(g, 0.5, 0.68, 0.5, P.violet, 8.8, 0, -7.7, 0.06);
  [6.3, 7.6, 8.9].forEach(x => { chair(g, x, -8.85, Math.PI, P.coral); chair(g, x, -6.55, 0, P.coral); });
  C(g, 0.06, 0.05, 0.12, P.mustard, 7.0, 0.78, -7.5, 14);
  B(g, 3.4, 1.8, 0.1, P.indigo, 7.6, 1.1, -9.69, 0.05);
  wallLabel(g, 'WEEKLY SYNC', 0.26, 7.6, 2.5, -9.62, 0, { fg: P.lilac, size: 90 });
  [[P.sky, 0.55], [P.mustard, 0.85], [P.coral, 0.4], [P.pink, 0.7]].forEach(([c, h], k) =>
    B(g, 0.36, h, 0.02, M(c, { emissive: c, ei: 1.1 }), 6.6 + k * 0.66, 1.35, -9.625, 0.01).castShadow = false);
}

/* =========================================================
   9. NAVIGATION GRAPH  (floor-local x/z; walkable network for later movement)
   ========================================================= */
const NAV = { nodes: {}, edges: [] };
const nid = (f, k) => `${f}:${k}`;
function navNodes(f, obj) {
  Object.entries(obj).forEach(([k, [x, z]]) => { NAV.nodes[nid(f, k)] = { id: nid(f, k), floor: f, x, z }; });
}
function navLink(a, b, type = 'walk') {
  const A = NAV.nodes[a], B_ = NAV.nodes[b];
  if (!A || !B_) { console.warn('NAV: missing node', a, b); return; }
  const cost = Math.hypot(A.x - B_.x, A.z - B_.z) + Math.abs(A.floor - B_.floor) * FH * 1.6;
  NAV.edges.push({ a, b, type, cost });
}
function navEdges(f, str) {
  str.trim().split(/\s+/).forEach(e => { const [a, b] = e.split('-'); navLink(nid(f, a), nid(f, b)); });
}
const COMMON_NODES = {
  h0: [-12, -4.8], h1: [-8.1, -4.8], h2: [-4.4, -4.8], h3: [0, -4.8], h4: [2.7, -4.8], h5: [7.6, -4.8], h6: [12, -4.8],
  v1: [0, -2.4], v2: [0, 2.6], v3: [0, 7.4], v4: [0, 9.4],
  cl: [-4.4, -7.2], lift: [-2.6, -6.6], util: [0.25, -8.6],
  rd: [2.7, -6.0], ri: [2.7, -7.6]
};
const COMMON_EDGES = 'h0-h1 h1-h2 h2-h3 h3-h4 h4-h5 h5-h6 h3-v1 v1-v2 v2-v3 v3-v4 h2-cl cl-lift h3-util h4-rd rd-ri';
/** Aisle grid for desk pods: rows at given z, columns at aisle/desk x. */
const AISLE_X = [-12, ...POD_X, -3.5];
function navPods(f, rowsZ) {
  const n = {};
  rowsZ.forEach((z, r) => AISLE_X.forEach((x, c) => { n[`a${r}${c}`] = [x, z]; }));
  navNodes(f, n);
  const e = [];
  rowsZ.forEach((z, r) => {
    for (let c = 0; c < AISLE_X.length - 1; c++) e.push(`a${r}${c}-a${r}${c + 1}`);
    if (r > 0) { e.push(`a${r - 1}0-a${r}0`); e.push(`a${r - 1}4-a${r}4`); }
  });
  e.push('a00-h0', 'a04-h2', 'a04-v1', 'a14-v2');
  if (rowsZ.length > 2) e.push('a24-v3');
  navEdges(f, e.join(' '));
}
function deskNav(d, rowsZ) {
  const approachZ = d.seat.z + (d.seat.z - d.z) * 1.1;
  let best = 0; rowsZ.forEach((z, r) => { if (Math.abs(z - approachZ) < Math.abs(rowsZ[best] - approachZ)) best = r; });
  const c = AISLE_X.indexOf(d.x);
  d.nav = c >= 0 ? nid(d.floor, `a${best}${c}`) : null;
}

// 1F
navNodes(0, COMMON_NODES);
navNodes(0, {
  stA: [-5.0, -9.0], out: [0, 12.6], rec: [-1.7, 3.5], wait: [-6.0, 8.6], lock: [-11.4, -1.6],
  cn1: [2.6, -0.3], cn2: [8.0, -0.3], cn3: [11.6, -0.3], cf1: [2.6, 5.1], cf2: [6.75, 5.1], cf3: [11.4, 5.1],
  bar: [8.0, -3.45], pr1: [5.0, -7.6], pr2: [9.8, -7.6]
});
navEdges(0, COMMON_EDGES + ' cl-stA v4-out v2-rec v3-wait h0-lock v1-cn1 cn1-cn2 cn2-cn3 cn1-cf1 cf1-cf2 cf2-cf3 cn3-cf3 v2-cf1 h5-bar ri-pr1 pr1-pr2');
// 2F
navNodes(1, COMMON_NODES);
navNodes(1, {
  land: [-12.1, -8.0], landx: [-12.1, -6.0], dock: [-8.1, 4.3],
  s1: [2.6, -1.3], s2: [7.5, -1.3], s3: [11.5, -1.3], s4: [2.6, 4.4], s5: [4.0, 4.4], s6: [6.1, 4.4], s7: [10.0, 4.4], s8: [10.0, 1.6],
  sv1: [5.6, -7.6], sv2: [11.0, -7.6]
});
navEdges(1, COMMON_EDGES + ' land-landx landx-h0 v1-s1 s1-s2 s2-s3 v2-s4 s4-s5 s5-s6 s6-s7 s7-s8 s8-s3 ri-sv1 sv1-sv2');
navPods(1, [-2.4, 2.6]);
navEdges(1, 'a12-dock');
// 3F
navNodes(2, COMMON_NODES);
navNodes(2, {
  stB: [-5.0, -7.3],
  l1: [2.4, -1.2], l2: [5.3, -1.2], l3: [7.4, -1.2], l4: [10.6, -1.2], l5: [3.0, 2.6], l6: [6.8, 2.6], l7: [11.0, 2.6], l8: [10.8, 6.4],
  m2: [10.6, -6.0], m3: [10.6, -8.9]
});
navEdges(2, COMMON_EDGES + ' cl-stB v1-l1 l1-l2 l2-l3 l3-l4 v2-l5 l5-l6 l6-l7 l7-l8 l4-l7 rd-m2 m2-m3');
navPods(2, [-2.4, 2.6, 7.4]);
// vertical links
navLink(nid(0, 'stA'), nid(1, 'land'), 'stairs');
navLink(nid(1, 'land'), nid(2, 'stB'), 'stairs');
navLink(nid(0, 'lift'), nid(1, 'lift'), 'lift');
navLink(nid(1, 'lift'), nid(2, 'lift'), 'lift');
DESKS.forEach(d => deskNav(d, d.floor === 2 ? [-2.4, 2.6, 7.4] : [-2.4, 2.6]));
DESK.H0.nav = nid(1, 's5'); DESK.H1.nav = nid(1, 's6');

/** Shortest path (Dijkstra) between two node ids → array of nodes. */
function findPath(from, to) {
  const dist = { [from]: 0 }, prev = {}, open = new Set([from]);
  const adj = {};
  NAV.edges.forEach(e => { (adj[e.a] = adj[e.a] || []).push([e.b, e]); (adj[e.b] = adj[e.b] || []).push([e.a, e]); });
  while (open.size) {
    let u = null; open.forEach(n => { if (u === null || dist[n] < dist[u]) u = n; });
    open.delete(u);
    if (u === to) break;
    (adj[u] || []).forEach(([v, e]) => {
      const nd = dist[u] + e.cost;
      if (dist[v] === undefined || nd < dist[v]) { dist[v] = nd; prev[v] = u; open.add(v); }
    });
  }
  if (dist[to] === undefined) return null;
  const path = [to]; while (path[0] !== from) path.unshift(prev[path[0]]);
  return path.map(id => NAV.nodes[id]);
}

// path overlay (toggle with the path button)
const navOverlay = [];
FLOORS.forEach(F => {
  const pts = [];
  NAV.edges.forEach(e => {
    const A = NAV.nodes[e.a], Bn = NAV.nodes[e.b];
    if (A.floor === F.index && Bn.floor === F.index) pts.push(A.x, 0.08, A.z, Bn.x, 0.08, Bn.z);
  });
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: '#d64fb3', transparent: true, opacity: 0.9, depthTest: false }));
  const np = []; Object.values(NAV.nodes).forEach(n => { if (n.floor === F.index) np.push(n.x, 0.09, n.z); });
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.Float32BufferAttribute(np, 3));
  const dots = new THREE.Points(pg, new THREE.PointsMaterial({ color: '#f2b632', size: 7, sizeAttenuation: false, depthTest: false }));
  lines.renderOrder = dots.renderOrder = 10;
  const grp = new THREE.Group(); grp.add(lines, dots); grp.visible = false; F.group.add(grp);
  navOverlay.push(grp);
});
// stair runs in the overlay
[[G1, STAIR_X1, -1, (HOLE_A.z0 + HOLE_A.z1) / 2, 0], [G2, STAIR_X0, 1, (HOLE_B.z0 + HOLE_B.z1) / 2, 1]].forEach(([g, xs, dir, z, fi]) => {
  const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(xs + dir * 0.5, 0.1, z), new THREE.Vector3(xs + dir * 6, FH + 0.1, z)]);
  const l = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#d64fb3', depthTest: false }));
  l.renderOrder = 10; navOverlay[fi].add(l);
});

/* =========================================================
   10. TEAM  (Mei = player, plus human + AI colleagues)
   at.desk = desk key · at.seat / at.stand = [floor, x, z, rotY, y?]
   ========================================================= */
const TEAM = [
  { id: 'mei',   name: PNAME,   kind: 'human', player: true, home: 'W2b1', at: { stand: [2, 0, 6.0, 0] },
    look: { body: HQ.body, pants: HQ.pants, hair: HQ.hair, skin: HQ.skin, bun: !!HQ.bun } },
  // 3F · work
  { id: 'ava',   name: 'Ava',   kind: 'human', at: { desk: 'W2b0' }, look: { body: P.sky } },
  { id: 'sora',  name: 'Sora',  kind: 'human', at: { desk: 'W2b2' }, look: { body: P.pink, bun: true } },
  { id: 'kenji', name: 'Kenji', kind: 'human', at: { desk: 'W2a0' }, look: { body: '#9a7bf0' } },
  { id: 'leo',   name: 'Leo',   kind: 'human', at: { desk: 'W1b0' }, look: { body: P.coral, hair: '#3a2d8f' } },
  { id: 'quill', name: 'Quill', kind: 'ai',    at: { desk: 'W1b1' }, look: { eye: P.pink } },
  { id: 'mia',   name: 'Mia',   kind: 'human', at: { stand: [2, 10.6, -8.9, -0.4] }, look: { body: P.sky, hair: '#5a3fb0', bun: true } },
  { id: 'ben',   name: 'Ben',   kind: 'human', at: { seat: [2, 6.3, -8.85, 0] }, look: { body: P.lavender } },
  { id: 'orbit', name: 'Orbit', kind: 'ai',    at: { seat: [2, 8.9, -8.85, 0] }, look: { trim: P.coral } },
  { id: 'rin',   name: 'Rin',   kind: 'human', at: { seat: [2, 9.4, 4.5, 0, 0.02] }, look: { body: '#ff9f80' } },
  // 2F · AI lab
  { id: 'atlas', name: 'Atlas', kind: 'ai',    at: { desk: 'A1b0' }, look: {} },
  { id: 'echo',  name: 'Echo',  kind: 'ai',    at: { desk: 'A1b1' }, look: { eye: P.magenta, antenna: P.sky } },
  { id: 'nova',  name: 'Nova',  kind: 'ai',    at: { desk: 'A1b2' }, look: { eye: P.pink } },
  { id: 'pixel', name: 'Pixel', kind: 'ai',    at: { desk: 'A1a2' }, look: { body: P.lilac, trim: P.magenta } },
  { id: 'byte',  name: 'Byte',  kind: 'ai',    at: { stand: [1, -8.1, 5.6, 0, 0.08] }, look: { eye: P.mustard } },
  { id: 'volt',  name: 'Volt',  kind: 'ai',    at: { stand: [1, 8.3, -7.6, 0] }, look: { trim: P.sky, antenna: P.magenta } },
  { id: 'kai',   name: 'Kai',   kind: 'human', at: { desk: 'H0' }, look: { body: '#9a7bf0' } },
  { id: 'yuki',  name: 'Yuki',  kind: 'human', at: { stand: [1, 7.5, -1.7, Math.PI] }, look: { body: '#ffb199', bun: true } },
  // 1F · lobby & café
  { id: 'hana',  name: 'Hana',  kind: 'ai',    at: { stand: [0, -4.0, 3.5, Math.PI / 2] }, look: { body: P.lilac, eye: P.pink } },
  { id: 'bolt',  name: 'Bolt',  kind: 'ai',    at: { stand: [0, 8.0, -3.45, 0] }, look: { eye: P.mustard, antenna: P.coral } },
  { id: 'lina',  name: 'Lina',  kind: 'human', at: { seat: [0, 3.5, 3.0, Math.PI / 2] }, look: { body: P.pink } },
  { id: 'tom',   name: 'Tom',   kind: 'human', at: { seat: [0, 10.0, 7.2, -Math.PI / 2] }, look: { body: P.sky, hair: '#3a2d8f' } }
];

TEAM.forEach(m => {
  const seated = !!(m.at.desk || m.at.seat);
  const opts = Object.assign({ seated }, m.look);
  const obj = m.kind === 'ai' ? robot(opts) : person(opts);
  let f, x, z, rot, y = 0;
  if (m.at.desk) {
    const d = DESK[m.at.desk]; f = d.floor; x = d.seat.x; z = d.seat.z; rot = d.facing; d.member = m;
  } else {
    [f, x, z, rot, y = 0] = m.at.seat || m.at.stand;
    if (m.at.stand) blob(obj, 1.1, 1.1);
  }
  obj.position.set(x, y, z); obj.rotation.y = rot;
  obj.userData.member = m;
  m.floor = f; m.object = obj;
  FLOORS[f].group.add(obj);
});
if (DESK.W2b1) DESK.W2b1.owner = 'mei';

const mei = TEAM.find(m => m.player);
const hero = mei.object;

/* =========================================================
   11. CONTROLS — map-style
   ========================================================= */
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.copy(TARGET);
controls.enableDamping = true;
controls.dampingFactor = 0.09;
controls.enableZoom = false;
controls.screenSpacePanning = false;
controls.rotateSpeed = 0.7;
controls.minPolarAngle = 0.15;
controls.maxPolarAngle = 1.32;
controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE };
controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN };
controls.update();

const ZOOM_MIN = 0.3, ZOOM_MAX = 7;
const raycaster = new THREE.Raycaster();
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const ndc = new THREE.Vector2();
function pointOnTargetPlane(cx, cy, out) {
  const r = renderer.domElement.getBoundingClientRect();
  ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  groundPlane.constant = -controls.target.y;
  return raycaster.ray.intersectPlane(groundPlane, out);
}
function zoomAt(cx, cy, factor) {
  const before = pointOnTargetPlane(cx, cy, new THREE.Vector3());
  camera.zoom = THREE.MathUtils.clamp(camera.zoom * factor, ZOOM_MIN, ZOOM_MAX);
  camera.updateProjectionMatrix();
  const after = pointOnTargetPlane(cx, cy, new THREE.Vector3());
  if (before && after) {
    const d = before.sub(after);
    camera.position.add(d); controls.target.add(d);
  }
  controls.update();
}
renderer.domElement.addEventListener('wheel', e => {
  e.preventDefault();
  const dy = e.deltaY * (e.deltaMode === 1 ? 16 : 1);
  if (CHASE.on) { CHASE.dist = THREE.MathUtils.clamp(CHASE.dist * Math.exp(dy * (e.ctrlKey ? 0.01 : 0.0012)), 2.6, 11); return; }
  const k = e.ctrlKey ? 0.01 : 0.0015;
  zoomAt(e.clientX, e.clientY, Math.exp(-dy * k));
}, { passive: false });

let pinchDist = 0;
const touchDist = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
renderer.domElement.addEventListener('touchstart', e => {
  if (e.touches.length === 2) pinchDist = touchDist(e.touches);
}, { passive: true });
renderer.domElement.addEventListener('touchmove', e => {
  if (e.touches.length !== 2 || !pinchDist) return;
  const d = touchDist(e.touches);
  const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
  const my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
  if (CHASE.on) CHASE.dist = THREE.MathUtils.clamp(CHASE.dist * pinchDist / d, 2.6, 11);
  else zoomAt(mx, my, d / pinchDist);
  pinchDist = d;
}, { passive: true });
renderer.domElement.addEventListener('touchend', e => { if (e.touches.length < 2) pinchDist = 0; }, { passive: true });

/* =========================================================
   12. FLOOR VIEW  (All / 1F / 2F / 3F) + path overlay toggle
   ========================================================= */
// smooth camera goal (floor focus / jump to a colleague); cancelled by user input
const camGoal = { target: null, zoom: null };
['pointerdown', 'wheel', 'touchstart'].forEach(ev =>
  renderer.domElement.addEventListener(ev, () => { camGoal.target = null; camGoal.zoom = null; }, { passive: true }));
let currentView = 'all';
function showFloor(sel, moveCam = true) {
  currentView = sel;
  FLOORS.forEach((F, i) => {
    const vis = sel === 'all' || i <= sel;
    F.group.visible = vis; F.ghost.visible = !vis;
  });
  if (moveCam) camGoal.target = new THREE.Vector3(controls.target.x, sel === 'all' ? TARGET.y : LEVELS[sel] + 1.2, controls.target.z);
  document.querySelectorAll('#floors button[data-f]').forEach(b =>
    b.classList.toggle('on', b.dataset.f === String(sel)));
}
document.querySelectorAll('#floors button[data-f]').forEach(b =>
  b.addEventListener('click', () => showFloor(b.dataset.f === 'all' ? 'all' : Number(b.dataset.f))));


/* =========================================================
   12b. WORK STATUS  (data → tags, floor rings, desk screens, panel)
   Fictional AI product company. Products:
     Orion  — consumer AI assistant app
     Prism  — enterprise knowledge search
     Nimbus — model API / developer platform
     Kite   — voice & transcription
   Each colleague: status (what they're doing right now), optional activity
   (meeting / break text), and several tasks.
   Task tuple: [title, project, taskStatus, progress 0–100 | null, minutesSinceUpdate, note?]
   ========================================================= */
const STATUS = {                       // person-level
  blocked: { label: 'Blocked',   color: '#ff7a59' },
  review:  { label: 'In review', color: '#f2b632' },
  working: { label: 'In progress', color: '#5cc4f2' },
  meeting: { label: 'In meeting', color: '#d64fb3' },
  idle:    { label: 'Idle',   color: '#a993e6' }
};
const STATUS_ORDER = ['blocked', 'review', 'working', 'meeting', 'idle'];
const TASK_STATUS = {                  // task-level workflow (board columns) …
  backlog: { label: 'Backlog', color: '#9a89c8' },
  todo:    { label: 'To do', color: '#b9aee0' },
  working: { label: 'In progress', color: '#5cc4f2' },
  review:  { label: 'In review', color: '#f2b632' },
  done:    { label: 'Done', color: '#7b5cd6' },
  closed:  { label: 'Closed', color: '#c9c2dc' },
  blocked: { label: 'Blocked',   color: '#ff7a59' }     // … plus the blocked flag (display only, not a column)
};
const TASK_ORDER = ['backlog', 'todo', 'working', 'review', 'done'];
const isBlocked = t => !!t.blocked && t.status !== 'done' && t.status !== 'closed';
const tsKey = t => (isBlocked(t) ? 'blocked' : t.status);
const tsOf = t => TASK_STATUS[tsKey(t)];
const PRIORITY = { P0: '#ff7a59', P1: '#f2b632', P2: '#5cc4f2', P3: '#cbb8f7' };
const PRI_RANK = { P0: 0, P1: 1, P2: 2, P3: 3 };
const _today = new Date(); _today.setHours(0, 0, 0, 0);
const isoDay = off => { const d = new Date(_today); d.setDate(d.getDate() + off); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
function dueInfo(t) {
  if (!t.due) return null;
  const d = Math.round((new Date(t.due + 'T00:00') - _today) / 864e5), md = `${+t.due.slice(5, 7)}/${+t.due.slice(8)}`;
  if (t.status === 'done' || t.status === 'closed') return { txt: md, cls: 'past' };
  if (d < 0) return { txt: `${-d}d overdue`, cls: 'late' };
  if (d === 0) return { txt: 'Due today', cls: 'soon' };
  if (d === 1) return { txt: 'Due tomorrow', cls: 'soon' };
  return { txt: `Due ${md}`, cls: '' };
}
let _seed2 = 0;
function seedMeta(t) {                       // mock priority + due date for the sample data
  const k = _seed2++;
  if (!t.priority) t.priority = ['P1', 'P2', 'P0', 'P2', 'P3', 'P1', 'P2', 'P1', 'P3', 'P2'][k % 10];
  if (!t.due) {
    const off = t.status === 'done' ? -((k % 4) + 1) : t.status === 'backlog' ? 14 + (k % 3) * 7 : [3, 7, 1, 10, 5, 14, 2, -1, 4, 0, 6, 12][k % 12];
    t.due = isoDay(off);
  }
  return t;
}
const H = 60, D = 1440;   // minutes
const WORK = {
  // ---------- 3F · work ----------
  mei: { role: 'Design Lead', loc: '3F Hallway', tasks: [
    ['Orion 3.0 chat UI redesign', 'Orion', 'working', 55, 5],
    ['Design system · dark-mode tokens', 'Nimbus', 'review', 80, 40, 'Waiting on frontend'],
    ['New-user onboarding research', 'Orion', 'todo', 0, D] ] },
  ava: { role: 'Product Designer', tasks: [
    ['Knowledge-base search results', 'Prism', 'review', 72, 12, 'Waiting on PM review'],
    ['Citation card component', 'Prism', 'working', 40, 30],
    ['Usability test report', 'Orion', 'done', 100, 2 * H] ] },
  sora: { role: 'Content Designer', tasks: [
    ['Assistant persona & tone guide', 'Orion', 'working', 40, 3],
    ['Voice launch announcement', 'Kite', 'review', 90, 25],
    ['Unify error messages', 'Nimbus', 'todo', 0, D] ] },
  kenji: { role: 'Backend Engineer', tasks: [
    ['Streaming gateway refactor', 'Nimbus', 'working', 85, 8],
    ['Usage billing API', 'Nimbus', 'blocked', 35, 50, 'Waiting on finance for billing rules'],
    ['Fix session timeout bug', 'Orion', 'done', 100, 3 * H] ] },
  leo: { role: 'ML Engineer', tasks: [
    ['Retrieval reranker v4', 'Prism', 'blocked', 30, 47, 'Waiting for labeled data'],
    ['Expand offline eval set', 'Prism', 'working', 60, 20],
    ['Team paper reading', 'Internal', 'todo', 0, 2 * D] ] },
  quill: { role: 'Coding Agent', tasks: [
    ['PR #2481 unit tests', 'Nimbus', 'working', 64, 1],
    ['Dependency upgrade · 37 packages', 'Infra', 'working', 22, 2],
    ['PR #2476 ready to merge', 'Orion', 'review', 100, 15, 'Waiting on human review'] ] },
  mia: { role: 'Product Manager', status: 'meeting', activity: 'Weekly: Q4 roadmap', loc: '3F Meeting room', note: 'Hosting · 25 min left', tasks: [
    ['Orion 3.0 PRD', 'Orion', 'review', 85, 2 * H, 'Waiting on design & eng review'],
    ['Voice assistant competitor analysis', 'Kite', 'working', 50, D],
    ['Q4 OKR alignment', 'Company', 'working', 70, 3 * H] ] },
  ben: { role: 'Frontend Engineer', status: 'meeting', activity: 'Weekly: Q4 roadmap', loc: '3F Meeting room', tasks: [
    ['Chat UI redesign build', 'Orion', 'working', 35, H],
    ['Dark-mode token integration', 'Nimbus', 'blocked', 10, 3 * H, 'Waiting on final design tokens'],
    ['First-load performance', 'Orion', 'done', 100, D] ] },
  orbit: { role: 'Meeting Agent', status: 'meeting', activity: 'Live notes for the weekly', loc: '3F Meeting room', tasks: [
    ['Last week’s action items · 14', 'Company', 'working', 71, 30],
    ['Meeting room calendar sync', 'Admin', 'done', 100, 2 * H] ] },
  rin: { role: 'HR Partner', status: 'idle', activity: 'Tea break', loc: '3F Lounge', note: 'Back at desk in 15 min', tasks: [
    ['Q4 performance cycle prep', 'People', 'working', 45, 2 * H],
    ['Team offsite plan', 'People', 'review', 90, D, 'Waiting on budget approval'],
    ['Onboarding · 3 new hires', 'People', 'todo', 0, D] ] },
  // ---------- 2F · AI lab / studio / server ----------
  atlas: { role: 'Training Agent', tasks: [
    ['Reranker v4 training', 'Prism', 'working', 78, 2, 'Epoch 7 / 9'],
    ['GPU queue · 12 jobs', 'Infra', 'working', 50, 1],
    ['Weekly training cost report', 'Infra', 'done', 100, 5 * H] ] },
  echo: { role: 'Support Agent', tasks: [
    ['Auto-replies · 312 tickets today', 'Orion', 'working', 64, 1],
    ['Refund tickets · 6 need a human', 'Orion', 'blocked', 0, 12, 'Escalated to support lead'],
    ['Top-question clustering', 'Orion', 'review', 100, 40, 'Waiting on ops sign-off'] ] },
  nova: { role: 'Eval Agent', tasks: [
    ['Regression eval · 2.4k cases', 'Nimbus', 'review', 90, 6, 'Report awaiting human check'],
    ['Safety red-teaming', 'Orion', 'working', 35, 10],
    ['Daily benchmark run', 'Prism', 'done', 100, 4 * H] ] },
  pixel: { role: 'Data Agent', tasks: [
    ['External docs sync', 'Prism', 'blocked', 20, 33, 'Rate-limited, retrying in 30 min'],
    ['Data cleaning · 80k rows', 'Prism', 'working', 55, 3],
    ['Labeling task dispatch', 'Prism', 'todo', 0, H] ] },
  byte: { role: 'General Agent', status: 'idle', activity: 'Charging · free for new tasks', loc: '2F Charging dock', tasks: [
    ['Log archiving', 'Infra', 'done', 100, H],
    ['Weekly report inputs', 'Internal', 'done', 100, 2 * H] ] },
  volt: { role: 'Ops Agent', loc: '2F Server room', tasks: [
    ['Server room patrol', 'Infra', 'working', 60, 4],
    ['Cert renewal · 3 domains', 'Infra', 'todo', 0, D],
    ['Disk alert fix', 'Infra', 'done', 100, 2 * H] ] },
  kai: { role: 'Data Analyst', tasks: [
    ['Retention funnel dashboard', 'Orion', 'working', 50, 9],
    ['A/B test: new prompt', 'Orion', 'review', 100, H, 'Waiting on PM to confirm'],
    ['Weekly report data', 'Internal', 'todo', 0, D] ] },
  yuki: { role: 'Project Manager', loc: '2F Studio', tasks: [
    ['Sprint 14 board cleanup', 'Company', 'review', 95, 14, 'Waiting on team sign-off'],
    ['Orion 3.0 launch plan', 'Orion', 'working', 40, 2 * H],
    ['Risk register update', 'Company', 'working', 70, D] ] },
  // ---------- 1F · lobby & café ----------
  hana: { role: 'Reception Agent', loc: '1F Lobby', tasks: [
    ['Visitors · 9 today', 'Admin', 'working', null, 2],
    ['Room booking sync', 'Admin', 'working', 80, 10] ] },
  bolt: { role: 'Barista Agent', loc: '1F Café', tasks: [
    ['Coffee orders · 3 left', 'Admin', 'working', 70, 1],
    ['Restock beans', 'Admin', 'todo', 0, 3 * H] ] },
  lina: { role: 'Recruiter', status: 'meeting', activity: '1:1 with Tom', loc: '1F Café', tasks: [
    ['Senior ML screening · 24 CVs', 'People', 'working', 40, H],
    ['Campus talk prep', 'People', 'todo', 0, D] ] },
  tom: { role: 'Enterprise Sales', status: 'meeting', activity: '1:1 with Lina', loc: '1F Café', tasks: [
    ['Prism enterprise trials · 5 accounts', 'Prism', 'working', 60, 2 * H],
    ['Annual contract renewal', 'Nimbus', 'blocked', 50, D, 'Waiting on legal'] ] }
};
const ZONE_NAME = { work: 'Work zone', ailab: 'AI Lab', studio: 'Studio' };
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ago = min => (min < 1 ? 'just now' : min < 60 ? `${min}m ago` : min < D ? `${Math.round(min / 60)}h ago` : `${Math.round(min / D)}d ago`);
const pctOf = t => (t.progress == null ? 'Ongoing' : `${t.progress}%`);

/** Normalise raw WORK entry → { role, status, activity, loc, note, tasks[], current, others[] } */
/** Derived fields: person status, task in hand, the rest, counts. Shared by init and every later change. */
function deriveWork(w, raw) {
  const rank = t => (t.status === 'done' ? 3 : t.status === 'closed' ? 4 : t.status === 'backlog' ? 2 : 0);
  w.tasks.sort((a, b) => rank(a) - rank(b));
  const head = w.tasks.find(t => t.status === 'working' || t.status === 'review') || w.tasks.find(t => t.status === 'todo');
  w.status = raw.status || (head ? (isBlocked(head) ? 'blocked' : head.status === 'review' ? 'review' : 'working') : 'idle');
  w.current = w.activity ? null : (head || null);
  w.others = w.tasks.filter(t => t !== w.current && t.status !== 'closed');
  w.open = w.tasks.filter(t => !['done', 'closed', 'backlog'].includes(t.status)).length;
  w.hasBlocked = w.tasks.some(isBlocked);
}
// ---- roles on a task: assigner + handler (derived). The doer is the list it lives in. ----
const ASSIGNER_OF = { mei: 'mia', ava: 'mei', sora: 'mei', kenji: 'mia', leo: 'mia', quill: 'kenji', mia: 'mia', ben: 'mei', orbit: 'mia',
  rin: 'rin', atlas: 'leo', echo: 'mia', nova: 'leo', pixel: 'leo', byte: 'yuki', volt: 'kenji', kai: 'mia', yuki: 'mia',
  hana: 'rin', bolt: 'rin', lina: 'rin', tom: 'mia' };
const REVIEWER_OF = { 'Knowledge-base search results': 'mei', 'Voice launch announcement': 'mia', 'PR #2476 ready to merge': 'kenji', 'Orion 3.0 PRD': 'mei', 'Team offsite plan': 'mia',
  'Top-question clustering': 'mei', 'Regression eval · 2.4k cases': 'leo', 'A/B test: new prompt': 'mia', 'Sprint 14 board cleanup': 'mei', 'Design system · dark-mode tokens': 'ben' };
const HELPER_OF = { 'Dark-mode token integration': 'mei', 'Retrieval reranker v4': 'pixel', 'Usage billing API': 'tom' };
/** Handler = who has to act now: reviewer while in review, helper while blocked (if asked), otherwise the doer. */
function handlerOf(t, m) {
  if (m.pool) return t.assigner || null;
  if (t.status === 'review') return t.reviewer || t.assigner || m.id;
  if (isBlocked(t) && t.helper) return t.helper;
  return m.id;
}
function noteHandled(t, m) {                   // remember everyone who has had the task in hand (trail)
  t.handled = t.handled || [];
  [m.pool ? null : m.id, handlerOf(t, m)].forEach(id => { if (id && !t.handled.includes(id)) t.handled.push(id); });
}
function defaultReviewer(t, m) { return t.reviewer || (t.assigner && t.assigner !== m.id ? t.assigner : (m.id === 'mia' ? 'mei' : 'mia')); }
function seedRoles(t, m) {
  t.assigner = t.assigner || (t.title === 'New-user onboarding research' ? 'mei' : ASSIGNER_OF[m.id] || 'mia');
  if (REVIEWER_OF[t.title]) t.reviewer = REVIEWER_OF[t.title];
  if (HELPER_OF[t.title] && t.blocked) t.helper = HELPER_OF[t.title];
  noteHandled(t, m);
  return t;
}
function normaliseWork(m) {
  const raw = WORK[m.id] || { tasks: [] };
  const tasks = raw.tasks.map(([title, project, status, progress, updated, note]) => {
    const t = { title, project, status, progress, updated, note };
    if (status === 'blocked') { t.status = 'working'; t.blocked = true; }   // old sample data: blocked → flag
    return seedRoles(seedMeta(t), m);
  });
  const w = Object.assign({}, raw, { tasks });
  deriveWork(w, raw);
  if (!w.loc) {
    const d = m.at.desk && DESK[m.at.desk];
    w.loc = `${m.floor + 1}F ${d ? ZONE_NAME[d.zone] || '' : ''}`.trim();
  }
  return w;
}

const ringGeo = new THREE.TorusGeometry(0.62, 0.05, 8, 40);
const tagsLayer = document.getElementById('tags');
const filter = { status: null, type: 'all' };
let SHOW_ALL_TAGS = false;
/** What a colleague has handed to Mei (she is the handler): a review, or a request for help. */
function needOf(m) {
  if (m.player) return null;
  const mine = m.work.tasks.filter(t => t.status !== 'done' && t.status !== 'closed' && handlerOf(t, m) === 'mei');
  const help = mine.filter(isBlocked), rev = mine.filter(t => t.status === 'review');
  if (help.length) return { kind: 'help', label: 'Needs your help', color: '#ff7a59', tasks: help };
  if (rev.length) return { kind: 'review', label: 'Needs your review', color: '#f2b632', tasks: rev };
  return null;
}

TEAM.forEach(m => {
  m.work = normaliseWork(m);
  const ring = new THREE.Mesh(ringGeo, new THREE.MeshStandardMaterial({ transparent: true }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.04; ring.renderOrder = 3;
  m.object.add(ring); m.ring = ring;
  const el = document.createElement('div');
  el.className = 'tag' + (m.player ? ' me' : '');
  el.addEventListener('click', e => { e.stopPropagation(); onTagClick(m); });
  tagsLayer.appendChild(el);
  m.tagEl = el;
  m.match = true;
  applyStatus(m);
});
DESKS.forEach(d => {
  if (!d.member && d.owner !== 'mei') { d.screen.material.color = lin(P.lavender); d.screen.material.emissive = lin(P.lavender); d.screen.material.emissiveIntensity = 0.2; }
});

function taskBar(t, c) {
  return `<div class="bar"><i style="width:${t.progress == null ? 100 : t.progress}%;background:${c};${t.progress == null ? 'opacity:.35' : ''}"></i></div>`;
}
function taskList(tasks) {
  if (!tasks.length) return '';
  return `<div class="sub">${tasks.map(t => {
    const ts = tsOf(t), k = tsKey(t);
    return `<div class="st-${k}" title="${esc(ts.label)}"><i style="background:${ts.color}"></i><span>${esc(t.title)}</span><em>${t.status === 'done' ? '✓' : (k === 'todo' || k === 'backlog') ? ts.label : k === 'blocked' ? `Blocked · ${pctOf(t)}` : pctOf(t)}</em></div>` +
      (t.note && k === 'blocked' ? `<div class="subnote">${esc(t.note)}</div>` : '');
  }).join('')}</div>`;
}

/** Re-render one colleague's status everywhere (call after changing WORK and normaliseWork). */
function applyStatus(m) {
  const w = m.work, st = STATUS[w.status] || STATUS.idle, c = st.color, cur = w.current;
  m.ring.material.color = lin(c); m.ring.material.emissive = lin(c); m.ring.material.emissiveIntensity = 1;
  const d = m.at.desk ? DESK[m.at.desk] : (m.player ? DESK[m.home] : null);
  if (d) { d.screen.material.color = lin(c); d.screen.material.emissive = lin(c); d.screen.material.emissiveIntensity = 0.95; }
  const el = m.tagEl;
  el.style.setProperty('--c', c);
  el.style.setProperty('--p', cur && cur.progress != null ? cur.progress : 100);
  const headline = cur
    ? `<div class="tt">${esc(cur.title)}</div>${taskBar(cur, c)}<div class="ft"><span>${pctOf(cur)}</span><span>${ago(cur.updated)}</span></div>
       ${cur.note ? `<div class="note ${isBlocked(cur) ? '' : 'soft'}">${esc(cur.note)}</div>` : ''}`
    : `<div class="tt">${esc(w.activity || 'All tasks cleared')}</div>${w.note ? `<div class="note soft">${esc(w.note)}</div>` : ''}`;
  el.innerHTML = `
    <div class="card">
      <div class="ch"><span class="chip st-${w.status}" style="background:${c}">${st.label}</span>${cur ? `<span class="proj">${esc(cur.project)}</span>` : ''}<span class="cnt">${w.open} open</span></div>
      ${headline}
      ${w.others.length ? `<div class="subh">${cur ? 'Other tasks' : 'Tasks'}</div>${taskList(w.others)}` : ''}
    </div>
    <div class="pill"><span class="ring"></span><b>${esc(m.name)}${m.player ? ' · me' : ''}</b>${m.kind === 'ai' ? '<i class="ai">AI</i>' : ''}<span class="pct">${cur && cur.progress != null ? pctOf(cur) : st.label}</span><span class="n">${w.open}</span>${w.hasBlocked && w.status !== 'blocked' ? '<span class="alert" title="Has a blocked task">!</span>' : ''}</div>`;
  m.need = needOf(m);
  if (m.need && !SHOW_ALL_TAGS) {                       // compact "needs me" tag
    const n = m.need;
    el.style.setProperty('--c', n.color);
    el.innerHTML = `
      <div class="card">
        <div class="ch"><span class="chip st-${n.kind === 'help' ? 'blocked' : 'review'}" style="background:${n.color}">${n.label}</span><span class="cnt">${esc(w.loc)}</span></div>
        <div class="needt">${n.tasks.map(t => `<div><b>${esc(t.title)}</b><small class="${isBlocked(t) ? 'bad' : ''}">${esc(t.project)} · ${pctOf(t)}${t.note ? ' · ' + esc(t.note) : ''}</small></div>`).join('')}</div>
        <div class="hintline">Click to go · press E nearby to talk</div>
      </div>
      <div class="pill need need-${n.kind}"><span class="ni">!</span><b>${esc(m.name)}</b>${m.kind === 'ai' ? '<i class="ai">AI</i>' : ''}<span class="nl">${n.label}${n.tasks.length > 1 ? ` · ${n.tasks.length}` : ''}</span></div>`;
  }
}

// ---- panel ----
const panel = document.getElementById('panel'), panelOpen = document.getElementById('panelOpen');
const listEl = document.getElementById('list'), summaryEl = document.getElementById('summary');
function setPanel(open) {
  panel.classList.toggle('collapsed', !open); panelOpen.classList.toggle('show', !open);
  if (open && typeof KB !== 'undefined' && KB && KB.dirty && panel.classList.contains('tab-board')) renderKanban(true);
}
document.getElementById('panelClose').addEventListener('click', () => setPanel(false));
panelOpen.addEventListener('click', () => setPanel(true));
setPanel(false);

function matches(m) {
  return (!filter.status || m.work.status === filter.status) &&
    (filter.type === 'all' || (filter.type === 'ai') === (m.kind === 'ai'));
}
function renderPanel() {
  const humans = TEAM.filter(m => m.kind === 'human').length;
  const now = new Date();
  document.getElementById('meta').textContent =
    `${TEAM.length} people · ${humans} human · ${TEAM.length - humans} AI · updated ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const typed = TEAM.filter(m => filter.type === 'all' || (filter.type === 'ai') === (m.kind === 'ai'));
  summaryEl.innerHTML = STATUS_ORDER.map(s => `
    <button data-s="${s}" class="${filter.status === s ? 'on' : ''}" style="--c:${STATUS[s].color}">
      <b>${typed.filter(m => m.work.status === s).length}</b><span>${STATUS[s].label}</span></button>`).join('');
  summaryEl.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    filter.status = filter.status === b.dataset.s ? null : b.dataset.s; refreshFilter();
  }));
  // task-level totals
  const all = typed.flatMap(m => m.work.tasks).filter(t => t.status !== 'closed');
  document.getElementById('taskStats').innerHTML = `<b>${all.length} tasks</b>` + TASK_ORDER.map(s =>
    `<span style="--c:${TASK_STATUS[s].color}">${TASK_STATUS[s].label} ${all.filter(t => t.status === s).length}</span>`).join('') +
    `<span style="--c:${TASK_STATUS.blocked.color}">Blocked ${all.filter(isBlocked).length}</span>`;
  listEl.innerHTML = STATUS_ORDER.map(s => {
    const ms = TEAM.filter(m => m.work.status === s && matches(m));
    if (!ms.length) return '';
    const c = STATUS[s].color;
    return `<h2 style="--c:${c}">${STATUS[s].label} <em>${ms.length}</em></h2>` + ms.map(m => {
      const w = m.work, cur = w.current;
      const head = cur
        ? `<div class="task">${esc(cur.title)}</div>
           <div class="meta"><span class="proj">${esc(cur.project)}</span>${taskBar(cur, c)}<span class="pc">${pctOf(cur)}</span></div>
           ${cur.note ? `<div class="note ${isBlocked(cur) ? '' : 'soft'}">${esc(cur.note)}</div>` : ''}`
        : `<div class="task">${esc(w.activity || 'All tasks cleared')}</div>${w.note ? `<div class="note soft">${esc(w.note)}</div>` : ''}`;
      return `<div class="row ${m.pinned ? 'sel' : ''}" data-id="${m.id}" style="--c:${c}">
        <span class="av ${m.kind === 'ai' ? 'ai' : 'human'}" style="--b:${m.look.body || (m.kind === 'ai' ? P.violet : P.lavender)}"></span>
        <div class="info">
          <div class="top"><b>${esc(m.name)}${m.player ? ' · me' : ''}</b><span class="role">${esc(w.role || '')}</span><span class="loc">${esc(w.loc)}</span></div>
          ${head}
          ${taskList(w.others)}
        </div></div>`;
    }).join('');
  }).join('') || '<p style="padding:20px;text-align:center;color:#7b6aa8">No matching colleagues</p>';
  listEl.querySelectorAll('.row').forEach(r => r.addEventListener('click', () => focusMember(TEAM.find(m => m.id === r.dataset.id))));
}
function refreshFilter() {
  TEAM.forEach(m => {
    m.match = matches(m);
    m.ring.material.opacity = m.match ? 1 : 0.15;
  });
  renderPanel();
  renderKanban();
  updateFloorBadges();
}
function updateFloorBadges() {
  document.querySelectorAll('#floors button[data-f]').forEach(b => {
    if (b.dataset.f === 'all') return;
    const f = +b.dataset.f, n = TEAM.filter(m => m.floor === f && m.need).length;
    const html = `${f + 1}F${n ? `<span class="fb" title="${n} colleagues need you">${n}</span>` : ''}`;
    if (b.innerHTML !== html) b.innerHTML = html;
  });
}
document.getElementById('tagsBtn').addEventListener('click', e => {
  SHOW_ALL_TAGS = !SHOW_ALL_TAGS; e.currentTarget.classList.toggle('on', SHOW_ALL_TAGS);
  TEAM.forEach(applyStatus);
});
document.querySelectorAll('#typeSeg button').forEach(b => b.addEventListener('click', () => {
  filter.type = b.dataset.t;
  document.querySelectorAll('#typeSeg button').forEach(x => x.classList.toggle('on', x === b));
  refreshFilter();
}));

/** Jump to a colleague: show their floor, pan + zoom in, pin their card. */
const _v = new THREE.Vector3(), _right = new THREE.Vector3();
function focusMember(m) {
  const wasPinned = m.pinned;
  TEAM.forEach(o => { o.pinned = false; o.tagEl.classList.remove('pinned'); });
  if (!wasPinned) {
    m.pinned = true; m.tagEl.classList.add('pinned');
    showFloor(m.floor);
    (m.anchor || m.object).getWorldPosition(_v);
    const goal = new THREE.Vector3(_v.x, LEVELS[m.floor] + 0.8, _v.z);
    const zoom = Math.max(camera.zoom, 2.0);
    if (!panel.classList.contains('collapsed') && window.innerWidth > 760) {   // keep them out from under the panel
      _right.setFromMatrixColumn(camera.matrixWorld, 0);
      goal.addScaledVector(_right, (panel.offsetWidth / 2 / window.innerHeight) * FRUSTUM / zoom);
    }
    camGoal.target = goal; camGoal.zoom = zoom;
  }
  renderPanel();
  const row = listEl.querySelector(`.row[data-id="${m.id}"]`);
  if (row && m.pinned) row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
let _downXY = [0, 0];
renderer.domElement.addEventListener('pointerdown', e => { _downXY = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener('click', e => {
  if (Math.hypot(e.clientX - _downXY[0], e.clientY - _downXY[1]) > 5) return;   // was a drag
  if (TEAM.some(m => m.pinned)) { TEAM.forEach(o => { o.pinned = false; o.tagEl.classList.remove('pinned'); }); renderPanel(); }
});
renderPanel();
updateFloorBadges();

// ---- per-frame tag placement (+ occlusion behind slabs / walls) ----
const occRay = new THREE.Raycaster(), _camDir = new THREE.Vector3(), _p = new THREE.Vector3();
const FULL_CARD_ZOOM = 3.2;
function isOccluded(pt) {
  const occ = [];
  FLOORS.forEach(F => { if (F.group.visible) occ.push(...F.occluders); });
  if (viewCam.isPerspectiveCamera) {
    const o = viewCam.position, d = pt.clone().sub(o), len = d.length();
    occRay.set(o, d.divideScalar(len)); occRay.far = Math.max(0, len - 0.25);
  } else {
    occRay.set(pt.clone().addScaledVector(_camDir, -300), _camDir);
    occRay.far = 299.8;
  }
  return occRay.intersectObjects(occ, false).length > 0;
}
function updateTags(checkOcclusion) {
  if (checkOcclusion) updateFloorBadges();
  const W = window.innerWidth, H = window.innerHeight, chase = !!viewCam.isPerspectiveCamera;
  viewCam.getWorldDirection(_camDir);
  TEAM.forEach(m => {
    const el = m.tagEl;
    const o = m.anchor || m.object;
    const wanted = SHOW_ALL_TAGS || m.need || m.pinned || PLAYER.talking === m || !!filter.status || (m.player && !chase);
    if (!wanted || !FLOORS[m.floor].group.visible || !m.match || m.away || (chase && m.player) || (chase && PLAYER.inLift && m.floor !== mei.floor)) { el.style.display = 'none'; return; }
    o.localToWorld(_p.set(0, o.userData.headY + 0.72, 0));
    const camDist = _p.distanceTo(viewCam.position);
    if (checkOcclusion || m.occluded === undefined) m.occluded = isOccluded(_p);
    _p.project(viewCam);
    if ((m.occluded && !m.pinned) || _p.z > 1 || Math.abs(_p.x) > 1.1 || Math.abs(_p.y) > 1.1 || (chase && camDist > (m.need ? 45 : 28))) { el.style.display = 'none'; return; }
    const full = chase && camDist < 5.5;          // overview: pills only, like the chase view
    el.style.display = '';
    el.style.transform = `translate(${((_p.x + 1) / 2 * W).toFixed(1)}px, ${((1 - _p.y) / 2 * H).toFixed(1)}px) translate(-50%, -100%)`;
    el.classList.toggle('full', full);
  });
}

/* =========================================================
   12c. LIFE — everyone animates by what they're doing; some colleagues
   get up and walk the nav graph (stairs included). Mei stays put for now.
   ========================================================= */
const BY_ID = Object.fromEntries(TEAM.map(m => [m.id, m]));
const BEHAVIOR = {                     // fixed behaviours; everyone else follows work status
  mia: 'present', yuki: 'board', bolt: 'serve', hana: 'greet', volt: 'patrol',
  byte: 'charge', lina: 'talk', tom: 'talk', rin: 'relax'
};
const LOOK_AT = { ben: 'mia', orbit: 'mia', lina: 'tom', tom: 'lina' };
const PATROL = { volt: [[8.3, -7.6, 0], [4.8, -8.0, 3], [8.3, -7.6, 0], [11.4, -8.0, 3]] };
// trips: who may walk around, and where
const TRIPS = {
  ava: ['cafe', 'booth', 'board', 'wc'],
  sora: ['cafe', 'shelf', 'wc', 'print'],
  kenji: ['cafe', 'wc', 'booth'],
  kai: ['cafe', 'board', 'wc'],
  leo: ['pixel', 'cafe', 'pixel'],
};
const DEST = {
  cafe:  { node: '0:cn2', dx: 0.6, dz: 0, face: Math.PI, mode: 'stand', stay: 9 },
  booth: { node: '2:l2', dx: 0, dz: 0, face: Math.PI, mode: 'phone', stay: 8 },
  board: { node: '1:s2', dx: 1.3, dz: 0, face: Math.PI, mode: 'board', stay: 8 },
  wc:    { node: '@:util', dx: 0, dz: -0.4, face: Math.PI, mode: 'away', stay: 6 },
  print: { node: '0:pr1', dx: 0, dz: -0.6, face: Math.PI, mode: 'type', stay: 6 },
  shelf: { node: '2:l4', dx: 0.6, dz: 0, face: Math.PI / 2, mode: 'stand', stay: 7 },
  pixel: { node: '1:a13', dx: 0, dz: -0.3, face: Math.PI, mode: 'talk', stay: 10 }
};
NAV.edges.forEach(e => { if (e.type === 'lift') e.cost += 10; });   // walkers prefer the stairs

const hashPh = id => [...id].reduce((a, c) => a + c.charCodeAt(0), 0) * 0.37;
const walkers = new THREE.Group(); scene.add(walkers);
TEAM.forEach(m => {
  m.ph = hashPh(m.id);
  m.anchor = m.object;
  m.base = m.object.position.clone();
  m.baseRot = m.object.rotation.y;
  if (TRIPS[m.id] && TRIPS[m.id].length && m.at.desk) {
    const so = m.kind === 'ai' ? robot(Object.assign({}, m.look)) : person(Object.assign({}, m.look));
    const r = new THREE.Mesh(ringGeo, m.ring.material);
    r.rotation.x = -Math.PI / 2; r.position.y = 0.04; so.add(r);
    blob(so, 1.1, 1.1);
    so.visible = false; walkers.add(so);
    m.standObj = so;
  }
});
BY_ID.mia.baseRot = -1.19;                 // presenter faces the table

function wrapAngle(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }
function faceTo(o, target, dt, speed = 7) {
  o.rotation.y += wrapAngle(target - o.rotation.y) * (1 - Math.exp(-speed * dt));
}
function yawTo(o, other) {
  const d = other.position.clone().sub(o.position);
  return THREE.MathUtils.clamp(wrapAngle(Math.atan2(d.x, d.z) - o.rotation.y), -1.0, 1.0);
}

/** Target pose for a mode. Angles in radians: arms [pitch, roll], head [pitch, yaw], upper [pitch, yaw]. */
function pose(mode, t, ph, amt = 0) {
  const s = Math.sin;
  const p = { aL: [0.05, -0.06], aR: [0.05, 0.06], hd: [0, 0], up: [0, 0], lg: [0, 0], bob: 0, k: 8 };
  switch (mode) {
    case 'type': case 'typeSlow': {
      const fast = mode === 'type', f = t * (fast ? 13 : 6) + ph, a = fast ? 0.09 : 0.06;
      p.aL = [-1.15 + s(f) * a, 0.14]; p.aR = [-1.15 + s(f + 2.1) * a, -0.14];
      p.hd = [0.14 + s(t * 0.7 + ph) * 0.05, s(t * 0.27 + ph) * 0.18]; p.up = [0.1, s(t * 0.2 + ph) * 0.05];
      break;
    }
    case 'think': {                                   // reviewing: read, then hand on chin
      if ((t + ph) % 10 < 6) return pose('typeSlow', t, ph);
      p.aL = [-1.0, 0.14]; p.aR = [-2.35, -0.45]; p.hd = [0.05, 0.25 + s(t * 0.8) * 0.05]; p.up = [0.02, 0.1];
      break;
    }
    case 'blocked': {                                 // stuck: hands on head every few seconds
      if ((t + ph) % 9 < 4.5) return pose('typeSlow', t, ph);
      p.aL = [-2.7, 0.45]; p.aR = [-2.7, -0.45]; p.hd = [0.22, s(t * 1.5) * 0.2];
      p.up = [0.15 + s(t * 1.2) * 0.04, s(t * 1.5) * 0.12];
      break;
    }
    case 'listen': {
      p.aL = [-0.95, 0.18]; p.aR = [-0.95, -0.18];
      const nod = s(t * 0.9 + ph) > 0.75 ? s(t * 7) * 0.12 : 0;
      p.hd = [0.06 + nod, 0]; p.up = [0.05, 0];
      break;
    }
    case 'talk': {
      p.aL = [-0.75 + s(t * 3.1 + ph) * 0.35, -0.15 - Math.abs(s(t * 2.3 + ph)) * 0.25];
      p.aR = [-0.85 + s(t * 3.6 + ph + 1) * 0.4, 0.15 + Math.abs(s(t * 2.7 + ph)) * 0.25];
      p.hd = [s(t * 2.2 + ph) * 0.07, s(t * 0.8 + ph) * 0.22]; p.up = [0.04, s(t * 0.6 + ph) * 0.1];
      break;
    }
    case 'present': {
      if ((t + ph) % 7 < 2.2) { p.aR = [-1.5, 0.5]; p.aL = [-0.3, -0.1]; p.hd = [0, 0.4]; }
      else Object.assign(p, pose('talk', t * 1.2, ph));
      const st = s(t * 7) * 0.3 * amt; p.lg = [st, -st];
      break;
    }
    case 'relax': {
      const sip = (t + ph) % 8 < 2;
      p.up = [-0.16, 0]; p.aL = [-0.35, -0.18]; p.aR = sip ? [-2.15, -0.4] : [-0.35, 0.18];
      p.hd = [sip ? -0.12 : -0.04, sip ? 0 : s(t * 0.3 + ph) * 0.35]; p.k = 4;
      break;
    }
    case 'board': {
      p.aR = [-2.35 + s(t * 2.6 + ph) * 0.22, 0.12]; p.aL = [-0.25, -0.1]; p.hd = [-0.18, s(t * 0.4) * 0.1];
      const st = s(t * 7) * 0.32 * amt; p.lg = [st, -st];
      break;
    }
    case 'serve': {
      p.aL = [-1.2 + s(t * 5 + ph) * 0.25, 0.1]; p.aR = [-1.2 + s(t * 5 + ph + 1.5) * 0.25, -0.1];
      p.hd = [0.15, s(t * 0.5) * 0.2]; p.bob = Math.abs(s(t * 3)) * 0.03;
      break;
    }
    case 'greet': {
      const wave = (t + ph) % 9 < 1.8;
      p.aR = wave ? [-0.2, 2.6 + s(t * 11) * 0.35] : [0.05, 0.06];
      p.hd = [0, s(t * 0.45 + ph) * 0.55];
      break;
    }
    case 'charge': p.hd = [0.3, 0]; p.aL = [0.1, -0.25]; p.aR = [0.1, 0.25]; p.bob = s(t * 1.4) * 0.04; p.k = 3; break;
    case 'scan': p.hd = [0.12, s(t * 1.2) * 0.4]; p.aR = [-1.45 + s(t * 4) * 0.12, -0.1]; break;
    case 'phone': p.aR = [-2.5, -0.55]; p.aL = [-0.6, 0.3]; p.hd = [0.05, s(t * 0.6 + ph) * 0.3]; break;
    case 'walk': {
      const f = t * 8.5;
      p.lg = [s(f) * 0.55, -s(f) * 0.55]; p.aL = [-s(f) * 0.45, -0.08]; p.aR = [s(f) * 0.45, 0.08];
      p.bob = Math.abs(s(f)) * 0.05; p.k = 14;
      break;
    }
    case 'walkBot': p.bob = 0.08 + s(t * 3) * 0.04; p.up = [0.12, 0]; p.aL = [0.4, -0.2]; p.aR = [0.4, 0.2]; break;
    case 'cheer': { const j = Math.abs(s(t * 9));
      p.aL = [-2.9, 0.35 + s(t * 9) * 0.15]; p.aR = [-2.9, -0.35 - s(t * 9) * 0.15]; p.bob = j * 0.14; p.hd = [-0.15, 0]; p.k = 14; break; }
    case 'wave': p.aR = [-0.2, 2.6 + s(t * 11) * 0.35]; p.hd = [0, 0]; break;
    case 'sip': {
      const sip = (t + ph) % 6 < 1.6;
      p.aR = sip ? [-2.15, -0.4] : [-1.0, -0.1]; p.aL = [0.05, -0.07]; p.hd = [sip ? -0.12 : 0, sip ? 0 : s(t * 0.35) * 0.3]; break; }
    case 'stand': default:
      p.aL = [s(t * 1.1 + ph) * 0.05, -0.07]; p.aR = [-s(t * 1.1 + ph) * 0.05, 0.07];
      p.hd = [0, s(t * 0.35 + ph) * 0.35];
  }
  return p;
}
function applyPose(rig, p, dt) {
  const k = 1 - Math.exp(-p.k * dt);
  const L = (obj, ax, v) => { obj.rotation[ax] += (v - obj.rotation[ax]) * k; };
  L(rig.armL, 'x', p.aL[0]); L(rig.armL, 'z', p.aL[1]);
  L(rig.armR, 'x', p.aR[0]); L(rig.armR, 'z', p.aR[1]);
  L(rig.head, 'x', p.hd[0]); L(rig.head, 'y', p.hd[1]);
  L(rig.upper, 'x', p.up[0]); L(rig.upper, 'y', p.up[1]);
  if (rig.legL) { L(rig.legL, 'x', p.lg[0]); L(rig.legR, 'x', p.lg[1]); }
  rig.upper.position.y += (rig.upperY + p.bob - rig.upper.position.y) * k;
}

function baseMode(m) {
  const b = BEHAVIOR[m.id];
  if (b) return b;
  const seated = m.object.userData.rig.seated;
  switch (m.work.status) {
    case 'working': return seated ? 'type' : 'stand';
    case 'review':  return seated ? 'think' : 'stand';
    case 'blocked': return seated ? 'blocked' : 'stand';
    case 'meeting': return seated ? 'listen' : 'talk';
    default:        return seated ? 'relax' : 'stand';
  }
}

// ---- trips along the nav graph ----
const worldOf = n => new THREE.Vector3(n.x, LEVELS[n.floor], n.z);
const STAIR_VIA = {          // world points, listed going UP
  '0:stA|1:land': [[-5.4, 0.05, -8.97], [-11.5, 4.8, -8.97]],
  '1:land|2:stB': [[-12.0, 4.8, -7.33], [-11.5, 4.8, -7.33], [-5.5, 9.6, -7.33]]
};
function routePoints(path) {
  const pts = [];
  path.forEach((n, i) => {
    if (i > 0) {
      const a = path[i - 1];
      if (a.floor !== n.floor) {
        const up = a.floor < n.floor;
        const key = up ? `${a.id}|${n.id}` : `${n.id}|${a.id}`;
        const via = STAIR_VIA[key];
        if (via) (up ? via : [...via].reverse()).forEach(([x, y, z]) => pts.push(new THREE.Vector3(x, y, z)));
        else pts.push({ teleport: true });                       // lift ride: hop between floors
      }
    }
    pts.push(worldOf(n));
  });
  return pts;
}
function startTrip(m, t) {
  const d = DESK[m.at.desk];
  const key = TRIPS[m.id][Math.floor(rnd() * TRIPS[m.id].length)];
  const dest = DEST[key];
  const destId = dest.node.replace('@', d.floor);
  const pathOut = findPath(d.nav, destId), pathBack = findPath(destId, d.nav);
  if (!pathOut || !pathBack) return false;
  const lvl = LEVELS[d.floor];
  const away = new THREE.Vector3(d.seat.x - d.x, 0, d.seat.z - d.z).normalize();
  const stand = new THREE.Vector3(d.seat.x, lvl, d.seat.z).addScaledVector(away, 0.75);
  const destNode = NAV.nodes[destId];
  const destPt = worldOf(destNode).add(new THREE.Vector3(dest.dx, 0, dest.dz));
  m.trip = {
    dest, phase: 'out', i: 0, timer: 0, d,
    out: [...routePoints(pathOut), destPt],
    back: [...routePoints(pathBack), stand]
  };
  const so = m.standObj;
  so.position.copy(stand); so.rotation.y = Math.atan2(away.x, away.z);
  so.visible = true; m.object.visible = false; m.anchor = so;
  return true;
}
function followPoints(m, pts, dt) {
  const o = m.standObj, tr = m.trip;
  let budget = dt * 1.7;
  while (budget > 0 && tr.i < pts.length) {
    const target = pts[tr.i];
    if (target.teleport) { tr.i++; const nx = pts[tr.i]; if (nx) o.position.copy(nx); continue; }
    const d = target.clone().sub(o.position), len = d.length();
    const slope = len > 1e-4 ? Math.abs(d.y) / len : 0;
    const step = budget * (slope > 0.2 ? 0.7 : 1);
    if (len <= step) { o.position.copy(target); budget -= len; tr.i++; }
    else {
      o.position.addScaledVector(d, step / len); budget = 0;
      if (Math.hypot(d.x, d.z) > 1e-3) faceTo(o, Math.atan2(d.x, d.z), dt, 10);
    }
  }
  m.floor = THREE.MathUtils.clamp(Math.round(o.position.y / FH), 0, 2);
  return tr.i >= pts.length;
}
function updateTrip(m, t, dt) {
  const tr = m.trip;
  if (m.attn) return 'stand';                       // stopped to chat with Mei
  if (tr.phase === 'out') {
    if (followPoints(m, tr.out, dt)) { tr.phase = 'stay'; tr.timer = tr.dest.stay; m.away = tr.dest.mode === 'away'; }
    return 'walk';
  }
  if (tr.phase === 'stay') {
    faceTo(m.standObj, tr.dest.face, dt);
    tr.timer -= dt;
    if (tr.timer <= 0) { tr.phase = 'back'; tr.i = 0; m.away = false; }
    return tr.dest.mode === 'away' ? 'stand' : tr.dest.mode;
  }
  if (followPoints(m, tr.back, dt)) {              // home: sit back down
    m.standObj.visible = false; m.object.visible = true; m.anchor = m.object;
    m.floor = tr.d.floor; m.trip = null; m.cool = t + 25 + rnd() * 25;
    return baseMode(m);
  }
  return 'walk';
}

let nextTripAt = 2.5;
function updateLife(t, dt) {
  // schedule trips: at most 2 people walking at once
  if (t > nextTripAt) {
    const active = TEAM.filter(m => m.trip).length;
    if (active < 2) {
      const pool = TEAM.filter(m => m.standObj && !m.trip && t > (m.cool || 0));
      if (pool.length) startTrip(pool[Math.floor(rnd() * pool.length)], t);
    }
    nextTripAt = t + 4 + rnd() * 6;
  }
  TEAM.forEach(m => {
    if (m.player) return;
    let mode, amt = 0;
    if (m.trip) {
      mode = updateTrip(m, t, dt);
      if (m.standObj) m.standObj.visible = !m.away && FLOORS[m.floor].group.visible && !!m.trip;
      if (!m.trip) return;
    } else {
      const o = m.object;
      mode = baseMode(m);
      if (mode === 'talk' && LOOK_AT[m.id]) {                     // 1:1 — take turns speaking
        if (Math.floor((t + (m.id === 'tom' ? 4 : 0)) / 4) % 2 === 1) mode = 'listen';
      }
      if (mode === 'present') {
        o.position.x = m.base.x + Math.sin(t * 0.35) * 0.5;
        amt = Math.abs(Math.cos(t * 0.35));
        faceTo(o, (t + m.ph) % 14 > 10 ? -1.83 : m.baseRot, dt, 3);
      } else if (mode === 'board') {
        o.position.x = m.base.x + Math.sin(t * 0.25) * 1.3;
        amt = Math.abs(Math.cos(t * 0.25));
      } else if (mode === 'serve') {
        o.position.x = m.base.x - 0.4 + Math.sin(t * 0.4 + m.ph) * 1.1;
      } else if (mode === 'greet') {
        faceTo(o, m.baseRot + Math.sin(t * 0.3) * 0.35, dt, 2);
      } else if (mode === 'patrol') {
        const L = m.loopState || (m.loopState = { i: 0, wait: 0 }), [tx, tz, dw] = PATROL[m.id][L.i];
        if (L.wait > 0) {
          mode = 'scan'; faceTo(o, Math.PI, dt, 4); L.wait -= dt;
          if (L.wait <= 0) L.i = (L.i + 1) % PATROL[m.id].length;
        } else {
          const d = new THREE.Vector3(tx - o.position.x, 0, tz - o.position.z), len = d.length(), step = dt * 1.1;
          if (len <= step) { o.position.x = tx; o.position.z = tz; if (dw) L.wait = dw; else L.i = (L.i + 1) % PATROL[m.id].length; }
          else { o.position.addScaledVector(d, step / len); faceTo(o, Math.atan2(d.x, d.z), dt, 8); }
          mode = 'walk';
        }
      }
    }
    const o = m.anchor, rig = o.userData.rig;
    if (m.react && t < m.react.until) mode = m.react.mode;
    else if (m.attn) mode = rig.seated ? 'listen' : 'stand';
    if (rig.robot && mode === 'walk') mode = 'walkBot';
    const p = pose(mode, t, m.ph, amt);
    if (m.attn) {                                                // talking with Mei: look at her
      const y = yawToWorld(o, PLAYER.anchorPos());
      p.hd[1] = THREE.MathUtils.clamp(y, -1, 1);
      if (!rig.seated && Math.abs(y) > 0.5) faceTo(o, o.rotation.y + y, dt, 3);
    } else if (mode === 'listen' && LOOK_AT[m.id]) p.hd[1] = yawTo(o, BY_ID[LOOK_AT[m.id]].anchor);
    applyPose(rig, p, dt);
  });
}

/* =========================================================
   12d. PLAYER — control Mei
   WASD / arrows: walk (camera-relative) · click/tap floor: walk there (A* + stairs)
   click a colleague: walk over and talk · E: interact with what's nearby
   ========================================================= */
const V3 = THREE.Vector3;
const _w = new V3(), _w2 = new V3();
TEAM.forEach(m => { if (m.standObj) m.standObj.userData.member = m; });

// Mei lives in world space so she can move between floors
{
  const wp = new V3(); hero.getWorldPosition(wp);
  hero.parent.remove(hero); scene.add(hero); hero.position.copy(wp);
}
const meiSeat = person(Object.assign({ seated: true }, mei.look));
{
  const r = new THREE.Mesh(ringGeo, mei.ring.material);
  r.rotation.x = -Math.PI / 2; r.position.y = 0.04; meiSeat.add(r);
  meiSeat.userData.member = mei; meiSeat.visible = false; scene.add(meiSeat);
}
const cup = new THREE.Group();
C(cup, 0.07, 0.06, 0.15, P.white, 0, -0.08, 0, 14);
C(cup, 0.072, 0.072, 0.04, P.coral, 0, -0.02, 0, 14);
cup.position.set(0, -0.5, 0.1); cup.visible = false;
hero.userData.rig.armR.add(cup);

const PLAYER = {
  path: [], i: 0, onArrive: null, follow: false, sitting: false, lift: null, cup: 0, talking: null,
  anchorPos() { return (mei.anchor || hero).getWorldPosition(_w2).clone(); }
};

// ---------- walkable grid per floor (furniture, walls, rails, stair openings) ----------
const GRID = { x0: -13, z0: -10, cell: 0.2, nx: 130, nz: 100, r: 0.28 };
const _box = new THREE.Box3();
function buildGrid() {
  FLOORS.forEach((F, f) => {
    const blk = F.block = new Uint8Array(GRID.nx * GRID.nz), lvl = LEVELS[f];
    const mark = (x0, x1, z0, z1, inflate = GRID.r) => {
      const ix0 = Math.max(0, Math.floor((x0 - inflate - GRID.x0) / GRID.cell));
      const ix1 = Math.min(GRID.nx - 1, Math.floor((x1 + inflate - GRID.x0) / GRID.cell));
      const iz0 = Math.max(0, Math.floor((z0 - inflate - GRID.z0) / GRID.cell));
      const iz1 = Math.min(GRID.nz - 1, Math.floor((z1 + inflate - GRID.z0) / GRID.cell));
      for (let iz = iz0; iz <= iz1; iz++) for (let ix = ix0; ix <= ix1; ix++) blk[iz * GRID.nx + ix] = 1;
    };
    const visit = o => {
      if (o.userData.member || navOverlay.includes(o)) return;
      if (o.isMesh && !(o.material && o.material.isMeshBasicMaterial)) {
        _box.setFromObject(o);
        if (_box.max.y - lvl > 0.12 && _box.min.y - lvl < 2.0) mark(_box.min.x, _box.max.x, _box.min.z, _box.max.z);
      }
      o.children.forEach(visit);
    };
    F.group.updateMatrixWorld(true);
    F.group.children.forEach(visit);
    if (f === 1) mark(HOLE_A.x0, HOLE_A.x1, HOLE_A.z0, HOLE_A.z1);
    if (f === 2) mark(HOLE_B.x0, HOLE_B.x1, HOLE_B.z0, HOLE_B.z1);
  });
}
buildGrid();
const cellIx = x => Math.floor((x - GRID.x0) / GRID.cell), cellIz = z => Math.floor((z - GRID.z0) / GRID.cell);
const cellX = ix => GRID.x0 + (ix + 0.5) * GRID.cell, cellZ = iz => GRID.z0 + (iz + 0.5) * GRID.cell;
function freeCell(f, ix, iz) { return ix >= 0 && iz >= 0 && ix < GRID.nx && iz < GRID.nz && !FLOORS[f].block[iz * GRID.nx + ix]; }
const freeAt = (f, x, z) => freeCell(f, cellIx(x), cellIz(z));
function nearestFree(f, x, z, maxR = 20) {
  const cx = cellIx(x), cz = cellIz(z);
  if (freeCell(f, cx, cz)) return [cx, cz];
  for (let r = 1; r <= maxR; r++) {
    let best = null, bd = Infinity;
    for (let dz = -r; dz <= r; dz++) for (let dx = -r; dx <= r; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dz)) !== r || !freeCell(f, cx + dx, cz + dz)) continue;
      const d = dx * dx + dz * dz; if (d < bd) { bd = d; best = [cx + dx, cz + dz]; }
    }
    if (best) return best;
  }
  return null;
}
function los(f, ax, az, bx, bz) {
  const d = Math.hypot(bx - ax, bz - az), n = Math.ceil(d / (GRID.cell * 0.5));
  for (let i = 0; i <= n; i++) { const t = i / n; if (!freeAt(f, ax + (bx - ax) * t, az + (bz - az) * t)) return false; }
  return true;
}
/** A* on the floor grid → smoothed list of {x, z}. */
function astar(f, sx, sz, tx, tz) {
  const s = nearestFree(f, sx, sz), g = nearestFree(f, tx, tz);
  if (!s || !g) return null;
  const { nx, nz } = GRID, N = nx * nz, si = s[1] * nx + s[0], gi = g[1] * nx + g[0];
  const gs = new Float32Array(N).fill(Infinity), came = new Int32Array(N).fill(-1), closed = new Uint8Array(N);
  const heap = []; // [f, idx]
  const push = (fv, i) => { heap.push([fv, i]); let c = heap.length - 1; while (c > 0) { const p = (c - 1) >> 1; if (heap[p][0] <= heap[c][0]) break; [heap[p], heap[c]] = [heap[c], heap[p]]; c = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let c = 0; for (;;) { const l = c * 2 + 1, r = l + 1; let m = c; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === c) break; [heap[m], heap[c]] = [heap[c], heap[m]]; c = m; } } return top; };
  const h = i => Math.hypot((i % nx) - g[0], Math.floor(i / nx) - g[1]);
  gs[si] = 0; push(h(si), si);
  const DIRS = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [-1, -1, 1.414]];
  let found = false;
  while (heap.length) {
    const [, cur] = pop();
    if (closed[cur]) continue;
    if (cur === gi) { found = true; break; }
    closed[cur] = 1;
    const cx = cur % nx, cz = Math.floor(cur / nx);
    for (const [dx, dz, c] of DIRS) {
      const ex = cx + dx, ez = cz + dz;
      if (!freeCell(f, ex, ez)) continue;
      if (dx && dz && (!freeCell(f, cx + dx, cz) || !freeCell(f, cx, cz + dz))) continue;
      const ni = ez * nx + ex, ng = gs[cur] + c;
      if (ng < gs[ni]) { gs[ni] = ng; came[ni] = cur; push(ng + h(ni), ni); }
    }
  }
  if (!found) return null;
  const cells = []; for (let i = gi; i !== -1; i = came[i]) cells.unshift(i);
  const pts = cells.map(i => ({ x: cellX(i % nx), z: cellZ(Math.floor(i / nx)) }));
  if (freeAt(f, tx, tz)) pts[pts.length - 1] = { x: tx, z: tz };
  const out = [pts[0]];
  for (let i = 0; i < pts.length - 1;) {
    let j = pts.length - 1;
    while (j > i + 1 && !los(f, pts[i].x, pts[i].z, pts[j].x, pts[j].z)) j--;
    out.push(pts[j]); i = j;
  }
  return out;
}
const STAIRS = {
  A: { lo: { x: -5.0, z: -8.97 }, hi: { x: -12.1, z: -8.6 },  via: [new V3(-5.4, 0.05, -8.97), new V3(-11.5, FH, -8.97)] },
  B: { lo: { x: -12.1, z: -7.33 }, hi: { x: -5.0, z: -7.33 }, via: [new V3(-11.5, FH, -7.33), new V3(-5.5, FH * 2, -7.33)] }
};
/** World-space route between any two floor points, taking the stairs between floors. */
function planRoute(fromF, from, toF, to) {
  const pts = []; let f = fromF, cur = { x: from.x, z: from.z };
  const add = (list, fl) => list.forEach(p => pts.push(new V3(p.x, LEVELS[fl], p.z)));
  while (f !== toF) {
    const up = toF > f, st = STAIRS[up ? (f === 0 ? 'A' : 'B') : (f === 1 ? 'A' : 'B')];
    const on = up ? st.lo : st.hi, off = up ? st.hi : st.lo;
    const leg = astar(f, cur.x, cur.z, on.x, on.z); if (!leg) return null;
    add(leg, f);
    (up ? st.via : [...st.via].reverse()).forEach(v => pts.push(v.clone()));
    f += up ? 1 : -1; cur = off; pts.push(new V3(off.x, LEVELS[f], off.z));
  }
  const last = astar(f, cur.x, cur.z, to.x, to.z); if (!last) return null;
  add(last, f);
  return pts;
}

// ---------- movement ----------
const keys = new Set();
const MOVE_KEYS = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'escape') { closeDialog(); closeBoard(); return; }
  if (e.target.closest && e.target.closest('input, textarea, select, .csel, .csel-list')) return;
  if (document.getElementById('taskEd').classList.contains('show')) return;
  if (boardEl.classList.contains('show')) return;
  if (MOVE_KEYS.includes(k)) { keys.add(k); e.preventDefault(); }
  if (k === 'e' && !e.repeat) { const n = nearby(); if (n) n.act(); }
  if (PLAYER.inLift && ['1', '2', '3'].includes(k)) selectLiftFloor(+k - 1);
});
addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
addEventListener('blur', () => keys.clear());

const marker = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.045, 8, 40), new THREE.MeshBasicMaterial({ color: '#f2b632', transparent: true, toneMapped: false }));
marker.rotation.x = -Math.PI / 2; marker.visible = false; scene.add(marker);
let markerT = 0;

function goTo(f, x, z, onArrive) {
  if (PLAYER.inLift) { say(mei, LIFT.state === 'open' ? 'Press E to exit the lift first' : 'Wait for the lift to arrive', 2); return; }
  if (PLAYER.sitting) standUp();
  const r = planRoute(mei.floor, hero.position, f, { x, z });
  if (!r) { say(mei, 'Can’t get there'); return; }
  PLAYER.path = r; PLAYER.i = 0; PLAYER.onArrive = onArrive || null;
  setFollow(true);
  if (PLAYER.talking) closeDialog();
  marker.position.set(r[r.length - 1].x, LEVELS[f] + 0.06, r[r.length - 1].z); marker.visible = true; markerT = 1.2;
}
function memberTarget(m) {
  if (m.at.desk && !m.trip && DESK[m.at.desk].nav) {
    const n = NAV.nodes[DESK[m.at.desk].nav]; return { f: n.floor, x: n.x, z: n.z };
  }
  m.anchor.getWorldPosition(_w);
  return { f: m.floor, x: _w.x, z: _w.z };
}
function distTo(m) { m.anchor.getWorldPosition(_w); return Math.hypot(_w.x - hero.position.x, _w.z - hero.position.z); }
function walkToMember(m, tries = 0) {
  if (m.player) return;
  if (m.floor === mei.floor && distTo(m) < 2.0 && !PLAYER.sitting) { openDialog(m); return; }
  const tg = memberTarget(m);
  goTo(tg.f, tg.x, tg.z, () => {
    if (m.floor === mei.floor && distTo(m) < 3.0) openDialog(m);
    else if (tries < 3) walkToMember(m, tries + 1);           // they moved — catch up
  });
}
function onTagClick(m) { if (!m.player) walkToMember(m); }

// ---------- seats Mei can use: free desks, focus booths, rest seats, meeting chairs ----------
const SEATS = [];
function addSeat(floor, x, z, facing, kind, o = {}) { SEATS.push(Object.assign({ floor, x, z, facing, kind, y: 0, app: 'behind' }, o)); }
DESKS.forEach(d => addSeat(d.floor, d.seat.x, d.seat.z, d.facing, 'desk', { desk: d }));
[[2, 7.8, 4.5], [2, 9.4, 4.5], [0, -9.2, 5.3], [0, -7.6, 5.3]].forEach(([f, x, z]) => addSeat(f, x, z, 0, 'rest', { y: 0.02, app: 'front', what: 'sofa' }));
addSeat(2, 5.6, 6.5, Math.PI / 2, 'rest', { y: -0.08, app: 'front', what: 'armchair' });
addSeat(0, -11.1, 7.2, Math.PI / 2, 'rest', { y: -0.08, app: 'front', what: 'armchair' });
[[10.6, 6.8], [11.8, 8.0]].forEach(([x, z]) => addSeat(1, x, z, Math.atan2(7.5 - x, 2 - z), 'rest', { y: -0.12, app: 'front', what: 'beanbag' }));
[[4.5, 3.0], [9.0, 3.0], [4.5, 7.2], [9.0, 7.2]].forEach(([x, z]) => {
  addSeat(0, x - 1.0, z, Math.PI / 2, 'rest', { what: 'café seat' });
  addSeat(0, x + 1.0, z, -Math.PI / 2, 'rest', { what: 'café seat' });
});
[3.2, 5.3, 7.4].forEach(x => addSeat(2, x, -2.8, Math.PI, 'focus', { y: -0.09 }));
[6.3, 7.6, 8.9].forEach(x => { addSeat(2, x, -8.85, 0, 'meeting'); addSeat(2, x, -6.55, Math.PI, 'meeting'); });

const SIT_KIND = {
  desk:    { status: null,      activity: null,           say: 'Let’s work!',         pose: 'type' },
  focus:   { status: null,      activity: null,           say: 'Focus mode on', pose: 'type' },
  rest:    { status: 'idle',    activity: 'Resting',        say: 'Time for a break',     pose: 'relax' },
  meeting: { status: 'meeting', activity: 'Weekly: Q4 roadmap', say: 'I’ll sit in',     pose: 'listen' }
};
function seatLabel(s) {
  if (s.kind === 'desk') return s.desk.owner === 'mei' ? 'Back to my desk' : 'Work here (free desk)';
  if (s.kind === 'focus') return 'Enter focus booth';
  if (s.kind === 'meeting') return 'Join meeting';
  return `Rest · ${s.what}`;
}
function seatFree(s) {
  if (PLAYER.seat === s) return false;
  if (s.kind === 'desk' && s.desk.member) return false;
  return !TEAM.some(m => {
    if (m.player || m.away || m.floor !== s.floor) return false;
    m.anchor.getWorldPosition(_w);
    return Math.hypot(_w.x - s.x, _w.z - s.z) < 0.5;
  });
}
function seatNear(f, x, z, r) {
  let best = null, bd = r;
  SEATS.forEach(s => { if (s.floor !== f || !seatFree(s)) return; const d = Math.hypot(s.x - x, s.z - z); if (d < bd) { bd = d; best = s; } });
  return best;
}
function seatApproach(s) {                // free standing spots around a seat, best first
  const pref = s.app === 'front' ? 0 : Math.PI, out = [];
  [0.9, 1.3, 1.7, 2.2].forEach(rad => {
    for (let k = 0; k < 8; k++) {
      const a = s.facing + pref + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * Math.PI / 4;
      const c = nearestFree(s.floor, s.x + Math.sin(a) * rad, s.z + Math.cos(a) * rad, 2);
      if (c) out.push({ x: cellX(c[0]), z: cellZ(c[1]) });
    }
  });
  return out;
}
function sitAt(s) {
  if (PLAYER.inLift) return;
  if (!seatFree(s)) { say(mei, 'Seat taken', 2); return; }
  if (mei.floor === s.floor && !PLAYER.sitting && Math.hypot(hero.position.x - s.x, hero.position.z - s.z) < 1.4) { doSit(s); return; }
  if (PLAYER.sitting) standUp(true);
  for (const ap of seatApproach(s)) {
    if (!freeAt(s.floor, ap.x, ap.z)) continue;
    const r = planRoute(mei.floor, hero.position, s.floor, ap);
    if (r) {
      goTo(s.floor, ap.x, ap.z, () => {
        if (mei.floor === s.floor && Math.hypot(hero.position.x - s.x, hero.position.z - s.z) < 2.8 && seatFree(s)) doSit(s);
      });
      return;
    }
  }
  setMeiState(null, null);
  say(mei, 'Can’t get there', 2);
}
function setMeiState(status, activity) {
  if (status) WORK.mei.status = status; else delete WORK.mei.status;
  mei.work.activity = activity || null;
  mei.work.note = status === 'idle' ? 'Relaxing in the lounge' : status === 'meeting' ? 'Sitting in' : null;
  recompute(mei); applyStatus(mei); refreshFilter();
}
function doSit(s) {
  closeDialog();
  if (PLAYER.sitting) standUp(true);
  const L0 = LEVELS[s.floor];
  meiSeat.position.set(s.x, L0 + (s.y || 0), s.z); meiSeat.rotation.y = s.facing;
  PLAYER.sitting = true; PLAYER.seat = s; PLAYER.path = []; PLAYER.workT = 0;
  meiSeat.visible = true; mei.anchor = meiSeat;
  PLAYER.standPt = seatApproach(s).find(ap => freeAt(s.floor, ap.x, ap.z)) || { x: hero.position.x, z: hero.position.z };
  hero.position.set(PLAYER.standPt.x, L0, PLAYER.standPt.z);
  const k = SIT_KIND[s.kind];
  setMeiState(k.status, k.activity);
  if (s.kind === 'desk' && s.desk.owner !== 'mei') {                       // light up the borrowed desk
    const sm = s.desk.screen.material, c = lin(STATUS[mei.work.status].color);
    sm.color = c; sm.emissive = c; sm.emissiveIntensity = 0.95;
  }
  say(mei, k.say, 2.2);
  if (CHASE.on) chooseChaseYaw(s.kind === 'meeting');
  if (s.kind === 'desk' || s.kind === 'focus') pomoOnSit();
  if (s.kind === 'meeting') setTimeout(() => say(BY_ID.mia, `Welcome, ${PNAME}! We’re on the Q4 roadmap.`, 3.5), 700);
  if (s.kind === 'rest' && s.floor === 2 && BY_ID.rin.work.status === 'idle') setTimeout(() => say(BY_ID.rin, 'Take a break with me!', 2.5), 800);
}
function standUp(quiet) {
  const s = PLAYER.seat;
  if (s && (s.kind === 'desk' || s.kind === 'focus')) pomoOnStand();
  PLAYER.sitting = false; PLAYER.seat = null; meiSeat.visible = false; mei.anchor = hero;
  if (s) {
    if (s.kind === 'desk' && s.desk.owner !== 'mei') {
      const sm = s.desk.screen.material; sm.color = lin(P.lavender); sm.emissive = lin(P.lavender); sm.emissiveIntensity = 0.2;
    }
    hero.rotation.y = Math.atan2(hero.position.x - s.x, hero.position.z - s.z);
    if (!quiet) setMeiState(null, null); else { delete WORK.mei.status; }
  }
}
function sitDown() { const s = SEATS.find(x => x.desk && x.desk.owner === 'mei'); if (s) sitAt(s); }

// ---------- interactables ----------
const SPOTS = [];
[0, 1, 2].forEach(f => SPOTS.push({ floor: f, x: SHAFT.cx, z: -6.7, r: 1.5, lift: true,
  label: () => {
    if (LIFT.state !== 'moving' && LIFT.floor === f && LIFT.door > 0.3) return 'Enter lift';
    return LIFT.queue.includes(f) ? 'Lift arriving…' : 'Call lift';
  },
  act: () => {
    if (LIFT.state !== 'moving' && LIFT.floor === f && LIFT.door > 0.3) boardLift();
    else { liftCall(f); say(mei, 'Ding!', 1.2); }
  } }));
SPOTS.push({ floor: 0, x: -5.0, z: -8.97, r: 1.0, label: 'Upstairs → 2F', act: () => takeStairs(1, STAIRS.A.hi) });
SPOTS.push({ floor: 1, x: -12.1, z: -8.6, r: 0.75, label: 'Downstairs → 1F', act: () => takeStairs(0, STAIRS.A.lo) });
SPOTS.push({ floor: 1, x: -12.1, z: -7.33, r: 0.75, label: 'Upstairs → 3F', act: () => takeStairs(2, STAIRS.B.hi) });
SPOTS.push({ floor: 2, x: -5.0, z: -7.33, r: 1.0, label: 'Downstairs → 2F', act: () => takeStairs(1, STAIRS.B.lo) });
SPOTS.push({ floor: 0, x: 6.6, z: -0.4, r: 1.4, label: 'Get a coffee from Bolt', act: getCoffee });
SPOTS.push({ floor: 1, x: 7.5, z: -1.2, r: 1.5, label: 'Open team board', act: openBoard });
function takeStairs(toF, off) {
  if (PLAYER.sitting) standUp();
  const r = planRoute(mei.floor, hero.position, toF, off);
  if (r) { PLAYER.path = r; PLAYER.i = 0; PLAYER.onArrive = null; setFollow(true); }
}
// elevator: walk in, choose a floor, ride, walk out
const CAB_IN = () => new V3(SHAFT.cx + 0.35, LIFT.y, -9.08);
function boardLift() {
  if (PLAYER.sitting) standUp();
  closeDialog();
  const L0 = LEVELS[mei.floor];
  LIFT.hold = true;
  PLAYER.path = [new V3(SHAFT.cx, L0, -6.7), new V3(SHAFT.cx, L0, -7.75), new V3(SHAFT.cx + 0.35, L0, -9.08)];
  PLAYER.i = 0; setFollow(true);
  PLAYER.onArrive = () => {
    PLAYER.inLift = true; LIFT.hold = false; LIFT.timer = 3.5; PLAYER.liftDest = null;
    say(mei, 'Which floor?', 2);
  };
}
function selectLiftFloor(f) {
  if (!PLAYER.inLift) return;
  if (f === LIFT.floor && LIFT.state !== 'moving') { liftCall(f); return; }   // re-open here
  PLAYER.liftDest = f; liftCall(f);
  if (LIFT.state === 'open') LIFT.timer = Math.min(LIFT.timer, 0.7);
}
function exitLift() {
  if (!PLAYER.inLift || LIFT.state === 'moving' || LIFT.door < 0.6) return;
  const L0 = LEVELS[LIFT.floor];
  PLAYER.inLift = false; LIFT.hold = true; PLAYER.liftDest = null;
  hero.position.set(SHAFT.cx + 0.35, L0, -9.08);
  PLAYER.path = [new V3(SHAFT.cx, L0, -8.3), new V3(SHAFT.cx, L0, -7.75), new V3(SHAFT.cx, L0, -6.6)]; PLAYER.i = 0;
  PLAYER.onArrive = () => { LIFT.hold = false; LIFT.timer = 1.5; };
  CHASE.yaw = 0;
}
function getCoffee() {
  const bolt = BY_ID.bolt;
  say(bolt, 'Your latte, enjoy!'); bolt.react = { mode: 'wave', until: clock.elapsedTime + 2 };
  PLAYER.cup = 60; cup.visible = true;
  setTimeout(() => say(mei, 'Thanks, Bolt!'), 900);
}
function nearby() {
  if (PLAYER.path.length) return null;
  const p = hero.position, f = mei.floor;
  if (PLAYER.sitting) return { label: 'Stand up', act: () => { standUp(); } };
  if (PLAYER.inLift) {
    const canExit = LIFT.state !== 'moving' && LIFT.door > 0.6;
    const buttons = [0, 1, 2].map(k => ({
      kbd: `${k + 1}`, label: `${k + 1}F ${FLOOR_INFO[k].title.split('· ')[1]}`,
      on: LIFT.queue.includes(k) || LIFT.target === k || PLAYER.liftDest === k, act: () => selectLiftFloor(k)
    }));
    if (canExit) buttons.unshift({ kbd: 'E', label: 'Exit lift', act: exitLift });
    return { label: 'lift:' + buttons.map(b => b.label + (b.on ? '*' : '')).join('|'), buttons, act: canExit ? exitLift : () => {} };
  }
  let best = null, bd = Infinity;
  SPOTS.forEach(s => {
    if (s.floor !== f) return;
    const d = Math.hypot(s.x - p.x, s.z - p.z);
    if (d < s.r && d * 0.7 < bd) { bd = d * 0.7; best = typeof s.label === 'function' ? { label: s.label(), act: s.act } : s; }
  });
  SEATS.forEach(s => {
    if (s.floor !== f) return;
    const d = Math.hypot(s.x - p.x, s.z - p.z);
    if (d < 1.35 && d * 0.75 < bd && seatFree(s)) { bd = d * 0.75; best = { label: seatLabel(s), act: () => sitAt(s) }; }
  });
  TEAM.forEach(m => {
    if (m.player || m.away || m.floor !== f) return;
    const d = distTo(m);
    if (d < 2.0 && d < bd) { bd = d; best = { label: `Talk to ${m.name}`, act: () => openDialog(m), m }; }
  });
  return best;
}

// ---------- prompt / bubbles ----------
const promptEl = document.getElementById('prompt');
let promptLock = 0, promptKey = '';
function updatePrompt(dt) {
  if (promptLock > 0) { promptLock -= dt; if (promptLock > 0) return; }
  if (PLAYER.talking || boardEl.classList.contains('show')) { promptEl.classList.remove('show'); promptKey = ''; return; }
  const n = nearby();
  const key = n ? n.label : '';
  if (key === promptKey) return;
  promptKey = key;
  if (!n) { promptEl.classList.remove('show'); return; }
  if (n.buttons) {
    promptEl.innerHTML = n.buttons.map((b, i) => `<button data-i="${i}" class="${b.on ? 'lit' : ''}"><kbd>${b.kbd}</kbd>${esc(b.label)}</button>`).join('');
    promptEl.querySelectorAll('button').forEach(el => el.addEventListener('click', () => n.buttons[+el.dataset.i].act()));
  } else {
    promptEl.innerHTML = `<button><kbd>E</kbd>${esc(n.label)}</button>`;
    promptEl.querySelector('button').addEventListener('click', () => { const c = nearby(); if (c) c.act(); });
  }
  promptEl.classList.add('show');
}
const BUBBLES = [];
function say(m, text, sec = 3.6) {
  const old = BUBBLES.find(b => b.m === m); if (old) { old.el.remove(); BUBBLES.splice(BUBBLES.indexOf(old), 1); }
  const el = document.createElement('div');
  el.className = 'bubble' + (m.player ? ' me' : ''); el.textContent = text;
  tagsLayer.appendChild(el);
  BUBBLES.push({ m, el, until: clock.elapsedTime + sec });
}
function updateBubbles(t) {
  const W = window.innerWidth, H = window.innerHeight;
  for (let i = BUBBLES.length - 1; i >= 0; i--) {
    const b = BUBBLES[i], o = b.m.anchor || b.m.object;
    if (t > b.until) { b.el.remove(); BUBBLES.splice(i, 1); continue; }
    if (!FLOORS[b.m.floor].group.visible || b.m.away) { b.el.style.display = 'none'; continue; }
    o.localToWorld(_w.set(0, o.userData.headY + 1.35, 0)).project(viewCam);
    if (_w.z > 1) { b.el.style.display = 'none'; continue; }
    b.el.style.display = '';
    b.el.style.transform = `translate(${((_w.x + 1) / 2 * W).toFixed(1)}px, ${((1 - _w.y) / 2 * H).toFixed(1)}px) translate(-50%, -100%)`;
  }
}

// ---------- talking with colleagues ----------
const dlgEl = document.getElementById('dlg');
const ACT = { blocked: [['Help out', 'help']], review: [['Approve', 'approve'], ['Reject', 'reject']], working: [['Ask for update', 'ask']], todo: [['Nudge to start', 'start']], backlog: [['Move to To do', 'plan']] };
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
function eta(m, t) {
  if (t.progress == null) return 'It’s ongoing work';
  const rem = 100 - t.progress;
  if (m.kind === 'ai') return `Done in about ${Math.max(3, Math.round(rem * 0.5))} min`;
  const d = new Date(Date.now() + rem * 5 * 60000), now = new Date();
  const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return d.getDate() === now.getDate() ? `Done by ${hm} today` : `Done by ${hm} tomorrow`;
}
function greeting(m) {
  const w = m.work;
  if (w.status === 'meeting') return pick(['In a meeting, I’ll find you after!', 'Shh, in a meeting. Later!']);
  if (w.status === 'idle') return m.kind === 'ai' ? 'I’m free and can take new tasks.' : pick(['On a break, what’s up?', `Hi ${PNAME}, tea?`]);
  if (w.status === 'blocked') return `${w.current ? `“${w.current.title}”` : 'A task'} is stuck: ${(w.current && w.current.note) || 'need help'}`;
  if (m.kind === 'ai') return `Hi ${PNAME}, I’m ${m.name}, working on “${w.current ? w.current.title : 'a task'}”.`;
  return pick([`Hi ${PNAME}!`, 'Hey, need me?', 'Perfect timing, I was looking for you!']);
}
function recompute(m) { if (!m.pool) deriveWork(m.work, WORK[m.id] || {}); }
function doAction(m, task, a) {
  const t = clock.elapsedTime;
  let reply = '';
  if (a === 'help') {
    task.blocked = false; task.helper = null; task.note = null; task.progress = task.progress == null ? null : Math.min(100, task.progress + 10); task.updated = 0;
    reply = pick([`Great, thanks ${PNAME}! Back to it.`, 'Finally unblocked, thank you!']);
    m.react = { mode: 'cheer', until: t + 2.4 };
  } else if (a === 'approve') {
    noteHandled(task, m); task.status = 'done'; task.progress = 100; task.updated = 0; task.note = null;
    reply = pick(['Got it, I’ll plan the next step!', 'Yay, approved!']);
    m.react = { mode: 'cheer', until: t + 2.0 };
  } else if (a === 'reject') {
    noteHandled(task, m); task.status = 'working'; task.rejected = (task.rejected || 0) + 1; task.note = 'Rejected: needs changes'; task.updated = 0;
    reply = pick(['Got it, I’ll revise.', 'OK, I’ll revise and resubmit.']);
  } else if (a === 'plan') {
    task.status = 'todo'; task.updated = 0;
    reply = 'OK, it’s in To do now.';
  } else if (a === 'ask') {
    reply = `“${task.title}” is at ${pctOf(task)}. ${eta(m, task)}.`;
  } else if (a === 'start') {
    task.status = 'working'; task.progress = 5; task.updated = 0;
    reply = 'OK, starting now!';
  } else if (a === 'greet') {
    reply = greeting(m);
    if (!m.react || t > m.react.until) m.react = { mode: 'wave', until: t + 1.6 };
  }
  if (a !== 'ask' && a !== 'greet') { recompute(m); applyStatus(m); refreshFilter(); }
  say(m, reply, 4.2);
  renderDialog(m, reply);
}
function renderDialog(m, line) {
  const w = m.work, st = STATUS[w.status];
  const tasks = (w.activity ? w.tasks : [w.current, ...w.others]).filter(t => t && t.status !== 'closed');
  dlgEl.innerHTML = `
    <div class="dh">
      <span class="av ${m.kind === 'ai' ? 'ai' : 'human'}" style="--b:${m.look.body || (m.kind === 'ai' ? P.violet : P.lavender)}"></span>
      <div class="who"><b>${esc(m.name)}</b><span class="role">${esc(w.role || '')}</span>
        <div class="st"><span class="chip st-${w.status}" style="background:${st.color}">${st.label}</span>${esc(w.loc)}${w.activity ? ` · ${esc(w.activity)}` : ''}</div></div>
      <button class="x" title="Close (Esc)">×</button>
    </div>
    <div class="say"><b>${esc(m.name)}:</b> ${esc(line)}</div>
    <div class="tl">${tasks.map((t, i) => {
      const ts = tsOf(t), acts = (t.status === 'review' && handlerOf(t, m) !== 'mei') ? [['Ask for update', 'ask']] : (ACT[tsKey(t)] || []);
      return `<div class="tr ${t.status === 'done' ? 'done' : ''}"><i style="background:${ts.color}"></i>
        <div class="tx"><div>${esc(t.title)}</div><small class="${isBlocked(t) ? 'bad' : ''}">${ts.label} · ${esc(t.priority || '')} · ${esc(t.project)} · ${pctOf(t)}${t.note ? ' · ' + esc(t.note) : ''}</small></div>
        ${acts.map(a => `<button class="a-${a[1]}" data-i="${i}" data-a="${a[1]}">${a[0]}</button>`).join('')}</div>`;
    }).join('')}</div>
    <div class="acts"><button data-a="greet">Say hi</button><button data-a="locate">View on board</button></div>`;
  dlgEl.querySelector('.x').addEventListener('click', closeDialog);
  dlgEl.querySelectorAll('.tr button').forEach(b => b.addEventListener('click', () => doAction(m, tasks[+b.dataset.i], b.dataset.a)));
  dlgEl.querySelector('[data-a="greet"]').addEventListener('click', () => doAction(m, null, 'greet'));
  dlgEl.querySelector('[data-a="locate"]').addEventListener('click', () => {
    setPanel(true); KB.q = m.name; document.getElementById('kbQ').value = m.name; setTab('all');
  });
}
function openDialog(m) {
  if (PLAYER.talking && PLAYER.talking !== m) PLAYER.talking.attn = false;
  PLAYER.talking = m; m.attn = true;
  const line = greeting(m);
  say(m, line, 4);
  renderDialog(m, line);
  dlgEl.classList.add('show');
}
function closeDialog() {
  if (PLAYER.talking) PLAYER.talking.attn = false;
  PLAYER.talking = null; dlgEl.classList.remove('show');
}

// ---------- team board (all tasks as kanban) ----------
const boardEl = document.getElementById('board');
function openBoard() { closeDialog(); setPanel(true); setTab('all'); }
function closeBoard() { boardEl.classList.remove('show'); }

// ---------- camera follow ----------
function setFollow(on) { PLAYER.follow = on; if (on) camGoal.target = null; }   // camera follows Mei automatically whenever she moves
document.querySelectorAll('#floors button[data-f]').forEach(b => b.addEventListener('click', () => { if (CHASE.on) setChase(false, b.dataset.f); setFollow(false); }));
let _pd = null;
renderer.domElement.addEventListener('pointerdown', e => {
  _pd = { x: e.clientX, y: e.clientY, pan: !CHASE.on && e.button === 0 && !e.shiftKey && !e.ctrlKey && !e.metaKey };
});
renderer.domElement.addEventListener('pointermove', e => {
  if (_pd && _pd.pan && Math.hypot(e.clientX - _pd.x, e.clientY - _pd.y) > 6) { setFollow(false); _pd.pan = false; }
});
addEventListener('pointerup', () => { _pd = null; });
const _origFocus = focusMember;
focusMember = function (m) { if (CHASE.on) { walkToMember(m); return; } setFollow(false); _origFocus(m); };

// ---------- click / tap to move ----------
function pickAt(cx, cy) {
  const r = renderer.domElement.getBoundingClientRect();
  ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(ndc, viewCam);
  const roots = FLOORS.filter(F => F.group.visible).map(F => F.group).concat([walkers]);
  for (const h of raycaster.intersectObjects(roots, true)) {
    const ob = h.object;
    if (!ob.isMesh || !ob.visible) continue;
    if (ob.material && ob.material.transparent && ob.material.opacity < 0.5 && !ob.material.map) continue;   // glass
    let a = ob; while (a && !a.userData.member) a = a.parent;
    if (a && a.userData.member && !a.userData.member.player) return { member: a.userData.member };
    let f = 0;
    for (let i = 2; i >= 0; i--) if (FLOORS[i].group.visible && LEVELS[i] <= h.point.y + 0.35) { f = i; break; }
    return { floor: f, x: h.point.x, z: h.point.z };
  }
  return null;
}
renderer.domElement.addEventListener('click', e => {
  if (Math.hypot(e.clientX - _downXY[0], e.clientY - _downXY[1]) > 5) return;
  const hit = pickAt(e.clientX, e.clientY);
  if (!hit) return;
  if (hit.member) walkToMember(hit.member);
  else if (seatNear(hit.floor, hit.x, hit.z, 0.9)) sitAt(seatNear(hit.floor, hit.x, hit.z, 0.9));
  else goTo(hit.floor, hit.x, hit.z);
});

// ---------- per-frame ----------
const _fwd = new V3(), _rt = new V3(), _mv = new V3();
let lastFloor = mei.floor;
function updatePlayer(t, dt) {
  const o = hero;
  let moving = false;
  if (PLAYER.inLift && !PLAYER.path.length) {             // riding: stand in the cabin
    o.position.copy(CAB_IN()); faceTo(o, 0, dt, 6);
    if (PLAYER.liftDest === LIFT.floor && LIFT.state === 'open') {   // arrived → step out
      const arrived = LIFT.floor; exitLift(); say(mei, `Arrived at ${arrived + 1}F`, 2);
    }
  } else if (PLAYER.sitting) {                             // any move key stands Mei up
    if (MOVE_KEYS.some(k => keys.has(k))) standUp();
  } else {
    const kx = (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0);
    const kz = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0);
    const onFlat = Math.abs(o.position.y - LEVELS[mei.floor]) < 0.05;
    if ((kx || kz) && onFlat && !PLAYER.inLift) {
      PLAYER.path = []; PLAYER.onArrive = null;
      if (PLAYER.talking) closeDialog();
      let step = 3.2 * dt;
      if (CHASE.on) {                                      // Mei's own frame: W/S walk, A/D turn
        o.rotation.y -= kx * 2.6 * dt;
        _mv.set(Math.sin(o.rotation.y), 0, Math.cos(o.rotation.y)).multiplyScalar(Math.sign(kz));
        if (kz < 0) step *= 0.55;
        if (kz) CHASE.yaw *= Math.exp(-3 * dt);
      } else {
        camera.getWorldDirection(_fwd); _fwd.y = 0; _fwd.normalize();
        _rt.set(-_fwd.z, 0, _fwd.x);
        _mv.copy(_fwd).multiplyScalar(kz).addScaledVector(_rt, kx).normalize();
      }
      const f = mei.floor;
      const nx = o.position.x + _mv.x * step, nz = o.position.z + _mv.z * step;
      if (freeAt(f, nx, o.position.z)) o.position.x = nx;
      if (freeAt(f, o.position.x, nz)) o.position.z = nz;
      if (!CHASE.on) faceTo(o, Math.atan2(_mv.x, _mv.z), dt, 12);
      moving = kz !== 0 || !CHASE.on;
      if (!PLAYER.follow) setFollow(true);
    } else if (PLAYER.path.length) {
      let budget = dt * 3.2;
      while (budget > 0 && PLAYER.i < PLAYER.path.length) {
        const tg = PLAYER.path[PLAYER.i], d = tg.clone().sub(o.position), len = d.length();
        const slope = len > 1e-4 ? Math.abs(d.y) / len : 0, step = budget * (slope > 0.2 ? 0.6 : 1);
        if (len <= step) { o.position.copy(tg); budget -= len; PLAYER.i++; }
        else { o.position.addScaledVector(d, step / len); budget = 0; if (Math.hypot(d.x, d.z) > 1e-3) faceTo(o, Math.atan2(d.x, d.z), dt, 12); }
      }
      moving = true;
      if (PLAYER.i >= PLAYER.path.length) {
        PLAYER.path = []; const cb = PLAYER.onArrive; PLAYER.onArrive = null; if (cb) cb();
      }
    }
  }
  // floor bookkeeping
  mei.floor = THREE.MathUtils.clamp(Math.round(o.position.y / FH), 0, 2);
  if (mei.floor !== lastFloor) { lastFloor = mei.floor; if (PLAYER.follow && !CHASE.on) showFloor(mei.floor, false); }
  o.visible = !PLAYER.sitting && FLOORS[mei.floor].group.visible;
  meiSeat.visible = PLAYER.sitting && FLOORS[mei.floor].group.visible;
  // face the colleague we're talking to; drop the chat if they walked away
  if (PLAYER.talking) {
    const m = PLAYER.talking;
    if (m.floor !== mei.floor || distTo(m) > 3.2) closeDialog();
    else if (!moving && !PLAYER.sitting) { m.anchor.getWorldPosition(_w); faceTo(o, Math.atan2(_w.x - o.position.x, _w.z - o.position.z), dt, 6); }
  }
  // coffee
  if (PLAYER.cup > 0) { PLAYER.cup -= dt; if (PLAYER.cup <= 0) cup.visible = false; }
  // pose
  if (PLAYER.sitting) {
    const kind = PLAYER.seat ? PLAYER.seat.kind : 'desk';
    const sp = pose(POMO.state === 'break' && (kind === 'desk' || kind === 'focus') ? 'relax' : SIT_KIND[kind].pose, t, mei.ph || 0);
    if (kind === 'meeting') sp.hd[1] = THREE.MathUtils.clamp(yawToWorld(meiSeat, BY_ID.mia.anchor.getWorldPosition(new V3())), -1, 1);
    applyPose(meiSeat.userData.rig, sp, dt);
  }
  const mode = moving ? 'walk' : PLAYER.talking ? 'talk' : PLAYER.cup > 0 ? 'sip' : 'stand';
  applyPose(o.userData.rig, pose(mode, t, mei.ph || 0), dt);
  // camera
  if (CHASE.on) updateChase(dt, moving);
  updateXray(dt);
  if (PLAYER.follow || CHASE.on) {
    const a = PLAYER.anchorPos();
    _w.set(a.x, a.y + 0.8, a.z).sub(controls.target).multiplyScalar(1 - Math.exp(-5 * dt));
    controls.target.add(_w); camera.position.add(_w);
  }
  // click marker
  if (markerT > 0) { markerT -= dt; marker.material.opacity = Math.max(0, markerT / 1.2); marker.scale.setScalar(1 + (1.2 - markerT) * 0.6); if (markerT <= 0) marker.visible = false; }
  updatePrompt(dt);
  updateBubbles(t);
}
function yawToWorld(o, worldPos) {
  o.getWorldPosition(_w);
  return wrapAngle(Math.atan2(worldPos.x - _w.x, worldPos.z - _w.z) - o.rotation.y);
}

/* =========================================================
   12e. PLAYER VIEW — third-person camera behind Mei (default) ⇄ isometric overview
   Chase: W/↑ forward · S/↓ back · A/D turn · drag to look around · wheel = distance · V = switch view
   ========================================================= */
const chaseCam = new THREE.PerspectiveCamera(55, aspect, 0.1, 400);
let viewCam = chaseCam;
const CHASE = { on: true, dist: 5.0, yaw: 0, pitch: 0.38, pos: new V3(), look: new V3(), snap: true };
const _ray2 = new THREE.Raycaster();
function updateChase(dt, moving) {
  const base = PLAYER.anchorPos(), f = mei.floor;
  const head = base.clone(); head.y += 1.45;
  const facing = (mei.anchor || hero).rotation.y;
  if (moving && !_drag) CHASE.yaw *= Math.exp(-2.5 * dt);           // drift back behind her
  const ang = facing + Math.PI + CHASE.yaw;
  const horiz = Math.cos(CHASE.pitch) * CHASE.dist, up = Math.sin(CHASE.pitch) * CHASE.dist;
  const want = new V3(head.x + Math.sin(ang) * horiz, head.y + up, head.z + Math.cos(ang) * horiz);
  want.y = Math.min(want.y, LEVELS[f] + 3.95);                       // stay under the ceiling
  // keep walls / slabs from getting between camera and Mei
  const dir = want.clone().sub(head), len = dir.length(); dir.divideScalar(len);
  const occ = FLOORS[f].occluders.concat(f < 2 ? FLOORS[f + 1].occluders : []);
  _ray2.set(head, dir); _ray2.far = len;
  const hit = _ray2.intersectObjects(occ, false)[0];
  if (hit) want.copy(head).addScaledVector(dir, Math.max(0.6, hit.distance - 0.3));
  let look = base.clone(); look.y += 1.15;
  if (PLAYER.inLift && !PLAYER.path.length) {               // riding: camera inside the cabin, looking out through the glass
    cabin.updateMatrixWorld();
    want.copy(cabin.localToWorld(new V3(-1.05, 1.62, 0.82)));
    look = cabin.localToWorld(new V3(0.42, 1.05, -0.48));
    if (chaseCam.fov !== 72) { chaseCam.fov += (72 - chaseCam.fov) * Math.min(1, dt * 6); chaseCam.updateProjectionMatrix(); }
    CHASE.pos.lerp(want, 1 - Math.exp(-8 * dt)); CHASE.look.lerp(look, 1 - Math.exp(-8 * dt));
    if (LIFT.state === 'moving') { CHASE.pos.y = want.y; CHASE.look.y = look.y; }
    chaseCam.position.copy(CHASE.pos); chaseCam.lookAt(CHASE.look);
    return;
  }
  if (chaseCam.fov !== 55) { chaseCam.fov += (55 - chaseCam.fov) * Math.min(1, dt * 6); if (Math.abs(chaseCam.fov - 55) < 0.05) chaseCam.fov = 55; chaseCam.updateProjectionMatrix(); }
  if (CHASE.snap) { CHASE.pos.copy(want); CHASE.look.copy(look); CHASE.snap = false; }
  else {
    CHASE.pos.lerp(want, 1 - Math.exp(-(hit ? 14 : 6) * dt));
    CHASE.look.lerp(look, 1 - Math.exp(-10 * dt));
  }
  chaseCam.position.copy(CHASE.pos); chaseCam.lookAt(CHASE.look);
}
/** Pick the camera angle around Mei with the most room (used when she sits down). */
function chooseChaseYaw(front = false) {
  const base = PLAYER.anchorPos(), f = mei.floor, head = base.clone(); head.y += 1.45;
  const facing = (mei.anchor || hero).rotation.y;
  const occ = FLOORS[f].occluders.concat(f < 2 ? FLOORS[f + 1].occluders : []);
  const horiz = Math.cos(CHASE.pitch) * CHASE.dist, up = Math.sin(CHASE.pitch) * CHASE.dist;
  let best = 0, bestD = -1;
  const order = [0, 0.6, -0.6, 1.2, -1.2, 1.8, -1.8, 2.4, -2.4, Math.PI];
  for (const y of front ? [Math.PI, 2.6, -2.6, ...order] : order) {
    const ang = facing + Math.PI + y;
    const want = new V3(head.x + Math.sin(ang) * horiz, Math.min(head.y + up, LEVELS[f] + 3.95), head.z + Math.cos(ang) * horiz);
    const dir = want.sub(head), len = dir.length(); dir.divideScalar(len);
    _ray2.set(head, dir); _ray2.far = len;
    const hit = _ray2.intersectObjects(occ, false)[0], d = hit ? hit.distance : len;
    if (d >= len * 0.9) { best = y; bestD = d; break; }
    if (d > bestD) { bestD = d; best = y; }
  }
  CHASE.yaw = best;
}
/* ---- see-through: anything between the camera and Mei fades out (whole prop), then fades back ---- */
const XRAY = new Map();                    // mesh -> { orig, mat, a }
const _xr = new THREE.Raycaster(); _xr.camera = chaseCam;
let _xrWant = new Map(), _xrFrame = 0;
function shownInScene(o) { for (let p = o; p; p = p.parent) { if (!p.visible) return false; if (p === scene) return true; } return false; }
function isUnder(o, root) { for (let p = o; p; p = p.parent) if (p === root) return true; return false; }
/** The "prop" a mesh belongs to: a desk group, a sofa, a person … or the mesh itself. */
function xrayRoot(o) { while (o.parent && o.parent !== scene && o.parent.parent !== scene) o = o.parent; return o; }
function updateXray(dt) {
  if (_xrFrame++ % 2 === 0) {                                     // re-test every other frame
    const want = new Map();                                       // prop root -> nearest hit distance
    if (CHASE.on) {
      const base = PLAYER.anchorPos(), cam = chaseCam.position, f = mei.floor;
      const roots = [FLOORS[f].group, cabin, walkers, liftCable];
      if (f < 2 && FLOORS[f + 1].group.visible) roots.push(FLOORS[f + 1].group);
      const side = new V3().subVectors(base, cam).setY(0).normalize(); side.set(-side.z, 0, side.x);
      [[0, 0.45], [0, 1.0], [0, 1.55], [0.9, 1.0], [-0.9, 1.0], [1.5, 1.2], [-1.5, 1.2]].forEach(([dx, dy]) => {
        const target = base.clone().addScaledVector(side, dx); target.y += dy;
        const dir = target.sub(cam), len = dir.length(); if (len < 0.5) return; dir.divideScalar(len);
        _xr.set(cam, dir); _xr.far = len - 0.35;
        _xr.intersectObjects(roots, true).forEach(h => {
          const o = h.object;
          if (!o.isMesh || isUnder(o, hero) || isUnder(o, meiSeat) || isUnder(o, tomato) || !shownInScene(XRAY.has(o) ? o.parent : o)) return;   // faded-out meshes still count
          if (o.material && o.material.isMeshBasicMaterial) return;
          if (FLOORS.some(F => F.occluders.includes(o))) return;          // walls / slabs: the camera already keeps clear of them
          const r = xrayRoot(o); want.set(r, Math.min(want.get(r) ?? Infinity, h.distance));
        });
      });
    }
    _xrWant = new Map();                                          // mesh -> target opacity
    want.forEach((dist, r) => r.traverse(m => {
      if (!m.isMesh || !m.material || m.material.isMeshBasicMaterial) return;
      if (m.material.transparent && !XRAY.has(m)) return;               // glass etc. is already see-through
      _xrWant.set(m, dist < 1.8 ? 0 : 0.14);                             // right in front of the lens: fully clear
    }));
    _xrWant.forEach((_, m) => {
      if (XRAY.has(m)) return;
      const orig = m.material, mat = orig.clone();
      mat.transparent = true; mat.depthWrite = false; mat.opacity = 1;
      m.material = mat; XRAY.set(m, { orig, mat, a: 1 });
    });
  }
  const k = 1 - Math.exp(-12 * dt);
  XRAY.forEach((st, m) => {
    const tgt = _xrWant.has(m) ? _xrWant.get(m) : 1;
    st.a += (tgt - st.a) * k; st.mat.opacity = st.a; m.visible = st.a > 0.02;
    if (tgt === 1 && st.a > 0.97) {
      if (st.orig.color) { st.orig.color.copy(st.mat.color); }                 // keep any status colour set while faded
      if (st.orig.emissive) { st.orig.emissive.copy(st.mat.emissive); st.orig.emissiveIntensity = st.mat.emissiveIntensity; }
      m.material = st.orig; m.visible = true; st.mat.dispose(); XRAY.delete(m);
    }
  });
}
// drag to look around (chase mode only; OrbitControls is off)
let _drag = null;
renderer.domElement.addEventListener('pointerdown', e => { if (CHASE.on) _drag = { x: e.clientX, y: e.clientY }; });
addEventListener('pointermove', e => {
  if (!_drag || !CHASE.on) return;
  CHASE.yaw -= (e.clientX - _drag.x) * 0.006;
  CHASE.pitch = THREE.MathUtils.clamp(CHASE.pitch + (e.clientY - _drag.y) * 0.004, 0.08, 1.15);
  _drag.x = e.clientX; _drag.y = e.clientY;
});
addEventListener('pointerup', () => { _drag = null; });

const viewBtn = document.getElementById('viewBtn'), hintEl = document.getElementById('hint');
function setChase(on, floorSel) {
  CHASE.on = on; controls.enabled = !on; viewCam = on ? chaseCam : camera;
  viewBtn.classList.toggle('on', on); viewBtn.setAttribute('aria-checked', String(on));
  viewBtn.title = on ? 'Switch to overview (V)' : 'Switch to player view (V)';
  document.body.classList.toggle('chase', on);
  if (on) {
    showFloor('all', false); CHASE.snap = true; CHASE.yaw = 0;
    hintEl.textContent = 'W/↑ forward · S/↓ back · A/D turn · click floor to walk · E to interact · drag to look · scroll to zoom · V overview';
  } else {
    const off = camera.position.clone().sub(controls.target);
    const a = PLAYER.anchorPos(); controls.target.set(a.x, a.y + 0.8, a.z); camera.position.copy(controls.target).add(off);
    if (floorSel === undefined) { showFloor(mei.floor, false); setFollow(true); }
    hintEl.textContent = `WASD / arrows or click floor to move ${PNAME} · E to interact · drag to pan · scroll to zoom · right-drag to rotate · V player view`;
  }
  TEAM.forEach(m => { m.occluded = undefined; });
}
hero.rotation.y = -2.5;                                  // start facing into the work floor
viewBtn.addEventListener('click', () => setChase(!CHASE.on));
addEventListener('keydown', e => {
  if (e.target.closest && e.target.closest('input, textarea, select, .csel, .csel-list')) return;
  if (e.key.toLowerCase() === 'v' && !e.repeat && !document.getElementById('taskEd').classList.contains('show')) setChase(!CHASE.on);
});
setChase(true);

/* =========================================================
   12f. POMODORO — runs while Mei works at a desk or in a focus booth.
   Focus advances her current task; breaks switch her to "Resting".
   ========================================================= */
const POMO = { state: 'idle', resume: null, left: 25 * 60, focusMin: 25, breakMin: 5, count: 0, acc: 0, _k: '' };
const pomoEl = document.getElementById('pomo');
const ARC = 2 * Math.PI * 27;
pomoEl.innerHTML = `
  <div class="ph">
    <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="27" fill="none" stroke="#ece4ff" stroke-width="7"/>
      <circle class="arc" cx="32" cy="32" r="27" fill="none" stroke="#ff7a59" stroke-width="7" stroke-linecap="round" stroke-dasharray="${ARC.toFixed(1)}" stroke-dashoffset="0"/></svg>
    <div class="pt"><div class="lb"></div><div class="tm"></div><div class="dots"></div></div>
  </div>
  <div class="task"></div>
  <div class="pb"><button class="main" data-a="main"></button><button data-a="skip">Skip</button><button data-a="reset">Reset</button></div>
  <div class="pre"><button data-p="25,5">25 / 5</button><button data-p="50,10">50 / 10</button><button data-p="5,1">5 / 1 demo</button></div>`;
const workSeat = () => PLAYER.sitting && PLAYER.seat && (PLAYER.seat.kind === 'desk' || PLAYER.seat.kind === 'focus');
function bumpProgress(n) {
  const cur = mei.work.current;
  if (!cur || cur.progress == null || cur.progress >= 100) return;
  cur.progress = Math.min(100, cur.progress + n); cur.updated = 0;
  if (cur.progress >= 100) { cur.status = 'review'; cur.note = 'Awaiting review'; cur.reviewer = defaultReviewer(cur, mei); noteHandled(cur, mei); say(mei, `“${cur.title}” done, sent to ${BY_ID[cur.reviewer].name} for review!`, 3); }
  recompute(mei); applyStatus(mei); refreshFilter();
}
function pomoPhaseEffects() {
  if (!workSeat()) return;
  if (POMO.state === 'break') setMeiState('idle', 'Pomodoro · break'); else setMeiState(null, null);
}
function pomoStart() {
  if (POMO.state === 'idle') { POMO.state = 'focus'; POMO.left = POMO.focusMin * 60; }
  else if (POMO.state === 'paused') { POMO.state = POMO.resume || 'focus'; POMO.resume = null; }
  pomoPhaseEffects();
}
function pomoPause() { if (POMO.state === 'focus' || POMO.state === 'break') { POMO.resume = POMO.state; POMO.state = 'paused'; } }
function pomoReset() { POMO.state = 'idle'; POMO.resume = null; POMO.left = POMO.focusMin * 60; POMO.count = 0; POMO.acc = 0; pomoPhaseEffects(); }
function endFocus() {
  POMO.count++; bumpProgress(3);
  POMO.state = 'break'; POMO.left = (POMO.count % 4 === 0 ? POMO.breakMin * 3 : POMO.breakMin) * 60;
  say(mei, `Pomodoro #${POMO.count} done! Break time.`, 3);
  pomoPhaseEffects();
}
function endBreak() {
  POMO.state = workSeat() ? 'focus' : 'idle'; POMO.left = POMO.focusMin * 60;
  say(mei, 'Break over, back to focus!', 2.5);
  pomoPhaseEffects();
}
function pomoSkip() {
  const ph = POMO.state === 'paused' ? POMO.resume : POMO.state;
  if (ph === 'focus') endFocus(); else if (ph === 'break') endBreak();
}
pomoEl.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.a === 'main') { if (POMO.state === 'focus' || POMO.state === 'break') pomoPause(); else pomoStart(); }
  if (b.dataset.a === 'skip') pomoSkip();
  if (b.dataset.a === 'reset') pomoReset();
  if (b.dataset.p) {
    const [f, br] = b.dataset.p.split(',').map(Number);
    POMO.focusMin = f; POMO.breakMin = br;
    if (POMO.state === 'idle') POMO.left = f * 60;
    else if (POMO.state === 'focus' || POMO.resume === 'focus') POMO.left = Math.min(POMO.left, f * 60);
  }
  POMO._k = '';
});
function pomoOnSit() { if (POMO.state === 'idle' || POMO.state === 'paused') pomoStart(); }
function pomoOnStand() { pomoPause(); }

// a little tomato on the desk while the timer is on
const tomato = new THREE.Group();
S(tomato, 0.095, '#ff6b5a', 0, 0.095, 0, 16);
C(tomato, 0.012, 0.012, 0.05, '#3e9e5c', 0, 0.18, 0, 6);
{ const lf = S(tomato, 0.04, '#5fbf7a', 0.03, 0.19, 0, 8); lf.scale.set(1.5, 0.35, 0.8); }
tomato.visible = false; scene.add(tomato);

const mmss = s => { s = Math.max(0, Math.ceil(s)); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
function updatePomo(t, dt) {
  if (POMO.state === 'focus' || POMO.state === 'break') {
    POMO.left -= dt;
    if (POMO.state === 'focus' && workSeat()) {
      POMO.acc += dt;
      const step = POMO.focusMin * 60 / 12;                 // ≈ +12% per pomodoro
      if (POMO.acc >= step) { POMO.acc -= step; bumpProgress(1); }
    }
    if (POMO.left <= 0) (POMO.state === 'focus' ? endFocus : endBreak)();
  }
  // tomato
  const s = PLAYER.seat;
  tomato.visible = !!(workSeat() && POMO.state !== 'idle' && FLOORS[s.floor].group.visible);
  if (tomato.visible) {
    const f = s.facing, lat = s.kind === 'desk' ? 0.45 : 0.25;
    tomato.position.set(s.x + Math.sin(f) * 0.55 + Math.cos(f) * lat, LEVELS[s.floor] + (s.kind === 'desk' ? 0.78 : 0.81), s.z + Math.cos(f) * 0.55 - Math.sin(f) * lat);
    tomato.rotation.y = t * 0.6;
    const beat = POMO.state === 'focus' && POMO.left < 10 ? 1 + Math.abs(Math.sin(t * 8)) * 0.15 : 1;
    tomato.scale.setScalar(beat);
  }
  // widget
  const show = workSeat() || POMO.state !== 'idle';
  pomoEl.classList.toggle('show', show);
  if (!show) return;
  const ph = POMO.state === 'paused' ? POMO.resume : POMO.state;
  const total = (ph === 'break' ? (POMO.count % 4 === 0 && POMO.count ? POMO.breakMin * 3 : POMO.breakMin) : POMO.focusMin) * 60;
  const key = [POMO.state, mmss(POMO.left), POMO.count, POMO.focusMin, mei.work.current && mei.work.current.progress].join('|');
  if (key === POMO._k) return;
  POMO._k = key;
  const col = POMO.state === 'break' ? '#5cc4f2' : POMO.state === 'paused' ? '#a993e6' : '#ff7a59';
  const arc = pomoEl.querySelector('.arc');
  arc.setAttribute('stroke', col);
  arc.setAttribute('stroke-dashoffset', (ARC * (1 - Math.max(0, POMO.left) / total)).toFixed(1));
  pomoEl.querySelector('.lb').textContent = { focus: '🍅 Focusing', break: '☕ Break', paused: '⏸ Paused', idle: '🍅 Pomodoro' }[POMO.state];
  pomoEl.querySelector('.tm').textContent = mmss(POMO.left);
  const filled = POMO.count % 4 === 0 && POMO.count ? 4 : POMO.count % 4;
  pomoEl.querySelector('.dots').innerHTML = [0, 1, 2, 3].map(i => `<i class="${i < filled ? 'on' : ''}"></i>`).join('') + `<span>Today ${POMO.count}</span>`;
  const cur = mei.work.current;
  pomoEl.querySelector('.task').textContent = cur ? `Now: ${cur.title} · ${pctOf(cur)}` : (workSeat() ? 'All tasks cleared' : 'Sit at a desk to focus');
  const main = pomoEl.querySelector('[data-a="main"]');
  main.textContent = POMO.state === 'focus' || POMO.state === 'break' ? 'Pause' : POMO.state === 'paused' ? 'Resume' : 'Start focus';
  main.style.background = col;
  pomoEl.querySelectorAll('.pre button').forEach(b => b.classList.toggle('on', b.dataset.p === `${POMO.focusMin},${POMO.breakMin}`));
}

/* =========================================================
   12f-2. CUSTOM DROPDOWN — replaces native <select> everywhere.
   Wraps a real <select> (kept hidden, so .value / 'change' keep working)
   with our own trigger + list. Options may carry data-dot="#hex" for a colour dot.
   ========================================================= */
let _cselOpen = null;
function closeCsel() {
  if (!_cselOpen) return;
  _cselOpen.list.remove(); _cselOpen.wrap.classList.remove('open');
  const btn = _cselOpen.btn; _cselOpen = null; btn.focus({ preventScroll: true });
}
function enhanceSelect(sel, opts = {}) {
  if (sel._cs) { sel._cs.refresh(); return sel._cs; }
  const wrap = document.createElement('div');
  wrap.className = 'csel ' + sel.className;
  sel.parentNode.insertBefore(wrap, sel); wrap.appendChild(sel);
  sel.classList.add('csel-native'); sel.tabIndex = -1;
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'csel-btn';
  btn.innerHTML = '<span class="csel-d"></span><span class="csel-v"></span><svg class="csel-i" viewBox="0 0 12 8" aria-hidden="true"><path d="M1.5 1.5 6 6 10.5 1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  wrap.appendChild(btn);
  const refresh = () => {
    const o = sel.options[sel.selectedIndex];
    btn.querySelector('.csel-v').textContent = o ? o.textContent : '';
    const d = btn.querySelector('.csel-d'); d.style.display = o && o.dataset.dot ? '' : 'none'; if (o && o.dataset.dot) d.style.background = o.dataset.dot;
  };
  const choose = i => {
    if (sel.selectedIndex !== i) { sel.selectedIndex = i; sel.dispatchEvent(new Event('change', { bubbles: true })); }
    refresh(); closeCsel();
  };
  const open = () => {
    if (_cselOpen) { const same = _cselOpen.wrap === wrap; closeCsel(); if (same) return; }
    const list = document.createElement('div');
    list.className = 'csel-list' + (opts.search ? ' has-search' : ''); list.tabIndex = -1; list.setAttribute('role', 'listbox');
    const items = [...sel.options].map((o, i) => `<div class="csel-opt ${i === sel.selectedIndex ? 'sel' : ''}" data-i="${i}" role="option" data-q="${esc((o.textContent + ' ' + (o.dataset.sub || '')).toLowerCase())}">
      <span class="ck">${i === sel.selectedIndex ? '✓' : ''}</span>${o.dataset.dot ? `<i style="background:${o.dataset.dot}"></i>` : ''}<span class="tx">${esc(o.textContent)}</span>${o.dataset.sub ? `<small>${esc(o.dataset.sub)}</small>` : ''}</div>`).join('');
    list.innerHTML = (opts.search ? `<div class="csel-search"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m11 11 3.5 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><input type="text" placeholder="${esc(opts.placeholder || 'Search…')}"></div>` : '') +
      `<div class="csel-items">${items}</div><p class="csel-none" style="display:none">No matches</p>`;
    document.body.appendChild(list);
    const optEls = [...list.querySelectorAll('.csel-opt')];
    let vis = optEls.map((_, i) => i), act = Math.max(0, sel.selectedIndex);
    const mark = () => optEls.forEach((el, i) => el.classList.toggle('act', i === act));
    const filterBy = q => {
      q = q.trim().toLowerCase();
      vis = [];
      optEls.forEach((el, i) => { const ok = !q || el.dataset.q.includes(q); el.style.display = ok ? '' : 'none'; if (ok) vis.push(i); });
      list.querySelector('.csel-none').style.display = vis.length ? 'none' : '';
      if (!vis.includes(act)) act = vis.length ? vis[0] : -1;
      mark();
    };
    const h0 = Math.min(list.scrollHeight, 320);
    const place = () => {                                  // keep the list anchored to its trigger
      const r = btn.getBoundingClientRect();
      list.style.minWidth = Math.max(r.width, 160) + 'px';
      const below = window.innerHeight - r.bottom - 12;
      list.style.left = Math.max(8, Math.min(r.left, window.innerWidth - list.offsetWidth - 8)) + 'px';
      if (below >= h0 || below > r.top) { list.style.top = r.bottom + 6 + 'px'; list.style.maxHeight = Math.min(320, below) + 'px'; }
      else { list.style.top = Math.max(8, r.top - 6 - h0) + 'px'; list.style.maxHeight = Math.min(320, r.top - 14) + 'px'; }
    };
    place();
    const follow = () => { if (_cselOpen && _cselOpen.list === list) { place(); requestAnimationFrame(follow); } };
    requestAnimationFrame(follow);
    mark();
    const cur = list.querySelector('.csel-opt.sel'); if (cur) cur.scrollIntoView({ block: 'nearest' });
    list.addEventListener('pointermove', e => { const el = e.target.closest('.csel-opt'); if (el && +el.dataset.i !== act) { act = +el.dataset.i; mark(); } });
    list.addEventListener('click', e => { const el = e.target.closest('.csel-opt'); if (el) choose(+el.dataset.i); });
    const step = d => {
      if (!vis.length) return;
      const k = Math.max(0, vis.indexOf(act)); act = vis[Math.min(vis.length - 1, Math.max(0, k + d))];
      mark(); optEls[act].scrollIntoView({ block: 'nearest' });
    };
    const onKey = e => {                                   // runs in the capture phase, before any other handler
      if (e.key === 'ArrowDown') { step(1); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { step(-1); e.preventDefault(); }
      else if (e.key === 'Enter' || (e.key === ' ' && !opts.search)) { if (act >= 0) choose(act); e.preventDefault(); }
      else if (e.key === 'Escape' || e.key === 'Tab') { closeCsel(); e.preventDefault(); }
      else return false;                                   // let typing reach the search box
      return true;
    };
    wrap.classList.add('open');
    _cselOpen = { wrap, list, btn, onKey };
    const inp = list.querySelector('.csel-search input');
    if (inp) { inp.addEventListener('input', () => filterBy(inp.value)); inp.focus({ preventScroll: true }); }
    else list.focus({ preventScroll: true });
  };
  btn.addEventListener('click', e => { e.stopPropagation(); open(); });
  btn.addEventListener('keydown', e => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); e.stopPropagation(); open(); }
  });
  sel.addEventListener('change', refresh);
  refresh();
  sel._cs = { refresh };
  return sel._cs;
}
// while a list is open it owns the keyboard (so Esc closes the list, not the editor; arrows don't move Mei)
addEventListener('keydown', e => {
  if (!_cselOpen) return;
  const handled = _cselOpen.onKey(e);
  if (handled || !(e.target.closest && e.target.closest('.csel-list'))) e.stopImmediatePropagation();
}, true);
addEventListener('pointerdown', e => { if (_cselOpen && !_cselOpen.list.contains(e.target) && !_cselOpen.wrap.contains(e.target)) closeCsel(); }, true);
addEventListener('resize', closeCsel);
addEventListener('wheel', e => { if (_cselOpen && !_cselOpen.list.contains(e.target)) closeCsel(); }, { passive: true });

/* =========================================================
   12g. PROJECT BOARD — kanban of every task (the "Team progress" panel)
   Tabs: Mine (My turn / Assigned by me / Handled by me / All mine) · All
   Columns: Backlog → To do → In progress → In review → Done  (+ Closed archive)
   Roles: assigner + handler (who acts now; derived) · trail remembered for hand-backs.
   ========================================================= */
const sortCards = (a, b) => (PRI_RANK[a.t.priority] ?? 9) - (PRI_RANK[b.t.priority] ?? 9) || String(a.t.due || '9').localeCompare(String(b.t.due || '9'));
const urgency = ({ t }) => { const d = dueInfo(t); return d && d.cls === 'late' ? 0 : isBlocked(t) ? 1 : t.status === 'review' ? 2 : 3; };
const sortUrgent = (a, b) => urgency(a) - urgency(b) || sortCards(a, b);
var KB = { tab: 'mine', mineView: 'todo', q: '', project: 'all', type: 'all', group: 'none', drag: null, dirty: true, showClosed: false };
// unassigned requirements live in a shared pool owned by nobody (handler = assigner until someone takes it)
const POOL = [
  ['Enterprise SSO', 'Prism', 'P1', 'mia'], ['Slack integration', 'Prism', 'P1', 'mia'], ['Model cost dashboard', 'Nimbus', 'P2', 'kenji'],
  ['Custom wake word', 'Kite', 'P2', 'mia'], ['Export chat to PDF', 'Orion', 'P3', 'mei'], ['Onboarding animation', 'Orion', 'P3', 'mei']
].map(([title, project, priority, assigner]) => seedMeta({ title, project, priority, assigner, status: 'backlog', progress: 0, updated: 3 * D, note: null, handled: [assigner] }));
const UNASSIGNED = { id: '_pool', name: 'Unassigned', kind: 'human', pool: true, look: { body: '#e3d8ff' }, work: { tasks: POOL, role: 'Backlog' } };
[['mia', 'Q1 roadmap research', 'Orion', 'backlog', 'P2'], ['kai', 'NPS survey analysis', 'Orion', 'backlog', 'P3'], ['sora', 'Legacy help center migration', 'Orion', 'closed', 'P3']]
  .forEach(([id, title, project, status, priority]) => {
    const m = BY_ID[id];
    m.work.tasks.push(seedRoles(seedMeta({ title, project, status, priority, progress: 0, updated: D, note: status === 'closed' ? 'Won’t do: merged into new help center' : null }), m));
    recompute(m); applyStatus(m);
  });

let TID = 0;
const TASK_BY_ID = new Map();
function indexTasks() {
  TASK_BY_ID.clear();
  [UNASSIGNED, ...TEAM].forEach(m => m.work.tasks.forEach(t => { if (!t.id) t.id = ++TID; TASK_BY_ID.set(t.id, { t, m }); }));
}
indexTasks();
const ownerOf = id => (id === '_pool' ? UNASSIGNED : BY_ID[id]);
const nameOf = id => (id && BY_ID[id] ? BY_ID[id].name : '—');
const active = t => t.status !== 'done' && t.status !== 'closed';
// "Mine" buckets
const MINE = {
  todo:     { label: 'My turn', test: ({ t, m }) => active(t) && handlerOf(t, m) === 'mei' },
  assigned: { label: 'Assigned by me', test: ({ t, m }) => t.status !== 'closed' && t.assigner === 'mei' && handlerOf(t, m) !== 'mei' },
  handled:  { label: 'Handled by me', test: ({ t, m }) => t.status !== 'closed' && (t.handled || []).includes('mei') && (handlerOf(t, m) !== 'mei' || !active(t)) && t.assigner !== 'mei' },
  any:      { label: 'All mine', test: x => MINE.todo.test(x) || MINE.assigned.test(x) || MINE.handled.test(x) }
};
const needsMeTask = (t, m) => !m.player && !m.pool && active(t) && handlerOf(t, m) === 'mei';

const boardView = document.getElementById('boardView');
boardView.innerHTML = `
  <div class="kb-tools">
    <div class="seg mine-only" id="kbMineSeg">${Object.entries(MINE).map(([k, v]) => `<button data-m="${k}" class="${k === KB.mineView ? 'on' : ''}">${v.label}<em></em></button>`).join('')}</div>
    <input id="kbQ" type="search" placeholder="Search tasks, people…">
    <select id="kbProject" class="all-only"></select>
    <div class="seg all-only" id="kbType"><button data-t="all" class="on">All</button><button data-t="human">Human</button><button data-t="ai">AI</button></div>
    <button class="kb-add" id="kbAdd">+ New</button>
  </div>
  <div id="kbBody"></div>`;
const kbBody = document.getElementById('kbBody');
document.getElementById('kbQ').addEventListener('input', e => { KB.q = e.target.value; renderKanban(true); });
document.getElementById('kbProject').addEventListener('change', e => { KB.project = e.target.value; renderKanban(true); });
document.getElementById('kbAdd').addEventListener('click', () => openEditor(null, { status: KB.tab === 'mine' && KB.mineView === 'todo' ? 'todo' : 'backlog' }));
document.querySelectorAll('#kbType button').forEach(b => b.addEventListener('click', () => {
  KB.type = b.dataset.t; document.querySelectorAll('#kbType button').forEach(x => x.classList.toggle('on', x === b)); renderKanban(true);
}));
document.querySelectorAll('#kbMineSeg button').forEach(b => b.addEventListener('click', () => {
  KB.mineView = b.dataset.m; document.querySelectorAll('#kbMineSeg button').forEach(x => x.classList.toggle('on', x === b));
  boardView.classList.toggle('view-todo', KB.mineView === 'todo'); renderKanban(true);
}));

function setTab(tab) {
  KB.tab = tab === 'all' ? 'all' : 'mine';
  panel.classList.add('tab-board');
  boardView.classList.toggle('tab-mine', KB.tab === 'mine');
  boardView.classList.toggle('view-todo', KB.mineView === 'todo');
  document.querySelectorAll('.ptabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === KB.tab));
  renderKanban(true);
}
document.querySelectorAll('.ptabs button').forEach(b => b.addEventListener('click', () => setTab(b.dataset.tab)));
setTab('mine');

function cardHTML({ t, m }) {
  const c = TASK_STATUS[t.status].color, due = dueInfo(t), blocked = isBlocked(t);
  const hid = handlerOf(t, m), h = hid ? BY_ID[hid] : null;
  const who = m.pool && !h ? UNASSIGNED : (h || m);
  const handed = !m.pool && hid && hid !== m.id;           // with a reviewer / helper, not the doer
  const role = t.status === 'review' ? 'Review' : blocked && handed ? 'Help' : m.pool ? 'Unclaimed' : '';
  return `<div class="kc2 ${blocked ? 'is-blocked' : ''} ${t.status === 'closed' ? 'is-closed' : ''}" draggable="true" data-id="${t.id}" style="--c:${blocked ? TASK_STATUS.blocked.color : c}">
    <div class="kt"><span class="pri" style="--p:${PRIORITY[t.priority] || '#cbb8f7'}">${esc(t.priority || '—')}</span><b>${esc(t.title)}</b></div>
    ${blocked || t.rejected ? `<div class="flags">${blocked ? '<span class="fl fl-b">Blocked</span>' : ''}${t.rejected ? `<span class="fl fl-r">Rejected${t.rejected > 1 ? ' ×' + t.rejected : ''}</span>` : ''}</div>` : ''}
    <div class="km"><span class="who ${m.pool && !h ? 'none' : ''}" title="Handler"><span class="dot ${who.kind === 'ai' ? 'ai' : ''}" style="--b:${who.look.body || (who.kind === 'ai' ? P.violet : P.lavender)}"></span>${esc(who.player ? 'Me' : who.name)}${who.kind === 'ai' && !who.pool ? '<i class="ai2">AI</i>' : ''}${role ? `<small class="role2">${role}</small>` : ''}</span><span class="proj">${esc(t.project)}</span>${needsMeTask(t, m) ? '<span class="needme">My turn</span>' : ''}</div>
    ${handed || m.pool ? `<div class="from">${m.pool ? `From: ${esc(nameOf(t.assigner))}` : `Doer: ${esc(m.player ? 'Me' : m.name)}`}${t.assigner && !m.pool ? ` · Assigned by: ${esc(t.assigner === 'mei' ? 'Me' : nameOf(t.assigner))}` : ''}</div>` : (t.assigner && t.assigner !== m.id ? `<div class="from">Assigned by: ${esc(t.assigner === 'mei' ? 'Me' : nameOf(t.assigner))}</div>` : '')}
    ${['working', 'review'].includes(t.status) ? taskBar(t, blocked ? TASK_STATUS.blocked.color : c) : ''}
    <div class="ft"><span>${t.status === 'backlog' || t.status === 'todo' ? ago(t.updated) : pctOf(t)}</span>${due ? `<span class="due ${due.cls}">${due.txt}</span>` : ''}</div>
    ${t.note ? `<div class="nt ${blocked || (t.note || '').startsWith('Rejected') ? '' : 'soft'}">${esc(t.note)}</div>` : ''}
    ${t.status === 'review' && hid === 'mei' ? `<div class="rv"><button data-rv="ok">Approve</button><button data-rv="no">Reject</button></div>` : ''}
    ${blocked && hid === 'mei' ? `<div class="rv"><button data-rv="unblock" class="ub">Solved, hand back</button></div>` : ''}
  </div>`;
}
function renderKanban(force) {
  if (KB.drag) { KB.dirty = true; return; }
  if (!force && panel.classList.contains('collapsed')) { KB.dirty = true; return; }
  KB.dirty = false;
  indexTasks();
  const all = [...TASK_BY_ID.values()];
  const projects = [...new Set(all.map(x => x.t.project))].sort();
  const pSel = document.getElementById('kbProject');
  pSel.innerHTML = `<option value="all">All projects</option>` + projects.map(p => `<option value="${esc(p)}" ${p === KB.project ? 'selected' : ''}>${esc(p)}</option>`).join('');
  enhanceSelect(pSel);
  const q = KB.q.trim().toLowerCase();
  const typeOk = m => m.pool || KB.type === 'all' || (KB.type === 'ai') === (m.kind === 'ai');
  const matchQ = ({ t, m }) => !q || `${t.title} ${m.name} ${nameOf(handlerOf(t, m))} ${nameOf(t.assigner)} ${t.project} ${t.note || ''} ${t.priority || ''}`.toLowerCase().includes(q);
  const mine = KB.tab === 'mine';
  // counts on the Mine filters
  document.querySelectorAll('#kbMineSeg button').forEach(b => {
    const n = all.filter(x => MINE[b.dataset.m].test(x) && (b.dataset.m !== 'todo' || active(x.t))).length;
    b.querySelector('em').textContent = n;
  });
  const filtered = all.filter(x => matchQ(x) && (mine ? MINE[KB.mineView].test(x) : ((KB.project === 'all' || x.t.project === KB.project) && typeOk(x.m))));
  const items = filtered.filter(x => x.t.status !== 'closed').sort(mine ? sortUrgent : sortCards);
  const closed = filtered.filter(x => x.t.status === 'closed');
  const group = mine ? 'none' : KB.group;
  let lanes;
  if (group === 'member') {
    const laneOf = x => (x.m.pool ? '_pool' : handlerOf(x.t, x.m));
    lanes = [UNASSIGNED, ...TEAM.filter(typeOk)].map(m => ({ key: m.id, label: m.pool ? 'Unassigned' : `${m.name}${m.player ? ' (me)' : ''}`, sub: m.work.role, items: items.filter(x => laneOf(x) === m.id) }))
      .filter(l => l.items.length || (!q && KB.project === 'all' && l.key !== '_pool'));
  } else if (group === 'project') {
    lanes = projects.filter(p => KB.project === 'all' || p === KB.project).map(p => ({ key: p, label: p, items: items.filter(x => x.t.project === p) }))
      .filter(l => l.items.length || !q);
  } else lanes = [{ key: 'all', label: null, items }];
  const heads = TASK_ORDER.map(s => {
    const c = TASK_STATUS[s].color, n = items.filter(x => x.t.status === s).length;
    const blk = items.filter(x => x.t.status === s && isBlocked(x.t)).length;
    return `<div class="kb-head" style="--c:${c}">${TASK_STATUS[s].label} <em>${n}</em>${blk ? `<span class="hb">${blk} blocked</span>` : ''}<button class="kb-plus" data-s="${s}" title="New in ${TASK_STATUS[s].label}">+</button></div>`;
  }).join('');
  const emptyMsg = mine ? { todo: 'Nothing on your plate 🎉', assigned: 'You haven’t assigned anything yet', handled: 'Nothing handed off yet', any: 'Nothing related to you yet' }[KB.mineView] : 'No matching tasks';
  kbBody.innerHTML = `<div class="kb-grid">${heads}${lanes.map(l =>
    (l.label ? `<div class="kb-lane">${esc(l.label)}${l.sub ? `<small>${esc(l.sub)}</small>` : ''}<em>${l.items.length}</em></div>` : '') +
    TASK_ORDER.map(s => `<div class="kb-cell" data-s="${s}" data-lane="${esc(l.key)}" style="--c:${TASK_STATUS[s].color}">${l.items.filter(x => x.t.status === s).map(cardHTML).join('')}</div>`).join('')
  ).join('')}</div>
  ${items.length ? '' : `<p class="kb-empty">${emptyMsg}</p>`}
  ${!mine || closed.length ? `<div class="kb-closed ${KB.showClosed ? 'open' : ''}">
    <button class="kb-closed-t">Closed · ${closed.length}<span>${KB.showClosed ? 'Hide' : 'Show'}</span></button>
    ${KB.showClosed ? `<div class="kb-closed-list">${closed.map(cardHTML).join('') || '<p class="kb-empty">None</p>'}</div>` : ''}
  </div>` : ''}`;
  const ct = kbBody.querySelector('.kb-closed-t');
  if (ct) ct.addEventListener('click', () => { KB.showClosed = !KB.showClosed; renderKanban(true); });
  kbBody.querySelectorAll('.kb-plus').forEach(b => b.addEventListener('click', () => openEditor(null, { status: b.dataset.s })));
  kbBody.querySelectorAll('.kc2').forEach(card => {
    const id = +card.dataset.id;
    card.addEventListener('click', e => {
      const rv = e.target.closest('[data-rv]');
      if (rv) {
        e.stopPropagation(); const rec = TASK_BY_ID.get(id);
        if (rv.dataset.rv === 'ok') applyTaskChange(rec.t, rec.m, rec.m, { status: 'done' });
        else if (rv.dataset.rv === 'no') openReject(id);
        else applyTaskChange(rec.t, rec.m, rec.m, { blocked: false, helper: null });
        return;
      }
      openEditor(id);
    });
    card.addEventListener('dragstart', e => { KB.drag = id; e.dataTransfer.setData('text/plain', String(id)); e.dataTransfer.effectAllowed = 'move'; card.classList.add('dragging'); });
    card.addEventListener('dragend', () => { KB.drag = null; card.classList.remove('dragging'); if (KB.dirty) renderKanban(true); });
  });
  kbBody.querySelectorAll('.kb-cell').forEach(cell => {
    cell.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; cell.classList.add('over'); });
    cell.addEventListener('dragleave', () => cell.classList.remove('over'));
    cell.addEventListener('drop', e => {
      e.preventDefault(); cell.classList.remove('over');
      const id = +e.dataTransfer.getData('text/plain'); KB.drag = null;
      moveTask(id, cell.dataset.s, cell.dataset.lane);
    });
  });
}
const STATUS_LINE = {
  backlog: t => `“${t.title}” back to Backlog`, todo: t => `“${t.title}” moved to To do`, working: t => `Started “${t.title}”`,
  review: t => `“${t.title}” sent to ${nameOf(t.reviewer)} for review`, done: t => `“${t.title}” is done!`, closed: t => `“${t.title}” closed`
};
function touchOwner(x) { if (!x.pool) { recompute(x); applyStatus(x); } }
function applyTaskChange(t, from, to, patch) {
  const prev = t.status, wasBlocked = isBlocked(t);
  noteHandled(t, from);
  Object.assign(t, patch); t.updated = 0;
  if (t.status === 'done') { t.progress = t.progress == null ? null : 100; t.blocked = false; t.helper = null; }
  if (t.status === 'review') { t.reviewer = t.reviewer || defaultReviewer(t, to); if (!t.note || t.note.startsWith('Rejected')) t.note = 'Awaiting review'; }
  if (prev === 'review' && t.status !== 'review' && t.note === 'Awaiting review') t.note = null;
  if (t.status === 'done' && t.note && (t.note.startsWith('Rejected') || t.note === 'Needs help')) t.note = null;
  if (!isBlocked(t)) t.helper = null;
  if (isBlocked(t) && !t.note) t.note = 'Needs help';
  if (wasBlocked && !isBlocked(t) && t.note === 'Needs help') t.note = null;
  if (to !== from) { from.work.tasks.splice(from.work.tasks.indexOf(t), 1); to.work.tasks.push(t); if (!t.assigner || from.pool) t.assigner = t.assigner || 'mei'; }
  noteHandled(t, to);
  touchOwner(from); if (to !== from) touchOwner(to);
  refreshFilter();
  if (to.pool) return;
  if (to !== from && !to.player) say(to, `New task: “${t.title}”`, 3);
  else if (prev !== t.status && !to.player) { say(to, STATUS_LINE[t.status](t), 3); if (t.status === 'done') to.react = { mode: 'cheer', until: clock.elapsedTime + 2 }; }
  else if (wasBlocked && !isBlocked(t) && !to.player) say(to, 'Unblocked, thanks!', 3);
}
function moveTask(id, status, lane) {
  const rec = TASK_BY_ID.get(id); if (!rec) return;
  const { t, m } = rec;
  const group = KB.tab === 'mine' ? 'none' : KB.group;
  let to = m; const patch = { status };
  if (group === 'project' && lane !== 'all') patch.project = lane;
  if (group === 'member' && lane !== 'all' && ownerOf(lane)) {
    const target = ownerOf(lane);
    if (status === 'review' && !target.pool) { patch.reviewer = target.id; }              // hand the review to that person
    else if (isBlocked(t) && !target.pool && target !== m) { patch.helper = target.id; }  // ask that person for help
    else to = target;                                                                     // otherwise: reassign the work
  }
  if (to === m && status === t.status && (patch.project || t.project) === t.project && !patch.reviewer && !patch.helper) { renderKanban(true); return; }
  if (t.status === 'review' && status === 'working' && to === m) { openReject(id); return; }   // dragged back = rejected
  if (m.pool && to === m && status !== 'backlog') { openEditor(id, { status, needOwner: true }); return; }  // pick a handler first
  if (to.pool) {
    if (status !== 'backlog') { renderKanban(true); return; }
    applyTaskChange(t, m, to, patch); return;
  }
  applyTaskChange(t, m, to, patch);
}

// ---- reject (review → back to the doer, in In progress, with a reason) ----
const edEl = document.getElementById('taskEd');
function closeEditor() { closeCsel(); edEl.classList.remove('show'); }
function openReject(id) {
  const rec = TASK_BY_ID.get(id); if (!rec) return;
  const { t, m } = rec;
  edEl.innerHTML = `<div class="box">
    <h3>Reject review</h3>
    <p class="sub2">“${esc(t.title)}” goes back to ${esc(m.player ? 'me' : m.name)}, returns to In progress and is marked Rejected.</p>
    <label>Reason<input id="rjReason" value="" placeholder="e.g. Flows don’t match the spec"></label>
    <div class="acts"><button data-a="cancel">Cancel</button><button class="pri danger" data-a="ok">Reject</button></div></div>`;
  const go = () => {
    const reason = edEl.querySelector('#rjReason').value.trim() || 'Needs changes';
    applyTaskChange(t, m, m, { status: 'working', rejected: (t.rejected || 0) + 1, note: `Rejected: ${reason}` });
    if (!m.player) say(m, 'Got it, I’ll revise and resubmit.', 3);
    closeEditor();
  };
  edEl.querySelector('[data-a="cancel"]').addEventListener('click', () => { closeEditor(); renderKanban(true); });
  edEl.querySelector('[data-a="ok"]').addEventListener('click', go);
  edEl.querySelector('#rjReason').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  edEl.onclick = e => { if (e.target === edEl) { closeEditor(); renderKanban(true); } };
  edEl.classList.add('show');
  setTimeout(() => edEl.querySelector('#rjReason').focus(), 30);
}

// ---- task editor: assigner + handler ----
function openEditor(id, preset = {}) {
  const rec = id ? TASK_BY_ID.get(id) : null;
  const status0 = preset.status || (rec ? rec.t.status : 'backlog');
  const t = rec ? rec.t : { title: '', project: KB.project !== 'all' ? KB.project : 'Orion', status: status0, progress: 0, note: '', priority: 'P2', due: isoDay(7), assigner: 'mei' };
  const m = rec ? rec.m : (status0 === 'backlog' ? UNASSIGNED : mei);
  const hid = rec ? (m.pool ? null : handlerOf(t, m)) : (m.pool ? null : 'mei');
  const projects = [...new Set([...TASK_BY_ID.values()].map(x => x.t.project))].sort();
  const ongoing = t.progress == null;
  const people = (sel, withPool) => (withPool ? `<option value="_pool" data-dot="#e3d8ff" data-sub="Backlog" ${!sel ? 'selected' : ''}>Unassigned</option>` : '') +
    [mei, ...TEAM.filter(x => !x.player)].map(x => `<option value="${x.id}" data-dot="${x.look.body || (x.kind === 'ai' ? P.violet : P.lavender)}" data-sub="${esc(x.work.role || '')} · ${x.floor + 1}F" ${x.id === sel ? 'selected' : ''}>${esc(x.name)}${x.kind === 'ai' ? ' · AI' : ''}${x.player ? ' (me)' : ''}</option>`).join('');
  const assignerId = rec ? (t.assigner || 'mei') : 'mei';
  const assignerM = BY_ID[assignerId] || mei;
  const stOpts = [...TASK_ORDER, 'closed'].map(s => `<option value="${s}" data-dot="${TASK_STATUS[s].color}" ${s === status0 ? 'selected' : ''}>${TASK_STATUS[s].label}${s === 'closed' ? ' · won’t do' : ''}</option>`).join('');
  const projOpts = (projects.includes(t.project) ? projects : [t.project, ...projects]).map(p => `<option value="${esc(p)}" ${p === t.project ? 'selected' : ''}>${esc(p)}</option>`).join('') + '<option value="__new">+ New project…</option>';
  const trail = (t.handled || []).map(x => (x === 'mei' ? 'Me' : nameOf(x))).join(' → ');
  edEl.innerHTML = `<div class="box">
    <h3>${rec ? 'Edit task' : status0 === 'backlog' ? 'New request' : 'New task'}</h3>
    <label>Title<input id="edTitle" value="${esc(t.title)}" placeholder="What needs doing?"></label>
    <div class="row2">
      <div class="fld"><span class="fl-l">Assigner</span><div class="ro"><i style="background:${assignerM.look.body || P.lavender}"></i>${assignerId === 'mei' ? `Me (${PNAME})` : esc(assignerM.name)}</div></div>
      <label><span>Handler <small class="hint" id="edHint"></small></span><select id="edHandler">${people(hid, true)}</select></label>
    </div>
    <div class="row3">
      <label>Status<select id="edStatus">${stOpts}</select></label>
      <label>Priority<select id="edPri">${Object.keys(PRIORITY).map(p => `<option value="${p}" data-dot="${PRIORITY[p]}" ${p === t.priority ? 'selected' : ''}>${p}</option>`).join('')}</select></label>
      <label>Project<select id="edProj">${projOpts}</select><input id="edProjNew" placeholder="New project name" style="display:none"></label>
    </div>
    <div class="row2">
      <label>Due date<input id="edDue" type="date" value="${esc(t.due || '')}"></label>
      <label><span>Progress <b id="edPctV">${ongoing ? 'Ongoing' : t.progress + '%'}</b></span><input id="edPct" type="range" min="0" max="100" step="5" value="${ongoing ? 0 : t.progress}" ${ongoing ? 'disabled' : ''}></label>
    </div>
    <label class="chk"><input id="edBlocked" type="checkbox" ${t.blocked ? 'checked' : ''}> Blocked · needs help</label>
    <label>Note / blocker<input id="edNote" value="${esc(t.note || '')}" placeholder="e.g. Waiting on mockups"></label>
    ${rec && !m.pool ? `<p class="sub2">Doer: ${esc(m.player ? 'Me' : m.name)}${trail ? ` · Trail: ${esc(trail)}` : ''}${t.rejected ? ` · rejected ${t.rejected}×` : ''}</p>` : ''}
    <p class="err" id="edErr"></p>
    <div class="acts">
      ${rec ? `<button class="del" data-a="del">Delete</button>${hid && hid !== 'mei' ? `<button data-a="go">Send ${PNAME} to the handler</button>` : ''}` : ''}
      <button data-a="cancel">Cancel</button><button class="pri" data-a="save">Save</button>
    </div></div>`;
  const $ = s => edEl.querySelector(s);
  const hint = () => {
    const st = $('#edStatus').value, bl = $('#edBlocked').checked;
    $('#edHint').textContent = st === 'review' ? '· reviewer' : bl ? '· helper' : st === 'backlog' ? '· optional' : '· doer';
  };
  hint();
  $('#edStatus').addEventListener('change', e => { hint(); if (e.target.value === 'done' && !ongoing) { $('#edPct').value = 100; $('#edPctV').textContent = '100%'; } });
  $('#edBlocked').addEventListener('change', hint);
  $('#edPct').addEventListener('input', e => { $('#edPctV').textContent = e.target.value + '%'; });
  if (preset.needOwner) { $('#edErr').textContent = 'Pick a handler before leaving Backlog'; setTimeout(() => edEl.querySelector('#edHandler').parentNode.querySelector('.csel-btn').focus(), 60); }
  edEl.querySelectorAll('.acts button').forEach(b => b.addEventListener('click', () => {
    const a = b.dataset.a;
    if (a === 'cancel') { closeEditor(); renderKanban(true); return; }
    if (a === 'go') { closeEditor(); walkToMember(BY_ID[hid]); return; }
    if (a === 'del') { rec.m.work.tasks.splice(rec.m.work.tasks.indexOf(rec.t), 1); touchOwner(rec.m); refreshFilter(); closeEditor(); return; }
    const title = $('#edTitle').value.trim();
    if (!title) { $('#edTitle').focus(); $('#edTitle').classList.add('bad'); return; }
    const st = $('#edStatus').value, blocked = $('#edBlocked').checked, hSel = $('#edHandler').value;
    const patch = {
      title, project: ($('#edProj').value === '__new' ? $('#edProjNew').value.trim() : $('#edProj').value) || 'Uncategorized', status: st, priority: $('#edPri').value, due: $('#edDue').value || null,
      progress: ongoing ? null : +$('#edPct').value, blocked, note: $('#edNote').value.trim() || null, assigner: assignerId
    };
    // the handler picker means different things per stage
    let to = m;
    if (hSel === '_pool') {
      if (st !== 'backlog' && st !== 'closed') { $('#edErr').textContent = 'Unassigned tasks can only stay in Backlog — pick a handler'; $('#edHandler').parentNode.querySelector('.csel-btn').focus(); return; }
      to = UNASSIGNED;
    } else if (st === 'review' && !m.pool) {
      if (hSel === m.id) { $('#edErr').textContent = 'The reviewer can’t be the doer'; $('#edHandler').parentNode.querySelector('.csel-btn').focus(); return; }
      patch.reviewer = hSel;
    } else if (blocked && !m.pool && hSel !== m.id) {
      patch.helper = hSel;
    } else to = BY_ID[hSel];
    if (rec) applyTaskChange(rec.t, rec.m, to, patch);
    else {
      const nt = Object.assign({ id: ++TID, updated: 0, project: patch.project || 'Orion' }, patch);
      if (nt.status === 'done') nt.progress = 100;
      if (nt.blocked && !nt.note) nt.note = 'Needs help';
      if (nt.status === 'review') nt.reviewer = nt.reviewer || defaultReviewer(nt, to);
      noteHandled(nt, to);
      to.work.tasks.push(nt); touchOwner(to); refreshFilter();
      if (!to.player && !to.pool) say(to, `New task: “${nt.title}”`, 3);
    }
    closeEditor();
  }));
  edEl.onclick = e => { if (e.target === edEl) { closeEditor(); renderKanban(true); } };
  edEl.querySelectorAll('select').forEach(el => enhanceSelect(el, el.id === 'edHandler' ? { search: true, placeholder: 'Search people, roles…' } : {}));
  $('#edProj').addEventListener('change', e => { const n = $('#edProjNew'); n.style.display = e.target.value === '__new' ? '' : 'none'; if (e.target.value === '__new') n.focus(); });
  edEl.classList.add('show');
  setTimeout(() => { if (!preset.needOwner) $('#edTitle').focus(); }, 30);
}
addEventListener('keydown', e => { if (e.key === 'Escape') closeEditor(); });

/* =========================================================
   12h. DAY / NIGHT — lighting follows the visitor's local clock
   ========================================================= */
const SKY = { hour: 12, override: null, last: -1, d: 1, phase: 'day' };
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerpC = (a, b, t) => a.clone().lerp(b, t);
function sunTimes(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const doy = Math.floor((date - start) / 864e5);
  const L = 12 + 3.5 * Math.cos(2 * Math.PI * (doy - 172) / 365);
  return { rise: 12.3 - L / 2, set: 12.3 + L / 2 };
}
const fmtH = h => { h = ((h % 24) + 24) % 24; const hh = Math.floor(h), mm = Math.floor((h - hh) * 60); return hh + ':' + String(mm).padStart(2, '0'); };

// --- street lamps (outside) ---
const LAMPS = [];
{
  const poleM = M(P.indigo), headOff = M('#fff1c9', { emissive: '#ffd27a', ei: 0.05, unique: true });
  const poolMat = new THREE.MeshBasicMaterial({ map: glowTex, color: lin('#ffc46b'), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
  const poolGeo = new THREE.PlaneGeometry(1, 1);
  const spots = [[-2.8, 12.2], [2.8, 12.2], [-2.8, 16.5], [2.8, 16.5], [-14.6, 11.4], [14.6, 11.4], [15.2, 0], [15.2, -9]];
  spots.forEach(([x, z], i) => {
    const g = new THREE.Group(); g.position.set(x, -0.6, z); outside.add(g);
    B(g, 0.5, 0.18, 0.5, poleM, 0, 0.09, 0, 0.06);
    C(g, 0.07, 0.07, 3.1, poleM, 0, 1.7, 0);
    C(g, 0.34, 0.16, 0.22, poleM, 0, 3.36, 0, 16);
    const head = S(g, 0.24, headOff, 0, 3.12, 0, 14); head.castShadow = false;
    const halo = glow(g, 0, 3.12, 0, 3.0, '#ffd27a', 0);
    const pool = new THREE.Mesh(poolGeo, poolMat); pool.rotation.x = -Math.PI / 2; pool.scale.set(5.5, 5.5, 1);
    pool.position.set(0, 0.03, 0); pool.renderOrder = 1; g.add(pool);
    let light = null;
    if (i < 4) { light = new THREE.PointLight(lin('#ffc46b'), 0, 9, 1.8); light.position.set(0, 2.9, 0); g.add(light); }
    LAMPS.push({ g, head, halo, light });
  });
}

const SKY_STOPS = {
  day:   ['#f1e9ff', '#d6c6f7', '#a68be0', '#7d62c9'],
  dusk:  ['#ffd9c2', '#f2a7c8', '#9b6fd0', '#5a3fa8'],
  night: ['#3d3486', '#2a2160', '#191243', '#0e0a2b']
};
const hexMix = (a, b, t) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString();
// random star field (box-shadow)
{
  const mk = n => Array.from({ length: n }, () => `${(Math.random() * 100).toFixed(1)}vw ${(Math.random() * 62).toFixed(1)}vh #fff`).join(',');
  const st = document.querySelector('#sky .stars');
  st.style.setProperty('--st', mk(60)); st.style.setProperty('--st2', mk(90));
  const st2 = document.querySelector('#sky .s2');
  st2.style.setProperty('--st', mk(40)); st2.style.setProperty('--st2', mk(60));
}

const C_SUN_DAY = lin('#fff3e6'), C_SUN_GOLD = lin('#ffb27a'), C_MOON = lin('#9fb0ff');
const C_HEMI_SKY = [lin('#f5efff'), lin('#ffd2c4'), lin('#6c6ad8')];
const C_HEMI_GND = [lin('#5a46b8'), lin('#6a3a9a'), lin('#1c1550')];
const C_AMB = [lin('#b9a4ff'), lin('#e0a0d0'), lin('#4a3fa8')];
const C_PL_DAY = lin('#efe4ff'), C_PL_NIGHT = lin('#ffe2b0');
const WIN_MAT = M(P.sky, { emissive: P.sky, ei: 0.55 });
const C_WIN_DAY = lin(P.sky), C_WIN_NIGHT = lin('#241c5c');
// ground / plaza get their own materials so night can darken them without touching the building
const C_GROUND_NIGHT = lin('#3a2f7e');
const GROUND = outside.children.slice(0, 4).filter(o => o.isMesh).map(o => {
  o.material = o.material.clone(); return { m: o.material, day: o.material.color.clone() };
});

function applySky(h) {
  const { rise, set } = sunTimes();
  // daylight factor & golden-hour factor
  const d = smooth(rise - 0.6, rise + 0.9, h) * (1 - smooth(set - 0.9, set + 0.6, h));
  const g = Math.max(Math.exp(-((h - rise) ** 2) / 0.9), Math.exp(-((h - set) ** 2) / 0.9));
  const n = 1 - d;
  SKY.d = d;
  SKY.phase = d > 0.85 ? 'day' : d < 0.15 ? 'night' : (h < 12 ? 'dawn' : 'dusk');

  // sun: arc east → west; moon at night from the opposite side
  if (d > 0.02) {
    const f = Math.min(1, Math.max(0, (h - rise) / (set - rise)));
    const az = Math.PI * (0.15 + 0.7 * f);                       // 0 = +x (east)
    const el = 0.28 + 0.9 * Math.sin(Math.PI * f);
    const R = 44;
    sun.position.set(Math.cos(az) * Math.cos(el) * R, 4 + Math.sin(el) * R, Math.sin(az) * Math.cos(el) * R * 0.6 + 12);
  } else {
    sun.position.set(-14, 34, 18);
  }
  const dayCol = lerpC(C_SUN_DAY, C_SUN_GOLD, Math.min(1, g * 1.1));
  sun.color.copy(lerpC(C_MOON, dayCol, smooth(0, 0.35, d)));
  sun.intensity = 0.18 + 0.92 * d;

  const tw = Math.min(1, g * 1.2) * (1 - n * 0.5);               // twilight tint weight
  const pick = (arr) => lerpC(lerpC(arr[0], arr[1], tw), arr[2], n * (1 - tw * 0.5));
  hemi.color.copy(pick(C_HEMI_SKY)); hemi.groundColor.copy(pick(C_HEMI_GND));
  hemi.intensity = 0.85 - 0.62 * n;
  amb.color.copy(pick(C_AMB)); amb.intensity = 0.24 - 0.16 * n;
  rim.intensity = 0.35 - 0.15 * n;
  renderer.toneMappingExposure = 1.08 + 0.04 * n;

  FLOORS.forEach(F => { if (!F.light) return; F.light.color.copy(lerpC(C_PL_DAY, C_PL_NIGHT, n)); F.light.intensity = 0.55 + 1.25 * n; });
  GROUND.forEach(G => { G.m.color.copy(lerpC(G.day, C_GROUND_NIGHT, n * 0.8)); G.m.emissive.copy(G.m.color).multiplyScalar(0.05); });
  WIN_MAT.color.copy(lerpC(C_WIN_NIGHT, C_WIN_DAY, d));
  WIN_MAT.emissive.copy(lerpC(C_WIN_NIGHT, C_WIN_DAY, d)); WIN_MAT.emissiveIntensity = 0.15 + 0.4 * d;

  // street lamps switch on as the light fades
  const on = smooth(0.25, 0.75, n);
  LAMPS.forEach(L => {
    L.head.material.emissiveIntensity = 0.05 + 2.2 * on;
    L.halo.material.opacity = 0.75 * on;
    if (L.light) L.light.intensity = 1.5 * on;
  });
  const pool = LAMPS[0]?.g.children.find(o => o.isMesh && o.material.map === glowTex);
  if (pool) pool.material.opacity = 0.55 * on;

  // CSS sky
  const st = SKY_STOPS, c = [0, 1, 2, 3].map(i => {
    const dayDusk = hexMix(st.day[i], st.dusk[i], Math.min(1, g * 1.15) * (d > 0.5 ? 1 : 0.6));
    return hexMix(dayDusk, st.night[i], smooth(0.35, 1, n));
  });
  const bg = `radial-gradient(ellipse at 50% 38%, ${c[0]} 0%, ${c[1]} 40%, ${c[2]} 78%, ${c[3]} 100%)`;
  document.documentElement.style.background = bg; document.body.style.background = bg;
  document.getElementById('sky').style.opacity = smooth(0.5, 0.95, n).toFixed(2);
  document.body.classList.toggle('night', n > 0.6);

  // toolbar clock
  const icon = { day: '☀', dawn: '🌅', dusk: '🌇', night: '🌙' }[SKY.phase];
  const label = { day: 'Day', dawn: 'Dawn', dusk: 'Dusk', night: 'Night' }[SKY.phase];
  clockBtn.querySelector('.ci').textContent = icon;
  clockBtn.querySelector('.ct').textContent = fmtH(h);
  clockBtn.querySelector('.cp').textContent = label;
  sunInfo.textContent = `Sunrise ${fmtH(rise)} · Sunset ${fmtH(set)}`;
}
const clockBtn = document.getElementById('clockBtn'), clockPop = document.getElementById('clockPop');
const clockRange = document.getElementById('clockRange'), clockLive = document.getElementById('clockLive');
const sunInfo = document.getElementById('sunInfo'), clockSrc = document.getElementById('clockSrc');
const localHour = () => { const t = new Date(); return t.getHours() + t.getMinutes() / 60 + t.getSeconds() / 3600; };
function skyHour() { return SKY.override ?? localHour(); }
function refreshClockUI() {
  const pv = SKY.override !== null;
  clockBtn.classList.toggle('preview', pv); clockLive.disabled = !pv;
  clockSrc.textContent = pv ? 'Previewing' : 'Following local time';
  clockRange.value = skyHour().toFixed(2);
  const { rise, set } = sunTimes(), pc = h => (h / 24 * 100).toFixed(1) + '%';
  clockRange.style.background = `linear-gradient(90deg, #191243 0%, #3d3486 ${pc(rise - 0.8)}, #f2a7c8 ${pc(rise + 0.3)}, #e9defc ${pc(rise + 1.6)}, #f1e9ff 50%, #e9defc ${pc(set - 1.6)}, #f2a7c8 ${pc(set - 0.3)}, #3d3486 ${pc(set + 0.8)}, #191243 100%)`;
}
function setSkyHour(h) { SKY.override = h; refreshClockUI(); applySky(skyHour()); }
clockBtn.addEventListener('click', e => { e.stopPropagation(); clockPop.classList.toggle('open'); refreshClockUI(); });
clockRange.addEventListener('input', () => setSkyHour(+clockRange.value));
clockLive.addEventListener('click', () => setSkyHour(null));
document.addEventListener('pointerdown', e => { if (clockPop.classList.contains('open') && !clockPop.contains(e.target) && !clockBtn.contains(e.target)) clockPop.classList.remove('open'); });
function updateSky(t) {
  if (t - SKY.last < 1 && SKY.last >= 0) return;
  SKY.last = t; applySky(skyHour());
}
refreshClockUI(); applySky(skyHour());

/* =========================================================
   13. RESIZE + LOOP
   ========================================================= */
function onResize() {
  aspect = window.innerWidth / window.innerHeight;
  camera.left = -aspect * FRUSTUM / 2; camera.right = aspect * FRUSTUM / 2;
  camera.top = FRUSTUM / 2; camera.bottom = -FRUSTUM / 2;
  camera.updateProjectionMatrix();
  chaseCam.aspect = aspect; chaseCam.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);

const clock = new THREE.Clock();
let frame = 0, lastT = 0;
function tick() {
  const t = clock.getElapsedTime(), dt = Math.min(t - lastT, 0.05); lastT = t;
  updateLife(t, dt);
  updateLift(dt);
  updatePlayer(t, dt);
  updatePomo(t, dt);
  updateSky(t);
  PULSE.forEach((m, i) => { m.emissiveIntensity = 1.1 + Math.sin(t * 3 + i * 1.3) * 0.6; });
  TEAM.forEach(m => {                                                // status rings: blocked pulses, pinned glows
    const base = m.work.status === 'blocked' ? 1.1 + Math.sin(t * 5) * 0.8 : 0.9;
    m.ring.material.emissiveIntensity = m.pinned ? 2.2 : base;
    m.ring.scale.setScalar(m.pinned ? 1.15 + Math.sin(t * 4) * 0.05 : 1);
  });
  if (camGoal.target) {                                              // smooth camera goal
    const d = camGoal.target.clone().sub(controls.target).multiplyScalar(0.12);
    controls.target.add(d); camera.position.add(d);
    if (d.lengthSq() < 1e-7) camGoal.target = null;
  }
  if (camGoal.zoom) {
    camera.zoom += (camGoal.zoom - camera.zoom) * 0.12; camera.updateProjectionMatrix();
    if (Math.abs(camGoal.zoom - camera.zoom) < 0.002) camGoal.zoom = null;
  }
  controls.update();
  renderer.render(scene, viewCam);
  updateTags(frame++ % 10 === 0);
  requestAnimationFrame(tick);
}
tick();
window.dispatchEvent(new Event('hq:ready'));   // first frame is on screen: the loader can fade out

window.OFFICE = { THREE, scene, camera, renderer, controls, P, M, B, C, S, blob, glow,
  labelMesh, floorLabel, wallLabel, tagSprite, person, robot, desk, chair, plant,
  FH, LEVELS, FLOORS, DESKS, DESK, TEAM, NAV, findPath, showFloor, mei, hero, zoomAt,
  STATUS, WORK, applyStatus, renderPanel, focusMember, updateLife, startTrip, BY_ID,
  POMO, KB, TASK_BY_ID, renderKanban, openEditor, moveTask, setTab, setPanel,
  XRAY, PLAYER, LIFT, CHASE, SEATS, sitAt, seatFree, seatApproach, liftCall, updateLift, boardLift, selectLiftFloor, goTo, walkToMember, openDialog, freeAt, planRoute, updatePlayer, SPOTS, nearby, SKY, applySky, setSkyHour, sunTimes, LAMPS };
})();
