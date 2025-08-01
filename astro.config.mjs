// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import { config } from 'dotenv';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

config();

export default defineConfig({
  output: 'server', // Habilitar server-side rendering para API routes
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});