import { isAuthed, loadContent, readJson, saveContent, send, validateContent } from './_lib/core.js';

export default async function handler(req, res) {
  if (!isAuthed(req)) return send(res, 401, { error: 'Not signed in.' });
  try {
    if (req.method === 'GET') {
      return send(res, 200, await loadContent());
    }
    if (req.method === 'PUT') {
      const { content, version } = await readJson(req);
      const problem = validateContent(content);
      if (problem) return send(res, 400, { error: problem });
      return send(res, 200, await saveContent(content, version));
    }
    res.setHeader('Allow', 'GET, PUT');
    return send(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    return send(res, err.status || 500, { error: err.message });
  }
}
