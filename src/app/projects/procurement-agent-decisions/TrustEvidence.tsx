/** How a quantity earns trust: its reasons, then a score per supplier, then a review that teaches the next plan. */
import AnnotatedShot, { type Note } from './AnnotatedShot';
import ReviewFlow from './ReviewFlow';
import styles from './Visual.module.css';

const REASONING: Note[] = [
  { title: 'Evidence, rules, activity', body: 'Check the data, supplier terms and every change beside the order.', box: [1121, 86, 264, 29], side: 'top' },
  { title: 'Reasoning steps', body: 'What it read and calculated, step by step. Folds to one line.', box: [1123, 123, 281, 204], side: 'right' },
  { title: 'What to watch', body: 'Slow movers and low stock, called out before ordering.', box: [1130, 663, 266, 70], side: 'right' },
  { title: 'Why on every line', body: 'Sales and stock beside each quantity, and the reason one click away.', box: [872, 354, 112, 270], side: 'bottom' },
];

const SCORE: Note[] = [
  { title: 'Expected accuracy', body: 'Shown before ordering, as a figure with a likely range.', box: [851, 38, 208, 61], side: 'top' },
  { title: 'Confidence', body: 'More reviewed orders, more certainty.', box: [1124, 208, 279, 137], side: 'right' },
  { title: 'Supplier score', body: 'How close past plans were for this supplier.', box: [1124, 397, 279, 59], side: 'right' },
  { title: 'What lowers it', body: 'Stock-outs, thin sales, a lead time that varies.', box: [1150, 473, 254, 164], side: 'right' },
];

export default function TrustEvidence() {
  return (
    <>
      <h4 className={styles.iteration}>First iteration · The Agent explains its evidence</h4>
      <p className={styles.iterationText}>Every quantity needs grounds. It follows a written rule: <strong>forecast daily demand × (coverage days + lead time) − stock</strong>, plus safety stock, rounded to the supplier’s pack sizes. The forecast starts from recent sales, then adjusts for <strong>regular seasonal swings</strong> and for <strong>shifts in the customer base</strong>: the share of each line of business, and how many customers it has. The user can trace each line back to what it was based on.</p>
      <AnnotatedShot
        src="/img/procurement-agent/entry/reasoning.webp"
        alt="A drafted purchase order with the Agent panel showing four reasoning steps and things to watch, and a Why link on each line."
        notes={REASONING}
        tour="evidence"
        caption="Every quantity can be traced back to what the Agent read."
      />
      <h4 className={styles.iteration}>Second iteration · A score based on each supplier</h4>
      <p className={styles.iterationText}>Suppliers are ordered from at different rhythms, so <strong>trust is earned supplier by supplier</strong>, from purchase history. Each review compares the plan with what was really needed, and the score weighs the last six reviewed orders, newest most. Fewer reviews or a shorter history mean <strong>lower confidence</strong>.</p>
      <AnnotatedShot
        src="/img/procurement-agent/entry/score.webp"
        alt="A drafted purchase order with an expected accuracy of 77% and the plan score: the supplier’s track record of 81% minus deductions."
        notes={SCORE}
        tour="score"
        caption="The plan starts from the supplier’s record, then loses points for what is uncertain this time."
      />
      <h4 className={styles.iteration}>After delivery · The Agent reviews, and learns new evidence</h4>
      <p className={styles.iterationText}>Once the goods arrive, the Agent <strong>compares the plan with what was needed</strong>. The user adds what the data can’t show. Both become <strong>new evidence for the next plan</strong>, and a rule changes only when someone publishes it.</p>
      <ReviewFlow />
    </>
  );
}
