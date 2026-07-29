import type { Metadata } from 'next';
import Image from 'next/image';
import type { CSSProperties } from 'react';
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
      'The project moved from a simple efficiency hypothesis - automate more applications - to a trust-centered product direction: help users complete more relevant applications faster while keeping control of critical career decisions.',
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
  { value: '68%', label: 'Completed first job match' },
  { value: '54%', label: 'Used AI resume customization' },
  { value: '31%', label: 'Enabled Auto Apply' },
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

const fragmentedWorkflow = [
  'Search roles',
  'Evaluate fit',
  'Tailor resume',
  'Fill application',
  'Submit materials',
  'Track replies',
];

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

const backgroundSignals = [
  {
    title: 'More roles, harder choices',
    body:
      'Users had access to many openings, but still struggled to prioritize which ones deserved time.',
  },
  {
    title: 'ATS felt opaque',
    body:
      'Candidates could not see how resumes were parsed, why they were rejected, or what to improve.',
  },
  {
    title: 'Timing changed outcomes',
    body:
      'Saved jobs often stalled before submission because tailoring and form-filling took too long.',
  },
];

const earlyProductLoop = ['Discover', 'Customize', 'Apply'];

const initialAssumptions = [
  {
    title: 'Efficiency was the main blocker',
    body: 'If search, resume tailoring, and form filling took less time, users would complete more applications.',
  },
  {
    title: 'More applications meant more opportunity',
    body: 'We assumed users would see higher application volume as clear product value.',
  },
  {
    title: 'Users would delegate application execution',
    body: 'If roles matched preset preferences, users might accept a high level of AI automation.',
  },
  {
    title: 'Discover, customize, and apply could form the loop',
    body: 'We assumed users needed less product support after an application was submitted.',
  },
];

const competitors = [
  {
    product: 'Teal',
    focus: 'Resume optimization and application management',
    automation: 'Assistive workflow tools',
    control: 'Step-by-step user operation',
  },
  {
    product: 'Simplify',
    focus: 'Autofill, job matching, and tracking',
    automation: 'Application assistance',
    control: 'User-triggered actions',
  },
  {
    product: 'LoopCV',
    focus: 'High-volume automated applications',
    automation: 'Automated discovery and application',
    control: 'Preset filters',
  },
  {
    product: 'JobNova',
    focus: 'Controlled end-to-end job-search workflow',
    automation: 'Multi-level autonomy',
    control: 'Explanation, rules, review, and tracking',
  },
];

const principles = [
  {
    title: 'Explain before automate',
    body: 'Show recommendation rationale, missing requirements, content changes, and application status before asking users to trust the system.',
  },
  {
    title: 'Let users define boundaries',
    body: 'Users should not manage every click, but they must decide which roles, materials, and actions AI is allowed to handle.',
  },
  {
    title: 'Preserve review for high-impact actions',
    body: 'Resume content, cover letters, and final application submission need preview, approval, or delayed execution options.',
  },
  {
    title: 'Make every action traceable',
    body: 'Each automated application should remain visible with role, material version, submission result, and follow-up status.',
  },
];

const productLoop = [
  {
    title: 'Match',
    body: 'Find relevant roles and explain why they fit the user profile.',
  },
  {
    title: 'Customize',
    body: 'Tailor resume content to a target role while keeping changes visible.',
  },
  {
    title: 'Apply',
    body: 'Submit applications inside user-defined rules and review levels.',
  },
  {
    title: 'Track',
    body: 'Record materials, outcomes, replies, and next steps after submission.',
  },
];

const mvpCoreLoop = [
  {
    title: 'Match',
    body: 'Understand why a role is recommended',
  },
  {
    title: 'Customize',
    body: 'Review and confirm AI-generated materials',
  },
  {
    title: 'Apply',
    body: 'Configure a personal automation boundary',
  },
  {
    title: 'Track',
    body: 'Complete and track one job application',
  },
] as const;

