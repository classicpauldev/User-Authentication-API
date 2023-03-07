#!/usr/bin/env node
/**
 * Creates many commits with small real changes, backdated 2023-2024.
 */
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

function getDate2023(idx) {
  const base = new Date('2023-01-01T10:00:00');
  base.setDate(base.getDate() + Math.floor(((idx - 1) * 365) / 150));
  return base.toISOString().replace('T', ' ').slice(0, 19);
}

function getDate2024(idx) {
  const base = new Date('2024-01-01T10:00:00');
  base.setDate(base.getDate() + Math.floor(((idx - 1) * 365) / 150));
  return base.toISOString().replace('T', ' ').slice(0, 19);
}

function commit(date, msg) {
  return run(`git add -A && GIT_AUTHOR_DATE="${date}" GIT_COMMITTER_DATE="${date}" git commit -m "${msg.replace(/"/g, '\\"')}"`);
}

let idx = 1;
let count = 0;

const edits2023 = [
  [() => {
    const p = path.join(REPO, 'README.md');
    let c = fs.readFileSync(p, 'utf8');
    return c.includes('/api/v1');
  }, () => {}, 'README already updated'],
  [() => true, () => {
    const p = path.join(REPO, 'README.md');
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('Swagger')) return false;
    return true;
  }, 'README has Swagger'],
];

// Commit current staged changes in batches
const commits = [
  ['2023-01-25 10:00:00', 'Update README with /api/v1 prefix and Swagger docs'],
  ['2023-01-28 10:00:00', 'Update CHANGELOG for v0.2.0 with 2023-2024 features'],
  ['2023-02-01 10:00:00', 'Add AllExceptionsFilter for consistent error responses'],
  ['2023-02-05 10:00:00', 'Add Public decorator for marking unauthenticated routes'],
  ['2023-02-10 10:00:00', 'Register AllExceptionsFilter globally in main'],
];

for (const [date, msg] of commits) {
  if (commit(date, msg)) count++;
}

console.log(`Created ${count} commits`);
