# UX：案例阅读与内容组织


## 页面清理（2026-11-25）

`/works` 和不再展示的二级页面已删除，旧网址跳转首页；ConnectNova 案例页保留，但首页不展示。下文关于 `/works`、旧案例路由保留的描述已失效。

## Mono 叙事页

`/projects/mono` 使用 My role、Design direction、Agent workflow、UI contract、Human handoff、Exploration outcomes、Reflection 七章。主叙事是用户意图如何进入 LangChain 路由、由产品代码分派到任务链或业务服务、缺信息时如何追问、结构化输出如何映射为 UI，以及用户确认何时允许写入。用户最新要求不逐项介绍功能，因此移除记账、记录、预算三张功能截图及相应说明，也不再展示组件功能目录；保留开场整体录屏作为运行证据。

Agent workflow 使用共享 `CaseWorkflow` 的三个阶段切换：Intent routing、Execute & clarify、UI composition。每次只强调对应节点与连线，不移动或隐藏其余流程；阶段说明通过 polite live region 更新，按钮提供 pressed 状态，支持键盘原生 Tab／Enter／Space 操作。手机按钮自然换行，宽图仍在自身容器滚动。Human handoff 保持独立的确认／保存图。

两张流程图由 `MonoWorkflowDiagrams.tsx` 提供：第一张概括结构化 UI 主路径与追问回路，并注明纯文本回复跳过 UI composition；第二张只解释交易创建/编辑的确认与保存，不将查询或删除动作误画成同一保存闸门。LangChain 承担路由和部分任务链，产品代码承担 dispatcher、服务调用、响应检查和渲染，不声称是自主多 Agent 或 LangGraph 工作流。固定 960px 画布在手机上使用共享可聚焦的 `.case-diagram-scroll` 局部滚动，不缩小标签或撑开整页。

用户确认产品已上线，但本篇以独立设计探索为主：上线只放元信息，结果按交互词汇、可执行的设计系统和生成边界组织，不以用户规模、增长或商业指标评价探索。后续问题围绕组件词汇如何扩展、何时追问与何时回退。线上入口说明需要登录，本页录屏和流程图无需账号即可阅读。

## ConnectNova 新叙事草稿

`/projects/connectnova-kit` 独立于旧案例，作品集首页及 Work 列表入口现指向新页，旧页保留。九章依次为 My role、Reframe the brief、Capture in context、Design the evaluation、Compare in one place、Continue into outreach、System & delivery、Results & evidence、Reflection。主线是 Founding Designer 如何把一次性排名需求改成 Project 模型，并组织评估、比较与后续动作；和 Jobnova 的授权/执行主线区分重点。

使用共享图标卡表达 Project 信息关系，采集三步截图在手机单列、768px 起三列；AI 标准预览与三种权重编辑方案分别展示，明确探索稿中的超总量状态仍需补最终校验行为。既有录屏选取 85–145 秒，标注 Version 1 并保留原音轨，进入视口后静音自动播放；原生控件支持暂停、拖动进度和音量开关，用户暂停或开启声音后保留其选择。Outreach 使用架构稿及直接嵌入的本地 Sequence 演示，初始展示 Workflow example；宽架构图复用共享 960px 绘图最小宽度，在可聚焦的局部区域横向滚动，不撑开整页。演示使用共享 canvas 视口，保留产品自身的导航和操作，不跳转新页面、不显示无对应行为的关闭按钮，不加 View full size 按钮。

用户本轮确认采集、Project、AI 评估、Outreach 和 Sequence 均已上线；旧稿四组百分比来源待核对，新页全部留位、不显示。研究原件、最终权重校验、QA 和结果证据在页内标识，详细补充清单位于 `docs/case-studies/connectnova-kit-evidence.md`。界面计数、模拟执行和排名分数不作为业务成效。页面为 noindex 草稿，文末使用自动唯一 CaseEnd。

## JobNova 案例

