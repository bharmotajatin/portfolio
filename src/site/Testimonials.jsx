import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useContent } from '../lib/content';
import { lockScroll } from '../lib/scroll';
import CardSwap, { Card } from '../components/reactbits/CardSwap';
import { Reveal, SectionHeading } from './ui';

const ACCENTS = ['#34d399', '#22d3ee', '#a78bfa', '#fbbf24', '#fb7185'];
const LOCAL_KEY = 'portfolio-my-feedback';

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch {
    return [];
  }
}

const field =
  'w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-mint/60 focus:shadow-[0_0_0_3px_rgba(52,211,153,0.12)]';

function FeedbackForm({ onClose, onAdded }) {
  const [form, setForm] = useState({ author: '', role: '', quote: '', rating: 5, website: '' });
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    lockScroll(true);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
  }, [onClose]);

  const submit = async e => {
    e.preventDefault();
    setStatus({ state: 'sending', message: '' });
    try {
      const res = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Something went wrong. Please try again.');
      if (body.entry) onAdded(body.entry);
      setStatus({ state: 'done', message: '' });
      setTimeout(onClose, 1600);
    } catch (err) {
      setStatus({ state: 'error', message: err.message });
    }
  };

  return (
    <motion.div className="fixed inset-0 z-[95] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-md" onClick={onClose} />
      <motion.form
        onSubmit={submit}
        initial={{ y: 40, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 40, scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-ink-2 p-6 shadow-2xl md:p-8"
        role="dialog"
        aria-modal="true"
        aria-label="Leave feedback"
        data-lenis-prevent
      >
        <button type="button" onClick={onClose} aria-label="Close" className="cursor-target absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-400 transition hover:rotate-90 hover:text-white">
          <i className="ri-close-line" />
        </button>

        <AnimatePresence mode="wait">
          {status.state === 'done' ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-mint/15 text-3xl text-mint">
                <i className="ri-check-line" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Thank you!</h3>
              <p className="mt-2 text-sm text-slate-400">Your card has joined the stack. It goes public once I&apos;ve reviewed it.</p>
            </motion.div>
          ) : (
            <motion.div key="form" exit={{ opacity: 0 }}>
              <h3 className="font-display text-2xl font-bold text-white">Leave feedback</h3>
              <p className="mt-1 text-sm text-slate-400">Worked with me? A line or two goes a long way.</p>

              <div className="mt-6 space-y-3">
                <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} star${n > 1 ? 's' : ''}`}
                      onMouseEnter={() => setHover(n)}
                      onClick={() => setForm(f => ({ ...f, rating: n }))}
                      className={`cursor-target text-2xl transition-transform hover:scale-110 ${(hover || form.rating) >= n ? 'text-amber' : 'text-slate-600'}`}
                    >
                      <i className="ri-star-fill" />
                    </button>
                  ))}
                </div>
                <textarea required minLength={10} maxLength={400} rows={4} placeholder="What was it like working together?" value={form.quote} onChange={set('quote')} className={`${field} resize-none`} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input required maxLength={60} placeholder="Your name" value={form.author} onChange={set('author')} className={field} />
                  <input maxLength={80} placeholder="Role · Company" value={form.role} onChange={set('role')} className={field} />
                </div>
                <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set('website')} className="hidden" />
              </div>

              {status.state === 'error' && <p className="mt-3 text-sm text-rose">{status.message}</p>}

              <button type="submit" disabled={status.state === 'sending'} className="btn-primary shine cursor-target mt-6 w-full disabled:opacity-60">
                {status.state === 'sending' ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-send-plane-2-line" />}
                {status.state === 'sending' ? 'Sending…' : 'Add to the stack'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </motion.div>
  );
}

export default function Testimonials({ index }) {
  const { testimonials: all } = useContent();
  const [mine, setMine] = useState(readLocal);
  const [open, setOpen] = useState(false);

  const published = useMemo(() => all.filter(t => !t.pending), [all]);
  const ownPending = mine.filter(m => !published.some(t => t.id === m.id));
  const testimonials = [...ownPending, ...published];

  const addMine = entry => {
    const next = [entry, ...mine.filter(m => m.id !== entry.id)].slice(0, 5);
    setMine(next);
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  const avg = published.length ? published.reduce((n, t) => n + (Number(t.rating) || 5), 0) / published.length : 5;

  return (
    <section id="testimonials" className="section-pad overflow-hidden">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading index={index} eyebrow="Kind words" title="What people" accent="say." description="Feedback from teammates, students and clients I've worked with." />
          <Reveal>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              {published.length > 0 && (
                <>
                  <div className="flex -space-x-2">
                    {published.slice(0, 5).map((t, i) => (
                      <span key={t.id || i} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink font-display text-sm font-bold text-ink" style={{ background: ACCENTS[i % ACCENTS.length] }}>
                        {t.author?.[0] || '?'}
                      </span>
                    ))}
                  </div>
                  <span>
                    {published.length} reviews · <span className="text-amber">★ {avg.toFixed(1)}</span>
                  </span>
                </>
              )}
              <button type="button" onClick={() => setOpen(true)} className="btn-ghost cursor-target !px-4 !py-2 text-sm">
                <i className="ri-chat-heart-line text-mint" /> Leave feedback
              </button>
            </div>
          </Reveal>
        </div>

        {testimonials.length > 0 && (
          <div className="relative h-[420px] md:h-[480px] lg:mr-32">
            <CardSwap key={testimonials.map(t => t.id).join()} width={420} height={300} cardDistance={50} verticalDistance={60} delay={2800} speed={2} pauseOnHover skewAmount={5}>
              {testimonials.map((t, i) => {
                const accent = ACCENTS[i % ACCENTS.length];
                return (
                  <Card key={t.id || i} customClass="cursor-target !border-white/10 !bg-ink-2 overflow-hidden p-7 flex flex-col">
                    <div className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
                    <div className="flex items-start justify-between">
                      <i className="ri-double-quotes-l text-4xl" style={{ color: accent }} />
                      {t.pending && (
                        <span className="rounded-full bg-amber/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-amber">
                          <i className="ri-time-line" /> Yours · in review
                        </span>
                      )}
                    </div>
                    <p className="mt-3 line-clamp-5 flex-1 font-display text-lg leading-snug text-white md:text-xl">{t.quote}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{t.author}</div>
                        <div className="text-xs text-slate-500">{t.role}</div>
                      </div>
                      <div className="text-amber">{'★'.repeat(Math.max(0, Math.min(5, Number(t.rating) || 5)))}</div>
                    </div>
                  </Card>
                );
              })}
            </CardSwap>
          </div>
        )}
      </div>

      {createPortal(<AnimatePresence>{open && <FeedbackForm onClose={() => setOpen(false)} onAdded={addMine} />}</AnimatePresence>, document.body)}
    </section>
  );
}