const mvpMustHave = [
  'Profile & Preferences',
  'Explainable Job Matching',
  'AI Resume Customization',
  'Controlled Auto Apply',
  'Application Tracking',
];

const supportingFeatures = [
  'Instant Job Notifications',
  'Cover Letter Generation',
  'Unified Inbox',
  'Nova AI Agent',
  'Contact Recommendations',
];

const futureOpportunities = [
  'AI interview preparation',
  'Salary negotiation support',
  'Long-term career planning',
  'Networking and referral workflows',
  'Recruiter-facing capabilities',
];

const successCriteria = [
  'Understand why a role is recommended',
  'Review and confirm AI-generated materials',
  'Configure a personal automation boundary',
  'Complete and track one job application',
];

const architectureFlow = [
  'Profile & Preferences',
  'Job Matching',
  'Resume Customization',
  'Auto Apply',
  'Applications & Inbox',
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
      ['Problem', 'Users could not understand what the number meant or whether it should drive action.'],
      ['Final', 'Connected the score to skill gaps, recommendation reasons, and resume suggestions.'],
    ],
    validation: [
      'Match explanation view rate',
      'Job detail to application conversion',
      'Application rate by match band',
      'Decision time before and after viewing explanations',
    ],
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
      ['Problem', 'Users could not quickly see what changed or whether the content was accurate.'],
      ['Final', 'Added change summary, keyword cues, highlighted edits, and two review modes.'],
    ],
    validation: [
      'AI resume completion rate',
      'Direct-use rate after generation',
      'Editor entry rate',
      'Manual edit or restore rate',
      'Time from generation to application',
    ],
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
      ['Problem', 'Users could not control role quality, material use, or confirmation needs.'],
      ['Final', 'Added matching strategy, autonomy level, material preferences, and notifications.'],
    ],
    validation: [
      'Auto Apply setup completion rate',
      'Matching strategy selection',
      'Autonomy level selection',
      'Submission success and failure rate',
      'Pause, close, or rule edit rate',
    ],
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
      ['Risk', 'Automation becomes a black box after submission.'],
      ['Decision', 'Every automated action and outcome stays visible.'],
      ['Final', 'Users can return from any status to a single application detail view.'],
    ],
    validation: [
      'Dashboard weekly use rate',
      'Status update engagement',
      'Reply tracking completion',
      'Application detail revisit rate',
    ],
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

const launchStates = [
  {
    system: 'Job Matching',
    states: ['Loading', 'Matched', 'Insufficient profile', 'No roles', 'Fetch failed'],
  },
  {
    system: 'Resume Generation',
    states: ['Waiting', 'Generating', 'Ready for review', 'Failed', 'Regenerated'],
  },
  {
    system: 'Auto Apply',
    states: ['Queued', 'Awaiting approval', 'Submitting', 'Submitted', 'Failed', 'Manual step required'],
  },
  {
    system: 'Application Tracking',
    states: ['Applied', 'Under Review', 'Interview', 'Rejected', 'Offer', 'Unknown'],
  },
];

const technicalConstraints = [
  ['Direct automation', 'Standard forms with supported fields and valid login state'],
  ['User confirmation', 'Material or form questions need review before submit'],
  ['Partial manual step', 'Platform-specific verification or missing form support'],
  ['Not supported yet', 'External limitations make automated execution unreliable'],
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
    body: '179 of 263 new users completed onboarding, uploaded a resume, and set job preferences.',
  },
  {
    label: 'Adoption',
    value: '19.39%',
    title: '30-day Auto Apply activation',
    body: '51 of 263 new users enabled Auto Apply during the last 30 days.',
  },
  {
    label: 'Reliability',
    value: '88.21%',
    title: 'Final application success rate',
    body: '1,803 automated applications were successfully submitted during the last 30 days.',
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
    body: '7 of 65 successful Auto Apply users received interview invitations, based on Inbox classification.',
  },
];

