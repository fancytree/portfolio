'use client'

import { useState } from 'react'
import { BarChart3, MousePointer2, RotateCcw, Workflow, type LucideIcon } from 'lucide-react'
import type { Workflow as CampaignWorkflow, WorkflowNode } from '@/components/campaigns/workflow/types'
import { cn } from '@/lib/utils'
import { SequenceCanvasDemo } from '@/components/demo/SequenceCanvasDemo'
import { createEmptyWorkflow, getStart, makeNode } from '@/components/campaigns/workflow/workflow.model'

type ExploreMode = 'free' | 'workflow' | 'results'

interface ExploreItem {
  value: ExploreMode
  label: string
  description: string
  icon: LucideIcon
}

const EXPLORE_ITEMS: ExploreItem[] = [
  {
    value: 'free',
    label: 'Free build',
    description: 'Create any workflow from scratch.',
    icon: MousePointer2,
  },
  {
    value: 'workflow',
    label: 'Workflow example',
    description: 'Explore a complete outreach flow.',
    icon: Workflow,
  },
  {
    value: 'results',
    label: 'Execution results',
    description: 'See performance at every step.',
    icon: BarChart3,
  },
]

const EXAMPLE_INVITE_MESSAGE =
  'Hi {FIRST_NAME}, your operations experience at {COMPANY} stood out. I would love to connect.'

const EXAMPLE_FOLLOW_UP_MESSAGE =
  'Hi {FIRST_NAME}, I am building an early-stage company and looking for an operations partner. Would you be open to a short conversation next week?'

function createDelay(value: number, unit: 'hours' | 'days' = 'days') {
  return makeNode('delay', {
    delayValue: value,
    delayUnit: unit,
    delayMinutes: unit === 'days' ? value * 24 * 60 : value * 60,
    autoDelay: true,
  })
}

function connectSequence(nodes: WorkflowNode[]) {
  nodes.slice(0, -1).forEach((node, index) => {
    node.child = nodes[index + 1]
  })
  return nodes[0] ?? null
}

function createWorkflowExample(): CampaignWorkflow {
  const workflow = createEmptyWorkflow()
  const start = getStart(workflow)
  const follow = makeNode('follow')
  const invite = makeNode('connection_request', { message: EXAMPLE_INVITE_MESSAGE })
  const inviteCondition = makeNode('connection_request_condition')

  invite.child = inviteCondition
  inviteCondition.noChild = connectSequence([
    createDelay(3),
    makeNode('view_profile'),
    createDelay(3),
    makeNode('like_post'),
    createDelay(3),
    makeNode('end'),
  ])
  inviteCondition.yesChild = connectSequence([
    createDelay(1, 'hours'),
    makeNode('send_message', { message: EXAMPLE_FOLLOW_UP_MESSAGE }),
    createDelay(3),
    makeNode('send_message', { message: EXAMPLE_FOLLOW_UP_MESSAGE }),
    createDelay(3),
    makeNode('send_message', { message: EXAMPLE_FOLLOW_UP_MESSAGE }),
    createDelay(4),
    makeNode('send_message', { message: EXAMPLE_FOLLOW_UP_MESSAGE }),
    createDelay(0),
    makeNode('end'),
  ])

  start.child = connectSequence([follow, createDelay(3), invite])
  return workflow
}

const WORKFLOW_EXAMPLE = createWorkflowExample()

const MESSAGE_RESULTS = [
  { sent: 55, replied: 8, replyRate: '15%' },
  { sent: 47, replied: 6, replyRate: '13%' },
  { sent: 41, replied: 4, replyRate: '10%' },
  { sent: 37, replied: 3, replyRate: '8%' },
]

