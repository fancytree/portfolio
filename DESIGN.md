# DESIGN：Case Kit 统一视觉规范


## Mono 的共享模块应用

Mono 使用 Case Kit 外壳、Hero、Chapter、Prose、EvidenceCards、Figure、Video、Pullquote 与 Close，无独立案例样式表。文末由共享外壳添加唯一 `CaseEnd`。用户要求移除功能介绍后，页面不再渲染三张功能截图、`MonoComponentShowcase` 或 `MonoTokenEvidence`；保留整体录屏。

`src/app/projects/mono/MonoWorkflowDiagrams.tsx` 使用 diagram-design 的流程图约束，按当前 Case Kit 规则映射视觉角色，覆盖旧 JobNova profile 的项目色。960 × 600 只作为 SVG 绘图坐标；字体、灰度、线宽、圆角均引用 case token。箭头先于节点绘制，折线为直角圆弯，分支标签的白色遮罩与线段留有可见距离，底部保留线型图例。节点标题用正文家族与 body 大小，辅助文字用 caption 和 copy，技术分组标签用 spec 与 muted，不新增本地色值或重复 token。

阶段聚焦复用共享 `CaseWorkflow.tsx` 与 `case-workflow.module.css`，按钮沿用 `CaseButton variant="tab"`。活动节点使用 surface 填充、ink 描边和 focus-width；非活动节点辅助文字保留 muted，不叠加透明度。活动连线和箭头同步变为 ink。`--case-workflow-description-height`（5em）为阶段说明预留空间，内容超长时自然撑高。Case Kit 展示同一交互实例；共享组件及其样式均纳入 token 检查。项目 `.diagram-design` 仍选择旧 JobNova profile，本次按项目规则将视觉角色映射到 Case Kit，不引入旧项目色。

两个 SVG 均提供唯一 title/desc ID，并置于共享 `.case-diagram-scroll` 容器中。该叙事辅助文件已加入 `scripts/check-case-tokens.mjs` 检查范围，未标记 `data-case-visual`。独立 HTML 与截图保留在本地 `output/mono-workflow`，不包含在本次网站发布中。

## ConnectNova 新页

`/projects/connectnova-kit` 使用 Case Kit 共享外壳、Hero、Chapter、EvidenceCards、Figure、Video、Pullquote、Close 和 CaseButton；无独立样式表或新的产品演示实现。叙事全部位于新 `page.tsx`，由 token 检查自动覆盖。Project 模型和前后导航结构用现有成对证据卡呈现，三种编辑方案用同一共享图注层级。

截图为 `public/img/connectnova/evidence` 中现有产品稿的 WebP 转换及选区，不重绘产品 UI；Sequence 截图来自已有本地演示。视频来自 ConnectNova 前端已有录屏的限定片段，输出至 `public/videos/connectnova`。外层布局、说明和按钮继续使用案例 token。共享 `.case-diagram-scroll` 同时支持直接子级 SVG 和栅格图片，统一消费 `--case-diagram-inline-width` 并在打印时取消最小宽度；既有 SVG 行为不变。新页没有查看原图按钮；Sequence 直接使用共享 `CaseInteractivePreview layout="canvas"` 嵌入既有演示，不在案例中复制产品按钮。共享 `--case-canvas-height` 定义画布视口高度，默认 content 模式仍随内容测量高度。`CaseVideo controls` 可选开启原生播放与音量控件，默认关闭，初始静音自动播放；不在可见性切换时重置用户音量，开启控件时保留手动暂停。两项能力在 ConnectNova 新页中使用。

## JobNova 新页与成对证据卡

`/projects/jobnova-kit` 从共享 Case Kit 组装，无独立案例样式、项目 token 或叙事豁免组件。使用 Hero、Chapter、Prose、EvidenceCards、Figure、Video、Stats、Pullquote、Close 和自动唯一 CaseEnd。图标使用共享尺寸、线宽和正文色；截图和视频保留 Jobnova 产品视觉，外层图注复用 CaseFigure。截图不附查看原图按钮，网站入口继续复用 CaseButton。

`CaseEvidenceCards` 新增可选 `layout="pairs"`：默认仍为基于共享最小列宽的 auto-fit；pairs 在 768px 起固定两列，更窄屏幕回到默认的单列，避免四项出现三加一。它仅改变结构，不新增视觉数值或 token；Case Kit 样式页展示四项成对示例。现有消费者未指定参数时保留原布局。

新素材位于 `public/img/jobnova/evidence` 和 `public/videos/jobnova`，为现有项目稿的 WebP 选区/压缩及已有 MOV 的 H.264 转码，没有重绘或替换产品内容。所有新叙事代码放在新 `page.tsx`，由现有 token 检查自动覆盖。

## 共享实现来源

- token 唯一数值源：`src/lib/design-tokens/case.css`。
- 模块与接口：`src/app/components/case-kit/CaseKit.tsx`。
- 模块样式：`src/app/components/case-kit/case-kit.module.css`。
- 叙事与图纸规则：`src/app/components/case-kit/case-content.css`。
- 案例操作：`CaseButton.tsx`；录屏行为：`CaseViewportVideo.tsx`；交互预览：`CaseInteractivePreview.tsx`。
- 导航与返回复用现有 Case Kit 专用导出，保留历史案例入口和组件兼容性。

新案例不创建独立叙事 token、复制组件样式或更改产品演示自身的视觉系统。共享扩展在 `/projects/case-kit` 展示。

