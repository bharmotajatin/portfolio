import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useContent } from '../lib/content';
import { SectionHeading, TiltCard, external } from './ui';

function ProjectVisual({ project, className = '' }) {
  const [broken, setBroken] = useState(false);
  const c = project.color || '#22d3ee';
  if (project.image && !broken) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          onError={() => setBroken(true)}
          className="h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: `radial-gradient(circle at 30% 20%, ${c}55, transparent 55%), radial-gradient(circle at 80% 90%, ${c}33, transparent 50%), #0b0d14` }}>
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 600 }}>
        <div className="relative transition-transform duration-700 group-hover:[transform:rotateX(18deg)_rotateY(-24deg)_scale(1.1)]" style={{ transformStyle: 'preserve-3d' }}>
          <div className="absolute -inset-6 rounded-3xl border opacity-40" style={{ borderColor: c, transform: 'translateZ(-40px)' }} />
          <div className="absolute -inset-3 rounded-2xl border opacity-60" style={{ borderColor: c, transform: 'translateZ(-20px)' }} />
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl text-ink shadow-2xl" style={{ background: c, boxShadow: `0 20px 60px -10px ${c}` }}>
            <i className={project.icon || 'ri-code-box-line'} />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
    </div>
  );
}

function Links({ project, compact }) {
  return (
    <div className="flex flex-wrap gap-2">
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target={external(project.liveUrl) ? '_blank' : undefined}
          rel="noreferrer"
          onClick={e => e.stopPropagation()}
          className={`btn-primary cursor-target ${compact ? '!px-4 !py-2 text-xs' : 'text-sm'}`}
        >
          <i className="ri-external-link-line" /> Live
        </a>
      )}
      {project.repoUrl && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer"
          onClick={e => e.stopPropagation()}
          className={`btn-ghost cursor-target ${compact ? '!px-4 !py-2 text-xs' : 'text-sm'}`}
        >
          <i className="ri-github-line" /> Code
        </a>
      )}
    </div>
  );
}

function ProjectCard({ project, onOpen, wide }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className={wide ? 'md:col-span-2' : ''}
    >
      <TiltCard max={7} className="h-full rounded-3xl">
        <div
          role="button"
          tabIndex={0}
          onClick={() => onOpen(project)}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onOpen(project)}
          className="group cursor-target flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-2/80 transition-colors duration-500 hover:border-white/25"
          style={{ boxShadow: `0 30px 80px -40px ${project.color || '#22d3ee'}` }}
        >
          <motion.div layoutId={`visual-${project.id}`}>
            <ProjectVisual project={project} className={wide ? 'h-64 md:h-72' : 'h-52'} />
          </motion.div>
          <div className="flex flex-1 flex-col p-6" style={{ transform: 'translateZ(40px)' }}>
            <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest">
              <span style={{ color: project.color }}>{project.category}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-500">{project.year}</span>
              {project.featured && (
                <span className="ml-auto rounded-full bg-amber/10 px-2 py-0.5 text-amber">
                  <i className="ri-star-fill" /> Featured
                </span>
              )}
            </div>
            <h3 className="font-display text-xl font-bold leading-tight text-white transition-colors group-hover:text-mint md:text-2xl">{project.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{project.description}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.tags?.map(t => (
                <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-slate-400">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between gap-3">
              <Links project={project} compact />
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-white transition-all duration-500 group-hover:rotate-45 group-hover:border-mint group-hover:bg-mint group-hover:text-ink">
                <i className="ri-arrow-right-up-line" />
              </span>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.article>
  );
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[90] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ y: 60, rotateX: 25, opacity: 0 }}
        animate={{ y: 0, rotateX: 0, opacity: 1 }}
        exit={{ y: 60, rotateX: 25, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        style={{ transformPerspective: 1200 }}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-ink-2"
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
      >
        <motion.div layoutId={`visual-${project.id}`}>
          <ProjectVisual project={project} className="h-64 md:h-80" />
        </motion.div>
        <button type="button" onClick={onClose} aria-label="Close" className="glass cursor-target absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-xl text-white transition-transform hover:rotate-90">
          <i className="ri-close-line" />
        </button>
        <div className="p-6 md:p-10">
          <div className="mb-3 font-mono text-xs uppercase tracking-widest" style={{ color: project.color }}>
            {project.category} · {project.year}
          </div>
          <h3 className="font-display text-3xl font-bold text-white md:text-4xl">{project.title}</h3>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">{project.description}</p>
          {project.details && <p className="mt-4 leading-relaxed text-slate-400">{project.details}</p>}
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags?.map(t => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <Links project={project} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects({ index }) {
  const { projects } = useContent();
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(null);
  const categories = useMemo(() => ['All', ...new Set(projects.map(p => p.category).filter(Boolean))], [projects]);
  const list = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="section-pad">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeading index={index} eyebrow="Selected work" title="Things I've" accent="built." description="Live products on Vercel, internal aviation platforms and data projects. Click any card for the full story." />
      </div>

      <LayoutGroup>
        <div className="glass mb-10 inline-flex flex-wrap gap-1 rounded-full p-1">
          {categories.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`cursor-target relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${filter === c ? 'text-ink' : 'text-slate-400 hover:text-white'}`}
            >
              {filter === c && <motion.span layoutId="project-filter" className="absolute inset-0 rounded-full bg-gradient-to-r from-mint to-cyan" transition={{ type: 'spring', stiffness: 300, damping: 28 }} />}
              <span className="relative">{c}</span>
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <ProjectCard key={p.id || p.title} project={p} onOpen={setOpen} wide={filter === 'All' && i === 0 && p.featured} />
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>{open && <ProjectModal project={open} onClose={() => setOpen(null)} />}</AnimatePresence>
      </LayoutGroup>
    </section>
  );
}
