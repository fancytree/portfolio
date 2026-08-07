import type { Metadata } from 'next';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import CaseStudyBackButton from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/CaseStudyControls';
import CaseStudyHero from '../../components/CaseStudyHero';
import { fontFamily } from '@/lib/design-tokens';
import AutoApplyStateSwitcher from './AutoApplyStateSwitcher';

export const metadata: Metadata = {
 title: 'JobNova AI Job Search Platform — Problem | Mei Chai',
 description:
 'A portfolio case study about connecting the fragmented AI job-search journey without removing user control.',
};

const problemDimensions = [
 {
 title: 'Fragmented tools',
 body:
 'Users had to combine multiple products to complete one application—from discovering a role to customizing materials, submitting forms, and tracking progress.',
 },
 {
 title: 'Repeated work',
 body:
 'Personal information, job requirements, resume content, and application status did not move across tools, forcing users to repeatedly enter, transfer, and verify the same information.',
 },
 {
 title: 'Lost context and control',
 body:
 'Each automated task operated in isolation. Recommendations lacked evidence, generated materials required verification, and automated applications gave users limited visibility into what changed or was submitted.',
 },
] as const;

const fragmentedJourney = [
 { stage: 'Discover', tools: ['Job board', 'LinkedIn', 'Search alerts'] },
 { stage: 'Match', tools: ['AI matcher', 'ATS checker', 'Manual review'] },
 { stage: 'Customize', tools: ['Resume tool', 'Writing tool', 'Document editor'] },
 { stage: 'Apply', tools: ['Company portal', 'Auto-apply tool', 'Email'] },
 { stage: 'Track', tools: ['Spreadsheet', 'Notes app', 'Calendar'] },
] as const;

const trustBreakMoments = [
 {
 action: 'Recommend',
 risk: 'Wrong opportunity',
 body: 'AI recommends a role that conflicts with the user’s real constraints.',
 },
 {
 action: 'Edit',
 risk: 'Lost authorship',
 body: 'AI changes the meaning of an experience or adds unconfirmed claims.',
 },
 {
 action: 'Submit',
 risk: 'Unapproved information',
 body: 'AI sends answers the user has not reviewed or authorized.',
 },
 {
 action: 'Act',
 risk: 'No visibility',
 body: 'The user cannot see what happened, whether it worked, or how to recover.',
 },
] as const;

const automationRiskChain = [
 'More automation',
 'More uncertainty',
 'More verification',
 'Less efficiency',
 'Lower trust',
] as const;

const researchFlowV2 = [
 ['Interviews', 'Trust expectations'],
 ['Journey mapping', 'Failure moments'],
 ['Concept testing', 'Control preferences'],
 ['Prototype testing', 'Decision behavior'],
 ['Behavioral validation', 'Actual adoption'],
] as const;

const trustBreakdownMap = [
 ['Match', 'Why this job?', 'Evidence'],
 ['Customize', 'What did AI change?', 'Authorship'],
 ['Apply', 'What can AI submit?', 'Permission'],
 ['Track', 'What happened?', 'Visibility'],
] as const;

const researchFindingsV2 = [
 {
 label: 'Recommendations',
 title: 'Scores did not create confidence.',
 evidence: 'Users still opened the job description to verify a match score.',
 needs: ['Matched evidence', 'Missing requirements', 'Source context', 'Visible uncertainty'],
 implication: 'Explain the recommendation.',
 },
 {
 label: 'Editing',
 title: 'Speed did not replace authorship.',
 evidence: 'Users accepted clearer language, but not changed facts or invisible edits.',
 needs: ['Visible changes', 'Original content', 'Reversible edits', 'Final approval'],
 implication: 'Preserve user authorship.',
 },
 {
 label: 'Automation',
 title: 'Control needs changed with risk.',
 evidence: 'Authorization decreased as error cost and professional impact increased.',
 needs: ['Error cost', 'Reversibility', 'Sensitive data', 'Professional impact'],
 implication: 'Configure autonomy by action.',
 },
] as const;

const connectedWorkflow = [
 ['Match', 'Decide fit', 'Explain evidence'],
 ['Customize', 'Adapt materials', 'Preserve authorship'],
 ['Apply', 'Approve action', 'Respect permission'],
 ['Track', 'Follow up', 'Show status'],
] as const;

const sharedContext = ['Profile', 'Preferences', 'Resume versions', 'Application history'] as const;

const trustLayerPrinciples = [
 {
 label: 'Explain',
 title: 'Explain before asking users to trust',
 body: 'Show evidence before a recommendation or action.',
 coverage: [true, true, true, false],
 },
 {
 label: 'Boundary',
 title: 'Let users define the boundary',
 body: 'Users decide what AI can do and when it must ask.',
 coverage: [false, true, true, false],
 },
 {
 label: 'Recover',
 title: 'Keep actions visible and recoverable',
 body: 'Every action has a status, record, and recovery path.',
 coverage: [false, false, true, true],
 },
] as const;

