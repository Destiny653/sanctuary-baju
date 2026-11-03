import { Link } from "@tanstack/react-router";
import LaserFlow from "@/components/LaserFlow";
import { useI18n } from "@/i18n";
import { art } from "./art";

/** Hero: cinematic mountains background, invitation and pilgrimage CTAs. */
export function Hero() {
  const { t } = useI18n();

  return (
    <section className="hero" id="home" data-scroll>
      <img className="hero-cinematic ken" src={art.northGarden} alt="" />
      <div className="hero-cinematic-wash" aria-hidden="true" />
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
      <div className="hero-stage">
        <article className="slide slide-split is-active">
          <div className="hero-copy">
            <p className="hero-brand">
              {t.hero.ourLady} {t.hero.ofMercy}
            </p>
            <h1 className="hero-headline">{t.hero.headline}</h1>
            <p className="hero-lede">{t.hero.lede}</p>
            <div className="hero-ctas">
              <a className="pill" href="#welcome">
                {t.hero.explore}
              </a>
              <Link className="pill pill-ghost" to="/contact">
                {t.hero.plan}
              </Link>
            </div>
          </div>
        </article>
      </div>
      <a className="scroll-cue" href="#welcome" aria-label={t.hero.scrollCue}>
        <span />
      </a>
    </section>
  );
}
