'use client';

// 尼龙网布：经纬线织成的带张力网格。
// 鼠标划过 → 切断路径上的连线并把布推开，张力把切口绷成洞，少数纤维没断，被拉长横跨在洞里；
// 一段时间后断口被“缝”回来，但缝线比原来更短、更乱 —— 留下一道收紧、起皱的疤痕，不会恢复如初。

import { useEffect, useRef } from 'react';

const SPACING = 5; // 节点间距（CSS px）
const TENSION = 0.94; // 连线静止长度 = 几何长度 × TENSION，<1 表示布是绷紧的
const ITERATIONS = 3;
const DAMPING = 0.95;
const ANCHOR = 0.0006; // 节点回到原位的极弱拉力，只防漂移
const TEAR_STRETCH = 2.4; // 连线被拉到静止长度的多少倍会自己断
const CUT_RADIUS = SPACING * 1.2;
const PUSH_RADIUS = SPACING * 3;
const FIBER_CHANCE = 0.35; // 被切断时仍留着一根纤维的概率
const FIBER_STIFFNESS = 0.035;
const FIBER_SNAP = 14; // 纤维被拉到几何长度的多少倍才真正断
const HEAL_DELAY: [number, number] = [1.6, 3.4]; // 断开后多久开始缝（秒）
const STITCH_SPEED = 22; // 缝线每秒收短多少 px
const STITCH_DONE = 1.3; // 两端距离回到几何长度的多少倍以内算缝好
const STITCH_TIMEOUT = 8; // 缝这么久还没拉拢就直接收尾（秒），保证动画最终能停下
const STITCH_PULL = 0.05; // 缝合时把两端往原位拉的力度：整块布的张力会把洞撑大，单靠缝线拉不回来
const SCAR_SHRINK = 0.72; // 疤痕处连线比原来短，布会被拉皱
const SCAR_EXTRA_CHANCE = 0.8; // 缝上时额外多缝乱线的概率
const STRAIN_VISIBLE = 0.22; // 对角线形变超过多少才画出来

const RED = '#e0405a';
const BLUE = '#2e5fe6';
const LIGHT_BLUE = '#8eb0f6';
const COLORS = [RED, BLUE, LIGHT_BLUE];
// 纬线（横向）按行分色带：红 / 蓝 / 浅蓝 / 蓝，每条带 3 行
const WEFT_BANDS = [0, 1, 2, 1];
const ROWS_PER_BAND = 3;

const enum Kind {
  Weft = 0, // 横线
  Warp = 1, // 竖线
  Diagonal = 2, // 让布有剪切刚度的对角线，平时不画
}

const enum State {
  Intact = 0,
  Broken = 1,
  Fiber = 2, // 切开后残留的纤维：很软、很能拉
  Stitching = 3,
  Scar = 4,
  Dead = 5, // 疤痕又被张力扯断：不再缝，避免缝了又断的死循环
}

type Sim = {
  n: number;
  x: Float32Array;
  y: Float32Array;
  px: Float32Array;
  py: Float32Array;
  rx: Float32Array;
  ry: Float32Array;
  pinned: Uint8Array;
  // 连线（疤痕会额外加线，所以按容量分配）
  count: number;
  la: Int32Array;
  lb: Int32Array;
  geo: Float32Array; // 原始几何长度
  rest: Float32Array; // 当前静止长度
  kind: Uint8Array;
  color: Uint8Array;
  state: Uint8Array;
  timer: Float32Array;
  cols: number;
};

