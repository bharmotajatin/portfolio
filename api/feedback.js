import crypto from 'node:crypto';
import { loadContent, readJson, saveContent, send } from './_lib/core.js';

const MAX_PENDING = 25;
const WINDOW_MS = 10 * 60_000;
const recent = new Map();

const clean = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

function rateLimited(req) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter(t => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 3;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'Method not allowed' });
  }
  try {
    const body = await readJson(req);
    if (body.website) return send(res, 200, { ok: true });
    if (rateLimited(req)) return send(res, 429, { error: 'Too many submissions. Please try again in a few minutes.' });

    const entry = {
      id: `fb-${crypto.randomBytes(5).toString('hex')}`,
      quote: clean(body.quote, 400),
      author: clean(body.author, 60),
      role: clean(body.role, 80),
      rating: Math.max(1, Math.min(5, Math.round(Number(body.rating) || 5))),
      pending: true,
      submittedAt: new Date().toISOString()
    };
    if (entry.quote.length < 10) return send(res, 400, { error: 'Please write at least a sentence of feedback.' });
    if (!entry.author) return send(res, 400, { error: 'Please add your name.' });

    for (let attempt = 0; attempt < 2; attempt++) {
      const { content, version } = await loadContent();
      const list = Array.isArray(content.testimonials) ? content.testimonials : [];
      if (list.filter(t => t.pending).length >= MAX_PENDING) return send(res, 503, { error: 'Feedback is paused right now. Please try again later.' });
      try {
        await saveContent({ ...content, testimonials: [...list, entry] }, version);
        return send(res, 200, { ok: true, entry });
      } catch (err) {
        if (err.status !== 409 || attempt === 1) throw err;
      }
    }
  } catch (err) {
    return send(res, err.status || 500, { error: err.message });
  }
}
