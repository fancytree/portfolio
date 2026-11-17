/**
 * 店铺装修演示数据。照搬原 ERP 作品集页（miniprogram/storefrontDemoData）：
 * 模块库、默认首页、商品与品牌目录、快捷入口。图片和小程序运行时都在作品集站点的 /portfolio/ 下。
 */
import { Clock, Headphones, Images, LayoutGrid, Megaphone, Package, PanelBottom, Repeat, ShoppingBag, Tag, Ticket, Video, type LucideIcon } from 'lucide-react';

export type ContentModuleId = 'carousel' | 'announcement' | 'quick-links' | 'brands' | 'products' | 'service' | 'single-product' | 'limited-time' | 'frequent-products';
export type ModuleId = ContentModuleId | `products:${string}`;
export type LibraryModuleId = ContentModuleId | 'tab-bar' | 'video' | 'coupon';
export type SelectedModuleId = ModuleId | LibraryModuleId;
export type DragModuleId = ModuleId | 'products:new';
export type ProductGroupConfig = { title: string; columns: 1 | 2; productIndexes: number[] };
export type Banner = { id: string; image: string; active: boolean; linkUrl: string | null };
export type QuickLink = { id: string; name: string; iconUrl: string; linkUrl: string | null; isActive: boolean };
export type Brand = { id: string; name: string; logoUrl: string };
export type PromoStyle = 'grid' | 'scroll';
export type Storefront = {
  layout: ModuleId[]; banners: Banner[]; announcement: string; announcementLinkUrl: string | null;
  productTitle: string; columns: 1 | 2; homeProductIndexes?: number[]; productGroups?: Record<string, ProductGroupConfig>;
  quickLinks: QuickLink[]; brands: Brand[]; tabBarLabels: string[]; singleProductIndex: number; limitedStyle: PromoStyle; frequentStyle: PromoStyle;
};

export const ASSET = '/portfolio';
export const BRAND_CATALOG: Brand[] = [
  ['L’Oréal Professionnel', 'brand-0.svg'], ['Olaplex', 'brand-1.svg'], ['OPI', 'brand-2.svg'], ['Kérastase', 'brand-3.svg'],
  ['Redken', 'brand-4.svg'], ['Wella Professionals', 'brand-5.svg'], ['Fanola', 'brand-6.svg'],
].map(([name, file], i) => ({ id: `brand-${i}`, name, logoUrl: `${ASSET}/storefront-assets/${file}` }));

export const PRODUCTS = [
  { name: 'Absolut Repair', brand: 'L’Oréal Professionnel', image: `${ASSET}/products/absolut-repair.jpg`, price: '€ 12,90' },
  { name: 'Vitamino Color', brand: 'L’Oréal Professionnel', image: `${ASSET}/products/vitamino-color.webp`, price: '€ 11,50' },
  { name: 'N°7 Bonding Oil', brand: 'Olaplex', image: `${ASSET}/products/olaplex-n7.webp`, price: '€ 18,90' },
  { name: 'Pro Spa Cuticle Oil', brand: 'OPI', image: `${ASSET}/products/opi-cuticle-oil.webp`, price: '€ 9,80' },
  { name: 'Builder Gel Clear', brand: 'DEF Professional', image: `${ASSET}/catalog-products/builder-gel.jpg`, price: '€ 14,50' },
  { name: 'Gel Polish Red', brand: 'DEF Professional', image: `${ASSET}/catalog-products/gel-red.jpg`, price: '€ 8,90' },
  { name: 'Gel Polish Pink', brand: 'DEF Professional', image: `${ASSET}/catalog-products/pink-gel.webp`, price: '€ 8,90' },
  { name: 'Gel Polish White', brand: 'DEF Professional', image: `${ASSET}/catalog-products/gel-white.png`, price: '€ 8,90' },
  { name: 'Hydrating Face Cream', brand: 'DEF Skin', image: `${ASSET}/catalog-products/face-cream.jpg`, price: '€ 16,00' },
  { name: 'Wax Beads 1 kg', brand: 'DEF Wax', image: `${ASSET}/catalog-products/wax-beads.png`, price: '€ 19,90' },
  { name: 'Cotton Pads', brand: 'DEF Salon', image: `${ASSET}/catalog-products/cotton-pads.jpg`, price: '€ 3,20' },
  { name: 'Surface Disinfectant', brand: 'DEF Salon', image: `${ASSET}/catalog-products/disinfectant.jpg`, price: '€ 6,40' },
];
/** 首页默认展示的商品数；其余商品在模块设置里搜索添加 */
export const FEATURED_COUNT = 4;
/** 可选的横幅图：活动主图 + 商品图 */
export const BANNER_IMAGES = [`${ASSET}/storefront-assets/home-hero-complete.webp`, PRODUCTS[2].image, PRODUCTS[1].image, PRODUCTS[4].image];

