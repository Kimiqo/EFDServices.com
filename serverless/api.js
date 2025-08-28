import express from 'express';
import cors from 'cors';
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const DATA_DIR = join(__dirname, '..', 'src', 'data');

function parseExportsFromFile(content) {
  // Allow optional TypeScript type annotations: `export const name: Type = ...;`
  const re = /export const\s+(\w+)(?:\s*:\s*[^=]+)?\s*=\s*([\s\S]*?);\s*(?=export const|$)/g;
  const result = {};
  let m;
  while ((m = re.exec(content)) !== null) {
    const name = m[1];
    const code = m[2];
    try {
      const val = Function('return ' + code)();
      result[name] = val;
    } catch (err) {
      result[name] = null;
    }
  }
  return result;
}

app.get('/api/data/:file', (req, res) => {
  const file = req.params.file;
  const filePath = join(DATA_DIR, `${file}.ts`);
  if (!existsSync(filePath)) return res.status(404).json({ error: 'file not found' });
  const content = readFileSync(filePath, 'utf8');
  const exports = parseExportsFromFile(content);
  res.json(exports);
});

app.put('/api/data/:file', (req, res) => {
  const file = req.params.file;
  const newExports = req.body;
  const filePath = join(DATA_DIR, `${file}.ts`);
  if (!existsSync(filePath)) return res.status(404).json({ error: 'file not found' });
  // create backups dir
  const backupsDir = join(__dirname, '..', 'serverless', 'backups');
  if (!existsSync(backupsDir)) mkdirSync(backupsDir, { recursive: true });
  try {
    const orig = readFileSync(filePath, 'utf8');
    const ts = Date.now();
    const backupName = `${file}.ts.bak.${ts}`;
    const backupPath = join(backupsDir, backupName);
    writeFileSync(backupPath, orig, 'utf8');
  } catch (err) {
    console.warn('backup failed', err);
  }

  const parts = [];
  for (const [key, val] of Object.entries(newExports)) {
    parts.push(`export const ${key} = ${JSON.stringify(val, null, 2)};\n`);
  }
  const out = parts.join('\n');
  try {
    writeFileSync(filePath, out, 'utf8');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// list backups for a data file
app.get('/api/backups/:file', (req, res) => {
  const file = req.params.file;
  const backupsDir = join(__dirname, '..', 'serverless', 'backups');
  if (!existsSync(backupsDir)) return res.json({ backups: [] });
  const all = readdirSync(backupsDir).filter(n => n.startsWith(`${file}.ts.bak.`));
  // sort descending (newest first)
  all.sort((a, b) => b.localeCompare(a));
  res.json({ backups: all });
});

// restore a backup
app.post('/api/restore/:file', (req, res) => {
  const file = req.params.file;
  const { backupName } = req.body || {};
  if (!backupName) return res.status(400).json({ error: 'backupName required' });
  const backupsDir = join(__dirname, '..', 'serverless', 'backups');
  const backupPath = join(backupsDir, backupName);
  const filePath = join(DATA_DIR, `${file}.ts`);
  if (!existsSync(backupPath)) return res.status(404).json({ error: 'backup not found' });
  try {
    copyFileSync(backupPath, filePath);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// upload an image as base64 and write to public folder
app.post('/api/upload', (req, res) => {
  const { filename, dataBase64 } = req.body || {};
  if (!filename || !dataBase64) return res.status(400).json({ error: 'missing fields' });
  try {
    const buf = Buffer.from(dataBase64, 'base64');
    const publicDir = join(__dirname, '..', 'public');
    if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });
    const outPath = join(publicDir, filename);
    writeFileSync(outPath, buf);
    res.json({ ok: true, path: `/${filename}` });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Serverless API listening on http://localhost:${PORT}`));
