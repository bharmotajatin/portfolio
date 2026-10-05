import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

const SMOOTH = { stiffness: 120, damping: 24, mass: 0.4 };

export function ScrollSection({ children }) {
  const ref = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.3'] });
  const p = useSpring(scrollYProgress, SMOOTH);
  const rotateX = useTransform(p, [0, 1], [14, 0]);
  const scale = useTransform(p, [0, 1], [0.9, 1]);
  const y = useTransform(p, [0, 1], [90, 0]);
  const opacity = useTransform(p, [0, 0.6], [0.25, 1]);

  if (still) return <div ref={ref}>{children}</div>;
  return (
    <div ref={ref} data-scroll-anchor style={{ perspective: 1400 }}>
      <motion.div style={{ rotateX, scale, y, opacity, transformOrigin: '50% 0%' }}>{children}</motion.div>
    </div>
  );
}

export function Parallax({ children, speed = 80, className = '' }) {
  const ref = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [speed, -speed]), SMOOTH);
  return (
    <motion.div ref={ref} style={still ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}

export function GhostIndex({ index, align = 'left' }) {
  const ref = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [140, -140]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);
  return (
    <motion.span
      ref={ref}
      aria-hidden
      style={still ? undefined : { y, rotate }}
      className={`pointer-events-none absolute -top-16 -z-10 select-none font-display text-[9rem] font-extrabold leading-none text-transparent [-webkit-text-stroke:1px_rgba(52,211,153,0.16)] md:-top-24 md:text-[15rem] ${align === 'center' ? 'left-1/2 -translate-x-1/2' : '-left-2 md:-left-6'}`}
    >
      {String(index).padStart(2, '0')}
    </motion.span>
  );
}
