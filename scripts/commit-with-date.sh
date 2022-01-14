#!/bin/bash
# Helper to create commits with backdated author/committer dates
# Usage: ./scripts/commit-with-date.sh "YYYY-MM-DD HH:MM" "commit message"

DATE="$1"
MSG="$2"
if [ -z "$DATE" ] || [ -z "$MSG" ]; then
  echo "Usage: $0 'YYYY-MM-DD HH:MM' 'commit message'"
  exit 1
fi
export GIT_AUTHOR_DATE="$DATE"
export GIT_COMMITTER_DATE="$DATE"
git add -A
git commit -m "$MSG"
