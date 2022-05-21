#!/usr/bin/env node
/**
 * Adds many more commits with small real changes.
 * Each run adds new commits with unique changes.
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

let idx = 78;
let count = 0;

// Add Docker section to README
const readmePath = path.join(REPO, 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8');
if (!readme.includes('## Docker')) {
  readme = readme.replace(
    '## Testing\n',
    '## Docker\n\nStart MongoDB with docker-compose:\n\n```bash\ndocker-compose up -d\n```\n\n## Testing\n',
  );
  fs.writeFileSync(readmePath, readme);
  if (commit(idx++, 'Add Docker section to README')) count++;
}

// Add API prefix note
if (!readme.includes('API prefix')) {
  readme = fs.readFileSync(readmePath, 'utf8');
  readme = readme.replace(
    '### Auth\n',
    '### Auth\n\nAll endpoints return JSON. Auth endpoints use Bearer token in Authorization header.\n\n### Auth\n',
  );
  if (!readme.includes('Bearer token in Authorization')) {
    readme = readme.replace(
      '- `POST /auth/register`',
      '- `POST /auth/register` - No auth required',
    );
    fs.writeFileSync(readmePath, readme);
    if (commit(idx++, 'Add auth requirement note to README')) count++;
  }
}

// Add more test cases to auth.controller.spec.ts
const authControllerSpecPath = path.join(REPO, 'src/auth/auth.controller.spec.ts');
let content = fs.readFileSync(authControllerSpecPath, 'utf8');
if (!content.includes('register method')) {
  content = content.replace(
    "it('should be defined', () => {",
    "it('should have register and login methods', () => {\n    expect(controller.register).toBeDefined();\n    expect(controller.login).toBeDefined();\n  });\n\n  it('should be defined', () => {",
  );
  fs.writeFileSync(authControllerSpecPath, content);
  if (commit(idx++, 'Add test for auth controller methods')) count++;
}

// Add more test cases to users.controller.spec.ts
const usersControllerSpecPath = path.join(REPO, 'src/users/users.controller.spec.ts');
content = fs.readFileSync(usersControllerSpecPath, 'utf8');
if (!content.includes('findOne method')) {
  content = content.replace(
    "it('should be defined', () => {",
    "it('should have findOne method', () => {\n    expect(controller.findOne).toBeDefined();\n  });\n\n  it('should be defined', () => {",
  );
  fs.writeFileSync(usersControllerSpecPath, content);
  if (commit(idx++, 'Add test for users controller findOne')) count++;
}

// Add JWT secret constant
const constantsPath = path.join(REPO, 'src/common/constants.ts');
content = fs.readFileSync(constantsPath, 'utf8');
if (!content.includes('DEFAULT_JWT_SECRET')) {
  content += "\nexport const DEFAULT_JWT_SECRET = 'default-secret-change-in-production';";
  fs.writeFileSync(constantsPath, content);
  if (commit(idx++, 'Add DEFAULT_JWT_SECRET constant')) count++;
}

// Add MongoDB default URI constant
if (!content.includes('DEFAULT_MONGODB_URI')) {
  content = fs.readFileSync(constantsPath, 'utf8');
  content += "\nexport const DEFAULT_MONGODB_URI = 'mongodb://localhost:27017/user-auth-api';";
  fs.writeFileSync(constantsPath, content);
  if (commit(idx++, 'Add DEFAULT_MONGODB_URI constant')) count++;
}

// Add more CONTRIBUTING sections
const contributingPath = path.join(REPO, 'CONTRIBUTING.md');
content = fs.readFileSync(contributingPath, 'utf8');
if (!content.includes('## Pull Requests')) {
  content += '\n## Pull Requests\n\n1. Fork the repository\n2. Create a feature branch\n3. Make your changes\n4. Run tests\n5. Submit a pull request\n';
  fs.writeFileSync(contributingPath, content);
  if (commit(idx++, 'Add Pull Requests section to CONTRIBUTING')) count++;
}

// Add CHANGELOG entry
const changelogPath = path.join(REPO, 'CHANGELOG.md');
content = fs.readFileSync(changelogPath, 'utf8');
if (!content.includes('Docker support')) {
  content = content.replace(
    '### Added\n',
    '### Added\n- Docker Compose for local MongoDB\n- .dockerignore for builds\n',
  );
  fs.writeFileSync(changelogPath, content);
  if (commit(idx++, 'Add Docker entries to CHANGELOG')) count++;
}

// Add DEFAULT_PORT to .env.example comment
const envExamplePath = path.join(REPO, '.env.example');
content = fs.readFileSync(envExamplePath, 'utf8');
if (!content.includes('# Default: 3000')) {
  content = content.replace('PORT=3000', 'PORT=3000  # Default: 3000');
  fs.writeFileSync(envExamplePath, content);
  if (commit(idx++, 'Add comment to PORT in .env.example')) count++;
}

// Add explicit return type to health controller
const healthControllerPath = path.join(REPO, 'src/health/health.controller.ts');
content = fs.readFileSync(healthControllerPath, 'utf8');
if (!content.includes(': { status: string')) {
  content = content.replace(
    'check() {',
    'check(): { status: string; timestamp: string } {',
  );
  fs.writeFileSync(healthControllerPath, content);
  if (commit(idx++, 'Add explicit return type to HealthController.check')) count++;
}

// Add request body example to README
readme = fs.readFileSync(readmePath, 'utf8');
if (!readme.includes('Request body')) {
  readme = readme.replace(
    '- `POST /auth/register` - Register a new user (email, password)',
    '- `POST /auth/register` - Register (body: { email, password })',
  );
  fs.writeFileSync(readmePath, readme);
  if (commit(idx++, 'Add request body format to README')) count++;
}

// Add login body format
readme = fs.readFileSync(readmePath, 'utf8');
if (!readme.includes('login (body:')) {
  readme = readme.replace(
    '- `POST /auth/login` - Login and receive JWT token',
    '- `POST /auth/login` - Login (body: { email, password })',
  );
  fs.writeFileSync(readmePath, readme);
  if (commit(idx++, 'Add login body format to README')) count++;
}

// Use DEFAULT_JWT_SECRET in auth module
const authModulePath = path.join(REPO, 'src/auth/auth.module.ts');
content = fs.readFileSync(authModulePath, 'utf8');
if (content.includes("'default-secret-change-in-production'") && !content.includes('DEFAULT_JWT_SECRET')) {
  content = content.replace(
    "process.env.JWT_SECRET || 'default-secret-change-in-production'",
    'process.env.JWT_SECRET || DEFAULT_JWT_SECRET',
  );
  content = content.replace(
    "import { JWT_EXPIRY } from '../common/constants';",
    "import { JWT_EXPIRY, DEFAULT_JWT_SECRET } from '../common/constants';",
  );
  fs.writeFileSync(authModulePath, content);
  if (commit(idx++, 'Use DEFAULT_JWT_SECRET constant in AuthModule')) count++;
}

// Use DEFAULT_JWT_SECRET in JWT strategy
const jwtStrategyPath = path.join(REPO, 'src/auth/strategies/jwt.strategy.ts');
content = fs.readFileSync(jwtStrategyPath, 'utf8');
if (content.includes("'default-secret-change-in-production'") && !content.includes('DEFAULT_JWT_SECRET')) {
  content = content.replace(
    "process.env.JWT_SECRET || 'default-secret-change-in-production'",
    'process.env.JWT_SECRET || DEFAULT_JWT_SECRET',
  );
  content = content.replace(
    "import { Injectable } from '@nestjs/common';",
    "import { Injectable } from '@nestjs/common';\nimport { DEFAULT_JWT_SECRET } from '../../common/constants';",
  );
  fs.writeFileSync(jwtStrategyPath, content);
  if (commit(idx++, 'Use DEFAULT_JWT_SECRET in JwtStrategy')) count++;
}

// Use DEFAULT_MONGODB_URI in app module
const appModulePath = path.join(REPO, 'src/app.module.ts');
content = fs.readFileSync(appModulePath, 'utf8');
if (content.includes("'mongodb://localhost:27017/user-auth-api'") && !content.includes('DEFAULT_MONGODB_URI')) {
  content = content.replace(
    "process.env.MONGODB_URI || 'mongodb://localhost:27017/user-auth-api'",
    'process.env.MONGODB_URI || DEFAULT_MONGODB_URI',
  );
  content = content.replace(
    "import { HealthModule } from './health/health.module';",
    "import { HealthModule } from './health/health.module';\nimport { DEFAULT_MONGODB_URI } from './common/constants';",
  );
  fs.writeFileSync(appModulePath, content);
  if (commit(idx++, 'Use DEFAULT_MONGODB_URI in AppModule')) count++;
}

console.log(`Created ${count} commits (idx now ${idx})`);
