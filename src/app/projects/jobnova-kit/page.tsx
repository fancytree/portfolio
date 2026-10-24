import type { Metadata } from 'next';
import Image from 'next/image';
import { ChartNoAxesCombined, ClipboardCheck, Compass, FilePenLine, GitBranch, Layers3, ListChecks, MessageSquareText, ScanSearch, ShieldCheck, SlidersHorizontal, UserRoundCheck, Users, Waypoints } from 'lucide-react';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import { CaseKitControls as CaseStudyControls } from '../../components/CaseStudyControls';
import { CaseButton } from '../../components/case-kit/CaseButton';
import { CaseChapter, CaseClose, CaseEvidenceCards, CaseFigure, CaseHero, CaseKitPage, CaseKitSections, CaseProse, CasePullquote, CaseStats, CaseVideo } from '../../components/case-kit/CaseKit';

export const metadata: Metadata = {
  title: 'JobNova — Designing User-Governed AI Applications | Mei Chai',
  description: 'A founding designer’s decisions behind explainable matching, reviewable AI resumes, controlled Auto Apply, and traceable application states.',
  robots: { index: false, follow: false },
};

const navLabels = ['01 / My role', '02 / Research & reframing', '03 / Workflow strategy', '04 / Explain the fit', '05 / Review the changes', '06 / Govern the action', '07 / Follow the outcome', '08 / System & delivery', '09 / Results', '10 / Reflection'];
const imageSizes = '(min-width: 1280px) 1120px, 100vw';

function Screenshot({ src, alt, width, height, caption }: { src: string; alt: string; width: number; height: number; caption: string }) {
  return <CaseFigure caption={caption}>
      <Image src={src} alt={alt} width={width} height={height} sizes={imageSizes} />
    </CaseFigure>;
}

