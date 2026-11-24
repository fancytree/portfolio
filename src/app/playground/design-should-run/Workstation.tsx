'use client';

import { useState } from 'react';
import { ArrowLeft, Bot, ChevronDown, Clock, Code, FileText, GitBranch, House, Layers, ListChecks, Monitor, Shield, Sparkles, Target, Workflow } from 'lucide-react';
import styles from './workstation.module.css';

const lanes = [
  { name: 'Intake', cards: [['AUR-9', 'P1', 'Back-in-stock alerts for unavailable items', 'Post-launch findings', '3 days ago'], ['AUR-7', 'P3', 'Photo uploads for product reviews', 'Support feedback', 'Metric not set']] },
  { name: 'Design', cards: [['AUR-6', 'P2', 'Simplify new customer onboarding', 'Analytics', '8 days ago']] },
  { name: 'Design proposal', cards: [['AUR-5', 'P2', 'Extend dark mode tokens', 'Business goal', 'Branch · 2 drafts']] },
  { name: 'Iteration', cards: [['AUR-4', 'P1', 'Show refund progress', 'Support feedback', '3 drafts · 1 note']] },
  { name: 'Design review', cards: [['AUR-3', 'P1', 'Improve search results density', 'User research', '6 drafts · 2 notes']] },
  { name: 'Development / PR', cards: [['AUR-2', 'P1', 'Unify empty and error states', 'Design debt', 'Branch · 5 drafts']] },
];
const workspaceLinks = [[House, 'Overview'], [Monitor, 'Local AI'], [ListChecks, 'Skill library'], [Shield, 'Members & access']] as const;
const projectLinks = [[Workflow, 'Design tasks'], [Layers, 'Shared design'], [ListChecks, 'Post-launch validation'], [GitBranch, 'Repository']] as const;

const taskTools = [
  [FileText, 'Requirements'], [Workflow, 'Flow'], [Layers, 'Versions'],
  [Shield, 'Review'], [Target, 'Metrics'],
  [Bot, 'AI'], [Code, 'Code'], [Sparkles, 'Skills'], [Clock, 'Activity'],
] as const;

function Cart({ version }: { version: 1 | 2 }) {
  const [removed, setRemoved] = useState(version === 2);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.cart}>
      <p className={styles.cartTitle}>Cart</p>
      <div className={styles.cartBody}>
        {version === 2 && removed && <div className={styles.undo}>3 unavailable items removed <button type="button" onClick={() => { setRemoved(false); setExpanded(false); }}>Undo</button></div>}
        <div className={styles.product}><i /><div><strong>Wireless mechanical keyboard</strong><small>Blue switches · White</small></div><b>¥399</b></div>
        <div className={styles.product}><i /><div><strong>Keycap set</strong><small>PBT · 104 keys</small></div><b>¥89</b></div>
        {!removed && (
          <div className={styles.unavailable}>
            <button type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>3 unavailable items <ChevronDown size={13} aria-hidden /></button>
            {expanded && <div><p>These items are out of stock or no longer sold.</p><button type="button" onClick={() => setRemoved(true)}>Remove unavailable items</button></div>}
          </div>
        )}
        <span className={styles.checkout}>Checkout</span>
      </div>
    </div>
  );
}

