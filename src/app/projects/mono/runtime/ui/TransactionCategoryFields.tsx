"use client";

import type { ReactNode } from "react";
import { FormInput, FormSelect } from "./FormControls";

interface TransactionCategoryFieldsProps {
  label: ReactNode;
  mainCategory: string;
  subCategory: string;
  customCategory: string;
  mainCategoryOptions: string[];
  mainSubMap: Record<string, string[]>;
  onMainCategoryChange: (value: string) => void;
  onSubCategoryChange: (value: string) => void;
  onCustomCategoryChange: (value: string) => void;
}

/** Shared main/subcategory fields for transaction confirmation and recurring setup. */
export default function TransactionCategoryFields({
  label,
  mainCategory,
  subCategory,
  customCategory,
  mainCategoryOptions,
  mainSubMap,
  onMainCategoryChange,
  onSubCategoryChange,
  onCustomCategoryChange,
}: TransactionCategoryFieldsProps) {
  return (
    <div className="min-w-0 space-y-1.5">
      <span className="block text-xs text-text-secondary">{label}</span>
      <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="relative min-w-0">
          <FormSelect
            value={mainCategory}
            onChange={(event) => onMainCategoryChange(event.target.value)}
            className="appearance-none"
            aria-label="Main category"
          >
            <option value="">Select main category</option>
            {mainCategoryOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </FormSelect>
        </div>
        {mainCategory && mainCategory !== "Other" && (
          <FormInput
            type="text"
            value={subCategory}
            onChange={(event) => onSubCategoryChange(event.target.value)}
            placeholder={
              (mainSubMap[mainCategory]?.length ?? 0) > 0
                ? `e.g. ${(mainSubMap[mainCategory] ?? []).slice(0, 3).join(", ")} or any`
                : "Sub category (optional)"
            }
            aria-label="Sub category"
          />
        )}
      </div>
      {mainCategory === "Other" && (
        <FormInput
          type="text"
          value={customCategory}
          onChange={(event) => onCustomCategoryChange(event.target.value)}
          placeholder="Type your category"
          aria-label="Custom category"
        />
      )}
    </div>
  );
}
