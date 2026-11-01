import * as Dialog from "@radix-ui/react-dialog";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useState } from "react";
import { art } from "@/components/sanctuary/art";
import { formatDay, postsQuery, type Post } from "@/components/sanctuary/content";
import { Tilt } from "@/components/sanctuary/motion";
import { PageHero, Shell } from "@/components/sanctuary/shell";

const TITLE = "News — Our Lady of Mercy";
const DESC = "Latest news from the sanctuary: the chapel, the twin mountains and the pilgrim house.";

export const Route = createFileRoute("/news")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery("news")),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { data: news } = useSuspenseQuery(postsQuery("news"));
  const [reading, setReading] = useState<Post | null>(null);
  const [first, ...rest] = news;
  return (
    <Shell>
      {() => (
        <>
          <PageHero
            kicker="News"
            title="Word from the hill"
            lede="What has been built, blessed and begun at the sanctuary."
            images={[art.mountains, art.evangelCall, art.sanctuary, art.passionWay]}
          />
          <section className="news band">
            {!first && <p className="empty-note">No news yet. The hill is quiet.</p>}
            {first && (
              <article className="news-lead" data-gsap="zoom">
                {first.cover_url && <img src={first.cover_url} alt="" data-parallax="0.06" />}
                <div className="news-lead-copy glass">
                  <span className="tag">{formatDay(first.published_at)}</span>
                  <h2 className="display-lg">{first.title_en}</h2>
                  <p className="serif-lead">{first.excerpt_en}</p>
                  <button className="pill" type="button" onClick={() => setReading(first)}>
                    Read the story
                  </button>
                </div>
              </article>
            )}
            <div className="news-grid">
              {rest.map((n, i) => (
                <Tilt key={n.id} className="news-card">
                  <button type="button" onClick={() => setReading(n)} data-gsap={i % 2 ? "right" : "left"}>
                    {n.cover_url && <img src={n.cover_url} alt="" loading="lazy" />}
                    <span className="tag">{formatDay(n.published_at)}</span>
                    <h3>{n.title_en}</h3>
                    <p>{n.excerpt_en}</p>
                  </button>
                </Tilt>
              ))}
            </div>
          </section>
          <Dialog.Root open={!!reading} onOpenChange={(v) => !v && setReading(null)}>
            <Dialog.Portal>
              <Dialog.Overlay className="overlay" />
              <Dialog.Content className="reader" aria-describedby={undefined}>
                <Dialog.Close className="icon-btn is-ink reader-close" aria-label="Close">
                  <X strokeWidth={1.6} />
                </Dialog.Close>
                {reading?.cover_url && <img src={reading.cover_url} alt="" />}
                <span className="tag">{reading && formatDay(reading.published_at)}</span>
                <Dialog.Title className="display-lg">{reading?.title_en}</Dialog.Title>
                {(reading?.body_en || reading?.excerpt_en || "").split("\n").map((para, i) => (
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
