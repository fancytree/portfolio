'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText, Zap } from 'lucide-react';
import { Stage } from '../stageshow/kit/stage';
import { Bar, Text } from '../stageshow/kit/window';
import { Row } from '../stageshow/kit/parts/Row';
import { Check } from '../stageshow/kit/parts/Check';
import { Meter } from '../stageshow/kit/parts/Meter';
import { Badge } from '../stageshow/kit/controls/Badge';
import { Toggle } from '../stageshow/kit/controls/Toggle';
import { Collapse } from '../stageshow/kit/motion/Collapse';
import { Count } from '../stageshow/kit/motion/Count';
import { States } from '../stageshow/kit/motion/States';
import type { Act } from '../stageshow/kit/act';
import './jobnova-cover.css';

// The concept, not the product's page: set a resume and how strict matching
// should be, switch Auto Apply on, and a list of matched jobs is worked
// through on its own. Each application opens, fills in, and is marked submitted.
type Scene = {
  resetting: boolean;
  /** Counts the cycles: keys the number so a reset remounts it instead of rolling it back. */
  run: number;
  resume: boolean;
  /** Match threshold: 0 is 30%, 1 is 55%, 2 is 80%. */
  match: number;
  on: boolean;
  /** The application being filled in (-1 for none) and how many of its fields are done. */
  working: number;
  fill: number;
  done: number;
};

const initial: Scene = { resetting: false, run: 0, resume: false, match: 0, on: false, working: -1, fill: 0, done: 0 };
const poster: Scene = { resetting: false, run: 0, resume: true, match: 1, on: true, working: -1, fill: 0, done: 3 };

const roles = ['Product Designer', 'UX Designer', 'Design Lead', 'Interaction Designer'];
const fillers = 4;
const thresholds = ['30%', '55%', '80%'];
const TOTAL = 12;
const fieldWidths = ['72%', '88%', '56%'];

async function reset(a: Act<Scene>) {
  a.put({ resetting: true });
  await a.wait(320);
  // Everything the run added goes while the card and panel are masked.
  await a.snap((s) => ({ ...initial, run: s.run + 1, resetting: true }));
  await a.wait(40);
  await a.set({ resetting: false });
  await a.wait(420);
}

async function script(a: Act<Scene>) {
  a.mark('opening');
  await reset(a);
  a.put({ resume: true });
  await a.wait(800);

  a.mark('preferences');
  await a.move({ at: 'match-1' });
  await a.click({ at: 'match-1' });
  a.put({ match: 1 });
  await a.wait(500);

  a.mark('enable');
  await a.move({ at: 'toggle' });
  await a.click({ at: 'toggle' });
  a.put({ on: true });
  await a.move({ at: 'rest' });
  await a.wait(700);

  a.mark('apply');
  for (let i = 0; i < roles.length - 1; i++) {
    a.put({ working: i, fill: 0 });
    await a.wait(650);
    for (let fill = 1; fill <= 3; fill++) {
      a.put({ fill });
      await a.wait(520);
    }
    await a.wait(180);
    a.put({ working: -1, done: i + 1 });
    await a.wait(650);
  }
  a.mark('payoff');
  await a.wait(2400);

  a.mark('restart');
  await reset(a);
}

type JobState = 'queued' | 'filling' | 'done';
const label: Record<JobState, string> = { queued: 'Queued', filling: 'Filling in…', done: 'Submitted' };

export default function JobNovaCover() {
  const figure = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // The illustration is inert so the project card stays one navigation
    // target. Listen on that link instead of the illustration's controls.
    const link = figure.current?.closest('a');
    if (!link) return;
    const enter = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') setPlaying(true);
    };
    const leave = () => setPlaying(false);
    link.addEventListener('pointerenter', enter);
    link.addEventListener('pointerleave', leave);
    link.addEventListener('pointercancel', leave);
    return () => {
      link.removeEventListener('pointerenter', enter);
      link.removeEventListener('pointerleave', leave);
      link.removeEventListener('pointercancel', leave);
    };
  }, []);

  return (
    <figure ref={figure} className="jn-cover" aria-label="With a resume and a matching preference set, JobNova's Auto Apply works through a list of jobs on its own, filling in each application and marking it submitted.">
      <Stage<Scene> width={800} height={500} initial={initial} poster={poster} script={playing ? script : undefined} play="loop" fidelity="standard" accent="#9ae600" greys="cool" cursor={{ at: { x: 650, y: 56 }, idle: 1400 }} className="jn-scene">
        {(s) => {
          const stateOf = (i: number): JobState => (!s.on ? 'queued' : i < s.done ? 'done' : i === s.working ? 'filling' : 'queued');
          return <>
            <span className="jn-rest" data-target="rest" />
            <div className="jn-composition" data-resetting={s.resetting || undefined}>
              <section className="jn-list">
                <header className="jn-list__head"><span>Matched jobs</span><b>{TOTAL}</b></header>
                {roles.map((role, i) => {
                  const st = stateOf(i);
                  return <div key={role} className="jn-job" data-state={st}>
                    <Row
                      className="jn-row"
                      pad={10}
                      lead={<Check on={st === 'done'} pending={st === 'filling'} size={18} />}
                      title={<Text className="jn-role">{role}</Text>}
                      subtitle={<Bar w={70 + (i % 3) * 22} h={5} tone={2} />}
                    >
                      <Badge className="jn-status" data-state={st}><States value={st} states={label} /></Badge>
                    </Row>
                    <Collapse open={st === 'filling'}>
                      <div className="jn-fields">
                        {fieldWidths.map((w, f) => <div key={f} className="jn-field"><Bar w={30 + f * 6} h={5} tone={2} /><span className="jn-field__track"><i style={{ width: s.working === i && s.fill > f ? w : '0%' }} /></span></div>)}
                      </div>
                    </Collapse>
                  </div>;
                })}
                {Array.from({ length: fillers }, (_, i) => <div key={i} className="jn-job">
                  <Row className="jn-row" pad={10} lead={<Check on={false} size={18} />} title={<Bar w={96 + (i % 2) * 28} h={7} tone={3} />} subtitle={<Bar w={64 + (i % 3) * 18} h={5} tone={2} />}>
                    <Bar w={58} h={14} r={7} tone={2} />
                  </Row>
                </div>)}
              </section>

              <aside className="jn-panel">
                <div className="jn-panel__head"><Zap size={14} fill="currentColor" strokeWidth={0} /><span>Auto Apply</span><Toggle data-target="toggle" on={s.on} /></div>
                <div className="jn-file"><FileText size={14} strokeWidth={1.75} /><span>Resume.pdf</span><Check on={s.resume} pending={!s.resume} size={14} /></div>
                <div className="jn-match">
                  <small>Match at least</small>
                  <div className="jn-match__pills">
                    {thresholds.map((t, i) => <span key={t} className="jn-pill" data-target={`match-${i}`} data-on={s.match === i || undefined}>{t}</span>)}
                  </div>
                </div>
                <div className="jn-total">
                  <div className="jn-total__figure"><b><Count key={s.run} value={s.done} /></b><span>submitted</span></div>
                  <Meter value={s.done / TOTAL} className="jn-total__meter" />
                </div>
              </aside>
            </div>
          </>;
        }}
      </Stage>
    </figure>
  );
}
