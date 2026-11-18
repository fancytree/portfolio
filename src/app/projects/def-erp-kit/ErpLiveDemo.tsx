'use client';

import { type Helpers } from './LiveDemo';
import LiveShowcase, { type ShowcaseItem } from './LiveShowcase';


/**
 * The demo shows the workspace, not the navigation: collapse the app sidebar, remove its toggle,
 * and remove the open-pages tab strip that sits directly above the main area on every page.
 */
/** Written before each frame loads, so the ERP opens with its sidebar already collapsed. */
const COLLAPSED = { 'portfolio-demo:def.sidebar.collapsed': '1' };

function collapseSidebar(doc: Document) {
  doc.querySelector<HTMLElement>('button[aria-label="Collapse sidebar"]')?.click();
  const style = doc.createElement('style');
  style.textContent = [
    'button[aria-label="Collapse sidebar"],button[aria-label="Expand sidebar"]{display:none!important}',
    ':has(> main) > :not(main):not(aside):has(+ main){display:none!important}',
  ].join('');
  doc.head.appendChild(style);
}

/** The redesigned pages (new design language) from the design-system build. */
const NEW_SALES = '/demos/def-design-system/index.html?view=product-sales';
const NEW_ORDER = '/demos/def-design-system/index.html?view=order';
const pickLabel = (h: Helpers, text: string) => h.all('.menu-pop label').find((l) => l.textContent?.includes(text))?.querySelector<HTMLElement>('button[role="checkbox"]');

