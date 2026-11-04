"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  applyDisplayFont,
  DEFAULT_DISPLAY_FONT,
  DEFAULT_MAP_DESTINATION,
  DISPLAY_FONT_OPTIONS,
  displayFontQuery,
  mapDestinationQuery,
  saveDisplayFont,
  saveMapDestination,
  type DisplayFontId,
  type MapDestination,
} from "@/components/sanctuary/site-settings";
import { useI18n } from "@/i18n";

export default function DashboardSettings() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const { data } = useQuery(mapDestinationQuery);
  const { data: displayFont = DEFAULT_DISPLAY_FONT } = useQuery(displayFontQuery);
  const [form, setForm] = useState<MapDestination>(DEFAULT_MAP_DESTINATION);
  const [font, setFont] = useState<DisplayFontId>(DEFAULT_DISPLAY_FONT);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  useEffect(() => {
    setFont(displayFont);
  }, [displayFont]);

  const saveMap = useMutation({
    mutationFn: async () => {
      const lat = Number(form.lat);
      const lng = Number(form.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error("invalid");
      }
      await saveMapDestination({
        lat,
        lng,
        label_en: form.label_en.trim() || DEFAULT_MAP_DESTINATION.label_en,
        label_fr: form.label_fr.trim() || DEFAULT_MAP_DESTINATION.label_fr,
      });
    },
    onSuccess: async () => {
      toast.success(t.mapSettings.saved);
      await qc.invalidateQueries({ queryKey: mapDestinationQuery.queryKey });
    },
    onError: (err) => {
      toast.error(err instanceof Error && err.message === "invalid" ? t.mapSettings.invalid : t.dash.error);
    },
  });

  const saveFont = useMutation({
    mutationFn: async () => {
      await saveDisplayFont(font);
    },
    onSuccess: async () => {
      toast.success(t.fontSettings.saved);
      await qc.invalidateQueries({ queryKey: displayFontQuery.queryKey });
    },
    onError: () => {
      toast.error(t.dash.error);
    },
  });

  return (
    <>
      <PageHeader title={t.dash.settings} lead={t.fontSettings.pageLead} />

      <div className="mx-auto mb-8 grid max-w-2xl gap-4 rounded-xl border border-border bg-card p-4 md:p-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{t.fontSettings.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.fontSettings.lead}</p>
        </div>
        <RadioGroup
          value={font}
          onValueChange={(value) => {
            const id = value as DisplayFontId;
            setFont(id);
            applyDisplayFont(id);
          }}
          className="grid gap-3"
        >
          {DISPLAY_FONT_OPTIONS.map((option) => (
            <label
              key={option.id}
              htmlFor={`display-font-${option.id}`}
              className="flex cursor-pointer gap-3 rounded-lg border border-border p-3 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
            >
              <RadioGroupItem id={`display-font-${option.id}`} value={option.id} className="mt-1" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{option.label}</span>
                <span
                  className="mt-2 block text-2xl leading-tight text-foreground"
                  style={{ fontFamily: option.stack }}
                >
                  Our Lady of Mercy
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">{option.note}</span>
              </span>
            </label>
          ))}
        </RadioGroup>
        <Button type="button" onClick={() => saveFont.mutate()} disabled={saveFont.isPending || font === displayFont}>
          {t.fontSettings.save}
        </Button>
      </div>

      <div className="mx-auto grid max-w-2xl gap-4 rounded-xl border border-border bg-card p-4 md:p-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{t.mapSettings.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.mapSettings.lead}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="lat">{t.mapSettings.lat}</Label>
            <Input
              id="lat"
              type="number"
              step="any"
              value={form.lat}
              onChange={(e) => setForm((f) => ({ ...f, lat: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lng">{t.mapSettings.lng}</Label>
            <Input
              id="lng"
              type="number"
              step="any"
              value={form.lng}
              onChange={(e) => setForm((f) => ({ ...f, lng: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="label_en">{t.mapSettings.labelEn}</Label>
            <Input
              id="label_en"
              value={form.label_en}
              onChange={(e) => setForm((f) => ({ ...f, label_en: e.target.value }))}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="label_fr">{t.mapSettings.labelFr}</Label>
            <Input
              id="label_fr"
              value={form.label_fr}
              onChange={(e) => setForm((f) => ({ ...f, label_fr: e.target.value }))}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {form.lat.toFixed(5)}, {form.lng.toFixed(5)}
        </p>
        <Button type="button" onClick={() => saveMap.mutate()} disabled={saveMap.isPending}>
          {t.mapSettings.save}
        </Button>
      </div>
    </>
  );
}
