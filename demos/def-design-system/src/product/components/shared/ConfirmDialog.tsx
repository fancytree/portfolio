// ============================================================
// ConfirmDialog — 旧业务调用兼容封装；新代码直接组合 ui/dialog。
// ============================================================
// 确认按钮用普通 Button，避免异步操作时弹窗被提前关掉。

import type { ComponentProps, ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  cancelLabel?: string;
  confirmLabel: ReactNode;
  confirmPendingLabel?: ReactNode;
  confirmVariant?: ComponentProps<typeof Button>['variant'];
  pending?: boolean;
  confirmDisabled?: boolean;
  /** 为 false 时只显示取消（例如删除被业务规则拦住） */
  showConfirm?: boolean;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelLabel = 'Cancel',
  confirmLabel,
  confirmPendingLabel,
  confirmVariant = 'default',
  pending = false,
  confirmDisabled = false,
  showConfirm = true,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next && pending) return;
        onOpenChange(next);
      }}
    >
      <AlertDialogContent className="gap-5 p-5">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description != null && description !== false ? (
            typeof description === 'string' || typeof description === 'number' ? (
              <AlertDialogDescription>{description}</AlertDialogDescription>
            ) : (
              <AlertDialogDescription asChild>
                <div className="text-sm text-muted-foreground">{description}</div>
              </AlertDialogDescription>
            )
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-1">
          <AlertDialogCancel disabled={pending}>
            {cancelLabel}
          </AlertDialogCancel>
          {showConfirm ? (
            <Button
              type="button"
              variant={confirmVariant}
              disabled={pending || confirmDisabled}
              onClick={onConfirm}
            >
              {pending ? (confirmPendingLabel ?? confirmLabel) : confirmLabel}
            </Button>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
