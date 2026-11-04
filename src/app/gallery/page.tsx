"use client";

import { useEffect, useRef, useState } from "react";
import Masonry from "@/components/Masonry";
import PixelSwap from "@/components/PixelSwap";
import { art } from "@/components/sanctuary/art";
import { LOCAL_GALLERY_SEGMENTS } from "@/components/sanctuary/gallery-local";
import { SplitText } from "@/components/sanctuary/motion";
import { Shell } from "@/components/sanctuary/shell";
import { pick, useI18n } from "@/i18n";

const HERO_DWELL_MS = 4200;

function GalleryHeroSwap({ images }: { images: readonly string[] }) {
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState(false);
  const dwellRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const first = images[index % images.length];
  const second = images[(index + 1) % images.length];

  useEffect(() => {
    dwellRef.current = setTimeout(() => setActive(true), HERO_DWELL_MS);
    return () => {
      if (dwellRef.current) clearTimeout(dwellRef.current);
    };
  }, [index]);

  return (
    <div className="gallery-hero-media" aria-hidden="true">
      <PixelSwap
        key={index}
        className="gallery-hero-swap"
        firstContent={<img className="gallery-hero-swap-img" src={first} alt="" />}
        secondContent={<img className="gallery-hero-swap-img" src={second} alt="" />}
        pattern="spiral"
        pixelSize={32}
        gap={2}
        pixelRadius={8}
        pixelScale={1.05}
        duration={1000}
        pixelDuration={780}
        randomness={0.4}
        bounce={0.18}
        trigger="none"
        intro
        active={active}
        aspectRatio="unset"
        onComplete={(shown) => {
          if (!shown) return;
          setIndex((i) => i + 1);
          setActive(false);
        }}
        style={{ width: "100%", height: "100%", aspectRatio: "unset" }}
      />
    </div>
  );
}

export default function GalleryPage() {
  const { t, lang } = useI18n();

  return (
    <Shell>
      {() => (
        <div className="gallery-page">
          <section className="gallery-hero" data-scroll>
            <GalleryHeroSwap images={art.galleryHero} />
            <div className="gallery-hero-wash" aria-hidden="true" />
            <div className="gallery-hero-copy">
              <p className="kicker">{t.gallery.kicker}</p>
              <SplitText text={t.gallery.title} className="display-xl" />
              <p className="serif-lead">{t.gallery.lead}</p>
            </div>
          </section>

          {LOCAL_GALLERY_SEGMENTS.map((album, ai) => {
            const title = pick(album, "title", lang);
            const description = pick(album, "description", lang);
            const items = album.images.map((img) => ({
              id: img.id,
              img: img.img,
              title: pick(img, "title", lang),
              alt: img.alt,
            }));

            return (
              <section key={album.id} className="album album-segment band">
                <header className="album-head">
                  <span className="album-n">{String(ai + 1).padStart(2, "0")}</span>
                  {album.year != null && <p className="album-date">{album.year}</p>}
                  <SplitText text={title} className="display-lg" />
                  {description && <p className="serif-lead">{description}</p>}
                </header>
                <Masonry
                  items={items}
                  columnWidth={240}
                  gap={12}
                  radius={14}
                  animateFrom="bottom"
                  hoverEffect="zoom"
                  captions="hover"
                  lightbox
                  draggable={false}
                  columns="auto"
                  stagger={0.05}
                  duration={0.6}
                  bounce={0.15}
                  blurToFocus
                  focusOnHover={false}
                  parallax={0}
                  revealOnScroll
                />
              </section>
            );
          })}
        </div>
      )}
    </Shell>
  );
}
