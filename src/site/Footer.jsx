import { useContent } from '../lib/content';
import { scrollToId } from '../lib/scroll';
import CircularText from '../components/reactbits/CircularText';

export default function Footer() {
  const { profile, sections } = useContent();

  return (
    <footer className="relative overflow-hidden border-t border-white/5 pb-32 pt-20 md:pb-40">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-[auto_1fr_auto] md:px-8">
        <button type="button" onClick={() => scrollToId('top')} className="cursor-target relative mx-auto h-[160px] w-[160px] md:mx-0" aria-label="Back to top">
          <CircularText text={`${profile.name.toUpperCase()} • DATA • SYSTEMS • `} spinDuration={18} onHover="speedUp" className="!h-[160px] !w-[160px] !font-mono !text-[11px] !text-slate-400" />
          <span className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-mint to-cyan text-2xl text-ink transition-transform duration-500 hover:-translate-y-1">
            <i className="ri-arrow-up-line" />
          </span>
        </button>

        <div className="text-center md:text-left">
          <p className="max-w-md text-slate-400 md:mx-0">{profile.summary}</p>
          <nav className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm md:justify-start">
            {sections
              .filter(s => s.visible)
              .map(s => (
                <button key={s.id} type="button" onClick={() => scrollToId(s.id)} className="link-underline cursor-target text-slate-400 hover:text-white">
                  {s.label}
                </button>
              ))}
          </nav>
        </div>

        <div className="flex justify-center gap-3 md:justify-end">
          {profile.socials?.map(s => (
            <a key={s.url} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} className="cursor-target flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-lg text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-mint hover:text-mint">
              <i className={s.icon} />
            </a>
          ))}
        </div>
      </div>

      <div className="pointer-events-none mt-16 select-none text-center font-display text-[17vw] font-extrabold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.08)]">
        {profile.name.split(' ')[0].toUpperCase()}
      </div>
      <div className="mx-auto mt-4 max-w-7xl px-5 text-center font-mono text-xs text-slate-600 md:px-8">
        © {new Date().getFullYear()} {profile.name}. Built with React, Three.js & React Bits.
      </div>
    </footer>
  );
}
