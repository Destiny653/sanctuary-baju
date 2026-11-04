import { useEffect } from "react";

/**
 * Page-wide scroll effects.
 * - [data-reveal] elements fade up out of a blur the first time they enter the view.
 * - [data-scroll] elements receive a --p custom property (0 → 1) for scroll-linked motion.
 *   data-scroll="sticky" measures progress across a tall section with a sticky inner stage.
 * Reduced-motion visitors get everything revealed and no scroll-linked motion.
 */
export function useScrollFx() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observed = new WeakSet<Element>();
    let tracked: HTMLElement[] = [];
    let frame = 0;
    let io: IntersectionObserver | undefined;

    const collect = () => {
      const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
      tracked = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll]"));
      if (reduce) {
        reveals.forEach((el) => el.classList.add("is-in"));
        tracked.forEach((el) => el.style.setProperty("--p", "0.5"));
        return;
      }
      root.classList.add("fx");
      if (!io) {
        io = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-in");
                io?.unobserve(entry.target);
              }
            }
          },
          { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
        );
      }
      reveals.forEach((el) => {
        if (observed.has(el)) return;
        observed.add(el);
        io?.observe(el);
      });
    };

    if (reduce) {
      collect();
      return;
    }

    collect();
    // Re-scan after hydration / late sections mount (film, passion).
    const retry = window.setTimeout(collect, 600);
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of tracked) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -vh || rect.top > vh * 2) continue;
        let p: number;
        if (el.dataset["scroll"] === "sticky") {
          const span = rect.height - vh;
          p = span > 0 ? -rect.top / span : 0;
        } else {
          p = (vh - rect.top) / (vh + rect.height);
        }
        p = Math.min(1, Math.max(0, p));
        el.style.setProperty("--p", p.toFixed(4));
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.clearTimeout(retry);
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove("fx");
    };
  }, []);
}
