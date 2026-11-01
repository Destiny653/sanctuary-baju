import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Post = {
  id: string;
  kind: string;
  slug: string;
  title_en: string;
  title_fr: string;
  excerpt_en: string;
  excerpt_fr: string;
  body_en: string;
  body_fr: string;
  cover_url: string | null;
  video_url: string | null;
  published_at: string;
  event_start: string | null;
  event_location: string | null;
};

const POST_COLS =
  "id,kind,slug,title_en,title_fr,excerpt_en,excerpt_fr,body_en,body_fr,cover_url,video_url,published_at,event_start,event_location";

export const postsQuery = (kind: "news" | "event" | "life" | "all") =>
  queryOptions({
    queryKey: ["posts", kind],
    queryFn: async (): Promise<Post[]> => {
      let q = supabase.from("posts").select(POST_COLS).eq("published", true);
      if (kind !== "all") q = q.eq("kind", kind);
      const { data, error } = await q.order(kind === "event" ? "event_start" : "published_at", {
        ascending: kind === "event",
      });
      if (error) throw error;
      return data ?? [];
    },
  });

export type GalleryItem = {
  id: string;
  url: string;
  media_type: "image" | "video";
  caption_en: string;
  caption_fr: string;
  sort: number;
};

export type Album = {
  id: string;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  images: GalleryItem[];
};

export const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: async (): Promise<Album[]> => {
    const { data, error } = await supabase
      .from("gallery_albums")
      .select(
        "id,title_en,title_fr,description_en,description_fr,sort,gallery_images(id,url,media_type,caption_en,caption_fr,sort)",
      )
      .order("sort");
    if (error) throw error;
    return (data ?? []).map((a) => ({
      id: a.id,
      title_en: a.title_en,
      title_fr: a.title_fr,
      description_en: a.description_en,
      description_fr: a.description_fr,
      images: [...(a.gallery_images ?? [])]
        .map((g) => ({ ...g, media_type: (g.media_type === "video" ? "video" : "image") as GalleryItem["media_type"] }))
        .sort((x, y) => x.sort - y.sort),
    }));
  },
});

export function formatDay(iso: string, lang: "en" | "fr" = "en") {
  return new Date(iso).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
export function formatTime(iso: string, lang: "en" | "fr" = "en") {
  return new Date(iso).toLocaleTimeString(lang === "fr" ? "fr-FR" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}
