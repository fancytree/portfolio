'use client';

import { useState } from 'react';
import { CaseButton } from '../../components/case-kit/CaseButton';
import styles from './article.module.css';

const scenarios = [
  { label: 'Default', title: 'Draft ready for review', description: 'Suggested: 240 units. Evidence is available. Buyer approval required before ordering.' },
  { label: 'Loading', title: 'Checking supplier and sales data…', description: 'The agent is preparing the draft. No order has been submitted.' },
  { label: 'Failure', title: 'Draft could not be completed', description: 'Supplier lead-time data is unavailable. Retry or prepare the order manually. No external action was taken.' },
  { label: 'No access', title: 'Approval unavailable for this role', description: 'You can review the recommendation, but only an authorized buyer can approve the supplier commitment.' },
];

const panels = ['Evidence', 'Decision log', 'Live lab', 'Constraint library', 'Evaluation'];
const evidence = [
  ['Why this flow?', 'Buyers need an auditable recommendation before they commit spend.'],
  ['Which rule?', 'A person must approve any supplier or financial commitment.'],
  ['What to verify?', 'Data provenance, error recovery, permissions, and a record of edits.'],
];

export default function Workstation() {
  const [state, setState] = useState(0);
  const scenario = scenarios[state];

  return (
    <section className={styles.workstation} aria-label="Interactive design workstation">
      <div className={styles.demoHeader}>
        <strong>Design Workstation / Purchase approval</strong>
        <span>v1.4 · Prototype under review</span>
      </div>
      <div className={styles.workstationBody}>
        <aside className={styles.workspace} aria-label="Shared workspace">
          <h3>Shared workspace</h3>
          <ul>{panels.map(panel => <li key={panel} data-selected={panel === 'Live lab' || undefined}>{panel}</li>)}</ul>
          <p>Context<br /><strong>Spec v1.4 · DS v2.1</strong><br />Last review pending</p>
        </aside>
        <div className={styles.liveLab}>
          <div className={styles.labHeader}><strong>Procurement approval</strong><span>Human decides · Agent prepares</span></div>
          <div className={styles.demoSteps}>
            <div><strong>01 / Generate draft</strong><p>Uses historical sales, supplier lead time, and stock rules.</p><small>Source-linked</small></div>
            <div><strong>02 / Review and approve</strong><p>The buyer reviews evidence and adjusts quantity before authorizing a commitment.</p><small>Human approval</small></div>
          </div>
          <div className={styles.states} role="group" aria-label="Try a prototype state">
            <span>Try a state</span>
            {scenarios.map(({ label }, index) => (
              <CaseButton key={label} variant="tab" aria-pressed={state === index} onClick={() => setState(index)}>{label}</CaseButton>
            ))}
          </div>
          <div className={styles.result} aria-live="polite"><strong>{scenario.title}</strong><p>{scenario.description}</p></div>
        </div>
        <aside className={styles.evidence} aria-label="Evidence and quality">
          <h3>Evidence and quality</h3>
          <dl>{evidence.map(([question, answer]) => <div key={question}><dt>{question}</dt><dd>{answer}</dd></div>)}</dl>
          <p><strong>Bound to DS v2.1</strong><br />Domain review pending</p>
        </aside>
      </div>
      <div className={styles.demoFooter}>
        <span><strong>Decision history</strong> v1.2 → v1.3 → v1.4</span>
        <span><strong>Evidence</strong> Interview 03 · Logs · User test 07</span>
        <span><strong>Release</strong> Pending approval</span>
      </div>
    </section>
  );
}
