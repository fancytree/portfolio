import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRightLeft, Blocks, BriefcaseBusiness, ClipboardCheck, Compass, FolderKanban, Layers3, ListFilter, MessageSquareText, PanelLeft, ScanSearch, SlidersHorizontal, Users, Waypoints } from 'lucide-react';
import { CaseKitBackButton as CaseStudyBackButton } from '../../components/CaseStudyBackButton';
import { CaseKitControls as CaseStudyControls } from '../../components/CaseStudyControls';
import { CaseButton } from '../../components/case-kit/CaseButton';
import { CaseChapter, CaseClose, CaseEvidenceCards, CaseFigure, CaseHero, CaseInteractivePreview, CaseKitPage, CaseKitSections, CaseProse, CasePullquote, CaseVideo } from '../../components/case-kit/CaseKit';

export const metadata: Metadata = {
  title: 'ConnectNova — From AI Ranking to a Reusable Workspace | Mei Chai',
  description: 'A founding designer’s product model, information architecture, and AI evaluation decisions across a sourcing extension, Project workspace, and outreach sequences.',
  robots: { index: false, follow: false },
};

const navLabels = ['01 / My role', '02 / Reframe the brief', '03 / Capture in context', '04 / Design the evaluation', '05 / Compare in one place', '06 / Continue into outreach', '07 / System & delivery', '08 / Results & evidence', '09 / Reflection'];
const imageSizes = '(min-width: 1280px) 1120px, 100vw';

function Screenshot({ src, alt, width, height, caption }: { src: string; alt: string; width: number; height: number; caption: string }) {
  return <CaseFigure caption={caption}>
    <Image src={src} alt={alt} width={width} height={height} sizes={imageSizes} />
  </CaseFigure>;
}

