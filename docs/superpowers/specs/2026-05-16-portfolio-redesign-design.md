# Portfolio Redesign — Design Spec

**Date:** 2026-05-16
**Owner:** Rojan Dahal
**Status:** Approved direction (A — Scroll-driven 3D Pipeline). Ready for implementation.

---

## 1. Concept

**"The Production Pipeline."** The site is a single scroll-driven WebGL experience where the visitor is a *document* being processed through Rojan's actual TitanCloud Gatekeeper architecture. The same 4-layer hybrid classifier that gates the Bedrock VLM in production is rendered as a 3D scene the visitor literally scrolls through.

This is not 3D for decoration. The 3D *is* the work. Every recruiter or staff engineer who lands on the page will, in 60 seconds, have experienced — visually — what Rojan builds.

**Tagline that anchors the design:** *"I build the systems that gate, validate, and govern other AI systems."*

---

## 2. Information Architecture

A single page, six sections, mapped to pipeline stages:

| Section            | Pipeline stage              | Content                                                              |
| ------------------ | --------------------------- | -------------------------------------------------------------------- |
| `00 / Intake`      | Pre-filter                  | Hero. Name, thesis, status pill, scroll CTA.                         |
| `01 / Rules`       | L1 — rule-based filters     | About / values. Adopt LinkedIn Summary voice verbatim or near-verbatim. |
| `02 / Signals`     | L2 — keyword/feature scorer | Skills, organized as tool inventory, not "weight bars."              |
| `03 / Inference`   | L3 — vision preprocessor    | Work. Four case studies, each with a 3D motif.                       |
| `04 / Decision`    | L4 — final classifier       | Research, certifications, peer-reviewed paper.                       |
| `05 / Output`      | → Bedrock                   | Contact. Email as the hero element.                                  |

Section numbers (`00 / Intake`, `01 / Rules` …) render as monospaced labels in a persistent left rail — they're part of the visual language, not just headings.

---

## 3. Visual System

### Typography
Three families, all self-hosted via `@fontsource`:

- **Display** — *Instrument Serif* (roman + italic). Used for the name, section titles, pull quotes. Italic carries emphasis on the three verbs in the tagline.
- **Body** — *IBM Plex Sans*, 16 px / 1.55 line-height. Technical heritage, distinctive without being trendy.
- **Mono** — *JetBrains Mono*. Section numbers, code chips, file paths, metric values. Mono is **load-bearing** — it carries the "research engineer" signal.

Banned: Inter, Geist, Space Grotesk, Plus Jakarta Sans, any font that signals "AI-generated portfolio template."

### Color

**Default: dark warm near-black.** Light mode is **not** in v1 scope — the 3D scene is designed for dark.

| Token             | Value                                | Used for                                  |
| ----------------- | ------------------------------------ | ----------------------------------------- |
| `--bg`            | `#0A0A0B`                            | Page background                           |
| `--surface`       | `#13141A`                            | Cards, citation block, panel surfaces     |
| `--border`        | `rgba(255,255,255,0.07)`             | Hairlines                                 |
| `--ink`           | `#ECECEF`                            | Primary text                              |
| `--ink-dim`       | `#9095A0`                            | Secondary text                            |
| `--ink-mute`      | `#5B6068`                            | Section numbers, captions                 |
| **`--accent`**    | **`#9FE870`** (electric green)       | The single accent. Pulsing dot, key metrics, CTA, scene emissive. |
| `--accent-warm`   | `#F5C46C` (warm amber)               | Secondary signal — `REVIEW` decision, intermediate states only.  |
| `--danger`        | `#E5484D`                            | Only the `OUT-OF-SCOPE` decision (used sparingly).               |

**No** purple/indigo/cyan gradients. **No** glassmorphism on the foreground content (the 3D scene supplies all the depth).

### Background
- A **single fixed-position WebGL canvas** behind all content, full viewport.
- Content scrolls above it. The canvas reacts to scroll position, not the other way around.
- A subtle SVG grain overlay (`opacity: 0.035`, `mix-blend-mode: overlay`) sits on top of both canvas and content — keeps the whole thing from feeling sterile.

---

## 4. The 3D Scene (the centerpiece)

### Stack
- **`three`** (core, ~150 KB gz)
- **`@react-three/fiber`** (React renderer, ~30 KB gz on top)
- **`@react-three/drei`** (only the helpers we use, tree-shaken)
- **`gsap` + `ScrollTrigger`** (~30 KB gz) for scroll-driven camera
- **`lenis`** (~3 KB gz) for smooth scroll feel

