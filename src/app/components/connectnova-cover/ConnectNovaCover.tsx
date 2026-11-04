'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check as CheckIcon, X } from 'lucide-react';
import { Stage } from '../stageshow/kit/stage';
import { Window, Bar, Text } from '../stageshow/kit/window';
import { Row } from '../stageshow/kit/parts/Row';
import { Avatar } from '../stageshow/kit/parts/Avatar';
import { Check } from '../stageshow/kit/parts/Check';
import { Meter } from '../stageshow/kit/parts/Meter';
import { Spinner } from '../stageshow/kit/parts/Spinner';
import { Badge } from '../stageshow/kit/controls/Badge';
import { Button } from '../stageshow/kit/controls/Button';
import { Field } from '../stageshow/kit/controls/Field';
import { Count } from '../stageshow/kit/motion/Count';
import { Roll } from '../stageshow/kit/motion/Roll';
import { States } from '../stageshow/kit/motion/States';
import type { Act } from '../stageshow/kit/act';
import './connectnova-cover.css';

// Beats: one click in the extension captures six LinkedIn profiles, they land in
// ConnectNova's project, the recruiter types what they need, and the list
// reorders into a ranking with the best match on top.
type Scene = {
  resetting: boolean;
  /** Profiles captured so far (0 to 6): LinkedIn ticks, app rows resolving. */
  collected: number;
  collecting: boolean;
  focused: boolean;
  typed: string;
  ranking: boolean;
  ranked: boolean;
};

const initial: Scene = { resetting: false, collected: 0, collecting: false, focused: false, typed: '', ranking: false, ranked: false };
const poster: Scene = { resetting: false, collected: 6, collecting: false, focused: false, typed: 'B2B SaaS, AI products, Bay Area', ranking: false, ranked: true };
const requirements = 'B2B SaaS, AI products, Bay Area';

type Candidate = { id: string; name: string; role: string; score: number };
// Listed in the order LinkedIn returned them; `score` decides the ranking.
const candidates: Candidate[] = [
  { id: 'daniel', name: 'Daniel Park', role: 'Product Manager · Payments', score: 79 },
  { id: 'sophie', name: 'Sophie Turner', role: 'Senior PM · Growth', score: 71 },
  { id: 'alex', name: 'Alex Morgan', role: 'Associate PM · Marketplace', score: 63 },
  { id: 'marco', name: 'Marco Silva', role: 'Senior PM · B2B SaaS', score: 94 },
  { id: 'olivia', name: 'Olivia Chen', role: 'Group PM · AI Platform', score: 88 },
  { id: 'priya', name: 'Priya Nair', role: 'Product Lead · Developer tools', score: 67 },
];
const ranked = [...candidates].sort((a, b) => b.score - a.score);
const ROW = 50;
const TOTAL = candidates.length;

async function script(a: Act<Scene>) {
  a.mark('opening');
  await a.wait(900);

  a.mark('capture');
  await a.move({ at: 'collect-btn' });
  await a.click({ at: 'collect-btn' });
  a.put({ collecting: true });
  await a.wait(450);
  for (let collected = 1; collected <= TOTAL; collected++) {
    a.put({ collected });
    await a.wait(430);
  }
  a.put({ collecting: false });
  await a.wait(750);

  a.mark('requirements');
  await a.move({ at: 'req-field' });
  await a.click({ at: 'req-field' });
  a.put({ focused: true });
  await a.wait(250);
  await a.type('typed', requirements, { interval: 34 });
  await a.wait(350);

  a.mark('rank');
  await a.move({ at: 'rank-btn' });
  a.put({ focused: false });
  await a.click({ at: 'rank-btn' });
  a.put({ ranking: true });
  await a.wait(1100);
  a.put({ ranking: false, ranked: true });
  a.mark('payoff');
  await a.move({ at: 'rest' });
  await a.wait(2800);

  a.mark('restart');
  a.put({ resetting: true });
  await a.wait(320);
  // Everything the story added goes while its content is masked; the two
  // window frames, the sidebar and the project title stay as anchors.
  await a.snap({ ...initial, resetting: true });
  await a.wait(40);
  await a.set({ resetting: false });
  await a.wait(420);
}

