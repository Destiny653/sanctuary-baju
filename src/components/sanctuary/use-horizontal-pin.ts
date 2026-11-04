import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function ensureGsap() {
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
}

function prefersReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isTouchLayout() {
  return (
    window.matchMedia("(hover: none), (pointer: coarse)").matches ||
    window.matchMedia("(max-width: 760px)").matches
  );
}

/**
 * Pinned horizontal scrub on all viewports.
 * Mobile uses a near-1:1 scrub + fixed pin (no Lenis) to avoid vibration.
 */
export function useHorizontalPin(
  section: RefObject<HTMLElement | null>,
  track: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    ensureGsap();
    const s = section.current;
    const t = track.current;
    if (!s || !t || prefersReduced()) return;

    let ctx: gsap.Context | null = null;
    let softRefresh: number | undefined;
    let resizeTimer: number | undefined;
    let paintedSpacer: HTMLElement | null = null;

    const paintSpacer = (trigger?: ScrollTrigger) => {
      const fromTrigger = trigger
        ? ((trigger as ScrollTrigger & { spacer?: HTMLElement }).spacer ?? null)
        : null;
      const spacer =
        fromTrigger ||
        (s.parentElement?.classList.contains("pin-spacer") ? s.parentElement : null) ||
        [...document.querySelectorAll<HTMLElement>(".pin-spacer")].find((el) => el.contains(s)) ||
        null;
      if (!spacer) return;
      paintedSpacer = spacer;
      spacer.classList.add("passion-pin-spacer");
      spacer.style.setProperty("background", "var(--snow)", "important");
      spacer.style.setProperty("background-color", "var(--snow)", "important");
    };

    const clearSpacer = () => {
      if (!paintedSpacer) return;
      paintedSpacer.classList.remove("passion-pin-spacer");
      paintedSpacer.style.removeProperty("background");
      paintedSpacer.style.removeProperty("background-color");
      paintedSpacer = null;
    };

    const kill = () => {
      clearSpacer();
      s.classList.remove("passion-pin--native");
      ctx?.revert();
      ctx = null;
      gsap.set(t, { clearProps: "transform,x" });
    };

    const distance = () => {
      const trackWidth = Math.max(t.scrollWidth, t.getBoundingClientRect().width);
      return Math.max(Math.ceil(trackWidth - window.innerWidth), 0);
    };

    const init = () => {
      kill();
      if (distance() < 24) return;

      const touch = isTouchLayout();

      ctx = gsap.context(() => {
        gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: s,
            start: "top top",
            end: () => `+=${Math.max(distance(), window.innerHeight)}`,
            pin: true,
            // Near-zero scrub on touch = 1:1 with finger (laggy scrub vibrates).
            scrub: touch ? 0.05 : true,
            anticipatePin: touch ? 0 : 1,
            invalidateOnRefresh: true,
            pinSpacing: true,
            // fixed pin + native/normalized scroll is stable on iOS; transform for Lenis desktop.
            pinType: touch ? "fixed" : "transform",
            fastScrollEnd: true,
            preventOverlaps: true,
            onRefresh: (self) => paintSpacer(self),
            onToggle: (self) => paintSpacer(self),
          },
        });
      }, s);
      ScrollTrigger.refresh();
      paintSpacer();
    };

    const imgs = Array.from(t.querySelectorAll<HTMLImageElement>("img"));
    let pending = imgs.filter((img) => !img.complete).length;
    const onReady = () => {
      init();
      softRefresh = window.setTimeout(() => {
        ScrollTrigger.refresh();
        paintSpacer();
      }, 400);
    };

    if (pending === 0) {
      onReady();
    } else {
      const onLoad = () => {
        pending -= 1;
        if (pending <= 0) onReady();
      };
      imgs.forEach((img) => {
        if (!img.complete) img.addEventListener("load", onLoad, { once: true });
      });
      softRefresh = window.setTimeout(onReady, 900);
    }

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => init(), 160);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (softRefresh) window.clearTimeout(softRefresh);
      if (resizeTimer) window.clearTimeout(resizeTimer);
      kill();
    };
  }, [section, track]);
}
