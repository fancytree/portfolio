'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './MiniProgramScreens.module.css';

/** The width each screen is laid out at; the frame is then scaled down as a whole. */
const DESIGN_WIDTH = 320;
const DESIGN_HEIGHT = Math.round((DESIGN_WIDTH * 874) / 402);

function Screen({ id, caption }: { id: string; caption: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const element = box.current!;
    const fit = () => setScale(element.clientWidth / DESIGN_WIDTH);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <figure className={styles.item}>
      <div ref={box} className={styles.box}>
        {scale ? <iframe className={styles.frame} style={{ width: DESIGN_WIDTH, height: DESIGN_HEIGHT, transform: `scale(${scale})` }} src={`/demos/def-mini-program/screen.html?screen=${id}`} title={`DEF mini-program — ${caption.split(' — ')[0]}`} loading="lazy" sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer" /> : null}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/** The customer screens, four to a row on a wide page. */
export default function MiniProgramScreens({ screens }: { screens: { id: string; caption: string }[] }) {
  return (
    <div className={styles.grid} aria-label="WeChat mini-program screens">
      {screens.map((screen) => <Screen key={screen.id} {...screen} />)}
    </div>
  );
}
