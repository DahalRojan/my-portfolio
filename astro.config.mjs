import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypePrettyCode from 'rehype-pretty-code';

export default defineConfig({
  site: 'https://rojandahal.com',
  integrations: [
    mdx({
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: 'github-light',
            keepBackground: false,
          },
        ],
      ],
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: false,
  },
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: 'github-light',
          keepBackground: false,
        },
      ],
    ],
  },
});
