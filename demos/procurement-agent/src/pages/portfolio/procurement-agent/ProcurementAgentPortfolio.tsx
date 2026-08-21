import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PortfolioAgentPanel from './PortfolioAgentPanel';
import PortfolioMainCanvas from './PortfolioMainCanvas';
import PortfolioStageNav from './PortfolioStageNav';
import PortfolioBrowserChrome from './PortfolioTopBar';
import { COACH_STEPS, PORTFOLIO_COPY } from './portfolioDemoCopy';
import { AGENT_RATE_LIMITED, AGENT_UNAVAILABLE, askProjectAgent, buildHistory } from './askProjectAgent';
import PortfolioCoach from './PortfolioCoach';
import {
  BASE_LINES,
  MNP_SUPPLIER_RULES,
  PHASES,
  DEMO_COVERAGE_DAYS,
  DEMO_OPERATORS,
  appendMessages,
  appendNegotiationNote,
  appendStatusMessage,
  applyConfirmationUpload,
  applyCurrentBatchDdt,
  applyInvoiceUpload,
  applyRemainingGoodsDecision,
  approveProposal,
  buildDdtMatchReport,
  buildPartialIntake,
  confirmCurrentReceiptBatch,
  createReceivingLinesFromPo,
  createReplenishmentIntroState,
  orderedQtyOf,
  createInitialState,
  defaultExpectedArrivalDate,
  ensureOrderedDocumentPack,
  hasUnresolvedHold,
  isAutoOrderPrompt,
  jumpToStage,
  nextDemoConfirmationFile,
  nowLocalDateTimeValue,
  outcomeForReceivingLine,
  promptHasCoverage,
  promptMentionsSupplier,
  remainingChatActions,
  remainingDecisionFromPrompt,
  REPLENISHMENT_INTRO_DRAFT,
  submitForApproval,
  summarizeOpenRemainder,
  updateStatusMessage,
  upsertExportAttachment,
  type MarkOrderMeta,
} from './portfolioDemoScript';
import type {
  DemoChatAction,
  DemoPhaseKey,
  DemoStageId,
  DemoState,
  NegotiationNote,
  RemainingReceiptDecision,
} from './portfolioDemoTypes';

const THINKING_LABELS = [
  'Reading context…',
  'Checking supplier rules…',
  'Comparing evidence…',
  'Drafting a careful reply…',
  'Weighing commercial risk…',
] as const;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function delayForReply(agentText: string): number {
  if (prefersReducedMotion()) return 280;
  return Math.min(1600, Math.max(700, 550 + agentText.length * 4));
}

