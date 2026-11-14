// Playground —— 卡片流：文字、媒体、小组件与可全屏展开的交互作品。
// 内容在 src/lib/playground-items.ts 维护。
// 版面跟首页一致：同一套页头页脚、字体和像素风卡片（river/river.module.css 的 token）。

import { playgroundItems } from '@/lib/playground-items';
import { plexMono } from '../river/fonts';
import river from '../river/river.module.css';
import { SiteFooter, SiteHeader } from '../river/SiteChrome';
import MasonryFeed from './MasonryFeed';
import PlaygroundCard from './PlaygroundCard';
import styles from './playground.module.css';

export const metadata = {
  title: 'Playground — Mei Chai',
};

export default function PlaygroundPage() {
  return (
    <div id="top" className={`${river.root} ${plexMono.variable} ${styles.root}`}>
      <a className={river.skip} href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className={`${river.container} ${styles.page}`}>
        <header className={styles.header}>
          <p className={river.label}>[ PLAYGROUND ]</p>
          <h1 className={river.h2}>Playground.</h1>
          <p className={river.lead}>Small experiments, fragments and things I like — no case study attached.</p>
        </header>

        <MasonryFeed>
          {playgroundItems.map((item, i) => (
            <div key={item.id} className={styles.cell} data-wide={item.wide || undefined}>
              <PlaygroundCard item={item} index={i} />
            </div>
          ))}
        </MasonryFeed>
      </main>

      <SiteFooter />
    </div>
  );
}
