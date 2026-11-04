import { ScrollTrigger } from "gsap/ScrollTrigger";

let configured = false;

/** Stop ScrollTrigger from refreshing on mobile URL-bar resize (that jumps scroll to top). */
export function configureScrollTriggerMobile() {
  if (configured || typeof window === "undefined") return;
  configured = true;
  ScrollTrigger.config({
    // Default includes "resize", which fires when the mobile browser chrome shows/hides.
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });
}

/** Run a layout pass without letting the page jump back to y=0. */
export function preserveScroll(run: () => void) {
  const x = window.scrollX;
  const y = window.scrollY;
  run();
  if (Math.abs(window.scrollX - x) > 1 || Math.abs(window.scrollY - y) > 1) {
    window.scrollTo(x, y);
  }
}

export function softRefresh() {
  preserveScroll(() => ScrollTrigger.refresh());
}

/** True when only the viewport height changed (mobile toolbar), not the width. */
export function isWidthResize(prevWidth: number) {
  return window.innerWidth !== prevWidth;
}
