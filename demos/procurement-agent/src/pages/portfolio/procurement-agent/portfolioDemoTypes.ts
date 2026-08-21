/** 作品集 Demo：对齐截图三栏 STAGE 结构 + 生产业务门禁 */

export type DemoStageId =
  | 'intake'
  | 'replenishment'
  | 'approval'
  | 'receiving'
  | 'retrospective';

/** 对齐 PoDetail：处理剩余商品（分批发货 / 结束剩余） */
export type RemainingReceiptDecision =
  | 'wait_next_batch'
  | 'supplier_delay'
  | 'close_remaining'
  | 'return_no_stock';

export type StageStatus = 'current' | 'done' | 'waiting';

export type ChatRole = 'user' | 'agent' | 'status';

export type DemoPhaseKey = 'understand' | 'validate' | 'calculate' | 'explain';

export type DemoStatusMode = 'plan' | 'think';

export type DemoProgress = {
  status: 'idle' | 'running' | 'complete';
  current: DemoPhaseKey | null;
  completed: DemoPhaseKey[];
};

/** 对话内推荐操作（视觉上区别于用户/Agent 气泡） */
export type DemoChatAction = {
  id: string;
  label: string;
  /** 点击后作为用户 prompt 发送 */
  prompt: string;
};

export type DemoChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  /** 结构化要点（差异 / 发现），渲染为 bullet 列表 */
  bullets?: string[];
  /** 跟在 Agent 回复下的推荐操作芯片 */
  actions?: DemoChatAction[];
  /** status 卡片：plan=补货四阶段；think=普通思考 */
  mode?: DemoStatusMode;
  progress?: DemoProgress;
  /** think 模式当前步骤 0-2 */
  thinkStep?: number;
};

export type DemoLine = {
  sku: string;
  /** 归组用 SPU id（对齐生产 product_id，不用 product_code） */
  productId: string;
  productCode: string;
  productName: string;
  /** SKU 规格文案，如 14 ml / Gloss */
  variant: string;
  name: string;
  nameIt: string;
  stock: number;
  sales30: number;
  recommended: number;
  qty: number;
  /** 计划数量；确认单回填后保留以便表格内对比 */
  plannedQty: number;
  estimatedPrice: number;
  confirmedPrice: number | null;
  /** 规划侧提示（慢动销等），非确认单差异 */
  alert?: string;
  risk?: 'price' | 'qty' | 'missing' | 'extra' | null;
};

/** 收货工作区行：来自采购单明细 + 当前批次清点 + 已入库累计 */
export type ReceivingLine = {
  sku: string;
  name: string;
  /** 归组用 SPU id（对齐补货计划 / PoDetail） */
  productId: string;
  productCode: string;
  productName: string;
  variant: string;
  /** 与补货计划 SKU 副行一致：意大利语名 */
  nameIt: string;
  unit: string;
  ordered: number;
  /** 已确认入库累计（各批 Actual 之和，不含 return） */
  stocked: number;
  /** 当前批次 DDT；未上传当前 DDT 时为 0 */
  ddt: number;
  /** 当前批次实点 */
  counted: number;
  disposition: 'receive' | 'hold' | 'return';
  /** 本轮对话刚改过 Actual：表格高亮，指明改的是哪几行 */
  justUpdated?: boolean;
};

/** 已确认的到货批次（对齐 PoDetail receiptBatches） */
export type ReceiptBatchSnapshot = {
  id: string;
  label: string;
  batchNo: number;
  /** 确认入库时间（Order details 分批摘要用） */
  confirmedAt: string;
  bySku: Record<string, { ddt: number; counted: number }>;
};

export type IntakeDraft = {
  supplier: string;
  coverageDays: number | null;
  objective: string;
  estimatedArrival: string;
  scope: string;
  constraints: string;
};

/** 复盘：入库后覆盖期内去化（与计划 coverage 对齐） */
export type OutcomeRow = {
  sku: string;
  name: string;
  ordered: number;
  /** 首次入库后 N 天销量（N = 计划 coverage） */
  sold: number;
  /** 覆盖期末仍在库 */
  remaining: number;
  /** Agent 对单 SKU 的复盘摘要（Notes 列） */
  note: string;
};

