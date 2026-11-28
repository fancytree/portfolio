/**
 * The decision records for the decision-led MemQ case. Wording follows the first
 * MemQ case (/projects/memq-kit) and MemQ's own specs: docs/AI_CHAT_SPEC (§12, §15,
 * §30, §37, §39, §41) and docs/WELCOME_PAGE_DESIGN_SPEC. Nothing here is new.
 */
import type { Decision } from '../procurement-agent-kit/DecisionCards';

export const sourceDecision: Decision = {
  question: 'Where should the cards come from?',
  source: 'Welcome screen brief · onboarding',
  options: [
    { label: 'Ready-made decks', verdict: 'Fast to fill, but someone else’s highlights. Downloaded, never opened.', reversed: true },
    { label: 'Your own material', verdict: 'Notes, a PDF, a question you asked AI. AI drafts; you keep what you use.', chosen: true },
  ],
  evidence: 'In interviews, people forgot what they had looked up themselves, and stopped making cards by hand.',
  tradeoff: 'New accounts start empty, so every empty screen needs one next step.',
};

export const inputDecision: Decision = {
  question: 'How does material get into a lesson?',
  source: 'v1 Add Terms page · 2.0 New Cards (app/create.tsx)',
  options: [
    { label: 'A tab for each source', verdict: 'Paste, a topic or a PDF: pick the tab first, then the AI step that goes with it.', reversed: true },
    { label: 'One box for anything', verdict: 'Type, paste or attach, then Generate. AI drafts; you keep what you use.', chosen: true },
  ],
  evidence: 'Typing cards was where people stopped, so AI parsing had to be the main path, not one tab of three.',
  tradeoff: 'The box has to tell what it was given, such as switching on Language when a language is typed.',
};

export const doorsDecision: Decision = {
  question: 'One chat that guesses, or two doors?',
  source: 'AI chat spec §12 · entry points',
  options: [
    { label: 'One chat; the model detects intent', verdict: 'Cost is known only after the model has run.' },
    { label: 'One chat; pick a mode first', verdict: 'v1 did this: people had to sort their own need first.', reversed: true },
    { label: 'Two doors, named for what they do', verdict: 'Where you tap is the intent, and the cost.', chosen: true },
  ],
  evidence: 'Four of five ways in were already unambiguous.',
  tradeoff: 'Ask a question cannot make cards; it can only point you to Learn something.',
};

export const uiDecision: Decision = {
  question: 'Who draws what appears in the chat?',
  source: 'AI chat spec §15 · structured replies',
  options: [
    { label: 'The model, as rich text', verdict: 'Long prose, raw asterisks, cards you cannot tick.' },
    { label: 'The model picks; the app draws', verdict: 'A few fixed interfaces, filled from real data, labelled by the app.', chosen: true },
  ],
  evidence: '“Practise Norse gods” said what, not how much. The card now shows cards, due and progress.',
  tradeoff: 'No charts or free layouts; every interface costs prompt tokens.',
};

export const creditsDecision: Decision = {
  question: 'How should AI use be counted?',
  source: 'AI chat spec §41 · lib/aiCredits',
  options: [
    { label: 'A limit per feature', verdict: 'Seven counters nobody could explain.', reversed: true },
    { label: 'Unlimited for Pro', verdict: 'A promise the daily budget could break.' },
    { label: 'One monthly number', verdict: 'Weighted by cost, back on the 1st. Practice is never charged.', chosen: true },
  ],
  evidence: 'Seven limits on three clocks, and the app could only ever show one of them.',
  tradeoff: 'Credits are counted per account, so a second account gets round them.',
};

export const writerDecision: Decision = {
  question: 'Who turns the chat into cards?',
  source: 'MCP launch requirements · draft first, save what you keep',
  options: [
    { label: 'Copy it into MemQ', verdict: 'A chore, and the question behind the answer is lost.' },
    { label: 'The chat writes them, through MemQ’s tools', verdict: 'The model that explained it writes the cards; MemQ checks and saves.', chosen: true },
  ],
  tradeoff: 'Quality depends on another model, so MemQ enforces the card rules.',
};

export const directionDecision: Decision = {
  question: 'Which visual direction for 2.0?',
  source: 'Visual direction brief · five directions, same content',
  options: [
    { label: 'A · Playful, character-led', verdict: 'Starting a round feels like a small challenge.', chosen: true },
    { label: 'B · Paper and ink', verdict: 'Warm, but texture fails at small sizes.' },
    { label: 'C · Colour per course', verdict: 'Colour competes with answer feedback.' },
    { label: 'D · Quiet and minimal', verdict: 'Too close to v1.' },
    { label: 'E · Open concept', verdict: 'Expressive, but Start and Create get lost.' },
  ],
  tradeoff: 'Playful must stay adult: no lives, no coins, no punished streaks.',
};
