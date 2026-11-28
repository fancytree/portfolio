/**
 * The review as three screens joined by what the buyer presses: the Agent's review,
 * the buyer's note, and what the next plan learns. The first and last show only the
 * right of the screen, side by side; the review dialog sits whole beneath them.
 * On narrow screens they stack in order, each with its notes under it.
 */
import { useId } from 'react';
import Image from 'next/image';
import styles from './Visual.module.css';

type Rect = readonly [number, number, number, number];
type Note = { title: string; body: string; box: Rect; side?: 'top' | 'bottom' };
type Screen = {
  step: string;
  src: string;
  alt: string;
  /** The part of the 1440 × 900 screen shown. */
  crop: Rect;
  /** Where it sits on the drawing, and how large. */
  x: number; y: number; scale: number;
  /** Where the notes on its right start, and how wide they may be. */
  notesAt: number;
  notesWidth: number;
  /** Where the step's name sits, if not above the screen's left edge. */
  stepAt?: number;
  /** Set when the guided tour stops on this screen. */
  tour?: string;
  notes: Note[];
};

const W = 1960;
const H = 2090;

const SCREENS: Screen[] = [
  {
    step: '1 · The Agent reviews',
    tour: 'review',
    src: '/img/procurement-agent/entry/review-agent.webp',
    alt: 'A received order with the Agent’s review: 89% accurate, accuracy by product, and the supplier’s accuracy moving from 81% to 83%.',
    crop: [946, 0, 494, 900], x: 0, y: 150, scale: 1, notesAt: 510, notesWidth: 336,
    notes: [
      { title: 'The Agent reviews first', body: 'It scores the finished order from the data.', box: [1123, 119, 281, 112] },
      { title: 'Product by product', body: 'What was planned against what was needed.', box: [1123, 240, 281, 262] },
      { title: 'The score moves', body: 'One more reviewed order updates this supplier.', box: [1123, 512, 281, 54] },
    ],
  },
  {
    step: '2 · The user adds evidence',
    tour: 'review-note',
    src: '/img/procurement-agent/entry/review-buyer.webp',
    alt: 'The review dialog: the largest gaps, a note about salons reporting chipping, and the product and action recognised from it.',
    crop: [0, 0, 1440, 900], x: 310, y: 1210, scale: 1200 / 1440, notesAt: 1540, notesWidth: 330,
    notes: [
      { title: 'Where to look', body: 'The largest gaps come first.', box: [405, 330, 630, 180] },
      { title: 'In their own words', body: 'Room for what sales data can’t show, like a complaint.', box: [405, 542, 630, 138] },
      { title: 'Read back to the user', body: 'The note becomes a product and an action the user can check.', box: [405, 686, 272, 34], side: 'bottom' },
    ],
  },
  {
    step: '3 · The next plan learns',
    tour: 'review-learned',
    src: '/img/procurement-agent/entry/review-learned.webp',
    alt: 'After saving, the Agent lists what changes in the next plan from the ratings and notes, with rule changes waiting to be published.',
    crop: [836, 0, 604, 900], x: 1070, y: 150, scale: 1, notesAt: 1694, notesWidth: 266, stepAt: 1440,
    notes: [
      { title: 'The review counts', body: 'The order is marked reviewed, with its accuracy.', box: [853, 117, 168, 26], side: 'top' },
      { title: 'What changes next', body: 'Coverage, lead time and products, from what the user said.', box: [1123, 404, 281, 232] },
      { title: 'The user publishes rules', body: 'A learned change waits until someone approves it.', box: [1123, 652, 281, 78] },
    ],
  },
];

/** From one screen to the next, named after the button that takes you there. */
const JUMPS = [
  // "Write review", on the first screen, opens the dialog.
  { label: 'Write review', path: 'M236 852 V1130 H610 V1204', at: [423, 1130] },
  // "Save review", in the dialog, leads to what changes next.
  { label: 'Save review', path: 'M1160 1210 V1058', at: [1160, 1130] },
] as const;

const pc = (v: number, of: number) => `${(v / of) * 100}%`;

