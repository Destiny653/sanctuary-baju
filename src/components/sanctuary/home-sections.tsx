import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { evangel } from "./art";
import { formatDay, postsQuery } from "./content";
import { SplitText, Tilt, VelocityMarquee, useHorizontalPin } from "./motion";
import { pick, useI18n } from "@/i18n";

const STATION_FILES = [
  "Station_01.png",
  "Station_02.png",
  "Station_03.png",
  "Station_04.png",
  "Station_05.png",
  "Station_06a.png",
  "Station_07.png",
  "Station_08.png",
  "Station_09.png",
  "Station_10.png",
  "Station_11.png",
  "Station_12.png",
  "Station_13.png",
  "Station_14.png",
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV"];

export function PassionScroll() {
  const { t } = useI18n();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useHorizontalPin(section, track);
  const stations = STATION_FILES.map((file, i) => ({
    src: `/assets/stations-cross/${file}`,
    n: ROMAN[i]!,
    title: t.calvary.stations[i] ?? "",
  }));
  return (
    <section className="passion-pin band-snow" id="passion" ref={section}>
      <div className="passion-track" ref={track}>
        <div className="passion-intro">
          <p className="kicker">{t.home.passionKicker}</p>
          <h2 className="display-xl">{t.home.passionTitle}</h2>
          <p className="serif-lead">{t.home.passionLead}</p>
        </div>
        {stations.map((p) => (
          <Tilt key={p.src} className="passion-card">
            <img src={p.src} alt={p.title} loading="lazy" />
            <div className="passion-card-cap">
              <span>{p.n}</span>
              <h3>{p.title}</h3>
            </div>
          </Tilt>
        ))}
      </div>
    </section>
  );
}

export function Evangel() {
  const { t } = useI18n();
  return (
    <section className="evangel band band-snow" id="evangel">
      <span className="evangel-word" aria-hidden="true" data-parallax="0.3">
        Gospel
      </span>
      <div className="section-head">
        <p className="kicker">{t.home.evangelKicker}</p>
        <SplitText text={t.home.evangelTitle} className="display-xl" />
      </div>
      <div className="evangel-grid">
        {evangel.map((e, i) => (
          <article key={e.src} className={"evangel-card ev-" + i} data-gsap={i === 1 ? "zoom" : i === 0 ? "left" : "right"}>
            <div className="evangel-frame">
              <img src={e.src} alt={e.title} loading="lazy" data-parallax="0.08" />
            </div>
            <h3>{e.title}</h3>
            <p>{e.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Marquees() {
  return (
    <section className="marquee-band band-sky" aria-label="Words of the house">
      <VelocityMarquee items={["Ave Maria", "Gratia plena", "Dominus tecum", "Mater misericordiae"]} />
      <VelocityMarquee reverse items={["By His wounds we are healed", "Go and tell", "Peace be with you"]} />
    </section>
  );
}

export function Happenings() {
  const { t, lang } = useI18n();
  const { data: news } = useSuspenseQuery(postsQuery("news"));
  const { data: events } = useSuspenseQuery(postsQuery("event"));
  const upcoming = events.filter((e) => e.event_start).slice(0, 3);
  return (
    <section className="happenings band band-snow">
      <div className="section-head">
        <p className="kicker">{t.home.happenKicker}</p>
        <SplitText text={t.home.happenTitle} className="display-xl" />
      </div>
      <div className="happen-grid">
        <div className="happen-news">
          {news.slice(0, 2).map((n) => (
            <Link key={n.id} to="/news" className="happen-card" data-gsap="left">
              {n.cover_url && <img src={n.cover_url} alt="" loading="lazy" />}
              <div>
                <span className="tag">
                  {t.nav.news} · {formatDay(n.published_at, lang)}
                </span>
                <h3>{pick(n, "title", lang)}</h3>
                <p>{pick(n, "excerpt", lang)}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="happen-events" data-gsap="right">
          <p className="kicker">{t.home.upcoming}</p>
          <ul>
            {upcoming.map((e) => {
              const d = new Date(e.event_start!);
              return (
                <li key={e.id}>
                  <span className="date-chip">
                    <b>{d.getUTCDate()}</b>
                    {d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { month: "short", timeZone: "UTC" })}
                  </span>
                  <div>
                    <strong>{pick(e, "title", lang)}</strong>
                    <span>{e.event_location}</span>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="happen-actions">
            <Link to="/events" className="pill">
              {t.home.fullCalendar}
            </Link>
            <Link to="/gallery" className="pill pill-ink">
              {t.home.seeGallery}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
