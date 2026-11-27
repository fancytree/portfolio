'use client';

import { useState } from 'react';
import { BadgeCheck, BellRing, Brain, Compass, Eye, History, Hourglass, MessageSquareText, PencilLine, Repeat, RotateCcw, Search, ShieldCheck, Target, Activity, UserCheck, type LucideIcon } from 'lucide-react';
import { CaseButton } from '../../components/case-kit/CaseButton';
import { PRINCIPLES } from './Story';
import styles from './Story.module.css';

/** One icon per stage; its motion is chosen to say what the stage is about. */
const STAGE_ICONS: Record<number, [LucideIcon, string]> = {
  1: [Compass, styles.sway], 2: [Activity, styles.beat], 3: [BadgeCheck, styles.pop], 4: [History, styles.rewind],
};
const POINT_ICONS: Record<string, [LucideIcon, string]> = {
  'Discoverability & entry': [Search, styles.scan],
  'Intent & context': [MessageSquareText, styles.pop],
  'Expectation alignment': [Target, styles.beat],
  'Execution transparency': [Eye, styles.blink],
  'Human in the loop': [UserCheck, styles.pop],
  'Async & long tasks': [Hourglass, styles.flip],
  'Error handling & recovery': [RotateCcw, styles.rewind],
  'Delivery & verifiability': [ShieldCheck, styles.beat],
  'Iterative refinement': [PencilLine, styles.sway],
  'Feedback & reuse': [Repeat, styles.turn],
  'Memory & personalization': [Brain, styles.beat],
  'Proactive assistance': [BellRing, styles.ring],
};

/** The twelve points of the UX map: what each should achieve, and the problem it guards against. */
const POINTS = [
  { stage: 1, name: 'Discoverability & entry', goal: 'Users discover it right when they need it.', pain: 'They don’t know it exists, or when to use it.' },
  { stage: 1, name: 'Intent & context', goal: 'Users state intent without prompt skills.', pain: 'A blank box, and no idea what to type.' },
  { stage: 1, name: 'Expectation alignment', goal: 'Users confirm direction with minimal effort.', pain: 'They find out it is wrong only after it is done.' },
  { stage: 2, name: 'Execution transparency', goal: 'Users see progress without drowning in detail.', pain: 'They can’t see what it is doing, and waiting is stressful.' },
  { stage: 2, name: 'Human in the loop', goal: 'Users own key decisions and skip trivial ones.', pain: 'Full auto feels risky. Confirming everything is tiring.' },
  { stage: 2, name: 'Async & long tasks', goal: 'Users leave safely and pick up later.', pain: 'Tasks take long, and nobody watches the whole time.' },
  { stage: 2, name: 'Error handling & recovery', goal: 'Users stay calm and lose little.', pain: 'It is unclear why it failed, and they must start over.' },
  { stage: 3, name: 'Delivery & verifiability', goal: 'Users verify fast and use the result right away.', pain: 'They can’t tell if the result is trustworthy.' },
  { stage: 3, name: 'Iterative refinement', goal: 'Users edit precisely and keep what works.', pain: 'They want a small change, and it rewrites everything.' },
  { stage: 3, name: 'Feedback & reuse', goal: 'Feedback counts, and good results get reused.', pain: 'Good results can’t be reused, and there is nowhere to complain.' },
  { stage: 4, name: 'Memory & personalization', goal: 'Users repeat less and stay in control.', pain: 'They repeat themselves, unsure what it remembers.' },
  { stage: 4, name: 'Proactive assistance', goal: 'Users get help at the right moment, without noise.', pain: 'Forgotten unless recalled. Too many nudges annoy.' },
];

/** Pick a stage to read its principle and the points under it. */
export default function PrincipleExplorer() {
  const [stage, setStage] = useState<number>(1);
  return (
    <div className={styles.explorer}>
      <div className={styles.stages} role="group" aria-label="Design principle by stage">
        {PRINCIPLES.map((p) => {
          const [Icon, motion] = STAGE_ICONS[p.id];
          return (
            <CaseButton key={p.id} variant="tab" className={styles.stage} aria-pressed={p.id === stage} onClick={() => setStage(p.id)}>
              <Icon className={`${styles.stageIcon} ${motion}`} aria-hidden="true" />
              <span className={styles.phase}>{p.phase}</span>
              <span className={styles.rule}>{p.rule}</span>
            </CaseButton>
          );
        })}
      </div>
      {/* All stages share one cell, so the block is always as tall as the longest and the page never jumps. */}
      <div className={styles.panels} aria-live="polite">
        {PRINCIPLES.map((p) => (
          <ul key={p.id} className={p.id === stage ? styles.points : `${styles.points} ${styles.hidden}`}>
            {POINTS.filter((point) => point.stage === p.id).map((point) => {
              const [Icon, motion] = POINT_ICONS[point.name];
              return (
                <li key={point.name} className={styles.point}>
                  <div className={styles.lead}>
                    <span className={styles.chip}><Icon className={motion} aria-hidden="true" /></span>
                    <h3 className={styles.name}>{point.name}</h3>
                  </div>
                  <p className={styles.goal}>{point.goal}</p>
                  <p className={styles.pain}><span>Avoids</span>{point.pain}</p>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </div>
  );
}
