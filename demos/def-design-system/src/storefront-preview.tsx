import { useEffect, useMemo, useRef, useState } from 'react';
import { House, LayoutGrid, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DEFAULT_QUICK_LINKS, FEATURED_COUNT, PRODUCTS, TAB_DEFAULTS, isContentModule, type ContentModuleId, type DragModuleId, type ModuleId, type SelectedModuleId, type Storefront } from './storefront-data';

/**
 * 手机预览：嵌入作品集站点上的真实小程序首页（Taro 编译产物），消息协议照搬原 ERP 的 RealStorefrontPreview：
 * 父页面发 content + state，小程序回 ready / select / move / remove / drop。
 */

const REAL_MODULE: Record<ContentModuleId, string> = {
  carousel: 'carousel', announcement: 'announcement', 'quick-links': 'quick-links', brands: 'brand-zone', products: 'product-group',
  service: 'customer-service', 'single-product': 'product', 'limited-time': 'limited-time', 'frequent-products': 'frequent-products',
};
const realModule = (id: SelectedModuleId) => (id.startsWith('products:') ? id.replace('products:', 'product-group:') : REAL_MODULE[id as ContentModuleId] ?? id);
function demoModule(value: unknown): DragModuleId | undefined {
  if (typeof value !== 'string') return undefined;
  if (value === 'product-group:new') return 'products:new';
  const dynamic = value.replace('product-group:', 'products:');
  if (value.startsWith('product-group:') && isContentModule(dynamic)) return dynamic;
  return (Object.keys(REAL_MODULE) as ContentModuleId[]).find((id) => REAL_MODULE[id] === value);
}
const TAB_ICON = [House, LayoutGrid, ShoppingCart, User];

