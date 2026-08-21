import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
  type UIEvent,
} from 'react';

import {
  AlertTriangleIcon,
  BanIcon,
  BotIcon,
  CheckIcon,
  ChevronRightIcon,
  CircleDashedIcon,
  ClipboardListIcon,
  DownloadIcon,
  EyeIcon,
  ExternalLinkIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  LineChartIcon,
  Loader2Icon,
  MessageSquareTextIcon,
  PackageCheckIcon,
  PaperclipIcon,
  PauseIcon,
  PencilIcon,
  PlayIcon,
  ScaleIcon,
  ShoppingCartIcon,
  UserIcon,
  XIcon,
} from 'lucide-react';
import SelectField from '@/components/SelectField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { dataListStickyCol } from '@/lib/dataListTable';
import { cn } from '@/lib/utils';
import { PORTFOLIO_COPY } from './portfolioDemoCopy';
import {
  DEMO_COVERAGE_DAYS,
  DEMO_OPERATORS,
  MNP_SUPPLIER_RULES,
  PHASES,
  defaultExpectedArrivalDate,
  goodsTotal,
  groupDemoLinesBySpu,
  groupReceivingLinesBySpu,
  hasInvoiceAttachment,
  hasUnresolvedHold,
  isActualDiffersDdt,
  isDdtOverVsOrder,
  isDdtShortVsOrder,
  lineHasConfirmationGap,
  nowLocalDateTimeValue,
  openOrderedOf,
  outcomeForReceivingLine,
  receiptBatchConfirmedAt,
  summarizeReceiptBatch,
  type MarkOrderMeta,
  type PoProgressKey,
} from './portfolioDemoScript';
import type {
  ConfirmationRound,
  DemoLine,
  DemoProgress,
  DemoStageId,
  DemoState,
  IntakeDraft,
  NegotiationNote,
  OrderAttachment,
  ReceiptBatchSnapshot,
  ReceivingLine,
  RemainingReceiptDecision,
} from './portfolioDemoTypes';

/** 操作栏默认高度（h-10 + py-3）；实际以 ResizeObserver 为准 */
const PORTFOLIO_ACTION_BAR_H = 65;
/** main 上下内边距：px-3/pt-3=12，md:p-4=16（与库存总览 -top-3 对齐） */
function useMainPadY() {
  const [padY, setPadY] = useState(12);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setPadY(mq.matches ? 16 : 12);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return padY;
}

/** 操作栏高度 + 表格叠在其下的 sticky top（已扣 main 内边距） */
function useActionBarStickyHeight() {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(PORTFOLIO_ACTION_BAR_H);
  const padY = useMainPadY();
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const update = () => setHeight(Math.ceil(el.getBoundingClientRect().height));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  // 操作栏 sticky -top-* 抵消 main padding 后，下级 sticky 的 top = height - padY
  const stickTop = Math.max(0, height - padY);
  return { ref, height, stickTop, padY };
}

/** 操作栏：吸顶固定（-top 抵消 main 内边距，避免顶缝） */
function CanvasActionBar({
  barRef,
  children,
}: {
  barRef?: Ref<HTMLDivElement>;
  children: ReactNode;
}) {
  return (
    <div
      ref={barRef}
      className="sticky -top-3 z-40 flex flex-wrap items-center justify-between gap-2 border-b border-[#eef0f4] bg-white px-6 py-3 md:-top-4"
    >
      {children}
    </div>
  );
}

/** 检测 sticky 是否已吸顶：未吸顶可保留圆角，吸顶后改直角避免透缝 */
function useStickyStuck(stickTop: number) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;

    let root: Element | null = null;
    let node: HTMLElement | null = sentinel.parentElement;
    while (node) {
      const oy = getComputedStyle(node).overflowY;
      if (oy === 'auto' || oy === 'scroll' || oy === 'overlay') {
        root = node;
        break;
      }
      node = node.parentElement;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStuck(!entry.isIntersecting);
      },
      {
        root,
        // 哨兵滚过 sticky top 线 → 已吸顶
        rootMargin: `-${Math.max(0, Math.round(stickTop)) + 1}px 0px 0px 0px`,
        threshold: 0,
      },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [stickTop]);

  return { sentinelRef, stuck };
}

type Props = {
  state: DemoState;
  onUpdateEstQty: (sku: string, qty: number) => void;
  onUpdateConfQty: (sku: string, qty: number) => void;
  onUpdateEstPrice: (sku: string, price: number) => void;
  onUpdateConfPrice: (sku: string, price: number | null) => void;
  onDeleteSku: (sku: string) => void;
  onDeleteSpu: (productId: string) => void;
  onExport: (format: 'xlsx' | 'pdf') => void;
  onDownloadAttachment: (attachment: OrderAttachment) => void;
  onAddNegotiationNote: (text: string, actor?: NegotiationNote['actor']) => void;
  onUploadConfirmation: () => void;
  /** 已下单后上传供应商发票 */
  onUploadInvoice: () => void;
  /** 补货计划：直接 Approve */
  onApproveDirect: () => void;
  /** 补货计划：推给 Owner */
  onPushToOwner: () => void;
  /** 点开 Approve 弹窗时关掉当前引导 */
  onApproveClick?: () => void;
  /** Mark as ordered：填写下单时间 / 操作人 / 预计到货 */
  onMarkOrdered: (meta: MarkOrderMeta) => void;
  /** Owner 页：Approve */
  onApprove: () => void;
  onUploadDdt: () => void;
  onHandleRemaining: (decision: RemainingReceiptDecision) => void;
  onUpdateCounted: (sku: string, qty: number) => void;
  onSetDisposition: (sku: string, disposition: ReceivingLine['disposition']) => void;
  onConfirmReceipt: () => void;
  onLearning: (decision: 'accepted' | 'dismissed') => void;
  onAskAgent: (text: string) => void;
  onRenameTitle: (title: string) => void;
  /** Intake 流程图跳转 STAGE（可选） */
  onGoStage?: (stage: DemoStageId) => void;
};

function SoftBadge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: 'neutral' | 'warm' | 'blue' | 'green' | 'danger';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium',
        tone === 'neutral' && 'bg-[#f1f3f7] text-[#5c6478]',
        tone === 'warm' && 'bg-[#ffe8d6] text-[#b35b1f]',
        tone === 'blue' && 'bg-[#e8f1ff] text-[#2f6bff]',
        tone === 'green' && 'bg-[#e5f6ee] text-[#1f8a57]',
        tone === 'danger' && 'bg-[#fdecec] text-[#c23b3b]',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** 无附件时禁用并显示 (0)；有附件时显示数量 */
function ViewAttachmentsButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  const empty = count === 0;
  return (
    <Button
      type="button"
      variant="outline"
      className="h-10 rounded-xl"
      disabled={empty}
      onClick={onClick}
    >
      <PaperclipIcon className="size-3.5" />
      {PORTFOLIO_COPY.viewAttachments}
      <span
        className={cn(
          'rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
          empty ? 'bg-[#eef0f4] text-[#8b93a7]' : 'bg-[#eef4ff] text-[#2f6bff]',
        )}
      >
        ({count})
      </span>
    </Button>
  );
}

/** 谈价记录入口：两边共用，无记录时显示 (0) 并禁用 */
function ViewNegotiationLogButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  const empty = count === 0;
  return (
    <Button
      type="button"
      variant="outline"
      className="h-10 rounded-xl"
      disabled={empty}
      onClick={onClick}
    >
      <MessageSquareTextIcon className="size-3.5" />
      {PORTFOLIO_COPY.viewNegotiationLog}
      <span
        className={cn(
          'rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
          empty ? 'bg-[#eef0f4] text-[#8b93a7]' : 'bg-[#eef4ff] text-[#2f6bff]',
        )}
      >
        ({count})
      </span>
    </Button>
  );
}