export default function JobnovaKitPage() {
  return (
    <CaseKitPage>
      <CaseStudyControls navLabels={navLabels} railKicker="Case study · new draft" railTitle="JobNova" />
      <CaseKitSections>
        <div className="case-mobile-back"><CaseStudyBackButton /></div>
        <CaseHero
          eyebrow="Portfolio · AI product design · New narrative draft"
          title="JobNova: giving people control over AI job applications"
          intro="As founding designer, I shaped a connected job-search experience where AI explains a match, helps revise a resume, and applies within boundaries the job seeker chooses."
          meta={[
            { label: 'Company', value: 'Nova AI' },
            { label: 'Year', value: '2025 – ongoing' },
            { label: 'Role', value: 'Founding Designer' },
            { label: 'Partners', value: 'Product · ML · full-stack engineering' },
            { label: 'Scope', value: 'Research → AI interaction → delivery' },
          ]}
          action={{ label: 'Visit JobNova', href: 'https://jobnova.ai/' }}
          tags={['0-to-1 product strategy', 'Human–AI interaction', 'Design systems']}
          glance={{ items: [
            { label: 'The problem', body: 'Matching and generation still left people judging, checking, submitting, and tracking each application.' },
            { label: 'My contribution', body: 'Connect the journey and define what AI explains, what people review, and when automation may act.' },
            { label: 'Early signal', body: '1,240 registered users and 8,700+ completed applications in the historical report. Current figures are awaiting a refresh.' },
          ] }}
        />

        <CaseChapter label="01 / My role" title="I owned the decisions between a recommendation and an action.">
          <CaseProse><p>JobNova helps job seekers evaluate roles, tailor materials, and manage applications in one place. I worked with product and engineering from discovery through interaction design, the UI system, and release review.</p></CaseProse>
          <Screenshot src="/img/jobnova/evidence/matched-jobs.webp" width={2400} height={1501} alt="JobNova matched jobs workspace with fit scores, role details, and Auto Apply activity" caption="The connected workspace · Job discovery and application activity share one context. Interface numbers are demonstration content, not outcome metrics." />
          <CaseEvidenceCards label="My responsibilities and their deliverables" items={[
            { icon: <Compass />, title: 'Product direction', body: 'Use research and the application journey to shape scope with the founder.' },
            { icon: <ShieldCheck />, title: 'AI interaction', body: 'Define explanations, review points, permissions, and recovery states.' },
            { icon: <Layers3 />, title: 'System & delivery', body: 'Create reusable patterns and review interface and output states with engineers.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="02 / Research & reframing" title="Faster individual tasks still left a fragmented journey.">
          <CaseProse><p>I used 20+ interviews and journey mapping to examine where people spent effort and where they wanted AI to stop. The research synthesis pointed to three connected needs.</p></CaseProse>
          <CaseEvidenceCards label="Research themes and design implications" items={[
            { icon: <ScanSearch />, title: 'Judge relevance', body: 'Help people understand why a role deserves attention before tailoring an application.' },
            { icon: <FilePenLine />, title: 'Check AI work', body: 'Make generated changes visible so the user can verify their professional story.' },
            { icon: <UserRoundCheck />, title: 'Choose control', body: 'Support different review needs before AI submits something in the user’s name.' },
          ]} />
          <CasePullquote>I reframed the product around completing relevant applications with a level of control the user chooses.</CasePullquote>
          <CaseStats items={[
            { value: '263', label: 'New users in the historical 30-day cohort' },
            { value: '179', label: 'Uploaded a resume and set preferences' },
            { value: '51', label: 'Enabled Auto Apply' },
          ]} />
          <CaseProse><p>The same cohort leaves a concrete design question: 84 people did not finish setup. The funnel locates the gap; it does not explain why they left. Anonymized research notes and step-level drop-off data are still needed.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="03 / Workflow strategy" title="One application journey. Four different AI responsibilities.">
          <CaseProse><p>I connected matching, customization, application, and tracking. At each handoff, I defined the information AI supplies and the decision that remains with the person.</p></CaseProse>
          <CaseEvidenceCards label="The human and AI responsibilities across the workflow" layout="pairs" items={[
            { icon: <ScanSearch />, title: '01 · Explain', body: 'AI surfaces fit and gaps. The person decides which opportunity is worth pursuing.' },
            { icon: <FilePenLine />, title: '02 · Collaborate', body: 'AI proposes resume changes. The person can inspect and edit the content.' },
            { icon: <SlidersHorizontal />, title: '03 · Act within rules', body: 'AI applies under selected criteria, materials, and approval settings.' },
            { icon: <ListChecks />, title: '04 · Account for it', body: 'The product exposes progress, submitted materials, and what needs attention.' },
          ]} />
          <CaseProse><p>This made the design problem specific: reduce repetitive work while keeping consequential actions understandable and reviewable.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="04 / Explain the fit" title="Use a score to scan. Use evidence to decide.">
          <CaseProse><p>I separated quick prioritization from deeper evaluation: a compact job list leads into fit details and a contextual Agent. The detail view connects strengths and gaps to a possible next step.</p></CaseProse>
          <Screenshot src="/img/jobnova/evidence/match-reasoning.webp" width={2400} height={2020} alt="Job detail showing fit dimensions, resume improvement cues, and an Agent explanation alongside the role" caption="Explainable matching · Fit dimensions and contextual reasoning sit beside the role. The score represents product matching, not a measured probability of getting hired." />
          <CaseProse><p><strong>The tradeoff:</strong> putting every explanation on the list adds reading before users know which role matters. I kept the scan view compact and moved the reasoning into details.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="05 / Review the changes" title="AI can rewrite the resume. The user stays its author.">
          <CaseProse><p>I designed two review levels: an overview of what changed, followed by section-level editing. This lets people check the output and correct their story before using it.</p></CaseProse>
          <CaseVideo src="/videos/jobnova/resume-review.mp4" poster="/videos/jobnova/resume-review.webp" width={1280} height={904} label="Recorded JobNova resume generation and editing walkthrough" caption="Recorded product walkthrough · Generate a tailored resume, inspect changes, and move into editing. The recording demonstrates the interaction; it is not a timed usability test." />
          <Screenshot src="/img/jobnova/evidence/resume-overview-editor.webp" width={2400} height={944} alt="Resume overview with change summaries beside the section editor and highlighted document preview" caption="Overview → editor · Change summaries support initial review; editable sections support precise corrections. Preview content is sample copy." />
          <CaseProse><p><strong>The tradeoff:</strong> a finished document hides the work needed to verify it. I exposed changes and editing controls rather than treating generation as completion.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="06 / Govern the action" title="Automation needs permissions that people can understand.">
          <CaseProse><p>I organized Auto Apply into matching criteria, autonomy, materials, and notifications. A person can decide which roles qualify, whether approval is needed, and which documents the system may send.</p></CaseProse>
          <Screenshot src="/img/jobnova/evidence/auto-apply-rules.webp" width={2400} height={1462} alt="Auto Apply settings with match strategies, three approval modes, material controls, and notification settings" caption="The permission model · Immediate submission, a review window, and explicit approval are different commitments. Match thresholds shown here are configuration values, not performance results." />
          <CaseEvidenceCards label="The design boundaries in Auto Apply" items={[
            { icon: <ScanSearch />, title: 'Which opportunities?', body: 'Matching strategy and job preferences bound the roles automation can pursue.' },
            { icon: <UserRoundCheck />, title: 'When can it submit?', body: 'Approval modes make the point of human intervention explicit.' },
            { icon: <ClipboardCheck />, title: 'What can it send?', body: 'Resume and cover-letter choices define the materials used on the person’s behalf.' },
          ]} />
          <CaseProse><p><strong>The tradeoff:</strong> granular controls add setup effort. I grouped them into understandable decisions; setup completion and later rule changes are the measures needed to evaluate that balance.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="07 / Follow the outcome" title="The system must stay legible after the person steps away.">
          <CaseProse><p>I connected application progress, submitted material versions, and replies to the application record. Queueing, submitting, waiting for approval, and failure need different feedback and next actions.</p></CaseProse>
          <CaseVideo src="/videos/jobnova/application-tracking.mp4" poster="/videos/jobnova/application-tracking.webp" width={1280} height={904} label="Recorded JobNova application dashboard and detail walkthrough" caption="Recorded product walkthrough · Follow application status and open the application detail. Screen counts and messages are demonstration content." />
          <CaseEvidenceCards label="The states I designed for the automation handoff" items={[
            { icon: <Waypoints />, title: 'In progress', body: 'Distinguish queued work from active submission so waiting has a clear meaning.' },
            { icon: <UserRoundCheck />, title: 'Needs a person', body: 'Separate pending approval and manual steps from unattended execution.' },
            { icon: <GitBranch />, title: 'Failed or completed', body: 'Make recovery needs visible and preserve a record of what was sent.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="08 / System & delivery" title="I designed a shared language for AI behavior and product UI.">
          <CaseProse><p>I brought matching, review, and application states into reusable patterns. With ML and full-stack engineers, I reviewed output quality, UI states, and recovery paths through handoff and release QA.</p></CaseProse>
          <div className="grid min-w-0 gap-[var(--case-space-24)] md:grid-cols-2">
            <Screenshot src="/img/jobnova/evidence/system-foundations.webp" width={2200} height={2079} alt="JobNova design system with colors, typography, spacing, controls, and navigation components" caption="Visual foundations · A shared component vocabulary across discovery, generation, and application." />
            <Screenshot src="/img/jobnova/evidence/application-states.webp" width={2200} height={2166} alt="Variants of the JobNova application card for different execution and review states" caption="Behavior in the system · Card variants carry status, explanation, and available actions together." />
          </div>
          <CaseProse><p><strong>Delivery evidence to add:</strong> one annotated handoff or QA example showing an issue I identified, the decision made with engineering, and the final change.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="09 / Results" title="Early adoption, with an activation gap worth investigating.">
          <CaseProse><p>Historical data snapshot · These figures come from the existing project report. Reporting dates and current values are pending a refresh with engineering; the totals and 30-day cohort below have different scopes.</p></CaseProse>
          <CaseStats items={[
            { value: '1,240', label: 'Registered users · reported total' },
            { value: '8,700+', label: 'Completed applications · reported total' },
            { value: '68.06%', label: 'Setup completion · 179 of 263 new users / 30 days' },
            { value: '19.39%', label: 'Auto Apply activation · 51 of 263 new users / 30 days' },
          ]} />
          <CaseProse><p>Among the 179 people who completed setup, 28.5% enabled Auto Apply. This points to a second handoff to investigate: moving from a completed profile to granting automation permission.</p></CaseProse>
          <CaseEvidenceCards label="Evidence still needed to evaluate impact" layout="pairs" items={[
            { icon: <Users />, title: 'Current reach · to add', body: 'Refresh registered and active users, audience segments, and the reporting date.' },
            { icon: <ClipboardCheck />, title: 'Design impact · to add', body: 'Compare setup and first-application completion before and after a dated release.' },
            { icon: <ShieldCheck />, title: 'Trust & quality · to add', body: 'Connect approval choices and unwanted applications to verified user feedback.' },
            { icon: <ChartNoAxesCombined />, title: 'Growth & retention · to add', body: 'Add monthly growth, acquisition channels, retained cohorts, and paid conversion.' },
          ]} />
          <CaseProse><p>These figures establish scale and adoption; they do not isolate the effect of design. Growth comparisons need the acquisition mix, concurrent releases, and job-market seasonality alongside a consistent cohort.</p></CaseProse>
        </CaseChapter>

        <CaseClose label="10 / Reflection" title="The next iteration starts with the handoff people hesitate to complete.">
          <CaseProse><p>The core design contribution is the relationship between explanation, review, permission, and feedback. To choose the next iteration, I would locate the largest drop-off between setup, first application, and continued use, then examine the corresponding interaction.</p></CaseProse>
          <CaseEvidenceCards label="Questions for the next design iteration" items={[
            { icon: <SlidersHorizontal />, title: 'Is setup too demanding?', body: 'Compare setup completion and abandonment by step before simplifying the controls.' },
            { icon: <MessageSquareText />, title: 'Does review build confidence?', body: 'Pair approval behavior and rule changes with feedback about unwanted applications.' },
          ]} />
          <div><CaseButton href="https://jobnova.ai/" target="_blank" rel="noopener noreferrer">Visit JobNova</CaseButton></div>
        </CaseClose>
      </CaseKitSections>
    </CaseKitPage>
  );
}
