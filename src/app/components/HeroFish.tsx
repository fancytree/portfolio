'use client';

// Hero 背景：一条由粒子构成的鱼，在画面里缓慢巡游。
// 原型是 react-three-fiber 的 20000 粒子实例化网格（加 UnrealBloom），这里保留同一套
// 身体/尾鳍/背鳍/臀鳍/胸鳍的程序化建模和摆尾波，改用原生 Canvas 2D 重绘：
// 粒子数降到千级、用 multiply 把冷色叠在米色底上代替加法发光，因此不引入 three.js 依赖，
// 也不需要把 Hero 改成深色。
//
// 原型的鱼是原地摆尾的，"游动"是这里新加的：鱼沿一条李萨如曲线巡游，
// 朝向取自路径的前瞻切线，所以转身、侧身、由远及近都是自然带出来的。

import { useEffect, useRef } from 'react';

// 与原型一致的参数（原型里由 GUI 调出来的一组数值）
const SPEED = 0.85; // 摆尾频率（原型是 1.2，对一条慢速巡游的鱼来说打得太快）
const AMP = 0.115; // 摆尾振幅（原型 0.185，尾部甩得过软）
const TAIL_FIN_DAMP = 0.85; // 尾鳍在整体基础上再收一点摆幅
const NOISE = 0.035; // 微光扰动
const GOLDEN = 2.399963; // 黄金角，用于铺开身体截面上的点
const TWO_PI = Math.PI * 2;

// 各鳍在原型里是靠 i%100 / i%30 / i%20 / i%40 铺成网格的，那是按 count=20000 调的。
// 粒子数降到千级后每条鳍只剩几条"扫线"，看起来像几根面条。改用两个无理数做低差异
// 序列填充：任意粒子数下都是均匀的点阵，和身体用黄金角铺点是同一个思路。
const PHI = 0.618033988749895;
const PSI = 0.754877666246693;

function frac(v: number) {
  return v - Math.floor(v);
}

// 鱼的局部坐标：头在 +X(1.0)，尾在 -X(-1.15)，体长约 2.15
const FISH_LENGTH = 2.15;
const FISH_RADIUS = 0.7; // 用于把"离镜头远近"归一化

// 沿体轴的配色。原型是 0.59→0.91 的青紫生物荧光渐变，和首页的暖色系是两个世界。
// 首页的调色板其实只有 --mei-ink / --mei-paper / --mei-line 加一个强调色 --mei-orange，
// 所以这里在 ink 与 orange 之间插值：尾端是墨、头端是橙，中间自然经过一段铁锈色。
// 原型"色相沿身体推移"的特征保留下来了，色系换成首页自己的。
const INK: [number, number, number] = [10, 10, 10]; // --mei-ink  #0a0a0a
const ORANGE: [number, number, number] = [237, 91, 43]; // --mei-orange #ed5b2b

