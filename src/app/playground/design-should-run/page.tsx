import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import CaseKitControls from '../../components/case-kit/CaseKitControls';
import { CaseChapter, CaseClose, CaseFigure, CaseHero, CaseKitPage, CaseKitSections, CaseProse } from '../../components/case-kit/CaseKit';
import chapters from './chapters.json';
import Workstation from './Workstation';
import styles from './article.module.css';

// Static paths keep deployment tracing limited to these six figures.
const figures: Record<string, string> = {
  '/play/design-should-run/01-design-loop.svg': readFileSync(join(process.cwd(), 'public/play/design-should-run/01-design-loop.svg'), 'utf8'),
  '/play/design-should-run/02-code-participation.svg': readFileSync(join(process.cwd(), 'public/play/design-should-run/02-code-participation.svg'), 'utf8'),
  '/play/design-should-run/03-agent-context.svg': readFileSync(join(process.cwd(), 'public/play/design-should-run/03-agent-context.svg'), 'utf8'),
  '/play/design-should-run/04-delivery-materials.svg': readFileSync(join(process.cwd(), 'public/play/design-should-run/04-delivery-materials.svg'), 'utf8'),
  '/play/design-should-run/05-two-access-paths.svg': readFileSync(join(process.cwd(), 'public/play/design-should-run/05-two-access-paths.svg'), 'utf8'),
  '/play/design-should-run/06-team-delivery.svg': readFileSync(join(process.cwd(), 'public/play/design-should-run/06-team-delivery.svg'), 'utf8'),
};

const title = 'Design Should Run';
const description = 'Notes on designing in code, with a workstation concept for reviewing prototypes and keeping track of design decisions.';

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
          eyebrow="Playground · Notes on designing in code"
          title="Design should run. And remain accountable."
          intro="These notes draw on Chapter 6 of Xue Zhirong’s Design in the Age of Agents. I’ve redrawn six figures in English and added a workstation concept based on how I prototype and review designs today."
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
                  dangerouslySetInnerHTML={{ __html: figures[chapter.diagram] }}
                />
              </CaseFigure>
            )}
            {chapter.label.startsWith('07') && (
              <>
                <CaseProse>
                  <p>When I prototype in code, teammates usually pull my Git branch and run it locally to review the interaction. I’d like us to review that same working version in a shared space, leave comments on specific states, and keep the reasoning behind each decision with the prototype.</p>
                </CaseProse>
                <CaseFigure caption="Workstation concept · Aurora Store. Open AUR-8 to see the requirements, the spec, and how feedback shaped the cart prototype.">
                  <Workstation />
                </CaseFigure>
              </>
            )}
            <CaseProse>
              {chapter.notes.map(note => <p key={note.title}><strong>{note.title}</strong><br />{note.body}</p>)}
            </CaseProse>
          </CaseChapter>
        ))}
        <CaseClose label="09 / Conclusion" title="The workstation I want">
          <CaseProse>
            <p>I would judge the workstation by what the team can explain after a release. Can we trace a decision to the evidence behind it, see how it behaved in use, and know who can act on what we learned?</p>
            <p>The six figures adapt ideas from Chapter 6 of Xue Zhirong’s <a className={styles.sourceLink} href="https://www.xuezhirong.com/books/design-in-the-age-of-agents/6/">Design in the Age of Agents</a>. The workstation and its operating principles are my proposal.</p>
          </CaseProse>
        </CaseClose>
      </CaseKitSections>
    </CaseKitPage>
  );
}
