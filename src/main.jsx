import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import 'remixicon/fonts/remixicon.css';
import './index.css';

const isAdmin = window.location.pathname.replace(/\/+$/, '').startsWith('/admin');
const Root = lazy(() => (isAdmin ? import('./admin/Admin.jsx') : import('./site/Site.jsx')));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<div className="min-h-screen bg-ink" />}>
      <Root />
    </Suspense>
  </StrictMode>
);
