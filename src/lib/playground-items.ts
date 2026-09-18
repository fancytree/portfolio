// Playground 卡片流数据 —— 不跳详情页，每张卡片就是内容本身。
// 新增一张卡片：往 playgroundItems 里加一条即可，顺序即展示顺序。
// kind 决定卡片类型：quote 文字 / image 图片 / video 视频 / interactive 交互小组件。

import type { InteractiveId } from '@/app/playground/interactive';

type PlaygroundBase = {
  id: string;
  // 横跨两列的大卡片（单列的窄屏上自动回到一列）
  wide?: boolean;
};

export type PlaygroundQuote = PlaygroundBase & {
  kind: 'quote';
  text: string;
  source?: string;
};

export type PlaygroundImage = PlaygroundBase & {
  kind: 'image';
  src: string;
  alt: string;
  // 原图宽高，用于在图片加载前占好位置，避免瀑布流跳动
  width: number;
  height: number;
};

export type PlaygroundVideo = PlaygroundBase & {
  kind: 'video';
  src: string;
  poster?: string;
  width: number;
  height: number;
};

export type PlaygroundInteractive = PlaygroundBase & {
  kind: 'interactive';
  // 对应 src/app/playground/interactive/index.ts 中注册的组件
  component: InteractiveId;
  // 舞台宽高比，默认 1（正方形）
  aspectRatio?: number;
};

export type PlaygroundItem = PlaygroundQuote | PlaygroundImage | PlaygroundVideo | PlaygroundInteractive;

// 以下为占位内容，先把布局撑起来，之后替换成真实素材。
export const playgroundItems: PlaygroundItem[] = [
  {
    id: 'interactive-torn-mesh',
    kind: 'interactive',
    component: 'torn-mesh',
  },
  {
    id: 'image-mei-wave',
    kind: 'image',
    src: '/meiwave.gif',
    alt: 'A hand-drawn girl with an orange bow waving hello',
    width: 844,
    height: 608,
  },
  {
    // 摘自 Lenny's Podcast 访谈（约 22:22–27:34 与 32:23），去掉口头语、用省略号拼接原句
    id: 'quote-ian-silber',
    kind: 'quote',
    text: "I think it already is an incredible product designer. That doesn't necessarily mean that it's the best visual designer, or best at information hierarchy, or even interaction design. … Truly understanding what people need. Inventing something new. Somebody had a point of view about this. … Just do less. Don't design it if you don't have to.",
    source: "Ian Silber, Head of Product Design at OpenAI, on Lenny's Podcast",
  },
  {
    id: 'quote-simplicity',
    kind: 'quote',
    text: 'Placeholder quote — something I keep coming back to when a design feels too loud.',
    source: 'Someone wise',
  },
  {
    id: 'image-memq',
    kind: 'image',
    src: '/img/MemQ/Cover.png',
    alt: 'MemQ cover placeholder',
    width: 3200,
    height: 2400,
  },
  {
    id: 'video-memq',
    kind: 'video',
    src: '/img/MemQ Video.mp4',
    width: 334,
    height: 720,
  },
  {
    id: 'quote-short',
    kind: 'quote',
    text: 'Make it work, then make it calm.',
  },
  {
    id: 'image-mono',
    kind: 'image',
    src: '/img/Mono/mono-cover-cutout.png',
    alt: 'Mono cover placeholder',
    width: 1672,
    height: 941,
  },
  {
    id: 'interactive-squish',
    kind: 'interactive',
    component: 'squish-button',
    aspectRatio: 4 / 3,
  },
  {
    id: 'quote-long',
    kind: 'quote',
    text: 'Placeholder for a longer thought. Quotes can run a few lines — the card grows with the text, and the masonry column absorbs the height.',
    source: 'Notebook, 2026',
  },
];
