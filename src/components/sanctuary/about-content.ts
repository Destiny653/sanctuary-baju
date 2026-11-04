import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AboutPerson = {
  name: string;
  role_en: string;
  role_fr: string;
  bio_en: string;
  bio_fr: string;
  photo_url: string | null;
};

export type AboutPurposePoint = {
  title_en: string;
  title_fr: string;
  text_en: string;
  text_fr: string;
};

export type AboutContent = {
  hero_kicker_en: string;
  hero_kicker_fr: string;
  hero_title_en: string;
  hero_title_fr: string;
  hero_lead_en: string;
  hero_lead_fr: string;
  mission_kicker_en: string;
  mission_kicker_fr: string;
  mission_title_en: string;
  mission_title_fr: string;
  mission_body_en: string;
  mission_body_fr: string;
  purpose_kicker_en: string;
  purpose_kicker_fr: string;
  purpose_title_en: string;
  purpose_title_fr: string;
  purpose_lead_en: string;
  purpose_lead_fr: string;
  purpose_points: AboutPurposePoint[];
  founders_kicker_en: string;
  founders_kicker_fr: string;
  founders_title_en: string;
  founders_title_fr: string;
  founders_lead_en: string;
  founders_lead_fr: string;
  founders: AboutPerson[];
  blessing_kicker_en: string;
  blessing_kicker_fr: string;
  blessing_title_en: string;
  blessing_title_fr: string;
  blessing_name: string;
  blessing_role_en: string;
  blessing_role_fr: string;
  blessing_date_en: string;
  blessing_date_fr: string;
  blessing_body_en: string;
  blessing_body_fr: string;
  blessing_photo_url: string | null;
  quote_en: string;
  quote_fr: string;
  figure_caption_en: string;
  figure_caption_fr: string;
  figure_url: string | null;
};

export const ABOUT_CONTENT_KEY = "about_page";
const LOCAL_KEY = "olm-about-page";

