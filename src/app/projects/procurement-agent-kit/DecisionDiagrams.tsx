/**
 * Animated diagrams for decisions that are about a process rather than a screen.
 * Same SVG language as ProcurementFlowDiagrams; the dot moves at one steady speed (FlowPulse).
 */
import { FlowPulse } from './ProcurementFlowDiagrams';
import styles from './ProcurementFlowDiagrams.module.css';

const LINK = 'var(--case-flow-link)';
const BREAK = 'var(--case-flow-break)';
const F = { body: 'var(--case-font-body)', head: 'var(--case-font-heading)', cap: 'var(--case-text-14)', strong: 'var(--case-weight-strong)' };

type Node = { x: number; y: number; w: number; h: number; tag?: string; title: string; note?: string; tone?: 'agent' | 'engine' | 'buyer' | 'result' | 'outside' };
function Box({ n }: { n: Node }) {
  const stroke = n.tone === 'agent' ? LINK : n.tone === 'outside' ? 'var(--case-copy)' : 'var(--case-ink)';
  const fill = n.tone === 'result' ? 'var(--case-ink)' : 'var(--case-white)';
  const ink = n.tone === 'result' ? 'var(--case-white)' : 'var(--case-ink)';
  return (
    <g>
      <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="8" fill={fill} stroke={stroke} strokeWidth={n.tone === 'engine' ? 3 : 'var(--case-border-width)'} />
      {n.tag && <text x={n.x + 14} y={n.y + 22} fill={n.tone === 'agent' ? LINK : n.tone === 'result' ? 'var(--case-white)' : 'var(--case-muted)'} fontFamily={F.head} fontSize={F.cap}>{n.tag}</text>}
      <text x={n.x + 14} y={n.y + (n.tag ? 44 : 28)} fill={ink} fontFamily={F.body} fontSize={F.cap} fontWeight={F.strong}>{n.title}</text>
      {n.note && <text x={n.x + 14} y={n.y + (n.tag ? 64 : 48)} fill={n.tone === 'result' ? 'var(--case-white)' : 'var(--case-muted)'} fontFamily={F.body} fontSize={F.cap}>{n.note}</text>}
    </g>
  );
}
function Arrows({ id, paths, color = 'var(--case-copy)' }: { id: string; paths: readonly string[]; color?: string }) {
  return (
    <>
      <defs><marker id={`${id}-a`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill={color} /></marker></defs>
      <g fill="none" stroke={color} strokeWidth="var(--case-focus-width)" markerEnd={`url(#${id}-a)`}>{paths.map((d) => <path key={d} d={d} />)}</g>
    </>
  );
}

/* ───────── 03 · The model reads; an engine calculates ───────── */
export function ModelEngineFlow() {
  const id = 'dec-model-engine';
  const nodes: Node[] = [
    { x: 20, y: 40, w: 200, h: 78, tag: 'INPUT', title: 'Request + supplier PDF', note: '“Plan MNP for 30 days”', tone: 'outside' },
    { x: 380, y: 40, w: 220, h: 78, tag: 'MODEL · READS', title: 'Supplier, coverage, limits', note: 'Fields, not numbers', tone: 'agent' },
    { x: 380, y: 180, w: 220, h: 78, tag: 'ENGINE · CALCULATES', title: 'Sales × days − stock', note: 'Tested, repeatable', tone: 'engine' },
    { x: 20, y: 180, w: 200, h: 78, tag: 'RESULT', title: '96 pcs for 370102', note: 'Same inputs, same number', tone: 'result' },
    { x: 20, y: 320, w: 200, h: 78, tag: 'MODEL · EXPLAINS', title: 'Why 96, in words', tone: 'agent' },
    { x: 380, y: 328, w: 220, h: 62, title: 'Buyer edits or accepts', tone: 'buyer' },
  ];
  const main = ['M220 79 H376', 'M490 118 V176', 'M380 219 H224', 'M120 258 V316', 'M220 359 H376'] as const;
  return (
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label="The model reads, an engine calculates">
      <svg viewBox="0 0 620 420" role="img" aria-labelledby={`${id}-t ${id}-d`}>
        <title id={`${id}-t`}>The model reads the request; a tested engine calculates the quantity</title>
        <desc id={`${id}-d`}>The request and supplier PDF go to the model, which extracts supplier, coverage and limits. A deterministic engine calculates 96 pieces. The model explains the number and the buyer edits or accepts it. The model never produces the number itself.</desc>
        <rect width="620" height="420" fill="var(--case-white)" />
        <Arrows id={id} paths={main} />
        <FlowPulse id={`${id}-p`} paths={main} speed={220} />
        {/* The shortcut that is not allowed */}
        <g stroke={BREAK} strokeWidth="var(--case-border-width)" strokeDasharray="5 4" fill="none">
          <path className={styles.carry} d="M380 110 C 300 150, 260 170, 224 196" />
        </g>
        <g transform="translate(300 160)"><circle r="11" fill="var(--case-white)" stroke={BREAK} /><path d="M-5 -5 L5 5 M5 -5 L-5 5" stroke={BREAK} strokeWidth="2" /></g>
        <text x="300" y="146" textAnchor="middle" fill={BREAK} fontFamily={F.body} fontSize={F.cap}>never calculates</text>
        {nodes.map((n) => <Box key={n.title} n={n} />)}
      </svg>
    </div>
  );
}

/* ───────── 04 · The buyer orders outside; the platform records ───────── */
export function OrderOutsideFlow() {
  const id = 'dec-order-outside';
  const nodes: Node[] = [
    { x: 40, y: 64, w: 170, h: 70, tag: 'AGENT', title: 'Drafts the plan', tone: 'agent' },
    { x: 225, y: 64, w: 170, h: 70, tag: 'BUYER', title: 'Approves', tone: 'buyer' },
    { x: 410, y: 64, w: 170, h: 70, tag: 'BUYER', title: 'Marks as ordered', note: 'Confirmation attached', tone: 'buyer' },
    { x: 140, y: 252, w: 170, h: 70, title: 'Orders on WhatsApp', note: 'or email', tone: 'outside' },
    { x: 330, y: 252, w: 170, h: 70, title: 'Supplier confirms', note: 'PDF comes back', tone: 'outside' },
  ];
  const main = ['M210 99 H221', 'M310 134 V200 H225 V248', 'M310 287 H326', 'M415 252 V200 H495 V138'] as const;
  return (
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label="The buyer orders outside the platform">
      <svg viewBox="0 0 620 400" role="img" aria-labelledby={`${id}-t ${id}-d`}>
        <title id={`${id}-t`}>The Agent drafts, the buyer orders outside, the platform records it</title>
        <desc id={`${id}-d`}>Inside the platform the Agent drafts the plan and the buyer approves it. The order itself is placed outside, on WhatsApp or email, and the supplier sends a confirmation back. Only then does the buyer mark the order as ordered, with the confirmation attached.</desc>
        <rect width="620" height="400" fill="var(--case-white)" />
        {/* Platform boundary vs outside */}
        <rect x="20" y="20" width="580" height="140" rx="10" fill="var(--case-surface)" stroke="var(--case-line)" />
        <text x="36" y="44" fill="var(--case-muted)" fontFamily={F.head} fontSize={F.cap}>INSIDE THE ERP</text>
        <rect x="120" y="226" width="400" height="140" rx="10" fill="none" stroke="var(--case-copy)" strokeDasharray="6 4" />
        <text x="136" y="358" fill="var(--case-muted)" fontFamily={F.head} fontSize={F.cap}>OUTSIDE · THE REAL COMMITMENT</text>
        <Arrows id={id} paths={main} />
        <FlowPulse id={`${id}-p`} paths={main} speed={200} />
        {/* The platform never sends the order */}
        <g transform="translate(560 200)"><circle r="11" fill="var(--case-white)" stroke={BREAK} /><path d="M-5 -5 L5 5 M5 -5 L-5 5" stroke={BREAK} strokeWidth="2" /></g>
        <text x="560" y="230" textAnchor="middle" fill={BREAK} fontFamily={F.body} fontSize={F.cap}>never sends</text>
        <text x="560" y="248" textAnchor="middle" fill={BREAK} fontFamily={F.body} fontSize={F.cap}>the order</text>
        {nodes.map((n) => <Box key={n.title} n={n} />)}
      </svg>
    </div>
  );
}
