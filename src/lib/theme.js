import { useSyncExternalStore } from 'react';

const KEY = 'theme';
const META = { dark: '#05060a', light: '#f5f7fb' };
const listeners = new Set();
const root = document.documentElement;

const current = () => (root.classList.contains('light') ? 'light' : 'dark');

function apply(theme) {
  root.classList.toggle('light', theme === 'light');
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META[theme]);
  listeners.forEach(l => l());
}

export function setTheme(theme, origin) {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* storage unavailable */
  }
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || still) return apply(theme);

  const x = origin?.x ?? window.innerWidth - 40;
  const y = origin?.y ?? 40;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  document.startViewTransition(() => apply(theme)).ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 650, easing: 'cubic-bezier(0.7, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
    );
  });
}

export function toggleTheme(e) {
  const origin = e?.currentTarget?.getBoundingClientRect?.();
  setTheme(current() === 'light' ? 'dark' : 'light', origin && { x: origin.left + origin.width / 2, y: origin.top + origin.height / 2 });
}

const subscribe = cb => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function useTheme() {
  return useSyncExternalStore(subscribe, current);
}

window.addEventListener('storage', e => {
  if (e.key === KEY && e.newValue) apply(e.newValue);
});

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
  let stored = null;
  try {
    stored = localStorage.getItem(KEY);
  } catch {
    /* storage unavailable */
  }
  if (!stored) apply(e.matches ? 'light' : 'dark');
});
