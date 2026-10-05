import { useContent } from '../lib/content';
import { scrollToId } from '../lib/scroll';
import TiltedCard from '../components/reactbits/TiltedCard';
import ScrollReveal from '../components/reactbits/ScrollReveal';
import { Reveal, SectionHeading } from './ui';
import { Parallax } from './scrollfx';

const CARD_W = 'min(380px, 82vw)';
const CARD_H = 'min(500px, 108vw)';

function PortraitOverlay({ profile }) {
  return (
    <div className="relative overflow-hidden rounded-[15px]" style={{ width: CARD_W, height: CARD_H }}>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
      <div className="absolute inset-0 rounded-[15px] ring-1 ring-inset ring-white/15" />
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-ink/70 px-3 py-1.5 font-mono text-[11px] text-white backdrop-blur">
        <span className={`h-2 w-2 rounded-full ${profile.available ? 'animate-pulse-ring bg-mint' : 'bg-amber'}`} />
        {profile.available ? 'Available' : 'Busy'}
      </div>
      <div className="absolute inset-x-5 bottom-5">
        <div className="font-display text-3xl font-bold text-white">{profile.name}</div>
        <div className="mt-1 text-sm text-mint">{profile.roles?.slice(0, 2).join(' · ')}</div>
        <button
          type="button"
          onClick={() => scrollToId('contact')}
          className="cursor-target mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-mint hover:text-ink"
        >
          Say hello <i className="ri-arrow-right-up-line" />
        </button>
      </div>
    </div>
  );
}

export default function About({ index }) {
  const { profile, competencies } = useContent();

  return (
    <section id="about" className="section-pad">
      <div className="grid items-center gap-16 lg:grid-cols-[auto_1fr]">
        <Parallax speed={60} className="relative mx-auto">
          <Reveal className="relative">
            <div className="pointer-events-none absolute -inset-8 animate-spin-slow rounded-full border border-dashed border-mint/20" />
            <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-mint/30 via-cyan/10 to-violet/30 blur-3xl" />
            <div className="cursor-target relative">
              <TiltedCard
                imageSrc={profile.avatar}
                altText={profile.name}
                captionText={profile.location}
                containerHeight={CARD_H}
                containerWidth={CARD_W}
                imageHeight={CARD_H}
                imageWidth={CARD_W}
                rotateAmplitude={12}
                scaleOnHover={1.05}
                showMobileWarning={false}
                showTooltip
                displayOverlayContent
                overlayContent={<PortraitOverlay profile={profile} />}
              />
            </div>
          </Reveal>
        </Parallax>

        <div>
          <SectionHeading index={index} eyebrow="Who I am" title="Data meets" accent="systems." />
          <ScrollReveal
            baseOpacity={0.12}
            enableBlur
            baseRotation={2}
            blurStrength={6}
            containerClassName="!my-0"
            textClassName="!text-xl md:!text-2xl !font-normal !leading-relaxed text-slate-200"
          >
            {profile.about}
          </ScrollReveal>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {profile.highlights?.map((h, i) => (
              <Reveal key={h} delay={i * 0.08}>
                <div className="glass shine group flex h-full items-start gap-3 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-mint/40">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mint/10 text-mint transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <i className="ri-check-double-line" />
                  </span>
                  <span className="text-sm leading-relaxed text-slate-300">{h}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="chip">
                <i className="ri-map-pin-2-line text-mint" /> {profile.location}
              </span>
              <a href={`mailto:${profile.email}`} className="chip cursor-target">
                <i className="ri-mail-line text-cyan" /> {profile.email}
              </a>
              {competencies?.map(c => (
                <span key={c} className="chip">
                  <i className="ri-sparkling-2-line text-violet" /> {c}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
