/**
 * 5 个公共预设 sequence 模板（tree 格式，对齐老板 jobnova-heyreach 设计）。
 *
 * 不入库，硬编码在前端。详见 recruiter-api/docs/outreach-tree-migration.md §4
 *
 * Note: 节点 id 在每次应用模板时由 cloneTemplateWorkflow 重新生成（避免不同 campaign 共享 id）。
 */
import type { SequenceTemplate, Workflow, WorkflowNode } from './types'
import { makeNodeId } from './workflow.model'

// ─── 默认参数 ────────────────────────────────────────

const DEFAULT_INVITE_NOTE =
  'Hi {FIRST_NAME}, I came across your profile and would love to connect!'
const DEFAULT_PITCH_MESSAGE =
  "Hi {FIRST_NAME}, I'd love to share more about the role we're hiring for at {COMPANY}."
const DEFAULT_FOLLOWUP_1 =
  'Hi {FIRST_NAME}, quick bump on the opportunity I mentioned — happy to answer any questions.'
const DEFAULT_FOLLOWUP_2 =
  'Hi {FIRST_NAME}, last follow-up from my side — no pressure if the timing is off.'
const DEFAULT_INMAIL_SUBJECT = 'Opportunity at {COMPANY}'
const DEFAULT_INMAIL_BODY =
  'Hi {FIRST_NAME}, your background in {POSITION} caught my eye. Would love to share more about a role we have open.'

// ─── helpers ────────────────────────────────────────

const ONE_DAY_MIN = 24 * 60
const TIMEOUT_4D = 96   // 4 days
const TIMEOUT_2D = 48
const TIMEOUT_3D = 72

function n(
  type: WorkflowNode['type'],
  data: WorkflowNode['data'] = {},
  child?: WorkflowNode | null,
  yesChild?: WorkflowNode | null,
  noChild?: WorkflowNode | null,
): WorkflowNode {
  const node: WorkflowNode = {
    id: makeNodeId(type),
    type,
    data,
  }
  if (child !== undefined) node.child = child
  if (yesChild !== undefined) node.yesChild = yesChild
  if (noChild !== undefined) node.noChild = noChild
  return node
}

const END = (): WorkflowNode => n('end', {})

// ─── 5 个预设 ──────────────────────────────────────

function buildLiteOutreach(): Workflow {
  // view_profile → CR(+1d)
  const cr = n('connection_request', { message: DEFAULT_INVITE_NOTE }, END())
  const view = n('view_profile', { delayMinutes: 0 }, n('connection_request', {
    message: DEFAULT_INVITE_NOTE,
    delayMinutes: ONE_DAY_MIN,
  }, END()))
  void cr // silence
  return {
    nodes: [n('start', {}, view)],
  }
}

function buildStandardRecruit(): Workflow {
  // view_profile → CR(+1d) → if_accepted ? send_message(+1d) : end
  const yesBranch = n('send_message', { message: DEFAULT_PITCH_MESSAGE, delayMinutes: ONE_DAY_MIN }, END())
  const noBranch = END()
  const cond = n('connection_request_condition', { timeoutHours: TIMEOUT_4D }, undefined, yesBranch, noBranch)
  const cr = n('connection_request', { message: DEFAULT_INVITE_NOTE, delayMinutes: ONE_DAY_MIN }, cond)
  const view = n('view_profile', { delayMinutes: 0 }, cr)
  return { nodes: [n('start', {}, view)] }
}

function buildPassivePool(): Workflow {
  // view_profile → follow(+1d) → CR(+1d) → if_accepted ? send_message(+1d) : end
  const yesBranch = n('send_message', { message: DEFAULT_PITCH_MESSAGE, delayMinutes: ONE_DAY_MIN }, END())
  const cond = n(
    'connection_request_condition',
    { timeoutHours: TIMEOUT_4D },
    undefined,
    yesBranch,
    END(),
  )
  const cr = n('connection_request', { message: DEFAULT_INVITE_NOTE, delayMinutes: ONE_DAY_MIN }, cond)
  const follow = n('follow', { delayMinutes: ONE_DAY_MIN }, cr)
  const view = n('view_profile', { delayMinutes: 0 }, follow)
  return { nodes: [n('start', {}, view)] }
}

