'use client';

/**
 * A playable rebuild of MemQ's practice screen (app/quiz.tsx), at the app's own 402 × 874
 * layout, scaled into the phone frame. Behaviour follows the app:
 *
 * - Choice questions answer on tap. The footer button is held invisible until then, and only
 *   ever says Continue. A miss shows "Let's try again", the right option dashed green and the
 *   pick outlined; the card can be turned over for the answer and its explanation.
 * - Matching has no button. Either side first, a made pair goes green and leaves, the next
 *   arrives in its rows; a wrong pair is marked and both cards come round once more. When the
 *   board is empty the round moves on by itself. Board rules are the app's lib/matchBoard.
 * - Typed answers use the composer above the keyboard, with Don't know. Spelling is marked by
 *   its letters with every slip shown; a meaning the words leave open shows "Checking your
 *   answer…", and a miss can be overruled. Marking is the app's lib/answerCheck.
 * - Listening says the word when it appears; "Can't listen now" trades it for a question that
 *   can be read, unmarked.
 * - A missed step comes back once later in the round. Then: Practice complete.
 */

import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { geistSans, oswald } from '@/app/fonts';
import { checkMeaning, checkSpelling, type SpellingVerdict } from './answerCheck';
import { clearPair, isDone, isPair, missPair, rowsFor, startBoard, type Board, type Tile } from './matchBoard';
import { PhoneFrame } from './MemQPractice';
import q from './MemQQuiz.module.css';
import showcase from '../def-erp-kit/DesignSystemShowcase.module.css';
import { CaseButton } from '../../components/case-kit/CaseButton';

/* ───────────────────────── Demonstration deck ───────────────────────── */

const TOPIC = 'Everyday English';
const CARD = {
  term: 'give up',
  definition: 'to stop trying to do something',
  explain: '“Give up” means to stop trying, or to stop doing something you have started. It is separable: “give it up”.',
  pronunciation: '/ɡɪv ʌp/',
  pos: 'phrasal verb',
  example: 'Do not give up before you have really tried.',
};
const PAIRS = [
  { left: 'borrow', right: 'to take something and return it later' },
  { left: 'give up', right: 'to stop trying to do something' },
  { left: 'crowded', right: 'full of people' },
  { left: 'café', right: 'a small restaurant' },
  { left: 'look after', right: 'to take care of someone or something' },
  { left: 'accommodate', right: 'to provide a place to stay' },
];

export type Choice = { kind: 'mcq'; topic?: string; chip: string; prompt: string; q: string; long?: boolean; opts: string[]; correct: number; audio?: boolean };
type Recall = { kind: 'recall'; chip: string; placeholder: string; q: string; answer: string; answerKind: 'meaning' | 'spelling'; audio?: boolean; long?: boolean };
type FormKey = 'flip' | 'match' | 'gap' | 'heard' | 'synonym' | 'meaning' | 'dictation' | 'build';

const CHOICES: Partial<Record<FormKey, Choice>> = {
  gap: { kind: 'mcq', chip: 'Fill the gap', prompt: 'Choose the word that fits', q: 'Do not _____ before you have really tried.', long: true, opts: ['borrow', 'give up', 'look after', 'accommodate'], correct: 1 },
  heard: { kind: 'mcq', chip: 'Listen', prompt: 'Choose the meaning of what you heard', q: 'give up', opts: ['to take something and return it later', 'to stop trying to do something', 'a past habit that is no longer true', 'a long trip'], correct: 1, audio: true },
  synonym: { kind: 'mcq', chip: 'Synonym', prompt: 'Choose the word closest in meaning', q: 'give up', opts: ['persist', 'borrow', 'quit', 'look after'], correct: 2 },
};
/** What "Can't listen now" trades a heard question for: the same card, read. */
const READ_INSTEAD: Choice = { kind: 'mcq', chip: 'Choose', prompt: 'Choose the meaning', q: 'give up', opts: ['to take care of someone or something', 'to stop trying to do something', 'full of people', 'to provide a place to stay'], correct: 1 };
const RECALLS: Partial<Record<FormKey, Recall>> = {
  meaning: { kind: 'recall', chip: 'Recall', placeholder: 'Type the meaning', q: 'give up', answer: CARD.definition, answerKind: 'meaning' },
  dictation: { kind: 'recall', chip: 'Listen', placeholder: 'Type what you hear', q: 'accommodate', answer: 'accommodate', answerKind: 'spelling', audio: true },
};
const BUILD = { answer: ['Do', 'not', 'give', 'up', 'before', 'you', 'have', 'really', 'tried'], tiles: ['you', 'give', 'before', 'really', 'tried', 'Do', 'have', 'up', 'not'] };

/* ───────────────────────── Shared pieces ───────────────────────── */

/** The scripted demo plays silently; speech comes back when the visitor drives. */
let speechMuted = true;
/** Says the text. Returns whether speech actually started; `onEnd` fires when it finishes. */
function speak(text: string, rate: number, onEnd?: () => void) {
  if (speechMuted) return false;
  try {
    const synth = window.speechSynthesis;
    if (!synth) return false;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = rate;
    if (onEnd) { u.onend = onEnd; u.onerror = onEnd; }
    synth.speak(u);
    return true;
  } catch { return false; }
}

/**
 * Whether something is playing, for drawing it. Real speech ends the animation when it ends;
 * a silent demo play lasts as long as the word would take to say at that rate.
 */
function usePlayback() {
  const [playing, setPlaying] = useState<null | 'normal' | 'slow'>(null);
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const stop = () => { window.clearTimeout(timer.current); setPlaying(null); };
  const play = (text: string, rate: number) => {
    const estimate = Math.max(900, (text.length * 95) / rate + 350);
    setPlaying(rate < 0.7 ? 'slow' : 'normal');
    window.clearTimeout(timer.current);
    const spoken = speak(text, rate, stop);
    timer.current = window.setTimeout(stop, spoken ? estimate + 2500 : estimate);
    return spoken;
  };
  return { playing, play };
}

/** The speaker, its two waves pulsing outward while it plays. */
function Speaker({ size, playing }: { size: number; playing: null | 'normal' | 'slow' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      className={playing ? `${q.speaking} ${playing === 'slow' ? q.speakingSlow : ''}` : undefined}>
      <path d="M11 5 6 9H2v6h4l5 4V5z" className={q.speakerBody} />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" className={q.waveNear} />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" className={q.waveFar} />
    </svg>
  );
}

