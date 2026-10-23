# DEF ERP interactive component evidence

Two local previews, using demonstration data and no business API:

- `index.html?view=controls`: buttons, save feedback, inputs and validation,
  informational badges, checkboxes, switches, search, payment selection and quantity.
- `index.html?view=patterns`: purchase-order progress (`pending`, `partial`,
  `done`), cards, status filters, order search, empty results and pagination.

`src/product/` is a source snapshot of the original DEF ERP components and
their transitive local imports. `src/product/index.css` is the original unified
product token/style source. Update both together when refreshing the snapshot;
do not restyle copies of the controls in the portfolio narrative.

`src/main.tsx` composes those components and supplies local state. The product
styles stay inside the iframe; the case frame and captions use Case Kit.
The preview reports its content height through a same-origin postMessage;
CaseInteractivePreview verifies the sending window and origin before resizing.
It also measures the same-origin content on load and observes content/layout
changes, so cached loads remain complete even if a height message is missed.

```sh
npm --prefix demos/def-design-system install
npm --prefix demos/def-design-system run build
npx tsc --noEmit -p demos/def-design-system/tsconfig.json
```

Build output goes to `public/demos/def-design-system/`, which must be included
with the case. No separate server is needed after export. Preserve the light
colour scheme and the content-driven root layout when refreshing product CSS.
