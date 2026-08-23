'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  BaseEdge,
  EdgeLabelRenderer,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  getSmoothStepPath,
  useReactFlow,
  type Edge,
  type EdgeProps,
  type EdgeTypes,
  type Node,
  type NodeProps,
  type NodeTypes,
  type Viewport,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import dagre from 'dagre'
import { ChevronDown, Copy, Eye, EyeOff, Sparkles } from 'lucide-react'
import type { Workflow, WorkflowNode, WorkflowNodeType } from '@/components/campaigns/workflow/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DYNAMIC_FIELDS } from '@/components/campaigns/workflow/dynamicFields'
import {
  attachAt,
  createEmptyWorkflow,
  findNode,
  findParent,
  getStart,
  makeNode,
  patchNodeData,
  removeNode,
  setBranch,
  validateWorkflow,
} from '@/components/campaigns/workflow/workflow.model'
import {
  NODE_META,
  PICKER_ROWS_BY_GROUP,
  isConditionNodeType,
} from '@/components/campaigns/workflow/nodeMeta'

type WorkflowSlot = 'child' | 'yesChild' | 'noChild'

type FigmaIconName =
  | 'linkedin'
  | 'eye'
  | 'user-round-plus'
  | 'user-round-check'
  | 'mail-minus'
  | 'message-circle-more'
  | 'circle-plus'
  | 'circle-x'
  | 'clock'
  | 'trash'
  | 'trash-active'

const FIGMA_ICON_SOURCE: Record<FigmaIconName, string> = {
  linkedin: '/demo/sequence-icons/linkedin.svg',
  eye: '/demo/sequence-icons/eye.svg',
  'user-round-plus': '/demo/sequence-icons/user-round-plus.svg',
  'user-round-check': '/demo/sequence-icons/user-round-check.svg',
  'mail-minus': '/demo/sequence-icons/mail-minus.svg',
  'message-circle-more': '/demo/sequence-icons/message-circle-more.svg',
  'circle-plus': '/demo/sequence-icons/circle-plus.svg',
  'circle-x': '/demo/sequence-icons/circle-x.svg',
  clock: '/demo/sequence-icons/clock.svg',
  trash: '/demo/sequence-icons/trash.svg',
  'trash-active': '/demo/sequence-icons/trash-active.svg',
}

const FIGMA_ICON_INSET: Record<FigmaIconName, string> = {
  linkedin: 'inset-[12.5%]',
  eye: 'inset-[20.84%_8.33%]',
  'user-round-plus': 'inset-[12.5%_8.33%_8.33%_8.33%]',
  'user-round-check': 'inset-[12.5%_8.33%]',
  'mail-minus': 'inset-[16.67%_8.33%]',
  'message-circle-more': 'inset-[8.33%]',
  'circle-plus': 'inset-[8.33%]',
  'circle-x': 'inset-[8.33%]',
  clock: 'inset-[8.33%]',
  trash: 'inset-[8.33%_12.5%]',
  'trash-active': 'inset-[8.33%_12.5%]',
}

const PICKER_ICON_NAMES = new Set<FigmaIconName>([
  'linkedin',
  'eye',
  'user-round-plus',
  'user-round-check',
  'message-circle-more',
])

const FIGMA_WORKFLOW_ICONS: Partial<Record<WorkflowNodeType, FigmaIconName>> = {
  connection_request: 'linkedin',
  send_message: 'message-circle-more',
  inmail: 'mail-minus',
  view_profile: 'eye',
  follow: 'user-round-plus',
  delay: 'clock',
  first_connection_condition: 'user-round-check',
  end: 'circle-x',
}

function FigmaIcon({
  name,
  className,
  variant = 'default',
}: {
  name: FigmaIconName
  className?: string
  variant?: 'default' | 'picker'
}) {
  const usePickerAsset = variant === 'picker' && PICKER_ICON_NAMES.has(name)
  const source = usePickerAsset ? `/demo/sequence-icons/picker/${name}.svg` : FIGMA_ICON_SOURCE[name]
  return (
    <span className={cn('relative block shrink-0 overflow-hidden', className)} aria-hidden>
      <span className={cn('absolute', FIGMA_ICON_INSET[name])}>
        <img src={source} alt="" className="block h-full w-full max-w-none" />
      </span>
      {name === 'mail-minus' ? (
        <span className="absolute inset-[60%_5%_10%_65%]">
          <img
            src={usePickerAsset ? '/demo/sequence-icons/picker/mail-minus-badge.svg' : '/demo/sequence-icons/mail-minus-badge.svg'}
            alt=""
            className="block h-full w-full max-w-none"
          />
        </span>
      ) : null}
    </span>
  )
}

function WorkflowTypeIcon({
  type,
  className,
  variant = 'default',
}: {
  type: WorkflowNodeType
  className?: string
  variant?: 'default' | 'picker'
}) {
  const figmaIcon = FIGMA_WORKFLOW_ICONS[type]
  if (figmaIcon) return <FigmaIcon name={figmaIcon} className={className} variant={variant} />
  const ProjectIcon = NODE_META[type].icon
  return <ProjectIcon className={className} strokeWidth={1.6} aria-hidden />
}

interface InsertTarget {
  parentId: string
  slot: WorkflowSlot
  anchor?: { x: number; y: number; left?: number; right?: number }
}

interface DelayTarget {
  nodeId: string
  value: number
  unit: 'days' | 'hours'
}

interface FocusNodePlacement {
  left: number
  top: number
  width: number
  height: number
}

type DemoNodeData = {
  kind: 'workflow' | 'delay' | 'end' | 'root-add' | 'terminal'
  node?: WorkflowNode
  parentId?: string
  slot?: WorkflowSlot
  selected?: boolean
  invalid?: boolean
  compositeCondition?: WorkflowNode
  onOpenPicker?: (target: InsertTarget) => void
  onEnd?: (target: InsertTarget) => void
  onDelete?: (id: string) => void
  onEditDelay?: (target: DelayTarget) => void
  editingDelay?: boolean
  lockedDelay?: boolean
  onSaveDelay?: (nodeId: string, value: number, unit: DelayTarget['unit']) => void
  onCancelDelay?: () => void
} & Record<string, unknown>

interface ExecutionOutcome {
  rate: string
  value: number
  label: string
}

interface ExecutionNodeStats {
  primary: {
    value: number
    label: string
  }
  outcomes: ExecutionOutcome[]
}

type ExecutionStage =
  | 'follow'
  | 'invite'
  | 'pending_profile'
  | 'pending_like'
  | 'message_1'
  | 'message_2'
  | 'message_3'
  | 'message_4'

function executionRate(value: number, total: number) {
  return `${total > 0 ? Math.round((value / total) * 100) : 0}%`
}

function applyLiveExecutionSnapshot(workflow: Workflow): Workflow {
  const next = structuredClone(workflow)
  let currentLeads = 148
  const findCurrentLeads = (node: WorkflowNode | null | undefined) => {
    if (!node) return
    if (node.data.executionStage === 'follow') {
      const stats = node.data.executionStats as ExecutionNodeStats | undefined
      currentLeads = stats?.primary.value ?? currentLeads
    }
    findCurrentLeads(node.child)
    findCurrentLeads(node.noChild)
    findCurrentLeads(node.yesChild)
  }
  findCurrentLeads(getStart(next).child)

  const leads = currentLeads + 2
  const followed = Math.round(leads * 0.892)
  const inviteSent = followed
  const accepted = Math.round(inviteSent * 0.417)
  const pending = inviteSent - accepted
  const viewed = pending
  const stillPendingAfterProfile = Math.round(pending * 0.883)
  const liked = Math.round(stillPendingAfterProfile * 0.623)
  const skipped = stillPendingAfterProfile - liked

  const messageSent = [accepted]
  const messageReplied: number[] = []
  const replyRates = [0.145, 0.128, 0.098, 0.081]
  replyRates.forEach((rate, index) => {
    const sent = messageSent[index] ?? 0
    const replied = Math.round(sent * rate)
    messageReplied.push(replied)
    if (index < replyRates.length - 1) messageSent.push(sent - replied)
  })

  const statsByStage: Record<ExecutionStage, ExecutionNodeStats> = {
    follow: {
      primary: { value: leads, label: 'Leads' },
      outcomes: [{ rate: executionRate(followed, leads), value: followed, label: 'Followed' }],
    },
    invite: {
      primary: { value: inviteSent, label: 'Sent' },
      outcomes: [
        { rate: executionRate(accepted, inviteSent), value: accepted, label: 'Accepted' },
        { rate: executionRate(pending, inviteSent), value: pending, label: 'Pending' },
      ],
    },
    pending_profile: {
      primary: { value: pending, label: 'Profiles' },
      outcomes: [{ rate: executionRate(viewed, pending), value: viewed, label: 'Viewed' }],
    },
    pending_like: {
      primary: { value: stillPendingAfterProfile, label: 'Profiles' },
      outcomes: [
        { rate: executionRate(liked, stillPendingAfterProfile), value: liked, label: 'Liked' },
        { rate: executionRate(skipped, stillPendingAfterProfile), value: skipped, label: 'Skipped' },
      ],
    },
    message_1: makeMessageExecutionStats(messageSent[0], messageReplied[0]),
    message_2: makeMessageExecutionStats(messageSent[1], messageReplied[1]),
    message_3: makeMessageExecutionStats(messageSent[2], messageReplied[2]),
    message_4: makeMessageExecutionStats(messageSent[3], messageReplied[3]),
  }

  const updateNode = (node: WorkflowNode | null | undefined) => {
    if (!node) return
    const stage = node.data.executionStage as ExecutionStage | undefined
    if (stage && statsByStage[stage]) node.data.executionStats = statsByStage[stage]
    updateNode(node.child)
    updateNode(node.noChild)
    updateNode(node.yesChild)
  }

  updateNode(getStart(next).child)
  return next
}