const Feather = {
  x: <path d="M18 6 6 18M6 6l12 12" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68 1.65 1.65 0 0 0 10 3.17V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
  arrow: <path d="M5 12h14M12 5l7 7-7 7" />,
  check: <path d="M20 6 9 17l-5-5" />,
};
export function Icon({ name, size = 22 }: { name: keyof typeof Feather; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{Feather[name]}</svg>;
}

export function StatusBar() {
  return (
    <div className={q.status} aria-hidden="true">
      <span>09:41</span>
      <span className={q.island} />
      <span className={q.statusIcons}>
        <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3.2" height="4" rx="1" /><rect x="4.8" y="5.5" width="3.2" height="6.5" rx="1" /><rect x="9.6" y="3" width="3.2" height="9" rx="1" /><rect x="14.4" y="0" width="3.2" height="12" rx="1" /></svg>
        <svg width="26" height="13" viewBox="0 0 26 13"><rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".45" /><rect x="2.5" y="2.5" width="18" height="8" rx="2" fill="#34c759" /><rect x="23.5" y="4.5" width="2" height="4" rx="1" opacity=".45" /></svg>
      </span>
    </div>
  );
}

/** Lipped primary button: a face on a deep shell; pressing uses the lip up. */
function Cta({ label, onClick, disabled, hidden }: { label: string; onClick: () => void; disabled?: boolean; hidden?: boolean }) {
  return (
    <div className={q.footer} aria-hidden={hidden || undefined}>
      <button type="button" className={`${q.cta} ${disabled ? q.ctaDisabled : ''} ${hidden ? q.invisible : ''}`} onClick={onClick} disabled={disabled || hidden} tabIndex={hidden ? -1 : undefined}>
        <span className={q.ctaFace}>{label}</span>
      </button>
    </div>
  );
}

function PlayButton({ text }: { text: string }) {
  const { playing, play } = usePlayback();
  return <button type="button" className={`${q.playSmall} ${playing ? q.playSmallOn : ''}`} onClick={() => play(text, 0.9)} aria-label={`Play ${text}`}><Speaker size={18} playing={playing} /></button>;
}

/** Heard, not read: says the word as it appears; again, slowly, or traded away. */
function ListenPrompt({ text, onCannotListen }: { text: string; onCannotListen?: () => void }) {
  const { playing, play } = usePlayback();
  useEffect(() => {
    const id = window.setTimeout(() => play(text, 0.9), 250);
    return () => { window.clearTimeout(id); try { window.speechSynthesis?.cancel(); } catch { /* nothing speaking */ } };
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={q.listen}>
      <div className={q.listenButtons}>
        <button type="button" className={`${q.play} ${playing ? q.playOn : ''} ${playing === 'slow' ? q.playOnSlow : ''}`} aria-label="Play again" onClick={() => play(text, 0.9)}>
          <span className={q.playFace}><Speaker size={30} playing={playing} /></span>
        </button>
        <button type="button" className={`${q.slow} ${playing === 'slow' ? q.slowOn : ''}`} aria-label="Play slowly" onClick={() => play(text, 0.55)}>Slow</button>
      </div>
      {onCannotListen && <button type="button" className={q.cannot} onClick={onCannotListen}>Can’t listen now</button>}
    </div>
  );
}

/* ───────────────────────── Question card host ───────────────────────── */

type Answer = { correct: boolean };

/** Turning a card over: a quarter turn out, swap the face, a quarter turn back in (150 ms each, as in the app). */
type Turn = { shown: boolean; cls: string; go: (next: boolean) => void };
function useTurn(): Turn {
  const [shown, setShown] = useState(false);
  const [phase, setPhase] = useState<'none' | 'out' | 'in'>('none');
  const go = (next: boolean) => {
    if (phase !== 'none') return;
    setPhase('out');
    window.setTimeout(() => { setShown(next); setPhase('in'); window.setTimeout(() => setPhase('none'), 150); }, 150);
  };
  return { shown, cls: phase === 'out' ? q.turnOut : phase === 'in' ? q.turnIn : '', go };
}

/** The fixed question card that can be turned over for the answer and its explanation. */
function QuestionCard({ chip, children, back, turn, topic = TOPIC, explain = CARD.explain, details = true }: { chip: string; children: ReactNode; back?: { answer: string }; turn: Turn; topic?: string; explain?: string; details?: boolean }) {
  return (
    <div className={`${q.card} ${turn.cls}`}>
      <div className={q.topicRow}><span className={q.topic}>{topic}</span>{chip && <span className={q.modeChip}>{chip}</span>}</div>
      {turn.shown && back ? (
        <div className={q.backArea}>
          <div className={q.backScroll}>
            <div className={q.correctBox}><span className={q.exTitle}>Correct answer</span><span className={q.correctText}>{back.answer}</span></div>
            <div className={q.explanation}><span className={q.exTitle}>Explanation</span><p>{explain}</p></div>
            {details && <div className={q.langDetails}>
              <span><b>Pronunciation</b> {CARD.pronunciation}</span>
              <span><b>Type</b> {CARD.pos}</span>
              <span><b>Example</b> {CARD.example}</span>
            </div>}
          </div>
          <button type="button" className={q.exLink} onClick={() => turn.go(false)}>Tap to see your answer again</button>
        </div>
      ) : children}
    </div>
  );
}

/* ── Multiple choice: answering is the tap ── */
export function ChoiceQuestion({ question, onDone, onCannotListen, explain }: { question: Choice; onDone: (a: Answer) => void; onCannotListen?: () => void; explain?: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const card = useTurn();
  const revealed = selected !== null;
  const right = selected === question.correct;
  const isAudio = !!question.audio;
  const showPlay = revealed || (!isAudio && question.q === CARD.term);
  return (
    <>
      <QuestionCard chip={question.chip} turn={card} back={{ answer: question.opts[question.correct] }} topic={question.topic} explain={explain} details={!question.topic}>
        <div className={q.questionArea}>
          <div className={q.retrySlot}>{revealed && !right && <span className={q.retryBadge}>Let’s try again</span>}</div>
          {isAudio && !revealed
            ? <ListenPrompt text={question.q} onCannotListen={onCannotListen} />
            : <p className={`${q.qText} ${question.long ? q.qTextLong : ''}`}>{question.q}</p>}
          {showPlay && !question.topic && <PlayButton text={CARD.term} />}
        </div>
        <div className={q.answerArea}>
          <span className={`${q.answerPrompt} ${revealed ? (right ? q.green : q.warn) : ''}`}>{revealed ? (right ? 'You got it!' : 'Keep going — learning takes practice.') : question.prompt}</span>
          <div className={q.mcq} role="radiogroup">
            {question.opts.map((opt, i) => {
              const isCorrect = i === question.correct;
              const cls = [q.row, revealed && isCorrect && q.rowCorrect, revealed && isCorrect && !right && q.rowDashed, revealed && !right && selected === i && q.rowWrong].filter(Boolean).join(' ');
              return <button key={opt} type="button" role="radio" aria-checked={selected === i} disabled={revealed} className={cls} onClick={() => setSelected(i)}>{opt}</button>;
            })}
          </div>
          <div className={q.exSlot}>{revealed && <button type="button" className={q.exLink} onClick={() => card.go(true)}>Tap to reveal explanation</button>}</div>
        </div>
      </QuestionCard>
      <Cta label="Continue →" hidden={!revealed} onClick={() => onDone({ correct: right })} />
    </>
  );
}

/* ── Typed answers: composer, Don't know, marking, overrule ── */
type RecallVerdict = { correct: boolean; skipped: boolean; spelling?: SpellingVerdict; canOverrule: boolean };

/** Stands in for the app's grade-answer model, which reads a meaning for sense. */
const judge = (text: string) => /\b(quit|quits|quitting|stop|stops|stopping|abandon|surrender|cease|no longer|give in|throw in the towel)\b/i.test(text);

/** How the app marks a typed answer, without the wait for the meaning judge. */
function markRecall(question: Recall, text: string, skipped: boolean): RecallVerdict | 'judge' {
  if (question.answerKind === 'spelling') {
    const spelling = checkSpelling(skipped ? '' : text, question.answer, 'relaxed');
    return { correct: !skipped && spelling.result !== 'wrong', skipped, spelling, canOverrule: false };
  }
  if (skipped) return { correct: false, skipped: true, canOverrule: false };
  const local = checkMeaning(text, question.answer, 'relaxed');
  if (local.result === 'correct' || local.confident) return { correct: local.result === 'correct', skipped: false, canOverrule: local.result !== 'correct' };
  return 'judge';
}
const judged = (text: string): RecallVerdict => { const right = judge(text); return { correct: right, skipped: false, canOverrule: !right }; };

/** `answered`: open on the marked result of this answer, as the screen looks right after Submit. */
function RecallQuestion({ question, onDone, answered }: { question: Recall; onDone: (a: Answer) => void; answered?: string }) {
  const [text, setText] = useState(answered ?? '');
  const [checking, setChecking] = useState(false);
  const [verdict, setVerdict] = useState<RecallVerdict | null>(() => {
    if (answered === undefined) return null;
    const marked = markRecall(question, answered, false);
    return marked === 'judge' ? judged(answered) : marked;
  });
  const card = useTurn();
  const input = useRef<HTMLTextAreaElement>(null);
  const revealed = !!verdict;

  const submit = (skipped = false) => {
    const marked = markRecall(question, text, skipped);
    if (marked !== 'judge') { setVerdict(marked); return; }
    setChecking(true);
    window.setTimeout(() => { setChecking(false); setVerdict(judged(text)); }, 1100);
  };

  const differs = text.trim().toLowerCase() !== question.answer.trim().toLowerCase();
  return (
    <>
      <QuestionCard chip={question.chip} turn={card} back={{ answer: question.answer }}>
        <div className={q.questionArea}>
          {question.audio && !revealed
            ? <ListenPrompt text={question.q} />
            : <p className={`${q.qText} ${question.long ? q.qTextLong : ''}`}>{question.q}</p>}
          {revealed && <PlayButton text={question.answerKind === 'spelling' ? question.answer : question.q} />}
        </div>
        <div className={q.answerArea}>
          {checking && <div className={q.checking} aria-live="polite"><span className={q.spinner} />Checking your answer…</div>}
          {verdict?.spelling && <SpellingResult verdict={verdict.spelling} skipped={verdict.skipped} />}
          {verdict && !verdict.spelling && (
            <div className={q.result}>
              <span className={`${q.answerPrompt} ${verdict.correct ? q.green : q.warn}`}>{verdict.skipped ? 'Give this one another try later' : verdict.correct ? 'You got it!' : 'Keep going — learning takes practice.'}</span>
              <div className={`${q.resultBox} ${verdict.correct ? q.boxGreen : q.boxOrange}`}>{verdict.skipped ? 'Skipped' : text}</div>
              {(!verdict.correct || differs) && <>
                <span className={`${q.answerPrompt} ${q.green}`}>{verdict.correct ? 'On the card' : 'Correct answer'}</span>
                <div className={`${q.resultBox} ${q.boxGreen}`}>{question.answer}</div>
              </>}
              {verdict.canOverrule && !verdict.correct && <button type="button" className={q.overrule} onClick={() => setVerdict({ ...verdict, correct: true, canOverrule: false })}>My answer means the same</button>}
            </div>
          )}
          {revealed && <div className={q.exSlot}><button type="button" className={q.exLink} onClick={() => card.go(true)}>Tap to reveal explanation</button></div>}
        </div>
      </QuestionCard>
      {!revealed && !checking ? (
        <div className={q.composer}>
          <textarea ref={input} rows={1} className={q.composerInput} placeholder={question.placeholder} value={text} aria-label={question.placeholder}
            onChange={(e) => setText(e.target.value)} spellCheck={question.answerKind !== 'spelling'} autoCapitalize="none" autoCorrect="off"
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (text.trim()) submit(); } }} />
          <button type="button" className={q.skip} onClick={() => submit(true)}>Don’t know</button>
          <button type="button" className={q.submit} aria-label="Submit answer" disabled={!text.trim()} onClick={() => submit()}><Icon name="arrow" size={20} /></button>
        </div>
      ) : <Cta label={checking ? 'Checking…' : 'Continue →'} disabled={checking} onClick={() => verdict && onDone({ correct: verdict.correct })} />}
    </>
  );
}

