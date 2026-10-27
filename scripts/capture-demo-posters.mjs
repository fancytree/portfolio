#!/usr/bin/env node
// Captures the stills HomeDemoCard shows until a reader opens a demo.
// Re-run it whenever a demo's opening screen changes.
//
// Serve a production build first, so the dev-mode indicator is not captured:
//   npm run build && npm run start -- -p 3000
//   node scripts/capture-demo-posters.mjs http://localhost:3000
//
// Uses the local Chrome over the DevTools protocol; set CHROME_PATH if it is
// not in the default macOS location.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const baseUrl = process.argv[2] ?? 'http://localhost:3000';
const chromePath = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
// Must match PREVIEW_VIEWPORT_* in src/app/components/HomeDemoCard.tsx.
const viewport = { width: 1024, height: 720 };
const settleMs = 4000;
const posters = [
  { path: '/demos/procurement-agent/index.html', out: 'public/img/procurement-agent/demo-poster.webp' },
  { path: '/demos/connectnova-sequence', out: 'public/img/connectnova/sequence-demo-poster.webp' },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const profile = mkdtempSync(join(tmpdir(), 'demo-posters-'));
const port = 9400 + Math.floor(Math.random() * 500);
const chrome = spawn(chromePath, [
  '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', 'about:blank',
], { stdio: 'ignore' });

try {
  let target;
  for (let attempt = 0; attempt < 50 && !target; attempt++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      target = targets.find((item) => item.type === 'page');
    } catch {
      // Chrome is still starting.
    }
    if (!target) await sleep(200);
  }
  if (!target) throw new Error('Chrome did not expose a page target');

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let nextId = 0;
  const pending = new Map();
  const listeners = new Map();
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    } else if (message.method && listeners.has(message.method)) {
      listeners.get(message.method)();
      listeners.delete(message.method);
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const once = (method) => new Promise((resolve) => listeners.set(method, resolve));

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { ...viewport, deviceScaleFactor: 1, mobile: false });

  for (const poster of posters) {
    const loaded = once('Page.loadEventFired');
    await send('Page.navigate', { url: new URL(poster.path, baseUrl).href });
    await loaded;
    await send('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => true)', awaitPromise: true });
    await sleep(settleMs);
    const { data } = await send('Page.captureScreenshot', { format: 'webp', quality: 82 });
    writeFileSync(poster.out, Buffer.from(data, 'base64'));
    console.log(`wrote ${poster.out}`);
  }
  socket.close();
} finally {
  chrome.kill('SIGTERM');
  await sleep(500);
  rmSync(profile, { recursive: true, force: true });
}
