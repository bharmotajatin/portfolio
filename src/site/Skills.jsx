import { motion } from 'motion/react';
import { useContent } from '../lib/content';
import SpotlightCard from '../components/reactbits/SpotlightCard';
import LogoLoop from '../components/reactbits/LogoLoop';
import SkillSphere from './SkillSphere';
import { Reveal, SectionHeading, TiltCard } from './ui';

const hexToRgba = (hex, a) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export default function Skills({ index }) {
  const { skills } = useContent();
  const total = skills.reduce((n, s) => n + s.items.length, 0);
  const logos = skills.flatMap(s =>
    s.items.slice(0, 4).map(name => ({
      node: (
        <span className="inline-flex items-center gap-2 font-display text-xl font-semibold text-slate-400 transition-colors hover:text-white">
          <i className={s.icon} style={{ color: s.color }} /> {name}
        </span>
      ),
      title: name
    }))
  );

  return (
    <section id="skills" className="relative overflow-hidden">
      <div className="section-pad">
        <SectionHeading
          index={index}
          eyebrow="Toolbox"
          title="Skills in"
          accent="orbit."
          description={`${total}+ tools and methods across ${skills.length} disciplines. Drag the sphere, hover a skill to focus it.`}
        />

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
          <Reveal>
            <div className="mx-auto max-w-[560px]">
              <SkillSphere skills={skills} />
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map((cat, i) => (
              <Reveal key={cat.id || cat.name} delay={i * 0.06}>
                <TiltCard max={8} className="h-full rounded-3xl">
                  <SpotlightCard
                    className="cursor-target h-full !rounded-3xl !border-white/10 !bg-ink-2/80 !p-5"
                    spotlightColor={hexToRgba(cat.color, 0.22)}
                  >
                    <div className="mb-4 flex items-center justify-between" style={{ transform: 'translateZ(30px)' }}>
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                          style={{ background: hexToRgba(cat.color, 0.14), color: cat.color }}
                        >
                          <i className={cat.icon} />
                        </span>
                        <h3 className="font-display text-lg font-bold text-white">{cat.name}</h3>
                      </div>
                      <span className="font-mono text-xs" style={{ color: cat.color }}>
                        {cat.level}%
                      </span>
                    </div>
                    <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${hexToRgba(cat.color, 0.4)}, ${cat.color})` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${cat.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, delay: 0.2 + i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.items.map(item => (
                        <span
                          key={item}
                          className="rounded-md border px-2 py-0.5 text-xs text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:text-white"
                          style={{ borderColor: hexToRgba(cat.color, 0.25), background: hexToRgba(cat.color, 0.06) }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </SpotlightCard>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="border-y border-white/5 bg-ink-2/40 py-8">
        <LogoLoop logos={logos} speed={60} direction="left" logoHeight={28} gap={56} pauseOnHover scaleOnHover fadeOut fadeOutColor="#05060a" ariaLabel="Technologies" />
      </div>
    </section>
  );
}