function SpellingResult({ verdict, skipped }: { verdict: SpellingVerdict; skipped: boolean }) {
  const { result } = verdict;
  const heading = skipped ? 'Give this one another try later'
    : result === 'correct' ? 'You got it!'
      : result === 'almost' ? (verdict.accentsOnly ? 'Almost — mind the accents' : 'Almost — check the spelling')
        : 'Not quite — compare the spelling';
  return (
    <div className={q.result}>
      <span className={`${q.answerPrompt} ${result === 'correct' ? q.green : q.warn}`}>{heading}</span>
      <div className={`${q.resultBox} ${q.spellText} ${result === 'correct' ? q.boxGreen : q.boxOrange}`}>
        {skipped ? 'Skipped' : verdict.typed.map((m, i) => <span key={i} className={m.ok ? undefined : q.slip}>{m.text}</span>)}
      </div>
      {result !== 'correct' && <>
        <span className={`${q.answerPrompt} ${q.green}`}>Correct spelling</span>
        <div className={`${q.resultBox} ${q.spellText} ${q.boxGreen}`}>
          {verdict.expected.map((m, i) => <span key={i} className={m.ok || skipped ? undefined : q.missed}>{m.text}</span>)}
        </div>
      </>}
    </div>
  );
}

/* ── Building a sentence ── */
const buildKey = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}'’-]/gu, '');
function BuildQuestion({ onDone }: { onDone: (a: Answer) => void }) {
  const [placed, setPlaced] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const card = useTurn();
  const correct = placed.length === BUILD.answer.length && placed.every((t, i) => buildKey(BUILD.tiles[t]) === buildKey(BUILD.answer[i]));
  const rows = Math.max(2, Math.ceil(BUILD.tiles.length / 3));
  return (
    <>
      <QuestionCard chip="Build" turn={card} back={{ answer: BUILD.answer.join(' ') }}>
        <div className={q.briefQuestion}><p className={`${q.qText} ${q.qTextLong}`}>Build a sentence with “give up”</p></div>
        <div className={q.answerArea}>
          <span className={`${q.answerPrompt} ${revealed ? (correct ? q.green : q.warn) : ''}`}>{revealed ? (correct ? 'You got it!' : 'Keep going — learning takes practice.') : 'Tap the words in order'}</span>
          <div className={q.buildScroll}>
            <div data-line className={`${q.line} ${revealed ? (correct ? q.lineRight : q.lineWrong) : ''}`} style={revealed ? undefined : { minHeight: 24 + rows * 52 }}>
              {placed.length === 0 && <span className={q.placeholder}>Your sentence</span>}
              {placed.map((t, pos) => <button key={t} type="button" disabled={revealed} className={q.word} onClick={() => setPlaced((p) => p.filter((_, i) => i !== pos))}>{BUILD.tiles[t]}</button>)}
            </div>
            {revealed ? (!correct && <div className={q.answerBox}><span>Correct sentence</span><p>{BUILD.answer.join(' ')}</p></div>) : (
              <div data-bank className={q.bank}>
                {BUILD.tiles.map((w, t) => {
                  const used = placed.includes(t);
                  return <button key={t} type="button" disabled={used} className={`${q.word} ${used ? q.used : ''}`} onClick={() => setPlaced((p) => [...p, t])}>{w}</button>;
                })}
              </div>
            )}
          </div>
          {revealed && <div className={q.exSlot}><button type="button" className={q.exLink} onClick={() => card.go(true)}>Tap to reveal explanation</button></div>}
        </div>
      </QuestionCard>
      <Cta label={revealed ? 'Continue →' : 'Check'} disabled={!revealed && placed.length !== BUILD.tiles.length} onClick={() => (revealed ? onDone({ correct }) : setRevealed(true))} />
    </>
  );
}

