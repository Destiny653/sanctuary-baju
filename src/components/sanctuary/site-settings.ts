import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type MapDestination = {
  lat: number;
  lng: number;
  label_en: string;
  label_fr: string;
};

export const DEFAULT_MAP_DESTINATION: MapDestination = {
  lat: 5.6284,
  lng: 10.0819,
  label_en: "Sanctuary of Our Lady of Mercy — Gate House",
  label_fr: "Sanctuaire Notre-Dame de la Miséricorde — Maison de la porte",
};

export const MAP_DESTINATION_KEY = "map_destination";

function parseDestination(value: unknown): MapDestination {
  if (!value || typeof value !== "object") return DEFAULT_MAP_DESTINATION;
  const row = value as Record<string, unknown>;
  const lat = Number(row["lat"]);
  const lng = Number(row["lng"]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return DEFAULT_MAP_DESTINATION;
  const labelEn = row["label_en"];
  const labelFr = row["label_fr"];
  return {
    lat,
    lng,
    label_en: typeof labelEn === "string" && labelEn.trim() ? labelEn : DEFAULT_MAP_DESTINATION.label_en,
    label_fr: typeof labelFr === "string" && labelFr.trim() ? labelFr : DEFAULT_MAP_DESTINATION.label_fr,
  };
}

export const mapDestinationQuery = queryOptions({
  queryKey: ["site-settings", MAP_DESTINATION_KEY],
  queryFn: async (): Promise<MapDestination> => {
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      return DEFAULT_MAP_DESTINATION;
    }
    try {
      const result = await Promise.race([
        supabase.from("site_settings").select("value").eq("key", MAP_DESTINATION_KEY).maybeSingle(),
        new Promise<{ data: null; error: { message: string } }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: { message: "timeout" } }), 2500),
        ),
      ]);
      if (result.error) {
        console.warn("map destination settings", result.error.message);
        return DEFAULT_MAP_DESTINATION;
      }
      return parseDestination(result.data?.value);
    } catch (err) {
      console.warn("map destination settings", err);
      return DEFAULT_MAP_DESTINATION;
    }
  },
  staleTime: 60_000,
  networkMode: "offlineFirst",
  retry: false,
});

export async function saveMapDestination(dest: MapDestination) {
  const { error } = await supabase.from("site_settings").upsert(
    {
      key: MAP_DESTINATION_KEY,
      value: dest,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );
  if (error) throw error;
}
