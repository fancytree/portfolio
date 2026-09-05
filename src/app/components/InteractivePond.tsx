'use client';

import { useEffect, useRef } from 'react';

const WORLD = { width: 1564, height: 1006 };
const ISLAND = { x: 1114, y: 418, rx: 200, ry: 120 };
const MAX_FISH = 12;
const MAX_RIPPLES = 28;
const GOLD_HUE = 34;
const GOLD_CHANCE = 0.08;
const EXIT_MARGIN = 90;
const MAX_BUBBLES = 3;
const BUBBLE_LIFE = 2.4;
const BUBBLE_HIT_RADIUS = 46;
const RIPPLE_TEX_REF_RADIUS_X = 100;
const RIPPLE_TEX_REF_RADIUS_Y = RIPPLE_TEX_REF_RADIUS_X * 0.66;
const RIPPLE_TEX_SIZE = 240;

// `filter: blur()` is by far the most expensive canvas op, and drawRipple used to
// pay for it on 3 strokes per ripple, every frame. The ripple's per-ripple "seed"
// only ever rotates the whole 3-arc bundle (it's added uniformly to every arc's
// start angle) and its radius is just a scale, so the whole shape can be baked
// into one offscreen texture and reused via drawImage + rotate + scale instead.
function buildRippleTexture() {
  const texture = document.createElement('canvas');
  texture.width = RIPPLE_TEX_SIZE;
  texture.height = RIPPLE_TEX_SIZE;
  const textureContext = texture.getContext('2d');
  if (!textureContext) return texture;

  textureContext.translate(RIPPLE_TEX_SIZE / 2, RIPPLE_TEX_SIZE / 2);
  textureContext.strokeStyle = '#91bdcd';
  textureContext.lineCap = 'round';
  textureContext.filter = 'blur(1.1px)';

  const arcStarts = [0.12, 2.18, 4.27];
  const arcLengths = [1.34, 1.08, 1.2];
  for (let segment = 0; segment < arcStarts.length; segment++) {
    const start = arcStarts[segment];
    const end = start + arcLengths[segment];
    textureContext.beginPath();
    textureContext.ellipse(0, 0, RIPPLE_TEX_REF_RADIUS_X, RIPPLE_TEX_REF_RADIUS_Y, 0, start, end);
    textureContext.globalAlpha = 0.42 - segment * 0.05;
    textureContext.lineWidth = 2.6 - segment * 0.4;
    textureContext.stroke();
  }

  return texture;
}
const BUBBLE_PHRASES = [
  'We see you',
  'Stop poking me',
  'Welcome',
  'BLUE BLUE BLUE',
  "Mei hasn't fed us yet...",
  'Not today',
  'Personal space!',
  'Ooh, shiny',
  'Rude.',
  'Again?',
  'Splish splash',
  'Tickles!',
  'I was here first',
  'So judged right now',
  'Bubble bubble',
  'Nice try',
  'Feed me instead',
  'Excuse you',
];

type Fish = {
  id: number;
  x: number;
  y: number;
  heading: number;
  speed: number;
  scale: number;
  turnSeed: number;
  rippleClock: number;
  isGold: boolean;
  phase: number;
  leaving: boolean;
  exitHeading: number;
  behavior: 'free' | 'formation' | 'circle';
  behaviorTimer: number;
  behaviorHeading: number;
  behaviorCenterX: number;
  behaviorCenterY: number;
  behaviorRadius: number;
  behaviorSpin: number;
};

type Ripple = {
  x: number;
  y: number;
  age: number;
  life: number;
  size: number;
  seed: number;
};

type Bubble = {
  fishId: number;
  x: number;
  y: number;
  age: number;
  text: string;
};

