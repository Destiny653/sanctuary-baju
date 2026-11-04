"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import FadeContent from "@/components/FadeContent";
import LaserFlow from "@/components/LaserFlow";
import { useI18n } from "@/i18n";
import { art } from "./art";

const HERO_MOUNTAINS = [
  art.mountOfJesus,
  art.mountOfMary,
  art.mountaintopOfJesus,
  art.mountaintopOfMary,
] as const;

/** Hold each mist-revealed mountain before advancing. */
const MOUNTAIN_DWELL_MS = 5200;

/** Hero: twin-mountain backgrounds mist-switching, invitation and pilgrimage CTAs. */
export function Hero() {
  const { t } = useI18n();
  // WebGL laser is too heavy for mobile scroll — keep the wash only.
  const [laser, setLaser] = useState(false);
  const [index, setIndex] = useState(0);
  const [base, setBase] = useState(0);
  const dwellRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px), (hover: none), (pointer: coarse)");
    const sync = () => setLaser(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    return () => {
      if (dwellRef.current) clearTimeout(dwellRef.current);
    };
  }, []);

  const advanceMountain = () => {
    setBase(index);
    if (dwellRef.current) clearTimeout(dwellRef.current);
    dwellRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % HERO_MOUNTAINS.length);
    }, MOUNTAIN_DWELL_MS);
  };

  return (
    <section className="hero" id="home" data-scroll>
      <div className="hero-mountains" aria-hidden="true">
        <img className="hero-cinematic hero-cinematic-base" src={HERO_MOUNTAINS[base]} alt="" />
        <FadeContent
          key={HERO_MOUNTAINS[index]}
          className="hero-cinematic-fade"
          effect="mist"
          duration={1.8}
          ease="power2.out"
          stagger={0.1}
          threshold={0.1}
          trigger="mount"
          once
          onComplete={advanceMountain}
        >
          <img className="hero-cinematic" src={HERO_MOUNTAINS[index]} alt="" />
        </FadeContent>
      </div>
      <div className="hero-cinematic-wash" aria-hidden="true" />
      {laser ? (
        <div className="hero-laser" aria-hidden="true">
          <LaserFlow
            className="hero-laser-flow"
            color="#e8dcff"
            theme="dark"
            beamPosition={0.5}
            surfaceLevel={1}
            intensity={2.4}
            beamWidth={1.6}
            flare={2}
            spread={2.1}
            spill={1.4}
            fog={0.7}
            dust={1.5}
            streaks={1.6}
            dots={1.1}
            pulse={1.3}
            speed={1.15}
            mouseInteraction
            intro
          />
        </div>
      ) : null}
      <div className="hero-stage">
        <article className="slide slide-split is-active">
          <FadeContent
            className="hero-copy"
            effect="mist"
            duration={1.8}
            ease="power2.out"
            stagger={0.1}
            threshold={0.1}
            trigger="mount"
            once
          >
            <p className="hero-brand">
              {t.hero.ourLady} {t.hero.ofMercy}
            </p>
            <h1 className="hero-headline">{t.hero.headline}</h1>
            <p className="hero-lede">{t.hero.lede}</p>
            <div className="hero-ctas">
              <a className="pill" href="#welcome">
                {t.hero.explore}
              </a>
              <Link className="pill pill-ghost" href="/contact">
                {t.hero.plan}
              </Link>
            </div>
          </FadeContent>
        </article>
      </div>
      <a className="scroll-cue" href="#welcome" aria-label={t.hero.scrollCue}>
        <span />
      </a>
    </section>
  );
}
