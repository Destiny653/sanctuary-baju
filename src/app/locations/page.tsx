"use client";

import { art } from "@/components/sanctuary/art";
import { LocationMap } from "@/components/sanctuary/location-map";
import { SplitText } from "@/components/sanctuary/motion";
import { PageHero, Shell } from "@/components/sanctuary/shell";
import { Locations } from "@/components/sanctuary/story";
import { useI18n } from "@/i18n";

export default function LocationsPage() {
  const { t } = useI18n();
  return (
    <Shell>
      {() => (
        <>
          <PageHero
            kicker={t.locations.kicker}
            title={t.locations.title}
            lede={t.locations.lead}
            images={[art.sanctuary, art.mountains, art.hills, art.heaven]}
          />
          <Locations />
          <LocationMap />
          <section className="mountains band band-sky">
            <img className="mountains-img" src={art.mountains} alt={t.mountains.imageAlt} loading="lazy" data-gsap="zoom" />
            <div className="mountains-copy">
              <SplitText text={t.mountains.title} className="display-xl" />
              <div className="mountains-cols">
                <div className="glass" data-gsap="left">
                  <h3>{t.mountains.femaleTitle}</h3>
                  <p>{t.mountains.femaleText}</p>
                </div>
                <div className="glass" data-gsap="right">
                  <h3>{t.mountains.maleTitle}</h3>
                  <p>{t.mountains.maleText}</p>
                </div>
              </div>
            </div>
          </section>
          <section className="hours-band band band-snow">
            <p className="kicker">{t.about.hoursKicker}</p>
            <ol className="hours-row">
              {t.about.hours.map((h) => (
                <li key={h.time} className="glass" data-gsap>
                  <b>{h.time}</b>
                  <strong>{h.name}</strong>
                  <span>{h.note}</span>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </Shell>
  );
}