/* ── Matching: no button; the board finishes the question ── */
const ROW_MIN = 74, ROW_MAX = 92, GAP = 8;
const LEAVE_MS = 300, WRONG_MS = 550;
function MatchQuestion({ onDone }: { onDone: (a: Answer) => void }) {
  const area = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [board, setBoard] = useState<Board | null>(null);
  const [picked, setPicked] = useState<{ side: 'left' | 'right'; id: number } | null>(null);
  const [leaving, setLeaving] = useState<number[]>([]);
  const [wrong, setWrong] = useState<{ left: number; right: number } | null>(null);
  const missed = useRef(new Set<number>());
  const finished = useRef(false);
  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const h = el.offsetHeight;
      if (h <= 0) return;
      setHeight(h);
      // Laid out once, when the room it has is known.
      setBoard((b) => b ?? startBoard([3, 0, 5, 1, 4, 2, 1, 4, 0, 2, 5, 3], rowsFor(h, PAIRS.length, ROW_MIN, GAP)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (!board || finished.current || !isDone(board)) return;
    finished.current = true;
    const t = window.setTimeout(() => onDone({ correct: !missed.current.has(1) }), 450);
    return () => window.clearTimeout(t);
  }, [board, onDone]);
  const rows = board?.left.length ?? 0;
  const rowHeight = rows ? Math.max(ROW_MIN, Math.min(ROW_MAX, Math.floor((height - GAP * (rows - 1)) / rows))) : ROW_MIN;

  const press = (side: 'left' | 'right', tile: Tile) => {
    if (!board || wrong || leaving.includes(tile.id)) return;
    if (!picked || picked.side === side) {
      setPicked(picked?.side === side && picked.id === tile.id ? null : { side, id: tile.id });
      return;
    }
    const leftId = side === 'left' ? tile.id : picked.id;
    const rightId = side === 'right' ? tile.id : picked.id;
    setPicked(null);
    if (isPair(board, leftId, rightId)) {
      setLeaving((ids) => [...ids, leftId, rightId]);
      window.setTimeout(() => {
        setBoard((b) => (b ? clearPair(b, leftId, rightId) : b));
        setLeaving((ids) => ids.filter((id) => id !== leftId && id !== rightId));
      }, LEAVE_MS);
      return;
    }
    for (const [column, id] of [[board.left, leftId], [board.right, rightId]] as const) {
      const touched = column.find((t) => t?.id === id);
      if (touched) missed.current.add(touched.pair);
    }
    setBoard(missPair(board, leftId, rightId));
    setWrong({ left: leftId, right: rightId });
    window.setTimeout(() => setWrong(null), WRONG_MS);
  };
  const cell = (side: 'left' | 'right', tile: Tile | null, row: number) => {
    if (!tile) return <span key={`${side}-e-${row}`} className={`${q.tile} ${q.tileEmpty}`} style={{ height: rowHeight }} />;
    const text = PAIRS[tile.pair][side];
    const done = leaving.includes(tile.id);
    const chosen = picked?.side === side && picked.id === tile.id;
    const mistaken = !!wrong && wrong[side] === tile.id;
    return (
      <button key={tile.id} type="button" data-side={side} disabled={done} onClick={() => press(side, tile)} style={{ height: rowHeight }}
        className={[q.tile, side === 'left' ? q.term : q.meaning, chosen && q.tileChosen, mistaken && q.tileWrong, done && q.tileDone].filter(Boolean).join(' ')}>{text}</button>
    );
  };
  return (
    <div className={`${q.card} ${q.matchCard}`}>
      <div className={q.topicRow}><span className={q.topic}>{TOPIC}</span><span className={q.modeChip}>Match</span></div>
      <div className={q.matchHead}><span className={q.answerPrompt}>Tap a word, then its meaning</span>{board && <b>{board.made}/{board.total}</b>}</div>
      <div ref={area} className={q.matchArea}>
        {board && <div className={q.board}>
          <div className={`${q.column} ${q.words}`}>{board.left.map((t, r) => cell('left', t, r))}</div>
          <div className={`${q.column} ${q.meanings}`}>{board.right.map((t, r) => cell('right', t, r))}</div>
        </div>}
      </div>
    </div>
  );
}

