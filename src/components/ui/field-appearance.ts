/**
 * 表单控件 appearance 共享层（单一维护点）
 * Input / Textarea / 原生 select（surface）共用下列 class；各组件 cva 再拼尺寸、file、resize 等。
 *
 * 交互轻量化（v2）：
 *  - 移除 active:scale —— 不再有点击缩放
 *  - 移除 focus ring —— 不再有激活光晕（含 aria-invalid 的红色 ring）
 *  - 聚焦/错误反馈仅通过实色边框（border-ring / border-primary / border-destructive）传达
 *  - hover / disabled / read-only 等其他状态保持不变
 */
export const fieldAppearanceDefaultClasses = [
  "border-input bg-transparent",
  "hover:border-border hover:bg-muted/5",
  "focus-visible:border-ring",
  "disabled:opacity-50",
  "read-only:bg-muted/20 dark:read-only:bg-input/20",
  "dark:border-input dark:bg-input/30 dark:hover:bg-input/35",
  "aria-invalid:border-destructive",
  "aria-invalid:focus-visible:border-destructive",
] as const

export const fieldAppearanceSurfaceClasses = [
  "border-border/80 bg-muted/35 shadow-none placeholder:text-muted-foreground/80",
  "hover:bg-muted/45 hover:border-border",
  "focus-visible:border-primary",
  "disabled:bg-muted/20 disabled:opacity-100 disabled:border-border/60",
  "read-only:bg-muted/25 read-only:border-border/70",
  "dark:bg-input/35 dark:border-border/70 dark:hover:bg-input/50 dark:hover:border-border",
  "dark:disabled:bg-input/25 dark:disabled:opacity-70 dark:disabled:border-border/50",
  "dark:read-only:bg-input/30 dark:read-only:border-border/60",
  "aria-invalid:border-destructive",
  "aria-invalid:focus-visible:border-destructive",
] as const

/** Input 专用：autofill 铺底 */
export const fieldAutofillShadowDefault =
  "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_var(--background)]" as const
export const fieldAutofillShadowSurface =
  "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_var(--muted)]" as const

/** autofill 字色与过渡（单行/多行共用时可拼在 base） */
export const fieldAutofillTextClasses = [
  "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)]",
  "[&:-webkit-autofill]:[transition:background-color_9999s_ease-out]",
] as const

export type FieldAppearance = "default" | "surface"
