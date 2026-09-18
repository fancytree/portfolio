// 单张 Playground 卡片：按 kind 渲染不同内容，统一的外框 + 可选的说明行。

import Image from 'next/image';
import type { PlaygroundItem } from '@/lib/playground-items';
import { interactiveComponents } from './interactive';
import PlaygroundVideo from './PlaygroundVideo';
import styles from './playground.module.css';

function CardBody({ item }: { item: PlaygroundItem }) {
  switch (item.kind) {
    case 'quote':
      return (
        <blockquote className={styles.quote}>
          <p>{item.text}</p>
          {item.source && <cite>— {item.source}</cite>}
        </blockquote>
      );
    case 'image':
      return (
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      );
    case 'video':
      return <PlaygroundVideo src={item.src} poster={item.poster} width={item.width} height={item.height} />;
    case 'interactive': {
      const Component = interactiveComponents[item.component];
      return (
        <div className={styles.stage} style={{ aspectRatio: item.aspectRatio ?? 1 }}>
          <Component />
        </div>
      );
    }
  }
}

export default function PlaygroundCard({ item }: { item: PlaygroundItem }) {
  const hasMeta = item.caption || item.tag;
  return (
    <article className={styles.card} data-kind={item.kind}>
      <div className={styles.media}>
        <CardBody item={item} />
      </div>
      {hasMeta && (
        <footer className={styles.meta}>
          {item.caption && <span>{item.caption}</span>}
          {item.tag && <span className={styles.tag}>{item.tag}</span>}
        </footer>
      )}
    </article>
  );
}