const TONE_STEPS = 14; // 沿体轴的颜色分档
const ALPHA_STEPS = 8; // 每档颜色再按浓淡分档
const NORM_X_MIN = -0.25;
const NORM_X_MAX = 1.05;

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export default function HeroFish({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const count = window.innerWidth < 640 ? 2600 : window.innerWidth < 1024 ? 4000 : 5200;

    // 缓动后的局部坐标：原型里 lerp 的是世界坐标，但那时鱼是原地不动的。
    // 加了巡游之后必须在局部空间缓动，否则整条鱼会拖在目标位置后面糊掉。
    const lx = new Float32Array(count);
    const ly = new Float32Array(count);
    const lz = new Float32Array(count);
    let settled = false;

    // 颜色只跟体轴位置有关，离屏预生成 颜色×浓淡 的填充色
    const fillStyles: string[][] = [];
    for (let ti = 0; ti < TONE_STEPS; ti++) {
      const normX = NORM_X_MIN + ((ti + 0.5) / TONE_STEPS) * (NORM_X_MAX - NORM_X_MIN);
      const t = clamp01(normX);
      const r = Math.round(INK[0] + (ORANGE[0] - INK[0]) * t);
      const g = Math.round(INK[1] + (ORANGE[1] - INK[1]) * t);
      const b = Math.round(INK[2] + (ORANGE[2] - INK[2]) * t);
      // multiply 之下墨压得比橙重得多（橙本身亮度高，叠上去很淡），同样 alpha 会让
      // 尾巴喧宾夺主。所以浓度沿体轴反向补偿：墨端收着点，橙端给足，两头分量才均衡。
      const maxAlpha = 0.5 + 0.35 * t;
      fillStyles.push(
        Array.from({ length: ALPHA_STEPS }, (_, k) => {
          const a = (maxAlpha * (k + 1)) / ALPHA_STEPS;
          return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
        })
      );
    }

    const BUCKETS = TONE_STEPS * ALPHA_STEPS;
    const bucketOf = new Int32Array(count);
    const bucketCount = new Int32Array(BUCKETS);
    const bucketStart = new Int32Array(BUCKETS);
    const cursor = new Int32Array(BUCKETS);
    const outX = new Float32Array(count);
    const outY = new Float32Array(count);
    const outS = new Float32Array(count);
    const sortX = new Float32Array(count);
    const sortY = new Float32Array(count);
    const sortS = new Float32Array(count);
    const visible = new Uint8Array(count);

    let width = 0;
    let height = 0;
    let dpr = 1;
    // 投影参数：镜头在 +Z 看向原点，focal 由 60° 垂直视角推出
    let focal = 1;
    let camZ = 1;
    let originX = 0;
    let originY = 0;
    let scaleRef = 1; // z=0 平面上的世界→像素比例
    // 巡游路径的振幅（世界单位）
    let ampX = 1;
    let ampY = 1;
    const ampZ = 1.25;

    // 相机环绕：对应原型的 OrbitControls。这层是文字底下的背景（pointer-events-none），
    // 拖拽会抢掉选中文字，所以改成跟随指针——鼠标横扫绕 Y 轴转，上下移动绕 X 轴转。
    const MAX_YAW = 0.8; // ≈ 46°
    const MAX_PITCH = 0.4; // ≈ 23°
    let targetYaw = 0;
    let targetPitch = 0;
    let camYaw = 0;
    let camPitch = 0;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width * dpr));
      height = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = width;
      canvas.height = height;

      // 先按"鱼占视口宽度约三分之一"定出比例尺，再反推镜头距离和巡游范围，
      // 这样窄屏上鱼不会缩成一个小点，宽屏上也不会撑满整个 Hero。
      const targetFishPx = Math.min(Math.max(width * 0.32, 200 * dpr), 620 * dpr);
      scaleRef = targetFishPx / FISH_LENGTH;
      focal = height / 2 / Math.tan(Math.PI / 6);
      camZ = focal / scaleRef;
      originX = width / 2;
      originY = height * 0.52;

      // 巡游范围按视口的世界尺寸推，留出半条鱼身的余量，避免游出画面
      const worldW = width / scaleRef;
      const worldH = height / scaleRef;
      // 留出的余量比半条鱼身稍多：转身时鳍会甩到轮廓之外
      ampX = Math.max(0.4, worldW * 0.5 - FISH_LENGTH * 0.72);
      ampY = Math.max(0.2, Math.min(worldH * 0.13, 0.85));
    }

    // 巡游路径：三条不同周期的正弦，合成一段不明显循环的悠闲航线
    function pathX(t: number) {
      return ampX * Math.sin(t * 0.16);
    }
    function pathY(t: number) {
      return ampY * Math.sin(t * 0.19 + 0.9);
    }
    function pathZ(t: number) {
      return ampZ * Math.sin(t * 0.11 + 2.1);
    }

    // 单帧：推进粒子并绘制。dtScale 以 60fps 为 1，用来做帧率无关的缓动。
    function frame(time: number, dtScale: number) {
      if (!canvas || !ctx) return;

      const cx = pathX(time);
      const cy = pathY(time);
      const cz = pathZ(time);

      // 朝向用 0.6 秒后的路径点做前瞻：既是天然的平滑，也让鱼"看向"它要去的方向
      let fx = pathX(time + 0.6) - cx;
      let fy = pathY(time + 0.6) - cy;
      let fz = pathZ(time + 0.6) - cz;
      // 压一下俯仰：鱼上下移动时会顺带抬头/低头，但不该像火箭一样直上直下
      fy *= 0.5;
      const fLen = Math.hypot(fx, fy, fz);
      if (fLen < 1e-5) {
        fx = 1;
        fy = 0;
        fz = 0;
      } else {
        fx /= fLen;
        fy /= fLen;
        fz /= fLen;
      }

      // right = normalize(cross(forward, worldUp))；鱼几乎垂直游动时退化，退回 +Z
      let rx = -fz;
      let rz = fx;
      const rLen = Math.hypot(rx, rz);
      if (rLen < 1e-5) {
        rx = 0;
        rz = 1;
      } else {
        rx /= rLen;
        rz /= rLen;
      }
      // up = cross(right, forward)
      const ux = -rz * fy;
      const uy = rz * fx - rx * fz;
      const uz = rx * fy;

      // 相机角度平滑跟上指针，避免鼠标一动镜头就跳
      const camEase = 1 - Math.pow(0.88, dtScale);
      camYaw += (targetYaw - camYaw) * camEase;
      camPitch += (targetPitch - camPitch) * camEase;
      const cosY = Math.cos(camYaw);
      const sinY = Math.sin(camYaw);
      const cosP = Math.cos(camPitch);
      const sinP = Math.sin(camPitch);

      // 全身共用一个相位：身体、各鳍的摆动都只由 wavePhase + x*3.5 决定，
      // 也就是一列沿体轴行进的波，整条鱼是一个整体在游，而不是各段各摆各的。
      //
      // 原型这里还有一项 -i*0.0025（按 count=20000 调的，沿索引铺开约 50 弧度）。
      // 那一项会在身体上塞进约 4.8 个波长，尾部因此像面条一样抖；去掉之后 x*3.5 正好
      // 给出一个波长，配上 bend 的振幅包络就是标准的鲹科摆游：头部刚硬、越往后摆幅越大。
      const wavePhase = time * TWO_PI * SPEED;
      const ease = 1 - Math.pow(0.9, dtScale);
      const lerp = settled ? ease : 1;

      bucketCount.fill(0);

      for (let i = 0; i < count; i++) {
        // USER CODE START —— 以下建模逐行取自原型
        const tIdx = i / count;
        let x = 0;
        let y = 0;
        let z = 0;


        if (tIdx < 0.6) {
          // 躯干：沿体轴的椭圆截面，前段饱满、尾端收细
          const u = tIdx / 0.6;
          x = -0.8 + 1.8 * u;
          const theta = i * GOLDEN;
          let profile = 0.0;
          if (u < 0.75) {
            const t = u / 0.75;
            profile = 0.15 + 0.85 * (3.0 * t * t - 2.0 * t * t * t);
          } else {
            const t = (u - 0.75) / 0.25;
            profile = 1.0 - t * t;
          }
          const rY = 0.42 * profile;
          const rZ = 0.25 * profile;
          y = rY * Math.sin(theta);
          z = rZ * Math.cos(theta);

          const bend = Math.pow(1.0 - u, 2.1);
          z += Math.sin(wavePhase + x * 3.5) * bend * AMP;
        } else if (tIdx < 0.75) {
          // 尾鳍：分叉的新月形，摆幅最大
          const u = (tIdx - 0.6) / 0.15;
          const v = frac(i * PHI) * 2.0 - 1.0;
          const yMax = 0.08 + 0.52 * u;
          y = v * yMax;
          const bite = 0.11 * Math.pow(1.0 - Math.abs(v), 2.0);
          x = -0.8 - u * (0.35 - bite);
          z = Math.sin(i * 13.7) * 0.005;

          // 原型这里是 AMP * (1.1 + u*0.9)（最高 2.0 倍 AMP）外加一个 -u*0.75 的相位，
          // 尾鳍因此比其它鳍甩得又快又狠。改成和背鳍/臀鳍同一套写法：bend * AMP，
          // 相位偏移换成 -v*0.4。bodyU 在尾鳍这段是负的，夹到 0 之后 bend 恒为 1，
          // 摆幅正好接上身体尾端（那里 bend 也趋近 1），不再突出来，最后再收 15%。
          const bodyU = (x + 0.8) / 1.8;
          const bend = Math.pow(1.0 - Math.max(0, bodyU), 2.1);
          z += Math.sin(wavePhase + x * 3.5 - v * 0.4) * bend * AMP * TAIL_FIN_DAMP;
        } else if (tIdx < 0.85) {
          // 背鳍
          const u = (tIdx - 0.75) / 0.1;
          const v = frac(i * PHI);
          x = -0.25 + u * 0.6;
          const bodyU = (x + 0.8) / 1.8;
          const bodyH = 0.42 * Math.sin(bodyU * Math.PI) * (1.0 - 0.25 * bodyU);
          const yTip = bodyH + 0.32 * Math.pow(Math.sin(Math.PI * u), 0.7);
          y = bodyH + (yTip - bodyH) * v;
          z = Math.sin(i * 11.3) * 0.005;

          const bend = Math.pow(1.0 - bodyU, 2.1);
          z += Math.sin(wavePhase + x * 3.5 - v * 0.4) * bend * AMP;
        } else if (tIdx < 0.9) {
          // 臀鳍
          const u = (tIdx - 0.85) / 0.05;
          const v = frac(i * PHI);
          x = -0.6 + u * 0.35;
          const bodyU = (x + 0.8) / 1.8;
          const bodyH = 0.42 * Math.sin(bodyU * Math.PI) * (1.0 - 0.25 * bodyU);
          const yTip = -bodyH - 0.22 * Math.pow(Math.sin(Math.PI * u), 0.7);
          y = -bodyH + (yTip + bodyH) * v;
          z = Math.sin(i * 9.1) * 0.005;

          const bend = Math.pow(1.0 - bodyU, 2.1);
          z += Math.sin(wavePhase + x * 3.5 - v * 0.4) * bend * AMP;
        } else {
          // 胸鳍：左右各一，独立于摆尾节奏拍动
          const side = i % 2 === 0 ? 1.0 : -1.0;
          const sSpan = frac(i * PHI);
          const cChord = frac(i * PSI);

          const xBase = 0.28;
          const yBase = -0.06;
          const zBase = 0.3 * side;

          const dxTip = -0.16 * sSpan;
          const dyTip = -0.12 * sSpan;
          const dzTip = 0.34 * sSpan * side;

          x = xBase + dxTip - cChord * 0.16 * (1.0 - 0.8 * sSpan);
          y = yBase + dyTip;
          z = zBase + dzTip;

          const flapPhase = time * TWO_PI * SPEED * 0.85;
          const flap = Math.sin(flapPhase + x * 2.5) * sSpan;
          y += flap * 0.11;
          z += flap * 0.07 * side;

          const bodyU = (x + 0.8) / 1.8;
          const bend = Math.pow(1.0 - bodyU, 2.1);
          z += Math.sin(wavePhase + x * 3.5) * bend * AMP;
        }

        const shimmer =
          Math.sin(x * 12.0 + time * 8.0) * Math.cos(y * 12.0 + time * 8.0) * Math.sin(z * 12.0 + time * 8.0);
        x += shimmer * NOISE;
        y += shimmer * NOISE;
        z += shimmer * NOISE;
        // USER CODE END

        // 局部空间缓动（原型是 0.1/帧），再整体搬到世界里
        const px = (lx[i] += (x - lx[i]) * lerp);
        const py = (ly[i] += (y - ly[i]) * lerp);
        const pz = (lz[i] += (z - lz[i]) * lerp);

        // 先转成相对鱼心的偏移
        const bx = fx * px + ux * py + rx * pz;
        const by = fy * px + uy * py;
        const bz = fz * px + uz * py + rz * pz;

        // 相机环绕：绕鱼心转（原型里鱼就在原点，OrbitControls 绕的正是鱼本身）。
        // 绕世界原点转的话，巡游中的鱼会被甩到画面边上。先绕 Y 轴，再绕 X 轴。
        const ox = bx * cosY + bz * sinY;
        const oz0 = -bx * sinY + bz * cosY;
        const oy = by * cosP - oz0 * sinP;
        const oz = by * sinP + oz0 * cosP;

        const wx = cx + ox;
        const wy = cy + oy;
        const wz = cz + oz;

        const dz = camZ - wz;
        if (dz < camZ * 0.3) {
          visible[i] = 0;
          continue;
        }

        const scale = focal / dz;
        const sx = originX + wx * scale;
        const sy = originY - wy * scale;
        const pad = 8 * dpr;
        if (sx < -pad || sx > width + pad || sy < -pad || sy > height + pad) {
          visible[i] = 0;
          continue;
        }

        // 浓淡：原型的 l = 0.52 + shimmer*0.08 给出微光，再叠一层"近侧更实"的体积感。
        // oz 已经是相对鱼心、且转过之后的深度，转到侧面时明暗会跟着换面。
        const frontness = clamp01(0.5 + oz / (2 * FISH_RADIUS));
        const shade = clamp01((0.72 + shimmer * 0.28) * (0.5 + 0.5 * frontness));

        const persp = 0.6 + 0.4 * (scale / scaleRef);
        const size = Math.min(3 * dpr, Math.max(1, (0.75 + shade * 1.1) * dpr * persp));

        const normX = (px + 0.8) / 1.8;
        const toneBucket = Math.min(
          TONE_STEPS - 1,
          Math.max(0, Math.floor(((normX - NORM_X_MIN) / (NORM_X_MAX - NORM_X_MIN)) * TONE_STEPS))
        );
        const alphaBucket = Math.min(ALPHA_STEPS - 1, Math.floor(shade * ALPHA_STEPS));
        const bucket = toneBucket * ALPHA_STEPS + alphaBucket;

        visible[i] = 1;
        bucketOf[i] = bucket;
        outX[i] = sx - size / 2;
        outY[i] = sy - size / 2;
        outS[i] = size;
        bucketCount[bucket]++;
      }

      settled = true;

      // 计数排序：按 bucket 把可见粒子归拢成连续区间，把上千次 fillStyle 切换压到 112 次以内
      let running = 0;
      for (let b = 0; b < BUCKETS; b++) {
        bucketStart[b] = running;
        cursor[b] = running;
        running += bucketCount[b];
      }

      for (let i = 0; i < count; i++) {
        if (!visible[i]) continue;
        const slot = cursor[bucketOf[i]]++;
        sortX[slot] = outX[i];
        sortY[slot] = outY[i];
        sortS[slot] = outS[i];
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'multiply';

      for (let ti = 0; ti < TONE_STEPS; ti++) {
        for (let k = 0; k < ALPHA_STEPS; k++) {
          const b = ti * ALPHA_STEPS + k;
          const from = bucketStart[b];
          const to = from + bucketCount[b];
          if (from === to) continue;
          ctx.fillStyle = fillStyles[ti][k];
          ctx.beginPath();
          for (let n = from; n < to; n++) {
            ctx.rect(sortX[n], sortY[n], sortS[n], sortS[n]);
          }
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = 'source-over';
    }

    resize();

    // 减少动态效果：画一帧静止的鱼就停下
    if (reduceMotion) {
      frame(0, 1);
      const onResizeStatic = () => {
        resize();
        frame(0, 1);
      };
      window.addEventListener('resize', onResizeStatic);
      return () => window.removeEventListener('resize', onResizeStatic);
    }

    let raf = 0;
    let last = 0;
    let elapsed = 0;
    let inView = true;

    const loop = (now: number) => {
      raf = window.requestAnimationFrame(loop);
      if (!last) last = now;
      // 切标签页回来后 dt 会很大，夹住避免鱼瞬移
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      elapsed += dt;
      frame(elapsed, dt * 60);
    };

    const start = () => {
      if (raf) return;
      last = 0;
      raf = window.requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!raf) return;
      window.cancelAnimationFrame(raf);
      raf = 0;
    };

    // Hero 滚出视口 / 标签页隐藏时停机，不空转
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !document.hidden) start();
        else stop();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden && inView) start();
      else stop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    // 指针环绕：只在有精确指针的设备上启用（触屏没有 hover，跟随会变成点一下跳一下）
    const finePointer = window.matchMedia('(pointer: fine)');
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      targetYaw = Math.max(-1, Math.min(1, nx * 2)) * MAX_YAW;
      targetPitch = Math.max(-1, Math.min(1, ny * 2)) * MAX_PITCH;
    };
    const onPointerLeave = () => {
      targetYaw = 0;
      targetPitch = 0;
    };

    const bindPointer = () => {
      if (!finePointer.matches) return;
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('pointerleave', onPointerLeave);
    };
    const unbindPointer = () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
    };
    const onPointerCapabilityChange = () => {
      unbindPointer();
      if (finePointer.matches) bindPointer();
      else onPointerLeave();
    };
    bindPointer();
    finePointer.addEventListener('change', onPointerCapabilityChange);

    start();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      unbindPointer();
      finePointer.removeEventListener('change', onPointerCapabilityChange);
    };
  }, []);

  // canvas 是替换元素：绝对定位下 inset-0 不会拉伸它，宽高必须显式给 100%
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
