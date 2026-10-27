# Procurement Agent portfolio demo

The current purchase list, replenishment opportunities, order workspace and 18 interactive design facets are exported directly from DEF source. Run npm install, then npm run build. Serve dist/ at /demos/procurement-agent/. The default entry restores the original browser chrome, Reset, and six-stage demo navigation (Introduction, Purchase orders, Replenishment plan, Owner approval, Goods receipt, Retrospective), independent of the ERP and portfolio navigation; ?guide=off hides the guide for screenshots. Introduction preserves the original interactive Agent/Human workflow and design conversation. Purchase orders is its own second step; ?facet=01 through ?facet=12 and ?facet=A through ?facet=F mount the matching design interaction. Refresh begins a fresh purchasing session.

Regenerate from DEF with node scripts/export-procurement-agent-portfolio.mjs. source-manifest.json records every copied source file.
