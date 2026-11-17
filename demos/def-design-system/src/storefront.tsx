import React, { useEffect, useRef, useState, type DragEvent } from 'react';
import { ArrowDown, ArrowUp, Check, Eye, Images, Pencil, Plus, Redo2, Save, Search, Send, Smartphone, Trash2, Undo2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { FormDialog, FormSection } from './form-dialog';
import { SlideTabs } from './motion';
import StorefrontPreview from './storefront-preview';
import {
  BANNER_IMAGES, BRAND_CATALOG, DEFAULT_QUICK_LINKS, FEATURED_COUNT, GROUPS, INITIAL, LINK_TYPES, MODULES, PRODUCTS, PRODUCT_TAGS, TAB_DEFAULTS,
  iconSrc, isContentModule, linkError, linkSummary, moduleDefinitionId, parseLink, serializeLink,
  type Banner, type DragModuleId, type LinkDraft, type ModuleId, type ProductGroupConfig, type PromoStyle, type QuickLink, type SelectedModuleId, type Storefront,
} from './storefront-data';

/**
 * 店铺装修。功能对齐原 ERP 的 StorefrontShowcasePage：左模块库（点 + 或拖到手机上添加）、中间真实小程序预览
 * （点模块选中，模块上有上移 / 下移 / 删除）、右边当前模块的设置；撤销 / 重做、预览、保存草稿、发布。
 */

const DRAG_TYPE = 'application/x-def-storefront-module';
const FIELD = 'h-10 rounded-xl';
const SEG = 'grid h-10 grid-cols-2 gap-0.5 rounded-xl bg-muted p-1';
const SEG_ITEM = 'h-full rounded-[8px] text-sm';
const label = 'mb-1.5 block text-xs text-muted-foreground';

function Segmented<T extends string>({ name, value, onChange, items }: { name: string; value: T; onChange: (v: T) => void; items: { id: T; label: string }[] }) {
  return <SlideTabs kind="radio" label={name} value={value} onChange={onChange} items={items} className={SEG} itemClassName={SEG_ITEM}
    activeClassName="font-semibold text-foreground" idleClassName="text-muted-foreground hover:text-foreground" indicatorClassName="rounded-[8px] bg-card shadow-[0_1px_2px_rgb(16_24_40/0.08)]" />;
}

function LinkEditor({ link, setLink }: { link: LinkDraft; setLink: (d: LinkDraft) => void }) {
  const err = linkError(link);
  return (
    <div className="space-y-3">
      <div><span className={label}>Destination</span>
        <Select value={link.type} onValueChange={(v) => setLink({ type: v as LinkDraft['type'], productId: '', categoryId: '', tag: '', url: '' })} size="lg" ariaLabel="Destination" triggerClassName="!h-10 w-full rounded-xl" options={LINK_TYPES} /></div>
      {link.type === 'single-product' && <div><span className={label}>Product</span><Select value={link.productId || null} onValueChange={(v) => setLink({ ...link, productId: v })} size="lg" placeholder="Choose a product" ariaLabel="Product" triggerClassName="!h-10 w-full rounded-xl" options={PRODUCTS.map((p, i) => ({ value: `demo-product-${i}`, label: p.name }))} /></div>}
      {link.type === 'category' && <div><span className={label}>Category</span><Select value={link.categoryId || null} onValueChange={(v) => setLink({ ...link, categoryId: v })} size="lg" placeholder="Choose a category" ariaLabel="Category" triggerClassName="!h-10 w-full rounded-xl" options={DEFAULT_QUICK_LINKS.map((q) => ({ value: q.id, label: q.name }))} /></div>}
      {link.type === 'tag' && <div><span className={label}>Product tag</span><div className="flex flex-wrap gap-1.5">{PRODUCT_TAGS.map((t) => <button key={t} type="button" aria-pressed={link.tag === t} onClick={() => setLink({ ...link, tag: t })} className={'h-8 rounded-lg border px-2.5 text-sm transition-colors ' + (link.tag === t ? 'border-primary bg-primary/10 font-medium text-primary-strong' : 'border-input hover:bg-[var(--surface-hover)]')}>{t}</button>)}</div></div>}
      {link.type === 'external' && <div><span className={label}>HTTPS URL</span><Input value={link.url} placeholder="https://example.com/collection" onChange={(e) => setLink({ ...link, url: e.target.value })} className={FIELD} aria-label="HTTPS URL" /></div>}
      {err && <p role="alert" className="text-xs text-destructive">{err}</p>}
    </div>
  );
}

function ProductSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex h-10 items-center gap-2 rounded-xl border border-input bg-card px-3 text-sm focus-within:ring-2 focus-within:ring-ring/40">
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <input aria-label="Search products" placeholder="Search products or brands" value={value} onChange={(e) => onChange(e.target.value)} className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
      {value && <button type="button" aria-label="Clear search" onClick={() => onChange('')} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>}
    </label>
  );
}
const searchProducts = (q: string) => { const n = q.trim().toLowerCase(); return PRODUCTS.map((p, i) => ({ p, i })).filter(({ p }) => !n || p.name.toLowerCase().includes(n) || p.brand.toLowerCase().includes(n)); };
const Row = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => <div className={'flex items-center gap-3 rounded-xl border border-border bg-card p-2.5 ' + className}>{children}</div>;
const IconBtn = ({ label: l, onClick, disabled, children, danger }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode; danger?: boolean }) => (
  <button type="button" aria-label={l} title={l} disabled={disabled} onClick={onClick} className={'grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors disabled:opacity-35 ' + (danger ? 'hover:bg-status-danger-subtle hover:text-destructive' : 'hover:bg-[var(--surface-hover)] hover:text-foreground')}>{children}</button>
);

