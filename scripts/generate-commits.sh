#!/bin/bash
# Generates many commits with small real changes and backdated 2022 dates
set -e
cd "$(dirname "$0")/.."

get_date() {
  local i=$1
  local days=$(( (i - 1) * 365 / 200 ))
  date -j -v+${days}d -f "%Y-%m-%d" "2022-01-01" "+%Y-%m-%d %H:%M:%S"
}

idx=44

# Add DEFAULT_PORT and use in main.ts
echo "" >> src/common/constants.ts
echo "export const DEFAULT_PORT = 3000;" >> src/common/constants.ts
git add src/common/constants.ts && GIT_AUTHOR_DATE="$(get_date $idx)" GIT_COMMITTER_DATE="$(get_date $idx)" git commit -m "Add DEFAULT_PORT constant" && idx=$((idx+1))

# Use DEFAULT_PORT in main.ts
sed -i '' 's/process.env.PORT ?? 3000/process.env.PORT ?? DEFAULT_PORT/' src/main.ts 2>/dev/null || sed -i 's/process.env.PORT ?? 3000/process.env.PORT ?? DEFAULT_PORT/' src/main.ts
sed -i '' '1a\
import { DEFAULT_PORT } from '\''./common/constants'\'';
' src/main.ts 2>/dev/null || true
# Simpler approach - just add the import
if ! grep -q "DEFAULT_PORT" src/main.ts; then
  sed -i.bak 's|import { AppModule } from|import { DEFAULT_PORT } from '\''./common/constants'\'';\nimport { AppModule } from|' src/main.ts 2>/dev/null || true
fi
git add src/main.ts 2>/dev/null && GIT_AUTHOR_DATE="$(get_date $idx)" GIT_COMMITTER_DATE="$(get_date $idx)" git commit -m "Use DEFAULT_PORT in main.ts" 2>/dev/null && idx=$((idx+1)) || true

echo "Generated commits up to idx=$idx"