/* ── Flashcard: the Look step ── */
function FlipQuestion({ onDone }: { onDone: (a: Answer) => void }) {
  const card = useTurn();
  const shown = card.shown;
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [leaving, setLeaving] = useState(0);
  const drag = useRef<{ x: number; moved: boolean; scale: number } | null>(null);
  const decide = (got: boolean) => {
    setLeaving(got ? 1 : -1);
    window.setTimeout(() => onDone({ correct: got }), 200);
  };
  const pos = leaving ? leaving * 520 : dx;
  return (
    <div className={q.flipWrap}>
      <div className={q.swipeBg} style={{ background: pos > 0 ? `linear-gradient(135deg, rgb(198 240 214 / ${Math.min(1, pos / 110)}), transparent 70%)` : pos < 0 ? `linear-gradient(225deg, rgb(248 205 200 / ${Math.min(1, -pos / 110)}), transparent 70%)` : 'none' }} />
      <div className={q.swipeLabels} aria-hidden="true">
        <span className={q.gotIt} style={{ opacity: Math.min(1, Math.max(0, pos / 80)) }}><span><Icon name="check" /></span>I got it</span>
        <span className={q.needReview} style={{ opacity: Math.min(1, Math.max(0, -pos / 100)) }}><span><Icon name="x" /></span>Need review</span>
      </div>
      <div data-flip className={q.flipMove} style={{ transform: `translateX(${pos}px) rotate(${(pos / 402) * 10}deg)`, transition: dragging ? 'none' : 'transform .2s ease' }}
        onPointerDown={(e) => { drag.current = { x: e.clientX, moved: false, scale: (e.currentTarget.getBoundingClientRect().width / e.currentTarget.offsetWidth) || 1 }; setDragging(true); try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* a scripted pointer has nothing to capture */ } }}
        onPointerMove={(e) => { if (!drag.current) return; const d = (e.clientX - drag.current.x) / drag.current.scale; if (Math.abs(d) > 12) drag.current.moved = true; if (drag.current.moved) setDx(d); }}
        onPointerUp={() => {
          const moved = drag.current?.moved; drag.current = null; setDragging(false);
          if (!moved) { setDx(0); card.go(!shown); return; }
          if (Math.abs(dx) > 100) decide(dx > 0); else setDx(0);
        }}>
        <div className={`${q.flipCard} ${shown ? q.flipBack : ''} ${card.cls}`} role="button" tabIndex={0} aria-label={shown ? 'Show front of card' : 'Reveal answer'}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.go(!shown); } }}>
          <div className={q.flipHeader}><span className={q.topic}>{TOPIC}</span><span className={q.flashBadge}>Flashcard</span></div>
          {shown ? (
            <div className={q.backLayout}>
              <div className={q.backQuestion}><span className={q.label}>Term</span><span className={q.termRevealed}>{CARD.term}</span></div>
              <div className={q.meaningBox}><span>Meaning</span><p>{CARD.definition}</p></div>
              <div className={q.explanation}><span className={q.label}>Explanation</span><p>{CARD.explain}</p></div>
            </div>
          ) : (
            <div className={q.front}>
              <span className={q.label}>Term</span>
              <span className={q.bigTerm}>{CARD.term}</span>
              <span className={q.pron}>{CARD.pronunciation}</span>
              <span className={q.pos}>{CARD.pos}</span>
              <span onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()}><PlayButton text={CARD.term} /></span>
            </div>
          )}
          <span className={q.cornerHint}>{shown ? 'Tap to see question again' : 'Tap to reveal answer'}</span>
        </div>
      </div>
      {shown && <div className={q.confRow}>
        <button type="button" className={q.conf} style={{ color: '#B52F2F' }} onClick={() => decide(false)}>Need review</button>
        <button type="button" className={q.conf} style={{ color: '#4b2c78' }} onClick={() => decide(true)}>I got it</button>
      </div>}
    </div>
  );
}

/* ───────────────────────── Round ───────────────────────── */

const FORMS: { key: FormKey; label: string; step: 0 | 1 | 2; note: string }[] = [
  { key: 'flip', label: 'Flashcard', step: 0, note: 'Tap the card to turn it. Then press, or drag it right for I got it, left for Need review.' },
  { key: 'match', label: 'Match', step: 1, note: 'Either side first. A made pair leaves and the next arrives in its rows; a wrong pair sends both cards round once more. No button: the board ends the question.' },
  { key: 'gap', label: 'Fill the gap', step: 1, note: 'Tapping an option is the answer. Continue only appears once you have answered.' },
  { key: 'heard', label: 'Listen', step: 1, note: 'It speaks when it appears. Play, Slow, or “Can’t listen now” to trade it for a question you can read.' },
  { key: 'synonym', label: 'Synonym', step: 1, note: 'Same tap-to-answer rule. On a miss, the right option is dashed and the card can be turned over.' },
  { key: 'meaning', label: 'Own words', step: 2, note: 'Type the meaning however you would say it. Words the checker cannot settle are read for sense; a miss can be overruled.' },
  { key: 'dictation', label: 'Dictation', step: 2, note: 'Type what you hear. Relaxed marking lets a slip pass as “almost”, never as right, and shows every letter.' },
  { key: 'build', label: 'Build', step: 2, note: 'Tap the words in order; tap a placed word to send it back. Check, then Continue.' },
];
const LEVELS = [{ steps: [0, 1, 2] }];
const planFor = (level: number) => FORMS.filter((f) => LEVELS[level].steps.includes(f.step)).map((f) => f.key);

