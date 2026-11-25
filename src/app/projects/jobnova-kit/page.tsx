import type { Metadata } from 'next';
import BeforeAfterSlider from '../def-erp-kit/BeforeAfterSlider';
import { JobnovaDecisions } from './JobnovaDecisions';
import { CompareBars, Heard, ShareGrid } from './JobnovaCharts';
import JobnovaFlow from './JobnovaFlow';
import { FirstVersionMap, FirstVersionProcess } from './JobnovaFirstVersion';
import { AnnotatedShot } from './JobnovaAnnotated';
import ResumeLiveDemo from './ResumeLiveDemo';
import PipelineLiveDemo from './PipelineLiveDemo';
import { resumeDecisions, trackingDecisions } from './iteration';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/case-kit/CaseKitControls';
import { CaseButton } from '../../components/case-kit/CaseButton';
import { CaseChapter, CaseClose, CaseHero, CaseKitPage, CaseKitSections, CaseProse, CaseStats } from '../../components/case-kit/CaseKit';

export const metadata: Metadata = {
  title: 'JobNova — Designing User-Governed AI Applications | Mei Chai',
  description: 'How a founding designer shipped JobNova’s AI job-application journey, then used product data and user feedback to iterate on resume review and application tracking.',
  robots: { index: false, follow: false },
};

const navLabels = ['01 / Context', '02 / The first version', '03 / What we learned', '04 / Resume review: V1', '05 / Resume review: V2', '06 / Tracking: V1', '07 / Tracking: V2', '08 / Results', '09 / Next'];
const IMG = '/img/jobnova/v2';

