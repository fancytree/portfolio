/**
 * Workflow tree ⇌ React Flow nodes/edges + dagre 自动布局。
 *
 * 用法：
 *   const { nodes, edges } = workflowToFlow(workflow)
 *   <ReactFlow nodes={nodes} edges={edges} />
 *
 * 节点 / 边 id：直接复用 WorkflowNode.id（业务模型驱动 UI）。
 * 边 id：`e_<source>_<sourceHandle>_<target>`
 *
 * 自定义节点类型走 React Flow 的 `type` 字段。我们用 'wfNode' / 'wfPlus' 两种：
 *   - wfNode: 已有的 workflow 节点（含 start/end/action/condition/delay）
 *   - wfPlus: 空 slot 的 "+" 入口（一种合成节点，没有真实 WorkflowNode 对应）
 */
import type { Edge, Node as FlowNode } from '@xyflow/react'
import dagre from 'dagre'
import type { Workflow, WorkflowNode } from './types'
import { isConditionNodeType } from './nodeMeta'

// ─── 自定义 node data ────────────────────────────────

// React Flow 的 FlowNode data 泛型 extends Record<string, unknown>，
// 所以下面的 data 类型也用 type + Record 交集，保持兼容。
export type WfNodeData = {
  /** 业务模型节点引用（同源） */
  node: WorkflowNode
  /** 是否被校验标红 */
  invalid?: boolean
  /** 是否被选中 */
  selected?: boolean
} & Record<string, unknown>

export type WfPlusData = {
  /** 父节点 id */
  parentId: string
  /** 挂载到的 slot */
  slot: 'child' | 'yesChild' | 'noChild'
  /** 给画布显示的小提示，比如 "YES" / "NO" */
  branchLabel?: string
} & Record<string, unknown>

export type WorkflowFlowNode =
  | FlowNode<WfNodeData, 'wfNode'>
  | FlowNode<WfPlusData, 'wfPlus'>

// 视觉常量（dagre 用，必须给出预估宽高）
const NODE_W = 220
const NODE_H = 92
const PLUS_W = 36
const PLUS_H = 36

// ─── workflow → flow ─────────────────────────────────

export function workflowToFlow(
  workflow: Workflow,
  opts: { invalidIds?: Set<string>; selectedId?: string | null } = {},
): { nodes: WorkflowFlowNode[]; edges: Edge[] } {
  const nodes: WorkflowFlowNode[] = []
  const edges: Edge[] = []

  const invalid = opts.invalidIds ?? new Set<string>()

  function emitNode(n: WorkflowNode) {
    nodes.push({
      id: n.id,
      type: 'wfNode',
      position: { x: 0, y: 0 }, // dagre 会回填
      data: {
        node: n,
        invalid: invalid.has(n.id),
        selected: opts.selectedId === n.id,
      },
      width: NODE_W,
      height: NODE_H,
    })
  }

  function emitPlus(parentId: string, slot: WfPlusData['slot'], branchLabel?: string) {
    const id = `plus_${parentId}_${slot}`
    nodes.push({
      id,
      type: 'wfPlus',
      position: { x: 0, y: 0 },
      data: { parentId, slot, branchLabel },
      width: PLUS_W,
      height: PLUS_H,
    })
    edges.push({
      id: `e_${parentId}_${slot}_${id}`,
      source: parentId,
      sourceHandle: slot,
      target: id,
      type: 'smoothstep',
      label: branchLabel,
      style: { strokeDasharray: '4 4', opacity: 0.5 },
    })
  }

  function emitEdge(parentId: string, slot: WfPlusData['slot'], childId: string, branchLabel?: string) {
    edges.push({
      id: `e_${parentId}_${slot}_${childId}`,
      source: parentId,
      sourceHandle: slot,
      target: childId,
      // 用自定义 edge 在中间渲染 "+" 按钮（用户可以在 parent/child 之间插入节点）
      type: 'wfEdge',
      label: branchLabel,
    })
  }

  function walk(n: WorkflowNode | null | undefined) {
    if (!n) return
    emitNode(n)
    if (isConditionNodeType(n.type)) {
      if (n.yesChild) {
        emitEdge(n.id, 'yesChild', n.yesChild.id, 'YES')
        walk(n.yesChild)
      } else {
        emitPlus(n.id, 'yesChild', 'YES')
      }
      if (n.noChild) {
        emitEdge(n.id, 'noChild', n.noChild.id, 'NO')
        walk(n.noChild)
      } else {
        emitPlus(n.id, 'noChild', 'NO')
      }
    } else if (n.type === 'end') {
      // 叶节点，无后续
    } else {
      if (n.child) {
        emitEdge(n.id, 'child', n.child.id)
        walk(n.child)
      } else {
        emitPlus(n.id, 'child')
      }
    }
  }

  walk(workflow.nodes[0])
  return layout({ nodes, edges })
}

// ─── dagre 布局 ──────────────────────────────────────

function layout({
  nodes,
  edges,
}: {
  nodes: WorkflowFlowNode[]
  edges: Edge[]
}): { nodes: WorkflowFlowNode[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'TB', nodesep: 40, ranksep: 60 })

  for (const n of nodes) {
    g.setNode(n.id, { width: n.width ?? NODE_W, height: n.height ?? NODE_H })
  }
  for (const e of edges) {
    g.setEdge(e.source, e.target)
  }
  dagre.layout(g)

  const positioned = nodes.map((n) => {
    const pos = g.node(n.id)
    if (!pos) return n
    // dagre 给的是中心点，React Flow 用左上角
    return {
      ...n,
      position: { x: pos.x - (n.width ?? NODE_W) / 2, y: pos.y - (n.height ?? NODE_H) / 2 },
    }
  }) as WorkflowFlowNode[]

  return { nodes: positioned, edges }
}
