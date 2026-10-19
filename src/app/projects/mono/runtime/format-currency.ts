const symbols: Record<string, string> = { USD: "$", CNY: "¥", EUR: "€", JPY: "¥", GBP: "£", KRW: "₩" };
export function formatAmountShort(amount: number, currency = "USD") { const abs = Math.abs(amount); const sign = amount < 0 ? "-" : ""; return sign + (symbols[currency.toUpperCase()] ?? currency) + abs.toFixed(2); }