Total 3D-related JS budget: **~250 KB gz**. Justified because the scene IS the value prop. Compensate by lazy-loading the canvas after first paint (hero text renders instantly via SSR; canvas hydrates after).

### Scene geometry
A horizontal pipeline laid out along the +Z axis:

```
camera initial pos → ◇ DOCUMENT particle (emissive)
                        │
                        ▼
                   ▓▓▓ L1  rule filter slab (translucent, hairline edge)
                        │
                        ▼
                   ▓▓▓ L2  keyword scorer slab
                        │
                        ▼
                   ▓▓▓ L3  DocAligner ONNX slab (slightly larger)
                        │
                        ▼
                   ▓▓▓ L4  EfficientNet-B0 slab (largest, most emissive)
                        │
                        ▼
                   ◯ BEDROCK orb (icosahedron, faint pulse, accent green)
                                                          (background: dust motes + subtle volumetric fog)
```

- Slabs are flat planes with a custom shader that has:
  - Subtle Fresnel rim light in `--accent`
  - Internal grid pattern (1 px lines, like a printed circuit)
  - Pulse on activation (when the document particle passes through)
- The DOCUMENT particle is a small white-emissive box that travels along the path, **emitting trail particles** behind it.
- The Bedrock orb is a low-poly icosahedron with subtle bloom (no postprocessing pass — fake with sprite halo to save bundle).
- Background: ~400 dust particles, very small, drift slowly. NOT a starfield — too cliché.

### Scroll choreography (GSAP ScrollTrigger)
- **Hero (0–100 vh):** Camera orbits gently around the pipeline; cursor parallaxes ±3°.
- **Section 01 (Rules):** Camera pulls back and to the right. The L1 slab is foregrounded; L2/L3/L4 dim slightly. Caption: *"L1 — what passes the first filter."*
- **Section 02 (Signals):** Camera rises; we see the pipeline from above. L2 slab pulses.
- **Section 03 (Inference):** Camera dollies forward; L3 + L4 fill the frame; case studies render to the right of the canvas in the foreground.
- **Section 04 (Decision):** Camera frames the L4 slab head-on; a translucent "paper" geometry rises from L4 (the published research).
- **Section 05 (Output):** Camera pulls back; Bedrock orb glows brighter; the document particle has completed the pipeline.

### Performance gates
- Canvas runs at **fixed 60 fps target, fall back to 30 fps on mobile** via `setAnimationLoop` throttle.
- `dpr = Math.min(window.devicePixelRatio, 1.5)`.
- Pause the canvas when `document.hidden`.
- `prefers-reduced-motion`: replace the canvas with a single static SVG of the pipeline (provided as a fallback file).

---

## 5. Content (rewritten in Rojan's actual voice)

Voice rules:
- Direct, declarative sentences. No marketing.
- Specific numbers. No "passionate about."
- Subtle dry humor allowed (Linear changelog tone).
- Borrow specific phrasings from LinkedIn Summary verbatim.

### Hero (Section 00)
- **Status pill:** `● OPEN TO FULL-TIME · MID-2026 · F-1 OPT`
- **Name (display, massive):** `Rojan Dahal`
- **Thesis (display + italic on verbs):** *"I build the systems that gate, validate, and govern other AI systems."*
- **Subtitle (mono, dim):** `Data Science Intern @ TitanCloud. MS Data Science @ Gannon · GPA 4.0. 5+ years shipping AI in production.`
- **CTAs:** `[ Scroll the pipeline ↓ ]`  `[ Read resume.pdf ]`

### About (Section 01 — Rules)
Lift directly from LinkedIn Summary, lightly edited:

> Five years ago I was building fraud detection systems for banks in Nepal — signature verification, liveness detection, document classification. Systems where a wrong prediction has real consequences for real people. That wired something into how I approach ML: **reliability matters as much as accuracy.**
>
> Since then I've pushed in two directions. Deeper on research: a peer-reviewed paper on using CNNs to automate powder-bed leveling in metal 3D printing, presented at NAMRC 53 / MSEC 2025. Broader on engineering: a RAG chatbot on GCP Cloud Run with local LLMs, vector DB, Redis, FastAPI; a multi-tenant SaaS with conversational AI that cut support inquiries by 70%; the Gatekeeper at TitanCloud that gates a Bedrock VLM extraction agent.
>
> The through-line: **I care about what happens after the model is trained.** Deployment, latency, uptime, real usage. Anyone can run a notebook. I want the thing to actually work in production.

