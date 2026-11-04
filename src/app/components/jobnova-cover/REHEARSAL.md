# JobNova Auto Apply homepage cover

Brief: JobNova, an AI job search assistant. The user turns on Auto Apply with
their resume and a few preferences; JobNova works through a list of matching
jobs on its own, filling in each application and marking it submitted, one
after another. Loops. Same hover-only playback and inert cover as the
Procurement and ConnectNova covers.

## Concept, not a copy of the page

An earlier version recreated the product's matched-jobs page (browser window,
logo, tabs, match rings, real company logos). That read as a mock of the real
screen, which can never be exact, so it was replaced. This version keeps only
the idea: a list of jobs and one small control card, in JobNova's black and
lime. No browser chrome, no logo, no company marks. Real words are only on
what the story touches: "Matched jobs", four role titles, the state words
(Queued, Filling in…, Submitted), "Auto Apply", "Resume.pdf", "Match at least"
with 30/55/80%, and the "submitted" count. Everything else is placeholder bars.

## Story (about 14s)

1. A list of matched jobs, all Queued. The resume in the control card is read (check).
2. The cursor picks a match threshold (55%), then switches Auto Apply on.
3. One job at a time opens a small form under its row; three fields fill in
   one after another, the row is ticked and marked Submitted, the form closes.
4. The counter in the card rolls up and its bar fills; three jobs are submitted, more wait below.
5. Holds 2.4s, then the card and list fade, reset hidden, and the run starts again.

Poster (reduced motion and the resting card) is step 4: three Submitted, the
fourth Queued, "3 submitted".

## Layout

800 x 500 stage that fills the card, like the other covers. The list card is
inset 48px from the left and runs off the bottom; the control card sits to its
right with one 54px gutter to the list, the right edge and the bottom.

## Verification

- Wide still at design size: only the filming harness's card-radius `double corner`.
- Loop: `--hover --gate` at design size ends `rehearsal passed`. Motion coverage
  is inconclusive (sampling gaps). Remaining notes are the hover-start cut from
  the poster to the first frame and `Count` internals; the number is keyed per
  run so a reset remounts it.
- tsc: no errors in these files.

Not checked: Safari/Firefox, touch devices, a production build.