function makeMessageExecutionStats(sent: number, replied: number): ExecutionNodeStats {
  const noReply = sent - replied
  return {
    primary: { value: sent, label: 'Sent' },
    outcomes: [
      { rate: executionRate(replied, sent), value: replied, label: 'Replied' },
      { rate: executionRate(noReply, sent), value: noReply, label: 'No reply' },
    ],
  }
}

function getExecutionStats(node: WorkflowNode): ExecutionNodeStats | null {
  return (node.data.executionStats as ExecutionNodeStats | undefined) ?? null
}

function AnimatedExecutionNumber({
  value,
  active,
  delay,
  suffix,
}: {
  value: number
  active: boolean
  delay: number
  suffix?: string
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const displayValueRef = useRef(0)

  useEffect(() => {
    if (!active) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      displayValueRef.current = value
      setDisplayValue(value)
      return
    }

    const rootStyles = getComputedStyle(document.documentElement)
    const duration = Number.parseFloat(rootStyles.getPropertyValue('--cn-duration-results-count')) || 900
    const startsAt = performance.now() + delay
    const startsFrom = displayValueRef.current
    let animationFrame = 0

    const update = (now: number) => {
      if (now < startsAt) {
        animationFrame = requestAnimationFrame(update)
        return
      }

      const progress = Math.min(1, (now - startsAt) / duration)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const nextValue = Math.round(startsFrom + (value - startsFrom) * easedProgress)
      displayValueRef.current = nextValue
      setDisplayValue(nextValue)
      if (progress < 1) animationFrame = requestAnimationFrame(update)
    }

    animationFrame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animationFrame)
  }, [active, delay, value])

  return <span className="tabular-nums">{displayValue}{suffix}</span>
}

function WorkflowHandles({ node, branching = false }: { node: WorkflowNode; branching?: boolean }) {
  const condition = branching || isConditionNodeType(node.type)
  return (
    <>
      <Handle type="target" position={Position.Top} id="in" className="!border-0 !bg-transparent" />
      {condition ? (
        <>
          <Handle type="source" position={Position.Left} id="noChild" className="!border-0 !bg-transparent" />
          <Handle type="source" position={Position.Right} id="yesChild" className="!border-0 !bg-transparent" />
        </>
      ) : node.type !== 'end' ? (
        <Handle type="source" position={Position.Bottom} id="child" className="!border-0 !bg-transparent" />
      ) : null}
    </>
  )
}

