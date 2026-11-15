'use client';

import { type Helpers } from './LiveDemo';
import LiveShowcase, { type ShowcaseItem } from './LiveShowcase';

const SALES = '/portfolio/live/sales/product-sales';
const ORDER = '/portfolio/live/sales/orders/0d0e0000-0000-4000-8000-000000001248';
const results = '.sales-order-zone-toolbar-search div.absolute button';

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

const items: ShowcaseItem[] = [
  {
    title: 'Select products', lead: 'One search, two ways to add.', seconds: 18,
    body: 'Broad search groups shades; exact search finds the SKU.',
    script: async (h) => {
      h.say('“dye”: grouped by product');
      const search = h.find('input[placeholder^="Product / brand"]');
      await h.click(search);
      await h.type(search, 'dye');
      await h.zoom(h.find('.sales-order-zone-toolbar-search'), 1.5);
      await h.wait(1200);
      await h.click(h.all(results).find((b) => b.textContent?.includes('Majirel')) ?? h.all(results)[1]);
      await h.wait(600);
      h.say('Add several shades');
      await h.click(h.find('[aria-label="Select Shade：6.0"]'));
      await h.click(h.find('[aria-label="Select Shade：7.1"]'));
      await h.click(h.find('button', 'Add'));
      await h.wait(900);
      h.say('“dye4.1”: the exact SKU');

      await h.type(search, 'dye4.1');
      await h.wait(1300);
      await h.click(h.all(results)[0]);
      await h.wait(900);
      h.say('Totals update in place');
      const up = h.all('button[aria-label="Increase"]')[0];
      await h.zoom(up, 1.8);
      await h.click(up);
      await h.click(up);
      h.say('Mark a gift');
      await h.click(h.all('button').filter((b) => b.textContent?.trim() === 'Gift')[1]);
      await h.wait(900);
    },
  },
  {
    title: 'Place the order', lead: 'Payment and pickup in one step.', seconds: 17, src: `${SALES}#checkout`,
    body: 'Payment and pickup are asked once, at save.',
    script: async (h) => {
      h.say('Saving needs a salesperson');
      await h.click(h.find('button', 'Save'));
      await h.wait(1100);
      await h.click(h.all('[role="combobox"]').pop()!);
      await h.wait(500);
      await h.pick(h.find('[role="option"]'));
      await h.click(h.find('button', 'Save'));
      await h.wait(900);
      h.say('Paid? How?');
      await h.zoom(h.find('#checkout-paid'), 1.6);
      await h.click(h.find('#checkout-paid'));
      await h.wait(1300);
      h.say('Taken with them?');
      await h.click(h.find('#checkout-pickup'));
      await h.wait(1300);
      h.say('Add a note');
      await h.click(h.find('#checkout-notes'));
      await h.type(h.find('#checkout-notes'), 'Rest by courier on Friday');
      await h.wait(1400);
    },
  },
  {
    title: 'Manage the order', lead: 'One record for every role.', seconds: 11, src: ORDER, ready: 'main button',
    body: 'Shipping and payment tracked apart.',
    script: async (h) => {
      h.say('Shipping and payment apart');
      await h.zoom(h.all('span, div').find((e) => e.childElementCount === 0 && e.textContent?.trim() === 'Partially shipped')!, 1.8);
      await h.hover(h.all('span, div').find((e) => e.childElementCount === 0 && e.textContent?.trim() === 'Partially shipped')!);
      await h.hover(h.all('span, div').find((e) => e.childElementCount === 0 && e.textContent?.trim() === 'Paid')!);
      h.say('34 of 39 shipped');
      await h.hover(h.all('span, div, p').find((e) => e.childElementCount === 0 && e.textContent?.trim() === 'Shipping progress')!);
      h.say('Every delivery listed');
      await h.zoomOut();
      await h.click(h.find('button', 'Deliveries'));
      await h.wait(1200);
      h.say('Open, draft, shipped');
      await h.zoom(h.all('span, div, p').find((e) => e.childElementCount === 0 && e.textContent?.trim() === 'Not shipped')!, 1.6);
      await h.hover(h.all('span, div, p').find((e) => e.childElementCount === 0 && e.textContent?.trim() === 'Not shipped')!);
      await h.hover(h.find('button', 'Confirm shipment'));
      await h.hover(h.find('button', 'View DDT'));
      await h.wait(900);
    },
  },
  {
    title: 'Arrange a delivery', lead: 'Pickup or courier.', seconds: 19, src: `${ORDER}#delivery`, ready: 'main button',
    body: 'Each method asks only what it needs.',
    script: async (h) => {
      const inDialog = (text: string) => h.find('[role="dialog"] button', text);
      await h.click(h.find('button', 'Deliveries'));
      await h.click(h.find('button', 'New delivery'));
      await h.wait(900);
      h.say('Pickup: date, then slot');
      await h.click(inDialog('Pickup'));
      await h.zoom(h.find('#delivery-pickup-time'), 1.6);
      await h.click(h.find('#delivery-pickup-time'));
      await h.wait(500);
      await h.click(h.all('[role="dialog"] button').find((b) => /^\d{2}\/\d{2}\/\d{4}$/.test(b.textContent?.trim() ?? ''))!);
      await h.wait(700);
      const slot = h.all('[role="dialog"] button').find((b) => /^\d{1,2}:\d{2}/.test(b.textContent?.trim() ?? ''));
      if (slot) await h.click(slot);
      await h.wait(900);
      h.say('Courier: parcels set the fee');
      await h.zoomOut();
      await h.click(inDialog('Courier'));
      await h.click(inDialog('Add parcel'));
      await h.zoom(h.find('#package-0-weight'), 1.6);
      await h.click(h.find('#package-0-weight'));
      await h.type(h.find('#package-0-weight'), '6.6');
      await h.type(h.find('#package-0-length'), '40');
      await h.type(h.find('#package-0-width'), '30');
      await h.type(h.find('#package-0-height'), '25');
      await h.wait(700);
      await h.hover(h.all('[role="dialog"] *').find((e) => e.childElementCount === 0 && e.textContent?.trim() === 'Suggested fee')!);
      await h.wait(1600);
    },
  },
];

