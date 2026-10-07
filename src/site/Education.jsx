import { useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { useContent } from '../lib/content';
import GlareHover from '../components/reactbits/GlareHover';
import DetailModal from './DetailModal';
import { Reveal, SectionHeading, TiltCard, external } from './ui';

const CERT_COLORS = ['#34d399', '#22d3ee', '#a78bfa', '#fbbf24', '#fb7185'];
const certColor = (c, i) => c.color || CERT_COLORS[i % CERT_COLORS.length];

function CertificateArt({ cert, color, className = '' }) {
  const [broken, setBroken] = useState(false);
  if (cert.image && !broken) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img src={cert.image} alt={`${cert.name} certificate`} onError={() => setBroken(true)} className="h-full w-full object-contain" />
      </div>
    );
  }
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border p-6 text-center ${className}`}
      style={{ borderColor: `${color}55`, background: `radial-gradient(circle at 20% 0%, ${color}26, transparent 55%), radial-gradient(circle at 100% 100%, ${color}1a, transparent 50%), var(--color-ink-3)` }}
    >
      <div className="pointer-events-none absolute inset-3 rounded-xl border border-dashed" style={{ borderColor: `${color}40` }} />
      <div className="font-mono text-[10px] uppercase tracking-[0.35em]" style={{ color }}>
        Certificate of completion
      </div>
      <div className="mt-4 text-xs text-slate-500">This certifies that</div>
      <div className="mt-1 font-display text-xl font-bold text-white md:text-2xl">Jatin Bharmota</div>
      <div className="mt-3 text-xs text-slate-500">has successfully completed</div>
      <div className="mt-1 max-w-[85%] font-display text-lg font-semibold leading-snug md:text-xl" style={{ color }}>
        {cert.name}
      </div>
      <div className="mt-5 flex items-center gap-3 text-xs text-slate-400">
        <span>{cert.issuer}</span>
        {cert.year && <span className="h-1 w-1 rounded-full bg-slate-500" />}
        {cert.year && <span>{cert.year}</span>}
      </div>
      <span className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full text-xl text-ink shadow-lg" style={{ background: color, boxShadow: `0 10px 30px -8px ${color}` }}>
        <i className="ri-award-fill" />
      </span>
    </div>
  );
}

function SectionLabel({ icon, children }) {
  return (
    <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-slate-500">
      <i className={icon} /> {children}
    </div>
  );
}

function EducationDetail({ ed }) {
  return (
    <div className="max-h-[92vh] overflow-y-auto p-6 md:p-10" data-lenis-prevent>
      <div className="flex flex-col gap-5 pr-12 md:flex-row md:items-start">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mint/20 to-violet/20 text-3xl text-mint">
          <i className="ri-graduation-cap-line" />
        </span>
        <div className="min-w-0">
          <div className="font-mono text-xs text-slate-500">
            {ed.start} — {ed.end}
            {ed.location && ` · ${ed.location}`}
          </div>
          <h3 className="mt-1 font-display text-2xl font-bold leading-tight text-white md:text-3xl">{ed.degree}</h3>
          <div className="mt-1 text-cyan">{ed.school}</div>
          {ed.score && <span className="mt-3 inline-block rounded-full border border-mint/30 bg-mint/10 px-3 py-1 font-mono text-xs text-mint">{ed.score}</span>}
        </div>
      </div>

      <p className="mt-7 leading-relaxed text-slate-300">{ed.details || ed.description}</p>

      {ed.highlights?.length > 0 && (
        <div className="mt-8">
          <SectionLabel icon="ri-star-smile-line">Highlights</SectionLabel>
          <ul className="space-y-2.5">
            {ed.highlights.map((h, i) => (
              <motion.li key={h} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.06 }} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                <i className="ri-checkbox-circle-fill mt-0.5 text-mint" />
                {h}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {ed.coursework?.length > 0 && (
        <div className="mt-8">
          <SectionLabel icon="ri-book-open-line">Key coursework</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {ed.coursework.map((c, i) => (
              <motion.span key={c} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.03 }} className="chip">
                {c}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {ed.url && (
        <a href={ed.url} target="_blank" rel="noreferrer" className="btn-ghost cursor-target mt-9 inline-flex text-sm">
          <i className="ri-global-line" /> Visit institution
        </a>
      )}
    </div>
  );
}

function CertDetail({ cert, color }) {
  return (
    <div className="grid max-h-[92vh] overflow-y-auto md:grid-cols-[1.1fr_1fr]" data-lenis-prevent>
      <div className="flex flex-col justify-center border-b border-white/10 bg-ink-3/50 p-5 md:border-b-0 md:border-r md:p-8">
        <CertificateArt cert={cert} color={color} className="aspect-[1.414/1] w-full" />
        {cert.image && (
          <a href={cert.image} target="_blank" rel="noreferrer" className="cursor-target mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 hover:text-white">
            <i className="ri-zoom-in-line" /> Open full size
          </a>
        )}
      </div>
      <div className="p-6 md:p-8">
        <div className="pr-12 font-mono text-xs uppercase tracking-widest" style={{ color }}>
          {cert.issuer}
          {cert.year && <span className="text-slate-500"> · {cert.year}</span>}
        </div>
        <h3 className="mt-2 font-display text-2xl font-bold leading-tight text-white">{cert.name}</h3>
        {cert.description && <p className="mt-4 leading-relaxed text-slate-300">{cert.description}</p>}

        {cert.skills?.length > 0 && (
          <div className="mt-7">
            <SectionLabel icon="ri-lightbulb-flash-line">Skills covered</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {cert.skills.map((s, i) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                  className="rounded-lg border px-2.5 py-1 text-xs text-slate-300"
                  style={{ borderColor: `${color}40`, background: `${color}10` }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {cert.credentialId && (
          <div className="mt-7 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Credential ID</div>
            <div className="mt-1 break-all font-mono text-sm text-white">{cert.credentialId}</div>
          </div>
        )}

        {cert.url && (
          <a href={cert.url} target={external(cert.url) ? '_blank' : undefined} rel="noreferrer" className="btn-primary cursor-target mt-8 inline-flex text-sm">
            <i className="ri-shield-check-line" /> Verify credential
          </a>
        )}
      </div>
    </div>
  );
}

const onKeyOpen = open => e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    open();
  }
};

export default function Education({ index }) {
  const { education, certifications } = useContent();
  const [openEd, setOpenEd] = useState(null);
  const [openCert, setOpenCert] = useState(null);
  const closeEd = useCallback(() => setOpenEd(null), []);
  const closeCert = useCallback(() => setOpenCert(null), []);

  return (
    <section id="education" className="section-pad">
      <SectionHeading index={index} eyebrow="Learning" title="Education &" accent="certifications." description="Click any card to see the details." />

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          {education.map((ed, i) => (
            <Reveal key={ed.id || i} delay={i * 0.1}>
              <TiltCard max={6} glare={false} className="rounded-3xl">
                <GlareHover
                  width="100%"
                  height="auto"
                  background="color-mix(in srgb, var(--color-ink-2) 85%, transparent)"
                  borderRadius="24px"
                  borderColor="var(--color-line)"
                  glareColor="#a7f3d0"
                  glareOpacity={0.25}
                  glareAngle={-35}
                  glareSize={260}
                  transitionDuration={900}
                  className="cursor-target !block"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setOpenEd(ed)}
                    onKeyDown={onKeyOpen(() => setOpenEd(ed))}
                    className="group flex w-full cursor-pointer flex-col gap-4 p-6 text-left md:flex-row md:items-start md:p-8"
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mint/20 to-violet/20 text-2xl text-mint transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
                      <i className="ri-graduation-cap-line" />
                    </span>
                    <div className="flex-1">
                      <div className="font-mono text-xs text-slate-500">
                        {ed.start} — {ed.end}
                      </div>
                      <h3 className="mt-1 font-display text-2xl font-bold text-white transition-colors group-hover:text-mint">{ed.degree}</h3>
                      <div className="mt-1 text-sm text-cyan">{ed.school}</div>
                      {ed.description && <p className="mt-3 text-sm leading-relaxed text-slate-400">{ed.description}</p>}
                      <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 transition-colors group-hover:text-mint">
                        View details <i className="ri-arrow-right-line transition-transform group-hover:translate-x-1" />
                      </span>
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
            const color = certColor(c, i);
            return (
              <Reveal key={c.id || i} delay={i * 0.08}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenCert({ cert: c, color })}
                  onKeyDown={onKeyOpen(() => setOpenCert({ cert: c, color }))}
                  className="glass shine group cursor-target flex cursor-pointer items-center gap-4 rounded-2xl p-4 transition-all duration-500 hover:-translate-y-1"
                  style={{ '--c': color }}
                >
                  {c.image ? (
                    <span className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-ink-3">
                      <img src={c.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </span>
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl transition-transform duration-500 group-hover:rotate-[20deg] group-hover:scale-110" style={{ background: `${color}1a`, color }}>
                      <i className="ri-award-line" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white">{c.name}</div>
                    <div className="text-xs text-slate-500">
                      {c.issuer}
                      {c.year ? ` · ${c.year}` : ''}
                    </div>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-500 transition-all duration-500 group-hover:rotate-45 group-hover:border-[var(--c)] group-hover:bg-[var(--c)] group-hover:text-ink">
                    <i className="ri-arrow-right-up-line" />
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <DetailModal item={openEd} onClose={closeEd} label={ed => ed.degree} className="max-w-3xl">
        {ed => <EducationDetail ed={ed} />}
      </DetailModal>
      <DetailModal item={openCert} onClose={closeCert} label={o => o.cert.name} className="max-w-5xl">
        {o => <CertDetail cert={o.cert} color={o.color} />}
      </DetailModal>
    </section>
  );
}
