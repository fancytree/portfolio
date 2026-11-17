import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

/**
 * 表单弹窗 pattern：标题栏和操作栏固定，只有中间内容滚动。
 * - 标题栏：标题 + 一行上下文（客户、金额等）+ 关闭按钮，内容再长也不会滚出去。
 * - 操作栏：左侧放一句状态（如“€0.00 owed”），右侧次级 + 主按钮，两个按钮等宽等高。
 * - 高度不超过视口的 85%，内容少时随内容收缩。
 */
export function FormDialog({ open, onOpenChange, title, description, children, status, cancelLabel = 'Cancel', confirmLabel, onConfirm, confirmDisabled, className = 'sm:max-w-xl' }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  status?: React.ReactNode;
  cancelLabel?: string;
  confirmLabel: string;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  className?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} onOpenAutoFocus={(e) => e.preventDefault()}
        className={'flex max-h-[85vh] flex-col gap-0 overflow-hidden rounded-2xl p-0 ring-0 shadow-[0_24px_64px_-16px_rgb(16_24_40/0.3),0_0_0_1px_rgb(16_24_40/0.06)] ' + className}>
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 pb-4 pt-5">
          <div className="min-w-0">
            <DialogTitle className="text-lg font-semibold tracking-[-0.01em]">{title}</DialogTitle>
            {description && <DialogDescription className="mt-1 truncate text-sm text-muted-foreground">{description}</DialogDescription>}
          </div>
          <DialogClose className="-mr-2 -mt-1 grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Close"><X className="size-4" /></DialogClose>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-border bg-surface-sunken px-6 py-3.5">
          <div className="min-w-0 truncate text-sm text-muted-foreground">{status}</div>
          <div className="flex shrink-0 gap-2.5">
            <DialogClose asChild><Button variant="outline" size="lg" className="min-w-28">{cancelLabel}</Button></DialogClose>
            <Button size="lg" className="min-w-28" disabled={confirmDisabled} onClick={onConfirm}>{confirmLabel}</Button>
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
}

/** 表单弹窗里的一段：标题 + 右侧控件（如开关），下面是内容。段与段之间用分隔线。 */
export function FormSection({ title, hint, control, children }: { title: string; hint?: React.ReactNode; control?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="border-b border-border py-5 first:pt-0 last:border-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0"><h3 className="text-sm font-semibold">{title}</h3>{hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}</div>
        {control && <div className="shrink-0">{control}</div>}
      </div>
      {children && <div className="mt-3.5">{children}</div>}
    </section>
  );
}
