import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { evangel } from "./art";
import { formatDay, postsQuery } from "./content";
import { SplitText, Tilt, VelocityMarquee, useHorizontalPin } from "./motion";

const STATIONS = [
  { file: "Station_01.png", n: "I",      title: "Jesus is condemned to death" },
  { file: "Station_02.png", n: "II",     title: "Jesus takes up his cross" },
  { file: "Station_03.png", n: "III",    title: "Jesus falls the first time" },
  { file: "Station_04.png", n: "IV",     title: "Jesus meets his mother" },
  { file: "Station_05.png", n: "V",      title: "Simon helps carry the cross" },
  { file: "Station_06a.png", n: "VI",    title: "Veronica wipes the face of Jesus" },
  { file: "Station_06b.png", n: "VI·b",  title: "The veil bears his likeness" },
  { file: "Station_07.png", n: "VII",    title: "Jesus falls the second time" },
  { file: "Station_08.png", n: "VIII",   title: "Jesus speaks to the women" },
  { file: "Station_09.png", n: "IX",     title: "Jesus falls the third time" },
  { file: "Station_10.png", n: "X",      title: "Jesus is stripped of his garments" },
  { file: "Station_11.png", n: "XI",     title: "Jesus is nailed to the cross" },
  { file: "Station_12.png", n: "XII",    title: "Jesus dies on the cross" },
  { file: "Station_13.png", n: "XIII",   title: "Jesus is taken down from the cross" },
  { file: "Station_14.png", n: "XIV",    title: "Jesus is laid in the tomb" },
].map((s) => ({ ...s, src: `/assets/stations-cross/${s.file}` }));

export function PassionScroll() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useHorizontalPin(section, track);
  return (
    <section className="passion-pin" id="passion" ref={section}>
      <div className="passion-track" ref={track}>
        <div className="passion-intro">
          <p className="kicker">The Passion</p>
          <SplitText text="Fourteen stations of the cross" className="display-xl" />
          <p className="serif-lead">
            Painted for the hill of Calvary behind the chapel. Walk them slowly, sideways through the
            story, from the garden to the tomb.
          </p>
        </div>
        {STATIONS.map((p) => (
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
  return (
    <section className="evangel band" id="evangel">
      <span className="evangel-word" aria-hidden="true" data-parallax="0.3">
        Gospel
      </span>
      <div className="section-head">
        <p className="kicker">His ministry</p>
        <SplitText text="The roads of the Gospel" className="display-xl" />
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
    <section className="marquee-band" aria-label="Words of the house">
      <VelocityMarquee items={["Ave Maria", "Gratia plena", "Dominus tecum", "Mater misericordiae"]} />
      <VelocityMarquee reverse items={["By His wounds we are healed", "Go and tell", "Peace be with you"]} />
    </section>
  );
}

export function Happenings() {
  const { data: news } = useSuspenseQuery(postsQuery("news"));
  const { data: events } = useSuspenseQuery(postsQuery("event"));
  const upcoming = events.filter((e) => e.event_start).slice(0, 3);
  return (
    <section className="happenings band">
      <div className="section-head">
        <p className="kicker">On the hill</p>
        <SplitText text="What is happening" className="display-xl" />
      </div>
      <div className="happen-grid">
        <div className="happen-news">
          {news.slice(0, 2).map((n) => (
            <Link key={n.id} to="/news" className="happen-card" data-gsap="left">
              {n.cover_url && <img src={n.cover_url} alt="" loading="lazy" />}
              <div>
                <span className="tag">News · {formatDay(n.published_at)}</span>
                <h3>{n.title_en}</h3>
                <p>{n.excerpt_en}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="happen-events" data-gsap="right">
          <p className="kicker">Coming up</p>
          <ul>
            {upcoming.map((e) => {
              const d = new Date(e.event_start!);
              return (
                <li key={e.id}>
                  <span className="date-chip">
                    <b>{d.getUTCDate()}</b>
                    {d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" })}
                  </span>
                  <div>
                    <strong>{e.title_en}</strong>
                    <span>{e.event_location}</span>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="happen-actions">
            <Link to="/events" className="pill">
              Full calendar
            </Link>
            <Link to="/gallery" className="pill pill-ink">
              See the gallery
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
