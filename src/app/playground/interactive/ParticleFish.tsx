'use client';

// 粒子锦鲤：俯视角，由几千个粒子铺成，跟着鼠标游。
//
// 运动：一条 JOINTS 节的脊柱，头朝目标转向（转速有上限、接近时减速），后面的关节
// “跟随前一节”并限制每节的弯折角 —— 转弯时身体自然顺成弧线。游动的摆尾波只在绘制时
// 叠加到脊柱法线方向上，不参与物理，所以跟随始终稳定。
//
// 外形：每个粒子在建鱼时就定好它在鱼身上的参数坐标（沿体轴 s、横向 v、所属部位），
// 每帧只需按脊柱插值出位置，因此几千个粒子也很轻。

import { useEffect, useRef } from 'react';

const JOINTS = 28;
const BODY_END = 0.64; // 脊柱前 64% 是身体，后面是飘逸的长尾鳍
const BODY_BEND = 0.2; // 身体每节最大弯折（弧度）
const TAIL_BEND = 0.34; // 尾部更软
const TWO_PI = Math.PI * 2;

// 颜色：沿用站点的墨 / 橙，加一档深橙和米色
const PALETTE: [number, number, number][] = [
  [237, 91, 43], // 0 橙 --mei-orange
  [196, 62, 30], // 1 深橙
  [10, 10, 10], // 2 墨 --mei-ink
  [176, 164, 146], // 3 米（在浅底上要压暗一些才看得见）
  [120, 110, 98], // 4 灰褐：鳍、触须
];
const ALPHA_STEPS = 8;

const enum Part {
  Body = 0,
  Tail = 1,
  Fin = 2,
  Dorsal = 3,
  Eye = 4,
  Barbel = 5,
}

type Particles = {
  count: number;
  part: Uint8Array;
  s: Float32Array; // 沿脊柱 0 头 → 1 尾尖
  v: Float32Array; // 横向 -1..1（鳍：沿鳍条 0..1）
  w: Float32Array; // 鳍：鳍条序号 / 胸鳍腹鳍的侧别等附加参数
  side: Int8Array;
  color: Uint8Array;
  alpha: Float32Array; // 基础浓度 0..1
  size: Float32Array;
};

function frac(x: number) {
  return x - Math.floor(x);
}

// 身体半宽轮廓（占整条鱼长度的比例）：修长的流线型 —— 吻部收尖、最宽处在前四分之一、
// 之后一路平滑收到细细的尾柄
const BODY_HALF_WIDTH = 0.072;
function bodyWidth(u: number) {
  if (u < 0.24) return BODY_HALF_WIDTH * Math.pow(Math.max(0, u) / 0.24, 0.62);
  return BODY_HALF_WIDTH * (1 - 0.84 * Math.pow((u - 0.24) / 0.76, 1.25));
}

