import { Children, isValidElement, type ReactNode } from 'react';
import { CaseButton } from './CaseButton';
import CaseViewportVideo from './CaseViewportVideo';
import styles from './case-kit.module.css';
export { default as CaseInteractivePreview } from './CaseInteractivePreview';

export type CaseMetaItem = {
  label: string;
  value: ReactNode;
};

export type CaseStatItem = {
  value: string;
  label: string;
};

type CaseKitPageProps = {
  children: ReactNode;
};

type SpecProps = {
  /** 只在样式页传入，用来标出这一块的名字。正式案例留空。 */
  spec?: string;
};

function BlockSpec({ spec }: SpecProps) {
  if (!spec) return null;
  return <p className={styles.spec}>{spec}</p>;
}

/** 章节槽。导航留在外壳里，章节放这里，侧栏才能跟内容同一列高。 */
export function CaseKitSections({ children }: { children: ReactNode }) {
  return (
    <div className={styles.sections} data-case-sections>
      {children}
      <CaseEnd />
    </div>
  );
}

/** 整页外壳。侧边导航要放在这个节点里面，它才会找到章节。 */
export function CaseKitPage({ children }: CaseKitPageProps) {
  return (
    <div
      className={`case-kit mei-project-page ${styles.page}`}
    >
      {children}
    </div>
  );
}

type CaseHeroAction = {
  label: string;
  href: string;
  onClick?: () => void;
};

export type CaseGlanceItem = {
  label: string;
  body: string;
};

type CaseHeroGlance = {
  /** 小标题，默认 At a glance */
  label?: string;
  items: CaseGlanceItem[];
  deliverablesLabel?: string;
  deliverables?: string[];
};

type CaseHeroProps = {
  /** 标题上方的一行，例如 Portfolio · Case study · 6 min read */
  eyebrow: string;
  title: string;
  intro: string;
  meta: CaseMetaItem[];
  action?: CaseHeroAction;
  tags?: string[];
  /** 开场下半部分：挑战、做法、结果，以及一行交付物。 */
  glance?: CaseHeroGlance;
};

function HeroActionLink({ href, label, onClick }: CaseHeroAction) {
  return onClick
    ? <CaseButton className={styles.heroAction} onClick={onClick}>{label}</CaseButton>
    : <CaseButton className={styles.heroAction} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>{label}</CaseButton>;
}

