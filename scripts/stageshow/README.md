# Stageshow verification tools

Copied from benjitaylor/skills, `stageshow`, version 1.1.0 (MIT).
License: ../../src/app/components/stageshow/LICENSE.

Run from the repository root, with the local Next.js server running:

```sh
node scripts/stageshow/film.mjs http://localhost:3002/projects/procurement-agent-kit --select .pa-scene --states --gate --out output/procurement-hero/states.png
```

Requires the `playwright-core` dev dependency and an installed Google Chrome.
`CHROME_PATH` can select a different Chromium binary.

Local adaptations: exact kit CSS attribution in bundled Next.js stylesheets,
and discovery after Stage placement to avoid pre-hydration DOM mutations.
Neither adaptation exempts host-authored styles or composition faults.

Three-card scene adaptations also recognize real satellite overlap when its
center lies beyond the main card, and distinguish cards in a normal-flow
stack from independent centered illustrations. Crop and control checks remain
active for both compositions.
