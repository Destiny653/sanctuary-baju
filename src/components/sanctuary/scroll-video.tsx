"use client";

import "./scroll-video.css";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { videoTimeForProgress } from "./video-progress";
import { FilmNarration } from "./motion";
import { annunciationNarration } from "./film-narration";
import { useI18n } from "@/i18n";

const SCROLL_MP4 = "/assets/vids/static-scroll.mp4";
const SCROLL_WEBM = "/assets/vids/static-scroll.webm";
const SCROLL_POSTER = "/assets/vids/static-scroll-poster.jpg";

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

      video.defaultMuted = true;
      video.muted = true;

      const clampTime = (t: number) =>
        Math.min(Math.max(t, 0), Math.max(video.duration - 0.05, 0));

      const seek = () => {
        if (disposed || video.seeking || video.readyState < 1) return;
        if (Math.abs(video.currentTime - desiredTime) <= 0.015) return;
        try {
          video.currentTime = desiredTime;
        } catch {
          /* ignore */
        }
      };

      // Safari won't paint seeks until play() has run once.
      const unlock = async () => {
        if (unlocked || disposed) return;
        try {
          await Promise.race([
            video.play().catch(() => undefined),
            new Promise<void>((r) => window.setTimeout(r, 600)),
          ]);
        } catch {
          /* ignore */
        }
        video.pause();
        unlocked = true;
        seek();
      };

      const setup = () => {
        if (disposed || tween) return;
        if (!Number.isFinite(video.duration) || video.duration <= 0) return;
        video.pause();
        void unlock();

        tween = gsap.to(playhead, {
          progress: 1,
          ease: "none",
          onUpdate: () => {
            desiredTime = clampTime(
              videoTimeForProgress(playhead.progress, video.duration)
            );
            seek();
            if (progressRef.current) {
              gsap.set(progressRef.current, { scaleX: playhead.progress });
            }
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
            onRefresh: (self) => {
              const spacer = (self as ScrollTrigger & { spacer?: HTMLElement }).spacer;
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
          disablePictureInPicture
          disableRemotePlayback
          controls={reduced}
          aria-label="Mary praying in a sunlit courtyard"
        >
          <source src={`${SCROLL_WEBM}?v=2`} type='video/webm; codecs="vp9"' />
          {/* Last source: if this errors, every source has failed. */}
          <source
            src={`${SCROLL_MP4}?v=2`}
            type='video/mp4; codecs="avc1.42E01E"'
            onError={() => setFailed(true)}
          />
        </video>
      )}

      {!failed && <FilmNarration videoRef={videoRef} {...narration} reduced={reduced} />}

      <div className="scroll-film-progress" aria-hidden="true">
        <div ref={progressRef} />
      </div>
    </section>
  );
}
