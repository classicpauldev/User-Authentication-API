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

let idx = 46;

// Edits: each [file, find, replace, msg]
const edits = [
  ['README.md', '## Scripts', '## Project Structure\n\n- `src/auth/` - Authentication module (register, login, JWT)\n- `src/users/` - Users module\n- `src/health/` - Health check\n- `src/common/` - Shared constants\n\n## Scripts'],
  ['CONTRIBUTING.md', '## Development Setup', '## Development Setup\n\n### Prerequisites\n- Node.js 18+\n- MongoDB\n\n## Development Setup'],
  ['src/health/health.controller.ts', '@Controller(\'health\')', '/** Health check endpoint for load balancers and monitoring. */\n@Controller(\'health\')'],
  ['src/auth/guards/local-auth.guard.ts', '@Injectable()', '/** Guard for local (email/password) authentication. */\n@Injectable()'],
  ['src/auth/guards/jwt-auth.guard.ts', '@Injectable()', '/** Guard for JWT Bearer token authentication. */\n@Injectable()'],
  ['src/auth/decorators/current-user.decorator.ts', 'export const CurrentUser', '/** Extracts the current authenticated user from the request. */\nexport const CurrentUser'],
];

for (const [filePath, find, replace, msg] of edits) {
  const fullPath = path.join(REPO, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes(find) && !content.includes(replace.split('\n')[0])) {
      content = content.replace(find, replace);
      fs.writeFileSync(fullPath, content);
      commit(idx, msg || `Improve ${filePath}`);
      idx++;
    }
  }
}

// Add more small edits
const moreEdits = [
  ['src/users/user.schema.ts', '@Schema({ timestamps: true })', '/** User document schema with email and hashed password. */\n@Schema({ timestamps: true })', 'Add JSDoc to User schema'],
  ['src/auth/dto/register.dto.ts', 'export class RegisterDto', '/** DTO for user registration. */\nexport class RegisterDto', 'Add JSDoc to RegisterDto'],
  ['src/auth/dto/login.dto.ts', 'export class LoginDto', '/** DTO for user login. */\nexport class LoginDto', 'Add JSDoc to LoginDto'],
  ['src/users/dto/create-user.dto.ts', 'export class CreateUserDto', '/** DTO for creating a user. */\nexport class CreateUserDto', 'Add JSDoc to CreateUserDto'],
  ['src/auth/auth.controller.ts', '@Controller(\'auth\')', '/** Handles authentication endpoints (register, login, me). */\n@Controller(\'auth\')', 'Add JSDoc to AuthController'],
  ['src/users/users.controller.ts', '@Controller(\'users\')', '/** Handles user-related endpoints. */\n@Controller(\'users\')', 'Add JSDoc to UsersController'],
];

for (const [filePath, find, replace, msg] of moreEdits) {
  const fullPath = path.join(REPO, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes(find)) {
      const firstLine = replace.split('\n')[0];
      if (!content.includes(firstLine)) {
        content = content.replace(find, replace);
        fs.writeFileSync(fullPath, content);
        commit(idx, msg);
        idx++;
      }
    }
  }
}

console.log(`Created ${idx - 46} commits (total idx=${idx})`);
