# DEF ERP live demo

A production build of the real ERP (def-platform/web) running in its portfolio demo scope:
in-browser mock backend, English copy, demonstration data, no connection to a real project.

Routes under `/portfolio/live/*` are rewritten to this shell in `next.config.ts`.
Product photos live in `public/portfolio/products/`.

Rebuild (placeholder env, so no real keys are bundled):

```sh
cd <def-platform>/web
VITE_SUPABASE_URL=https://portfolio-demo.invalid VITE_SUPABASE_ANON_KEY=portfolio-demo-anon-key VITE_POSTHOG_KEY= \
  npx vite build --base=/demos/def-erp/ --outDir <tmp> --emptyOutDir --sourcemap false
# copy <tmp>/index.html and <tmp>/assets here; drop the external capture script from index.html
```
