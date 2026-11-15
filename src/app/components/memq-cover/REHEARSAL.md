# MemQ homepage cover

Brief: MemQ, an iOS app that brings cards back just before you forget them. The cover
speaks the MemQ website hero's language: a lime field at 150°, two faint orbits, the
hero's own two hills with Inkling between them (body behind the front hill, face and
hands over it), the lipped white chips tilted and bobbing, and the "LESS FORGETTING."
note. Inkling runs on the app's own spring rig (`/demos/memq-mascot/mascot-rig.js`), so
it moves for real. Plays only while the pointer is over the project card, like the
other covers; at rest it holds the poster.

## Story (about 9s)

1. From the poster, the card, chips and streak fade; the scene resets to an
   unanswered card, Inkling resting and watching it.
2. The cursor picks the right meaning: the option turns green, "You got it!",
   Inkling is tapped (a spring kick) and turns happy; "Nice work!" pops in.
3. The streak grows in place from 21 to 22 (no rolling digits, as asked), the flame
   flares with the app's StreakPill curve, Inkling switches to its streak face and
   looks up at the chip.
4. Holds 3s on that result, which is also the poster and each loop's first frame.

## Gold and changes

Started from the repository's JobNova cover (hover gating, 800 × 500 stage, reset
pattern), not a skill example. Changed: the look (MemQ website hero), the live rig
instead of a still, the end state doubling as poster and loop start so hovering in
and leaving never snap.

## Verification

- `film.mjs --hover --gate`: `rehearsal passed`. Coverage inconclusive (sampling gaps).
- Remaining notes: the rig's face shapes swap in one frame when its mood changes
  (as in the app); the streak number is replaced in place by request.
- Still: no framing findings after the card was made to run off the bottom.
- tsc and eslint clean for these files.

Not checked: Safari/Firefox, touch devices, a production build, the 390 width.
