import type { Metadata } from 'next';
import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import CaseStudyBackButton from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/CaseStudyControls';
import CaseStudyHero from '../../components/CaseStudyHero';
import { fontFamily } from '@/lib/design-tokens';
import AutoApplyStateSwitcher from './AutoApplyStateSwitcher';

export const metadata: Metadata = {
  title: 'JobNova AI Job Search Platform Case Study | Mei Chai',
  description:
    'A portfolio case study about designing JobNova, a 0-to-1 AI job-search platform built around explainable matching, resume customization, controlled auto apply, and application tracking.',
};

const tldrPoints = [
  {
    label: 'Context',
    body:
      'Job seekers were not missing more job boards. They were missing a continuous workflow that could help them judge fit, tailor materials, apply in time, and track what happened afterward.',
  },
  {
    label: 'Shift',
    body:
      'The first bet stacked AI features onto a broken journey: match, explain, generate materials, training, and referrals. Research showed the missing job was Auto Apply, once agent workflows made that loop possible.',
  },
  {
    label: 'Solution',
    body:
      'I shaped JobNova around four connected modules: explainable job matching, AI resume customization, controlled Auto Apply, and application tracking.',
  },
  {
    label: 'Design Principle',
    body:
      'Automation became a rules system, not a switch. Users define matching boundaries, review levels, material permissions, and notification preferences before AI acts.',
  },
  {
    label: 'Learning',
    body:
      'For a 0-to-1 AI product, the design challenge was not how many tasks AI could perform. It was when AI should act, when users should intervene, and how outcomes stay understandable and accountable.',
  },
];

const quickStats = [
  { value: '1,240', label: 'Registered users' },
  { value: '68.06%', label: '30-day onboarding completion' },
  { value: '54%', label: 'Used AI resume customization' },
  { value: '19.39%', label: 'Enabled Auto Apply' },
  { value: '8,700+', label: 'Applications completed' },
];

const personas = [
  {
    id: 'first-time',
    name: 'Alex Chen',
    role: 'Entry-Level Software Engineer (Job Seeking)',
    tag: '1st-Time Job Seeker',
    pain: 'Applying everywhere,\nhearing back from no one',
    quote: 'I’m applying every day, but I have no idea why nothing is getting through.',
    description:
      'Recent graduate seeking his first full-time role, struggling to judge fit, understand ATS rejection, and prioritize the right opportunities.',
    image: '/img/jobnova/persona-first-time.png',
  },
  {
    id: 'transitioner',
    name: 'Sarah Müller',
    role: 'Senior Marketing Manager',
    tag: 'Career transitioner',
    pain: 'Rewriting every resume,\nmissing the right moment',
    quote: 'By the time I tailor everything, the best opportunities already feel out of reach.',
    description:
      'Experienced professional transitioning into product management, balancing application quality with limited time outside her current job.',
    image: '/img/jobnova/persona-transitioner.png',
  },
] as const;

const processStages = [
  {
    number: '00',
    title: 'Early Opportunity',
    active: true,
    nodeX: 0,
    titleX: 0,
    contentX: 0,
    touchX: 0,
    width: 194,
    tasks: ['Initial concept', 'Fragmented workflow identified', 'Early product hypothesis defined'],
    touchpoints: [{ label: 'Team', color: '#494bb8', body: 'Aligned research goals and product priorities' }],
  },
  {
    number: '01',
    title: 'Discovery & Scoping',
    active: true,
    nodeX: 230.8,
    titleX: 230,
    contentX: 230,
    touchX: 230,
    width: 190,
    tasks: ['20+ user interviews and competitive research', 'Defined the core job-search problems and opportunity areas'],
    touchpoints: [
      { label: 'Product', color: '#ed5b2b', body: 'Refined the problem space and feature priorities' },
      { label: 'ML', color: '#1fb8c7', body: 'Checked whether AI could support the proposed concepts' },
      { label: 'FS', color: '#789c7d', body: 'Reviewed platform and integration constraints' },
    ],
  },
  {
    number: '02',
    title: 'Define & Design',
    active: true,
    nodeX: 471.8,
    titleX: 473,
    contentX: 469,
    touchX: 473,
    width: 216,
    tasks: [
      'Reframed the product from auto-apply to user-governed automation',
      'Designed the core flow: Match → Customize → Apply → Track',
      'Created wireframes, prototypes, and high-fidelity designs',
    ],
    touchpoints: [
      { label: 'Product', color: '#ed5b2b', body: 'Reviewed scope and design decisions at each iteration' },
      { label: 'ML', color: '#1fb8c7', body: 'Explored feasibility for matching, resume generation, and automation' },
      { label: 'FS', color: '#789c7d', body: 'Reviewed implementation feasibility before handoff' },
    ],
  },
  {
    number: '03',
    title: 'Build',
    active: false,
    nodeX: 644.2,
    titleX: 645,
    contentX: 645,
    touchX: 645,
    width: 89,
    tasks: [],
    touchpoints: [],
  },
  {
    number: '04',
    title: 'QA & Review',
    active: true,
    nodeX: 773.2,
    titleX: 773,
    contentX: 773,
    touchX: 773,
    width: 190,
    tasks: ['Reviewed live flows for design consistency', 'Checked errors, empty states, and recovery paths'],
    touchpoints: [
      { label: 'FS', color: '#ed5b2b', body: 'Direct back-and-forth to resolve UI and flow gaps' },
      { label: 'ML', color: '#1fb8c7', body: 'Reviewed output quality and failure cases' },
    ],
  },
  {
    number: '05',
    title: 'Launch',
    active: false,
    nodeX: 955.2,
    titleX: 955,
    contentX: 955,
    touchX: 955,
    width: 89,
    tasks: [],
    touchpoints: [],
  },
  {
    number: '06',
    title: 'Post-Launch',
    active: true,
    nodeX: 1176.2,
    titleX: 1105,
    contentX: 1027,
    touchX: 1042,
    width: 190,
    tasks: ['Reviewed product data and user behavior', 'Identified friction and fed insights into the next cycle'],
    touchpoints: [
      { label: 'Product', color: '#ed5b2b', body: 'Shared findings to inform roadmap priorities' },
      { label: 'ML', color: '#1fb8c7', body: 'Reviewed model performance and failure patterns' },
      { label: 'FS', color: '#789c7d', body: 'Investigated product and integration issues' },
    ],
  },
] as const;

const processLineAssets = [
  { src: '/img/jobnova/process-line-01.svg', width: 190.8 },
  { src: '/img/jobnova/process-line-02.svg', width: 201 },
  { src: '/img/jobnova/process-line-03.svg', width: 132.4 },
  { src: '/img/jobnova/process-line-04.svg', width: 89 },
  { src: '/img/jobnova/process-line-05.svg', width: 142 },
  { src: '/img/jobnova/process-line-06.svg', width: 181 },
] as const;

const beforeWorkflow: string[][] = [
  ["Job boards"],
  ["Resume editor"],
  ["ChatGPT"],
  ["Google Docs /", "Notion / …"],
  ["ATS checker"],
  ["Application", "portal"],
  ["Email"],
  ["Spreadsheet"],
];

// Hand-tuned scatter — fixed, never random: this renders on the server too.
const TOOL_POS = [
  { x: 40, y: 80 },
  { x: 176, y: 96 },
  { x: 332, y: 72 },
  { x: 468, y: 88 },
  { x: 624, y: 68 },
  { x: 752, y: 92 },
  { x: 908, y: 76 },
  { x: 1048, y: 100 },
];

// Bounce paths between tools, generated from TOOL_POS. Crossings are intentional.
const TOOL_PATHS = [
  "M 72,160 V 192 Q 72,200 80,200 H 184 Q 192,200 192,192 V 176",
  "M 216,176 V 192 Q 216,200 224,200 H 348 Q 356,200 356,192 V 152",
  "M 388,152 V 224 Q 388,232 380,232 H 248 Q 240,232 240,224 V 176",
  "M 264,176 V 208 Q 264,216 272,216 H 492 Q 500,216 500,208 V 168",
  "M 548,168 V 192 Q 548,200 556,200 H 640 Q 648,200 648,192 V 148",
  "M 680,148 V 256 Q 680,264 672,264 H 428 Q 420,264 420,256 V 152",
  "M 712,148 V 208 Q 712,216 720,216 H 776 Q 784,216 784,208 V 172",
  "M 832,172 V 192 Q 832,200 840,200 H 932 Q 940,200 940,192 V 156",
  "M 988,156 V 208 Q 988,216 996,216 H 1072 Q 1080,216 1080,208 V 180",
  "M 1128,180 V 240 Q 1128,248 1120,248 H 128 Q 120,248 120,240 V 160",
];

const jobnovaWorkflow = ['Match', 'Customize', 'Apply', 'Track'];

const researchQuestions = [
  'Where do users lose time or abandon an application?',
  'How do users decide whether a role is worth applying to?',
  'Which tasks are safe to delegate to AI?',
  'Which decisions must stay under user confirmation?',
];

const researchSegments = [
  'First-time job seekers',
  'Employed job seekers',
  'Career transition users',
];

const researchJourney = ['Discover', 'Evaluate', 'Prepare', 'Apply', 'Track'];

const researchFocusAreas = [
  'How users search, filter, and judge roles',
  'How much time resume tailoring and materials take',
  'Why users delay or abandon applications',
  'How users track application status',
  'Where users draw trust boundaries around AI',
];

const trustFocusCards = [
  {
    title: 'Transparency',
    body: 'The AI is doing complex work behind the scenes. How much of that process should users see — and in what form?',
    image: '/img/jobnova/trust-transparency.svg',
    imageSize: 116,
  },
  {
    title: 'Human Control',
    body: 'Where does autonomy end and overreach begin?',
    image: '/img/jobnova/trust-control.svg',
    imageSize: 116,
  },
  {
    title: 'Explainability',
    body: "Results mean nothing if users can't evaluate them. How do you surface reasoning?",
    image: '/img/jobnova/trust-explainability.svg',
    imageSize: 100,
  },
  {
    title: 'Credibility',
    body: 'AI can be wrong. How do you present output users feel equipped to trust?',
    image: '/img/jobnova/trust-credibility.svg',
    imageSize: 102,
  },
] as const;

const researchInsights = [
  {
    title: 'Relevance mattered more than volume',
    body:
      'Users already had access to many roles, but struggled to decide which ones deserved the effort of tailoring and applying.',
    implication: 'Matching needed explanation, not just more listings.',
  },
  {
    title: 'Opaque AI created new review work',
    body:
      'When users could not see why a role was recommended or what changed in a resume, they checked AI work manually.',
    implication: 'Automation had to reduce work without hiding decisions.',
  },
  {
    title: 'Control needs varied by user',
    body:
      'First-time job seekers wanted more guidance. Experienced users wanted precision, personal expression, and application quality.',
    implication: 'The product needed levels of control, not one automation switch.',
  },
  {
    title: 'Submitting was not the end',
    body:
      'After applying, users still needed to confirm submission, review the material version, track replies, and adjust strategy.',
    implication: 'The loop had to extend from Apply to Track.',
  },
];

const reframingRows = [
  {
    before: 'Efficiency is the biggest barrier',
    after: 'Partly true. Users also struggled with screening difficulty and opaque feedback.',
  },
  {
    before: 'More applications create more opportunities',
    after: 'Not enough. Users cared more about relevance and meaningful replies.',
  },
  {
    before: 'Users will let AI apply automatically',
    after: 'Conditionally true. Users needed explanations and execution boundaries.',
  },
  {
    before: 'Discover, Customize, Apply completes the loop',
    after: 'Incomplete. Users still needed tracking and feedback management.',
  },
];

const marketWorkflowStages = [
  { stage: 'Discover Jobs', tools: ['LinkedIn', 'Indeed'] },
  { stage: 'Resume & ATS', tools: ['Teal', 'Rezi', 'Kickresume'] },
  { stage: 'Applications', tools: ['Simplify', 'LoopCV'] },
  { stage: 'Tracking', tools: ['Huntr', 'Spreadsheet'] },
];

const principles = [
  {
    title: 'Explain before automating',
    body: 'Help users understand recommendations before AI takes action.',
  },
  {
    title: 'Keep users in control',
    body: 'Users define when AI can act and when approval is required.',
  },
  {
    title: 'Connect the entire workflow',
    body: 'Reduce context switching by bringing discovery, customization, application, and tracking into one experience.',
  },
];

const featureSections = [
  {
    label: 'Explainable Job Matching',
    title: 'The score helped users prioritize. The explanation helped them decide.',
    challenge:
      'A single match percentage was fast to scan, but it did not explain why a role was recommended, what was missing, or whether the opportunity was worth applying to.',
    decision:
      'I split matching into two layers: a list view for quick priority setting and a detail view that breaks down matched skills, gaps, role context, and resume improvement opportunities.',
    image: '/img/jobnova/Screen%201.avif',
    alt: 'JobNova job matching interface',
    visual: 'real',
    howItWorks: [
      {
        title: 'Job List',
        items: ['Match score', 'Company and location', 'Salary and work mode', 'Key match tags', 'Auto Apply status'],
      },
      {
        title: 'Job Details',
        items: ['Matched skills', 'Missing or weak requirements', 'Recommendation rationale', 'Resume improvement cues'],
      },
    ],
    iteration: [
      ['V1', 'Only showed a combined match percentage.'],
      ['Killed', 'Put the full rationale on every job card. Scanning collapsed.'],
      ['Shipped', 'Kept the score on the list; moved evidence into details.'],
    ],
    processEvidence:
      'Interview feedback showed that a score could help users sort roles, but could not explain whether an opportunity deserved their time.',
    exploration: [
      ['Early wireframe', 'A compact job card led with one match score and basic role information.'],
      ['Alternative direction', 'We explored revealing the full rationale inside every card before separating prioritization from detailed evaluation.'],
    ],
    validation: [
      'Match explanation view rate',
      'Job detail to application conversion',
      'Application rate by match band',
      'Skip or “not interested” rate',
      'Decision time before and after viewing explanations',
    ],
    observedSignal:
      'Putting the full rationale on every job card explained more and made the list unusable. The shipped list keeps the score for scanning; evidence lives in details.',
  },
  {
    label: 'AI Resume Customization',
    title: 'AI proposes changes. The user remains the final editor.',
    challenge:
      'Generating an entirely new resume reduced writing time, but increased uncertainty. Users worried AI might over-polish, invent experience, or hide important changes.',
    decision:
      'I designed an overview mode for fast review and an editor mode for precise control, with visible change summaries, keyword cues, and the ability to edit or restore content.',
    image: '/img/jobnova/Screen%203.avif',
    alt: 'JobNova AI resume customization interface',
    visual: 'real',
    howItWorks: [
      {
        title: 'Overview Mode',
        items: ['Fit score', 'Changed sections', 'New keywords', 'Change summary', 'Remaining gaps'],
      },
      {
        title: 'Editor Mode',
        items: ['Summary', 'Experience', 'Skills', 'Education', 'Projects', 'Certifications'],
      },
    ],
    iteration: [
      ['V1', 'AI generated a complete new resume.'],
      ['Killed', 'A finished document hid every change. Users had to reread the whole thing.'],
      ['Shipped', 'Overview first, then inspectable edits, with user approval before submit.'],
    ],
    processEvidence:
      'Research highlighted a new review burden: users had to reread the entire document to verify accuracy, tone, and invented details.',
    exploration: [
      ['Early wireframe', 'A generated resume replaced the original document as a single finished output.'],
      ['Alternative direction', 'We compared inline editing with a two-stage review flow that summarizes changes before detailed editing.'],
    ],
    validation: [
      'AI resume completion rate',
      'Direct-use rate after generation',
      'Editor entry rate',
      'Manual edit or restore rate',
      'Time from generation to application',
      'Generation failure and abandonment rate',
    ],
    observedSignal: '54% of registered users used AI resume customization.',
  },
  {
    label: 'Controlled Auto Apply',
    title: 'Auto Apply became a rule system, not a single switch.',
    challenge:
      'On/off could not express which roles were safe to apply for, which materials to use, or when the user needed to confirm the final action.',
    decision:
      'I structured Auto Apply around matching strategy, autonomy level, application materials, and notifications so users could define their own risk boundary.',
    image: '/img/jobnova/Screen%205.avif',
    alt: 'JobNova Auto Apply settings interface',
    visual: 'real',
    howItWorks: [
      {
        title: 'Job Matching Criteria',
        items: ['Explore All', 'Balanced', 'Precision Only'],
      },
      {
        title: 'Autonomy Level',
        items: ['Fully Automated', 'Review within 24 Hours', 'Approval Required'],
      },
      {
        title: 'Application Materials',
        items: ['Custom resume', 'Cover letter', 'Base resume', 'Review requirement'],
      },
      {
        title: 'Notifications',
        items: ['New match', 'Materials ready', 'Submitted or failed', 'Interview or rejection'],
      },
    ],
    iteration: [
      ['V1', 'Auto Apply was designed as on or off.'],
      ['Broke', 'Login expiry, queues, and retries needed named states, not a boolean. Users also did not share one trust threshold.'],
      ['Shipped', 'Kept the switch, wrapped it in matching strategy, autonomy, materials, and notifications.'],
    ],
    processEvidence:
      'Risk review revealed that users did not share one trust threshold: some wanted instant execution, while others needed time or explicit approval.',
    exploration: [
      ['Early wireframe', 'A single toggle enabled automatic applications for every role that passed a basic filter.'],
      ['Alternative direction', 'We tested the product logic as presets versus granular rules before combining understandable strategies with deeper controls.'],
    ],
    validation: [
      'Auto Apply setup completion rate',
      'Matching strategy selection',
      'Autonomy level selection',
      'Submission success and failure rate',
      'Pause, close, or rule edit rate',
      'Undo or incorrect-application report rate',
      'Retention difference between Auto Apply users and non-users',
    ],
    observedSignal:
      '51 of 263 new users enabled Auto Apply (19.39%). Among the 179 who finished onboarding, 28.5%. Submission success (88.21%) is execution, not trust.',
  },
  {
    label: 'Application Tracking',
    title: 'Automation should not disappear into the background.',
    challenge:
      'After an automated application, users still needed to know what was submitted, which materials were used, and what happened next.',
    decision:
      'I connected application records, material versions, submission states, and recruiter replies into one tracking experience.',
    image: '/img/jobnova/Screen%206.avif',
    alt: 'JobNova application tracking interface',
    visual: 'real',
    howItWorks: [
      {
        title: 'Applications Dashboard',
        items: ['Role', 'Company', 'Time', 'Resume version', 'Submission status'],
      },
      {
        title: 'Unified Inbox',
        items: ['Interview invitations', 'Rejections', 'Information requests', 'Recruiter replies'],
      },
    ],
    iteration: [
      ['Early direction', 'A dashboard listed submitted roles and their latest status.'],
      ['Gap', 'Status alone did not reveal which material was sent, why an application failed, or where a recruiter reply belonged.'],
      ['Final', 'Connected the dashboard and unified inbox to one traceable application detail view.'],
    ],
    processEvidence:
      'A system-state review showed that successful submission was not the end of the user journey; materials, failures, and recruiter responses still needed a clear owner and history.',
    exploration: [
      ['Early wireframe', 'A status-first table treated every application as a single row after submission.'],
      ['Alternative direction', 'We compared separate tracking and inbox experiences with a connected model anchored to each application record.'],
    ],
    validation: [
      'Dashboard weekly use rate',
      'Status update engagement',
      'Reply tracking completion',
      'Application detail revisit rate',
      'Unknown-status and manual-correction rate',
    ],
    observedSignal:
      '7 of 65 Inbox-classified Auto Apply users received interview invitations (10.77%). Small sample; directional only.',
  },
];

const designDecisionCopy = [
  {
    challenge: [
      { text: 'A single match score', accent: true },
      { text: ' was ' },
      { text: 'fast to scan', accent: true },
      { text: ', but it did not explain why a role was recommended, what was missing, or whether the opportunity was worth applying to.' },
    ],
    decision: [
      { text: 'I split matching into two layers: ' },
      { text: 'a list view', accent: true },
      { text: ' for quick priority setting and ' },
      { text: 'a detail view', accent: true },
      { text: ' that ' },
      { text: 'breaks down matched skills, gaps, role context, and resume improvement opportunities.', accent: true },
    ],
  },
  {
    challenge: [
      { text: 'Generating an entirely new resume', accent: true },
      { text: ' reduced writing time, but increased uncertainty. Users worried AI might over-polish, invent experience, or hide important changes.' },
    ],
    decision: [
      { text: 'I designed an ' },
      { text: 'overview mode for fast review', accent: true },
      { text: ' and ' },
      { text: 'an editor mode for precise control', accent: true },
      { text: ', with visible change summaries, keyword cues, and the ability to edit or restore content.' },
    ],
  },
  {
    challenge: [
      { text: 'On/off could not express which roles were safe to apply for, which materials to use, or when the user needed to confirm the final action.' },
    ],
    decision: [
      { text: 'I structured Auto Apply around ' },
      { text: 'matching strategy, autonomy level, application materials, and notifications', accent: true },
      { text: ' so users could define their own risk boundary.' },
    ],
  },
  {
    challenge: [
      { text: 'After an automated application, users still needed to know what was submitted, which materials were used, and what happened next.' },
    ],
    decision: [
      { text: 'I connected application records, material versions, submission states, and recruiter replies into one tracking experience.' },
    ],
  },
] as const;

