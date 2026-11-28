/**
 * Version 1 on one purchase record: where AI took part, what it did,
 * and (with `showLost`) what was still lost. Same SVG language as the other
 * procurement diagrams.
 */
import { Sparkles } from 'lucide-react';
import { FlowPulse } from '../procurement-agent-kit/ProcurementFlowDiagrams';
import styles from '../procurement-agent-kit/ProcurementFlowDiagrams.module.css';

const LINK = 'var(--case-flow-link)';
const BREAK = 'var(--case-flow-break)';
const BODY = 'var(--case-font-body)';
const HEAD = 'var(--case-font-heading)';
const SIZE = 'var(--case-text-14)';

/** Pill with the same sparkle the product uses for its Agent. */
function AiBadge({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="54" height="22" rx="11" fill={LINK} />
      <Sparkles x={x + 9} y={y + 4} width="14" height="14" stroke="var(--case-white)" aria-hidden="true" />
      <text x={x + 36} y={y + 16} textAnchor="middle" fill="var(--case-white)" fontFamily={HEAD} fontSize={SIZE}>AI</text>
    </g>
  );
}

type Node = { title: string; note: string; kind?: 'ai' | 'person' };
const ZONES: { x: number; label: string; nodes: [Node, Node]; lost: [string, string] }[] = [
  { x: 24, label: '1 · ORDER', nodes: [
    { title: 'Draft the order', note: 'Judged from 3 months of sales', kind: 'person' },
    { title: 'Order recorded', note: 'Supplier, quantities, price' },
  ], lost: ['Demand hidden by stockouts,', 'seasons, and customer growth'] },
  { x: 344, label: '2 · CONFIRM', nodes: [
    { title: 'AI compares with draft', note: 'Flags missing, quantity, price', kind: 'ai' },
    { title: 'Buyer checks the flags', note: 'Only the marked lines', kind: 'person' },
  ], lost: ['Which shortages repeat,', 'beyond what the buyer remembers'] },
  { x: 664, label: '3 · RECEIVE', nodes: [
    { title: 'AI compares the DDT', note: 'Flags short or missing goods', kind: 'ai' },
    { title: 'Batches recorded', note: 'Each shipment adds progress' },
  ], lost: ['What went differently never', 'reaches the next order'] },
];

const TOP = 84;
const LOWER = 180;
/** From the lower node of one stage to the upper node of the next. */
const CROSS = ['M280 216 H320 V120 H358', 'M600 216 H640 V120 H678'] as const;
const pulse = ['M160 156 V178', CROSS[0], 'M480 156 V178', CROSS[1], 'M800 156 V178'];

export default function FirstVersionFlow({ showLost = false }: { showLost?: boolean }) {
  const id = showLost ? 'procurement-v1-lost' : 'procurement-v1';
  const height = showLost ? 476 : 340;
  return (
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label="Where AI took part in version 1; scroll horizontally on small screens">
      <svg viewBox={`0 0 960 ${height}`} role="img" aria-labelledby={`${id}-t ${id}-d`}>
        <title id={`${id}-t`}>{showLost ? 'Version 1: AI compared documents, and context was still lost' : 'Version 1: one purchase record, with AI at two checks'}</title>
        <desc id={`${id}-d`}>The buyer drafts the order from three months of sales. AI compares the supplier confirmation with the draft and flags differences, which the buyer checks. At receiving, AI compares the delivery note and flags short or missing goods.{showLost && ' Still lost: demand hidden by stockouts, seasons and customer growth; which shortages repeat; and what went differently never reaches the next order.'}</desc>
        <defs>
          <marker id={`${id}-a`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill={LINK} /></marker>
        </defs>
        <rect width="960" height={height} fill="var(--case-white)" />

        {ZONES.map((zone) => (
          <g key={zone.label}>
            <rect x={zone.x} y="28" width="272" height="244" rx="8" fill="var(--case-surface)" stroke="var(--case-line)" />
            <text x={zone.x + 16} y="54" fill="var(--case-muted)" fontFamily={HEAD} fontSize={SIZE}>{zone.label}</text>
          </g>
        ))}

        <g fill="none" stroke={LINK} strokeWidth="var(--case-focus-width)" markerEnd={`url(#${id}-a)`}>
          {pulse.map((d) => <path key={d} d={d} />)}
        </g>
        <FlowPulse id={`${id}-p`} paths={pulse} />

        {ZONES.map((zone) => zone.nodes.map((node, i) => {
          const y = i ? LOWER : TOP;
          const ai = node.kind === 'ai';
          return (
            <g key={node.title}>
              <rect x={zone.x + 16} y={y} width="240" height="72" rx="8" fill="var(--case-white)"
                stroke={ai ? LINK : node.kind === 'person' ? 'var(--case-ink)' : 'var(--case-copy)'}
                strokeWidth={node.kind ? 'var(--case-focus-width)' : 'var(--case-border-width)'} />
              <text x={zone.x + 136} y={y + 32} textAnchor="middle" fill="var(--case-ink)" fontFamily={BODY} fontSize="var(--case-text-16)" fontWeight="var(--case-weight-strong)">{node.title}</text>
              <text x={zone.x + 136} y={y + 54} textAnchor="middle" fill={ai ? LINK : 'var(--case-muted)'} fontFamily={BODY} fontSize={SIZE}>{node.note}</text>
              {ai && <AiBadge x={zone.x + 192} y={y - 11} />}
            </g>
          );
        }))}

        {/* What leaves the record at each stage. */}
        {showLost && ZONES.map((zone, i) => (
          <g key={zone.label}>
            <path className={styles.carry} d={`M${zone.x + 136} 272 V304`} stroke={BREAK} strokeWidth="var(--case-focus-width)" strokeDasharray="5 4" />
            <circle className={`${styles.ring} ${i % 2 ? styles.ringLate : ''}`} cx={zone.x + 136} cy="288" r="10" fill="none" stroke={BREAK} />
            <rect x={zone.x} y="306" width="272" height="98" rx="8" fill="var(--case-white)" stroke={BREAK} strokeDasharray="6 4" />
            <text x={zone.x + 136} y="334" textAnchor="middle" fill={BREAK} fontFamily={HEAD} fontSize={SIZE}>STILL LOST</text>
            <g textAnchor="middle" fill="var(--case-ink)" fontFamily={BODY} fontSize={SIZE}>
              <text x={zone.x + 136} y="362">{zone.lost[0]}</text>
              <text x={zone.x + 136} y="382">{zone.lost[1]}</text>
            </g>
          </g>
        ))}

        <g fontFamily={BODY} fontSize={SIZE} fill="var(--case-copy)" transform={`translate(0 ${height - 476})`}>
          <AiBadge x={24} y={438} />
          <text x="90" y="454">AI takes part: it compares documents</text>
          <rect x="368" y="441" width="22" height="16" rx="4" fill="var(--case-white)" stroke="var(--case-ink)" strokeWidth="var(--case-focus-width)" />
          <text x="402" y="454">A person judges</text>
          {showLost && <>
            <path d="M572 449 H620" stroke={BREAK} strokeWidth="var(--case-focus-width)" strokeDasharray="5 4" />
            <text x="634" y="454" fill={BREAK}>Context drops out of the record</text>
          </>}
        </g>
      </svg>
    </div>
  );
}