const items: ShowcaseItem[] = [
  {
    title: 'Select products', lead: 'One search, two ways to add.', seconds: 20, src: NEW_SALES, ready: 'table input', fresh: true,
    body: 'Broad search groups shades; an exact match adds the SKU.',
    script: async (h) => {
      h.say('“lacquer”: grouped by product');
      const search = h.find('input[aria-label="Find a product"]');
      await h.click(search);
      await h.type(search, 'lacquer');
      await h.zoom(search, 1.5);
      await h.wait(1100);
      h.say('Add several shades');
      const a = pickLabel(h, 'Bubble Bath'); if (a) await h.click(a);
      const b = pickLabel(h, 'Big Apple Red'); if (b) await h.click(b);
      await h.click(h.find('.menu-pop button', 'Add'));
      await h.wait(900);
      h.say('“builder”: one match, one click');
      await h.type(search, 'builder');
      await h.wait(1100);
      await h.click(h.all('.menu-pop button')[0]);
      await h.wait(800);
      h.say('Packaging sets the price');
      await h.zoomOut();
      await h.click(h.find('button[title^="1 Box"]'));
      await h.wait(900);
      await h.click(h.all('[data-slot="popover-content"] tbody tr')[0]);
      await h.wait(700);
      h.say('Totals update in place');
      const up = h.find('button[aria-label^="Increase quantity for Vitamino"]');
      await h.zoom(up, 1.8);
      await h.click(up);
      await h.click(up);
      h.say('Mark a gift');
      await h.click(h.all('button[aria-pressed]').filter((x) => x.textContent?.trim() === 'Gift')[2]);
      await h.wait(900);
    },
  },
  {
    title: 'Place the order', lead: 'Payment and pickup in one step.', seconds: 18, src: NEW_SALES, ready: 'table input', fresh: true,
    body: 'Payment and pickup are asked once, at save.',
    script: async (h) => {
      h.say('Saving needs a salesperson');
      await h.click(h.find('button', 'Save'));
      await h.wait(1100);
      await h.click(h.all('[role="combobox"]').find((c) => c.textContent?.includes('Salesperson'))!);
      await h.wait(500);
      await h.pick(h.find('[role="option"]'));
      await h.click(h.find('button', 'Save'));
      await h.wait(900);
      h.say('Paid? Split it if needed');
      const dlg = '[role="dialog"][data-state="open"]';
      await h.zoom(h.find(`${dlg} section`), 1.4);
      await h.click(h.find(`${dlg} button`, 'Split payment'));
      await h.wait(1200);
      h.say('Taken with them?');
      await h.zoomOut();
      await h.click(h.all(`${dlg} section`)[1].querySelector<HTMLElement>('button[role="switch"]')!);
      await h.wait(1300);
      h.say('Add a note');
      const note = h.find(`${dlg} textarea`);
      await h.click(note);
      await h.type(note, 'Rest by courier on Friday');
      await h.wait(1300);
    },
  },
  {
    title: 'Manage the order', lead: 'One record for every role.', seconds: 12, src: NEW_ORDER, ready: 'h1', fresh: true,
    body: 'Shipping and payment tracked apart.',
    script: async (h) => {
      const leaf = (t: string) => h.all('span, div, p').find((e) => e.childElementCount === 0 && e.textContent?.trim() === t)!;
      h.say('Shipping and payment apart');
      await h.zoom(leaf('Partially shipped'), 1.8);
      await h.hover(leaf('Partially shipped'));
      await h.hover(leaf('Paid'));
      h.say('34 of 39 shipped');
      await h.hover(leaf('Shipping progress'));
      h.say('Every delivery listed');
      await h.zoomOut();
      await h.click(h.find('[role="tab"]', 'Deliveries'));
      await h.wait(1200);
      h.say('What is still waiting');
      await h.hover(h.find('p', 'Not shipped yet'));
      await h.hover(h.all('article')[0]);
      await h.hover(h.all('article')[1]);
      h.say('Customer and payment beside it');
      await h.hover(leaf('Customer'));
      await h.hover(leaf('Order info'));
      await h.wait(800);
    },
  },
  {
    title: 'Arrange a delivery', lead: 'Pickup or courier.', seconds: 20, src: NEW_ORDER, ready: 'h1', fresh: true,
    body: 'Each method asks only what it needs.',
    script: async (h) => {
      const dlg = '[role="dialog"][data-state="open"]';
      await h.click(h.find('[role="tab"]', 'Deliveries'));
      await h.click(h.find('button', 'New delivery'));
      await h.wait(900);
      h.say('Only what is left to ship');
      await h.zoom(h.find(`${dlg} table`), 1.4);
      await h.wait(900);
      h.say('Pickup: day, then slot');
      await h.zoomOut();
      await h.click(h.find('#delivery-pickup-time'));
      await h.wait(400);
      await h.hover(h.find('[aria-label="Pickup date"] [role="option"]', '19/11/2026'));
      await h.click(h.find('[aria-label="Pickup date"] [role="option"]', '19/11/2026'));
      await h.wait(300);
      await h.click(h.find('[aria-label="Pickup time slot"] [role="option"]', '10:00'));
      await h.wait(700);
      h.say('Courier: parcels set the fee');
      await h.click(h.find(`${dlg} [aria-label="Delivery method"] button`, 'Courier'));
      await h.click(h.find(`${dlg} button`, 'Add parcel'));
      await h.zoom(h.find('#package-0-weight'), 1.6);
      await h.click(h.find('#package-0-weight'));
      await h.type(h.find('#package-0-weight'), '6.6');
      await h.type(h.find('#package-0-length'), '40');
      await h.type(h.find('#package-0-width'), '30');
      await h.type(h.find('#package-0-height'), '25');
      await h.wait(700);
      await h.zoomOut();
      await h.hover(h.find(`${dlg} [data-suggested]`));
      await h.wait(1600);
    },
  },
];

export function SalesOrderLiveDemo() {
  return (
    <LiveShowcase
      items={items}
      src={NEW_SALES}
      label="product sales"
      title="DEF ERP — live sales order workflow, demonstration data"
      baseWidth={1440}
      ready="table input"
      prepare={collapseSidebar}
      storage={COLLAPSED}
    />
  );
}

const NEW_PO = '/demos/def-design-system/index.html?view=po';
const NEW_INBOUND = `${NEW_PO}&stage=inbound`;

/** The redesigned demo: collapse its sidebar so the order table gets the full width. */
function collapseNewSidebar(doc: Document) {
  doc.querySelector<HTMLElement>('aside button[title="Collapse sidebar"]')?.click();
  const style = doc.createElement('style');
  style.textContent = 'aside button[title="Collapse sidebar"],aside button[title="Expand sidebar"]{display:none!important}';
  doc.head.appendChild(style);
}