export function SalesOrderLiveDemo() {
  return (
    <LiveShowcase
      items={items}
      src={SALES}
      label="product sales"
      title="DEF ERP — live sales order workflow, demonstration data"
      baseWidth={1480}
      ready='input[aria-label="Qty"]'
      prepare={collapseSidebar}
      storage={COLLAPSED}
    />
  );
}

const purchasing: ShowcaseItem[] = [
  {
    title: 'Draft the order', lead: 'Edit lines in place.', seconds: 21, src: '/portfolio/po-detail', ready: 'main button',
    body: 'Stock and sales beside each line.',
    script: async (h) => {
      h.say('Sales guide quantities');
      await h.click(h.find('main [role="combobox"]'));
      await h.wait(400);
      await h.pick(h.find('[role="option"]', 'Sales · last 6 mo'));
      await h.wait(900);
      h.say('Edit quantity and price');
      await h.click(h.find('main td p', '▸Reinforced bonder'));
      await h.wait(500);
      const inputs = h.all('main tbody input');
      await h.zoom(inputs[0], 1.8);
      await h.click(inputs[0]);
      await h.type(inputs[0], '120');
      await h.click(inputs[2]);
      await h.type(inputs[2], '5.2');
      await h.wait(800);
      h.say('Add from the library');
      await h.zoomOut();
      await h.click(h.find('button', '+ Add product'));
      await h.wait(700);
      const search = h.find('input[aria-label="Search product library"]');
      await h.click(search);
      await h.type(search, 'gel');
      await h.wait(700);
      await h.click(h.find('[aria-label="Select Builder gel Clear 15 ml"]'));
      await h.click(h.find('[aria-label="Select Builder gel Pink 15 ml"]'));
      await h.click(h.find('[role="dialog"] button', 'Add selected (2)'));
      await h.wait(900);
      await h.hover(h.leaf('Gel costruttore Clear'));
      await h.wait(900);
    },
  },
  {
    title: 'Add a new product', lead: 'Not in the library yet.', seconds: 18, src: '/portfolio/po-detail#new-product', ready: 'main button',
    body: 'A manual line now, its SKU later.',
    script: async (h) => {
      h.say('Not in the library yet');
      await h.click(h.find('button', '+ Add product'));
      await h.wait(600);
      await h.click(h.find('[role="dialog"] button', 'New product'));
      await h.click(h.find('#new-product-description'));
      await h.type(h.find('#new-product-description'), 'MNP repair serum 30 ml');
      await h.type(h.find('#new-product-qty'), '24');
      await h.type(h.find('#new-product-cost'), '8.5');
      await h.click(h.find('[role="dialog"] button', 'Add new product'));
      await h.wait(800);
      await h.zoom(h.leaf('New product · no SKU yet'), 1.8);
      await h.hover(h.leaf('New product · no SKU yet'));
      h.say('Create its SKU here');
      await h.zoomOut();
      await h.click(h.find('main button', 'Create SKU'));
      await h.wait(800);
      await h.click(h.find('#quick-sku-price'));
      await h.type(h.find('#quick-sku-price'), '16.9');
      await h.click(h.all('[role="dialog"] button').filter((b) => b.textContent?.trim().startsWith('Create and match')).pop()!);
      await h.wait(800);
      await h.hover(h.leaf('New SKU created'));
      await h.wait(900);
    },
  },
  {
    title: 'Confirm with the supplier', lead: 'Differences on each line.', seconds: 24, src: '/portfolio/po-detail#confirm', ready: 'main button',
    body: 'The PDF is read; differences are marked.',
    script: async (h) => {
      h.say('Draft, grouped by product');
      await h.click(h.find('main td p', '▸Reinforced bonder'));
      await h.wait(700);
      h.say('Upload the confirmation');
      await h.click(h.find('button', 'Upload confirmation'));
      await h.wait(700);
      await h.hover(h.leaf('Drop the supplier PDF'));
      await h.upload(h.find('[role="dialog"] input[type="file"]'), 'Conferma-ordine-MNP.pdf');
      await h.wait(3600);
      h.say('Differences marked per line');
      await h.zoom(h.leaf('Qty 96'), 1.7);
      await h.hover(h.leaf('Qty 96'));
      await h.hover(h.leaf('Supplier-added SKU'));
      h.say('New product: create it here');
      await h.zoomOut();
      await h.click(h.find('main button', 'Create SKU'));
      await h.wait(700);
      await h.click(h.find('#quick-sku-price'));
      await h.type(h.find('#quick-sku-price'), '12.9');
      await h.click(h.find('[role="dialog"] button', 'Create and match'));
      await h.wait(800);
      await h.hover(h.leaf('New SKU created'));
      await h.hover(h.leaf('Price +'));
      h.say('Total shows the change');
      await h.zoom(h.leaf('€178.80 lower'), 1.7);
      await h.hover(h.leaf('€178.80 lower'));
      await h.hover(h.find('button', 'Mark as ordered'));
      await h.wait(900);
    },
  },
  {
    title: 'Receive the goods', lead: 'Delivery note against confirmation.', seconds: 13, src: '/portfolio/po-inbound', ready: 'main button',
    body: 'Delivery note checked against the order.',
    script: async (h) => {
      h.say('Upload the delivery note');
      await h.click(h.find('button', 'Upload DDT'));
      await h.wait(700);
      await h.hover(h.leaf('Drop the DDT'));
      await h.upload(h.find('[role="dialog"] input[type="file"]'), 'DDT-MNP-0113.pdf');
      await h.wait(3000);
      h.say('Short, matching, over');
      await h.zoom(h.leaf('Short vs confirmation'), 1.7);
      await h.hover(h.leaf('Short vs confirmation'));
      await h.hover(h.leaf('Matches confirmation'));
      await h.hover(h.leaf('More than confirmed'));
      h.say('Correct the count');
      const actual = h.find('main input[type="number"]');
      await h.click(actual);
      await h.type(actual, '58');
      await h.wait(1200);
    },
  },
  {
    title: 'Decide line by line', lead: 'Return, gift or stock in.', seconds: 13, src: '/portfolio/po-inbound?state=ddt', ready: 'main button',
    body: 'Unconfirmed goods: return, gift or stock.',
    script: async (h) => {
      h.say('Arrived, but never confirmed');
      await h.zoom(h.leaf('Not on confirmation'), 1.8);
      await h.hover(h.leaf('Not on confirmation'));
      h.say('Three ways to handle it');
      await h.click(h.find('main button', 'Return'));
      await h.wait(800);
      await h.click(h.find('main button', 'Stock in'));
      await h.wait(800);
      await h.click(h.find('main button', 'Gift'));
      await h.wait(700);
      await h.hover(h.leaf('Gift · not stocked'));
      h.say('Ready to receive');
      await h.zoomOut();
      await h.click(h.find('button', 'Confirm receipt'));
      await h.wait(900);
      await h.hover(h.leaf('PO receipt progress'));
      await h.wait(900);
    },
  },
  {
    title: 'Close what is still open', lead: 'Wait, delay, close or return.', seconds: 17, src: '/portfolio/po-inbound?state=received', ready: 'main button',
    body: 'Wait, delay, close or return the rest.',
    script: async (h) => {
      h.say('Some lines didn\'t arrive');
      await h.zoom(h.leaf('Not on DDT'), 1.8);
      await h.hover(h.leaf('Not on DDT'));
      h.say('Decide what happens');
      await h.zoomOut();
      await h.click(h.find('button', 'Handle remaining goods'));
      await h.wait(800);
      await h.hover(h.leaf('Wait for next batch'));
      await h.click(h.leaf('Supplier delay'));
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
      await h.hover(h.leaf('Delayed'));
      await h.wait(900);
    },
  },
];

