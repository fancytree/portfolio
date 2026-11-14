import styles from './DefDecisions.module.css';

/* Evidence: DEF 调研分析报告 v1.0 §2 (function audit of both legacy systems). */
type Level = 'full' | 'weak' | 'none';
const pct: Record<Level, number> = { full: 100, weak: 50, none: 0 };
const levelText: Record<Level, string> = { full: 'Complete', weak: 'Partial', none: 'Missing' };

const onlyWechat = ['Online sales', 'Promotions', 'Storefront'];
const onlyMpsoft = ['Inventory', 'Purchasing', 'Suppliers', 'In-store POS'];
const both: { domain: string; a: Level; b: Level }[] = [
  { domain: 'Products', a: 'full', b: 'full' },
  { domain: 'Customers', a: 'full', b: 'weak' },
  { domain: 'Finance', a: 'weak', b: 'full' },
  { domain: 'Analytics', a: 'full', b: 'weak' },
  { domain: 'Permissions', a: 'weak', b: 'full' },
];

function Bar({ label, level }: { label: string; level: Level }) {
  return (
    <span className={styles.barRow}>
      <span className={styles.barLabel}>{label}</span>
      <span className={styles.bar} role="img" aria-label={`${label}: ${levelText[level]}`}><span className={styles.barFill} style={{ width: `${pct[level]}%` }} /></span>
    </span>
  );
}

/** Three zones: only in the ordering backend, in both (data split), only in the inventory tool. */
export function CapabilityMatrix() {
  return (
    <div className={`${styles.stack} ${styles.pad}`}>
      <div className={styles.zones}>
        <section className={styles.zone} aria-label="Only in the WeChat ordering backend">
          <header className={styles.zoneHead}><span className={styles.zoneCount}>3</span><span className={styles.tag}>Only in WeChat ordering</span></header>
          {onlyWechat.map((d) => (
            <div key={d} className={styles.card}><span className={styles.cardName}>{d}</span><Bar label="WeChat" level="full" /><span className={styles.ghost}>No counterpart in MPSOFT</span></div>
          ))}
        </section>
        <section className={`${styles.zone} ${styles.zoneBoth}`} aria-label="In both systems with separate data">
          <header className={styles.zoneHead}><span className={styles.zoneCount}>5</span><span className={styles.tag}>In both, data split</span></header>
          {both.map((d) => (
            <div key={d.domain} className={`${styles.card} ${styles.cardBoth}`}>
              <span className={styles.cardName}>{d.domain}<span className={styles.splitMark} aria-hidden="true">⁄⁄</span></span>
              <Bar label="WeChat" level={d.a} />
              <Bar label="MPSOFT" level={d.b} />
            </div>
          ))}
        </section>
        <section className={styles.zone} aria-label="Only in the MPSOFT inventory tool">
          <header className={styles.zoneHead}><span className={styles.zoneCount}>4</span><span className={styles.tag}>Only in MPSOFT</span></header>
          {onlyMpsoft.map((d) => (
            <div key={d} className={styles.card}><span className={styles.cardName}>{d}</span><Bar label="MPSOFT" level="full" /><span className={styles.ghost}>No counterpart in WeChat</span></div>
          ))}
        </section>
      </div>
      <div className={styles.legend}>
        <span className={styles.cell}><span className={styles.swatch} style={{ width: 24 }} />Complete</span>
        <span className={styles.cell}><span className={styles.swatch} style={{ width: 12 }} />Partial</span>
        <span className={styles.cell}><span className={styles.swatch} style={{ width: 0 }} />Missing</span>
      </div>
    </div>
  );
}

const box = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 } as const;

export function ArchitectureOptions() {
  return (
    <div className={`${styles.options} ${styles.pad}`}>
      <div className={styles.option}>
        <svg viewBox="0 0 160 96" role="img" aria-label="Two systems under one shared menu bar">
          <rect x="8" y="8" width="144" height="14" rx="3" {...box} />
          <rect x="8" y="8" width="30" height="14" rx="3" className={styles.scan} />
          <rect x="8" y="40" width="64" height="48" rx="4" {...box} />
          <rect x="88" y="40" width="64" height="48" rx="4" {...box} />
          <text x="40" y="68" textAnchor="middle" fontSize="11" fill="currentColor">A</text>
          <text x="120" y="68" textAnchor="middle" fontSize="11" fill="currentColor">B</text>
        </svg>
        <h3 className={styles.optTitle}>Stitch the two menus together</h3>
        <p className={styles.optBody}>Cheapest. Staff stop switching windows, but product, customer and stock records stay duplicated.</p>
      </div>
      <div className={styles.option}>
        <svg viewBox="0 0 160 96" role="img" aria-label="Two systems linked by two-way sync arrows">
          <rect x="8" y="30" width="56" height="40" rx="4" {...box} />
          <rect x="96" y="30" width="56" height="40" rx="4" {...box} />
          <path d="M66 42 H94 M66 58 H94" {...box} strokeDasharray="4 3" />
          <path d="M66 42 H94" pathLength={1} className={`${styles.spark} ${styles.sparkBreak}`} />
          <path d="M94 58 H66" pathLength={1} className={`${styles.spark} ${styles.sparkBreak} ${styles.sparkLate}`} />
          <circle cx="80" cy="50" r="7" className={styles.conflict} />
          <text x="36" y="55" textAnchor="middle" fontSize="11" fill="currentColor">A</text>
          <text x="124" y="55" textAnchor="middle" fontSize="11" fill="currentColor">B</text>
        </svg>
        <h3 className={styles.optTitle}>Sync A and B point to point</h3>
        <p className={styles.optBody}>Keeps both tools, but every entity needs a conflict rule, and two-way stock writes disagree.</p>
      </div>
      <div className={`${styles.option} ${styles.picked}`}>
        <svg viewBox="0 0 160 96" role="img" aria-label="Storefront and staff workspaces reading one shared record layer">
          <rect x="8" y="8" width="64" height="26" rx="4" {...box} />
          <rect x="88" y="8" width="64" height="26" rx="4" {...box} />
          <rect x="24" y="62" width="112" height="28" rx="4" {...box} strokeWidth="2.5" />
          <path d="M40 34 V62 M120 34 V62" {...box} />
          <path d="M40 34 V62" pathLength={1} className={styles.spark} />
          <path d="M120 62 V34" pathLength={1} className={`${styles.spark} ${styles.sparkLate}`} />
          <text x="40" y="25" textAnchor="middle" fontSize="10" fill="currentColor">Storefront</text>
          <text x="120" y="25" textAnchor="middle" fontSize="10" fill="currentColor">Staff</text>
          <text x="80" y="80" textAnchor="middle" fontSize="10" fill="currentColor">Shared records</text>
        </svg>
        <h3 className={styles.optTitle}>One platform, shared records <em className={styles.chosenBadge}>Chosen</em></h3>
        <p className={styles.optBody}>Product, customer and stock live once. Storefront and every role read the same order.</p>
      </div>
    </div>
  );
}

