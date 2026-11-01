export type LocalGalleryImage = {
  id: string;
  img: string;
  alt: string;
  title_en: string;
  title_fr: string;
};

export type LocalGallerySegment = {
  id: string;
  year: number | null;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  images: LocalGalleryImage[];
};

const SANC = "/assets/sanc-images";

/** Sanctuary photo filenames under public/assets/sanc-images. */
const SANC_FILES = [
  "IMG_1125.jpg",
  "IMG_1126.jpg",
  "IMG_1127.jpg",
  "IMG_1128.jpg",
  "IMG_1129.jpg",
  "IMG_1130.jpg",
  "IMG_1131.jpg",
  "IMG_1132.jpg",
  "IMG_1133.jpg",
  "IMG_1134.jpg",
  "IMG_1136.jpg",
  "IMG_1137.jpg",
  "IMG_1138.jpg",
  "IMG_1139.jpg",
  "IMG_1140.jpg",
  "IMG_1141.jpg",
  "IMG_1142.jpg",
  "IMG_1153.jpg",
  "IMG_1154.jpg",
  "IMG_1155.jpg",
  "IMG_1156.jpg",
  "IMG_1157.jpg",
  "IMG_1158.jpg",
  "IMG_1159.jpg",
  "IMG_1163.jpg",
  "IMG_1165.jpg",
  "IMG_1166.jpg",
  "IMG_1167.jpg",
  "IMG_1168.jpg",
  "IMG_1169.jpg",
  "IMG_1173.jpg",
  "IMG_1174.jpg",
  "IMG_1175.jpg",
  "IMG_1178.jpg",
  "IMG_1179.PNG",
  "IMG_1180.jpg",
  "IMG_1181.jpg",
  "IMG_1182.jpg",
  "IMG_1189.jpg",
  "IMG_1190.jpg",
  "IMG_1193.jpg",
  "IMG_1194.jpg",
  "IMG_1195.jpg",
  "IMG_1196.jpg",
  "IMG_1203.jpg",
  "IMG_1204.jpg",
  "IMG_1205.jpg",
  "IMG_1206.jpg",
  "IMG_1207.jpg",
  "IMG_1210.jpg",
  "IMG_1211.jpg",
  "IMG_1212.jpg",
  "IMG_1213.jpg",
  "IMG_1214.jpg",
  "IMG_1216.jpg",
  "IMG_1217.jpg",
  "IMG_1218.jpg",
  "IMG_1219.jpg",
  "IMG_1220.jpg",
  "IMG_1223.jpg",
  "IMG_1224.jpg",
  "IMG_1225.jpg",
  "IMG_1226.jpg",
  "IMG_1227.jpg",
  "IMG_1228.jpg",
  "IMG_1229.jpg",
  "IMG_1230.jpg",
  "IMG_1231.jpg",
  "IMG_1232.jpg",
  "IMG_1233.jpg",
  "IMG_1234.jpg",
  "IMG_1235.jpg",
  "IMG_1236.jpg",
  "IMG_1237.jpg",
  "IMG_1240.jpg",
  "IMG_1241.jpg",
  "IMG_1242.jpg",
  "IMG_1243.jpg",
  "IMG_1244.jpg",
  "IMG_1245.jpg",
  "IMG_1247.jpg",
  "IMG_1248.jpg",
  "IMG_1249.jpg",
  "IMG_1250.jpg",
  "IMG_1251.jpg",
  "IMG_1252.jpg",
] as const;

function sancImage(file: string, index: number): LocalGalleryImage {
  const n = String(index + 1).padStart(2, "0");
  return {
    id: `sanc-${file.replace(/\W+/g, "-").toLowerCase()}`,
    img: `${SANC}/${file}`,
    alt: `Sanctuary ${n}`,
    title_en: `Sanctuary ${n}`,
    title_fr: `Sanctuaire ${n}`,
  };
}

const ALL_SANC = SANC_FILES.map((file, i) => sancImage(file, i));

function sliceAlbum(
  id: string,
  title_en: string,
  title_fr: string,
  description_en: string,
  description_fr: string,
  start: number,
  end: number,
): LocalGallerySegment {
  return {
    id,
    year: null,
    title_en,
    title_fr,
    description_en,
    description_fr,
    images: ALL_SANC.slice(start, end),
  };
}

/** Built from public/assets/sanc-images — always available offline. */
export const LOCAL_GALLERY_SEGMENTS: LocalGallerySegment[] = [
  sliceAlbum(
    "grounds",
    "On the grounds",
    "Sur le domaine",
    "Paths, chapels and the green hills of the sanctuary.",
    "Sentiers, chapelles et collines vertes du sanctuaire.",
    0,
    29,
  ),
  sliceAlbum(
    "life",
    "Life of the house",
    "Vie de la maison",
    "Prayer, work and the ordinary day at Stillwater.",
    "Prière, travail et jour ordinaire à Stillwater.",
    29,
    58,
  ),
  sliceAlbum(
    "people",
    "Pilgrims and keepers",
    "Pèlerins et gardiens",
    "Faces and gatherings that keep the sanctuary alive.",
    "Visages et rassemblements qui font vivre le sanctuaire.",
    58,
    ALL_SANC.length,
  ),
];

/** First six sanctuary photos for the gallery hero reel. */
export const GALLERY_HERO_STATIONS = SANC_FILES.slice(0, 6).map((file, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `${SANC}/${file}`,
    alt: `Sanctuary ${n}`,
    title_en: `Seen at the sanctuary`,
    title_fr: `Vu au sanctuaire`,
    subtitle_en: n,
    subtitle_fr: n,
    focus: 0.42 + i * 0.04,
  };
});
