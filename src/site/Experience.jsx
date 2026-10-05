import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useContent } from '../lib/content';
import { Metrics, SectionHeading, TiltCard } from './ui';

export default function Experience({ index }) {
  const { experience } = useContent();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <section id="experience" className="section-pad">
      <SectionHeading index={index} eyebrow="Career log" title="Where I've" accent="shipped." align="center" />

      <div ref={ref} className="relative">
        <div className="absolute bottom-0 left-4 top-0 w-px bg-white/10 md:left-1/2" />
        <motion.div style={{ scaleY }} className="absolute bottom-0 left-4 top-0 w-px origin-top bg-gradient-to-b from-mint via-cyan to-violet md:left-1/2" />

        <div className="space-y-12 md:space-y-20">
          {experience.map((job, i) => {
            const right = i % 2 === 1;
            return (
              <div key={job.id || i} className="relative grid md:grid-cols-2 md:gap-16">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  className="absolute left-4 top-8 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-2 border-mint bg-ink md:left-1/2"
                >
                  <span className={`h-2 w-2 rounded-full bg-mint ${job.end === 'Present' ? 'animate-pulse-ring' : ''}`} />
                </motion.span>

                <div className={`hidden items-start pt-6 md:flex ${right ? 'md:order-2 md:justify-start' : 'md:justify-end'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: right ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7 }}
                    className={right ? 'text-left' : 'text-right'}
                  >
                    <div className="font-display text-5xl font-bold text-white/10 lg:text-7xl">{job.start?.split(' ').pop()}</div>
                    <div className="font-mono text-sm text-slate-400">
                      {job.start} — {job.end}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">{job.location}</div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 50, rotateY: right ? -20 : 20 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{ transformPerspective: 1200 }}
                  className={`pl-12 md:pl-0 ${right ? 'md:order-1' : ''}`}
                >
                  <TiltCard max={6} className="glass shine cursor-target rounded-3xl p-6 transition-colors duration-500 hover:border-mint/30 md:p-8">
                    <div className="mb-1 font-mono text-xs text-mint md:hidden">
                      {job.start} — {job.end}
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white">{job.role}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-cyan">
                      <i className="ri-building-2-line" /> {job.company}
                    </div>
                    <ul className="mt-5 space-y-3">
                      {job.highlights?.map((h, j) => (
                        <motion.li
                          key={j}
                          initial={{ opacity: 0, x: -12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.25 + j * 0.1 }}
                          className="flex gap-3 text-sm leading-relaxed text-slate-300"
                        >
                          <i className="ri-arrow-right-s-fill mt-0.5 text-mint" />
                          <span>
                            <Metrics text={h} />
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                    {job.tags?.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {job.tags.map(t => (
                          <span key={t} className="chip">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </TiltCard>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
