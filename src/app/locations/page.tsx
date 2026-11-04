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
            images={[art.mountOfMary, art.mountOfJesus, art.mountaintopOfMary, art.mountaintopOfJesus]}
          />
          <Locations />
          <LocationMap />
          <section className="mountains band band-sky">
            <div className="mountains-copy">
              <p className="kicker">{t.mountains.kicker}</p>
              <SplitText text={t.mountains.title} className="display-xl" />
              <p className="serif-lead">{t.mountains.lead}</p>
            </div>
            <div className="mountains-pair">
              <figure className="mountains-card glass" data-gsap="left">
                <img className="mountains-img" src={art.mountOfMary} alt={t.mountains.femaleTitle} loading="lazy" />
                <img className="mountains-summit" src={art.mountaintopOfMary} alt={t.mountains.summitMaryAlt} loading="lazy" />
                <div className="mountains-card-copy">
                  <p className="kicker">{t.mountains.femaleKicker}</p>
                  <h3>{t.mountains.femaleTitle}</h3>
                  <p>{t.mountains.femaleText}</p>
                </div>
              </figure>
              <figure className="mountains-card glass" data-gsap="right">
                <img className="mountains-img" src={art.mountOfJesus} alt={t.mountains.maleTitle} loading="lazy" />
                <img className="mountains-summit" src={art.mountaintopOfJesus} alt={t.mountains.summitJesusAlt} loading="lazy" />
                <div className="mountains-card-copy">
                  <p className="kicker">{t.mountains.maleKicker}</p>
                  <h3>{t.mountains.maleTitle}</h3>
                  <p>{t.mountains.maleText}</p>
                </div>
              </figure>
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
