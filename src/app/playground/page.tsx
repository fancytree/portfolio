// Playground —— 卡片流：文字、媒体、小组件与可全屏展开的交互作品。
// 内容在 src/lib/playground-items.ts 维护。

import { playgroundItems } from '@/lib/playground-items';
import MasonryFeed from './MasonryFeed';
import PlaygroundCard from './PlaygroundCard';
import styles from './playground.module.css';

export const metadata = {
  title: 'Playground — Mei Chai',
};

export default function PlaygroundPage() {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Playground</h1>
        <p>Small experiments, fragments and things I like — no case study attached.</p>
      </header>

      <MasonryFeed>
        {playgroundItems.map((item) => (
          <div key={item.id} className={styles.cell} data-wide={item.wide || undefined}>
            <PlaygroundCard item={item} />
          </div>
        ))}
      </MasonryFeed>
    </section>
  );
}
