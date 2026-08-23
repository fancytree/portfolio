import type { Metadata } from 'next';
import SequenceDemoStage from './SequenceDemoStage';

export const metadata: Metadata = {
  title: 'ConnectNova — Sequence builder demo',
  robots: { index: false, follow: false },
};

/**
 * Standalone stage for the sequence builder, so the homepage and the case study
 * can embed it in an iframe instead of mounting three React Flow canvases inline.
 */
export default function ConnectnovaSequenceDemoPage() {
  return <SequenceDemoStage />;
}
