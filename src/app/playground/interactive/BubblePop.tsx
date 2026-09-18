'use client';

// 戳泡泡：黑底上的一团肥皂泡沫，只画白色的泡壁。中间的泡泡大、越往外越小，
// 外轮廓就是最外圈小泡泡自己鼓出来的圆弧。点一个泡泡，它迸成一圈小水珠；
// 里面的泡泡破了，气并进邻居，邻居撑开补上；外圈的破了，气跑掉，泡沫团缩一点。
//
// 几何用 power diagram（加权 Voronoi）：每个泡泡是站点 p、权重 w、半径 r，
// 格子 = {x : |x-p|² - w 最小} ∩ 以 p 为心、r 为半径的圆。
// 被邻居围住的泡泡，格子完全由邻居决定（多边形）；贴外面的泡泡，外侧被自己的圆截住 —— 就鼓出来了。
// 每帧：站点向格子重心靠（Lloyd，泡壁趋向 120° 相交、格子以六边形为主），
// 权重调向目标面积（泡泡大小不一且能平滑长大），再整体向中心轻拉一点保持成团。
// 泡壁按两侧压力差弯曲：小泡泡压力大，壁往大泡泡那侧弯（Young–Laplace）。

import { useEffect, useRef } from 'react';

const TWO_PI = Math.PI * 2;
const DISK_SIDES = 40;
const FREE = -1; // 外侧自由边（泡泡自己的圆弧）
const WALL = '#f5f3ee';

type Site = { id: number; x: number; y: number; w: number; target: number; base: number; phase: number; hue: number; dying: boolean };
type Cell = { xs: number[]; ys: number[]; labels: number[]; area: number; cx: number; cy: number };
type Drop = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; hue: number };

// 用半平面 a·x <= b 裁剪多边形；沿裁剪线的新边标记为 label
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

