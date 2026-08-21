import type { DemoPhaseKey, DemoStageId, StageMeta } from './portfolioDemoTypes';

/**
 * 操作引导（与流程图的 Play tour 相互独立）。
 * visibleOn 限制出现的 stage；锚点不在 DOM 里时也不会显示。
 */
export const COACH_STEPS = [
  {
    id: 'start-procurement',
    target: 'stage-replenishment',
    title: 'Start here',
    body: 'Start experiencing the procurement process from here.',
    visibleOn: ['intake'] as const satisfies readonly DemoStageId[],
  },
  {
    id: 'upload-confirmation',
    target: 'upload-confirmation',
    title: 'Upload confirmation',
    body: 'Upload the supplier confirmation. The agent diffs it against this plan - prices, quantities, and missing SKUs.',
    visibleOn: ['replenishment'] as const satisfies readonly DemoStageId[],
    when: { confirmationUploaded: false },
  },
  {
    id: 'approve-plan',
    target: 'approve-plan',
    title: 'Approve',
    body: 'Review the confirmation diffs, then Approve - directly or push to Owner.',
    visibleOn: ['replenishment'] as const satisfies readonly DemoStageId[],
    when: { confirmationUploaded: true, approved: false, orderRecorded: false },
  },
  {
    id: 'review-order',
    target: 'review-order',
    title: 'Review this order',
    body: 'Receiving is fully closed. Review forecast quality with the agent - over/under order, and arrival vs ETA.',
    visibleOn: ['retrospective'] as const satisfies readonly DemoStageId[],
    when: { reviewDone: false },
  },
  {
    id: 'upload-ddt',
    target: 'upload-ddt',
    title: 'Upload DDT',
    body: 'Upload the delivery note. The agent matches it against the order and flags gaps, gifts, and quantity mismatches.',
    visibleOn: ['receiving'] as const satisfies readonly DemoStageId[],
    when: { currentDdtReady: false },
  },
  {
    id: 'report-actuals',
    target: 'composer',
    title: 'Record actuals vs DDT',
    body: 'If warehouse count differs from the DDT, send it here. Stock-in uses Actual, not DDT.',
    visibleOn: ['receiving'] as const satisfies readonly DemoStageId[],
    when: { currentDdtReady: true },
  },
] as const;