/* ───────── 快捷入口 ───────── */
function QuickLinkSettings({ items, onChange }: { items: QuickLink[]; onChange: (v: QuickLink[]) => void }) {
  const [draft, setDraft] = useState<QuickLink | null>(null);
  const [link, setLink] = useState<LinkDraft>(parseLink(null));
  const move = (i: number, d: number) => { const n = [...items]; [n[i], n[i + d]] = [n[i + d], n[i]]; onChange(n); };
  const exists = draft && items.some((x) => x.id === draft.id);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground"><span className="font-semibold tabular-nums text-foreground">{items.filter((x) => x.isActive).length}</span> shown · {items.length}/12</span>
        <Button variant="outline" size="sm" disabled={items.length >= 12} onClick={() => { setDraft({ id: 'ql-' + Date.now(), name: '', iconUrl: DEFAULT_QUICK_LINKS[0].iconUrl, linkUrl: null, isActive: true }); setLink(parseLink(null)); }}><Plus />Add shortcut</Button></div>
      {items.map((q, i) => (
        <Row key={q.id} className={q.isActive ? '' : 'opacity-60'}>
          <img src={iconSrc(q.iconUrl)} alt="" className="size-9 shrink-0 object-contain" />
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{q.name}</p><p className="truncate text-xs text-muted-foreground">{linkSummary(q.linkUrl)}</p></div>
          <div className="flex items-center">
            <IconBtn label={`Move shortcut ${q.name} up`} disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="size-4" /></IconBtn>
            <IconBtn label={`Move shortcut ${q.name} down`} disabled={i === items.length - 1} onClick={() => move(i, 1)}><ArrowDown className="size-4" /></IconBtn>
            <IconBtn label={`Edit shortcut ${q.name}`} onClick={() => { setDraft({ ...q }); setLink(parseLink(q.linkUrl)); }}><Pencil className="size-4" /></IconBtn>
          </div>
          <Switch checked={q.isActive} aria-label={`Show shortcut ${q.name}`} onCheckedChange={(v) => onChange(items.map((x) => (x.id === q.id ? { ...x, isActive: v } : x)))} />
        </Row>
      ))}
      <FormDialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)} title={exists ? 'Edit shortcut' : 'Add shortcut'} description="Name, icon and where it opens."
        status={!draft?.name.trim() ? 'Name is required' : linkError(link) ?? undefined} confirmLabel="Save shortcut" confirmDisabled={!draft?.name.trim() || !!linkError(link)}
        onConfirm={() => { if (!draft) return; const item = { ...draft, name: draft.name.trim(), linkUrl: serializeLink(link) }; onChange(exists ? items.map((x) => (x.id === item.id ? item : x)) : [...items, item]); setDraft(null); }}
        cancelLabel="Cancel">
        {draft && <>
          <FormSection title="Name"><Input id="quick-link-name" value={draft.name} maxLength={30} placeholder="e.g. New arrivals" onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={FIELD} /></FormSection>
          <FormSection title="Icon" hint="Square, transparent background.">
            <div className="grid grid-cols-8 gap-2">{DEFAULT_QUICK_LINKS.map((q) => <button key={q.id} type="button" aria-label={`Use ${q.name} icon`} aria-pressed={draft.iconUrl === q.iconUrl} onClick={() => setDraft({ ...draft, iconUrl: q.iconUrl })}
              className={'grid aspect-square place-items-center rounded-xl border p-1.5 transition-colors ' + (draft.iconUrl === q.iconUrl ? 'border-primary bg-primary/5' : 'border-border hover:bg-[var(--surface-hover)]')}><img src={iconSrc(q.iconUrl)} alt="" className="size-full object-contain" /></button>)}</div>
          </FormSection>
          <FormSection title="Opens"><LinkEditor link={link} setLink={setLink} /></FormSection>
          {exists && <FormSection title="Remove"><Button variant="outline" className="text-destructive" onClick={() => { onChange(items.filter((x) => x.id !== draft.id)); setDraft(null); }}><Trash2 />Delete shortcut</Button></FormSection>}
        </>}
      </FormDialog>
    </div>
  );
}

