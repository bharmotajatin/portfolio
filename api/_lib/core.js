import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export const CONTENT_PATH = 'src/data/content.json';
export const UPLOAD_DIR = 'public/uploads';
const COOKIE = 'admin_token';
const SESSION_HOURS = 12;
const isProd = () => Boolean(process.env.VERCEL) || process.env.NODE_ENV === 'production';

/* ---------------- HTTP helpers (work in Vercel functions and the Vite dev middleware) ---------------- */

export function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

export async function readJson(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') return req.body ? JSON.parse(req.body) : {};
    if (Buffer.isBuffer(req.body)) return JSON.parse(req.body.toString('utf8') || '{}');
    return req.body;
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  return Object.fromEntries(
    header
      .split(';')
      .map(p => p.trim().split('='))
      .filter(([k]) => k)
      .map(([k, ...v]) => [k, decodeURIComponent(v.join('='))])
  );
}

/* ---------------- Auth ---------------- */

function adminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return isProd() ? null : 'admin';
}

function secret() {
  const pw = adminPassword();
  if (!pw) return null;
  return process.env.ADMIN_SECRET || crypto.createHash('sha256').update(`portfolio-admin:${pw}`).digest('hex');
}

const b64url = buf => Buffer.from(buf).toString('base64url');
const sign = (payload, key) => crypto.createHmac('sha256', key).update(payload).digest('base64url');

export function checkPassword(input) {
  const pw = adminPassword();
  if (!pw || typeof input !== 'string') return false;
  const a = crypto.createHash('sha256').update(input).digest();
  const b = crypto.createHash('sha256').update(pw).digest();
  return crypto.timingSafeEqual(a, b);
}

export function authConfigured() {
  return Boolean(adminPassword());
}

export function issueSession(res) {
  const key = secret();
  const payload = b64url(JSON.stringify({ exp: Date.now() + SESSION_HOURS * 3600_000 }));
  const token = `${payload}.${sign(payload, key)}`;
  const flags = ['HttpOnly', 'Path=/', 'SameSite=Strict', `Max-Age=${SESSION_HOURS * 3600}`];
  if (isProd()) flags.push('Secure');
  res.setHeader('Set-Cookie', `${COOKIE}=${token}; ${flags.join('; ')}`);
}

export function clearSession(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0${isProd() ? '; Secure' : ''}`);
}

export function isAuthed(req) {
  const key = secret();
  const token = parseCookies(req)[COOKIE];
  if (!key || !token) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = sign(payload, key);
  if (expected.length !== sig.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return false;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now();
  } catch {
    return false;
  }
}

/* ---------------- Storage: GitHub in production, local filesystem in dev ---------------- */

export function storageMode() {
  if (process.env.GITHUB_TOKEN) return 'github';
  return isProd() ? 'none' : 'local';
}

const repo = () => process.env.GITHUB_REPO || 'bharmotajatin/portfolio';
const branch = () => process.env.GITHUB_BRANCH || 'main';

async function gh(pathname, init = {}) {
  const res = await fetch(`https://api.github.com/repos/${repo()}/contents/${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'portfolio-admin',
      ...(init.headers || {})
    }
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

async function ghGet(pathname) {
  const r = await gh(`${pathname}?ref=${encodeURIComponent(branch())}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub read failed (${r.status}): ${r.body.message || 'unknown error'}`);
  return { sha: r.body.sha, content: Buffer.from(r.body.content, 'base64') };
}

async function ghPut(pathname, buffer, message, sha) {
  const r = await gh(pathname, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content: buffer.toString('base64'), branch: branch(), ...(sha ? { sha } : {}) })
  });
  if (r.status === 409 || r.status === 422) {
    const err = new Error('The file changed on GitHub since you loaded it. Reload the admin and try again.');
    err.status = 409;
    throw err;
  }
  if (!r.ok) throw new Error(`GitHub write failed (${r.status}): ${r.body.message || 'unknown error'}`);
  return r.body.content.sha;
}

const root = () => process.cwd();
const hash = buf => crypto.createHash('sha1').update(buf).digest('hex');
const parseJson = buf => JSON.parse(buf.toString('utf8').replace(/^\uFEFF/, ''));

export async function loadContent() {
  const mode = storageMode();
  if (mode === 'github') {
    const file = await ghGet(CONTENT_PATH);
    if (!file) throw new Error(`${CONTENT_PATH} not found in ${repo()}@${branch()}`);
    return { content: parseJson(file.content), version: file.sha, mode };
  }
  const buf = await fs.readFile(path.join(root(), CONTENT_PATH));
  return { content: parseJson(buf), version: hash(buf), mode };
}

export async function saveContent(content, version) {
  const mode = storageMode();
  const buffer = Buffer.from(`${JSON.stringify(content, null, 2)}\n`, 'utf8');
  if (mode === 'github') {
    const sha = await ghPut(CONTENT_PATH, buffer, 'content: update portfolio via admin', version);
    return { version: sha, mode };
  }
  if (mode === 'none') throw new Error('Saving is disabled: set GITHUB_TOKEN in your Vercel environment variables.');
  const file = path.join(root(), CONTENT_PATH);
  const current = await fs.readFile(file);
  if (version && hash(current) !== version) {
    const err = new Error('content.json changed on disk since you loaded it. Reload the admin and try again.');
    err.status = 409;
    throw err;
  }
  await fs.writeFile(file, buffer);
  return { version: hash(buffer), mode };
}

export async function saveUpload(filename, buffer) {
  const mode = storageMode();
  const rel = `${UPLOAD_DIR}/${filename}`;
  if (mode === 'github') {
    const existing = await ghGet(rel);
    await ghPut(rel, buffer, `upload: ${filename} via admin`, existing?.sha);
  } else if (mode === 'local') {
    await fs.mkdir(path.join(root(), UPLOAD_DIR), { recursive: true });
    await fs.writeFile(path.join(root(), rel), buffer);
  } else {
    throw new Error('Uploads are disabled: set GITHUB_TOKEN in your Vercel environment variables.');
  }
  return { url: `/uploads/${filename}`, mode };
}

/* ---------------- Validation ---------------- */

const LIST_KEYS = ['sections', 'stats', 'skills', 'experience', 'projects', 'education', 'certifications', 'testimonials'];

export function validateContent(c) {
  if (!c || typeof c !== 'object' || Array.isArray(c)) return 'Content must be a JSON object.';
  if (!c.profile || typeof c.profile !== 'object') return 'Missing "profile" object.';
  if (!c.profile.name) return 'Profile name is required.';
  for (const key of LIST_KEYS) {
    if (!Array.isArray(c[key])) return `"${key}" must be a list.`;
  }
  if (JSON.stringify(c).length > 1_000_000) return 'Content is too large (over 1 MB).';
  return null;
}