function buildSim(width: number, height: number): Sim {
  const cols = Math.max(4, Math.floor(width / SPACING));
  const rows = Math.max(4, Math.floor(height / SPACING));
  const sx = width / cols;
  const sy = height / rows;
  const n = (cols + 1) * (rows + 1);
  const x = new Float32Array(n);
  const y = new Float32Array(n);
  const pinned = new Uint8Array(n);
  const idx = (r: number, c: number) => r * (cols + 1) + c;
  // 几层低频正弦叠加的起伏：织线不再笔直，出现布料的波纹和摩尔纹
  const ph = Array.from({ length: 6 }, () => Math.random() * Math.PI * 2);
  const wobble = (u: number, v: number, o: number) =>
    Math.sin(u * 0.035 + v * 0.012 + ph[o]) * 2.2 +
    Math.sin(v * 0.05 - u * 0.02 + ph[o + 1]) * 1.6 +
    Math.sin((u + v) * 0.13 + ph[o + 2]) * 0.5;
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const i = idx(r, c);
      const edge = r === 0 || c === 0 || r === rows || c === cols;
      const gx = c * sx;
      const gy = r * sy;
      x[i] = gx + (edge ? 0 : wobble(gx, gy, 0) * 0.6);
      y[i] = gy + (edge ? 0 : wobble(gx, gy, 3));
      if (edge) pinned[i] = 1;
    }
  }

  const base = cols * (rows + 1) + rows * (cols + 1) + cols * rows;
  const cap = Math.ceil(base * 2);
  const sim: Sim = {
    n,
    x,
    y,
    px: x.slice(),
    py: y.slice(),
    rx: x.slice(),
    ry: y.slice(),
    pinned,
    count: 0,
    la: new Int32Array(cap),
    lb: new Int32Array(cap),
    geo: new Float32Array(cap),
    rest: new Float32Array(cap),
    kind: new Uint8Array(cap),
    color: new Uint8Array(cap),
    state: new Uint8Array(cap),
    timer: new Float32Array(cap),
    cols,
  };

  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      if (c < cols) addLink(sim, idx(r, c), idx(r, c + 1), Kind.Weft, WEFT_BANDS[Math.floor(r / ROWS_PER_BAND) % WEFT_BANDS.length]);
      if (r < rows) addLink(sim, idx(r, c), idx(r + 1, c), Kind.Warp, 2);
      if (r < rows && c < cols) {
        if ((r + c) % 2 === 0) addLink(sim, idx(r, c), idx(r + 1, c + 1), Kind.Diagonal, (r + c) % 4 === 0 ? 0 : 1);
        else addLink(sim, idx(r, c + 1), idx(r + 1, c), Kind.Diagonal, (r + c) % 4 === 1 ? 1 : 0);
      }
    }
  }
  return sim;
}

function addLink(sim: Sim, i: number, j: number, kind: Kind, color: number, rest?: number): number {
  if (sim.count >= sim.la.length) return -1; // 容量用完就不再加乱线
  const k = sim.count++;
  const d = Math.hypot(sim.x[j] - sim.x[i], sim.y[j] - sim.y[i]);
  sim.la[k] = i;
  sim.lb[k] = j;
  sim.geo[k] = d;
  sim.rest[k] = rest ?? d * TENSION;
  sim.kind[k] = kind;
  sim.color[k] = color;
  sim.state[k] = State.Intact;
  return k;
}

const healDelay = () => HEAL_DELAY[0] + Math.random() * (HEAL_DELAY[1] - HEAL_DELAY[0]);

function distToSegmentSq(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq > 0 ? ((px - ax) * dx + (py - ay) * dy) / lenSq : 0;
  t = Math.max(0, Math.min(1, t));
  const ex = ax + t * dx - px;
  const ey = ay + t * dy - py;
  return ex * ex + ey * ey;
}

// 鼠标一段移动路径：切断附近连线（少数留成纤维），并把附近节点往两侧推开
function cut(sim: Sim, ax: number, ay: number, bx: number, by: number) {
  const mx = bx - ax;
  const my = by - ay;
  const moveLen = Math.hypot(mx, my);
  if (moveLen < 0.5) return;

  const { x, y, px, py, pinned, la, lb, state, timer } = sim;
  const cutSq = CUT_RADIUS * CUT_RADIUS;
  for (let k = 0; k < sim.count; k++) {
    const s = state[k];
    if (s !== State.Intact && s !== State.Scar) continue;
    const cx = (x[la[k]] + x[lb[k]]) * 0.5;
    const cy = (y[la[k]] + y[lb[k]]) * 0.5;
    if (distToSegmentSq(cx, cy, ax, ay, bx, by) < cutSq) {
      state[k] = Math.random() < FIBER_CHANCE ? State.Fiber : State.Broken;
      timer[k] = healDelay();
    }
  }

  const nx = -my / moveLen;
  const ny = mx / moveLen;
  const pushSq = PUSH_RADIUS * PUSH_RADIUS;
  // 推力要轻：太大会把布推得折叠起来再也展不开，洞主要靠布自身的张力撑开
  const strength = Math.min(moveLen, 20) * 0.03;
  for (let i = 0; i < sim.n; i++) {
    if (pinned[i]) continue;
    const dSq = distToSegmentSq(x[i], y[i], ax, ay, bx, by);
    if (dSq > pushSq) continue;
    const falloff = 1 - Math.sqrt(dSq) / PUSH_RADIUS;
    const side = (x[i] - ax) * nx + (y[i] - ay) * ny >= 0 ? 1 : -1;
    px[i] -= (nx * side * 0.8 + (mx / moveLen) * 0.25) * strength * falloff;
    py[i] -= (ny * side * 0.8 + (my / moveLen) * 0.25) * strength * falloff;
  }
}