const purchasing: ShowcaseItem[] = [
  {
    title: 'Draft the order', lead: 'Edit lines in place.', seconds: 21, src: NEW_PO, ready: 'tbody button[aria-expanded]', fresh: true,
    body: 'Stock and sales beside each line.',
    script: async (h) => {
      h.say('Sales guide quantities');
      await h.click(h.find('button[role="combobox"]'));
      await h.wait(400);
      await h.pick(h.find('[role="option"]', 'Sales · last 6 mo'));
      await h.wait(900);
      h.say('Edit quantity and price');
      await h.click(h.find('tbody button[aria-expanded]', 'Reinforced bonder'));
      await h.wait(500);
      const inputs = h.all('tbody input');
      await h.zoom(inputs[0], 1.8);
      await h.click(inputs[0]);
      await h.type(inputs[0], '120');
      await h.click(inputs[2]);
      await h.type(inputs[2], '5.2');
      await h.wait(800);
      h.say('Add from the library');
      await h.zoomOut();
      await h.click(h.find('button', 'Add product'));
      await h.wait(700);
      const search = h.find('input[aria-label="Search product library"]');
      await h.click(search);
      await h.type(search, 'gel');
      await h.wait(700);
      await h.click(h.find('[aria-label="Select Builder gel Clear 15 ml"]'));
      await h.click(h.find('[aria-label="Select Builder gel Pink 15 ml"]'));
      await h.click(h.find('[role="dialog"] button', 'Add selected (2)'));
      await h.wait(900);
      await h.hover(h.find('tbody span', 'Clear 15 ml'));
      await h.wait(900);
    },
  },
  {
    title: 'Add a new product', lead: 'Not in the library yet.', seconds: 18, src: NEW_PO, ready: 'tbody button[aria-expanded]', fresh: true,
    body: 'A manual line now, its SKU later.',
    script: async (h) => {
      h.say('Not in the library yet');
      await h.click(h.find('button', 'Add product'));
      await h.wait(600);
      await h.click(h.find('[role="dialog"] button', 'New product'));
      await h.click(h.find('#new-product-description'));
      await h.type(h.find('#new-product-description'), 'MNP repair serum 30 ml');
      await h.type(h.find('#new-product-qty'), '24');
      await h.type(h.find('#new-product-cost'), '8.5');
      await h.click(h.find('[role="dialog"] button', 'Add new product'));
      await h.wait(800);
      await h.zoom(h.find('tbody span', 'New product · no SKU yet'), 1.8);
      await h.hover(h.find('tbody span', 'New product · no SKU yet'));
      h.say('Create its SKU here');
      await h.zoomOut();
      await h.click(h.find('tbody button', 'Create SKU'));
      await h.wait(800);
      await h.click(h.find('#quick-sku-price'));
      await h.type(h.find('#quick-sku-price'), '16.9');
      await h.click(h.find('[role="dialog"] button', 'Create and match'));
      await h.wait(800);
      await h.hover(h.find('tbody span', 'New SKU created'));
      await h.wait(900);
    },
  },
  {
    title: 'Confirm with the supplier', lead: 'Differences on each line.', seconds: 24, src: NEW_PO, ready: 'tbody button[aria-expanded]', fresh: true,
    body: 'The PDF is read; differences are marked.',
    script: async (h) => {
      h.say('Draft, grouped by product');
      await h.click(h.find('tbody button[aria-expanded]', 'Reinforced bonder'));
      await h.wait(700);
      h.say('Upload the confirmation');
      await h.click(h.find('button', 'Upload confirmation'));
      await h.wait(700);
      await h.hover(h.find('[role="dialog"] p', 'Drop the supplier PDF'));
      await h.upload(h.find('[role="dialog"] input[type="file"]'), 'Conferma-ordine-MNP.pdf');
      await h.wait(3000);
      h.say('Differences marked per line');
      await h.zoom(h.find('tbody span', 'Qty 96→90'), 1.7);
      await h.hover(h.find('tbody span', 'Qty 96→90'));
      await h.hover(h.find('tbody span', 'Supplier-added SKU'));
      h.say('New product: create it here');
      await h.zoomOut();
      await h.click(h.find('tbody button', 'Create SKU'));
      await h.wait(700);
      await h.click(h.find('#quick-sku-price'));
      await h.type(h.find('#quick-sku-price'), '12.9');
      await h.click(h.find('[role="dialog"] button', 'Create and match'));
      await h.wait(800);
      await h.hover(h.find('tbody span', 'New SKU created'));
      h.say('Total shows the change');
      await h.zoom(h.find('span', '€178.80 lower'), 1.7);
      await h.hover(h.find('span', '€178.80 lower'));
      await h.hover(h.find('button', 'Mark as ordered'));
      await h.wait(900);
    },
  },
  {
    title: 'Receive the goods', lead: 'Delivery note against confirmation.', seconds: 13, src: NEW_INBOUND, ready: 'tbody button[aria-expanded]', fresh: true,
    body: 'Delivery note checked against the order.',
    script: async (h) => {
      h.say('Upload the delivery note');
      await h.click(h.find('button', 'Upload DDT'));
      await h.wait(700);
      await h.hover(h.find('[role="dialog"] p', 'Drop the DDT'));
      await h.upload(h.find('[role="dialog"] input[type="file"]'), 'DDT-MNP-0113.pdf');
      await h.wait(3000);
      h.say('Short, matching, over');
      await h.zoom(h.find('tbody p', 'Short vs confirmation'), 1.7);
      await h.hover(h.find('tbody p', 'Short vs confirmation'));
      await h.hover(h.find('tbody p', 'Matches confirmation'));
      await h.hover(h.find('tbody p', 'More than confirmed'));
      h.say('Correct the count');
      const actual = h.all('tbody input').find((i) => !(i as HTMLInputElement).disabled)!;
      await h.click(actual);
      await h.type(actual, '58');
      await h.wait(1200);
    },
  },
  {
    title: 'Decide line by line', lead: 'Return, gift or stock in.', seconds: 13, src: `${NEW_INBOUND}&state=ddt`, ready: 'tbody button[aria-expanded]', fresh: true,
    body: 'Unconfirmed goods: return, gift or stock.',
    script: async (h) => {
      h.say('Arrived, but never confirmed');
      await h.zoom(h.find('tbody p', 'Not on confirmation'), 1.8);
      await h.hover(h.find('tbody p', 'Not on confirmation'));
      h.say('Three ways to handle it');
      await h.click(h.find('tbody button', 'Return'));
      await h.wait(800);
      await h.click(h.find('tbody button', 'Stock in'));
      await h.wait(800);
      await h.click(h.find('tbody button', 'Gift'));
      await h.wait(700);
      await h.hover(h.find('tbody p', 'Gift · not stocked'));
      h.say('Ready to receive');
      await h.zoomOut();
      await h.click(h.find('button', 'Confirm receipt'));
      await h.wait(700);
      h.say('Who received it');
      await h.click(h.find('[role="dialog"] [role="combobox"]'));
      await h.wait(400);
      await h.pick(h.find('[role="option"]', 'Elena Rossi'));
      await h.click(h.find('[role="dialog"] button', 'Confirm receipt'));
      await h.wait(900);
      await h.hover(h.find('p', 'PO receipt progress'));
      await h.wait(900);
    },
  },
  {
    title: 'Close what is still open', lead: 'Wait, delay, close or return.', seconds: 17, src: `${NEW_INBOUND}&state=received`, ready: 'tbody button[aria-expanded]', fresh: true,
    body: 'Wait, delay, close or return the rest.',
    script: async (h) => {
      h.say('Some lines didn\'t arrive');
      await h.zoom(h.find('tbody p', 'Not on DDT'), 1.8);
      await h.hover(h.find('tbody p', 'Not on DDT'));
      h.say('Decide what happens');
      await h.zoomOut();
      await h.click(h.find('button', 'Handle remaining goods'));
      await h.wait(800);
      await h.click(h.find('[role="dialog"] [role="radio"]', 'Wait for next batch'));
      await h.wait(500);
      await h.click(h.find('#remaining-follow-up-date'));
      await h.fill(h.find('#remaining-follow-up-date'), '2026-09-04');
      await h.click(h.find('#remaining-decision-note'));
      await h.type(h.find('#remaining-decision-note'), 'Matte top coat ships next week');
      await h.click(h.find('[role="dialog"] button', 'Save'));
      await h.wait(900);
      h.say('Decision on the order');
      await h.zoom(h.find('[data-remaining-decision] p'), 1.7);
      await h.hover(h.find('[data-remaining-decision] p'));
      await h.hover(h.find('tbody p', 'Next batch'));
      await h.wait(900);
    },
  },
];

