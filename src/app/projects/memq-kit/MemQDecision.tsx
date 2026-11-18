import type { ReactNode } from 'react';
import { DecisionCards, type Decision } from '../procurement-agent-kit/DecisionCards';
import d from './MemQDecision.module.css';

/**
 * A decision beside what it produced, so the reader can match the choice to the design:
 * the visual on the left, large, the compact decision card on the right. Every decision
 * on the page uses this one layout. On a phone the visual sits above.
 */
export function DecisionBeside({ decision, screen, caption, wide = false }: { decision: Decision; screen: ReactNode; caption?: string; wide?: boolean }) {
  return (
    <div className={`${d.beside} ${wide ? d.wide : ''}`}>
      <figure className={d.screen}>
        <div className={d.pin}>
          {screen}
          {caption && <figcaption>{caption}</figcaption>}
        </div>
      </figure>
      <div className={d.card}><DecisionCards items={[decision]} /></div>
    </div>
  );
}

/** Several screens side by side, each with a short line under it. */
export function Screens({ children }: { children: ReactNode }) {
  return <div className={d.row}>{children}</div>;
}
export function Captioned({ children, line }: { children: ReactNode; line: string }) {
  return <div className={d.captioned}>{children}<span>{line}</span></div>;
}