export function PurchasingLiveDemo() {
  return (
    <LiveShowcase
      items={purchasing}
      src="/portfolio/po-detail"
      label="purchasing"
      title="DEF ERP — live purchasing and receiving, demonstration data"
      baseWidth={1480}
      ready="main button"
      prepare={collapseSidebar}
      storage={COLLAPSED}
    />
  );
}

const INVOICES = '/portfolio/live/finance/invoices';

/** Text inside the page's main area or the open dialog, so sidebar labels never match. */
const within = (h: Helpers, scope: string, text: string) => {
  const el = h.all(`${scope} *`).find((e) => e.childElementCount === 0 && e.textContent?.trim().startsWith(text));
  if (!el) throw new Error(`missing "${text}" in ${scope}`);
  return el;
};

const invoicing: ShowcaseItem[] = [
  {
    title: 'See what to invoice', lead: 'Paid orders, waiting for an invoice.', seconds: 18, src: INVOICES, ready: 'main table', fresh: true,
    body: 'Start from orders, not a blank invoice.',
    script: async (h) => {
      h.say('What\'s waiting');
      await h.zoom(within(h, 'main', 'Orders to invoice'), 1.6);
      await h.hover(within(h, 'main', 'Orders to invoice'));
      await h.hover(within(h, 'main', 'Total to invoice'));
      h.say('One tab per stage');
      await h.zoomOut();
      await h.click(h.find('main button', 'No number'));
      await h.wait(700);
      await h.click(h.find('main button', 'Invoiced'));
      await h.wait(700);
      await h.click(h.find('main button', 'To invoice'));
      await h.wait(600);
      await h.hover(within(h, 'main', 'OUT-2026-001248'));
      h.say('Start with the customer');
      await h.click(h.find('main button', 'New invoice'));
      await h.wait(900);
      await h.hover(within(h, '[role="dialog"]', 'Select a customer first'));
      const customer = h.find('[role="dialog"] input');
      await h.click(customer);
      await h.type(customer, 'Luce');
      await h.wait(900);
      await h.click(h.all('[role="dialog"] button').find((b) => b.textContent?.includes('Luce Beauty Lab'))!);
      await h.wait(1300);
    },
  },
  {
    title: 'Combine orders', lead: 'Several orders, one invoice.', seconds: 15, src: `${INVOICES}?compose=1`, ready: '#invoice-total', fresh: true,
    body: 'Lines, prices and tax come pre-filled.',
    script: async (h) => {
      h.say('Orders already loaded');
      await h.hover(within(h, '[role="dialog"]', 'OUT-2026-001248'));
      h.say('Paid orders only');
      await h.click(h.find('[role="dialog"] [role="tab"]', 'Paid'));
      await h.wait(800);
      h.say('Gifts left out');
      await h.zoom(within(h, '[role="dialog"]', 'Remainder after'), 1.6);
      await h.hover(within(h, '[role="dialog"]', 'Remainder after'));
      await h.hover(within(h, '[role="dialog"]', 'Gift'));
      h.say('Enter the amount paid');
      const total = h.find('#invoice-total');
      await h.click(total);
      await h.fill(total, '1200');
      await h.commit(total);
      await h.wait(900);
      await h.hover(within(h, '[role="dialog"]', 'Item total differs'));
      h.say('Adjust one line');
      const amount = h.all('[role="dialog"] input[aria-label="Invoice amount"]')[0];
      await h.click(amount);
      await h.fill(amount, '249.00');
      await h.commit(amount);
      await h.wait(900);
      await h.hover(h.find('#invoice-total'));
      await h.wait(700);
    },
  },
  {
    title: 'Preview and issue', lead: 'As the tax office reads it.', seconds: 16, src: `${INVOICES}?compose=1`, ready: '#invoice-total',
    body: 'Italian format, checked once, then issued.',
    script: async (h) => {
      const back = h.all('[role="dialog"] button').find((b) => b.textContent?.trim() === 'Back to edit');
      if (!back) {
        h.say('Who prepared it');
        await h.click(h.all('[role="dialog"] [role="combobox"]').find((c) => c.textContent?.includes('Select operator'))!);
        await h.wait(500);
        await h.pick(h.find('[role="option"]'));
        await h.click(h.find('[role="dialog"] button', 'Preview invoice'));
        await h.wait(1300);
      }
      h.say('Who, and how paid');
      await h.zoom(within(h, '[role="dialog"]', 'Cedente/prestatore'), 1.6);
      await h.hover(within(h, '[role="dialog"]', 'Cedente/prestatore'));
      await h.hover(within(h, '[role="dialog"]', 'Modalità di pagamento'));
      h.say('Tax per line');
      await h.hover(within(h, '[role="dialog"]', 'Shampoo Vitamino Color'));
      await h.hover(h.find('[role="dialog"] button', 'Issue invoice'));
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
      baseWidth={1480}
      ready="main table"
      prepare={collapseSidebar}
      storage={COLLAPSED}
    />
  );
}

const BUILDER = '/portfolio/miniprogram-decoration';

/** Add a module, or select it if a previous run on this page already added it. */
const addOrSelect = (h: Helpers, label: string) => h.all('main button').find((b) => b.getAttribute('aria-label') === `Add ${label}`)
  ?? h.find('main button', label);

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

/** Scroll the phone preview so the module being edited is in view, the way the builder's own preview should follow. */
const followInPhone = async (h: Helpers) => {
  const phone = (h.find('main iframe') as HTMLIFrameElement).contentDocument;
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
    title: 'Edit a module', lead: 'Edit right, see it on the phone.', seconds: 18, src: BUILDER, ready: 'main iframe', fresh: true,
    body: 'The phone preview is the real mini-program.',
    script: async (h) => {
      h.say('The real mini-program');
      await h.hover(h.find('main iframe'));
      h.say('Select a module');
      await h.click(h.find('main button', 'Announcement'));
      await h.wait(700);
      await followInPhone(h);
      const text = h.find('#storefront-announcement');
      await h.click(text);
      await h.type(text, 'New: free delivery in Italy over €120');
      await h.wait(900);
      await h.zoom(h.find('main iframe'), 1.6);
      await h.wait(900);
      await h.zoomOut();
      await h.hover(h.find('main iframe'));
      h.say('Hide, don\'t delete');
      await h.click(h.find('main button', 'Banner carousel'));
      await h.wait(700);
      await followInPhone(h);
      await h.click(h.find('[role="switch"][aria-label="Show banner 1"]'));
      await h.wait(900);
      await h.click(h.find('[role="switch"][aria-label="Show banner 1"]'));
      await h.wait(900);
    },
  },
  {
    title: 'Add a module', lead: 'Search the catalogue to fill it.', seconds: 19, src: `${BUILDER}#add`, ready: 'main iframe',
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
      const search = h.find('input[aria-label="Search products"]');
      await h.click(search);
      await h.type(search, 'gel');
      await h.wait(700);
      await h.click(h.find('button[aria-label="Add Gel Polish Red"]'));
      await h.click(h.find('button[aria-label="Add Gel Polish Pink"]'));
      await h.click(h.find('button[aria-label="Add Builder Gel Clear"]'));
      await followInPhone(h);
      h.say('One or two per row');
      await h.click(h.find('main button', 'One per row'));
      await followInPhone(h);
      await h.click(h.find('main button', 'Two per row'));
      await h.wait(700);
      await h.zoom(h.find('main iframe'), 1.6);
      await h.hover(h.find('main iframe'));
      await h.wait(900);
    },
  },
  {
    title: 'Arrange and publish', lead: 'Reorder, preview, publish.', seconds: 26, src: `${BUILDER}#arrange`, ready: 'main iframe',
    body: 'Reorder, preview, publish.',
    script: async (h) => {
      h.say('Reorder shortcuts');
      await h.click(h.find('main button', 'Quick links'));
      await h.wait(800);
      await followInPhone(h);
      await h.click(h.find('button[aria-label="Move shortcut 美甲产品 down"]'));
      await h.wait(900);
      await h.click(h.find('[role="switch"][aria-label="Show shortcut 脱毛产品"]'));
      await h.wait(900);
      await h.zoom(h.find('main iframe'), 1.6);
      await h.wait(700);
      await h.zoomOut();
      await h.hover(h.find('main iframe'));
      h.say('Key brand first');
      await h.click(h.find('main button', 'Brand collection'));
      await h.wait(800);
      await followInPhone(h);
      await h.click(h.find('button[aria-label="Move brand OPI up"]'));
      await h.wait(900);
      h.say('Preview as a customer');
      await h.click(h.find('main button', 'Preview'));
      await h.wait(1800);
      await scrollPreviewDialog(h);
      await h.click(h.find('[role="dialog"] button', 'Close'));
      await h.wait(500);
      h.say('Publish');
      await h.hover(h.find('main button', 'Save draft'));
      await h.hover(h.find('main button', 'Publish demo'));
      await h.wait(900);
    },
  },
  {
    title: 'Promote products', lead: 'Campaigns, a hero product, reorders.', seconds: 18, src: `${BUILDER}#promote`, ready: 'main iframe',
    body: 'Campaigns, a hero product, reorders.',
    script: async (h) => {
      h.say('Add campaign products');
      await h.click(addOrSelect(h, 'Marketing campaign'));
      await h.wait(1000);
      await followInPhone(h);
      h.say('Grid or swipe row');
      await h.click(h.find('main button', 'Swipe row'));
      await followInPhone(h);
      await h.zoom(h.find('main iframe'), 1.6);
      await h.wait(700);
      await h.zoomOut();
      h.say('Feature one product');
      await h.click(addOrSelect(h, 'Single product'));
      await h.wait(900);
      await followInPhone(h);
      const find = h.find('input[aria-label="Search products"]');
      await h.click(find);
      await h.type(find, 'wax');
      await h.wait(600);
      await h.click(h.find('main button[aria-pressed]', 'Wax Beads'));
      await followInPhone(h);
      h.say('Each customer\'s usual items');
      await h.click(addOrSelect(h, 'Frequently purchased'));
      await h.wait(1000);
      await followInPhone(h);
      await h.hover(h.find('main iframe'));
      await h.wait(900);
    },
  },
  {
    title: 'Link customer accounts', lead: 'One code binds WeChat to the ERP.', seconds: 10, src: '/portfolio/store-accounts', ready: 'main [role="tab"]',
    body: 'A one-time code links WeChat to the ERP.',
    script: async (h) => {
      h.say('Pick the customer');
      await h.click(h.find('main [role="tab"]', 'Bellezza Milano'));
      await h.wait(600);
      h.say('Generate a code');
      // A code may already exist for this customer; regenerating shows the same step.
      await h.click(h.all('main button').find((b) => /^(Generate pairing code|Regenerate)/.test(b.textContent?.trim() ?? ''))!);
      await h.wait(1200);
      await h.zoom(h.leaf('Waiting to be used'), 1.7);
      await h.hover(h.leaf('Waiting to be used'));
      h.say('7 days, single use');
      await h.hover(h.leaf('Valid until'));
      h.say('Send it as an image');
      await h.hover(h.find('main button', 'Download image'));
      await h.hover(h.find('main button', 'Copy image'));
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
      baseWidth={1480}
      ready="main iframe"
      prepare={collapseSidebar}
      storage={COLLAPSED}
    />
  );
}
