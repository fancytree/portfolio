'use client';

/**
 * The live Agent demos with this case's wording: it is read by recruiters, so it speaks
 * of "the user". The scripts are shared with the older case, whose copy stays as it is.
 */
import AgentLiveDemo, { AgentEvaluationLiveDemo } from '../procurement-agent-kit/AgentLiveDemo';
import type { ShowcaseItem } from '../def-erp-kit/LiveShowcase';

/** By the shared title: what to show instead. */
const COPY: Record<string, { title?: string; body?: string }> = {
  'Never miss a reorder': { body: 'The workspace shows **which supplier to order from, when**, and how long the goods will last.' },
  'Just say what you need': { title: 'Just say what is needed', body: 'The user names a supplier and how long to cover. **The plan fills in while they watch.**' },
  'Trust it because you can check': { title: 'Trusted because it can be checked', body: '**Any line opens to show why**, the user changes what they know better, and supplier terms stay close by.' },
  'Focus on what changed': { body: 'The user goes straight to the exceptions and decides. **Nothing is ordered until they do it.**' },
  'Count once, stock right': { body: 'The delivery note is compared with the count. **Stock reflects what really arrived.**' },
  'Teach it what matters': { body: '**The user chooses what to remember** from this order. Nothing is saved without their say.' },
  'Make the next plan better': { body: 'The user rates three things and **names products in their own words**. Skipping is allowed, but skipped reviews don’t count.' },
  'See what to double-check': { body: 'An **expected accuracy appears before ordering**, with the track record and any missing data.' },
};
/** The captions typed over the demo. */
const CAPTIONS: Record<string, string> = { 'Or ask in your own words': 'Or ask in plain words' };

// One copy per shared step: the player restarts a demo whenever its script changes.
const edited = new WeakMap<ShowcaseItem, ShowcaseItem>();
function forThisCase(item: ShowcaseItem): ShowcaseItem {
  let mine = edited.get(item);
  if (!mine) {
    mine = {
      ...item,
      ...COPY[item.title],
      script: (helpers) => item.script({ ...helpers, say: (text) => helpers.say(CAPTIONS[text] ?? text) }),
    };
    edited.set(item, mine);
  }
  return mine;
}

export function CaseAgentDemo() {
  return <AgentLiveDemo edit={forThisCase} />;
}

export function CaseEvaluationDemo({ steps }: { steps?: number[] }) {
  return <AgentEvaluationLiveDemo steps={steps} edit={forThisCase} />;
}
