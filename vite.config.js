import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const API_ROUTES = ['auth', 'content', 'upload', 'feedback'];

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
    plugins: [react(), tailwindcss(), devApi()],
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
