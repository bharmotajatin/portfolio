import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useContent } from '../lib/content';
import Magnet from '../components/reactbits/Magnet';
import GradientText from '../components/reactbits/GradientText';
import { Reveal, TiltCard } from './ui';

export default function Contact({ index }) {
  const { profile, contact } = useContent();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle', text: '' });
  const [copied, setCopied] = useState(false);

  const update = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ state: 'error', text: 'Please fill in all fields.' });
      return;
    }
    if (!contact.formEndpoint) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus({ state: 'success', text: 'Opening your email app…' });
      return;
    }
    setStatus({ state: 'sending', text: 'Sending…' });
    try {
      const res = await fetch(contact.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error();
      setForm({ name: '', email: '', message: '' });
      setStatus({ state: 'success', text: "Message sent — I'll get back to you soon." });
    } catch {
      setStatus({ state: 'error', text: `Couldn't send. Email me directly at ${profile.email}.` });
    }
  };

  const copyEmail = async () => {
    await navigator.clipboard?.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const field =
    'w-full rounded-2xl border border-white/10 bg-ink/60 px-5 py-4 text-white placeholder:text-slate-600 outline-none transition-all duration-300 focus:border-mint/60 focus:bg-ink focus:shadow-[0_0_0_4px_rgba(52,211,153,0.12)]';

  return (
    <section id="contact" className="section-pad">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-ink-2/70 p-6 md:p-14">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-mint/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet/20 blur-[120px]" />

        <div className="relative grid gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-mint">
              <span className="text-slate-500">{String(index).padStart(2, '0')}</span> — Contact
            </div>
            <h2 className="font-display text-4xl font-bold leading-[1.02] tracking-tight text-white md:text-6xl">
              <GradientText colors={['#34d399', '#22d3ee', '#a78bfa', '#34d399']} animationSpeed={6} className="!mx-0 !justify-start">
                {contact.heading}
              </GradientText>
            </h2>
            <p className="mt-6 max-w-md text-lg text-slate-400">{contact.subheading}</p>

            <div className="mt-10 space-y-3">
              <TiltCard max={6} className="rounded-2xl">
                <button type="button" onClick={copyEmail} className="glass cursor-target group flex w-full items-center gap-4 rounded-2xl p-4 text-left">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint/10 text-xl text-mint">
                    <i className="ri-mail-line" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-xs text-slate-500">Email</span>
                    <span className="font-medium text-white">{profile.email}</span>
                  </span>
                  <span className="font-mono text-xs text-slate-500 transition-colors group-hover:text-mint">{copied ? 'Copied ✓' : 'Copy'}</span>
                </button>
              </TiltCard>
              {profile.phone && (
                <TiltCard max={6} className="rounded-2xl">
                  <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="glass cursor-target flex items-center gap-4 rounded-2xl p-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/10 text-xl text-cyan">
                      <i className="ri-phone-line" />
                    </span>
                    <span>
                      <span className="block text-xs text-slate-500">Phone</span>
                      <span className="font-medium text-white">{profile.phone}</span>
                    </span>
                  </a>
                </TiltCard>
              )}
              <TiltCard max={6} className="rounded-2xl">
                <div className="glass flex items-center gap-4 rounded-2xl p-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet/10 text-xl text-violet">
                    <i className="ri-map-pin-line" />
                  </span>
                  <span>
                    <span className="block text-xs text-slate-500">Based in</span>
                    <span className="font-medium text-white">{profile.location}</span>
                  </span>
                </div>
              </TiltCard>
            </div>

            <div className="mt-8 flex gap-3">
              {profile.socials?.map(s => (
                <Magnet key={s.url} padding={40} magnetStrength={3}>
                  <a
                    href={s.url}
                    target={s.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer"
                    aria-label={s.label}
                    className="glass cursor-target flex h-12 w-12 items-center justify-center rounded-full text-xl text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-mint/50 hover:text-mint"
                  >
                    <i className={s.icon} />
                  </a>
                </Magnet>
              ))}
            </div>
          </div>

          <Reveal>
            <form onSubmit={submit} className="glass space-y-4 rounded-3xl p-6 md:p-8" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-slate-500">Name</span>
                  <input className={field} value={form.name} onChange={update('name')} placeholder="Your name" autoComplete="name" />
                </label>
                <label className="block">
                  <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-slate-500">Email</span>
                  <input className={field} type="email" value={form.email} onChange={update('email')} placeholder="you@company.com" autoComplete="email" />
                </label>
              </div>
              <label className="block">
                <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-slate-500">Message</span>
                <textarea className={`${field} min-h-[180px] resize-none`} value={form.message} onChange={update('message')} placeholder="Tell me about the role or project…" />
              </label>
              <button type="submit" disabled={status.state === 'sending'} className="btn-primary shine cursor-target w-full !py-4 text-base disabled:opacity-60">
                {status.state === 'sending' ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-send-plane-2-line" />}
                Send message
              </button>
              <AnimatePresence>
                {status.text && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`text-center text-sm ${status.state === 'error' ? 'text-rose' : 'text-mint'}`}
                    role="status"
                  >
                    {status.text}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
