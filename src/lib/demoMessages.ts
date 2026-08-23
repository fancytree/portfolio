/**
 * Messages an embedded demo can post to the page hosting it.
 *
 * A demo runs in an iframe, so it cannot exit a fullscreen its host requested —
 * the fullscreen element belongs to the top document. The mock browser chrome's
 * close button posts this instead and lets the host do it.
 *
 * The procurement demo is a separate package and cannot import this file, so it
 * repeats the literal. Keep the two in step.
 */
export const DEMO_CLOSE_MESSAGE = 'portfolio-demo:close';
