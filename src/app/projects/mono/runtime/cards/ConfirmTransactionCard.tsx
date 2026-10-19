"use client";

/* eslint react-hooks/set-state-in-effect: off -- mirrored controlled-form synchronization from Mono production. */

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Check, Receipt, ChevronDown, Calendar } from "lucide-react";
import LocationInput from "../ui/LocationInput";
import { FormCheckbox, FormInput, FormSelect, FormTextarea } from "../ui/FormControls";
import TransactionCategoryFields from "../ui/TransactionCategoryFields";
import type { AIParsedTransaction, TransactionLocation } from "../types";
import { CURRENCY_CODES } from "../transaction-schema";
import { CATEGORY_SUB_SEP, EXPENSE_MAIN_SUB, INCOME_MAIN_SUB, parseCategoryMainSub, trimLeadingCategorySeparators } from "../category-options";
import { useTheme } from "../contexts/ThemeContext";


function emptyLocation(): TransactionLocation {
  return {
    country: null,
    city: null,
    district: null,
    address: null,
    coordinates: null,
  };
}

const DAYS_OF_MONTH = Array.from({ length: 28 }, (_, i) => i + 1);
const CURRENCY_SYMBOLS: Record<(typeof CURRENCY_CODES)[number], string> = {
  USD: "$",
  CNY: "¥",
  EUR: "€",
  JPY: "¥",
  GBP: "£",
  KRW: "₩",
};
const WEEKDAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_LABELS: Record<number, string> = {
  1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June",
  7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December",
};
function daySuffix(d: number): string {
  if (d >= 11 && d <= 13) return `${d}th`;
  switch (d % 10) {
    case 1: return `${d}st`;
    case 2: return `${d}nd`;
    case 3: return `${d}rd`;
    default: return `${d}th`;
  }
}
function getDefaultRepeatFromNow(): { dayOfWeek: number; dayOfMonth: number; monthOfYear: number } {
  const d = new Date();
  return {
    dayOfWeek: d.getDay(),
    dayOfMonth: Math.min(28, d.getDate()),
    monthOfYear: d.getMonth() + 1,
  };
}

/** 按币种返回默认国家/城市（确认卡内兜底，保证 Location 有显示） */
function defaultLocationForCurrency(currency: string | null | undefined): TransactionLocation {
  const c = (currency ?? "USD").trim().toUpperCase();
  const map: Record<string, { country: string; city: string }> = {
    EUR: { country: "Italy", city: "Rome" },
    USD: { country: "United States", city: "New York" },
    CNY: { country: "China", city: "Beijing" },
    GBP: { country: "United Kingdom", city: "London" },
    JPY: { country: "Japan", city: "Tokyo" },
    KRW: { country: "South Korea", city: "Seoul" },
  };
  const def = map[c];
  if (def) return { ...emptyLocation(), country: def.country, city: def.city };
  return emptyLocation();
}

/** 确认时可选带上「固定周期支出」设置（仅 Subscriptions 支出）：与 RecurringSetupCard 一致的间隔与日/月 */
export type RecurringPeriodOption = "weekly" | "monthly" | "quarterly" | "yearly";

export interface ConfirmRecurringOptions {
  recurring?: {
    period: RecurringPeriodOption;
    /** 每周：0–6（0=Sunday） */
    day_of_week?: number;
    /** 每月/季/年：1–28 */
    day_of_month?: number;
    /** 季付/年付：1–12 */
    month_of_year?: number;
    time_of_day?: string;
    timezone?: string;
  };
}

interface ConfirmTransactionCardProps {
  data: AIParsedTransaction;
  onConfirm: (edited: AIParsedTransaction, options?: ConfirmRecurringOptions) => void | Promise<void>;
  onClose: () => void;
  isSubmitting?: boolean;
  /** 保存成功后置灰展示，防止重复提交 */
  isSavedSuccess?: boolean;
  /** 当前分类是否由用户历史偏好自动填充，用于在分类旁展示提示图标 */
  categoryFromPreference?: boolean;
  /** 在聊天流内展示（无浮层、无遮罩），与气泡同流 */
  inline?: boolean;
  /** 当 data.currency 为空时使用的默认币种（如用户设置的显示货币），保证弹窗显示稳定 */
  defaultCurrency?: string | null;
  /** 来自「是否记为固定收支」选「是」时，默认勾选固定周期并展开 */
  defaultIsRecurring?: boolean;
}

