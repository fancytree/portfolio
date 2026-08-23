/**
 * Workflow tree 模型纯函数库。
 *
 * 用于在 React state 中操作 Workflow（不可变更新）。
 * 与 connectnova-heyreach 引擎的 tree schema 同构：每个 node 有 child / yesChild / noChild。
 *
 * 详见 recruiter-api/docs/outreach-tree-migration.md
 */
import type { Workflow, WorkflowNode, WorkflowNodeData, WorkflowNodeType } from './types'
import { isConditionNodeType } from './nodeMeta'

// ─── id 生成 ──────────────────────────────────────────

let _seq = 0
/** 节点 id：客户端临时 uuid（提交时透传，后端无业务依赖） */
export function makeNodeId(prefix = 'n'): string {
  _seq += 1
  return `${prefix}_${Date.now().toString(36)}_${_seq.toString(36)}`
}

// ─── 空工作流 ────────────────────────────────────────

export function createEmptyWorkflow(): Workflow {
  return {
    nodes: [
      {
        id: makeNodeId('start'),
        type: 'start',
        data: {},
        child: null,
      },
    ],
  }
}

export function getStart(workflow: Workflow): WorkflowNode {
  return workflow.nodes[0]
}

// ─── 不可变工具 ───────────────────────────────────────

/** 深拷贝 workflow（用于变更前 cloning） */
export function cloneWorkflow(workflow: Workflow): Workflow {
  return JSON.parse(JSON.stringify(workflow)) as Workflow
}

export function cloneNode(node: WorkflowNode): WorkflowNode {
  return JSON.parse(JSON.stringify(node)) as WorkflowNode
}

// ─── 查询 ────────────────────────────────────────────

/** 递归找节点 */
export function findNode(workflow: Workflow, id: string): WorkflowNode | null {
  function dfs(n: WorkflowNode | null | undefined): WorkflowNode | null {
    if (!n) return null
    if (n.id === id) return n
    return dfs(n.child) || dfs(n.yesChild) || dfs(n.noChild)
  }
  return dfs(workflow.nodes[0])
}

/** 找父节点 + 当前节点挂在哪个 slot 上 */
export interface ParentRef {
  parent: WorkflowNode
  slot: 'child' | 'yesChild' | 'noChild'
}

export function findParent(workflow: Workflow, id: string): ParentRef | null {
  function dfs(n: WorkflowNode | null | undefined): ParentRef | null {
    if (!n) return null
    if (n.child && n.child.id === id) return { parent: n, slot: 'child' }
    if (n.yesChild && n.yesChild.id === id) return { parent: n, slot: 'yesChild' }
    if (n.noChild && n.noChild.id === id) return { parent: n, slot: 'noChild' }
    return dfs(n.child) || dfs(n.yesChild) || dfs(n.noChild)
  }
  return dfs(workflow.nodes[0])
}

/**
 * 清理 workflow 中的脏数据 — 主要是 condition 节点的非法 child slot。
 *
 * 历史背景：早期 builder bug 让 condition 节点的 + 按钮在某些情况下把节点挂到 `child`
 * 而非 `yesChild`/`noChild`，造成数据画布不可见、`listAllNodes` 平铺却出现的 "鬼节点" 问题。
 * 加载模板/campaign workflow 时跑一次，能让已损坏数据自我修复（再保存即落库干净版本）。
 */
export function sanitizeWorkflow(workflow: Workflow): Workflow {
  const next = cloneWorkflow(workflow)
  let dropped = 0
  function walk(n: WorkflowNode | null | undefined) {
    if (!n) return
    if (isConditionNodeType(n.type) && (n as any).child) {
      dropped++
      ;(n as any).child = null
    }
    walk(n.child)
    walk(n.yesChild)
    walk(n.noChild)
  }
  walk(next.nodes[0])
  if (dropped > 0 && typeof console !== 'undefined') {
    console.warn(`[workflow.sanitize] dropped ${dropped} illegal condition.child branch(es)`)
  }
  return next
}

