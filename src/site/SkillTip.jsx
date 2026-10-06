import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';

export function UsageDetails({ name, info }) {
  const places = [...info.roles.map(r => ({ ...r, icon: 'ri-briefcase-4-line' })), ...info.projects.map(p => ({ ...p, icon: 'ri-folder-chart-line' }))];
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: info.color }} />
        <span className="font-display text-sm font-bold text-white">{name}</span>
      </div>
      {info.note && <p className="mt-2 text-xs leading-relaxed text-slate-300">{info.note}</p>}
      {places.length > 0 && (
        <>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">Applied in</div>
          <ul className="mt-1.5 space-y-1.5">
            {places.slice(0, 4).map(p => (
              <li key={p.title + p.org} className="flex items-start gap-2 text-xs text-slate-300">
                <i className={`${p.icon} mt-px`} style={{ color: info.color }} />
                <span>
                  {p.title}
                  {p.org && <span className="text-slate-500"> · {p.org}</span>}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
      {!info.note && places.length === 0 && <p className="mt-2 text-xs text-slate-400">Part of my {info.category} toolkit.</p>}
    </>
  );
}

export default function SkillTip({ name, info, children }) {
  const [rect, setRect] = useState(null);
  const show = e => setRect(e.currentTarget.getBoundingClientRect());
  const hide = () => setRect(null);

  const width = 260;
  const left = rect ? Math.min(Math.max(12, rect.left + rect.width / 2 - width / 2), window.innerWidth - width - 12) : 0;
  const above = rect && rect.top > 220;

  return (
    <span onPointerEnter={show} onPointerLeave={hide} onFocus={show} onBlur={hide} tabIndex={0} className="outline-none">
      {children}
      {createPortal(
        <AnimatePresence>
          {rect && info && (
            <motion.div
              role="tooltip"
              initial={{ opacity: 0, y: above ? 6 : -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-none fixed z-[200] rounded-2xl border border-white/15 bg-ink-2 p-3.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)]"
              style={{ width, left, ...(above ? { bottom: window.innerHeight - rect.top + 10 } : { top: rect.bottom + 10 }) }}
            >
              <UsageDetails name={name} info={info} />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </span>
  );
}
