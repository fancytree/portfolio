import type { Metadata } from 'next';
import { Blocks, Bot, Braces, CheckCheck, Compass, Database, FileCheck, Layers3, PanelTop, ShieldCheck } from 'lucide-react';
import CaseStudyBackButton from '../../components/CaseStudyBackButton';
import CaseStudyControls from '../../components/CaseStudyControls';
import { CaseButton } from '../../components/case-kit/CaseButton';
import { CaseChapter, CaseClose, CaseEvidenceCards, CaseFigure, CaseHero, CaseKitPage, CaseKitSections, CaseProse, CasePullquote, CaseVideo } from '../../components/case-kit/CaseKit';
import { MonoAgentWorkflow, MonoConfirmationWorkflow } from './MonoWorkflowDiagrams';

export const metadata: Metadata = {
  title: 'Mono — Exploring Intent-Driven Interfaces | Mei Chai',
  description: 'A hands-on exploration of conversational finance interfaces: intent-led UI, structured component contracts, editable transaction previews, and explicit confirmation.',
};

const navLabels = ['01 / My role', '02 / Design direction', '03 / Agent workflow', '04 / UI contract', '05 / Human handoff', '06 / Exploration outcomes', '07 / Reflection'];

export default function MonoProjectPage() {
  return (
    <CaseKitPage>
      <CaseStudyControls navLabels={navLabels} railKicker="Case study" railTitle="Mono" />
      <CaseKitSections>
        <div className="case-mobile-back"><CaseStudyBackButton /></div>
        <CaseHero
          eyebrow="Portfolio · AI product design"
          title="Mono"
          intro="I explored how to give a finance agent a controlled way to interpret intent, choose a workflow, and return an interface people can inspect."
          meta={[
            { label: 'Studio', value: 'River Studio' },
            { label: 'Year', value: '2026' },
            { label: 'Role', value: 'Solo product designer & builder' },
            { label: 'Focus', value: 'Generative UI · personal finance' },
            { label: 'Status', value: 'Live · independent exploration' },
          ]}
          action={{ label: 'Visit Mono', href: 'https://mono.riverstudio.cc/' }}
          tags={['AI interaction design', 'Generative UI', 'Design systems']}
          glance={{ items: [
            { label: 'The challenge', body: 'Flexible conversation needs a dependable path from intent to data, interface, and action.' },
            { label: 'My approach', body: 'Let the Agent choose and compose supported components. Define their data, states, and confirmation rules.' },
            { label: 'The exploration', body: 'A working implementation of intent-led responses, component contracts, and reviewable actions.' },
          ] }}
        />

        <CaseChapter label="01 / My role" title="I designed what the Agent can compose—and how people stay in control.">
          <CaseProse><p>Mono is my independent exploration of conversational personal finance. I owned the product flows, UI system, component contracts, and implementation, from interpreting a request to confirming a record.</p></CaseProse>
          <CaseVideo src="/img/Mono/Mono%20Demo.mp4" poster="/img/Mono/evidence/records.webp" label="Mono working exploration walkthrough" caption="Working exploration · A recorded view of the system in use. The workflow and handoff diagrams below explain the design behind its responses." width={1352} height={720} />
          <CaseEvidenceCards label="My responsibilities and deliverables" items={[
            { icon: <Compass />, title: 'Set the interaction model', body: 'Define how intent, missing information, and user decisions shape the workflow.' },
            { icon: <Braces />, title: 'Define the UI contract', body: 'Specify supported components, required data, and user actions.' },
            { icon: <Layers3 />, title: 'Build the vocabulary', body: 'Connect visual rules and reusable cards to a working renderer.' },
          ]} />
        </CaseChapter>

        <CaseChapter label="02 / Design direction" title="How much freedom should the model have over the interface?">
          <CaseProse><p>I compared three ways to give a model a role in the UI. My design problem was consistency: each request may need a different answer, while amounts, time ranges, and save actions need a stable structure.</p></CaseProse>
          <CaseEvidenceCards label="Generative interface approaches I compared" items={[
            { icon: <PanelTop />, title: 'Select a prepared view', body: 'Predictable presentation, with composition limited to predefined screens.' },
            { icon: <Blocks />, title: 'Compose components · chosen', body: 'Flexible answers within a designed vocabulary of data and interaction contracts.' },
            { icon: <Braces />, title: 'Generate interface code', body: 'More presentation freedom, with a larger validation and execution surface.' },
          ]} />
          <CaseProse><p>I chose declarative composition. Information architecture connects the task to a component; progressive disclosure lets the answer expose the details needed for that task. This direction came from design and technical exploration.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="03 / Agent workflow" title="From intent to a workflow, then to an interface.">
          <CaseProse><p>I structured the Agent around a LangChain intent router and task-specific chains. Product code dispatches the request, retrieves or calculates the required data, and prepares a supported UI response.</p></CaseProse>
          <CaseFigure caption="Agent workflow · LangChain handles structured intent routing and task chains; product code handles dispatch, data services, response validation, and rendering. Text-only replies bypass UI composition.">
            <MonoAgentWorkflow />
          </CaseFigure>
          <CaseProse><p>When required information is missing, the workflow asks a follow-up and carries the request forward. The model does not have to finish the task in a single response.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="04 / UI contract" title="The output is a contract the product knows how to render.">
          <CaseProse><p>I defined the handoff as intent, component, data, and feedback. Schemas constrain the output; the component vocabulary defines what can be rendered and which interactions it supports.</p></CaseProse>
          <CaseEvidenceCards label="The responsibilities behind a generated response" items={[
            { icon: <Bot />, title: 'Model · interpret', body: 'Preserve the request’s meaning and produce structured intent and task output.' },
            { icon: <Database />, title: 'Services · ground', body: 'Provide records, context, and calculations to the response.' },
            { icon: <Blocks />, title: 'Client · render', body: 'Map supported output to registry components or dedicated business views.' },
          ]} />
          <CasePullquote>The interface vocabulary includes what a component can do, not just how it looks.</CasePullquote>
          <CaseProse><p>I paired visual tokens with component names, props, data requirements, and action rules. These make the design system usable as an implementation contract.</p></CaseProse>
        </CaseChapter>

        <CaseChapter label="05 / Human handoff" title="Preparing a change and saving it are separate steps.">
          <CaseProse><p>I placed an explicit review between Agent output and a transaction write. The person can inspect and edit the proposed values; product code submits the change only after confirmation.</p></CaseProse>
          <CaseFigure caption="Human handoff · This focused path covers transaction creation and editing. Confirming triggers a save request; dismissing the draft saves no change. Read-only responses do not enter this write flow.">
            <MonoConfirmationWorkflow />
          </CaseFigure>
        </CaseChapter>

        <CaseChapter label="06 / Exploration outcomes" title="What the working exploration established.">
          <CaseProse><p>Building Mono let me test the design idea in working software: a request can lead to different interfaces while each response follows product-defined data and action rules.</p></CaseProse>
          <CaseEvidenceCards label="What the exploration established" items={[
            { icon: <CheckCheck />, title: 'A response vocabulary', body: 'Intent routes to an executable workflow with a supported response contract.' },
            { icon: <FileCheck />, title: 'An executable design system', body: 'Schemas, component props, and rendering rules turn the vocabulary into working UI.' },
            { icon: <ShieldCheck />, title: 'A boundary for generation', body: 'The Agent composes supported responses; product code controls rendering and saving.' },
          ]} />
          <CaseProse><p>The limit is expressiveness: a supported vocabulary works only for the tasks it can represent. New intents need another component, a clarification, or a fallback.</p></CaseProse>
        </CaseChapter>

        <CaseClose label="07 / Reflection" title="Designing the space of possible responses.">
          <CaseProse><p>Mono made that responsibility concrete: define the vocabulary, connect it to product data, and decide where a person reviews an action. The next question is how that vocabulary should grow: when to add a component, when to ask for clarification, and how to respond when the current set cannot express the request.</p></CaseProse>
          <CaseButton variant="secondary" href="https://mono.riverstudio.cc/" target="_blank" rel="noreferrer">Visit Mono</CaseButton>
          <CaseProse><p>The live app requires sign-in. The recording and workflow diagrams above can be viewed without an account.</p></CaseProse>
        </CaseClose>
      </CaseKitSections>
    </CaseKitPage>
  );
}
