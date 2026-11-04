"use client";

import { useQuery } from "@tanstack/react-query";
import type { CSSProperties } from "react";
import { art } from "./art";
import { aboutContentQuery, DEFAULT_ABOUT_CONTENT, type AboutContent } from "./about-content";
import { pick, useI18n } from "@/i18n";

const delay = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as CSSProperties;

function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function AboutMissionPage({ content }: { content: AboutContent }) {
  const { t, lang } = useI18n();
  const figure = content.figure_url || art.sanctuary;

  return (
    <>
      <section className="about-mission band band-snow" id="mission" data-scroll>
        <div className="about-mission-grid">
          <div>
            <p className="kicker" data-reveal>
              {pick(content, "mission_kicker", lang)}
            </p>
            <h2 className="display-lg" data-reveal style={delay(60)}>
              {pick(content, "mission_title", lang)}
            </h2>
            {paragraphs(pick(content, "mission_body", lang)).map((p, i) => (
              <p key={i} className={i === 0 ? "serif-lead" : "body-copy"} data-reveal style={delay(120 + i * 70)}>
                {p}
              </p>
            ))}
            <blockquote className="pull about-mission-quote" data-reveal style={delay(320)}>
              {pick(content, "quote", lang)}
            </blockquote>
          </div>
          <figure className="about-mission-figure glass-frame" data-reveal style={delay(100)}>
            <img src={figure} alt={pick(content, "figure_caption", lang)} loading="lazy" />
            <figcaption>{pick(content, "figure_caption", lang)}</figcaption>
          </figure>
        </div>
      </section>

      <section className="about-purpose band band-mist" id="purpose" data-scroll>
        <div className="about-purpose-intro">
          <p className="kicker" data-reveal>
            {pick(content, "purpose_kicker", lang)}
          </p>
          <h2 className="display-lg" data-reveal style={delay(60)}>
            {pick(content, "purpose_title", lang)}
          </h2>
          <p className="serif-lead" data-reveal style={delay(120)}>
            {pick(content, "purpose_lead", lang)}
          </p>
        </div>
        <ul className="about-purpose-grid">
          {content.purpose_points.map((point, i) => (
            <li key={`${point.title_en}-${i}`} className="about-purpose-card glass" data-reveal style={delay(i * 90)}>
              <span className="about-purpose-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display-md">{pick(point, "title", lang)}</h3>
              <p className="body-copy">{pick(point, "text", lang)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-founders band band-snow" id="founders" data-scroll>
        <div className="about-founders-intro">
          <p className="kicker" data-reveal>
            {pick(content, "founders_kicker", lang)}
          </p>
          <h2 className="display-lg" data-reveal style={delay(60)}>
            {pick(content, "founders_title", lang)}
          </h2>
          <p className="serif-lead" data-reveal style={delay(120)}>
            {pick(content, "founders_lead", lang)}
          </p>
        </div>
        <ul className="about-founders-grid">
          {content.founders.map((person, i) => (
            <li key={`${person.name}-${i}`} className="about-founder-card glass" data-reveal style={delay(i * 100)}>
              <div className="about-founder-photo">
                {person.photo_url ? (
                  <img src={person.photo_url} alt={person.name} loading="lazy" />
                ) : (
                  <span className="about-founder-initial" aria-hidden="true">
                    {person.name.slice(0, 1)}
                  </span>
                )}
              </div>
              <div className="about-founder-copy">
                <p className="kicker">{pick(person, "role", lang)}</p>
                <h3 className="display-md">{person.name}</h3>
                <p className="body-copy">{pick(person, "bio", lang)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-blessing band band-sky" id="blessing" data-scroll>
        <div className="about-blessing-panel glass">
          <div className="about-blessing-copy">
            <p className="kicker" data-reveal>
              {pick(content, "blessing_kicker", lang)}
            </p>
            <h2 className="display-lg" data-reveal style={delay(60)}>
              {pick(content, "blessing_title", lang)}
            </h2>
            <p className="about-blessing-name" data-reveal style={delay(100)}>
              {content.blessing_name}
            </p>
            <p className="kicker about-blessing-role" data-reveal style={delay(140)}>
              {pick(content, "blessing_role", lang)}
            </p>
            <p className="about-blessing-date" data-reveal style={delay(180)}>
              {pick(content, "blessing_date", lang)}
            </p>
            {paragraphs(pick(content, "blessing_body", lang)).map((p, i) => (
              <p key={i} className="body-copy" data-reveal style={delay(220 + i * 70)}>
                {p}
              </p>
            ))}
          </div>
          <div className="about-blessing-portrait" data-reveal style={delay(120)}>
            {content.blessing_photo_url ? (
              <img src={content.blessing_photo_url} alt={content.blessing_name} loading="lazy" />
            ) : (
              <div className="about-blessing-placeholder" aria-hidden="true">
                <span>{content.blessing_name.slice(0, 1)}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="about-hours-band band band-snow" aria-labelledby="about-hours-title">
        <p className="kicker" id="about-hours-title" data-reveal>
          {t.about.hoursKicker}
        </p>
        <ol className="hours">
          {t.about.hours.map((hour, i) => (
            <li key={hour.time} className="glass" data-reveal style={delay(i * 80)}>
              <span className="hours-time">{hour.time}</span>
              <span className="hours-name">{hour.name}</span>
              <span className="hours-note">{hour.note}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

export function AboutPageBody() {
  const { data = DEFAULT_ABOUT_CONTENT } = useQuery(aboutContentQuery);
  return <AboutMissionPage content={data} />;
}