/** A point on the screen, as a point on the drawing. */
const onDrawing = ({ crop: [cx, cy], x, y, scale }: Screen, px: number, py: number) => [x + (px - cx) * scale, y + (py - cy) * scale] as const;

function place(screen: Screen, note: Note) {
  const [bx, by, bw, bh] = note.box;
  const bottom = screen.y + screen.crop[3] * screen.scale;
  if (note.side === 'top') {
    const [cx, cy] = onDrawing(screen, bx + bw / 2, by);
    return { line: [cx, cy, cx, screen.y - 32], style: { left: pc(cx - 24, W), bottom: pc(H - screen.y + 38, H), width: pc(400, W) } };
  }
  if (note.side === 'bottom') {
    const [cx, cy] = onDrawing(screen, bx + bw / 2, by + bh);
    return { line: [cx, cy, cx, bottom + 18], style: { left: pc(cx - 24, W), top: pc(bottom + 26, H), width: pc(480, W) } };
  }
  const [x, y] = onDrawing(screen, bx + bw, by + bh / 2);
  return { line: [x, y, screen.notesAt - 8, y], style: { left: pc(screen.notesAt, W), top: pc(y - 34, H), width: pc(screen.notesWidth, W) } };
}

export default function ReviewFlow() {
  const id = useId();
  return (
    <figure className={styles.entries}>
      <div className={styles.flow}>
        {SCREENS.map((screen, n) => {
          const [cx, cy, cw, ch] = screen.crop;
          return (
            <div key={screen.step} className={styles.stage}>
              <p className={styles.step} style={{ left: pc(screen.stepAt ?? screen.x, W), bottom: pc(H - screen.y + 8, H) }}>{screen.step}</p>
              <div data-mei-tour={screen.tour} className={styles.screen} style={{ left: pc(screen.x, W), top: pc(screen.y, H), width: pc(cw * screen.scale, W), aspectRatio: `${cw} / ${ch}` }}>
                <Image src={screen.src} width={2880} height={1800} sizes="(min-width: 900px) 1000px, 250vw" alt={screen.alt}
                  style={{ width: pc(1440, cw), left: pc(-cx, cw), top: pc(-cy, ch) }} />
                <svg viewBox={screen.crop.join(' ')} aria-hidden="true">
                  <defs>
                    <mask id={`${id}-${n}`}>
                      <rect x={cx} y={cy} width={cw} height={ch} fill="white" />
                      {screen.notes.map(({ title, box: [x, y, w, h] }) => <rect key={title} x={x} y={y} width={w} height={h} rx="10" fill="black" />)}
                    </mask>
                  </defs>
                  <rect className={styles.dim} x={cx} y={cy} width={cw} height={ch} mask={`url(#${id}-${n})`} />
                  {screen.notes.map(({ title, box: [x, y, w, h] }) => <rect key={title} className={styles.mark} x={x} y={y} width={w} height={h} rx="10" />)}
                </svg>
              </div>
              <ul className={styles.notes}>
                {screen.notes.map((note) => (
                  <li key={note.title} style={place(screen, note).style}>
                    <p className={styles.entryTitle}>{note.title}</p>
                    <p>{note.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        <svg className={styles.leads} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <defs>
            <marker id={`${id}-go`} markerWidth="14" markerHeight="14" refX="11" refY="7" orient="auto" markerUnits="userSpaceOnUse">
              <path className={styles.arrow} d="M0 0 L13 7 L0 14 Z" />
            </marker>
          </defs>
          {SCREENS.flatMap((screen) => screen.notes.map((note) => {
            const [x1, y1, x2, y2] = place(screen, note).line;
            return (
              <g key={note.title}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} />
                <circle cx={x1} cy={y1} r="5" />
              </g>
            );
          }))}
          {JUMPS.map(({ label, path }) => <path key={label} className={styles.jump} d={path} markerEnd={`url(#${id}-go)`} />)}
        </svg>
        {JUMPS.map(({ label, at: [x, y] }) => (
          <span key={label} className={styles.jumpName} style={{ left: pc(x, W), top: pc(y, H) }}>{label}</span>
        ))}
      </div>
      <figcaption>The review runs in three screens, and what is learned goes into the next plan.</figcaption>
    </figure>
  );
}
