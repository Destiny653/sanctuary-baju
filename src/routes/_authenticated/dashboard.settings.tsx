import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_MAP_DESTINATION,
  mapDestinationQuery,
  saveMapDestination,
  type MapDestination,
} from "@/components/sanctuary/site-settings";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  component: DashboardSettings,
});

function DashboardSettings() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const { data } = useQuery(mapDestinationQuery);
  const [form, setForm] = useState<MapDestination>(DEFAULT_MAP_DESTINATION);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = useMutation({
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

  return (
    <>
      <PageHeader title={t.mapSettings.title} lead={t.mapSettings.lead} />
      <div className="mx-auto grid max-w-2xl gap-4 rounded-xl border border-border bg-card p-4 md:p-6">
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
        <Button type="button" onClick={() => save.mutate()} disabled={save.isPending}>
          {t.mapSettings.save}
        </Button>
      </div>
    </>
  );
}
