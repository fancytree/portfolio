'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CaseButton } from '../../components/case-kit/CaseButton';
import styles from './Story.module.css';

/** Supporting material, closed by default so the three decisions stay the story. Closed content is not loaded. */
export default function Appendix({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div>
        <CaseButton variant="secondary" arrow="none" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? `Hide: ${title}` : `Show: ${title}`}
          <ChevronDown className={styles.chevron} aria-hidden="true" />
        </CaseButton>
      </div>
      {open ? children : null}
    </>
  );
}
