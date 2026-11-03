"use client";

import { art } from "@/components/sanctuary/art";
import { About } from "@/components/sanctuary/story";
import { PageHero, Shell } from "@/components/sanctuary/shell";
import { useI18n } from "@/i18n";

export default function AboutPage() {
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