// 缝上一根线时，在附近再随机多缝一针，疤痕因此显得乱而密
function addStray(sim: Sim, i: number) {
  const { cols, x, y } = sim;
  const r0 = Math.floor(i / (cols + 1));
  const c0 = i % (cols + 1);
  const dr = Math.round((Math.random() - 0.5) * 5);
  const dc = Math.round((Math.random() - 0.5) * 5);
  const r = r0 + dr;
  const c = c0 + dc;
  if ((dr === 0 && dc === 0) || c < 0 || c > cols || r < 0) return;
  const j = r * (cols + 1) + c;
  if (j >= sim.n) return;
  const d = Math.hypot(x[j] - x[i], y[j] - y[i]);
  const k = addLink(sim, i, j, Kind.Diagonal, Math.random() < 0.5 ? 0 : 1, d * SCAR_SHRINK);
  if (k >= 0) sim.state[k] = State.Scar;
}

// 推进一帧，返回是否仍在运动（用于空闲时停掉动画循环）
function step(sim: Sim, dt: number): boolean {
  const { x, y, px, py, rx, ry, pinned, la, lb, geo, rest, state, timer } = sim;
  let active = false;

  for (let i = 0; i < sim.n; i++) {
    if (pinned[i]) continue;
    const vx = (x[i] - px[i]) * DAMPING;
    const vy = (y[i] - py[i]) * DAMPING;
    px[i] = x[i];
    py[i] = y[i];
    x[i] += vx + (rx[i] - x[i]) * ANCHOR;
    y[i] += vy + (ry[i] - y[i]) * ANCHOR;
    if (vx * vx + vy * vy > 0.0004) active = true;
  }

  // 软弹簧：残留的纤维
  const spring = (k: number, strength: number) => {
    const i = la[k];
    const j = lb[k];
    const dx = x[j] - x[i];
    const dy = y[j] - y[i];
    const d = Math.hypot(dx, dy) || 1;
    const f = ((d - rest[k]) / d) * strength * 0.5;
    if (!pinned[i]) {
      x[i] += dx * f;
      y[i] += dy * f;
    }
    if (!pinned[j]) {
      x[j] -= dx * f;
      y[j] -= dy * f;
    }
    return d;
  };

  const count = sim.count;
  for (let k = 0; k < count; k++) {
    const s = state[k];
    if (s === State.Intact || s === State.Scar || s === State.Dead) continue;
    active = true;
    if (s === State.Broken || s === State.Fiber) {
      if (s === State.Fiber) {
        const d = spring(k, FIBER_STIFFNESS);
        if (d > geo[k] * FIBER_SNAP) state[k] = State.Broken;
      }
      timer[k] -= dt;
      if (timer[k] <= 0) {
        // 从当前距离开始缝，线再逐渐收短
        state[k] = State.Stitching;
        rest[k] = Math.hypot(x[lb[k]] - x[la[k]], y[lb[k]] - y[la[k]]);
        timer[k] = STITCH_TIMEOUT;
      }
      continue;
    }
    // Stitching：静止长度逐渐收短（在下面的约束里当硬线处理），收到比原来更短就成了疤痕
    for (const n of [la[k], lb[k]]) {
      if (pinned[n]) continue;
      x[n] += (rx[n] - x[n]) * STITCH_PULL;
      y[n] += (ry[n] - y[n]) * STITCH_PULL;
    }
    const target = geo[k] * SCAR_SHRINK;
    const next = rest[k] - STITCH_SPEED * dt;
    rest[k] = Math.max(target, next);
    // 线已收到最短、两端也真的被拉拢了才算缝好；否则继续拉
    const d = Math.hypot(x[lb[k]] - x[la[k]], y[lb[k]] - y[la[k]]);
    timer[k] -= dt;
    if ((next <= target && d < geo[k] * STITCH_DONE) || timer[k] <= 0) {
      state[k] = State.Scar;
      if (Math.random() < SCAR_EXTRA_CHANCE) addStray(sim, la[k]);
      if (Math.random() < SCAR_EXTRA_CHANCE * 0.5) addStray(sim, lb[k]);
    }
  }

  for (let it = 0; it < ITERATIONS; it++) {
    for (let k = 0; k < sim.count; k++) {
      const s = state[k];
      if (s !== State.Intact && s !== State.Scar && s !== State.Stitching) continue;
      const i = la[k];
      const j = lb[k];
      const dx = x[j] - x[i];
      const dy = y[j] - y[i];
      const d = Math.hypot(dx, dy) || 1;
      if (it === 0 && s !== State.Stitching && d > Math.max(rest[k], geo[k]) * TEAR_STRETCH) {
        if (s === State.Scar) state[k] = State.Dead;
        else {
          state[k] = Math.random() < FIBER_CHANCE ? State.Fiber : State.Broken;
          timer[k] = healDelay();
        }
        continue;
      }
      const pi = pinned[i];
      const pj = pinned[j];
      if (pi && pj) continue;
      const diff = (d - rest[k]) / d;
      const wi = pi ? 0 : pj ? 1 : 0.5;
      const wj = pj ? 0 : pi ? 1 : 0.5;
      x[i] += dx * diff * wi;
      y[i] += dy * diff * wi;
      x[j] -= dx * diff * wj;
      y[j] -= dy * diff * wj;
    }
  }

  return active;
}

