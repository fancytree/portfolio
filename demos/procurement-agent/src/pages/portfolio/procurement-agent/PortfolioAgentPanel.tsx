import { useEffect, useRef, useState } from 'react';
import { CheckIcon, ChevronDownIcon, Loader2Icon, PaperclipIcon, SendIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PORTFOLIO_COPY } from './portfolioDemoCopy';
import { PHASES } from './portfolioDemoScript';
import type { DemoChatAction, DemoChatMessage, DemoPhaseKey, DemoStageId } from './portfolioDemoTypes';

type Props = {
  stage: DemoStageId;
  messages: DemoChatMessage[];
  draftInput: string;
  busy?: boolean;
  suggestions: string[];
  /** 开场：输入框已预填需求，提示点 Send 开始 */
  kickoffReady?: boolean;
  /** Intro stage: retitle the panel and the composer for design questions. */
  designMode?: boolean;
  onDraftInputChange: (value: string) => void;
  onSend: (text?: string) => void;
  onSuggestion: (text: string) => void;
  /** 聊天区附件：Demo 按阶段路由到 confirmation / DDT / invoice */
  onAttachFile?: (file: File) => void;
};

/** 输入框最大高度（px）；超出后内部滚动 */
const COMPOSER_MAX_HEIGHT = 160;
const COMPOSER_MIN_HEIGHT = 44;

