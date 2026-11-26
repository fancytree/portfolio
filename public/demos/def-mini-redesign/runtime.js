
const errors=[];window.__errors=errors;
const origErr=console.error;console.error=(...a)=>{errors.push(String(a[0]).slice(0,200));origErr(...a)};

const camel=s=>s.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
function get(path,sc){if(path==='true')return true;if(path==='false')return false;const k=path.split('.');let o=sc[k[0]];for(const x of k.slice(1))o=o==null?o:o[x];return o}
function val(s,sc){const m=s.match(/^\{\{\s*([\w.]+)\s*\}\}$/);if(m)return get(m[1],sc);return s.replace(/\{\{\s*([\w.]+)\s*\}\}/g,(_,p)=>{const v=get(p,sc);return v==null?'':v})}
function css2obj(s){const o={};s.split(/;(?![^(]*\))(?![^"]*"[^"]*\))/).forEach(d=>{const i=d.indexOf(':');if(i<0)return;let k=d.slice(0,i).trim(),v=d.slice(i+1).trim();let imp=false;if(/!important$/.test(v)){v=v.replace(/\s*!important$/,'')}o[k.startsWith('--')?k:camel(k)]=v});return o}
const ATTR={class:'className',for:'htmlFor',onclick:'onClick',onchange:'onChange',onscroll:'onScroll','stroke-width':'strokeWidth','stroke-linecap':'strokeLinecap','stroke-linejoin':'strokeLinejoin',viewbox:'viewBox',checked:'defaultChecked',value:'defaultValue'};
function node(n,sc,key){
 if(n.nodeType===3){const t=n.textContent;if(!t.trim()&&t.includes('\n'))return null;return String(val(t,sc))}
 if(n.nodeType!==1)return null;const tag=n.localName;
 if(tag==='helmet')return React.createElement(React.Fragment,{key},...Array.from(n.querySelectorAll('style')).map((st,i)=>React.createElement('style',{key:i},st.textContent.replace(/body\{[^}]*\}|a(:hover)?\{[^}]*\}/g,''))));
 const kids=sc2=>Array.from(n.childNodes).map((c,i)=>node(c,sc2||sc,i)).filter(x=>x!=null&&x!=='');
 if(tag==='sc-if')return val(n.getAttribute('value'),sc)?React.createElement(React.Fragment,{key},...kids()):null;
 if(tag==='sc-for'){const list=val(n.getAttribute('list'),sc)||[],as=n.getAttribute('as');return React.createElement(React.Fragment,{key},list.map((it,j)=>React.createElement(React.Fragment,{key:j},...kids({...sc,[as]:it}))))}
 if(tag==='x-import'){const name=n.getAttribute('component-from-global-scope').split('.')[1];const props={};let style={display:'contents'};
  for(const a of n.attributes){if(a.name==='component-from-global-scope')continue;if(a.name==='style'){style=css2obj(val(a.value,sc));continue}if(a.name.startsWith('hint'))continue;props[camel(a.name)]=val(a.value,sc)}
  const c=kids();if(c.length)props.children=c.join('').trim();
  const C=BeautySupply[name];if(!C){errors.push('missing component '+name);return null}
  return React.createElement('div',{key,style,'data-x':name},React.createElement(C,props))}
 const p={key};for(const a of n.attributes){let k=ATTR[a.name]||a.name,v=val(a.value,sc);if(k==='style')v=css2obj(String(v));if(a.name==='checked'||a.name==='disabled')v=true;if(a.name.startsWith('hint'))continue;if(a.name==='value'&&tag==='input'){k='defaultValue'}p[k]=v}
 if(['input','br','img'].includes(tag))return React.createElement(tag,p);
 return React.createElement(tag,p,...kids());
}
const euro = (v) => '€' + v.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const SEED = () => ({
  bag: [{ ...P.cream, qty: 24 }, { ...P.shampoo, qty: 12 }],
  saved: [
    { id: 'serum:0', brand: 'AUREL', name: 'Dew Serum', meta: '30 ml', price: '€38', image: P.serum.image, add: 'PhotoProductSheet.dc.html' },
    { id: 'gel:8', brand: 'SOLA', name: 'Gel Colour', meta: '09 Milk White · 15 ml', price: '€7.90', image: 'img/eb9553d71e29259b951aee83ef006de9.jpg' },
    { id: 'care:1', brand: 'AUREL', name: 'Repair Shampoo', meta: '500 ml', price: '€14.50', image: P.shampoo.image, add: 'PhotoSkuCare.dc.html' }
  ],
  balance: 120, order: { total: 410.65, used: 120, rest: 290.65 }, status: 'review'
});
const STORE = Object.assign(SEED(), {
  count() { return this.bag.reduce((n, x) => n + x.qty, 0); },
  sum() { return this.bag.reduce((n, x) => n + x.qty * x.price, 0); },
  add(item, qty) { const hit = this.bag.find((x) => x.id === item.id); if (hit) hit.qty += qty; else this.bag.push({ ...item, qty }); setTimeout(redraw, 0); },
  keys(prefix) { const out = {}; this.saved.forEach((x) => { const [p, k] = x.id.split(':'); if (p === prefix) out[k] = true; }); return out; },
  toggle(prefix, key, entry) { const id = prefix + ':' + key; if (this.saved.some((x) => x.id === id)) this.saved = this.saved.filter((x) => x.id !== id); else this.saved = [{ id, ...entry }, ...this.saved]; }
});
Object.assign(window, { STORE, euro });

const SHEETS = /Sheet$|^PhotoSku|^PhotoSave[A-Z]|^UIFilters$/;
const ALIAS = { Main: 'PhotoMain', UIList: 'PhotoList', UIBag: 'PhotoBag', UIAccount: 'PhotoAccount', UIProduct: 'PhotoProduct', UISearch: 'PhotoSearch', UIVariants: 'PhotoShadeSheet', UIProductSheet: 'PhotoProductSheet', UIQuote: 'PhotoQuote', UISaved: 'PhotoSaved' };
const INFO = {
  PhotoMain: ['Home', 'Swipe the banner, switch category chips, or tap + on a product and watch it land in the bag.'],
  PhotoList: ['Product list', 'Open a product, or tap the heart on the shampoo to save one size.'],
  PhotoProduct: ['Product page', 'One scroll, no inner pages. Add to Bag opens the options.'],
  PhotoProductShade: ['Shade product', 'Shades are for looking here. Choose one after Add to Bag.'],
  PhotoProductSheet: ['Choose size and pack', 'Change size, packaging and quantity, then add.'],
  PhotoShadeSheet: ['Choose a shade', 'Twenty shades. No packaging step for nail polish.'],
  PhotoSkuCare: ['Capacity and pack', 'Capacity as text, pack sizes as conversion units.'],
  PhotoSkuGlove: ['Colour, size and pack', 'The same sheet with three attributes.'],
  PhotoSkuTool: ['Model and pack', 'Models shown as images.'],
  PhotoSaveSerum: ['Save a size', 'Saving keeps one SKU. No packaging, no quantity.'],
  PhotoSaveShade: ['Save shades', 'Save several in a row. Saved ones carry a heart.'],
  PhotoSaveCare: ['Save a capacity', 'Sold-out sizes can be saved too.'],
  PhotoSaveGlove: ['Save colour and size', 'One combination is one saved item.'],
  PhotoSaved: ['Saved', 'Your saved SKUs. Try Buy again.'],
  PhotoBag: ['Bag', 'Change quantities, then check out.'],
  PhotoQuote: ['Quote list', 'Bulky equipment is priced by delivery country.'],
  PhotoApproval: ['Approval', 'Staff orders can wait for an owner.'],
  PhotoAccount: ['Account', 'The money summary follows the customer’s situation.'],
  PhotoSearch: ['Search', 'Search by name, brand or SKU.'],
  UICheckout: ['Checkout', 'Use the balance, pick shipping, place the order.'],
  UIPayment: ['Payment', 'Upload a receipt within 30 minutes, then submit.'],
  UIPaymentStatus: ['Payment status', 'Use the demo control to play the finance team.'],
  UIFilters: ['Filters', 'Filter sheet.']
};
const JUMP = ['PhotoMain', 'PhotoProduct', 'PhotoProductShade', 'PhotoSaved', 'PhotoBag', 'UICheckout', 'PhotoAccount'];

const hosts = { base: { el: document.getElementById('base') }, over: { el: document.getElementById('over') } };
function unmount(layer) { const h = hosts[layer]; if (h.root) { h.root.unmount(); h.root = null; } h.el.innerHTML = ''; h.name = null; h.draw = null; }
function mount(layer, name) {
  unmount(layer);
  const h = hosts[layer], node0 = document.createElement('div'); h.el.appendChild(node0);
  const doc = new DOMParser().parseFromString(SCREENS[name].html, 'text/html'), tree = doc.querySelector('x-dc');
  h.root = ReactDOM.createRoot(node0); h.name = name;
  let inst;
  class DCLogic { constructor() { this.props = {}; this.state = this.state || {}; } setState(s) { this.state = { ...this.state, ...s }; draw(); } }
  const C = new Function('DCLogic', SCREENS[name].js + ';return Component')(DCLogic);
  inst = new C(); inst.props = {};
  function draw() { const v = inst.renderVals(); ReactDOM.flushSync(() => h.root.render(React.createElement(React.Fragment, null, ...Array.from(tree.childNodes).map((c, i) => node(c, v, i))))); }
  h.draw = draw; draw();
}
function redraw() { ['base', 'over'].forEach((l) => hosts[l].draw && hosts[l].draw()); }
function show(name) {
  if (SHEETS.test(name)) { if (!hosts.base.name) mount('base', 'PhotoMain'); mount('over', name); }
  else { unmount('over'); mount('base', name); }
  const info = INFO[name] || [name, ''];
  document.getElementById('title').textContent = info[0]; document.getElementById('tip').textContent = info[1];
  document.querySelectorAll('#jump button').forEach((b) => b.setAttribute('aria-current', String(b.dataset.to === name)));
  document.getElementById('phone').dataset.screen = name;
}
// board links drive the prototype; anything without a screen stays put
function follow(e, a) {
  e.preventDefault();
  const m = (a.getAttribute('href') || '').match(/^([\w-]+)\.dc\.html$/);
  if (!m) return;
  const name = SCREENS[m[1]] ? m[1] : ALIAS[m[1]];
  if (name) show(name);
}
// hearts stop the click from bubbling, so catch their links on the way down
document.addEventListener('click', (e) => { const a = e.target.closest && e.target.closest('a.bs-act[href]'); if (a) { e.stopPropagation(); follow(e, a); } }, true);
document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('a[href]');
  // a prevented click is one the component will repeat itself once the item has landed
  if (a && !e.defaultPrevented) follow(e, a);
});
JUMP.forEach((n) => { const b = document.createElement('button'); b.type = 'button'; b.dataset.to = n; b.textContent = INFO[n][0]; b.onclick = () => show(n); document.getElementById('jump').appendChild(b); });
document.getElementById('reset').onclick = () => { Object.assign(STORE, SEED()); unmount('base'); show('PhotoMain'); };
function fit() { const s = document.querySelector('.stage'); document.getElementById('phone').style.setProperty('--fit', String(Math.min(1, (s.clientHeight - 40) / 860, (s.clientWidth - 32) / 406))); }
window.addEventListener('resize', fit); fit();
const start = new URLSearchParams(location.search).get('start');
show(SCREENS[start] ? start : 'PhotoMain');
document.body.setAttribute('data-ready', '');
