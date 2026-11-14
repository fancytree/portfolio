// Playground 卡片流数据 —— 卡片内体验，沉浸式作品可全屏展开。
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
  // 没有状态可重置的组件（比如只是个链接）可以关掉右下角的重置按钮
  resettable?: boolean;
};

export type PlaygroundExperience = PlaygroundBase & {
  kind: 'experience';
  title: string;
  description: string;
  src: string;
  poster: string;
};

export type PlaygroundItem = PlaygroundQuote | PlaygroundImage | PlaygroundVideo | PlaygroundInteractive | PlaygroundExperience;

export const playgroundItems: PlaygroundItem[] = [
  {
    id: 'experience-river',
    kind: 'experience',
    title: 'River',
    description: 'A journey through water, light and time.',
    src: '/play/river/index.html',
    poster: '/play/river-cover.png',
    wide: true,
  },
  // 顺序即排布顺序：视觉卡片与引用交错放，让每一列都有图也有字、引用不会全挤在下面
  {
    id: 'interactive-designer-workstation',
    kind: 'interactive',
    component: 'designer-workstation',
  },
  {
    id: 'interactive-bubble-pop',
    kind: 'interactive',
    component: 'bubble-pop',
  },
  {
    id: 'interactive-project-button',
    kind: 'interactive',
    component: 'project-button',
    resettable: false,
  },
  {
    id: 'interactive-hold-checkbox',
    kind: 'interactive',
    component: 'hold-checkbox',
  },
  {
    // 同一期 Lenny's Podcast（约 32:23），他给团队的建议："Just do less… don't design it. If you don't have to, …"
    id: 'quote-ian-silber-do-less',
    kind: 'quote',
    text: "Just do less. Don't design it if you don't have to.",
    source: "Ian Silber, Head of Product Design at OpenAI, on Lenny's Podcast",
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
    id: 'interactive-torn-mesh',
    kind: 'interactive',
    component: 'torn-mesh',
  },
];
