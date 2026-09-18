'use client';

// 戳泡泡：黑底上的一团肥皂泡沫，只画白色的泡壁。点一个泡泡，它的壁破开、碎片飞散，
// 气体并进相邻的泡泡，邻居撑开把缺口补上 —— 泡沫越戳越粗，就像真的泡沫在衰老。
//
// 泡沫的几何用 power diagram（加权 Voronoi）：每个泡泡是一个站点 p 和一个权重 w，
// 格子是 {x : |x-p|² - w 最小}。每帧做两件事让它像真泡沫：
//   1. 站点向格子重心靠（Lloyd 松弛）—— 泡壁自然趋向三壁 120° 相交，格子以六边形为主；
//   2. 调权重让格子面积趋向各自的目标面积 —— 泡泡大小不一，戳破后邻居能平滑地长大。
// 格子由容器圆（多边形近似）逐个用半平面裁出来，每条边记着“隔壁是谁”，
// 这样正在破的泡泡两侧的壁可以不画，露出破口。

import { useEffect, useRef } from 'react';

const TWO_PI = Math.PI * 2;
const RIM_SIDES = 96; // 容器圆的多边形近似
const WALL = '#f5f3ee';
const CONTAINER = -1;

type Site = {
  id: number;
  x: number;
  y: number;
  w: number;
  target: number; // 目标面积
  base: number; // 目标面积的基准（呼吸在它上面起伏）
  phase: number;
  dying: boolean;
};

type Cell = { xs: number[]; ys: number[]; labels: number[]; area: number; cx: number; cy: number };

type Shard = { x1: number; y1: number; x2: number; y2: number; vx: number; vy: number; spin: number; age: number; life: number };

// 用半平面 a·x <= b 裁剪多边形；新边（沿裁剪线）标记为 label
function clip(poly: Cell, ax: number, ay: number, b: number, label: number): Cell {
  const { xs, ys, labels } = poly;
  const n = xs.length;
  const out: Cell = { xs: [], ys: [], labels: [], area: 0, cx: 0, cy: 0 };
  for (let k = 0; k < n; k++) {
    const sx = xs[k];
    const sy = ys[k];
    const tx = xs[(k + 1) % n];
    const ty = ys[(k + 1) % n];
    const ds = ax * sx + ay * sy - b;
    const dt = ax * tx + ay * ty - b;
    const sIn = ds <= 0;
    const tIn = dt <= 0;
    if (sIn) {
      out.xs.push(sx);
      out.ys.push(sy);
      out.labels.push(labels[k]);
    }
    if (sIn !== tIn) {
      const t = ds / (ds - dt);
      out.xs.push(sx + (tx - sx) * t);
      out.ys.push(sy + (ty - sy) * t);
      // 出去的那一点之后沿裁剪线走（新边）；进来的那一点之后沿原边走
      out.labels.push(sIn ? label : labels[k]);
    }
  }
  return out;
}

function measure(cell: Cell) {
  const { xs, ys } = cell;
  let a = 0;
  let cx = 0;
  let cy = 0;
  for (let k = 0, n = xs.length; k < n; k++) {
    const j = (k + 1) % n;
    const cross = xs[k] * ys[j] - xs[j] * ys[k];
    a += cross;
    cx += (xs[k] + xs[j]) * cross;
    cy += (ys[k] + ys[j]) * cross;
  }
  a /= 2;
  cell.area = Math.abs(a);
  if (Math.abs(a) > 1e-6) {
    cell.cx = cx / (6 * a);
    cell.cy = cy / (6 * a);
  }
}

function contains(cell: Cell, x: number, y: number) {
  const { xs, ys } = cell;
  let inside = false;
  for (let i = 0, j = xs.length - 1; i < xs.length; j = i++) {
    if (ys[i] > y !== ys[j] > y && x < ((xs[j] - xs[i]) * (y - ys[i])) / (ys[j] - ys[i]) + xs[i]) inside = !inside;
  }
  return inside;
}