// 泡泡的圆盘半径：比等面积圆稍大，被邻居围住时不起作用，贴外面时截出外侧圆弧
const diskRadius = (target: number) => Math.sqrt(Math.max(0, target) / Math.PI) * 1.25;

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

    let sites: Site[] = [];
    let cells = new Map<number, Cell>();
    const drops: Drop[] = [];
    let nextId = 0;
    let time = 0;
    let fade = 1;
    let regrowClock = -1;
    let hoverId = -1;

    const computeCells = () => {
      const next = new Map<number, Cell>();
      for (const s of sites) {
        const r = diskRadius(s.target);
        if (r < 0.5) continue;
        let poly: Cell = { xs: [], ys: [], labels: [], area: 0, cx: 0, cy: 0 };
        for (let k = 0; k < DISK_SIDES; k++) {
          const a = (k / DISK_SIDES) * TWO_PI;
          poly.xs.push(s.x + Math.cos(a) * r);
          poly.ys.push(s.y + Math.sin(a) * r);
          poly.labels.push(FREE);
        }
        // 近的先裁（多边形很快变小）；离得比两圆半径之和还远的不可能相邻，跳过
        const others = sites
          .filter((o) => o !== s)
          .map((o) => ({ o, d: (o.x - s.x) ** 2 + (o.y - s.y) ** 2 }))
          .sort((a, b) => a.d - b.d);
        for (const { o, d } of others) {
          const reach = r + diskRadius(o.target);
          if (d > reach * reach) continue;
          // |x-s|² - ws <= |x-o|² - wo  ⇔  2(o-s)·x <= |o|² - |s|² + ws - wo
          const ax = 2 * (o.x - s.x);
          const ay = 2 * (o.y - s.y);
          const b = o.x * o.x + o.y * o.y - s.x * s.x - s.y * s.y + s.w - o.w;
          poly = clip(poly, ax, ay, b, o.id);
          if (poly.xs.length < 3) break;
        }
        if (poly.xs.length < 3) continue;
        measure(poly);
        next.set(s.id, poly);
      }
      cells = next;
    };

    // 一步松弛：算格子 → 调权重逼近目标面积 → 站点向重心靠 → 整体轻轻向中心收拢
    function relax(k: number) {
      computeCells();
      for (const s of sites) {
        const cell = cells.get(s.id);
        const area = cell ? cell.area : 0;
        s.w += Math.min(0.9, 0.3 * k) * (s.target - area);
        if (cell) {
          const rate = Math.min(1, 0.1 * k);
          s.x += (cell.cx - s.x) * rate;
          s.y += (cell.cy - s.y) * rate;
        }
        const pull = Math.min(1, 0.01 * k);
        s.x += (cx0 - s.x) * pull;
        s.y += (cy0 - s.y) * pull;
      }
      const mean = sites.reduce((sum, s) => sum + s.w, 0) / Math.max(1, sites.length);
      // 权重限幅：离群的泡泡面积永远到不了目标，不限的话权重会一直漂，回来时就被挤没了
      const limit = (Math.PI * R * R) / Math.max(1, sites.length);
      for (const s of sites) s.w = Math.max(-limit, Math.min(limit, s.w - mean));
    }

    const seed = () => {
      sites = [];
      const count = Math.max(30, Math.round((Math.PI * R * R) / 1300));
      for (let i = 0; i < count; i++) {
        // 外圈放得更密（泡泡更小）
        const a = Math.random() * TWO_PI;
        const u = Math.pow(Math.random(), 0.42);
        const d = u * R;
        // 越靠外越小：中心约为外缘的 6 倍面积
        const base = Math.exp(gaussian() * 0.3) * (1 - 0.84 * Math.pow(u, 1.6));
        sites.push({ id: nextId++, x: cx0 + Math.cos(a) * d, y: cy0 + Math.sin(a) * d, w: 0, target: 0, base, phase: Math.random() * TWO_PI, hue: Math.random() * 360, dying: false });
      }
      const total = sites.reduce((sum, s) => sum + s.base, 0);
      for (const s of sites) {
        s.base = (s.base / total) * Math.PI * R * R;
        s.target = s.base;
      }
      for (let i = 0; i < 140; i++) relax(1);
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
        R = Math.min(width, height) * 0.36;
        seed();
      }
      return true;
    };

    const pop = (site: Site) => {
      const cell = cells.get(site.id);
      site.dying = true;
      if (!cell) return;

      // 被围住的泡泡：气并进邻居；贴外面的：气跑掉，泡沫团缩一点
      const touchesOutside = cell.labels.includes(FREE);
      if (!touchesOutside) {
        const neighbours = new Set(cell.labels);
        const heirs = sites.filter((s) => neighbours.has(s.id) && !s.dying);
        for (const h of heirs) h.base += site.base / Math.max(1, heirs.length);
      }
      site.base = 0;

      // 迸成一圈小水珠：沿泡壁撒点，向外飞、稍微下坠、渐隐
      const { xs, ys } = cell;
      let perimeter = 0;
      for (let k = 0; k < xs.length; k++) perimeter += Math.hypot(xs[(k + 1) % xs.length] - xs[k], ys[(k + 1) % ys.length] - ys[k]);
      const count = Math.round(10 + perimeter / 5);
      const r = Math.sqrt(cell.area / Math.PI);
      for (let i = 0; i < count; i++) {
        const a = Math.random() * TWO_PI;
        const at = r * (0.7 + Math.random() * 0.35);
        const speed = (35 + Math.random() * 95) * (0.6 + r / 40);
        drops.push({
          x: cell.cx + Math.cos(a) * at,
          y: cell.cy + Math.sin(a) * at,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          age: 0,
          life: 0.45 + Math.random() * 0.45,
          size: 0.7 + Math.random() * 1.5,
          hue: Math.random() * 360,
        });
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

      for (const s of sites) {
        if (s.dying) s.target = Math.max(0, s.target - s.target * Math.min(1, dt * 8) - dt * 30);
        else s.target += (s.base * (1 + 0.06 * Math.sin(time * 0.8 + s.phase)) - s.target) * Math.min(1, dt * 3);
      }

      relax(k);
      sites = sites.filter((s) => !s.dying || (cells.get(s.id)?.area ?? 0) > 3);

      for (const d of drops) {
        d.age += dt;
        d.vx *= 0.9;
        d.vy = d.vy * 0.9 + 70 * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
      }
      for (let i = drops.length - 1; i >= 0; i--) if (drops[i].age >= drops[i].life) drops.splice(i, 1);
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      const dying = new Set(sites.filter((s) => s.dying).map((s) => s.id));
      const radius = new Map<number, number>();
      for (const [id, cell] of cells) radius.set(id, Math.sqrt(cell.area / Math.PI));
      // 两个相邻泡泡各画一次共享的壁：位置一致时叠在一起看不出来。
      // 只有一侧认的壁（外圈两个泡泡没挤实）其实是对着空气的外表面，按外壁画、向外鼓
      const shares = (a: number, b: number) => cells.get(b)?.labels.includes(a) ?? false;

      const hovered = hoverId >= 0 && !dying.has(hoverId) ? cells.get(hoverId) : undefined;
      if (hovered) {
        ctx.fillStyle = 'rgba(245, 243, 238, 0.08)';
        ctx.beginPath();
        hovered.xs.forEach((x, i) => (i ? ctx.lineTo(x, hovered.ys[i]) : ctx.moveTo(x, hovered.ys[i])));
        ctx.closePath();
        ctx.fill();
      }

      ctx.globalAlpha = fade;

      // 光泽：每个泡泡内侧一层很淡的彩虹薄膜（越靠边越明显），左上方一道弧形高光和一个亮点
      ctx.globalCompositeOperation = 'lighter';
      for (const s of sites) {
        if (s.dying) continue;
        const cell = cells.get(s.id);
        if (!cell) continue;
        const r = radius.get(s.id) ?? 1;
        const hue = (s.hue + time * 18) % 360;
        const film = ctx.createRadialGradient(cell.cx, cell.cy, r * 0.35, cell.cx, cell.cy, r * 1.05);
        film.addColorStop(0, 'rgba(255, 255, 255, 0)');
        film.addColorStop(0.7, `hsla(${hue}, 85%, 70%, 0.05)`);
        film.addColorStop(1, `hsla(${(hue + 90) % 360}, 90%, 72%, 0.16)`);
        ctx.fillStyle = film;
        ctx.beginPath();
        cell.xs.forEach((x, i) => (i ? ctx.lineTo(x, cell.ys[i]) : ctx.moveTo(x, cell.ys[i])));
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = Math.max(0.8, r * 0.07);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(cell.cx, cell.cy, r * 0.6, Math.PI * 1.08, Math.PI * 1.38);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.beginPath();
        ctx.arc(cell.cx + Math.cos(Math.PI * 1.47) * r * 0.6, cell.cy + Math.sin(Math.PI * 1.47) * r * 0.6, Math.max(0.7, r * 0.045), 0, TWO_PI);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      ctx.strokeStyle = WALL;
      ctx.fillStyle = WALL;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const joints: number[] = [];
      for (const s of sites) {
        if (s.dying) continue;
        const cell = cells.get(s.id);
        if (!cell) continue;
        const { xs, ys, labels } = cell;
        const n = xs.length;
        const ri = radius.get(s.id) ?? 1;

        // 泡壁：主体是白的，带一点随时间流转的彩虹色调
        const tint = `hsl(${(s.hue + time * 18 + 40) % 360}, 45%, 88%)`;
        ctx.strokeStyle = tint;

        // 外侧自由边：连续的圆弧一笔画出
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        for (let k = 0; k < n; k++) {
          if (labels[k] !== FREE) continue;
          const j = (k + 1) % n;
          ctx.moveTo(xs[k], ys[k]);
          ctx.lineTo(xs[j], ys[j]);
        }
        ctx.stroke();

        // 与邻居之间的壁，按压力差弯曲
        ctx.lineWidth = 1.1;
        for (let k = 0; k < n; k++) {
          const label = labels[k];
          if (label === FREE || dying.has(label)) continue;
          const j = (k + 1) % n;
          const x1 = xs[k];
          const y1 = ys[k];
          const x2 = xs[j];
          const y2 = ys[j];
          const len = Math.hypot(x2 - x1, y2 - y1);
          if (len < 0.5) continue;
          let sag: number;
          if (shares(s.id, label)) {
            // 真正的隔壁：弧高 = L²/8 · (1/ri - 1/rj)，小泡泡（压力大）一侧鼓向大泡泡
            const rj = radius.get(label) ?? ri;
            sag = ((len * len) / 8) * (1 / ri - 1 / rj);
            sag = Math.max(-len * 0.15, Math.min(len * 0.15, sag));
          } else {
            // 对着空气：像外壁一样以自身半径向外鼓
            sag = Math.min(len * 0.3, (len * len) / (8 * ri));
          }
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;
          // 法线指向本泡泡外侧
          let nx = -(y2 - y1) / len;
          let ny = (x2 - x1) / len;
          if (nx * (mx - cell.cx) + ny * (my - cell.cy) < 0) {
            nx = -nx;
            ny = -ny;
          }
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo(mx + nx * sag * 2, my + ny * sag * 2, x2, y2);
          ctx.stroke();
        }

        // 壁的交汇处稍微加粗
        for (let k = 0; k < n; k++) {
          const cur = labels[k];
          const prev = labels[(k - 1 + n) % n];
          if (cur !== prev && !dying.has(cur) && !dying.has(prev)) joints.push(xs[k], ys[k]);
        }
      }
      for (let i = 0; i < joints.length; i += 2) {
        ctx.beginPath();
        ctx.arc(joints[i], joints[i + 1], 1.2, 0, TWO_PI);
        ctx.fill();
      }

      // 小水珠：带一点彩虹光泽的亮点
      ctx.globalCompositeOperation = 'lighter';
      for (const d of drops) {
        const alpha = 1 - d.age / d.life;
        ctx.fillStyle = `hsla(${d.hue}, 70%, 85%, ${(alpha * fade).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * (0.55 + alpha * 0.45), 0, TWO_PI);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    };

    const siteAt = (x: number, y: number) => {
      for (const s of sites) {
        if (s.dying) continue;
        const cell = cells.get(s.id);
        if (cell && contains(cell, x, y)) return s;
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
