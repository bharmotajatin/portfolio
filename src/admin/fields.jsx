import { useId, useRef, useState } from 'react';
import { ICON_PICKS } from './schema';

export const inputCls =
  'w-full rounded-xl border border-white/10 bg-ink px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-mint/60 focus:shadow-[0_0_0_3px_rgba(52,211,153,0.12)]';

export function IconButton({ icon, label, onClick, danger, disabled, className = '' }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-base transition disabled:opacity-30 ${danger ? 'text-slate-400 hover:bg-rose/15 hover:text-rose' : 'text-slate-400 hover:bg-white/10 hover:text-white'} ${className}`}
    >
      <i className={icon} />
    </button>
  );
}

const move = (arr, from, to) => {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

function TagsField({ value = [], onChange }) {
  const [draft, setDraft] = useState('');
  const add = raw => {
    const parts = raw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .filter(s => !value.includes(s));
    if (parts.length) onChange([...value, ...parts]);
    setDraft('');
  };
  return (
    <div className={`${inputCls} flex flex-wrap gap-1.5 !p-2`}>
      {value.map((t, i) => (
        <span key={`${t}-${i}`} className="group inline-flex items-center gap-1 rounded-lg bg-white/10 py-1 pl-2.5 pr-1 text-xs text-slate-200">
          {t}
          <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((_, j) => j !== i))} className="flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-rose/20 hover:text-rose">
            <i className="ri-close-line" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add(draft);
          } else if (e.key === 'Backspace' && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => draft && add(draft)}
        placeholder={value.length ? 'Add…' : 'Type and press Enter'}
        className="min-w-[120px] flex-1 bg-transparent px-1.5 py-1 text-sm text-white outline-none placeholder:text-slate-600"
      />
    </div>
  );
}

export function StringList({ value = [], onChange, placeholder = 'New item' }) {
  return (
    <div className="space-y-2">
      {value.map((v, i) => (
        <div key={i} className="flex items-start gap-1.5">
          <span className="mt-2.5 w-5 shrink-0 text-right font-mono text-[11px] text-slate-600">{i + 1}</span>
          <textarea rows={Math.min(4, Math.max(1, Math.ceil(v.length / 70)))} className={`${inputCls} resize-y`} value={v} onChange={e => onChange(value.map((x, j) => (j === i ? e.target.value : x)))} />
          <div className="flex shrink-0 flex-col">
            <IconButton icon="ri-arrow-up-s-line" label="Move up" disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))} />
            <IconButton icon="ri-arrow-down-s-line" label="Move down" disabled={i === value.length - 1} onClick={() => onChange(move(value, i, i + 1))} />
          </div>
          <IconButton icon="ri-delete-bin-6-line" label="Remove" danger onClick={() => onChange(value.filter((_, j) => j !== i))} className="mt-1" />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, ''])} className="ml-6 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/15 px-3 py-1.5 text-xs text-slate-400 transition hover:border-mint/50 hover:text-mint">
        <i className="ri-add-line" /> {placeholder}
      </button>
    </div>
  );
}

function IconField({ value = '', onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex gap-2">
        <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-ink text-xl text-mint">
          <i className={value} />
        </span>
        <input className={inputCls} value={value} onChange={e => onChange(e.target.value)} placeholder="ri-…-line" />
        <button type="button" onClick={() => setOpen(o => !o)} className="shrink-0 rounded-xl border border-white/10 px-3 text-xs text-slate-300 hover:bg-white/5">
          {open ? 'Close' : 'Pick'}
        </button>
      </div>
      {open && (
        <div className="mt-2 grid grid-cols-8 gap-1 rounded-xl border border-white/10 bg-ink p-2 sm:grid-cols-12">
          {ICON_PICKS.map(ic => (
            <button
              key={ic}
              type="button"
              title={ic}
              onClick={() => {
                onChange(ic);
                setOpen(false);
              }}
              className={`flex aspect-square items-center justify-center rounded-lg text-lg transition hover:bg-white/10 ${ic === value ? 'bg-mint/20 text-mint' : 'text-slate-300'}`}
            >
              <i className={ic} />
            </button>
          ))}
          <a href="https://remixicon.com" target="_blank" rel="noreferrer" className="col-span-full mt-1 text-center text-[11px] text-slate-500 hover:text-mint">
            Browse all icons at remixicon.com ↗
          </a>
        </div>
      )}
    </div>
  );
}

function ColorField({ value = '#22d3ee', onChange }) {
  return (
    <div className="flex gap-2">
      <label className="relative h-[42px] w-[42px] shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/10" style={{ background: value }}>
        <input type="color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#22d3ee'} onChange={e => onChange(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
      </label>
      <input className={inputCls} value={value} onChange={e => onChange(e.target.value)} />
      <div className="flex shrink-0 gap-1">
        {['#34d399', '#22d3ee', '#a78bfa', '#fbbf24', '#fb7185', '#60a5fa'].map(c => (
          <button key={c} type="button" aria-label={c} onClick={() => onChange(c)} className="h-[42px] w-6 rounded-lg border border-white/10 transition hover:scale-110" style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}

const readAsDataUrl = file =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

function UploadField({ value = '', onChange, accept, image, ctx }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const shown = ctx.previews[value] || value;

  const upload = async file => {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) return ctx.toast('error', 'File is larger than 3 MB.');
    setBusy(true);
    try {
      const data = await readAsDataUrl(file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, data })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Upload failed');
      ctx.addPreview(body.url, data);
      onChange(body.url);
      ctx.toast('success', body.mode === 'github' ? 'Uploaded to GitHub. It goes live with the next deploy.' : 'Uploaded to public/uploads.');
    } catch (err) {
      ctx.toast('error', err.message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };

  return (
    <div className="flex items-start gap-3">
      {image ? (
        <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-ink">
          {shown ? <img src={shown} alt="" className="h-full w-full object-cover" /> : <i className="ri-image-line text-2xl text-slate-600" />}
        </div>
      ) : (
        <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-ink text-xl text-rose">
          <i className="ri-file-pdf-2-line" />
        </div>
      )}
      <div className="flex-1 space-y-2">
        <input className={inputCls} value={value} onChange={e => onChange(e.target.value)} placeholder="/uploads/… or https://…" />
        <div className="flex flex-wrap gap-2">
          <input ref={input} type="file" accept={accept} className="hidden" onChange={e => upload(e.target.files?.[0])} />
          <button type="button" disabled={busy} onClick={() => input.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white transition hover:bg-white/15 disabled:opacity-50">
            <i className={busy ? 'ri-loader-4-line animate-spin' : 'ri-upload-cloud-2-line'} /> {busy ? 'Uploading…' : 'Upload'}
          </button>
          {value && (
            <>
              <a href={shown} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white">
                <i className="ri-eye-line" /> Open
              </a>
              <button type="button" onClick={() => onChange('')} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-rose">
                <i className="ri-close-line" /> Clear
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function NestedList({ field, value = [], onChange, ctx }) {
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-ink/60 p-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex-1 truncate text-sm font-medium text-white">{field.itemLabel?.(item) || `Item ${i + 1}`}</span>
            <IconButton icon="ri-arrow-up-s-line" label="Move up" disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))} />
            <IconButton icon="ri-arrow-down-s-line" label="Move down" disabled={i === value.length - 1} onClick={() => onChange(move(value, i, i + 1))} />
            <IconButton icon="ri-delete-bin-6-line" label="Remove" danger onClick={() => onChange(value.filter((_, j) => j !== i))} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {field.fields.map(f => (
              <Field key={f.key} field={f} value={item[f.key]} ctx={ctx} onChange={v => onChange(value.map((x, j) => (j === i ? { ...x, [f.key]: v } : x)))} />
            ))}
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, field.newItem()])} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/15 px-3 py-1.5 text-xs text-slate-400 transition hover:border-mint/50 hover:text-mint">
        <i className="ri-add-line" /> Add
      </button>
    </div>
  );
}

export function Field({ field, value, onChange, ctx }) {
  const id = useId();
  const wide = ['textarea', 'stringList', 'tags', 'list', 'image', 'file', 'icon', 'color'].includes(field.type);
  let control;
  switch (field.type) {
    case 'textarea':
      control = <textarea id={id} rows={field.rows || 3} className={`${inputCls} resize-y leading-relaxed`} value={value ?? ''} onChange={e => onChange(e.target.value)} />;
      break;
    case 'number':
      control = <input id={id} type="number" className={inputCls} value={value ?? 0} onChange={e => onChange(e.target.value === '' ? 0 : Number(e.target.value))} />;
      break;
    case 'range':
      control = (
        <div className="flex items-center gap-3">
          <input id={id} type="range" min={field.min} max={field.max} value={value ?? field.min} onChange={e => onChange(Number(e.target.value))} className="flex-1 accent-[#34d399]" />
          <span className="w-10 text-right font-mono text-sm text-mint">{value}</span>
        </div>
      );
      break;
    case 'bool':
      control = (
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          onClick={() => onChange(!value)}
          className={`relative h-7 w-12 rounded-full transition ${value ? 'bg-mint' : 'bg-white/15'}`}
        >
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${value ? 'left-6' : 'left-1'}`} />
        </button>
      );
      break;
    case 'tags':
      control = <TagsField value={value || []} onChange={onChange} />;
      break;
    case 'stringList':
      control = <StringList value={value || []} onChange={onChange} />;
      break;
    case 'icon':
      control = <IconField value={value} onChange={onChange} />;
      break;
    case 'color':
      control = <ColorField value={value} onChange={onChange} />;
      break;
    case 'image':
      control = <UploadField value={value} onChange={onChange} accept="image/*" image ctx={ctx} />;
      break;
    case 'file':
      control = <UploadField value={value} onChange={onChange} accept={field.accept} ctx={ctx} />;
      break;
    case 'list':
      control = <NestedList field={field} value={value || []} onChange={onChange} ctx={ctx} />;
      break;
    default:
      control = (
        <>
          <input id={id} type={field.type === 'url' ? 'url' : 'text'} className={inputCls} value={value ?? ''} onChange={e => onChange(e.target.value)} list={field.suggestions ? `${id}-list` : undefined} />
          {field.suggestions && (
            <datalist id={`${id}-list`}>
              {field.suggestions.map(s => (
                <option key={s} value={s} />
              ))}
            </datalist>
          )}
        </>
      );
  }
  const missing = field.required && !String(value ?? '').trim();
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1 text-xs font-medium text-slate-400">
        {field.label}
        {field.required && <span className="text-rose">*</span>}
      </label>
      {control}
      {missing && <p className="mt-1 text-xs text-rose">Required</p>}
    </div>
  );
}