export default function ConnectnovaKitPage() {
  return <CaseKitPage>
    <CaseStudyControls navLabels={navLabels} railKicker="Case study · new draft" railTitle="ConnectNova" />
    <CaseKitSections>
      <div className="case-mobile-back"><CaseStudyBackButton /></div>
      <CaseHero
        eyebrow="Portfolio · B2B AI product design · New narrative draft"
        title="ConnectNova: turning AI ranking into a reusable sourcing workspace"
        intro="As founding product designer, I introduced Project as the context connecting collection, evaluation, comparison, and outreach across a Chrome extension and web platform."
        meta={[
          { label: 'Company', value: 'Nova AI' },
          { label: 'Year', value: '2026 – present' },
          { label: 'Role', value: 'Founding Product Designer' },
          { label: 'Partners', value: 'Founder · engineering team' },
          { label: 'Surfaces', value: 'Chrome extension · web platform' },
          { label: 'Status', value: 'Collection, evaluation & outreach live' },
        ]}
        action={{ label: 'Visit ConnectNova', href: 'https://connectnova.ai/' }}
        tags={['Product definition', 'Information architecture', 'AI evaluation design']}
        glance={{ items: [
          { label: 'The brief', body: 'Collect LinkedIn profiles and produce an AI-ranked shortlist.' },
          { label: 'My decision', body: 'Preserve the sourcing goal, people, criteria, and rankings inside a reusable Project.' },
          { label: 'Delivered scope', body: 'Collection → Project → AI evaluation → Outreach / Sequence. Impact metrics remain to be verified.' },
        ] }}
      />

      <CaseChapter label="01 / My role" title="I shaped the product model and the work around the AI result.">
        <CaseProse><p>ConnectNova helps recruiters and sales teams collect people from LinkedIn, evaluate them against a goal, and continue into outreach. I led product strategy, information architecture, interaction design, and shared UI foundations with the founder and engineers.</p></CaseProse>
        <Screenshot src="/img/connectnova/evidence/platform.webp" width={2400} height={1359} alt="ConnectNova platform dashboard connecting Projects, ranked people, campaigns, and outreach activity" caption="The connected platform · Projects and campaigns give the work a place to continue. Dashboard figures are interface examples, not business results." />
        <CaseEvidenceCards label="My contribution and the evidence in this case" items={[
          { icon: <Compass />, title: 'Define the product', body: 'Turn a ranking request into a persistent model for recurring sourcing work.' },
          { icon: <SlidersHorizontal />, title: 'Design AI evaluation', body: 'Expose the brief, criteria, importance, and reasoning people need to inspect a ranking.' },
          { icon: <Layers3 />, title: 'Connect the surfaces', body: 'Carry the same Project context through the extension, review workspace, and outreach.' },
        ]} />
      </CaseChapter>

      <CaseChapter label="02 / Reframe the brief" title="The same profile has a different meaning in a different Project.">
        <CaseProse><p>The initial request ended at a ranked list. The workflow continued across roles, clients, goals, and search sessions. I introduced Project to keep each person attached to the context used to evaluate them.</p></CaseProse>
        <CaseEvidenceCards label="The persistent information model I introduced" layout="pairs" items={[
          { icon: <FolderKanban />, title: 'Project · the purpose', body: 'Keep the hiring brief or prospecting goal available across sessions.' },
          { icon: <Users />, title: 'People · the working pool', body: 'Collect and organize profiles under that purpose, rather than in isolated search results.' },
          { icon: <ListFilter />, title: 'Criteria · the comparison', body: 'Make the requirements behind an evaluation explicit and reusable.' },
          { icon: <Waypoints />, title: 'Ranking · the next decision', body: 'Review people in context and carry selected profiles into the next action.' },
        ]} />
        <CasePullquote>I made the sourcing goal the organizing unit of the product.</CasePullquote>
        <CaseProse><p>Recruiting and sales could share this model while using different briefs and criteria. <strong>Evidence to add:</strong> the original brief, an anonymized workflow or user excerpt, and an alternative model I considered.</p></CaseProse>
      </CaseChapter>

      <CaseChapter label="03 / Capture in context" title="Establish the destination before collecting the profiles.">
        <CaseProse><p>I placed new or existing Project selection inside the extension. Collection settings, progress, and completion feedback keep people oriented while they work on LinkedIn.</p></CaseProse>
        <div className="grid min-w-0 gap-[var(--case-space-24)] md:grid-cols-3">
          <Screenshot src="/img/connectnova/evidence/collect-context.webp" width={816} height={1674} alt="ConnectNova extension with new or existing Project selection and collection controls" caption="01 · Choose the context and collection scope." />
          <Screenshot src="/img/connectnova/evidence/collect-progress.webp" width={504} height={1026} alt="Collection progress showing processed profiles and a pause collection action" caption="02 · Show progress and a way to pause." />
          <Screenshot src="/img/connectnova/evidence/collect-complete.webp" width={660} height={1026} alt="Collection completion with profile review, save feedback, and a path to ranking" caption="03 · Confirm completion and the next step. Counts are sample content." />
        </div>
        <CaseProse><p><strong>The tradeoff:</strong> choosing a destination adds an early decision. It also prevents an unlabelled collection from becoming another list to organize later.</p></CaseProse>
      </CaseChapter>

      <CaseChapter label="04 / Design the evaluation" title="Turn a natural-language brief into criteria people can inspect.">
        <CaseProse><p>I made evaluation a visible step before ranking. Users can review generated criteria, distinguish required from optional requirements, and edit their relative importance.</p></CaseProse>
        <Screenshot src="/img/connectnova/evidence/criteria-preview.webp" width={710} height={276} alt="Generated evaluation criteria with required and optional requirements, relative weights, and an Edit action" caption="The evaluation contract · The product exposes what will be assessed before returning the ranking. The values shown are configuration examples." />
        <CaseProse><h3>Make relative importance visible while editing.</h3><p>I explored three controls. The design record favors sliders inside the existing card structure, combining direct adjustment with a visual sense of proportion.</p></CaseProse>
        <div className="grid min-w-0 gap-[var(--case-space-24)] md:grid-cols-3">
          <Screenshot src="/img/connectnova/evidence/criteria-option-1.webp" width={501} height={268} alt="First weight editor exploration with sliders and automatic balancing" caption="Option 1 · Sliders and auto-balance, with a different editing structure." />
          <Screenshot src="/img/connectnova/evidence/criteria-option-2.webp" width={504} height={268} alt="Second weight editor exploration using direct numeric values" caption="Option 2 · Direct numbers make proportions harder to compare visually." />
          <Screenshot src="/img/connectnova/evidence/criteria-option-3.webp" width={496} height={268} alt="Selected visual direction with sliders within editable criterion cards" caption="Chosen direction · Sliders retain the card structure. These are exploration snapshots." />
        </div>
        <CaseProse><p><strong>Validation to document:</strong> the exploration includes an over-total weight state. Add the shipped validation behavior and a test of whether people understand how their edits change the evaluation.</p></CaseProse>
      </CaseChapter>

      <CaseChapter label="05 / Compare in one place" title="Keep the brief, the ranking, and the person in the same context.">
        <CaseProse><p>I combined the ranked list, evaluation context, and profile detail in a Project workspace. Information architecture and progressive disclosure let people scan the list, then inspect an assessment without rebuilding the sourcing context.</p></CaseProse>
        <CaseEvidenceCards label="The navigation decision" layout="pairs" items={[
          { icon: <ArrowRightLeft />, title: 'Earlier structure', body: 'Project list → profile list → profile detail. Comparison required moving between separate levels.' },
          { icon: <PanelLeft />, title: 'Workspace direction', body: 'Project list → Project workspace. Keep the list and its evaluation context available during detail review.' },
        ]} />
        <CaseVideo src="/videos/connectnova/source-to-review.mp4" poster="/videos/connectnova/source-to-review.webp" width={1920} height={1080} controls label="ConnectNova Version 1 collection and Project review recording with audio" caption="Version 1 · Collection, Projects, criteria, and ranked review (60-second excerpt). Starts muted; use the player controls to enable sound, pause, or seek." />
        <CaseProse><p><strong>The tradeoff:</strong> a shared workspace concentrates information. I used summary and detail layers to keep profile inspection available without making every result equally dense.</p></CaseProse>
      </CaseChapter>

      <CaseChapter label="06 / Continue into outreach" title="The selected people should keep their context when the work continues.">
        <CaseProse><p>I extended the model into Campaigns, Leads, and Sequences so prioritized people could move toward outreach. The flow makes actions, delays, and acceptance conditions explicit.</p></CaseProse>
        <CaseFigure caption="The design map · Project results feed campaign leads; sequence structure and campaign activity organize the work that follows. Scroll horizontally on smaller screens to inspect the map.">
          <div className="case-diagram-scroll" tabIndex={0} role="region" aria-label="ConnectNova outreach architecture; scroll horizontally on small screens">
            <Image src="/img/connectnova/evidence/outreach-map.webp" width={2400} height={1357} sizes={imageSizes} alt="Design workflow connecting ranked Project results to campaign leads, sequences, activities, and statistics" />
          </div>
        </CaseFigure>
        <CaseFigure caption="Interactive Sequence demo · Explore branching, timing, and execution feedback here. The sample flow and counters are demonstration data; no outreach is sent.">
          <CaseInteractivePreview src="/demos/connectnova-sequence?mode=workflow&embedded=1" title="ConnectNova interactive Sequence builder" layout="canvas" />
        </CaseFigure>
        <CaseProse><p>The collection, Project, AI evaluation, Outreach, and Sequence modules are live. The demonstration above runs separately from production and sends no outreach.</p></CaseProse>
      </CaseChapter>

      <CaseChapter label="07 / System & delivery" title="Give the extension and web platform a shared interaction language.">
        <CaseProse><p>I used Figma Variables, reusable components, and shared visual rules across the two surfaces. The design work included the transitions between setup, progress, editing, completion, and the next action.</p></CaseProse>
        <CaseEvidenceCards label="How the design decisions reached implementation" items={[
          { icon: <Blocks />, title: 'Reusable patterns', body: 'Project selection, criteria cards, profile summaries, and action states follow shared rules.' },
          { icon: <BriefcaseBusiness />, title: 'One model, two jobs', body: 'Recruiting and sales use different language while preserving the same Project structure.' },
          { icon: <ClipboardCheck />, title: 'Delivery evidence · to add', body: 'Show one handoff or QA issue, the engineering constraint, and the resulting design change.' },
        ]} />
      </CaseChapter>

      <CaseChapter label="08 / Results & evidence" title="The product is live. The impact evidence needs its source.">
        <CaseProse><p>The delivered workflow connects collection, evaluation, and outreach around Project context. Previous case-study percentages are excluded here until their task definitions, samples, and observation periods can be checked.</p></CaseProse>
        <CaseEvidenceCards label="Evidence to add before making impact claims" layout="pairs" items={[
          { icon: <ScanSearch />, title: 'Task performance · to add', body: 'Collection and save completion before → after, with task definitions and participant counts.' },
          { icon: <SlidersHorizontal />, title: 'Evaluation quality · to add', body: 'Criteria adoption, editing, comprehension, and correction behavior for the same cohort.' },
          { icon: <FolderKanban />, title: 'Repeated use · to add', body: 'Project return rate, additional collection sessions, and time to a reviewed shortlist.' },
          { icon: <MessageSquareText />, title: 'Business outcomes · to add', body: 'Active users, growth, retention, campaign activation, and qualified replies, with reporting scope.' },
        ]} />
        <CaseProse><p>Add a verified quote from a recruiter or sales user alongside the behavior data. Changes in collected profile volume, model quality, acquisition, and campaign audience must be considered before attributing improvement to design.</p></CaseProse>
      </CaseChapter>

      <CaseClose label="09 / Reflection" title="The product model determines what the AI result can become.">
        <CaseProse><p>My central contribution was giving a ranking a durable context: why the people were collected, which criteria applied, and how the work could continue. The next question is whether that structure helps people return to a Project and complete a useful next action.</p></CaseProse>
        <div><CaseButton href="https://connectnova.ai/" target="_blank" rel="noopener noreferrer">Visit ConnectNova</CaseButton></div>
      </CaseClose>
    </CaseKitSections>
  </CaseKitPage>;
}
