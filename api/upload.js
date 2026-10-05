import { isAuthed, readJson, saveUpload, send } from './_lib/core.js';

const MAX_BYTES = 3 * 1024 * 1024;
const ALLOWED = /\.(png|jpe?g|webp|gif|svg|pdf)$/i;

export default async function handler(req, res) {
  if (!isAuthed(req)) return send(res, 401, { error: 'Not signed in.' });
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'Method not allowed' });
  }
  try {
    const { filename, data } = await readJson(req);
    if (typeof filename !== 'string' || typeof data !== 'string') return send(res, 400, { error: 'filename and data are required.' });
    const ext = (filename.match(ALLOWED) || [])[0];
    if (!ext) return send(res, 400, { error: 'Only images (png, jpg, webp, gif, svg) and PDFs are allowed.' });
    const base = filename
      .replace(ALLOWED, '')
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'file';
    const buffer = Buffer.from(data.replace(/^data:[^;]+;base64,/, ''), 'base64');
    if (buffer.length > MAX_BYTES) return send(res, 413, { error: 'File is larger than 3 MB.' });
    return send(res, 200, await saveUpload(`${base}${ext.toLowerCase()}`, buffer));
  } catch (err) {
    return send(res, err.status || 500, { error: err.message });
  }
}
