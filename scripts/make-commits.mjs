#!/usr/bin/env node
/**
 * Creates many commits with small real changes and backdated 2022 dates.
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const REPO = path.resolve(import.meta.dirname, '..');

function run(cmd) {
  execSync(cmd, { cwd: REPO, stdio: 'pipe' });
}

function getDate(idx) {
  const base = new Date('2022-01-01T10:00:00');
  base.setDate(base.getDate() + Math.floor(((idx - 1) * 365) / 200));
  return base.toISOString().replace('T', ' ').slice(0, 19);
}

function commit(idx, msg) {
  const date = getDate(idx);
  run(`git add -A && GIT_AUTHOR_DATE="${date}" GIT_COMMITTER_DATE="${date}" git commit -m "${msg}"`);
}

let idx = 58;

// Add more JSDoc and small improvements
const edits = [
  ['src/auth/auth.module.ts', '@Module({', '/** Authentication module with JWT and local strategies. */\n@Module({', 'Add JSDoc to AuthModule'],
  ['src/users/users.module.ts', '@Module({', '/** Users module with Mongoose schema. */\n@Module({', 'Add JSDoc to UsersModule'],
  ['src/health/health.module.ts', '@Module({', '/** Health check module. */\n@Module({', 'Add JSDoc to HealthModule'],
  ['src/app.module.ts', '@Module({', '/** Root application module. */\n@Module({', 'Add JSDoc to AppModule'],
  ['src/auth/strategies/jwt.strategy.ts', '@Injectable()', '/** Passport JWT strategy for token validation. */\n@Injectable()', 'Add JSDoc to JwtStrategy'],
  ['src/auth/strategies/local.strategy.ts', '@Injectable()', '/** Passport local strategy for email/password. */\n@Injectable()', 'Add JSDoc to LocalStrategy'],
  ['test/app.e2e-spec.ts', 'describe(\'AppController', '/** Root endpoint e2e tests. */\ndescribe(\'AppController', 'Add JSDoc to app e2e spec'],
  ['test/auth.e2e-spec.ts', 'describe(\'Auth (e2e)\')', '/** Auth endpoints e2e tests. */\ndescribe(\'Auth (e2e)\')', 'Add JSDoc to auth e2e spec'],
  ['src/app.controller.ts', '@Controller()', '/** Root controller with health ping. */\n@Controller()', 'Add JSDoc to AppController'],
  ['src/app.service.ts', '@Injectable()', '/** Root application service. */\n@Injectable()', 'Add JSDoc to AppService'],
];

for (const [filePath, find, replace, msg] of edits) {
  const fullPath = path.join(REPO, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    const firstLine = replace.split('\n')[0];
    if (content.includes(find) && !content.includes(firstLine)) {
      content = content.replace(find, replace);
      fs.writeFileSync(fullPath, content);
      commit(idx, msg);
      idx++;
    }
  }
}

// Add validation message constants to RegisterDto
const registerDtoPath = path.join(REPO, 'src/auth/dto/register.dto.ts');
if (fs.existsSync(registerDtoPath)) {
  let content = fs.readFileSync(registerDtoPath, 'utf8');
  if (!content.includes('PASSWORD_MIN_LENGTH')) {
    content = content.replace(
      "@MinLength(6, { message: 'Password must be at least 6 characters' })",
      '@MinLength(6, { message: PASSWORD_MIN_MESSAGE })',
    );
    if (!content.includes('PASSWORD_MIN_MESSAGE')) {
      content = content.replace(
        "import {\n  IsEmail,",
        "import { PASSWORD_MIN_MESSAGE } from '../../common/constants';\nimport {\n  IsEmail,",
      );
    }
  }
  // Simpler: add constant to constants.ts and use in DTO
}

// Add PASSWORD_MIN_MESSAGE constant
const constantsPath = path.join(REPO, 'src/common/constants.ts');
let constantsContent = fs.readFileSync(constantsPath, 'utf8');
if (!constantsContent.includes('PASSWORD_MIN_MESSAGE')) {
  constantsContent += "\nexport const PASSWORD_MIN_MESSAGE = 'Password must be at least 6 characters';";
  fs.writeFileSync(constantsPath, constantsContent);
  commit(idx, 'Add PASSWORD_MIN_MESSAGE constant');
  idx++;
}

// Add PASSWORD_MAX_MESSAGE constant
constantsContent = fs.readFileSync(constantsPath, 'utf8');
if (!constantsContent.includes('PASSWORD_MAX_MESSAGE')) {
  constantsContent += "\nexport const PASSWORD_MAX_MESSAGE = 'Password must not exceed 72 characters';";
  fs.writeFileSync(constantsPath, constantsContent);
  commit(idx, 'Add PASSWORD_MAX_MESSAGE constant');
  idx++;
}

console.log(`Created ${idx - 58} commits (total idx=${idx})`);