export function useScale() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / 402);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, scale };
}

/** One practice round in the phone, starting from `start`, then the rest of a new card's round. */
function PracticePhone({ start }: { start: FormKey }) {
  const [queue, setQueue] = useState<FormKey[]>(() => [start, ...planFor(0).filter((k) => k !== start)]);
  const [done, setDone] = useState(0);
  const [retried, setRetried] = useState<FormKey[]>([]);
  const [asked, setAsked] = useState(0);
  const [readInstead, setReadInstead] = useState(false);
  const { ref, scale } = useScale();
  const current = queue[0];
  const total = Math.max(1, done + queue.length);
  const restart = () => { setQueue(planFor(0)); setDone(0); setRetried([]); setAsked((a) => a + 1); setReadInstead(false); };
  // A miss keeps the step and asks it again later in the round: once, and only if something else comes between.
  const advance = ({ correct }: Answer) => {
    const [head, ...rest] = queue;
    setReadInstead(false);
    setAsked((a) => a + 1);
    if (!correct && !retried.includes(head) && rest.length > 0) {
      setRetried((r) => [...r, head]);
      setQueue([...rest, head]);
      return;
    }
    setQueue(rest);
    setDone((d) => d + 1);
  };
  const question = (() => {
    if (!current) return <Complete steps={done} onContinue={restart} />;
    if (current === 'flip') return <FlipQuestion key={asked} onDone={advance} />;
    if (current === 'match') return <MatchQuestion key={asked} onDone={advance} />;
    if (current === 'build') return <BuildQuestion key={asked} onDone={advance} />;
    if (current === 'meaning' || current === 'dictation') return <RecallQuestion key={asked} question={RECALLS[current]!} onDone={advance} />;
    const choice = readInstead ? READ_INSTEAD : CHOICES[current]!;
    return <ChoiceQuestion key={`${asked}-${readInstead}`} question={choice} onDone={advance} onCannotListen={current === 'heard' ? () => setReadInstead(true) : undefined} />;
  })();
  return (
    <PhoneFrame className={q.showPhone}>
      <div ref={ref} className={q.viewport} data-practice-root>
        <div className={`${q.app} ${geistSans.variable} ${oswald.variable}`} style={{ transform: `scale(${scale})` }}>
          <StatusBar />
          {current && <>
            <div className={q.nav}>
              <span className={q.close} aria-hidden="true"><Icon name="x" size={22} /></span>
              <span className={q.roundTitle}>Practice</span>
              <span className={q.gear} aria-hidden="true"><Icon name="settings" size={22} /></span>
            </div>
            <div className={q.progress} role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
              <span>{done}</span><span className={q.track}><span style={{ width: `${(done / total) * 100}%` }} /></span><span>{total}</span>
            </div>
          </>}
          <div className={q.body}>{question}</div>
          <span className={q.homeIndicator} />
        </div>
      </div>
    </PhoneFrame>
  );
}

/* ───────────────────────── Auto-played showcase (same pattern as the DEF ERP live demos) ───────────────────────── */

type Helpers = {
  wait: (ms: number) => Promise<void>;
  find: (selector: string, text?: string) => HTMLElement;
  click: (el: HTMLElement) => Promise<void>;
  type: (el: HTMLElement, text: string) => Promise<void>;
  /** Press, drag sideways by `dx` screen pixels, and let go. */
  drag: (el: HTMLElement, dx: number) => Promise<void>;
};
type Item = { step: string; title: string; lead: string; body: string; form: FormKey; seconds: number; script: (h: Helpers) => Promise<void> };

const btn = (h: Helpers, text: string) => h.find('button', text);
const ITEMS: Item[] = [
  {
    step: 'Look', title: 'See the card', form: 'flip', seconds: 9,
    lead: 'A new card is seen once before anything is asked.',
    body: 'Tap to turn it over, then say how it went. Drag right for I got it, left for Need review; let go short of the line and it springs back. The two buttons do the same.',
    script: async (h) => {
      await h.wait(600);
      await h.click(h.find('[aria-label="Reveal answer"]'));
      await h.wait(1500);
      // Not far enough: it springs back. Then all the way right: I got it.
      await h.drag(h.find('[data-flip]'), -70);
      await h.wait(700);
      await h.drag(h.find('[data-flip]'), 150);
      await h.wait(900);
    },
  },
  {
    step: 'Recognise', title: 'Match pairs', form: 'match', seconds: 12,
    lead: 'Two taps, either side first. No button.',
    body: 'A made pair leaves and the next arrives in its rows. A miss marks both tiles and sends both cards round once more, so the total grows. An empty board ends the question.',
    script: async (h) => {
      await h.wait(700);
      await h.click(btn(h, 'borrow'));
      await h.click(btn(h, 'full of people'));
      await h.wait(900);
      for (let k = 0; k < 3; k += 1) {
        const word = [...h.find('[data-practice-root]').querySelectorAll<HTMLButtonElement>('[data-side="left"]:not(:disabled)')][0];
        if (!word) break;
        const pair = PAIRS.find((x) => x.left === word.textContent)!;
        await h.click(word);
        const meaning = [...h.find('[data-practice-root]').querySelectorAll<HTMLButtonElement>('[data-side="right"]:not(:disabled)')].find((b) => b.textContent === pair.right);
        if (meaning) await h.click(meaning);
        await h.wait(450);
      }
      await h.wait(1200);
    },
  },
  {
    step: 'Recognise', title: 'Choose', form: 'gap', seconds: 12,
    lead: 'Tapping an option is the answer.',
    body: 'Continue stays hidden until then. A miss shows “Let’s try again”, the right option dashed, and the card turns over for the answer and why. The missed step comes back later in the round.',
    script: async (h) => {
      await h.wait(800);
      await h.click(btn(h, 'look after'));
      await h.wait(1300);
      await h.click(btn(h, 'Tap to reveal explanation'));
      await h.wait(2600);
      await h.click(btn(h, 'Tap to see your answer again'));
      await h.wait(900);
      await h.click(btn(h, 'Continue →'));
      await h.wait(900);
    },
  },
  {
    step: 'Recognise', title: 'Listen', form: 'heard', seconds: 10,
    lead: 'Heard, not read.',
    body: 'It speaks as it appears; again, or slowly. “Can’t listen now” trades it for the same card read, unmarked. Move your pointer in to hear it.',
    script: async (h) => {
      await h.wait(800);
      await h.click(h.find('[aria-label="Play again"]'));
      await h.wait(500);
      await h.click(btn(h, 'Slow'));
      await h.wait(700);
      await h.click(btn(h, 'Can’t listen now'));
      await h.wait(1000);
      await h.click(btn(h, 'to stop trying to do something'));
      await h.wait(1300);
      await h.click(btn(h, 'Continue →'));
      await h.wait(900);
    },
  },
  {
    step: 'Produce', title: 'Own words', form: 'meaning', seconds: 12,
    lead: 'Marked for sense, not for wording.',
    body: 'Words the checker cannot settle are read for meaning while the card says it is checking. The card’s own wording is shown beside yours, and a miss can be overruled.',
    script: async (h) => {
      await h.wait(700);
      const box = h.find('textarea');
      await h.click(box);
      await h.type(box, 'quit trying');
      await h.click(h.find('[aria-label="Submit answer"]'));
      await h.wait(2800);
      await h.click(btn(h, 'Continue →'));
      await h.wait(900);
    },
  },
  {
    step: 'Produce', title: 'Dictation', form: 'dictation', seconds: 11,
    lead: 'Spelling is marked letter by letter.',
    body: 'Relaxed marking lets a slip pass as “almost”, never as right: what you typed is struck where it is wrong, and the missing letters are picked out underneath.',
    script: async (h) => {
      await h.wait(900);
      const box = h.find('textarea');
      await h.click(box);
      await h.type(box, 'acommodate');
      await h.click(h.find('[aria-label="Submit answer"]'));
      await h.wait(2800);
      await h.click(btn(h, 'Continue →'));
      await h.wait(900);
    },
  },
  {
    step: 'Produce', title: 'Build a sentence', form: 'build', seconds: 22,
    lead: 'Put the new word to work.',
    body: 'Tap the words in order; tap a placed word to send it back, and its slot keeps its place. Check, then Continue.',
    script: async (h) => {
      await h.wait(700);
      const bank = (w: string) => [...h.find('[data-practice-root]').querySelectorAll<HTMLButtonElement>('[data-bank] button:not(:disabled)')].find((b) => b.textContent === w)!;
      for (const w of ['Do', 'not', 'give', 'up', 'before', 'you', 'really']) await h.click(bank(w));
      await h.wait(500);
      await h.click([...h.find('[data-practice-root]').querySelectorAll<HTMLButtonElement>('[data-line] button')].find((b) => b.textContent === 'really')!);
      for (const w of ['have', 'really', 'tried']) await h.click(bank(w));
      await h.click(btn(h, 'Check'));
      await h.wait(1600);
      await h.click(btn(h, 'Continue →'));
      await h.wait(900);
    },
  },
];

