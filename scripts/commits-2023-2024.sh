#!/bin/bash
# Creates commits with backdated 2023-2024 dates
# Usage: source or run functions, or call commit_with_date <date> <msg>

get_date_2023() {
  local i=$1
  local days=$(( (i - 1) * 365 / 100 ))
  date -j -v+${days}d -f "%Y-%m-%d" "2023-01-01" "+%Y-%m-%d %H:%M:%S"
}

get_date_2024() {
  local i=$1
  local days=$(( (i - 1) * 365 / 100 ))
  date -j -v+${days}d -f "%Y-%m-%d" "2024-01-01" "+%Y-%m-%d %H:%M:%S"
}

commit_with_date() {
  local date="$1"
  local msg="$2"
  git add -A
  GIT_AUTHOR_DATE="$date" GIT_COMMITTER_DATE="$date" git commit -m "$msg"
}
