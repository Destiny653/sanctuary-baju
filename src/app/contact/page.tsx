"use client";

import { art } from "@/components/sanctuary/art";
import { ContactCompose, ContactVisit } from "@/components/sanctuary/contact";
import { PageHero, Shell } from "@/components/sanctuary/shell";
import { Intentions } from "@/components/sanctuary/story";
import { useI18n } from "@/i18n";

export default function ContactPage() {
  const { t } = useI18n();
  return (
    <Shell>
      {(book) => (
        <>
          <PageHero
            kicker={t.contact.kicker}
            title={t.pages.contactHeroTitle}
            lede={t.pages.contactHeroLead}
            images={[art.hands, art.face, art.evangelCall, art.dawn]}
          />
          <ContactCompose />
          <ContactVisit book={book} />
          <Intentions book={book} />
        </>
      )}
    </Shell>
  );
}
