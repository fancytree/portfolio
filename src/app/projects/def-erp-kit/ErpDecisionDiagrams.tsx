/**
 * Animated diagrams for ERP decisions that are about a process, not a screen.
 * Same SVG language as the procurement case diagrams; the dot moves at one steady speed.
 */
import { FlowPulse } from '../procurement-agent-kit/ProcurementFlowDiagrams';

const LINK = 'var(--case-flow-link)';
const BREAK = 'var(--case-flow-break)';
const F = { body: 'var(--case-font-body)', head: 'var(--case-font-heading)', cap: 'var(--case-type-caption)', strong: 'var(--case-weight-strong)' };

function Box({ x, y, w, h, tag, title, note, tone }: { x: number; y: number; w: number; h: number; tag?: string; title: string; note?: string; tone?: 'muted' | 'gate' | 'done' | 'plain' }) {
  const muted = tone === 'muted';
  return (
    <g opacity={muted ? 0.55 : 1}>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={tone === 'done' ? 'var(--case-ink)' : 'var(--case-bg)'}
        stroke={muted ? 'var(--case-muted)' : 'var(--case-ink)'} strokeWidth={tone === 'gate' ? 3 : 'var(--case-border-width)'} strokeDasharray={muted ? '5 4' : undefined} />
      {tag && <text x={x + 14} y={y + 22} fill={tone === 'done' ? 'var(--case-bg)' : muted ? 'var(--case-muted)' : LINK} fontFamily={F.head} fontSize={F.cap}>{tag}</text>}
      <text x={x + 14} y={y + (tag ? 44 : 30)} fill={tone === 'done' ? 'var(--case-bg)' : muted ? 'var(--case-muted)' : 'var(--case-ink)'} fontFamily={F.body} fontSize={F.cap} fontWeight={F.strong}>{title}</text>
      {note && <text x={x + 14} y={y + (tag ? 64 : 50)} fill={tone === 'done' ? 'var(--case-bg)' : 'var(--case-muted)'} fontFamily={F.body} fontSize={F.cap}>{note}</text>}
    </g>
  );
}
function Arrow({ id, d, color = 'var(--case-copy)', dashed = false }: { id: string; d: string; color?: string; dashed?: boolean }) {
  return <path d={d} fill="none" stroke={color} strokeWidth="var(--case-focus-width)" strokeDasharray={dashed ? '5 4' : undefined} markerEnd={`url(#${id})`} />;
}