export default function ConnectNovaCover() {
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
    <figure ref={figure} className="cnc-cover" aria-label="ConnectNova's browser extension captures candidates from a LinkedIn search in one click; they appear in the web app, and a typed brief re-orders them into a ranked list with the best match on top.">
      <Stage<Scene> width={800} height={500} initial={initial} poster={poster} script={playing ? script : undefined} play="loop" fidelity="standard" accent="#0b4fd1" greys="cool" cursor={{ at: { x: 690, y: 96 }, idle: 1400 }} className="cnc-scene">
        {(s) => {
          const order = s.ranked ? ranked : candidates;
          const done = s.collected === TOTAL;
          const phase = done ? 'done' : s.collecting ? 'collecting' : 'idle';
          const pct = Math.round((s.collected / TOTAL) * 100);
          return <>
            <span className="cnc-rest" data-target="rest" />
            <div className="cnc-composition" data-resetting={s.resetting || undefined}>
              {/* The web app: whole across, bled off the right and bottom. */}
              <Window
                className="cnc-app"
                url="app.connectnova.com/senior-pm"
                body={{ className: 'cnc-app__body' }}
              >
                <header className="cnc-head">
                  <div className="cnc-title">Senior Product Manager · San Francisco</div>
                  <div className="cnc-sub" data-target="app-count"><Roll variant="fade">{String(s.collected)}</Roll> <span>candidates</span><i>·</i><Roll variant="fade">{s.ranked ? 'Ranked by fit' : 'Unranked'}</Roll></div>
                </header>

                <section className="cnc-card cnc-req">
                  <Field label="Hiring requirements" value={s.typed} placeholder="Describe the ideal candidate…" focused={s.focused} box={{ 'data-target': 'req-field', 'data-cursor': 'ibeam' }}
                    trailing={<Button data-target="rank-btn" variant="primary" size="small" icon={s.ranking ? <Spinner size={11} /> : s.ranked ? <CheckIcon size={12} strokeWidth={2.4} /> : undefined}>{s.ranking ? 'Ranking' : s.ranked ? 'Ranked' : 'Start ranking'}</Button>} />
                </section>

                <section className="cnc-card cnc-list" style={{ height: ROW * TOTAL + 16 }}>
                  {candidates.map((c, i) => {
                    const real = s.collected > i;
                    const slot = order.indexOf(c);
                    const best = s.ranked && c.id === 'marco';
                    return <div key={c.id} className="cnc-slot" data-real={real || undefined} style={{ transform: `translateY(${slot * ROW}px)`, transitionDelay: s.ranked ? `${slot * 70}ms` : '0ms' }}>
                      <div className="cnc-skeleton"><span className="cnc-li__lead"><Avatar plain size={28} /></span><div className="cnc-skeleton__lines"><Bar w={96 + (i % 3) * 18} h={6} /><Bar w={64 + (i % 2) * 22} h={5} tone={2} /></div></div>
                      <Row className="cnc-row" pad={8} selected={best || undefined}
                        lead={<Avatar name={c.name} size={28} />}
                        title={<Text className="cnc-name">{c.name}</Text>}
                        subtitle={<Text className="cnc-role">{c.role}</Text>}
                      >
                        <span className="cnc-trail">
                          <span className="cnc-trail__score" data-on={s.ranked || undefined}>
                            <Meter value={s.ranked ? c.score / 100 : 0} tone={best ? 'accent' : 'ink'} className="cnc-meter" />
                            <b data-best={best || undefined}><Count value={s.ranked ? c.score : 0} duration={750} /></b>
                          </span>
                        </span>
                      </Row>
                    </div>;
                  })}
                </section>
              </Window>

              {/* LinkedIn: the source. Cropped by the left and bottom edges, never whole. */}
              <Window className="cnc-li" url="linkedin.com/search" body={{ className: 'cnc-li__body' }}>
                <div className="cnc-li__main">
                  <div className="cnc-li__list">
                    {candidates.map((c, i) => <div key={c.id} className="cnc-li__row">
                      <Check on={s.collected > i} pending={s.collecting && s.collected === i} size={16} />
                      <span className="cnc-li__lead"><Avatar name={c.name} size={32} /></span>
                      <span className="cnc-li__who"><Text className="cnc-li__name">{c.name}</Text><Text className="cnc-li__role">{c.role}</Text></span>
                    </div>)}
                  </div>
                </div>
              </Window>

              {/* The extension popup, hung from the browser bar. */}
              <div className="cnc-ext">
                <div className="cnc-ext__head"><img src="/img/connectnova/extension-logo.png" alt="" width={16} height={16} /><span>ConnectNova</span><X size={12} strokeWidth={1.75} /></div>
                <div className="cnc-ext__card">
                  <States value={phase} className="cnc-ext__states" align="start" states={{
                    idle: <div className="cnc-ext__pane">
                      <div className="cnc-ext__detected"><i />LinkedIn Search page detected</div>
                      <div className="cnc-ext__field"><small>PROJECT NAME</small><span>Senior PM · San Francisco</span></div>
                      <div className="cnc-ext__field"><small>COLLECTION MODE</small><span className="cnc-ext__seg"><b>By pages</b><em>By count</em></span></div>
                    </div>,
                    collecting: <div className="cnc-ext__pane">
                      <small className="cnc-ext__step">STEP 2</small>
                      <div className="cnc-ext__title">Collecting…</div>
                      <div className="cnc-ext__progress"><span>Progress</span><b><Count value={pct} format={(n) => `${n}%`} duration={350} /></b></div>
                      <Meter value={s.collected / TOTAL} className="cnc-ext__meter" />
                      <div className="cnc-ext__people">{(s.collected === 0 ? [] : s.collected === 1 ? [0] : [s.collected - 2, s.collected - 1]).map((i) => <div key={i} className="cnc-ext__person"><Avatar name={candidates[i].name} size={20} /><span><Text className="cnc-ext__pname">{candidates[i].name.split(' ')[0]}</Text></span><Badge tone={i === s.collected - 1 && s.collected < TOTAL ? 'accent' : 'success'}>{i === s.collected - 1 && s.collected < TOTAL ? 'Collecting…' : 'Collected'}</Badge></div>)}</div>
                    </div>,
                    done: <div className="cnc-ext__pane">
                      <small className="cnc-ext__step" data-done>COMPLETED</small>
                      <div className="cnc-ext__title">Collection finished</div>
                      <div className="cnc-ext__where">Senior PM · San Francisco</div>
                      <div className="cnc-ext__total"><small>TOTAL PROFILES COLLECTED</small><b>{TOTAL}</b></div>
                      <div className="cnc-ext__saved"><CheckIcon size={12} strokeWidth={2.4} />Collection saved</div>
                    </div>,
                  }} />
                </div>
                <Button data-target="collect-btn" variant="primary" size="medium" className="cnc-ext__button" trailingIcon={phase !== 'collecting' ? <ArrowRight size={12} strokeWidth={2} /> : undefined}>{done ? 'Go to Rank' : s.collecting ? 'Collecting' : 'Start Collection'}</Button>
              </div>
            </div>
          </>;
        }}
      </Stage>
    </figure>
  );
}
