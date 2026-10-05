import { lazy, Suspense, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useContent } from '../lib/content';
import { scrollToId } from '../lib/scroll';
import SplitText from '../components/reactbits/SplitText';
import RotatingText from '../components/reactbits/RotatingText';
import ShinyText from '../components/reactbits/ShinyText';
import BlurText from '../components/reactbits/BlurText';
import Magnet from '../components/reactbits/Magnet';
import StarBorder from '../components/reactbits/StarBorder';
import CountUp from '../components/reactbits/CountUp';
import { TiltCard } from './ui';
import CodePanels from './CodePanels';

const HeroScene = lazy(() => import('./HeroScene'));

export default function Hero({ ready }) {
  const { profile, stats } = useContent();
  const [first, ...rest] = profile.name.split(' ');
  const roles = profile.roles?.length ? profile.roles : ['Analyst'];

  const ref = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const contentBlur = useTransform(scrollYProgress, [0, 0.75], ['blur(0px)', 'blur(10px)']);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.15]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const panelsY = useTransform(scrollYProgress, [0, 1], [0, -320]);

  return (
    <section ref={ref} id="top" className="relative flex min-h-[100svh] items-center overflow-hidden">
      <motion.div style={still ? undefined : { y: gridY }} className="grid-bg pointer-events-none absolute inset-0" />
      <motion.div style={still ? undefined : { scale: sceneScale, opacity: sceneOpacity }} className="absolute inset-0">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(5,6,10,0.85)_10%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      {ready && (
        <motion.div style={still ? undefined : { y: panelsY, opacity: contentOpacity }} className="pointer-events-none absolute inset-0" aria-hidden>
          <CodePanels />
        </motion.div>
      )}

      <motion.div
        style={still ? undefined : { y: contentY, scale: contentScale, opacity: contentOpacity, filter: contentBlur, transformOrigin: '0% 50%' }}
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-32 md:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="glass mb-8 inline-flex items-center gap-3 rounded-full py-2 pl-3 pr-5"
        >
          <span className={`relative h-2.5 w-2.5 rounded-full ${profile.available ? 'animate-pulse-ring bg-mint' : 'bg-amber'}`} />
          <ShinyText text={profile.availability} speed={3} color="#94a3b8" shineColor="#ffffff" className="font-mono text-xs tracking-wide" />
        </motion.div>

        {ready && (
          <h1 className="font-display font-extrabold leading-[0.9] tracking-tight text-white">
            <SplitText
              text={first}
              tag="span"
              textAlign="left"
              className="block text-[min(9.5rem,11vw)]"
              delay={45}
              duration={1}
              from={{ opacity: 0, y: 120, rotateX: -90 }}
              to={{ opacity: 1, y: 0, rotateX: 0 }}
              rootMargin="0px"
            />
            <SplitText
              text={rest.join(' ')}
              tag="span"
              textAlign="left"
              className="split-gradient block text-[min(9.5rem,11vw)]"
              delay={45}
              duration={1}
              from={{ opacity: 0, y: 120, rotateX: -90 }}
              to={{ opacity: 1, y: 0, rotateX: 0 }}
              rootMargin="0px"
            />
          </h1>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center gap-3 font-display text-xl text-slate-300 sm:text-2xl md:text-4xl"
        >
          <span>I&apos;m a</span>
          <RotatingText
            texts={roles}
            mainClassName="!flex-nowrap overflow-hidden whitespace-nowrap rounded-xl bg-gradient-to-r from-mint/90 to-cyan/90 px-3 py-1 font-bold text-ink md:px-4"
            staggerFrom="last"
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5"
            rotationInterval={2600}
          />
        </motion.div>

        {ready && (
          <BlurText
            text={profile.headline}
            delay={40}
            animateBy="words"
            direction="bottom"
            className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl"
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnet padding={60} magnetStrength={4}>
            <button type="button" onClick={() => scrollToId('projects')} className="btn-primary shine cursor-target">
              <i className="ri-rocket-2-line" /> Explore my work
            </button>
          </Magnet>
          <Magnet padding={60} magnetStrength={4}>
            <StarBorder
              as="a"
              href={profile.resume}
              download
              color="#22d3ee"
              speed="5s"
              backgroundColor="#0b0d14"
              borderColor="rgba(255,255,255,0.12)"
              className="cursor-target"
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <i className="ri-download-2-line" /> Download CV
              </span>
            </StarBorder>
          </Magnet>
        </motion.div>

        <div className="mt-16 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={`${s.label}-${i}`}
              initial={{ opacity: 0, y: 30, rotateX: -40 }}
              animate={ready ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.1 + i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ transformPerspective: 800 }}
            >
              <TiltCard max={14} className="glass cursor-target rounded-2xl p-4">
                <div className="font-display text-3xl font-bold text-white md:text-4xl">
                  {ready && <CountUp to={Number(s.value) || 0} duration={2.2} delay={1.2} />}
                  <span className="text-gradient">{s.suffix}</span>
                </div>
                <div className="mt-1 text-xs leading-snug text-slate-400">{s.label}</div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <button
        type="button"
        onClick={() => scrollToId('about')}
        aria-label="Scroll down"
        className="cursor-target absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 transition-colors hover:text-mint md:flex"
      >
        Scroll
        <span className="relative h-10 w-6 rounded-full border border-white/20">
          <motion.span
            className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded-full bg-mint"
            animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </span>
      </button>
    </section>
  );
}
