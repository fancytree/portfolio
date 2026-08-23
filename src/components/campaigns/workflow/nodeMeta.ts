/**
 * 节点元数据（label / icon / 配色 / picker 分组）。
 *
 * 与 connectnova-heyreach/services/workflowEngine.js 中的 action_type 字符串一一对应。
 * 详见 recruiter-api/docs/outreach-tree-migration.md
 */
import {
  Eye,
  Mail,
  MessageSquare,
  UserRoundPlus,
  UserPlus,
  ThumbsUp,
  Clock,
  GitBranch,
  MessageCircle,
  Link2,
  CheckCircle2,
  Flag,
  type LucideIcon,
} from 'lucide-react';
import type { WorkflowNodeType } from './types';

export interface NodeMeta {
  type: WorkflowNodeType;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind 颜色（节点头部条 + 图标） */
  color: string;
  /** picker 分组 */
  group: 'action' | 'utility' | 'condition' | 'system';
  /** Premium 才能用（前端 picker disable） */
  premiumOnly?: boolean;
  /** 占位功能，Unipile API 集成未完成 */
  comingSoon?: boolean;
  /** 是否条件节点（带 yes/no 分支） */
  isCondition?: boolean;
}

export const NODE_META: Record<WorkflowNodeType, NodeMeta> = {
  // ─── system ─────────────────────────────────────────
  start: {
    type: 'start',
    label: 'Campaign Start',
    description: 'The entry point for every candidate',
    icon: Flag,
    color: 'bg-slate-500',
    group: 'system',
  },
  end: {
    type: 'end',
    label: 'End of sequence',
    description: 'Stop processing this candidate',
    icon: CheckCircle2,
    color: 'bg-zinc-500',
    group: 'system',
  },

  // ─── actions ────────────────────────────────────────
  connection_request: {
    type: 'connection_request',
    label: 'Send invite',
    description: 'Connection invite + optional note (300 chars)',
    icon: UserRoundPlus,
    color: 'bg-emerald-500',
    group: 'action',
  },
  send_message: {
    type: 'send_message',
    label: 'Send message',
    description: 'Direct message (1st-degree only)',
    icon: MessageSquare,
    color: 'bg-orange-500',
    group: 'action',
  },
  inmail: {
    type: 'inmail',
    label: 'Send InMail',
    description: 'Reach anyone (Premium / Sales Nav / Recruiter)',
    icon: Mail,
    color: 'bg-amber-500',
    group: 'action',
    premiumOnly: true,
  },
  view_profile: {
    type: 'view_profile',
    label: 'View profile',
    description: "Open the candidate's LinkedIn profile",
    icon: Eye,
    color: 'bg-blue-500',
    group: 'action',
  },
  follow: {
    type: 'follow',
    label: 'Follow',
    description: "Follow the candidate on LinkedIn",
    icon: UserPlus,
    color: 'bg-violet-500',
    group: 'action',
  },
  like_post: {
    type: 'like_post',
    label: 'Like a post',
    description: 'React to the candidate\'s latest or specified post',
    icon: ThumbsUp,
    color: 'bg-pink-500',
    group: 'action',
    comingSoon: true,
  },

  // ─── utility ────────────────────────────────────────
  delay: {
    type: 'delay',
    label: 'Delay',
    description: 'Wait before the next step',
    icon: Clock,
    color: 'bg-cyan-500',
    group: 'utility',
  },

  // ─── conditions ─────────────────────────────────────
  connection_request_condition: {
    type: 'connection_request_condition',
    label: 'If invite accepted',
    description: 'Branch on whether the invite is accepted within timeout',
    icon: GitBranch,
    color: 'bg-indigo-500',
    group: 'condition',
    isCondition: true,
  },
  message_condition: {
    type: 'message_condition',
    label: 'If message replied',
    description: 'Branch on whether the candidate replies within timeout',
    icon: MessageCircle,
    color: 'bg-purple-500',
    group: 'condition',
    isCondition: true,
  },
  first_connection_condition: {
    type: 'first_connection_condition',
    label: 'If connected',
    description: 'Branch on whether the candidate is already connected on LinkedIn',
    icon: Link2,
    color: 'bg-fuchsia-500',
    group: 'condition',
    isCondition: true,
  },
};

/** picker 分组下显示顺序 */
export const PICKER_ROWS_BY_GROUP: Record<NodeMeta['group'], WorkflowNodeType[]> = {
  action: ['connection_request', 'send_message', 'inmail', 'view_profile', 'follow', 'like_post'],
  utility: ['delay'],
  condition: ['message_condition', 'first_connection_condition'],
  system: ['end'],
};

export function isConditionNodeType(type: WorkflowNodeType): boolean {
  return NODE_META[type]?.isCondition === true;
}

export function isLeafNodeType(type: WorkflowNodeType): boolean {
  return type === 'end';
}

/** 节点上方显示的短标签（迷你 flow 卡片用） */
export const NODE_SHORT_LABEL: Record<WorkflowNodeType, string> = {
  start: 'START',
  end: 'END',
  connection_request: 'INVITE',
  send_message: 'MSG',
  inmail: 'INMAIL',
  view_profile: 'VIEW',
  follow: 'FOLLOW',
  like_post: 'LIKE',
  delay: 'DELAY',
  connection_request_condition: 'IF INVITE',
  message_condition: 'IF MSG',
  first_connection_condition: 'IF CONNECTED',
};