/** 补货计划 Approve：选择直接批准或推给 Owner */
function ApproveChoiceDialog({
  open,
  onOpenChange,
  onApproveDirect,
  onPushToOwner,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApproveDirect: () => void;
  onPushToOwner: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{PORTFOLIO_COPY.approveDialogTitle}</DialogTitle>
          <DialogDescription>{PORTFOLIO_COPY.approveDialogHint}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <button
            type="button"
            className="rounded-2xl border border-[#e8eaef] px-4 py-3 text-left transition-colors hover:border-[#2f6bff] hover:bg-[#f7f9ff]"
            onClick={() => {
              onOpenChange(false);
              onApproveDirect();
            }}
          >
            <p className="text-[14px] font-semibold text-[#1a1d26]">{PORTFOLIO_COPY.approveDirect}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-[#5c6478]">{PORTFOLIO_COPY.approveDirectHint}</p>
          </button>
          <button
            type="button"
            className="rounded-2xl border border-[#e8eaef] px-4 py-3 text-left transition-colors hover:border-[#b35b1f] hover:bg-[#fff6ee]"
            onClick={() => {
              onOpenChange(false);
              onPushToOwner();
            }}
          >
            <p className="text-[14px] font-semibold text-[#1a1d26]">{PORTFOLIO_COPY.approvePushOwner}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-[#5c6478]">{PORTFOLIO_COPY.approvePushOwnerHint}</p>
          </button>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Mark as ordered：下单时间 / 操作人 / 预计到货（对齐 PoDetail 确认下单） */
function MarkOrderedDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (meta: MarkOrderMeta) => void;
}) {
  const leadDays = MNP_SUPPLIER_RULES.leadTimeMedianDays;
  const [orderAt, setOrderAt] = useState(nowLocalDateTimeValue);
  const [operatorId, setOperatorId] = useState('');
  const [expectedArrival, setExpectedArrival] = useState(() => defaultExpectedArrivalDate(leadDays));
  const [showRequiredHint, setShowRequiredHint] = useState(false);

  useEffect(() => {
    if (!open) return;
    setOrderAt(nowLocalDateTimeValue());
    setOperatorId('');
    setExpectedArrival(defaultExpectedArrivalDate(leadDays));
    setShowRequiredHint(false);
  }, [open, leadDays]);

  const selectedOperator = DEMO_OPERATORS.find((op) => op.id === operatorId) ?? null;
  const metaReady = Boolean(orderAt.trim() && selectedOperator && expectedArrival.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{PORTFOLIO_COPY.markOrderedDialogTitle}</DialogTitle>
          <DialogDescription>{PORTFOLIO_COPY.markOrderedDialogHint}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="mark-order-at">
              {PORTFOLIO_COPY.markOrderedOrderAt} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="mark-order-at"
              type="datetime-local"
              value={orderAt}
              onChange={(event) => setOrderAt(event.target.value)}
              className="h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mark-operator">
              {PORTFOLIO_COPY.markOrderedOperator} <span className="text-destructive">*</span>
            </Label>
            <SelectField
              id="mark-operator"
              value={operatorId}
              onValueChange={setOperatorId}
              placeholder={PORTFOLIO_COPY.markOrderedOperatorPlaceholder}
              className="w-full"
              triggerClassName="h-10 rounded-xl"
              options={DEMO_OPERATORS.map((op) => ({
                value: op.id,
                label: `${op.name} · ${op.role}`,
              }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mark-expected-arrival">
              {PORTFOLIO_COPY.markOrderedExpectedArrival} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="mark-expected-arrival"
              type="date"
              value={expectedArrival}
              onChange={(event) => setExpectedArrival(event.target.value)}
              className="h-10 rounded-xl"
            />
            <p className="text-[11px] leading-relaxed text-[#8b93a7]">
              {PORTFOLIO_COPY.markOrderedExpectedArrivalHint(leadDays)}
            </p>
          </div>
          {showRequiredHint && !metaReady ? (
            <p className="text-[12px] text-[#c23b3b]">{PORTFOLIO_COPY.markOrderedFieldsRequired}</p>
          ) : null}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded-xl bg-[#2f6bff] hover:bg-[#2458d9]"
            onClick={() => {
              if (!metaReady || !selectedOperator) {
                setShowRequiredHint(true);
                return;
              }
              onOpenChange(false);
              onConfirm({
                orderAt: orderAt.trim(),
                orderedBy: `${selectedOperator.name} · ${selectedOperator.role}`,
                expectedArrival: expectedArrival.trim(),
              });
            }}
          >
            {PORTFOLIO_COPY.markOrderedConfirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type PoStepVisual = 'done' | 'pending' | 'partial';

/** 部分到货：左半实心 + 外圈虚线，表示 Received 未完成 */
function PartialCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <circle
        cx="8"
        cy="8"
        r="5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeDasharray="2.2 1.8"
      />
      <path d="M8 2.5a5.5 5.5 0 0 1 0 11Z" fill="currentColor" />
    </svg>
  );
}

function PoStepIcon({ state }: { state: PoStepVisual }) {
  if (state === 'done') {
    return <CheckIcon className="size-3.5 shrink-0" strokeWidth={2.5} />;
  }
  if (state === 'partial') {
    return <PartialCircleIcon className="size-3.5 shrink-0" />;
  }
  return <CircleDashedIcon className="size-3.5 shrink-0" strokeWidth={1.75} />;
}

/** 对齐 PoDetail：首批不带序号，其后 DDT2 / Actual2 */
function receiptBatchColLabel(kind: 'DDT' | 'Actual', labelIndex: number) {
  return labelIndex <= 1 ? kind : `${kind}${labelIndex}`;
}

type ReceiptBatchCol = {
  key: string;
  batchNo: number;
  labelIndex: number;
  mode: 'confirmed' | 'current';
};

/** 对齐 PoDetail 流程：编辑 → 已下单 → 已入库；图标：check / 虚线圆 / 部分圆 */
function PoProgressBar({ current }: { current: PoProgressKey }) {
  const steps: Array<{ key: 'draft' | 'ordered' | 'received'; label: string }> = [
    { key: 'draft', label: PORTFOLIO_COPY.poProgressEdit },
    { key: 'ordered', label: PORTFOLIO_COPY.poProgressOrdered },
    { key: 'received', label: PORTFOLIO_COPY.poProgressReceived },
  ];

  // draft：全虚线；ordered：Edit+Ordered 勾选；partial：Received 半圆；received：全勾选
  const doneThrough =
    current === 'draft' ? -1
      : current === 'received' ? 2
        : 1; // ordered | partial

  return (
    <div className="flex flex-wrap items-center gap-2 text-[12px]">
      {steps.map((step, index) => {
        const state: PoStepVisual =
          step.key === 'received' && current === 'partial'
            ? 'partial'
            : index <= doneThrough
              ? 'done'
              : 'pending';
        // 统一蓝色：完成/进行中用蓝，未到节点用灰
        const tone = state === 'pending' ? 'text-[#8b93a7]' : 'text-[#2f6bff]';

        return (
          <div key={step.key} className="flex items-center gap-2">
            <span className={cn('inline-flex items-center gap-1.5', tone)}>
              <PoStepIcon state={state} />
              <span className="font-medium">{step.label}</span>
            </span>
            {index < steps.length - 1 ? (
              <span className="text-[#c0c6d4]" aria-hidden>›</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}


/** intake 固定开场标题；其余阶段共用同一订货单标题（可编辑） */
function resolveDocumentTitle(stage: DemoStageId, documentTitle: string | null) {
  if (stage === 'intake') return PORTFOLIO_COPY.intakeTitle;
  return documentTitle?.trim() || PORTFOLIO_COPY.orderDocumentTitle;
}

/**
 * 左侧：可编辑业务标题 + PO 生命周期进度
 * 右侧：采购单号（小号）在供应规则上方
 */
/**
 * 滚动在上层 main（整卡上移）；此处只铺内容。
 * 表格标题栏 sticky top-0 相对 main 吸顶。
 */
function CanvasScrollShell({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <>
      {children}
      {footer ?? null}
    </>
  );
}

function CanvasHeader({
  title,
  poProgress,
  titleEditable = true,
  onTitleChange,
  meta,
}: {
  title: string;
  poProgress: PoProgressKey;
  titleEditable?: boolean;
  onTitleChange?: (title: string) => void;
  meta?: ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);

  useEffect(() => {
    if (!editing) setDraftTitle(title);
  }, [title, editing]);

  const commitTitle = () => {
    const next = draftTitle.trim();
    if (next && next !== title) onTitleChange?.(next);
    setEditing(false);
  };

  return (
    <header className="flex flex-wrap items-start justify-between gap-3 rounded-t-2xl border-b border-[#eef0f4] px-6 py-5">
      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="min-w-0">
          {editing && titleEditable && onTitleChange ? (
            <div className="flex max-w-xl flex-wrap items-center gap-2">
              <Input
                value={draftTitle}
                autoFocus
                onChange={(event) => setDraftTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    commitTitle();
                  }
                  if (event.key === 'Escape') {
                    setDraftTitle(title);
                    setEditing(false);
                  }
                }}
                className="h-10 min-w-[16rem] flex-1 rounded-xl text-[16px] font-semibold"
                aria-label={PORTFOLIO_COPY.editTitle}
              />
              <Button
                type="button"
                size="sm"
                className="h-9 rounded-xl bg-[#2f6bff] hover:bg-[#2458d9]"
                onClick={commitTitle}
              >
                <CheckIcon className="size-3.5" />
                {PORTFOLIO_COPY.saveTitle}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-9 rounded-xl"
                onClick={() => {
                  setDraftTitle(title);
                  setEditing(false);
                }}
              >
                <XIcon className="size-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex min-w-0 items-start gap-2">
              <h1 className="min-w-0 text-[22px] font-semibold tracking-tight text-[#1a1d26]">
                {title}
              </h1>
              {titleEditable && onTitleChange ? (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="mt-1 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#8b93a7] transition-colors hover:bg-[#f3f7ff] hover:text-[#2f6bff]"
                  aria-label={PORTFOLIO_COPY.editTitle}
                  title={PORTFOLIO_COPY.editTitle}
                >
                  <PencilIcon className="size-3.5" />
                </button>
              ) : null}
            </div>
          )}
        </div>
        <PoProgressBar current={poProgress} />
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2 pt-0.5 text-right">
        <div>
          <p className="font-mono text-[12px] font-medium tabular-nums text-[#5c6478]">
            {PORTFOLIO_COPY.poNo}
          </p>
          <p className="mt-0.5 text-[11px] text-[#8b93a7]">{PORTFOLIO_COPY.poSupplierMeta}</p>
        </div>
        {meta ? <div>{meta}</div> : null}
      </div>
    </header>
  );
}

function SupplierRulesLink({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="inline-flex cursor-pointer items-center gap-1.5 text-[12px] font-medium text-[#2f6bff] underline-offset-4 hover:underline"
    >
      <FileTextIcon className="size-3.5" />
      {PORTFOLIO_COPY.supplierRulesLink}
    </button>
  );
}

function SupplierRulesSheet({
  open,
  onOpenChange,
  goodsSubtotal,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goodsSubtotal: number;
}) {
  const rules = MNP_SUPPLIER_RULES;
  const freeShippingOk = goodsSubtotal >= rules.freeShippingThreshold;
  const minOrderOk = goodsSubtotal >= rules.minOrderValue;
  const shippingDue = freeShippingOk ? 0 : rules.defaultShippingFee;

  const rows: Array<[string, string]> = [
    ['Supplier', rules.name],
    ['Contact', rules.contact],
    ['Document language', rules.language],
    ['Min order value', `€${rules.minOrderValue.toFixed(2)}`],
    ['Free shipping', `€${rules.freeShippingThreshold.toFixed(2)} threshold`],
    ['Default shipping', `€${rules.defaultShippingFee.toFixed(2)} · ${rules.shippingNote}`],
    ['Volume discount', rules.volumeDiscount],
    ['Early-pay discount', `${(rules.earlyPaymentDiscountRate * 100).toFixed(0)}% within ${rules.earlyPaymentDays} days`],
    ['Payment', `${rules.paymentMethod} · ${rules.paymentDays === 0 ? 'prepaid / immediate' : `${rules.paymentDays} days`}`],
    ['Lead time', `Median ${rules.leadTimeMedianDays}d · p90 ${rules.leadTimeP90Days}d`],
    ['Valid until', rules.validUntil],
    ['Source / version', `${rules.source} · ${rules.version}`],
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full p-0 sm:max-w-lg" aria-label={PORTFOLIO_COPY.supplierRulesTitle}>
        <SheetHeader className="border-b border-[#eef0f4] px-5 py-4 text-left">
          <SheetTitle className="text-[16px]">{PORTFOLIO_COPY.supplierRulesTitle}</SheetTitle>
          <SheetDescription className="text-[12px]">
            {PORTFOLIO_COPY.supplierRulesMeta}
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          <p className="rounded-2xl bg-[#eef4ff] px-3.5 py-3 text-[12px] leading-relaxed text-[#2a3a5c]">
            {PORTFOLIO_COPY.supplierRulesHint}
          </p>

          <section className="rounded-2xl border border-[#e8eaef] px-3">
            <h3 className="border-b border-[#eef0f4] py-3 text-[13px] font-semibold text-[#1a1d26]">
              Confirmed rule memory
            </h3>
            <div className="grid gap-3 py-3 sm:grid-cols-2">
              {rows.map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[#8b93a7]">{label}</p>
                  <p className="mt-1 text-[13px] font-medium leading-snug text-[#1a1d26]">{value}</p>
                </div>
              ))}
            </div>
            <a
              href={rules.website}
              target="_blank"
              rel="noreferrer"
              className="mb-3 inline-flex items-center gap-1 text-[12px] font-medium text-[#2f6bff] hover:underline"
            >
              Open MNP website
              <ExternalLinkIcon className="size-3" />
            </a>
          </section>

          <section className="rounded-2xl border border-[#e8eaef] px-3">
            <h3 className="border-b border-[#eef0f4] py-3 text-[13px] font-semibold text-[#1a1d26]">
              Current draft vs rules
            </h3>
            <div className="space-y-2 py-3 text-[13px]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[#5c6478]">Goods subtotal</span>
                <span className="font-semibold tabular-nums">€{goodsSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[#5c6478]">Min order €{rules.minOrderValue.toFixed(0)}</span>
                <SoftBadge tone={minOrderOk ? 'green' : 'warm'}>
                  {minOrderOk ? 'Met' : `Need €${(rules.minOrderValue - goodsSubtotal).toFixed(2)} more`}
                </SoftBadge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[#5c6478]">Free shipping €{rules.freeShippingThreshold.toFixed(0)}</span>
                <SoftBadge tone={freeShippingOk ? 'green' : 'warm'}>
                  {freeShippingOk ? 'Free shipping' : `Shipping €${shippingDue.toFixed(2)}`}
                </SoftBadge>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-[#eef0f4] pt-2">
                <span className="text-[#5c6478]">Est. shipping on this draft</span>
                <span className="font-semibold tabular-nums">
                  {shippingDue === 0 ? 'Free' : `€${shippingDue.toFixed(2)}`}
                </span>
              </div>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Intake 流程图：每步说明 Agent / Human 分工（英文 UI） */
const INTAKE_FLOW_STEPS = [
  {
    step: 1,
    StageIcon: MessageSquareTextIcon,
    label: 'Intake',
    stage: 'intake' as DemoStageId,
    agentForbidden: false,
    askPrompt: PORTFOLIO_COPY.workflowAskIntake,
    summary: 'Start with a goal in chat - no form to fill first.',
    agentDoes: 'Asks for supplier, coverage days, and constraints.',
    humanDoes: 'Answers in chat (or picks a quick suggestion).',
  },
  {
    step: 2,
    StageIcon: ClipboardListIcon,
    label: 'Plan',
    stage: 'replenishment' as DemoStageId,
    agentForbidden: false,
    askPrompt: PORTFOLIO_COPY.workflowAskPlan,
    summary: 'Agent builds a draft PO with forecast quantities.',
    agentDoes: 'Computes demand, order window, and line quantities.',
    humanDoes: 'Edits quantities, adds/removes SKUs, then Approves.',
  },
  {
    step: 3,
    StageIcon: ScaleIcon,
    label: 'Approve',
    stage: 'approval' as DemoStageId,
    agentForbidden: false,
    askPrompt: PORTFOLIO_COPY.workflowAskApprove,
    summary: 'A person must approve before anything is ordered.',
    agentDoes: 'Prepares the plan and Owner handoff notes.',
    humanDoes: 'Approves directly or pushes to Owner.',
  },
  {
    step: 4,
    StageIcon: ShoppingCartIcon,
    label: 'Order',
    stage: 'replenishment' as DemoStageId,
    agentForbidden: true,
    askPrompt: PORTFOLIO_COPY.workflowAskOrder,
    summary: 'Only a human places the supplier order.',
    agentDoes: 'Never contacts the supplier. Records what you mark.',
    humanDoes: 'Orders externally, then Marks as ordered in ERP.',
  },
  {
    step: 5,
    StageIcon: PackageCheckIcon,
    label: 'Receive',
    stage: 'receiving' as DemoStageId,
    agentForbidden: false,
    askPrompt: PORTFOLIO_COPY.workflowAskReceive,
    summary: 'Match DDT / invoice against the ordered plan.',
    agentDoes: 'Flags gaps, gifts, and qty mismatches.',
    humanDoes: 'Confirms receipt batches and resolves holds.',
  },
  {
    step: 6,
    StageIcon: LineChartIcon,
    label: 'Review',
    stage: 'retrospective' as DemoStageId,
    agentForbidden: false,
    askPrompt: PORTFOLIO_COPY.workflowAskReview,
    summary: 'Close the loop - what to improve next time.',
    agentDoes: 'Summarizes forecast vs actual and open issues.',
    humanDoes: 'Confirms learnings for the next cycle.',
  },
] as const;

const FLOW_AUTO_MS = 2800;

function IntakeWorkflowDiagram({
  onGoStage,
  onAskAgent,
}: {
  onGoStage?: (stage: DemoStageId) => void;
  onAskAgent?: (text: string) => void;
}) {
  const [activeStep, setActiveStep] = useState(1);
  const [playing, setPlaying] = useState(true);
  const active = INTAKE_FLOW_STEPS.find((item) => item.step === activeStep) ?? INTAKE_FLOW_STEPS[0];
  const ActiveStageIcon = active.StageIcon;

  // 自动巡游：逐步高亮，模拟流程向前走（不打断聊天）
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setActiveStep((prev) => (prev >= INTAKE_FLOW_STEPS.length ? 1 : prev + 1));
    }, FLOW_AUTO_MS);
    return () => window.clearInterval(id);
  }, [playing]);

  /** 用户点选步骤：只切换高亮 / 详情，不自动发聊天 */
  const selectStep = (step: number) => {
    setActiveStep(step);
    setPlaying(false);
  };

  const askAgentAboutStep = () => {
    setPlaying(false);
    onAskAgent?.(active.askPrompt);
  };

  const goStage = (stage: DemoStageId) => {
    setPlaying(false);
    onGoStage?.(stage);
  };

  return (
    <>
      <style>{`
        @keyframes portfolio-flow-dash {
          to { stroke-dashoffset: -24; }
        }
        @keyframes portfolio-flow-pulse {
          0% { transform: scale(0.85); opacity: 0.35; }
          45% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(0.85); opacity: 0.35; }
        }
        @keyframes portfolio-flow-dot {
          0% { left: 8%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { left: 92%; opacity: 0; }
        }
        .portfolio-flow-dash {
          stroke-dasharray: 6 6;
          animation: portfolio-flow-dash 0.9s linear infinite;
        }
        .portfolio-flow-node-pulse {
          animation: portfolio-flow-pulse 1.4s ease-in-out infinite;
        }
        .portfolio-flow-travel-dot {
          animation: portfolio-flow-dot 2.4s ease-in-out infinite;
        }
      `}</style>

      <header className="border-b border-[#eef0f4] px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#2f6bff]">
                <BotIcon className="size-6" aria-hidden />
              </span>
              <div>
                <h1 className="text-[22px] font-semibold tracking-tight text-[#1a1d26]">
                  {PORTFOLIO_COPY.intakeTitle}
                </h1>
                <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-[#5c6478]">
                  Click a step to inspect it, then ask the agent for details.
                  Agent analyzes & records; only humans place the supplier order.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              title={playing ? 'Pause tour' : 'Play tour'}
              aria-label={playing ? 'Pause tour' : 'Play tour'}
              aria-pressed={playing}
              onClick={() => setPlaying((p) => !p)}
              className={cn(
                'inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium transition-colors',
                playing
                  ? 'border-[#2f6bff]/30 bg-[#eef4ff] text-[#2f6bff]'
                  : 'border-[#e8eaef] bg-white text-[#5c6478] hover:bg-[#f6f7f9]',
              )}
            >
              {playing ? <PauseIcon className="size-3.5" aria-hidden /> : <PlayIcon className="size-3.5" aria-hidden />}
              {playing ? 'Tour playing' : 'Play tour'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-5 px-6 py-6">
        {/* 图例说明 */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#5c6478]">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex size-6 items-center justify-center rounded-md bg-[#eef4ff] text-[#2f6bff]">
              <BotIcon className="size-3.5" aria-hidden />
            </span>
            Agent lane
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex size-6 items-center justify-center rounded-md border border-[#e8eaef] bg-white text-[#1a1d26]">
              <ClipboardListIcon className="size-3.5" aria-hidden />
            </span>
            Stage (click to inspect)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex size-6 items-center justify-center rounded-md bg-[#fff6ee] text-[#b35b1f]">
              <UserIcon className="size-3.5" aria-hidden />
            </span>
            Human lane
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex size-6 items-center justify-center rounded-md bg-[#fdecec] text-[#c23b3b]">
              <BanIcon className="size-3.5" aria-hidden />
            </span>
            Agent never orders
          </span>
        </div>

        {/* 可交互流程图 + 泳道标签 */}
        <div className="mx-auto w-full max-w-5xl overflow-x-auto rounded-2xl border border-[#eef0f4] bg-[#fafbfc] px-3 py-5 sm:px-5">
          <div className="relative min-w-[760px]">
            {/* 横向流动虚线（背景动效） */}
            <svg
              className="pointer-events-none absolute inset-x-16 top-[4.85rem] h-6 w-[calc(100%-8rem)] text-[#2f6bff]"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              aria-hidden
            >
              <line
                className={cn(playing && 'portfolio-flow-dash')}
                x1="0"
                y1="6"
                x2="100"
                y2="6"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity={0.35}
              />
            </svg>
            {playing ? (
              <span
                className="portfolio-flow-travel-dot pointer-events-none absolute top-[5.15rem] size-2.5 -translate-x-1/2 rounded-full bg-[#2f6bff] shadow-[0_0_0_4px_rgba(47,107,255,0.18)]"
                aria-hidden
              />
            ) : null}

            <div className="grid grid-cols-[72px_1fr] gap-2">
              {/* 左侧泳道名 */}
              <div className="flex flex-col justify-between py-1 text-[11px] font-semibold uppercase tracking-wide text-[#8b93a7]">
                <span className="flex h-12 items-center">Agent</span>
                <span className="flex h-16 items-center">Stage</span>
                <span className="flex h-12 items-center">Human</span>
              </div>

              <div className="flex items-stretch justify-between gap-0" role="list">
                {INTAKE_FLOW_STEPS.map((item, index) => {
                  const StageIcon = item.StageIcon;
                  const selected = activeStep === item.step;
                  const done = activeStep > item.step;
                  const forbidden = item.agentForbidden;

                  return (
                    <Fragment key={item.step}>
                      <div
                        role="listitem"
                        className={cn(
                          'flex min-w-0 flex-1 flex-col items-center gap-2.5 transition-all duration-300',
                          selected ? 'opacity-100' : 'opacity-40 hover:opacity-80',
                        )}
                      >
                        {/* Agent 泳道 */}
                        <div
                          className={cn(
                            'relative flex size-12 items-center justify-center rounded-2xl transition-all duration-300',
                            forbidden ? 'bg-[#fdecec] text-[#c23b3b]' : 'bg-[#eef4ff] text-[#2f6bff]',
                            selected && !forbidden && 'ring-2 ring-[#2f6bff] ring-offset-2',
                            selected && forbidden && 'ring-2 ring-[#c23b3b] ring-offset-2',
                            selected && playing && 'portfolio-flow-node-pulse',
                          )}
                          title={forbidden ? 'Agent never orders' : `Agent · ${item.label}`}
                        >
                          {forbidden ? (
                            <BanIcon className="size-5" aria-hidden />
                          ) : (
                            <BotIcon className="size-5" aria-hidden />
                          )}
                        </div>

                        {/* Stage 节点 */}
                        <button
                          type="button"
                          title={`${item.label} - click to inspect`}
                          aria-label={`Step ${item.step}: ${item.label}`}
                          aria-current={selected ? 'step' : undefined}
                          onClick={() => selectStep(item.step)}
                          onDoubleClick={() => goStage(item.stage)}
                          className={cn(
                            'relative flex size-16 cursor-pointer flex-col items-center justify-center rounded-2xl border bg-white shadow-sm transition-all duration-300',
                            selected
                              ? 'scale-105 border-[#2f6bff] shadow-md ring-2 ring-[#2f6bff]/35'
                              : done
                                ? 'border-[#2f6bff]/40'
                                : 'border-[#e8eaef] hover:border-[#c5cad6]',
                          )}
                        >
                          <StageIcon className="size-6 text-[#1a1d26]" aria-hidden />
                          <span
                            className={cn(
                              'absolute -top-2 left-1/2 flex size-5 -translate-x-1/2 items-center justify-center rounded-full text-[10px] font-bold',
                              selected || done
                                ? 'bg-[#2f6bff] text-white'
                                : 'bg-[#e8eaef] text-[#5c6478]',
                            )}
                          >
                            {item.step}
                          </span>
                        </button>

                        {/* Human 泳道 */}
                        <div
                          className={cn(
                            'flex size-12 items-center justify-center rounded-2xl bg-[#fff6ee] text-[#b35b1f] transition-all duration-300',
                            selected && 'ring-2 ring-[#b35b1f]/50 ring-offset-2',
                          )}
                          title={`Human · ${item.label}`}
                        >
                          {item.step === 1 ? (
                            <UserIcon className="size-5" aria-hidden />
                          ) : item.step === 2 ? (
                            <PencilIcon className="size-5" aria-hidden />
                          ) : item.step === 3 ? (
                            <CheckIcon className="size-5" aria-hidden />
                          ) : item.step === 4 ? (
                            <ShoppingCartIcon className="size-5" aria-hidden />
                          ) : item.step === 5 ? (
                            <PackageCheckIcon className="size-5" aria-hidden />
                          ) : (
                            <CheckIcon className="size-5" aria-hidden />
                          )}
                        </div>

                        <p
                          className={cn(
                            'text-center text-[12px] font-semibold transition-colors',
                            selected ? 'text-[#1a1d26]' : 'text-[#8b93a7]',
                          )}
                        >
                          {item.label}
                        </p>
                      </div>

                      {index < INTAKE_FLOW_STEPS.length - 1 ? (
                        <div
                          className={cn(
                            'flex w-5 shrink-0 flex-col items-center justify-center pt-12 transition-colors duration-300',
                            activeStep > item.step ? 'text-[#2f6bff]' : 'text-[#d0d5e0]',
                          )}
                          aria-hidden
                        >
                          <ChevronRightIcon
                            className={cn(
                              'size-5 transition-transform duration-300',
                              activeStep === item.step + 1 && playing && 'translate-x-0.5',
                            )}
                          />
                        </div>
                      ) : null}
                    </Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 当前步骤说明（解决「看不懂」） */}
        <div
          key={active.step}
          className="mx-auto w-full max-w-5xl motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 rounded-2xl border border-[#e8eaef] bg-white p-5 motion-safe:duration-300"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <span
                className={cn(
                  'inline-flex size-11 shrink-0 items-center justify-center rounded-2xl',
                  active.agentForbidden ? 'bg-[#fdecec] text-[#c23b3b]' : 'bg-[#eef4ff] text-[#2f6bff]',
                )}
              >
                <ActiveStageIcon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8b93a7]">
                  Step {active.step} of {INTAKE_FLOW_STEPS.length}
                </p>
                <h2 className="mt-0.5 text-[17px] font-semibold text-[#1a1d26]">{active.label}</h2>
                <p className="mt-1 text-[13px] leading-relaxed text-[#5c6478]">{active.summary}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                title="Previous step"
                aria-label="Previous step"
                disabled={activeStep <= 1}
                onClick={() => selectStep(Math.max(1, activeStep - 1))}
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-[#e8eaef] bg-white text-[#5c6478] transition-colors hover:bg-[#f6f7f9] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRightIcon className="size-4 rotate-180" aria-hidden />
              </button>
              <button
                type="button"
                title="Next step"
                aria-label="Next step"
                disabled={activeStep >= INTAKE_FLOW_STEPS.length}
                onClick={() => selectStep(Math.min(INTAKE_FLOW_STEPS.length, activeStep + 1))}
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-[#e8eaef] bg-white text-[#5c6478] transition-colors hover:bg-[#f6f7f9] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRightIcon className="size-4" aria-hidden />
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div
              className={cn(
                'rounded-xl border px-3.5 py-3',
                active.agentForbidden
                  ? 'border-[#f0c4c4] bg-[#fff8f8]'
                  : 'border-[#dce8ff] bg-[#f7faff]',
              )}
            >
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#2f6bff]">
                {active.agentForbidden ? (
                  <BanIcon className="size-3.5 text-[#c23b3b]" aria-hidden />
                ) : (
                  <BotIcon className="size-3.5" aria-hidden />
                )}
                {active.agentForbidden ? 'Agent - blocked' : 'Agent does'}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#1a1d26]">{active.agentDoes}</p>
            </div>
            <div className="rounded-xl border border-[#ffd7b8] bg-[#fff9f3] px-3.5 py-3">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#b35b1f]">
                <UserIcon className="size-3.5" aria-hidden />
                Human does
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#1a1d26]">{active.humanDoes}</p>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              data-coach="ask-agent"
              onClick={askAgentAboutStep}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-[#2f6bff] px-4 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-[#2458d9]"
            >
              <MessageSquareTextIcon className="size-4" aria-hidden />
              Ask agent about {active.label}
              <ChevronRightIcon className="size-4 opacity-80" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function IntakeView({
  draft,
  title,
  onGoStage,
  onAskAgent,
}: {
  draft: IntakeDraft | null;
  title: string;
  onGoStage?: (stage: DemoStageId) => void;
  onAskAgent?: (text: string) => void;
}) {
  const [rulesOpen, setRulesOpen] = useState(false);
  if (!draft) {
    return (
      <CanvasScrollShell>
        <IntakeWorkflowDiagram onGoStage={onGoStage} onAskAgent={onAskAgent} />
      </CanvasScrollShell>
    );
  }

  return (
    <CanvasScrollShell>
      <CanvasHeader
        title={title}
        poProgress="draft"
        titleEditable={false}
        meta={<SupplierRulesLink onOpen={() => setRulesOpen(true)} />}
      />
      <div className="space-y-4 px-6 py-5">
        <div className="rounded-2xl border border-[#e8eaef] p-4">
          <p className="text-[12px] font-semibold text-[#1a1d26]">PR-AI-2026-0048 · extracted goal</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {([
              ['Supplier', draft.supplier],
              ['Objective', draft.objective],
              ['Coverage', draft.coverageDays ? `${draft.coverageDays} days` : 'Missing - ask agent'],
              ['Expected arrival', draft.estimatedArrival],
              ['Scope', draft.scope],
              ['Constraints', draft.constraints],
            ] as Array<[string, string]>).map(([label, value]) => (
              <div key={label} className="rounded-xl bg-[#f6f7f9] px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[0.12em] text-[#8b93a7]">{label}</p>
                <p className="mt-1 text-[13px] font-medium text-[#1a1d26]">{value}</p>
              </div>
            ))}
          </div>
        </div>
        {!draft.coverageDays ? (
          <div className="rounded-2xl border border-[#ffd7b8] bg-[#fff6ee] px-4 py-3 text-[13px] text-[#8a4b1a]">
            Coverage window is still missing. Reply in chat with 30 or 60 days before the agent can calculate quantities.
          </div>
        ) : draft.constraints === 'Not confirmed' ? (
          <div className="rounded-2xl bg-[#eef4ff] px-4 py-3 text-[13px] text-[#2a3a5c]">
            {PORTFOLIO_COPY.askConstraints}
          </div>
        ) : null}
      </div>
      <SupplierRulesSheet open={rulesOpen} onOpenChange={setRulesOpen} goodsSubtotal={0} />
    </CanvasScrollShell>
  );
}

function SubtotalBar({
  lines,
  confirmationUploaded = false,
  revealDelayMs = 0,
}: {
  lines: DemoLine[];
  /** 上传确认单后展示 Est. vs Conf. 货值差 */
  confirmationUploaded?: boolean;
  /** 计划表逐行出现后，小计栏再淡入 */
  revealDelayMs?: number;
}) {
  const rules = MNP_SUPPLIER_RULES;
  const pcs = lines.reduce((sum, line) => sum + line.qty, 0);
  // Est.：计划数量 × 估价；Conf.：确认数量 × 确认价（无确认价则回退估价）
  const estGoods = lines.reduce((sum, line) => sum + line.plannedQty * line.estimatedPrice, 0);
  const confGoods = goodsTotal(lines);
  const goods = confirmationUploaded ? confGoods : estGoods;
  const freeShippingOk = goods >= rules.freeShippingThreshold;
  const minOrderOk = goods >= rules.minOrderValue;
  const shipping = freeShippingOk ? 0 : rules.defaultShippingFee;
  const grand = goods + shipping;
  const freeShipGap = Math.max(0, rules.freeShippingThreshold - goods);
  const minOrderGap = Math.max(0, rules.minOrderValue - goods);
  const delta = confGoods - estGoods;
  const showEstConf = confirmationUploaded && lines.some((line) => line.confirmedPrice != null);
  const deltaAbs = Math.abs(delta).toFixed(2);
  const deltaTone = delta > 0.009 ? 'higher' : delta < -0.009 ? 'lower' : 'flat';

  // 对齐操作栏：-bottom 抵消 main 的 pb；两行布局，避免状态与金额挤成一行
  return (
    <div
      className={cn(
        'sticky -bottom-3 z-20 shrink-0 space-y-1 rounded-b-2xl border-t border-[#e8eaef] bg-white px-6 py-2.5 text-[12px] md:-bottom-4',
        revealDelayMs > 0 && 'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-500',
      )}
      style={revealDelayMs > 0 ? { animationDelay: `${revealDelayMs}ms`, animationFillMode: 'both' } : undefined}
    >
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        <span className="rounded-md bg-[#f6f7f9] px-2 py-0.5 text-[#5c6478]">
          {PORTFOLIO_COPY.subtotalSkusPcs(lines.length, pcs)}
        </span>
        <span
          className={cn(
            'rounded-md px-2 py-0.5 font-medium',
            minOrderOk ? 'bg-[#e5f6ee] text-[#1f8a57]' : 'bg-[#fff6ee] text-[#b35b1f]',
          )}
        >
          {minOrderOk
            ? PORTFOLIO_COPY.subtotalMinOrderMet
            : PORTFOLIO_COPY.subtotalMinOrderNeed(minOrderGap.toFixed(2))}
        </span>
        <span
          className={cn(
            'rounded-md px-2 py-0.5 font-medium',
            freeShippingOk ? 'bg-[#e5f6ee] text-[#1f8a57]' : 'bg-[#fff6ee] text-[#b35b1f]',
          )}
        >
          {freeShippingOk
            ? PORTFOLIO_COPY.subtotalFreeShipMet
            : PORTFOLIO_COPY.subtotalFreeShipNeed(shipping.toFixed(2), freeShipGap.toFixed(2))}
        </span>
        <span className="rounded-md bg-[#f6f7f9] px-2 py-0.5 text-[#5c6478]">
          {PORTFOLIO_COPY.subtotalEarlyPayHint(
            (rules.earlyPaymentDiscountRate * 100).toFixed(0),
            rules.earlyPaymentDays,
          )}
        </span>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[#8b93a7]">
          {showEstConf ? (
            <>
              <span>
                {PORTFOLIO_COPY.subtotalEstGoods}{' '}
                <span className="ml-1 font-semibold tabular-nums text-[#1a1d26]">
                  €{estGoods.toFixed(2)}
                </span>
              </span>
              <span>
                {PORTFOLIO_COPY.subtotalConfGoods}{' '}
                <span className="ml-1 font-semibold tabular-nums text-[#1a1d26]">
                  €{confGoods.toFixed(2)}
                </span>
              </span>
              <span
                className={cn(
                  'rounded-md px-2 py-0.5 font-semibold tabular-nums',
                  deltaTone === 'higher' && 'bg-[#fdecec] text-[#8a3030]',
                  deltaTone === 'lower' && 'bg-[#e5f6ee] text-[#1f8a57]',
                  deltaTone === 'flat' && 'bg-[#f6f7f9] text-[#5c6478]',
                )}
              >
                {deltaTone === 'higher'
                  ? PORTFOLIO_COPY.subtotalDeltaHigher(deltaAbs)
                  : deltaTone === 'lower'
                    ? PORTFOLIO_COPY.subtotalDeltaLower(deltaAbs)
                    : PORTFOLIO_COPY.subtotalDeltaFlat}
              </span>
            </>
          ) : (
            <span>
              {PORTFOLIO_COPY.subtotalGoods}{' '}
              <span className="ml-1 font-semibold tabular-nums text-[#1a1d26]">
                €{goods.toFixed(2)}
              </span>
            </span>
          )}
          <span>
            {PORTFOLIO_COPY.subtotalShipping}{' '}
            <span className="ml-1 font-semibold tabular-nums text-[#1a1d26]">
              {shipping === 0 ? PORTFOLIO_COPY.subtotalShippingFree : `€${shipping.toFixed(2)}`}
            </span>
          </span>
        </div>
        <span className="text-[15px] font-semibold tabular-nums text-[#1a1d26]">
          {PORTFOLIO_COPY.subtotalGrand} €{grand.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function lineUnitPrice(line: DemoLine) {
  return line.confirmedPrice ?? line.estimatedPrice;
}

function lineSubtotal(line: DemoLine) {
  return line.qty * lineUnitPrice(line);
}

function qtyDiffers(line: DemoLine) {
  return line.plannedQty !== line.qty;
}

function priceDiffers(line: DemoLine) {
  return line.confirmedPrice != null
    && Math.abs(line.confirmedPrice - line.estimatedPrice) > 0.001;
}

type PlanCol = {
  key: string;
  label: string;
  width: string;
  widthPx: number;
  align: 'left' | 'right';
  sticky?: 'lead1' | 'lead2' | 'trail';
};

/** 列宽写死 + table-fixed，对齐生产 PoItemsTable；展开手风琴不抖动 */
const PLAN_COLS_BASE: PlanCol[] = [
  { key: 'product', label: 'Product / SKU', width: '200px', widthPx: 200, align: 'left', sticky: 'lead1' },
  { key: 'estQty', label: 'Est. qty', width: '88px', widthPx: 88, align: 'right', sticky: 'lead2' },
  { key: 'confQty', label: 'Conf. qty', width: '88px', widthPx: 88, align: 'right' },
  { key: 'stock', label: 'Stock', width: '72px', widthPx: 72, align: 'right' },
  { key: 'sales', label: 'Sales 30d', width: '88px', widthPx: 88, align: 'right' },
  { key: 'est', label: 'Est. price', width: '100px', widthPx: 100, align: 'right' },
  { key: 'conf', label: 'Conf. price', width: '112px', widthPx: 112, align: 'right' },
  { key: 'subtotal', label: 'Subtotal', width: '96px', widthPx: 96, align: 'right' },
  { key: 'notes', label: 'Notes', width: '168px', widthPx: 168, align: 'left' },
];

const PLAN_ACTIONS_COL: PlanCol = {
  key: 'actions',
  label: 'Actions',
  width: '88px',
  widthPx: 88,
  align: 'right',
  sticky: 'trail',
};

function planColumns(showActions: boolean): PlanCol[] {
  return showActions ? [...PLAN_COLS_BASE, PLAN_ACTIONS_COL] : PLAN_COLS_BASE;
}

function ActionLinks({
  onWhy,
  onDelete,
  stickyBg,
  dense,
}: {
  onWhy: () => void;
  onDelete: () => void;
  stickyBg: string;
  dense?: boolean;
}) {
  return (
    <TableCell
      align="right"
      className={dataListStickyCol('trail', cn(dense ? 'px-2 py-2.5' : 'px-2 py-3 align-top', stickyBg))}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex flex-col items-end gap-0.5">
        <button
          type="button"
          className="cursor-pointer text-[11px] font-medium text-[#2f6bff] hover:underline"
          onClick={onWhy}
        >
          Why
        </button>
        <button
          type="button"
          className="cursor-pointer text-[11px] font-medium text-[#c23b3b] hover:underline"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </TableCell>
  );
}

function EstQtyCell({
  line,
  editable,
  onUpdateEstQty,
}: {
  line: DemoLine;
  editable: boolean;
  onUpdateEstQty: (sku: string, qty: number) => void;
}) {
  if (line.risk === 'extra') {
    return <span className="text-[12px] tabular-nums text-[#8b93a7]">-</span>;
  }

  if (editable) {
    return (
      <Input
        type="number"
        min={0}
        value={line.plannedQty}
        className={cn(
          'ml-auto h-8 w-[68px] rounded-lg text-right text-[13px] tabular-nums',
          qtyDiffers(line) && 'border-[#ffd7b8] bg-[#fffaf5]',
        )}
        onChange={(event) => onUpdateEstQty(line.sku, Number(event.target.value) || 0)}
      />
    );
  }

  return (
    <span className={cn(
      'text-[13px] tabular-nums',
      qtyDiffers(line) ? 'text-[#8b93a7]' : 'text-[#3d4455]',
    )}
    >
      {line.plannedQty}
    </span>
  );
}

function ConfQtyCell({
  line,
  editable,
  onUpdateConfQty,
}: {
  line: DemoLine;
  editable: boolean;
  onUpdateConfQty: (sku: string, qty: number) => void;
}) {
  const changed = qtyDiffers(line) || line.risk === 'missing' || line.risk === 'extra';

  if (editable) {
    return (
      <Input
        type="number"
        min={0}
        value={line.risk === 'missing' && line.qty === 0 ? '' : line.qty}
        placeholder="-"
        className={cn(
          'ml-auto h-8 w-[68px] rounded-lg text-right text-[13px] tabular-nums',
          changed && 'border-[#ffd7b8] bg-[#fffaf5]',
        )}
        onChange={(event) => onUpdateConfQty(line.sku, Number(event.target.value) || 0)}
      />
    );
  }

  if (line.risk === 'missing' && line.qty === 0) {
    return <span className="text-[12px] tabular-nums text-[#8b93a7]">-</span>;
  }

  return (
    <span className={cn(
      'text-[13px] font-semibold tabular-nums',
      changed ? 'text-[#b35b1f]' : 'text-[#3d4455]',
    )}
    >
      {line.qty}
    </span>
  );
}

function EstPriceCell({
  line,
  editable,
  onUpdateEstPrice,
}: {
  line: DemoLine;
  editable: boolean;
  onUpdateEstPrice: (sku: string, price: number) => void;
}) {
  if (line.risk === 'extra') {
    return <span className="text-[12px] tabular-nums text-[#8b93a7]">-</span>;
  }

  if (editable) {
    return (
      <div className="text-right">
        <Input
          type="number"
          min={0}
          step="0.01"
          value={line.estimatedPrice}
          className={cn(
            'ml-auto h-8 w-[84px] rounded-lg text-right text-[13px] tabular-nums',
            priceDiffers(line) && 'border-[#ffd7b8] bg-[#fffaf5]',
          )}
          onChange={(event) => {
            const next = Number(event.target.value);
            onUpdateEstPrice(line.sku, Number.isFinite(next) ? next : 0);
          }}
        />
      </div>
    );
  }

  return (
    <span className={cn(
      'text-[12px] tabular-nums',
      priceDiffers(line) ? 'text-[#8b93a7] line-through' : 'text-[#3d4455]',
    )}
    >
      €{line.estimatedPrice.toFixed(2)}
    </span>
  );
}

function ConfPriceCell({
  line,
  editable,
  onUpdateConfPrice,
}: {
  line: DemoLine;
  editable: boolean;
  onUpdateConfPrice: (sku: string, price: number | null) => void;
}) {
  const changed = priceDiffers(line) || line.risk === 'extra' || line.risk === 'missing';

  if (editable) {
    return (
      <Input
        type="number"
        min={0}
        step="0.01"
        value={line.confirmedPrice ?? ''}
        placeholder="-"
        className={cn(
          'ml-auto h-8 w-[84px] rounded-lg text-right text-[13px] tabular-nums',
          changed && 'border-[#ffd7b8] bg-[#fffaf5]',
        )}
        onChange={(event) => {
          const raw = event.target.value;
          if (raw === '') {
            onUpdateConfPrice(line.sku, null);
            return;
          }
          const next = Number(raw);
          onUpdateConfPrice(line.sku, Number.isFinite(next) ? next : null);
        }}
      />
    );
  }

  if (line.risk === 'missing' || line.confirmedPrice == null) {
    return <span className="text-[12px] tabular-nums text-[#8b93a7]">-</span>;
  }

  return (
    <span className={cn(
      'text-[12px] tabular-nums',
      changed ? 'font-semibold text-[#b35b1f]' : 'text-[#3d4455]',
    )}
    >
      €{line.confirmedPrice.toFixed(2)}
    </span>
  );
}

function NoteCell({
  line,
  onAskAgent,
}: {
  line: DemoLine;
  onAskAgent: (text: string) => void;
}) {
  const notes: string[] = [];
  const isMissing = line.risk === 'missing';
  if (isMissing) notes.push('Missing on confirmation');
  if (line.risk === 'extra') notes.push('Supplier-added SKU');
  // 加行/缺货本身已说明问题，不再叠 Price/Qty differs
  if (line.risk !== 'extra' && line.risk !== 'missing') {
    if (priceDiffers(line) && line.confirmedPrice != null) {
      const delta = line.confirmedPrice - line.estimatedPrice;
      notes.push(`Price ${delta >= 0 ? '+' : ''}€${delta.toFixed(2)} (€${line.estimatedPrice.toFixed(2)}→€${line.confirmedPrice.toFixed(2)})`);
    } else if (line.risk === 'price') {
      notes.push('Price differs');
    }
    if (qtyDiffers(line)) {
      notes.push(`Qty ${line.plannedQty}→${line.qty}`);
    } else if (line.risk === 'qty') {
      notes.push('Qty differs');
    }
  }
  if (line.alert && !notes.some((n) => line.alert!.toLowerCase().includes(n.slice(0, 6).toLowerCase()))) {
    notes.push(line.alert);
  }
  if (notes.length === 0) {
    return <span className="text-[11px] text-[#8b93a7]">-</span>;
  }
  const primary = notes[0];
  // Missing 用危险红，价差/数量差仍用暖橙，突出缺货优先级
  return (
    <button
      type="button"
      className={cn(
        'inline-flex max-w-full cursor-pointer items-start gap-1.5 text-left text-[11px] leading-snug hover:underline',
        isMissing ? 'font-semibold text-[#c23b3b]' : 'text-[#b35b1f]',
      )}
      onClick={() => onAskAgent(`Check ${line.sku}: ${primary}`)}
    >
      <AlertTriangleIcon className={cn('mt-0.5 size-3 shrink-0', isMissing && 'text-[#c23b3b]')} />
      <span className="min-w-0 whitespace-normal">
        {notes.map((note) => (
          <span key={note} className="block">
            {note}
          </span>
        ))}
      </span>
    </button>
  );
}

/**
 * 对齐生产 PoItemsTable：SPU 手风琴 + 横向滚动 + 前两列固定。
 */
const PLAN_ROW_STAGGER_MS = 90;
const PLAN_ROW_START_MS = 80;

function LineTable({
  lines,
  editable,
  stickyOffsetTop = 0,
  revealRows = false,
  onUpdateEstQty,
  onUpdateConfQty,
  onUpdateEstPrice,
  onUpdateConfPrice,
  onDeleteSku,
  onDeleteSpu,
  onAskAgent,
}: {
  lines: DemoLine[];
  editable: boolean;
  /** 上方吸顶操作栏高度，表格 meta / 列头叠在其下 */
  stickyOffsetTop?: number;
  /** 计划生成后：表头先出现，SPU 行再逐条淡入 */
  revealRows?: boolean;
  onUpdateEstQty: (sku: string, qty: number) => void;
  onUpdateConfQty: (sku: string, qty: number) => void;
  onUpdateEstPrice: (sku: string, price: number) => void;
  onUpdateConfPrice: (sku: string, price: number | null) => void;
  onDeleteSku: (sku: string) => void;
  onDeleteSpu: (productId: string) => void;
  onAskAgent: (text: string) => void;
}) {
  const showActions = editable;
  const columns = useMemo(() => planColumns(showActions), [showActions]);
  const tableMinWidth = useMemo(
    () => columns.reduce((sum, col) => sum + col.widthPx, 0),
    [columns],
  );
  const groups = useMemo(() => groupDemoLinesBySpu(lines), [lines]);
  const revealedRef = useRef(!revealRows);
  const [visibleCount, setVisibleCount] = useState(() => (revealRows ? 0 : groups.length));

  useEffect(() => {
    if (revealedRef.current) {
      setVisibleCount(groups.length);
      return;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealedRef.current = true;
      setVisibleCount(groups.length);
      return;
    }
    const timers = groups.map((_, index) => window.setTimeout(() => {
      setVisibleCount(index + 1);
      if (index + 1 >= groups.length) revealedRef.current = true;
    }, PLAN_ROW_START_MS + index * PLAN_ROW_STAGGER_MS));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [groups, revealRows]);

  const shownGroups = revealRows ? groups.slice(0, visibleCount) : groups;
  const riskKeys = useMemo(
    () => new Set(groups.filter((g) => g.items.some(lineHasConfirmationGap)).map((g) => g.key)),
    [groups],
  );
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (riskKeys.size === 0) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      riskKeys.forEach((key) => next.add(key));
      return next;
    });
  }, [riskKeys]);

  const allExpanded = groups.length > 0 && groups.every((g) => expanded.has(g.key));
  const toggle = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const { sentinelRef, stuck } = useStickyStuck(stickyOffsetTop);
  // 列头 / 表体横向滚动同步（列头并入 sticky 区，表体单独裁切底圆角）
  const headScrollRef = useRef<HTMLDivElement>(null);
  const syncHeadScroll = (event: UIEvent<HTMLDivElement>) => {
    if (headScrollRef.current) {
      headScrollRef.current.scrollLeft = event.currentTarget.scrollLeft;
    }
  };

  const tableWidthStyle = {
    '--sticky-lead-1-w': '200px',
    '--sticky-lead-2-w': '88px',
    '--sticky-lead-3-w': '0px',
    '--sticky-trail-w': showActions ? '88px' : '0px',
    width: `${tableMinWidth}px`,
    minWidth: `${tableMinWidth}px`,
  } as CSSProperties;

  // sticky 表头与表体分离：表头/表体各自 overflow-hidden 裁切圆角，不打断吸顶
  return (
    <div className="relative">
      <style>{`
        @keyframes portfolio-plan-row-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .portfolio-plan-row-in {
          animation: portfolio-plan-row-in 0.38s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .portfolio-plan-row-in { animation: none; }
        }
      `}</style>
      <div ref={sentinelRef} className="pointer-events-none absolute top-0 h-px w-full" aria-hidden />
      <div
        className={cn(
          'rounded-b-2xl border border-[#e8eaef] bg-white',
          stuck ? 'rounded-t-none' : 'rounded-t-2xl',
          revealRows && 'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300',
        )}
      >
        <div
          className={cn('sticky z-30 bg-white', !stuck && 'overflow-hidden rounded-t-2xl')}
          style={{ top: stickyOffsetTop }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-[#e8eaef] bg-[#fafbfc] px-4 py-2">
            <span className="text-[11px] text-[#8b93a7]">
              {groups.length} products · {lines.length} SKUs
            </span>
            <button
              type="button"
              className="cursor-pointer text-[11px] font-medium text-[#2f6bff] hover:underline"
              onClick={() => setExpanded(allExpanded ? new Set() : new Set(groups.map((g) => g.key)))}
            >
              {allExpanded ? 'Collapse all' : 'Expand all'}
            </button>
          </div>
          <div ref={headScrollRef} className="overflow-x-hidden border-b border-[#e8eaef] bg-[#f6f7f9]">
            <table
              className="def-table def-data-table portfolio-plan-table table-fixed border-separate border-spacing-0 text-[13px]"
              style={tableWidthStyle}
            >
              <colgroup>
                {columns.map((col) => (
                  <col key={col.key} style={{ width: col.width }} />
                ))}
              </colgroup>
              <thead>
                <tr className="hover:bg-transparent">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={cn(
                        'whitespace-nowrap px-3 py-2.5 text-[11px] font-medium text-[#8b93a7]',
                        col.align === 'right' ? 'text-right' : 'text-left',
                        col.key === 'actions' && 'px-2',
                        col.sticky && dataListStickyCol(col.sticky, 'bg-[#f6f7f9]'),
                        !col.sticky && 'bg-[#f6f7f9]',
                      )}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-b-2xl">
          <div className="max-w-full overflow-x-auto" onScroll={syncHeadScroll}>
            <Table
              scroll={false}
              frame={false}
              stickyHeader={false}
              stickyLayout
              stickyLeads={2}
              className="portfolio-plan-table table-fixed text-[13px]"
              style={tableWidthStyle}
            >
              <colgroup>
                {columns.map((col) => (
                  <col key={col.key} style={{ width: col.width }} />
                ))}
              </colgroup>
              <TableBody>
          {shownGroups.map((group) => {
            const open = expanded.has(group.key);
            const hasMissing = group.items.some((line) => line.risk === 'missing');
            const hasGap = group.items.some(lineHasConfirmationGap);
            // Missing 优先用危险红底；其余差异仍用暖橙
            const groupBg = hasMissing
              ? 'bg-[#fdecec]'
              : hasGap
                ? 'bg-[#fff8f1]'
                : 'bg-[#f3f4f7]';
            const stickyGroupBg = hasMissing
              ? 'bg-[#fdecec]'
              : hasGap
                ? 'bg-[#fff8f1]'
                : 'bg-[#f3f4f7]';
            const groupHover = hasMissing
              ? 'hover:bg-[#f8dede]'
              : hasGap
                ? 'hover:bg-[#fff3e8]'
                : 'hover:bg-[#eceef3]';
            const agg = group.items.reduce(
              (acc, line) => {
                acc.stock += line.stock;
                acc.sales += line.sales30;
                acc.plannedQty += line.plannedQty;
                acc.qty += line.qty;
                acc.subtotal += lineSubtotal(line);
                return acc;
              },
              { stock: 0, sales: 0, plannedQty: 0, qty: 0, subtotal: 0 },
            );

            return (
              <Fragment key={group.key}>
                <TableRow
                  interactive
                  className={cn(
                    'border-b border-[#eef0f4]',
                    groupBg,
                    groupHover,
                    revealRows && 'portfolio-plan-row-in',
                  )}
                  onClick={() => toggle(group.key)}
                >
                  <TableCell className={dataListStickyCol('lead1', cn('px-3 py-2.5', stickyGroupBg))}>
                    <p className="truncate text-[13px] font-medium text-[#1a1d26]">
                      <span className="mr-1.5 inline-block w-3 text-[#5c6478]">{open ? '▾' : '▸'}</span>
                      {group.label}
                      <span className="ml-2 text-[11px] font-normal text-[#8b93a7]">
                        {group.items.length} SKU{group.items.length > 1 ? 's' : ''}
                      </span>
                    </p>
                  </TableCell>
                  <TableCell
                    align="right"
                    className={dataListStickyCol('lead2', cn('px-3 py-2.5 text-[12px] font-semibold tabular-nums', stickyGroupBg))}
                  >
                    {agg.plannedQty}
                  </TableCell>
                  <TableCell align="right" className="px-3 py-2.5 text-[12px] font-semibold tabular-nums text-[#1a1d26]">
                    {agg.qty}
                  </TableCell>
                  <TableCell align="right" className="px-3 py-2.5 text-[12px] tabular-nums text-[#5c6478]">
                    {agg.stock}
                  </TableCell>
                  <TableCell align="right" className="px-3 py-2.5 text-[12px] tabular-nums text-[#5c6478]">
                    {agg.sales}
                  </TableCell>
                  <TableCell align="right" className="px-3 py-2.5 text-[11px] text-[#8b93a7]">-</TableCell>
                  <TableCell align="right" className="px-3 py-2.5 text-[11px] text-[#8b93a7]">-</TableCell>
                  <TableCell align="right" className="px-3 py-2.5 text-[12px] font-semibold tabular-nums">
                    €{agg.subtotal.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-[11px] whitespace-normal text-[#8b93a7]">
                    {hasMissing ? (
                      <span className="font-semibold text-[#c23b3b]">Missing on confirmation</span>
                    ) : hasGap ? (
                      <span className="font-medium text-[#b35b1f]">Gaps in SKUs</span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  {showActions ? (
                    <ActionLinks
                      dense
                      stickyBg={stickyGroupBg}
                      onWhy={() => onAskAgent(
                        `Why did you recommend ${group.label}? Explain the SPU-level quantity logic.`,
                      )}
                      onDelete={() => {
                        if (window.confirm(`Delete all SKUs under “${group.label}”?`)) {
                          onDeleteSpu(group.key);
                        }
                      }}
                    />
                  ) : null}
                </TableRow>

                {open
                  ? group.items.map((line) => {
                    const isMissing = line.risk === 'missing';
                    const gap = lineHasConfirmationGap(line);
                    const rowBg = isMissing
                      ? 'bg-[#fff5f5]'
                      : gap
                        ? 'bg-[#fffaf5]'
                        : 'bg-white';
                    const stickyBg = isMissing
                      ? 'bg-[#fff5f5]'
                      : gap
                        ? 'bg-[#fffaf5]'
                        : 'bg-white';
                    return (
                      <TableRow
                        key={line.sku}
                        className={cn('border-b border-[#eef0f4]', rowBg)}
                      >
                        <TableCell className={dataListStickyCol('lead1', cn('px-3 py-3 pl-8', stickyBg))}>
                          <p className="text-[12px] font-medium text-[#1a1d26]">
                            <span className="font-mono text-[#5c6478]">{line.sku}</span>
                            <span className="mx-1.5 text-[#c5cad6]">·</span>
                            {line.variant}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] text-[#8b93a7]">{line.nameIt}</p>
                        </TableCell>
                        <TableCell
                          align="right"
                          className={dataListStickyCol('lead2', cn('px-3 py-3 align-top', stickyBg))}
                        >
                          <EstQtyCell
                            line={line}
                            editable={editable}
                            onUpdateEstQty={onUpdateEstQty}
                          />
                        </TableCell>
                        <TableCell align="right" className="px-3 py-3 align-top">
                          <ConfQtyCell
                            line={line}
                            editable={editable}
                            onUpdateConfQty={onUpdateConfQty}
                          />
                        </TableCell>
                        <TableCell align="right" className="px-3 py-3 align-top tabular-nums text-[#3d4455]">
                          {line.stock}
                        </TableCell>
                        <TableCell align="right" className="px-3 py-3 align-top tabular-nums text-[#3d4455]">
                          {line.sales30}
                        </TableCell>
                        <TableCell align="right" className="px-3 py-3 align-top">
                          <EstPriceCell
                            line={line}
                            editable={editable}
                            onUpdateEstPrice={onUpdateEstPrice}
                          />
                        </TableCell>
                        <TableCell align="right" className="px-3 py-3 align-top">
                          <ConfPriceCell
                            line={line}
                            editable={editable}
                            onUpdateConfPrice={onUpdateConfPrice}
                          />
                        </TableCell>
                        <TableCell align="right" className="px-3 py-3 align-top text-[13px] font-semibold tabular-nums">
                          {line.risk === 'missing' ? '-' : `€${lineSubtotal(line).toFixed(2)}`}
                        </TableCell>
                        <TableCell className="px-3 py-3 align-top whitespace-normal">
                          <NoteCell line={line} onAskAgent={onAskAgent} />
                        </TableCell>
                        {showActions ? (
                          <ActionLinks
                            stickyBg={stickyBg}
                            onWhy={() => onAskAgent(
                              `Why did you recommend ${line.sku} · ${line.variant} at qty ${line.qty}?`,
                            )}
                            onDelete={() => {
                              if (window.confirm(`Delete SKU ${line.sku}?`)) {
                                onDeleteSku(line.sku);
                              }
                            }}
                          />
                        ) : null}
                      </TableRow>
                    );
                  })
                  : null}
              </Fragment>
            );
          })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {editable ? (
        <div className="pt-3">
          <button
            type="button"
            className="inline-flex h-9 cursor-default items-center rounded-full border border-dashed border-[#d5dae3] bg-[#f6f7f9] px-4 text-[13px] font-medium text-[#1a1d26]"
          >
            {PORTFOLIO_COPY.addProductLine}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ExportDialog({
  open,
  lines,
  onOpenChange,
  onExport,
}: {
  open: boolean;
  lines: DemoLine[];
  onOpenChange: (open: boolean) => void;
  onExport: (format: 'xlsx' | 'pdf') => void;
}) {
  const [format, setFormat] = useState<'xlsx' | 'pdf'>('xlsx');
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{PORTFOLIO_COPY.exportTitle}</DialogTitle>
          <DialogDescription>{PORTFOLIO_COPY.exportHint}</DialogDescription>
        </DialogHeader>
        <div className="rounded-xl bg-[#eef4ff] px-3 py-2 text-[12px] text-[#2a3a5c]">
          {PORTFOLIO_COPY.exportLang}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {([
            ['xlsx', PORTFOLIO_COPY.exportExcel, FileSpreadsheetIcon],
            ['pdf', PORTFOLIO_COPY.exportPdf, FileTextIcon],
          ] as const).map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFormat(value)}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-left',
                format === value ? 'border-[#2f6bff] bg-[#eef4ff]' : 'border-[#e8eaef]',
              )}
            >
              <Icon className="mt-0.5 size-4 text-[#2f6bff]" />
              <span className="text-[13px] font-medium">{label}</span>
            </button>
          ))}
        </div>
        <div className="overflow-hidden rounded-xl border border-[#e8eaef]">
          <div className="grid grid-cols-[120px_minmax(0,1fr)_80px] gap-2 bg-[#f6f7f9] px-3 py-2 text-[11px] text-[#8b93a7]">
            <span>Codice</span>
            <span>Nome / Descrizione</span>
            <span>Qty</span>
          </div>
          {lines.filter((line) => line.risk !== 'missing').slice(0, 5).map((line) => (
            <div
              key={line.sku}
              className="grid grid-cols-[120px_minmax(0,1fr)_80px] gap-2 border-t border-[#eef0f4] px-3 py-2 text-[12px]"
            >
              <span className="font-mono">{line.sku}</span>
              <span>{line.nameIt}</span>
              <span className="tabular-nums">{line.qty}</span>
            </div>
          ))}
          <p className="border-t border-[#eef0f4] px-3 py-2 text-[10px] text-[#8b93a7]">
            {`Preview · ${lines.length} SKUs · code, name, qty only - no prices`}
          </p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            type="button"
            className="rounded-xl bg-[#2f6bff] hover:bg-[#2458d9]"
            onClick={() => {
              onExport(format);
              onOpenChange(false);
            }}
          >
            <DownloadIcon className="size-3.5" />
            Export {format === 'xlsx' ? 'Excel' : 'PDF'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** 本单附件：仅查看 / 下载（删除需管理员，Demo 不开放） */
function AttachmentsSheet({
  open,
  onOpenChange,
  attachments,
  approved,
  onDownload,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attachments: OrderAttachment[];
  /** 已 Approve 时，当前确认单仅挂 Final approved 标签 */
  approved: boolean;
  onDownload: (attachment: OrderAttachment) => void;
}) {
  const [preview, setPreview] = useState<OrderAttachment | null>(null);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          className="flex w-full flex-col gap-0 p-0 sm:max-w-lg"
          aria-label={PORTFOLIO_COPY.attachmentsTitle}
        >
          <SheetHeader className="border-b border-[#eef0f4] px-5 py-4 text-left">
            <SheetTitle className="text-[16px]">{PORTFOLIO_COPY.attachmentsTitle}</SheetTitle>
            <SheetDescription className="text-[12px]">
              {PORTFOLIO_COPY.attachmentsMeta}
              {attachments.length > 0 ? ` · ${attachments.length} files` : ''}
              <span className="mt-1 block text-[11px] text-[#8b93a7]">
                {PORTFOLIO_COPY.attachmentsOrderHint}
              </span>
            </SheetDescription>
          </SheetHeader>

          <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
            {attachments.length === 0 ? (
              <p className="rounded-2xl bg-[#f6f7f9] px-3.5 py-3 text-[12px] text-[#8b93a7]">
                {PORTFOLIO_COPY.attachmentsEmpty}
              </p>
            ) : (
              attachments.map((item) => {
                const Icon = item.format === 'xlsx' ? FileSpreadsheetIcon : FileTextIcon;
                // 附件列表仅保留「Final approved」标记，不做高亮 / Awaiting 等特殊样式
                const showFinalApproved = item.kind === 'confirmation' && item.isCurrent && approved;
                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-[#e8eaef] bg-white px-3.5 py-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2f6bff]">
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="min-w-0 truncate text-[13px] font-semibold text-[#1a1d26]">
                            {PORTFOLIO_COPY.attachmentKind[item.kind]}
                          </p>
                          {showFinalApproved ? (
                            <SoftBadge tone="blue" className="ml-auto shrink-0">
                              {PORTFOLIO_COPY.attachmentsBadgeFinalApproved}
                            </SoftBadge>
                          ) : null}
                        </div>
                        <p className="mt-0.5 truncate font-mono text-[11px] text-[#5c6478]">{item.fileName}</p>
                        <p className="mt-1 text-[10px] text-[#8b93a7]">
                          {item.source} · {item.uploadedAt}
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg px-2.5 text-[12px]"
                            onClick={() => setPreview(item)}
                          >
                            <EyeIcon className="size-3.5" />
                            {PORTFOLIO_COPY.attachmentsView}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg px-2.5 text-[12px]"
                            onClick={() => onDownload(item)}
                          >
                            <DownloadIcon className="size-3.5" />
                            {PORTFOLIO_COPY.attachmentsDownload}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={!!preview} onOpenChange={(next) => !next && setPreview(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{PORTFOLIO_COPY.attachmentsPreviewTitle}</DialogTitle>
            <DialogDescription>{PORTFOLIO_COPY.attachmentsPreviewHint}</DialogDescription>
          </DialogHeader>
          {preview ? (
            <div className="space-y-3 rounded-2xl border border-[#e8eaef] bg-[#fafbfc] px-4 py-4">
              <p className="text-[13px] font-semibold text-[#1a1d26]">
                {preview.label || PORTFOLIO_COPY.attachmentKind[preview.kind]}
              </p>
              <p className="font-mono text-[12px] text-[#5c6478]">{preview.fileName}</p>
              <p className="text-[12px] text-[#8b93a7]">
                {preview.source} · {preview.uploadedAt}
              </p>
              <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-[#d7dbe5] bg-white text-[12px] text-[#8b93a7]">
                {preview.format.toUpperCase()} preview placeholder
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setPreview(null)}>
              Close
            </Button>
            {preview ? (
              <Button
                type="button"
                className="rounded-xl bg-[#2f6bff] hover:bg-[#2458d9]"
                onClick={() => {
                  onDownload(preview);
                  setPreview(null);
                }}
              >
                <DownloadIcon className="size-3.5" />
                {PORTFOLIO_COPY.attachmentsDownload}
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** 第二 stage 开场：中间画布先空着，发送后进入分阶段加载 */
function PlanBuildingView({
  title,
  progress,
}: {
  title: string;
  progress: DemoProgress;
}) {
  const running = progress.status === 'running';
  return (
    <CanvasScrollShell>
      <CanvasHeader title={title} poProgress="draft" titleEditable={false} />
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-5 px-6 py-16 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300">
        {running ? (
          <>
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#2f6bff]">
              <Loader2Icon className="size-6 animate-spin" aria-hidden />
            </span>
            <div className="text-center">
              <p className="text-[15px] font-semibold text-[#1a1d26]">{PORTFOLIO_COPY.planBuildingTitle}</p>
              <p className="mt-1 text-[12px] text-[#8b93a7]">{PORTFOLIO_COPY.planBuildingHint}</p>
            </div>
            <ol className="w-full max-w-xs space-y-2">
              {PHASES.map((phase) => {
                const done = progress.completed.includes(phase);
                const isCurrent = running && progress.current === phase;
                return (
                  <li key={phase} className="flex items-center gap-2.5 text-[13px]">
                    {done ? (
                      <CheckIcon className="size-3.5 text-[#22a06b]" aria-hidden />
                    ) : isCurrent ? (
                      <Loader2Icon className="size-3.5 animate-spin text-[#2f6bff]" aria-hidden />
                    ) : (
                      <span className="size-3.5 rounded-full border border-[#d9dde7]" aria-hidden />
                    )}
                    <span className={isCurrent ? 'font-medium text-[#1a1d26]' : 'text-[#8b93a7]'}>
                      {PORTFOLIO_COPY.phaseLabels[phase]}
                    </span>
                  </li>
                );
              })}
            </ol>
          </>
        ) : (
          <p className="text-[13px] text-[#8b93a7]">{PORTFOLIO_COPY.planWaitingHint}</p>
        )}
      </div>
    </CanvasScrollShell>
  );
}

function ReplenishmentView({
  lines,
  exportFormat,
  attachments,
  confirmationUploaded,
  approvalRequiredByRules,
  approvalSubmitted,
  approvalDecision,
  approved,
  orderRecorded,
  onUpdateEstQty,
  onUpdateConfQty,
  onUpdateEstPrice,
  onUpdateConfPrice,
  onDeleteSku,
  onDeleteSpu,
  onExport,
  onDownloadAttachment,
  confirmationRounds,
  onUploadConfirmation,
  onUploadInvoice,
  orderAt,
  orderedBy,
  expectedArrival,
  onApproveDirect,
  onPushToOwner,
  onApproveClick,
  onAddNegotiationNote,
  onMarkOrdered,
  onAskAgent,
  title,
  onRenameTitle,
}: {
  lines: DemoLine[];
  exportFormat: 'xlsx' | 'pdf' | null;
  attachments: OrderAttachment[];
  confirmationUploaded: boolean;
  approvalRequiredByRules: boolean;
  approvalSubmitted: boolean;
  approvalDecision: DemoState['approvalDecision'];
  approved: boolean;
  orderAt: string | null;
  orderedBy: string | null;
  expectedArrival: string | null;
  orderRecorded: boolean;
  confirmationRounds: ConfirmationRound[];
  title: string;
  onUpdateEstQty: (sku: string, qty: number) => void;
  onUpdateConfQty: (sku: string, qty: number) => void;
  onUpdateEstPrice: (sku: string, price: number) => void;
  onUpdateConfPrice: (sku: string, price: number | null) => void;
  onDeleteSku: (sku: string) => void;
  onDeleteSpu: (productId: string) => void;
  onExport: (format: 'xlsx' | 'pdf') => void;
  onDownloadAttachment: (attachment: OrderAttachment) => void;
  onUploadConfirmation: () => void;
  onUploadInvoice: () => void;
  onApproveDirect: () => void;
  onPushToOwner: () => void;
  onApproveClick?: () => void;
  onAddNegotiationNote: (text: string) => void;
  onMarkOrdered: (meta: MarkOrderMeta) => void;
  onAskAgent: (text: string) => void;
  onRenameTitle: (title: string) => void;
}) {
  const [exportOpen, setExportOpen] = useState(false);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [markOrderedOpen, setMarkOrderedOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const actionBar = useActionBarStickyHeight();
  // 须先 Approve 才显示 Mark as ordered
  const showMarkOrdered = approved && !orderRecorded;
  const canApprove = confirmationUploaded && !orderRecorded && !approved;
  const invoiceUploaded = hasInvoiceAttachment(attachments);
  const planGroupCount = useMemo(() => groupDemoLinesBySpu(lines).length, [lines]);

  return (
    <CanvasScrollShell footer={(
      <SubtotalBar
        lines={lines}
        confirmationUploaded={confirmationUploaded}
        revealDelayMs={PLAN_ROW_START_MS + planGroupCount * PLAN_ROW_STAGGER_MS + 80}
      />
    )}>
      <CanvasHeader
        title={title}
        poProgress={orderRecorded ? 'ordered' : 'draft'}
        onTitleChange={onRenameTitle}
        meta={<SupplierRulesLink onOpen={() => setRulesOpen(true)} />}
      />
      {/* 操作栏吸顶：标题可滚走，按钮栏始终固定 */}
      <CanvasActionBar barRef={actionBar.ref}>
        <div className="flex flex-wrap items-center gap-2">
          <ViewAttachmentsButton count={attachments.length} onClick={() => setAttachmentsOpen(true)} />
          <ViewNegotiationLogButton count={confirmationRounds.length} onClick={() => setLogOpen(true)} />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button type="button" variant="outline" className="h-10 rounded-xl" disabled={orderRecorded} onClick={() => setExportOpen(true)}>
            <DownloadIcon className="size-3.5" />
            {exportFormat ? 'Re-export request' : PORTFOLIO_COPY.exportRequest}
          </Button>
          {/* 仅 Export + Upload 时，Upload confirmation 为主按钮；有 Approve/Mark 后降为次要 */}
          <Button
            type="button"
            data-coach="upload-confirmation"
            variant={canApprove || showMarkOrdered ? 'outline' : 'default'}
            className={cn(
              'h-10 rounded-xl',
              !canApprove && !showMarkOrdered && 'bg-[#2f6bff] text-white hover:bg-[#2458d9]',
            )}
            disabled={orderRecorded}
            onClick={onUploadConfirmation}
          >
            {confirmationUploaded ? 'Re-upload confirmation' : PORTFOLIO_COPY.uploadConfirmation}
          </Button>
          {orderRecorded ? (
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl"
              onClick={onUploadInvoice}
            >
              {invoiceUploaded ? PORTFOLIO_COPY.reuploadInvoice : PORTFOLIO_COPY.uploadInvoice}
            </Button>
          ) : null}
          {canApprove ? (
            <Button
              type="button"
              data-coach="approve-plan"
              className="h-10 rounded-xl bg-[#2f6bff] text-white hover:bg-[#2458d9]"
              onClick={() => {
                onApproveClick?.();
                setApproveOpen(true);
              }}
            >
              {PORTFOLIO_COPY.approve}
            </Button>
          ) : null}
          {showMarkOrdered ? (
            <Button
              type="button"
              className="h-10 rounded-xl bg-[#2f6bff] text-white hover:bg-[#2458d9]"
              onClick={() => setMarkOrderedOpen(true)}
            >
              {PORTFOLIO_COPY.markOrdered}
            </Button>
          ) : null}
        </div>
      </CanvasActionBar>
      <div className="space-y-4 px-6 py-5">
        {approvalDecision === 'invalidated' ? (
          <div className="rounded-2xl border border-[#f5c2c2] bg-[#fdecec] px-4 py-3 text-[13px] text-[#8a3030]">
            {PORTFOLIO_COPY.approvalInvalidatedBanner}
          </div>
        ) : orderRecorded && orderAt && orderedBy && expectedArrival ? (
          <div className="rounded-2xl border border-[#b7e4c7] bg-[#e5f6ee] px-4 py-3 text-[12px] leading-relaxed text-[#1f8a57]">
            Ordered · {orderAt.replace('T', ' ')} · by {orderedBy} · ETA {expectedArrival}
          </div>
        ) : approvalSubmitted && !approved ? (
          <div className="rounded-2xl border border-[#d9e4ff] bg-[#f3f7ff] px-4 py-3 text-[12px] text-[#2a3a5c]">
            {PORTFOLIO_COPY.approvalSubmittedBanner}
          </div>
        ) : confirmationUploaded && approvalRequiredByRules && !approved ? (
          <div className="rounded-2xl border border-[#ffd7b8] bg-[#fff6ee] px-4 py-3 text-[13px] text-[#8a4b1a]">
            {PORTFOLIO_COPY.approvalDetectedBanner}
          </div>
        ) : null}
        <LineTable
          lines={lines}
          editable={!orderRecorded}
          stickyOffsetTop={actionBar.stickTop}
          revealRows
          onUpdateEstQty={onUpdateEstQty}
          onUpdateConfQty={onUpdateConfQty}
          onUpdateEstPrice={onUpdateEstPrice}
          onUpdateConfPrice={onUpdateConfPrice}
          onDeleteSku={onDeleteSku}
          onDeleteSpu={onDeleteSpu}
          onAskAgent={onAskAgent}
        />
        {exportFormat ? (
          <div className="rounded-2xl border border-[#b7e4c7] bg-[#e5f6ee] px-4 py-3 text-[12px] text-[#1f8a57]">
            {PORTFOLIO_COPY.exportDone(exportFormat)} · also listed under Attachments
          </div>
        ) : null}
      </div>
      <ExportDialog open={exportOpen} lines={lines} onOpenChange={setExportOpen} onExport={onExport} />
      <AttachmentsSheet
        open={attachmentsOpen}
        onOpenChange={setAttachmentsOpen}
        attachments={attachments}
        approved={approved}
        onDownload={onDownloadAttachment}
      />
      <NegotiationLogSheet
        open={logOpen}
        onOpenChange={setLogOpen}
        rounds={confirmationRounds}
        locked={orderRecorded}
        approved={approved}
        onAdd={onAddNegotiationNote}
      />
      <ApproveChoiceDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        onApproveDirect={onApproveDirect}
        onPushToOwner={onPushToOwner}
      />
      <MarkOrderedDialog
        open={markOrderedOpen}
        onOpenChange={setMarkOrderedOpen}
        onConfirm={onMarkOrdered}
      />
      <SupplierRulesSheet
        open={rulesOpen}
        onOpenChange={setRulesOpen}
        goodsSubtotal={goodsTotal(lines)}
      />
    </CanvasScrollShell>
  );
}

/** 对齐 Pilot「查看谈价记录」：按上传的 confirmation 文档归组展示 */
function NegotiationLogSheet({
  open,
  onOpenChange,
  rounds,
  locked,
  approved,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rounds: ConfirmationRound[];
  locked: boolean;
  approved: boolean;
  onAdd: (text: string) => void;
}) {
  const [draft, setDraft] = useState('');
  const current = rounds.find((round) => round.isCurrent) ?? null;
  const noteCount = rounds.reduce((sum, round) => sum + round.notes.length, 0);
  const boundLabel = current
    ? (approved
      ? `${PORTFOLIO_COPY.negotiationBadgeApproved} · ${current.fileName}`
      : `${PORTFOLIO_COPY.negotiationBadgeAwaiting} · ${current.fileName}`)
    : '';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex w-full flex-col gap-0 p-0 sm:max-w-lg"
        aria-label={PORTFOLIO_COPY.negotiationLogTitle}
      >
        <SheetHeader className="border-b border-[#eef0f4] px-5 py-4 text-left">
          <SheetTitle className="text-[16px]">{PORTFOLIO_COPY.negotiationLogTitle}</SheetTitle>
          <SheetDescription className="text-[12px]">
            {PORTFOLIO_COPY.negotiationLogMeta}
            {boundLabel ? ` · ${boundLabel}` : ''}
            {noteCount > 0 ? ` · ${noteCount} notes` : ''}
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {rounds.length === 0 ? (
            <p className="rounded-2xl bg-[#f6f7f9] px-3.5 py-3 text-[12px] text-[#8b93a7]">
              {PORTFOLIO_COPY.negotiationLogEmpty}
            </p>
          ) : (
            rounds.map((round) => (
              <section
                key={round.id}
                className={cn(
                  'overflow-hidden rounded-2xl border',
                  round.isCurrent ? 'border-[#2f6bff]/40 bg-[#f7f9ff]' : 'border-[#e8eaef] bg-white',
                )}
              >
                <header className="flex items-start justify-between gap-2 border-b border-[#eef0f4] px-3.5 py-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#1a1d26]">{round.versionLabel}</p>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-[#5c6478]">{round.fileName}</p>
                    <p className="mt-1 text-[10px] text-[#8b93a7]">
                      {round.source} · {round.uploadedAt}
                    </p>
                  </div>
                  <SoftBadge tone={round.isCurrent ? 'blue' : 'neutral'}>
                    {round.isCurrent
                      ? (approved
                        ? PORTFOLIO_COPY.negotiationBadgeApproved
                        : PORTFOLIO_COPY.negotiationBadgeAwaiting)
                      : PORTFOLIO_COPY.negotiationBadgeHistory}
                  </SoftBadge>
                </header>
                <div className="space-y-2 px-3.5 py-3">
                  {round.notes.length === 0 ? (
                    <p className="text-[12px] text-[#8b93a7]">No notes on this confirmation yet.</p>
                  ) : (
                    round.notes.map((note) => (
                      <div key={note.id} className="rounded-xl border border-[#eef0f4] bg-white px-3 py-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className={cn(
                            'text-[11px] font-semibold',
                            note.actor === 'Buyer' && 'text-[#2f6bff]',
                            note.actor === 'Agent' && 'text-[#5c6478]',
                            note.actor === 'Supplier' && 'text-[#b35b1f]',
                          )}
                          >
                            {note.actor}
                          </span>
                          <span className="text-[10px] tabular-nums text-[#8b93a7]">{note.at}</span>
                        </div>
                        <p className="mt-1 text-[12px] leading-relaxed text-[#3d4455]">{note.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </section>
            ))
          )}
        </div>

        {!locked && current ? (
          <div className="shrink-0 space-y-2 border-t border-[#eef0f4] bg-white px-4 py-3">
            <p className="text-[11px] text-[#8b93a7]">
              Adding to <span className="font-mono text-[#5c6478]">{current.fileName}</span>
            </p>
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={PORTFOLIO_COPY.negotiationPlaceholder}
              className="h-10 rounded-xl text-[13px]"
              onKeyDown={(event) => {
                if (event.key === 'Enter' && draft.trim()) {
                  onAdd(draft.trim());
                  setDraft('');
                }
              }}
            />
            <Button
              type="button"
              className="h-10 w-full rounded-xl bg-[#2f6bff] hover:bg-[#2458d9]"
              disabled={!draft.trim()}
              onClick={() => {
                if (!draft.trim()) return;
                onAdd(draft.trim());
                setDraft('');
              }}
            >
              {PORTFOLIO_COPY.negotiationAdd}
            </Button>
          </div>
        ) : !locked ? (
          <div className="shrink-0 border-t border-[#eef0f4] px-4 py-3 text-[12px] text-[#8b93a7]">
            {PORTFOLIO_COPY.negotiationLogNoCurrent}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function ApprovalView({
  lines,
  approved,
  orderRecorded,
  confirmationUploaded,
  attachments,
  confirmationRounds,
  approvalDecision,
  onApprove,
  onMarkOrdered,
  onUploadConfirmation,
  onUploadInvoice,
  onDownloadAttachment,
  onAddNegotiationNote,
  onAskAgent,
  title,
  onRenameTitle,
}: {
  lines: DemoLine[];
  approved: boolean;
  orderRecorded: boolean;
  confirmationUploaded: boolean;
  attachments: OrderAttachment[];
  confirmationRounds: ConfirmationRound[];
  approvalDecision: DemoState['approvalDecision'];
  onApprove: () => void;
  onMarkOrdered: (meta: MarkOrderMeta) => void;
  onUploadConfirmation: () => void;
  onUploadInvoice: () => void;
  onDownloadAttachment: (attachment: OrderAttachment) => void;
  onAddNegotiationNote: (text: string) => void;
  onAskAgent: (text: string) => void;
  title: string;
  onRenameTitle: (title: string) => void;
}) {
  const [rulesOpen, setRulesOpen] = useState(false);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [markOrderedOpen, setMarkOrderedOpen] = useState(false);
  const actionBar = useActionBarStickyHeight();
  const invoiceUploaded = hasInvoiceAttachment(attachments);

  return (
    <CanvasScrollShell footer={<SubtotalBar lines={lines} confirmationUploaded={confirmationUploaded} />}>
      <CanvasHeader
        title={title}
        poProgress={orderRecorded ? 'ordered' : 'draft'}
        onTitleChange={onRenameTitle}
        meta={<SupplierRulesLink onOpen={() => setRulesOpen(true)} />}
      />
      <CanvasActionBar barRef={actionBar.ref}>
        <div className="flex flex-wrap items-center gap-2">
          <ViewAttachmentsButton count={attachments.length} onClick={() => setAttachmentsOpen(true)} />
          <ViewNegotiationLogButton count={confirmationRounds.length} onClick={() => setLogOpen(true)} />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl"
            disabled={orderRecorded}
            onClick={onUploadConfirmation}
          >
            {confirmationUploaded ? 'Re-upload confirmation' : PORTFOLIO_COPY.uploadConfirmation}
          </Button>
          {orderRecorded ? (
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl"
              onClick={onUploadInvoice}
            >
              {invoiceUploaded ? PORTFOLIO_COPY.reuploadInvoice : PORTFOLIO_COPY.uploadInvoice}
            </Button>
          ) : null}
          {!approved ? (
            <Button
              type="button"
              className="h-10 rounded-xl bg-[#2f6bff] text-white hover:bg-[#2458d9]"
              disabled={orderRecorded || !confirmationUploaded}
              onClick={onApprove}
            >
              {PORTFOLIO_COPY.approve}
            </Button>
          ) : null}
          {approved && !orderRecorded ? (
            <Button
              type="button"
              className="h-10 rounded-xl bg-[#2f6bff] text-white hover:bg-[#2458d9]"
              onClick={() => setMarkOrderedOpen(true)}
            >
              {PORTFOLIO_COPY.markOrdered}
            </Button>
          ) : null}
        </div>
      </CanvasActionBar>
      <div className="space-y-4 px-6 py-5">
        {approvalDecision === 'invalidated' ? (
          <div className="rounded-2xl border border-[#f5c2c2] bg-[#fdecec] px-4 py-3 text-[13px] text-[#8a3030]">
            {PORTFOLIO_COPY.approvalInvalidatedBanner}
          </div>
        ) : null}

        <LineTable
          lines={lines}
          editable={false}
          stickyOffsetTop={actionBar.stickTop}
          onUpdateEstQty={() => undefined}
          onUpdateConfQty={() => undefined}
          onUpdateEstPrice={() => undefined}
          onUpdateConfPrice={() => undefined}
          onDeleteSku={() => undefined}
          onDeleteSpu={() => undefined}
          onAskAgent={onAskAgent}
        />
      </div>
      <AttachmentsSheet
        open={attachmentsOpen}
        onOpenChange={setAttachmentsOpen}
        attachments={attachments}
        approved={approved}
        onDownload={onDownloadAttachment}
      />
      <NegotiationLogSheet
        open={logOpen}
        onOpenChange={setLogOpen}
        rounds={confirmationRounds}
        locked={orderRecorded}
        approved={approved}
        onAdd={onAddNegotiationNote}
      />
      <MarkOrderedDialog
        open={markOrderedOpen}
        onOpenChange={setMarkOrderedOpen}
        onConfirm={onMarkOrdered}
      />
      <SupplierRulesSheet
        open={rulesOpen}
        onOpenChange={setRulesOpen}
        goodsSubtotal={goodsTotal(lines)}
      />
    </CanvasScrollShell>
  );
}

/** 收货 Notes：先 DDT vs 下单，再 Actual vs DDT；hold 操作同确认单风格 */
function ReceivingNoteCell({
  line,
  shortVsOrder,
  overVsOrder,
  shortVsDdt,
  overVsDdt,
  missing,
  onAskAgent,
  onSetDisposition,
}: {
  line: ReceivingLine;
  shortVsOrder: boolean;
  overVsOrder: boolean;
  shortVsDdt: boolean;
  overVsDdt: boolean;
  missing: boolean;
  onAskAgent: (text: string) => void;
  onSetDisposition: (sku: string, disposition: ReceivingLine['disposition']) => void;
}) {
  const notes: string[] = [];
  const open = openOrderedOf(line);
  if (shortVsOrder) {
    notes.push(PORTFOLIO_COPY.receivingNoteShortVsOrder(open - line.ddt, open, line.ddt));
  } else if (overVsOrder) {
    notes.push(PORTFOLIO_COPY.receivingNoteOverVsOrder(line.ddt - open, open, line.ddt));
  }
  if (shortVsDdt) {
    notes.push(PORTFOLIO_COPY.receivingNoteShortVsDdt(line.ddt - line.counted, line.ddt, line.counted));
  } else if (overVsDdt) {
    notes.push(PORTFOLIO_COPY.receivingNoteOverVsDdt(line.counted - line.ddt, line.ddt, line.counted));
  }
  if (missing) {
    notes.push(PORTFOLIO_COPY.receivingNoteMissing(open));
  }
  if (line.disposition === 'hold') {
    notes.push(PORTFOLIO_COPY.receivingNoteHold);
  } else if (line.disposition === 'return') {
    notes.push(PORTFOLIO_COPY.receivingNoteReturn);
  }

  if (notes.length === 0) {
    return <span className="text-[11px] text-[#8b93a7]">-</span>;
  }

  const warm = shortVsOrder || overVsOrder || shortVsDdt || overVsDdt || line.disposition !== 'receive';
  const tone = !warm && missing ? 'text-[#2f6bff]' : 'text-[#b35b1f]';
  const primary = notes[0];

  return (
    <div className="min-w-0 space-y-1.5">
      <button
        type="button"
        className={cn(
          'inline-flex max-w-full cursor-pointer items-start gap-1.5 text-left text-[11px] leading-snug hover:underline',
          tone,
        )}
        onClick={() => onAskAgent(
          shortVsOrder || overVsOrder
            ? `Why is ${line.sku} short vs order?`
            : shortVsDdt || overVsDdt
              ? `Why is ${line.sku} short vs DDT?`
              : missing
                ? `Why is ${line.sku} not on this DDT?`
                : `Check ${line.sku}: ${primary}`,
        )}
      >
        <AlertTriangleIcon className="mt-0.5 size-3 shrink-0" />
        <span className="min-w-0 whitespace-normal">
          {notes.map((note) => (
            <span key={note} className="block">{note}</span>
          ))}
        </span>
      </button>
      {line.disposition === 'hold' ? (
        <div className="flex flex-wrap items-center gap-2 pl-4">
          <button
            type="button"
            className="cursor-pointer text-[11px] font-medium text-[#2f6bff] hover:underline"
            onClick={() => onSetDisposition(line.sku, 'receive')}
          >
            {PORTFOLIO_COPY.acceptGift}
          </button>
          <button
            type="button"
            className="cursor-pointer text-[11px] font-medium text-[#c23b3b] hover:underline"
            onClick={() => onSetDisposition(line.sku, 'return')}
          >
            {PORTFOLIO_COPY.returnLine}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ReceivingWorkspaceView({
  variant = 'receiving',
  orderedQty,
  receiptBatches,
  currentDdtReady,
  awaitingRemainingDecision,
  remainingDecision,
  receivingComplete,
  lines,
  attachments,
  approved,
  orderAt,
  orderedBy,
  expectedArrival,
  learningDecision = null,
  onUploadDdt,
  onUploadInvoice,
  onHandleRemaining,
  onUpdateCounted,
  onSetDisposition,
  onConfirmReceipt,
  onReviewOrder,
  onDownloadAttachment,
  onAskAgent,
  title,
  onRenameTitle,
  coverageDays = DEMO_COVERAGE_DAYS,
}: {
  /** receiving=收货操作；retrospective=同结构完整 PO，主按钮改为复盘 */
  variant?: 'receiving' | 'retrospective';
  orderedQty: number;
  receiptBatches: ReceiptBatchSnapshot[];
  currentDdtReady: boolean;
  awaitingRemainingDecision: boolean;
  remainingDecision: RemainingReceiptDecision | null;
  receivingComplete: boolean;
  lines: ReceivingLine[];
  attachments: OrderAttachment[];
  approved: boolean;
  orderAt: string | null;
  orderedBy: string | null;
  expectedArrival: string | null;
  learningDecision?: DemoState['learningDecision'];
  /** 计划覆盖天数 → 复盘销量窗口 */
  coverageDays?: number;
  onUploadDdt: () => void;
  onUploadInvoice: () => void;
  onHandleRemaining: (decision: RemainingReceiptDecision) => void;
  onUpdateCounted: (sku: string, qty: number) => void;
  onSetDisposition: (sku: string, disposition: ReceivingLine['disposition']) => void;
  onConfirmReceipt: () => void;
  onReviewOrder?: () => void;
  onDownloadAttachment: (attachment: OrderAttachment) => void;
  onAskAgent: (text: string) => void;
  title: string;
  onRenameTitle: (title: string) => void;
}) {
  const isRetrospective = variant === 'retrospective';
  const blocked = hasUnresolvedHold(lines);
  const invoiceUploaded = hasInvoiceAttachment(attachments);
  const soldWindowDays = coverageDays > 0 ? coverageDays : DEMO_COVERAGE_DAYS;
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [poInfoOpen, setPoInfoOpen] = useState(false);
  const [remainingOpen, setRemainingOpen] = useState(false);
  const [remainingPick, setRemainingPick] = useState<RemainingReceiptDecision>(
    remainingDecision ?? 'wait_next_batch',
  );
  const actionBar = useActionBarStickyHeight();
  const { sentinelRef: receivingStickySentinelRef, stuck: receivingHeaderStuck } = useStickyStuck(
    actionBar.stickTop,
  );
  // 表头 / 表体横向滚动同步（表头 sticky 在中间内容区）
  const receivingHeadScrollRef = useRef<HTMLDivElement>(null);
  const receivingBodyScrollRef = useRef<HTMLDivElement>(null);
  const syncReceivingHeadScroll = (event: UIEvent<HTMLDivElement>) => {
    if (receivingHeadScrollRef.current) {
      receivingHeadScrollRef.current.scrollLeft = event.currentTarget.scrollLeft;
    }
  };

  const stockedQty = lines.reduce((sum, line) => sum + line.stocked, 0);
  const openQty = lines.reduce((sum, line) => sum + Math.max(0, line.ordered - line.stocked), 0);
  // 复盘：进度按全部到货展示（100%），不沿用收货过程中的部分比例
  const progressPct = isRetrospective
    ? 100
    : orderedQty > 0
      ? Math.min(100, Math.round((stockedQty / orderedQty) * 100))
      : 0;
  const progressStockedDisplay = isRetrospective ? orderedQty : stockedQty;
  const batch1 = receiptBatches.find((batch) => batch.batchNo === 1) ?? null;
  const batch2 = receiptBatches.find((batch) => batch.batchNo === 2) ?? null;
  const nextBatchNo = receiptBatches.length + 1;
  const canUploadDdt = !isRetrospective && !receivingComplete && !currentDdtReady && !awaitingRemainingDecision;
  // DDT 已上传且未完成即可点 Confirm；若仍有 hold，点击后由 handler 提示
  const canConfirm = !isRetrospective && currentDdtReady && !receivingComplete;
  // 对齐 PoDetail：有已确认批次且仍有 open qty，或刚确认后强制处理剩余
  const canHandleRemaining = !isRetrospective && !receivingComplete && (
    awaitingRemainingDecision || (receiptBatches.length > 0 && openQty > 0)
  );
  const reviewDone = learningDecision === 'accepted' || learningDecision === 'dismissed';

  const progressLabel = isRetrospective
    ? (reviewDone ? PORTFOLIO_COPY.retrospectiveStatusDone : PORTFOLIO_COPY.retrospectiveStatusFullyReceived)
    : receivingComplete
      ? PORTFOLIO_COPY.receivingStatusComplete
      : awaitingRemainingDecision
        ? PORTFOLIO_COPY.receivingStatusAwaitingRemaining
        : currentDdtReady
          ? PORTFOLIO_COPY.receivingStatusReady
          : stockedQty > 0
            ? PORTFOLIO_COPY.receivingStatusPartial
            : PORTFOLIO_COPY.receivingStatusWaitingDdt;

  // 有入库进度但未完成 → Received 显示部分圆
  const poProgressKey: PoProgressKey = receivingComplete
    ? 'received'
    : stockedQty > 0 || receiptBatches.length > 0
      ? 'partial'
      : 'ordered';

  const remainingOptionEntries = [
    'wait_next_batch',
    'supplier_delay',
    'close_remaining',
    'return_no_stock',
  ] as const;

  const progressMeta = isRetrospective
    ? [
        receiptBatches.length > 0
          ? PORTFOLIO_COPY.receivingPoBatchSummary(
            receiptBatches.length,
            receiptBatches.reduce((sum, batch) => sum + summarizeReceiptBatch(batch).pcs, 0),
          )
          : null,
        reviewDone ? null : 'Use Review this order to discuss forecast quality',
      ].filter(Boolean).join(' · ')
    : [
        batch1 ? PORTFOLIO_COPY.receivingBatch1Note : null,
        batch2 ? PORTFOLIO_COPY.receivingBatch2Note : null,
        remainingDecision ? `Remaining: ${PORTFOLIO_COPY.remainingOptions[remainingDecision].title}` : null,
      ].filter(Boolean).join(' · ');

  const orderAtLabel = orderAt ? orderAt.replace('T', ' ').slice(0, 16) : '-';
  const expectedLabel = expectedArrival || '-';
  const groups = useMemo(() => groupReceivingLinesBySpu(lines), [lines]);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  // 复盘：默认展开全部 SPU，便于看完整采购单
  useEffect(() => {
    if (!isRetrospective || groups.length === 0) return;
    setExpanded(new Set(groups.map((group) => group.key)));
  }, [isRetrospective, groups]);
  /** 本批 DDT 未到货（仍有 open qty）- 与 DDT vs 下单用不同色 */
  const isMissingOnDdt = (line: ReceivingLine) => (
    currentDdtReady && line.ordered > 0 && line.ddt === 0 && line.stocked < line.ordered
  );
  /** 暖色关注：DDT vs 下单 / Actual vs DDT / hold */
  const isWarmGap = (line: ReceivingLine) => (
    currentDdtReady && (
      line.disposition === 'hold'
      || isDdtShortVsOrder(line)
      || isDdtOverVsOrder(line)
      || isActualDiffersDdt(line)
    )
  );

  const attentionKeys = useMemo(() => new Set(
    groups
      .filter((group) => group.items.some((line) => (
        (currentDdtReady && (
          line.disposition === 'hold'
          || isDdtShortVsOrder(line)
          || isDdtOverVsOrder(line)
          || isActualDiffersDdt(line)
        ))
        || (currentDdtReady && line.ordered > 0 && line.ddt === 0 && line.stocked < line.ordered)
      )))
      .map((group) => group.key),
  ), [groups, currentDdtReady]);

  useEffect(() => {
    if (attentionKeys.size === 0) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      attentionKeys.forEach((key) => next.add(key));
      return next;
    });
  }, [attentionKeys]);

  const allExpanded = groups.length > 0 && groups.every((g) => expanded.has(g.key));
  const toggleGroup = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // 对齐 PoDetail：无 DDT 列默认不出现；上传后出现当前批；确认后再上传才出现下一批
  const batchCols = useMemo((): ReceiptBatchCol[] => {
    const cols: ReceiptBatchCol[] = receiptBatches.map((batch) => ({
      key: `confirmed-${batch.batchNo}`,
      batchNo: batch.batchNo,
      labelIndex: batch.batchNo,
      mode: 'confirmed' as const,
    }));
    if (currentDdtReady) {
      cols.push({
        key: `current-${nextBatchNo}`,
        batchNo: nextBatchNo,
        labelIndex: nextBatchNo,
        mode: 'current',
      });
    }
    return cols;
  }, [receiptBatches, currentDdtReady, nextBatchNo]);

  // 上传 DDT 后显示 Notes；复盘：Sold(覆盖期) + Notes + Discuss
  const showNotesCol = currentDdtReady || isRetrospective;
  const gridTemplateColumns = [
    'minmax(0,1.7fr)',
    '64px',
    ...batchCols.flatMap(() => ['64px', '72px']),
    '48px',
    '64px',
    ...(isRetrospective ? ['72px'] : []),
    ...(showNotesCol ? ['minmax(168px,1.2fr)'] : []),
    ...(isRetrospective ? ['72px'] : []),
  ].join(' ');

  const batchValuesFor = (line: ReceivingLine, col: ReceiptBatchCol) => {
    if (col.mode === 'current') {
      return { ddt: line.ddt, actual: line.counted as number | null, editable: true };
    }
    const snap = receiptBatches.find((batch) => batch.batchNo === col.batchNo)?.bySku[line.sku];
    return { ddt: snap?.ddt ?? 0, actual: snap?.counted ?? null, editable: false };
  };

  return (
    <CanvasScrollShell>
      <CanvasHeader
        title={title}
        poProgress={poProgressKey}
        onTitleChange={onRenameTitle}
        meta={<SupplierRulesLink onOpen={() => setRulesOpen(true)} />}
      />

      {/* 操作栏吸顶：标题可滚走，按钮栏始终固定 */}
      <CanvasActionBar barRef={actionBar.ref}>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl"
            onClick={() => setPoInfoOpen(true)}
          >
            <FileTextIcon className="size-3.5" />
            {PORTFOLIO_COPY.receivingPoInfoButton}
          </Button>
          <ViewAttachmentsButton count={attachments.length} onClick={() => setAttachmentsOpen(true)} />
          {/* 已下单后可登记供应商发票（对齐生产 ordered 阶段） */}
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl"
            onClick={onUploadInvoice}
          >
            {invoiceUploaded ? PORTFOLIO_COPY.reuploadInvoice : PORTFOLIO_COPY.uploadInvoice}
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {isRetrospective ? (
            <Button
              type="button"
              data-coach="review-order"
              className="h-10 rounded-xl bg-[#2f6bff] text-white hover:bg-[#2458d9]"
              disabled={reviewDone}
              onClick={() => onReviewOrder?.()}
            >
              {reviewDone ? PORTFOLIO_COPY.reviewOrderDone : PORTFOLIO_COPY.reviewOrder}
            </Button>
          ) : (
            <>
              <Button
                type="button"
                data-coach="upload-ddt"
                variant="outline"
                className="h-10 rounded-xl"
                disabled={!canUploadDdt}
                onClick={onUploadDdt}
              >
                {currentDdtReady ? PORTFOLIO_COPY.uploadDdtDone : PORTFOLIO_COPY.uploadDdt}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl"
                disabled={!canHandleRemaining}
                onClick={() => {
                  setRemainingPick(remainingDecision ?? (openQty > 0 ? 'wait_next_batch' : 'close_remaining'));
                  setRemainingOpen(true);
                }}
              >
                {PORTFOLIO_COPY.handleRemaining}
              </Button>
              <Button
                type="button"
                className="h-10 rounded-xl bg-[#2f6bff] text-white hover:bg-[#2458d9]"
                disabled={!canConfirm}
                title={
                  blocked
                    ? PORTFOLIO_COPY.holdUnresolved
                    : undefined
                }
                onClick={onConfirmReceipt}
              >
                {PORTFOLIO_COPY.confirmReceipt}
              </Button>
            </>
          )}
        </div>
      </CanvasActionBar>

      <div className="space-y-4 px-6 py-5">
        {/* 原 Purchase order 位置：收货进度 */}
        <section className="rounded-2xl border border-[#e8eaef] px-4 py-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[11px] font-medium text-[#8b93a7]">{PORTFOLIO_COPY.receivingProgressLabel}</span>
            <span className="text-[13px] font-semibold text-[#1a1d26]">{progressLabel}</span>
            <span className="text-[12px] tabular-nums text-[#5c6478]">
              {progressStockedDisplay}/{orderedQty} pcs
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eef0f4]">
            <div
              className="h-full rounded-full bg-[#2f6bff] transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {progressMeta ? (
            <p className="mt-1.5 text-[11px] leading-relaxed text-[#8b93a7]">{progressMeta}</p>
          ) : null}
        </section>

        {awaitingRemainingDecision ? (
          <p className="text-[12px] text-[#b35b1f]">{PORTFOLIO_COPY.remainingRequiredHint}</p>
        ) : null}

        {!currentDdtReady && receiptBatches.length === 0 ? (
          <p className="text-[12px] text-[#8b93a7]">{PORTFOLIO_COPY.receivingEmptyHint}</p>
        ) : null}

        {/* 哨兵 + 卡片同包一层；未吸顶圆角，吸顶后直角 */}
        <div className="relative">
          <div
            ref={receivingStickySentinelRef}
            className="pointer-events-none absolute top-0 h-px w-full"
            aria-hidden
          />
          <div
            className={cn(
              'rounded-b-2xl border border-[#e8eaef] bg-white',
              receivingHeaderStuck ? 'rounded-t-none' : 'rounded-t-2xl',
            )}
          >
          <div
            className={cn(
              'sticky z-20 bg-white',
              !receivingHeaderStuck && 'overflow-hidden rounded-t-2xl',
            )}
            style={{ top: actionBar.stickTop }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[#e8eaef] bg-[#fafbfc] px-4 py-2">
              <span className="text-[11px] text-[#8b93a7]">
                {PORTFOLIO_COPY.receivingItemsMeta(groups.length, lines.length)}
              </span>
              <button
                type="button"
                className="cursor-pointer text-[11px] font-medium text-[#2f6bff] hover:underline"
                onClick={() => setExpanded(allExpanded ? new Set() : new Set(groups.map((g) => g.key)))}
              >
                {allExpanded ? 'Collapse all' : 'Expand all'}
              </button>
            </div>
            <div ref={receivingHeadScrollRef} className="overflow-x-hidden border-b border-[#e8eaef] bg-[#f6f7f9]">
              <div
                className="grid gap-2 px-3 py-2 text-[11px] font-medium text-[#8b93a7]"
                style={{
                  gridTemplateColumns,
                  minWidth: batchCols.length > 0 ? 780 + batchCols.length * 140 + (isRetrospective ? 160 : 0) : 520,
                }}
              >
                <span>{PORTFOLIO_COPY.receivingColProduct}</span>
                <span className="text-right">{PORTFOLIO_COPY.receivingColQty}</span>
                {batchCols.map((col) => (
                  <Fragment key={`${col.key}-h`}>
                    <span className="text-right">{receiptBatchColLabel('DDT', col.labelIndex)}</span>
                    <span className="text-right">{receiptBatchColLabel('Actual', col.labelIndex)}</span>
                  </Fragment>
                ))}
                <span>{PORTFOLIO_COPY.receivingColUnit}</span>
                <span className="text-right">{PORTFOLIO_COPY.receivingColReceived}</span>
                {isRetrospective ? (
                  <span
                    className="text-right"
                    title={PORTFOLIO_COPY.receivingColSoldHint}
                  >
                    {PORTFOLIO_COPY.receivingColSoldAfter(soldWindowDays)}
                  </span>
                ) : null}
                {showNotesCol ? (
                  <span>{PORTFOLIO_COPY.receivingColNotes}</span>
                ) : null}
                {isRetrospective ? (
                  <span className="text-right">{PORTFOLIO_COPY.receivingColActions}</span>
                ) : null}
              </div>
            </div>
          </div>
          {/* 表体单独裁切底圆角，避免行背景冲出；不影响上方 sticky */}
          <div className="overflow-hidden rounded-b-2xl">
          <div ref={receivingBodyScrollRef} className="overflow-x-auto" onScroll={syncReceivingHeadScroll}>
            <div style={{ minWidth: batchCols.length > 0 ? 780 + batchCols.length * 140 + (isRetrospective ? 160 : 0) : 520 }}>
              {groups.map((group) => {
                const open = expanded.has(group.key);
                const agg = group.items.reduce(
                  (acc, line) => {
                    acc.ordered += line.ordered;
                    acc.stocked += line.stocked;
                    if (line.disposition === 'hold') acc.holds += 1;
                    const outcome = isRetrospective ? outcomeForReceivingLine(line) : null;
                    if (outcome) {
                      acc.sold += outcome.sold;
                      acc.soldKnown = true;
                      if (outcome.note) acc.notes.push(outcome.note);
                    }
                    batchCols.forEach((col) => {
                      const values = batchValuesFor(line, col);
                      acc.byCol[col.key] = acc.byCol[col.key] ?? { ddt: 0, actual: 0 };
                      acc.byCol[col.key].ddt += values.ddt;
                      acc.byCol[col.key].actual += values.actual ?? 0;
                    });
                    return acc;
                  },
                  {
                    ordered: 0,
                    stocked: 0,
                    sold: 0,
                    soldKnown: false,
                    holds: 0,
                    notes: [] as string[],
                    byCol: {} as Record<string, { ddt: number; actual: number }>,
                  },
                );
                const groupHasWarm = group.items.some((line) => isWarmGap(line));
                const groupHasMissing = group.items.some((line) => isMissingOnDdt(line));
                // 暖色=数量/hold；冷蓝=本批未到货；两者并存时暖色优先
                const groupBg = groupHasWarm
                  ? 'bg-[#fff8f1]'
                  : groupHasMissing
                    ? 'bg-[#eef4ff]'
                    : 'bg-[#f3f4f7]';
                const groupHover = groupHasWarm
                  ? 'hover:bg-[#fff3e8]'
                  : groupHasMissing
                    ? 'hover:bg-[#e4edff]'
                    : 'hover:bg-[#eceef3]';

                return (
                  <Fragment key={group.key}>
                    <div
                      className={cn(
                        'grid w-full items-center gap-2 border-b border-[#eef0f4] px-3 py-2.5 text-left',
                        groupBg,
                        groupHover,
                      )}
                      style={{ gridTemplateColumns }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.key)}
                        className="min-w-0 cursor-pointer truncate text-left text-[13px] font-medium text-[#1a1d26]"
                      >
                        <span className="mr-1.5 inline-block w-3 text-[#5c6478]">{open ? '▾' : '▸'}</span>
                        {group.label}
                        <span className="ml-2 text-[11px] font-normal text-[#8b93a7]">
                          {group.items.length} SKU{group.items.length > 1 ? 's' : ''}
                        </span>
                      </button>
                      <span className="text-right text-[12px] font-semibold tabular-nums">{agg.ordered}</span>
                      {batchCols.map((col) => {
                        const values = agg.byCol[col.key];
                        return (
                          <Fragment key={`${group.key}-${col.key}-agg`}>
                            <span className="text-right text-[12px] font-semibold tabular-nums">
                              {values?.ddt || '-'}
                            </span>
                            <span className="text-right text-[12px] font-semibold tabular-nums">
                              {values?.actual || '-'}
                            </span>
                          </Fragment>
                        );
                      })}
                      <span className="text-[11px] text-[#8b93a7]">-</span>
                      <span className="text-right text-[12px] font-semibold tabular-nums">{agg.stocked}</span>
                      {isRetrospective ? (
                        <span className="text-right text-[12px] font-semibold tabular-nums">
                          {agg.soldKnown ? agg.sold : '-'}
                        </span>
                      ) : null}
                      {showNotesCol ? (
                        <span className={cn(
                          'text-[11px]',
                          isRetrospective
                            ? 'text-[#5c6478]'
                            : groupHasWarm || groupHasMissing ? 'font-medium text-[#b35b1f]' : 'text-[#8b93a7]',
                        )}
                        >
                          {isRetrospective
                            ? (agg.notes[0]
                              ? (group.items.length > 1 ? `${agg.notes.length} SKU notes` : agg.notes[0])
                              : '-')
                            : (groupHasWarm || groupHasMissing ? 'Gaps in SKUs' : '-')}
                        </span>
                      ) : null}
                      {isRetrospective ? (
                        <button
                          type="button"
                          className="justify-self-end cursor-pointer text-[11px] font-medium text-[#2f6bff] hover:underline"
                          onClick={() => onAskAgent(PORTFOLIO_COPY.discussSpuPrompt(group.productCode))}
                        >
                          {PORTFOLIO_COPY.discussWithAgent}
                        </button>
                      ) : null}
                    </div>
                    {open
                      ? group.items.map((line) => {
                        const shortVsOrder = currentDdtReady && isDdtShortVsOrder(line);
                        const overVsOrder = currentDdtReady && isDdtOverVsOrder(line);
                        const shortVsDdt = currentDdtReady && line.ddt > 0 && line.counted < line.ddt;
                        const overVsDdt = currentDdtReady && line.ddt > 0 && line.counted > line.ddt;
                        const missing = isMissingOnDdt(line);
                        const receivedDone = line.ordered > 0 && line.stocked >= line.ordered;
                        const warmAttention = isWarmGap(line);
                        // DDT/Actual 差异=暖橙；本批未到货=冷蓝
                        const rowBg = warmAttention
                          ? 'bg-[#fffaf5]'
                          : missing
                            ? 'bg-[#f5f8ff]'
                            : 'bg-white';
                        // 刚被对话改过的行：内描边点出「改的是这几项」
                        const justUpdated = currentDdtReady && line.justUpdated === true;
                        return (
                          <div
                            key={line.sku}
                            className={cn(
                              'grid items-center gap-2 border-b border-[#eef0f4] px-3 py-3 last:border-b-0',
                              rowBg,
                              justUpdated && 'bg-[#fff4ea] shadow-[inset_2px_0_0_0_#f08c3c]',
                            )}
                            style={{ gridTemplateColumns }}
                          >
                            <div className="min-w-0 pl-8">
                              {/* 与补货计划 LineTable SKU 行一致：sku · variant / nameIt */}
                              <p className="text-[12px] font-medium text-[#1a1d26]">
                                <span className={cn(
                                  'font-mono',
                                  missing ? 'text-[#2f6bff]' : 'text-[#5c6478]',
                                )}
                                >
                                  {line.sku}
                                </span>
                                {line.variant ? (
                                  <>
                                    <span className="mx-1.5 text-[#c5cad6]">·</span>
                                    {line.variant}
                                  </>
                                ) : null}
                              </p>
                              <p className="mt-0.5 truncate text-[11px] text-[#8b93a7]">
                                {line.nameIt}
                              </p>
                            </div>
                            <span className={cn(
                              'text-right tabular-nums text-[13px]',
                              (shortVsOrder || overVsOrder) && 'font-semibold text-[#b35b1f]',
                            )}
                            >
                              {line.ordered}
                            </span>
                            {batchCols.map((col) => {
                              const values = batchValuesFor(line, col);
                              const ddtVsOrderGap = values.editable && (shortVsOrder || overVsOrder);
                              const actualVsDdtGap = values.editable && (shortVsDdt || overVsDdt);
                              return (
                                <Fragment key={`${line.sku}-${col.key}`}>
                                  <span className={cn(
                                    'text-right tabular-nums text-[13px]',
                                    // DDT vs 下单差异：DDT 数暖色（对齐确认单 Conf. qty）
                                    ddtVsOrderGap && 'font-semibold text-[#b35b1f]',
                                  )}
                                  >
                                    {values.ddt || '-'}
                                  </span>
                                  {values.editable ? (
                                    <Input
                                      type="number"
                                      value={line.counted}
                                      className={cn(
                                        'h-8 w-[68px] justify-self-end rounded-lg text-right text-[13px] tabular-nums',
                                        // Actual≠DDT 时暖色描边；仅 DDT vs 下单时不标 Actual
                                        actualVsDdtGap && 'border-[#ffd7b8] bg-[#fffaf5]',
                                        // 刚被对话改过：加重描边，不额外占位
                                        justUpdated && 'border-[#f08c3c] ring-2 ring-[#f08c3c]/25',
                                      )}
                                      onChange={(event) => onUpdateCounted(line.sku, Number(event.target.value) || 0)}
                                    />
                                  ) : (
                                    <span className="text-right tabular-nums text-[13px]">
                                      {values.actual == null ? '-' : values.actual}
                                    </span>
                                  )}
                                </Fragment>
                              );
                            })}
                            <span className="text-[12px] text-[#5c6478]">{line.unit}</span>
                            <span className={cn('text-right tabular-nums text-[13px]', receivedDone && 'font-semibold text-[#2f6bff]')}>
                              {line.stocked}
                            </span>
                            {isRetrospective ? (
                              (() => {
                                const outcome = outcomeForReceivingLine(line);
                                return (
                                  <span className="text-right tabular-nums text-[13px]">
                                    {outcome ? outcome.sold : '-'}
                                  </span>
                                );
                              })()
                            ) : null}
                            {showNotesCol ? (
                              isRetrospective ? (
                                (() => {
                                  const outcome = outcomeForReceivingLine(line);
                                  if (!outcome?.note) {
                                    return <span className="text-[11px] text-[#8b93a7]">-</span>;
                                  }
                                  return (
                                    <p className="text-[11px] leading-snug text-[#5c6478]">
                                      {outcome.note}
                                      {outcome.remaining > 0 ? (
                                        <span className="mt-0.5 block text-[10px] text-[#8b93a7]">
                                          Left in stock {outcome.remaining}
                                        </span>
                                      ) : null}
                                    </p>
                                  );
                                })()
                              ) : (
                                <ReceivingNoteCell
                                  line={line}
                                  shortVsOrder={shortVsOrder}
                                  overVsOrder={overVsOrder}
                                  shortVsDdt={shortVsDdt}
                                  overVsDdt={overVsDdt}
                                  missing={missing}
                                  onAskAgent={onAskAgent}
                                  onSetDisposition={onSetDisposition}
                                />
                              )
                            ) : null}
                            {isRetrospective ? (
                              <button
                                type="button"
                                className="justify-self-end cursor-pointer text-[11px] font-medium text-[#2f6bff] hover:underline"
                                onClick={() => onAskAgent(PORTFOLIO_COPY.discussSkuPrompt(line.sku))}
                              >
                                {PORTFOLIO_COPY.discussWithAgent}
                              </button>
                            ) : null}
                          </div>
                        );
                      })
                      : null}
                  </Fragment>
                );
              })}
            </div>
          </div>
          </div>
          </div>
        </div>
      </div>

      <Dialog open={remainingOpen} onOpenChange={setRemainingOpen}>
        <DialogContent className="max-w-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{PORTFOLIO_COPY.remainingDialogTitle}</DialogTitle>
            <DialogDescription>
              {PORTFOLIO_COPY.remainingDialogIntro(openQty)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 sm:grid-cols-2">
            {remainingOptionEntries.map((key) => {
              const option = PORTFOLIO_COPY.remainingOptions[key];
              const selected = remainingPick === key;
              return (
                <button
                  key={key}
                  type="button"
                  className={cn(
                    'rounded-xl border p-3 text-left transition-colors',
                    selected
                      ? 'border-[#2f6bff] bg-[#f3f7ff] text-[#1a1d26]'
                      : 'border-[#e8eaef] bg-white hover:bg-[#fafbfc]',
                  )}
                  onClick={() => setRemainingPick(key)}
                >
                  <span className="block text-[13px] font-semibold">{option.title}</span>
                  <span className="mt-1 block text-[11px] leading-relaxed text-[#5c6478]">{option.description}</span>
                  <span className="mt-2 block text-[11px] leading-relaxed text-[#8b93a7]">{option.result}</span>
                </button>
              );
            })}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setRemainingOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-[#2f6bff] hover:bg-[#2458d9]"
              onClick={() => {
                onHandleRemaining(remainingPick);
                setRemainingOpen(false);
              }}
            >
              Save decision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AttachmentsSheet
        open={attachmentsOpen}
        onOpenChange={setAttachmentsOpen}
        attachments={attachments}
        approved={approved}
        onDownload={onDownloadAttachment}
      />

      {/* 订单信息：右侧 panel（边距对齐 SupplierRulesSheet） */}
      <Sheet open={poInfoOpen} onOpenChange={setPoInfoOpen}>
        <SheetContent
          side="right"
          className="w-full p-0 sm:max-w-md"
          aria-label={PORTFOLIO_COPY.receivingPoInfoTitle}
        >
          <SheetHeader className="border-b border-[#eef0f4] px-5 py-4 text-left">
            <SheetTitle className="text-[16px]">{PORTFOLIO_COPY.receivingPoInfoTitle}</SheetTitle>
            <SheetDescription className="text-[12px]">
              {PORTFOLIO_COPY.receivingPoInfoSheetMeta}
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
            {([
              {
                title: PORTFOLIO_COPY.receivingPoSectionDocument,
                rows: [
                  [PORTFOLIO_COPY.receivingPoFieldPoNo, PORTFOLIO_COPY.poNo],
                  [PORTFOLIO_COPY.receivingPoFieldTitle, title],
                  [PORTFOLIO_COPY.receivingPoFieldStatus, progressLabel],
                ],
              },
              {
                title: PORTFOLIO_COPY.receivingPoSectionSupplier,
                rows: [
                  [PORTFOLIO_COPY.receivingPoFieldSupplier, MNP_SUPPLIER_RULES.name],
                  [PORTFOLIO_COPY.receivingPoFieldContact, MNP_SUPPLIER_RULES.contact],
                  [PORTFOLIO_COPY.receivingPoFieldWebsite, MNP_SUPPLIER_RULES.website],
                  [PORTFOLIO_COPY.receivingPoFieldLanguage, MNP_SUPPLIER_RULES.language],
                ],
              },
              {
                title: PORTFOLIO_COPY.receivingPoSectionOrder,
                rows: [
                  [PORTFOLIO_COPY.receivingPoFieldOrderDate, orderAtLabel],
                  [PORTFOLIO_COPY.receivingPoFieldOperator, orderedBy || '-'],
                  [PORTFOLIO_COPY.receivingPoFieldExpectedArrival, expectedLabel],
                  [
                    PORTFOLIO_COPY.receivingPoFieldPayment,
                    `${MNP_SUPPLIER_RULES.paymentMethod} · ${
                      MNP_SUPPLIER_RULES.paymentDays === 0
                        ? 'prepaid / immediate'
                        : `${MNP_SUPPLIER_RULES.paymentDays} days`
                    }`,
                  ],
                  [
                    PORTFOLIO_COPY.receivingPoFieldLeadTime,
                    `Median ${MNP_SUPPLIER_RULES.leadTimeMedianDays}d · p90 ${MNP_SUPPLIER_RULES.leadTimeP90Days}d`,
                  ],
                ],
              },
              {
                title: PORTFOLIO_COPY.receivingPoSectionReceipt,
                rows: [
                  [
                    PORTFOLIO_COPY.receivingPoFieldLines,
                    PORTFOLIO_COPY.receivingItemsMeta(groups.length, lines.length),
                  ],
                  [
                    PORTFOLIO_COPY.receivingPoFieldQty,
                    `${stockedQty} / ${orderedQty} pcs received`,
                  ],
                  [
                    PORTFOLIO_COPY.receivingPoFieldAttachments,
                    String(attachments.length),
                  ],
                  [
                    PORTFOLIO_COPY.receivingPoFieldInvoice,
                    invoiceUploaded
                      ? (attachments.find((item) => item.kind === 'invoice')?.fileName ?? 'Uploaded')
                      : '-',
                  ],
                  [
                    PORTFOLIO_COPY.receivingPoFieldRemaining,
                    remainingDecision
                      ? PORTFOLIO_COPY.remainingOptions[remainingDecision].title
                      : '-',
                  ],
                ],
              },
            ] as Array<{ title: string; rows: Array<[string, string]> }>).map((section) => (
              <section key={section.title} className="space-y-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b93a7]">
                  {section.title}
                </h3>
                <div className="overflow-hidden rounded-2xl border border-[#e8eaef]">
                  {section.rows.map(([label, value], index) => (
                    <div
                      key={label}
                      className={cn(
                        'px-4 py-3',
                        index > 0 && 'border-t border-[#eef0f4]',
                      )}
                    >
                      <p className="text-[11px] text-[#8b93a7]">{label}</p>
                      <p className="mt-0.5 break-words text-[13px] font-medium text-[#1a1d26]">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* 分批入库统计：时间 + 数量汇总，不展开 SKU 明细 */}
            <section className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b93a7]">
                {PORTFOLIO_COPY.receivingPoSectionReceiptBatches}
              </h3>
              {receiptBatches.length === 0 ? (
                <div className="rounded-2xl border border-[#e8eaef] px-4 py-3 text-[13px] text-[#8b93a7]">
                  {PORTFOLIO_COPY.receivingPoNoBatchesYet}
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-[#e8eaef]">
                  {receiptBatches.map((batch, index) => {
                    const stats = summarizeReceiptBatch(batch);
                    const when = batch.confirmedAt || receiptBatchConfirmedAt(batch.batchNo);
                    return (
                      <div
                        key={batch.id}
                        className={cn('px-4 py-3', index > 0 && 'border-t border-[#eef0f4]')}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-[#1a1d26]">
                              Batch {batch.batchNo} · {batch.label}
                            </p>
                            <p className="mt-0.5 text-[11px] text-[#8b93a7]">
                              {PORTFOLIO_COPY.receivingPoBatchConfirmedAt}: {when}
                            </p>
                          </div>
                          <p className="shrink-0 text-right text-[12px] font-medium tabular-nums text-[#2f6bff]">
                            {PORTFOLIO_COPY.receivingPoBatchLineMeta(stats.skuCount, stats.pcs)}
                          </p>
                        </div>
                        <p className="mt-1.5 text-[11px] text-[#5c6478]">
                          {PORTFOLIO_COPY.receivingPoBatchStocked}: {stats.pcs} pcs
                          {stats.ddtPcs !== stats.pcs ? ` · DDT total ${stats.ddtPcs}` : ''}
                        </p>
                      </div>
                    );
                  })}
                  <div className="border-t border-[#eef0f4] bg-[#fafbfc] px-4 py-2.5">
                    <p className="text-[12px] font-medium text-[#1a1d26]">
                      {PORTFOLIO_COPY.receivingPoBatchSummary(
                        receiptBatches.length,
                        receiptBatches.reduce((sum, batch) => sum + summarizeReceiptBatch(batch).pcs, 0),
                      )}
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>
        </SheetContent>
      </Sheet>

      <SupplierRulesSheet open={rulesOpen} onOpenChange={setRulesOpen} goodsSubtotal={0} />
    </CanvasScrollShell>
  );
}


export default function PortfolioMainCanvas(props: Props) {
  const { state } = props;
  const stage: DemoStageId = state.stage;
  const title = resolveDocumentTitle(stage, state.documentTitle);
  const onRenameTitle = props.onRenameTitle;

  if (stage === 'intake') {
    return (
      <IntakeView
        draft={state.intakeDraft}
        title={title}
        onGoStage={props.onGoStage}
        onAskAgent={props.onAskAgent}
      />
    );
  }
  if (stage === 'replenishment') {
    if (!state.planGenerated) {
      return <PlanBuildingView title={title} progress={state.progress} />;
    }
    return (
      <ReplenishmentView
        lines={state.lines}
        exportFormat={state.exportFormat}
        attachments={state.attachments}
        confirmationUploaded={state.confirmationUploaded}
        approvalRequiredByRules={state.approvalRequiredByRules}
        approvalSubmitted={state.approvalSubmitted}
        approvalDecision={state.approvalDecision}
        approved={state.approved}
        orderAt={state.orderAt}
        orderedBy={state.orderedBy}
        expectedArrival={state.expectedArrival}
        orderRecorded={state.orderRecorded}
        confirmationRounds={state.confirmationRounds}
        title={title}
        onUpdateEstQty={props.onUpdateEstQty}
        onUpdateConfQty={props.onUpdateConfQty}
        onUpdateEstPrice={props.onUpdateEstPrice}
        onUpdateConfPrice={props.onUpdateConfPrice}
        onDeleteSku={props.onDeleteSku}
        onDeleteSpu={props.onDeleteSpu}
        onExport={props.onExport}
        onDownloadAttachment={props.onDownloadAttachment}
        onUploadConfirmation={props.onUploadConfirmation}
        onUploadInvoice={props.onUploadInvoice}
        onApproveDirect={props.onApproveDirect}
        onPushToOwner={props.onPushToOwner}
        onApproveClick={props.onApproveClick}
        onAddNegotiationNote={props.onAddNegotiationNote}
        onMarkOrdered={props.onMarkOrdered}
        onAskAgent={props.onAskAgent}
        onRenameTitle={onRenameTitle}
      />
    );
  }
  if (stage === 'approval') {
    return (
      <ApprovalView
        lines={state.lines}
        approved={state.approved}
        orderRecorded={state.orderRecorded}
        confirmationUploaded={state.confirmationUploaded}
        attachments={state.attachments}
        confirmationRounds={state.confirmationRounds}
        approvalDecision={state.approvalDecision}
        title={title}
        onApprove={props.onApprove}
        onMarkOrdered={props.onMarkOrdered}
        onUploadConfirmation={props.onUploadConfirmation}
        onUploadInvoice={props.onUploadInvoice}
        onDownloadAttachment={props.onDownloadAttachment}
        onAddNegotiationNote={props.onAddNegotiationNote}
        onAskAgent={props.onAskAgent}
        onRenameTitle={onRenameTitle}
      />
    );
  }
  if (stage === 'receiving' || stage === 'retrospective') {
    return (
      <ReceivingWorkspaceView
        variant={stage === 'retrospective' ? 'retrospective' : 'receiving'}
        orderedQty={state.orderedQty}
        receiptBatches={state.receiptBatches}
        currentDdtReady={stage === 'retrospective' ? false : state.currentDdtReady}
        awaitingRemainingDecision={stage === 'retrospective' ? false : state.awaitingRemainingDecision}
        remainingDecision={state.remainingDecision}
        receivingComplete={stage === 'retrospective' ? true : state.receivingComplete}
        lines={state.receivingLines}
        attachments={state.attachments}
        approved={state.approved}
        orderAt={state.orderAt}
        orderedBy={state.orderedBy}
        expectedArrival={state.expectedArrival}
        learningDecision={state.learningDecision}
        coverageDays={state.intakeDraft?.coverageDays ?? DEMO_COVERAGE_DAYS}
        title={title}
        onUploadDdt={props.onUploadDdt}
        onUploadInvoice={props.onUploadInvoice}
        onHandleRemaining={props.onHandleRemaining}
        onUpdateCounted={props.onUpdateCounted}
        onSetDisposition={props.onSetDisposition}
        onConfirmReceipt={props.onConfirmReceipt}
        onReviewOrder={() => props.onAskAgent(PORTFOLIO_COPY.reviewOrder)}
        onDownloadAttachment={props.onDownloadAttachment}
        onAskAgent={props.onAskAgent}
        onRenameTitle={onRenameTitle}
      />
    );
  }
  return null;
}