Below the prose: a `NOW / NEXT / OPEN` mono block:
- `NOW` — Data Science Intern at TitanCloud. Building production AI on AWS Bedrock + Step Functions.
- `NEXT` — Open to full-time ML Engineer / AI Engineer roles from mid-2026. US-based, remote-friendly.
- `OPEN` — Agentic systems, MCP, AI safety, MLOps, document AI, computer vision.

### Signals (Section 02)
Skill *inventory* (not weight bars — that was a previous-design relic). Five rows:

- **Agentic AI & LLMs** — Amazon Bedrock (Claude Sonnet 4 / Haiku 4.5), Claude API, MCP, LangChain, vLLM, RAG, Bedrock Guardrails, structured-JSON outputs, prompt engineering.
- **ML & Computer Vision** — PyTorch, TensorFlow, ONNX Runtime, Transformers, CNNs, EfficientNet, YOLOv5, OpenCV, DocAligner, CLAHE, OCR, fine-tuning.
- **Cloud & MLOps** — AWS (Lambda, Step Functions, SageMaker, S3, EventBridge, OpenSearch Serverless, RDS), GCP Cloud Run, Azure (IoT Hub, Cognitive Services, Functions), Docker, Kubernetes, GitHub Actions, Azure DevOps, DataDog, Cloudflare.
- **Languages & Data** — Python, TypeScript, Java, SQL/PostgreSQL, Redis, MongoDB.
- **Production engineering** — FastAPI, REST APIs, JWT/auth proxies, vector DBs, multi-tenant SaaS, CI/CD, canary deploys, sub-100 ms latency systems.

Render as compact mono chips grouped by row, with the row label in display italic on the left.

### Work (Section 03 — Inference)
Four case studies, in this order:

