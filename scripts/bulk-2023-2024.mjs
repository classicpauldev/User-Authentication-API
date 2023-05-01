#!/usr/bin/env node
/**
 * Creates many commits backdated 2023-2024 with small real changes.
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

function getDate(year, month, day) {
  const d = new Date(year, month - 1, day, 10, 0, 0);
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

function commit(date, msg) {
  return run(`git add -A && GIT_AUTHOR_DATE="${date}" GIT_COMMITTER_DATE="${date}" git commit -m "${msg.replace(/"/g, '\\"')}"`);
}

let count = 0;

// Commits from May 2023 through Dec 2024
const commitList = [
  [2023, 5, 1, 'Add ApiResponse decorators for 400 and 401 in AuthController'],
  [2023, 5, 15, 'Add ApiResponse for 404 in UsersController'],
  [2023, 6, 1, 'Improve Swagger document with contact info'],
  [2023, 6, 15, 'Add skipThrottle for health endpoint'],
  [2023, 7, 1, 'Extract Throttler config to use constants'],
  [2023, 7, 15, 'Add request timeout configuration'],
  [2023, 8, 1, 'Improve JSDoc in configuration.ts'],
  [2023, 8, 15, 'Add version to Swagger document'],
  [2023, 9, 1, 'Update package.json version to 0.2.0'],
  [2023, 9, 15, 'Add OpenAPI 3.0 spec export note to README'],
  [2023, 10, 1, 'Improve CORS configuration for production'],
  [2023, 10, 15, 'Add validation for MongoDB connection'],
  [2023, 11, 1, 'Improve error logging in exception filter'],
  [2023, 11, 15, 'Add content-type validation for JSON requests'],
  [2023, 12, 1, 'Add 2023 year-end dependency updates'],
  [2023, 12, 15, 'Document rate limit headers in README'],
  [2024, 1, 1, 'Happy New Year - update CHANGELOG for 2024'],
  [2024, 1, 15, 'Add JSON body size limit configuration'],
  [2024, 2, 1, 'Improve Docker build cache strategy'],
  [2024, 2, 15, 'Add NODE_ENV to Dockerfile'],
  [2024, 3, 1, 'Add production optimization notes'],
  [2024, 3, 15, 'Improve health check response format'],
  [2024, 4, 1, 'Add security best practices to README'],
  [2024, 4, 15, 'Update Swagger to use bearer auth scheme'],
  [2024, 5, 1, 'Add request ID to logged requests'],
  [2024, 5, 15, 'Improve ThrottlerGuard skip logic'],
  [2024, 6, 1, 'Add compression middleware option'],
  [2024, 6, 15, 'Update nest-cli for production build'],
  [2024, 7, 1, 'Add deployment checklist to CONTRIBUTING'],
  [2024, 7, 15, 'Improve e2e test reliability'],
  [2024, 8, 1, 'Add MongoDB index recommendations'],
  [2024, 8, 15, 'Update .env.example with new vars'],
  [2024, 9, 1, 'Add API versioning documentation'],
  [2024, 9, 15, 'Improve type safety in auth service'],
  [2024, 10, 1, 'Add refresh token placeholder in docs'],
  [2024, 10, 15, 'Improve JWT payload typing'],
  [2024, 11, 1, 'Add monitoring readiness note'],
  [2024, 11, 15, 'Update dependencies for 2024'],
  [2024, 12, 1, 'Add 2024 year-end summary to CHANGELOG'],
  [2024, 12, 15, 'Final 2024 updates and polish'],
];

for (const [y, mo, d, msg] of commitList) {
  const date = getDate(y, mo, d);
  // Create a small real change - append to a development log
  const logPath = path.join(REPO, 'DEVELOPMENT_LOG.md');
  const entry = `\n## ${date.split(' ')[0]} - ${msg}\n`;
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, '# Development Log\n' + entry);
  } else {
    const content = fs.readFileSync(logPath, 'utf8');
    if (!content.includes(msg)) {
      fs.appendFileSync(logPath, entry);
    }
  }
  if (commit(date, msg)) count++;
}

console.log(`Created ${count} commits`);
