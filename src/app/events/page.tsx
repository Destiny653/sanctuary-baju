"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { art } from "@/components/sanctuary/art";
import { formatDay, formatTime, postsQuery } from "@/components/sanctuary/content";
import { PageHero, Shell } from "@/components/sanctuary/shell";

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const key = (d: Date) => `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;

export default function EventsPage() {
  const { data: events = [] } = useQuery(postsQuery("event"));
  const dated = events.filter((e) => e.event_start);
  const start = dated.find((e) => new Date(e.event_start!) >= new Date()) ?? dated[0];
  const initial = start ? new Date(start.event_start!) : new Date();
  const [month, setMonth] = useState({ y: initial.getUTCFullYear(), m: initial.getUTCMonth() });
  const [picked, setPicked] = useState<string | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<string, typeof dated>();
    for (const e of dated) {
      const k = key(new Date(e.event_start!));
      map.set(k, [...(map.get(k) ?? []), e]);
    }
    return map;
  }, [dated]);

  const first = new Date(Date.UTC(month.y, month.m, 1));
  const lead = (first.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(month.y, month.m + 1, 0)).getUTCDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: days }, (_, i) => new Date(Date.UTC(month.y, month.m, i + 1))),
  ];
  const shift = (n: number) => {
    const d = new Date(Date.UTC(month.y, month.m + n, 1));
    setMonth({ y: d.getUTCFullYear(), m: d.getUTCMonth() });
    setPicked(null);
  };
  const inMonth = dated.filter((e) => {
    const d = new Date(e.event_start!);
    return d.getUTCFullYear() === month.y && d.getUTCMonth() === month.m;
  });
  const list = picked ? (byDay.get(picked) ?? []) : inMonth;
  const label = first.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <Shell>
      {() => (
        <>
          <PageHero
            kicker="Events calendar"
            title="Days of grace"
            lede="Vigils, feasts and pilgrimages. Pick a day to see what is kept."
            images={[art.rosaryJoyful, art.worship, art.passionAgony, art.evangelHeal]}
          />
          <section className="events band">
            <div className="calendar glass" data-gsap="left">
              <div className="cal-top">
                <button type="button" className="icon-btn is-ink" onClick={() => shift(-1)} aria-label="Previous month">
                  <ChevronLeft strokeWidth={1.6} />
                </button>
                <h2 className="display-md">{label}</h2>
                <button type="button" className="icon-btn is-ink" onClick={() => shift(1)} aria-label="Next month">
                  <ChevronRight strokeWidth={1.6} />
                </button>
              </div>
              <div className="cal-grid">
                {WEEK.map((w) => (
                  <span key={w} className="cal-w">
                    {w}
                  </span>
                ))}
                {cells.map((d, i) => {
                  if (!d) return <span key={i} />;
                  const k = key(d);
                  const has = byDay.has(k);
                  return (
                    <button
                      type="button"
                      key={i}
                      className={"cal-d" + (has ? " has" : "") + (picked === k ? " on" : "")}
                      onClick={() => setPicked(picked === k ? null : k)}
                      aria-label={`${d.getUTCDate()} ${label}${has ? ", has events" : ""}`}
                    >
                      {d.getUTCDate()}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="event-list" data-gsap="right">
              <p className="kicker">{picked ? "That day" : `In ${label}`}</p>
              {list.length === 0 && <p className="empty-note">Nothing kept on the calendar here yet.</p>}
              {list.map((e) => (
                <article key={e.id} className="event-card">
                  {e.cover_url && <img src={e.cover_url} alt="" loading="lazy" />}
                  <div>
                    <span className="tag">
                      {formatDay(e.event_start!)} · {formatTime(e.event_start!)}
                    </span>
                    <h3>{e.title_en}</h3>
                    <p>{e.excerpt_en}</p>
                    {e.event_location && (
                      <span className="event-loc">
                        <MapPin strokeWidth={1.6} /> {e.event_location}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section className="events-all band">
            <p className="kicker">Every event</p>
            <ol className="timeline">
              {dated.map((e) => (
                <li key={e.id} data-gsap>
                  <time>{formatDay(e.event_start!)}</time>
                  <strong>{e.title_en}</strong>
                  <span>{e.event_location}</span>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </Shell>
  );
}
