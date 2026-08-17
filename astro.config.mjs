import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

/**
 * Two themes are emitted at once. Shiki writes both as CSS custom
 * properties on each token, and global.css picks which one to read
 * from the active palette — so switching theme never re-highlights.
 */
const prettyCode = [
  rehypePrettyCode,
  {
    theme: { light: 'github-light', dark: 'github-dark-dimmed' },
    keepBackground: false,
    defaultLang: 'plaintext',
  },
];

/**
 * Astro already adds `id`s to headings; this turns each one into a
 * quiet anchor link. `append` keeps the link out of the heading's
 * accessible name, and the visible glyph is hidden from assistive tech.
 */
const autolink = [
  rehypeAutolinkHeadings,
  {
    behavior: 'append',
    properties: { className: ['heading-anchor'], ariaHidden: 'true', tabIndex: -1 },
    content: { type: 'text', value: '#' },
  },
];

export default defineConfig({
  site: 'https://rojandahal.com',

  integrations: [
    mdx({ rehypePlugins: [prettyCode, autolink] }),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    inlineStylesheets: 'auto',
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [prettyCode, autolink],
  },
});
