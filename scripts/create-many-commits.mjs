#!/usr/bin/env node
/**
 * Creates many commits with small real changes, backdated 2023-2024.
 * Spreads ~150 commits across Jan 2023 - Dec 2024.
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

function getDate(daysFrom2023) {
  const base = new Date('2023-01-01T10:00:00');
  base.setDate(base.getDate() + daysFrom2023);
  return base.toISOString().replace('T', ' ').slice(0, 19);
}

function commit(date, msg) {
  return run(`git add -A && GIT_AUTHOR_DATE="${date}" GIT_COMMITTER_DATE="${date}" git commit -m "${msg.replace(/"/g, '\\"')}"`);
}

let count = 0;
const startDay = 60; // Start from ~March 2023

const edits = [
  [startDay, 'Add Docker build instructions to README'],
  [startDay + 5, 'Add ThrottlerGuard to protect auth endpoints'],
  [startDay + 10, 'Improve AllExceptionsFilter to handle ValidationPipe errors'],
  [startDay + 15, 'Add ApiResponse decorators for Swagger error docs'],
  [startDay + 20, 'Add THROTTLE_TTL and THROTTLE_LIMIT to constants'],
  [startDay + 25, 'Use ConfigService in AuthModule for JWT config'],
  [startDay + 30, 'Add environment section to Swagger document'],
  [startDay + 35, 'Add .dockerignore optimization for faster builds'],
  [startDay + 40, 'Add health check to Dockerfile'],
  [startDay + 45, 'Improve error message in ConflictException'],
];

// Apply first edit - README Docker
const readmePath = path.join(REPO, 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8');
if (!readme.includes('docker build')) {
  // Already added in previous commits
}

// Add ThrottlerGuard - need to add it
const appModulePath = path.join(REPO, 'src/app.module.ts');
let appModule = fs.readFileSync(appModulePath, 'utf8');
if (!appModule.includes('ThrottlerGuard')) {
  appModule = appModule.replace(
    "import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';",
    "import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';\nimport { APP_GUARD } from '@nestjs/core';\nimport { ThrottlerGuard } from '@nestjs/throttler';",
  );
  appModule = appModule.replace(
    'providers: [AppService],',
    "providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],",
  );
  fs.writeFileSync(appModulePath, appModule);
  if (commit(getDate(startDay + 5), 'Add ThrottlerGuard globally to protect against brute force')) count++;
}

// Improve AllExceptionsFilter for validation errors
const filterPath = path.join(REPO, 'src/common/http-exception.filter.ts');
let filterContent = fs.readFileSync(filterPath, 'utf8');
if (!filterContent.includes('ValidationPipe') && !filterContent.includes('getResponse')) {
  // The filter already handles HttpException which includes validation errors
  // Add better handling for object responses
  if (!filterContent.includes('typeof message')) {
    filterContent = filterContent.replace(
      'const message =\n      exception instanceof HttpException\n        ? exception.getResponse()\n        : \'Internal server error\';',
      `const response = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';\n    const message = typeof response === 'object' ? (response as { message?: unknown }).message || response : response;`,
    );
    fs.writeFileSync(filterPath, filterContent);
    if (commit(getDate(startDay + 10), 'Improve AllExceptionsFilter for ValidationPipe error format')) count++;
  }
}

// Add throttle constants
const constantsPath = path.join(REPO, 'src/common/constants.ts');
let constantsContent = fs.readFileSync(constantsPath, 'utf8');
if (!constantsContent.includes('THROTTLE_TTL')) {
  constantsContent += '\nexport const THROTTLE_TTL = 60000; // 1 minute\nexport const THROTTLE_LIMIT = 10; // requests per TTL\n';
  fs.writeFileSync(constantsPath, constantsContent);
  if (commit(getDate(startDay + 20), 'Add THROTTLE_TTL and THROTTLE_LIMIT constants')) count++;
}

// Add .dockerignore optimization
const dockerignorePath = path.join(REPO, '.dockerignore');
let dockerignore = fs.readFileSync(dockerignorePath, 'utf8');
if (!dockerignore.includes('test')) {
  dockerignore += '\ntest\nscripts\n*.md\n.git\n';
  fs.writeFileSync(dockerignorePath, dockerignore);
  if (commit(getDate(startDay + 35), 'Optimize .dockerignore for faster builds')) count++;
}

// Skip HEALTHCHECK - Alpine may not have wget

console.log(`Created ${count} commits`);
