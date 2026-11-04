# DEF Beauty ERP hero rehearsal

Brief: a looping, greyscale four-tile homepage section. One platform fragment,
one stat, one object, one diagram. Premium, quiet, very little text.

Gold: Stageshow 1.1.0 `examples/bento` from benjitaylor/skills. Copied the
measured picture-slot structure, native-size per-tile Stage layout, single
window, contrasting typography tile and object/diagram neighbors. Reduced
five tiles to four and replaced spend-management content with DEF's shared
sales, warehouse and invoicing record.

## Composition and story

- Lead: sales-order workspace, a selected 24-piece Bellezza Milano order.
- Stat: 1 shared record. This is an architectural count, not an invented
  efficiency or performance metric.
- Object: an Italian DDT delivery document, lifted paper and a dispatch tick.
- Diagram: order connects stock and invoice.

A 11.2-second loop: new → ready → records connected → dispatched → outgoing
record fades → reset hidden → next record. The surrounding workspace, paper
and diagram nodes persist. The typography tile holds still. There is one
source of motion, with restrained supporting responses, and no demo cursor.
Pause/Resume is available; reduced motion shows the completed composition.

Desktop uses a 7/5 then 5/7 split. Below a 650px container the tiles stack.
The platform crop shortens again below 300px; native UI text does not scale
down to fit. Each picture uses its measured slot width, following the gold.

## Evidence

`output/def-erp-hero/` (ignored local artifacts):
- `gold.png`: official bento baseline, recorded before implementation.
- `poster.png`, `mobile.png`, `narrow.png`: 1280 / 390 / 320 viewport checks.
- `loop.png`, `loop.json`: full loop plus next start, all three animated tiles.
- `seam-detail.png`, `seam-detail.json`: document reset at 60ms intervals.
- `desktop.png`, `mobile-final.png`: clean final captures without development UI.
- `hero.gif`, `hero.mp4`: 11.2-second, 10fps presentation exports.
- `frames/`: source browser frames.

Checks: TypeScript, component ESLint, CSS namespace checker and git whitespace
check passed. Desktop, 390px and 320px poster gates: `rehearsal passed`.
The loop and 60ms document reset gates also end `rehearsal passed`, with no
remaining composition or motion findings. Initial transform settling and
seal exit findings were fixed with a persistent layer and corrected fade
rule order. Flow nodes retain their text composition layers during line fades.

**Coverage limit:** dev-browser frame sampling had gaps; film reports remain
`inconclusive` for exhaustive frame coverage, despite passing mandatory gate
checks. These results do not claim every rendered frame was inspected.

Chrome playback, Pause/Resume, reduced-motion poster and phone resizing
were exercised without browser exceptions. Source was inspected beside the
actual warehouse dashboard evidence. One existing shared kit component was
added (`Connector`); no changes to the previous Procurement Agent animation.

## Fresh-eye review

Independent reviewer accepted ERP specificity, four-kind composition, focal
content scale, framing and density. Fixed both findings: replaced decorative
“01.” with a literal “1”; removed Next development indicator from final media.

Not checked: physical touch devices, Safari/Firefox, production build or
production deployment, every tab-hidden/offscreen interruption. Preview route:
`/projects/def-erp-kit/hero`. The approved animation is used as a homepage DEF ERP entry cover: static by default, looping on pointer hover, and returning immediately to the poster on leave. Each hover restarts from the beginning. Reduced-motion and non-hover devices keep the static cover. It is not embedded in the project detail page.


## Homepage background revision

Following Stageshow `references/backgrounds.md` (quiet solid ground), the
homepage media uses an opaque matte grey `#e6e6e3` field, baked into both MP4
and poster. The four-tile composition is inset into a 1120 × 700 (16:10) canvas,
with the same 904px picture width in both assets. The CSS fallback uses that
same background. No pattern or glow competes with the small foreground UI.

Files: `public/videos/def-erp/hero-cover.mp4` and `hero-cover.png`. Export:
`output/def-erp-hero/hero-with-bg.mp4` and `hero-with-bg.gif`. The original raw
video and desktop image remain available as source assets. Default static,
hover-to-loop and pointer-leave reset behavior are preserved.


## Current background: colorful gradient

The later user instruction replaces the matte-grey field with the exact
Stageshow `examples/backgrounds/backgrounds.css` diagonal recipe:
`linear-gradient(130deg, #6253e6 0%, #aa51d2 32%, #e96d94 68%, #ffa36e 100%)`.
The skill supplies CSS recipes and composition guidance, not a separate
image-generation prompt. This code-native gradient is rendered continuously
behind the board and tile gutters; foreground tiles remain opaque greyscale.

The source component has a board wrapper and a `data-export` capture layout
(1120 × 700, unchanged picture scale/position). The actual browser composition
is captured directly, so there is no matte pad or detached background strip.
`hero-with-gradient.mp4` and `hero-with-gradient.gif` are the current exports;
the homepage consumes the updated public `hero-cover.mp4` and `hero-cover.png`.
Previous grey exports are retained only as superseded local artifacts.


## Current foreground: ERP blue

The latest user revision changes the tile contents from monochrome to the
platform's primary blue `#1366d6` (from `live/def-erp-live.css`). Stages now
use the accent palette, cool neutrals and blue text tokens. Selection and
status use pale blue, the stat tile uses navy `#123f80`, and the document
seal, diagram order node and connectors use the ERP primary. The outer
violet–pink–coral gradient and all motion remain unchanged.

Current exports: `hero-blue-gradient.mp4` / `hero-blue-gradient.gif`; the
homepage public video and poster have been replaced with this version.


## Current background: soft mint/lavender ambient fields

The latest instruction softens the external background to match Procurement
Agent's low-saturation ambient treatment, with different hues. Procurement
uses blue/apricot on an off-white field (`procurement-cover.css`). ERP now
uses mint `#c7e6df` at bottom-left and pale lavender `#e2d5f0` at top-right,
blending into `#f4f3f6` with broad 65% radial fades. The blue ERP foreground
is unchanged. The same gradient is rendered into MP4/poster and used by the
CSS fallback. Current exports are `hero-soft-gradient.mp4` and `.gif`; the
homepage public cover files are updated. Previous vivid versions are local
iteration artifacts only.
