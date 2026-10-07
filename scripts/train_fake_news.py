"""Train the Fake News Detection model and export it for in-browser inference.

    python scripts/train_fake_news.py

Downloads the public "fake_or_real_news" dataset (6,335 labelled articles), fits a
TF-IDF + Logistic Regression pipeline, prunes it to the most informative n-grams and
writes public/models/fake-news.json, which src/site/FakeNewsDemo.jsx loads.
"""

import json
import re
import urllib.request
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS, TfidfVectorizer
from sklearn.linear_model import LogisticRegression, SGDClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score
from sklearn.model_selection import train_test_split

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / ".cache-fakenews" / "fake_or_real_news.csv"
OUT = ROOT / "public" / "models" / "fake-news.json"
DATA_URL = "https://raw.githubusercontent.com/lutzhamel/fake-news/master/data/fake_or_real_news.csv"
KEEP = 6000
SEED = 42


def load():
    if not CACHE.exists():
        CACHE.parent.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(DATA_URL, CACHE)
    df = pd.read_csv(CACHE).dropna(subset=["text"])
    df["content"] = (df["title"].fillna("") + ". " + df["text"]).map(clean)
    df = df[df["content"].str.len() > 40]
    return df["content"].tolist(), (df["label"] == "FAKE").astype(int).to_numpy()


def clean(s):
    s = re.sub(r"https?://\S+|www\.\S+", " ", s)
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def vectorizer(**extra):
    return TfidfVectorizer(
        lowercase=True,
        stop_words="english",
        ngram_range=(1, 2),
        sublinear_tf=True,
        min_df=3,
        max_df=0.7,
        **extra,
    )


def metrics(y, pred):
    return {
        "accuracy": round(accuracy_score(y, pred), 4),
        "precision": round(precision_score(y, pred), 4),
        "recall": round(recall_score(y, pred), 4),
        "f1": round(f1_score(y, pred), 4),
    }


def main():
    texts, y = load()
    X_tr, X_te, y_tr, y_te = train_test_split(texts, y, test_size=0.2, stratify=y, random_state=SEED)

    full = vectorizer(max_features=50000)
    A_tr = full.fit_transform(X_tr)
    A_te = full.transform(X_te)

    pa = SGDClassifier(loss="hinge", penalty=None, learning_rate="pa1", eta0=1.0, max_iter=100, random_state=SEED).fit(A_tr, y_tr)
    print("Passive-Aggressive (50k features):", metrics(y_te, pa.predict(A_te)))

    big = LogisticRegression(C=20, max_iter=3000).fit(A_tr, y_tr)
    print("LogReg (50k features):", metrics(y_te, big.predict(A_te)))

    terms = full.get_feature_names_out()
    top = np.argsort(-np.abs(big.coef_[0]))[:KEEP]
    vocab = sorted(terms[top])

    small = vectorizer(vocabulary=vocab)
    B_tr = small.fit_transform(X_tr)
    B_te = small.transform(X_te)
    clf = LogisticRegression(C=20, max_iter=3000).fit(B_tr, y_tr)
    pred = clf.predict(B_te)
    test = metrics(y_te, pred)
    tn, fp, fn, tp = confusion_matrix(y_te, pred).ravel()
    print(f"LogReg ({KEEP} features, exported):", test)

    names = small.get_feature_names_out()
    model = {
        "version": 1,
        "labels": ["REAL", "FAKE"],
        "intercept": round(float(clf.intercept_[0]), 5),
        "stopWords": sorted(ENGLISH_STOP_WORDS),
        "ngram": [1, 2],
        "sublinearTf": True,
        "terms": {t: [round(float(idf), 4), round(float(w), 4)] for t, idf, w in zip(names, small.idf_, clf.coef_[0])},
        "meta": {
            "dataset": "fake_or_real_news (McIntire) — 6,335 labelled political news articles",
            "train": len(X_tr),
            "test": len(X_te),
            "features": len(names),
            "metrics": test,
            "confusion": {"tn": int(tn), "fp": int(fp), "fn": int(fn), "tp": int(tp)},
            "baseline": {"passiveAggressive": metrics(y_te, pa.predict(A_te))["accuracy"]},
        },
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(model, separators=(",", ":"), ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1024:.0f} KB)")

    probs = clf.predict_proba(B_te)[:, 1]
    parity = [{"text": t, "fake": round(float(p), 6)} for t, p in list(zip(X_te, probs))[:200]]
    (CACHE.parent / "parity.json").write_text(json.dumps(parity), encoding="utf-8")


if __name__ == "__main__":
    main()
