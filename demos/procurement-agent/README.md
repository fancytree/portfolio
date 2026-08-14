# Procurement Agent — Portfolio Demo (standalone)

独立 Vite + React 包，从 `def-platform/web` 同步源码与样式，用于个人作品集。

## 效果一致性

- **同源同步**：Demo 页面 + shadcn UI + `index.css` 直接从 DEF 前端拷贝
- **无后端**：纯前端脚本 Demo，不依赖 Supabase / 登录
- 个人站集成后，视觉与交互应与  
  `https://your-def-host/portfolio/procurement-agent` **基本一致**  
  （字体 CDN/本地、浏览器缩放除外）

## 快速开始

```bash
# 在本目录
npm run sync          # 从 ../web 再同步一次（改了 Demo 后跑）
npm install
npm run dev           # http://localhost:5174
npm run build         # 产出 dist/，可静态托管
```

## 已集成到本仓库（当前做法）

本目录就在个人站仓库里，构建产物直接输出到 `public/demos/procurement-agent/`，
由 Next.js 作为静态资源托管，案例页用 iframe 嵌入。

```bash
npm --prefix demos/procurement-agent install   # 首次
npm --prefix demos/procurement-agent run build # 改完 demo 后重新构建
```

- 构建输出：`public/demos/procurement-agent/`（**需要提交**，Vercel 只构建 Next 应用）
- 嵌入地址：`/demos/procurement-agent/index.html`
  （末尾的 `index.html` 不能省略：Next 会把 `/demos/procurement-agent/` 308 重定向到无斜杠路径并 404）
- 案例页组件：`src/app/projects/procurement-agent/ProcurementDemoEmbed.tsx`
  —— 滚动驱动的放大动效，静止时等于内容列宽，滚到中段铺满视口（顶部给站点导航留出空间）
- 手机端不嵌 iframe，改为展示静态图 + 新窗口打开链接

## 放到个人站

### 方式 A — 子应用 / 子目录（推荐）

1. 把整个 `portfolio-procurement-agent` 文件夹拷到个人站仓库（或 git submodule）
2. `npm install && npm run build`
3. 把 `dist/` 部署到例如 `/demos/procurement-agent/`
4. 作品集页链到该地址，或 iframe：

```html
<iframe
  src="/demos/procurement-agent/"
  title="Procurement Agent Demo"
  style="width:100%;height:900px;border:0;border-radius:16px"
></iframe>
```

若部署在子路径，在 `vite.config.ts` 设置：

```ts
export default defineConfig({
  base: '/demos/procurement-agent/',
  // ...
})
```

### 方式 B — 嵌进现有 Vite 应用

1. 将 `src/pages/portfolio`、`src/components`、`src/lib` 需要的文件合并进个人站（保持 `@/` 别名）
2. 合并 `index.css` 中的 token / `.def-data-table` 等，或直接 `@import` 本包的 `src/index.css`
3. 路由挂载：

```tsx
import ProcurementAgentPortfolio from '@/pages/portfolio/procurement-agent/ProcurementAgentPortfolio';
// <Route path="/work/procurement-agent" element={<ProcurementAgentPortfolio />} />
```

## 从 DEF 更新

在 `def-platform` 里改完 Demo 后：

```bash
cd portfolio-procurement-agent
npm run sync
npm run build
```

再把更新后的文件夹或 `dist/` 同步到个人站。

## 目录说明

| 路径 | 说明 |
|------|------|
| `src/App.tsx` / `main.tsx` | 本包入口（sync 不会覆盖） |
| `src/pages/portfolio/...` | Demo（sync 覆盖） |
| `src/components` / `src/lib` | 必要依赖（sync 覆盖） |
| `src/index.css` | DEF 样式 token + 表格（sync 覆盖） |
| `scripts/sync-from-def.sh` | 从 `../web` 同步 |

## 作品集文案建议

- **Title:** Procurement Agent — Human-in-the-loop buying workflow
- **One-liner:** Conversational intake → plan → approve → human-only order → receive → review
- **Note:** Agent analyzes & records; humans place the supplier order
