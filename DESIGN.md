# Case Kit · 采购 Agent 叙事模块

`CaseEvidenceCards` 用于职责、决策和验证变化的短条目。每项接收 `icon`、`title`、`body`，列表通过 `label` 提供可访问名称。图标是装饰，文字独立表达含义；大小使用 `--case-icon-evidence-size`（引用 `--case-space-24`），线宽复用 `--case-icon-stroke`。栅格复用 `--case-grid-column-min`，卡片采用 surface、md 圆角、24 内边距与 16 内部间距；标题采用 subsection，正文采用 card-body 与 copy。Case Kit 的 Context 章展示该模块。采购 Agent 页通过该共享模块呈现职责与人机分工，无独立样式表。

数值源为 `src/lib/design-tokens/case.css`；模块与样式为 `src/app/components/case-kit/CaseKit.tsx` 和 `case-kit.module.css`。采购截图由 `CaseFigure` 与 `CaseButton` 的 media 模式展示，保持原图比例，可打开原图。案例阅读规则见 [UX.md](UX.md)。