`/projects/jobnova-kit` 是作品集首页及 Work 列表的 JobNova 入口。2026-11-19 改为设计迭代叙事，九章：01 Context、02 The first version、03 What we learned、04 Resume review: V1、05 Resume review: V2、06 Tracking: V1、07 Tracking: V2、08 Results、09 Next。主线是“上线 → 数据与反馈 → 在两个模块上迭代 → 结果 → 下一轮”，不用 Redesign 一词，统一叫 V1/V2、Iterated。03 章点明平台模块很多，只跟踪流失最多的两个。01 章用动态双泳道流程图（`JobnovaFlow.tsx`）讲产品怎么运作：上排 JobNova 的四步，下排每步里用户的控制点，进入视口才播放，悬停暂停，减少动态时直接显示完成态。02 章讲第一版（`JobnovaFirstVersion.tsx`）：五步设计流程（调研、结构、规则、系统、测试，各写产出），加一张架构图：共享资料（Profile、基础简历、Job preference）下接匹配、简历定制、Auto Apply 规则、追踪四个模块，配第一版截图和各模块的页面组成，迭代的两个模块标 Iterated in 04–05 / 06–07 并写明卡点。03 章用 `JobnovaCharts.tsx` 的 CompareBars（打开 Editor 17%、下载 58%）和 ShareGrid（~40k 申请中 4.1% 收到面试邀请）。04、06 章是 V1 问题章：`JobnovaAnnotated.tsx` 在 V1 截图上放编号标注点（悬停与右侧说明互相高亮，标注点避开所指文字），标注只描述界面；用户原话转述放在 Heard 里，06 章再加每日查看 1–3 次和两类失败原因；章末一句 Goal for V2。05、07 章是 V2：V1/V2 对比滑块 → 三张设计决定 → 可操作演示，05 章末 CompareBars 给出下载率 V1 58% → V2 74%（上线 40+ 天，截至 2026 年 6 月）。08 章汇总结果并注明追踪 V2 已上线、尚未测量；09 章写下一步测量什么和三条可带走的原则。图表配色经 dataviz 校验：灰 #8c8e99 为 V1，深明黄 #5f9a00 为 V2，数值直接标在条旁。证据只用用户提供的反馈与数据；失败主因是缺用户才能填的信息和人机验证，需用户处理的事项有邮件提醒。旧报告的 88.21% 成功率未经确认，不使用。个人身份为 Founding Designer；不将模型架构和后端实现归于本人。

两段 V2 各按「V1/V2 对比滑块 → 三张设计决定 → 可操作演示」排列；决定从求职者角度写，每张带 Evidence（上述反馈与数据）和 Cost，文案在 `jobnova-kit/iteration.ts`，复用采购案例的 DecisionCards 与 DEF 的 BeforeAfterSlider。原型的失败原因已对齐真实情况（人机验证、缺少薪资/到岗时间等信息），JobNova 仓库与 `_jn` 副本同步。截图取自 JobNova 原型仓库的 v2 路由（`/jobs/detail-v2`、`/jobs/auto-apply-v2`），位于 `public/img/jobnova/v2`、`public/videos/jobnova/v2`。05 章的简历演示不再是录屏，而是可操作的自动导航演示：`/demos/jobnova-resume` 是从 JobNova 原型复制过来的协作编辑器（裸舞台），由 DEF 案例的 LiveShowcase 驱动四段脚本（改写、选中后让 Nova 改、补关键词、像文档一样编辑），指针进入即交给访客。决定卡用 `JobnovaDecisions` 换成 JobNova 的黑与明黄；Pipeline 的原型录屏也换成自动导航演示：`/demos/jobnova-pipeline` 把 JobNova 原型的 `/jobs/auto-apply-v2` 连同依赖复制进私有目录 `_jn`（图片改到 `public/demos/jobnova/img`，原仓库不动），五段脚本：概览、Pipeline、进行中、修复失败、日历。评分圆环的起始分数颜色改回原版抽屉的琥珀色 #fbbf24，句中「5.2 / 7.7」用圆环同色底标出。

旧报告的 cohort 数字（1,240 注册、68.06%、19.39% 等）不再出现在页内，旧十章版本的证据表仍在 `docs/case-studies/jobnova-kit-evidence.md`。不把采用率解释成信任，也不声称设计造成净增长。页面仍设置 noindex。

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

## MemQ 封面反馈

MemQ 卡片 hover 和键盘焦点使用品牌青绿色反馈，默认封面布局与 App Store 跳转保持现有行为。

## 首页求职定位

