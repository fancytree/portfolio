# DESIGN：Case Kit 统一视觉规范

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
