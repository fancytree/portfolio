'use client';

// 戳泡泡：黑底上缓缓上浮的肥皂泡，点一下就破，碎成一圈小水珠。
// 泡泡的质感靠几层叠加：几乎透明的泡体、随角度和时间流转色相的彩虹薄膜边、
// 左上角的高光和另一侧的淡反光；整体用 lighter 混合，在黑底上发光。

import { useEffect, useRef } from 'react';

const TWO_PI = Math.PI * 2;
const RIM_SEGMENTS = 36;

type Bubble = {
  x: number;
  y: number;
  r: number;
  vy: number;
  swayPhase: number;
  swaySpeed: number;
  wobblePhase: number;
  hue: number; // 薄膜色相起点，每个泡泡不同
};

type Droplet = { x: number; y: number; vx: number; vy: number; age: number; life: number; hue: number; size: number };
type Ring = { x: number; y: number; r: number; age: number; hue: number };

export default function BubblePop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motion = reduceMotion ? 0.35 : 1;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let bubbles: Bubble[] = [];
    const droplets: Droplet[] = [];
    const rings: Ring[] = [];
    let time = 0;
    let spawnClock = 0;

    const targetCount = () => Math.max(6, Math.round((width * height) / 15000));
    const radiusRange = () => {
      const base = Math.min(width, height);
      return [base * 0.045, base * 0.13] as const;
    };

    const makeBubble = (fromBottom: boolean): Bubble => {
      const [minR, maxR] = radiusRange();
      // 小泡泡多、大泡泡少
      const r = minR + (maxR - minR) * Math.pow(Math.random(), 1.8);
      return {
        x: r + Math.random() * (width - r * 2),
        y: fromBottom ? height + r + Math.random() * 20 : r + Math.random() * (height - r * 2),
        r,
        vy: -(10 + Math.random() * 16) * (1.3 - (r - minR) / (maxR - minR) * 0.5),
        swayPhase: Math.random() * TWO_PI,
        swaySpeed: 0.5 + Math.random() * 0.7,
        wobblePhase: Math.random() * TWO_PI,
        hue: Math.random() * 360,
      };
    };

    const populate = () => {
      bubbles = Array.from({ length: targetCount() }, () => makeBubble(false));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      const first = width === 0;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      if (first) populate();
      return true;
    };

    const pop = (bubble: Bubble) => {
      bubbles.splice(bubbles.indexOf(bubble), 1);
      rings.push({ x: bubble.x, y: bubble.y, r: bubble.r, age: 0, hue: bubble.hue });
      const count = Math.round(14 + bubble.r * 0.35);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * TWO_PI + Math.random() * 0.3;
        const speed = (40 + Math.random() * 110) * (0.6 + bubble.r / 80);
        droplets.push({
          x: bubble.x + Math.cos(angle) * bubble.r * 0.9,
          y: bubble.y + Math.sin(angle) * bubble.r * 0.9,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          age: 0,
          life: 0.45 + Math.random() * 0.4,
          hue: bubble.hue + (angle / TWO_PI) * 360,
          size: 0.8 + Math.random() * 1.6,
        });
      }
    };

    const bubbleAt = (x: number, y: number) => {
      // 后画的在上面，所以从后往前找
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        if (Math.hypot(x - b.x, y - b.y) <= b.r) return b;
      }
      return null;
    };

    const step = (dt: number) => {
      time += dt * motion;
      for (const b of bubbles) {
        b.y += b.vy * dt * motion;
        b.x += Math.sin(time * b.swaySpeed + b.swayPhase) * 12 * dt * motion;
        b.x = Math.max(b.r * 0.6, Math.min(width - b.r * 0.6, b.x));
      }
      // 飘出顶部的泡泡移除，底部按需补
      bubbles = bubbles.filter((b) => b.y + b.r > -4);
      spawnClock -= dt;
      if (bubbles.length < targetCount() && spawnClock <= 0) {
        bubbles.unshift(makeBubble(true)); // 新泡泡放在最底层，从后面冒上来
        spawnClock = 0.35 + Math.random() * 0.6;
      }

      for (const d of droplets) {
        d.age += dt;
        d.vx *= 0.9;
        d.vy = d.vy * 0.9 + 60 * dt; // 一点点下坠
        d.x += d.vx * dt;
        d.y += d.vy * dt;
      }
      for (let i = droplets.length - 1; i >= 0; i--) if (droplets[i].age >= droplets[i].life) droplets.splice(i, 1);
      for (const ring of rings) ring.age += dt;
      for (let i = rings.length - 1; i >= 0; i--) if (rings[i].age >= 0.28) rings.splice(i, 1);
    };

    const drawBubble = (b: Bubble) => {
      // 轻微的形变：横竖半径此消彼长
      const w = Math.sin(time * 2.1 + b.wobblePhase) * 0.035;
      const rx = b.r * (1 + w);
      const ry = b.r * (1 - w);

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.scale(rx / b.r, ry / b.r);

      // 泡体：中心几乎透明，越靠边越有一点颜色
      const body = ctx.createRadialGradient(0, 0, b.r * 0.55, 0, 0, b.r);
      body.addColorStop(0, 'rgba(255, 255, 255, 0)');
      body.addColorStop(0.8, `hsla(${b.hue + 200}, 80%, 70%, 0.05)`);
      body.addColorStop(1, `hsla(${b.hue + 160}, 90%, 75%, 0.16)`);
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(0, 0, b.r, 0, TWO_PI);
      ctx.fill();

      // 彩虹薄膜边：沿圆周分段，色相随角度和时间流转
      ctx.lineWidth = Math.max(1, b.r * 0.045);
      for (let i = 0; i < RIM_SEGMENTS; i++) {
        const a0 = (i / RIM_SEGMENTS) * TWO_PI;
        const a1 = ((i + 1.15) / RIM_SEGMENTS) * TWO_PI;
        const hue = b.hue + Math.sin(a0 * 2 + time * 0.8 + b.wobblePhase) * 80 + (a0 / TWO_PI) * 140 + time * 25;
        // 上半圈更亮（受光面），下半圈淡一些
        const light = 0.35 + 0.35 * (1 - Math.sin(a0 + 0.6)) * 0.5;
        ctx.strokeStyle = `hsla(${hue % 360}, 95%, 68%, ${light.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(0, 0, b.r * 0.97, a0, a1);
        ctx.stroke();
      }

      // 另一侧的淡反光：右下方一道细弧
      ctx.lineWidth = Math.max(0.8, b.r * 0.03);
      ctx.strokeStyle = `hsla(${(b.hue + time * 25 + 180) % 360}, 90%, 80%, 0.28)`;
      ctx.beginPath();
      ctx.arc(0, 0, b.r * 0.78, 0.15 * Math.PI, 0.45 * Math.PI);
      ctx.stroke();

      // 左上角高光
      const hx = -b.r * 0.38;
      const hy = -b.r * 0.42;
      const glint = ctx.createRadialGradient(hx, hy, 0, hx, hy, b.r * 0.26);
      glint.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      glint.addColorStop(0.35, 'rgba(255, 255, 255, 0.25)');
      glint.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glint;
      ctx.beginPath();
      ctx.ellipse(hx, hy, b.r * 0.26, b.r * 0.17, -0.7, 0, TWO_PI);
      ctx.fill();

      ctx.restore();
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'lighter';
      for (const b of bubbles) drawBubble(b);

      // 破裂瞬间的一圈闪光，迅速扩散变淡
      for (const ring of rings) {
        const t = ring.age / 0.28;
        ctx.strokeStyle = `hsla(${ring.hue}, 90%, 80%, ${(0.5 * (1 - t)).toFixed(3)})`;
        ctx.lineWidth = 1.5 * (1 - t) + 0.3;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r * (1 + t * 0.35), 0, TWO_PI);
        ctx.stroke();
      }

      for (const d of droplets) {
        const alpha = 1 - d.age / d.life;
        ctx.fillStyle = `hsla(${d.hue % 360}, 95%, 75%, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * (0.6 + alpha * 0.4), 0, TWO_PI);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
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
      const hit = bubbleAt(x, y);
      if (hit) {
        pop(hit);
        if (!raf) draw();
      }
    };
    const onMove = (e: PointerEvent) => {
      const { x, y } = toLocal(e);
      canvas.style.cursor = bubbleAt(x, y) ? 'pointer' : 'default';
    };

    // ResizeObserver 在页面不可见时不回调，先同步排版并画出第一帧
    if (resize()) draw();
    const resizeObserver = new ResizeObserver(() => {
      if (resize()) draw();
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
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Soap bubbles drifting up on a black background — click a bubble to pop it"
      style={{ display: 'block', width: '100%', height: '100%', touchAction: 'manipulation' }}
    />
  );
}
