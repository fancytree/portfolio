'use client';

// The experiments list. Rows are plain links; hovering one (or focusing it with the
// keyboard) brings up a small floating window with that project's picture. With
// a mouse the window trails the pointer; with the keyboard it sits beside the row.
//
// All pictures are mounted once and cross-fade, so moving down the list never
// shows an empty frame while an image loads.

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { RiverProject } from "./content";
import s from "./river.module.css";

const WIDTH = 340;
const HEIGHT = 250; // title bar + picture
const GAP = 22; // distance from the pointer

export default function MoreList({ items }: { items: RiverProject[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [shown, setShown] = useState(0); // the picture last shown, kept while the window fades out
  const windowRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const place = useRef({ x: 0, y: 0, set: false });

  useEffect(() => {
    const el = windowRef.current;
    if (!el || active === null) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const tick = () => {
      const p = place.current;
      const k = still || !p.set ? 1 : 0.16; // ease toward the pointer; snap on first show
      p.x += (target.current.x - p.x) * k;
      p.y += (target.current.y - p.y) * k;
      p.set = true;
      // lean a little into the direction of travel
      const lean = still ? 0 : Math.max(-5, Math.min(5, (target.current.x - p.x) * 0.06));
      el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) rotate(${lean.toFixed(2)}deg)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active]);

  // keep the window on screen: to the right of and below the pointer, flipping at the edges
  const aim = (x: number, y: number) => {
    const left = x + GAP + WIDTH > window.innerWidth - 12 ? x - GAP - WIDTH : x + GAP;
    const top = Math.min(window.innerHeight - HEIGHT - 12, Math.max(92, y - HEIGHT / 2));
    target.current = { x: left, y: top };
  };
  const show = (i: number) => {
    setActive(i);
    setShown(i);
  };
  const hide = () => {
    setActive(null);
    place.current.set = false;
  };

  return (
    <>
      <ul className={s.moreList} onPointerLeave={hide}>
        {items.map((p, i) => (
          <li key={p.title}>
            <a
              href={p.href}
              {...(p.external ? { target: "_blank", rel: "noreferrer" } : {})}
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                aim(e.clientX, e.clientY);
                show(i);
              }}
              onPointerMove={(e) => {
                if (e.pointerType === "mouse") aim(e.clientX, e.clientY);
              }}
              onFocus={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                aim(r.left + r.width * 0.55, r.top + r.height / 2);
                show(i);
              }}
              onBlur={hide}
            >
              <span className={s.moreTitle}>{p.title}</span>
              <span className={s.moreBody}>{p.description}</span>
              <span className={s.moreMeta}>
                {p.tags.join(" · ")} · {p.time}
              </span>
              <span className={s.cardArrow} aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>

      {/* decorative: the link text already names the project */}
      <div ref={windowRef} className={s.peek} data-open={active !== null || undefined} aria-hidden="true">
        <div className={s.peekBar}>
          <span>{String(shown + 1).padStart(2, "0")}</span>
          <span>{items[shown]?.title}</span>
          <span className={s.peekDots}>
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className={s.peekFrame}>
          {items.map((p, i) => (
            <Image key={p.title} src={p.image} alt="" fill sizes="340px" data-on={i === shown || undefined} />
          ))}
        </div>
      </div>
    </>
  );
}
