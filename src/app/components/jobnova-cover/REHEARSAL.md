# JobNova Auto Apply homepage cover

Brief: JobNova, an AI job search assistant. The user turns on Auto Apply with
their resume and a few preferences; JobNova works through a list of matching
jobs on its own, filling in each application and marking it submitted, one
after another. Loops. Same hover-only playback and inert cover as the
Procurement and ConnectNova covers.

## Source of the look

The real product, from `public/img/jobnova/evidence/matched-jobs.webp`,
`auto-apply-rules.webp` and `application-states.webp`: black pill tabs, lime
accent, white cards on a pale gray, a match ring per job, state chips
(Queued purple, Applying lime, Applied green), the footer texts and buttons
the real states use ("Move to Front", "View Application"), the Auto Apply
panel with Scanning / Queued / Submitting, and the three Job Matching options.
The JobNova logo is the project's `page-design/logo.png`; Cursor and
Accenture logos are the project's own `auto-apply-state-assets` files (the
Accenture mark is cropped from the 3840x2160 original). The third company is a
neutral tile and fictional, not a made-up mark.

## Story (about 14s)

1. Idle: three matched jobs with Apply Now; the panel shows the resume being read.
2. The resume is read (check), the cursor picks Balanced (>55% Match).
3. Cursor turns Auto Apply on: the panel runs Scanning, Queued; the queue counts to 12 and each card becomes Queued.
4. One at a time: Applying with the form steps (reading, filling in, attaching the resume) and a progress bar, then Applied with "View Application"; Submitted counts up, In queue counts down.
5. Holds 2.4s on three submitted, then the cards and panel fade, reset hidden and the run starts again. A hover also starts with that same fade from the poster.

Poster (reduced motion and the resting card) is step 5: three jobs Applied,
Submitted 3, In queue 9.

## Layout

800 x 500 stage that fills the card, like the other covers. The browser window
is inset 28px at the sides and bleeds off the bottom; the list shows three whole
cards, the panel runs past the bottom.

## Verification

- Wide still at design size: only the filming harness's card-radius `double corner`.
- Loop: `--hover --gate` at design size ends `rehearsal passed`. Motion coverage
  is inconclusive (sampling gaps). Remaining notes come from `Count` strips and
  `Roll` internals; the number parts are keyed per run so a reset remounts them.
- tsc: no errors in these files.

Not checked: Safari/Firefox, touch devices, a production build.
