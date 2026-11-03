"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";
import { art } from "@/components/sanctuary/art";
import { formatDay, postsQuery, type Post } from "@/components/sanctuary/content";
import { Tilt } from "@/components/sanctuary/motion";
import { PageHero, Shell } from "@/components/sanctuary/shell";
import { pick, useI18n } from "@/i18n";

export default function NewsPage() {
  const { t, lang } = useI18n();
  const { data: news = [] } = useQuery(postsQuery("news"));
  const [reading, setReading] = useState<Post | null>(null);
  const [first, ...rest] = news;
  return (
    <Shell>
      {() => (
        <>
          <PageHero
            kicker={t.posts.newsKicker}
            title={t.pages.newsHeroTitle}
            lede={t.pages.newsHeroLead}
            images={[art.mountains, art.evangelCall, art.sanctuary, art.passionWay]}
          />
          <section className="news band band-snow">
            {!first && <p className="empty-note">{t.pages.newsEmpty}</p>}
            {first && (
              <article className="news-lead" data-gsap="zoom">
                {first.cover_url && <img src={first.cover_url} alt="" data-parallax="0.06" />}
                <div className="news-lead-copy glass">
                  <span className="tag">{formatDay(first.published_at, lang)}</span>
                  <h2 className="display-lg">{pick(first, "title", lang)}</h2>
                  <p className="serif-lead">{pick(first, "excerpt", lang)}</p>
                  <button className="pill" type="button" onClick={() => setReading(first)}>
                    {t.pages.newsRead}
                  </button>
                </div>
              </article>
            )}
            <div className="news-grid">
              {rest.map((n, i) => (
                <Tilt key={n.id} className="news-card">
                  <button type="button" onClick={() => setReading(n)} data-gsap={i % 2 ? "right" : "left"}>
                    {n.cover_url && <img src={n.cover_url} alt="" loading="lazy" />}
                    <span className="tag">{formatDay(n.published_at, lang)}</span>
                    <h3>{pick(n, "title", lang)}</h3>
                    <p>{pick(n, "excerpt", lang)}</p>
                  </button>
                </Tilt>
              ))}
            </div>
          </section>
          <Dialog.Root open={!!reading} onOpenChange={(v) => !v && setReading(null)}>
            <Dialog.Portal>
              <Dialog.Overlay className="overlay" />
              <Dialog.Content className="reader" aria-describedby={undefined}>
                <Dialog.Close className="icon-btn is-ink reader-close" aria-label={t.common.close}>
                  <X strokeWidth={1.6} />
                </Dialog.Close>
                {reading?.cover_url && <img src={reading.cover_url} alt="" />}
                <span className="tag">{reading && formatDay(reading.published_at, lang)}</span>
                <Dialog.Title className="display-lg">{reading ? pick(reading, "title", lang) : ""}</Dialog.Title>
                {(reading ? pick(reading, "body", lang) || pick(reading, "excerpt", lang) : "")
                  .split("\n")
                  .map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </>
      )}
    </Shell>
  );
}
