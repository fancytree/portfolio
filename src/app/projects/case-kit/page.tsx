import type { Metadata } from 'next';
import Image from 'next/image';
import CaseStudyControls from '../../components/CaseStudyControls';
import {
  CaseChapter,
  CaseClose,
  CaseFigure,
  CaseHero,
  CaseKitPage,
  CaseKitSections,
  CaseProse,
  CasePullquote,
  CaseStats,
} from '../../components/case-kit/CaseKit';

export const metadata: Metadata = {
  title: 'Case study kit | Mei Chai',
  description: 'Shared reading blocks for case study pages. Sample assembly, not a published project.',
  robots: { index: false, follow: false },
};

const navLabels = ['01 / Context', '02 / The rule', '03 / Recap'];

export default function CaseKitStylePage() {
  return (
    <CaseKitPage>
      <CaseStudyControls
        accentColor="#ed5b2b"
        navLabels={navLabels}
        alwaysVisible
        showDivider={false}
        editorial
        railKicker="Case study"
        railTitle="Case study kit"
      />

      <CaseKitSections>
      <CaseHero
        eyebrow="Portfolio · Case study kit"
        title="Seven blocks for every case page"
        intro="Each project keeps its own order. Words, pictures, and demos drop into these slots. The chapters below are a sample assembly, using copy and a screen from the DEF Beauty ERP case."
        meta={[
          { label: 'Client', value: 'Portfolio' },
          { label: 'Year', value: '2026' },
          { label: 'Role', value: 'Shared frame' },
          { label: 'Duration', value: 'Style page' },
          { label: 'Industry', value: 'Case studies' },
          { label: 'Tools', value: 'Hero, chapter, prose, figure, stats, pull quote, close' },
        ]}
        action={{ label: 'Sample case', href: '/projects/def-erp' }}
        tags={['Hero', 'Chapter', 'Prose', 'Figure', 'Stats', 'Pull quote', 'Close']}
        glance={{
          items: [
            {
              label: 'Challenge',
              body: 'Fifteen people ran the wholesale business on a desktop inventory tool and a WeChat mini-program that never shared one truth.',
            },
            {
              label: 'Solution',
              body: 'Four dashboards on one shell. What changes is which numbers earn a tile, from what each role said they actually check.',
            },
            {
              label: 'Outcome',
              body: 'Four rules, not forty screens. Sales, warehouse, finance, and procurement read as one system.',
            },
          ],
          deliverables: [
            'Four role dashboards',
            'Shared shell',
            'Five permission roles',
            'Sales counter',
            'One source of truth',
          ],
        }}
      />

      <CaseChapter
        label="01 / Context"
        title="Fifteen people, eight real jobs, one spreadsheet-shaped tool."
        lead="DEF Beauty Supply sells professional nail, hair, and beauty products wholesale to salons across Italy, through a legacy desktop inventory tool and a WeChat mini-program that never talked to each other."
      >
        <CaseProse spec="Prose">
          <p>Neither system knew what the other believed was true.</p>
          <p>
            Storefront, sales, inventory, procurement, receiving, finance: six parts feeding each other. None of
            that was one system.
          </p>
        </CaseProse>
        <CaseStats
          spec="Stats"
          items={[
            { value: '15', label: 'People running the business daily' },
            { value: '8', label: 'Real jobs, from counter sales to driver' },
            { value: '5', label: 'Permission roles the system actually has' },
            { value: '2', label: 'Disconnected systems, one truth each' },
          ]}
        />
      </CaseChapter>

      <CaseChapter
        label="02 / The rule"
        title="Four dashboards. One shared structure, reweighted."
        lead="Every dashboard keeps the same shell: KPI tiles, a trend chart, a tasks-to-handle panel. What changes is which numbers earn a tile, sourced from what each role said they actually check."
      >
        <CaseFigure
          spec="Figure"
          caption="The Admin view, one of four. Same shell, reweighted for this role."
        >
          <Image
            src="/img/def-erp/dashboard-admin-v7.png"
            alt="Admin dashboard with sales, orders, receivables, customer mix, and tasks to handle."
            width={3200}
            height={2000}
            sizes="(min-width: 1280px) 1080px, 100vw"
          />
        </CaseFigure>
        <CasePullquote spec="Pull quote">
          The thing I designed is not four dashboards. It is one rule: same skeleton, reweighted content, sourced
          from what each role actually does daily.
        </CasePullquote>
      </CaseChapter>

      <CaseClose label="03 / Recap" title="Four rules, not forty screens.">
        <CaseProse>
          <p>
            Four dashboards share a shell. What changes is which numbers earn a tile, sourced from what each role
            said they check.
          </p>
        </CaseProse>
      </CaseClose>
      </CaseKitSections>
    </CaseKitPage>
  );
}