export default function Workstation() {
  const [view, setView] = useState<'board' | 'task'>('board');

  return (
    <section className={styles.app} aria-label="Aurora design workstation preview">
      <div className={styles.top}>
        <div><span className={styles.mark}>D</span><strong>Design Workstation</strong></div>
        <div role="group" aria-label="Workstation view">
          <button type="button" aria-pressed={view === 'board'} onClick={() => setView('board')}>Task board</button>
          <button type="button" aria-pressed={view === 'task'} onClick={() => setView('task')}>Task AUR-8</button>
        </div>
      </div>
      {view === 'board' ? (
        <div className={styles.boardLayout}>
          <aside className={styles.sidebar} aria-label="Workspace sections">
            <p>Workspace</p>
            {workspaceLinks.map(([Icon, name]) => <span key={name}><Icon size={15} aria-hidden />{name}</span>)}
            <p>Project · Aurora Store</p>
            {projectLinks.map(([Icon, name]) => <span key={name} data-selected={name === 'Design tasks' || undefined}><Icon size={15} aria-hidden />{name}</span>)}
          </aside>
          <div className={styles.board}>
            <div className={styles.boardIntro}>
              <p>Aurora Store / Design tasks</p>
              <h3>Design tasks</h3>
              <p>The storefront team tracks design work alongside branches, commits, and merge status from Git.</p>
              <button type="button" onClick={() => setView('task')}>Open AUR-8 · Unavailable cart items <span aria-hidden>→</span></button>
            </div>
            <div className={styles.lanes} tabIndex={0} role="region" aria-label="Design task board. Scroll to see more stages.">
              {lanes.map(({ name, cards }, index) => (
                <div className={styles.lane} key={name}>
                  <h4><small>0{index + 1}</small> {name}</h4>
                  {cards.map(([id, priority, title, source, detail]) => (
                    <article className={styles.card} key={id}>
                      <div><span>{id}</span><b data-priority={priority}>{priority}</b></div>
                      <h5>{title}</h5><small>{source}</small><p>{detail}</p>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.taskHeading}>
            <button type="button" aria-label="Back to task board" onClick={() => setView('board')}><ArrowLeft size={16} /></button>
            <span>Aurora Store / AUR-8</span><strong>Handle unavailable cart items</strong>
            <span className={styles.badge}>Outcome validation · 8/8</span><span className={styles.risk}>Target missed</span>
          </div>
          <div className={styles.taskLayout}>
            <aside className={styles.taskTools} aria-label="Task workspace sections">
              <ul>
                {taskTools.map(([Icon, label], index) => (
                  <li key={label} data-tool-start={index === 5 || undefined} aria-current={index === 0 ? 'true' : undefined}>
                    <Icon size={18} aria-hidden /><span>{label}</span>
                  </li>
                ))}
              </ul>
            </aside>
            <aside className={styles.requirements} aria-label="Task requirements">
              <h3><FileText size={16} aria-hidden /> Requirements</h3>
              <section><h4>01 / Problem and evidence</h4>
                <dl>
                  <dt>User problem</dt><dd>Shoppers assume unavailable items can still be purchased because they appear alongside items in stock.</dd>
                  <dt>Business goal</dt><dd>Reduce related support tickets from 86 to 40 per week.</dd>
                  <dt>Risk</dt><dd>Removing items must be reversible. Purchasable items must stay in the cart.</dd>
                  <dt>Evidence</dt><dd>Support ticket reports, weeks 38–41.</dd>
                </dl>
              </section>
              <section><h4>02 / Design rationale</h4>
                <dl>
                  <dt>In scope</dt><dd>Group unavailable items, show why they’re unavailable, and offer removal with undo.</dd>
                  <dt>Out of scope</dt><dd>Back-in-stock alerts.</dd>
                  <dt>Roles and access</dt><dd>AI responsibilities and permissions still need to be defined.</dd>
                </dl>
              </section>
              <section><h4>Spec</h4><p className={styles.specWarning}>Two commits landed after the spec was updated. Record any new states or constraints uncovered in implementation.</p><p>Show what shoppers can buy, what they can’t, and why.</p></section>
            </aside>
            <div className={styles.canvas}>
              <div className={styles.canvasTop}><span className={styles.badge}>Selected direction</span><span>Runnable prototype</span></div>
              <h3>Group unavailable items</h3>
              <p>Keep the cart focused on items shoppers can buy, with a way to review and remove unavailable items.</p>
              <div className={styles.versions}>
                {[1, 2].map(version => (
                  <div key={version}>
                    <h4><span className={styles.badge}>v{version}</span> {version === 1 ? 'Group and remove' : 'Add undo after review'}</h4>
                    <p>{version === 1 ? 'Oct 20 · Self-review' : 'Oct 22 · Team review'}</p>
                    <ul className={styles.checks} aria-label="Prototype checks">
                      <li data-checked>Real states</li><li data-checked={version === 2 || undefined}>Error handling</li><li>Permissions</li><li>Responsive</li><li data-checked>Accessibility</li>
                    </ul>
                    <Cart version={version === 1 ? 1 : 2} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
