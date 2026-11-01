import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import FlexCarousel from "@/components/FlexCarousel";
import Masonry from "@/components/Masonry";
import { art } from "@/components/sanctuary/art";
import { GALLERY_HERO_STATIONS, LOCAL_GALLERY_SEGMENTS } from "@/components/sanctuary/gallery-local";
import { SplitText } from "@/components/sanctuary/motion";
import { Shell } from "@/components/sanctuary/shell";
import { pick, useI18n } from "@/i18n";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Our Lady of Mercy" },
      { name: "description", content: "Albums of the sanctuary." },
      { property: "og:title", content: "Gallery — Our Lady of Mercy" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { t, lang } = useI18n();

  const heroItems = useMemo(
    () =>
      GALLERY_HERO_STATIONS.map((item) => ({
        src: item.src,
        alt: lang === "fr" ? item.title_fr : item.title_en,
        title: lang === "fr" ? item.title_fr : item.title_en,
        subtitle: lang === "fr" ? item.subtitle_fr : item.subtitle_en,
      })),
    [lang],
  );

  return (
    <Shell>
      {() => (
        <div className="gallery-page">
          <section className="gallery-hero" data-scroll>
            <img className="gallery-hero-sky ken" src={art.heaven} alt="" />
            <div className="gallery-hero-sun" aria-hidden="true" />
            <div className="gallery-hero-rays" aria-hidden="true" />
            <div className="gallery-hero-wash" aria-hidden="true" />
            <div className="gallery-hero-copy">
              <p className="kicker">{t.gallery.kicker}</p>
              <SplitText text={t.gallery.title} className="display-xl" />
              <p className="serif-lead">{t.gallery.lead}</p>
            </div>
            <div className="gallery-hero-reel">
              <FlexCarousel
                items={heroItems}
                preset="liquid"
                intro="rise"
                cardHeight={0.88}
                gap={20}
                squeeze={0.08}
                focusOnClick
                captions
                fit="portrait"
                radius={18}
                lensWidth={0.9}
                lensHeight={1.4}
                tilt={52}
                roundness={1}
                bend={0.28}
                reach={0.42}
                curl="twist"
                dispersion={0.4}
                liquid={0}
                followCursor={false}
                autoplay={false}
                interval={4}
                captureWheel={false}
              />
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