/** Seed content for the About page — editable from the dashboard. */
export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  hero_kicker_en: "About the sanctuary",
  hero_kicker_fr: "À propos du sanctuaire",
  hero_title_en: "Why this house of mercy stands",
  hero_title_fr: "Pourquoi cette maison de miséricorde se dresse",
  hero_lead_en:
    "The Sanctuary of Our Lady of Mercy was raised so pilgrims could meet Christ and His Blessed Mother in silence, prayer and pilgrimage — without charge at the door, and without hurry on the path.",
  hero_lead_fr:
    "Le Sanctuaire Notre-Dame de la Miséricorde a été élevé pour que les pèlerins puissent rencontrer le Christ et sa Mère bénie dans le silence, la prière et le pèlerinage — sans rien à payer à la porte, et sans précipitation sur le chemin.",

  mission_kicker_en: "Our mission",
  mission_kicker_fr: "Notre mission",
  mission_title_en: "A place of encounter",
  mission_title_fr: "Un lieu de rencontre",
  mission_body_en:
    "The mission of this sanctuary is to keep a living house of mercy where the Gospel is walked, Mary is honoured, and every pilgrim may arrive as they are.\n\nWe exist to welcome the weary, to accompany those who seek healing, and to offer a landscape of prayer between two mountains and a waterfall — a Way of the Cross on one side, a living rosary on the other.\n\nNothing is sold along the paths. The house keeps the hours; it does not keep an account.",
  mission_body_fr:
    "La mission de ce sanctuaire est de garder une maison vivante de miséricorde où l'Évangile se marche, où Marie est honorée, et où chaque pèlerin peut arriver tel qu'il est.\n\nNous existons pour accueillir les fatigués, accompagner ceux qui cherchent la guérison, et offrir un paysage de prière entre deux montagnes et une cascade — un chemin de croix d'un côté, un rosaire vivant de l'autre.\n\nRien n'est vendu le long des chemins. La maison garde les heures ; elle ne tient pas de comptes.",

  purpose_kicker_en: "Why it was created",
  purpose_kicker_fr: "Pourquoi il a été créé",
  purpose_title_en: "Born from a need for prayer in the hills",
  purpose_title_fr: "Né d'un besoin de prière dans les collines",
  purpose_lead_en:
    "The sanctuary was founded so families, schools, parishes and solitary pilgrims would have a dedicated ground of encounter — not a tourist site, but a Catholic house of pilgrimage rooted in Cameroon’s green hills.",
  purpose_lead_fr:
    "Le sanctuaire a été fondé pour que les familles, les écoles, les paroisses et les pèlerins solitaires aient un terrain dédié à la rencontre — non un site touristique, mais une maison catholique de pèlerinage enracinée dans les collines vertes du Cameroun.",
  purpose_points: [
    {
      title_en: "Encounter with Christ",
      title_fr: "Rencontre avec le Christ",
      text_en: "The Mount of Calvary was shaped so the Passion could be walked with the body as well as the heart — fourteen stations climbing toward the Cross.",
      text_fr: "Le mont du Calvaire a été façonné pour que la Passion se marche avec le corps autant qu'avec le cœur — quatorze stations montant vers la Croix.",
    },
    {
      title_en: "Devotion to Mary",
      title_fr: "Dévotion à Marie",
      text_en: "The Mount of Mary gathers the mysteries of the rosary in the open air, so pilgrims may pray where the sky and the earth meet.",
      text_fr: "Le mont de Marie rassemble les mystères du rosaire à ciel ouvert, pour que les pèlerins prient là où le ciel et la terre se rejoignent.",
    },
    {
      title_en: "A door without a fee",
      title_fr: "Une porte sans tarif",
      text_en: "From the beginning the founders insisted: welcome is free. Mercy is not a ticket. Chairs, shade and silence are offered to whoever arrives.",
      text_fr: "Dès le début les fondateurs ont insisté : l'accueil est libre. La miséricorde n'est pas un billet. Chaises, ombre et silence sont offerts à quiconque arrive.",
    },
  ],

  founders_kicker_en: "The founders",
  founders_kicker_fr: "Les fondateurs",
  founders_title_en: "Those who initiated the construction",
  founders_title_fr: "Ceux qui ont initié la construction",
  founders_lead_en:
    "The sanctuary rose through the faith of a priest who carried the vision, and of lay faithful who gave land, labour and perseverance until the twin mountains could receive pilgrims.",
  founders_lead_fr:
    "Le sanctuaire s'est élevé grâce à la foi d'un prêtre qui portait la vision, et de laïcs fidèles qui ont donné terre, travail et persévérance jusqu'à ce que les deux montagnes puissent accueillir les pèlerins.",
  founders: [
    {
      name: "Father Jean-Baptiste Ngu",
      role_en: "Founding priest & spiritual initiator",
      role_fr: "Prêtre fondateur et initiateur spirituel",
      bio_en:
        "Father Ngu first envisioned a sanctuary of mercy between the hills — a place where the Way of the Cross and the rosary would be lived outdoors. He gathered the first workers, formed the plan of the twin mountains, and kept the project under the protection of Our Lady of Mercy.",
      bio_fr:
        "Le Père Ngu a d'abord envisagé un sanctuaire de miséricorde entre les collines — un lieu où le chemin de croix et le rosaire seraient vécus en plein air. Il a rassemblé les premiers ouvriers, formé le plan des deux montagnes, et gardé le projet sous la protection de Notre-Dame de la Miséricorde.",
      photo_url: null,
    },
    {
      name: "Mama Thérèse Atemnkeng",
      role_en: "Founding matron & land steward",
      role_fr: "Matrone fondatrice et gardienne de la terre",
      bio_en:
        "Mama Thérèse opened the way for the sanctuary on ancestral ground. She coordinated the women who fed the builders, kept the accounts of charity without shame, and insisted that the gate remain free for the poor and the pilgrim alike.",
      bio_fr:
        "Mama Thérèse a ouvert la voie du sanctuaire sur une terre ancestrale. Elle a coordonné les femmes qui nourrissaient les bâtisseurs, tenu les comptes de la charité sans honte, et insisté pour que la porte reste libre pour les pauvres comme pour les pèlerins.",
      photo_url: null,
    },
    {
      name: "Elder Paul Atemnkeng",
      role_en: "Founding elder & builder of the paths",
      role_fr: "Ancien fondateur et bâtisseur des chemins",
      bio_en:
        "Elder Paul led the first clearing of the red-earth paths, the stations and the Marian shrines. With local craftsmen he raised the early chapels and shaped the pilgrim routes that still climb from the waterfall to each summit.",
      bio_fr:
        "L'ancien Paul a conduit le premier défrichement des chemins de terre rouge, des stations et des oratoires marials. Avec les artisans locaux il a élevé les premières chapelles et façonné les routes de pèlerinage qui montent encore de la cascade à chaque sommet.",
      photo_url: null,
    },
  ],

  blessing_kicker_en: "The blessing",
  blessing_kicker_fr: "La bénédiction",
  blessing_title_en: "The one who blessed the sanctuary",
  blessing_title_fr: "Celui qui a béni le sanctuaire",
  blessing_name: "His Lordship Bishop Francis Ndi",
  blessing_role_en: "Bishop who blessed and dedicated the sanctuary",
  blessing_role_fr: "Évêque qui a béni et dédié le sanctuaire",
  blessing_date_en: "Solemn blessing — feast of Our Lady of Mercy",
  blessing_date_fr: "Bénédiction solennelle — fête de Notre-Dame de la Miséricorde",
  blessing_body_en:
    "Bishop Francis Ndi blessed the sanctuary and dedicated its twin mountains to the glory of God and the honour of the Blessed Virgin Mary. In his prayer he asked that every pilgrim who climbs these hills might find mercy, conversion and peace — and that the house remain open to all who seek Christ.\n\nUnder that blessing the chapel, the stations and the Marian path were set apart for sacred use. The sanctuary continues under the same intention: a free door, a walking Gospel, and a mother who waits.",
  blessing_body_fr:
    "Mgr Francis Ndi a béni le sanctuaire et dédié ses deux montagnes à la gloire de Dieu et à l'honneur de la Bienheureuse Vierge Marie. Dans sa prière il a demandé que chaque pèlerin qui gravit ces collines trouve miséricorde, conversion et paix — et que la maison reste ouverte à tous ceux qui cherchent le Christ.\n\nSous cette bénédiction la chapelle, les stations et le chemin marial ont été réservés au culte. Le sanctuaire poursuit la même intention : une porte libre, un Évangile marchand, et une mère qui attend.",
  blessing_photo_url: null,

  quote_en: "Come as you are. The house is not keeping score.",
  quote_fr: "Venez comme vous êtes. La maison ne compte pas les points.",
  figure_caption_en: "The chapel above still water — house of encounter",
  figure_caption_fr: "La chapelle au-dessus de l'eau calme — maison de rencontre",
  figure_url: null,
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function field(row: Record<string, unknown>, key: string, fallback: string) {
  return asString(row[key], fallback);
}

