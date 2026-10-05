import { useContent } from '../lib/content';
import CardSwap, { Card } from '../components/reactbits/CardSwap';
import { Reveal, SectionHeading } from './ui';

const ACCENTS = ['#34d399', '#22d3ee', '#a78bfa', '#fbbf24', '#fb7185'];

export default function Testimonials({ index }) {
  const { testimonials } = useContent();
  if (!testimonials.length) return null;

  return (
    <section id="testimonials" className="section-pad overflow-hidden">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading index={index} eyebrow="Kind words" title="What people" accent="say." description="Feedback from teammates, students and clients I've worked with." />
          <Reveal>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex -space-x-2">
                {testimonials.slice(0, 4).map((t, i) => (
                  <span key={t.id || i} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink font-display text-sm font-bold text-ink" style={{ background: ACCENTS[i % ACCENTS.length] }}>
                    {t.author?.[0] || '?'}
                  </span>
                ))}
              </div>
              <span>
                {testimonials.length} reviews · <span className="text-amber">★ 5.0</span>
              </span>
            </div>
          </Reveal>
        </div>

        <div className="relative h-[420px] md:h-[480px] lg:mr-32">
          <CardSwap key={testimonials.length} width={420} height={300} cardDistance={50} verticalDistance={60} delay={4500} pauseOnHover skewAmount={5}>
            {testimonials.map((t, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              return (
                <Card key={t.id || i} customClass="cursor-target !border-white/10 !bg-ink-2 overflow-hidden p-7 flex flex-col">
                  <div className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
                  <i className="ri-double-quotes-l text-4xl" style={{ color: accent }} />
                  <p className="mt-3 flex-1 font-display text-lg leading-snug text-white md:text-xl">{t.quote}</p>
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
      </div>
    </section>
  );
}
