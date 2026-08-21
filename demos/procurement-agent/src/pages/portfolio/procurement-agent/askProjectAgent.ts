import type { DemoChatMessage } from './portfolioDemoTypes';

/**
 * Live "ask about this project" endpoint.
 *
 * The demo is a static bundle served from the portfolio's own /demos/ path, so this is a
 * same-origin call - no key ever reaches the browser. When embedded anywhere else, or when the
 * endpoint is unavailable, callers fall back to the scripted reply.
 */
const ENDPOINT = '/api/procurement-agent';
const CLIENT_TIMEOUT_MS = 20_000;
const HISTORY_TURNS = 6;

export function buildHistory(messages: DemoChatMessage[]) {
  return messages
    .filter((message) => message.role === 'user' || message.role === 'agent')
    .slice(-HISTORY_TURNS)
    .map((message) => ({ role: message.role as 'user' | 'agent', text: message.text ?? '' }))
    .filter((turn) => turn.text.trim().length > 0);
}

export async function askProjectAgent(
  question: string,
  history: ReturnType<typeof buildHistory>,
): Promise<string> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, history }),
      signal: controller.signal,
    });

    if (res.status === 429) {
      throw new Error('rate_limited');
    }
    if (!res.ok) {
      throw new Error(`request_failed_${res.status}`);
    }

    const data = (await res.json()) as { answer?: string };
    const answer = data.answer?.trim();
    if (!answer) throw new Error('empty_answer');

    return answer;
  } finally {
    window.clearTimeout(timer);
  }
}

/** Shown when the live model cannot be reached and there is no scripted answer to fall back to. */
export const AGENT_UNAVAILABLE =
  "I can't reach the live model right now. You can still walk the workflow on the left - every stage in this demo runs from a script.";

export const AGENT_RATE_LIMITED =
  "You've reached the question limit for this session. The workflow on the left still works - every stage runs from a script.";