/** 开场：眉题、标题、介绍、项目信息、按钮、标签，下半部分可接摘要卡。返回只放在左侧导航。 */
export function CaseHero({ eyebrow, title, intro, meta, action, tags, glance }: CaseHeroProps) {
  return (
    <section className={`mei-case-study-hero ${styles.heroColumn}`}>
      <div className={styles.column}>
        <div className={styles.heroCopy}>
          <p className={styles.heroKicker}>{eyebrow}</p>
          <h1 data-case-type="hero" className={`${styles.title} ${styles.heroTitle}`}>
            {title}
          </h1>
          <p className={styles.heroIntro}>{intro}</p>
        </div>
        <dl className={styles.heroFacts}>
          {meta.map((item) => (
            <div key={item.label}>
              <dt className={styles.heroFactLabel}>{item.label}</dt>
              <dd className={styles.heroFactValue}>{item.value}</dd>
            </div>
          ))}
        </dl>
        {action ? <HeroActionLink {...action} /> : null}
        {tags?.length ? (
          <ul className={styles.heroTags}>
            {tags.map((tag) => (
              <li key={tag} className={styles.heroTag}>
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
        {glance ? (
          <div className={styles.glance}>
            <h2 className={styles.glanceLabel}>{glance.label ?? 'At a glance'}</h2>
            <div className={styles.glanceCards}>
              {glance.items.map((item) => (
                <article key={item.label} className={styles.glanceCard}>
                  <p className={styles.glanceCardTitle}>{item.label}</p>
                  <p className={styles.glanceCardBody}>{item.body}</p>
                </article>
              ))}
            </div>
            {glance.deliverables?.length ? (
              <div className={styles.deliverables}>
                <p className={styles.deliverablesLabel}>{glance.deliverablesLabel ?? 'Deliverables'}</p>
                <ul className={styles.deliverableList}>
                  {glance.deliverables.map((item) => (
                    <li key={item} className={styles.deliverablePill}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

type CaseChapterProps = {
  /** 侧边导航和章节眉题共用，例如 01 / Context */
  label: string;
  title: string;
  lead?: string;
  children?: ReactNode;
};

/** 章节标题只有两层：眉题和一句标题。导语算正文，不进标题。 */
export function CaseChapter({ label, title, lead, children }: CaseChapterProps) {
  const blocks = Children.toArray(children);
  const firstBlock = blocks[0];
  const openingProse = isValidElement(firstBlock) && firstBlock.type === CaseProse ? blocks.shift() : null;
  return (
    <section className={styles.chapter} data-case-nav-label={label}>
      <div className={styles.column}>
        <div className={styles.stack}>
          <div className="case-text-group">
            <header className={styles.heading}>
              <p data-case-type="eyebrow" className={styles.eyebrow}>
                {label}
              </p>
              <h2 data-case-type="display" className={styles.title}>
                {title}
              </h2>
            </header>
            {lead ? (
              <p data-case-type="lead" className={styles.lead}>
                {lead}
              </p>
            ) : null}
            {openingProse}
          </div>
          {blocks}
        </div>
      </div>
    </section>
  );
}

type CaseProseProps = SpecProps & {
  children: ReactNode;
};

/** 正文栏。宽度锁在约 70 个字符，段落间距固定。 */
export function CaseProse({ spec, children }: CaseProseProps) {
  return (
    <div className={styles.prose} data-case-type="body">
      <BlockSpec spec={spec} />
      {children}
    </div>
  );
}

/** Short decisions or responsibilities, with decorative icons and visible labels. */
export function CaseEvidenceCards({ items, label }: {
  label: string;
  items: { icon: ReactNode; title: string; body: string }[];
}) {
  return (
    <ul className={styles.evidenceCards} aria-label={label}>
      {items.map((item) => (
        <li key={item.title} className={styles.evidenceCard}>
          <span className={styles.evidenceIcon} aria-hidden="true">{item.icon}</span>
          <h3 className={styles.evidenceTitle}>{item.title}</h3>
          <p className={styles.evidenceBody}>{item.body}</p>
        </li>
      ))}
    </ul>
  );
}

type CaseFigureProps = SpecProps & {
  caption: string;
  children: ReactNode;
};

/** Full-width video evidence, automatically played while visible. */
export function CaseVideo({ src, poster, caption, label, width, height }: {
  src: string;
  poster: string;
  caption: string;
  label: string;
  width: number;
  height: number;
}) {
  return (
    <CaseFigure caption={caption}>
      <CaseViewportVideo src={src} poster={poster} label={label} width={width} height={height} />
    </CaseFigure>
  );
}

/** Numbered narrative points, each with a heading and its own explanation. */
export function CaseSteps({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ol className={styles.steps}>
      {items.map((item, index) => (
        <li key={item.title} className={styles.step}>
          <h3 className={styles.stepTitle}>{index + 1}. {item.title}</h3>
          <p data-case-type="body" className={styles.stepBody}>{item.body}</p>
        </li>
      ))}
    </ol>
  );
}

/** 宽栏图。截图、图表、演示都放在 children，下面只留一行说明。 */
export function CaseFigure({ spec, caption, children }: CaseFigureProps) {
  return (
    <figure className={styles.figure}>
      <BlockSpec spec={spec} />
      <div className={styles.frame}>{children}</div>
      <figcaption data-case-type="caption" className={styles.caption}>
        {caption}
      </figcaption>
    </figure>
  );
}

type CaseStatsProps = SpecProps & {
  items: CaseStatItem[];
};

/** 短事实。数字和一句说明，不再做成一排色块卡片。 */
export function CaseStats({ spec, items }: CaseStatsProps) {
  return (
    <div>
      <BlockSpec spec={spec} />
      <dl className={styles.stats}>
        {items.map((item) => (
          <div key={item.label}>
            <dt className={styles.statLabel}>{item.label}</dt>
            <dd data-case-type="stat" className={styles.statValue}>{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

type CasePullquoteProps = SpecProps & {
  children: ReactNode;
};

/** 从正文里抬出来的一句结论。 */
export function CasePullquote({ spec, children }: CasePullquoteProps) {
  return (
    <div>
      <BlockSpec spec={spec} />
      <blockquote className={styles.quote}>
        <p data-case-type="quote-compact">{children}</p>
      </blockquote>
    </div>
  );
}

type CaseCloseProps = {
  label: string;
  title: string;
  children?: ReactNode;
};

/** 收束：这一篇留下的判断。页面末尾返回由 CaseEnd 统一处理。 */
export function CaseClose({ label, title, children }: CaseCloseProps) {
  return (
    <CaseChapter label={label} title={title}>
      {children}
    </CaseChapter>
  );
}

/** 所有案例共用的文末返回区，与 Hero 使用相同的分割线。 */
export function CaseEnd() {
  return (
    <div className={styles.end} data-case-end data-case-tone="default">
      <div className={styles.column}>
        <div className={styles.endInner}>
          <CaseButton variant="text" arrow="left" href="/#work">Back to work</CaseButton>
        </div>
      </div>
    </div>
  );
}

/** A local, independently scrollable device preview with the product's own chrome. */
export function CaseDevicePreview({ src, title }: { src: string; title: string }) {
  return <div className={styles.devicePreview}>
    <iframe className={styles.devicePreviewFrame} src={src} title={title} loading="lazy" sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer" />
  </div>;
}
