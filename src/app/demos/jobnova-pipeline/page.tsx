import type { Metadata } from 'next';
// JobNova's globals first, as its root layout loads them; the page's own styles then override them
import './_jn/tokens.css';
import './_jn/style.css';
import Pipeline from './_jn/app/jobs/auto-apply-v2/page';
import DemoGuard from './DemoGuard';

export const metadata: Metadata = {
  title: 'JobNova — Application pipeline demo',
  robots: { index: false, follow: false },
};

/**
 * Bare stage for the JobNova case's live demo: the Auto Apply pipeline, copied from the
 * JobNova prototype (Liba/JobNova, /jobs/auto-apply-v2) into `_jn` with its own styles and images.
 */
export default function JobnovaPipelineDemoPage() {
  return (
    <>
      {/* JobNova's own type, as its root layout loads it */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&family=Lexend:wght@400;500&display=swap" />
      <DemoGuard />
      <Pipeline />
    </>
  );
}