/** 收集所有节点（深度优先） */
export function listAllNodes(workflow: Workflow): WorkflowNode[] {
  const out: WorkflowNode[] = []
  function dfs(n: WorkflowNode | null | undefined) {
    if (!n) return
    out.push(n)
    dfs(n.child)
    dfs(n.yesChild)
    dfs(n.noChild)
  }
  dfs(workflow.nodes[0])
  return out
}

// ─── 变更 ────────────────────────────────────────────

/**
 * 不同节点类型的默认 data 值。
 * 避免 makeNode 后 data 空字段导致画布 summary 显示"0H"等假值。
 */
function defaultDataFor(type: WorkflowNodeType): WorkflowNodeData {
  switch (type) {
    case 'connection_request_condition':
      // 4 天 — LinkedIn 邀请典型等待窗
      return { timeoutHours: 96, timeoutValue: 4, timeoutUnit: 'days' }
    case 'message_condition':
      // 2 天 — 消息超时换路径的典型阈值
      return { timeoutHours: 48, timeoutValue: 2, timeoutUnit: 'days' }
    case 'delay':
      // 1 天 — Wait 节点最常见
      return { delayMinutes: 24 * 60, delayValue: 1, delayUnit: 'days' }
    default:
      return {}
  }
}

/** 创建新节点（不挂载） */
export function makeNode(type: WorkflowNodeType, data?: WorkflowNodeData): WorkflowNode {
  const merged: WorkflowNodeData = { ...defaultDataFor(type), ...(data ?? {}) }
  const node: WorkflowNode = {
    id: makeNodeId(type),
    type,
    data: merged,
  }
  if (isConditionNodeType(type)) {
    node.yesChild = null
    node.noChild = null
  } else if (type !== 'end') {
    node.child = null
  }
  return node
}

/**
 * 在 parent 的指定 slot 下挂一个新节点。
 *
 * 如果 slot 已有子节点：
 *   - 新节点的 child 接住原子节点（"在中间插入"语义）
 *   - 条件节点不能从中间插入（用 setBranch 替换分支）
 */
export function attachAt(
  workflow: Workflow,
  parentId: string,
  slot: 'child' | 'yesChild' | 'noChild',
  newNode: WorkflowNode,
): Workflow {
  const next = cloneWorkflow(workflow)
  const parent = findNode(next, parentId)
  if (!parent) return workflow

  // Guard: condition 节点只有 yesChild / noChild，禁止误把节点挂到 child slot
  // （会让画布 walk 跳过那条路径 → 节点"消失"但其实数据还在；UI 点击表现为"点 + 没反应"，
  //  用户重复点累积一长串孤儿链。任何上游 UI bug 在此兜底拦截。）
  if (isConditionNodeType(parent.type) && slot === 'child') {
    if (typeof console !== 'undefined') {
      console.warn(
        `[workflow.attachAt] blocked illegal slot='child' on condition node ${parentId}`,
      )
    }
    return workflow
  }

  const existing = parent[slot] as WorkflowNode | null | undefined
  if (existing) {
    if (isConditionNodeType(newNode.type)) {
      // condition 不能"插中间"，因为它只有 yes/no 而没有 child
      // 兼容写法：仍接住，把 existing 接到 yesChild
      newNode.yesChild = existing
    } else if (newNode.type === 'end') {
      // end 是叶节点，不能接 existing
    } else {
      newNode.child = existing
    }
  }
  ;(parent as any)[slot] = newNode
  return next
}

/** 替换 parent 在 slot 的子节点（不接续 existing） */
export function setBranch(
  workflow: Workflow,
  parentId: string,
  slot: 'child' | 'yesChild' | 'noChild',
  newSubtree: WorkflowNode | null,
): Workflow {
  const next = cloneWorkflow(workflow)
  const parent = findNode(next, parentId)
  if (!parent) return workflow
  ;(parent as any)[slot] = newSubtree
  return next
}

