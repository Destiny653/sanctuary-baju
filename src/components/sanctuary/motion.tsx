import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { narrationChapter } from "./film-narration";

let registered = false;
/** ReactBits-style BlurText, scrubbed from actual video time instead of a one-off reveal. */
export function FilmNarration({ videoRef, passages, title, reference, reduced }: {
  videoRef: RefObject<HTMLVideoElement | null>;
  passages: string[];
  title: string;
  reference: string;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    const video = videoRef.current;
    if (!container || !video) return;
    const chapters = Array.from(container.querySelectorAll<HTMLElement>(".film-chapter"));
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ paused: true });
      timeline.to({}, { duration: passages.length }, 0);
      chapters.forEach((chapter, i) => {
        const words = chapter.querySelectorAll(".film-word");
        gsap.set(chapter, { autoAlpha: 0 });
        if (!reduced) {
          timeline.fromTo(chapter, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, i);
          timeline.fromTo(words, { opacity: 0, y: 14, filter: "blur(8px)" }, {
            opacity: 1, y: 0, filter: "blur(0px)", duration: 0.18,
            stagger: { amount: 0.18 }, ease: "power2.out", immediateRender: false,
          }, i);
          if (i < chapters.length - 1) timeline.to(chapter, { autoAlpha: 0, duration: 0.12 }, i + 0.86);
        }
      });
      let previous = -1;
      const sync = () => {
        const progress = Number.isFinite(video.duration) && video.duration > 0 ? video.currentTime / video.duration : 0;
        const current = narrationChapter(progress, chapters.length);
        if (!reduced) timeline.progress(Math.max(0.025, Math.min(1, progress)));
        if (current !== previous) {
          chapters.forEach((chapter, i) => {
            chapter.setAttribute("aria-hidden", String(i !== current));
            if (reduced) gsap.set(chapter, { autoAlpha: i === current ? 1 : 0 });
          });
          container.dataset["chapter"] = String(current + 1);
          previous = current;
        }
      };
      gsap.ticker.add(sync);
      sync();
      return () => gsap.ticker.remove(sync);
    }, container);
    return () => ctx.revert();
  }, [videoRef, passages, reduced]);
  return (
    <div className="film-narration" ref={ref} role="group" aria-label={title}>
      <p className="film-narration-title">{title}</p>
      <div className="film-chapters">
        {passages.map((passage, i) => (
          <p className="film-chapter" key={passage} aria-label={passage} aria-hidden={i !== 0}>
            {passage.split(" ").map((word, j) => <span className="film-word" aria-hidden="true" key={j}>{word}{" "}</span>)}
          </p>
        ))}
      </div>
      <p className="film-narration-reference">{reference}</p>
    </div>
  );
}

function ensureGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

function prefersReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Lenis on desktop only — on touch it fights GSAP pins and makes horizontal scrub vibrate. */
export function useSmoothScroll() {
  useEffect(() => {
    ensureGsap();
    if (prefersReduced()) return;

    const coarse = window.matchMedia("(hover: none), (pointer: coarse)");
    const narrow = window.matchMedia("(max-width: 760px)");
    const isTouchLayout = () => coarse.matches || narrow.matches;

    let cancelled = false;
    let lenis: Lenis | undefined;
    let tick: ((time: number) => void) | undefined;
    let refreshTimer = 0;
    let normalizeOn = false;

    const stopLenis = () => {
      if (tick) gsap.ticker.remove(tick);
      tick = undefined;
      if (lenis && (window as Window & { __lenis?: Lenis }).__lenis === lenis) {
        delete (window as Window & { __lenis?: Lenis }).__lenis;
      }
      lenis?.destroy();
      lenis = undefined;
    };

    const startLenis = () => {
      stopLenis();
      if (cancelled || isTouchLayout()) return;
      lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      (window as Window & { __lenis?: Lenis }).__lenis = lenis;
    };

    const syncMobileScroll = () => {
      // Align touch scrolling with the GSAP thread so pinned sections don't jitter.
      if (isTouchLayout()) {
        if (!normalizeOn) {
          ScrollTrigger.normalizeScroll(true);
          normalizeOn = true;
        }
        stopLenis();
      } else {
        if (normalizeOn) {
          ScrollTrigger.normalizeScroll(false);
          normalizeOn = false;
        }
        if (!lenis) startLenis();
      }
      ScrollTrigger.refresh();
    };

    const id = window.requestAnimationFrame(() => {
      if (cancelled) return;
      window.scrollTo(0, 0);
      if (isTouchLayout()) {
        ScrollTrigger.normalizeScroll(true);
        normalizeOn = true;
      } else {
        startLenis();
      }
      ScrollTrigger.refresh();
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 500);
    });

    coarse.addEventListener("change", syncMobileScroll);
    narrow.addEventListener("change", syncMobileScroll);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(id);
      window.clearTimeout(refreshTimer);
      coarse.removeEventListener("change", syncMobileScroll);
      narrow.removeEventListener("change", syncMobileScroll);
      if (normalizeOn) ScrollTrigger.normalizeScroll(false);
      stopLenis();
    };
  }, []);
}

