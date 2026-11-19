import type { Metadata } from 'next';
import ResumeCoEditor from './ResumeCoEditor';

export const metadata: Metadata = {
  title: 'JobNova — Resume co-editing demo',
  robots: { index: false, follow: false },
};

/** Bare stage for the JobNova case's live demo: the tailored-resume drawer, filling the frame. */
export default function JobnovaResumeDemoPage() {
  return (
    <main data-demo="jobnova-resume" style={{ minHeight: '100vh', padding: 16, background: '#eceef1' }}>
      <ResumeCoEditor />
    </main>
  );
}
