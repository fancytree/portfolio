# UX：案例阅读与内容组织

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