const WorkflowActionNode = memo(function WorkflowActionNode({ data }: NodeProps<Node<DemoNodeData>>) {
  const node = data.node!
  const meta = NODE_META[node.type]
  const conditionNode = isConditionNodeType(node.type)
  const conditionTiming = conditionNode ? null : getConditionTiming(node)
  const executionStats = getExecutionStats(node)
  const executionActive = data.executionActive === true
  const executionDelay = Number(data.executionDelayMs ?? 0)

  if (executionStats) {
    return (
      <div className="relative flex min-h-[92px] w-[320px] items-center rounded-lg border border-border bg-background px-6 py-3 font-manrope">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary">
              <WorkflowTypeIcon
                type={node.type}
                className="h-6 w-6 text-primary-foreground [&_img]:brightness-0 [&_img]:invert"
              />
            </span>
            <p className="truncate text-base font-medium text-foreground">{meta.label}</p>
          </div>
          <div className="border-t border-border" />
          <div className="flex items-center justify-between gap-3 whitespace-nowrap text-xs font-medium text-foreground">
            <p>
              <span className="text-primary">
                <AnimatedExecutionNumber
                  value={executionStats.primary.value}
                  active={executionActive}
                  delay={executionDelay}
                />{' '}
              </span>
              <span>{executionStats.primary.label}</span>
            </p>
            {executionStats.outcomes.map((outcome, outcomeIndex) => (
              <p key={`${outcome.label}-${outcomeIndex}`} className="flex items-center gap-1.5">
                <AnimatedExecutionNumber
                  value={Number.parseInt(outcome.rate, 10)}
                  active={executionActive}
                  delay={executionDelay + 80 + outcomeIndex * 50}
                  suffix="%"
                />
                <span>
                  <AnimatedExecutionNumber
                    value={outcome.value}
                    active={executionActive}
                    delay={executionDelay + 80 + outcomeIndex * 50}
                  />{' '}
                  {outcome.label}
                </span>
              </p>
            ))}
          </div>
        </div>
        <WorkflowHandles node={node} branching={Boolean(data.compositeCondition)} />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group relative flex h-14 items-center rounded-lg border px-6 font-manrope transition-[opacity,background-color,border-color] duration-150',
        conditionNode
          ? 'w-[278px] border-primary bg-[color-mix(in_srgb,var(--cn-primary)_6%,transparent)] hover:bg-[color-mix(in_srgb,var(--cn-primary)_12%,transparent)]'
          : 'w-[320px] border-border bg-[var(--cn-surface)]',
        data.selected
          ? 'pointer-events-none opacity-0'
          : data.invalid && !conditionNode
            ? 'border-destructive'
            : undefined,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <WorkflowTypeIcon type={node.type} className="h-6 w-6 shrink-0" />
        <div className="min-w-0">
          <p className="truncate text-base font-medium text-foreground">{meta.label}</p>
          {conditionTiming ? (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <FigmaIcon name="clock" className="h-3.5 w-3.5 shrink-0" />
              <span>{conditionTiming}</span>
            </p>
          ) : null}
        </div>
      </div>
      <DeleteNodeButton node={node} onDelete={data.onDelete} condition={conditionNode} />
      <WorkflowHandles node={node} branching={Boolean(data.compositeCondition)} />
    </div>
  )
})

function FocusedWorkflowNode({ node }: { node: WorkflowNode }) {
  const meta = NODE_META[node.type]
  const conditionNode = isConditionNodeType(node.type)
  const conditionTiming = conditionNode ? null : getConditionTiming(node)
  return (
    <div
      className={cn(
        'flex h-full w-full items-center rounded-lg px-6 font-manrope shadow-[var(--cn-shadow-popover)]',
        conditionNode
          ? 'border border-primary bg-[color-mix(in_srgb,var(--cn-primary)_6%,transparent)]'
          : 'bg-[var(--cn-surface)]',
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <WorkflowTypeIcon type={node.type} className="h-6 w-6 shrink-0" />
        <div className="min-w-0">
          <p className="truncate text-base font-medium text-foreground">{meta.label}</p>
          {conditionTiming ? (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <FigmaIcon name="clock" className="h-3.5 w-3.5 shrink-0" />
              <span>{conditionTiming}</span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

const MESSAGE_NODE_TYPES = new Set<WorkflowNodeType>(['connection_request', 'send_message', 'inmail'])

const MESSAGE_LIMITS: Partial<Record<WorkflowNodeType, number>> = {
  connection_request: 300,
  send_message: 8000,
  inmail: 8000,
}

const DEMO_INVITE_MESSAGE =
  'Hi {FIRST_NAME}, I’m building an early-stage startup and your operations background stood out. I’d love to connect and explore whether we might be a good fit to build the company together.'

const DEMO_FOUNDER_MESSAGE = `Hi {FIRST_NAME}, thanks for connecting.

I’m the founder of an early-stage startup and I’m looking for an operations partner who can help turn an early product into a repeatable business — owning go-to-market operations, partnerships, and the systems behind growth.

Your experience as {POSITION} at {COMPANY} caught my attention. Would you be open to a 20-minute conversation next week to explore whether our goals and working styles align?`

const DEMO_REGENERATED_INVITE =
  'Hi {FIRST_NAME}, your operations experience at {COMPANY} caught my attention. I’m building an early-stage startup and looking for an operations partner. I’d love to connect and explore whether there could be a fit.'

const DEMO_REGENERATED_MESSAGE = `Hi {FIRST_NAME}, thanks for connecting.

I’m building an early-stage startup and looking for an operations partner to help shape go-to-market execution, partnerships, and the operating systems needed to scale.

Your work as {POSITION} at {COMPANY} stood out to me. Would you be open to a 20-minute conversation next week to see whether our ambitions and working styles align?`

const PRIMARY_DYNAMIC_FIELDS = DYNAMIC_FIELDS.filter((field) =>
  ['FIRST_NAME', 'LAST_NAME', 'POSITION', 'COMPANY', 'LOCATION'].includes(field.token),
)
const MORE_DYNAMIC_FIELDS = DYNAMIC_FIELDS.filter(
  (field) => !PRIMARY_DYNAMIC_FIELDS.some((primary) => primary.token === field.token),
)

function renderMessagePreview(value: string) {
  const samples: Record<string, string> = {
    FIRST_NAME: 'Sarah',
    LAST_NAME: 'Chen',
    FULL_NAME: 'Sarah Chen',
    POSITION: 'Product Designer',
    COMPANY: 'Acme',
    LOCATION: 'London',
    HEADLINE: 'Designing clear tools for complex workflows',
    INDUSTRY: 'Technology',
  }
  return DYNAMIC_FIELDS.reduce(
    (preview, field) => preview.replaceAll(field.literal, samples[field.token] ?? field.literal),
    value,
  )
}

function DemoMessageEditor({
  node,
  onSave,
  onCancel,
}: {
  node: WorkflowNode
  onSave: (patch: Partial<WorkflowNode['data']>) => void
  onCancel: () => void
}) {
  const [primaryDraft, setPrimaryDraft] = useState((node.data.message as string) ?? '')
  const [previewing, setPreviewing] = useState(false)
  const [generationState, setGenerationState] = useState<'idle' | 'thinking' | 'typing'>('idle')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const generationTimerRef = useRef<number | null>(null)
  const generationRunRef = useRef(0)
  const maxLength = MESSAGE_LIMITS[node.type] ?? 8000
  const draft = primaryDraft
  const setDraft = setPrimaryDraft
  const isGenerating = generationState !== 'idle'
  const title = node.type === 'connection_request'
    ? 'Input your LinkedIn invitation'
    : node.type === 'inmail'
      ? 'Input your LinkedIn InMail'
      : 'Input your LinkedIn message'

  const insertDynamicField = (literal: string) => {
    const textarea = textareaRef.current
    const start = textarea?.selectionStart ?? draft.length
    const end = textarea?.selectionEnd ?? draft.length
    const next = `${draft.slice(0, start)}${literal}${draft.slice(end)}`
    setDraft(next)
    requestAnimationFrame(() => {
      textarea?.focus()
      const caret = start + literal.length
      textarea?.setSelectionRange(caret, caret)
    })
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(draft)
  }

  useEffect(() => () => {
    generationRunRef.current += 1
    if (generationTimerRef.current !== null) window.clearTimeout(generationTimerRef.current)
  }, [])

  const handleRegenerate = () => {
    generationRunRef.current += 1
    const runId = generationRunRef.current
    if (generationTimerRef.current !== null) window.clearTimeout(generationTimerRef.current)

    const generatedMessage = node.type === 'connection_request'
      ? DEMO_REGENERATED_INVITE
      : DEMO_REGENERATED_MESSAGE
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setPreviewing(false)
    setGenerationState('thinking')

    generationTimerRef.current = window.setTimeout(() => {
      if (generationRunRef.current !== runId) return
      if (reduceMotion) {
        setDraft(generatedMessage)
        setGenerationState('idle')
        return
      }

      setDraft('')
      setGenerationState('typing')
      let cursor = 0
      const typeNextChunk = () => {
        if (generationRunRef.current !== runId) return
        cursor = Math.min(generatedMessage.length, cursor + 2)
        setDraft(generatedMessage.slice(0, cursor))
        if (cursor >= generatedMessage.length) {
          setGenerationState('idle')
          generationTimerRef.current = null
          return
        }
        generationTimerRef.current = window.setTimeout(typeNextChunk, 14)
      }
      typeNextChunk()
    }, 650)
  }

  const primaryRequired = node.type !== 'connection_request'
  const canSave = !primaryRequired || primaryDraft.trim().length > 0

  return (
    <div className="flex max-h-[calc(100vh-48px)] flex-col bg-background font-manrope">
      <header className="px-8 pt-8">
        <SheetTitle className="text-2xl font-semibold text-foreground">{title}</SheetTitle>
        <SheetDescription className="sr-only">
          Compose the message for this workflow step.
        </SheetDescription>
      </header>

      <div className="overflow-y-auto px-8 pb-6 pt-7">
        <div className="flex flex-wrap gap-2">
          {PRIMARY_DYNAMIC_FIELDS.map((field) => (
            <Button
              key={field.token}
              type="button"
              variant="outline"
              disabled={isGenerating}
              onClick={() => insertDynamicField(field.literal)}
              className="border-dashed border-primary/70 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary"
              title={field.description}
            >
              {field.label}
            </Button>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" disabled={isGenerating}>
                More
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="cn-demo-scope w-52 shadow-[var(--cn-shadow-popover)]">
              {MORE_DYNAMIC_FIELDS.map((field) => (
                <DropdownMenuItem key={field.token} onSelect={() => insertDynamicField(field.literal)}>
                  <div>
                    <p>{field.label}</p>
                    {field.description ? <p className="text-xs text-muted-foreground">{field.description}</p> : null}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="relative mt-6">
          <Input
            ref={textareaRef as React.Ref<HTMLInputElement>}
            multiline
            rows={8}
            value={previewing ? renderMessagePreview(draft) : draft}
            readOnly={previewing || isGenerating}
            onChange={(event) => setDraft((event.target as HTMLTextAreaElement).value)}
            placeholder="Write your message…"
            className="min-h-[220px] resize-none border border-[var(--cn-field-border)] bg-background px-5 py-4 pr-14 text-base leading-relaxed shadow-none hover:border-[var(--cn-field-border-hover)] focus-visible:border-primary focus-visible:ring-0 active:scale-100"
            aria-label="Message"
          />
          <div className="absolute right-3 top-3 flex flex-col gap-1">
            <Button
              type="button"
              variant={isGenerating ? 'soft' : 'ghost'}
              size="iconSm"
              onClick={handleRegenerate}
              disabled={isGenerating}
              title="Regenerate with AI"
              aria-label="Regenerate message with AI"
            >
              <Sparkles className={cn(isGenerating && 'animate-pulse')} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="iconSm"
              onClick={() => setPreviewing((current) => !current)}
              disabled={isGenerating}
              title={previewing ? 'Edit message' : 'Preview with sample candidate data'}
              aria-label={previewing ? 'Edit message' : 'Preview message'}
            >
              {previewing ? <EyeOff /> : <Eye />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="iconSm"
              onClick={() => void handleCopy()}
              disabled={isGenerating}
              title="Copy message"
              aria-label="Copy message"
            >
              <Copy />
            </Button>
          </div>
          <p className="pointer-events-none absolute bottom-3 right-4 text-xs tabular-nums text-muted-foreground">
            {Math.max(0, maxLength - draft.length)}
          </p>
          {isGenerating ? (
            <div
              className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-1.5 rounded-full bg-background/90 px-2 py-1 text-xs font-medium text-primary shadow-sm"
              role="status"
              aria-live="polite"
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              {generationState === 'thinking' ? 'AI is thinking…' : 'AI is generating…'}
            </div>
          ) : null}
        </div>
      </div>

      <footer className="flex items-center justify-end gap-3 border-t border-border/70 px-8 py-6">
        <Button type="button" variant="outline" size="lg" onClick={onCancel} className="min-w-28">
          Cancel
        </Button>
        <Button
          type="button"
          size="lg"
          disabled={isGenerating || !canSave || primaryDraft.length > maxLength}
          onClick={() => onSave({ message: primaryDraft })}
          className="min-w-32"
        >
          Save
        </Button>
      </footer>
    </div>
  )
}

function getConditionTiming(node: WorkflowNode): string | null {
  if (node.type === 'first_connection_condition') return 'Checked immediately'
  return null
}

function DeleteNodeButton({
  node,
  onDelete,
  condition = false,
}: {
  node: WorkflowNode
  onDelete?: (id: string) => void
  condition?: boolean
}) {
  return (
    <button
      type="button"
      className={cn(
        'nodrag nopan absolute flex items-center justify-center opacity-0 transition-[opacity,background-color] group-hover:opacity-100 focus-visible:opacity-100',
        condition
          ? 'right-5 h-6 w-6 rounded-none hover:bg-transparent'
          : 'right-4 h-8 w-8 rounded-md hover:bg-muted',
      )}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation()
        onDelete?.(node.id)
      }}
      aria-label={`Delete ${NODE_META[node.type].label}`}
    >
      {condition ? (
        <FigmaIcon name="trash" className="h-6 w-6" />
      ) : (
        <span className="relative h-5 w-5">
          <FigmaIcon name="trash" className="absolute inset-0 h-5 w-5 group-hover:opacity-0" />
          <FigmaIcon name="trash-active" className="absolute inset-0 h-5 w-5 opacity-0 group-hover:opacity-100" />
        </span>
      )}
    </button>
  )
}

const WorkflowDelayNode = memo(function WorkflowDelayNode({ data }: NodeProps<Node<DemoNodeData>>) {
  const node = data.node!
  const minutes = node.data.delayMinutes ?? 24 * 60
  const unit: DelayTarget['unit'] = node.data.delayUnit === 'hours' ? 'hours' : 'days'
  const value = node.data.delayValue
    ?? (unit === 'days' ? Math.max(0, Math.round(minutes / (24 * 60))) : Math.max(0, Math.round(minutes / 60)))
  const unitLabel = value === 1 ? unit.slice(0, -1) : unit
  const delayLabel = value === 0 ? 'No delay' : `${value} ${unitLabel}`
  const [draft, setDraft] = useState(String(value))
  const [draftUnit, setDraftUnit] = useState<DelayTarget['unit']>(unit)
  const parsedValue = Number(draft)
  const maxValue = draftUnit === 'days' ? 30 : 30 * 24
  const numericDraft = draft.trim() !== '' && Number.isFinite(parsedValue)
  const belowMinimum = numericDraft && parsedValue < 0
  const exceedsMaximum = numericDraft && parsedValue > maxValue
  const wholeNumberRequired = numericDraft && !Number.isInteger(parsedValue)
  const valid = numericDraft && !belowMinimum && !exceedsMaximum && !wholeNumberRequired
  const validationMessage = belowMinimum
    ? 'Delay cannot be less than 0.'
    : exceedsMaximum
      ? `Maximum delay is ${maxValue} ${draftUnit}.`
      : wholeNumberRequired
        ? 'Enter a whole number.'
        : null

  useEffect(() => {
    if (!data.editingDelay) return
    setDraft(String(value))
    setDraftUnit(unit)
  }, [data.editingDelay, unit, value])

  return (
    <div
      className={cn(
        'relative flex items-center justify-center font-manrope transition-[width,height] duration-250 ease-out',
        data.editingDelay ? 'h-[212px] w-[307px]' : 'h-12 w-[243px]',
      )}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`Edit delay: ${delayLabel}`}
        className={cn(
          'nodrag nopan group absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden border font-manrope',
          'transition-[width,height,border-radius,background-color,border-color,box-shadow] duration-250 ease-out',
          data.editingDelay
            ? 'h-[212px] w-[307px] rounded-lg border-border bg-[var(--cn-surface)] shadow-lg'
            : 'h-12 w-[123px] rounded-full border-primary bg-[color-mix(in_srgb,var(--cn-primary)_8%,transparent)] hover:bg-[color-mix(in_srgb,var(--cn-primary)_13%,transparent)]',
          data.invalid && !data.editingDelay && 'border-destructive',
        )}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation()
          if (!data.editingDelay) data.onEditDelay?.({ nodeId: node.id, value, unit })
        }}
        onKeyDown={(event) => {
          if (!data.editingDelay && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault()
            data.onEditDelay?.({ nodeId: node.id, value, unit })
          }
        }}
      >
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center gap-2 whitespace-nowrap px-6 text-base font-medium text-primary transition-opacity duration-150',
            data.editingDelay ? 'invisible pointer-events-none opacity-0' : 'visible opacity-100 delay-100',
          )}
        >
          <FigmaIcon name="clock" className="h-6 w-6" />
          {delayLabel}
          {!data.lockedDelay ? <DeleteNodeButton node={node} onDelete={data.onDelete} /> : null}
        </div>

        <div
          className={cn(
            'absolute inset-0 flex flex-col px-6 pb-4 pt-6 text-foreground transition-opacity duration-150',
            data.editingDelay ? 'visible opacity-100 delay-100' : 'invisible pointer-events-none opacity-0',
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <p className="text-base font-medium leading-[22px]">Delay before the next action:</p>
          <div className="mt-3">
            <div>
              <div
                className={cn(
                  'flex h-[55px] items-center gap-3 rounded-lg border bg-[var(--cn-surface)] py-1 pl-3 pr-1 transition-colors',
                  validationMessage ? 'border-destructive' : 'border-border',
                )}
              >
                <Input
                  autoFocus={Boolean(data.editingDelay)}
                  type="number"
                  min={0}
                  max={maxValue}
                  step={1}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  aria-label="Delay duration"
                  aria-invalid={Boolean(validationMessage)}
                  aria-describedby={validationMessage ? `delay-error-${node.id}` : undefined}
                  className="h-full flex-1 rounded-none border-0 bg-transparent px-0 text-base shadow-none focus-visible:border-transparent focus-visible:ring-0 active:scale-100"
                />
                <div className="flex h-[47px] w-[160px] shrink-0 overflow-hidden rounded-md border border-border">
                  {(['days', 'hours'] as const).map((option) => {
                    const active = draftUnit === option
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          setDraftUnit(option)
                        }}
                        className={cn(
                          'h-full flex-1 text-sm font-medium transition-colors',
                          option === 'hours' && 'border-l border-border',
                          active
                            ? 'bg-primary/5 text-primary'
                            : 'bg-[var(--cn-surface)] text-foreground hover:bg-[var(--cn-surface-subtle)]',
                        )}
                        aria-pressed={active}
                      >
                        {option === 'days' ? 'Days' : 'Hours'}
                      </button>
                    )
                  })}
                </div>
              </div>
              <p
                id={`delay-error-${node.id}`}
                className={cn(
                  'mt-1.5 h-4 text-xs font-medium leading-4 text-destructive',
                  !validationMessage && 'invisible',
                )}
                aria-live="polite"
              >
                {validationMessage ?? 'Valid delay'}
              </p>
            </div>
          </div>
          <div className="mt-auto flex items-center justify-end gap-6">
              <Button
                type="button"
                variant="ghost"
                onClick={(event) => {
                  event.stopPropagation()
                  data.onCancelDelay?.()
                }}
                className="h-[42px] rounded-lg px-0 text-base hover:bg-transparent hover:text-primary active:scale-100"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!valid}
                onClick={(event) => {
                  event.stopPropagation()
                  data.onSaveDelay?.(node.id, parsedValue, draftUnit)
                }}
                className="h-[42px] w-[158px] rounded-lg px-6 text-base active:scale-100"
              >
                Apply
              </Button>
          </div>
        </div>
      </div>
      <WorkflowHandles node={node} />
    </div>
  )
})

const WorkflowEndNode = memo(function WorkflowEndNode({ data }: NodeProps<Node<DemoNodeData>>) {
  const node = data.node!
  return (
    <div className="group relative flex h-[52px] w-[260px] items-center rounded-lg border border-[var(--cn-gray-300)] bg-[var(--cn-gray-100)] py-0 pl-6 pr-12 font-manrope">
      <div className="flex items-center gap-3">
        <FigmaIcon name="circle-x" className="h-6 w-6" />
        <span className="whitespace-nowrap text-base font-medium text-foreground">End of sequence</span>
      </div>
      <DeleteNodeButton node={node} onDelete={data.onDelete} />
      <WorkflowHandles node={node} />
    </div>
  )
})

const RootAddNode = memo(function RootAddNode({ data }: NodeProps<Node<DemoNodeData>>) {
  return (
    <button
      type="button"
      className="nodrag nopan flex h-11 w-[122px] items-center justify-center gap-3 rounded-lg border border-border bg-[var(--cn-surface)] px-8 font-manrope text-sm font-medium text-primary transition-colors hover:bg-[var(--cn-surface-subtle)]"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        data.onOpenPicker?.({
          parentId: data.parentId!,
          slot: 'child',
          anchor: {
            x: rect.right,
            y: rect.top + rect.height / 2,
            left: rect.left,
            right: rect.right,
          },
        })
      }}
    >
      <FigmaIcon name="circle-plus" className="h-5 w-5" />
      Add
    </button>
  )
})

const TerminalNode = memo(function TerminalNode({ data }: NodeProps<Node<DemoNodeData>>) {
  const target = { parentId: data.parentId!, slot: data.slot! }
  return (
    <div className="flex h-11 w-[243px] overflow-hidden rounded-lg border border-border bg-[var(--cn-surface)] font-manrope">
      <button
        type="button"
        className="nodrag nopan flex flex-1 items-center justify-center gap-3 border-r border-border text-sm font-medium text-primary transition-colors hover:bg-[var(--cn-surface-subtle)]"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          data.onOpenPicker?.({
            ...target,
            anchor: {
              x: rect.right,
              y: rect.top + rect.height / 2,
              left: rect.left,
              right: rect.right,
            },
          })
        }}
      >
        <FigmaIcon name="circle-plus" className="h-5 w-5" />
        Add
      </button>
      <button
        type="button"
        className="nodrag nopan flex flex-1 items-center justify-center gap-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => data.onEnd?.(target)}
      >
        <FigmaIcon name="circle-x" className="h-5 w-5" />
        End
      </button>
      <Handle type="target" position={Position.Top} id="in" className="!border-0 !bg-transparent" />
    </div>
  )
})

type DemoEdgeData = {
  tone?: 'success' | 'danger'
  directBranch?: boolean
  labelOffsetY?: number
  labelSourceOffsetY?: number
  insertTarget?: InsertTarget
  onOpenPicker?: (target: InsertTarget) => void
  executionActive?: boolean
  executionDelayMs?: number
}

function DemoEdge(props: EdgeProps) {
  const data = props.data as DemoEdgeData | undefined
  const [insertHovered, setInsertHovered] = useState(false)
  const isStraightVertical = !data?.directBranch
    && Math.abs(props.sourceX - props.targetX) < 1
    && props.targetY > props.sourceY
  const [path, labelX, labelY] = data?.directBranch
    ? getDirectBranchPath(props.sourceX, props.sourceY, props.targetX, props.targetY)
    : isStraightVertical
      ? [
          `M ${props.sourceX},${props.sourceY} V ${props.targetY}`,
          props.sourceX,
          (props.sourceY + props.targetY) / 2,
        ]
      : getSmoothStepPath({
          sourceX: props.sourceX,
          sourceY: props.sourceY,
          sourcePosition: props.sourcePosition,
          targetX: props.targetX,
          targetY: props.targetY,
          targetPosition: props.targetPosition,
          borderRadius: 10,
        })
  const renderedLabelY = data?.labelSourceOffsetY !== undefined
    ? props.sourceY + data.labelSourceOffsetY
    : labelY + (data?.labelOffsetY ?? 0)
  const labelBottomY = renderedLabelY + 11
  const renderedInsertY = props.label
    ? props.targetY > labelBottomY
      ? (labelBottomY + props.targetY) / 2
      : renderedLabelY + 28
    : renderedLabelY
  return (
    <>
      <BaseEdge
        id={props.id}
        path={path}
        interactionWidth={0}
        className={cn(data?.executionActive && 'cn-execution-edge')}
        style={{
          stroke: 'var(--cn-foreground-60)',
          strokeWidth: 1,
          strokeDasharray: '4 4',
          transition: 'd 250ms ease-out',
          animationDelay: data?.executionActive ? `${data.executionDelayMs ?? 0}ms` : undefined,
        }}
      />
      {data?.insertTarget ? (
        <path
          data-insert-edge
          d={path}
          fill="none"
          stroke="transparent"
          strokeWidth={18}
          className="nodrag nopan cursor-pointer"
          style={{ pointerEvents: 'stroke' }}
          onPointerDown={(event) => event.stopPropagation()}
          onPointerEnter={() => setInsertHovered(true)}
          onPointerLeave={() => setInsertHovered(false)}
          onClick={(event) => {
            event.stopPropagation()
            data.onOpenPicker?.({
              ...data.insertTarget!,
              anchor: { x: event.clientX, y: event.clientY },
            })
          }}
        />
      ) : null}
      {props.label || data?.insertTarget ? (
        <EdgeLabelRenderer>
          {props.label ? (
            <div
              className="pointer-events-none absolute"
              style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${renderedLabelY}px)` }}
            >
              <span
                className={cn(
                  'pointer-events-none bg-[var(--cn-surface-subtle)] px-1 font-manrope text-base font-medium',
                  data?.tone === 'success' ? 'text-[var(--cn-success)]' : data?.tone === 'danger' ? 'text-destructive' : 'text-foreground',
                )}
              >
                {String(props.label)}
              </span>
            </div>
          ) : null}
          {data?.insertTarget ? (
            <div
              className="pointer-events-none absolute"
              style={{
                transform: `translate(-50%, -50%) translate(${labelX}px, ${renderedInsertY}px)`,
              }}
            >
              <button
                type="button"
                className={cn(
                  'nodrag nopan pointer-events-auto relative z-10 flex h-6 w-6 items-center justify-center rounded-full border border-primary bg-[color-mix(in_srgb,var(--cn-primary)_8%,transparent)] p-1 transition-[opacity,transform,background-color] duration-150 hover:bg-[color-mix(in_srgb,var(--cn-primary)_13%,transparent)] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                  insertHovered ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
                )}
                onPointerDown={(event) => event.stopPropagation()}
                onPointerEnter={() => setInsertHovered(true)}
                onPointerLeave={() => setInsertHovered(false)}
                onFocus={() => setInsertHovered(true)}
                onBlur={() => setInsertHovered(false)}
                onClick={(event) => {
                  event.stopPropagation()
                  const rect = event.currentTarget.getBoundingClientRect()
                  data.onOpenPicker?.({
                    ...data.insertTarget!,
                    anchor: {
                      x: rect.right,
                      y: rect.top + rect.height / 2,
                      left: rect.left,
                      right: rect.right,
                    },
                  })
                }}
                aria-label="Insert step here"
              >
                <img src="/demo/sequence-icons/plus.svg" alt="" className="h-[14px] w-[14px] max-w-none" />
              </button>
            </div>
          ) : null}
        </EdgeLabelRenderer>
      ) : null}
    </>
  )
}

function getDirectBranchPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
): [string, number, number] {
  const direction = targetX >= sourceX ? 1 : -1
  const radius = Math.min(10, Math.abs(targetX - sourceX), Math.abs(targetY - sourceY))
  const cornerStartX = targetX - direction * radius
  const cornerEndY = sourceY + radius
  const path = [
    `M ${sourceX},${sourceY}`,
    `H ${cornerStartX}`,
    `Q ${targetX},${sourceY} ${targetX},${cornerEndY}`,
    `V ${targetY}`,
  ].join(' ')
  return [path, targetX, sourceY + (targetY - sourceY) * 0.45]
}

const NODE_TYPES: NodeTypes = {
  workflow: WorkflowActionNode as any,
  delay: WorkflowDelayNode as any,
  end: WorkflowEndNode as any,
  rootAdd: RootAddNode as any,
  terminal: TerminalNode as any,
}
const EDGE_TYPES: EdgeTypes = { demoEdge: DemoEdge }
const CONDITION_BRANCH_LABEL_SOURCE_OFFSET_Y = 50
const MESSAGE_CONDITION_BRANCH_LABEL_SOURCE_OFFSET_Y = 81
const TERMINAL_NODE_WIDTH = 243
const CONDITION_BRANCH_COLUMN_GAP = 32
const CONDITION_BRANCH_CENTER_OFFSET_X = TERMINAL_NODE_WIDTH + CONDITION_BRANCH_COLUMN_GAP
const CONDITION_NO_BRANCH_DELAY_OFFSET_Y = -30
const CONDITION_YES_BRANCH_DELAY_OFFSET_Y = 30
const CONDITION_BRANCH_DOWNSTREAM_OFFSET_Y = 24
const CONDITION_UNDELAYED_BRANCH_OFFSET_Y = 36
const INHERITED_PENDING_LABEL_SPACING_Y = 54
const WORKFLOW_ANCHOR_CENTER_X = 500

const FLOW_MIN_ZOOM = 0.35
const FLOW_MAX_ZOOM = 1.4

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function branchLabels(type: WorkflowNodeType, slot: 'yesChild' | 'noChild') {
  if (type === 'connection_request_condition') {
    return slot === 'yesChild'
      ? { label: 'Accepted', tone: 'success' as const }
      : { label: 'Not accepted', tone: 'danger' as const }
  }
  if (type === 'message_condition') {
    return slot === 'yesChild'
      ? { label: 'Replied', tone: 'success' as const }
      : { label: 'No reply', tone: 'danger' as const }
  }
  return slot === 'yesChild'
    ? { label: 'Connected', tone: 'success' as const }
    : { label: 'Not connected', tone: 'danger' as const }
}

function buildCanvas(
  workflow: Workflow,
  selectedId: string | null,
  invalidIds: Set<string>,
  onOpenPicker: (target: InsertTarget) => void,
  onEnd: (target: InsertTarget) => void,
  onDelete: (id: string) => void,
  onEditDelay: (target: DelayTarget) => void,
  editingDelayId: string | null,
  onSaveDelay: (nodeId: string, value: number, unit: DelayTarget['unit']) => void,
  onCancelDelay: () => void,
  readOnly = false,
  resultsActive = false,
): { nodes: Node<DemoNodeData>[]; edges: Edge[] } {
  const nodes: Node<DemoNodeData>[] = []
  const edges: Edge[] = []
  const outgoingLabels = new Map<string, { label: string; tone: 'success' | 'danger'; labelOffsetY?: number }>()
  const inviteNoBranchDelayIds = new Set<string>()
  const inviteYesBranchDelayIds = new Set<string>()
  const conditionNoBranchDelayIds = new Set<string>()
  const conditionYesBranchDelayIds = new Set<string>()
  const conditionUndelayedBranchRootIds = new Set<string>()
  const inheritedPendingSpacingRootIds = new Set<string>()
  const start = getStart(workflow)

  if (!start.child) {
    nodes.push({ id: 'root-add', type: 'rootAdd', position: { x: 0, y: 0 }, data: { kind: 'root-add', parentId: start.id, onOpenPicker } })
  }

  function emitNode(node: WorkflowNode) {
    const compositeCondition = node.type === 'connection_request'
      && node.child?.type === 'connection_request_condition'
      ? node.child
      : null
    const type = node.type === 'delay' ? 'delay' : node.type === 'end' ? 'end' : 'workflow'
    nodes.push({
      id: node.id,
      type,
      position: { x: 0, y: 0 },
      zIndex: editingDelayId === node.id ? 20 : 0,
      style: { transition: 'transform 250ms ease-out' },
      data: {
        kind: type,
        node,
        compositeCondition: compositeCondition ?? undefined,
        selected: selectedId === node.id,
        invalid: invalidIds.has(node.id) || Boolean(compositeCondition && invalidIds.has(compositeCondition.id)),
        onDelete: readOnly ? undefined : onDelete,
        onEditDelay: readOnly ? undefined : onEditDelay,
        editingDelay: editingDelayId === node.id,
        lockedDelay:
          node.data.autoDelay === true
          || inviteNoBranchDelayIds.has(node.id)
          || inviteYesBranchDelayIds.has(node.id),
        onSaveDelay: readOnly ? undefined : onSaveDelay,
        onCancelDelay: readOnly ? undefined : onCancelDelay,
        executionActive: readOnly && resultsActive,
        executionDelayMs: Number(node.data.executionOrder ?? 0) * 110,
      },
    })
    if (compositeCondition) {
      // Figma presents Send invite + acceptance check as one composite step.
      // Keep the condition in the workflow tree, but render its branches directly from the invite card.
      emitCompositeInvitePath(node, compositeCondition, 'noChild', compositeCondition.noChild ?? null)
      emitCompositeInvitePath(node, compositeCondition, 'yesChild', compositeCondition.yesChild ?? null)
    } else if (isConditionNodeType(node.type)) {
      emitPath(node, 'noChild', node.noChild ?? null)
      emitPath(node, 'yesChild', node.yesChild ?? null)
    } else if (node.type !== 'end') {
      emitPath(node, 'child', node.child ?? null)
    }
  }

  function emitCompositeInvitePath(
    invite: WorkflowNode,
    condition: WorkflowNode,
    slot: 'yesChild' | 'noChild',
    child: WorkflowNode | null,
  ) {
    const branch = branchLabels(condition.type, slot)
    if (child) {
      if (child.type === 'delay') {
        if (slot === 'noChild') inviteNoBranchDelayIds.add(child.id)
        else inviteYesBranchDelayIds.add(child.id)
      }
      if (slot === 'noChild') outgoingLabels.set(child.id, { ...branch, labelOffsetY: -21 })
      edges.push({
        id: `edge-${condition.id}-${slot}-${child.id}`,
        source: invite.id,
        sourceHandle: slot,
        target: child.id,
        type: 'demoEdge',
        label: slot === 'yesChild' ? branch.label : undefined,
        data: {
          tone: slot === 'yesChild' ? branch.tone : undefined,
          directBranch: true,
          labelOffsetY: slot === 'yesChild' ? 29 : undefined,
        },
      })
      emitNode(child)
      return
    }

    const terminalId = `terminal-${condition.id}-${slot}`
    nodes.push({
      id: terminalId,
      type: 'terminal',
      position: { x: 0, y: 0 },
      data: { kind: 'terminal', parentId: condition.id, slot, onOpenPicker, onEnd },
    })
    edges.push({
      id: `edge-${condition.id}-${slot}-${terminalId}`,
      source: invite.id,
      sourceHandle: slot,
      target: terminalId,
      type: 'demoEdge',
      label: branch.label,
      data: { tone: branch.tone, directBranch: true },
    })
  }

  function emitPath(parent: WorkflowNode, slot: WorkflowSlot, child: WorkflowNode | null) {
    const branch: { label: string; tone: 'success' | 'danger'; labelOffsetY?: number } | null = slot === 'yesChild' || slot === 'noChild'
      ? branchLabels(parent.type, slot)
      : outgoingLabels.get(parent.id) ?? null
    const directConditionBranch = isConditionNodeType(parent.type)
    const inheritedInvitePending = branch?.label === 'Not accepted' || branch?.label === 'Still not accepted'
    const renderBranchLabel = !inheritedInvitePending || parent.type === 'delay'
    if (child) {
      const conditionDelay = isConditionNodeType(parent.type)
        && child.type === 'delay'
        && child.data.conditionDelay === true
      if (directConditionBranch && child.type === 'delay') {
        if (slot === 'noChild') conditionNoBranchDelayIds.add(child.id)
        if (slot === 'yesChild') conditionYesBranchDelayIds.add(child.id)
      }
      if (directConditionBranch && child.type !== 'delay') {
        conditionUndelayedBranchRootIds.add(child.id)
      }
      if (conditionDelay && branch) outgoingLabels.set(child.id, branch)
      if (inheritedInvitePending && branch) {
        outgoingLabels.set(
          child.id,
          branch.label === 'Not accepted'
            ? { ...branch, label: 'Still not accepted' }
            : branch,
        )
      }
      if (inheritedInvitePending && parent.type === 'delay' && !inviteNoBranchDelayIds.has(parent.id)) {
        inheritedPendingSpacingRootIds.add(child.id)
      }
      edges.push({
        id: `edge-${parent.id}-${slot}-${child.id}`,
        source: parent.id,
        sourceHandle: slot,
        target: child.id,
        type: 'demoEdge',
        label: conditionDelay || !renderBranchLabel ? undefined : branch?.label,
        data: {
          tone: conditionDelay || !renderBranchLabel ? undefined : branch?.tone,
          directBranch: directConditionBranch,
          labelOffsetY: conditionDelay || !renderBranchLabel
            ? undefined
            : branch?.label === 'No reply'
              ? -21
              : branch?.labelOffsetY,
          labelSourceOffsetY:
            !conditionDelay && renderBranchLabel && branch
                ? directConditionBranch
                  ? parent.type === 'message_condition'
                    ? MESSAGE_CONDITION_BRANCH_LABEL_SOURCE_OFFSET_Y
                    : CONDITION_BRANCH_LABEL_SOURCE_OFFSET_Y
                : inviteNoBranchDelayIds.has(parent.id)
                  ? 33
                  : inheritedInvitePending && parent.type === 'delay'
                    ? 33
                  : undefined
              : undefined,
          insertTarget: readOnly ? undefined : { parentId: parent.id, slot },
          onOpenPicker: readOnly ? undefined : onOpenPicker,
        },
      })
      emitNode(child)
      return
    }
    const terminalId = `terminal-${parent.id}-${slot}`
    if (directConditionBranch) conditionUndelayedBranchRootIds.add(terminalId)
    if (inheritedInvitePending && parent.type === 'delay' && !inviteNoBranchDelayIds.has(parent.id)) {
      inheritedPendingSpacingRootIds.add(terminalId)
    }
    nodes.push({
      id: terminalId,
      type: 'terminal',
      position: { x: 0, y: 0 },
      data: { kind: 'terminal', parentId: parent.id, slot, onOpenPicker, onEnd },
    })
    edges.push({
      id: `edge-${parent.id}-${slot}-${terminalId}`,
      source: parent.id,
      sourceHandle: slot,
      target: terminalId,
      type: 'demoEdge',
      label: renderBranchLabel ? branch?.label : undefined,
      data: {
        tone: renderBranchLabel ? branch?.tone : undefined,
        labelOffsetY: renderBranchLabel
          ? branch?.label === 'No reply'
            ? -21
            : branch?.labelOffsetY
          : undefined,
        labelSourceOffsetY: renderBranchLabel && directConditionBranch && branch
          ? parent.type === 'message_condition'
            ? MESSAGE_CONDITION_BRANCH_LABEL_SOURCE_OFFSET_Y
            : CONDITION_BRANCH_LABEL_SOURCE_OFFSET_Y
          : renderBranchLabel && inheritedInvitePending && parent.type === 'delay'
            ? 33
            : undefined,
        directBranch: directConditionBranch,
      },
    })
  }

  if (start.child) emitNode(start.child)

  if (readOnly) {
    edges.forEach((edge, index) => {
      edge.data = {
        ...edge.data,
        executionActive: resultsActive,
        executionDelayMs: index * 70,
      }
    })
  }

  // Keep each branch label + Delay group anchored to Send invite. Only move
  // the content after that Delay down, so the group's internal rhythm stays intact.
  const inviteBranchDownstreamIds = new Set<string>()
  const conditionBranchDelayDownstreamIds = new Set<string>()
  const outgoingByNode = new Map<string, string[]>()
  edges.forEach((edge) => {
    const targets = outgoingByNode.get(edge.source) ?? []
    targets.push(edge.target)
    outgoingByNode.set(edge.source, targets)
  })
  const downstreamQueue = [...inviteNoBranchDelayIds, ...inviteYesBranchDelayIds]
  for (let index = 0; index < downstreamQueue.length; index += 1) {
    const currentId = downstreamQueue[index]
    ;(outgoingByNode.get(currentId) ?? []).forEach((targetId) => {
      if (inviteBranchDownstreamIds.has(targetId)) return
      inviteBranchDownstreamIds.add(targetId)
      downstreamQueue.push(targetId)
    })
  }

  const conditionDelayQueue = [...conditionNoBranchDelayIds, ...conditionYesBranchDelayIds]
  for (let index = 0; index < conditionDelayQueue.length; index += 1) {
    const currentId = conditionDelayQueue[index]
    ;(outgoingByNode.get(currentId) ?? []).forEach((targetId) => {
      if (conditionBranchDelayDownstreamIds.has(targetId)) return
      conditionBranchDelayDownstreamIds.add(targetId)
      conditionDelayQueue.push(targetId)
    })
  }

  const conditionUndelayedBranchIds = new Set<string>()
  const conditionUndelayedQueue = [...conditionUndelayedBranchRootIds]
  for (let index = 0; index < conditionUndelayedQueue.length; index += 1) {
    const currentId = conditionUndelayedQueue[index]
    if (conditionUndelayedBranchIds.has(currentId)) continue
    conditionUndelayedBranchIds.add(currentId)
    ;(outgoingByNode.get(currentId) ?? []).forEach((targetId) => {
      if (!conditionUndelayedBranchIds.has(targetId)) conditionUndelayedQueue.push(targetId)
    })
  }

  const inheritedPendingSpacingDepth = new Map<string, number>()
  inheritedPendingSpacingRootIds.forEach((rootId) => {
    const queue = [rootId]
    const visited = new Set<string>()
    for (let index = 0; index < queue.length; index += 1) {
      const currentId = queue[index]
      if (visited.has(currentId)) continue
      visited.add(currentId)
      inheritedPendingSpacingDepth.set(
        currentId,
        (inheritedPendingSpacingDepth.get(currentId) ?? 0) + 1,
      )
      ;(outgoingByNode.get(currentId) ?? []).forEach((targetId) => queue.push(targetId))
    }
  })

  const graph = new dagre.graphlib.Graph()
  graph.setDefaultEdgeLabel(() => ({}))
  graph.setGraph({ rankdir: 'TB', nodesep: 116, ranksep: 60, marginx: 40, marginy: 40 })
  for (const node of nodes) {
    const size = node.type === 'workflow'
          ? {
          width: node.data.node && isConditionNodeType(node.data.node.type) ? 278 : 320,
          height: node.data.node && getExecutionStats(node.data.node) ? 92 : 56,
        }
      : node.type === 'delay'
        ? editingDelayId === node.id
          ? { width: 307, height: 212 }
          : { width: 243, height: 48 }
        : node.type === 'end'
          ? { width: 260, height: 52 }
          : node.type === 'terminal'
            ? { width: TERMINAL_NODE_WIDTH, height: 44 }
            : { width: 122, height: 44 }
    graph.setNode(node.id, size)
  }
  edges.forEach((edge) => graph.setEdge(edge.source, edge.target))
  dagre.layout(graph)

  const layoutAnchorPoint = nodes[0] ? graph.node(nodes[0].id) : null
  const layoutOffsetX = layoutAnchorPoint
    ? WORKFLOW_ANCHOR_CENTER_X - layoutAnchorPoint.x
    : 0

  const conditionBranchTargetCenterX = new Map<string, number>()
  edges.forEach((edge) => {
    const sourceNode = nodes.find((node) => node.id === edge.source)?.data.node
    if (!sourceNode || !isConditionNodeType(sourceNode.type)) return
    if (edge.sourceHandle !== 'noChild' && edge.sourceHandle !== 'yesChild') return
    const sourcePoint = graph.node(edge.source)
    if (!sourcePoint) return
    const direction = edge.sourceHandle === 'noChild' ? -1 : 1
    conditionBranchTargetCenterX.set(
      edge.target,
      sourcePoint.x + direction * CONDITION_BRANCH_CENTER_OFFSET_X,
    )
  })

  const stableNodeCenterX = new Map(conditionBranchTargetCenterX)
  edges.forEach((edge) => {
    const edgeData = edge.data as DemoEdgeData | undefined
    if (edge.sourceHandle !== 'child' || edgeData?.directBranch) return
    const sourceCenterX = stableNodeCenterX.get(edge.source) ?? graph.node(edge.source)?.x
    if (sourceCenterX === undefined) return
    stableNodeCenterX.set(edge.target, sourceCenterX)
  })

  nodes.forEach((node) => {
    const point = graph.node(node.id)
    const size = graph.node(node.id)
    const branchOffsetY = inviteNoBranchDelayIds.has(node.id)
      ? -30
      : inviteYesBranchDelayIds.has(node.id)
        ? 30
        : conditionNoBranchDelayIds.has(node.id)
          ? CONDITION_NO_BRANCH_DELAY_OFFSET_Y
          : conditionYesBranchDelayIds.has(node.id)
            ? CONDITION_YES_BRANCH_DELAY_OFFSET_Y
            : 0
    node.position = {
      x: (stableNodeCenterX.get(node.id) ?? point.x) + layoutOffsetX - size.width / 2,
      y: point.y
        - size.height / 2
        + branchOffsetY
        + (inviteBranchDownstreamIds.has(node.id) ? 24 : 0)
        + (conditionBranchDelayDownstreamIds.has(node.id) ? CONDITION_BRANCH_DOWNSTREAM_OFFSET_Y : 0)
        + (conditionUndelayedBranchIds.has(node.id) ? CONDITION_UNDELAYED_BRANCH_OFFSET_Y : 0)
        + (inheritedPendingSpacingDepth.get(node.id) ?? 0) * INHERITED_PENDING_LABEL_SPACING_Y,
    }
  })
  return { nodes, edges }
}

const PICKER_GROUPS = [
  { label: 'Actions', types: PICKER_ROWS_BY_GROUP.action },
  { label: 'Conditions', types: ['first_connection_condition', 'message_condition'] as WorkflowNodeType[] },
] as const

function ActionPicker({
  anchor,
  onPick,
}: {
  anchor?: InsertTarget['anchor']
  onPick: (type: WorkflowNodeType) => void
}) {
  const viewportWidth = typeof window === 'undefined' ? 1280 : window.innerWidth
  const viewportHeight = typeof window === 'undefined' ? 800 : window.innerHeight
  const pickerWidth = 196
  const pickerHeight = 390
  const gap = 20
  const margin = 16
  const anchorX = anchor?.x ?? viewportWidth / 2
  const anchorY = anchor?.y ?? viewportHeight / 2
  const anchorLeft = anchor?.left ?? anchorX
  const anchorRight = anchor?.right ?? anchorX
  const opensRight = anchorRight + gap + pickerWidth <= viewportWidth - margin
  const left = opensRight
    ? anchorRight + gap
    : Math.max(margin, anchorLeft - gap - pickerWidth)
  const maxTop = Math.max(margin, viewportHeight - pickerHeight - margin)
  const top = Math.min(
    Math.max(margin, anchorY - pickerHeight / 2),
    maxTop,
  )

  return (
    <div
      className={cn(
        'fixed z-30 w-[196px] rounded-lg border border-border bg-[var(--cn-surface)] p-4 font-manrope shadow-[var(--cn-shadow-popover)]',
        'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-150',
        opensRight
          ? 'origin-left motion-safe:slide-in-from-left-2'
          : 'origin-right motion-safe:slide-in-from-right-2',
      )}
      style={{ left, top }}
    >
      {PICKER_GROUPS.map((group, index) => (
        <div key={group.label} className={index > 0 ? 'mt-4 border-t border-border pt-4' : ''}>
          <p className="mb-2 text-sm font-medium text-foreground">{group.label}:</p>
          <div className="space-y-1">
            {group.types.map((type) => {
              const meta = NODE_META[type]
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onPick(type)}
                  className="flex h-[30px] w-full items-center gap-2 rounded px-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-[var(--cn-surface-subtle)]"
                >
                  <WorkflowTypeIcon type={type} variant="picker" className="h-[18px] w-[18px] shrink-0" />
                  <span className="truncate">{meta.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function makeDefaultInviteFlow(): WorkflowNode {
  const invite = makeNode('connection_request', { message: DEMO_INVITE_MESSAGE })
  const condition = makeNode('connection_request_condition')
  condition.yesChild = makeNode('delay', {
    delayMinutes: 24 * 60,
    delayValue: 1,
    delayUnit: 'days',
    autoDelay: true,
  })
  condition.noChild = makeNode('delay', {
    delayMinutes: 24 * 60,
    delayValue: 1,
    delayUnit: 'days',
    autoDelay: true,
  })
  invite.child = condition
  return invite
}

const ACTION_NODE_TYPES = new Set<WorkflowNodeType>(PICKER_ROWS_BY_GROUP.action)
const TRAILING_DELAY_ACTION_TYPES = new Set<WorkflowNodeType>([
  'send_message',
  'view_profile',
  'follow',
  'like_post',
])

function shouldInsertAutomaticDelay(parent: WorkflowNode | null, nextType: WorkflowNodeType): boolean {
  return Boolean(parent && ACTION_NODE_TYPES.has(parent.type) && ACTION_NODE_TYPES.has(nextType))
}

function makeAutomaticDelay(nextType: WorkflowNodeType): WorkflowNode {
  const days = nextType === 'send_message' || nextType === 'inmail' ? 2 : 1
  return makeNode('delay', {
    delayMinutes: days * 24 * 60,
    delayValue: days,
    delayUnit: 'days',
    autoDelay: true,
  })
}

function makeConditionFlow(type: WorkflowNodeType): WorkflowNode {
  const condition = makeNode(type)
  if (type === 'message_condition') {
    condition.yesChild = makeNode('delay', {
      delayMinutes: 24 * 60,
      delayValue: 1,
      delayUnit: 'days',
      autoDelay: true,
    })
    condition.noChild = makeNode('delay', {
      delayMinutes: 2 * 24 * 60,
      delayValue: 2,
      delayUnit: 'days',
      autoDelay: true,
      conditionDelay: true,
    })
  }
  return condition
}

function SequenceCanvasDemoInner({
  initialWorkflow,
  readOnly = false,
  resultsActive = false,
}: {
  initialWorkflow?: Workflow
  readOnly?: boolean
  resultsActive?: boolean
}) {
  const [workflow, setWorkflow] = useState<Workflow>(() => (
    initialWorkflow ? structuredClone(initialWorkflow) : createEmptyWorkflow()
  ))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [pickerTarget, setPickerTarget] = useState<InsertTarget | null>(null)
  const [delayTarget, setDelayTarget] = useState<DelayTarget | null>(null)
  const [focusNodePlacement, setFocusNodePlacement] = useState<FocusNodePlacement | null>(null)
  const [editorRightInset, setEditorRightInset] = useState<number | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement | null>(null)
  const viewportBeforeEditorRef = useRef<Viewport | null>(null)
  const editorWasOpenRef = useRef(false)
  const hasFittedWorkflowRef = useRef(false)
  const { fitView, getNode, getViewport, setViewport } = useReactFlow()

  useEffect(() => {
    if (!readOnly || !resultsActive) return

    const rootStyles = getComputedStyle(document.documentElement)
    const intervalMs = Number.parseFloat(
      rootStyles.getPropertyValue('--cn-duration-results-live-step'),
    ) || 2400
    const interval = window.setInterval(() => {
      setWorkflow((current) => applyLiveExecutionSnapshot(current))
    }, intervalMs)

    return () => window.clearInterval(interval)
  }, [readOnly, resultsActive])

  const invalidIds = useMemo(() => validateWorkflow(workflow).invalidNodeIds, [workflow])
  const handleDelete = useCallback((id: string) => {
    setWorkflow((current) => {
      const target = findNode(current, id)
      const compositeInvite = target?.type === 'connection_request'
        && target.child?.type === 'connection_request_condition'

      if (compositeInvite) {
        const parentRef = findParent(current, id)
        if (!parentRef) return current
        return setBranch(current, parentRef.parent.id, parentRef.slot, null)
      }

      // Adding an action also inserts automatic spacing delays around it, so
      // deleting it has to take the same pair back out — otherwise the delay is
      // left dangling with nothing to space.
      const isAutoDelay = (node: WorkflowNode | null | undefined) =>
        Boolean(node && node.type === 'delay' && node.data.autoDelay === true)

      const trailing = isAutoDelay(target?.child) ? target!.child! : null

      const parentRef = findParent(current, id)
      const leadingCandidate = parentRef?.parent
      // Mirror shouldInsertAutomaticDelay: a leading delay is only added when the
      // node above is an action. Condition-branch delays are structural — leave them.
      const grandparentRef = leadingCandidate ? findParent(current, leadingCandidate.id) : null
      const leading = isAutoDelay(leadingCandidate)
        && grandparentRef
        && ACTION_NODE_TYPES.has(grandparentRef.parent.type)
        ? leadingCandidate!
        : null

      let next = removeNode(current, id)
      if (trailing) next = removeNode(next, trailing.id)
      if (leading) next = removeNode(next, leading.id)
      return next
    })
    setSelectedId((current) => (current === id ? null : current))
  }, [])
  const handleEnd = useCallback((target: InsertTarget) => {
    setWorkflow((current) => attachAt(current, target.parentId, target.slot, makeNode('end')))
  }, [])
  const handleSaveDelay = useCallback((nodeId: string, value: number, unit: DelayTarget['unit']) => {
    setWorkflow((current) => patchNodeData(current, nodeId, {
      delayMinutes: unit === 'days' ? value * 24 * 60 : value * 60,
      delayValue: value,
      delayUnit: unit,
    }))
    setDelayTarget(null)
  }, [])
  const handleCancelDelay = useCallback(() => setDelayTarget(null), [])

  const canvas = useMemo(
    () => buildCanvas(
      workflow,
      selectedId,
      invalidIds,
      setPickerTarget,
      handleEnd,
      handleDelete,
      setDelayTarget,
      delayTarget?.nodeId ?? null,
      handleSaveDelay,
      handleCancelDelay,
      readOnly,
      resultsActive,
    ),
    [
      workflow,
      selectedId,
      invalidIds,
      handleEnd,
      handleDelete,
      delayTarget?.nodeId,
      handleSaveDelay,
      handleCancelDelay,
      readOnly,
      resultsActive,
    ],
  )

  const hasWorkflowNode = Boolean(getStart(workflow).child)
  useEffect(() => {
    if (!hasWorkflowNode || hasFittedWorkflowRef.current) return
    hasFittedWorkflowRef.current = true
    const frame = requestAnimationFrame(() => {
      void fitView({ padding: 0.2, duration: 280, maxZoom: 1 })
    })
    return () => cancelAnimationFrame(frame)
  }, [fitView, hasWorkflowNode])

  // When embedded (e.g. in a case study page) the canvas can mount before its
  // container has its final size, so the one-shot fitView above lands on a
  // stale measurement and the graph overflows. Refit whenever the box resizes.
  // Deliberately not gated on hasWorkflowNode: an empty canvas is just the Add
  // button, and it has to stay centred when the box changes size — going
  // fullscreen otherwise left it wherever the smaller viewport had put it.
  useEffect(() => {
    const el = canvasContainerRef.current
    if (!el) return
    let frame = 0
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (el.clientWidth === 0 || el.clientHeight === 0) return
        void fitView({ padding: 0.2, maxZoom: 1 })
      })
    })
    observer.observe(el)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [fitView])

  const selectedNode = useMemo(() => (selectedId ? findNode(workflow, selectedId) : null), [workflow, selectedId])
  const showConfig = Boolean(selectedNode && MESSAGE_NODE_TYPES.has(selectedNode.type))

  useEffect(() => {
    if (!showConfig || !selectedId) {
      if (editorWasOpenRef.current && viewportBeforeEditorRef.current) {
        void setViewport(viewportBeforeEditorRef.current, { duration: 280 })
      }
      editorWasOpenRef.current = false
      viewportBeforeEditorRef.current = null
      setFocusNodePlacement(null)
      setEditorRightInset(null)
      return
    }

    if (!editorWasOpenRef.current) {
      viewportBeforeEditorRef.current = getViewport()
      editorWasOpenRef.current = true
    }

    let frame = 0
    let attempts = 0

    // The placement depends on two things that are not ready on the frame the
    // editor opens: the panel has to be in the DOM to measure, and a node added
    // moments ago has not been measured by React Flow yet. Using the fallbacks
    // then put the focused node in the wrong place until the editor was opened a
    // second time, so wait for both to settle before computing.
    const place = () => {
      const container = canvasContainerRef.current
      const flowNode = getNode(selectedId)
      if (!container || !flowNode) return

      const editorElement = document.querySelector<HTMLElement>('[data-sequence-editor]')
      const editorRect = editorElement?.getBoundingClientRect()
      const ready = Boolean(editorRect && editorRect.width > 0)
        && (flowNode.measured?.width ?? 0) > 0
      if (!ready && attempts < 12) {
        attempts += 1
        frame = requestAnimationFrame(place)
        return
      }

      const rect = container.getBoundingClientRect()
      const nodeWidth = flowNode.measured?.width ?? flowNode.width ?? 320
      const nodeHeight = flowNode.measured?.height ?? flowNode.height ?? 56
      const nodePanelGap = 24
      const panelWidth = editorRect?.width ?? Math.min(640, Math.max(320, rect.width - 320))
      const availableGroupWidth = Math.max(0, rect.width - 48)
      const focusedNodeWidth = Math.min(
        nodeWidth,
        Math.max(220, availableGroupWidth - panelWidth - nodePanelGap),
      )
      const groupWidth = focusedNodeWidth + nodePanelGap + panelWidth
      const groupLeft = Math.max(24, (rect.width - groupWidth) / 2)
      const panelLeft = groupLeft + focusedNodeWidth + nodePanelGap
      const targetScreenX = groupLeft + focusedNodeWidth / 2
      const targetScreenY = rect.height / 2
      const nodeCenterX = flowNode.position.x + nodeWidth / 2
      const nodeCenterY = flowNode.position.y + nodeHeight / 2

      // The focused node is drawn outside the flow as plain DOM at
      // focusedNodeWidth CSS px, so the canvas has to zoom to that same scale —
      // translating alone left the graph behind at its old zoom, visibly out of
      // step with the node on top of it.
      const focusScale = clamp(focusedNodeWidth / nodeWidth, FLOW_MIN_ZOOM, FLOW_MAX_ZOOM)
      const focusedNodeHeight = nodeHeight * focusScale

      setFocusNodePlacement({
        left: groupLeft,
        top: targetScreenY - focusedNodeHeight / 2,
        width: focusedNodeWidth,
        height: focusedNodeHeight,
      })
      setEditorRightInset(Math.max(12, rect.width - (panelLeft + panelWidth)))

      void setViewport({
        x: targetScreenX - nodeCenterX * focusScale,
        y: targetScreenY - nodeCenterY * focusScale,
        zoom: focusScale,
      }, { duration: 320 })
    }

    frame = requestAnimationFrame(place)

    return () => cancelAnimationFrame(frame)
  }, [getNode, getViewport, selectedId, setViewport, showConfig])

  return (
    <div ref={canvasContainerRef} className="relative h-full w-full overflow-hidden bg-[var(--cn-surface-subtle)]">
      <ReactFlow
        nodes={canvas.nodes}
        edges={canvas.edges}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        elementsSelectable={!showConfig && !readOnly}
        zoomOnScroll={!showConfig}
        zoomOnPinch={!showConfig}
        zoomOnDoubleClick={!showConfig}
        panOnScroll={!showConfig}
        panOnDrag={!showConfig}
        onNodeClick={(_, node) => {
          if (readOnly) return
          const workflowNode = node.data.node as WorkflowNode | undefined
          if (!workflowNode || !MESSAGE_NODE_TYPES.has(workflowNode.type)) return
          setSelectedId(workflowNode.id)
        }}
        onPaneClick={() => {
          setSelectedId(null)
          setPickerTarget(null)
        }}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
        minZoom={FLOW_MIN_ZOOM}
        maxZoom={FLOW_MAX_ZOOM}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="var(--cn-canvas-dot)"
        />
      </ReactFlow>

      {showConfig && focusNodePlacement && selectedNode ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-40 bg-[var(--cn-overlay-focus)] [backdrop-filter:blur(var(--cn-overlay-focus-blur))]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute z-[45] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-200"
            style={focusNodePlacement}
            aria-hidden
          >
            <FocusedWorkflowNode node={selectedNode} />
          </div>
        </>
      ) : null}

      {pickerTarget ? (
        <>
          <button className="absolute inset-0 z-20 cursor-default" onClick={() => setPickerTarget(null)} aria-label="Close step picker" />
          <ActionPicker
            anchor={pickerTarget.anchor}
            onPick={(type) => {
              const newNode = type === 'connection_request'
                ? makeDefaultInviteFlow()
                : isConditionNodeType(type)
                  ? makeConditionFlow(type)
                  : type === 'send_message'
                    ? makeNode(type, { message: DEMO_FOUNDER_MESSAGE })
                    : makeNode(type)
              setWorkflow((current) => {
                const parent = findNode(current, pickerTarget.parentId)
                const existing = parent?.[pickerTarget.slot] as WorkflowNode | null | undefined

                if (TRAILING_DELAY_ACTION_TYPES.has(type)) {
                  const trailingDelay = makeAutomaticDelay(type)
                  trailingDelay.child = existing ?? null
                  newNode.child = trailingDelay

                  if (!shouldInsertAutomaticDelay(parent, type)) {
                    return setBranch(current, pickerTarget.parentId, pickerTarget.slot, newNode)
                  }

                  const leadingDelay = makeAutomaticDelay(type)
                  leadingDelay.child = newNode
                  return setBranch(current, pickerTarget.parentId, pickerTarget.slot, leadingDelay)
                }

                if (!shouldInsertAutomaticDelay(parent, type)) {
                  return attachAt(current, pickerTarget.parentId, pickerTarget.slot, newNode)
                }

                const automaticDelay = makeAutomaticDelay(type)

                // Terminal Add: delay -> selected action.
                if (!existing) {
                  automaticDelay.child = newNode
                  return attachAt(current, pickerTarget.parentId, pickerTarget.slot, automaticDelay)
                }

                // Edge insertion: preserve the existing downstream chain for ordinary actions.
                // Send invite owns an internal condition subtree, so it cannot safely wrap an
                // existing edge; retain the current insertion behavior for that exceptional case.
                if (type !== 'connection_request') {
                  newNode.child = existing
                  automaticDelay.child = newNode
                  return setBranch(current, pickerTarget.parentId, pickerTarget.slot, automaticDelay)
                }

                return attachAt(current, pickerTarget.parentId, pickerTarget.slot, newNode)
              })
              setPickerTarget(null)
              if (!isConditionNodeType(type) && type !== 'view_profile' && type !== 'follow' && type !== 'like_post') {
                setSelectedId(newNode.id)
              }
            }}
          />
        </>
      ) : null}

      <Sheet open={showConfig} onOpenChange={(open) => { if (!open) setSelectedId(null) }}>
        <SheetContent
          data-sequence-editor
          hideOverlay
          hideCloseButton={Boolean(selectedNode && MESSAGE_NODE_TYPES.has(selectedNode.type))}
          side={selectedNode && MESSAGE_NODE_TYPES.has(selectedNode.type) ? 'floatingRight' : 'right'}
          portalContainer={canvasContainerRef.current}
          style={editorRightInset !== null ? { right: editorRightInset } : undefined}
          className={cn(
            // `absolute` (not fixed) + portalContainer keeps the editor inside the
            // canvas box, so an embedded demo can't spill over the host page.
            'cn-demo-scope absolute',
            selectedNode && MESSAGE_NODE_TYPES.has(selectedNode.type)
              ? 'w-[min(640px,calc(100%-320px))] min-w-[320px] max-h-[calc(100%-48px)] border-border/70 shadow-[var(--cn-shadow-popover)] transition-[right] duration-300 ease-out'
              : 'w-[min(520px,calc(100%-32px))] sm:max-w-[520px]',
          )}
        >
          {selectedNode ? (
            <DemoMessageEditor
              key={selectedNode.id}
              node={selectedNode}
              onCancel={() => setSelectedId(null)}
              onSave={(patch) => {
                setWorkflow((current) => patchNodeData(current, selectedNode.id, patch))
                setSelectedId(null)
              }}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export function SequenceCanvasDemo({
  initialWorkflow,
  readOnly = false,
  resultsActive = false,
}: {
  initialWorkflow?: Workflow
  readOnly?: boolean
  resultsActive?: boolean
}) {
  return (
    <ReactFlowProvider>
      <SequenceCanvasDemoInner
        initialWorkflow={initialWorkflow}
        readOnly={readOnly}
        resultsActive={resultsActive}
      />
    </ReactFlowProvider>
  )
}
