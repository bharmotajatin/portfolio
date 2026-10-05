# Jatin Bharmota — Portfolio

Personal portfolio built with React, Vite, Tailwind CSS 4, Three.js (react-three-fiber), GSAP, Motion and components from [React Bits](https://reactbits.dev). Includes a password-protected admin at `/admin` for editing every section, and the Scheduled Flight Dashboard project served at `/dashboard/`.

## Develop

```bash
npm install
npm run dev
```

- Site: http://localhost:5173
- Admin: http://localhost:5173/admin (password `admin` unless `ADMIN_PASSWORD` is set in `.env.local`)

In dev, admin saves write straight to `src/data/content.json` and uploads go to `public/uploads/`.

## Content

All site content lives in `src/data/content.json`. Edit it through the admin (recommended) or by hand. The admin can add, edit, duplicate, reorder and delete projects, experience, skills, education, certifications and testimonials, rename/reorder/hide sections, upload images and files, and import/export a JSON backup. A live preview shows unsaved edits.

## Deploy (Vercel)

`npm run build` builds the site and the dashboard into `dist/`. The `/api` folder holds the serverless functions used by the admin.

Set these environment variables in the Vercel project (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Admin login password (required in production) |
| `GITHUB_TOKEN` | Token with Contents read/write on the repo, so saves can commit |
| `GITHUB_REPO` | `owner/name`, defaults to `bharmotajatin/portfolio` |
| `GITHUB_BRANCH` | Defaults to `main` |
| `ADMIN_SECRET` | Optional cookie-signing secret |

On Vercel, saving in the admin commits `src/data/content.json` (and uploads into `public/uploads/`) to GitHub, which triggers a redeploy; changes are live in about a minute.

## Contact form

Messages open the visitor's mail app by default. To receive them directly, paste a form endpoint (e.g. Formspree) into Admin → Contact form.
