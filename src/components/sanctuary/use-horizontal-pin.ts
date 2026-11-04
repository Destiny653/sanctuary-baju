import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { configureScrollTriggerMobile, softRefresh } from "./scroll-safe";

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
 * Mobile: near-1:1 scrub + fixed pin; never rebuild on URL-bar height resize.
 */
export function useHorizontalPin(
  section: RefObject<HTMLElement | null>,
  track: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    ensureGsap();
    configureScrollTriggerMobile();
    const s = section.current;
    const t = track.current;
    if (!s || !t || prefersReduced()) return;

    let ctx: gsap.Context | null = null;
    let softRefreshTimer: number | undefined;
    let resizeTimer: number | undefined;
    let paintedSpacer: HTMLElement | null = null;
    let lastWidth = window.innerWidth;

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
            scrub: touch ? 0.05 : true,
            anticipatePin: touch ? 0 : 1,
            invalidateOnRefresh: true,
            pinSpacing: true,
            pinType: touch ? "fixed" : "transform",
            fastScrollEnd: true,
            preventOverlaps: true,
            onRefresh: (self) => paintSpacer(self),
            onToggle: (self) => paintSpacer(self),
          },
        });
      }, s);
      softRefresh();
      paintSpacer();
    };

    const imgs = Array.from(t.querySelectorAll<HTMLImageElement>("img"));
    let pending = imgs.filter((img) => !img.complete).length;
    const onReady = () => {
      init();
      // Soft sync after images settle — never if the user is mid-scroll on the upper page.
      softRefreshTimer = window.setTimeout(() => {
        softRefresh();
        paintSpacer();
      }, 500);
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
      softRefreshTimer = window.setTimeout(onReady, 900);
    }

    const onResize = () => {
      // Ignore mobile browser chrome show/hide (height-only).
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => init(), 200);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (softRefreshTimer) window.clearTimeout(softRefreshTimer);
      if (resizeTimer) window.clearTimeout(resizeTimer);
      kill();
    };
  }, [section, track]);
}
