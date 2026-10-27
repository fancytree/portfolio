#!/usr/bin/env bash
# Refresh the standalone product demo without overwriting the portfolio narrative.
set -euo pipefail
DEMO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEF_ROOT="${DEF_PLATFORM_ROOT:-/Users/River/Documents/Claude/Projects/DEF/def-platform}"
node "$DEF_ROOT/scripts/export-procurement-agent-portfolio.mjs"
PORTFOLIO_DEMO_ONLY=1 PORTFOLIO_ROOT="$(cd "$DEMO_ROOT/../.." && pwd)" node "$DEF_ROOT/scripts/install-procurement-agent-portfolio.mjs"
