import { useEffect, useMemo, useRef, useState } from 'react';
import { UsageDetails } from './SkillTip';

export default function SkillSphere({ skills, usage }) {
  const wrap = useRef(null);
  const nodes = useRef([]);
  const [hovered, setHovered] = useState(null);
  const hoveredRef = useRef(null);
  hoveredRef.current = hovered;

  const words = useMemo(() => {
    const list = skills.flatMap(cat => cat.items.map(name => ({ name, color: cat.color, cat: cat.name })));
    const n = list.length;
    return list.map((w, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return { ...w, x: Math.cos(theta) * Math.sin(phi), y: Math.sin(theta) * Math.sin(phi), z: Math.cos(phi) };
    });
  }, [skills]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let raf;
    let visible = true;
    let ax = 0.0016;
    let ay = 0.0028;
    let target = { ax, ay };
    let rotX = 0;
    let rotY = 0;
    let dragging = null;

    const onMove = e => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      if (dragging) {
        rotY += (e.clientX - dragging.x) * 0.006;
        rotX -= (e.clientY - dragging.y) * 0.006;
        dragging = { x: e.clientX, y: e.clientY };
        return;
      }
      target = { ax: -ny * 0.02, ay: nx * 0.02 };
    };
    const onLeave = () => {
      target = { ax: 0.0016, ay: 0.0028 };
      dragging = null;
    };
    const onDown = e => {
      dragging = { x: e.clientX, y: e.clientY };
      el.setPointerCapture?.(e.pointerId);
    };
    const onUp = () => (dragging = null);

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const paused = hoveredRef.current !== null;
      ax += ((paused ? 0 : target.ax) - ax) * 0.05;
      ay += ((paused ? 0 : target.ay) - ay) * 0.05;
      if (!dragging) {
        rotX += ax;
        rotY += ay;
      }
      const radius = Math.min(el.clientWidth, el.clientHeight) * 0.4;
      const cx = Math.cos(rotX), sx = Math.sin(rotX), cy = Math.cos(rotY), sy = Math.sin(rotY);
      words.forEach((w, i) => {
        const node = nodes.current[i];
        if (!node) return;
        const y1 = w.y * cx - w.z * sx;
        const z1 = w.y * sx + w.z * cx;
        const x2 = w.x * cy + z1 * sy;
        const z2 = -w.x * sy + z1 * cy;
        const depth = (z2 + 1) / 2;
        const scale = 0.55 + depth * 0.75;
        node.style.transform = `translate3d(${x2 * radius}px, ${y1 * radius}px, 0) translate(-50%, -50%) scale(${scale})`;
        node.style.opacity = String(0.18 + depth * 0.82);
        node.style.zIndex = String(Math.round(depth * 100));
        node.style.filter = depth < 0.35 ? `blur(${(0.35 - depth) * 4}px)` : 'none';
      });
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [words]);

  return (
    <div ref={wrap} className="relative aspect-square w-full touch-none select-none" style={{ cursor: 'grab' }}>
      <div className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.18),transparent_65%)] blur-2xl" />
      <div className="pointer-events-none absolute inset-[8%] animate-spin-slow rounded-full border border-dashed border-white/10" />
      <div className="pointer-events-none absolute inset-[22%] rounded-full border border-white/5" style={{ animation: 'spin 26s linear infinite reverse' }} />
      <div className="absolute left-1/2 top-1/2 isolate z-0">
        {words.map((w, i) => (
          <span
            key={`${w.cat}-${w.name}`}
            ref={el => (nodes.current[i] = el)}
            onPointerEnter={() => setHovered(i)}
            onPointerLeave={() => setHovered(null)}
            className="absolute left-0 top-0 whitespace-nowrap rounded-full border px-3 py-1 font-mono text-xs font-medium transition-[background-color,box-shadow,color] duration-300 md:text-sm"
            style={{
              color: hovered === i ? '#05060a' : w.color,
              borderColor: `${w.color}55`,
              backgroundColor: hovered === i ? w.color : `${w.color}12`,
              boxShadow: hovered === i ? `0 0 30px ${w.color}` : 'none',
              willChange: 'transform, opacity'
            }}
          >
            {w.name}
          </span>
        ))}
      </div>
      {hovered !== null && usage?.get(words[hovered].name) ? (
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-20 w-[min(280px,90%)] -translate-x-1/2 rounded-2xl border border-white/15 bg-ink-2 p-3.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)]">
          <UsageDetails name={words[hovered].name} info={usage.get(words[hovered].name)} />
        </div>
      ) : (
        hovered !== null && (
          <div className="pointer-events-none absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/15 bg-ink-2 px-4 py-1.5 font-mono text-[11px] text-slate-300">
            {words[hovered].cat}
          </div>
        )
      )}
    </div>
  );
}