/** GSAP reveal for every [data-gsap] element inside the page (ReactBits "AnimatedContent" style). */
export function useGsapReveals() {
  useEffect(() => {
    ensureGsap();
    if (prefersReduced()) return;
    let ctx: gsap.Context | undefined;
    let refresh = 0;
    let refresh2 = 0;
    const build = () => {
      ctx?.revert();
      ctx = gsap.context(() => {
        const narrow = window.matchMedia("(max-width: 760px)").matches;
        const slide = narrow ? 24 : 80;
        const lift = narrow ? 36 : 70;
        gsap.utils.toArray<HTMLElement>("[data-gsap]").forEach((el) => {
          const kind = el.dataset["gsap"];
          const from: gsap.TweenVars =
            kind === "left"
              ? { x: -slide, opacity: 0, rotate: narrow ? 0 : -2 }
              : kind === "right"
                ? { x: slide, opacity: 0, rotate: narrow ? 0 : 2 }
                : kind === "zoom"
                  ? { scale: narrow ? 0.92 : 0.85, opacity: 0, filter: narrow ? "none" : "blur(12px)" }
                  : { y: lift, opacity: 0, filter: narrow ? "none" : "blur(8px)" };
          gsap.from(el, {
            ...from,
            duration: narrow ? 0.85 : 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const speed = Number(el.dataset["parallax"] || 0.2);
          gsap.to(el, {
            yPercent: -100 * speed,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      });
      ScrollTrigger.refresh();
    };
    // Wait a frame so late client sections (film, passion) are in the DOM.
    const frame = window.requestAnimationFrame(build);
    refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    refresh2 = window.setTimeout(build, 900);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(refresh);
      window.clearTimeout(refresh2);
      ctx?.revert();
    };
  }, []);
}

/** ReactBits-style SplitText: letters rise one after another when scrolled into view. */
export function SplitText({
  text,
  as: Tag = "h2",
  className,
  delay = 0.035,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    ensureGsap();
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const chars = el.querySelectorAll(".split-char");
    const tween = gsap.from(chars, {
      yPercent: 120,
      opacity: 0,
      rotate: 8,
      duration: 0.9,
      ease: "back.out(1.6)",
      stagger: delay,
      scrollTrigger: { trigger: el, start: "top 90%" },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, text]);
  const words = text.split(" ");
  return (
    <Tag ref={ref as never} className={"split " + (className ?? "")} aria-label={text}>
      {words.map((word, wi) => (
        <span className="split-word" key={wi} aria-hidden="true">
          {Array.from(word).map((ch, ci) => (
            <span className="split-char" key={ci}>
              {ch}
            </span>
          ))}
          {wi < words.length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </Tag>
  );
}

/** ReactBits-style ScrollVelocity marquee: drifts constantly and speeds up with scroll. */
export function VelocityMarquee({ items, reverse = false }: { items: ReactNode[]; reverse?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ensureGsap();
    const el = track.current;
    if (!el || prefersReduced()) return;
    const dir = reverse ? 1 : -1;
    let x = 0;
    let boost = 0;
    let last = window.scrollY;
    const tick = () => {
      const y = window.scrollY;
      boost = boost * 0.9 + Math.abs(y - last) * 0.08;
      last = y;
      const half = el.scrollWidth / 2;
      x += dir * (0.6 + boost);
      if (x <= -half) x += half;
      if (x >= 0 && dir > 0) x -= half;
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [reverse]);
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track" ref={track}>
        {[...items, ...items].map((item, i) => (
          <span className="marquee-item" key={i}>
            {item}
            <i className="marquee-star">✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}

/** ReactBits-style TiltedCard: follows the pointer in 3D. */
export function Tilt({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    // Skip tilt on touch — pointermove during scroll fights the horizontal pin and vibrates cards.
    if (!el || prefersReduced() || window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, { rotateY: px * 14, rotateX: -py * 14, duration: 0.5, ease: "power2.out" });
    };
    const leave = () => gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "elastic.out(1,0.5)" });
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <div ref={ref} className={"tilt " + (className ?? "")} style={style}>
      {children}
    </div>
  );
}

export { useHorizontalPin } from "./use-horizontal-pin";
