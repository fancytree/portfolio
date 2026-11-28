/**
 * The Agent as one line with branches: the stages run across, the data each one reads
 * branches up, and the person branches down. Dashed branches happen only when needed.
 * The stages are the chapters that follow.
 */
import { BookOpen, Calculator, CheckCheck, FileOutput, Gauge, ListChecks, MessageSquareText, PackageCheck, PencilLine, Reply, ScanSearch, Send, Stamp, Database, Brain, type LucideIcon } from 'lucide-react';
import { FlowPulse } from '../procurement-agent-kit/ProcurementFlowDiagrams';

const LINK = 'var(--case-flow-link)';
const INK = 'var(--case-ink)';
const COPY = 'var(--case-copy)';
const BODY = 'var(--case-font-body)';
const HEAD = 'var(--case-font-heading)';
const SIZE = 'var(--case-text-14)';

type Stage = {
  name: string; Icon: LucideIcon; data: string; DataIcon: LucideIcon;
  you: string; YouIcon: LucideIcon; when?: string; out?: string;
};
const STAGES: Stage[] = [
  { name: 'UNDERSTAND', Icon: MessageSquareText, data: 'Suppliers', DataIcon: BookOpen, you: 'Answer', YouIcon: Reply, when: 'if missing', out: 'request' },
  { name: 'PLAN', Icon: Calculator, data: 'Stock, sales', DataIcon: Database, you: 'Edit draft', YouIcon: PencilLine, out: 'plan' },
  { name: 'ORDER', Icon: FileOutput, data: 'Product codes', DataIcon: BookOpen, you: 'Send it', YouIcon: Send, out: 'order' },
  { name: 'CONFIRM', Icon: ScanSearch, data: 'Order lines', DataIcon: ListChecks, you: 'Approve', YouIcon: Stamp, when: 'if changed', out: 'changes' },
  { name: 'RECEIVE', Icon: PackageCheck, data: 'Confirmed order', DataIcon: ListChecks, you: 'Count', YouIcon: CheckCheck, out: 'receipt' },
  { name: 'REVIEW', Icon: Gauge, data: 'Past reviews', DataIcon: Database, you: 'Keep lessons', YouIcon: Brain },
];

const x = (i: number) => 78 + i * 160;
const LINE = 190;
const R = 34;
const SMALL = 23;
const DATA_Y = 74;
const YOU_Y = 328;

/** The purchase along the trunk, then the lesson looping back to the next plan. */
const TRUNK = STAGES.slice(0, -1).map((_, i) => `M${x(i) + R} ${LINE} H${x(i + 1) - R - 2}`);
const LOOP = `M${x(5) + R} ${LINE} H948 V18 H${x(1)} V${DATA_Y - SMALL - 2}`;

export default function AgentPipeline() {
  const id = 'procurement-pipeline';
  return (
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label="The whole Agent flow; scroll horizontally on small screens">
      <svg viewBox="0 -28 960 468" role="img" aria-labelledby={`${id}-t ${id}-d`}>
        <title id={`${id}-t`}>Six stages of the Agent, the data each reads, and where the user steps in</title>
        <desc id={`${id}-d`}>{STAGES.map((s, i) => `Stage ${i + 1}, ${s.name.toLowerCase()}: reads ${s.data.toLowerCase()}; the user step is ${s.you.toLowerCase()}${s.when ? ` ${s.when}` : ''}.`).join(' ')} What the user keeps feeds the next plan. The Agent never places the order.</desc>
        <defs>
          <marker id={`${id}-a`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill={LINK} /></marker>
        </defs>
        <rect y="-28" width="960" height="468" fill="var(--case-white)" />

        <g fill="none" stroke={LINK} strokeWidth="var(--case-focus-width)" markerEnd={`url(#${id}-a)`}>
          {TRUNK.map((d) => <path key={d} d={d} />)}
          <path d={LOOP} strokeDasharray="6 5" />
        </g>
        <FlowPulse id={`${id}-p`} paths={[...TRUNK, LOOP]} speed={300} />
        <text x="560" y="12" textAnchor="middle" fill={LINK} fontFamily={BODY} fontSize={SIZE}>what the user keeps feeds the next plan</text>

        {STAGES.map((s, i) => (
          <g key={s.name} textAnchor="middle" fontFamily={BODY} fontSize={SIZE}>
            {/* Data branch */}
            <path d={`M${x(i)} ${LINE - R} V${DATA_Y + SMALL + 24}`} stroke={COPY} strokeDasharray="4 4" />
            <circle cx={x(i)} cy={DATA_Y} r={SMALL} fill="var(--case-surface)" />
            <s.DataIcon x={x(i) - 12} y={DATA_Y - 12} width="24" height="24" stroke={COPY} aria-hidden="true" />
            <text x={x(i)} y={DATA_Y + SMALL + 18} fill={COPY}>{s.data}</text>

            {/* The stage */}
            <circle cx={x(i)} cy={LINE} r={R} fill="var(--case-white)" stroke={LINK} strokeWidth="var(--case-focus-width)" />
            <s.Icon x={x(i) - 16} y={LINE - 16} width="32" height="32" stroke={LINK} aria-hidden="true" />
            <text x={x(i)} y={LINE + R + 24} fill={INK} fontFamily={HEAD}>{i + 1} · {s.name}</text>
            {s.out && <text x={x(i) + 80} y={LINE - 12} fill={LINK}>{s.out}</text>}

            {/* Your branch: dashed when it happens only if needed */}
            <path d={`M${x(i)} ${LINE + R + 34} V${YOU_Y - SMALL - 2}`} stroke={INK} strokeWidth="var(--case-focus-width)" strokeDasharray={s.when ? '5 4' : undefined} />
            {s.when && <text x={x(i) + 8} y={YOU_Y - SMALL - 14} textAnchor="start" fill={COPY}>{s.when}</text>}
            <circle cx={x(i)} cy={YOU_Y} r={SMALL} fill={INK} />
            <s.YouIcon x={x(i) - 12} y={YOU_Y - 12} width="24" height="24" stroke="var(--case-white)" aria-hidden="true" />
            <text x={x(i)} y={YOU_Y + SMALL + 22} fill={INK} fontWeight="var(--case-weight-strong)">{s.you}</text>
          </g>
        ))}

        <g fontFamily={BODY} fontSize={SIZE} fill={COPY}>
          <circle cx="230" cy="420" r="8" fill="var(--case-surface)" /><text x="246" y="425">Data it reads</text>
          <circle cx="390" cy="420" r="8" fill="var(--case-white)" stroke={LINK} strokeWidth="var(--case-focus-width)" /><text x="406" y="425">Agent stage</text>
          <circle cx="548" cy="420" r="8" fill={INK} /><text x="564" y="425">User</text>
          <path d="M634 420 H668" stroke={INK} strokeWidth="var(--case-focus-width)" strokeDasharray="5 4" /><text x="678" y="425">Only when needed</text>
        </g>
      </svg>
    </div>
  );
}
