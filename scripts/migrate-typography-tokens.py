"""
批量把项目页里的 inline typography 三元组替换为 textStyle 预设。
严格策略：只替换与预设 100% 数值相等的三元组，不改颜色/外边距/字体家族，
保证所有详情页的视觉零变化。
"""
from __future__ import annotations

import re
from pathlib import Path

# 项目详情页根目录
ROOT = Path("src/app/projects")

# 覆盖的页面（jobnova 与 beikemama 已经手工处理过，保险起见再跑一遍幂等）
PAGES = [
    "beikemama/page.tsx",
    "clarity/page.tsx",
    "crackinterview/page.tsx",
    "customer-service-system/page.tsx",
    "milano-partecipa/page.tsx",
    "memq/page.tsx",
    "mono/page.tsx",
    "jobnova/page.tsx",
]

# 精确三元组 → preset。每个条目：(fontSize, lineHeight, fontWeight, preset)
# lineHeight 可能是 "'24px'" 或 "'normal'" 或 "1"；按字符串精确匹配
TRIPLETS = [
    ("'16px'", "'24px'", "400", "textStyle.body"),
    ("'16px'", "'24px'", "300", "textStyle.bodyLight"),
    ("'16px'", "'26px'", "300", "textStyle.bodyReading"),
    ("'14px'", "'20px'", "300", "textStyle.caption"),
    ("'14px'", "'22px'", "400", "textStyle.bodySm"),
    ("'18px'", "'30px'", "300", "textStyle.leadSm"),
    ("'18px'", "'32px'", "300", "textStyle.lead"),
    ("'18px'", "'24px'", "600", "textStyle.h5"),
    ("'40px'", "'52px'", "300", "textStyle.displayXl"),
    ("'28px'", "'36px'", "300", "textStyle.h3"),
    ("'24px'", "'32px'", "500", "textStyle.h3Medium"),
    ("'20px'", "'28px'", "500", "textStyle.h4"),
    ("'30px'", "'38px'", "500", "textStyle.h2"),
    ("'36px'", "'44px'", "500", "textStyle.h1"),
]


def migrate_one(source: str) -> tuple[str, int]:
    """对单个文件内容做替换，返回 (新内容, 替换总次数)"""
    total = 0
    for size, lh, weight, preset in TRIPLETS:
        # 匹配形如：
        #   fontSize: '16px',
        #   lineHeight: '24px',
        #   fontWeight: 400,
        # 允许三行之间的空白不同，但三行必须连续出现（同一个 style 对象内）
        pattern = re.compile(
            rf"(?P<indent>[ \t]+)fontSize:\s*{re.escape(size)},\s*\n"
            rf"[ \t]+lineHeight:\s*{re.escape(lh)},\s*\n"
            rf"[ \t]+fontWeight:\s*{re.escape(weight)},",
        )

        def repl(m: re.Match[str]) -> str:
            nonlocal total
            total += 1
            indent = m.group("indent")
            return f"{indent}...{preset},"

        source = pattern.sub(repl, source)
    return source, total


def main() -> None:
    grand_total = 0
    touched = []
    for rel in PAGES:
        path = ROOT / rel
        if not path.exists():
            print(f"[skip] 找不到：{path}")
            continue
        original = path.read_text(encoding="utf-8")
        migrated, n = migrate_one(original)
        if n > 0 and migrated != original:
            path.write_text(migrated, encoding="utf-8")
            touched.append((rel, n))
            grand_total += n
        print(f"{rel}: 替换 {n} 处")
    print(f"\n合计：{grand_total} 处")


if __name__ == "__main__":
    main()