function createWorkflowResults(): CampaignWorkflow {
  const workflow = createWorkflowExample()
  let messageIndex = 0
  let actionOrder = 0

  const addExecutionStats = (node: WorkflowNode | null | undefined) => {
    if (!node) return

    if (node.type === 'follow') {
      node.data.executionStage = 'follow'
      node.data.executionStats = {
        primary: { value: 148, label: 'Leads' },
        outcomes: [{ rate: '89%', value: 132, label: 'Followed' }],
      }
    } else if (node.type === 'connection_request') {
      node.data.executionStage = 'invite'
      node.data.executionStats = {
        primary: { value: 132, label: 'Sent' },
        outcomes: [
          { rate: '42%', value: 55, label: 'Accepted' },
          { rate: '58%', value: 77, label: 'Pending' },
        ],
      }
    } else if (node.type === 'view_profile') {
      node.data.executionStage = 'pending_profile'
      node.data.executionStats = {
        primary: { value: 77, label: 'Profiles' },
        outcomes: [{ rate: '100%', value: 77, label: 'Viewed' }],
      }
    } else if (node.type === 'like_post') {
      node.data.executionStage = 'pending_like'
      node.data.executionStats = {
        primary: { value: 68, label: 'Profiles' },
        outcomes: [
          { rate: '62%', value: 42, label: 'Liked' },
          { rate: '38%', value: 26, label: 'Skipped' },
        ],
      }
    } else if (node.type === 'send_message') {
      const result = MESSAGE_RESULTS[messageIndex] ?? MESSAGE_RESULTS.at(-1)!
      const noReply = result.sent - result.replied
      node.data.executionStage = `message_${messageIndex + 1}`
      node.data.executionStats = {
        primary: { value: result.sent, label: 'Sent' },
        outcomes: [
          { rate: result.replyRate, value: result.replied, label: 'Replied' },
          {
            rate: `${100 - Number.parseInt(result.replyRate, 10)}%`,
            value: noReply,
            label: 'No reply',
          },
        ],
      }
      messageIndex += 1
    }

    if (node.data.executionStats) {
      node.data.executionOrder = actionOrder
      actionOrder += 1
    }

    addExecutionStats(node.child)
    addExecutionStats(node.noChild)
    addExecutionStats(node.yesChild)
  }

  addExecutionStats(getStart(workflow).child)
  return workflow
}

const WORKFLOW_RESULTS = createWorkflowResults()

function ExploreNavigation({
  value,
  onChange,
  onReset,
}: {
  value: ExploreMode
  onChange: (value: ExploreMode) => void
  onReset: () => void
}) {
  return (
    <aside className="flex shrink-0 flex-col border-b border-border bg-background p-3 sm:w-60 sm:border-b-0 sm:border-r">
      <div className="mb-3 shrink-0">
        <button
          type="button"
          onClick={onReset}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-left transition-colors',
            'text-muted-foreground hover:bg-muted hover:text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          )}
        >
          <RotateCcw className="h-4 w-4 shrink-0" strokeWidth={1.8} />
          <span className="text-sm font-medium">Reset</span>
        </button>
      </div>

      <div className="px-2 py-2">
        <p className="text-xs font-semibold uppercase text-muted-foreground">Explore</p>
      </div>

      <nav aria-label="Sequence demo modes" className="flex gap-1 overflow-x-auto sm:flex-col sm:overflow-visible">
        {EXPLORE_ITEMS.map((item) => {
          const Icon = item.icon
          const active = item.value === value

          return (
            <button
              key={item.value}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => onChange(item.value)}
              className={cn(
                'flex shrink-0 items-start gap-2.5 rounded-lg px-3 py-3 text-left transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                active
                  ? 'bg-secondary text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="mt-0.5 h-4 w-4" strokeWidth={1.8} />
              <span className="min-w-0">
                <span className="block text-sm font-medium">{item.label}</span>
                <span className="mt-0.5 block text-xs leading-4 text-muted-foreground">
                  {item.description}
                </span>
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export function SequenceDemoWorkspace() {
  const [mode, setMode] = useState<ExploreMode>('free')
  // Every canvas keeps its own edited copy of the workflow, so remounting the
  // three of them by key is what returns the whole demo to its starting state.
  const [resetKey, setResetKey] = useState(0)

  return (
    <div className="flex h-full min-h-0 flex-col sm:flex-row">
      <ExploreNavigation value={mode} onChange={setMode} onReset={() => setResetKey((n) => n + 1)} />
      <div className="relative min-h-0 min-w-0 flex-1">
        <div
          className={cn(
            'absolute inset-0 transition-opacity',
            mode === 'free' ? 'z-10 opacity-100' : 'pointer-events-none opacity-0',
          )}
          aria-hidden={mode !== 'free'}
        >
          <SequenceCanvasDemo key={resetKey} />
        </div>
        <div
          className={cn(
            'absolute inset-0 transition-opacity',
            mode === 'workflow' ? 'z-10 opacity-100' : 'pointer-events-none opacity-0',
          )}
          aria-hidden={mode !== 'workflow'}
        >
          <SequenceCanvasDemo key={resetKey} initialWorkflow={WORKFLOW_EXAMPLE} />
        </div>
        <div
          className={cn(
            'absolute inset-0 transition-opacity',
            mode === 'results' ? 'z-10 opacity-100' : 'pointer-events-none opacity-0',
          )}
          aria-hidden={mode !== 'results'}
        >
          <SequenceCanvasDemo
            key={resetKey}
            initialWorkflow={WORKFLOW_RESULTS}
            readOnly
            resultsActive={mode === 'results'}
          />
        </div>
      </div>
    </div>
  )
}
