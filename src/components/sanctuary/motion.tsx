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

/** Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function useSmoothScroll() {
  useEffect(() => {
    ensureGsap();
    if (prefersReduced()) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    window.scrollTo(0, 0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}

/** GSAP reveal for every [data-gsap] element inside the page (ReactBits "AnimatedContent" style). */
export function useGsapReveals() {
  useEffect(() => {
    ensureGsap();
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-gsap]").forEach((el) => {
        const kind = el.dataset["gsap"];
        const from: gsap.TweenVars =
          kind === "left"
            ? { x: -80, opacity: 0, rotate: -2 }
            : kind === "right"
              ? { x: 80, opacity: 0, rotate: 2 }
              : kind === "zoom"
                ? { scale: 0.85, opacity: 0, filter: "blur(12px)" }
                : { y: 70, opacity: 0, filter: "blur(8px)" };
        gsap.from(el, {
          ...from,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
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
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(refresh);
      ctx.revert();
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
    if (!el || prefersReduced()) return;
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

/** Pinned horizontal scroll section: children slide sideways while the section is pinned. */
export function useHorizontalPin(section: React.RefObject<HTMLElement | null>, track: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    ensureGsap();
    const s = section.current;
    const t = track.current;
    if (!s || !t || prefersReduced() || window.innerWidth < 760) return;

    let ctx: gsap.Context | null = null;

    const init = () => {
      if (ctx) ctx.revert();
      ctx = gsap.context(() => {
        gsap.to(t, {
          x: () => -(t.scrollWidth - window.innerWidth + 48),
          ease: "none",
          scrollTrigger: {
            trigger: s,
            start: "top top",
            end: () => "+=" + (t.scrollWidth - window.innerWidth),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }, s);
      ScrollTrigger.refresh();
    };

    // Wait until images have actually loaded so scrollWidth is correct
    const imgs = Array.from(t.querySelectorAll<HTMLImageElement>("img"));
    const loaded = imgs.filter((img) => img.complete);
    if (loaded.length === imgs.length) {
      init();
    } else {
      let count = 0;
      const onLoad = () => { count++; if (count >= imgs.length) init(); };
      imgs.forEach((img) => { if (!img.complete) img.addEventListener("load", onLoad, { once: true }); });
      // Also fire after 800 ms as a safety net in case some images fail
      const fallback = window.setTimeout(init, 800);
      return () => {
        window.clearTimeout(fallback);
        ctx?.revert();
      };
    }

    return () => ctx?.revert();
  }, [section, track]);
}