#### A. TitanCloud — Data Science Intern (March 2026 – present)
- **Headline:** *"The Gatekeeper — turning a flat LLM bill into a tiered pipeline."*
- **Stack chips:** Python · PyTorch · ONNX Runtime · AWS Lambda · Step Functions · Bedrock (Claude Sonnet 4 / Haiku 4.5) · MCP · OpenSearch Serverless · PostgreSQL · SageMaker · Azure DevOps · DataDog.
- **Scale chips:** Sub-250 ms inference · 4-layer hybrid classifier · EfficientNet-B0 (~20 MB) · serverless cold-start budget.
- **Three bullets** — pick from the brief earlier (Gatekeeper architecture / Step Functions IDP pipeline / MLOps story).
- **3D motif:** the full Gatekeeper pipeline (already the scene's primary geometry).

#### B. Gannon University — Graduate Assistant (Oct 2024 – Dec 2025)
- **Headline:** *"A RAG advising chatbot the campus actually uses."*
- **Stack chips:** vLLM · FastAPI · GCP Cloud Run · Redis · vector DB · Cloudflare Tunnels · JWT · LangChain.
- **Scale chips:** Sub-100 ms latency · 99.9% uptime · 80% GPU utilization.
- **Bullets:** RAG architecture · LangChain agent workflows for query routing · JWT proxy.
- **3D motif:** a faint floating "document → embedding → answer" loop, off to the right of the main pipeline.

#### C. Gannon University — Student Research Assistant (Jan 2024 – Oct 2024)
- **Headline:** *"CNNs in a metal 3D printer."*
- **Stack chips:** PyTorch · CNN · OpenCV · DMLS · additive manufacturing.
- **Scale chips:** peer-reviewed · NAMRC 53 / MSEC 2025 · poster @ University of Maryland.
- **Bullets:** the powder-bed-leveling research; one line on why CV in a manufacturing feedback loop is the same problem he optimizes at TitanCloud (latency, reliability, escalation).
- **3D motif:** a thin printer-bed plane with a sweep gradient, visible only when this case is in viewport.

#### D. BitsKraft (DigiConnect) — AI/ML Engineer (Nov 2020 – Nov 2023)
- **Headline:** *"Three production AI systems for a Nepali fintech, each one different enough I had to learn something new."*
- **Stack chips:** Python · PyTorch · YOLOv5 · OpenCV · Azure (IoT Hub, Cognitive Services, Functions) · REST APIs · Docker.
- **Scale chips:** 5,000 req/day · 99.9% uptime · 95% verification accuracy · 90% forgery detection · 40% fewer FPs · 30% payment-speed lift.
- **Bullets:** liveness + emotion analysis for video banking · YOLOv5 signature forgery for cheque verification · QR-based voice POS notifier on Azure IoT.
- **3D motif:** none. This case is older, leaner. Reads as a tidy text panel.

### Research (Section 04 — Decision)
Citation block, monospace:

```
[1]  Dahal, R., Zhou, L., & Ji, X. (2025).
     Automatic Powder Bed Leveling for Direct Metal Laser Sintering
     Based on Machine Learning.
     ASME MSEC 2025, Greenville, SC. Paper No. MSEC2025-152596.
     ↳ Presented at NAMRC 53 / MSEC 2025.
     ↳ Poster: SAMPE Baltimore-Washington 30th URS, University of Maryland.
```

Below the citation: one short paragraph linking the research to his production work.

**Certifications** (from LinkedIn) — render as a horizontal scrolling row of small mono chips, dim:
- Fundamentals of AI Agents Using RAG and LangChain
- IBM AI Engineering with Python, PyTorch & TensorFlow
- Deep Learning with PyTorch
- Generative AI Language Modeling with Transformers
- Introduction to Deep Learning & Neural Networks with Keras

### Contact (Section 05 — Output)
- **Anchor line:** *"Need someone who builds AI systems that behave under pressure?"*
- **Giant mailto:** `rojandahal1026@gmail.com` in display italic, the largest text on the page below the hero name.
- **Mono link row:** `LinkedIn ↗ · GitHub ↗ · Resume.pdf · +1 (220) 238-XX-XX`
- **Footer:** `Built 2026 · Erie, PA · This page just passed its own Gatekeeper.`

---

## 6. Anti-patterns (kill on sight)

- ❌ "Hi 👋 I'm Rojan" / waving-emoji hero.
- ❌ Gradient text on the headline.
- ❌ Three-column emoji-icon "what I do" grid.
- ❌ Animated typewriter on the hero subtitle.
- ❌ Spline 3D blob in the corner.
- ❌ Glassmorphism on foreground cards.
- ❌ Auto-playing testimonial carousel (no testimonials at all).
- ❌ A "Download My Resume" button as the largest element.
- ❌ The word "passionate" anywhere in the codebase.
- ❌ Mock-up `{{X%}}` placeholders shipped to production.
- ❌ Visible full phone number (mask to `+1 (220) 238-XX-XX`).

---

## 7. Tech & implementation

- **Stack**: Astro 5 + React 19 islands + TypeScript strict + Tailwind v4 + Motion + GSAP/ScrollTrigger + Lenis + Three.js + React Three Fiber + drei.
- **Layout**: single page, semantic `<section>` per stage, View Transitions optional (defer).
- **Performance budgets**:
  - First paint (HTML + critical CSS): ≤ 25 KB gz.
  - Initial JS (page + Astro runtime): ≤ 30 KB gz.
  - 3D bundle (lazy, loaded after first scroll): ≤ 260 KB gz.
  - LCP target: ≤ 1.8 s on Fast 4G. The hero text renders before the canvas hydrates.
- **Accessibility**:
  - WCAG 2.2 AA contrast in dark mode.
  - `prefers-reduced-motion`: 3D scene → static SVG; staggers off; smooth scroll → native.
  - Full keyboard navigation. The Gatekeeper command palette (kept from previous build) reopens via `/`.
- **SEO**: JSON-LD Person schema, OG card (SVG → png-converted via inline `<canvas>`-to-PNG at build later if needed), sitemap.

---

## 8. Deliverables / definition of done

The site is done when:

- A staff ML engineer can answer, within 30 s of landing: *what does Rojan build, and is he hireable?* — without scrolling past the hero.
- The pipeline 3D scene renders at 60 fps on a 2020 MacBook Air baseline, gracefully drops to 30 fps on mobile, and is fully replaced by a static SVG with `prefers-reduced-motion`.
- Lighthouse mobile scores ≥ 90 / ≥ 95 / ≥ 95 / ≥ 95 (perf / a11y / best / SEO).
- Cloudflare Pages builds the project cleanly from a `main` push.
- Nothing on the page would feel out of place on Anthropic, Vercel, or Linear's marketing surface.

---

## 9. Out of scope for v1

- Light mode.
- A blog or `/writing` route.
- View Transitions between case-study sub-pages (cases render inline).
- An OG PNG (SVG version ships first; PNG can come later with `@vercel/og`).
- A custom-cursor effect.
