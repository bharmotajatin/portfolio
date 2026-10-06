import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const API_ROUTES = ['auth', 'content', 'upload', 'feedback'];

const DASHBOARD_DIR = path.resolve('dist/dashboard');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

// The dashboard is a separate app that only exists after `npm run build:dashboard`;
// without this, Vite's SPA fallback serves the portfolio at /dashboard/.
function devDashboard() {
  return {
    name: 'dev-dashboard',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent((req.url || '').split('?')[0]);
        if (url !== '/dashboard' && !url.startsWith('/dashboard/')) return next();

        const index = path.join(DASHBOARD_DIR, 'index.html');
        if (!fs.existsSync(index)) {
          res.statusCode = 503;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end('<body style="font-family:sans-serif;padding:2rem">Dashboard not built yet. Run <code>npm run build:dashboard</code> and reload.</body>');
          return;
        }

        const file = path.join(DASHBOARD_DIR, url.slice('/dashboard'.length));
        const inside = file.startsWith(DASHBOARD_DIR);
        const target = inside && fs.existsSync(file) && fs.statSync(file).isFile() ? file : index;
        res.setHeader('Content-Type', MIME[path.extname(target).toLowerCase()] || 'application/octet-stream');
        fs.createReadStream(target).pipe(res);
      });
    }
  };
}

function devApi() {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const match = req.url?.match(/^\/api\/([a-z]+)(?:\?|$)/);
        if (!match || !API_ROUTES.includes(match[1])) return next();
        try {
          const mod = await server.ssrLoadModule(`/api/${match[1]}.js`);
          await mod.default(req, res);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const [k, v] of Object.entries(env)) if (process.env[k] === undefined) process.env[k] = v;

  return {
    plugins: [react(), tailwindcss(), devApi(), devDashboard()],
    server: {
      port: 5173,
      watch: { ignored: ['**/dashboard/**'] }
    },
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/three') || id.includes('@react-three')) return 'three';
            if (id.includes('node_modules/gsap')) return 'gsap';
          }
        }
      }
    }
  };
});
