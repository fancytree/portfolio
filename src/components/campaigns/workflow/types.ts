export type WorkflowNodeType =
  | 'start'
  | 'end'
  | 'connection_request'
  | 'send_message'
  | 'inmail'
  | 'view_profile'
  | 'follow'
  | 'like_post'
  | 'delay'
  | 'connection_request_condition'
  | 'message_condition'
  | 'first_connection_condition'

export type DelayUnit = 'minutes' | 'hours' | 'days'

export interface WorkflowNodeData {
  message?: string
  subject?: string
  delayMinutes?: number
  delayValue?: number
  delayUnit?: DelayUnit
  timeoutHours?: number
  timeoutValue?: number
  timeoutUnit?: 'hours' | 'days'
  postUrl?: string
  [k: string]: any
}

export interface WorkflowNode {
  id: string
  type: WorkflowNodeType
  data: WorkflowNodeData
  child?: WorkflowNode | null
  yesChild?: WorkflowNode | null
  noChild?: WorkflowNode | null
}

export interface Workflow {
  nodes: WorkflowNode[]
}

export type DynamicFieldToken =
  | 'FIRST_NAME' | 'LAST_NAME' | 'FULL_NAME'
  | 'POSITION'   | 'COMPANY'   | 'LOCATION'
  | 'HEADLINE'   | 'INDUSTRY'

export const DYNAMIC_FIELD_TOKENS: DynamicFieldToken[] = [
  'FIRST_NAME', 'LAST_NAME', 'FULL_NAME',
  'POSITION', 'COMPANY', 'LOCATION',
  'HEADLINE', 'INDUSTRY',
]

export interface SequenceTemplate {
  id: string
  name: string
  tagline?: string
  workflow: Workflow
  isBuiltin: boolean
  createdAt?: string
  updatedAt?: string
}
