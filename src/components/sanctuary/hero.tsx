import { MaryFigure } from "./mary";
import { useI18n } from "@/i18n";

/** Static hero: blue left / white right — Our Lady of Mercy. */
export function Hero() {
  const { t } = useI18n();
  return (
    <section className="hero" id="home" data-scroll>
      <div className="hero-stage">
        <article className="slide slide-split is-active">
          <div className="split-pane split-left" aria-hidden="true" />
          <div className="split-pane split-right" aria-hidden="true" />
          <h1 className="split-title">
            <span>{t.hero.ourLady}</span>
            <span>{t.hero.ofMercy}</span>
          </h1>
          <MaryFigure className="hero-figure is-split" alt={t.hero.marySplitAlt} />
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
