import { createFileRoute } from "@tanstack/react-router";
import { art } from "@/components/sanctuary/art";
import { About } from "@/components/sanctuary/story";
import { PageHero, Shell } from "@/components/sanctuary/shell";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Our Lady of Mercy" },
      {
        name: "description",
        content: "The sanctuary of Our Lady of Mercy: a house of prayer between two mountains.",
      },
      { property: "og:title", content: "About — Our Lady of Mercy" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useI18n();
  return (
    <Shell>
      {() => (
        <>
          <PageHero
            kicker={t.about.kicker}
            title={t.about.title}
            lede={t.about.lead}
            images={[art.sanctuary, art.mountains, art.worship, art.dawn]}
          />
          <About />
        </>
      )}
    </Shell>
  );
}
