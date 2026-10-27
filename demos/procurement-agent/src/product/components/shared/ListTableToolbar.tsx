import { Download, RefreshCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { FilterBarContext } from '@/lib/filterBarContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SearchInput, type SearchInputProps } from '@/components/shared/SearchInput';

export type ListTableToolbarProps = {
  className?: string;
  searchProps: SearchInputProps;
  /** 搜索框左侧内容（如列表状态 Tabs） */
  beforeSearch?: ReactNode;
  /** 搜索框右侧附加筛选（如品类下拉） */
  afterSearch?: ReactNode;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onDownload?: () => void;
  downloadDisabled?: boolean;
  downloadLabel?: string;
};

/** 列表表格顶栏：左侧搜索 + 右侧刷新/下载（Figma 29:8961） */
export function ListTableToolbar({
  className,
  searchProps,
  beforeSearch,
  afterSearch,
  onRefresh,
  isRefreshing = false,
  onDownload,
  downloadDisabled = false,
  downloadLabel = '下载',
}: ListTableToolbarProps) {
  return (
    <FilterBarContext.Provider value>
      <div
        className={cn(
          'list-table-toolbar flex items-center gap-3 px-4 py-3',
          className,
        )}
      >
        {beforeSearch}
        <SearchInput {...searchProps} />
        {afterSearch}
        {(onRefresh || onDownload) && (
          <div className="ml-auto flex shrink-0 items-center gap-3">
            {onRefresh && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-foreground"
                onClick={onRefresh}
                disabled={isRefreshing}
                aria-label="刷新"
                title="刷新"
              >
                <RefreshCcw
                  className={cn('size-5', isRefreshing && 'animate-spin')}
                  aria-hidden
                />
              </Button>
            )}
            {onDownload && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-foreground"
                onClick={onDownload}
                disabled={downloadDisabled}
                aria-label={downloadLabel}
                title={downloadLabel}
              >
                <Download className="size-5" aria-hidden />
              </Button>
            )}
          </div>
        )}
      </div>
    </FilterBarContext.Provider>
  );
}