type Style = { width: number; alpha: number; pick: (sim: Sim, k: number) => boolean };

const STYLES: Style[] = [
  // 竖向经线：浅、细
  { width: 0.5, alpha: 0.4, pick: (s, k) => s.state[k] === State.Intact && s.kind[k] === Kind.Warp },
  // 斜向织纹：很淡，让布面有编织感
  { width: 0.45, alpha: 0.3, pick: (s, k) => s.state[k] === State.Intact && s.kind[k] === Kind.Diagonal },
  // 横向纬线：主色带
  { width: 0.65, alpha: 0.7, pick: (s, k) => s.state[k] === State.Intact && s.kind[k] === Kind.Weft },
  // 被拉扯变形的对角线：显出切口边缘的三角网
  {
    width: 0.5,
    alpha: 0.55,
    pick: (s, k) => {
      if (s.state[k] !== State.Intact || s.kind[k] !== Kind.Diagonal) return false;
      const d = Math.hypot(s.x[s.lb[k]] - s.x[s.la[k]], s.y[s.lb[k]] - s.y[s.la[k]]);
      return Math.abs(d - s.geo[k]) / s.geo[k] > STRAIN_VISIBLE;
    },
  },
  // 洞里残留的纤维、正在缝的线
  { width: 0.45, alpha: 0.7, pick: (s, k) => s.state[k] === State.Fiber || s.state[k] === State.Stitching },
  // 疤痕：更粗更深
  { width: 0.9, alpha: 0.9, pick: (s, k) => s.state[k] === State.Scar },
];

function draw(ctx: CanvasRenderingContext2D, sim: Sim) {
  const { x, y, la, lb, color } = sim;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.lineCap = 'round';
  for (const style of STYLES) {
    ctx.lineWidth = style.width;
    ctx.globalAlpha = style.alpha;
    for (let ci = 0; ci < COLORS.length; ci++) {
      ctx.strokeStyle = COLORS[ci];
      ctx.beginPath();
      for (let k = 0; k < sim.count; k++) {
        if (color[k] !== ci || !style.pick(sim, k)) continue;
        ctx.moveTo(x[la[k]], y[la[k]]);
        ctx.lineTo(x[lb[k]], y[lb[k]]);
      }
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

export default function TornMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // 网布四周留边
    const inset = SPACING * 3;
    const dpr = () => Math.min(2, window.devicePixelRatio || 1);

    let sim: Sim | null = null;
    let raf = 0;
    let running = false;
    let lastTime = 0;
    let pointer: { x: number; y: number } | null = null;

    const render = () => {
      if (!sim) return;
      ctx.setTransform(dpr(), 0, 0, dpr(), inset * dpr(), inset * dpr());
      draw(ctx, sim);
    };

    const frame = (time: number) => {
      if (!sim) return;
      const dt = Math.min(0.05, (time - lastTime) / 1000 || 0.016);
      lastTime = time;
      const active = step(sim, dt);
      render();
      if (active) raf = requestAnimationFrame(frame);
      else running = false;
    };

    const wake = () => {
      if (running) return;
      running = true;
      lastTime = performance.now();
      raf = requestAnimationFrame(frame);
    };

    let size = { width: 0, height: 0 };
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      // 尺寸没变就不重建，否则撕口和疤痕会被清掉
      if (Math.abs(width - size.width) < 1 && Math.abs(height - size.height) < 1) return;
      size = { width, height };
      canvas.width = Math.round(width * dpr());
      canvas.height = Math.round(height * dpr());
      sim = buildSim(width - inset * 2, height - inset * 2);
      render();
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const p = { x: e.clientX - rect.left - inset, y: e.clientY - rect.top - inset };
      if (pointer && sim) cut(sim, pointer.x, pointer.y, p.x, p.y);
      pointer = p;
      wake();
    };
    const onLeave = () => {
      pointer = null;
    };

    // ResizeObserver 在页面不可见时不会回调，先同步建一次
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointercancel', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointercancel', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="A stretched nylon mesh — drag across it to tear it, and it stitches itself back with a scar"
      style={{ display: 'block', width: '100%', height: '100%', touchAction: 'pan-y', cursor: 'crosshair' }}
    />
  );
}