const autoApplyStateModel = [
  'Job Matched',
  'Eligibility Check',
  'Application Prepared',
  'Approval / Auto Submit',
  'Submission Result',
] as const;

const realWorldConstraints = [
  [
    'Different job platforms use different forms and validation flows',
    'Categorize applications as auto-submitted, awaiting confirmation, partially manual, or unsupported',
  ],
  [
    'AI-generated content may be inaccurate',
    'Add content previews, change highlights, human review, and restore-original controls',
  ],
  [
    'Automated applications run asynchronously in the background',
    'Design clear queued, processing, success, and failure states',
  ],
  [
    'Third-party platforms can interrupt the flow at any time',
    'Retry at the end of the queue; after three failures, explain why and provide a manual continuation path',
  ],
  [
    'Recruiting status cannot always sync in real time',
    'Show the last updated time and explicit Unknown / Pending states',
  ],
] as const;

const handoffScope = [
  'Feature priority',
  'Page and component states',
  'AI generation flow',
  'Application submission states',
  'Error and recovery logic',
  'Third-party platform constraints',
  'Tracking and launch QA',
];

const designSystemItems = [
  'Typography and color tokens',
  'Buttons and form components',
  'Job and application cards',
  'Match and application status',
  'AI content highlights',
  'Success, warning, and error feedback',
  'Notification and confirmation patterns',
];

const resultMetrics = [
  {
    label: 'Activation',
    value: '68.06%',
    title: '30-day onboarding completion',
    body: '179 of 263 new users uploaded a resume and set job preferences. This is setup completion, not “finished a first job match.”',
  },
  {
    label: 'Adoption',
    value: '19.39%',
    title: '30-day Auto Apply activation',
    body: '51 of 263 new users enabled Auto Apply. Among the 179 who finished onboarding, that is 28.5%.',
  },
  {
    label: 'Reliability',
    value: '88.21%',
    title: 'Final application success rate',
    body: '1,803 automated applications submitted in 30 days, after queues and retries. It measures execution, not user trust.',
  },
  {
    label: 'Speed',
    value: '1.03 hrs',
    title: 'Match-to-application time',
    body: 'Average time from match generation to successful auto-submit, including queues and retries.',
  },
  {
    label: 'Outcome',
    value: '10.77%',
    title: 'Interview invitation rate',
    body: '7 of 65 successful Auto Apply users. Inbox-classified, n=65. Directional only.',
  },
];

const outcomeTradeoffs: { title: string; body: ReactNode }[] = [
  {
    title: '30-day onboarding completion',
    body: (
      <>
        <strong>68.06%</strong> finished resume upload and job preferences (179 of 263). That is a setup experience, not an execution metric. Shortening and clarifying onboarding is how this number moves.
      </>
    ),
  },
  {
    title: '30-day Auto Apply activation',
    body: (
      <>
        <strong>19.39%</strong> enabled Auto Apply (51 of 263). Among those who finished onboarding, <strong>28.5%</strong>. Auto Apply setup is still too long. Reducing that friction is how this number moves.
      </>
    ),
  },
];

const reflectionLearnings = [
  {
    principle: 'Understandable',
    title: 'Trust begins before the AI acts',
    body: 'A recommendation or generated result becomes useful only when users can understand the evidence, uncertainty, and changes behind it.',
  },
  {
    principle: 'Configurable',
    title: 'Control is a system, not a switch',
    body: 'Users need to define the conditions, permissions, and review boundaries under which AI is allowed to represent them.',
  },
  {
    principle: 'Accountable',
    title: 'Automation continues after execution',
    body: 'Every action must remain visible, traceable, and recoverable so users always know what happened and what requires attention next.',
  },
];

const sectionStyle = {
  padding: 'var(--case-space-section) clamp(24px, 5vw, 64px)',
} as const;

const bodyStyle = {
  fontFamily: fontFamily.sans,
} as const;

const displayStyle = {
  fontFamily: fontFamily.sans,
} as const;