function buildParticles(): Particles {
  const list: { part: Part; s: number; v: number; w: number; side: number; color: number; alpha: number; size: number }[] = [];
  const push = (p: (typeof list)[number]) => list.push(p);

  // 锦鲤斑纹：几层正弦叠加的平滑噪声，每条鱼随机相位
  const ph = Array.from({ length: 5 }, () => Math.random() * TWO_PI);
  const pattern = (u: number, v: number) =>
    Math.sin(u * 8.5 + ph[0]) * Math.cos(v * 2.6 + ph[1]) + 0.55 * Math.sin(u * 17 + v * 4.2 + ph[2]) + 0.35 * Math.sin(u * 3.1 + ph[3]);

  // 身体：低差异序列均匀铺满，边缘再加一圈轮廓
  const BODY = 2100;
  for (let i = 0; i < BODY; i++) {
    const u = frac(i * 0.618033988749895);
    const v = frac(i * 0.754877666246693) * 2 - 1;
    const width = bodyWidth(u);
    if (width <= 0.001) continue;

    // 鳞片：沿体轴成排、隔排错开的小弧，粒子落在弧线上就更实
    const along = u * BODY_END;
    const across = v * width;
    const cell = 0.02;
    const row = Math.floor(along / cell);
    const fa = frac(along / cell);
    const fb = frac(across / cell + (row % 2) * 0.5);
    const r = Math.hypot(fa * 1.1, (fb - 0.5) * 1.25);
    const scaleLine = u > 0.12 ? Math.exp(-(((r - 0.55) / 0.12) ** 2)) : 0;

    const n = pattern(u, v);
    let color = 3;
    if (u < 0.1 && Math.abs(v) < 0.8) color = n > -0.2 ? 0 : 3; // 头顶多半有一块红
    else if (n > 0.15) color = n > 0.95 ? 1 : 0;
    else if (n < -1) color = 2;

    const dome = Math.sqrt(1 - v * v); // 背脊中线最实，两侧渐淡，读出体积
    push({
      part: Part.Body,
      s: along,
      v,
      w: 0,
      side: 0,
      color,
      alpha: (color === 3 ? 0.55 : 0.7) * (0.45 + 0.55 * dome) * (0.75 + 0.45 * scaleLine),
      size: 0.85 + 0.5 * dome,
    });
  }
  // 轮廓线
  for (let i = 0; i < 360; i++) {
    const u = (i / 180) % 1;
    const v = i < 180 ? 1 : -1;
    if (bodyWidth(u) <= 0.002) continue;
    push({ part: Part.Body, s: u * BODY_END, v: v * 0.98, w: 0, side: 0, color: 4, alpha: 0.5, size: 1 });
  }

  // 尾鳍：从尾柄散开的扇形，沿鳍条铺点，尾尖半透明并带分叉
  const RAYS = 13;
  for (let ray = 0; ray < RAYS; ray++) {
    const v = (ray / (RAYS - 1)) * 2 - 1;
    for (let k = 0; k < 56; k++) {
      const t = (k + Math.random() * 0.8) / 56;
      if (t > 0.72 && Math.abs(v) < (t - 0.72) * 2.6) continue; // 分叉缺口
      push({
        part: Part.Tail,
        s: BODY_END - 0.02 + t * (1 - BODY_END + 0.02),
        v: v + (Math.random() - 0.5) * 0.08,
        w: t,
        side: 0,
        color: t < 0.25 ? 0 : 4,
        alpha: 0.65 * (1 - t * 0.8),
        size: 1 - t * 0.35,
      });
    }
  }

  // 胸鳍（前）和腹鳍（后），左右各一；w 记长度比例，v 记沿鳍条位置
  for (const [anchor, length, rays] of [
    [0.2, 1, 7],
    [0.5, 0.55, 5],
  ] as const) {
    for (const side of [-1, 1]) {
      for (let ray = 0; ray < rays; ray++) {
        for (let k = 1; k <= 14; k++) {
          const t = k / 14;
          push({
            part: Part.Fin,
            s: anchor * BODY_END,
            v: t,
            w: length * 10 + ray / rays, // 整数部分长度、小数部分鳍条序号
            side,
            color: 4,
            alpha: 0.55 * (1 - t * 0.6),
            size: 1,
          });
        }
      }
    }
  }

  // 背鳍：沿中线的一道深色脊
  for (let i = 0; i < 90; i++) {
    const u = 0.3 + (i / 90) * 0.34;
    push({ part: Part.Dorsal, s: u * BODY_END, v: 0, w: i / 90, side: 0, color: 2, alpha: 0.55, size: 1.2 });
  }

  // 眼睛
  for (const side of [-1, 1]) {
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * TWO_PI;
      const rr = i < 6 ? 0.05 : 0.11;
      push({ part: Part.Eye, s: 0.06 * BODY_END, v: side * 0.62, w: a, side, color: 2, alpha: 0.95, size: 1.6 - rr * 4 });
    }
  }

  // 触须
  for (const side of [-1, 1]) {
    for (let i = 0; i < 12; i++) {
      push({ part: Part.Barbel, s: 0, v: i / 12, w: 0, side, color: 4, alpha: 0.6 * (1 - i / 16), size: 1 });
    }
  }

  const count = list.length;
  const p: Particles = {
    count,
    part: new Uint8Array(count),
    s: new Float32Array(count),
    v: new Float32Array(count),
    w: new Float32Array(count),
    side: new Int8Array(count),
    color: new Uint8Array(count),
    alpha: new Float32Array(count),
    size: new Float32Array(count),
  };
  list.forEach((q, i) => {
    p.part[i] = q.part;
    p.s[i] = q.s;
    p.v[i] = q.v;
    p.w[i] = q.w;
    p.side[i] = q.side;
    p.color[i] = q.color;
    p.alpha[i] = Math.min(1, q.alpha);
    p.size[i] = q.size;
  });
  return p;
}

type Wake = { x: number; y: number; vx: number; vy: number; age: number; life: number };

