import type { Decision } from '../procurement-agent-kit/DecisionCards';

// The second iteration (V2) of JobNova's resume review and application tracking, told from the job
// seeker's side. Evidence is what users told the team and what the product data showed;
// feedback is paraphrased, never presented as a quote.

const IMG = '/img/jobnova/v2';
const full = { width: 2400, height: 1500 };

export const resumeDecisions: Decision[] = [
  {
    question: 'Where does a job seeker fix what the AI wrote?',
    source: 'JobNova V2 · resume co-editing',
    options: [
      { label: 'A separate Editor tab, one form per section', verdict: 'Easy to miss, and it looked like their saved profile, so editing felt risky.' },
      { label: 'On the resume itself', verdict: 'They read and correct the tailored copy in one place. Their base profile is never touched.', chosen: true },
    ],
    evidence: 'Only 17% opened the Editor tab. People could not tell whether it held their base profile and worried an edit would overwrite it.',
    tradeoff: 'A free page is easy to break, so headings and job details are locked.',
    shot: { src: `${IMG}/resume-after.webp`, ...full, alt: 'Tailored resume: score, ATS keywords and named changes on the left, the resume edited in place on the right.', caption: 'No Editor tab. The page is the editor.' },
  },
  {
    question: 'How does a job seeker change one line, not the whole resume?',
    source: 'JobNova V2 · selection panel',
    options: [
      { label: 'Regenerate everything', verdict: 'One weak line costs them every line they already liked.' },
      { label: 'Select the words, then ask Nova', verdict: 'Three one-click fixes for this job, or any instruction. Only the selection changes, and it can be undone.', chosen: true },
    ],
    evidence: 'People found editing hard to follow, and regenerating was the only AI action.',
    tradeoff: 'Nova never invents a figure: “Add result” leaves a slot, and download waits until it is filled.',
    shot: { src: `${IMG}/resume-after-ask-open.webp`, width: 1680, height: 1518, alt: 'Part of a resume line selected, with a panel offering one-click fixes, a field to ask Nova, and edit options.', caption: 'The panel stays attached to the selection.' },
  },
  {
    question: 'How does a job seeker know the resume fits the job?',
    source: 'JobNova V2 · score and ATS check',
    options: [
      { label: 'A higher score', verdict: 'A number without a reason, next to three changes all called “Summary Enhanced”.' },
      { label: 'The score, the real gaps, and named changes', verdict: 'Keywords an applicant tracking system looks for, found and missing, and what each change did.', chosen: true },
    ],
    evidence: 'People asked to see the real gaps, such as missing ATS keywords, not just a better number.',
    tradeoff: 'Missing keywords invite stuffing, so adding one asks them to add only skills they have.',
    shot: { src: `${IMG}/resume-after-overview.webp`, width: 760, height: 1518, alt: 'Score ring from 5.2 to 7.7, ATS keywords found and missing, and three named changes.', caption: 'Amber is the resume they uploaded; lime is what tailoring added.' },
  },
];

export const trackingDecisions: Decision[] = [
  {
    question: 'How does a job seeker see where every application is?',
    source: 'JobNova V2 · pipeline',
    options: [
      { label: 'Tabs by system state', verdict: 'Queued, In process, Submitted, Failed. Interviews and offers sat inside single records.' },
      { label: 'One pipeline, queue to offer', verdict: 'Seven stages, left to right. Each card says what happened last and what it needs.', chosen: true },
    ],
    evidence: 'People check in one to three times a day and could not tell how far each application had got.',
    tradeoff: 'Seven columns need sideways scrolling; the stage tabs stay pinned and jump to any column.',
    shot: { src: `${IMG}/tracking-after-pinned.webp`, ...full, alt: 'Pipeline with pinned stage tabs above Queued, In process, Failed and Applied columns.', caption: 'The overview scrolls away; the stages stay.' },
  },
  {
    question: 'What does “in process” mean to someone waiting?',
    source: 'JobNova V2 · in-progress detail',
    options: [
      { label: '“Submitting…”', verdict: 'Stuck or nearly done? No way to tell, and no sign of what was being sent.' },
      { label: 'The step, and what is ready', verdict: 'Step 3 of 6 on the card; done and next steps, materials and answers in the detail.', chosen: true },
    ],
    evidence: 'The old status was not intuitive and left out key information.',
    shot: { src: `${IMG}/drawer-process.webp`, ...full, alt: 'An application in progress: step 2 of 6, done and upcoming steps, and the materials prepared for it.', caption: 'They can pause before the last step.' },
  },
  {
    question: 'When an application fails, what does the job seeker do?',
    source: 'JobNova V2 · failed state',
    options: [
      { label: '“Something went wrong. Please apply manually.”', verdict: 'No reason, and the tailored resume and answers seemed lost.' },
      { label: 'Where it stopped, why, and the one fix', verdict: 'Answer the missing question or pass the human check, and Auto Apply carries on from that step.', chosen: true },
    ],
    evidence: 'Most failures need something only the person can give: a missing answer, or a human check Auto Apply must not pass for them.',
    tradeoff: 'These need the person, so they are the ones JobNova emails about.',
    shot: { src: `${IMG}/drawer-failed.webp`, ...full, alt: 'A failed application stopped at step 4 of 6 on a missing salary answer, with a field to answer and retry, and the prepared materials kept.', caption: 'Everything prepared is kept.' },
  },
];
