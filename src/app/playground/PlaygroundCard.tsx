// 单张 Playground 卡片：按 kind 渲染不同内容，卡片外不放任何文字信息。

import Image from 'next/image';
import type { PlaygroundItem } from '@/lib/playground-items';
import InteractiveStage from './InteractiveStage';
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
    case 'interactive':
      return <InteractiveStage component={item.component} aspectRatio={item.aspectRatio} resettable={item.resettable} />;
  }
}

export default function PlaygroundCard({ item }: { item: PlaygroundItem }) {
  return (
    <article className={styles.card} data-kind={item.kind}>
      <CardBody item={item} />
    </article>
  );
}
