"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MediaField } from "@/components/dashboard/media-upload";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  DEFAULT_ABOUT_CONTENT,
  aboutContentQuery,
  saveAboutContent,
  type AboutContent,
  type AboutPerson,
  type AboutPurposePoint,
} from "@/components/sanctuary/about-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n";

function blankPerson(): AboutPerson {
  return { name: "", role_en: "", role_fr: "", bio_en: "", bio_fr: "", photo_url: null };
}

function blankPoint(): AboutPurposePoint {
  return { title_en: "", title_fr: "", text_en: "", text_fr: "" };
}

function Field({
  id,
  label,
  value,
  onChange,
  rows,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {rows ? (
        <Textarea id={id} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

export default function DashboardAbout() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const { data } = useQuery(aboutContentQuery);
  const [form, setForm] = useState<AboutContent>(DEFAULT_ABOUT_CONTENT);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const patch = <K extends keyof AboutContent>(key: K, value: AboutContent[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = useMutation({
    mutationFn: () => saveAboutContent(form),
    onSuccess: async (saved) => {
      setForm(saved);
      toast.success(t.dash.saved);
      await qc.invalidateQueries({ queryKey: aboutContentQuery.queryKey });
    },
    onError: () => toast.error(t.dash.error),
  });

  return (
    <>
      <PageHeader
        title={t.dash.about}
        lead={t.dash.aboutLead}
        action={
          <Button type="button" onClick={() => save.mutate()} disabled={save.isPending}>
            {t.dash.save}
          </Button>
        }
      />

      <div className="mx-auto flex max-w-4xl flex-col gap-8 pb-16">
        <section className="space-y-4 rounded-xl border border-border bg-card p-4 md:p-6">
          <h2 className="font-display text-lg font-semibold uppercase tracking-widest">{t.dash.aboutHero}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field id="hero_kicker_en" label={`${t.dash.aboutKicker} (${t.dash.english})`} value={form.hero_kicker_en} onChange={(v) => patch("hero_kicker_en", v)} />
            <Field id="hero_kicker_fr" label={`${t.dash.aboutKicker} (${t.dash.french})`} value={form.hero_kicker_fr} onChange={(v) => patch("hero_kicker_fr", v)} />
            <Field id="hero_title_en" label={`${t.dash.fieldTitle} (${t.dash.english})`} value={form.hero_title_en} onChange={(v) => patch("hero_title_en", v)} />
            <Field id="hero_title_fr" label={`${t.dash.fieldTitle} (${t.dash.french})`} value={form.hero_title_fr} onChange={(v) => patch("hero_title_fr", v)} />
            <Field id="hero_lead_en" label={`${t.dash.fieldExcerpt} (${t.dash.english})`} value={form.hero_lead_en} onChange={(v) => patch("hero_lead_en", v)} rows={4} />
            <Field id="hero_lead_fr" label={`${t.dash.fieldExcerpt} (${t.dash.french})`} value={form.hero_lead_fr} onChange={(v) => patch("hero_lead_fr", v)} rows={4} />
          </div>
          <MediaField label={t.dash.aboutFigure} kind="image" folder="about" value={form.figure_url} onChange={(url) => patch("figure_url", url)} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field id="figure_caption_en" label={`${t.dash.caption} (${t.dash.english})`} value={form.figure_caption_en} onChange={(v) => patch("figure_caption_en", v)} />
            <Field id="figure_caption_fr" label={`${t.dash.caption} (${t.dash.french})`} value={form.figure_caption_fr} onChange={(v) => patch("figure_caption_fr", v)} />
            <Field id="quote_en" label={`${t.dash.aboutQuote} (${t.dash.english})`} value={form.quote_en} onChange={(v) => patch("quote_en", v)} rows={2} />
            <Field id="quote_fr" label={`${t.dash.aboutQuote} (${t.dash.french})`} value={form.quote_fr} onChange={(v) => patch("quote_fr", v)} rows={2} />
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-card p-4 md:p-6">
          <h2 className="font-display text-lg font-semibold uppercase tracking-widest">{t.dash.aboutMission}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field id="mission_kicker_en" label={`${t.dash.aboutKicker} (${t.dash.english})`} value={form.mission_kicker_en} onChange={(v) => patch("mission_kicker_en", v)} />
            <Field id="mission_kicker_fr" label={`${t.dash.aboutKicker} (${t.dash.french})`} value={form.mission_kicker_fr} onChange={(v) => patch("mission_kicker_fr", v)} />
            <Field id="mission_title_en" label={`${t.dash.fieldTitle} (${t.dash.english})`} value={form.mission_title_en} onChange={(v) => patch("mission_title_en", v)} />
            <Field id="mission_title_fr" label={`${t.dash.fieldTitle} (${t.dash.french})`} value={form.mission_title_fr} onChange={(v) => patch("mission_title_fr", v)} />
            <Field id="mission_body_en" label={`${t.dash.fieldBody} (${t.dash.english})`} value={form.mission_body_en} onChange={(v) => patch("mission_body_en", v)} rows={8} />
            <Field id="mission_body_fr" label={`${t.dash.fieldBody} (${t.dash.french})`} value={form.mission_body_fr} onChange={(v) => patch("mission_body_fr", v)} rows={8} />
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-card p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold uppercase tracking-widest">{t.dash.aboutPurpose}</h2>
            <Button
              type="button"
              variant="outline"
              onClick={() => patch("purpose_points", [...form.purpose_points, blankPoint()])}
            >
              <Plus className="h-4 w-4" /> {t.dash.newItem}
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field id="purpose_kicker_en" label={`${t.dash.aboutKicker} (${t.dash.english})`} value={form.purpose_kicker_en} onChange={(v) => patch("purpose_kicker_en", v)} />
            <Field id="purpose_kicker_fr" label={`${t.dash.aboutKicker} (${t.dash.french})`} value={form.purpose_kicker_fr} onChange={(v) => patch("purpose_kicker_fr", v)} />
            <Field id="purpose_title_en" label={`${t.dash.fieldTitle} (${t.dash.english})`} value={form.purpose_title_en} onChange={(v) => patch("purpose_title_en", v)} />
            <Field id="purpose_title_fr" label={`${t.dash.fieldTitle} (${t.dash.french})`} value={form.purpose_title_fr} onChange={(v) => patch("purpose_title_fr", v)} />
            <Field id="purpose_lead_en" label={`${t.dash.fieldExcerpt} (${t.dash.english})`} value={form.purpose_lead_en} onChange={(v) => patch("purpose_lead_en", v)} rows={3} />
            <Field id="purpose_lead_fr" label={`${t.dash.fieldExcerpt} (${t.dash.french})`} value={form.purpose_lead_fr} onChange={(v) => patch("purpose_lead_fr", v)} rows={3} />
          </div>
          {form.purpose_points.map((point, index) => (
            <div key={index} className="space-y-3 rounded-lg border border-border/80 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {t.dash.aboutPurposePoint} {index + 1}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => patch("purpose_points", form.purpose_points.filter((_, i) => i !== index))}
                  disabled={form.purpose_points.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Field
                  id={`point_title_en_${index}`}
                  label={`${t.dash.fieldTitle} (${t.dash.english})`}
                  value={point.title_en}
                  onChange={(v) =>
                    patch(
                      "purpose_points",
                      form.purpose_points.map((item, i) => (i === index ? { ...item, title_en: v } : item)),
                    )
                  }
                />
                <Field
                  id={`point_title_fr_${index}`}
                  label={`${t.dash.fieldTitle} (${t.dash.french})`}
                  value={point.title_fr}
                  onChange={(v) =>
                    patch(
                      "purpose_points",
                      form.purpose_points.map((item, i) => (i === index ? { ...item, title_fr: v } : item)),
                    )
                  }
                />
                <Field
                  id={`point_text_en_${index}`}
                  label={`${t.dash.fieldBody} (${t.dash.english})`}
                  value={point.text_en}
                  onChange={(v) =>
                    patch(
                      "purpose_points",
                      form.purpose_points.map((item, i) => (i === index ? { ...item, text_en: v } : item)),
                    )
                  }
                  rows={3}
                />
                <Field
                  id={`point_text_fr_${index}`}
                  label={`${t.dash.fieldBody} (${t.dash.french})`}
                  value={point.text_fr}
                  onChange={(v) =>
                    patch(
                      "purpose_points",
                      form.purpose_points.map((item, i) => (i === index ? { ...item, text_fr: v } : item)),
                    )
                  }
                  rows={3}
                />
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-card p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold uppercase tracking-widest">{t.dash.aboutFounders}</h2>
            <Button type="button" variant="outline" onClick={() => patch("founders", [...form.founders, blankPerson()])}>
              <Plus className="h-4 w-4" /> {t.dash.newItem}
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field id="founders_kicker_en" label={`${t.dash.aboutKicker} (${t.dash.english})`} value={form.founders_kicker_en} onChange={(v) => patch("founders_kicker_en", v)} />
            <Field id="founders_kicker_fr" label={`${t.dash.aboutKicker} (${t.dash.french})`} value={form.founders_kicker_fr} onChange={(v) => patch("founders_kicker_fr", v)} />
            <Field id="founders_title_en" label={`${t.dash.fieldTitle} (${t.dash.english})`} value={form.founders_title_en} onChange={(v) => patch("founders_title_en", v)} />
            <Field id="founders_title_fr" label={`${t.dash.fieldTitle} (${t.dash.french})`} value={form.founders_title_fr} onChange={(v) => patch("founders_title_fr", v)} />
            <Field id="founders_lead_en" label={`${t.dash.fieldExcerpt} (${t.dash.english})`} value={form.founders_lead_en} onChange={(v) => patch("founders_lead_en", v)} rows={3} />
            <Field id="founders_lead_fr" label={`${t.dash.fieldExcerpt} (${t.dash.french})`} value={form.founders_lead_fr} onChange={(v) => patch("founders_lead_fr", v)} rows={3} />
          </div>
          {form.founders.map((person, index) => (
            <div key={index} className="space-y-3 rounded-lg border border-border/80 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {t.dash.aboutFounder} {index + 1}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => patch("founders", form.founders.filter((_, i) => i !== index))}
                  disabled={form.founders.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <MediaField
                label={t.dash.fieldPhoto}
                kind="image"
                folder="about"
                value={person.photo_url}
                onChange={(url) =>
                  patch(
                    "founders",
                    form.founders.map((item, i) => (i === index ? { ...item, photo_url: url } : item)),
                  )
                }
              />
              <div className="grid gap-3 md:grid-cols-2">
                <Field
                  id={`founder_name_${index}`}
                  label={t.dash.fieldName}
                  value={person.name}
                  onChange={(v) =>
                    patch(
                      "founders",
                      form.founders.map((item, i) => (i === index ? { ...item, name: v } : item)),
                    )
                  }
                />
                <div />
                <Field
                  id={`founder_role_en_${index}`}
                  label={`${t.dash.fieldRole} (${t.dash.english})`}
                  value={person.role_en}
                  onChange={(v) =>
                    patch(
                      "founders",
                      form.founders.map((item, i) => (i === index ? { ...item, role_en: v } : item)),
                    )
                  }
                />
                <Field
                  id={`founder_role_fr_${index}`}
                  label={`${t.dash.fieldRole} (${t.dash.french})`}
                  value={person.role_fr}
                  onChange={(v) =>
                    patch(
                      "founders",
                      form.founders.map((item, i) => (i === index ? { ...item, role_fr: v } : item)),
                    )
                  }
                />
                <Field
                  id={`founder_bio_en_${index}`}
                  label={`${t.dash.fieldBio} (${t.dash.english})`}
                  value={person.bio_en}
                  onChange={(v) =>
                    patch(
                      "founders",
                      form.founders.map((item, i) => (i === index ? { ...item, bio_en: v } : item)),
                    )
                  }
                  rows={4}
                />
                <Field
                  id={`founder_bio_fr_${index}`}
                  label={`${t.dash.fieldBio} (${t.dash.french})`}
                  value={person.bio_fr}
                  onChange={(v) =>
                    patch(
                      "founders",
                      form.founders.map((item, i) => (i === index ? { ...item, bio_fr: v } : item)),
                    )
                  }
                  rows={4}
                />
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-card p-4 md:p-6">
          <h2 className="font-display text-lg font-semibold uppercase tracking-widest">{t.dash.aboutBlessing}</h2>
          <MediaField
            label={t.dash.fieldPhoto}
            kind="image"
            folder="about"
            value={form.blessing_photo_url}
            onChange={(url) => patch("blessing_photo_url", url)}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Field id="blessing_kicker_en" label={`${t.dash.aboutKicker} (${t.dash.english})`} value={form.blessing_kicker_en} onChange={(v) => patch("blessing_kicker_en", v)} />
            <Field id="blessing_kicker_fr" label={`${t.dash.aboutKicker} (${t.dash.french})`} value={form.blessing_kicker_fr} onChange={(v) => patch("blessing_kicker_fr", v)} />
            <Field id="blessing_title_en" label={`${t.dash.fieldTitle} (${t.dash.english})`} value={form.blessing_title_en} onChange={(v) => patch("blessing_title_en", v)} />
            <Field id="blessing_title_fr" label={`${t.dash.fieldTitle} (${t.dash.french})`} value={form.blessing_title_fr} onChange={(v) => patch("blessing_title_fr", v)} />
            <Field id="blessing_name" label={t.dash.fieldName} value={form.blessing_name} onChange={(v) => patch("blessing_name", v)} />
            <div />
            <Field id="blessing_role_en" label={`${t.dash.fieldRole} (${t.dash.english})`} value={form.blessing_role_en} onChange={(v) => patch("blessing_role_en", v)} />
            <Field id="blessing_role_fr" label={`${t.dash.fieldRole} (${t.dash.french})`} value={form.blessing_role_fr} onChange={(v) => patch("blessing_role_fr", v)} />
            <Field id="blessing_date_en" label={`${t.dash.aboutBlessingDate} (${t.dash.english})`} value={form.blessing_date_en} onChange={(v) => patch("blessing_date_en", v)} />
            <Field id="blessing_date_fr" label={`${t.dash.aboutBlessingDate} (${t.dash.french})`} value={form.blessing_date_fr} onChange={(v) => patch("blessing_date_fr", v)} />
            <Field id="blessing_body_en" label={`${t.dash.fieldBody} (${t.dash.english})`} value={form.blessing_body_en} onChange={(v) => patch("blessing_body_en", v)} rows={7} />
            <Field id="blessing_body_fr" label={`${t.dash.fieldBody} (${t.dash.french})`} value={form.blessing_body_fr} onChange={(v) => patch("blessing_body_fr", v)} rows={7} />
          </div>
        </section>

        <div className="flex justify-end">
          <Button type="button" onClick={() => save.mutate()} disabled={save.isPending}>
            {t.dash.save}
          </Button>
        </div>
      </div>
    </>
  );
}
