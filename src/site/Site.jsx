import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { ContentProvider, isPreview, useContent } from '../lib/content';
import { useSmoothScroll } from '../lib/scroll';
import { useTheme } from '../lib/theme';
import ClickSpark from '../components/reactbits/ClickSpark';
import TargetCursor from '../components/reactbits/TargetCursor';
import Particles from '../components/reactbits/Particles';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Experience from './Experience';
import Projects from './Projects';
import Education from './Education';
import Testimonials from './Testimonials';
import Contact from './Contact';
import Process from './Process';
import { ScrollSection } from './scrollfx';
import Footer from './Footer';
import { DockNav, Loader, Marquee, ScrollProgress, TopBar } from './Chrome';

const SECTIONS = { about: About, skills: Skills, process: Process, experience: Experience, projects: Projects, education: Education, testimonials: Testimonials, contact: Contact };

function Page() {
  const content = useContent();
  const preview = isPreview();
  const [ready, setReady] = useState(preview);
  const finish = useCallback(() => setReady(true), []);
  const light = useTheme() === 'light';
  useSmoothScroll(!preview);

  useEffect(() => {
    document.title = content.meta?.title || content.profile.name;
  }, [content.meta?.title, content.profile.name]);

  const visible = content.sections.filter(s => s.visible && SECTIONS[s.id]);

  return (
    <ClickSpark sparkColor="#34d399" sparkSize={12} sparkRadius={22} sparkCount={10} duration={450}>
      <div className="noise relative min-h-screen">
        <AnimatePresence>{!ready && <Loader onDone={finish} />}</AnimatePresence>
        {!preview && <TargetCursor targetSelector=".cursor-target" spinDuration={2.4} cursorColor={light ? '#0b1020' : '#ffffff'} cursorColorOnTarget={light ? '#059669' : '#34d399'} />}

        <div className="pointer-events-none fixed inset-0 -z-0 opacity-60" aria-hidden>
          <Particles particleCount={140} particleSpread={12} speed={0.06} particleColors={['#34d399', '#22d3ee', '#a78bfa']} alphaParticles particleBaseSize={80} sizeRandomness={1} cameraDistance={22} disableRotation={false} />
        </div>
        <div className="pointer-events-none fixed -left-40 top-1/3 -z-0 h-[500px] w-[500px] rounded-full bg-mint/10 blur-[140px]" aria-hidden />
        <div className="pointer-events-none fixed -right-40 bottom-0 -z-0 h-[500px] w-[500px] rounded-full bg-violet/10 blur-[140px]" aria-hidden />

        <ScrollProgress />
        <TopBar />
        <main className="relative z-10">
          <Hero ready={ready} />
          <Marquee />
          {visible.map((s, i) => {
            const Section = SECTIONS[s.id];
            if (Section.pinned) return <Section key={s.id} index={i + 1} />;
            return (
              <ScrollSection key={s.id}>
                <Section index={i + 1} />
              </ScrollSection>
            );
          })}
        </main>
        <div className="relative z-10">
          <Footer />
        </div>
        <DockNav />
      </div>
    </ClickSpark>
  );
}

export default function Site() {
  return (
    <ContentProvider>
      <Page />
    </ContentProvider>
  );
}