type LoadedAssets = {
  island: HTMLImageElement;
  plantsA: HTMLImageElement;
  plantsB: HTMLImageElement;
  fish: HTMLImageElement;
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function shortestAngle(from: number, to: number) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

// Ripples should read as fading outward as they expand, not brightening then
// dimming symmetrically. Snap up to full strength fast (avoids a hard pop-in
// at spawn) then decay for the rest of the ripple's life as it grows.
// Normalized so the peak still hits 1 (matching the old sine curve's max),
// instead of topping out under it like an un-normalized ramp*decay would.
const RIPPLE_FADE_RAMP = 0.06;
const RIPPLE_FADE_DECAY = 0.85;
const RIPPLE_FADE_PEAK = Math.pow(1 - RIPPLE_FADE_RAMP, RIPPLE_FADE_DECAY);

function rippleFade(progress: number) {
  const fadeIn = Math.min(1, progress / RIPPLE_FADE_RAMP);
  const fadeOut = Math.pow(1 - progress, RIPPLE_FADE_DECAY);
  return (fadeIn * fadeOut) / RIPPLE_FADE_PEAK;
}

function makeFish(id: number, x: number, y: number, heading = Math.random() * Math.PI * 2, isGold = false): Fish {
  return {
    id,
    x,
    y,
    heading,
    speed: 22 + Math.random() * 20,
    scale: 0.78 + Math.random() * 0.3,
    turnSeed: Math.random() * 100,
    rippleClock: Math.random() * 0.4,
    isGold,
    phase: Math.floor(Math.random() * 104),
    leaving: false,
    exitHeading: 0,
    behavior: 'free',
    behaviorTimer: 0,
    behaviorHeading: 0,
    behaviorCenterX: 0,
    behaviorCenterY: 0,
    behaviorRadius: 0,
    behaviorSpin: 1,
  };
}

function drawImageAroundPivot(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  pivotX: number,
  pivotY: number,
  angle: number,
  scale: number = 1,
) {
  context.save();
  context.translate(pivotX, pivotY);
  context.rotate(angle);
  context.scale(scale, scale);
  context.drawImage(image, x - pivotX, y - pivotY);
  context.restore();
}

export function InteractivePond({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasContext = canvas.getContext('2d', { alpha: false });
    if (!canvasContext) return;
    const context = canvasContext;

    const rippleTexture = buildRippleTexture();
    const waterGradient = context.createLinearGradient(0, 0, 0, WORLD.height);
    waterGradient.addColorStop(0, '#f7f5ee');
    waterGradient.addColorStop(1, '#ece9e0');

    let disposed = false;
    let frameId = 0;
    let nextFishId = 4;
    let lastTime = performance.now();
    let viewport = { width: 1, height: 1, dpr: 1, scale: 1, offsetX: 0, offsetY: 0 };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionFactor = reducedMotion ? 0.18 : 1;

    let goldFishAlive = false;

    function pickIsGold() {
      if (goldFishAlive) return false;
      const isGold = Math.random() < GOLD_CHANCE;
      if (isGold) goldFishAlive = true;
      return isGold;
    }

    const fish: Fish[] = [
      makeFish(1, 290, 555, 0.05, pickIsGold()),
      makeFish(2, 1325, 345, Math.PI * 0.82, pickIsGold()),
      makeFish(3, 1218, 760, -Math.PI * 0.36, pickIsGold()),
    ];
    const ripples: Ripple[] = [];
    const bubbles: Bubble[] = [];
    let hover: { x: number; y: number } | null = null;

    function findFishAt(x: number, y: number) {
      let closest: Fish | null = null;
      let closestDistance = Infinity;
      for (const item of fish) {
        const hitRadius = BUBBLE_HIT_RADIUS * item.scale;
        const distance = Math.hypot(x - item.x, y - item.y);
        if (distance < hitRadius && distance < closestDistance) {
          closest = item;
          closestDistance = distance;
        }
      }
      return closest;
    }

    function addBubble(owner: Fish) {
      const text = BUBBLE_PHRASES[Math.floor(Math.random() * BUBBLE_PHRASES.length)];
      bubbles.push({
        fishId: owner.id,
        x: owner.x,
        y: owner.y - BUBBLE_HIT_RADIUS * owner.scale,
        age: 0,
        text,
      });
      if (bubbles.length > MAX_BUBBLES) bubbles.shift();
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = Math.max(1, Math.round(rect.width * dpr));
      canvas!.height = Math.max(1, Math.round(rect.height * dpr));
      const scale = Math.max(rect.width / WORLD.width, rect.height / WORLD.height);
      viewport = {
        width: rect.width,
        height: rect.height,
        dpr,
        scale,
        offsetX: (rect.width - WORLD.width * scale) / 2,
        offsetY: (rect.height - WORLD.height * scale) / 2,
      };
    }

    function isOnIsland(x: number, y: number) {
      const dx = (x - ISLAND.x) / ISLAND.rx;
      const dy = (y - ISLAND.y) / ISLAND.ry;
      return dx * dx + dy * dy < 1;
    }

    function addRipple(x: number, y: number, life: number, size: number) {
      ripples.push({ x, y, age: 0, life, size, seed: Math.random() * Math.PI * 2 });
      if (ripples.length > MAX_RIPPLES) ripples.splice(0, ripples.length - MAX_RIPPLES);
    }

    function edgeDistance(item: Fish) {
      return Math.min(item.x, WORLD.width - item.x, item.y, WORLD.height - item.y);
    }

    function nearestEdgeHeading(item: Fish) {
      const edges = [
        { heading: Math.PI, distance: item.x },
        { heading: 0, distance: WORLD.width - item.x },
        { heading: -Math.PI / 2, distance: item.y },
        { heading: Math.PI / 2, distance: WORLD.height - item.y },
      ];
      let nearest = edges[0];
      for (const edge of edges) if (edge.distance < nearest.distance) nearest = edge;
      return nearest.heading;
    }

    function sendEdgeFishAway() {
      const candidates = fish.filter((item) => !item.leaving);
      if (candidates.length === 0) return;
      let chosen = candidates[0];
      for (const item of candidates) {
        if (edgeDistance(item) < edgeDistance(chosen)) chosen = item;
      }
      chosen.leaving = true;
      chosen.exitHeading = nearestEdgeHeading(chosen);
      chosen.speed *= 2.2;
    }

    let groupEventTimer = 6 + Math.random() * 6;

    function triggerGroupBehavior(dt: number) {
      groupEventTimer -= dt * motionFactor;
      if (groupEventTimer > 0) return;
      groupEventTimer = 10 + Math.random() * 12;
      if (fish.some((item) => item.behavior !== 'free')) return;

      const eligible = fish.filter((item) => !item.leaving);
      if (eligible.length < 3) return;

      const groupSize = Math.min(eligible.length, 3 + Math.floor(Math.random() * 4));
      const pool = [...eligible];
      const participants: Fish[] = [];
      for (let i = 0; i < groupSize && pool.length > 0; i++) {
        participants.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
      }

      const duration = 5 + Math.random() * 4;
      if (Math.random() < 0.5) {
        let centerX = WORLD.width / 2;
        let centerY = WORLD.height / 2;
        for (let attempt = 0; attempt < 10; attempt++) {
          centerX = WORLD.width * (0.15 + Math.random() * 0.7);
          centerY = WORLD.height * (0.15 + Math.random() * 0.7);
          if (!isOnIsland(centerX, centerY)) break;
        }
        const radius = 90 + Math.random() * 70;
        const spin = Math.random() < 0.5 ? 1 : -1;
        for (const item of participants) {
          item.behavior = 'circle';
          item.behaviorTimer = duration;
          item.behaviorCenterX = centerX;
          item.behaviorCenterY = centerY;
          item.behaviorRadius = radius;
          item.behaviorSpin = spin;
        }
      } else {
        const heading = Math.random() * Math.PI * 2;
        for (const item of participants) {
          item.behavior = 'formation';
          item.behaviorTimer = duration;
          item.behaviorHeading = heading;
        }
      }
    }

    function addFish(x: number, y: number) {
      if (isOnIsland(x, y)) return;
      if (fish.length >= MAX_FISH) sendEdgeFishAway();
      fish.push(makeFish(nextFishId++, x, y, undefined, pickIsGold()));
      addRipple(x, y, 1.25, 26);
    }

    function onPointerDown(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = (event.clientX - rect.left - viewport.offsetX) / viewport.scale;
      const y = (event.clientY - rect.top - viewport.offsetY) / viewport.scale;
      if (x < 0 || x > WORLD.width || y < 0 || y > WORLD.height) return;

      const hitFish = findFishAt(x, y);
      if (hitFish) {
        addBubble(hitFish);
        return;
      }
      addFish(x, y);
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType === 'touch') return;
      const rect = canvas!.getBoundingClientRect();
      const x = (event.clientX - rect.left - viewport.offsetX) / viewport.scale;
      const y = (event.clientY - rect.top - viewport.offsetY) / viewport.scale;
      const inBounds = x >= 0 && x <= WORLD.width && y >= 0 && y <= WORLD.height;
      hover = inBounds && !isOnIsland(x, y) ? { x, y } : null;
    }

    function onPointerLeave() {
      hover = null;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        let x = WORLD.width * (0.25 + Math.random() * 0.5);
        let y = WORLD.height * (0.25 + Math.random() * 0.5);
        if (isOnIsland(x, y)) {
          x = WORLD.width * 0.25;
          y = WORLD.height * 0.7;
        }
        addFish(x, y);
      }
    }

    function steerFish(item: Fish, time: number, dt: number) {
      if (item.leaving) {
        item.heading += shortestAngle(item.heading, item.exitHeading) * Math.min(1, dt * 2.4);
        const travel = item.speed * motionFactor * dt;
        item.x += Math.cos(item.heading) * travel;
        item.y += Math.sin(item.heading) * travel;
        item.rippleClock -= dt * motionFactor;
        if (item.rippleClock <= 0) {
          addRipple(item.x, item.y, 1.65, 20 + item.scale * 8);
          item.rippleClock = 0.36 + Math.random() * 0.16;
        }
        return;
      }

      let target: number;
      let turnRate = 1.9;

      if (item.behavior === 'formation' && item.behaviorTimer > 0) {
        target = item.behaviorHeading + Math.sin(time * 0.0005 + item.turnSeed) * 0.015;
        turnRate = 2.1;
        item.behaviorTimer -= dt * motionFactor;
      } else if (item.behavior === 'circle' && item.behaviorTimer > 0) {
        const cdx = item.x - item.behaviorCenterX;
        const cdy = item.y - item.behaviorCenterY;
        const angle = Math.atan2(cdy, cdx);
        const radialError = Math.hypot(cdx, cdy) - item.behaviorRadius;
        target = angle + (Math.PI / 2) * item.behaviorSpin - radialError * 0.01 * item.behaviorSpin;
        turnRate = 2.1;
        item.behaviorTimer -= dt * motionFactor;
      } else {
        item.behavior = 'free';
        target = item.heading + Math.sin(time * 0.00032 + item.turnSeed) * 0.018;
      }

      const edge = 115;
      if (item.x < edge) target = 0;
      if (item.x > WORLD.width - edge) target = Math.PI;
      if (item.y < edge) target = Math.PI / 2;
      if (item.y > WORLD.height - edge) target = -Math.PI / 2;

      const dx = item.x - ISLAND.x;
      const dy = item.y - ISLAND.y;
      const islandDistance = (dx * dx) / (ISLAND.rx * ISLAND.rx) + (dy * dy) / (ISLAND.ry * ISLAND.ry);
      if (islandDistance < 1.22) target = Math.atan2(dy, dx);

      item.heading += shortestAngle(item.heading, target) * Math.min(1, dt * turnRate);
      const travel = item.speed * motionFactor * dt;
      item.x += Math.cos(item.heading) * travel;
      item.y += Math.sin(item.heading) * travel;
      item.rippleClock -= dt * motionFactor;
      if (item.rippleClock <= 0) {
        addRipple(item.x, item.y, 1.65, 20 + item.scale * 8);
        item.rippleClock = 0.36 + Math.random() * 0.16;
      }
    }

    function drawRipple(ripple: Ripple) {
      const progress = Math.min(1, ripple.age / ripple.life);
      const alpha = rippleFade(progress) * 0.34;
      if (alpha < 0.01) return;
      const radiusX = 42 + ripple.size + progress * 112;
      let interference = 0;

      for (const other of ripples) {
        if (other === ripple) continue;
        const otherProgress = Math.min(1, other.age / other.life);
        const otherRadius = 42 + other.size + otherProgress * 112;
        const distance = Math.hypot(ripple.x - other.x, (ripple.y - other.y) / 0.66);
        const overlap = Math.abs(distance - radiusX - otherRadius * 0.18);
        if (overlap < 28) interference += (1 - overlap / 28) * 0.025;
      }

      const rotation = Math.sin(ripple.seed) * 0.06 + interference + ripple.seed * 0.12;
      const scale = radiusX / RIPPLE_TEX_REF_RADIUS_X;

      context.save();
      context.translate(ripple.x, ripple.y);
      context.rotate(rotation);
      context.scale(scale, scale);
      context.globalCompositeOperation = 'multiply';
      context.globalAlpha = alpha;
      context.drawImage(rippleTexture, -RIPPLE_TEX_SIZE / 2, -RIPPLE_TEX_SIZE / 2);
      context.restore();
    }

    function drawRippleInterference() {
      let renderedPairs = 0;
      const verticalScale = 0.66;

      for (let firstIndex = 0; firstIndex < ripples.length && renderedPairs < 6; firstIndex++) {
        const first = ripples[firstIndex];
        const firstProgress = Math.min(1, first.age / first.life);
        const firstRadius = 42 + first.size + firstProgress * 112;
        const firstFade = rippleFade(firstProgress);

        for (let secondIndex = firstIndex + 1; secondIndex < ripples.length && renderedPairs < 6; secondIndex++) {
          const second = ripples[secondIndex];
          const secondProgress = Math.min(1, second.age / second.life);
          const secondRadius = 42 + second.size + secondProgress * 112;
          const secondFade = rippleFade(secondProgress);
          const dx = second.x - first.x;
          const dy = (second.y - first.y) / verticalScale;
          const distance = Math.hypot(dx, dy);

          if (
            distance <= Math.abs(firstRadius - secondRadius) + 5 ||
            distance >= firstRadius + secondRadius - 5 ||
            distance === 0
          ) {
            continue;
          }

          const along =
            (firstRadius * firstRadius - secondRadius * secondRadius + distance * distance) / (2 * distance);
          const heightSquared = firstRadius * firstRadius - along * along;
          if (heightSquared <= 0) continue;

          const height = Math.sqrt(heightSquared);
          const unitX = dx / distance;
          const unitY = dy / distance;
          const midpointX = first.x + unitX * along;
          const midpointY = first.y / verticalScale + unitY * along;
          const intensity = firstFade * secondFade;

          for (const side of [-1, 1]) {
            const x = midpointX - unitY * height * side;
            const scaledY = midpointY + unitX * height * side;
            const y = scaledY * verticalScale;
            if (isOnIsland(x, y)) continue;

            const firstAngle = Math.atan2(scaledY - first.y / verticalScale, x - first.x);
            const secondAngle = Math.atan2(scaledY - second.y / verticalScale, x - second.x);
            const tangents = [firstAngle, secondAngle].map((angle) => {
              const tangentX = -Math.sin(angle);
              const tangentY = Math.cos(angle) * verticalScale;
              const length = Math.hypot(tangentX, tangentY) || 1;
              return { x: tangentX / length, y: tangentY / length };
            });

            context.save();
            context.globalCompositeOperation = 'multiply';
            context.strokeStyle = '#83b4c7';
            context.lineCap = 'round';
            context.filter = 'blur(0.9px)';
            context.lineWidth = 1.7;
            for (let tangentIndex = 0; tangentIndex < tangents.length; tangentIndex++) {
              const tangent = tangents[tangentIndex];
              const bendX = (tangents[1 - tangentIndex].x - tangent.x) * 3.2;
              const bendY = (tangents[1 - tangentIndex].y - tangent.y) * 3.2;
              context.beginPath();
              context.moveTo(x - tangent.x * 17, y - tangent.y * 17);
              context.quadraticCurveTo(x + bendX, y + bendY, x + tangent.x * 17, y + tangent.y * 17);
              context.globalAlpha = intensity * 0.3;
              context.stroke();
            }
            context.restore();
          }

          renderedPairs++;
        }
      }
    }

    function drawHoverPreview(time: number) {
      if (!hover) return;
      const pulse = 0.5 + Math.sin(time * 0.0042) * 0.5;
      const radiusX = 15 + pulse * 6;

      context.save();
      context.translate(hover.x, hover.y);
      context.globalCompositeOperation = 'multiply';
      context.strokeStyle = '#8fb9c9';
      context.lineCap = 'round';
      context.filter = 'blur(0.5px)';
      context.globalAlpha = 0.18 + pulse * 0.14;
      context.lineWidth = 1.3;
      context.beginPath();
      context.ellipse(0, 0, radiusX, radiusX * 0.66, 0, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    }

    function drawBubble(bubble: Bubble) {
      const progress = bubble.age / BUBBLE_LIFE;
      const fadeIn = Math.min(1, bubble.age / 0.15);
      const fadeOut = 1 - Math.max(0, (bubble.age - (BUBBLE_LIFE - 0.5)) / 0.5);
      const alpha = Math.min(fadeIn, fadeOut);
      if (alpha <= 0.01) return;

      const floatY = bubble.y - 8 - progress * 14;

      context.save();
      context.font = '600 12px system-ui, -apple-system, sans-serif';
      const textWidth = context.measureText(bubble.text).width;
      const paddingX = 9;
      const boxWidth = textWidth + paddingX * 2;
      const boxHeight = 24;
      const boxX = bubble.x - boxWidth / 2;
      const boxY = floatY - boxHeight;
      const radius = 8;

      context.beginPath();
      context.moveTo(boxX + radius, boxY);
      context.arcTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + boxHeight, radius);
      context.arcTo(boxX + boxWidth, boxY + boxHeight, boxX, boxY + boxHeight, radius);
      context.arcTo(boxX, boxY + boxHeight, boxX, boxY, radius);
      context.arcTo(boxX, boxY, boxX + boxWidth, boxY, radius);
      context.closePath();
      context.moveTo(bubble.x - 4, boxY + boxHeight);
      context.lineTo(bubble.x, boxY + boxHeight + 6);
      context.lineTo(bubble.x + 4, boxY + boxHeight);
      context.closePath();

      context.globalAlpha = alpha;
      context.fillStyle = '#fdfefe';
      context.fill();

      context.fillStyle = '#3f5a61';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(bubble.text, bubble.x, boxY + boxHeight / 2);
      context.restore();
    }

    function drawIslandRipples(time: number) {
      const cycle = (time * 0.00018 * motionFactor) % 1;

      context.save();
      context.translate(1127, 412);
      context.rotate(0.23);
      context.globalCompositeOperation = 'multiply';
      context.lineCap = 'round';
      context.lineJoin = 'round';

      const segmentStarts = [0.08, 1.62, 3.18, 4.74];
      const segmentLengths = [1.18, 1.06, 1.16, 1.02];
      for (let wave = 0; wave < 2; wave++) {
        const progress = (cycle + wave * 0.5) % 1;
        const fade = rippleFade(progress) * (wave === 0 ? 1 : 0.72);
        const radiusX = 177.6 + progress * 49.6;
        const radiusY = 75.2 + progress * 25.6;

        for (let segment = 0; segment < segmentStarts.length; segment++) {
          const start = segmentStarts[segment] + Math.sin(time * 0.0002 + segment) * 0.015;
          const end = start + segmentLengths[segment];
          context.beginPath();
          for (let step = 0; step <= 24; step++) {
            const angle = start + (step / 24) * (end - start);
            const irregularity = Math.sin(angle * 3 + segment * 1.7 + wave * 2.1) * 1.68;
            const x = Math.cos(angle) * (radiusX + irregularity);
            const y = Math.sin(angle) * (radiusY + irregularity * 0.42);
            if (step === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
          }

          context.setLineDash([]);
          context.strokeStyle = '#90bbca';
          context.filter = 'blur(1.2px)';
          context.globalAlpha = fade * (0.18 - segment * 0.012);
          context.lineWidth = (2.08 - segment * 0.24) * (0.6 + progress * 1);
          context.stroke();
        }
      }

      context.restore();
    }

    function drawFish(item: Fish, image: HTMLImageElement, time: number) {
      context.save();
      context.translate(item.x, item.y);
      context.rotate(item.heading);
      context.scale(item.scale, item.scale);
      context.globalAlpha = 0.96;
      context.filter = item.isGold ? `hue-rotate(${GOLD_HUE}deg) saturate(1.18)` : 'none';
      context.imageSmoothingEnabled = true;
      const frame = (Math.floor((time / 1000) * 24) + item.phase) % 104;
      const sourceX = (frame % 13) * 320;
      const sourceY = Math.floor(frame / 13) * 180;
      context.drawImage(image, sourceX, sourceY, 320, 180, -64, -36, 128, 72);
      context.restore();
    }

    function render(assets: LoadedAssets, time: number) {
      const dt = Math.min(0.04, (time - lastTime) / 1000);
      lastTime = time;

      context.setTransform(viewport.dpr, 0, 0, viewport.dpr, 0, 0);
      context.clearRect(0, 0, viewport.width, viewport.height);
      context.fillStyle = '#f3f1ea';
      context.fillRect(0, 0, viewport.width, viewport.height);
      context.translate(viewport.offsetX, viewport.offsetY);
      context.scale(viewport.scale, viewport.scale);
      context.fillStyle = waterGradient;
      context.fillRect(0, 0, WORLD.width, WORLD.height);

      triggerGroupBehavior(dt);
      for (const item of fish) steerFish(item, time, dt);
      for (let index = fish.length - 1; index >= 0; index--) {
        const item = fish[index];
        if (
          item.leaving &&
          (item.x < -EXIT_MARGIN ||
            item.x > WORLD.width + EXIT_MARGIN ||
            item.y < -EXIT_MARGIN ||
            item.y > WORLD.height + EXIT_MARGIN)
        ) {
          if (item.isGold) goldFishAlive = false;
          fish.splice(index, 1);
        }
      }
      for (const ripple of ripples) ripple.age += dt * motionFactor;
      for (let index = ripples.length - 1; index >= 0; index--) {
        if (ripples[index].age >= ripples[index].life) ripples.splice(index, 1);
      }
      for (const bubble of bubbles) {
        bubble.age += dt;
        const owner = fish.find((item) => item.id === bubble.fishId);
        if (owner) {
          bubble.x = owner.x;
          bubble.y = owner.y - BUBBLE_HIT_RADIUS * owner.scale;
        }
      }
      for (let index = bubbles.length - 1; index >= 0; index--) {
        if (bubbles[index].age >= BUBBLE_LIFE) bubbles.splice(index, 1);
      }
      for (const ripple of ripples) drawRipple(ripple);
      drawRippleInterference();
      drawHoverPreview(time);
      for (const item of fish) drawFish(item, assets.fish, time);

      context.drawImage(assets.island, 930, 282, 400, 256);
      drawIslandRipples(time);
      const wind = Math.sin(time * 0.00115) * 0.032 + Math.sin(time * 0.00043 + 1.4) * 0.016;
      drawImageAroundPivot(context, assets.plantsA, 959, 125, 1074, 368, wind * motionFactor, 0.8);
      drawImageAroundPivot(context, assets.plantsB, 1159, 297, 1232, 460, -wind * 0.75 * motionFactor, 0.8);
      for (const bubble of bubbles) drawBubble(bubble);

      frameId = requestAnimationFrame((nextTime) => render(assets, nextTime));
    }

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('keydown', onKeyDown);

    Promise.all([
      loadImage('/pond/island.png'),
      loadImage('/pond/plants-a.png'),
      loadImage('/pond/plants-b.png'),
      loadImage('/pond/fish-swim-sprite-clean.png'),
    ]).then(([island, plantsA, plantsB, fishImage]) => {
      if (!disposed) render({ island, plantsA, plantsB, fish: fishImage }, performance.now());
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div className={`pond-shell ${className}`}>
      <canvas
        ref={canvasRef}
        className="pond-canvas"
        aria-label="Interactive pond. Click or press Enter to add a fish to the water."
        role="button"
        tabIndex={0}
      />
    </div>
  );
}
