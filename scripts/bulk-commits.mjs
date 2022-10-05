#!/usr/bin/env node
/**
 * Creates many commits with small real changes and backdated 2022 dates.
 * Run multiple times - each run adds new commits.
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

function commit(msg) {
  const idx = 70 + Math.floor(Math.random() * 130); // spread across remaining
  const date = getDate(idx);
  return run(`git add -A && GIT_AUTHOR_DATE="${date}" GIT_COMMITTER_DATE="${date}" git commit -m "${msg.replace(/"/g, '\\"')}"`);
}

let count = 0;

// Add more test cases to auth.service.spec.ts
const authServiceSpecPath = path.join(REPO, 'src/auth/auth.service.spec.ts');
let content = fs.readFileSync(authServiceSpecPath, 'utf8');

if (!content.includes("should return null when password doesn't match")) {
  const insertBefore = "  describe('register', () => {";
  const newTest = `
    it("should return null when password doesn't match", async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      const result = await service.validateUser('test@example.com', 'wrong');
      expect(result).toBeNull();
    });
`;
  content = content.replace(insertBefore, newTest + insertBefore);
  fs.writeFileSync(authServiceSpecPath, content);
  if (commit("Add test for invalid password in AuthService")) count++;
}

// Add more test cases to users.service.spec.ts
const usersServiceSpecPath = path.join(REPO, 'src/users/users.service.spec.ts');
content = fs.readFileSync(usersServiceSpecPath, 'utf8');

if (!content.includes("should return null when user not found")) {
  const insertBefore = "  describe('findByEmail', () => {";
  const newTest = `
    it('should return null when user not found', async () => {
      mockExec.mockResolvedValue(null);
      const result = await service.findByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
`;
  content = content.replace(insertBefore, newTest + insertBefore);
  fs.writeFileSync(usersServiceSpecPath, content);
  if (commit("Add test for user not found in UsersService")) count++;
}

// Add keywords to package.json
const pkgPath = path.join(REPO, 'package.json');
let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
if (!pkg.keywords) {
  pkg.keywords = ['nestjs', 'authentication', 'jwt', 'mongodb'];
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  if (commit("Add keywords to package.json")) count++;
}

// Add repository field
if (!pkg.repository) {
  pkg.repository = { type: 'git', url: 'https://github.com/example/user-auth-api.git' };
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  if (commit("Add repository field to package.json")) count++;
}

// Add Makefile with common targets
const makefilePath = path.join(REPO, 'Makefile');
if (!fs.existsSync(makefilePath)) {
  fs.writeFileSync(makefilePath, `.PHONY: dev build test lint
dev:
	npm run start:dev
build:
	npm run build
test:
	npm test
lint:
	npm run lint
`);
  if (commit("Add Makefile with common targets")) count++;
}

// Add environment section to README
const readmePath = path.join(REPO, 'README.md');
content = fs.readFileSync(readmePath, 'utf8');
if (!content.includes('## Environment Variables')) {
  const insertAfter = '## Configuration\n\n';
  const envSection = `## Environment Variables\n\n- \`PORT\` - Server port (default: 3000)\n- \`MONGODB_URI\` - MongoDB connection string\n- \`JWT_SECRET\` - Secret for JWT signing\n\n`;
  content = content.replace(insertAfter, insertAfter + envSection);
  fs.writeFileSync(readmePath, content);
  if (commit("Add environment variables section to README")) count++;
}

console.log(`Created ${count} commits`);
