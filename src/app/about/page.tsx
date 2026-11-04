"use client";

import { useQuery } from "@tanstack/react-query";
import { art } from "@/components/sanctuary/art";
import { aboutContentQuery, DEFAULT_ABOUT_CONTENT } from "@/components/sanctuary/about-content";
import { AboutPageBody } from "@/components/sanctuary/about-page";
import { PageHero, Shell } from "@/components/sanctuary/shell";
import { pick, useI18n } from "@/i18n";

export default function AboutPage() {
  const { lang } = useI18n();
  const { data = DEFAULT_ABOUT_CONTENT } = useQuery(aboutContentQuery);

  return (
    <Shell>
      {() => (
        <>
          <PageHero
            kicker={pick(data, "hero_kicker", lang)}
            title={pick(data, "hero_title", lang)}
            lede={pick(data, "hero_lead", lang)}
            images={[art.mountOfMary, art.mountOfJesus, art.mountaintopOfMary, art.mountaintopOfJesus]}
          />
          <AboutPageBody />
        </>
      )}
    </Shell>
  );
}
