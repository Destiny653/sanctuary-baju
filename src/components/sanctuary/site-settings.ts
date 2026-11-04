import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Heading / brand display fonts — switched from the dashboard. */
export const DISPLAY_FONT_IDS = ["coachella", "talesha", "cormorant"] as const;
export type DisplayFontId = (typeof DISPLAY_FONT_IDS)[number];

export const DEFAULT_DISPLAY_FONT: DisplayFontId = "coachella";
export const DISPLAY_FONT_KEY = "display_font";
const DISPLAY_FONT_LOCAL = "olm-display-font";

export const DISPLAY_FONT_OPTIONS: {
  id: DisplayFontId;
  label: string;
  note: string;
  stack: string;
}[] = [
  {
    id: "coachella",
    label: "Coachella",
    note: "Modern high-contrast serif (MadeType). Drop licensed files in /fonts/coachella.",
    stack: '"Coachella", var(--font-coachella-fallback), "Playfair Display", Georgia, serif',
  },
  {
    id: "talesha",
    label: "Talesha",
    note: "Editorial serif. Drop licensed files in /fonts/talesha.",
    stack: '"Talesha", var(--font-display-fallback), "Cormorant Garamond", Georgia, serif',
  },
  {
    id: "cormorant",
    label: "Cormorant Garamond",
    note: "Soft bookish serif via Google Fonts — always available.",
    stack: 'var(--font-display-fallback), "Cormorant Garamond", Georgia, serif',
  },
];

export function isDisplayFontId(value: unknown): value is DisplayFontId {
  return typeof value === "string" && (DISPLAY_FONT_IDS as readonly string[]).includes(value);
}

export function readLocalDisplayFont(): DisplayFontId | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(DISPLAY_FONT_LOCAL);
    return isDisplayFontId(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function writeLocalDisplayFont(id: DisplayFontId) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(DISPLAY_FONT_LOCAL, id);
  } catch {
    /* ignore quota */
  }
}

export function applyDisplayFont(id: DisplayFontId) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.displayFont = id;
  writeLocalDisplayFont(id);
}

function parseDisplayFont(value: unknown): DisplayFontId {
  if (isDisplayFontId(value)) return value;
  if (value && typeof value === "object") {
    const id = (value as Record<string, unknown>)["id"];
    if (isDisplayFontId(id)) return id;
  }
  return DEFAULT_DISPLAY_FONT;
}

export const displayFontQuery = queryOptions({
  queryKey: ["site-settings", DISPLAY_FONT_KEY],
  queryFn: async (): Promise<DisplayFontId> => {
    const cached = readLocalDisplayFont();
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      return cached ?? DEFAULT_DISPLAY_FONT;
    }
    try {
      const result = await Promise.race([
        supabase.from("site_settings").select("value").eq("key", DISPLAY_FONT_KEY).maybeSingle(),
        new Promise<{ data: null; error: { message: string } }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: { message: "timeout" } }), 2500),
        ),
      ]);
      if (result.error) {
        console.warn("display font settings", result.error.message);
        return cached ?? DEFAULT_DISPLAY_FONT;
      }
      if (result.data?.value == null) return cached ?? DEFAULT_DISPLAY_FONT;
      return parseDisplayFont(result.data.value);
    } catch (err) {
      console.warn("display font settings", err);
      return cached ?? DEFAULT_DISPLAY_FONT;
    }
  },
  staleTime: 60_000,
  networkMode: "offlineFirst",
  retry: false,
});

export async function saveDisplayFont(id: DisplayFontId) {
  applyDisplayFont(id);
  const { error } = await supabase.from("site_settings").upsert(
    {
      key: DISPLAY_FONT_KEY,
      value: { id },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );
  if (error) throw error;
}

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