export function PurchasingLiveDemo() {
  return (
    <LiveShowcase
      items={purchasing}
      src={NEW_PO}
      label="purchasing"
      title="DEF ERP — live purchasing and receiving, demonstration data"
      baseWidth={1440}
      ready="tbody button[aria-expanded]"
      prepare={collapseNewSidebar}
    />
  );
}

const INVOICES = '/demos/def-design-system/index.html?view=invoices';
const COMPOSE = `${INVOICES}&compose=1`;
const DLG = '[role="dialog"]';

const invoicing: ShowcaseItem[] = [
  {
    title: 'See what to invoice', lead: 'Paid orders, waiting for an invoice.', seconds: 18, src: INVOICES, ready: 'tbody tr', fresh: true,
    body: 'Start from orders, not a blank invoice.',
    script: async (h) => {
      h.say('What\'s waiting');
      await h.zoom(h.find('p', 'Orders to invoice'), 1.6);
      await h.hover(h.find('p', 'Orders to invoice'));
      await h.hover(h.find('p', 'Total to invoice'));
      h.say('One tab per stage');
      await h.zoomOut();
      await h.click(h.find('[role="tab"]', 'No number'));
      await h.wait(700);
      await h.click(h.find('[role="tab"]', 'Invoiced'));
      await h.wait(700);
      await h.click(h.find('[role="tab"]', 'To invoice'));
      await h.wait(600);
      await h.hover(h.find('tbody td', 'OUT-2026-001248'));
      h.say('Start with the customer');
      await h.click(h.find('button', 'New invoice'));
      await h.wait(900);
      await h.hover(h.find(`${DLG} p`, 'Select a customer first'));
      const customer = h.find('#invoice-customer');
      await h.click(customer);
      await h.type(customer, 'Luce');
      await h.wait(900);
      await h.click(h.all(`${DLG} button`).find((b) => b.textContent?.includes('Luce Beauty Lab'))!);
      await h.wait(1300);
    },
  },
  {
    title: 'Combine orders', lead: 'Several orders, one invoice.', seconds: 15, src: COMPOSE, ready: '#invoice-total', fresh: true,
    body: 'Lines, prices and tax come pre-filled.',
    script: async (h) => {
      h.say('Orders already loaded');
      await h.hover(h.find(`${DLG} span`, 'OUT-2026-001248'));
      h.say('Paid orders only');
      await h.click(h.find(`${DLG} [role="tab"]`, 'Paid'));
      await h.wait(800);
      h.say('Gifts left out');
      await h.zoom(h.find(`${DLG} span`, 'Remainder after'), 1.6);
      await h.hover(h.find(`${DLG} span`, 'Remainder after'));
      await h.hover(h.find(`${DLG} td`, 'Gift'));
      h.say('Enter the amount paid');
      const total = h.find('#invoice-total');
      await h.click(total);
      await h.fill(total, '1200');
      await h.commit(total);
      await h.wait(900);
      await h.hover(h.find(`${DLG} p`, 'Item total differs'));
      h.say('Adjust one line');
      const amount = h.all(`${DLG} input[aria-label="Invoice amount"]`)[0];
      await h.click(amount);
      await h.fill(amount, '249');
      await h.commit(amount);
      await h.wait(900);
      await h.hover(h.find('#invoice-total'));
      await h.wait(700);
    },
  },
  {
    title: 'Preview and issue', lead: 'As the tax office reads it.', seconds: 16, src: COMPOSE, ready: '#invoice-total',
    body: 'Italian format, checked once, then issued.',
    script: async (h) => {
      const back = h.all(`${DLG} button`).find((b) => b.textContent?.trim() === 'Back to edit');
      if (!back) {
        h.say('Who prepared it');
        await h.click(h.all(`${DLG} [role="combobox"]`).find((c) => c.textContent?.includes('Select operator'))!);
        await h.wait(500);
        await h.pick(h.find('[role="option"]'));
        await h.click(h.find(`${DLG} button`, 'Preview invoice'));
        await h.wait(1300);
      }
      h.say('Who, and how paid');
      await h.zoom(h.find(`${DLG} p`, 'Cedente/prestatore'), 1.6);
      await h.hover(h.find(`${DLG} p`, 'Cedente/prestatore'));
      await h.hover(h.find(`${DLG} div`, 'Modalità di pagamento'));
      h.say('Tax per line');
      await h.hover(h.find(`${DLG} td`, 'Shampoo Vitamino Color'));
      await h.hover(h.find(`${DLG} button`, 'Issue invoice'));
      await h.wait(1200);
    },
  },
];

