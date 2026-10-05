import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = time => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, [enabled]);
}

export function lockScroll(locked) {
  document.documentElement.style.overflow = locked ? 'hidden' : '';
  if (locked) lenis?.stop();
  else lenis?.start();
}

export function scrollToId(id) {
  const el = id === 'top' ? 0 : document.getElementById(id);
  if (el === null) return;
  const target = el === 0 ? 0 : el.closest('[data-scroll-anchor]') || el;
  if (lenis) lenis.scrollTo(target, { offset: id === 'top' ? 0 : -24 });
  else if (target === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
  else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
