import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

const TOKEN = { k: '#c084fc', f: '#22d3ee', s: '#fbbf24', n: '#fb7185', o: '#94a3b8', v: '#34d399', p: '#e2e8f0', m: '#64748b' };

const PANELS = [
  {
    file: 'otp_analysis.sql',
    accent: '#22d3ee',
    className: 'right-[3%] top-[17%] hidden lg:block',
    rotate: -14,
    depth: 26,
    delay: 1.6,
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
    className: 'right-[5%] bottom-[19%] hidden lg:block',
    rotate: -18,
    depth: 40,
    delay: 2.1,
    lines: [
      [['df', 'p'], [' = ', 'o'], ['pd', 'p'], ['.', 'o'], ['read_sql', 'f'], ['(q, conn)', 'p']],
      [['model', 'p'], [' = ', 'o'], ['RandomForest', 'f'], ['()', 'p']],
      [['model', 'p'], ['.', 'o'], ['fit', 'f'], ['(X_train, y_train)', 'p']],
      [['print', 'f'], ['(', 'p'], ['f"R² = {score:.2f}"', 's'], [')', 'p']]
    ]
  },
  {
    file: 'otp_kpi',
    widget: 'kpi',
    accent: '#34d399',
    width: 210,
    className: 'left-[47%] top-[11%] hidden lg:block 2xl:left-[42%]',
    rotate: 12,
    depth: 18,
    delay: 2.4
  },
  {
    file: 'delay_by_station',
    widget: 'bars',
    accent: '#fbbf24',
    width: 220,
    className: 'right-[2%] top-[44%] hidden lg:block',
    rotate: -16,
    depth: 32,
    delay: 2.8
  },
  {
    file: 'pipeline.sh',
    accent: '#34d399',
    width: 230,
    className: 'left-[49%] top-[62%] hidden xl:block',
    rotate: 10,
    depth: 22,
    delay: 3.1,
    lines: [
      [['$ ', 'v'], ['dbt run ', 'p'], ['--select ', 'o'], ['ops', 's']],
      [['✓ ', 'v'], ['stg_flights ', 'p'], ['···· ', 'm'], ['1.2s', 'n']],
      [['✓ ', 'v'], ['fct_delays ', 'p'], ['····· ', 'm'], ['0.8s', 'n']],
      [['✓ ', 'v'], ['mart_otp ', 'p'], ['······· ', 'm'], ['0.6s', 'n']],
      [['Done', 'v'], [' · 3 models · 2.6s', 'o']]
    ]
  },
  {
    file: 'measures.dax',
    accent: '#fbbf24',
    className: 'right-[23%] top-[6%] hidden 2xl:block',
    rotate: 10,
    depth: 14,
    delay: 3.4,
    lines: [
      [['OTP %', 'v'], [' = ', 'o'], ['DIVIDE', 'f'], ['(', 'p']],
      [['  [On Time Flights],', 'p']],
      [['  [Total Flights]', 'p']],
      [[')', 'p']]
    ]
  },
  {
    file: 'revenue_mix',
    widget: 'donut',
    accent: '#a78bfa',
    width: 220,
    className: 'right-[30%] bottom-[6%] hidden 2xl:block',
    rotate: 14,
    depth: 20,
    delay: 3.7
  }
];

function Code({ lines, delay }) {
  return (
    <pre>
      {lines.map((line, i) => (
        <div key={i} className="code-line" style={{ animationDelay: `${delay + 0.35 + i * 0.18}s` }}>
          <b>{i + 1}</b>
          {line.map(([text, kind], j) => (
            <span key={j} style={{ color: TOKEN[kind] }}>
              {text}
            </span>
          ))}
          {i === lines.length - 1 && <i className="code-caret" />}
        </div>
      ))}
    </pre>
  );
}

const SPARK = [62, 66, 64, 71, 69, 76, 74, 82, 80, 88];

