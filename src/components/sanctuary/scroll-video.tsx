import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { videoTimeForProgress } from "./video-progress";
import { FilmNarration } from "./motion";
import { annunciationNarration } from "./film-narration";
import { useI18n } from "@/i18n";

const SCROLL_VIDEO_SRC = "/assets/vids/static-scroll.mp4";

/** A silent film whose timeline follows the shared Lenis/ScrollTrigger scroll. */
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
      const seek = () => {
        if (disposed || video.seeking || video.readyState < 1) return;
        if (Math.abs(video.currentTime - desiredTime) > 0.015) video.currentTime = desiredTime;
      };
      const setup = () => {
        if (disposed || tween || !Number.isFinite(video.duration) || video.duration <= 0) return;
        video.pause();
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
          },
        });
        ScrollTrigger.refresh();
      };
      video.addEventListener("loadedmetadata", setup);
      video.addEventListener("seeked", seek);
      setup();
      return () => {
        disposed = true;
        video.removeEventListener("loadedmetadata", setup);
        video.removeEventListener("seeked", seek);
        tween?.scrollTrigger?.kill();
        tween?.kill();
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
      <div className="scroll-film-shell">
        <div className="scroll-film-frame">
          {failed ? (
            <div className="scroll-film-media scroll-film-fallback" aria-label="Our Lady of Mercy film unavailable" />
          ) : (
            <video
              ref={videoRef}
              className="scroll-film-media"
              preload="auto"
              muted
              playsInline
              controls={reduced}
              onError={() => setFailed(true)}
              aria-label="Mary praying in a sunlit courtyard"
            >
              <source src={SCROLL_VIDEO_SRC} type="video/mp4" />
            </video>
          )}
          {!failed && <FilmNarration videoRef={videoRef} {...narration} reduced={reduced} />}
        </div>
      </div>
      <div className="scroll-film-progress" aria-hidden="true">
        <div ref={progressRef} />
      </div>
    </section>
  );
}