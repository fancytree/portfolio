# Procurement Agent hero — three-card revision

Brief: a large editable purchase-order card, a floating chat at its right,
and a separate card showing the evidence the agent retrieved. Composition
follows the user's supplied Stageshow `story` reference: a large document,
overlapping satellites, white surfaces, soft shadows and a quiet tinted ground.
The earlier single-window edit/export composition has been replaced.

## Gold and adaptation

Golds: Stageshow 1.1.0 `story` (document and connected cards), `table-edit`
(measured in-place edit), and `ai-chat` (evidence retrieval and streamed reply).
The kit is copied under `../../components/stageshow/`, with MIT license and
upstream notice. The scene uses Card, Row, Field, Button, Badge, Bar, Stream,
Connector, Count and Roll; purchase quantities are real controlled inputs.

## Story

1. Buyer asks: “Plan MNP for the next 30 days.”
2. Three source records resolve in the evidence card: 108 units sold,
   53 on hand, 14-day supplier lead time. These describe Reinforced bonder.
3. The agent streams its response while six product recommendations resolve
   in the purchase-order table. Directional arrows show evidence → chat →
   purchase order; the former direct evidence-to-order link is removed.
4. Buyer changes Reinforced bonder from 144 to 120; total becomes €2,990.80.
5. The result holds, then the composer resends the request for the next cycle.
   All visible quantities remain editable.

The animation loops on entering view. At the end, the composer visibly types
and resends the request; generated content fades, resets while hidden, and
returns. Card frames, the request, and the purchase header stay as anchors.
Replay explicitly restarts it. Focusing or editing a quantity stops autoplay
and preserves the editable result until Replay. Reduced motion shows the
completed draft without a cursor. Wide design: 1000 × 740. Compact: 358 × 1040, with
evidence, chat and purchase order stacked at natural heights. The compact
order shows three rows and explicitly acknowledges the other three products.

## Verification

- TypeScript and component ESLint: passed.
- CSS namespace check and `git diff --check`: passed.
- Real Chrome editing: changing the first quantity to 100 recalculates the
  total to €2,886.13. Replay, reduced-motion result and wide/compact resizing
  checked. Browser exceptions: none.
- Wide reduced-motion poster: `no-issues-detected`, `rehearsal passed`.
- Wide and compact full state sheets: gate ends `rehearsal passed`.
- Motion coverage remains **inconclusive** because the development browser
  has sampling gaps. This is not an exhaustive frame-by-frame motion pass.
  Count's internal masked digit strips produce jump/settle reports while
  resetting their hidden tracks. The shown total and result were inspected.
- Retained transform layers were added to source results and product names;
  the source-result line uses an even 14px height for its 12px check icon.
- Independent reviewer compared the user's reference, wide and compact
  posters, and both state sheets: no substantive visible findings. Clean
  final captures remove the Next.js dev badge and host navigation.

## Tools and artifacts

Verification tools live in `scripts/stageshow/`. Next.js-specific adaptations:
exact normalized kit CSS attribution; delayed instrumentation until Stage
placement completes; recognizing actual satellite overlap even when its
center lies outside the main card; and recognizing cards in a normal-flow
vertical stack as layout sections. These adaptations do not exempt host
styles, crop defects, control geometry or word clipping.

Deliverables: ignored `output/procurement-hero-v2/hero.gif`, `hero.mp4`,
`desktop.png`, `mobile.png`, captured frames, capture script and browser checks.
Rehearsal sheets/reports: `/private/tmp/procurement-rehearsal/v2-*`.

Not checked: physical touch devices, Safari/Firefox, every tab-hidden or
mid-play interruption. This is an authored product illustration; the chat
and source retrieval are scripted. The numeric inputs and totals work.
No production deployment performed.

## Arrow and loop revision

Latest clean captures and one-cycle exports: `output/procurement-hero-v3/`.
The evidence arrow starts at its top edge and points upward into chat.
The recommendation arrow leaves the chat edge beside its response, follows
the gutter and points left into the purchase-plan summary. Wide poster gate
reports `no-issues-detected` and `rehearsal passed`.

On compact layouts the cards follow the same causal order from top to bottom
(evidence, chat, purchase order), with short downward arrows in the gaps.

## Title-link and document inset revision

Desktop Agent → order arrow now leaves the Agent card's top center, bends
above it and points left beside the measured “Purchase order” title. The
order content uses its full inner width with equal 32px insets. Quantity is
the first numeric column, keeping the demonstrated edit visible; floating
cards intentionally overlap the supporting stock/sales area. The total stays
in the clear lower-left area. The loop and evidence → Agent direction remain.

## Homepage cover placement

The animation is now `components/procurement-cover/ProcurementCover.tsx` and
is rendered only by the homepage's `WorkProjectRows` with `animatedCovers`.
It has been removed from the project detail page. The existing 16:10 card
uses a 1000 × 625 scene with the same three-card composition; compact stacking
is disabled for this navigation thumbnail. Replay/caption and real editing
are omitted, and the visual subtree is inert so the entire project card
remains one accessible navigation link. The simulated edit and automatic
loop remain. The cover arrow is smaller and kept in the top-right margin.

Verified at 1440px and 390px: cover present, navigation opens the correct
project, project detail has no animation, no browser exceptions. Clean
captures: `output/procurement-home-cover/desktop.png` and `mobile.png`.

## Hover-only cover playback

The homepage cover now defaults to its complete static poster. Pointer entry
on the enclosing project link starts the looping script; leaving or canceling
the pointer stops playback and restores the poster. Touch pointers do not
start it. This listener is attached to the navigation link because the
illustration itself remains inert. Reduced-motion preferences still apply.

## Cover scale adjustment

Increased the cover's design canvas to 1088 × 680 and centered the existing
composition with a 44px horizontal / 28px vertical offset. At the unchanged
16:10 cover size, the card illustration is about 8% smaller with more space
around it. Measured connectors and hover-only playback are preserved.
Desktop/mobile captures: `output/procurement-home-cover-smaller/`.
