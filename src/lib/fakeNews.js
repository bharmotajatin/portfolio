// Mirrors scikit-learn's TfidfVectorizer + LogisticRegression from scripts/train_fake_news.py.

let modelPromise;

export function loadModel() {
  modelPromise ||= fetch('/models/fake-news.json').then(r => {
    if (!r.ok) throw new Error(`Model download failed (${r.status})`);
    return r.json().then(m => ({ ...m, stop: new Set(m.stopWords) }));
  });
  modelPromise.catch(() => (modelPromise = null));
  return modelPromise;
}

export function clean(text) {
  return text
    .replace(/https?:\/\/\S+|www\.\S+/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const countWords = text => (text.match(/[\p{L}\p{N}_]+/gu) || []).length;

export function tokenize(text, stop) {
  const words = (text.toLowerCase().match(/[\p{L}\p{N}_]+/gu) || []).filter(w => w.length > 1);
  const kept = words.filter(w => !stop.has(w));
  return { words, kept };
}

export function predict(model, raw) {
  const text = clean(raw);
  const { kept } = tokenize(text, model.stop);
  const grams = [...kept];
  for (let i = 0; i < kept.length - 1; i++) grams.push(`${kept[i]} ${kept[i + 1]}`);

  const counts = new Map();
  for (const g of grams) if (model.terms[g]) counts.set(g, (counts.get(g) || 0) + 1);

  const weights = [];
  let norm = 0;
  for (const [term, n] of counts) {
    const [idf, coef] = model.terms[term];
    const w = (model.sublinearTf ? 1 + Math.log(n) : n) * idf;
    weights.push({ term, n, w, coef });
    norm += w * w;
  }
  norm = Math.sqrt(norm) || 1;

  let z = model.intercept;
  const contributions = weights.map(({ term, n, w, coef }) => {
    const value = (w / norm) * coef;
    z += value;
    return { term, count: n, tfidf: w / norm, coef, value };
  });

  const fake = 1 / (1 + Math.exp(-z));
  return {
    fake,
    label: fake >= 0.5 ? 'FAKE' : 'REAL',
    confidence: Math.max(fake, 1 - fake),
    logit: z,
    stats: { words: countWords(text), kept: kept.length, ngrams: grams.length, matched: counts.size },
    contributions: contributions.sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
  };
}