首屏标题仍是一句话（2026-11-04 按简历优化，保留 “Beyond screens” 开头）：“Beyond screens, I design products people can understand and trust, from AI tools to business software, and build the systems behind them”（不绑定 AI agent：用户同时在投非 agent 岗位），标签 UX／Product strategy／Systems thinking，手机和桌面同一套，不加经历说明段落。其余首页文案与 2026-10-27 确认的简历一致，不再出现 7+ 年。精选区标题为 Selected work，顺序保持 Procurement Agent、DEF Beauty ERP、JobNova、ConnectNova。四张卡片的摘要和标签只写已有交付或决策，由 `src/lib/work-projects.ts` 同时供首页和 `/works` 使用。

Strategy 按方法组织，不是按流程：五块仍是研究、工作流与人机职责、设计系统、原型验证和上线数据，但每块写成「方法名 + 它定下什么决定（等宽一行）+ 具名项目」，并列排版、无编号无连线，不暗示先后顺序。新增 Journey and service mapping 一块。每块下方挂 1–3 件真实方法产出，统一 16:10 白底框 + 等宽图注，图注注明物料类型和出处项目：访谈手记与亲和图、用户旅程图与 Clarity／Milano Partecipa 服务蓝图、Mono 的人机确认边界图与客服系统跨角色泳道图、JobNova 与 DEF ERP 的设计系统基础。缩略图由 scripts 之外的一次性处理生成于 public/img/strategy/method，服务蓝图直接使用原 SVG。Prototyping 用 CrackInterview 线框流程图和 Clarity 的现场可用性测试照片。Behavioral evidence 不配图：Milano Partecipa 的热力图与该块正文讲的 PostHog 证据不是同一个项目，已按用户要求移除，待补 PostHog 自身截图。Beikemama 的 Hi-Fi 原型不使用，保持首页不出现该案例。PostHog 只写 funnel、heatmap、session recording 和 JobNova 的单次 onboarding A/B test，不声称持续实验或统计显著。工具图标不包含 Storybook。About 只列 Liba、核桃、搜狐三段正式经历，Liba 写明 Design Lab 和两位实习生各六个月的指导；MemQ、Mono 作为自发项目只出现在 Experiments，不以 River Studio 任职的形式出现。

导航和页脚的 Resume 指向 `/MeiChai_Product_Designer_Resume.pdf`，文件内容为最新确认版。同页锚点按布局偏移（`offsetTop`）计算落点，避免章节入场 transform 让标题停在固定导航后面。

## Scrollable mini-program evidence

The WeChat storefront and builder subsection in /projects/def-erp-kit includes Home, Catalog, Product, Cart, Sign in, Account, Link account, and Order details. Each screen scrolls independently within a fixed device shell: system chrome, page header and applicable bottom tabs stay visible. Home retains a fixed support entry. Product action bars remain inside their own screen. All data and media are served locally and interactions remain read-only; no customer or ERP API is contacted. Screen names and captions remain outside the demo in Case Kit styling. Keyboard users can focus each titled frame and scroll its contents. The existing builder video remains after the screen gallery.

## Team HQ 作品入口

Team HQ 在首页 Experiments 中展示（与 Mono、MemQ、SenseFlow 同组），无案例页，卡片直接打开 `/demos/team-hq/index.html`。进入后先创建主角（名字、外观），选择保存在浏览器 `localStorage`（键 `teamhq.profile.v1`），再次进入显示 Welcome back。点击进入后才加载 Three.js 和场景，并显示加载动画。

## Milan Site Selection 作品入口

Milan Site Selection（原名 Milan Café Map）在首页 Experiments 中展示（与 Mono、MemQ、SenseFlow、Team HQ 同组），无案例页，卡片直接打开 `/demos/milan-cafe-map/index.html`（单文件 MapLibre 应用，数据为同目录的 `milan-*.json`）。功能：选址评分（面向新店选址，目前先开放咖啡店类别）（居民密度、竞争、地铁与人流、租金）、前 10 名推荐、街区 / 多边形 / 圆形范围统计、地标卡片。配色为报纸风格（米黄纸色 + 墨黑）。地图底图来自 OpenFreeMap，地标照片运行时取自英文维基百科（需联网），数据来自米兰市开放数据与 OpenStreetMap。