export function InvoicingLiveDemo() {
  return (
    <LiveShowcase
      items={invoicing}
      src={INVOICES}
      label="invoices"
      title="DEF ERP — live invoicing, demonstration data"
      baseWidth={1440}
      ready="tbody tr"
      prepare={collapseNewSidebar}
    />
  );
}

const BUILDER = '/demos/def-design-system/index.html?view=storefront';
const ACCOUNTS = '/demos/def-design-system/index.html?view=store-accounts';
const LIB = '[aria-label="Module library"]';
const SET = '[aria-label="Module settings"]';
const PHONE = '[aria-label="Storefront mobile preview"] iframe';

/** Add a module, or select it if a previous run on this page already added it. */
const addOrSelect = (h: Helpers, label: string) => h.all(`${LIB} button`).find((b) => b.getAttribute('aria-label') === `Add ${label}`)
  ?? h.find(`${LIB} button`, label);

/** In the full-size preview, scroll the phone from top to bottom so the whole page is seen. */
const scrollPreviewDialog = async (h: Helpers) => {
  const phone = h.all('[role="dialog"] iframe').map((f) => (f as HTMLIFrameElement).contentDocument).find(Boolean);
  const page = phone?.querySelector<HTMLElement>('.taro_page');
  if (page) {
    page.scrollTo({ top: page.scrollHeight, behavior: 'smooth' });
    await h.wait(2200);
    page.scrollTo({ top: 0, behavior: 'smooth' });
  }
  await h.wait(1200);
};

