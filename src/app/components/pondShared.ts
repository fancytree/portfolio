// 首页池塘（InteractivePond）和 Playground 小鱼卡片共用的绘制素材：
// 波纹贴图与淡出曲线、小鱼精灵图、文字泡泡和它的文案。两边改一处即可保持一致。

export const RIPPLE_TEX_REF_RADIUS_X = 100;
export const RIPPLE_TEX_REF_RADIUS_Y = RIPPLE_TEX_REF_RADIUS_X * 0.66;
export const RIPPLE_TEX_SIZE = 240;

export const WATER_TOP = '#f7f5ee';
export const WATER_BOTTOM = '#ece9e0';

export const FISH_SPRITE_SRC = '/pond/fish-swim-sprite-clean.png';
export const GOLD_HUE = 34;
export const GOLD_CHANCE = 0.08;

export const BUBBLE_LIFE = 2.4;
export const BUBBLE_HIT_RADIUS = 46;

export const BUBBLE_PHRASES = [
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

export type Ripple = {
  x: number;
  y: number;
  age: number;
  life: number;
  size: number;
  seed: number;
};

export type Bubble = {
  fishId: number;
  x: number;
  y: number;
  age: number;
  text: string;
};

export function randomBubblePhrase() {
  return BUBBLE_PHRASES[Math.floor(Math.random() * BUBBLE_PHRASES.length)];
}

export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export function shortestAngle(from: number, to: number) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

// `filter: blur()` is by far the most expensive canvas op, and drawRipple used to
// pay for it on 3 strokes per ripple, every frame. The ripple's per-ripple "seed"
// only ever rotates the whole 3-arc bundle (it's added uniformly to every arc's
// start angle) and its radius is just a scale, so the whole shape can be baked
// into one offscreen texture and reused via drawImage + rotate + scale instead.
export function buildRippleTexture() {
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

// Ripples should read as fading outward as they expand, not brightening then
// dimming symmetrically. Snap up to full strength fast (avoids a hard pop-in
// at spawn) then decay for the rest of the ripple's life as it grows.
// Normalized so the peak still hits 1 (matching the old sine curve's max),
// instead of topping out under it like an un-normalized ramp*decay would.
const RIPPLE_FADE_RAMP = 0.06;
const RIPPLE_FADE_DECAY = 0.85;
const RIPPLE_FADE_PEAK = Math.pow(1 - RIPPLE_FADE_RAMP, RIPPLE_FADE_DECAY);

export function rippleFade(progress: number) {
  const fadeIn = Math.min(1, progress / RIPPLE_FADE_RAMP);
  const fadeOut = Math.pow(1 - progress, RIPPLE_FADE_DECAY);
  return (fadeIn * fadeOut) / RIPPLE_FADE_PEAK;
}

export function rippleRadius(ripple: Ripple) {
  const progress = Math.min(1, ripple.age / ripple.life);
  return 42 + ripple.size + progress * 112;
}

// 画一圈波纹；interference 是首页多条波纹相交时的额外扭转，单独使用时传 0
export function drawRipple(
  context: CanvasRenderingContext2D,
  texture: HTMLCanvasElement,
  ripple: Ripple,
  interference = 0,
) {
  const progress = Math.min(1, ripple.age / ripple.life);
  const alpha = rippleFade(progress) * 0.34;
  if (alpha < 0.01) return;
  const rotation = Math.sin(ripple.seed) * 0.06 + interference + ripple.seed * 0.12;
  const scale = rippleRadius(ripple) / RIPPLE_TEX_REF_RADIUS_X;

  context.save();
  context.translate(ripple.x, ripple.y);
  context.rotate(rotation);
  context.scale(scale, scale);
  context.globalCompositeOperation = 'multiply';
  context.globalAlpha = alpha;
  context.drawImage(texture, -RIPPLE_TEX_SIZE / 2, -RIPPLE_TEX_SIZE / 2);
  context.restore();
}

// 精灵图 13 列 × 8 行，共 104 帧，24fps
export function drawFishSprite(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  fish: { x: number; y: number; heading: number; scale: number; isGold: boolean; phase: number },
  time: number,
) {
  context.save();
  context.translate(fish.x, fish.y);
  context.rotate(fish.heading);
  context.scale(fish.scale, fish.scale);
  context.globalAlpha = 0.96;
  context.filter = fish.isGold ? `hue-rotate(${GOLD_HUE}deg) saturate(1.18)` : 'none';
  context.imageSmoothingEnabled = true;
  const frame = (Math.floor((time / 1000) * 24) + fish.phase) % 104;
  const sourceX = (frame % 13) * 320;
  const sourceY = Math.floor(frame / 13) * 180;
  context.drawImage(image, sourceX, sourceY, 320, 180, -64, -36, 128, 72);
  context.restore();
}

export function drawBubble(context: CanvasRenderingContext2D, bubble: Bubble) {
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