/** 推荐操作芯片：与对话气泡区分（非圆角聊天气泡，带 Suggested 标签） */
function RecommendedActions({
  actions,
  disabled,
  onAction,
}: {
  actions: DemoChatAction[];
  disabled?: boolean;
  onAction: (prompt: string) => void;
}) {
  if (actions.length === 0) return null;
  return (
    <div className="mt-2.5 space-y-1.5 border-t border-[#e4e8f0] pt-2.5">
      <p className="text-[10px] font-semibold tracking-wide text-[#8b93a7] uppercase">
        {PORTFOLIO_COPY.recommendedActions}
      </p>
      <div className="flex flex-col gap-1.5">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            disabled={disabled}
            onClick={() => onAction(action.prompt)}
            className={cn(
              'cursor-pointer rounded-lg border border-dashed border-[#b8c9f0] bg-[#f5f8ff] px-2.5 py-2',
              'text-left text-[12px] font-medium text-[#2f6bff] transition',
              'hover:border-solid hover:border-[#2f6bff]/45 hover:bg-[#ebf1ff]',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const THINK_STEPS = ['Read request', 'Check constraints', 'Draft reply'] as const;

function statusTitle(message: DemoChatMessage): string {
  const progress = message.progress;
  if (!progress) return message.text;
  if (progress.status === 'complete') {
    return message.mode === 'plan' ? 'Plan assembly complete' : 'Thinking complete';
  }
  if (message.mode === 'plan') {
    if (progress.current) return PORTFOLIO_COPY.phaseLabels[progress.current];
    return message.text || 'Building recommendation…';
  }
  return message.text || 'Thinking…';
}

function PhaseList({
  completed,
  current,
  running,
}: {
  completed: DemoPhaseKey[];
  current: DemoPhaseKey | null;
  running: boolean;
}) {
  return (
    <ol className="space-y-1.5">
      {PHASES.map((phase) => {
        const done = completed.includes(phase);
        const isCurrent = running && current === phase;
        return (
          <li key={phase} className="flex items-center gap-2 text-[11px]">
            {done ? (
              <CheckIcon className="size-3 text-[#22a06b]" />
            ) : isCurrent ? (
              <Loader2Icon className="size-3 animate-spin text-[#2f6bff]" />
            ) : (
              <span className="size-3 rounded-full border border-[#d9dde7]" />
            )}
            <span className={isCurrent ? 'font-medium text-[#1a1d26]' : 'text-[#8b93a7]'}>
              {PORTFOLIO_COPY.phaseLabels[phase]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function ThinkList({
  label,
  complete,
  thinkStep = 0,
}: {
  label: string;
  complete: boolean;
  thinkStep?: number;
}) {
  return (
    <ol className="space-y-1.5">
      {THINK_STEPS.map((step, index) => {
        const done = complete || index < thinkStep;
        const isCurrent = !complete && index === thinkStep;
        return (
          <li key={step} className="flex items-center gap-2 text-[11px]">
            {done ? (
              <CheckIcon className="size-3 text-[#22a06b]" />
            ) : isCurrent ? (
              <Loader2Icon className="size-3 animate-spin text-[#2f6bff]" />
            ) : (
              <span className="size-3 rounded-full border border-[#d9dde7]" />
            )}
            <span className={isCurrent ? 'font-medium text-[#1a1d26]' : 'text-[#8b93a7]'}>
              {isCurrent ? label : step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * 对话内嵌状态卡：运行中默认展开；结束后收起，仍留在触发位置。
 */
function StatusCard({ message }: { message: DemoChatMessage }) {
  const progress = message.progress ?? { status: 'idle' as const, current: null, completed: [] };
  const running = progress.status === 'running';
  const complete = progress.status === 'complete';
  const [expanded, setExpanded] = useState(running);

  useEffect(() => {
    if (running) setExpanded(true);
    if (complete) setExpanded(false);
  }, [running, complete]);

  const title = statusTitle(message);

  return (
    <div className="flex justify-start motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300">
      <div
        className="w-full max-w-[92%] overflow-hidden rounded-2xl border border-[#e8eaef] bg-white"
        aria-label="Agent workflow status"
      >
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2.5 text-left transition hover:bg-[#fafbfc]"
          aria-expanded={expanded}
        >
          <span className="flex min-w-0 items-center gap-2">
            {running ? (
              <Loader2Icon className="size-3.5 shrink-0 animate-spin text-[#2f6bff]" />
            ) : complete ? (
              <CheckIcon className="size-3.5 shrink-0 text-[#22a06b]" />
            ) : (
              <span className="size-3.5 shrink-0 rounded-full border border-[#d9dde7]" />
            )}
            <span className="truncate text-[11px] font-medium text-[#5c6478]">{title}</span>
          </span>
          <ChevronDownIcon
            className={cn(
              'size-3.5 shrink-0 text-[#8b93a7] transition-transform',
              expanded && 'rotate-180',
            )}
          />
        </button>

        {expanded ? (
          <div className="border-t border-[#eef0f4] px-3 py-2.5">
            {message.mode === 'plan' ? (
              <PhaseList
                completed={progress.completed}
                current={progress.current}
                running={running}
              />
            ) : (
              <ThinkList
                label={message.text}
                complete={complete}
                thinkStep={message.thinkStep ?? 0}
              />
            )}
            <p className="mt-2 border-t border-[#eef0f4] pt-2 text-[10px] text-[#8b93a7]">
              {PORTFOLIO_COPY.safety}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** 按内容撑高 textarea，封顶后内部滚动 */
function resizeComposer(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = 'auto';
  const next = Math.min(Math.max(el.scrollHeight, COMPOSER_MIN_HEIGHT), COMPOSER_MAX_HEIGHT);
  el.style.height = `${next}px`;
  el.style.overflowY = el.scrollHeight > COMPOSER_MAX_HEIGHT ? 'auto' : 'hidden';
}

export default function PortfolioAgentPanel({
  stage,
  messages,
  draftInput,
  busy = false,
  suggestions,
  kickoffReady = false,
  designMode = false,
  onDraftInputChange,
  onSend,
  onSuggestion,
  onAttachFile,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const working = busy || messages.some(
    (message) => message.role === 'status' && message.progress?.status === 'running',
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, stage, busy]);

  // draft 被外部清空（发送后）时收起高度
  useEffect(() => {
    resizeComposer(textareaRef.current);
  }, [draftInput]);

  const canSend = draftInput.trim().length > 0 || !!pendingFile;

  const handleSend = () => {
    if (working || !canSend) return;
    if (pendingFile && onAttachFile) {
      onAttachFile(pendingFile);
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
    if (draftInput.trim()) {
      onSend(draftInput);
    }
  };

  return (
    // 与主内容区同：灰底边距 + 白卡片
    <aside
      className="flex w-full min-w-0 shrink-0 flex-col bg-[#eef0f4] p-3 md:w-[356px] md:p-4 md:pl-2 lg:w-[376px]"
      aria-label="Procurement agent"
    >
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-white">
        <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-[#e8eaef] px-4">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#22a06b]" aria-hidden />
            <h2 className="text-sm font-semibold text-[#1a1d26]">{designMode ? PORTFOLIO_COPY.agentTitleDesign : PORTFOLIO_COPY.agentTitle}</h2>
          </div>
          <span className="text-[11px] text-[#8b93a7]">
            {working ? PORTFOLIO_COPY.agentWorking : PORTFOLIO_COPY.agentListening}
          </span>
        </header>

        <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
          {messages.map((message) => {
            if (message.role === 'status') {
              return <StatusCard key={message.id} message={message} />;
            }

            const isUser = message.role === 'user';
            const hasStructure = !isUser && (
              (message.bullets && message.bullets.length > 0)
              || (message.actions && message.actions.length > 0)
            );

            return (
              <div
                key={message.id}
                className={cn(
                  'flex motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-300',
                  isUser ? 'justify-end' : 'justify-start',
                )}
              >
                <div
                  className={cn(
                    'max-w-[92%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed',
                    isUser ? 'bg-[#2f6bff] text-white whitespace-pre-wrap' : 'bg-[#f1f3f7] text-[#1a1d26]',
                    hasStructure && 'w-full',
                  )}
                >
                  <p className={cn(!hasStructure && 'whitespace-pre-wrap')}>{message.text}</p>
                  {message.bullets && message.bullets.length > 0 ? (
                    <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[12.5px] leading-snug text-[#3d4455]">
                      {message.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                  {message.actions && message.actions.length > 0 ? (
                    <RecommendedActions
                      actions={message.actions}
                      disabled={working}
                      onAction={onSuggestion}
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <footer className="shrink-0 space-y-2 border-t border-[#e8eaef] px-3 py-3">
          {kickoffReady ? (
            <p className="flex items-center gap-1.5 px-0.5 text-[11px] font-medium text-[#2f6bff]">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#2f6bff] opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[#2f6bff]" />
              </span>
              Sample request ready - click Send to begin
            </p>
          ) : null}
          {/* 组合输入区：上文本、下附件+发送 */}
          <div
            className={cn(
              'rounded-2xl border border-[#e8eaef] bg-[#fafbfc] transition',
              'focus-within:border-[#2f6bff]/40 focus-within:bg-white',
              kickoffReady && 'border-[#2f6bff]/35 bg-white shadow-[0_0_0_3px_rgba(47,107,255,0.08)]',
              working && 'opacity-60',
            )}
          >
            <textarea
              ref={textareaRef}
              data-portfolio-agent-composer
              data-coach="composer"
              value={draftInput}
              rows={1}
              placeholder={designMode ? PORTFOLIO_COPY.inputPlaceholderDesign : PORTFOLIO_COPY.inputPlaceholder}
              aria-label={designMode ? PORTFOLIO_COPY.inputPlaceholderDesign : PORTFOLIO_COPY.inputPlaceholder}
              disabled={working}
              className="block w-full resize-none bg-transparent px-3.5 pt-2.5 pb-1 text-[13px] leading-relaxed text-[#1a1d26] outline-none placeholder:text-[#8b93a7] disabled:cursor-not-allowed"
              style={{ minHeight: COMPOSER_MIN_HEIGHT, maxHeight: COMPOSER_MAX_HEIGHT }}
              onChange={(event) => {
                onDraftInputChange(event.target.value);
                resizeComposer(event.target);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
            />

            {pendingFile ? (
              <div className="flex items-center gap-2 px-3 pb-1">
                <span className="inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-lg bg-[#eef4ff] px-2 py-1 text-[11px] font-medium text-[#2f6bff]">
                  <PaperclipIcon className="size-3 shrink-0" />
                  <span className="truncate">{pendingFile.name}</span>
                  <button
                    type="button"
                    className="ml-0.5 shrink-0 cursor-pointer text-[#8b93a7] hover:text-[#c23b3b]"
                    aria-label="Remove attachment"
                    onClick={() => {
                      setPendingFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    ×
                  </button>
                </span>
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-2 px-2 pb-2 pt-0.5">
              <div className="flex items-center gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv,application/pdf,image/*"
                  className="sr-only"
                  tabIndex={-1}
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    if (!file) return;
                    setPendingFile(file);
                  }}
                />
                <button
                  type="button"
                  disabled={working}
                  title={PORTFOLIO_COPY.attachFileHint}
                  aria-label={PORTFOLIO_COPY.attachFile}
                  className={cn(
                    'inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#5c6478] transition',
                    'hover:bg-[#eef4ff] hover:text-[#2f6bff]',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <PaperclipIcon className="size-4" />
                </button>
                <span className="hidden text-[10px] text-[#8b93a7] sm:inline">
                  {PORTFOLIO_COPY.composerHint}
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                className={cn(
                  'h-8 gap-1.5 rounded-xl bg-[#2f6bff] px-3 text-[12px] font-medium hover:bg-[#2458d9]',
                  kickoffReady && !working && 'motion-safe:animate-pulse',
                )}
                disabled={working || !canSend}
                onClick={handleSend}
              >
                <SendIcon className="size-3.5" />
                {PORTFOLIO_COPY.send}
              </Button>
            </div>
          </div>

          {suggestions.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((suggestion) => {
                const isKickoff = suggestion === PORTFOLIO_COPY.kickoffPlan;
                return (
                  <button
                    key={suggestion}
                    type="button"
                    disabled={working}
                    onClick={() => onSuggestion(suggestion)}
                    className={cn(
                      'cursor-pointer rounded-full px-3 py-1.5 text-[11px] font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
                      isKickoff
                        ? 'bg-[#2f6bff] px-3.5 py-1.5 text-[12px] text-white shadow-sm hover:bg-[#2458d9] motion-safe:animate-pulse'
                        : 'border border-[#e8eaef] bg-white text-[#3d4455] hover:border-[#2f6bff]/35 hover:bg-[#f3f7ff] hover:text-[#2f6bff]',
                    )}
                  >
                    {suggestion}
                  </button>
                );
              })}
            </div>
          ) : null}
        </footer>
      </div>
    </aside>
  );
}
