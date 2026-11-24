import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import CaseKitControls from '../../components/case-kit/CaseKitControls';
import { CaseChapter, CaseClose, CaseFigure, CaseHero, CaseKitPage, CaseKitSections, CaseProse } from '../../components/case-kit/CaseKit';
import chapters from './chapters.json';
import Workstation from './Workstation';
import styles from './article.module.css';

const title = 'Design Should Run';
const description = 'My vision for a design workstation where teams can connect user evidence, working prototypes, and decisions in the age of agents.';

export const metadata: Metadata = {
  title: `${title} — Mei Chai`,
  description,
  openGraph: { title, description, type: 'article' },
};

export default function DesignShouldRun() {
  return (
    <CaseKitPage>
      <CaseKitControls railKicker="Playground · Essay" railTitle={title} backHref="/playground" backLabel="Back to Playground" showProgress />
      <CaseKitSections backHref="/playground" backLabel="Back to Playground">
        <CaseHero
          eyebrow="Playground · Design in the age of agents"
          title="Design should run. And remain accountable."
          intro="I want a workstation where I can start with user evidence, try a design that runs, and see what happens after it ships. AI can help the team move through that work, while people decide when the evidence is strong enough to act."
          meta={[{ label: 'Format', value: 'Essay and interactive prototype' }]}
        />
        {chapters.map(chapter => (
          <CaseChapter key={chapter.label} label={chapter.label} title={chapter.title} lead={chapter.lead}>
            {chapter.diagram && chapter.height && chapter.alt && chapter.caption && (
              <CaseFigure caption={chapter.caption}>
                <div
                  className={`case-diagram-scroll ${styles.diagram}`}
                  tabIndex={0}
                  role="region"
                  aria-label={`${chapter.alt}. Scroll horizontally on small screens.`}
                  // This markup comes only from the six versioned SVG assets.
                  dangerouslySetInnerHTML={{ __html: readFileSync(join(process.cwd(), 'public', chapter.diagram), 'utf8') }}
                />
              </CaseFigure>
            )}
            {chapter.label.startsWith('07') && (
              <CaseFigure caption="Try each state in the purchase approval prototype.">
                <Workstation />
              </CaseFigure>
            )}
            <CaseProse>
              {chapter.notes.map(note => <p key={note.title}><strong>{note.title}</strong><br />{note.body}</p>)}
            </CaseProse>
          </CaseChapter>
        ))}
        <CaseClose label="09 / Conclusion" title="The workstation I want">
          <CaseProse>
            <p>I would judge the workstation by what the team can explain after a release. Can we trace a decision to the evidence behind it, see how it behaved in use, and know who can act on what we learned?</p>
            <p>The six figures adapt ideas from Chapter 6 of Xue Zhirong’s <a href="https://www.xuezhirong.com/books/design-in-the-age-of-agents/6/">Design in the Age of Agents</a>. The workstation and its operating principles are my proposal.</p>
          </CaseProse>
        </CaseClose>
      </CaseKitSections>
    </CaseKitPage>
  );
}