export const MODULES: { id: LibraryModuleId; label: string; description: string; group: string; icon: LucideIcon; available?: boolean }[] = [
  { id: 'quick-links', label: 'Quick links', description: 'Category shortcuts', group: 'Navigation', icon: LayoutGrid },
  { id: 'tab-bar', label: 'Bottom navigation', description: 'Tabs and labels', group: 'Navigation', icon: PanelBottom },
  { id: 'carousel', label: 'Banner carousel', description: 'Campaign images', group: 'Content', icon: Images },
  { id: 'announcement', label: 'Announcement', description: 'One-line notice', group: 'Content', icon: Megaphone },
  { id: 'video', label: 'Video', description: 'Brand video', group: 'Content', icon: Video, available: false },
  { id: 'brands', label: 'Brand collection', description: 'Featured brands', group: 'Merchandising', icon: Tag },
  { id: 'products', label: 'Product collection', description: 'Hand-picked products', group: 'Merchandising', icon: ShoppingBag },
  { id: 'single-product', label: 'Single product', description: 'One hero product', group: 'Merchandising', icon: Package },
  { id: 'coupon', label: 'Coupons', description: 'Claimable coupons', group: 'Promotions', icon: Ticket, available: false },
  { id: 'limited-time', label: 'Marketing campaign', description: 'Campaign products', group: 'Promotions', icon: Clock },
  { id: 'frequent-products', label: 'Frequently purchased', description: 'From past orders', group: 'Retention', icon: Repeat },
  { id: 'service', label: 'Customer service', description: 'Contact entry', group: 'Support', icon: Headphones },
];
export const GROUPS = ['Navigation', 'Content', 'Merchandising', 'Promotions', 'Retention', 'Support'];

export const DEFAULT_QUICK_LINKS: QuickLink[] = ['nail', 'lash', 'wax', 'hair', 'beauty', 'furniture', 'sterilize', 'supplies'].map((key, i) => ({
  id: key, name: ['美甲产品', '美睫产品', '脱毛产品', '美发产品', '美容产品', '沙龙家具', '灭菌清洁', '日常耗材'][i],
  iconUrl: `/assets/images/home-cats/${key}.png`, linkUrl: `/pages/catalog/index?categoryId=${key}`, isActive: true,
}));
/** 小程序里用的是自己的相对路径；编辑器里显示图标要换成作品集站点的路径 */
export const iconSrc = (url: string) => url.replace('/assets/images/home-cats/', `${ASSET}/storefront-assets/home-cats/`);
export const TAB_DEFAULTS = [
  { key: 'home', pagePath: 'pages/home/index', label: '首页', iconUrl: 'builtin:home', activeIconUrl: 'builtin:home-active' },
  { key: 'catalog', pagePath: 'pages/catalog/index', label: '分类', iconUrl: 'builtin:catalog', activeIconUrl: 'builtin:catalog-active' },
  { key: 'cart', pagePath: 'pages/cart/index', label: '购物车', iconUrl: 'builtin:cart', activeIconUrl: 'builtin:cart-active' },
  { key: 'account', pagePath: 'pages/account/index', label: '我的', iconUrl: 'builtin:account', activeIconUrl: 'builtin:account-active' },
];

