// 交互小组件注册表：新增一个交互卡片 = 在这里写一个组件并注册一个 id，
// 然后在 src/lib/playground-items.ts 中用 component: '<id>' 引用。

import type { ComponentType } from 'react';
import ReachOut from './ReachOut';
import TornMesh from './TornMesh';

export const interactiveComponents = {
  'torn-mesh': TornMesh,
  'reach-out': ReachOut,
} satisfies Record<string, ComponentType>;

export type InteractiveId = keyof typeof interactiveComponents;
