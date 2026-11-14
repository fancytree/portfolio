// 单张 Playground 卡片：按 kind 渲染不同内容，卡片外不放任何文字信息。

import Image from 'next/image';
import type { PlaygroundItem } from '@/lib/playground-items';
import InteractiveStage from './InteractiveStage';
import PlaygroundVideo from './PlaygroundVideo';
import FullscreenExperience from './FullscreenExperience';
import styles from './playground.module.css';

function CardBody({ item }: { item: PlaygroundItem }) {
  switch (item.kind) {
    case 'experience':
      return <FullscreenExperience item={item} />;
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

// what the title bar calls each kind of card
const KIND: Record<PlaygroundItem['kind'], string> = {
  experience: 'Experience',
  quote: 'Note',
  image: 'Image',
  video: 'Video',
  interactive: 'Interactive',
};

export default function PlaygroundCard({ item, index }: { item: PlaygroundItem; index: number }) {
  return (
    <article className={styles.card} data-kind={item.kind}>
      {/* a window's title bar, as on the homepage's work cards: index, kind, three squares */}
      <div className={styles.cardBar} aria-hidden="true">
        <span className={styles.cardNo}>{String(index + 1).padStart(2, '0')}</span>
        <span>{KIND[item.kind]}</span>
        <span className={styles.cardSquares}>
          <i />
          <i />
          <i />
        </span>
      </div>
      <CardBody item={item} />
    </article>
  );
}
