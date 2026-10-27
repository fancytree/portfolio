# UX：案例阅读与内容组织


## Mono 叙事页

`/projects/mono` 使用 My role、Design direction、Agent workflow、UI contract、Human handoff、Exploration outcomes、Reflection 七章。主叙事是用户意图如何进入 LangChain 路由、由产品代码分派到任务链或业务服务、缺信息时如何追问、结构化输出如何映射为 UI，以及用户确认何时允许写入。用户最新要求不逐项介绍功能，因此移除记账、记录、预算三张功能截图及相应说明，也不再展示组件功能目录；保留开场整体录屏作为运行证据。

Agent workflow 使用共享 `CaseWorkflow` 的三个阶段切换：Intent routing、Execute & clarify、UI composition。每次只强调对应节点与连线，不移动或隐藏其余流程；阶段说明通过 polite live region 更新，按钮提供 pressed 状态，支持键盘原生 Tab／Enter／Space 操作。手机按钮自然换行，宽图仍在自身容器滚动。Human handoff 保持独立的确认／保存图。

两张流程图由 `MonoWorkflowDiagrams.tsx` 提供：第一张概括结构化 UI 主路径与追问回路，并注明纯文本回复跳过 UI composition；第二张只解释交易创建/编辑的确认与保存，不将查询或删除动作误画成同一保存闸门。LangChain 承担路由和部分任务链，产品代码承担 dispatcher、服务调用、响应检查和渲染，不声称是自主多 Agent 或 LangGraph 工作流。固定 960px 画布在手机上使用共享可聚焦的 `.case-diagram-scroll` 局部滚动，不缩小标签或撑开整页。

用户确认产品已上线，但本篇以独立设计探索为主：上线只放元信息，结果按交互词汇、可执行的设计系统和生成边界组织，不以用户规模、增长或商业指标评价探索。后续问题围绕组件词汇如何扩展、何时追问与何时回退。线上入口说明需要登录，本页录屏和流程图无需账号即可阅读。

## ConnectNova 新叙事草稿

`/projects/connectnova-kit` 独立于旧案例，作品集首页及 Work 列表入口现指向新页，旧页保留。九章依次为 My role、Reframe the brief、Capture in context、Design the evaluation、Compare in one place、Continue into outreach、System & delivery、Results & evidence、Reflection。主线是 Founding Designer 如何把一次性排名需求改成 Project 模型，并组织评估、比较与后续动作；和 Jobnova 的授权/执行主线区分重点。

使用共享图标卡表达 Project 信息关系，采集三步截图在手机单列、768px 起三列；AI 标准预览与三种权重编辑方案分别展示，明确探索稿中的超总量状态仍需补最终校验行为。既有录屏选取 85–145 秒，标注 Version 1 并保留原音轨，进入视口后静音自动播放；原生控件支持暂停、拖动进度和音量开关，用户暂停或开启声音后保留其选择。Outreach 使用架构稿及直接嵌入的本地 Sequence 演示，初始展示 Workflow example；宽架构图复用共享 960px 绘图最小宽度，在可聚焦的局部区域横向滚动，不撑开整页。演示使用共享 canvas 视口，保留产品自身的导航和操作，不跳转新页面、不显示无对应行为的关闭按钮，不加 View full size 按钮。

用户本轮确认采集、Project、AI 评估、Outreach 和 Sequence 均已上线；旧稿四组百分比来源待核对，新页全部留位、不显示。研究原件、最终权重校验、QA 和结果证据在页内标识，详细补充清单位于 `docs/case-studies/connectnova-kit-evidence.md`。界面计数、模拟执行和排名分数不作为业务成效。页面为 noindex 草稿，文末使用自动唯一 CaseEnd。

## JobNova 新叙事草稿

`/projects/jobnova-kit` 独立于现有 Jobnova 案例，原页面保留，作品集首页及 Work 列表入口现指向新页。新页使用 My role、Research & reframing、Workflow strategy、Explain the fit、Review the changes、Govern the action、Follow the outcome、System & delivery、Results、Reflection 十章。参考 DEF ERP 的证据阅读节奏，按求职 Agent 的解释、审核、授权、反馈组织主线。个人身份为用户确认的 Founding Designer；不将模型架构和后端实现归于本人。

共享图标卡说明职责和人机分工，匹配、简历审核、权限设置、申请跟踪、设计系统截图及两段既有录屏支持决策。录屏为演示，界面示例计数不充当成果。截图直接展示并保留图注，不提供 View full size 入口；视频进入视口后播放、离开后暂停。四项工作流和待补结果卡使用共享 `CaseEvidenceCards layout="pairs"`，768px 起两列，手机一列。

用户授权暂用旧报告数字，稍后与开发核对。1,240 注册用户和 8,700+ 完成申请标为历史总量；263 新用户、179 完成设置、51 开启 Auto Apply 属于旧报告中的 30 天 cohort，结果沿用同一定义的 68.06% 和 19.39%。不将上线 cohort 当成改版前基线，不混合总量与 cohort 分母，不把采用率或执行成功率解释成信任，不声称设计造成净增长。报告日期和当前值待刷新。研究原件、QA 实例和当前增长/留存等缺口在页内留位，完整填写表位于 `docs/case-studies/jobnova-kit-evidence.md`。新页标为草稿并设置 noindex。

## 发布入口与阅读规则

首页和 `/works` 复用 `src/lib/work-projects.ts`，JobNova 与 ConnectNova 分别指向 `/projects/jobnova-kit`、`/projects/connectnova-kit`。旧路由保留。章节导航、手机返回和文末唯一 CaseEnd 继续使用现有共享入口；截图、图注与视频复用 Case Kit 阅读宽度和响应式字号。

## 采购案例发布入口

首页及 `/works` 的 Procurement Agent 指向 `/projects/procurement-agent-kit`；旧 `/projects/procurement-agent-v2` 保留。新页按 My role、Research、The foundation、Agent strategy、The experience、Validation、Results、Reflection 八章组织。职责、可复算推荐、人机分工、供应商确认差异、审批交接和收货核对由现有截图与视频支持；用户已确认 Agent 上线并由采购员使用，演示中的数量和价格不作为成效指标。开场和方案末尾复用现有采购演示入口，文末由 CaseKitSections 自动添加唯一 CaseEnd。

采购 Agent 的 The experience 首小节前提供完整 Demo 预览，点击进入全屏，退出回到原处。Demo 保留 Introduction、采购单列表、计划、审批、收货与复盘的步骤引导。Procurement Agent 在全部作品列表置顶，封面采用机会发现小节的采购列表截图。

采购体验说明移除阶段快捷导航、Compact view、重复的 12×6 交叉矩阵与末尾 Demo 按钮，保留各切面界面与说明。开场 Demo 入口复用本页全屏预览；左上关闭、左下收起图标与 Esc 支持退出并回到原处。

## 首页案例可见性

首页不展示 Beikemama 和核桃编程用户研究案例（Walnut Coding: From Trial to Trust）。仅从首页精选列表移除；`/works` 的作品分组和案例路由保留。

## MemQ 作品入口

首页 Experiments 和全部作品页中的 MemQ 均直接打开 App Store：https://apps.apple.com/us/app/memq-smart-quiz-memory/id6757248312。继续沿用外链新标签页行为，不先进入官网或案例页。

## Mono 首页分组

Mono 仅在首页 Experiments 中展示，不再重复进入上方 Work 列表。`/works` 的完整作品入口保留。
