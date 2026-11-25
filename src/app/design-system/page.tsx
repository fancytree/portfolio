import type { Metadata } from 'next';
import { Compass, Layers } from 'lucide-react';
import CaseStudyControls from '../components/case-kit/CaseKitControls';
import { CaseButton } from '../components/case-kit/CaseButton';
import {
  CaseChapter,
  CaseEvidenceCards,
  CaseHero,
  CaseKitPage,
  CaseKitSections,
  CaseProse,
  CasePullquote,
  CaseStats,
} from '../components/case-kit/CaseKit';
import { readHandWritten, readTokens, shellFiles, type HandWritten, type Kind, type Token } from './tokens';
import styles from './design-system.module.css';

export const metadata: Metadata = {
  title: 'Design system | Mei Chai',
  description: 'The tokens and shared components of this portfolio.',
  robots: { index: false, follow: false },
};

const navLabels = ['01 / Colour', '02 / Type', '03 / Space and shape', '04 / Components', '05 / Still hand-written'];

const isColour = (t: Token) => /^(#|rgb)/.test(t.resolved);
const isPixels = (t: Token) => /^([\d.]+px|clamp\()/.test(t.resolved);

const fonts = [
  { token: '--case-font-heading', use: 'Headings, uppercase', sample: 'Beyond screens' },
  { token: '--case-font-body', use: 'Body copy and interface', sample: 'I design products people can understand and trust.' },
  { token: '--case-font-code', use: 'Labels, meta lines and code (IBM Plex Mono)', sample: '[ SELECTED WORK ] 0123456789' },
];

function Swatches({ tokens }: { tokens: Token[] }) {
  return (
    <ul className={styles.grid}>
      {tokens.map((t) => (
        <li key={t.name} className={styles.swatch}>
          <span className={styles.chip} style={{ background: t.resolved }} />
          <code className={styles.name}>{t.name}</code>
          <code className={styles.value}>{t.value}</code>
        </li>
      ))}
    </ul>
  );
}

function Rows({ tokens, preview }: { tokens: Token[]; preview: (t: Token) => React.ReactNode }) {
  return (
    <ul className={styles.rows}>
      {tokens.map((t) => (
        <li key={t.name} className={styles.row}>
          <div>
            <code className={styles.name}>{t.name}</code>
            <code className={styles.value}>{t.value}</code>
          </div>
          {preview(t)}
        </li>
      ))}
    </ul>
  );
}

function Audit({ kind, rows }: { kind: Kind; rows: HandWritten[] }) {
  const shown = rows.filter((r) => r.kind === kind);
  const uses = shown.reduce((sum, r) => sum + r.uses, 0);
  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <caption>{kind}: {shown.length} values, {uses} uses</caption>
        <thead>
          <tr><th scope="col">Written by hand</th><th scope="col">Uses</th><th scope="col">Proposed token</th><th scope="col">Visual change</th><th scope="col">Files</th></tr>
        </thead>
        <tbody>
          {shown.map((r) => (
            <tr key={r.value}>
              <td>
                {r.kind === 'Colour' && <span className={styles.dot} style={{ background: r.value }} aria-hidden="true" />}
                <code className={styles.name}>{r.value}</code>
              </td>
              <td>{r.uses}</td>
              <td>{r.token ? <code className={styles.name}>{r.token}</code> : '—'}</td>
              <td>{r.match === 'exact' ? 'None' : r.match === 'near' ? r.delta : 'Needs a decision'}</td>
              <td className={styles.value}>{r.files.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DesignSystemPage() {
  const tokens = readTokens();
  const handWritten = readHandWritten(tokens);
  const starting = (prefix: string) => tokens.filter((t) => t.name.startsWith(prefix));
  const count = (match: HandWritten['match']) => handWritten.filter((r) => r.match === match).reduce((sum, r) => sum + r.uses, 0);

  const sizes = starting('--case-text-').filter((t) => isPixels(t) && !t.value.startsWith('var('))
    .sort((a, b) => (parseFloat(b.resolved) || 0) - (parseFloat(a.resolved) || 0));
  const colours = tokens.filter((t) => isColour(t) && t.value === t.resolved && !t.name.includes('shadow'));

  return (
    <CaseKitPage>
      <CaseStudyControls navLabels={navLabels} showProgress railKicker="Reference" railTitle="Design system" />

      <CaseKitSections>
        <CaseHero
          eyebrow="Portfolio · Design system"
          title="One set of tokens for the whole site"
          intro="Colour, type, space and shape are written once, in case.css, and read by the homepage, Playground and every case page. Product demos keep their own design systems. This page is generated from the stylesheets."
          meta={[
            { label: 'Source', value: 'case.css' },
            { label: 'Tokens', value: String(tokens.length) },
            { label: 'Fonts', value: 'Oswald, Geist, Plex Mono' },
            { label: 'Stylesheets checked', value: String(shellFiles.length) },
          ]}
          action={{ label: 'Case blocks', href: '/projects/case-kit' }}
        />

        <CaseChapter label="01 / Colour" title="Eight greys and two signals" lead="White, paper and surface for backgrounds, line and faded for structure, muted, copy and ink for text. Red and blue only mark flow diagrams.">
          <Swatches tokens={colours} />
        </CaseChapter>

        <CaseChapter label="02 / Type" title="Three families, eight sizes" lead="Oswald for headings, Geist for reading, IBM Plex Mono for labels and code. Embedded product demos keep their own type.">
          <ul className={styles.rows}>
            {fonts.map((f) => (
              <li key={f.token} className={styles.row}>
                <div><code className={styles.name}>{f.token}</code><span className={styles.value}>{f.use}</span></div>
                <span className={styles.sample} style={{ fontFamily: `var(${f.token})`, fontSize: 'var(--case-text-24)' }}>{f.sample}</span>
              </li>
            ))}
          </ul>
          <Rows
            tokens={sizes}
            preview={(t) => <span className={styles.sample} style={{ fontSize: `var(${t.name})` }}>The quick brown fox</span>}
          />
        </CaseChapter>

        <CaseChapter label="03 / Space and shape" title="Six steps, four corners" lead="Spacing steps are 4, 8, 16, 24, 32 and 64 pixels. Two fluid values set page rhythm: stack between blocks, chapter between chapters.">
          <ul className={styles.tiles} aria-label="Spacing steps">
            {starting('--case-space-').filter((t) => /^\d+px$/.test(t.value)).map((t) => (
              <li key={t.name} className={styles.tile}>
                <span className={styles.step} style={{ width: `var(${t.name})`, height: `var(${t.name})` }} />
                <code className={styles.name}>{t.value}</code>
              </li>
            ))}
          </ul>
          <ul className={styles.tiles} aria-label="Corner radii">
            {starting('--case-radius-').map((t) => (
              <li key={t.name} className={styles.tile}>
                <span className={styles.box} style={{ borderRadius: `var(${t.name})` }} />
                <code className={styles.name}>{t.name.replace('--case-radius-', '')}</code>
                <code className={styles.value}>{t.value}</code>
              </li>
            ))}
          </ul>
          <Rows tokens={tokens.filter((t) => ['--case-space-stack', '--case-space-chapter'].includes(t.name))} preview={(t) => <span className={styles.bar} style={{ width: `var(${t.name})` }} />} />
        </CaseChapter>

        <CaseChapter label="04 / Components" title="Shared blocks">
          <div className={styles.actions}>
            <CaseButton href="/#work">Primary</CaseButton>
            <CaseButton variant="secondary" href="/#work">Secondary</CaseButton>
            <CaseButton variant="text" arrow="left" href="/#work">Text link</CaseButton>
            <CaseButton disabled>Disabled</CaseButton>
          </div>
          <CaseEvidenceCards label="Card sample" layout="pairs" items={[
            { icon: <Compass />, title: 'Evidence card', body: 'An icon, a short title and one explanation.' },
            { icon: <Layers />, title: 'Paired layout', body: 'Two columns from tablet width, one on phones.' },
          ]} />
          <CaseStats items={[{ value: '15', label: 'Stat value' }, { value: '5–10 min', label: 'Range value' }]} />
          <CasePullquote>A pull quote lifts one conclusion out of the body text.</CasePullquote>
        </CaseChapter>

        <CaseChapter label="05 / Still hand-written" title="What to align next" lead="Literal values left in the portfolio's own stylesheets. A value that equals a token can be swapped with no visible change; a near one moves by the amount shown.">
          <CaseStats items={[
            { value: String(count('exact')), label: 'Uses with no visual change' },
            { value: String(count('near')), label: 'Uses within 2px of a token' },
            { value: String(count('none')), label: 'Uses that need a decision' },
          ]} />
          <Audit kind="Type size" rows={handWritten} />
          <Audit kind="Radius" rows={handWritten} />
          <Audit kind="Colour" rows={handWritten} />
          <Audit kind="Font" rows={handWritten} />
        </CaseChapter>
      </CaseKitSections>
    </CaseKitPage>
  );
}
