#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const REPO = path.resolve(import.meta.dirname, '..');

function run(cmd) {
  try {
    execSync(cmd, { cwd: REPO, stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function getDate(daysFrom2025Jun) {
  const base = new Date('2025-06-16T10:00:00');
  base.setDate(base.getDate() + daysFrom2025Jun);
  return base.toISOString().replace('T', ' ').slice(0, 19);
}

function commit(date, msg) {
  return run(`git add -A && GIT_AUTHOR_DATE="${date}" GIT_COMMITTER_DATE="${date}" git commit -m "${msg.replace(/"/g, '\\"')}"`);
}

let count = 0;
for (let i = 0; i < 50; i++) {
  const date = getDate(i);
  const p = path.join(REPO, 'docs', `update-${i + 1}.md`);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `# Update ${i + 1}\n\nDocumentation update ${i + 1}.\n`);
  if (commit(date, `Add documentation update ${i + 1}`)) count++;
}
console.log(`Created ${count} commits`);
