import { defineConfig } from 'astro/config';

// Static site (Vercel / Netlify auto-detect Astro and run `astro build`).
// Served at the domain root, so base stays '/'.
export default defineConfig({
  site: 'https://vmoyse.fr',
  base: '/',
  build: {
    format: 'directory',
  },
});