/** Steps on the left; the practice screen on the right, played one step at a time by a scripted cursor. */
export function QuestionLadder() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [progress, setProgress] = useState({ value: 0, ms: 0 });
  const [driving, setDriving] = useState(false);
  const [run, setRun] = useState(0);
  const [cursor, setCursor] = useState<{ x: number; y: number; down: boolean; drag?: boolean } | null>(null);
  const [toast, setToast] = useState(false);
  const [visible, setVisible] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<number>(undefined);
  const autoRef = useRef(auto);
  useEffect(() => { autoRef.current = auto; }, [auto]);
  const item = ITEMS[active];

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(stage.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (driving || !visible || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const token = { stop: false };
    speechMuted = true;
    const total = item.seconds * 1000;
    let spent = 0;
    const advance = (ms: number) => { spent += ms; setProgress({ value: Math.min(0.97, spent / total), ms }); };
    const sleep = (ms: number) => new Promise<void>((res, rej) => setTimeout(() => (token.stop ? rej(new Error('stop')) : res()), ms));
    const root = () => stage.current!.querySelector<HTMLElement>('[data-practice-root]')!;
    const point = async (el: HTMLElement) => {
      if (!el) throw new Error('target not found');
      const r = el.getBoundingClientRect();
      const w = stage.current!.getBoundingClientRect();
      const x = r.left - w.left + Math.min(r.width / 2, 90);
      const y = r.top - w.top + r.height / 2;
      setCursor({ x, y, down: false });
      await sleep(700);
      return { x, y };
    };
    const press = (el: HTMLElement) => {
      const init = { bubbles: true, cancelable: true, button: 0, clientX: 0, clientY: 0 };
      for (const type of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']) {
        el.dispatchEvent(type.startsWith('pointer') ? new PointerEvent(type, { ...init, pointerType: 'mouse', pointerId: 1, isPrimary: true }) : new MouseEvent(type, init));
      }
    };
    const h: Helpers = {
      wait: (ms) => { advance(ms); return sleep(ms); },
      find: (selector, text) => {
        if (selector === '[data-practice-root]') return root();
        const el = [...root().querySelectorAll<HTMLElement>(selector)].find((e) => !text || e.textContent?.trim() === text || e.textContent?.trim().startsWith(text));
        if (!el) throw new Error(`missing ${selector} ${text ?? ''}`);
        return el;
      },
      click: async (el) => {
        advance(1000);
        const { x, y } = await point(el);
        setCursor({ x, y, down: true });
        await sleep(120);
        press(el);
        if (el instanceof HTMLTextAreaElement) el.focus({ preventScroll: true });
        setCursor({ x, y, down: false });
        await sleep(180);
      },
      drag: async (el, dx) => {
        advance(2200);
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height * 0.55;
        const w = stage.current!.getBoundingClientRect();
        setCursor({ x: cx - w.left, y: cy - w.top, down: false });
        await sleep(700);
        const fire = (type: string, x: number) => el.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, button: 0, clientX: x, clientY: cy, pointerType: 'mouse', pointerId: 1, isPrimary: true }));
        setCursor({ x: cx - w.left, y: cy - w.top, down: true, drag: true });
        fire('pointerdown', cx);
        await sleep(160);
        const steps = 14;
        for (let i = 1; i <= steps; i += 1) {
          const k = i / steps, x = cx + dx * (1 - (1 - k) * (1 - k));
          fire('pointermove', x);
          setCursor({ x: x - w.left, y: cy - w.top, down: true, drag: true });
          await sleep(40);
        }
        await sleep(dx > 0 ? 120 : 260);
        fire('pointerup', cx + dx);
        setCursor({ x: cx + dx - w.left, y: cy - w.top, down: false });
        await sleep(500);
      },
      type: async (el, text) => {
        advance(text.length * 80);
        const set = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!;
        let value = '';
        for (const ch of text) {
          value += ch;
          set.call(el, value);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          await sleep(80);
        }
      },
    };
    (async () => {
      setProgress({ value: 0, ms: 0 });
      await sleep(400);
      const w = stage.current!.getBoundingClientRect();
      setCursor({ x: w.width * 0.82, y: w.height * 0.8, down: false });
      await sleep(600);
      await item.script(h);
      setProgress({ value: 1, ms: 300 });
      await sleep(700);
      setCursor(null);
      if (autoRef.current) { setActive((a) => (a + 1) % ITEMS.length); setRun((r) => r + 1); }
    })().catch((e: Error) => { if (e.message !== 'stop') console.warn('[memq demo]', e.message); });
    return () => { token.stop = true; setCursor(null); };
  }, [active, run, driving, visible, item]);

  const go = (i: number) => { setAuto(false); setActive(i); setRun((r) => r + 1); setProgress({ value: 0, ms: 0 }); };
  const takeOver = () => {
    if (driving) return;
    setDriving(true);
    speechMuted = false;
    setToast(true);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(false), 2200);
  };
  const handBack = () => { setDriving(false); speechMuted = true; setRun((r) => r + 1); };

  return (
    <div className={showcase.wrap}>
      <ol className={showcase.list}>
        {ITEMS.map((entry, i) => {
          const on = i === active;
          return (
            <li key={entry.title} className={`${showcase.item} ${on ? showcase.on : ''}`}>
              {on ? (
                <span className={showcase.track} role="progressbar" aria-label={`${entry.title} demo progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress.value * 100)}>
                  <span className={showcase.fill} style={{ width: `${progress.value * 100}%`, transitionDuration: `${progress.ms}ms` }} />
                </span>
              ) : null}
              <CaseButton variant="tab" type="button" className={showcase.head} aria-expanded={on} onClick={() => go(i)}>
                <span className={showcase.num}>{String(i + 1).padStart(2, '0')}</span>
                <span className={showcase.title}>{entry.title}</span>
                <span className={q.stepTag}>{entry.step}</span>
              </CaseButton>
              {on ? (
                <div className={showcase.copy}>
                  <p className={showcase.lead}>{entry.lead}</p>
                  <p className={showcase.body}>{entry.body}</p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
      <div ref={stage} className={q.stage} onMouseEnter={takeOver} onMouseLeave={handBack} onTouchStart={takeOver}>
        <PracticePhone key={`${active}-${run}`} start={item.form} />
        {toast ? <span className={showcase.toast} role="status">You are driving</span> : !driving ? <span className={showcase.hint} aria-hidden="true">Move the pointer here to use it</span> : null}
        {cursor ? <span className={`${showcase.cursor} ${cursor.down ? showcase.cursorDown : ''}`} style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)`, ...(cursor.drag ? { transitionDuration: '40ms', transitionTimingFunction: 'linear' } : {}) }} aria-hidden="true" /> : null}
      </div>
    </div>
  );
}

/* ───────────────────────── Marking evidence ───────────────────────── */

const SPELL_IT: Recall = { kind: 'recall', chip: 'Spell it', placeholder: 'Type the word', q: 'to provide a place to stay', answer: 'accommodate', answerKind: 'spelling', long: true };
const MARKED: { title: string; note: string; question: Recall; answered: string }[] = [
  { title: 'Almost', note: 'One slip in eleven letters passes, but as “almost”, never as right. The missing letter is picked out in the right spelling.', question: RECALLS.dictation!, answered: 'accomodate' },
  { title: 'Not quite', note: 'Two slips and a wrong letter is another word. The wrong letter is struck in what was typed; the two lines are read against each other.', question: SPELL_IT, answered: 'acomodete' },
  { title: 'Right, in other words', note: 'The words don’t match, so it is read for sense. Right, and the card’s own wording is shown beside it.', question: RECALLS.meaning!, answered: 'quit trying' },
  { title: 'Overrule', note: 'Marked wrong for sense. The learner can say it means the same; tap it.', question: RECALLS.meaning!, answered: 'let it go' },
];

/** A practice screen frozen on a marked answer: the app’s own marking, on the app’s own layout. */
function MarkedPhone({ question, answered }: { question: Recall; answered: string }) {
  const { ref, scale } = useScale();
  return (
    <PhoneFrame>
      <div ref={ref} className={q.viewport}>
        <div className={`${q.app} ${geistSans.variable} ${oswald.variable}`} style={{ transform: `scale(${scale})` }}>
          <StatusBar />
          <div className={q.nav}>
            <span className={q.close} aria-hidden="true"><Icon name="x" size={22} /></span>
            <span className={q.roundTitle}>Practice</span>
            <span className={q.gear} aria-hidden="true"><Icon name="settings" size={22} /></span>
          </div>
          <div className={q.progress}><span>4</span><span className={q.track}><span style={{ width: '50%' }} /></span><span>8</span></div>
          <div className={q.body}><RecallQuestion question={question} answered={answered} onDone={() => {}} /></div>
          <span className={q.homeIndicator} />
        </div>
      </div>
    </PhoneFrame>
  );
}

export function MarkingEvidence() {
  return (
    <ul className={q.marked} aria-label="Typed answers as the practice screen marks them">
      {MARKED.map((m) => (
        <li key={m.title}>
          <MarkedPhone question={m.question} answered={m.answered} />
          <strong>{m.title}</strong>
          <span>{m.note}</span>
          <code>typed: “{m.answered}”</code>
        </li>
      ))}
    </ul>
  );
}

function Complete({ steps, onContinue }: { steps: number; onContinue: () => void }) {
  return (
    <div className={q.complete}>
      <div className={q.completeCard}>
        <Image src="/img/memq-v2/mascot/completed.svg" alt="" width={132} height={132} unoptimized className={q.completeMascot} />
        <span className={q.completeBadge}><Icon name="check" size={16} />Practice complete</span>
        <span className={q.completeTitle}>You did it!</span>
        <span className={q.completeCopy}>A little practice goes a long way.</span>
        <div className={q.completeStats}>
          <div><b>6</b><span>Cards</span></div><i />
          <div><b>{steps}</b><span>Steps completed</span></div>
        </div>
      </div>
      <button type="button" className={`${q.cta} ${q.completeCta}`} onClick={onContinue}><span className={q.ctaFace}>Keep practicing</span></button>
      <button type="button" className={q.done} onClick={onContinue}>Done</button>
    </div>
  );
}
