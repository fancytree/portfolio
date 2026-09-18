'use client';

// 首页池塘里的一条小鱼：在水面上自由巡游、身后带波纹。
// 点鱼 → 冒文字泡泡（和首页同一套文案和样式）；点水面 → 荡开一圈波纹。
// 波纹、精灵图、泡泡都来自 pondShared，和首页 InteractivePond 保持一致。

import { useEffect, useRef } from 'react';
import {
  BUBBLE_HIT_RADIUS,
  BUBBLE_LIFE,
  FISH_SPRITE_SRC,
  GOLD_CHANCE,
  WATER_BOTTOM,
  WATER_TOP,
  buildRippleTexture,
  drawBubble,
  drawFishSprite,
  drawRipple,
  loadImage,
  randomBubblePhrase,
  shortestAngle,
  type Bubble,
  type Ripple,
} from '@/app/components/pondShared';

// 世界坐标：固定 460×460，再整体缩放进卡片，鱼和波纹的比例与首页接近
const WORLD = 460;
const EDGE = 90; // 离边这么近就掉头
const MAX_RIPPLES = 16;
const MAX_BUBBLES = 2;

export default function PondFish() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionFactor = reducedMotion ? 0.18 : 1;
    const rippleTexture = buildRippleTexture();
    const water = context.createLinearGradient(0, 0, 0, WORLD);
    water.addColorStop(0, WATER_TOP);
    water.addColorStop(1, WATER_BOTTOM);

    const fish = {
      id: 1,
      x: WORLD * (0.3 + Math.random() * 0.4),
      y: WORLD * (0.3 + Math.random() * 0.4),
      heading: Math.random() * Math.PI * 2,
      speed: 30 + Math.random() * 12,
      scale: 1,
      turnSeed: Math.random() * 100,
      rippleClock: 0,
      isGold: Math.random() < GOLD_CHANCE,
      phase: Math.floor(Math.random() * 104),
    };
    const ripples: Ripple[] = [];
    const bubbles: Bubble[] = [];

    let view = { width: 1, height: 1, dpr: 1, scale: 1 };
    let frameId = 0;
    let lastTime = performance.now();
    let disposed = false;
    let sprite: HTMLImageElement | null = null;
    let inView = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      view = { width: rect.width, height: rect.height, dpr, scale: rect.width / WORLD };
    };

    const toWorld = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: (event.clientX - rect.left) / view.scale, y: (event.clientY - rect.top) / view.scale };
    };

    const hitsFish = (x: number, y: number) => Math.hypot(x - fish.x, y - fish.y) < BUBBLE_HIT_RADIUS * fish.scale;

    const addRipple = (x: number, y: number, life: number, size: number) => {
      ripples.push({ x, y, age: 0, life, size, seed: Math.random() * Math.PI * 2 });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
    };

    const onPointerDown = (event: PointerEvent) => {
      const { x, y } = toWorld(event);
      if (hitsFish(x, y)) {
        bubbles.push({ fishId: fish.id, x: fish.x, y: fish.y - BUBBLE_HIT_RADIUS, age: 0, text: randomBubblePhrase() });
        if (bubbles.length > MAX_BUBBLES) bubbles.shift();
      } else {
        addRipple(x, y, 1.25, 26);
      }
    };

    // 悬停在鱼身上时换成手型，提示可以点
    const onPointerMove = (event: PointerEvent) => {
      const { x, y } = toWorld(event);
      canvas.style.cursor = hitsFish(x, y) ? 'pointer' : 'default';
    };

    const steer = (time: number, dt: number) => {
      let target = fish.heading + Math.sin(time * 0.00032 + fish.turnSeed) * 0.018;
      if (fish.x < EDGE) target = 0;
      if (fish.x > WORLD - EDGE) target = Math.PI;
      if (fish.y < EDGE) target = Math.PI / 2;
      if (fish.y > WORLD - EDGE) target = -Math.PI / 2;

      fish.heading += shortestAngle(fish.heading, target) * Math.min(1, dt * 1.9);
      const travel = fish.speed * motionFactor * dt;
      fish.x += Math.cos(fish.heading) * travel;
      fish.y += Math.sin(fish.heading) * travel;
      fish.rippleClock -= dt * motionFactor;
      if (fish.rippleClock <= 0) {
        addRipple(fish.x, fish.y, 1.65, 20 + fish.scale * 8);
        fish.rippleClock = 0.36 + Math.random() * 0.16;
      }
    };

    const drawFrame = (time: number) => {
      const dt = Math.min(0.04, Math.max(0, (time - lastTime) / 1000));
      lastTime = time;

      steer(time, dt);
      for (const ripple of ripples) ripple.age += dt * motionFactor;
      for (let i = ripples.length - 1; i >= 0; i--) if (ripples[i].age >= ripples[i].life) ripples.splice(i, 1);
      for (const bubble of bubbles) {
        bubble.age += dt;
        bubble.x = fish.x;
        bubble.y = fish.y - BUBBLE_HIT_RADIUS * fish.scale;
      }
      for (let i = bubbles.length - 1; i >= 0; i--) if (bubbles[i].age >= BUBBLE_LIFE) bubbles.splice(i, 1);

      context.setTransform(view.dpr * view.scale, 0, 0, view.dpr * view.scale, 0, 0);
      context.fillStyle = water;
      context.fillRect(0, 0, WORLD, WORLD);

      for (const ripple of ripples) drawRipple(context, rippleTexture, ripple);
      if (sprite) drawFishSprite(context, sprite, fish, time);

      // 泡泡按屏幕像素画，文字大小与首页一致，不随世界缩放变小
      context.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
      for (const bubble of bubbles) {
        drawBubble(context, { ...bubble, x: bubble.x * view.scale, y: bubble.y * view.scale });
      }
    };

    const render = (time: number) => {
      drawFrame(time);
      frameId = requestAnimationFrame(render);
    };

    const start = () => {
      if (frameId || disposed || !inView || document.hidden) return;
      lastTime = performance.now();
      frameId = requestAnimationFrame(render);
    };
    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = 0;
    };

    // 滚出视口 / 标签页隐藏时停机
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    observer.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);

    loadImage(FISH_SPRITE_SRC).then((image) => {
      if (disposed) return;
      sprite = image;
      // 先画一帧：页面在后台打开时循环不会启动，但卡片不该是空的
      drawFrame(performance.now());
      start();
    });

    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="A fish swimming in a pond — tap the fish to hear from it, tap the water to make a ripple"
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
