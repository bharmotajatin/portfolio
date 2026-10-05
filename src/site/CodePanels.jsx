import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

const SNIPPETS = [
  {
    file: 'otp_analysis.sql',
    accent: '#22d3ee',
    lines: [
      [['SELECT', 'k'], [' airline,', 'p']],
      [['  ROUND', 'f'], ['(', 'p'], ['AVG', 'f'], ['(delay_min), ', 'p'], ['1', 'n'], [')', 'p']],
      [['FROM', 'k'], [' flights', 'p']],
      [['WHERE', 'k'], [' station = ', 'p'], ["'DEL'", 's']],
      [['GROUP BY', 'k'], [' airline;', 'p']]
    ]
  },
  {
    file: 'forecast.py',
    accent: '#a78bfa',
    lines: [
      [['df', 'p'], [' = ', 'o'], ['pd', 'p'], ['.', 'o'], ['read_sql', 'f'], ['(q, conn)', 'p']],
      [['model', 'p'], [' = ', 'o'], ['RandomForest', 'f'], ['()', 'p']],
      [['model', 'p'], ['.', 'o'], ['fit', 'f'], ['(X_train, y_train)', 'p']],
      [['print', 'f'], ['(', 'p'], ['f"R² = {score:.2f}"', 's'], [')', 'p']]
    ]
  },
  {
    file: 'measures.dax',
    accent: '#fbbf24',
    lines: [
      [['OTP %', 'v'], [' = ', 'o'], ['DIVIDE', 'f'], ['(', 'p']],
      [['  [On Time Flights],', 'p']],
      [['  [Total Flights]', 'p']],
      [[')', 'p']]
    ]
  }
];

const TOKEN = { k: '#c084fc', f: '#22d3ee', s: '#fbbf24', n: '#fb7185', o: '#94a3b8', v: '#34d399', p: '#e2e8f0' };

const LAYOUT = [
  { className: 'right-[3%] top-[17%] hidden lg:block', rotate: -14, depth: 26, delay: 1.6, float: 0 },
  { className: 'right-[5%] bottom-[19%] hidden lg:block', rotate: -18, depth: 40, delay: 2.1, float: 1.2 },
  { className: 'right-[33%] top-[9%] hidden 2xl:block', rotate: 10, depth: 14, delay: 2.6, float: 2.4 }
];

function Panel({ snippet, layout, mx, my }) {
  const x = useTransform(mx, v => v * layout.depth);
  const y = useTransform(my, v => v * layout.depth * 0.6);
  return (
    <motion.div className={`pointer-events-none absolute ${layout.className}`} style={{ x, y, perspective: 900 }}>
      <div className="animate-float" style={{ animationDelay: `${layout.float}s`, animationDuration: '7s' }}>
        <div className="code-panel" style={{ '--accent': snippet.accent, '--tilt': `${layout.rotate}deg`, animationDelay: `${layout.delay}s` }}>
          <div className="code-panel-bar">
            <span style={{ background: '#fb7185' }} />
            <span style={{ background: '#fbbf24' }} />
            <span style={{ background: '#34d399' }} />
            <em>{snippet.file}</em>
          </div>
          <pre>
            {snippet.lines.map((line, i) => (
              <div key={i} className="code-line" style={{ animationDelay: `${layout.delay + 0.35 + i * 0.18}s` }}>
                <b>{i + 1}</b>
                {line.map(([text, kind], j) => (
                  <span key={j} style={{ color: TOKEN[kind] }}>
                    {text}
                  </span>
                ))}
                {i === snippet.lines.length - 1 && <i className="code-caret" />}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </motion.div>
  );
}

export default function CodePanels() {
  const spring = { stiffness: 60, damping: 18 };
  const mx = useSpring(useMotionValue(0), spring);
  const my = useSpring(useMotionValue(0), spring);

  useEffect(() => {
    const onMove = e => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [mx, my]);

  return SNIPPETS.map((s, i) => <Panel key={s.file} snippet={s} layout={LAYOUT[i]} mx={mx} my={my} />);
}
