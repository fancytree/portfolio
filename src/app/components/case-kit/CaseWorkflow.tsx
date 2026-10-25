'use client';

import { createContext, useContext, useId, useState, type ReactNode } from 'react';
import { CaseButton } from './CaseButton';
import styles from './case-workflow.module.css';

const WorkflowStage = createContext<string | null>(null);
export function useCaseWorkflowFocus(stage?: string) {
  const active = useContext(WorkflowStage);
  return stage && active !== null ? stage === active : undefined;
}

type Stage = { id: string; label: string; description: string };

/** Focus changes emphasis, never the topology or availability of the full workflow. */
export function CaseWorkflow({ title, stages, children }: {
  title: string; stages: readonly [Stage, ...Stage[]]; children: ReactNode;
}) {
  const [selected, setSelected] = useState(stages[0].id);
  const id = useId();
  const active = stages.find(stage => stage.id === selected) ?? stages[0];
  return <WorkflowStage value={active.id}>
    <div className={styles.workflow}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.controls} role="group" aria-label={`${title}: focus on a stage`}>
        {stages.map((stage, index) => <CaseButton key={stage.id} data-workflow-select={stage.id} variant="tab" aria-pressed={stage.id === active.id} aria-controls={`${id}-diagram`} onClick={() => setSelected(stage.id)}>
          {String(index + 1).padStart(2, '0')} / {stage.label}
        </CaseButton>)}
      </div>
      <p className={styles.description} aria-live="polite" aria-atomic="true"><strong>{active.label}.</strong> {active.description}</p>
      <div id={`${id}-diagram`} className={styles.diagram}>{children}</div>
    </div>
  </WorkflowStage>;
}