const learnings = [
  {
    title: 'Users preferred conditional automation',
    body: 'Most users did not reject automation. They wanted clearer boundaries around when AI could act and when they could review.',
  },
  {
    title: 'Explainability shaped conversion',
    body: 'The match score helped users sort opportunities, but explanations helped them decide whether to continue.',
  },
  {
    title: 'AI generation did not remove the user',
    body: 'Resume generation reduced repetitive work, but users still needed to verify accuracy and personal expression.',
  },
];

const reflectionWorked = [
  'Defining automation as a rule system instead of a feature switch',
  'Connecting matching, resume customization, applying, and tracking into one application loop',
  'Treating explanation and traceability as part of automation, not supporting content',
];

const reflectionImprovements = [
  'The MVP covered a broad surface across matching, resume generation, Auto Apply, inbox, and AI Agent.',
  'Technical constraints around third-party forms should have entered product definition earlier.',
  'Trust needs qualitative validation beyond behavior metrics such as usage and retention.',
];

const nextSteps = [
  ['Improve Activation', 'Simplify onboarding and Auto Apply setup so users reach the first high-relevance application faster.'],
  ['Improve Reliability', 'Increase resume accuracy, submission success, and failure recovery clarity.'],
  ['Improve Outcome Quality', 'Shift the core metric toward high-match applications that create meaningful responses.'],
  ['Build a Learning Loop', 'Use application outcomes to refine preferences, matching rules, and material strategy.'],
];

const sectionStyle = {
  padding: 'clamp(56px, 7vw, 88px) clamp(24px, 5vw, 64px)',
} as const;

const bodyStyle = {
  fontFamily: fontFamily.sans,
} as const;

const displayStyle = {
  fontFamily: fontFamily.display,
} as const;

function SectionHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="flex flex-col gap-4 pb-4 md:gap-5 md:pb-6">
      <p className="m-0 text-[13px] font-light uppercase leading-[20px] text-[#ed5b2b]" style={bodyStyle}>
        {eyebrow}
      </p>
      <h2 className="m-0 max-w-[820px] text-[26px] font-medium leading-[1.12] text-[#0a0a0a] md:text-[38px]" style={displayStyle}>
        {title}
      </h2>
      {intro ? (
        <p className="m-0 max-w-[820px] text-[16px] font-light leading-[1.65] text-[#0a0a0a]/68 md:text-[16px]" style={bodyStyle}>
          {intro}
        </p>
      ) : null}
    </header>
  );
}

function NumberedCard({ index, title, body }: { index: number; title: string; body: string }) {
  return (
    <article className="py-4">
      <p className="m-0 mb-5 text-[12px] font-light text-[#ed5b2b]" style={bodyStyle}>
        {String(index + 1).padStart(2, '0')}
      </p>
      <h3 className="m-0 mb-3 text-[19px] font-normal leading-[1.25] text-[#0a0a0a]" style={bodyStyle}>
        {title}
      </h3>
      <p className="m-0 text-[15px] font-light leading-[1.65] text-[#0a0a0a]/68" style={bodyStyle}>
        {body}
      </p>
    </article>
  );
}

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

function VisualPlaceholder({ label, description }: { label: string; description: string }) {
  return (
    <div className="flex min-h-[320px] flex-col justify-between border border-dashed border-[#cccccc] p-6">
      <p className="m-0 text-[13px] font-light uppercase text-[#ed5b2b]" style={bodyStyle}>
        Image placeholder
      </p>
      <div>
        <h3 className="m-0 mb-3 text-[21px] font-normal text-[#0a0a0a]" style={displayStyle}>
          {label}
        </h3>
        <p className="m-0 max-w-[520px] text-[14px] font-light leading-[1.6] text-[#0a0a0a]/58" style={bodyStyle}>
          {description}
        </p>
      </div>
    </div>
  );
}

