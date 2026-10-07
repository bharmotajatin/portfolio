import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useContent } from '../lib/content';
import { lockScroll } from '../lib/scroll';
import { SectionHeading, TiltCard, external } from './ui';

const DEMOS = {
  'fake-news': lazy(() => import('./FakeNewsDemo'))
};

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
    <div className={`relative overflow-hidden ${className}`} style={{ background: `radial-gradient(circle at 30% 20%, ${c}55, transparent 55%), radial-gradient(circle at 80% 90%, ${c}33, transparent 50%), var(--color-ink-2)` }}>
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
      {compact && DEMOS[project.demo] && (
        <span className="btn-primary cursor-target !px-4 !py-2 text-xs">
          <i className="ri-play-circle-line" /> Try demo
        </span>
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

const TECH = {
  'next.js': ['ri-nextjs-line', 'Framework'],
  react: ['ri-reactjs-line', 'Frontend'],
  javascript: ['ri-javascript-line', 'Language'],
  typescript: ['ri-code-s-slash-line', 'Language'],
  tailwind: ['ri-tailwind-css-line', 'Styling'],
  mongodb: ['ri-leaf-line', 'Database'],
  nextauth: ['ri-shield-keyhole-line', 'Auth'],
  razorpay: ['ri-bank-card-line', 'Payments'],
  gsap: ['ri-movie-2-line', 'Animation'],
  rbac: ['ri-user-settings-line', 'Access control'],
  'chart.js': ['ri-bar-chart-2-line', 'Charts'],
  recharts: ['ri-line-chart-line', 'Charts'],
  'three.js': ['ri-box-3-line', '3D graphics'],
  aviation: ['ri-plane-line', 'Domain'],
  sql: ['ri-database-2-line', 'Database'],
  'schema design': ['ri-node-tree', 'Data modelling'],
  indexing: ['ri-speed-up-line', 'Performance'],
  python: ['ri-code-line', 'Language'],
  'power bi': ['ri-dashboard-3-line', 'BI & reporting'],
  eda: ['ri-search-eye-line', 'Analysis'],
  vercel: ['ri-triangle-line', 'Hosting'],
  serverless: ['ri-cloud-line', 'Backend'],
  nestjs: ['ri-server-line', 'Backend'],
  hono: ['ri-fire-line', 'Edge API'],
  d1: ['ri-database-2-line', 'Database'],
  cloudflare: ['ri-cloud-line', 'Edge hosting'],
  drizzle: ['ri-database-line', 'ORM'],
  turso: ['ri-database-2-line', 'Database'],
  'scikit-learn': ['ri-brain-line', 'Machine learning'],
  'tf-idf': ['ri-grid-line', 'Feature extraction'],
  'logistic regression': ['ri-git-commit-line', 'Classifier'],
  nlp: ['ri-chat-1-line', 'Text processing'],
  pandas: ['ri-table-line', 'Data wrangling'],
  'in-browser inference': ['ri-cpu-line', 'Runtime']
};

const techMeta = name => TECH[name.toLowerCase()] || ['ri-code-box-line', 'Tooling'];

const FRAME_W = 1280;

const canEmbed = p => Boolean(p.liveUrl) && (p.embed === true || p.liveUrl.startsWith('/'));

function LivePreview({ project }) {
  const box = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [loaded, setLoaded] = useState(false);
  const embeddable = canEmbed(project);
  const [mode, setMode] = useState(embeddable ? 'live' : 'shot');
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  const scale = size.w ? size.w / FRAME_W : 1;
  const host = project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'preview';

  return (
    <div className="flex h-full flex-col bg-ink">
      <div className="flex items-center gap-3 border-b border-white/10 bg-ink-3/80 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-mint/80" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-white/5 px-3 py-1 font-mono text-[11px] text-slate-400">
          <i className={project.liveUrl ? 'ri-lock-line text-mint' : 'ri-image-line'} />
          <span className="truncate">{host}</span>
        </div>
        {embeddable && project.image && (
          <div className="flex rounded-lg bg-white/5 p-0.5 text-[11px]">
            {[
              ['live', 'Live'],
              ['shot', 'Screenshot']
            ].map(([m, label]) => (
              <button key={m} type="button" onClick={() => setMode(m)} className={`cursor-target rounded-md px-2.5 py-1 transition-colors ${mode === m ? 'bg-mint text-ink' : 'text-slate-400 hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>
        )}
        {mode === 'live' && (
          <button
            type="button"
            aria-label="Reload preview"
            onClick={() => {
              setLoaded(false);
              setNonce(n => n + 1);
            }}
            className="cursor-target text-slate-400 transition-colors hover:text-white"
          >
            <i className="ri-refresh-line" />
          </button>
        )}
      </div>

      <div ref={box} className="relative flex-1 overflow-hidden">
        {mode === 'shot' && project.image ? (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-5 pb-20 pt-12">
            <img src={project.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-60 blur-2xl" />
            <img src={project.image} alt={project.title} className="relative max-h-full w-full rounded-xl border border-white/10 object-contain object-top shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]" />
            {project.liveUrl && !embeddable && (
              <span className="absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-2 px-3 py-1 font-mono text-[10px] text-slate-400 shadow-lg">
                <i className="ri-shield-line text-amber" /> This site blocks live embedding — showing a screenshot
              </span>
            )}
          </div>
        ) : (
          (mode === 'shot' || !loaded) && (
            <div className="absolute inset-0">
              <ProjectVisual project={project} className="h-full" />
            </div>
          )
        )}
        {mode === 'shot' && project.liveUrl && (
          <a
            href={project.liveUrl}
            target={external(project.liveUrl) ? '_blank' : undefined}
            rel="noreferrer"
            className="btn-primary cursor-target absolute bottom-5 left-1/2 -translate-x-1/2 !px-5 !py-2.5 text-sm"
          >
            <i className="ri-external-link-line" /> Open live site
          </a>
        )}
        {mode === 'live' && !loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs text-slate-300">
              <i className="ri-loader-4-line animate-spin text-mint" /> Loading live site…
            </span>
          </div>
        )}
        {mode === 'live' && size.w > 0 && (
          <iframe
            key={nonce}
            src={project.liveUrl}
            title={`${project.title} live preview`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            className={`absolute left-0 top-0 origin-top-left border-0 bg-white transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ width: FRAME_W, height: size.h / scale, transform: `scale(${scale})` }}
          />
        )}
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  const Demo = DEMOS[project.demo];

  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    lockScroll(true);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[90] flex items-center justify-center p-3 md:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ y: 60, rotateX: 18, opacity: 0 }}
        animate={{ y: 0, rotateX: 0, opacity: 1 }}
        exit={{ y: 60, rotateX: 18, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        style={{ transformPerspective: 1400 }}
        className="relative grid h-[92vh] w-full max-w-6xl grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-3xl border border-white/10 bg-ink-2 shadow-2xl md:h-[min(720px,88vh)] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:grid-rows-1"
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
      >
        <div className="order-2 overflow-y-auto p-6 md:order-1 md:p-9" data-lenis-prevent>
          <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
            <span style={{ color: project.color }}>{project.category}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-500">{project.year}</span>
            {project.featured && (
              <span className="ml-1 rounded-full bg-amber/10 px-2 py-0.5 text-[10px] text-amber">
                <i className="ri-star-fill" /> Featured
              </span>
            )}
          </div>
          <h3 className="font-display text-2xl font-bold leading-tight text-white md:text-3xl">{project.title}</h3>
          <p className="mt-4 leading-relaxed text-slate-300">{project.description}</p>
          {project.details && <p className="mt-3 text-sm leading-relaxed text-slate-400">{project.details}</p>}

          {project.howItWorks?.length > 0 && (
            <div className="mt-7">
              <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-slate-500">
                <i className="ri-flow-chart" /> How it works
              </div>
              <ol className="relative space-y-3 border-l border-white/10 pl-5">
                {project.howItWorks.map((s, i) => (
                  <motion.li key={s} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.06 }} className="relative text-sm leading-relaxed text-slate-300">
                    <span className="absolute -left-[31px] top-0 flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px] font-bold text-ink" style={{ background: project.color || '#22d3ee' }}>
                      {i + 1}
                    </span>
                    {s}
                  </motion.li>
                ))}
              </ol>
            </div>
          )}

          {project.tags?.length > 0 && (
            <div className="mt-7">
              <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-slate-500">
                <i className="ri-stack-line" /> Tech stack
              </div>
              <div className="grid grid-cols-2 gap-2">
                {project.tags.map((t, i) => {
                  const [icon, role] = techMeta(t);
                  return (
                    <motion.div
                      key={t}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base" style={{ background: `${project.color || '#22d3ee'}1f`, color: project.color || '#22d3ee' }}>
                        <i className={icon} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-white">{t}</span>
                        <span className="block truncate text-[11px] text-slate-500">{role}</span>
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8">
            <Links project={project} />
          </div>
        </div>

        <motion.div layoutId={`visual-${project.id}`} className={`order-1 border-b border-white/10 md:order-2 md:h-auto md:border-b-0 md:border-l ${Demo ? 'relative h-[62vh]' : 'h-64 sm:h-80'}`}>
          {Demo ? (
            <div className="absolute inset-0">
              <Suspense fallback={<ProjectVisual project={project} className="h-full" />}>
                <Demo project={project} />
              </Suspense>
            </div>
          ) : (
            <LivePreview project={project} />
          )}
        </motion.div>

        <button type="button" onClick={onClose} aria-label="Close" className="glass cursor-target absolute right-4 top-14 z-10 flex h-10 w-10 items-center justify-center rounded-full text-xl text-white transition-transform hover:rotate-90 md:top-4 md:right-auto md:left-[calc(45%-3.5rem)]">
          <i className="ri-close-line" />
        </button>
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

        {createPortal(<AnimatePresence>{open && <ProjectModal project={open} onClose={() => setOpen(null)} />}</AnimatePresence>, document.body)}
      </LayoutGroup>
    </section>
  );
}
