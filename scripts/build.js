#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

const targets = [
  { html: 'admin-dashboard.html', ts: 'src/admin-script.ts', exportName: 'ADMIN_HTML' },
  { html: 'user-dashboard.html', ts: 'src/user-script.ts', exportName: 'USER_HTML' },
];

for (const t of targets) {
  const html = readFileSync(resolve(rootDir, t.html), 'utf-8');
  const escaped = html
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
  const ts = `// Auto-generated from ${t.html}. Do not edit manually.
export const ${t.exportName} = \`${escaped}\`;
`;
  writeFileSync(resolve(rootDir, t.ts), ts, 'utf-8');
  console.log(`✓ Generated ${t.ts} from ${t.html}`);
}
