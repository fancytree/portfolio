#!/usr/bin/env bash
# 从 def-platform/web 同步 Demo 源码与必要 UI/CSS，保证观感一致
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB="$(cd "$ROOT/../web" && pwd)"
SRC="$ROOT/src"

if [[ ! -d "$WEB/src/pages/portfolio/procurement-agent" ]]; then
  echo "ERROR: cannot find $WEB/src/pages/portfolio/procurement-agent" >&2
  exit 1
fi

echo "Syncing from: $WEB"

copy_file() {
  local rel="$1"
  local dest="$SRC/$rel"
  mkdir -p "$(dirname "$dest")"
  cp "$WEB/src/$rel" "$dest"
  echo "  + $rel"
}

copy_dir() {
  local rel="$1"
  local dest="$SRC/$rel"
  rm -rf "$dest"
  mkdir -p "$(dirname "$dest")"
  cp -R "$WEB/src/$rel" "$dest"
  echo "  + $rel/ (dir)"
}

# Demo 本体
copy_dir "pages/portfolio/procurement-agent"

# 依赖的业务 / UI 组件
copy_file "components/SelectField.tsx"
copy_file "components/ui/button.tsx"
copy_file "components/ui/dialog.tsx"
copy_file "components/ui/dropdown-menu.tsx"
copy_file "components/ui/input.tsx"
copy_file "components/ui/label.tsx"
copy_file "components/ui/select.tsx"
copy_file "components/ui/sheet.tsx"
copy_file "components/ui/table.tsx"

# 工具
copy_file "lib/utils.ts"
copy_file "lib/dataListTable.ts"
copy_file "lib/filterBarContext.ts"
copy_file "lib/disableAmountInputWheel.ts"

# 全量样式（表格 sticky / token / 动画），避免视觉漂移
cp "$WEB/src/index.css" "$SRC/index.css"
echo "  + index.css"

# 入口文件由本包维护，勿覆盖
echo "Done. Entry points kept: src/main.tsx src/App.tsx"