## 采购案例发布

`/projects/procurement-agent-kit` 复用 Case Kit 外壳、专用导航与返回、Hero、Chapter、Prose、EvidenceCards、Figure、Video、Pullquote、Close 和 CaseButton；不新增案例专属 token 或样式。素材由已有采购演示截图及已发布的 ERP 采购单视频、收货截图组成。布局允许该新路由使用共享全宽案例外壳。

采购案例使用 2 倍像素无损截图，保持 ERP 导航收起，图片跳过二次有损压缩。CaseFigure 外框承担单层统一描边，内部媒体按钮不重复绘制边框。共享 CaseDemoPreview 用 --case-demo-viewport-* token 展示完整桌面界面，左下角共享主按钮进入全屏。

Demo 全屏入口和退出入口统一使用左下角共享 icon 按钮，data-tone="dark" 消费主按钮背景及白色图标 token，不展示文字主按钮。

## MemQ 封面强调色

MemQ 的 `coverAccent` 使用项目设计系统主色 `#1A8A72`。封面 hover 与键盘焦点的浅色背景、光晕及装饰继续由共享 WorkProjectRows 的 `--cover-accent` 派生，不新增项目专属样式；首页与全部作品页一致。

## 首页定位更新

首页继续使用用户已确认的定制视觉，不把案例 token 规则扩大成首页重设计。定位文案复用现有标题、正文、眉题和网格样式，不新增色板、字体、卡片系统或 token。首屏去掉固定 `100vh` 高度，依靠 `.mei-section-screen` 的 `min-height: 100svh`，小屏文字较长时自然撑高、不被裁切。页面 title 和 description 同步为 AI-native products、Design systems 和数据驱动迭代的定位。

## Token 归并与参照页（2026-11-25）

`src/lib/design-tokens/case.css` 是全站外壳唯一的数值来源：案例页、首页、Playground 和页头页脚都读它。`--river-*` 只是指向 `--case-*` 的别名，`--mei-*`、未使用的 Mono 深色主题、`.cn-scope` 样式和 MeiNunito 字体已删除。产品演示（`.cn-demo-scope`、`_jn` 等）保留各自体系。参照页 `/design-system`（noindex，站内无链接）在构建时读取样式表，列出 token、组件和仍手写的值；新增样式先查该页。

## 间距与圆角（2026-11-25，取代下方“间距”一节的档位）

间距 6 档：`--case-space-4 / 8 / 16 / 24 / 32 / 64`，节奏值只留 `--case-space-stack`（区块之间）和 `--case-space-chapter`（章节之间）。圆角 4 个：`--case-radius-none`（直角，主按钮与首页卡片）、`--case-radius-sm`（8px）、`--case-radius-lg`（16px）、`--case-radius-full`；圆形用 50%。其余按用途命名的间距与圆角别名已删除。

## 颜色与字号（2026-11-25）

颜色只有 10 个：`--case-white / paper / surface / line / faded / muted / copy / ink`，以及仅供流程图的 `--case-flow-break / flow-link`（产品案例可在局部用品牌色覆盖这两项）。字号只有一套：`--case-text-12 / 14 / 16 / 18 / 24 / 36 / 56`，外加首页大标题的流式 `--case-text-display`。按用途命名的颜色与字号别名、未使用的深色反相调色板已删除；本文较早章节提到的 `--case-type-*`、`--case-copy-*` 等旧名以本节为准。

## 间距（2026-11-25）

间距只有 8 档：`--case-space-4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`。旧档位并入方式：2→4、6→8、10→12、14/18/20→16、22/28→24、36/40→32、56→48。图标尺寸是尺寸值，不走间距档。章节节奏继续用 `--case-space-chapter`、`stack`、`glance`、`page-*` 等语义 token。

## 字体（2026-11-25）

外壳只用三种字体：标题 Oswald、正文 Geist、标签与代码 IBM Plex Mono（`--case-font-heading`、`--case-font-body`、`--case-font-code`），统一在 `src/app/fonts/index.ts` 加载。Nunito、Geist Mono、DM Mono 已移除。Inter 只供 ConnectNova 与 JobNova 产品演示使用，不预加载；演示内的简历衬线体和产品插画字体属于产品本身。

## 页面清理（2026-11-25）

站内只保留访客能到达的页面，以及 `/projects/connectnova-kit`（首页不展示，网址可单独发送）和样式参照页 `/projects/case-kit`。`/works`、旧版首页、占位页与 Beikemama、CrackInterview、客服系统、Milano Partecipa、Clarity、两篇核桃研究页已删除，旧网址在 `next.config.ts` 中跳转首页。旧页专用的导航、Hero、TypeScript 字体与圆角 token（`typography.ts`、`radius.ts`）和全局兼容样式一并删除；案例页导航只用 `case-kit/CaseKitControls.tsx`，token 唯一来源仍是 `case.css`。下文提到 `/works` 与旧路由保留的记录以本节为准。

## Device previews

The DEF ERP case places all eight mini-program screens inside the WeChat storefront and builder subsection, before the existing builder video. Each item uses CaseFigure and the shared CaseDevicePreview module. The device width and aspect ratio come from --case-device-preview-width and --case-device-preview-ratio in case.css; surrounding gutters and captions use existing Case Kit tokens. Product chrome and internal UI remain isolated inside local HTML frames exported from DEF, including the latest product, account, quantity stepper, and icon styles. Case Kit demonstrates the same shared module.