function asPerson(value: unknown, fallback: AboutPerson): AboutPerson {
  if (!value || typeof value !== "object") return fallback;
  const row = value as Record<string, unknown>;
  const photo = row["photo_url"];
  return {
    name: field(row, "name", fallback.name),
    role_en: field(row, "role_en", fallback.role_en),
    role_fr: field(row, "role_fr", fallback.role_fr),
    bio_en: field(row, "bio_en", fallback.bio_en),
    bio_fr: field(row, "bio_fr", fallback.bio_fr),
    photo_url: typeof photo === "string" && photo.trim() ? photo : null,
  };
}

function asPoint(value: unknown, fallback: AboutPurposePoint): AboutPurposePoint {
  if (!value || typeof value !== "object") return fallback;
  const row = value as Record<string, unknown>;
  return {
    title_en: field(row, "title_en", fallback.title_en),
    title_fr: field(row, "title_fr", fallback.title_fr),
    text_en: field(row, "text_en", fallback.text_en),
    text_fr: field(row, "text_fr", fallback.text_fr),
  };
}

export function parseAboutContent(value: unknown): AboutContent {
  if (!value || typeof value !== "object") return DEFAULT_ABOUT_CONTENT;
  const row = value as Record<string, unknown>;
  const d = DEFAULT_ABOUT_CONTENT;
  const defaultFounder = d.founders[0]!;
  const defaultPoint = d.purpose_points[0]!;
  const foundersRaw = Array.isArray(row["founders"]) ? row["founders"] : d.founders;
  const pointsRaw = Array.isArray(row["purpose_points"]) ? row["purpose_points"] : d.purpose_points;
  const blessingPhoto = row["blessing_photo_url"];
  const figureUrl = row["figure_url"];
  return {
    hero_kicker_en: field(row, "hero_kicker_en", d.hero_kicker_en),
    hero_kicker_fr: field(row, "hero_kicker_fr", d.hero_kicker_fr),
    hero_title_en: field(row, "hero_title_en", d.hero_title_en),
    hero_title_fr: field(row, "hero_title_fr", d.hero_title_fr),
    hero_lead_en: field(row, "hero_lead_en", d.hero_lead_en),
    hero_lead_fr: field(row, "hero_lead_fr", d.hero_lead_fr),
    mission_kicker_en: field(row, "mission_kicker_en", d.mission_kicker_en),
    mission_kicker_fr: field(row, "mission_kicker_fr", d.mission_kicker_fr),
    mission_title_en: field(row, "mission_title_en", d.mission_title_en),
    mission_title_fr: field(row, "mission_title_fr", d.mission_title_fr),
    mission_body_en: field(row, "mission_body_en", d.mission_body_en),
    mission_body_fr: field(row, "mission_body_fr", d.mission_body_fr),
    purpose_kicker_en: field(row, "purpose_kicker_en", d.purpose_kicker_en),
    purpose_kicker_fr: field(row, "purpose_kicker_fr", d.purpose_kicker_fr),
    purpose_title_en: field(row, "purpose_title_en", d.purpose_title_en),
    purpose_title_fr: field(row, "purpose_title_fr", d.purpose_title_fr),
    purpose_lead_en: field(row, "purpose_lead_en", d.purpose_lead_en),
    purpose_lead_fr: field(row, "purpose_lead_fr", d.purpose_lead_fr),
    purpose_points: pointsRaw.map((item, i) => asPoint(item, d.purpose_points[i] ?? defaultPoint)),
    founders_kicker_en: field(row, "founders_kicker_en", d.founders_kicker_en),
    founders_kicker_fr: field(row, "founders_kicker_fr", d.founders_kicker_fr),
    founders_title_en: field(row, "founders_title_en", d.founders_title_en),
    founders_title_fr: field(row, "founders_title_fr", d.founders_title_fr),
    founders_lead_en: field(row, "founders_lead_en", d.founders_lead_en),
    founders_lead_fr: field(row, "founders_lead_fr", d.founders_lead_fr),
    founders: foundersRaw.map((item, i) => asPerson(item, d.founders[i] ?? defaultFounder)),
    blessing_kicker_en: field(row, "blessing_kicker_en", d.blessing_kicker_en),
    blessing_kicker_fr: field(row, "blessing_kicker_fr", d.blessing_kicker_fr),
    blessing_title_en: field(row, "blessing_title_en", d.blessing_title_en),
    blessing_title_fr: field(row, "blessing_title_fr", d.blessing_title_fr),
    blessing_name: field(row, "blessing_name", d.blessing_name),
    blessing_role_en: field(row, "blessing_role_en", d.blessing_role_en),
    blessing_role_fr: field(row, "blessing_role_fr", d.blessing_role_fr),
    blessing_date_en: field(row, "blessing_date_en", d.blessing_date_en),
    blessing_date_fr: field(row, "blessing_date_fr", d.blessing_date_fr),
    blessing_body_en: field(row, "blessing_body_en", d.blessing_body_en),
    blessing_body_fr: field(row, "blessing_body_fr", d.blessing_body_fr),
    blessing_photo_url: typeof blessingPhoto === "string" && blessingPhoto.trim() ? blessingPhoto : null,
    quote_en: field(row, "quote_en", d.quote_en),
    quote_fr: field(row, "quote_fr", d.quote_fr),
    figure_caption_en: field(row, "figure_caption_en", d.figure_caption_en),
    figure_caption_fr: field(row, "figure_caption_fr", d.figure_caption_fr),
    figure_url: typeof figureUrl === "string" && figureUrl.trim() ? figureUrl : null,
  };
}

