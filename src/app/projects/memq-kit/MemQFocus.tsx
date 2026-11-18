'use client';

/*
 * A screen zoomed in on the part a decision is about, annotated the way a product
 * page would: a dot on the element and a hairline out to a label in the margin, level
 * with what it describes. Labels go to the side their element is nearest, so no line
 * crosses another element. On a narrow screen there is no margin, so the dots carry
 * numbers and the labels are listed under the crop.
 * All coordinates are in the app's own 402-point-wide screen.
 */

import Image from 'next/image';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import z from './MemQFocus.module.css';

export type Box = { x: number; y: number; w: number; h: number };
export type Note = { box: Box; label: string; side?: 'left' | 'right' };

const GUTTER = 150;
const NARROW = 560;
const GAP = 10;

export function Focus({ region, notes, src, srcHeight, alt, children }: {
  /** The part of the 402-wide screen to show. */
  region: Box;
  notes: Note[];
  /** A captured screen, drawn 402 wide… */
  src?: string; srcHeight?: number; alt?: string;
  /** …or a live one, rendered at 402 × 874. */
  children?: ReactNode;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const lines = useRef<(SVGPolylineElement | null)[]>([]);
  const [width, setWidth] = useState(0);
  const sides = notes.map((n) => n.side ?? 'right');
  const hasLeft = sides.includes('left'), hasRight = sides.includes('right');
  const narrow = width > 0 && width < NARROW;
  const gl = narrow || !hasLeft ? 0 : GUTTER, gr = narrow || !hasRight ? 0 : GUTTER;
  const cropW = Math.max(0, width - gl - gr);
  const scale = cropW / region.w;
  const cropH = region.h * scale;

  // Where each element is pointed at, in stage pixels.
  const anchors = notes.map((n, i) => {
    const x = sides[i] === 'left' ? n.box.x + 6 : n.box.x + n.box.w - 6;
    return { x: gl + (x - region.x) * scale, y: (n.box.y + n.box.h / 2 - region.y) * scale };
  });
  const key = `${width}|${notes.map((n) => n.label).join('|')}`;

  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const fit = () => setWidth(el.clientWidth);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Labels sit level with their dots, then are pushed apart on each side so none overlap.
  // Their heights are only known once drawn, so the result is written straight to the
  // labels and their lines before paint.
  useLayoutEffect(() => {
    if (!width || narrow) return;
    const ys = anchors.map((a) => a.y);
    for (const side of ['left', 'right'] as const) {
      const idx = notes.map((_, i) => i).filter((i) => sides[i] === side).sort((a, b) => anchors[a].y - anchors[b].y);
      let floor = 0;
      for (const i of idx) {
        const h = labels.current[i]?.offsetHeight ?? 36;
        const top = Math.max(anchors[i].y - h / 2, floor);
        ys[i] = top + h / 2;
        floor = top + h + GAP;
      }
    }
    ys.forEach((y, i) => {
      const label = labels.current[i], line = lines.current[i];
      if (label) label.style.top = `${y}px`;
      const a = anchors[i];
      const edge = sides[i] === 'left' ? gl - 4 : gl + cropW + 4;
      const end = sides[i] === 'left' ? gl - 16 : gl + cropW + 16;
      line?.setAttribute('points', `${a.x},${a.y} ${edge},${a.y} ${end},${y}`);
    });
    // The anchors are derived from `key`; listing them would re-run on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, narrow]);

  return (
    <div className={z.focus}>
      <div ref={stage} className={z.stage} style={{ height: cropH || undefined }}>
        <div className={z.crop} style={{ left: gl, width: cropW, height: cropH }}>
          <div className={z.scene} style={{ transform: `scale(${scale}) translate(${-region.x}px, ${-region.y}px)`, opacity: width ? 1 : 0 }} aria-hidden={!src}>
            {src ? <Image src={src} alt={alt ?? ''} width={402} height={srcHeight ?? 874} sizes="(min-width: 900px) 520px, 100vw" className={z.shot} /> : children}
          </div>
        </div>
        {width > 0 && !narrow && (
          <svg className={z.lines} width={width} height={cropH} aria-hidden="true">
            {notes.map((n, i) => {
              const a = anchors[i];
              const ly = a.y;
              const edge = sides[i] === 'left' ? gl - 4 : gl + cropW + 4;
              const end = sides[i] === 'left' ? gl - 16 : gl + cropW + 16;
              return <polyline key={n.label} ref={(el) => { lines.current[i] = el; }} points={`${a.x},${a.y} ${edge},${a.y} ${end},${ly}`} className={z.line} />;
            })}
          </svg>
        )}
        {width > 0 && notes.map((n, i) => (
          <span key={n.label} className={z.dot} style={{ left: anchors[i].x, top: anchors[i].y, animationDelay: `${i * 0.2}s` }} aria-hidden="true">
            {narrow ? i + 1 : null}
          </span>
        ))}
        {width > 0 && !narrow && notes.map((n, i) => (
          <span key={n.label} ref={(el) => { labels.current[i] = el; }}
            className={`${z.label} ${sides[i] === 'left' ? z.labelLeft : ''}`}
            style={sides[i] === 'left'
              ? { right: width - gl + 20, width: GUTTER - 24, top: anchors[i].y }
              : { left: gl + cropW + 20, width: GUTTER - 24, top: anchors[i].y }}>
            {n.label}
          </span>
        ))}
      </div>
      {narrow && (
        <ol className={z.notes}>
          {notes.map((n, i) => <li key={n.label}><b className={z.num}>{i + 1}</b><span>{n.label}</span></li>)}
        </ol>
      )}
    </div>
  );
}
