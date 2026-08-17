/**
 * Build-time Open Graph images.
 *
 * Runs after `astro build` and writes one 1200×630 PNG per essay and
 * case study into dist/og/. Satori lays out the card and resvg
 * rasterises it — no browser, no runtime service, nothing to keep up.
 *
 * The card deliberately reuses the site's own type and palette so a
 * shared link looks like the page it points at.
 */

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'dist', 'og');

const WIDTH = 1200;
const HEIGHT = 630;

// Light palette only. OG previews render on whatever background the
// host platform uses, so a single high-contrast card beats trying to
// guess the viewer's theme.
const PAPER = '#faf7f2';
const INK = '#1a1a1a';
const INK_SOFT = '#4a4845';
const ACCENT = '#b54a2a';

const fontFile = (pkg, file) => join(root, 'node_modules', '@fontsource', pkg, 'files', file);

async function loadFonts() {
  const [serif, sans, mono] = await Promise.all([
    readFile(fontFile('instrument-serif', 'instrument-serif-latin-400-normal.woff')),
    readFile(fontFile('ibm-plex-sans', 'ibm-plex-sans-latin-400-normal.woff')),
    readFile(fontFile('jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff')),
  ]);

  return [
    { name: 'Instrument Serif', data: serif, weight: 400, style: 'normal' },
    { name: 'IBM Plex Sans', data: sans, weight: 400, style: 'normal' },
    { name: 'JetBrains Mono', data: mono, weight: 400, style: 'normal' },
  ];
}

/** Minimal frontmatter reader — enough for the handful of scalar
 *  fields the card needs, without pulling in a YAML parser. */
function frontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const out = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (!field) continue;
    let value = field[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[field[1]] = value;
  }
  return out;
}

/** Long titles get a smaller face so the card never clips. */
function titleSize(title) {
  if (title.length > 78) return 54;
  if (title.length > 52) return 64;
  return 76;
}

function card({ kicker, title, dek }) {
  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: PAPER,
        padding: '68px 76px',
        borderTop: `10px solid ${ACCENT}`,
        fontFamily: 'IBM Plex Sans',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column' },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'JetBrains Mono',
                    fontSize: 22,
                    letterSpacing: 4,
                    textTransform: 'uppercase',
                    color: ACCENT,
                  },
                  children: kicker,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'Instrument Serif',
                    fontSize: titleSize(title),
                    lineHeight: 1.08,
                    letterSpacing: -1,
                    color: INK,
                    marginTop: 26,
                    // Satori has no line clamp; the width cap plus the
                    // size ramp above keeps four lines as the ceiling.
                    maxWidth: 960,
                  },
                  children: title,
                },
              },
              dek && {
                type: 'div',
                props: {
                  style: {
                    fontSize: 26,
                    lineHeight: 1.45,
                    color: INK_SOFT,
                    marginTop: 26,
                    maxWidth: 880,
                  },
                  children: dek.length > 150 ? `${dek.slice(0, 147)}…` : dek,
                },
              },
            ].filter(Boolean),
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(26,26,26,0.15)',
              paddingTop: 26,
              fontFamily: 'JetBrains Mono',
              fontSize: 22,
              color: INK_SOFT,
            },
            children: [
              { type: 'div', props: { children: 'Rojan Dahal' } },
              { type: 'div', props: { children: 'rojandahal.com' } },
            ],
          },
        },
      ],
    },
  };
}

async function render(fonts, spec, filename) {
  const svg = await satori(card(spec), { width: WIDTH, height: HEIGHT, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } })
    .render()
    .asPng();
  await writeFile(join(OUT, filename), png);
  return filename;
}

/** Collect the English entries of a collection — OG cards are shared
 *  across locales, and the English catalogue is the complete one. */
async function entries(collection) {
  const dir = join(root, 'src', 'content', collection, 'en');
  const files = await readdir(dir).catch(() => []);
  const out = [];

  for (const file of files) {
    if (!file.endsWith('.mdx') && !file.endsWith('.md')) continue;
    const data = frontmatter(await readFile(join(dir, file), 'utf8'));
    if (data.draft === 'true') continue;
    out.push({ slug: file.replace(/\.mdx?$/, ''), data });
  }
  return out;
}

/** iOS has no SVG-favicon support, so the touch icon is rasterised
 *  from the same mark rather than shipped as a hand-made PNG. */
async function appleTouchIcon() {
  const svg = await readFile(join(root, 'public', 'favicon.svg'), 'utf8');
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 180 } }).render().asPng();
  await writeFile(join(root, 'dist', 'apple-touch-icon.png'), png);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const fonts = await loadFonts();
  const written = [];

  await appleTouchIcon();

  written.push(
    await render(
      fonts,
      {
        kicker: 'AI Engineer · Production ML',
        title: 'Rojan Dahal',
        dek: 'Field notes on the layers of an ML system that filter, route, and validate before a single token is spent.',
      },
      'default.png'
    )
  );

  for (const { slug, data } of await entries('writing')) {
    written.push(
      await render(fonts, { kicker: 'Essay', title: data.title, dek: data.dek }, `writing-${slug}.png`)
    );
  }

  for (const { slug, data } of await entries('work')) {
    written.push(
      await render(
        fonts,
        { kicker: `Case study · ${data.role ?? ''}`.trim(), title: data.title, dek: data.summary },
        `work-${slug}.png`
      )
    );
  }

  console.log(`[og] wrote ${written.length} images to dist/og/`);
}

main().catch((error) => {
  console.error('[og] failed:', error);
  process.exit(1);
});
