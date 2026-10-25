'use client';

import { CaseWorkflow, useCaseWorkflowFocus } from '../../components/case-kit/CaseWorkflow';
import { useId } from 'react';

/** Narrative diagrams: geometry is fixed, every visual role comes from Case Kit. */
function Node({ x, y, title, tag, lines, focal = false, terminal = false, stage }: {
  x: number; y: number; title: string; tag: string; lines: string[]; focal?: boolean; terminal?: boolean; stage?: string;
}) {
  const focused = useCaseWorkflowFocus(stage);
  return (
    <g data-workflow-node={focused} data-workflow-stage={stage}>
      <rect x={x} y={y} width="232" height="112" fill="var(--case-bg)" stroke={focal ? 'var(--case-ink)' : 'var(--case-rule)'} strokeWidth={focal ? 'var(--case-focus-width)' : 'var(--case-border-width)'} style={{ rx: terminal ? 'var(--case-radius-xl)' : 'var(--case-radius-sm)' }} />
      <text x={x + 20} y={y + 24} fill="var(--case-muted)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-spec)" fontWeight="var(--case-weight-medium)">{tag}</text>
      <text x={x + 20} y={y + 52} fill="var(--case-ink)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-body)" fontWeight="var(--case-weight-strong)">{title}</text>
      {lines.map((line, index) => <text key={line} x={x + 20} y={y + 76 + index * 20} fill="var(--case-copy)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">{line}</text>)}
    </g>
  );
}

function ArrowLabel({ x, y, width, children }: { x: number; y: number; width: number; children: string }) {
  return <g>
    <rect x={x} y={y} width={width} height="24" fill="var(--case-bg)" />
    <text x={x + width / 2} y={y + 16} textAnchor="middle" fill="var(--case-copy)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-stat-label)" fontWeight="var(--case-weight-medium)">{children}</text>
  </g>;
}

