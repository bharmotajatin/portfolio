import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { countWords, loadModel, predict } from '../lib/fakeNews';

const SAMPLES = [
  {
    label: 'Wire report',
    kind: 'real',
    text: 'Senate passes budget bill after late-night session. WASHINGTON — The Senate on Thursday approved a $1.2 trillion spending package by a vote of 68 to 31, sending the measure to the House ahead of a Friday deadline to avoid a partial government shutdown. The agreement funds federal agencies through September and includes additional money for border security and disaster relief. Republicans and Democrats both said the bill was not perfect but argued it was better than a shutdown. The House is expected to vote on Friday, according to aides familiar with the schedule, and the White House said in a statement that the president would sign it.'
  },
  {
    label: 'Poll story',
    kind: 'real',
    text: "Clinton leads Trump in new national poll after first debate. Hillary Clinton holds a four-point lead over Donald Trump among likely voters, according to a poll released on Tuesday, the first national survey conducted entirely after Monday night's presidential debate. Clinton has 45 percent support compared with 41 percent for Trump. The poll's margin of error is plus or minus three percentage points. Campaign officials for both candidates said the race remained close in battleground states such as Ohio, Florida and Pennsylvania."
  },
  {
    label: 'Conspiracy post',
    kind: 'fake',
    text: "BREAKING: They don't want you to know this! The globalist elites and the mainstream media are hiding the truth about what really happened. Share this before it gets deleted! Insiders have now confirmed that the deep state has been secretly working to rig the election, and the evidence is everywhere if you just open your eyes. The establishment is terrified because the people are finally waking up to the lies."
  },
  {
    label: 'Miracle cure',
    kind: 'fake',
    text: "Doctors are FURIOUS about this one simple trick the government has been hiding for decades. Big Pharma doesn't want you to read this article. A secret natural cure that eliminates disease overnight has been suppressed by the elite, and anyone who tried to reveal it was silenced. The truth is finally coming out and the alternative media is the only place you will hear it. Please share this with everyone you know before they take it down."
  }
];

const STEPS = [
  { key: 'clean', icon: 'ri-eraser-line', title: 'Clean', note: r => `${r.stats.words} words` },
  { key: 'tokens', icon: 'ri-scissors-cut-line', title: 'Tokenise', note: r => `${r.stats.kept} after stop-words` },
  { key: 'tfidf', icon: 'ri-grid-line', title: 'TF-IDF', note: r => `${r.stats.matched} known n-grams` },
  { key: 'clf', icon: 'ri-brain-line', title: 'Classify', note: r => `logit ${r.logit.toFixed(2)}` }
];

const FAKE = '#fb7185';
const REAL = '#34d399';
const MIN_WORDS = 25;

function Highlighted({ text, weights }) {
  const parts = text.split(/([\p{L}\p{N}_]+)/u);
  const max = Math.max(0.05, ...[...weights.values()].map(Math.abs));
  return (
    <p className="text-sm leading-7 text-slate-300">
      {parts.map((p, i) => {
        const v = i % 2 ? weights.get(p.toLowerCase()) : undefined;
        if (!v) return p;
        const a = Math.min(1, Math.abs(v) / max);
        const c = v > 0 ? FAKE : REAL;
        return (
          <mark key={i} title={`${v > 0 ? '+' : ''}${v.toFixed(3)} toward ${v > 0 ? 'FAKE' : 'REAL'}`} className="rounded px-0.5 text-white" style={{ background: `${c}${Math.round(18 + a * 70).toString(16).padStart(2, '0')}` }}>
            {p}
          </mark>
        );
      })}
    </p>
  );
}

