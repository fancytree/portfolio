import styles from './ResearchFlow.module.css';

/* Six months of sales records. Width is the number of orders; each return order is counted once,
 * by the closest match among its items: same item, new shade, familiar category, none of these. */
const ALL = 7354;
const returning = 4375;
const others = [
  { orders: 1651, label: '22% first order' },
  { orders: 1328, label: '18% walk-in' },
];
const matches = [
  { orders: 2673, share: '61%', label: 'the same item', tone: styles.same },
  { orders: 452, share: '10%', label: 'a new shade of a product', tone: styles.shade },
  { orders: 764, share: '17%', label: 'a familiar category', tone: styles.category },
  { orders: 486, share: '11%', label: 'only new categories', tone: styles.fresh },
];

const sum = (parts: { orders: number }[]) => parts.reduce((n, p) => n + p.orders, 0);

type Layout = {
  width: number; scale: number; bar: number;
  /* Left edges of the three columns, and the top of the first bar. */
  allX: number; midX: number; endX: number; allY: number;
  slot: number; gap: number;
  /* Space under the returning bar; narrow screens need the matches to clear the labels below. */
  drop: number;
  /* Narrow screens set each end label on two lines and the total above its bar. */
  narrow: boolean;
};
const wide: Layout = { width: 912, scale: 250, bar: 12, allX: 100, midX: 400, endX: 700, allY: 16, slot: 28, gap: 14, drop: 16, narrow: false };
const narrow: Layout = { width: 360, scale: 320, bar: 10, allX: 0, midX: 96, endX: 188, allY: 48, slot: 40, gap: 10, drop: 88, narrow: true };

function Diagram({ layout, className }: { layout: Layout; className: string }) {
  const { width, scale, bar, allX, midX, endX, allY, slot, gap, drop } = layout;
  const tall = (orders: number) => (orders * scale) / ALL;

  const mid = { y: 0, h: tall(returning) };
  const side = others.map((o, i) => ({ ...o, y: mid.h + drop + tall(sum(others.slice(0, i))) + 16 * i, h: tall(o.orders) }));
  /* Small bars keep a slot tall enough for their label. */
  const taken = (orders: number) => Math.max(tall(orders), slot) + gap;
  const ends = matches.map((m, i) => ({
    ...m, h: tall(m.orders),
    y: matches.slice(0, i).reduce((y, before) => y + taken(before.orders), 0),
    from: mid.y + tall(sum(matches.slice(0, i))),
  }));
  const last = ends[ends.length - 1];
  const height = Math.ceil(Math.max(side[side.length - 1].y + side[side.length - 1].h, last.y + Math.max(last.h, slot)));

  /* A band keeps its height from one bar to the next. */
  const band = (x0: number, y0: number, x1: number, y1: number, h: number) => {
    const half = (x0 + x1) / 2;
    return `M${x0},${y0}C${half},${y0} ${half},${y1} ${x1},${y1}V${y1 + h}C${half},${y1 + h} ${half},${y0 + h} ${x0},${y0 + h}Z`;
  };
  const branches = [{ ...mid, orders: returning, tone: styles.same }, ...side.map((s) => ({ ...s, tone: styles.fresh }))];
  const first = branches.map((node, i) => ({ ...node, start: allY + tall(sum(branches.slice(0, i))) }));
  const returnX = (allX + bar + midX) / 2;

  return (
    <svg className={`${styles.diagram} ${className}`} viewBox={`0 0 ${width} ${height}`} role="img"
      aria-label={`Of 7,354 orders, 59% were return orders, 22% first orders and 18% walk-in. Among return orders, ${matches.map((m) => `${m.share} included ${m.label}`).join(', ')}.`}>
      {first.map((n, i) => (
        <path key={n.y} className={`${styles.band} ${styles.split} ${n.tone} ${i === 0 ? styles.main : ''}`} d={band(allX + bar, n.start, midX, n.y, n.h)} />
      ))}
      {ends.map((n, i) => (
        <path key={n.label} className={`${styles.band} ${styles[`leaf${i}`]} ${n.tone}`} d={band(midX + bar, n.from, endX, n.y, n.h)} />
      ))}

      <rect className={styles.total} x={allX} y={allY} width={bar} height={tall(ALL)} rx={3} />
      <g className={styles.second}>
        <rect className={`${styles.node} ${styles.same}`} x={midX} y={mid.y} width={bar} height={mid.h} rx={3} />
        {side.map((s) => <rect key={s.label} className={`${styles.node} ${styles.fresh}`} x={midX} y={s.y} width={bar} height={s.h} rx={3} />)}
        {side.map((s) => <text key={s.label} className={styles.small} x={midX + bar + 12} y={s.y + s.h / 2 + 5}>{s.label}</text>)}
        <text className={styles.big} x={returnX} y={allY / 2 + mid.h / 2 + 4} textAnchor="middle">59%</text>
        <text className={styles.strong} x={returnX} y={allY / 2 + mid.h / 2 + 24} textAnchor="middle">return orders</text>
      </g>
      {layout.narrow ? (
        <>
          <text className={styles.number} x={0} y={16}>7,354</text>
          <text className={styles.muted} x={0} y={32}>orders</text>
        </>
      ) : (
        <>
          <text className={styles.number} x={allX - 12} y={allY + tall(ALL) / 2 - 2} textAnchor="end">7,354</text>
          <text className={styles.muted} x={allX - 12} y={allY + tall(ALL) / 2 + 18} textAnchor="end">orders</text>
        </>
      )}

      {ends.map((n, i) => {
        const x = endX + bar + (layout.narrow ? 8 : 12);
        const centre = n.y + n.h / 2;
        return (
          <g key={n.label} className={styles[`end${i}`]}>
            <rect className={`${styles.node} ${n.tone}`} x={endX} y={n.y} width={bar} height={n.h} rx={3} />
            {layout.narrow ? (
              <>
                <text className={styles.number} x={x} y={centre - 1}>{n.share}</text>
                <text className={styles.tiny} x={x} y={centre + 14}>{n.label}</text>
              </>
            ) : (
              <text className={styles.small} x={x} y={centre + 6}><tspan className={styles.share}>{n.share}</tspan> {n.label}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** Where the orders went, drawn once left to right. */
export function OrderFlow() {
  return (
    <div className={styles.orders}>
      <Diagram layout={wide} className={styles.wide} />
      <Diagram layout={narrow} className={styles.narrow} />
      <p className={styles.note}>Return order: the account had bought on an earlier day. Counted once, by its closest match. Includes in-store and staff-entered orders.</p>
    </div>
  );
}
