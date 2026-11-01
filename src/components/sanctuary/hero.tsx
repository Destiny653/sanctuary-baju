import { art, evangel, passion } from "./art";
import { useCallback, useEffect, useRef, useState } from "react";
import { MaryFigure } from "./mary";
import { Shards } from "./shards";

const HERO_VIDEO_SRC = "/assets/vids/hero-vid.mp4";

const SLIDES = [
  {
    id: "remains",
    kind: "monument" as const,
    title: "She remains",
    href: "#evangel",
  },
  {
    id: "passion",
    kind: "passion" as const,
    title: "By His wounds",
    sub: "The Passion of Christ — seven paintings on the hill of Calvary",
    href: "#passion",
  },
  {
    id: "evangel",
    kind: "evangel" as const,
    title: "Go and tell",
    sub: "Christ on the roads of the Gospel: preaching, calling, healing",
    href: "#evangel",
  },
  {
    id: "mercy",
    kind: "split" as const,
    left: "Our Lady",
    right: "of Mercy",
    href: "#way",
  },
  {
    id: "near",
    kind: "editorial" as const,
    line1: "We have never",
    line2: "been so near",
    lede: "A white chapel above still water. The door is open from first light until the night prayer. No one is charged to enter, to sit, or to leave a name.",
    href: "/contact",
  },
];

const COLLAGE = [
  { src: art.face, alt: "Close view of the carved face of Mary, dark wood under a sky-blue veil", className: "tile tile-a" },
  { src: art.hands, alt: "Carved hands of Mary open in welcome", className: "tile tile-b" },
  { src: art.sanctuary, alt: "The white chapel on its hill reflected in still water", className: "tile tile-c" },
  { src: art.worship, alt: "The congregation standing in the sky-blue nave", className: "tile tile-d" },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return reduced;
}

export function Hero() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [veil, setVeil] = useState(false);
  const [paused, setPaused] = useState(false);
  const indexRef = useRef(0);
  const busy = useRef(false);
  const offscreen = useRef(false);
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const go = useCallback(
    (next: number) => {
      const normalized = (next + SLIDES.length) % SLIDES.length;
      if (busy.current || normalized === indexRef.current) return;
      if (reduced) {
        indexRef.current = normalized;
        setIndex(normalized);
        return;
      }
      busy.current = true;
      setLeaving(true);
      setVeil(true);
      window.setTimeout(() => {
        indexRef.current = normalized;
        setIndex(normalized);
        setLeaving(false);
        setVeil(false);
        window.setTimeout(() => {
          busy.current = false;
        }, 680);
      }, 520);
    },
    [reduced],
  );

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => {
      if (document.hidden || offscreen.current) return;
      go(indexRef.current + 1);
    }, 6400);
    return () => window.clearInterval(id);
  }, [go, paused, reduced]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        offscreen.current = !entry?.isIntersecting;
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      }
      if (event.key === "ArrowRight") go(indexRef.current + 1);
      if (event.key === "ArrowLeft") go(indexRef.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <section
      className="hero"
      id="home"
      ref={rootRef}
      aria-roledescription="carousel"
      data-scroll
    >
      <div className="hero-sky" aria-hidden="true" />
      {!reduced && (
        <video
          className="hero-bg-video"
          src={HERO_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
      <div className="hero-glass" aria-hidden="true" />
      <Shards burst={leaving} />
      <div className="hero-stage">
        {SLIDES.map((slide, i) => {
          const active = i === index;
          return (
            <article
              key={slide.id}
              className={
                "slide slide-" +
                slide.kind +
                (active ? " is-active" : "") +
                (active && leaving ? " is-leaving" : "")
              }
              aria-hidden={!active}
              inert={!active}
            >
              {slide.kind === "monument" && (
                <>
                  <h1 className="hero-title">{slide.title}</h1>
                  <MaryFigure
                    className="hero-figure"
                    alt="Carved statue of Mary as an African woman, in a white robe and sky-blue mantle, hands open, a gold ring turning behind her head"
                  />
                </>
              )}
              {slide.kind === "passion" && (
                <div className="hero-mosaic is-passion">
                  {passion.slice(0, 5).map((p, k) => (
                    <figure key={p.src} className={"mosaic-tile m-" + k}>
                      <img src={p.src} alt={p.title} />
                      <figcaption>{p.n}</figcaption>
                    </figure>
                  ))}
                  <div className="mosaic-copy">
                    <h1 className="hero-title is-mosaic">{slide.title}</h1>
                    <p>{slide.sub}</p>
                    <a className="pill" href={slide.href}>
                      Discover
                    </a>
                  </div>
                </div>
              )}
              {slide.kind === "evangel" && (
                <div className="hero-mosaic is-evangel">
                  {evangel.map((p, k) => (
                    <figure key={p.src} className={"mosaic-tile e-" + k}>
                      <img src={p.src} alt={p.title} />
                    </figure>
                  ))}
                  <img className="evangel-christ" src={art.christ} alt="" aria-hidden="true" />
                  <div className="mosaic-copy">
                    <h1 className="hero-title is-mosaic">{slide.title}</h1>
                    <p>{slide.sub}</p>
                    <a className="pill" href={slide.href}>
                      Discover
                    </a>
                  </div>
                </div>
              )}
              {slide.kind === "split" && (
                <>
                  <div className="split-pane split-left" />
                  <div className="split-pane split-right" />
                  <h1 className="split-title">
                    <span>{slide.left}</span>
                    <span>{slide.right}</span>
                  </h1>
                  <MaryFigure
                    className="hero-figure is-split"
                    alt="Mary standing between the sky and the light, a gold ring behind her head"
                  />
                </>
              )}
              {slide.kind === "editorial" && (
                <div className="editorial">
                  <div className="editorial-copy glass">
                    <h1 className="hero-title is-left">
                      {slide.line1}
                      <br />
                      {slide.line2}
                    </h1>
                    <p className="lede">{slide.lede}</p>
                    <a className="pill" href={slide.href}>
                      Read more
                    </a>
                  </div>
                  <div className="collage">
                    {COLLAGE.map((tile) => (
                      <img key={tile.src} className={tile.className} src={tile.src} alt={tile.alt} />
                    ))}
                  </div>
                </div>
              )}
              {(slide.kind === "monument" || slide.kind === "split") && (
                <a className="pill" href={slide.href}>
                  Read more
                </a>
              )}
            </article>
          );
        })}
      </div>
      <div className={veil ? "veil is-on" : "veil"} aria-hidden="true" />
      <div className="hero-meta glass">
        <p className="hero-index">
          <span>0{index + 1}</span>
          <i />
          <span>0{SLIDES.length}</span>
        </p>
        <button
          type="button"
          className="text-btn"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
        >
          {paused || reduced ? "Play" : "Pause"}
        </button>
        <div className="hero-jumps">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className={i === index ? "jump is-on" : "jump"}
              aria-label={`Show scene ${i + 1}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      </div>
      <a className="scroll-cue" href="#passion" aria-label="Scroll down">
        <span />
      </a>
    </section>
  );
}