/* ───────── 品牌 ───────── */
function BrandSettings({ items, onChange }: { items: Storefront['brands']; onChange: (v: Storefront['brands']) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const left = BRAND_CATALOG.filter((b) => !items.some((x) => x.id === b.id) && b.name.toLowerCase().includes(q.trim().toLowerCase()));
  const move = (i: number, d: number) => { const n = [...items]; [n[i], n[i + d]] = [n[i + d], n[i]]; onChange(n); };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground"><span className="font-semibold tabular-nums text-foreground">{items.length}</span> brands · each opens its products</span>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}><Plus />Add brand</Button></div>
      {items.map((b, i) => (
        <Row key={b.id}>
          <img src={b.logoUrl} alt="" className="size-10 shrink-0 rounded-lg border border-border bg-card object-contain" />
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{b.name}</span>
          <IconBtn label={`Move brand ${b.name} up`} disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="size-4" /></IconBtn>
          <IconBtn label={`Move brand ${b.name} down`} disabled={i === items.length - 1} onClick={() => move(i, 1)}><ArrowDown className="size-4" /></IconBtn>
          <IconBtn label={`Remove brand ${b.name}`} danger onClick={() => onChange(items.filter((x) => x.id !== b.id))}><Trash2 className="size-4" /></IconBtn>
        </Row>
      ))}
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQ(''); }}>
        <DialogContent showCloseButton={false} className="flex max-h-[80vh] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-md">
          <header className="flex items-start justify-between border-b border-border px-6 pb-4 pt-5"><div><DialogTitle className="text-lg font-semibold">Add brand</DialogTitle><DialogDescription className="mt-1 text-sm text-muted-foreground">From the brands you stock.</DialogDescription></div>
            <DialogClose className="-mr-2 grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted" aria-label="Close"><X className="size-4" /></DialogClose></header>
          <div className="space-y-3 overflow-y-auto px-6 py-5">
            <label className="flex h-10 items-center gap-2 rounded-xl border border-input px-3 text-sm"><Search className="size-4 text-muted-foreground" /><input aria-label="Search brands" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search brands" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" /></label>
            {left.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">{q ? 'No matching brand.' : 'Every brand is already on the page.'}</p>
              : left.map((b) => <button key={b.id} type="button" aria-label={`Add ${b.name}`} onClick={() => { onChange([...items, b]); setOpen(false); setQ(''); }} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-[var(--surface-hover)]"><img src={b.logoUrl} alt="" className="size-10 rounded-lg border border-border object-contain" /><span className="text-sm font-medium">{b.name}</span><Plus className="ml-auto size-4 text-muted-foreground" /></button>)}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function StorefrontBuilder() {
  const [state, setState] = useState<Storefront>(INITIAL);
  const [saved, setSaved] = useState(JSON.stringify(INITIAL));
  const [published, setPublished] = useState(JSON.stringify(INITIAL));
  const [selected, setSelected] = useState<SelectedModuleId>('carousel');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dragging, setDragging] = useState<DragModuleId | null>(null);
  const [banner, setBanner] = useState<{ draft: Banner; isNew: boolean } | null>(null);
  const [bannerLink, setBannerLink] = useState<LinkDraft>(parseLink(null));
  const [announceLink, setAnnounceLink] = useState<LinkDraft>(parseLink(null));
  const [collectionQ, setCollectionQ] = useState('');
  const [singleQ, setSingleQ] = useState('');
  const [toast, setToast] = useState('');
  const flash = (t: string) => { setToast(t); setTimeout(() => setToast(''), 2200); };

  // 撤销 / 重做：600ms 内的连续输入合并为一步
  const past = useRef<Storefront[]>([]); const future = useRef<Storefront[]>([]); const prev = useRef(state); const last = useRef(0); const travelling = useRef(false);
  const [, tick] = useState(0);
  useEffect(() => {
    if (prev.current === state) return;
    if (travelling.current) { travelling.current = false; prev.current = state; return; }
    const now = Date.now();
    if (now - last.current > 600 || past.current.length === 0) past.current = [...past.current.slice(-49), prev.current];
    last.current = now; future.current = []; prev.current = state; tick((n) => n + 1);
  }, [state]);
  const travel = (dir: 'undo' | 'redo') => {
    const from = dir === 'undo' ? past : future; const to = dir === 'undo' ? future : past;
    const target = from.current.at(-1); if (!target) return;
    from.current = from.current.slice(0, -1); to.current = [...to.current, state]; travelling.current = true; last.current = 0; setState(target); tick((n) => n + 1);
  };

  const json = JSON.stringify(state);
  const dirty = json !== saved;
  const unpublished = json !== published;
  const def = MODULES.find((m) => m.id === moduleDefinitionId(selected))!;
  const DefIcon = def.icon;

  const addProductGroup = () => {
    const id: ModuleId = state.layout.includes('products') ? `products:${Date.now().toString(36)}` : 'products';
    setState((s) => ({ ...s, layout: [...s.layout, id], ...(id === 'products' ? {} : { productGroups: { ...s.productGroups, [id]: { title: 'Product collection', columns: 2, productIndexes: [] } } }) }));
    setSelected(id); setDragging(null);
  };
  const dropModule = (id: DragModuleId, at: number) => {
    if (id === 'products:new') { addProductGroup(); return; }
    setState((s) => {
      const before = s.layout.indexOf(id); const layout = s.layout.filter((x) => x !== id);
      const idx = before >= 0 && before < at ? at - 1 : at;
      layout.splice(Math.max(0, Math.min(idx, layout.length)), 0, id);
      return { ...s, layout };
    });
    setSelected(id); setDragging(null);
  };
  const move = (id: ModuleId, d: number) => {
    setState((s) => { const l = [...s.layout]; const i = l.indexOf(id); if (i < 0 || i + d < 0 || i + d >= l.length) return s; [l[i], l[i + d]] = [l[i + d], l[i]]; return { ...s, layout: l }; });
    setSelected(id);
  };
  const remove = (id: ModuleId) => setState((s) => { const layout = s.layout.filter((x) => x !== id); if (selected === id) setSelected(layout[0] ?? 'carousel'); return { ...s, layout }; });
  const startDrag = (e: DragEvent<HTMLElement>, id: DragModuleId) => { e.dataTransfer.setData(DRAG_TYPE, id); e.dataTransfer.effectAllowed = 'copy'; setDragging(id); setSelected(id === 'products:new' ? 'products' : id); };

  const group: ProductGroupConfig = selected === 'products'
    ? { title: state.productTitle, columns: state.columns, productIndexes: state.homeProductIndexes ?? PRODUCTS.slice(0, FEATURED_COUNT).map((_, i) => i) }
    : state.productGroups?.[selected] ?? { title: 'Product collection', columns: 2, productIndexes: [] };
  const patchGroup = (p: Partial<ProductGroupConfig>) => setState((s) => (selected === 'products'
    ? { ...s, productTitle: p.title ?? s.productTitle, columns: p.columns ?? s.columns, homeProductIndexes: p.productIndexes ?? s.homeProductIndexes }
    : { ...s, productGroups: { ...s.productGroups, [selected]: { ...group, ...p } } }));
  const save = (publish: boolean) => { setSaved(json); if (publish) setPublished(json); flash(publish ? 'Storefront published' : 'Draft saved'); };
  const openBanner = (b?: Banner) => { setBanner({ draft: b ? { ...b } : { id: 'banner-' + Date.now(), image: '', active: true, linkUrl: null }, isNew: !b }); setBannerLink(parseLink(b?.linkUrl ?? null)); };

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col gap-4">
      <div className="flex shrink-0 items-center justify-between gap-4 rounded-2xl bg-card px-6 py-4 shadow-card">
        <div className="min-w-0"><h1 className="text-2xl font-semibold tracking-[-0.02em]">Storefront builder</h1><p className="mt-0.5 text-sm text-muted-foreground">Build the WeChat home page, module by module.</p></div>
        <div className="flex shrink-0 items-center gap-2">
          <IconBtn label="Undo" disabled={!past.current.length} onClick={() => travel('undo')}><Undo2 className="size-4" /></IconBtn>
          <IconBtn label="Redo" disabled={!future.current.length} onClick={() => travel('redo')}><Redo2 className="size-4" /></IconBtn>
          <span className="mx-1 h-6 w-px bg-border" />
          <Button variant="outline" size="lg" onClick={() => setPreviewOpen(true)}><Eye />Preview</Button>
          <Button variant="outline" size="lg" disabled={!dirty} onClick={() => save(false)}><Save />Save draft</Button>
          <Button size="lg" disabled={!unpublished} onClick={() => save(true)}><Send />Publish</Button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[15rem_minmax(0,1fr)_22rem] gap-4">
        {/* 模块库 */}
        <aside aria-label="Module library" className="flex min-h-0 flex-col overflow-hidden rounded-2xl bg-card shadow-card">
          <div className="shrink-0 border-b border-border px-5 py-4"><h2 className="text-base font-semibold">Modules</h2><p className="mt-0.5 text-xs text-muted-foreground">Click + or drag onto the phone.</p></div>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 [scrollbar-width:thin]">
            {GROUPS.map((g) => (
              <section key={g}>
                <h3 className="mb-1 px-2 text-xs font-medium text-muted-foreground">{g}</h3>
                {MODULES.filter((m) => m.group === g).map((m) => {
                  const I = m.icon; const available = m.available !== false; const content = isContentModule(m.id);
                  const added = m.id === 'tab-bar' || (content && state.layout.includes(m.id as ModuleId));
                  const repeat = m.id === 'products'; const on = moduleDefinitionId(selected) === m.id;
                  return (
                    <div key={m.id} draggable={available && content} onDragStart={(e) => available && content && startDrag(e, repeat ? 'products:new' : m.id as ModuleId)} onDragEnd={() => setDragging(null)}
                      className={'group flex items-center rounded-xl transition-colors ' + (on ? 'bg-primary/10' : 'hover:bg-[var(--surface-hover)]') + (available ? '' : ' opacity-55') + (available && content ? ' cursor-grab active:cursor-grabbing' : '')}>
                      <button type="button" aria-pressed={on} onClick={() => setSelected(m.id)} className="flex min-w-0 flex-1 items-center gap-2.5 px-2 py-2 text-left">
                        <span className={'grid size-8 shrink-0 place-items-center rounded-lg border ' + (on ? 'border-primary/30 bg-card text-primary' : 'border-border bg-card text-muted-foreground')}><I className="size-4" /></span>
                        <span className="min-w-0"><span className={'block truncate text-sm ' + (on ? 'font-semibold text-primary-strong' : 'font-medium')}>{m.label}</span><span className="block truncate text-xs text-muted-foreground">{m.description}</span></span>
                      </button>
                      {available ? (
                        <button type="button" aria-label={repeat || !added ? `Add ${m.label}` : `${m.label} already added`} onClick={() => (repeat ? addProductGroup() : content && !added ? dropModule(m.id as ModuleId, state.layout.length) : setSelected(m.id))}
                          className="mr-1 grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-foreground">
                          {repeat || !added ? <Plus className="size-4" /> : <Check className="size-4 text-success-text" />}
                        </button>
                      ) : <span className="mr-2 text-[11px] text-muted-foreground">Planned</span>}
                    </div>
                  );
                })}
              </section>
            ))}
          </div>
        </aside>

        {/* 手机预览 */}
        <section aria-label="Preview canvas" className="flex min-h-0 flex-col overflow-hidden rounded-2xl bg-card shadow-card">
          <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3.5"><span className="inline-flex items-center gap-2 text-sm font-semibold"><Smartphone className="size-4 text-muted-foreground" />Home page</span><Badge variant="success">Live preview</Badge></div>
          <div className="min-h-0 flex-1 overflow-y-auto bg-[color-mix(in_srgb,var(--surface-sunken)_70%,var(--surface-raised))] py-5 [scrollbar-width:thin]">
            <StorefrontPreview state={state} selected={selected} onSelect={setSelected} draggingId={dragging} onDropModule={dropModule} onMove={move} onRemove={remove} height="clamp(260px, calc(100vh - 410px), 600px)" />
          </div>
        </section>

        {/* 模块设置 */}
        <aside aria-label="Module settings" className="flex min-h-0 flex-col overflow-hidden rounded-2xl bg-card shadow-card">
          <div className="flex shrink-0 items-center gap-3 border-b border-border px-5 py-4">
            <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary"><DefIcon className="size-4" /></span>
            <div className="min-w-0"><h2 className="truncate text-base font-semibold">{selected.startsWith('products:') ? group.title || 'Product collection' : def.label}</h2><p className="text-xs text-muted-foreground">{def.description}</p></div>
            {isContentModule(selected) && state.layout.includes(selected) && <IconBtn label="Remove module from page" danger onClick={() => remove(selected)}><Trash2 className="size-4" /></IconBtn>}
          </div>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 [scrollbar-width:thin]">
            {isContentModule(selected) && !state.layout.includes(selected) && (
              <div className="rounded-xl border border-dashed border-border p-4 text-center"><p className="text-sm text-muted-foreground">Not on the page yet.</p>
                <Button variant="outline" size="sm" className="mt-2.5" onClick={() => dropModule(selected, state.layout.length)}><Plus />Add to page</Button></div>
            )}

            {selected === 'carousel' && <>
              <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground"><span className="font-semibold tabular-nums text-foreground">{state.banners.length}</span>/8 images · text inside the image</span>
                <Button variant="outline" size="sm" disabled={state.banners.length >= 8} onClick={() => openBanner()}><Plus />Add banner</Button></div>
              {state.banners.map((b, i) => (
                <div key={b.id} className={'overflow-hidden rounded-xl border border-border ' + (b.active ? '' : 'opacity-60')}>
                  <button type="button" aria-label={`Edit banner ${i + 1}`} onClick={() => openBanner(b)} className="block w-full"><img src={b.image} alt="" className="block aspect-[2/1] w-full bg-muted object-cover" /></button>
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <div className="min-w-0 flex-1"><p className="text-sm font-medium">Banner {i + 1}</p><p className="truncate text-xs text-muted-foreground">{linkSummary(b.linkUrl)}</p></div>
                    <IconBtn label={`Replace banner ${i + 1}`} onClick={() => openBanner(b)}><Images className="size-4" /></IconBtn>
                    <IconBtn label={`Remove banner ${i + 1}`} danger onClick={() => setState((s) => ({ ...s, banners: s.banners.filter((x) => x.id !== b.id) }))}><Trash2 className="size-4" /></IconBtn>
                    <Switch checked={b.active} aria-label={`Show banner ${i + 1}`} onCheckedChange={(v) => setState((s) => ({ ...s, banners: s.banners.map((x) => (x.id === b.id ? { ...x, active: v } : x)) }))} />
                  </div>
                </div>
              ))}
              {!state.banners.length && <Button variant="outline" className="w-full" onClick={() => openBanner()}>Choose the first banner</Button>}
            </>}

            {selected === 'announcement' && <>
              <div><label htmlFor="storefront-announcement" className={label}>Announcement text</label>
                <Input id="storefront-announcement" value={state.announcement} maxLength={120} onChange={(e) => setState((s) => ({ ...s, announcement: e.target.value }))} className={FIELD} />
                <p className="mt-1.5 text-right text-xs tabular-nums text-muted-foreground">{state.announcement.length}/120</p></div>
              <LinkEditor link={announceLink} setLink={(l) => { setAnnounceLink(l); setState((s) => ({ ...s, announcementLinkUrl: linkError(l) ? null : serializeLink(l) })); }} />
            </>}

            {moduleDefinitionId(selected) === 'products' && <>
              <div><label htmlFor="collection-title" className={label}>Title</label><Input id="collection-title" value={group.title} maxLength={50} onChange={(e) => patchGroup({ title: e.target.value })} className={FIELD} /></div>
              <div><span className={label}>Layout</span><Segmented name="Collection layout" value={String(group.columns) as '1' | '2'} onChange={(v) => patchGroup({ columns: Number(v) as 1 | 2 })} items={[{ id: '2', label: 'Two per row' }, { id: '1', label: 'One per row' }]} /></div>
              <div className="space-y-2.5">
                <span className={label + ' !mb-0'}>Products · {group.productIndexes.length}</span>
                <ProductSearch value={collectionQ} onChange={setCollectionQ} />
                {collectionQ.trim() && (
                  <div className="space-y-1 rounded-xl border border-border p-1.5">
                    {searchProducts(collectionQ).slice(0, 6).map(({ p, i }) => { const added = group.productIndexes.includes(i); return (
                      <div key={p.name} className="flex items-center gap-2.5 rounded-lg px-1.5 py-1"><img src={p.image} alt="" className="size-9 rounded-md object-contain" /><span className="min-w-0 flex-1"><span className="block truncate text-sm">{p.name}</span><span className="block truncate text-xs text-muted-foreground">{p.brand}</span></span>
                        <Button size="sm" variant={added ? 'ghost' : 'outline'} disabled={added} aria-label={`Add ${p.name}`} onClick={() => patchGroup({ productIndexes: [...group.productIndexes, i] })}>{added ? 'Added' : 'Add'}</Button></div>
                    ); })}
                    {!searchProducts(collectionQ).length && <p className="p-2 text-sm text-muted-foreground">No match.</p>}
                  </div>
                )}
                {group.productIndexes.map((i) => PRODUCTS[i] && (
                  <Row key={i}><img src={PRODUCTS[i].image} alt="" className="size-10 rounded-md object-contain" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{PRODUCTS[i].name}</span><span className="block text-xs tabular-nums text-muted-foreground">{PRODUCTS[i].price}</span></span>
                    <IconBtn label={`Remove ${PRODUCTS[i].name}`} danger onClick={() => patchGroup({ productIndexes: group.productIndexes.filter((x) => x !== i) })}><X className="size-4" /></IconBtn></Row>
                ))}
                {!group.productIndexes.length && !collectionQ.trim() && <p className="text-sm text-muted-foreground">Search to add products.</p>}
              </div>
            </>}

            {selected === 'quick-links' && <QuickLinkSettings items={state.quickLinks} onChange={(quickLinks) => setState((s) => ({ ...s, quickLinks }))} />}
            {selected === 'brands' && <BrandSettings items={state.brands} onChange={(brands) => setState((s) => ({ ...s, brands }))} />}

            {selected === 'tab-bar' && <>
              <p className="text-sm text-muted-foreground">Four tabs at the bottom of every page. Rename them to match how customers shop.</p>
              {TAB_DEFAULTS.map((t, i) => (
                <div key={t.key}><label htmlFor={`tab-label-${i}`} className={label}>{['Home', 'Catalog', 'Cart', 'Account'][i]}</label>
                  <Input id={`tab-label-${i}`} maxLength={8} value={state.tabBarLabels[i]} onChange={(e) => setState((s) => ({ ...s, tabBarLabels: s.tabBarLabels.map((x, j) => (j === i ? e.target.value : x)) }))} className={FIELD} /></div>
              ))}
            </>}

            {selected === 'single-product' && (() => { const cur = PRODUCTS[state.singleProductIndex]; return <>
              <span className={label + ' !mb-0'}>On the page</span>
              <Row className="!border-primary bg-primary/5"><img src={cur.image} alt="" className="size-11 rounded-md object-contain" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{cur.name}</span><span className="block text-xs text-muted-foreground">{cur.brand} · {cur.price}</span></span></Row>
              <ProductSearch value={singleQ} onChange={setSingleQ} />
              {singleQ.trim() ? (
                <div className="space-y-1 rounded-xl border border-border p-1.5">
                  {searchProducts(singleQ).slice(0, 6).map(({ p, i }) => { const on = state.singleProductIndex === i; return (
                    <button key={p.name} type="button" aria-pressed={on} disabled={on} onClick={() => { setState((s) => ({ ...s, singleProductIndex: i })); setSingleQ(''); }} className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1 text-left hover:bg-[var(--surface-hover)] disabled:opacity-60">
                      <img src={p.image} alt="" className="size-9 rounded-md object-contain" /><span className="min-w-0 flex-1 truncate text-sm">{p.name}</span><span className="text-xs text-muted-foreground">{on ? 'On page' : 'Use'}</span></button>
                  ); })}
                </div>
              ) : <p className="text-sm text-muted-foreground">Search to replace it.</p>}
            </>; })()}

            {(selected === 'limited-time' || selected === 'frequent-products') && <>
              <p className="text-sm text-muted-foreground">{selected === 'limited-time' ? 'Products from the active campaign, at their promo price.' : 'Each customer sees what they reorder most.'}</p>
              <div><span className={label}>Layout</span><Segmented name="Promo layout" value={selected === 'limited-time' ? state.limitedStyle : state.frequentStyle}
                onChange={(v: PromoStyle) => setState((s) => (selected === 'limited-time' ? { ...s, limitedStyle: v } : { ...s, frequentStyle: v }))} items={[{ id: 'grid', label: 'Three per row' }, { id: 'scroll', label: 'Swipe row' }]} /></div>
            </>}

            {selected === 'service' && <div className="rounded-xl bg-muted p-4"><p className="text-sm font-medium">Customer help</p><p className="mt-1 text-sm text-muted-foreground">A floating contact button on the home page. It opens a WeChat chat with the sales team.</p></div>}
            {def.available === false && <div className="py-10 text-center"><DefIcon className="mx-auto mb-3 size-8 text-muted-foreground" /><p className="font-medium">{def.label}</p><p className="mt-1 text-sm text-muted-foreground">Coming later.</p><Badge variant="secondary" className="mt-3">Planned</Badge></div>}
          </div>
        </aside>
      </div>

      {/* 横幅 */}
      <FormDialog open={!!banner} onOpenChange={(o) => !o && setBanner(null)} title={banner?.isNew ? 'Add banner' : 'Edit banner'} description="A full image with its text, and where it opens."
        status={!banner?.draft.image ? 'Choose an image' : linkError(bannerLink) ?? undefined} confirmLabel="Done" confirmDisabled={!banner?.draft.image || !!linkError(bannerLink)}
        onConfirm={() => { if (!banner) return; const b = { ...banner.draft, linkUrl: serializeLink(bannerLink) };
          setState((s) => ({ ...s, banners: banner.isNew ? [...s.banners, b] : s.banners.map((x) => (x.id === b.id ? b : x)), layout: s.layout.includes('carousel') ? s.layout : ['carousel', ...s.layout] }));
          setSelected('carousel'); setBanner(null); }}>
        {banner && <>
          <FormSection title="Image" hint="Wide image, 2:1. Put the text and button inside it.">
            {banner.draft.image && <img src={banner.draft.image} alt="" className="mb-3 aspect-[2/1] w-full rounded-xl bg-muted object-cover" />}
            <div className="grid grid-cols-4 gap-2">
              {BANNER_IMAGES.map((src) => <button key={src} type="button" aria-pressed={banner.draft.image === src} onClick={() => setBanner({ ...banner, draft: { ...banner.draft, image: src } })}
                className={'overflow-hidden rounded-lg border-2 transition-colors ' + (banner.draft.image === src ? 'border-primary' : 'border-transparent hover:border-border')}><img src={src} alt="" className="aspect-[2/1] w-full bg-muted object-cover" /></button>)}
            </div>
            <label className="mt-2.5 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              <Plus className="size-4" />Upload an image
              <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setBanner((x) => (x ? { ...x, draft: { ...x.draft, image: String(r.result) } } : x)); r.readAsDataURL(f); }} />
            </label>
          </FormSection>
          <FormSection title="Opens"><LinkEditor link={bannerLink} setLink={setBannerLink} /></FormSection>
        </>}
      </FormDialog>

      {/* 顾客视角预览 */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent showCloseButton={false} className="flex max-h-[94vh] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-md">
          <header className="flex shrink-0 items-start justify-between border-b border-border px-6 pb-4 pt-5"><div><DialogTitle className="text-lg font-semibold">Storefront preview</DialogTitle><DialogDescription className="mt-1 text-sm text-muted-foreground">What a customer sees · current draft</DialogDescription></div>
            <DialogClose className="-mr-2 grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted" aria-label="Close"><X className="size-4" /></DialogClose></header>
          <div className="min-h-0 overflow-y-auto bg-[color-mix(in_srgb,var(--surface-sunken)_70%,var(--surface-raised))] py-5"><StorefrontPreview state={state} selected={selected} onSelect={() => undefined} interactive={false} height="min(600px, calc(94vh - 260px))" /></div>
        </DialogContent>
      </Dialog>

      {toast && <div role="status" className="rise-in fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-lg">{toast}</div>}
    </div>
  );
}