function buildAggressiveFollowup(): Workflow {
  // CR → if_accepted ?
  //        msg1 → msg_condition(48h) ? end : msg2 → msg_condition(48h) ? end : msg3
  //      : end
  const msg3 = n('send_message', { message: DEFAULT_FOLLOWUP_2, delayMinutes: ONE_DAY_MIN }, END())

  const mc2NoBranch = msg3
  const mc2 = n('message_condition', { timeoutHours: TIMEOUT_2D }, undefined, END(), mc2NoBranch)
  const msg2 = n('send_message', { message: DEFAULT_FOLLOWUP_1, delayMinutes: 2 * ONE_DAY_MIN }, mc2)

  const mc1NoBranch = msg2
  const mc1 = n('message_condition', { timeoutHours: TIMEOUT_2D }, undefined, END(), mc1NoBranch)
  const msg1 = n('send_message', { message: DEFAULT_PITCH_MESSAGE, delayMinutes: ONE_DAY_MIN }, mc1)

  const cond = n(
    'connection_request_condition',
    { timeoutHours: TIMEOUT_4D },
    undefined,
    msg1,
    END(),
  )
  const cr = n('connection_request', { message: DEFAULT_INVITE_NOTE }, cond)
  return { nodes: [n('start', {}, cr)] }
}

function buildCandidateOutreach(): Workflow {
  // view_profile → CR → if_accepted ? send_message → msg_condition(72h) ? end : inmail : end
  const inmail = n(
    'inmail',
    { subject: DEFAULT_INMAIL_SUBJECT, message: DEFAULT_INMAIL_BODY, delayMinutes: ONE_DAY_MIN },
    END(),
  )
  const mc = n('message_condition', { timeoutHours: TIMEOUT_3D }, undefined, END(), inmail)
  const msg = n('send_message', { message: DEFAULT_PITCH_MESSAGE, delayMinutes: ONE_DAY_MIN }, mc)
  const cond = n(
    'connection_request_condition',
    { timeoutHours: TIMEOUT_4D },
    undefined,
    msg,
    END(),
  )
  const cr = n('connection_request', { message: DEFAULT_INVITE_NOTE, delayMinutes: ONE_DAY_MIN }, cond)
  const view = n('view_profile', { delayMinutes: 0 }, cr)
  return { nodes: [n('start', {}, view)] }
}

// ─── 导出 ────────────────────────────────────────────

export const PREBUILT_TEMPLATES: SequenceTemplate[] = [
  {
    id: 'lite-outreach',
    name: 'Lite Outreach',
    tagline: 'Lightweight — great for cold start',
    workflow: buildLiteOutreach(),
    isBuiltin: true,
  },
  {
    id: 'standard-recruit',
    name: 'Standard Recruit',
    tagline: 'The most common three-step flow',
    workflow: buildStandardRecruit(),
    isBuiltin: true,
  },
  {
    id: 'passive-pool',
    name: 'Passive Pool',
    tagline: 'Softer path for passive candidates',
    workflow: buildPassivePool(),
    isBuiltin: true,
  },
  {
    id: 'aggressive-followup',
    name: 'Aggressive Follow-up',
    tagline: 'Multiple touches for high-priority roles',
    workflow: buildAggressiveFollowup(),
    isBuiltin: true,
  },
  {
    id: 'candidate-outreach',
    name: 'Candidate Outreach',
    tagline: 'Auto-upgrade to InMail when message goes unanswered',
    workflow: buildCandidateOutreach(),
    isBuiltin: true,
  },
]

/** 应用模板时调用：重新生成所有 node id，避免不同 campaign 共享 id */
export function cloneTemplateWorkflow(template: SequenceTemplate): Workflow {
  const cloned: Workflow = JSON.parse(JSON.stringify(template.workflow))
  function regenIds(n: WorkflowNode | null | undefined) {
    if (!n) return
    n.id = makeNodeId(n.type)
    regenIds(n.child)
    regenIds(n.yesChild)
    regenIds(n.noChild)
  }
  regenIds(cloned.nodes[0])
  return cloned
}
