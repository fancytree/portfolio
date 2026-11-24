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

export default function Workstation() {
  const [state, setState] = useState(0);
  const scenario = scenarios[state];

  return (
    <div className={styles.workstation}>
      <div className={styles.demoHeader}><strong>Purchase approval</strong><span>Spec v1.4 · Prototype under review</span></div>
      <div className={styles.demoSteps}>
        <div><strong>01 / Agent prepares a draft</strong><p>Uses historical sales, supplier lead time, and stock rules.</p></div>
        <div><strong>02 / Buyer reviews and decides</strong><p>Reviews evidence and adjusts quantity before authorizing a commitment.</p></div>
      </div>
      <div className={styles.states} role="group" aria-label="Try a prototype state">
        {scenarios.map(({ label }, index) => (
          <CaseButton key={label} variant="tab" aria-pressed={state === index} onClick={() => setState(index)}>{label}</CaseButton>
        ))}
      </div>
      <div className={styles.result} aria-live="polite"><strong>{scenario.title}</strong><p>{scenario.description}</p></div>
      <p className={styles.demoFooter}>Evidence to review: data provenance, error recovery, permissions, and the edit history.</p>
    </div>
  );
}
