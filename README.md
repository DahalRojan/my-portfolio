# rojandahal.com

Personal site and writing of **Rojan Dahal** — AI / ML Engineer.

An editorial, text-first site: warm paper, one accent, a serif display face,
and motion that stays out of the way. Content lives in MDX; everything is
prerendered to static HTML.

## Stack

| Layer      | Choice                                                                   |
| ---------- | ------------------------------------------------------------------------ |
| Framework  | **Astro 5** — static output, zero framework JS on the page               |
| Type system| **TypeScript** strict                                                    |
| Styling    | **Tailwind CSS v4** (Vite plugin) over a custom token layer              |
| Search     | **Pagefind** — index built at deploy time, runs in the browser           |
| Type       | **Instrument Serif** (display) · **IBM Plex Sans** (body) · **JetBrains Mono** — self-hosted via `@fontsource` |
| OG images  | **Satori + resvg** — one card per entry, rendered at build time          |
| Deploy     | **Cloudflare Pages**, auto-deploy on push to `main`                      |

## Running locally

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output → dist/ (also writes OG images + search index)
npm run preview   # serve dist/ locally
```

`npm run build` runs three steps in order: `astro build`, then `npm run og`
(OG cards + the iOS touch icon), then `npm run index` (Pagefind). Search and
share images only exist after a full build — `astro dev` alone won't have them.

## Project layout

```
src/
  layouts/
    Base.astro           # head, meta, theme bootstrap, motion runtime
    Post.astro           # essay: TOC, progress, prev/next, related
    CaseStudy.astro      # work entry
    Listing.astro        # shared index-page frame
  components/
    Nav.astro            # sticky header, mobile disclosure, language switch
    Footer.astro
    ThemeToggle.astro
    EssayCard.astro · WorkCard.astro · SectionHeader.astro
    TableOfContents.astro · PostMeta.astro · PostNav.astro
    pages/               # per-route page bodies, shared across locales
      HomePage.astro · WritingPage.astro · WorkPage.astro · SearchPage.astro
  content/
    writing/en/*.mdx     # essays
    work/en/*.mdx        # case studies
  lib/
    alt-lang.ts          # language-switch target, translation-aware
    taxonomy.ts          # related posts, heading filter
    content.ts           # locale-prefixed collection ids
    reading.ts
  i18n/
    ui.ts                # every string, both locales
  styles/global.css      # tokens, motion system, prose
scripts/
  og-images.mjs          # build-time OG cards
```

## Editing content

Essays are MDX files under `src/content/writing/en/`. Frontmatter:

```yaml
---
title: "..."
dek: "One sentence that appears under the title and in previews."
date: 2026-08-17
tags: ["production-ml", "cost"]   # not displayed; used for related posts + RSS
featured: true                    # surfaces on the home page
draft: false
---
```

Case studies live in `src/content/work/en/` and additionally take `role`,
`period`, `order`, `summary`, and `stack`.

UI strings are **not** inlined in components — they live in `src/i18n/ui.ts`
so English and Nepali stay in step. A missing Nepali key falls back to English
rather than rendering the key name.

### Adding a Nepali translation

Drop a file with the **same slug** under the `ne/` directory of the same
collection. The site picks it up automatically: the home page and index link
to the translation where one exists, the language switch resolves to the
translated page, and untranslated pieces fall back to the section index rather
than 404ing (`src/lib/alt-lang.ts`).

## Design system

Tokens live at the top of `src/styles/global.css`.

- **Colour** — one accent, three warm surfaces, four ink weights. Light and
  dark are defined as complete sets; dark is applied from both
  `[data-theme="dark"]` and `prefers-color-scheme`, so system users and
  explicit choosers both get it.
- **Motion** — four durations (140 / 240 / 420 / 700 ms) and three easings.
  Reveal-on-scroll is `IntersectionObserver`, one-way, with a head-script
  failsafe that restores content if the main bundle fails to load. The
  reading-progress bar uses a CSS scroll timeline where available.
- **Reduced motion** — `prefers-reduced-motion: reduce` disables entrances,
  view transitions, smooth scrolling, and the progress bar.

## Accessibility

- Skip link, landmarks, and `aria-current` on the active nav item.
- Visible focus rings on every interactive element.
- The mobile menu is a native `<details>` disclosure — keyboard-operable, and
  it keeps working across view transitions without JS.
- Content is never gated behind scroll: if the reveal script doesn't run,
  everything renders at full opacity.
- Theme toggle picks its icon in CSS, so it is correct before scripts run.

## Deploy — Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Node: 20+ (pinned in `.nvmrc` / `.node-version`)

## License

Source MIT. Résumé PDF, portrait, and personal writing © Rojan Dahal.