/* ───────── Procurement: approval folds into placing the order ───────── */
export function ApprovalChainFlow() {
  const id = 'erp-approval-chain';
  const main = ['M190 266 H214', 'M384 266 H408', 'M578 266 H602'] as const;
  return (
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label="Approval folded into placing the order">
      <svg viewBox="0 0 780 360" role="img" aria-labelledby={`${id}-t ${id}-d`}>
        <title id={`${id}-t`}>The separate request and approval stages are hidden; approval happens when the order is placed</title>
        <desc id={`${id}-d`}>Before: purchase request, then approval, then order, three stages a small team would approve for itself. After: a draft purchase order, the supplier confirmation uploaded, prices confirmed, then the order is placed. Placing it requires the confirmation. The request tables stay, hidden.</desc>
        <defs>
          <marker id={`${id}-a`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="var(--case-copy)" /></marker>
          <marker id={`${id}-m`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="var(--case-muted)" /></marker>
        </defs>
        <rect width="780" height="360" fill="var(--case-bg)" />
        <text x="20" y="30" fill="var(--case-muted)" fontFamily={F.head} fontSize={F.cap}>BEFORE · THREE STAGES, HALF-WIRED</text>
        <Box x={20} y={44} w={170} h={60} title="Purchase request" tone="muted" />
        <Box x={214} y={44} w={170} h={60} title="Approval" tone="muted" />
        <Box x={408} y={44} w={170} h={60} title="Order" tone="muted" />
        <Arrow id={`${id}-m`} d="M190 74 H210" color="var(--case-muted)" dashed />
        <Arrow id={`${id}-m`} d="M384 74 H404" color="var(--case-muted)" dashed />
        <text x="600" y="70" fill={BREAK} fontFamily={F.body} fontSize={F.cap}>Approving your own</text>
        <text x="600" y="90" fill={BREAK} fontFamily={F.body} fontSize={F.cap}>request · tables kept, hidden</text>
        <line x1="20" x2="760" y1="150" y2="150" stroke="var(--case-rule)" />
        <text x="20" y="190" fill="var(--case-muted)" fontFamily={F.head} fontSize={F.cap}>AFTER · APPROVAL IS PART OF PLACING THE ORDER</text>
        {main.map((d) => <Arrow key={d} id={`${id}-a`} d={d} />)}
        <FlowPulse id={`${id}-p`} paths={main} speed={120} rest={0.8} />
        <Box x={20} y={226} w={170} h={80} tag="BUYER" title="Draft PO" note="Quantities, est. prices" />
        <Box x={214} y={226} w={170} h={80} tag="SUPPLIER" title="Confirmation" note="PDF uploaded" />
        <Box x={408} y={226} w={170} h={80} tag="BUYER" title="Prices confirmed" note="Differences checked" />
        <Box x={602} y={226} w={160} h={80} tag="GATE" title="Mark as ordered" note="Needs both before it" tone="gate" />
      </svg>
    </div>
  );
}

/* ───────── Mini-program: launch on the old look, validate the data, then rebrand ───────── */
export function LaunchPhasesFlow() {
  const id = 'erp-launch-phases';
  const line = ['M40 120 H380', 'M380 120 H720'] as const;
  const p1 = ['Browse', 'Cart', 'Checkout', 'Orders', 'Binding'];
  return (
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label="Launch fast, then rebrand">
      <svg viewBox="0 0 760 330" role="img" aria-labelledby={`${id}-t ${id}-d`}>
        <title id={`${id}-t`}>Phase 1 connects every flow on the familiar look; phase 2 redesigns the brand</title>
        <desc id={`${id}-d`}>Phase 1, 24 August to 28 September 2026: browse, cart, checkout, orders and account binding go live on the existing look. Real orders then prove the data reaches the ERP without re-entry. Phase 2 is the brand redesign.</desc>
        <rect width="760" height="330" fill="var(--case-bg)" />
        {/* Timeline */}
        <line x1="40" x2="720" y1="120" y2="120" stroke="var(--case-rule)" strokeWidth="4" strokeLinecap="round" />
        <line x1="40" x2="380" y1="120" y2="120" stroke={LINK} strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round" />
        <FlowPulse id={`${id}-p`} paths={line} speed={170} rest={0.6} />
        {[[40, 'Start', '24 Aug'], [380, 'Live', '28 Sep'], [720, 'Phase 2', 'Next']].map(([x, t, d]) => (
          <g key={t as string}>
            <circle cx={x as number} cy="120" r="9" fill={t === 'Phase 2' ? 'var(--case-bg)' : LINK} stroke={t === 'Phase 2' ? 'var(--case-muted)' : 'var(--case-bg)'} strokeWidth="3" />
            <text x={x as number} y="92" textAnchor={x === 40 ? 'start' : x === 720 ? 'end' : 'middle'} fill="var(--case-ink)" fontFamily={F.body} fontSize={F.cap} fontWeight={F.strong}>{t}</text>
            <text x={x as number} y="72" textAnchor={x === 40 ? 'start' : x === 720 ? 'end' : 'middle'} fill="var(--case-muted)" fontFamily={F.body} fontSize={F.cap}>{d}</text>
          </g>
        ))}
        <text x="40" y="30" fill={LINK} fontFamily={F.head} fontSize={F.cap}>PHASE 1 · CONNECT AND VALIDATE THE DATA</text>
        {/* Phase 1 scope */}
        {p1.map((t, i) => (
          <g key={t}>
            <rect x={40 + i * 68} y="158" width="60" height="32" rx="16" fill="var(--case-surface)" stroke={LINK} />
            <text x={70 + i * 68} y="179" textAnchor="middle" fill="var(--case-ink)" fontFamily={F.body} fontSize="12">{t}</text>
          </g>
        ))}
        <text x="40" y="226" fill="var(--case-ink)" fontFamily={F.body} fontSize={F.cap} fontWeight={F.strong}>Every flow live, on the look salons know</text>
        <text x="40" y="248" fill="var(--case-muted)" fontFamily={F.body} fontSize={F.cap}>Real orders prove the data reaches the ERP</text>
        {/* Phase 2 */}
        <rect x="470" y="158" width="250" height="100" rx="8" fill="var(--case-bg)" stroke="var(--case-muted)" strokeDasharray="5 4" />
        <text x="486" y="186" fill="var(--case-muted)" fontFamily={F.head} fontSize={F.cap}>PHASE 2</text>
        <text x="486" y="210" fill="var(--case-ink)" fontFamily={F.body} fontSize={F.cap} fontWeight={F.strong}>Brand redesign</text>
        <text x="486" y="232" fill="var(--case-muted)" fontFamily={F.body} fontSize={F.cap}>On data already proven</text>
      </svg>
    </div>
  );
}
