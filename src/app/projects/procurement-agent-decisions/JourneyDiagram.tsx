/**
 * The same purchase three times: spread across tools, on one platform (version 1),
 * and with the Agent (version 2). Same SVG language as the other procurement diagrams.
 */
import { FlowPulse } from '../procurement-agent-kit/ProcurementFlowDiagrams';
import styles from '../procurement-agent-kit/ProcurementFlowDiagrams.module.css';

const LINK = 'var(--case-flow-link)';
const BREAK = 'var(--case-flow-break)';
const BODY = 'var(--case-font-body)';
const HEAD = 'var(--case-font-heading)';
const SIZE = 'var(--case-text-14)';

const STEPS = ['DECIDE', 'ORDER', 'CONFIRMATION', 'DELIVERY', 'NEXT TIME'];
const boxX = (i: number) => 164 + i * 162;
const W = 134;
const H = 76;

/** broken: lost outside the system · person: judgment by hand · ai: the Agent works · plain: recorded · none: missing */
type Kind = 'broken' | 'person' | 'ai' | 'plain' | 'none';
const ROWS: { y: number; label: [string, string]; nodes: [string, string, Kind][] }[] = [
  { y: 48, label: ['The process', 'spread out'], nodes: [
    ['From memory', 'sales in Excel', 'person'], ['Excel file', 'sent by chat', 'broken'], ['Stays in chat', 'changes unseen', 'broken'], ['Paper note', 'keyed by hand', 'broken'], ['Lost', 'in people’s heads', 'none'],
  ] },
  { y: 172, label: ['On a platform', 'version 1'], nodes: [
    ['Still by hand', '3 months of sales', 'person'], ['One record', 'in the ERP', 'plain'], ['AI compares', 'flags differences', 'ai'], ['AI compares', 'every batch linked', 'ai'], ['Not yet', 'nothing returns', 'none'],
  ] },
  { y: 296, label: ['With an Agent', 'version 2'], nodes: [
    ['Agent drafts', 'buyer edits', 'ai'], ['Buyer orders', 'and records it', 'person'], ['Agent checks', 'buyer decides', 'ai'], ['Count prefilled', 'buyer confirms', 'ai'], ['Plan scored', 'buyer reviews', 'ai'],
  ] },
];

const LOOP_Y = 402;
const pulse = [
  ...[0, 1, 2, 3].map((i) => `M${boxX(i) + W} ${296 + H / 2} H${boxX(i + 1)}`),
  `M${boxX(4) + W / 2} ${296 + H} V${LOOP_Y} H${boxX(0) + W / 2} V${296 + H + 2}`,
];

function Cross({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="9" fill="var(--case-white)" stroke={BREAK} strokeWidth="var(--case-focus-width)" />
      <path d="M-4 -4 L4 4 M4 -4 L-4 4" stroke={BREAK} strokeWidth="var(--case-focus-width)" strokeLinecap="round" />
    </g>
  );
}

export default function JourneyDiagram() {
  const id = 'procurement-journey';
  return (
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label="One purchase, from spread out to Agent; scroll horizontally on small screens">
      <svg viewBox="0 0 960 468" role="img" aria-labelledby={`${id}-t ${id}-d`}>
        <title id={`${id}-t`}>One purchase process, moved onto a platform and then worked with an Agent</title>
        <desc id={`${id}-d`}>Spread out: the buyer decides from memory and Excel, the order and confirmation stay in chat, delivery is keyed from paper, and nothing is kept. On a platform, version 1: one record in the ERP and AI flags differences, but deciding is still manual. With an Agent, version 2: the Agent drafts, the buyer orders, the Agent checks the confirmation and prefills the count, and each reviewed plan is scored and informs the next one.</desc>
        <defs>
          <marker id={`${id}-a`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill={LINK} /></marker>
        </defs>
        <rect width="960" height="468" fill="var(--case-white)" />
        <g fill="var(--case-muted)" fontFamily={HEAD} fontSize={SIZE} textAnchor="middle">
          {STEPS.map((step, i) => <text key={step} x={boxX(i) + W / 2} y="26">{step}</text>)}
        </g>
        <rect x="8" y="284" width="944" height="132" rx="8" fill="var(--case-surface)" />

        {ROWS.map((row, r) => (
          <g key={row.label[1]}>
            <text x="22" y={row.y + 34} fontFamily={BODY} fontSize={SIZE} fontWeight="var(--case-weight-strong)" fill="var(--case-ink)">{row.label[0]}</text>
            <text x="22" y={row.y + 54} fontFamily={BODY} fontSize={SIZE} fill="var(--case-muted)">{row.label[1]}</text>
            {[0, 1, 2, 3].map((i) => {
              const from = boxX(i) + W, to = boxX(i + 1), y = row.y + H / 2;
              return r === 0
                ? <g key={i}><path className={styles.carry} d={`M${from} ${y} H${to}`} stroke={BREAK} strokeWidth="var(--case-focus-width)" strokeDasharray="5 4" /><Cross x={(from + to) / 2} y={y} /></g>
                : <path key={i} d={`M${from} ${y} H${to - 1}`} stroke={LINK} strokeWidth="var(--case-focus-width)" strokeDasharray={r === 1 && i === 3 ? '5 4' : undefined} markerEnd={`url(#${id}-a)`} />;
            })}
            {row.nodes.map(([title, note, kind], i) => (
              <g key={i}>
                <rect x={boxX(i)} y={row.y} width={W} height={H} rx="8" fill="var(--case-white)"
                  stroke={kind === 'broken' ? BREAK : kind === 'ai' ? LINK : kind === 'person' ? 'var(--case-ink)' : 'var(--case-copy)'}
                  strokeWidth={kind === 'ai' || kind === 'person' ? 'var(--case-focus-width)' : 'var(--case-border-width)'}
                  strokeDasharray={kind === 'none' ? '5 4' : undefined} />
                <text x={boxX(i) + W / 2} y={row.y + 33} textAnchor="middle" fontFamily={BODY} fontSize={SIZE} fontWeight="var(--case-weight-strong)" fill={kind === 'none' ? 'var(--case-muted)' : 'var(--case-ink)'}>{title}</text>
                <text x={boxX(i) + W / 2} y={row.y + 54} textAnchor="middle" fontFamily={BODY} fontSize={SIZE} fill={kind === 'broken' ? BREAK : 'var(--case-muted)'}>{note}</text>
              </g>
            ))}
          </g>
        ))}

        {/* Version 2 closes the loop: the reviewed result informs the next draft. */}
        <path d={pulse[4]} fill="none" stroke={LINK} strokeWidth="var(--case-focus-width)" markerEnd={`url(#${id}-a)`} />
        <FlowPulse id={`${id}-p`} paths={pulse} />

        <g fontFamily={BODY} fontSize={SIZE} fill="var(--case-copy)">
          <rect x="164" y="436" width="22" height="16" rx="4" fill="var(--case-white)" stroke={LINK} strokeWidth="var(--case-focus-width)" />
          <text x="196" y="449">AI does the work</text>
          <rect x="352" y="436" width="22" height="16" rx="4" fill="var(--case-white)" stroke="var(--case-ink)" strokeWidth="var(--case-focus-width)" />
          <text x="384" y="449">A person judges</text>
          <Cross x={554} y={444} />
          <text x="572" y="449" fill={BREAK}>The link is lost</text>
          <rect x="728" y="436" width="22" height="16" rx="4" fill="var(--case-white)" stroke="var(--case-copy)" strokeDasharray="4 3" />
          <text x="760" y="449">Missing</text>
        </g>
      </svg>
    </div>
  );
}
