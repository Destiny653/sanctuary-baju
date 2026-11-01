import { useRef } from "react";
import LaserFlow from "@/components/LaserFlow";
import { useI18n } from "@/i18n";
import { MaryFigure } from "./mary";

/** Static hero: blue left / white right — Our Lady of Mercy, with LaserFlow light. */
export function Hero() {
  const { t } = useI18n();
  const surfaceRef = useRef<HTMLDivElement>(null);

  return (
    <section className="hero" id="home" data-scroll>
      <div className="split-pane split-left" aria-hidden="true" />
      <div className="split-pane split-right" aria-hidden="true" />
      <div className="hero-laser" aria-hidden="true">
        <LaserFlow
          className="hero-laser-flow"
          surfaceRef={surfaceRef}
          color="#e8dcff"
          theme="dark"
          beamPosition={0.5}
          intensity={2.7}
          beamWidth={1.6}
          flare={2}
          spread={2.1}
          spill={1.5}
          fog={0.75}
          dust={1.7}
          streaks={1.8}
          dots={1.2}
          pulse={1.35}
          speed={1.15}
          mouseInteraction
          intro
        />
      </div>
      <div className="hero-stage">
        <article className="slide slide-split is-active">
          <h1 className="split-title">
            <span>{t.hero.ourLady}</span>
            <span>{t.hero.ofMercy}</span>
          </h1>
          <div ref={surfaceRef} className="hero-laser-surface">
            <MaryFigure className="hero-figure is-split" alt={t.hero.marySplitAlt} />
          </div>
          <a className="pill" href="#way">
            {t.common.readMore}
          </a>
        </article>
      </div>
      <a className="scroll-cue" href="#passion" aria-label={t.hero.scrollCue}>
        <span />
      </a>
    </section>
  );
}