export default function StorefrontPreview({ state, selected, onSelect, interactive = true, draggingId = null, onDropModule, onMove, onRemove, height }: {
  state: Storefront; selected: SelectedModuleId; onSelect: (id: SelectedModuleId) => void; interactive?: boolean; draggingId?: DragModuleId | null;
  onDropModule?: (id: DragModuleId, index: number) => void; onMove?: (id: ModuleId, offset: number) => void; onRemove?: (id: ModuleId) => void; height?: string;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const lastDragged = useRef<DragModuleId | null>(null);
  if (draggingId) lastDragged.current = draggingId;
  const [tab, setTab] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const source = useMemo(() => {
    const url = new URL('/portfolio/storefront-runtime/index.html', location.origin);
    url.searchParams.set('preview', '1'); url.searchParams.set('parentOrigin', location.origin); url.hash = '/pages/home/index';
    return url.toString();
  }, []);

  const content = useMemo(() => {
    const products = PRODUCTS.map((p, i) => ({
      id: `demo-product-${i}`, productId: `demo-product-${i}`, skuId: `demo-sku-${i}`, skuCode: `DEF-${1001 + i}`, productCode: `DEF-${1001 + i}`,
      specifications: { Volume: i < 2 ? '300 ml' : '30 ml' }, name: p.name, productName: p.name, subtitle: null, brand: p.brand, unit: 'PZ', salesUnitId: null, qtyPerBase: 1,
      imageUrl: p.image, categoryId: null, ivaRate: 22, price: Number(p.price.replace('€ ', '').replace(',', '.')), originalPrice: null,
      discountRate: null, availableQty: 80, skuCount: 1, hasMultipleSkus: false,
    }));
    const featured = products.slice(0, FEATURED_COUNT);
    return {
      editable: interactive, draggingId: draggingId ? realModule(draggingId) : null,
      home: {
        layout: state.layout.map(realModule),
        banners: state.banners.filter((b) => b.active).map((b) => ({ id: b.id, imageUrl: b.image, linkUrl: b.linkUrl, title: '', subtitle: '', actionLabel: '' })),
        quickLinks: (state.quickLinks ?? DEFAULT_QUICK_LINKS).filter((q) => q.isActive).map(({ id, name, iconUrl, linkUrl }) => ({ id, name, iconUrl, linkUrl })),
        announcement: { content: state.announcement, linkUrl: state.announcementLinkUrl, updatedAt: '' },
        brands: state.brands.map(({ id, name, logoUrl }) => ({ id, name, logoUrl })),
        singleProduct: products[state.singleProductIndex], recommendations: featured,
        promotions: featured.map((p) => ({ ...p, originalPrice: p.price * 1.2, isPromo: true })), frequentProducts: featured,
        productGroups: state.layout.filter((id) => id === 'products' || id.startsWith('products:')).map((id) => {
          const g = state.productGroups?.[id];
          return {
            groupId: id === 'products' ? 'home' : id.slice('products:'.length), moduleId: realModule(id),
            config: { title: id === 'products' ? state.productTitle : g?.title ?? 'Product collection', displayStyle: (id === 'products' ? state.columns : g?.columns) === 1 ? 'list' : 'grid', updatedAt: null },
            products: (id === 'products' ? (state.homeProductIndexes ?? featured.map((_, i) => i)) : g?.productIndexes ?? []).map((i) => products[i]).filter(Boolean),
          };
        }),
        productGroupConfig: { title: state.productTitle, displayStyle: state.columns === 1 ? 'list' : 'grid', updatedAt: null },
        limitedTimeConfig: { title: 'Special offers', displayStyle: state.limitedStyle, displayCount: 6, updatedAt: null },
        frequentProductsConfig: { displayStyle: state.frequentStyle, displayCount: 6, updatedAt: null },
      },
      tabBar: TAB_DEFAULTS.map((t, i) => ({ ...t, label: state.tabBarLabels[i] ?? t.label, sortOrder: i, updatedAt: '' })),
    };
  }, [state, interactive, draggingId]);

  useEffect(() => {
    const receive = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow || e.origin !== location.origin) return;
      const m = e.data; if (!m || typeof m !== 'object') return;
      if (m.source === 'def-portfolio-preview') {
        if (m.type === 'ready') setLoaded(true);
        if (m.type === 'drop' && interactive) {
          const id = demoModule(m.payload?.moduleId);
          if (id && id === lastDragged.current && Number.isInteger(m.payload.index)) { onDropModule?.(id, m.payload.index); lastDragged.current = null; }
        }
        return;
      }
      if (m.source !== 'def-storefront-preview') return;
      if (m.type === 'ready') { setReady(true); setFailed(false); return; }
      if (!interactive) return;
      const id = demoModule(m.payload?.moduleId);
      if (!id || id === 'products:new') return;
      if (m.type === 'select') onSelect(id);
      if (m.type === 'move' && (m.payload.offset === -1 || m.payload.offset === 1)) onMove?.(id, m.payload.offset);
      if (m.type === 'remove') onRemove?.(id);
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [interactive, onDropModule, onMove, onRemove, onSelect]);

  useEffect(() => {
    if (!loaded) return;
    const w = frame.current?.contentWindow; if (!w) return;
    w.postMessage({ source: 'def-portfolio-storefront', type: 'content', payload: content }, location.origin);
    w.postMessage({ source: 'def-erp-storefront', type: 'state', payload: { layout: content.home.layout, selectedId: realModule(selected), editable: interactive } }, location.origin);
    if (ready) w.postMessage({ source: 'def-erp-storefront', type: 'refresh' }, location.origin);
  }, [content, interactive, loaded, ready, selected]);

  useEffect(() => { if (ready) return; const t = setTimeout(() => setFailed(true), 12000); return () => clearTimeout(t); }, [ready]);

  return (
    <div className="mx-auto flex w-[320px] max-w-full flex-col overflow-hidden rounded-[2.75rem] border-[7px] border-[#1d2333] bg-card shadow-[0_24px_48px_-20px_rgb(16_24_40/0.35)]">
      <div className="flex h-8 shrink-0 items-center justify-between px-6 text-[10px] font-semibold"><span>9:41</span><span className="h-2 w-4 rounded-sm bg-foreground" /></div>
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border px-4 text-xs font-semibold"><span>DEF Beauty</span><span className="rounded-full border border-border px-2.5 py-0.5 tracking-widest">•••　◉</span></div>
      <div className="relative" style={{ height: height ?? 'clamp(300px, calc(100vh - 330px), 560px)' }} aria-label="Storefront mobile preview">
        <iframe ref={frame} src={source} title="Real mini-program home page" sandbox="allow-scripts allow-same-origin" className="size-full border-0 bg-background" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
        {ready && state.layout.length === 0 && <div className="pointer-events-none absolute inset-0 grid place-items-center bg-card/95 p-6 text-center text-xs text-muted-foreground">Add a module from the library to start the page.</div>}
        {!ready && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card p-6 text-center text-xs text-muted-foreground">
            <p>{failed ? 'Could not load the mini-program preview.' : 'Loading the real mini-program…'}</p>
            {failed && <Button size="sm" variant="outline" onClick={() => { setLoaded(false); setFailed(false); if (frame.current) frame.current.src = source; }}>Retry</Button>}
          </div>
        )}
      </div>
      <nav className="grid h-14 shrink-0 grid-cols-4 border-t border-border bg-card" aria-label="Mini-program bottom navigation">
        {TAB_DEFAULTS.map((t, i) => { const I = TAB_ICON[i]; const on = i === tab; return (
          <button key={t.key} type="button" aria-label={`Preview ${state.tabBarLabels[i]} tab`} aria-pressed={on} onClick={() => { setTab(i); if (interactive) onSelect('tab-bar'); }}
            className={'flex flex-col items-center justify-center gap-1 text-[10px] transition-colors ' + (on ? 'text-[#c0392b]' : 'text-muted-foreground')}>
            <I className="size-5" strokeWidth={on ? 2.25 : 1.75} /><span>{state.tabBarLabels[i]}</span>
          </button>
        ); })}
      </nav>
      <div aria-hidden className="flex h-4 shrink-0 items-center justify-center"><span className="h-1 w-24 rounded-full bg-foreground" /></div>
    </div>
  );
}
