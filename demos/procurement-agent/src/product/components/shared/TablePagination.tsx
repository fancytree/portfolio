import type { ReactNode } from 'react';
import { Select } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

export type TablePaginationProps = {
  locale?: 'zh' | 'en';
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** 左侧摘要（如「共 N 条」） */
  summary?: ReactNode;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  className?: string;
};

/** 生成页码序列（含省略号） */
function buildPageRange(page: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const items: (number | 'ellipsis')[] = [1];
  if (page > 3) items.push('ellipsis');
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let i = start; i <= end; i += 1) items.push(i);
  if (page < totalPages - 2) items.push('ellipsis');
  if (totalPages > 1) items.push(totalPages);
  return items;
}

function goToPage(
  e: React.MouseEvent<HTMLAnchorElement>,
  nextPage: number,
  totalPages: number,
  onPageChange: (page: number) => void,
) {
  e.preventDefault();
  const clamped = Math.min(Math.max(1, nextPage), totalPages);
  onPageChange(clamped);
}

/**
 * 表格底部分页（基于 shadcn Pagination）
 */
export default function TablePagination({
  locale = 'zh',
  page,
  totalPages,
  onPageChange,
  summary,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  className,
}: TablePaginationProps) {
  const safeTotal = Math.max(1, totalPages);
  const pageRange = buildPageRange(page, safeTotal);
  const canPrev = page > 1;
  const canNext = page < safeTotal;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3',
        summary ? 'justify-between' : 'justify-end',
        className,
      )}
    >
      {summary ? <div className="text-xs text-muted-foreground">{summary}</div> : null}

      <div className="flex flex-wrap items-center gap-3">
        {pageSize != null && pageSizeOptions && onPageSizeChange ? (
          <>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{locale==='en'?'Rows per page':'每页'}</span>
              <Select
                ariaLabel={locale==='en'?'Rows per page':'每页条数'}
                value={String(pageSize)}
                onValueChange={(v) => onPageSizeChange(Number(v))}
                size="sm"
                className="w-16"
                options={pageSizeOptions.map((n) => ({
                  value: String(n),
                  label: String(n),
                }))}
              />
              {locale==='zh'&&<span>条</span>}
            </div>
            <span className="text-muted-foreground/60">|</span>
          </>
        ) : null}

        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text={locale==='en'?'Previous':'上一页'}
                aria-disabled={!canPrev || undefined}
                tabIndex={canPrev ? undefined : -1}
                className={cn(!canPrev && 'pointer-events-none opacity-50')}
                onClick={(e) => goToPage(e, page - 1, safeTotal, onPageChange)}
              />
            </PaginationItem>

            {pageRange.map((item, idx) =>
              item === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    href="#"
                    isActive={item === page}
                    onClick={(e) => goToPage(e, item, safeTotal, onPageChange)}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                text={locale==='en'?'Next':'下一页'}
                aria-disabled={!canNext || undefined}
                tabIndex={canNext ? undefined : -1}
                className={cn(!canNext && 'pointer-events-none opacity-50')}
                onClick={(e) => goToPage(e, page + 1, safeTotal, onPageChange)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