/** 绑定到某份供应商确认单的洽谈备注 */
export type NegotiationNote = {
  id: string;
  at: string;
  actor: 'Buyer' | 'Agent' | 'Supplier';
  text: string;
};

/**
 * 一份上传的 confirmation 及其谈价记录。
 * Negotiation：仅在上传了「不一样的」confirmation 时追加一笔。
 */
export type ConfirmationRound = {
  id: string;
  fileName: string;
  versionLabel: string;
  uploadedAt: string;
  source: string;
  isCurrent: boolean;
  notes: NegotiationNote[];
};

/** 本单相关附件（确认单 / 导出申请 / 补货计划 / DDT 等） */
export type OrderAttachmentKind =
  | 'supplier_request'
  | 'confirmation'
  | 'replenishment_plan'
  | 'ddt'
  | 'invoice'
  | 'other';

export type OrderAttachment = {
  id: string;
  kind: OrderAttachmentKind;
  label: string;
  fileName: string;
  uploadedAt: string;
  source: string;
  format: 'pdf' | 'xlsx';
  /** 当前生效确认单等 */
  isCurrent?: boolean;
};

/** 审批激活规则（Agent 识别是否需要老板审批） */
export type ApprovalTrigger = {
  id: string;
  label: string;
  fired: boolean;
  evidence: string;
};

/** 审批决策：仅在 Owner approval 阶段呈现与完成 */
export type ApprovalDecision = 'none' | 'pending' | 'approved' | 'invalidated';

export type DemoState = {
  stage: DemoStageId;
  messages: DemoChatMessage[];
  draftInput: string;
  /** 可编辑工作区标题；null 时各页用默认标题 */
  documentTitle: string | null;
  intakeDraft: IntakeDraft | null;
  planGenerated: boolean;
  progress: DemoProgress;
  lines: DemoLine[];
  confirmationUploaded: boolean;
  confirmationHasRisk: boolean;
  exportFormat: 'xlsx' | 'pdf' | null;
  /** 本单附件清单（查看 / 下载 / 删除） */
  attachments: OrderAttachment[];
  /** 谈价记录：每次上传不同 confirmation 追加 */
  confirmationRounds: ConfirmationRound[];
  /** Agent 按规则评估的审批触发项 */
  approvalTriggers: ApprovalTrigger[];
  /** 是否因激活规则需要审批 */
  approvalRequiredByRules: boolean;
  /** 用户是否已手动/跟随 Agent 提交审批 */
  approvalSubmitted: boolean;
  approvalDecision: ApprovalDecision;
  /** 兼容旧门禁：等同 approvalDecision === 'approved' */
  approved: boolean;
  /** Mark as ordered 时填写：下单时间 */
  orderAt: string | null;
  /** Mark as ordered 时填写：操作人 */
  orderedBy: string | null;
  /** Mark as ordered 时填写：预计到货（默认可按供应商交期中位数） */
  expectedArrival: string | null;
  orderRecorded: boolean;
  /** 采购确认数量（演示整单） */
  orderedQty: number;
  /** 已确认入库批次（DDT-1292 / DDT-1301…） */
  receiptBatches: ReceiptBatchSnapshot[];
  /** 当前批次 DDT 已上传并填入清点表 */
  currentDdtReady: boolean;
  /** 本批确认后若仍有 open qty，须先处理剩余才能继续上传下一批 */
  awaitingRemainingDecision: boolean;
  /** 处理剩余商品决策（对齐 PoDetail） */
  remainingDecision: RemainingReceiptDecision | null;
  /** 收货已全部结束（两批到齐或关闭剩余） */
  receivingComplete: boolean;
  receivingLines: ReceivingLine[];
  learningDecision: 'pending' | 'accepted' | 'dismissed' | null;
  messageSeq: number;
};

export type StageMeta = {
  id: DemoStageId;
  number: number;
  label: string;
};