function readLocal(): AboutContent | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    return parseAboutContent(JSON.parse(raw));
  } catch {
    return null;
  }
}

function writeLocal(content: AboutContent) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(content));
  } catch {
    /* storage full */
  }
}

export const aboutContentQuery = queryOptions({
  queryKey: ["site-settings", ABOUT_CONTENT_KEY],
  queryFn: async (): Promise<AboutContent> => {
    const local = readLocal();
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      return local ?? DEFAULT_ABOUT_CONTENT;
    }
    try {
      const result = await Promise.race([
        supabase.from("site_settings").select("value").eq("key", ABOUT_CONTENT_KEY).maybeSingle(),
        new Promise<{ data: null; error: { message: string } }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: { message: "timeout" } }), 2500),
        ),
      ]);
      if (result.error) {
        console.warn("about content settings", result.error.message);
        return local ?? DEFAULT_ABOUT_CONTENT;
      }
      if (!result.data?.value) return local ?? DEFAULT_ABOUT_CONTENT;
      const parsed = parseAboutContent(result.data.value);
      writeLocal(parsed);
      return parsed;
    } catch (err) {
      console.warn("about content settings", err);
      return local ?? DEFAULT_ABOUT_CONTENT;
    }
  },
  staleTime: 60_000,
  networkMode: "offlineFirst",
  retry: false,
});

export async function saveAboutContent(content: AboutContent) {
  const cleaned = parseAboutContent(content);
  writeLocal(cleaned);
  const { error } = await supabase.from("site_settings").upsert(
    {
      key: ABOUT_CONTENT_KEY,
      value: cleaned,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );
  if (error) throw error;
  return cleaned;
}
