import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { useContent } from '../lib/content';
import { scrollToId } from '../lib/scroll';
import Dock from '../components/reactbits/Dock';
import ScrollVelocity from '../components/reactbits/ScrollVelocity';

export function Loader({ onDone }) {
  const { profile } = useContent();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const total = 1500;
    const tick = now => {
      const p = Math.min(1, (now - start) / total);
      setPct(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-ink"
      exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.9, ease: [0.7, 0, 0.2, 1] } }}
      style={{ clipPath: 'inset(0 0 0% 0)' }}
    >
      <div className="relative h-40 w-40" style={{ perspective: 600 }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: ['#34d399', '#22d3ee', '#a78bfa'][i], transformStyle: 'preserve-3d' }}
            animate={{ rotateX: [0, 360], rotateY: [i * 60, i * 60 + 360] }}
            transition={{ duration: 2.4 + i * 0.4, repeat: Infinity, ease: 'linear' }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center font-display text-3xl font-bold text-white">{pct}</div>
      </div>
      <div className="mt-10 font-mono text-xs uppercase tracking-[0.4em] text-slate-500">
        Loading {profile.name.split(' ')[0]}.data
      </div>
      <div className="mt-4 h-px w-56 overflow-hidden bg-white/10">
        <div className="h-full bg-gradient-to-r from-mint via-cyan to-violet" style={{ width: `${pct}%` }} />
      </div>
    </motion.div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return <motion.div style={{ scaleX }} className="fixed left-0 right-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-mint via-cyan to-violet" />;
}

function useNavItems() {
  const { sections } = useContent();
  return [{ id: 'top', label: 'Home', icon: 'ri-home-5-line' }, ...sections.filter(s => s.visible)];
}

export function TopBar() {
  const { profile } = useContent();
  const items = useNavItems();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const initials = profile.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = id => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}>
        <div className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 md:px-8`}>
          <button type="button" onClick={() => go('top')} className="cursor-target group flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-mint via-cyan to-violet font-display text-sm font-extrabold text-ink transition-transform duration-500 group-hover:rotate-[360deg]">
              {initials}
            </span>
            <span className={`hidden font-display text-lg font-bold text-white transition-opacity sm:block ${scrolled ? 'opacity-0' : 'opacity-100'}`}>
              {profile.name}
            </span>
          </button>
          <div className="flex items-center gap-2">
            <a href={profile.resume} download className="btn-ghost cursor-target hidden !px-4 !py-2 text-sm md:inline-flex">
              <i className="ri-file-user-line" /> Resume
            </a>
            <button type="button" onClick={() => go('contact')} className="btn-primary cursor-target hidden !px-5 !py-2 text-sm md:inline-flex">
              Hire me <i className="ri-arrow-right-up-line" />
            </button>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="glass flex h-11 w-11 items-center justify-center rounded-xl text-xl text-white md:hidden"
            >
              <i className="ri-menu-4-line" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex flex-col bg-ink/95 p-6 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="ml-auto flex h-11 w-11 items-center justify-center rounded-xl text-2xl text-white">
              <i className="ri-close-line" />
            </button>
            <nav className="mt-6 flex flex-col gap-2">
              {items.map((item, i) => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center gap-4 rounded-2xl px-4 py-3 text-left font-display text-3xl font-bold text-white active:bg-white/5"
                >
                  <i className={`${item.icon} text-xl text-mint`} /> {item.label}
                </motion.button>
              ))}
            </nav>
            <a href={profile.resume} download className="btn-primary mt-auto">
              <i className="ri-download-2-line" /> Download CV
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function DockNav() {
  const items = useNavItems();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          aria-label="Section navigation"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-50 hidden h-[130px] md:block"
        >
          <div className="pointer-events-auto absolute bottom-0 left-1/2 -translate-x-1/2">
            <Dock
              items={items.map(item => ({
                icon: <i className={`${item.icon} text-xl text-slate-200`} />,
                label: item.label,
                onClick: () => scrollToId(item.id),
                className: 'cursor-target !bg-ink-2/90 !border-white/10 hover:!border-mint/60'
              }))}
              className="glass !border !border-white/10 !bg-ink/70"
              panelHeight={64}
              baseItemSize={46}
              magnification={68}
              dockHeight={120}
            />
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

export function Marquee() {
  const { marquee } = useContent();
  if (!marquee?.length) return null;
  const line = `${marquee.join('  ✦  ')}  ✦  `;
  return (
    <div className="velocity-rows relative z-10 -my-6 -rotate-2 border-y border-white/10 bg-ink-2/80 py-6 backdrop-blur" aria-hidden>
      <ScrollVelocity texts={[line, line]} velocity={60} className="px-4 font-display uppercase tracking-tight" />
    </div>
  );
}
