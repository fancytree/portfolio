// 交互小组件注册表：新增一个交互卡片 = 在这里写一个组件并注册一个 id，
// 然后在 src/lib/playground-items.ts 中用 component: '<id>' 引用。

import type { ComponentType } from 'react';
import DotField from './DotField';
import SquishButton from './SquishButton';

export const interactiveComponents = {
  'dot-field': DotField,
  'squish-button': SquishButton,
} satisfies Record<string, ComponentType>;

export type InteractiveId = keyof typeof interactiveComponents;
