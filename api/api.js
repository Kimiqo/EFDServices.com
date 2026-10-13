import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname, basename, resolve } from 'path';
import { fileURLToPath } from 'url';
import { get, put } from '@vercel/blob';
import 'dotenv/config';

// Setup paths and dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Express app setup
const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Admin persistence
let ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.ADMIN_USER;
let ADMIN_PASS = process.env.ADMIN_PASS;

const ADMIN_FILE = process.env.EFD_ADMIN_FILE || join(__dirname, 'admin.json');
const ADMIN_FILE_KEY = 'admin.json'; // blob key

function privateBlobOptions() {
  return { access: 'private', token: process.env.ADMIN_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN };
}

async function loadAdminFromBlob() {
  try {
    const result = await get(ADMIN_FILE_KEY, { ...privateBlobOptions(), useCache: false });
    if (result?.statusCode !== 200) return null;
    return await new Response(result.stream).json();
  } catch (error) {
    console.warn('Failed to load admin credentials from private storage', error);
    return null;
  }
}

async function saveAdminToBlob(adminObj) {
  await put(ADMIN_FILE_KEY, JSON.stringify(adminObj, null, 2), {
    ...privateBlobOptions(),
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}

function loadAdminFromFile() {
  if (existsSync(ADMIN_FILE)) {
    const txt = readFileSync(ADMIN_FILE, 'utf8');
    return JSON.parse(txt || '{}');
  }
  return null;
}

function saveAdminToFile(adminObj) {
  writeFileSync(ADMIN_FILE, JSON.stringify(adminObj, null, 2), 'utf8');
}

// Load admin at startup
if (process.env.VERCEL) {
  const j = await loadAdminFromBlob();
  if (j) {
    if (j.email) ADMIN_EMAIL = j.email;
    if (j.password) ADMIN_PASS = j.password;
  }
} else {
  const j = loadAdminFromFile();
  if (j) {
    if (j.email) ADMIN_EMAIL = j.email;
    if (j.password) ADMIN_PASS = j.password;
  }
}

// JWT Helpers
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'dev-secret-change-me';
const JWT_EXP_SECONDS = Number(process.env.ADMIN_JWT_EXP || 60 * 60 * 24);

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
  const sig = crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${h}.${p}.${sig}`;
}

function verifyJwt(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [h, p, s] = parts;
    const expected = crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    if (expected !== s) return null;
    const payload = JSON.parse(base64UrlDecode(p));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}

// Middleware: protect routes
app.use('/api', (req, res, next) => {
  if (req.path === '/login') return next();
  const auth = req.headers.authorization || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return res.status(401).json({ error: 'unauthorized' });
  const token = m[1];
  const payload = verifyJwt(token, JWT_SECRET);
  if (!payload) return res.status(401).json({ error: 'invalid token' });
  next();
});

// Auth Routes
app.post('/api/login', (req, res) => {
  const { email, username, password } = req.body || {};
  const supplied = (email || username || '').toString();
  if (!supplied || !password) return res.status(400).json({ error: 'missing fields' });
  if (supplied === ADMIN_EMAIL && password === ADMIN_PASS) {
    const token = signJwt({ sub: ADMIN_EMAIL }, JWT_SECRET, JWT_EXP_SECONDS);
    return res.json({ token });
  }
  res.status(401).json({ error: 'invalid credentials' });
});

app.get('/api/profile', (req, res) => {
  res.json({ email: ADMIN_EMAIL });
});

app.post('/api/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  if (!oldPassword || !newPassword) return res.status(400).json({ error: 'missing fields' });
  if (oldPassword !== ADMIN_PASS) return res.status(401).json({ error: 'invalid current password' });

  const obj = { email: ADMIN_EMAIL, password: String(newPassword) };

  try {
    if (process.env.VERCEL) {
      await saveAdminToBlob(obj);
    } else {
      saveAdminToFile(obj);
    }
    ADMIN_PASS = obj.password;
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// These three source files are the content used by the site and admin screen.
const DATA_DIR = process.env.EFD_DATA_DIR || join(__dirname, '..', 'src', 'data');
const BACKUPS_DIR = process.env.EFD_BACKUPS_DIR || join(__dirname, 'backups');
const DATA_EXPORTS = { galleryData: 'galleryItems', testimonials: 'testimonials', heroImages: 'heroImages' };

function parseDataLiteral(source) {
  // Remove trailing commas outside JSON strings, preserving punctuation inside descriptions.
  let output = '';
  let quoted = false;
  let escaped = false;
  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    if (quoted) {
      output += char;
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') quoted = false;
    } else {
      if (char === '"') quoted = true;
      if (char === ',' && /^\s*[}\]]/.test(source.slice(index + 1))) continue;
      output += char;
    }
  }
  return JSON.parse(output);
}

app.get('/api/data/:file', (req, res) => {
  const key = Object.hasOwn(DATA_EXPORTS, req.params.file) ? DATA_EXPORTS[req.params.file] : null;
  if (!key) return res.status(404).json({ error: 'unknown content file' });
  try {
    const content = readFileSync(join(DATA_DIR, `${req.params.file}.ts`), 'utf8');
    const match = content.match(/^export const (\w+)\s*=\s*([\s\S]*);\s*$/);
    if (!match || match[1] !== key) return res.status(500).json({ error: 'content export not found' });
    res.json({ [key]: parseDataLiteral(match[2]) });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.put('/api/data/:file', (req, res) => {
  const key = Object.hasOwn(DATA_EXPORTS, req.params.file) ? DATA_EXPORTS[req.params.file] : null;
  if (!key) return res.status(404).json({ error: 'unknown content file' });
  if (!Array.isArray(req.body?.[key])) return res.status(400).json({ error: `${key} must be an array` });
  try {
    const filePath = join(DATA_DIR, `${req.params.file}.ts`);
    mkdirSync(BACKUPS_DIR, { recursive: true });
    writeFileSync(join(BACKUPS_DIR, `${req.params.file}.ts.bak.${Date.now()}`), readFileSync(filePath));
    writeFileSync(filePath, `export const ${key} = ${JSON.stringify(req.body[key], null, 2)};\n`, 'utf8');
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Image Upload
app.post('/api/upload', async (req, res) => {
  const { filename, dataBase64 } = req.body || {};
  if (!filename || !dataBase64) return res.status(400).json({ error: 'missing fields' });
  if (typeof filename !== 'string' || basename(filename) !== filename || filename.includes(String.fromCharCode(92))) return res.status(400).json({ error: 'invalid filename' });

  try {
    const buf = Buffer.from(dataBase64, 'base64');

    if (process.env.VERCEL) {
      // Save to blob storage
      const { url } = await put(filename, buf, {
        access: 'public',
        contentType: 'image/png', // adjust based on actual type
      });
      return res.json({ ok: true, url });
    } else {
      // Save locally
      const publicDir = join(__dirname, '..', 'public');
      if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });
      const outPath = join(publicDir, filename);
      writeFileSync(outPath, buf);
      return res.json({ ok: true, path: `/${filename}` });
    }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Start server
export default app;

if (process.argv[1] && resolve(process.argv[1]) === __filename) {
  const port = process.env.PORT || 4001;
  app.listen(port, () => {
    console.log(`Admin API listening on http://localhost:${port}`);
  });
}