/** Scroll the phone preview so the module being edited is in view. */
const followInPhone = async (h: Helpers) => {
  const phone = (h.find(PHONE) as HTMLIFrameElement).contentDocument;
  const selected = phone?.querySelector<HTMLElement>('.preview-module-frame--selected');
  const page = phone?.querySelector<HTMLElement>('.taro_page');
  if (selected && page) {
    const offset = selected.getBoundingClientRect().top - page.getBoundingClientRect().top;
    page.scrollTo({ top: page.scrollTop + offset - (page.clientHeight - selected.offsetHeight) / 2, behavior: 'smooth' });
  }
  await h.wait(900);
};

const builder: ShowcaseItem[] = [
  {
    title: 'Edit a module', lead: 'Edit right, see it on the phone.', seconds: 18, src: BUILDER, ready: PHONE, fresh: true,
    body: 'The phone preview is the real mini-program.',
    script: async (h) => {
      h.say('The real mini-program');
      await h.hover(h.find(PHONE));
      h.say('Select a module');
      await h.click(h.find(`${LIB} button`, 'Announcement'));
      await h.wait(700);
      await followInPhone(h);
      const text = h.find('#storefront-announcement');
      await h.click(text);
      await h.type(text, 'New: free delivery in Italy over €120');
      await h.wait(900);
      await h.zoom(h.find(PHONE), 1.6);
      await h.wait(900);
      await h.zoomOut();
      await h.hover(h.find(PHONE));
      h.say('Hide, don\'t delete');
      await h.click(h.find(`${LIB} button`, 'Banner carousel'));
      await h.wait(700);
      await followInPhone(h);
      await h.click(h.find('[role="switch"][aria-label="Show banner 1"]'));
      await h.wait(900);
      await h.click(h.find('[role="switch"][aria-label="Show banner 1"]'));
      await h.wait(900);
    },
  },
  {
    title: 'Add a module', lead: 'Search the catalogue to fill it.', seconds: 19, src: BUILDER, ready: PHONE, fresh: true,
    body: 'Search the catalogue to fill it.',
    script: async (h) => {
      h.say('Add a collection');
      await h.click(addOrSelect(h, 'Product collection'));
      await h.wait(1000);
      await followInPhone(h);
      h.say('Name it');
      const title = h.find('#collection-title');
      await h.click(title);
      await h.type(title, 'Gel colours');
      h.say('Search and add');
      const search = h.find(`${SET} input[aria-label="Search products"]`);
      await h.click(search);
      await h.type(search, 'gel');
      await h.wait(700);
      await h.click(h.find('button[aria-label="Add Gel Polish Red"]'));
      await h.click(h.find('button[aria-label="Add Gel Polish Pink"]'));
      await h.click(h.find('button[aria-label="Add Builder Gel Clear"]'));
      await followInPhone(h);
      h.say('One or two per row');
      await h.click(h.find(`${SET} button`, 'One per row'));
      await followInPhone(h);
      await h.click(h.find(`${SET} button`, 'Two per row'));
      await h.wait(700);
      await h.zoom(h.find(PHONE), 1.6);
      await h.hover(h.find(PHONE));
      await h.wait(900);
    },
  },
  {
    title: 'Arrange and publish', lead: 'Reorder, preview, publish.', seconds: 26, src: BUILDER, ready: PHONE, fresh: true,
    body: 'Reorder, preview, publish.',
    script: async (h) => {
      h.say('Reorder shortcuts');
      await h.click(h.find(`${LIB} button`, 'Quick links'));
      await h.wait(800);
      await followInPhone(h);
      await h.click(h.find('button[aria-label="Move shortcut 美甲产品 down"]'));
      await h.wait(900);
      await h.click(h.find('[role="switch"][aria-label="Show shortcut 脱毛产品"]'));
      await h.wait(900);
      await h.zoom(h.find(PHONE), 1.6);
      await h.wait(700);
      await h.zoomOut();
      await h.hover(h.find(PHONE));
      h.say('Key brand first');
      await h.click(h.find(`${LIB} button`, 'Brand collection'));
      await h.wait(800);
      await followInPhone(h);
      await h.click(h.find('button[aria-label="Move brand OPI up"]'));
      await h.wait(900);
      h.say('Preview as a customer');
      await h.click(h.find('button', 'Preview'));
      await h.wait(1800);
      await scrollPreviewDialog(h);
      await h.click(h.find('[role="dialog"] button[aria-label="Close"]'));
      await h.wait(500);
      h.say('Publish');
      await h.hover(h.find('button', 'Save draft'));
      await h.hover(h.find('button', 'Publish'));
      await h.wait(900);
    },
  },
  {
    title: 'Promote products', lead: 'Campaigns, a hero product, reorders.', seconds: 18, src: BUILDER, ready: PHONE, fresh: true,
    body: 'Campaigns, a hero product, reorders.',
    script: async (h) => {
      h.say('Add campaign products');
      await h.click(addOrSelect(h, 'Marketing campaign'));
      await h.wait(1000);
      await followInPhone(h);
      h.say('Grid or swipe row');
      await h.click(h.find(`${SET} button`, 'Swipe row'));
      await followInPhone(h);
      await h.zoom(h.find(PHONE), 1.6);
      await h.wait(700);
      await h.zoomOut();
      h.say('Feature one product');
      await h.click(addOrSelect(h, 'Single product'));
      await h.wait(900);
      await followInPhone(h);
      const find = h.find(`${SET} input[aria-label="Search products"]`);
      await h.click(find);
      await h.type(find, 'wax');
      await h.wait(600);
      await h.click(h.find(`${SET} button[aria-pressed]`, 'Wax Beads'));
      await followInPhone(h);
      h.say('Each customer\'s usual items');
      await h.click(addOrSelect(h, 'Frequently purchased'));
      await h.wait(1000);
      await followInPhone(h);
      await h.hover(h.find(PHONE));
      await h.wait(900);
    },
  },
  {
    title: 'Link customer accounts', lead: 'One code binds WeChat to the ERP.', seconds: 10, src: ACCOUNTS, ready: '[role="tab"]', fresh: true,
    body: 'A one-time code links WeChat to the ERP.',
    script: async (h) => {
      h.say('Pick the customer');
      await h.click(h.find('[role="tab"]', 'Bellezza Milano'));
      await h.wait(600);
      h.say('Generate a code');
      await h.click(h.all('button').find((b) => /^(Generate pairing code|Regenerate)/.test(b.textContent?.trim() ?? ''))!);
      await h.wait(1200);
      await h.zoom(h.find('[data-slot="badge"]', 'Waiting to be used'), 1.7);
      await h.hover(h.find('[data-slot="badge"]', 'Waiting to be used'));
      h.say('7 days, single use');
      await h.hover(h.find('span', 'Valid until'));
      h.say('Send it as an image');
      await h.hover(h.find('button', 'Download image'));
      await h.hover(h.find('button', 'Copy image'));
      await h.wait(900);
    },
  },
];

export function StorefrontBuilderLiveDemo() {
  return (
    <LiveShowcase
      items={builder}
      src={BUILDER}
      label="mini program"
      title="DEF ERP — live WeChat mini-program builder and accounts, demonstration data"
      baseWidth={1440}
      ready={PHONE}
      prepare={collapseNewSidebar}
    />
  );
}
