import styles from './DefMiniProgramCover.module.css';

const shot = (name: string) => `/img/def-miniprogram/${name}.webp`;

/** Three phones of the redesign. At rest it opens on Home; hovering the card fans them out
 *  and plays the middle one through choosing a shade and seeing what was added. */
export default function DefMiniProgramCover() {
  return (
    <div className={styles.cover}>
      {/* Decorative media: the enclosing project link provides its accessible name. */}
      {/* eslint-disable @next/next/no-img-element */}
      <div className={`${styles.phone} ${styles.left}`}>
        <img src={shot('tab-saved-v2')} alt="" />
      </div>
      <div className={`${styles.phone} ${styles.right}`}>
        <img src={shot('search')} alt="" />
      </div>
      <div className={`${styles.phone} ${styles.middle}`}>
        <img src={shot('home')} alt="" />
        <img className={styles.pick} src={shot('shade-pick')} alt="" />
        <img className={styles.added} src={shot('shade-added')} alt="" />
      </div>
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  );
}
