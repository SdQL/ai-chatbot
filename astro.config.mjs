// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import { config } from 'dotenv';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

config();

export default defineConfig({
  output: 'server', // Habilitar server-side rendering para API routes
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});