import { useContent } from '../lib/content';
import GlareHover from '../components/reactbits/GlareHover';
import { Reveal, SectionHeading, TiltCard } from './ui';

export default function Education({ index }) {
  const { education, certifications } = useContent();

  return (
    <section id="education" className="section-pad">
      <SectionHeading index={index} eyebrow="Learning" title="Education &" accent="certifications." />

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          {education.map((ed, i) => (
            <Reveal key={ed.id || i} delay={i * 0.1}>
              <TiltCard max={6} glare={false} className="rounded-3xl">
                <GlareHover
                  width="100%"
                  height="auto"
                  background="rgba(11,13,20,0.85)"
                  borderRadius="24px"
                  borderColor="rgba(255,255,255,0.1)"
                  glareColor="#a7f3d0"
                  glareOpacity={0.25}
                  glareAngle={-35}
                  glareSize={260}
                  transitionDuration={900}
                  className="cursor-target !block"
                >
                  <div className="flex w-full flex-col gap-4 p-6 text-left md:flex-row md:items-start md:p-8">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mint/20 to-violet/20 text-2xl text-mint">
                      <i className="ri-graduation-cap-line" />
                    </span>
                    <div className="flex-1">
                      <div className="font-mono text-xs text-slate-500">
                        {ed.start} — {ed.end}
                      </div>
                      <h3 className="mt-1 font-display text-2xl font-bold text-white">{ed.degree}</h3>
                      <div className="mt-1 text-sm text-cyan">{ed.school}</div>
                      {ed.description && <p className="mt-3 text-sm leading-relaxed text-slate-400">{ed.description}</p>}
                    </div>
                    {ed.score && <span className="self-start rounded-full border border-mint/30 bg-mint/10 px-3 py-1 font-mono text-xs text-mint">{ed.score}</span>}
                  </div>
                </GlareHover>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <div className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {certifications.map((c, i) => {
            const Tag = c.url ? 'a' : 'div';
            return (
              <Reveal key={c.id || i} delay={i * 0.08}>
                <Tag
                  {...(c.url ? { href: c.url, target: '_blank', rel: 'noreferrer' } : {})}
                  className="glass shine group cursor-target flex items-center gap-4 rounded-2xl p-4 transition-all duration-500 hover:-translate-y-1 hover:border-violet/40"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet/10 text-xl text-violet transition-transform duration-500 group-hover:rotate-[20deg] group-hover:scale-110">
                    <i className="ri-award-line" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white">{c.name}</div>
                    <div className="text-xs text-slate-500">
                      {c.issuer}
                      {c.year ? ` · ${c.year}` : ''}
                    </div>
                  </div>
                  {c.url && <i className="ri-arrow-right-up-line text-slate-500 transition-colors group-hover:text-white" />}
                </Tag>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
