/**
 * A product screenshot with a line from each marked place to what it is for. On narrow
 * screens the lines go and the notes sit under the screenshot.
 */
import { useId, type CSSProperties } from 'react';
import Image from 'next/image';
import styles from './Visual.module.css';

export type Note = {
  title: string;
  body: string;
  /** left, top, width, height on the screenshot, in the page's own 1440 × 900. */
  box: readonly [number, number, number, number];
  /** Which side of the screenshot the note sits on. */
  side: 'top' | 'right' | 'bottom';
  /** For a note on top: its text ends at the line instead of starting there. */
  endAtLine?: boolean;
};

// The drawing everything is laid out on: the screenshot, room to its right, and room
// above or below only when a note goes there.
const W = 1760;
const ABOVE = 150;
const BELOW = 130;
const RIGHT_AT = 1492;

const pc = (v: number, of: number) => `${(v / of) * 100}%`;

function place({ box: [x, y, w, h], side, endAtLine }: Note, top: number, H: number) {
  const cx = x + w / 2;
  if (side === 'right') {
    const cy = y + h / 2 + top;
    return { line: [x + w, cy, RIGHT_AT - 8, cy], at: { left: pc(RIGHT_AT, W), top: pc(cy - 34, H), width: pc(W - RIGHT_AT, W) } };
  }
  if (side === 'bottom') {
    const end = top + 900 + 18;
    return { line: [cx, y + h + top, cx, end], at: { left: pc(cx - 24, W), top: pc(end + 8, H), width: pc(500, W) } };
  }
  const at = endAtLine ? { right: pc(W - cx - 24, W) } : { left: pc(cx - 24, W) };
  return { line: [cx, y + top, cx, 118], at: { ...at, bottom: pc(H - 112, H), width: pc(400, W), textAlign: endAtLine ? 'right' as const : undefined } };
}

export default function AnnotatedShot({ src, alt, notes, caption, tour }: {
  src: string; alt: string; notes: readonly Note[]; caption: string;
  /** Set when the guided tour stops here: it frames the screen alone. */
  tour?: string;
}) {
  const mask = useId();
  const top = notes.some((n) => n.side === 'top') ? ABOVE : 0;
  const H = top + 900 + (notes.some((n) => n.side === 'bottom') ? BELOW : 0);
  const placed = notes.map((note) => ({ ...note, ...place(note, top, H) }));
  return (
    <figure className={styles.entries}>
      <div className={styles.map} style={{ '--drawing-height': H, '--drawing-top': top } as CSSProperties}>
        <div data-mei-tour={tour} className={styles.shot}>
          <Image src={src} width={2880} height={1800} sizes="(min-width: 900px) 920px, 100vw" alt={alt} />
          <svg viewBox="0 0 1440 900" aria-hidden="true">
            <defs>
              <mask id={mask}>
                <rect width="1440" height="900" fill="white" />
                {notes.map(({ title, box: [x, y, w, h] }) => <rect key={title} x={x} y={y} width={w} height={h} rx="10" fill="black" />)}
              </mask>
            </defs>
            <rect className={styles.dim} width="1440" height="900" mask={`url(#${mask})`} />
            {notes.map(({ title, box: [x, y, w, h] }) => <rect key={title} className={styles.mark} x={x} y={y} width={w} height={h} rx="10" />)}
          </svg>
        </div>
        <svg className={styles.leads} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          {placed.map(({ title, line: [x1, y1, x2, y2] }) => (
            <g key={title}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} />
              <circle cx={x1} cy={y1} r="5" />
            </g>
          ))}
        </svg>
        <ul className={styles.notes}>
          {placed.map(({ title, body, at }) => (
            <li key={title} style={at}>
              <p className={styles.entryTitle}>{title}</p>
              <p>{body}</p>
            </li>
          ))}
        </ul>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