function FlowDiagram({ items, label }: { items: string[]; label: string }) {
  return (
    <div className="grid border-y border-[#cccccc] md:grid-cols-[repeat(var(--flow-count),minmax(0,1fr))]" style={{ '--flow-count': items.length } as CSSProperties} aria-label={label}>
      {items.map((item, index) => (
        <div
          key={item}
          className={`relative flex min-h-[92px] items-center justify-between gap-4 border-b border-[#cccccc] py-5 pr-5 last:border-b-0 md:border-b-0 ${index < items.length - 1 ? 'md:border-r' : ''} ${index > 0 ? 'md:pl-5' : ''}`}
        >
          <div>
            <p className="m-0 mb-3 text-[12px] font-light text-[#ed5b2b]" style={bodyStyle}>
              {String(index + 1).padStart(2, '0')}
            </p>
            <p className="m-0 text-[15px] font-light leading-[1.35] text-[#0a0a0a]" style={bodyStyle}>
              {item}
            </p>
          </div>
          {index < items.length - 1 ? (
            <span className="text-[15px] font-light text-[#0a0a0a]/38 md:absolute md:-right-[11px] md:top-1/2 md:bg-white md:px-1" style={bodyStyle}>
              -&gt;
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ResponsibilityFrameworkDiagram() {
  // Each source sentence names both an AI action and a user action; the lanes just split them.
  // "Apply" is the one stage where the user acts first — that reversal is the focal point.
  const stages = [
    { eyebrow: '01 · EXPLAIN', name: 'Match', ai: ['Shows why a role', 'is recommended'], user: ['Decides whether', 'to act'], handoff: 'EVIDENCE', labelW: 72, gate: false },
    { eyebrow: '02 · COLLABORATE', name: 'Customize', ai: ['Drafts and improves', 'materials'], user: ['Keeps authorship', 'of the result'], handoff: 'DRAFT', labelW: 48, gate: false },
    { eyebrow: '03 · ACT', name: 'Apply', ai: ['Submits within', 'the limits set'], user: ['Defines the', 'boundaries first'], handoff: 'BOUNDARIES', labelW: 88, gate: true },
    { eyebrow: '04 · ACCOUNT', name: 'Track', ai: ['Logs every', 'automated action'], user: ['Inspects, reverses', 'and recovers'], handoff: 'TRACE', labelW: 48, gate: false },
  ];
  const COL_X = (i: number) => 176 + i * 256;
  const COL_CX = (i: number) => 284 + i * 256;
  const numberStyle = { fontFamily: fontFamily.mono } as const;

  return (
    <figure className="case-radius-lg m-0 overflow-hidden border border-[#cccccc] bg-white">
      <div className="overflow-x-auto p-5 sm:p-7">
        <svg viewBox="0 0 1200 400" role="img" aria-labelledby="jn-fw-title jn-fw-desc" className="block w-full min-w-[860px]">
          <title id="jn-fw-title">Four levels of AI responsibility across one workflow</title>
          <desc id="jn-fw-desc">
            Swimlane diagram of the JobNova workflow. Four stages run left to right — Match, Customize, Apply and Track —
            each carrying a level of AI responsibility: explain, collaborate, act and account. The upper lane shows what
            the AI does at each stage and the lower lane what the user does. At Match, Customize and Track the AI hands
            evidence, a draft or a trace down to the user; at Apply the direction reverses, because the user defines the
            boundaries before the AI is allowed to submit.
          </desc>
          <defs>
            <marker id="jn-fw-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="rgba(10,10,10,0.42)" />
            </marker>
            <marker id="jn-fw-arrow-gate" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#ed5b2b" />
            </marker>
          </defs>

          <line x1="32" y1="88" x2="1160" y2="88" stroke="rgba(10,10,10,0.12)" strokeWidth={0.8} />
          <line x1="32" y1="252" x2="1160" y2="252" stroke="rgba(10,10,10,0.12)" strokeWidth={0.8} />
          <text x="32" y="156" fill="rgba(10,10,10,0.42)" fontSize="12" letterSpacing="0.14em" style={numberStyle}>AI</text>
          <text x="32" y="324" fill="rgba(10,10,10,0.42)" fontSize="12" letterSpacing="0.14em" style={numberStyle}>USER</text>

          {stages.map((stage, index) => {
            const x = COL_X(index);
            const cx = COL_CX(index);
            const tone = stage.gate ? '#ed5b2b' : 'rgba(10,10,10,0.42)';
            return (
              <g key={stage.name}>
                <text x={cx} y={32} fill={tone} fontSize="12" textAnchor="middle" letterSpacing="0.14em" style={numberStyle}>
                  {stage.eyebrow}
                </text>
                <text x={cx} y={64} fill="#0a0a0a" fontSize="24" textAnchor="middle" style={bodyStyle}>
                  {stage.name}
                </text>

                <line
                  x1={cx}
                  y1={stage.gate ? 280 : 192}
                  x2={cx}
                  y2={stage.gate ? 192 : 280}
                  stroke={tone}
                  strokeWidth={1.2}
                  markerEnd={stage.gate ? 'url(#jn-fw-arrow-gate)' : 'url(#jn-fw-arrow)'}
                />
                <rect x={cx + 8} y={224} width={stage.labelW} height={16} rx={2} fill="#ffffff" />
                <text x={cx + 8 + stage.labelW / 2} y={236} fill={tone} fontSize="12" textAnchor="middle" letterSpacing="0.06em" style={numberStyle}>
                  {stage.handoff}
                </text>

                <rect x={x} y={112} width={216} height={80} rx={8} fill="#ffffff" />
                <rect x={x} y={112} width={216} height={80} rx={8} fill="rgba(10,10,10,0.03)" stroke="rgba(10,10,10,0.30)" strokeWidth={1} />
                {stage.ai.map((line, k) => (
                  <text key={line} x={cx} y={144 + 24 * k} fill="rgba(10,10,10,0.68)" fontSize="16" textAnchor="middle" style={bodyStyle}>{line}</text>
                ))}

                <rect x={x} y={280} width={216} height={80} rx={8} fill="#ffffff" />
                <rect x={x} y={280} width={216} height={80} rx={8} fill={stage.gate ? 'rgba(237,91,43,0.08)' : '#ffffff'} stroke={stage.gate ? '#ed5b2b' : '#0a0a0a'} strokeWidth={1} />
                {stage.user.map((line, k) => (
                  <text key={line} x={cx} y={312 + 24 * k} fill="rgba(10,10,10,0.68)" fontSize="16" textAnchor="middle" style={bodyStyle}>{line}</text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}

function ScopeStoryMap() {
  return (
    <figure className="case-radius-lg m-0 overflow-hidden border border-[#cccccc] bg-white">
      <div className="overflow-x-auto p-5 sm:p-7">
        <svg viewBox="0 0 992 496" role="img" aria-labelledby="jn-scope-title jn-scope-desc"
                  className="block w-full min-w-[760px]">
                <title id="jn-scope-title">MVP scope: what shipped and where we cut</title>
                <desc id="jn-scope-desc">User story map of the JobNova MVP scope decision. Four activities run left to right in the order a job seeker experiences them: Match, Customize, Apply and Track, each above the user step that had to work. Above the release cut line, the MVP slice holds the four capabilities that shipped: explainable job matching, AI resume customization, controlled auto apply and application tracking. Below the line sit examples of what was cut: job alerts, cover letters, an AI assistant and inbox sync. Controlled auto apply is marked the riskiest story because it submits on the user&apos;s behalf.</desc>

                <rect x="32" y="216" width="928" height="96" fill="rgba(10,10,10,0.02)"/>
                <line x1="312" y1="112" x2="312" y2="400" stroke="rgba(10,10,10,0.10)" strokeWidth="0.8" strokeDasharray="4,4"/>
                <line x1="516" y1="112" x2="516" y2="400" stroke="rgba(10,10,10,0.10)" strokeWidth="0.8" strokeDasharray="4,4"/>
                <line x1="720" y1="112" x2="720" y2="400" stroke="rgba(10,10,10,0.10)" strokeWidth="0.8" strokeDasharray="4,4"/>

                <rect x="120" y="40" width="180" height="64" rx="6" fill="rgba(10,10,10,0.05)" stroke="rgba(10,10,10,0.42)" strokeWidth="1"/>
                <text x="210" y="72" fill="#0a0a0a" fontSize="20" fontWeight="600" fontFamily={fontFamily.sans} textAnchor="middle">Match</text>
                <text x="210" y="92" fill="rgba(10,10,10,0.42)" fontSize="12" fontFamily={fontFamily.mono} textAnchor="middle" letterSpacing="0.14em">ACTIVITY 1</text>
                <rect x="120" y="120" width="180" height="36" rx="4" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1"/>
                <text x="210" y="144" fill="#0a0a0a" fontSize="12" fontFamily={fontFamily.sans} textAnchor="middle">See why a role fits</text>
                <rect x="324" y="40" width="180" height="64" rx="6" fill="rgba(10,10,10,0.05)" stroke="rgba(10,10,10,0.42)" strokeWidth="1"/>
                <text x="414" y="72" fill="#0a0a0a" fontSize="20" fontWeight="600" fontFamily={fontFamily.sans} textAnchor="middle">Customize</text>
                <text x="414" y="92" fill="rgba(10,10,10,0.42)" fontSize="12" fontFamily={fontFamily.mono} textAnchor="middle" letterSpacing="0.14em">ACTIVITY 2</text>
                <rect x="324" y="120" width="180" height="36" rx="4" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1"/>
                <text x="414" y="144" fill="#0a0a0a" fontSize="12" fontFamily={fontFamily.sans} textAnchor="middle">Approve the changes</text>
                <rect x="528" y="40" width="180" height="64" rx="6" fill="rgba(10,10,10,0.05)" stroke="rgba(10,10,10,0.42)" strokeWidth="1"/>
                <text x="618" y="72" fill="#0a0a0a" fontSize="20" fontWeight="600" fontFamily={fontFamily.sans} textAnchor="middle">Apply</text>
                <text x="618" y="92" fill="rgba(10,10,10,0.42)" fontSize="12" fontFamily={fontFamily.mono} textAnchor="middle" letterSpacing="0.14em">ACTIVITY 3</text>
                <rect x="528" y="120" width="180" height="36" rx="4" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1"/>
                <text x="618" y="144" fill="#0a0a0a" fontSize="12" fontFamily={fontFamily.sans} textAnchor="middle">Set the autonomy</text>
                <rect x="732" y="40" width="180" height="64" rx="6" fill="rgba(10,10,10,0.05)" stroke="rgba(10,10,10,0.42)" strokeWidth="1"/>
                <text x="822" y="72" fill="#0a0a0a" fontSize="20" fontWeight="600" fontFamily={fontFamily.sans} textAnchor="middle">Track</text>
                <text x="822" y="92" fill="rgba(10,10,10,0.42)" fontSize="12" fontFamily={fontFamily.mono} textAnchor="middle" letterSpacing="0.14em">ACTIVITY 4</text>
                <rect x="732" y="120" width="180" height="36" rx="4" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1"/>
                <text x="822" y="144" fill="#0a0a0a" fontSize="12" fontFamily={fontFamily.sans} textAnchor="middle">Submit and track</text>
                <rect x="120" y="164" width="180" height="36" rx="4" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1"/>
                <text x="210" y="188" fill="#0a0a0a" fontSize="12" fontFamily={fontFamily.sans} textAnchor="middle">Set preferences</text>

                <rect x="120" y="232" width="180" height="64" rx="4" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1"/>
                <text x="210" y="260" fill="#0a0a0a" fontSize="16" fontWeight="600" fontFamily={fontFamily.sans} textAnchor="middle">Explainable</text>
                <text x="210" y="280" fill="#0a0a0a" fontSize="16" fontWeight="600" fontFamily={fontFamily.sans} textAnchor="middle">Job Matching</text>
                <rect x="324" y="232" width="180" height="64" rx="4" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1"/>
                <text x="414" y="260" fill="#0a0a0a" fontSize="16" fontWeight="600" fontFamily={fontFamily.sans} textAnchor="middle">AI Resume</text>
                <text x="414" y="280" fill="#0a0a0a" fontSize="16" fontWeight="600" fontFamily={fontFamily.sans} textAnchor="middle">Customization</text>
                <rect x="528" y="232" width="180" height="64" rx="4" fill="rgba(237,91,43,0.08)" stroke="#ed5b2b" strokeWidth="1" strokeDasharray="4,4"/>
                <text x="618" y="260" fill="#0a0a0a" fontSize="16" fontWeight="600" fontFamily={fontFamily.sans} textAnchor="middle">Controlled</text>
                <text x="618" y="280" fill="#0a0a0a" fontSize="16" fontWeight="600" fontFamily={fontFamily.sans} textAnchor="middle">Auto Apply</text>
                <rect x="528" y="216" width="28" height="12" rx="2" fill="transparent" stroke="rgba(237,91,43,0.40)" strokeWidth="0.8"/>
                <text x="542" y="224" fill="#ed5b2b" fontSize="8" fontFamily={fontFamily.mono} textAnchor="middle" letterSpacing="0.08em">RISK</text>
                <rect x="732" y="232" width="180" height="64" rx="4" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1"/>
                <text x="822" y="260" fill="#0a0a0a" fontSize="16" fontWeight="600" fontFamily={fontFamily.sans} textAnchor="middle">Application</text>
                <text x="822" y="280" fill="#0a0a0a" fontSize="16" fontWeight="600" fontFamily={fontFamily.sans} textAnchor="middle">Tracking</text>
                <rect x="120" y="344" width="180" height="40" rx="4" fill="#ffffff" stroke="rgba(10,10,10,0.30)" strokeWidth="1"/>
                <text x="210" y="368" fill="rgba(10,10,10,0.68)" fontSize="16" fontFamily={fontFamily.sans} textAnchor="middle">Job alerts</text>
                <rect x="324" y="344" width="180" height="40" rx="4" fill="#ffffff" stroke="rgba(10,10,10,0.30)" strokeWidth="1"/>
                <text x="414" y="368" fill="rgba(10,10,10,0.68)" fontSize="16" fontFamily={fontFamily.sans} textAnchor="middle">Cover letters</text>
                <rect x="528" y="344" width="180" height="40" rx="4" fill="#ffffff" stroke="rgba(10,10,10,0.30)" strokeWidth="1"/>
                <text x="618" y="368" fill="rgba(10,10,10,0.68)" fontSize="16" fontFamily={fontFamily.sans} textAnchor="middle">AI assistant</text>
                <rect x="732" y="344" width="180" height="40" rx="4" fill="#ffffff" stroke="rgba(10,10,10,0.30)" strokeWidth="1"/>
                <text x="822" y="368" fill="rgba(10,10,10,0.68)" fontSize="16" fontFamily={fontFamily.sans} textAnchor="middle">Inbox sync</text>

                <text x="32" y="268" fill="rgba(10,10,10,0.42)" fontSize="12" fontFamily={fontFamily.mono} letterSpacing="0.14em">MVP</text>
                <text x="32" y="368" fill="rgba(10,10,10,0.42)" fontSize="12" fontFamily={fontFamily.mono} letterSpacing="0.14em">CUT</text>

                <line x1="32" y1="312" x2="960" y2="312" stroke="#ed5b2b" strokeWidth="1.5"/>
                <rect x="828" y="320" width="132" height="16" rx="2" fill="#ffffff"/>
                <text x="894" y="332" fill="#ed5b2b" fontSize="12" fontFamily={fontFamily.mono} textAnchor="middle" letterSpacing="0.14em">RELEASE CUT</text>

                <line x1="32" y1="424" x2="960" y2="424" stroke="rgba(10,10,10,0.12)" strokeWidth="0.8"/>
                <text x="32" y="452" fill="rgba(10,10,10,0.68)" fontSize="12" fontFamily={fontFamily.mono} letterSpacing="0.14em">LEGEND</text>
                <rect x="140" y="442" width="20" height="12" rx="2" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1"/>
                <text x="172" y="452" fill="rgba(10,10,10,0.68)" fontSize="12" fontFamily={fontFamily.mono}>Shipped</text>
                <rect x="360" y="442" width="20" height="12" rx="2" fill="rgba(237,91,43,0.08)" stroke="#ed5b2b" strokeWidth="1" strokeDasharray="4,4"/>
                <text x="392" y="452" fill="rgba(10,10,10,0.68)" fontSize="12" fontFamily={fontFamily.mono}>Highest risk</text>
                <line x1="612" y1="448" x2="636" y2="448" stroke="#ed5b2b" strokeWidth="1.5"/>
                <text x="648" y="452" fill="rgba(10,10,10,0.68)" fontSize="12" fontFamily={fontFamily.mono}>Release cut</text>
              </svg>
      </div>
    </figure>
  );
}

function WorkflowThesisDiagram() {
  // Layout constants — chips are evenly pitched, JobNova stages evenly quartered.
  const STAGE_CX = (i: number) => 180 + i * 280;
  const numberStyle = { fontFamily: fontFamily.mono } as const;

  return (
    <figure className="case-radius-lg m-0 overflow-hidden border border-[#cccccc] bg-white">
      <div className="overflow-x-auto p-5 sm:p-7">
        <svg
          viewBox="0 0 1200 536"
          role="img"
          aria-labelledby="jn-thesis-title jn-thesis-desc"
          className="block w-full min-w-[860px]"
        >
          <title id="jn-thesis-title">Eight disconnected tools versus one JobNova workflow</title>
          <desc id="jn-thesis-desc">
            Comparison diagram. The top row shows the eight separate products a job seeker uses to complete a single
            application — job boards, resume editor, ChatGPT, Google Docs, ATS checker, application portal, email and a
            spreadsheet — laid out as eight detached cards with seven manual handoffs between them where context is
            re-entered by hand. Below, JobNova replaces the whole row with one continuous governed workflow of four
            stages: Match, Customize, Apply and Track.
          </desc>
          <defs>
            <marker id="jn-arrow-tangle" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="rgba(10,10,10,0.30)" />
            </marker>
            <marker id="jn-arrow-ondark" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.55)" />
            </marker>
          </defs>

          {/* Lane 1 — today's toolchain, eight detached cards */}
          <text x="40" y="32" fill="rgba(10,10,10,0.42)" fontSize="12" letterSpacing="0.14em" style={numberStyle}>
            BEFORE
          </text>
          <text x="40" y="56" fill="#0a0a0a" fontSize="16" style={bodyStyle}>
            One application, eight disconnected tools
          </text>

          {TOOL_PATHS.map((d) => (
            <path key={d} d={d} fill="none" stroke="rgba(10,10,10,0.30)" strokeWidth={1} markerEnd="url(#jn-arrow-tangle)" />
          ))}

          {beforeWorkflow.map((lines, index) => {
            const { x, y } = TOOL_POS[index];
            return (
              <g key={lines.join(' ')}>
                <rect x={x} y={y} width={112} height={80} rx={8} fill="#ffffff" />
                <rect x={x} y={y} width={112} height={80} rx={8} fill="#ffffff" stroke="rgba(10,10,10,0.20)" strokeWidth={1} />
                <text x={x + 12} y={y + 24} fill="rgba(10,10,10,0.34)" fontSize="8" style={numberStyle}>
                  {String(index + 1).padStart(2, '0')}
                </text>
                {lines.map((line, k) => (
                  <text key={line} x={x + 12} y={y + 64 - 16 * (lines.length - 1 - k)} fill="rgba(10,10,10,0.68)" fontSize="12" style={bodyStyle}>
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {/* One bracket across the whole row — the handoffs are counted once, not decorated seven times */}
          <line x1="40" y1="280" x2="1160" y2="280" stroke="rgba(237,91,43,0.55)" strokeWidth={1} />
          <line x1="40" y1="280" x2="40" y2="272" stroke="rgba(237,91,43,0.55)" strokeWidth={1} />
          <line x1="1160" y1="280" x2="1160" y2="272" stroke="rgba(237,91,43,0.55)" strokeWidth={1} />
          <rect x="480" y="288" width="240" height="12" rx="2" fill="#ffffff" />
          <text x="600" y="300" fill="#ed5b2b" fontSize="12" textAnchor="middle" letterSpacing="0.06em" style={numberStyle}>
            CONTEXT RE-ENTERED AT EVERY HOP
          </text>

          {/* Lane 2 — JobNova, a single object with four stages */}
          <text x="40" y="360" fill="#ed5b2b" fontSize="12" letterSpacing="0.14em" style={numberStyle}>
            JOBNOVA
          </text>
          <text x="40" y="384" fill="#0a0a0a" fontSize="16" style={bodyStyle}>
            One continuous, governable workflow
          </text>
          <rect x="40" y="408" width="1120" height="88" rx={8} fill="#10100f" />

          {jobnovaWorkflow.map((stage, index) => (
            <g key={stage}>
              <text x={STAGE_CX(index)} y={440} fill="#aefd48" fontSize="8" textAnchor="middle" style={numberStyle}>
                {String(index + 1).padStart(2, '0')}
              </text>
              <text x={STAGE_CX(index)} y={468} fill="#ffffff" fontSize="16" textAnchor="middle" style={bodyStyle}>
                {stage}
              </text>
              {index < jobnovaWorkflow.length - 1 && (
                <line
                  x1={304 + index * 280}
                  y1={452}
                  x2={336 + index * 280}
                  y2={452}
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth={1}
                  markerEnd="url(#jn-arrow-ondark)"
                />
              )}
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="border-t border-[#cccccc] bg-white px-5 py-3 text-[11px] font-light leading-[1.5] text-[#0a0a0a]/48 sm:px-7" style={bodyStyle}>
        The product advantage was not another isolated AI feature. It was the orchestration layer connecting discovery, judgment, content, execution, and follow-up.
      </figcaption>
    </figure>
  );
}

function ExplorationPlaceholder({
  feature,
  items,
}: {
  feature: string;
  items: string[][];
}) {
  return (
    <figure className="m-0 grid gap-3 sm:grid-cols-2" aria-label={`${feature} early design exploration placeholders`}>
      {items.map(([label, description], index) => (
        <div key={label} className="case-radius-lg flex min-h-[286px] flex-col overflow-hidden border border-dashed border-[#bdbdbd] bg-[#f3f1ea] p-4">
          <div className="flex items-center justify-between">
            <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
              {label}
            </p>
            <span className="text-[10px] font-light text-[#0a0a0a]/38" style={bodyStyle}>
              Placeholder
            </span>
          </div>
          <div className="case-radius-md my-5 flex flex-1 flex-col gap-2 border border-[#cccccc] bg-white p-3" aria-hidden>
            <div className="h-2.5 w-2/5 bg-[#dedbd3]" />
            <div className="h-5 w-3/4 bg-[#cbc7bd]" />
            <div className="mt-2 grid flex-1 grid-cols-[72px_1fr] gap-3">
              <div className="bg-[#ece9e1]" />
              <div className="flex flex-col gap-2">
                <div className="h-8 border border-[#dedbd3]" />
                <div className="h-8 border border-[#dedbd3]" />
                <div className={`mt-auto h-9 ${index === 0 ? 'bg-[#dedbd3]' : 'bg-[#ed5b2b]/18'}`} />
              </div>
            </div>
          </div>
          <figcaption className="text-[12px] font-light leading-[1.55] text-[#0a0a0a]/58" style={bodyStyle}>
            {description}
          </figcaption>
        </div>
      ))}
    </figure>
  );
}

function PersonaPhotoCard({ persona }: { persona: (typeof personas)[number] }) {
  const isFirstTime = persona.id === 'first-time';

  return (
    <div className="relative size-[260px] shrink-0 overflow-hidden case-radius-xl bg-[#1b1b1b]">
      <Image
        src={persona.image}
        alt=""
        width={isFirstTime ? 457 : 340}
        height={isFirstTime ? 305 : 340}
        className={
          isFirstTime
            ? 'pointer-events-none absolute left-[-137px] top-[8px] h-[305px] w-[457px] max-w-none object-cover'
            : 'pointer-events-none absolute left-[-56px] top-[41px] size-[340px] max-w-none object-cover'
        }
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[110px] backdrop-blur-[6.7px]"
        style={{
          background:
            'linear-gradient(180deg, rgb(255 255 255 / 0) 0%, rgb(255 255 255 / 0.08) 37%, rgb(255 255 255 / 0.12) 100%)',
        }}
      />
      <div className={`absolute left-[21px] w-[217px] text-white ${isFirstTime ? 'top-[156px]' : 'top-[171px]'}`} style={bodyStyle}>
        <p className="m-0 text-[24px] font-semibold leading-none">{persona.name}</p>
        <p className="m-0 mt-2 text-[14px] font-medium leading-[1.25]">{persona.role}</p>
      </div>
      <div
        className={`absolute case-radius-md border border-[#ed5b2b] bg-white/8 px-[6px] py-1 backdrop-blur-[6.75px] ${
          isFirstTime ? 'left-[109px] top-6' : 'left-[21px] top-7'
        }`}
      >
        <p className="m-0 whitespace-nowrap text-[12px] font-medium leading-none text-[#ed5b2b]" style={bodyStyle}>
          {persona.tag}
        </p>
      </div>
    </div>
  );
}

function PersonaQuoteCard({ persona }: { persona: (typeof personas)[number] }) {
  return (
    <div className="flex size-[260px] shrink-0 flex-col items-start justify-between case-radius-xl border border-[#cccccc] px-6 py-7">
      <p className="m-0 whitespace-pre-line text-[14px] font-normal leading-[1.4] text-[#ed5b2b]" style={bodyStyle}>
        {persona.pain}
      </p>
      <div className="flex flex-col gap-[10px]">
        <Image src="/img/jobnova/persona-quote.svg" alt="" aria-hidden width={60} height={36} className="h-9 w-[60px]" />
        <p className="m-0 text-[13px] font-normal leading-[1.35] text-[#070707]" style={bodyStyle}>
          {persona.quote}
        </p>
      </div>
    </div>
  );
}

function ProcessTouchpoints({ touchpoints }: { touchpoints: (typeof processStages)[number]['touchpoints'] }) {
  if (touchpoints.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 whitespace-nowrap text-[11px] font-normal leading-none text-[#989191]" style={bodyStyle}>
        CROSS-TEAM TOUCHPOINTS
      </p>
      <div className="flex flex-col gap-[18px]">
        {touchpoints.map((touchpoint) => (
          <div key={`${touchpoint.label}-${touchpoint.body}`} className="flex flex-col items-start gap-1">
            <span
              className="inline-flex case-radius-full border px-[6px] py-[3px] text-[10px] font-normal leading-none"
              style={{ ...bodyStyle, borderColor: touchpoint.color, color: touchpoint.color }}
            >
              {touchpoint.label}
            </span>
            <p className="m-0 text-[12px] font-normal leading-[1.35] text-black" style={bodyStyle}>
              {touchpoint.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DesktopProcessTimeline() {
  return (
    <div className="relative hidden h-[518px] w-full lg:block" aria-label="JobNova design process">
      <div className="absolute left-0 top-0 h-[642px] w-[1216px] origin-top-left" style={{ transform: 'scale(0.8059)' }}>
        <div className="absolute left-0 top-0 flex w-[1216px] items-center">
          {processStages.map((stage, index) => (
            <div key={stage.number} className="contents">
              <div
                className={`flex size-9 shrink-0 items-center justify-center case-radius-full bg-[#070707] text-[14px] font-normal leading-none text-white ${
                  stage.active ? '' : 'opacity-25'
                }`}
                style={bodyStyle}
              >
                {stage.number}
              </div>
              {index < processLineAssets.length ? (
                <Image
                  src={processLineAssets[index].src}
                  alt=""
                  aria-hidden
                  width={Math.ceil(processLineAssets[index].width)}
                  height={1}
                  className="h-px max-w-none shrink-0"
                  style={{ width: processLineAssets[index].width }}
                />
              ) : null}
            </div>
          ))}
        </div>

        {processStages.map((stage) => (
          <div key={`content-${stage.number}`} className="contents">
            <p
              className={`absolute m-0 text-[14px] font-medium leading-5 text-black ${stage.active ? '' : 'opacity-25'}`}
              style={{ ...bodyStyle, left: stage.titleX, top: 56, width: stage.number === '00' ? 154 : 118 }}
            >
              {stage.title}
            </p>

            {stage.tasks.length > 0 ? (
              <>
                <Image
                  src="/img/jobnova/process-drop.svg"
                  alt=""
                  aria-hidden
                  width={47}
                  height={5}
                  className="absolute h-[5px] w-[47px] max-w-none origin-left rotate-90"
                  style={{ left: stage.nodeX + 20, top: 116 }}
                />
                <ul
                  className="absolute m-0 list-disc pl-[18px] text-[12px] font-normal leading-5 text-black"
                  style={{ ...bodyStyle, left: stage.contentX, top: 177, width: stage.width }}
                >
                  {stage.tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
                <div className="absolute" style={{ left: stage.touchX, top: 373, width: 175 }}>
                  <ProcessTouchpoints touchpoints={stage.touchpoints} />
                </div>
              </>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileProcessTimeline() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:hidden" aria-label="JobNova design process">
      {processStages.map((stage) => (
        <article className={`case-radius-lg border border-[#cccccc] p-5 ${stage.active ? '' : 'opacity-40'}`} key={stage.number}>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center case-radius-full bg-[#070707] text-[14px] text-white" style={bodyStyle}>
              {stage.number}
            </span>
            <h3 className="m-0 text-[14px] font-medium leading-[1.3] text-black" style={bodyStyle}>
              {stage.title}
            </h3>
          </div>
          {stage.tasks.length > 0 ? (
            <ul className="m-0 mb-8 list-disc pl-[18px] text-[13px] font-normal leading-[1.55] text-black" style={bodyStyle}>
              {stage.tasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          ) : null}
          <ProcessTouchpoints touchpoints={stage.touchpoints} />
        </article>
      ))}
    </div>
  );
}

const decisionVisuals = [
  [
    { src: '/img/jobnova/decision-match-list.png', alt: 'Annotated JobNova job list and match score design', width: 1163, height: 515, left: -144, top: 31 },
    { src: '/img/jobnova/decision-match-detail.png', alt: 'Annotated JobNova explainable job details design', width: 1127, height: 949, left: -126, top: 621 },
  ],
  [
    { src: '/img/jobnova/decision-resume.png', alt: 'Annotated JobNova AI resume customization design', width: 1121, height: 1258, left: -148, top: 13 },
  ],
  [
    { src: '/img/jobnova/decision-auto-apply-190-10788.png', alt: 'Annotated JobNova controlled Auto Apply settings design', width: 1120, height: 669, left: -92, top: 7 },
  ],
  [
    { src: '/img/jobnova/decision-tracking-top.png', alt: 'Annotated JobNova application tracking overview', width: 2480, height: 1766, left: 6, top: 22 },
    { src: '/img/jobnova/decision-tracking-detail.png', alt: 'Annotated JobNova application and inbox tracking design', width: 2726, height: 2866, left: -108, top: 651 },
  ],
] as const;

function DesignDecisionVisual({ index }: { index: number }) {
  const visuals = decisionVisuals[index];

  return (
    <div className="flex w-full flex-col gap-5">
      {visuals.map((visual) => (
        <figure key={visual.src} className="m-0 w-full case-radius-xl bg-[#f3f1ea] p-3 sm:p-4">
          <Image
            src={visual.src}
            alt={visual.alt}
            width={visual.width}
            height={visual.height}
            loading={
              visual.src.endsWith('decision-tracking-detail.png') ||
              visual.src.endsWith('decision-auto-apply-190-10788.png')
                ? 'eager'
                : 'lazy'
            }
            unoptimized={
              visual.src.endsWith('decision-tracking-detail.png') ||
              visual.src.endsWith('decision-auto-apply-190-10788.png')
            }
            className="block h-auto w-full object-contain"
            sizes="(min-width: 1280px) 980px, calc(100vw - 48px)"
          />
        </figure>
      ))}
    </div>
  );
}

function MatchingDesignDecisionSection() {
  const feature = featureSections[0];
  const decisionComparison = [
    ['AI gives a score', 'AI explains the score'],
    ['Recommendation first', 'Evidence first'],
    ['System decides', 'User decides with evidence'],
  ];
  const matchingPrinciples = [
    {
      title: 'Prioritize before explaining',
      body: 'The list helps users scan and rank opportunities before investing attention.',
    },
    {
      title: 'Explain before asking users to act',
      body: 'The detail view provides the recommendation evidence, not only a score.',
    },
    {
      title: 'Highlight uncertainty',
      body: 'Skill gaps remain visible instead of presenting AI judgment as complete certainty.',
    },
  ];

  return (
    <section
      className="flex w-full flex-col gap-14"
      data-case-nav-label="01 / Explainable Job Matching"
      aria-labelledby="matching-decision-title"
    >
      <div className="flex flex-col gap-12 border-t border-[#0a0a0a] pt-8">
        <header className="grid gap-7 lg:grid-cols-[180px_1fr]">
          <div>
            <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
              Design Decision 01
            </p>
            <p className="m-0 mt-3 text-[11px] font-light text-[#0a0a0a]/38" style={bodyStyle}>
              Explainable Job Matching
            </p>
          </div>
          <div>
            <h3
              data-case-type="display"
              id="matching-decision-title"
              className="m-0 max-w-[760px] text-[clamp(38px,5.4vw,72px)] font-normal leading-[0.98] tracking-[-0.035em] text-[#0a0a0a]"
              style={displayStyle}
            >
              Making AI recommendations understandable
            </h3>
            <p className="m-0 mt-6 max-w-[700px] text-[18px] font-light leading-[1.5] text-[#0a0a0a]/62" style={bodyStyle}>
              How can AI help users make confident decisions, instead of simply providing more recommendations?
            </p>
          </div>
        </header>

        <div className="grid gap-8 border-y border-[#cccccc] py-8 lg:grid-cols-2">
          <article>
            <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
              1. The Design Challenge
            </p>
            <p className="m-0 mt-5 text-[15px] font-light leading-[1.65] text-[#0a0a0a]/68" style={bodyStyle}>
              Users received a high volume of job recommendations every day. The difficult part was not finding another role—it was deciding which opportunity deserved the time required to apply.
            </p>
            <p className="m-0 mt-4 text-[15px] font-light leading-[1.65] text-[#0a0a0a]/68" style={bodyStyle}>
              Most AI products returned a Match Score without explaining its basis, forcing users to reread the job description and verify the recommendation themselves.
            </p>
            <p className="m-0 mt-7 border-l border-[#ed5b2b] pl-5 text-[17px] font-normal leading-[1.5] text-[#0a0a0a]" style={bodyStyle}>
              Users didn’t lack recommendations—they lacked confidence in acting on them.
            </p>
          </article>

          <article className="lg:border-l lg:border-[#cccccc] lg:pl-8">
            <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
              2. What We Learned
            </p>
            <div className="mt-5 flex flex-col">
              {[
                'A higher Match Score did not automatically make a recommendation more believable.',
                'Recommendations without explanation still created manual verification work.',
                'Users wanted help understanding the opportunity—not a system that made the decision for them.',
              ].map((item, index) => (
                <div
                  key={item}
                  className={`flex gap-4 py-4 ${index < 2 ? 'border-b border-[#e1e1e1]' : ''}`}
                >
                  <span className="text-[11px] font-light text-[#ed5b2b]" style={bodyStyle}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="m-0 text-[14px] font-light leading-[1.55] text-[#0a0a0a]/68" style={bodyStyle}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
            <p data-case-type="body" className="m-0 mt-7 text-[21px] font-normal leading-[1.35] text-[#0a0a0a]" style={displayStyle}>
              Trust comes from understanding, not prediction accuracy alone.
            </p>
          </article>
        </div>

        <section className="flex flex-col gap-6" aria-labelledby="matching-core-decision">
          <div className="max-w-[820px]">
            <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
              3. Design Decision
            </p>
            <h4
              data-case-type="display"
              id="matching-core-decision"
              className="m-0 mt-3 text-[clamp(30px,4vw,50px)] font-normal leading-[1.08] tracking-[-0.025em] text-[#0a0a0a]"
              style={displayStyle}
            >
              We shifted from prediction to explanation.
            </h4>
            <p className="m-0 mt-5 max-w-[720px] text-[15px] font-light leading-[1.65] text-[#0a0a0a]/66" style={bodyStyle}>
              Improving the score alone would make the system appear more precise without reducing the user’s verification burden. We treated explainability as the primary interaction problem: surface the evidence behind the recommendation, then let the user decide.
            </p>
          </div>

          <div className="case-radius-lg overflow-hidden border border-[#cccccc]">
            <div className="grid grid-cols-2 border-b border-[#cccccc] bg-[#f3f1ea] px-5 py-3 text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/42" style={bodyStyle}>
              <p className="m-0">Before</p>
              <p className="m-0">After</p>
            </div>
            {decisionComparison.map(([before, after], index) => (
              <div
                key={before}
                className={`grid grid-cols-2 gap-5 px-5 py-5 ${
                  index < decisionComparison.length - 1 ? 'border-b border-[#cccccc]' : ''
                }`}
              >
                <p className="m-0 text-[15px] font-light text-[#0a0a0a]/48" style={bodyStyle}>
                  {before}
                </p>
                <p className="m-0 text-[15px] font-normal text-[#0a0a0a]" style={bodyStyle}>
                  {after}
                </p>
              </div>
            ))}
          </div>

          <div className="case-radius-lg grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-3">
            {feature.iteration.map(([stage, description]) => (
              <article key={stage} className="bg-white p-5">
                <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
                  {stage}
                </p>
                <p className="m-0 mt-4 text-[13px] font-light leading-[1.55] text-[#0a0a0a]/66" style={bodyStyle}>
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-5" aria-labelledby="matching-principles-title">
          <div>
            <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
              4. Design Principles
            </p>
            <h4 data-case-type="small-title" id="matching-principles-title" className="m-0 mt-2 text-[20px] font-normal text-[#0a0a0a]" style={bodyStyle}>
              Three principles translated explainability into interaction rules.
            </h4>
          </div>
          <div className="grid border-y border-[#cccccc] md:grid-cols-3">
            {matchingPrinciples.map((principle, index) => (
              <article
                key={principle.title}
                className={`min-h-[190px] py-6 md:px-6 ${
                  index < matchingPrinciples.length - 1 ? 'border-b border-[#cccccc] md:border-b-0 md:border-r' : ''
                } ${index === 0 ? 'md:pl-0' : ''}`}
              >
                <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h5 className="m-0 mt-6 text-[17px] font-normal leading-[1.35] text-[#0a0a0a]" style={displayStyle}>
                  {principle.title}
                </h5>
                <p className="m-0 mt-3 text-[13px] font-light leading-[1.55] text-[#0a0a0a]/62" style={bodyStyle}>
                  {principle.body}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-10 border-t border-[#0a0a0a] pt-10">
        <header>
          <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
            5. Translating the Decision into the Experience
          </p>
          <h4 data-case-type="display" className="m-0 mt-3 max-w-[760px] text-[clamp(30px,4vw,52px)] font-normal leading-[1.06] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>
            The interface made evidence available at the moment each decision required it.
          </h4>
        </header>

        <figure className="m-0">
          <div className="mb-4 grid gap-4 md:grid-cols-[180px_1fr]">
            <div>
              <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
                A. Job List
              </p>
              <p className="m-0 mt-2 text-[14px] font-light leading-[1.55] text-[#0a0a0a]/66" style={bodyStyle}>
                Helps users compare and prioritize opportunities.
              </p>
            </div>
            <p className="m-0 max-w-[560px] text-[16px] font-normal leading-[1.5] text-[#0a0a0a]" style={bodyStyle}>
              The list supports prioritization, not final decision-making.
            </p>
          </div>
          <div className="case-radius-lg overflow-hidden bg-[#f3f1ea] p-4 sm:p-6">
            <Image
              src="/img/jobnova/decision-match-list.png"
              alt="JobNova job list showing match score, key role information, salary, work mode, and saved state."
              width={1163}
              height={515}
              className="h-auto w-full"
            />
          </div>
        </figure>

        <figure className="m-0">
          <div className="mb-4 grid gap-4 md:grid-cols-[180px_1fr]">
            <div>
              <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
                B. Job Details
              </p>
              <p className="m-0 mt-2 text-[14px] font-light leading-[1.55] text-[#0a0a0a]/66" style={bodyStyle}>
                Explains the recommendation using role evidence.
              </p>
            </div>
            <p className="m-0 max-w-[610px] text-[16px] font-normal leading-[1.5] text-[#0a0a0a]" style={bodyStyle}>
              Detailed evidence helps users evaluate recommendations instead of trusting the score blindly.
            </p>
          </div>
          <div className="case-radius-lg overflow-hidden bg-[#f3f1ea] p-4 sm:p-6">
            <Image
              src="/img/jobnova/decision-match-detail.png"
              alt="JobNova job detail experience explaining fit, skills, role requirements, and resume suggestions."
              width={1127}
              height={949}
              className="h-auto w-full"
            />
          </div>
        </figure>

        <section className="grid gap-7 border-y border-[#cccccc] py-8 lg:grid-cols-[0.8fr_1.2fr]" aria-labelledby="skill-gap-title">
          <div>
            <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
              C. Skill Gap
            </p>
            <h4 data-case-type="title" id="skill-gap-title" className="m-0 mt-3 text-[26px] font-normal leading-[1.15] text-[#0a0a0a]" style={displayStyle}>
              Make uncertainty visible
            </h4>
            <p className="m-0 mt-5 max-w-[360px] text-[15px] font-normal leading-[1.55] text-[#0a0a0a]" style={bodyStyle}>
              Showing what the AI didn’t know increased confidence more than hiding uncertainty.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Matching Skills', ['Interaction design', 'User research', 'Prototyping', 'Cross-functional work']],
              ['Missing Skills', ['Enterprise systems', 'Design leadership', 'Domain-specific tooling']],
            ].map(([label, items], index) => (
              <article key={label as string} className={`case-radius-lg p-5 ${index === 0 ? 'bg-[#aefd48]/12' : 'border border-[#ed5b2b]/40 bg-[#ed5b2b]/[0.04]'}`}>
                <p className="m-0 text-[12px] font-normal text-[#0a0a0a]" style={bodyStyle}>
                  {label as string}
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  {(items as string[]).map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className={`size-1.5 case-radius-full ${index === 0 ? 'bg-[#65a900]' : 'bg-[#ed5b2b]'}`} aria-hidden />
                      <p className="m-0 text-[13px] font-light text-[#0a0a0a]/68" style={bodyStyle}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-7 lg:grid-cols-[1fr_280px]" aria-labelledby="matching-outcome-title">
          <div>
            <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
              6. Outcome
            </p>
            <h4 data-case-type="small-title" id="matching-outcome-title" className="m-0 mt-2 text-[20px] font-normal text-[#0a0a0a]" style={bodyStyle}>
              Feature-level signals, not whole-product metrics
            </h4>
            <div className="mt-5 flex flex-wrap gap-2">
              {feature.validation.map((metric) => (
                <span
                  key={metric}
                  className="case-radius-sm border border-[#cccccc] px-3 py-2 text-[11px] font-light leading-[17px] text-[#0a0a0a]/68"
                  style={bodyStyle}
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>
          <aside className="border-l border-[#ed5b2b] pl-5">
            <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
              Available launch signal
            </p>
            <p className="m-0 mt-3 text-[16px] font-normal leading-[1.5] text-[#0a0a0a]" style={bodyStyle}>
              {feature.observedSignal}
            </p>
            <p className="m-0 mt-3 text-[11px] font-light leading-[1.5] text-[#0a0a0a]/48" style={bodyStyle}>
              Explanation-view and trust metrics remain validation targets until measured values are available.
            </p>
          </aside>
        </section>

        <blockquote className="m-0 border-y border-[#0a0a0a] py-9">
          <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
            7. Key Takeaway
          </p>
          <p data-case-type="quote" className="m-0 mt-5 max-w-[900px] text-[clamp(24px,3.5vw,46px)] font-normal leading-[1.12] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>
            Helping users understand a recommendation was ultimately more valuable than making the recommendation appear more intelligent.
          </p>
        </blockquote>
      </div>
    </section>
  );
}

function ResumeDesignDecisionSection() {
  const feature = featureSections[1];
  const decisionComparison = [
    ['Generate a new resume', 'Improve the existing resume'],
    ['Replace user content', 'Suggest visible changes'],
    ['AI owns the draft', 'User approves every change'],
  ];
  const resumePrinciples = [
    {
      title: 'Preserve authorship',
      body: 'AI can suggest improvements, but the final professional story belongs to the user.',
    },
    {
      title: 'Make every change visible',
      body: 'Edits are highlighted and explained instead of silently replacing original content.',
    },
    {
      title: 'Review before submission',
      body: 'AI-generated changes require user confirmation before they become application material.',
    },
  ];
  const experienceMechanisms = [
    {
      label: 'A. Overview Before Editing',
      title: 'Understand the scope first',
      items: ['Resume score', 'Suggested improvements', 'Section summary'],
      body: 'Users first understand the scope of AI suggestions before entering detailed editing.',
    },
    {
      label: 'B. Transparent Editing',
      title: 'Keep every modification inspectable',
      items: ['Highlighted changes', 'Accept / Reject', 'Inline editing'],
      body: 'Every AI modification remained visible and editable.',
    },
    {
      label: 'C. User Approval',
      title: 'Let the user make the final decision',
      items: ['Final preview', 'Save', 'Generate PDF', 'Continue to Apply'],
      body: 'AI prepared the content, but users made the final decision.',
    },
  ];

  return (
    <section
      className="flex w-full flex-col gap-11 border-t border-[#0a0a0a] pt-8"
      data-case-nav-label="02 / AI Resume Customization"
      aria-labelledby="resume-decision-title"
    >
      <header className="grid gap-7 lg:grid-cols-[180px_1fr]">
        <div>
          <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
            Design Decision 02
          </p>
          <p className="m-0 mt-3 text-[11px] font-light text-[#0a0a0a]/38" style={bodyStyle}>
            AI Resume Customization
          </p>
        </div>
        <div>
          <h3
            data-case-type="display"
            id="resume-decision-title"
            className="m-0 max-w-[760px] text-[clamp(36px,5vw,64px)] font-normal leading-[0.99] tracking-[-0.035em] text-[#0a0a0a]"
            style={displayStyle}
          >
            Preserving user authorship in AI-assisted editing
          </h3>
          <p className="m-0 mt-5 max-w-[720px] text-[17px] font-light leading-[1.5] text-[#0a0a0a]/62" style={bodyStyle}>
            How can AI improve application materials while ensuring users remain the author of their own experience?
          </p>
        </div>
      </header>

      <div className="grid gap-8 border-y border-[#cccccc] py-8 lg:grid-cols-2">
        <article>
          <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
            1. The Design Challenge
          </p>
          <p className="m-0 mt-5 text-[14px] font-light leading-[1.65] text-[#0a0a0a]/68" style={bodyStyle}>
            Tailoring a resume for every application was repetitive and time-consuming. Users wanted AI to accelerate the process, but they were uncomfortable submitting content they had not reviewed.
          </p>
          <p className="m-0 mt-4 text-[14px] font-light leading-[1.65] text-[#0a0a0a]/68" style={bodyStyle}>
            Blindly accepting a generated resume reduced confidence and raised concerns about accuracy, exaggeration, and whether the result still represented the user.
          </p>
          <p className="m-0 mt-6 border-l border-[#ed5b2b] pl-5 text-[17px] font-normal leading-[1.5] text-[#0a0a0a]" style={bodyStyle}>
            Users wanted AI to speed up writing—not to speak on their behalf.
          </p>
        </article>

        <article className="lg:border-l lg:border-[#cccccc] lg:pl-8">
          <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
            2. What We Learned
          </p>
          <p className="m-0 mt-5 text-[14px] font-light leading-[1.65] text-[#0a0a0a]/68" style={bodyStyle}>
            The core concern was not whether AI could write. Users needed to know whether the result still reflected their experience, exactly what had changed, and whether each edit could be trusted.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['Is this still my experience?', 'What exactly changed?', 'Can I trust these edits?'].map((question) => (
              <span
                key={question}
                className="case-radius-sm border border-[#cccccc] bg-[#f3f1ea] px-3 py-2 text-[12px] font-light text-[#0a0a0a]/66"
                style={bodyStyle}
              >
                {question}
              </span>
            ))}
          </div>
          <p data-case-type="body" className="m-0 mt-7 text-[21px] font-normal leading-[1.35] text-[#0a0a0a]" style={displayStyle}>
            Transparency mattered more than automation during content creation.
          </p>
        </article>
      </div>

      <section className="flex flex-col gap-6" aria-labelledby="resume-core-decision">
        <div className="max-w-[820px]">
          <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
            3. Design Decision
          </p>
          <h4
            data-case-type="display"
            id="resume-core-decision"
            className="m-0 mt-3 text-[clamp(30px,4vw,50px)] font-normal leading-[1.08] tracking-[-0.025em] text-[#0a0a0a]"
            style={displayStyle}
          >
            We designed AI as a collaborator, not the final author.
          </h4>
          <p className="m-0 mt-5 max-w-[720px] text-[15px] font-light leading-[1.65] text-[#0a0a0a]/66" style={bodyStyle}>
            Instead of replacing the document with a finished AI output, the system improved the user’s existing resume through visible suggestions and explicit approval.
          </p>
        </div>

        <div className="case-radius-lg overflow-hidden border border-[#cccccc]">
          <div className="grid grid-cols-2 border-b border-[#cccccc] bg-[#f3f1ea] px-5 py-3 text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/42" style={bodyStyle}>
            <p className="m-0">Before</p>
            <p className="m-0">After</p>
          </div>
          {decisionComparison.map(([before, after], index) => (
            <div
              key={before}
              className={`grid grid-cols-2 gap-5 px-5 py-4 ${
                index < decisionComparison.length - 1 ? 'border-b border-[#cccccc]' : ''
              }`}
            >
              <p className="m-0 text-[14px] font-light text-[#0a0a0a]/48" style={bodyStyle}>
                {before}
              </p>
              <p className="m-0 text-[14px] font-normal text-[#0a0a0a]" style={bodyStyle}>
                {after}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid border-y border-[#cccccc] md:grid-cols-3" aria-label="Resume customization design principles">
        {resumePrinciples.map((principle, index) => (
          <article
            key={principle.title}
            className={`min-h-[172px] py-5 md:px-6 ${
              index < resumePrinciples.length - 1 ? 'border-b border-[#cccccc] md:border-b-0 md:border-r' : ''
            } ${index === 0 ? 'md:pl-0' : ''}`}
          >
            <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
              4.{index + 1}
            </p>
            <h5 className="m-0 mt-5 text-[17px] font-normal leading-[1.3] text-[#0a0a0a]" style={displayStyle}>
              {principle.title}
            </h5>
            <p className="m-0 mt-2 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/62" style={bodyStyle}>
              {principle.body}
            </p>
          </article>
        ))}
      </section>

      <section className="flex flex-col gap-6" aria-labelledby="resume-experience-title">
        <div>
          <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
            5. Translating the Decision into the Experience
          </p>
          <h4 data-case-type="small-title" id="resume-experience-title" className="m-0 mt-2 text-[22px] font-normal text-[#0a0a0a]" style={bodyStyle}>
            Three mechanisms preserved ownership without slowing the user down.
          </h4>
        </div>

        <div className="case-radius-lg grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-3">
          {experienceMechanisms.map((mechanism) => (
            <article key={mechanism.label} className="flex min-h-[284px] flex-col bg-white p-5">
              <p className="m-0 text-[10px] font-light uppercase tracking-[0.1em] text-[#ed5b2b]" style={bodyStyle}>
                {mechanism.label}
              </p>
              <h5 className="m-0 mt-5 text-[17px] font-normal leading-[1.3] text-[#0a0a0a]" style={displayStyle}>
                {mechanism.title}
              </h5>
              <div className="mt-5 flex flex-wrap gap-2">
                {mechanism.items.map((item) => (
                  <span
                    key={item}
                    className="border border-[#d8d8d8] px-2.5 py-1.5 text-[10px] font-light text-[#0a0a0a]/62"
                    style={bodyStyle}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="m-0 mt-auto pt-6 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/62" style={bodyStyle}>
                {mechanism.body}
              </p>
            </article>
          ))}
        </div>

        <figure className="case-radius-lg m-0 overflow-hidden bg-[#f3f1ea] p-4 sm:p-6">
          <div className="max-h-[680px] overflow-hidden">
            <Image
              src="/img/jobnova/decision-resume.png"
              alt="JobNova resume overview and editor showing visible AI changes, section controls, and final document preview."
              width={1121}
              height={1258}
              className="h-auto w-full"
            />
          </div>
        </figure>
      </section>

      <section className="grid gap-7 border-t border-[#cccccc] pt-7 lg:grid-cols-[1fr_280px]" aria-labelledby="resume-outcome-title">
        <div>
          <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
            6. Outcome
          </p>
          <h4 data-case-type="small-title" id="resume-outcome-title" className="m-0 mt-2 text-[19px] font-normal text-[#0a0a0a]" style={bodyStyle}>
            Resume-specific validation signals
          </h4>
          <div className="mt-4 flex flex-wrap gap-2">
            {feature.validation.map((metric) => (
              <span
                key={metric}
                className="case-radius-sm border border-[#cccccc] px-3 py-2 text-[11px] font-light leading-[17px] text-[#0a0a0a]/68"
                style={bodyStyle}
              >
                {metric}
              </span>
            ))}
          </div>
        </div>
        <aside className="border-l border-[#ed5b2b] pl-5">
          <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
            Available launch signal
          </p>
          <p className="m-0 mt-3 text-[16px] font-normal leading-[1.5] text-[#0a0a0a]" style={bodyStyle}>
            {feature.observedSignal}
          </p>
        </aside>
      </section>

      <blockquote className="m-0 border-y border-[#0a0a0a] py-8">
        <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
          7. Key Takeaway
        </p>
        <p data-case-type="quote" className="m-0 mt-4 max-w-[900px] text-[clamp(22px,3vw,38px)] font-normal leading-[1.16] tracking-[-0.02em] text-[#0a0a0a]" style={displayStyle}>
          AI became a writing partner rather than an automatic author, allowing users to move faster without giving up ownership of their professional story.
        </p>
      </blockquote>
    </section>
  );
}

function AutoApplyDesignDecisionSection() {
  const feature = featureSections[2];
  const decisionComparison = [
    ['One-click Auto Apply', 'Rule-based automation'],
    ['Same behavior for everyone', 'User-defined autonomy'],
    ['Automation as a feature', 'Automation as a configurable system'],
  ];
  const autonomyPrinciples = [
    {
      title: 'AI acts only within explicit user rules',
      body: 'The system cannot silently expand the role, material, or action permissions a user granted.',
    },
    {
      title: 'Configure autonomy before automation begins',
      body: 'Control is established before execution rather than added as a recovery mechanism afterward.',
    },
    {
      title: 'Every automated action remains visible',
      body: 'Queued, processing, approval, submission, and failure states stay inspectable.',
    },
    {
      title: 'Recovery is part of automation',
      body: 'Failures expose their cause and preserve a clear retry or manual continuation path.',
    },
  ];
  const ruleGroups = [
    ['Match Threshold', 'Define the minimum role relevance AI may act on.'],
    ['Job Preferences', 'Limit execution to the user’s role, location, salary, and work-mode rules.'],
    ['Resume Selection', 'Choose which base material AI may tailor and submit.'],
    ['Notification Preference', 'Decide which actions and outcomes require attention.'],
  ];
  const exceptions = [
    ['Platform unsupported', 'Keep the match and direct the user to a manual application path.'],
    ['Missing information', 'Pause execution and ask only for the information required to continue.'],
    ['Login expired', 'Explain that authentication stopped the flow and preserve the prepared application.'],
    ['Submission failed', 'Retry safely, expose the failure reason, or hand control back to the user.'],
  ];
  const implementationFlow = ['Matched', 'Eligible', 'Prepare', 'Approval / Auto Submit', 'Submitted', 'Failed → Recovery'];
  const outcomeMetrics = ['Auto Apply adoption', 'Approval rate', 'Successful submission rate', 'Manual intervention rate'];

  return (
    <section
      className="flex w-full flex-col gap-14 border-t border-[#0a0a0a] pt-8"
      data-case-nav-label="03 / Controlled Auto Apply"
      aria-labelledby="autonomy-decision-title"
    >
      <div className="flex flex-col gap-12">
        <header className="grid gap-7 lg:grid-cols-[180px_1fr]">
          <div>
            <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
              Design Decision 03
            </p>
            <p className="m-0 mt-3 text-[11px] font-light text-[#0a0a0a]/38" style={bodyStyle}>
              Controlled Auto Apply
            </p>
          </div>
          <div>
            <h3
              data-case-type="display"
              id="autonomy-decision-title"
              className="m-0 max-w-[780px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]"
              style={displayStyle}
            >
              Defining the boundaries of AI autonomy
            </h3>
            <p className="m-0 mt-6 max-w-[720px] text-[19px] font-light leading-[1.5] text-[#0a0a0a]/62" style={bodyStyle}>
              How much control should users give AI when applying for jobs?
            </p>
          </div>
        </header>

        <div className="grid gap-8 border-y border-[#cccccc] py-8 lg:grid-cols-2">
          <article>
            <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
              1. The Design Challenge
            </p>
            <p className="m-0 mt-5 text-[15px] font-light leading-[1.65] text-[#0a0a0a]/68" style={bodyStyle}>
              Applying for jobs is repetitive, making it an ideal candidate for automation. But submitting an application is also a personal career decision. Fully autonomous AI could save time while introducing uncertainty and unwanted actions.
            </p>
            <p className="m-0 mt-7 border-l border-[#ed5b2b] pl-5 text-[18px] font-normal leading-[1.5] text-[#0a0a0a]" style={bodyStyle}>
              The challenge wasn’t whether AI could apply automatically, but whether users would trust it to do so.
            </p>
          </article>

          <article className="lg:border-l lg:border-[#cccccc] lg:pl-8">
            <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
              2. What We Learned
            </p>
            <p className="m-0 mt-5 text-[15px] font-light leading-[1.65] text-[#0a0a0a]/68" style={bodyStyle}>
              Users had fundamentally different tolerance for AI action. Some wanted full automation, some needed approval before every application, and others only wanted AI to prepare materials.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Full automation', 'Approve every application', 'Prepare materials only'].map((mode) => (
                <span
                  key={mode}
                  className="case-radius-sm border border-[#cccccc] bg-[#f3f1ea] px-3 py-2 text-[12px] font-light text-[#0a0a0a]/66"
                  style={bodyStyle}
                >
                  {mode}
                </span>
              ))}
            </div>
            <p data-case-type="body" className="m-0 mt-7 text-[22px] font-normal leading-[1.35] text-[#0a0a0a]" style={displayStyle}>
              Users didn’t want the same level of automation—they wanted different levels of control.
            </p>
          </article>
        </div>

        <section className="flex flex-col gap-6" aria-labelledby="autonomy-core-decision">
          <div className="max-w-[840px]">
            <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
              3. Design Decision
            </p>
            <h4
              data-case-type="display"
              id="autonomy-core-decision"
              className="m-0 mt-3 text-[clamp(34px,4.8vw,60px)] font-normal leading-[1.03] tracking-[-0.03em] text-[#0a0a0a]"
              style={displayStyle}
            >
              We shifted from automation to configurable autonomy.
            </h4>
            <p className="m-0 mt-5 max-w-[760px] text-[16px] font-light leading-[1.65] text-[#0a0a0a]/66" style={bodyStyle}>
              Instead of deciding how much AI should automate, we let users define the conditions, permissions, and review boundaries under which AI could act.
            </p>
          </div>

          <div className="case-radius-lg overflow-hidden border border-[#cccccc]">
            <div className="grid grid-cols-2 border-b border-[#cccccc] bg-[#f3f1ea] px-5 py-3 text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/42" style={bodyStyle}>
              <p className="m-0">Before</p>
              <p className="m-0">After</p>
            </div>
            {decisionComparison.map(([before, after], index) => (
              <div
                key={before}
                className={`grid grid-cols-2 gap-5 px-5 py-5 ${
                  index < decisionComparison.length - 1 ? 'border-b border-[#cccccc]' : ''
                }`}
              >
                <p className="m-0 text-[15px] font-light text-[#0a0a0a]/48" style={bodyStyle}>
                  {before}
                </p>
                <p className="m-0 text-[15px] font-normal text-[#0a0a0a]" style={bodyStyle}>
                  {after}
                </p>
              </div>
            ))}
          </div>

          <div className="case-radius-lg grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-3">
            {feature.iteration.map(([stage, description]) => (
              <article key={stage} className="bg-white p-5">
                <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
                  {stage}
                </p>
                <p className="m-0 mt-4 text-[13px] font-light leading-[1.55] text-[#0a0a0a]/66" style={bodyStyle}>
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid border-y border-[#cccccc] sm:grid-cols-2 lg:grid-cols-4" aria-label="AI autonomy design principles">
          {autonomyPrinciples.map((principle, index) => (
            <article
              key={principle.title}
              className={`min-h-[220px] py-6 sm:px-5 ${
                index < autonomyPrinciples.length - 1 ? 'border-b border-[#cccccc] sm:border-b-0 sm:border-r' : ''
              } ${index === 1 ? 'sm:border-r-0 lg:border-r' : ''} ${index >= 2 ? 'sm:border-t lg:border-t-0' : ''} ${
                index === 0 ? 'sm:pl-0' : ''
              }`}
            >
              <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
                4.{index + 1}
              </p>
              <h5 className="m-0 mt-6 text-[17px] font-normal leading-[1.3] text-[#0a0a0a]" style={displayStyle}>
                {principle.title}
              </h5>
              <p className="m-0 mt-3 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/62" style={bodyStyle}>
                {principle.body}
              </p>
            </article>
          ))}
        </section>
      </div>

      <div className="flex flex-col gap-12 border-t border-[#0a0a0a] pt-10">
        <header>
          <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
            5. Translating the Decision into the Experience
          </p>
          <h4 data-case-type="display" className="m-0 mt-3 max-w-[800px] text-[clamp(32px,4.4vw,56px)] font-normal leading-[1.05] tracking-[-0.03em] text-[#0a0a0a]" style={displayStyle}>
            AI earns the right to act by following the boundaries a user defines.
          </h4>
        </header>

        <section className="flex flex-col gap-6" aria-labelledby="define-rules-title">
          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
            <div>
              <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
                A. Define the Rules
              </p>
              <h5 data-case-type="small-title" id="define-rules-title" className="m-0 mt-3 text-[24px] font-normal leading-[1.2] text-[#0a0a0a]" style={displayStyle}>
                Permission before action
              </h5>
              <p className="m-0 mt-4 text-[14px] font-normal leading-[1.55] text-[#0a0a0a]" style={bodyStyle}>
                Users first define the conditions under which AI is allowed to act.
              </p>
            </div>
            <div className="case-radius-lg grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] sm:grid-cols-2">
              {ruleGroups.map(([title, body]) => (
                <article key={title} className="bg-white p-5">
                  <h6 className="m-0 text-[14px] font-normal text-[#0a0a0a]" style={bodyStyle}>
                    {title}
                  </h6>
                  <p className="m-0 mt-2 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/60" style={bodyStyle}>
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <div className="case-radius-lg overflow-hidden bg-[#f3f1ea] p-4 sm:p-6">
            <Image
              src="/img/jobnova/decision-auto-apply-190-10788.png"
              alt="JobNova Auto Apply settings defining matching rules, autonomy, application materials, and notification preferences."
              width={1120}
              height={669}
              className="h-auto w-full"
              unoptimized
            />
          </div>
        </section>

        <section className="flex flex-col gap-5 border-y border-[#cccccc] py-8" aria-labelledby="execute-boundaries-title">
          <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
            <div>
              <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
                B. Execute Within Boundaries
              </p>
              <h5 data-case-type="small-title" id="execute-boundaries-title" className="m-0 mt-3 text-[24px] font-normal leading-[1.2] text-[#0a0a0a]" style={displayStyle}>
                Visible system action
              </h5>
            </div>
            <p className="m-0 max-w-[600px] text-[16px] font-normal leading-[1.55] text-[#0a0a0a]" style={bodyStyle}>
              AI executes only when predefined conditions are satisfied. Approval, queue position, processing, submission, and failure remain visible.
            </p>
          </div>
          <AutoApplyStateSwitcher
            stateIds={['pending-approval', 'queued', 'progress', 'submitted', 'failed']}
          />
        </section>

        <section className="flex flex-col gap-6" aria-labelledby="exceptions-title">
          <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
            <div>
              <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
                C. Handle Exceptions Gracefully
              </p>
              <h5 data-case-type="small-title" id="exceptions-title" className="m-0 mt-3 text-[24px] font-normal leading-[1.2] text-[#0a0a0a]" style={displayStyle}>
                Recovery is part of the flow
              </h5>
            </div>
            <p className="m-0 max-w-[600px] text-[16px] font-normal leading-[1.55] text-[#0a0a0a]" style={bodyStyle}>
              When automation could not continue, the system explained why and offered a clear recovery path.
            </p>
          </div>
          <div className="case-radius-lg grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] sm:grid-cols-2">
            {exceptions.map(([title, body], index) => (
              <article key={title} className="min-h-[156px] bg-white p-5">
                <div className="flex items-center justify-between">
                  <h6 className="m-0 text-[15px] font-normal text-[#0a0a0a]" style={bodyStyle}>
                    {title}
                  </h6>
                  <span className="text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
                    E{String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="m-0 mt-4 max-w-[360px] text-[13px] font-light leading-[1.6] text-[#0a0a0a]/64" style={bodyStyle}>
                  {body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="case-radius-lg bg-[#10100f] p-6 text-white sm:p-8" aria-labelledby="implementation-title">
          <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
            <div>
              <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#aefd48]" style={bodyStyle}>
                6. From Design to Implementation
              </p>
              <h5 data-case-type="small-title" id="implementation-title" className="m-0 mt-3 text-[25px] font-normal leading-[1.2] text-white" style={displayStyle}>
                Translating UX into product rules
              </h5>
            </div>
            <div className="grid border-y border-white/20 sm:grid-cols-2 lg:grid-cols-6">
              {implementationFlow.map((state, index) => (
                <div
                  key={state}
                  className={`relative flex min-h-[104px] items-center justify-between gap-3 py-4 sm:px-4 ${
                    index < implementationFlow.length - 1 ? 'border-b border-white/20 sm:border-b-0 sm:border-r' : ''
                  } ${index === 1 || index === 3 ? 'sm:border-r-0 lg:border-r' : ''} ${
                    index >= 2 ? 'sm:border-t lg:border-t-0' : ''
                  } ${index === 0 ? 'lg:pl-0' : ''}`}
                >
                  <div>
                    <p className="m-0 text-[9px] font-light text-[#aefd48]" style={bodyStyle}>
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <p className="m-0 mt-3 text-[11px] font-light leading-[1.35] text-white" style={bodyStyle}>
                      {state}
                    </p>
                  </div>
                  {index < implementationFlow.length - 1 ? (
                    <span className="text-[12px] font-light text-white/30 lg:absolute lg:-right-[8px] lg:bg-[#10100f] lg:px-1" aria-hidden>
                      -&gt;
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <p className="m-0 mt-7 max-w-[820px] text-[13px] font-light leading-[1.65] text-white/62" style={bodyStyle}>
            Together with engineering, we translated these interaction flows into implementable state logic covering asynchronous execution, third-party constraints, approval rules, and recovery scenarios.
          </p>
        </section>

        <section className="grid gap-7 lg:grid-cols-[1fr_300px]" aria-labelledby="auto-apply-outcome-title">
          <div>
            <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
              7. Outcome
            </p>
            <h5 data-case-type="small-title" id="auto-apply-outcome-title" className="m-0 mt-2 text-[20px] font-normal text-[#0a0a0a]" style={bodyStyle}>
              Autonomy-specific validation signals
            </h5>
            <div className="mt-5 flex flex-wrap gap-2">
              {outcomeMetrics.map((metric) => (
                <span
                  key={metric}
                  className="case-radius-sm border border-[#cccccc] px-3 py-2 text-[11px] font-light leading-[17px] text-[#0a0a0a]/68"
                  style={bodyStyle}
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>
          <aside className="border-l border-[#ed5b2b] pl-5">
            <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
              Available launch signal
            </p>
            <p className="m-0 mt-3 text-[16px] font-normal leading-[1.5] text-[#0a0a0a]" style={bodyStyle}>
              {feature.observedSignal}
            </p>
            <p className="m-0 mt-3 text-[11px] font-light leading-[1.5] text-[#0a0a0a]/48" style={bodyStyle}>
              Approval and manual-intervention rates remain feature-level validation targets.
            </p>
          </aside>
        </section>

        <blockquote className="m-0 border-y border-[#0a0a0a] py-9">
          <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
            8. Key Takeaway
          </p>
          <p data-case-type="quote" className="m-0 mt-5 max-w-[920px] text-[clamp(26px,3.8vw,50px)] font-normal leading-[1.1] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>
            The most valuable design decision was not increasing automation, but allowing users to define when automation was appropriate.
          </p>
        </blockquote>
      </div>
    </section>
  );
}

function TrackingDesignDecisionSection() {
  const feature = featureSections[3];
  const decisionComparison = [
    ['Submission disappears after execution', 'Every application remains traceable'],
    ['Only success notifications', 'Complete application history'],
    ['AI acts in the background', 'AI actions stay visible'],
  ];
  const accountabilityPrinciples = [
    {
      title: 'Every application has a visible history',
      body: 'The complete journey—from discovery and submission to recruiter response—remains reviewable.',
    },
    {
      title: 'Status communicates progress, not just outcomes',
      body: 'Users can see what is complete, what is still in progress, and what changed along the way.',
    },
    {
      title: 'Surface actions that require attention',
      body: 'The system interrupts users only when approval, recovery, or a timely response is needed.',
    },
  ];
  const timelineStates = [
    ['Applied', 'Materials submitted'],
    ['Under Review', 'Recruiter reviewing'],
    ['Interview', 'Response required'],
    ['Offer', 'Decision pending'],
    ['Rejected', 'Journey recorded'],
  ];
  const outcomeMetrics = [
    'Application tracking usage',
    'Notification open rate',
    'Time to respond',
    'Interview follow-up completion',
  ];
  const collaborationModel = [
    ['Explain', 'AI makes its reasoning understandable.', 'Recommendations'],
    ['Collaborate', 'AI proposes; users approve.', 'Authorship'],
    ['Act', 'AI works within user-defined boundaries.', 'Autonomy'],
    ['Account', 'Every AI action stays visible and traceable.', 'Accountability'],
  ];

  return (
    <section
      className="flex w-full flex-col gap-11 border-t border-[#0a0a0a] pt-8"
      data-case-nav-label="04 / Application Tracking"
      aria-labelledby="tracking-decision-title"
    >
      <header className="grid gap-7 lg:grid-cols-[180px_1fr]">
        <div>
          <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
            Design Decision 04
          </p>
          <p className="m-0 mt-3 text-[11px] font-light text-[#0a0a0a]/38" style={bodyStyle}>
            Application Accountability
          </p>
        </div>
        <div>
          <h3
            data-case-type="display"
            id="tracking-decision-title"
            className="m-0 max-w-[780px] text-[clamp(36px,5vw,64px)] font-normal leading-[0.99] tracking-[-0.035em] text-[#0a0a0a]"
            style={displayStyle}
          >
            Making AI actions transparent
          </h3>
          <p className="m-0 mt-5 max-w-[720px] text-[17px] font-light leading-[1.5] text-[#0a0a0a]/62" style={bodyStyle}>
            How do users stay informed after AI takes action on their behalf?
          </p>
        </div>
      </header>

      <div className="grid gap-8 border-y border-[#cccccc] py-8 lg:grid-cols-2">
        <article>
          <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
            1. The Design Challenge
          </p>
          <p className="m-0 mt-5 text-[14px] font-light leading-[1.65] text-[#0a0a0a]/68" style={bodyStyle}>
            Once applications could be submitted automatically, the interaction no longer ended when the user clicked Apply. Users needed to understand what had happened, what was still pending, and whether anything required their attention.
          </p>
          <p className="m-0 mt-6 border-l border-[#ed5b2b] pl-5 text-[17px] font-normal leading-[1.5] text-[#0a0a0a]" style={bodyStyle}>
            Automation without visibility quickly becomes a black box.
          </p>
        </article>

        <article className="lg:border-l lg:border-[#cccccc] lg:pl-8">
          <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
            2. What We Learned
          </p>
          <p className="m-0 mt-5 text-[14px] font-light leading-[1.65] text-[#0a0a0a]/68" style={bodyStyle}>
            The anxiety was not simply whether an application existed. Users needed to verify the outcome, the materials submitted, any status change, and whether the next step belonged to them.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['Did it go through?', 'Which resume was submitted?', 'Has anything changed?', 'Do I need to act?'].map((question) => (
              <span
                key={question}
                className="case-radius-sm border border-[#cccccc] bg-[#f3f1ea] px-3 py-2 text-[12px] font-light text-[#0a0a0a]/66"
                style={bodyStyle}
              >
                {question}
              </span>
            ))}
          </div>
          <p data-case-type="body" className="m-0 mt-7 text-[21px] font-normal leading-[1.35] text-[#0a0a0a]" style={displayStyle}>
            Users wanted confidence after automation, not just confirmation that it had started.
          </p>
        </article>
      </div>

      <section className="flex flex-col gap-6" aria-labelledby="tracking-core-decision">
        <div className="max-w-[820px]">
          <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
            3. Design Decision
          </p>
          <h4
            data-case-type="display"
            id="tracking-core-decision"
            className="m-0 mt-3 text-[clamp(30px,4vw,50px)] font-normal leading-[1.08] tracking-[-0.025em] text-[#0a0a0a]"
            style={displayStyle}
          >
            We made every automated action traceable.
          </h4>
          <p className="m-0 mt-5 max-w-[740px] text-[15px] font-light leading-[1.65] text-[#0a0a0a]/66" style={bodyStyle}>
            Rather than treating automation as a background process, we designed every AI action to remain visible, reviewable, and actionable after execution.
          </p>
        </div>

        <div className="case-radius-lg overflow-hidden border border-[#cccccc]">
          <div className="grid grid-cols-2 border-b border-[#cccccc] bg-[#f3f1ea] px-5 py-3 text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/42" style={bodyStyle}>
            <p className="m-0">Before</p>
            <p className="m-0">After</p>
          </div>
          {decisionComparison.map(([before, after], index) => (
            <div
              key={before}
              className={`grid grid-cols-2 gap-5 px-5 py-4 ${
                index < decisionComparison.length - 1 ? 'border-b border-[#cccccc]' : ''
              }`}
            >
              <p className="m-0 text-[14px] font-light text-[#0a0a0a]/48" style={bodyStyle}>
                {before}
              </p>
              <p className="m-0 text-[14px] font-normal text-[#0a0a0a]" style={bodyStyle}>
                {after}
              </p>
            </div>
          ))}
        </div>

        <div className="case-radius-lg grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-3">
          {feature.iteration.map(([stage, description]) => (
            <article key={stage} className="bg-white p-5">
              <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
                {stage}
              </p>
              <p className="m-0 mt-4 text-[13px] font-light leading-[1.55] text-[#0a0a0a]/66" style={bodyStyle}>
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid border-y border-[#cccccc] md:grid-cols-3" aria-label="Application accountability design principles">
        {accountabilityPrinciples.map((principle, index) => (
          <article
            key={principle.title}
            className={`min-h-[178px] py-5 md:px-6 ${
              index < accountabilityPrinciples.length - 1 ? 'border-b border-[#cccccc] md:border-b-0 md:border-r' : ''
            } ${index === 0 ? 'md:pl-0' : ''}`}
          >
            <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
              4.{index + 1}
            </p>
            <h5 className="m-0 mt-5 text-[17px] font-normal leading-[1.3] text-[#0a0a0a]" style={displayStyle}>
              {principle.title}
            </h5>
            <p className="m-0 mt-2 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/62" style={bodyStyle}>
              {principle.body}
            </p>
          </article>
        ))}
      </section>

      <section className="flex flex-col gap-8 border-t border-[#0a0a0a] pt-9" aria-labelledby="tracking-experience-title">
        <div>
          <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
            5. Translating the Decision into the Experience
          </p>
          <h4
            data-case-type="display"
            id="tracking-experience-title"
            className="m-0 mt-3 max-w-[760px] text-[clamp(30px,4vw,50px)] font-normal leading-[1.08] tracking-[-0.025em] text-[#0a0a0a]"
            style={displayStyle}
          >
            Visibility continues after the AI acts.
          </h4>
        </div>

        <section className="case-radius-lg overflow-hidden border border-[#cccccc]" aria-labelledby="application-timeline-title">
          <div className="grid gap-4 border-b border-[#cccccc] px-5 py-5 md:grid-cols-[190px_1fr]">
            <div>
              <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
                A. Application Timeline
              </p>
              <h5 data-case-type="small-title" id="application-timeline-title" className="m-0 mt-2 text-[20px] font-normal text-[#0a0a0a]" style={displayStyle}>
                Progress stays legible
              </h5>
            </div>
            <p className="m-0 max-w-[600px] text-[14px] font-normal leading-[1.55] text-[#0a0a0a]" style={bodyStyle}>
              Users could always understand where each application stood—not just its latest outcome.
            </p>
          </div>
          <div className="grid bg-[#f3f1ea] sm:grid-cols-2 lg:grid-cols-5">
            {timelineStates.map(([state, detail], index) => (
              <div
                key={state}
                className={`relative min-h-[112px] p-5 ${
                  index < timelineStates.length - 1 ? 'border-b border-[#d5d1c8] sm:border-r lg:border-b-0' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`size-2 case-radius-full ${index === 2 ? 'bg-[#ed5b2b]' : 'bg-[#0a0a0a]/28'}`} aria-hidden />
                  <p className="m-0 text-[13px] font-normal text-[#0a0a0a]" style={bodyStyle}>
                    {state}
                  </p>
                </div>
                <p className="m-0 mt-6 text-[11px] font-light text-[#0a0a0a]/50" style={bodyStyle}>
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <figure className="m-0 flex min-w-0 flex-col">
            <figcaption className="min-h-[118px] border border-b-0 border-[#cccccc] p-5">
              <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
                B. Submission Record
              </p>
              <p className="m-0 mt-3 text-[14px] font-normal leading-[1.55] text-[#0a0a0a]" style={bodyStyle}>
                Submitted resume, cover letter, date, match evidence, and the Auto Apply log remained reviewable after completion.
              </p>
            </figcaption>
            <div className="case-radius-lg flex h-[430px] items-start justify-center overflow-hidden bg-[#f3f1ea] p-3 sm:p-4">
              <Image
                src="/img/jobnova/decision-tracking-detail.png"
                alt="JobNova application detail showing a chronological application timeline, submitted materials, status changes, and recruiter email."
                width={1363}
                height={1433}
                className="h-full w-full object-contain object-top"
              />
            </div>
          </figure>

          <figure className="m-0 flex min-w-0 flex-col">
            <figcaption className="min-h-[118px] border border-b-0 border-[#cccccc] p-5">
              <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
                C. Actionable Notifications
              </p>
              <p className="m-0 mt-3 text-[14px] font-normal leading-[1.55] text-[#0a0a0a]" style={bodyStyle}>
                Interview invitations, failures, approvals, and material updates surfaced only when user attention was required.
              </p>
            </figcaption>
            <div className="case-radius-lg flex h-[430px] items-start justify-center overflow-hidden bg-[#f3f1ea] p-3 sm:p-4">
              <Image
                src="/img/jobnova/decision-tracking-top.png"
                alt="JobNova inbox classifying application updates and highlighting messages that require the user to respond."
                width={1240}
                height={883}
                className="h-full w-full object-contain object-top"
              />
            </div>
          </figure>
        </div>
      </section>

      <section className="grid gap-7 lg:grid-cols-[1fr_300px]" aria-labelledby="tracking-outcome-title">
        <div>
          <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
            6. Outcome
          </p>
          <h5 data-case-type="small-title" id="tracking-outcome-title" className="m-0 mt-2 text-[20px] font-normal text-[#0a0a0a]" style={bodyStyle}>
            Accountability-specific validation signals
          </h5>
          <div className="mt-5 flex flex-wrap gap-2">
            {outcomeMetrics.map((metric) => (
              <span
                key={metric}
                className="case-radius-sm border border-[#cccccc] px-3 py-2 text-[11px] font-light leading-[17px] text-[#0a0a0a]/68"
                style={bodyStyle}
              >
                {metric}
              </span>
            ))}
          </div>
        </div>
        <aside className="border-l border-[#ed5b2b] pl-5">
          <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
            Available launch signal
          </p>
          <p className="m-0 mt-3 text-[16px] font-normal leading-[1.5] text-[#0a0a0a]" style={bodyStyle}>
            {feature.observedSignal}
          </p>
          <p className="m-0 mt-3 text-[11px] font-light leading-[1.5] text-[#0a0a0a]/48" style={bodyStyle}>
            Tracking engagement, notification response time, and follow-up completion remain feature-level validation targets.
          </p>
        </aside>
      </section>

      <blockquote className="m-0 border-y border-[#0a0a0a] py-8">
        <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
          7. Key Takeaway
        </p>
        <p data-case-type="quote" className="m-0 mt-4 max-w-[920px] text-[clamp(22px,3vw,40px)] font-normal leading-[1.15] tracking-[-0.02em] text-[#0a0a0a]" style={displayStyle}>
          Automation becomes trustworthy only when users can understand what happened, what is happening, and what needs their attention next.
        </p>
      </blockquote>

      <section className="case-radius-lg overflow-hidden bg-[#10100f] text-white" aria-labelledby="collaboration-model-title">
        <div className="grid gap-5 border-b border-white/16 p-6 sm:p-8 lg:grid-cols-[230px_1fr]">
          <div>
            <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#aefd48]" style={bodyStyle}>
              Human–AI Collaboration Model
            </p>
          <h4 data-case-type="small-title" id="collaboration-model-title" className="m-0 mt-3 text-[24px] font-normal leading-[1.15] text-white" style={displayStyle}>
              Four decisions, one trust model
            </h4>
          </div>
          <p className="m-0 max-w-[580px] text-[14px] font-light leading-[1.65] text-white/62" style={bodyStyle}>
            The four experiences form one continuous relationship: AI explains, collaborates, acts within permission, and remains accountable afterward.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {collaborationModel.map(([stage, body, context], index) => (
            <article
              key={stage}
              className={`relative min-h-[188px] p-6 ${
                index < collaborationModel.length - 1 ? 'border-b border-white/16 sm:border-r lg:border-b-0' : ''
              } ${index === 1 ? 'sm:border-r-0 lg:border-r' : ''} ${index >= 2 ? 'sm:border-t lg:border-t-0' : ''}`}
            >
              <div className="flex items-center justify-between">
                <p className="m-0 text-[10px] font-light text-[#aefd48]" style={bodyStyle}>
                  {String(index + 1).padStart(2, '0')}
                </p>
                <p className="m-0 text-[9px] font-light uppercase tracking-[0.12em] text-white/34" style={bodyStyle}>
                  {context}
                </p>
              </div>
              <h5 className="m-0 mt-7 text-[22px] font-normal text-white" style={displayStyle}>
                {stage}
              </h5>
              <p className="m-0 mt-3 text-[12px] font-light leading-[1.55] text-white/58" style={bodyStyle}>
                {body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default function JobnovaAIPlatformPage() {
  return (
    <div className="jobnova-case-study mei-project-page w-full">
      <CaseStudyControls tldrPoints={tldrPoints} accentColor="#ed5b2b" />
      <CaseStudyHero
        accentColor="#ed5b2b"
        title="JobNova AI Job Search Platform"
        subtitle="Designing a 0-to-1 AI job-search system that helps users complete relevant applications faster without giving up trust or control."
        tags={['0-to-1 AI SaaS', 'Product Strategy', 'UX Research', 'AI Workflow', 'Design System']}
        aboutLabel="About JobNova"
        about={'Most AI job-search products automate individual tasks.\n\nJobNova redesigns the entire application workflow, from discovering the right opportunities to completing trustworthy applications.'}
        liveSiteHref="https://jobnova.ai/"
        meta={[
          { label: 'Role', value: ['Founding Designer', 'End to end product design from research to delivery'] },
          {
            label: 'Team',
            value: ['2 Designers (Me & 1 Intern)', '1 Product Manager (Founder)', '1 Full-Stack Engineer', '2 ML Engineers'],
          },
          {
            label: 'Tool',
            icons: [
              { src: '/img/jobnova/tool-figma.svg', alt: 'Figma', width: 22, height: 22 },
              { src: '/img/jobnova/tool-cursor.svg', alt: 'Cursor', width: 22, height: 22 },
              { src: '/img/jobnova/tool-notebooklm.svg', alt: 'NotebookLM', width: 24, height: 24 },
              {
                src: '/img/jobnova/tool-codex.svg',
                alt: 'Codex',
                width: 23,
                height: 12,
                containerSize: 24,
                transform: 'rotate(180deg) scaleX(-1)',
              },
            ],
          },
          { label: 'Company', value: ['Nova AI'] },
          { label: 'Year', value: ['2025 - Ongoing'] },
        ]}
        visualLabel="JobNova product system"
        visualSrc="/img/jobnova/Jobnova.avif"
        visualAlt="JobNova AI job-search platform shown across job matching, Auto Apply, and application scoring interfaces."
        visualObjectPosition="center bottom"
        visualObjectFit="contain"
        visualImageScale={0.9}
        visualTransformOrigin="center bottom"
        visualHeight="clamp(300px, 38vw, 540px)"
        visualBackground="radial-gradient(circle at 76% 24%, rgb(174 255 72 / 0.24), transparent 27%), radial-gradient(circle at 20% 78%, rgb(237 91 43 / 0.2), transparent 30%), radial-gradient(circle at 52% 54%, rgb(57 91 129 / 0.3), transparent 42%), linear-gradient(135deg, #05070d 0%, #0b1220 48%, #07110f 100%)"
        visualNavTone="light"
        compactTypography
        wideDetails
      />

      <section className="overflow-x-clip" style={sectionStyle}>
        <div>
          <div className="flex flex-col gap-14 md:gap-20">
            <div className="flex max-w-[980px] flex-col gap-10" data-case-nav-label="01 / The fragmented journey">
              <div className="flex flex-col gap-5">
                <p data-case-type="eyebrow" className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                  01 / The fragmented journey
                </p>
                <h2 data-case-type="display" className="m-0 max-w-[900px] text-[clamp(36px,5.4vw,72px)] font-normal leading-[0.98] tracking-[-0.035em] text-[#0a0a0a]" style={displayStyle}>
                  AI tools optimized job-search tasks.
                  <br />
                  <span className="text-[#ed5b2b]">The journey stayed fragmented.</span>
                </h2>
                <p data-case-type="lead" className="m-0 max-w-[760px] text-[16px] font-light leading-7 text-[#0a0a0a]/68" style={bodyStyle}>
                  Existing tools helped users write, score, autofill, or track pieces of the process. But users still had to stitch together discovery, evaluation, application, and follow-up across disconnected products.
                </p>
              </div>

              <WorkflowThesisDiagram />
            </div>

            <div className="flex max-w-[980px] flex-col gap-10" data-case-nav-label="02 / The first hypothesis">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <p data-case-type="eyebrow" className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                    02 / The first hypothesis
                  </p>
                  <h2 data-case-type="display" className="m-0 max-w-[850px] text-[clamp(32px,4.6vw,60px)] font-normal leading-[1.03] tracking-[-0.03em] text-[#0a0a0a]" style={displayStyle}>
                    We assumed AI could replace pieces of the job-search journey.
                  </h2>
                </div>
                <p className="m-0 max-w-[940px] text-[15px] font-light leading-6 text-[#0a0a0a]/72" style={bodyStyle}>
                  The first bet was a stack of AI features:{' '}
                  <span className="text-[#ed5b2b]">find matching jobs and explain why they matched, generate application materials, then add job training and referrals from our own resources</span>
                  .
                </p>
              </div>

              <div className="flex flex-col gap-8">
                <p className="m-0 text-[13px] font-light uppercase leading-[19.5px] text-[#ed5b2b]" style={bodyStyle}>
                  Version 1
                </p>

                <div className="flex flex-col gap-3">
                  <p className="m-0 text-[14px] font-normal leading-[1.4] text-[#0a0a0a]" style={bodyStyle}>
                    Job matching
                  </p>
                  <figure className="m-0 w-full case-radius-xl bg-[#f3f1ea] p-3 sm:p-4">
                    <Image
                      src="/img/jobnova/decision-match-list.png"
                      alt="Version 1 job matching: job cards with match scores for scanning and prioritizing roles."
                      width={1163}
                      height={515}
                      className="block h-auto w-full object-contain"
                      sizes="(min-width: 1280px) 980px, calc(100vw - 48px)"
                    />
                  </figure>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="m-0 text-[14px] font-normal leading-[1.4] text-[#0a0a0a]" style={bodyStyle}>
                    Job details
                  </p>
                  <figure className="m-0 w-full case-radius-xl bg-[#f3f1ea] p-3 sm:p-4">
                    <Image
                      src="/img/jobnova/decision-match-detail.png"
                      alt="Version 1 job matching: match score, explanation, and generate-resume action on a job detail page."
                      width={1127}
                      height={949}
                      className="block h-auto w-full object-contain"
                      sizes="(min-width: 1280px) 980px, calc(100vw - 48px)"
                    />
                  </figure>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="m-0 text-[14px] font-normal leading-[1.4] text-[#0a0a0a]" style={bodyStyle}>
                    Tailored resume
                  </p>
                  <figure className="m-0 w-full case-radius-xl bg-[#f3f1ea] p-3 sm:p-4">
                    <Image
                      src="/img/jobnova/decision-resume.png"
                      alt="Version 1 resume customization: AI generates a tailored resume, then users review and edit the changes."
                      width={1121}
                      height={1258}
                      className="block h-auto w-full object-contain"
                      sizes="(min-width: 1280px) 980px, calc(100vw - 48px)"
                    />
                  </figure>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <article className="case-radius-lg bg-[#f3f1ea] p-5">
                  <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
                    Version 1 outcome
                  </p>
                  <h3 data-case-type="small-title" className="m-0 mt-6 text-[21px] font-normal leading-[1.2] tracking-[-0.01em] text-[#0a0a0a]" style={displayStyle}>
                    AI made parts of applying faster.
                  </h3>
                  <p data-case-type="caption" className="m-0 mt-4 text-[13px] font-light leading-[1.65] text-[#0a0a0a]/64" style={bodyStyle}>
                    Users could see matched roles from multiple platforms in one place, generate tailored materials for a specific job, and find people to contact. AI raised the efficiency of those steps. They no longer had to hop between boards just to start.
                  </p>
                </article>
                <article className="case-radius-lg bg-[#f3f1ea] p-5">
                  <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
                    The problem
                  </p>
                  <h3 data-case-type="small-title" className="m-0 mt-6 text-[21px] font-normal leading-[1.2] tracking-[-0.01em] text-[#0a0a0a]" style={displayStyle}>
                    The journey still ran on manual work.
                  </h3>
                  <p data-case-type="caption" className="m-0 mt-4 text-[13px] font-light leading-[1.65] text-[#0a0a0a]/64" style={bodyStyle}>
                    Users still had to judge which roles were worth applying to, submit each application themselves, and track every outcome one by one. Faster pieces did not remove the labor of the full process.
                  </p>
                </article>
              </div>
            </div>

            <div className="flex max-w-[980px] flex-col gap-10" data-case-nav-label="03 / What research showed">
              <div className="flex flex-col gap-4">
                <p data-case-type="eyebrow" className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                  03 / What research showed
                </p>
                <h2 data-case-type="display" className="m-0 max-w-[850px] text-[clamp(32px,4.6vw,60px)] font-normal leading-[1.03] tracking-[-0.03em] text-[#0a0a0a]" style={displayStyle}>
                  Matching and writing were not the bottleneck.
                  <br />
                  <span className="text-[#ed5b2b]">Users needed applying to happen without them.</span>
                </h2>
                <p data-case-type="lead" className="m-0 max-w-[760px] text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                  Across 20+ interviews, faster matching and tailored materials still left the same labor in the user&apos;s hands: decide, submit, and track, one role at a time.
                </p>
              </div>

              <blockquote className="m-0 max-w-[820px] border-l border-[#ed5b2b] py-1 pl-5">
                <p data-case-type="quote" className="m-0 text-[clamp(20px,2.4vw,28px)] font-normal leading-[1.3] tracking-[-0.02em] text-[#0a0a0a]" style={displayStyle}>
                  “By the time I tailor everything, the best opportunities already feel out of reach.”
                </p>
                <footer className="mt-4 text-[11px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/45" style={bodyStyle}>
                  Career transitioner, research interview
                </footer>
              </blockquote>

              <div className="flex max-w-[760px] flex-col gap-3">
                <p className="m-0 text-[13px] font-light uppercase leading-[19.5px] text-[#ed5b2b]" style={bodyStyle}>
                  The product direction
                </p>
                <p data-case-type="body" className="m-0 text-[20px] font-normal leading-[1.45] text-[#0a0a0a]" style={bodyStyle}>
                  Automate the application.{' '}
                  <span className="text-[#ed5b2b]">Users should only need to focus on interviews.</span>
                </p>
              </div>
            </div>

            <div className="flex max-w-[980px] flex-col gap-10" data-case-nav-label="04 / One complete application journey">
              <div className="flex flex-col gap-5">
                <p data-case-type="eyebrow" className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                  04 / One complete application journey
                </p>
                <h2
                  data-case-type="display"
                  className="m-0 max-w-[850px] text-[clamp(32px,4.6vw,60px)] font-normal leading-[1.03] tracking-[-0.03em] text-[#0a0a0a]"
                  style={displayStyle}
                >
                  Users would focus on interviews.
                  <br />
                  <span className="text-[#ed5b2b]">The product had to apply.</span>
                </h2>
                <p className="m-0 max-w-[760px] text-[16px] font-light leading-[1.6] text-[#0a0a0a]/72" style={bodyStyle}>
                  That meant one complete application journey: match, customize, apply, and track. Auto Apply became the product that ran that loop, so users were no longer judging, submitting, and following up one role at a time.
                </p>
              </div>

              <ScopeStoryMap />
            </div>

            <div className="flex max-w-[980px] flex-col gap-10" data-case-nav-label="05 / Four levels of AI responsibility">
              <div className="flex flex-col gap-4">
                <p data-case-type="eyebrow" className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                  05 / Four levels of AI responsibility
                </p>
                <h2 data-case-type="display" className="m-0 max-w-[850px] text-[clamp(32px,4.6vw,60px)] font-normal leading-[1.03] tracking-[-0.03em] text-[#0a0a0a]" style={displayStyle}>
                  The challenge was not whether to automate applying.
                  <br />
                  <span className="text-[#ed5b2b]">It was how to balance autonomy and control.</span>
                </h2>
                <p data-case-type="lead" className="m-0 max-w-[760px] text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                  Auto Apply would let users leave the forms. It would also send applications in their name. The product had to hold both at once, at every step of the loop.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    title: 'Autonomy',
                    body: 'If users still judge, submit, and track one role at a time, Auto Apply is not doing the job. The system has to take the repetitive work so they can leave the forms.',
                  },
                  {
                    title: 'Control',
                    body: 'Applying on someone’s behalf is high-stakes. A submitted application cannot be taken back. Users need to set where AI may act before it sends, see what went out, and stop or tighten the rules so it does not keep going.',
                  },
                ].map((pole) => (
                  <article key={pole.title} className="case-radius-lg bg-[#f3f1ea] p-5">
                    <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
                      {pole.title}
                    </p>
                    <p data-case-type="caption" className="m-0 mt-6 text-[15px] font-light leading-[1.65] text-[#0a0a0a]/68" style={bodyStyle}>
                      {pole.body}
                    </p>
                  </article>
                ))}
              </div>

              <p data-case-type="body" className="m-0 max-w-[760px] text-[20px] font-normal leading-[1.45] text-[#0a0a0a]" style={bodyStyle}>
                That balance needed four moments of AI responsibility, not four separate features.
              </p>

              <p className="m-0 max-w-[760px] text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                Match, customize, apply, and track had to work as one loop. Each step changed how much the AI was allowed to do, and none of them could succeed alone.
              </p>

              <ResponsibilityFrameworkDiagram />

              <div className="flex flex-col gap-4">
                <p className="m-0 text-[13px] font-light uppercase leading-[19.5px] text-[#ed5b2b]" style={bodyStyle}>
                  How the work unfolded
                </p>
                <p className="m-0 max-w-[760px] text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                  Once the workflow was named, this is how we designed it.
                </p>
                <DesktopProcessTimeline />
                <MobileProcessTimeline />
              </div>
            </div>

            <section className="flex max-w-[980px] flex-col gap-10" data-case-nav-label="06 / A permission system, not a switch" aria-labelledby="jobnova-v3-act-title">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-5">
                  <p data-case-type="eyebrow" className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                    06 / A permission system, not a switch
                  </p>
                  <h2 data-case-type="display" id="jobnova-v3-act-title" className="m-0 text-[clamp(32px,4.6vw,60px)] font-normal leading-[1.03] tracking-[-0.03em] text-[#0a0a0a]" style={displayStyle}>
                    Applying on someone’s behalf is the highest-stakes moment in the loop.
                  </h2>
                  <p data-case-type="lead" className="m-0 text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                    Applying on someone’s behalf is the highest-stakes step. AI only acts inside boundaries the user has already set.
                  </p>
                  <p className="m-0 max-w-[760px] text-[13px] font-light leading-[1.6] text-[#0a0a0a]/58" style={bodyStyle}>
                    The first spec was an on/off switch. It broke once login expiry, queues, and retries needed named states. We kept the switch and wrapped it in matching strategy, autonomy, materials, and notifications.
                  </p>
                  <div className="grid gap-3 md:grid-cols-3">
                    {[
                      ['Before', 'Users define where AI may act: match threshold, job preferences, resume choice, and notification rules.'],
                      ['During', 'AI continues only when conditions are satisfied; exceptions require approval.'],
                      ['After', 'Every action remains visible and recoverable.'],
                    ].map(([label, body]) => (
                      <div key={label} className="case-radius-lg min-h-[150px] bg-[#f3f1ea] p-4">
                        <p data-case-type="eyebrow" className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
                          {label}
                        </p>
                        <p data-case-type="caption" className="m-0 mt-2 text-[13px] font-light leading-[1.6] text-[#0a0a0a]/66" style={bodyStyle}>
                          {body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <DesignDecisionVisual index={2} />
                  <AutoApplyStateSwitcher />
                </div>
                <div className="case-radius-lg overflow-hidden border border-[#cccccc] p-5 sm:p-6">
                  <p data-case-type="eyebrow" className="m-0 text-[12px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
                    Trust is earned
                  </p>
                  <p data-case-type="title" className="m-0 mt-3 max-w-[820px] text-[18px] font-normal leading-[1.4] text-[#0a0a0a]" style={bodyStyle}>
                    We wanted full autonomy. Users never want to be out of control.
                  </p>
                  <p className="m-0 mt-3 max-w-[820px] text-[15px] font-light leading-[1.6] text-[#0a0a0a]/68" style={bodyStyle}>
                    We gave transparency and control first, so trust could build. Autonomy is what users grant after that, not something they hand over up front.
                  </p>
                  <div className="case-radius-md mt-6 grid gap-px overflow-hidden bg-[#cccccc] sm:grid-cols-2">
                    {[
                      ['Day one', '37%', 'turned on Apply without approval from the start'],
                      ['Within a week', '82%', 'had moved to Apply without approval'],
                    ].map(([when, value, body]) => (
                      <div key={when} className="bg-white p-5">
                        <p data-case-type="eyebrow" className="m-0 text-[12px] font-light uppercase leading-[18px] text-[#ed5b2b]" style={bodyStyle}>
                          {when}
                        </p>
                        <p className="m-0 mt-6 text-[clamp(36px,4.4vw,48px)] font-normal leading-[1] tracking-[-0.03em] text-[#0a0a0a]" style={displayStyle}>
                          {value}
                        </p>
                        <p className="m-0 mt-4 max-w-[280px] text-[15px] font-light leading-[1.5] text-[#0a0a0a]/68" style={bodyStyle}>
                          {body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="flex max-w-[980px] flex-col gap-10" data-case-nav-label="07 / Every action leaves a trace" aria-labelledby="jobnova-v3-account-title">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-5">
                  <p data-case-type="eyebrow" className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                    07 / Every action leaves a trace
                  </p>
                  <h2 data-case-type="display" id="jobnova-v3-account-title" className="m-0 text-[clamp(32px,4.6vw,60px)] font-normal leading-[1.03] tracking-[-0.03em] text-[#0a0a0a]" style={displayStyle}>
                    If an application disappears after send, the automation has failed.
                  </h2>
                  <p data-case-type="lead" className="m-0 text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                    The loop is not complete at submission. Users still need to see what happened, what is happening, and what needs their attention next.
                  </p>
                  <div className="grid gap-3 md:grid-cols-3">
                    {[
                      ['History', 'What happened and what materials were submitted.'],
                      ['Status', 'What is happening now across applications and recruiter responses.'],
                      ['Attention', 'What requires user review, correction, or follow-up next.'],
                    ].map(([title, body], index) => (
                      <div key={title} className="case-radius-lg min-h-[150px] bg-[#f3f1ea] p-4">
                        <p className="m-0 text-[11px] font-light text-[#ed5b2b]" style={bodyStyle}>
                          {String(index + 1).padStart(2, '0')}
                        </p>
                        <h3 data-case-type="small-title" className="m-0 mt-3 text-[15px] font-normal leading-[1.35] text-[#0a0a0a]" style={bodyStyle}>
                          {title}
                        </h3>
                        <p data-case-type="caption" className="m-0 mt-2 text-[13px] font-light leading-[1.6] text-[#0a0a0a]/66" style={bodyStyle}>
                          {body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <DesignDecisionVisual index={3} />
              </div>
            </section>

            <div className="flex max-w-[980px] flex-col gap-8" data-case-nav-label="08 / From screens to product rules">
              <div className="flex flex-col gap-4">
                <p data-case-type="eyebrow" className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                  08 / From screens to product rules
                </p>
                <h2 data-case-type="display" className="m-0 max-w-[820px] text-[clamp(32px,4.6vw,60px)] font-normal leading-[1.03] tracking-[-0.03em] text-[#0a0a0a]" style={displayStyle}>
                  The four moments had to feel like one product.
                </h2>
                <p data-case-type="lead" className="m-0 max-w-[760px] text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                  I translated the trust model into reusable states, components, and interaction rules so Match, Customize, Apply, and Track behaved consistently.
                </p>
              </div>

              <div className="case-radius-xl w-full bg-[#f3f1ea] p-4 sm:p-6 lg:p-8">
                <figure
                  className="relative m-0 w-full overflow-hidden"
                  style={{ maxHeight: 'min(170vh, 1900px)' }}
                  aria-label="JobNova design system"
                >
                  <Image
                    src="/img/jobnova/design system.avif"
                    alt="JobNova design system covering colors, typography, spacing, components, icons, cards, filters, and application states."
                    width={4126}
                    height={8493}
                    sizes="(min-width: 1280px) 916px, calc(100vw - 80px)"
                    className="block h-auto w-full"
                  />
                  {/* 仅底部模糊，暗示下方还有未完全展开的内容 */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                    style={{
                      WebkitMaskImage: 'linear-gradient(to bottom, transparent 72%, black 100%)',
                      maskImage: 'linear-gradient(to bottom, transparent 72%, black 100%)',
                    }}
                  >
                    <Image
                      src="/img/jobnova/design system.avif"
                      alt=""
                      width={4126}
                      height={8493}
                      sizes="(min-width: 1280px) 916px, calc(100vw - 80px)"
                      className="block h-auto w-full"
                      style={{ filter: 'blur(18px)', transform: 'scale(1.04)', transformOrigin: 'top center' }}
                    />
                  </div>
                </figure>
              </div>
            </div>

            <div className="flex max-w-[980px] flex-col gap-10" data-case-nav-label="09 / Results, debt, and learnings">
              <div className="flex flex-col gap-4">
                <p data-case-type="eyebrow" className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                  09 / Results, debt, and learnings
                </p>
                <h2 data-case-type="display" className="m-0 max-w-[880px] text-[clamp(32px,4.8vw,64px)] font-normal leading-[1.02] tracking-[-0.035em] text-[#0a0a0a]" style={displayStyle}>
                  The goal was never maximum automation.
                  <br />
                  <span className="text-[#ed5b2b]">It was automation people could understand, configure, and hold accountable.</span>
                </h2>
                <p data-case-type="lead" className="m-0 max-w-[760px] text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                  Launch numbers show activation and execution. They do not, by themselves, prove that users trusted Auto Apply.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {resultMetrics.map((metric) => (
                  <article key={metric.label} className="case-radius-lg flex flex-col bg-[#f3f1ea] p-5">
                    <p data-case-type="eyebrow" className="m-0 text-[12px] font-light uppercase leading-[18px] text-[#ed5b2b]" style={bodyStyle}>
                      {metric.label}
                    </p>
                    <p data-case-type="title" className="m-0 mt-7 text-[26px] font-normal leading-[28px] text-[#0a0a0a]" style={displayStyle}>
                      {metric.value}
                    </p>
                    <h3 data-case-type="small-title" className="m-0 mt-4 text-[15px] font-normal leading-5 text-[#0a0a0a]" style={bodyStyle}>
                      {metric.title}
                    </h3>
                  </article>
                ))}
              </div>

              <section aria-labelledby="jobnova-v3-tradeoffs-title">
                <h3 data-case-type="title" id="jobnova-v3-tradeoffs-title" className="m-0 mb-2 text-[20px] font-normal leading-[1.3] text-[#0a0a0a]" style={bodyStyle}>
                  What experience can still raise
                </h3>
                <p className="m-0 mb-5 max-w-[720px] text-[14px] font-light leading-[1.55] text-[#0a0a0a]/68" style={bodyStyle}>
                  Submission success and interview rate sit downstream. These two numbers can still move by making setup easier to finish.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {outcomeTradeoffs.map((item, index) => (
                    <article key={item.title} className="case-radius-lg min-h-[200px] border border-[#cccccc] p-5">
                      <p className="m-0 text-[11px] font-light text-[#ed5b2b]" style={bodyStyle}>
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <h4 data-case-type="small-title" className="m-0 mt-6 text-[18px] font-normal leading-[1.25] text-[#0a0a0a]" style={displayStyle}>
                        {item.title}
                      </h4>
                      <p className="m-0 mt-3 text-[14px] font-light leading-[1.5] text-[#0a0a0a]/72 [&_strong]:font-semibold [&_strong]:text-[#0a0a0a]" style={bodyStyle}>
                        {item.body}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section aria-labelledby="jobnova-v3-learnings-title">
                <h3 data-case-type="title" id="jobnova-v3-learnings-title" className="m-0 mb-5 text-[20px] font-normal leading-[1.3] text-[#0a0a0a]" style={bodyStyle}>
                  Three learnings I will carry forward
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    ['Explain before acting', 'Trust starts with understanding.'],
                    ['Make control configurable', 'Users decide where AI can act.'],
                    ['Design beyond execution', 'Automation needs history, recovery, and accountability.'],
                  ].map(([title, body], index) => (
                    <article key={title} className="case-radius-lg min-h-[180px] bg-[#10100f] p-5 text-white">
                      <p className="m-0 text-[11px] font-light text-[#aefd48]" style={bodyStyle}>
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <h4 data-case-type="small-title" className="m-0 mt-8 text-[21px] font-normal leading-[1.2] text-white" style={displayStyle}>
                        {title}
                      </h4>
                      <p data-case-type="caption" className="m-0 mt-4 text-[13px] font-light leading-[1.6] text-white/65" style={bodyStyle}>
                        {body}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <div className="pt-3">
                <CaseStudyBackButton />
              </div>
            </div>

            <div className="hidden" aria-hidden="true">
            <div className="flex max-w-[980px] flex-col gap-12" data-case-nav-label="Workflow Thesis">
              <p className="m-0 mb-3 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                1. The Product Thesis
              </p>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
                <p className="m-0 max-w-[700px] text-[clamp(20px,2.35vw,32px)] font-normal leading-[1.32] text-[#0a0a0a]" style={bodyStyle}>
                  Most AI job-search products automate individual tasks. JobNova redesigns the entire application workflow—from discovering the right opportunities to completing trustworthy applications.
                </p>
                <div className="flex items-end justify-between border-t border-[#cccccc] pt-4 lg:flex-col lg:items-start lg:gap-5">
                  <p className="m-0 max-w-[210px] text-[13px] font-light leading-[1.55] text-[#0a0a0a]/58" style={bodyStyle}>
                    Match, resume customization, Auto Apply, and tracking work as one system—not four disconnected features.
                  </p>
                  <a
                    href="https://jobnova.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] font-normal text-[#ed5b2b] no-underline"
                    style={bodyStyle}
                  >
                    View live site ↗
                  </a>
                </div>
              </div>

              <div className="border-y border-[#0a0a0a] py-[clamp(42px,7vw,82px)]">
                <p
                  className="m-0 max-w-[920px] text-[clamp(44px,8vw,104px)] font-normal leading-[0.92] tracking-[-0.045em] text-[#0a0a0a]"
                  style={displayStyle}
                >
                  Workflow AI,
                  <br />
                  <span className="text-[#ed5b2b]">not Feature AI.</span>
                </p>
                <p className="m-0 mt-7 max-w-[620px] text-[16px] font-light leading-[1.6] text-[#0a0a0a]/64" style={bodyStyle}>
                  Designing trustworthy AI wasn’t about adding more automation. It was about connecting every step of the application journey while keeping decisions visible and controllable.
                </p>
              </div>

              <div className="flex max-w-[850px] flex-col gap-4">
                <h2 className="m-0 text-[clamp(29px,4vw,54px)] font-normal leading-[1.08] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>
                  More AI tools.
                  <br />
                  Still a fragmented application workflow.
                </h2>
                <p className="m-0 max-w-[680px] text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                  Users switched between job boards, resume editors, ATS checkers, AI writing tools, email, and spreadsheets just to complete a single application.
                </p>
              </div>

              <WorkflowThesisDiagram />

              <div>
                <div className="mb-5 flex items-center justify-between border-b border-[#cccccc] pb-3">
                  <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
                    Early evidence
                  </p>
                  <p className="m-0 text-[11px] font-light text-[#0a0a0a]/42" style={bodyStyle}>
                    Product adoption and completed actions
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-y-0">
                  {quickStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="pr-5 sm:[&:nth-child(even)]:pl-5 lg:min-h-[92px] lg:border-r lg:border-[#cccccc] lg:pl-5 lg:first:pl-0 lg:last:border-r-0"
                    >
                      <p className="m-0 whitespace-nowrap text-[32px] font-normal leading-[32px] text-[#0a0a0a]" style={displayStyle}>
                        {stat.value}
                      </p>
                      <p className="m-0 mt-3 max-w-[150px] text-[13px] font-light leading-[18.85px] text-[#0a0a0a]/58" style={bodyStyle}>
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex max-w-[980px] flex-col gap-14" data-case-nav-label="Why Another AI Product?">
              <header className="flex flex-col gap-6 border-b border-[#0a0a0a] pb-10">
                <p className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                  2. Why Another AI Job Search Product?
                </p>
                <h2
                  className="m-0 max-w-[900px] text-[clamp(36px,5.4vw,72px)] font-normal leading-[0.98] tracking-[-0.035em] text-[#0a0a0a]"
                  style={displayStyle}
                >
                  Existing AI products optimized individual tasks.
                  <br />
                  <span className="text-[#ed5b2b]">The opportunity was redesigning the entire application journey.</span>
                </h2>
                <div className="grid gap-6 lg:grid-cols-2">
                  <p className="m-0 text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                    Most AI job-search products focused on solving one step of the process—writing resumes, autofilling applications, checking ATS compatibility, or tracking submissions.
                  </p>
                  <p className="m-0 text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                    While these tools improved individual tasks, users still had to move between multiple platforms to complete a single job application. The workflow remained fragmented.
                  </p>
                </div>
              </header>

              <section className="flex flex-col gap-5" aria-labelledby="existing-landscape-title">
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
                      Existing Landscape
                    </p>
                    <h3 id="existing-landscape-title" className="m-0 mt-2 text-[22px] font-normal leading-[1.3] text-[#0a0a0a]" style={bodyStyle}>
                      A category organized around isolated tasks
                    </h3>
                  </div>
                  <p className="m-0 hidden max-w-[220px] text-right text-[11px] font-light leading-[1.45] text-[#0a0a0a]/42 sm:block" style={bodyStyle}>
                    Each transition moved context, decisions, and materials into another product.
                  </p>
                </div>

                <div className="border-y border-[#cccccc]">
                  {marketWorkflowStages.map((item, index) => (
                    <div
                      key={item.stage}
                      className={`relative grid min-h-[112px] items-center gap-5 py-5 sm:grid-cols-[44px_220px_1fr] ${
                        index < marketWorkflowStages.length - 1 ? 'border-b border-[#cccccc]' : ''
                      }`}
                    >
                      <div className="relative flex h-full min-h-[64px] items-center justify-center">
                        <span className="relative z-10 flex size-8 items-center justify-center case-radius-full border border-[#cccccc] bg-white text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {index < marketWorkflowStages.length - 1 ? (
                          <span className="absolute left-1/2 top-[calc(50%+16px)] h-[calc(50%+41px)] w-px -translate-x-1/2 bg-[#cccccc]" aria-hidden />
                        ) : null}
                      </div>
                      <h4 className="m-0 text-[18px] font-normal leading-[1.3] text-[#0a0a0a]" style={bodyStyle}>
                        {item.stage}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {item.tools.map((tool) => (
                          <span
                            key={tool}
                            className="case-radius-sm border border-[#cccccc] bg-[#f3f1ea] px-3.5 py-2 text-[12px] font-light text-[#0a0a0a]/68"
                            style={bodyStyle}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="m-0 border-l border-[#ed5b2b] py-1 pl-5 text-[16px] font-normal leading-6 text-[#0a0a0a]" style={bodyStyle}>
                  Users stitched together multiple AI tools to complete one application.
                </p>
              </section>

              <section className="case-radius-lg bg-[#10100f] p-6 text-white sm:p-8 lg:p-10" aria-labelledby="jobnova-workflow-title">
                <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:items-end">
                  <div>
                    <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#aefd48]" style={bodyStyle}>
                      JobNova
                    </p>
                    <h3 id="jobnova-workflow-title" className="m-0 mt-3 text-[26px] font-normal leading-[1.15] text-white" style={displayStyle}>
                      One product.
                      <br />
                      One continuous workflow.
                    </h3>
                  </div>
                  <div className="grid border-y border-white/20 sm:grid-cols-4">
                    {jobnovaWorkflow.map((step, index) => (
                      <div
                        key={step}
                        className={`relative flex min-h-[104px] items-center justify-between gap-4 border-b border-white/20 py-5 sm:border-b-0 sm:px-5 ${
                          index < jobnovaWorkflow.length - 1 ? 'sm:border-r' : ''
                        } ${index === 0 ? 'sm:pl-0' : ''}`}
                      >
                        <div>
                          <p className="m-0 text-[10px] font-light text-[#aefd48]" style={bodyStyle}>
                            {String(index + 1).padStart(2, '0')}
                          </p>
                          <p className="m-0 mt-3 text-[17px] font-light text-white" style={bodyStyle}>
                            {step}
                          </p>
                        </div>
                        {index < jobnovaWorkflow.length - 1 ? (
                          <span className="text-[15px] font-light text-white/35 sm:absolute sm:-right-[10px] sm:top-1/2 sm:-translate-y-1/2 sm:bg-[#10100f] sm:px-1" aria-hidden>
                            -&gt;
                          </span>
                        ) : (
                          <span className="text-[15px] font-light text-[#aefd48]" aria-hidden>✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="border-y border-[#0a0a0a] py-[clamp(52px,8vw,96px)]" aria-labelledby="design-opportunity-title">
                <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
                  Design Opportunity
                </p>
                <p className="m-0 mt-5 text-[14px] font-light leading-6 text-[#0a0a0a]/58" style={bodyStyle}>
                  Instead of building another AI resume assistant, we reframed the problem:
                </p>
                <h3
                  id="design-opportunity-title"
                  className="m-0 mt-5 max-w-[930px] text-[clamp(30px,4.6vw,62px)] font-normal leading-[1.03] tracking-[-0.03em] text-[#0a0a0a]"
                  style={displayStyle}
                >
                  How might we help users complete an entire application journey with AI while keeping them in control of every important decision?
                </h3>
              </section>

              <section className="flex flex-col gap-5" aria-labelledby="product-principles-title">
                <div>
                  <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
                    Key Product Principles
                  </p>
                  <h3 id="product-principles-title" className="m-0 mt-2 text-[22px] font-normal leading-[1.3] text-[#0a0a0a]" style={bodyStyle}>
                    Three rules guided every product decision
                  </h3>
                </div>
                <div className="grid border-y border-[#cccccc] md:grid-cols-3">
                  {principles.map((principle, index) => (
                    <article
                      key={principle.title}
                      className={`min-h-[210px] py-6 md:px-6 ${index < principles.length - 1 ? 'border-b border-[#cccccc] md:border-b-0 md:border-r' : ''} ${index === 0 ? 'md:pl-0' : ''}`}
                    >
                      <p className="m-0 text-[11px] font-light text-[#ed5b2b]" style={bodyStyle}>
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <h4 className="m-0 mt-7 text-[18px] font-normal leading-[1.3] text-[#0a0a0a]" style={displayStyle}>
                        {principle.title}
                      </h4>
                      <p className="m-0 mt-3 max-w-[250px] text-[13px] font-light leading-[1.6] text-[#0a0a0a]/64" style={bodyStyle}>
                        {principle.body}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <div className="flex max-w-[980px] flex-col gap-14" data-case-nav-label="Trust by Design">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                  <p className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                    5. Trust by Design
                  </p>
                  <h2 className="m-0 text-[22px] font-normal leading-[1.32] text-[#0a0a0a]" style={bodyStyle}>
                    We tested where the process broke, not which features people wanted.
                  </h2>
                </div>
                <p className="m-0 max-w-[820px] text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                  Before defining the product, we needed to validate{' '}
                  <span className="text-[#ed5b2b]">
                    whether efficiency was truly the biggest blocker and how much control
                  </span>{' '}
                  users were willing to hand over to AI.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="max-w-[820px]">
                  <p className="m-0 text-[13px] font-light uppercase leading-[19.5px] text-[#ed5b2b]" style={bodyStyle}>
                    Research Goal
                  </p>
                  <p className="m-0 mt-3 text-[15px] font-light leading-6 text-[#0a0a0a]/72" style={bodyStyle}>
                    We wanted to understand where the job-search process actually broke down, how people judged whether a role deserved effort,
                    and which decisions they were willing to delegate to AI.
                  </p>
                </div>
                <div className="grid gap-x-6 gap-y-5 border-y border-[#cccccc] py-5 sm:grid-cols-2 lg:grid-cols-4">
                  {researchQuestions.map((question, index) => (
                    <article key={question} className="border-l border-[#ed5b2b] pl-3.5">
                      <p className="m-0 text-[11px] font-light leading-[17px] text-[#ed5b2b]" style={bodyStyle}>
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <p className="m-0 mt-2 text-[13px] font-light leading-[1.55] text-[#0a0a0a]/72" style={bodyStyle}>
                        {question}
                      </p>
                    </article>
                  ))}
                </div>
                <FlowDiagram items={researchJourney} label="Research journey from discover to track" />
              </div>

              <div className="flex flex-col gap-5">
                <p className="m-0 text-[13px] font-light uppercase leading-[19.5px] text-[#ed5b2b]" style={bodyStyle}>
                  Who we&apos;re designing for
                </p>
                <div className="flex flex-col gap-12">
                  {personas.map((persona, index) => (
                    <article
                      key={persona.id}
                      className={`flex w-full flex-col items-center gap-6 lg:items-end lg:justify-between ${
                        index === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-6 sm:flex-row">
                        <PersonaPhotoCard persona={persona} />
                        <PersonaQuoteCard persona={persona} />
                      </div>
                      <p className="m-0 w-full max-w-[372px] text-[14px] font-normal leading-[1.45] text-black" style={bodyStyle}>
                        {persona.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="m-0 text-[13px] font-light uppercase leading-[19.5px] text-[#ed5b2b]" style={bodyStyle}>
                  What We Focused On
                </p>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {trustFocusCards.map((card, index) => (
                    <article
                      key={card.title}
                      className="relative h-[232px] overflow-hidden case-radius-xl border border-[#cccccc] px-5 pb-[58px] pt-5"
                    >
                      <p className="m-0 text-[12px] font-light leading-[18px] text-[#ed5b2b]" style={bodyStyle}>
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <h3 className="m-0 text-[18px] font-normal leading-normal text-[#070707]" style={bodyStyle}>
                        {card.title}
                      </h3>
                      <p className="m-0 mt-3 max-w-[178px] text-[14px] font-light leading-[1.5] text-[#0a0a0a]/72" style={bodyStyle}>
                        {card.body}
                      </p>
                      <Image
                        src={card.image}
                        alt=""
                        width={card.imageSize}
                        height={card.imageSize}
                        aria-hidden
                        className="pointer-events-none absolute bottom-0 right-0"
                      />
                    </article>
                  ))}
                </div>
                <div className="max-w-[820px] text-[14px] font-light leading-5 text-[#070707]" style={bodyStyle}>
                  <p className="m-0">
                    These feel like separate problems. But the more we dug in, the more they all pointed to the same thing.
                  </p>
                  <p className="m-0">
                    Not about transparency, not about control. It&apos;s a <span className="text-[#ed5b2b]">trust problem</span>.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="m-0 text-[13px] font-light uppercase leading-[19.5px] text-[#ed5b2b]" style={bodyStyle}>
                  Method
                </p>
                <div className="grid items-start gap-8 lg:grid-cols-[400px_1fr] lg:gap-10">
                  <div className="case-radius-lg bg-[#f3f1ea] p-5">
                    <p className="m-0 text-[32px] font-normal leading-[32px] text-[#0a0a0a]" style={displayStyle}>
                      20+
                    </p>
                    <p className="m-0 mt-2 max-w-[330px] text-[14px] font-light leading-[1.55] text-[#0a0a0a]/68" style={bodyStyle}>
                      semi-structured interviews across real job-search journeys.
                    </p>
                    <div className="mt-5 flex max-w-[330px] flex-wrap gap-1.5">
                      {researchSegments.map((segment) => (
                        <span
                          key={segment}
                          className="case-radius-sm border border-[#cccccc] px-3 py-2 text-[12px] font-light leading-[18px] text-[#0a0a0a]/70"
                          style={bodyStyle}
                        >
                          {segment}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 border-t border-[#cccccc] pt-5">
                      <p className="m-0 text-[11px] font-light uppercase leading-[17px] text-[#0a0a0a]/45" style={bodyStyle}>
                        Interview coverage
                      </p>
                      <ul className="m-0 mt-3 flex list-disc flex-col gap-2 pl-4 text-[12px] font-light leading-[1.5] text-[#0a0a0a]/68" style={bodyStyle}>
                        {researchFocusAreas.map((area) => (
                          <li key={area}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col gap-14">
                    {researchInsights.map((insight, index) => (
                      <article key={insight.title} className="flex flex-col gap-2.5">
                        <div className="flex flex-col gap-1.5">
                          <p className="m-0 text-[12px] font-light leading-[18px] text-[#ed5b2b]" style={bodyStyle}>
                            Insight {String(index + 1).padStart(2, '0')}
                          </p>
                          <h3 className="m-0 text-[18px] font-normal leading-6 text-[#0a0a0a]" style={bodyStyle}>
                            {insight.title}
                          </h3>
                        </div>
                        <p className="m-0 text-[14px] font-light leading-[1.6] text-[#0a0a0a]/68" style={bodyStyle}>
                          {insight.body}
                        </p>
                        <p className="m-0 border-l border-[#ed5b2b] pl-[13px] text-[14px] font-light leading-[21.7px] text-[#0a0a0a]/74" style={bodyStyle}>
                          {insight.implication}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="max-w-[820px]">
                  <p className="m-0 text-[13px] font-light uppercase leading-[19.5px] text-[#ed5b2b]" style={bodyStyle}>
                    Reframing the Assumptions
                  </p>
                  <h2 className="m-0 mt-2 text-[19px] font-normal leading-[1.35] text-[#0a0a0a]" style={bodyStyle}>
                    Research did not reject automation. It changed what successful automation needed to mean.
                  </h2>
                </div>
                <div className="case-radius-lg overflow-hidden border border-[#cccccc]">
                  <div
                    className="hidden grid-cols-[0.9fr_1.1fr] border-b border-[#cccccc] bg-[#f3f1ea] px-5 py-3 text-[11px] font-light uppercase leading-[17px] text-[#0a0a0a]/55 sm:grid"
                    style={bodyStyle}
                  >
                    <p className="m-0">Initial assumption</p>
                    <p className="m-0">What research showed</p>
                  </div>
                  {reframingRows.map((row, index) => (
                    <div
                      key={row.before}
                      className={`grid gap-2 px-5 py-4 sm:grid-cols-[0.9fr_1.1fr] sm:gap-8 ${
                        index < reframingRows.length - 1 ? 'border-b border-[#cccccc]' : ''
                      }`}
                    >
                      <p className="m-0 text-[13px] font-normal leading-[1.55] text-[#0a0a0a]" style={bodyStyle}>
                        {row.before}
                      </p>
                      <p className="m-0 text-[13px] font-light leading-[1.55] text-[#0a0a0a]/68" style={bodyStyle}>
                        {row.after}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="m-0 text-[19px] font-normal leading-[1.35] text-[#0a0a0a]" style={bodyStyle}>
                  Research changed the product from an automation tool into a controlled AI system.
                </h2>
                <div className="case-radius-lg grid overflow-hidden border border-[#cccccc] lg:min-h-[286px] lg:grid-cols-[1fr_72px_1fr]">
                  <div className="p-7 sm:p-9">
                    <p className="m-0 text-[13px] font-normal uppercase leading-[19.5px] text-[#0a0a0a]/45" style={bodyStyle}>
                      From
                    </p>
                    <p className="m-0 mt-8 max-w-[377px] text-[20px] font-light leading-[1.35] text-[#0a0a0a]/72 sm:mt-10 sm:text-[22px]" style={bodyStyle}>
                      Help users automatically complete more applications.
                    </p>
                  </div>
                  <div className="flex min-h-14 items-center justify-center border-y border-[#cccccc] text-[18px] text-[#ed5b2b] lg:min-h-0 lg:border-x lg:border-y-0">
                    <span aria-hidden>-&gt;</span>
                  </div>
                  <div className="p-7 sm:p-9">
                    <p className="m-0 text-[13px] font-normal uppercase leading-[19.5px] text-[#0a0a0a]/45" style={bodyStyle}>
                      To
                    </p>
                    <p className="m-0 mt-8 max-w-[377px] text-[20px] font-light leading-[1.35] text-[#0a0a0a] sm:mt-10 sm:text-[22px]" style={bodyStyle}>
                      Help users complete more relevant applications faster, while keeping control of key career decisions.
                    </p>
                  </div>
                </div>
                <blockquote className="m-0 max-w-[820px] border-l border-[#ed5b2b] pl-5 text-[16px] font-normal leading-6 text-[#0a0a0a]" style={bodyStyle}>
                  How might we help job seekers complete more relevant applications faster, without losing{' '}
                  <span className="text-[#ed5b2b]">trust and control over AI-driven decisions</span>?
                </blockquote>
              </div>
            </div>

            <div className="flex max-w-[980px] flex-col gap-14" data-case-nav-label="Design Decisions">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <p className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                    7. Design Decisions
                  </p>
                  <h2 className="m-0 text-[22px] font-normal leading-[1.32] text-[#0a0a0a]" style={bodyStyle}>
                    Four moments where trust had to be designed into the workflow.
                  </h2>
                </div>
                <p className="m-0 max-w-[820px] text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                  The strongest design decisions were not isolated screens. They were interaction rules that clarified{' '}
                  <span className="text-[#ed5b2b]">what AI knew, what it changed, and when it was allowed to act</span>.
                </p>
              </div>

              {featureSections.slice(0, 4).map((feature, index) =>
                index === 0 ? (
                  <MatchingDesignDecisionSection key={feature.label} />
                ) : index === 1 ? (
                  <ResumeDesignDecisionSection key={feature.label} />
                ) : index === 2 ? (
                  <AutoApplyDesignDecisionSection key={feature.label} />
                ) : index === 3 ? (
                  <TrackingDesignDecisionSection key={feature.label} />
                ) : (
                <div
                  key={feature.label}
                  className="flex flex-col items-center gap-7"
                  data-case-nav-label={`${String(index + 1).padStart(2, '0')} / ${feature.label}`}
                >
                  <div className="flex w-full flex-col gap-4">
                    <p className="m-0 text-[13px] font-light uppercase leading-[19.5px] text-[#ed5b2b]" style={bodyStyle}>
                      {String(index + 1).padStart(2, '0')} / {feature.label}
                    </p>
                    <div className="grid gap-6 lg:grid-cols-[308px_1fr] lg:gap-8">
                      <h3 className="m-0 text-[19px] font-normal leading-[1.35] text-[#0a0a0a]" style={bodyStyle}>
                        {feature.title}
                      </h3>
                      <div className="flex flex-col gap-5">
                        {(['challenge', 'decision'] as const).map((kind) => (
                          <div key={kind}>
                            <p className="m-0 text-[12px] font-normal uppercase leading-[18px] text-[#0a0a0a]/45" style={bodyStyle}>
                              {kind}
                            </p>
                            <p className="m-0 mt-1 text-[14px] font-light leading-[1.6] text-[#0a0a0a]/68" style={bodyStyle}>
                              {designDecisionCopy[index][kind].map((part) => (
                                <span key={part.text} className={'accent' in part && part.accent ? 'text-[#ed5b2b]' : ''}>
                                  {part.text}
                                </span>
                              ))}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <section className="flex w-full flex-col gap-6 border-y border-[#cccccc] py-7">
                    <div className="flex max-w-[820px] flex-col gap-2">
                      <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
                        Design Process
                      </p>
                      <h4 className="m-0 text-[18px] font-normal leading-[1.4] text-[#0a0a0a]" style={bodyStyle}>
                        From the first direction to the decision we shipped
                      </h4>
                      <p className="m-0 text-[13px] font-light leading-[1.6] text-[#0a0a0a]/58" style={bodyStyle}>
                        The visual panels below reserve space for the original wireframes and alternative concepts. The reasoning is taken from the documented V1, its limitation, and the resulting product decision.
                      </p>
                    </div>

                    <ExplorationPlaceholder feature={feature.label} items={feature.exploration} />

                    <div className="case-radius-lg grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-3">
                      {feature.iteration.map(([stage, description], stageIndex) => (
                        <article key={stage} className="relative min-h-[164px] bg-white p-5">
                          <div className="flex items-center justify-between">
                            <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
                              {stage}
                            </p>
                            <span className="text-[11px] font-light text-[#0a0a0a]/35" style={bodyStyle}>
                              {String(stageIndex + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <p className="m-0 mt-5 text-[14px] font-light leading-[1.6] text-[#0a0a0a]/70" style={bodyStyle}>
                            {description}
                          </p>
                          {stageIndex < feature.iteration.length - 1 ? (
                            <span
                              aria-hidden
                              className="absolute -bottom-[12px] left-5 z-10 bg-white px-1 text-[14px] font-light text-[#ed5b2b] md:-right-[12px] md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2 md:rotate-0"
                            >
                              -&gt;
                            </span>
                          ) : null}
                        </article>
                      ))}
                    </div>

                    <blockquote className="m-0 max-w-[820px] border-l border-[#ed5b2b] py-1 pl-5">
                      <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
                        Evidence that changed the direction
                      </p>
                      <p className="m-0 mt-3 text-[15px] font-light leading-[1.65] text-[#0a0a0a]/74" style={bodyStyle}>
                        {feature.processEvidence}
                      </p>
                    </blockquote>
                  </section>

                  <div className="flex w-full flex-col gap-4">
                    <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
                      How the final model works
                    </p>
                    <div className={`grid gap-4 ${feature.howItWorks.length > 2 ? 'sm:grid-cols-2' : 'md:grid-cols-2'}`}>
                      {feature.howItWorks.map((group, groupIndex) => (
                        <article key={group.title} className="case-radius-lg overflow-hidden border border-[#cccccc] p-5">
                          <p className="m-0 text-[11px] font-light text-[#ed5b2b]" style={bodyStyle}>
                            {String(groupIndex + 1).padStart(2, '0')}
                          </p>
                          <h4 className="m-0 mt-3 text-[15px] font-normal leading-[1.4] text-[#0a0a0a]" style={bodyStyle}>
                            {group.title}
                          </h4>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {group.items.map((item) => (
                              <span
                                key={item}
                                className="case-radius-sm border border-[#d8d8d8] px-2.5 py-1.5 text-[11px] font-light leading-[17px] text-[#0a0a0a]/66"
                                style={bodyStyle}
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>

                  {index === 2 ? (
                    <div className="flex w-full flex-col gap-6">
                      <div className="flex flex-col gap-3">
                        <h4 className="m-0 text-[16px] font-normal leading-normal text-[#070707]" style={bodyStyle}>
                          Auto Apply State Model
                        </h4>
                        <div className="w-full overflow-x-auto">
                          <div
                            className="grid min-w-[900px] grid-cols-5 border-y border-[#cccccc]"
                            aria-label="Auto Apply state model"
                          >
                            {autoApplyStateModel.map((state, stateIndex) => (
                              <div
                                key={state}
                                className={`relative min-h-[94px] px-5 py-5 ${
                                  stateIndex < autoApplyStateModel.length - 1 ? 'border-r border-[#cccccc]' : ''
                                }`}
                              >
                                <p className="m-0 text-[12px] font-light leading-[18px] text-[#ed5b2b]" style={bodyStyle}>
                                  {String(stateIndex + 1).padStart(2, '0')}
                                </p>
                                <p className="m-0 mt-3 text-[15px] font-light leading-[20.25px] text-[#0a0a0a]" style={bodyStyle}>
                                  {state}
                                </p>
                                {stateIndex < autoApplyStateModel.length - 1 ? (
                                  <span
                                    className="absolute -right-[9px] top-[46px] z-10 bg-white px-1 text-[15px] font-light text-[#0a0a0a]/38"
                                    aria-hidden
                                  >
                                    -&gt;
                                  </span>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <h4 className="m-0 text-[16px] font-normal leading-normal text-[#070707]" style={bodyStyle}>
                          Designing for Real-world Constraints
                        </h4>
                        <div className="bg-[#f3f1ea] px-5 py-3">
                          <div className="hidden grid-cols-2 text-[13px] font-light uppercase leading-[19.5px] text-black sm:grid" style={bodyStyle}>
                            <p className="m-0">Real-world constraint</p>
                            <p className="m-0">Design response</p>
                          </div>
                          <div className="mt-2 flex flex-col gap-2">
                            {realWorldConstraints.map(([constraint, response]) => (
                              <div key={constraint} className="grid gap-1 text-[14px] sm:grid-cols-2 sm:gap-0">
                                <p className="m-0 font-normal leading-[21px] text-[#0a0a0a]" style={bodyStyle}>
                                  {constraint}
                                </p>
                                <p className="m-0 font-light leading-[21.7px] text-[#0a0a0a]/68" style={bodyStyle}>
                                  {response}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <blockquote className="m-0 max-w-[820px] border-l border-[#ed5b2b] pl-[17px] text-[16px] font-normal leading-6 text-[#0a0a0a]" style={bodyStyle}>
                          How might we help job seekers complete more relevant applications faster, without losing{' '}
                          <span className="text-[#ed5b2b]">trust and control over AI-driven decisions</span>?
                        </blockquote>
                      </div>
                    </div>
                  ) : null}

                  {index === 2 ? <AutoApplyStateSwitcher /> : null}

                  <DesignDecisionVisual index={index} />

                  <section className="grid w-full gap-6 border-t border-[#cccccc] pt-7 lg:grid-cols-[1fr_280px]">
                    <div>
                      <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
                        Validation Metrics
                      </p>
                      <p className="m-0 mt-2 max-w-[620px] text-[13px] font-light leading-[1.6] text-[#0a0a0a]/58" style={bodyStyle}>
                        These are the feature-level signals documented for post-launch validation. Where no measured value is available, the metric remains a validation target rather than a claimed result.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {feature.validation.map((metric) => (
                          <span
                            key={metric}
                            className="case-radius-sm border border-[#cccccc] px-3 py-2 text-[11px] font-light leading-[17px] text-[#0a0a0a]/68"
                            style={bodyStyle}
                          >
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                    <aside className="border-l border-[#ed5b2b] pl-5">
                      <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
                        Available launch signal
                      </p>
                      <p className="m-0 mt-3 text-[14px] font-normal leading-[1.55] text-[#0a0a0a]" style={bodyStyle}>
                        {feature.observedSignal}
                      </p>
                    </aside>
                  </section>
                </div>
                )
              )}
            </div>

            <div className="flex max-w-[980px] flex-col gap-7" data-case-nav-label="Design to Launch">
              <div className="flex flex-col gap-3">
                <p className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                  8. Design to Launch
                </p>
                <h2 className="m-0 max-w-[820px] text-[22px] font-normal leading-[1.32] text-[#0a0a0a]" style={bodyStyle}>
                  The handoff needed product rules, not just screens.
                </h2>
              </div>
              <p className="m-0 max-w-[820px] text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                JobNova depended on{' '}
                <span className="text-[#ed5b2b]">
                  matching logic, AI generation, auto-submission states, third-party platform constraints, and feedback loops
                </span>
                . I worked with engineering to turn the experience into implementable system behavior.
              </p>

              <div className="flex flex-col gap-4">
                <p className="m-0 text-[13px] font-light uppercase leading-[19.5px] text-[#ed5b2b]" style={bodyStyle}>
                  Handoff Scope
                </p>
                <div className="grid gap-x-6 gap-y-3 border-y border-[#cccccc] py-5 sm:grid-cols-2 lg:grid-cols-4">
                  {handoffScope.map((item, index) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="mt-[2px] text-[11px] font-light text-[#ed5b2b]" style={bodyStyle}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <p className="m-0 text-[13px] font-light leading-[1.5] text-[#0a0a0a]/70" style={bodyStyle}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="m-0 text-[13px] font-light uppercase leading-[19.5px] text-[#ed5b2b]" style={bodyStyle}>
                  Design System Coverage
                </p>
                <div className="flex flex-wrap gap-2">
                  {designSystemItems.map((item) => (
                    <span
                      key={item}
                      className="case-radius-sm border border-[#cccccc] px-3 py-2 text-[12px] font-light leading-[18px] text-[#0a0a0a]/68"
                      style={bodyStyle}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="case-radius-xl w-full bg-[#f3f1ea] p-4 sm:p-6 lg:p-8">
                <figure className="relative m-0 w-full overflow-hidden" aria-label="JobNova design system">
                  <Image
                    src="/img/jobnova/design system.avif"
                    alt="JobNova design system covering colors, typography, spacing, components, icons, cards, filters, and application states."
                    width={4126}
                    height={8493}
                    sizes="(min-width: 1280px) 916px, calc(100vw - 80px)"
                    className="block h-auto w-full"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[clamp(180px,28vw,360px)]"
                    style={{
                      background:
                        'linear-gradient(180deg, rgb(243 241 234 / 0) 0%, rgb(243 241 234 / 0.2) 24%, rgb(243 241 234 / 0.82) 76%, #f3f1ea 100%)',
                    }}
                  />
                </figure>
              </div>

              <blockquote
                className="m-0 max-w-[820px] border-l border-[#ed5b2b] py-1 pl-[21px]"
                style={bodyStyle}
              >
                <p className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]">
                  Design system principle
                </p>
                <p className="m-0 mt-3 text-[16px] font-normal leading-6 text-[#0a0a0a]">
                  I treated the design system as a set of intentional constraints, not a catalogue to expand. For every
                  new interaction, I first reused an existing token or component. If it could not meet the need, I
                  created a controlled variant; only when neither option preserved the intended behavior did I
                  introduce something new.
                </p>
              </blockquote>
            </div>

            <div className="flex max-w-[980px] flex-col gap-10" data-case-nav-label="Results">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <p className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                    9. Results
                  </p>
                  <h2 className="m-0 max-w-[820px] text-[22px] font-normal leading-[1.32] text-[#0a0a0a]" style={bodyStyle}>
                    After launch, we validated the product through behavior, reliability, and outcome quality.
                  </h2>
                </div>
                <p className="m-0 max-w-[820px] text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                  The core question was not only how many applications users submitted. We looked at whether users adopted controlled automation, whether the system executed reliably, and whether high-match applications produced meaningful responses.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {resultMetrics.map((metric) => (
                  <article key={metric.label} className="case-radius-lg flex min-h-[286px] flex-col overflow-hidden border border-[#cccccc] p-5">
                    <p className="m-0 text-[12px] font-light uppercase leading-[18px] text-[#ed5b2b]" style={bodyStyle}>
                      {metric.label}
                    </p>
                    <p className="m-0 mt-7 text-[26px] font-normal leading-[28px] text-[#0a0a0a]" style={displayStyle}>
                      {metric.value}
                    </p>
                    <h3 className="m-0 mt-4 text-[15px] font-normal leading-5 text-[#0a0a0a]" style={bodyStyle}>
                      {metric.title}
                    </h3>
                    <p className="m-0 mt-3 text-[13px] font-light leading-[20.15px] text-[#0a0a0a]/62" style={bodyStyle}>
                      {metric.body}
                    </p>
                  </article>
                ))}
              </div>

            </div>

            <div className="flex max-w-[980px] flex-col gap-12" data-case-nav-label="Reflection">
              <div className="flex items-center justify-between border-b border-[#cccccc] pb-4">
                <p className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                  10. Reflection
                </p>
                <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#0a0a0a]/36" style={bodyStyle}>
                  Closing perspective
                </p>
              </div>

              <blockquote className="m-0 border-b border-[#0a0a0a] pb-[clamp(42px,7vw,76px)]">
                <p
                  className="m-0 max-w-[940px] text-[clamp(38px,6.3vw,82px)] font-normal leading-[0.99] tracking-[-0.04em] text-[#0a0a0a]"
                  style={displayStyle}
                >
                  Designing AI products was never about increasing automation.
                </p>
                <p
                  className="m-0 mt-7 max-w-[940px] text-[clamp(30px,5vw,66px)] font-normal leading-[1.02] tracking-[-0.035em] text-[#ed5b2b]"
                  style={displayStyle}
                >
                  It was about making automation understandable, configurable, and accountable.
                </p>
              </blockquote>

              <section aria-labelledby="reflection-learnings-title">
                <div className="mb-7 flex items-end justify-between gap-5">
                  <h2 id="reflection-learnings-title" className="m-0 text-[20px] font-normal leading-[1.3] text-[#0a0a0a]" style={bodyStyle}>
                    Three learnings I will carry forward
                  </h2>
                  <p className="m-0 hidden text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/38 sm:block" style={bodyStyle}>
                    Understand → Configure → Account
                  </p>
                </div>
                <div className="grid border-y border-[#cccccc] md:grid-cols-3">
                  {reflectionLearnings.map((learning, index) => (
                    <article
                      key={learning.principle}
                      className={`min-h-[250px] py-6 md:px-6 ${
                        index < reflectionLearnings.length - 1 ? 'border-b border-[#cccccc] md:border-b-0 md:border-r' : ''
                      } ${index === 0 ? 'md:pl-0' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
                          {String(index + 1).padStart(2, '0')}
                        </p>
                        <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/36" style={bodyStyle}>
                          {learning.principle}
                        </p>
                      </div>
                      <h3 className="m-0 mt-12 max-w-[230px] text-[21px] font-normal leading-[1.2] text-[#0a0a0a]" style={displayStyle}>
                        {learning.title}
                      </h3>
                      <p className="m-0 mt-4 max-w-[250px] text-[13px] font-light leading-[1.65] text-[#0a0a0a]/62" style={bodyStyle}>
                        {learning.body}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <div className="pt-3">
                <CaseStudyBackButton />
              </div>
            </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
