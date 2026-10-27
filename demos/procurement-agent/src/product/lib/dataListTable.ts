import { cn } from '@/lib/utils';
import { TABLE_STICKY_COL } from '@/components/ui/table';

export type DataListStickySlot = keyof typeof TABLE_STICKY_COL;

/** 业务列表表头/单元格：固定列 class（配合 Table stickyLayout + stickyLeads） */
export function dataListStickyCol(
  slot: DataListStickySlot,
  extra?: string,
): string {
  return cn(TABLE_STICKY_COL[slot], extra);
}
