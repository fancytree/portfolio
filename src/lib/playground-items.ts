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
  // 没有状态可重置的组件（比如只是个链接）可以关掉右下角的重置按钮
  resettable?: boolean;
};

export type PlaygroundItem = PlaygroundQuote | PlaygroundImage | PlaygroundVideo | PlaygroundInteractive;

export const playgroundItems: PlaygroundItem[] = [
  // 顺序即排布顺序：视觉卡片与引用交错放，让每一列都有图也有字、引用不会全挤在下面
  {
    id: 'interactive-torn-mesh',
    kind: 'interactive',
    component: 'torn-mesh',
  },
  {
    id: 'interactive-bubble-pop',
    kind: 'interactive',
    component: 'bubble-pop',
    aspectRatio: 4 / 5,
  },
  {
    // 同一期 Lenny's Podcast（约 32:23），他给团队的建议："Just do less… don't design it. If you don't have to, …"
    id: 'quote-ian-silber-do-less',
    kind: 'quote',
    text: "Just do less. Don't design it if you don't have to.",
    source: "Ian Silber, Head of Product Design at OpenAI, on Lenny's Podcast",
  },
  {
    // 同一期 Lenny's Podcast（约 22:22–27:34），他讲人类还剩下什么时的原句
    id: 'quote-ian-silber-feedback',
    kind: 'quote',
    text: 'The human feedback loop of watching people use something and understanding that.',
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
    id: 'interactive-reach-out',
    kind: 'interactive',
    component: 'reach-out',
    resettable: false,
  },
  {
    // 摘自 Lenny's Podcast 访谈（约 22:22–27:34），去掉口头语、用省略号拼接原句
    id: 'quote-ian-silber',
    kind: 'quote',
    text: "I think it already is an incredible product designer. That doesn't necessarily mean that it's the best visual designer, or best at information hierarchy, or even interaction design. … Truly understanding what people need. Inventing something new. Somebody had a point of view about this.",
    source: "Ian Silber, Head of Product Design at OpenAI, on Lenny's Podcast",
  },
  {
    // Lenny's Podcast《AI's third era: the rise of persistent AI coworkers》开场（00:00）的原句
    id: 'quote-tara-seshan-third-era',
    kind: 'quote',
    text: 'That third era that might come soon is how do you work with a persistent coworker who is able to get things done with you?',
    source: "Tara Seshan, Product Lead for ChatGPT Work at OpenAI, on Lenny's Podcast",
  },
  {
    // 同一期 Lenny's Podcast（约 27:39）的原句
    id: 'quote-tara-seshan-build-horizon',
    kind: 'quote',
    text: 'You fail if you build for where the models are now. You fail if you build for where you think the models will be in a year. Both outcomes are equally wrong.',
    source: "Tara Seshan, Product Lead for ChatGPT Work at OpenAI, on Lenny's Podcast",
  },
];