export default function ConfirmTransactionCard({
  data,
  onConfirm,
  onClose,
  isSubmitting,
  isSavedSuccess = false,
  categoryFromPreference = false,
  inline = false,
  defaultCurrency,
  defaultIsRecurring = false,
}: ConfirmTransactionCardProps) {
  const { resolvedTheme } = useTheme();
  /** 由 chain 决定，不可在卡内切换 */
  const transactionType = data.type === "income" ? "income" : "expense";
  const mainSubMap = transactionType === "income" ? INCOME_MAIN_SUB : EXPENSE_MAIN_SUB;
  const mainCategoryOptions = Object.keys(mainSubMap);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [title, setTitle] = useState("");
  const [merchant, setMerchant] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState<TransactionLocation>(emptyLocation);
  const [note, setNote] = useState("");
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [currencyDropdownRect, setCurrencyDropdownRect] = useState<{ top: number; left: number } | null>(null);
  const currencyTriggerRef = useRef<HTMLButtonElement>(null);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  /** 固定周期：新建时由 defaultIsRecurring 控制，编辑时由 data.recurring 恢复 */
  const dataRecurring = (data as { recurring?: ConfirmRecurringOptions["recurring"] }).recurring;
  const [isRecurring, setIsRecurring] = useState(() => defaultIsRecurring || Boolean(dataRecurring));
  /** 重复间隔：与 RecurringSetupCard 一致；编辑时从 data.recurring 恢复 */
  const defaultRepeat = getDefaultRepeatFromNow();
  const [recurringPeriod, setRecurringPeriod] = useState<RecurringPeriodOption>(() => dataRecurring?.period ?? "monthly");
  const [recurringDayOfWeek, setRecurringDayOfWeek] = useState(() => dataRecurring?.day_of_week ?? defaultRepeat.dayOfWeek);
  const [recurringDayOfMonth, setRecurringDayOfMonth] = useState(() => dataRecurring?.day_of_month ?? defaultRepeat.dayOfMonth);
  const [recurringMonthOfYear, setRecurringMonthOfYear] = useState(() => dataRecurring?.month_of_year ?? defaultRepeat.monthOfYear);
  const [recurringTimeOfDay, setRecurringTimeOfDay] = useState(() => dataRecurring?.time_of_day?.slice(0, 5) ?? "09:00");
  const recurringTimezone = dataRecurring?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const prevRecurringPeriodRef = useRef<RecurringPeriodOption | null>(null);

  useEffect(() => {
    if (prevRecurringPeriodRef.current !== null && prevRecurringPeriodRef.current !== recurringPeriod) {
      const now = getDefaultRepeatFromNow();
      setRecurringDayOfWeek(now.dayOfWeek);
      setRecurringDayOfMonth(now.dayOfMonth);
      setRecurringMonthOfYear(now.monthOfYear);
    }
    prevRecurringPeriodRef.current = recurringPeriod;
  }, [recurringPeriod]);

  useLayoutEffect(() => {
    if (!currencyDropdownOpen || !currencyTriggerRef.current) {
      setCurrencyDropdownRect(null);
      return;
    }
    const rect = currencyTriggerRef.current.getBoundingClientRect();
    setCurrencyDropdownRect({ top: rect.bottom + 4, left: rect.right - 80 });
  }, [currencyDropdownOpen]);

  useEffect(() => {
    if (!currencyDropdownOpen) return;
    const close = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        currencyTriggerRef.current?.contains(target) ||
        currencyDropdownRef.current?.contains(target)
      )
        return;
      setCurrencyDropdownOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [currencyDropdownOpen]);

  useEffect(() => {
    setAmount(Number(data.amount) ? String(Math.abs(Number(data.amount))) : "");
    const dataCur = (data as { currency?: string | null }).currency?.trim().toUpperCase();
    const fallbackCur = (defaultCurrency && String(defaultCurrency).trim().toUpperCase()) || "USD";
    const cur = dataCur && CURRENCY_CODES.includes(dataCur as (typeof CURRENCY_CODES)[number]) ? dataCur : (fallbackCur && CURRENCY_CODES.includes(fallbackCur as (typeof CURRENCY_CODES)[number]) ? fallbackCur : "USD");
    setCurrency(cur);
    const rawSub = (data as { sub_category?: string | null }).sub_category;
    const rawCategory = (data.category ?? "").trim();
    const initialCategory = rawSub
      ? `${rawCategory}${CATEGORY_SUB_SEP}${String(rawSub).trim()}`
      : rawCategory.replace(/\s+/g, " ").replace(/\uFF06/g, "&").replace(/\s+and\s+/gi, " & ");
    const map = data.type === "income" ? INCOME_MAIN_SUB : EXPENSE_MAIN_SUB;
    const mains = Object.keys(map);
    let { main, sub } = rawSub != null && String(rawSub).trim()
      ? { main: rawCategory || "Other", sub: String(rawSub).trim() }
      : parseCategoryMainSub(initialCategory);
    if (!sub && initialCategory && mains.length > 0) {
      const sortedMains = [...mains].sort((a, b) => b.length - a.length);
      const normalizedForMatch = initialCategory.replace(/\s+and\s+/gi, " & ");
      const matched = sortedMains.find(
        (m) => normalizedForMatch.startsWith(m) && normalizedForMatch.length > m.length
      );
      if (matched) {
        const rest = trimLeadingCategorySeparators(initialCategory.slice(matched.length));
        if (rest) {
          main = matched;
          sub = rest;
        }
      }
    }
    if (sub) {
      if (mains.includes(main)) {
        setMainCategory(main);
        setSubCategory(sub);
        setCustomCategory("");
      } else {
        setMainCategory("Other");
        setCustomCategory(initialCategory);
        setSubCategory("");
      }
    } else {
      if (initialCategory && mains.includes(initialCategory)) {
        setMainCategory(initialCategory);
        setSubCategory("");
        setCustomCategory("");
      } else {
        setMainCategory(initialCategory ? "Other" : "");
        setCustomCategory(initialCategory || "");
        setSubCategory("");
      }
    }
    setTitle((data as { title?: string | null }).title ?? data.merchant ?? "");
    setMerchant(data.merchant ?? "");
    setDate(data.date ?? new Date().toISOString().slice(0, 10));
    const hasLocation = data.location && (data.location.country || data.location.city);
    const locationToSet = hasLocation
      ? {
          country: data.location?.country ?? null,
          city: data.location?.city ?? null,
          district: data.location?.district ?? null,
          address: data.location?.address ?? null,
          coordinates: data.location?.coordinates ?? null,
        }
      : defaultLocationForCurrency((data as { currency?: string }).currency);
    setLocation(locationToSet);
    setNote(data.note ?? "");
    // 编辑时从 metadata 恢复固定周期信息
    const rec = (data as { recurring?: ConfirmRecurringOptions["recurring"] }).recurring;
    if (rec) {
      setIsRecurring(true);
      setRecurringPeriod(rec.period);
      const def = getDefaultRepeatFromNow();
      setRecurringDayOfWeek(rec.day_of_week ?? def.dayOfWeek);
      setRecurringDayOfMonth(rec.day_of_month ?? def.dayOfMonth);
      setRecurringMonthOfYear(rec.month_of_year ?? def.monthOfYear);
      setRecurringTimeOfDay(rec.time_of_day?.slice(0, 5) ?? "09:00");
    } else {
      setIsRecurring(defaultIsRecurring);
      const def = getDefaultRepeatFromNow();
      setRecurringPeriod("monthly");
      setRecurringDayOfWeek(def.dayOfWeek);
      setRecurringDayOfMonth(def.dayOfMonth);
      setRecurringMonthOfYear(def.monthOfYear);
      setRecurringTimeOfDay("09:00");
    }
  }, [data, defaultIsRecurring]);

  const categoryLabel = (
    <span className="inline-flex items-center gap-1">
      <span>Category</span>
      {categoryFromPreference && (
        <span
          className="inline-flex items-center text-xs text-text-brand"
          title="Auto-filled from your past choices"
        >
          <span aria-hidden>🧠</span>
        </span>
      )}
    </span>
  );

  const handleSubmit = useCallback(() => {
    const num = parseFloat(amount);
    const absAmount = Number.isFinite(num) ? Math.abs(num) : 0;
    const finalAmount = transactionType === "income" ? absAmount : -absAmount;
    const finalDate = date.trim() || new Date().toISOString().slice(0, 10);
    const hasLocation = [
      location.country,
      location.city,
      location.district,
      location.address,
      location.coordinates,
    ].some(Boolean);
    const finalMain = mainCategory === "Other" ? (customCategory.trim() || "Other") : (mainCategory.trim() || "Other");
    const finalSub = mainCategory !== "Other" && subCategory ? subCategory.trim() || null : null;
    const finalCurrency = CURRENCY_CODES.includes(currency as (typeof CURRENCY_CODES)[number]) ? currency : "USD";
    const edited: AIParsedTransaction = {
      amount: finalAmount,
      type: transactionType,
      currency: finalCurrency,
      category: finalMain,
      sub_category: finalSub,
      merchant: merchant.trim() || null,
      date: finalDate,
      note: note.trim() || null,
      ...(title.trim() ? { title: title.trim().slice(0, 120) } : {}),
      ...(hasLocation ? { location } : {}),
    };
    const options: ConfirmRecurringOptions | undefined = isRecurring
      ? {
          recurring: {
            period: recurringPeriod,
            time_of_day: recurringTimeOfDay || "09:00",
            timezone: recurringTimezone,
            ...(recurringPeriod === "weekly" ? { day_of_week: recurringDayOfWeek } : {}),
            ...(recurringPeriod === "monthly" || recurringPeriod === "quarterly" || recurringPeriod === "yearly"
              ? { day_of_month: recurringDayOfMonth }
              : {}),
            ...(recurringPeriod === "quarterly" || recurringPeriod === "yearly"
              ? { month_of_year: recurringMonthOfYear }
              : {}),
          },
        }
      : undefined;
    onConfirm(edited, options);
  }, [amount, data.type, currency, mainCategory, subCategory, customCategory, title, merchant, date, location, note, isRecurring, recurringPeriod, recurringDayOfWeek, recurringDayOfMonth, recurringMonthOfYear, recurringTimeOfDay, recurringTimezone, onConfirm]);

  const card = (
    <div
      className={
        inline
          ? "flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-border-default bg-chat-card-inner"
          : "flex max-h-[90vh] w-full min-w-0 max-w-2xl flex-col overflow-hidden rounded-2xl border border-border-default bg-chat-card-inner shadow-xl"
      }
      style={{ backgroundColor: resolvedTheme === "light" ? "#ffffff" : "#171717" }}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <Receipt size={18} className={transactionType === "income" ? "text-status-success" : "text-text-brand"} />
            <span className="text-sm font-medium text-text-primary">
              {transactionType === "income" ? "Confirm Income" : "Confirm Expense"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
      </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-3 overflow-y-auto p-4 sm:grid-cols-2 sm:p-5">
          <div className="sm:col-span-2">
            <Field label="Amount">
            <div className="flex items-stretch rounded-lg border border-input-border bg-chat-card-inner overflow-hidden">
              <FormInput
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="0.00"
                className="flex-1 min-w-0 bg-transparent border-0"
                aria-label="Amount"
              />
              <div className="shrink-0 flex items-center border-l border-input-border">
                <button
                  ref={currencyTriggerRef}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrencyDropdownOpen((v) => !v);
                  }}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-text-primary hover:bg-surface-hover transition-colors"
                  aria-label="Currency"
                  aria-expanded={currencyDropdownOpen}
                >
                  <span>{CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS]} {currency}</span>
                  <ChevronDown size={14} className="opacity-70" />
                </button>
              </div>
            </div>
            {currencyDropdownOpen &&
              currencyDropdownRect &&
              typeof document !== "undefined" &&
              createPortal(
                <div
                  ref={currencyDropdownRef}
                  className="fixed z-[100] min-w-[80px] rounded-lg border border-white/10 bg-chat-bg shadow-lg py-1 max-h-48 overflow-y-auto"
                  style={{ top: currencyDropdownRect.top, left: currencyDropdownRect.left, backgroundColor: "var(--color-chat-bg, #212121)" }}
                >
                  <ul>
                    {CURRENCY_CODES.map((code) => (
                      <li key={code}>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrency(code);
                            setCurrencyDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                        >
                          {CURRENCY_SYMBOLS[code]} {code}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>,
                document.body
              )}
            </Field>
          </div>

          <Field label="Record title">
            <FormInput
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lunch, Coffee (shown in list)"
              aria-label="Record title"
              maxLength={120}
            />
          </Field>

          <Field label="Merchant">
            <FormInput
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Starbucks"
            />
          </Field>

          <div className="sm:col-span-2">
            <TransactionCategoryFields
              label={categoryLabel}
              mainCategory={mainCategory}
              subCategory={subCategory}
              customCategory={customCategory}
              mainCategoryOptions={mainCategoryOptions}
              mainSubMap={mainSubMap}
              onMainCategoryChange={(value) => {
                setMainCategory(value);
                setSubCategory("");
              }}
              onSubCategoryChange={setSubCategory}
              onCustomCategoryChange={setCustomCategory}
            />
          </div>

          <div className="sm:col-span-2">
            <Field label="Date">
              <FormInput
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="[&::-webkit-calendar-picker-indicator]:invert"
              />
            </Field>
          </div>

          {/* 所有分类均显示：固定周期勾选，勾选后展开 Repeat interval（与 RecurringSetupCard 一致） */}
          <div className={`space-y-3 sm:col-span-2 ${isRecurring ? "rounded-lg border border-border-default bg-chat-card-outer p-3" : ""}`}>
            <label className="flex w-fit cursor-pointer items-center gap-2">
              <FormCheckbox
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
              <span className="text-sm text-text-primary">
                {transactionType === "income" ? "Fixed recurring income" : "Fixed recurring expense"}
              </span>
            </label>
              {isRecurring && (
                <div className="space-y-2">
                  <span className="text-xs text-text-secondary flex items-center gap-1.5">
                    <Calendar size={12} aria-hidden />
                    Repeat interval
                  </span>
                  <FormSelect
                    value={recurringPeriod}
                    onChange={(e) => setRecurringPeriod(e.target.value as RecurringPeriodOption)}
                    aria-label="Repeat interval"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </FormSelect>
                  {recurringPeriod === "weekly" && (
                    <>
                      <label className="block text-xs text-text-secondary">Repeat on weekday</label>
                      <FormSelect
                        value={recurringDayOfWeek}
                        onChange={(e) => setRecurringDayOfWeek(Number(e.target.value))}
                        aria-label="Day of week"
                      >
                        {WEEKDAY_LABELS.map((label, i) => (
                          <option key={i} value={i}>{label}</option>
                        ))}
                      </FormSelect>
                    </>
                  )}
                  {recurringPeriod === "monthly" && (
                    <>
                      <label className="block text-xs text-text-secondary">Repeat on day of month</label>
                      <FormSelect
                        value={recurringDayOfMonth}
                        onChange={(e) => setRecurringDayOfMonth(Number(e.target.value))}
                        aria-label="Day of month"
                      >
                        {DAYS_OF_MONTH.map((d) => (
                          <option key={d} value={d}>{daySuffix(d)}</option>
                        ))}
                      </FormSelect>
                    </>
                  )}
                  {(recurringPeriod === "quarterly" || recurringPeriod === "yearly") && (
                    <>
                      <label className="block text-xs text-text-secondary">Month</label>
                      <FormSelect
                        value={recurringMonthOfYear}
                        onChange={(e) => setRecurringMonthOfYear(Number(e.target.value))}
                        aria-label="Month"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                          <option key={m} value={m}>{MONTH_LABELS[m]}</option>
                        ))}
                      </FormSelect>
                      <label className="block text-xs text-text-secondary">Day of month</label>
                      <FormSelect
                        value={recurringDayOfMonth}
                        onChange={(e) => setRecurringDayOfMonth(Number(e.target.value))}
                        aria-label="Day of month"
                      >
                        {DAYS_OF_MONTH.map((d) => (
                          <option key={d} value={d}>{daySuffix(d)}</option>
                        ))}
                      </FormSelect>
                    </>
                  )}
                  <label className="block text-xs text-text-secondary">Record at ({dataRecurring?.timezone ?? "your timezone"})</label>
                  <FormInput
                    type="time"
                    value={recurringTimeOfDay}
                    onChange={(e) => setRecurringTimeOfDay(e.target.value)}
                    aria-label="Record time"
                  />
                </div>
              )}
          </div>

          <div className="sm:col-span-2">
            <LocationInput value={location} onChange={setLocation} autoRequestLocation />
          </div>

          <div className="sm:col-span-2">
            <Field label="Note">
            <FormTextarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional"
              rows={2}
              className="resize-none"
            />
            </Field>
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t border-white/10 shrink-0">
          {isSavedSuccess ? (
            <div className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-status-success/40 bg-status-success/10 py-2.5 text-sm font-medium text-status-success">
              <Check size={16} />
              Saved
            </div>
          ) : (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-3 py-2.5 rounded-xl border border-border-default text-text-primary text-sm font-medium hover:bg-surface-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex min-h-10 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-action-border bg-action-primary px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Saving…"
                ) : (
                  <>
                    <Check size={16} />
                    Confirm & Save
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
  );

  const wrappedCard = (
    <div className={isSavedSuccess ? "opacity-70 pointer-events-none" : undefined}>
      {card}
    </div>
  );

  if (inline) return wrappedCard;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      {wrappedCard}
    </div>
  );
}

function Field({
  label,
  children,
  uncertain,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  uncertain?: boolean;
}) {
  return (
    <div className={`space-y-1.5 ${uncertain ? "field-uncertain rounded-lg" : ""}`}>
      <label className="block text-xs text-text-secondary">{label}</label>
      {children}
    </div>
  );
}