export const INITIAL: Storefront = {
  layout: ['carousel', 'announcement', 'quick-links', 'brands', 'products', 'service'],
  banners: [{ id: 'banner-0', image: BANNER_IMAGES[0], active: true, linkUrl: null }],
  announcement: 'Free shipping in Italy on orders over €150', announcementLinkUrl: null,
  productTitle: 'Salon essentials', columns: 2,
  quickLinks: DEFAULT_QUICK_LINKS, brands: BRAND_CATALOG.slice(0, 3), tabBarLabels: TAB_DEFAULTS.map((t) => t.label),
  singleProductIndex: 0, limitedStyle: 'grid', frequentStyle: 'grid',
};

export const moduleDefinitionId = (id: SelectedModuleId): LibraryModuleId => (id.startsWith('products:') ? 'products' : id as LibraryModuleId);
export const isContentModule = (id: string): id is ModuleId =>
  /^products:/.test(id) || MODULES.some((m) => m.id === id && m.available !== false && m.id !== 'tab-bar');

/* ───────── 跳转链接（横幅、公告、快捷入口共用）───────── */
export type LinkType = 'none' | 'single-product' | 'category' | 'tag' | 'external';
export type LinkDraft = { type: LinkType; productId: string; categoryId: string; tag: string; url: string };
export const PRODUCT_TAGS = ['New arrivals', 'Bestsellers', 'Special offers', 'Salon essentials', 'Near expiry'];
export const LINK_TYPES: { value: LinkType; label: string }[] = [
  { value: 'none', label: 'No link' }, { value: 'single-product', label: 'Single product' }, { value: 'category', label: 'Product category' },
  { value: 'tag', label: 'Product tag' }, { value: 'external', label: 'HTTPS link' },
];
export function parseLink(url: string | null): LinkDraft {
  const d: LinkDraft = { type: 'none', productId: '', categoryId: '', tag: '', url: '' };
  if (!url) return d;
  if (/^https:\/\//i.test(url)) return { ...d, type: 'external', url };
  const q = new URLSearchParams(url.split('?')[1] ?? '');
  if (url.startsWith('/pages/product-detail/')) return { ...d, type: 'single-product', productId: q.get('id') ?? '' };
  if (q.get('categoryId')) return { ...d, type: 'category', categoryId: q.get('categoryId')! };
  if (q.get('tag')) return { ...d, type: 'tag', tag: q.get('tag')! };
  return d;
}
export function serializeLink(d: LinkDraft): string | null {
  if (d.type === 'single-product') return d.productId ? `/pages/product-detail/index?id=${d.productId}` : null;
  if (d.type === 'category') return d.categoryId ? `/pages/catalog/index?categoryId=${d.categoryId}` : null;
  if (d.type === 'tag') return d.tag ? `/pages/catalog/index?tag=${encodeURIComponent(d.tag)}` : null;
  if (d.type === 'external') return d.url.trim() || null;
  return null;
}
export function linkError(d: LinkDraft): string | null {
  if (d.type === 'single-product' && !d.productId) return 'Choose a product.';
  if (d.type === 'category' && !d.categoryId) return 'Choose a category.';
  if (d.type === 'tag' && !d.tag) return 'Choose a product tag.';
  if (d.type === 'external') { try { if (new URL(d.url.trim()).protocol !== 'https:') return 'External links must use HTTPS.'; } catch { return 'Enter a complete HTTPS URL.'; } }
  return null;
}
export function linkSummary(url: string | null): string {
  const d = parseLink(url);
  if (d.type === 'category') return DEFAULT_QUICK_LINKS.find((q) => q.id === d.categoryId)?.name ?? 'Product category';
  if (d.type === 'single-product') return PRODUCTS[Number(d.productId.replace('demo-product-', ''))]?.name ?? 'Single product';
  if (d.type === 'tag') return `Tag · ${d.tag}`;
  if (d.type === 'external') { try { return new URL(d.url).hostname; } catch { return 'HTTPS link'; } }
  return 'No link';
}
