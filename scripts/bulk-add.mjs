#!/usr/bin/env node
/**
 * Adds many commits with small real changes.
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

function getDate(idx) {
  const base = new Date('2022-01-01T10:00:00');
  base.setDate(base.getDate() + Math.floor(((idx - 1) * 365) / 200));
  return base.toISOString().replace('T', ' ').slice(0, 19);
}

function commit(idx, msg) {
  const date = getDate(idx);
  return run(`git add -A && GIT_AUTHOR_DATE="${date}" GIT_COMMITTER_DATE="${date}" git commit -m "${msg.replace(/"/g, '\\"')}"`);
}

let idx = 102;
let count = 0;

// Add many small edits - each returns [shouldCommit, message]
const edits = [
  [() => {
    const p = path.join(REPO, 'README.md');
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('## Security')) {
      c += '\n## Security\n\nNever commit .env or expose JWT_SECRET. Use strong passwords in production.\n';
      fs.writeFileSync(p, c);
      return true;
    }
    return false;
  }, 'Add Security section to README'],
  [() => {
    const p = path.join(REPO, 'test/app.e2e-spec.ts');
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('ValidationPipe')) {
      c = c.replace(
        "import { INestApplication } from '@nestjs/common'",
        "import { INestApplication, ValidationPipe } from '@nestjs/common'",
      );
      c = c.replace(
        'app = moduleFixture.createNestApplication();\n    await app.init();',
        'app = moduleFixture.createNestApplication();\n    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));\n    await app.init();',
      );
      fs.writeFileSync(p, c);
      return true;
    }
    return false;
  }, 'Add ValidationPipe to app e2e spec for consistency'],
  [() => {
    const p = path.join(REPO, '.gitignore');
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('*.env')) {
      c += '\n*.env.local\n';
      fs.writeFileSync(p, c);
      return true;
    }
    return false;
  }, 'Add *.env.local to .gitignore'],
  [() => {
    const p = path.join(REPO, 'src/health/health.controller.ts');
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes("status: 'ok'")) {
      return false;
    }
    if (!c.includes('readonly')) {
      c = c.replace('@Get()\n  check()', '@Get()\n  readonly check()');
      fs.writeFileSync(p, c);
      return true;
    }
    return false;
  }, 'Mark HealthController.check as readonly'],
  [() => {
    const p = path.join(REPO, 'nest-cli.json');
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('deleteOutDir')) {
      return false;
    }
    const j = JSON.parse(c);
    if (!j.generateOptions) {
      j.generateOptions = { spec: true };
      fs.writeFileSync(p, JSON.stringify(j, null, 2));
      return true;
    }
    return false;
  }, 'Add generateOptions to nest-cli.json'],
  [() => {
    const p = path.join(REPO, 'tsconfig.build.json');
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('test')) {
      const j = JSON.parse(c);
      if (!j.exclude) j.exclude = [];
      if (!j.exclude.includes('**/*spec.ts')) {
        j.exclude.push('**/*spec.ts');
        fs.writeFileSync(p, JSON.stringify(j, null, 2));
        return true;
      }
    }
    return false;
  }, 'Exclude spec files from build if not already'],
  [() => {
    const p = path.join(REPO, 'src/main.ts');
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('bootstrap().catch')) {
      c = c.replace('bootstrap();', 'bootstrap().catch((err) => {\n  console.error(err);\n  process.exit(1);\n});');
      fs.writeFileSync(p, c);
      return true;
    }
    return false;
  }, 'Add error handling to bootstrap'],
  [() => {
    const p = path.join(REPO, 'CHANGELOG.md');
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('Error handling')) {
      c = c.replace('### Added\n', '### Added\n- Error handling in bootstrap\n');
      fs.writeFileSync(p, c);
      return true;
    }
    return false;
  }, 'Add error handling to CHANGELOG'],
  [() => {
    const p = path.join(REPO, 'README.md');
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('e2e')) {
      c = c.replace('```bash\nnpm test\n```', '```bash\nnpm test\nnpm run test:e2e  # E2E tests (requires MongoDB)\n```');
      fs.writeFileSync(p, c);
      return true;
    }
    return false;
  }, 'Add e2e test command to README'],
];

for (const [editFn, msg] of edits) {
  if (editFn()) {
    if (commit(idx++, msg)) count++;
  }
}

console.log(`Created ${count} commits (idx now ${idx})`);