/** 修改某节点的 data 字段（浅 merge） */
export function patchNodeData(
  workflow: Workflow,
  id: string,
  patch: Partial<WorkflowNodeData>,
): Workflow {
  const next = cloneWorkflow(workflow)
  const node = findNode(next, id)
  if (!node) return workflow
  node.data = { ...node.data, ...patch }
  return next
}

/**
 * 删除节点。
 *
 * 顺序节点：用它的 child 接到 parent.slot（向上拉），保持链路连续
 * 条件节点：删除整个子树（yes/no 两条分支都跟着消失）— 行为对齐老板
 * end 节点：直接置 parent.slot = null，让 parent 重新出现 "+" 入口
 */
export function removeNode(workflow: Workflow, id: string): Workflow {
  const next = cloneWorkflow(workflow)
  const start = next.nodes[0]
  if (id === start.id) return workflow // 不能删 start

  const ref = findParent(next, id)
  if (!ref) return workflow
  const target = ref.parent[ref.slot] as WorkflowNode
  if (!target) return workflow

  if (isConditionNodeType(target.type)) {
    ;(ref.parent as any)[ref.slot] = null
  } else if (target.type === 'end') {
    ;(ref.parent as any)[ref.slot] = null
  } else {
    ;(ref.parent as any)[ref.slot] = target.child ?? null
  }
  return next
}

// ─── 校验 ────────────────────────────────────────────

export interface ValidationIssue {
  nodeId: string
  type: 'missing_message' | 'missing_subject' | 'message_too_long' | 'condition_branch_missing' | 'orphan_branch'
  message: string
}

export interface ValidationResult {
  ok: boolean
  issues: ValidationIssue[]
  /** 高亮节点（UI 渲染红框） */
  invalidNodeIds: Set<string>
}

const CR_MAX_LEN = 300

/**
 * 校验整个 workflow。
 *
 * 规则：
 * - connection_request: message 可选，但若有则 ≤ 300 字
 * - send_message: message 必填
 * - inmail: subject + message 必填
 * - condition 节点：yesChild + noChild 必须都有（否则报 missing branch）
 * - start: child 必填（否则 "no steps"）
 */
export function validateWorkflow(workflow: Workflow): ValidationResult {
  const issues: ValidationIssue[] = []
  const invalidNodeIds = new Set<string>()

  function add(node: WorkflowNode, type: ValidationIssue['type'], message: string) {
    issues.push({ nodeId: node.id, type, message })
    invalidNodeIds.add(node.id)
  }

  function walk(n: WorkflowNode | null | undefined) {
    if (!n) return
    switch (n.type) {
      case 'connection_request': {
        const msg = (n.data.message || '').trim()
        if (msg.length > CR_MAX_LEN) {
          add(n, 'message_too_long', `Invite note must be ≤ ${CR_MAX_LEN} chars`)
        }
        break
      }
      case 'send_message': {
        if (!(n.data.message || '').trim()) {
          add(n, 'missing_message', 'Message is required')
        }
        break
      }
      case 'inmail': {
        if (!(n.data.subject || '').trim()) {
          add(n, 'missing_subject', 'InMail subject is required')
        }
        if (!(n.data.message || '').trim()) {
          add(n, 'missing_message', 'InMail body is required')
        }
        break
      }
      default:
        break
    }
    if (isConditionNodeType(n.type)) {
      if (!n.yesChild) add(n, 'condition_branch_missing', 'YES branch is empty')
      if (!n.noChild) add(n, 'condition_branch_missing', 'NO branch is empty')
    }
    walk(n.child)
    walk(n.yesChild)
    walk(n.noChild)
  }

  walk(workflow.nodes[0])

  return { ok: issues.length === 0, issues, invalidNodeIds }
}

/** start 节点是否至少有一个 child（没 child 即 workflow 没动作） */
export function workflowHasActions(workflow: Workflow): boolean {
  const start = workflow.nodes[0]
  return Boolean(start?.child || start?.yesChild || start?.noChild)
}
