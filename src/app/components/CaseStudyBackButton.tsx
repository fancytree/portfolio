'use client';

import { useRouter } from 'next/navigation';
import { CaseButton } from './case-kit/CaseButton';

/** Shared token-based return action for Case Kit callers. */
export function CaseKitBackButton() {
  const router = useRouter();
  return <CaseButton variant="back" arrow="left" onClick={() => router.push('/#work')}>Back to Work</CaseButton>;
}
