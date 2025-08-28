#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
  console.error('Usage: node scripts/apply_changes.js <path-to-json>');
  process.exit(2);
}

const jsonPath = path.resolve(process.argv[2]);
if (!fs.existsSync(jsonPath)) {
  console.error('File not found:', jsonPath);
  process.exit(2);
}

const content = fs.readFileSync(jsonPath, 'utf8');
const payload = JSON.parse(content);
const data = payload.data || {};

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

for (const file of Object.keys(data)) {
  const filePath = path.join(DATA_DIR, `${file}.ts`);
  if (!fs.existsSync(filePath)) {
    console.warn('Skipping missing file', filePath);
    continue;
  }
  console.log('Patching', filePath);
  let fileContent = fs.readFileSync(filePath, 'utf8');
  const exported = data[file];
  for (const varName of Object.keys(exported)) {
    const value = exported[varName];
    const replacement = `export const ${varName} = ${JSON.stringify(value, null, 2)};`;
    const re = new RegExp(`export const\\s+${varName}\\s*=\\s*[\\s\\S]*?;\\s*(?=export const|$)`);
    if (re.test(fileContent)) {
      fileContent = fileContent.replace(re, replacement + '\n\n');
    } else {
      // append
      fileContent += '\n' + replacement + '\n';
    }
  }
  fs.writeFileSync(filePath, fileContent, 'utf8');
}

console.log('Done.');
