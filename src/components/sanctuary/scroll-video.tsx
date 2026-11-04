"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { videoTimeForProgress } from "./video-progress";
import { FilmNarration } from "./motion";
import { annunciationNarration } from "./film-narration";
import { useI18n } from "@/i18n";

/** Local public URLs — Lovable `__l5e` asset.json paths do not resolve on Next/Vercel. */
const SCROLL_MP4 = "/assets/vids/static-scroll.mp4";
const SCROLL_WEBM = "/assets/vids/static-scroll.webm";
const SCROLL_POSTER = "/assets/vids/static-scroll-poster.jpg";

/**
 * Silent film whose timeline follows Lenis/ScrollTrigger scroll.
 * WebM first (Chromium), then MP4 (Safari). Pin + scrub — not autoplay.
 */
export function ScrollVideo() {
  const { lang } = useI18n();
  const narration = annunciationNarration[lang];
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      setReduced(false);
      const playhead = { progress: 0 };
      let tween: gsap.core.Tween | undefined;
      let disposed = false;
      let desiredTime = 0;
      let unlocked = false;

      const seek = () => {
        if (disposed || video.seeking || video.readyState < 1) return;
        if (Math.abs(video.currentTime - desiredTime) <= 0.015) return;
        try {
          video.currentTime = desiredTime;
        } catch {
          /* ignore */
        }
      };

      /** Safari often won't paint seeks until play() has run once. */
      const unlock = async () => {
        if (unlocked || disposed) return;
        video.muted = true;
        try {
          const attempt = video.play();
          await Promise.race([
            attempt.catch(() => undefined),
            new Promise<void>((r) => window.setTimeout(r, 600)),
          ]);
        } catch {
          /* ignore */
        }
        video.pause();
        unlocked = true;
      };

      const setup = () => {
        if (disposed || tween || !Number.isFinite(video.duration) || video.duration <= 0) return;
        video.pause();
        void unlock();

        tween = gsap.to(playhead, {
          progress: 1,
          ease: "none",
          onUpdate: () => {
            desiredTime = videoTimeForProgress(playhead.progress, video.duration);
            seek();
            if (progressRef.current) gsap.set(progressRef.current, { scaleX: playhead.progress });
          },
          scrollTrigger: {
            id: "homepage-scroll-video",
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(2400, window.innerHeight * 4)}`,
            pin: true,
            scrub: 0.35,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: () => {
              // Keep pin-spacer snow (avoids sky flash through hollow spacer).
              const st = ScrollTrigger.getById("homepage-scroll-video");
              const spacer = (st as ScrollTrigger & { spacer?: HTMLElement } | undefined)?.spacer;
              spacer?.classList.add("passion-pin-spacer");
            },
          },
        });
        ScrollTrigger.refresh();
      };

      video.addEventListener("loadedmetadata", setup);
      video.addEventListener("durationchange", setup);
      video.addEventListener("seeked", seek);
      if (video.readyState >= 1) setup();
      else video.load();

      // Lenis mounts one frame later — refresh once pin exists.
      const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 500);

      return () => {
        disposed = true;
        window.clearTimeout(refreshTimer);
        video.removeEventListener("loadedmetadata", setup);
        video.removeEventListener("durationchange", setup);
        video.removeEventListener("seeked", seek);
        tween?.scrollTrigger?.kill();
        tween?.kill();
        tween = undefined;
      };
    });

    media.add("(prefers-reduced-motion: reduce)", () => {
      setReduced(true);
      video.pause();
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`scroll-film${reduced ? " is-reduced" : ""}`}
      aria-label="Our Lady of Mercy film"
    >
      {failed ? (
        <img
          className="scroll-film-media is-visible"
          src={SCROLL_POSTER}
          alt="Mary praying in a sunlit stone courtyard"
        />
      ) : (
        <video
          ref={videoRef}
          className="scroll-film-media is-visible"
          poster={SCROLL_POSTER}
          preload="auto"
          muted
          playsInline
          controls={reduced}
          onError={() => setFailed(true)}
          aria-label="Mary praying in a sunlit courtyard"
        >
          <source src={SCROLL_WEBM} type="video/webm" />
          <source src={SCROLL_MP4} type="video/mp4" />
        </video>
      )}
      {!failed && <FilmNarration videoRef={videoRef} {...narration} reduced={reduced} />}
      <div className="scroll-film-progress" aria-hidden="true">
        <div ref={progressRef} />
      </div>
    </section>
  );
}
