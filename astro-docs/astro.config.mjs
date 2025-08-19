// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  build: {
    format: 'file' // Build pages as files instead of directories
  }
});
