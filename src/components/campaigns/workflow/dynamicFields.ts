/**
 * 动态字段（message / subject 占位符）。
 *
 * 用单括号大写形式 `{FIRST_NAME}`，与老板 jobnova-heyreach 设计对齐。
 * Node 端 `replaceMessagePlaceholders` 同时兼容双括号 `{{first_name}}`（小写）。
 *
 * 详见 connectnova-heyreach/services/workflowEngine.js
 */
import { DYNAMIC_FIELD_TOKENS, type DynamicFieldToken } from './types';

export interface DynamicField {
  token: DynamicFieldToken
  /** 插入到 message 时的字面量 */
  literal: string
  /** UI 按钮上的友好名 */
  label: string
  /** 简短说明 */
  description?: string
}

export const DYNAMIC_FIELDS: DynamicField[] = [
  { token: 'FIRST_NAME', literal: '{FIRST_NAME}', label: 'First name',  description: 'e.g. "Sarah"' },
  { token: 'LAST_NAME',  literal: '{LAST_NAME}',  label: 'Last name',   description: 'e.g. "Chen"' },
  { token: 'FULL_NAME',  literal: '{FULL_NAME}',  label: 'Full name',   description: 'e.g. "Sarah Chen"' },
  { token: 'POSITION',   literal: '{POSITION}',   label: 'Position',    description: "Current job title" },
  { token: 'COMPANY',    literal: '{COMPANY}',    label: 'Company',     description: 'Current employer' },
  { token: 'LOCATION',   literal: '{LOCATION}',   label: 'Location',    description: 'City, country' },
  { token: 'HEADLINE',   literal: '{HEADLINE}',   label: 'Headline',    description: 'LinkedIn headline' },
  { token: 'INDUSTRY',   literal: '{INDUSTRY}',   label: 'Industry',    description: 'LinkedIn industry' },
]

/** 字段顺序与 contract `DYNAMIC_FIELD_TOKENS` 对齐 */
export const _DYNAMIC_FIELDS_VALID_ORDER: void =
  (() => {
    DYNAMIC_FIELDS.forEach((f, i) => {
      if (f.token !== DYNAMIC_FIELD_TOKENS[i]) {
        // eslint-disable-next-line no-console
        console.warn(
          `[dynamicFields] order mismatch at index ${i}: contract=${DYNAMIC_FIELD_TOKENS[i]}, ui=${f.token}`,
        )
      }
    })
  })()
