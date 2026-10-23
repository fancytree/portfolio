# DEF ERP design-system evidence

Visual foundations use a responsive image composition from the current DEF ERP
source. Controls and business patterns now use live local previews at
`public/demos/def-design-system/index.html?view=controls|patterns`.

Reproducible source is in `demos/def-design-system/`. Original components,
transitive local imports and the unified product CSS are preserved under
`src/product/`; `src/main.tsx` adds local demo state. No real business API is used.

Included controls: Button, Input, Badge, Checkbox, Switch, Select, QuantityStepper
and SearchInput. Business patterns include DocumentProgressSteps, Card, Tabs,
Table and TablePagination. Document progress distinguishes pending, partial and
done receipt states, matching the supplied Edit → Ordered → Received example.

The Card radius was verified from the rendered current source: `12px`, from
`--shape-lg`. The iframe reports content height and the parent verifies origin
and source window. Typography and colours remain isolated inside the preview;
Case Kit owns the surrounding narrative, frame and caption.

Run `npm run check:def-erp` for the scoped ERP/shared-module token contract.
Legacy cases are outside this check’s scope.