const strategyToDesign = [
 ['Explain', 'Evidence-based recommendations'],
 ['Preserve control', 'Reversible AI editing'],
 ['Define autonomy', 'Permission-based application flow'],
] as const;

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
 'I focused the design around controlled Auto Apply, turning a binary automation feature into configurable autonomy with thresholds, permissions, visible status, and recovery paths.',
 },
 {
 label: 'Design Principle',
 body:
 'The core principles became simple and memorable: define the boundary, make every action visible, and let users recover when the workflow fails.',
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

const beforeWorkflow = [
 'Job boards',
 'Resume editor',
 'ChatGPT',
 'Google Docs',
 'ATS checker',
 'Email',
 'Spreadsheet',
 'Application portal',
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
 body:"Results mean nothing if users can't evaluate them. How do you surface reasoning?",
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

const mvpCoreLoop = [
 {
 title: 'Match',
 action: 'Decide',
 body: 'Discover relevant opportunities and understand why each role is recommended.',
 feature: 'Explainable Matching',
 },
 {
 title: 'Customize',
 action: 'Prepare',
 body: 'Tailor application materials while keeping AI-generated changes visible and editable.',
 feature: 'AI Resume Customization',
 },
 {
 title: 'Apply',
 action: 'Act',
 body: 'Submit within user-defined rules, permissions, and review boundaries.',
 feature: 'Controlled Auto Apply',
 },
 {
 title: 'Track',
 action: 'Account',
 body: 'Record what was submitted, monitor status, and surface recruiter responses.',
 feature: 'Application Tracking',
 },
] as const;

const earlyMvpScope = [
 'Job alerts',
 'Resume AI',
 'Cover letters',
 'Auto Apply',
 'Inbox',
 'AI Agent',
 'Networking',
 'Interview prep',
];

const mvpIncluded = [
 {
 group: 'Foundation',
 title: 'Profile & Preferences',
 body: 'Career goals, experience, skills, location, and job preferences establish the rules used across the workflow.',
 },
 {
 group: 'Core experience',
 title: 'Explainable Job Matching',
 body: 'Help users understand whether a role is worth applying for.',
 },
 {
 group: 'Core experience',
 title: 'AI Resume Customization',
 body: 'Prepare role-specific materials without removing user control.',
 },
 {
 group: 'Core experience',
 title: 'Controlled Auto Apply',
 body: 'Automate repetitive application steps within configurable boundaries.',
 },
 {
 group: 'Core experience',
 title: 'Application Tracking',
 body: 'Make every application and outcome visible and traceable.',
 },
];

const successCriteria = [
 'Define job-search preferences',
 'Understand why a role is recommended',
 'Review and approve tailored materials',
 'Choose how much autonomy to give the system',
 'Submit and track an application successfully',
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
 observedSignal: '68% of registered users completed their first job match.',
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
 ['Problem', 'Users could not control role quality, material use, or confirmation needs.'],
 ['Final', 'Added matching strategy, autonomy level, material preferences, and notifications.'],
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
 observedSignal: '19.39% activated Auto Apply; final automated submission success reached 88.21%.',
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
 observedSignal: 'Inbox-classified outcomes recorded a 10.77% interview invitation rate among successful Auto Apply users.',
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
 padding: 'clamp(56px, 7vw, 88px) clamp(24px, 5vw, 64px)',
} as const;

const bodyStyle = {
 fontFamily: fontFamily.sans,
} as const;

const displayStyle = {
 fontFamily: fontFamily.display,
} as const;

function FocusedCaseSetupSection() {
 const setupRows = [
 ['Background', 'AI tools optimized isolated tasks; JobNova connected them into one application journey.'],
 ['My role', 'Product strategy · Research synthesis · IA · Interaction design · UI · Launch QA.'],
 ['Goal', 'Increase relevant coverage, speed, application quality, and follow-up continuity.'],
 ] as const;
 const problemCards = [
 {
 label: 'Time',
 value: '~1 day',
 title: 'Opportunities move fast',
 source: 'Large-scale job-search study',
 body: 'Median time for a vacancy to receive its first application. Users needed to discover relevant roles closer to when they appeared, not hours or days later through manual checking.',
 },
 {
 label: 'Scale',
 value: '20 → 3',
 title: 'More applications are often necessary',
 source: 'Stepstone 2025 survey',
 body: 'Median applications and resulting interviews in a recent job search. Creating interview opportunities often requires meaningful application volume.',
 },
 {
 label: 'Quality',
 value: '~50%',
 title: 'Volume alone does not guarantee quality',
 source: 'Totaljobs 2025 recruiter study',
 body: 'Applications that did not move past initial screening. Poorly matched applications could consume credits without improving outcomes.',
 },
 {
 label: 'Context',
 value: 'Every app',
 title: 'Scaling applications creates memory debt',
 source: 'Research insight',
 body: 'Every additional application created another resume, cover letter, answer set, and status to remember for follow-up and interview preparation.',
 },
 ];
 const iaSpaces = [
 {
 space: 'Discover',
 question: 'What opportunities are worth my attention?',
 pages: ['Job Search', 'Recommendations', 'Saved Jobs', 'Job Detail', 'Match Score'],
 },
 {
 space: 'Prepare',
 question: 'What should I submit?',
 pages: ['Resume Library', 'Resume Customization', 'Cover Letter', 'Profile Answers'],
 },
 {
 space: 'Apply',
 question: 'What can the system submit, and when do I intervene?',
 pages: ['Auto Apply Strategy', 'Application Review', 'Submission Queue', 'Required Actions'],
 },
 {
 space: 'Track',
 question: 'What happened, and what do I need next?',
 pages: ['Applications', 'Status', 'Submitted Materials', 'Screening Answers', 'Interview Prep'],
 },
 ];
 return (
 <section className="flex max-w-[980px] flex-col gap-12" data-case-nav-label="01 / From Problem to Product">
 <header className="pb-[clamp(42px,6vw,72px)]">
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 01 / From Problem to Product
 </p>
 <h1
 className="m-0 mt-7 max-w-[850px] text-[clamp(42px,6.6vw,88px)] font-normal leading-[0.96] tracking-[-0.045em] text-[#0a0a0a]"
 style={displayStyle}
 >
 Building JobNova from 0 to 1 meant increasing valuable application throughput.
 <br />
 <span className="text-[#ed5b2b]">Without losing quality or context.</span>
 </h1>
 <p className="m-0 mt-7 max-w-[740px] text-[18px] font-light leading-[1.6] text-[#0a0a0a]/66" style={bodyStyle}>
 JobNova connected discovery, matching, material preparation, submission, and tracking into one system so users could act on more relevant opportunities earlier while preserving quality and context.
 </p>
 </header>

 <section className="flex flex-col gap-5" aria-labelledby="overview-problem-title">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Problem
 </p>
 <h2 id="overview-problem-title" className="m-0 mt-3 max-w-[820px] text-[clamp(32px,4.6vw,58px)] font-normal leading-[1.04] tracking-[-0.03em] text-[#0a0a0a]" style={displayStyle}>
 Job seekers were competing against time, scale, and application quality.
 </h2>
 </div>
 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-2 lg:grid-cols-4">
 {problemCards.map((problem) => (
 <article key={problem.label} className="flex min-h-[286px] flex-col bg-white p-6">
 <div className="flex items-start justify-between gap-4">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 {problem.label}
 </p>
 <p className="m-0 text-right text-[9px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/34" style={bodyStyle}>
 {problem.source}
 </p>
 </div>
 <p className="m-0 mt-7 text-[clamp(34px,4.8vw,58px)] font-normal leading-none tracking-[-0.035em] text-[#0a0a0a]" style={displayStyle}>
 {problem.value}
 </p>
 <h3 className="m-0 mt-6 text-[22px] font-normal leading-[1.08] text-[#0a0a0a]" style={displayStyle}>
 {problem.title}
 </h3>
 <p className="m-0 mt-auto pt-6 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/64" style={bodyStyle}>
 {problem.body}
 </p>
 </article>
 ))}
 </div>
 <div className="grid gap-5 border-l border-[#ed5b2b] py-1 pl-5 lg:grid-cols-[1fr_360px] lg:items-end">
 <p className="m-0 max-w-[760px] text-[18px] font-normal leading-[1.45] text-[#0a0a0a]" style={bodyStyle}>
 The opportunity was to help users find relevant roles earlier, act on more of them, and preserve enough quality and context for those applications to turn into interviews.
 </p>
 <p className="m-0 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/52" style={bodyStyle}>
 JobNova connected Discover → Match → Customize → Apply → Track → Interview Prep into one continuous workflow.
 </p>
 </div>
 </section>

 <section className="flex flex-col gap-5" aria-labelledby="overview-process-title">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Design process
 </p>
 <h2 id="overview-process-title" className="m-0 mt-2 max-w-[680px] text-[22px] font-normal leading-[1.3] text-[#0a0a0a]" style={bodyStyle}>
 I moved from research and scoping into interaction design, validation, launch QA, and post-launch iteration.
 </h2>
 </div>
 <DesktopProcessTimeline />
 <MobileProcessTimeline />
 </section>

 <div className="grid gap-5 py-5 lg:grid-cols-3">
 {setupRows.map(([label, body]) => (
 <article key={label} className="border-l border-[#ed5b2b] pl-4">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 {label}
 </p>
 <p className="m-0 mt-2 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/58" style={bodyStyle}>
 {body}
 </p>
 </article>
 ))}
 </div>

 <section className="flex flex-col gap-5" aria-labelledby="overview-ia-title">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Information architecture
 </p>
 <h2 id="overview-ia-title" className="m-0 mt-3 max-w-[780px] text-[clamp(30px,4.2vw,54px)] font-normal leading-[1.05] tracking-[-0.03em] text-[#0a0a0a]" style={displayStyle}>
 The product was organized around the lifecycle of an opportunity.
 </h2>
 <p className="m-0 mt-4 max-w-[720px] text-[14px] font-light leading-[1.6] text-[#0a0a0a]/62" style={bodyStyle}>
 Rather than organizing the platform around AI capabilities, I structured it around the lifecycle of an opportunity.
 </p>
 </div>
 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] lg:grid-cols-4">
 {iaSpaces.map((space, index) => (
 <article key={space.space} className="flex min-h-[300px] flex-col bg-white p-5">
 <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
 {String(index + 1).padStart(2, '0')}
 </p>
 <h3 className="m-0 mt-6 text-[28px] font-normal leading-none text-[#0a0a0a]" style={displayStyle}>
 {space.space}
 </h3>
 <p className="m-0 mt-4 text-[13px] font-normal leading-[1.45] text-[#0a0a0a]" style={bodyStyle}>
 {space.question}
 </p>
 <div className="mt-auto flex flex-wrap gap-2 pt-6">
 {space.pages.map((page) => (
 <span key={page} className="border border-[#cccccc] px-2.5 py-1.5 text-[11px] font-light leading-[1.3] text-[#0a0a0a]/62" style={bodyStyle}>
 {page}
 </span>
 ))}
 </div>
 </article>
 ))}
 </div>
 </section>


 <blockquote className="m-0 border-l border-[#ed5b2b] py-1 pl-5">
 <p className="m-0 max-w-[760px] text-[19px] font-normal leading-[1.45] text-[#0a0a0a]" style={bodyStyle}>
 Across the platform, Auto Apply became the feature with the hardest trade-off because it directly affected application volume, credit usage, quality, timing, and downstream traceability.
 </p>
 </blockquote>
 </section>
 );
}

function FlowDiagram({ items, label }: { items: string[]; label: string }) {
 return (
 <div className="grid md:grid-cols-[repeat(var(--flow-count),minmax(0,1fr))]" style={{ '--flow-count': items.length } as CSSProperties} aria-label={label}>
 {items.map((item, index) => (
 <div
 key={item}
 className={`relative flex min-h-[92px] items-center justify-between gap-4 py-5 pr-5 ${index < items.length - 1 ? 'md:border-r' : ''} ${index > 0 ? 'md:pl-5' : ''}`}
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

function WorkflowThesisDiagram() {
 return (
 <figure className="m-0 overflow-hidden border border-[#cccccc]" aria-label="Fragmented job-search workflow compared with JobNova">
 <div className="grid lg:grid-cols-[1.35fr_86px_1fr]">
 <div className="bg-[#f3f1ea] p-5 sm:p-7">
 <div className="flex items-start justify-between gap-6">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.16em] text-[#0a0a0a]/42" style={bodyStyle}>
 Before
 </p>
 <h3 className="m-0 mt-2 text-[18px] font-normal leading-[1.35] text-[#0a0a0a]" style={bodyStyle}>
 One application, eight disconnected tools
 </h3>
 </div>
 <span className="shrink-0 text-[11px] font-light text-[#0a0a0a]/40" style={bodyStyle}>
 Fragmented
 </span>
 </div>
 <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden border border-[#d4d1c9] bg-[#d4d1c9] sm:grid-cols-4">
 {beforeWorkflow.map((step, index) => (
 <div key={step} className="relative flex min-h-[92px] flex-col justify-between bg-white p-3.5">
 <span className="text-[10px] font-light text-[#0a0a0a]/34" style={bodyStyle}>
 {String(index + 1).padStart(2, '0')}
 </span>
 <p className="m-0 text-[12px] font-light leading-[1.35] text-[#0a0a0a]/68" style={bodyStyle}>
 {step}
 </p>
 </div>
 ))}
 </div>
 </div>

 <div className="flex min-h-[72px] items-center justify-center bg-white lg:border-x">
 <div className="flex items-center gap-2 lg:flex-col">
 <span className="text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 Reframed as
 </span>
 <span className="text-[20px] font-light text-[#ed5b2b] lg:rotate-0" aria-hidden>
 -&gt;
 </span>
 </div>
 </div>

 <div className="flex flex-col justify-between bg-[#10100f] p-5 text-white sm:p-7">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.16em] text-[#aefd48]" style={bodyStyle}>
 JobNova
 </p>
 <h3 className="m-0 mt-2 max-w-[320px] text-[18px] font-normal leading-[1.35] text-white" style={bodyStyle}>
 One continuous, governable workflow
 </h3>
 </div>
 <div className="mt-7 flex flex-col">
 {jobnovaWorkflow.map((step, index) => (
 <div
 key={step}
 className={`flex min-h-[58px] items-center justify-between py-3 ${
 index < jobnovaWorkflow.length - 1 ? ' border-white/18' : ''
 }`}
 >
 <span className="text-[11px] font-light text-[#aefd48]" style={bodyStyle}>
 {String(index + 1).padStart(2, '0')}
 </span>
 <p className="m-0 text-[15px] font-light text-white" style={bodyStyle}>
 {step}
 </p>
 <span className="text-[13px] font-light text-white/35" aria-hidden>
 {index < jobnovaWorkflow.length - 1 ? '↓' : '✓'}
 </span>
 </div>
 ))}
 </div>
 </div>
 </div>
 <figcaption className="bg-white px-5 py-3 text-[11px] font-light leading-[1.5] text-[#0a0a0a]/48 sm:px-7" style={bodyStyle}>
 The product advantage was not another isolated AI feature. It was the orchestration layer connecting discovery, judgment, content, execution, and follow-up.
 </figcaption>
 </figure>
 );
}

function ProductOpportunitySection() {
 const disconnectedTasks = ['Find jobs', 'Judge fit', 'Tailor resume', 'Write cover letter', 'Fill forms', 'Track status', 'Prepare for interview'];

 return (
 <section className="flex max-w-[980px] flex-col gap-12 pt-8" data-case-nav-label="03 / Product Opportunity">
 <header className="grid gap-8 lg:grid-cols-[190px_1fr]">
 <div>
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 03 / Product Opportunity
 </p>
 <p className="m-0 mt-3 text-[11px] font-light text-[#0a0a0a]/38" style={bodyStyle}>
 Workflow, not tool count
 </p>
 </div>
 <div>
 <h2 className="m-0 max-w-[840px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]" style={displayStyle}>
 The value was not another AI feature, but a connected application workflow.
 </h2>
 <p className="m-0 mt-6 max-w-[720px] text-[17px] font-light leading-[1.6] text-[#0a0a0a]/66" style={bodyStyle}>
 Users already had tools for pieces of the process. The gap was continuity: every handoff forced them to move context, repeat judgment, and reconstruct what happened later.
 </p>
 </div>
 </header>

 <WorkflowThesisDiagram />

 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-7">
 {disconnectedTasks.map((task, index) => (
 <article key={task} className="flex min-h-[118px] flex-col bg-white p-4">
 <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
 {String(index + 1).padStart(2, '0')}
 </p>
 <p className="m-0 mt-auto text-[13px] font-light leading-[1.35] text-[#0a0a0a]/70" style={bodyStyle}>
 {task}
 </p>
 </article>
 ))}
 </div>
 </section>
 );
}

function WhyAutoApplySection() {
 const tensions = [
 ['Coverage', 'Good roles expire quickly, and users cannot monitor every new posting all day.'],
 ['Credit', 'Every application consumes limited credits, so volume without judgment becomes expensive.'],
 ['Quality', 'More submissions only help if the resume, cover letter, and answers remain credible.'],
 ['Speed', 'Manual review protects quality, but reviewing every role can erase the timing advantage.'],
 ['Traceability', 'After submission, users still need to know what was sent when an interview arrives.'],
 ];

 return (
 <section className="flex max-w-[980px] flex-col gap-12 pt-8" data-case-nav-label="04 / Why Auto Apply">
 <header>
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 04 / Why Auto Apply
 </p>
 <h2 className="m-0 mt-7 max-w-[880px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]" style={displayStyle}>
 Auto Apply was the feature that determined whether the system could create real value.
 </h2>
 <p className="m-0 mt-6 max-w-[740px] text-[17px] font-light leading-[1.6] text-[#0a0a0a]/66" style={bodyStyle}>
 It was not just a submit button. It was the place where the product had to balance quantity, credit spend, application quality, timing, and the record users needed afterward.
 </p>
 </header>

 <div className="grid md:grid-cols-5">
 {tensions.map(([title, body], index) => (
 <article key={title} className={`min-h-[220px] py-6 md:px-5 ${index < tensions.length - 1 ? ' md:border-r' : ''} ${index === 0 ? 'md:pl-0' : ''}`}>
 <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
 {String(index + 1).padStart(2, '0')}
 </p>
 <h3 className="m-0 mt-7 text-[24px] font-normal leading-none text-[#0a0a0a]" style={displayStyle}>
 {title}
 </h3>
 <p className="m-0 mt-5 text-[13px] font-light leading-[1.6] text-[#0a0a0a]/62" style={bodyStyle}>
 {body}
 </p>
 </article>
 ))}
 </div>

 <blockquote className="m-0 border-l border-[#ed5b2b] py-1 pl-5">
 <p className="m-0 max-w-[760px] text-[22px] font-normal leading-[1.35] text-[#0a0a0a]" style={bodyStyle}>
 Auto Apply needed to help users apply to more relevant roles earlier, without wasting credits or lowering application quality.
 </p>
 </blockquote>
 </section>
 );
}

function UserGoalsTradeoffSection() {
 const goals = [
 ['More relevant applications', 'Increase coverage of roles that actually fit the user’s goals and constraints.'],
 ['Better credit efficiency', 'Spend limited credits on opportunities with enough value to justify the application.'],
 ['Higher application quality', 'Keep resume claims, cover letters, and screening answers accurate and role-specific.'],
 ['Faster submission', 'Submit early enough to matter without turning every role into a manual review task.'],
 ['Traceable context', 'Save what was sent so users can follow up and prepare when interviews arrive.'],
 ];

 return (
 <section className="flex max-w-[980px] flex-col gap-12 pt-8" data-case-nav-label="05 / User Goals">
 <header>
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 05 / User Goals and Core Trade-off
 </p>
 <h2 className="m-0 mt-7 max-w-[860px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]" style={displayStyle}>
 Users were optimizing for valuable applications, not maximum automation.
 </h2>
 </header>

 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-5">
 {goals.map(([title, body], index) => (
 <article key={title} className="flex min-h-[226px] flex-col bg-white p-5">
 <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
 {String(index + 1).padStart(2, '0')}
 </p>
 <h3 className="m-0 mt-8 text-[20px] font-normal leading-[1.12] text-[#0a0a0a]" style={displayStyle}>
 {title}
 </h3>
 <p className="m-0 mt-auto text-[12px] font-light leading-[1.55] text-[#0a0a0a]/62" style={bodyStyle}>
 {body}
 </p>
 </article>
 ))}
 </div>

 <p className="m-0 max-w-[780px] text-[18px] font-light leading-[1.6] text-[#0a0a0a]/68" style={bodyStyle}>
 The design problem became less about whether users wanted automation and more about how the system could balance coverage, credit efficiency, application quality, speed, and traceability.
 </p>
 </section>
 );
}

function AutoApplyChallengeSection() {
 const dimensions = [
 ['Opportunity value', 'Is this role worth spending a credit on now?'],
 ['Information confidence', 'Does the system have enough accurate information to prepare the application?'],
 ['Submission commitment', 'Is this action reversible, or does it represent the user externally?'],
 ];

 return (
 <section className="flex max-w-[980px] flex-col gap-12 pt-8" data-case-nav-label="06 / Design Challenge">
 <header className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-end">
 <div>
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 06 / Design Challenge
 </p>
 <h2 className="m-0 mt-7 max-w-[760px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]" style={displayStyle}>
 The challenge was deciding when automation created leverage and when user judgment created value.
 </h2>
 </div>
 <blockquote className="m-0 border-l border-[#ed5b2b] py-1 pl-5">
 <p className="m-0 text-[16px] font-normal leading-[1.55] text-[#0a0a0a]" style={bodyStyle}>
 How might Auto Apply submit more high-quality applications early, while spending credits intentionally and preserving a complete record of every submission?
 </p>
 </blockquote>
 </header>

 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-3">
 {dimensions.map(([title, body], index) => (
 <article key={title} className="bg-white p-6">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Decision dimension {String(index + 1).padStart(2, '0')}
 </p>
 <h3 className="m-0 mt-6 text-[24px] font-normal leading-[1.08] text-[#0a0a0a]" style={displayStyle}>
 {title}
 </h3>
 <p className="m-0 mt-4 text-[13px] font-light leading-[1.6] text-[#0a0a0a]/64" style={bodyStyle}>
 {body}
 </p>
 </article>
 ))}
 </div>
 </section>
 );
}

function CreditDecisionSection() {
 const rules = ['Job type', 'Location', 'Salary', 'Work authorization', 'Match threshold', 'Posting age', 'Credit budget', 'Priority roles'];
 const intervention = ['Near threshold', 'Credit limit close', 'High-value role incomplete', 'Possible duplicate', 'User-marked priority'];

 return (
 <section className="flex max-w-[980px] flex-col gap-12 pt-8" data-case-nav-label="07 / Credit Decision">
 <header>
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 07 / Decision 1
 </p>
 <h2 className="m-0 mt-7 max-w-[880px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]" style={displayStyle}>
 The first decision was not “Can AI apply?” but “Is this opportunity worth a credit?”
 </h2>
 </header>

 <div className="grid gap-7 lg:grid-cols-[1fr_360px]">
 <section className="border border-[#cccccc] p-6" aria-label="User-defined opportunity rules">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 User-defined strategy
 </p>
 <div className="mt-6 flex flex-wrap gap-2">
 {rules.map((rule) => (
 <span key={rule} className="border border-[#cccccc] px-3 py-2 text-[12px] font-light text-[#0a0a0a]/68" style={bodyStyle}>
 {rule}
 </span>
 ))}
 </div>
 <p className="m-0 mt-6 text-[14px] font-light leading-[1.6] text-[#0a0a0a]/64" style={bodyStyle}>
 When a role clearly matched the strategy, the system could queue it, prioritize newer postings, avoid duplicates, and prevent low-match roles from wasting credits.
 </p>
 </section>

 <aside className="bg-[#10100f] p-6 text-white">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#aefd48]" style={bodyStyle}>
 Ask the user when
 </p>
 <div className="mt-5 flex flex-col">
 {intervention.map((item, index) => (
 <p key={item} className={`m-0 py-3 text-[13px] font-light leading-[1.45] text-white/78 ${index < intervention.length - 1 ? ' border-white/20' : ''}`} style={bodyStyle}>
 {item}
 </p>
 ))}
 </div>
 </aside>
 </div>
 </section>
 );
}

function ApplicationReadySection() {
 const states = [
 ['Ready to submit', 'Materials are complete, claims are grounded, and quality meets the configured threshold.'],
 ['Review recommended', 'The application can be submitted, but user review may materially improve quality.'],
 ['Decision required', 'Missing facts, conflicts, sensitive answers, or career judgment require the user.'],
 ];

 return (
 <section className="flex max-w-[980px] flex-col gap-12 pt-8" data-case-nav-label="08 / Application Quality">
 <header>
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 08 / Decision 2
 </p>
 <h2 className="m-0 mt-7 max-w-[820px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]" style={displayStyle}>
 Automation continued only when the application was both complete and credible.
 </h2>
 </header>

 <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr]">
 <figure className="m-0 overflow-hidden bg-[#f3f1ea] p-4">
 <Image src="/img/jobnova/decision-resume.png" alt="JobNova AI resume customization interface with visible changes and review controls." width={1121} height={1258} className="h-auto w-full" unoptimized />
 </figure>
 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc]">
 {states.map(([title, body]) => (
 <article key={title} className="bg-white p-6">
 <h3 className="m-0 text-[24px] font-normal leading-[1.08] text-[#0a0a0a]" style={displayStyle}>
 {title}
 </h3>
 <p className="m-0 mt-4 text-[13px] font-light leading-[1.6] text-[#0a0a0a]/64" style={bodyStyle}>
 {body}
 </p>
 </article>
 ))}
 </div>
 </div>
 </section>
 );
}

function SubmissionTimingSection() {
 const autoConditions = ['Role matches strategy', 'Credit is available', 'Materials are complete', 'Quality threshold met', 'No high-risk issue', 'Auto-submit is authorized'];
 const pauseConditions = ['High-value role needs confirmation', 'Information is missing', 'Answers conflict', 'Sensitive data needs approval', 'User requires review'];

 return (
 <section className="flex max-w-[980px] flex-col gap-12 pt-8" data-case-nav-label="09 / Submit Timing">
 <header>
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 09 / Decision 3
 </p>
 <h2 className="m-0 mt-7 max-w-[900px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]" style={displayStyle}>
 The system submitted early when confidence was high, and paused only when user judgment could change the outcome.
 </h2>
 </header>

 <div className="grid gap-7 lg:grid-cols-2">
 {[
 ['Auto-submit when', autoConditions, 'bg-[#10100f] text-white', 'text-[#aefd48]', 'border-white/20', 'text-white/78'],
 ['Pause when', pauseConditions, 'bg-white text-[#0a0a0a] border border-[#cccccc]', 'text-[#ed5b2b]', 'border-[#cccccc]', 'text-[#0a0a0a]/68'],
 ].map(([title, items, tone, labelTone, borderTone, textTone]) => (
 <section key={title as string} className={`p-6 ${tone as string}`}>
 <p className={`m-0 text-[11px] font-light uppercase tracking-[0.14em] ${labelTone as string}`} style={bodyStyle}>
 {title as string}
 </p>
 <div className={`mt-5 flex flex-col ${borderTone as string}`}>
 {(items as string[]).map((item, index) => (
 <p key={item} className={`m-0 py-3 text-[13px] font-light leading-[1.45] ${textTone as string} ${index < (items as string[]).length - 1 ? ` ${borderTone as string}` : ''}`} style={bodyStyle}>
 {item}
 </p>
 ))}
 </div>
 </section>
 ))}
 </div>

 <AutoApplyStateSwitcher />
 </section>
 );
}

function TraceabilitySection() {
 const records = ['Job description snapshot', 'Match score', 'Matching evidence', 'Resume version', 'Cover letter version', 'Screening answers', 'AI edits', 'Submission time', 'Credit used', 'Current status', 'Failure and retry history'];

 return (
 <section className="flex max-w-[980px] flex-col gap-12 pt-8" data-case-nav-label="10 / Traceability">
 <header>
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 10 / Traceability
 </p>
 <h2 className="m-0 mt-7 max-w-[860px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]" style={displayStyle}>
 Tracking was not only about status. It preserved the context users needed when an interview arrived.
 </h2>
 </header>

 <div className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr]">
 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] sm:grid-cols-2">
 {records.map((record) => (
 <p key={record} className="m-0 bg-white p-4 text-[12px] font-light leading-[1.45] text-[#0a0a0a]/68" style={bodyStyle}>
 {record}
 </p>
 ))}
 </div>
 <figure className="m-0 overflow-hidden bg-[#f3f1ea] p-4">
 <Image src="/img/jobnova/decision-tracking-detail.png" alt="JobNova application detail showing submitted materials, answers, timeline, and status history." width={1041} height={1094} className="h-auto w-full" unoptimized />
 </figure>
 </div>
 </section>
 );
}

function EndToEndApplicationSection() {
 const story = [
 ['Opportunity discovered', 'A new role appears shortly after posting with a strong match to the user’s target profile.'],
 ['Credit evaluated', 'The role fits strategy rules and the weekly credit budget still has room.'],
 ['Materials prepared', 'AI selects a resume version, drafts a cover letter, and fills known profile information.'],
 ['User intervention', 'Work authorization is incomplete, so the system pauses and asks the user to confirm.'],
 ['Submitted early', 'After confirmation, the application is submitted without waiting for a full manual review loop.'],
 ['Record created', 'The system saves the submitted resume, letter, answers, status, credit used, and retry history.'],
 ['Interview received', 'The user returns to the record to review what they emphasized and prepare for the conversation.'],
 ];

 return (
 <section className="flex max-w-[980px] flex-col gap-12 pt-8" data-case-nav-label="11 / End-to-End Story">
 <header>
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 11 / One End-to-End Application
 </p>
 <h2 className="m-0 mt-7 max-w-[840px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]" style={displayStyle}>
 One application story connected quantity, credit, quality, speed, intervention, and traceability.
 </h2>
 </header>

 <div className="">
 {story.map(([title, body], index) => (
 <article key={title} className={`grid gap-5 py-5 sm:grid-cols-[56px_240px_1fr] ${index < story.length - 1 ? '' : ''}`}>
 <p className="m-0 text-[12px] font-light text-[#ed5b2b]" style={bodyStyle}>
 {String(index + 1).padStart(2, '0')}
 </p>
 <h3 className="m-0 text-[20px] font-normal leading-[1.15] text-[#0a0a0a]" style={displayStyle}>
 {title}
 </h3>
 <p className="m-0 text-[13px] font-light leading-[1.6] text-[#0a0a0a]/66" style={bodyStyle}>
 {body}
 </p>
 </article>
 ))}
 </div>
 </section>
 );
}

function ValidationThroughputSection() {
 const validationRows = [
 ['Coverage', 'Auto Apply activation and high-match opportunity coverage', '19.39% enabled Auto Apply'],
 ['Credit efficiency', 'Effective applications and interviews per credit', 'Needs next-stage validation'],
 ['Speed', 'Match-to-application time and early submission window', '1.03 hrs average match-to-application time'],
 ['Quality', 'Interview invitation rate and performance by match/material version', '10.77% interview invitation rate'],
 ['Reliability', 'Submission success, failure, and retry recovery', '88.21% final application success rate'],
 ['Traceability', 'Application record revisits before interviews', 'Needs next-stage validation'],
 ];

 return (
 <section className="flex max-w-[980px] flex-col gap-12 pt-8" data-case-nav-label="12 / Validation">
 <header>
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 12 / Validation
 </p>
 <h2 className="m-0 mt-7 max-w-[820px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]" style={displayStyle}>
 Did Auto Apply improve valuable application throughput?
 </h2>
 </header>

 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-3">
 {validationRows.map(([label, metric, signal]) => (
 <article key={label} className="flex min-h-[210px] flex-col bg-white p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 {label}
 </p>
 <p className="m-0 mt-5 text-[14px] font-light leading-[1.55] text-[#0a0a0a]/62" style={bodyStyle}>
 {metric}
 </p>
 <p className="m-0 mt-auto pt-4 text-[15px] font-normal leading-[1.35] text-[#0a0a0a]" style={bodyStyle}>
 {signal}
 </p>
 </article>
 ))}
 </div>
 </section>
 );
}

function FinalAutoApplyModelSection() {
 const model = ['Evaluate opportunity', 'Allocate credit', 'Prepare materials', 'Check confidence', 'Submit early', 'Preserve the record'];
 const intervention = [
 'Opportunity value is uncertain',
 'Material authenticity or quality is uncertain',
 'Submission requires explicit commitment',
 ];

 return (
 <section className="flex max-w-[980px] flex-col gap-12 pt-8" data-case-nav-label="13 / Final Model">
 <header>
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 13 / Final System Model
 </p>
 <h2 className="m-0 mt-7 max-w-[860px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]" style={displayStyle}>
 One model connected opportunity value, credit, quality, speed, and traceability.
 </h2>
 </header>

 <section className="bg-[#10100f] p-6 text-white sm:p-8" aria-label="Final Auto Apply system model">
 <div className="grid gap-px overflow-hidden border border-white/20 bg-white/20 md:grid-cols-6">
 {model.map((step, index) => (
 <article key={step} className="relative flex min-h-[134px] flex-col bg-[#10100f] p-4">
 <p className="m-0 text-[10px] font-light text-[#aefd48]" style={bodyStyle}>
 {String(index + 1).padStart(2, '0')}
 </p>
 <p className="m-0 mt-auto text-[15px] font-light leading-[1.35] text-white/82" style={bodyStyle}>
 {step}
 </p>
 {index < model.length - 1 ? (
 <span className="absolute -right-[11px] top-1/2 z-10 hidden -translate-y-1/2 bg-[#10100f] px-1 text-[15px] font-light text-[#aefd48] md:block" aria-hidden>
 -&gt;
 </span>
 ) : null}
 </article>
 ))}
 </div>
 </section>

 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-3">
 {intervention.map((item, index) => (
 <article key={item} className="bg-white p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 User intervenes when {String(index + 1).padStart(2, '0')}
 </p>
 <p className="m-0 mt-5 text-[18px] font-normal leading-[1.35] text-[#0a0a0a]" style={bodyStyle}>
 {item}
 </p>
 </article>
 ))}
 </div>
 </section>
 );
}

function ConsolidatedWhyAutoApplySection() {
 const goals = [
 ['Coverage', 'Apply to more relevant roles while they are still fresh.'],
 ['Credit efficiency', 'Spend limited credits on opportunities likely to matter.'],
 ['Application quality', 'Keep resume claims, cover letters, and answers credible.'],
 ['Speed', 'Avoid turning every submission into a manual review queue.'],
 ['Traceability', 'Preserve what was submitted for follow-up and interview prep.'],
 ];

 return (
 <section className="flex max-w-[980px] flex-col gap-12 pt-8" data-case-nav-label="02 / Why Auto Apply">
 <header>
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 02 / Why Auto Apply
 </p>
 <h2 className="m-0 mt-7 max-w-[900px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]" style={displayStyle}>
 Auto Apply became the point where speed, volume, quality, credit, and traceability had to work together.
 </h2>
 <p className="m-0 mt-6 max-w-[720px] text-[17px] font-light leading-[1.6] text-[#0a0a0a]/66" style={bodyStyle}>
 Users cared about speed, but not raw automation. They wanted the system to move early on the right opportunities and pause only when their judgment could change the outcome.
 </p>
 </header>

 <div className="grid md:grid-cols-5">
 {goals.map(([title, body], index) => (
 <article key={title} className={`min-h-[214px] py-6 md:px-5 ${index < goals.length - 1 ? ' md:border-r' : ''} ${index === 0 ? 'md:pl-0' : ''}`}>
 <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
 {String(index + 1).padStart(2, '0')}
 </p>
 <h3 className="m-0 mt-7 text-[22px] font-normal leading-[1.08] text-[#0a0a0a]" style={displayStyle}>
 {title}
 </h3>
 <p className="m-0 mt-5 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/62" style={bodyStyle}>
 {body}
 </p>
 </article>
 ))}
 </div>

 <blockquote className="m-0 border-l border-[#ed5b2b] py-1 pl-5">
 <p className="m-0 max-w-[760px] text-[21px] font-normal leading-[1.35] text-[#0a0a0a]" style={bodyStyle}>
 Automation should continue only when doing so protected coverage, credit efficiency, quality, speed, and traceability.
 </p>
 </blockquote>
 </section>
 );
}

function DesignStrategyThreeDecisionsSection() {
 const decisions = [
 ['01', 'Is this opportunity worth applying to?', 'Opportunity value', ['Match', 'Role preferences', 'Posting age', 'Credit budget', 'Priority']],
 ['02', 'Is the application complete and credible?', 'Information confidence', ['Resume', 'Cover letter', 'Screening answers', 'Missing information', 'Conflicts']],
 ['03', 'Is the system allowed to submit now?', 'Submission commitment', ['Irreversible action', 'User confirmation', 'Sensitive information', 'High-value opportunity']],
 ];

 return (
 <section className="flex max-w-[980px] flex-col gap-12 pt-8" data-case-nav-label="03 / Design Strategy">
 <header>
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 03 / Design Strategy
 </p>
 <h2 className="m-0 mt-7 max-w-[820px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]" style={displayStyle}>
 We designed Auto Apply around three decisions.
 </h2>
 </header>

 <section className="grid gap-7 py-8 lg:grid-cols-[0.85fr_1.15fr]" aria-label="Auto Apply early model and redesigned model">
 <article className="border border-[#0a0a0a] p-6">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Early model
 </p>
 <div className="mt-8">
 <p className="m-0 text-center text-[10px] font-light uppercase tracking-[0.18em] text-[#ed5b2b]" style={bodyStyle}>
 Auto Apply
 </p>
 <div className="mt-8 flex items-center gap-4">
 <span className="text-[12px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/44" style={bodyStyle}>
 Off
 </span>
 <div className="relative h-px flex-1 bg-[#cccccc]">
 <span className="absolute left-0 top-1/2 size-4 -translate-y-1/2 rounded-full border border-[#0a0a0a] bg-white" />
 <span className="absolute right-0 top-1/2 size-4 -translate-y-1/2 rounded-full bg-[#0a0a0a]" />
 </div>
 <span className="text-[12px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]" style={bodyStyle}>
 On
 </span>
 </div>
 </div>
 <p className="m-0 mt-8 text-[16px] font-light leading-[1.6] text-[#0a0a0a]/66" style={bodyStyle}>
 One switch could not express which jobs deserved credits, which materials needed review, or which submissions required confirmation.
 </p>
 </article>

 <article className="bg-[#10100f] p-6 text-white">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#aefd48]" style={bodyStyle}>
 Redesigned model
 </p>
 <h3 className="m-0 mt-6 max-w-[620px] text-[clamp(28px,3.8vw,48px)] font-normal leading-[1.06] tracking-[-0.025em] text-white" style={displayStyle}>
 From “Is Auto Apply on?” to “Should the system continue at this decision point?”
 </h3>
 </article>
 </section>

 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] lg:grid-cols-3">
 {decisions.map(([number, title, label, items]) => (
 <article key={number as string} className="flex min-h-[320px] flex-col bg-white p-6">
 <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
 {number as string}
 </p>
 <h3 className="m-0 mt-7 text-[26px] font-normal leading-[1.05] text-[#0a0a0a]" style={displayStyle}>
 {title as string}
 </h3>
 <p className="m-0 mt-4 text-[11px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/38" style={bodyStyle}>
 {label as string}
 </p>
 <div className="mt-auto flex flex-wrap gap-2 pt-6">
 {(items as string[]).map((item) => (
 <span key={item} className="border border-[#cccccc] px-2.5 py-1.5 text-[11px] font-light text-[#0a0a0a]/62" style={bodyStyle}>
 {item}
 </span>
 ))}
 </div>
 </article>
 ))}
 </div>
 </section>
 );
}

function KeyInterfacesSection() {
 type InterfaceItem =
 | {
 visual: 'image';
 title: string;
 why: string;
 design: string;
 result: string;
 image: string;
 alt: string;
 }
 | {
 visual: 'states';
 title: string;
 why: string;
 design: string;
 result: string;
 };

 const interfaces: InterfaceItem[] = [
 {
 visual: 'image',
 title: 'Auto Apply Strategy',
 why: 'Users should not approve every role one by one, or automation loses its advantage.',
 design: 'The settings screen let users define what jobs to pursue, how credits were used, which materials AI could prepare, and what required confirmation.',
 result: 'Users controlled the strategy, not every repetitive action.',
 image: '/img/jobnova/decision-auto-apply-190-10788.png',
 alt: 'JobNova Auto Apply strategy settings with job criteria, autonomy level, materials, and preferences.',
 },
 {
 visual: 'states',
 title: 'Application Status States',
 why: 'Once Auto Apply started, users needed to know whether a role was waiting, running, submitted, or recoverable.',
 design: 'I exposed each job-level application state as a visible card pattern: pending approval, queued, in progress, submitted, and failed. Each state paired status, confidence, company context, and the next available action.',
 result: 'Automation no longer felt like a black box; users could see where each application stood and what needed their attention.',
 },
 {
 visual: 'image',
 title: 'Submission Status & Record',
 why: 'Automated submission still needed visibility, recovery, and memory after the action completed.',
 design: 'Queued, running, waiting, submitted, and failed states were connected to the saved resume, cover letter, answers, submission time, status, and retry history.',
 result: 'Every application stayed inspectable when follow-up or interview preparation started.',
 image: '/img/jobnova/decision-tracking-detail.png',
 alt: 'JobNova application record with submitted materials, status history, and application timeline.',
 },
 ];

 return (
 <section className="flex max-w-[980px] flex-col gap-12 pt-8" data-case-nav-label="04 / Key Interfaces">
 <header>
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 04 / Key Interfaces
 </p>
 <h2 className="m-0 mt-7 max-w-[820px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]" style={displayStyle}>
 How the strategy became product interactions.
 </h2>
 </header>

 <div className="flex flex-col gap-14">
 {interfaces.map((item, index) => (
 <article key={item.title} className="flex flex-col gap-7 py-8">
 <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
 <div>
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Interface {String(index + 1).padStart(2, '0')}
 </p>
 <h3 className="m-0 mt-4 max-w-[420px] text-[clamp(30px,4vw,52px)] font-normal leading-[1.04] tracking-[-0.03em] text-[#0a0a0a]" style={displayStyle}>
 {item.title}
 </h3>
 </div>
 <div className="grid gap-4 md:grid-cols-3">
 {[
 ['Why', item.why],
 ['Design', item.design],
 ['Result', item.result],
 ].map(([label, body]) => (
 <div key={label} className="border-l border-[#ed5b2b] pl-4">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 {label}
 </p>
 <p className="m-0 mt-2 text-[13px] font-light leading-[1.6] text-[#0a0a0a]/66" style={bodyStyle}>
 {body}
 </p>
 </div>
 ))}
 </div>
 </div>

 <figure className="m-0 w-full overflow-hidden bg-[#f3f1ea] p-4 sm:p-6">
 {item.visual === 'states' ? (
 <div className="bg-white p-4 sm:p-6">
 <AutoApplyStateSwitcher stateIds={['pending-approval', 'queued', 'progress', 'submitted', 'failed']} />
 </div>
 ) : (
 <Image src={item.image} alt={item.alt} width={1400} height={950} className="h-auto w-full" unoptimized />
 )}
 </figure>
 </article>
 ))}
 </div>
 </section>
 );
}

function ValidationReflectionSection() {
 const achievements = [
 ['Earlier access', '≤ 2 hrs', 'to ingest newly published roles'],
 ['Faster execution', '1.03 hrs', 'average match-to-application'],
 ['Reliable automation', '88.21%', 'final automated submission success'],
 ['Outcome quality', '10.77%', 'interview invitation rate'],
 ];
 const stillValidate = [
 'Average applications per active Auto Apply user',
 'Credit efficiency per valuable application',
 'Interview conversion by match and material version',
 'Record usage before interviews',
 ];
 const model = ['Evaluate opportunity', 'Prepare materials', 'Check confidence', 'Submit', 'Preserve the record'];

 return (
 <section className="flex max-w-[980px] flex-col gap-12 pt-8" data-case-nav-label="05 / Validation + Reflection">
 <header>
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 05 / Validation + Reflection
 </p>
 <h2 className="m-0 mt-7 max-w-[820px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]" style={displayStyle}>
 Did Auto Apply improve valuable application throughput?
 </h2>
 </header>

 <section className="bg-[#10100f] p-6 text-white sm:p-8" aria-labelledby="achievement-wall-title">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#aefd48]" style={bodyStyle}>
 Product outcomes
 </p>
 <h3 id="achievement-wall-title" className="m-0 mt-3 max-w-[720px] text-[clamp(30px,4.2vw,54px)] font-normal leading-[1.05] tracking-[-0.03em] text-white" style={displayStyle}>
 What JobNova achieved
 </h3>
 <div className="mt-8 grid gap-px overflow-hidden border border-white/20 bg-white/20 md:grid-cols-4">
 {achievements.map(([label, value, body]) => (
 <article key={label} className="flex min-h-[190px] flex-col bg-[#10100f] p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#aefd48]" style={bodyStyle}>
 {label}
 </p>
 <p className="m-0 mt-7 text-[38px] font-normal leading-none text-white" style={displayStyle}>
 {value}
 </p>
 <p className="m-0 mt-auto text-[12px] font-light leading-[1.45] text-white/62" style={bodyStyle}>
 {body}
 </p>
 </article>
 ))}
 </div>
 </section>

 <section className="grid gap-7 py-8 lg:grid-cols-[1fr_300px]" aria-label="Final model and validation gaps">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Final model
 </p>
 <h3 className="m-0 mt-4 max-w-[760px] text-[clamp(28px,4vw,52px)] font-normal leading-[1.06] tracking-[-0.03em] text-[#0a0a0a]" style={displayStyle}>
 {model.join(' → ')}
 </h3>
 <p className="m-0 mt-6 max-w-[700px] text-[14px] font-light leading-[1.6] text-[#0a0a0a]/64" style={bodyStyle}>
 The user intervened only when opportunity value was uncertain, information was incomplete, or submission needed explicit judgment.
 </p>
 </div>
 <aside className="border-l border-[#ed5b2b] pl-5">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Still to validate
 </p>
 <div className="mt-4 flex flex-col gap-3">
 {stillValidate.map((item) => (
 <p key={item} className="m-0 text-[12px] font-light leading-[1.45] text-[#0a0a0a]/64" style={bodyStyle}>
 {item}
 </p>
 ))}
 </div>
 </aside>
 </section>

 <blockquote className="m-0 pb-[clamp(42px,7vw,76px)]">
 <p className="m-0 max-w-[940px] text-[clamp(36px,5.8vw,76px)] font-normal leading-[1] tracking-[-0.04em] text-[#0a0a0a]" style={displayStyle}>
 The product succeeded when automation increased opportunity without increasing uncertainty.
 </p>
 <p className="m-0 mt-7 max-w-[940px] text-[clamp(29px,4.6vw,60px)] font-normal leading-[1.04] tracking-[-0.035em] text-[#ed5b2b]" style={displayStyle}>
 The goal was to help users discover relevant opportunities earlier, act on more of them, preserve application quality, and retain the context needed afterward.
 </p>
 <p className="m-0 mt-7 max-w-[720px] text-[16px] font-light leading-[1.6] text-[#0a0a0a]/62" style={bodyStyle}>
 User attention was reserved for decisions that could materially change credit usage, factual accuracy, or application outcome.
 </p>
 </blockquote>
 </section>
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
 <div key={label} className="flex min-h-[286px] flex-col border border-dashed border-[#bdbdbd] bg-[#f3f1ea] p-4">
 <div className="flex items-center justify-between">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 {label}
 </p>
 <span className="text-[10px] font-light text-[#0a0a0a]/38" style={bodyStyle}>
 Placeholder
 </span>
 </div>
 <div className="my-5 flex flex-1 flex-col gap-2 border border-[#cccccc] bg-white p-3" aria-hidden>
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

function MatchingDesignDecisionSectionV2() {
 const tests = [
 ['Score', 'Did users notice it?'],
 ['Evidence', 'Which signals changed their decision?'],
 ['Gaps', 'Could users find missing requirements?'],
 ['Uncertainty', 'Could users tell when AI was unsure?'],
 ] as const;
 const iterations = [
 { version: 'V1', title: 'One score', label: 'Fast to scan', issue: 'No reasoning' },
 { version: 'V2', title: 'Category scores', label: 'More detail', issue: 'No source context' },
 { version: 'V3', title: 'Evidence + gaps', label: 'Decision support', issue: 'Actionable explanation' },
 ] as const;
 const rules = [
 ['Score is an entry', 'Use the score for scanning, not final judgment.'],
 ['Show both sides', 'Present matches and gaps together.'],
 ['Explain in context', 'Place evidence beside the application decision.'],
 ['Let users correct AI', 'Allow users to update or challenge the judgment.'],
 ] as const;

 return (
 <section className="flex w-full flex-col gap-14 md:gap-20" data-case-nav-label="06 / Design Decision 01" aria-labelledby="matching-v2-title">
 <header className="pb-[clamp(48px,7vw,84px)]">
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>06 / Design Decision 01</p>
 <h3 id="matching-v2-title" className="m-0 mt-7 max-w-[900px] text-[clamp(42px,6.3vw,84px)] font-normal leading-[0.96] tracking-[-0.045em] text-[#0a0a0a]" style={displayStyle}>
 Turn job matching from prediction into <span className="text-[#ed5b2b]">explanation.</span>
 </h3>
 <p className="m-0 mt-8 max-w-[820px] text-[clamp(16px,2vw,22px)] font-light leading-[1.55] text-[#0a0a0a]/65" style={bodyStyle}>
 A match score could rank jobs—but it could not help users decide whether to apply.
 </p>
 </header>

 <section aria-labelledby="initial-match-title">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>Initial experience</p>
 <h4 id="initial-match-title" className="sr-only">An unexplained 83 percent match score</h4>
 <div className="mt-6 grid min-h-[430px] place-items-center border border-[#cccccc] bg-[#f3f1ea] p-6 sm:p-10">
 <div className="grid w-full max-w-[780px] gap-6 sm:grid-cols-[1fr_230px_1fr] sm:items-center">
 <div className="flex flex-col gap-4 text-left sm:text-right">
 <p className="m-0 text-[14px] font-normal text-[#0a0a0a]/56" style={bodyStyle}>Why 83%?</p>
 <p className="m-0 text-[14px] font-normal text-[#0a0a0a]/56" style={bodyStyle}>What matched?</p>
 </div>
 <div className="flex aspect-square flex-col items-center justify-center rounded-full border border-[#0a0a0a] bg-white shadow-[0_0_0_12px_rgba(237,91,43,0.08)]">
 <p className="m-0 text-[clamp(54px,8vw,88px)] font-normal leading-none text-[#0a0a0a]" style={displayStyle}>83%</p>
 <p className="m-0 mt-3 text-[10px] font-light uppercase tracking-[0.18em] text-[#ed5b2b]" style={bodyStyle}>Match</p>
 </div>
 <div className="flex flex-col gap-4">
 <p className="m-0 text-[14px] font-normal text-[#0a0a0a]/56" style={bodyStyle}>What is missing?</p>
 <p className="m-0 text-[14px] font-normal text-[#0a0a0a]/56" style={bodyStyle}>Should I apply?</p>
 </div>
 </div>
 </div>
 </section>

 <section aria-labelledby="trust-gap-v2-title">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>Trust gap</p>
 <h4 id="trust-gap-v2-title" className="m-0 mt-3 max-w-[700px] text-[clamp(28px,3.7vw,48px)] font-normal leading-[1.08] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>A prediction created new verification work.</h4>
 <div className="mt-7 grid md:grid-cols-4">
 {['Match score', 'Unclear reasoning', 'Manual verification', 'Lower trust'].map((step, index) => (
 <div key={step} className={`relative flex min-h-[105px] items-center gap-4 py-5 md:px-5 ${index < 3 ? ' md:border-r' : ''} ${index === 0 ? 'md:pl-0' : ''}`}>
 <span className="text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>{String(index + 1).padStart(2, '0')}</span>
 <p className={`m-0 text-[14px] font-normal ${index === 3 ? 'text-[#ed5b2b]' : 'text-[#0a0a0a]'}`} style={bodyStyle}>{step}</p>
 {index < 3 ? <span className="ml-auto text-[#ed5b2b] md:absolute md:-right-[9px] md:top-1/2 md:z-10 md:-translate-y-1/2 md:bg-white md:px-1" aria-hidden>→</span> : null}
 </div>
 ))}
 </div>
 <p className="m-0 mt-6 border-l border-[#ed5b2b] pl-5 text-[16px] font-normal leading-[1.55] text-[#0a0a0a]" style={bodyStyle}>
 A score created confidence only when users could inspect the evidence behind it.
 </p>
 </section>

 <section aria-labelledby="matching-tests-title">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>What we tested</p>
 <h4 id="matching-tests-title" className="sr-only">Four questions tested in matching concepts</h4>
 <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4">
 {tests.map(([label, question], index) => (
 <article key={label} className={`min-h-[180px] py-6 sm:px-6 ${index < 3 ? ' sm:border-r' : ''} ${index === 1 ? 'sm:border-r-0 lg:border-r' : ''} ${index >= 2 ? '' : ''} ${index === 0 ? 'sm:pl-0' : ''}`}>
 <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>{String(index + 1).padStart(2, '0')}</p>
 <h5 className="m-0 mt-7 text-[18px] font-normal text-[#0a0a0a]" style={displayStyle}>{label}</h5>
 <p className="m-0 mt-3 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/56" style={bodyStyle}>{question}</p>
 </article>
 ))}
 </div>
 </section>

 <section className="pt-10" aria-labelledby="score-to-evidence-title">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>From score to evidence</p>
 <h4 id="score-to-evidence-title" className="m-0 mt-3 max-w-[760px] text-[clamp(30px,4vw,52px)] font-normal leading-[1.06] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>Three iterations moved the answer closer to the decision.</h4>
 <div className="mt-8 grid md:grid-cols-3">
 {iterations.map((iteration, index) => (
 <article key={iteration.version} className={`flex min-h-[330px] flex-col py-7 md:px-7 ${index < 2 ? ' md:border-r' : ''} ${index === 0 ? 'md:pl-0' : ''} ${index === 2 ? 'bg-[#fff0e8]' : ''}`}>
 <div className="flex items-center justify-between">
 <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>{iteration.version}</p>
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.1em] text-[#0a0a0a]/35" style={bodyStyle}>{iteration.label}</p>
 </div>
 {index === 0 ? <p className="m-0 mt-10 text-[54px] font-normal leading-none text-[#0a0a0a]" style={displayStyle}>83%</p> : null}
 {index === 1 ? <div className="mt-10 space-y-3">{[['Skills', '90%'], ['Experience', '75%'], ['Education', '80%']].map(([name, value]) => <div key={name} className="flex justify-between pb-2 text-[11px] font-light text-[#0a0a0a]/58" style={bodyStyle}><span>{name}</span><span>{value}</span></div>)}</div> : null}
 {index === 2 ? <div className="mt-10 grid grid-cols-3 gap-2 text-[9px] font-light uppercase tracking-[0.08em]" style={bodyStyle}><span className="text-[#65a900]">✓ Matched</span><span className="text-[#ed5b2b]">! Gaps</span><span className="text-[#0a0a0a]/45">? Uncertain</span></div> : null}
 <h5 className="m-0 mt-auto text-[22px] font-normal text-[#0a0a0a]" style={displayStyle}>{iteration.title}</h5>
 <p className={`m-0 mt-3 text-[11px] font-light ${index === 2 ? 'text-[#ed5b2b]' : 'text-[#0a0a0a]/48'}`} style={bodyStyle}>{iteration.issue}</p>
 </article>
 ))}
 </div>
 </section>

 <section aria-labelledby="final-match-model-title">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>Final match explanation</p>
 <h4 id="final-match-model-title" className="m-0 mt-3 max-w-[760px] text-[clamp(30px,4vw,52px)] font-normal leading-[1.06] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>Every judgment links back to evidence.</h4>
 <div className="mt-7 grid border border-[#cccccc] lg:grid-cols-2">
 <article className="p-6 lg:border-r lg:border-[#cccccc] lg:p-8">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#65a900]" style={bodyStyle}>Matched evidence</p>
 <div className="mt-7 space-y-6">
 {[['5 years of product design', 'Resume: Senior Product Designer, 2019–2025'], ['Design systems', 'Resume: Built and maintained a component library'], ['Figma', 'Resume: Listed in core tools']].map(([item, source]) => <div key={item}><p className="m-0 text-[14px] font-normal text-[#0a0a0a]" style={bodyStyle}>✓ {item}</p><p className="m-0 mt-2 border-l border-[#65a900]/40 pl-3 text-[10px] font-light text-[#0a0a0a]/45" style={bodyStyle}>{source}</p></div>)}
 </div>
 </article>
 <article className="bg-[#fff0e8] p-6 lg:p-8">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>Gaps & uncertainty</p>
 <div className="mt-7 space-y-6">
 {[['! B2B SaaS experience', 'No direct evidence found'], ['! Salary range', 'Below your preferred range'], ['? Work authorization', 'Not stated in the job description']].map(([item, source]) => <div key={item}><p className="m-0 text-[14px] font-normal text-[#0a0a0a]" style={bodyStyle}>{item}</p><p className="m-0 mt-2 border-l border-[#ed5b2b]/40 pl-3 text-[10px] font-light text-[#0a0a0a]/45" style={bodyStyle}>{source}</p></div>)}
 </div>
 </article>
 </div>
 <div className="mt-6 overflow-hidden bg-[#f3f1ea] p-4 sm:p-6">
 <Image src="/img/jobnova/decision-match-detail.png" alt="JobNova job detail showing match evidence, skill gaps, and job requirements." width={1127} height={949} className="h-auto w-full" />
 </div>
 </section>

 <section aria-labelledby="matching-rules-v2-title">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>Design rules</p>
 <h4 id="matching-rules-v2-title" className="sr-only">Four rules for explainable matching</h4>
 <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4">
 {rules.map(([title, body], index) => (
 <article key={title} className={`min-h-[205px] py-6 sm:px-6 ${index < 3 ? ' sm:border-r' : ''} ${index === 1 ? 'sm:border-r-0 lg:border-r' : ''} ${index >= 2 ? '' : ''} ${index === 0 ? 'sm:pl-0' : ''}`}>
 <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>{String(index + 1).padStart(2, '0')}</p>
 <h5 className="m-0 mt-7 text-[18px] font-normal leading-[1.2] text-[#0a0a0a]" style={displayStyle}>{title}</h5>
 <p className="m-0 mt-3 text-[11px] font-light leading-[1.55] text-[#0a0a0a]/52" style={bodyStyle}>{body}</p>
 </article>
 ))}
 </div>
 </section>

 <section className="grid gap-8 py-[clamp(36px,5vw,60px)] lg:grid-cols-[220px_1fr] lg:items-center" aria-labelledby="matching-result-v2-title">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>Available result</p>
 <p className="m-0 mt-4 text-[clamp(54px,7vw,82px)] font-normal leading-none text-[#0a0a0a]" style={displayStyle}>68%</p>
 <p className="m-0 mt-3 text-[12px] font-light leading-[1.45] text-[#0a0a0a]/48" style={bodyStyle}>completed their first job match</p>
 </div>
 <div>
 <h4 id="matching-result-v2-title" className="m-0 text-[clamp(26px,3.5vw,44px)] font-normal leading-[1.08] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>Understanding must improve before recommendation acceptance can mean trust.</h4>
 <p className="m-0 mt-5 text-[12px] font-light leading-[1.6] text-[#0a0a0a]/52" style={bodyStyle}>The next validation focused on explanation comprehension, missing-requirement discovery, and decision time.</p>
 </div>
 </section>
 </section>
 );
}

// Retained as a reference while the V2 narrative is being completed section by section.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
 <div className="flex flex-col gap-12 pt-8">
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

 <div className="grid gap-8 py-8 lg:grid-cols-2">
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
 className={`flex gap-4 py-4 ${index < 2 ? ' border-[#e1e1e1]' : ''}`}
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
 <p className="m-0 mt-7 text-[21px] font-normal leading-[1.35] text-[#0a0a0a]" style={displayStyle}>
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

 <div className="overflow-hidden border border-[#cccccc]">
 <div className="grid grid-cols-2 bg-[#f3f1ea] px-5 py-3 text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/42" style={bodyStyle}>
 <p className="m-0">Before</p>
 <p className="m-0">After</p>
 </div>
 {decisionComparison.map(([before, after], index) => (
 <div
 key={before}
 className={`grid grid-cols-2 gap-5 px-5 py-5 ${
 index < decisionComparison.length - 1 ? '' : ''
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

 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-3">
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
 <h4 id="matching-principles-title" className="m-0 mt-2 text-[20px] font-normal text-[#0a0a0a]" style={bodyStyle}>
 Three principles translated explainability into interaction rules.
 </h4>
 </div>
 <div className="grid md:grid-cols-3">
 {matchingPrinciples.map((principle, index) => (
 <article
 key={principle.title}
 className={`min-h-[190px] py-6 md:px-6 ${
 index < matchingPrinciples.length - 1 ? ' md:border-r' : ''
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

 <div className="flex flex-col gap-10 pt-10">
 <header>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 5. Translating the Decision into the Experience
 </p>
 <h4 className="m-0 mt-3 max-w-[760px] text-[clamp(30px,4vw,52px)] font-normal leading-[1.06] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>
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
 <div className="overflow-hidden bg-[#f3f1ea] p-4 sm:p-6">
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
 <div className="overflow-hidden bg-[#f3f1ea] p-4 sm:p-6">
 <Image
 src="/img/jobnova/decision-match-detail.png"
 alt="JobNova job detail experience explaining fit, skills, role requirements, and resume suggestions."
 width={1127}
 height={949}
 className="h-auto w-full"
 />
 </div>
 </figure>

 <section className="grid gap-7 py-8 lg:grid-cols-[0.8fr_1.2fr]" aria-labelledby="skill-gap-title">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 C. Skill Gap
 </p>
 <h4 id="skill-gap-title" className="m-0 mt-3 text-[26px] font-normal leading-[1.15] text-[#0a0a0a]" style={displayStyle}>
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
 <article key={label as string} className={`p-5 ${index === 0 ? 'bg-[#aefd48]/12' : 'border border-[#ed5b2b]/40 bg-[#ed5b2b]/[0.04]'}`}>
 <p className="m-0 text-[12px] font-normal text-[#0a0a0a]" style={bodyStyle}>
 {label as string}
 </p>
 <div className="mt-5 flex flex-col gap-3">
 {(items as string[]).map((item) => (
 <div key={item} className="flex items-center gap-3">
 <span className={`size-1.5 rounded-full ${index === 0 ? 'bg-[#65a900]' : 'bg-[#ed5b2b]'}`} aria-hidden />
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
 <h4 id="matching-outcome-title" className="m-0 mt-2 text-[20px] font-normal text-[#0a0a0a]" style={bodyStyle}>
 Feature-level signals, not whole-product metrics
 </h4>
 <div className="mt-5 flex flex-wrap gap-2">
 {feature.validation.map((metric) => (
 <span
 key={metric}
 className="border border-[#cccccc] px-3 py-2 text-[11px] font-light leading-[17px] text-[#0a0a0a]/68"
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

 <blockquote className="m-0 py-9">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 7. Key Takeaway
 </p>
 <p className="m-0 mt-5 max-w-[900px] text-[clamp(24px,3.5vw,46px)] font-normal leading-[1.12] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>
 Helping users understand a recommendation was ultimately more valuable than making the recommendation appear more intelligent.
 </p>
 </blockquote>
 </div>
 </section>
 );
}

function ResumeDesignDecisionSection() {
 const feature = featureSections[1];
 const authorshipQuestions = ['What changed?', 'Why was it changed?', 'Was new information added?', 'Can I restore the original?'];
 const testCards = [
 ['Scope', 'How much could AI change?'],
 ['Visibility', 'Could users identify every edit?'],
 ['Control', 'Did users prefer line-by-line or bulk approval?'],
 ['Voice', 'Did the final version still feel like them?'],
 ];
 const iterationCards = [
 {
 label: 'V1',
 title: 'Full rewrite',
 model: 'Original -> AI version',
 strength: 'Fast',
 weakness: 'No visibility or ownership',
 },
 {
 label: 'V2',
 title: 'Visible changes',
 model: 'Original <-> Suggested',
 strength: 'Transparent',
 weakness: 'No editing boundary',
 },
 {
 label: 'V3',
 title: 'Permission before editing',
 model: 'Scope -> Generate -> Review -> Approve',
 strength: 'Controlled',
 weakness: 'Collaborative by design',
 },
 ];
 const scopeRules = [
 ['check', 'Grammar & clarity'],
 ['check', 'Existing achievements'],
 ['check', 'Job-specific keywords'],
 ['circle', 'Content order'],
 ['x', 'New facts'],
 ];
 const reviewRows = [
 {
 label: 'Original',
 tone: 'text-[#0a0a0a]/48',
 body: 'Led redesign of the onboarding flow.',
 },
 {
 label: 'Suggested',
 tone: 'text-[#0a0a0a]',
 body: 'Led the redesign of a B2B onboarding flow, improving activation by 18%.',
 },
 {
 label: 'Why',
 tone: 'text-[#ed5b2b]',
 body: 'Adds job-relevant context and quantifies impact. Facts must come from user-provided evidence.',
 },
 ];
 const decisionActions = ['Accept', 'Reject', 'Edit', 'Restore'];
 const designRules = [
 {
 label: '01',
 title: 'Permission first',
 body: 'Define the editing scope before generation.',
 },
 {
 label: '02',
 title: 'Visible differences',
 body: 'Show exactly what changed and why.',
 },
 {
 label: '03',
 title: 'Reversible edits',
 body: 'Every suggestion can be rejected or restored.',
 },
 {
 label: '04',
 title: 'Final user approval',
 body: 'No meaningful change is applied without approval.',
 },
 ];

 return (
 <section
 className="flex w-full flex-col gap-11 pt-8"
 data-case-nav-label="02 / AI Resume Customization"
 aria-labelledby="resume-decision-title"
 >
 <header className="grid gap-7 lg:grid-cols-[180px_1fr]">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 07 / Design Decision 02
 </p>
 <p className="m-0 mt-3 text-[11px] font-light text-[#0a0a0a]/38" style={bodyStyle}>
 AI Resume Customization
 </p>
 </div>
 <div>
 <h3
 id="resume-decision-title"
 className="m-0 max-w-[760px] text-[clamp(36px,5vw,64px)] font-normal leading-[0.99] tracking-[-0.035em] text-[#0a0a0a]"
 style={displayStyle}
 >
 Design AI as a writing partner, not the final author.
 </h3>
 <p className="m-0 mt-5 max-w-[720px] text-[17px] font-light leading-[1.5] text-[#0a0a0a]/62" style={bodyStyle}>
 AI could improve the resume, but users needed to see, control, and approve every meaningful change.
 </p>
 </div>
 </header>

 <section className="grid gap-8 py-8 lg:grid-cols-[1.08fr_0.92fr]" aria-label="Initial AI resume rewrite experience">
 <article className="flex flex-col gap-6">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 1. Initial Experience
 </p>
 <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
 <div className="border border-[#cccccc] bg-[#f3f1ea] p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/42" style={bodyStyle}>
 Original resume
 </p>
 <p className="m-0 mt-5 text-[17px] font-normal leading-[1.35] text-[#0a0a0a]" style={displayStyle}>
 Led redesign of the onboarding flow.
 </p>
 </div>
 <div
 className="flex min-h-[108px] items-center justify-center border border-[#0a0a0a] bg-[#0a0a0a] px-5 text-center text-[10px] font-light uppercase tracking-[0.16em] text-white md:min-h-[150px]"
 style={bodyStyle}
 >
 AI rewrite
 </div>
 <div className="border border-[#cccccc] p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/42" style={bodyStyle}>
 Optimized resume
 </p>
 <p className="m-0 mt-5 text-[17px] font-normal leading-[1.35] text-[#0a0a0a]" style={displayStyle}>
 Rewritten content presented as a finished version.
 </p>
 </div>
 </div>
 <div className="flex flex-wrap gap-2">
 {authorshipQuestions.map((question) => (
 <span
 key={question}
 className="border border-[#cccccc] px-3 py-2 text-[12px] font-light text-[#0a0a0a]/64"
 style={bodyStyle}
 >
 {question}
 </span>
 ))}
 </div>
 <div className="grid grid-cols-2 gap-3">
 {['Accept all', 'Discard all'].map((action) => (
 <div key={action} className="border border-[#0a0a0a] px-4 py-3 text-center text-[12px] font-light text-[#0a0a0a]" style={bodyStyle}>
 {action}
 </div>
 ))}
 </div>
 </article>

 <article className="flex flex-col justify-between gap-7 lg:border-l lg:border-[#cccccc] lg:pl-8">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 2. Authorship Gap
 </p>
 <div className="mt-5 grid gap-3">
 {['Full rewrite', 'Invisible changes', 'Manual comparison', 'Lower confidence'].map((step, index) => (
 <div key={step} className="flex items-center gap-3">
 <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#cccccc] text-[11px] font-light text-[#0a0a0a]/54" style={bodyStyle}>
 {index + 1}
 </span>
 <p className="m-0 text-[15px] font-light text-[#0a0a0a]/70" style={bodyStyle}>
 {step}
 </p>
 </div>
 ))}
 </div>
 <div className="mt-7 border-l border-[#ed5b2b] pl-5">
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 Risk branch
 </p>
 <p className="m-0 mt-3 text-[21px] font-normal leading-[1.28] text-[#0a0a0a]" style={displayStyle}>
 Changed meaning created professional and integrity risk.
 </p>
 </div>
 </div>
 <p className="m-0 pt-5 text-[18px] font-normal leading-[1.45] text-[#0a0a0a]" style={bodyStyle}>
 Faster writing did not mean safer decision-making.
 </p>
 </article>
 </section>

 <section className="grid gap-4 md:grid-cols-4" aria-label="Resume authorship tests">
 {testCards.map(([title, body]) => (
 <article key={title} className="min-h-[156px] border border-[#cccccc] p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 {title}
 </p>
 <p className="m-0 mt-6 text-[18px] font-normal leading-[1.28] text-[#0a0a0a]" style={displayStyle}>
 {body}
 </p>
 </article>
 ))}
 </section>

 <section className="flex flex-col gap-6 py-8" aria-labelledby="resume-iteration-title">
 <div className="max-w-[820px]">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 3. From Rewrite to Collaboration
 </p>
 <h4
 id="resume-iteration-title"
 className="m-0 mt-3 text-[clamp(30px,4vw,50px)] font-normal leading-[1.08] tracking-[-0.025em] text-[#0a0a0a]"
 style={displayStyle}
 >
 The model changed from replacing content to negotiating changes.
 </h4>
 </div>

 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] lg:grid-cols-3">
 {iterationCards.map((iteration) => (
 <article key={iteration.label} className="flex min-h-[260px] flex-col bg-white p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 {iteration.label}
 </p>
 <h5 className="m-0 mt-5 text-[22px] font-normal leading-[1.12] text-[#0a0a0a]" style={displayStyle}>
 {iteration.title}
 </h5>
 <p className="m-0 mt-5 border border-[#cccccc] bg-[#f3f1ea] px-4 py-3 text-[12px] font-light text-[#0a0a0a]/64" style={bodyStyle}>
 {iteration.model}
 </p>
 <dl className="m-0 mt-auto grid gap-3 pt-6">
 <div>
 <dt className="text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/38" style={bodyStyle}>
 Worked because
 </dt>
 <dd className="m-0 mt-1 text-[13px] font-normal text-[#0a0a0a]" style={bodyStyle}>
 {iteration.strength}
 </dd>
 </div>
 <div>
 <dt className="text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/38" style={bodyStyle}>
 Still failed because
 </dt>
 <dd className="m-0 mt-1 text-[13px] font-light text-[#0a0a0a]/62" style={bodyStyle}>
 {iteration.weakness}
 </dd>
 </div>
 </dl>
 </article>
 ))}
 </div>
 </section>

 <section className="flex flex-col gap-7" aria-labelledby="resume-final-model-title">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 4. Final Editing Model
 </p>
 <h4 id="resume-final-model-title" className="m-0 mt-2 text-[22px] font-normal text-[#0a0a0a]" style={bodyStyle}>
 Define scope, review changes, then decide line by line.
 </h4>
 </div>

 <div className="grid gap-5 lg:grid-cols-[0.8fr_1fr_0.8fr]">
 <article className="border border-[#cccccc] p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 Step 1 / Define scope
 </p>
 <p className="m-0 mt-5 text-[19px] font-normal leading-[1.25] text-[#0a0a0a]" style={displayStyle}>
 What can AI change?
 </p>
 <div className="mt-5 grid gap-2">
 {scopeRules.map(([state, label]) => (
 <div key={label} className="flex items-center gap-3 border border-[#e1ded6] px-3 py-2">
 <span
 className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-normal ${
 state === 'check'
 ? 'bg-[#0a0a0a] text-white'
 : state === 'x'
 ? 'border border-[#ed5b2b] text-[#ed5b2b]'
 : 'border border-[#cccccc] text-[#0a0a0a]/40'
 }`}
 style={bodyStyle}
 >
 {state === 'check' ? '✓' : state === 'x' ? '×' : ''}
 </span>
 <p className="m-0 text-[12px] font-light text-[#0a0a0a]/66" style={bodyStyle}>
 {label}
 </p>
 </div>
 ))}
 </div>
 <p className="m-0 mt-5 border-l border-[#ed5b2b] pl-4 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/66" style={bodyStyle}>
 Facts, numbers, and responsibilities always require confirmation.
 </p>
 </article>

 <article className="border border-[#0a0a0a] p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 Step 2 / Review changes
 </p>
 <div className="mt-5 grid gap-4">
 {reviewRows.map((row) => (
 <div key={row.label} className="pb-4 last:pb-0">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/38" style={bodyStyle}>
 {row.label}
 </p>
 <p className={`m-0 mt-2 text-[15px] font-normal leading-[1.45] ${row.tone}`} style={bodyStyle}>
 {row.body}
 </p>
 </div>
 ))}
 </div>
 <div className="mt-5 flex flex-wrap gap-2">
 {['Original', 'Added', 'Removed', 'Rewritten'].map((marker) => (
 <span
 key={marker}
 className={`px-2.5 py-1.5 text-[10px] font-light ${
 marker === 'Added'
 ? 'bg-[#dff1df] text-[#1f6b39]'
 : marker === 'Removed'
 ? 'bg-[#f5dddd] text-[#9c2f24]'
 : marker === 'Rewritten'
 ? 'bg-[#fde5d4] text-[#b24a20]'
 : 'bg-[#f3f1ea] text-[#0a0a0a]/52'
 }`}
 style={bodyStyle}
 >
 {marker}
 </span>
 ))}
 </div>
 </article>

 <article className="border border-[#cccccc] p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 Step 3 / Decide
 </p>
 <p className="m-0 mt-5 text-[19px] font-normal leading-[1.25] text-[#0a0a0a]" style={displayStyle}>
 Every suggestion stays reversible until the user approves it.
 </p>
 <div className="mt-6 grid grid-cols-2 gap-2">
 {decisionActions.map((action) => (
 <div key={action} className="border border-[#cccccc] px-3 py-3 text-center text-[12px] font-light text-[#0a0a0a]/66" style={bodyStyle}>
 {action}
 </div>
 ))}
 </div>
 <p className="m-0 mt-6 pt-5 text-[24px] font-normal leading-[1.1] tracking-[-0.015em] text-[#0a0a0a]" style={displayStyle}>
 AI proposes. The user decides.
 </p>
 </article>
 </div>
 </section>

 <section className="grid md:grid-cols-4" aria-label="Resume customization design rules">
 {designRules.map((rule, index) => (
 <article
 key={rule.title}
 className={`min-h-[178px] py-5 md:px-5 ${
 index < designRules.length - 1 ? ' md:border-r' : ''
 } ${index === 0 ? 'md:pl-0' : ''}`}
 >
 <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
 {rule.label}
 </p>
 <h5 className="m-0 mt-5 text-[17px] font-normal leading-[1.3] text-[#0a0a0a]" style={displayStyle}>
 {rule.title}
 </h5>
 <p className="m-0 mt-2 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/62" style={bodyStyle}>
 {rule.body}
 </p>
 </article>
 ))}
 </section>

 <section className="grid gap-7 pt-7 lg:grid-cols-[1fr_280px]" aria-labelledby="resume-outcome-title">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 6. Validation
 </p>
 <h4 id="resume-outcome-title" className="m-0 mt-2 text-[19px] font-normal text-[#0a0a0a]" style={bodyStyle}>
 Adoption was measured. Control and identity remained validation targets.
 </h4>
 <div className="mt-5 grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-3">
 {[
 ['Adoption', '54%', 'of registered users used AI resume customization'],
 ['Control', 'TBD', 'edited or rejected suggestions'],
 ['Identity', 'TBD', 'agreed: “This still feels like me”'],
 ].map(([label, value, body]) => (
 <article key={label} className="bg-white p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.1em] text-[#ed5b2b]" style={bodyStyle}>
 {label}
 </p>
 <p className="m-0 mt-4 text-[34px] font-normal leading-none tracking-[-0.02em] text-[#0a0a0a]" style={displayStyle}>
 {value}
 </p>
 <p className="m-0 mt-3 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/62" style={bodyStyle}>
 {body}
 </p>
 </article>
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

 <blockquote className="m-0 py-8">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 7. Key Takeaway
 </p>
 <p className="m-0 mt-4 max-w-[900px] text-[clamp(22px,3vw,38px)] font-normal leading-[1.16] tracking-[-0.02em] text-[#0a0a0a]" style={displayStyle}>
 Trust increased when users could inspect and control the edits, not when AI changed more.
 </p>
 </blockquote>
 </section>
 );
}

function AutoApplyDesignDecisionSectionV2() {
 const feature = featureSections[2];
 const riskActions = [
 ['Recommend', 'AUTO', 'Low risk'],
 ['Draft', 'AUTO', 'Review later'],
 ['Fill profile', 'REVIEW', 'Permission-based'],
 ['Answer', 'REVIEW', 'Review first'],
 ['Submit', 'CONFIRM', 'Explicit approval'],
 ];
 const riskFactors = ['Error cost', 'Reversibility', 'Professional impact'];
 const matrixItems = [
 { label: 'Recommend jobs', x: '15%', y: '73%', level: 'AUTO' },
 { label: 'Generate drafts', x: '34%', y: '78%', level: 'AUTO' },
 { label: 'Retry failed action', x: '72%', y: '71%', level: 'REVIEW' },
 { label: 'Edit facts', x: '25%', y: '28%', level: 'CONFIRM' },
 { label: 'Answer questions', x: '35%', y: '40%', level: 'REVIEW' },
 { label: 'Use sensitive data', x: '73%', y: '29%', level: 'CONFIRM' },
 { label: 'Submit application', x: '80%', y: '18%', level: 'CONFIRM' },
 ];
 const permissionLevels = [
 ['01 / Auto', 'AI acts', 'Recommend jobs, generate drafts, and fill previously approved basic information.'],
 ['02 / Review', 'AI prepares', 'Resume changes, screening answers, preference conflicts, and uncertain job information.'],
 ['03 / Confirm', 'User authorizes', 'Submit application, change facts, use sensitive data, or retry a possible duplicate.'],
 ];
 const autonomySettings = [
 ['What jobs?', 'Role · Location · Salary · Match threshold'],
 ['What materials?', 'Resume version · Cover letter · Portfolio'],
 ['What questions?', 'Basic · Screening · Sensitive'],
 ['What requires approval?', 'Fact changes · Uncertainty · Submission'],
 ['When should AI stop?', 'Conflict · Missing data · Failure'],
 ];
 const applicationFlow = [
 ['01', 'Qualify', 'Job meets role, location, salary, and match threshold rules.', 'AUTO'],
 ['02', 'Prepare', 'AI prepares materials without changing facts.', 'REVIEW'],
 ['03', 'Authorize', 'User reviews the application checkpoint before submission.', 'CONFIRM'],
 ['04', 'Record', 'Materials, answers, status, time, and recovery path are saved.', 'AUTO'],
 ];
 const permissionCheckpoint = [
 ['✓', 'Job meets preferences'],
 ['✓', 'Resume version selected'],
 ['!', 'Work authorization unclear'],
 ['!', 'Salary answer requires confirmation'],
 ];
 const designRules = [
 ['Permission by action', 'Different actions get different permissions instead of one global switch.'],
 ['Pause on uncertainty', 'Missing or conflicting information stops the flow before AI continues.'],
 ['Confirm irreversible steps', 'Submission, sensitive data, and factual changes require confirmation.'],
 ['Record every outcome', 'Each run keeps status, materials, answers, and a recovery path.'],
 ];

 return (
 <section
 className="flex w-full flex-col gap-14 pt-8"
 data-case-nav-label="02 / Failed First Model"
 aria-labelledby="autonomy-decision-v2-title"
 >
 <header className="grid gap-7 lg:grid-cols-[180px_1fr]">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 02 / Failed First Model
 </p>
 <p className="m-0 mt-3 text-[11px] font-light text-[#0a0a0a]/38" style={bodyStyle}>
 Controlled Auto Apply
 </p>
 </div>
 <div>
 <h3
 id="autonomy-decision-v2-title"
 className="m-0 max-w-[780px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]"
 style={displayStyle}
 >
 One switch controlled actions with very different consequences.
 </h3>
 <p className="m-0 mt-6 max-w-[720px] text-[19px] font-light leading-[1.5] text-[#0a0a0a]/62" style={bodyStyle}>
 Our first model assumed users would either want Auto Apply or not want it. Testing showed the same user could accept automation for one action and reject it for the next.
 </p>
 </div>
 </header>

 <section className="grid gap-8 py-8 lg:grid-cols-[0.9fr_1.1fr]" aria-label="Auto Apply switch problem and risk tolerance">
 <article className="flex flex-col justify-between gap-8">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Initial model
 </p>
 <div className="border border-[#0a0a0a] p-6">
 <p className="m-0 text-center text-[10px] font-light uppercase tracking-[0.18em] text-[#ed5b2b]" style={bodyStyle}>
 Auto Apply
 </p>
 <div className="mt-8 flex items-center gap-4">
 <span className="text-[12px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/44" style={bodyStyle}>
 Off
 </span>
 <div className="relative h-px flex-1 bg-[#cccccc]">
 <span className="absolute left-0 top-1/2 size-4 -translate-y-1/2 rounded-full border border-[#0a0a0a] bg-white" />
 <span className="absolute right-0 top-1/2 size-4 -translate-y-1/2 rounded-full bg-[#0a0a0a]" />
 </div>
 <span className="text-[12px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]" style={bodyStyle}>
 On
 </span>
 </div>
 <p className="m-0 mt-8 text-center text-[18px] font-normal leading-[1.35] text-[#0a0a0a]" style={displayStyle}>
 One setting controlled every action.
 </p>
 </div>
 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc]">
 {['Turn on Auto Apply', 'AI matches jobs', 'AI edits materials', 'AI answers forms', 'AI submits'].map((step, index) => (
 <div key={step} className="grid grid-cols-[44px_1fr] bg-white p-3">
 <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
 {String(index + 1).padStart(2, '0')}
 </p>
 <p className="m-0 text-[12px] font-light text-[#0a0a0a]/66" style={bodyStyle}>
 {step}
 </p>
 </div>
 ))}
 </div>
 <figure className="m-0 border border-dashed border-[#ed5b2b] bg-[#fff0e8] p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Placeholder for your image
 </p>
 <figcaption className="m-0 mt-3 text-[13px] font-light leading-[1.55] text-[#0a0a0a]/64" style={bodyStyle}>
 Add an early Auto Apply concept, wireframe, or switch prototype here to make the failed first model feel real.
 </figcaption>
 </figure>
 </article>

 <article className="lg:border-l lg:border-[#cccccc] lg:pl-8">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 What testing showed
 </p>
 <div className="mt-7 grid gap-4">
 <div className="grid grid-cols-5 items-end gap-2 pb-6">
 {riskActions.map(([action, permission, note]) => (
 <div key={action} className="flex flex-col items-center gap-3 text-center">
 <p className="m-0 text-[11px] font-light leading-[1.25] text-[#0a0a0a]/62" style={bodyStyle}>
 {action}
 </p>
 <span
 className={`size-4 rounded-full ${
 permission === 'AUTO'
 ? 'bg-[#2c7a4b]'
 : permission === 'REVIEW'
 ? 'bg-[#f3c981]'
 : 'bg-[#ed5b2b]'
 }`}
 />
 <p className="m-0 text-[9px] font-light uppercase tracking-[0.1em] text-[#0a0a0a]/40" style={bodyStyle}>
 {note}
 </p>
 </div>
 ))}
 </div>
 <div className="grid grid-cols-3 gap-2 text-center">
 {['Auto', 'Review', 'Confirm'].map((level) => (
 <p
 key={level}
 className={`m-0 border px-3 py-2 text-[10px] font-light uppercase tracking-[0.14em] ${
 level === 'Auto'
 ? 'border-[#2c7a4b] text-[#2c7a4b]'
 : level === 'Review'
 ? 'border-[#d9ad57] text-[#8b682c]'
 : 'border-[#ed5b2b] text-[#ed5b2b]'
 }`}
 style={bodyStyle}
 >
 {level}
 </p>
 ))}
 </div>
 </div>
 <p className="m-0 mt-8 text-[17px] font-light leading-[1.6] text-[#0a0a0a]/68" style={bodyStyle}>
 Automation was not a single preference. Comfort changed with the consequence, reversibility, and judgment required by each action.
 </p>
 <p className="m-0 mt-5 border-l border-[#ed5b2b] pl-5 text-[22px] font-normal leading-[1.24] text-[#0a0a0a]" style={displayStyle}>
 The same user accepted automation for one action and rejected it for the next.
 </p>
 </article>
 </section>

 <section className="flex flex-col gap-8" data-case-nav-label="03 / Key Insight" aria-labelledby="permission-model-title">
 <div className="max-w-[860px]">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 03 / Key Insight
 </p>
 <h4
 id="permission-model-title"
 className="m-0 mt-3 text-[clamp(34px,4.8vw,60px)] font-normal leading-[1.03] tracking-[-0.03em] text-[#0a0a0a]"
 style={displayStyle}
 >
 We stopped asking “Is Auto Apply on?” and started asking “What is AI allowed to do next?”
 </h4>
 </div>

 <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
 <div className="relative min-h-[430px] border border-[#cccccc] bg-[#f3f1ea] p-6">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Action-level permission map
 </p>
 <div className="absolute left-6 right-6 top-1/2 h-px bg-[#cccccc]" />
 <div className="absolute bottom-6 top-20 left-1/2 w-px bg-[#cccccc]" />
 <p className="absolute left-6 top-1/2 m-0 -translate-y-7 text-[9px] font-light uppercase tracking-[0.1em] text-[#0a0a0a]/38" style={bodyStyle}>
 Low error cost
 </p>
 <p className="absolute right-6 top-1/2 m-0 -translate-y-7 text-right text-[9px] font-light uppercase tracking-[0.1em] text-[#0a0a0a]/38" style={bodyStyle}>
 High error cost
 </p>
 <p className="absolute left-1/2 top-20 m-0 -translate-x-1/2 text-center text-[9px] font-light uppercase tracking-[0.1em] text-[#0a0a0a]/38" style={bodyStyle}>
 More user control
 </p>
 <p className="absolute bottom-6 left-1/2 m-0 -translate-x-1/2 text-center text-[9px] font-light uppercase tracking-[0.1em] text-[#0a0a0a]/38" style={bodyStyle}>
 Less user control
 </p>
 {matrixItems.map((item) => (
 <div
 key={item.label}
 className={`absolute max-w-[150px] border bg-white px-3 py-2 text-[11px] font-light leading-[1.3] ${
 item.level === 'AUTO'
 ? 'border-[#2c7a4b] text-[#2c7a4b]'
 : item.level === 'REVIEW'
 ? 'border-[#d9ad57] text-[#8b682c]'
 : 'border-[#ed5b2b] text-[#ed5b2b]'
 }`}
 style={{ ...bodyStyle, left: item.x, top: item.y }}
 >
 {item.label}
 </div>
 ))}
 </div>

 <div className="flex flex-col gap-4">
 <div className="grid gap-2">
 {riskFactors.map((factor) => (
 <div key={factor} className="border border-[#cccccc] px-4 py-3">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/52" style={bodyStyle}>
 {factor}
 </p>
 </div>
 ))}
 </div>
 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc]">
 {permissionLevels.map(([label, title, body]) => (
 <article key={label} className="bg-white p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 {label}
 </p>
 <h5 className="m-0 mt-3 text-[21px] font-normal leading-[1.15] text-[#0a0a0a]" style={displayStyle}>
 {title}
 </h5>
 <p className="m-0 mt-2 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/62" style={bodyStyle}>
 {body}
 </p>
 </article>
 ))}
 </div>
 </div>
 </div>

 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-5">
 {autonomySettings.map(([title, body]) => (
 <article key={title} className="min-h-[132px] bg-white p-4">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.1em] text-[#ed5b2b]" style={bodyStyle}>
 {title}
 </p>
 <p className="m-0 mt-5 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/64" style={bodyStyle}>
 {body}
 </p>
 </article>
 ))}
 </div>

 <figure className="m-0 overflow-hidden bg-[#f3f1ea] p-4 sm:p-6" aria-label="Auto Apply autonomy settings interface">
 <div className="mb-4 flex items-end justify-between gap-6">
 <div>
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Interface proof
 </p>
 <figcaption className="m-0 mt-2 max-w-[620px] text-[13px] font-light leading-[1.55] text-[#0a0a0a]/62" style={bodyStyle}>
 The final settings screen made autonomy configurable before AI started applying: job rules, materials, question handling, approval requirements, and stop conditions.
 </figcaption>
 </div>
 <p className="m-0 hidden text-[10px] font-light uppercase tracking-[0.14em] text-[#0a0a0a]/38 sm:block" style={bodyStyle}>
 Settings screen
 </p>
 </div>
 <Image
 src="/img/jobnova/decision-auto-apply-190-10788.png"
 alt="JobNova Auto Apply settings defining matching rules, autonomy, application materials, and notification preferences."
 width={1120}
 height={669}
 className="h-auto w-full"
 unoptimized
 />
 </figure>
 </section>

 <section className="flex flex-col gap-8 py-9" data-case-nav-label="04 / Redesigned Flow" aria-labelledby="autonomy-flow-title">
 <div className="max-w-[860px]">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 04 / Redesigned Flow
 </p>
 <h4
 id="autonomy-flow-title"
 className="m-0 mt-3 text-[clamp(32px,4.4vw,56px)] font-normal leading-[1.05] tracking-[-0.03em] text-[#0a0a0a]"
 style={displayStyle}
 >
 One application moved through four permission moments.
 </h4>
 </div>

 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-4">
 {applicationFlow.map(([number, title, body, permission]) => (
 <article key={number} className="flex min-h-[166px] flex-col bg-white p-4">
 <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
 {number}
 </p>
 <h5 className="m-0 mt-4 text-[18px] font-normal leading-[1.15] text-[#0a0a0a]" style={displayStyle}>
 {title}
 </h5>
 <p className="m-0 mt-2 text-[11px] font-light leading-[1.45] text-[#0a0a0a]/58" style={bodyStyle}>
 {body}
 </p>
 <p
 className={`m-0 mt-auto pt-5 text-[9px] font-light uppercase tracking-[0.12em] ${
 permission === 'AUTO'
 ? 'text-[#2c7a4b]'
 : permission === 'REVIEW'
 ? 'text-[#8b682c]'
 : 'text-[#ed5b2b]'
 }`}
 style={bodyStyle}
 >
 {permission}
 </p>
 </article>
 ))}
 </div>

 <div className="grid gap-7 lg:grid-cols-[1fr_0.9fr]">
 <article className="border border-[#0a0a0a] p-6">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Permission checkpoint
 </p>
 <h5 className="m-0 mt-4 text-[25px] font-normal leading-[1.15] text-[#0a0a0a]" style={displayStyle}>
 Application review
 </h5>
 <dl className="m-0 mt-5 grid gap-3 py-5">
 {[
 ['Role', 'Senior Product Designer'],
 ['Resume', 'Product Designer - Version 03'],
 ['AI changes', '4 accepted · 1 rejected'],
 ['Questions', '8 answered · 2 require review'],
 ['Uncertainty', 'Work authorization not stated'],
 ].map(([label, value]) => (
 <div key={label} className="grid grid-cols-[120px_1fr] gap-4">
 <dt className="text-[11px] font-light uppercase tracking-[0.1em] text-[#0a0a0a]/38" style={bodyStyle}>
 {label}
 </dt>
 <dd className="m-0 text-[13px] font-light text-[#0a0a0a]/72" style={bodyStyle}>
 {value}
 </dd>
 </div>
 ))}
 </dl>
 <div className="mt-5 grid grid-cols-2 gap-3">
 {['Review details', 'Approve & submit'].map((action, index) => (
 <div
 key={action}
 className={`px-4 py-3 text-center text-[12px] font-light ${
 index === 0 ? 'border border-[#cccccc] text-[#0a0a0a]/64' : 'bg-[#0a0a0a] text-white'
 }`}
 style={bodyStyle}
 >
 {action}
 </div>
 ))}
 </div>
 </article>

 <article className="flex flex-col gap-5">
 <div className="border border-[#cccccc] p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Checks before action
 </p>
 <div className="mt-4 grid gap-2">
 {permissionCheckpoint.map(([mark, label]) => (
 <div key={label} className="flex items-center gap-3">
 <span className={`text-[13px] font-normal ${mark === '!' ? 'text-[#ed5b2b]' : 'text-[#2c7a4b]'}`} style={bodyStyle}>
 {mark}
 </span>
 <p className="m-0 text-[13px] font-light text-[#0a0a0a]/66" style={bodyStyle}>
 {label}
 </p>
 </div>
 ))}
 </div>
 </div>
 <div className="border border-[#cccccc] p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Live status
 </p>
 <p className="m-0 mt-4 text-[15px] font-light leading-[1.7] text-[#0a0a0a]/68" style={bodyStyle}>
 Preparing -&gt; Filling -&gt; Uploading -&gt; Confirming -&gt; Submitted
 </p>
 <p className="m-0 mt-4 border-l border-[#ed5b2b] pl-4 text-[13px] font-light leading-[1.6] text-[#0a0a0a]/62" style={bodyStyle}>
 Failed: Resume upload timeout. Review the reason, then retry or continue manually.
 </p>
 </div>
 </article>
 </div>

 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-5">
 {['Materials', 'Answers', 'Time', 'Status', 'Recovery'].map((record) => (
 <div key={record} className="bg-[#f3f1ea] p-4 text-center">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/54" style={bodyStyle}>
 {record}
 </p>
 </div>
 ))}
 </div>
 <p className="m-0 max-w-[720px] text-[15px] font-light leading-[1.6] text-[#0a0a0a]/68" style={bodyStyle}>
 Every application kept a record of what AI used, answered, and submitted.
 </p>
 </section>

 <section className="grid gap-7 lg:grid-cols-[1fr_300px]" aria-labelledby="auto-apply-outcome-title">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 5. Validation
 </p>
 <h5 id="auto-apply-outcome-title" className="m-0 mt-2 text-[20px] font-normal text-[#0a0a0a]" style={bodyStyle}>
 Usage and reliability were measured. Permission confidence remained a validation target.
 </h5>
 <div className="mt-5 grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-3">
 {[
 ['Adoption', '19.39%', 'activated Auto Apply'],
 ['Control', 'TBD', 'changed permissions or reviewed before submission'],
 ['Reliability', '88.21%', 'final automated submission success'],
 ].map(([label, value, body]) => (
 <article key={label} className="bg-white p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 {label}
 </p>
 <p className="m-0 mt-4 text-[34px] font-normal leading-none tracking-[-0.02em] text-[#0a0a0a]" style={displayStyle}>
 {value}
 </p>
 <p className="m-0 mt-3 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/62" style={bodyStyle}>
 {body}
 </p>
 </article>
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
 Permission-change, recovery, and confidence metrics remain validation targets until measured values are available.
 </p>
 </aside>
 </section>

 <section className="grid sm:grid-cols-2 lg:grid-cols-4" aria-label="Configurable autonomy design rules">
 {designRules.map(([title, body], index) => (
 <article
 key={title}
 className={`min-h-[184px] py-6 sm:px-5 ${
 index < designRules.length - 1 ? ' sm:border-r' : ''
 } ${index === 1 ? 'sm:border-r-0 lg:border-r' : ''} ${index >= 2 ? '' : ''} ${
 index === 0 ? 'sm:pl-0' : ''
 }`}
 >
 <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
 {String(index + 1).padStart(2, '0')}
 </p>
 <h5 className="m-0 mt-5 text-[17px] font-normal leading-[1.3] text-[#0a0a0a]" style={displayStyle}>
 {title}
 </h5>
 <p className="m-0 mt-2 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/62" style={bodyStyle}>
 {body}
 </p>
 </article>
 ))}
 </section>

 <blockquote className="m-0 py-9">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 6. Key Takeaway
 </p>
 <p className="m-0 mt-5 max-w-[920px] text-[clamp(26px,3.8vw,50px)] font-normal leading-[1.1] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>
 Configurable autonomy turned one risky switch into a sequence of clear user decisions.
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
 className="flex w-full flex-col gap-14 pt-8"
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

 <div className="grid gap-8 py-8 lg:grid-cols-2">
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
 className="border border-[#cccccc] bg-[#f3f1ea] px-3 py-2 text-[12px] font-light text-[#0a0a0a]/66"
 style={bodyStyle}
 >
 {mode}
 </span>
 ))}
 </div>
 <p className="m-0 mt-7 text-[22px] font-normal leading-[1.35] text-[#0a0a0a]" style={displayStyle}>
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

 <div className="overflow-hidden border border-[#cccccc]">
 <div className="grid grid-cols-2 bg-[#f3f1ea] px-5 py-3 text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/42" style={bodyStyle}>
 <p className="m-0">Before</p>
 <p className="m-0">After</p>
 </div>
 {decisionComparison.map(([before, after], index) => (
 <div
 key={before}
 className={`grid grid-cols-2 gap-5 px-5 py-5 ${
 index < decisionComparison.length - 1 ? '' : ''
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

 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-3">
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

 <section className="grid sm:grid-cols-2 lg:grid-cols-4" aria-label="AI autonomy design principles">
 {autonomyPrinciples.map((principle, index) => (
 <article
 key={principle.title}
 className={`min-h-[220px] py-6 sm:px-5 ${
 index < autonomyPrinciples.length - 1 ? ' sm:border-r' : ''
 } ${index === 1 ? 'sm:border-r-0 lg:border-r' : ''} ${index >= 2 ? '' : ''} ${
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

 <div className="flex flex-col gap-12 pt-10">
 <header>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 5. Translating the Decision into the Experience
 </p>
 <h4 className="m-0 mt-3 max-w-[800px] text-[clamp(32px,4.4vw,56px)] font-normal leading-[1.05] tracking-[-0.03em] text-[#0a0a0a]" style={displayStyle}>
 AI earns the right to act by following the boundaries a user defines.
 </h4>
 </header>

 <section className="flex flex-col gap-6" aria-labelledby="define-rules-title">
 <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 A. Define the Rules
 </p>
 <h5 id="define-rules-title" className="m-0 mt-3 text-[24px] font-normal leading-[1.2] text-[#0a0a0a]" style={displayStyle}>
 Permission before action
 </h5>
 <p className="m-0 mt-4 text-[14px] font-normal leading-[1.55] text-[#0a0a0a]" style={bodyStyle}>
 Users first define the conditions under which AI is allowed to act.
 </p>
 </div>
 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] sm:grid-cols-2">
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
 <div className="overflow-hidden bg-[#f3f1ea] p-4 sm:p-6">
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

 <section className="flex flex-col gap-5 py-8" aria-labelledby="execute-boundaries-title">
 <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 B. Execute Within Boundaries
 </p>
 <h5 id="execute-boundaries-title" className="m-0 mt-3 text-[24px] font-normal leading-[1.2] text-[#0a0a0a]" style={displayStyle}>
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
 <h5 id="exceptions-title" className="m-0 mt-3 text-[24px] font-normal leading-[1.2] text-[#0a0a0a]" style={displayStyle}>
 Recovery is part of the flow
 </h5>
 </div>
 <p className="m-0 max-w-[600px] text-[16px] font-normal leading-[1.55] text-[#0a0a0a]" style={bodyStyle}>
 When automation could not continue, the system explained why and offered a clear recovery path.
 </p>
 </div>
 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] sm:grid-cols-2">
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

 <section className="bg-[#10100f] p-6 text-white sm:p-8" aria-labelledby="implementation-title">
 <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#aefd48]" style={bodyStyle}>
 6. From Design to Implementation
 </p>
 <h5 id="implementation-title" className="m-0 mt-3 text-[25px] font-normal leading-[1.2] text-white" style={displayStyle}>
 Translating UX into product rules
 </h5>
 </div>
 <div className="grid sm:grid-cols-2 lg:grid-cols-6">
 {implementationFlow.map((state, index) => (
 <div
 key={state}
 className={`relative flex min-h-[104px] items-center justify-between gap-3 py-4 sm:px-4 ${
 index < implementationFlow.length - 1 ? ' border-white/20 sm:border-r' : ''
 } ${index === 1 || index === 3 ? 'sm:border-r-0 lg:border-r' : ''} ${
 index >= 2 ? '' : ''
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
 <h5 id="auto-apply-outcome-title" className="m-0 mt-2 text-[20px] font-normal text-[#0a0a0a]" style={bodyStyle}>
 Autonomy-specific validation signals
 </h5>
 <div className="mt-5 flex flex-wrap gap-2">
 {outcomeMetrics.map((metric) => (
 <span
 key={metric}
 className="border border-[#cccccc] px-3 py-2 text-[11px] font-light leading-[17px] text-[#0a0a0a]/68"
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

 <blockquote className="m-0 py-9">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 8. Key Takeaway
 </p>
 <p className="m-0 mt-5 max-w-[920px] text-[clamp(26px,3.8vw,50px)] font-normal leading-[1.1] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>
 The most valuable design decision was not increasing automation, but allowing users to define when automation was appropriate.
 </p>
 </blockquote>
 </div>
 </section>
 );
}

function EdgeCasesSection() {
 const failureSteps = [
 ['Detect', 'Find missing, conflicting, or failed information.'],
 ['Pause', 'Stop high-risk action before it executes.'],
 ['Explain', 'Show the issue and why it matters.'],
 ['Ask', 'Return the decision to the user.'],
 ['Recover', 'Save state and offer a safe path forward.'],
 ];
 const failureTypes = ['? Missing info', '≠ Conflict', '× Partial failure', '! Wrong AI judgment'];
 const systemRules = [
 ['Known + reversible', 'AI can continue'],
 ['Unclear or high-risk', 'AI must pause'],
 ['Failed or uncertain', 'User gets recovery control'],
 ];
 const scenarios = [
 {
 number: '01',
 title: 'Missing information',
 signal: 'Work authorization: Not stated',
 response: 'Pause submission · No inference · Ask user',
 control: ['Confirm eligibility', 'Skip this job'],
 outcome: 'One confirmation did not automatically expand future permissions.',
 },
 {
 number: '02',
 title: 'Conflicting information',
 signal: 'Form: 5+ years ≠ Resume: 3 years',
 response: 'Preserve facts · Block auto-answer · Request decision',
 control: ['Review evidence', 'Answer manually'],
 outcome: 'AI could clarify the conflict, but it could not rewrite facts to pass the form.',
 },
 {
 number: '03',
 title: 'Partial failure',
 signal: 'Resume uploaded · Form not submitted',
 response: 'Show progress · Prevent duplicates · Retry safely',
 control: ['Review details', 'Retry safely'],
 outcome: 'Users could see exactly where the process stopped before retrying.',
 },
 {
 number: '04',
 title: 'Incorrect AI judgment',
 signal: 'User rule: Salary ≥ $120K · AI selected: $105K',
 response: 'Stop action · Undo where possible · Correct future rules',
 control: ['Undo action', 'Update preference'],
 outcome: 'The correction affected future recommendations and applications.',
 },
 ];

 return (
 <section
 className="flex max-w-[980px] flex-col gap-12 pt-8"
 data-case-nav-label="05 / The Second Failure"
 aria-labelledby="edge-cases-title"
 >
 <header className="grid gap-7 lg:grid-cols-[180px_1fr]">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 05 / The Second Failure
 </p>
 <p className="m-0 mt-3 text-[11px] font-light text-[#0a0a0a]/38" style={bodyStyle}>
 Beyond permission
 </p>
 </div>
 <div>
 <h2
 id="edge-cases-title"
 className="m-0 max-w-[820px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]"
 style={displayStyle}
 >
 Permission worked on the happy path. Uncertainty exposed the next problem.
 </h2>
 <p className="m-0 mt-6 max-w-[720px] text-[19px] font-light leading-[1.5] text-[#0a0a0a]/62" style={bodyStyle}>
 The next round of testing showed that permission alone did not preserve trust when information was missing, conflicting, or incomplete.
 </p>
 </div>
 </header>

 <section className="grid gap-8 py-8 lg:grid-cols-[0.9fr_1.1fr]" aria-labelledby="missing-info-case-title">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Case from testing
 </p>
 <h3 id="missing-info-case-title" className="m-0 mt-3 text-[clamp(30px,4vw,50px)] font-normal leading-[1.08] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>
 Work authorization was missing.
 </h3>
 <p className="m-0 mt-5 text-[15px] font-light leading-[1.65] text-[#0a0a0a]/68" style={bodyStyle}>
 The system could not safely infer the answer, but continuing without it would produce an invalid application. The wrong design would either guess, skip the role, or fail after submission.
 </p>
 </div>
 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc]">
 {[
 ['Risk', 'Unknown answer required before submission'],
 ['Bad options', 'Guess · Skip · Fail after submit'],
 ['Final behavior', 'Pause before submission and ask the user'],
 ['Resume path', 'Continue from the same point after confirmation'],
 ].map(([label, body]) => (
 <article key={label} className="grid gap-3 bg-white p-4 sm:grid-cols-[128px_1fr]">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 {label}
 </p>
 <p className="m-0 text-[13px] font-light leading-[1.55] text-[#0a0a0a]/68" style={bodyStyle}>
 {body}
 </p>
 </article>
 ))}
 </div>
 </section>

 <section className="flex flex-col gap-8 py-8" data-case-nav-label="06 / Recovery" aria-labelledby="failure-model-title">
 <div className="max-w-[820px]">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 06 / Recovery
 </p>
 <h3 id="failure-model-title" className="m-0 mt-3 text-[clamp(30px,4vw,50px)] font-normal leading-[1.08] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>
 When AI could not act safely, it paused instead of guessing.
 </h3>
 <p className="m-0 mt-5 max-w-[720px] text-[15px] font-light leading-[1.65] text-[#0a0a0a]/66" style={bodyStyle}>
 We extended the permission system with visible states and recovery paths: detect the issue, pause the action, explain the consequence, ask for a decision, and resume from the same point.
 </p>
 </div>

 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-5">
 {failureSteps.map(([step, body], index) => (
 <article key={step} className="flex min-h-[184px] flex-col bg-white p-5">
 <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
 {String(index + 1).padStart(2, '0')}
 </p>
 <h4 className="m-0 mt-5 text-[21px] font-normal leading-[1.12] text-[#0a0a0a]" style={displayStyle}>
 {step}
 </h4>
 <p className="m-0 mt-auto pt-6 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/62" style={bodyStyle}>
 {body}
 </p>
 </article>
 ))}
 </div>

 <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 4 failure types
 </p>
 <div className="mt-4 flex flex-wrap gap-2">
 {failureTypes.map((type) => (
 <span key={type} className="border border-[#cccccc] px-3 py-2 text-[12px] font-light text-[#0a0a0a]/66" style={bodyStyle}>
 {type}
 </span>
 ))}
 </div>
 </div>
 <div className="border-l border-[#ed5b2b] pl-5">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 System rule
 </p>
 <div className="mt-4 grid gap-3">
 {systemRules.map(([condition, action]) => (
 <div key={condition} className="grid gap-2 sm:grid-cols-[180px_1fr]">
 <p className="m-0 text-[13px] font-normal text-[#0a0a0a]" style={bodyStyle}>
 {condition}
 </p>
 <p className="m-0 text-[13px] font-light text-[#0a0a0a]/62" style={bodyStyle}>
 {action}
 </p>
 </div>
 ))}
 </div>
 </div>
 </div>

 <p className="m-0 max-w-[760px] text-[22px] font-normal leading-[1.24] text-[#0a0a0a]" style={displayStyle}>
 The system never converted uncertainty into an automatic decision.
 </p>
 </section>

 <section className="flex flex-col gap-5" aria-labelledby="recovery-interface-title">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Interface states
 </p>
 <h3 id="recovery-interface-title" className="m-0 mt-2 text-[22px] font-normal text-[#0a0a0a]" style={bodyStyle}>
 The UI kept automation visible while it was queued, running, waiting, submitted, or failed.
 </h3>
 </div>
 <AutoApplyStateSwitcher stateIds={['pending-approval', 'queued', 'progress', 'submitted', 'failed']} />
 </section>

 <section className="flex flex-col gap-6" aria-labelledby="edge-scenarios-title">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 2. Four critical edge cases
 </p>
 <h3 id="edge-scenarios-title" className="m-0 mt-2 text-[22px] font-normal text-[#0a0a0a]" style={bodyStyle}>
 Each failure state preserved user control and a recoverable record.
 </h3>
 </div>

 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] lg:grid-cols-2">
 {scenarios.map((scenario) => (
 <article key={scenario.number} className="flex min-h-[316px] flex-col bg-white p-6">
 <div className="flex items-start justify-between gap-4">
 <div>
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 {scenario.number} / {scenario.title}
 </p>
 <h4 className="m-0 mt-4 max-w-[420px] text-[25px] font-normal leading-[1.12] text-[#0a0a0a]" style={displayStyle}>
 {scenario.signal}
 </h4>
 </div>
 <span className="text-[24px] font-light leading-none text-[#ed5b2b]" style={displayStyle}>
 {scenario.number === '01' ? '?' : scenario.number === '02' ? '≠' : scenario.number === '03' ? '×' : '!'}
 </span>
 </div>

 <div className="mt-6 grid gap-4 py-5">
 <div>
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/38" style={bodyStyle}>
 System response
 </p>
 <p className="m-0 mt-2 text-[13px] font-light leading-[1.55] text-[#0a0a0a]/68" style={bodyStyle}>
 {scenario.response}
 </p>
 </div>
 <div>
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/38" style={bodyStyle}>
 User control
 </p>
 <div className="mt-2 flex flex-wrap gap-2">
 {scenario.control.map((action) => (
 <span key={action} className="border border-[#cccccc] px-3 py-2 text-[11px] font-light text-[#0a0a0a]/64" style={bodyStyle}>
 {action}
 </span>
 ))}
 </div>
 </div>
 </div>

 <p className="m-0 mt-auto pt-5 text-[13px] font-light leading-[1.6] text-[#0a0a0a]/62" style={bodyStyle}>
 {scenario.outcome}
 </p>
 </article>
 ))}
 </div>
 </section>

 <section className="grid gap-5 py-7 lg:grid-cols-[1fr_1fr]" aria-label="Happy path and edge case path comparison">
 {[
 ['Happy path', 'Prepare → Approve → Submit → Track'],
 ['Edge case', 'Detect issue → Pause → User decision → Recover → Track'],
 ].map(([title, flow]) => (
 <article key={title} className="border border-[#cccccc] p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 {title}
 </p>
 <p className="m-0 mt-4 text-[18px] font-normal leading-[1.35] text-[#0a0a0a]" style={displayStyle}>
 {flow}
 </p>
 </article>
 ))}
 </section>

 <blockquote className="m-0 py-9">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Closing statement
 </p>
 <p className="m-0 mt-5 max-w-[920px] text-[clamp(26px,3.8vw,50px)] font-normal leading-[1.1] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>
 Recovery was not an exception to the workflow. It was part of the workflow.
 </p>
 </blockquote>
 </section>
 );
}

function SystemDesignSection() {
 const finalModel = ['Assess risk', 'Set permission', 'Show status', 'Pause on uncertainty', 'Record + recover'];
 const remainingValidation = [
 'Which permission defaults fit different user segments',
 'Whether checkpoints increased perceived control',
 'How often recovery reduced anxiety after failed automation',
 'Whether users understood the boundary between Review and Confirm',
 ];

 return (
 <section
 className="flex max-w-[980px] flex-col gap-12 pt-8"
 data-case-nav-label="07 / System & Validation"
 aria-labelledby="system-design-title"
 >
 <header className="grid gap-7 lg:grid-cols-[180px_1fr]">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 07 / System & Validation
 </p>
 <p className="m-0 mt-3 text-[11px] font-light text-[#0a0a0a]/38" style={bodyStyle}>
 Launch evidence
 </p>
 </div>
 <div>
 <h2
 id="system-design-title"
 className="m-0 max-w-[820px] text-[clamp(40px,5.8vw,78px)] font-normal leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]"
 style={displayStyle}
 >
 Automation became faster because its boundaries were visible.
 </h2>
 <p className="m-0 mt-6 max-w-[720px] text-[19px] font-light leading-[1.5] text-[#0a0a0a]/62" style={bodyStyle}>
 The final design was not a more powerful Auto Apply button. It was a system that made automation configurable before execution, visible while running, and recoverable after failure.
 </p>
 </div>
 </header>

 <section className="overflow-hidden" aria-labelledby="final-system-model-title">
 <div className="bg-[#10100f] p-6 text-white sm:p-8">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#aefd48]" style={bodyStyle}>
 Final system model
 </p>
 <h3 id="final-system-model-title" className="m-0 mt-4 text-[clamp(30px,4.2vw,54px)] font-normal leading-[1.04] tracking-[-0.03em] text-white" style={displayStyle}>
 Assess risk → Set permission → Show status → Pause → Record and recover
 </h3>
 <div className="mt-8 grid gap-px overflow-hidden border border-white/20 bg-white/20 md:grid-cols-5">
 {finalModel.map((step, index) => (
 <article key={step} className="flex min-h-[150px] flex-col bg-[#10100f] p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#aefd48]" style={bodyStyle}>
 {String(index + 1).padStart(2, '0')}
 </p>
 <h4 className="m-0 mt-auto text-[17px] font-normal leading-[1.22] text-white" style={displayStyle}>
 {step}
 </h4>
 </article>
 ))}
 </div>
 </div>
 </section>

 <section className="flex flex-col gap-6" aria-labelledby="launch-data-title">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 What launch data showed
 </p>
 <h3 id="launch-data-title" className="m-0 mt-2 max-w-[720px] text-[22px] font-normal leading-[1.3] text-[#0a0a0a]" style={bodyStyle}>
 Users were willing to adopt automation when boundaries, status, and consequences stayed visible.
 </h3>
 </div>

 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-4">
 {resultMetrics.filter((metric) => ['Adoption', 'Reliability', 'Speed', 'Outcome'].includes(metric.label)).map((metric) => (
 <article key={metric.label} className="bg-white p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#0a0a0a]/38" style={bodyStyle}>
 {metric.label}
 </p>
 <p className="m-0 mt-5 text-[28px] font-normal leading-none text-[#ed5b2b]" style={displayStyle}>
 {metric.value}
 </p>
 <p className="m-0 mt-3 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/62" style={bodyStyle}>
 {metric.title}
 </p>
 </article>
 ))}
 </div>
 </section>

 <section className="grid gap-7 py-8 lg:grid-cols-[1fr_300px]" aria-label="Remaining validation targets">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 What remained to validate
 </p>
 <div className="mt-5 grid gap-3">
 {remainingValidation.map((item, index) => (
 <div key={item} className="flex items-start gap-3 pb-3">
 <span className="mt-[3px] text-[11px] font-light text-[#ed5b2b]" style={bodyStyle}>
 {String(index + 1).padStart(2, '0')}
 </span>
 <p className="m-0 text-[13px] font-light leading-[1.6] text-[#0a0a0a]/68" style={bodyStyle}>
 {item}
 </p>
 </div>
 ))}
 </div>
 </div>
 <aside className="border-l border-[#ed5b2b] pl-5">
 <p className="m-0 text-[14px] font-light leading-[1.65] text-[#0a0a0a]/68" style={bodyStyle}>
 Launch metrics showed adoption, reliability, speed, and outcome quality. They did not fully prove perceived control, so permission confidence and recovery behavior remained explicit validation targets.
 </p>
 </aside>
 </section>

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

 return (
 <section
 className="flex w-full flex-col gap-11 pt-8"
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

 <div className="grid gap-8 py-8 lg:grid-cols-2">
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
 className="border border-[#cccccc] bg-[#f3f1ea] px-3 py-2 text-[12px] font-light text-[#0a0a0a]/66"
 style={bodyStyle}
 >
 {question}
 </span>
 ))}
 </div>
 <p className="m-0 mt-7 text-[21px] font-normal leading-[1.35] text-[#0a0a0a]" style={displayStyle}>
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

 <div className="overflow-hidden border border-[#cccccc]">
 <div className="grid grid-cols-2 bg-[#f3f1ea] px-5 py-3 text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/42" style={bodyStyle}>
 <p className="m-0">Before</p>
 <p className="m-0">After</p>
 </div>
 {decisionComparison.map(([before, after], index) => (
 <div
 key={before}
 className={`grid grid-cols-2 gap-5 px-5 py-4 ${
 index < decisionComparison.length - 1 ? '' : ''
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

 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-3">
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

 <section className="grid md:grid-cols-3" aria-label="Application accountability design principles">
 {accountabilityPrinciples.map((principle, index) => (
 <article
 key={principle.title}
 className={`min-h-[178px] py-5 md:px-6 ${
 index < accountabilityPrinciples.length - 1 ? ' md:border-r' : ''
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

 <section className="flex flex-col gap-8 pt-9" aria-labelledby="tracking-experience-title">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 5. Translating the Decision into the Experience
 </p>
 <h4
 id="tracking-experience-title"
 className="m-0 mt-3 max-w-[760px] text-[clamp(30px,4vw,50px)] font-normal leading-[1.08] tracking-[-0.025em] text-[#0a0a0a]"
 style={displayStyle}
 >
 Visibility continues after the AI acts.
 </h4>
 </div>

 <section className="border border-[#cccccc]" aria-labelledby="application-timeline-title">
 <div className="grid gap-4 px-5 py-5 md:grid-cols-[190px_1fr]">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 A. Application Timeline
 </p>
 <h5 id="application-timeline-title" className="m-0 mt-2 text-[20px] font-normal text-[#0a0a0a]" style={displayStyle}>
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
 index < timelineStates.length - 1 ? ' border-[#d5d1c8] sm:border-r' : ''
 }`}
 >
 <div className="flex items-center gap-2">
 <span className={`size-2 rounded-full ${index === 2 ? 'bg-[#ed5b2b]' : 'bg-[#0a0a0a]/28'}`} aria-hidden />
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
 <figcaption className="min-h-[118px] border border-[#cccccc] p-5">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 B. Submission Record
 </p>
 <p className="m-0 mt-3 text-[14px] font-normal leading-[1.55] text-[#0a0a0a]" style={bodyStyle}>
 Submitted resume, cover letter, date, match evidence, and the Auto Apply log remained reviewable after completion.
 </p>
 </figcaption>
 <div className="flex h-[430px] items-start justify-center overflow-hidden bg-[#f3f1ea] p-3 sm:p-4">
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
 <figcaption className="min-h-[118px] border border-[#cccccc] p-5">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 C. Actionable Notifications
 </p>
 <p className="m-0 mt-3 text-[14px] font-normal leading-[1.55] text-[#0a0a0a]" style={bodyStyle}>
 Interview invitations, failures, approvals, and material updates surfaced only when user attention was required.
 </p>
 </figcaption>
 <div className="flex h-[430px] items-start justify-center overflow-hidden bg-[#f3f1ea] p-3 sm:p-4">
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
 <h5 id="tracking-outcome-title" className="m-0 mt-2 text-[20px] font-normal text-[#0a0a0a]" style={bodyStyle}>
 Accountability-specific validation signals
 </h5>
 <div className="mt-5 flex flex-wrap gap-2">
 {outcomeMetrics.map((metric) => (
 <span
 key={metric}
 className="border border-[#cccccc] px-3 py-2 text-[11px] font-light leading-[17px] text-[#0a0a0a]/68"
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

 <blockquote className="m-0 py-8">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 7. Key Takeaway
 </p>
 <p className="m-0 mt-4 max-w-[920px] text-[clamp(22px,3vw,40px)] font-normal leading-[1.15] tracking-[-0.02em] text-[#0a0a0a]" style={displayStyle}>
 Automation becomes trustworthy only when users can understand what happened, what is happening, and what needs their attention next.
 </p>
 </blockquote>

 </section>
 );
}

function ProductStrategySection() {
 return (
 <section className="flex max-w-[980px] flex-col gap-14 md:gap-20" data-case-nav-label="05 / Product Strategy">
 <header className="pb-[clamp(48px,7vw,84px)]">
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>05 / Product Strategy</p>
 <h2 className="m-0 mt-7 max-w-[900px] text-[clamp(42px,6.6vw,88px)] font-normal leading-[0.96] tracking-[-0.045em] text-[#0a0a0a]" style={displayStyle}>
 One product. One continuous <span className="text-[#ed5b2b]">application workflow.</span>
 </h2>
 <p className="m-0 mt-8 max-w-[850px] text-[clamp(16px,2vw,22px)] font-light leading-[1.55] text-[#0a0a0a]/65" style={bodyStyle}>
 We shifted from a set of isolated AI features to one connected journey with clear user control.
 </p>
 </header>

 <section aria-labelledby="strategy-before-after-title">
 <div className="mb-6">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>Before / After</p>
 <h3 id="strategy-before-after-title" className="m-0 mt-3 text-[clamp(28px,3.7vw,48px)] font-normal leading-[1.08] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>From handoffs to continuity</h3>
 </div>

 <div className="border border-[#cccccc] bg-[#f3f1ea] p-6 md:p-8">
 <div className="flex items-center justify-between">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#0a0a0a]/42" style={bodyStyle}>Before</p>
 <p className="m-0 text-[10px] font-light text-[#0a0a0a]/32" style={bodyStyle}>Disconnected tools and decisions</p>
 </div>
 <div className="mt-7 grid gap-3 sm:grid-cols-4">
 {['Discover', 'Resume & ATS', 'Apply', 'Track'].map((step, index) => (
 <div key={step} className="relative flex min-h-[92px] items-end border border-[#d6d2c9] bg-white p-4">
 <span className="absolute left-4 top-4 size-2 border border-[#ed5b2b]" aria-hidden />
 <p className="m-0 text-[13px] font-light text-[#0a0a0a]/62" style={bodyStyle}>{step}</p>
 {index < 3 ? <span className="absolute -right-3 top-1/2 hidden w-3 bg-[#ed5b2b]/45 sm:block" aria-hidden /> : null}
 </div>
 ))}
 </div>
 <p className="m-0 mt-6 text-[12px] font-light text-[#0a0a0a]/48" style={bodyStyle}>Repeated inputs · Lost context · Manual verification</p>
 </div>

 <div className="bg-[#10100f] p-6 text-white md:p-8">
 <div className="flex items-center justify-between">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#aefd48]" style={bodyStyle}>After</p>
 <p className="m-0 text-[10px] font-light text-white/34" style={bodyStyle}>User journey + AI responsibility</p>
 </div>
 <div className="mt-7 grid md:grid-cols-4">
 {connectedWorkflow.map(([stage, task, responsibility], index) => (
 <article key={stage} className={`relative min-h-[190px] py-6 md:px-6 ${index < 3 ? ' border-white/18 md:border-r' : ''} ${index === 0 ? 'md:pl-0' : ''}`}>
 <p className="m-0 text-[10px] font-light text-[#aefd48]" style={bodyStyle}>{String(index + 1).padStart(2, '0')}</p>
 <h4 className="m-0 mt-6 text-[24px] font-normal leading-none text-white" style={displayStyle}>{stage}</h4>
 <p className="m-0 mt-3 text-[12px] font-light text-white/55" style={bodyStyle}>{task}</p>
 <p className="m-0 mt-8 border-l border-[#ed5b2b] pl-3 text-[11px] font-light leading-[1.45] text-white/72" style={bodyStyle}>{responsibility}</p>
 {index < 3 ? <span className="absolute -right-[10px] top-[54px] z-10 hidden bg-[#10100f] px-1 text-[14px] text-[#ed5b2b] md:block" aria-hidden>→</span> : null}
 </article>
 ))}
 </div>

 <div className="mt-8 border border-[#ed5b2b]/50 p-5">
 <div className="flex items-center justify-between gap-6">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>Shared application context</p>
 <span className="h-px flex-1 bg-[#ed5b2b]/35" aria-hidden />
 </div>
 <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
 {sharedContext.map((item) => (
 <div key={item} className="flex items-center gap-2">
 <span className="size-1.5 rounded-full bg-[#aefd48]" aria-hidden />
 <p className="m-0 text-[10px] font-light text-white/52" style={bodyStyle}>{item}</p>
 </div>
 ))}
 </div>
 </div>
 <p className="m-0 mt-5 text-[12px] font-light text-white/44" style={bodyStyle}>Context moves with the user across every step.</p>
 </div>
 </section>

 <section aria-labelledby="trust-layer-title">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>Trust layer</p>
 <h3 id="trust-layer-title" className="m-0 mt-3 max-w-[760px] text-[clamp(28px,3.7vw,48px)] font-normal leading-[1.08] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>Three guardrails across the workflow</h3>
 <div className="mt-7 grid md:grid-cols-3">
 {trustLayerPrinciples.map((principle, index) => (
 <article key={principle.label} className={`flex min-h-[310px] flex-col py-7 md:px-7 ${index < 2 ? ' md:border-r' : ''} ${index === 0 ? 'md:pl-0' : ''} ${index === 1 ? 'bg-[#f3f1ea]' : ''}`}>
 <div className="flex items-center justify-between">
 <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>{String(index + 1).padStart(2, '0')}</p>
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/38" style={bodyStyle}>{principle.label}</p>
 </div>
 <h4 className="m-0 mt-8 text-[clamp(24px,2.8vw,34px)] font-normal leading-[1.08] tracking-[-0.02em] text-[#0a0a0a]" style={displayStyle}>{principle.title}</h4>
 <p className="m-0 mt-4 text-[12px] font-light leading-[1.6] text-[#0a0a0a]/58" style={bodyStyle}>{principle.body}</p>
 <div className="mt-auto pt-8">
 <div className="grid grid-cols-4 gap-2">
 {principle.coverage.map((active, coverageIndex) => <span key={coverageIndex} className={`h-1 ${active ? 'bg-[#ed5b2b]' : 'bg-[#dedbd3]'}`} aria-hidden />)}
 </div>
 <div className="mt-2 grid grid-cols-4 text-[8px] font-light uppercase text-[#0a0a0a]/32" style={bodyStyle}>{['M', 'C', 'A', 'T'].map((label) => <span key={label}>{label}</span>)}</div>
 </div>
 </article>
 ))}
 </div>
 </section>

 <section className="border border-[#cccccc]" aria-labelledby="strategy-to-design-title">
 <div className="bg-[#f3f1ea] px-6 py-4">
 <h3 id="strategy-to-design-title" className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#0a0a0a]/45" style={bodyStyle}>From strategy to design</h3>
 </div>
 {strategyToDesign.map(([strategy, response], index) => (
 <div key={strategy} className={`grid gap-4 px-6 py-6 sm:grid-cols-[0.8fr_44px_1.2fr] sm:items-center ${index < 2 ? '' : ''}`}>
 <p className="m-0 text-[15px] font-normal text-[#0a0a0a]" style={bodyStyle}>{strategy}</p>
 <span className="text-[#ed5b2b]" aria-hidden>→</span>
 <p className="m-0 text-[20px] font-normal leading-[1.25] text-[#ed5b2b]" style={displayStyle}>{response}</p>
 </div>
 ))}
 </section>

 <p className="m-0 py-[clamp(36px,5vw,58px)] text-[clamp(28px,4vw,52px)] font-normal leading-[1.08] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>
 These principles became three design decisions across the application journey.
 </p>
 </section>
 );
}

function ResearchSection() {
 return (
 <section className="flex max-w-[980px] flex-col gap-14 md:gap-20" data-case-nav-label="04 / Research">
 <header className="pb-[clamp(48px,7vw,84px)]">
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 04 / Research
 </p>
 <h2 className="m-0 mt-7 max-w-[900px] text-[clamp(42px,6.6vw,88px)] font-normal leading-[0.96] tracking-[-0.045em] text-[#0a0a0a]" style={displayStyle}>
 We tested where trust broke—
 <br />
 <span className="text-[#ed5b2b]">not which features users wanted.</span>
 </h2>
 <p className="m-0 mt-8 max-w-[820px] text-[clamp(16px,2vw,22px)] font-light leading-[1.55] text-[#0a0a0a]/65" style={bodyStyle}>
 The goal was to identify when users needed explanation, control, or confirmation.
 </p>
 </header>

 <section aria-labelledby="research-flow-v2-title">
 <div className="mb-6 flex items-end justify-between gap-6">
 <h3 id="research-flow-v2-title" className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>Research flow</h3>
 <p className="m-0 hidden text-[11px] font-light text-[#0a0a0a]/38 sm:block" style={bodyStyle}>From expectation to behavior</p>
 </div>
 <div className="grid md:grid-cols-5">
 {researchFlowV2.map(([method, validation], index) => (
 <article key={method} className={`relative min-h-[132px] py-5 md:px-5 ${index < 4 ? ' md:border-r' : ''} ${index === 0 ? 'md:pl-0' : ''}`}>
 <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>{String(index + 1).padStart(2, '0')}</p>
 <h4 className="m-0 mt-5 text-[15px] font-normal leading-[1.3] text-[#0a0a0a]" style={bodyStyle}>{method}</h4>
 <p className="m-0 mt-2 text-[11px] font-light leading-[1.45] text-[#0a0a0a]/48" style={bodyStyle}>{validation}</p>
 {index < 4 ? <span className="absolute bottom-[-9px] left-1/2 z-10 bg-white px-1 text-[13px] text-[#ed5b2b] md:-right-[9px] md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2" aria-hidden>→</span> : null}
 </article>
 ))}
 </div>
 </section>

 <section className="bg-[#10100f] p-[clamp(28px,5vw,52px)] text-white" aria-labelledby="trust-breakdown-title">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#aefd48]" style={bodyStyle}>Where trust broke</p>
 <h3 id="trust-breakdown-title" className="m-0 mt-3 max-w-[720px] text-[clamp(30px,4.2vw,56px)] font-normal leading-[1.05] tracking-[-0.03em] text-white" style={displayStyle}>
 Each step raised a different question.
 </h3>
 <div className="mt-10 grid md:grid-cols-4">
 {trustBreakdownMap.map(([stage, question, need], index) => (
 <article key={stage} className={`relative min-h-[230px] py-6 md:px-6 ${index < 3 ? ' border-white/18 md:border-r' : ''} ${index === 0 ? 'md:pl-0' : ''}`}>
 <div className="flex items-center justify-between">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-white/40" style={bodyStyle}>{stage}</p>
 <span className="size-2 rounded-full bg-[#ed5b2b]" aria-hidden />
 </div>
 <p className="m-0 mt-8 text-[20px] font-normal leading-[1.2] text-white" style={displayStyle}>{question}</p>
 <div className="mt-7 h-7 border-l border-dashed border-[#ed5b2b]" aria-hidden />
 <p className="m-0 mt-2 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>{need}</p>
 </article>
 ))}
 </div>
 <p className="m-0 mt-6 max-w-[700px] text-[13px] font-light leading-[1.6] text-white/52" style={bodyStyle}>
 The workflow became our research frame: task above, user doubt in the middle, and the design requirement below.
 </p>
 </section>

 <section aria-labelledby="research-findings-v2-title">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>Three key findings</p>
 <h3 id="research-findings-v2-title" className="m-0 mt-3 max-w-[760px] text-[clamp(28px,3.7vw,48px)] font-normal leading-[1.08] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>
 Research signals became product rules.
 </h3>
 <div className="mt-7 grid md:grid-cols-3">
 {researchFindingsV2.map((finding, index) => (
 <article key={finding.label} className={`flex min-h-[440px] flex-col py-7 md:px-7 ${index < 2 ? ' md:border-r' : ''} ${index === 0 ? 'md:pl-0' : ''} ${index === 2 ? 'bg-[#fff0e8]' : ''}`}>
 <div className="flex items-center justify-between">
 <p className="m-0 text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>{String(index + 1).padStart(2, '0')}</p>
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/38" style={bodyStyle}>{finding.label}</p>
 </div>
 <h4 className="m-0 mt-8 text-[clamp(25px,2.8vw,36px)] font-normal leading-[1.08] tracking-[-0.02em] text-[#0a0a0a]" style={displayStyle}>{finding.title}</h4>
 <p className="m-0 mt-5 text-[12px] font-light leading-[1.6] text-[#0a0a0a]/58" style={bodyStyle}>{finding.evidence}</p>
 {index === 2 ? (
 <div className="mt-7">
 <div className="flex justify-between text-[9px] font-light uppercase tracking-[0.1em] text-[#0a0a0a]/38" style={bodyStyle}><span>Automatic</span><span>Approval required</span></div>
 <div className="mt-3 h-1 bg-gradient-to-r from-[#aefd48] via-[#eadfca] to-[#ed5b2b]" aria-hidden />
 <div className="mt-3 flex justify-between text-[9px] font-light text-[#0a0a0a]/45" style={bodyStyle}><span>Recommend</span><span>Submit</span></div>
 </div>
 ) : null}
 <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-2">
 {finding.needs.map((need) => <p key={need} className="m-0 border-l border-[#cccccc] pl-2 text-[10px] font-light leading-[1.4] text-[#0a0a0a]/52" style={bodyStyle}>{need}</p>)}
 </div>
 <p className="m-0 mt-auto pt-5 text-[13px] font-normal leading-[1.45] text-[#ed5b2b]" style={bodyStyle}>
 {finding.implication}
 </p>
 </article>
 ))}
 </div>
 </section>

 <section className="grid gap-8 py-[clamp(48px,7vw,80px)] lg:grid-cols-[180px_1fr]" aria-labelledby="research-conclusion-title">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>Research conclusion</p>
 <h3 id="research-conclusion-title" className="m-0 max-w-[730px] text-[clamp(32px,4.8vw,64px)] font-normal leading-[1.02] tracking-[-0.035em] text-[#0a0a0a]" style={displayStyle}>
 Users did not reject automation. They rejected automation they could not <span className="text-[#ed5b2b]">understand, control, or recover from.</span>
 </h3>
 </section>
 </section>
 );
}

function ChallengeSection() {
 return (
 <section className="flex max-w-[980px] flex-col gap-14 md:gap-20" data-case-nav-label="03 / Challenge">
 <header className="pb-[clamp(48px,7vw,84px)]">
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 03 / Challenge
 </p>
 <h2
 className="m-0 mt-7 max-w-[920px] text-[clamp(42px,6.6vw,88px)] font-normal leading-[0.96] tracking-[-0.045em] text-[#0a0a0a]"
 style={displayStyle}
 >
 The challenge was not whether AI could apply for jobs.
 <br />
 It was whether users would <span className="text-[#ed5b2b]">allow it to.</span>
 </h2>
 <p className="m-0 mt-8 max-w-[850px] text-[clamp(16px,2vw,22px)] font-light leading-[1.55] text-[#0a0a0a]/65" style={bodyStyle}>
 Users wanted less repetitive work—but not at the cost of control, accuracy, or professional identity.
 </p>
 </header>

 <section className="overflow-hidden bg-[#10100f] text-white" aria-labelledby="core-tension-title">
 <div className="grid md:grid-cols-2">
 {[
 ['More automation', 'Move faster', ['Faster applications', 'Less repetitive work', 'More opportunities']],
 ['More control', 'Protect what matters', ['Review important decisions', 'Protect personal information', 'Preserve professional identity']],
 ].map(([label, title, items], index) => (
 <article key={label as string} className={`p-7 md:p-10 ${index === 0 ? ' border-white/16 md:border-r' : ''}`}>
 <p className={`m-0 text-[11px] font-light uppercase tracking-[0.14em] ${index === 0 ? 'text-[#aefd48]' : 'text-[#ed5b2b]'}`} style={bodyStyle}>
 {label as string}
 </p>
 <h3 id={index === 0 ? 'core-tension-title' : undefined} className="m-0 mt-5 text-[clamp(28px,3.5vw,44px)] font-normal leading-[1.05] text-white" style={displayStyle}>
 {title as string}
 </h3>
 <div className="mt-8 space-y-3 text-[14px] font-light text-white/62" style={bodyStyle}>
 {(items as string[]).map((item) => <p key={item} className="m-0">{item}</p>)}
 </div>
 </article>
 ))}
 </div>
 <div className="border-white/16 px-7 py-8 md:px-10">
 <div className="flex items-center justify-between gap-4 text-[10px] font-light uppercase tracking-[0.12em] text-white/40" style={bodyStyle}>
 <span>Manual control</span>
 <span>Full automation</span>
 </div>
 <div className="relative mt-5 h-px bg-white/30" aria-hidden>
 <span className="absolute left-[62%] top-1/2 h-7 w-px -translate-y-1/2 bg-[#ed5b2b]" />
 <span className="absolute left-[62%] top-5 -translate-x-1/2 whitespace-nowrap text-[10px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]">Trust boundary</span>
 </div>
 <p className="m-0 mt-12 max-w-[720px] text-[16px] font-normal leading-[1.55] text-white" style={bodyStyle}>
 Users were open to automation, but their tolerance changed with the risk of each decision.
 </p>
 </div>
 </section>

 <section aria-labelledby="trust-break-title">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>Trust failure map</p>
 <h3 id="trust-break-title" className="m-0 mt-3 text-[clamp(28px,3.7vw,48px)] font-normal leading-[1.08] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>
 Four moments where trust could break
 </h3>
 <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4">
 {trustBreakMoments.map((moment, index) => (
 <article
 key={moment.action}
 className={`min-h-[245px] py-6 sm:px-6 ${index < 3 ? ' sm:border-r' : ''} ${index === 1 ? 'sm:border-r-0 lg:border-r' : ''} ${index >= 2 ? '' : ''} ${index === 0 ? 'sm:pl-0' : ''}`}
 >
 <div className="flex items-center justify-between">
 <span className="text-[11px] font-light text-[#ed5b2b]" style={bodyStyle}>{String(index + 1).padStart(2, '0')}</span>
 <span className="flex size-8 items-center justify-center rounded-full border border-[#cccccc] text-[14px] text-[#0a0a0a]/55" aria-hidden>{['↗', '✎', '→', '·'][index]}</span>
 </div>
 <p className="m-0 mt-8 text-[11px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/42" style={bodyStyle}>{moment.action}</p>
 <h4 className="m-0 mt-3 text-[22px] font-normal leading-[1.12] text-[#0a0a0a]" style={displayStyle}>{moment.risk}</h4>
 <p className="m-0 mt-4 text-[12px] font-light leading-[1.55] text-[#0a0a0a]/58" style={bodyStyle}>{moment.body}</p>
 </article>
 ))}
 </div>
 </section>

 <section className="grid border border-[#cccccc] lg:grid-cols-[0.78fr_1.22fr]" aria-labelledby="reframed-question-title">
 <div className="bg-[#f3f1ea] p-7 lg:p-10">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#0a0a0a]/42" style={bodyStyle}>Original question</p>
 <p className="m-0 mt-7 max-w-[330px] text-[clamp(25px,3vw,38px)] font-normal leading-[1.12] tracking-[-0.02em] text-[#0a0a0a]/56" style={displayStyle}>
 How might we help users complete more applications?
 </p>
 </div>
 <div className="bg-[#fff0e8] p-7 lg:border-l lg:p-10">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>Reframed question</p>
 <h3 id="reframed-question-title" className="m-0 mt-7 max-w-[590px] text-[clamp(29px,3.9vw,50px)] font-normal leading-[1.06] tracking-[-0.03em] text-[#0a0a0a]" style={displayStyle}>
 How might we help users complete relevant applications faster—while preserving <span className="text-[#ed5b2b]">understanding, authorship, and final control?</span>
 </h3>
 </div>
 </section>

 <section aria-labelledby="system-risk-title">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>System risk</p>
 <h3 id="system-risk-title" className="m-0 mt-3 max-w-[760px] text-[clamp(28px,3.7vw,48px)] font-normal leading-[1.08] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>
 Automation without control creates more work, not less.
 </h3>
 <div className="mt-6 grid md:grid-cols-5">
 {automationRiskChain.map((step, index) => (
 <div key={step} className={`relative flex min-h-[105px] items-center gap-4 py-5 md:px-5 ${index < 4 ? ' md:border-r' : ''} ${index === 0 ? 'md:pl-0' : ''}`}>
 <span className="text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>{String(index + 1).padStart(2, '0')}</span>
 <p className={`m-0 text-[14px] font-normal leading-[1.35] ${index === 4 ? 'text-[#ed5b2b]' : 'text-[#0a0a0a]'}`} style={bodyStyle}>{step}</p>
 {index < 4 ? <span className="ml-auto text-[14px] font-light text-[#0a0a0a]/30 md:absolute md:-right-[9px] md:top-1/2 md:z-10 md:-translate-y-1/2 md:bg-white md:px-1" aria-hidden>→</span> : null}
 </div>
 ))}
 </div>
 </section>
 </section>
 );
}

export default function JobnovaAIPlatformPage() {
 return (
 <div className="mei-project-page w-full">
 <CaseStudyControls
 navLabels={[
 '01 / From Problem to Product',
 '02 / Why Auto Apply',
 '03 / Design Strategy',
 '04 / Key Interfaces',
 '05 / Validation + Reflection',
 ]}
 tldrPoints={tldrPoints}
 />
 <CaseStudyHero
 title="JobNova AI Job Search Platform"
 subtitle="Designing a 0–1 AI job-search platform that helps users discover, prepare, submit, and track more relevant applications."
 tags={['0-to-1 AI SaaS', 'Product Strategy', 'UX Research', 'AI Workflow', 'Design System']}
 aboutLabel="About JobNova"
 about={'Most AI job-search products automate individual tasks.\n\nJobNova connects the full application journey—from discovering the right opportunities to preparing materials, submitting intentionally, tracking records, and preparing for interviews.'}
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

 <section className="overflow-x-clip" style={sectionStyle}>
 <div>
 <div className="flex flex-col gap-14 md:gap-20">
 <FocusedCaseSetupSection />

 <div className="hidden max-w-[980px] flex-col gap-14 md:gap-20" aria-hidden="true">
 <header className="grid gap-10 pb-[clamp(48px,7vw,84px)] lg:grid-cols-[minmax(0,1fr)_250px] lg:items-end">
 <div>
 <p className="m-0 text-[12px] font-light uppercase tracking-[0.12em] text-[#ed5b2b]" style={bodyStyle}>
 01 / Problem
 </p>
 <h1
 className="m-0 mt-7 max-w-[790px] text-[clamp(42px,6.6vw,88px)] font-normal leading-[0.96] tracking-[-0.045em] text-[#0a0a0a]"
 style={displayStyle}
 >
 AI job-search tools optimized individual tasks,
 <br />
 <span className="text-[#ed5b2b]">but fragmented the application journey.</span>
 </h1>
 <div className="mt-9 max-w-[720px] space-y-5 text-[15px] font-light leading-[1.7] text-[#0a0a0a]/68" style={bodyStyle}>
 <p className="m-0">
 Most AI job-search products were designed around isolated tasks—job discovery, resume scoring, content generation, auto-apply, or application tracking.
 </p>
 <p className="m-0">
 Each tool improved one moment, but users still had to connect the workflow themselves: moving information across platforms, checking AI outputs, adapting materials, submitting applications, and manually tracking results.
 </p>
 </div>
 </div>
 <aside className="pt-4 lg:border-l lg:pl-6 lg:pt-0">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#0a0a0a]/42" style={bodyStyle}>
 The hidden workload
 </p>
 <p className="m-0 mt-4 text-[15px] font-normal leading-[1.55] text-[#0a0a0a]" style={bodyStyle}>
 One application required users to coordinate multiple disconnected tools.
 </p>
 </aside>
 </header>

 <section className="py-[clamp(48px,8vw,92px)]" aria-labelledby="problem-thesis-title">
 <h2
 id="problem-thesis-title"
 className="m-0 max-w-[940px] text-[clamp(39px,6.5vw,86px)] font-normal leading-[0.95] tracking-[-0.04em] text-[#0a0a0a]"
 style={displayStyle}
 >
 The workflow was <span className="text-[#ed5b2b]">automated in pieces,</span>
 <br />
 but never designed as one experience.
 </h2>
 </section>

 <section aria-labelledby="problem-dimensions-title">
 <div className="mb-6 flex items-end justify-between gap-6">
 <h2 id="problem-dimensions-title" className="m-0 text-[12px] font-light uppercase tracking-[0.14em] text-[#0a0a0a]/48" style={bodyStyle}>
 Where the journey broke
 </h2>
 <p className="m-0 hidden text-[11px] font-light text-[#0a0a0a]/38 sm:block" style={bodyStyle}>
 Three connected failures
 </p>
 </div>
 <div className="grid md:grid-cols-3">
 {problemDimensions.map((problem, index) => (
 <article
 key={problem.title}
 className={`min-h-[280px] py-7 md:px-7 ${index < problemDimensions.length - 1 ? ' md:border-r' : ''} ${index === 0 ? 'md:pl-0' : ''} ${index === 2 ? 'bg-[#fff0e8] md:pr-7' : ''}`}
 >
 <p className="m-0 text-[12px] font-light text-[#ed5b2b]" style={bodyStyle}>
 {String(index + 1).padStart(2, '0')}
 </p>
 <h3 className="m-0 mt-9 max-w-[220px] text-[clamp(24px,2.5vw,34px)] font-normal leading-[1.08] tracking-[-0.02em] text-[#0a0a0a]" style={displayStyle}>
 {problem.title}
 </h3>
 <p className="m-0 mt-5 max-w-[270px] text-[13px] font-light leading-[1.65] text-[#0a0a0a]/65" style={bodyStyle}>
 {problem.body}
 </p>
 </article>
 ))}
 </div>
 </section>

 <figure className="m-0" aria-labelledby="fragmented-journey-title">
 <div className="mb-6">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Fragmented tool map
 </p>
 <h2 id="fragmented-journey-title" className="m-0 mt-3 text-[clamp(27px,3.5vw,44px)] font-normal leading-[1.08] tracking-[-0.025em] text-[#0a0a0a]" style={displayStyle}>
 The tools existed. The continuity did not.
 </h2>
 </div>
 <div className="grid gap-3 md:grid-cols-5" role="list">
 {fragmentedJourney.map((item, index) => (
 <div key={item.stage} className="relative" role="listitem">
 <div className="flex min-h-[220px] flex-col border border-[#cccccc] bg-[#f6f4ee] p-5">
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
 {String(index + 1).padStart(2, '0')}
 </span>
 <span className="text-[9px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/32" style={bodyStyle}>
 New context
 </span>
 </div>
 <h3 className="m-0 mt-7 text-[21px] font-normal text-[#0a0a0a]" style={displayStyle}>
 {item.stage}
 </h3>
 <div className="mt-auto flex flex-col gap-2 pt-4">
 {item.tools.map((tool) => (
 <p key={tool} className="m-0 text-[11px] font-light text-[#0a0a0a]/58" style={bodyStyle}>
 {tool}
 </p>
 ))}
 </div>
 </div>
 {index < fragmentedJourney.length - 1 ? (
 <div className="flex h-3 items-center justify-center md:absolute md:-right-3 md:top-1/2 md:z-10 md:h-auto md:-translate-y-1/2" aria-hidden>
 <span className="block h-px w-2 bg-[#ed5b2b] md:w-3" />
 <span className="mx-0.5 size-1.5 rotate-45 border-r border-[#ed5b2b]" />
 <span className="block h-px w-2 bg-[#ed5b2b] md:w-3" />
 </div>
 ) : null}
 </div>
 ))}
 </div>
 <figcaption className="py-5 text-[14px] font-normal leading-[1.55] text-[#0a0a0a]" style={bodyStyle}>
 Users carried context between tools because the tools could not carry it for them.
 </figcaption>
 </figure>

 <section className="grid gap-8 bg-[#fff0e8] p-[clamp(28px,5vw,56px)] lg:grid-cols-[190px_1fr] lg:items-start" aria-labelledby="design-opportunity-title-v2">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Design Opportunity
 </p>
 <h2 id="design-opportunity-title-v2" className="m-0 max-w-[720px] text-[clamp(31px,4.4vw,58px)] font-normal leading-[1.04] tracking-[-0.03em] text-[#0a0a0a]" style={displayStyle}>
 The opportunity was not to add another AI feature. It was to connect the entire application journey without removing user control.
 </h2>
 </section>
 </div>

 <div className="hidden" aria-hidden="true">
 <p className="m-0 mb-3 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
 1. The Product Thesis
 </p>

 <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
 <p className="m-0 max-w-[700px] text-[clamp(20px,2.35vw,32px)] font-normal leading-[1.32] text-[#0a0a0a]" style={bodyStyle}>
 Most AI job-search products automate individual tasks. JobNova redesigns the entire application workflow—from discovering the right opportunities to completing trustworthy applications.
 </p>
 <div className="flex items-end justify-between pt-4 lg:flex-col lg:items-start lg:gap-5">
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

 <div className="py-[clamp(42px,7vw,82px)]">
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
 <div className="mb-5 flex items-center justify-between pb-3">
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

 <div className="hidden" aria-hidden="true">
 <header className="flex flex-col gap-6 pb-10">
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

 <div className="">
 {marketWorkflowStages.map((item, index) => (
 <div
 key={item.stage}
 className={`relative grid min-h-[112px] items-center gap-5 py-5 sm:grid-cols-[44px_220px_1fr] ${
 index < marketWorkflowStages.length - 1 ? '' : ''
 }`}
 >
 <div className="relative flex h-full min-h-[64px] items-center justify-center">
 <span className="relative z-10 flex size-8 items-center justify-center rounded-full border border-[#cccccc] bg-white text-[10px] font-light text-[#ed5b2b]" style={bodyStyle}>
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
 className="border border-[#cccccc] bg-[#f3f1ea] px-3.5 py-2 text-[12px] font-light text-[#0a0a0a]/68"
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

 <section className="bg-[#10100f] p-6 text-white sm:p-8 lg:p-10" aria-labelledby="jobnova-workflow-title">
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
 <div className="grid sm:grid-cols-4">
 {jobnovaWorkflow.map((step, index) => (
 <div
 key={step}
 className={`relative flex min-h-[104px] items-center justify-between gap-4 py-5 sm:px-5 ${
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

 <section className="py-[clamp(52px,8vw,96px)]" aria-labelledby="design-opportunity-title">
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
 <div className="grid md:grid-cols-3">
 {principles.map((principle, index) => (
 <article
 key={principle.title}
 className={`min-h-[210px] py-6 md:px-6 ${index < principles.length - 1 ? ' md:border-r' : ''} ${index === 0 ? 'md:pl-0' : ''}`}
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

 <div className="hidden max-w-[980px] flex-col gap-12" aria-hidden="true">
 <div className="flex flex-col gap-3">
 <p className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
 2. How We Worked
 </p>
 <h2 className="m-0 text-[22px] font-normal leading-none text-[#0a0a0a]" style={bodyStyle}>
 Design Process
 </h2>
 </div>

 <div>
 <DesktopProcessTimeline />
 <MobileProcessTimeline />
 </div>
 </div>

 {false ? (
 <div className="hidden" aria-hidden="true">
 <ChallengeSection />
 <ResearchSection />
 </div>
 ) : null}

 <div className="hidden" aria-hidden="true">
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

 <div className="hidden" aria-hidden="true">
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
 <div className="grid gap-x-6 gap-y-5 py-5 sm:grid-cols-2 lg:grid-cols-4">
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
 <div className="mt-6 pt-5">
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
 <div className="overflow-hidden border border-[#cccccc]">
 <div
 className="hidden grid-cols-[0.9fr_1.1fr] bg-[#f3f1ea] px-5 py-3 text-[11px] font-light uppercase leading-[17px] text-[#0a0a0a]/55 sm:grid"
 style={bodyStyle}
 >
 <p className="m-0">Initial assumption</p>
 <p className="m-0">What research showed</p>
 </div>
 {reframingRows.map((row, index) => (
 <div
 key={row.before}
 className={`grid gap-2 px-5 py-4 sm:grid-cols-[0.9fr_1.1fr] sm:gap-8 ${
 index < reframingRows.length - 1 ? '' : ''
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
 <div className="grid overflow-hidden border border-[#cccccc] lg:min-h-[286px] lg:grid-cols-[1fr_72px_1fr]">
 <div className="p-7 sm:p-9">
 <p className="m-0 text-[13px] font-normal uppercase leading-[19.5px] text-[#0a0a0a]/45" style={bodyStyle}>
 From
 </p>
 <p className="m-0 mt-8 max-w-[377px] text-[20px] font-light leading-[1.35] text-[#0a0a0a]/72 sm:mt-10 sm:text-[22px]" style={bodyStyle}>
 Help users automatically complete more applications.
 </p>
 </div>
 <div className="flex min-h-14 items-center justify-center text-[18px] text-[#ed5b2b] lg:min-h-0 lg:border-x">
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
 <div className="mt-5 flex flex-col gap-4">
 <div className="max-w-[820px]">
 <p className="m-0 text-[13px] font-light uppercase leading-[19.5px] text-[#ed5b2b]" style={bodyStyle}>
 Core Challenge
 </p>
 <h3 className="m-0 mt-2 text-[19px] font-normal leading-[1.35] text-[#0a0a0a]" style={bodyStyle}>
 More automation increased efficiency, but also increased the cost of losing control.
 </h3>
 </div>
 <div className="grid border border-[#cccccc] lg:grid-cols-[1fr_72px_1fr]">
 <article className="p-6">
 <p className="m-0 text-[12px] font-light uppercase leading-[18px] text-[#ed5b2b]" style={bodyStyle}>
 Too little automation
 </p>
 <ul className="m-0 mt-4 flex list-disc flex-col gap-2 pl-4 text-[13px] font-light leading-[1.55] text-[#0a0a0a]/68" style={bodyStyle}>
 <li>Repetitive work remains with the user</li>
 <li>The product feels like another job board</li>
 <li>AI creates little meaningful time advantage</li>
 </ul>
 </article>
 <div className="flex min-h-14 items-center justify-center text-[18px] text-[#ed5b2b] lg:min-h-0 lg:border-x">
 <span aria-hidden>↔</span>
 </div>
 <article className="p-6">
 <p className="m-0 text-[12px] font-light uppercase leading-[18px] text-[#ed5b2b]" style={bodyStyle}>
 Too much automation
 </p>
 <ul className="m-0 mt-4 flex list-disc flex-col gap-2 pl-4 text-[13px] font-light leading-[1.55] text-[#0a0a0a]/68" style={bodyStyle}>
 <li>Users cannot see what the system applied to</li>
 <li>Incorrect materials can damage trust quickly</li>
 <li>Responsibility becomes unclear when execution fails</li>
 </ul>
 </article>
 </div>
 <p className="m-0 max-w-[820px] text-[14px] font-light leading-[1.6] text-[#0a0a0a]/68" style={bodyStyle}>
 Auto Apply therefore became a decision system combining matching rules, content authorization, execution permission, and traceable outcomes.
 </p>
 </div>
 <blockquote className="m-0 max-w-[820px] border-l border-[#ed5b2b] pl-5 text-[16px] font-normal leading-6 text-[#0a0a0a]" style={bodyStyle}>
 How might we help job seekers complete more relevant applications faster, without losing{' '}
 <span className="text-[#ed5b2b]">trust and control over AI-driven decisions</span>?
 </blockquote>
 </div>
 </div>

 {false ? (
 <div className="hidden" aria-hidden="true">
 <ProductStrategySection />
 </div>
 ) : null}

 <div className="hidden" aria-hidden="true">
 <div className="grid gap-8 pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)] lg:items-end">
 <div>
 <p className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
 5. Defining the MVP
 </p>
 <h2
 className="m-0 mt-5 max-w-[610px] text-[clamp(36px,5vw,66px)] font-normal leading-[0.98] tracking-[-0.035em] text-[#0a0a0a]"
 style={displayStyle}
 >
 Building one complete application journey
 </h2>
 <p className="m-0 mt-6 max-w-[600px] text-[14px] font-light leading-[1.65] text-[#0a0a0a]/66" style={bodyStyle}>
 Early concepts included job alerts, AI resumes, cover letters, automated applications, inbox sync, networking recommendations, interview preparation, and an AI assistant.
 </p>
 <p className="m-0 mt-4 text-[11px] font-light leading-[1.7] text-[#0a0a0a]/38" style={bodyStyle}>
 {earlyMvpScope.join(' · ')}
 </p>
 </div>

 <aside className="border-l border-[#ed5b2b] py-1 pl-6">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 The scope question
 </p>
 <p className="m-0 mt-4 text-[21px] font-normal leading-[1.35] text-[#0a0a0a]" style={bodyStyle}>
 What capabilities must work together for users to complete one relevant, understandable, and controllable application?
 </p>
 </aside>
 </div>

 <section className="flex flex-col gap-5" aria-labelledby="mvp-loop-title">
 <div>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 The Core Workflow
 </p>
 <h3 id="mvp-loop-title" className="m-0 mt-2 text-[20px] font-normal leading-[1.3] text-[#0a0a0a]" style={bodyStyle}>
 We reduced the product to four moments that had to work together.
 </h3>
 </div>

 <div className="grid sm:grid-cols-2 lg:grid-cols-4" aria-label="MVP workflow: match, customize, apply, track">
 {mvpCoreLoop.map((step, index) => (
 <article
 key={step.title}
 className={`relative flex min-h-[292px] flex-col px-5 py-6 ${
 index < mvpCoreLoop.length - 1 ? ' sm:border-r' : ''
 } ${index === 1 ? 'sm:border-r-0 lg:border-r' : ''} ${index >= 2 ? '' : ''} ${
 index === 0 ? 'lg:pl-0' : ''
 }`}
 >
 <div className="flex items-center justify-between">
 <p className="m-0 text-[11px] font-light text-[#ed5b2b]" style={bodyStyle}>
 {String(index + 1).padStart(2, '0')}
 </p>
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.12em] text-[#0a0a0a]/38" style={bodyStyle}>
 {step.action}
 </p>
 </div>
 <h4 className="m-0 mt-8 text-[25px] font-normal leading-none text-[#0a0a0a]" style={displayStyle}>
 {step.title}
 </h4>
 <p className="m-0 mt-4 text-[13px] font-light leading-[1.6] text-[#0a0a0a]/66" style={bodyStyle}>
 {step.body}
 </p>
 <p className="m-0 mt-auto pt-4 text-[11px] font-light leading-[1.45] text-[#ed5b2b]" style={bodyStyle}>
 {step.feature}
 </p>
 {index < mvpCoreLoop.length - 1 ? (
 <span
 className="absolute -right-[10px] top-[72px] z-10 hidden bg-white px-1 text-[15px] font-light text-[#0a0a0a]/38 lg:block"
 aria-hidden
 >
 -&gt;
 </span>
 ) : null}
 </article>
 ))}
 </div>
 </section>

 <section className="grid gap-0 lg:grid-cols-2" aria-label="MVP scope and success criteria">
 <div className="py-7 lg:border-r lg:border-[#cccccc] lg:pr-8">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Included in the MVP
 </p>
 <div className="mt-6 flex flex-col">
 {mvpIncluded.map((item, index) => (
 <article
 key={item.title}
 className={`grid gap-2 py-4 sm:grid-cols-[124px_1fr] ${
 index < mvpIncluded.length - 1 ? ' border-[#e1e1e1]' : ''
 }`}
 >
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.1em] text-[#0a0a0a]/38" style={bodyStyle}>
 {item.group}
 </p>
 <div>
 <h4 className="m-0 text-[14px] font-normal leading-[1.4] text-[#0a0a0a]" style={bodyStyle}>
 {item.title}
 </h4>
 <p className="m-0 mt-1 text-[12px] font-light leading-[1.5] text-[#0a0a0a]/58" style={bodyStyle}>
 {item.body}
 </p>
 </div>
 </article>
 ))}
 </div>
 </div>

 <div className="py-7 lg:pl-8">
 <p className="m-0 text-[11px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 MVP Success Criteria
 </p>
 <p className="m-0 mt-3 text-[13px] font-light leading-[1.6] text-[#0a0a0a]/58" style={bodyStyle}>
 The MVP would be considered successful if a user could:
 </p>
 <div className="mt-6 flex flex-col">
 {successCriteria.map((criterion, index) => (
 <div
 key={criterion}
 className={`flex items-start gap-4 py-4 ${
 index < successCriteria.length - 1 ? ' border-[#e1e1e1]' : ''
 }`}
 >
 <span className="mt-[1px] flex size-5 shrink-0 items-center justify-center rounded-full border border-[#ed5b2b] text-[10px] font-light text-[#ed5b2b]" aria-hidden>
 ✓
 </span>
 <p className="m-0 text-[14px] font-light leading-[1.5] text-[#0a0a0a]/72" style={bodyStyle}>
 {criterion}
 </p>
 </div>
 ))}
 </div>
 </div>
 </section>

 <p className="m-0 max-w-[900px] text-[12px] font-light leading-[1.65] text-[#0a0a0a]/52" style={bodyStyle}>
 <span className="font-normal text-[#0a0a0a]/72">Deferred beyond the MVP:</span>{' '}
 Interview preparation, salary negotiation, long-term career planning, advanced networking, and recruiter-facing products were postponed because they did not determine whether the core application journey could succeed.
 </p>

 <blockquote className="m-0 py-8">
 <p className="m-0 max-w-[900px] text-[clamp(22px,3vw,38px)] font-normal leading-[1.18] tracking-[-0.02em] text-[#0a0a0a]" style={displayStyle}>
 The MVP was not designed to cover the entire career journey. It was designed to validate one complete and trustworthy application experience.
 </p>
 <p className="m-0 mt-5 max-w-[720px] text-[14px] font-light leading-[1.6] text-[#0a0a0a]/58" style={bodyStyle}>
 With the scope defined, I focused on the four moments that most directly shaped user trust and application completion.
 </p>
 </blockquote>
 </div>

 <ConsolidatedWhyAutoApplySection />
 <DesignStrategyThreeDecisionsSection />
 <KeyInterfacesSection />
 <ValidationReflectionSection />

 {false ? (
 <>
 <ProductOpportunitySection />
 <WhyAutoApplySection />
 <UserGoalsTradeoffSection />
 <AutoApplyChallengeSection />
 <CreditDecisionSection />
 <ApplicationReadySection />
 <SubmissionTimingSection />
 <TraceabilitySection />
 <EndToEndApplicationSection />
 <ValidationThroughputSection />
 <FinalAutoApplyModelSection />
 </>
 ) : null}

 <div className="hidden max-w-[980px] flex-col gap-14" aria-hidden="true">
 <div className="flex flex-col gap-4">
 <div className="flex flex-col gap-3">
 <p className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
 Supporting inputs
 </p>
 <h2 className="m-0 text-[22px] font-normal leading-[1.32] text-[#0a0a0a]" style={bodyStyle}>
 Two existing controls fed into the Auto Apply story.
 </h2>
 </div>
 <p className="m-0 max-w-[820px] text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
 Recommendation explainability and AI-assisted editing still mattered, but they became supporting controls inside one larger question:{' '}
 <span className="text-[#ed5b2b]">under what conditions can AI act on the user&apos;s behalf?</span>
 </p>
 </div>

 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-2">
 {[
 [
 'Explainability as authorization input',
 'Match evidence helped users decide whether AI should continue, but it no longer needed a full feature chapter.',
 '/img/jobnova/decision-match-detail.png',
 'JobNova job detail experience explaining match evidence, gaps, and recommendation context.',
 ],
 [
 'Editing controls as permission boundary',
 'Visible resume changes helped define what AI was allowed to change before applying.',
 '/img/jobnova/decision-resume.png',
 'JobNova resume customization interface showing visible AI changes and review controls.',
 ],
 ].map(([title, body, src, alt]) => (
 <article key={title} className="bg-white p-5">
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#ed5b2b]" style={bodyStyle}>
 Supporting principle
 </p>
 <h3 className="m-0 mt-4 text-[20px] font-normal leading-[1.22] text-[#0a0a0a]" style={displayStyle}>
 {title}
 </h3>
 <p className="m-0 mt-3 text-[13px] font-light leading-[1.6] text-[#0a0a0a]/62" style={bodyStyle}>
 {body}
 </p>
 <figure className="m-0 mt-5 max-h-[260px] overflow-hidden bg-[#f3f1ea] p-3">
 <Image
 src={src}
 alt={alt}
 width={1120}
 height={760}
 className="h-auto w-full"
 unoptimized
 />
 </figure>
 </article>
 ))}
 </div>

 <div className="hidden" aria-hidden="true">
 <AutoApplyDesignDecisionSectionV2 />
 </div>

 {false ? (
 <div className="hidden" aria-hidden="true">
 {featureSections.slice(0, 4).map((feature, index) =>
 index === 0 ? (
 <MatchingDesignDecisionSectionV2 key={feature.label} />
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

 <section className="flex w-full flex-col gap-6 py-7">
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

 <div className="grid gap-px overflow-hidden border border-[#cccccc] bg-[#cccccc] md:grid-cols-3">
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
 <article key={group.title} className="border border-[#cccccc] p-5">
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
 className="border border-[#d8d8d8] px-2.5 py-1.5 text-[11px] font-light leading-[17px] text-[#0a0a0a]/66"
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
 className="grid min-w-[900px] grid-cols-5"
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

 <section className="grid w-full gap-6 pt-7 lg:grid-cols-[1fr_280px]">
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
 className="border border-[#cccccc] px-3 py-2 text-[11px] font-light leading-[17px] text-[#0a0a0a]/68"
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
 ) : null}
 </div>

 {false ? (
 <>
 <EdgeCasesSection />
 <SystemDesignSection />
 </>
 ) : null}

 <div className="hidden max-w-[980px] flex-col gap-7" aria-hidden="true">
 <div className="flex flex-col gap-3">
 <p className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
 11. Design to Launch
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
 <div className="grid gap-x-6 gap-y-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
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
 className="border border-[#cccccc] px-3 py-2 text-[12px] font-light leading-[18px] text-[#0a0a0a]/68"
 style={bodyStyle}
 >
 {item}
 </span>
 ))}
 </div>
 </div>

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

 <div className="hidden max-w-[980px] flex-col gap-10" aria-hidden="true">
 <div className="flex flex-col gap-4">
 <div className="flex flex-col gap-3">
 <p className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
 07 / Validation
 </p>
 <h2 className="m-0 max-w-[820px] text-[22px] font-normal leading-[1.32] text-[#0a0a0a]" style={bodyStyle}>
 We validated whether users would adopt automation when its boundaries stayed visible and configurable.
 </h2>
 </div>
 <p className="m-0 max-w-[820px] text-[15px] font-light leading-6 text-[#0a0a0a]/68" style={bodyStyle}>
 The strongest signal was not that the product automated more. It was that users were willing to use automation when they could define permissions, inspect status, and recover from failures.
 </p>
 </div>

 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
 {resultMetrics.filter((metric) => ['Adoption', 'Reliability', 'Speed', 'Outcome'].includes(metric.label)).map((metric) => (
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

 <div className="hidden max-w-[980px] flex-col gap-12" aria-hidden="true">
 <div className="flex items-center justify-between pb-4">
 <p className="m-0 text-[12px] font-light uppercase leading-none text-[#ed5b2b]" style={bodyStyle}>
 14 / Reflection
 </p>
 <p className="m-0 text-[10px] font-light uppercase tracking-[0.14em] text-[#0a0a0a]/36" style={bodyStyle}>
 Closing perspective
 </p>
 </div>

 <blockquote className="m-0 pb-[clamp(42px,7vw,76px)]">
 <p
 className="m-0 max-w-[940px] text-[clamp(38px,6.3vw,82px)] font-normal leading-[0.99] tracking-[-0.04em] text-[#0a0a0a]"
 style={displayStyle}
 >
 Auto Apply created value by acting early on the right opportunities,
 </p>
 <p
 className="m-0 mt-7 max-w-[940px] text-[clamp(30px,5vw,66px)] font-normal leading-[1.02] tracking-[-0.035em] text-[#ed5b2b]"
 style={displayStyle}
 >
 using credits intentionally, and preserving everything users needed afterward.
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
 <div className="grid md:grid-cols-3">
 {reflectionLearnings.map((learning, index) => (
 <article
 key={learning.principle}
 className={`min-h-[250px] py-6 md:px-6 ${
 index < reflectionLearnings.length - 1 ? ' md:border-r' : ''
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
 </section>
 </div>
 );
}
