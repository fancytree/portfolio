/**
 * 主分类与二级分类配置，供确认卡与 LLM 解析共用。
 * DB 存储：category = 主分类，sub_category = 二级分类（两列）。
 */

export const CATEGORY_SUB_SEP = " · ";

/** 用于展示：主分类 + 可选二级分类，如 "Food & Drink · Coffee" */
export function formatCategoryDisplay(category: string, subCategory?: string | null): string {
  const main = (category ?? "").trim() || "Other";
  const sub = (subCategory ?? "").trim();
  return sub ? `${main}${CATEGORY_SUB_SEP}${sub}` : main;
}

/** 将各种分隔符统一为 " · "，便于后续按固定分隔符拆分（含 Unicode 变体与未知单字符分隔符） */
function normalizeCategorySeparator(category: string): string {
  let s = (category ?? "").trim();
  if (!s) return "";
  const sep = " · ";
  const knownSeparators = /[\u00B7\u2022\u2027\u2219\u30FB\uFF0E\u22C5\-–—]\s*|\s*[\u00B7\u2022\u2027\u2219\u30FB\uFF0E\u22C5\-–—]|\s+-\s+/g;
  s = s.replace(knownSeparators, sep).replace(/\s·\s+/g, sep).trim();
  const anySingleCharSep = /\s+[^\w\s&]\s+/g;
  s = s.replace(anySingleCharSep, sep).trim();
  return s;
}

/** 去掉子分类字符串前可能出现的多个分隔符（如 "· · Gelato" → "Gelato"） */
export function trimLeadingCategorySeparators(s: string): string {
  return (s ?? "").trim().replace(/^\s*([·．•\-–—]\s*)+/u, "").trim();
}

/** 从 "Main · Sub" 字符串中解析出主分类与子分类，兼容多种分隔符（·、．、•、- 及空格变体） */
export function parseCategoryMainSub(category: string): { main: string; sub: string } {
  const normalized = normalizeCategorySeparator(category);
  if (!normalized) return { main: "", sub: "" };
  const sep = " · ";
  const idx = normalized.indexOf(sep);
  if (idx !== -1) {
    let main = normalized.slice(0, idx).trim().replace(/\s+/g, " ");
    const sub = trimLeadingCategorySeparators(normalized.slice(idx + sep.length));
    main = main.replace(/\uFF06/g, "&");
    return { main, sub };
  }
  return { main: normalized.replace(/\s+/g, " ").replace(/\uFF06/g, "&"), sub: "" };
}

/** 支出：主类型 → 二级分类列表（含办公、个人护理、宠物、旅行等） */
export const EXPENSE_MAIN_SUB: Record<string, string[]> = {
  "Food & Drink": ["Dining", "Coffee", "Delivery", "Groceries", "Fruit", "Alcohol", "Snacks", "Other"],
  "Transport": ["Taxi", "Public transit", "Gas", "Parking", "Flight", "Train", "Ride share", "Other"],
  "Shopping": ["Grocery", "Cloth", "Electronics", "Home", "Beauty", "Daily supplies", "Other"],
  "Housing": ["Rent", "Utilities", "Maintenance", "Gardening", "Other"],
  "Entertainment": ["Movies", "Games", "Sports", "Travel", "Concert", "Other"],
  "Healthcare": ["Pharmacy", "Doctor", "Insurance", "Dental", "Other"],
  "Education": ["Course", "Books", "Tuition", "Other"],
  "Finance": ["Transfer", "Fee", "Interest", "Insurance", "Tax", "Other"],
  "Gifts & Donations": ["Gift", "Donation", "Other"],
  "Communications": ["Phone", "Internet", "Other"],
  "Subscriptions": ["Streaming", "Software", "Internet", "Mobile", "Music", "Gym", "Other"],
  "Office": ["Supplies", "Meals", "Other"],
  "Personal Care": ["Haircut", "Beauty", "Skincare", "Toiletries", "Other"],
  "Pets": ["Food", "Vet", "Supplies", "Other"],
  "Travel": ["Accommodation", "Visa", "Activities", "Other"],
  "Childcare & Family": ["Childcare", "School", "Other"],
  "Other": [],
};

/** 收入：主类型 → 二级分类列表 */
export const INCOME_MAIN_SUB: Record<string, string[]> = {
  "Salary": ["Monthly", "Bonus", "Other"],
  "Freelance": ["Project", "Consulting", "Other"],
  "Refund": ["Purchase", "Travel", "Other"],
  "Investment": ["Dividend", "Interest", "Capital gain", "Other"],
  "Gift": ["Personal", "Other"],
  "Bonus": ["Performance", "Other"],
  "Reimbursement": ["Travel", "Expense", "Other"],
  "Rental": ["Property", "Other"],
  "Sale": ["Secondhand", "Other"],
  "Government": ["Subsidy", "Tax refund", "Other"],
  "Other": [],
};

/** 生成给 LLM 的支出分类说明（用于 prompt）；category 从主类选，sub_category 由 LLM 根据用户输入分析生成 */
export function getExpenseCategoryPromptText(): string {
  const lines = Object.entries(EXPENSE_MAIN_SUB)
    .filter(([, subs]) => subs.length > 0)
    .map(([main, subs]) => `  ${main}: ${subs.join(", ")}`);
  return (
    "Category and sub_category:\n" +
    "  - category: Pick ONE main category from the list below (use exact name).\n" +
    "  - sub_category: ANALYZE the user input and GENERATE a short term that best describes the expense. Do NOT just pick from the list — infer from what the user said (e.g. 云南米线 → Yunnan noodles or Dining; 奶茶 → Bubble tea or Coffee; 机票 → Flight). You may use a term from the list as reference or generate any appropriate phrase. Omit only when nothing fits.\n\n" +
    "Main categories (for category field only):\n" +
    lines.join("\n")
  );
}

/** 生成给 LLM 的收入分类说明（用于 prompt）；category 从主类选，sub_category 由 LLM 根据用户输入分析生成 */
export function getIncomeCategoryPromptText(): string {
  const lines = Object.entries(INCOME_MAIN_SUB)
    .filter(([, subs]) => subs.length > 0)
    .map(([main, subs]) => `  ${main}: ${subs.join(", ")}`);
  return (
    "Category and sub_category:\n" +
    "  - category: Pick ONE main category from the list below (use exact name).\n" +
    "  - sub_category: ANALYZE the user input and GENERATE a short term that best describes the income source. Do NOT just pick from the list — infer from context (e.g. 稿费 → Project or Freelance; 房租收入 → Property; 卖二手 → Secondhand). You may use a term from the list or generate any appropriate phrase. Omit only when nothing fits.\n\n" +
    "Main categories (for category field only):\n" +
    lines.join("\n")
  );
}
