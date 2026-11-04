# ConnectNova homepage cover

Brief: on a LinkedIn people list, ConnectNova's extension captures candidates
in one click; they appear in the ConnectNova web app; the recruiter types the
hiring requirements and the list reorders into a ranking, best match on top.
LinkedIn is cropped by the frame's left and bottom edges and never shown whole.
Loops. Same hover-only playback and inert cover as `procurement-cover`.

## Gold and adaptation

Golds: `overlap` (a front window over the sidebar line of the main one),
`reorder` (rows placed by transform and gliding to their new slots),
`loading` (skeleton rows resolving at the content's own geometry),
`hero-demo` (cursor gesture beats). Kit parts added to the project's kit copy:
States, Avatar, Check, Meter, Spinner (copied unchanged from stageshow 1.1.0,
except `Avatar.css`, whose two `.ss-avatar` blocks are merged so the bundled
CSS still matches the film checker's kit attribution).

The extension popup follows the real extension's screens
(`public/img/connectnova/Extension.avif`): logo header, one white card per
step, STEP 2 / Collecting… / progress, Collected pills, COMPLETED / total
profiles card, a full-width blue action (Start Collection → Go to Rank). The
logo is cropped from that screenshot (`extension-logo.png`), not redrawn.

## Story (about 15s)

1. Idle: popup says "LinkedIn Search page detected"; app project is empty (skeleton rows).
2. Click Start Collection. Six profiles are captured: LinkedIn ticks, popup
   progress and pills, app rows resolve one by one, count rolls to 6.
3. Popup becomes "Collection finished"; button reads Go to Rank.
4. Cursor types the requirements into the app; clicks Start ranking.
5. Rows reorder with a stagger, scores count up, the best match (Marco Silva, 94)
   rises from fourth to first. Holds 2.8s.
6. Content fades (0.3s) and resets while hidden; windows and sidebar stay.

Poster (reduced motion, and the resting state before hover) is step 5's result.

## Layout

800 x 500 stage that fills the card edge to edge, like the Procurement cover
(no smaller frame inside the card). The side margins come from the windows'
own inset: LinkedIn 28px from the left, the app 32px from the right, both
bleeding off the bottom edge. LinkedIn is therefore cropped by the bottom and
overlapped by the popup, never shown whole. The app has no sidebar: it is the
project page, with its left side overlapped by LinkedIn.

## Verification

- Wide still (design size): film reports only a `double corner` (the filming
  harness's card radius against the stage clip).
- Loop: `--hover --gate` at design size ends `rehearsal passed`. Motion coverage
  is inconclusive (sampling gaps in the dev browser). Remaining notes are from
  `Count`/`Roll` internals and `States` panes.
- tsc: no errors in these files. eslint: two `<img>` warnings (the logo, same as
  the project's other inert covers).

Not checked: Safari/Firefox, touch devices, a production build.
