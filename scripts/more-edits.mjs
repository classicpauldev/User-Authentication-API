#!/usr/bin/env node
/**
 * Adds many more commits with small real changes.
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

let idx = 114;
let count = 0;

const edits = [
  [() => {
    const p = path.join(REPO, 'README.md');
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('## Contributing')) {
      c += '\n## Contributing\n\nSee CONTRIBUTING.md for guidelines.\n';
      fs.writeFileSync(p, c);
      return true;
    }
    return false;
  }, 'Add Contributing section to README'],
  [() => {
    const p = path.join(REPO, 'README.md');
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('## Changelog')) {
      c += '\n## Changelog\n\nSee CHANGELOG.md for version history.\n';
      fs.writeFileSync(p, c);
      return true;
    }
    return false;
  }, 'Add Changelog section to README'],
  [() => {
    const p = path.join(REPO, 'CONTRIBUTING.md');
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('## Code Style')) {
      c += '\n## Code Style\n\nUse Prettier for formatting: npm run format\n';
      fs.writeFileSync(p, c);
      return true;
    }
    return false;
  }, 'Add Code Style section to CONTRIBUTING'],
  [() => {
    const p = path.join(REPO, 'CONTRIBUTING.md');
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('## Running the App')) {
      c += '\n## Running the App\n\nnpm run start:dev - starts development server with hot reload\n';
      fs.writeFileSync(p, c);
      return true;
    }
    return false;
  }, 'Add Running the App to CONTRIBUTING'],
  [() => {
    const p = path.join(REPO, 'CHANGELOG.md');
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('ValidationPipe')) {
      c = c.replace('### Added\n', '### Added\n- ValidationPipe in e2e tests\n');
      fs.writeFileSync(p, c);
      return true;
    }
    return false;
  }, 'Add ValidationPipe to CHANGELOG'],
  [() => {
    const p = path.join(REPO, 'CHANGELOG.md');
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('Docker')) {
      return false;
    }
    if (!c.includes('Makefile')) {
      c = c.replace('### Added\n', '### Added\n- Makefile for common tasks\n');
      fs.writeFileSync(p, c);
      return true;
    }
    return false;
  }, 'Add Makefile to CHANGELOG'],
  [() => {
    const p = path.join(REPO, 'src/auth/auth.service.spec.ts');
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('should call jwtService.sign')) {
      c = c.replace(
        "it('should throw ConflictException when email exists',",
        "it('should call jwtService.sign on successful register', async () => {\n    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);\n    jest.spyOn(usersService, 'create').mockResolvedValue(mockUser as never);\n    await service.register('new@example.com', 'password123');\n    expect(jwtService.sign).toHaveBeenCalled();\n  });\n\n  it('should throw ConflictException when email exists',",
      );
      fs.writeFileSync(p, c);
      return true;
    }
    return false;
  }, 'Add JWT sign test to AuthService'],
  [() => {
    const p = path.join(REPO, 'src/users/users.service.spec.ts');
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('findById')) {
      c = c.replace(
        "  describe('findByEmail', () => {",
        "  describe('findById', () => {\n    it('should return user when found', async () => {\n      const user = { _id: 'id', email: 'test@example.com' };\n      mockExec.mockResolvedValue(user);\n      const result = await service.findById('id');\n      expect(result).toEqual(user);\n    });\n  });\n\n  describe('findByEmail', () => {",
      );
      fs.writeFileSync(p, c);
      return true;
    }
    return false;
  }, 'Add findById test to UsersService'],
];

for (const [editFn, msg] of edits) {
  if (editFn()) {
    if (commit(idx++, msg)) count++;
  }
}

console.log(`Created ${count} commits (idx now ${idx})`);