export default function ParticleFish() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particles = buildParticles();

    const fillStyles = PALETTE.map(([r, g, b]) =>
      Array.from({ length: ALPHA_STEPS }, (_, k) => `rgba(${r}, ${g}, ${b}, ${((k + 1) / ALPHA_STEPS).toFixed(3)})`)
    );

    let width = 0;
    let height = 0;
    let dpr = 1;
    let L = 200; // 整条鱼（含尾鳍）的长度，px
    let seg = L / (JOINTS - 1);

    // 脊柱关节（物理位置）与绘制用的位置 / 角度
    const jx = new Float32Array(JOINTS);
    const jy = new Float32Array(JOINTS);
    const dx = new Float32Array(JOINTS);
    const dy = new Float32Array(JOINTS);
    const da = new Float32Array(JOINTS);

    let heading = Math.random() * TWO_PI;
    let speed = 0;
    let swimPhase = 0;
    let finPhase = 0;
    let wanderT = Math.random() * 100;
    let pointer: { x: number; y: number } | null = null;
    const wakes: Wake[] = [];
    let wakeClock = 0;

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const changed = Math.abs(rect.width - width) > 0.5 || Math.abs(rect.height - height) > 0.5;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      if (changed) {
        L = Math.min(width, height) * 0.6;
        seg = L / (JOINTS - 1);
        // 鱼从画面中央、沿当前朝向摆直
        for (let i = 0; i < JOINTS; i++) {
          jx[i] = width / 2 - Math.cos(heading) * (i * seg - L * 0.35);
          jy[i] = height / 2 - Math.sin(heading) * (i * seg - L * 0.35);
        }
      }
      return true;
    };

    // 没有指针时，目标沿一条缓慢的李萨如曲线在画面里游荡
    const wanderTarget = () => ({
      x: width / 2 + Math.sin(wanderT * 0.37) * width * 0.3,
      y: height / 2 + Math.sin(wanderT * 0.53 + 1.3) * height * 0.28,
    });

    const simulate = (dt: number) => {
      wanderT += dt;
      const raw = pointer ?? wanderTarget();
      // 目标收进画面内一圈，鱼不会为了够到角落把半个身子游出去
      const margin = L * 0.3;
      const target = {
        x: Math.max(margin, Math.min(width - margin, raw.x)),
        y: Math.max(margin, Math.min(height - margin, raw.y)),
      };
      const tx = target.x - jx[0];
      const ty = target.y - jy[0];
      const dist = Math.hypot(tx, ty);

      // 离目标很近时不再追角度（否则目标在嘴边会让鱼原地打转抖动），只顺势滑行
      const maxTurn = (3.6 + (1 - Math.min(1, speed / L)) * 1.4) * dt;
      // 预判：照当前朝向再游一小段会不会出画面，会的话先转向画面中心
      const aheadX = jx[0] + Math.cos(heading) * L * 0.45;
      const aheadY = jy[0] + Math.sin(heading) * L * 0.45;
      const edge = L * 0.12;
      const leaving = aheadX < edge || aheadX > width - edge || aheadY < edge || aheadY > height - edge;
      if (leaving) {
        const want = Math.atan2(height / 2 - jy[0], width / 2 - jx[0]);
        const diff = Math.atan2(Math.sin(want - heading), Math.cos(want - heading));
        heading += Math.max(-maxTurn * 1.4, Math.min(maxTurn * 1.4, diff));
      } else if (dist > L * 0.14) {
        const want = Math.atan2(ty, tx);
        let diff = Math.atan2(Math.sin(want - heading), Math.cos(want - heading));
        diff = Math.max(-maxTurn, Math.min(maxTurn, diff));
        heading += diff;
      } else {
        heading += Math.sin(wanderT * 0.9) * 0.6 * dt; // 在嘴边悠着转
      }

      // 到达行为：远处加速，靠近时减速，但保留一点游速让身体始终在摆
      const maxSpeed = L * (pointer ? 1.5 : 0.8);
      const cruise = L * 0.16;
      const wantSpeed = Math.max(cruise, Math.min(maxSpeed, (dist - L * 0.1) * 2.2));
      speed += (wantSpeed - speed) * Math.min(1, dt * 2.6);

      jx[0] += Math.cos(heading) * speed * dt;
      jy[0] += Math.sin(heading) * speed * dt;

      // 跟随：每节保持节长，并把与前一节的夹角限制在 bend 内
      let prevAngle = heading;
      for (let i = 1; i < JOINTS; i++) {
        let ang = Math.atan2(jy[i - 1] - jy[i], jx[i - 1] - jx[i]);
        const bend = i / (JOINTS - 1) < BODY_END ? BODY_BEND : TAIL_BEND;
        const d = Math.atan2(Math.sin(ang - prevAngle), Math.cos(ang - prevAngle));
        if (d > bend) ang = prevAngle + bend;
        else if (d < -bend) ang = prevAngle - bend;
        jx[i] = jx[i - 1] - Math.cos(ang) * seg;
        jy[i] = jy[i - 1] - Math.sin(ang) * seg;
        prevAngle = ang;
      }

      // 摆尾节奏跟着速度走；胸鳍在慢游时划得更勤
      const speedNorm = Math.min(1, speed / (L * 1.6));
      swimPhase += dt * (3 + speedNorm * 7) * (reduceMotion ? 0.3 : 1);
      finPhase += dt * (5.5 - speedNorm * 3) * (reduceMotion ? 0.3 : 1);

      // 绘制用脊柱：沿法线叠加一列从头传到尾的波，振幅越往后越大
      for (let i = 0; i < JOINTS; i++) {
        const s = i / (JOINTS - 1);
        const amp = L * (0.012 + 0.07 * Math.pow(s, 1.6)) * (0.45 + 0.8 * speedNorm);
        const off = Math.sin(swimPhase - s * TWO_PI * 0.85) * amp;
        const a0 = i === 0 ? heading : Math.atan2(jy[i - 1] - jy[i], jx[i - 1] - jx[i]);
        dx[i] = jx[i] - Math.sin(a0) * off;
        dy[i] = jy[i] + Math.cos(a0) * off;
      }
      for (let i = 0; i < JOINTS; i++) {
        const a = i === 0 ? 0 : i - 1;
        const b = i === 0 ? 1 : i;
        da[i] = Math.atan2(dy[a] - dy[b], dx[a] - dx[b]);
      }

      // 尾迹：游得越快，从尾尖散出的淡粒子越多
      wakeClock -= dt * (0.4 + speedNorm * 3);
      if (wakeClock <= 0 && !reduceMotion) {
        wakeClock = 0.12;
        const tail = JOINTS - 1;
        for (let k = 0; k < 2; k++) {
          wakes.push({
            x: dx[tail] + (Math.random() - 0.5) * L * 0.08,
            y: dy[tail] + (Math.random() - 0.5) * L * 0.08,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            age: 0,
            life: 1.2 + Math.random() * 0.8,
          });
        }
        if (wakes.length > 90) wakes.splice(0, wakes.length - 90);
      }
      for (const w of wakes) {
        w.age += dt;
        w.x += w.vx * dt;
        w.y += w.vy * dt;
      }
      for (let i = wakes.length - 1; i >= 0; i--) if (wakes[i].age >= wakes[i].life) wakes.splice(i, 1);
    };

    // 沿脊柱插值：返回 s 处的位置和朝向
    const sample = (s: number) => {
      const f = Math.min(JOINTS - 1.0001, Math.max(0, s * (JOINTS - 1)));
      const i = Math.floor(f);
      const t = f - i;
      const x = dx[i] + (dx[i + 1] - dx[i]) * t;
      const y = dy[i] + (dy[i + 1] - dy[i]) * t;
      const a0 = da[i];
      const a1 = da[i + 1];
      const a = a0 + Math.atan2(Math.sin(a1 - a0), Math.cos(a1 - a0)) * t;
      return { x, y, a };
    };

    const buckets: number[][] = Array.from({ length: PALETTE.length * ALPHA_STEPS }, () => []);

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      for (const b of buckets) b.length = 0;

      const p = particles;
      const halfW = L * 0.5;
      for (let i = 0; i < p.count; i++) {
        let x: number;
        let y: number;
        const part = p.part[i];
        const s = p.s[i];

        if (part === Part.Body || part === Part.Dorsal) {
          const { x: sx, y: sy, a } = sample(s);
          const u = s / BODY_END;
          let off = p.v[i] * bodyWidth(u) * L;
          if (part === Part.Dorsal) off = Math.sin(finPhase * 0.7 + p.w[i] * 5) * L * 0.012;
          x = sx - Math.sin(a) * off;
          y = sy + Math.cos(a) * off;
        } else if (part === Part.Tail) {
          const { x: sx, y: sy, a } = sample(s);
          const t = p.w[i];
          // 尾鳍宽度从尾柄往外散开，边缘再加一层飘动
          const spread = L * (0.012 + 0.13 * Math.pow(t, 0.9));
          const flutter = Math.sin(swimPhase * 1.3 - t * 7 + p.v[i] * 2) * t * L * 0.03;
          const off = p.v[i] * spread + flutter;
          x = sx - Math.sin(a) * off;
          y = sy + Math.cos(a) * off;
        } else if (part === Part.Fin) {
          const { x: sx, y: sy, a } = sample(s);
          const u = s / BODY_END;
          const side = p.side[i];
          const len = Math.floor(p.w[i]) / 10;
          const ray = p.w[i] - Math.floor(p.w[i]);
          const t = p.v[i];
          const edge = bodyWidth(u) * L * 0.85;
          // 鳍向后外侧张开，拍动时张角来回摆
          const flap = Math.sin(finPhase + (len < 0.8 ? 1.7 : 0)) * 0.35;
          const spreadAngle = (1.05 + flap + (ray - 0.5) * 0.7) * side;
          const dir = a + Math.PI - spreadAngle; // 从“向后”往外侧偏
          const reach = t * L * 0.15 * len;
          const bx = sx - Math.sin(a) * edge * side;
          const by = sy + Math.cos(a) * edge * side;
          x = bx + Math.cos(dir) * reach;
          y = by + Math.sin(dir) * reach;
        } else if (part === Part.Eye) {
          const { x: sx, y: sy, a } = sample(s);
          const off = p.v[i] * bodyWidth(s / BODY_END) * L;
          const rr = p.size[i] > 1.3 ? L * 0.004 : L * 0.009;
          x = sx - Math.sin(a) * off + Math.cos(p.w[i]) * rr;
          y = sy + Math.cos(a) * off + Math.sin(p.w[i]) * rr;
        } else {
          // 触须：从嘴角向前外侧伸出一小段弧，随摆动轻轻晃
          const { x: sx, y: sy, a } = sample(0);
          const t = p.v[i];
          const side = p.side[i];
          const curl = (0.9 + Math.sin(finPhase * 0.8 + side) * 0.25) * side;
          const dir = a + curl * t * 1.4;
          const reach = t * L * 0.07;
          const bx = sx - Math.sin(a) * L * 0.012 * side;
          const by = sy + Math.cos(a) * L * 0.012 * side;
          x = bx + Math.cos(dir) * reach;
          y = by + Math.sin(dir) * reach;
        }

        if (x < -halfW || x > width + halfW || y < -halfW || y > height + halfW) continue;
        const k = Math.min(ALPHA_STEPS - 1, Math.floor(p.alpha[i] * ALPHA_STEPS));
        const b = buckets[p.color[i] * ALPHA_STEPS + k];
        b.push(x, y, p.size[i]);
      }

      for (let c = 0; c < PALETTE.length; c++) {
        for (let k = 0; k < ALPHA_STEPS; k++) {
          const b = buckets[c * ALPHA_STEPS + k];
          if (!b.length) continue;
          ctx.fillStyle = fillStyles[c][k];
          ctx.beginPath();
          for (let n = 0; n < b.length; n += 3) {
            const size = b[n + 2];
            ctx.rect(b[n] - size / 2, b[n + 1] - size / 2, size, size);
          }
          ctx.fill();
        }
      }

      // 尾迹
      ctx.fillStyle = 'rgba(120, 110, 98, 1)';
      for (const w of wakes) {
        const life = 1 - w.age / w.life;
        ctx.globalAlpha = life * 0.35;
        ctx.fillRect(w.x - 0.6, w.y - 0.6, 1.2, 1.2);
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let last = 0;
    let inView = true;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      simulate(dt);
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
    const onMove = (e: PointerEvent) => {
      pointer = toLocal(e);
    };
    const onLeave = () => {
      pointer = null;
    };

    // ResizeObserver 在页面不可见时不回调，先同步排版一次并画出第一帧
    if (layout()) {
      simulate(0.016);
      draw();
    }
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

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerdown', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointercancel', onLeave);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointercancel', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="A koi made of particles — move your pointer over it and it follows you"
      style={{ display: 'block', width: '100%', height: '100%', touchAction: 'pan-y' }}
    />
  );
}