export const PORTFOLIO_COPY = {
  guide: 'Guide',
  guideOn: 'Guide on',
  topTitle: 'DEF ERP - Procurement',
  demoBadge: 'Demo data · not connected to live transactions',
  stageLabel: 'STAGE',
  agentTitle: 'Procurement agent',
  /** Intro stage only: the panel answers questions about the design instead. */
  agentTitleDesign: 'Ask about this design',
  agentListening: 'listening',
  agentWorking: 'working',
  send: 'Send',
  inputPlaceholder: 'Ask about this purchase task…',
  inputPlaceholderDesign: 'Ask how this was designed…',
  attachFile: 'Attach file',
  attachFileHint: 'PDF, images, or spreadsheets',
  composerHint: 'Enter to send · Shift+Enter for new line',
  safety: 'Agent analyzes and records - humans place the order.',
  reset: 'Reset',

  /** 对齐 PoDetail：供应商名 + 采购单 */
  poNo: 'PO-2026-0842',
  poSupplierMeta: 'MNP · MESAUDA NAIL PRO',
  poProgressEdit: 'Edit',
  poProgressOrdered: 'Ordered',
  poProgressReceived: 'Received',

  intakeTitle: 'Procurement agent',
  intakeWaiting: 'Human-in-the-loop',
  intakeCollecting: 'Collecting inputs',
  intakeReady: 'Plan ready',
  /** 兼容旧引用 */
  intakeNoForm: 'No form to fill in first',
  youProvide: 'YOU PROVIDE',
  youProvideBody: 'Supplier · coverage window · any constraint.',
  agentComputes: 'AGENT COMPUTES',
  agentComputesBody: 'Demand forecast · order window · expected arrival · quantities.',
  addProductManually: 'Add product manually',
  /** 补货计划表左下、对话快捷按钮第一位（仅展示，无加行逻辑） */
  addProductLine: '+ Add product',
  importDocument: 'Import a document',
  opening:
    "Ask me anything about how this procurement agent was designed - the decisions, the trade-offs, or why the workflow works this way. You can also drive the workflow itself from the left.",
  suggestLow: 'Why can the agent never place the order?',
  /** Still drives the scripted business flow; no longer offered as a default suggestion. */
  kickoffPlan: 'Plan MNP for the next 30 days',
  suggestPlan: 'Why is the quantity calculated, not generated?',
  /** Intake 流程图：点步骤时发到 Agent 的问句 */
  workflowAskIntake: 'Walk me through Intake - what do I provide vs what you compute?',
  workflowAskPlan: 'How does the Plan step work after intake?',
  workflowAskApprove: 'Who approves, and what happens if I push to Owner?',
  workflowAskOrder: 'Explain the Order step - who places the supplier order?',
  workflowAskReceive: 'What do you do at Receive when DDT/invoice arrives?',
  workflowAskReview: 'What is Review for - how do we close the loop?',
  clarifyCoverage: 'How many days of sales should this order cover after arrival - 30 or 60?',
  askConstraints: 'Any budget cap, must-include, or exclude SKUs? If not, say “no extra constraints”.',
  generatePlan: 'No extra constraints - generate the plan',
  placeOrderForMe: 'Just place the order for me',

  /** 对齐 PoDetail：供应商名 + 采购单 */
  orderDocumentTitle: 'MNP (MESAUDA NAIL PRO) purchase order',
  replenishmentTitle: 'MNP (MESAUDA NAIL PRO) purchase order',
  replenishmentStatus: 'Editable recommendation',
  uploadConfirmation: 'Upload confirmation',
  /** 补货计划 / Owner 页按钮统一文案 */
  approve: 'Approve',
  submitForApproval: 'Approve',
  approveDialogTitle: 'Choose approval path',
  approveDialogHint: 'Neither option places the supplier order. Mark as ordered stays a separate step.',
  approveDirect: 'Approve directly',
  approveDirectHint: 'Approve on this plan now as the buyer. Mark as ordered appears after Approve.',
  approvePushOwner: 'Push to Owner',
  approvePushOwnerHint: 'Send to the Owner approval page. The owner Approves there - then Mark as ordered unlocks.',
  markOrdered: 'Mark as ordered',
  recordOrdered: 'Mark as ordered',
  markOrderedDialogTitle: 'Mark as ordered',
  markOrderedDialogHint:
    'Record the external order on this PO. Agent does not contact the supplier.',
  markOrderedOrderAt: 'Order date & time',
  markOrderedOperator: 'Operator',
  markOrderedOperatorPlaceholder: 'Select operator',
  markOrderedExpectedArrival: 'Expected arrival',
  markOrderedExpectedArrivalHint: (days: number) =>
    `Default = today + MNP median lead time (${days}d). You can change it.`,
  markOrderedFieldsRequired: 'Select order time, operator, and expected arrival to continue.',
  markOrderedConfirm: 'Confirm mark as ordered',
  exportRequest: 'Export request',
  exportTitle: 'Export supplier request',
  exportHint: 'Downloaded only - not sent to supplier. No prices included.',
  exportLang: 'MNP · document language Italiano (it-IT)',
  exportExcel: 'Excel · .xlsx',
  exportPdf: 'PDF · .pdf',
  exportDone: (format: string) => `MNP_richiesta_acquisto_2026-08-05.${format} downloaded`,
  viewAttachments: 'Attachments',
  attachmentsTitle: 'Order attachments',
  attachmentsMeta: 'All files bound to this procurement order',
  attachmentsEmpty: 'No attachments yet. Export a request or upload a supplier confirmation.',
  attachmentsView: 'View',
  attachmentsDownload: 'Download',
  attachmentsDelete: 'Delete',
  attachmentsPreviewTitle: 'Attachment preview',
  attachmentsPreviewHint: 'Demo preview - file is not fetched from live storage.',
  attachmentsDownloaded: (name: string) => `${name} downloaded (demo)`,
  attachmentsDeleted: (name: string) => `${name} removed from this order`,
  /** 附件角标：标明最终批准的确认单，不用 Current */
  attachmentsBadgeFinalApproved: 'Final approved',
  attachmentsBadgeAwaitingApproval: 'Awaiting approval',
  negotiationBadgeApproved: 'Final approved',
  negotiationBadgeAwaiting: 'Awaiting approval',
  negotiationBadgeHistory: 'Superseded',
  attachmentKind: {
    supplier_request: 'Supplier request',
    confirmation: 'Supplier confirmation',
    replenishment_plan: 'Replenishment plan',
    ddt: 'DDT / delivery note',
    // 意大利供应商发票 = Fattura，与 confirmation / DDT 区分
    invoice: 'Supplier invoice (Fattura)',
    other: 'Other',
  } as const,
  attachmentsOrderHint: 'Newest first · timeline: plan → confirmation → invoice → DDT',
  uploadInvoice: 'Upload invoice',
  reuploadInvoice: 'Upload invoice',
  invoiceFileDemo: 'FT_MNP_2026-0842.pdf',
  invoiceUploadedNote: (fileName: string) =>
    `Invoice recorded (${fileName}). Listed under Attachments - demo only, no OCR/price overwrite.`,

  negotiationLogTitle: 'Negotiation log',
  negotiationLogMeta: 'A new entry is recorded only when the uploaded confirmation differs from the previous one',
  viewNegotiationLog: 'Negotiation log',
  negotiationLogEmpty: 'No negotiation entries yet. Upload a confirmation - a different file creates a new record.',
  negotiationLogNoCurrent: 'No current confirmation bound. Upload a confirmation first.',
  negotiationAdd: 'Add note to current confirmation',
  negotiationPlaceholder: 'e.g. Supplier confirmed 400213 stockout; accept qty cut on 431001…',
  confirmationFileDemo: '26VOM002922.pdf',
  confirmationFileAlt: '26VOM002940.pdf',

  supplierRulesLink: 'MNP confirmed supply rules',
  supplierRulesTitle: 'MNP confirmed supply rules',
  supplierRulesMeta: 'Quote v3 + human confirmation · demo data · rule-R04',
  supplierRulesHint:
    'Agent can only analyze against these confirmed rules. Publishing a new rule still requires human approval.',
  viewSupplierRules: 'View supplier rules',

  /** 底部小计栏（按货值 / 起订 / 包邮动态展示） */
  subtotalSkusPcs: (skus: number, pcs: number) => `${skus} SKUs · ${pcs} pcs`,
  subtotalPlanRef: (amount: string) => `plan ref €${amount}`,
  subtotalGoods: 'Goods',
  subtotalEstGoods: 'Est.',
  subtotalConfGoods: 'Conf.',
  subtotalDeltaHigher: (amount: string) => `€${amount} higher`,
  subtotalDeltaLower: (amount: string) => `€${amount} lower`,
  subtotalDeltaFlat: 'same as Est.',
  subtotalShipping: 'Shipping',
  subtotalShippingFree: 'Free',
  subtotalGrand: 'Total',
  subtotalMinOrderMet: 'Min order met',
  subtotalMinOrderNeed: (amount: string) => `Min order · need €${amount}`,
  subtotalFreeShipMet: 'Free shipping',
  subtotalFreeShipNeed: (fee: string, gap: string) => `Shipping €${fee} · €${gap} to free`,
  subtotalEarlyPayHint: (rate: string, days: number) => `Early-pay ${rate}% / ${days}d`,

  approvalTitle: 'Owner approval',
  approvalOwnerBadge: 'Owner view',
  approvalOwnerMeta: 'Commercial decision only - Approve ≠ place order',
  approvalStatus: 'Awaiting your approval',
  approvedStatus: 'Approved · not ordered',
  approvalInvalidatedStatus: 'Approval invalidated',
  approvalIdleStatus: 'Not pushed yet',
  approvePlan: 'Approve',
  approvalNote:
    'You are approving as the owner. This accepts the commercial proposal bound to the current confirmation - it does not place the supplier order.',
  approvalRulesTitle: 'Approval activation rules',
  approvalRulesHint:
    'Agent flags approval when any activation rule fires. Buyers can Approve directly or push to Owner.',
  approvalDetectedBanner:
    'Agent detected approval may be needed. Use Approve to choose: approve directly, or push to Owner.',
  approvalManualBanner: 'Pushed to Owner. Open Owner approval when ready - or Mark as ordered from the plan if already decided.',
  approvalSubmittedBanner:
    'Pushed to Owner. Stay on this plan - Mark as ordered appears only after Approve.',
  approvalInvalidatedBanner:
    'A different confirmation was uploaded after approval - previous approval is invalidated. Approve again or push to Owner.',
  approvalSourceAgent: 'Triggered by Agent (activation rules)',
  approvalSourceManual: 'Pushed by buyer',
  approvalSourceMixed: 'Rules fired · pushed to Owner',

  /** 对齐 PoDetail 收货工作区（上传 DDT / 确认入库 / 处理剩余） */
  receivingTitle: 'Goods receipt',
  editTitle: 'Edit title',
  saveTitle: 'Save',
  receivingStatusPartial: 'Partial receipt',
  receivingStatusWaitingDdt: 'Waiting for DDT',
  receivingStatusReady: 'DDT uploaded · waiting to confirm',
  receivingStatusAwaitingRemaining: 'Handle remaining goods',
  receivingStatusComplete: 'Receipt complete',
  receivingProgressLabel: 'Receiving progress',
  /** 英文对应「订单信息」 */
  receivingPoInfoTitle: 'Order details',
  receivingPoInfoButton: 'Order details',
  receivingPoInfoSheetMeta: 'Document, supplier, order & receipt summary',
  receivingPoSectionDocument: 'Document',
  receivingPoSectionSupplier: 'Supplier',
  receivingPoSectionOrder: 'Order',
  receivingPoSectionReceipt: 'Receipt',
  receivingPoFieldPoNo: 'PO number',
  receivingPoFieldTitle: 'Title',
  receivingPoFieldStatus: 'Status',
  receivingPoFieldSupplier: 'Supplier',
  receivingPoFieldContact: 'Contact',
  receivingPoFieldWebsite: 'Website',
  receivingPoFieldLanguage: 'Document language',
  receivingPoFieldOrderDate: 'Order date',
  receivingPoFieldOperator: 'Operator',
  receivingPoFieldExpectedArrival: 'Expected arrival',
  receivingPoFieldPayment: 'Payment',
  receivingPoFieldLeadTime: 'Lead time',
  receivingPoFieldLines: 'Lines',
  receivingPoFieldQty: 'Quantity',
  receivingPoFieldBatches: 'Confirmed batches',
  receivingPoFieldAttachments: 'Attachments',
  receivingPoFieldInvoice: 'Invoice',
  receivingPoFieldRemaining: 'Remaining decision',
  /** Order details：分批入库统计（非明细） */
  receivingPoSectionReceiptBatches: 'Receipt batches',
  receivingPoBatchConfirmedAt: 'Confirmed at',
  receivingPoBatchStocked: 'Stocked in',
  receivingPoBatchSummary: (batchCount: number, pcs: number) =>
    `${batchCount} receipt${batchCount === 1 ? '' : 's'} · ${pcs} pcs total`,
  receivingPoBatchLineMeta: (skuCount: number, pcs: number) =>
    `${skuCount} SKU${skuCount === 1 ? '' : 's'} · ${pcs} pcs`,
  receivingPoNoBatchesYet: 'No confirmed receipts yet',
  receivingItemsMeta: (spuCount: number, skuCount: number) =>
    `${spuCount} products · ${skuCount} SKUs`,
  receivingEmptyHint: 'No DDT on this arrival yet. Upload DDT to prefill DDT / actual qty for this batch.',
  receivingBatch1Note: 'DDT-1292',
  receivingBatch2Note: 'DDT-1301',
  receivingColProduct: 'Product',
  receivingColQty: 'Qty',
  receivingColUnit: 'Unit',
  receivingColReceived: 'Received',
  receivingColDdt: 'DDT',
  receivingColActual: 'Actual',
  receivingColDisposition: 'Disposition',
  receivingColNotes: 'Notes',
  /** 复盘：入库后覆盖期销量（表头带天数） */
  receivingColSoldAfter: (days: number) => `Sold ${days}d`,
  receivingColSoldHint: 'After first stock-in · same window as plan coverage',
  receivingColActions: 'Actions',
  discussWithAgent: 'Discuss',
  discussSkuPrompt: (sku: string) => `Discuss ${sku}`,
  discussSpuPrompt: (productCode: string) => `Discuss SPU ${productCode}`,
  /** 上传 DDT 主键对：DDT vs 下单数量 */
  receivingNoteShortVsOrder: (gap: number, ordered: number, ddt: number) =>
    `Short ${gap} vs order (${ordered}→${ddt})`,
  receivingNoteOverVsOrder: (extra: number, ordered: number, ddt: number) =>
    `Over ${extra} vs order (${ordered}→${ddt})`,
  /** Actual 被改成与 DDT 不同后的次级提醒 */
  receivingNoteShortVsDdt: (gap: number, ddt: number, counted: number) =>
    `Short ${gap} vs DDT (${ddt}→${counted})`,
  receivingNoteOverVsDdt: (extra: number, ddt: number, counted: number) =>
    `Over ${extra} vs DDT (${ddt}→${counted})`,
  receivingNoteMissing: (open: number) => `Not on this DDT (open ${open})`,
  receivingNoteHold: 'On hold - accept as gift or return',
  receivingNoteReturn: 'Marked return - will not stock-in',
  uploadDdt: 'Upload DDT',
  /** 已上传当前批次 DDT 的完成态（对齐 reviewOrderDone 的写法） */
  uploadDdtDone: 'DDT uploaded',
  /** DDT 上传后预填：把实点与 DDT 的差异一次说清，发送即改表 */
  reportActualsPrefill: (parts: string[]) => `Warehouse counted ${parts.join(', ')}`,
  reportActualsPart: (sku: string, qty: number) => `${qty} for ${sku}`,
  reportActualsHint: 'Counted quantities differ from the DDT - send to update the sheet.',
  actualsUpdatedTitle: (count: number) =>
    `Updated Actual on ${count} line${count === 1 ? '' : 's'}. Stock-in will use Actual, not DDT.`,
  actualsUpdatedLine: (sku: string, ddt: number, qty: number) => {
    const gap = qty - ddt;
    const suffix = gap === 0 ? 'matches DDT' : `${gap > 0 ? 'over' : 'short'} ${Math.abs(gap)} vs DDT`;
    return `${sku}: DDT ${ddt} → Actual ${qty} (${suffix}).`;
  },
  handleRemaining: 'Handle remaining goods',
  confirmReceipt: 'Confirm receipt',
  acceptGift: 'Accept as gift',
  returnLine: 'Return',
  /** 对话内推荐区标题 */
  recommendedActions: 'Recommended in chat',
  explainShortfall: (sku: string) => `Explain ${sku} shortfall`,
  explainShortVsOrder: (sku: string) => `Explain ${sku} short vs order`,
  reportCountShort: (sku: string, qty: number) => `Warehouse counted ${qty} for ${sku}`,
  returnSku: (sku: string) => `Return ${sku}`,
  holdSku: (sku: string) => `Hold ${sku} for review`,
  acceptSkuGift: (sku: string) => `Accept ${sku} as gift`,
  ddtMatchTitle: (label: string, batchNo: number) =>
    `${label} matched to the count sheet (batch ${batchNo}).`,
  ddtMatchStockInNote:
    'Actual defaults to DDT qty. Edit Actual or tell me if warehouse count differs - stock-in uses Actual.',
  holdUnresolved: 'Resolve held lines before confirming receipt',
  holdBannerTitle: 'Hold blocking Confirm receipt',
  holdBannerBody: (sku: string, name: string) =>
    `${sku} · ${name} arrived on the DDT but is on hold (supplier-added / gift). Accept as gift or Return to unlock Confirm receipt.`,
  holdAcceptAll: 'Accept held lines as gift',
  remainingRequiredHint: 'Confirm receipt left open qty. Choose Handle remaining before uploading the next DDT.',
  remainingDialogTitle: 'Handle remaining goods',
  remainingDialogIntro: (qty: number) =>
    `There are still ${qty} pcs not fully received. Choose how to handle this open remainder (same options as production PO receiving).`,
  /** 对齐 PoDetail 四选一 */
  remainingOptions: {
    wait_next_batch: {
      title: 'Wait for next batch',
      description: 'Supplier may split-ship. Keep PO partially received; upload the next DDT when it arrives.',
      result: 'After save: status stays partial receipt; Upload DDT / Confirm receipt stay available.',
    },
    supplier_delay: {
      title: 'Supplier delay · set reminder',
      description: 'Remainder arrives later. Record a new expected arrival date; PO stays partially received.',
      result: 'After save: status stays partial receipt; expected arrival is updated.',
    },
    close_remaining: {
      title: 'Close remaining · end PO',
      description: 'Supplier cancelled / out of stock / will not ship the rest. Close open qty.',
      result: 'After save: PO moves to received / closed.',
    },
    return_no_stock: {
      title: 'Return / do not stock',
      description: 'Overage, wrong goods, damage, or refuse - exclude from inventory and close the PO.',
      result: 'After save: PO moves to received / closed; return reason is recorded.',
    },
  },
  remainingPickIntro: (openPcs: number, openSkuCount: number) =>
    `Open remainder: ${openPcs} pcs across ${openSkuCount} SKUs. Pick one option (same as production Handle remaining).`,

  retrospectiveTitle: 'Retrospective',
  retrospectiveStatus: 'Candidate learning',
  /** 复盘进度条：只强调全部到货 */
  retrospectiveStatusFullyReceived: 'Fully received',
  retrospectiveStatusDone: 'Review recorded',
  /** 复盘主操作（对齐其他阶段主按钮位置） */
  reviewOrder: 'Review this order',
  reviewOrderDone: 'Order reviewed',
  acceptLearning: 'Accept as candidate',
  dismissLearning: 'Dismiss',
  /** 复盘对话：提问后预填输入框，用户自由反馈，无 Recommended chips */
  reviewOrderIntro:
    'Receiving is fully closed. Before I write anything down, I need your read on the forecast signals that matter for the next buy - reply in the input below (I drafted a starting answer you can edit).',
  reviewOrderAskBullets: [
    'Did we over-order or under-order vs real demand after arrival?',
    'Was supplier arrival timing close to the ETA we planned?',
    'Any SKU-level miss that should change the next coverage / lead-time assumption?',
  ],
  /** Demo 预填：用户可改再发送 */
  // NEW-024 是 DDT 赠品/退回线，不参与超订复盘示例
  reviewOrderDraft:
    'Qty: a bit over on slower movers (510002 / 420106); 370102 was about right. ETA: first batch on time, second a few days late vs plan. For next MNP buy I’d keep 30d coverage but watch lead-time p90.',
  reviewFeedbackTitle: 'Thanks - I’ve got your retrospective feedback.',
  reviewFeedbackRemembered:
    'I’ve remembered this for my training. Next time I plan an MNP buy, I’ll weigh over/under-order and ETA accuracy before suggesting coverage or lead-time assumptions. Nothing becomes a live supplier rule until a human publishes it.',

  phaseLabels: {
    understand: 'Understand demand',
    validate: 'Validate data',
    calculate: 'Calculate qty',
    explain: 'Assemble draft',
  } satisfies Record<DemoPhaseKey, string>,
  planBuildingTitle: 'Building replenishment plan',
  planBuildingHint: 'Forecast, stock, inbound, and MNP lead time',
  planWaitingHint: 'A planning request is about to start…',

  refuseAutoOrder:
    'I can prepare evidence and record what you decide, but I cannot contact the supplier or place the order. Complete ordering outside the platform, then upload the final confirmation / Mark as ordered.',

  /** Intake 流程图：Agent 对每步的解释（点步骤时对话） */
  workflowReplyIntake:
    'Intake is conversational - no form first. You tell me supplier, coverage window, and any constraint; I ask only what’s missing, then extract a goal card on the canvas.',
  workflowReplyIntakeBullets: [
    'You: answer in chat (or send a sample request like “Plan MNP for the next 30 days”).',
    'Me: clarify coverage / constraints, then hand off into Plan.',
    'Tip: click other steps on the flow to ask me about them anytime.',
  ],
  workflowReplyPlan:
    'Plan is where I turn the goal into an editable draft PO - forecast quantities, order window, and expected arrival - still human-editable before any approval.',
  workflowReplyPlanBullets: [
    'Me: compute demand signals and line quantities against MNP rules.',
    'You: edit qty / SKUs, then Approve (or push to Owner).',
    'Nothing is sent to the supplier from this step.',
  ],
  workflowReplyApprove:
    'Approve is a human gate. I prepare the plan and handoff notes; a person must approve before Mark as ordered unlocks.',
  workflowReplyApproveBullets: [
    'Approve directly on the plan as buyer, or Push to Owner.',
    'Owner approval lives on its own STAGE screen.',
    'Approval never places the supplier order.',
  ],
  workflowReplyOrder:
    'Order is human-only. I never contact the supplier or place the PO for you - I only record what you mark after you order externally.',
  workflowReplyOrderBullets: [
    'You: order outside the platform, then Mark as ordered (time, operator, expected arrival).',
    'Me: keep evidence, confirmation diffs, and the audit trail.',
    'If you ask me to “just place the order”, I’ll refuse and explain this boundary.',
  ],
  workflowReplyReceive:
    'Receive is matching reality to the plan - DDT / invoice vs ordered lines, including gifts and qty gaps.',
  workflowReplyReceiveBullets: [
    'Me: flag short/over, missing lines, gifts, and holds.',
    'You: confirm receipt batches and resolve dispositions.',
    'Stock-in only after you confirm - I don’t auto-receive.',
  ],
  workflowReplyReview:
    'Review closes the loop: forecast vs actual sell-through after stock-in, so the next buy is sharper.',
  workflowReplyReviewBullets: [
    'Me: summarize outcomes and open issues by SKU/SPU.',
    'You: accept or dismiss learnings for the next cycle.',
    'You can ask me to discuss a specific SKU from the retrospective table.',
  ],

  confirmationDiff:
    'I compared the platform PO with the supplier confirmation:\n• Missing: 400213 Functional treatment 50 ml\n• Qty: 370102 96→90 · 431001 72→60 · 510002 24→18\n• Price: confirmation above Est. across the board (e.g. 370102 €5.40→€6.20 · 420106 €7.10→€7.90 · color gels €6.20→€7.00) - Conf. goods total is higher despite qty cuts\nGaps are highlighted on the plan table. Approval activation rules fired - Submit for approval on this page (does not leave the plan).',
  confirmationSameFile:
    'Same confirmation file as the current upload - negotiation log was not duplicated. Diffs and attachments stay bound to this file.',
  confirmationDifferentRecorded: (fileName: string) =>
    `Different confirmation detected (${fileName}). Negotiation log recorded a new entry. If a prior approval existed, it is invalidated.`,
} as const;

export const STAGE_META: StageMeta[] = [
  { id: 'intake', number: 1, label: 'Introduction' },
  { id: 'replenishment', number: 2, label: 'Replenishment plan' },
  { id: 'approval', number: 3, label: 'Owner approval' },
  { id: 'receiving', number: 4, label: 'Goods receipt' },
  { id: 'retrospective', number: 5, label: 'Retrospective' },
];