export function InvoiceCadence() {
  const rows = [
    { label: 'Sales wanted', src: 'Interview · sales', steps: ['Order closes', 'Invoice at once', 'Strip what cannot be invoiced'], broken: true },
    { label: 'Finance’s reality', src: 'Interview · finance', steps: ['Orders A, B, C', 'Customer pays in one transfer', 'One invoice'], broken: false },
    { label: 'What I built', src: 'Both cadences', steps: ['Order carries a payment track', 'Invoice from paid orders', 'Merge orders, skip invoiced lines'], picked: true },
  ];
  return (
    <div className={styles.pad}>
    <div className={styles.rows}>
      {rows.map((row) => (
        <div key={row.label} className={`${styles.row} ${row.picked ? styles.picked : ''}`}>
          <div className={styles.rowLabel}>
            <span>{row.label}{row.picked ? <> <em className={styles.chosenBadge}>Chosen</em></> : null}</span>
            <span className={styles.src}>{row.src}</span>
          </div>
          <div className={styles.chips}>
            {row.steps.map((step, i) => (
              <span key={step} className={styles.chips}>
                <span className={`${styles.chip} ${styles.chipStep} ${row.broken && i === 2 ? styles.break : ''}`} style={{ animationDelay: `${i * 1.2}s` }}>{step}</span>
                {i < row.steps.length - 1 ? <span className={styles.arrow} aria-hidden="true">→</span> : null}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}

export function ConfirmationLadder() {
  const rungs = [
    { n: '1', head: 'Reversible, no side effects', body: 'Editing draft rows. Applies instantly, no dialog.' },
    { n: '2', head: 'Reversible, but costs something', body: 'Switching single / multi-SKU mode drops selections. Confirm, and say what is lost.' },
    { n: '3', head: 'Irreversible: stock or money moves', body: 'Confirm shipment, post a stocktake, void an invoice. Danger dialog listing consequences, with a reason where it applies.' },
    { n: '4', head: 'Counter queue: the logged exception', body: 'Hold, resume, add an item while a customer waits. Instant action and a toast, no confirmation.', picked: true },
  ];
  return (
    <div className={`${styles.ladder} ${styles.pad}`}>
      <div className={styles.rows}>
        {rungs.map((r) => (
          <div key={r.n} className={`${styles.rung} ${styles.rungStep} ${r.picked ? styles.picked : ''}`} style={{ animationDelay: `${(Number(r.n) - 1) * 2}s` }}>
            <span className={styles.rungNum}>{r.n}</span>
            <div>
              <h3 className={styles.rungHead}>{r.head}</h3>
              <p className={styles.rungBody}>{r.body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.stack}>
        <div className={`${styles.dialog} ${styles.dlg3}`}>
          <span className={styles.tag}>Level 3 · stocktake confirmation</span>
          <pre>{`About to:\n · Adjust stock for 12 SKUs\n · Record €340.50 in losses\n   (posts to finance)\n · This cannot be undone`}</pre>
        </div>
        <div className={`${styles.dialog} ${styles.dlg4}`}>
          <span className={styles.tag}>Level 4 · counter</span>
          <span className={`${styles.toast} ${styles.toastIn}`}>Held: Zhang San, 5 items</span>
        </div>
      </div>
    </div>
  );
}

export type IterationItem = { date: string; area: string; before: string; after: string };

export function IterationLog({ items }: { items: IterationItem[] }) {
  return (
    <ol className={styles.log} aria-label="Design iterations, from the project history">
      <li className={styles.logItem} aria-hidden="true">
        <span className={styles.tag}>When</span><span className={styles.tag}>Where I started</span><span className={styles.tag}>Where it landed</span>
      </li>
      {items.map((item) => (
        <li key={item.area} className={styles.logItem}>
          <div><span className={styles.logArea}>{item.area}</span><p>{item.date}</p></div>
          <div><p>{item.before}</p></div>
          <div className={styles.logAfter}><p>{item.after}</p></div>
        </li>
      ))}
    </ol>
  );
}