function Drivers({ title, items, color, max }) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-widest" style={{ color }}>
        {title}
      </div>
      <div className="space-y-1.5">
        {items.length === 0 && <div className="text-xs text-slate-500">None</div>}
        {items.map((c, i) => (
          <div key={c.term} className="flex items-center gap-2 text-xs">
            <span className="w-24 shrink-0 truncate font-mono text-slate-300" title={c.term}>
              {c.term}
            </span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
              <motion.span className="block h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${(Math.abs(c.value) / max) * 100}%` }} transition={{ delay: 0.1 + i * 0.05, duration: 0.6 }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FakeNewsDemo({ project }) {
  const [model, setModel] = useState(null);
  const [error, setError] = useState('');
  const [text, setText] = useState(SAMPLES[2].text);
  const [result, setResult] = useState(null);
  const [analysed, setAnalysed] = useState('');
  const [step, setStep] = useState(-1);
  const timers = useRef([]);

  useEffect(() => {
    loadModel().then(setModel, e => setError(e.message));
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const words = countWords(text);
  const running = step >= 0 && step < STEPS.length;

  const run = (input = text) => {
    if (!model || !input.trim()) return;
    timers.current.forEach(clearTimeout);
    const r = predict(model, input);
    setResult(null);
    setAnalysed(input);
    setStep(0);
    timers.current = STEPS.map((_, i) => setTimeout(() => setStep(i + 1), 280 * (i + 1)));
    timers.current.push(setTimeout(() => setResult(r), 280 * STEPS.length));
  };

  useEffect(() => {
    if (model) run();
  }, [model]);

  const pick = s => {
    setText(s.text);
    run(s.text);
  };

  const weights = useMemo(() => new Map((result?.contributions || []).filter(c => !c.term.includes(' ')).map(c => [c.term, c.value])), [result]);
  const fakeDrivers = result ? result.contributions.filter(c => c.value > 0).slice(0, 6) : [];
  const realDrivers = result ? result.contributions.filter(c => c.value < 0).slice(0, 6) : [];
  const maxDriver = Math.max(0.01, ...[...fakeDrivers, ...realDrivers].map(c => Math.abs(c.value)));
  const verdictColor = result?.label === 'FAKE' ? FAKE : REAL;
  const m = model?.meta;

  return (
    <div className="flex h-full min-h-0 flex-col bg-ink">
      <div className="flex items-center gap-3 border-b border-white/10 bg-ink-3/80 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-mint/80" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-white/5 px-3 py-1 font-mono text-[11px] text-slate-400">
          <i className="ri-cpu-line text-mint" />
          <span className="truncate">fake-news-detector · runs in your browser</span>
        </div>
        <span className={`flex items-center gap-1.5 font-mono text-[10px] ${model ? 'text-mint' : error ? 'text-rose' : 'text-slate-500'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${model ? 'bg-mint' : error ? 'bg-rose' : 'animate-pulse bg-slate-500'}`} />
          {model ? 'model ready' : error ? 'offline' : 'loading'}
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5" data-lenis-prevent>
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-widest text-slate-500">Try</span>
            {SAMPLES.map(s => (
              <button
                key={s.label}
                type="button"
                onClick={() => pick(s)}
                className="cursor-target rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-slate-300 transition-colors hover:border-white/30 hover:text-white"
              >
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full" style={{ background: s.kind === 'fake' ? FAKE : REAL }} />
                {s.label}
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => (e.ctrlKey || e.metaKey) && e.key === 'Enter' && run()}
            rows={5}
            placeholder="Paste a news headline and article…"
            className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-slate-500 focus:border-mint/50"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className={`font-mono text-[11px] ${words && words < MIN_WORDS ? 'text-amber' : 'text-slate-500'}`}>
              {words} words{words > 0 && words < MIN_WORDS ? ' · paste a full article for a reliable result' : ''}
            </span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setText('')} className="cursor-target rounded-full px-3 py-2 text-xs text-slate-400 hover:text-white">
                Clear
              </button>
              <button type="button" disabled={!model || !text.trim() || running} onClick={() => run()} className="btn-primary cursor-target !px-4 !py-2 text-xs disabled:opacity-50">
                <i className={running ? 'ri-loader-4-line animate-spin' : 'ri-search-eye-line'} /> Analyse
              </button>
            </div>
          </div>
          {error && <div className="mt-2 text-xs text-rose">Couldn’t load the model: {error}</div>}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {STEPS.map((s, i) => {
            const done = step > i;
            const active = step === i;
            return (
              <div key={s.key} className={`relative rounded-xl border p-2.5 transition-all duration-300 ${done ? 'border-mint/40 bg-mint/[0.07]' : active ? 'border-cyan/50 bg-cyan/[0.07]' : 'border-white/10 bg-white/[0.02]'}`}>
                <div className="flex items-center gap-1.5">
                  <i className={`${s.icon} text-sm ${done ? 'text-mint' : active ? 'text-cyan' : 'text-slate-500'}`} />
                  <span className="text-xs font-semibold text-white">{s.title}</span>
                </div>
                <div className="mt-1 truncate font-mono text-[10px] text-slate-500">{done && result ? s.note(result) : done ? '✓' : active ? 'running…' : '—'}</div>
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {result ? (
            <motion.div key={analysed} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              <div className="rounded-2xl border p-4" style={{ borderColor: `${verdictColor}55`, background: `${verdictColor}12` }}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Verdict</div>
                    <div className="font-display text-3xl font-bold" style={{ color: verdictColor }}>
                      {result.label === 'FAKE' ? 'Likely fake' : 'Likely real'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-3xl font-bold text-white">{result.confidence > 0.999 ? '>99.9' : (result.confidence * 100).toFixed(1)}%</div>
                    <div className="font-mono text-[10px] text-slate-500">confidence</div>
                  </div>
                </div>
                <div className="relative mt-4 h-2.5 overflow-hidden rounded-full" style={{ background: `linear-gradient(90deg, ${REAL}, #fbbf24, ${FAKE})` }}>
                  <motion.span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink shadow" initial={{ left: '50%' }} animate={{ left: `${result.fake * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 16 }} />
                </div>
                <div className="mt-1.5 flex justify-between font-mono text-[10px] text-slate-500">
                  <span>REAL</span>
                  <span>P(fake) = {result.fake.toFixed(3)}</span>
                  <span>FAKE</span>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Drivers title="Pushing toward fake" items={fakeDrivers} color={FAKE} max={maxDriver} />
                <Drivers title="Pushing toward real" items={realDrivers} color={REAL} max={maxDriver} />
              </div>

              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">Evidence in the text</div>
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <Highlighted text={analysed} weights={weights} />
                </div>
              </div>
            </motion.div>
          ) : (
            !running && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">
                <i className="ri-newspaper-line mb-2 block text-3xl" style={{ color: project.color }} />
                Pick a sample or paste an article, then press <b className="text-slate-300">Analyse</b>.
              </motion.div>
            )
          )}
        </AnimatePresence>

        {m && (
          <div className="grid grid-cols-4 gap-2 border-t border-white/10 pt-4 text-center">
            {[
              ['Accuracy', `${(m.metrics.accuracy * 100).toFixed(1)}%`],
              ['F1 score', m.metrics.f1.toFixed(3)],
              ['Test set', m.test.toLocaleString()],
              ['Features', m.features.toLocaleString()]
            ].map(([k, v]) => (
              <div key={k}>
                <div className="font-display text-lg font-bold text-white">{v}</div>
                <div className="font-mono text-[10px] text-slate-500">{k}</div>
              </div>
            ))}
          </div>
        )}
        <p className="text-[11px] leading-relaxed text-slate-500">
          The model judges writing style, not facts: it was trained on 2016-era US political news, so treat results on other topics as a demonstration rather than a fact-check.
        </p>
      </div>
    </div>
  );
}
