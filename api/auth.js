import { authConfigured, checkPassword, clearSession, isAuthed, issueSession, readJson, send, storageMode } from './_lib/core.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return send(res, 200, { authed: isAuthed(req), configured: authConfigured(), storage: storageMode() });
    }
    if (req.method === 'POST') {
      if (!authConfigured()) return send(res, 503, { error: 'ADMIN_PASSWORD is not set on the server.' });
      const { password } = await readJson(req);
      if (!checkPassword(password)) {
        await new Promise(r => setTimeout(r, 800));
        return send(res, 401, { error: 'Wrong password.' });
      }
      issueSession(res);
      return send(res, 200, { authed: true, storage: storageMode() });
    }
    if (req.method === 'DELETE') {
      clearSession(res);
      return send(res, 200, { authed: false });
    }
    res.setHeader('Allow', 'GET, POST, DELETE');
    return send(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    return send(res, 500, { error: err.message });
  }
}
