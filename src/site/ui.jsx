import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';
import DecryptedText from '../components/reactbits/DecryptedText';
import { GhostIndex } from './scrollfx';

export function SectionHeading({ index, eyebrow, title, accent, description, align = 'left' }) {
  const centered = align === 'center';
  return (
    <div className={`relative isolate mb-14 md:mb-20 ${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
      <GhostIndex index={index} align={align} />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className={`mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-mint ${centered ? 'justify-center' : ''}`}
      >
        <span className="text-slate-500">{String(index).padStart(2, '0')}</span>
        <span className="h-px w-10 bg-gradient-to-r from-mint to-transparent" />
        <DecryptedText text={eyebrow} animateOn="view" speed={40} sequential revealDirection="start" encryptedClassName="text-slate-600" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 40, rotateX: -35 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ transformPerspective: 900, transformOrigin: 'bottom' }}
        className="font-display text-4xl font-bold leading-[1.02] tracking-tight text-white md:text-6xl lg:text-7xl"
      >
        {title} {accent && <span className="text-gradient">{accent}</span>}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 text-lg leading-relaxed text-slate-400"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

export function TiltCard({ children, className = '', max = 10, glare = true, scale = 1.02, style }) {
  const ref = useRef(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const s = useSpring(1, spring);
  const gx = useTransform(px, v => `${v * 100}%`);
  const gy = useTransform(py, v => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(600px circle at ${gx} ${gy}, rgba(255,255,255,0.14), transparent 45%)`;
  const glareOpacity = useSpring(0, spring);

  const onMove = e => {
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onEnter = () => {
    s.set(scale);
    glareOpacity.set(1);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    s.set(1);
    glareOpacity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, scale: s, transformPerspective: 1000, transformStyle: 'preserve-3d', ...style }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
          style={{ background: glareBg, opacity: glareOpacity }}
        />
      )}
    </motion.div>
  );
}

const METRIC = /(~?\d[\d.,]*\s?%|\d+\+|\b\d{2,}\b(?!\s?(?:\/|–|-)\s?\d))/g;

export function Metrics({ text }) {
  const parts = String(text).split(METRIC);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-semibold text-mint">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export function Reveal({ children, delay = 0, y = 30, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const external = url => /^https?:\/\//.test(url || '');