export default function JobnovaKitPage() {
  return (
    <CaseKitPage>
      <CaseStudyControls showProgress navLabels={navLabels} railKicker="Case study" railTitle="JobNova" />
      <CaseKitSections>
        <div className="case-mobile-back"><CaseStudyBackButton /></div>
        <CaseHero
          eyebrow="Portfolio · AI product design"
          title="JobNova: giving people control over AI job applications"
          intro="As founding designer, I shaped how JobNova’s AI finds jobs, tailors resumes and applies. After launch, data and feedback showed where people got stuck, so I took those two modules through a second iteration: checking the AI’s resume, and following applications."
          meta={[
            { label: 'Company', value: 'Liba Space' },
            { label: 'Year', value: '2025 – 2026' },
            { label: 'Role', value: 'Founding Designer' },
            { label: 'Partners', value: 'Product · ML · full-stack engineering' },
            { label: 'Scope', value: 'Research → AI interaction → delivery' },
          ]}
          action={{ label: 'Visit JobNova', href: 'https://jobnova.ai/' }}
          tags={['Human–AI interaction', 'Product data', 'Design iteration']}
          glance={{ items: [
            { label: 'The problem', body: 'Only 17% opened the resume editor, and people could not tell where their applications stood.' },
            { label: 'The iteration', body: 'Editing moved onto the resume, and tracking became a pipeline where each application shows its step and next action.' },
            { label: 'Impact', body: 'Resume downloads rose from 58% to 74% after the iteration. 2,700+ people use Auto Apply.' },
          ] }}
        />

        <CaseChapter label="01 / Context" title="An AI that finds jobs, tailors the resume, and applies.">
          <CaseProse><p>JobNova matches people to jobs, rewrites their resume for each one, and can apply for them. At every step the person keeps a say in what the AI does.</p></CaseProse>
          <JobnovaFlow />
        </CaseChapter>

        <CaseChapter label="02 / The first version" title="Designed from research, shipped as one journey.">
          <CaseProse><p>I took the first version from interviews to release with product, ML and full-stack engineers. It joined four modules on one shared profile, and let people set how far the AI may act.</p></CaseProse>
          <FirstVersionProcess />
          <FirstVersionMap />
        </CaseChapter>

        <CaseChapter label="03 / What we learned" title="After launch, two modules lost people.">
          <CaseProse><p>JobNova has many modules. Usage data and feedback kept pointing at two of them: checking the AI’s resume, and following applications. The rest of this case follows those two from V1 to V2.</p></CaseProse>
          <div className="grid min-w-0 gap-[var(--case-space-24)] md:grid-cols-2">
            <CompareBars title="Resume review in V1" rows={[
              { label: 'Opened the Editor tab', value: 17, tone: 'before' },
              { label: 'Downloaded the tailored resume', value: 58, tone: 'before' },
            ]} note="Most people never opened the editor, and many left without the resume." />
            <ShareGrid value={4.1} headline="4.1%" label="of ~40k applications led to an interview invite" note="So the applications that need the person, and the few invites, have to stand out." />
          </div>
        </CaseChapter>

        <CaseChapter label="04 / Resume review: V1" title="People could see the AI’s changes, but not work with them.">
          <AnnotatedShot src={`${IMG}/resume-before-overview.webp`} width={2400} height={1500}
            alt="V1 tailored resume drawer: Overview and Editor tabs, a score ring, three changes all titled Summary Enhanced, and highlighted resume text."
            pins={[
              { x: 38.5, y: 14, title: 'Editing hid in a second tab', note: 'Only 17% opened it.' },
              { x: 12.5, y: 20.5, title: 'A score with no reason', note: 'It showed the resume improved, not what this job still needed.' },
              { x: 39, y: 50.5, title: 'Three changes, one name', note: 'All three were “Summary Enhanced”.' },
              { x: 41, y: 61, title: 'Highlights you could only look at', note: 'To fix a line, people had to find it again in the Editor tab.' },
            ]} />
          <Heard title="What people told us" items={[
            'They could not tell whether the editor held their base profile.',
            'Editing did not feel direct.',
            'They wanted to see the real gaps, such as missing ATS keywords.',
          ]} />
          <CaseProse><p><strong>Goal for V2:</strong> let people check and fix the AI’s work where they read it, and show what still stands between the resume and the job.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="05 / Resume review: V2" title="Edit the resume where you read it.">
          <BeforeAfterSlider
            beforeSrc={`${IMG}/resume-before-overview.webp`}
            beforeAlt="V1: Overview and Editor tabs, a score with no reason, and three changes all titled Summary Enhanced."
            beforeLabel="V1"
            afterSrc={`${IMG}/resume-after.webp`}
            afterAlt="V2: no Editor tab; score, ATS keywords and named changes beside a resume edited in place."
            afterLabel="V2"
            aspectRatio={1.6}
          />
          <JobnovaDecisions items={resumeDecisions} start={1} />
          <ResumeLiveDemo />
          <CompareBars title="Downloads of the tailored resume" rows={[
            { label: 'V1', value: 58, tone: 'before' },
            { label: 'V2', value: 74, tone: 'after' },
          ]} note="V2: the first 40+ days after launch, to June 2026." />
        </CaseChapter>

        <CaseChapter label="06 / Tracking: V1" title="People could not tell where their applications stood.">
          <AnnotatedShot src={`${IMG}/tracking-before.webp`} width={2400} height={1500}
            alt="V1 applications page: totals, a funnel, tabs for Queued, In process, Submitted and Failed, large job cards, and a live activity list."
            pins={[
              { x: 17, y: 44, title: 'Tabs by system state', note: 'Queued, In process, Submitted, Failed. Interviews and offers had no place.' },
              { x: 56.5, y: 44, title: 'Failed, with no reason', note: 'Only a count.' },
              { x: 52.5, y: 55, title: 'Cards describe the job, not the application', note: 'No step or next action, and two applications fill the screen.' },
              { x: 89, y: 32.5, title: 'System words for status', note: '“In-process”, “Queued”, “Submitted”, with no detail behind them.' },
              { x: 39.5, y: 4, title: 'Interview invites in a separate Inbox', note: 'A tab away from the applications they belong to.' },
            ]} />
          <Heard title="What people told us" items={[
            'They could not tell which step an application had reached.',
            'Failures gave no reason.',
            'Interview invites got missed.',
            'The statuses were hard to understand.',
          ]} />
          <CaseStats items={[
            { value: '1–3×', label: 'Times a day people check their applications' },
            { value: '2', label: 'Main causes of failed applications: a missing answer, or a human check' },
          ]} />
          <CaseProse><p><strong>Goal for V2:</strong> show every application’s stage at a glance, say what each one is doing, and when one needs the person, say exactly what and keep everything prepared.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="07 / Tracking: V2" title="Every application on one pipeline, with a reason and a next step.">
          <BeforeAfterSlider
            beforeSrc={`${IMG}/tracking-before.webp`}
            beforeAlt="V1: tabs for Queued, In process, Submitted and Failed, with large job cards."
            beforeLabel="V1"
            afterSrc={`${IMG}/tracking-after.webp`}
            afterAlt="V2: overview above a pipeline whose cards name their step or next action."
            afterLabel="V2"
            aspectRatio={1.6}
          />
          <JobnovaDecisions items={trackingDecisions} start={resumeDecisions.length + 1} />
          <PipelineLiveDemo />
        </CaseChapter>

        <CaseChapter label="08 / Results" title="People now finish what the AI starts.">
          <CaseStats items={[
            { value: '58% → 74%', label: 'Tailored resumes downloaded, V1 to V2' },
            { value: '73% → 96%', label: 'Onboarding completion, one-week A/B test with 100+ users' },
            { value: '2,700+', label: 'People using Auto Apply, about 1,300 of them paying' },
            { value: '~40k', label: 'Applications submitted by June 2026' },
          ]} />
          <CaseProse><p>Tracking V2 has shipped, but it is not yet measured.</p></CaseProse>
        </CaseChapter>

        <CaseClose label="09 / Next" title="Measure tracking V2, then pick the next module.">
          <CaseProse>
            <p>For tracking V2, I would measure how many failed applications people recover, and whether fewer interview invites go unanswered. Then the same loop picks the next module: watch the data, hear people out, and iterate where they get stuck.</p>
            <p><strong>What I’d take forward:</strong> put the AI’s edits where people read them; name the step, not the system state; and when automation stops, keep what it made and ask only for what it needs.</p>
          </CaseProse>
          <div><CaseButton href="https://jobnova.ai/" target="_blank" rel="noopener noreferrer">Visit JobNova</CaseButton></div>
        </CaseClose>
      </CaseKitSections>
    </CaseKitPage>
  );
}
