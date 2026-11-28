import s from './UserFlow.module.css';

/**
 * MemQ's user flow, as the app routes it (app/index, onboarding, (tabs)/index, create,
 * create-chat, import-cards, quiz, practice-chat; schedule from _shared/scheduler,
 * reminders from lib/notificationService). 
 */

type Step = { title: string; note: string };


function Box({ step, tone }: { step: Step; tone?: 'end' | 'quiet' }) {
  return (
    <div className={`${s.box} ${tone === 'end' ? s.end : ''} ${tone === 'quiet' ? s.quiet : ''}`}>
      <span className={s.boxHead}><b>{step.title}</b></span>
      <span className={s.note}>{step.note}</span>
    </div>
  );
}

const FIRST: string[] = ['Sign in', 'Onboarding', 'Today, empty: one next step', 'Make a first lesson'];

const DOORS: Step[] = [
  { title: 'Create', note: 'Type a topic or add a PDF' },
  { title: 'Learn something', note: 'Ask; it explains first' },
  { title: 'Use my own AI', note: 'Paste a reply from any AI' },
];

export function UserFlow() {
  return (
    <div className={s.flow}>
      <ol className={s.first} aria-label="The first time">
        <li className={s.firstLabel} aria-hidden="true">First time</li>
        {FIRST.map((t) => <li key={t} className={s.chip}>{t}</li>)}
      </ol>

      <div className={s.cols}>
        {/* 1 · Get it in */}
        <section className={s.col} aria-label="Get it in">
          <header className={s.colHead}><span>1</span><div><b>Get it in</b><em>What you looked up becomes cards, without the chore.</em></div></header>
          <ol className={s.steps}>
            <li>
              <p className={s.fork}>Three ways in</p>
              <div className={s.doors}>{DOORS.map((d) => <Box key={d.title} step={d} />)}</div>
              <p className={s.branch}>Out of credits? Use my own AI, or See Pro.</p>
            </li>
            <li><Box step={{ title: 'Drafts', note: 'Tick the cards worth keeping' }} /></li>
            <li><Box step={{ title: 'Pick or name a lesson', note: 'Nothing is saved before this' }} /></li>
          </ol>
        </section>

        {/* 2 · Bring it back */}
        <section className={s.col} aria-label="Bring it back">
          <header className={s.colHead}><span>2</span><div><b>Bring it back</b><em>Each card is asked again just before it would be forgotten.</em></div></header>
          <ol className={s.steps}>
            <li>
              <div className={s.pair}>
                <Box step={{ title: 'Today', note: 'What is due, and one Start button' }} />
                <Box tone="quiet" step={{ title: 'Ask a question', note: 'Talk it through; it offers a round' }} />
              </div>
            </li>
            <li><Box step={{ title: 'A round of practice', note: 'New cards: seen, recognised, then produced. Familiar ones: produced. Free.' }} /></li>
            <li><Box step={{ title: 'Marked', note: 'The slip is shown, and you can overrule' }} /></li>
            <li>
              <div className={s.pair}>
                <Box step={{ title: 'Right', note: 'Next stage: 1 · 3 · 7 · 14 · 30 days, then doubling' }} />
                <Box tone="quiet" step={{ title: 'Missed', note: 'Back in 10 minutes, one stage down' }} />
              </div>
            </li>
          </ol>
        </section>

        {/* 3 · Come back */}
        <section className={s.col} aria-label="Come back tomorrow">
          <header className={s.colHead}><span>3</span><div><b>Come back tomorrow</b><em>A reason to open the app when it calls.</em></div></header>
          <ol className={s.steps}>
            <li><Box step={{ title: 'A reminder', note: 'At the times you choose' }} /></li>
            <li><Box step={{ title: 'Today, with Inkling', note: 'It reacts to what you did' }} /></li>
            <li><Box step={{ title: 'Streak', note: 'Each day you answer a review counts. On Today and You.' }} /></li>
            <li><Box step={{ title: 'You', note: 'Progress charts, from every answer' }} /></li>
            <li className={s.endStep}><Box tone="end" step={{ title: '↺ Back to Today', note: 'The loop starts again with what is due' }} /></li>
          </ol>
        </section>

        <div className={s.loop} aria-hidden="true"><span>Next day: back to Today, with what is due</span></div>
      </div>
    </div>
  );
}
