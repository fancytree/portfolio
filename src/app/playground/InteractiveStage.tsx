'use client';

// 交互卡片的舞台：渲染交互组件，右下角是“可交互”小标志和重置按钮。
// 重置 = 换 key 让组件重新挂载，所有交互组件都自动支持，不需要各自实现。

import { useState } from 'react';
import { MousePointer2, RotateCcw } from 'lucide-react';
import { interactiveComponents, type InteractiveId } from './interactive';
import styles from './playground.module.css';

type Props = { component: InteractiveId; aspectRatio?: number; resettable?: boolean };

export default function InteractiveStage({ component, aspectRatio = 1, resettable = true }: Props) {
  const [version, setVersion] = useState(0);
  const Component = interactiveComponents[component];

  return (
    <div className={styles.stage} style={{ aspectRatio }}>
      <Component key={version} />
      <div className={styles.stageControls}>
        {resettable && (
          <button type="button" className={styles.resetButton} onClick={() => setVersion((v) => v + 1)} aria-label="Reset" title="Reset">
            <RotateCcw size={12} strokeWidth={2} aria-hidden />
          </button>
        )}
        {/* 提示这张卡片可以玩 */}
        <span className={styles.interactiveBadge} aria-label="Interactive" title="Interactive">
          <MousePointer2 size={12} strokeWidth={2} aria-hidden />
        </span>
      </div>
    </div>
  );
}
