/**
 * 发票演示数据。照搬原 ERP 作品集页 /finance/invoices 的演示数据：两个客户、四张待开票订单、四张已有发票。
 * 规则对齐 FinanceInvoices：赠品不开票；输入发票总额时按订单顺序勾选商品行，直到最接近总额；
 * 改数量按剩余金额等比例算行金额。
 */

export type InvLine = {
  key: string; code: string; name: string; unit: string;
  /** 本单剩余可开票数量 / 金额（含税） */
  qty: number; amount: number;
  gift?: boolean; shipping?: boolean;
};
export type InvOrder = {
  id: string; no: string; date: string; customer: string; invoiceTo: string;
  paid: boolean; payment: string; note?: string; lines: InvLine[];
};
export type Customer = { id: string; code: string; name: string; branches: string[] };

export const CUSTOMERS: Customer[] = [
  { id: 'c-1042', code: '1042', name: 'Luce Beauty Lab', branches: ['Customer account (HQ)'] },
  { id: 'c-1077', code: '1077', name: 'Bellezza Milano', branches: ['Bellezza Milano SRL'] },
  { id: 'c-1090', code: '1090', name: 'Studio Aurora', branches: ['Customer account (HQ)'] },
  { id: 'c-1103', code: '1103', name: 'Belle Mani Nail Bar', branches: ['Customer account (HQ)', 'Belle Mani Navigli'] },
  { id: 'c-1115', code: '1115', name: 'Salone Viola', branches: ['Viola Hair SAS'] },
];
export const customerLabel = (c: Customer) => `${c.code} ${c.name}`;

const L = (order: string, i: number, code: string, name: string, unit: string, qty: number, amount: number, extra: Partial<InvLine> = {}): InvLine =>
  ({ key: `${order}:${i}`, code, name, unit, qty, amount, ...extra });

