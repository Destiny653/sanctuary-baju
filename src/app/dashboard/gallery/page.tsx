"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MediaField } from "@/components/dashboard/media-upload";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";

export default function DashboardGallery() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [titleEn, setTitleEn] = useState("");
  const [titleFr, setTitleFr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descFr, setDescFr] = useState("");
  const [year, setYear] = useState("");
  const [segmentDate, setSegmentDate] = useState("");
  const [albumId, setAlbumId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [captionEn, setCaptionEn] = useState("");
  const [captionFr, setCaptionFr] = useState("");

  const { data: albums = [], isLoading } = useQuery({
    queryKey: ["dash", "gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_albums")
        .select(
          "id,title_en,title_fr,description_en,description_fr,sort,gallery_images(id,url,caption_en,caption_fr,sort)",
        )
        .order("sort");
      if (error) throw error;
      return data ?? [];
    },
  });

  const createAlbum = useMutation({
    mutationFn: async () => {
      const yearNum = year.trim() ? Number(year) : null;
      if (year.trim() && (!Number.isFinite(yearNum) || (yearNum ?? 0) < 1000 || (yearNum ?? 0) > 3000)) {
        throw new Error("year");
      }
      // year / segment_date land in description until migration 0003 is applied.
      const dateNote = [yearNum, segmentDate.trim() || null].filter(Boolean).join(" · ");
      const { error } = await supabase.from("gallery_albums").insert({
        title_en: titleEn,
        title_fr: titleFr,
        description_en: [descEn, dateNote].filter(Boolean).join(descEn ? "\n" : ""),
        description_fr: [descFr, dateNote].filter(Boolean).join(descFr ? "\n" : ""),
        sort: albums.length,
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      toast.success(t.dash.saved);
      setTitleEn("");
      setTitleFr("");
      setDescEn("");
      setDescFr("");
      setYear("");
      setSegmentDate("");
      await qc.invalidateQueries({ queryKey: ["dash", "gallery"] });
      await qc.invalidateQueries({ queryKey: ["gallery"] });
      await qc.invalidateQueries({ queryKey: ["dash", "counts"] });
    },
    onError: (err) => {
      toast.error(err instanceof Error && err.message === "year" ? t.dash.invalidYear : t.dash.error);
    },
  });

  const addImage = useMutation({
    mutationFn: async () => {
      if (!albumId || !imageUrl) throw new Error("missing");
      const album = albums.find((a) => a.id === albumId);
      const { error } = await supabase.from("gallery_images").insert({
        album_id: albumId,
        url: imageUrl,
        caption_en: captionEn,
        caption_fr: captionFr,
        media_type: "image",
        sort: album?.gallery_images?.length ?? 0,
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      toast.success(t.dash.saved);
      setImageUrl(null);
      setCaptionEn("");
      setCaptionFr("");
      await qc.invalidateQueries({ queryKey: ["dash", "gallery"] });
      await qc.invalidateQueries({ queryKey: ["gallery"] });
      await qc.invalidateQueries({ queryKey: ["dash", "counts"] });
    },
    onError: () => toast.error(t.dash.error),
  });

  const removeAlbum = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("gallery_images").delete().eq("album_id", id);
      const { error } = await supabase.from("gallery_albums").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: async () => {
      toast.success(t.dash.deleted);
      await qc.invalidateQueries({ queryKey: ["dash", "gallery"] });
      await qc.invalidateQueries({ queryKey: ["gallery"] });
      await qc.invalidateQueries({ queryKey: ["dash", "counts"] });
    },
    onError: () => toast.error(t.dash.error),
  });

  return (
    <>
      <PageHeader title={t.dash.gallery} lead={t.dash.galleryLead} />
      <div className="mb-8 grid gap-4 rounded-xl border border-border bg-card p-4 md:p-6">
        <h2 className="font-display text-xl font-bold uppercase">{t.dash.newAlbum}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t.dash.albumTitle} ({t.dash.english})</Label>
            <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t.dash.albumTitle} ({t.dash.french})</Label>
            <Input value={titleFr} onChange={(e) => setTitleFr(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t.dash.albumDescription} ({t.dash.english})</Label>
            <Textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>{t.dash.albumDescription} ({t.dash.french})</Label>
            <Textarea value={descFr} onChange={(e) => setDescFr(e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>{t.dash.segmentYear}</Label>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="2024"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{t.dash.segmentDate}</Label>
            <Input type="date" value={segmentDate} onChange={(e) => setSegmentDate(e.target.value)} />
          </div>
        </div>
        <Button type="button" onClick={() => createAlbum.mutate()} disabled={!titleEn.trim() || createAlbum.isPending}>
          <Plus className="h-4 w-4" /> {t.dash.newAlbum}
        </Button>
      </div>

      <div className="mb-8 grid gap-4 rounded-xl border border-border bg-card p-4 md:p-6">
        <h2 className="font-display text-xl font-bold uppercase">{t.dash.addImages}</h2>
        <div className="space-y-2">
          <Label>{t.dash.albums}</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={albumId ?? ""}
            onChange={(e) => setAlbumId(e.target.value || null)}
          >
            <option value="">—</option>
            {albums.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title_en || a.title_fr}
              </option>
            ))}
          </select>
        </div>
        <MediaField label={t.dash.upload} kind="image" folder="gallery" value={imageUrl} onChange={setImageUrl} />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t.dash.caption} ({t.dash.english})</Label>
            <Input value={captionEn} onChange={(e) => setCaptionEn(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t.dash.caption} ({t.dash.french})</Label>
            <Input value={captionFr} onChange={(e) => setCaptionFr(e.target.value)} />
          </div>
        </div>
        <Button type="button" onClick={() => addImage.mutate()} disabled={!albumId || !imageUrl || addImage.isPending}>
          {t.dash.addImages}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">{t.common.loading}</p>
      ) : albums.length === 0 ? (
        <p className="text-muted-foreground">{t.dash.noItems}</p>
      ) : (
        <ul className="grid gap-4">
          {albums.map((album) => (
            <li key={album.id} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-display text-xl font-bold uppercase">{album.title_en || album.title_fr}</p>
                  <p className="text-sm text-muted-foreground">
                    {album.gallery_images?.length ?? 0} {t.dash.images}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (window.confirm(t.dash.confirmDelete)) removeAlbum.mutate(album.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" /> {t.dash.delete}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {(album.gallery_images ?? []).map((img) => (
                  <img key={img.id} src={img.url} alt={img.caption_en || ""} className="aspect-square rounded-md object-cover" />
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