function gaussian() {
  return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(TWO_PI * Math.random());
}

export default function BubblePop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cx0 = 0;
    let cy0 = 0;
    let R = 0;
    let rim: Cell = { xs: [], ys: [], labels: [], area: 0, cx: 0, cy: 0 };

    let sites: Site[] = [];
    let cells = new Map<number, Cell>();
    const shards: Shard[] = [];
    let nextId = 0;
    let time = 0;
    let fade = 1; // 泡沫重新长出来时淡入
    let regrowClock = -1;
    let hoverId = -1;

    const buildRim = () => {
      rim = { xs: [], ys: [], labels: [], area: 0, cx: 0, cy: 0 };
      for (let k = 0; k < RIM_SIDES; k++) {
        const a = (k / RIM_SIDES) * TWO_PI;
        rim.xs.push(cx0 + Math.cos(a) * R);
        rim.ys.push(cy0 + Math.sin(a) * R);
        rim.labels.push(CONTAINER);
      }
    };

    const computeCells = () => {
      const next = new Map<number, Cell>();
      for (const s of sites) {
        // 近的站点先裁，多边形很快缩小，后面的裁剪就很便宜
        const others = sites
          .filter((o) => o !== s)
          .map((o) => ({ o, d: (o.x - s.x) ** 2 + (o.y - s.y) ** 2 }))
          .sort((a, b) => a.d - b.d);
        let poly: Cell = { xs: rim.xs.slice(), ys: rim.ys.slice(), labels: rim.labels.slice(), area: 0, cx: 0, cy: 0 };
        for (const { o } of others) {
          // |x-s|² - ws <= |x-o|² - wo  ⇔  2(o-s)·x <= |o|² - |s|² + ws - wo
          const ax = 2 * (o.x - s.x);
          const ay = 2 * (o.y - s.y);
          const b = o.x * o.x + o.y * o.y - s.x * s.x - s.y * s.y + s.w - o.w;
          poly = clip(poly, ax, ay, b, o.id);
          if (poly.xs.length < 3) break;
        }
        measure(poly);
        next.set(s.id, poly);
      }
      cells = next;
    };

    const seed = () => {
      const count = Math.max(24, Math.round((Math.PI * R * R) / 1500));
      sites = [];
      for (let i = 0; i < count; i++) {
        const a = Math.random() * TWO_PI;
        const r = Math.sqrt(Math.random()) * R * 0.95;
        sites.push({
          id: nextId++,
          x: cx0 + Math.cos(a) * r,
          y: cy0 + Math.sin(a) * r,
          w: 0,
          target: 0,
          base: Math.exp(gaussian() * 0.42), // 大小不一：对数正态
          phase: Math.random() * TWO_PI,
          dying: false,
        });
      }
      const total = sites.reduce((sum, s) => sum + s.base, 0);
      const area = Math.PI * R * R;
      for (const s of sites) {
        s.base = (s.base / total) * area;
        s.target = s.base;
      }
      // 先松弛到像样的泡沫再显示
      for (let i = 0; i < 90; i++) relax(1);
    };

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      const changed = Math.abs(rect.width - width) > 0.5 || Math.abs(rect.height - height) > 0.5;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      if (changed) {
        cx0 = width / 2;
        cy0 = height / 2;
        R = Math.min(width, height) * 0.4;
        buildRim();
        seed();
      }
      return true;
    };

    // 一步松弛：算格子 → 调权重逼近目标面积 → 站点向重心靠
    function relax(k: number) {
      computeCells();
      for (const s of sites) {
        const cell = cells.get(s.id);
        const area = cell && cell.xs.length >= 3 ? cell.area : 0;
        s.w += Math.min(0.9, 0.35 * k) * (s.target - area);
        if (cell && cell.xs.length >= 3) {
          const rate = Math.min(1, 0.12 * k);
          s.x += (cell.cx - s.x) * rate;
          s.y += (cell.cy - s.y) * rate;
        }
      }
      // 权重整体平移不改变图形，归零防止数值漂移
      const mean = sites.reduce((sum, s) => sum + s.w, 0) / Math.max(1, sites.length);
      for (const s of sites) s.w -= mean;
    }

    const pop = (site: Site) => {
      const cell = cells.get(site.id);
      site.dying = true;
      if (!cell) return;

      // 气体并进相邻的泡泡（按共享边分），没有邻居（贴着容器）时平分给所有泡泡
      const neighbours = new Set(cell.labels.filter((l) => l !== CONTAINER));
      const heirs = sites.filter((s) => neighbours.has(s.id) && !s.dying);
      const pool = heirs.length ? heirs : sites.filter((s) => !s.dying);
      for (const h of pool) h.base += site.base / pool.length;
      site.base = 0;

      // 泡壁碎片：每条边拆成几段，从泡泡中心向外飞散
      const { xs, ys } = cell;
      for (let k = 0; k < xs.length; k++) {
        const j = (k + 1) % xs.length;
        const pieces = 3;
        for (let p = 0; p < pieces; p++) {
          const t0 = p / pieces + 0.04;
          const t1 = (p + 1) / pieces - 0.04;
          const x1 = xs[k] + (xs[j] - xs[k]) * t0;
          const y1 = ys[k] + (ys[j] - ys[k]) * t0;
          const x2 = xs[k] + (xs[j] - xs[k]) * t1;
          const y2 = ys[k] + (ys[j] - ys[k]) * t1;
          const mx = (x1 + x2) / 2 - cell.cx;
          const my = (y1 + y2) / 2 - cell.cy;
          const len = Math.hypot(mx, my) || 1;
          const speed = 30 + Math.random() * 60;
          shards.push({ x1, y1, x2, y2, vx: (mx / len) * speed, vy: (my / len) * speed, spin: (Math.random() - 0.5) * 6, age: 0, life: 0.45 + Math.random() * 0.3 });
        }
      }
    };

    const step = (dt: number) => {
      const k = dt * 60 * (reduceMotion ? 0.4 : 1);
      time += dt;

      if (sites.length === 0) {
        if (regrowClock < 0) regrowClock = 1.2;
        regrowClock -= dt;
        if (regrowClock <= 0) {
          regrowClock = -1;
          seed();
          fade = 0;
        }
      }
      fade = Math.min(1, fade + dt * 1.6);

      // 呼吸：目标面积缓慢起伏，泡沫一直在轻轻动
      for (const s of sites) {
        if (s.dying) {
          // 正在破的泡泡迅速缩小，邻居撑开补上
          s.target = Math.max(0, s.target - s.target * Math.min(1, dt * 7) - dt * 40);
        } else {
          s.target += (s.base * (1 + 0.06 * Math.sin(time * 0.8 + s.phase)) - s.target) * Math.min(1, dt * 3);
        }
      }

      relax(k);

      // 面积缩到几乎为零的泡泡正式移除
      sites = sites.filter((s) => {
        if (!s.dying) return true;
        const cell = cells.get(s.id);
        return !!cell && cell.xs.length >= 3 && cell.area > 4;
      });

      for (const sh of shards) {
        sh.age += dt;
        sh.x1 += sh.vx * dt;
        sh.y1 += sh.vy * dt;
        sh.x2 += sh.vx * dt;
        sh.y2 += sh.vy * dt;
        // 绕中点转一点
        const mx = (sh.x1 + sh.x2) / 2;
        const my = (sh.y1 + sh.y2) / 2;
        const a = sh.spin * dt;
        const rot = (x: number, y: number) => [mx + (x - mx) * Math.cos(a) - (y - my) * Math.sin(a), my + (x - mx) * Math.sin(a) + (y - my) * Math.cos(a)];
        [sh.x1, sh.y1] = rot(sh.x1, sh.y1);
        [sh.x2, sh.y2] = rot(sh.x2, sh.y2);
        sh.vx *= 0.92;
        sh.vy *= 0.92;
      }
      for (let i = shards.length - 1; i >= 0; i--) if (shards[i].age >= shards[i].life) shards.splice(i, 1);
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      const dying = new Set(sites.filter((s) => s.dying).map((s) => s.id));

      // 悬停的泡泡：极淡的填充
      const hovered = hoverId >= 0 && !dying.has(hoverId) ? cells.get(hoverId) : undefined;
      if (hovered && hovered.xs.length >= 3) {
        ctx.fillStyle = 'rgba(245, 243, 238, 0.07)';
        ctx.beginPath();
        hovered.xs.forEach((x, i) => (i ? ctx.lineTo(x, hovered.ys[i]) : ctx.moveTo(x, hovered.ys[i])));
        ctx.closePath();
        ctx.fill();
      }

      ctx.globalAlpha = fade;
      ctx.strokeStyle = WALL;
      ctx.fillStyle = WALL;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 泡壁：每个活着的泡泡画自己的边；与正在破的泡泡之间的壁不画，露出破口
      const joints: number[] = [];
      for (const s of sites) {
        if (s.dying) continue;
        const cell = cells.get(s.id);
        if (!cell || cell.xs.length < 3) continue;
        const { xs, ys, labels } = cell;
        const n = xs.length;
        for (let k = 0; k < n; k++) {
          const label = labels[k];
          if (dying.has(label)) continue;
          const j = (k + 1) % n;
          ctx.lineWidth = label === CONTAINER ? 1.7 : 1.15;
          ctx.beginPath();
          ctx.moveTo(xs[k], ys[k]);
          ctx.lineTo(xs[j], ys[j]);
          ctx.stroke();
          // 三壁交汇处（Plateau 边界）加粗一点
          const prev = labels[(k - 1 + n) % n];
          if (label !== CONTAINER && prev !== label && !dying.has(prev)) joints.push(xs[k], ys[k]);
        }
      }
      for (let i = 0; i < joints.length; i += 2) {
        ctx.beginPath();
        ctx.arc(joints[i], joints[i + 1], 1.35, 0, TWO_PI);
        ctx.fill();
      }

      // 飞散的泡壁碎片
      ctx.lineWidth = 1;
      for (const sh of shards) {
        ctx.globalAlpha = fade * (1 - sh.age / sh.life);
        ctx.beginPath();
        ctx.moveTo(sh.x1, sh.y1);
        ctx.lineTo(sh.x2, sh.y2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const siteAt = (x: number, y: number) => {
      if (Math.hypot(x - cx0, y - cy0) > R) return null;
      for (const s of sites) {
        if (s.dying) continue;
        const cell = cells.get(s.id);
        if (cell && cell.xs.length >= 3 && contains(cell, x, y)) return s;
      }
      return null;
    };

    let raf = 0;
    let last = 0;
    let inView = true;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      step(dt);
      draw();
    };
    const start = () => {
      if (raf || !inView || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onDown = (e: PointerEvent) => {
      const { x, y } = toLocal(e);
      const hit = siteAt(x, y);
      if (hit) pop(hit);
    };
    const onMove = (e: PointerEvent) => {
      const { x, y } = toLocal(e);
      const hit = siteAt(x, y);
      hoverId = hit ? hit.id : -1;
      canvas.style.cursor = hit ? 'pointer' : 'default';
    };
    const onLeave = () => {
      hoverId = -1;
    };

    // ResizeObserver 在页面不可见时不回调，先同步排版并画出第一帧
    if (layout()) draw();
    const resizeObserver = new ResizeObserver(() => {
      if (layout()) draw();
    });
    resizeObserver.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="A cluster of soap foam on a black background — click a bubble to pop it"
      style={{ display: 'block', width: '100%', height: '100%', touchAction: 'manipulation' }}
    />
  );
}
