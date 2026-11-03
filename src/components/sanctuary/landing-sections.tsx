import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { art, evangel } from "./art";
import { formatDay, postsQuery } from "./content";
import { SplitText, Tilt, VelocityMarquee } from "./motion";
import { pick, useI18n } from "@/i18n";

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

export function Welcome() {
  const { t } = useI18n();
  return (
    <section className="welcome band band-snow" id="welcome" data-scroll>
      <div className="welcome-grid">
        <div data-reveal>
          <p className="kicker">{t.home.welcomeKicker}</p>
          <h2 className="display-lg">{t.home.welcomeTitle}</h2>
          <p className="serif-lead">{t.home.welcomeLead}</p>
          <p className="body-copy">{t.home.welcomeBody}</p>
          <a className="pill" href="#descent">
            {t.home.welcomeCta}
          </a>
        </div>
        <figure className="welcome-figure" data-reveal>
          <img src={art.northGarden} alt="" loading="lazy" />
        </figure>
      </div>
    </section>
  );
}

export function FinalInvite() {
  const { t } = useI18n();
  return (
    <section className="final-invite band band-snow" id="invite" data-scroll>
      <div className="final-invite-panel glass" data-reveal>
        <p className="kicker">{t.home.inviteKicker}</p>
        <h2 className="display-lg">{t.home.inviteTitle}</h2>
        <p className="serif-lead">{t.home.inviteLead}</p>
        <Link href="/contact" className="pill">
          {t.home.inviteCta}
        </Link>
      </div>
    </section>
  );
}

export function Happenings() {
  const { t, lang } = useI18n();
  const { data: news } = useSuspenseQuery(postsQuery("news"));
  const { data: events } = useSuspenseQuery(postsQuery("event"));
  const latestNews = news.slice(0, 2);
  const upcoming = events.filter((e) => e.event_start).slice(0, 4);
  return (
    <section className="happenings band band-snow" id="events">
      <div className="section-head">
        <p className="kicker">{t.home.happenKicker}</p>
        <SplitText text={t.home.happenTitle} className="display-xl" />
        <p className="serif-lead">{t.home.happenLead}</p>
      </div>
      <div className="happen-grid">
        <div className="happen-news">
          {latestNews.length === 0 ? (
            <p className="empty-note">{t.home.happenNewsEmpty}</p>
          ) : (
            latestNews.map((n) => (
              <Link key={n.id} href="/news" className="happen-card" data-gsap="left">
                {n.cover_url && <img src={n.cover_url} alt="" loading="lazy" />}
                <div>
                  <span className="tag">
                    {t.nav.news} · {formatDay(n.published_at, lang)}
                  </span>
                  <h3>{pick(n, "title", lang)}</h3>
                  <p>{pick(n, "excerpt", lang)}</p>
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="happen-events" data-gsap="right">
          <p className="kicker">{t.home.upcoming}</p>
          {upcoming.length === 0 ? (
            <p className="empty-note">{t.home.happenEventsEmpty}</p>
          ) : (
            <ul>
              {upcoming.map((e) => {
                const d = new Date(e.event_start!);
                return (
                  <li key={e.id}>
                    <Link href="/events" className="happen-event-link">
                      <span className="date-chip">
                        <b>{d.getUTCDate()}</b>
                        {d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
                          month: "short",
                          timeZone: "UTC",
                        })}
                      </span>
                      <div>
                        <strong>{pick(e, "title", lang)}</strong>
                        <span>{e.event_location}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="happen-actions">
            <Link href="/events" className="pill">
              {t.home.fullCalendar}
            </Link>
            <Link href="/gallery" className="pill pill-ink">
              {t.home.seeGallery}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
