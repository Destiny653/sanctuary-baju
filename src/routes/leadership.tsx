import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { art } from "@/components/sanctuary/art";
import { leadersQuery } from "@/components/sanctuary/content";
import { PageHero, Shell } from "@/components/sanctuary/shell";
import { pick, useI18n } from "@/i18n";

export const Route = createFileRoute("/leadership")({
  loader: ({ context }) => context.queryClient.ensureQueryData(leadersQuery),
  head: () => ({
    meta: [
      { title: "Leadership — Our Lady of Mercy" },
      { name: "description", content: "Priests, sisters and lay people who keep the sanctuary." },
      { property: "og:title", content: "Leadership — Our Lady of Mercy" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeadershipPage,
});

function LeadershipPage() {
  const { t, lang } = useI18n();
  const { data: leaders = [] } = useQuery(leadersQuery);

  return (
    <Shell>
      {() => (
        <>
          <PageHero
            kicker={t.leadership.kicker}
            title={t.leadership.title}
            lede={t.leadership.lead}
            images={[art.mary, art.sanctuary, art.worship, art.angels]}
          />
          <section className="leaders-band band band-snow">
            {leaders.length === 0 ? (
              <p className="empty-note">{t.leadership.empty}</p>
            ) : (
              <ul className="leaders-grid">
                {leaders.map((leader) => (
                  <li key={leader.id} className="leader-card glass" data-gsap>
                    <div className="leader-photo">
                      {leader.photo_url ? (
                        <img src={leader.photo_url} alt={leader.name} loading="lazy" />
                      ) : (
                        <span className="leader-initial" aria-hidden="true">
                          {leader.name.slice(0, 1)}
                        </span>
                      )}
                    </div>
                    <div className="leader-copy">
                      <p className="kicker">{pick(leader, "role", lang)}</p>
                      <h2 className="display-md">{leader.name}</h2>
                      {pick(leader, "bio", lang) && <p className="body-copy">{pick(leader, "bio", lang)}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </Shell>
  );
}