function Markers({ prefix }: { prefix: string }) {
  return <defs>
    <marker id={`${prefix}-arrow`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="var(--case-muted)" /></marker>
    <marker id={`${prefix}-arrow-accent`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="var(--case-ink)" /></marker>
    <marker id={`${prefix}-arrow-link`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="var(--case-muted)" /></marker>
  </defs>;
}

function WorkflowEdge({ stage, prefix, d, dashed = false }: { stage: string; prefix: string; d: string; dashed?: boolean }) {
  const focused = useCaseWorkflowFocus(stage);
  return <path d={d} data-workflow-edge={focused} data-workflow-stage={stage} markerEnd={`url(#${prefix}-arrow${focused ? '-accent' : ''})`} strokeDasharray={dashed ? 'var(--case-space-6) var(--case-space-4)' : undefined} />;
}

export function MonoAgentWorkflow() {
  const prefix = useId();
  return (
    <CaseWorkflow title="From intent to an interface" stages={[
      { id: 'routing', label: 'Intent routing', description: 'The request and available context enter LangChain, which returns a structured intent for product code to dispatch.' },
      { id: 'execution', label: 'Execute & clarify', description: 'A task chain or domain service parses, retrieves, or calculates. Missing information prompts a follow-up; the reply returns with context.' },
      { id: 'composition', label: 'UI composition', description: 'Product code checks the response contract and maps supported data to product-owned components. Text-only replies skip this step.' },
    ]}>
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label="Mono Agent workflow; scroll horizontally on small screens">
      <svg viewBox="0 0 960 600" role="img" aria-labelledby={`${prefix}-title ${prefix}-desc`}>
        <title id={`${prefix}-title`}>Mono: from intent to a structured interface</title>
        <desc id={`${prefix}-desc`}>LangChain routes a request to a task chain or domain service, missing information prompts clarification, and a structured response is checked and rendered by product-owned components.</desc>
        <Markers prefix={prefix} />
        <rect width="960" height="600" fill="var(--case-bg)" />
        <g fill="none" stroke="var(--case-muted)" strokeWidth="var(--case-icon-stroke)" markerEnd={`url(#${prefix}-arrow)`}>
          <WorkflowEdge stage="routing" prefix={prefix} d="M280 120 H364" />
          <WorkflowEdge stage="execution" prefix={prefix} d="M596 120 H680" />
          <WorkflowEdge stage="composition" prefix={prefix} d="M680 152 H648 Q640 152 640 160 V348 Q640 356 632 356 H596" />
          <WorkflowEdge stage="composition" prefix={prefix} d="M364 356 H280" />
          <WorkflowEdge stage="execution" prefix={prefix} d="M796 176 V300" />
          <WorkflowEdge stage="execution" prefix={prefix} d="M796 412 V480 Q796 488 788 488 H32 Q24 488 24 480 V128 Q24 120 32 120 H48" dashed />
        </g>
        <ArrowLabel x={648} y={220} width={96}>READY FOR UI</ArrowLabel>
        <ArrowLabel x={804} y={220} width={120}>MISSING INPUT</ArrowLabel>
        <ArrowLabel x={360} y={456} width={160}>REPLY + CONTEXT</ArrowLabel>
        <Node x={48} y={64} stage="routing" title="Request + context" tag="01 / INPUT" lines={['Message · time · currency', 'Available user context']} terminal />
        <Node x={364} y={64} stage="routing" title="LangChain router" tag="02 / MODEL" lines={['PromptTemplate → model', 'withStructuredOutput']} focal />
        <Node x={680} y={64} stage="execution" title="Dispatch & execute" tag="03 / PRODUCT CODE" lines={['Task chain / domain service', 'Parse, retrieve, or calculate']} />
        <Node x={680} y={300} stage="execution" title="Clarify & continue" tag="FOLLOW-UP" lines={['Ask for missing information', 'Carry the request forward']} />
        <Node x={364} y={300} stage="composition" title="Response contract" tag="04 / STRUCTURED OUTPUT" lines={['Intent · component · data', 'Feedback · schema check']} />
        <Node x={48} y={300} stage="composition" title="Product-owned UI" tag="05 / CLIENT" lines={['Registry + dedicated views', 'Defined styles and actions']} />
        <g fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)" fill="var(--case-copy)">
          <line x1="48" y1="544" x2="88" y2="544" stroke="var(--case-muted)" strokeWidth="var(--case-icon-stroke)" />
          <text x="100" y="549">Processing path</text>
          <line x1="288" y1="544" x2="328" y2="544" stroke="var(--case-muted)" strokeWidth="var(--case-icon-stroke)" strokeDasharray="var(--case-space-6) var(--case-space-4)" />
          <text x="340" y="549">Clarification return</text>
          <text x="48" y="580">Structured-UI path shown. Text-only replies bypass UI composition.</text>
        </g>
      </svg>
    </div>
    </CaseWorkflow>
  );
}

export function MonoConfirmationWorkflow() {
  return (
    <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label="Mono transaction confirmation workflow; scroll horizontally on small screens">
      <svg viewBox="0 0 960 600" role="img" aria-labelledby="mono-confirmation-workflow-title mono-confirmation-workflow-desc">
        <title id="mono-confirmation-workflow-title">Mono: review before a transaction write</title>
        <desc id="mono-confirmation-workflow-desc">A proposed transaction remains editable until a person confirms it, product code submits the save request, and dismissing the draft saves no change.</desc>
        <Markers prefix="mono-confirmation-workflow" />
        <rect width="960" height="600" fill="var(--case-bg)" />
        <g fill="none" stroke="var(--case-muted)" strokeWidth="var(--case-icon-stroke)" markerEnd="url(#mono-confirmation-workflow-arrow)">
          <path d="M280 168 H364" />
          <path d="M596 168 H680" />
          <path d="M796 224 V360" />
          <path d="M480 224 V360" strokeDasharray="var(--case-space-6) var(--case-space-4)" />
        </g>
        <ArrowLabel x={604} y={136} width={64}>CONFIRM</ArrowLabel>
        <ArrowLabel x={804} y={280} width={112}>ON SUCCESS</ArrowLabel>
        <ArrowLabel x={488} y={280} width={112}>DISMISS</ArrowLabel>
        <Node x={48} y={112} title="Proposed change" tag="01 / AGENT OUTPUT" lines={['Parsed transaction fields', 'A draft, before persistence']} />
        <Node x={364} y={112} title="Review / edit" tag="02 / PERSON" lines={['Check the proposed values', 'Confirm or dismiss']} focal />
        <Node x={680} y={112} title="Save request" tag="03 / PRODUCT CODE" lines={['Explicit confirm callback', 'Write through data service']} />
        <Node x={680} y={360} title="Saved feedback" tag="04 / RESPONSE" lines={['Reflect the saved state', 'After a successful request']} terminal />
        <Node x={364} y={360} title="Dismiss draft" tag="ALTERNATIVE" lines={['Close or cancel the review', 'No change saved']} terminal />
        <text x="48" y="384" fill="var(--case-ink)" fontFamily="var(--case-font-heading)" fontSize="var(--case-type-eyebrow)">THE DESIGN BOUNDARY</text>
        <text x="48" y="412" fill="var(--case-copy)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">Generating a proposal does</text>
        <text x="48" y="432" fill="var(--case-copy)" fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)">not submit the change.</text>
        <g fontFamily="var(--case-font-body)" fontSize="var(--case-type-caption)" fill="var(--case-copy)">
          <line x1="48" y1="536" x2="88" y2="536" stroke="var(--case-muted)" strokeWidth="var(--case-icon-stroke)" />
          <text x="100" y="541">Confirmation path</text>
          <line x1="304" y1="536" x2="344" y2="536" stroke="var(--case-muted)" strokeWidth="var(--case-icon-stroke)" strokeDasharray="var(--case-space-6) var(--case-space-4)" />
          <text x="356" y="541">Dismissal path</text>
          <text x="48" y="580">Scope: transaction creation / editing. Read-only responses do not enter this save flow.</text>
        </g>
      </svg>
    </div>
  );
}