function PersonaPhotoCard({ persona }: { persona: (typeof personas)[number] }) {
  const isFirstTime = persona.id === 'first-time';

  return (
    <div className="relative size-[260px] shrink-0 overflow-hidden rounded-[24px] bg-[#1b1b1b]">
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
        className={`absolute rounded-[15px] border border-[#ed5b2b] bg-white/8 px-[6px] py-1 backdrop-blur-[6.75px] ${
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
    <div className="flex size-[260px] shrink-0 flex-col items-start justify-between rounded-[24px] border border-[#cccccc] px-6 py-7">
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
              className="inline-flex rounded-[24px] border px-[6px] py-[3px] text-[10px] font-normal leading-none"
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
                className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-[#070707] text-[14px] font-normal leading-none text-white ${
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
        <article className={`border border-[#cccccc] p-5 ${stage.active ? '' : 'opacity-40'}`} key={stage.number}>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#070707] text-[14px] text-white" style={bodyStyle}>
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
    { src: '/img/jobnova/decision-tracking-top.png', alt: 'Annotated JobNova application tracking overview', width: 815, height: 602, left: 6, top: 22 },
    { src: '/img/jobnova/decision-tracking-detail.png', alt: 'Annotated JobNova application and inbox tracking design', width: 1041, height: 1094, left: -108, top: 651 },
  ],
] as const;

const decisionVisualHeights = [1590, 1284, 676, 1725] as const;

function DesignDecisionVisual({ index }: { index: number }) {
  const visuals = decisionVisuals[index];

  return (
    <>
      <div
        className={`relative hidden w-[826px] lg:block ${index === 2 ? '' : 'rounded-3xl'}`}
        style={{ height: decisionVisualHeights[index] }}
      >
        {visuals.map((visual) => (
          <Image
            key={visual.src}
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
            className="pointer-events-none absolute max-w-none object-cover"
            style={{ left: visual.left, top: visual.top, width: visual.width, height: visual.height }}
          />
        ))}
      </div>

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-x-auto lg:hidden">
        <div className="flex w-[760px] flex-col gap-6 px-5">
          {visuals.map((visual) => (
            <Image
              key={visual.src}
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
              className="h-auto w-[720px] max-w-none"
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default function JobnovaAIPlatformPage() {
  return (
    <div className="mei-project-page w-full">
      <CaseStudyControls tldrPoints={tldrPoints} />
      <CaseStudyHero
        title="JobNova AI Job Search Platform"
        subtitle="Designing a 0-to-1 AI job-search system that helps users complete relevant applications faster without giving up trust or control."
        tags={['0-to-1 AI SaaS', 'Product Strategy', 'UX Research', 'AI Workflow', 'Design System']}
        aboutLabel="About JobNova"
        about="JobNova is an AI job-search platform for candidates, connecting job matching, resume customization, Auto Apply, and application tracking into one continuous workflow. It helps users reduce repetitive work and complete high-relevance applications more quickly and at the right moment."
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
          { label: 'Year', value: ['2025 – Ongoing'] },
        ]}
        visualLabel="JobNova product system"
        visualSrc="/img/jobnova/Jobnova.avif"
        visualAlt="JobNova AI job-search platform shown across job matching, Auto Apply, and application scoring interfaces."
        visualObjectPosition="center bottom"
        visualObjectFit="contain"
        visualImageScale={0.9}
        visualTransformOrigin="center bottom"
        visualHeight="clamp(300px, 38vw, 540px)"
        visualBackground="radial-gradient(circle at 76% 24%, rgb(174 255 72 / 0.24), transparent 27%), radial-gradient(circle at 20% 78%, rgb(166 139 255 / 0.2), transparent 30%), radial-gradient(circle at 52% 54%, rgb(57 91 129 / 0.3), transparent 42%), linear-gradient(135deg, #05070d 0%, #0b1220 48%, #07110f 100%)"
        visualNavTone="light"
        compactTypography
        wideDetails
      />

      <section style={sectionStyle}>
        <div>
          <div className="flex flex-col gap-14 md:gap-20">
            <div data-case-nav-label="Early Traction, Real Impact">
              <p className="m-0 mb-3 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                1. Early Traction, Real Impact
              </p>
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

            <div className="max-w-[980px]" data-case-nav-label="Understanding the Space">
              <p className="m-0 mb-3 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                2. Understanding the Space
              </p>

              <div className="flex flex-col items-stretch justify-between gap-8 md:flex-row md:items-start">
                <div className="flex min-h-[244px] w-full flex-col justify-between md:w-[589px]">
                  <div className="flex flex-col gap-4">
                    <h2 className="m-0 text-[22px] font-normal leading-[1.3] text-[#0a0a0a]" style={bodyStyle}>
                      More job-search tools, but the workflow was still fragmented.
                    </h2>
                    <p className="m-0 text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                      Job seekers had plenty of specialized tools, but completing one application still meant jumping between recruiting platforms, resume editors, AI writing tools, email, and personal trackers.
                    </p>
                  </div>
                  <h3 className="m-0 pt-7 text-[20px] font-normal leading-none text-[#0a0a0a] md:pt-0" style={bodyStyle}>
                    The Process
                  </h3>
                </div>

                <aside className="w-full shrink-0 bg-[#f3f1ea] p-3 text-black md:w-[278px]" aria-label="Job-search market signals">
                  <div className="flex flex-col gap-3 uppercase" style={bodyStyle}>
                    <div>
                      <p className="m-0 text-[24px] font-bold leading-[1.05]">75%</p>
                      <p className="m-0 text-[10px] font-light leading-[1.2]">Resumes rejected before a human reads them</p>
                    </div>
                    <div>
                      <p className="m-0 text-[24px] font-bold leading-[1.05]">200+</p>
                      <p className="m-0 text-[10px] font-light leading-[1.2]">Applications submitted before a single offer</p>
                    </div>
                    <div>
                      <p className="m-0 text-[24px] font-bold leading-[1.05]">24 hrs</p>
                      <p className="m-0 text-[10px] font-light leading-[1.2]">The critical window — early applicants get 3× more callbacks</p>
                    </div>
                  </div>
                </aside>
              </div>

              <div className="mt-4 grid border-y border-[#cccccc] md:grid-cols-6" aria-label="Fragmented job-search workflow">
                {fragmentedWorkflow.map((step, index) => (
                  <div
                    key={step}
                    className={`relative flex min-h-[92px] items-center justify-between gap-4 border-b border-[#cccccc] py-5 pr-5 last:border-b-0 md:border-b-0 ${index < fragmentedWorkflow.length - 1 ? 'md:border-r' : ''} ${index > 0 ? 'md:pl-5' : ''}`}
                  >
                    <div>
                      <p className="m-0 mb-3 text-[12px] font-light text-[#ed5b2b]" style={bodyStyle}>
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <p className="m-0 text-[15px] font-light leading-[1.35] text-[#0a0a0a]" style={bodyStyle}>
                        {step}
                      </p>
                    </div>
                    {index < fragmentedWorkflow.length - 1 ? (
                      <span className="text-[15px] font-light text-[#0a0a0a]/38 md:absolute md:-right-[11px] md:top-1/2 md:bg-white md:px-1" style={bodyStyle}>
                        -&gt;
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>

              <p className="m-0 mt-7 max-w-[840px] text-[15px] font-light leading-6 text-[#0a0a0a]/72" style={bodyStyle}>
                JobNova’s opportunity was to{' '}
                <span className="text-[#ed5b2b]">
                  reduce those handoffs: keep fit reasoning, resume changes, application actions, and follow-up status in one guided system
                </span>{' '}
                users could still control.
              </p>
            </div>

            <div className="max-w-[980px]">
              <p className="m-0 mb-4 text-[13px] font-light uppercase leading-[19.5px] text-[#ed5b2b]" style={bodyStyle}>
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

            <div className="flex max-w-[980px] flex-col gap-12" data-case-nav-label="How We Worked">
              <div className="flex flex-col gap-3">
                <p className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                  3. How We Worked
                </p>
                <h2 className="m-0 text-[22px] font-normal leading-none text-[#0a0a0a]" style={bodyStyle}>
                  Design Process
                </h2>
              </div>

              <div>
                <DesktopProcessTimeline />
                <MobileProcessTimeline />
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="m-0 text-[22px] font-normal leading-none text-[#0a0a0a]" style={bodyStyle}>
                  The Challenges
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {principles.map((principle, index) => (
                    <article key={principle.title} className="border border-[#cccccc] p-5">
                      <p className="m-0 text-[12px] font-light leading-[18px] text-[#ed5b2b]" style={bodyStyle}>
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <h3 className="m-0 mt-4 text-[16px] font-normal leading-6 text-[#0a0a0a]" style={displayStyle}>
                        {principle.title}
                      </h3>
                      <p className="m-0 mt-2 text-[14px] font-light leading-[21px] text-[#0a0a0a]/66" style={bodyStyle}>
                        {principle.body}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex max-w-[980px] flex-col gap-12" data-case-nav-label="Initial Hypothesis">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <p className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                    4. Initial Hypothesis
                  </p>
                  <h2 className="m-0 max-w-[900px] text-[22px] font-normal leading-[1.32] text-[#0a0a0a]" style={bodyStyle}>
                    We first assumed the main barrier was repetitive work and application speed.
                  </h2>
                </div>
                <p className="m-0 max-w-[940px] text-[15px] font-light leading-6 text-[#0a0a0a]/72" style={bodyStyle}>
                  Based on desktop research and competitive analysis, the team believed if AI could{' '}
                  <span className="text-[#ed5b2b]">
                    discover relevant roles, tailor resumes to each job, and complete repeated application steps
                  </span>
                  , users could apply faster and miss fewer opportunities.
                </p>
              </div>

              <div className="bg-[#f3f1ea] p-5">
                <p className="m-0 text-[13px] font-light uppercase leading-[19.5px] text-[#ed5b2b]" style={bodyStyle}>
                  Early Product Loop
                </p>
                <div className="mt-4 flex flex-col items-center sm:flex-row sm:justify-between">
                  {earlyProductLoop.map((step, index) => {
                    const icon = [
                      '/img/jobnova/hypothesis-discover.svg',
                      '/img/jobnova/hypothesis-customize.svg',
                      '/img/jobnova/hypothesis-apply.svg',
                    ][index];

                    return (
                      <div key={step} className="contents">
                        <div className="flex min-w-[112px] items-center justify-center gap-3 sm:justify-start">
                          <Image src={icon} alt="" width={24} height={24} aria-hidden />
                          <p className="m-0 text-[16px] font-normal leading-6 text-[#0a0a0a]" style={bodyStyle}>
                            {step}
                          </p>
                        </div>
                        {index < earlyProductLoop.length - 1 ? (
                          <Image
                            src="/img/jobnova/hypothesis-connector.svg"
                            alt=""
                            width={241}
                            height={8}
                            aria-hidden
                            className="my-5 h-auto w-[56px] rotate-90 sm:mx-4 sm:my-0 sm:w-full sm:max-w-[241px] sm:rotate-0"
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="m-0 text-[13px] font-light uppercase leading-[19.5px] text-[#ed5b2b]" style={bodyStyle}>
                  Assumptions to Validate
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-y-5 lg:grid-cols-4 lg:gap-0">
                  {initialAssumptions.map((assumption, index) => (
                    <article key={assumption.title} className="border-l-2 border-[#ed5b2b] pl-3.5 lg:pr-5">
                      <h3 className="m-0 text-[14px] font-normal leading-[1.4] text-[#ed5b2b]" style={bodyStyle}>
                        {index === 3 ? 'Discover, customize, and apply form the loop' : assumption.title}
                      </h3>
                      <p className="m-0 mt-2 text-[13px] font-light leading-[1.55] text-[#0a0a0a]/66" style={bodyStyle}>
                        {assumption.body}
                      </p>
                    </article>
                  ))}
                </div>
                <p className="m-0 mt-5 max-w-[820px] text-[14px] font-light leading-[1.6] text-[#0a0a0a]/66" style={bodyStyle}>
                  At this stage, we had a product direction, but not enough evidence to define the right product.
                </p>
              </div>
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

              <div className="flex flex-col gap-4">
                <p className="m-0 text-[13px] font-light uppercase leading-[19.5px] text-[#ed5b2b]" style={bodyStyle}>
                  What We Focused On
                </p>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {trustFocusCards.map((card, index) => (
                    <article
                      key={card.title}
                      className="relative h-[232px] overflow-hidden rounded-3xl border border-[#cccccc] px-5 pb-[58px] pt-5"
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
                  <div className="bg-[#f3f1ea] p-5">
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
                          className="border border-[#cccccc] px-3 py-2 text-[12px] font-light leading-[18px] text-[#0a0a0a]/70"
                          style={bodyStyle}
                        >
                          {segment}
                        </span>
                      ))}
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

              <div className="flex flex-col gap-3">
                <h2 className="m-0 text-[19px] font-normal leading-[1.35] text-[#0a0a0a]" style={bodyStyle}>
                  Research changed the product from an automation tool into a controlled AI system.
                </h2>
                <div className="grid overflow-hidden border border-[#cccccc] lg:min-h-[286px] lg:grid-cols-[1fr_72px_1fr]">
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

            <div className="flex max-w-[980px] flex-col gap-10" data-case-nav-label="MVP Scope">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <p className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                    6. MVP Scope
                  </p>
                  <h2 className="m-0 max-w-[820px] text-[22px] font-normal leading-[1.32] text-[#0a0a0a]" style={bodyStyle}>
                    We defined MVP around one complete and trustworthy application journey.
                  </h2>
                </div>
                <p className="m-0 max-w-[820px] text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                  Instead of measuring MVP by the number of AI features, we asked which capabilities needed to exist together for a user to{' '}
                  <span className="text-[#ed5b2b]">
                    understand a role, tailor materials, apply with control, and track the result
                  </span>
                  .
                </p>
              </div>

              <div
                className="grid border-y border-[#cccccc] sm:grid-cols-2 lg:h-[136px] lg:grid-cols-4"
                aria-label="Core product loop: match, customize, apply, track"
              >
                {mvpCoreLoop.map((step, index) => (
                  <article
                    key={step.title}
                    className={`relative flex min-h-[136px] flex-col gap-2 px-5 py-5 lg:min-h-0 ${
                      index < mvpCoreLoop.length - 1
                        ? 'border-b border-[#cccccc] sm:border-b-0 sm:border-r'
                        : ''
                    } ${index === 1 ? 'sm:border-r-0 lg:border-r' : ''} ${
                      index >= 2 ? 'sm:border-t lg:border-t-0' : ''
                    }`}
                  >
                    <p className="m-0 text-[12px] font-light leading-[18px] text-[#ed5b2b]" style={bodyStyle}>
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="m-0 text-[15px] font-light leading-[20.25px] text-[#070707]" style={bodyStyle}>
                      {step.title}
                    </h3>
                    <p className="m-0 max-w-[216px] text-[14px] font-light leading-normal text-[#0a0a0a]/72" style={bodyStyle}>
                      {step.body}
                    </p>
                    {index < mvpCoreLoop.length - 1 ? (
                      <span
                        className="absolute -right-[9px] top-[46px] z-10 hidden bg-white px-1 text-[15px] font-light leading-[22.5px] text-[#0a0a0a]/38 lg:block"
                        aria-hidden
                        style={bodyStyle}
                      >
                        -&gt;
                      </span>
                    ) : null}
                  </article>
                ))}
              </div>

              <div className="relative left-1/2 h-[540px] w-screen -translate-x-1/2 overflow-x-auto lg:h-[768px] lg:w-[1216px] lg:overflow-visible">
                <div className="flex h-full w-[900px] items-center lg:w-[1216px]">
                  <Image
                    src="/img/jobnova/mvp-information-architecture.png"
                    alt="JobNova information architecture connecting onboarding, authentication, navigation, jobs, profile, resume, AI chat, auto apply, applications, inbox, and settings."
                    width={1216}
                    height={672}
                    className="h-auto w-[900px] max-w-none lg:w-[1216px]"
                  />
                </div>
              </div>
            </div>

            <div className="flex max-w-[980px] flex-col gap-14" data-case-nav-label="Design Decisions">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <p className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                    7. Design Decisions
                  </p>
                  <h2 className="m-0 text-[22px] font-normal leading-[1.32] text-[#0a0a0a]" style={bodyStyle}>
                    Three moments where trust had to be designed into the workflow.
                  </h2>
                </div>
                <p className="m-0 max-w-[820px] text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                  The strongest design decisions were not isolated screens. They were interaction rules that clarified{' '}
                  <span className="text-[#ed5b2b]">what AI knew, what it changed, and when it was allowed to act</span>.
                </p>
              </div>

              {featureSections.slice(0, 4).map((feature, index) => (
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
                </div>
              ))}
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

              <div className="w-full bg-[#f3f1ea] p-4 sm:p-6 lg:p-8">
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
                  <article key={metric.label} className="flex min-h-[286px] flex-col border border-[#cccccc] p-5">
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

            <div className="flex max-w-[980px] flex-col gap-10" data-case-nav-label="Reflection">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <p className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
                    10. Reflection
                  </p>
                  <h2 className="m-0 max-w-[820px] text-[22px] font-normal leading-[1.32] text-[#0a0a0a]" style={bodyStyle}>
                    The project clarified what trustworthy AI automation needs to make visible.
                  </h2>
                </div>
                <p className="m-0 max-w-[820px] text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
                  Designing JobNova was less about deciding how many tasks AI could perform and more about defining{' '}
                  <span className="text-[#ed5b2b]">
                    when AI acts, when users intervene, and how every automated outcome remains understandable and accountable
                  </span>
                  .
                </p>
              </div>

              <div className="grid lg:grid-cols-2">
                {[
                  ['What worked', reflectionWorked],
                  ['What could improve', reflectionImprovements],
                ].map(([title, items]) => (
                  <article key={title as string} className="min-h-[280px] border border-[#cccccc] p-6">
                    <h3 className="m-0 text-[18px] font-normal leading-7 text-[#0a0a0a]" style={displayStyle}>
                      {title}
                    </h3>
                    <div className="mx-auto mt-4 flex max-w-[248px] flex-col gap-2.5">
                      {(items as string[]).map((item) => (
                        <p key={item} className="m-0 text-[14px] font-light leading-[22.4px] text-[#0a0a0a]/68" style={bodyStyle}>
                          {item}
                        </p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <blockquote className="m-0 max-w-[880px] border-l border-[#ed5b2b] pl-[21px] text-[16px] font-normal leading-6 text-[#0a0a0a]" style={bodyStyle}>
                Designing a 0-to-1 AI product was not about making AI do more. It was about making every AI action understandable, bounded, and recoverable.
              </blockquote>

              <div>
                <h3 className="m-0 text-[18px] font-normal leading-7 text-[#0a0a0a]" style={displayStyle}>
                  Next steps
                </h3>
                <div className="mt-1 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {nextSteps.map(([title, body]) => (
                    <div key={title}>
                      <p className="m-0 text-[13px] font-light uppercase leading-[19.5px] text-[#ed5b2b]" style={bodyStyle}>
                        {title}
                      </p>
                      <p className="m-0 mt-1 text-[14px] font-light leading-[22.4px] text-[#0a0a0a]/68" style={bodyStyle}>
                        {body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <CaseStudyBackButton />
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
