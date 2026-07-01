#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

const htmlPath = resolve(rootDir, 'admin-dashboard.html');
const tsPath = resolve(rootDir, 'src', 'admin-script.ts');

const html = readFileSync(htmlPath, 'utf-8');
const escaped = html
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$/g, '\\$');

const ts = `// Auto-generated from admin-dashboard.html. Do not edit manually.
export const ADMIN_HTML = \`${escaped}\`;
`;

writeFileSync(tsPath, ts, 'utf-8');
console.log('✓ Generated src/admin-script.ts from admin-dashboard.html');