export const ORDERS: InvOrder[] = [
  { id: 'o-1248', no: 'OUT-2026-001248', date: '03/09/2026', customer: 'c-1042', invoiceTo: 'Customer account (HQ)', paid: true, payment: 'Card €823.00', lines: [
    L('1248', 0, 'LP-VC-500', 'Shampoo Vitamino Color 500ml', 'PZ', 24, 312),
    L('1248', 1, 'OLA-N7-30', 'Olaplex Nº7 Bonding Oil 30ml', 'PZ', 2, 133),
    L('1248', 2, 'LP-AR-1500', 'Shampoo Absolut Repair 1500ml', 'PZ', 4, 180),
    L('1248', 3, 'DEF-SAF-500', 'Shampoo Antiforfora 500ml', 'PZ', 3, 198),
    L('1248', 4, 'OPI-OC-8', 'OPI Olio Unghie e Cuticole 8,6ml', 'PZ', 6, 0, { gift: true }),
    L('1248', 5, '', 'Spese di spedizione / Shipping', '', 1, 8, { shipping: true }),
  ] },
  { id: 'o-1251', no: 'OUT-2026-001251', date: '05/09/2026', customer: 'c-1077', invoiceTo: 'Bellezza Milano SRL', paid: true, payment: 'Bank transfer €210.00', lines: [
    L('1251', 0, 'OLA-N3-100', 'Olaplex Nº3 Hair Perfector 100ml', 'PZ', 3, 84),
    L('1251', 1, 'LP-AR-M250', 'Maschera Absolut Repair 250ml', 'PZ', 4, 126),
  ] },
  { id: 'o-1260', no: 'OUT-2026-001260', date: '11/10/2026', customer: 'c-1042', invoiceTo: 'Customer account (HQ)', paid: true, payment: 'Bank transfer €440.00', note: 'Remainder after FT-2026-0148', lines: [
    L('1260', 0, 'LP-VC-500', 'Shampoo Vitamino Color 500ml', 'PZ', 12, 252),
    L('1260', 1, 'LP-AR-1500', 'Shampoo Absolut Repair 1500ml', 'PZ', 4, 180),
    L('1260', 2, 'OPI-OC-8', 'OPI Olio Unghie e Cuticole 8,6ml', 'PZ', 6, 90),
    L('1260', 3, '', 'Spese di spedizione / Shipping', '', 1, 8, { shipping: true }),
  ] },
  { id: 'o-1266', no: 'OUT-2026-001266', date: '18/10/2026', customer: 'c-1042', invoiceTo: 'Customer account (HQ)', paid: false, payment: '', lines: [
    L('1266', 0, 'OLA-N7-30', 'Olaplex Nº7 Bonding Oil 30ml', 'PZ', 6, 141),
    L('1266', 1, 'DEF-SAF-500', 'Shampoo Antiforfora 500ml', 'PZ', 2, 132),
    L('1266', 2, 'OPI-OC-8', 'OPI Olio Unghie e Cuticole 8,6ml', 'PZ', 8, 120),
  ] },
  { id: 'o-1271', no: 'OUT-2026-001271', date: '24/10/2026', customer: 'c-1090', invoiceTo: 'Customer account (HQ)', paid: true, payment: 'Card €468.50', lines: [
    L('1271', 0, 'KER-EL-250', 'Kérastase Elixir Ultime 100ml', 'PZ', 6, 291),
    L('1271', 1, 'DAV-OI-280', 'Davines OI Shampoo 280ml', 'PZ', 8, 169.5),
    L('1271', 2, '', 'Spese di spedizione / Shipping', '', 1, 8, { shipping: true }),
  ] },
  { id: 'o-1279', no: 'OUT-2026-001279', date: '02/11/2026', customer: 'c-1103', invoiceTo: 'Belle Mani Navigli', paid: true, payment: 'Bank transfer €612.00', lines: [
    L('1279', 0, 'OPI-GC-15', 'OPI GelColor Base Coat 15ml', 'PZ', 12, 324),
    L('1279', 1, 'OPI-GC-TC', 'OPI GelColor Top Coat 15ml', 'PZ', 12, 288),
    L('1279', 2, 'OPI-FILE', 'Lime professionali (omaggio)', 'PZ', 10, 0, { gift: true }),
  ] },
  { id: 'o-1284', no: 'OUT-2026-001284', date: '09/11/2026', customer: 'c-1115', invoiceTo: 'Viola Hair SAS', paid: false, payment: '', lines: [
    L('1284', 0, 'WEL-KP-60', 'Wella Koleston Perfect 60ml', 'PZ', 30, 255),
    L('1284', 1, 'WEL-WP-1L', 'Wella Welloxon Perfect 1L', 'PZ', 6, 57),
  ] },
];

export const orderGoods = (o: InvOrder) => o.lines.filter((l) => !l.shipping).reduce((s, l) => s + l.amount, 0);
export const orderShipping = (o: InvOrder) => o.lines.filter((l) => l.shipping).reduce((s, l) => s + l.amount, 0);
export const orderTotal = (o: InvOrder) => orderGoods(o) + orderShipping(o);

export type InvStatus = 'no_number' | 'draft' | 'invoiced' | 'voided';
export type PreviewLine = { date: string; code: string; name: string; unit: string; qty: number; amount: number; shipping?: boolean };
export type Invoice = {
  id: string; customer: string; invoiceTo?: string; no: string; date: string;
  payments: { method: string; amount: number }[]; orders: string[]; amount: number;
  operator: string; entered: string; status: InvStatus; lines: PreviewLine[];
};

