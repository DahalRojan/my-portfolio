# rojandahal.com

Personal portfolio of **Rojan Dahal** — AI / ML Engineer · Production AI Systems.

The site is a **scroll-driven WebGL experience** of the Gatekeeper architecture I'm currently shipping at TitanCloud. Visitors scroll *through* a 3D pipeline (4 translucent gate slabs, a document particle, a Bedrock orb) while reading my work. The metaphor is the work.

## Stack

| Layer            | Choice                                                                |
| ---------------- | --------------------------------------------------------------------- |
| Framework        | **Astro 5** (static, React islands)                                   |
| Type system      | **TypeScript** strict                                                 |
| Styling          | **Tailwind CSS v4** (Vite plugin)                                     |
| 3D               | **three.js + React Three Fiber + drei** (lazy-loaded chunk)           |
| Motion           | **GSAP + ScrollTrigger** (camera choreography) · **Lenis** (smooth scroll) |
| Type             | **Instrument Serif** (display) · **IBM Plex Sans** (body) · **JetBrains Mono** (mono) — all self-hosted via `@fontsource` |
| Deploy           | **Cloudflare Pages**, auto-deploy on push to `main`                   |

## Running locally

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # production output → dist/
npm run preview   # serve dist/ locally
```

## Project layout

```
src/
  pages/index.astro              # single-page site
  layouts/Base.astro             # head, meta, OG, JSON-LD
  scene/
    PipelineScene.tsx            # the WebGL scene (Three + R3F + custom shader)
    PipelineFallback.astro       # static SVG used under prefers-reduced-motion
  components/
    Nav.astro
    Hero.astro
    SectionPanel.astro           # shared header + body wrapper
    About.astro                  # 01 / Rules
    Signals.astro                # 02 / Signals
    CaseCard.astro
    Work.astro                   # 03 / Inference
    Research.astro               # 04 / Decision
    Contact.astro                # 05 / Output
    SceneHost.astro              # mounts scene OR fallback based on motion pref
  content/
    cases.ts                     # 4 case studies (TitanCloud, Gannon GA, Gannon Research, BitsKraft)
    skills.ts                    # 5 skill rows
    publications.ts              # NAMRC paper + certifications
  lib/
    smooth-scroll.ts             # Lenis + GSAP ticker
  styles/global.css              # tokens, type, helpers
public/
  resume.pdf                     # mirror of assets/Resume_Rojan_Dahal.pdf
  front.jpg · icon2.png · og.svg · robots.txt
docs/superpowers/specs/2026-05-16-portfolio-redesign-design.md   # design spec
```

## Editing content

All copy is typed data — no JSX to touch.

| Need to change            | File                              |
| ------------------------- | --------------------------------- |
| Case studies              | `src/content/cases.ts`            |
| Skills (signal rows)      | `src/content/skills.ts`           |
| Publication + certs       | `src/content/publications.ts`     |
| Hero copy                 | `src/components/Hero.astro`       |
| About prose               | `src/components/About.astro`      |
| Contact / footer          | `src/components/Contact.astro`    |
| 3D scene (slabs, camera)  | `src/scene/PipelineScene.tsx`     |

## Performance

| Asset                                       | Size (gz)   |
| ------------------------------------------- | ----------- |
| HTML (`/`)                                  | ~10 KB      |
| First-paint JS (Astro + Lenis + ScrollTrigger + React shell) | ~113 KB     |
| **Lazy 3D chunk** (Three + R3F + drei + scene) | **~243 KB** |

The 3D chunk hydrates `client:visible`, so the hero text and the section content render with the SSR'd HTML. A static SVG fallback is rendered under `prefers-reduced-motion: reduce`.

## Accessibility

- WCAG 2.2 AA contrast in dark mode.
- `prefers-reduced-motion`: 3D scene + smooth scroll both disabled; the SVG pipeline fallback takes over.
- Full keyboard navigation. Skip-to-content not implemented (single-page site, no header navigation interaction required).
- Phone number masked (`+1 (220) 238-XX-XX`); email rendered in full.

## Deploy — Cloudflare Pages

The repo is auto-deployed by **Cloudflare Pages** on push to `main`.

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 20 or newer

`.gitignore` blocks `.claude/`, `.agents/`, `.remember/`, `node_modules/`, `.astro/`, `dist/`, and the legacy `index.html` + `assets/css|js|vendors`. Only production source ships to Cloudflare.

## License

Source MIT. Resume PDF, portrait, and personal copy © Rojan Dahal.
