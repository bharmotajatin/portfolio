import { createContext, useContext, useEffect, useState } from 'react';
import bundled from '../data/content.json';
import { PREVIEW_MESSAGE, PREVIEW_READY } from './preview';

const ContentContext = createContext(bundled);

export const isPreview = () =>
  typeof window !== 'undefined' && window.parent !== window && new URLSearchParams(window.location.search).has('preview');

export function ContentProvider({ children }) {
  const [content, setContent] = useState(bundled);

  useEffect(() => {
    if (!isPreview()) return;
    const onMessage = e => {
      if (e.origin !== window.location.origin || e.data?.type !== PREVIEW_MESSAGE) return;
      setContent(e.data.content);
    };
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: PREVIEW_READY }, window.location.origin);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export const useContent = () => useContext(ContentContext);
