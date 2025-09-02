import express from 'express';
import 'node:fs';
import 'node:path';
// attempt to load dotenv if available; if not, we'll parse .env manually later
import cors from 'cors';
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// top-level: try to import dotenv/config dynamically so this file doesn't crash
// if the 'dotenv' package isn't installed. If import fails, try a minimal
// .env parser so environment credentials still work when running locally.
try {
  // top-level await is supported in Node ESM
  await import('dotenv/config');
} catch (err) {
  try {
    const envPath = join(__dirname, '..', '.env');
    if (existsSync(envPath)) {
      const text = readFileSync(envPath, 'utf8');
      for (const line of text.split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (!m) continue;
        const key = m[1];
        let val = m[2] || '';
        // strip surrounding quotes if present
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        // don't overwrite existing env vars
        if (process.env[key] === undefined) process.env[key] = val;
      }
    }
  } catch (e) {
    // ignore — best-effort fallback
  }
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// simple JWT using HMAC SHA256 (no external deps)
// Accept ADMIN_EMAIL and ADMIN_PASS env vars. ADMIN_USER (legacy) is still supported.
let ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.ADMIN_USER;
let ADMIN_PASS = process.env.ADMIN_PASS;
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'dev-secret-change-me';
const JWT_EXP_SECONDS = Number(process.env.ADMIN_JWT_EXP || 60 * 60 * 24); // default 1 day

function base64UrlEncode(obj) {
  const s = typeof obj === 'string' ? obj : JSON.stringify(obj);
  return Buffer.from(s).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  return Buffer.from(b64 + pad, 'base64').toString();
}

function signJwt(payload, secret, expSeconds) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const pl = Object.assign({}, payload, { iat: now });
  if (expSeconds) pl.exp = now + expSeconds;
  const h = base64UrlEncode(header);
  const p = base64UrlEncode(pl);
  const sig = crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${h}.${p}.${sig}`;
}

function verifyJwt(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [h, p, s] = parts;
    const expected = crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    if (expected !== s) return null;
    const payload = JSON.parse(base64UrlDecode(p));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// protect /api routes except /api/login
app.use('/api', (req, res, next) => {
  if (req.path === '/login') return next();
  const auth = req.headers.authorization || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return res.status(401).json({ error: 'unauthorized' });
  const token = m[1];
  const payload = verifyJwt(token, JWT_SECRET);
  if (!payload) return res.status(401).json({ error: 'invalid token' });
  // attach user info to request for future use if needed
  req.user = payload;
  next();
});

// login route
app.post('/api/login', (req, res) => {
  // accept either { email, password } or legacy { username, password }
  const { email, username, password } = req.body || {};
  const supplied = (email || username || '').toString();
  if (!supplied || !password) return res.status(400).json({ error: 'missing fields' });
  if (supplied === ADMIN_EMAIL && password === ADMIN_PASS) {
    const token = signJwt({ sub: ADMIN_EMAIL }, JWT_SECRET, JWT_EXP_SECONDS);
    return res.json({ token });
  }
  res.status(401).json({ error: 'invalid credentials' });
});

// profile endpoint: return current admin email
app.get('/api/profile', (req, res) => {
  res.json({ email: ADMIN_EMAIL });
});

// change password endpoint
app.post('/api/change-password', (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  if (!oldPassword || !newPassword) return res.status(400).json({ error: 'missing fields' });
  // verify old password
  if (oldPassword !== ADMIN_PASS) return res.status(401).json({ error: 'invalid current password' });
  ADMIN_PASS = String(newPassword);
  // persist
  try {
    saveAdminToFile();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const DATA_DIR = join(__dirname, '..', 'src', 'data');

// persistent admin file (local dev). stores { email, password } in serverless/admin.json
const ADMIN_FILE = join(__dirname, 'admin.json');

function loadAdminFromFile() {
  try {
    if (existsSync(ADMIN_FILE)) {
      const txt = readFileSync(ADMIN_FILE, 'utf8');
      const j = JSON.parse(txt || '{}');
      if (j.email) ADMIN_EMAIL = j.email;
      if (j.password) ADMIN_PASS = j.password;
    }
  } catch (e) {
    console.warn('failed to read admin file', e);
  }
}

function saveAdminToFile() {
  try {
    const obj = { email: ADMIN_EMAIL, password: ADMIN_PASS };
    writeFileSync(ADMIN_FILE, JSON.stringify(obj, null, 2), 'utf8');
  } catch (e) {
    console.warn('failed to write admin file', e);
  }
}

// load existing admin.json (if present) to override env values
loadAdminFromFile();

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

export default app;