function pickThinkingLabel(seed?: string): string {
  if (!seed) {
    return THINKING_LABELS[Math.floor(Math.random() * THINKING_LABELS.length)];
  }
  const idx = Math.abs(seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % THINKING_LABELS.length;
  return THINKING_LABELS[idx];
}

function pickReceivingPatch(state: DemoState): Partial<DemoState> {
  return {
    stage: 'receiving',
    orderRecorded: state.orderRecorded,
    orderAt: state.orderAt,
    orderedBy: state.orderedBy,
    expectedArrival: state.expectedArrival,
    orderedQty: state.orderedQty,
    receiptBatches: state.receiptBatches,
    currentDdtReady: state.currentDdtReady,
    awaitingRemainingDecision: state.awaitingRemainingDecision,
    remainingDecision: state.remainingDecision,
    receivingComplete: state.receivingComplete,
    receivingLines: state.receivingLines,
    attachments: state.attachments,
  };
}

function freshReceivingState(base: DemoState): DemoState {
  // 收货行直接来自当前采购单明细（含确认后 qty）
  const receivingLines = createReceivingLinesFromPo(base.lines);
  return {
    ...base,
    stage: 'receiving',
    orderRecorded: true,
    orderedQty: orderedQtyOf(receivingLines),
    receiptBatches: [],
    currentDdtReady: false,
    awaitingRemainingDecision: false,
    remainingDecision: null,
    receivingComplete: false,
    receivingLines,
  };
}

function suggestionsFor(state: DemoState): string[] {
  const { stage } = state;
  if (stage === 'intake' && !state.intakeDraft) {
    return [PORTFOLIO_COPY.suggestLow, PORTFOLIO_COPY.suggestPlan];
  }
  if (stage === 'intake' && state.intakeDraft && !state.intakeDraft.coverageDays) {
    return ['Cover the next 30 days', 'Cover 60 days after arrival'];
  }
  if (stage === 'intake' && state.intakeDraft && !state.planGenerated) {
    return [PORTFOLIO_COPY.generatePlan, PORTFOLIO_COPY.placeOrderForMe];
  }
  if (stage === 'replenishment') {
    if (!state.planGenerated) {
      // 开场：尚未发送规划请求时只露出 kickoff 芯片
      if (state.messages.some((message) => message.role === 'user')) return [];
      return [PORTFOLIO_COPY.kickoffPlan];
    }
    if (state.confirmationUploaded) {
      const next = state.approved
        ? [PORTFOLIO_COPY.markOrdered, PORTFOLIO_COPY.viewSupplierRules]
        : [PORTFOLIO_COPY.approve, PORTFOLIO_COPY.viewSupplierRules];
      return [PORTFOLIO_COPY.addProductLine, ...next];
    }
    return [
      PORTFOLIO_COPY.addProductLine,
      PORTFOLIO_COPY.exportRequest,
      PORTFOLIO_COPY.uploadConfirmation,
      PORTFOLIO_COPY.viewSupplierRules,
    ];
  }
  if (stage === 'approval') {
    return state.approved
      ? [PORTFOLIO_COPY.markOrdered, PORTFOLIO_COPY.placeOrderForMe]
      : [PORTFOLIO_COPY.approve, PORTFOLIO_COPY.uploadConfirmation];
  }
  if (stage === 'receiving') {
    // 剩余四选一只出现在对话 Recommended in chat，不放输入框下方
    if (state.awaitingRemainingDecision) {
      return [];
    }
    if (!state.currentDdtReady) {
      return [PORTFOLIO_COPY.uploadDdt];
    }
    return [PORTFOLIO_COPY.confirmReceipt];
  }
  if (stage === 'retrospective') {
    // Accept / Dismiss 只在对话 Recommended in chat，不放输入框下
    return [];
  }
  return [];
}

type AgentReplyOptions = {
  /** Used when a pending (live model) answer fails. */
  fallbackText?: string;
  /** 用户消息文案；省略则不追加用户气泡（如画布 Export） */
  userText?: string;
  patch?: Partial<DemoState>;
  delayMs?: number;
  label?: string;
  /** 为 false 时不清空既有定时器（计划生成阶段用） */
  clearPending?: boolean;
  /** 结构化要点（差异 bullet） */
  bullets?: string[];
  /** 跟在回复下的推荐操作 */
  actions?: DemoChatAction[];
  /** Agent 回复结束后预填输入框（如复盘草稿） */
  draftAfter?: string;
};

/**
 * 作品集独立页：保留截图视觉，业务门禁对齐生产/Pilot 逻辑。
 */
export default function ProcurementAgentPortfolio() {
  const [state, setState] = useState<DemoState>(() => createInitialState());
  const [busy, setBusy] = useState(false);
  const [guideOpen, setGuideOpen] = useState(true);
  const timersRef = useRef<number[]>([]);
  const thinkingLockedRef = useRef(false);
  const activeStatusIdRef = useRef<string | null>(null);
  /** 复盘：已提问、等待用户在输入框反馈 */
  const reviewAwaitingFeedbackRef = useRef(false);
  /** 第二 stage 开场动效只播一次 */
  const replenishmentIntroPlayedRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  // 收货闭环或侧栏点进复盘后，打开最后一步引导
  useEffect(() => {
    if (state.stage === 'retrospective') {
      setGuideOpen(true);
    }
  }, [state.stage]);

  /** 第一屏只引导第二个 stage；补货页按是否已上传 confirmation 切换锚点 */
  const coachSteps = useMemo(
    () =>
      COACH_STEPS.filter((step) => {
        if ('visibleOn' in step && step.visibleOn && !(step.visibleOn as readonly DemoStageId[]).includes(state.stage)) {
          return false;
        }
        const when = 'when' in step ? (step.when as {
          confirmationUploaded?: boolean;
          approved?: boolean;
          orderRecorded?: boolean;
          currentDdtReady?: boolean;
          reviewDone?: boolean;
        }) : undefined;
        if (when) {
          if (when.confirmationUploaded != null && when.confirmationUploaded !== state.confirmationUploaded) return false;
          if (when.approved != null && when.approved !== state.approved) return false;
          if (when.orderRecorded != null && when.orderRecorded !== state.orderRecorded) return false;
          if (when.currentDdtReady != null && when.currentDdtReady !== state.currentDdtReady) return false;
          if (when.reviewDone != null) {
            const done = state.learningDecision === 'accepted' || state.learningDecision === 'dismissed';
            if (when.reviewDone !== done) return false;
          }
        }
        // 上传 DDT 后等 Agent 匹配结束、预填草稿再指向输入框
        if (step.id === 'report-actuals' && busy) return false;
        // 进入复盘后等收货收口回复结束，再指向 Review this order
        if (step.id === 'review-order' && busy) return false;
        return true;
      }).map(({ id, target, title, body }) => ({ id, target, title, body })),
    [busy, state.approved, state.confirmationUploaded, state.currentDdtReady, state.learningDecision, state.orderRecorded, state.stage],
  );

  const reset = useCallback(() => {
    clearTimers();
    thinkingLockedRef.current = false;
    activeStatusIdRef.current = null;
    reviewAwaitingFeedbackRef.current = false;
    replenishmentIntroPlayedRef.current = false;
    setBusy(false);
    setState(createInitialState());
  }, [clearTimers]);

  const selectStage = useCallback((stage: DemoStageId) => {
    clearTimers();
    thinkingLockedRef.current = false;
    activeStatusIdRef.current = null;
    reviewAwaitingFeedbackRef.current = false;
    setBusy(false);
    if (stage === 'replenishment') {
      replenishmentIntroPlayedRef.current = false;
      setState(createReplenishmentIntroState());
      return;
    }
    if (stage === 'receiving' || stage === 'retrospective') {
      setGuideOpen(true);
    }
    setState(jumpToStage(stage));
  }, [clearTimers]);

  /**
   * 用户消息 → 对话内状态卡（可展开）→ 结束后原地收起 → Agent 回复接在下方。
   */
  const replyAsAgent = useCallback((
    /** A promise lets a live model answer stream in behind the existing thinking card. */
    agentTextOrPending: string | Promise<string>,
    options: AgentReplyOptions = {},
  ) => {
    if (thinkingLockedRef.current && options.clearPending !== false) {
      return;
    }

    if (options.clearPending !== false) {
      clearTimers();
    }

    const pending = typeof agentTextOrPending !== 'string';
    const label = options.label ?? pickThinkingLabel(options.userText ?? (pending ? '' : agentTextOrPending));
    // While pending, keep the thinking beats short; the card simply waits for the answer.
    const delay = options.delayMs ?? (pending ? 900 : delayForReply(agentTextOrPending));
    setBusy(true);

    setState((prev) => {
      let next: DemoState = {
        ...prev,
        draftInput: '',
        ...(options.patch ?? {}),
      };
      if (options.userText) {
        next = appendMessages(next, [{ role: 'user', text: options.userText }]);
      }
      const inserted = appendStatusMessage(next, {
        mode: 'think',
        text: label,
        thinkStep: 0,
        progress: { status: 'running', current: null, completed: [] },
      });
      activeStatusIdRef.current = inserted.id;
      return inserted.state;
    });

    // 思考中途推进步骤，状态卡留在原对话位置
    const midAt = Math.floor(delay * 0.4);
    schedule(() => {
      const statusId = activeStatusIdRef.current;
      if (!statusId) return;
      setState((prev) => updateStatusMessage(prev, statusId, {
        text: 'Checking constraints…',
        thinkStep: 1,
        progress: { status: 'running', current: null, completed: [] },
      }));
    }, midAt);

    schedule(() => {
      const statusId = activeStatusIdRef.current;
      if (!statusId) return;
      setState((prev) => updateStatusMessage(prev, statusId, {
        text: 'Drafting a careful reply…',
        thinkStep: 2,
        progress: { status: 'running', current: null, completed: [] },
      }));
    }, Math.floor(delay * 0.7));

    const finish = (agentText: string) => {
      const statusId = activeStatusIdRef.current;
      setBusy(false);
      setState((prev) => {
        let next = prev;
        if (statusId) {
          next = updateStatusMessage(next, statusId, {
            text: 'Thinking complete',
            thinkStep: 2,
            progress: { status: 'complete', current: null, completed: [] },
          });
        }
        activeStatusIdRef.current = null;
        next = appendMessages(next, [{
          role: 'agent',
          text: agentText,
          bullets: options.bullets,
          actions: options.actions,
        }]);
        // 复盘等场景：回复后预填草稿供用户编辑发送
        if (options.draftAfter != null) {
          next = { ...next, draftInput: options.draftAfter };
        }
        return next;
      });
    };

    schedule(() => {
      if (!pending) {
        finish(agentTextOrPending as string);
        return;
      }
      // Leave the thinking card up until the model answers; never surface a raw error.
      (agentTextOrPending as Promise<string>)
        .then((text) => finish(text))
        .catch(() => finish(options.fallbackText ?? AGENT_UNAVAILABLE));
    }, delay);
  }, [clearTimers, schedule]);

  const runPlanGeneration = useCallback((
    draft: NonNullable<DemoState['intakeDraft']>,
    userText: string,
    options?: { skipUserMessage?: boolean },
  ) => {
    clearTimers();
    thinkingLockedRef.current = true;
    setBusy(true);

    setState((prev) => {
      let next: DemoState = {
        ...prev,
        intakeDraft: { ...draft, constraints: 'None' },
        draftInput: '',
      };
      if (!options?.skipUserMessage) {
        next = appendMessages(next, [{ role: 'user', text: userText }]);
      }
      const inserted = appendStatusMessage(next, {
        mode: 'plan',
        text: 'Building recommendation…',
        progress: { status: 'running', current: 'understand', completed: [] },
      });
      activeStatusIdRef.current = inserted.id;
      return inserted.state;
    });

    const beats: Array<{
      current: DemoPhaseKey | null;
      completed: DemoPhaseKey[];
      delay: number;
      label: string;
      finish?: boolean;
    }> = [
      { current: 'validate', completed: ['understand'], delay: 700, label: 'Validate data' },
      { current: 'calculate', completed: ['understand', 'validate'], delay: 750, label: 'Calculate qty' },
      { current: 'explain', completed: ['understand', 'validate', 'calculate'], delay: 750, label: 'Assemble draft' },
      { current: null, completed: [...PHASES], delay: 600, label: 'Plan assembly complete', finish: true },
    ];

    let elapsed = prefersReducedMotion() ? 280 : 650;
    beats.forEach((beat) => {
      schedule(() => {
        const statusId = activeStatusIdRef.current;
        if (!statusId) return;

        if (beat.finish) {
          setState((prev) => updateStatusMessage(
            {
              ...prev,
              stage: 'replenishment',
              planGenerated: true,
              lines: BASE_LINES.map((line) => ({ ...line })),
            },
            statusId,
            {
              text: 'Plan assembly complete',
              progress: { status: 'complete', current: null, completed: beat.completed },
            },
          ));

          schedule(() => {
            thinkingLockedRef.current = false;
            activeStatusIdRef.current = null;
            setBusy(false);
            setState((prev) => appendMessages(prev, [
              {
                role: 'agent',
                text: 'Draft ready. Quantities come from a deterministic planner - edit freely, then export the supplier request (no prices). This is still not an order.',
              },
            ]));
          }, prefersReducedMotion() ? 180 : 420);
          return;
        }

        setState((prev) => updateStatusMessage(prev, statusId, {
          text: beat.label,
          progress: { status: 'running', current: beat.current, completed: beat.completed },
        }));
      }, elapsed);
      elapsed += beat.delay;
    });
  }, [clearTimers, schedule]);

  /** 第二 stage 开场：先发出 kickoff 气泡，再让中间画布进入加载 */
  const playReplenishmentIntro = useCallback((userText: string = PORTFOLIO_COPY.kickoffPlan) => {
    thinkingLockedRef.current = true;
    setBusy(true);
    setState((prev) => appendMessages(
      { ...prev, draftInput: '' },
      [{ role: 'user', text: userText }],
    ));
    schedule(() => {
      runPlanGeneration(REPLENISHMENT_INTRO_DRAFT, userText, { skipUserMessage: true });
    }, prefersReducedMotion() ? 140 : 520);
  }, [runPlanGeneration, schedule]);

  useEffect(() => {
    if (state.stage !== 'replenishment' || state.planGenerated) return;
    if (replenishmentIntroPlayedRef.current) return;
    if (state.messages.some((message) => message.role === 'user')) return;

    const delay = prefersReducedMotion() ? 220 : 780;
    const id = window.setTimeout(() => {
      if (replenishmentIntroPlayedRef.current) return;
      replenishmentIntroPlayedRef.current = true;
      playReplenishmentIntro();
    }, delay);
    return () => window.clearTimeout(id);
  }, [playReplenishmentIntro, state.messages, state.planGenerated, state.stage]);

  const handlePrompt = useCallback((raw: string) => {
    const prompt = raw.trim();
    if (!prompt) return;
    if (thinkingLockedRef.current) return;
    const lower = prompt.toLowerCase();

    // 展示用芯片：不触发加行或对话
    if (prompt === PORTFOLIO_COPY.addProductLine) return;

    // 第二 stage 开场：芯片或手动发送都走同一套发送 → 加载动效
    if (state.stage === 'replenishment' && !state.planGenerated) {
      replenishmentIntroPlayedRef.current = true;
      playReplenishmentIntro(prompt);
      return;
    }

    // Intake 流程图：点步骤时用 Agent 对话解释 workflow（保留预填需求草稿）
    const workflowKeepDraft = state.stage === 'intake' && !state.intakeDraft
      ? (state.draftInput.trim() || undefined)
      : undefined;
    const workflowExplain = (
      [
        {
          ask: PORTFOLIO_COPY.workflowAskIntake,
          text: PORTFOLIO_COPY.workflowReplyIntake,
          bullets: PORTFOLIO_COPY.workflowReplyIntakeBullets,
          label: 'Walking through Intake…',
        },
        {
          ask: PORTFOLIO_COPY.workflowAskPlan,
          text: PORTFOLIO_COPY.workflowReplyPlan,
          bullets: PORTFOLIO_COPY.workflowReplyPlanBullets,
          label: 'Explaining Plan…',
        },
        {
          ask: PORTFOLIO_COPY.workflowAskApprove,
          text: PORTFOLIO_COPY.workflowReplyApprove,
          bullets: PORTFOLIO_COPY.workflowReplyApproveBullets,
          label: 'Explaining Approve…',
        },
        {
          ask: PORTFOLIO_COPY.workflowAskOrder,
          text: PORTFOLIO_COPY.workflowReplyOrder,
          bullets: PORTFOLIO_COPY.workflowReplyOrderBullets,
          label: 'Checking order boundary…',
        },
        {
          ask: PORTFOLIO_COPY.workflowAskReceive,
          text: PORTFOLIO_COPY.workflowReplyReceive,
          bullets: PORTFOLIO_COPY.workflowReplyReceiveBullets,
          label: 'Explaining Receive…',
        },
        {
          ask: PORTFOLIO_COPY.workflowAskReview,
          text: PORTFOLIO_COPY.workflowReplyReview,
          bullets: PORTFOLIO_COPY.workflowReplyReviewBullets,
          label: 'Explaining Review…',
        },
      ] as const
    ).find((item) => item.ask === prompt);
    if (workflowExplain) {
      replyAsAgent(askProjectAgent(prompt, buildHistory(state.messages)), {
        userText: prompt,
        label: workflowExplain.label,
        fallbackText: workflowExplain.text,
        draftAfter: workflowKeepDraft,
      });
      return;
    }

    if (
      prompt === PORTFOLIO_COPY.viewSupplierRules
      || lower.includes('supplier rule')
      || lower.includes('supply rule')
      || lower.includes('free shipping')
      || lower.includes('min order')
    ) {
      const rules = MNP_SUPPLIER_RULES;
      replyAsAgent(
        [
          'MNP confirmed supply rules (open “MNP confirmed supply rules” on the canvas for full detail):',
          `• Min order €${rules.minOrderValue.toFixed(0)} · free shipping from €${rules.freeShippingThreshold.toFixed(0)}`,
          `• Shipping €${rules.defaultShippingFee.toFixed(0)} under threshold · language ${rules.language}`,
          `• Lead time median ${rules.leadTimeMedianDays}d · ${rules.volumeDiscount}`,
          `• Early-pay ${(rules.earlyPaymentDiscountRate * 100).toFixed(0)}% within ${rules.earlyPaymentDays} days · valid until ${rules.validUntil}`,
        ].join('\n'),
        { userText: prompt, label: 'Checking supplier rules…' },
      );
      return;
    }

    if (isAutoOrderPrompt(prompt) || prompt === PORTFOLIO_COPY.placeOrderForMe) {
      replyAsAgent(PORTFOLIO_COPY.refuseAutoOrder, {
        userText: prompt,
        label: 'Checking safety boundaries…',
      });
      return;
    }

    if (
      prompt === PORTFOLIO_COPY.reviewOrder
      || lower.includes('review this order')
    ) {
      setGuideOpen(false);
      // 只提问 + 预填输入框，不用 Recommended chips
      reviewAwaitingFeedbackRef.current = true;
      replyAsAgent(PORTFOLIO_COPY.reviewOrderIntro, {
        userText: prompt,
        label: 'Checking forecast signals…',
        bullets: [...PORTFOLIO_COPY.reviewOrderAskBullets],
        draftAfter: PORTFOLIO_COPY.reviewOrderDraft,
      });
      return;
    }

    // 复盘：就某一 SKU / SPU 与 Agent 讨论去化
    const discussSpuMatch = prompt.match(/^discuss\s+spu\s+([A-Z0-9-]+)$/i);
    const discussSkuMatch = prompt.match(/^discuss\s+([A-Z0-9-]+)$/i);
    if (state.stage === 'retrospective' && (discussSpuMatch || discussSkuMatch)) {
      const coverage = state.intakeDraft?.coverageDays ?? DEMO_COVERAGE_DAYS;
      if (discussSpuMatch) {
        const code = discussSpuMatch[1].toUpperCase();
        const spuLines = state.receivingLines.filter((line) => line.productCode === code);
        if (spuLines.length === 0) {
          replyAsAgent(`I don’t see SPU ${code} on this PO.`, {
            userText: prompt,
            label: 'Looking up SPU…',
          });
          return;
        }
        const bullets = spuLines.map((line) => {
          const outcome = outcomeForReceivingLine(line);
          if (!outcome) {
            return `${line.sku} · no post-arrival sales (gift/return / not stocked)`;
          }
          return `${line.sku} · ordered ${line.ordered} · sold ${outcome.sold} in ${coverage}d after stock-in · left ${outcome.remaining} - ${outcome.note}`;
        });
        replyAsAgent(`SPU ${code} · sell-through in the ${coverage}d coverage window after first stock-in.`, {
          userText: prompt,
          label: 'Comparing SPU outcomes…',
          bullets: [
            ...bullets,
            'Tell me what you’d change for the next buy on this SPU (coverage, buffer, or SKU mix).',
          ],
        });
        return;
      }
      const sku = discussSkuMatch![1].toUpperCase();
      const line = state.receivingLines.find((item) => item.sku === sku);
      if (!line) {
        replyAsAgent(`I don’t see ${sku} on this receiving sheet.`, {
          userText: prompt,
          label: 'Looking up SKU…',
        });
        return;
      }
      const outcome = outcomeForReceivingLine(line);
      if (!outcome) {
        replyAsAgent(
          `${sku} wasn’t treated as normal stock-in (gift/return or zero stocked), so it isn’t in the post-arrival sales window.`,
          { userText: prompt, label: 'Checking SKU disposition…' },
        );
        return;
      }
      replyAsAgent(`${sku} · post-arrival sell-through vs plan coverage.`, {
        userText: prompt,
        label: 'Comparing SKU outcome…',
        bullets: [
          `Ordered ${outcome.ordered} · received ${line.stocked}`,
          `Sold ${outcome.sold} in ${coverage}d after first stock-in (same window as plan coverage)`,
          `Left in stock ${outcome.remaining}`,
          outcome.note,
          'Want to tighten/loosen coverage on this SKU next cycle, or keep as-is?',
        ],
      });
      return;
    }

    // 复盘：用户自由反馈（含预填草稿）→ 总结并记入 Agent 训练
    if (
      state.stage === 'retrospective'
      && reviewAwaitingFeedbackRef.current
      && prompt.trim().length > 0
      && prompt !== PORTFOLIO_COPY.reviewOrder
      && !lower.startsWith('discuss ')
    ) {
      reviewAwaitingFeedbackRef.current = false;
      const over = /over-?order|too much|heavy|slow mover/i.test(prompt);
      const under = /under-?order|too little|light|buffer/i.test(prompt);
      const late = /late|delay|behind/i.test(prompt);
      const onTime = /on time|on-time|matched|punctual/i.test(prompt);
      const early = /\bearly\b/.test(prompt);
      replyAsAgent(PORTFOLIO_COPY.reviewFeedbackTitle, {
        userText: prompt,
        patch: { learningDecision: 'accepted' },
        label: 'Summarizing your forecast feedback…',
        bullets: [
          over
            ? 'Qty signal: over-order risk on parts of the mix - I’ll tighten coverage on slow movers next cycle.'
            : under
              ? 'Qty signal: under-order risk - I’ll allow more buffer on fast movers next cycle.'
              : 'Qty signal: noted from your write-up for the next coverage suggestion.',
          late
            ? 'ETA signal: arrival ran late vs plan - I’ll refresh lead-time median / p90 for MNP.'
            : early
              ? 'ETA signal: arrival was early - useful, but I won’t overfit one cycle.'
              : onTime
                ? 'ETA signal: arrival looked on time enough vs ETA.'
                : 'ETA signal: noted from your write-up for the next lead-time assumption.',
          PORTFOLIO_COPY.reviewFeedbackRemembered,
        ],
      });
      return;
    }

    if (lower.includes('accept as candidate') || prompt === PORTFOLIO_COPY.acceptLearning) {
      replyAsAgent(
        'Saved as a reviewable learning candidate. It will not become a live supplier rule until a human publishes it.',
        {
          userText: prompt,
          patch: { stage: 'retrospective', learningDecision: 'accepted' },
          label: 'Writing learning candidate…',
        },
      );
      return;
    }
    if (prompt === PORTFOLIO_COPY.dismissLearning || (lower.includes('dismiss') && state.stage === 'retrospective')) {
      replyAsAgent('Dismissed. Nothing was written to supplier memory.', {
        userText: prompt,
        patch: { stage: 'retrospective', learningDecision: 'dismissed' },
        label: 'Updating review decision…',
      });
      return;
    }

    if (lower.includes('confirm receipt') || prompt === PORTFOLIO_COPY.confirmReceipt) {
      if (!state.currentDdtReady) {
        replyAsAgent('Upload a DDT for this arrival before confirming receipt.', {
          userText: prompt,
          label: 'Checking DDT…',
        });
        return;
      }
      if (hasUnresolvedHold(state.receivingLines)) {
        const held = state.receivingLines.filter((line) => line.disposition === 'hold');
        replyAsAgent('Confirm is blocked by hold lines.', {
          userText: prompt,
          label: 'Checking receiving holds…',
          bullets: held.map((line) => `${line.sku} · on hold - accept as gift or return first.`),
          actions: held.flatMap((line) => [
            {
              id: `accept-block-${line.sku}`,
              label: PORTFOLIO_COPY.acceptSkuGift(line.sku),
              prompt: `Accept ${line.sku} as gift`,
            },
            {
              id: `return-block-${line.sku}`,
              label: PORTFOLIO_COPY.returnSku(line.sku),
              prompt: `Return ${line.sku}`,
            },
          ]),
        });
        return;
      }
      const confirmed = confirmCurrentReceiptBatch(state);
      const withAtt = ensureOrderedDocumentPack(confirmed);
      if (confirmed.receivingComplete) {
        replyAsAgent(
          'Arrival confirmed from Actual quantities. PO receiving is complete.',
          {
            userText: prompt,
            patch: {
              ...pickReceivingPatch(withAtt),
              stage: 'retrospective',
              learningDecision: 'pending',
            },
            label: 'Confirming counted receipt…',
            bullets: [
              'Receiving progress is fully received.',
              'Use Review this order - we’ll start with forecast questions (qty / ETA).',
            ],
            actions: [{
              id: 'review-order',
              label: PORTFOLIO_COPY.reviewOrder,
              prompt: PORTFOLIO_COPY.reviewOrder,
            }],
          },
        );
        return;
      }
      const openSummary = summarizeOpenRemainder(confirmed.receivingLines);
      replyAsAgent(
        `Batch ${confirmed.receiptBatches.length} confirmed from Actual quantities.`,
        {
          userText: prompt,
          patch: pickReceivingPatch(withAtt),
          label: 'Confirming counted receipt…',
          bullets: [
            'Stock-in used Actual qty (not DDT).',
            ...openSummary.bullets,
            PORTFOLIO_COPY.remainingPickIntro(openSummary.openPcs, openSummary.openSkuCount),
          ],
          // 对齐生产 Handle remaining：四选一
          actions: remainingChatActions(),
        },
      );
      return;
    }

    if (prompt === PORTFOLIO_COPY.uploadDdt || lower.includes('upload ddt')) {
      if (state.stage !== 'receiving') {
        replyAsAgent('Open the receiving workspace after Mark as ordered, then upload the DDT for this arrival.', {
          userText: prompt,
          label: 'Checking receiving stage…',
        });
        return;
      }
      if (state.receivingComplete) {
        replyAsAgent('Receiving is already complete for this PO.', {
          userText: prompt,
          label: 'Checking receiving state…',
        });
        return;
      }
      if (state.awaitingRemainingDecision) {
        replyAsAgent(
          'Open qty is still unresolved after the last confirm. Use Handle remaining first (e.g. Wait for next batch), then upload the next DDT.',
          { userText: prompt, label: 'Checking remaining decision…' },
        );
        return;
      }
      if (state.currentDdtReady) {
        replyAsAgent('Current DDT is already on the count sheet. Adjust counted qty, resolve holds, then Confirm receipt.', {
          userText: prompt,
          label: 'Checking DDT state…',
        });
        return;
      }
      const withDdt = ensureOrderedDocumentPack(applyCurrentBatchDdt(state));
      const batchNo = withDdt.receiptBatches.length + 1;
      const label = batchNo <= 1 ? 'DDT-1292' : 'DDT-1301';
      const report = buildDdtMatchReport(withDdt, label);
      // 预填一条「实点 ≠ DDT」的上报：发送后直接改表，演示差异处理
      const countable = withDdt.receivingLines.filter((line) => line.ddt > 0);
      const proposed = countable.slice(0, 2).map((line, index) => (
        // 第一条多收、第二条少收：一次覆盖 over / short 两种差异
        { sku: line.sku, qty: Math.max(0, line.ddt + (index === 0 ? 3 : -2)) }
      ));
      const prefill = proposed.length > 0
        ? PORTFOLIO_COPY.reportActualsPrefill(
          proposed.map((item) => PORTFOLIO_COPY.reportActualsPart(item.sku, item.qty)),
        )
        : undefined;
      replyAsAgent(report.text, {
        userText: prompt,
        patch: pickReceivingPatch(withDdt),
        label: 'Matching DDT to PO lines…',
        bullets: prefill ? [...report.bullets, PORTFOLIO_COPY.reportActualsHint] : report.bullets,
        actions: report.actions,
        draftAfter: prefill,
      });
      return;
    }

    // 在 chat 处理收货差异：Accept / Return / Hold 某 SKU
    const dispositionMatch = prompt.match(
      /^(?:accept|return|hold)\s+([A-Z0-9-]+)(?:\s+as\s+gift|\s+for\s+review)?$/i,
    );
    if (
      dispositionMatch
      || (lower.includes('accept') && lower.includes('as gift'))
      || lower.startsWith('return ')
      || lower.startsWith('hold ')
    ) {
      const skuFromPrompt = dispositionMatch?.[1]?.toUpperCase()
        ?? (lower.match(/\b(new-024|431001|370102|370108|431015|420106|510002)\b/i)?.[1]?.toUpperCase() ?? null);
      const nextDisposition: 'receive' | 'return' | 'hold' | null = lower.startsWith('return') || lower.includes('return ')
        ? 'return'
        : lower.startsWith('hold') || lower.includes('hold ')
          ? 'hold'
          : lower.includes('accept')
            ? 'receive'
            : null;

      if (skuFromPrompt && nextDisposition && state.stage === 'receiving') {
        const line = state.receivingLines.find((item) => item.sku === skuFromPrompt);
        if (!line) {
          replyAsAgent(`I don’t see ${skuFromPrompt} on this receiving sheet.`, {
            userText: prompt,
            label: 'Checking SKU…',
          });
          return;
        }
        const patchedLines = state.receivingLines.map((item) => (
          item.sku === skuFromPrompt ? { ...item, disposition: nextDisposition } : item
        ));
        const verb = nextDisposition === 'receive'
          ? 'accepted as gift / receive'
          : nextDisposition === 'return'
            ? 'marked Return (will not stock-in)'
            : 'put on hold for review';
        replyAsAgent(`${skuFromPrompt} ${verb}. You can keep adjusting in chat or Confirm receipt when ready.`, {
          userText: prompt,
          patch: { receivingLines: patchedLines },
          label: 'Updating disposition…',
          actions: [
            {
              id: 'confirm-after-disposition',
              label: PORTFOLIO_COPY.confirmReceipt,
              prompt: PORTFOLIO_COPY.confirmReceipt,
            },
          ],
        });
        return;
      }
    }

    // chat 上报仓点 Actual（与 DDT 的差异），支持一条消息报多个 SKU
    const mentionsCount = /\b(?:counted|actual|received)\b/i.test(prompt);
    if (mentionsCount && state.stage === 'receiving' && state.currentDdtReady) {
      // 「33 for 431001」与「431001 → 33 / 431001 counted 33」两种写法都接受
      const updates = new Map<string, number>();
      for (const line of state.receivingLines) {
        const sku = line.sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const before = prompt.match(new RegExp(`(\\d+)\\s*(?:units?\\s*)?for\\s+${sku}\\b`, 'i'));
        const after = prompt.match(
          new RegExp(`\\b${sku}\\b\\s*(?:\u2192|->|:|=|is|counted|received|actual)?\\s*(\\d+)`, 'i'),
        );
        const qty = Number(before?.[1] ?? after?.[1]);
        if (Number.isFinite(qty)) updates.set(line.sku, qty);
      }

      if (updates.size === 0) {
        replyAsAgent('Tell me like “Warehouse counted 46 for 431001”.', {
          userText: prompt,
          label: 'Reading count…',
        });
        return;
      }

      const patchedLines = state.receivingLines.map((item) => (
        updates.has(item.sku)
          ? { ...item, counted: updates.get(item.sku)!, justUpdated: true }
          : { ...item, justUpdated: false }
      ));
      const changed = state.receivingLines.filter((item) => updates.has(item.sku));

      replyAsAgent(PORTFOLIO_COPY.actualsUpdatedTitle(changed.length), {
        userText: prompt,
        patch: { receivingLines: patchedLines },
        label: 'Updating Actual qty…',
        bullets: changed.map((item) => (
          PORTFOLIO_COPY.actualsUpdatedLine(item.sku, item.ddt, updates.get(item.sku)!)
        )),
        actions: hasUnresolvedHold(patchedLines)
          ? undefined
          : [{
              id: 'confirm-after-count',
              label: PORTFOLIO_COPY.confirmReceipt,
              prompt: PORTFOLIO_COPY.confirmReceipt,
            }],
      });
      return;
    }

    if (lower.includes('short vs order') || lower.includes('short vs ddt') || lower.includes('shortfall')) {
      const sku = lower.match(/\b(431001|370102|370108|431015|420106|510002|new-024)\b/i)?.[1]?.toUpperCase() ?? '431001';
      const line = state.receivingLines.find((item) => item.sku === sku);
      if (!line) {
        replyAsAgent(`I don’t see ${sku} on this receiving sheet.`, {
          userText: prompt,
          label: 'Checking SKU…',
        });
        return;
      }
      const open = Math.max(0, line.ordered - line.stocked);
      if (lower.includes('short vs order') || (line.ddt > 0 && line.ddt < open && !lower.includes('short vs ddt'))) {
        const gap = open - line.ddt;
        if (gap > 0 && line.ddt > 0) {
          replyAsAgent(`${sku} · DDT vs order`, {
            userText: prompt,
            label: 'Comparing DDT vs order…',
            bullets: [
              `Ordered open ${open}; this DDT only shows ${line.ddt} (−${gap}).`,
              'Actual defaults to DDT - change Actual or tell me if warehouse count differs.',
              'After Confirm, use Handle remaining / next DDT for the open remainder.',
            ],
            actions: [
              {
                id: 'count-demo',
                label: PORTFOLIO_COPY.reportCountShort(sku, Math.max(0, line.ddt - 2)),
                prompt: PORTFOLIO_COPY.reportCountShort(sku, Math.max(0, line.ddt - 2)),
              },
              {
                id: 'confirm-after-explain-order',
                label: PORTFOLIO_COPY.confirmReceipt,
                prompt: PORTFOLIO_COPY.confirmReceipt,
              },
            ],
          });
          return;
        }
      }
      if (line.ddt > line.counted) {
        const gap = line.ddt - line.counted;
        replyAsAgent(`${sku} · Actual vs DDT`, {
          userText: prompt,
          label: 'Comparing Actual vs DDT…',
          bullets: [
            `DDT ${line.ddt}; Actual ${line.counted} (−${gap}).`,
            'Stock-in uses Actual so inventory stays honest.',
          ],
          actions: [{
            id: 'confirm-after-explain-ddt',
            label: PORTFOLIO_COPY.confirmReceipt,
            prompt: PORTFOLIO_COPY.confirmReceipt,
          }],
        });
        return;
      }
      replyAsAgent(`No shortfall recorded for ${sku} on the current batch.`, {
        userText: prompt,
        label: 'Checking variance…',
      });
      return;
    }

    // 处理剩余：chat 点选四选项之一，或打开选项列表
    const remainingPick = remainingDecisionFromPrompt(prompt);
    if (
      remainingPick
      || prompt === PORTFOLIO_COPY.handleRemaining
      || lower.includes('handle remaining')
    ) {
      if (!remainingPick) {
        const openSummary = summarizeOpenRemainder(state.receivingLines);
        replyAsAgent('Handle remaining goods', {
          userText: prompt,
          label: 'Opening remaining-goods options…',
          bullets: [
            PORTFOLIO_COPY.remainingPickIntro(openSummary.openPcs, openSummary.openSkuCount),
            ...openSummary.bullets,
          ],
          actions: remainingChatActions(),
        });
        return;
      }
      const next = applyRemainingGoodsDecision(state, remainingPick);
      const title = PORTFOLIO_COPY.remainingOptions[remainingPick].title;
      if (next.receivingComplete) {
        replyAsAgent(`Remaining-goods decision saved: ${title}.`, {
          userText: prompt,
          patch: {
            ...pickReceivingPatch(next),
            stage: 'retrospective',
            learningDecision: 'pending',
          },
          label: 'Recording remaining-goods decision…',
          bullets: [
            PORTFOLIO_COPY.remainingOptions[remainingPick].result,
            'Receiving is fully closed. Use Review this order to discuss forecast qty / ETA first.',
          ],
          actions: [{
            id: 'review-order-after-close',
            label: PORTFOLIO_COPY.reviewOrder,
            prompt: PORTFOLIO_COPY.reviewOrder,
          }],
        });
        return;
      }
      replyAsAgent(`Remaining-goods decision saved: ${title}.`, {
        userText: prompt,
        patch: pickReceivingPatch(next),
        label: 'Recording remaining-goods decision…',
        bullets: [
          PORTFOLIO_COPY.remainingOptions[remainingPick].result,
          'Upload the next DDT when it arrives.',
        ],
        actions: [{
          id: 'upload-next-ddt',
          label: PORTFOLIO_COPY.uploadDdt,
          prompt: PORTFOLIO_COPY.uploadDdt,
        }],
      });
      return;
    }

    // 推给 Owner（补货计划 Approve 弹窗选项）
    if (
      prompt === PORTFOLIO_COPY.approvePushOwner
      || lower.includes('push to owner')
      || lower.includes('submit for approval')
    ) {
      const withConfirmation = state.confirmationUploaded
        ? state
        : applyConfirmationUpload(state);
      const submitted = submitForApproval(withConfirmation);
      replyAsAgent(
        'Pushed to Owner approval. Staying on the replenishment plan. Mark as ordered appears only after Approve. Approve ≠ order.',
        {
          userText: prompt,
          patch: {
            stage: 'replenishment',
            confirmationUploaded: submitted.confirmationUploaded,
            confirmationHasRisk: submitted.confirmationHasRisk,
            lines: submitted.lines,
            confirmationRounds: submitted.confirmationRounds,
            attachments: submitted.attachments,
            approvalTriggers: submitted.approvalTriggers,
            approvalRequiredByRules: submitted.approvalRequiredByRules,
            approvalSubmitted: true,
            approvalDecision: submitted.approved ? 'approved' : 'pending',
            approved: submitted.approved,
            planGenerated: true,
          },
          label: 'Pushing to Owner approval…',
        },
      );
      return;
    }

    // 直接 Approve（补货计划）或 Owner 页 Approve - 文案同为 Approve
    if (
      prompt === PORTFOLIO_COPY.approveDirect
      || prompt === PORTFOLIO_COPY.approve
      || prompt === PORTFOLIO_COPY.approvePlan
      || (lower.includes('approve') && !lower.includes('approval?') && !lower.includes('push'))
    ) {
      if (!state.confirmationUploaded) {
        replyAsAgent(
          'Upload a supplier confirmation first. Approval is bound to a specific confirmation version.',
          { userText: prompt, label: 'Checking confirmation evidence…' },
        );
        return;
      }
      const asOwner = state.stage === 'approval';
      const approvedState = appendNegotiationNote(approveProposal(state), {
        at: new Date().toISOString().slice(0, 16).replace('T', ' '),
        actor: 'Buyer',
        text: asOwner
          ? 'Owner approved the commercial proposal on the current confirmation. Order not placed - still requires Mark as ordered after external purchase.'
          : 'Buyer approved directly on the replenishment plan. Order not placed - Mark as ordered remains a separate step.',
      });
      replyAsAgent(
        asOwner
          ? 'Approved as owner. This is not an order. Mark as ordered when the external purchase is done.'
          : 'Approved directly on the plan. Staying here - Mark as ordered is now available. Approve ≠ order.',
        {
          userText: prompt,
          patch: {
            stage: asOwner ? 'approval' : 'replenishment',
            approved: true,
            approvalSubmitted: true,
            approvalDecision: 'approved',
            confirmationRounds: approvedState.confirmationRounds,
            messageSeq: approvedState.messageSeq,
            planGenerated: true,
          },
          label: 'Applying approval decision…',
        },
      );
      return;
    }

    if (
      prompt === PORTFOLIO_COPY.uploadInvoice
      || prompt === PORTFOLIO_COPY.reuploadInvoice
      || lower.includes('upload invoice')
      || lower.includes('re-upload invoice')
    ) {
      if (!state.orderRecorded) {
        replyAsAgent('Mark as ordered first - invoice upload is available after the PO is recorded as ordered.', {
          userText: prompt,
          label: 'Checking order stage…',
        });
        return;
      }
      const withInvoice = ensureOrderedDocumentPack(applyInvoiceUpload(state));
      replyAsAgent(PORTFOLIO_COPY.invoiceUploadedNote(PORTFOLIO_COPY.invoiceFileDemo), {
        userText: prompt,
        patch: { attachments: withInvoice.attachments },
        label: 'Recording supplier invoice…',
      });
      return;
    }

    if (lower.includes('upload confirmation') || prompt === PORTFOLIO_COPY.uploadConfirmation) {
      const fileName = nextDemoConfirmationFile(state);
      const beforeCurrent = state.confirmationRounds.find((round) => round.isCurrent)?.fileName ?? null;
      const uploaded = applyConfirmationUpload(state, fileName);
      const isDifferent = !beforeCurrent || beforeCurrent !== fileName;
      const fired = uploaded.approvalTriggers.filter((item) => item.fired);
      const agentText = [
        isDifferent
          ? PORTFOLIO_COPY.confirmationDifferentRecorded(fileName)
          : PORTFOLIO_COPY.confirmationSameFile,
        PORTFOLIO_COPY.confirmationDiff,
        fired.length > 0
          ? `Activation rules fired (${fired.length}). Use Approve to choose direct approve or push to Owner - Mark as ordered unlocks after Approve.`
          : 'No activation rules fired. Use Approve (direct or push to Owner). Mark as ordered unlocks after Approve.',
      ].join('\n\n');
      replyAsAgent(agentText, {
        userText: `Uploaded supplier confirmation ${fileName}`,
        patch: {
          // Owner 页上传也留在当前 stage；谈价两边共用同一 confirmationRounds
          stage: state.stage === 'approval' ? 'approval' : 'replenishment',
          confirmationUploaded: uploaded.confirmationUploaded,
          confirmationHasRisk: uploaded.confirmationHasRisk,
          lines: uploaded.lines,
          confirmationRounds: uploaded.confirmationRounds,
          attachments: uploaded.attachments,
          approvalTriggers: uploaded.approvalTriggers,
          approvalRequiredByRules: uploaded.approvalRequiredByRules,
          approvalSubmitted: uploaded.approvalSubmitted,
          approvalDecision: uploaded.approvalDecision,
          approved: uploaded.approved,
          messageSeq: uploaded.messageSeq,
          planGenerated: true,
        },
        label: 'Parsing confirmation diffs…',
      });
      return;
    }

    if (
      prompt === PORTFOLIO_COPY.markOrdered
      || prompt === PORTFOLIO_COPY.recordOrdered
      || lower.includes('mark as ordered')
      || lower.includes('record as ordered')
    ) {
      if (!state.confirmationUploaded) {
        replyAsAgent(
          'Upload the final supplier confirmation first - it is the evidence for recording an external order.',
          { userText: prompt, label: 'Checking confirmation evidence…' },
        );
        return;
      }
      if (!state.approved) {
        replyAsAgent(
          'Mark as ordered is available only after Approve. Use Approve first (directly or via Owner), then record the external order.',
          { userText: prompt, label: 'Checking approval gate…' },
        );
        return;
      }
      {
        // 聊天快捷：若弹窗未填，用系统默认补齐
        const orderMeta: MarkOrderMeta = {
          orderAt: state.orderAt ?? nowLocalDateTimeValue(),
          orderedBy: state.orderedBy?.trim()
            || `${DEMO_OPERATORS[0].name} · ${DEMO_OPERATORS[0].role}`,
          expectedArrival: state.expectedArrival ?? defaultExpectedArrivalDate(),
        };
        // 已下单：补齐申请/计划/发票，并按业务时间线排序
        const seeded = ensureOrderedDocumentPack(freshReceivingState({
          ...state,
          orderAt: orderMeta.orderAt,
          orderedBy: orderMeta.orderedBy,
          expectedArrival: orderMeta.expectedArrival,
        }));
        setGuideOpen(true);
        replyAsAgent(
          `Order recorded as placed outside the platform · ${orderMeta.orderAt.replace('T', ' ')} · by ${orderMeta.orderedBy} · ETA ${orderMeta.expectedArrival}. I will not contact the supplier. Next: two-shipment receiving on PO-2026-0842 - upload DDT-1292, confirm, Handle remaining (wait next batch), then DDT-1301.`,
          {
            userText: prompt,
            patch: {
              ...pickReceivingPatch(seeded),
              orderRecorded: true,
              orderAt: orderMeta.orderAt,
              orderedBy: orderMeta.orderedBy,
              expectedArrival: orderMeta.expectedArrival,
            },
            label: 'Recording external order…',
          },
        );
      }
      return;
    }

    if (lower.includes('export') || prompt === PORTFOLIO_COPY.exportRequest) {
      replyAsAgent(
        'Use Export request on the plan. The file includes supplier codes, names, and quantities only - no prices - and is downloaded, not sent.',
        { userText: prompt, label: 'Checking export rules…' },
      );
      return;
    }

    if (lower.includes('why did you recommend') || lower.includes('why recommend')) {
      const skuMatch = state.lines.find((line) => lower.includes(line.sku.toLowerCase()));
      const spuMatch = state.lines.find((line) => lower.includes(line.productName.toLowerCase()));
      if (skuMatch) {
        replyAsAgent(
          [
            `${skuMatch.sku} · ${skuMatch.variant}:`,
            `• Sales 30d ${skuMatch.sales30} · stock ${skuMatch.stock}`,
            `• Coverage target drives suggested ${skuMatch.recommended}; current qty ${skuMatch.qty}`,
            `• Lead-time median for MNP is applied so arrival covers the window`,
            skuMatch.alert ? `• Note: ${skuMatch.alert}` : '• No planner alert on this SKU',
            'You can edit qty or delete the line - I will not place the order.',
          ].join('\n'),
          { userText: prompt, label: 'Explaining SKU recommendation…' },
        );
        return;
      }
      if (spuMatch) {
        const siblings = state.lines.filter((line) => line.productId === spuMatch.productId);
        const qty = siblings.reduce((sum, line) => sum + line.qty, 0);
        const sales = siblings.reduce((sum, line) => sum + line.sales30, 0);
        replyAsAgent(
          [
            `${spuMatch.productName} (${siblings.length} SKUs):`,
            `• Group sales 30d ${sales} · suggested total qty ${qty}`,
            `• Variants kept when velocity or pack size differs`,
            '• Quantities are planner output - edit or delete freely before export',
          ].join('\n'),
          { userText: prompt, label: 'Explaining SPU recommendation…' },
        );
        return;
      }
      replyAsAgent(
        'Recommendations combine sales velocity, on-hand stock, inbound, and MNP lead-time median for the coverage window. Ask about a specific SPU or SKU for the line-level breakdown.',
        { userText: prompt, label: 'Explaining planner logic…' },
      );
      return;
    }

    if (lower.includes('price change') || lower.includes('370102')) {
      replyAsAgent(
        '370102: estimated €5.40 → confirmed €5.85 (+8.3%), qty 96 → 90. That combination usually needs owner judgment before recording the order.',
        { userText: prompt, label: 'Reviewing price variance…' },
      );
      return;
    }

    if (lower.includes('hold') || lower.includes('new-024')) {
      replyAsAgent(
        'NEW-024 appeared on the DDT as a supplier promo/gift (not on the confirmation PO lines). Hold means it is not stocked in until a human accepts it as gift/substitute or marks Return.',
        { userText: prompt, label: 'Tracing hold reason…' },
      );
      return;
    }

    // Intake clarify → generate
    if (state.stage === 'intake' || (!state.planGenerated && promptMentionsSupplier(prompt))) {
      const wantsGenerate =
        lower.includes('no extra')
        || lower.includes('generate the plan')
        || prompt === PORTFOLIO_COPY.generatePlan;

      if (wantsGenerate && state.intakeDraft?.coverageDays) {
        runPlanGeneration(state.intakeDraft, prompt);
        return;
      }

      if (promptMentionsSupplier(prompt) || promptHasCoverage(prompt)) {
        const draft = {
          ...buildPartialIntake(prompt),
          coverageDays: promptHasCoverage(prompt)
            ? buildPartialIntake(prompt).coverageDays
            : state.intakeDraft?.coverageDays ?? null,
          constraints: state.intakeDraft?.constraints ?? 'Not confirmed',
        };

        if (!draft.coverageDays) {
          replyAsAgent(PORTFOLIO_COPY.clarifyCoverage, {
            userText: prompt,
            patch: { stage: 'intake', intakeDraft: draft },
            label: 'Clarifying coverage window…',
          });
          return;
        }

        if (!wantsGenerate && draft.constraints === 'Not confirmed') {
          replyAsAgent(PORTFOLIO_COPY.askConstraints, {
            userText: prompt,
            patch: { stage: 'intake', intakeDraft: draft },
            label: 'Checking open constraints…',
          });
          return;
        }

        runPlanGeneration(draft, prompt);
        return;
      }
    }

    // Not a scripted business action → treat it as a question about how this was designed.
    replyAsAgent(
      askProjectAgent(prompt, buildHistory(state.messages)).catch((error: unknown) => {
        if (error instanceof Error && error.message === 'rate_limited') return AGENT_RATE_LIMITED;
        throw error;
      }),
      { userText: prompt, label: 'Looking up the design decision…' },
    );
  }, [
    replyAsAgent,
    runPlanGeneration,
    playReplenishmentIntro,
    state.approved,
    state.awaitingRemainingDecision,
    state.confirmationHasRisk,
    state.confirmationUploaded,
    state.currentDdtReady,
    state.draftInput,
    state.intakeDraft,
    state.lines,
    state.confirmationRounds,
    state.planGenerated,
    state.receiptBatches,
    state.receivingComplete,
    state.receivingLines,
    state.stage,
  ]);

  const suggestions = useMemo(() => suggestionsFor(state), [state]);

  return (
    // 无外框：窗口直接铺满容器（嵌到个人站 iframe 里时由外层控制尺寸）
    <div className="flex h-dvh min-h-0 items-stretch justify-center text-[#1a1d26]">
      {/* 窗口本体用灰底：避免 main 下拉回弹时从顶上「拉出」一层白底 */}
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#eef0f4]">
        <PortfolioBrowserChrome guideOpen={guideOpen} onToggleGuide={() => setGuideOpen((v) => !v)} />
        <div className="flex min-h-0 flex-1 overflow-hidden bg-[#eef0f4]">
        <div className="hidden md:flex">
          <PortfolioStageNav stage={state.stage} onSelect={selectStage} onReset={reset} />
        </div>
        {/* 滚动在 main：白卡片随内容变高并整卡上移（勿给卡片 h-full，否则只剩内部滚）。
            内边距放在 main 上，便于操作栏 sticky -top / 小计 sticky bottom 对齐库存总览。 */}
        <main className="min-w-0 flex-1 overflow-y-auto overscroll-y-none bg-[#eef0f4] px-3 pb-3 pt-3 md:px-4 md:pb-4 md:pr-2 md:pt-4">
            <div className="rounded-2xl bg-white">
            <PortfolioMainCanvas
              state={state}
              onGoStage={selectStage}
              onUpdateEstQty={(sku, qty) => {
                setState((prev) => ({
                  ...prev,
                  exportFormat: null,
                  lines: prev.lines.map((line) => {
                    if (line.sku !== sku) return line;
                    // 确认前 Est/Conf 数量同步；确认后只改计划量
                    if (!prev.confirmationUploaded) {
                      return { ...line, plannedQty: qty, qty };
                    }
                    return { ...line, plannedQty: qty };
                  }),
                }));
              }}
              onUpdateConfQty={(sku, qty) => {
                setState((prev) => ({
                  ...prev,
                  exportFormat: null,
                  lines: prev.lines.map((line) => {
                    if (line.sku !== sku) return line;
                    if (!prev.confirmationUploaded) {
                      return { ...line, plannedQty: qty, qty };
                    }
                    return { ...line, qty };
                  }),
                }));
              }}
              onUpdateEstPrice={(sku, price) => {
                setState((prev) => ({
                  ...prev,
                  exportFormat: null,
                  lines: prev.lines.map((line) => (
                    line.sku === sku ? { ...line, estimatedPrice: price } : line
                  )),
                }));
              }}
              onUpdateConfPrice={(sku, price) => {
                setState((prev) => ({
                  ...prev,
                  exportFormat: null,
                  lines: prev.lines.map((line) => (
                    line.sku === sku ? { ...line, confirmedPrice: price } : line
                  )),
                }));
              }}
              onDeleteSku={(sku) => {
                setState((prev) => ({
                  ...prev,
                  exportFormat: null,
                  lines: prev.lines.filter((line) => line.sku !== sku),
                }));
              }}
              onDeleteSpu={(productId) => {
                setState((prev) => ({
                  ...prev,
                  exportFormat: null,
                  lines: prev.lines.filter((line) => line.productId !== productId),
                }));
              }}
              onExport={(format) => {
                setState((prev) => upsertExportAttachment(prev, format));
                replyAsAgent(
                  `${PORTFOLIO_COPY.exportDone(format)}. Saved under Attachments - downloaded only, not sent.`,
                  { label: 'Preparing export package…' },
                );
              }}
              onDownloadAttachment={(attachment) => {
                replyAsAgent(
                  PORTFOLIO_COPY.attachmentsDownloaded(attachment.fileName),
                  { label: 'Preparing attachment download…' },
                );
              }}
              onAddNegotiationNote={(text, actor: NegotiationNote['actor'] = 'Buyer') => {
                setState((prev) => appendNegotiationNote(prev, {
                  at: new Date().toISOString().slice(0, 16).replace('T', ' '),
                  actor,
                  text,
                }));
                replyAsAgent(
                  `Negotiation note recorded (${actor}). Keep using the log until you approve the final proposal.`,
                  { label: 'Recording negotiation note…' },
                );
              }}
              onUploadConfirmation={() => handlePrompt(PORTFOLIO_COPY.uploadConfirmation)}
              onUploadInvoice={() => handlePrompt(PORTFOLIO_COPY.uploadInvoice)}
              onApproveClick={() => setGuideOpen(false)}
              onApproveDirect={() => handlePrompt(PORTFOLIO_COPY.approveDirect)}
              onPushToOwner={() => handlePrompt(PORTFOLIO_COPY.approvePushOwner)}
              onMarkOrdered={(meta: MarkOrderMeta) => {
                if (!state.confirmationUploaded) {
                  replyAsAgent(
                    'Upload the final supplier confirmation first - it is the evidence for recording an external order.',
                    { label: 'Checking confirmation evidence…' },
                  );
                  return;
                }
                if (!state.approved) {
                  replyAsAgent(
                    'Mark as ordered is available only after Approve. Use Approve first (directly or via Owner), then record the external order.',
                    { label: 'Checking approval gate…' },
                  );
                  return;
                }
                // 已下单：补齐申请/计划/发票，并按业务时间线排序
                const seeded = ensureOrderedDocumentPack(freshReceivingState({
                  ...state,
                  orderAt: meta.orderAt,
                  orderedBy: meta.orderedBy,
                  expectedArrival: meta.expectedArrival,
                }));
                setGuideOpen(true);
                replyAsAgent(
                  `Order recorded as placed outside the platform · ${meta.orderAt.replace('T', ' ')} · by ${meta.orderedBy} · ETA ${meta.expectedArrival}. I will not contact the supplier. Next: two-shipment receiving on PO-2026-0842 - upload DDT-1292, confirm, Handle remaining (wait next batch), then DDT-1301.`,
                  {
                    userText: PORTFOLIO_COPY.markOrdered,
                    patch: {
                      ...pickReceivingPatch(seeded),
                      orderRecorded: true,
                      orderAt: meta.orderAt,
                      orderedBy: meta.orderedBy,
                      expectedArrival: meta.expectedArrival,
                    },
                    label: 'Recording external order…',
                  },
                );
              }}
              onApprove={() => handlePrompt(PORTFOLIO_COPY.approve)}
              onUploadDdt={() => {
                handlePrompt(PORTFOLIO_COPY.uploadDdt);
              }}
              onHandleRemaining={(decision: RemainingReceiptDecision) => {
                const next = applyRemainingGoodsDecision(state, decision);
                const title = PORTFOLIO_COPY.remainingOptions[decision].title;
                if (next.receivingComplete) {
                  replyAsAgent(
                    `Remaining-goods decision saved: ${title}. PO receiving closed.`,
                    {
                      patch: {
                        ...pickReceivingPatch(next),
                        stage: 'retrospective',
                        learningDecision: 'pending',
                      },
                      label: 'Recording remaining-goods decision…',
                      bullets: [
                        'Receiving is fully closed. Use Review this order to discuss forecast qty / ETA first.',
                      ],
                      actions: [{
                        id: 'review-order-canvas',
                        label: PORTFOLIO_COPY.reviewOrder,
                        prompt: PORTFOLIO_COPY.reviewOrder,
                      }],
                    },
                  );
                  return;
                }
                replyAsAgent(
                  `Remaining-goods decision saved: ${title}. ${PORTFOLIO_COPY.remainingOptions[decision].result} You can upload the next DDT when it arrives.`,
                  {
                    patch: pickReceivingPatch(next),
                    label: 'Recording remaining-goods decision…',
                  },
                );
              }}
              onUpdateCounted={(sku, qty) => {
                setState((prev) => ({
                  ...prev,
                  receivingLines: prev.receivingLines.map((line) => (
                    line.sku === sku ? { ...line, counted: qty } : line
                  )),
                }));
              }}
              onSetDisposition={(sku, disposition) => {
                setState((prev) => ({
                  ...prev,
                  receivingLines: prev.receivingLines.map((line) => (
                    line.sku === sku ? { ...line, disposition } : line
                  )),
                }));
              }}
              onConfirmReceipt={() => handlePrompt(PORTFOLIO_COPY.confirmReceipt)}
              onLearning={(decision) => {
                handlePrompt(decision === 'accepted'
                  ? PORTFOLIO_COPY.acceptLearning
                  : PORTFOLIO_COPY.dismissLearning);
              }}
              onAskAgent={handlePrompt}
              onRenameTitle={(title) => {
                setState((prev) => ({ ...prev, documentTitle: title }));
              }}
            />
            </div>
        </main>
        <PortfolioAgentPanel
          stage={state.stage}
          messages={state.messages}
          draftInput={state.draftInput}
          busy={busy}
          suggestions={suggestions}
          designMode={state.stage === 'intake' && !state.intakeDraft}
          kickoffReady={
            state.stage === 'intake'
            && !state.intakeDraft
            && !busy
            && state.draftInput.trim().length > 0
            && state.messages.every((m) => m.role !== 'user')
          }
          onDraftInputChange={(value) => setState((prev) => ({ ...prev, draftInput: value }))}
          onSend={(text) => {
            // 第四步：从输入框上报实点 vs DDT 后关掉引导
            if (state.stage === 'receiving' && state.currentDdtReady) {
              setGuideOpen(false);
            }
            handlePrompt(text ?? state.draftInput);
          }}
          onSuggestion={handlePrompt}
          onAttachFile={(file) => {
            // Demo：按阶段把聊天附件路由到对应上传动作
            const name = file.name.toLowerCase();
            if (state.stage === 'receiving') {
              handlePrompt(PORTFOLIO_COPY.uploadDdt);
              return;
            }
            if (state.orderRecorded || name.includes('ft_') || name.includes('fattura') || name.includes('invoice')) {
              handlePrompt(PORTFOLIO_COPY.uploadInvoice);
              return;
            }
            handlePrompt(PORTFOLIO_COPY.uploadConfirmation);
          }}
        />
        </div>
      </div>

      <PortfolioCoach
        steps={coachSteps}
        open={guideOpen && !(state.stage === 'replenishment' && !state.planGenerated)}
        onClose={() => setGuideOpen(false)}
      />
    </div>
  );
}
