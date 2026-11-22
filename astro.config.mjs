// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { GLYPH_SETS, fontVar } from './src/globeGlyphs.js';

// Fonts are downloaded from Google at build time and served from this site,
// so pages never wait on fonts.googleapis.com before rendering.
// https://docs.astro.build/en/guides/fonts/
export default defineConfig({
  site: 'https://biswaszin.com',
  devToolbar: { enabled: false },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: [400, 700],
      styles: ['normal'],
      // The default globe glyphs include Latin-extended, Greek and Cyrillic.
      subsets: ['latin', 'latin-ext', 'greek', 'cyrillic', 'cyrillic-ext'],
      fallbacks: ['monospace'],
    },
    {
      provider: fontProviders.google(),
      name: 'Jacquard 12 Charted',
      cssVariable: '--font-display',
      weights: [400],
      styles: ['normal'],
      fallbacks: ['system-ui'],
    },
    // Globe fonts for scripts JetBrains Mono lacks (see src/globeGlyphs.js).
    ...GLYPH_SETS.filter((set) => set.font).map((set) => ({
      provider: fontProviders.google(),
      name: set.font,
      cssVariable: fontVar(set.font),
      weights: [400, 700],
      styles: ['normal'],
      subsets: [set.subset],
      // No fallbacks: these variables are chained in the globe's font stack
      // (src/components/Globe.astro), which ends with its own sans-serif.
      fallbacks: [],
      optimizedFallbacks: false,
    })),
  ],
});
