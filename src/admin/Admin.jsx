import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PREVIEW_MESSAGE, PREVIEW_READY } from '../lib/preview';
import { toggleTheme, useTheme } from '../lib/theme';
import { ALL_EDITORS, GROUPS, newId } from './schema';
import { Field, IconButton, StringList, inputCls } from './fields';

const DRAFT_KEY = 'portfolio-admin-draft';
const clone = v => JSON.parse(JSON.stringify(v));

async function api(path, init) {
  const res = await fetch(path, { credentials: 'same-origin', ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return body;
}

/* ---------------- Login ---------------- */

function Login({ onDone, configured }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/api/auth', { method: 'POST', body: JSON.stringify({ password }) });
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink p-4">
      <div className="grid-bg absolute inset-0" />
      <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-mint/15 blur-[140px]" />
      <div className="absolute -bottom-40 -right-40 h-[480px] w-[480px] rounded-full bg-violet/15 blur-[140px]" />
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 30, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        style={{ transformPerspective: 1000 }}
        className="glass relative w-full max-w-sm rounded-3xl p-8"
      >
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-mint via-cyan to-violet text-xl text-ink">
          <i className="ri-shield-keyhole-line" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white">Portfolio admin</h1>
        <p className="mt-1 text-sm text-slate-400">Sign in to edit your site.</p>
        {!configured && (
          <p className="mt-4 rounded-xl border border-amber/30 bg-amber/10 p-3 text-xs text-amber">
            ADMIN_PASSWORD is not configured on the server. Add it in Vercel → Settings → Environment Variables.
          </p>
        )}
        <input type="password" autoFocus value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className={`${inputCls} mt-6 !py-3`} autoComplete="current-password" />
        {error && <p className="mt-2 text-sm text-rose">{error}</p>}
        <button type="submit" disabled={busy || !password} className="btn-primary mt-4 w-full disabled:opacity-50">
          {busy ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-login-circle-line" />} Sign in
        </button>
        <a href="/" className="mt-4 block text-center text-xs text-slate-500 hover:text-white">
          ← Back to site
        </a>
      </motion.form>
    </div>
  );
}

/* ---------------- Editors ---------------- */

function ObjectEditor({ editor, value, onChange, ctx }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {editor.fields.map(f => (
        <Field key={f.key} field={f} value={value?.[f.key]} ctx={ctx} onChange={v => onChange({ ...value, [f.key]: v })} />
      ))}
    </div>
  );
}

function ListEditor({ editor, value = [], onChange, ctx }) {
  const [openIdx, setOpenIdx] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [query, setQuery] = useState('');

  const update = (i, item) => onChange(value.map((x, j) => (j === i ? item : x)));
  const moveItem = (from, to) => {
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
    if (openIdx === from) setOpenIdx(to);
  };
  const add = () => {
    const item = editor.newItem();
    const withId = 'id' in (value[0] || { id: 1 }) ? { id: newId(editor.itemLabel(item)), ...item } : item;
    onChange([withId, ...value]);
    setOpenIdx(0);
    setQuery('');
  };
  const duplicate = i => {
    const copy = clone(value[i]);
    if ('id' in copy) copy.id = newId(editor.itemLabel(copy));
    const next = [...value];
    next.splice(i + 1, 0, copy);
    onChange(next);
    setOpenIdx(i + 1);
  };
  const remove = i => {
    onChange(value.filter((_, j) => j !== i));
    setConfirm(null);
    setOpenIdx(null);
    ctx.toast('info', 'Item removed. Click Discard to undo before saving.');
  };

  const matches = (item, i) => !query || JSON.stringify(item).toLowerCase().includes(query.toLowerCase()) || openIdx === i;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={add} className="btn-primary !px-4 !py-2 text-sm">
          <i className="ri-add-line" /> Add new
        </button>
        {value.length > 5 && <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…" className={`${inputCls} !w-56`} />}
        <span className="ml-auto font-mono text-xs text-slate-500">{value.length} items</span>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {value.map((item, i) =>
            matches(item, i) ? (
              <motion.div key={item.id || i} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }} className={`overflow-hidden rounded-2xl border transition-colors ${openIdx === i ? 'border-mint/40 bg-ink-2' : 'border-white/10 bg-ink-2/60 hover:border-white/20'}`}>
                <div className="flex items-center gap-2 p-3">
                  <button type="button" onClick={() => setOpenIdx(openIdx === i ? null : i)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    {item.color && <span className="h-8 w-1.5 shrink-0 rounded-full" style={{ background: item.color }} />}
                    {item.icon && <i className={`${item.icon} text-lg`} style={{ color: item.color || '#94a3b8' }} />}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-white">{editor.itemLabel(item) || 'Untitled'}</span>
                      {editor.itemMeta && <span className="block truncate text-xs text-slate-500">{editor.itemMeta(item)}</span>}
                    </span>
                    <i className={`ri-arrow-down-s-line ml-auto text-slate-500 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className="flex shrink-0 items-center">
                    <IconButton icon="ri-arrow-up-line" label="Move up" disabled={i === 0} onClick={() => moveItem(i, i - 1)} />
                    <IconButton icon="ri-arrow-down-line" label="Move down" disabled={i === value.length - 1} onClick={() => moveItem(i, i + 1)} />
                    <IconButton icon="ri-file-copy-line" label="Duplicate" onClick={() => duplicate(i)} />
                    {confirm === i ? (
                      <span className="ml-1 flex items-center gap-1">
                        <button type="button" onClick={() => remove(i)} className="rounded-lg bg-rose px-2.5 py-1 text-xs font-semibold text-ink">
                          Delete
                        </button>
                        <button type="button" onClick={() => setConfirm(null)} className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:text-white">
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <IconButton icon="ri-delete-bin-6-line" label="Delete" danger onClick={() => setConfirm(i)} />
                    )}
                  </div>
                </div>
                <AnimatePresence initial={false}>
                  {openIdx === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <div className="grid gap-5 border-t border-white/5 p-4 sm:grid-cols-2 md:p-5">
                        {editor.fields.map(f => (
                          <Field key={f.key} field={f} value={item[f.key]} ctx={ctx} onChange={v => update(i, { ...item, [f.key]: v })} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
        {value.length === 0 && <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-slate-500">Nothing here yet. Click “Add new”.</div>}
      </div>
    </div>
  );
}

const SECTION_DEFAULTS = {
  about: ['About', 'ri-user-3-line'],
  skills: ['Skills', 'ri-stack-line'],
  process: ['Process', 'ri-route-line'],
  experience: ['Experience', 'ri-briefcase-4-line'],
  projects: ['Projects', 'ri-folder-chart-line'],
  education: ['Education', 'ri-graduation-cap-line'],
  testimonials: ['Testimonials', 'ri-chat-quote-line'],
  contact: ['Contact', 'ri-mail-send-line']
};

function SectionsEditor({ value = [], onChange }) {
  const missing = Object.keys(SECTION_DEFAULTS).filter(id => !value.some(s => s.id === id));
  const set = (i, patch) => onChange(value.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const moveItem = (from, to) => {
    const next = [...value];
    const [s] = next.splice(from, 1);
    next.splice(to, 0, s);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="mb-3 rounded-2xl border border-white/10 bg-ink-2/60 p-3 text-xs text-slate-500">
        <i className="ri-information-line text-cyan" /> The hero is always first. Hidden sections keep their content, so you can bring them back any time.
      </div>
      {value.map((s, i) => (
        <motion.div layout key={s.id} className={`flex flex-wrap items-center gap-3 rounded-2xl border p-3 ${s.visible ? 'border-white/10 bg-ink-2/80' : 'border-white/5 bg-ink-2/30 opacity-60'}`}>
          <span className="w-6 text-center font-mono text-xs text-slate-500">{i + 1}</span>
          <i className={`${s.icon} text-lg text-mint`} />
          <input value={s.label} onChange={e => set(i, { label: e.target.value })} className={`${inputCls} !w-44`} aria-label="Section label" />
          <span className="font-mono text-xs text-slate-600">#{s.id}</span>
          <div className="ml-auto flex items-center gap-1">
            <IconButton icon="ri-arrow-up-line" label="Move up" disabled={i === 0} onClick={() => moveItem(i, i - 1)} />
            <IconButton icon="ri-arrow-down-line" label="Move down" disabled={i === value.length - 1} onClick={() => moveItem(i, i + 1)} />
            <button type="button" onClick={() => set(i, { visible: !s.visible })} className={`ml-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${s.visible ? 'bg-mint/15 text-mint hover:bg-mint/25' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
              <i className={s.visible ? 'ri-eye-line' : 'ri-eye-off-line'} /> {s.visible ? 'Visible' : 'Hidden'}
            </button>
            <IconButton icon="ri-delete-bin-6-line" label="Remove from page" danger onClick={() => onChange(value.filter((_, j) => j !== i))} />
          </div>
        </motion.div>
      ))}
      {missing.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-3">
          <span className="text-xs text-slate-500">Add back:</span>
          {missing.map(id => (
            <button key={id} type="button" onClick={() => onChange([...value, { id, label: SECTION_DEFAULTS[id][0], icon: SECTION_DEFAULTS[id][1], visible: true }])} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/15 px-3 py-1.5 text-xs text-slate-300 hover:border-mint/50 hover:text-mint">
              <i className="ri-add-line" /> {SECTION_DEFAULTS[id][0]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function JsonEditor({ draft, setDraft, ctx }) {
  const [text, setText] = useState(() => JSON.stringify(draft, null, 2));
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => setText(JSON.stringify(draft, null, 2)), [draft]);

  const apply = raw => {
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.profile || !Array.isArray(parsed.projects)) throw new Error('This does not look like portfolio content (missing profile or projects).');
      setDraft(parsed);
      setError('');
      ctx.toast('success', 'JSON applied to the draft. Review and Save to publish.');
    } catch (err) {
      setError(err.message);
    }
  };

  const download = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `portfolio-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={download} className="btn-ghost !px-4 !py-2 text-sm">
          <i className="ri-download-2-line" /> Download backup
        </button>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={async e => e.target.files?.[0] && apply(await e.target.files[0].text())} />
        <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost !px-4 !py-2 text-sm">
          <i className="ri-upload-2-line" /> Import file
        </button>
        <button type="button" onClick={() => apply(text)} className="btn-primary !px-4 !py-2 text-sm">
          <i className="ri-check-line" /> Apply edits
        </button>
      </div>
      {error && <p className="mb-2 rounded-xl border border-rose/30 bg-rose/10 p-3 text-sm text-rose">{error}</p>}
      <textarea value={text} onChange={e => setText(e.target.value)} spellCheck={false} className={`${inputCls} h-[60vh] font-mono text-xs leading-relaxed`} data-lenis-prevent />
    </div>
  );
}

/* ---------------- Preview ---------------- */

function Preview({ draft, device, onClose }) {
  const frame = useRef(null);
  const ready = useRef(false);

  const push = useCallback(() => {
    if (ready.current) frame.current?.contentWindow?.postMessage({ type: PREVIEW_MESSAGE, content: draft }, window.location.origin);
  }, [draft]);

  useEffect(() => {
    const onMsg = e => {
      if (e.origin === window.location.origin && e.data?.type === PREVIEW_READY) {
        ready.current = true;
        push();
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [push]);

  useEffect(() => {
    const t = setTimeout(push, 250);
    return () => clearTimeout(t);
  }, [push]);

  return (
    <div className="flex h-full flex-col border-l border-white/10 bg-ink">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 text-xs text-slate-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-mint" /> Live preview (unsaved draft)
        <button type="button" onClick={onClose} className="ml-auto rounded-lg px-2 py-1 hover:bg-white/10 hover:text-white">
          <i className="ri-close-line" />
        </button>
      </div>
      <div className="flex flex-1 items-start justify-center overflow-hidden bg-[radial-gradient(circle_at_center,var(--color-ink-2),var(--color-ink))] p-3">
        <iframe ref={frame} title="Site preview" src="/?preview=1" className={`h-full rounded-xl border border-white/10 bg-ink transition-all duration-500 ${device === 'mobile' ? 'w-[390px]' : 'w-full'}`} />
      </div>
    </div>
  );
}

/* ---------------- Toasts ---------------- */

function Toasts({ items, dismiss }) {
  const colors = { success: 'border-mint/40 text-mint', error: 'border-rose/40 text-rose', info: 'border-cyan/40 text-cyan' };
  const icons = { success: 'ri-checkbox-circle-line', error: 'ri-error-warning-line', info: 'ri-information-line' };
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2">
      <AnimatePresence>
        {items.map(t => (
          <motion.div key={t.id} layout initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }} className={`flex items-start gap-3 rounded-2xl border bg-ink-2/95 p-4 text-sm shadow-2xl backdrop-blur ${colors[t.kind]}`}>
            <i className={`${icons[t.kind]} mt-0.5 text-lg`} />
            <span className="flex-1 text-slate-200">{t.text}</span>
            <button type="button" onClick={() => dismiss(t.id)} className="text-slate-500 hover:text-white">
              <i className="ri-close-line" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- App ---------------- */

export default function Admin() {
  const [auth, setAuth] = useState(null);
  const [saved, setSaved] = useState(null);
  const [draft, setDraft] = useState(null);
  const [version, setVersion] = useState(null);
  const [active, setActive] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [restore, setRestore] = useState(null);
  const [preview, setPreview] = useState(() => window.innerWidth > 1280);
  const [device, setDevice] = useState('desktop');
  const [navOpen, setNavOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [previews, setPreviews] = useState({});

  const toast = useCallback((kind, text) => {
    const id = Math.random();
    setToasts(t => [...t, { id, kind, text }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), kind === 'error' ? 8000 : 4500);
  }, []);

  const ctx = useMemo(() => ({ toast, previews, addPreview: (url, data) => setPreviews(p => ({ ...p, [url]: data })) }), [toast, previews]);

  const checkAuth = useCallback(async () => {
    try {
      setAuth(await api('/api/auth'));
    } catch (err) {
      setAuth({ authed: false, configured: false, error: err.message });
    }
  }, []);

  const load = useCallback(async () => {
    setLoadError('');
    try {
      const data = await api('/api/content');
      setSaved(data.content);
      setDraft(clone(data.content));
      setVersion(data.version);
      setAuth(a => ({ ...a, storage: data.mode }));
      const local = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
      if (local?.draft && JSON.stringify(local.draft) !== JSON.stringify(data.content)) setRestore({ ...local, stale: local.version !== data.version });
    } catch (err) {
      if (err.status === 401) setAuth(a => ({ ...a, authed: false }));
      else setLoadError(err.message);
    }
  }, []);

  useEffect(() => {
    document.title = 'Admin · Portfolio';
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (auth?.authed && !saved) load();
  }, [auth?.authed, saved, load]);

  const theme = useTheme();
  const dirty = useMemo(() => draft && saved && JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  useEffect(() => {
    if (!draft || !version) return;
    if (dirty) localStorage.setItem(DRAFT_KEY, JSON.stringify({ version, draft }));
    else localStorage.removeItem(DRAFT_KEY);
  }, [draft, dirty, version]);

  useEffect(() => {
    const onBeforeUnload = e => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const save = useCallback(async () => {
    if (!dirty || saving) return;
    if (!draft.profile?.name?.trim()) return toast('error', 'Profile name is required.');
    setSaving(true);
    try {
      const res = await api('/api/content', { method: 'PUT', body: JSON.stringify({ content: draft, version }) });
      setSaved(clone(draft));
      setVersion(res.version);
      localStorage.removeItem(DRAFT_KEY);
      toast('success', res.mode === 'github' ? 'Saved and committed to GitHub. Vercel will redeploy the live site in about a minute.' : 'Saved to src/data/content.json. The dev server reloads automatically.');
    } catch (err) {
      if (err.status === 401) setAuth(a => ({ ...a, authed: false }));
      toast('error', err.message);
    } finally {
      setSaving(false);
    }
  }, [dirty, saving, draft, version, toast]);

  useEffect(() => {
    const onKey = e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [save]);

  const logout = async () => {
    await api('/api/auth', { method: 'DELETE' }).catch(() => {});
    setSaved(null);
    setDraft(null);
    setAuth(a => ({ ...a, authed: false }));
  };

  if (!auth) return <div className="flex min-h-screen items-center justify-center bg-ink text-slate-500"><i className="ri-loader-4-line animate-spin text-2xl" /></div>;
  if (!auth.authed) return <Login configured={auth.configured} onDone={checkAuth} />;
  if (loadError)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink p-6 text-center">
        <i className="ri-error-warning-line text-4xl text-rose" />
        <p className="max-w-md text-slate-300">{loadError}</p>
        <button type="button" onClick={load} className="btn-primary">Retry</button>
      </div>
    );
  if (!draft) return <div className="flex min-h-screen items-center justify-center bg-ink text-slate-500"><i className="ri-loader-4-line animate-spin text-2xl" /></div>;

  const editor = ALL_EDITORS.find(e => e.id === active);
  const setPath = v => setDraft(d => ({ ...d, [editor.path]: v }));
  const countFor = e => (e.path && Array.isArray(draft[e.path]) ? draft[e.path].length : null);
  const changed = e => e.path && JSON.stringify(draft[e.path]) !== JSON.stringify(saved[e.path]);

  return (
    <div className="flex h-screen flex-col bg-ink text-slate-200">
      <header className="flex items-center gap-3 border-b border-white/10 bg-ink-2/80 px-4 py-3 backdrop-blur">
        <button type="button" className="text-xl text-slate-300 lg:hidden" onClick={() => setNavOpen(o => !o)} aria-label="Toggle navigation">
          <i className="ri-menu-2-line" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-mint via-cyan to-violet text-ink">
          <i className="ri-settings-4-line" />
        </div>
        <div className="hidden sm:block">
          <div className="font-display text-sm font-bold text-white">Portfolio Admin</div>
          <div className="text-[11px] text-slate-500">
            {auth.storage === 'github' ? 'Saving to GitHub → Vercel redeploy' : auth.storage === 'local' ? 'Dev mode: saving to local file' : 'Read-only: GITHUB_TOKEN missing'}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <AnimatePresence>
            {dirty && (
              <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="hidden items-center gap-1.5 rounded-full bg-amber/10 px-3 py-1 text-xs text-amber md:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-amber" /> Unsaved changes
              </motion.span>
            )}
          </AnimatePresence>
          <div className="hidden items-center rounded-xl border border-white/10 p-0.5 md:flex">
            <IconButton icon="ri-computer-line" label="Desktop preview" onClick={() => { setDevice('desktop'); setPreview(true); }} className={preview && device === 'desktop' ? '!text-mint' : ''} />
            <IconButton icon="ri-smartphone-line" label="Mobile preview" onClick={() => { setDevice('mobile'); setPreview(true); }} className={preview && device === 'mobile' ? '!text-mint' : ''} />
            <IconButton icon={preview ? 'ri-layout-right-2-fill' : 'ri-layout-right-2-line'} label="Toggle preview" onClick={() => setPreview(p => !p)} />
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="btn-ghost hidden !px-3 !py-2 text-xs sm:inline-flex">
            <i className="ri-external-link-line" /> Site
          </a>
          <button type="button" disabled={!dirty} onClick={() => setDraft(clone(saved))} className="btn-ghost !px-3 !py-2 text-xs disabled:opacity-40">
            <i className="ri-arrow-go-back-line" /> <span className="hidden sm:inline">Discard</span>
          </button>
          <button type="button" disabled={!dirty || saving || auth.storage === 'none'} onClick={save} className="btn-primary !px-4 !py-2 text-xs disabled:opacity-40" title="Ctrl + S">
            {saving ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-save-3-line" />} {saving ? 'Saving…' : 'Save & publish'}
          </button>
          <IconButton icon={theme === 'light' ? 'ri-moon-clear-line' : 'ri-sun-line'} label={theme === 'light' ? 'Dark theme' : 'Light theme'} onClick={toggleTheme} />
          <IconButton icon="ri-logout-box-r-line" label="Sign out" onClick={logout} />
        </div>
      </header>

      {restore && (
        <div className="flex flex-wrap items-center gap-3 border-b border-amber/20 bg-amber/10 px-4 py-2 text-sm text-amber">
          <i className="ri-history-line" /> You have unsaved edits from a previous session.
          {restore.stale && ' The saved content has changed since then; restoring will overwrite those changes when you save.'}
          <button type="button" className="rounded-lg bg-amber px-3 py-1 text-xs font-semibold text-ink" onClick={() => { setDraft(restore.draft); setRestore(null); }}>
            Restore
          </button>
          <button type="button" className="text-xs underline" onClick={() => { localStorage.removeItem(DRAFT_KEY); setRestore(null); }}>
            Dismiss
          </button>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <aside className={`${navOpen ? 'fixed inset-y-0 left-0 z-50 pt-16' : 'hidden'} w-64 shrink-0 overflow-y-auto border-r border-white/10 bg-ink-2 p-3 lg:static lg:block lg:pt-3`}>
          {GROUPS.map(g => (
            <div key={g.title} className="mb-5">
              <div className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600">{g.title}</div>
              {g.items.map(e => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => { setActive(e.id); setNavOpen(false); }}
                  className={`group relative mb-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${active === e.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  {active === e.id && <motion.span layoutId="admin-nav" className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-mint" />}
                  <i className={`${e.icon} text-base ${active === e.id ? 'text-mint' : ''}`} />
                  <span className="flex-1">{e.label}</span>
                  {changed(e) && <span className="h-1.5 w-1.5 rounded-full bg-amber" title="Unsaved changes" />}
                  {countFor(e) !== null && <span className="font-mono text-[10px] text-slate-600">{countFor(e)}</span>}
                </button>
              ))}
            </div>
          ))}
        </aside>

        <main className={`min-w-0 flex-1 overflow-y-auto ${preview ? 'xl:max-w-[640px] 2xl:max-w-[760px]' : ''}`}>
          <div className="mx-auto max-w-3xl p-5 md:p-8">
            <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <div className="mb-6 flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mint/10 text-2xl text-mint">
                  <i className={editor.icon} />
                </span>
                <div>
                  <h1 className="font-display text-2xl font-bold text-white">{editor.label}</h1>
                  {editor.description && <p className="mt-1 text-sm text-slate-400">{editor.description}</p>}
                </div>
              </div>

              {editor.kind === 'object' && <ObjectEditor editor={editor} value={draft[editor.path] || {}} onChange={setPath} ctx={ctx} />}
              {editor.kind === 'list' && <ListEditor key={editor.id} editor={editor} value={draft[editor.path] || []} onChange={setPath} ctx={ctx} />}
              {editor.kind === 'strings' && <StringList value={draft[editor.path] || []} onChange={setPath} placeholder="Add item" />}
              {editor.kind === 'sections' && <SectionsEditor value={draft.sections} onChange={setPath} />}
              {editor.kind === 'json' && <JsonEditor draft={draft} setDraft={setDraft} ctx={ctx} />}
            </motion.div>
          </div>
        </main>

        {preview && (
          <div className="hidden min-w-0 flex-1 md:block">
            <Preview draft={draft} device={device} onClose={() => setPreview(false)} />
          </div>
        )}
      </div>

      <Toasts items={toasts} dismiss={id => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  );
}
