import { useEffect, useRef, useState } from "react";

/**
 * Live "inference log" — a small fixed widget bottom-right that streams
 * fake Gatekeeper decisions as the visitor scrolls. Each section that comes
 * into view emits an entry shaped like a real classifier decision.
 *
 * This is the page's signature AI-engineer detail. Nothing here calls an LLM;
 * the entries are deterministic, scroll-position-driven. The log is also
 * collapsible and disabled under prefers-reduced-motion.
 */

type Entry = {
  ts: string;
  scroll: number;
  intent: string;
  decision: "ACCEPTED" | "REVIEW" | "OUT-OF-SCOPE";
  confidence: number;
  detail?: string;
};

type Stage = {
  id: string;
  intent: string;
  decision: Entry["decision"];
  confidence: number;
  detail?: string;
};

const STAGES: Stage[] = [
  { id: "intake",    intent: "hero.identity",     decision: "ACCEPTED", confidence: 0.94, detail: "doc_type=PORTFOLIO" },
  { id: "rules",     intent: "about.thesis",      decision: "ACCEPTED", confidence: 0.91, detail: "verified=true" },
  { id: "signals",   intent: "skills.inventory",  decision: "ACCEPTED", confidence: 0.89, detail: "rows=5" },
  { id: "inference", intent: "work.cases",        decision: "ACCEPTED", confidence: 0.96, detail: "n_roles=4" },
  { id: "decision",  intent: "research.citation", decision: "ACCEPTED", confidence: 0.93, detail: "venue=NAMRC/MSEC_2025" },
  { id: "output",    intent: "contact.handoff",   decision: "ACCEPTED", confidence: 0.97, detail: "channel=email" },
];

function timeNow(): string {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
}

export default function InferenceLog() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [open, setOpen] = useState(true);
  const [scrollPct, setScrollPct] = useState(0);
  const firedRef = useRef<Set<string>>(new Set());
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current) return;

    // Boot entry
    const boot: Entry = {
      ts: timeNow(),
      scroll: 0,
      intent: "session.init",
      decision: "ACCEPTED",
      confidence: 1.0,
      detail: "gatekeeper_v=1",
    };
    setEntries([boot]);

    // Observe each section
    const observers: IntersectionObserver[] = [];
    for (const stage of STAGES) {
      const el = document.getElementById(stage.id);
      if (!el) continue;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !firedRef.current.has(stage.id)) {
            firedRef.current.add(stage.id);
            const sp = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
            const newEntry: Entry = {
              ts: timeNow(),
              scroll: Math.round(sp * 100) / 100,
              intent: stage.intent,
              decision: stage.decision,
              confidence: stage.confidence,
              detail: stage.detail,
            };
            setEntries((prev) => [...prev.slice(-8), newEntry]);
          }
        },
        { threshold: 0.3 },
      );
      io.observe(el);
      observers.push(io);
    }

    const onScroll = () => {
      const sp = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      setScrollPct(Math.round(sp * 100) / 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Skip render under reduced motion
  if (reducedRef.current) return null;

  return (
    <aside className="il-root" aria-live="polite" aria-label="Live inference log">
      <button
        className="il-head"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="il-dot" aria-hidden="true" />
        <span className="il-title">live_inference.log</span>
        <span className="il-scroll mono">[scroll {scrollPct.toFixed(2)}]</span>
        <span className="il-chev" aria-hidden="true">{open ? "▾" : "▴"}</span>
      </button>

      {open && (
        <ol className="il-body">
          {entries.slice(-8).map((e, i) => (
            <li className="il-row" key={`${e.ts}-${i}`}>
              <span className="il-ts mono">{e.ts}</span>
              <span className={`il-decision il-${e.decision.toLowerCase().replace("-", "_")} mono`}>
                {e.decision}
              </span>
              <span className="il-intent mono">{e.intent}</span>
              <span className="il-conf mono">
                ↳ <span className="il-conf-val">{e.confidence.toFixed(2)}</span>
                {e.detail && <span className="il-detail"> · {e.detail}</span>}
              </span>
            </li>
          ))}
          <li className="il-cursor mono" aria-hidden="true">▌</li>
        </ol>
      )}

      <style>{`
        .il-root {
          position: fixed;
          right: 16px;
          bottom: 16px;
          z-index: 50;
          width: min(420px, calc(100vw - 32px));
          background: color-mix(in srgb, var(--color-bg-elev) 92%, transparent);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          box-shadow: 0 18px 40px -16px rgba(0,0,0,0.6);
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink);
          overflow: hidden;
        }
        @media (max-width: 640px) { .il-root { display: none; } }

        .il-head {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 12px;
          background: transparent;
          border: 0;
          border-bottom: 1px solid var(--color-border);
          color: var(--color-ink-dim);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
        }
        .il-dot {
          width: 7px; height: 7px;
          border-radius: 999px;
          background: var(--color-accent);
          box-shadow: 0 0 8px var(--color-accent);
          animation: il-pulse 1.6s ease-in-out infinite;
        }
        .il-title { color: var(--color-ink); }
        .il-scroll { margin-left: auto; color: var(--color-accent-cool); }
        .il-chev { color: var(--color-ink-mute); margin-left: 4px; }

        .il-body {
          list-style: none;
          margin: 0;
          padding: 10px 12px 12px;
          max-height: 220px;
          overflow-y: auto;
          display: grid;
          gap: 5px;
        }
        .il-body::-webkit-scrollbar { width: 0; }

        .il-row {
          display: grid;
          grid-template-columns: 56px auto 1fr;
          gap: 8px;
          align-items: baseline;
          font-size: 11px;
          line-height: 1.4;
        }

        .il-ts { color: var(--color-ink-mute); }

        .il-decision {
          font-weight: 500;
          padding: 1px 5px;
          border-radius: 3px;
          font-size: 10px;
          letter-spacing: 0.04em;
        }
        .il-accepted {
          color: var(--color-accent);
          background: rgba(255,181,71,0.10);
          border: 1px solid rgba(255,181,71,0.30);
        }
        .il-review {
          color: #f5c46c;
          background: rgba(245,196,108,0.10);
          border: 1px solid rgba(245,196,108,0.30);
        }
        .il-out_of_scope {
          color: var(--color-accent-coral);
          background: rgba(255,107,122,0.10);
          border: 1px solid rgba(255,107,122,0.30);
        }

        .il-intent { color: var(--color-ink); }

        .il-conf {
          grid-column: 3;
          color: var(--color-ink-dim);
          font-size: 10.5px;
          line-height: 1.3;
        }
        .il-conf-val { color: var(--color-accent-cool); }
        .il-detail { color: var(--color-ink-mute); }

        .il-cursor {
          color: var(--color-accent);
          font-size: 12px;
          line-height: 1;
          animation: il-blink 1s steps(2) infinite;
        }

        @keyframes il-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.8); }
        }
        @keyframes il-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </aside>
  );
}
