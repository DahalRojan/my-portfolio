/**
 * Tiny stagger + counter helpers — run once on page load.
 *
 * No external animation lib needed for these — `prefers-reduced-motion`
 * disables them via the global CSS rule.
 */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Reveal `.js-stagger > *` when the parent enters the viewport. */
function wireStaggers(): void {
  const targets = document.querySelectorAll<HTMLElement>(".js-stagger");
  if (!targets.length) return;

  if (REDUCED) {
    targets.forEach((t) => t.classList.add("js-stagger-on"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add("js-stagger-on");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );

  targets.forEach((t) => io.observe(t));
}

/** Count numbers up once. Use `<span data-count="250" data-suffix=" ms">0</span>`. */
function wireCounters(): void {
  const targets = document.querySelectorAll<HTMLElement>("[data-count]");
  if (!targets.length) return;

  if (REDUCED) {
    targets.forEach((el) => {
      const end = Number(el.dataset.count);
      el.textContent = formatNumber(end) + (el.dataset.suffix ?? "");
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          tick(el);
        }
      }
    },
    { threshold: 0.5 }
  );

  targets.forEach((t) => io.observe(t));
}

function formatNumber(n: number): string {
  return n >= 1000 ? n.toLocaleString("en-US") : n.toString();
}

function tick(el: HTMLElement): void {
  const end = Number(el.dataset.count);
  const suffix = el.dataset.suffix ?? "";
  const duration = 900;
  const start = performance.now();

  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    const v = Math.round(end * eased);
    el.textContent = formatNumber(v) + suffix;
    if (t < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      wireStaggers();
      wireCounters();
    });
  } else {
    wireStaggers();
    wireCounters();
  }
}