function Kpi({ delay }) {
  const pts = SPARK.map((v, i) => `${(i / (SPARK.length - 1)) * 180},${40 - ((v - 60) / 30) * 36}`).join(' ');
  return (
    <div className="widget-body">
      <div className="text-[10px] uppercase tracking-widest text-[#94a3b8]">On-time performance</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-grotesk text-3xl font-semibold text-[#f8fafc]">92.4%</span>
        <span className="font-mono text-[11px] text-[#34d399]">▲ 3.5</span>
      </div>
      <svg viewBox="0 0 180 42" className="mt-2 h-10 w-full overflow-visible">
        <polyline points={pts} fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="widget-draw" style={{ animationDelay: `${delay + 0.4}s` }} />
      </svg>
    </div>
  );
}

const STATIONS = [
  ['DEL', 14],
  ['BOM', 11],
  ['BLR', 8],
  ['HYD', 12],
  ['CCU', 16]
];

function Bars({ delay }) {
  return (
    <div className="widget-body space-y-1.5">
      <div className="mb-2 text-[10px] uppercase tracking-widest text-[#94a3b8]">Avg delay · min</div>
      {STATIONS.map(([code, v], i) => (
        <div key={code} className="flex items-center gap-2 font-mono text-[10px]">
          <span className="w-7 text-[#94a3b8]">{code}</span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#ffffff0d]">
            <span
              className="widget-bar block h-full rounded-full"
              style={{ width: `${(v / 16) * 100}%`, background: v === 16 ? 'linear-gradient(90deg,#fbbf24,#fb7185)' : 'linear-gradient(90deg,#22d3ee,#34d399)', animationDelay: `${delay + 0.4 + i * 0.1}s` }}
            />
          </span>
          <span className="w-4 text-right text-[#e2e8f0]">{v}</span>
        </div>
      ))}
    </div>
  );
}

const MIX = [
  ['Ground handling', 0.48, '#34d399'],
  ['Cargo', 0.32, '#22d3ee'],
  ['Charter', 0.2, '#a78bfa']
];

function Donut({ delay }) {
  let acc = 0;
  return (
    <div className="widget-body flex items-center gap-4">
      <svg viewBox="0 0 42 42" className="h-16 w-16 shrink-0 -rotate-90">
        <circle cx="21" cy="21" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        {MIX.map(([label, share, color], i) => {
          const start = acc;
          acc += share;
          return (
            <circle
              key={label}
              cx="21"
              cy="21"
              r="15.9"
              fill="none"
              stroke={color}
              strokeWidth="5"
              pathLength="1"
              strokeDasharray={`${share - 0.015} 1`}
              strokeDashoffset={-start}
              className="widget-fade"
              style={{ animationDelay: `${delay + 0.4 + i * 0.15}s` }}
            />
          );
        })}
      </svg>
      <div className="space-y-1">
        {MIX.map(([label, share, color]) => (
          <div key={label} className="flex items-center gap-1.5 font-mono text-[10px] text-[#94a3b8]">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
            {label} <span className="text-[#e2e8f0]">{Math.round(share * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const WIDGETS = { kpi: Kpi, bars: Bars, donut: Donut };

function Panel({ panel, index, mx, my }) {
  const x = useTransform(mx, v => v * panel.depth);
  const y = useTransform(my, v => v * panel.depth * 0.6);
  const Widget = WIDGETS[panel.widget];
  return (
    <motion.div className={`pointer-events-none absolute ${panel.className}`} style={{ x, y, perspective: 900 }}>
      <div className="animate-float" style={{ animationDelay: `${index * 1.1}s`, animationDuration: '7s' }}>
        <div className="code-panel" style={{ '--accent': panel.accent, '--tilt': `${panel.rotate}deg`, animationDelay: `${panel.delay}s`, width: panel.width }}>
          <div className="code-panel-bar">
            <span style={{ background: '#fb7185' }} />
            <span style={{ background: '#fbbf24' }} />
            <span style={{ background: '#34d399' }} />
            <em>{panel.file}</em>
          </div>
          {Widget ? <Widget delay={panel.delay} /> : <Code lines={panel.lines} delay={panel.delay} />}
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

  return PANELS.map((p, i) => <Panel key={p.file} panel={p} index={i} mx={mx} my={my} />);
}
