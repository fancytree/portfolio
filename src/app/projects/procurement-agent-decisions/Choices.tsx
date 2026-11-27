/** Design exploration for version 2: three directions per question, what each gains and costs. */
import { Check, X } from 'lucide-react';
import { PRINCIPLES } from './Story';
import { SKETCHES } from './Sketches';
import styles from './Visual.module.css';

type Direction = { sketch: keyof typeof SKETCHES; name: string; gain: string; cost: string; chosen?: boolean };
const QUESTIONS: { question: string; principle: number; decision: string; directions: Direction[] }[] = [
  {
    question: 'How should a purchase begin?', principle: 1,
    decision: 'Words are the fastest start, but supplier and coverage have to be exact. So chat opens the task and fields settle it.',
    directions: [
      { sketch: 'chatExplains', name: 'Chat explains the page', gain: 'Nothing new to learn.', cost: 'Buyers who know what they want gain little.' },
      { sketch: 'freeText', name: 'Free text for everything', gain: 'Say anything, any way.', cost: 'The Agent has to guess which product is meant.' },
      { sketch: 'chatFields', name: 'Chat in, fields to decide', gain: 'Plain words, exact inputs.', cost: 'More components to design and keep.', chosen: true },
    ],
  },
  {
    question: 'How can a buyer trust a quantity?', principle: 3,
    decision: 'A quantity spends money. It has to be repeatable and open to question, so one answer carries its own reasons.',
    directions: [
      { sketch: 'threePlans', name: 'Three scenarios', gain: 'Trade-offs are visible.', cost: 'The comparing goes back to the buyer.' },
      { sketch: 'modelNumber', name: 'The model calculates', gain: 'Flexible with any input.', cost: 'Not repeatable, and it can invent numbers.' },
      { sketch: 'onePlan', name: 'One plan with reasons', gain: 'Fast to check and edit.', cost: 'The Agent must defend a single answer.', chosen: true },
    ],
  },
  {
    question: 'Where must the Agent stop?', principle: 2,
    decision: 'Ordering creates a real commitment outside the platform. The Agent prepares it and a person makes it.',
    directions: [
      { sketch: 'autoOrder', name: 'Order below a threshold', gain: 'Least manual work.', cost: 'No accuracy data to justify it.' },
      { sketch: 'approveSends', name: 'Approval places the order', gain: 'One click.', cost: 'Mixes accepting a risk with carrying it out.' },
      { sketch: 'personOrders', name: 'A person orders outside', gain: 'Responsibility stays clear.', cost: 'One manual step stays.', chosen: true },
    ],
  },
];

export default function Choices() {
  return (
    <>
      {QUESTIONS.map((item) => (
        <section key={item.question} className={styles.exploration} aria-label={item.question}>
          <h3 className={styles.question}>{item.question}</h3>
          <ol className={styles.directions}>
            {item.directions.map((d, i) => (
              <li key={d.name} className={d.chosen ? styles.chosen : undefined}>
                {SKETCHES[d.sketch]}
                <p className={styles.name}>
                  {d.chosen ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}
                  {String.fromCharCode(65 + i)} · {d.name}
                  {d.chosen ? <em>Chosen</em> : null}
                </p>
                <dl><dt>Gain</dt><dd>{d.gain}</dd><dt>Cost</dt><dd>{d.cost}</dd></dl>
              </li>
            ))}
          </ol>
          <p className={styles.decision}><span>{PRINCIPLES[item.principle - 1].phase} · {PRINCIPLES[item.principle - 1].rule}</span>{item.decision}</p>
        </section>
      ))}
    </>
  );
}
