import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 清理 task 名称中自动生成的时间后缀
 * 例：`Ranking 4/17/2026, 4:36:21 PM` → `Ranking 4/17/2026`
 */
export function cleanTaskName(name: string): string {
  if (!name) return name
  return name.replace(/,\s*\d{1,2}:\d{2}:\d{2}\s*(AM|PM)?/i, '').trim()
}