const pl = (date: string, code: string, name: string, qty: number, amount: number, unit = 'PZ'): PreviewLine => ({ date, code, name, unit, qty, amount });
export const SEED_INVOICES: Invoice[] = [
  { id: 'i-1', customer: 'c-1042', no: '', date: '', payments: [{ method: 'Cash', amount: 210 }], orders: ['OUT-2026-001239'], amount: 210, operator: 'Elena Rossi', entered: '20/10/2026 20:05', status: 'no_number',
    lines: [pl('28/08/2026', 'LP-VC-500', 'Shampoo Vitamino Color 500ml', 10, 130), pl('28/08/2026', 'DEF-SAF-500', 'Shampoo Antiforfora 500ml', 1, 80)] },
  { id: 'i-2', customer: 'c-1077', invoiceTo: 'Bellezza Milano SRL', no: '', date: '', payments: [{ method: 'Card', amount: 132 }], orders: ['OUT-2026-001244'], amount: 132, operator: 'Elena Rossi', entered: '21/10/2026 12:30', status: 'draft',
    lines: [pl('01/09/2026', 'OLA-N3-100', 'Olaplex Nº3 Hair Perfector 100ml', 3, 84), pl('01/09/2026', 'OLA-N7-30', 'Olaplex Nº7 Bonding Oil 30ml', 1, 48)] },
  { id: 'i-3', customer: 'c-1042', no: 'FT-2026-0142', date: '08/10/2026', payments: [{ method: 'Card', amount: 1248.4 }], orders: ['OUT-2026-001231'], amount: 1248.4, operator: 'Elena Rossi', entered: '08/10/2026 11:12', status: 'invoiced',
    lines: [pl('22/08/2026', 'LP-VC-500', 'Shampoo Vitamino Color 500ml', 48, 624), pl('22/08/2026', 'LP-AR-1500', 'Shampoo Absolut Repair 1500ml', 12, 540), pl('22/08/2026', 'OLA-N7-30', 'Olaplex Nº7 Bonding Oil 30ml', 1, 84.4)] },
  { id: 'i-4', customer: 'c-1077', invoiceTo: 'Bellezza Milano SRL', no: 'FT-2026-0158', date: '16/10/2026', payments: [{ method: 'Bank transfer', amount: 486 }], orders: ['OUT-2026-001237'], amount: 486, operator: 'Elena Rossi', entered: '16/10/2026 18:40', status: 'invoiced',
    lines: [pl('29/08/2026', 'LP-AR-M250', 'Maschera Absolut Repair 250ml', 12, 378), pl('29/08/2026', 'OLA-N3-100', 'Olaplex Nº3 Hair Perfector 100ml', 4, 108)] },
  { id: 'i-5', customer: 'c-1042', no: 'FT-2026-0094', date: '02/10/2026', payments: [{ method: 'Cash', amount: 318 }], orders: ['OUT-2026-001218'], amount: 318, operator: 'Elena Rossi', entered: '02/10/2026 14:18', status: 'voided',
    lines: [pl('15/08/2026', 'DEF-SAF-500', 'Shampoo Antiforfora 500ml', 3, 198), pl('15/08/2026', 'OPI-OC-8', 'OPI Olio Unghie e Cuticole 8,6ml', 8, 120)] },
  // 未填号
  { id: 'i-6', customer: 'c-1090', no: '', date: '', payments: [{ method: 'Card', amount: 386.4 }], orders: ['OUT-2026-001262'], amount: 386.4, operator: 'Giulia Verdi', entered: '12/11/2026 10:42', status: 'no_number',
    lines: [pl('13/10/2026', 'KER-EL-250', 'Kérastase Elixir Ultime 100ml', 6, 291), pl('13/10/2026', 'DAV-OI-280', 'Davines OI Shampoo 280ml', 4, 87.4), pl('13/10/2026', '', 'Spese di spedizione / Shipping', 1, 8, '')] },
  { id: 'i-7', customer: 'c-1103', invoiceTo: 'Belle Mani Navigli', no: '', date: '', payments: [{ method: 'Bank transfer', amount: 540 }, { method: 'Cash', amount: 72 }], orders: ['OUT-2026-001258', 'OUT-2026-001264'], amount: 612, operator: 'Elena Rossi', entered: '14/11/2026 16:08', status: 'no_number',
    lines: [pl('09/10/2026', 'OPI-GC-15', 'OPI GelColor Base Coat 15ml', 12, 324), pl('16/10/2026', 'OPI-GC-TC', 'OPI GelColor Top Coat 15ml', 12, 288)] },
  // 草稿
  { id: 'i-8', customer: 'c-1115', invoiceTo: 'Viola Hair SAS', no: '', date: '', payments: [{ method: 'Bank transfer', amount: 255 }], orders: ['OUT-2026-001269'], amount: 255, operator: 'Giulia Verdi', entered: '15/11/2026 09:20', status: 'draft',
    lines: [pl('21/10/2026', 'WEL-KP-60', 'Wella Koleston Perfect 60ml', 30, 255)] },
  // 已开票
  { id: 'i-9', customer: 'c-1090', no: 'FT-2026-0161', date: '21/10/2026', payments: [{ method: 'Card', amount: 742.8 }], orders: ['OUT-2026-001249'], amount: 742.8, operator: 'Giulia Verdi', entered: '21/10/2026 15:02', status: 'invoiced',
    lines: [pl('04/09/2026', 'KER-EL-250', 'Kérastase Elixir Ultime 100ml', 12, 582), pl('04/09/2026', 'DAV-OI-280', 'Davines OI Shampoo 280ml', 8, 160.8)] },
  { id: 'i-10', customer: 'c-1042', no: 'FT-2026-0167', date: '29/10/2026', payments: [{ method: 'Bank transfer', amount: 935 }], orders: ['OUT-2026-001241', 'OUT-2026-001245'], amount: 935, operator: 'Elena Rossi', entered: '29/10/2026 11:47', status: 'invoiced',
    lines: [pl('30/08/2026', 'LP-VC-500', 'Shampoo Vitamino Color 500ml', 36, 468), pl('02/09/2026', 'LP-AR-1500', 'Shampoo Absolut Repair 1500ml', 10, 450), pl('02/09/2026', '', 'Spese di spedizione / Shipping', 1, 17, '')] },
  { id: 'i-11', customer: 'c-1103', invoiceTo: 'Belle Mani Navigli', no: 'FT-2026-0172', date: '05/11/2026', payments: [{ method: 'Card', amount: 318.5 }], orders: ['OUT-2026-001253'], amount: 318.5, operator: 'Elena Rossi', entered: '05/11/2026 18:30', status: 'invoiced',
    lines: [pl('07/10/2026', 'OPI-GC-15', 'OPI GelColor Base Coat 15ml', 6, 162), pl('07/10/2026', 'OPI-OC-8', 'OPI Olio Unghie e Cuticole 8,6ml', 10, 156.5)] },
  { id: 'i-12', customer: 'c-1115', invoiceTo: 'Viola Hair SAS', no: 'FT-2026-0175', date: '10/11/2026', payments: [{ method: 'Bank transfer', amount: 1096 }], orders: ['OUT-2026-001256'], amount: 1096, operator: 'Giulia Verdi', entered: '10/11/2026 12:15', status: 'invoiced',
    lines: [pl('08/10/2026', 'WEL-KP-60', 'Wella Koleston Perfect 60ml', 80, 680), pl('08/10/2026', 'WEL-WP-1L', 'Wella Welloxon Perfect 1L', 40, 380), pl('08/10/2026', '', 'Spese di spedizione / Shipping', 1, 36, '')] },
  { id: 'i-13', customer: 'c-1077', invoiceTo: 'Bellezza Milano SRL', no: 'FT-2026-0178', date: '13/11/2026', payments: [{ method: 'Card', amount: 254 }], orders: ['OUT-2026-001261'], amount: 254, operator: 'Elena Rossi', entered: '13/11/2026 10:05', status: 'invoiced',
    lines: [pl('12/10/2026', 'OLA-N3-100', 'Olaplex Nº3 Hair Perfector 100ml', 5, 140), pl('12/10/2026', 'LP-AR-M250', 'Maschera Absolut Repair 250ml', 4, 114)] },
  // 已作废
  { id: 'i-14', customer: 'c-1090', no: 'FT-2026-0153', date: '14/10/2026', payments: [{ method: 'Cash', amount: 96 }], orders: ['OUT-2026-001243'], amount: 96, operator: 'Giulia Verdi', entered: '14/10/2026 17:51', status: 'voided',
    lines: [pl('03/09/2026', 'DAV-OI-280', 'Davines OI Shampoo 280ml', 4, 96)] },
];

export const PAYMENT_METHODS = ['Card', 'Cash', 'Bank transfer', 'Cheque'];
/** 意大利电子发票的付款方式代码 */
export const MP_CODE: Record<string, string> = { Card: 'Carta di pagamento (MP08)', Cash: 'Contanti (MP01)', 'Bank transfer': 'Bonifico (MP05)', Cheque: 'Assegno (MP02)' };
export const OPERATORS = ['Elena Rossi', 'Giulia Verdi'];
export const r2 = (n: number) => Math.round(n * 100) / 100;
export const it2 = (n: number) => n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
