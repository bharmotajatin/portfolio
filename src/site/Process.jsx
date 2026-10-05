import { useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { useContent } from '../lib/content';
import { Reveal, SectionHeading } from './ui';

const PALETTE = ['#34d399', '#22d3ee', '#a78bfa', '#fbbf24', '#fb7185'];
const WIDE = '(min-width: 768px)';

const useWide = () =>
  useSyncExternalStore(
    cb => {
      const mq = window.matchMedia(WIDE);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia(WIDE).matches
  );

function StepCard({ step, i, progress, count }) {
  const color = step.color || PALETTE[i % PALETTE.length];
  const at = count > 1 ? i / (count - 1) : 0.5;
  const fallback = useMotionValue(at);
  const p = progress || fallback;
  const rotateY = useTransform(p, [at - 0.35, at, at + 0.35], [-22, 0, 22]);
  const scale = useTransform(p, [at - 0.35, at, at + 0.35], [0.9, 1, 0.9]);
  const glow = useTransform(p, [at - 0.2, at, at + 0.2], [0.15, 1, 0.15]);

  return (
    <motion.article
      style={progress ? { rotateY, scale, transformPerspective: 1200 } : undefined}
      className="cursor-target group relative flex h-full w-full shrink-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-2/80 p-7 backdrop-blur md:h-[360px] md:w-[400px]"
    >
      <motion.div
        aria-hidden
        style={{ opacity: glow, background: `${color}33` }}
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-6 right-4 select-none font-display text-[8rem] font-extrabold leading-none text-transparent transition-transform duration-500 group-hover:-translate-y-2"
        style={{ WebkitTextStroke: `1px ${color}40` }}
      >
        {String(i + 1).padStart(2, '0')}
      </span>
      <div className="relative flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" style={{ background: `${color}1f`, color }}>
          <i className={step.icon || 'ri-checkbox-circle-line'} />
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color }}>
          Step {String(i + 1).padStart(2, '0')}
        </span>
      </div>
      <h3 className="relative mt-6 font-display text-2xl font-bold text-white md:text-3xl">{step.title}</h3>
      <p className="relative mt-3 leading-relaxed text-slate-400">{step.description}</p>
      {step.tools?.length > 0 && (
        <div className="relative mt-auto flex flex-wrap gap-1.5 pt-6">
          {step.tools.map(t => (
            <span key={t} className="rounded-md border px-2 py-0.5 text-xs text-slate-300" style={{ borderColor: `${color}40`, background: `${color}0f` }}>
              {t}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  );
}

function PinnedTrack({ steps, index }) {
  const section = useRef(null);
  const track = useRef(null);
  const distance = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  const x = useTransform(() => -progress.get() * distance.get());
  const bar = useTransform(progress, [0, 1], ['0%', '100%']);

  useLayoutEffect(() => {
    const measure = () => distance.set(Math.max(0, track.current.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [distance, steps.length]);

  return (
    <section id="process" ref={section} className="relative" style={{ height: `${100 + steps.length * 45}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-8 [&>div]:!mb-10">
          <SectionHeading index={index} eyebrow="How I work" title="From question to" accent="decision." />
        </div>
        <motion.div ref={track} style={{ x }} className="flex w-max gap-6 pl-[max(2rem,calc((100vw-80rem)/2+2rem))] pr-[30vw]">
          {steps.map((s, i) => (
            <StepCard key={s.id || s.title} step={s} i={i} progress={progress} count={steps.length} />
          ))}
        </motion.div>
        <div className="mx-auto mt-10 flex w-full max-w-7xl items-center gap-4 px-8">
          <span className="font-mono text-xs text-slate-500">01</span>
          <div className="h-px flex-1 overflow-hidden bg-white/10">
            <motion.div style={{ width: bar }} className="h-full bg-gradient-to-r from-mint via-cyan to-violet" />
          </div>
          <span className="font-mono text-xs text-slate-500">{String(steps.length).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  );
}

export default function Process({ index }) {
  const { process: steps = [] } = useContent();
  const wide = useWide();
  const still = useReducedMotion();
  if (!steps.length) return null;
  if (wide && !still) return <PinnedTrack steps={steps} index={index} />;

  return (
    <section id="process" className="section-pad">
      <SectionHeading index={index} eyebrow="How I work" title="From question to" accent="decision." />
      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((s, i) => (
          <Reveal key={s.id || s.title} delay={i * 0.05}>
            <StepCard step={s} i={i} count={steps.length} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

Process.pinned = true;
